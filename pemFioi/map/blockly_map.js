var getContext = function(display, infos) {

    var map_strings = {
        en: {
            categories: {
                map: 'Carte'
            },
            label: {
                clearMap: 'clearMap()',
                addLocation: 'addLocation(%1, %2, %3)',
                addRoad: 'addRoad(%1, %2, %3, %4, %5)',
                geoDistance: 'geoDistance(%1, %2, %3, %4)',
                getLatitude: 'getLatitude(%1)',
                getLongitude: 'getLongitude(%1)',
                getNeighbors: 'getNeighbors(%1)',
                shortestPath: 'shortestPath(%1, %2)',
                echo: 'afficher(%1)'
            },
            code: {
                clearMap: 'clearMap',
                addLocation: 'addLocation',
                addRoad: 'addRoad',
                geoDistance: 'geoDistance',
                getLatitude: 'getLatitude',
                getLongitude: 'getLongitude',
                getNeighbors: 'getNeighbors',
                shortestPath: 'shortestPath',
                echo: 'afficher'
            },
            description: {
                clearMap: 'Delete everything from the map (roads and locations)',
                addLocation: 'Draw a pin with a 1 or 2 letter label at the given coordinates',
                addRoad: 'Draw a road (a straight line) between the two locations, with given opacity (between 0 and 1)',
                geoDistance: 'returns the geo distance between the two locations, in km.',
                getLatitude: 'Returns the latitude of the city',
                getLongitude: 'Returns the longitude of the city',
                getNeighbors: 'Returns the list of neighbors of the city',
                shortestPath: 'Returns the shortest path between the two cities, using geoDistance',
                echo: 'Afficher'
            },
            startingBlockName: "Program",
            constantLabel: {
            },
            messages: {
            }
        }
    }





    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(map_strings)
    var map;
    var logger;

    var conceptBaseUrl = (window.location.protocol == 'https' ? 'https' : 'http') + '//'
        + 'static4.castor-informatique.fr/help/map.html';
    context.conceptList = [
        {id: 'map_introduction', name: 'La proglet googleMaps', url: conceptBaseUrl+'#map_introduction'},
        {id: 'map_clearMap', name: 'Effacer la carte', url: conceptBaseUrl+'#map_mapDisplay'},
        {id: 'map_addLocation', name: 'Mettre en évidence un point de la carte', url: conceptBaseUrl+'#map_mapDisplay'},
        {id: 'map_addRoad', name: 'Tracer une ligne droite', url: conceptBaseUrl+'#map_mapDisplay'},
        {id: 'map_getLatitude', name: 'Table des latitudes', url: conceptBaseUrl+'#map_geoData'},
        {id: 'map_getLongitude', name: 'Table des longitudes', url: conceptBaseUrl+'#map_geoData'},
        {id: 'map_getNeighbors', name: 'Table des voisins', url: conceptBaseUrl+'#map_geoData'},
        {id: 'map_geoDistance', name: 'Distance entre deux points', url: conceptBaseUrl+'#map_geoComputing'},
        {id: 'map_shortestPath', name: 'Chemin entre deux villes', url: conceptBaseUrl+'#map_geoComputing'}
        ];


    context.reset = function(taskInfos) {
        if(!context.display) return
        if(!map) {
            var options = $.extend({ parent: $('#grid')[0] }, infos.mapConfig);
            map = new Map(options);
            logger = new Logger({
                parent: $('#gridContainer')
            });
        }
        map.clearMap();
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
                { name: 'clearMap' },
                { name: 'addLocation',
                    params: ['Number', 'Number', 'String'],
                    params_names: ['longitude', 'latitude', 'label']
                },
                { name: 'addRoad',
                    params: ['Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['longitude1', 'latitude1', 'longitude2', 'latitude2', 'opacity']
                },
                { name: 'geoDistance',
                    yieldsValue: true,
                    params: ['Number', 'Number', 'Number', 'Number'],
                    params_names: ['longitude1', 'latitude1', 'longitude2', 'latitude2']
                },
                { name: 'getLatitude',
                    yieldsValue: true,
                    params: ['String'],
                    params_names: ['cityName']
                },
                { name: 'getLongitude',
                  yieldsValue: true,
                    params: ['String'],
                    params_names: ['cityName']
                },
                { name: 'getNeighbors',
                    yieldsValue: true,
                    params: ['String'],
                    params_names: ['cityName']
                },
                { name: 'shortestPath',
                    yieldsValue: true,
                    params: ['String', 'String'],
                    params_names: ['cityName1', 'cityName2']
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
