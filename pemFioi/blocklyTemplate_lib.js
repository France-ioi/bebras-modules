// This is a template of library for use with quickAlgo.

var getContext = function(display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: { // French strings
         label: {
            // Labels for the blocks
            doAction: "faire l'action",
            doNothing: "ne rien faire",
            readSensor: "lire le capteur"
         },
         code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            doAction: "faireAction",
            doNothing: "rienFaire",
            readSensor: "lireCapteur"
         },
         description: {
            // Descriptions of the functions in Python (optional)
            doAction: "faireAction(valeur) : réalise l'action avec la valeur spécifiée",
            doNothing: "rienFaire() : ne fait rien",
            readSensor: "lireCapteur() : lit le capteur, et renvoie la valeur sous la forme d'un entier"
         },
         constant: {
            // Translations for constant names (optional)
            "ONE": "UN",
            "TRUEVALUE": "VALEURVRAI",
            "LIBNAME": "NOMLIB"
         },
         startingBlockName: "Programme", // Name for the starting block
         messages: {
         }
      },
      none: {
         comment: {
            // Comments for each block, used in the auto-generated documentation for task writers
            doAction: "This function needs an integer, but does nothing because it's a template.",
            doNothing: "This function really does nothing, it's a template.",
            readSensor: "Will always return 1, because it's a template."
         }
      }
   }

   // Create a base context
   var context = quickAlgoContext(display, infos);
   // Import our localLanguageStrings into the global scope
   var strings = context.setLocalLanguageStrings(localLanguageStrings);

   // Some data can be made accessible by the library through the context object
   context.template = {};

   // A context must have a reset function to get back to the initial state
   context.reset = function(taskInfos) {
      // Do something here

      if (context.display) {
         context.resetDisplay();
      }
   };

   // Reset the context's display
   context.resetDisplay = function() {
      // Do something here
      $('#grid').html('Display for the library goes here.');

      // Ask the parent to update sizes
      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   // Update the context's display to the new scale (after a window resize for instance)
   context.updateScale = function() {
      if (!context.display) {
         return;
      }
   };

   // When the context is unloaded, this function is called to clean up
   // anything the context may have created
   context.unload = function() {
      // Do something here
      if (context.display) {
         // Do something here
      }
   };

   /***** Functions *****/
   /* Here we define each function of the library.
      Blocks will generally use context.group.blockName as their handler
      function, hence we generally use this name for the functions. */

   context.template.doAction = function(value, callback) {
      // Do the action, and do the display of the action
      // The timing of the action should correspond to infos.actionDelay, which
      // changes depending on the speed chosen by the user

      // For actions, we call the callback through waitDelay, to wait for the
      // end of the display animation associated with the action (here, there's
      // no display animation because it's a template)
      context.runner.waitDelay(callback);
   };

   context.template.doNothing = function(callback) {
      // Template of function without argument
      context.runner.waitDelay(callback);
   };

   context.template.readSensor = function(callback) {
      // This is a sensor: it returns a value.
      // Here, it always returns 1 because it's a template.
      var returnVal = 1;

      // Here, there's no delay as there's no display; we give the return value
      // as argument for noDelay to pass it to the callback
      context.runner.noDelay(callback, returnVal);
   };

  /*
   * Each function must end its main execution thread by calling one of :
   * `context.runner.noDelay(callback, value)` : return value `value`
   * `context.runner.waitDelay(callback, value, delay)` : return value `value` after `delay` milliseconds
   * `context.runner.waitEvent(callback, target, eventName, func)` : listen for JavaScript event `eventName` on DOM element `target`, until one event `e` is received, and return `func(e)`
   * `context.runner.waitCallback(callback)` : returns a callback `cb` ; wait for `cb` to be called with `cb(value)`, and return `value`
   * If you need to make an asynchronous call, you must still call one of these
   * functions (for instance waitCallback) ; do not call them inside a
   * setTimeout or the execution thread may be broken.
   */


   /***** Blocks definitions *****/
   /* Here we define all blocks/functions of the library.
      Structure is as follows:
      {
         group: [{
            name: "someName",
            // category: "categoryName",
            // yieldsValue: optional true: Makes a block with return value rather than simple command
            // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
            // handler: optional handler function. Otherwise the function context.group.blockName will be used
            // blocklyJson: optional Blockly JSON objects
            // blocklyInit: optional function for Blockly.Blocks[name].init
            //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
            // blocklyXml: optional Blockly xml string
            // codeGenerators: optional object:
            //   { Python: function that generates Python code
            //     JavaScript: function that generates JS code
            //   }
         }]
      }
      [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
      [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
   */

   context.customBlocks = {
      // Define our blocks for our namespace "template"
      template: {
         // Categories are reflected in the Blockly menu
         actions: [
            { name: "doAction", params: [null] }, // Function taking an argument
            { name: "doNothing" }, // Function taking no argument
         ],
         sensors: [
            { name: "readSensor", yieldsValue: true } // Function returning a value
         ]
      }
      // We can add multiple namespaces by adding other keys to customBlocks.
   };

   // Color indexes of block categories (as a hue in the range 0–420)
   context.provideBlocklyColours = function() {
      return {
         categories: {
            actions: 0,
            sensors: 100
         }
      };
   };

   // Constants available in Python
   context.customConstants = {
      template: [
         { name: "ONE", value: 1 },
         { name: "TRUEVALUE", value: true },
         { name: "LIBNAME", value: "template" }
      ]
   };

   // Don't forget to return our newly created context!
   return context;
}

// Register the library; change "template" by the name of your library in lowercase
if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('template', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['template', getContext]);
}
