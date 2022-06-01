
var imgPath = modulesPath+"img/algorea/";

// var initArray = function(n, elem) {
//    var res = [];
//    for(var i = 0;i < n;i++) {
//       res.push(elem);
//    }
//    return res;
// }

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
               drop: "deposer",
               // turnAround: "faire demi-tour",
               // forward: "avancer",
               // backwards: "reculer",
               // jump: "sauter",
               // obstacleInFront: "obstacle devant",
               // obstacleEast: "obstacle à l'est",
               // obstacleWest: "obstacle à l'ouest",
               // obstacleNorth: "obstacle au nord",
               // obstacleSouth: "obstacle au sud",
               // obstacleRight: "obstacle à droite",
               // obstacleLeft: "obstacle à gauche",
               // gridEdgeEast: "bord de la grille à l'est",
               // gridEdgeWest: "bord de la grille à l'ouest",
               // gridEdgeNorth: "bord de la grille au nord",
               // gridEdgeSouth: "bord de la grille au sud",
               // platformInFront: "plateforme devant",
               // platformAbove: "plateforme au-dessus",
               // withdrawObject: "ramasser l'objet",
               // dropObject: "déposer l'objet",
               // onObject: "sur un objet",
               // onContainer: "sur un conteneur",
               // onNumber: "sur un nombre",
               // onWritable: "sur un tableau",
               // onLauncher: "sur un lanceur laser",
               // writeNumber: "écrire le nombre",
               // readNumber: "nombre de la case",
               // pushObject: "pousser l'objet",
               // pushableInFront: "poussable devant",
               // dropNum: "déposer %1 objets",
               // dropNum_noShadow: "déposer %1 objets",
               // nbWithdrawables: "nombre d'objets sur la case",
               // nbInBag: "nombre d'objets dans le sac",
               // containerSize: "nombre d'objets à déposer sur la case",
               // withdrawNum: "ramasser %1 objets",
               // withdrawNum_noShadow: "ramasser %1 objets",
               // shoot: "tirer au laser dans la direction %1",
               // shoot_noShadow: "tirer au laser dans la direction %1",
               // shootCondition: "retour départ tir direction %1",
               // shootCondition_noShadow: "retour départ tir direction %1",
               // connect: "brancher un câble",
               // onMale: "sur une prise mâle",
               // onFemale: "sur une prise femelle",
               // dropPlatformInFront: "construire une plateforme devant",
               // dropPlatformAbove: "construire une plateforme au-dessus"
               
            },
            code: {
               left: "deplacerGauche",
               right: "deplacerDroite",
               take: "prendre",
               drop: "deposer",
               // onObject: "surObjet",
               // onContainer: "surConteneur",
               // onNumber: "surNombre",
               // onWritable: "surTableau",
               // onLauncher: "surLanceur",
               // writeNumber: "ecrireNombre",
               // readNumber: "nombreSurCase",
               // pushObject: "pousserObjet",
               // pushableInFront: "poussableDevant",
               // dropNum: "deposer",
               // dropNum_noShadow: "deposer",
               // containerSize: "nbObjetsADeposer",
               // nbInBag: "nbObjetsDansSac",
               // nbWithdrawables: "nbObjetsSur",
               // withdrawNum: "ramasser",
               // withdrawNum_noShadow: "ramasser",
               // shoot: "tirerLaser",
               // shoot_noShadow: "tirerLaser",
               // shootCondition: "tirerCondition",
               // shootCondition_noShadow: "tirerCondition",
               // connect: "brancherCable",
               // onMale: "surMale",
               // onFemale: "surFemelle",
               // dropPlatformInFront: "construirePlateformeDevant",
               // dropPlatformAbove: "construirePlateformeAuDessus"
            },
            description: {
               // forward: "avancer() fait avancer le robot d'une case",
               // backwards: "reculer() fait reculer le robot d'une case",
               left: "déplacerGauche() fait se déplacer la grue d'une case vers la gauche",
               right: "déplacerDroite() fait se déplacer la grue d'une case vers la droite",
               // row: "ligneRobot() retourne le numéro de la ligne du robot",
               // col: "colonneRobot() retourne le numéro de la colonne du robot",
               // turnAround: "demiTour() fait faire demi-tour au robot",
               // east: "est() déplace le robot d'une case vers l'est",
               // west: "ouest() déplace le robot d'une case vers l'oest",
               // north: "nord() déplace le robot d'une case vers le nord",
               // south: "sud() déplace le robot d'une case vers le sud",
            },
            messages: {
               outside: "La grue ne peut pas aller plus loin dans cette direction !",
               success: "Bravo, vous avez réussi !",
               failure: "Vous n'avez pas atteint l'objectif",
               nothingToTake: "Il n'y a pas de bloc dans cette colonne !",
               notMovable: "Ce bloc ne peut pas être déplacé",
               holdingBlock: "La grue ne peut pas prendre plus d'un bloc en même temps",
               emptyCrane: "La grue ne porte pas de bloc",
               cannotDrop: "Vous ne pouvez pas déposer de bloc dans cette colonne"
               // falls: "Le robot va se jeter dans le vide !",
               // willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
               // jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
               // jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
               // jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
               // tooManyObjects: "Le robot essaie de transporter trop d'objets à la fois !",
               // emptyBag: "Le robot essaie de déposer un objet alors qu'il n'en transporte pas !",
               // successReachExit: "Bravo, votre robot a atteint la sortie !",
               // failureReachExit: "Votre robot n'a pas atteint la sortie.",
               // successPickedAllWithdrawables: "Bravo, votre robot a tout ramassé !",
               // failurePickedAllWithdrawables: "Votre robot n'a pas tout ramassé.",
               // successContainersFilled: "Bravo, votre robot a rempli tous les conteneurs",
               // failureContainersFilled: "Il y a un objet hors des conteneurs",
               // failureContainersFilledLess: "Votre robot n'a pas rempli tous les conteneurs",
               // failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
               // failureUnfilteredObject: "Votre robot a ramassé un objet invalide",
               // failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
               // failureWriteHere: "Votre robot ne peut pas écrire ici !",
               // failureReadHere: "Il n'y a pas de nombre écrit ici !",
               // successNumbersWritten: "Bravo, votre robot a écrit les bons nombres !",
               // failureNumbersWritten: "Votre robot n'a pas écrit les bons nombres !",
               // failureNothingToPush: "Il n'y a pas d'objet à pousser !",
               // failureWhilePushing: "Le robot ne peut pas pousser cet objet !",
               // failureDropObject: "On ne peut pas poser d'objet ici",
               // failureDropPlatform: "Il y a déjà une plateforme ici",
               // failureDropOutside: "Votre robot essaie de poser un objet hors de la grille",
               // failureNotEnoughPlatform: "Pas assez de plateformes",
               // failureLights: "Il reste des spots à allumer.",
               // successLights: "Bravo, votre robot a allumé tous les spots !",
               // failureLaser: "Le robot doit se trouver sur une borne laser pour pouvoir tirer !",
               // failureNoPlug: "Le robot doit se trouver sur une prise pour pouvoir brancher un câble !",
               // failureAlreadyWired: "Cette prise est déjà connectée à un câble !",
               // failureWrongPlugType: "On ne peut pas connecter ces prises ensemble !",
               // successPlugsWired: "La machine est réparée !",
               // failurePlugsWired: "La machine ne fonctionne pas car des prises n'ont pas été connectées !",
               // failureWireCrossing: "Impossible de relier ces deux prises, deux câbles vont s'intersecter !",
               // failureWireTooLong: "Impossible de relier ces deux prises car elles sont trop éloignées !",
               // failureTotalLengthExceeded: "Vous n'avez pas assez de longueur de câble pour relier ces deux prises !",
               // failureProjectile: "Le robot s'est pris un projectile !",
               // failureRewrite: "Le robot a essayé de repeindre une case.",
               // noContainer: "Il n'y a pas de conteneur ici !"
            },
            startingBlockName: "Programme du robot"
         },
         // en: {
         //    label: {
         //       row: "robot's row",
         //       col: "robot's column",
         //       wait: "wait",
         //       north: "move up",
         //       south: "move down",
         //       east: "move right",
         //       west: "more left",
         //       left: "turn left",
         //       right: "turn right",
         //       turnAround: "turn around",
         //       forward: "move forward",
         //       backwards: "move backwards",
         //       jump: "jump",
         //       obstacleInFront: "obstacle ahead",
         //       obstacleEast: "obstacle on the right",
         //       obstacleWest: "obstacle on the left",
         //       obstacleNorth: "obstacle above",
         //       obstacleSouth: "obstacle below",
         //       obstacleRight: "obstacle on the right",
         //       obstacleLeft: "obstacle on the left",
         //       gridEdgeEast: "grid edge on the right",
         //       gridEdgeWest: "grid edge on the left",
         //       gridEdgeNorth: "grid edge above",
         //       gridEdgeSouth: "grid edge below",
         //       platformInFront: "platform ahead",
         //       platformAbove: "platform above",
         //       withdrawObject: "pick the object",
         //       dropObject: "drop the object",
         //       onObject: "on an object",
         //       onContainer: "on a container",
         //       onNumber: "on a number",
         //       onWritable: "on a blackboard",
         //       onLauncher: "on a laser emitter",
         //       writeNumber: "write the number",
         //       readNumber: "number in the cell",
         //       pushObject: "push the object",
         //       pushableInFront: "pushable object ahead",
         //       shoot: "shoot a laser in direction %1",
         //       shoot_noShadow: "shoot a laser in direction %1",
         //       shootCondition: "laser shot returning to starting point in direction %1",
         //       shootCondition_noShadow: "laser shot returning to starting point in direction %1",
         //       connect: "plug a wire",
         //       onMale: "to a male plug",
         //       onFemale: "to a female plug",
         //       dropPlatformInFront: "drop platform in front",
         //       dropPlatformAbove: "drop platform above"
               
         //    },
         //    code: {
         //       row: "robotRow",
         //       col: "robotColumn",
         //       wait: "wait",
         //       north: "up",
         //       south: "down",
         //       east: "right",
         //       west: "left",
         //       left: "turnLeft",
         //       right: "turnRight",
         //       turnAround: "turnAround",
         //       forward: "forward",
         //       backwards: "backwards",
         //       jump: "jump",
         //       obstacleInFront: "obstacleAhead",
         //       obstacleEast: "obstacleRight",
         //       obstacleWest: "obstacleLeft",
         //       obstacleNorth: "obstacleAbove",
         //       obstacleSouth: "obstacleBelow",
         //       obstacleRight: "obstacleRightRel",
         //       obstacleLeft: "obstacleLeftRel",
         //       gridEdgeEast: "gridEdgeRight",
         //       gridEdgeWest: "gridEdgeLeft",
         //       gridEdgeNorth: "gridEdgeAbove",
         //       gridEdgeSouth: "gridEdgeBelow",
         //       platformInFront: "plateformAhead",
         //       platformAbove: "platformAbove",
         //       withdrawObject: "pickObject",
         //       dropObject: "dropObject",
         //       onObject: "onObject",
         //       onContainer: "onContainer",
         //       onNumber: "onNumber",
         //       onWritable: "onWritable",
         //       onLauncher: "onLauncher",
         //       writeNumber: "writeNumber",
         //       readNumber: "numberOnCell",
         //       pushObject: "pushObject",
         //       pushableInFront: "pushableAhead",
         //       shoot: "shootLaser",
         //       shoot_noShadow: "shootLaser",
         //       shootCondition: "shootOnCondition",
         //       shootCondition_noShadow: "shootOnCondition",
         //       connect: "plugCable",
         //       onMale: "onMalePlug",
         //       onFemale: "onFemalePlug",
         //       dropPlatformInFront: "dropPlatformInFront",
         //       dropPlatformAbove: "dropPlatformAbove"
         //    },
         //    messages: {
         //       leavesGrid: "The robot exits the grid!",
         //       obstacle: "The robot attempts to move towards an obstacle!",
         //       nothingToPickUp: "There is nothing to puck up!",
         //       nothingToLookAt: "There is no card or container in this cell",
         //       falls: "The robot will leap into the void",
         //       willFallAndCrash: "The robot will jump from a high point and crash!",
         //       jumpOutsideGrid: "The robot tries to jump outside of the grid!",
         //       jumpObstacleBlocking: "The robot tries to jump but an obstacle blacks it",
         //       jumpNoPlatform: "The robot tries to jump but there is no platform above!",
         //       tooManyObjects: "The robot tries to transport too many objects at a time!",
         //       emptyBag: "The robot tries to drop an object but it doesn't carry one!",
         //       successReachExit: "Congratulations, your robot reached the exit!",
         //       failureReachExit: "Your robot didn't reach the exit.",
         //       successPickedAllWithdrawables: "Congratulations, your robot picked up everything!",
         //       failurePickedAllWithdrawables: "Your robot didn't pick up everything.",
         //       successContainersFilled: "Congratulations, your robot filled every container",
         //       failureContainersFilled: "An object was left outside of containers",
         //       failureContainersFilledLess: "Yout robot didn't fill every container",
         //       failureContainersFilledBag: "Your robot didn't drop all the objects",
         //       failureUnfilteredObject: "Your robot picked an invalid object",
         //       failureTooManyMoves: "Your robot made too many moves.",
         //       failureWriteHere: "Your robot can't write here!",
         //       failureReadHere: "There is no number written here!",
         //       successNumbersWritten: "Congratulations, your robot wrote all the correct numbers!",
         //       failureNumbersWritten: "Your robot didn't write the correct numbers!",
         //       failureNothingToPush: "There is no object to push!",
         //       failureWhilePushing: "The robot can't push this object!",
         //       failureDropObject: "You can't drop an platform here",
         //       failureDropPlatform: "You can't drop an object here",
         //       failureDropOutside: "Your robot tries to drop an object outside of the grid",
         //       failureNotEnoughPlatform: "Not enough platforms",
         //       failureLights: "There are still lights to turn on.",
         //       successLights: "Congratulations, your robot turned on all the lights!",
         //       failureLaser: "The robot has to be on a launcher to be able to shoot!",
         //       failureNoPlug: "The robot has to be on a plug to plug in a cable!",
         //       failureAlreadyWired: "This plug is already connected to a cable!",
         //       failureWrongPlugType: "You can't connect these plugs together!",
         //       successPlugsWired: "The machine is fixed!",
         //       failurePlugsWired: "The machine doesn't work because some plugs are not connected!",
         //       failureWireCrossing: "Impossible to connect these two plugs: two cables would intersect!",
         //       failureWireTooLong: "Impossible to connect these two plugs: they are too far from eachother!",
         //       failureTotalLengthExceeded: "You don't have enough length of cable to connect these two plugs!",
         //       failureProjectile: "The robot got hit by a projectile!"
         //    },
         //    cardinals: {
         //       north: "North",
         //       south: "South",
         //       west: "West",
         //       east: "East"
         //    },
         //    startingBlockName: "Program of the robot"
         // },
         
         // es: {
         //    label: {
         //       row: "fila del robot",
         //       col: "columna del robot",
         //       north: "avanzar hacia arriba",
         //       south: "avanzar hacia abajo",
         //       east: "avanzar hacia la derecha",
         //       west: "avanzar hacia la izquierda",
         //       left: "girar a la izquierda",
         //       right: "girar a la derecha",
         //       turnAround: "dar media vuelta",
         //       forward: "avanzar",
         //       backwards: "retroceder",
         //       jump: "saltar",
         //       obstacleInFront: "obstáculo adelante",
         //       obstacleEast: "obstáculo a la derecha",
         //       obstacleWest: "obstáculo a la izquierda",
         //       obstacleNorth: "obstáculo arriba",
         //       obstacleSouth: "obstáculo abajo",
         //       obstacleRight: "obstáculo a la derecha",
         //       obstacleLeft: "obstáculo a la izquierda",
         //       gridEdgeEast: "borde de la cuadrícula a la derecha",
         //       gridEdgeWest: "borde de la cuadrícula a la izquierda",
         //       gridEdgeNorth: "borde de la cuadrícula arriba",
         //       gridEdgeSouth: "borde de la cuadrícula abajo",
         //       platformInFront: "plataforma adelante",
         //       platformAbove: "plataforma arriba",
         //       withdrawObject: "recoger el objeto",
         //       dropObject: "soltar el objeto",
         //       onObject: "sobre un objeto",
         //       onContainer: "sobre un contenedor",
         //       onNumber: "sobre un número",
         //       onWritable: "sobre un cuadro",
         //       onLauncher: "sobre un lanzador láser",
         //       writeNumber: "escribir el número",
         //       readNumber: "número en la casilla",
         //       pushObject: "empujar el objeto",
         //       pushableInFront: "objeto empujable adelante",
         //       shoot: "disparar el láser en la dirección %1",
         //       shoot_noShadow: "disparar el laser en la dirección %1",
         //       shootCondition: "dirección del tiro de retorno %1",
         //       shootCondition_noShadow: "dirección del tiro de retorno %1",
         //       dropPlatformInFront: "construir una plataforma adelante",
         //       dropPlatformAbove: "construir una plataforma arriba"
         //    },
         //    code: {
         //       row: "filaRobot",
         //       col: "columnaRobot",
         //       north: "arriba",
         //       south: "abajo",
         //       east: "derecha",
         //       west: "izquierda",
         //       left: "girarIzquierda",
         //       right: "girarDerecha",
         //       turnAround: "mediaVuelta",
         //       forward: "avanzar",
         //       backwards: "retroceder",
         //       jump: "saltar",
         //       obstacleInFront: "obstaculoAdelante",
         //       obstacleRight: "obstaculoDerechaRel",
         //       obstacleLeft: "obstaculoIzquierdaRel",
         //       obstacleEast: "obstaculoDerecha",
         //       obstacleWest: "obstaculoIzquierda",
         //       obstacleNorth: "obstaculoArriba",
         //       obstacleSouth: "obstaculoAbajo",
         //       gridEdgeEast: "bordeCuadriculaDerecha",
         //       gridEdgeWest: "bordeCuadriculaIzquierda",
         //       gridEdgeNorth: "bordeCuadriculaArriba",
         //       gridEdgeSouth: "bordeCuadriculaAbajo",
         //       platformInFront: "plataformaAdelante",
         //       platformAbove: "plataformaArriba",
         //       withdrawObject: "recogerObjeto",
         //       dropObject: "soltarObjeto",
         //       onObject: "sobreObjeto",
         //       onContainer: "sobreContenedor",
         //       onNumber: "sobreNumero",
         //       onWritable: "sobreCuadro",
         //       onLauncher: "sobreLanzador",
         //       writeNumber: "escribirNumero",
         //       readNumber: "leerNumero",
         //       pushObject: "empujarObjeto",
         //       pushableInFront: "empujableAdelante",
         //       shoot: "dispararLaser",
         //       shoot_noShadow: "dispararLaser",
         //       shootCondition: "condicionDisparo",
         //       shootCondition_noShadow: "condicionDisparo",
         //       dropPlatformInFront: "construirPlataformaAdelante",
         //       dropPlatformAbove: "construirPlataformaArriba"
         //    },
         //    messages: {
         //       leavesGrid: "¡El robot salió de la cuadrícula!",
         //       obstacle: "¡El robot intenta moverse sobre un obstáculo!",
         //       nothingToPickUp: "No hay algo para recoger",
         //       nothingToLookAt: "No hay carta ni contenedor en esta casilla",
         //       falls: "¡El robot va a caer al vacío!",
         //       willFallAndCrash: "¡El robot va a caer y chocar!",
         //       jumpOutsideGrid: "¡El robot intenta saltar fuera de la cuadrícula!",
         //       jumpObstacleBlocking: "El robot intenta saltar pero hay un obstáculo que lo bloquea",
         //       jumpNoPlatform: "¡El robot intenta saltar pero no hay una plataforma arriba!",
         //       tooManyObjects: "¡El robot intenta transportar demasiados objetos al mismo tiempo!",
         //       emptyBag: "El robot intenta soltar un objeto, ¡pero no carga nada!",
         //       successReachExit: "Bravo, ¡su robot a llegado a la salida!",
         //       failureReachExit: "Su robot no ha llegado a la salida.",
         //       successPickedAllWithdrawables: "Bravo, su robot ha recogido todo!",
         //       failurePickedAllWithdrawables: "Su robot no ha recogido todo.",
         //       successContainersFilled: "Bravo, su robot ha llenado todos los contenedores",
         //       failureContainersFilled: "Hay un objeto fuera de los contenedores",
         //       failureContainersFilledLess: "Su robot no ha llenado todos los contenedores",
         //       failureContainersFilledBag: "Su robot no ha puesto todos los objetos",
         //       failureUnfilteredObject: "Su robot ha recogido un objeto inválido",
         //       failureTooManyMoves: "Su robot ha realizado demasiados desplazamientos.",
         //       failureWriteHere: "¡Su robot no puede escribir aquí!",
         //       failureReadHere: "¡No hay un número aquí!",
         //       successNumbersWritten: "Bravo, su robot ha escrito los números correctos!",
         //       failureNumbersWritten: "Su robot no ha escrito los números correctos!",
         //       failureNothingToPush: "¡No hay un objeto que empujar!",
         //       failureWhilePushing: "¡El robot no puede empujar este objeto!",
         //       failureDropObject: "No es posible poner el objeto aquí",
         //       failureDropPlatform: "No es posible poner el objeto aquí",
         //       failureDropOutside: "Su robot intenta poner un objeto fuera de la cuadrícula",
         //       failureNotEnoughPlatform: "No hay suficiente plataforma",
         //       failureLights: "Aún faltan lugares que iluminar.",
         //       successLights: "Bravo, ¡su robot ha iluminado todos los lugares!",
         //       failureLaser: "¡El robot debe encontrarse sobre una terminal láser para poder disparar!"
         //    },
         //    cardinals: {
         //       north: "Norte",
         //       south: "Sur",
         //       west: "Oeste",
         //       east: "Este"
         //    },
         //    startingBlockName: "Programa del robot"
         // },
         // de: {
         //    label: {
         //       row: "Zeile des Roboters",
         //       col: "Spalte des Roboters",
         //       north: "gehe nach oben",
         //       south: "gehe nach unten",
         //       east: "gehe nach rechts",
         //       west: "gehe nach links",
         //       left: "drehe nach links",
         //       right: "drehe nach rechts",
         //       turnAround: "drehe um",
         //       forward: "gehe",
         //       backwards: "gehe rückwärts",
         //       jump: "springe",
         //       obstacleInFront: "vor Hindernis",
         //       obstacleEast: "Hindernis rechts",
         //       obstacleWest: "Hindernis links",
         //       obstacleNorth: "Hindernis oben",
         //       obstacleSouth: "Hindernis unten",
         //       obstacleRight: "Hindernis rechts",
         //       obstacleLeft: "Hindernis links",
         //       gridEdgeAbove: "unter Rand des Gitters",
         //       gridEdgeBelow: "über Rand des Gitters",
         //       gridEdgeEast: "links vom Gitterrand",
         //       gridEdgeWest: "rechts vom Gitterrand",
         //       platformInFront: "vor Plattform",
         //       platformAbove: "Plattform darüber",
         //       withdrawObject: "hebe Objekt auf",
         //       dropObject: "lege Objekt ab",
         //       onObject: "auf Objekt",
         //       onContainer: "auf Kiste",
         //       onNumber: "auf Zahl",
         //       onWritable: "auf Tafel",
         //       onLauncher: "sur un lanceur laser", // TODO :: translate
         //       writeNumber: "schreibe Zahl",
         //       readNumber: "Zahl auf dem Feld",
         //       pushObject: "schiebe Kiste",
         //       pushableInFront: "vor Kiste",
         //       shoot: "schieße Laser in Richtung %1",
         //       shoot_noShadow: "schieße Laser in Richtung %1",
         //       shootCondition: "Rückkehr von der Schießrichtung %1",
         //       shootCondition_noShadow: "Rückkehr von der Schießrichtung %1"
         //    },
         //    code: {
         //       row: "ligneRobot",
         //       col: "colonneRobot",
         //       north: "haut",
         //       south: "bas",
         //       east: "droite",
         //       west: "gauche",
         //       left: "tournerGauche",
         //       right: "tournerDroite",
         //       turnAround: "demiTour",
         //       forward: "avancer",
         //       backwards: "reculer",
         //       jump: "sauter",
         //       obstacleInFront: "obstacleDevant",
         //       obstacleEast: "obstacleDroite",
         //       obstacleWest: "obstacleGauche",
         //       obstacleNorth: "obstacleHaut",
         //       obstacleSouth: "obstacleBas",
         //       obstacleRight: "obstacleDroiteRel",
         //       obstacleLeft: "obstacleGaucheRel",
         //       gridEdgeEast: "bordGrilleDroite",
         //       gridEdgeWest: "bordGrilleGauche",
         //       gridEdgeNorth: "bordGrilleHaut",
         //       gridEdgeSouth: "bordGrilleBas",
         //       platformInFront: "plateformeDevant",
         //       platformAbove: "plateformeDessus",
         //       withdrawObject: "ramasserObjet",
         //       dropObject: "deposerObjet",
         //       onObject: "surObjet",
         //       onContainer: "surConteneur",
         //       onNumber: "surNombre",
         //       onWritable: "surTableau",
         //       onLauncher: "surLanceur", 
         //       writeNumber: "ecrireNombre",
         //       readNumber: "nombreSurCase",
         //       pushObject: "pousserObjet",
         //       pushableInFront: "poussableDevant",
         //       shoot: "tirerLaser",
         //       shoot_noShadow: "tirerLaser",
         //       shootCondition: "tirerCondition",
         //       shootCondition_noShadow: "tirerCondition"
         //    },
         //    messages: {
         //       leavesGrid: "Der Roboter hat das Gitter verlassen!",
         //       obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!",
         //       nothingToPickUp: "An dieser Stelle gibt es nichts zum aufheben!",
         //       nothingToLookAt: "An dieser Stelle gibt es nichts zum betrachten!",
         //       falls: "Der Roboter fällt in den Abgrund!",
         //       willFallAndCrash: "Der Roboter würde hier runterfallen und kaputt gehen!",
         //       jumpOutsideGrid: "Der Roboter versucht, aus dem Gitter zu springen!",
         //       jumpObstacleBlocking: "Der Roboter kann hier nicht springen, weil ein Hindernis ihn blockiert.",
         //       jumpNoPlatform: "Der Roboter kann hier nicht springen, weil über ihm keine Plattform ist.",
         //       tooManyObjects: "Der Roboter kann nicht so viele Objekte auf einmal tragen!",
         //       emptyBag: "Der Roboter kann nichts ablegen, weil er gar nichts transportiert!",
         //       successReachExit: "Bravo! Der Roboter hat den Ausgang erreicht.",
         //       failureReachExit: "Der Roboter hat den Ausgang nicht erreich!",
         //       successPickedAllWithdrawables: "Bravo! Der Roboter hat alles eingesammelt.",
         //       failurePickedAllWithdrawables: "Der Roboter hat nicht alles eingesammelt!",
         //       successContainersFilled: "Gut gemacht! Der Roboter hat alle Behälter gefüllt.",
         //       failureContainersFilled: "Es befindet sich ein Objekt außerhalb der Behälter.",
         //       failureContainersFilledLess: "Der Roboter hat nicht alle Behälter gefüllt.",
         //       failureContainersFilledBag: "Der Roboter hat nicht alle Objekte platziert.",
         //       failureUnfilteredObject: "Dein Roboter hat ein nicht erlaubtes Objekt aufgehoben!",
         //       failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
         //       failureWriteHere: "Der Roboter kann an dieser Stelle nicht schreiben!",
         //       failureReadHere: "An dieser Stelle steht keine Zahl!",
         //       successNumbersWritten: "Bravo! Der Roboter hat die richtigen Zahlen geschrieben.",
         //       failureNumbersWritten: "Dein Roboter hat nicht die richtigen Zahlen geschrieben!",
         //       failureNothingToPush: "An dieser Stelle gibt es nichts zum Schieben!",
         //       failureWhilePushing: "Der Roboter hat es nicht geschafft, das Objekt zu schieben!",
         //       failureDropObject: "An dieser Stelle kann kein Objekt abgelegt werden!",
         //       failureDropPlatform: "An dieser Stelle kann kein Objekt abgelegt werden!",
         //       failureDropOutside: "Der Roboter hat versucht ein Objekt vom Gitterrand zu schieben!",
         //       failureNotEnoughPlatform: "Nicht genügend Plattformen!",
         //       failureLights: "Der Roboter hat nicht alles beleuchtet!",
         //       successLights: "Bravo! Der Roboter hat alles beleuchtet.",
         //       failureLaser: "Der Roboter muss auf einem Laser stehen, um schießen zu können!",
         //    },
         //    cardinals: {
         //       north: "Norden",
         //       south: "Süden",
         //       west: "Westen",
         //       east: "Osten"
         //    },
         //    startingBlockName: "Roboter-Programm"
         // },
         // it: {
         //    label: {
         //       row: "ligne du robot",
         //       col: "colonne du robot",
         //       wait: "attendre",
         //       north: "andare avanti",
         //       south: "avanzare verso il basso",
         //       east: "avanza a destra",
         //       west: "avancer vers la gauche",
         //       left: "tourner à gauche",
         //       right: "tourner à droite",
         //       turnAround: "faire demi-tour",
         //       forward: "avancer",
         //       backwards: "reculer",
         //       jump: "sauter",
         //       obstacleInFront: "obstacle devant",
         //       obstacleEast: "obstacle à droite",
         //       obstacleWest: "obstacle à gauche",
         //       obstacleNorth: "obstacle en haut",
         //       obstacleSouth: "obstacle en bas",
         //       obstacleRight: "obstacle à droite",
         //       obstacleLeft: "obstacle à gauche",
         //       gridEdgeEast: "bord de la grille à droite",
         //       gridEdgeWest: "bord de la grille à gauche",
         //       gridEdgeNorth: "bord de la grille en haut",
         //       gridEdgeSouth: "bord de la grille en bas",
         //       platformInFront: "plateforme devant",
         //       platformAbove: "plateforme au-dessus",
         //       withdrawObject: "ramasser l'objet",
         //       dropObject: "dipingi la scatola",
         //       onObject: "su un marmo",
         //       onContainer: "su un buco",
         //       onNumber: "sur un nombre",
         //       onWritable: "sur un tableau",
         //       onLauncher: "sur un lanceur laser",
         //       writeNumber: "scrivere numero",
         //       readNumber: "numero sulla casella",
         //       pushObject: "pousser l'objet",
         //       pushableInFront: "poussable devant",
         //       shoot: "tirer au laser dans la direction %1",
         //       shoot_noShadow: "tirer au laser dans la direction %1",
         //       shootCondition: "retour départ tir direction %1",
         //       shootCondition_noShadow: "retour départ tir direction %1",
         //       connect: "brancher un câble",
         //       onMale: "sur une prise mâle",
         //       onFemale: "sur une prise femelle"
         //    },
         //    code: {
         //       row: "ligneRobot",
         //       col: "colonneRobot",
         //       wait: "attendre",
         //       north: "haut",
         //       south: "bas",
         //       east: "droite",
         //       west: "gauche",
         //       left: "tournerGauche",
         //       right: "tournerDroite",
         //       turnAround: "demiTour",
         //       forward: "avancer",
         //       backwards: "reculer",
         //       jump: "sauter",
         //       obstacleInFront: "obstacleDevant",
         //       obstacleEast: "obstacleDroite",
         //       obstacleWest: "obstacleGauche",
         //       obstacleNorth: "obstacleHaut",
         //       obstacleSouth: "obstacleBas",
         //       obstacleRight: "obstacleDroiteRel",
         //       obstacleLeft: "obstacleGaucheRel",
         //       gridEdgeEast: "bordGrilleDroite",
         //       gridEdgeWest: "bordGrilleGauche",
         //       gridEdgeNorth: "bordGrilleHaut",
         //       gridEdgeSouth: "bordGrilleBas",
         //       platformInFront: "plateformeDevant",
         //       platformAbove: "plateformeDessus",
         //       withdrawObject: "ramasserObjet",
         //       dropObject: "deposerObjet",
         //       onObject: "surObjet",
         //       onContainer: "surConteneur",
         //       onNumber: "surNombre",
         //       onWritable: "surTableau",
         //       onLauncher: "surLanceur",
         //       writeNumber: "ecrireNombre",
         //       readNumber: "nombreSurCase",
         //       pushObject: "pousserObjet",
         //       pushableInFront: "poussableDevant",
         //       shoot: "tirerLaser",
         //       shoot_noShadow: "tirerLaser",
         //       shootCondition: "tirerCondition",
         //       shootCondition_noShadow: "tirerCondition",
         //       connect: "brancherCable",
         //       onMale: "surMale",
         //       onFemale: "surFemelle"
         //    },
         //    messages: {
         //       leavesGrid: "Le robot sort de la grille !",
         //       obstacle: "Le robot essaie de se déplacer sur un obstacle !",
         //       nothingToPickUp: "Il n'y a rien à ramasser !",
         //       nothingToLookAt: "Il n'y a ni carte ni conteneur sur cette case",
         //       falls: "Le robot va se jeter dans le vide !",
         //       willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
         //       jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
         //       jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
         //       jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
         //       tooManyObjects: "Le robot essaie de transporter trop d'objets à la fois !",
         //       emptyBag: "Le robot essaie de déposer un objet alors qu'il n'en transporte pas !",
         //       successReachExit: "Bravo, votre robot a atteint la sortie !",
         //       failureReachExit: "Votre robot n'a pas atteint la sortie.",
         //       successPickedAllWithdrawables: "Bravo, votre robot a tout ramassé !",
         //       failurePickedAllWithdrawables: "Votre robot n'a pas tout ramassé.",
         //       successContainersFilled: "Bravo, votre robot a rempli tous les conteneurs",
         //       failureContainersFilled: "Il y a un objet hors des conteneurs",
         //       failureContainersFilledLess: "Votre robot n'a pas rempli tous les conteneurs",
         //       failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
         //       failureUnfilteredObject: "Votre robot a ramassé un objet invalide",
         //       failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
         //       failureWriteHere: "Votre robot ne peut pas écrire ici !",
         //       failureReadHere: "Il n'y a pas de nombre écrit ici !",
         //       successNumbersWritten: "Bravo, votre robot a écrit les bons nombres !",
         //       failureNumbersWritten: "Votre robot n'a pas écrit les bons nombres !",
         //       failureNothingToPush: "Il n'y a pas d'objet à pousser !",
         //       failureWhilePushing: "Le robot ne peut pas pousser cet objet !",
         //       failureDropObject: "On ne peut pas poser d'objet ici",
         //       failureDropPlatform: "On ne peut pas construire de plateforme ici",
         //       failureDropOutside: "Votre robot essaie de poser un objet hors de la grille",
         //       failureNotEnoughPlatform: "Pas assez de plateformes",
         //       failureLights: "Il reste des spots à allumer.",
         //       successLights: "Bravo, votre robot a allumé tous les spots !",
         //       failureLaser: "Le robot doit se trouver sur une borne laser pour pouvoir tirer !",
         //       failureNoPlug: "Le robot doit se trouver sur une prise pour pouvoir brancher un câble !",
         //       failureAlreadyWired: "Cette prise est déjà connectée à un câble !",
         //       failureWrongPlugType: "On ne peut pas connecter ces prises ensemble !",
         //       successPlugsWired: "La machine est réparée !",
         //       failurePlugsWired: "La machine ne fonctionne pas car des prises n'ont pas été connectées !",
         //       failureWireCrossing: "Impossible de relier ces deux prises, deux câbles vont s'intersecter !",
         //       failureWireTooLong: "Impossible de relier ces deux prises car elles sont trop éloignées !",
         //       failureTotalLengthExceeded: "Vous n'avez pas assez de longueur de câble pour relier ces deux prises !",
         //       failureProjectile: "Le robot s'est pris un projectile !",
         //       failureRewrite: "Le robot a essayé de repeindre une case."
         //    },
         //    cardinals: {
         //       north: "Nord",
         //       south: "Sud",
         //       west: "Ovest",
         //       east: "Est"
         //    },
         //    startingBlockName: "Programme du robot"
         // },
      },
      default: {
         fr: {
            label: {
               withdrawObject: "ramasser le bois",
               dropObject: "déposer le bois",
               onObject: "sur du bois",
               onContainer: "sur une cheminée"
            },
            code: {
               withdrawObject: "ramasserBois",
               dropObject: "deposerBois",
               onObject: "surBois",
               onContainer: "surCheminee"
            },
            messages: {
               // success: "Bravo, vous avez réussi !",
               // failure: "Vous n'avez pas atteint l'objectif"
            }
         },

         en: {
            label: {
               withdrawObject: "pick up the gear",
               dropObject: "accrocher la roue dentée",
               onObject: "sur une roue dentée",
               onContainer: "sur une machine"
            },
            code: {
               withdrawObject: "pickGear",
               dropObject: "attachGear",
               onObject: "onGear",
               onContainer: "onMachine"
            },
            messages: {
               successContainersFilled: "Bravo, les machines sont prêtes à fonctionner !",
               failureContainersFilled: "Votre robot n'a pas replacé toutes les roues dentées au bon endroit.",
               failureContainersFilledLess: "Votre robot n'a pas replacé toutes les roues dentées au bon endroit.",
               failureContainersFilledBag: "Votre robot doit déposer la roue dentée sur la machine.",
               failureDropOutside: "Votre robot essaie de construire une plateforme hors de la grille.",
               failureDropObject: "Il y a déjà une plateforme ici !",
               failureDropPlatform: "Il y a déjà une plateforme ici !",
               emptyBag: "Le robot essaie d'accrocher une roue dentée alors qu'il n'en transporte pas !"
            }
         },

         es: {
            label: {
               withdrawObject: "recoger el engranaje",
               dropObject: "soltar el engranaje",
               onObject: "sobre engranaje",
               onContainer: "sobre una máquina"
            },
            code: {
               withdrawObject: "recogerEngranaje",
               dropObject: "soltarEngranaje",
               onObject: "sobreEngranaje",
               onContainer: "sobreMaquina"
            },
            messages: {
               successContainersFilled: "Bravo, ¡la máquina está lista para funcionar!",
               failureContainersFilled: "Su robot no ha puesto todos los engranajes en el lugar correcto.",
               failureContainersFilledLess: "Su robot no ha puesto todos los engranajes en el lugar correcto.",
               failureContainersFilledBag: "Su robot debe colocar el engranaje en la máquina.",
               failureDropOutside: "Su robot intenta construir una plataforma fuera de la cuadrícula."
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
         // hasGravity: true,
         // bagSize: 1,
         // containerSize: 1,
         itemTypes: {
            // robot: { img: imgPath+"castle_robot.png", side: 80, nbStates: 9, isRobot: true, offsetX: -11, offsetY: 3, zOrder: 3 },
            circle: { num: 2, img: imgPath+"card_roundDotted.png", side: 60, isMovable: true, zOrder: 0 },
            square: { num: 3, img: imgPath+"card_squareQuadrille.png", side: 60, isMovable: true, zOrder: 1},
            triangle: { num: 4, img: imgPath+"card_triangleStriped.png", side: 60, isMovable: true, zOrder: 1},
            // wood: { num:5, img: imgPath+"firewood.png", side: 60, isWithdrawable: true, zOrder: 2},
            // projectile_generator: {num: 7, side: 60, action: function(item, time) {
            //    if(item.period == undefined)
            //       item.period = 1;
            //    if(item.start == undefined)
            //       item.start = 1;
            //    if(time % item.period == item.start) 
            //       this.dropObject({type: "projectile"}, {row: item.row, col: item.col}); 
            // }}
         },
         checkEndCondition: endConditions.dev
      },
   };

   var craneRailSrc = imgPath+"crane/rail.png";
   var craneWheelsSrc = imgPath+"crane/wheels.png";
   var craneLineSrc = imgPath+"crane/line.png";
   var craneLeftClawSrc = imgPath+"crane/left_claw.png";
   var craneRightClawSrc = imgPath+"crane/right_claw.png";

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
   //    name: "row",
   //    type: "sensors",
   //    block: { name: "row", yieldsValue: 'int' },
   //    func: function(callback) {
   //       this.callCallback(callback, 1 + this.getRobot().row);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "col",
   //    type: "sensors",
   //    block: { name: "col", yieldsValue: 'int' },
   //    func: function(callback) {
   //       this.callCallback(callback, 1 + this.getRobot().col);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "wait",
   //    type: "actions",
   //    block: { name: "wait" },
   //    func: function(callback) {
   //       this.advanceTime(1);
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "north",
   //    type: "actions",
   //    block: { name: "north" },
   //    func: function(callback) {
   //       this.north(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "south",
   //    type: "actions",
   //    block: { name: "south" },
   //    func: function(callback) {
   //       this.south(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "east",
   //    type: "actions",
   //    block: { name: "east" },
   //    func: function(callback) {
   //       this.east(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "west",
   //    type: "actions",
   //    block: { name: "west" },
   //    func: function(callback) {
   //       this.west(callback);
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
   
 //   infos.newBlocks.push({
 //      name: "turnAround",
 //      type: "actions",
 //      block: { name: "turnAround" },
 //      func: function(callback) {
 //         this.turnAround(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "forward",
 //      type: "actions",
 //      block: { name: "forward" },
 //      func: function(callback) {
 //         this.forward(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "backwards",
 //      type: "actions",
 //      block: { name: "backwards" },
 //      func: function(callback) {
 //         this.backwards(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "jump",
 //      type: "actions",
 //      block: { name: "jump" },
 //      func: function(callback) {
 //         this.jump(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleInFront",
 //      type: "sensors",
 //      block: { name: "obstacleInFront", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.obstacleInFront());
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleEast",
 //      type: "sensors",
 //      block: { name: "obstacleEast", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.hasOn(robot.row, robot.col + 1, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleWest",
 //      type: "sensors",
 //      block: { name: "obstacleWest", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.hasOn(robot.row, robot.col - 1, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleNorth",
 //      type: "sensors",
 //      block: { name: "obstacleNorth", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleSouth",
 //      type: "sensors",
 //      block: { name: "obstacleSouth", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.hasOn(robot.row + 1, robot.col, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleRight",
 //      type: "sensors",
 //      block: { name: "obstacleRight", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         var coords = this.coordsInFront(1);
 //         this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "obstacleLeft",
 //      type: "sensors",
 //      block: { name: "obstacleLeft", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         var coords = this.coordsInFront(3);
 //         this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "gridEdgeEast",
 //      type: "sensors",
 //      block: { name: "gridEdgeEast", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, !this.isInGrid(robot.row, robot.col + 1));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "gridEdgeWest",
 //      type: "sensors",
 //      block: { name: "gridEdgeWest", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, !this.isInGrid(robot.row, robot.col - 1));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "gridEdgeNorth",
 //      type: "sensors",
 //      block: { name: "gridEdgeNorth", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, !this.isInGrid(robot.row - 1, robot.col));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "gridEdgeSouth",
 //      type: "sensors",
 //      block: { name: "gridEdgeSouth", yieldsValue: true },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, !this.isInGrid(robot.row + 1, robot.col));
 //      }
 //   });
      
 //   infos.newBlocks.push({
 //      name: "platformInFront",
 //      type: "sensors",
 //      block: { name: "platformInFront", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.platformInFront());
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "platformAbove",
 //      type: "sensors",
 //      block: { name: "platformAbove", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.platformAbove());
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "withdrawObject",
 //      type: "actions",
 //      block: { name: "withdrawObject" },
 //      func: function(callback) {
 //         this.withdraw();
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropObject",
 //      type: "actions",
 //      block: { name: "dropObject" },
 //      func: function(callback) {
 //         this.drop();
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onObject",
 //      type: "sensors",
 //      block: { name: "onObject", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.isWithdrawable === true;}));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onContainer",
 //      type: "sensors",
 //      block: { name: "onContainer", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.isContainer === true;}));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onNumber",
 //      type: "sensors",
 //      block: { name: "onNumber", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.value !== undefined;}));
 //      }
 //   });
	
	// infos.newBlocks.push({
 //      name: "onLauncher",
 //      type: "sensors",
 //      block: { name: "onLauncher", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.isLaser === true;}));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onWritable",
 //      type: "sensors",
 //      block: { name: "onWritable", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.isWritable === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "writeNumber",
 //      type: "actions",
 //      block: { name: "writeNumber", params: [null] },
 //      func: function(value, callback) {
 //         var robot = this.getRobot();
 //         this.writeNumber(robot.row, robot.col, value);
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "readNumber",
 //      type: "sensors",
 //      block: { name: "readNumber", yieldsValue: 'int' },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.readNumber(robot.row, robot.col));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "nbWithdrawables",
 //      type: "sensors",
 //      block: { name: "nbWithdrawables", yieldsValue: 'int' },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWithdrawable === true; }).length);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "nbInBag",
 //      type: "sensors",
 //      block: { name: "nbInBag", yieldsValue: 'int' },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         this.callCallback(callback, context.bag.length);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "containerSize",
 //      type: "sensors",
 //      block: { name: "containerSize", yieldsValue: 'int' },
 //      func: function(callback) {
 //         var robot = this.getRobot();
 //         var containers = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isContainer === true; });
         
 //         if(containers.length == 0) {
 //            this.callCallback(callback, 0);
 //            return;
 //         }
         
 //         this.callCallback(callback, containers[0].containerSize);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "pushObject",
 //      type: "actions",
 //      block: { name: "pushObject" },
 //      func: function(callback) {
 //         this.pushObject(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "pushableInFront",
 //      type: "sensors",
 //      block: { name: "pushableInFront", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isInFront(function(obj) { return obj.isPushable === true; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropInFront",
 //      type: "actions",
 //      block: { name: "dropInFront" },
 //      func: function(callback) {
 //         this.drop(1, this.coordsInFront());
 //         this.callCallback(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropAbove",
 //      type: "actions",
 //      block: { name: "dropAbove" },
 //      func: function(callback) {
 //         this.drop(1, {row: this.getRobot().row - 1, col: this.getRobot().col});
 //         this.callCallback(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "withdrawNum_noShadow",
 //      type: "actions",
 //      block: { 
 //         name: "withdrawNum_noShadow", 
 //         params: [null]
 //      },
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         for(var i = 0;i < value;i++) {
 //            this.withdraw();
 //         }
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "withdrawNum",
 //      type: "actions",
 //      block: { name: "withdrawNum", params: [null], blocklyXml: "<block type='withdrawNum_noShadow'>" +
 //                              "  <value name='PARAM_0'>" +
 //                              "    <shadow type='math_number'>" +
 //                              "      <field name='NUM'>0</field>" +
 //                              "    </shadow>" +
 //                              "  </value>" +
 //                              "</block>"},
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         for(var i = 0;i < value;i++) {
 //            this.withdraw();
 //         }
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropNum_noShadow",
 //      type: "actions",
 //      block: { 
 //         name: "dropNum_noShadow", 
 //         params: [null]
 //      },
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         this.drop(value);
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropNum",
 //      type: "actions",
 //      block: { name: "dropNum", params: [null], blocklyXml: "<block type='dropNum_noShadow'>" +
 //                              "  <value name='PARAM_0'>" +
 //                              "    <shadow type='math_number'>" +
 //                              "      <field name='NUM'>0</field>" +
 //                              "    </shadow>" +
 //                              "  </value>" +
 //                              "</block>"},
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         this.drop(value);
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "shoot_noShadow",
 //      type: "actions",
 //      block: { 
 //         name: "shoot_noShadow", 
 //         params: [null]
 //      },
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
 //            this.shoot(this.getRobot().row, this.getRobot().col, value);
 //            if(this.display) {
 //               var robot = this.getRobot();
 //               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
 //                  return obj.isLaser === true;
 //               });
               
 //               if(lasers.length != 0) {
 //                  lasers[0].element.toFront();
 //               }
               
 //               robot.element.toFront();
 //            }
 //         }
 //         else {
 //            throw(window.languageStrings.messages.failureLaser);
 //         }
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "shoot",
 //      type: "actions",
 //      block: { name: "shoot", params: [null], blocklyXml: "<block type='shoot_noShadow'>" +
 //                              "  <value name='PARAM_0'>" +
 //                              "    <shadow type='math_number'>" +
 //                              "      <field name='NUM'>0</field>" +
 //                              "    </shadow>" +
 //                              "  </value>" +
 //                              "</block>"},
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
 //         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
 //            this.shoot(this.getRobot().row, this.getRobot().col, value);
 //            if(this.display) {
 //               var robot = this.getRobot();
 //               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
 //                  return obj.isLaser === true;
 //               });
               
 //               if(lasers.length != 0) {
 //                  lasers[0].element.toFront();
 //               }
               
 //               robot.element.toFront();
 //            }
 //         }
 //         else {
 //            throw(window.languageStrings.messages.failureLaser);
 //         }
 //         this.waitDelay(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "shootCondition_noShadow",
 //      type: "actions",
 //      block: { 
 //         name: "shootCondition_noShadow", 
 //         params: [null],
 //         yieldsValue: true
 //      },
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
         
 //         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
 //            var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
 //            if(this.display) {
 //               var robot = this.getRobot();
 //               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
 //                  return obj.isLaser === true;
 //               });
               
 //               if(lasers.length != 0) {
 //                  lasers[0].element.toFront();
 //               }
               
 //               robot.element.toFront();
 //            }
 //            this.waitDelay(callback, retour);
 //         }
 //         else {
 //            throw(window.languageStrings.messages.failureLaser);
 //            this.callCallback(callback);
 //         }
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "shootCondition",
 //      type: "actions",
 //      block: { name: "shootCondition", blocklyXml: "<block type='shootCondition_noShadow'>" +
 //                              "  <value name='PARAM_0'>" +
 //                              "    <shadow type='math_number'>" +
 //                              "      <field name='NUM'>0</field>" +
 //                              "    </shadow>" +
 //                              "  </value>" +
 //                              "</block>"},
 //      func: function(value, callback) {
 //         if((typeof value) == "function") {
 //            this.callCallback(value);
 //            return;
 //         }
         
 //         if(this.isOn(function(obj) { return obj.isLaser === true; })) {
 //            var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
 //            if(this.display) {
 //               var robot = this.getRobot();
 //               var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
 //                  return obj.isLaser === true;
 //               });
               
 //               if(lasers.length != 0) {
 //                  lasers[0].element.toFront();
 //               }
               
 //               robot.element.toFront();
 //            }
 //            this.waitDelay(callback, retour);
 //         }
 //         else {
 //            throw(window.languageStrings.messages.failureLaser);
 //            this.callCallback(callback);
 //         }
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "connect",
 //      type: "actions",
 //      block: { name: "connect" },
 //      func: function(callback) {
 //         this.connect();
 //         this.callCallback(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onMale",
 //      type: "sensors",
 //      block: { name: "onMale", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.plugType > 0; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "onFemale",
 //      type: "sensors",
 //      block: { name: "onFemale", yieldsValue: true },
 //      func: function(callback) {
 //         this.callCallback(callback, this.isOn(function(obj) { return obj.plugType < 0; }));
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropPlatformInFront",
 //      type: "actions",
 //      block: { name: "dropPlatformInFront" },
 //      func: function(callback) {
 //         if(this.nbPlatforms == 0)
 //            throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
 //         var coords = {row: this.coordsInFront().row + 1, col: this.coordsInFront().col};
 //         if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
 //            throw(window.languageStrings.messages.failureDropPlatform);
 //         }
 //         this.nbPlatforms -= 1;
 //         this.dropObject({type: "platform"}, coords);
 //         this.callCallback(callback);
 //      }
 //   });
   
 //   infos.newBlocks.push({
 //      name: "dropPlatformAbove",
 //      type: "actions",
 //      block: { name: "dropPlatformAbove" },
 //      func: function(callback) {
 //         if(this.nbPlatforms == 0)
 //            throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
 //         var coords = {row: this.getRobot().row - 1, col: this.getRobot().col};
 //         if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
 //            throw(window.languageStrings.messages.failureDropPlatform);
 //         }
 //         this.nbPlatforms -= 1;
 //         this.dropObject({type: "platform"}, coords);
 //         this.callCallback(callback);
 //      }
 //   });
   
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
   // var cardLabels = [];

   var crane = {};
   var craneH = 1; // as rows
   var craneWheelsPos = 13; 
   var craneClawsAxisPos = 33; 
   var craneClawsPos = 27; 
   var craneClawW = 40;
   var craneClawH = 33;
   var craneClawOffset = 5;
   var clutchAngle = 20;

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
   if (infos.showLabels) {
      infos.rightMargin += infos.cellSide;
   }
   if (infos.showLabels || infos.showContLabels) {
      infos.bottomMargin += infos.cellSide;
   }
   // if (infos.showCardinals) {
   //    infos.leftMargin += infos.cellSide * 1.8;
   //    infos.topMargin += infos.cellSide;
   //    infos.rightMargin += infos.cellSide;
   //    infos.bottomMargin += infos.cellSide;
   // }

   
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
      // console.log("reset")
      if(gridInfos) {
         context.tiles = gridInfos.tiles;
         context.container = gridInfos.container || [[]];
         context.initItems = gridInfos.initItems;
         context.nbRows = context.tiles.length;
         context.nbCols = context.tiles[0].length;
         context.nbRowsCont =  context.container.length;
         context.nbColCont =  context.container[0].length;
         context.initCranePos = gridInfos.initCranePos || 0;
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
      // context.bag = [];
      
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
         resetBoard();
         resetItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);
      }else{
         resetItems();
      }
   };

   context.redrawDisplay = function() {
      // console.log("redrawDisplay")
      if(context.display) {
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         var paperW = infos.cellSide * (context.nbCols + context.nbColCont) * scale;
         var paperH = infos.cellSide * Math.max(context.nbRows,context.nbRowsCont) * scale;
         paper = this.raphaelFactory.create("paperMain", "grid", paperW, paperH);
         resetBoard();
         console.log("redrawDisplay")
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
      var y = 0;
      var cranePos = context.cranePos;
      var nbRowsCont = context.nbRowsCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var x = infos.leftMargin*scale + w*cranePos;

      var lineH = nbRows + craneH;
      var y0Line = (craneH - lineH)*cSide*scale;
      var yLineClip1 = craneWheelsPos*scale;
      var yLineClip2 = craneClawsAxisPos*scale;
      var hClip = yLineClip2 - yLineClip1;
      var lineClip = [x,yLineClip1,w,hClip];

      var xLeftClaw = x - craneClawOffset*scale;
      var xRightClaw = x + w + (craneClawOffset - craneClawW)*scale;
      var yClaws = craneClawsPos*scale;

      var cx = x + w/2;
      var cy = yLineClip2;

      return { x, y, w, h, y0Line, lineClip, yClaws, xLeftClaw, xRightClaw, cx, cy }
   };

   function setCraneAttr(attr) {
      var cSide = infos.cellSide;
      var x = attr.x, y = attr.y;
      var width = attr.w, height = attr.h;
      crane.wheels.attr({ x, y, width, height });
      for(var iRow = 0; iRow < crane.line.length; iRow++){
         var yLine = attr.y0Line + iRow*cSide*scale;
         crane.line[iRow].attr({x, y: yLine, width, height });
      }
      crane.line.attr("clip-rect",attr.lineClip);
      crane.leftClaw.attr({ 
         x: attr.xLeftClaw, 
         y: attr.yClaws, 
         width: craneClawW*scale, 
         height: craneClawH*scale 
      });
      crane.rightClaw.attr({ 
         x: attr.xRightClaw, 
         y: attr.yClaws, 
         width: craneClawW*scale, 
         height: craneClawH*scale 
      });

      if(context.craneContent){
         var angle = clutchAngle;
         crane.leftClaw.transform(["R",-angle,attr.cx,attr.cy]);
         crane.rightClaw.transform(["R",angle,attr.cx,attr.cy]);
         var elem = context.craneContent.element;
         var newY = (infos.topMargin + craneClawsPos)*scale;
         elem.attr({ x, y: newY }).toFront();
      }else{
         crane.leftClaw.transform("");
         crane.rightClaw.transform("");
      }
   };
   
   var resetBoard = function() {
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
         for(var iRow = 0;iRow < context.nbRows;iRow++) {
            rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
         }
      }
      if(infos.showContLabels) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            contLabels[iCol] = paper.text(0, 0, String.fromCharCode(iCol + 65));
         }
      }

      resetCrane();
   };

   function resetCrane() {
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      crane.rail = paper.set();
      for(var iCol = 0; iCol < nbCol; iCol++){
         crane.rail.push(paper.image(craneRailSrc,0,0,0,0));
      }
      paper.setStart();
      crane.wheels = paper.image(craneWheelsSrc,0,0,0,0);
      var lineH = nbRows + craneH;
      crane.line = paper.set();
      for(var iRow = 0; iRow < lineH; iRow++){
         crane.line.push(paper.image(craneLineSrc,0,0,0,0));
      }
      crane.leftClaw = paper.image(craneLeftClawSrc,0,0,0,0);
      crane.rightClaw = paper.image(craneRightClawSrc,0,0,0,0);
      crane.all = paper.setFinish();
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
         redisplayItem(item);
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
      var nbRowsCont = context.container.length;
      var nbColCont = context.container[0].length;
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
         }
      }
      for(var iItem = context.initItems.length - 1;iItem >= 0;iItem--) {
         resetItem(context.initItems[iItem], false);
      }
      
      if(context.display){
         // console.log("resetItems")
         redisplayAllItems();
      }
   };
   
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
      }else{
         // console.log("undefined",item)
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
         item.element = paper.image(imgUrlWithPrefix(item.img), x, y, item.side * item.nbStates * scale, item.side * scale);
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
      var paperWidth = (cSide * nbCol + infos.leftMargin + infos.rightMargin)* scale;
      var paperHeight = (cSide * (nbRows + craneH) + infos.topMargin + infos.bottomMargin)* scale;
      paper.setSize(paperWidth, paperHeight);

      for(var iRow = 0;iRow < nbRows;iRow++) {
         for(var iCol = 0;iCol < nbCol;iCol++) {
            if(cells[iRow][iCol] === undefined)
               continue;
            var x = (cSide * iCol + infos.leftMargin) * scale;
            var y = (cSide * (craneH + iRow) + infos.topMargin) * scale;
            cells[iRow][iCol].attr({x: x, y: y, width: cSide * scale, height: cSide * scale});
         }
      }
      if(infos.showContOutline){
         var x1 = infos.leftMargin * scale;
         var x2 = (infos.leftMargin + nbColCont*cSide) * scale;
         var y1 = (nbRowsCont >= context.nbRows) ? (infos.topMargin + craneH*cSide) * scale : (infos.topMargin + (context.nbRows - nbRowsCont + craneH ) * cSide) * scale;
         var y2 = y1 + nbRowsCont * cSide * scale;
         contOutline.attr("path",["M",x1,y1,"V",y2,"H",x2,"V",y1]);
      }
      var textFontSize = {"font-size": cSide * scale / 2};
      if(infos.showLabels) {
         for(var iRow = 0;iRow < context.nbRows;iRow++) {
            var x = (infos.leftMargin + nbCol*cSide + infos.rightMargin - cSide / 2) * scale;
            var y = (cSide * (iRow + 0.5 + craneH) + infos.topMargin) * scale;
            rowsLabels[iRow].attr({x: x, y: y}).attr(textFontSize);
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var x = (cSide * (iCol + nbColCont) + infos.leftMargin + cSide / 2) * scale;
            var y = (infos.topMargin + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin) * scale;
            colsLabels[iCol].attr({x: x, y: y}).attr(textFontSize);
         }
      }
      if(infos.showContLabels) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            var x = (cSide * iCol + infos.leftMargin + cSide / 2) * scale;
            var y = (infos.topMargin + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin) * scale;
            contLabels[iCol].attr({x: x, y: y}).attr(textFontSize);
         }
      }
      // console.log("updateScale")
      redisplayAllItems();      

      /* crane */
      var w = cSide*scale, h = w;
      var y = 0;
      for(var iCol = 0; iCol < nbCol; iCol++){
         var x = (cSide*iCol + infos.leftMargin)*scale;
         crane.rail[iCol].attr({ x, y, 
            width: w, height: h
         });
      }
      var craneAttr = getCraneAttr();
      setCraneAttr(craneAttr);

   };
   
   var redisplayAllItems = function() {
      // console.log("redisplayAllItems")
      if(context.display !== true)
         return;
      for(var iItem = 0;iItem < context.items.length;iItem++) {
         var item = context.items[iItem];
         redisplayItem(item, false);
      }
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         item.redisplay();
      }
      if(context.craneContent){
         redisplayItem(context.craneContent, false);
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
         if(cellItems[iItem].element !== undefined)
            cellItems[iItem].element.toFront();
      }
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
   
   // context.tryToBeOn = function(row, col) {
   //    // Returns whether the robot can move to row, col
   //    // true : yes, false : no but move ignored, string : no and throw error
   //    if(!context.isInGrid(row, col)) {
   //       if(infos.ignoreInvalidMoves)
   //          return false;
   //       return strings.messages.leavesGrid;
   //    }
      
   //    if(context.hasOn(row, col, function(item) { return item.isObstacle === true; })) {
   //       if(infos.ignoreInvalidMoves)
   //          return false;
   //       return strings.messages.obstacle;
   //    }
      
   //    if(context.hasOn(row, col, function(item) { return item.isProjectile === true; })) {
   //       if(infos.ignoreInvalidMoves)
   //          return false;
   //       return strings.messages.failureProjectile;
   //    }
   //    return true;
   // };

   context.tryToGo = function(col) {
      // Returns whether the crane can move to col
      // true : yes, false : no but move ignored, string : no and throw error
      // var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      // var nbRows = Math.max(context.nbRows,nbRowsCont);

      if(col < 0 || col >= nbCol) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.outside;
      }
      
      // if(context.hasOn(row, col, function(item) { return item.isObstacle === true; })) {
      //    if(infos.ignoreInvalidMoves)
      //       return false;
      //    return strings.messages.obstacle;
      // }
      
      // if(context.hasOn(row, col, function(item) { return item.isProjectile === true; })) {
      //    if(infos.ignoreInvalidMoves)
      //       return false;
      //    return strings.messages.failureProjectile;
      // }
      return true;
   };
   
   // context.coordsInFront = function(dDir, mult) {
   //    if(dDir === undefined)
   //       dDir = 0;
   //    if(mult === undefined)
   //       mult = 1;
   //    var item = context.getRobot();
   //    var lookDir = (item.dir + dDir + 4) % 4;
   //    var delta = [[0,1],[1,0],[0,-1],[-1,0]];
   //    return {
   //       row: item.row + delta[lookDir][0] * mult,
   //       col: item.col + delta[lookDir][1] * mult
   //    };
   // };
   
   // context.isCrossing = function(wireA, wireB) {
   //    function crossProduct(pointA, pointB, pointC) {
   //       return (pointB[0] - pointA[0]) * (pointC[1] - pointA[1]) - (pointB[1] - pointA[1]) * (pointC[0] - pointA[0]);
   //    }
      
   //    function onLine(segment, point) {
   //       return (Math.min(segment[0][0], segment[1][0]) <= point[0] && point[0] <= Math.max(segment[0][0], segment[1][0]))
   //        && (Math.min(segment[0][1], segment[1][1]) <= point[1] && point[1] <= Math.max(segment[0][1], segment[1][1]));
   //    }
      
   //    if(crossProduct(wireA[0], wireA[1], wireB[0]) == 0 && crossProduct(wireA[0], wireA[1], wireB[1]) == 0) {
   //       return onLine(wireA, wireB[0]) || onLine(wireA, wireB[1]) || onLine(wireB, wireA[0]) || onLine(wireB, wireA[1]);
   //    }
   //    return (crossProduct(wireA[0], wireA[1], wireB[0])
   //    * crossProduct(wireA[0], wireA[1], wireB[1]) <= 0) &&
   //    (crossProduct(wireB[0], wireB[1], wireA[0])
   //    * crossProduct(wireB[0], wireB[1], wireA[1]) <= 0);
   // }
   
   // context.moveRobot = function(newRow, newCol, newDir, callback) {
   //    var iRobot = context.getRobotId();
   //    var item = context.items[iRobot];
   //    if (context.display) 
   //       item.element.toFront();
   //    var animate = (item.row != newRow) || (item.col != newCol) || (newDir == item.dir);
      
   //    if((item.dir != newDir) && ((item.row != newRow) || (item.col != newCol))) {
   //       if(item.dir !== undefined)
   //          item.dir = newDir;
   //       if(context.display) {
   //          var attr = itemAttributes(item);
   //          item.element.attr(attr);
   //       }
   //    }
      
   //    if(item.dir !== undefined)
   //       item.dir = newDir;
      
   //    item.row = newRow;
   //    item.col = newCol;
      
   //    context.withdraw(function(obj) { return obj.autoWithdraw === true; }, false);
      
   //    if(context.display) {
   //       attr = itemAttributes(item);
   //       if(infos.actionDelay > 0) {
   //          if(animate) {
   //             context.raphaelFactory.animate("animRobot" + iRobot + "_" + Math.random(), item.element, attr, infos.actionDelay);
   //          } else {
   //             context.delayFactory.createTimeout("moveRobot" + iRobot + "_" + Math.random(), function() {
   //                item.element.attr(attr);
   //             }, infos.actionDelay / 2);
   //          }
   //       } else {
   //          item.element.attr(attr);
   //       }
   //       $("#nbMoves").html(context.nbMoves);
   //    }
      
   //    context.advanceTime(1);
   //    if(callback) {
   //       context.waitDelay(callback);
   //    }
   // };

   context.moveCrane = function(newCol, callback) {
      // var iRobot = context.getRobotId();
      // var item = context.items[iRobot];
      if (context.display) {
         crane.all.toFront();
      }
      var animate = (context.cranePos != newCol);
      
      // if(cranePos != newCol) {
      //    if(context.display) {
      //       var attr = itemAttributes(item);
      //       item.element.attr(attr);
      //    }
      // }
      
      // if(item.dir !== undefined)
      //    item.dir = newDir;
      var oldPos = context.cranePos;
      context.cranePos = Math.floor(newCol);
      
      // context.withdraw(function(obj) { return obj.autoWithdraw === true; }, false);
      
      if(context.display) {
         // attr = itemAttributes(item);
         var craneAttr = getCraneAttr();
         if(infos.actionDelay > 0) {
            if(false) {
            // if(animate) {
               var tx = (newCol - oldPos)*infos.cellSide*scale;
               console.log(tx)
               var anim = new Raphael.animation({ transform: ["T",tx,0] },infos.actionDelay);
               var animEnd = new Raphael.animation({ transform: ["T",tx,0] },infos.actionDelay,function() {
                  console.log("cb");
                  crane.all.attr("transform","");
                  setCraneAttr(craneAttr);
               });
               context.raphaelFactory.animate("animCrane_" + Math.random(), crane.all, anim);
               // context.raphaelFactory.animate("animCraneLine_" + Math.random(), crane.line, anim);
               // context.raphaelFactory.animate("animCraneLeftClaw_" + Math.random(), crane.leftClaw, anim);
               // context.raphaelFactory.animate("animCraneRightClaw_" + Math.random(), crane.rightClaw, animEnd);
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
   
   context.moveItem = function(item, newRow, newCol) {
      var animate = (item.row != newRow) || (item.col != newCol);
      var robot = context.getRobot();
      if(context.display) {
         resetItemsZOrder(newRow, newCol);
         resetItemsZOrder(item.row, item.col);
         resetItemsZOrder(robot.row, robot.col);
      }
      item.row = newRow;
      item.col = newCol;
      
      if(context.display) {
         if(animate) {
            attr = itemAttributes(item);
            context.raphaelFactory.animate("animItem" + "_" + Math.random(), item.element, attr, infos.actionDelay);
         }
         else {
            attr = itemAttributes(item);
            if(infos.actionDelay > 0) {
               context.delayFactory.createTimeout("moveItem" + "_" + Math.random(), function() {
                  item.element.attr(attr);
               }, infos.actionDelay / 2);
            } else {
               item.element.attr(attr);
            }
         }
      }
   };
   
   context.moveProjectile = function(item) {
      if(!context.isInGrid(item.row + 1, item.col)) {
         context.destroy(item);
      }
      
      if(context.hasOn(item.row + 1, item.col, function(item) { return item.isObstacle === true; } )) {
         context.destroy(item);
         context.dropObject({type: "dispersion"}, {row: item.row + 1, col: item.col});
         return;
      }
      
      if(context.hasOn(item.row + 1, item.col, function(item) { return item.isRobot === true; } )) {
         context.destroy(item);
         context.dropObject({type: "dispersion_robot"}, {row: item.row + 1, col: item.col});
         return;
      }
      
      context.moveItem(item, item.row + 1, item.col);
      return;
   };
   
   context.destroy = function(item) {
      context.setIndexes();
      context.items.splice(item.index, 1);

      if(context.display) {
         item.element.remove();
      }
   };
   
   context.fall = function(item, row, col, callback) {
      var startRow = row;
      var platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
      
      while(context.isInGrid(row + 1, col) && platforms.length == 0) {
         row++;
         platforms = context.getItemsOn(row + 1, col, function(obj) { return obj.isObstacle === true; });
      }
      
      if(!context.isInGrid(row + 1, col)) {
         throw(context.strings.messages.falls);
      }
      
      if(row - startRow > infos.maxFallAltitude) {
         throw(context.strings.messages.willFallAndCrash);
      }
      context.nbMoves++;
      context.moveRobot(row, col, item.dir, callback);
   };
   
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

   // context.goLeft = function(callback) {
   //    // var robot = context.getRobot();
   //    // context.moveRobot(robot.row, robot.col, (robot.dir + 3) % 4, callback);
   //    console.log("goLeft")
   // };
   
   context.shiftCrane = function(dir,callback) {
      var newPos = context.cranePos + dir;
      var ttg = context.tryToGo(newPos);
      if(ttg === true){
         context.moveCrane(newPos, callback);
      }else if(ttg == false){
         context.waitDelay(callback);
      }else{
         context.moveCrane(context.cranePos + dir/4, callback)
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
         var craneAttr = getCraneAttr();
         setCraneAttr(craneAttr);
         // function removeWithdrawable() {
         //    withdrawable.element.remove();
         //    var items = context.getItemsOn(topBlock.row, topBlock.col);
         //    for(var i = 0; i < items.length ; i++) {
         //       redisplayItem(items[i]);
         //    }
         // };

         // if (infos.actionDelay > 0) {
         //    context.delayFactory.createTimeout("takeItem_" + Math.random(), removeWithdrawable, infos.actionDelay);
         // } else {
         //    removeWithdrawable();
         // }
      }
      context.waitDelay(callback);
   };

   context.drop = function(callback) {
      // console.log("drop")
      if(context.craneContent == undefined){
         throw(context.strings.messages.emptyCrane);
      }
      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);
      console.log(topBlock)
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
         var craneAttr = getCraneAttr();
         setCraneAttr(craneAttr);
         redisplayItem(tempItem);
      }
      context.waitDelay(callback);
   };
   
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

   context.findTopBlock = function(col) {
      var itemsInCol = context.findItemsInCol(col);
      if(itemsInCol.length == 0){
         var nbRowsCont = context.nbRowsCont;
         // var nbColCont = context.nbColCont;
         // var nbCol = context.nbCols + nbColCont;
         var nbRows = Math.max(context.nbRows,nbRowsCont);
         // var tileRow = (context.nbRows >= nbRowsCont) ? iRow : iRow - (nbRowsCont - context.nbRows);
         // var contRow = (context.nbRows >= nbRowsCont) ? iRow - (context.nbRows - nbRowsCont) : iRow;

         // if(col < nbColCont){
         //    var contRow = 0;
         //    var row = (context.nbRows >= nbRowsCont) ? contRow + (context.nbRows - nbRowsCont) : contRow;

         // }
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
         if(item.col == col){
            itemsInCol.push(item);
         }
      }
      return itemsInCol
   };
   
   context.obstacleInFront = function() {
      return context.isInFront(function(obj) { return obj.isObstacle === true; });
   };
   
   context.platformInFront = function() {
      var coords = context.coordsInFront();
      return context.hasOn(coords.row + 1, coords.col, function(obj) { return obj.isObstacle === true; });
   };
   
   context.platformAbove = function() {
      var robot = context.getRobot();
      return context.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; });
   };
   
   context.writeNumber = function(row, col, value) {
      var numbers = context.getItemsOn(row, col, function(obj) { return obj.isWritable === true; });
      
      if(numbers.length == 0) {
         throw(strings.messages.failureWriteHere);
      }
      
      var number = numbers[0];
      number.value = value;
      if(context.display) {
         redisplayItem(number);
      }
   };
   
   context.readNumber = function(row, col) {
      var numbers = context.getItemsOn(row, col, function(obj) { return obj.value !== undefined; });
      
      if(numbers.length == 0) {
         throw(strings.messages.failureReadHere);
      }
      
      return parseInt(numbers[0].value);
   };
   
   context.pushObject = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront();
      
      var items = context.getItemsOn(coords.row, coords.col, function(obj) { return obj.isPushable === true ; });
      
      if(items.length == 0) {
         throw(strings.messages.failureNothingToPush);
      }
      
      var coordsAfter = context.coordsInFront(0, 2);
      
      if(!context.isInGrid(coordsAfter.row, coordsAfter.col))
         throw(strings.messages.failureWhilePushing);
      if(context.hasOn(coordsAfter.row, coordsAfter.col, function(obj) { return obj.isObstacle === true; } ))
         throw(strings.messages.failureWhilePushing);
      if(context.tiles[coordsAfter.row][coordsAfter.col] == 0)
         throw(strings.messages.failureWhilePushing);
      
      context.moveItem(items[0], coordsAfter.row, coordsAfter.col);
      
      context.forward(callback);
   };
   
   context.shoot = function(lig, col, dir) {
      dir = dir % 8;
      var dirs = [
         [-1, 0],
         [-1, 1],
         [0, 1],
         [1, 1],
         [1, 0],
         [1, -1],
         [0, -1],
         [-1, -1]
      ];
      
      var lights = context.getItemsOn(lig, col, function(obj) {
         return obj.isLight === true;
      });
      
      for(var light in lights) {
         lights[light].state = 1;
         lights[light].img = lights[light].states[lights[light].state];
         if(context.display)
            redisplayItem(lights[light]);
      }
      
      var x = (infos.cellSide * (col + 0.5) + infos.leftMargin) * scale;
      var y = (infos.cellSide * (lig + 0.5) + infos.topMargin) * scale;
      
      var taille = infos.cellSide;
      
      var findRobot = false;
      
      var plig = lig + dirs[dir][0];
      var pcol = col + dirs[dir][1];
      if(!context.isInGrid(plig, pcol) || context.hasOn(plig, pcol, function(obj) { return obj.isOpaque === true; })) {
         taille /= 2;
         
         findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
      }
      else {
         var pdir = dir;
         var mirrors = context.getItemsOn(plig, pcol, function(obj) { return obj.isMirror === true; });
         if(mirrors.length != 0) {
            pdir = mirrors[0].mirrorFunction(dir);
         }
         
         findRobot = context.hasOn(plig, pcol, function(obj) { return obj.isRobot === true; });
         
         if(context.shoot(plig, pcol, pdir)) {
            findRobot = true;
         }
      }
      
      var dx = (taille * dirs[dir][1]) * scale;
      var dy = (taille * dirs[dir][0]) * scale;
      
      if(context.display && paper != undefined) {
         var segment = paper.path("M " + x + " " + y + " l " + dx + " " + dy);
         
         segment.attr({'stroke-width': 5, 'stroke': '#ffff93'});
         
         context.delayFactory.createTimeout("deleteSegement_" + Math.random(), function() {
            segment.remove();
         }, infos.actionDelay * 2);
      }
      
      return findRobot;
   };
   
   context.connect = function() {
      var robot = context.getRobot();
      
      var plugs = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.plugType !== undefined ; });
      
      if(plugs.length == 0) {
         throw(strings.messages.failureNoPlug);
      }
      
      var wires = context.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWire === true; });
      
      if(wires.length != 0) {
         throw(strings.messages.failureAlreadyWired);
      }
      
      this.dropObject({type: "wire", zOrder: 1});
      
      if(this.last_connect !== undefined) {
         if(this.last_connect.plugType + plugs[0].plugType != 0)
            throw(strings.messages.failureWrongPlugType);
            
         function segmentLength(segment) {
            return Math.sqrt((segment[0][0] - segment[1][0]) * (segment[0][0] - segment[1][0]) + (segment[0][1] - segment[1][1]) * (segment[0][1] - segment[1][1]));
         }
         
         var wire = [[this.last_connect.row, this.last_connect.col],[plugs[0].row, plugs[0].col]];
         
         if(segmentLength(wire) > infos.maxWireLength) {
            throw(strings.messages.failureWireTooLong);
         }
         
         var totalLength = segmentLength(wire);
         for(var iWire = 0;iWire < this.wires.length;iWire++) {
            if(this.isCrossing(wire, this.wires[iWire])) {
               throw(strings.messages.failureWireCrossing);
            }
            totalLength += segmentLength(this.wires[iWire]);
         }
         
         if(totalLength > infos.maxTotalLength) {
            throw(strings.messages.failureTotalLengthExceeded);
         }
         
         this.wires.push(wire);
         
         var x = (this.last_connect.col + 0.5) * infos.cellSide + infos.leftMargin;
         var y = (this.last_connect.row + 0.5) * infos.cellSide + infos.topMargin;
         var dx = (plugs[0].col - this.last_connect.col) * infos.cellSide;
         var dy = (plugs[0].row - this.last_connect.row) * infos.cellSide;
         
         var wire_item = {zOrder: 2};
         wire_item.redisplay = function() {
            wire_item.element = paper.path("M " + (x * scale) + " " + (y * scale) + " l " + (dx * scale) + " " + (dy * scale));
            wire_item.element.attr({'stroke-width': 5, 'stroke': '#dd0000'});
         };
         
         this.multicell_items.push(wire_item);
         // console.log("connect")
         redisplayAllItems();
         
         this.last_connect = undefined;
      }
      else {
         this.last_connect = plugs[0];
      }
   };
      
   return context;
};

