var getRobotGridContext = function(display, infos, curLevel) {
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
         labelEast: "avancer vers la droite",
         codeEast: "droite",
         labelSouth: "avancer vers le bas",
         codeSouth: "bas",
         labelWest: "avancer vers la gauche",
         codeWest: "gauche",
         labelNorth: "avancer vers le haut",
         codeNorth: "haut",
         labelPaint: "peindre la case",
         codePaint: "peindreCase",
         labelGridEdgeInFront: "bord de la grille devant",
         codeGridEdgeInFront: "bordGrilleDevant",
         labelObstacleInFront: "obstacle devant",
         codeObstacleInFront: "obstacleDevant",
         labelObstacleRight: "obstacle à droite",
         codeObstacleRight: "obstacleDroite",
         labelObstacleLeft: "obstacle à gauche",
         codeObstacleLeft: "obstacleGauche",
         labelObstacleEast: "obstacle à droite",
         codeObstacleEast: "obstacleDroite",
         labelObstacleWest: "obstacle à gauche",
         codeObstacleWest: "obstacleGauche",
         labelObstacleNorth: "obstacle en haut",
         codeObstacleNorth: "obstacleHaut",
         labelObstacleSouth: "obstacle en bas",
         codeObstacleSouth: "obstacleBas",
         labelCellGreen: "case verte",
         labelCellBrown: "case marron",
         labelCellMarked: "case marquée",
         codeCellGreen: "caseVerte",
         codeCellBrown: "caseMarron",
         codeCellMarked: "caseMarquee",
         labelPaintInFront: "peinture devant",
         codePaintInFront: "peintureDevant",
         codeColorUnder: "couleurCase",
         codeNumberUnder: "nombreCase",
         labelColorUnder: "couleur de la case",
         labelNumberUnder: "nombre sur la case",
         labelDir: "direction du robot",
         codeDir: "direction",
         labelCol: "colonne du robot",
         codeCol: "colonne",
         labelRow: "ligne du robot",
         codeRow: "ligne",
         labelAlert: "alerte",
         codeAlert: "alerte",
         obstacle: "Le robot essaie de se déplacer sur un obstacle !"
      },
      es: {
         labelWait: "esperar",
         codeWait: "esperar",
         labelRight: "girar a la derecha",
         codeRight: "derecha",
         labelLeft: "girar a la izquierda",
         codeLeft: "izquierda",
         labelForward: "avanzar",
         codeForward: "avanzar",
         labelEast: "avanzar hacia la derecha",
         codeEast: "derecha",
         labelSouth: "avanzar hacia abajo",
         codeSouth: "abajo",
         labelWest: "avanzar hacia la izquierda",
         codeWest: "izquierda",
         labelNorth: "avanzar hacia arriba",
         codeNorth: "arriba",
         labelPaint: "pintar la casilla",
         codePaint: "pintarCasilla",
         labelGridEdgeInFront: "borde de la cuadrícula adelante",
         codeGridEdgeInFront: "bordeCuadriculaAdelante",
         labelObstacleInFront: "obstáculo adelante",
         codeObstacleInFront: "obstacleAdelante",
         labelObstacleRight: "obstáculo a la derecha",
         codeObstacleRight: "obstaculoDerecha",
         labelObstacleLeft: "obstáculo a la izquierda",
         codeObstacleLeft: "obstaculoIzquierda",
         labelObstacleEast: "obstáculo a la derecha",
         codeObstacleEast: "obstaculoDerecha",
         labelObstacleWest: "obstáculo a la izquierda",
         codeObstacleWest: "obstaculoIzquierda",
         labelObstacleNorth: "obstáculo en haut",
         codeObstacleNorth: "obstaculoArribla",
         labelObstacleSouth: "obstáculo abajo",
         codeObstacleSouth: "obstacleAbajo",
         labelCellGreen: "casilla verde",
         labelCellBrown: "casilla café",
         labelCellMarked: "casilla marcada",
         codeCellGreen: "casillaVerde",
         codeCellBrown: "casillaCafe",
         codeCellMarked: "casillaMarcada",
         labelPaintInFront: "pintura enfrente",
         codePaintInFront: "pinturaEnfrente",
         codeColorUnder: "colorCasilla",
         codeNumberUnder: "numeroCasilla",
         labelColorUnder: "color de la casilla",
         labelNumberUnder: "número en la casilla",
         labelDir: "dirección del robot",
         codeDir: "direccion",
         labelCol: "columna del robot",
         codeCol: "columna",
         labelRow: "fila del robot",
         codeRow: "fila",
         labelAlert: "alerta",
         codeAlert: "alerta",
         obstacle: "¡El robot intenta desplazarse sobre un obstáculo!"
      }
   };
   var strings = languageStrings[stringsLanguage];

   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;

   var context = {
      display: display,
      infos: infos
   };

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   };

   context.waitDelay = function(callback, value) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      context.runner.noDelay(callback, value);
   }

   context.getRobotItem = function(iRobot) {
      var items = context.getItems(undefined, undefined, {category: "robot"});
      return items[iRobot];
   };

   context.robot_forward = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var coords = getCoordsInFront(0);
      if (!checkTileAllowed(coords.row, coords.col)) {
         context.waitDelay(callback);
      }
      if (infos.hasGravity) {
         context.fall(item, coords, callback);
      } else {
         context.nbMoves++;
         moveRobot(coords.row, coords.col, item.dir, callback);
      }
   };

   context.fall = function(item, coords, callback) {
      var row = coords.row;
      var platforms = context.getItems(row+1, coords.col, {category: "platform"});
      while ((!isOutsideGrid(row + 1, coords.col)) && (platforms.length == 0)) {
         row++;
         platforms = context.getItems(row+1, coords.col, {category: "platform"});
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
      var platforms = context.getItems(item.row - 1, item.col, {category: "platform"});
      if (platforms.length == 0) {
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
      var robot = context.getRobotItem(context.curRobot);
      var col = robot.col;
      if (robot.dir == 0) {
         col += 1;
      } else {
         col -= 1;
      }
      var platforms = context.getItems(robot.row + 1, col, {category: "platform"});
      context.runner.noDelay(callback, (platforms.length > 0));
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
      var platforms = context.getItems(row, col, {category: "platform"});
      context.runner.noDelay(callback, (platforms.length > 0));
   }

   context.robot_platformAbove = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var platforms = context.getItems(robot.row - 1, robot.col, {category: "platform"});
      context.runner.noDelay(callback, (platforms.length > 0));
   }

   context.robot_gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront(0);
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
            resetItem(newItem);
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
      if (!checkTileAllowed(item.row, item.col + 1)) {
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
      if (!checkTileAllowed(item.row, item.col - 1)) {
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
      if (!checkTileAllowed(item.row - 1, item.col)) {
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
      if (!checkTileAllowed(item.row + 1, item.col)) {
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
      var itemsInFront = getItemsInFront({isObstacle: true});
      context.callCallback(callback, itemsInFront.length > 0);
   };

   context.robot_obstacleInFront = function(callback) {
      categoryInFront("obstacle", false, callback);
   };

   context.robot_obstacleRight = function(callback) {
      var coords = getCoordsInFront(1);
      var items = context.getItems(coords.row, coords.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_obstacleLeft = function(callback) {
      var coords = getCoordsInFront(-1);
      var items = context.getItems(coords.row, coords.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_obstacleEast = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row, robot.col + 1, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_obstacleWest = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row, robot.col - 1, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_obstacleNorth = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row - 1, robot.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_obstacleSouth = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row + 1, robot.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot_paintGrayInFront = function(callback) {
      var coords = getCoordsInFront(0);
      paint(coords.row, coords.col, "paintGray", callback);
   };

   context.robot_colorUnder = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {hasColor: true});
      if (itemsUnder.length == 0) {
         context.callCallback(callback, "blanc");
      } else {
         context.callCallback(callback, infos.itemTypes[itemsUnder[0].type].color);
      }
   };

   context.robot_numberUnder = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {category: "number"});
      if (itemsUnder.length == 0) {
         context.callCallback(callback, 0);
      } else {
         context.callCallback(callback, infos.itemTypes[itemsUnder[0].type].value);
      }
   };

   context.robot_gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront(0);
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

   var findTransportable = function(id) {
      var transportables = context.getItems(undefined, undefined, {isTransportable: true});
      for (var iItem = 1; iItem < transportables.length; iItem++) {
         var item = transportables[iItem];
         if (item.id == id) {
            return item;
         }
      }
      return null;
   }

   context.transportable_exists = function(id, callback) {
      var transportable = findTransportable(id);
      context.runner.noDelay(callback, transportable != null);
   }

   context.transportable_col = function(id, callback) {
      var transportable = findTransportable(id);
      var res = 0;
      if (transportable != null) {
         res = transportable.col + 1;
      }
      context.callCallback(callback, res);
   }

   context.transportable_row = function(id, callback) {
      var transportable = findTransportable(id);
      var res = 0;
      if (transportable != null) {
         res = transportable.row + 1;
      }
      context.callCallback(callback, res);
   };

   context.transportable_number = function(callback) {
      var transportables = context.getItems(undefined, undefined, {isTransportable: true});
      context.callCallback(callback, transportables.length);
   };

   context.robot_onTransportable = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var transportables = context.getItems(robot.row, robot.col, {isTransportable: true});
      context.callCallback(callback, (transportables.length != 0));
   };

   context.robot_onHole = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var holes = context.getItems(robot.row, robot.col, {isHole: true});
      context.callCallback(callback, (holes.length != 0));
   };

   context.robot_transportableColor = function(callback) {
      var result = getTransportableProperty("color");
      context.callCallback(callback, result);
   };

   context.robot_transportableSquare = function(callback) {
      var result = getTransportableProperty("shape");
      context.callCallback(callback, result == "carré");
   };

   context.robot_transportableRed = function(callback) {
      var result = getTransportableProperty("color");
      context.callCallback(callback, result == "rouge");
   };

   var robotCellIsColor = function(callback, color) {
      var robot = context.getRobotItem(context.curRobot);
      var result = false;
      var transportables = context.getItems(robot.row, robot.col, {category: "paint"});
      if (transportables.length > 0) {
         var itemType = infos.itemTypes[transportables[0].type];
         if ((transportables.length > 0) && (itemType.color != undefined)) {
            result = (itemType.color == color);
         }
      }
      context.callCallback(callback, result);
   };

   context.robot_greenCell = function(callback) {
      robotCellIsColor(callback, "vert");
   };

   context.robot_markedCell = function(callback) {
      robotCellIsColor(callback, "marker");
   };

   context.robot_brownCell = function(callback) {
      robotCellIsColor(callback, "brown");
   };

   var getTransportableProperty = function(property) {
      var robot = context.getRobotItem(context.curRobot);
      var transportables = context.getItems(robot.row, robot.col, {isTransportable: true});
      if (transportables.length == 0) {
         return "";
      }
      var itemType = infos.itemTypes[transportables[0].type];
      if ((transportables.length > 0) && (itemType[property] != undefined)) {
         return itemType[property];
      }
      return "";
   }

   context.robot_transportableShape = function(callback) {
      var result = getTransportableProperty("shape");
      context.callCallback(callback, result);
   };

   context.robot_pickTransportable = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var transportables = context.getItems(robot.row, robot.col, {isTransportable: true});
      if (transportables.length == 0) {
         throw("Rien à ramasser");
      }
      /*
      if (transportables[0].rank != context.nbTransportedItems + 1) {
         throw("L'objet n'est pas celui qu'il faut ramasser maintenant.");
      }
      */
      if (context.nbTransportedItems > 0) {
         throw("Le robot transporte déjà un objet");
      }
      var transportable = transportables[0];
      context.items.splice(transportable.index, 1);
      context.nbTransportedItems++;
      context.transportedItem = transportable;
/*
      if (context.nbTransportedItems == context.nbTransportableItems) {
         context.success = true;
         throw("Bravo, vous avez ramassé tous les objets dans le bon ordre !");
      }
*/
      context.waitDelay(function() {
         if (context.display) {
            transportable.element.remove();
         }
         callback();
      });
   };

   context.robot_dropTransportable = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      if (context.transportedItem == undefined) {
         throw("Le robot essaie de déposer un objet mais n'en transporte pas.");
      }
      /*
      if (context.tiles[robot.row][robot.col] != 2) { // TODO : replace
         throw("Le robot essaie de déposer un objet ailleurs que sur une étoile.");
      }
      */
      context.nbDroppedItems++;
      context.nbTransportedItems = 0;
      if (context.nbDroppedItems == context.nbTransportableItems - 1) {
         context.success = true;
         throw("Bravo, vous avez déposé toutes les objets !");
      }
      context.waitDelay(function() {
         context.items.push(context.transportedItem);
         context.transportedItem.row = robot.row;
         context.transportedItem.col = robot.col;
         if (context.display) {
            redisplayItem(context.transportedItem);
         }
         context.transportedItem = undefined;
         callback();
      });
   }

   var dirNames = ["E", "S", "O", "N"];
   context.robot_dir = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      context.callCallback(callback, dirNames[item.dir]);
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
      context.nbTransportedItems = 0;
      if (context.display) {
         context.resetDisplay();
      } else {
         resetItems();
      }
      //resetScores();
   };

   context.resetDisplay = function() {
      this.delayFactory.destroyAll();
      this.raphaelFactory.destroyAll();
      paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
      if(window.quickAlgoInterface) {
            window.quickAlgoInterface.displayError(null);
      } else {
            $("#errors").html('');
      }
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
         pickTransportable: { labelEn: "pickTransportable", labelFr: "ramasser la bille", codeFr: "ramasserTransportable", category: "actions", type: 0, nbParams: 0, fct: context.robot_pickTransportable },
         dropTransportable: { labelEn: "dropTransportable", labelFr: "déposer la bille", codeFr: "deposerTransportable", category: "actions", type: 0, nbParams: 0, fct: context.robot_dropTransportable },
         onTransportable: { labelEn: "onTransportable", labelFr: "sur une bille", codeFr: "surTransportable", category: "sensors", type: 1, nbParams: 0, fct: context.robot_onTransportable },
         onHole: { labelEn: "onHole", labelFr: "sur un trou", codeFr: "surTrou", category: "sensors", type: 1, nbParams: 0, fct: context.robot_onHole },
         transportableShape: { labelEn: "transportableShape", labelFr: "forme de l'objet", codeFr: "formeObjet", category: "sensors", type: 1, nbParams: 0, fct: context.robot_transportableShape },
         transportableColor: { labelEn: "transportableColor", labelFr: "couleur de l'objet", codeFr: "couleurObjet", category: "sensors", type: 1, nbParams: 0, fct: context.robot_transportableColor },
         transportableRed: { labelEn: "transportableRed", labelFr: "l'objet est rouge", codeFr: "objetRouge", category: "sensors", type: 1, nbParams: 0, fct: context.robot_transportableRed },
         transportableBlue: { labelEn: "transportableBlue", labelFr: "l'objet est bleu", codeFr: "objetBleu", category: "sensors", type: 1, nbParams: 0, fct: context.robot_transportableBlue },
         transportableSquare: { labelEn: "transportableSquare", labelFr: "l'objet est carré", codeFr: "objetCarre", category: "sensors", type: 1, nbParams: 0, fct: context.robot_transportableSquare },

         greenCell: { labelEnd: "cellGreen", labelFr: "sur une case verte", codeFr: "caseVerte", category: "sensors", type: 1, nbParams: 0, fct: context.robot_greenCell },
         brownCell: { labelEnd: "cellBrown", labelFr: "sur une case marron", codeFr: "caseMarron", category: "sensors", type: 1, nbParams: 0, fct: context.robot_brownCell },
         markedCell: { labelEnd: "cellMarked", labelFr: "sur une case marquée", codeFr: "caseMarquee", category: "sensors", type: 1, nbParams: 0, fct: context.robot_markedCell },

         obstacleInFront: { labelEn: "obstacleInFront", labelFr: strings.labelObstacleInFront, codeFr: strings.codeObstacleInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleInFront },
         obstacleRight: { labelEn: "obstacleRight", labelFr: strings.labelObstacleRight, codeFr: strings.codeObstacleRight, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleRight },
         obstacleLeft: { labelEn: "obstacleLeft", labelFr: strings.labelObstacleLeft, codeFr: strings.codeObstacleLeft, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleLeft },
         obstacleEast: { labelEn: "obstacleEast", labelFr: strings.labelObstacleEast, codeFr: strings.codeObstacleEast, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleEast },
         obstacleWest: { labelEn: "obstacleWest", labelFr: strings.labelObstacleWest, codeFr: strings.codeObstacleWest, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleWest },
         obstacleNorth: { labelEn: "obstacleNorth", labelFr: strings.labelObstacleNorth, codeFr: strings.codeObstacleNorth, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleNorth },
         obstacleSouth: { labelEn: "obstacleSouth", labelFr: strings.labelObstacleSouth, codeFr: strings.codeObstacleSouth, category: "sensors", type: 1, nbParams: 0, fct: context.robot_obstacleSouth },


         paintInFront: { labelEn: "paintInFront",    labelFr: strings.labelPaintInFront,    codeFr: strings.codePaintInFront,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_paintGrayInFront },
         colorUnder: { labelEn: "colorUnder",    labelFr: strings.labelColorUnder,    codeFr: strings.codeColorUnder,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_colorUnder },
         numberUnder: { labelEn: "numberUnder",    labelFr: strings.labelNumberUnder,    codeFr: strings.codeNumberUnder,    category: "sensors", type: 1, nbParams: 0, fct: context.robot_numberUnder },
         gridEdgeInFront: { labelEn: "gridEdgeInFront", labelFr: strings.labelGridEdgeInFront, codeFr: strings.codeGridEdgeInFront, category: "sensors", type: 1, nbParams: 0, fct: context.robot_gridEdgeInFront },
         platformInFront: { labelEn: "platformInFront", labelFr: "plateforme devant", codeFr: "plateformeDevant", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformInFront },
         platformInFrontAndBelow: { labelEn: "platformInFrontAndBelow", labelFr: "plateforme devant plus bas", codeFr: "plateformeDevantPlusBas", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformInFrontAndBelow },
         platformAbove: { labelEn: "platformAbove", labelFr: "plateforme au dessus", codeFr: "plateformeAuDessus", category: "sensors", type: 1, nbParams: 0, fct: context.robot_platformAbove },
         dir: { labelEn: "dir",             labelFr: strings.labelDir,             codeFr: strings.codeDir,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_dir },
         col: { labelEn: "col",             labelFr: strings.labelCol,             codeFr: strings.codeCol,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_col },
         row: { labelEn: "row",             labelFr: strings.labelRow,             codeFr: strings.codeRow,             category: "sensors", type: 1, nbParams: 0, fct: context.robot_row },
         onPill: { labelEn: "onPill", labelFr: "sur une pastille", codeFr: "surPastille", category: "sensors", type: 1, nbParams: 0, fct: context.robot_onPill }
      },
      transport: {
         number: { labelEn: "number", labelFr: "nombre total d'objets à transporter", codeFr: "nombreTransportables", category: "sensors", type: 1, nbParams: 0, fct: context.transportable_number },
         exists: { labelEn: "exists", labelFr: "il existe un objet à transporter ", codeFr: "existeTransportable", category: "sensors", type: 1, nbParams: 1, fct: context.transportable_exists },
         row: { labelEn: "row", labelFr: "ligne de l'objet à transporter", codeFr: "ligneTransportable", category: "sensors", type: 1, nbParams: 1, fct: context.transportable_row },
         col: { labelEn: "col", labelFr: "colonne d'objet à transporter", codeFr: "colonneTransportable", category: "sensors", type: 1, nbParams: 1, fct: context.transportable_col }
      },
      debug: {
         alert: { labelEn: "alert", labelFr: strings.labelAlert, codeFr: strings.codeAlert, category: "debug", type: 0, nbParams: 1, fct: context.debug_alert }
      }
   };

   var isOutsideGrid = function(row, col) {
      return ((col < 0) || (row < 0) || (col >= context.nbCols) || (row >= context.nbRows));
   };

   var delta = [[0,1],[1,0],[0,-1],[-1,0]];
   var getCoordsInFront = function(dDir) {
      var item = context.getRobotItem(context.curRobot);
      var lookDir = (item.dir + dDir + 4) % 4;
      return {
         row: item.row + delta[lookDir][0],
         col: item.col + delta[lookDir][1]
      };
   };

   var getItemsInFront = function(filters) {
      var coords = getCoordsInFront(0);
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
      if (itemType.zOrder != undefined) {
         item.zOrder = itemType.zOrder;
      } else {
         item.zOrder = 0;
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
                  type: itemTypeByNum[itemTypeNum]
               });
            }
         }
      }
      for (var iItem = context.initItems.length - 1; iItem >= 0; iItem--) {
         resetItem(context.initItems[iItem]);
      }
   };

   var resetItemsZOrder = function(row, col) {
      var cellItems = [];
      for (var iItem = context.items.length - 1; iItem >= 0; iItem--) {
         var item = context.items[iItem];
         if ((item.row == row) && (item.col == col)) {
            cellItems.push(item);
         }
      }
      cellItems.sort(function(itemA, itemB) {
         if (itemA.zOrder < itemB.zOrder) {
            return -1;
         }
         if (itemA.zOrder == itemB.zOrder) {
            return 0;
         }
         return 1;
      });
      for (var iItem = 0; iItem < cellItems.length; iItem++) {
         cellItems[iItem].element.toFront();
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
      resetItemsZOrder(item.row, item.col);
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
               item.index = iItem;
               listItems.push(item);
            }
         }
      }
      return listItems;
   };

   var checkTileAllowed = function(row, col) {
      if (isOutsideGrid(row, col) || (context.tiles[row][col] == 0)) {
         if (infos.ignoreInvalidMoves) {
            return fasle;
         }
         throw("Le robot sort de la grille !");
      }
      var itemsInFront = context.getItems(row, col, {isObstacle: true});
      if (itemsInFront.length > 0) {
         if (infos.ignoreInvalidMoves) {
            return fasle;
         }
         throw(strings.obstacle);
      }
      return true;
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
   var generators = infos.generators;
   if ((typeof generators == "object") && (generators["easy"] != undefined)) {
      generators = generators[curLevel];
   }
   for(var genType in generators) {
      context.generators[genType] = [];
      var gens = generators[genType];
      for (var iGen = 0; iGen < gens.length; iGen++) {
         var gen = allGenerators[genType][gens[iGen]];
         if (gen == undefined) {
            alert("error: no generator for instruction '" + gens[iGen] + "'");
         }
         if (gen.fct == undefined) {
            alert("error: undefined function for " + gen.labelEn);
         }
         context.generators[genType].push(gen);
      }
   }

   return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
