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
               getNbItems: "getNbItems",
               getNbClusters: "getNbClusters",
               getX: "getX",
               getY: "getY",
               log: "log",
               distance: "distance",
               showCentroid: "showCentroid",
               setCluster: "setCluster"
            },
            description: {
               getX: "@(idItem) retourne l'abscisse du point",
               getY: "@(idItem) retourne l'ordonnée du point",
               log: "@(msg)",
               distance: "@(x1,y1,x2,y2)",
               showCentroid: "@(idCluster,x,y)",
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
               invalidId: "Identifiant invalide"
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
            cardinals: {
               north: "North",
               south: "South",
               west: "West",
               east: "East"
            },
            startingBlockName: "Program of the robot"
         },
         
         es: {
            label: {
               row: "fila del robot",
               col: "columna del robot",
               north: "avanzar hacia arriba",
               south: "avanzar hacia abajo",
               east: "avanzar hacia la derecha",
               west: "avanzar hacia la izquierda",
               left: "girar a la izquierda",
               right: "girar a la derecha",
               turnAround: "dar media vuelta",
               forward: "avanzar",
               backwards: "retroceder",
               jump: "saltar",
               obstacleInFront: "obstáculo adelante",
               obstacleEast: "obstáculo a la derecha",
               obstacleWest: "obstáculo a la izquierda",
               obstacleNorth: "obstáculo arriba",
               obstacleSouth: "obstáculo abajo",
               obstacleRight: "obstáculo a la derecha",
               obstacleLeft: "obstáculo a la izquierda",
               gridEdgeEast: "borde de la cuadrícula a la derecha",
               gridEdgeWest: "borde de la cuadrícula a la izquierda",
               gridEdgeNorth: "borde de la cuadrícula arriba",
               gridEdgeSouth: "borde de la cuadrícula abajo",
               platformInFront: "plataforma adelante",
               platformAbove: "plataforma arriba",
               withdrawObject: "recoger el objeto",
               dropObject: "soltar el objeto",
               onObject: "sobre un objeto",
               onContainer: "sobre un contenedor",
               onNumber: "sobre un número",
               onWritable: "sobre un cuadro",
               onLauncher: "sobre un lanzador láser",
               writeNumber: "escribir el número",
               readNumber: "número en la casilla",
               pushObject: "empujar el objeto",
               pushableInFront: "objeto empujable adelante",
               shoot: "disparar el láser en la dirección %1",
               shoot_noShadow: "disparar el laser en la dirección %1",
               shootCondition: "dirección del tiro de retorno %1",
               shootCondition_noShadow: "dirección del tiro de retorno %1",
               dropPlatformInFront: "construir una plataforma adelante",
               dropPlatformAbove: "construir una plataforma arriba"
            },
            code: {
               row: "filaRobot",
               col: "columnaRobot",
               north: "arriba",
               south: "abajo",
               east: "derecha",
               west: "izquierda",
               left: "girarIzquierda",
               right: "girarDerecha",
               turnAround: "mediaVuelta",
               forward: "avanzar",
               backwards: "retroceder",
               jump: "saltar",
               obstacleInFront: "obstaculoAdelante",
               obstacleRight: "obstaculoDerechaRel",
               obstacleLeft: "obstaculoIzquierdaRel",
               obstacleEast: "obstaculoDerecha",
               obstacleWest: "obstaculoIzquierda",
               obstacleNorth: "obstaculoArriba",
               obstacleSouth: "obstaculoAbajo",
               gridEdgeEast: "bordeCuadriculaDerecha",
               gridEdgeWest: "bordeCuadriculaIzquierda",
               gridEdgeNorth: "bordeCuadriculaArriba",
               gridEdgeSouth: "bordeCuadriculaAbajo",
               platformInFront: "plataformaAdelante",
               platformAbove: "plataformaArriba",
               withdrawObject: "recogerObjeto",
               dropObject: "soltarObjeto",
               onObject: "sobreObjeto",
               onContainer: "sobreContenedor",
               onNumber: "sobreNumero",
               onWritable: "sobreCuadro",
               onLauncher: "sobreLanzador",
               writeNumber: "escribirNumero",
               readNumber: "leerNumero",
               pushObject: "empujarObjeto",
               pushableInFront: "empujableAdelante",
               shoot: "dispararLaser",
               shoot_noShadow: "dispararLaser",
               shootCondition: "condicionDisparo",
               shootCondition_noShadow: "condicionDisparo",
               dropPlatformInFront: "construirPlataformaAdelante",
               dropPlatformAbove: "construirPlataformaArriba"
            },
            messages: {
               leavesGrid: "¡El robot salió de la cuadrícula!",
               obstacle: "¡El robot intenta moverse sobre un obstáculo!",
               nothingToPickUp: "No hay algo para recoger",
               nothingToLookAt: "No hay carta ni contenedor en esta casilla",
               falls: "¡El robot va a caer al vacío!",
               willFallAndCrash: "¡El robot va a caer y chocar!",
               jumpOutsideGrid: "¡El robot intenta saltar fuera de la cuadrícula!",
               jumpObstacleBlocking: "El robot intenta saltar pero hay un obstáculo que lo bloquea",
               jumpNoPlatform: "¡El robot intenta saltar pero no hay una plataforma arriba!",
               tooManyObjects: "¡El robot intenta transportar demasiados objetos al mismo tiempo!",
               emptyBag: "El robot intenta soltar un objeto, ¡pero no carga nada!",
               successReachExit: "Bravo, ¡su robot a llegado a la salida!",
               failureReachExit: "Su robot no ha llegado a la salida.",
               successPickedAllWithdrawables: "Bravo, su robot ha recogido todo!",
               failurePickedAllWithdrawables: "Su robot no ha recogido todo.",
               successContainersFilled: "Bravo, su robot ha llenado todos los contenedores",
               failureContainersFilled: "Hay un objeto fuera de los contenedores",
               failureContainersFilledLess: "Su robot no ha llenado todos los contenedores",
               failureContainersFilledBag: "Su robot no ha puesto todos los objetos",
               failureUnfilteredObject: "Su robot ha recogido un objeto inválido",
               failureTooManyMoves: "Su robot ha realizado demasiados desplazamientos.",
               failureWriteHere: "¡Su robot no puede escribir aquí!",
               failureReadHere: "¡No hay un número aquí!",
               successNumbersWritten: "Bravo, su robot ha escrito los números correctos!",
               failureNumbersWritten: "Su robot no ha escrito los números correctos!",
               failureNothingToPush: "¡No hay un objeto que empujar!",
               failureWhilePushing: "¡El robot no puede empujar este objeto!",
               failureDropObject: "No es posible poner el objeto aquí",
               failureDropPlatform: "No es posible poner el objeto aquí",
               failureDropOutside: "Su robot intenta poner un objeto fuera de la cuadrícula",
               failureNotEnoughPlatform: "No hay suficiente plataforma",
               failureLights: "Aún faltan lugares que iluminar.",
               successLights: "Bravo, ¡su robot ha iluminado todos los lugares!",
               failureLaser: "¡El robot debe encontrarse sobre una terminal láser para poder disparar!"
            },
            cardinals: {
               north: "Norte",
               south: "Sur",
               west: "Oeste",
               east: "Este"
            },
            startingBlockName: "Programa del robot"
         },
         de: {
            label: {
               row: "Zeile des Roboters",
               col: "Spalte des Roboters",
               north: "gehe nach oben",
               south: "gehe nach unten",
               east: "gehe nach rechts",
               west: "gehe nach links",
               left: "drehe nach links",
               right: "drehe nach rechts",
               turnAround: "drehe um",
               forward: "gehe",
               backwards: "gehe rückwärts",
               jump: "springe",
               obstacleInFront: "vor Hindernis",
               obstacleEast: "Hindernis rechts",
               obstacleWest: "Hindernis links",
               obstacleNorth: "Hindernis oben",
               obstacleSouth: "Hindernis unten",
               obstacleRight: "Hindernis rechts",
               obstacleLeft: "Hindernis links",
               gridEdgeAbove: "unter Rand des Gitters",
               gridEdgeBelow: "über Rand des Gitters",
               gridEdgeEast: "links vom Gitterrand",
               gridEdgeWest: "rechts vom Gitterrand",
               platformInFront: "vor Plattform",
               platformAbove: "Plattform darüber",
               withdrawObject: "hebe Objekt auf",
               dropObject: "lege Objekt ab",
               onObject: "auf Objekt",
               onContainer: "auf Kiste",
               onNumber: "auf Zahl",
               onWritable: "auf Tafel",
               onLauncher: "sur un lanceur laser", // TODO :: translate
               writeNumber: "schreibe Zahl",
               readNumber: "Zahl auf dem Feld",
               pushObject: "schiebe Kiste",
               pushableInFront: "vor Kiste",
               shoot: "schieße Laser in Richtung %1",
               shoot_noShadow: "schieße Laser in Richtung %1",
               shootCondition: "Rückkehr von der Schießrichtung %1",
               shootCondition_noShadow: "Rückkehr von der Schießrichtung %1"
            },
            code: {
               row: "ligneRobot",
               col: "colonneRobot",
               north: "haut",
               south: "bas",
               east: "droite",
               west: "gauche",
               left: "tournerGauche",
               right: "tournerDroite",
               turnAround: "demiTour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacleDevant",
               obstacleEast: "obstacleDroite",
               obstacleWest: "obstacleGauche",
               obstacleNorth: "obstacleHaut",
               obstacleSouth: "obstacleBas",
               obstacleRight: "obstacleDroiteRel",
               obstacleLeft: "obstacleGaucheRel",
               gridEdgeEast: "bordGrilleDroite",
               gridEdgeWest: "bordGrilleGauche",
               gridEdgeNorth: "bordGrilleHaut",
               gridEdgeSouth: "bordGrilleBas",
               platformInFront: "plateformeDevant",
               platformAbove: "plateformeDessus",
               withdrawObject: "ramasserObjet",
               dropObject: "deposerObjet",
               onObject: "surObjet",
               onContainer: "surConteneur",
               onNumber: "surNombre",
               onWritable: "surTableau",
               onLauncher: "surLanceur", 
               writeNumber: "ecrireNombre",
               readNumber: "nombreSurCase",
               pushObject: "pousserObjet",
               pushableInFront: "poussableDevant",
               shoot: "tirerLaser",
               shoot_noShadow: "tirerLaser",
               shootCondition: "tirerCondition",
               shootCondition_noShadow: "tirerCondition"
            },
            messages: {
               leavesGrid: "Der Roboter hat das Gitter verlassen!",
               obstacle: "Der Roboter ist gegen ein Hindernis gelaufen!",
               nothingToPickUp: "An dieser Stelle gibt es nichts zum aufheben!",
               nothingToLookAt: "An dieser Stelle gibt es nichts zum betrachten!",
               falls: "Der Roboter fällt in den Abgrund!",
               willFallAndCrash: "Der Roboter würde hier runterfallen und kaputt gehen!",
               jumpOutsideGrid: "Der Roboter versucht, aus dem Gitter zu springen!",
               jumpObstacleBlocking: "Der Roboter kann hier nicht springen, weil ein Hindernis ihn blockiert.",
               jumpNoPlatform: "Der Roboter kann hier nicht springen, weil über ihm keine Plattform ist.",
               tooManyObjects: "Der Roboter kann nicht so viele Objekte auf einmal tragen!",
               emptyBag: "Der Roboter kann nichts ablegen, weil er gar nichts transportiert!",
               successReachExit: "Bravo! Der Roboter hat den Ausgang erreicht.",
               failureReachExit: "Der Roboter hat den Ausgang nicht erreich!",
               successPickedAllWithdrawables: "Bravo! Der Roboter hat alles eingesammelt.",
               failurePickedAllWithdrawables: "Der Roboter hat nicht alles eingesammelt!",
               successContainersFilled: "Gut gemacht! Der Roboter hat alle Behälter gefüllt.",
               failureContainersFilled: "Es befindet sich ein Objekt außerhalb der Behälter.",
               failureContainersFilledLess: "Der Roboter hat nicht alle Behälter gefüllt.",
               failureContainersFilledBag: "Der Roboter hat nicht alle Objekte platziert.",
               failureUnfilteredObject: "Dein Roboter hat ein nicht erlaubtes Objekt aufgehoben!",
               failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
               failureWriteHere: "Der Roboter kann an dieser Stelle nicht schreiben!",
               failureReadHere: "An dieser Stelle steht keine Zahl!",
               successNumbersWritten: "Bravo! Der Roboter hat die richtigen Zahlen geschrieben.",
               failureNumbersWritten: "Dein Roboter hat nicht die richtigen Zahlen geschrieben!",
               failureNothingToPush: "An dieser Stelle gibt es nichts zum Schieben!",
               failureWhilePushing: "Der Roboter hat es nicht geschafft, das Objekt zu schieben!",
               failureDropObject: "An dieser Stelle kann kein Objekt abgelegt werden!",
               failureDropPlatform: "An dieser Stelle kann kein Objekt abgelegt werden!",
               failureDropOutside: "Der Roboter hat versucht ein Objekt vom Gitterrand zu schieben!",
               failureNotEnoughPlatform: "Nicht genügend Plattformen!",
               failureLights: "Der Roboter hat nicht alles beleuchtet!",
               successLights: "Bravo! Der Roboter hat alles beleuchtet.",
               failureLaser: "Der Roboter muss auf einem Laser stehen, um schießen zu können!",
            },
            cardinals: {
               north: "Norden",
               south: "Süden",
               west: "Westen",
               east: "Osten"
            },
            startingBlockName: "Roboter-Programm"
         },
         it: {
            label: {
               row: "ligne du robot",
               col: "colonne du robot",
               wait: "attendre",
               north: "andare avanti",
               south: "avanzare verso il basso",
               east: "avanza a destra",
               west: "avancer vers la gauche",
               left: "tourner à gauche",
               right: "tourner à droite",
               turnAround: "faire demi-tour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacle devant",
               obstacleEast: "obstacle à droite",
               obstacleWest: "obstacle à gauche",
               obstacleNorth: "obstacle en haut",
               obstacleSouth: "obstacle en bas",
               obstacleRight: "obstacle à droite",
               obstacleLeft: "obstacle à gauche",
               gridEdgeEast: "bord de la grille à droite",
               gridEdgeWest: "bord de la grille à gauche",
               gridEdgeNorth: "bord de la grille en haut",
               gridEdgeSouth: "bord de la grille en bas",
               platformInFront: "plateforme devant",
               platformAbove: "plateforme au-dessus",
               withdrawObject: "ramasser l'objet",
               dropObject: "dipingi la scatola",
               onObject: "su un marmo",
               onContainer: "su un buco",
               onNumber: "sur un nombre",
               onWritable: "sur un tableau",
               onLauncher: "sur un lanceur laser",
               writeNumber: "scrivere numero",
               readNumber: "numero sulla casella",
               pushObject: "pousser l'objet",
               pushableInFront: "poussable devant",
               shoot: "tirer au laser dans la direction %1",
               shoot_noShadow: "tirer au laser dans la direction %1",
               shootCondition: "retour départ tir direction %1",
               shootCondition_noShadow: "retour départ tir direction %1",
               connect: "brancher un câble",
               onMale: "sur une prise mâle",
               onFemale: "sur une prise femelle"
            },
            code: {
               row: "ligneRobot",
               col: "colonneRobot",
               wait: "attendre",
               north: "haut",
               south: "bas",
               east: "droite",
               west: "gauche",
               left: "tournerGauche",
               right: "tournerDroite",
               turnAround: "demiTour",
               forward: "avancer",
               backwards: "reculer",
               jump: "sauter",
               obstacleInFront: "obstacleDevant",
               obstacleEast: "obstacleDroite",
               obstacleWest: "obstacleGauche",
               obstacleNorth: "obstacleHaut",
               obstacleSouth: "obstacleBas",
               obstacleRight: "obstacleDroiteRel",
               obstacleLeft: "obstacleGaucheRel",
               gridEdgeEast: "bordGrilleDroite",
               gridEdgeWest: "bordGrilleGauche",
               gridEdgeNorth: "bordGrilleHaut",
               gridEdgeSouth: "bordGrilleBas",
               platformInFront: "plateformeDevant",
               platformAbove: "plateformeDessus",
               withdrawObject: "ramasserObjet",
               dropObject: "deposerObjet",
               onObject: "surObjet",
               onContainer: "surConteneur",
               onNumber: "surNombre",
               onWritable: "surTableau",
               onLauncher: "surLanceur",
               writeNumber: "ecrireNombre",
               readNumber: "nombreSurCase",
               pushObject: "pousserObjet",
               pushableInFront: "poussableDevant",
               shoot: "tirerLaser",
               shoot_noShadow: "tirerLaser",
               shootCondition: "tirerCondition",
               shootCondition_noShadow: "tirerCondition",
               connect: "brancherCable",
               onMale: "surMale",
               onFemale: "surFemelle"
            },
            messages: {
               leavesGrid: "Le robot sort de la grille !",
               obstacle: "Le robot essaie de se déplacer sur un obstacle !",
               nothingToPickUp: "Il n'y a rien à ramasser !",
               nothingToLookAt: "Il n'y a ni carte ni conteneur sur cette case",
               falls: "Le robot va se jeter dans le vide !",
               willFallAndCrash: "Le robot va tomber de haut et s'écraser !",
               jumpOutsideGrid: "Le robot essaie de sauter en dehors de la grille !",
               jumpObstacleBlocking: "Le robot essaie de sauter mais il y a un obstacle qui le bloque",
               jumpNoPlatform: "Le robot essaie de sauter mais il n'y a pas de plateforme au dessus !",
               tooManyObjects: "Le robot essaie de transporter trop d'objets à la fois !",
               emptyBag: "Le robot essaie de déposer un objet alors qu'il n'en transporte pas !",
               successReachExit: "Bravo, votre robot a atteint la sortie !",
               failureReachExit: "Votre robot n'a pas atteint la sortie.",
               successPickedAllWithdrawables: "Bravo, votre robot a tout ramassé !",
               failurePickedAllWithdrawables: "Votre robot n'a pas tout ramassé.",
               successContainersFilled: "Bravo, votre robot a rempli tous les conteneurs",
               failureContainersFilled: "Il y a un objet hors des conteneurs",
               failureContainersFilledLess: "Votre robot n'a pas rempli tous les conteneurs",
               failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
               failureUnfilteredObject: "Votre robot a ramassé un objet invalide",
               failureTooManyMoves: "Votre robot a effectué trop de déplacements.",
               failureWriteHere: "Votre robot ne peut pas écrire ici !",
               failureReadHere: "Il n'y a pas de nombre écrit ici !",
               successNumbersWritten: "Bravo, votre robot a écrit les bons nombres !",
               failureNumbersWritten: "Votre robot n'a pas écrit les bons nombres !",
               failureNothingToPush: "Il n'y a pas d'objet à pousser !",
               failureWhilePushing: "Le robot ne peut pas pousser cet objet !",
               failureDropObject: "On ne peut pas poser d'objet ici",
               failureDropPlatform: "On ne peut pas construire de plateforme ici",
               failureDropOutside: "Votre robot essaie de poser un objet hors de la grille",
               failureNotEnoughPlatform: "Pas assez de plateformes",
               failureLights: "Il reste des spots à allumer.",
               successLights: "Bravo, votre robot a allumé tous les spots !",
               failureLaser: "Le robot doit se trouver sur une borne laser pour pouvoir tirer !",
               failureNoPlug: "Le robot doit se trouver sur une prise pour pouvoir brancher un câble !",
               failureAlreadyWired: "Cette prise est déjà connectée à un câble !",
               failureWrongPlugType: "On ne peut pas connecter ces prises ensemble !",
               successPlugsWired: "La machine est réparée !",
               failurePlugsWired: "La machine ne fonctionne pas car des prises n'ont pas été connectées !",
               failureWireCrossing: "Impossible de relier ces deux prises, deux câbles vont s'intersecter !",
               failureWireTooLong: "Impossible de relier ces deux prises car elles sont trop éloignées !",
               failureTotalLengthExceeded: "Vous n'avez pas assez de longueur de câble pour relier ces deux prises !",
               failureProjectile: "Le robot s'est pris un projectile !",
               failureRewrite: "Le robot a essayé de repeindre une case."
            },
            cardinals: {
               north: "Nord",
               south: "Sud",
               west: "Ovest",
               east: "Est"
            },
            startingBlockName: "Programme du robot"
         },
      },
      arrows: {
         fr: {
            messages: {
               obstacle: "Le robot va sortir du parcours fléché !",
               successReachExit: "Bravo, votre robot a récupéré le coffre !",
               failureReachExit: "Votre robot s'est perdu en chemin."
            }
         },
         en: {
            messages: {
               obstacle: "The robot will get out of the marked track!",
               successReachExit: "Congratulations, your robot collected the safe!",
               failureReachExit: "Yout robot got lost."
            }
         },

         es: {
            messages: {
               obstacle: "¡El robot va a salirse del camino marcado!",
               successReachExit: "Bravo, ¡su robot ha recuperado el cofre!",
               failureReachExit: "Su robot se perdió en el camino."
            }
         }  
      },
      cards: {
         fr: {
            label: {
               withdrawObject: "ramasser la carte",
               dropObject: "déposer la carte",
               onObject: "sur une carte",
               onContainer: "sur un emplacement de dépôt",
            },
             messages: {
               successContainersFilled: "Bravo, votre robot a rangé les cartes au bon endroit !",
               failureContainersFilled: "Il y a des cartes mal rangées",
               failureContainersFilledLess: "Il y a encore des cartes à ranger.",
               failureContainersFilledBag: "Votre robot doit déposer sa carte."
            }
         },
         en: {
            label: {
               withdrawObject: "pick up the card",
               dropObject: "drop the card",
               onObject: "on a card",
               onContainer: "on a placeholder",
            },
             messages: {
               successContainersFilled: "Congratulations, your robot placed all the cards at the right location!",
               failureContainersFilled: "Some cards are misplaced",
               failureContainersFilledLess: "There are still misplaced cards.",
               failureContainersFilledBag: "Your robot must drop its card."
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la carta",
               dropObject: "soltar la carta",
               onObject: "sobre una carta",
               onContainer: "en un sitio de depósito",
            },
             messages: {
               successContainersFilled: "Bravo, su robot ha ordenado las cartas en un buen lugar!",
               failureContainersFilled: "Hay cartas ordenadas incorrectamente.",
               failureContainersFilledLess: "Aún quedan cartas sin ordenar.",
               failureContainersFilledBag: "Su robot debe depositar su carta."
            }
         }
      },
      castle: {
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
               successContainersFilled: "Bravo, le château est bien chauffé !",
               failureContainersFilled: "Votre robot n'a pas mis du bois dans toutes les cheminées.",
               failureContainersFilledLess: "Votre robot n'a pas mis du bois dans toutes les cheminées..",
               failureContainersFilledBag: "Votre robot doit déposer le bois dans la cheminée.",
               failureDropOutside: "Votre robot essaie de construire une plateforme hors de la grille.",
               failureDropObject: "Il y a déjà du bois dans cette cheminée.",
               failureDropPlatform: "Il y a déjà une plateforme ici !",
               emptyBag: "Le robot essaie de déposer du bois alors qu'il n'en transporte pas !"
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
      },
      chticode_abs: {
         fr: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, votre robot a réussi la mission !",
               failureReachExit: "Votre robot n'a pas atteint la case verte."
            }
         },
         en: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Congratulations, your robot succeeded this mission!",
               failureReachExit: "Your robot didn't reach the green cell."
            }
         },

         es: {
            label: {
               
            },
             messages: {
               successPickedAllWithdrawables: "Bravo, ¡su robot ha completado la misión!",
               failureReachExit: "Su robot no llegó a la casilla verde."
            }
         }
      },
      chticode_rel: {
         fr: {
            label: {
               
            },
             messages: {
               successReachExit: "Bravo, votre robot a atteint la case verte !",
               failureReachExit: "Votre robot n'a pas atteint la case verte."
            }
         },
         en: {
            label: {
               
            },
             messages: {
               successReachExit: "Congratulations, your robot reached the green cells!",
               failureReachExit: "Your robot didn't reach the green cell."
            }
         },

         es: {
            label: {
               
            },
             messages: {
               successReachExit: "Bravo, ¡su robot llegó a la casilla verde!",
               failureReachExit: "Su robot no ha llegado a la casilla verde."
            }
         }
      },
      cones: {
         fr: {
            label: {
               dropObject: "déposer un plot",
               onContainer: "sur une case marquée",
               obstacleInFront: "plot devant"
            },
            code: {
               dropObject: "deposerPlot",
               onContainer: "surCaseMarquee",
               obstacleInFront: "plotDevant"
            },
            messages: {
               successContainersFilled: "Bravo, votre robot a déposé des plots sur les bonnes cases !",
               failureContainersFilled: "Il manque des plots ou ils ne sont pas au bon endroit."
            }
         },

         en: {
            label: {
               dropObject: "drop a cone",
               onContainer: "on a marked cell",
               obstacleInFront: "cone ahead"
            },
            code: {
               dropObject: "dropCone",
               onContainer: "onMarkedCell",
               obstacleInFront: "coneAhead"
            },
            messages: {
               successContainersFilled: "Congratulations, your robot dropped cones on the marked cells!",
               failureContainersFilled: "Some cones are missing or are misplaced."
            }
         },

         es: {
            label: {
               dropObject: "soltar un cono",
               onContainer: "sobre una casilla marcada",
               obstacleInFront: "cono adelante"
            },
            code: {
               dropObject: "soltarCono",
               onContainer: "sobreCasillaMarcada",
               obstacleInFront: "conoAdelante"
            },
            messages: {
               successContainersFilled: "Bravo, ¡Su robot ha puesto los conos en las casillas correctas!",
               failureContainersFilled: "Aún hay conos en lugares incorrectos."
            }
         }
      },   
      flowers: {
         fr: {
            label: {
               dropObject: "semer une graine",
               onContainer: "terre sur la case",
               obstacleInFront: "fleur devant"
            },
            code: {
               dropObject: "semerGraine",
               onContainer: "terreSurCase",
               obstacleInFront: "fleurDevant"
            },
            description: {
               dropObject: "semerGraine() sème une graine sur la case du robot",
               onContainer: "terreSurCase() indique s'il y a de la terre sur la case du robot",
               obstacleInFront: "fleurDevant() indique s'il y a une fleur sur la case devant le robot"
            },
            messages: {
               successContainersFilled: "Bravo, votre robot est un bon jardinier !",
               failureContainersFilled: "Votre robot a semé hors des zones de terre.",
               failureContainersFilledLess: "Il reste de la terre vide de fleur !",
               failureDropObject: "Il y a déjà une fleur ici !",
					obstacle: "Attention à la fleur !",
            }
         },
         en: {
            label: {
               dropObject: "plant a seed",
               onContainer: "soil on the cell",
               obstacleInFront: "flower ahead"
            },
            code: {
               dropObject: "plantSeed",
               onContainer: "soilOnCell",
               obstacleInFront: "flowerAhead"
            },
            messages: {
               successContainersFilled: "Congratulations, your robot is a good gardener!",
               failureContainersFilled: "Your robot dropped seeds where there is no soil.",
               failureContainersFilledLess: "Some soil spots don't have any flower!",
               failureDropObject: "There is already a flower here !",
					obstacle: "Be careful, there's a flower!",
            }
         },

         es: {
            label: {
               dropObject: "sembrar una semilla",
               onContainer: "tierra en la casilla",
               obstacleInFront: "flor adelante"
            },
            code: {
               dropObject: "sembrarSemilla",
               onContainer: "tierraEnCasilla",
               obstacleInFront: "florAdelante"
            },
            messages: {
               successContainersFilled: "Bravo, ¡el robot es un gran jardinero!",
               failureContainersFilled: "El robot ha sembrado fuera de las casillas con tierra",
               failureDropObject: "Ya hay una flor aqui !",
               failureContainersFilledLess: "¡Aún hay tierra sin flores!"
            }
         }
      },   
      course: {
         fr: {
            messages: {
               successReachExit: "Bravo, le robot a atteint la case verte !",
               failureReachExit: "Le robot n'est pas arrivé sur la case verte.",
               obstacle: "Le robot tente de foncer dans un mur !"
            }
         },
         en: {
            messages: {
               successReachExit: "Congratulations, the robot reached the green cell!",
               failureReachExit: "The robot didn't reach the green cell.",
               obstacle: "The robot is attemting to run into a wall!"
            }
         },

         es: {
            messages: {
               successReachExit: "Bravo, ¡El robot llegó a la casilla verde!",
               failureReachExit: "El robot no llegó a la casilla verde.",
               obstacle: "¡El robot intenta traspasar un muro!"
            }
         }
      },
      dominoes: {
         fr: {
            label: {
               withdrawObject: "ramasser le domino",
            },
            code: {
               withdrawObject: "ramasserDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, le robot a ramassé tous les dominos demandés !",
               "failurePickedAllWithdrawables": "Le robot n'a pas ramassé les dominos demandés."
            }
         },
         en: {
            label: {
               withdrawObject: "pick the domino",
            },
            code: {
               withdrawObject: "pickDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Congratulations, the robot picked all the requested dominoes!",
               "failurePickedAllWithdrawables": "The robot didn't pick up the requested dominoes!"
            }
         },
         es: {
            label: {
               withdrawObject: "recoger el dominó",
            },
            code: {
               withdrawObject: "recogerDomino"
            },
            messages: {
               "successPickedAllWithdrawables": "Bravo, ¡el robot recogió todos los dominó requeridos!",
               "failurePickedAllWithdrawables": "El robot no recogió todos los dominó requeridos."
            }
         }
      },
      fishing: {
         fr: {
            label: {
               withdrawObject: "prendre les poissons",
               dropObject: "déposer les poissons",
               withdrawNum_noShadow: "prendre %1 poissons",
               dropNum_noShadow: "déposer %1 poissons",
               nbWithdrawables: "nombre de poissons sur la case",
               containerSize: "nombre de poissons commandés",
               onObject: "poissons sur la case",
               onContainer: "sur une île",
            },
            code: {
               withdrawObject: "prendrePoissons",
               dropObject: "deposerPoissons",
               onObject: "surPoissons",
               onContainer: "surIle",
               nbWithdrawables: "nbPoissonsSur",
               containerSize: "nbPoissonsCommandes",
               withdrawNum: "prendre",
            },
            description: {
               withdrawObject: "prendrePoissons() prend les poissons qui se trouvent sur la case",
               dropObject: "deposerPoissons() dépose sur la case les poissons transportés",
               onObject: "surPoissons() indique s'il y a un ou des poissons sur la case",
               onContainer: "surIle() indique s'il y a une île sur la case",
               nbWithdrawables: "nbPoissonsSur() indique combien de poissons sont sur la case",
               containerSize: "nbPoissonsCommandes() indique il faut livrer de poissons sur l'île",
               dropNum: "deposer(nbPoissons) dépose nbPoissons poissons sur la case",
               withdrawNum: "prendre(nbPoissons) prend nbPoissons poissons sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de poisson !",

               tooManyObjects: "Le robot porte déjà un poisson !",
               successContainersFilled: "Bravo, votre robot a apporté du poisson sur toutes les îles !",
               failureContainersFilled: "Votre robot a remis du poisson à l'eau !",
               failureContainersFilledLess: "Il reste encore au moins un poisson à apporter sur une île.",
               failureContainersFilledBag: "Il faut apporter les poissons sur une île !",
               failureDropObject: "Cette île a déjà reçu assez de poissons.",
               nothingToPickUp: "Pas de poisson ici !",
               failureContainersFilledBag: "Votre robot a pris trop de poissons.",
               failureDropObject: "Votre robot essaie de déposer trop de poissons sur cette île."
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         }
      },
      
      marbles: {
         fr: {
            label: {
               withdrawObject: "ramasser la bille",
               dropObject: "déposer la bille",
               onObject: "sur une bille",
               onContainer: "sur un trou",
            },
            code: {
               withdrawObject: "ramasserBille",
               dropObject: "deposerBille",
               onObject: "surBille",
               onContainer: "surTrou",
            },   
            description: {
               withdrawObject: "ramasserBille() ramasse la bille de la case du robot",
               dropObject: "deposerBille() dépose la bille transportée sur la case du robot",
               onObject: "surBille() indique une bille est sur la case du robot",
               onContainer: "surTrou() indique s'il y a un trou sur la case du robot",
            },   
            messages: {
               emptyBag: "Le robot ne porte pas de bille !",
               tooManyObjects: "Le robot porte déjà une bille !",
               successContainersFilled: "Bravo, vous avez rangé les billes !",
               failureContainersFilled: "Les billes ne sont pas toutes bien rangées.",
               failureContainersFilledLess: "Il reste une bille à ranger.",
               failureContainersFilledBag: "Il faut déposer la bille dans le trou !",
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         }
      },
      objects_in_space: {
         fr: {
            label: {
               obstacleInFront: "astéroïde devant"
            },
            code: {
               obstacleInFront: "asteroideDevant"
            },
            messages: {
               obstacle: "Attention à l'astéroïde !"
            }
         },

         es: {
            label: {
               obstacleInFront: "asteroide adelante"
            },
            code: {
               obstacleInFront: "asteroideAdelante"
            },
            messages: {
               obstacle: "¡Cuidado con el asteroide!"
            }
         }
      },
      packages: {
         fr: {
            label: {
               withdrawObject: "ramasser le livre",
               dropObject: "déposer le livre",
               withdrawNum_noShadow: "ramasser %1 livres",
               dropNum_noShadow: "déposer %1 livres",
               nbWithdrawables: "nombre de livres sur la case",
               containerSize: "nombre de livres commandés",
               onObject: "livres sur la case",
               onContainer: "sur un carton",
            },
            code: {
               withdrawObject: "ramasserLivre",
               dropObject: "deposerLivre",
               onObject: "surLivres",
               onContainer: "surCarton",
               nbWithdrawables: "nbLivresSur",
               containerSize: "nbLivresCommandes",
            },
            description: {
               withdrawObject: "ramasserLivre() ramasse le livre qui se trouve sur la case",
               dropObject: "deposerLivre() dépose sur la case le livre transporté",
               onObject: "surLivres() indique s'il y a un ou des livres sur la case",
               onContainer: "surCarton() indique s'il y a un carton sur la case",
               nbWithdrawables: "nbLivresSur() indique combien de livres sont sur la case",
               containerSize: "nbLivresCommandes() indique combien de livres sont commandés pour ce carton",
               dropNum: "deposer(nbLivres) dépose nLivres livres sur la case",
               withdrawNum: "ramasser(nbLivres) ramasse nbLivres livres sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de livre !",
               tooManyObjects: "Le robot porte déjà un livre !",
               successContainersFilled: "Bravo, tous les cartons sont pleins. Les colis vont pouvoir être livrés !",
               failureContainersFilled: "Tous les livres n'ont pas été mis en carton.",
               failureContainersFilledLess: "Il y a au moins un carton qui n'est pas plein.",
               failureContainersFilledBag: "Votre robot a ramassé trop de livres.",
               failureDropObject: "Ce colis est déjà plein. Votre robot essaie de déposer trop de livres.",
               nothingToPickUp: "Il n'y a plus de livre ici !"
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
            }
         }
      },
      paint: {
         fr: {
             label: {
               dropObject: "peindre la case",
               onContainer: "sur une case marquée",
               readNumber: "nombre de la case",
             },
             code: {
                dropObject: "peindreCase",
                onContainer: "surCaseMarquee",
                readNumber: "nombreSurCase",
             },
             messages: {
               successContainersFilled: "Bravo, votre robot a peint le motif !",
               failureContainersFilled: "Votre robot n'a pas peint les bonnes cases.",
               failureContainersFilledLess: "Votre robot n'a pas peint toutes les cases marquées.",
               failureContainersFilledBag: "Votre robot n'a pas posé tous les objets",
             }
         },

         es: {
             label: {
               dropObject: "pintar la casilla",
               onContainer: "sobre una casilla marcada",
               readNumber: "número en la casilla",
             },
             code: {
                dropObject: "pintarCasilla",
                onContainer: "sobreCasillaMarcada",
                readNumber: "númeroEnCasilla",
             },
             messages: {
               successContainersFilled: "Bravo, ¡su robot ha pintado el patrón!",
               failureContainersFilled: "El robot no pintó las casillas correctas.",
               failureContainersFilledLess: "Su robot no ha pintado todas las casillas marcadas.",
               failureContainersFilledBag: "Su robot no ha puesto todos los objetos",
             }
         }  
      },
      pixelArt: {
         fr: {
            messages: {
               successContainersFilled: "Bravo, votre dessin est identique au modèle. Quel artiste !",
               failureContainersFilled: "Regardez bien le modèle, votre dessin n'est pas identique.",
				   failureContainersFilledLess: "Le dessin n'est pas fini !",
				   failureDropObject: "Le robot n'a pas peint la case de la bonne couleur.",
            }
         }
      },
      rocket: {
         fr: {
            label: {
               obstacleRight: "asteroïde à droite",
               obstacleInFront: "asteroïde devant",
            },
            messages: {
               successReachExit: "Bravo, le robot a rejoint la fusée !",
               failureReachExit: "Le robot est perdu dans l'espace. Recommencez pour l'aider à rejoindre la fusée.",
               obstacle: "Attention à l'astéroïde !"
            }
         },

         es: {
            label: {
               obstacleRight: "asteroide a la derecha",
               obstacleInFront: "asteroide adelante",
            },
            messages: {
               successReachExit: "Bravo, ¡el robot llegó al cohete!",
               failureReachExit: "El robot está perdido en el espacio. Vuelva a comenzar para ayudarle a llegar al cohete.",
               obstacle: "¡Cuidado con el asteroide!"
            }
         }
      },
      sokoban: {
         fr: {
            label: {
               pushObject: "pousser la caisse",
               onContainer: "sur une case marquée",
               pushableInFront: "caisse devant",
               obstacleInFront: "obstacle devant",
               readNumber: "nombre de la case"
            },
            code: {
               pushObject: "pousserCaisse",
               onContainer: "surCaseMarquee",
               pushableInFront: "caisseDevant",
               obstacleInFront: "obstacleDevant",
               readNumber: "nombreSurCase"
            },
            description: {
               onContainer: "surCaseMarquee() indique si le robot se trouve sur une case marquée",
               pushableInFront: "caisseDevant() indique si le robot est juste devant une caisse",
               pushObject: "pousserCaisse() avance le robot en poussant la caisse qui est devant",               
            },
            messages: {
               successContainersFilled: "Bravo, les caisses sont bien rangées !",
               failureContainersFilled: "Il y a encore des caisses qui ne sont pas à leur place.",
               failureNothingToPush: "Il n'y a pas de caisse à pousser ici !",
               failureWhilePushing: "Le robot ne peut pas pousser ici !",
               obstacle: "Le robot essaie de foncer dans un mur ou dans une caisse !"
            }
         },

         en: {
            label: {
               pushObject: "push the box",
               onContainer: "on a marked cell",
               pushableInFront: "in front of a box",
               obstacleInFront: "in front of an obstacle",
               readNumber: "number on the cell"
            },
            code: {
               pushObject: "pushBox",
               onContainer: "onMarkedCell",
               pushableInFront: "boxAhead",
               obstacleInFront: "obstacleAhead",
               readNumber: "numberOnCell"
            },   
            messages: {
               successContainersFilled: "Congratulations, the boxes are correctly placed!",
               failureContainersFilled: "There are still boxes that are not places correctly.",
               failureNothingToPush: "There is no box to push here!",
               failureWhilePushing: "The robot can't push here!",
               obstacle: "The robot is trying to move into a wall or a box!"
            }
         },

         es: {
            label: {
               pushObject: "empujar la caja",
               onContainer: "sobre una casilla marcada",
               pushableInFront: "caja adelante",
               obstacleInFront: "obstáculo adelante",
               readNumber: "número en la casilla"
            },
            code: {
               pushObject: "empujarCaja",
               onContainer: "sobreCasillaMarcada",
               pushableInFront: "cajaAdelante",
               obstacleInFront: "obstáculoAdelante",
               readNumber: "númeroEnCasilla"
            },   
            messages: {
               successContainersFilled: "Bravo, ¡las cajas están bien ordenadas!",
               failureContainersFilled: "Aún hay cajas que no están en su lugar.",
               failureNothingToPush: "¡Aquí no hay caja para empujar!",
               failureWhilePushing: "¡El robot no puede empujar aquí!",
               obstacle: "El robot intenta traspasar un muro o una caja!"
            }
         }
      },
      veterinary: {
         fr: {
            label: {
               withdrawObject: "ramasser le bois",
               dropObject: "donner le bois au castor",
               withdrawNum_noShadow: "ramasser %1 bûches",
               dropNum_noShadow: "donner %1 bûches",
               nbWithdrawables: "nombre de bûches sur la case",
               containerSize: "nombre de bûches demandé",
               onObject: "sur du bois",
               onContainer: "chez un castor",
            },
            code: {
               withdrawObject: "ramasserBois",
               dropObject: "donnerBois",
               onObject: "surBois",
               onContainer: "chezCastor",
               nbWithdrawables: "nbBuchesSur",
               containerSize: "nbBuchesADeposer",
            },
            description: {
               withdrawObject: "ramasserBois() ramasse le bois qui se trouve sur la case",
               dropObject: "donnerBois() dépose sur la case le bois transporté",
               onObject: "surBois() indique s'il y a du bois sur la case",
               onContainer: "chezCastor() indique s'il y a un castor sur la case",
               nbWithdrawables: "nbBuchesSur() indique combien de bûches sont sur la case",
               containerSize: "nbBuchesADeposer() indique combien de bûches sont demandées sur la case",
               dropNum: "deposer(nbBuches) dépose nbBuches bûches sur la case",
               withdrawNum: "ramasser(nbBuches) ramasse nbBuches bûches sur la case",
            },
            messages: {
               emptyBag: "Le robot ne porte pas de bois !",
               tooManyObjects: "Le robot porte déjà du bois !",
               successContainersFilled: "Bravo, tous les castors ont du bois. Ils remercient votre robot !",
               failureContainersFilled: "Tout le bois n'a pas été distribué.",
               failureContainersFilledLess: "Il reste du bois à distribuer.",
               failureContainersFilledBag: "Il faut donner le bois au castor !",
               failureDropObject: "Ce castor a déjà du bois.",
            }
         },

         es: {
            label: {
               withdrawObject: "recoger la bola",
               dropObject: "soltar la bola",
               onObject: "sobre una bola",
               onContainer: "sobre un agujero",
            },
            code: {
               withdrawObject: "recogerBola",
               dropObject: "soltarBola",
               onObject: "sobreBola",
               onContainer: "sobreAgujero",
            },   
            messages: {
               emptyBag: "¡El robot no carga ninguna bola!",
               tooManyObjects: "¡El robot ya está cargando una bola!",
               successContainersFilled: "Bravo, ¡el robot ordenó las bolas!",
               failureContainersFilled: "Hay bolas en lugares incorrectos.",
               failureContainersFilledLess: "Aún falta colocar una bola.",
               failureContainersFilledBag: "¡Debe colocar la bola en un agujero!",
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
   
   // infos.newBlocks.push({
   //    name: "left",
   //    type: "actions",
   //    block: { name: "left" },
   //    func: function(callback) {
   //       this.turnLeft(callback);
   //    }
   // });

   // infos.newBlocks.push({
   //    name: "right",
   //    type: "actions",
   //    block: { name: "right" },
   //    func: function(callback) {
   //       this.turnRight(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "turnAround",
   //    type: "actions",
   //    block: { name: "turnAround" },
   //    func: function(callback) {
   //       this.turnAround(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "forward",
   //    type: "actions",
   //    block: { name: "forward" },
   //    func: function(callback) {
   //       this.forward(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "backwards",
   //    type: "actions",
   //    block: { name: "backwards" },
   //    func: function(callback) {
   //       this.backwards(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "jump",
   //    type: "actions",
   //    block: { name: "jump" },
   //    func: function(callback) {
   //       this.jump(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleInFront",
   //    type: "sensors",
   //    block: { name: "obstacleInFront", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.obstacleInFront());
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleEast",
   //    type: "sensors",
   //    block: { name: "obstacleEast", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.hasOn(robot.row, robot.col + 1, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleWest",
   //    type: "sensors",
   //    block: { name: "obstacleWest", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.hasOn(robot.row, robot.col - 1, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleNorth",
   //    type: "sensors",
   //    block: { name: "obstacleNorth", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.hasOn(robot.row - 1, robot.col, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleSouth",
   //    type: "sensors",
   //    block: { name: "obstacleSouth", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.hasOn(robot.row + 1, robot.col, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleRight",
   //    type: "sensors",
   //    block: { name: "obstacleRight", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       var coords = this.coordsInFront(1);
   //       this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "obstacleLeft",
   //    type: "sensors",
   //    block: { name: "obstacleLeft", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       var coords = this.coordsInFront(3);
   //       this.callCallback(callback, this.hasOn(coords.row, coords.col, function(obj) { return obj.isObstacle === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "gridEdgeEast",
   //    type: "sensors",
   //    block: { name: "gridEdgeEast", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, !this.isInGrid(robot.row, robot.col + 1));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "gridEdgeWest",
   //    type: "sensors",
   //    block: { name: "gridEdgeWest", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, !this.isInGrid(robot.row, robot.col - 1));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "gridEdgeNorth",
   //    type: "sensors",
   //    block: { name: "gridEdgeNorth", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, !this.isInGrid(robot.row - 1, robot.col));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "gridEdgeSouth",
   //    type: "sensors",
   //    block: { name: "gridEdgeSouth", yieldsValue: true },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, !this.isInGrid(robot.row + 1, robot.col));
   //    }
   // });
      
   // infos.newBlocks.push({
   //    name: "platformInFront",
   //    type: "sensors",
   //    block: { name: "platformInFront", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.platformInFront());
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "platformAbove",
   //    type: "sensors",
   //    block: { name: "platformAbove", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.platformAbove());
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "withdrawObject",
   //    type: "actions",
   //    block: { name: "withdrawObject" },
   //    func: function(callback) {
   //       this.withdraw();
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropObject",
   //    type: "actions",
   //    block: { name: "dropObject" },
   //    func: function(callback) {
   //       this.drop();
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onObject",
   //    type: "sensors",
   //    block: { name: "onObject", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.isWithdrawable === true;}));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onContainer",
   //    type: "sensors",
   //    block: { name: "onContainer", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.isContainer === true;}));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onNumber",
   //    type: "sensors",
   //    block: { name: "onNumber", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.value !== undefined;}));
   //    }
   // });
	
	// infos.newBlocks.push({
   //    name: "onLauncher",
   //    type: "sensors",
   //    block: { name: "onLauncher", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.isLaser === true;}));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onWritable",
   //    type: "sensors",
   //    block: { name: "onWritable", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.isWritable === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "writeNumber",
   //    type: "actions",
   //    block: { name: "writeNumber", params: [null] },
   //    func: function(value, callback) {
   //       var robot = this.getRobot();
   //       this.writeNumber(robot.row, robot.col, value);
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "readNumber",
   //    type: "sensors",
   //    block: { name: "readNumber", yieldsValue: 'int' },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.readNumber(robot.row, robot.col));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "nbWithdrawables",
   //    type: "sensors",
   //    block: { name: "nbWithdrawables", yieldsValue: 'int' },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isWithdrawable === true; }).length);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "nbInBag",
   //    type: "sensors",
   //    block: { name: "nbInBag", yieldsValue: 'int' },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       this.callCallback(callback, context.bag.length);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "containerSize",
   //    type: "sensors",
   //    block: { name: "containerSize", yieldsValue: 'int' },
   //    func: function(callback) {
   //       var robot = this.getRobot();
   //       var containers = this.getItemsOn(robot.row, robot.col, function(obj) { return obj.isContainer === true; });
         
   //       if(containers.length == 0) {
   //          this.callCallback(callback, 0);
   //          return;
   //       }
         
   //       this.callCallback(callback, containers[0].containerSize);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "pushObject",
   //    type: "actions",
   //    block: { name: "pushObject" },
   //    func: function(callback) {
   //       this.pushObject(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "pushableInFront",
   //    type: "sensors",
   //    block: { name: "pushableInFront", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isInFront(function(obj) { return obj.isPushable === true; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropInFront",
   //    type: "actions",
   //    block: { name: "dropInFront" },
   //    func: function(callback) {
   //       this.drop(1, this.coordsInFront());
   //       this.callCallback(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropAbove",
   //    type: "actions",
   //    block: { name: "dropAbove" },
   //    func: function(callback) {
   //       this.drop(1, {row: this.getRobot().row - 1, col: this.getRobot().col});
   //       this.callCallback(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "withdrawNum_noShadow",
   //    type: "actions",
   //    block: { 
   //       name: "withdrawNum_noShadow", 
   //       params: [null]
   //    },
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       for(var i = 0;i < value;i++) {
   //          this.withdraw();
   //       }
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "withdrawNum",
   //    type: "actions",
   //    block: { name: "withdrawNum", params: [null], blocklyXml: "<block type='withdrawNum_noShadow'>" +
   //                            "  <value name='PARAM_0'>" +
   //                            "    <shadow type='math_number'>" +
   //                            "      <field name='NUM'>0</field>" +
   //                            "    </shadow>" +
   //                            "  </value>" +
   //                            "</block>"},
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       for(var i = 0;i < value;i++) {
   //          this.withdraw();
   //       }
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropNum_noShadow",
   //    type: "actions",
   //    block: { 
   //       name: "dropNum_noShadow", 
   //       params: [null]
   //    },
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       this.drop(value);
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropNum",
   //    type: "actions",
   //    block: { name: "dropNum", params: [null], blocklyXml: "<block type='dropNum_noShadow'>" +
   //                            "  <value name='PARAM_0'>" +
   //                            "    <shadow type='math_number'>" +
   //                            "      <field name='NUM'>0</field>" +
   //                            "    </shadow>" +
   //                            "  </value>" +
   //                            "</block>"},
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       this.drop(value);
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "shoot_noShadow",
   //    type: "actions",
   //    block: { 
   //       name: "shoot_noShadow", 
   //       params: [null]
   //    },
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       if(this.isOn(function(obj) { return obj.isLaser === true; })) {
   //          this.shoot(this.getRobot().row, this.getRobot().col, value);
   //          if(this.display) {
   //             var robot = this.getRobot();
   //             var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
   //                return obj.isLaser === true;
   //             });
               
   //             if(lasers.length != 0) {
   //                lasers[0].element.toFront();
   //             }
               
   //             robot.element.toFront();
   //          }
   //       }
   //       else {
   //          throw(window.languageStrings.messages.failureLaser);
   //       }
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "shoot",
   //    type: "actions",
   //    block: { name: "shoot", params: [null], blocklyXml: "<block type='shoot_noShadow'>" +
   //                            "  <value name='PARAM_0'>" +
   //                            "    <shadow type='math_number'>" +
   //                            "      <field name='NUM'>0</field>" +
   //                            "    </shadow>" +
   //                            "  </value>" +
   //                            "</block>"},
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
   //       if(this.isOn(function(obj) { return obj.isLaser === true; })) {
   //          this.shoot(this.getRobot().row, this.getRobot().col, value);
   //          if(this.display) {
   //             var robot = this.getRobot();
   //             var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
   //                return obj.isLaser === true;
   //             });
               
   //             if(lasers.length != 0) {
   //                lasers[0].element.toFront();
   //             }
               
   //             robot.element.toFront();
   //          }
   //       }
   //       else {
   //          throw(window.languageStrings.messages.failureLaser);
   //       }
   //       this.waitDelay(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "shootCondition_noShadow",
   //    type: "actions",
   //    block: { 
   //       name: "shootCondition_noShadow", 
   //       params: [null],
   //       yieldsValue: true
   //    },
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
         
   //       if(this.isOn(function(obj) { return obj.isLaser === true; })) {
   //          var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
   //          if(this.display) {
   //             var robot = this.getRobot();
   //             var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
   //                return obj.isLaser === true;
   //             });
               
   //             if(lasers.length != 0) {
   //                lasers[0].element.toFront();
   //             }
               
   //             robot.element.toFront();
   //          }
   //          this.waitDelay(callback, retour);
   //       }
   //       else {
   //          throw(window.languageStrings.messages.failureLaser);
   //          this.callCallback(callback);
   //       }
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "shootCondition",
   //    type: "actions",
   //    block: { name: "shootCondition", blocklyXml: "<block type='shootCondition_noShadow'>" +
   //                            "  <value name='PARAM_0'>" +
   //                            "    <shadow type='math_number'>" +
   //                            "      <field name='NUM'>0</field>" +
   //                            "    </shadow>" +
   //                            "  </value>" +
   //                            "</block>"},
   //    func: function(value, callback) {
   //       if((typeof value) == "function") {
   //          this.callCallback(value);
   //          return;
   //       }
         
   //       if(this.isOn(function(obj) { return obj.isLaser === true; })) {
   //          var retour = this.shoot(this.getRobot().row, this.getRobot().col, value);
   //          if(this.display) {
   //             var robot = this.getRobot();
   //             var lasers = context.getItemsOn(robot.row, robot.col, function(obj) {
   //                return obj.isLaser === true;
   //             });
               
   //             if(lasers.length != 0) {
   //                lasers[0].element.toFront();
   //             }
               
   //             robot.element.toFront();
   //          }
   //          this.waitDelay(callback, retour);
   //       }
   //       else {
   //          throw(window.languageStrings.messages.failureLaser);
   //          this.callCallback(callback);
   //       }
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "connect",
   //    type: "actions",
   //    block: { name: "connect" },
   //    func: function(callback) {
   //       this.connect();
   //       this.callCallback(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onMale",
   //    type: "sensors",
   //    block: { name: "onMale", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.plugType > 0; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "onFemale",
   //    type: "sensors",
   //    block: { name: "onFemale", yieldsValue: true },
   //    func: function(callback) {
   //       this.callCallback(callback, this.isOn(function(obj) { return obj.plugType < 0; }));
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropPlatformInFront",
   //    type: "actions",
   //    block: { name: "dropPlatformInFront" },
   //    func: function(callback) {
   //       if(this.nbPlatforms == 0)
   //          throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
   //       var coords = {row: this.coordsInFront().row + 1, col: this.coordsInFront().col};
   //       if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
   //          throw(window.languageStrings.messages.failureDropPlatform);
   //       }
   //       this.nbPlatforms -= 1;
   //       this.dropObject({type: "platform"}, coords);
   //       this.callCallback(callback);
   //    }
   // });
   
   // infos.newBlocks.push({
   //    name: "dropPlatformAbove",
   //    type: "actions",
   //    block: { name: "dropPlatformAbove" },
   //    func: function(callback) {
   //       if(this.nbPlatforms == 0)
   //          throw(window.languageStrings.messages.failureNotEnoughPlatform);
            
   //       var coords = {row: this.getRobot().row - 1, col: this.getRobot().col};
   //       if(this.getItemsOn(coords.row, coords.col, function(item) { return item.isObstacle === true; }).length != 0) {
   //          throw(window.languageStrings.messages.failureDropPlatform);
   //       }
   //       this.nbPlatforms -= 1;
   //       this.dropObject({type: "platform"}, coords);
   //       this.callCallback(callback);
   //    }
   // });

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
      func: function(value, callback) {
         var { pointData } = context;
         var pos = pointData[value];
         if(!pos) {
            this.callCallback(callback, false);
            return
         }
         var x = getPosFromCoordinate(pos.x,0);
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
      func: function(value, callback) {
         var { pointData } = context;
         var pos = pointData[value]
         if(!pos) {
            this.callCallback(callback, false);
            return
         }
         var y = getPosFromCoordinate(pos.y,1);
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

      if(!context.pointData){
         context.pointData = initPointData();
         context.bestScore = findBestScore();
         console.log(context.bestScore)
      }

      
      if(context.display) {
         this.delayFactory.destroyAll();
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         // paper = this.raphaelFactory.create("paperMain", "grid", infos.cellSide * context.nbCols * scale, infos.cellSide * context.nbRows * scale);
         paper = this.raphaelFactory.create("paperMain", "grid", infos.paperW, infos.paperH);
         // initCanvas();
         // resetBoard();
         // resetItems();
         context.updateScale();
         // $("#nbMoves").html(context.nbMoves);
      }
      else {
         // resetItems();
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
      // console.log("initPointData")
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
      var { classColor, xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      var w = Math.round(pointAreaW*scale);
      var h = Math.round(pointAreaH*scale);
      var x0 = Math.round(xPointArea*scale);
      var y0 = Math.round(yPointArea*scale);
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
         var { id } = findClosestCentroid({x,y});
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
      // var { xPointArea, yPointArea, pointAreaW, pointAreaH } = infos;
      // var x = xPointArea*scale;
      // var y = yPointArea*scale;
      // var w = pointAreaW*scale;
      // var h = pointAreaH*scale;
      // var centPos = centPos || centroidPos;
      // var score = 0;
      // var classPoints = [];
      // // console.log(x,y,w,h)
      // for(var iC = 0; iC <= k; iC++){
      //    classPoints[iC] = [];
      // }
      for(var iP = 0; iP < nbPoints; iP++){
         updatePoint(iP);
         // var orPos = pointData[iP];
         // var pos = {};
         // pos.x = orPos.x*scale;
         // pos.y = orPos.y*scale;
         // var { id, d } = findClosestCentroid(pos,centPos);
         // classPoints[id].push(iP);
         // score += d*d;
         // // if(noVisual)
         // //    continue;
         // // console.log(id)
         // for(var iC = 0; iC <= k; iC++){
         //    var obj = points[iP][iC];
         //    if(iC == id){
         //       obj.show();
         //    }else{
         //       obj.hide();
         //    }
         //    obj.attr("clip-rect",[x,y,w,h]);
         // }
      }
      // score = Math.round(score);
      // return { score, classPoints }
   };

   function updatePoint(iP) {
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
         var pos = {};
         pos.x = orPos.x*scale;
         pos.y = orPos.y*scale;
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
         var coo = getCoordinatesFromPos(cPos);
         var d = Beav.Geometry.distance(x,y,coo.x*scale,coo.y*scale);
         if(d < minD){
            minD = d;
            cID = iC + 1;
         }
      }
      return { id: cID, d: minD }
   };

   function findBestScore() {
      var { nbClusters, nbClusters } = context;
      var { xRange, yRange } = infos;
      var count = 0;
      var centPos = [];
      for(var iC = 0; iC < nbClusters; iC++){
         var x = xRange[0] + (iC + 1)*(xRange[1] - xRange[0])/(nbClusters + 1);
         var y = yRange[0] + (iC + 1)*(yRange[1] - yRange[0])/(nbClusters + 1);
         centPos[iC] = {x,y};
      }
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

   function getPosFromCoordinates(coo) {
      // var { xPointArea, yPointArea, pointAreaW, pointAreaH, xRange, yRange } = infos;
      // var x0 = xPointArea;
      // var y0 = yPointArea;
      // var w = pointsAreaW;
      // var h = pointsAreaH;

      // var x = xRange[0] + (coo.x - x0)/w;
      // var y = yRange[0] + (coo.y - y0)/h;
      var x = Math.round(getPosFromCoordinate(coo.x,0));
      var y = Math.round(getPosFromCoordinate(coo.y,1));
      return { x, y }
   };

   function getPosFromCoordinate(val,ax) {
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

      var res = ran[0] + (ran[1] - ran[0])*(val - min)/le;
      return res
   };
   
   var resetBoard = function() {
      // var { paperW, paperH } = infos;
      // frame = paper.rect(0,0,paperW, paperH).attr("stroke-width", "5");

      // initCentroids();
      // for(var iRow = 0;iRow < context.nbRows;iRow++) {
      //    cells[iRow] = [];
      //    for(var iCol = 0;iCol < context.nbCols;iCol++) {
      //       cells[iRow][iCol] = paper.rect(0, 0, 10, 10);
      //       if(context.tiles[iRow][iCol] == 0)
      //          cells[iRow][iCol].attr({'stroke-width': '0'});
      //       if(infos.backgroundColor && context.tiles[iRow][iCol] != 0)
      //          cells[iRow][iCol].attr({'fill': infos.backgroundColor});
      //       if(infos.noBorders) {
      //          if (context.tiles[iRow][iCol] != 0) {
      //             cells[iRow][iCol].attr({'stroke': infos.backgroundColor});
      //          }
      //       } else {
      //          if (infos.borderColor) {
      //             cells[iRow][iCol].attr({'stroke': infos.borderColor});
      //          }
      //       }
            
      //    }
      // }
      // if(infos.showLabels) {
      //    for(var iRow = 0;iRow < context.nbRows;iRow++) {
      //       rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
      //    }
      //    for(var iCol = 0;iCol < context.nbCols;iCol++) {
      //       colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
      //    }
      // }
      // if (infos.showCardinals) {
      //    cardLabels = [
      //       paper.text(0, 0, strings.cardinals.north),
      //       paper.text(0, 0, strings.cardinals.south),
      //       paper.text(0, 0, strings.cardinals.west),
      //       paper.text(0, 0, strings.cardinals.east)
      //       ];
      // }
   };


   
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
   
   context.jump = function(callback) {
      if(!infos.hasGravity) {
         throw("Error: can't jump without gravity");
      }
      
      var item = context.getRobot();
      if(!context.isInGrid(item.row - 1, item.col)) {
         throw(context.strings.messages.jumpOutsideGrid);
      }
      var obstacle = context.getItemsOn(item.row - 2, item.col, function(obj) { return obj.isObstacle === true || obj.isProjectile === true; });
      if(obstacle.length > 0) {
         throw(context.strings.messages.jumpObstacleBlocking);
      }
      var platforms = context.getItemsOn(item.row - 1, item.col, function(obj) { return obj.isObstacle === true; });
      if(platforms.length == 0) {
         throw(context.strings.messages.jumpNoPlatform);
      }
      context.nbMoves++;
      context.moveRobot(item.row - 2, item.col, item.dir, callback);
   };
   
   context.withdraw = function(filter, errorWhenEmpty) {
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      if(errorWhenEmpty === undefined) {
         errorWhenEmpty = true;
      }
      var item = context.getRobot();
      var withdrawables = context.getItemsOn(item.row, item.col, function(obj) { return obj.isWithdrawable === true && filter(obj); });
      if(withdrawables.length == 0) {
         if(errorWhenEmpty)
            throw(context.strings.messages.nothingToPickUp);
         return;
      }
      
      if(infos.bagSize != undefined && context.bag.length == infos.bagSize) {
         throw(context.strings.messages.tooManyObjects);
      }
      
      var withdrawable = withdrawables[0];
      context.setIndexes();
      context.items.splice(withdrawable.index, 1);
      context.bag.push(withdrawable);
      
      if(context.display) {
         function removeWithdrawable() {
            withdrawable.element.remove();
            var items = context.getItemsOn(item.row, item.col);
            for(var i = 0; i < items.length ; i++) {
               redisplayItem(items[i]);
            }
         }

         if (infos.actionDelay > 0) {
            context.delayFactory.createTimeout("takeItem_" + Math.random(), removeWithdrawable, infos.actionDelay);
         } else {
            removeWithdrawable();
         }
      }
   };
   
   context.checkContainer = function(coords) {
      var containers = context.getItemsOn(coords.row, coords.col, function(obj) { return (obj.isContainer === true) && (!obj.isFake) });
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
         
         if(container.containerSize != undefined && context.getItemsOn(coords.row, coords.col, filter).length > container.containerSize) {
            throw(window.languageStrings.messages.failureDropObject);
            return;
         }

         

         if(container.containerFilter != undefined) {
            if(context.hasOn(coords.row, coords.col, function(obj) { return obj.isWithdrawable === true && !container.containerFilter(obj) }) && (context.infos.blockingFilter !== false)) {

               throw(window.languageStrings.messages.failureDropObject);
               return;
            }
         }
      }
   };
   
   context.drop = function(count, coords, filter) {
      if(count === undefined) {
         count = 1;
      }
      if(filter === undefined) {
         filter = function(obj) { return true; };
      }
      if(coords == undefined) {
         var item = context.getRobot();
         coords = {row: item.row, col: item.col};
      }
      
      for(var i = 0;i < count;i++) {
         if(context.bag.length == 0) {
            throw(context.strings.messages.emptyBag);
         }
         
         var object = context.bag.pop();
         object.row = coords.row;
         object.col = coords.col;
         var itemsOn = context.getItemsOn(coords.row, coords.col);
         var maxi = object.zOrder;
         for(var item in itemsOn) {
            if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
               maxi = itemsOn[item].zOrder;
            }
            redisplayItem(item);
         }
         
         object.zOrder = maxi + 0.000001;
         resetItem(object, true);
         
         context.checkContainer(coords);
      }
      
      redisplayItem(this.getRobot());
   };
   
   context.dropObject = function(object, coords) {
      if(coords == undefined) {
         var item = context.getRobot();
         coords = {row: item.row, col: item.col};
      }
      
      if(!context.isInGrid(coords.row, coords.col)) {
         throw(window.languageStrings.messages.failureDropOutside);
         return;
      }
      
      object.row = coords.row;
      object.col = coords.col;
      
      var itemsOn = context.getItemsOn(coords.row, coords.col);
      var maxi = object.zOrder;
      if(maxi === undefined) {
         maxi = 0;
      }
      for(var item in itemsOn) {
         if(itemsOn[item].isWithdrawable === true && itemsOn[item].zOrder > maxi) {
            maxi = itemsOn[item].zOrder;
         }
         redisplayItem(item);
      }
      resetItem(object, true);
      context.checkContainer(coords);
      redisplayItem(this.getRobot());
   };
   
   context.turnLeft = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 3) % 4, callback);
   };
   
   context.turnRight = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 1) % 4, callback);
   };
   
   context.turnAround = function(callback) {
      var robot = context.getRobot();
      context.moveRobot(robot.row, robot.col, (robot.dir + 2) % 4, callback);
   };
   
   context.forward = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront();
      var ttbo = context.tryToBeOn(coords.row, coords.col);
      if(ttbo === true) {
         if(infos.hasGravity) {
            context.fall(robot, coords.row, coords.col, callback);
         } else {
            context.nbMoves++;
            context.moveRobot(coords.row, coords.col, robot.dir, callback);
         }
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
         throw ttbo;
      }
   };
   
   context.backwards = function(callback) {
      var robot = context.getRobot();
      var coords = context.coordsInFront(2);
      var ttbo = context.tryToBeOn(coords.row, coords.col);
      if(ttbo === true) {
         if(infos.hasGravity) {
            context.fall(robot, coords.row, coords.col, callback);
         } else {
            context.nbMoves++;
            context.moveRobot(coords.row, coords.col, robot.dir, callback);
         }
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(robot.row + (coords.row - robot.row) / 4, robot.col + (coords.col - robot.col) / 4, robot.dir);
         throw ttbo;
      }
   };
   
   context.north = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row - 1, item.col);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row - 1, item.col, 3, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row - 1/4, item.col, 3);
         throw ttbo;
      }
   };
   
   context.south = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row + 1, item.col);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row + 1, item.col, 1, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row + 1/4, item.col, 1);
         throw ttbo;
      }
   };
   
   context.east = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row, item.col + 1);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row, item.col + 1, 0, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row, item.col + 1/4, 0);
         throw ttbo;
      }
   };
   
   context.west = function(callback) {
      var item = context.getRobot();
      var ttbo = context.tryToBeOn(item.row, item.col - 1);
      if(ttbo === true) {
         context.nbMoves++;
         context.moveRobot(item.row, item.col - 1, 2, callback);
      } else if(ttbo === false) {
         context.waitDelay(callback);
      } else {
         context.moveRobot(item.row, item.col - 1/4, 2);
         throw ttbo;
      }
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
         redisplayAllItems();
         
         this.last_connect = undefined;
      }
      else {
         this.last_connect = plugs[0];
      }
   };
      
   return context;
};

var getResources = function(subTask) {
   var res = [];
   var type = subTask.gridInfos.contextType;
   var typeData = contextParams[type];
   if(typeData.itemTypes){
      for(var key in typeData.itemTypes){
         var params = typeData.itemTypes[key];
         if(params.img){
            res.push({ type: 'image', url: params.img });
         }
      }
   }
   return res
};

var robotEndConditions = {
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

var endConditions = {
   checkScore: function(context, lastTurn) {
      context.success = false;
      var { score } = context.updateScore();
      console.log(score)
      throw("test");
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

var contextParams = {
      none: {
         hideSaveOrLoad: true,
         actionDelay: 200,
         ignoreInvalidMoves: false,
         checkEndEveryTurn: false,
         paperW: 770,
         paperH: 600,
         // marginX: 20,
         // marginY: 20
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
         // checkEndCondition: robotEndConditions.checkContainersFilled
         checkEndCondition: endConditions.checkScore
      },
   };

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('robot', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['robot', getContext]);
}
