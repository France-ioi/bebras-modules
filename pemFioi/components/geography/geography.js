// Geography library

var Geography = {};

// distance calculator
Geography.DistanceCalculator = function(unit) {

    function getEarthRadius() {
        var earthRadius = {
            'yards': 6967410,
            'km': 6371,
            'miles': 3959,
            'metres': 6371000,
            'feet': 20902231
        };
        return earthRadius[unit] || earthRadius['km'];
    }

    var r = getEarthRadius(unit)

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }


    this.getDistance = function(point1, point2) {
        var dlat = deg2rad(point2.lat - point1.lat);
        var dlon = deg2rad(point2.lng - point1.lng);
        var a =
            Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
            Math.sin(dlon / 2) * Math.sin(dlon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return r * c;
    }


    this.getMidPoint = function(point1, point2) {
        var lat1 = deg2rad(point1.lat);
        var lng1 = deg2rad(point1.lng);
        var lat2 = deg2rad(point2.lat);
        var lng2 = deg2rad(point2.lng);
        var dlng = lng2 - lng1;
        var bx = Math.cos(lat2) * Math.cos(dlng);
        var by = Math.cos(lat2) * Math.sin(dlng);
        var lat = Math.atan2(
            Math.sin(lat1) + Math.sin(lat2), 
            Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by)
        );
        var lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);

        return {
            lat: lat * 180 / Math.PI,
            lng: lng * 180 / Math.PI
        }
    }

}



// map renderer 2D
Geography.Renderer2D = function(options) {


    function ImageLoader(src, onLoad) {
        var loaded = false;
        var img = new Image();
        img.src = src;
        img.onload = function() {
            loaded = true;
            onLoad && onLoad();
        }
        img.onerror = function() {
            console.error('Error loading image: ' + src);
        }
        this.get = function() {
            return loaded ? img : null;
        }
    }


    // measure text size 
    var span = document.createElement('span');
    span.style.whiteSpace = 'nowrap';
    span.style.display = 'inline';
    span.style.visibility = 'hidden';
    span.style.font = options.font;
    document.body.append(span);

    function getTextSize(text) {
        span.innerHTML = text;
        return {
            width: span.offsetWidth,
            height: span.offsetHeight
        }
    }



    function CoordinatesConverter() {
        var map_lat_bottomRad = options.map_lat_bottom * Math.PI / 180;
        var mapLngDelta = (options.map_lng_right - options.map_lng_left)
        var worldMapWidth = ((options.width / mapLngDelta) * 360) / (2 * Math.PI)
        var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(map_lat_bottomRad)) / (1 - Math.sin(map_lat_bottomRad))))

        this.x = function(lng) {
            return (lng - options.map_lng_left) * (options.width / mapLngDelta);
        }

        this.y = function(lat) {
            var latitudeRad = lat * Math.PI / 180;
            return options.height - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitudeRad)) / (1 - Math.sin(latitudeRad)))) - mapOffsetY)
        }
    }


    function rgba(colors, opacity) {
        return 'rgba(' + colors.r + ',' + colors.g + ',' + colors.b + ',' + opacity + ')';
    }


    this.clear = function() {
        var img = images.map.get();
        if(img) {
            context.drawImage(img, 0, 0, options.width, options.height)
        } else {
            context.fillStyle = rgba(options.background_color, 1);
            context.fillRect(0, 0, options.width, options.height)
        }
    }


    this.line = function(lng1, lat1, lng2, lat2, opacity) {
        context.lineWidth = options.line_width;
        context.strokeStyle = rgba(options.line_color, opacity);
        context.beginPath();
        context.moveTo(coordinates.x(lng1), coordinates.y(lat1));
        context.lineTo(coordinates.x(lng2), coordinates.y(lat2));
        context.stroke();
    }


    this.pin = function(lng, lat, label) {
        var x = coordinates.x(lng);
        var y = coordinates.y(lat);
        var img = images.pin.get();

        if(img) {
            var w = options.pin_scale * img.width;
            var h = options.pin_scale * img.height;            
            context.drawImage(img, x - w * 0.5, y - h, w, h);
        }        
        context.textAlign = 'center';
        context.font = options.font;
        if(options.truncate_labels) {
            label = label.substr(0, 2);
            context.fillStyle = rgba(options.text_color, 1);
            context.fillText(label, x, y - h * 0.6)            
        } else {
            var ts = getTextSize(label);
            context.fillStyle = rgba(options.background_color, 1);
            var tl = x - 0.5 * ts.width;
            if(tl < 0) {
                x -= tl;
                tl = 0;
            } else if(tl + ts.width > options.width) {
                x = options.width - ts.width * 0.5;
                tl = options.width - ts.width;
            }
            
            context.fillRect(
                tl,
                y + 4,
                ts.width,
                ts.height
            );
            context.fillStyle = rgba(options.text_color, 1);
            context.textBaseline = 'middle';
            context.fillText(label, x, y + 4 + ts.height * 0.5);
        }
    }


    this.addMistake = function(lng, lat, type) {
        var x = coordinates.x(lng);
        var y = coordinates.y(lat);
        context.strokeStyle = '#FF0000';
        context.lineWidth = options.line_width;
        context.beginPath();
        context.arc(x, y, 20, 20, 0, 2 * Math.PI);
        context.stroke();
    }


    // init
    var images = {
        map: new ImageLoader(options.map_file, this.clear.bind(this)),
        pin: new ImageLoader(options.pin_file)
    }
    var canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    options.parent.appendChild(canvas);
    var context = canvas.getContext('2d');
    var coordinates = new CoordinatesConverter();

    this.destroy = function() {
        options.parent.removeChild(canvas);
        canvas = null;
    }    
}


// map renderer 3D
Geography.Renderer3D = function(options) {
    var earth = new Earth3D(options);


    this.clear = function() {
        earth.clearPaths();	
        earth.clearLabels();	
    }

    this.line = function(lng1, lat1, lng2, lat2, opacity) {
        var p1 = {
            lat: lat1,
            lng: lng1
        }
        var p2 = {
            lat: lat2,
            lng: lng2
        }            
        earth.addPath(p1, p2);
    }

    this.pin = function(lng, lat, label) {
        var p = {
            lat: lat,
            lng: lng,
            text: label
        }
        earth.addLabel(p);
    }

    this.addMistake = function(lat, lng, type) {

    }    

    this.destroy = function() {
        earth.destroy();
    }
}