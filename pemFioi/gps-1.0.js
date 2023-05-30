function GPS(settings) {
   self = this;
   let { paper, paperID, attr, x0, y0, w, h, scale, unit, fixed, create, hideTowerLabel, continuity } = settings;
   let respScale;

   this.timeShiftEnabled = settings.timeShiftEnabled;
   this.timeShift = 0;
   var firstTowersPos = settings.towerPos;
   var towerR = settings.towerR;
   var towerH = settings.towerH;
   var towerW = settings.towerW;
   var callback = settings.callback;
   var addTowerCallback = settings.addTowerCallback;
   var dragEndCallback = settings.dragEndCallback;
   var dragMargin = 10;
   var minR = towerR + dragMargin;

   this.landscape;
   this.overlay;
   this.towers = {};
   this.towerID = [];
   this.distInfo = {};
   var draggedData;

   this.setTimeShift = function(val) {
      this.timeShift = val;
      this.updateShiftCircles();
   };

   this.init = function() {
      paper.rect(x0,y0,w,h).attr(attr.frame);
      if(firstTowersPos){
         for(var pos of firstTowersPos){
            this.addTower(pos);
         }
      }
      this.overlay = paper.rect(x0,y0,w,h).attr(attr.overlay);

      this.initHandlers();
   };

   this.initHandlers = function() {
      Beav.dragWithTouch(this.overlay, onMove, onStart, onEnd);
      this.overlay.mousemove(self.mousemove);
   };

   this.addTower = function(pos) {
      if(pos.id && this.towerID.includes(pos.id)){
         console.log(pos.id+" already exists")
         return
      }
      var x = x0 + pos.x;
      var y = y0 + pos.y;
      var circle = paper.circle(x,y,towerR).attr(attr.tower);
      if(!pos.id){
         var id = 1;
         while(this.towerID.includes(id)){
            id++;
         };
         pos.id = id;
      }
      var label = paper.text(x,y,pos.id).attr(attr.towerLabel);
      if(hideTowerLabel){
         label.hide();
      }
      var circleR = pos.r || minR;
      var outCircle = paper.circle(x,y,circleR).attr(attr.circle).attr("clip-rect",x0+","+y0+","+w+","+h);
      if(this.timeShiftEnabled){
         var shiftedCircle = paper.circle(x,y,circleR + this.timeShift).attr(attr.shiftedCircle).attr("clip-rect",x0+","+y0+","+w+","+h);
         var raphObj = paper.set(circle,label,outCircle,shiftedCircle);
      }else{
         var raphObj = paper.set(circle,label,outCircle);
      }
      var maxR = Math.max(Math.abs(pos.x),Math.abs(pos.x - w),Math.abs(pos.y),Math.abs(pos.y - h));
      this.towers[pos.id] = { x: pos.x, y: pos.y, raphObj: raphObj, r: circleR, maxR: maxR };
      if(continuity){
         var set = paper.set();
         for(var dir = 0; dir < 2; dir++){
            if(continuity[dir]){
               for(var side = 0; side < 2; side++){
                  if(dir == 0){
                     var yCirc = pos.y;
                     var xCirc = (side == 0) ? x0 - (w - pos.x) : x0 + w + pos.x;
                  }else{
                     var xCirc = pos.x;
                     var yCirc = (side == 0) ? y0 - (h - pos.y) : y0 + h + pos.y;
                  }
                  var circ = paper.circle(xCirc,yCirc,circleR).attr(attr.circle).attr("clip-rect",x0+","+y0+","+w+","+h);
                  set.push(circ);
               }
            }
         }
         this.towers[pos.id].continuityCircles = set;
      }
      this.towerID.push(pos.id);
      this.updateDistInfo(pos.id);
      if(this.overlay){
         this.overlay.toFront();
      }
      if(addTowerCallback){
         addTowerCallback();
      }
      return pos.id;
   };

   this.mousemove = function(ev) {
      if (window.displayHelper) {
         respScale = window.displayHelper.scaleFactor || 1;
      }else{
         respScale = 1;
      }
      var xMouse = (ev.pageX - $("#"+paperID).offset().left - x0*respScale);
      var yMouse = (ev.pageY - $("#"+paperID).offset().top - y0*respScale);
      // console.log(xMouse,yMouse)
      var cursor = "auto";
      for(var id of self.towerID){
         var r = self.towers[id].r*respScale;
         var x = self.towers[id].x*respScale;
         var y = self.towers[id].y*respScale;
         var d = Beav.Geometry.distance(x,y,xMouse,yMouse);
         if(d > r - 10 && d < r + 10){
            cursor = "grab";
            break;
         }
      }
      self.overlay.attr("cursor",cursor);
   };

   var onStart = function(x,y,ev) {
      var xMouseGps = (x - $("#"+paperID).offset().left - x0*respScale)/respScale;
      var yMouseGps = (y - $("#"+paperID).offset().top - y0*respScale)/respScale;
      var minDist = Infinity;
      draggedData = null;
      // console.log(xMouseGps,yMouseGps)
      for(var id of self.towerID){
         var towerData = self.towers[id];
         var distFromCenter = Beav.Geometry.distance(xMouseGps,yMouseGps,towerData.x,towerData.y);
         // console.log(id,distFromCenter)
         if(!fixed && distFromCenter <= towerR){
            /* drag center */
            minDist = 0;
            draggedData = { id: id, type: 0};
            break;
         }
         var distFromCircle = Math.abs(distFromCenter - towerData.r);
         if(distFromCircle < minDist){
            minDist = distFromCircle;
            draggedData = { id: id, type: 1, r0: distFromCenter, ri: towerData.r };
         }
      }
      if(minDist > dragMargin){
         draggedData = (!create) ? null : { x: xMouseGps, y: yMouseGps, create: true };
         if(draggedData){
            // console.log(draggedData)
         }
      }
      if(callback){
         callback(draggedData);
      }
   };
   var onMove = function(dx,dy,x,y,ev) {
      if(!draggedData){
         return
      }
      var xMouseGps = (x - $("#"+paperID).offset().left - x0*respScale)/respScale;
      var yMouseGps = (y - $("#"+paperID).offset().top - y0*respScale)/respScale;
      if(draggedData.create){
         if(Beav.Geometry.distance(xMouseGps,yMouseGps,draggedData.x,draggedData.y) < minR){
            return
         }
         var id = self.addTower(draggedData);
         draggedData = {
            id: id,
            type: 1,
            r0: minR,
            ri: minR
         }
      }else{
         var id = draggedData.id;
      }
      var ri = draggedData.ri;
      var towerData = self.towers[id];

      if(draggedData.type == 1){
         /* drag circle */
         var r0 = draggedData.r0;
         var dR = Beav.Geometry.distance(xMouseGps,yMouseGps,towerData.x,towerData.y) - r0;
         var maxR = Math.max(Math.abs(towerData.x),Math.abs(towerData.x - w),Math.abs(towerData.y),Math.abs(towerData.y - h));
         var newR = Math.min(maxR,Math.max(minR,ri + dR));
         self.towers[id].raphObj[2].attr("r",newR);
         if(continuity){
            self.towers[id].continuityCircles.attr("r",newR);
            // console.log(newR)
         }
         towerData.r = newR;
         self.updateDistInfo(id);
      }else{
         /* drag center */
         var newX = towerData.x + dx + x0;
         var newY = towerData.y + dy + y0;
         self.towers[id].raphObj.attr({ x: newX, y: newY, cx: newX, cy: newY });
         self.distInfo[id].line.transform("t"+dx+" "+dy);
         self.distInfo[id].val.transform("t"+dx+" "+dy);
      }
      if(self.timeShiftEnabled){
         self.updateShiftCircle(id);
      }
   };
   var onEnd = function(ev) {
      if(!draggedData){
         return
      }
      if(draggedData.type == 0){
         var id = draggedData.id;
         var towerData = self.towers[id];
         var x = self.towers[id].raphObj[0].attr("cx");
         var y = self.towers[id].raphObj[0].attr("cy");
         if(x < x0 || x > x0 + w || y < y0 || y > y0 + h){
            self.deleteTower(id);
            return
         }
         towerData.x = x - x0;
         towerData.y = y - y0;
         var maxR = Math.max(Math.abs(towerData.x),Math.abs(towerData.x - w),Math.abs(towerData.y),Math.abs(towerData.y - h));
         towerData.maxR = maxR;
         self.distInfo[id].line.remove();
         self.distInfo[id].val.remove();
         self.distInfo[id] = null;
         self.updateDistInfo(id);
      }
      if(dragEndCallback){
         dragEndCallback();
      }
   };

   this.deleteTower = function(id) {
      this.towers[id].raphObj.remove();
      delete this.towers[id];
      this.distInfo[id].line.remove();
      this.distInfo[id].val.remove();
      delete this.distInfo[id];
      var index = this.towerID.indexOf(id);
      this.towerID.splice(index,1);
   };

   this.updateDistInfo = function(id) {
      if(this.distInfo[id]){
         this.distInfo[id].line.remove();
      }
      var data = this.towers[id];
      var cx = data.x;
      var cy = data.y;
      var r = data.r;
      var side = (cx > w/2) ? 0 : 1;

      var x1 = (side) ? x0 + cx + towerR : x0 + cx - towerR;
      var x2 = (side) ? x0 + cx + data.r : x0 + cx - data.r;
      var line = paper.path("M"+x1+" "+(cy + y0)+",H"+x2).attr(attr.distLine);

      var xVal = (x2 + x1)/2;
      var yVal = y0 + cy - 15;
      if(r < minR + 20){
         yVal -= 20;
      }
      var valText = Math.round(data.r*scale)+" "+unit;
      if(this.distInfo[id]){
         this.distInfo[id].line = line;   
         this.distInfo[id].val.attr({
            text: valText,
            x: xVal,
            y: yVal
         });   
      }else{
         var val = paper.text(xVal,yVal,valText).attr(attr.distVal);
         this.distInfo[id] = { line: line, val: val };
      }
   };

   this.updateShiftCircles = function() {
      for(var id of this.towerID){
         this.updateShiftCircle(id);
      }
   };

   this.updateShiftCircle = function(id) {
      var data = this.towers[id];
      if(data.raphObj[3]){
         data.raphObj[3].attr("r", Math.max(towerR,data.r + this.timeShift));
      }
   };
   
   this.init();
};