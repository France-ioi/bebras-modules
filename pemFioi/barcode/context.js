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
                getPixelLuminosity: 'getPixelLuminosity',
                setPixelLuminosity: 'setPixelLuminosity',
                width: 'width',
                height: 'height',                
                printResult: 'printResult description'
            },
            startingBlockName: "Program",
            messages: {
                success: 'Success',
                mistake: 'Mistake',
                result: 'Result:'                
            },
            ui: {
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


    var ready = false;

    context.reset = function(taskInfos) {
        if(taskInfos) {
            context.valid_result = taskInfos.valid_result || {};
        }

        if(ready) {
            return;
        }
        $('#grid').empty();
        ready = true;

        context.barcodeDisplay = BarcodeDisplay({
            parent: $('#grid'),
            image: taskInfos.image
        }, function(b) {
            //console.log('getPixelLuminosity', b.getPixelLuminosity(10,10))
        })

        $(window).resize(function() {
            context.barcodeDisplay.resize();
        });

        if(!context.display) return;

    }




    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}


    var result = {

        data: '',
        element: null,

        init: function() {
            var el = $('#barcode-result');
            if(el.length == 0) {
                this.element = $('<span>')
                var wrapper = $('<div id="barcode-result"><span>' + strings.messages.result + '</span> </div>');
                wrapper.append(this.element)
                $('#grid').append(wrapper);
            }
        },
        
        set: function(str) {
            this.init();
            this.data = str;
            this.element && this.element.html(str);
        }
    }

    context.gradeResult = function() {
        if(result.data == context.valid_result.data) {
            context.success = true;
            throw(strings.messages.success);
        }
        throw new Error(strings.messages.mistake);
    }


    context.barcode = {

        getPixelLuminosity: function(x, y, callback) {
            context.waitDelay(callback, context.barcodeDisplay.getPixelLuminosity(x, y));
        },

        setPixelLuminosity: function(x, y, v, callback) {
            context.waitDelay(callback, function() {});
        },        

        width: function(callback) {
            context.waitDelay(callback, context.barcodeDisplay.width());
        },        

        height: function(callback) {
            context.waitDelay(callback, context.barcodeDisplay.height());
        },

        printResult: function(v, callback) {
            context.waitDelay(callback, result.set(v));
        },        
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
                    params: ['Number', 'Number', 'String'],
                    params_names: ['x', 'y', 'value'],
                    yieldsValue: true
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