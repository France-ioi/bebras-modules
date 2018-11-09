var Beav = new Object();


/**********************************************************************************/
/* Object */

Beav.Object = new Object();

Beav.Object.eq = function eq(x, y) {
   // assumes arguments to be of same type
   var tx = typeof(x);
   var ty = typeof(y);
   if (tx != ty)
      throw "Beav.Object.eq incompatible types";
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

