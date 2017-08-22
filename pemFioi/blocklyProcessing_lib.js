var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         label: {
            colourValue: "",
            background: "remplir avec",
            fill: "définir la couleur de fond à",
            stroke: "définir la couleur de contour à",
            strokeWeight: "définir l'épaisseur de contour à",
            rect: "dessiner un rectangle",
            ellipse: "dessiner une ellipse",
            line: "dessiner une ligne",
            triangle: "dessiner un triangle",
            quad: "dessiner un quadrilatère",
            arc: "dessiner un arc",
            point: "dessiner un point"
         },
         code: {
            colourValue: "couleur",
            background: "arrierePlan",
            fill: "couleurFond",
            stroke: "couleurContour",
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
            { name: "colourValue", params: [null], blocklyJson: { output: null,
               args0: [{ type: "field_colour", name: "colour", colour: "#ff0000" }] } },
            { name: "background", params: [null, null, null], blocklyJson: { inputsInline: true } },
            { name: "fill", params: [null, null, null], blocklyJson: { inputsInline: true } },
            { name: "stroke", params: [null, null, null], blocklyJson: { inputsInline: true } }
         ],
         attributes: [
            { name: "strokeWeight", params: [null], blocklyJson: { inputsInline: true } }
         ],
         shapes: [
            { name: "rect", params: [null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "ellipse", params: [null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "line", params: [null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "triangle", params: [null, null, null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "quad", params: [null, null, null, null, null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "arc", params: [null, null, null, null, null, null], blocklyJson: { inputsInline: true } },
            { name: "point", params: [null, null], blocklyJson: { inputsInline: true } }
         ]
      }
   };

   for (var category in context.customBlocks.processing) {
      for (var iFunc = 0; iFunc < context.customBlocks.processing[category].length; iFunc++) {
         (function() {
            var funcName = context.customBlocks.processing[category][iFunc].name;
            if (!context.processing[funcName]) {
               context.processing[funcName] = function() {
                  context.processing.commonOp.apply(null, [funcName].concat(Array.apply(null, arguments)));
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
