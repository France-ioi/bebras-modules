var getContext = function(display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: {
         label: {
            // Labels for the blocks
            abs: "abs(%1)",
            acos: "acos(%1)",
            asin: "asin(%1)",
            atan: "atan(%1)",
            atan2: "atan2(%1, %2)",
            ceil: "ceil(%1)",
            cos: "cos(%1)",
            exp: "exp(%1)",
            floor: "floor(%1)",
            log: "log(%1)",
            max: "max(%1, %2)",
            min: "min(%1, %2)",
            pow: "pow(%1, %2)",
            random: "random()",
            round: "round(%1)",
            sin: "sin(%1)",
            sqrt: "sqrt(%1)",
            tan: "tan(%1)"
         },
         code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            abs: "abs",
            acos: "acos",
            asin: "asin",
            atan: "atan",
            atan2: "atan2",
            ceil: "ceil",
            cos: "cos",
            exp: "exp",
            floor: "floor",
            log: "log",
            max: "max",
            min: "min",
            pow: "pow",
            random: "random",
            round: "round",
            sin: "sin",
            sqrt: "sqrt",
            tan: "tan"
         },
         description: {
            // Descriptions of the functions in Python (optional)
//            doAction: "faireAction(valeur) : réalise l'action avec la valeur spécifiée",
         },
         messages: {
         }
      }
   }

   var context = quickAlgoContext(display, infos);
   var strings = context.setLocalLanguageStrings(localLanguageStrings);

   context.maths = {};

   // It's a stateless library
   context.reset = function() {};
   context.resetDisplay = function() {};
   context.updateScale = function() {};
   context.unload = function() {};

   context.customBlocks = {
      maths: {
         math: [
            { name: "abs", params: ['Number'], yieldsValue: true },
            { name: "acos", params: ['Number'], yieldsValue: true },
            { name: "asin", params: ['Number'], yieldsValue: true },
            { name: "atan", params: ['Number'], yieldsValue: true },
            { name: "atan2", params: ['Number', 'Number'], yieldsValue: true },
            { name: "ceil", params: ['Number'], yieldsValue: true },
            { name: "cos", params: ['Number'], yieldsValue: true },
            { name: "exp", params: ['Number'], yieldsValue: true },
            { name: "floor", params: ['Number'], yieldsValue: true },
            { name: "log", params: ['Number'], yieldsValue: true },
            { name: "max", params: ['Number', 'Number'], yieldsValue: true },
            { name: "min", params: ['Number', 'Number'], yieldsValue: true },
            { name: "pow", params: ['Number', 'Number'], yieldsValue: true },
            { name: "random", yieldsValue: true },
            { name: "round", params: ['Number'], yieldsValue: true },
            { name: "sin", params: ['Number'], yieldsValue: true },
            { name: "sqrt", params: ['Number'], yieldsValue: true },
            { name: "tan", params: ['Number'], yieldsValue: true }
         ]
      }
      // We can add multiple namespaces by adding other keys to customBlocks.
   };

   context.customConstants = {
      maths: [
         { name: "E", value: Math.E },
         { name: "PI", value: Math.PI }
      ]
   };

   for (var category in context.customBlocks.maths) {
      for (var iBlock = 0; iBlock < context.customBlocks.maths[category].length; iBlock++) {
         (function() { 
            var block = context.customBlocks.maths[category][iBlock];
            if (block.params) {
               block.blocklyJson = { inputsInline: true, args0: {} }
               block.blocklyXml = '<block type="' + block.name + '">';
               var blockArgs = block.blocklyJson.args0;
               for (var iParam = 0; iParam < block.params.length; iParam++) {
                  var paramData = { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 };
                  blockArgs[iParam] = { type: paramData.bType, name: "PARAM_" + iParam };
                  block.blocklyXml +=
                     '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                     '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                     '</shadow></value>';
               }
               block.blocklyXml += '</block>';
            }

            context.maths[block.name] = function() {
               var callback = arguments[arguments.length - 1];
               context.runner.noDelay(callback, Math[block.name].apply(Math, Array.prototype.slice.call(arguments, 0, arguments.length-1)));
            }

         })();
      }
   }

   return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('maths', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['maths', getContext]);
}
