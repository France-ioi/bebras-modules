var getContext = function(display, infos) {

    var simple_draw_strings = {
        en: {
            categories: {
                draw: 'Draw',
                control: 'Control'
            },
            label: {
                setPoint: 'setPoint(%1, %2, %3)',
                addString: 'addString(%1, %2, %3, %4)',
                addLine: 'addLine(%1, %2, %3, %4, %5)',
                addCircle: 'addCircle(%1, %2, %3, %4)',
                waitForClick: 'waitForClick()',
                getX: 'getX()',
                getY: 'getY()',
                reset: 'reset()',
                resetSize: 'resetSize(%1, %2)'
            },
            code: {
                setPoint: 'setPoint',
                addString: 'addString',
                addLine: 'addLine',
                addCircle: 'addCircle',
                waitForClick: 'waitForClick',
                getX: 'getX',
                getY: 'getY',
                reset: 'reset',
                resetSize: 'resetSize',
            },
            description: {
                setPoint: 'setPoint(x, y, c) Add point (x,y) to a curve identified by c (there is one curve per color).\n' +
                    'Each curve is a sequence of points connected by segments.\n'+
                    'x is a float between -width and width\n'+
                    'y is a float between -height and height\n '+
                    'c identifies the color as well as the curve to which the point is added.',
                addString: 'addString(x, y, s, c) Adds the string s at position x,y with color c',
                addLine: 'addLine(x1, y1, x2, y2, c) Adds a line between the points (x1, y1) and (x2, y1) with color c',
                addCircle: 'addCircle(x, y, r, c) Adds a circle of center (x,y), radius r with color c',
                waitForClick: 'waitForClick() Waits for a click and then stores the coordinates x and y of the click',
                getX: 'getX() Returns the X coordinate of last click waited for with waitForClick',
                getY: 'getY() Returns the Y coordinate of last click waited for with waitForClick',
                reset: 'reset() Erases everything. Width and height are set back to 1 (the default value)',
                resetSize: 'resetSize(w,h)  Erases everything. Width is set to w, height is set to h',
            },
            startingBlockName: "Program",
            messages: {
                clickCanvas: 'Please click on the canvas'
            }
        },
        fr: {
            // TODO :: translate
            categories: {
                draw: 'Tracé',
                control: 'Contrôle'
            },
            label: {
                setPoint: 'setPoint(%1, %2, %3)',
                addString: 'addString(%1, %2, %3, %4)',
                addLine: 'addLine(%1, %2, %3, %4, %5)',
                addCircle: 'addCircle(%1, %2, %3, %4)',
                waitForClick: 'waitForClick()',
                getX: 'getX()',
                getY: 'getY()',
                reset: 'reset()',
                resetSize: 'resetSize(%1, %2)'
            },
            code: {
                setPoint: 'setPoint',
                addString: 'addString',
                addLine: 'addLine',
                addCircle: 'addCircle',
                waitForClick: 'waitForClick',
                getX: 'getX',
                getY: 'getY',
                reset: 'reset',
                resetSize: 'resetSize',
            },
            description: {
                setPoint: 'setPoint(x, y, c) Add point (x,y) to a curve identified by c (there is one curve per color).\n' +
                    'Each curve is a sequence of points connected by segments.\n'+
                    'x is a float between -width and width\n'+
                    'y is a float between -height and height\n '+
                    'c identifies the color as well as the curve to which the point is added.',
                addString: 'addString(x, y, s, c) Adds the string s at position x,y with color c',
                addLine: 'addLine(x1, y1, x2, y2, c) Adds a line between the points (x1, y1) and (x2, y1) with color c',
                addCircle: 'addCircle(x, y, r, c) Adds a circle of center (x,y), radius r with color c',
                waitForClick: 'waitForClick() Waits for a click and then stores the coordinates x and y of the click',
                getX: 'getX() Returns the X coordinate of last click waited for with waitForClick',
                getY: 'getY() Returns the Y coordinate of last click waited for with waitForClick',
                reset: 'reset() Erases everything. Width and height are set back to 1 (the default value)',
                resetSize: 'resetSize(w,h)  Erases everything. Width is set to w, height is set to h',
            },
            startingBlockName: "Programme",
            messages: {
                clickCanvas: 'Veuillez cliquer sur la zone de dessin'
            }
        }
    }

    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(simple_draw_strings)
    var draw;

    var conceptBaseUrl = window.location.protocol + '//'
        + 'static4.castor-informatique.fr/help/javascool.html';
    context.conceptList = [
        {id: 'javascool_introduction', name: 'La proglet algoDeMaths', url: conceptBaseUrl+'#javascool_introduction'},
        {id: 'javascool_setPoint', name: 'Tracer des points', url: conceptBaseUrl+'#javascool_setPoint'},
        {id: 'javascool_reset', name: 'Effacer la courbe', url: conceptBaseUrl+'#javascool_reset'},
        {id: 'javascool_reset_largeur_hauteur', name: "Changer l'échelle horizontale et verticale", url: conceptBaseUrl+'#javascool_reset_largeur_hauteur'},
        {id: 'javascool_addString', name: 'Ajouter une étiquette', url: conceptBaseUrl+'#javascool_addString'},
        {id: 'javascool_addLine', name: 'Ajouter une ligne', url: conceptBaseUrl+'#javascool_addLine'},
        {id: 'javascool_addCircle', name: 'Ajouter un cercle', url: conceptBaseUrl+'#javascool_addCircle'},
        {id: 'javascool_get', name: 'Clics', url: conceptBaseUrl+'#javascool_get'},
        {id: 'javascool_notes', name: 'Exemples algoDeMaths', url: conceptBaseUrl+'#javascool_notes'}
        ];

    context.reset = function(taskInfos) {
        if(!context.display) return
        draw && draw.destroy()
        //$('#grid').empty()
        draw = new SimpleDraw({
            context: context,
            parent: $('#grid')[0]
        })
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {
        draw && draw.destroy();
    }



    context.customBlocks = {
        javascool: {
            draw: [
                { name: "setPoint",
                    params: ['Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'color']
                },
                { name: "addString",
                    params: ['Number', 'Number', 'String', 'Number'],
                    params_names: ['x', 'y', 'string', 'color']
                },
                { name: "addLine",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x1', 'y1', 'x2', 'y2', 'color']
                },
                { name: "addCircle",
                    params: ['Number', 'Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'radius', 'color']
                },
            ],
            control: [
                { name: 'waitForClick', hasHandler: true },
                { name: 'getX', yieldsValue: true},
                { name: 'getY', yieldsValue: true},
                { name: 'reset' },
                { name: "resetSize",
                    params: ['Number', 'Number'],
                    params_names: ['scale_x', 'scale_y']
                }
            ]
        }
    }

    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' }
    }


    context.javascool = {}

    for (var category in context.customBlocks.javascool) {
        for (var iBlock = 0; iBlock < context.customBlocks.javascool[category].length; iBlock++) {
            (function() {
                var block = context.customBlocks.javascool[category][iBlock];
                var params = [];
                if (block.params) {
                    block.blocklyJson = { inputsInline: true, args0: {} }
                    block.blocklyXml = '<block type="' + block.name + '">';
                    var blockArgs = block.blocklyJson.args0;
                    for (var iParam = 0; iParam < block.params.length; iParam++) {
                        params[iParam] = block.params[iParam];
                        var paramData = typeData[params[iParam]] || { bType: 'input_value' };
                        blockArgs[iParam] = { type: paramData.bType, name: "PARAM_" + iParam }
                        block.blocklyXml +=
                            '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                            '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                            '</shadow></value>';
                    }
                    block.blocklyXml += '</block>';
                }

                context.javascool[block.name] = function() {
                    var callback = arguments[arguments.length - 1];
                    if(draw) {
                        if(block.hasHandler) {
                            // This function knows how to take care of the callback
                            draw[block.name].apply(draw, arguments);
                        } else {
                            context.waitDelay(callback, draw[block.name].apply(draw, arguments))
                        }
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
   quickAlgoLibraries.register('draw', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['draw', getContext]);
}
