var Beav = new Object();


/**********************************************************************************/
/* Object */

Beav.Object = new Object();

Beav.Object.eq = function eq(x, y) {
   // assumes arguments to be of same type, except if one of the two arguments is null,
   // in which case the comparison returns true if the other argument is also null.
   if (x == null || y == null) {
      return (x == null && y == null);
   }
   var tx = typeof(x);
   var ty = typeof(y); 
   if (tx != ty) {
      throw "Beav.Object.eq incompatible types";
   }
   if (tx == "boolean" || tx == "number" || tx == "string" || tx == "undefined") {
      return x == y;
   }
   if ($.isArray(x)) {
      if (! $.isArray(y))
         throw "Beav.Object.eq incompatible types";
      if (x.length != y.length)
         return false;
      for (var i = 0; i < x.length; i++)
         if (! eq(x[i], y[i]))
            return false;
      return true;
   }
   if (tx == "object") {
      var kx = [];
      for (var key in x) {
         kx.push(key);
      }
      var ky = [];
      for (var key in y) {
         ky.push(key);
      }
      var sort_keys = function(n1,n2) { return (n1 < n2) ? -1 : ((n1 > n2) ? 1 : 0); };
      kx.sort(sort_keys);
      ky.sort(sort_keys);
      if (kx.length != ky.length)
         return false;
      for (var i = 0; i < kx.length; i++) {
         var ex = kx[i];
         var ey = ky[i];
         if (ex != ey)
            return false;
         if (! eq(x[ex], y[ex]))
            return false;
      }
      return true;
   }
   throw "Beav.Object.eq unsupported types";
};

Beav.Object.clone = function(obj) {
   return JSON.parse(JSON.stringify(obj))
};


/**********************************************************************************/
/* Array */

Beav.Array = new Object();

Beav.Array.make = function(nb, initValue) {
   var t = [];
   for (var i = 0; i < nb; i++)
      t[i] = initValue;
   return t;
};

Beav.Array.init = function(nb, initFct) {
   var t = [];
   for (var i = 0; i < nb; i++)
      t.push(initFct(i));
   return t;
};

Beav.Array.indexOf = function(t, v, eq) {
   if (eq === undefined)
      eq = Beav.Object.eq;
   for (var i = 0; i < t.length; i++)
      if (eq(t[i], v))
         return i;
   return -1;
};

Beav.Array.has = function(t, v, eq) {
   return Beav.Array.indexOf(t, v, eq) != -1;
};

Beav.Array.filterCount = function(t, filterFct) {
   var count = 0;
   for (var i = 0; i < t.length; i++)
      if (filterFct(t[i], i))
         count++;
   return count;
};

Beav.Array.stableSort = function(t, compFct) {
   var swap = function(a, b) {
      var v = t[a];
      t[a] = t[b];
      t[b] = v;
   };
   var insert = function (i, j, v) {
      while(i+1 < j && compFct(t[i+1], v) < 0) {
         swap(i, i+1);
         i++;
      }
      t[i] = v;
   };
   var merge = function(i, k, j) {
      for ( ; i<k; i++) {
         if (compFct(t[k], t[i]) < 0) {
            var v = t[i];
            t[i] = t[k];
            insert(k, j, v);
         }
      }
   };
   var msort = function msort(i, j) {
      var size = j - i;
      if (size < 2)
         return;
      var k = i + Math.floor(size/2);
      msort(i, k);
      msort(k, j);
      merge(i, k, j);
   };
   msort(0, t.length);
};

Beav.Array.shuffle = function(t, randomSeed) {
   var nbValues = t.length;
   for (var iValue = 0; iValue < nbValues; iValue++) {
      // TODO: we should pick the next random number at every step
      // by calling, e.g., randomSeed = RandomGenerator.next(randomSeed);
      var randomShift = randomSeed % (nbValues - iValue);
      var pos = iValue + randomShift;
      var tmp = t[iValue];
      t[iValue] = t[pos];
      t[pos] = tmp;
   }
};

Beav.Array.pickRandomNTimes = function (t, rng, n, diffN) {
   // Pick a random index from t, n times, different from at least diffN previous indexes
   // Useful to have a task which randomly cycles through the elements of t,
   // without giving the same task instance as the previous diffN ones
   var previousIndexes = [];
   var index = 0;
   if (n < 1) { n += 100; }
   for (var i = 0; i < n; i++) {
      index = rng.nextInt(0, Math.max(0, t.length - previousIndexes.length - 1));
      var sortedPreviousIndexes = previousIndexes.slice();
      sortedPreviousIndexes.sort();
      for (var j = 0; j < sortedPreviousIndexes.length; j++) {
         if (index >= sortedPreviousIndexes[j]) {
            index++;
         }
      }
      if (index > t.length - 1) {
         // Happens if we ask for more different indexes than there are items in the list
         index = t.length - 1;
      }
      previousIndexes.push(index);
      previousIndexes = previousIndexes.slice(-diffN);
   }
   return t[index];
}


/**********************************************************************************/
/* Matrix */

Beav.Matrix = new Object();

