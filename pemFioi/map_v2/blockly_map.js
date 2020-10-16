var getContext = function(display, infos) {

    var map_strings = {
        en: {
            categories: {
                map: 'Map'
            },
            label: {
                addCity: 'addCity(%1, %2, %3)',
                getNbCities: 'getNbCities()',
                addRoad: 'addRoad(%1, %2)',
                getNbRoads: 'getNbRoads(%1)',
                getCityRoads: 'getCityRoads(%1)',
                getCityLongitude: 'getCityLongitude(%1)',
                getCityLatitude: 'getCityLatitude(%1)',
                getRoadLength: 'getRoadLength(%1)',
                highlightRoad: 'highlightRoad(%1)',
                getDestinationCity: 'getDestinationCity(%1, %2)',
                echo: 'afficher(%1)'
            },
            code: {
                addCity: 'addCity',
                getNbCities: 'getNbCities',
                addRoad: 'addRoad',
                getNbRoads: 'getNbRoads',
                getCityRoads: 'getCityRoads',
                getCityLongitude: 'getCityLongitude',
                getCityLatitude: 'getCityLatitude',
                getRoadLength: 'getRoadLength',
                highlightRoad: 'highlightRoad',
                getDestinationCity: 'getDestinationCity',
                echo: 'afficher'
            },
            description: {
                addCity: 'Add city',
                getNbCities: 'Return amount of cities',
                addRoad: 'Add road between the two cities',
                getNbRoads: 'Returns the amount of roads to the city',
                getCityRoads: 'Returns the list of roads to the city',
                getCityLongitude: 'Returns the longitude of the city',
                getCityLatitude: 'Returns the latitude of the city',
                getRoadLength: 'Return the road length',
                highlightRoad: 'Highlight the toad',
                getDestinationCity: 'Return destination city',
                echo: 'Afficher'
            },
            startingBlockName: "Program",
            constantLabel: {
            },
            messages: {
            },
            map: {
                lng_not_number: 'Longitude is not a number',
                lng_out_of_range: 'Longitude is outside of the map',
                lat_not_number: 'Latitude is not a number',
                lat_out_of_range: 'Latitude is outside of the map',
                city_not_found: 'City not found',
                road_not_found: 'Road not found',
                road_end_error: 'The road must connect different cities',
                road_exists: 'The road already exists',
                mistake_cities_amount: 'Wrong amount of cities',
                mistake_city_missed: 'City missed',
                mistake_roads_amount: 'Wrong amount of roads',
                mistake_road_missed: 'Road missed',
                success: 'Success'
            }
        }
    }





    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(map_strings)
    var map;
    var logger;



    context.reset = function() {
        if(!context.display) return;
        if(!map) {
            var options = Object.assign({ 
                parent: $('#grid')[0],
                strings: strings.map
            }, infos.mapConfig);
            
            map = new Map(options);
            logger = new Logger({
                parent: $('#gridContainer')
            });
        }
        map.clearMap();
    }

    infos.checkEndCondition = function(context, lastTurn) {
        context.success = false;
        throw ('test');        
        /*
        var res = map.validate(infos.mapValidData);
        context.success = res.success;
        throw(res.message);
        */
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}
    context.onExecutionEnd = function() {}



    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
    }

    context.customBlocks = {
        map: {
            map: [
                { name: 'addCity',
                    params: ['Number', 'Number', 'String'],
                    params_names: ['longitude', 'latitude', 'name']
                },
                { name: 'getNbCities',
                    yieldsValue: true,
                    params: [],
                    params_names: []
                },
                { name: 'addRoad',
                    params: ['Number', 'Number'],
                    params_names: ['city_idx_1', 'city_idx_2']
                },
                { name: 'getNbRoads',
                    yieldsValue: true,
                    params: ['Number'],
                    params_names: ['city_idx']
                },
                { name: 'getCityRoads',
                    yieldsValue: true,
                    params: ['Number'],
                    params_names: ['city_idx']
                },
                { name: 'getCityLongitude',
                    yieldsValue: true,
                    params: ['Number'],
                    params_names: ['city_idx']
                },
                { name: 'getCityLatitude',
                    yieldsValue: true,
                    params: ['Number'],
                    params_names: ['city_idx']
                },
                { name: 'getRoadLength',
                    yieldsValue: true,
                    params: ['Number'],
                    params_names: ['road_idx']
                },
                { name: 'highlightRoad',
                    params: ['Number'],
                    params_names: ['road_idx']
                },
                { name: 'getDestinationCity',
                    yieldsValue: true,
                    params: ['Number', 'Number'],
                    params_names: ['city_idx', 'road_idx']                    
                },
                { name: 'echo',
                    params: ['String'],
                    params_names: ['value']
                }
            ]
        }
    }


    context.map = {
        echo: function(msg, callback) {
            logger.put(msg);
            callback();
        }
    }


    for (var category in context.customBlocks.map) {
        for (var iBlock = 0; iBlock < context.customBlocks.map[category].length; iBlock++) {
            (function() {
                var block = context.customBlocks.map[category][iBlock];
                if (block.params) {
                    block.blocklyJson = { inputsInline: true, args0: {} }
                    var blockArgs = block.blocklyJson.args0;
                    block.blocklyXml = '<block type="' + block.name + '">';
                    for (var iParam = 0; iParam < block.params.length; iParam++) {
                        var paramData = typeData[block.params[iParam]] || { bType: 'input_value' };
                        blockArgs[iParam] = { type: paramData.bType, name: "PARAM_" + iParam }
                        block.blocklyXml +=
                            '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                            '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                            '</shadow></value>';
                    }
                    block.blocklyXml += '</block>';
                }
                if(context.map[block.name]) {
                    return;
                }
                context.map[block.name] = function() {
                    var callback = arguments[arguments.length - 1];
                    if(map) {
                        context.waitDelay(callback, map[block.name].apply(map, arguments))
                    } else {
                        callback();
                    }
                }
           })();
        }
    }

    return context;
}

if(window.quickAlgoLibraries) {
    quickAlgoLibraries.register('map', getContext);
 } else {
    if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
    window.quickAlgoLibrariesList.push(['map', getContext]);
 }