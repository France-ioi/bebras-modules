function getShapePath(shape,x,y,params) {
    // var shape = params.shape;
    // var x = params.x;
    // var y = params.y;
    var radius = params.radius;
    var roundedRectangleRadius = params.roundedRectangleRadius;
    if(!radius) radius = 15;
    if(!roundedRectangleRadius) roundedRectangleRadius = 6;
    if(shape == "arrow"){
        var w = params.arrowW || 30;
        var h = params.arrowH || 20;
        var x0 = x - w/2;
        var y0 = y - h/2;
        var ratioW = params.ratioW || 0.5;
        var trW = params.trW || w*ratioW;
        var rectW = w - trW;
        var ratioH = params.ratioH || 0.6;
        var rectH = h*ratioH;

        var yRect = y0 + (h - rectH)/2;
        var yTr1 = y0;
        var yTr2 = y0 + h/2;
        var yTr3 = y0 + h;
        var xRect = x0;
        var xTr1 = x0 + rectW;
        var xTr2 = x0 + w;
    }
   
    var shapePaths = {
        diamond: ["M", x, y-radius,
            "L", x + radius, y,
            "L", x, y + radius,
            "L", x-radius, y,
            "Z"],
        hexagon: ["M", x, y-radius,
            "L", x-radius, y-radius / 2,
            "L", x-radius, y+radius / 2,
            "L", x, y+radius,
            "L", x+radius, y+radius / 2,
            "L", x+radius, y-radius / 2,
            "Z"],
        star: ["M", x, y - radius,
            "L", x + 0.27 * radius, y -0.3 * radius,
            "L", x + radius, y -0.3 * radius,
            "L", x + 0.4 * radius, y + 0.2 * radius,
            "L", x + 0.6 * radius, y +0.8 * radius,
            "L", x + 0, y +0.4 * radius,
            "L", x - 0.6 * radius, y + 0.8 * radius,
            "L", x - 0.4 * radius, y + 0.2 * radius,
            "L", x - radius, y -0.3 * radius,
            "L", x - 0.27 * radius, y -0.3 * radius,
            "Z"],
        triangle: ["M", x-radius, y + radius,
            "L", x + radius, y + radius,
            "L", x, y - radius,
            "Z"],
        rectangle: ["M", x-radius, y-radius,
            "L", x+radius, y-radius,
            "L", x+radius, y+radius,
            "L", x-radius, y+radius,
            "Z"],
        reverseTriangle: ["M", x-radius, y-radius,
            "L", x+radius, y-radius,
            "L", x, y+radius,
            "Z"],
        pentagon: ["M", x, y-0.9*radius,
            "L", x+radius, y-0.2 * radius,
            "L", x+0.6 * radius, y+0.9*radius,
            "L", x-0.6 * radius, y+0.9*radius,
            "L", x-radius, y-0.2 * radius,
            "Z"],
        squareStar: ["M", x, y-radius,
            "L", x+0.25 * radius, y-0.25 * radius,
            "L", x+radius, y,
            "L", x+0.25 * radius, y+0.25 * radius,
            "L", x+0, y+radius,
            "L", x-0.25 * radius, y+0.25 * radius,
            "L", x-radius, y,
            "L", x-0.25 * radius, y-0.25 * radius,
            "Z"],
        roundedRectangle: ["M", x-radius, y-radius + roundedRectangleRadius,
            "Q", x-radius, y-radius, x-radius + roundedRectangleRadius, y-radius,
            "L", x+radius -roundedRectangleRadius, y-radius,
            "Q", x+radius, y-radius, x+radius, y-radius + roundedRectangleRadius,
            "L", x+radius, y+radius - roundedRectangleRadius,
            "Q", x+radius, y+radius, x+radius - roundedRectangleRadius, y+radius,
            "L", x-radius + roundedRectangleRadius, y+radius,
            "Q", x-radius, y+radius, x-radius, y+radius - roundedRectangleRadius,
            "Z"],
        arrow: ["M"+xRect+" "+yRect+",H"+xTr1+",V"+yTr1+",L"+xTr2+" "+yTr2+
         ",L"+xTr1+" "+yTr3+",V"+(yRect + rectH)+",H"+xRect+",Z"],
        cross: ["M", x - radius, y - radius, "L", x + radius, y + radius, "M", x - radius, y + radius, "L", x + radius, y - radius ]
    };
    return shapePaths[shape];

    
}

function getShape(paper,shape,x,y,params) {
    var path = getShapePath(shape,x,y,params);
    return paper.path(path);
};