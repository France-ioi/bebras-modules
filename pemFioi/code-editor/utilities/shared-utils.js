/*!
 * @author John Ropas
 * @since 17/12/2016
 */

CodeEditor.Utils.Shared.getUrlParameter = function (sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};


// from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// where they got it from the stackoverflow-code itself ("formatUnicorn")
if (!String.prototype.format) {
  String.prototype.format = function() {
    var str = this.toString();
    if (!arguments.length)
      return str;
    var args = typeof arguments[0],
      args = (("string" == args || "number" == args) ? arguments : arguments[0]);
    for (var arg in args)
      str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
    return str;
  }
}

// We need to be able to clean all events
if (EventTarget.prototype.addEventListenerBase == undefined) {
  EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    this.addEventListenerBase.apply(this, arguments);
    if (!this.EventList[type]) {
      this.EventList[type] = [];
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length; index++) {
      if (list[index] === listener) {
        return;
      }
    }
    list.push(listener);
  };

  EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    if (listener instanceof Function) {
      this.removeEventListenerBase.apply(this, arguments);
    }
    if (!this.EventList[type]) {
      return;
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length;) {
      var item = list[index];
      if (!listener) {
        this.removeEventListenerBase(type, item);
        list.splice(index, 1);
        continue;
      }
      else if (item === listener) {
        list.splice(index, 1);
        break;
      }
      index++;
    }
    if (list.length == 0) {
      delete this.EventList[type];
    }
  };
}

var highlightPause = false;

/*
debounce:
   execute a function only every threshold milliseconds.
   wait: do not execute the function until the calls stop
*/
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
