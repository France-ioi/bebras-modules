var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         categories: {
            environment: "Environnement",
            shape: "Formes",
            transform: "Transformations",
            effect: "Effets",
            image: "Images",
            rendering: "Rendu",
            typography: "Typographie"
         },
         label: {
            paletteColor: "",
            background: "remplir avec",
            colorMode: "utiliser le mode de couleur %1 avec les limites %2 %3 %4 %5",
            fill: "définir la couleur de fond à",
            noFill: "ne pas mettre de fond",
            noStroke: "ne pas mettre de contour",
            stroke: "définir la couleur de contour à",
            strokeWeight: "définir l'épaisseur de contour à",
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5 %6",
            ellipse: "dessiner une ellipse à %1 %2 de taille %3 %4",
            line: "dessiner une ligne de %1 %2 à %3 %4",
            point: "dessiner un point à %1 %2",
            quad: "dessiner un quadrilatère aux points %1 %2, %3 %4, %5 %6, %7 %8",
            rect: "dessiner un rectangle à %1 %2 de taille %3 %4",
            triangle: "dessiner un triangle aux points %1 %2, %3 %4, %5 %6"
         },
         code: {
            paletteColor: "couleur",
            background: "arrierePlan",
            colorMode: "modeCouleur",
            fill: "couleurFond",
            noFill: "pasDeFond",
            noStroke: "pasDeContour",
            stroke: "couleurContour",
            strokeWeight: "epaisseurContour",
            arc: "arc",
            ellipse: "ellipse",
            line: "ligne",
            point: "point",
            quad: "quad",
            rect: "rect",
            triangle: "triangle"
         },
         description: {},
         values: {
            ARROW: "flèche",
            CROSS: "croix",
            HAND: "main",
            MOVE: "déplacement",
            TEXT: "texte",
            WAIT: "attente",
            RGB: "RVB",
            HSB: "TSL",
            CENTER: "centre",
            RADIUS: "rayon",
            CORNER: "coin",
            CORNERS: "coins",
            SQUARE: "carré",
            PROJECT: "projeté",
            ROUND: "arrondi",
            MITER: "onglet",
            BEVEL: "biseauté",
            POINTS: "points",
            LINES: "lignes",
            TRIANGLES: "triangles",
            TRIANGLE_FAN: "triangles en éventail",
            TRIANGLE_STRIP: "triangles en bande",
            QUADS: "quadrilatères",
            QUAD_STRIP: "quadrilatères en bande",
            IMAGE: "image",
            NORMALIZED: "normalisé",
            CLOSE: "fermer",
            BLEND: "mélange",
            ADD: "addition",
            SUBTRACT: "soustraction",
            DARKEST: "plus sombre",
            LIGHTEST: "plus lumineux",
            DIFFERENCE: "différence",
            EXCLUSION: "exclusion",
            MULTIPLY: "multiplication",
            SCREEN: "écran",
            OVERLAY: "recouvrement",
            HARD_LIGHT: "lumière dure",
            SOFT_LIGHT: "lumière douce",
            DODGE: "assombrissement",
            BURN: "éclaircissement"
         },
         startingBlockName: "Programme",
         messages: {}
      },
      none: {
         comment: {}
      }
   }

   var context = quickAlgoContext(display, infos);
   var strings = context.setLocalLanguageStrings(localLanguageStrings);   
   
   context.processing = {
      ops: []
   };

   context.provideBlocklyColours = function() {
      return {
         categories: {
            environment: 280,
            shape: 180,
            colour: 10
         }
      };
   };

   context.reset = function(taskInfos) {
      context.processing.ops = [];
      if (context.display) {
         context.resetDisplay();
      }
   };

   context.resetDisplay = function() {
      var canvas = $('<canvas>').css('border', '1px solid black');
      var coordinatesContainer = $('<div>').text(" ");
      $('#grid').empty().append(canvas, coordinatesContainer);

      var processingInstance = new Processing(canvas.get(0), function(processing) {
         processing.setup = function() {
            processing.size(300, 300);
            processing.background(255);
         };

         processing.draw = function() {
            for (var iOp = 0; iOp < context.processing.ops.length; iOp++) {
               var op = context.processing.ops[iOp];
               processing[op.func].apply(null, op.args);
            }
         };

         processing.mouseMoved = function() {
            coordinatesContainer.text(processing.mouseX + " × " + processing.mouseY);
         };
         processing.mouseDragged = function() {
            coordinatesContainer.find('span').remove();
            coordinatesContainer.append($('<span>').text(" — " + processing.mouseX + " × " + processing.mouseY));
         };
         processing.mouseOut = function() {
            if (coordinatesContainer.find('span').length > 0) {
               coordinatesContainer.find('span').remove();
            } else {
               coordinatesContainer.text(" ");
            }
         };
      });

      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
      }
   };


   context.processing.commonOp = function() {
      var args = [];
      for (var iArg = 1; iArg < arguments.length - 1; iArg++) {
         args.push(arguments[iArg]);
      }
      context.processing.ops.push({ func: arguments[0], args: args });
      context.waitDelay(arguments[arguments.length - 1]);
   };

   context.processing.paletteColor = function(colour, callback) {
      console.log(colour);
      context.waitDelay(callback, colour);
   };


   context.customBlocks = {
      processing: {
         environment: [
            { name: "popStyle" },
            { name: "pushStyle" },
            //
            { name: "cursor", params: [["ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT"]] }, // variante : image, x y
            { name: "focused", yieldsValue: true },
            { name: "frameCount", yieldsValue: true },
            { name: "frameRate", params: ['Number'] }, // 60 par défaut
            { name: "frameRate", yieldsValue: true },
            { name: "width", yieldsValue: true },
            { name: "height", yieldsValue: true }
         ],
         shape: [
            { name: "arc", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // les deux derniers paramètres sont des angles
            { name: "ellipse", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "line", params: ['Number', 'Number', 'Number', 'Number'] }, // variante : x1, y1, z1, x2, y2, z2
            { name: "point", params: ['Number', 'Number'] }, // variante : x, y, z
            { name: "quad", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "rect", params: ['Number', 'Number', 'Number', 'Number'] }, // variante ajoutant : radius ou (tlradius, trradius, brradius, blradius)
            { name: "triangle", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            //
            { name: "bezier", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (12 paramètres)
            { name: "bezierDetail", params: ['Number'] },
            { name: "bezierPoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "bezierTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "curve", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (12 paramètres)
            { name: "curveDetail", params: ['Number'] },
            { name: "curvePoint", params: ['Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "curveTangent", params: ['Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "curveTightness", params: ['Number'] },
            //
            { name: "box", params: ['Number', 'Number', 'Number'] }, // variante avec un unique paramètre
            { name: "sphere", params: ['Number'] },
            { name: "sphereDetail", params: ['Number', 'Number'] }, // variante avec un unique paramètre
            //
            { name: "ellipseMode", params: [["CENTER", "RADIUS", "CORNER", "CORNERS"]] },
            { name: "noSmooth" },
            { name: "ellipseMode", params: [["CENTER", "RADIUS", "CORNER", "CORNERS"]] },
            { name: "smooth" },
            { name: "strokeCap", params: [["SQUARE", "PROJECT", "ROUND"]] },
            { name: "strokeJoin", params: [["MITER", "BEVEL", "ROUND"]] },
            { name: "strokeWeight", params: ['Number'] },
            // attention : les fonctions « vertex » ci-dessous ignorent scale()
            { name: "beginShape", params: [["POINTS", "LINES", "TRIANGLES", "TRIANGLE_FAN", "TRIANGLE_STRIP", "QUADS", "QUAD_STRIP"]] }, // variante sans paramètre
            { name: "bezierVertex", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante avec coordonnée z (9 paramètres)
            { name: "curveVertex", params: ['Number', 'Number'] }, // variante avec coordonnée z
            { name: "endShape", params: [["CLOSE"]] }, // variante sans paramètre
            { name: "texture", params: ['Image'] },
            { name: "textureMode", params: [["IMAGE", "NORMALIZED"]] },
            { name: "vertex", params: ['Number', 'Number', 'Number', 'Number', 'Number'] }, // variantes à 2, 3 et 4 paramètres
            //
            { name: "shape", params: ['Shape', 'Number', 'Number', 'Number', 'Number'] }, // variantes à 1 et 3 paramètres
            { name: "shapeMode", params: [["CORNER", "CORNERS", "CENTER"]] },
         ],
         transform: [
            { name: "applyMatrix", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number',
                  'Number', 'Number'] },
            { name: "popMatrix" },
            { name: "printMatrix" },
            { name: "pushMatrix" },
            { name: "resetMatrix" },
            { name: "rotate", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateX", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateY", params: ['Number'] }, // le paramètre est un angle
            { name: "rotateZ", params: ['Number'] }, // le paramètre est un angle
            { name: "scale", params: ['Number', 'Number', 'Number'] }, // variantes à 1 et 2 paramètres
            { name: "translate", params: ['Number', 'Number', 'Number'] } // variantes à 2 paramètres
         ],
         effect: [
            { name: "ambientLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante à 3 paramètres
            { name: "directionalLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "lightFalloff", params: ['Number', 'Number', 'Number'] },
            { name: "lightSpecular", params: ['Number', 'Number', 'Number'] },
            { name: "lights" },
            { name: "noLights" },
            { name: "normal", params: ['Number', 'Number', 'Number'] },
            { name: "pointLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "spotLight", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            //
            { name: "beginCamera" },
            { name: "camera", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "endCamera" },
            { name: "frustum", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "ortho", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "perspective", params: ['Number', 'Number', 'Number', 'Number'] }, // variante sans paramètre
            { name: "printCamera" },
            { name: "printProjection" },
            //
            { name: "modelX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "modelZ", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenX", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenY", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            { name: "screenZ", params: ['Number', 'Number', 'Number'], yieldsValue: true },
            //
            { name: "ambient", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
            { name: "emissive", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
            { name: "shininess", params: ['Number'] },
            { name: "specular", params: ['Number', 'Number', 'Number'] }, // variante : gray + palette
         ],
         colour: [
            { name: "background", params: ['Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            { name: "colorMode", params: [["RGB", "HSB"], 'Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 4 paramètres
            { name: "fill", params: ['Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            { name: "noFill" },
            { name: "noStroke" },
            { name: "stroke", params: ['Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            //
            { name: "alpha", params: ['Colour'], yieldsValue: true },
            { name: "blendColor", params: ['Colour', 'Colour',
                  ["BLEND", "ADD", "SUBTRACT", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN", "OVERLAY",
                     "HARD_LIGHT", "SOFT_LIGHT", "DODGE", "BURN"]],
               yieldsValue: true },
            { name: "blue", params: ['Colour'], yieldsValue: true },
            { name: "brightness", params: ['Colour'], yieldsValue: true },
            { name: "color", params: ['Number', 'Number', 'Number', 'Number'] }, // variantes à 1, 2 et 3 paramètres + palette
            { name: "green", params: ['Colour'], yieldsValue: true },
            { name: "hue", params: ['Colour'], yieldsValue: true },
            { name: "red", params: ['Colour'], yieldsValue: true },
            { name: "saturation", params: ['Colour'], yieldsValue: true }
         ],
         debug: [
            { name: "print", params: [null] },
            { name: "println", params: [null] }
         ]
      }
   };

   var typeKeywords = {
      'Number': { pType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
      'Colour': { pType: 'input_value', vType: 'field_colour', fName: 'COL', defVal: "#ff0000" }
   };
   for (var category in context.customBlocks.processing) {
      for (var iFunc = 0; iFunc < context.customBlocks.processing[category].length; iFunc++) {
         (function() {
            var func = context.customBlocks.processing[category][iFunc];
            if (!context.processing[func.name]) {
               if (func.params) {
                  func.blocklyJson = $.extend({ inputsInline: true, args0: {} }, func.blocklyJson);
                  func.blocklyXml = '<block type="' + func.name + '">';
                  var funcArgs = func.blocklyJson.args0;
                  for (var iParam = 0; iParam < func.params.length; iParam++) {
                     var paramType = func.params[iParam];
                     if (paramType != null) {
                        var paramData = typeKeywords[paramType] || { pType: 'input_value' };
                        if ($.isArray(paramType)) {
                           paramData = { pType: 'field_dropdown' };
                           funcArgs[iParam] = $.extend({ options: [] }, funcArgs[iParam]);
                           for (var iValue = 0; iValue < paramType.length; iValue++) {
                              funcArgs[iParam].options.push([strings.values[paramType[iValue]],
                                 typeof Processing !== 'undefined' ? Processing[paramType[iValue]] : paramType[iValue]]);
                           }
                        }
                        funcArgs[iParam] = $.extend({ type: paramData.pType, name: "PARAM_" + iParam }, funcArgs[iParam]);
                        if (paramData.colour) {
                           funcArgs[iParam].colour = paramData.colour;
                        } else if (paramData.vType) {
                           func.blocklyXml +=
                              '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                                 '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                              '</shadow></value>';
                        }
                     }
                  }
                  func.blocklyXml += '</block>';
               }
               context.processing[func.name] = function() {
                  context.processing.commonOp.apply(null, [func.name].concat(Array.apply(null, arguments)));
               };
            }
         })();
      }
   }


   context.getItems = function(row, col, filters) {
      var listItems = [];
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         var itemType = infos.itemTypes[item.type];
         if ((row == undefined) || ((item.row == row) && (item.col == col))) {
            var accepted = true;
            for (var property in filters) {
               var value = filters[property];
               if ((itemType[property] == undefined) && (value != undefined)) {
                  accepted = false;
                  break;
               }
               if ((itemType[property] != undefined) && (itemType[property] != value)) {
                  accepted = false;
                  break;
               }
            }
            if (accepted) {
               item.index = iItem;
               listItems.push(item);
            }
         }
      }
      return listItems;
   };

   context.updateScale = function() {
      if (!context.display) {
         return;
      }
   };


   return context;
}
