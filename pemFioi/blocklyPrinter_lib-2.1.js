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
            print_end: "print_end",
            read: "input",
            readInteger: "lireEntier",
            readFloat: "lireDecimal",
            eof: "finSaisie"
         },
         description: {
            print: "print(texte) affiche le texte sur le terminal",
            read: "input() retourne une chaîne : la prochaîne ligne de l'entrée"
         },
         startingBlockName: "Programme",
         messages: {
            inputPrompt: "Veuillez écrire une entrée pour le programme.",
            inputEmpty: "Votre programme a essayé de lire l'entrée alors qu'il n'y avait plus aucune ligne à lire !",
            outputWrong: "Votre programme n'a pas traité correctement toutes les lignes.",
            outputCorrect: "Bravo ! Votre programme a traité correctement toutes les lignes.",
            tooFewChars: "La ligne {0} de la sortie de votre programme est plus courte qu'attendue.",
            tooManyChars: "La ligne {0} de la sortie de votre programme est plus longue qu'attendue.",
            tooFewLines: "Trop peu de lignes en sortie",
            tooManyLines: "Trop de lignes en sortie",
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
            eof: "Ende der Eingabe",
            charToNumber: "Zeichen zu Zahl",
            numberToChar: "Zahl zu Zeichen",
            charToAscii: "ASCII-Zahl zu Zeichen",
            asciiToChar: "Zeichen zu ASCII-Zahl",
         },
         code: {
            print: "schreibe",
            print_end: "schreibe",
            read: "lies",
            readInteger: "liesGanzzahl",
            readFloat: "liesKommazahl",
            eof: "eingabeEnde",
            charToNumber: "zeichenZuZahl",
            numberToChar: "zahlZuZeichen",
            asciiToChar: "zeichenZuAscii",
            charToAscii: "asciiZuZeichen",
         },
         description: {
         },
         startingBlockName: "Programm",
         messages: {
            inputPrompt: "Please input a line for the program.", // TODO :: translate two lines
            inputEmpty: "Your program tried to read the input while there is no line left to read!",
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

   var conceptBaseUrl = (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//'
        + 'static4.castor-informatique.fr/help/printer.html';

   context.conceptList = [
      {id: 'printer_introduction', name: 'Les entrées/sorties', url: conceptBaseUrl+'#printer_introduction', isBase: true},
      {id: 'printer_print', name: 'Afficher une ligne', url: conceptBaseUrl+'#printer_print', isBase: true},
      {id: 'printer_read', name: 'Lire une ligne', url: conceptBaseUrl+'#printer_read', isBase: true}
   ];

   
   var cells = [];
   var texts = [];
   var scale = 1;
   var firstLineHighlight = null;
   var libOptions = infos.libOptions ? infos.libOptions : {};

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
                  math: 230,
                  texts: 60,
                  lists: 40,
                  colour: 20,
                  variables: 330,
                  functions: 290,
                  read: 260,
                  print: 200,
                  manipulate: 0,
                  _default: 0
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

      $("#grid").html(
         '<div style="width: 400px; margin: 0; padding: 0; overflow: hidden; text-align: left;">' +
         '  <div style="width: 175px; height: 200px; padding: 5px; margin: 5px; border: 1px solid black; overflow-y: auto; float: right;">' +
         '    <div style="font-size:small">Output:</div>' +
         '    <pre id="output" style="margin:0px;">a</pre>' +
         '  </div>' +
         '  <div style="width: 175px; height: 200px; padding: 5px; margin: 5px; border: 1px solid black; overflow-y: auto; float: right;">' +
         '    <div style="font-size:small">Input:</div>' +
         (libOptions.highlightRead ? '    <pre id="inputHighlight" style="margin: 0px; background-color: lightgray; border-bottom: 1px solid black;"></pre>' : '') +
         '    <pre id="input" style="margin: 0px;">a</pre>' +
         '  </div>' +
         '</div>')

      $("#output").html("");
      $("#input").html("");
      $("#inputHighlight").html("");
      firstLineHighlight = null;

      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
      }
   };

   context.printer.commonPrint = function(args, end, callback) {
      if (context.lost) {
         return;
      }

      // Fix display of arrays
      var valueToStr = function(value) {
         if(value && value.length !== undefined && typeof value == 'object') {
            var oldValue = value;
            value = [];
            for(var i=0; i < oldValue.length; i++) {
               if(oldValue[i] && typeof oldValue[i].v != 'undefined') {
                   // When used inside Skulpt (Python mode)
                   value.push(oldValue[i].v);
               } else {
                   value.push(oldValue[i]);
               }
               value[i] = valueToStr(value[i]);
            }
            return '[' + value.join(', ') + ']';
         } else if(value && value.isFloat && Math.floor(value) == value) {
            return value + '.0';
         } else if(value === true) {
            return 'True';
         } else if(value === false) {
            return 'False';
         }
         return value;
      }

      var text = '';
      for(var i=0; i < args.length; i++) {
         text += (i > 0 ? ' ' : '') + valueToStr(args[i]);
      }

      context.printer.output_text += text + end;
      context.updateScale();
      
      context.waitDelay(callback);
   }

   context.printer.print = function() {
      context.printer.commonPrint(Array.prototype.slice.call(arguments, 0, -1), "\n", arguments[arguments.length-1]);
   }

   context.printer.print_end = function() {
      if(arguments.length > 1) {
         context.printer.commonPrint(Array.prototype.slice.call(arguments, 0, -2), arguments[arguments.length-2], arguments[arguments.length-1]);
      } else {
         context.printer.commonPrint([], "\n", arguments[arguments.length-1]);
      }
   }

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
            if(!context.printer.input_text) {
                throw strings.messages.inputEmpty;
            }
            result = context.printer.input_text;
            context.printer.input_text = "";
         }
         else {
            result = context.printer.input_text.substring(0,index);
            context.printer.input_text = context.printer.input_text.substring(index+1);
         }
      }
      if(libOptions.highlightRead) {
         firstLineHighlight = result;
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

   context.printer.charToAscii = function(char, callback) {
     var number = char.charCodeAt(0);
     context.waitDelay(callback, number);
   }
   context.printer.asciiToChar = function(number, callback) {
     var char = String.fromCharCode(number);
     context.waitDelay(callback, char);
   }

   context.printer.charToNumber = function(char, callback) {
     var number = char.charCodeAt(0) - 65;
     context.waitDelay(callback, number);
   }
   context.printer.numberToChar = function(number, callback) {
     var char = String.fromCharCode(number + 65);
     context.waitDelay(callback, char);
   }


   context.customBlocks = {
      printer: {
         print: [
            // TODO : variants is not properly supported yet, once supported properly, print and print_end should be merged
            { name: "print", params: [null], variants: [[null], [null, null]], anyArgs: true},
            { name: "print_end", params: [null, null], variants: [[null], [null, null]], anyArgs: true, blocklyJson: {inputsInline: true}}
         ],
         read:  [
         { name: "read", yieldsValue: true, blocklyJson: {output: "String"} },
            { name: "readInteger", yieldsValue: true, blocklyJson: {output: "Number"} },
            { name: "readFloat", yieldsValue: true, blocklyJson: {output: "Number"} },
            { name: "eof", yieldsValue: true, blocklyJson: {output: "Boolean"}}
         ],
         manipulate: [
            { name: "charToNumber", params: ["String"], yieldsValue: true, blocklyJson: {output: "Number"}},
            { name: "numberToChar", params: ["Number"], yieldsValue: true, blocklyJson: {output: "String"}},
            { name: "charToAscii",  params: ["String"], yieldsValue: true, blocklyJson: {output: "Number"}},
            { name: "asciiToChar",  params: ["Number"], yieldsValue: true, blocklyJson: {output: "String"}}
         ]
      }
   }


   context.updateScale = function() {
      if (!context.display) {
         return;
      }
      $("#output").text(context.printer.output_text);
      $("#input").text(context.printer.input_text);
      $("#inputHighlight").text(firstLineHighlight ? firstLineHighlight : '');
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
