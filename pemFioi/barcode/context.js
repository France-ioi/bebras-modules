var getContext = function(display, infos, curLevel) {

    var language_strings = {
        en: {
            categories: {
                barcode: 'Image'
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
                mistake_empty: 'Your program didn\'t print anything',
                mistake_length: 'The printed result has an incorrect length',
                mistake_pixel: 'The pixel with a red border has luminosity %1, but should have luminosity %2',
                result: 'Result:',
                tooltip: 'Coordinates (%1, %2), luminosity %3'
            }
        },
        fr: {
            categories: {
                barcode: 'Image'
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
                getPixelLuminosity: 'getPixelLuminosity(col, line) obtient la luminosité à la colonne et ligne données',
                setPixelLuminosity: 'setPixelLuminosity(col, line, luminosity) modifie la luminosité à la colonne et ligne données',
                width: 'width() retourne la largeur de l\'image',
                height: 'height() retourne la hauteur de l\'image',
                printResult: 'printResult(string) affiche le résultat'
            },
            startingBlockName: "Programme",
            messages: {
                success: 'Success',
                mistake_digit: 'Le chiffre sur fond rouge est incorrect',
                mistake_empty: 'Votre programme n\'a rien affiché',
                mistake_length: 'Le résultat affiché n\'a pas la bonne longueur',
                mistake_pixel: 'Le pixel encadré en rouge a la luminosité %1, mais devrait avoir la luminosité %2',
                mistake_pixel: 'Le(s) pixel(s) avec une bordure rouge sont incorrects',
                result: 'Résultat :',
                tooltip: 'Coordonnées (%1, %2), luminosité %3'
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
            grid,
            {
                strings: strings
            }
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
            grid,
            {
                strings: strings
            }
        );

        if(context.display) {
            // Save last displayed for updateScale
            context.lastBarcodeDisplay = context.barcodeDisplay;
            context.lastStringDisplay = context.stringDisplay;
            context.lastUserDisplay = context.userDisplay;
        }

        if(taskInfos) {
            context.valid_result = taskInfos.valid_result || {};
            context.barcodeDisplay.setImage(taskInfos.image);

            if(taskInfos.user_display) {
                context.userDisplay.setSize(taskInfos.user_display);
            } else {
                context.userDisplay.clear();
            }
        } else {
            context.stringDisplay.reset();
            context.userDisplay.reset();
        }

    }




    context.setScale = function(scale) {}
    context.updateScale = function() {
        context.lastBarcodeDisplay && context.lastBarcodeDisplay.render();
        context.lastUserDisplay && context.lastUserDisplay.render();
    }
    context.resetDisplay = function() {}
    context.unload = function() {}





    context.gradeResult = function() {
        switch(context.valid_result.type) {
            case 'string':
                var res = context.stringDisplay.diff(context.valid_result);
                break;
            case 'array':
                var res = context.userDisplay.diff(context.valid_result);
                break;
        }
        context.success = res.success;
        if(context.success) {
            throw(res.message);
            return;
        }
        throw new Error(res.message);
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
