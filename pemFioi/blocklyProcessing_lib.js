var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         label: {
            fillCanvas: "remplir avec",
            setFill: "définir la couleur de fond à",
            setStroke: "définir le contour à",
            drawRectangle: "dessiner un rectangle",
            drawEllipse: "dessiner une ellipse"
         },
         code: {
            fillCanvas: "remplirToile",
            setFill: "definirFond",
            setStroke: "definirContour",
            drawRectangle: "dessinerRectangle",
            drawEllipse: "dessinerEllipse"
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
      if (context.display) {
         context.resetDisplay();
      }
   };

   function sketchProc(processing) {
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
   }

   context.resetDisplay = function() {
      var canvas = $('<canvas>').css('border', '1px solid black');
      $('#grid').empty().append(canvas);

      var processingInstance = new Processing(canvas.get(0), sketchProc);

      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
      }
   };


   context.processing.fillCanvas = function(callback, color) {
      context.processing.ops.push({ func: 'background', args: [color] });
      context.waitDelay(callback);
   };

   context.processing.setFill = function(callback, color) {
      context.processing.ops.push({ func: 'fill', args: [color] });
      context.waitDelay(callback);
   };

   context.processing.setStroke = function(callback, color, width) {
      context.processing.ops.push({ func: 'stroke', args: [color] });
      context.processing.ops.push({ func: 'strokeWeight', args: [width] });
      context.waitDelay(callback);
   };

   context.processing.drawRectangle = function(callback, p1, p2) {
      context.processing.ops.push({ func: 'rect', args: [p1.x, p1.y, p2.x, p2.y] });
      context.waitDelay(callback);
   };

   context.processing.drawEllipse = function(callback, center, rads) {
      context.processing.ops.push({ func: 'ellipse', args: [center.x, center.y, rads.x, rads.y] });
      context.waitDelay(callback);
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
         draw: [
            { name: "fillCanvas", params: [null] },
            { name: "setFill", params: [null] },
            { name: "setStroke", params: [null, null] },
            { name: "drawRectangle", params: [null, null] },
            { name: "drawEllipse", params: [null, null] }
         ]
      }
   };


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
