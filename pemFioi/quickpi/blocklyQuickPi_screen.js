class screenImageData {
    constructor() {
        this.isDrawingData = true;
        this.imagedata = [];
    }

    addData(scale, data)
    {
        this.imagedata.push({
            scale: scale,
            data: data
        });
    }

    getData(scale)
    {
        for (var i = 0; i < this.imagedata.length; i++)
        {
            if (this.imagedata[i].scale == scale)
                return this.imagedata[i].data;
        }

        return null;
    }


}

class screenDrawing {
        constructor(onScreenCanvas) {
            this.width = 128;
            this.height = 32;

            this.scales = [0.5, 1, 2];
            this.canvas = [null, null, null];

            this.resetCanvas();
            
            this.noFill = false;
            this.noStroke = false;

        }

        resetCanvas() {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this.canvas[i] = new OffscreenCanvas(this.width * scale, this.height * scale);

                var ctx = this.canvas[i].getContext('2d');

                ctx.imageSmoothingEnabled = false
                
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, this.canvas[i].width, this.canvas[i].height);    

                ctx.fillStyle = "black";
                ctx.strokeStyle = "black";
                ctx.lineWidth = scale;
            }
        }

        getStateData() {
            var imageData = new screenImageData();

            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];

                var ctx = this.canvas[i].getContext('2d');
                var imagedata = ctx.getImageData(0, 0, this.canvas[i].width, this.canvas[i].height);

                imageData.addData(scale, imagedata);
            }

            return imageData;
        }


        _drawPoint(canvas, scale, x, y) {
            var ctx = canvas.getContext('2d');

            ctx.fillRect(
                scale * x, scale * y, scale * 1, scale * 1);
        }

        drawPoint(x, y) {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._drawPoint(this.canvas[i], scale, x, y);
            }
        }
        

        _drawLine(canvas, scale, x0, y0, x1, y1) {
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.moveTo(scale * x0, scale * y0);
            ctx.lineTo(scale * x1, scale * y1);
            ctx.closePath();
            ctx.stroke();
        }

        drawLine(x0, y0, x1, y1) {
            this._drawLine(this.offScreenCanvashalfx, 0.5, x0, y0, x1, y1);
            this._drawLine(this.offScreenCanvas1x, 1, x0, y0, x1, y1);
            this._drawLine(this.offScreenCanvas2x, 2, x0, y0, x1, y1);
        }

        _drawRectangle(canvas, scale, x0, y0, width, height) {
            var ctx = canvas.getContext('2d');

            /*
            if (!this.noStroke) {
                ctx.strokeRect(scale * x0, scale * y0, scale * width, scale * height);
            }*/

            if (!this.noFill) {
                ctx.fillRect(scale * x0, scale * y0, scale * width, scale * height);
            }

        }

        drawRectangle(x0, y0, width, height) {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._drawRectangle(this.canvas[i], scale, x0, y0, width, height);
            }

        }

        _drawCircle(canvas, x0, y0, diameter) {
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.arc(scale * x0, scale * y0, scale * diameter / 2, 0, Math.PI * 2);
            ctx.closePath();

            if (!this.noFill) {
                ctx.fill();
            }
        }

        drawCircle(x0, y0, diameter) {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._drawCircle(this.canvas[i], scale, x0, y0, diameter);
            }
        }

        _clearScreen(canvas, scale) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        clearScreen() {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._clearScreen(this.canvas[i], scale);
            }

        }

        copyToCanvas(canvas, scale)
        {
            for (var i = 0; i < this.scales.length; i++) {
                var currentScale = this.scales[i];

                if (currentScale == scale) {
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(this.canvas[i],
                                0,
                                0,
                                this.canvas[i].width,
                                this.canvas[i].height,
                                0,
                                0,
                                canvas.width,
                                canvas.height);
                    }
                }
        }
}