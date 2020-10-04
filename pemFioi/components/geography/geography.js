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

    // haversine formula
    this.calculate = function(lng1, lat1, lng2, lat2) {
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lng2 - lng1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return r * c;
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
        label = label.substr(0, 2);
        var x = coordinates.x(lng);
        var y = coordinates.y(lat);

        var img = images.pin.get();
        var w = options.pin_scale * img.width;
        var h = options.pin_scale * img.height;
        if(img) {
            context.drawImage(img, x - w * 0.5, y - h, w, h);
        }
        context.fillStyle = rgba(options.text_color, 1);
        context.textAlign = 'center';
        context.fillText(label, x, y - h * 0.6)
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

    this.destroy = function() {
        earth.destroy();
    }
}