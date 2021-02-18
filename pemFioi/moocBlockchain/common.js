var crossSize = 28;

var timeOut;
var errorTriangle;

var colors = {
   black: "#30242B",
   darkGrey: "#666666",
   grey: "#848484",
   lightGrey: "#f7f8fb",
   shadowGrey: "#dddee1",
   unselectedRectGrey: "#cecece",
   orange: "#e05d13",
   blue: "#bedbdb",
   darkBlue: "#424c4c",
   shadowBlue: "#a1baba",
   red: "#fb0048",
   yellow: "#ffb90e",
   green: "#085b5c"
};
var selectedTabCss = {
   "background-color": "white",
   "border-top": "3px solid "+colors.orange
};
var unselectedTabCss = {
   "background-color": colors.grey,
   "border-top": "3px solid "+colors.grey
};
var crossAttr = {
   circle: {
      stroke: colors.red,
      "stroke-width":4,
      fill: "white"
   },
   cross: {
      stroke: colors.red,
      "stroke-width": 4
   }
};
var errorTriangleAttr = {
   stroke: "none",
   fill: colors.red
};

function updateTabs(currentTab) {
   var selectedTab = (currentTab) ? 2 : 1;
   var unselectedTab = (currentTab) ? 1 : 2;
   $("#tab_"+selectedTab).css(selectedTabCss);
   $("#tab_"+selectedTab+" i").css({color:colors.orange});
   $("#tab_"+unselectedTab).css(unselectedTabCss);
   $("#tab_"+unselectedTab+" i").css({color:colors.darkGrey});
   if(currentTab){
      $("#instructions").hide();
      $("#resolution").show();
   }else{
      $("#instructions").show();
      $("#resolution").hide();
   }
};

function drawCross(paper,x,y,simpleCross) {
   var attr = crossAttr;
   var r = crossSize/2;
   var x1 = x - r*0.4;
   var y1 = y - r*0.4;
   var x2 = x + r*0.4;
   var y2 = y + r*0.4;
   var cross = paper.path("M"+x1+" "+y1+",L"+x2+" "+y2+",M"+x1+" "+y2+",L"+x2+" "+y1).attr(attr.cross);
   if(!simpleCross){
      var circle = paper.circle(x,y,r).attr(attr.circle);
      return paper.set(circle,cross);
   }else{
      return cross;
   }
};

function generateHash(rng,hashLength) {
   var hash = "";
   do{
      var nextType = rng.nextBit();
      if(nextType){
         var nextChar = String.fromCharCode(rng.nextInt(65,90));
      }else{
         var nextChar = rng.nextInt(0,9);
      }
      hash += nextChar;
   }while(hash.length < hashLength);
   return hash;
};