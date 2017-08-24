var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         label: {
            colourValue: "",
            background: "remplir avec",
            fill: "définir la couleur de fond à",
            stroke: "définir la couleur de contour à",
            noFill: "ne pas mettre de fond",
            noStroke: "ne pas mettre de contour",
            strokeWeight: "définir l'épaisseur de contour à",
            rect: "dessiner un rectangle à %1 %2 de taille %3 %4",
            ellipse: "dessiner une ellipse à %1 %2 de taille %3 %4",
            line: "dessiner une ligne de %1 %2 à %3 %4",
            triangle: "dessiner un triangle aux points %1 %2, %3 %4, %5 %6",
            quad: "dessiner un quadrilatère aux points %1 %2, %3 %4, %5 %6, %7 %8",
            arc: "dessiner un arc à %1 %2 de taille %3 %4 entre les angles %5 %6",
            point: "dessiner un point à %1 %2"
         },
         code: {
            colourValue: "couleur",
            background: "arrierePlan",
            fill: "couleurFond",
            stroke: "couleurContour",
            noFill: "pasDeFond",
            noStroke: "pasDeContour",
            strokeWeight: "epaisseurContour",
            rect: "rect",
            ellipse: "ellipse",
            line: "ligne",
            triangle: "triangle",
            quad: "quad",
            arc: "arc",
            point: "point"
         },
         description: {
         },
         startingBlockName: "Programme",
         messages: {
         }
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
            colour: 10,
            attributes: 280,
            shapes: 180
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
            processing.frameRate(10);
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

   context.processing.colourValue = function(colour, callback) {
      context.waitDelay(callback, colour);
   };


   context.customBlocks = {
      processing: {
         colour: [
            { name: "colourValue", params: [null], blocklyJson: { output: 'Colour',
               args0: [{ type: "field_colour", name: "colour", colour: "#ff0000" }] } },
            { name: "background", params: ['Number', 'Number', 'Number'] },
            { name: "fill", params: ['Number', 'Number', 'Number'] },
            { name: "stroke", params: ['Number', 'Number', 'Number'] },
            { name: "noFill" },
            { name: "noStroke" },
            { name: "colorMode", params: ['Dropdown', 'Number', 'Number', 'Number', 'Number'], blocklyJson: {
               args0: [{ type: "field_dropdown", name: "mode", options: [["RVB", Processing.RGB], ["TSV", Processing.HSB]] }] } }
         ],
         attributes: [
            { name: "strokeWeight", params: ['Number'] }
         ],
         shapes: [
            { name: "rect", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "ellipse", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "line", params: ['Number', 'Number', 'Number', 'Number'] },
            { name: "triangle", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "quad", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "arc", params: ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'] },
            { name: "point", params: ['Number', 'Number'] }
         ]
      }
   };

   var typeDefaults = { 'Number': ['math_number', 0] };
   for (var category in context.customBlocks.processing) {
      for (var iFunc = 0; iFunc < context.customBlocks.processing[category].length; iFunc++) {
         (function() {
            var func = context.customBlocks.processing[category][iFunc];
            if (!context.processing[func.name]) {
               if (func.params) {
                  func.blocklyJson = { inputsInline: true };
                  func.blocklyXml = '<block type="' + func.name + '">';
                  for (var iParam = 0; iParam < func.params.length; iParam++) {
                     var paramDef = typeDefaults[func.params[iParam]];
                     if (paramDef) {
                        func.blocklyXml +=
                           '<value name="PARAM_' + iParam + '">' +
                              '<shadow type="' + paramDef[0] + '"><field name="NUM">' + paramDef[1] + '</field></shadow>' +
                           '</value>';
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
