if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function MapItem(options) {


    var defaults = {
        parent: document.body,
        width: 400,
        height: 400,
        map_lng_left: 0,
        map_lng_right: 0,
        map_lat_top: 0,
        map_lat_bottom: 0,
        unit: 'km',

        // map2d options
        line_color: {r: 64, g: 64, b: 64},
        line_width: 4,
        background_color: {r: 255, g: 255, b: 255},
        text_color: {r: 255, g: 255, b: 255},
        pin_file: null,
        pin_scale: 0.385,
        map_file: null
    }

    options = Object.assign({}, defaults, options);


/*
    var options = (function() {
        var res = {}
        for(var k in defaults) {
            res[k] = k in options ? options[k] : defaults[k]
        }
        return res
    })()
*/


    // map renderer

    function Renderer2D() {


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
    }



    function Renderer3D() {
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
    }



    // distance calculator
    function GeoDistance(unit) {

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
        this.getDistance = function(lng1, lat1, lng2, lat2) {
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




    // graph for pathfinding
    // https://github.com/mburst/dijkstras-algorithm/blob/master/dijkstras.js

    function PriorityQueue () {
        this._nodes = [];

        this.enqueue = function (priority, key) {
            this._nodes.push({key: key, priority: priority });
            this.sort();
        };

        this.dequeue = function () {
            return this._nodes.shift().key;
        };

        this.sort = function () {
            this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
            });
        };

        this.isEmpty = function () {
            return !this._nodes.length;
        };
    }

    /**
     * Pathfinding starts here
     */
    function Graph() {
        var INFINITY = 1/0;
        this.vertices = {};

        this.addVertex = function(name, edges){
            this.vertices[name] = edges;
        };

        this.shortestPath = function (start, finish) {
            var nodes = new PriorityQueue(),
                distances = {},
                previous = {},
                path = [],
                smallest, vertex, neighbor, alt;

            for(vertex in this.vertices) {
                if(vertex === start) {
                    distances[vertex] = 0;
                    nodes.enqueue(0, vertex);
                } else {
                    distances[vertex] = INFINITY;
                    nodes.enqueue(INFINITY, vertex);
                }
                previous[vertex] = null;
            }

            while(!nodes.isEmpty()) {
                smallest = nodes.dequeue();
                if(smallest === finish) {
                    path = [];
                    while(previous[smallest]) {
                        path.push(smallest);
                        smallest = previous[smallest];
                    }
                    break;
                }
                if(!smallest || distances[smallest] === INFINITY){
                    continue;
                }
                for(neighbor in this.vertices[smallest]) {
                    alt = distances[smallest] + this.vertices[smallest][neighbor];
                    if(alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = smallest;
                        nodes.enqueue(alt, neighbor);
                    }
                }
            }

            return path;
        };
    }



    // data search

    this.findCity = function(name) {
        for(var i=0,city; city=this.cities[i]; i++) {
            if(city.name == name) return city;
        }
        throw new Error('City not found');
    }

    this.findNeighbors = function(name) {
        for(var i=0,row,res=[]; row=this.neighbors[i]; i++) {
            if(row[0] == name) res.push(this.findCity(row[1]));
            if(row[1] == name) res.push(this.findCity(row[0]));
        }
        return res;
    }



    // validation

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

    this.clearMap = function() {
        renderer.clear();
    }


    this.addLocation = function(longitude, latitude, label) {
        validateLng(longitude);
        validateLat(latitude);
        renderer.pin(longitude, latitude, label);
    }


    this.addRoad = function(longitude1, latitude1, longitude2, latitude2, opacity) {
        validateLng(longitude1);
        validateLat(latitude1);
        validateLng(longitude2);
        validateLat(latitude2);
        opacity = opacity || 1;
        renderer.line(longitude1, latitude1, longitude2, latitude2, opacity);
    }


    this.geoDistance = function(longitude1, latitude1, longitude2, latitude2) {
        validateLng(longitude1);
        validateLat(latitude1);
        validateLng(longitude2);
        validateLat(latitude2);
        return geo.getDistance(longitude1, latitude1, longitude2, latitude2);
    }


    this.getLatitude = function(cityName) {
        return this.findCity(cityName).lat;
    }


    this.getLongitude = function(cityName) {
        return this.findCity(cityName).lng;
    }


    this.getNeighbors = function(cityName) {
        return this.findNeighbors(cityName);
    }


    this.shortestPath = function(cityName1, cityName2) {
        return graph.shortestPath(cityName1, cityName2).concat(cityName1).reverse();
    }





    // init

    if(options.map3d) {
        var renderer = new Renderer3D();
    } else {
        var renderer = new Renderer2D();
    }
    


    var geo = new GeoDistance(options.unit);
    var graph = new Graph();

    for(var i=0,city1; city1=this.cities[i]; i++) {
        var neighbors = this.findNeighbors(city1.name);
        if(!neighbors.length) {
            console.error(city1.name + ' has no neighbors')
        }
        var edges = {};
        for(var j=0,city2; city2=neighbors[j]; j++) {
            edges[city2.name] = geo.getDistance(city1.lng, city1.lat, city2.lng, city2.lat);
        }
        graph.addVertex(city1.name, edges);
    }

}


