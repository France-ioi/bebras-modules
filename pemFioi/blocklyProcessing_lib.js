var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         label: {
            background: "remplir avec",
            fill: "définir la couleur de fond à",
            stroke: "définir la couleur de contour à",
            strokeWeight: "définir l'épaisseur de contour à",
            rect: "dessiner un rectangle",
            ellipse: "dessiner une ellipse"
         },
         code: {
            background: "arrierePlan",
            fill: "couleurFond",
            stroke: "couleurContour",
            strokeWeight: "epaisseurContour",
            rect: "rect",
            ellipse: "ellipse"
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
   
   window.stringsLanguage = window.stringsLanguage || "fr";
   window.languageStrings = window.languageStrings || {};

   if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
   }
   else { // merge translations
      $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
   }   
   var strings = window.languageStrings;
   
   var cells = [];
   var texts = [];
   var scale = 1;

   var context = {
      display: display,
      infos: infos,
      strings: strings,
      localLanguageStrings: localLanguageStrings,
      processing: {
         ops: []
      }
   };

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   };

   context.waitDelay = function(callback, value) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      context.runner.noDelay(callback, value);
   };

   context.nbRobots = 1;

   context.getRobotItem = function(iRobot) {
      var items = context.getItems(undefined, undefined, {category: "robot"});
      return items[iRobot];
   };


   context.program_end = function(callback) {
      var curRobot = context.curRobot;
      if (!context.programEnded[curRobot]) {
         context.programEnded[curRobot] = true;
         infos.checkEndCondition(context, true);
      }
      context.waitDelay(callback);
   };

   context.reset = function(taskInfos) {
      context.processing.ops = [];
      if (context.display) {
         context.resetDisplay();
      }
   };

   context.resetDisplay = function() {
      var canvas = $('<canvas>').css('border', '1px solid black');
      $('#grid').empty().append(canvas);

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
         args.push(arguments[iArg].data);
      }
      context.processing.ops.push({ func: arguments[0], args: args });
      context.waitDelay(arguments[arguments.length - 1]);
   };


   context.debug_alert = function(message, callback) {
      message = message ? message.toString() : '';
      if (context.display) {
         alert(message);
      }
      context.callCallback(callback);
   };

   context.customBlocks = {
      processing: {
         color: [
            { name: "background", params: [null, null, null] },
            { name: "fill", params: [null, null, null] },
            { name: "stroke", params: [null, null, null] }
         ],
         attributes: [
            { name: "strokeWeight", params: [null] }
         ],
         shapes: [
            { name: "rect", params: [null, null, null, null] },
            { name: "ellipse", params: [null, null, null, null] }
         ]
      }
   };

   for (var category in context.customBlocks.processing) {
      for (var iFunc = 0; iFunc < context.customBlocks.processing[category].length; iFunc++) {
         (function() {
            var funcName = context.customBlocks.processing[category][iFunc].name;
            context.processing[funcName] = function() {
               context.processing.commonOp.apply(null, [funcName].concat(Array.apply(null, arguments)));
            };
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
