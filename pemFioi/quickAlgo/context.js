var quickAlgoContext = function(display, infos) {
  var context = {
    display: display,
    infos: infos,
    nbCodes: 1, // How many different codes the user can edit
    nbNodes: 1 // How many nodes will be executing programs
    };

  // Set the localLanguageStrings for this context
  context.setLocalLanguageStrings = function(localLanguageStrings) {
    if(window.BlocksHelper && infos && infos.blocksLanguage) {
      localLanguageStrings = BlocksHelper.mutateBlockStrings(
        localLanguageStrings,
        infos.blocksLanguage
        );
    }

    context.localLanguageStrings = localLanguageStrings;
    window.stringsLanguage = window.stringsLanguage || "fr";
    window.languageStrings = window.languageStrings || {};

    if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
    } else { // merge translations
      $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
    }
    context.strings = window.languageStrings;
    return context.strings;
  };

  // Import more language strings
  context.importLanguageStrings = function(source, dest) {
    if ((typeof source != "object") || (typeof dest != "object")) {
      return;
    }
    for (var key1 in source) {
      if (dest[key1] != undefined && typeof dest[key1] == "object") {
        context.importLanguageStrings(source[key1], dest[key1]);
      } else {
        dest[key1] = source[key1];
      }
    }
  };

  // Get the list of concepts
  // List can be defined either in context.conceptList, or by redefining this
  // function
  context.getConceptList = function() {
    return context.conceptList || [];
  };

  // Default implementations
  context.changeDelay = function(newDelay) {
    // Change the action delay while displaying
    infos.actionDelay = newDelay;
  };

  context.waitDelay = function(callback, value) {
    // Call the callback with value after actionDelay
    if(context.runner) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
    } else {
      // When a function is used outside of an execution
      setTimeout(function () { callback(value); }, infos.actionDelay);
    }
  };

  context.callCallback = function(callback, value) {
    // Call the callback with value directly
    if(context.runner) {
      context.runner.noDelay(callback, value);
    } else {
      // When a function is used outside of an execution
      callback(value);
    }
  };

  context.setCurNode = function(curNode) {
    // Set the current node
    context.curNode = curNode;
  };

  context.debug_alert = function(message, callback) {
    // Display debug information
    message = message ? message.toString() : '';
    if (context.display) {
      alert(message);
    }
    context.callCallback(callback);
  };

  // Placeholders, should be actually defined by the library
  context.reset = function() {
    // Reset the context
    if(display) {
      context.resetDisplay();
    }
  };

  context.resetDisplay = function() {
    // Reset the context display
  };

  context.updateScale = function() {
    // Update the display scale when the window is resized for instance
  };

  context.unload = function() {
    // Unload the context, cleaning up
  };

  context.provideBlocklyColours = function() {
    // Provide colours for Blockly
    return {};
  };

  // Properties we expect the context to have
  context.localLanguageStrings = {};
  context.customBlocks = {};
  context.customConstants = {};
  context.conceptList = [];

  return context;
};


// Global variable allowing access to each getContext
var quickAlgoLibraries = {
  libs: {},
  order: [],
  contexts: {},
  mergedMode: false,

  get: function(name) {
    return this.libs[name];
  },

  getContext: function() {
    // Get last context registered
    if(this.order.length) {
      if(this.mergedMode) {
        var gc = this.getMergedContext();
        return gc.apply(gc, arguments);
      } else {
        var gc = this.libs[this.order[this.order.length-1]];
        return gc.apply(gc, arguments);
      }
    } else {
      if(getContext) {
        return getContext.apply(getContext, arguments);
      } else {
        throw "No context registered!";
      }
    }
  },

  setMergedMode: function(options) {
    // Set to retrieve a context merged from all contexts registered
    // options can be true or an object with the following properties:
    // -displayed: name of module to display first
    this.mergedMode = options;
  },

  getMergedContext: function() {
    // Make a context merged from multiple contexts
    if(this.mergedMode.displayed && this.order.indexOf(this.mergedMode.displayed) > -1) {
      this.order.splice(this.order.indexOf(this.mergedMode.displayed), 1);
      this.order.unshift(this.mergedMode.displayed);
    }
    var that = this;

    return function(display, infos) {
      // Merged context
      var context = quickAlgoContext(display, infos);
      var localLanguageStrings = {};
      context.customBlocks = {};
      context.customConstants = {};
      context.conceptList = [];

      var subContexts = [];
      for(var scIdx=0; scIdx < that.order.length; scIdx++) {
        // Only the first context gets display = true
        var newContext = that.libs[that.order[scIdx]](display && (scIdx == 0), infos);
        subContexts.push(newContext);

        // Merge objects
        mergeIntoObject(localLanguageStrings, newContext.localLanguageStrings);
        mergeIntoObject(context.customBlocks, newContext.customBlocks);
        mergeIntoObject(context.customConstants, newContext.customConstants);
        mergeIntoArray(context.conceptList, newContext.conceptList);

        // Merge namespaces
        for(var namespace in newContext.customBlocks) {
          if(!context[namespace]) { context[namespace] = {}; }
          for(var category in newContext.customBlocks[namespace]) {
            var blockList = newContext.customBlocks[namespace][category];
            for(var i=0; i < blockList.length; i++) {
              var name = blockList[i].name;
              if(name && !context[namespace][name] && newContext[namespace][name]) {
                context[namespace][name] = function(nc, func) {
                  return function() {
                    context.propagate(nc);
                    func.apply(nc, arguments);
                    };
                }(newContext, newContext[namespace][name]);
              }
            }
          }
        }
      }

      var strings = context.setLocalLanguageStrings(localLanguageStrings);

      // Propagate properties to the subcontexts
      context.propagate = function(subContext) {
        var properties = ['raphaelFactory', 'delayFactory', 'blocklyHelper', 'display', 'runner'];
        for(var i=0; i < properties.length; i++) {
          subContext[properties[i]] = context[properties[i]];
        }
      }

      // Merge functions
      context.reset = function(taskInfos) {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].reset(taskInfos);
        }
      };
      context.resetDisplay = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].resetDisplay();
        }
      };
      context.updateScale = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].updateScale();
        }
      };
      context.unload = function() {
        for(var i=subContexts.length-1; i >= 0; i--) {
          // Do the unload in reverse order
          context.propagate(subContexts[i]);
          subContexts[i].unload();
        }
      };
      context.provideBlocklyColours = function() {
        var colours = {};
        for(var i=0; i < subContexts.length; i++) {
          mergeIntoObject(colours, subContexts[i].provideBlocklyColours());
        }
        return colours;
      };

      // Fetch some other data / functions some contexts have
      for(var i=0; i < subContexts.length; i++) {
        for(var prop in subContexts[i]) {
          if(typeof context[prop] != 'undefined') { continue; }
          if(typeof subContexts[i][prop] == 'function') {
            context[prop] = function(sc, func) {
              return function() {
                context.propagate(sc);
                func.apply(sc, arguments);
              }
            }(subContexts[i], subContexts[i][prop]);
          } else {
            context[prop] = subContexts[i][prop];
          }
        }
      };

      return context;
    };
  },

  register: function(name, func) {
    if(this.order.indexOf(name) > -1) { return; }
    this.libs[name] = func;
    this.order.push(name);
  }
};

// Initialize with contexts loaded before
if(window.quickAlgoLibrariesList) {
  for(var i=0; i<quickAlgoLibrariesList.length; i++) {
    quickAlgoLibraries.register(quickAlgoLibrariesList[i][0], quickAlgoLibrariesList[i][1]);
  }
}
