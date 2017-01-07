var getContext = function(display, infos, curLevel) {
   var languageStrings = {
      fr: {
         label: {
            wait: "attendre",
            right: "tourner à droite",
            left: "tourner à gauche",
            forward: "avancer",
            turnAround: "faire demi-tour",
            jump: "sauter",
            east: "avancer vers la droite",
            south: "avancer vers le bas",
            west: "avancer vers la gauche",
            north: "avancer vers le haut",
            paint: "peindre la case",
            pickTransportable: "ramasser la bille",
            dropTransportable: "déposer la bille",
            onTransportable: "sur une bille",
            onHole: "sur un trou",
            transportableShape: "forme de l'objet",
            transportableColor: "couleur de l'objet",
            transportableRed:  "l'objet est rouge",
            transportableBlue: "l'objet est bleu",
            transportableSquare: "l'objet est carré",
            greenCell: "sur une case verte",
            brownCell: "sur une case marron",
            markedCell: "sur une case marquée",
            platformInFront: "plateforme devant",
            platformInFrontAndBelow: "plateforme devant plus bas",
            platformAbove: "plateforme au dessus",
            gridEdgeInFront: "bord de la grille devant",
            obstacleInFront: "obstacle devant",
            obstacleRight: "obstacle à droite",
            obstacleLeft: "obstacle à gauche",
            obstacleEast: "obstacle à droite",
            obstacleWest: "obstacle à gauche",
            obstacleNorth: "obstacle en haut",
            obstacleSouth: "obstacle en bas",
            paintInFront: "peinture devant",
            paintNorthWest: "peinture en haut à gauche",
            paintNorth: "peinture en haut",
            paintNorthEast: "peinture en haut à droite",
            colorUnder: "couleur de la case",
            numberUnder: "nombre sur la case",
            dir: "direction du robot",
            col: "colonne du robot",
            row: "ligne du robot",
            alert: "alerte",
            onPill: "sur une pastille",

            number: "nombre total d'objets à transporter",
            exists: "il existe un objet à transporter ",
            trans_row: "ligne de l'objet à transporter",
            trans_col: "colonne d'objet à transporter",
         },
         code: {
            wait: "attendre",
            right: "tournerDroite",
            left: "tournerGauche",
            turnAround: "demiTour",
            jump: "sauter",
            forward: "avancer",
            east: "droite",
            south: "bas",
            west: "gauche",
            north: "haut",
            paint: "peindre",
            pickTransportable: "ramasser",
            dropTransportable: "deposer",
            onTransportable: "surObjet",
            onHole: "surTrou",
            transportableShape: "formeObjet",
            transportableColor: "couleurObjet",
            transportableRed: "objetRouge",
            transportableBlue: "objetBleu",
            transportableSquare: "objetCarre",
            greenCell: "caseVerte",
            brownCell: "caseMarron",
            markedCell: "caseMarquee",
            platformInFront: "plateformeDevant",
            platformInFrontAndBelow: "plateformeDevantPlusBas",
            platformAbove: "plateformeAuDessus",
            gridEdgeInFront: "bordGrilleDevant",
            obstacleInFront: "obstacleDevant",
            obstacleRight: "obstacleADroite",
            obstacleLeft: "obstacleAGauche",
            obstacleEast: "obstacleDroite",
            obstacleWest: "obstacleGauche",
            obstacleNorth: "obstacleHaut",
            obstacleSouth: "obstacleBas",
            paintInFront: "peintureDevant",
            paintNorthWest: "peintureHautGauche",
            paintNorth: "peintureHaut",
            paintNorthEast: "peintureHautDroite",
            colorUnder: "couleurCase",
            numberUnder: "nombreCase",
            dir: "direction",
            col: "colonne",
            row: "ligne",
            alert: "alerte",
            onPill: "surPastille",

            number: "nombreTransportables",
            exists: "existeTransportable",
            trans_row: "ligneTransportable",
            trans_col: "colonneTransportable",
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
      },
      de: {
         label: {
            wait: "warte",
            right: "drehe nach rechts",
            left: "drehe nach links",
            turnAround: "faire demi-tour",
            jump: "sauter",
            forward: "gehe vorwärts",
            east: "gehe nach rechts",
            south: "gehe nach unten",
            west: "gehe nach links",
            north: "gehe nach oben",
            paint: "bemale das Feld",
            pickTransportable: "Murmel aufheben",
            dropTransportable: "Murmel ablegen",
            onTransportable: "auf einer Murmel",
            onHole: "auf einem Loch",
            transportableShape: "forme de l'objet",
            transportableColor: "couleur de l'objet",
            transportableRed:  "l'objet est rouge",
            transportableBlue: "l'objet est bleu",
            transportableSquare: "l'objet est carré",
            greenCell: "auf grünem Feld",
            brownCell: "auf braunem Feld",
            markedCell: "auf markiertem Feld",
            platformInFront: "vor Plattform",
            platformInFrontAndBelow: "vor und über Plattform",
            platformAbove: "unter Plattform",
            gridEdgeInFront: "vor Rand des Gitters",
            obstacleInFront: "vor Hindernis",
            obstacleRight: "Hindernis rechts",
            obstacleLeft: "Hindernis links",
            obstacleEast: "Hindernis rechts",
            obstacleWest: "Hindernis links",
            obstacleNorth: "Hindernis oben",
            obstacleSouth: "Hindernis unten",
            paintInFront: "vor Farbe",
            paintNorthWest: "TODO TRANSLATE",
            paintNorth: "TODO TRANSLATE",
            paintNorthEast: "TODO TRANSLATE",
            colorUnder: "auf Farbe",
            numberUnder: "Nummer des Feldes",
            dir: "Richtung des Roboters",
            col: "Spalte des Roboters",
            row: "Zeile des Roboters",
            alert: "gib aus:",
            onPill: "auf einem Bonbon",

            number: "nombre total d'objets à transporter",
            exists: "il existe un objet à transporter ",
            trans_row: "ligne de l'objet à transporter",
            trans_col: "colonne d'objet à transporter",
         },
         code: {
            wait: "warte",
            right: "dreheRechts",
            left: "dreheLinks",
            turnAround: "demiTour",
            jump: "sauter",
            forward: "geheVorwaerts",
            east: "droite",
            south: "bas",
            west: "gauche",
            north: "haut",
            paint: "bemaleFeld",
            pickTransportable: "ramasserTransportable",
            dropTransportable: "deposerTransportable",
            onTransportable: "surTransportable",
            onHole: "surTrou",
            transportableShape: "formeObjet",
            transportableColor: "couleurObjet",
            transportableRed: "objetRouge",
            transportableBlue: "objetBleu",
            transportableSquare: "objetCarre",
            greenCell: "caseVerte",
            brownCell: "caseMarron",
            markedCell: "caseMarquee",
            platformInFront: "plateformeDevant",
            platformInFrontAndBelow: "plateformeDevantPlusBas",
            platformAbove: "plateformeAuDessus",
            gridEdgeInFront: "vorGitterrand",
            obstacleInFront: "vorHindernis",
            obstacleRight: "obstacleDroite",
            obstacleLeft: "obstacleGauche",
            obstacleEast: "obstacleDroite",
            obstacleWest: "obstacleGauche",
            obstacleNorth: "obstacleHaut",
            obstacleSouth: "obstacleBas",
            paintInFront: "vorFarbe",
            paintNorthWest: "TODO TRANSLATE",
            paintNorth: "TODO TRANSLATE",
            paintNorthEast: "TODO TRANSLATE",
            colorUnder: "couleurCase",
            numberUnder: "nombreCase",
            dir: "Richtung",
            col: "Spalte",
            row: "Zeile",
            alert: "gib_aus",
            onPill: "surPastille",

            number: "nombreTransportables",
            exists: "existeTransportable",
            trans_row: "ligneTransportable",
            trans_col: "colonneTransportable",
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
      }
   };
   var strings = languageStrings[stringsLanguage];
   
   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;

   var context = {
      display: display,
      infos: infos,
      robot: {},
      strings: strings,
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

   context.nbRobots = 1;

   context.getRobotItem = function(iRobot) {
      var items = context.getItems(undefined, undefined, {category: "robot"});
      return items[iRobot];
   };

   context.robot.forward = function(callback) {
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

   context.robot.jump = function(callback) {
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

   context.robot.turnAround = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var newDir = (item.dir + 2) % 4;
      moveRobot(item.row, item.col, newDir, callback);
   };

   context.robot.platformInFront = function(callback) {
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

   context.robot.platformInFrontAndBelow = function(callback) {
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

   context.robot.platformAbove = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var platforms = context.getItems(robot.row - 1, robot.col, {category: "platform"});
      context.runner.noDelay(callback, (platforms.length > 0));
   }
         
   context.robot.gridEdgeInFront = function(callback) {
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

   context.robot.paint = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      paint(item.row, item.col, "paint", callback);
   };

   context.robot.paintGray = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      paint(item.row, item.col, "paintGray", callback);
   };

   context.robot. wait = function(callback) {
      context.waitDelay(callback);
   };

   context.robot.right = function(callback) {
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

   context.robot.left = function(callback) {
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

   context.robot.east = function(callback) {
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

   context.robot.west = function(callback) {
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

   context.robot.north = function(callback) {
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

   context.robot.south = function(callback) {
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

   context.robot.itemInFront = function(callback) {
      var itemsInFront = getItemsInFront({isObstacle: true});
      context.callCallback(callback, itemsInFront.length > 0);
   };

   context.robot.obstacleInFront = function(callback) {
      categoryInFront("obstacle", false, callback);
   };

   context.robot.obstacleRight = function(callback) {
      var coords = getCoordsInFront(1);
      var items = context.getItems(coords.row, coords.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.obstacleLeft = function(callback) {
      var coords = getCoordsInFront(-1);
      var items = context.getItems(coords.row, coords.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.obstacleEast = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row, robot.col + 1, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.obstacleWest = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row, robot.col - 1, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.obstacleNorth = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row - 1, robot.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.obstacleSouth = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row + 1, robot.col, {isObstacle: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.paintInFront = function(callback) {
      var coords = getCoordsInFront(0);
      var items = context.getItems(coords.row, coords.col, {isPaint: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.paintNorthWest = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row - 1, robot.col - 1, {isPaint: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.paintNorth = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row - 1, robot.col, {isPaint: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.paintNorthEast = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row - 1, robot.col + 1, {isPaint: true});
      context.callCallback(callback, items.length > 0);
   };

   context.robot.colorUnder = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {hasColor: true});
      if (itemsUnder.length == 0) {
         context.callCallback(callback, "blanc");
      } else {
         context.callCallback(callback, infos.itemTypes[itemsUnder[0].type].color);
      }
   };

   context.robot.numberUnder = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {category: "number"});
      if (itemsUnder.length == 0) {
         context.callCallback(callback, 0);
      } else {
         context.callCallback(callback, infos.itemTypes[itemsUnder[0].type].value);
      }
   };

   context.robot.gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront(0);
      var gridEdgeInFront = false;
      if (isOutsideGrid(coords.row, coords.col)) {
         gridEdgeInFront = true;
      } else if (context.tiles[coords.row][coords.col] == 0) {
         gridEdgeInFront = true;
      }
      context.callCallback(callback, gridEdgeInFront);
   };

   context.robot.col = function(callback) {
      var item = context.getRobotItem(context.curRobot);
      var col = item.col + 1;
      if (context.curRobot == 1) {
         col = context.nbCols - col + 1;
      }
      context.callCallback(callback, col);
   };

   context.robot.row = function(callback) {
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

   context.robot.onTransportable = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var transportables = context.getItems(robot.row, robot.col, {isTransportable: true});
      context.callCallback(callback, (transportables.length != 0));
   };

   context.robot.onHole = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var holes = context.getItems(robot.row, robot.col, {isHole: true});
      context.callCallback(callback, (holes.length != 0));
   };

   context.robot.transportableColor = function(callback) {
      var result = getTransportableProperty("color");
      context.callCallback(callback, result);
   };

   context.robot.transportableSquare = function(callback) {
      var result = getTransportableProperty("shape");
      context.callCallback(callback, result == "carré");
   };

   context.robot.transportableRed = function(callback) {
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

   context.robot.greenCell = function(callback) {
      robotCellIsColor(callback, "vert");
   };

   context.robot.markedCell = function(callback) {
      robotCellIsColor(callback, "marker");
   };

   context.robot.brownCell = function(callback) {
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

   context.robot.transportableShape = function(callback) {
      var result = getTransportableProperty("shape");
      context.callCallback(callback, result);
   };

   context.robot.pickTransportable = function(callback) {
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

   context.robot.dropTransportable = function(callback) {
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
   context.robot.dir = function(callback) {
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
      context.nbTransportedItems = 0;
      context.nbCollectedItems = 0;
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
      $("#errors").html("");
      resetBoard();
//      context.blocklyHelper.updateSize();
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

   /* structure is as follows:
      {
         group: [{
            name: "someName",
            category: "categoryName",
            // yieldsValue: optional true: Makes a block with return value rather than simple command
            // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
            // handler: optional handler function. Otherwise the function context.group.someName will be used
            // blocklyJson: optional Blockly JSON objects
            // blocklyInit: optional function for Blockly.Blocks[name].init
            //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
            // blocklyXml: optional Blockly xml string
            // codeGenerators: optional object:
            //   { Python: function that generates Python code
            //     JavaScript: function that generates JS code
            //   }
         }]
      }
      [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
      [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
    */
   
   context.customBlocks = {
      robot: {
         actions: {
            blocks: [  
               { name: "paint" },
               { name: "paintGrey" },
               { name: "forward" },
               { name: "turnAround" },
               { name: "jump" },
               { name: "right" },
               { name: "left" },
               { name: "east" },
               { name: "west" },
               { name: "north" },
               { name: "south" },
               { name: "wait" },
               { name: "pickTransportable" },
               { name: "dropTransportable" },
               { name: "dropTransportable" }
            ]
         },
         sensors: {
            blocks: [
               { name: "onTransportable",    yieldsValue: true },
               { name: "onHole",             yieldsValue: true },
               { name: "transportableShape", yieldsValue: true },
               { name: "transportableColor", yieldsValue: true },
               { name: "transportableRed",   yieldsValue: true },
               { name: "transportableBlue",  yieldsValue: true },
               { name: "transportableSquare", yieldsValue: true },
               
               { name: "greenCell",          yieldsValue: true },
               { name: "brownCell",          yieldsValue: true },
               { name: "markedCell",         yieldsValue: true },
               
               { name: "obstacleInFront",    yieldsValue: true },
               { name: "obstacleRight",      yieldsValue: true },
               { name: "obstacleLeft",       yieldsValue: true },
               { name: "obstacleEast",       yieldsValue: true },
               { name: "obstacleWest",       yieldsValue: true },
               { name: "obstacleNorth",      yieldsValue: true },
               { name: "obstacleSouth",      yieldsValue: true },
               
               { name: "paintInFront",       yieldsValue: true },
               { name: "paintNorth",         yieldsValue: true },
               { name: "paintNorthWest",     yieldsValue: true },
               { name: "paintNorthEast",     yieldsValue: true },
               { name: "colorUnder",         yieldsValue: true },
               { name: "numberUnder",        yieldsValue: true },
               { name: "gridEdgeInFront",    yieldsValue: true },
               { name: "platformInFront",    yieldsValue: true },
               { name: "platformInFrontAndBelow", yieldsValue: true },
               { name: "platformAbove",      yieldsValue: true },
               { name: "dir",                yieldsValue: true },
               { name: "col",                yieldsValue: true },
               { name: "row",                yieldsValue: true },
               { name: "onPill",             yieldsValue: true }
            ]
         }
      },
      transport: {
         sensors: {
            blocks: [
               { name: "number", yieldsValue: true,                     handler: context.transportable_number },
               { name: "exists", yieldsValue: true,   params: [null],   handler: context.transportable_exists },
               { name: "trans_row",    yieldsValue: true,   params: [null],   handler: context.transportable_row },
               { name: "trans_col",    yieldsValue: true,   params: [null],   handler: context.transportable_col }
            ]
         }
      },
      debug: {
         debug: {
             blocks: [{ name: "alert", params: [null], handler: context.debug_alert }]
         }
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


      var collectibles = context.getItems(newRow, newCol, {isCollectible: true});
      var collected = [];
      while (collectibles.length > 0) {
         var collectible = collectibles[0];
         collected.push(collectible);
         context.items.splice(collectible.index, 1);
         collectibles.splice(0, 1);
         context.nbCollectedItems++;
      }

      function removeItemsElements(items) {
         for (var iItem = 0; iItem < items.length; iItem++) {
             items[iItem].element.remove();
         }
      }

      if (context.display) {
         var attr;
         if (collected.length > 0) {
            context.delayFactory.createTimeout("removeItems" + iRobot + "_" + Math.random(), function() {
               removeItemsElements(collected);
            }, infos.actionDelay);
         }
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
            return false;
         }
         throw("Le robot sort de la grille !");
      }
      var itemsInFront = context.getItems(row, col, {isObstacle: true});
      if (itemsInFront.length > 0) {
         if (infos.ignoreInvalidMoves) {
            return false;
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

   return context;
}
