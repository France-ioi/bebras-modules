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
            down: "descendre",
            east: "avancer vers la droite",
            south: "avancer vers le bas",
            west: "avancer vers la gauche",
            north: "avancer vers le haut",
            paint: "peindre la case",
            pickTransportable: "ramasser la bille",
            dropTransportable: "déposer la bille",
            onTransportable: "sur une bille",
            onRoundObject: "sur un objet rond",
            onSquareObject: "sur un objet carré",
            onTriangleObject: "sur un objet triangle",
            onDottedObject: "sur un objet rempli de points",
            onFullObject: "sur un objet plein",
            onStripedObject: "sur un objet rayé",
            onHole: "sur un trou",
            transportableShape: "forme de l'objet",
            transportableColor: "couleur de l'objet",
            transportableRed:  "l'objet est rouge",
            transportableBlue: "l'objet est bleu",
            transportableSquare: "l'objet est carré",
            greenCell: "sur une case verte",
            brownCell: "sur une case marron",
            markedCell: "sur une case marquée",
            addPlatformAbove: "construire une plateforme au dessus",
            addPlatformInFront: "construire une plateforme devant",
            platformInFront: "plateforme devant",
            platformInFrontAndBelow: "plateforme devant plus bas",
            platformAbove: "plateforme au dessus",
            gridEdgeInFront: "bord de la grille devant",
            gridEdgeAbove: "bord de la grille au dessus",
            gridEdgeBelow: "bord de la grille en dessous",
            gridEdgeEast: "bord de la grille à droite",
            gridEdgeWest: "bord de la grille à gauche",
            obstacleInFront: "obstacle devant",
            obstacleRight: "obstacle à droite",
            obstacleLeft: "obstacle à gauche",
            obstacleEast: "obstacle à droite",
            obstacleWest: "obstacle à gauche",
            obstacleNorth: "obstacle en haut",
            obstacleSouth: "obstacle en bas",
            paintInFront: "peinture devant",
            paintOnCell: "peinture sur la case",
            paintNorthWest: "peinture en haut à gauche",
            paintNorth: "peinture en haut",
            paintNorthEast: "peinture en haut à droite",
            colorUnder: "couleur de la case",
            numberUnder: "nombre sur la case",
            writeNumber: "mettre le nombre de la case à",
            dir: "direction du robot",
            col: "colonne du robot",
            row: "ligne du robot",
            alert: "alerte",
            onPill: "sur une pastille",

            number: "nombre total d'objets à transporter",
            exists: "il existe un objet à transporter ",
            trans_row: "ligne de l'objet à transporter",
            trans_col: "colonne d'objet à transporter"
         },
         code: {
            wait: "attendre",
            right: "tournerDroite",
            left: "tournerGauche",
            turnAround: "demiTour",
            jump: "sauter",
            down: "descendre",
            forward: "avancer",
            east: "droite",
            south: "bas",
            west: "gauche",
            north: "haut",
            paint: "peindre",
            pickTransportable: "ramasser",
            dropTransportable: "deposer",
            onTransportable: "surObjet",
            onRoundObject: "surRond",
            onSquareObject: "surCarre",
            onTriangleObject: "surTriangle",
            onDottedObject: "surObjetPoints",
            onFullObject: "surObjetPlein",
            onStripedObject: "surObjetRaye",
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
            addPlatformAbove: "construirePlateformeAuDessus",
            addPlatformInFront: "construirePlateformeDevant",
            platformInFrontAndBelow: "plateformeDevantPlusBas",
            platformAbove: "plateformeAuDessus",
            gridEdgeInFront: "bordGrilleDevant",
            gridEdgeEast: "bordGrilleDroite",
            gridEdgeWest: "bordGrilleGauche",
            gridEdgeAbove: "bordGrilleAuDessus",
            gridEdgeBelow: "bordGrilleEnDessous",
            obstacleInFront: "obstacleDevant",
            obstacleRight: "obstacleADroite",
            obstacleLeft: "obstacleAGauche",
            obstacleEast: "obstacleDroite",
            obstacleWest: "obstacleGauche",
            obstacleNorth: "obstacleHaut",
            obstacleSouth: "obstacleBas",
            paintInFront: "peintureDevant",
            paintOnCell: "peintureSurCase",
            paintNorthWest: "peintureHautGauche",
            paintNorth: "peintureHaut",
            paintNorthEast: "peintureHautDroite",
            colorUnder: "couleurCase",
            numberUnder: "nombreCase",
            writeNumber: "ecrireNombre",
            dir: "direction",
            col: "colonne",
            row: "ligne",
            alert: "alerte",
            onPill: "surPastille",

            number: "nombreTransportables",
            exists: "existeTransportable",
            trans_row: "ligneTransportable",
            trans_col: "colonneTransportable"
         },
         description: {
                platformAbove: "plateformeAuDessus() : y a-t-il une plateforme au dessus du robot ?",
                obstacleInFront: "obstacleDevant() : y a-t-il un obstacle devant le robot ?",
                onHole: "surTrou() : le robot est-il sur un trou ?",
                onTransportable: "surObjet() : le robot est-il sur un objet ramassable ?",
                onRoundObject: "surRond() : le robot est-il sur un objet rond ?",
                onSquareObject: "surCarre() : le robot est-il sur un objet carré ?",
                onTriangleObject: "surTriangle() : le robot est-il sur un objet triangle ?",
                onDottedObject: "surObjetPoints() : le robot est-il sur un objet rempli de points ?",
                onFullObject: "surObjetPlein() : le robot est-il sur un objet plein ?",
                onStripedObject: "surObjetRaye() : le robot est-il sur un objet rayé ?",
                paintOnCell: "peintureSurCase() : la case du robot est-elle peinte ?",
                gridEdgeInFront: "bordGrilleDevant() : le robot est-il devant le bord de la grille ?",
                gridEdgeEast: "bordGrilleGauche() : le bord de la grille est-il juste à gauche du robot ?",
                gridEdgeWest: "bordGrilleDroite() : le bord de la grille est-il juste à droite du robot ?",
                gridEdgeAbove: "bordGrilleAuDessus() : le bord de la grille est-il juste au dessus du robot ?",
                gridEdgeBelow: "bordGrilleEnDessous() : le bord de la grille est-il juste en dessous du robot ?",
                platformInFront: "plateformeDevant() : y a-t-il une plateforme devant le robot ?",
                numberUnder: "nombreCase() : nombre inscrit sur la case du robot",
                col: "colonne() : colonne du robot",
                row: "ligne() : ligne du robot",
                paintNorth: "peintureHaut() : la case au dessus est-elle peinte ?",
                paintNorthWest: "peintureHautGauche() : la case au dessus à gauche est-elle peinte ?",
                paintNorthEast: "peintureHautDroite() : la case au dessus à droite est-elle peinte ?",
                writeNumber: "ecrireNombre(nombre) : inscrit le nombre sur la case du robot"
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
         exit_grid: "Le robot sort de la grille !",
         nothingToPickUp: "Rien à ramasser",
         alreadyTransportingObject: "Le robot transporte déjà un objet",
         jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
         jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
         jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
         downOutsideGrid: "Le robot essaie de descendre en dehors de la grille !",
         downNoPlatform: "Le robot essaie de descendre mais il n'y a pas de plateforme en dessous !",
         falls: "Le robot se jette dans le vide",
         willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
         dropWithoutItem: "Le robot essaie de déposer un objet mais n'en transporte pas.",
         droppedAllItems: "Bravo, vous avez déposé toutes les objets !",
         obstacleOnCell: "Il y a un obstacle sur cette case",
         platformOnCell: "Il y a déjà une plateforme sur cette case"
      },
      de: {
         label: {
            wait: "warte",
            right: "drehe nach rechts",
            left: "drehe nach links",
            turnAround: "faire demi-tour",
            jump: "sauter",
            down: "descendre",
            forward: "gehe vorwärts",
            east: "gehe nach rechts",
            south: "gehe nach unten",
            west: "gehe nach links",
            north: "gehe nach oben",
            paint: "bemale das Feld",
            pickTransportable: "Murmel aufheben",
            dropTransportable: "Murmel ablegen",
            onTransportable: "auf einer Murmel",
            onRoundObject: "sur un objet rond",
            onSquareObject: "sur un objet carré",
            onTriangleObject: "sur un objet triangle",
            onDottedObject: "sur un objet rempli de points",
            onFullObject: "sur un objet plein",
            onStripedObject: "sur un objet rayé",
            onHole: "auf einem Loch",
            transportableShape: "forme de l'objet",
            transportableColor: "couleur de l'objet",
            transportableRed:  "l'objet est rouge",
            transportableBlue: "l'objet est bleu",
            transportableSquare: "l'objet est carré",
            greenCell: "auf grünem Feld",
            brownCell: "auf braunem Feld",
            markedCell: "auf markiertem Feld",
            addPlatformAbove: "construire une plateforme au dessus",
            addPlatformInFront: "construire une plateforme devant",
            platformInFront: "vor Plattform",
            platformInFrontAndBelow: "vor und über Plattform",
            platformAbove: "unter Plattform",
            gridEdgeInFront: "vor Rand des Gitters",
            gridEdgeEast: "bord de la grille à droite",
            gridEdgeWest: "bord de la grille à gauche",
            gridEdgeAbove: "bord de la grille au dessus",
            gridEdgeBelow: "bord de la grille en dessous",
            obstacleInFront: "vor Hindernis",
            obstacleRight: "Hindernis rechts",
            obstacleLeft: "Hindernis links",
            obstacleEast: "Hindernis rechts",
            obstacleWest: "Hindernis links",
            obstacleNorth: "Hindernis oben",
            obstacleSouth: "Hindernis unten",
            paintInFront: "vor Farbe",
            paintOnCell: "peinture sur la case",
            paintNorthWest: "TODO TRANSLATE",
            paintNorth: "TODO TRANSLATE",
            paintNorthEast: "TODO TRANSLATE",
            colorUnder: "auf Farbe",
            numberUnder: "Nummer des Feldes",
            writeNumber: "Write a number",
            dir: "Richtung des Roboters",
            col: "Spalte des Roboters",
            row: "Zeile des Roboters",
            alert: "gib aus:",
            onPill: "auf einem Bonbon",

            number: "nombre total d'objets à transporter",
            exists: "il existe un objet à transporter ",
            trans_row: "ligne de l'objet à transporter",
            trans_col: "colonne d'objet à transporter"
         },
         code: {
            wait: "warte",
            right: "dreheRechts",
            left: "dreheLinks",
            turnAround: "demiTour",
            jump: "sauter",
            down: "descendre",
            forward: "geheVorwaerts",
            east: "droite",
            south: "bas",
            west: "gauche",
            north: "haut",
            paint: "bemaleFeld",
            pickTransportable: "ramasserTransportable",
            dropTransportable: "deposerTransportable",
            onTransportable: "surTransportable",
            onRoundObject: "sur un objet rond",
            onSquareObject: "sur un objet carré",
            onTriangleObject: "sur un objet triangle",
            onDottedObject: "sur un objet rempli de points",
            onFullObject: "sur un objet plein",
            onStripedObject: "sur un objet rayé",
            onHole: "surTrou",
            transportableShape: "formeObjet",
            transportableColor: "couleurObjet",
            transportableRed: "objetRouge",
            transportableBlue: "objetBleu",
            transportableSquare: "objetCarre",
            greenCell: "caseVerte",
            brownCell: "caseMarron",
            markedCell: "caseMarquee",
            addPlatformAbove: "addPlatformAbove",
            addPlatformInFront: "construirePlatformDevant",
            platformInFront: "plateformeDevant",
            platformInFrontAndBelow: "plateformeDevantPlusBas",
            platformAbove: "plateformeAuDessus",
            gridEdgeInFront: "vorGitterrand",
            gridEdgeEast: "bordGrilleDroite",
            gridEdgeWest: "bordGrilleGauche",
            gridEdgeAbove: "bordGrilleAuDessus",
            gridEdgeBelow: "bordGrilleEnDessous",
            obstacleInFront: "vorHindernis",
            obstacleRight: "obstacleDroite",
            obstacleLeft: "obstacleGauche",
            obstacleEast: "obstacleDroite",
            obstacleWest: "obstacleGauche",
            obstacleNorth: "obstacleHaut",
            obstacleSouth: "obstacleBas",
            paintInFront: "vorFarbe",
            paintOnCell: "peintureSurCase",
            paintNorthWest: "TODO TRANSLATE",
            paintNorth: "TODO TRANSLATE",
            paintNorthEast: "TODO TRANSLATE",
            colorUnder: "couleurCase",
            numberUnder: "nombreCase",
            writeNumber: "TODO TRANSLATE",
            dir: "Richtung",
            col: "Spalte",
            row: "Zeile",
            alert: "gib_aus",
            onPill: "surPastille",

            number: "nombreTransportables",
            exists: "existeTransportable",
            trans_row: "ligneTransportable",
            trans_col: "colonneTransportable"
         },
         description: {
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
         exit_grid: "Le robot sort de la grille !",
         nothingToPickUp: "Rien à ramasser",
         alreadyTransportingObject: "Le robot transporte déjà un objet",
         jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
         jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
         jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
         downOutsideGrid: "Le robot essaie de descendre en dehors de la grille !",
         downNoPlatform: "Le robot essaie de descendre mais il n'y a pas de plateforme en dessous !",
         falls: "Le robot se jette dans le vide",
         willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
         dropWithoutItem: "Le robot essaie de déposer un objet mais n'en transporte pas.",
         droppedAllItems: "Bravo, vous avez déposé toutes les objets !",
         obstacleOnCell: "Il y a un obstacle sur cette case",
         platformOnCell: "Il y a déjà une plateforme sur cette case"
      },
      es: {
         label: {
            wait: "espere",
            right: "girar a la derecha",
            left: "girar a la izquierda",
            forward: "avanzar",
            turnAround: "dar media vuelta",
            jump: "saltar",
            down: "descender",
            east: "avanzar hacia la derecha",
            south: "avanzar hacia abajo",
            west: "avanzar hacia la izquierda",
            north: "avanzar hacia arriba",
            paint: "pintar la casilla",
            pickTransportable: "recoger la bola",
            dropTransportable: "dejar caer la bola",
            onTransportable: "sobre una bola",
            onRoundObject: "sur un objet rond",
            onSquareObject: "sur un objet carré",
            onTriangleObject: "sur un objet triangle",
            onDottedObject: "sur un objet rempli de points",
            onFullObject: "sur un objet plein",
            onStripedObject: "sur un objet rayé",
            onHole: "sobre un agujero",
            transportableShape: "forma del objeto",
            transportableColor: "color del objeto",
            transportableRed:  "el objeto es rojo",
            transportableBlue: "el objeto es azul",
            transportableSquare: "el objeto es cuadrado",
            greenCell: "sobre una casilla verde",
            brownCell: "sobre una casilla café",
            markedCell: "sobre una casilla marcada",
            addPlatformAbove: "construir una plataforma por encima",
            addPlatformInFront: "construir una plataforma por adelante",
            platformInFront: "plataforma adelante",
            platformInFrontAndBelow: "plataforma adelante y abajo",
            platformAbove: "plataforma por encima",
            gridEdgeInFront: "borde de la cuadrícula adelante",
            gridEdgeAbove: "borde de la cuadrícula arriba",
            gridEdgeBelow: "borde de la cuadrícula abajo",
            gridEdgeEast: "borde de la cuadrícula a la derecha",
            gridEdgeWest: "borde de la cuadrícula a la izquierda",
            obstacleInFront: "obstáculo adelante",
            obstacleRight: "obstáculo a la derecha",
            obstacleLeft: "obstáculo a la izquierda",
            obstacleEast: "obstáculo a la derecha",
            obstacleWest: "obstáculo a la izquierda",
            obstacleNorth: "obstáculo arriba",
            obstacleSouth: "obstáculo abajo",
            paintInFront: "casilla pintada al frente",
            paintOnCell: "en casilla pintada",
            paintNorthWest: "casilla pintada arriba a la izquierda",
            paintNorth: "casilla pintada arriba",
            paintNorthEast: "casilla pintada arriba a la derecha",
            colorUnder: "color de la casilla",
            numberUnder: "número en la casilla",
            writeNumber: "escribir el número de la casilla en",
            dir: "dirección del robot",
            col: "columna del robot",
            row: "fila del robot",
            alert: "alerta",
            onPill: "sobre una pastilla",

            number: "número total de objetos a transportar",
            exists: "existe un objeto a transportar ",
            trans_row: "fila del objeto a transportar",
            trans_col: "columna del objeto a transportar"
         },
         code: {
            wait: "esperar",
            right: "girarDerecha",
            left: "girarIzquierda",
            turnAround: "mediaVuelta",
            jump: "saltar",
            down: "descender",
            forward: "avanzar",
            east: "derecha",
            south: "abajo",
            west: "izquierda",
            north: "arriba",
            paint: "pintar",
            pickTransportable: "recoger",
            dropTransportable: "soltar",
            onTransportable: "sobreObjeto",
            onRoundObject: "sur un objet rond",
            onSquareObject: "sur un objet carré",
            onTriangleObject: "sur un objet triangle",
            onDottedObject: "sur un objet rempli de points",
            onFullObject: "sur un objet plein",
            onStripedObject: "sur un objet rayé",
            onHole: "sobreAgujero",
            transportableShape: "formaObjeto",
            transportableColor: "colorObjeto",
            transportableRed: "objetoRojo",
            transportableBlue: "objetoAzul",
            transportableSquare: "objetoCuadrado",
            greenCell: "casillaVerde",
            brownCell: "casillaCafé",
            markedCell: "casillaMarcada",
            platformInFront: "plataformaAdelante",
            addPlatformAbove: "construirPlataformaArriba",
            addPlatformInFront: "construirPlataformaAdelante",
            platformInFrontAndBelow: "plateformeDevantPlusBas",
            platformAbove: "plataformaArriba",
            gridEdgeInFront: "bordeCuadriculaAdelante",
            gridEdgeEast: "bordeCuadriculaDerecha",
            gridEdgeWest: "bordeCuadriculaIzquierda",
            gridEdgeAbove: "bordeCuadriculaArriba",
            gridEdgeBelow: "bordeCuadriculaAbajo",
            obstacleInFront: "obstaculoAdelante",
            obstacleRight: "obstaculoDerecha",
            obstacleLeft: "obstaculoIzquierda",
            obstacleEast: "obstaculoDerecha",
            obstacleWest: "obstaculoIzquierda",
            obstacleNorth: "obstaculoArriba",
            obstacleSouth: "obstaculoAbajo",
            paintInFront: "pintadoAdelante",
            paintOnCell: "pinturaEnCasilla",
            paintNorthWest: "pinturaArribaIzquierda",
            paintNorth: "pinturaArriba",
            paintNorthEast: "pinturaArribaDerecha",
            colorUnder: "colorCasilla",
            numberUnder: "numeroCasilla",
            writeNumber: "escribirNumero",
            dir: "direccion",
            col: "columna",
            row: "fila",
            alert: "alerta",
            onPill: "sobrePastilla",

            number: "numeroTransportables",
            exists: "existeTransportable",
            trans_row: "filaTransportable",
            trans_col: "columnaTransportable"
         },
         description: {
                platformAbove: "plataformaArriba() : ¿hay una plataforma arriba del robot?",
                obstacleInFront: "obstáculoAdelante() : ¿hay un obstáculo adelante del robot?",
                onHole: "sobreAgujero() : ¿se encuentra el robot sobre un agujero?",
                onTransportable: "sobreObjeto() : ¿se encuentra el robot sobre un objeto que puede recoger?",
                paintOnCell: "pinturaEnCasilla() : ¿está pintada la casilla en la que está el robot?",
                gridEdgeInFront: "bordeCuadriculaAdelante() : ¿está el borde de la cuadrícula justo adelante del robot?",
                gridEdgeEast: "bordeCuadriculaDerecha() : ¿está el borde de la cuadrícula justo a la izquierda del robot?",
                gridEdgeWest: "bordeCuadriculaIzquierda() : ¿está el borde de la cuadrícula justo a la izquierda del robot?",
                gridEdgeAbove: "bordeCuadriculaArriba() : ¿está el borde de la cuadrícula justo arriba del robot?",
                gridEdgeBelow: "bordeCuadriculaAbajo() : ¿está el borde de la cuadrícula justo abajo del robot?",
                platformInFront: "plataformaAdelante() : ¿hay una plataforma adelante del robot?",
                numberUnder: "numeroCasilla() : número escrito sobre la casilla del robot",
                col: "columna() : columna del robot",
                row: "fila() : fila del robot",
                paintNorth: "pintadoAdelante() : ¿se encuentra pintada la casilla de adelante?",
                paintNorthWest: "pintadoArribaDerecha() : ¿se encuentra pintada la casilla de arriba a la derecha?",
                paintNorthEast: "pintadoArribaIzquierda() : ¿se encuentra pintada la casilla de arriba a la izquierda?"
         },
         obstacle: "¡El robot intenta moverse sobre un obstáculo!",
         exit_grid: "¡El robot salió de la cuadrícula!",
         nothingToPickUp: "No hay algo para recoger",
         alreadyTransportingObject: "El robot ya transporta un objeto",
         jumpOutsideGrid: "¡El robot intenta saltar fuera de la cuadrícula!",
         jumpObstacleBlocking: "El robot intenta saltar pero hay un obstáculo que lo bloquea",
         jumpNoPlatform: "¡El robot intenta saltar pero no hay una plataforma arriba!",
         downOutsideGrid: "¡El robot intenta descender fuera de la cuadrícula!",
         downNoPlatform: "¡El robot intenta descender pero no hay plataforma abajo!",
         falls: "El robot cae al vacío",
         willFallAndCrash: "¡El robot va a caer y chocar!",
         dropWithoutItem: "El robot intenta soltar un objeto, pero no carga nada.",
         droppedAllItems: "¡Bien hecho! ¡Ha soltado todos los objetos!",
         obstacleOnCell: "Hay un obstáculo en esta casilla",
         platformOnCell: "Ya hay una plataforma sobre esta casilla"
      }
   };

   function replaceStringsRec(source, dest) {
      if ((typeof source != "object") || (typeof dest != "object")) {
         return;
      }
      for (var key1 in source) {
         if (dest[key1] != undefined) {
            if (typeof dest[key1] == "object") {
               replaceStringsRec(source[key1], dest[key1]);
            } else {
               dest[key1] = source[key1];
            }
         }
      }
   }

   var strings = languageStrings[stringsLanguage];
   if (infos.languageStrings != undefined) {
      if (infos.languageStrings.blocklyRobot_lib != undefined) {
         var infosStrings = infos.languageStrings.blocklyRobot_lib;
         replaceStringsRec(infosStrings, strings);
      }
   }

   var cells = [];
   var colsLabels = [];
   var rowsLabels = [];
   var scale = 1;
   var paper;

   if (infos.leftMargin === undefined) {
      infos.leftMargin = 0;
   }
   if (infos.topMargin === undefined) {
      if (infos.showLabels) {
         infos.topMargin = 0;
      } else {
         infos.topMargin = infos.cellSide / 2;
      }
   }
   if (infos.showLabels) {      infos.leftMargin += infos.cellSide;
      infos.topMargin += infos.cellSide;
   }

   var context = {
      display: display,
      infos: infos,
      robot: {},
      strings: strings
   };

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   };

   context.waitDelay = function(callback, value) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      context.runner.noDelay(callback, value);
   };

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
         throw(strings.falls);
      }
      if (row - coords.row > 2) {
         context.lost = true;
         throw(strings.willFallAndCrash);
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
         throw(strings.jumpOutsideGrid);
      }
      var obstacle = context.getItems(item.row - 2, item.col, {category: "obstacle"});
      if (obstacle.length > 0) {
         context.lost = true;
         throw(strings.jumpObstacleBlocking);
      }
      var platforms = context.getItems(item.row - 1, item.col, {category: "platform"});
      if (platforms.length == 0) {
         context.lost = true;
         throw(strings.jumpNoPlatform);
      }
      context.nbMoves++;
      moveRobot(item.row - 2, item.col, item.dir, callback);
   };

   context.robot.down = function(callback) {
      if (!infos.hasGravity) {
         throw("Error: can't go down without gravity");
      }
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      if (isOutsideGrid(item.row + 2, item.col)) {
         context.lost = true;
         throw(strings.downOutsideGrid);
      }
      var platforms = context.getItems(item.row + 3, item.col, {category: "platform"});
      if (platforms.length == 0) {
         context.lost = true;
         throw(strings.downNoPlatform);
      }
      context.nbMoves++;
      moveRobot(item.row + 2, item.col, item.dir, callback);
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
   };

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
   };

   context.robot.platformAbove = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var platforms = context.getItems(robot.row - 1, robot.col, {category: "platform"});
      context.runner.noDelay(callback, (platforms.length > 0));
   };

   context.robot.gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront(0);
      gridEdgeCoord(coords.row, coords.col, callback);
   };

   function gridEdgeCoord(row, col, callback) {
      var gridEdge = false;
      if (isOutsideGrid(row, col)) {
         gridEdge = true;
      } else if (context.tiles[row][col] == 0) {
         gridEdge = true;
      }
      context.runner.noDelay(callback, gridEdge);
   }

   context.robot.gridEdgeAbove = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      gridEdgeCoord(robot.row - 1, robot.col, callback);
   };

   context.robot.gridEdgeBelow = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      gridEdgeCoord(robot.row + 1, robot.col, callback);
   };

   context.robot.gridEdgeEast = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      gridEdgeCoord(robot.row, robot.col + 1, callback);
   };

   context.robot.gridEdgeWest = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      gridEdgeCoord(robot.row, robot.col - 1, callback);
   };

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
   }

   function createItem(newItem) {
      var robot = context.getRobotItem(context.curRobot);
      if (isOutsideGrid(newItem.row, newItem.col)) {
         throw("La case est en dehors de la grille");
      }
      var addItem = function() {
         resetItem(newItem);
         if (context.display) {
            resetItemsZOrder(newItem.row, newItem.col);
            if ((robot.col != newItem.col) || (robot.row != newItem.row)) {
               resetItemsZOrder(robot.row, robot.col);
            }
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

   function addPlatform(row, col, callback) {
      var platforms = context.getItems(row, col, {category: "platform"});
      if (platforms.length > 0) {
         throw(strings.platformOnCell);
      }
      var obstacles = context.getItems(row, col, {isObstacle: true});
      if (obstacles.length > 0) {
         throw(strings.obstacleOnCell);
      }
      createItem({row: row, col: col, type: "platform"});
      context.waitDelay(callback);
   }

   context.robot.addPlatformInFront = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var coords = getCoordsInFront(robot.dir);
      addPlatform(coords.row + 1, coords.col, callback);
   };

   context.robot.addPlatformAbove = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      addPlatform(robot.row - 1, robot.col, callback);
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
         createItem(newItem);
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

   context.robot.wait = function(callback) {
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
         context.nbMoves++;
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
         context.nbMoves++;
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
         context.nbMoves++;
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
         context.nbMoves++;
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

   context.robot.paintOnCell = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var items = context.getItems(robot.row, robot.col, {isPaint: true});
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

   context.robot.writeNumber = function(value, callback) {
      var robot = context.getRobotItem(context.curRobot);
      var itemsUnder = context.getItems(robot.row, robot.col, {category: "number"});
      if (itemsUnder.length == 0) {
         context.callCallback(callback);
      } else {
         itemsUnder[0].type = value;
         if (context.display) {
            redisplayItem(itemsUnder[0]);
         }
         context.callCallback(callback);
      }
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
   };

   context.transportable_exists = function(id, callback) {
      var transportable = findTransportable(id);
      context.runner.noDelay(callback, transportable != null);
   };

   context.transportable_col = function(id, callback) {
      var transportable = findTransportable(id);
      var res = 0;
      if (transportable != null) {
         res = transportable.col + 1;
      }
      context.callCallback(callback, res);
   };

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

   context.robot.onRoundObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isRound: true});
      context.callCallback(callback, (objects.length != 0));
   };

   context.robot.onSquareObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isSquare: true});
      context.callCallback(callback, (objects.length != 0));
   };

   context.robot.onTriangleObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isTriangle: true});
      context.callCallback(callback, (objects.length != 0));
   };

   context.robot.onFullObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isFull: true});
      context.callCallback(callback, (objects.length != 0));
   };

   context.robot.onDottedObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isDotted: true});
      context.callCallback(callback, (objects.length != 0));
   };

   context.robot.onStripedObject = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var objects = context.getItems(robot.row, robot.col, {isStriped: true});
      context.callCallback(callback, (objects.length != 0));
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
   };

   context.robot.transportableShape = function(callback) {
      var result = getTransportableProperty("shape");
      context.callCallback(callback, result);
   };

   context.robot.pickTransportable = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var transportables = context.getItems(robot.row, robot.col, {isTransportable: true});
      if (transportables.length == 0) {
         throw(strings.nothingToPickUp);
      }
      /*
      if (transportables[0].rank != context.nbTransportedItems + 1) {
         throw("L'objet n'est pas celui qu'il faut ramasser maintenant.");
      }
      */
      if (context.nbTransportedItems > 0) {
         throw(strings.alreadyTransportingObject);
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
         throw(strings.dropWithoutItem);
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
         throw(strings.droppedAllItems);
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
   };

   var dirNames = ["E", "S", "O", "N"];
   context.robot.dir = function(callback) {
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
      context.nbCollectedItems = 0;
      if (context.display) {
         context.resetDisplay();
         $("#nbMoves").html(context.nbMoves);
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
               { name: "down" },
               { name: "right" },
               { name: "left" },
               { name: "east" },
               { name: "west" },
               { name: "north" },
               { name: "south" },
               { name: "wait" },
               { name: "pickTransportable" },
               { name: "dropTransportable" },
               { name: "dropTransportable" },
               { name: "writeNumber", params: [null] },
               { name: "addPlatformAbove",   yieldsValue: false },
               { name: "addPlatformInFront",   yieldsValue: false }
            ]
         },
         sensors: {
            blocks: [
               { name: "onTransportable",    yieldsValue: true },
               { name: "onRoundObject",      yieldsValue: true },
               { name: "onSquareObject",     yieldsValue: true },
               { name: "onTriangleObject",   yieldsValue: true },
               { name: "onDottedObject",     yieldsValue: true },
               { name: "onStripedObject",    yieldsValue: true },
               { name: "onFullObject",       yieldsValue: true },
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
               { name: "paintOnCell",        yieldsValue: true },
               { name: "paintNorth",         yieldsValue: true },
               { name: "paintNorthWest",     yieldsValue: true },
               { name: "paintNorthEast",     yieldsValue: true },
               { name: "colorUnder",         yieldsValue: true },
               { name: "numberUnder",        yieldsValue: true },
               { name: "gridEdgeInFront",    yieldsValue: true },
               { name: "gridEdgeEast",       yieldsValue: true },
               { name: "gridEdgeWest",       yieldsValue: true },
               { name: "gridEdgeAbove",      yieldsValue: true },
               { name: "gridEdgeBelow",      yieldsValue: true },
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

   // positions and dimensions will be set later by updateScale
   var resetBoard = function() {
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         cells[iRow] = [];
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var itemTypeNum = context.tiles[iRow][iCol];
            if (itemTypeNum > 0) {
               cells[iRow][iCol] = paper.rect(0, 0, 10, 10);
            }
         }
      }
      if (infos.showLabels) {
         for (var iRow = 0; iRow < context.nbRows; iRow++) {
            rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
         }
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
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
      var x = (infos.cellSide * item.col + infos.leftMargin) * scale;
      var y = (infos.cellSide * item.row + infos.topMargin) * scale;
      var itemType = infos.itemTypes[item.type];
      if (itemType.img) {
         item.element = paper.image(itemType.img, x, y, item.side * item.nbStates * scale, item.side * scale);
      } else if (itemType.value !== undefined) {
         item.element = paper.text(x + item.side * scale / 2, y + item.side * scale / 2, itemType.value).attr({"font-size": item.side * scale / 2});
      }
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
         $("#nbMoves").html(context.nbMoves);
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
         throw(strings.exit_grid);
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
      var itemType = infos.itemTypes[item.type];
      var x = (infos.cellSide * item.col + item.offsetX + infos.leftMargin) * scale;
      var y = (infos.cellSide * item.row - (item.side - infos.cellSide) + item.offsetY + infos.topMargin) * scale;
      var xClip = x;
      if (item.dir != undefined) {
//         var dirToState = [3, 0, 1, 2];
         var dirToState = [0, 2, 4, 6];
         x = x - (dirToState[item.dir] * item.side * scale);
      }
      var clipRect = "" + xClip + "," + y + "," + (item.side * scale) + "," + (item.side * scale);
      if (!itemType.img) {
         x += item.side * scale / 2;
         y += item.side * scale / 2;
      }
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
         var marginAsCols = infos.leftMargin / infos.cellSide;
         var marginAsRows = infos.topMargin / infos.cellSide;
         newCellSide = Math.min(400 / (context.nbCols + marginAsCols), 600 / (context.nbRows + marginAsRows));
      } else {
         newCellSide = 0;
      }
      scale = newCellSide / infos.cellSide;
      paper.setSize((infos.cellSide * context.nbCols + infos.leftMargin) * scale, (infos.cellSide * context.nbRows + infos.topMargin) * scale);
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            if (cells[iRow][iCol] != undefined) {
               var x = (infos.cellSide * iCol + infos.leftMargin) * scale;
               var y = (infos.cellSide * iRow + infos.topMargin) * scale;
               cells[iRow][iCol].attr({x: x, y: y, width: infos.cellSide * scale, height: infos.cellSide * scale});
            }
         }
      }
      if (infos.showLabels) {
         for (var iRow = 0; iRow < context.nbRows; iRow++) {
            var x = (infos.leftMargin - infos.cellSide / 2) * scale;
            var y = (infos.cellSide * (iRow + 0.5) + infos.topMargin) * scale;
            rowsLabels[iRow].attr({x: x, y: y}).attr({"font-size": infos.cellSide * scale / 2});
         }
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var x = (infos.cellSide * iCol + infos.leftMargin + infos.cellSide / 2) * scale;
            var y = (infos.topMargin - infos.cellSide / 2) * scale;
            colsLabels[iCol].attr({x: x, y: y}).attr({"font-size": infos.cellSide * scale / 2});
         }
      }
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         redisplayItem(item);
         item.element.attr(itemAttributes(item));
      }
   };

   return context;
};

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
