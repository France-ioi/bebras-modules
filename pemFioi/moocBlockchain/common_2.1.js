var taskStrings = {
   success: "Bravo, vous avez formé la chaîne la plus longue possible !",
   remainingBlocks: "BLOCS RESTANTS",
   chainBlocks: "BLOCS DE LA CHAÎNE",
   validate: "VALIDER",
   hash: "HASH",
   prev: "PREV",
   errorNoChain: "Votre réponse ne contient pas de chaîne.",
   errorMultipleChains: "Votre réponse contient plusieurs morceaux de chaîne non reliés entre eux.",
   errorTooShort: "Votre chaîne est valide mais n’est pas la plus longue possible.",
   errorNoGenesis: "Votre chaîne ne commence pas par le block genesis (prev = 000...000).",
   errorLateralChain: "Plusieurs blocs de votre réponse sont reliés au même bloc, vous devez choisir une unique chaîne."
};

var paperHeight = 660;
var marginX = 10;
var marginY = 10;
var headerH = 60;
var leftSideH = paperHeight - 8*marginY;
var leftTabW = 35;
var leftTabH = 70;
var validateButtonW = 200;
var validateButtonH = 50;
var blockW = 170;
var blockH = 50;

var attractionRadius = 20;
var nbBlocks;
// var timeOut;


var leftSideAttr = {
   stroke: "none",
   fill: colors.lightGrey
};
var shadowAttr = {
   stroke: "none",
   fill: colors.shadowGrey
};
var titleAttr = {
   "font-size": 20,
   "font-weight": "bold",
   fill: colors.darkGrey
};
var lineAttr = {
   stroke: "none",
   fill: colors.shadowGrey,
   opacity: 0.5
};
var tabArrowAttr = {
   stroke: colors.darkGrey,
   "stroke-width": 3,
   "stroke-linecap": "round",
   "stroke-linejoin": "round"
};
var validateButtonAttr = {
   rect: {
      stroke: "none",
      fill: colors.orange
   },
   text: {
      "font-size": 16,
      "font-weight": "bold",
      fill: "white"
   }
};
var blockAttr = {
   unselected: {
      rect: {
         stroke: colors.unselectedRectGrey,
         "stroke-linejoin": "round",
         fill: colors.unselectedRectGrey
      },
      shadow: {
         stroke: colors.grey,
         "stroke-linejoin": "round",
         fill: colors.grey
      },
      circle: {
         stroke: "none",
         fill: colors.grey,
         r: 2,
         opacity: 0.5
      },
      text: {
         "font-size": 12,
         "font-weight": "bold",
         "text-anchor": "start",
         fill: colors.darkGrey
      },
      line: {
         stroke: colors.darkGrey
      }
   },
   selected: {
      rect: {
         stroke: colors.blue,
         "stroke-linejoin": "round",
         fill: colors.blue
      },
      shadow: {
         stroke: colors.shadowBlue,
         "stroke-linejoin": "round",
         fill: colors.shadowBlue
      },
      circle: {
         stroke: "none",
         fill: colors.shadowBlue,
         r: 2,
         opacity: 1
      },
      text: {
         "font-size": 12,
         "font-weight": "bold",
         "text-anchor": "start",
         fill: colors.darkBlue
      },
      line: {
         stroke: colors.darkBlue
      }
   }
};
var arrowAttr = {
   stroke: colors.orange,
   "stroke-width": 3,
   "arrow-end": "block-wide-midium"
};

function addCross(paper,id,answer) {
   var pos = answer.blockPos[id];
   var x = pos.x + blockW/2;
   var y = pos.y + blockH + 10;
   return drawCross(paper,x,y);
};

function drawArrow(paper,pos,lateral) {
   var r = 20;
   var x1 = pos.x + 10;
   var y2 = pos.y + blockH + 2 + r;
   if(lateral){
      var y1 = pos.y + blockH;
      var x2 = x1 - 20;
      var arrow = paper.path("M"+x1+" "+y1+",A "+r+" "+r+" 0 0 1 "+x2+" "+y2).attr(arrowAttr);
   }else{
      var y1 = pos.y + blockH + 2 - r;
      var x2 = x1;
      var arrow = paper.path("M"+x1+" "+y1+",A "+r+" "+r+" 0 1 0 "+x2+" "+y2).attr(arrowAttr);
   }
   return arrow;
};

