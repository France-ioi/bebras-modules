function BarcodeDisplay(params) {

    var canvas = document.createElement('canvas');
    var context2d = canvas.getContext('2d');
    params.parent.append($(canvas));

    var image_data = '';
    var image;
    var image_loaded;
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
            context2d.lineWidth = scale > 20 ? 2 : 1;
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




    function init(data, callback) {
        if(image_data === data) {
            return;
        }
        image = false;
        image_loaded = false;
        image_data = data;
        cursor.reset();
        if(!image_canvas) {
            image_canvas = document.createElement('canvas');
            image_context2d = image_canvas.getContext('2d');        
        }
        loadImage(callback);
    }


    function loadImage(callback) {
        if(image_loaded) {
            callback && callback();
        }
        image = new Image();
        image.onload = function() {
            image_context2d.drawImage(image, 0, 0);
            render();
            image_loaded = true;
            callback && callback();
        }
        image.src = image_data;        
    }

    

    return {

        init: init,        

        render: render,

        getSize: function(callback) {
            loadImage(function() {
                callback({
                    width: image ? image.width : 0,
                    height: image ? image.height : 0
                })
            });
        },

        getPixelLuminosity: function(x, y, callback) {
            loadImage(function() {
                cursor.set(x, y);
                render();
                var d = image_context2d.getImageData(x, y, 1, 1).data;
                // ITU BT.601
                callback(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
            })
        },

        resetCursor: function() {
            cursor.reset();
            render();
        }

    }    
}




function UserDisplay(params) {

    var pixels = [];
    var canvas, context2d;
    var ready = false;
    var data_size;
    var viewport_size;


    function init() {
        if(ready) {
            return;
        }
        ready = true;
        canvas = document.createElement('canvas');
        context2d = canvas.getContext('2d');
        params.parent.append($(canvas));
    }


    var grid = {

        color: '#888',
        min_pixel_size: 6,

        render: function(ofs_left, w, h, pixel_size) {
            if(pixel_size < this.min_pixel_size) {
                return;
            }
            context2d.strokeStyle = this.color;
            context2d.lineWidth = 1;
            for(var x=1; x<w; x++) {
                var dx = ofs_left + x * pixel_size + 0.5;
                context2d.beginPath();
                context2d.moveTo(dx , 0);
                context2d.lineTo(dx, h * pixel_size);
                context2d.stroke();            
            }
            for(var y=1; y<h; y++) {
                var dy = y * pixel_size + 0.5;
                context2d.beginPath();
                context2d.moveTo(ofs_left, dy);
                context2d.lineTo(ofs_left + w * pixel_size, dy);
                context2d.stroke();            
            }            
        }

    }


    function render(valid_data) {
        if(!ready || !pixels) {
            return;
        }
        var w = canvas.width = Math.floor(params.parent.width());
        if(w == 0) {
            return;
        }
        context2d.imageSmoothingEnabled = false;
        context2d.mozImageSmoothingEnabled = false;        

        var scale = w > viewport_size.width ? Math.floor(w / viewport_size.width) : 1;
        var ofs_left = Math.floor(0.5 * (w - viewport_size.width * scale));
        var h = canvas.height = viewport_size.height * scale;
        context2d.clearRect(0, 0, w, h);        

        var pixel_size = viewport_size.width * scale / data_size.width;
        var i=0;
        for(var y=0; y<viewport_size.height; y++) {
            for(var x=0; x<viewport_size.width; x++) {
                if(pixels[i] != 255) {
                    context2d.fillStyle = 'rgb(' + pixels[i] + ',' + pixels[i] + ',' + pixels[i] + ')';
                    context2d.fillRect(
                        ofs_left + x * pixel_size,
                        y * pixel_size,
                        pixel_size,
                        pixel_size
                    );
                }
                i++;
            }
        }

        grid.render(ofs_left, data_size.width, data_size.height, pixel_size);

        if(valid_data) {
            var valid = true;
            var i=0;
            for(var y=0; y<viewport_size.height; y++) {
                for(var x=0; x<viewport_size.width; x++) {
                    if(pixels[i] != valid_data[y][x]) {
                        valid = false;
                        context2d.beginPath();
                        context2d.strokeStyle = '#F00';
                        context2d.lineWidth = scale > 20 ? 2 : 1;
                        context2d.rect(
                            ofs_left + x * pixel_size,
                            y * pixel_size,
                            pixel_size,
                            pixel_size
                        );
                        context2d.stroke();                        
                    }
                    i++;
                }
            }
            return valid;
        }
    }    


    return {

        setPixelLuminosity: function(x, y, v) {
            init();
            var v = Math.max(0, Math.min(v, 255));
            pixels[y * data_size.width + x] = v;
            render();
        },

        setSize: function(new_data_size, new_viewport_size) {
            data_size = new_data_size;
            viewport_size = new_viewport_size;
            pixels = new Array(data_size.width * data_size.height).fill(255)
        },

        render: render,

        diff: function(valid_data) {
            return render(valid_data);
        }
    }
}



function StringDisplay(params) {

    this.data = [];
    this.element;
    this.wrapper;
    this.display = false;
    this.iTestCase = 0;    

    var self = this;    

    function init() {
        var el = params.parent.find('#barcode-result');
        if(el.length == 0) {
            self.element = $('<span>')
            self.wrapper = $('<div id="barcode-result"><span>' + params.strings.messages.result + '</span> </div>');
            self.wrapper.append(self.element)
            params.parent.append(self.wrapper);
        }
    }

    function render(html) {
        if(!self.display) {
            return;
        }
        init();
        self.wrapper.toggle(typeof html != 'undefined' && html != '');
        self.element.html(html);
    }


    return {

        setContextEnv: function(iTestCase, display) {
            self.iTestCase = iTestCase;
            self.display = display;
            render(self.data[self.iTestCase]);
        },
       
        setData: function(str) {
            str = '' + str;
            self.data[self.iTestCase] = str;
            render(str);
        },


        diff: function(valid_data) {
            var html = '';
            var valid = true;
            var data = self.data[self.iTestCase]
            var l = Math.max(valid_data.length, data.length);
            for(var i=0; i<l; i++) {
                if(valid_data[i] !== data[i]) {
                    valid = false;
                    if(data[i]) {
                        html += '<span style="background: red; color: #fff;">' + data[i] + '<span>';
                    }                    
                } else {
                    html += data[i];
                }
            }
            self.data[self.iTestCase] = html;
            render(html);
            return valid;
        }
    }

}