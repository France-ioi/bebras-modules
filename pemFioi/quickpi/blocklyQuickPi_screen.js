if (!window.OffscreenCanvas) {
    window.OffscreenCanvas = class OffscreenCanvas {
      constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
  
        this.canvas.convertToBlob = () => {
          return new Promise(resolve => {
            this.canvas.toBlob(resolve);
          });
        };
  
        return this.canvas;
      }
    };
  }

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
            
            this.noFillStatus = false;
            this.noStrokeStatus = false;
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
        
        fill(color) {
            this.noFillStatus = false;

            for (var i = 0; i < this.scales.length; i++) {
                var canvas = this.canvas[i];
                var ctx = canvas.getContext('2d');

                if (color)
                    ctx.fillStyle = "black";
                else
                    ctx.fillStyle = "white";
            }
        }

        noFill(color) {
            this.noFillStatus = true;
        }

        stroke(color) {
            this.noStrokeStatus = false;

            for (var i = 0; i < this.scales.length; i++) {
                var canvas = this.canvas[i];
                var ctx = canvas.getContext('2d');

                if (color)
                    ctx.strokeStyle = "black";
                else
                    ctx.strokeStyle = "white";
            }
        }

        noStroke(color) {
            this.noStrokeStatus = true;
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

        isPointSet(x, y) {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];

                if (scale == 1) {

                    var ctx = this.canvas[i].getContext('2d');
                    var imagedata = ctx.getImageData(0, 0, this.canvas[i].width, this.canvas[i].height);

                    var basepos = (x + (y * this.canvas[i].width)) * 4;

                    var r = imagedata.data[basepos];
                    var g = imagedata.data[basepos + 1];
                    var b = imagedata.data[basepos + 2];
                    var a = imagedata.data[basepos + 3];

                    if (r != 255 && g != 255 && b != 255)
                        return true;

                    break;
                }   
            }

            return false;
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
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._drawLine(this.canvas[i], scale, x0, y0, x1, y1);
            }
        }

        _drawRectangle(canvas, scale, x0, y0, width, height) {
            var ctx = canvas.getContext('2d');

            if (!this.noFillStatus) {
                ctx.fillRect(scale * x0, scale * y0, scale * width, scale * height);
            }

            if (!this.noStrokeStatus) {
                ctx.strokeRect(scale * x0, scale * y0, scale * width, scale * height);
            }

        }

        drawRectangle(x0, y0, width, height) {
            for (var i = 0; i < this.scales.length; i++) {
                var scale = this.scales[i];
                this._drawRectangle(this.canvas[i], scale, x0, y0, width, height);
            }

        }

        _drawCircle(canvas, scale, x0, y0, diameter) {
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            ctx.arc(scale * x0, scale * y0, scale * diameter / 2, 0, Math.PI * 2);
            ctx.closePath();

            if (!this.noFillStatus) {
                ctx.fill();
            }

            if (!this.noStrokeStatus) {
                ctx.stroke();
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
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);    

            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
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

        static renderToCanvas(state, canvas, scale) {
            var ctx = canvas.getContext('2d');
            var data = state.getData(scale);

            if (!data) { return; }
            ctx.putImageData(data, 0, 0);
        }

    static renderDifferences(dataExpected, dataWrong, canvas, scale) {
        var ctx = canvas.getContext('2d');
        var expectedData = dataExpected.getData(scale);
        var actualData = dataWrong.getData(scale);

        var newData = ctx.createImageData(canvas.width, canvas.height);

        for (var i = 0; i < newData.data.length; i += 4) {
            var actualSet = false;
            var expectedSet = false;
            if (expectedData.data[i + 0] != 255 &&
                expectedData.data[i + 1] != 255 &&
                expectedData.data[i + 2] != 255) {
                expectedSet = true;
            }

            if (actualData.data[i + 0] != 255 &&
                actualData.data[i + 1] != 255 &&
                actualData.data[i + 2] != 255) {
                actualSet = true;
            }

            if (expectedSet && actualSet) {
                newData.data[i + 0] = 0;
                newData.data[i + 1] = 0;
                newData.data[i + 2] = 0;
            }
            else if (expectedSet) {
                newData.data[i + 0] = 100;
                newData.data[i + 1] = 100;
                newData.data[i + 2] = 100;
            }
            else if (actualSet) {
                newData.data[i + 0] = 255;
                newData.data[i + 1] = 0;
                newData.data[i + 2] = 0;
            } else {
                newData.data[i + 0] = 255;
                newData.data[i + 1] = 255;
                newData.data[i + 2] = 255;
            }


            newData.data[i + 3] = 255;
        }
        ctx.putImageData(newData, 0, 0);
    }
}