var endConditions = {
   dev: function(context, lastTurn) {
      context.success = false;
      throw(window.languageStrings.messages.failure);
   },
   checkReachExit: function(context, lastTurn) {
      var robot = context.getRobot();
      if(context.isOn(function(obj) { return obj.isExit === true; })) {
         context.success = true;
         throw(window.languageStrings.messages.successReachExit);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureReachExit);
      }
   },
   checkPickedAllWithdrawables: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
               solved = false;
            }
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
   },
   checkPlugsWired: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.plugType !== undefined; }) && !context.hasOn(row, col, function(obj) { return obj.isWire === true; })) {
               solved = false;
            }
         }
      }
      
      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successPlugsWired);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failurePlugsWired);
      }
   },
   checkContainersFilled: function(context, lastTurn) {
      var solved = true;
      
      var messages = [
         window.languageStrings.messages.failureContainersFilled,
         window.languageStrings.messages.failureContainersFilledLess,
         window.languageStrings.messages.failureContainersFilledBag
      ];
      var message = 2;
      if (context.infos.maxMoves != undefined) {
         if (context.nbMoves > context.infos.maxMoves) {
            context.success = false;
            throw(window.languageStrings.messages.failureTooManyMoves + " : " + context.nbMoves);
         }
      }
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            var containers = context.getItemsOn(row, col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
            if(containers.length != 0) {
               var container = containers[0];
               if(container.containerSize == undefined && container.containerFilter == undefined) {
                  container.containerSize = 1;
               }
               var filter;
               if(container.containerFilter == undefined)
                  filter = function(obj) { return obj.isWithdrawable === true; };
               else
                  filter = function(obj) { return obj.isWithdrawable === true && container.containerFilter(obj) };
               
               if(container.containerSize != undefined && context.getItemsOn(row, col, filter).length != container.containerSize) {
                  solved = false;
                  message = Math.min(message, 1);
               }
               else if(context.getItemsOn(row, col, filter).length == 0) {
                  solved = false;
                  message = Math.min(message, 0);
               }
               
               if(container.containerFilter != undefined) {
                  if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) })) {
                     solved = false;
                     message = Math.min(message, 0);
                  }
                  for(var item in context.bag) {
                     if(filter(context.bag[item]) && context.infos.ignoreBag === undefined) {
                        solved = false;
                        message = Math.min(message, 2);
                     }
                  }
               }
            }
            else {
               if(context.getItemsOn(row, col, function(obj) { return obj.isWithdrawable === true && obj.canBeOutside !== true; }).length > 0) {
                  solved = false;
                  message = Math.min(message, 0);
               }
            }
         }
      }
      
      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successContainersFilled);
      }
      if(lastTurn) {
         context.success = false;
         throw(messages[message]);
      }
   },
   checkBothReachAndCollect: function(context, lastTurn) {
      var robot = context.getRobot();
      if(context.isOn(function(obj) { return obj.isExit === true; })) {
         var solved = true;
         for(var row = 0;row < context.nbRows;row++) {
            for(var col = 0;col < context.nbCols;col++) {
               if(context.hasOn(row, col, function(obj) { return obj.isWithdrawable === true; })) {
                  solved = false;
                  throw(window.languageStrings.messages.failurePickedAllWithdrawables);
               }
            }
         }
         
         if(solved) {
            context.success = true;
            throw(window.languageStrings.messages.successPickedAllWithdrawables);
         }
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureReachExit);
      }
   },
   checkLights: function(context, lastTurn) {
      var solved = true;
      for(var row = 0;row < context.nbRows;row++) {
         for(var col = 0;col < context.nbCols;col++) {
            if(context.hasOn(row, col, function(obj) { return obj.isLight === true && obj.state === 0; })) {
               solved = false;
            }
         }
      }
      
      if(solved) {
         context.success = true;
         throw(window.languageStrings.messages.successLights);
      }
      if(lastTurn) {
         context.success = false;
         throw(window.languageStrings.messages.failureLights);
      }
   }
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
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
