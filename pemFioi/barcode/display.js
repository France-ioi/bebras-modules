function BarcodeDisplay(params, callback) {

    var canvas = document.createElement('canvas');
    var context2d = canvas.getContext('2d');
    params.parent.append($(canvas));


    var cursor = {
        color: 'rgb(255,128,0)',
        lineWidth: 1,
        position: false
    }

    function setCursorPosition(x, y) {
        cursor.position = {
            x: x,
            y: y
        }
        render();
    }



    function render() {
        var w = canvas.width = Math.floor(params.parent.width());

        if(w > image.width) {
            var scale = Math.floor(w / image.width);
        } else {
            var scale = 1;
        }
        var image_w = Math.floor(image.width * scale);
        var ofs_left = Math.floor(0.5 * (w - image_w));
        var h = canvas.height = image.height * scale;

        context2d.scale(1, 1);
        context2d.clearRect(0, 0, w, h);
        context2d.drawImage(image, ofs_left, 0, image_w, h);

        if(cursor.position) {
            context2d.strokeStyle = cursor.color;
            var s = scale + cursor.lineWidth;
            context2d.lineWidth = cursor.lineWidth;
            context2d.rect(
                ofs_left + cursor.position.x - cursor.lineWidth, 
                cursor.position.y - cursor.lineWidth, 
                s, 
                s
            );
            context2d.stroke();
        }
    }


    var api = {

        resize: render,

        getPixelLuminosity: function(x, y) {
            setCursorPosition(x, y);
            var d = image_context2d.getImageData(x, y, 1, 1).data;
            // ITU BT.601
            return Math.floor(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
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