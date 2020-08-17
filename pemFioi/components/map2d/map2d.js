function Map2D(params) {


    var defaults = {
        width: false,
        height: false,
        zoom: -2,
        max_zoom: 2,
        min_zoom: -2
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
            y: 0
        }
        
       

        function refresh() {
            bounds.resized = prev_zoom !== zoom;
            if(bounds.resized) {
                var scale = Math.pow(2, zoom);
                bounds.width = size.width * scale;
                bounds.height = size.height * scale;
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
            changeZoom(1);
        });
        var zoom_out = createElement('div', 'button', '-')
        zoom_out.addEventListener('click', function(e) {
            e.stopPropagation();
            changeZoom(-1);
        });
        wrapper.appendChild(
            createElement('div', 'zoom', [zoom_in, zoom_out])
        );
        
        refresh();


        return {

            refresh: refresh,

            getBounds: function() {
                return bounds;
            },

            move: function(position) {
                bounds.x = position.x;
                bounds.y = position.y;
                refresh();
            }
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




    // Drawing editor layer
    function Editor() {
        var canvas = createElement('canvas', 'editor');
        wrapper.appendChild(canvas);
        var context2d = canvas.getContext('2d');

        function draw() {
            return;
            context2d.beginPath();
            context2d.strokeStyle = '#F00';
            context2d.lineWidth = 2;
            context2d.moveTo(0, 0);
            context2d.lineTo(1000, 1000);        
            context2d.stroke();        
        }


        function setBounds(bounds) {
            if(bounds.resized) {
                canvas.width = bounds.width;
                canvas.height = bounds.height;
                canvas.style.width = bounds.width + 'px';
                canvas.style.height = bounds.height + 'px';
            }
            canvas.style.left =  (-bounds.x) + 'px';
            canvas.style.top = (-bounds.y) + 'px';
        }


        return {
            setBounds: setBounds,

            destroy: function() {
                wrapper.removeChild(canvas);
            }
        }
    }



    //
    function Toolbar() {
        var elements = {
            point: createElement('div', 'button', 'Point'),
            line: createElement('div', 'button', 'Line'),
            area: createElement('div', 'button', 'Area'),
            undo: createElement('div', 'button', 'Undo'),
            redo: createElement('div', 'button', 'Redo')
        }

        wrapper.appendChild(
            createElement('div', 'toolbar', [
                createElement('div', 'group', [
                    elements.point,
                    elements.line,
                    elements.area
                ]),
                createElement('div', 'group', [
                    elements.undo,
                    elements.redo
                ])
            ])
        )
    }





    function onResize() {
        var width = params.width ? params.width : params.parent.clientWidth;
        var height = params.height ? params.height : params.parent.clientHeight;        
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        viewport && viewport.refresh();
    }
    

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
    loadImage(params.url, function(image) {
        onResize();
        if(!params.width && !params.height) {
            window.addEventListener('resize', onResize, false);
        }                
        map = Map(image);
        editor = Editor();
        viewport = Viewport({
            width: image.width,
            height: image.height
        }, function(bounds) {
            map.setBounds(bounds);
            editor.setBounds(bounds);
        })
        toolbar = Toolbar();
        onResize();


        var drag_start = false;
        wrapper.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var bounds = viewport.getBounds();
            drag_start = {
                x: bounds.x + event.clientX,
                y: bounds.y + event.clientY
            }
        });

        wrapper.addEventListener('mousemove', function(e) {
            if(!drag_start) {
                return;
            }
            viewport.move({
                x: drag_start.x - event.clientX,
                y: drag_start.y - event.clientY
            })
        });

        wrapper.addEventListener('mouseup', function(e) {
            drag_start = false;
        });

        wrapper.addEventListener('mouseleave', function(e) {
            drag_start = false;
        });        
        

        loaded = true;
    })


    return {
        destroy: function() {
            if(loaded) {
                map.destroy();
                editor.destroy();
                viport.destroy();
            }
            if(!params.width && !params.height) {
                window.removeEventListener('resize', onResize);
            }            
        }
    }

}