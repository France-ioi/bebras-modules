/*blocklyRoboy_lib-1.0.0 by Arthur Léonard*/

var robotCommands = [];
// var imgPath = modulesPath+"img/algorea/";

var colors = {
   green: "#88BB88",
   darkGreen: "#508855",
   black: "#30242B",
   yellow: "#f5a623",
   darkYellow: "#cd8713",
   grey: "#eaeaea",
   darkGrey: "#a6a6a6",
   // beige: "#f4daa3",
   blue: "#4a90e2",
   darkBlue: "#1d6bc7",
   purple: "purple",
   pink: "pink",
   red: "#fe5c5c"
};

var overlayAttr = {
   stroke: "none",
   fill: "red",
   opacity: 0
};

var initArray = function(n, elem) {
   var res = [];
   for(var i = 0;i < n;i++) {
      res.push(elem);
   }
   return res;
}

var getContext = function(display, infos, curLevel) {
   var localLanguageStrings = {
      fr: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      en: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      es: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      it: {
         label: {},
         code: {},
         messages: {},
         description: {}
      },
      de: {
        label: {},
        code: {},
        messages: {},
        description: {}
      }
   };
   
   var contextStrings = {
      none: {
         fr: {
            // label: {
            //    getNbItems: "nombre de points",
            //    getNbClusters: "nombre de clusters",
            //    getX: "coordonnée x du point %1",
            //    getY: "coordonnée y du point %1",
            //    log: "log %1"
            // },
            code: {
               // getNbItems: "getNbItems",
               // getNbClusters: "getNbClusters",
               // getX: "getX",
               // getY: "getY",
               // log: "log",
               // distance: "distance",
               // showCentroid: "showCentroid",
               // showDistance: "showDistance",
               // setCluster: "setCluster"
            },
            // description: {
            //    getX: "@(idItem) retourne l'abscisse du point",
            //    getY: "@(idItem) retourne l'ordonnée du point",
            //    log: "@(msg)",
            //    distance: "@(x1,y1,x2,y2)",
            //    showCentroid: "@(idCluster,x,y)",
            //    showDistance: "@(idItem,idCluster)",
            //    setCluster: "@(idItem,idCluster)"
            // },
            messages: {
               success: "Bravo, vous avez réussi !"
            },
            // startingBlockName: "Programme du robot"
         },
         en: {
            label: {
               
               
            },
            code: {
               
            },
            messages: {
               
            },
            // startingBlockName: "Program of the robot"
         },
         
         es: {
            label: {
            },
            code: {
            },
            messages: {
            },
            // startingBlockName: "Programa del robot"
         },
         de: {
            label: {
            },
            code: {
            },
            messages: {
            },
            // startingBlockName: "Roboter-Programm"
         },
         it: {
            label: {
            },
            code: {
            },
            messages: {
            },
            // startingBlockName: "Programme du robot"
         },
      },
      "k-means": {
         fr: {
            label: {

            },
            code: {
               getNbItems: "getNbItems",
               getNbClusters: "getNbClusters",
               getX: "getX",
               getY: "getY",
               log: "log",
               distance: "distance",
               showCentroid: "showCentroid",
               showDistance: "showDistance",
               setCluster: "setCluster"
            },
            description: {
               getX: "@(idItem) retourne l'abscisse du point",
               getY: "@(idItem) retourne l'ordonnée du point",
               log: "@(msg)",
               distance: "@(x1,y1,x2,y2)",
               showCentroid: "@(idCluster,x,y)",
               showDistance: "@(idItem,idCluster)",
               setCluster: "@(idItem,idCluster)"
            },
            messages: {
               maxNbCentroids: function(max) {
                  return "Vous ne pouvez pas placer plus de "+max+" centroïdes"
               },
               noIntegerId: "L'identifiant doit être un entier",
               noConsecutiveId: function(id,prev) {
                  return "Vous devez placer l'id "+prev+" avant l'id "+id
               },
               outOfRange: function(name,min,max) {
                  return "La valeur de "+name+" doit être comprise entre "+min+" et "+max
               },
               invalidId: "Identifiant invalide",
               failureNbCentroids: "Le nombre de centroïdes est incorrect",
               failureMissingItem: "Un des points n'a pas de classe",
               failureScore: "La position des centroïdes n'est pas optimisée",
            }
         },

         en: {
            label: {

            },
            code: {

            },
            messages: {
            }
         },

         es: {
            label: {
              
            },
            code: {
               
            },
            messages: {
            } 
         }
      },
   };
   
   var iconSrc = $("img[src$='icon.png']").attr("src");
   var imgPrefix = iconSrc.substring(0, iconSrc.length - 8);
   function imgUrlWithPrefix(url) {
      return /^https?:\/\//.exec(url) ? url : imgPrefix + url;
   };
   function getImgPath(url) {
      if(modulesPath != undefined){
         return modulesPath+"img/algorea/"+url
      }
      return imgUrlWithPrefix(url)
   };
   
   if(infos.newBlocks == undefined)
      infos.newBlocks = [];
   if(infos.maxFallAltitude == undefined)
      infos.maxFallAltitude = 2;
   
   var loadContext = function(name) {
      for(var language in contextStrings[name]) {
         var ctx = contextStrings[name][language];
         for(var type in ctx) {
            if((typeof ctx[type]) === "string") {
               localLanguageStrings[language][type] = ctx[type];
            }
            else {
               if(localLanguageStrings[language][type] == undefined)
                  localLanguageStrings[language][type] = {};
               for(var line in ctx[type]) {
                  localLanguageStrings[language][type][line] = ctx[type][line];
               }
            }
         }
      }
      
      for(var param in contextParams[name]) {
         if(infos[param] === undefined || param == "newBlocks") {
            infos[param] = contextParams[name][param];
         }
      }
   };
   
   loadContext("none");
   if(infos.contextType != undefined) {
      loadContext(infos.contextType);
   }
   
   infos.newBlocks.push({
      name: "getNbItems",
      type: "sensors",
      block: { name: "getNbItems", yieldsValue: 'int' },
      func: function(callback) {
         // console.log(context.nbPoints)
         this.callCallback(callback, context.nbPoints);
      }
   });

   infos.newBlocks.push({
      name: "getNbClusters",
      type: "sensors",
      block: { name: "getNbItems", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, context.nbClusters);
      }
   });

   infos.newBlocks.push({
      name: "getX",
      type: "sensors",
      block: { 
         name: "getX", 
         params: [null],
         yieldsValue: 'int'
      },
      func: function(id, callback) {
         var { pointData } = context;
         var pos = pointData[id];
         if(!pos) {
            this.callCallback(callback, false);
            return
         }
         var x = getPosFromCoordinate(pos.x,0);
         highlightPoint(id);
         highlightCoordinate(id,0);
         this.callCallback(callback, Math.round(x));
      }
   });

   infos.newBlocks.push({
      name: "getY",
      type: "sensors",
      block: { 
         name: "getY", 
         params: [null],
         yieldsValue: 'int'
      },
      func: function(id, callback) {
         var { pointData } = context;
         var pos = pointData[id]
         if(!pos) {
            this.callCallback(callback, false);
            return
         }
         var y = getPosFromCoordinate(pos.y,1);
         highlightPoint(id);
         highlightCoordinate(id,1);
         this.callCallback(callback, Math.round(y));
      }
   });

   infos.newBlocks.push({
      name: "showCentroid",
      type: "actions",
      block: { 
         name: "showCentroid", 
         params: [null,null,null],
         // yieldsValue: 'int'
      },
      func: function(id,x,y, callback) {
         // console.log(id,x,y)
         var { k, nbClusters } = context;
         if(!Number.isInteger(id)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(id > k){
            throw(window.languageStrings.messages.noConsecutiveId(id,id - 1));
         }
         if(id >= nbClusters){
            throw(window.languageStrings.messages.maxNbCentroids(nbClusters));
         }
         var { xRange, yRange } = infos;
         if(x < xRange[0] || x > xRange[1]){
            throw(window.languageStrings.messages.outOfRange("x",xRange[0],xRange[1]));
         }
         if(y < yRange[0] || y > yRange[1]){
            throw(window.languageStrings.messages.outOfRange("y",yRange[0],yRange[1]));
         }
         context.centroidPos[id] = {x,y};
         context.k = context.centroidPos.length;
         initCentroids();
         updateCanvas();

         this.callCallback(callback);
      }
   });

   infos.newBlocks.push({
      name: "showDistance",
      type: "actions",
      block: { 
         name: "showDistance", 
         params: [null,null],
      },
      func: function(idItem,idCluster,callback) {
         var { k, nbPoints } = context;
         if(!Number.isInteger(idItem) || !Number.isInteger(idCluster)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(idItem >= nbPoints || idItem < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         if(idCluster >= k || idCluster < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         showDist(idItem,idCluster);

         this.callCallback(callback);
      }
   });

   infos.newBlocks.push({
      name: "setCluster",
      type: "actions",
      block: { 
         name: "setCluster", 
         params: [null,null],
         // yieldsValue: 'int'
      },
      func: function(idItem,idCluster,callback) {
         var { k, nbPoints } = context;
         if(!Number.isInteger(idItem) || !Number.isInteger(idCluster)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(idItem >= nbPoints || idItem < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         if(idCluster >= k || idCluster < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         context.classPoints[idItem] = idCluster + 1;
         updatePoint(idItem);

         this.callCallback(callback);
      }
   });

   infos.newBlocks.push({
      name: "distance",
      type: "actions",
      block: { 
         name: "distance", 
         params: [null,null,null,null],
         yieldsValue: 'int'
      },
      func: function(x1,y1,x2,y2, callback) {
         var d = Beav.Geometry.distance(x1,y1,x2,y2);
         this.callCallback(callback, Math.round(d));
      }
   });

   infos.newBlocks.push({
      name: "log",
      type: "actions",
      block: { 
         name: "log", 
         params: [null]
      },
      func: function(value, callback) {
         console.log("log",value);
         this.callCallback(callback);
      }
   });
   
   var context = quickAlgoContext(display, infos);
   context.robot = {};
   context.customBlocks = {
      robot: {
         actions: [],
         sensors: []
      }
   };
   
   for(var command in infos.newBlocks) {
      cmd = infos.newBlocks[command];
      context.customBlocks.robot[cmd.type].push(cmd.block);
      if(cmd.strings) {
         for(var language in cmd.strings) {
            for(var type in cmd.strings[language]) {
               localLanguageStrings[language][type][cmd.name] = cmd.strings[language][type];
            }
         }
      }
      if(cmd.func) {
         context.robot[cmd.name] = cmd.func.bind(context);
      }
   }
   
   var strings = context.setLocalLanguageStrings(localLanguageStrings);
   
   if(infos.languageStrings != undefined) {
      context.importLanguageStrings(infos.languageStrings.blocklyRobot_lib, strings);
   }
   
   var scale = 1;
   var paper;
   var canvas;
   var frame; // dev
   var centroids = [];
   var points = [];
   var pointHighlight;
   var coordinateHighlight;
   var centroidHighlight;
   var distanceObj;

   var rng = new RandomGenerator(0);
   
   initVisualParameters();

   function initVisualParameters() {
      // console.log("initVisualParameters")
      if(infos.marginX === undefined) {
         infos.marginX = 20;
      }
      if(infos.marginY === undefined) {
         infos.marginY = 20;
      }
      if(infos.paperW === undefined) {
         infos.paperW = 770;
      }
      if(infos.paperH === undefined) {
         infos.paperH = infos.paperW;
      }

      var { paperW, paperH, marginX, marginY } = infos;
      var x = marginX;
      var y = marginY;
      var w = paperW - 2*marginX;
      var h = paperH - 2*marginY;
      infos.xPointArea = x;
      infos.yPointArea = y;
      infos.pointAreaW = w;
      infos.pointAreaH = h;
   };

   var innerState = {};

   switch(infos.blocklyColourTheme) {
      case "bwinf":
         context.provideBlocklyColours = function() {
            return {
               categories: {
                  logic: 100,
                  loops: 180,
                  math: 220,
                  text: 250,
                  lists: 60,
                  colour: 310,
                  variables: 340,
                  functions: 20,
                  actions: 260,
                  sensors : 340,
                  _default: 280
               },
               blocks: {}
            };
         }
         break;
      default:
   }
   
   context.reset = function(gridInfos) {
      // console.log("reset",scale);
      // console.log(gridInfos,infos);

      if(gridInfos) {
         context.nbPoints = gridInfos.nbPoints;
         context.nbClusters = gridInfos.nbClusters;
      }
      context.centroidPos  = [];
      context.k = 0;
      context.classPoints = [];
      context.allowInfiniteLoop = true;

      if(!context.pointData){
         context.pointData = initPointData();
         // context.bestScore = findBestScore();
         // console.log(context.bestScore)
      }

      
      if(context.display) {
         this.delayFactory.destroyAll();
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         paper = this.raphaelFactory.create("paperMain", "grid", infos.paperW, infos.paperH);
         context.updateScale();
      }
      
   };

   context.updateScale = function() {
      // console.log("updateScale")
      if(!context.display) {
         return;
      }
      if(paper == null) {
         return;
      }
      
      if(window.quickAlgoResponsive) {
         var areaWidth = Math.max(200, $('.gridArea').width());
         $(".gridArea").css({
            display: "flex",
            "flex-direction": "column",
            "align-items": "center"
         });
         $('#grid').css("width","auto");
      } else {
         var areaWidth = 400;
         var areaHeight = 600;
      }
      var { paperW, paperH } = infos;
      // var paperRatio = paperW/paperH;
      scale = areaWidth/paperW;

      // console.log("updateScale",scale,areaWidth,areaHeight)
      var paperWidth = paperW * scale;
      var paperHeight = paperH * scale;
      paper.setSize(paperWidth, paperHeight);

      initCentroids();
      initPoints();
      
      initCanvas();
      updateCanvas();
      updatePoints();

   };

   context.redrawDisplay = function() {
      console.log("redrawDisplay")
      if(context.display) {
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
         // resetBoard();
         redisplayAllItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);
      }
   }

   context.getInnerState = function() {
      console.log("getInnerState")
      var removeItemElement = function (item) {
         var modifiedItem = Object.assign({}, item);
         delete modifiedItem.element;
         return modifiedItem;
      };
      innerState.items = context.items.map(removeItemElement);
      innerState.multicell_items = context.multicell_items.map(removeItemElement);
      innerState.last_connect = context.last_connect;
      innerState.wires = context.wires.map(removeItemElement);
      innerState.nbMoves = context.nbMoves;
      innerState.time = context.time;
      innerState.bag = context.bag.map(removeItemElement);

      return innerState;
   };

   context.implementsInnerState = function () {
      return true;
   }

   context.reloadInnerState = function(data) {
      innerState = data;
      context.items = data.items;
      context.multicell_items = data.multicell_items;
      context.last_connect = data.last_connect;
      context.wires = data.wires;
      context.nbMoves = data.nbMoves;
      context.time = data.time;
      context.bag = data.bag;
   };

   context.unload = function() {
      if(context.display && paper != null) {
         paper.remove();
      }
   };

   function initPointData() {
      console.log("initPointData")
      var pointData;
      var { nbPoints } = context;
      // do{
         pointData = [];

         for(var n = 0; n < nbPoints; n++){
            var pos = getRandomPos();
            pointData.push(pos);
         }
   
         // noVisual = true;
         // var {score} = updatePoints(centroidPos);
         // // var currScore = score;
         // var bestScore = findBestScore();
         // noVisual = false;
   
      // }while(score < bestScore*1.2)
      
      // target = Math.round(bestScore*targetFactor);
      // console.log(score,target)
         // console.log(pointData)
         return pointData

      function getRandomPos() {
         var { xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
         var pos;
         var x0 = xPointArea;
         var y0 = yPointArea;
         var w = pointAreaW;
         var h = pointAreaH;
         // var x1 = x0 + w;
         // var y1 = y0 + h;
         var count = 0;
         var dim = 2;
            
         var ran;
         do{
            var pos = {};
            for(var ax = 0; ax < dim; ax++){
               var ran = (ax == 0) ? w : h;
               var min = (ax == 0) ? x0 : y0;
               // var max = (ax == 0) ? x1 : y1;
               var val = min + rng.nextReal()*ran;
               val = Math.round(val);
               var key = (ax == 0) ? "x" : "y";
               pos[key] = val;
            }
            var tooClose = false;
            for(var iP = 0; iP < pointData.length; iP++){
               var pPos = pointData[iP];
               var d = (dim == 2) ? 
                  Beav.Geometry.distance(pos.x,pos.y,pPos.x,pPos.y) : 
                  Math.abs(pos.x - pPos.x);
               if(d < infos.pointR){
                  tooClose = true;
                  break;
               }
            }
            count++;
            // console.log(count)
         }while(tooClose && count < 50);

         return pos
      };
   };

   function initCanvas() {
      // console.log("initCanvas")
      $("#canvas").remove();
      $("#grid").prepend("<canvas id=canvas></canvas>");
      
      var { xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      $("#canvas").attr({ width: pointAreaW*scale, height: pointAreaH*scale })
      .css({ 
         position: "absolute",
         left: xPointArea*scale+"px",
         top: yPointArea*scale+"px"
      });
   };

   function initPoints() {
      // console.log("initPoints")
      var { nbPoints, pointData, nbClusters } = context;
      var { pointR, classShape, classColor, pointAttr, crossAttr,
         xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;

      // if(frame)
      //    frame.remove();
      // frame = paper.rect(xPointArea*scale,yPointArea*scale,pointAreaW*scale,pointAreaH*scale);
      
      for(var iP = 0; iP < nbPoints; iP++){
         if(!points[iP])
            points[iP] = [];
         var pos = pointData[iP];
         var x = pos.x*scale;
         var y = pos.y*scale;
         // if(dim == 1)
         //    pos.y = yPoint1D;
         for(var iC = 0; iC <= nbClusters; iC++){
            if(points[iP][iC]){
               points[iP][iC].remove();
            }
            var shape = infos.classShape[iC];
            var po = drawShape(shape,x,y,pointR);
            if(shape !== "cross"){
               po.attr(pointAttr).attr("fill",colors[classColor[iC]]);
            }else{
               po.attr(crossAttr).attr("stroke",colors[classColor[iC]]);
            }
            // po.attr("clip-rect",[xPointArea,yPointArea,pointAreaW,pointAreaH]);
            points[iP][iC] = po;
         }
      }
   };

   function initCentroids() {
      if(!context.display)
         return
      var { centroidPos, k } = context;
      for(var iC = 0; iC < k; iC++){
         var pos = centroidPos[iC];
         var coo = getCoordinatesFromPos(pos);
         coo.x = coo.x*scale;
         coo.y = coo.y*scale;
         // console.log(coo)
         drawCentroid(iC + 1,coo.x,coo.y);
      }
   };

   function updateCanvas() {
      if(!context.display)
         return
      var { classColor, xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      var w = Math.round(pointAreaW*scale);
      var h = Math.round(pointAreaH*scale);
      var x0 = Math.round(xPointArea*scale);
      var y0 = Math.round(yPointArea*scale);
      // var w = pointAreaW;
      // var h = pointAreaH;
      // var x0 = xPointArea;
      // var y0 = yPointArea;
      // console.log("updateCanvas",x0,y0,w,h)
      var tmpCanvas = document.getElementById('canvas');
      var ctx = tmpCanvas.getContext('2d');
      var imgData = ctx.createImageData(w,h);
      var dat = imgData.data;
   //    // console.log(answer.params)
      var rgbKeys = ["r","g","b"];
      for(var i = 0; i < dat.length; i += 4) {
         var x = x0 + Math.floor((i/4)%w);
         var y = y0 + Math.floor(i/(4*w));
         var pos = getPosFromCoordinates({x,y},true)
         var { id } = findClosestCentroid(pos);
         var col = classColor[id];
         // if(i == 0)
         //    console.log(id,col,dat[i])
         var op = 0.3;
         for(var j = 0; j < 3; j++){
            // dat[i + j] = colorRGB[col][j];
            dat[i + j] = Raphael.getRGB(colors[col])[rgbKeys[j]];
         }
         dat[i + 3] = Math.round(255*op); 
      }
      ctx.putImageData(imgData, 0, 0); 
   };

   function updatePoints() {
      var { nbPoints } = context;
      for(var iP = 0; iP < nbPoints; iP++){
         updatePoint(iP);
      }
   };

   function updatePoint(iP) {
      if(!context.display)
         return
      var { xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      var x = xPointArea*scale;
      var y = yPointArea*scale;
      var w = pointAreaW*scale;
      var h = pointAreaH*scale;
      var { classPoints, nbClusters } = context;
      var cla = classPoints[iP] || 0;
      // console.log(iP,cla)
      for(var iC = 0; iC <= nbClusters; iC++){
         var obj = points[iP][iC];
         if(iC == cla){
            obj.show();
         }else{
            obj.hide();
         }
         obj.attr("clip-rect",[x,y,w,h]);
      }
   };

   context.updateScore = function(centPos) {
      var { nbPoints, pointData } = context;
      var { xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      var x = xPointArea*scale;
      var y = yPointArea*scale;
      var w = pointAreaW*scale;
      var h = pointAreaH*scale;
      var centPos = centPos || context.centroidPos;
      var score = 0;
      var classPoints = [];
      // // console.log(x,y,w,h)
      for(var iC = 0; iC < centPos.length; iC++){
         classPoints[iC] = [];
      }
      for(var iP = 0; iP < nbPoints; iP++){
         var orPos = pointData[iP];
         // var coo = {};
         // coo.x = orPos.x*scale;
         // coo.y = orPos.y*scale;
         var pos = getPosFromCoordinates(orPos);
         var { id, d } = findClosestCentroid(pos,centPos);
         // console.log(id,d)
         id--;
         classPoints[id].push(iP);
         score += d*d;
      }
      score = Math.round(score);
      return { score, classPoints }
   };

   function findClosestCentroid(pos,centPos) {
      var { x, y } = pos;
      var { centroidPos } = context;
      
      var centPos = centPos || centroidPos;
      if(centPos.length == 0)
         return { id: 0, d: 1000 }

      var dim = 2;
      var minD = Infinity;
      var cID;
      for(var iC = 0; iC < centPos.length; iC++){
         var cPos = centPos[iC];
         // var coo = getCoordinatesFromPos(cPos);
         // var d = Beav.Geometry.distance(x,y,coo.x*scale,coo.y*scale);
         var d = Beav.Geometry.distance(x,y,cPos.x,cPos.y);
         if(d < minD){
            minD = d;
            cID = iC + 1;
         }
      }
      return { id: cID, d: minD }
   };

   context.findBestScore = function() {
      var { nbClusters, nbClusters, centroidPos } = context;
      var { xRange, yRange } = infos;
      var count = 0;
      var centPos = centroidPos;
      var xRan = xRange[1] - xRange[0];
      var yRan = yRange[1] - yRange[0];
      // for(var iC = 0; iC < nbClusters; iC++){
      //    var x = xRange[0] + xRan/nbClusters + 2*(iC%2)*xRan/nbClusters;
      //    var y = yRange[0] + yRan/nbClusters + 2*Math.floor(iC/2)*yRan/nbClusters;
      //    // console.log(x,y)
      //    centPos[iC] = {x,y};
      // }
      do{
         var {score,classPoints} = context.updateScore(centPos);
         var prevSco = score;
         for(var iC = 0; iC < nbClusters; iC++){
            var {x,y} = findBarycenterCoo(iC,classPoints);
            centPos[iC] = getPosFromCoordinates({ x, y });
         }
         var {score} = context.updateScore(centPos);
         var newSco = score;
         count++;
         console.log(prevSco,newSco,count)
      }while(prevSco != newSco && count < 50)
      return score
   };

   function findBarycenterCoo(id,classPoints) {
      var cp = classPoints[id];
      var x = 0;
      var y = 0;
      for(var iP = 0; iP < cp.length; iP++){
         var pID = cp[iP];
         var pos = context.pointData[pID];
         x += pos.x;
         y += pos.y;
      }
      x = x/cp.length;
      y = y/cp.length;

      return {x,y}
   };

   function getCoordinatesFromPos(pos) {
      var { xPointArea, yPointArea, pointAreaW, pointAreaH, xRange, yRange } = infos;
      var x0 = xPointArea;
      var y0 = yPointArea;
      var w = pointAreaW;
      var h = pointAreaH;
      // console.log(x0,y0,w,h)

      var x = x0 + w*(pos.x - xRange[0])/(xRange[1] - xRange[0]);
      var y = y0 + h*(pos.y - yRange[0])/(yRange[1] - yRange[0]);
      x = Math.round(x);
      y = Math.round(y);
      return { x, y }
   };

   function getPosFromCoordinates(coo,can) {
      var x = Math.round(getPosFromCoordinate(coo.x,0,can));
      var y = Math.round(getPosFromCoordinate(coo.y,1,can));
      return { x, y }
   };

   function getPosFromCoordinate(val,ax,can) {
      var { xRange, yRange, xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      var ran, min, le
      if(ax == 0){
         ran = xRange;
         le = pointAreaW;
         min = xPointArea;
      }else{
         ran = yRange;
         le = pointAreaH;
         min = yPointArea;
      }
      if(can){
         le = le*scale;
         min = min*scale;
      }

      var res = ran[0] + (ran[1] - ran[0])*(val - min)/le;
      return res
   };

   function drawCentroid(id,cx,cy,bar) {
      if(!bar && centroids[id])
         centroids[id].remove();
      if(bar && barycenters[id]){
         barycenters[id].remove();
      }
      var a = (!bar) ? infos.centroidAttr : barycenterAttr;
      var col = colors[infos.classColor[id]];
      paper.setStart();
      // if(dim == 1){
      //    var line = paper.path(["M",cx,cy,"V",yPointArea]).attr(a.line);
      // }
      var shape = (!bar) ? infos.classShape[id] : "cross"; 
      var sha = drawShape(shape,cx,cy,infos.centroidShapeR);
      sha.attr(a.shape);
      if(!bar){
         sha.attr("fill",col);
      }else{
         sha.attr("stroke",col);
      }
      var circle = paper.circle(cx,cy,infos.centroidR).attr(a.circle).attr("stroke",col);
      var ov = paper.circle(cx,cy,infos.centroidR).attr(overlayAttr);

      if(!bar){
         centroids[id] = paper.setFinish();
      }else{
         barycenters[id] = paper.setFinish();
      }
   };

   function drawShape(sha,cx,cy,r) {
      switch(sha){
      case "circle":
         return paper.circle(cx,cy,r)
      case "square":
         var s = r*1.8;
         var x = cx - s/2;
         var y = cy - s/2;
         return paper.rect(x,y,s,s)
      case "triangle":
         cy -= r*0.2;
      default:
         return getShape(paper,sha,cx,cy,{radius:r})
      }
   };

   function highlightPoint(id) {
      if(!context.display)
         return
      if(pointHighlight){
         pointHighlight.remove();
         pointHighlight = null;
      }
      var { pointData } = context;
      var { pointHighlightAttr, pointR } = infos;
      var pos = pointData[id];
      var x = pos.x*scale;
      var y = pos.y*scale;

      var r = pointR*1.5;

      pointHighlight = paper.circle(x,y,r).attr(pointHighlightAttr);
   };

   function highlightCoordinate(id,ax) {
      if(!context.display)
         return
      if(coordinateHighlight){
         coordinateHighlight.remove();
         coordinateHighlight = null;
      }
      if(distanceObj){
         distanceObj.remove();
         distanceObj = null;
      }
      var { pointData } = context;
      var { coordinateHighlightAttr, xPointArea, yPointArea } = infos;
      
      var pos = pointData[id];
      var x = pos.x*scale;
      var y = pos.y*scale;
      if(ax == 0){
         var x0 = xPointArea*scale;
         var p = ["M",x0,y,"H",x];
      }else{
         var y0 = yPointArea*scale;
         var p = ["M",x,y0,"V",y];
      }

      coordinateHighlight = paper.path(p).attr(coordinateHighlightAttr);
   };

   function showDist(idItem,idCluster) {
      if(!context.display)
         return
      if(coordinateHighlight){
         coordinateHighlight.remove();
         coordinateHighlight = null;
      }
      if(distanceObj){
         distanceObj.remove();
         distanceObj = null;
      }

      var { pointData, centroidPos } = context;
      var { distanceAttr } = infos;
      var a = distanceAttr;
      
      var coo1 = pointData[idItem];
      var x1 = coo1.x*scale;
      var y1 = coo1.y*scale;

      var pos2 = centroidPos[idCluster];
      var coo = getCoordinatesFromPos(pos2);
      var x2 = coo.x*scale;
      var y2 = coo.y*scale;

      var line = paper.path(["M",x1,y1,"L",x2,y2]).attr(a.line);

      var pos1 = getPosFromCoordinates(coo1);
      // console.log(pos1,pos2)
      var d = Math.round(Beav.Geometry.distance(pos1.x,pos1.y,pos2.x,pos2.y));
      var xt = (x1 + x2)/2;
      var yt = (y1 + y2)/2;
      var text = paper.text(xt,yt,d).attr(a.text);
      var bbox = text.getBBox();
      var back = paper.rect(bbox.x - 2,bbox.y - 2,bbox.width + 4,bbox.height + 4).attr(a.back);
      text.toFront();

      
      distanceObj = paper.set(line,back,text);
   };

   context.removeHighlight = function() {
      if(!context.display)
         return
      if(pointHighlight){
         pointHighlight.remove();
         pointHighlight = null;
      }
      if(coordinateHighlight){
         coordinateHighlight.remove();
         coordinateHighlight = null;
      }
      if(distanceObj){
         distanceObj.remove();
         distanceObj = null;
      }
   };
   
   // var resetBoard = function() {
   //    // var { paperW, paperH } = infos;
   //    // frame = paper.rect(0,0,paperW, paperH).attr("stroke-width", "5");

   //    // initCentroids();
   //    // for(var iRow = 0;iRow < context.nbRows;iRow++) {
   //    //    cells[iRow] = [];
   //    //    for(var iCol = 0;iCol < context.nbCols;iCol++) {
   //    //       cells[iRow][iCol] = paper.rect(0, 0, 10, 10);
   //    //       if(context.tiles[iRow][iCol] == 0)
   //    //          cells[iRow][iCol].attr({'stroke-width': '0'});
   //    //       if(infos.backgroundColor && context.tiles[iRow][iCol] != 0)
   //    //          cells[iRow][iCol].attr({'fill': infos.backgroundColor});
   //    //       if(infos.noBorders) {
   //    //          if (context.tiles[iRow][iCol] != 0) {
   //    //             cells[iRow][iCol].attr({'stroke': infos.backgroundColor});
   //    //          }
   //    //       } else {
   //    //          if (infos.borderColor) {
   //    //             cells[iRow][iCol].attr({'stroke': infos.borderColor});
   //    //          }
   //    //       }
            
   //    //    }
   //    // }
   //    // if(infos.showLabels) {
   //    //    for(var iRow = 0;iRow < context.nbRows;iRow++) {
   //    //       rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
   //    //    }
   //    //    for(var iCol = 0;iCol < context.nbCols;iCol++) {
   //    //       colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
   //    //    }
   //    // }
   //    // if (infos.showCardinals) {
   //    //    cardLabels = [
   //    //       paper.text(0, 0, strings.cardinals.north),
   //    //       paper.text(0, 0, strings.cardinals.south),
   //    //       paper.text(0, 0, strings.cardinals.west),
   //    //       paper.text(0, 0, strings.cardinals.east)
   //    //       ];
   //    // }
   // };


   
   // var resetItem = function(initItem, redisplay) {
   //    if(redisplay === undefined)
   //       redisplay = true;
   //    var item = {};
   //    context.items.push(item);
   //    for(var property in initItem) {
   //       item[property] = initItem[property];
   //    }
      
   //    item.side = 0;
   //    item.offsetX = 0;
   //    item.offsetY = 0;
   //    item.nbStates = 1;
   //    item.zOrder = 0;
   //    for(var property in infos.itemTypes[item.type]) {
   //       item[property] = infos.itemTypes[item.type][property];
   //    }
      
   //    if(context.display && redisplay) {
   //       redisplayItem(item);
   //    }
   // };
   
   // var resetItems = function() {
   //    context.items = [];
   //    var itemTypeByNum = {};
   //    for(var type in infos.itemTypes) {
   //       var itemType = infos.itemTypes[type];
   //       if(itemType.num != undefined) {
   //          itemTypeByNum[itemType.num] = type;
   //       }
   //    }
   //    for(var iRow = 0;iRow < context.nbRows;iRow++) {
   //       for(var iCol = 0;iCol < context.nbCols;iCol++) {
   //          var itemTypeNum = context.tiles[iRow][iCol];
   //          if(itemTypeByNum[itemTypeNum] != undefined) {
   //             resetItem({
   //                row: iRow,
   //                col: iCol,
   //                type: itemTypeByNum[itemTypeNum]
   //             }, false);
   //          }
   //       }
   //    }
   //    for(var iItem = context.initItems.length - 1;iItem >= 0;iItem--) {
   //       resetItem(context.initItems[iItem], false);
   //    }
      
   //    if(context.display)
   //       redisplayAllItems();
   // };
   
   var resetItemsZOrder = function(row, col) {
      var cellItems = [];
      for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
         var item = context.items[iItem];
         if((item.row == row) && (item.col == col)) {
            cellItems.push(item);
         }
      }
      cellItems.sort(function(itemA, itemB) {
         if(itemA.zOrder < itemB.zOrder) {
            return -1;
         }
         if(itemA.zOrder > itemB.zOrder) {
            return 1;
         }
         return 0;
      });
      for(var iItem = 0;iItem < cellItems.length;iItem++) {
         if(cellItems[iItem].element)
            cellItems[iItem].element.toFront();
      }
   };

   var redisplayItem = function(item, resetZOrder) {
      if(context.display !== true)
         return;
      if(resetZOrder === undefined)
         resetZOrder = true;
      
      if(item.element !== undefined) {
         item.element.remove();
      }
      var x = (infos.cellSide * item.col + infos.leftMargin) * scale;
      var y = (infos.cellSide * item.row + infos.topMargin) * scale;
      var itemType = infos.itemTypes[item.type];
      
      if(item.customDisplay !== undefined) {
      	item.customDisplay(item);
      }
      
      if(item.img) {
         item.element = paper.image(getImgPath(item.img), x, y, item.side * item.nbStates * scale, item.side * scale);
      }
      else if(item.value !== undefined) {
         var fontColor = item.fontColor;
         if(fontColor === undefined) { fontColor = "black"; }
         
         var value;
         if(typeof(item.value) == "function")
            value = item.value(item);
         else
            value = item.value;
         
         item.element = paper.text(x + item.side * scale / 2, y + item.side * scale / 2, value).attr({
            "font-size": item.side * scale / 2,
            "fill": fontColor,
         });
         
         if(item.fontBold === true) {
            item.element.attr({
               "font-weight": "bold"
            });
         }
      }
      else if(item.color !== undefined) {
         item.element = paper.rect(0, 0, item.side, item.side).attr({"fill": item.color});
      }
      if(item.element !== undefined)
         item.element.attr(itemAttributes(item));
      if(resetZOrder)
         resetItemsZOrder(item.row, item.col);
   };
   
   
   
   var redisplayAllItems = function() {
      // if(context.display !== true)
      //    return;
      // for(var iItem = 0;iItem < context.items.length;iItem++) {
      //    var item = context.items[iItem];
      //    redisplayItem(item, false);
      // }
      
      // for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
      //    var item = context.multicell_items[iItem];
      //    item.redisplay();
      // }
      
      // var cellItems = [];
      
      // for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
      //    var item = context.items[iItem];
      //    cellItems.push(item);
      // }
      
      // for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
      //    var item = context.multicell_items[iItem];
      //    cellItems.push(item);
      // }
      
      // cellItems.sort(function(itemA, itemB) {
      //    if(itemA.zOrder < itemB.zOrder) {
      //       return -1;
      //    }
      //    if(itemA.zOrder > itemB.zOrder) {
      //       return 1;
      //    }
      //    return 0;
      // });
      // for(var iItem = 0;iItem < cellItems.length;iItem++) {
      //    if(cellItems[iItem].element !== undefined)
      //       cellItems[iItem].element.toFront();
      // }
   };
   
   context.advanceTime = function(epsilon) {
      var items = [];
      for(var id in context.items) {
         items.push(context.items[id]);
      }
      
      for(var iTime = 0;iTime < epsilon;iTime++) {
         context.time++;
         for(var id in items) {
            if(items[id] !== undefined && items[id].action !== undefined) {
               items[id].action.bind(context)(items[id], context.time);
            }
         }
         
         var robot = this.getRobot();
         if(this.hasOn(robot.row, robot.col, function(item) { return item.isProjectile === true; })) {
            throw(context.strings.messages.failureProjectile);
         }
      }
   };
   
   context.getRobotId = function() {
      for(var id in context.items) {
         if(context.items[id].isRobot != undefined) {
            return id;
         }
      }
      return undefined;
   };
   
   context.getRobot = function() {
      return context.items[context.getRobotId()];
   };
   
   context.getInfo = function(name) {
      return infos[name];
   };
   
   context.setInfo = function(name, value) {
      infos[name] = value;
   };
   
   context.hasOn = function(row, col, filter) {
      for(var id in context.items) {
         var item = context.items[id];
         if(item.row == row && item.col == col && filter(item)) {
            return true;
         }
      }
      return false;
   };
   
   context.setIndexes = function() {
      for(var id in context.items) {
         var item = context.items[id];
         item.index = id;
      }
   }
   
   context.getItemsOn = function(row, col, filter) {
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      var selected = [];
      for(var id in context.items) {
         var item = context.items[id];
         if(item.row == row && item.col == col && filter(item)) {
            selected.push(item);
         }
      }
      return selected;
   };
   
   context.isOn = function(filter) {
      var item = context.getRobot();
      return context.hasOn(item.row, item.col, filter);
   };
   
   context.isInFront = function(filter) {
      var coords = context.coordsInFront();
      return context.hasOn(coords.row, coords.col, filter);
   };
   
   context.isInGrid = function(row, col) {
      if(row < 0 || col < 0 || row >= context.nbRows || col >= context.nbCols) {
         return false;
      }
      if (context.tiles[row][col] == 0) {
         return false;
      }
      return true;
   };
   
   context.tryToBeOn = function(row, col) {
      // Returns whether the robot can move to row, col
      // true : yes, false : no but move ignored, string : no and throw error
      if(!context.isInGrid(row, col)) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.leavesGrid;
      }
      
      if(context.hasOn(row, col, function(item) { return item.isObstacle === true; })) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.obstacle;
      }
      
      if(context.hasOn(row, col, function(item) { return item.isProjectile === true; })) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.failureProjectile;
      }
      return true;
   };
   
   context.coordsInFront = function(dDir, mult) {
      if(dDir === undefined)
         dDir = 0;
      if(mult === undefined)
         mult = 1;
      var item = context.getRobot();
      var lookDir = (item.dir + dDir + 4) % 4;
      var delta = [[0,1],[1,0],[0,-1],[-1,0]];
      return {
         row: item.row + delta[lookDir][0] * mult,
         col: item.col + delta[lookDir][1] * mult
      };
   };
   
   context.isCrossing = function(wireA, wireB) {
      function crossProduct(pointA, pointB, pointC) {
         return (pointB[0] - pointA[0]) * (pointC[1] - pointA[1]) - (pointB[1] - pointA[1]) * (pointC[0] - pointA[0]);
      }
      
      function onLine(segment, point) {
         return (Math.min(segment[0][0], segment[1][0]) <= point[0] && point[0] <= Math.max(segment[0][0], segment[1][0]))
          && (Math.min(segment[0][1], segment[1][1]) <= point[1] && point[1] <= Math.max(segment[0][1], segment[1][1]));
      }
      
      if(crossProduct(wireA[0], wireA[1], wireB[0]) == 0 && crossProduct(wireA[0], wireA[1], wireB[1]) == 0) {
         return onLine(wireA, wireB[0]) || onLine(wireA, wireB[1]) || onLine(wireB, wireA[0]) || onLine(wireB, wireA[1]);
      }
      return (crossProduct(wireA[0], wireA[1], wireB[0])
      * crossProduct(wireA[0], wireA[1], wireB[1]) <= 0) &&
      (crossProduct(wireB[0], wireB[1], wireA[0])
      * crossProduct(wireB[0], wireB[1], wireA[1]) <= 0);
   }
   
   context.moveRobot = function(newRow, newCol, newDir, callback) {
      var iRobot = context.getRobotId();
      var item = context.items[iRobot];
      if (context.display) 
         item.element.toFront();
      var animate = (item.row != newRow) || (item.col != newCol) || (newDir == item.dir);
      
      if((item.dir != newDir) && ((item.row != newRow) || (item.col != newCol))) {
         if(item.dir !== undefined)
            item.dir = newDir;
         if(context.display) {
            var attr = itemAttributes(item);
            item.element.attr(attr);
         }
      }
      
      if(item.dir !== undefined)
         item.dir = newDir;
      
      item.row = newRow;
      item.col = newCol;
      
      context.withdraw(function(obj) { return obj.autoWithdraw === true; }, false);
      
      if(context.display) {
         attr = itemAttributes(item);
         if(infos.actionDelay > 0) {
            if(animate) {
               context.raphaelFactory.animate("animRobot" + iRobot + "_" + Math.random(), item.element, attr, infos.actionDelay);
            } else {
               context.delayFactory.createTimeout("moveRobot" + iRobot + "_" + Math.random(), function() {
                  item.element.attr(attr);
               }, infos.actionDelay / 2);
            }
         } else {
            item.element.attr(attr);
         }
         $("#nbMoves").html(context.nbMoves);
      }
      
      context.advanceTime(1);
      if(callback) {
         context.waitDelay(callback);
      }
   };
   
   // context.moveItem = function(item, newRow, newCol) {
   //    var animate = (item.row != newRow) || (item.col != newCol);
   //    var robot = context.getRobot();
   //    if(context.display) {
   //       resetItemsZOrder(newRow, newCol);
   //       resetItemsZOrder(item.row, item.col);
   //       resetItemsZOrder(robot.row, robot.col);
   //    }
   //    item.row = newRow;
   //    item.col = newCol;
      
   //    if(context.display) {
   //       if(animate) {
   //          attr = itemAttributes(item);
   //          context.raphaelFactory.animate("animItem" + "_" + Math.random(), item.element, attr, infos.actionDelay);
   //       }
   //       else {
   //          attr = itemAttributes(item);
   //          if(infos.actionDelay > 0) {
   //             context.delayFactory.createTimeout("moveItem" + "_" + Math.random(), function() {
   //                item.element.attr(attr);
   //             }, infos.actionDelay / 2);
   //          } else {
   //             item.element.attr(attr);
   //          }
   //       }
   //    }
   // };
   
   // context.moveProjectile = function(item) {
   //    if(!context.isInGrid(item.row + 1, item.col)) {
   //       context.destroy(item);
   //    }
      
   //    if(context.hasOn(item.row + 1, item.col, function(item) { return item.isObstacle === true; } )) {
   //       context.destroy(item);
   //       context.dropObject({type: "dispersion"}, {row: item.row + 1, col: item.col});
   //       return;
   //    }
      
   //    if(context.hasOn(item.row + 1, item.col, function(item) { return item.isRobot === true; } )) {
   //       context.destroy(item);
   //       context.dropObject({type: "dispersion_robot"}, {row: item.row + 1, col: item.col});
   //       return;
   //    }
      
   //    context.moveItem(item, item.row + 1, item.col);
   //    return;
   // };
   
   // context.destroy = function(item) {
   //    context.setIndexes();
   //    context.items.splice(item.index, 1);

   //    if(context.display) {
   //       item.element.remove();
   //    }
   // };
   
   // context.fall = function(item, row, col, callback) {
   //    var startRow = row;
   //    var platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
      
   //    while(context.isInGrid(row + 1, col) && platforms.length == 0) {
   //       row++;
   //       platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
   //    }
      
   //    if(!context.isInGrid(row + 1, col)) {
   //       throw(context.strings.messages.falls);
   //    }
      
   //    if(row - startRow > infos.maxFallAltitude) {
   //       throw(context.strings.messages.willFallAndCrash);
   //    }
   //    context.nbMoves++;
   //    context.moveRobot(row, col, item.dir, callback);
   // };
   
   // context.jump = function(callback) {
   //    if(!infos.hasGravity) {
   //       throw("Error: can't jump without gravity");
   //    }
      
   //    var item = context.getRobot();
   //    if(!context.isInGrid(item.row - 1, item.col)) {
   //       throw(context.strings.messages.jumpOutsideGrid);
   //    }
   //    var obstacle = context.getItemsOn(item.row - 2, item.col, function(obj) { return obj.isObstacle === true || obj.isProjectile === true; });
   //    if(obstacle.length > 0) {
   //       throw(context.strings.messages.jumpObstacleBlocking);
   //    }
   //    var platforms = context.getItemsOn(item.row - 1, item.col, function(obj) { return obj.isObstacle === true; });
   //    if(platforms.length == 0) {
   //       throw(context.strings.messages.jumpNoPlatform);
   //    }
   //    context.nbMoves++;
   //    context.moveRobot(item.row - 2, item.col, item.dir, callback);
   // };
   
   // context.withdraw = function(filter, errorWhenEmpty) {
   //    if(filter === undefined) {
   //       filter = function(obj) { return true; };
   //    }
   //    if(errorWhenEmpty === undefined) {
   //       errorWhenEmpty = true;
   //    }
   //    var item = context.getRobot();
   //    var withdrawables = context.getItemsOn(item.row, item.col, function(obj) { return obj.isWithdrawable === true && filter(obj); });
   //    if(withdrawables.length == 0) {
   //       if(errorWhenEmpty)
   //          throw(context.strings.messages.nothingToPickUp);
   //       return;
   //    }
      
   //    if(infos.bagSize != undefined && context.bag.length == infos.bagSize) {
   //       throw(context.strings.messages.tooManyObjects);
   //    }
      
   //    var withdrawable = withdrawables[0];
   //    context.setIndexes();
   //    context.items.splice(withdrawable.index, 1);
   //    context.bag.push(withdrawable);
      
   //    if(context.display) {
   //       function removeWithdrawable() {
   //          withdrawable.element.remove();
   //          var items = context.getItemsOn(item.row, item.col);
   //          for(var i = 0; i < items.length ; i++) {
   //             redisplayItem(items[i]);
   //          }
   //       }

   //       if (infos.actionDelay > 0) {
   //          context.delayFactory.createTimeout("takeItem_" + Math.random(), removeWithdrawable, infos.actionDelay);
   //       } else {
   //          removeWithdrawable();
   //       }
   //    }
   // };
   
   // context.checkContainer = function(coords) {
   //    var containers = context.getItemsOn(coords.row, coords.col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
   //    if(containers.length != 0) {
         
   //       var container = containers[0];
   //       if(container.containerSize == undefined && container.containerFilter == undefined) {
   //          container.containerSize = 1;
   //       }
   //       var filter;
   //       if(container.containerFilter == undefined)
   //          filter = function(obj) { return obj.isWithdrawable === true; };
   //       else
   //          filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
         
   //       if(container.containerSize != undefined && context.getItemsOn(coords.row, coords.col, filter).length > container.containerSize) {
   //          throw(window.languageStrings.messages.failureDropObject);
   //          return;
   //       }

         

   //       if(container.containerFilter != undefined) {
   //          if(context.hasOn(coords.row, coords.col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) }) && (context.infos.blockingFilter !== false)) {

   //             throw(window.languageStrings.messages.failureDropObject);
   //             return;
   //          }
   //       }
   //    }
   // };
   
   // context.drop = function(count, coords, filter) {
   //    if(count === undefined) {
   //       count = 1;
   //    }
   //    if(filter === undefined) {
   //       filter = function(obj) { return true; };
   //    }
   //    if(coords == undefined) {
   //       var item = context.getRobot();
   //       coords = {row: item.row, col: item.col};
   //    }
      
   //    for(var i = 0;i < count;i++) {
   //       if(context.bag.length == 0) {
   //          throw(context.strings.messages.emptyBag);
   //       }
         
   //       var object = context.bag.pop();
   //       object.row = coords.row;
   //       object.col = coords.col;
   //       var itemsOn = context.getItemsOn(coords.row, coords.col);
   //       var maxi = object.zOrder;
   //       for(var item in itemsOn) {
   //          if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
   //             maxi = itemsOn[item].zOrder;
   //          }
   //          redisplayItem(item);
   //       }
         
   //       object.zOrder = maxi + 0.000001;
   //       resetItem(object, true);
         
   //       context.checkContainer(coords);
   //    }
      
   //    redisplayItem(this.getRobot());
   // };
   
   // context.dropObject = function(object, coords) {
   //    if(coords == undefined) {
   //       var item = context.getRobot();
   //       coords = {row: item.row, col: item.col};
   //    }
      
   //    if(!context.isInGrid(coords.row, coords.col)) {
   //       throw(window.languageStrings.messages.failureDropOutside);
   //       return;
   //    }
      
   //    object.row = coords.row;
   //    object.col = coords.col;
      
   //    var itemsOn = context.getItemsOn(coords.row, coords.col);
   //    var maxi = object.zOrder;
   //    if(maxi === undefined) {
   //       maxi = 0;
   //    }
   //    for(var item in itemsOn) {
   //       if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
   //          maxi = itemsOn[item].zOrder;
   //       }
   //       redisplayItem(item);
   //    }
   //    resetItem(object, true);
   //    context.checkContainer(coords);
   //    redisplayItem(this.getRobot());
   // };
   
   // context.turnLeft = function(callback) {
   //    var robot = context.getRobot();
   //    context.moveRobot(robot.row, robot.col, (robot.dir + 3) % 4, callback);
   // };
   
   // context.turnRight = function(callback) {
   //    var robot = context.getRobot();
   //    context.moveRobot(robot.row, robot.col, (robot.dir + 1) % 4, callback);
   // };
   
   // context.turnAround = function(callback) {
   //    var robot = context.getRobot();
   //    context.moveRobot(robot.row, robot.col, (robot.dir + 2) % 4, callback);
   // };
   
   // context.forward = function(callback) {
   //    var robot = context.getRobot();
   //    var coords = context.coordsInFront();
   //    var ttbo = context.tryToBeOn(coords.row, coords.col);
   //    if(ttbo === true) {
   //       if(infos.hasGravity) {
   //          context.fall(robot, coords.row, coords.col, callback);
   //       } else {
   //          context.nbMoves++;
   //          context.moveRobot(coords.row, coords.col, robot.dir, callback);
   //       }
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
   //       throw ttbo;
   //    }
   // };
   
   // context.backwards = function(callback) {
   //    var robot = context.getRobot();
   //    var coords = context.coordsInFront(2);
   //    var ttbo = context.tryToBeOn(coords.row, coords.col);
   //    if(ttbo === true) {
   //       if(infos.hasGravity) {
   //          context.fall(robot, coords.row, coords.col, callback);
   //       } else {
   //          context.nbMoves++;
   //          context.moveRobot(coords.row, coords.col, robot.dir, callback);
   //       }
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
   //       throw ttbo;
   //    }
   // };
   
   // context.north = function(callback) {
   //    var item = context.getRobot();
   //    var ttbo = context.tryToBeOn(item.row - 1, item.col);
   //    if(ttbo === true) {
   //       context.nbMoves++;
   //       context.moveRobot(item.row - 1, item.col, 3, callback);
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(item.row - 1/4, item.col, 3);
   //       throw ttbo;
   //    }
   // };
   
   // context.south = function(callback) {
   //    var item = context.getRobot();
   //    var ttbo = context.tryToBeOn(item.row + 1, item.col);
   //    if(ttbo === true) {
   //       context.nbMoves++;
   //       context.moveRobot(item.row + 1, item.col, 1, callback);
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(item.row + 1/4, item.col, 1);
   //       throw ttbo;
   //    }
   // };
   
   // context.east = function(callback) {
   //    var item = context.getRobot();
   //    var ttbo = context.tryToBeOn(item.row, item.col + 1);
   //    if(ttbo === true) {
   //       context.nbMoves++;
   //       context.moveRobot(item.row, item.col + 1, 0, callback);
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(item.row, item.col + 1/4, 0);
   //       throw ttbo;
   //    }
   // };
   
   // context.west = function(callback) {
   //    var item = context.getRobot();
   //    var ttbo = context.tryToBeOn(item.row, item.col - 1);
   //    if(ttbo === true) {
   //       context.nbMoves++;
   //       context.moveRobot(item.row, item.col - 1, 2, callback);
   //    } else if(ttbo === false) {
   //       context.waitDelay(callback);
   //    } else {
   //       context.moveRobot(item.row, item.col - 1/4, 2);
   //       throw ttbo;
   //    }
   // };
   
   // context.obstacleInFront = function() {
   //    return context.isInFront(function(obj) { return obj.isObstacle === true; });
   // };
   
   // context.platformInFront = function() {
   //    var coords = context.coordsInFront();
   //    return context.hasOn(coords.row + 1, coords.col, function(obj) { return obj.isObstacle === true; });
   // };
   
   // context.platformAbove = function() {
   //    var robot = context.getRobot();
   //    return context.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; });
   // };
   
   // context.writeNumber = function(row, col, value) {
   //    var numbers = context.getItemsOn(row, col, function(obj) { return obj.isWritable === true; });
      
   //    if(numbers.length == 0) {
   //       throw(strings.messages.failureWriteHere);
   //    }
      
   //    var number = numbers[0];
   //    number.value = value;
   //    if(context.display) {
   //       redisplayItem(number);
   //    }
   // };
   
   // context.readNumber = function(row, col) {
   //    var numbers = context.getItemsOn(row, col, function(obj) { return obj.value !== undefined; });
      
   //    if(numbers.length == 0) {
   //       throw(strings.messages.failureReadHere);
   //    }
      
   //    return parseInt(numbers[0].value);
   // };
   
   // context.pushObject = function(callback) {
   //    var robot = context.getRobot();
   //    var coords = context.coordsInFront();
      
   //    var items = context.getItemsOn(coords.row, coords.col, function(obj) { return obj.isPushable === true ; });
      
   //    if(items.length == 0) {
   //       throw(strings.messages.failureNothingToPush);
   //    }
      
   //    var coordsAfter = context.coordsInFront(0, 2);
      
   //    if(!context.isInGrid(coordsAfter.row, coordsAfter.col))
   //       throw(strings.messages.failureWhilePushing);
   //    if(context.hasOn(coordsAfter.row, coordsAfter.col, function(obj) { return obj.isObstacle === true; } ))
   //       throw(strings.messages.failureWhilePushing);
   //    if(context.tiles[coordsAfter.row][coordsAfter.col] == 0)
   //       throw(strings.messages.failureWhilePushing);
      
   //    context.moveItem(items[0], coordsAfter.row, coordsAfter.col);
      
   //    context.forward(callback);
   // };
   
   // context.shoot = function(lig, col, dir) {
   //    dir = dir % 8;
   //    var dirs = [
   //       [-1, 0],
   //       [-1, 1],
   //       [0, 1],
   //       [1, 1],
   //       [1, 0],
   //       [1, -1],
   //       [0, -1],
   //       [-1, -1]
   //    ];
      
   //    var lights = context.getItemsOn(lig, col, function(obj) {
   //       return obj.isLight === true;
   //    });
      
   //    for(var light in lights) {
   //       lights[light].state = 1;
   //       lights[light].img = lights[light].states[lights[light].state];
   //       if(context.display)
   //          redisplayItem(lights[light]);
   //    }
      
   //    var x = (infos.cellSide * (col + 0.5) + infos.leftMargin) * scale;
   //    var y = (infos.cellSide * (lig + 0.5) + infos.topMargin) * scale;
      
   //    var taille = infos.cellSide;
      
   //    var findRobot = false;
      
   //    var plig = lig + dirs[dir][0];
   //    var pcol = col + dirs[dir][1];
   //    if(!context.isInGrid(plig, pcol) || context.hasOn(plig, pcol, function(obj) { return obj.isOpaque === true; })) {
   //       taille /= 2;
         
   //       findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
   //    }
   //    else {
   //       var pdir = dir;
   //       var mirrors = context.getItemsOn(plig, pcol, function(obj) { return obj.isMirror === true; });
   //       if(mirrors.length != 0) {
   //          pdir = mirrors[0].mirrorFunction(dir);
   //       }
         
   //       findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
         
   //       if(context.shoot(plig, pcol, pdir)) {
   //          findRobot = true;
   //       }
   //    }
      
   //    var dx = (taille * dirs[dir][1]) * scale;
   //    var dy = (taille * dirs[dir][0]) * scale;
      
   //    if(context.display && paper != undefined) {
   //       var segment = paper.path("M " + x + " " + y + " l " + dx + " " + dy);
         
   //       segment.attr({'stroke-width': 5, 'stroke': '#ffff93'});
         
   //       context.delayFactory.createTimeout("deleteSegement_" + Math.random(), function() {
   //          segment.remove();
   //       }, infos.actionDelay * 2);
   //    }
      
   //    return findRobot;
   // };
   
   // context.connect = function() {
   //    var robot = context.getRobot();
      
   //    var plugs = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.plugType !== undefined ; });
      
   //    if(plugs.length == 0) {
   //       throw(strings.messages.failureNoPlug);
   //    }
      
   //    var wires = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWire === true; });
      
   //    if(wires.length != 0) {
   //       throw(strings.messages.failureAlreadyWired);
   //    }
      
   //    this.dropObject({type: "wire", zOrder: 1});
      
   //    if(this.last_connect !== undefined) {
   //       if(this.last_connect.plugType + plugs[0].plugType != 0)
   //          throw(strings.messages.failureWrongPlugType);
            
   //       function segmentLength(segment) {
   //          return Math.sqrt((segment[0][0] - segment[1][0]) * (segment[0][0] - segment[1][0]) + (segment[0][1] - segment[1][1]) * (segment[0][1] - segment[1][1]));
   //       }
         
   //       var wire = [[this.last_connect.row, this.last_connect.col],[plugs[0].row, plugs[0].col]];
         
   //       if(segmentLength(wire) > infos.maxWireLength) {
   //          throw(strings.messages.failureWireTooLong);
   //       }
         
   //       var totalLength = segmentLength(wire);
   //       for(var iWire = 0;iWire < this.wires.length;iWire++) {
   //          if(this.isCrossing(wire, this.wires[iWire])) {
   //             throw(strings.messages.failureWireCrossing);
   //          }
   //          totalLength += segmentLength(this.wires[iWire]);
   //       }
         
   //       if(totalLength > infos.maxTotalLength) {
   //          throw(strings.messages.failureTotalLengthExceeded);
   //       }
         
   //       this.wires.push(wire);
         
   //       var x = (this.last_connect.col + 0.5) * infos.cellSide + infos.leftMargin;
   //       var y = (this.last_connect.row + 0.5) * infos.cellSide + infos.topMargin;
   //       var dx = (plugs[0].col - this.last_connect.col) * infos.cellSide;
   //       var dy = (plugs[0].row - this.last_connect.row) * infos.cellSide;
         
   //       var wire_item = {zOrder: 2};
   //       wire_item.redisplay = function() {
   //          wire_item.element = paper.path("M " + (x * scale) + " " + (y * scale) + " l " + (dx * scale) + " " + (dy * scale));
   //          wire_item.element.attr({'stroke-width': 5, 'stroke': '#dd0000'});
   //       };
         
   //       this.multicell_items.push(wire_item);
   //       redisplayAllItems();
         
   //       this.last_connect = undefined;
   //    }
   //    else {
   //       this.last_connect = plugs[0];
   //    }
   // };
      
   return context;
};

// var getResources = function(subTask) {
//    var res = [];
//    var type = subTask.gridInfos.contextType;
//    var typeData = contextParams[type];
//    if(typeData.itemTypes){
//       for(var key in typeData.itemTypes){
//          var params = typeData.itemTypes[key];
//          if(params.img){
//             res.push({ type: 'image', url: params.img });
//          }
//       }
//    }
//    return res
// };

// var robotEndConditions = {
//    checkReachExit: function(context, lastTurn) {
//       var robot = context.getRobot();
//       if(context.isOn(function(obj) { return obj.isExit === true; })) {
//          context.success = true;
//          throw(window.languageStrings.messages.successReachExit);
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(window.languageStrings.messages.failureReachExit);
//       }
//    },
//    checkPickedAllWithdrawables: function(context, lastTurn) {
//       var solved = true;
//       for(var row = 0;row < context.nbRows;row++) {
//          for(var col = 0;col < context.nbCols;col++) {
//             if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
//                solved = false;
//             }
//          }
//       }
      
//       if(solved) {
//          context.success = true;
//          throw(window.languageStrings.messages.successPickedAllWithdrawables);
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(window.languageStrings.messages.failurePickedAllWithdrawables);
//       }
//    },
//    checkPlugsWired: function(context, lastTurn) {
//       var solved = true;
//       for(var row = 0;row < context.nbRows;row++) {
//          for(var col = 0;col < context.nbCols;col++) {
//             if(context.hasOn(row, col, function(obj) { return obj.plugType !== undefined; }) && !context.hasOn(row, col, function(obj) { return obj.isWire === true; })) {
//                solved = false;
//             }
//          }
//       }
      
//       if(solved) {
//          context.success = true;
//          throw(window.languageStrings.messages.successPlugsWired);
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(window.languageStrings.messages.failurePlugsWired);
//       }
//    },
//    checkContainersFilled: function(context, lastTurn) {
//       var solved = true;
      
//       var messages = [
//          window.languageStrings.messages.failureContainersFilled,
//          window.languageStrings.messages.failureContainersFilledLess,
//          window.languageStrings.messages.failureContainersFilledBag
//       ];
//       var message = 2;
//       if (context.infos.maxMoves != undefined) {
//          if (context.nbMoves > context.infos.maxMoves) {
//             context.success = false;
//             throw(window.languageStrings.messages.failureTooManyMoves + " : " + context.nbMoves);
//          }
//       }
//       for(var row = 0;row < context.nbRows;row++) {
//          for(var col = 0;col < context.nbCols;col++) {
//             var containers = context.getItemsOn(row, col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
//             if(containers.length != 0) {
//                var container = containers[0];
//                if(container.containerSize == undefined && container.containerFilter == undefined) {
//                   container.containerSize = 1;
//                }
//                var filter;
//                if(container.containerFilter == undefined)
//                   filter = function(obj) { return obj.isWithdrawable === true; };
//                else
//                   filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
               
//                if(container.containerSize != undefined && context.getItemsOn(row, col, filter).length != container.containerSize) {
//                   solved = false;
//                   message = Math.min(message, 1);
//                }
//                else if(context.getItemsOn(row, col, filter).length == 0) {
//                   solved = false;
//                   message = Math.min(message, 0);
//                }
               
//                if(container.containerFilter != undefined) {
//                   if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) })) {
//                      solved = false;
//                      message = Math.min(message, 0);
//                   }
//                   for(var item in context.bag) {
//                      if(filter(context.bag[item]) && context.infos.ignoreBag === undefined) {
//                         solved = false;
//                         message = Math.min(message, 2);
//                      }
//                   }
//                }
//             }
//             else {
//                if(context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable === true && obj.canBeOutside !== true; }).length > 0) {
//                   solved = false;
//                   message = Math.min(message, 0);
//                }
//             }
//          }
//       }
      
//       if(solved) {
//          context.success = true;
//          throw(window.languageStrings.messages.successContainersFilled);
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(messages[message]);
//       }
//    },
//    checkBothReachAndCollect: function(context, lastTurn) {
//       var robot = context.getRobot();
//       if(context.isOn(function(obj) { return obj.isExit === true; })) {
//          var solved = true;
//          for(var row = 0;row < context.nbRows;row++) {
//             for(var col = 0;col < context.nbCols;col++) {
//                if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
//                   solved = false;
//                   throw(window.languageStrings.messages.failurePickedAllWithdrawables);
//                }
//             }
//          }
         
//          if(solved) {
//             context.success = true;
//             throw(window.languageStrings.messages.successPickedAllWithdrawables);
//          }
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(window.languageStrings.messages.failureReachExit);
//       }
//    },
//    checkLights: function(context, lastTurn) {
//       var solved = true;
//       for(var row = 0;row < context.nbRows;row++) {
//          for(var col = 0;col < context.nbCols;col++) {
//             if(context.hasOn(row, col, function(obj) { return obj.isLight === true && obj.state === 0; })) {
//                solved = false;
//             }
//          }
//       }
      
//       if(solved) {
//          context.success = true;
//          throw(window.languageStrings.messages.successLights);
//       }
//       if(lastTurn) {
//          context.success = false;
//          throw(window.languageStrings.messages.failureLights);
//       }
//    }
// };

var endConditions = {
   checkScore: function(context, lastTurn) {
      console.log("checkScore",context.display)
      context.removeHighlight();
      context.success = false;
      var { nbPoints, centroidPos, nbClusters, classPoints } = context;

      if(nbClusters != centroidPos.length){
         throw(window.languageStrings.messages.failureNbCentroids);
      }

      for(var ip = 0; ip < nbPoints; ip++){
         if(!classPoints[ip]){
            throw(window.languageStrings.messages.failureMissingItem);
         }
      }

      var { score } = context.updateScore();
      var bestScore  = context.findBestScore();
      var validMargin = 10;
      var scoreAlt = score/nbPoints;
      var bestScoreAlt = bestScore/nbPoints;
      console.log(scoreAlt,bestScoreAlt);
      if(Math.abs(scoreAlt - bestScoreAlt) > validMargin){
         throw(window.languageStrings.messages.failureScore);
      }else{
         context.success = true;
         throw(window.languageStrings.messages.success);
      }

   }
};


// var robotEndFunctionGenerator = {
//    allFilteredPicked: function(filter) {
//       return function(context, lastTurn) {
//          var solved = true;
//          for(var row = 0;row < context.nbRows;row++) {
//             for(var col = 0;col < context.nbCols;col++) {
//                var filtered = context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable && filter(obj); })
//                if(filtered.length != 0) {
//                   solved = false;
//                }
//             }
//          }
         
//          for(var item in context.bag) {
//             if(!filter(context.bag[item])) {
//                context.success = false;
//                throw(window.languageStrings.messages.failureUnfilteredObject);
//             }
//          }
         
//          if(solved) {
//             context.success = true;
//             throw(window.languageStrings.messages.successPickedAllWithdrawables);
//          }
//          if(lastTurn) {
//             context.success = false;
//             throw(window.languageStrings.messages.failurePickedAllWithdrawables);
//          }
//       };
//    },
//    allNumbersWritten: function(numbers) {
//       return function(context, lastTurn) {
//          var solved = true;
//          for(var iNumber in numbers) {
//             var number = numbers[iNumber];
//             var items = context.getItemsOn(number.row, number.col, function(obj) { return obj.value !== undefined; });
//             if(items.length == 0)
//                throw("Error: no number here");
            
//             var expected;
//             if(typeof number.value === "number") {
//                expected = number.value;
//             } else {
//                expected = number.value.bind(context)();
//             }
            
//             if(expected != items[0].value) {
//                solved = false;
//             }
//          }
         
//          if(solved) {
//             context.success = true;
//             throw(window.languageStrings.messages.successNumbersWritten);
//          }
         
//          if(lastTurn) {
//             context.success = false;
//             throw(window.languageStrings.messages.failureNumbersWritten);
//          }
//       };
//    }
// };

var contextParams = {
      none: {
         hideSaveOrLoad: true,
         actionDelay: 200,
         ignoreInvalidMoves: false,
         checkEndEveryTurn: false,
         paperW: 770,
         paperH: 600,
      },
      "k-means": {
         xRange: [0,1000],
         yRange: [0,1000],
         pointR: 5,
         centroidR: 15,
         centroidShapeR: 10,
         classColor: [ "black", "blue", "yellow", "green", "purple", "pink" ],
         classShape: [ "cross", "circle", "square", "diamond", "triangle"],
         pointAttr: {
            stroke: "none",
         },
         crossAttr: {
            "stroke-width": 3,
            "stroke-linecap": "round"
         },
         centroidAttr: {
            shape: {
               "stroke": "none",
               // "stroke-width": 2,
               fill: "none"
            },
            circle: {
               "stroke": "none",
               "stroke-width": 2,
               fill: "none" 
            },
            line: {
               stroke: colors.black,
               "stroke-width": 1,
               "stroke-dasharray": ["-"]
            }
         },
         pointHighlightAttr: {
            stroke: colors.black,
            "stroke-width": 2
         },
         coordinateHighlightAttr: {
            stroke: colors.black,
            "stroke-width": 1,
            "stroke-dasharray": ["-"]
         },
         distanceAttr: {
            line: {
               stroke: colors.black,
               "stroke-width": 1,
               "stroke-dasharray": ["-"]
            },
            text: {
               "font-size": 16,
               // "font-weight": "bold",
               fill: "white"
            },
            back: {
               fill: colors.black,
               r: 3
            }
         },
         checkEndCondition: endConditions.checkScore
      },
   };

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
