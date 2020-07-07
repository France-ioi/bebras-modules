var getContext = function(display, infos, curLevel) {

    var language_strings = {
        en: {
            categories: {
                barcode: 'Barcode'
            },
            label: {
                getPixelLuminosity: 'getPixelLuminosity(%1, %2)',
                setPixelLuminosity: 'setPixelLuminosity(%1, %2, %3)',
                width: 'width()',
                height: 'height()',
                printResult: 'printResult(%1)'
            },
            code: {
                getPixelLuminosity: 'getPixelLuminosity',
                setPixelLuminosity: 'setPixelLuminosity',
                width: 'width',
                height: 'height',
                printResult: 'printResult'
            },
            description: {
                getPixelLuminosity: '',
                setPixelLuminosity: '',
                width: '',
                height: '',                
                printResult: ''
            },
            startingBlockName: "Program",
            messages: {
                success: 'Success',
                mistake_digit: 'The digit with a red background is incorrect',
                mistake_pixel: 'The pixel with a red border is incorrect',
                result: 'Result:'                
            }
        }
    }

    var context = quickAlgoContext(display, infos)
    context.inlinePopupMessage = true;
    var strings = context.setLocalLanguageStrings(language_strings)

    /*
    var conceptBaseUrl = window.location.protocol + '//static4.castor-informatique.fr/help/index.html';
    context.conceptList = [
        {id: 'test', name: 'test', url: conceptBaseUrl+'#test'},
    ];
    */



    context.reset = function(taskInfos) {
        var grid = $('#grid');
        if(context.display) {
            grid.empty();
        }        
        

        context.barcodeDisplay = DisplaysManager.get(
            'BarcodeDisplay',
            context.iTestCase,
            context.display,
            grid
        );


        context.stringDisplay = DisplaysManager.get(
            'StringDisplay',
            context.iTestCase,
            context.display,
            grid,
            {
                strings: strings
            }
        );            

        context.userDisplay = DisplaysManager.get(
            'UserDisplay',
            context.iTestCase,
            context.display,
            grid
        );        
        
       
        if(taskInfos) {
            context.valid_result = taskInfos.valid_result || {};
            context.barcodeDisplay.setImage(taskInfos.image);
            taskInfos.user_display && context.userDisplay.setSize(taskInfos.user_display);
        }
       
    }




    context.setScale = function(scale) {}
    context.updateScale = function() {
        context.barcodeDisplay && context.barcodeDisplay.render();
        context.userDisplay && context.userDisplay.render();
    }
    context.resetDisplay = function() {}
    context.unload = function() {}





    context.gradeResult = function() {
        switch(context.valid_result.type) {
            case 'string':
                context.success = context.stringDisplay.diff(context.valid_result.data);
                var error = strings.messages.mistake_digit;
                break;
            case 'array':
                context.success = context.userDisplay.diff(context.valid_result.data);
                var error = strings.messages.mistake_pixel;
                break;
        }
        if(context.success) {
            throw(strings.messages.success);
            return;
        }
        throw new Error(error);                        
    }


    context.barcode = {

        getPixelLuminosity: function(x, y, callback) {
            var cb = context.runner.waitCallback(callback);
            context.barcodeDisplay.getPixelLuminosity(x, y, function(value) {
                // Add a delay
                setTimeout(function() {
                    cb(value);
                }, context.infos.actionDelay);
            })
        },

        setPixelLuminosity: function(x, y, v, callback) {
            context.waitDelay(callback, context.userDisplay.setPixelLuminosity(x, y, v));
        },        

        width: function(callback) {
            var cb = context.runner.waitCallback(callback);
            context.barcodeDisplay.getSize(function(size) {
                cb(size.width);
            });
        },        

        height: function(callback) {
            var cb = context.runner.waitCallback(callback);
            context.barcodeDisplay.getSize(function(size) {
                cb(size.height);
            });            
        },

        printResult: function(v, callback) {
            context.waitDelay(callback, context.stringDisplay.setData(v));
        }
    }


    context.customBlocks = {
        barcode: {
            barcode: [
                { name: 'getPixelLuminosity',
                    params: ['Number', 'Number'],
                    params_names: ['x', 'y'],
                    yieldsValue: true
                },                
                { name: 'setPixelLuminosity',
                    params: ['Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'value']
                },
                { name: 'width',
                    params: [],
                    params_names: [],
                    yieldsValue: true
                },                                
                { name: 'height',
                    params: [],
                    params_names: [],
                    yieldsValue: true
                },                                                
                { name: 'printResult',
                    params: ['String'],
                    params_names: ['v']
                },
            ]
        }
    }

    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
        'Block': { bType: 'input_value', fName: 'BLOCK', defVal: '' },
    }
    BlocksHelper.convertBlocks(context, 'barcode', typeData);
    return context;
}

if(window.quickAlgoLibraries) {
    quickAlgoLibraries.register('barcode', getContext);
} else {
    if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
    window.quickAlgoLibrariesList.push(['barcode', getContext]);
}