function BarcodeDisplay(params) {

    var canvas = document.createElement('canvas');
    var context2d = canvas.getContext('2d');
    params.parent.append($(canvas));

    var image_data = '';
    var image;
    var image_canvas;
    var image_context2d;    


    var cursor = {
        color: 'rgb(255,128,0)',
        position: false,

        set: function(x, y) {
            this.position = {
                x: x,
                y: y
            }
        },

        reset: function() {
            this.position = false;
        },

        render: function(ofs_left, scale) {
            if(!this.position) {
                return;
            }
            context2d.beginPath();
            context2d.strokeStyle = this.color;
            context2d.lineWidth = 1;
            context2d.rect(
                ofs_left + scale * this.position.x + 0.5, 
                scale * this.position.y + 0.5, 
                scale, 
                scale
            );
            context2d.stroke();
        }
    }


    var grid = {

        color: '#888',
        min_scale: 6,

        render: function(scale, ofs_left, w, h) {
            if(scale < this.min_scale) {
                return;
            }
            context2d.strokeStyle = this.color;
            context2d.lineWidth = 1;
            var lw = Math.floor(w / scale);
            for(var x=1; x<lw; x++) {
                var dx = ofs_left + x * scale + 0.5;
                context2d.beginPath();
                context2d.moveTo(dx , 0);
                context2d.lineTo(dx, h);
                context2d.stroke();            
            }
            var lh = Math.floor(h / scale);            
            for(var y=1; y<lh; y++) {
                var dy = y * scale + 0.5;
                context2d.beginPath();
                context2d.moveTo(ofs_left, dy);
                context2d.lineTo(ofs_left + w, dy);
                context2d.stroke();            
            }            
        }

    }

    


    function render() {
        if(!image) {
            return;
        }
        var w = canvas.width = Math.floor(params.parent.width());
        if(w == 0) {
            return;
        }
        if(w > image.width) {
            var scale = Math.floor(w / image.width);
        } else {
            var scale = 1;
        }
        var image_w = Math.floor(image.width * scale);
        var ofs_left = Math.floor(0.5 * (w - image_w));
        
        var h = canvas.height = image.height * scale;
        context2d.imageSmoothingEnabled = false;
        context2d.mozImageSmoothingEnabled = false;        

        context2d.clearRect(0, 0, w, h);        
        context2d.drawImage(image, ofs_left, 0, image_w, h);
        
        grid.render(scale, ofs_left, image_w, h)
        cursor.render(ofs_left, scale);
    }




    function loadImage(data, callback) {
        if(image_data === data) {
            return;
        }
        image_data = data;
        cursor.reset();
        if(!image_canvas) {
            image_canvas = document.createElement('canvas');
            image_context2d = image_canvas.getContext('2d');        
        }
        image = new Image();
        image.onload = function() {
            image_context2d.drawImage(image, 0, 0);
            render();
            callback && callback();
        }
        image.src = data;
    }
    

    return {

        resize: render,

        loadImage: loadImage,

        getSize: function() {
            return {
                width: image ? image.width : 0,
                height: image ? image.height : 0
            }
        },

        getPixelLuminosity: function(x, y) {
            cursor.set(x, y);
            render();
            var d = image_context2d.getImageData(x, y, 1, 1).data;
            // ITU BT.601
            return Math.floor(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
        },

        resetCursor: function() {
            cursor.reset();
            render();
        }

    }    
}




function UserDisplay(params) {

    var ready = false;
    var pixels;
    var canvas, context2d;
    var size = params.size || null;

    function init() {
        var canvas = document.createElement('canvas');
        var context2d = canvas.getContext('2d');
        params.parent.append($(canvas));
        ready = true;
    }

    function clear() {
        pixels = context2d.getImageData(0, 0, params.width, params.height);;
    }

    function render() {
        if(!canvas) {
            return;
        }
        var w = canvas.width = Math.floor(params.parent.width());
        if(w == 0) {
            return;
        }
        context2d.imageSmoothingEnabled = false;
        context2d.mozImageSmoothingEnabled = false;        

        var scale = w > image.width ? Math.floor(w / image.width) : 1;
        var ofs_left = Math.floor(0.5 * (w - image_w));
        var h = canvas.height = params.height * scale;

        var i=0;
        for(var x=0; x<params.width; x++) {
            for(var y=0; y<params.width; y++) {
                fillRect(
                    ofs_left + x * scale,
                    y * scale,
                    scale,
                    scale
                );
            }
        }
    }    


    return {

        clear: function() {
            if(ready) {
                reset();
                render();
            }
        },

        setPixelLuminosity: function(x, y, v) {
            if(!ready) {
                init();
                ready = true;
            }
            pixels[y * params.width + x] = Math.max(0, Math.min(v, 255));
            render();
        },

        setSize: function(new_size) {
            size = new_size;
        }
    }
}