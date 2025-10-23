function drawButton(paper,xc,yc,w,h,params) {
   var defaultAttr = {
      rect: {
         stroke: "none",
         fill: "#4a90e2",
         r: h/2
      },
      text: {
         "font-size": 14,
         "font-weight": "bold",
         fill: "white"
      },
      icon: {
         stroke: "none",
         fill: "white"
      }
   };
   var attr = params.attr || defaultAttr;

   paper.setStart();
   var xRect = xc - w/2;
   var yRect = yc - h/2;
   paper.rect(xRect,yRect,w,h).attr(attr.rect);
   
   if(params.text){
      var xText = params.xText || xc;
      var yText = params.yText || yc;
      paper.text(xText,yText,params.text).attr(attr.text);
   }

   if(params.shape) {
      var iconR = params.iconR;
      var xIcon = params.xIcon || xRect + iconR;
      var yIcon = params.yIcon || yc;
      var shape = params.shape;
      var icon = getShape(paper, shape,xIcon,yIcon,{ radius: iconR });
      icon.attr(attr.icon);
      if(params.iconAngle){
         icon.attr("transform",["R",params.iconAngle]);
      }
   }

   if(params.imgSrc) {
      var src = params.imgSrc;
      var xIcon = params.xIcon;
      var iconW = params.iconW;
      var iconH = params.iconH;
      var yIcon = params.yIcon || yc - iconH/2;
      var icon = paper.image(src,xIcon,yIcon,iconW,iconW);
   }

   return paper.setFinish()
};