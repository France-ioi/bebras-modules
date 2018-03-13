var getContext = function(display, infos) {

    var localLanguageStrings = {
        fr: {
            categories: {
                draw: 'Dessin'
            },
            label: {
                initDrawing: 'initDrawing(%1, %2, %3, %4, %5)',
                drawRect: 'drawRect(%1, %2, %3, %4, %5, %6, %7)',
                paintRect: 'paintRect(%1, %2, %3, %4, %5, %6, %7)',
                drawCircle: 'drawCircle(%1, %2, %3, %4, %5, %6)',
                paintCircle: 'paintCircle(%1, %2, %3, %4, %5, %6)',
                drawPixel: 'drawPixel(%1, %2, %3, %4, %5)',
                drawLine: 'drawLine(%1, %2, %3, %4, %5, %6, %7)',
                showDrawing: 'showDrawing()'
            },
            code: {
                initDrawing: 'initDrawing',
                drawRect: 'drawRect',
                paintRect: 'paintRect',
                drawCircle: 'drawCircle',
                paintCircle: 'paintCircle',
                drawPixel: 'drawPixel',
                drawLine: 'drawLine',
                showDrawing: 'showDrawing'
            },
            description: {
            },
            startingBlockName: "Programme",
            messages: {
                clickCanvas: 'Veuillez cliquer sur le dessin.',
                errorInitDone: "Erreur : La fonction initDrawing ne doit être appelée qu'une seule fois par exécution.",
                errorInvalidParameters : "Erreur : Argument invalide.",
                errorNoInit: "Erreur : le dessin n'a pas été initialisé avec initDrawing."
            }
        }
    }

    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(localLanguageStrings)

    var conceptBaseUrl = window.location.protocol + '//'
        + 'static4.castor-informatique.fr/help/index.html';
    context.conceptList = [
/*        {id: 'javascool_introduction', name: 'La proglet algoDeMaths', url: conceptBaseUrl+'#javascool_introduction'},
        {id: 'javascool_setPoint', name: 'Tracer des points', url: conceptBaseUrl+'#javascool_setPoint'},
        {id: 'javascool_reset', name: 'Effacer la courbe', url: conceptBaseUrl+'#javascool_reset'},
        {id: 'javascool_reset_largeur_hauteur', name: "Changer l'échelle horizontale et verticale", url: conceptBaseUrl+'#javascool_reset_largeur_hauteur'},
        {id: 'javascool_addString', name: 'Ajouter une étiquette', url: conceptBaseUrl+'#javascool_addString'},
        {id: 'javascool_addLine', name: 'Ajouter une ligne', url: conceptBaseUrl+'#javascool_addLine'},
        {id: 'javascool_addCircle', name: 'Ajouter un cercle', url: conceptBaseUrl+'#javascool_addCircle'},
        {id: 'javascool_get', name: 'Clics', url: conceptBaseUrl+'#javascool_get'},
        {id: 'javascool_notes', name: 'Exemples algoDeMaths', url: conceptBaseUrl+'#javascool_notes'}*/
        ];

    context.canvas = null;
    context.canvasCtx = null;
    context.canvasOpts = {};
    context.isndraw = {};

    context.reset = function(taskInfos) {
        context.canvas = null;
        context.canvasCtx = null;
        context.canvasOpts = {};
        if(context.display) {
            context.resetDisplay();
        }
    };


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {
        $('#grid').html('');
        context.canvas = document.createElement('canvas');
        context.canvas.width = 402;
        context.canvas.height = 402;
        $('#grid')[0].appendChild(context.canvas);
        context.canvasCtx = context.canvas.getContext("2d");
        context.canvasCtx.strokeStyle = 'black';
        context.canvasCtx.strokeRect(0, 0, 402, 402);
    };
    context.unload = function() {
        $('#grid').html();
    };

    context.isndraw.initDrawing = function(title, x, y, largeur, hauteur, callback) {
        if(context.canvasOpts.dimension) {
            throw strings.messages.errorInitDone;
        }
        if(largeur <= 0 || hauteur <= 0) {
            throw strings.messages.errorInvalidParameters;
        }
        // TODO :: handle title ?
        context.canvasOpts.x = x;
        context.canvasOpts.y = y;
        context.canvasOpts.dimension = Math.max(largeur, hauteur);
        context.runner.noDelay(callback);
    };

    var cx = function(x) {
        return (x - context.canvasOpts.x)*400/context.canvasOpts.dimension+1;
    }

    var cy = function(y) {
        return (y - context.canvasOpts.y)*400/context.canvasOpts.dimension+1;
    }

    context.setColors = function(r, v, b, fr, fv, fb) {
        if(r < 0 || r > 255 || v < 0 || v > 255 || b < 0 || b > 255) {
            throw strings.messages.errorInvalidParameters;
        }
        if(fr !== null || fv !== null || fb !== null) {
            if(fr < 0 || fr > 255 || fv < 0 || fv > 255 || fb < 0 || fb > 255) {
                throw strings.messages.errorInvalidParameters;
            }
            context.canvasCtx.fillStyle = 'rgb(' + fr + ', ' + fv + ', ' + fb + ')';
        }
        context.canvasCtx.strokeStyle = 'rgb(' + r + ', ' + v + ', ' + b + ')';
    };

    context.isndraw.drawRect = function(x1, y1, x2, y2, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, null, null, null);
            context.canvasCtx.strokeRect(cx(x1), cy(y1), cx(x2)-cx(x1), cy(y2)-cy(y1));
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.paintRect = function(x1, y1, x2, y2, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, rouge, vert, bleu);
            context.canvasCtx.fillRect(cx(x1), cy(y1), cx(x2)-cx(x1), cy(y2)-cy(y1));
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.drawCircle = function(x, y, rayon, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, null, null, null);
            context.canvasCtx.ellipse(cx(x), cy(y), rayon, rayon, 0, 0, 2*Math.PI);
            context.canvasCtx.stroke();
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.paintCircle = function(x, y, rayon, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, rouge, vert, bleu);
            context.canvasCtx.ellipse(cx(x), cy(y), rayon, rayon, 0, 0, 2*Math.PI);
            context.canvasCtx.fill();
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.drawPixel = function(x, y, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, rouge, vert, bleu);
            context.canvasCtx.fillRect(cx(x), cy(y), 1, 1);
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.drawLine = function(x1, y1, x2, y2, rouge, vert, bleu, callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        if(context.display) {
            context.setColors(rouge, vert, bleu, rouge, vert, bleu);
            context.canvasCtx.beginPath();
            context.canvasCtx.moveTo(cx(x1), cy(y1));
            context.canvasCtx.lineTo(cx(x2), cy(y2));
            context.canvasCtx.stroke();
        }
        context.runner.noDelay(callback);
    };

    context.isndraw.showDrawing = function(callback) {
        if(!context.canvasOpts.dimension) { throw strings.messages.errorNoInit; }
        context.runner.noDelay(callback);
    };

    context.customBlocks = {
        isndraw: {
            draw: [
                { name: "initDrawing",
                    params: ['String', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['titre', 'x', 'y', 'largeur', 'hauteur']
                },
                { name: "drawRect",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x1', 'y1', 'x2', 'y2', 'rouge', 'vert', 'bleu']
                },
                { name: "paintRect",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x1', 'y1', 'x2', 'y2', 'rouge', 'vert', 'bleu']
                },
                { name: "drawCircle",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'r', 'rouge', 'vert', 'bleu']
                },
                { name: "paintCircle",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'r', 'rouge', 'vert', 'bleu']
                },
                { name: "drawPixel",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x', 'y', 'rouge', 'vert', 'bleu']
                },
                { name: "drawLine",
                    params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
                    params_names: ['x1', 'y1', 'x2', 'y2', 'rouge', 'vert', 'bleu']
                },
                { name: "showDrawing" }
            ]
        }
    }

    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' }
    }


    for (var category in context.customBlocks.isndraw) {
        for (var iBlock = 0; iBlock < context.customBlocks.isndraw[category].length; iBlock++) {
            (function() {
                var block = context.customBlocks.isndraw[category][iBlock];
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
           })();
        }
    }

    return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('isndraw', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['isndraw', getContext]);
}