// data

MapItem.prototype.cities = [
    { name: "Dunkerque", lat: 51.069360, lng: 2.376571 },
    { name: "Calais", lat: 50.979622, lng: 1.855583 },
    { name: "Lille", lat: 50.650582, lng: 3.056121 },
    { name: "Béthune", lat: 50.545887, lng: 2.648391 },
    { name: "Lens", lat: 50.381367, lng: 3.056121 },
    { name: "Valenciennes", lat: 50.366410, lng: 3.531806 },
    { name: "Amiens", lat: 49.887806, lng: 2.308616 },
    { name: "Le Havre", lat: 49.483984, lng: 0.134056 },
    { name: "Rouen", lat: 49.439114, lng: 1.108078 },
    { name: "Reims", lat: 49.259638, lng: 4.007492 },
    { name: "Thionville", lat: 49.364333, lng: 6.182052 },
    { name: "Metz", lat: 49.110074, lng: 6.182052 },
    { name: "Strasbourg", lat: 48.586601, lng: 7.745017 },
    { name: "Nancy", lat: 48.691295, lng: 6.204704 },
    { name: "Paris", lat: 48.855815, lng: 2.353920 },
    { name: "Caen", lat: 49.169900, lng: -0.386932 },
    { name: "Troyes", lat: 48.287473, lng: 4.052795 },
    { name: "Brest", lat: 48.392168, lng: -4.486885 },
    { name: "Lorient", lat: 47.749043, lng: -3.376953 },
    { name: "Rennes", lat: 48.107996, lng: -1.678077 },
    { name: "Le Mans", lat: 48.003301, lng: 0.202011 },
    { name: "Orléans", lat: 47.913563, lng: 1.900886 },
    { name: "Tours", lat: 47.405046, lng: 0.700347 },
    { name: "Angers", lat: 47.479828, lng: -0.568145 },
    { name: "Nantes", lat: 47.240526, lng: -1.564819 },
    { name: "Saint-Nazaire", lat: 47.285395, lng: -2.199066 },
    { name: "Dijon", lat: 47.330264, lng: 5.049469 },
    { name: "Mulhouse", lat: 47.763999, lng: 7.337287 },
    { name: "Montbéliard", lat: 47.509741, lng: 6.793647 },
    { name: "Besançon", lat: 47.270439, lng: 6.023490 },
    { name: "Annemasse", lat: 46.268361, lng: 6.227355 },
    { name: "Annecy", lat: 45.969233, lng: 6.159400 },
    { name: "Chambéry", lat: 45.670105, lng: 5.932884 },
    { name: "Grenoble", lat: 45.296196, lng: 5.706367 },
    { name: "Lyon", lat: 45.834626, lng: 4.800300 },
    { name: "Saint-Etienne", lat: 45.550454, lng: 4.369918 },
    { name: "Valence", lat: 45.071850, lng: 4.890907 },
    { name: "Nice", lat: 43.950121, lng: 7.269332 },
    { name: "Toulon", lat: 43.426648, lng: 5.932884 },
    { name: "Marseille", lat: 43.591168, lng: 5.343940 },
    { name: "Avigon", lat: 44.174467, lng: 4.822952 },
    { name: "Nîmes", lat: 44.084729, lng: 4.347267 },
    { name: "Montpellier", lat: 43.860383, lng: 3.871582 },
    { name: "Perpignan", lat: 43.037782, lng: 2.874908 },
    { name: "Toulouse", lat: 43.860383, lng: 1.425201 },
    { name: "Pau", lat: 43.591168, lng: -0.364280 },
    { name: "Bayonne", lat: 43.755688, lng: -1.496864 },
// real lat:
//    { name: "Bayonne", lat: 43.499387, lng: -1.496864 },
    { name: "Bordeaux", lat: 44.997068, lng: -0.593449 },
    { name: "Clermont-Ferrand", lat: 45.879495, lng: 3.078773 },
    { name: "Limoges", lat: 45.909408, lng: 1.243988 },
    { name: "Angoulême", lat: 45.744887, lng: 0.156707 },
    { name: "La Rochelle", lat: 46.238448, lng: -1.157089 },
    { name: "Poitiers", lat: 46.627314, lng: 0.315269 }
];


