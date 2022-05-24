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


function ContextCursor(params) {

    var defaults = {
        color: 'rgb(255,128,0)'
    }
    params = Object.assign({}, defaults, params);

    this.position = false;

    this.set = function(x, y) {
        this.position = {
            x: x,
            y: y
        }
    }

    this.get = function() {
        return this.position ? {x: this.position.x, y: this.position.y} : null;
    }

    this.reset = function() {
        this.position = false;
    }

    this.render = function(ofs_left, scale) {
        if(!this.position || !params.context2d) {
            return;
        }
        params.context2d.beginPath();
        params.context2d.strokeStyle = params.color;
        params.context2d.lineWidth = scale > 5 ? 3 : 1;
        params.context2d.rect(
            ofs_left + scale * this.position.x + 0.5,
            scale * this.position.y + 0.5,
            scale,
            scale
        );
        params.context2d.stroke();
    }
}



function ContextGrid(params) {

    var defaults = {
        color: '#888',
        min_scale: 6
    }
    params = Object.assign({}, defaults, params);

    this.render = function(ofs_left, scale, cols, rows) {
        if(scale < params.min_scale) {
            return;
        }
        params.context2d.strokeStyle = params.color;
        params.context2d.lineWidth = 1;
        for(var x=1; x<cols; x++) {
            var dx = ofs_left + x * scale + 0.5;
            params.context2d.beginPath();
            params.context2d.moveTo(dx , 0);
            params.context2d.lineTo(dx, rows * scale);
            params.context2d.stroke();
        }
        for(var y=1; y<rows; y++) {
            var dy = y * scale + 0.5;
            params.context2d.beginPath();
            params.context2d.moveTo(ofs_left, dy);
            params.context2d.lineTo(ofs_left + cols * scale, dy);
            params.context2d.stroke();
        }
    }
}



function CanvasTooltip(params) {

    this.element = null;
    this.bounds = null;

    this.render = function() {
        if(this.element) {
            return;
        }
        this.element = $('<div>')
            .css('position', 'fixed')
            .css('z-index', '10000')
            .css('background', '#4A90E2')
            .css('color', '#FFF')
            .css('padding', '10px')
            .css('border-radius', '5px');
        $(document.body).append(this.element);
    }

    this.setBounds = function(ofs_left, scale, cols, rows) {
        this.bounds = {
            ofs_left: ofs_left,
            scale: scale,
            cols: cols,
            rows: rows
        }
    }


    this.show = function(e) {
        if(!this.bounds) {
            return;
        }
        var canvas_offset = params.canvas.offset();
        var x = e.pageX - canvas_offset.left - this.bounds.ofs_left;
        var y = e.pageY - canvas_offset.top;
        if(x < 0 || x > this.bounds.cols * this.bounds.scale) {
            this.hide();
            return;
        }
        var col = Math.floor(x / this.bounds.scale);
        if(isNaN(col)) {
            return;
        }
        var row = Math.floor(y / this.bounds.scale);
        if(isNaN(row)) {
            return;
        }        
        var luminocity = params.getPixelLuminosity(col, row);

        this.render();
        this.element.show();
        this.element.css({
            left: e.pageX + 10,
            top: e.pageY + 10
        });
        var str = params.strings.messages.tooltip;
        str = str.replace('%1', col).replace('%2', row).replace('%3', luminocity);
        this.element.text(str);
    }


    this.hide = function() {
        this.element && this.element.hide();
    }

    params.canvas.mouseleave(this.hide.bind(this));
    params.canvas.mousemove(this.show.bind(this));
}




function BarcodeDisplay(params) {

    var parent;
    var canvas;
    var context2d;
    var cursor;
    var grid;
    var tooltip;
    var display;

    function init(new_parent, new_display) {
        parent = new_parent;
        display = new_display;
        if(!display) {
            return;
        }
        canvas = $('<canvas>');
        parent.append(canvas);
        context2d = canvas[0].getContext('2d');
        cursor = new ContextCursor({
            context2d: context2d
        });
        grid = new ContextGrid({
            context2d: context2d
        });
        tooltip = new CanvasTooltip({
            canvas: canvas,
            strings: params.strings,
            getPixelLuminosity: calculatePixelLuminosity
        });
        render();
    }

    var image_data = '';
    var image;
    var image_loaded;
    var image_canvas;
    var image_context2d;


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

        grid.render(ofs_left, scale, image.width, image.height);
        tooltip.setBounds(ofs_left, scale, image.width, image.height);
        cursor.render(ofs_left, scale);
    }




    function setImage(data, callback) {
        if(image_data === data) {
            return;
        }
        image = false;
        image_loaded = false;
        image_data = data;
        cursor && cursor.reset();
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


    function calculatePixelLuminosity(x, y) {
        var d = image_context2d.getImageData(x, y, 1, 1).data;
        // ITU BT.601
        var l = 0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2];
        return Math.round(l);
    }




    return {

        init: init,

        setImage: setImage,

        render: render,

        setDisplay: function (newDisplay) {
            display = newDisplay;
        },

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
                cursor && cursor.set(x, y);
                render();
                callback(calculatePixelLuminosity(x, y));
            })
        }

    }
}




