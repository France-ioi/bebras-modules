"use strict";

var getContext = function(display, infos) {
   var localLanguageStrings = {
      de: {
         label: {
            print: "schreibe",
            read: "lese",
            readInteger: "lese ganze Zahl",
            readFloat: "lese Komma-Zahl",
            eof: "Ende der Eingabe",
         },
         code: {
            print: "schreibe",
            read: "lese",
            readInteger: "leseGanzzahl",
            readFloat: "leseKommazahl",
            eof: "eingabeEnde",
         },
         startingBlockName: "Programm",
         messages: {
            outputWrong: "Das hat noch nicht ganz geklappt. Versuch es noch einmal!",
            outputCorrect: "Bravo! Du hast alle Zeilen richtig ausgegeben!",
         }
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
      printer: {
         input_text : "",
         output_text : "",
      }
   };

   if (infos.showIfMutator) {
      context.showIfMutator = true;
   }

   switch (infos.blocklyColourTheme) {
      case "bwinf":
         context.provideBlocklyColours = function() {
            return {
               categories: {
                  logic: 100,
                  loops: 180,
                  math: 220,
                  texts: 250,
                  lists: 60,
                  colour: 310,
                  read: 10,
                  print: 60,
                  _default: 280,
               },
               blocks: {},
            };
         }
         break;
      default:
         // we could set printer specific default colours here, if we wanted to …
   }
            
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
      } else {
         // resetItems();
      }
      
      context.printer.output_text = "";
      context.printer.input_text = "";
      
      if (taskInfos) {
         context.taskInfos = taskInfos;
      }
      if (context.taskInfos.input) {
         context.printer.input_text = context.taskInfos.input;
      }
      context.updateScale();
   };

   context.resetDisplay = function() {
      this.delayFactory.destroyAll();

      $("#grid").html("<div style='width:400px; margin:0; padding: 0; overflow:hidden;text-align:left;'><div style='width:175px;height:200px;padding:5px; margin:5px; border: 1px solid black;overflow-y:auto;float:right;'><div style='font-size:small'>Output:</div><pre id='output' style='margin:0px;'>a</pre></div><div style='width:175px;height:200px;padding:5px; margin:5px; border: 1px solid black;overflow-y:auto;float:right;'><div style='font-size:small'>Input:</div><pre id='input' style='margin:0px;'>a</pre></div><div>")
      
      
      $("#output").html("");
      $("#input").html("");
      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
      }
   };

   context.printer.print = function(value, callback) {
      if (context.lost) {
         return;
      }

      if (typeof callback == "undefined") {
         callback = value;
         value = "";
      }
      
      context.printer.output_text += value + "\n";
      context.updateScale();
      
      context.waitDelay(callback);
   }

   context.printer.commonRead = function() {
      var result = "";
      var index = context.printer.input_text.indexOf('\n');
      
      if (index < 0) {
         result = context.printer.input_text;
         context.printer.input_text = "";
      }
      else {
         result = context.printer.input_text.substring(0,index);
         context.printer.input_text = context.printer.input_text.substring(index+1);
      }
      return result;
   }
      
   context.printer.read = function(callback) {
      var str = context.printer.commonRead()
      context.updateScale();
      context.waitDelay(callback, str);
   }


   context.printer.readInteger = function(callback) {
      var num = parseInt(context.printer.commonRead());
      context.updateScale();
      context.waitDelay(callback, num);
   }

   context.printer.readFloat = function(callback) {
      var num = parseFloat(context.printer.commonRead());
      context.updateScale();
      context.waitDelay(callback, num);
   }

   context.printer.eof = function(callback) {
      var index = context.printer.input_text.indexOf('\n');
      
      if (index < 0) {         
         context.waitDelay(callback, true);
      }
      context.waitDelay(callback, false);
   }


   context.debug_alert = function(message, callback) {
      message = message ? message.toString() : '';
      if (context.display) {
         alert(message);
      }
      context.callCallback(callback);
   };

   context.customBlocks = {
      printer: {
         print: [
            { name: "print", params: [null]},
         ],
         read:  [
            { name: "read", yieldsValue: true },
            { name: "readInteger", yieldsValue: true },
            { name: "readFloat", yieldsValue: true },
            { name: "eof", yieldsValue: true },
         ],
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
      $("#output").text(context.printer.output_text);
      $("#input").text(context.printer.input_text);
   };

   return context;
}
