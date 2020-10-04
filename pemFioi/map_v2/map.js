function Map(options) {

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
        line_color: {r: 0, g: 0, b: 0},
        line_width: 4,
        background_color: {r: 255, g: 255, b: 255},
        text_color: {r: 255, g: 255, b: 255},
        pin_file: null,
        pin_scale: 0.385,
        map_file: null
    }

    options = Object.assign({}, defaults, options);

    // init

    if(options.map3d) {
        var renderer = new Geography.Renderer3D(options);
    } else {
        var renderer = new Geography.Renderer2D(options);
    }

    var distance_calc = new Geography.DistanceCalculator(options.unit);    


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


    var db = {
        cities: [],
        roads: [],

        getCity: function(idx) {
            if(this.cities[idx]) {
                return this.cities[idx];
            }
            throw new Error('City not found')
        },

        getRoad: function(idx) {
            if(this.roads[idx]) {
                return this.roads[idx];
            }
            throw new Error('City not found')
        }
    }



    // interface

    this.addCity = function(lng, lat, name) {
        validateLng(lng);
        validateLat(lat);
        db.cities.push({
            lng: lng,
            lat: lat,
            name: name
        });
        renderer.pin(lng, lat, name);        
    }


    this.getNbCities = function() {
        return db.cities.length;
    }
    

    this.addRoad = function(city_idx_1, city_idx_2) {
        var city1 = db.getCity(city_idx_1);
        var city2 = db.getCity(city_idx_2);        
        db.roads.push([city_idx_1, city_idx_2]);
        renderer.line(city1.lng, city1.lat, city2.lng, city2.lat, 0.4);
    }


    this.getNbRoads = function(city_idx) {
        return this.getCityRoads().length;
    }

    this.getCityRoads = function(city_idx) {
        var res = [];
        for(var i=0; i<db.roads.length; i++) {
            if(db.roads[i][0] == city_idx || db.roads[i][1] == city_idx) {
                res.push(i);
            }
        }
        return res;        
    }


    this.getCityLongitude = function(city_idx) {
        var city = db.getCity(city_idx);
        return city.lng;
    }
    

    this.getCityLatitude = function(city_idx) {
        var city = db.getCity(city_idx);
        return city.lat;
    }
    

    this.getRoadLength = function(road_idx) {
        var road = db.getRoad(road_idx);
        var city1 = db.getCity(road[0]);
        var city2 = db.getCity(road[1]);
        return distance_calc.calculate(city1.lng, city1.lat, city2.lng, city2.lat);
    }
    

    this.highlightRoad = function(road_idx) {
        var road = db.getRoad(road_idx);
        var city1 = db.getCity(road[0]);
        var city2 = db.getCity(road[1]);
        renderer.line(city1.lng, city1.lat, city2.lng, city2.lat, 1);        
    }
    
    this.getDestinationCity = function(city_idx, road_idx) {
        var road = db.getRoad(road_idx);
        if(road[0] == city_idx) {
            return road[1];
        } else if(road[1] == city_idx) {
            return road[0];
        }
        throw new Error('Road not found');
    }


    this.clearMap = function() {
        renderer.clear();
    }


}