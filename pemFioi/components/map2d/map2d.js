function Map2D(params) {


    var defaults = {
        width: false,
        height: false,
        zoom: -1,
        max_zoom: 4,
        min_zoom: -2
    }
    params = Object.assign({}, defaults, params);


    var wrapper = document.createElement('div');
    wrapper.className = 'map2d';
    params.parent.appendChild(wrapper);



    function Map(image) {

        var zoom = params.zoom;
        
        var original_size = {
            width: image.width,
            height: image.height
        }


        function refresh(rescale) {
            var scale = Math.pow(2, zoom);
            var width = Math.round(original_size.width * scale);
            var height = Math.round(original_size.height * scale);            
            if(rescale) {
                image.style.width = width + 'px';
                image.style.height = height + 'px';            
            }
            var max_x = width - wrapper.clientWidth;
            position.x = Math.min(max_x, position.x);
            position.x = Math.max(0, position.x);

            var max_y = height - wrapper.clientHeight;
            position.y = Math.min(max_y, position.y);
            position.y = Math.max(0, position.y);            

            image.style.left =  (-position.x) + 'px';
            image.style.top = (-position.y) + 'px';
        }



        function setZoom(new_zoom) {
            new_zoom = Math.max(new_zoom, params.min_zoom);
            new_zoom = Math.min(new_zoom, params.max_zoom);
            var hw = wrapper.clientWidth * 0.5;
            var hh = wrapper.clientHeight * 0.5;
            var scale = Math.pow(2, zoom);
            var k = Math.pow(2, new_zoom) / Math.pow(2, zoom);
            position.x = (position.x + hw) * k - hw;
            position.y = (position.y + hh) * k - hh;
            zoom = new_zoom;
            refresh(true);
        }

        
        // zoom controls
        var controls = document.createElement('div');
        controls.className = 'zoom';
        var zoom_in = document.createElement('div')
        zoom_in.innerHTML = '+';
        zoom_in.className = 'button';
        zoom_in.addEventListener('click', function(e) {
            e.stopPropagation();
            setZoom(zoom + 1);
        });
        controls.appendChild(zoom_in);
        var zoom_out = document.createElement('div')
        zoom_out.innerHTML = '-';
        zoom_out.className = 'button';
        zoom_out.addEventListener('click', function(e) {
            e.stopPropagation();
            setZoom(zoom - 1);
        });
        controls.appendChild(zoom_out);        
        wrapper.appendChild(controls);

        var position = {
            x: (image.width - wrapper.clientWidth) * 0.5,
            y: (image.height - wrapper.clientHeight) * 0.5
        }
        image.className = 'map';
        wrapper.appendChild(image);
        refresh(true);


        return {
            destroy: function() {
                wrapper.removeChild(image);
                delete image;
            },

            refresh: refresh,

            getPosition: function() {
                return position;
            },

            setPosition: function(new_position) {
                position = new_position;
                refresh();
            }
        }
    }



    function onResize() {
        var width = params.width ? params.width : params.parent.clientWidth;
        var height = params.height ? params.height : params.parent.clientHeight;        
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        map && map.refresh(true);
    }
    

    function loadImage(src, callback) {
        var image = new Image();
        image.onload = function() {
            callback(image);
        }
        image.src = src;
    }

    
    var map;
    loadImage(params.url, function(image) {
        onResize();
        if(!params.width && !params.height) {
            window.addEventListener('resize', onResize, false);
        }                
        map = Map(image);

        var drag_start = false;
        wrapper.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var map_pos = map.getPosition();
            drag_start = {
                x: map_pos.x + event.clientX,
                y: map_pos.y + event.clientY
            }
        });

        wrapper.addEventListener('mousemove', function(e) {
            if(!drag_start) {
                return;
            }
            map.setPosition({
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
        

    })


    return {
        destroy: function() {
            map && map.destroy();
            if(!params.width && !params.height) {
                window.removeEventListener('resize', onResize);
            }            
        }
    }

}