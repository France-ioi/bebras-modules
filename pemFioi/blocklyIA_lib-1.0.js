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
               log: "log",
               distance: "distance",
            },
            description: {
               log: "@(msg)",
               distance: "@(x1,y1,x2,y2)",
            },
            messages: {
               noIntegerId: "L'identifiant doit être un entier",
               invalidId: "Identifiant invalide",
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
               showCentroid: "showCentroid",
               showDistance: "showDistance",
               setCluster: "setCluster"
            },
            description: {
               getX: "@(idItem) retourne l'abscisse du point",
               getY: "@(idItem) retourne l'ordonnée du point",
               showCentroid: "@(idCluster,x,y)",
               showDistance: "@(idItem,idCluster)",
               setCluster: "@(idItem,idCluster)"
            },
            messages: {
               maxNbCentroids: function(max) {
                  return "Vous ne pouvez pas placer plus de "+max+" centroïdes"
               },
               noConsecutiveId: function(id,prev) {
                  return "Vous devez placer l'id "+prev+" avant l'id "+id
               },
               outOfRange: function(name,min,max) {
                  return "La valeur de "+name+" doit être comprise entre "+min+" et "+max
               },
               failureNbCentroids: "Le nombre de centroïdes est incorrect",
               failureMissingItem: "Un des points n'a pas de classe",
               failureScore: "La position des centroïdes n'est pas optimisée",
            }
         },
      },
      "knn": {
         fr: {
            label: {

            },
            code: {
               getNbKnownItems: "getNbKnownItems",
               getNbItemsToPredict: "getNbItemsToPredict",
               getNbNeighbors: "getNbNeighbors",
               getDistance: "getDistance",
               getClass: "getClass",
               predictClass: "predictClass",
               highlightItemToPredict: "highlightItemToPredict",
               highlightNearest: "highlightNearest"
            },
            description: {
               getDistance: "@(idItem1,idItem2) retourne la distance entre 2 points",
               getClass: "@(idItem)",
               predictClass: "@(idItem,idClass)",
               highlightItemToPredict: "@(idItem)",
               highlightNearest: "@(idItem1,idItem2)"
            },
            messages: {
               // maxNbCentroids: function(max) {
               //    return "Vous ne pouvez pas placer plus de "+max+" centroïdes"
               // },
               // noIntegerId: "L'identifiant doit être un entier",
               // noConsecutiveId: function(id,prev) {
               //    return "Vous devez placer l'id "+prev+" avant l'id "+id
               // },
               // outOfRange: function(name,min,max) {
               //    return "La valeur de "+name+" doit être comprise entre "+min+" et "+max
               // },
               // invalidId: "Identifiant invalide",
               // failureNbCentroids: "Le nombre de centroïdes est incorrect",
               // failureMissingItem: "Un des points n'a pas de classe",
               // failureScore: "La position des centroïdes n'est pas optimisée",
            }
         },
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
      name: "getNbKnownItems",
      type: "sensors",
      block: { name: "getNbKnownItems", yieldsValue: 'int' },
      func: function(callback) {
         // console.log(context.nbPoints)
         this.callCallback(callback, context.nbKnownItems);
      }
   });

   infos.newBlocks.push({
      name: "getNbItemsToPredict",
      type: "sensors",
      block: { name: "getNbItemsToPredict", yieldsValue: 'int' },
      func: function(callback) {
         // console.log(context.nbPoints)
         this.callCallback(callback, context.nbItemsToPredict);
      }
   });

   infos.newBlocks.push({
      name: "getNbNeighbors",
      type: "sensors",
      block: { name: "getNbNeighbors", yieldsValue: 'int' },
      func: function(callback) {
         // console.log(context.nbPoints)
         this.callCallback(callback, context.k);
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
      name: "getDistance",
      type: "sensors",
      block: { 
         name: "getDistance", 
         params: [null,null],
         yieldsValue: 'int'
      },
      func: function(id1, id2, callback) {
         var { pointData } = context;
         var coo1 = pointData[id1]
         var coo2 = pointData[id2]

         var pos1 = getPosFromCoordinates(coo1);
         var pos2 = getPosFromCoordinates(coo2);
         var d = Beav.Geometry.distance(pos1.x,pos1.y,pos2.x,pos2.y)

         showDist({coo1,coo2 });

         this.callCallback(callback, Math.round(d));
      }
   });

   infos.newBlocks.push({
      name: "getClass",
      type: "sensors",
      block: { 
         name: "getClass", 
         params: [null],
         yieldsValue: 'int'
      },
      func: function(id, callback) {
         var { pointData } = context;
         var dat = pointData[id]

         this.callCallback(callback, dat.class);
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
         var { k, nbPoints, pointData, centroidPos } = context;
         if(!Number.isInteger(idItem) || !Number.isInteger(idCluster)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(idItem >= nbPoints || idItem < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         if(idCluster >= k || idCluster < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         var coo1 = pointData[idItem];
         var pos2 = centroidPos[idCluster];
         var coo2 = getCoordinatesFromPos(pos2);
         showDist({coo1,coo2, showText: true, nearest: false });
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
      name: "predictClass",
      type: "actions",
      block: { 
         name: "predictClass", 
         params: [null,null],
         // yieldsValue: 'int'
      },
      func: function(idItem,idClass,callback) {
         var { nbClusters, nbPoints, pointData } = context;
         if(!Number.isInteger(idItem) || !Number.isInteger(idClass)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(idItem >= nbPoints || idItem < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         if(idClass > nbClusters || idClass < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         console.log(idItem,idClass)
         highlightPoint(idItem);
         pointData[idItem].class = idClass;
         updatePoint(idItem);

         this.callCallback(callback);
      }
   });

   infos.newBlocks.push({
      name: "highlightItemToPredict",
      type: "actions",
      block: { 
         name: "highlightItemToPredict", 
         params: [null],
         // yieldsValue: 'int'
      },
      func: function(idItem,callback) {
         var { nbPoints } = context;
         if(!Number.isInteger(idItem)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(idItem >= nbPoints || idItem < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         if(nearestObj){
            nearestObj.remove();
            nearestObj = null;
         }
         highlightPoint(idItem);

         this.callCallback(callback);
      }
   });

   infos.newBlocks.push({
      name: "highlightNearest",
      type: "actions",
      block: { 
         name: "highlightNearest", 
         params: [null,null],
         // yieldsValue: 'int'
      },
      func: function(id1,id2,callback) {
         var { nbPoints, pointData } = context;
         if(!Number.isInteger(id1) || !Number.isInteger(id2)){
            throw(window.languageStrings.messages.noIntegerId);
         }
         if(id1 >= nbPoints || id1 < 0 || id2 >= nbPoints || id2 < 0){
            throw(window.languageStrings.messages.invalidId);
         }
         var coo1 = pointData[id1]
         var coo2 = pointData[id2]

         showDist({coo1,coo2, nearest: true });


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
   var backObj;
   var frame; // dev
   var centroids = [];
   var points = [];
   var pointHighlight;
   var coordinateHighlight;
   var centroidHighlight;
   var distanceObj;
   var nearestObj;

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
      var { contextType } = infos;

      switch(contextType){
      case "k-means":
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
         break;
      case "knn":
         if(gridInfos) {
            context.nbPoints = gridInfos.nbPoints;
            context.nbClusters = gridInfos.nbClusters;
            context.k = gridInfos.k;
            context.nbItemsToPredict = gridInfos.nbItemsToPredict;
            context.nbKnownItems = context.nbPoints - context.nbItemsToPredict;
         }
         context.allowInfiniteLoop = true;
         if(!context.pointData){
            context.pointData = initPointData();
         }
         break;
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
      var { paperW, paperH, contextType } = infos;
      // var paperRatio = paperW/paperH;
      scale = areaWidth/paperW;

      var paperWidth = paperW * scale;
      var paperHeight = paperH * scale;
      paper.setSize(paperWidth, paperHeight);

      switch(contextType){
      case "k-means":
         initCentroids();
         initPoints();
         
         initCanvas();
         updateCanvas();
         updatePoints();
         break;
      case "knn":
         initBack();
         initPoints();
         updatePoints();
         break;   
      }
   };

   // context.redrawDisplay = function() {
   //    console.log("redrawDisplay")
   //    if(context.display) {
   //       this.raphaelFactory.destroyAll();
   //       if(paper !== undefined)
   //          paper.remove();
   //       paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
   //       // resetBoard();
   //       redisplayAllItems();
   //       context.updateScale();
   //       $("#nbMoves").html(context.nbMoves);
   //    }
   // }

   // context.getInnerState = function() {
   //    console.log("getInnerState")
   //    var removeItemElement = function (item) {
   //       var modifiedItem = Object.assign({}, item);
   //       delete modifiedItem.element;
   //       return modifiedItem;
   //    };
   //    innerState.items = context.items.map(removeItemElement);
   //    innerState.multicell_items = context.multicell_items.map(removeItemElement);
   //    innerState.last_connect = context.last_connect;
   //    innerState.wires = context.wires.map(removeItemElement);
   //    innerState.nbMoves = context.nbMoves;
   //    innerState.time = context.time;
   //    innerState.bag = context.bag.map(removeItemElement);

   //    return innerState;
   // };

   // context.implementsInnerState = function () {
   //    return true;
   // }

   // context.reloadInnerState = function(data) {
   //    innerState = data;
   //    context.items = data.items;
   //    context.multicell_items = data.multicell_items;
   //    context.last_connect = data.last_connect;
   //    context.wires = data.wires;
   //    context.nbMoves = data.nbMoves;
   //    context.time = data.time;
   //    context.bag = data.bag;
   // };

   context.unload = function() {
      if(context.display && paper != null) {
         paper.remove();
      }
   };

   function initPointData() {
      // console.log("initPointData")
      var pointData = [];

      var { contextType } = infos;
      if(contextType == "k-means"){
         var { nbPoints } = context;
         for(var n = 0; n < nbPoints; n++){
            var pos = getRandomPos();
            pointData.push(pos);
         }
      }else

      if(contextType == "knn"){
         var { nbClusters, nbKnownItems, nbPoints } = context;
         for(var n = 0; n < nbKnownItems; n++){
            var pos = getRandomPos();
            pointData.push(pos);
         }
         var centerIDs = [];
         for(var iC = 0; iC < nbClusters; iC++){
            do{
               var id = rng.nextInt(0,nbKnownItems - 1);
            }while(centerIDs.includes(id));
            centerIDs[iC] = id;
            pointData[id].class = iC + 1;
         }
         for(var iP = 0; iP < nbKnownItems; iP++){
            if(centerIDs.includes(iP))
               continue;
            var id = getClosestPoint(iP,centerIDs,pointData);
            pointData[iP].class = pointData[id].class;
         }

         for(var iP = nbKnownItems; iP < nbPoints; iP++){
            var pos = getRandomPos();
            pos.class = 0;
            pointData[iP] = pos;
         }
         // console.log(centerIDs)
      }

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

   function initBack() {
      // console.log("initCanvas")
      if(backObj)
         backObj.remove();
      var { xPointArea, yPointArea, pointAreaW, pointAreaH, backAttr } = infos;
      var x = xPointArea*scale;
      var y = yPointArea*scale;
      var w = pointAreaW*scale;
      var h = pointAreaH*scale;
      backObj = paper.rect(x,y,w,h).attr(backAttr);
   };

   function initPoints() {
      // console.log("initPoints")
      var { nbPoints, pointData, nbClusters } = context;
      var { pointR, classShape, classColor, pointAttr, crossAttr,
         xPointArea, yPointArea, pointAreaW, pointAreaH, contextType } = infos;

      // if(frame)
      //    frame.remove();
      // frame = paper.rect(xPointArea*scale,yPointArea*scale,pointAreaW*scale,pointAreaH*scale);
      
      var nbClass = nbClusters + 1;
      for(var iP = 0; iP < nbPoints; iP++){
         if(!points[iP])
            points[iP] = [];
         var pos = pointData[iP];
         var x = pos.x*scale;
         var y = pos.y*scale;

         for(var iC = 0; iC < nbClass; iC++){
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
      var { xPointArea, yPointArea, pointAreaW, pointAreaH, contextType } = infos;
      var x = xPointArea*scale;
      var y = yPointArea*scale;
      var w = pointAreaW*scale;
      var h = pointAreaH*scale;
      var { classPoints, nbClusters, pointData } = context;
      if(contextType == "k-means"){
         var cla = classPoints[iP] || 0;
      }else{
         var cla = pointData[iP].class;
      }
      var nbClass = nbClusters + 1;
      // console.log("updatePoint",iP,cla)
      for(var iC = 0; iC < nbClass; iC++){
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

   function getClosestPoint(id,pool,pointData) {
      var coo1 = pointData[id];
      var pos1 = getPosFromCoordinates(coo1);
      var minD = Infinity;
      var closest;
      for(var ip = 0; ip < pool.length; ip++){
         var id2 = pool[ip];
         var coo2 = pointData[id2];
         var pos2 = getPosFromCoordinates(coo2);
         var d = Beav.Geometry.distance(pos1.x,pos1.y,pos2.x,pos2.y);
         // console.log(d,pos1,pos2)
         if(d < minD){
            minD = d;
            closest = id2;
         }
      }
      return closest
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

   function showDist(params) {
      // console.log("showDist",context.display)
      if(!context.display)
         return
      var { coo1, coo2, showText, nearest } = params;
      if(coordinateHighlight){
         coordinateHighlight.remove();
         coordinateHighlight = null;
      }
      if(distanceObj){
         distanceObj.remove();
         distanceObj = null;
      }

      var a = (nearest) ? infos.nearestAttr : infos.distanceAttr;
      
      var x1 = coo1.x*scale;
      var y1 = coo1.y*scale;

      var x2 = coo2.x*scale;
      var y2 = coo2.y*scale;

      var line = paper.path(["M",x1,y1,"L",x2,y2]).attr(a.line);

      var obj;
      if(showText){
         var pos1 = getPosFromCoordinates(coo1);
         var pos2 = getPosFromCoordinates(coo2);
         // console.log(pos1,pos2)
         var d = Math.round(Beav.Geometry.distance(pos1.x,pos1.y,pos2.x,pos2.y));
         var xt = (x1 + x2)/2;
         var yt = (y1 + y2)/2;
         var text = paper.text(xt,yt,d).attr(a.text);
         var bbox = text.getBBox();
         var back = paper.rect(bbox.x - 2,bbox.y - 2,bbox.width + 4,bbox.height + 4).attr(a.back);
         text.toFront();
         obj = paper.set(line,back,text);
      }else{
         obj = line;
      }

      if(nearest){
         if(!nearestObj)
            nearestObj = paper.set();
         nearestObj.push(obj);
      }else{
         distanceObj = obj;
      }
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
      knn: {
         xRange: [0,1000],
         yRange: [0,1000],
         pointR: 5,
         classColor: [ "black", "blue", "yellow", "green", "purple", "pink" ],
         classShape: [ "cross", "circle", "square", "diamond", "triangle"],
         pointAttr: {
            stroke: "none",
         },
         crossAttr: {
            "stroke-width": 3,
            "stroke-linecap": "round"
         },
         backAttr: {
            "stroke": "none",
            fill: colors.grey
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
         nearestAttr: {
            line: {
               stroke: colors.black,
               "stroke-width": 2,
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