function drawBlock(paper,id,answer,arrowRaph) {
   var pos = answer.blockPos[id];
   var x = pos.x;
   var y = pos.y;
   var data = answer.blockData[id];
   var notchW = 18;
   var notchH = 7;
   var notchX = 10;
   var attr = (answer.chain[id] != null || answer.chain.includes(id) || (answer.lateralChain && answer.lateralChain[id] != null)) ? blockAttr.selected : blockAttr.unselected;

   paper.setStart();
   var shadowPath = getBlockPath(x,y + 2, notchW,notchH,notchX);
   var path = getBlockPath(x,y,notchW,notchH,notchX);
   paper.path(shadowPath).attr(attr.shadow);
   paper.path(path).attr(attr.rect);
   
   var xCircle = x + notchX + notchW/2;
   for(var iCircle = 0; iCircle < 3; iCircle++){
      var yCircle = y + blockH/2 - 8 + iCircle*8;
      paper.circle(xCircle,yCircle).attr(attr.circle);
   }

   var xLabel = x + notchX + notchW + marginX;
   var xHash = xLabel + 50;
   var yLine = y + blockH/2;
   var yLabel1 = yLine - 12;
   var yLabel2 = yLine + 12;
   paper.text(xLabel,yLabel1,taskStrings.hash).attr(attr.text);
   paper.text(xLabel,yLabel2,taskStrings.prev).attr(attr.text);
   paper.text(xHash,yLabel1,data.hash).attr(attr.text);
   paper.text(xHash,yLabel2,data.prev).attr(attr.text);
   paper.path("M"+xLabel+" "+yLine+",H"+(x + blockW - marginX)).attr(attr.line);

   if(arrowRaph[id]){
      arrowRaph[id].toFront();
   }

   return paper.setFinish();
};

function getBlockPath(x,y,notchW,notchH,notchX) {
   var x1 = x;
   var y1 = y;
   var x2 = x + notchX;
   var y3 = y + notchH;
   var x4 = x2 + notchW;
   var x5 = x1 + blockW;
   var y6 = y1 + blockH;
   var x7 = x4 - 3;
   var y8 = y6 + notchH;
   var x9 = x2 + 3;
   var path = "M"+x1+" "+y1+",H"+x2+",V"+y3+",H"+x4+",V"+y1+",H"+x5+",V"+y6+",H"+x7+",V"+y8+",H"+x9+",V"+y6+",H"+x1+"Z";
   return path;
};

function applyStyle(block,selected) {
   var attr = (selected) ? blockAttr.selected : blockAttr.unselected;
   block[0].attr(attr.shadow);
   block[1].attr(attr.rect);
   for(var iCircle = 0; iCircle < 3; iCircle++){
      block[2 + iCircle].attr(attr.circle);
   }
   for(var iText = 0; iText < 4; iText++){
      block[5 + iText].attr(attr.text);
   }
   block[9].attr(attr.line);
};

function getRightSideBlocks(answer,nbBlocks) {
   var windowW = $("#resolution").width();
   var xRight = windowW*0.53;
   var rightSideBlocks = []
   for(var iBlock = 0; iBlock < nbBlocks; iBlock++){
      var pos = answer.blockPos[iBlock];
      if(pos.x >= xRight){
         rightSideBlocks.push(iBlock);
      }
   }
   return rightSideBlocks;
};

function checkSnap(id,answer,side) {
   var pos = answer.blockPos[id];
   var prev = answer.blockData[id].prev;
   var hash = answer.blockData[id].hash;
   for(var iBlock = 0; iBlock < nbBlocks; iBlock++){
      if(iBlock != id){
         var otherPos = answer.blockPos[iBlock];
         switch(side){
            case "bottom":
               var d = Beav.Geometry.distance(pos.x,pos.y + blockH,otherPos.x,otherPos.y);
               break;
            case "top":
               var d = Beav.Geometry.distance(pos.x,pos.y,otherPos.x,otherPos.y + blockH);
               break;
            case "left":
               var d = Beav.Geometry.distance(pos.x - blockW,pos.y + blockH,otherPos.x,otherPos.y);
               break;
            case "right":
               var d = Beav.Geometry.distance(pos.x + blockW,pos.y + blockH,otherPos.x,otherPos.y);
               break;
         }
         if(d < attractionRadius){
            var otherPrev = answer.blockData[iBlock].prev;
            var otherHash = answer.blockData[iBlock].hash;
            if((side == "bottom" && prev == otherHash) || 
               (side == "top" && otherPrev == hash) || 
               ((side == "left" || side == "right") && prev == otherHash && answer.chain.includes(iBlock))){
               return { id: iBlock, chain: true };
            }else{
               return { id: iBlock, chain: false };
            }
         }
      }
   }
   return false;
};

function displayError(paper,msg) {
   if(errorTriangle){
      errorTriangle.remove();
   }
   if(msg){
      $("#error").show();
      $("#error").html("<i class=\"fas fa-times-circle\"></i>"+msg);
      var windowW = $("#resolution").width();
      $("#error").css({
         top: paperHeight - 4*marginY - validateButtonH,
         right: 0.22*windowW + validateButtonW/2 + 2*marginX
      });
      var rTr = 10;
      var xTr = 0.78*windowW - validateButtonW/2 - 2*marginX + rTr/2;
      var yTr = paperHeight - 4*marginY - validateButtonH/2;
      errorTriangle = getShape(paper,"triangle",xTr,yTr,rTr).attr(errorTriangleAttr);
      errorTriangle.rotate(90);
   }else{
      $("#error").hide();
   }
};