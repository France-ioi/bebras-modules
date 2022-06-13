
var imgPath = modulesPath+"img/algorea/";

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
            label: {
               left: "déplacer vers la gauche",
               right: "déplacer vers la droite",
               take: "prendre",
               drop: "déposer"               
            },
            code: {
               left: "deplacerGauche",
               right: "deplacerDroite",
               take: "prendre",
               drop: "deposer"
            },
            description: {
               left: "déplacerGauche() fait se déplacer la grue d'une case vers la gauche",
               right: "déplacerDroite() fait se déplacer la grue d'une case vers la droite",
            },
            messages: {
               outside: "La grue ne peut pas aller plus loin dans cette direction !",
               success: "Bravo, vous avez réussi !",
               failure: "Vous n'avez pas atteint l'objectif",
               nothingToTake: "Il n'y a pas de bloc dans cette colonne !",
               notMovable: "Ce bloc ne peut pas être déplacé",
               holdingBlock: "La grue ne peut pas prendre plus d'un bloc en même temps",
               emptyCrane: "La grue ne porte pas de bloc",
               cannotDrop: "Vous ne pouvez pas déposer de bloc dans cette colonne",
               failureMissing: "La case encadrée en rouge est vide alors qu'elle devrait contenir un bloc",
               failureWrongBlock: "La case encadrée en rouge ne contient pas le bon bloc",
               failureUnwanted: "La case encadrée en rouge contient un bloc alors qu'elle devrait être vide"
            },
            startingBlockName: "Programme du robot"
         }
      },
      default: {
         fr: {
            label: {
            },
            code: {
            },
            messages: {
            }
         }
      }
   };
   
   var contextParams = {
      none: {
         hideSaveOrLoad: true,
         actionDelay: 200,
         ignoreInvalidMoves: false,
         checkEndEveryTurn: false,
         cellSide: 60
      },
      default: {
         cellAttr: {
            stroke: "grey",
            "stroke-width": 1,
            fill: "lightblue"
         },
         contAttr: {
            stroke: "white",
            "stroke-width": 0,
            fill: "lightgrey"
         },
         contOutlineAttr: {
            "stroke-width": 3,
            stroke: "black",
            fill: "none"
         },
         craneAttr: {
            wheelsPosY: 13, // for line clip
            wheelsOffsetX: 12.5,
            wheelsW: 85,
            wheelsH: 60,
            clawsAxisPos: 33,
            clawsPos: 27,
            clawW: 40,
            clawH: 33,
            clawOffset: 5,
            clutchAngle: 20,
            craneItemOffset: 10
         },
         craneSrc: {
            rail: imgPath+"crane/rail.png",
            wheels: imgPath+"crane/wheels.png",
            line: imgPath+"crane/line.png",
            leftClaw: imgPath+"crane/left_claw.png",
            rightClaw: imgPath+"crane/right_claw.png"
         },
         itemTypes: {
            circle: { num: 2, img: imgPath+"card_roundDotted.png", side: 60, isMovable: true, zOrder: 1 },
            square: { num: 3, img: imgPath+"card_squareQuadrille.png", side: 60, isMovable: true, zOrder: 1},
            triangle: { num: 4, img: imgPath+"card_triangleStriped.png", side: 60, isMovable: true, zOrder: 1}
         },
         checkEndCondition: robotEndConditions.dev
      },
      sciFi: {
         backgroundElements: [
            { 
               img: "background.png",
               width: 1,   // % of total width if relative
               height: 1,
               x: 0,
               y: 0,
               relative: true
            },
            { 
               img: "cloud_1.png",
               width: 200*0.7,
               height: 50*0.7,
               x: 0.8,
               y: 0.3
            },
            { 
               img: "cloud_2.png",
               width: 225*0.7,
               height: 103*0.7,
               x: -0.1,
               y: 0.1
            },
            { 
               img: "cloud_3.png",
               width: 117*0.7,
               height: 41*0.7,
               x: 0.4,
               y: 0.8
            },
         ],
         cellAttr: {
            stroke: "#525252",
            "stroke-width": 0.2,
            fill: "none"
         },
         contAttr: {
            stroke: "white",
            "stroke-width": 0,
            fill: "lightgrey"
         },
         contOutlineAttr: {
            "stroke-width": 3,
            stroke: "black",
            fill: "none"
         },
         labelFrameAttr: {
            stroke: "none",
            fill: "#043565",
            r: 3
         },
         labelAttr: {
            fill: "white",
            "font-weight": "bold"
         },
         labelSize: 0.3, // % of cellSize
         labelFrameSize: 0.5,
         craneAttr: {
            wheelsPosY: 13, // for line clip
            wheelsOffsetX: -30,
            wheelsOffsetY: 2,
            wheelsW: 120,
            wheelsH: 42,
            shaftW: 13,
            shaftH: 17,
            shaftOffsetY: 50,
            shaftOffsetX: 23.5,
            clawW: 20,
            clawH: 24,
            clawsOffsetY: 56,
            leftClawOffsetX: 11,
            rightClawOffsetX: 29,
            leftClawCx: 27,
            leftClawCy: 60,
            rightClawCx: 33,
            rightClawCy: 60,
            clutchAngle: 30,
            craneItemOffset: 12
         },
         craneSrc: {
            rail: imgPath+"crane/rail.png",
            wheels: "crane_wheels.png",
            line: "crane_line.png",
            leftClaw: "crane_left_claw_open.png",
            rightClaw: "crane_right_claw_open.png",
            shaft: "crane_shaft.png",
         },
         craneZOrder: {
            wheels: 1,
            line: 0,
            leftClaw: 2,
            rightClaw: 0,
            shaft: 1,
            item: 1
         },
         itemTypes: {
            tower_1: { num: 2, img: "tower_1.png", side: 60, isMovable: true, zOrder: 1, catchOffsetY: 28 },
            tower_2: { num: 3, img: "tower_2.png", side: 60, isMovable: true, zOrder: 1 },
            tower_3: { num: 4, img: "tower_3.png", side: 60, isMovable: true, zOrder: 1},
            tower_4: { num: 5, img: "tower_4.png", side: 60, isMovable: true, zOrder: 1},
            tower_5: { num: 6, img: "tower_5.png", side: 60, isMovable: true, zOrder: 1},
            tower_6: { num: 7, img: "tower_6.png", side: 60, isMovable: true, zOrder: 1},
            tower_7: { num: 8, img: "tower_7.png", side: 60, isMovable: true, zOrder: 1},
            tower_8: { num: 9, img: "tower_8.png", side: 60, isMovable: true, zOrder: 1},
            tower_9: { num: 10, img: "tower_9.png", side: 60, isMovable: true, zOrder: 1},
            tower_10: { num: 11, img: "tower_10.png", side: 60, isMovable: true, zOrder: 1},
            tower_11: { num: 12, img: "tower_11.png", side: 60, isMovable: true, zOrder: 1},
            tower_12: { num: 13, img: "tower_12.png", side: 60, isMovable: true, zOrder: 1},
         },
         checkEndCondition: robotEndConditions.dev
      },
   };


   // var craneRailSrc = imgPath+"crane/rail.png";
   // var craneWheelsSrc = imgPath+"crane/wheels.png";
   // var craneLineSrc = imgPath+"crane/line.png";
   // var craneLeftClawSrc = imgPath+"crane/left_claw.png";
   // var craneRightClawSrc = imgPath+"crane/right_claw.png";
   // var cloudSrc = imgPath+"crane/cloud.png";


   var iconSrc = $("img[src$='icon.png']").attr("src");
   var imgPrefix = iconSrc.substring(0, iconSrc.length - 8);
   function imgUrlWithPrefix(url) {
      return /^https?:\/\//.exec(url) ? url : imgPrefix + url;
   }
   
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
   
   // infos.newBlocks.push({
   //    name: "wait",
   //    type: "actions",
   //    block: { name: "wait" },
   //    func: function(callback) {
   //       this.advanceTime(1);
   //       this.waitDelay(callback);
   //    }
   // });
   
   infos.newBlocks.push({
      name: "left",
      type: "actions",
      block: { name: "left" },
      func: function(callback) {
         this.shiftCrane(-1,callback);
      }
   });

   infos.newBlocks.push({
      name: "right",
      type: "actions",
      block: { name: "right" },
      func: function(callback) {
         this.shiftCrane(1,callback);
      }
   });

   infos.newBlocks.push({
      name: "take",
      type: "actions",
      block: { name: "take" },
      func: function(callback) {
         this.take(callback);
      }
   });

   infos.newBlocks.push({
      name: "drop",
      type: "actions",
      block: { name: "drop" },
      func: function(callback) {
         this.drop(callback);
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
   
   var cells = [];
   var colsLabels = [];
   var rowsLabels = [];
   var contLabels = [];
   var contOutline;

   var crane = {};
   var craneH = 1.5; // as rows
   var { 
      wheelsPosY, 
      wheelsOffsetX, wheelsOffsetY, 
      wheelsW, 
      wheelsH,
      shaftW, shaftH,
      shaftOffsetY, shaftOffsetX,
      clawW, clawH, 
      clawsOffsetY,
      leftClawOffsetX, rightClawOffsetX,
      leftClawCx, leftClawCy,
      rightClawCx, rightClawCy,
      clutchAngle, 
      craneItemOffset } = infos.craneAttr;
   // var { 
   //    craneRailSrc, 
   //    craneWheelsSrc, 
   //    craneLineSrc, 
   //    craneLeftClawSrc, 
   //    craneRightClawSrc } = infos.craneSrc;

   context.highlightAttr = {
      stroke: "red",
      "stroke-width": 3
   };

   var paper;

   var scale = 1;
   
   if(infos.leftMargin === undefined) {
      infos.leftMargin = 10;
   }
   if(infos.rightMargin === undefined) {
      infos.rightMargin = 10;
   }
   if(infos.topMargin === undefined) {
      infos.topMargin = 10;
   }
   if(infos.bottomMargin === undefined) {
      if(infos.showLabels || infos.showContLabels) {
         infos.bottomMargin = 10;
      }
      else {
         infos.bottomMargin = infos.cellSide / 2;
      }
   }
   if (infos.showLabels && infos.rowLabelEnabled) {
      infos.rightMargin += infos.cellSide;
   }
   if (infos.showLabels || infos.showContLabels) {
      infos.bottomMargin += infos.cellSide;
   }

   
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
      if(gridInfos) {
         context.tiles = gridInfos.tiles;
         context.container = gridInfos.container || [];
         context.initItems = gridInfos.initItems;
         context.nbRows = context.tiles.length;
         context.nbCols = context.tiles[0].length;
         context.nbRowsCont =  context.container.length;
         context.nbColCont =  (context.nbRowsCont > 0) ? context.container[0].length : 0;
         context.initCranePos = gridInfos.initCranePos || 0;
         context.target = gridInfos.target || [];
      }
      context.cranePos = context.initCranePos;
      context.craneContent = null;
      
      context.items = [];
      context.multicell_items = [];
      
      context.last_connect = undefined;
      context.wires = [];
      
      context.lost = false;
      context.success = false;
      context.nbMoves = 0;
      context.time = 0;
      context.animate = true;
      // context.animate = false;
      
      if(infos.bagInit != undefined) {
         for(var i = 0;i < infos.bagInit.count;i++) {
            var item = {};
            
            var initItem = infos.itemTypes[infos.bagInit.type];
            
            item.type = infos.bagInit.type;
            item.side = 0;
            item.offsetX = 0;
            item.offsetY = 0;
            item.nbStates = 1;
            item.zOrder = 0;
            for(var property in initItem) {
               item[property] = initItem[property];
            }
            
            context.bag.push(item);
         }
      }
      
      if(context.display) {
         this.delayFactory.destroyAll();
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         var paperW = infos.cellSide * (context.nbCols + context.nbColCont) * scale;
         var paperH = infos.cellSide * (Math.max(context.nbRows,context.nbRowsCont)  + craneH) * scale;
         paper = this.raphaelFactory.create("paperMain", "grid", paperW, paperH);
         context.paper = paper;
         resetBoard();
         resetItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);
      }else{
         resetItems();
      }
   };

   context.redrawDisplay = function() {
      // console.log("redrawDisplay",context.display)
      if(context.display) {
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         var paperW = infos.cellSide * (context.nbCols + context.nbColCont) * scale;
         var paperH = infos.cellSide * Math.max(context.nbRows,context.nbRowsCont) * scale;
         paper = this.raphaelFactory.create("paperMain", "grid", paperW, paperH);
         resetBoard();
         // console.log("redrawDisplay")
         redisplayAllItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);
      }
   }

   context.getInnerState = function() {
      return {
         items: context.items,
         multicell_items: context.multicell_items,
         last_connect: context.last_connext,
         wires: context.wires,
         nbMoves: context.nbMoves,
         time: context.time,
         bag: context.bag,
      };
   };

   context.implementsInnerState = function () {
      return true;
   }

   context.reloadInnerState = function(data) {
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

   context.highlightCells = function(cellPos) {
      var p = context.paper;
      var scale = context.scale;
      var cSide = infos.cellSide;
      // console.log(infos)
      
      context.highlights = [];
      for(var pos of cellPos){
         var { row, col } = pos;
         // var x = (cSide * col + infos.leftMargin) * scale;
         // var y = (cSide * (craneH + row) + infos.topMargin) * scale;
         var { x, y } = context.getCellCoord(row,col);
         var obj = p.rect(x,y,cSide*scale,cSide*scale).attr(context.highlightAttr);
         context.highlights.push({ row, col, obj });
      }
   };

   context.getCellCoord = function(row,col) {
      var scale = context.scale;
      var cSide = infos.cellSide;
      var x = (cSide * col + infos.leftMargin) * scale;
      var y = (cSide * (craneH + row) + infos.topMargin) * scale;
      return { x, y }
   };
   
   var itemAttributes = function(item) {
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var itemType = infos.itemTypes[item.type];
      
      var x0 = (infos.leftMargin /*+ infos.cellSide * nbColCont*/)*scale;
      var x = x0 + (infos.cellSide * item.col + item.offsetX)* scale;
      var y0 = (infos.topMargin + infos.cellSide * craneH)*scale;
      var y = y0 + (infos.cellSide * item.row + (item.side - infos.cellSide) + item.offsetY) * scale;
      if(context.nbRows < nbRowsCont){
         y += infos.cellSide*(nbRowsCont - context.nbRows) * scale;
      }

      // var xClip = x;

      // var clipRect = "" + xClip + "," + y + "," + (item.side * scale) + "," + (item.side * scale);
      // if((!itemType.img && !item.img) && (!itemType.color && !item.color)) {
      //    x += item.side * scale / 2;
      //    y += item.side * scale / 2;
      // }
      
      var ret = {x: x, y: y, width: item.side * item.nbStates * scale, height: item.side * scale/*, "clip-rect": clipRect*/};
      return ret;
   };

   function getCraneAttr() {
      var cSide = infos.cellSide;
      var w = cSide*scale, h = w;
      var y = infos.topMargin*scale;
      var cranePos = context.cranePos;
      var nbRowsCont = context.nbRowsCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var x = infos.leftMargin*scale + w*cranePos;
      var xWheels = x + wheelsOffsetX*scale;
      var yWheels = y + wheelsOffsetY*scale;

      var lineH = nbRows + craneH;
      var y0Line = infos.topMargin*scale;
      var yLineClip1 = (infos.topMargin + wheelsPosY)*scale;
      var yLineClip2 = (infos.topMargin + shaftOffsetY + 2)*scale;
      var hClip = yLineClip2 - yLineClip1;
      var lineClip = [x,yLineClip1,w,hClip];

      var xShaft = x + shaftOffsetX*scale;
      var yShaft = y + shaftOffsetY*scale;

      var xLeftClaw = x + leftClawOffsetX*scale;
      var xRightClaw = x + rightClawOffsetX*scale;
      var yClaws = (infos.topMargin + clawsOffsetY)*scale;

      // var cx = x + w/2;
      // var cy = yLineClip2;
      var cxLeft = x + leftClawCx*scale;
      var cyLeft = y + leftClawCy*scale;
      var cxRight = x + rightClawCx*scale;
      var cyRight = y + rightClawCy*scale;

      return { x, y, w, h, xWheels, yWheels, y0Line, lineClip, 
         xShaft, yShaft, yClaws, xLeftClaw, xRightClaw, 
         cxLeft, cyLeft, cxRight, cyRight }
   };

   function setCraneAttr(attr) {
      var cSide = infos.cellSide;
      var x = attr.x, y = attr.y;
      var width = attr.w, height = attr.h;
      crane.wheels.attr({ x: attr.xWheels, y: attr.yWheels, width: wheelsW*scale, height: wheelsH*scale });
      for(var iRow = 0; iRow < crane.line.length; iRow++){
         var yLine = attr.y0Line + iRow*cSide*scale;
         crane.line[iRow].attr({x, y: yLine, width, height });
      }
      crane.line.attr("clip-rect",attr.lineClip);
      crane.shaft.attr({
         x: attr.xShaft, 
         y: attr.yShaft, 
         width: shaftW*scale, 
         height: shaftH*scale 
      })
      crane.leftClaw.attr({ 
         x: attr.xLeftClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale 
      });
      crane.rightClaw.attr({ 
         x: attr.xRightClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale 
      });

      if(context.craneContent){
         var item = context.craneContent;
         // console.log(item)
         var angle = clutchAngle;
         crane.leftClaw.transform(["R",-angle,attr.cxLeft,attr.cyLeft]);
         crane.rightClaw.transform(["R",angle,attr.cxRight,attr.cyRight]);
         var elem = item.element;
         var newY = attr.yClaws + (craneItemOffset + item.offsetY)*scale;
         if(item.catchOffsetY){
            newY -= item.catchOffsetY*scale;
         }
         elem.attr({ x, y: newY });
      }else{
         crane.leftClaw.transform("");
         crane.rightClaw.transform("");
      }
      // crane.wheels.toFront();
      // crane.leftClaw.toFront();
      resetCraneZOrder();
   };
   
   var resetBoard = function() {
      if(infos.backgroundElements && infos.backgroundElements.length > 0){
         var bgElem = infos.backgroundElements;
         context.background = [];
         for(var elem of bgElem){
            if(elem.img){
               context.background.push(paper.image(elem.img,0,0,0,0));
            }
         }
         // context.background = paper.rect(0,0,0,0).attr(backgroundAttr);
      }
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      for(var iRow = 0;iRow < nbRows;iRow++) {
         cells[iRow] = [];
         var tileRow = (context.nbRows >= nbRowsCont) ? iRow : iRow - (nbRowsCont - context.nbRows);
         var contRow = (context.nbRows >= nbRowsCont) ? iRow - (context.nbRows - nbRowsCont) : iRow;
         for(var iCol = 0;iCol < nbCol;iCol++) {
            var tileCol = iCol - nbColCont;
            cells[iRow][iCol] = paper.rect(0, 0, 10, 10);
            if(tileRow >= 0 && tileCol >= 0 && context.tiles[tileRow][tileCol] != 0){
               cells[iRow][iCol].attr(infos.cellAttr);
            }else if(contRow >= 0 && iCol < nbColCont){
               cells[iRow][iCol].attr(infos.contAttr);
            }else{
               cells[iRow][iCol].attr({'fill': "none", 'stroke': "none"});
            }            
         }
      }
      if(infos.showContOutline){
         contOutline = paper.path("").attr(infos.contOutlineAttr);
      }
      if(infos.showLabels) {
         if(infos.rowLabelEnabled){
            for(var iRow = 0;iRow < context.nbRows;iRow++) {
               rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
            }
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            if(!infos.labelFrameAttr){
               colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
            }else{
               // colsLabels[iCol] = paper.set();
               var frame = paper.rect(0,0,0,0).attr(infos.labelFrameAttr);
               var text = paper.text(0, 0, (iCol + 1));
               colsLabels[iCol] = [frame,text];
            }
         }
      }
      if(infos.showContLabels) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            contLabels[iCol] = paper.text(0, 0, String.fromCharCode(iCol + 65));
         }
      }
      // context.cells = cells;

      resetCrane();
   };

   function resetCrane() {
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var src = infos.craneSrc;
      crane.rail = paper.set();
      for(var iCol = 0; iCol < nbCol; iCol++){
         crane.rail.push(paper.image(src.rail,0,0,0,0));
      }
      paper.setStart();
      crane.wheels = paper.image(src.wheels,0,0,0,0);
      var lineH = nbRows + craneH;
      crane.line = paper.set();
      for(var iRow = 0; iRow < lineH; iRow++){
         crane.line.push(paper.image(src.line,0,0,0,0));
      }
      crane.leftClaw = paper.image(src.leftClaw,0,0,0,0);
      crane.rightClaw = paper.image(src.rightClaw,0,0,0,0);
      crane.shaft = paper.image(src.shaft,0,0,0,0);
      crane.all = paper.setFinish();
      resetCraneZOrder();
   };
   
   var resetItem = function(initItem, redisplay) {
      if(redisplay === undefined)
         redisplay = true;
      var item = {};
      context.items.push(item);
      for(var property in initItem) {
         item[property] = initItem[property];
      }
      
      item.side = 0;
      item.offsetX = 0;
      item.offsetY = 0;
      item.nbStates = 1;
      item.zOrder = 0;
      for(var property in infos.itemTypes[item.type]) {
         item[property] = infos.itemTypes[item.type][property];
      }
      
      if(context.display && redisplay) {
         redisplayItem(item,false,"resetItem");
      }
   };
   
   var resetItems = function() {
      context.items = [];
      var itemTypeByNum = {};
      for(var type in infos.itemTypes) {
         var itemType = infos.itemTypes[type];
         if(itemType.num != undefined) {
            itemTypeByNum[itemType.num] = type;
         }
      }
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var rowShift = (context.nbRows >= nbRowsCont) ? 0 : (nbRowsCont - context.nbRows);
      for(var iRow = 0;iRow < context.nbRows;iRow++) {
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var itemTypeNum = context.tiles[iRow][iCol];
            if(itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow + rowShift,
                  col: iCol + nbColCont,
                  type: itemTypeByNum[itemTypeNum]
               }, false);
            }
            var targetNum = context.target[iRow][iCol];
            if(itemTypeByNum[targetNum] != undefined) {
               resetItem({
                  row: iRow + rowShift,
                  col: iCol + nbColCont,
                  type: itemTypeByNum[targetNum],
                  target: true
               }, false);
            }
         }
      }
      var rowShift = (context.nbRows <= nbRowsCont) ? 0 : (context.nbRows - nbRowsCont);
      for(var iRow = 0;iRow < nbRowsCont;iRow++) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            var itemTypeNum = context.container[iRow][iCol];
            if(itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow + rowShift,
                  col: iCol,
                  type: itemTypeByNum[itemTypeNum]
               }, false);
            }
            if(context.target.length == 0){
               continue
            }
         }
      }
      for(var iItem = context.initItems.length - 1;iItem >= 0;iItem--) {
         resetItem(context.initItems[iItem], false);
      }
      
      if(context.display){
         redisplayAllItems();
      }
   };
   
   var resetItemsZOrder = function(row, col) {
      // console.log("resetZOrder")
      var cellItems = [];
      for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
         var item = context.items[iItem];
         if((item.row == row) && (item.col == col)) {
            cellItems.push(item);
         }
      }
      sortCellItems(cellItems);
   };

   function sortCellItems(cellItems) {
      cellItems.sort(function(itemA, itemB) {
         if(itemA.zOrder < itemB.zOrder || itemA.target) {
            return -1;
         }
         if(itemA.zOrder > itemB.zOrder && !itemA.target) {
            return 1;
         }
         if(itemB.target){
            return 1
         }
         return 0;
      });
      for(var iItem = 0;iItem < cellItems.length;iItem++) {
         if(cellItems[iItem].element)
            cellItems[iItem].element.toFront();
      }
   }; 

   var resetCraneZOrder = function() {
      // console.log("resetZOrder")
      var elem = [];
      for(var elemName in infos.craneZOrder) {
         var val = infos.craneZOrder[elemName];
         if(context.craneContent && elemName == "item"){
            var obj = context.craneContent.element;
         }else{
            var obj = crane[elemName];
         }
         elem.push({ zOrder: val, element: obj });
      }
      sortCellItems(elem);
   };

   var redisplayItem = function(item, resetZOrder) {
      if(context.display !== true)
         return;
      if(resetZOrder === undefined)
         resetZOrder = true;
      
      if(item.element !== undefined) {
         item.element.remove();
      }
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var itemType = infos.itemTypes[item.type];

      var x0 = (infos.leftMargin /*+ infos.cellSide * nbColCont*/)*scale;
      var x = x0 + (infos.cellSide * item.col + item.offsetX)* scale;
      var y0 = (infos.topMargin + infos.cellSide * craneH)*scale;
      var y = y0 + (infos.cellSide * item.row + (item.side - infos.cellSide) + item.offsetY) * scale;
      if(context.nbRows < nbRowsCont){
         y += infos.cellSide*(nbRowsCont - context.nbRows) * scale;
      }
      // console.log(item.type, item.row, item.col)

      if(item.customDisplay !== undefined) {
      	item.customDisplay(item);
      }
      
      if(item.img) {
         var src = (item.target && item.targetImg) ? imgUrlWithPrefix(item.targetImg) : imgUrlWithPrefix(item.img);
         item.element = paper.image(src, x, y, item.side * item.nbStates * scale, item.side * scale);
         if(item.target && !item.targetImg){
            item.element.attr("opacity",0.3);
         }
      }else if(item.value !== undefined) {
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
   
   context.updateScale = function() {
      // console.log("updateScale")
      if(!context.display) {
         return;
      }
      if(paper == null) {
         return;
      }
      
      if(window.quickAlgoResponsive) {
         var areaWidth = Math.max(200, $('#grid').width()-24);
         var areaHeight = Math.max(150, $('#grid').height()-24);
      } else {
         var areaWidth = 400;
         var areaHeight = 600;
      }

      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var cSide = infos.cellSide;

      var newCellSide = 0;
      if(context.nbCols && context.nbRows) {
         var marginAsCols = (infos.leftMargin + infos.rightMargin) / cSide;
         var marginAsRows = (infos.topMargin + infos.bottomMargin) / cSide;
         newCellSide = Math.min(cSide, Math.min(areaWidth / (nbCol + marginAsCols), areaHeight / (nbRows + craneH + marginAsRows)));
      }
      scale = newCellSide / cSide;
      context.scale = scale;
      var paperWidth = (cSide * nbCol + infos.leftMargin + infos.rightMargin)* scale;
      var paperHeight = (cSide * (nbRows + craneH) + infos.topMargin + infos.bottomMargin)* scale;
      paper.setSize(paperWidth, paperHeight);

      var x0 = infos.leftMargin*scale;
      var y0 = (infos.topMargin + craneH*cSide)*scale;

      if(infos.backgroundElements && infos.backgroundElements.length > 0){
         var bgElem = infos.backgroundElements;
         var gridWidth = nbCol*cSide*scale;
         var gridHeight = nbRows*cSide*scale;
         var clipRect = [x0,y0,gridWidth,gridHeight];
         for(var iElem = 0; iElem < bgElem.length; iElem++){
            var dat = bgElem[iElem];
            var obj = context.background[iElem];
            // var x = infos.leftMargin*scale + dat.x*gridWidth;
            var x = dat.x*paperWidth;
            // var y = (infos.topMargin + craneH*cSide)*scale + dat.y*gridHeight;
            var y = dat.y*paperHeight;
            // var width = (dat.relative) ? dat.width*gridWidth : dat.width*scale;
            var width = (dat.relative) ? dat.width*paperWidth : dat.width*scale;
            // var height = (dat.relative) ? dat.height*gridHeight : dat.height*scale;
            var height = (dat.relative) ? dat.height*paperHeight : dat.height*scale;
            // obj.attr({ x, y, width, height,"clip-rect": clipRect });
            obj.attr({ x, y, width, height });
         }
      }

      for(var iRow = 0;iRow < nbRows;iRow++) {
         for(var iCol = 0;iCol < nbCol;iCol++) {
            if(cells[iRow][iCol] === undefined)
               continue;
            // var x = (cSide * iCol + infos.leftMargin) * scale;
            // var y = (cSide * (craneH + iRow) + infos.topMargin) * scale;
            var { x, y } = this.getCellCoord(iRow,iCol);
            cells[iRow][iCol].attr({x: x, y: y, width: cSide * scale, height: cSide * scale});
         }
      }
      if(infos.showContOutline && nbRowsCont > 0){
         var x1 = infos.leftMargin * scale;
         var x2 = (infos.leftMargin + nbColCont*cSide) * scale;
         var y1 = (nbRowsCont >= context.nbRows) ? (infos.topMargin + craneH*cSide) * scale : (infos.topMargin + (context.nbRows - nbRowsCont + craneH ) * cSide) * scale;
         var y2 = y1 + nbRowsCont * cSide * scale;
         contOutline.attr("path",["M",x1,y1,"V",y2,"H",x2,"V",y1]);
      }
      var textFontSize = {"font-size": cSide * scale / 2};
      if(infos.showLabels) {
         var labelAttr = infos.labelAttr || textFontSize;
         if(infos.rowLabelEnabled){
            for(var iRow = 0;iRow < context.nbRows;iRow++) {
               var x = (infos.leftMargin + nbCol*cSide + infos.rightMargin - cSide / 2) * scale;
               var y = (cSide * (iRow + 0.5 + craneH) + infos.topMargin) * scale;
               rowsLabels[iRow].attr({x: x, y: y}).attr(labelAttr);
            }
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var x = (cSide * (iCol + nbColCont) + infos.leftMargin + cSide / 2) * scale;
            var y = (infos.topMargin + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin) * scale;
            if(!infos.labelFrameAttr){
               colsLabels[iCol].attr({x: x, y: y}).attr(labelAttr);
            }else{
               var frSize = infos.labelFrameSize*cSide*scale;
               var labelSize = infos.labelSize*cSide*scale;
               var xFr = x - frSize/2;
               var yFr = y - frSize/2;
               var yLabel = yFr + frSize/2;
               colsLabels[iCol][0].attr({x: xFr, y: yFr, width: frSize, height: frSize});
               colsLabels[iCol][1].attr({x, y, "font-size": labelSize}).attr(labelAttr);
            }
         }
      }
      if(infos.showContLabels) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            var x = (cSide * iCol + infos.leftMargin + cSide / 2) * scale;
            var y = (infos.topMargin + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin) * scale;
            contLabels[iCol].attr({x: x, y: y}).attr(labelAttr);
         }
      }
      // console.log("updateScale")
      redisplayAllItems();      

      /* crane */
      var w = cSide*scale, h = w;
      var y = infos.topMargin*scale;
      for(var iCol = 0; iCol < nbCol; iCol++){
         var x = (cSide*iCol + infos.leftMargin)*scale;
         crane.rail[iCol].attr({ x, y, 
            width: w, height: h
         });
      }
      var craneAttr = getCraneAttr();
      setCraneAttr(craneAttr);

      /* highlights */
      if(context.highlights){
         for(var dat of context.highlights){
            var { row, col, obj } = dat;
            var width = cSide*scale, height = w;
            var { x, y } = this.getCellCoord(row,col);
            obj.attr({ x, y, width, height });
         }
      }
   };
   
   var redisplayAllItems = function() {
      // console.log("redisplayAllItems")
      if(context.display !== true)
         return;
      for(var iItem = 0;iItem < context.items.length;iItem++) {
         var item = context.items[iItem];
         redisplayItem(item, false,"redisplayAllItems");
      }
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         item.redisplay();
      }
      if(context.craneContent){
         redisplayItem(context.craneContent, false,"redisplayAllItems");
      }
      
      var cellItems = [];
      
      for(var iItem = context.items.length - 1;iItem >= 0;iItem--) {
         var item = context.items[iItem];
         cellItems.push(item);
      }
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         cellItems.push(item);
      }
      sortCellItems(cellItems);
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
         
         // var robot = this.getRobot();
         // if(this.hasOn(robot.row, robot.col, function(item) { return item.isProjectile === true; })) {
         //    throw(context.strings.messages.failureProjectile);
         // }
      }
   };
   
   // context.getRobotId = function() {
   //    for(var id in context.items) {
   //       if(context.items[id].isRobot != undefined) {
   //          return id;
   //       }
   //    }
   //    return undefined;
   // };
   
   // context.getRobot = function() {
   //    return context.items[context.getRobotId()];
   // };
   
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

   context.shiftCrane = function(dir,callback) {
      var newPos = context.cranePos + dir;
      var ttg = context.tryToGo(newPos);
      if(ttg === true){
         context.moveCrane(newPos, callback);
      }else if(ttg == false){
         context.waitDelay(callback);
      }else{
         // context.moveCrane(context.cranePos + dir/4, callback)
         throw ttg;
      }
   };

   context.take = function(callback) {
      if(context.craneContent != undefined){
         throw(context.strings.messages.holdingBlock);
      }
      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);
      if(!topBlock || topBlock.num == 1){
         throw(context.strings.messages.nothingToTake);
      }
      if(!topBlock.isMovable){
         throw(context.strings.messages.notMovable);
      }
      var withdrawables = context.getItemsOn(topBlock.row, topBlock.col);

      var withdrawable = withdrawables[0];

      context.setIndexes();
      context.items.splice(withdrawable.index, 1);
      context.craneContent = withdrawable;
      
      if(context.display) {
         resetCraneZOrder();
         if(context.animate){
            context.takeAnim(topBlock,callback);
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
         }
      }

      // context.advanceTime(1);
      if(callback && (!context.display || !context.animate)){
         context.waitDelay(callback);
      }
   };

   context.drop = function(callback) {
      // console.log(context.runner)
      // console.log("drop")
      if(context.craneContent == undefined){
         throw(context.strings.messages.emptyCrane);
      }
      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);
      // console.log(topBlock)
      if(!topBlock || topBlock.row == 0){
         throw(context.strings.messages.cannotDrop);
      }
      var newRow = topBlock.row - 1;
      var newCol = currPos;
      context.craneContent.row = newRow;
      context.craneContent.col = newCol;
      var tempItem = context.craneContent;
      context.items.push(tempItem);
      context.setIndexes();
      context.craneContent = undefined;
      
      if(context.display) {
         if(context.animate){
            context.dropAnim(tempItem,callback);
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            redisplayItem(tempItem,false);
         }
      }

      if(callback && (!context.display || !context.animate)){
         context.waitDelay(callback);
      }
   };

   context.takeAnim = function(topBlock,callback) {
      var craneAttr = getCraneAttr();
      var delay = infos.actionDelay*(topBlock.row + 1);
      var itemAttr = itemAttributes(topBlock);

      var catchOffsetY = topBlock.catchOffsetY || 0;
      var yClawDown = itemAttr.y - craneItemOffset*scale + catchOffsetY*scale;
      var deltaY = yClawDown - craneAttr.yClaws;
      var yShaftDown = craneAttr.yShaft + deltaY;
      var lineClipDown = Beav.Object.clone(craneAttr.lineClip);
      lineClipDown[3] = craneAttr.lineClip[3] + deltaY;
      var cyLeftDown = craneAttr.cyLeft + deltaY;
      var cyRightDown = craneAttr.cyRight + deltaY;
      var itemY = (infos.topMargin + clawsOffsetY + craneItemOffset - catchOffsetY + topBlock.offsetY)*scale;

      var animLineDown = new Raphael.animation({ "clip-rect": lineClipDown },delay);
      var animClawDown = new Raphael.animation({ y: yClawDown },delay);
      var animShaftDown = new Raphael.animation({ y: yShaftDown },delay,function() {
         context.raphaelFactory.animate("animCrane_close_rightClaw_" + Math.random(), crane.rightClaw, animCloseRightClaw);
         context.raphaelFactory.animate("animCrane_close_leftClaw_" + Math.random(), crane.leftClaw, animCloseLeftClaw);
         
      });
      var animCloseRightClaw = new Raphael.animation({ transform: ["R",clutchAngle,craneAttr.cxRight,cyRightDown] },infos.actionDelay);
      var animCloseLeftClaw = new Raphael.animation({ transform: ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown] },infos.actionDelay,function() {
         context.raphaelFactory.animate("animCrane_line_up_" + Math.random(), crane.line, animLineUp);
         context.raphaelFactory.animate("animCrane_shaft_up_" + Math.random(), crane.shaft, animShaftUp);
         context.raphaelFactory.animate("animCrane_rightClaw_up" + Math.random(), crane.rightClaw, animRightClawUp);
         context.raphaelFactory.animate("animCrane_leftClaw_up" + Math.random(), crane.leftClaw, animLeftClawUp);
         context.raphaelFactory.animate("animCrane_item_up" + Math.random(), topBlock.element, animItemUp);
      });
      var animLineUp = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay);
      var animShaftUp = new Raphael.animation({ y: craneAttr.yShaft },delay);
      var animRightClawUp = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight] },delay);
      var animLeftClawUp = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft] },delay);
      var animItemUp = new Raphael.animation({ y: itemY },delay,function() {
         if(callback){
            context.waitDelay(callback);
         }
      });

      context.raphaelFactory.animate("animCrane_line_down_" + Math.random(), crane.line, animLineDown);
      context.raphaelFactory.animate("animCrane_rightClaw_down" + Math.random(), crane.rightClaw, animClawDown);
      context.raphaelFactory.animate("animCrane_leftClaw_down_" + Math.random(), crane.leftClaw, animClawDown);
      context.raphaelFactory.animate("animCrane_shaft_down_" + Math.random(), crane.shaft, animShaftDown);
   };

   context.dropAnim = function(item,callback) {
      var craneAttr = getCraneAttr();
      var delay = infos.actionDelay*(item.row + 1);
      var itemAttr = itemAttributes(item);

      var catchOffsetY = item.catchOffsetY || 0;
      var yClawDown = itemAttr.y - craneItemOffset*scale + catchOffsetY*scale;
      var deltaY = yClawDown - craneAttr.yClaws;
      var yShaftDown = craneAttr.yShaft + deltaY;
      var lineClipDown = Beav.Object.clone(craneAttr.lineClip);
      lineClipDown[3] = craneAttr.lineClip[3] + deltaY;
      var cyLeftDown = craneAttr.cyLeft + deltaY;
      var cyRightDown = craneAttr.cyRight + deltaY;
      // var itemY = (infos.topMargin + clawsPos + craneItemOffset + topBlock.offsetY)*scale;

      var animLineDown = new Raphael.animation({ "clip-rect": lineClipDown },delay);
      var animShaftDown = new Raphael.animation({ y: yShaftDown },delay);
      var animRightClawDown = new Raphael.animation({ y: yClawDown, transform: ["R",clutchAngle,craneAttr.cxRight,cyRightDown] },delay);
      var animLeftClawDown = new Raphael.animation({ y: yClawDown, transform: ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown] },delay);
      var animItemDown = new Raphael.animation({ y: itemAttr.y },delay,function() {
         context.raphaelFactory.animate("animCrane_open_rightClaw_" + Math.random(), crane.rightClaw, animOpenRightClaw);
         context.raphaelFactory.animate("animCrane_open_leftClaw_" + Math.random(), crane.leftClaw, animOpenLeftClaw);
      });
      var animOpenRightClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxRight,cyRightDown] },infos.actionDelay);
      var animOpenLeftClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxLeft,cyLeftDown] },infos.actionDelay,function() {
         context.raphaelFactory.animate("animCrane_line_up_" + Math.random(), crane.line, animLineUp);
         context.raphaelFactory.animate("animCrane_shaft_up_" + Math.random(), crane.shaft, animShaftUp);
         context.raphaelFactory.animate("animCrane_rightClaw_up" + Math.random(), crane.rightClaw, animRightClawUp);
         context.raphaelFactory.animate("animCrane_leftClaw_up" + Math.random(), crane.leftClaw, animLeftClawUp);
      });
      var animLineUp = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay);
      var animShaftUp = new Raphael.animation({ y: craneAttr.yShaft },delay);
      var animRightClawUp = new Raphael.animation({ y: craneAttr.yClaws },delay);
      var animLeftClawUp = new Raphael.animation({ y: craneAttr.yClaws },delay,function() {
         if(callback){
            context.waitDelay(callback);
         }
      });

      context.raphaelFactory.animate("animCrane_line_down_" + Math.random(), crane.line, animLineDown);
      context.raphaelFactory.animate("animCrane_shaft_down_" + Math.random(), crane.shaft, animShaftDown);
      context.raphaelFactory.animate("animCrane_rightClaw_down" + Math.random(), crane.rightClaw, animRightClawDown);
      context.raphaelFactory.animate("animCrane_leftClaw_down_" + Math.random(), crane.leftClaw, animLeftClawDown);
      context.raphaelFactory.animate("animCrane_item_down" + Math.random(), item.element, animItemDown);
   };

   context.tryToGo = function(col) {
      // Returns whether the crane can move to col
      // true : yes, false : no but move ignored, string : no and throw error
      // var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;

      if(col < 0 || col >= nbCol) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.outside;
      }
      return true;
   };

   context.moveCrane = function(newCol, callback) {
      var animate = (context.cranePos != newCol);
      
      var oldPos = context.cranePos;
      context.cranePos = Math.floor(newCol);
      
      if(context.display) {
         var craneAttr = getCraneAttr();
         if(infos.actionDelay > 0) {
            if(animate && context.animate) {
               var anim = new Raphael.animation({ x: craneAttr.xWheels },infos.actionDelay);
               var animLine = new Raphael.animation({ x: craneAttr.x, "clip-rect": craneAttr.lineClip },infos.actionDelay);
               var animShaft = new Raphael.animation({ x: craneAttr.xShaft },infos.actionDelay);
               var angle = (context.craneContent) ? clutchAngle : 0;
               var animLeftClaw = new Raphael.animation({ x: craneAttr.xLeftClaw, transform: ["R",-angle,craneAttr.cxLeft,craneAttr.cyLeft] },infos.actionDelay);
               var animRightClaw = new Raphael.animation({ x: craneAttr.xRightClaw, transform: ["R",angle,craneAttr.cxRight,craneAttr.cyRight] },infos.actionDelay);
               context.raphaelFactory.animate("animCrane_wheels_" + Math.random(), crane.wheels, anim);
               context.raphaelFactory.animate("animCrane_line_" + Math.random(), crane.line, animLine);
               context.raphaelFactory.animate("animCrane_shaft_" + Math.random(), crane.shaft, animShaft);
               context.raphaelFactory.animate("animCrane_leftClaw_" + Math.random(), crane.leftClaw, animLeftClaw);
               context.raphaelFactory.animate("animCrane_rightClaw_" + Math.random(), crane.rightClaw, animRightClaw);
               if(context.craneContent){
                  var item = context.craneContent;
                  var animItem = new Raphael.animation({ x: craneAttr.x + item.offsetX },infos.actionDelay);
                  context.raphaelFactory.animate("animCrane_item_" + Math.random(), item.element, animItem);
               }
            } else {
               context.delayFactory.createTimeout("moveCrane_" + Math.random(), function() {
                  setCraneAttr(craneAttr);
               }, infos.actionDelay / 2);
            }
         } else {
            setCraneAttr(craneAttr);
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
   
   context.destroy = function(item) {
      // console.log("destroy")
      context.setIndexes();
      context.items.splice(item.index, 1);

      if(context.display) {
         item.element.remove();
      }
   };
   
   
   context.findTopBlock = function(col) {
      var itemsInCol = context.findItemsInCol(col);
      if(itemsInCol.length == 0){
         var nbRowsCont = context.nbRowsCont;
         var nbRows = Math.max(context.nbRows,nbRowsCont);
         return { row: nbRows, col, num: 1 }
      }
      var topRow = Infinity;
      var topBlock;
      for(var item of itemsInCol){
         if(item.row < topRow){
            topBlock = item;
            topRow = item.row;
         }
      }
      return topBlock
   };

   context.findItemsInCol = function(col) {
      var itemsInCol = [];
      for(var item of context.items){
         if(item.col == col && !item.target){
            itemsInCol.push(item);
         }
      }
      return itemsInCol
   };
   
   return context;
};

var robotEndConditions = {
   dev: function(context, lastTurn) {
      var tar = context.target;
      if(!tar){
         context.success = true;
         throw(window.languageStrings.messages.success);
      }
      for(var iRow = 0; iRow < tar.length; iRow++){
         for(var iCol = 0; iCol < tar[iRow].length; iCol++){
            var id = tar[iRow][iCol];
            var gridRow = (context.nbRowsCont < context.nbRows) ? iRow : iRow + (context.nbRowsCont - context.nbRows);
            var gridCol = iCol + context.nbColCont;
            if(id != 1){
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target);
               // console.log(id,items)
               if(items.length == 0){
                  context.success = false;
                  // console.log(iRow,iCol);
                  if(context.display){
                     context.highlightCells([{row:gridRow,col:gridCol}]);
                  }
                  throw(window.languageStrings.messages.failureMissing);
               }
               if(items[0].num != id){
                  context.success = false;
                  throw(window.languageStrings.messages.failureWrongBlock);
               }
            }
         }
      }
      for(var iRow = 0; iRow < tar.length; iRow++){
         for(var iCol = 0; iCol < tar[iRow].length; iCol++){
            var id = tar[iRow][iCol];
            var gridRow = (context.nbRowsCont < context.nbRows) ? iRow : iRow + (context.nbRowsCont - context.nbRows);
            var gridCol = iCol + context.nbColCont;
            if(id == 1){
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target);
               // console.log(id,items)
               if(items.length > 0){
                  context.success = false;
                  // console.log(iRow,iCol);
                  if(context.display){
                     context.highlightCells([{row:gridRow,col:gridCol}]);
                  }
                  throw(window.languageStrings.messages.failureUnwanted);
               }
            }
         }
      }

      context.success = true;
      throw(window.languageStrings.messages.success);
   },
   // checkReachExit: function(context, lastTurn) {
   //    var robot = context.getRobot();
   //    if(context.isOn(function(obj) { return obj.isExit === true; })) {
   //       context.success = true;
   //       throw(window.languageStrings.messages.successReachExit);
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(window.languageStrings.messages.failureReachExit);
   //    }
   // },
   // checkPickedAllWithdrawables: function(context, lastTurn) {
   //    var solved = true;
   //    for(var row = 0;row < context.nbRows;row++) {
   //       for(var col = 0;col < context.nbCols;col++) {
   //          if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
   //             solved = false;
   //          }
   //       }
   //    }
      
   //    if(solved) {
   //       context.success = true;
   //       throw(window.languageStrings.messages.successPickedAllWithdrawables);
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(window.languageStrings.messages.failurePickedAllWithdrawables);
   //    }
   // },
   // checkPlugsWired: function(context, lastTurn) {
   //    var solved = true;
   //    for(var row = 0;row < context.nbRows;row++) {
   //       for(var col = 0;col < context.nbCols;col++) {
   //          if(context.hasOn(row, col, function(obj) { return obj.plugType !== undefined; }) && !context.hasOn(row, col, function(obj) { return obj.isWire === true; })) {
   //             solved = false;
   //          }
   //       }
   //    }
      
   //    if(solved) {
   //       context.success = true;
   //       throw(window.languageStrings.messages.successPlugsWired);
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(window.languageStrings.messages.failurePlugsWired);
   //    }
   // },
   // checkContainersFilled: function(context, lastTurn) {
   //    var solved = true;
      
   //    var messages = [
   //       window.languageStrings.messages.failureContainersFilled,
   //       window.languageStrings.messages.failureContainersFilledLess,
   //       window.languageStrings.messages.failureContainersFilledBag
   //    ];
   //    var message = 2;
   //    if (context.infos.maxMoves != undefined) {
   //       if (context.nbMoves > context.infos.maxMoves) {
   //          context.success = false;
   //          throw(window.languageStrings.messages.failureTooManyMoves + " : " + context.nbMoves);
   //       }
   //    }
   //    for(var row = 0;row < context.nbRows;row++) {
   //       for(var col = 0;col < context.nbCols;col++) {
   //          var containers = context.getItemsOn(row, col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
   //          if(containers.length != 0) {
   //             var container = containers[0];
   //             if(container.containerSize == undefined && container.containerFilter == undefined) {
   //                container.containerSize = 1;
   //             }
   //             var filter;
   //             if(container.containerFilter == undefined)
   //                filter = function(obj) { return obj.isWithdrawable === true; };
   //             else
   //                filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
               
   //             if(container.containerSize != undefined && context.getItemsOn(row, col, filter).length != container.containerSize) {
   //                solved = false;
   //                message = Math.min(message, 1);
   //             }
   //             else if(context.getItemsOn(row, col, filter).length == 0) {
   //                solved = false;
   //                message = Math.min(message, 0);
   //             }
               
   //             if(container.containerFilter != undefined) {
   //                if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) })) {
   //                   solved = false;
   //                   message = Math.min(message, 0);
   //                }
   //                for(var item in context.bag) {
   //                   if(filter(context.bag[item]) && context.infos.ignoreBag === undefined) {
   //                      solved = false;
   //                      message = Math.min(message, 2);
   //                   }
   //                }
   //             }
   //          }
   //          else {
   //             if(context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable === true && obj.canBeOutside !== true; }).length > 0) {
   //                solved = false;
   //                message = Math.min(message, 0);
   //             }
   //          }
   //       }
   //    }
      
   //    if(solved) {
   //       context.success = true;
   //       throw(window.languageStrings.messages.successContainersFilled);
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(messages[message]);
   //    }
   // },
   // checkBothReachAndCollect: function(context, lastTurn) {
   //    var robot = context.getRobot();
   //    if(context.isOn(function(obj) { return obj.isExit === true; })) {
   //       var solved = true;
   //       for(var row = 0;row < context.nbRows;row++) {
   //          for(var col = 0;col < context.nbCols;col++) {
   //             if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
   //                solved = false;
   //                throw(window.languageStrings.messages.failurePickedAllWithdrawables);
   //             }
   //          }
   //       }
         
   //       if(solved) {
   //          context.success = true;
   //          throw(window.languageStrings.messages.successPickedAllWithdrawables);
   //       }
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(window.languageStrings.messages.failureReachExit);
   //    }
   // },
   // checkLights: function(context, lastTurn) {
   //    var solved = true;
   //    for(var row = 0;row < context.nbRows;row++) {
   //       for(var col = 0;col < context.nbCols;col++) {
   //          if(context.hasOn(row, col, function(obj) { return obj.isLight === true && obj.state === 0; })) {
   //             solved = false;
   //          }
   //       }
   //    }
      
   //    if(solved) {
   //       context.success = true;
   //       throw(window.languageStrings.messages.successLights);
   //    }
   //    if(lastTurn) {
   //       context.success = false;
   //       throw(window.languageStrings.messages.failureLights);
   //    }
   // }
};


