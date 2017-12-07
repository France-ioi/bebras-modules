var getContext = function(display, infos) {

    var simple_draw_strings = {
        fr: {
            categories: {
                draw: 'Draw',
                control: 'Control'
            },
            label: {
                setPoint: 'setPoint(%1,%2,%3)',
                addString: 'addString(%1, %2, %3, %4)',
                addLine: 'addLine(%1, %2, %3, %4, %5)',
                addCircle: 'addCircle(%1, %2, %3, %4)',
                reset: 'reset()',
                resetSize: 'resetSize(%1, %2)'
            },
            code: {
                setPoint: 'setPoint',
                addString: 'addString',
                addLine: 'addLine',
                addCircle: 'addCircle',
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
                reset: 'reset() Erases everything. Width and height are set back to 1 (the default value)',
                resetSize: 'resetSize(w,h)  Erases everything. Width is set to w, height is set to h',
            },
            startingBlockName: "Programme",
            messages: {}
        }
    }

    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(simple_draw_strings)
    var draw;

    context.reset = function(taskInfos) {
        if(!context.display) return
        draw && draw.destroy()
        //$('#grid').empty()
        draw = new SimpleDraw({
            parent: $('#grid')[0]
        })
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}



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
                    var callback = arguments[arguments.length - 1]
                    draw && draw[block.name].apply(draw, arguments)
                    callback()
                }

           })();
        }
     }


    return context;
}