var getRobotGridContext = function(display, infos) {
   var languageStrings = {
      fr: {
         labelWait: "attendre",
         codeWait: "attendre",
         labelRight: "tourner à droite",
         codeRight: "droite",
         labelLeft: "tourner à gauche",
         codeLeft: "gauche",
         labelForward: "avancer",
         codeForward: "avancer",
         labelPaint: "peindre la case",
         codePaint: "peindreCase",
         labelGridEdgeInFront: "bord de la grille devant",
         codeGridEdgeInFront: "bordGrilleDevant",
         labelObstacleInFront: "obstacle devant",
         codeObstacleInFront: "obstacleDevant",
         labelPaintInFront: "peinture devant",
         codePaintInFront: "peintureDevant",
         labelDir: "direction du robot",
         codeDir: "direction",
         labelCol: "colonne du robot",
         codeCol: "colonne",
         labelRow: "ligne du robot",
         codeRow: "ligne",
         labelAlert: "alerte",
         codeAlert: "alerte",
         obstacle: "Vous avez foncé sur un obstacle !" 
      }
   };
   var strings = languageStrings[stringsLanguage];
   
   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;

   var context = {
      display: display
   };

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   };

   context.waitDelay = function(callback, value) {
      if (infos.checkEndEveryTurn) {
         infos.checkEndCondition(context, false);
      }
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      if (infos.checkEveryTurn) {
         infos.checkEndCondition(context, false);
      }
      context.runner.noDelay(callback, value);
   };

   context.nbRobots = 1;

   context.getRobotItem = function(iRobot) {
      var items = context.getItems(undefined, undefined, {category: "robot"});
      return items[iRobot];
   };

   context.robot_forward = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var coords = getCoordsInFront();
      if (!tileAllowed(coords.row, coords.col)) {
         if (isOutsideGrid(coords.row, coords.col)) {
            context.lost = true;
            throw("Le robot sort de la grille !");
         }
         var itemsInFront = context.getItems(coords.row, coords.col, {isObstacle: true});
         if (itemsInFront.length > 0) {
            throw(strings.obstacle);
            context.lost = true;
         }
         context.waitDelay(callback);
         return;
      }
      if (infos.hasGravity) {
         var row = coords.row;
         while ((!isOutsideGrid(row + 1, coords.col)) && (context.tiles[row + 1][coords.col] != 2)) { // TODO: replace this 2 that represents a platform !!
            row++;
         }
         if (isOutsideGrid(row + 1, coords.col)) {
            context.lost = true;
            throw("Le robot se jette dans le vide !");
         }
         if (row - coords.row > 2) {
            context.lost = true;
            throw("Le robot va tomber de haut et s'écraser !");
         }
         coords.row = row;
      }
      context.nbMoves++;
      moveRobot(coords.row, coords.col, item.dir, callback);
   };

   context.robot_jump = function(callback) {
      if (!infos.hasGravity) {
         throw("Error: can't jump without gravity");
      }
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (isOutsideGrid(item.row - 2, item.col)) {
         context.lost = true;
         throw("Le robot essaie de sauter en dehors de la grille !");
      }
      if (context.tiles[item.row - 1][item.col] != 2) { // TODO : replace 2 with something identifying a platform
         context.lost = true;
         throw("Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !");
      }
      context.nbMoves++;
      moveRobot(item.row - 2, item.col, item.dir, callback);
   };

   context.robot_turnAround = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var newDir = (item.dir + 2) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   };

   context.robot_platformInFront = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var col = item.col;
      if (item.dir == 0) {
         col += 1;
      } else {
         col -= 1;
      }
      var platformInFront;
      if (isOutsideGrid(item.row + 1, col)) {
         platformInFront = false;
      } else {
         platformInFront = (context.tiles[item.row + 1][col] == 2); // TODO : replace 2
      }
      context.runner.noDelay(callback, platformInFront);
   }

   context.robot_platformInFrontAndBelow = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var col = item.col;
      if (item.dir == 0) {
         col += 1;
      } else {
         col -= 1;
      }
      var row = item.row + 3;
      var platformBelow;
      if (isOutsideGrid(row, col)) {
         platformBelow = false;
      } else {
         platformBelow = (context.tiles[row][col] == 2); // TODO : replace 2
      }
      context.runner.noDelay(callback, platformBelow);
   }

   context.robot_platformAbove = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var platformAbove;
      if (isOutsideGrid(item.row - 1, item.col)) {
         platformAbove = false;
      } else {
         platformAbove = (context.tiles[item.row - 1][item.col] == 2); // TODO : replace 2
      }
      context.runner.noDelay(callback, platformAbove);
   }
         
   context.robot_gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront();
      var gridEdgeInFront = false;
      if (isOutsideGrid(coords.row, coords.col)) {
         gridEdgeInFront = true;
      } else if (context.tiles[coords.row][coords.col] == 0) {
         gridEdgeInFront = true;
      }
      context.runner.noDelay(callback, gridEdgeInFront);
   }


   function destroyItem(row, col, category) {
      var foundItem = -1;
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         if ((item.row == row) && (item.col == col) && (item.category == category)) {
            foundItem = iItem;
            break;
         }
      }
      if (foundItem != -1) {
         if (context.display) {
            context.items[foundItem].element.remove();
         }
         context.items.splice(foundItem, 1);
      }
   };

   function paint(row, col, paintType, callback) {
      if (context.lost) {
         return;
      }

      var newItem = {row: row, col: col, type: paintType};
      var paintItems = context.getItems(row, col, {category: "paint"});
      if ((paintItems.length != 0) && (paintItems[0].type != paintType)) {
         destroyItem(row, col, "paint");
         paintItems.splice(0, 1);
      }
      if (paintItems.length == 0) {
         var addItem = function() {
            context.items.push(newItem);
            resetItem(newItem, context.items.length - 1, true);
            if (context.display) {
               resetItemsZOrder(row, col);
            }
         };
         if ((infos.actionDelay > 0) && (context.display)) {
            context.delayFactory.createTimeout("addItem" + context.curRobot + "_" + Math.random(), function() {
               addItem();
            }, infos.actionDelay / 2);
         } else {
            addItem();
         }
      }
      context.waitDelay(callback);
   }

   context.robot_paint = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      paint(item.row, item.col, "paint", callback);
   };

   context.robot_paintGray = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      paint(item.row, item.col, "paintGray", callback);
   };

   context.robot_wait = function(callback) {
      context.waitDelay(callback);
   };

   context.robot_right = function(callback) {
      if (context.lost) {
         return;
      }
      var dDir = 1;
      if (context.curRobot == 1) {
         dDir = 3;
      }
      var item = context.getRobotItem(context.curRobot);
      var newDir = (item.dir + dDir) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   };

   context.robot_left = function(callback) {
      if (context.lost) {
         return;
      }
      var dDir = 3;
      if (context.curRobot == 1) {
         dDir = 1;
      }
      var item = context.getRobotItem(context.curRobot);
      var newDir = (item.dir + dDir) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   };

   context.robot_east = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (!tileAllowed(item.row, item.col + 1)) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row, item.col + 1, 0, callback);
      }
   };

   context.robot_west = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (!tileAllowed(item.row, item.col - 1)) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row, item.col - 1, 2, callback);
      }
   };

   context.robot_north = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (!tileAllowed(item.row - 1, item.col)) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row - 1, item.col, 3, callback);
      }
   };

   context.robot_south = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (!tileAllowed(item.row + 1, item.col)) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row + 1, item.col, 1, callback);
      }
   };

   context.debug_alert = function(message, callback) {
      message = message ? message.toString() : '';
      if (context.display) {
         alert(message);
      }
      context.callCallback(callback);
   };

   context.robot_itemInFront = function(callback) {
      var itemsInFront = context.getItemsInFront({isObstacle: true});
      context.callCallback(callback, itemsInFront.length > 0);
   };

   context.robot_obstacleInFront = function(callback) {
      categoryInFront("obstacle", false, callback);
   };

   context.robot_paintGrayInFront = function(callback) {
      var coords = getCoordsInFront();
      paint(coords.row, coords.col, "paintGray", callback);
   };

   context.robot_colorUnder = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {hasColor: true});
      if (itemsUnder.length == 0) {
         context.callCallback(callback, "blanc");
      } else {
         context.callCallback(callback, infos.itemTypes[itemsUnder[0].type].color);
      }
   };

   context.robot_gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront();
      var gridEdgeInFront = false;
      if (isOutsideGrid(coords.row, coords.col)) {
         gridEdgeInFront = true;
      } else if (context.tiles[coords.row][coords.col] == 0) {
         gridEdgeInFront = true;
      }
      context.callCallback(callback, gridEdgeInFront);
   };

   context.robot_col = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var col = item.col + 1;
      if (context.curRobot == 1) {
         col = context.nbCols - col + 1;
      }
      context.callCallback(callback, col);
   };

   context.robot_row = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      context.callCallback(callback, item.row + 1);
   };
   
   context.robot_onPill = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var pills = getItems(item.row, item.col, {category: "pill"});
      context.callCallback(callback, pills.length > 0);
   }

   var findPill = function(iPill) {
      var pill = null;
      for (var iItem = 1; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         if (item.id == iPill) {
            pill = item;
            break;
         }
      }
      return pill;
   }

   context.pill_exists = function(iPill, callback) {
      var pill = findPill(iPill);
      context.runner.noDelay(callback, pill != null);
   }

   context.pill_col = function(iPill, callback) {
      var pill = findPill(iPill);
      var res = 0;
      if (pill != null) {
         res = pill.col + 1;
      }
      context.callCallback(callback, res);
   }

   context.pill_row = function(iPill, callback) {
      var pill = findPill(iPill);
      var res = 0;
      if (pill != null) {
         res = pill.row + 1;
      }
      context.callCallback(callback, res);
   };

   context.pill_number = function(callback) {
      context.callCallback(callback, context.nbPills);
   };

   context.robot_pickPill = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var foundPill = 0;
      for (var iPill = 1; iPill < context.items.length; iPill++) {
         var pill = context.items[iPill];
         if ((pill.row == item.row) && (pill.col == item.col)) {
            foundPill = iPill;
            break;
         }
      }
      if (foundPill == 0) {
         throw("Pas de pastille à ramasser");
      }
      if (context.items[foundPill].rank != context.nbTransportedPills + 1) {
         throw("La pastille n'est pas celle qu'il faut ramasser maintenant.");
      }
      if (context.display) {
         context.items[foundPill].element.remove();
      }
      context.items.splice(foundPill, 1);
      context.nbTransportedPills++;
      if (context.nbTransportedPills == context.nbPills) {
         context.success = true;
         throw("Bravo, vous avez ramassé toutes les pastilles dans le bon ordre !");
      }