MapItem.prototype.neighbors = [
    ["Brest", "Lorient"],
    ["Brest", "Rennes"],
    ["Lorient", "Rennes"],
    ["Rennes", "Nantes"],
    ["Nantes", "Saint-Nazaire"],
    ["Rennes", "Le Mans"],
    ["Le Mans", "Paris"],
    ["Paris", "Orléans"],
    ["Le Mans", "Tours"],
    ["Orléans", "Limoges"],
    ["Le Mans", "Angers"],
    ["Nantes", "La Rochelle"],
    ["La Rochelle", "Angoulême"],
    ["Nantes", "Angoulême"],
    ["Angers", "Nantes"],
    ["Poitiers", "Angoulême"],
    ["Tours", "Poitiers"],
    ["Angoulême", "Bordeaux"],
    ["Bordeaux", "Bayonne"],
    ["Bayonne", "Pau"],
    ["Pau", "Toulouse"],
    ["Bordeaux", "Toulouse"],
    ["Toulouse", "Perpignan"],
    ["Toulouse", "Montpellier"],
    ["Montpellier", "Nîmes"],
    ["Nîmes", "Avigon"],
    ["Avigon", "Marseille"],
    ["Marseille", "Toulon"],
    ["Toulon", "Nice"],
    ["Avigon", "Valence"],
    ["Valence", "Grenoble"],
    ["Grenoble", "Chambéry"],
    ["Chambéry", "Annecy"],
    ["Annecy", "Annemasse"],
    ["Valence", "Saint-Etienne"],
    ["Lyon", "Saint-Etienne"],
    ["Lyon", "Grenoble"],
    ["Clermont-Ferrand", "Saint-Etienne"],
    ["Clermont-Ferrand", "Limoges"],
    ["Limoges", "Angoulême"],
    ["Paris", "Troyes"],
    ["Troyes", "Dijon"],
    ["Dijon", "Besançon"],
    ["Dijon", "Lyon"],
    ["Besançon", "Montbéliard"],
    ["Montbéliard", "Mulhouse"],
    ["Mulhouse", "Strasbourg"],
    ["Strasbourg", "Nancy"],
    ["Nancy", "Paris"],
    ["Troyes", "Nancy"],
    ["Nancy", "Metz"],
    ["Metz", "Thionville"],
    ["Metz", "Reims"],
    ["Reims", "Paris"],
    ["Paris", "Rouen"],
    ["Rouen", "Le Havre"],
    ["Caen", "Rennes"],
    ["Rouen", "Caen"],
    ["Calais", "Dunkerque"],
    ["Dunkerque", "Béthune"],
    ["Lille", "Béthune"],
    ["Béthune", "Lens"],
    ["Lens", "Valenciennes"],
    ["Lens", "Lille"],
    ["Lens", "Paris"],
    ["Amiens", "Paris"],
    ["Amiens", "Lens"],
    ["Reims", "Lens"],
    ["Lens", "Lille"]
];