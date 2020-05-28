function ResponseCurve(settings) {
   self = this;
   paper = settings.paper;
   paperID = settings.paperID;
   attr = settings.attr;
   x0 = settings.x0;
   y0 = settings.y0;
   w = settings.width;
   h = settings.height;
   this.updateCurveCallback;
   this.dragEndCallback;
   this.curve;
   this.pointPos = [];
   this.points = [];
   this.draggedID;
   this.startPos;
   selectedPoints = [];
   pointSize = 10;
   dragOverlaySize = 20;
   nameIndex = 2;

   this.setUpdateCurveCallback = function(fct) {
      this.updateCurveCallback = fct;
   };
   this.setDragEndCallback = function(fct) {
      this.dragEndCallback = fct;
   };

   this.init = function() {
      paper.rect(x0,y0,w,h).attr(attr.background);
      this.addPoint(x0,y0 + h,"p_0");
      this.addPoint(x0 + w,y0,"p_1");
      this.drawPoints();
      this.updateCurve();
      this.initHandlers();
   };

   this.initHandlers = function() {
      this.enableClickCurve();
      this.enableDragPoints();
      $(document).keydown(function(ev){
         if(ev.which == 46){
            for(var iPoint = 0; iPoint < selectedPoints.length; iPoint++){
               var name = selectedPoints[iPoint];
               self.removePoint(name);
            }
            selectedPoints = [];
            self.updateCurve();
         }
      });
   };

   this.enableClickCurve = function() {
      this.curve[1].unclick();
      this.curve[1].click(this.clickCurve);
      this.curve[1].attr("cursor","pointer");
   };

   this.enableDragPoints = function() {
      for(var iPoint = 0; iPoint < this.points.length; iPoint++){
         this.enableDragPoint(iPoint);
      }
   };

   this.enableDragPoint = function(id) {
      var name = this.points[id].id;
      this.points[id].obj[1].drag(self.onMove,self.onStart(name),self.onEnd);
      this.points[id].obj[1].attr("cursor","grab");
   };

   this.disableDragPoints = function() {
      for(var iPoint = 0; iPoint < this.points.length; iPoint++){
         this.points[iPoint].obj[1].undrag();
         this.points[iPoint].obj[1].attr("cursor","auto");
      }
   };

   this.clickCurve = function(ev) {
      var xMouse = ev.pageX - $("#"+paperID).offset().left;
      var yMouse = ev.pageY - $("#"+paperID).offset().top;
      var pos = self.getClosestCurvePointPos(xMouse,yMouse);
      self.insertPoint(pos.x,pos.y);
      self.updateCurve();
   };

   this.insertPoint = function(x,y) {
      var index = null;
      for(var iPoint = 0; iPoint < this.points.length - 1; iPoint++){
         var pos = this.pointPos[iPoint];
         var nextPos = this.pointPos[iPoint + 1];
         if(pos.x < x && nextPos.x > x){
            index = iPoint + 1;
         }
      }
      if(index != null){
         var newID = "p_"+nameIndex;
         this.pointPos.splice(index,0,{x:x,y:y,id:newID});
         nameIndex++;
         var point = paper.rect(x - pointSize/2,y - pointSize/2,pointSize,pointSize).attr(attr.point);
         var dragOverlay = paper.rect(x - dragOverlaySize/2,y - dragOverlaySize/2,dragOverlaySize,dragOverlaySize).attr(attr.dragOverlay);
         this.points.splice(index,0,{ obj: paper.set(point,dragOverlay), id: newID });
         this.enableDragPoint(index);
      }
   };

   this.removePoint = function(name) {
      var id = this.getIndexFromName(name);
      this.points[id].obj.remove();
      this.points.splice(id,1);
      this.pointPos.splice(id,1);
   };

   this.getClosestCurvePointPos = function(x,y) {
      var minD = Infinity;
      var curvePos = null;
      for(var length = 0; length < this.curve[0].getTotalLength(); length++){
         var pos = this.curve[0].getPointAtLength(length);
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
      for(var length = 1; length < this.curve[0].getTotalLength(); length++){
         var pos = this.curve[0].getPointAtLength(length);
         var prevPos = this.curve[0].getPointAtLength(length - 1);
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

   this.getCurveData = function() {
      var xVsY= {};
      var minY = Infinity;
      var maxY = 0;
      for(var length = 0; length < this.curve[0].getTotalLength(); length++){
         var pos = this.curve[0].getPointAtLength(length);
         var y = Math.round(pos.y);
         var x = Math.round(pos.x);
         if(!xVsY[y]){
            xVsY[y] = [];
         }
         if(!xVsY[y].includes(x)){
            xVsY[y].push({ x: x, alpha: pos.alpha });
         }
         minY = Math.min(minY,pos.y);
         maxY = Math.max(maxY,pos.y);
      }
      return { xVsY: xVsY, minY: minY, maxY: maxY }
   };

   this.getIndexFromName = function(name) {
      for(var iPoint = 0; iPoint < this.pointPos.length; iPoint++){
         if(name == this.pointPos[iPoint].id){
            return iPoint
         }
      }
      return null
   };

   this.onStart = function(name) {
      return function(x,y,ev) {
         self.draggedID = name;
         var index = self.getIndexFromName(name);
         self.startPos = self.pointPos[index];
      }
   };
   this.onMove = function(dx,dy,x,y,ev) {
      var id = self.getIndexFromName(self.draggedID);
      var xMouse = x - $("#"+paperID).offset().left;
      var yMouse = y - $("#"+paperID).offset().top;

      var xMin = (id) ? self.pointPos[id - 1].x + dragOverlaySize/2 : x0;
      var xMax = (id < self.points.length - 1) ? self.pointPos[id + 1].x - dragOverlaySize/2 : x0 + w;
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
      }else if(id == self.points.length - 1){
         if(x0 + w - newX < newY - y0){
            newX = x0 + w;
         }else{
            newY = y0;
         }
      }

      self.pointPos[id] = {x:newX,y:newY,id:self.draggedID};
      self.points[id].obj[0].attr({
         x: newX - pointSize/2,
         y: newY - pointSize/2
      });
      self.points[id].obj[1].attr({
         x: newX - dragOverlaySize/2,
         y: newY - dragOverlaySize/2
      });
      self.updateCurve();
   };
   this.onEnd = function() {
      var id = self.getIndexFromName(self.draggedID);
      var xi = self.startPos.x;
      var yi = self.startPos.y;
      var xf = self.pointPos[id].x;
      var yf = self.pointPos[id].y;
      var d = Beav.Geometry.distance(xi,yi,xf,yf);
      if(d < 10){
         self.selectPoint(self.draggedID);
      }
      if(self.dragEndCallback){
         self.dragEndCallback();
      }
   };

   this.selectPoint = function(name) {
      var id = this.getIndexFromName(name);
      if(id == 0 || id == self.points.length - 1){
         return
      }
      if(Beav.Array.has(selectedPoints,name)){
         var index = Beav.Array.indexOf(selectedPoints,name);
         selectedPoints.splice(index,1);
         self.points[id].obj[0].attr(attr.point);
      }else{
         selectedPoints.push(name);
         self.points[id].obj[0].attr(attr.selectedPoint);
      }
   };

   this.addPoint = function(x,y,id) {
      this.pointPos.push({x:x,y:y,id:id});
   };

   this.updateCurve = function() {
      if(this.curve){
         this.curve.remove();
      }
      var path = "";
      var nbPoints = this.pointPos.length;
      for(var iPoint = 0; iPoint < nbPoints; iPoint++){
         var pos = this.pointPos[iPoint];
         var x1 = pos.x;
         var y1 = pos.y;

         if(iPoint < nbPoints - 1){ 
            var nextPos = this.pointPos[iPoint + 1];
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
            path += ",C"+xControl1+" "+yControl1+" "+xControl2+" "+yControl2+" "+x2+" "+y2;
         }
      }
      var curve = paper.path(path).attr(attr.curve);
      var clickArea = paper.path(path).attr(attr.clickArea);
      this.curve = paper.set(curve,clickArea);
      this.enableClickCurve();
      this.updatePoints();

      if(this.updateCurveCallback){
         this.updateCurveCallback();
      }
   };

   this.updatePoints = function() {
      for(var iPoint = 0; iPoint < this.points.length; iPoint++){
         this.points[iPoint].obj.toFront();
      }
   };

   this.drawPoints = function() {
      for(var iPoint = 0; iPoint < this.pointPos.length; iPoint++){
         var pos = this.pointPos[iPoint];
         var point = paper.rect(pos.x - pointSize/2,pos.y - pointSize/2,pointSize,pointSize).attr(attr.point);
         var dragOverlay = paper.rect(pos.x - dragOverlaySize/2,pos.y - dragOverlaySize/2,dragOverlaySize,dragOverlaySize).attr(attr.dragOverlay);
         this.points[iPoint] = { obj: paper.set(point,dragOverlay), id: pos.id };
      }
   };
   
   this.init();
};