Beav.Matrix.init = function(nbRows, nbCols, initFct) {
   var m = [];
   for (var x = 0; x < nbRows; x++) {
      var t = [];
      for (var y = 0; y < nbCols; y++) {
         t.push(initFct(x, y));
      }
      m.push(t);
   }
   return m;
};

Beav.Matrix.map = function(m, mapFct) {
   var r = [];
   for (var x = 0; x < m.length; x++) {
      r[x] = [];
      for (var y = 0; y < m[x].length; y++) {
         r[x][y] = mapFct(m[x][y], x, y, m);
      }
   }
   return r;
};

Beav.Matrix.copy = function(m) {
   return Beav.Matrix.map(m, function(v) { return v; });
};

Beav.Matrix.make = function(nbRows, nbCols, v) {
   return Beav.Matrix.init(nbRows, nbCols, function() { return v; });
};

Beav.Matrix.forEach = function(m, iterFct) {
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         iterFct(m[x][y], x, y, m);
      }
   }
};

Beav.Matrix.filterCount = function(m, selectFct) {
   var count = 0;
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         if (selectFct(m[x][y], x, y)) {
            count++;
         }
      }
   }
   return count;
};


/**********************************************************************************/
/* Matrix3D */

Beav.Matrix3D = new Object();

Beav.Matrix3D.init = function(nbX, nbY, nbZ, initFct) {
   var m = [];
   for (var x = 0; x < nbX; x++) {
      var t = [];
      for (var y = 0; y < nbY; y++) {
         var r = [];
         for (var z = 0; z < nbZ; z++) {
            r.push(initFct(x, y, z));
         }
         t.push(r);
      }
      m.push(t);
   }
   return m;
};

Beav.Matrix3D.map = function(m, mapFct) {
   var r = [];
   for (var x = 0; x < m.length; x++) {
      r[x] = [];
      for (var y = 0; y < m[x].length; y++) {
         r[x][y] = [];
         for (var z = 0; z < m[x][y].length; z++) {
            r[x][y][z] = mapFct(m[x][y][z], x, y, z, m);
         }
      }
   }
   return r;
};

Beav.Matrix3D.copy = function(m) {
   return Beav.Matrix3D.map(m, function(v) { return v; });
};

Beav.Matrix3D.make = function(nbX, nbY, nbZ, v) {
   return Beav.Matrix3D.init(nbX, nbY, nbZ, function() { return v; });
};

Beav.Matrix3D.forEach = function(m, iterFct) {
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         for (var z = 0; z < m[x][y].length; z++) {
            iterFct(m[x][y][z], x, y, z, m);
         }
      }
   }
};

Beav.Matrix3D.filterCount = function(m, selectFct) {
   var count = 0;
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         for (var z = 0; z < m[x][y].length; z++) {
            if (selectFct(m[x][y][z], x, y, z)) {
               count++;
            }
         }
      }
   }
   return count;
};



/**********************************************************************************/
/* Exception */

/* Mechanism for having user exceptions that cannot be confused
   with JavaScript builtin exceptions.

   To throw the exception myExn, do:

      Beav.Exception.throw(myExn);

   To catch only user exceptions, do:

      try {
         ...
      } catch (exn) {
         var myExn = Beav.Exception.extract(exn);
         ...
      }

    In this case, the exception is automatically re-thrown
    if it is not a user exception.

*/
/*
Beav.Exception = {};

Beav.Exception.constructor = function(arg) {
   this.contents = arg;
};

Beav.Exception.throw = function(arg) {
   throw new Beav.Exception.constructor(arg);
};

Beav.Exception.extract = function(exn) {
   if (exn instanceof Beav.Exception.constructor) {
      return exn.contents;
   } else {
      throw exn;
   }
};
*/

/**********************************************************************************/
/* Navigator */

Beav.Navigator = new Object();

Beav.Navigator.isIE8 = function() {
  return navigator.appVersion.indexOf("MSIE 8.") != -1;
}

Beav.Navigator.getVersion = function(){
   var ua= navigator.userAgent, tem, 
   M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
   if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
   }
   if(M[1]=== 'Chrome'){
      tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
   }
   M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
   if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
   return M
}

Beav.Navigator.isIE = function () {
   // case for IE11 which has trident
   var version = Beav.Navigator.getVersion();
   if (typeof version == 'string' && version.substring(0, 2).toLowerCase() == 'ie') {
      return true
   }
   return version[0].toLowerCase() == 'msie' || version[0].toLowerCase() == 'ie';
}

Beav.Navigator.supportsResponsive = function() {
   if(Beav.Navigator.isIE8()){
      return false
   }
   var navVersion = Beav.Navigator.getVersion();
   if(navVersion[0].toLowerCase() == 'msie'){
      return false
   }
   if(navVersion[0].toLowerCase() == 'firefox' && navVersion[1] < 68){
      return false
   }
   return true
}


/**********************************************************************************/
/* Dom */

Beav.Dom = new Object();

Beav.Dom.showOrHide = function(e, visible) {
   if (visible)
      e.show();
   else
      e.hide();
};