var robotEndFunctionGenerator = {
   allFilteredPicked: function(filter) {
      return function(context, lastTurn) {
         var solved = true;
         for(var row = 0;row < context.nbRows;row++) {
            for(var col = 0;col < context.nbCols;col++) {
               var filtered = context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable && filter(obj); })
               if(filtered.length != 0) {
                  solved = false;
               }
            }
         }
         
         for(var item in context.bag) {
            if(!filter(context.bag[item])) {
               context.success = false;
               throw(window.languageStrings.messages.failureUnfilteredObject);
            }
         }
         
         if(solved) {
            context.success = true;
            throw(window.languageStrings.messages.successPickedAllWithdrawables);
         }
         if(lastTurn) {
            context.success = false;
            throw(window.languageStrings.messages.failurePickedAllWithdrawables);
         }
      };
   },
   allNumbersWritten: function(numbers) {
      return function(context, lastTurn) {
         var solved = true;
         for(var iNumber in numbers) {
            var number = numbers[iNumber];
            var items = context.getItemsOn(number.row, number.col, function(obj) { return obj.value !== undefined; });
            if(items.length == 0)
               throw("Error: no number here");
            
            var expected;
            if(typeof number.value === "number") {
               expected = number.value;
            } else {
               expected = number.value.bind(context)();
            }
            
            if(expected != items[0].value) {
               solved = false;
            }
         }
         
         if(solved) {
            context.success = true;
            throw(window.languageStrings.messages.successNumbersWritten);
         }
         
         if(lastTurn) {
            context.success = false;
            throw(window.languageStrings.messages.failureNumbersWritten);
         }
      };
   }
};

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('crane', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['crane', getContext]);
}
