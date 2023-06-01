function ResponseCurve(settings) {
   self = this;
   var paper = settings.paper;
   var paperID = settings.paperID;
   var attr = settings.attr;
   this.enabled = settings.enabled;
   var x0 = settings.x0;
   var y0 = settings.y0;
   var w = settings.width;
   var h = settings.height;
   var updateCurveCallback;
   var dragEndCallback;
   var curve;
   this.background;
   var pointPos = [];
   var points = [];
   var draggedID;
   var startPos;
   var selectedPoints = [];
   var pointSize = 10;
   var dragOverlaySize = 30;
   var nameIndex = 2;
   var useBezier = settings.useBezier;
   var scaleResp = 1;

   this.setUpdateCurveCallback = function(fct) {
      updateCurveCallback = fct;
   };
   this.setDragEndCallback = function(fct) {
      dragEndCallback = fct;
   };
   this.setPointPos = function(pos) {
      for(var iPoint = 0; iPoint < points.length; iPoint++){
         points[iPoint].obj.remove();
      }
      points = [];
      pointPos = pos;
      nameIndex = pos.length;
      drawPoints();
      updateCurve();
      this.setEnabled(this.enabled);
   };
   this.setEnabled = function(enabled) {
      if(enabled){
         this.initHandlers();
      }else{
         this.removeHandlers();
      }
      this.enabled = enabled;
   };

   this.getCurve = function() {
      return curve;
   };

   this.init = function() {
      this.background = paper.rect(x0,y0,w,h).attr(attr.background);
      addPoint(x0,y0 + h,"p_0");
      addPoint(x0 + w,y0,"p_1");
      drawPoints();
      updateCurve("init");
      this.setEnabled(this.enabled);
      // this.initHandlers();
   };

   this.initHandlers = function() {
      this.enableClickCurve();
      this.enableDragPoints();
      $(document).off("keydown");
      $(document).keydown(function(ev){
         if(ev.which == 46){
            for(var iPoint = 0; iPoint < selectedPoints.length; iPoint++){
               var name = selectedPoints[iPoint];
               removePoint(name);
            }
            selectedPoints = [];
            updateCurve("keydown");
         }
      });
   };
   this.removeHandlers = function() {
      this.disableClickCurve();
      this.disableDragPoints();
   };

   this.enableClickCurve = function() {
      curve[1].unclick();
      curve[1].click(clickCurve);
      curve[1].attr("cursor","pointer");
   };
   this.disableClickCurve = function() {
      curve[1].unclick();
      curve[1].attr("cursor","auto");
   };

   this.enableDragPoints = function() {
      for(var iPoint = 0; iPoint < points.length; iPoint++){
         enableDragPoint(iPoint);
      }
   };

   var enableDragPoint = function(id) {
      var name = points[id].id;
      points[id].obj[1].drag(onMove,onStart(name),onEnd);
      points[id].obj[1].attr("cursor","grab");
   };

   this.disableDragPoints = function() {
      for(var iPoint = 0; iPoint < points.length; iPoint++){
         points[iPoint].obj[1].undrag();
         points[iPoint].obj[1].attr("cursor","auto");
      }
   };

    function clickCurve(ev) {
      if (window.displayHelper) {
         scaleResp = window.displayHelper.scaleFactor || 1;
      }else{
         scaleResp = 1;
      }
      var xMouse = (ev.pageX - $("#"+paperID).offset().left)/scaleResp;
      var yMouse = (ev.pageY - $("#"+paperID).offset().top)/scaleResp;
      var pos = getClosestCurvePointPos(xMouse,yMouse);
      insertPoint(pos.x,pos.y);
      updateCurve("click curve");
   };

   function insertPoint(x,y) {
      var index = null;
      for(var iPoint = 0; iPoint < points.length - 1; iPoint++){
         var pos = pointPos[iPoint];
         var nextPos = pointPos[iPoint + 1];
         if(pos.x < x && nextPos.x > x){
            index = iPoint + 1;
         }
      }
      if(index != null){
         var newID = "p_"+nameIndex;
         pointPos.splice(index,0,{x:x,y:y,id:newID});
         nameIndex++;
         var point = paper.rect(x - pointSize/2,y - pointSize/2,pointSize,pointSize).attr(attr.point);
         // var dragOverlay = paper.rect(x - dragOverlaySize/2,y - dragOverlaySize/2,dragOverlaySize,dragOverlaySize).attr(attr.dragOverlay);
         var dragOverlay = paper.circle(x,y,dragOverlaySize/2).attr(attr.dragOverlay);
         points.splice(index,0,{ obj: paper.set(point,dragOverlay), id: newID });
         enableDragPoint(index);
      }
   };

   var removePoint = function(name) {
      var id = getIndexFromName(name);
      if(points[id]){
         points[id].obj.remove();
         points.splice(id,1);
         pointPos.splice(id,1);
      }
   };

   var getClosestCurvePointPos = function(x,y) {
      var minD = Infinity;
      var curvePos = null;
      for(var length = 0; length < curve[0].getTotalLength(); length++){
         var pos = curve[0].getPointAtLength(length);
         var d = Beav.Geometry.distance(x,y,pos.x,pos.y);
         if(d < minD){
            minD = d;
            curvePos = pos;
         }
      }
      return curvePos;
   };

   this.getXFromY = function(y) {
      var x = [];
      var minY = Infinity;
      var maxY = 0;
      for(var length = 1; length < curve[0].getTotalLength(); length++){
         var pos = curve[0].getPointAtLength(length);
         var prevPos = curve[0].getPointAtLength(length - 1);
         if(y >= Math.min(prevPos.y,pos.y) && y <= Math.max(prevPos.y,pos.y)){
            x.push((prevPos.x + pos.x)/2);
         }
         minY = Math.min(minY,prevPos.y,pos.y);
         maxY = Math.max(maxY,prevPos.y,pos.y);
      }
      if(y < minY){
         x = [x0 + w];
      }else if(y > maxY){
         x = [x0];
      }
      return x
   };

   this.getCurveData = function(yVsX) {
      var data = (yVsX) ? [] : {};
      var minY = Infinity;
      var maxY = 0;
      for(var length = 0; length < curve[0].getTotalLength(); length++){
         var pos = curve[0].getPointAtLength(length);
         var y = Math.round(pos.y);
         var x = Math.round(pos.x);
         if(yVsX && data[x] == undefined){
            data[x] = y;
         }else{
            if(!data[y]){
               data[y] = [];
            }
            if(!data[y].includes(x)){
               data[y].push({ x: x, alpha: pos.alpha });
            }
         }
         minY = Math.min(minY,pos.y);
         maxY = Math.max(maxY,pos.y);
      }
      return { data: data, minY: minY, maxY: maxY }
   };

   var getIndexFromName = function(name) {
      for(var iPoint = 0; iPoint < pointPos.length; iPoint++){
         if(name == pointPos[iPoint].id){
            return iPoint
         }
      }
      return null
   };

   var onStart = function(name) {
      return function(x,y,ev) {
         if (window.displayHelper) {
            scaleResp = window.displayHelper.scaleFactor || 1;
         }else{
            scaleResp = 1;
         }
         draggedID = name;
         var index = getIndexFromName(name);
         startPos = pointPos[index];
         // console.log(name)
      }
   };
   var onMove = function(dx,dy,x,y,ev) {
      var id = getIndexFromName(draggedID);
      var xMouse = (x - $("#"+paperID).offset().left)/scaleResp;
      var yMouse = (y - $("#"+paperID).offset().top)/scaleResp;

      var xMin = (id) ? pointPos[id - 1].x + dragOverlaySize/2 : x0;
      var xMax = (id < points.length - 1) ? pointPos[id + 1].x - dragOverlaySize/2 : x0 + w;
      var newX = Math.min(xMax,Math.max(xMin,xMouse));
      var yMin = y0;
      var yMax = y0 + h;
      var newY = Math.min(yMax,Math.max(yMin,yMouse));
      if(id == 0){
         if(newX - x0 < (y0 + h) - newY){
            newX = x0;
         }else{
            newY = y0 + h;
         }
      }else if(id == points.length - 1){
         if(x0 + w - newX < newY - y0){
            newX = x0 + w;
         }else{
            newY = y0;
         }
      }

      pointPos[id] = {x:newX,y:newY,id:draggedID};
      points[id].obj[0].attr({
         x: newX - pointSize/2,
         y: newY - pointSize/2
      });
      points[id].obj[1].attr({
         // x: newX - dragOverlaySize/2,
         // y: newY - dragOverlaySize/2
         cx: newX,
         cy: newY
      });
      updateCurve("move");
   };
   var onEnd = function() {
      var id = getIndexFromName(draggedID);
      var xi = startPos.x;
      var yi = startPos.y;
      var xf = pointPos[id].x;
      var yf = pointPos[id].y;
      var d = Beav.Geometry.distance(xi,yi,xf,yf);
      if(d < 10){
         selectPoint(draggedID);
      }
      if(dragEndCallback){
         dragEndCallback();
      }
   };

   var selectPoint = function(name) {
      var id = getIndexFromName(name);
      if(id == 0 || id == points.length - 1){
         return
      }
      if(Beav.Array.has(selectedPoints,name)){
         var index = Beav.Array.indexOf(selectedPoints,name);
         selectedPoints.splice(index,1);
         points[id].obj[0].attr(attr.point);
      }else{
         selectedPoints.push(name);
         points[id].obj[0].attr(attr.selectedPoint);
         points[id].obj[1].undblclick();
         points[id].obj[1].dblclick(function() {
            removePoint(name);
            updateCurve("keydown");
         });
      }
   };

   var addPoint = function(x,y,id) {
      pointPos.push({x:x,y:y,id:id});
   };

   var updateCurve = function(src) {
      var path = "";
      var nbPoints = pointPos.length;
      for(var iPoint = 0; iPoint < nbPoints; iPoint++){
         var pos = pointPos[iPoint];
         var x1 = pos.x;
         var y1 = pos.y;

         if(iPoint < nbPoints - 1){ 
            var nextPos = pointPos[iPoint + 1];
            var x2 = nextPos.x;
            var y2 = nextPos.y; 
            var yMin = y0;
            var yMax = y0 + h;
            var xControl1 = (x1 + x2)/2;
            var xControl2 = (x1 + x2)/2;
            var yControl1 = Math.max(yMin,Math.min(yMax,y1 + x1 - xControl1));
            var yControl2 = Math.max(yMin,Math.min(yMax,y2 + x2 - xControl2));
            if(iPoint == 0){
               path += "M"+x1+" "+y1;
               xControl1 = x1;
               yControl1 = y1;
            } 
            if(iPoint == nbPoints - 2){
               xControl2 = x2;
               yControl2 = y2;
            }
            if (useBezier) {
               path += ",C"+xControl1+" "+yControl1+" "+xControl2+" "+yControl2+" "+x2+" "+y2;
            } else {
               path += ",L"+x2+" "+y2;
            }
         }
      }
      if(curve){
         curve.attr("path",path);
      }else{
         var tempCurve = paper.path(path).attr(attr.curve);
         var clickArea = paper.path(path).attr(attr.clickArea);
         curve = paper.set(tempCurve,clickArea);
      }
      self.pointsToFront();

      if(updateCurveCallback){
         updateCurveCallback();
      }
   };

   this.pointsToFront = function() {
      for(var iPoint = 0; iPoint < points.length; iPoint++){
         points[iPoint].obj.toFront();
      }
   };

   var drawPoints = function() {
      for(var iPoint = 0; iPoint < pointPos.length; iPoint++){
         var pos = pointPos[iPoint];
         var point = paper.rect(pos.x - pointSize/2,pos.y - pointSize/2,pointSize,pointSize).attr(attr.point);
         // var dragOverlay = paper.rect(pos.x - dragOverlaySize/2,pos.y - dragOverlaySize/2,dragOverlaySize,dragOverlaySize).attr(attr.dragOverlay);
         var dragOverlay = paper.circle(pos.x,pos.y,dragOverlaySize/2).attr(attr.dragOverlay);
         points[iPoint] = { obj: paper.set(point,dragOverlay), id: pos.id };
      }
   };
   
   this.init();
};