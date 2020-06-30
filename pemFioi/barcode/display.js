function BarcodeDisplay(params, callback) {

    var canvas = document.createElement('canvas');
    var context2d = canvas.getContext('2d');
    params.parent.append($(canvas));


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

        color: 'rgb(0,0,0)',
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
        context2d.clearRect(0, 0, w, h);
        context2d.imageSmoothingEnabled = false;
        context2d.mozImageSmoothingEnabled = false;        
        context2d.drawImage(image, ofs_left, 0, image_w, h);
        grid.render(scale, ofs_left, image_w, h)
        cursor.render(ofs_left, scale);
    }


    var api = {

        resize: render,

        width: function() {
            return image.width;
        },

        height: function() {
            return image.height;
        },

        getPixelLuminosity: function(x, y) {
            cursor.set(x, y);
            render();
            var d = image_context2d.getImageData(x, y, 1, 1).data;
            // ITU BT.601
            return Math.floor(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
        },

        setPixelLuminosity: function(x, y, v) {

        },


        resetCursor: function() {
            cursor.reset();
            render();
        }

    }    



    var image = new Image();
    var image_canvas = document.createElement('canvas');
    var image_context2d = image_canvas.getContext('2d');        
    image.style.display = 'none';
    image.onload = function() {
        render();
        image_context2d.drawImage(image, 0, 0);
        callback && callback(api);
    }
    image.src = params.image;
    
    return api;
}