var getContext = function(display, infos) {

    var language_strings = {
        fr: {
            categories: {
                sound: 'Sound',
                control: 'Control'
            },
            label: {
                addLocation: 'addLocation(%1, %2, %3)',

            },
            code: {
                addLocation: 'addLocation',
            },
            description: {
                addLocation: 'Draw a pin with a 1 or 2 letter label at the given coordinates',

            },
            startingBlockName: "Programme",
            constantLabel: {
            },
            messages: {
            }
        }
    }



    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(language_strings)
    var db;


    context.reset = function(taskInfos) {
        if(!context.display || map) return
        if(!db) {
            //var options = $.extend({ parent: $('#grid')[0] }, infos.mapConfig);

        }
        //map.clearMap();
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}
    context.changeDelay = function(actionDelay) {}
    context.onExecutionEnd = function() {}



    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
    }

    context.customBlocks = {
        map: {
            map: [
                { name: 'addLocation',
                    params: ['Number', 'Number', 'String'],
                    params_names: ['longitude', 'latitude', 'label']
                },

                { name: 'geoDistance',
                    yieldsValue: true,
                    params: ['Number', 'Number', 'Number', 'Number'],
                    params_names: ['longitude1', 'latitude1', 'longitude2', 'latitude2']
                },

            ]
        }
    }


    context.database = {}

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
                context.database[block.name] = function() {
                    var callback = arguments[arguments.length - 1]
                    var res = map[block.name].apply(database, arguments)
                    callback(res)
                }
           })();
        }
    }

    return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('database', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['database', getContext]);
}
