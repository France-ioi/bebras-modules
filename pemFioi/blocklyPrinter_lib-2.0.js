// Blockly Printer lib version 2 : adds interactive input

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
            print_end: "écrire %1 en terminant par %2",
            read: "lire une ligne",
            readInteger: "lire un entier sur une ligne",
            readFloat: "lire un nombre à virgule sur une ligne",
            eof: "fin de la saisie"
         },
         code: {
            print: "print",
            print_end: "print",
            read: "input",
            readInteger: "lireEntier",
            readFloat: "lireDecimal",
            eof: "finSaisie"
         },
         description: {
         },
         startingBlockName: "Programme",
         messages: {
            inputPrompt: "Veuillez écrire une entrée pour le programme.",
            outputWrong: "Votre programme n'a pas traité correctement toutes les lignes.",
            outputCorrect: "Bravo ! Votre programme a traité correctement toutes les lignes.",
            tooFewChars: "La ligne {0} de la sortie de votre programme est plus courte qu'attendue.",
            tooManyChars: "La ligne {0} de la sortie de votre programme est plus longue qu'attendue.",
            tooFewLines: "La sortie de votre programme comporte moins de lignes qu'attendu.",
            tooManyLines: "La sortie de votre programme comporte plus de lignes qu'attendu.",
            correctOutput: "La sortie est correcte !",
            moreThan100Moves: "La sortie est correcte, mais vous l'avez produite en plus de 100 étapes…"
         },
         errorStr: {
            intro: "La sortie de votre programme est fausse, à la ligne ",
            expected: " :<br>Attendu: \"<b>",
            answer: "</b>\",<br>Votre réponse: \"<b>",
            introChar: "</b>\".<br>(Premier caractère erroné à la colonne ",
            expectedChar: "; attendu: \"<b>",
            answerChar: "</b>\", votre réponse: \"<b>"
         }
      },
      de: {
         label: {
            print: "schreibe",
            print_end: "schreibe",
            read: "lies Zeile",
            readInteger: "lies Zeile als ganze Zahl",
            readFloat: "lies Zeile als Komma-Zahl",
            eof: "Ende der Eingabe"
         },
         code: {
            print: "schreibe",
            print_end: "schreibe",
            read: "lies",
            readInteger: "liesGanzzahl",
            readFloat: "liesKommazahl",
            eof: "eingabeEnde"
         },
         description: {
         },
         startingBlockName: "Programm",
         messages: {
            outputWrong: "Das Programm hat nicht alle Zeilen richtig ausgegeben.",
            outputCorrect: "Bravo! Das Programm hat alle Zeilen richtig ausgegeben.",
            tooFewChars: "Zeile zu kurz: Zeile {0}",
            tooManyChars: "Zeile zu lang: Zeile {0}",
            tooFewLines: "Zu wenig Zeilen ausgegeben",
            tooManyLines: "Zu viele Zeilen ausgegeben",
            correctOutput: "Die Ausgabe ist richtig!",
            moreThan100Moves: "Die Ausgabe ist richtig, aber du hast mehr als 100 Schritte benötigt …"
         },
         errorStr: {
            intro: "Das Programm hat nicht alle Zeilen richtig ausgegeben.; in Zeile ",
            expected: ":<br>Erwartet: \"<b>",
            answer: "</b>\",<br>deine Ausgabe: \"<b>",
            introChar: "</b>\".<br>(Erstes falsches Zeichen in Spalte ",
            expectedChar: "; erwartet: \"<b>",
            answerChar: "</b>\", deine Ausgabe: \"<b>"
         }
      },
      none: {
         comment: {
         }
      }
   }

   var context = quickAlgoContext(display, infos);

   var strings = context.setLocalLanguageStrings(localLanguageStrings);
   
   var cells = [];
   var texts = [];
   var scale = 1;

   context.printer = {
      input_text : "",
      output_text : "",
      input_reset: true
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
                  _default: 280
               },
               blocks: {}
            };
         }
         break;
      default:
         // we could set printer specific default colours here, if we wanted to …
   }
            
   context.reset = function(taskInfos) {
      this.success = false;
      if (context.display) {
         context.resetDisplay();
      } else {
         // resetItems();
      }
      
      context.printer.output_text = "";
      context.printer.input_text = "";
      context.printer.input_reset = true;
      
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

   context.printer.print = function() {
      var value = arguments[0];
      var callback = arguments[arguments.length-1];
      var end = arguments.length > 2 ? '' + arguments[1] : "\n";

      if (context.lost) {
         return;
      }

      if (typeof callback == "undefined") {
         callback = value;
         value = "";
      }

      if(value && value.length) {
         for(var i=0; i < value.length; i++) {
            if(value[i] && typeof value[i].v != 'undefined') {
               value[i] = value[i].v;
            }
         }
      }
      context.printer.output_text += value + end;
      context.updateScale();
      
      context.waitDelay(callback);
   }

   context.printer.print_end = context.printer.print;

   context.printer.commonRead = function() {
      if(context.taskInfos.freeInput && context.display) {
         if(context.printer.input_reset) {
            // First read, reset input display
            context.printer.input_text = '';
            context.printer.input_reset = false;
         }
         var result = window.prompt(strings.messages.inputPrompt);
         context.printer.input_text += result + '\n';
      } else {
         // This test has a predefined input
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
      }
      context.updateScale();
      return result;
   }

   context.printer.read = function(callback) {
      var str = context.printer.commonRead()
      context.waitDelay(callback, str);
   }


   context.printer.readInteger = function(callback) {
      var num = parseInt(context.printer.commonRead());
      context.waitDelay(callback, num);
   }

   context.printer.readFloat = function(callback) {
      var num = parseFloat(context.printer.commonRead());
      context.waitDelay(callback, num);
   }

   context.printer.eof = function(callback) {
      var index = context.printer.input_text.indexOf('\n');
      
      if (index < 0) {         
         context.waitDelay(callback, true);
      }
      context.waitDelay(callback, false);
   }


   context.customBlocks = {
      printer: {
         print: [
            // TODO : variants is not properly supported yet, once supported properly, print and print_end should be merged
            { name: "print", params: [null], variants: [[null], [null, null]]},
            { name: "print_end", params: [null, null], variants: [[null], [null, null]], blocklyJson: {inputsInline: true}}
         ],
         read:  [
            { name: "read", yieldsValue: true },
            { name: "readInteger", yieldsValue: true },
            { name: "readFloat", yieldsValue: true },
            { name: "eof", yieldsValue: true }
         ]
      }
   }


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
               var errorstring = (
                  strings.errorStr.intro
                  + (iLine + 1)
                  + strings.errorStr.expected
                  + escapeHtml(expectedLine)
                  + strings.errorStr.answer
                  + escapeHtml(actualLine)
                  + strings.errorStr.introChar
                  + (iChar + 1)
                  + strings.errorStr.expectedChar
                  + escapeHtml(expectedLine[iChar])
                  + strings.errorStr.answerChar
                  + escapeHtml(actualLine[iChar]) + '</b>"');
               throw(errorstring); // add line info iLine + 1, add char info iChar + 1
            }
         }

         if (actualLine.length < expectedLine.length) {
            this.success = false;
            throw(strings.messages.tooFewChars.format(iLine + 1)); // add line info iLine + 1
         }
         
         if (actualLine.length > expectedLine.length) {
            this.success = false;
            throw(strings.messages.tooManyChars.format(iLine + 1)); // add line info iLine + 1
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

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('printer', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['printer', getContext]);
}
