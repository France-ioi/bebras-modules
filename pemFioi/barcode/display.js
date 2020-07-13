DisplaysManager = {

    instances: {},

    get: function(name, iTestCase, display, parent, params) {
        var k = name + iTestCase;
        if(!this.instances[k]) {
            this.instances[k] = window[name](params);
        }
        this.instances[k].init(parent, display);
        return this.instances[k];
    }
}


function BarcodeDisplay(params) {

    var parent;
    var canvas;
    var context2d;

    function init(new_parent, new_display) {
        parent = new_parent;
        display = new_display;
        if(!display) {
            return;
        }
        canvas = $('<canvas>');
        parent.append(canvas);
        context2d = canvas[0].getContext('2d');
        cursor.reset();
        render();
    }

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
        if(!image || !display) {
            return;
        }
        var w = canvas[0].width = Math.floor(parent.width());
        var h = canvas[0].height = Math.floor(parent.height() * 0.5 - 10);
        if(w == 0) {
            return;
        }
        var scale = Math.min(Math.floor(w / image.width), Math.floor(h / image.height));
        var image_w = Math.floor(image.width * scale);
        var image_h = Math.floor(image.height * scale);
        var ofs_left = Math.floor(0.5 * (w - image_w));
        
        context2d.imageSmoothingEnabled = false;
        //context2d.mozImageSmoothingEnabled = false;        

        context2d.clearRect(0, 0, w, h);        
        context2d.drawImage(image, ofs_left, 0, image_w, image_h);
        
        grid.render(scale, ofs_left, image_w, image_h)
        cursor.render(ofs_left, scale);
    }




    function setImage(data, callback) {
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
            return callback && callback();
        }
        image = new Image();
        image.onload = function() {
            image_context2d.drawImage(image, 0, 0);
            image_loaded = true;            
            render();
            callback && callback();
        }
        image.src = image_data;        
    }


    
    
    return {

        init: init,

        setImage: setImage,        

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
                var l = 0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2];
                l = Math.round(l);
                callback(l);
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
    var data_size;
    var parent;


    function init(new_parent, new_display) {
        parent = new_parent;
        display = new_display;
        if(!display) {
            return;
        }
        canvas = $('<canvas>');
        parent.append(canvas);
        context2d = canvas[0].getContext('2d');
        render();
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


    function render(valid_result) {
        if(!pixels || w == 0 || !data_size) {
            return;
        }

        if(display) {
            context2d.imageSmoothingEnabled = false;
            //context2d.mozImageSmoothingEnabled = false;        

            var w = canvas[0].width = Math.floor(parent.width());
            var h = canvas[0].height = Math.floor(parent.height() * 0.5 - 10);
            if(w == 0) {
                return;
            }
            var scale = Math.min(Math.floor(w / data_size.width), Math.floor(h / data_size.height));        
            var ofs_left = Math.floor(0.5 * (w - data_size.width * scale));
            context2d.clearRect(0, 0, w, h);        

            var i=0;
            for(var y=0; y<data_size.height; y++) {
                for(var x=0; x<data_size.width; x++) {
                    if(pixels[i] != 255) {
                        context2d.fillStyle = 'rgb(' + pixels[i] + ',' + pixels[i] + ',' + pixels[i] + ')';
                        context2d.fillRect(
                            ofs_left + x * scale,
                            y * scale,
                            scale,
                            scale
                        );
                    }
                    i++;
                }
            }

            grid.render(ofs_left, data_size.width, data_size.height, scale);
        }

        if(valid_result && 'data' in valid_result) {
            var i=0;
            var threshold = valid_result.threshold || 0;
            for(var y=0; y<data_size.height; y++) {
                for(var x=0; x<data_size.width; x++) {
                    if(Math.abs(pixels[i] - valid_result.data[y][x]) > threshold) {
                        if(display) {
                            context2d.beginPath();
                            context2d.strokeStyle = '#F00';
                            context2d.lineWidth = scale > 20 ? 2 : 1;
                            context2d.rect(
                                ofs_left + x * scale,
                                y * scale,
                                scale,
                                scale
                            );
                            context2d.stroke();                        
                        }

                        var msg = params.strings.messages.mistake_pixel;
                        msg = msg.replace('%1', pixels[i]).replace('%2', valid_result.data[y][x]);
                        return {
                            success: false,
                            message: msg
                        }                        
                    }
                    i++;
                }
            }
            return {
                success: true,
                message: params.strings.messages.success
            }                        
        }
    }    





    return {

        init: init,        

        setPixelLuminosity: function(x, y, v) {
            var v = Math.max(0, Math.min(v, 255));
            pixels[y * data_size.width + x] = v;
            render();
        },

        setSize: function(new_data_size) {
            data_size = new_data_size;
            pixels = new Array(data_size.width * data_size.height).fill(255)
            render();
        },

        render: render,

        diff: function(valid_result) {
            return render(valid_result);
        }
    }
}



function StringDisplay(params) {

    var data = '';
    var diff = '';
    var element;
    var wrapper;
    var display;

    function init(parent, new_display) {
        display = new_display;
        data = '';
        if(!display) {
            return;
        }
        element = $('<span>')
        wrapper = $('<div><span>' + params.strings.messages.result + '</span> </div>');
        wrapper.append(element).hide();
        parent.append(wrapper);
    }


    function isEmpty() {
        return data == '';
    }


    function render(html) {
        if(!display) {
            return;
        }        
        wrapper.toggle(data != '');
        element.html(html);
    }


    return {

        init: init,        

        
        setData: function(str) {
            str = '' + str;
            data = str;
            render(str);
        },


        diff: function(valid_result) {
            diff = '';
            var valid = true;
            
            var l = Math.max(valid_result.data.length, data.length);
            for(var i=0; i<l; i++) {
                if(valid_result.data[i] !== data[i]) {
                    valid = false;
                    if(i < data.length) {
                        diff += '<span style="background: red; color: #fff;">' + data[i] + '</span>';
                    }                    
                } else {
                    diff += data[i];
                }
            }
            render(diff);
            return {
                success: valid,
                message: valid ? params.strings.messages.success : params.strings.messages.mistake_digit
            }
        }
    }

}