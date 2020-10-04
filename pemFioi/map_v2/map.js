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
        if(city_idx_1 == city_idx_2) {
            throw new Error('The road must connect different cities')
        }
        var city1 = db.getCity(city_idx_1);
        var city2 = db.getCity(city_idx_2);        
        db.roads.push({
            city_idx_1: city_idx_1,
            city_idx_2: city_idx_2,
            highlighted: false
        });
        renderer.line(city1.lng, city1.lat, city2.lng, city2.lat, 0.4);
    }


    this.getNbRoads = function(city_idx) {
        return this.getCityRoads(city_idx).length;
    }

    this.getCityRoads = function(city_idx) {
        var res = [];
        for(var i=0; i<db.roads.length; i++) {
            if(db.roads[i].city_idx_1 == city_idx || db.roads[i].city_idx_2 == city_idx) {
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
        var city1 = db.getCity(road.city_idx_1);
        var city2 = db.getCity(road.city_idx_2);
        return distance_calc.calculate(city1.lng, city1.lat, city2.lng, city2.lat);
    }
    

    this.highlightRoad = function(road_idx) {
        var road = db.getRoad(road_idx);
        road.highlighted = true;
        var city1 = db.getCity(road.city_idx_1);
        var city2 = db.getCity(road.city_idx_1);
        renderer.line(city1.lng, city1.lat, city2.lng, city2.lat, 1);        
    }
    
    this.getDestinationCity = function(city_idx, road_idx) {
        var road = db.getRoad(road_idx);
        if(road.city_idx_1 == city_idx) {
            return road.city_idx_2;
        } else if(road.city_idx_2 == city_idx) {
            return road.city_idx_1;
        }
        throw new Error('Road not found');
    }


    this.clearMap = function() {
        renderer.clear();
    }



    /*
    data: {
        cities: array of cities,
        roads: array of roads,
        bias: distance in kilometers by default (check options.unit param)
    }
    */
    this.validate = function(valid_data) {
       
        // check cities
        if(db.cities.length != valid_data.cities.length) {
            return {
                success: false,
                message: 'Wrong amount of cities'
            }            
        }
        for(var i=0; i<valid_data.cities.length; i++) {
            var city1 = valid_data.cities[i], 
                city2, 
                distance, 
                found = false;
            for(var j=0; j<db.cities.length; j++) {
                city2 = db.cities[j];
                distance = distance_calc.calculate(city1.lng, city1.lat, city2.lng, city2.lat);
                if(distance <= valid_data.bias) {
                    found = true;
                }
            }
            if(!found) {
                return {
                    success: false,
                    message: 'City missed'
                }                            
            }
        }

        // check roads
        if(db.cities.length != valid_data.cities.length) {
            return {
                success: false,
                message: 'Wrong amount of roads'
            }                                        
        }        
        for(var i=0; i<valid_data.roads.length; i++) {
            var road1 = valid_data.roads[i], 
                road2, 
                found = false;
            for(var j=0; j<db.roads.length; j++) {
                road2 = db.roads[j];
                var fl1 = road1.city_idx_1 == road2_city_idx_1 && road1.city_idx_2 == road2_city_idx_2;
                var fl2 = road1.city_idx_1 == road2_city_idx_2 && road1.city_idx_2 == road2_city_idx_1;
                if(fl1 || fl2) {
                    found = true;
                }
            }
            if(!found) {
                return {
                    success: false,
                    message: 'Road missed'
                }                                                        
            }
        }

        return {
            success: true,
            message: 'Success'
        }
    }


    this.destroy = function() {
        renderer.destroy();
    }
}