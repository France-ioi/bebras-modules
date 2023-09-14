var getContext = function(display, infos, curLevel) {
   var localLanguageStrings = {
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
            obstacleInFront: "obstacleDevant",
            gridEdgeEast: "bordGrilleDroite",
            gridEdgeWest: "bordGrilleGauche",
            gridEdgeAbove: "bordGrilleAuDessus",
            gridEdgeBelow: "bordGrilleEnDessous",
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
         messages: {
            nothingToPickUp: "Rien à ramasser",
            alreadyTransporting: "Le robot transporte déjà un objet",
            notTransporting: "Le robot essaie de déposer un objet mais n'en transporte pas.",
            successDroppedAllObjects: "Bravo, vous avez déposé toutes les objets !",
            successMarkersPainted: "Bravo, votre robot a peint le motif !",
            failureMarkersPainted: "Le robot n'a pas peint les bonnes cases.",
            successPickedAllCollectibles: "Bravo, votre robot a tout ramassé !",
            failurePickedAllCollectibles: "Votre robot n'a pas tout ramassé !",
            successReachGeenArea: "Bravo, le robot a atteint la zone verte !",
            failureReachGeenArea: "Le robot n'a pas atteint la zone verte !",
            successOneMarbleInHole: "Bravo, vous avez rangé la bille&nbsp;!",
            successAllMarblesInHoles: "Bravo, vous avez rangé toutes les billes&nbsp;!",
            failureOneMarbleInHole: "La bille est mal rangée !",
            failureAllMarblesInHoles: "Les billes ne sont pas toutes bien rangées !",
            leavesGrid: "Le robot sort de la grille !"
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
         cardinals: {
            north: "Nord",
            south: "Sud",
            west: "Ouest",
            east: "Est"
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
         startingBlockName: "Programme du robot",
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
            turnAround: "drehe um",
            jump: "springe hoch",
            down: "springe runter",
            forward: "gehe vorwärts",
            east: "gehe nach rechts",
            south: "gehe nach unten",
            west: "gehe nach links",
            north: "gehe nach oben",
            paint: "färbe das Feld",
            pickTransportable: "hebe Murmel auf",
            dropTransportable: "lege Murmel ab",
            onTransportable: "auf einer Murmel",
            onRoundObject: "auf einem runden Objekt",
            onSquareObject: "auf einem quadratischen Objekt",
            onTriangleObject: "auf einem dreieckigen Objekt",
            onDottedObject: "auf einem gepunktetem Objekt",
            onFullObject: "auf einem ausgemalten Objekt",
            onStripedObject: "auf einem gestreiften Objekt",
            onHole: "auf einem Loch",
            transportableShape: "Form des Objekts",
            transportableColor: "Farbe des Objekts",
            transportableRed:  "Objekt blau",
            transportableBlue: "Objekt blau",
            transportableSquare: "Object Quadrat",
            greenCell: "auf grünem Feld",
            brownCell: "auf braunem Feld",
            markedCell: "auf markiertem Feld",
            addPlatformAbove: "baue Plateform darüber",
            addPlatformInFront: "baue Plateform davor",
            platformInFront: "vor Plattform",
            platformInFrontAndBelow: "vor und über Plattform",
            platformAbove: "unter Plattform",
            gridEdgeInFront: "vor Rand des Gitters",
            gridEdgeAbove: "unter Rand des Gitters",
            gridEdgeBelow: "über Rand des Gitters",
            gridEdgeEast: "links vom Gitterrand",
            gridEdgeWest: "rechts vom Gitterrand",
            obstacleInFront: "vor Hindernis",
            obstacleRight: "Hindernis rechts",
            obstacleLeft: "Hindernis links",
            obstacleEast: "Hindernis rechts",
            obstacleWest: "Hindernis links",
            obstacleNorth: "Hindernis oben",
            obstacleSouth: "Hindernis unten",
            paintInFront: "vor Farbe",
            paintOnCell: "Farbe auf Feld",
            paintNorthWest: "Farbe oben links",
            paintNorth: "Farbe oben",
            paintNorthEast: "Farbe oben rechts",
            colorUnder: "auf Farbe",
            numberUnder: "Zahl auf dem Feld",
            writeNumber: "ändere Zahl auf dem Feld zu",
            dir: "Richtung des Roboters",
            col: "Spalte des Roboters",
            row: "Zeile des Roboters",
            alert: "gib aus:",
            onPill: "auf einem Bonbon",

            number: "Anzahl Objekte",
            exists: "Objekt vorhanden",
            trans_row: "Zeile des Objekts",
            trans_col: "Spalte des Objekts"
         },
         code: {
            wait: "warte",
            right: "dreheRechts",
            left: "dreheLinks",
            turnAround: "dreheUm",
            jump: "spring",
            down: "geheRunter",
            forward: "geheVorwaerts",
            east: "rechts",
            south: "unten",
            west: "links",
            north: "oben",
            paint: "bemale",
            pickTransportable: "hebeAuf",
            dropTransportable: "legeAb",
            onTransportable: "aufMurmel",
            onRoundObject: "aufRund",
            onSquareObject: "aufQuadrat",
            onTriangleObject: "aufDreieck",
            onDottedObject: "aufGepunktet",
            onFullObject: "aufAusgemalt",
            onStripedObject: "aufGestreift",
            onHole: "aufLoch",
            transportableShape: "objektform",
            transportableColor: "objektfarbe",
            transportableRed: "istRot",
            transportableBlue: "istBlau",
            transportableSquare: "quadrat",
            greenCell: "feldGruen",
            brownCell: "feldBraun",
            markedCell: "feldMarkiert",
            platformInFront: "vorPlattform",
            addPlatformAbove: "bauePlattformDarueber",
            addPlatformInFront: "bauePlattformDavor",
            platformInFrontAndBelow: "vorUeberPlatform",
            platformAbove: "unterPlatform",
            gridEdgeInFront: "vorGitterrand",
            gridEdgeEast: "gitterrandRechts",
            gridEdgeWest: "gitterrandLinks",
            gridEdgeAbove: "unterGitterrand",
            gridEdgeBelow: "ueberGitterrand",
            obstacleInFront: "vorHindernis",
            obstacleRight: "hindernisRechts",
            obstacleLeft: "hindernisAufLinkerSeite",
            obstacleEast: "hindernisAufRechterSeite",
            obstacleWest: "hindernisLinks",
            obstacleNorth: "hindenisOben",
            obstacleSouth: "hindenisUnten",
            paintInFront: "vorFarbe",
            paintOnCell: "farbeAufFeld",
            paintNorthWest: "farbeObenLinks",
            paintNorth: "farbeOben",
            paintNorthEast: "farbeObenRechts",
            colorUnder: "farbe",
            numberUnder: "feldNummer",
            writeNumber: "schreibeFeldNummer",
            dir: "Richtung",
            col: "Spalte",
            row: "Zeile",
            alert: "gibAus",
            onPill: "surPastille",

            number: "anzahlObjekte",
            exists: "objektVorhanden",
            trans_row: "zeileObjekt",
            trans_col: "spalteObjekt"
         },

         messages: {
            nothingToPickUp: "Der Roboter kann hier nichts aufheben.",
            alreadyTransporting: "Der Roboter transportiert bereits etwas.",
            notTransporting: "Der Roboter versucht etwas abzulegen, transportiert aber gar nichts.",
            successDroppedAllObjects: "Bravo! Du hast alle Sachen abgelegt.",
            successMarkersPainted: "Bravo! Du hast das Muster richtig nachgezeichnet.",
            failureMarkersPainted: "Der Roboter hat das Muster nicht genau so gemalt, wie vorgegeben!",
            successPickedAllCollectibles: "Bravo! Der Roboter hat alles eingesammelt.",
            failurePickedAllCollectibles: "Der Roboter hat nicht alles eingesammelt!",
            successReachGeenArea: "Bravo! Der Roboter hat das grüne Feld erreicht.",
            failureReachGeenArea: "Der Roboter ist nicht auf dem grünen Feld!",
            successOneMarbleInHole: "Bravo! Der Roboter hat die Murmel richtig abgelegt.",
            successAllMarblesInHoles: "Bravo! Der Roboter hat die Murmeln richtig abgelegt.",
            failureOneMarbleInHole: "Der Roboter hat die Murmel nicht richtig abgelegt.",
            failureAllMarblesInHoles: "Der Roboter hat die Murmeln nicht richtig abgelegt.",
            leavesGrid: "Der Roboter hat das Gitter verlassen!"
         },
         description: {
         },
         cardinals: {
            north: "Norden",
            south: "Süden",
            west: "Westen",
            east: "Osten"
         },
         obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!",
         startingBlockName: "Roboter-Programm",

         exit_grid: "Der Roboter hat das Gitter verlassen!",
         nothingToPickUp: "Hier gibt es nichts zum aufheben!",
         alreadyTransportingObject: "Der Roboter transportiert bereits etwas.",
         jumpOutsideGrid: "Der Roboter hat versucht, aus dem Gitter zu springen!",
         jumpObstacleBlocking: "Der Roboter hat versucht zu springen, aber ein Hindernis hat ihn blockiert.",
         jumpNoPlatform: "Der Roboter hat versucht zu springen, aber über ihm ist keine Plattform.",
         downOutsideGrid: "Der Roboter hat versucht, nach unten aus dem Gitter zu springen!",
         downNoPlatform: "Der Roboter hat versucht nach unten zu springen, aber unter ihm ist keine Plattform.",
         falls: "Der Roboter fällt in den Abgrund!",
         willFallAndCrash: "Der Roboter würde hier runterfallen und kaputt gehen!",
         dropWithoutItem: "Der Roboter versucht etwas abzulegen, transportiert aber gar nichts.",
         droppedAllItems: "Bravo! Du hast alle Sachen abgelegt.",
         obstacleOnCell: "Auf diesem Feld ist ein Hindernis.",
         platformOnCell: "Auf diesem Feld ist bereits eine Plattform."
      },
      en: {
         label: {
            wait: "wait",
            right: "turn right",
            left: "turn left",
            forward: "move forward",
            turnAround: "turn around",
            jump: "jump",
            down: "go down",
            east: "move to the right",
            south: "move down",
            west: "move left",
            north: "move up",
            paint: "paint this cell",
            pickTransportable: "pick the marble",
            dropTransportable: "drop the marble",
            onTransportable: "on a marble",
            onRoundObject: "on a round object",
            onSquareObject: "on a square object",
            onTriangleObject: "on a triangle object",
            onDottedObject: "on a dotted object",
            onFullObject: "on a full object",
            onStripedObject: "on a striped object",
            onHole: "on a hole",
            transportableShape: "shape of the object",
            transportableColor: "color of the object",
            transportableRed:  "the object is red",
            transportableBlue: "the object is blue",
            transportableSquare: "the object is square",
            greenCell: "the cell is green",
            brownCell: "the cell is brown",
            markedCell: "the cell is marked",
            addPlatformAbove: "build a platform above",
            addPlatformInFront: "build a platform in front",
            platformInFront: "platform in front",
            platformInFrontAndBelow: "platform in front and below",
            platformAbove: "plateform above",
            gridEdgeInFront: "edge of the grid in front",
            gridEdgeAbove: "edge of the grid above",
            gridEdgeBelow: "edge of the grid below",
            gridEdgeEast: "edge of the grid on the right",
            gridEdgeWest: "edge of the grid on the left",
            obstacleInFront: "obstacle in front",
            obstacleRight: "obstacle on the right",
            obstacleLeft: "obstacle on the left",
            obstacleEast: "obstacle on the right",
            obstacleWest: "obstacle on the left",
            obstacleNorth: "obstacle above",
            obstacleSouth: "obstacle below",
            paintInFront: "paint in front",
            paintOnCell: "paint on this cell",
            paintNorthWest: "paint above and to the left",
            paintNorth: "paint above",
            paintNorthEast: "ppaint above and to the right",
            colorUnder: "coulor of the cell",
            numberUnder: "number in the cell",
            writeNumber: "set this cell's number to",
            dir: "direction of the robot",
            col: "column of the robot",
            row: "row of the robot",
            alert: "alert",
            onPill: "on a pill",
            number: "total number of objects to transport",
            exists: "there is an object that can be transported",
            trans_row: "row of the object to transport",
            trans_col: "column of the object to transport"
         },
         code: {
            wait: "wait",
            right: "turnRight",
            left: "turnLeft",
            turnAround: "turnAround",
            jump: "jump",
            down: "goDown",
            forward: "forward",
            east: "right",
            south: "down",
            west: "left",
            north: "up",
            paint: "paint",
            pickTransportable: "pick",
            dropTransportable: "drop",
            onTransportable: "onObject",
            onRoundObject: "onRound",
            onSquareObject: "onSquare",
            onTriangleObject: "onTriangle",
            onDottedObject: "onDottedObject",
            onFullObject: "onFullObject",
            onStripedObject: "onStripedObject",
            onHole: "onHole",
            transportableShape: "objectShape",
            transportableColor: "objectColor",
            transportableRed: "redObject",
            transportableBlue: "blueObject",
            transportableSquare: "squareObject",
            greenCell: "greenCell",
            brownCell: "brownCell",
            markedCell: "markedCell",
            platformInFront: "platformInFront",
            addPlatformAbove: "addPlatformAbove",
            addPlatformInFront: "addPlatformInFront",
            platformInFrontAndBelow: "platformInFrontAndBelow",
            platformAbove: "platformAbove",
            gridEdgeInFront: "gridEdgeInFront",
            obstacleInFront: "obstacleInFront",
            gridEdgeEast: "gridEdgeRight",
            gridEdgeWest: "gridEdgeLeft",
            gridEdgeAbove: "gridEdgeAbove",
            gridEdgeBelow: "gridEdgeBelow",
            obstacleRight: "obstacleToTheRight",
            obstacleLeft: "obstacleToTheLeft",
            obstacleEast: "obstacleRight",
            obstacleWest: "obstacleLeft",
            obstacleNorth: "obstacleUp",
            obstacleSouth: "obstacleDown",
            paintInFront: "paintInFront",
            paintOnCell: "paintOnCell",
            paintNorthWest: "paintUpLeft",
            paintNorth: "paintUp",
            paintNorthEast: "paintUpRight",
            colorUnder: "colorUnder",
            numberUnder: "numberUnder",
            writeNumber: "writeNumber",
            dir: "direction",
            col: "column",
            row: "row",
            alert: "alert",
            onPill: "onPill",

            number: "numberOfObjects",
            exists: "existObject",
            trans_row: "objectRow",
            trans_col: "objectColumn"
         },
         messages: {
            nothingToPickUp: "Rien à ramasser",
            alreadyTransporting: "Le robot transporte déjà un objet",
            notTransporting: "Le robot essaie de déposer un objet mais n'en transporte pas.",
            successDroppedAllObjects: "Bravo, vous avez déposé toutes les objets !",
            successMarkersPainted: "Bravo, votre robot a peint le motif !",
            failureMarkersPainted: "Le robot n'a pas peint les bonnes cases.",
            successPickedAllCollectibles: "Bravo, votre robot a tout ramassé !",
            failurePickedAllCollectibles: "Votre robot n'a pas tout ramassé !",
            successReachGeenArea: "Bravo, le robot a atteint la zone verte !",
            failureReachGeenArea: "Le robot n'a pas atteint la zone verte !",
            successOneMarbleInHole: "Bravo, vous avez rangé la bille&nbsp;!",
            successAllMarblesInHoles: "Bravo, vous avez rangé toutes les billes&nbsp;!",
            failureOneMarbleInHole: "La bille est mal rangée !",
            failureAllMarblesInHoles: "Les billes ne sont pas toutes bien rangées !",
            leavesGrid: "Le robot sort de la grille !"
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
         cardinals: {
            north: "North",
            south: "South",
            west: "West",
            east: "East"
         },
         obstacle: "Le robot essaie de se déplacer sur un obstacle !",
         startingBlockName: "Program",
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
      sl: {
         label: {
            wait: "počakaj",
            right: "obrni se levo",
            left: "obrni se desno",
            forward: "premakni se naprej",
            turnAround: "obrni se okoli",
            jump: "skoči",
            down: "pojdi dol",
            east: "premakni se desno",
            south: "premakni se dol",
            west: "premakni se levo",
            north: "premakni se gor",
            paint: "pobarvaj polje",
            pickTransportable: "poberi frnikolo",
            dropTransportable: "odvrzi frnikolo",
            onTransportable: "na frnikoli",
            onRoundObject: "na okroglem predmetu",
            onSquareObject: "na kvadratnem predmetu",
            onTriangleObject: "na trikotnem predmetu",
            onDottedObject: "na pikčastem predmetu",
            onFullObject: "na polnem predmetu",
            onStripedObject: "na črtastem predmetu",
            onHole: "na luknji",
            transportableShape: "oblika predmeta",
            transportableColor: "barva predmeta",
            transportableRed:  "predmet je rdeč",
            transportableBlue: "predmet je moder",
            transportableSquare: "predmet je kvadraten",
            greenCell: "polje je zeleno",
            brownCell: "polje je rjavo",
            markedCell: "polje je označeno",
            addPlatformAbove: "zgradi ploščad zgoraj",
            addPlatformInFront: "zgradi ploščad spredaj",
            platformInFront: "ploščad spedaj",
            platformInFrontAndBelow: "ploščad spredaj in spodaj",
            platformAbove: "ploščad zgoraj",
            gridEdgeInFront: "rob mreže spredaj",
            gridEdgeAbove: "rob mreže zgoraj",
            gridEdgeBelow: "rob mreže spodaj",
            gridEdgeEast: "rob mreže desno",
            gridEdgeWest: "rob mreže levo",
            obstacleInFront: "ovira spredaj",
            obstacleRight: "ovira desno",
            obstacleLeft: "ovira levo",
            obstacleEast: "ovira desno",
            obstacleWest: "ovira levo",
            obstacleNorth: "ovira zgoraj",
            obstacleSouth: "ovira spodaj",
            paintInFront: "barva spredaj",
            paintOnCell: "barva tega polja",
            paintNorthWest: "barva zgoraj in levo",
            paintNorth: "barva zgoraj",
            paintNorthEast: "barva zgoraj in desno",
            colorUnder: "barva polja",
            numberUnder: "številka polja",
            writeNumber: "nastavi številko polja na",
            dir: "smer robota",
            col: "stolpec robota",
            row: "vrstica robota",
            alert: "opozorilo",
            onPill: "na bonbonu",
            number: "skupno število predmetov za prenos",
            exists: "obstaja predmet, ki ga je mogoče prenesti",
            trans_row: "vrstica predmeta za prenos",
            trans_col: "stolpec predmeta za prenos"
         },
         code: {
            wait: "počakaj",
            right: "obrniSeDesno",
            left: "obrniSeLevo",
            turnAround: "obrniSeOkoli",
            jump: "skoči",
            down: "pojdiDol",
            forward: "naprej",
            east: "desno",
            south: "dol",
            west: "levo",
            north: "gor",
            paint: "pobarvaj",
            pickTransportable: "poberi",
            dropTransportable: "odvrzi",
            onTransportable: "naPredmetu",
            onRoundObject: "naKrogu",
            onSquareObject: "naKvadratu",
            onTriangleObject: "naTrikotniku",
            onDottedObject: "naPikčastnemPredmetu",
            onFullObject: "naPolnemPredmetu",
            onStripedObject: "naČrtastemPredmetu",
            onHole: "naLuknji",
            transportableShape: "oblikaPredmeta",
            transportableColor: "barvaPredmeta",
            transportableRed: "rdečiPredmet",
            transportableBlue: "mordiPredmet",
            transportableSquare: "kvadratniPredmet",
            greenCell: "zelenoPolje",
            brownCell: "rjavoPolje",
            markedCell: "označenoPolje",
            platformInFront: "ploščadSpredaj",
            addPlatformAbove: "dodajPloščadZgoraj",
            addPlatformInFront: "dodajPloščadSpredaj",
            platformInFrontAndBelow: "ploščadSpredajInSpodaj",
            platformAbove: "ploščadZgoraj",
            gridEdgeInFront: "robMrežeSpredaj",
            obstacleInFront: "oviraSpredaj",
            gridEdgeEast: "robMrežeDesno",
            gridEdgeWest: "robMrežeLevo",
            gridEdgeAbove: "robMrežeZgoraj",
            gridEdgeBelow: "robMrežeSpodaj",
            obstacleRight: "oviraDesno",
            obstacleLeft: "oviraLevo",
            obstacleEast: "oviraDesno",
            obstacleWest: "oviraLevo",
            obstacleNorth: "oviraZgoraj",
            obstacleSouth: "oviraSpodaj",
            paintInFront: "pobarvanaSpredaj",
            paintOnCell: "pobarvanoPolje",
            paintNorthWest: "pobarvanaZgorajLevo",
            paintNorth: "pobarvanaZgoraj",
            paintNorthEast: "pobarvanaZgorajDesno",
            colorUnder: "barvaPolja",
            numberUnder: "številkaPolja",
            writeNumber: "zapišiŠtevilko",
            dir: "smer",
            col: "stolpec",
            row: "vrstica",
            alert: "opozorilo",
            onPill: "naBonbonu",

            number: "številoPredmetov",
            exists: "obstajaPredmet",
            trans_row: "vrsticaPredmeta",
            trans_col: "stolpecPredmeta"
         },
         messages: {
            nothingToPickUp: "Ni predmetov, ki bi jih lahko pobral.",
            alreadyTransporting: "Robot že nosi predmet.",
            notTransporting: "Robot skuša spustiti predmet, vendar ga ne nosi.",
            successDroppedAllObjects: "Čestitamo, spustil(-a) si vse predmete!",
            successMarkersPainted: "Čestitamo, robot je naslikal vzorec!",
            failureMarkersPainted: "Robot ni pobarval pravega polja.",
            successPickedAllCollectibles: "Čestitamo, robot je pobral vse predmete!",
            failurePickedAllCollectibles: "Robot ni pobral vseh predmetov!",
            successReachGeenArea: "Čestitamo, robot je dosegel zeleno območje!",
            failureReachGeenArea: "Robot ni dosegel zelenega območja!",
            successOneMarbleInHole: "Čestitamo, frnikola je v luknji!",
            successAllMarblesInHoles: "Čestitamo, vse frnikole so v luknji!",
            failureOneMarbleInHole: "Frnikola ni v luknji!",
            failureAllMarblesInHoles: "Vse frnikole niso v luknji!",
            leavesGrid: "Robot je zapustil mrežo!"
         },
         description: {
            platformAbove: "ploščadZgoraj(): Ali obstaja ploščad nad robotom?",
            obstacleInFront: "oviraSpredaj(): Ali obstaja ovira pred robotom?",
            onHole: "naLuknji(): Ali je robot na luknji?",
            onTransportable: "naPredmetu(): Ali je robot na predmetu, ki ga lahko pobere?",
            onRoundObject: "naKrogu(): Ali je robot na okroglem predmetu?",
            onSquareObject: "naKvadratu(): Ali je robot na kvadratnem predmetu?",
            onTriangleObject: "naTrikotniku(): Ali je robot na trikotnem predmetu?",
            onDottedObject: "naPikčastemPredmetu(): Ali je robot na pikčastem predmetu?",
            onFullObject: "naPolnemPredmetu(): Ali je robot na polnem predmetu?",
            onStripedObject: "naČrtastemPredmetu(): Ali je robot na črtastem predmetu?",
            paintOnCell: "pobarvanoPolje(): Ali je polje, na katerem je robot, pobarvano?",
            gridEdgeInFront: "robMrežeSpredaj(): Ali je rob mreže pred robotom?",
            gridEdgeEast: "robMrežeDesno(): Ali je rob mreže desno od robota?",
            gridEdgeWest: "robMrežeLevo(): Ali je rob mreže levo od robota?",
            gridEdgeAbove: "robMrežeZgoraj(): Ali je rob mreže nad robotom?",
            gridEdgeBelow: "robMrežeSpodaj(): Ali je rob mreže pod robotom?",
            platformInFront: "ploščadSpredaj(): Ali obstaja ploščad pred robotom?",
            numberUnder: "številkaPolja(): Številka polja, na katerem je robot.",
            col: "stolpec(): Stolpec na katerem je robot",
            row: "vrstica(): Vrstica na kateri je robot",
            paintNorth: "pobarvanaZgoraj(): Ali je pobarvano polje nad poljem, na katerem je robot?",
            paintNorthWest: "pobarvanaZgorajLevo(): Ali je pobarvano polje levo nad poljem, na katerem je robot?",
            paintNorthEast: "pobarvanaZgorajDesno(): Ali je pobarvano polje desno nad poljem, na katerem je robot?",
            writeNumber: "zapišiŠtevilko(številka): Zapiše številko v polje, na katerem je robot."
         },
         cardinals: {
            north: "Sever",
            south: "Juh",
            west: "Západ",
            east: "Východ"
         },
         obstacle: "Robot poskuša premakniti oviro!",
         startingBlockName: "Program",
         exit_grid: "Robot je zapustil mrežo!",
         nothingToPickUp: "Ni predmetov, ki bi jih lahko pobral.",
         alreadyTransportingObject: "Robot že nosi predmet.",
         jumpOutsideGrid: "Robot skuša skočiti izven mreže!",
         jumpObstacleBlocking: "Robot skuša skočiti, vendar zaradi ovire ne more!",
         jumpNoPlatform: "Robot skuša skočiti, vendar ni nobene ploščadi!",
         downOutsideGrid: "Robot se skuša premakniti izven mreže!",
         downNoPlatform: "Robot se skuša premakniti dol, vendar spodaj ni ploščadi!",
         falls: "Robot pada v prazno.",
         willFallAndCrash: "Robot bo padel z ploščadi in se razbil!",
         dropWithoutItem: "Robot skuša spustiti predmet, vendar ga ne nosi.",
         droppedAllItems: "Čestitamo, spustil(-a) si vse predmete!",
         obstacleOnCell: "Na tem polju je ovira.",
         platformOnCell: "Na tem polju je že ploščad."
      },
      none: {
         comment: {
         }
      }
   };

   var context = quickAlgoContext(display, infos);

   var strings = context.setLocalLanguageStrings(localLanguageStrings);

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

   if (infos.languageStrings != undefined) {
      replaceStringsRec(infos.languageStrings.blocklyRobot_lib, strings);
   }

   var cells = [];
   var colsLabels = [];
   var rowsLabels = [];
   var cardLabels = [];
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
   infos.rightMargin = 0;
   infos.bottomMargin = 0;
   if (infos.showLabels) {
      infos.leftMargin += infos.cellSide;
      infos.topMargin += infos.cellSide;
   }
   if (infos.showCardinals) {
      infos.leftMargin += infos.cellSide * 1.8;
      infos.topMargin += infos.cellSide;
      infos.rightMargin += infos.cellSide;
      infos.bottomMargin += infos.cellSide;
   }

   context.robot = {};

   switch (infos.blocklyColourTheme) {
      case "bwinf":
         context.provideBlocklyColours = function() {
            return {
               categories: {
                  logic: 100,
                  loops: 180,
                  math: 230,
                  text: 60,
                  lists: 40,
                  colour: 20,
                  variables: 330,
                  functions: 290,
                  actions: 260,
                  sensors: 200,
                  _default: 0
               },
               blocks: {}
            };
         }
         break;
      default:
         // we could set printer specific default colours here, if we wanted to …
   }

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
      var cta = checkTileAllowed(coords.row, coords.col);
      if(cta === true) {
         if (infos.hasGravity) {
            context.fall(item, coords, callback);
         } else {
            context.nbMoves++;
            moveRobot(coords.row, coords.col, item.dir, callback);
         }
      } else if(cta === false) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row + (coords.row - item.row) / 4, item.col + (coords.col - item.col) / 4, item.dir);
         throw cta;
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
   }

   function gridEdgeCoord(row, col, callback) {
      var gridEdge = false;
      if (isOutsideGrid(row, col)) {
         gridEdge = true;
      } else if (context.tiles[row][col] == 0) {
         gridEdge = true;
      }
      context.runner.noDelay(callback, gridEdge);
   };

   context.robot.gridEdgeInFront = function(callback) {
      var coords = getCoordsInFront(0);
      gridEdgeCoord(coords.row, coords.col, callback);
   };

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
   };

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
   };

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
   };

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
      var paintItems = context.getItems(row, col, {isPaint: true});
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
      var cta = checkTileAllowed(item.row, item.col + 1);
      if(cta === true) {
         context.nbMoves++;
         moveRobot(item.row, item.col + 1, 0, callback);
      } else if(cta === false) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row, item.col + 1/4, 0);
         throw cta;
      }
   };

   context.robot.west = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var cta = checkTileAllowed(item.row, item.col - 1);
      if(cta === true) {
         context.nbMoves++;
         moveRobot(item.row, item.col - 1, 2, callback);
      } else if(cta === false) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row, item.col - 1/4, 2);
         throw cta;
      }
   };

   context.robot.north = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var cta = checkTileAllowed(item.row - 1, item.col);
      if(cta === true) {
         context.nbMoves++;
         moveRobot(item.row - 1, item.col, 3, callback);
      } else if(cta === false) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row - 1/4, item.col, 3);
         throw cta;
      }
   };

   context.robot.south = function(callback) {
      if (context.lost) {
         return;
      }
      var item = context.getRobotItem(context.curRobot);
      var cta = checkTileAllowed(item.row + 1, item.col);
      if(cta === true) {
         context.nbMoves++;
         moveRobot(item.row + 1, item.col, 1, callback);
      } else if(cta === false) {
         context.waitDelay(callback);
      } else {
         moveRobot(item.row + 0.25, item.col, 1);
         throw cta;
      }
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

   context.robot.onHole = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var holes = context.getItems(robot.row, robot.col, {isHole: true});
      context.callCallback(callback, (holes.length != 0));
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
      var painted = context.getItems(robot.row, robot.col, {category: "paint"});
      if (painted.length > 0) {
         var itemType = infos.itemTypes[painted[0].type];
         if ((painted.length > 0) && (itemType.color != undefined)) {
            result = (itemType.color == color);
         }
      }
      context.callCallback(callback, result);
   };

   context.robot.greenCell = function(callback) {
      robotCellIsColor(callback, "vert");
   };

   context.robot.markedCell = function(callback) {
      var robot = context.getRobotItem(context.curRobot);
      var markers = context.getItems(robot.row, robot.col, {isMarker: true});
      var result = (markers.length > 0);
      context.callCallback(callback, result);
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
         throw(context.strings.messages.nothingToPickUp);
      }
      /*
      if (transportables[0].rank != context.nbTransportedItems + 1) {
         throw("L'objet n'est pas celui qu'il faut ramasser maintenant.");
      }
      */
      if (context.nbTransportedItems > 0) {
         throw(context.strings.messages.alreadyTransporting);
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
         throw(context.strings.messages.notTransporting);
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
         throw(context.strings.messages.successDroppedAllObjects);
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
         actions: [
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
            { name: "writeNumber", params: [null] },
            { name: "addPlatformAbove",   yieldsValue: false },
            { name: "addPlatformInFront",   yieldsValue: false }
         ],
         sensors: [
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
            { name: "col",                yieldsValue: 'int' },
            { name: "row",                yieldsValue: 'int' },
            { name: "onPill",             yieldsValue: true }
         ]
      },
      transport: {
         sensors: [
            { name: "number", yieldsValue: true,                     handler: context.transportable_number },
            { name: "exists", yieldsValue: true,   params: [null],   handler: context.transportable_exists },
            { name: "trans_row",    yieldsValue: true,   params: [null],   handler: context.transportable_row },
            { name: "trans_col",    yieldsValue: true,   params: [null],   handler: context.transportable_col }
         ]
      },
      debug: {
         debug: [
            { name: "alert", params: [null], handler: context.debug_alert }
         ]
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
               cells[iRow][iCol] = paper.rect(0,0,10,10);
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
      if (infos.showCardinals) {
         cardLabels = [
            paper.text(0, 0, strings.cardinals.north),
            paper.text(0, 0, strings.cardinals.south),
            paper.text(0, 0, strings.cardinals.west),
            paper.text(0, 0, strings.cardinals.east)
            ];
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
         var imgalt = item.imgalt || itemType.imgalt;
         if (imgalt) {
            item.element.attr('title', imgalt);
         }
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
      if(callback) {
         context.waitDelay(callback);
      }
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
         return context.strings.messages.leavesGrid;
      }
      var itemsInFront = context.getItems(row, col, {isObstacle: true});
      if (itemsInFront.length > 0) {
         if (infos.ignoreInvalidMoves) {
            return false;
         }
         return strings.obstacle;
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
      var newCellSide = 0;
      if(window.quickAlgoResponsive) {
         var areaWidth = Math.max(200, $('#grid').width()-24);
         var areaHeight = Math.max(150, $('#grid').height()-24);
      } else {
         var areaWidth = 400;
         var areaHeight = 600;
      }
      if (context.nbCols && context.nbRows) {
         var marginAsCols = (infos.leftMargin + infos.rightMargin) / infos.cellSide;
         var marginAsRows = (infos.topMargin + infos.rightMargin) / infos.cellSide;
         newCellSide = Math.min(infos.cellSide, Math.min(areaWidth / (context.nbCols + marginAsCols), areaHeight / (context.nbRows + marginAsRows)));
      }
      scale = newCellSide / infos.cellSide;
      var paperWidth = (infos.cellSide * context.nbCols + infos.leftMargin + infos.rightMargin) * scale;
      var paperHeight = (infos.cellSide * context.nbRows + infos.topMargin + infos.bottomMargin) * scale;
      paper.setSize(paperWidth, paperHeight);
      for (var iRow = 0; iRow < context.nbRows; iRow++) {
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            if (cells[iRow][iCol] != undefined) {
               var x = (infos.cellSide * iCol + infos.leftMargin) * scale;
               var y = (infos.cellSide * iRow + infos.topMargin) * scale;
               cells[iRow][iCol].attr({x: x, y: y, width: infos.cellSide * scale, height: infos.cellSide * scale});
            }
         }
      }
      var textFontSize = {"font-size": infos.cellSide * scale / 2};
      if (infos.showLabels) {
         for (var iRow = 0; iRow < context.nbRows; iRow++) {
            var x = (infos.leftMargin - infos.cellSide / 2) * scale;
            var y = (infos.cellSide * (iRow + 0.5) + infos.topMargin) * scale;
            rowsLabels[iRow].attr({x: x, y: y}).attr(textFontSize);
         }
         for (var iCol = 0; iCol < context.nbCols; iCol++) {
            var x = (infos.cellSide * iCol + infos.leftMargin + infos.cellSide / 2) * scale;
            var y = (infos.topMargin - infos.cellSide / 2) * scale;
            colsLabels[iCol].attr({x: x, y: y}).attr(textFontSize);
         }
      }
      if (infos.showCardinals) {
         var middleX = (infos.leftMargin + infos.cellSide * context.nbCols / 2) * scale;
         var middleY = (infos.topMargin + infos.cellSide * context.nbRows / 2) * scale;
         cardLabels[0].attr({x: middleX, y: (infos.topMargin - (infos.showLabels ? infos.cellSide : 0) - infos.cellSide / 2) * scale}).attr(textFontSize);
         cardLabels[1].attr({x: middleX, y: paperHeight + (infos.cellSide / 2 - infos.bottomMargin) * scale}).attr(textFontSize);
         cardLabels[2].attr({x: (infos.leftMargin - (infos.showLabels ? infos.cellSide : 0) - infos.cellSide * 1.8 / 2) * scale, y: middleY}).attr(textFontSize);
         cardLabels[3].attr({x: paperWidth + (infos.cellSide / 2 - infos.rightMargin) * scale, y: middleY}).attr(textFontSize);
      }
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         redisplayItem(item);
         item.element.attr(itemAttributes(item));
      }
   };

   return context;
};


