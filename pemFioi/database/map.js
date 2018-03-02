if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function DatabaseMap(options) {


    var defaults = {
        parent: document.body,
        width: 400,
        height: 400,
        text_color: {r: 255, g: 255, b: 255},
        pin_file: null,
        pin_scale: 0.385,
        map_file: null,
        map_lng_left: 0,
        map_lng_right: 0,
        map_lat_top: 0,
        map_lat_bottom: 0,
    }

    var options = Object.assign(defaults, options || {})


    // map renderer

    function Renderer() {

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
            var map_lat_bottomRad = options.map_lat_bottom.toRad()
            var mapLngDelta = (options.map_lng_right - options.map_lng_left)
            var worldMapWidth = ((options.width / mapLngDelta) * 360) / (2 * Math.PI)
            var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(map_lat_bottomRad)) / (1 - Math.sin(map_lat_bottomRad))))

            this.x = function(lng) {
                return (lng - options.map_lng_left) * (options.width / mapLngDelta);
            }

            this.y = function(lat) {
                var latitudeRad = lat.toRad()
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
        var coordinates = new CoordinatesConverter();

        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        options.parent.appendChild(canvas);
        var context = canvas.getContext('2d');

    }




    function validateLng(lng) {
        if(isNaN(lng)) {
            throw new Error('Longitude is not a number')
        }
        if(lng < options.map_lng_left || lng > options.map_lng_right) {
            throw new Error('Longitude is outside of the map')
        }
    }

    function validateLat(lat) {
        if(isNaN(lat)) {
            throw new Error('Latitude is not a number')
        }
        if(lat > options.map_lat_top || lat < options.map_lat_bottom) {
            throw new Error('Latitude is outside of the map')
        }
    }



    // interface
    this.displayTable = function(table) {
        for(var i, row; row=table.params().records[i]; i++) {
            validateLng(row[1]);
            validateLat(row[2]);
            renderer.pin(row[1], row[2], row[0]);
        }
    }


    // init
    var renderer = new Renderer();
}