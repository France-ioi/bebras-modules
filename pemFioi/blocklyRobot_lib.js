var getRobotGridContext = function(display, infos) {
   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;

   var context = {
      display: display
   }

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   }

   context.waitDelay = function(callback, value) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      context.runner.noDelay(callback, value);
   };

   context.nbRobots = 1;

   context.robot_forward = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.items[context.curRobot];
      var coords = getCoordsInFront();
      if (!tileAllowed(coords.row, coords.col)) {
         var itemsInFront = context.getItems(coords.row, coords.col, {isObstacle: true});
         if (itemsInFront.length > 0) {
            throw(strings.obstacle);
            context.lost = true;
         }
         context.waitDelay(callback);
         return;
      }
      context.nbMoves++;
      moveRobot(coords.row, coords.col, item.dir, callback);
   }

   context.robot_paint = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.items[context.curRobot];

      var newItem = {row: item.row, col: item.col, type: "paint"};
      var paintItems = context.getItems(item.row, item.col, {category: "paint"});
      if (paintItems.length == 0) {
         var addItem = function() {
            context.items.push(newItem);
            resetItem(newItem, context.items.length - 1, true);
            if (context.display) {
               resetItemsZOrder(item.row, item.col);
            }
         };
         if ((infos.actionDelay > 0) && (context.display)) {
            DelayedExec.setTimeout("addItem" + context.curRobot + "_" + Math.random(), function() {
               addItem();
            }, infos.actionDelay / 2);
         } else {
            addItem();
         }
      }
      context.waitDelay(callback);
   }

   context.robot_wait = function(callback) {
      context.waitDelay(callback);
   }

   context.robot_right = function(callback) {
      if (context.lost) {
         return;
      }
      var dDir = 1;
      if (context.curRobot == 1) {
         dDir = 3;
      }
      var item = context.items[context.curRobot];
      var newDir = (item.dir + dDir) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   }

   context.robot_left = function(callback) {
      if (context.lost) {
         return;
      }
      var dDir = 3;
      if (context.curRobot == 1) {
         dDir = 1;
      }
      var item = context.items[context.curRobot];
      var newDir = (item.dir + dDir) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   }

   context.debug_alert = function(message, callback) {
      message = message ? message.toString() : '';
      if (context.display) {
         alert(message);
      }
      context.callCallback(callback);
   }

   context.robot_itemInFront = function(callback) {
      var itemsInFront = context.getItemsInFront({isObstacle: true});
      context.callCallback(callback, itemsInFront.length > 0);
   }

   context.robot_obstacleInFront = function(callback) {
      categoryInFront("obstacle", false, callback);
   }
         
   context.robot_paintInFront = function(callback) {
      categoryInFront("paint", false, callback);
   }

   context.robot_gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront();
      var gridEdgeInFront = false;
      if (isOutsideGrid(coords.row, coords.col)) {
         gridEdgeInFront = true;
      } else if (context.tiles[coords.row][coords.col] == 0) {
         gridEdgeInFront = true;
      }
      context.callCallback(callback, gridEdgeInFront);
   }

   context.robot_col = function(callback) {
      var item = context.items[context.curRobot];
      var col = item.col + 1;
      if (context.curRobot == 1) {
         col = context.nbCols - col + 1;
      }
      context.callCallback(callback, col);
   }

   context.robot_row = function(callback) {
      context.callCallback(callback, context.items[context.curRobot].row + 1);
   }
   
   var dirNames = ["E", "S", "O", "N"];
   context.robot_dir = function(callback) {
      var item = context.items[context.curRobot];
      context.callCallback(callback, dirNames[item.dir]);
   }

   context.program_end = function(callback) {
      var curRobot = context.curRobot;
      if (!context.programEnded[curRobot]) {
         context.programEnded[curRobot] = true;
         infos.checkEndCondition(context);
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
         if (paper != null) {
            paper.remove();
         }
         paper = new Raphael("grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
         $("#errors").html("");
         resetBoard();
      }
      resetItems();
      //resetScores();
      if (context.display) {
         task.updateScale();
      }
   };

   var allGenerators = {
      robot: {
         paint: { labelEn: "paint",           labelFr: strings.labelPaint,           codeFr: strings.codePaint,           category: "actions", type: 0, nbParams: 0, fct: context.robot_paint },
         forward: { labelEn: "forward",         labelFr: strings.labelForward,         codeFr: strings.codeForward,         category: "actions", type: 0, nbParams: 0, fct: context.robot_forward },
         right: { labelEn: "right",           labelFr: strings.labelRight,           codeFr: strings.codeRight,           category: "actions", type: 0, nbParams: 0, fct: context.robot_right },
         left: { labelEn: "left",            labelFr: strings.labelLeft,            codeFr: strings.codeLeft,            category: "actions", type: 0, nbParams: 0, fct: context.robot_left },
         wait: { labelEn: "wait",            labelFr: strings.labelWait,            codeFr: strings.codeWait,            category: "actions", type: 0, nbParams: 0, fct: context.robot_wait },
         obstacleInFront: { labelEn: "obstacleInFront", labelFr: strings.labelObstacleInFront, codeFr: strings.codeObstacleInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleInFront },
         paintInFront: { labelEn: "paintInFront",    labelFr: strings.labelPaintInFront,    codeFr: strings.codePaintInFront,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_paintInFront },
         gridEdgeInFront: { labelEn: "gridEdgeInFront", labelFr: strings.labelGridEdgeInFront, codeFr: strings.codeGridEdgeInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_gridEdgeInFront },
         dir: { labelEn: "dir",             labelFr: strings.labelDir,             codeFr: strings.codeDir,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_dir },
         col: { labelEn: "col",             labelFr: strings.labelCol,             codeFr: strings.codeCol,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_col },
         row: { labelEn: "row",             labelFr: strings.labelRow,             codeFr: strings.codeRow,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_row }
      },
      debug: {
         alert: { labelEn: "alert", labelFr: strings.labelAlert, codeFr: strings.codeAlert, category: "debug", type: 0, nbParams: 1, fct: context.debug_alert }
      }
   };

   var isOutsideGrid = function(row, col) {
      return ((col < 0) || (row < 0) || (col >= context.nbCols) || (row >= context.nbRows));
   }

   var delta = [[0,1],[1,0],[0,-1],[-1,0]];
   var getCoordsInFront = function() {
      var item = context.items[context.curRobot];
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
   }

   var categoryInFront = function(category, count, callback) {
      var nbOfCategoryFound = nbOfCategoryInFront(category);
      var result = 0;
      if (count) {
         result = nbOfCategoryFound;
      } else {
         result = (nbOfCategoryFound > 0);
      }
      context.callCallback(callback, result);
   }

   var resetBoard = function() {
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         cells[iRow] = [];
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var x = infos.cellSide * iCol * scale;
            var y = infos.cellSide * iRow * scale;
            var iTile = context.tiles[iRow][iCol];
            if (iTile != 0) {
               cells[iRow][iCol] = paper.image(infos.imgTiles[iTile], x, y, infos.cellSide * scale, infos.cellSide * scale);
            }
         }
      }
   };

   var resetItem = function(initItem, iItem) {
      context.items[iItem] = {};
      var item = context.items[iItem];
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
      for (var iItem = context.initItems.length - 1; iItem >= 0; iItem--) {
         resetItem(context.initItems[iItem], iItem);
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
      var item = context.items[iRobot];
      var animate = (newDir == item.dir);
      item.row = newRow;
      item.col = newCol;
      var prevDir = item.dir;
      item.dir = newDir;
      if (context.display) {
         var attr;
         if (animate) {
            attr = itemAttributes(item);
            DelayedExec.animateRaphael("animRobot" + iRobot + "_" + Math.random(), item.element, attr, infos.actionDelay);
         } else {
            attr = itemAttributes(item);
            if (infos.actionDelay > 0) {
               DelayedExec.setTimeout("moveRobot" + iRobot + "_" + Math.random(), function() {
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
         if ((item.row == row) && (item.col == col)) {
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
   }

   var tileAllowed = function(row, col) {
      if (isOutsideGrid(row, col)) {
         return false;
      }
      if (context.tiles[row][col] == 0) {
         return false;
      }
      var itemsInFront = context.getItems(row, col, {isObstacle: true});
     return (itemsInFront.length == 0);
   }

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

   context.updateScale = function(newScale) {
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
   }

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
