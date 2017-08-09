

function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         label: {
            print: "écrire",
            read: "lire une ligne",
            readInteger: "lire un entier sur une ligne",
            readFloat: "lies Zeile als Komma-Zahl",
            eof: "Ende der Eingabe",
         },
         code: {
            print: "schreibe",
            read: "lies",
            readInteger: "liesGanzzahl",
            readFloat: "liesKommazahl",
            eof: "eingabeEnde",
         },
         description: {
         },
         startingBlockName: "Programm",
         messages: {
             outputWrong: "Das Programm hat nicht alle Zeilen richtig ausgegeben.",
             outputCorrect: "Bravo! Das Programm hat alle Zeilen richtig ausgegeben.",
            tooFewChars: "Zeile zu kurz: Zeile ",
            tooManyChars: "Zeile zu lang: Zeile ",
            tooFewLines: "Zu wenig Zeilen ausgegeben",
            tooManyLines: "Zu viele Zeilen ausgegeben",
            correctOutput: "Die Ausgabe ist richtig!",
            moreThan100Moves: "Die Ausgabe ist richtig, aber du hast mehr als 100 Schritte benötigt …",
         }, description: {
         }
      },
      de: {
         label: {
            print: "schreibe",
            read: "lies Zeile",
            readInteger: "lies Zeile als ganze Zahl",
            readFloat: "lies Zeile als Komma-Zahl",
            eof: "Ende der Eingabe",
         },
         code: {
            print: "schreibe",
            read: "lies",
            readInteger: "liesGanzzahl",
            readFloat: "liesKommazahl",
            eof: "eingabeEnde",
         },
         description: {
         },
         startingBlockName: "Programm",
         messages: {
             outputWrong: "Das Programm hat nicht alle Zeilen richtig ausgegeben.",
             outputCorrect: "Bravo! Das Programm hat alle Zeilen richtig ausgegeben.",
            tooFewChars: "Zeile zu kurz: Zeile ",
            tooManyChars: "Zeile zu lang: Zeile ",
            tooFewLines: "Zu wenig Zeilen ausgegeben",
            tooManyLines: "Zu viele Zeilen ausgegeben",
            correctOutput: "Die Ausgabe ist richtig!",
            moreThan100Moves: "Die Ausgabe ist richtig, aber du hast mehr als 100 Schritte benötigt …",
         }, description: {
         }
      },
      none: {
         comment: {
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
      localLanguageStrings: localLanguageStrings,
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
      this.success = false;
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

      context.printer.output_text += value.data + "\n";
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

   context.checkOutputHelper = function() {
      var expectedLines = this.taskInfos.output.replace(/\s*$/,"").split("\n");
      var actualLines = this.printer.output_text.replace(/\s*$/,"").split("\n");
      
      var iLine = 0;
      
      for (iLine = 0; iLine < expectedLines.length && iLine < actualLines.length; iLine++) {
         var expectedLine = expectedLines[iLine].replace(/\s*$/,"");
         var actualLine = actualLines[iLine].replace(/\s*$/,"");
         
         var iChar = 0;
         for (iChar = 0; iChar < expectedLine.length && iChar < actualLine.length; iChar++) {
            if (actualLine[iChar] != expectedLine[iChar]) {
               this.success = false;
               var errorstring = "Das Programm hat nicht alle Zeilen richtig ausgegeben.; in Zeile " +
                                      (iLine + 1) + ":<br>Erwartet: \"<b>" +
                                      escapeHtml(expectedLine) + "</b>\",<br>deine Ausgabe: \"<b>" +
                                 escapeHtml(actualLine) + "</b>\".<br>(Erstes falsches Zeichen in Spalte " +
                                      (iChar + 1) + "; erwartet: \"<b>" +
                                      escapeHtml(expectedLine[iChar]) + "</b>\", deine Ausgabe: \"<b>" +
                                 escapeHtml(actualLine[iChar]) + "</b>\".)"
               throw(errorstring); // add line info iLine + 1, add char info iChar + 1
            }
         }

         if (actualLine.length < expectedLine.length) {
            this.success = false;
            throw(strings.messages.tooFewChars + (iLine + 1)); // add line info iLine + 1
         }
         
         if (actualLine.length > expectedLine.length) {
            this.success = false;
            throw(strings.messages.tooManyChars + (iLine + 1)); // add line info iLine + 1
         }
      }

      if (actualLines.length < expectedLines.length) {
         this.success = false;
         throw(strings.messages.tooFewLines);
      }
      
      if (actualLines.length > expectedLines.length) {
         this.success = false;
         throw(strings.messages.tooManyLines);
      }
   }
   
   
   
   return context;
}