function UserDisplay(params) {

    var pixels = [];
    var canvas, context2d;
    var data_size;
    var parent;
    var cursor;
    var grid;
    var tooltip;
    var valid_result;

    function init(new_parent, new_display) {
        parent = new_parent;
        display = new_display;
        if(!display) {
            return;
        }
        canvas = $('<canvas>');
        parent.append(canvas);
        context2d = canvas[0].getContext('2d');
        cursor = new ContextCursor({
            context2d: context2d
        });
        grid = new ContextGrid({
            context2d: context2d
        });
        tooltip = new CanvasTooltip({
            canvas: canvas,
            strings: params.strings,
            getPixelLuminosity: getPixelLuminosity
        });
        render();
    }


    function getPixelLuminosity(x, y) {
        if(!data_size) {
            return 0;
        }
        var ofs = y * data_size.width + x;
        return pixels[ofs];
    }


    function render() {
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

            grid.render(ofs_left, scale, data_size.width, data_size.height);
            cursor.render(ofs_left, scale);
            tooltip.setBounds(ofs_left, scale, data_size.width, data_size.height);
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
            cursor && cursor.set(x, y);
            var v = Math.max(0, Math.min(v, 255));
            pixels[y * data_size.width + x] = v;
            render();
        },

        setDisplay: function (newDisplay) {
            display = newDisplay;
        },

        setSize: function(new_data_size) {
            var l = new_data_size.width * new_data_size.height
            if(pixels.length == l) {
                return;
            }            
            data_size = new_data_size;
            pixels = new Array(l).fill(255)
            render();
        },

        getInnerState: function() {
            return {
                data_size,
                pixels,
                cursor_position: cursor ? cursor.get() : null,
            };
        },

        reloadInnerState: function(data) {
            data_size = data.data_size;
            pixels = data.pixels;
            if (data.cursor_position) {
                cursor.set(data.cursor_position.x, data.cursor_position.y);
            }
        },

        clear: function() {
            cursor && cursor.reset();
            data_size = null;
            pixels = [];
            context2d && context2d.clearRect(0, 0, canvas[0].width, canvas[0].height);
        },

        render: render,

        diff: function(new_valid_result) {
            valid_result = new_valid_result;
            return render();
        },

        reset: function() {
            if(data_size) {
                pixels = new Array(data_size.width * data_size.height).fill(255)
            }
            valid_result = null;
            render();
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
        //data = '';
        if(!display) {
            return;
        }
        element = $('<span>')
        wrapper = $('<div><span>' + params.strings.messages.result + '</span> </div>');
        wrapper.append(element).hide();
        parent.append(wrapper);
        render();
    }


    function isEmpty() {
        return data == '';
    }


    function render() {
        if(!display) {
            return;
        }
        var visible = data != '' || diff != '';
        wrapper.toggle(visible);
        element.html(diff == '' ? data : diff);
    }


    return {

        init: init,


        setData: function(str) {
            data = '' + str;
            render();
        },

        render,

        setDisplay: function (newDisplay) {
            display = newDisplay;
        },

        getInnerState: function() {
            return {
                data,
            };
        },

        reloadInnerState: function(data) {
            data = '' + data.data;
            diff = '';
        },


        diff: function(valid_result) {
            diff = '';
            var valid = true;
            var has_red_digit = false;
            var l = Math.max(valid_result.data.length, data.length);
            for(var i=0; i<l; i++) {
                if((valid_result.data[i] !== data[i])) {
                    if(i < data.length) {
                        if (valid) {
                            has_red_digit = true;
                            diff += '<span style="background: red; color: #fff;">' + data[i] + '</span>';
                        } else {
                            diff += data[i];
                        }
                    }
                    valid = false;
                } else {
                    diff += data[i];
                }
            }
            render();

            var msg;
            if(valid) {
                msg = params.strings.messages.success
            } else if(!data.length) {
                msg = params.strings.messages.mistake_empty;
            } else if(has_red_digit) {
                msg = params.strings.messages.mistake_digit;
            } else {
                msg = params.strings.messages.mistake_length;
            }
            return {
                success: valid,
                message: msg
            }
        },

        reset: function() {
            diff = '';
            data = '';
            render();
        }
    }

}
