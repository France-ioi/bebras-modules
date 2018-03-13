/*
    utils:
        Various utility functions for all modes.
*/

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var arrayContains = function(array, needle) {
   for (var index in array) {
      if (needle == array[index]) {
         return true;
      }
   }
   return false;
}

var highlightPause = false;

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  //e.stopPropagation();
  //e.preventDefault();
}


// from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// where they got it from the stackoverflow-code itself ("formatUnicorn")
if (!String.prototype.format) {
   String.prototype.format = function() {
      var str = this.toString();
      if (!arguments.length)
         return str;
      var args = typeof arguments[0],
          args = (("string" == args || "number" == args) ? arguments : arguments[0]);
      for (var arg in args) {
         str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
      }
      return str;
   }
}


function showModal(id) {
   var el = '#' + id
   $(el).show();
}
function closeModal(id) {
   var el = '#' + id;
   $(el).hide();
}






// Merges arrays by values
// (Flat-Copy only)
function mergeIntoArray(into, other) {
   for (var iOther in other) {
      var intoContains = false;

      for (var iInto in into) {
         if (other[iOther] == into[iInto]) {
            intoContains = true;
         }
      }

      if (!intoContains) {
         into.push(other[iOther]);
      }
   }
}

// Merges objects into each other similar to $.extend, but
// merges Arrays differently (see above)
// (Deep-Copy only)
function mergeIntoObject(into, other) {
   for (var property in other) {
      if (other[property] instanceof Array) {
         if (!(into[property] instanceof Array)) {
            into[property] = [];
         }
         mergeIntoArray(into[property], other[property]);
      }
      if (other[property] instanceof Object) {
         if (!(into[property] instanceof Object)) {
            into[property] = {};
         }
         mergeIntoObject(into[property], other[property]);
      }
      into[property] = other[property];
   }
}

/*
{ shared: { field1: X }, easy: { field2: Y } } becomes { field1: X, field2: Y } if the current level is easy
{ shared: [X, Y], easy: [Z] }  becomes [X, Y, Z] if the current level is easy
{ easy: X, medium: Y, hard: Z}  becomes X if the current level is easy
*/

function testLevelSpecific() {
   var tests = [
      {
         in: { field1: "X", field2: "Y" },
         out: { field1: "X", field2: "Y" }
      },
      {
            in: { easy: "X", medium: "Y", hard: "Z"},
            out: "X"
      },
      {
          in: { shared: { field1: "X" }, easy: { field2: "Y" } },
          out: { field1: "X", field2: "Y" }
      },
      {
            in: { shared: ["X", "Y"], easy: ["Z"] },
            out: ["X", "Y", "Z"]
      }
   ];
   for (var iTest = 0; iTest < tests.length; iTest++) {
      var res = extractLevelSpecific(tests[iTest].in, "easy");
      if (JSON.stringify(res) != JSON.stringify(tests[iTest].out)) { // TODO better way to compare two objects
         console.error("Test " + iTest + " failed: returned " + JSON.stringify(res));
      }
   }
}



// We need to be able to clean all events

if (Node && Node.prototype.addEventListenerBase == undefined) {
   // IE11 doesn't have EventTarget
   if(typeof EventTarget === 'undefined') {
      var targetPrototype = Node.prototype;
   } else {
      var targetPrototype = EventTarget.prototype;
   }
   targetPrototype.addEventListenerBase = targetPrototype.addEventListener;
   targetPrototype.addEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       this.addEventListenerBase.apply(this, arguments);
       if(!this.EventList[type]) { this.EventList[type] = []; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length; index++)
       {
           if(list[index] === listener) { return; }
       }
       list.push(listener);
   };

   targetPrototype.removeEventListenerBase = targetPrototype.removeEventListener;
   targetPrototype.removeEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       if(listener instanceof Function) { this.removeEventListenerBase.apply(this, arguments); }
       if(!this.EventList[type]) { return; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length;)
       {
           var item = list[index];
           if(!listener)
           {
               this.removeEventListenerBase(type, item);
               list.splice(index, 1); continue;
           }
           else if(item === listener)
           {
               list.splice(index, 1); break;
           }
           index++;
       }
       if(list.length == 0) { delete this.EventList[type]; }
   };
}

function debounce(fn, threshold, wait) {
   var timeout;
   return function debounced() {
      if (timeout) {
         if(wait) {
            clearTimeout(timeout);
         } else {
            return;
         }
      }
      function delayed() {
         fn();
         timeout = null;
      }
      timeout = setTimeout(delayed, threshold || 100);
   }
}
