function getShapePath(shape, x, y, radius, roundedRectangleRadius) {
    if(!radius) radius = 15;
    if(!roundedRectangleRadius) roundedRectangleRadius = 6;
   
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
            "Z"]
    };
    return shapePaths[shape];

    
}

function getShape(paper,shape,x,y,radius) {
    var path = getShapePath(shape,x,y,radius);
    return paper.path(path);
};