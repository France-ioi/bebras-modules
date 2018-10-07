function SimpleDraw(options) {

    var defaults = {
        context: null,
        parent: document.body,
        width: 400,
        height: 400,
        scale_x: 1,
        scale_y: 1,
        font: '14px sans-serif',
        colors: {
            background: '#333333',
            axis: '#666666'
        },
        palette: [
            '#000000', //0=black
            '#f4a460', //1=brown
            '#ff0000', //2=red
            '#ffa500', //3=orange
            '#ffff00', //4=yellow
            '#00ff00', //5=green
            '#0000ff', //6=blue
            '#8a2be2', //7=violet
            '#999999', //8= gray,
            '#ffffff', //9= white
        ]
    }

    var options = (function() {
        var res = {}
        for(var k in defaults) {
            res[k] = k in options ? options[k] : defaults[k]
        }
        return res
    })()


    var canvas = document.createElement('canvas')
    canvas.width = options.width
    canvas.height = options.height
    options.parent.appendChild(canvas)

    var canvasContext = canvas.getContext('2d')
    canvasContext.font = options.font
    clear()


    // private

    function clear() {
        canvasContext.fillStyle = options.colors.background
        canvasContext.fillRect(0, 0, options.width, options.height)
        canvasContext.strokeStyle = options.colors.axis
        var ch = Math.round(0.5 * options.height)
        canvasContext.beginPath()
        canvasContext.moveTo(0, ch)
        canvasContext.lineTo(options.width, ch)
        canvasContext.stroke()
        var cw = Math.round(0.5 * options.width)
        canvasContext.beginPath()
        canvasContext.moveTo(cw, 0)
        canvasContext.lineTo(cw, options.height)
        canvasContext.stroke()
    }


    function tx(x) {
        // Translate x in -1..1 to a coordinate on the canvas
        var r = 0.5 * options.width
        return Math.round(r * (1 + x / options.scale_x))
    }

    function itx(x) {
        // Translate x in 0..width to a -1..1
        return (x / (0.5 * options.width) - 1) * options.scale_x;
    }


    function ty(y) {
        // Translate y in -1..1 to a coordinate on the canvas
        var r = 0.5 * options.height
        return Math.round(r * (1 - y / options.scale_y))
    }

    function ity(y) {
        // Translate y in 0..height to a -1..1
        return (- 1 - y / (0.5 * options.height)) * options.scale_y;
    }

    function tr(r) {
        var hr = 0.25 * (options.width + options.height)
        var s = 0.5 * (options.scale_x + options.scale_y)
        return Math.round(hr * r / s)
    }

    function color(idx) {
        var c = options.palette[idx] ? options.palette[idx] : options.palette[0]
        canvasContext.fillStyle = c
        canvasContext.strokeStyle = c
    }

    // drawing

    var prev_point = null;

    this.setPoint = function(x, y, c) {
        color(c)
        if(prev_point) {
            this.addLine(prev_point.x, prev_point.y, x, y, c)
        }
        prev_point = { x: x, y: y }
    }


    this.addString = function(x, y, s, c) {
        color(c)
        canvasContext.fillText(s, tx(x), ty(y))
    }


    this.addLine = function(x1, y1, x2, y2, c) {
        color(c)
        canvasContext.beginPath()
        canvasContext.moveTo(tx(x1), ty(y1))
        canvasContext.lineTo(tx(x2), ty(y2))
        canvasContext.stroke()
    }


    this.addCircle = function(x, y, r, c) {
        color(c)
        canvasContext.beginPath()
        canvasContext.arc(tx(x), tx(y), tr(r), 0, 2 * Math.PI)
        canvasContext.stroke()
    }


    this.resetSize = function(scale_x, scale_y) {
        clear()
        options.scale_x = scale_x
        options.scale_y = scale_y
    }


    this.reset = function() {
        clear()
        options.scale_x = defaults.scale_x
        options.scale_y = defaults.scale_y
    }



    // mouse

    var click_coordinates = {
        x: 0,
        y: 0
    }
    var waiting_for_click = null;

    this.waitForClick = function(callback) {
        if(options.context.display) {
            if(window.quickAlgoInterface) {
                window.quickAlgoInterface.displayError(options.context.strings.messages.clickCanvas);
            } else {
                $("#errors").html(options.context.strings.messages.clickCanvas);
            }

            options.context.runner.waitEvent(callback, canvas, 'click', function(e) {
                var rect = canvas.getBoundingClientRect();
                click_coordinates.x = itx(e.clientX - rect.left);
                click_coordinates.y = ity(rect.top - e.clientY);
            });
        } else {
            // Assume all clicks are in the center
            click_coordinates.x = 0;
            click_coordinates.y = 0;
            options.context.runner.noDelay(callback);
        }
    }


    this.getX = function() {
        return click_coordinates.x
    }


    this.getY = function() {
        return click_coordinates.y
    }



    // may be required in future

    this.destroy = function() {
        options.parent.removeChild(canvas)
        canvasContext = null
        canvas = null
    }
}
