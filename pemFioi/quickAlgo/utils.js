/*
    utils:
        Various utility functions for all modes.
*/

var getUrlParameter = function (sParam) {
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
};

/**
 * This method allow us to verify if the current value is primitive. A primitive is a string or a number or boolean
 * (any value that can be safely compared
 * @param obj The object to check if it is a primitive or not
 * @return {boolean} true if object is primitive, false otherwise
 */
function isPrimitive(obj)
{
    return (obj !== Object(obj));
}

/**
 * THis function allow us to compare two objects. Do not call with {@code null} or {@code undefined}
 * Be careful! Do not use this with circular objects.
 * @param obj1 The first object to compare
 * @param obj2 The second object to compare
 * @return {boolean} true if objects are equals, false otherwise.
 */
function deepEqual(obj1, obj2) {

    if (obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    // if one is primitive and not the other, then we can return false. If both are primitive, then the up
    // comparison can return true
    if (isPrimitive(obj1) || isPrimitive(obj2))
        return false;

    if (Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for (var key in obj1)
    {
        if (!(key in obj2)) return false; //other object doesn't have this prop
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
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
   var el = '#' + id;
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

function addInSet(l, val) {
   // Add val to list l if not already present
   if(l.indexOf(val) == -1) {
      l.push(val);
   }
}

// From w3schools.com
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


window.SrlLogger = {
   active: false,
   version: 0
   };

SrlLogger.load = function() {
   SrlLogger.active = true;

   SrlLogger.logMouseInit();
   SrlLogger.logKeyboardInit();
};

SrlLogger.logMouseInit = function() {
   if(SrlLogger.logMouseInitialized) { return; }

   SrlLogger.mouseButtons = {'left': false, 'right': false};

   window.addEventListener('mousedown', SrlLogger.logMouse);
   window.addEventListener('mousemove', SrlLogger.logMouse);
   window.addEventListener('mouseup', SrlLogger.logMouse);

   SrlLogger.logMouseInitialized = true;
};

SrlLogger.logMouse = function(e) {
   if(!SrlLogger.active) { return; }
   if(e.type == 'mousemove' && SrlLogger.mouseMoveIgnore) { return; }

   var state = 'aucun';

   if(e.type == 'mousedown' || e.type == 'mouseup') {
      var newval = e.type == 'mousedown';
      if(e.button === 0) {
         var btn = 'left';
      } else if(e.button === 2) {
         var btn = 'right';
      } else {
         return;
      }
      SrlLogger.mouseButtons[btn] = newval;

      state = btn == 'left' ? 'clic gauche' : 'clic droit';
   }

   if(e.type == 'mousemove') {
      // Throttle mousemove events
      SrlLogger.mouseMoveIgnore = true;
      setTimeout(function () { SrlLogger.mouseMoveIgnore = false; }, 100);

      if(SrlLogger.mouseButtons['left'] || SrlLogger.mouseButtons['right']) {
         state = 'drag';
      }
   }

   var zone = 'task';
   var target = $(e.target);
   var targetParent = null;
   if((targetParent = target.parents('#blocklyLibContent')).length) {
      zone = 'editor';
   } else if((targetParent = target.parents('#gridContainer')).length) {
      zone = 'grid';
   } else if((targetParent = target.parents('.speedControls')).length) {
      zone = 'controls';
   } else {
      targetParent = null;
   }

   var tpx = e.pageX;
   var tpy = e.pageY;

   var win = $(window);
   var winw = win.width();
   var winh = win.height();
   var tpw = winw;
   var tph = winh;
   if(targetParent) {
      var tpo = targetParent.offset();
      tpx -= Math.floor(tpo.left);
      tpy -= Math.floor(tpo.top);
      tpw = Math.floor(targetParent.width());
      tph = Math.floor(targetParent.height());
   }
   var data = {
      'reference': 'souris',
      'version': SrlLogger.version,
      'zone': zone,
      'etat': state,
      'coordonnees_ecran_x': e.screenX,
      'coordonnees_ecran_y': e.screenY,
      'coordonnees_page_x': e.pageX,
      'coordonnees_page_y': e.pageY,
      'coordonnees_zone_x': tpx,
      'coordonnees_zone_y': tpy,
      'dimension_zone_longueur': tpw,
      'dimension_zone_hauteur': tph,
      'dimension_page_longueur': win.width(),
      'dimension_page_hauteur': win.height()
      };

   platform.log(['srl', data]);
};

SrlLogger.logKeyboardInit = function() {
   if(SrlLogger.logKeyboardInitialized) { return; }

   window.addEventListener('keydown', SrlLogger.logKeyboard);

   SrlLogger.logKeyboardInitialized = true;
};

SrlLogger.logKeyboard = function(e) {
   if(!SrlLogger.active) { return; }

   var text = e.key;
   var data = {
      'reference': 'clavier',
      'version': SrlLogger.version,
      'touche': text
      };
   platform.log(['srl', data]);
};

SrlLogger.stepByStep = function(subtask, type) {
   if(!SrlLogger.active) { return; }

   var srlType = '';
   if(type == 'play') {
      srlType = subtask.context.actionDelay == 0 ? 'Aller à la fin' : 'Exécution automatique';
   } else if(type == 'step') {
      srlType = 'Exécution Manuelle';
   } else if(type == 'stop') {
      srlType = 'Revenir au début';
   }

   var data = {
      reference: 'pas_a_pas',
      version: SrlLogger.version,
      action: srlType,
      vitesse: subtask.context.infos.actionDelay
      };
   platform.log(['srl', data]);
};

SrlLogger.navigation = function(type) {
   if(!SrlLogger.active) { return; }

   var data = {
      reference: 'navigation',
      version: SrlLogger.version,
      module: type
      };
   platform.log(['srl', data]);
};

SrlLogger.levelLoaded = function(level) {
   if(!SrlLogger.active || SrlLogger.lastLevelLoaded == level) { return; }

   SrlLogger.lastLevelLoaded = level;

   var defaultLevelsRanks = { basic: 1, easy: 2, medium: 3, hard: 4 };
   var version = defaultLevelsRanks[level];
   if(!version) { version = 5; }

   if(version == SrlLogger.version) { return; }

   SrlLogger.version = version;
   SrlLogger.navigation('Exercice');
};

SrlLogger.validation = function(score, error, experimentation) {
   if(!SrlLogger.active) { return; }

   if(error == 'code') {
      error = 'Erreur de prérequis';
   } else if(error == 'execution') {
      error = 'Erreur de solution';
   } else {
      error = 'Aucune';
   }
   var data = {
      reference: 'validation',
      version: SrlLogger.version,
      score: score,
      experimentation: experimentation,
      'type_erreur': error
      };
   platform.log(['srl', data]);
};

SrlLogger.modification = function(len, error) {
   if(!SrlLogger.active) { return; }

   if(error == 'code') {
      error = 'Erreur de prérequis';
   } else if(error == 'execution') {
      error = 'Erreur de solution';
   } else {
      error = 'Aucune';
   }
   var data = {
      reference: 'modification',
      version: SrlLogger.version,
      'taille_reponse': len,
      erreur: error
      };
   platform.log(['srl', data]);
};


window.iOSDetected = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

(function() {
   var detectTouch = null;
   detectTouch = function() {
      window.touchDetected = true;
      window.removeEventListener('touchstart', detectTouch);
      }
   window.addEventListener('touchstart', detectTouch);
})();