/**********************************************************************************/
/* HTML */

Beav.Html = new Object();

// Escape the html characters in a string
Beav.Html.escape = function(stringToEncode) {
   var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;' };
   return String(stringToEncode).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
   });
};


/**********************************************************************************/
/* Raphael */

Beav.Raphael = new Object();

Beav.Raphael.line = function(paper, x1, y1, x2, y2) {
   return paper.path([ "M", x1, y1, "L", x2, y2 ]);
};

Beav.Raphael.lineRelative = function(paper, x1, y1, dx, dy) {
   return Beav.Raphael.line(paper, x1, y1, x1+dx, y1+dy);
};

Beav.Raphael.loadTextExtensions = function(paper) {
   paper.text_prebeav = paper.text;

   var valign = function(dir) { // dir = 'center', or 'top', or 'bottom'
      var b = this.getBBox();
      var h = b.height;
      var d = 0;
      if (dir == 'center') {
         d = 0;
      } else if (dir == 'top') {
         d = h/2;
      } else if (dir == 'top') {
         d = - h/2; // TODO: maybe remove one pixel in case h is odd number?
      }
      try {
         // this.translate(0, d); // not supported by IE8
         // this.attr({'y': b.y + d}); // does not seem to work
         this.transform("t0," + d); // workaround?
      } catch(e) {}
      return this;
   };

   paper.text = function(x, y, text, fontSize) {
      if(!window.enableRtl || !text || typeof text == "string" || !text.length) {
         var txt = paper.text_prebeav(x, y, text);
         txt.valign = valign;
         return txt;
      }
      var set = paper.set();
      if(!fontSize) { fontSize = 16; }
      var lineHeight = fontSize * 1.2; // Raphael's line-height
      var startY = y - ((text.length - 1) / 2) * lineHeight
      for(var i = 0; i < text.length; i++) {
         var txt = paper.text_prebeav(x, startY + i * lineHeight, text[i]);
         txt.valign = valign;
         set.push(txt);
      }
      return set;
   }

   var setproto = paper.set().__proto__;
   try {
   setproto.valign = function(dir) {
      this.forEach(function(item) {
         item.valign(dir);
      });
      return this;
   };
   } catch(err) {
   }
};

/**********************************************************************************/
/* Random */

Beav.Random = new Object();

Beav.Random.bit = function(randomSeed, idBit) {
   return (randomSeed & (1 << idBit)) ? 1 : 0;
};


/**********************************************************************************/
/* Task */

Beav.Task = new Object();

Beav.Task.scoreInterpolate = function(minScore, maxScore, minResult, maxResult, result) {
   // requires minResult <= result <= maxResult and minScore <= maxScore
   return Math.round(minScore + (maxScore - minScore) * (result - minResult) / (maxResult - minResult));
};


/**********************************************************************************/
/* Geometry */

Beav.Geometry = new Object();

Beav.Geometry.distance = function(x1,y1,x2,y2) {
   return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
};

/*
   This is used to handle drag on devices that have both a touch screen and a mouse.
   Can be tested on chrome by loading a task in desktop mode, then switching to tablet mode.
   To call instead of element.drag(onMove, onStart, onEnd);
*/
Beav.dragWithTouch = function (element, onMove, onStart, onEnd) {
   var touchingX = 0;
   var touchingY = 0;
   var disabled = false;

   function onTouchStart(evt) {
      if (disabled) {
         return;
      }
      var touches = evt.changedTouches;
      touchingX = touches[0].pageX;
      touchingY = touches[0].pageY;
      onStart(touches[0].pageX, touches[0].pageY, evt);         
   }

   function onTouchEnd(evt) {
      if (disabled) {
         return;
      }
      onEnd(null);
   }
   
   function onTouchMove(evt) {
      if (disabled) {
         return;
      }
      var touches = evt.changedTouches;
      var dx = touches[0].pageX - touchingX;
      var dy = touches[0].pageY - touchingY;
      if (window.displayHelper) {
         var scale = window.displayHelper.scaleFactor || 1;
      }else{
         var scale = 1;
      }
      onMove(dx/scale, dy/scale, touches[0].pageX, touches[0].pageY, evt);
   }
   
   function callOnStart(x,y,event) {
      disabled = true;
      onStart(x,y,event);
   }
   
   function callOnMove(dx,dy,x,y,event) {
      disabled = true;
      if (window.displayHelper) {
         var scale = window.displayHelper.scaleFactor || 1;
      }else{
         var scale = 1;
      }
      onMove(dx/scale,dy/scale,x,y,event);
   }
   
   function callOnEnd(event) {
      disabled = false;
      onEnd(event);
   }

   // element.undrag();
   element.drag(callOnMove,callOnStart,callOnEnd);
   if (element.touchstart) {
      element.untouchstart();
      element.untouchend();
      element.untouchmove();
      element.untouchcancel();
      element.touchstart(onTouchStart);
      element.touchend(onTouchEnd);
      element.touchcancel(onTouchEnd);
      element.touchmove(onTouchMove);
   }
}
