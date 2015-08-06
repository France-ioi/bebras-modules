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
         t.push(initFct(x,y));
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
   return Beav.Matrix.init(nbRows, nbCols, function(x,y) { return v; });
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
         if (selectFct(m[x][y],x,y)) {
            count++;
         }
      }
   }
   return count;
};


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