var robotEndConditions = {
   checkMarkersPainted: function(context, lastTurn) {
      var solved = true;
      for (var iRow = 0; iRow < context.tiles.length; iRow++) {
         var row = context.tiles[iRow];
         for (var iCol = 0; iCol < row.length; iCol++) {
            var markers = context.getItems(iRow, iCol, {isMarker: true});
            var paint = context.getItems(iRow, iCol, {isPaint: true});
            if (paint.length != markers.length) {
               solved = false;
            }
         }
      }
      if (solved) {
         context.success = true;
         throw(window.languageStrings.messages.successMarkersPainted);
      }
      if (lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureMarkersPainted);
      }
   },
   checkPickedAllCollectibles: function(context, lastTurn) {
      var solved = true;
      for (var iRow = 0; iRow < context.tiles.length; iRow++) {
         var row = context.tiles[iRow];
         for (var iCol = 0; iCol < row.length; iCol++) {
            var collectibles = context.getItems(iRow, iCol, {isCollectible: true});
            if (collectibles.length != 0) {
               solved = false;
            }
         }
      }
      if (solved) {
         context.success = true;
         throw(window.languageStrings.messages.successPickedAllCollectibles);
      }
      if (lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failurePickedAllCollectibles);
      }
   },
   checkReachGreenArea: function(context, lastTurn) {
      var robot = context.getRobotItem(context.curRobot);
      var paints = context.getItems(robot.row, robot.col, {color: "vert"}); // TODO: internationalize color
      if (paints.length != 0) {
         context.success = true;
         throw(window.languageStrings.messages.successReachGeenArea);
      }
      if (lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureReachGeenArea);
      }
   },
   checkMarblesInHoles: function(context, lastTurn) {
      var solved = true;
      var nbHoles = 0;
      for (var iRow = 0; iRow < context.tiles.length; iRow++) {
         var row = context.tiles[iRow];
         for (var iCol = 0; iCol < row.length; iCol++) {
            var marbles = context.getItems(iRow, iCol, {category: "marble"});
            var holes = context.getItems(iRow, iCol, {category: "hole"});
            nbHoles += holes.length;
            if (marbles.length != holes.length) {
               solved = false;
            }
         }
      }
      if (solved) {
         context.success = true;
         if (nbHoles == 1) {
            throw(window.languageStrings.messages.successOneMarbleInHole);
         } else {
            throw(window.languageStrings.messages.successAllMarblesInHoles);
         }
      }
      if (lastTurn) {
         context.success = false;
         if (nbHoles == 1) {
            throw(window.languageStrings.messages.failureOneMarbleInHole);
         } else {
            throw(window.languageStrings.messages.failureAllMarblesInHoles);
         }
      }
   }
};

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
