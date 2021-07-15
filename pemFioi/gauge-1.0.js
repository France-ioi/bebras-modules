function Gauge(paper) {
   var self = this;
   this.gauges = {};
   this.gaugeInfo = {};

   this.addNew = function(settings){
      var attr = settings.attr;
      var cx = settings.cx;
      var cy = settings.cy;
      var r = settings.r;
      var id = settings.id;
      var redZoneAngle = settings.redZoneAngle;
      var currVal = settings.currVal;
      if(id == undefined){
         console.error("error: no id");
         return
      }
      if(this.gauges.hasOwnProperty(id)){
         console.error("gauge with id "+id+" already exists");  
         return 
      }

      var arc = paper.path(["M",cx - r,cy,"A",r,r,0,0,1,cx + r,cy]).attr(attr.arc);
      if(!isNaN(redZoneAngle)){
         var radAngle = redZoneAngle*Math.PI/180;
         var xRed = cx + r*Math.cos(radAngle);
         var yRed = cy - r*Math.sin(radAngle);
         var redArc = paper.path(["M",xRed,yRed,"A",r,r,0,0,1,cx + r,cy]).attr(attr.redZone);
      }else{
         var redArc = null;
      }

      var needleR = settings.needleR || r/10;
      var needleCircle = paper.circle(cy,cy,needleR).attr(attr.needle);
      var xTr1 = cx - r;
      var xTr2 = cx;
      var yTr1 = cy;
      var yTr2 = cy - needleR;
      var yTr3 = cy + needleR;
      var needleTriangle = paper.path(["M",xTr1,yTr1,"L",xTr2,yTr2,"V",yTr3,"Z"]).attr(attr.needle);
      var needle = paper.set(needleCircle,needleTriangle);

      this.gauges[id] = paper.set(arc,redArc,needle);
      this.gaugeInfo[id] = { min: settings.min, max: settings.max, currVal: settings.currVal, cx, cy };
      this.update(id,currVal);
   };

   this.remove = function(id) {
      if(this.gauges[id]){
         this.gauges[id].remove();
         delete this.gauges[id]
      }
      if(this.gaugeInfo[id]){
         delete this.gaugeInfo[id]
      }
   };

   this.update = function(id,newVal) {
      var min = this.gaugeInfo[id].min;
      var max = this.gaugeInfo[id].max;
      var cx = this.gaugeInfo[id].cx;
      var cy = this.gaugeInfo[id].cy;
      if(isNaN(min) || isNaN(max)){
         console.error("min or max values of gauge with id "+id+" is NaN");
      }
      newVal = Math.max(Math.min(newVal,max),min);
      var angle = 180*(newVal - min)/(max - min);
      if(!this.gauges[id]){
         console.error("Gauge with id "+id+" cannot be found");
      }
      var needle = this.gauges[id][2];
      needle.attr("transform",[]);
      needle.attr("transform",["r",angle,cx,cy]);
   };
};