class screenDrawing {
    constructor(onScreenCanvas) {
        this.width = 128;
        this.height = 32;

        this.resetCanvas();

        this.noFill = false;
        this.noStroke = false;

    }

    resetCanvas() {
        this.imageArray = new Uint8Array(this.width * this.height);
    }

    getStateData() {
        var data = new Uint8Array(this.width * this.height);
        data.set(this.imageArray);

        return {
            isDrawingData: true,
            width: this.width,
            height: this.height,
            data: data,
        };
    }

    drawPoint(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        this.imageArray[x + (y * this.width)] = 1;
    }

    drawLine(x0, y0, x1, y1) {

        if (x0 == x1)
        {
            var maxy = Math.max(y0, y1);
            var miny = Math.min(y0, y1);

            for (var y = miny; y < maxy; y++)
            {
                this.imageArray[x0 + (y * this.width)] = 1;    
            }
        } 
        else if (y0 == y1)
        {
            var maxx = Math.max(x0, x1);
            var minx = Math.min(x0, x1);

            for (var x = minx; x <= maxx; x++)
            {
                this.imageArray[x + (y0 * this.width)] = 1;    
            }
        }
    }

    drawRectangle(x0, y0, width, height) {
        for (var x = x0; x < x0 + width; x++) {
            for (var y = y0; y < y0 + height; y++) {
                this.imageArray[x + (y * this.width)] = 1;
            }
        }
    }

    drawCircleHelper(xc, yc, x, y) 
    { 
        this.drawPoint(xc+x, yc+y); 
        this.drawPoint(xc-x, yc+y); 
        this.drawPoint(xc+x, yc-y); 
        this.drawPoint(xc-x, yc-y); 
        this.drawPoint(xc+y, yc+x); 
        this.drawPoint(xc-y, yc+x); 
        this.drawPoint(xc+y, yc-x); 
        this.drawPoint(xc-y, yc-x); 
    } 


    drawCircle(x0, y0, diameter) {
        var r = diameter / 2;
        var x = 0;
        var y = r; 
        var d = 3 - 2 * r; 

        this.drawCircleHelper(x0, y0, x, y); 
        while (y >= x) 
        { 
            // for each pixel we will 
            // draw all eight pixels 
              
            x++; 
      
            // check for decision parameter 
            // and correspondingly  
            // update d, x, y 
            if (d > 0) 
            { 
                y--;  
                d = d + 4 * (x - y) + 10; 
            } 
            else
                d = d + 4 * x + 6; 
            this.drawCircleHelper(x0, y0, x, y);     
        }
    }

    clearScreen() {
        this.resetCanvas();
    }

    copyToCanvas(canvas, scale) {
        screenDrawing.renderToCanvas(this.getStateData(), canvas, scale);
    }

    static renderToCanvas(state, canvas, scale) {
        var ctx = canvas.getContext('2d');
        var newData = ctx.createImageData(canvas.width, canvas.height);

        for (var i = 0; i < newData.data.length; i+=4)
        {
            newData.data[i + 0] = 255;
            newData.data[i + 1] = 255;
            newData.data[i + 2] = 255;
            newData.data[i + 3] = 255;
        }

        for (var i = 0; i < state.data.length; i++) {
            if (state.data[i])
            {
                var x = Math.floor(i % state.width) * scale;
                var y = Math.floor(i / state.width) * scale;

                for (var xScale = x; xScale < (x + scale); xScale++)
                {
                    for (var yScale = y; yScale < (y + scale); yScale++)
                    {
                        var canvaspos = (xScale + (yScale * canvas.width)) * 4; 

                        if (state.data[i] == 1) {
                            newData.data[canvaspos + 0] = 0;
                            newData.data[canvaspos + 1] = 0;
                            newData.data[canvaspos + 2] = 0;
                        } else if (state.data[i] == 2) {
                            newData.data[canvaspos + 0] = 100;
                            newData.data[canvaspos + 1] = 100;
                            newData.data[canvaspos + 2] = 100;
                        } else if (state.data[i] == 3) {
                            newData.data[canvaspos + 0] = 255;
                            newData.data[canvaspos + 1] = 0;
                            newData.data[canvaspos + 2] = 0;
                        }
                    }
                }
            }
        }

        ctx.putImageData(newData, 0, 0);
    }

    static renderDifferences(dataExpected, dataWrong, canvas, scale) {
        var expectedData = dataExpected.data;
        var actualData = dataWrong.data;
        var newData = new Uint8Array(dataExpected.width * dataExpected.height);

        for (var i = 0; i < newData.length; i++) {
            var actualSet = false;
            var expectedSet = false;
            if (expectedData[i] )
                expectedSet = true;

            if (actualData[i])
                actualSet = true;

            if (expectedSet && actualSet) {
                newData[i] = 1;   // Set as black
            }
            else if (expectedSet) {
                newData[i] = 2; // Set as lightgray
            }
            else if (actualSet) {
                newData[i] = 3; // Red

            } else {
                newData[i] = 0;
            }
        }
        
        screenDrawing.renderToCanvas({
            isDrawingData: true,
            width: dataExpected.width,
            height: dataExpected.height,
            data: newData
            }, canvas, scale);
    }


    

    static compareStates(state1, state2)
    {
        var data1 = state1.data;
        var data2 = state2.data;

        for (var i = 0; i < data1.length; i++)
        {
            if (data1[i] != data2[i])
                return false;
        }

        return true;
    }
}