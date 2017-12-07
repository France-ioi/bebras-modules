function SimpleDraw(options) {

    var defaults = {
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

    var context = canvas.getContext('2d')
    context.font = options.font
    clear()


    // private

    function clear() {
        context.fillStyle = options.colors.background
        context.fillRect(0, 0, options.width, options.height)
        context.strokeStyle = options.colors.axis
        var ch = Math.round(0.5 * options.height)
        context.beginPath()
        context.moveTo(0, ch)
        context.lineTo(options.width, ch)
        context.stroke()
        var cw = Math.round(0.5 * options.width)
        context.beginPath()
        context.moveTo(cw, 0)
        context.lineTo(cw, options.height)
        context.stroke()
    }


    function tx(x) {
        var r = 0.5 * options.width
        return Math.round(r * (1 + x / options.scale_x))
    }


    function ty(y) {
        var r = 0.5 * options.height
        return Math.round(r * (1 - y / options.scale_y))
    }

    function tr(r) {
        var hr = 0.25 * (options.width + options.height)
        var s = 0.5 * (options.scale_x + options.scale_y)
        return Math.round(hr * r / s)
    }

    function color(idx) {
        var c = options.palette[idx] ? options.palette[idx] : options.palette[0]
        context.fillStyle = c
        context.strokeStyle = c
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
        context.fillText(s, tx(x), ty(y))
    }


    this.addLine = function(x1, y1, x2, y2, c) {
        color(c)
        context.beginPath()
        context.moveTo(tx(x1), ty(y1))
        context.lineTo(tx(x2), ty(y2))
        context.stroke()
    }


    this.addCircle = function(x, y, r, c) {
        color(c)
        context.beginPath()
        context.arc(tx(x), tx(y), tr(r), 0, 2 * Math.PI)
        context.stroke()
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
        x: null,
        y: null
    }

    this.waitForClick = function(callback) {
        canvas.addEventListener('click', function(e) {
            click_coordinates = {
                x: e.clientX,
                y: e.clientY
            }
            callback && callback(e.clientX, e.clientY)
        })
    }


    this.getX = function() {
        return click_coordinates.x
    }


    this.getY = function() {
        return click_coordinates.x
    }



    // may be required in future

    this.destroy = function() {
        options.parent.removeChild(canvas)
        context = null
        canvas = null
    }
}