//         context.transportedPill = pills[0].id;
      context.waitDelay(callback);
   };
/*
   context.robot_dropPill = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var pills = getItems(item.row, item.col, {category: "pill"});
      if (context.transportedPill == 0) {
         throw("Le robot essaie de déposer une pastille mais n'en transporte pas.");
      }
      if (context.tiles[item.row][item.col] != 2) {
         throw("Le robot essaie de déposer une pastille ailleurs que sur une étoile.");
      }
      context.nbDroppedPills++;
      context.transportedPill = 0;
      if (context.nbDroppedPills == context.items.length - 1) {
         context.success = true;
         throw("Bravo, vous avez déposé toutes les pastilles !");
      }
      context.waitDelay(callback);
   }
*/

   
   var dirNames = ["E", "S", "O", "N"];
   context.robot_dir = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      context.callCallback(callback, dirNames[item.dir]);
   };

   context.program_end = function(callback) {
      var curRobot = context.curRobot;
      if (!context.programEnded[curRobot]) {
         context.programEnded[curRobot] = true;
         infos.checkEndCondition(context, true);
      }
      context.waitDelay(callback);
   };

   context.reset = function(gridInfos) {
      if (gridInfos) {
         context.tiles = gridInfos.tiles;
         context.initItems = gridInfos.initItems;
         context.nbRows = context.tiles.length;
         context.nbCols = context.tiles[0].length;
      }
      context.items = [];
      context.lost = false;
      context.nbMoves = 0;
      context.success = false;
      context.curRobot = 0;
      if (context.display) {
         context.resetDisplay();
      } else {
         resetItems();
      }
      //resetScores();
   };

   context.resetDisplay = function() {
      if (paper != null) {
         paper.remove();
      }
      paper = new Raphael("grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
      $("#errors").html("");
      resetBoard();
      context.blocklyHelper.updateSize();
      resetItems();
      context.updateScale();
   };

   context.unload = function() {
      if (context.display) {
         if (paper != null) {
            paper.remove();
         }
      }
   };

   var allGenerators = {
      robot: {
         paint: { labelEn: "paint",           labelFr: strings.labelPaint,           codeFr: strings.codePaint,           category: "actions", type: 0, nbParams: 0, fct: context.robot_paint },
         paintGray: { labelEn: "paintGray",           labelFr: strings.labelPaintGray,           codeFr: strings.codePaintGray,           category: "actions", type: 0, nbParams: 0, fct: context.robot_paintGray },
         forward: { labelEn: "forward",         labelFr: strings.labelForward,         codeFr: strings.codeForward,         category: "actions", type: 0, nbParams: 0, fct: context.robot_forward },
         turnAround: { labelEn: "turnAround", labelFr: "faire demi-tour", codeFr: "demiTour", category: "actions", type: 0, nbParams: 0, fct: context.robot_turnAround },
         jump: { labelEn: "jump", labelFr: "sauter", codeFr: "sauter", category: "actions", type: 0, nbParams: 0, fct: context.robot_jump },
         right: { labelEn: "right",           labelFr: strings.labelRight,           codeFr: strings.codeRight,           category: "actions", type: 0, nbParams: 0, fct: context.robot_right },
         left: { labelEn: "left",            labelFr: strings.labelLeft,            codeFr: strings.codeLeft,            category: "actions", type: 0, nbParams: 0, fct: context.robot_left },
         east: { labelEn: "east",            labelFr: strings.labelEast,            codeFr: strings.codeEast,            category: "actions", type: 0, nbParams: 0, fct: context.robot_east },
         west: { labelEn: "west",            labelFr: strings.labelWest,            codeFr: strings.codeWest,            category: "actions", type: 0, nbParams: 0, fct: context.robot_west },
         north: { labelEn: "north",            labelFr: strings.labelNorth,            codeFr: strings.codeNorth,            category: "actions", type: 0, nbParams: 0, fct: context.robot_north },
         south: { labelEn: "south",            labelFr: strings.labelSouth,            codeFr: strings.codeSouth,            category: "actions", type: 0, nbParams: 0, fct: context.robot_south },
         wait: { labelEn: "wait",            labelFr: strings.labelWait,            codeFr: strings.codeWait,            category: "actions", type: 0, nbParams: 0, fct: context.robot_wait },
         pickPill: { labelEn: "pickPill", labelFr: "ramasser la pastille", codeFr: "ramasserPasille", category: "actions", type: 0, nbParams: 0, fct: context.robot_pickPill },
//       droppill: { labelEn: "dropPill", labelFr: "déposer la pastille", codeFr: "deposerPastille", category: "actions", type: 0, nbParams: 0, fct: context.robot_dropPill },

         obstacleInFront: { labelEn: "obstacleInFront", labelFr: strings.labelObstacleInFront, codeFr: strings.codeObstacleInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleInFront },
         paintInFront: { labelEn: "paintInFront",    labelFr: strings.labelPaintInFront,    codeFr: strings.codePaintInFront,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_paintGrayInFront },
         colorUnder: { labelEn: "colorUnder",    labelFr: strings.labelColorUnder,    codeFr: strings.codeColorUnder,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_colorUnder },
         gridEdgeInFront: { labelEn: "gridEdgeInFront", labelFr: strings.labelGridEdgeInFront, codeFr: strings.codeGridEdgeInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_gridEdgeInFront },
         platformInFront: { labelEn: "platformInFront", labelFr: "plateforme devant", codeFr: "plateformeDevant", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformInFront },
         platformInFrontAndBelow: { labelEn: "platformInFrontAndBelow", labelFr: "plateforme devant plus bas", codeFr: "plateformeDevantPlusBas", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformInFrontAndBelow },
         platformAbove: { labelEn: "platformAbove", labelFr: "plateforme au dessus", codeFr: "plateformeAuDessus", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformAbove },
         dir: { labelEn: "dir",             labelFr: strings.labelDir,             codeFr: strings.codeDir,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_dir },
         col: { labelEn: "col",             labelFr: strings.labelCol,             codeFr: strings.codeCol,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_col },
         row: { labelEn: "row",             labelFr: strings.labelRow,             codeFr: strings.codeRow,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_row },
         onPill: { labelEn: "onPill", labelFr: "sur une pastille", codeFr: "surPastille", category: "sensors", type: 1, nbParams: 0, fct: context.robot_onPill }
      },
      pill: {
         number: { labelEn: "number", labelFr: "nombre total de pastilles", codeFr: "nombrePastilles", category: "sensors", type: 1, nbParams: 0, fct: context.pill_number },
         exists: { labelEn: "exists", labelFr: "il existe une pastille ", codeFr: "existePastille", category: "sensors", type: 1, nbParams: 1, fct: context.pill_exists },
         row: { labelEn: "row", labelFr: "ligne de la pastille", codeFr: "lignePastille", category: "sensors", type: 1, nbParams: 1, fct: context.pill_row },
         col: { labelEn: "col", labelFr: "colonne de la pastille", codeFr: "colonnePastille", category: "sensors", type: 1, nbParams: 1, fct: context.pill_col }
      },
      debug: {
         alert: { labelEn: "alert", labelFr: strings.labelAlert, codeFr: strings.codeAlert, category: "debug", type: 0, nbParams: 1, fct: context.debug_alert }
      }
   };

   var isOutsideGrid = function(row, col) {
      return ((col < 0) || (row < 0) || (col >= context.nbCols) || (row >= context.nbRows));
   };

   var delta = [[0,1],[1,0],[0,-1],[-1,0]];
   var getCoordsInFront = function() {
      var item = context.getRobotItem(context.curRobot);
      return {
         row: item.row + delta[item.dir][0],
         col: item.col + delta[item.dir][1]
      };
   };

   var getItemsInFront = function(filters) {
      var coords = getCoordsInFront(context);
      return context.getItems(coords.row, coords.col, filters);
   };

   var nbOfCategoryInFront = function(category) {
      var itemsInFront = getItemsInFront({category: category});
      return itemsInFront.length;
   };

   var categoryInFront = function(category, count, callback) {
      var nbOfCategoryFound = nbOfCategoryInFront(category);
      var result = 0;
      if (count) {
         result = nbOfCategoryFound;
      } else {
         result = (nbOfCategoryFound > 0);
      }
      context.callCallback(callback, result);
   };

   var resetBoard = function() {
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         cells[iRow] = [];
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var x = infos.cellSide * iCol * scale;
            var y = infos.cellSide * iRow * scale;
            var itemTypeNum = context.tiles[iRow][iCol];
            if (itemTypeNum > 0) {
               cells[iRow][iCol] = paper.rect(x, y, infos.cellSide * scale, infos.cellSide * scale);
            }
         }
      }
   };

   var resetItem = function(initItem) {
      var item = {};
      context.items.push(item);
      for (var property in initItem) {
         item[property] = initItem[property];
      }
      var itemType = infos.itemTypes[item.type];
      item.side = itemType.side;
      item.category = itemType.category;
      if (itemType.team != undefined) {
         item.team = itemType.team;
      }
      item.offsetX = 0;
      if (itemType.offsetX != undefined) {
         item.offsetX = itemType.offsetX;
      }
      item.offsetY = 0;
      if (itemType.offsetY != undefined) {
         item.offsetY = itemType.offsetY;
      }
      item.nbStates = 1;
      if (itemType.nbStates != undefined) {
         item.nbStates = itemType.nbStates;
      }
      if (context.display) {
         redisplayItem(item);
      }
   };

   var resetItems = function() {
      context.items = [];
      var itemTypeByNum = {};
      for (var type in infos.itemTypes) {
         var itemType = infos.itemTypes[type];
         if (itemType.num != undefined) {
            itemTypeByNum[itemType.num] = type;
         }
      }
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var itemTypeNum = context.tiles[iRow][iCol];
            if (itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow,
                  col: iCol,
                  type: itemTypeByNum[itemTypeNum],
               });
            }
         }
      }
      for (var iItem = context.initItems.length - 1; iItem >= 0; iItem--) {
         resetItem(context.initItems[iItem]);
      }
   };

   var resetItemsZOrder = function(row, col) {
      for (var iItem = context.items.length - 1; iItem >= 0; iItem--) {
         var item = context.items[iItem];
         if ((item.row == row) && (item.col == col)) {
            item.element.toFront();
         }
      }
   };

   var redisplayItem = function(item) {
      if (item.element != null) {
         item.element.remove();
      }
      var x = infos.cellSide * item.col * scale;
      var y = infos.cellSide * item.row * scale;
      item.element = paper.image(infos.itemTypes[item.type].img, x, y, item.side * item.nbStates * scale, item.side * scale);
      item.element.attr(itemAttributes(item));
   };

   var moveRobot = function(newRow, newCol, newDir, callback) {
      var iRobot = context.curRobot;
      var item = context.getRobotItem(iRobot);
      var animate = (item.row != newRow) || (item.col != newCol) || (newDir == item.dir);
      // If the robot turns and moves at the sime time, we do an instant turn (for now).
      if ((item.dir != newDir) && ((item.row != newRow) || (item.col != newCol))) {
         item.dir = newDir;
         if (context.display) {
            attr = itemAttributes(item);
            item.element.attr(attr);
         }
      }
      item.dir = newDir;
      item.row = newRow;
      item.col = newCol;
      if (context.display) {
         var attr;
         if (animate) {
            attr = itemAttributes(item);
            context.raphaelFactory.animate("animRobot" + iRobot + "_" + Math.random(), item.element, attr, infos.actionDelay);
         } else {
            attr = itemAttributes(item);
            if (infos.actionDelay > 0) {
               context.delayFactory.createTimeout("moveRobot" + iRobot + "_" + Math.random(), function() {
                  item.element.attr(attr);
               }, infos.actionDelay / 2);
            } else {
               item.element.attr(attr);
            }
         }
      }
      context.waitDelay(callback);
   };

   context.getItems = function(row, col, filters) {
      var listItems = [];
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         var itemType = infos.itemTypes[item.type];
         if ((row == undefined) || ((item.row == row) && (item.col == col))) {
            var accepted = true;
            for (var property in filters) {
               var value = filters[property];
               if ((itemType[property] == undefined) && (value != undefined)) {
                  accepted = false;
                  break;
               }
               if ((itemType[property] != undefined) && (itemType[property] != value)) {
                  accepted = false;
                  break;
               }
            }
            if (accepted) {
               listItems.push(item);
            }
         }
      }
      return listItems;
   };

   var tileAllowed = function(row, col) {
      if (isOutsideGrid(row, col)) {
         return false;
      }
      if (context.tiles[row][col] == 0) {
         return false;
      }
      var itemsInFront = context.getItems(row, col, {isObstacle: true});
     return (itemsInFront.length == 0);
   };

   var itemAttributes = function(item) {
      var x = infos.cellSide * scale * item.col + item.offsetX * scale;
      var y = (infos.cellSide * item.row - (item.side - infos.cellSide)) * scale + item.offsetY * scale;
      var xClip = x;
      if (item.dir != undefined) {
//         var dirToState = [3, 0, 1, 2];
         var dirToState = [0, 2, 4, 6];
         x = x - (dirToState[item.dir] * item.side * scale); 
      }
      var clipRect = "" + xClip + "," + y + "," + (item.side * scale) + "," + (item.side * scale);
      return { x: x, y: y, width: item.side * item.nbStates * scale, height: item.side * scale, "clip-rect": clipRect};
   };

   context.updateScale = function() {
      if (!context.display) {
         return;
      }
      if (paper == null) {
         return;
      }
      var newCellSide;
      if (context.nbCols && context.nbRows) {
         newCellSide = Math.min($("#grid").width() / context.nbCols, $("#grid").height() / context.nbRows);
      } else {
         newCellSide = 0;
      }
      scale = newCellSide / infos.cellSide;
      paper.setSize(infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            if (cells[iRow][iCol] != undefined) {
               var x = infos.cellSide * iCol * scale;
               var y = infos.cellSide * iRow * scale;
               cells[iRow][iCol].attr({x: x, y: y, width: infos.cellSide * scale, height: infos.cellSide * scale});
            }
         }
      }
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         item.element.attr(itemAttributes(item));
      }
      if (texts[0] && texts[1]) {
         texts[0].attr({x: infos.cellSide * 4.5 * scale, y: infos.cellSide * scale * 0.5, "font-size": 18 * scale});
         texts[1].attr({x: infos.cellSide * 7.5 * scale, y: infos.cellSide * scale * 0.5, "font-size": 18 * scale});
      }
   };

   context.generators = {
   };
   for(var genType in infos.generators) {
      context.generators[genType] = [];
      var gens = infos.generators[genType];
      for (var iGen = 0; iGen < gens.length; iGen++) {
         context.generators[genType].push(allGenerators[genType][gens[iGen]]);
      }
   }

   return context;
}
