function Map2D(params) {


    var defaults = {
        width: false,
        height: false,
        zoom: 0,
        max_zoom: 1,
        min_zoom: -2,
        styles: {
            point_radius: 6,
            line_width: 3,
            line_color: '#000000',
            pin_color: '#FFFFFF',
            area_color: '#FFFFFF66',
            selection_color: '#CC3333',
            text_color: '#FFFFFF',
            text_outline: '#000000',
            font: {
                size: 14,
                face: 'sans'
            }
        },
        strings: {
            point: 'Point',
            line: 'Line',
            area: 'Area',
            delete: 'Delete',
            undo: 'Undo',
            redo: 'Redo',
            type: 'Type',
            name: 'Name',
            save: 'Save'
        }
    }
    params = Object.assign({}, defaults, params);


    // system
    function createElement(tag, className, content) {
        var el = document.createElement(tag);
        el.className = className;
        if(typeof content === 'string') {
            el.innerHTML = content;
        } else if(Array.isArray(content)) {
            for(var i=0; i<content.length; i++) {
                el.appendChild(content[i]);
            }
        }
        return el;
    }


    var wrapper = createElement('div', 'map2d');
    params.parent.appendChild(wrapper);



    // Viewport 
    function Viewport(size, callback) {

        var zoom = params.zoom;
        var prev_zoom = null;

        var bounds = {
            width: size.width,
            height: size.height,
            x: 0,
            y: 0,
            scale: 1
        }
        
       

        function refresh() {
            bounds.resized = prev_zoom !== zoom;
            if(bounds.resized) {
                bounds.scale = Math.pow(2, zoom);
                bounds.width = size.width * bounds.scale;
                bounds.height = size.height * bounds.scale;
                bounds.resized = true;
                prev_zoom = zoom;                
            }

            if(bounds.width < wrapper.clientWidth) {
                bounds.x = (bounds.width - wrapper.clientWidth) * 0.5;
            } else {
                var max_x = bounds.width - wrapper.clientWidth;
                bounds.x = Math.min(max_x, bounds.x);
                bounds.x = Math.max(0, bounds.x);
            }

            if(bounds.height < wrapper.clientHeight) {
                bounds.y = (bounds.height - wrapper.clientHeight) * 0.5;
            } else {
                var max_y = bounds.height - wrapper.clientHeight;
                bounds.y = Math.min(max_y, bounds.y);
                bounds.y = Math.max(0, bounds.y);            
            }

            zoom_in.className = zoom == params.max_zoom ? 'button button-disabled' : 'button';
            zoom_out.className = zoom == params.min_zoom ? 'button button-disabled' : 'button';            
            callback(bounds);
        }



        function changeZoom(ofs) {
            var new_zoom = zoom + ofs;
            new_zoom = Math.max(new_zoom, params.min_zoom);
            new_zoom = Math.min(new_zoom, params.max_zoom);
            var hw = wrapper.clientWidth * 0.5;
            var hh = wrapper.clientHeight * 0.5;
            var scale = Math.pow(2, zoom);
            var k = Math.pow(2, new_zoom) / Math.pow(2, zoom);
            bounds.x = (bounds.x + hw) * k - hw;
            bounds.y = (bounds.y + hh) * k - hh;
            zoom = new_zoom;
            refresh();
        }

        
        // zoom controls
        var zoom_in = createElement('div', 'button', '+');
        zoom_in.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeZoom(1);
        });
        var zoom_out = createElement('div', 'button', '-')
        zoom_out.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            changeZoom(-1);
        });
        wrapper.appendChild(
            createElement('div', 'zoom', [zoom_in, zoom_out])
        );
        
        refresh();



        var drag;

        function startDrag(point) {
            drag = {
                x: bounds.x + point.x,
                y: bounds.y + point.y
            }
            return true;
        }

        function handleDrag(point) {
            bounds.x = drag.x - point.x;
            bounds.y = drag.y - point.y;
            refresh();
        }

        function stopDrag() {}


        return {
            refresh: refresh,
            
            startDrag: startDrag,
            handleDrag: handleDrag,
            stopDrag: stopDrag
        }
    }




    // Map layer
    function Map(image) {

        var old_bounds;

        function setBounds(bounds) {
            if(bounds.resized) {
                image.style.width = bounds.width + 'px';
                image.style.height = bounds.height + 'px';            
            }
            image.style.left =  (-bounds.x) + 'px';
            image.style.top = (-bounds.y) + 'px';
        }

        image.className = 'map';
        wrapper.appendChild(image);


        return {
            destroy: function() {
                wrapper.removeChild(image);
                delete image;
            },

            setBounds: setBounds
        }
    }


    // Editor toolbar
    function Toolbar(handlers) {
        var buttons = {
            point: createElement('div', 'button', params.strings.point),
            line: createElement('div', 'button', params.strings.line),
            area: createElement('div', 'button', params.strings.area),
            delete: createElement('div', 'button', params.strings.delete),
            undo: createElement('div', 'button', params.strings.undo),
            redo: createElement('div', 'button', params.strings.redo)
        }

        var holder = createElement('div', 'toolbar', [
            createElement('div', 'group', [
                buttons.point,
                buttons.line,
                buttons.area
            ]),
            createElement('div', 'group', [
                buttons.delete,
                buttons.undo,
                buttons.redo
            ])
        ]);
        wrapper.appendChild(holder);

        function selectButton(name) {
            var names = ['point', 'line', 'area'];
            for(var i=0; i < names.length; i++) {        
                buttons[names[i]].className = names[i] === name ? 'button button-selected' : 'button';
            }                
        }

        function disableButton(name, diabled) {
            buttons[name].className = diabled ? 'button button-disabled' : 'button';
        }

        var type;
        function setType(new_type) {
            if(new_type !== type) {
                type = new_type;
            }
            selectButton(type);
            handlers.onTypeChange(type);            
        }


        var commands = {
            point: function() {
                setType('point');
            },
            line: function() {
                setType('line');
            },
            area: function() {
                setType('area');
            },
            delete: handlers.onDelete,
            undo: handlers.onUndo,
            redo: handlers.onRedo
        }

        for(var name in commands) {
            buttons[name].addEventListener('click', (function(name) {
                return function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    commands[name]();
                }
            })(name));
        }

        return {
            selectButton: selectButton,

            disableButton: disableButton,

            destroy: function() {
                wrapper.removeChild(holder);
            }
        }
    }



    function State(default_state) {

        var states = [];
        var pointer = 0;


        function read(new_pointer) {
            pointer = new_pointer;
            return JSON.parse(states[pointer]);
        }

        function write(data) {
            states.push(JSON.stringify(data));
            pointer = states.length - 1;
        }

        write(default_state);

        return {
            get: function() {
                return read(pointer);
            },

            push: function(data) {
                if(pointer < states.length - 1) {
                    states = states.slice(0, pointer + 1);
                }
                write(data);
            },

            undo: function() {
                return read(pointer - 1);
            },

            redo: function() {
                return read(pointer + 1);
            },

            getCapabilities: function() {
                return {
                    undo: pointer > 0,
                    redo: pointer !== null && pointer < states.length - 1
                }
            }
        }
    }


    // Drawing editor layer
    function Editor(image) {

        var canvas = createElement('canvas', 'editor');
        wrapper.appendChild(canvas);
        var context2d = canvas.getContext('2d');
        var bounds;
        var state = State({
            pointer: null,
            type: null,
            figures: params.figures || []
        });
        var data = state.get();

        function saveState() {
            state.push(data);
            refreshToolbar();
        }


        function drawPoint(point) {
            context2d.beginPath();
            if(selection && isSamePoint(point, selection.point)) {
                context2d.fillStyle = params.styles.selection_color;            
            } else {
                context2d.fillStyle = params.styles.pin_color;            
            }
            context2d.arc(point.x, point.y, params.styles.point_radius / bounds.scale, 0, 2 * Math.PI);
            context2d.stroke();
            context2d.fill();  
        }


        function drawFigureName(figure) {
            var text_height = params.styles.font.size / bounds.scale;
            var dx, dy;
            if(figure.type == 'point' || figure.points.length < 2) {
                dx = 0;
                dy = text_height;
                context2d.textAlign = 'center';
                context2d.textBaseline = 'top';
            } else {
                if(figure.points[1].y > figure.points[0].y) {
                    context2d.textBaseline = 'bottom';
                    dy = -params.styles.line_width / bounds.scale;
                } else {
                    dy = params.styles.line_width / bounds.scale;
                    context2d.textBaseline = 'top';
                }
                if(figure.points[1].x > figure.points[0].x) {
                    context2d.textAlign = 'right';
                    dx = -text_height;
                } else {
                    context2d.textAlign = 'left';
                    dx = text_height;                    
                }
            }
            context2d.strokeStyle = params.styles.text_outline;
            context2d.strokeText(figure.name, figure.points[0].x + dx, figure.points[0].y + dy);
            context2d.fillStyle = params.styles.text_color;
            context2d.fillText(figure.name, figure.points[0].x + dx, figure.points[0].y + dy);            
        }


        var shapes = {

            point: function(points) {
                drawPoint(points[0]);
            },

            line: function(points) {
                context2d.beginPath();
                context2d.moveTo(points[0].x, points[0].y);
                for(var i=1; i<points.length; i++) {
                    context2d.lineTo(points[i].x, points[i].y);        
                }
                context2d.stroke();
                for(var i=0; i<points.length; i++) {
                    drawPoint(points[i]);
                }
            },

            area: function(points) {
                context2d.beginPath();
                context2d.fillStyle = params.styles.area_color;                            
                context2d.moveTo(points[0].x, points[0].y);
                for(var i=1; i<points.length; i++) {
                    context2d.lineTo(points[i].x, points[i].y);        
                }
                context2d.closePath();
                context2d.stroke();
                context2d.fill();
                for(var i=0; i<points.length; i++) {
                    drawPoint(points[i]);
                }                
            }

        }



        function draw() {
            if(!bounds) {
                return;
            }
            context2d.setTransform(1, 0, 0, 1, 0, 0);                
            context2d.clearRect(0, 0, bounds.width, bounds.height);
            context2d.setTransform(bounds.scale, 0, 0, bounds.scale, 0, 0);                
            context2d.font = 'bold ' + Math.round(params.styles.font.size / bounds.scale) + 'px ' + params.styles.font.face;
            context2d.strokeStyle = params.styles.line_color;
            context2d.lineWidth = params.styles.line_width / bounds.scale;
            for(var i=0; i<data.figures.length; i++) {
                shapes[data.figures[i].type](data.figures[i].points);
                drawFigureName(data.figures[i]);
            }
        }


        function setBounds(new_bounds) {
            bounds = new_bounds;
            if(bounds.resized) {
                canvas.width = bounds.width;
                canvas.height = bounds.height;
                canvas.style.width = bounds.width + 'px';
                canvas.style.height = bounds.height + 'px';
                draw();                
            }
            canvas.style.left =  (-bounds.x) + 'px';
            canvas.style.top = (-bounds.y) + 'px';
        }


        function isSamePoint(point1, point2) {
            var d = params.styles.point_radius / bounds.scale;
            return Math.abs(point1.x - point2.x) <= d && Math.abs(point1.y - point2.y) <= d;
        }




        function openFigure(point) {
            selection = false;
            data.figures.push({
                type: data.type,
                points: [point]
            });          
            if(data.type != 'point') {
                data.pointer = data.figures.length - 1;
            }
            saveState();
        }

        function modifyFigure(point) {
            selection = false;
            for(var i=0; i<data.figures[data.pointer].points.length; i++) {
                if(isSamePoint(point, data.figures[data.pointer].points[i])) {
                    closeFigure();
                    return;
                }
            }
            data.figures[data.pointer].points.push(point);
            saveState();
        }

        function closeFigure() {
            selection = false;
            if(data.pointer === null) {
                return;
            }
            switch(data.figures[data.pointer].type) {
                case 'line':
                    if(data.figures[data.pointer].points.length < 2) {
                        data.figures.splice(data.pointer, 1);
                    }
                    break;
                case 'area':
                    if(data.figures[data.pointer].points.length < 3) {
                        data.figures.splice(data.pointer, 1);
                    }
                    break;
            }
            data.pointer = null;
            saveState();
            draw();
        }


        var toolbar = Toolbar({
            onTypeChange: function(new_type) {
                closeFigure();
                data.type = new_type;
            },
            onDelete: function() {
                if(selection) {
                    data.figures[selection.figure_idx].points.splice(selection.point_idx, 1);
                    if(!data.figures[selection.figure_idx].points.length) {
                        data.figures.splice(selection.figure_idx, 1);
                    }
                    selection = false;
                    saveState();
                    draw();
                }
            },
            onRedo: function() {
                if(state.getCapabilities().redo) {
                    data = state.redo();
                    refreshToolbar();
                    draw();
                }
            },
            onUndo: function() {
                if(state.getCapabilities().undo) {
                    data = state.undo();
                    refreshToolbar();
                    draw();
                }
            }
        });

        function refreshToolbar() {
            var caps = state.getCapabilities();
            toolbar.disableButton('undo', !caps.undo);
            toolbar.disableButton('redo', !caps.redo);
            toolbar.disableButton('delete', !selection);
            toolbar.selectButton(data.type);
        }


        function findFigure(point) {
            for(var i=0; i<data.figures.length; i++) {
                for(var j=0; j<data.figures[i].points.length; j++) {
                    if(isSamePoint(data.figures[i].points[j], point)) {
                        return {
                            figure_idx: i,
                            point_idx: j,
                            point: data.figures[i].points[j]
                        }
                    }
                }
            }
            return false;
        }


        function normalizePoint(point) {
            return {
                x: (point.x + bounds.x) / bounds.scale,
                y: (point.y + bounds.y) / bounds.scale
            }
        }


        var selection;

        function handleClick(point) {
            point = normalizePoint(point);
            if(point.x < 0 || point.x > image.width || point.y < 0 || point.y > image.height) {
                return;
            }

            selection = findFigure(point);
            if(selection) {
                refreshToolbar();
                // TODO show type and name inputs
            } else {
                if(data.type === null) {
                    return;
                }

                if(data.pointer === null) {
                    openFigure(point);
                } else {
                    modifyFigure(point);
                }
            }
            draw();
        }        


        var drag;

        function startDrag(point) {
            point = normalizePoint(point);
            drag = {
                figure: findFigure(point),
                mouse: point
            }
            return !!drag.figure;
        }

        function handleDrag(point) {
            selection = false;            
            point = normalizePoint(point);
            data.figures[drag.figure.figure_idx].points[drag.figure.point_idx] = {
                x: drag.figure.point.x - drag.mouse.x + point.x,
                y: drag.figure.point.y - drag.mouse.y + point.y
            }
            draw();
        }


        function stopDrag() {
            drag = false;
            saveState();
        }


        refreshToolbar();

        return {
            setBounds: setBounds,

            handleClick: handleClick,

            startDrag: startDrag,
            handleDrag: handleDrag,
            stopDrag: stopDrag,

            destroy: function() {
                toolbar.destroy();
                wrapper.removeChild(canvas);
            }
        }
    }





    function MouseEventsHandler() {

        var mouse_moved = false;

        function getRelativePoint(e) {
            var rect = wrapper.getBoundingClientRect();            
            return {
                x: e.clientX - rect.x,
                y: e.clientY - rect.y
            }            
        }

        var drag_handler;

        wrapper.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            e.preventDefault();

            var point = getRelativePoint(e);
            if(editor.startDrag(point)) {
                drag_handler = editor;
            } else if(viewport.startDrag(point)) {
                drag_handler = viewport;
            }
            mouse_moved = false;
        });

        wrapper.addEventListener('mousemove', function(e) {
            mouse_moved = true;
            if(drag_handler) {
                var point = getRelativePoint(e);            
                drag_handler.handleDrag(point);
            }
        });


        wrapper.addEventListener('mouseup', function(e) {
            if(mouse_moved && drag_handler) {
                drag_handler.stopDrag();
            }
            drag_handler = false;
        });

        wrapper.addEventListener('mouseleave', function(e) {
            if(mouse_moved && drag_handler) {
                drag_handler.stopDrag();
            }
            drag_handler = false;
        });        

        wrapper.addEventListener('click', function(e) {
            if(!mouse_moved) {
                editor.handleClick(getRelativePoint(e));
            }
        });        

    }



    function onResize() {
        var width = params.width ? params.width : params.parent.clientWidth;
        var height = params.height ? params.height : params.parent.clientHeight;        
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        viewport && viewport.refresh();
    }
    

    // main 

    function loadImage(src, callback) {
        var image = new Image();
        image.onload = function() {
            callback(image);
        }
        image.src = src;
    }

    var loaded = false;
    var viewport;
    var map;
    var editor;
    var mouse_events;

    loadImage(params.url, function(image) {
        onResize();
        if(!params.width && !params.height) {
            window.addEventListener('resize', onResize, false);
        }                
        map = Map(image);
        editor = Editor(image);
        viewport = Viewport({
            width: image.width,
            height: image.height
        }, function(bounds) {
            map.setBounds(bounds);
            editor.setBounds(bounds);
        })
        mouse_events = MouseEventsHandler();        
        onResize();
        loaded = true;
    })


    return {
        destroy: function() {
            if(loaded) {
                map.destroy();
                editor.destroy();
                viewport.destroy();
            }
            if(!params.width && !params.height) {
                window.removeEventListener('resize', onResize);
            }            
        }
    }

}