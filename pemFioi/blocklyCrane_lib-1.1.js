
// var imgPath = modulesPath+"img/algorea/";
// var mp3Path = modulesPath+"mp3/";
var dustUrl = "crane/dust.png";

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
               putDown: "poser",
               drop: "lâcher",
               colHeight: "hauteur de la colonne",
               placeMarker: "placer le marqueur",             
               goToMarker: "aller au marqueur",
               expectedBlock: "brique attendue",
               expectedBlockAt: "brique attendue ligne %1 colonne %2",
               topBlock: "brique du dessus",
               blockAt: "brique ligne %1 colonne %2",
               brokenBlockAt: "brique cassée ligne %1 colonne %2",
               carriedBlock: "brique transportée",
               topBlockBroken: "brique du dessus est cassée",
               carriedBlockBroken: "brique transportée est cassée",  
               onMarker: "sur le marqueur %1",

               up: "monter",
               down: "descendre",
               readBlock: "lire brique",
               dieValue: "valeur du dé",
               flip: "retourner"

            },
            code: {
               left: "gauche",
               right: "droite",
               take: "prendre",
               putDown: "poser",
               drop: "lacher",
               colHeight: "hauteurColonne",
               placeMarker: "placerMarqueur",
               goToMarker: "allerAuMarqueur",
               expectedBlock: "briqueAttendue",
               expectedBlockAt: "briqueAttendueA",
               topBlock: "briqueDuDessus",           
               blockAt: "briqueA",
               brokenBlockAt: "briqueCasseeA",
               carriedBlock: "briqueTransportee",
               topBlockBroken: "briqueDuDessusCassee",
               carriedBlockBroken: "briqueTransporteeCassee",                
               onMarker: "surMarqueur",

               up: "monter",
               down: "descendre",
               readBlock: "lireBrique",
               dieValue: "valeurDe",
               flip: "retourner"

            },
            description: {
               left: "@() Déplace la grue d'une case vers la gauche.",
               right: "@() Déplace la grue d'une case vers la droite.",
               take: "@() Prend la brique se trouvant sous la grue.",
               putDown: "@() Pose la brique transportée par la grue.",
               drop: "@() Lâche le boulet de démolition porté par la grue.",
               colHeight: "@() Retourne le nombre de briques se trouvant dans la colonne sous la grue.",
               placeMarker: "@(nom) Place un marqueur portant ce nom à la position actuelle de la grue, ou y déplace le marqueur de ce nom s'il existe déjà.",             
               goToMarker: "@(nom) Déplace la grue à la position du marqueur portant ce nom.",
               onMarker: "@(nom) Indique si le marqueur portant se nom se trouve dans la colonne de la grue.",
			      expectedBlock: "@() Retourne le numéro du type de brique qu'il faut placer au sommet de la colonne où se trouve la grue.",
               expectedBlockAt: "@(ligne, colonne) Retourne le numéro du type de brique qu'il faut placer dans la grille, à la ligne et à la colonne indiquées.",
               topBlock: "@() Retourne le numéro du type de brique se trouvant au sommet de la colonne où se trouve la grue.",
               blockAt: "@(ligne, colonne) Retourne le numéro du type de brique se trouvant dans la grille à la ligne et à la colonne indiquées.",
               brokenBlockAt: "@(ligne, colonne) Retourne True si la brique se trouvant à la ligne et à la colonne indiquées est cassée, et False sinon.",
               carriedBlock: "@() Retourne le numéro du type de la brique actuellement transportée par la grue.",
               topBlockBroken: "@() Retourne True si la brique se trouvant au sommet de la colonne où se trouve la grue est cassée, et False sinon.",
               carriedBlockBroken: "@() Retourne True si la brique actuellement transportée par la grue est cassée, et False sinon.", 

               up: "@() Déplace l'outil' d'une case vers le haut.",
               down: "@() Déplace l'outil' d'une case vers le bas.",           
               readBlock: "@() Retourne le numéro du type.",
               dieValue: "@() Retourne la valeur du dé.",
               flip: "@() Retourne la brique se trouvant sous la grue."
            },
            messages: {
               yLimit: function(up) {
                  var str = "L'outil ne peut pas "
                  str += (up) ? "monter plus haut." : "descendre plus bas.";
                  return str
               },
               outside: "La grue ne peut pas aller plus loin dans cette direction !",
               success: "Bravo, vous avez réussi !",
               failure: "Vous n'avez pas atteint l'objectif",
               nothingToTake: "Il n'y a pas de bloc dans cette colonne !",
               notMovable: "Ce bloc ne peut pas être déplacé",
               holdingBlock: "La grue ne peut pas prendre plus d'un bloc en même temps",
               holdingBlock_sensor: "Vous ne pouvez pas utiliser le capteur pendant que la grue porte un bloc",
               emptyCrane: "La grue ne porte pas de bloc",
               cannotDrop: "Vous ne pouvez pas déposer de bloc dans cette colonne",
               notWrecking: "Vous ne pouvez pas lâcher ce bloc",
               wrongCoordinates: "Les coordonnées sont invalides",
               impossibleToRead: "Impossible de lire une brique à cette position",
               noMarker: function(num) {
                  return "Le marqueur n°"+num+" n'existe pas"
               },
               partialSuccess: function(thresh,score) {
                  // console.log(thresh,score)
                  if(thresh){
                     var perc = Math.round(thresh*100);
                     return "Vous avez correctement placé au moins "+perc+"% des blocs, mais l'objectif n'est pas totalement atteint."
                  }else{
                     var perc = Math.round(score*100);
                     return "Vous avez réussi un objectif secondaire mais l'objectif principal n'est pas atteint. Vous avez gagné "+perc+"% du score total."
                  }
               },
               failureMissing: function(nb) {
                  if(nb == 0){
                     return "La case encadrée en rouge devrait contenir un bloc"
                  }
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "La case encadrée en rouge devrait contenir "+str+" en jaune"
               },
               failureWrongBlock: function(nb) {
                  if(nb == 0){
                     return "La case encadrée en rouge ne devrait pas contenir ce bloc"
                  }
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "La case encadrée en rouge devrait contenir "+str+" en jaune"
               },
               failureBrokenBlock: function(nb) {
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "Le bloc encadré en rouge est cassé et devrait être remplacé par "+str+" en jaune"
               },
               failureUnwanted: "La case encadrée en rouge contient un bloc alors qu'elle devrait être vide"
            },
            startingBlockName: "Programme du robot"
         },
         en: {
            label: {
               left: "move to the left",
               right: "move to the right",
               take: "take",
               putDown: "put down",
               drop: "drop",
               colHeight: "hauteur de la colonne",
               placeMarker: "placer le marqueur",             
               goToMarker: "aller au marqueur",
               expectedBlock: "brique attendue",
               expectedBlockAt: "brique attendue ligne %1 colonne %2",
               topBlock: "brique du dessus",
               blockAt: "brique ligne %1 colonne %2",
               brokenBlockAt: "brique cassée ligne %1 colonne %2",
               carriedBlock: "brique transportée",
               topBlockBroken: "brique du dessus est cassée",
               carriedBlockBroken: "brique transportée est cassée",            
            },
            code: {
               left: "gauche",
               right: "right",
               take: "take",
               putDown: "putDown",
               drop: "drop",
               colHeight: "hauteurColonne",
               placeMarker: "placerMarqueur",
               goToMarker: "allerAuMarqueur",
               expectedBlock: "briqueAttendue",
               expectedBlockAt: "briqueAttendueA",
               topBlock: "briqueDuDessus",           
               blockAt: "briqueA",
               brokenBlockAt: "briqueCasseeA",
               carriedBlock: "briqueTransportee",
               topBlockBroken: "briqueDuDessusCassee",
               carriedBlockBroken: "briqueTransporteeCassee",                

            },
            description: {
               left: "@() Déplace la grue d'une case vers la gauche.",
               right: "@() Déplace la grue d'une case vers la droite.",
               take: "@() Prend la brique se trouvant sous la grue.",
               putDown: "@() Pose la brique transportée par la grue.",
               drop: "@() Lâche le boulet de démolition porté par la grue.",
               colHeight: "@() Retourne le nombre de briques se trouvant dans la colonne sous la grue.",
               placeMarker: "@(nom) Place un marqueur portant ce nom à la position actuelle de la grue, ou y déplace le marqueur de ce nom s'il existe déjà.",             
               goToMarker: "@(nom) Déplace la grue à la position du marqueur portant ce nom.",
               expectedBlock: "@() Retourne le numéro du type de brique qu'il faut placer au sommet de la colonne où se trouve la grue.",
               expectedBlockAt: "@(ligne, colonne) Retourne le numéro du type de brique qu'il faut placer dans la grille, à la ligne et à la colonne indiquées.",
               topBlock: "@() Retourne le numéro du type de brique se trouvant au sommet de la colonne où se trouve la grue.",
               blockAt: "@(ligne, colonne) Retourne le numéro du type de brique se trouvant dans la grille à la ligne et à la colonne indiquées.",
               brokenBlockAt: "@(ligne, colonne) Retourne True si la brique se trouvant à la ligne et à la colonne indiquées est cassée, et False sinon.",
               carriedBlock: "@() Retourne le numéro du type de la brique actuellement transportée par la grue.",
               topBlockBroken: "@() Retourne True si la brique se trouvant au sommet de la colonne où se trouve la grue est cassée, et False sinon.",
               carriedBlockBroken: "@() Retourne True si la brique actuellement transportée par la grue est cassée, et False sinon.",            
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
               notWrecking: "Vous ne pouvez pas lâcher ce bloc",
               wrongCoordinates: "Les coordonnées sont invalides",
               noMarker: function(num) {
                  return "Le marqueur n°"+num+" n'existe pas"
               },
               partialSuccess: function(thresh,score) {
                  if(thresh){
                     var perc = Math.round(thresh*100);
                     return "Vous avez correctement placé au moins "+perc+"% des blocs, mais l'objectif n'est pas totalement atteint."
                  }else{
                     var perc = Math.round(score*100);
                     return "Vous avez réussi un objectif secondaire mais l'objectif principal n'est pas atteint. Vous avez gagné "+perc+"% du score total."
                  }
               },
               failureMissing: function(nb) {
                  if(nb == 0){
                     return "La case encadrée en rouge devrait contenir un bloc"
                  }
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "La case encadrée en rouge devrait contenir "+str+" en jaune"
               },
               failureWrongBlock: function(nb) {
                  if(nb == 0){
                     return "La case encadrée en rouge ne devrait pas contenir ce bloc"
                  }
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "La case encadrée en rouge devrait contenir "+str+" en jaune"
               },
               failureBrokenBlock: function(nb) {
                  var str = (nb > 1) ? "un des blocs encadrés" : "le bloc encadré";
                  return "Le bloc encadré en rouge est cassé et devrait être remplacé par "+str+" en jaune"
               },
               failureUnwanted: "La case encadrée en rouge contient un bloc alors qu'elle devrait être vide"
            },
            startingBlockName: "Program of the robot"
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
   function getSoundPath(url) {
      if(modulesPath != undefined){
         return modulesPath+"mp3/"+url
      }
      return imgUrlWithPrefix(url)
   };

	for (var id = 1; id < 50; id++) {
		var strId = "" + id;
		if (id < 10) {
			strId = "0" + id;
		}
		contextParams.numbers.itemTypes["item_" + id] = { num: id + 1, id: id,
				   img: "crane/numbers/" + strId + ".png",
               brokenImg: "crane/numbers/broken_" + strId + ".png",
				   hiddenImg: "crane/numbers/hidden_" + strId + ".png", side: 60, isMovable: true, zOrder: 1};
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
         if(this.cranePosY > -1){
            // because take as a callback of shiftCraneY doesn't work
            // this.moveUpAndTake(callback);
            this.moveCraneY(-1, function () {
               context.executeCallWhenReady('take');
               callback();
            });
         }else{
            this.take(callback);
         } 
      }
   });

   infos.newBlocks.push({
      name: "putDown",
      type: "actions",
      block: { name: "putDown" },
      func: function(callback) {
         this.putDown(callback);
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

   infos.newBlocks.push({
      name: "colHeight",
      type: "sensors",
      block: { name: "colHeight", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getColHeight());
      }
   });

   infos.newBlocks.push({
      name: "expectedBlock",
      type: "sensors",
      block: { name: "expectedBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getExpectedBlock());
      }
   });

   infos.newBlocks.push({
      name: "expectedBlockAt",
      type: "sensors",
      block: { name: "expectedBlockAt", yieldsValue: 'int',
         blocklyJson: {
               "args0": [
               { "type": "field_number", "name": "PARAM_0", "value": 1 },
               { "type": "field_number", "name": "PARAM_1", "value": 1 }
            ]
         }
      },
      func: function(row,col,callback) {
         this.callCallback(callback, this.getExpectedBlockAt(row,col));
      }
   });

   infos.newBlocks.push({
      name: "topBlock",
      type: "sensors",
      block: { name: "topBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getTopBlock());
      }
   });

   infos.newBlocks.push({
      name: "topBlockBroken",
      type: "sensors",
      block: { name: "topBlockBroken", yieldsValue: true },
      func: function(callback) {
         this.callCallback(callback, this.isTopBlockBroken());
      }
   });

   infos.newBlocks.push({
      name: "blockAt",
      type: "sensors",
      block: { name: "blockAt", yieldsValue: 'int',
         blocklyJson: {
               "args0": [
               { "type": "field_number", "name": "PARAM_0", "value": 1 },
               { "type": "field_number", "name": "PARAM_1", "value": 1 }
            ]
         }
      },
      func: function(row,col,callback) {
         this.callCallback(callback, this.getBlockAt(row,col));
      }
   });

   infos.newBlocks.push({
      name: "brokenBlockAt",
      type: "sensors",
      block: { name: "brokenBlockAt", yieldsValue: 'bool',
         blocklyJson: {
               "args0": [
               { "type": "field_number", "name": "PARAM_0", "value": 1 },
               { "type": "field_number", "name": "PARAM_1", "value": 1 }
            ]
         }
      },
      func: function(row,col,callback) {
         this.callCallback(callback, this.isBlockAtBroken(row,col));
      }
   });

   infos.newBlocks.push({
      name: "carriedBlock",
      type: "sensors",
      block: { name: "carriedBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getCarriedBlock());
      }
   });

   infos.newBlocks.push({
      name: "carriedBlockBroken",
      type: "sensors",
      block: { name: "carriedBlockBroken", yieldsValue: true },
      func: function(callback) {
         this.callCallback(callback, this.isCarriedBlockBroken());
      }
   });

   infos.newBlocks.push({
      name: "onMarker",
      type: "sensors",
      block: {
         name: "onMarker", params: [null], yieldsValue: 'bool', countAs: 2,
         blocklyJson: {
               "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]]
            }]
         } },
      func: function(value,callback) {
         this.callCallback(callback, this.isOnMarker(value));
      }
   });

   infos.newBlocks.push({
      name: "placeMarker",
      type: "actions",
      block: {
         name: "placeMarker", params: [null], countAs: 2,
         blocklyJson: {
            "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]]
            }]
         }
      },
      func: function(value, callback) {
         this.placeMarker(value);
         this.waitDelay(callback);
      }
   });

   infos.newBlocks.push({
      name: "goToMarker", 
      type: "actions",
      block: {
         name: "goToMarker", params: [null], countAs: 2,
      blocklyJson: {
            "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]]
            }]
         },
      },
      func: function(value, callback) {
         this.goToMarker(value,callback);
      }
   });

   infos.newBlocks.push({
      name: "up",
      type: "actions",
      block: { name: "up" },
      func: function(callback) {
         this.shiftCraneY(-1,callback);
      }
   });

   infos.newBlocks.push({
      name: "down",
      type: "actions",
      block: { name: "down" },
      func: function(callback) {
         this.shiftCraneY(1,callback);
      }
   });

   infos.newBlocks.push({
      name: "readBlock",
      type: "sensors",
      block: { name: "readBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getBlockType());
      }
   });

   infos.newBlocks.push({
      name: "dieValue",
      type: "sensors",
      block: { name: "dieValue", yieldsValue: 'int' },
      func: function(callback) {
         this.callCallback(callback, this.getDieValue());
      }
   });

   infos.newBlocks.push({
      name: "flip",
      type: "actions",
      block: { name: "flip" },
      func: function(callback) {
         if(this.cranePosY > -1){
            this.moveCraneY(-1, function () {
               context.executeCallWhenReady('takeAndFlip');
               callback();
            });
         }else{
            this.takeAndFlip(callback);
         } 
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
   var backgroundObj;
   var dust;

   var crane = {};
   var craneH = 1.5; // as rows
   var { 
      wheelsPosY, 
      wheelsOffsetX, wheelsOffsetY, 
      wheelsW, 
      wheelsH,
      shaftW, shaftH,
      shaftOffsetY, shaftOffsetX,
      sensorW, sensorH,
      sensorOffsetY, sensorOffsetX,
      clawW, clawH, 
      clawsOffsetY,
      leftClawOffsetX, rightClawOffsetX,
      leftClawCx, leftClawCy,
      rightClawCx, rightClawCy,
      clutchAngle, 
      craneItemOffset } = infos.craneAttr;

   var markerRectSide = 30;
   var markerPoleH = 20;
   var markerH = markerRectSide + markerPoleH - wheelsPosY;
   var currBlocks = subTask.gridInfos.includeBlocks.generatedBlocks.robot;
   if(!Beav.Array.has(currBlocks,"placeMarker") && !Beav.Array.has(currBlocks,"goToMarker")){
      markerH = 0;
   }
   var markerTextSize = 16;

   markerAttr = infos.markerAttr || {
      rect: {
         stroke: "none",
         fill: "#5158BB",
         r: 3
      },
      backRect: {
         stroke: "none",
         fill: "#1D1E47",
         r: 3
      },
      pole: {
         stroke: "#5158BB",
         "stroke-width": 5
      },
      text: {
         "font-weight": "bold",
         fill: "white"
      }
   };
   context.highlight1Attr = infos.highlight1Attr || {
      stroke: "red",
      "stroke-width": 3
   };
   context.highlight2Attr = infos.highlight2Attr || {
      stroke: "yellow",
      "stroke-width": 3
   };

   var dustSrc = getImgPath(dustUrl);
   var dustW = 80;
   var dustH = 28;
   var dustDuration = 1100;
   var dust;

   var takeAnimDelay = 0.5*infos.actionDelay;

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
         context.initCraneContent = gridInfos.initCraneContent;
         context.nbRows = context.tiles.length;
         context.nbCols = context.tiles[0].length;
         context.nbRowsCont =  context.container.length;
         context.nbColCont =  (context.nbRowsCont > 0) ? context.container[0].length : 0;
         context.initCranePos = gridInfos.initCranePos || 0;
         context.initCranePosY = (gridInfos.initCranePosY != undefined) ? gridInfos.initCranePosY : -1;
         context.initTool = gridInfos.initTool || 0;
         context.dieValues = gridInfos.dieValues || null;
         context.initDieValue = gridInfos.initDieValue || null;
         context.scoring = gridInfos.scoring || [ { target: gridInfos.target, score: 1 } ]
         context.target = context.scoring[0].target || [];
         context.targetHidden = context.scoring[0].hidden || [];
         context.broken = gridInfos.broken || [];
         context.hidden = gridInfos.hidden || [];
         context.mask = gridInfos.mask || [];
         context.initMarkers = gridInfos.initMarkers || [];
         context.customItems = gridInfos.customItems || {};
         context.successAnim = gridInfos.successAnim || {};
      }
      context.partialSuccessEnabled = (infos.partialSuccessEnabled == undefined) ? true : infos.partialSuccessEnabled;
      context.cranePos = context.initCranePos;
      context.cranePosY = context.initCranePosY || 0;
      context.craneContent = null;
      context.tool = context.initTool || 0; // 0: crane, 1: sensor

      context.rng = new RandomGenerator(0);
      // context.dieValues = context.initDieValues || null;
      context.dieValue = context.initDieValue || null;
      context.rollDieIndex = 0;
      
      context.items = [];
      context.multicell_items = [];
      context.markers = [];


      for(var iMark = 0; iMark < context.initMarkers.length; iMark++){
         context.markers.push(Beav.Object.clone(context.initMarkers[iMark]));
      }

      this.highlights = [];
      this.successAnimObj = [];
      
      // context.last_connect = undefined;
      // context.wires = [];
      
      context.lost = false;
      context.success = false;
      context.partialSuccessThreshold = 0.5;
      context.nbMoves = 0;
      context.time = 0;
      context.animate = true;
      if (undefined === context.soundEnabled) {
         context.soundEnabled = true;
      }
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
         $("#grid").css("user-select","none");
         context.paper = paper;
         resetBoard();
         resetCrane();
         resetItems();
         context.updateScale();
         $("#nbMoves").html(context.nbMoves);

         $("#background_music").remove();
         $("body").append("<audio src="+getSoundPath("background.mp3")+" autoplay loop id=background_music></audio>");
         $("html").click(function() {
            if($("#background_music").length > 0){
               $("#background_music")[0].play();
            }
         })
         var vol = (context.soundEnabled) ? 1 : 0;
         $("audio").prop('volume', vol);
      }else{
         resetItems();
      }
      context.crushers = context.getCrushers();
   };

   context.redrawDisplay = function() {
      // console.log("[crane] redrawDisplay")
      if(context.display) {
         this.raphaelFactory.destroyAll();
         if(paper !== undefined)
            paper.remove();
         var paperW = infos.cellSide * (context.nbCols + context.nbColCont) * scale;
         var paperH = infos.cellSide * Math.max(context.nbRows,context.nbRowsCont) * scale;
         paper = this.raphaelFactory.create("paperMain", "grid", paperW, paperH);
         context.paper = paper;
         resetBoard();
         resetCrane();
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

   context.changeSoundEnabled = function (enabled) {
      this.soundEnabled = enabled;
      // console.log("[yo",this.soundEnabled)
      var vol = (this.soundEnabled) ? 1 : 0;
      $("audio").prop('volume', vol);
   };

   context.highlightCells = function(cellPos,attr) {
      var p = context.paper;
      var scale = context.scale;
      var cSide = infos.cellSide;
      // console.log(infos)
      
      for(var pos of cellPos){
         var { row, col } = pos;
         if(row == "crane"){
            var item = context.craneContent;
            var craneAttr = getCraneAttr();
            var y = craneAttr.yClaws + (craneItemOffset + item.offsetY)*scale;
            if(item.catchOffsetY){
               y -= item.catchOffsetY*scale;
            }
            var x = craneAttr.x;
         }else{
            var { x, y } = context.getCellCoord(row,col);
         }
         var obj = p.rect(x,y,cSide*scale,cSide*scale).attr(attr);
         context.highlights.push({ row, col, obj });
      }
   };

   context.showSuccessAnim = function() {
      var p = this.paper;
      var scale = this.scale;
      var cSide = infos.cellSide;
      
      if(this.successAnim.img && this.successAnim.img.length > 0){
         for(var anim of this.successAnim.img){
            var { row, col, src, width, height } = anim;
            var { x, y } = context.getCellCoord(row,col);
            var obj = p.image(src,x,y,cSide*width*scale,cSide*height*scale);
            context.successAnimObj.push({ row, col, width, height, obj });
         }
      }
      if(this.successAnim.hideOtherBlocks){
         for(item of this.items){
            item.element.hide();
         }
      }
      if(this.successAnim.hideBlockType){
         for(item of this.items){
            // console.log("[yo",item.type,this.successAnim.hideBlockType)
            if(item.type == this.successAnim.hideBlockType){
               item.element.hide();
            }
         }
      }
   };

   context.getCrushers = function() {
      var crushers = [];
      for(var item of context.items){
         if(item.crusher && !item.target){
            crushers.push(item);
         }
      }
      return crushers
   };

   context.getCellCoord = function(row,col) {
      var scale = context.scale;
      var cSide = infos.cellSide;
      var x = (cSide * col + infos.leftMargin) * scale;
      var y = (cSide * (craneH + row) + infos.topMargin + markerH) * scale;
      return { x, y }
   };

   context.getColHeight = function() {
      var nbRowsCont = this.nbRowsCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);

      var col = this.cranePos;
      var topBlock = this.findTopBlock(col);

      var h = nbRows - topBlock.row;

      return h
   };

   context.getExpectedBlock = function() {
      var col = this.cranePos;
      var nbRowsCont = this.nbRowsCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);

      for(var row = nbRows - 1; row >= 0; row--){
         var tar = this.target[row][col];
         if(tar > 1){
            var occupied = false;
            for(var item of this.items){
               if(item.row == row && item.col == col && !item.target){
                  occupied = true;
               }
            }
            if(occupied){
               continue
            }
            // console.log(tar,row,col,this.items)
            return this.getItemId(tar)
         }
      }
      return 0
   };

   context.getExpectedBlockAt = function(row,col) {
      var nbRowsCont = this.nbRowsCont;
      var nbColCont = this.nbColCont;
      var nbCol = this.nbCols + nbColCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);
      if(row < 1 || row > nbRows || col < 1 || col > nbCol){
         throw(strings.messages.wrongCoordinates);
      }
      var tar = this.target[row - 1][col - 1];
      // console.log( (tar > 1) ? tar : 0)
      var num = (tar > 1) ? tar : 0;
      return this.getItemId(num)
   };

   context.getTopBlock = function() {
      // console.log("[yo] getTopBlock")
      var col = this.cranePos;
      var topBlock = this.findTopBlock(col);
      if(!topBlock){
         return 0
      }
      return topBlock.id
   };

   context.getBlockAt = function(row,col) {
      var nbRowsCont = this.nbRowsCont;
      var nbColCont = this.nbColCont;
      var nbCol = this.nbCols + nbColCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);
      if(row < 1 || row > nbRows || col < 1 || col > nbCol){
         throw(strings.messages.wrongCoordinates);
      }
      var items = this.getItemsOn(row - 1, col - 1, obj => !obj.target);
      var id = (items.length == 0) ? 0 : items[0].id;
      if(id === undefined){
         // because only num < 50 (custom blocks) have id
         id = items[0].num;
      }
      return id
   };

   context.getCarriedBlock = function() {
      if(!this.craneContent){
         // console.log(0)
         return 0
      }
      // console.log(this.craneContent.num);
      var id = this.craneContent.id
      return id
   };

    context.getBlockType = function() {
      context.tool = 1;
      updateTool();
      var col = this.cranePos;
      var row = this.cranePosY;
      if(row > -1){
         return this.getBlockAt(row + 1,col + 1)
      }
      throw(strings.messages.impossibleToRead)
   };

   context.getDieValue = function() {
      if(context.dieValues){
         var currIndex = this.rollDieIndex%(this.dieValues.length);
         var val = this.dieValues[currIndex];
      }else{
         var val = this.dieValue;
      }
      return val
   };

   context.isTopBlockBroken = function() {
      // console.log("isTopBlockBroken")
      var col = this.cranePos;
      var topBlock = this.findTopBlock(col);
      if(!topBlock){
         return 0
      }
      return (topBlock.broken === true)
   };

   context.isCarriedBlockBroken = function() {
      if(!this.craneContent){
         // console.log(0)
         return false
      }
      return (this.craneContent.broken === true)
   };

   context.isBlockAtBroken = function(row,col) {
      var nbRowsCont = this.nbRowsCont;
      var nbColCont = this.nbColCont;
      var nbCol = this.nbCols + nbColCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);
      if(row < 1 || row > nbRows || col < 1 || col > nbCol){
         throw(strings.messages.wrongCoordinates);
      }
      var items = this.getItemsOn(row - 1, col - 1, obj => !obj.target);
      var broken = (items.length == 0) ? false : (items[0].broken === true);
      
      return broken
   };

   context.isOnMarker = function(markerID) {
      for(var mark of this.markers){
         if(mark.col == this.cranePos && mark.name == markerID){
            return true
         }
      }
      return false
   };

   context.findTopBlock = function(col) {
      // console.log("[yo] findTopBlock",col)
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
      // console.log("[yo]",itemsInCol,topBlock)
      return topBlock
   };

   context.findItemsInCol = function(col) {
      var itemsInCol = [];
      for(var item of context.items){
         if(item.col == col && !item.target && !item.isMask){
            itemsInCol.push(item);
         }
      }
      return itemsInCol
   };
   
   var itemAttributes = function(item) {
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var itemType = infos.itemTypes[item.type];

      if(item.num == 1){
         item.offsetX = 0;
         item.offsetY = 0;
         item.side = infos.cellSide;
      }
      
      var x0 = infos.leftMargin*scale;
      var x = x0 + (infos.cellSide * item.col + item.offsetX)* scale;
      var y0 = (infos.topMargin + markerH + infos.cellSide * craneH)*scale;
      var y = y0 + (infos.cellSide * item.row + item.offsetY) * scale;
      if(context.nbRows < nbRowsCont){
         y += infos.cellSide*(nbRowsCont - context.nbRows) * scale;
      }
      var w = item.width || item.side;
      var h = item.height || item.side;
      var ret = {x: x, y: y, width: w * item.nbStates * scale, height: h * scale/*, "clip-rect": clipRect*/};
      return ret;
   };

   function getCraneAttr() {
      var cSide = infos.cellSide;
      var w = cSide*scale, h = w;
      var y = (infos.topMargin + markerH)*scale;
      var cranePos = context.cranePos;
      var nbRowsCont = context.nbRowsCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var cranePosY = context.cranePosY;

      var craneOpacity = 1 - context.tool;
      var sensorOpacity = context.tool;

      var x = infos.leftMargin*scale + w*cranePos;
      var xWheels = x + wheelsOffsetX*scale;
      var yWheels = y + wheelsOffsetY*scale;

      var lineH = nbRows + craneH;
      var y0Line = y;
      var yLineClip1 = y + wheelsPosY*scale;
      var yLineClip2 = y + (shaftOffsetY + 2)*scale + (cranePosY + 1)*cSide*scale;
      var hClip = yLineClip2 - yLineClip1;
      var lineClip = [x,yLineClip1,w,hClip];

      var xShaft = x + shaftOffsetX*scale;
      var yShaft = y + shaftOffsetY*scale;

      var xLeftClaw = x + leftClawOffsetX*scale;
      var xRightClaw = x + rightClawOffsetX*scale;
      var yClaws = y + clawsOffsetY*scale;

      var cxLeft = x + leftClawCx*scale;
      var cyLeft = y + leftClawCy*scale;
      var cxRight = x + rightClawCx*scale;
      var cyRight = y + rightClawCy*scale;

      var xSensor = x + sensorOffsetX*scale;
      var ySensor = y + sensorOffsetY*scale + (cranePosY + 1)*cSide*scale;

      return { x, y, w, h, xWheels, yWheels, y0Line, lineClip, 
         xShaft, yShaft, yClaws, xLeftClaw, xRightClaw, 
         cxLeft, cyLeft, cxRight, cyRight, xSensor, ySensor, craneOpacity, sensorOpacity }
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
         height: shaftH*scale,
         opacity: attr.craneOpacity
      })
      crane.leftClaw.attr({ 
         x: attr.xLeftClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale,
         opacity: attr.craneOpacity
      });
      crane.rightClaw.attr({ 
         x: attr.xRightClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale,
         opacity: attr.craneOpacity
      });
      crane.sensor.attr({ 
         x: attr.xSensor, 
         y: attr.ySensor, 
         width: sensorW*scale, 
         height: sensorH*scale,
         opacity: attr.sensorOpacity
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

   function updateTool() {
      var craneOpacity = 1 - context.tool;
      var sensorOpacity = context.tool;
      crane.shaft.attr({
         opacity: craneOpacity
      })
      crane.leftClaw.attr({ 
         opacity: craneOpacity
      });
      crane.rightClaw.attr({ 
         opacity: craneOpacity
      });
      crane.sensor.attr({ 
         opacity: sensorOpacity
      });
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
               if(!infos.labelFrameAttr){
                  rowsLabels[iRow] = paper.text(0, 0, (iRow + 1));
               }else{
                  var frame = paper.rect(0,0,0,0).attr(infos.labelFrameAttr);
                  var text = paper.text(0, 0, (iRow + 1));
                  rowsLabels[iRow] = [frame,text];
               }
            }
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            if(!infos.labelFrameAttr){
               colsLabels[iCol] = paper.text(0, 0, (iCol + 1));
            }else{
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

      $("#dust_pix").remove();
      $("body").append("<img src="+dustSrc+" style='width:1px;' id='dust_pix' />");
   };

   function resetCrane() {
      // console.log("resetCrane")
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var src = infos.craneSrc;
      crane.rail = paper.set();
      for(var iCol = 0; iCol < nbCol; iCol++){
         crane.rail.push(paper.image(getImgPath(src.rail),0,0,0,0));
      }
      paper.setStart();
      crane.wheels = paper.image(getImgPath(src.wheels),0,0,0,0);
      var lineH = nbRows + craneH;
      crane.line = paper.set();
      for(var iRow = 0; iRow < lineH; iRow++){
         crane.line.push(paper.image(getImgPath(src.line),0,0,0,0));
      }
      crane.leftClaw = paper.image(getImgPath(src.leftClaw),0,0,0,0);
      crane.rightClaw = paper.image(getImgPath(src.rightClaw),0,0,0,0);
      crane.shaft = paper.image(getImgPath(src.shaft),0,0,0,0);
      crane.sensor = paper.image(getImgPath(src.sensor),0,0,0,0);
      crane.all = paper.setFinish();

      if(context.craneContent){
         redisplayItem(context.craneContent)
      }
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
         if(!item[property]){
            item[property] = infos.itemTypes[item.type][property];
         }
      }
      if(initItem.type == "mask" && infos.windowMaskSrc){
         item.img = infos.windowMaskSrc;
         item.width = context.nbCols*60;
         item.height = context.nbRows*60;
         item.offsetY = 0;
         item.offsetX = 0;
      }
      if(item.type == "die"){
         if(!context.dieValue && !context.dieValues){
            context.dieValue = context.rng.nextInt(1,6);
         }
      }

      if(context.display && redisplay) {
         redisplayItem(item,false);
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
            var itemData = context.getItemData(context.tiles[iRow][iCol]);
            var itemTypeNum = itemData.num;

            var broken = (context.broken.length > 0) ? (context.broken[iRow][iCol] == 1) : false;
            var hidden = (context.hidden.length > 0) ? (context.hidden[iRow][iCol] == 1) : false;
            if(itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow + rowShift,
                  col: iCol + nbColCont,
                  type: itemTypeByNum[itemTypeNum],
                  imgId: itemData.imgId,
                  deco: itemData.deco, 
                  broken, hidden
               }, false);
            }
            var targetData = context.getItemData(context.target[iRow][iCol]);
            var targetHidden = (context.targetHidden.length > 0) ? context.targetHidden[iRow][iCol] : 0;
            var targetNum = targetData.num;

            if(itemTypeByNum[targetNum] != undefined) {
               resetItem({
                  row: iRow + rowShift,
                  col: iCol + nbColCont,
                  type: itemTypeByNum[targetNum],
                  imgId: targetData.imgId,
                  deco: targetData.deco, 
                  hidden: targetHidden,
                  target: true
               }, false);
            }
         }
      }

      /** container **/
      var cRowShift = (context.nbRows <= nbRowsCont) ? 0 : (context.nbRows - nbRowsCont);
      for(var iRow = 0;iRow < nbRowsCont;iRow++) {
         for(var iCol = 0;iCol < nbColCont;iCol++) {
            var itemTypeNum = context.container[iRow][iCol];
            if(itemTypeByNum[itemTypeNum] != undefined) {
               resetItem({
                  row: iRow + cRowShift,
                  col: iCol,
                  type: itemTypeByNum[itemTypeNum]
               }, false);
            }
            if(context.target.length == 0){
               continue
            }
         }
      }

      /** mask **/
      if(infos.windowMaskSrc){
         resetItem({
            row: rowShift,
            col: 0,
            type: "mask"
         }, false);
      }else{
         for(var iRow = 0; iRow < context.mask.length;iRow++) {
            for(var iCol = 0; iCol < context.mask[0].length;iCol++) {
               if(context.mask[iRow][iCol]){
                  resetItem({
                     row: iRow + rowShift,
                     col: iCol,
                     type: "mask"
                  }, false);
               }
            }
         }
      }
      /** initItems **/
      for(var iItem = context.initItems.length - 1;iItem >= 0;iItem--) {
         resetItem(context.initItems[iItem], false);
      }

      /** crane content **/
      if(context.initCraneContent != undefined){
         resetItem({
            row: 0,
            col: context.initCranePos,
            type: itemTypeByNum[context.initCraneContent]
         }, false);
         var it = context.getItemsOn(0,context.initCranePos, obj => !obj.target);
         context.setIndexes();
         context.items.splice(it[0].index, 1);
         context.craneContent = it[0];
      }
      
      if(context.display){
         redisplayAllItems();
      }
   };

   context.getItemData = function(val) {
      if(!isNaN(val)){
         var num = val;
         var imgId = "a";
         var deco = null;
      }else if(typeof val == "string"){
         var match = val.match(/(\d+)([a-z])(\d)?/);
         var num = match[1];
         var imgId = match[2];
         var deco = match[3];
      }
      
      return { num, imgId, deco }
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
         var areaHeight = Math.max(150, $('#grid').height()/*-24*/);
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
         var markerHeightAsRows = markerH / cSide;
         newCellSide = Math.min(cSide*2, Math.min(areaWidth / (nbCol + marginAsCols), areaHeight / (nbRows + craneH + markerHeightAsRows + marginAsRows)));
      }
      scale = newCellSide / cSide;
      context.scale = scale;
      var paperWidth = (cSide * nbCol + infos.leftMargin + infos.rightMargin)* scale;
      var paperHeight = (cSide * (nbRows + craneH + markerHeightAsRows) + infos.topMargin + infos.bottomMargin)* scale;
      paper.setSize(paperWidth, paperHeight);
      // console.log("[yo",infos.bottomMargin)
      var x0 = infos.leftMargin*scale;
      var y0 = (infos.topMargin + craneH*cSide + markerH)*scale;

      if(infos.backgroundElements && infos.backgroundElements.length > 0){
         var bgElem = infos.backgroundElements;
         var gridWidth = nbCol*cSide*scale;
         var gridHeight = nbRows*cSide*scale;
         var clipRect = [x0,y0,gridWidth,gridHeight];
         backgroundObj = paper.set();
         for(var iElem = 0; iElem < bgElem.length; iElem++){
            var dat = bgElem[iElem];
            var obj = context.background[iElem];
            var x = dat.x*paperWidth;
            var y = dat.y*paperHeight;
            var width = (dat.relative) ? dat.width*paperWidth : dat.width*scale;
            var height = (dat.relative) ? dat.height*paperHeight : dat.height*scale;
            obj.attr({ x, y, width, height });
            backgroundObj.push(obj);
         }
      }

      for(var iRow = 0;iRow < nbRows;iRow++) {
         for(var iCol = 0;iCol < nbCol;iCol++) {
            if(cells[iRow][iCol] === undefined)
               continue;
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
               var y = (cSide * (iRow + 0.5 + craneH) + infos.topMargin + markerH) * scale;
               if(!infos.labelFrameAttr){
                  rowsLabels[iRow].attr({x: x, y: y}).attr(labelAttr);
               }else{
                  var frSize = infos.labelFrameSize*cSide*scale;
                  var labelSize = infos.labelSize*cSide*scale;
                  var xFr = x - frSize/2;
                  var yFr = y - frSize/2;
                  var yLabel = yFr + frSize/2;
                  rowsLabels[iRow][0].attr({x: xFr, y: yFr, width: frSize, height: frSize});
                  rowsLabels[iRow][1].attr({x, y, "font-size": labelSize}).attr(labelAttr);
               }
            }
         }
         for(var iCol = 0;iCol < context.nbCols;iCol++) {
            var x = (cSide * (iCol + nbColCont) + infos.leftMargin + cSide / 2) * scale;
            var y = (infos.topMargin + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin + markerH) * scale;
            // console.log("[yo",y)
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
            var y = (infos.topMargin + markerH + cSide*(nbRows + craneH - 0.5) + infos.bottomMargin) * scale;
            contLabels[iCol].attr({x: x, y: y}).attr(labelAttr);
         }
      }
      // console.log("updateScale")
      redisplayAllItems();    
      redisplayMarkers();  

      /* crane */
      var w = cSide*scale, h = w;
      var y = (infos.topMargin + markerH)*scale;
      for(var iCol = 0; iCol < nbCol; iCol++){
         var x = (cSide*iCol + infos.leftMargin)*scale;
         crane.rail[iCol].attr({ x, y, 
            width: w, height: h
         });
      }
      var craneAttr = getCraneAttr();
      setCraneAttr(craneAttr);

      /* highlights */
      if(this.highlights.length > 0){
         for(var dat of this.highlights){
            var { row, col, obj } = dat;
            var width = cSide*scale, height = w;
            var { x, y } = this.getCellCoord(row,col);
            obj.attr({ x, y, width, height });
         }
      }

      /* success anims */
      if(this.successAnimObj.length > 0){
         for(var dat of this.successAnimObj){
            var { row, col, width, height, obj } = dat;
            var w = cSide*width*scale, h = cSide*height*scale;
            var { x, y } = this.getCellCoord(row,col);
            obj.attr({ x, y, width: w, height: h });
            // console.log("[yo",x,y,w,h)
         }
      }
   };

   var redisplayItem = function(item, resetZOrder) {
      if(context.display !== true){
         return
      }
      if(resetZOrder === undefined){
         resetZOrder = true;
      }
      
      if(item.element !== undefined) {
         item.element.remove();
      }
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var itemType = infos.itemTypes[item.type];

      var x0 = infos.leftMargin*scale;
      var x = x0 + (infos.cellSide * item.col + item.offsetX)* scale;
      var y0 = (infos.topMargin + infos.cellSide * craneH)*scale;
      var y = y0 + (infos.cellSide * item.row + /*(item.side - infos.cellSide) +*/ item.offsetY) * scale;
      if(context.nbRows < nbRowsCont){
         y += infos.cellSide*(nbRowsCont - context.nbRows) * scale;
      }

      if(item.customDisplay !== undefined) {
         item.customDisplay(item,context);
      }
      if((infos.customItems) && (item.num < 90)){
         Object.assign(item,context.customItems[item.num]);
      }
      if(item.img) {
         if(item.target && item.targetImg){
            var srcObj = item.targetImg;
         }else if(item.broken && item.brokenImg){
            var srcObj = item.brokenImg;
         }else if(item.hidden && item.hiddenImg){
            var srcObj = item.hiddenImg;
         }else{
            var srcObj = item.img;
         }
         if(typeof srcObj != "object"){
            var src = getImgPath(srcObj);
         }else{
            var imgId = item.imgId;
            var src = getImgPath(srcObj[imgId]);
         }
         if((infos.customItems) && (item.num < 90)){
            var fileName = src.match(/^.+\/(\w+\.png)$/)[1];
            var newSrc = "assets/png/"+fileName;
            src = newSrc;
         }
         var w = item.width || item.side;
         var h = item.height || item.side;
         item.element = paper.image(src, x, y, w * scale, h * scale);
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
      // console.log(cellItems)
      
      for(var iItem = 0;iItem < context.multicell_items.length;iItem++) {
         var item = context.multicell_items[iItem];
         cellItems.push(item);
      }
      sortCellItems(cellItems);
   };

   var redisplayMarkers = function() {
      // console.log("[crane] redisplayMarkers")
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var cSide = infos.cellSide;
      var mSide = markerRectSide;
      var attr = markerAttr;
      var textFontSize = { "font-size": markerTextSize * scale };

      var x0 = infos.leftMargin*scale;
      var y0 = infos.topMargin*scale;
      var yText = y0 + mSide*scale/2;
      for(var iMark = 0; iMark < context.markers.length; iMark++){
         var marker = context.markers[iMark];
         var col = marker.col;
         var name = marker.name;
         var x = x0 + (cSide * (col + 0.5))* scale;
         var xRect = x - (mSide/2)*scale;
         var yLine1 = y0 + mSide*scale - 2;
         var yLine2 = yLine1 + markerPoleH*scale;
         if(marker.element){
            marker.element.remove();
         }
         var rect = paper.rect(xRect,y0,mSide*scale,mSide*scale).attr(attr.rect);
         var text = paper.text(x,yText,name).attr(attr.text).attr(textFontSize);
         var pole = paper.path(["M",x,yLine1,"V",yLine2]).attr(attr.pole).toBack();
         var bRect = paper.rect(xRect + 3,y0 - 3,mSide*scale,mSide*scale).attr(attr.backRect).toBack().hide();
         marker.element = paper.set(rect,text,pole,bRect);
         // console.log("[yo]",iMark,col,name,marker.element)

         for(var jMark = 0; jMark < context.markers.length; jMark++){
            if(iMark != jMark && col == context.markers[jMark].col){
               marker.element[3].show();
               break;
            }
         }

      }
      if(backgroundObj){
         for(var iElem = backgroundObj.length - 1; iElem >= 0; iElem--){
            backgroundObj[iElem].toBack();
         }
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
      }
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
   };

   context.getItemId = function(num) {
      for(var type in infos.itemTypes) {
         var item = infos.itemTypes[type];
         if(item.num == num){
            if(item.id != undefined){
               return item.id
            }
            return item.num
         }
      }
      return null
   };
   
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

   context.getItemsPos = function(num,imgId) {
      var selected = [];
      for(var id in context.items) {
         var item = context.items[id];
         if(item.num == num && item.imgId == imgId && !item.target && !item.broken) {
            let { row, col} = item;
            if(context.target[row][col] != num){
               selected.push({ row, col });
            }
         }
      }
      return selected;
   };
   
   // context.isOn = function(filter) {
   //    var item = context.getRobot();
   //    return context.hasOn(item.row, item.col, filter);
   // };
   
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
         context.moveCrane(context.cranePos + dir/2)
         throw ttg;
      }
   };

   context.shiftCraneY = function(dir,callback) {
      var newPosY = context.cranePosY + dir;
      var ttg = context.tryToGoY(newPosY);
      if(ttg === true){
         context.tool = 1;
         context.moveCraneY(newPosY, callback);
      }else if(ttg == false){
         context.waitDelay(callback);
      }else{
         // context.moveCraneY(context.cranePosY + dir/2)
         throw ttg;
      }
   };

   context.goToMarker = function(value,callback) {
      var newCol;
      for(var iMark = 0; iMark < this.markers.length; iMark++){
         if(this.markers[iMark].name == value){
            newCol = this.markers[iMark].col;
         }
      }
      if(newCol === undefined){
         throw strings.messages.noMarker(value);
      }
      if(context.display){
         for(var marker of this.markers){
            if(marker.name == value){
               marker.element[0].toFront();
               marker.element[1].toFront();
            }
         }
      }
      this.moveCrane(newCol, callback);
   };

   context.take = function(callback) {
      var topBlock = takeIntro();
      takeAnimDelay = 0.5*infos.actionDelay;
      
      if(context.display) {
         resetCraneZOrder();
         if(context.animate && infos.actionDelay > 0){
            context.takeAnim(topBlock);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
         }
      }

      // context.advanceTime(1);
      if(callback){
         var delay = 2*takeAnimDelay*(topBlock.row + 1) + infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   function takeIntro() {
      if(context.craneContent != undefined){
         throw(context.strings.messages.holdingBlock);
      }
      context.tool = 0;
      if(context.display){
         updateTool();
      }
      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);
      if(!topBlock || topBlock.num == 1){
         if(!context.display){
            throw(context.strings.messages.nothingToTake);
         }
         topBlock.row = topBlock.row - 1;
         callback = null;
      }
      if(!topBlock.isMovable && topBlock.num != 1){
         throw(context.strings.messages.notMovable);
      }

      if(topBlock.num != 1){
         var withdrawables = context.getItemsOn(topBlock.row, topBlock.col, obj=>!obj.target && !obj.isMask );

         var withdrawable = withdrawables[0];

         context.setIndexes();
         context.items.splice(withdrawable.index, 1);
         context.craneContent = withdrawable;
      }
      return topBlock
   };

   context.takeAnim = function(topBlock) {
      this.takeAnimDown(topBlock,function() {
         if(topBlock.num == 1){
            return
         }
         context.takeAnimUp(topBlock,-1);
      })
   };

   context.takeAnimDown = function(topBlock,callback) {
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(topBlock.row + 1);
      // console.log(takeAnimDelay)
      var aDelay = infos.actionDelay;
      var itemAttr = itemAttributes(topBlock);
      maskToFront();

      var catchOffsetY = topBlock.catchOffsetY || 0;
      var yClawDown = itemAttr.y - craneItemOffset*scale + catchOffsetY*scale;
      var deltaY = yClawDown - craneAttr.yClaws;
      var yShaftDown = craneAttr.yShaft + deltaY;
      var lineClipDown = Beav.Object.clone(craneAttr.lineClip);
      lineClipDown[3] = craneAttr.lineClip[3] + deltaY;
      var cyLeftDown = craneAttr.cyLeft + deltaY;
      var cyRightDown = craneAttr.cyRight + deltaY;

      var animLineDown = new Raphael.animation({ "clip-rect": lineClipDown },delay);
      var animClawDown = new Raphael.animation({ y: yClawDown },delay);
      var animShaftDown = new Raphael.animation({ y: yShaftDown },delay,function() {
         var soundName = (topBlock.type == "wreckingBall") ? "wreckingBall_grab" : "brick_grab";
         context.addSound(soundName);
         context.raphaelFactory.animate("animCrane_close_rightClaw_" + Math.random(), crane.rightClaw, animCloseRightClaw);
         context.raphaelFactory.animate("animCrane_close_leftClaw_" + Math.random(), crane.leftClaw, animCloseLeftClaw);
         
      });
      var animCloseRightClaw = new Raphael.animation({ transform: ["R",clutchAngle,craneAttr.cxRight,cyRightDown] },aDelay);
      var animCloseLeftClaw = new Raphael.animation({ transform: ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown] },aDelay,callback);

      context.raphaelFactory.animate("animCrane_line_down_" + Math.random(), crane.line, animLineDown);
      context.raphaelFactory.animate("animCrane_rightClaw_down" + Math.random(), crane.rightClaw, animClawDown);
      context.raphaelFactory.animate("animCrane_leftClaw_down_" + Math.random(), crane.leftClaw, animClawDown);
      context.raphaelFactory.animate("animCrane_shaft_down_" + Math.random(), crane.shaft, animShaftDown);
   };

   context.takeAnimUp = function(topBlock,newRow,callback) {
      /* newRow is relative to default crane pos (-1) */
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(topBlock.row - newRow);
      var cSide = infos.cellSide;

      var catchOffsetY = topBlock.catchOffsetY || 0;

      var deltaY = (newRow + 1)*cSide*scale;
      var newItemY = (infos.topMargin + clawsOffsetY + craneItemOffset - catchOffsetY + topBlock.offsetY + markerH)*scale + deltaY;
      var newLineClip = Beav.Object.clone(craneAttr.lineClip);
      newLineClip[3] = craneAttr.lineClip[3] + deltaY;
      var newYShaft = craneAttr.yShaft + deltaY;
      var newYClaws = craneAttr.yClaws + deltaY;
      var newCyRight = craneAttr.cyRight + deltaY;
      var newCyLeft = craneAttr.cyLeft + deltaY;

      var animLineUp = new Raphael.animation({ "clip-rect": newLineClip },delay);
      var animShaftUp = new Raphael.animation({ y: newYShaft },delay);
      var animRightClawUp = new Raphael.animation({ y: newYClaws, transform: ["R",clutchAngle,craneAttr.cxRight,newCyRight] },delay);
      var animLeftClawUp = new Raphael.animation({ y: newYClaws, transform: ["R",-clutchAngle,craneAttr.cxLeft,newCyLeft] },delay);
      var animItemUp = new Raphael.animation({ y: newItemY },delay,callback);
      context.raphaelFactory.animate("animCrane_line_up_" + Math.random(), crane.line, animLineUp);
      context.raphaelFactory.animate("animCrane_shaft_up_" + Math.random(), crane.shaft, animShaftUp);
      context.raphaelFactory.animate("animCrane_rightClaw_up" + Math.random(), crane.rightClaw, animRightClawUp);
      context.raphaelFactory.animate("animCrane_leftClaw_up" + Math.random(), crane.leftClaw, animLeftClawUp);
      context.raphaelFactory.animate("animCrane_item_up" + Math.random(), topBlock.element, animItemUp);
   };

   context.takeAndFlip = function(callback) {
      var topBlock = takeIntro();
      takeAnimDelay = 0.5*infos.actionDelay*10;
      if(topBlock != 1){
         topBlock.hidden = !topBlock.hidden;
      }
      if(context.display) {
         resetCraneZOrder();
         if(context.animate && infos.actionDelay > 0){
            context.takeAndFlipAnim(topBlock);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
            putDownIntro();
            redisplayItem(topBlock);
         }
      }else{
         putDownIntro();
      }

      // context.advanceTime(1);
      if(callback){
         var delay = 2*takeAnimDelay*(topBlock.row + 1 + 2 + 2) + 2*infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   context.takeAndFlipAnim = function(topBlock) {
      this.takeAnimDown(topBlock,function() {
         if(topBlock.num == 1){
            return
         }
         context.takeAnimUp(topBlock,topBlock.row - 1,function() {
            // var currY = topBlock.element.attr("y");
            // redisplayItem(topBlock);
            // topBlock.element.attr("y",currY);
            context.flipAnim(topBlock, function() {
               var tempItem = putDownIntro();
               context.putDownAnimDown(tempItem,topBlock.row - 1, function() {
                  context.putDownAnimUp(topBlock.row);
               });
            })
            
         });
      })
   };

   context.flipAnim = function(item,callback) {
      var craneAttr = getCraneAttr();
      var itemAttr = itemAttributes(item);
      var w = itemAttr.width;
      var h = itemAttr.height;
      var x = itemAttr.x;
      var y = item.element.attr("y");

      var cSide = infos.cellSide;
      var deltaY = (item.row)*cSide*scale;

      var cyLeftDown = craneAttr.cyLeft + deltaY;
      var cyRightDown = craneAttr.cyRight + deltaY;
      var cx = x + w/2;
      var delay = takeAnimDelay;
      var anim1 = new Raphael.animation({ "transform": ["S",0,1,cx,y] },delay,function(){
         redisplayItem(item,true);
         item.element.attr({ y, transform: ["S",0,1,cx,y] });
         resetCraneZOrder();

         context.raphaelFactory.animate("animFlip2_" + Math.random(), item.element, anim2);
         context.raphaelFactory.animate("animFlip2_clawR" + Math.random(), crane.rightClaw, anim2ClawR);
         context.raphaelFactory.animate("animFlip2_clawL" + Math.random(), crane.leftClaw, anim2ClawL);
      });
      var anim2 = new Raphael.animation({ "transform": ["S",1,1,cx,y] },delay,callback);
      var anim2ClawR = new Raphael.animation({ "transform": ["R",clutchAngle,craneAttr.cxRight,cyRightDown,"S",1,1,cx,y] },delay);
      var anim2ClawL = new Raphael.animation({ "transform": ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown,"S",1,1,cx,y] },delay);

      context.raphaelFactory.animate("animFlip1_item" + Math.random(), item.element, anim1);
      context.raphaelFactory.animate("animFlip1_clawR" + Math.random(), crane.rightClaw, anim1);
      context.raphaelFactory.animate("animFlip1_clawL" + Math.random(), crane.leftClaw, anim1);
   };

   // context.moveUpAndTake = function(callback) {
   //    if(!context.display){
   //       this.cranePosY = -1;
   //       context.take(callback);
   //    }else{
   //       var currY = context.cranePosY;
   //       var delayUp = infos.actionDelay*Math.abs(currY + 1);
   //       var currPos = context.cranePos;
   //       var topBlock = context.findTopBlock(currPos);
   //       var delayTake = 0;
   //       if(!topBlock || topBlock.num == 1){
            
   //       }else if(!topBlock.isMovable && topBlock.num != 1){

   //       }else{
   //          delayTake += infos.actionDelay*(topBlock.row + 2);
   //       }
   //       this.moveCraneY(-1);
   //       this.delayFactory.createTimeout("moveUpAndTake_" + Math.random(), function() {
   //          context.take();
   //       }, delayUp);
   //       context.waitDelay(callback,null,delayUp + delayTake);
   //    }
   // };

   context.putDown = function(callback) {
      var tempItem = putDownIntro();
      takeAnimDelay = 0.5*infos.actionDelay;
      if(context.display) {
         if(context.animate && infos.actionDelay > 0){
            context.putDownAnim(tempItem,-1);
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            redisplayItem(tempItem,false);
         }
      }
      if(!context.display || !context.animate || infos.actionDelay == 0){
         context.crush();
      }

      if(callback){
         var delay = 2*takeAnimDelay*(tempItem.row + 1) + infos.actionDelay;
         context.waitDelay(callback, null, delay);
      }
   };

   function putDownIntro() {
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
      return tempItem
   };

   context.putDownAnim = function(item,currRow) {
      this.putDownAnimDown(item,currRow, function() {
         context.putDownAnimUp(item.row);
      });
   };

   context.putDownAnimDown = function(item,currRow,callback) {
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(item.row - currRow);
      var cSide = infos.cellSide;
      var itemAttr = itemAttributes(item);
      maskToFront();

      var catchOffsetY = item.catchOffsetY || 0;
      var yClawDown = itemAttr.y - craneItemOffset*scale + catchOffsetY*scale;
      var deltaY = yClawDown - craneAttr.yClaws;
      var yShaftDown = craneAttr.yShaft + deltaY;
      var lineClipDown = Beav.Object.clone(craneAttr.lineClip);
      lineClipDown[3] = craneAttr.lineClip[3] + deltaY;
      var cyLeftDown = craneAttr.cyLeft + deltaY;
      var cyRightDown = craneAttr.cyRight + deltaY;
      var dustY = itemAttr.y + itemAttr.height - dustH*scale/2;
      var dustX = itemAttr.x + (itemAttr.width - dustW*scale)/2;

      var animLineDown = new Raphael.animation({ "clip-rect": lineClipDown },delay);
      var animShaftDown = new Raphael.animation({ y: yShaftDown },delay);
      var animRightClawDown = new Raphael.animation({ y: yClawDown, transform: ["R",clutchAngle,craneAttr.cxRight,cyRightDown] },delay);
      var animLeftClawDown = new Raphael.animation({ y: yClawDown, transform: ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown] },delay);
      var animItemDown = new Raphael.animation({ y: itemAttr.y },delay,function() {
         context.raphaelFactory.animate("animCrane_open_rightClaw_" + Math.random(), crane.rightClaw, animOpenRightClaw);
         context.raphaelFactory.animate("animCrane_open_leftClaw_" + Math.random(), crane.leftClaw, animOpenLeftClaw);
         context.addSound("brick_putDown");
         context.crush();
         if(dust){
            dust.remove();
            dust = null;
            context.delayFactory.destroy("removeDust");
         }
         dust = paper.image(dustSrc,dustX,dustY,dustW*scale,dustH*scale);
         $("#dust_pix").attr("src",dustSrc);
         context.delayFactory.createTimeout("removeDust", function() {
            if(dust){
               dust.remove();
               dust = null;
            }
         }, dustDuration);

      });
      var animOpenRightClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxRight,cyRightDown] },infos.actionDelay);
      var animOpenLeftClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxLeft,cyLeftDown] },infos.actionDelay,callback);

      context.raphaelFactory.animate("animCrane_line_down_" + Math.random(), crane.line, animLineDown);
      context.raphaelFactory.animate("animCrane_shaft_down_" + Math.random(), crane.shaft, animShaftDown);
      context.raphaelFactory.animate("animCrane_rightClaw_down" + Math.random(), crane.rightClaw, animRightClawDown);
      context.raphaelFactory.animate("animCrane_leftClaw_down_" + Math.random(), crane.leftClaw, animLeftClawDown);
      context.raphaelFactory.animate("animCrane_item_down" + Math.random(), item.element, animItemDown);
   };

   context.putDownAnimUp = function(row,callback) {
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(row + 1);
      // console.log(takeAnimDelay)
      maskToFront();

      var animLineUp = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay);
      var animShaftUp = new Raphael.animation({ y: craneAttr.yShaft },delay);
      var animRightClawUp = new Raphael.animation({ y: craneAttr.yClaws },delay);
      var animLeftClawUp = new Raphael.animation({ y: craneAttr.yClaws },delay,callback);

      context.raphaelFactory.animate("animCrane_line_up_" + Math.random(), crane.line, animLineUp);
      context.raphaelFactory.animate("animCrane_shaft_up_" + Math.random(), crane.shaft, animShaftUp);
      context.raphaelFactory.animate("animCrane_rightClaw_up" + Math.random(), crane.rightClaw, animRightClawUp);
      context.raphaelFactory.animate("animCrane_leftClaw_up" + Math.random(), crane.leftClaw, animLeftClawUp);
   };

   context.drop = function(callback) {
      // console.log("drop",context.craneContent)
      if(context.craneContent == undefined){
         throw(context.strings.messages.emptyCrane);
      }
      if(!context.craneContent.wrecking && !context.craneContent.isDie){
         throw(context.strings.messages.notWrecking);
      }

      takeAnimDelay = 0.5*infos.actionDelay;

      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);
      var newRow = (topBlock.num == 1 || context.craneContent.isDie) ? topBlock.row - 1 : topBlock.row;
      var newCol = currPos;
      context.craneContent.row = newRow;
      context.craneContent.col = newCol;
      var tempItem = context.craneContent;
      context.items.push(tempItem);
      context.setIndexes();
      context.craneContent = undefined;
      
      if(context.display) {
         if(context.animate && infos.actionDelay > 0){
            context.dropAnim(tempItem,topBlock,callback);
         }else{
            if(tempItem.isDie){
               rollDie(tempItem);
            }
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            redisplayItem(tempItem,false);
         }
      }else{
         rollDie(tempItem);
      }
      if(!context.display || !context.animate || infos.actionDelay == 0){
         if(topBlock.num > 1 && !context.craneContent.isDie){
            context.destroy(topBlock);
         }
      }

      if(callback/* && (!context.display || !context.animate)*/){
         var delay = 2*takeAnimDelay*(tempItem.row + 1);
         context.waitDelay(callback,null,delay);
      }
   };

   context.crush = function() {
      if(this.crushers.length == 0){
         return
      }
      var nbRowsCont = this.nbRowsCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);
      for(var item of this.items){
         if(!item.target){
            var { row, col } = item;
            if(row < nbRows - 1){
               for(var crusher of this.crushers){
                  if(crusher.col == col && crusher.row == row + 1){
                     this.destroy(item);
                     this.addSound("brick_crush");
                     return
                  }
               }
            }
         }
      }
   };

   context.dropAnim = function(item,topBlock,callback) {
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(item.row + 1);
      var itemAttr = itemAttributes(item);
      maskToFront();

      var dustY = itemAttr.y + itemAttr.height - dustH*scale/2;
      var dustX = itemAttr.x + (itemAttr.width - dustW*scale)/2;
      
      var animOpenRightClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxRight,craneAttr.cyRight] },infos.actionDelay);
      var animOpenLeftClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxLeft,craneAttr.cyLeft] },infos.actionDelay);
      var animItemDown = new Raphael.animation({ y: itemAttr.y },delay,"<",function() {
         if(topBlock && topBlock.num > 1 && !item.isDie){
            context.destroy(topBlock);
            var soundName = "wreckingBall_destroy";
         }else{
            var soundName = "wreckingBall_drop";
         }
         if(dust){
            dust.remove();
            dust = null;
         }
         dust = paper.image(dustSrc,dustX,dustY,dustW*scale,dustH*scale);
         $("#dust_pix").attr("src",dustSrc);

         context.delayFactory.createTimeout("removeDust_" + Math.random(), function() {
            if(dust){
               dust.remove();
               dust = null;
            }
         }, dustDuration);
         context.addSound(soundName);

         if(item.isDie){
            rollDie(item);
         }
         // if(callback){
         //    context.waitDelay(callback);
         // }
      });
      // context.addSound("wreckingBall_fall");
      context.raphaelFactory.animate("animCrane_open_rightClaw_" + Math.random(), crane.rightClaw, animOpenRightClaw);
      context.raphaelFactory.animate("animCrane_open_leftClaw_" + Math.random(), crane.leftClaw, animOpenLeftClaw);
      context.raphaelFactory.animate("animCrane_item_down" + Math.random(), item.element, animItemDown);
   };

   function rollDie(item) {
      if(context.dieValues){
         context.rollDieIndex++;
      }else{
         context.dieValue = context.rng.nextInt(1,6);
      }
      redisplayItem(item);
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

   context.tryToGoY = function(row) {
      // Returns whether the crane can move to row
      // true : yes, false : no but move ignored, string : no and throw error
      // var nbRowsCont = context.nbRowsCont;
      if(context.craneContent){
         return context.strings.messages.holdingBlock_sensor;
      }

      if(row < -1 || row >= context.nbRows) {
         if(infos.ignoreInvalidMoves)
            return false;
         return strings.messages.yLimit(row < -1);
      }
      return true;
   };

   context.moveCrane = function(newCol, callback) {
      var animate = (context.cranePos != newCol);
      
      var oldPos = context.cranePos;
      // context.cranePos = Math.floor(newCol);
      context.cranePos = newCol;
      
      if(context.display) {
         var craneAttr = getCraneAttr();
         if(infos.actionDelay > 0) {
            var delay = infos.actionDelay*Math.abs(newCol - oldPos);
            if(animate && context.animate) {
               var anim = new Raphael.animation({ x: craneAttr.xWheels },delay,function() {
                  context.addSound("crane_stop");
                  if(callback){
                     // context.callCallback(callback);
                     // context.waitDelay(callback);
                  }
               });
               var animLine = new Raphael.animation({ x: craneAttr.x, "clip-rect": craneAttr.lineClip },delay);
               var animShaft = new Raphael.animation({ x: craneAttr.xShaft },delay);
               var animSensor = new Raphael.animation({ x: craneAttr.xSensor },delay);
               var angle = (context.craneContent) ? clutchAngle : 0;
               var animLeftClaw = new Raphael.animation({ x: craneAttr.xLeftClaw, transform: ["R",-angle,craneAttr.cxLeft,craneAttr.cyLeft] },delay);
               var animRightClaw = new Raphael.animation({ x: craneAttr.xRightClaw, transform: ["R",angle,craneAttr.cxRight,craneAttr.cyRight] },delay);
               // context.addSound("crane_move");     
               context.raphaelFactory.animate("animCrane_wheels_" + Math.random(), crane.wheels, anim);
               context.raphaelFactory.animate("animCrane_line_" + Math.random(), crane.line, animLine);
               context.raphaelFactory.animate("animCrane_shaft_" + Math.random(), crane.shaft, animShaft);
               context.raphaelFactory.animate("animCrane_sensor_" + Math.random(), crane.sensor, animSensor);
               context.raphaelFactory.animate("animCrane_leftClaw_" + Math.random(), crane.leftClaw, animLeftClaw);
               context.raphaelFactory.animate("animCrane_rightClaw_" + Math.random(), crane.rightClaw, animRightClaw);
               if(context.craneContent){
                  var item = context.craneContent;
                  var animItem = new Raphael.animation({ x: craneAttr.x + item.offsetX },delay);
                  context.raphaelFactory.animate("animCrane_item_" + Math.random(), item.element, animItem);
               }
            } else {
               context.delayFactory.createTimeout("moveCrane_" + Math.random(), function() {
                  setCraneAttr(craneAttr);
               }, delay / 2);
            }
         } else {
            setCraneAttr(craneAttr);
         }
         $("#nbMoves").html(context.nbMoves);
      }
      
      // context.advanceTime(1);
      if(callback){
         context.waitDelay(callback, null, delay);
      }
   };

   context.moveCraneY = function(newRow, callback) {
      var animate = (context.cranePosY != newRow);
      
      var oldPos = context.cranePosY;
      context.cranePosY = newRow;
      
      if(context.display) {
         var craneAttr = getCraneAttr();
         if(infos.actionDelay > 0) {
            updateTool();
            var delay = infos.actionDelay*Math.abs(newRow - oldPos);
            if(animate && context.animate) {
               var animLine = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay);
               var animSensor = new Raphael.animation({ y: craneAttr.ySensor },delay);
              
               context.raphaelFactory.animate("animCrane_line_" + Math.random(), crane.line, animLine);
               context.raphaelFactory.animate("animCrane_shaft_" + Math.random(), crane.sensor, animSensor);
            } else {
               context.delayFactory.createTimeout("moveCrane_" + Math.random(), function() {
                  setCraneAttr(craneAttr);
               }, delay / 2);
            }
         } else {
            setCraneAttr(craneAttr);
         }
         $("#nbMoves").html(context.nbMoves);
      }
      
      // context.advanceTime(1);
      if(callback){
         context.waitDelay(callback, null, delay);
      }
   };

   context.addSound = function(name) {
      $("#noise").remove();
      $("body").append("<audio src='"+getSoundPath(name)+".mp3' autoplay id='noise'></audio>");
      var vol = (context.soundEnabled) ? 1 : 0;
      $("audio").prop('volume', vol);
   };

   context.placeMarker = function(value) {
      // if(isNaN(value) || value < 1 || value > 9){
      //    throw(strings.messages.wrongMarkerNumber);
      // }
      var col = this.cranePos;
      var alreadyExist = false;
      for(var iMark = 0; iMark < this.markers.length; iMark++){
         var marker = this.markers[iMark];
         if(marker.name == value){
            marker.col = col;
            alreadyExist = true;
         }
      }
      if(!alreadyExist){
         this.markers.push({ name: value, col });
      }
      if(context.display) {
         redisplayMarkers();
      }
   };

   context.destroy = function(item) {
      context.setIndexes();
      context.items.splice(item.index, 1);

      if(context.display) {
         item.element.remove();
      }
   };
   
   
   

   function maskToFront() {
      for(var item of context.items){
         if(item.isMask && item.element){
            item.element.toFront();
         }
      }
   };
   
   return context;
};

var computeGrade = function(context, message) {
   return {
      successRate: context.successRate,
      message: message
   };
};

var getResources = function(subTask) {
   var res = [];
   var type = subTask.gridInfos.contextType;
   var typeData = contextParams[type];

   if(typeData.craneSrc){
      for(var key in typeData.craneSrc){
         res.push({ type: 'image', url: typeData.craneSrc[key] });
      }
   }

   if(typeData.itemTypes){
      for(var key in typeData.itemTypes){
         var params = typeData.itemTypes[key];
         if(params.img){
            res.push({ type: 'image', url: params.img });
         }
      }
   }

   var sounds = ["background","brick_crush","wreckingBall_grab","brick_grab","brick_putDown","crane_stop"];
   for(var url of sounds){
      res.push({ type: 'image', url: url+".mp3" });
   }

   res.push({ type: 'image', url: dustUrl });

   var data = subTask.data;
   var newUrl = [];
   // console.log(data)
   for(var level in data){
      for(var iLev = 0; iLev < data[level].length; iLev++){
         var tiles = data[level][iLev].tiles;
         var customItems = data[level][iLev].customItems;
         var successAnim = data[level][iLev].successAnim;
         for(var row of tiles){
            for(var col of row){
               if(col > 1){
                  var url = "assets/png/0"+(col-1)+".png";
                  if(!newUrl.includes(col)){
                     res.push({ type: 'image', url });
                     newUrl.push(url)
                  }
               }
            }
         }


         if(customItems){
            for(var id in customItems){
               if(customItems[id].img){
                  res.push({ type: 'image', url: customItems[id].img });
               }
            }
         }

         if(successAnim && successAnim.img){
            for(var img of successAnim.img){
               res.push({ type: 'image', url: img.src });
            }
         }
      }
   }

   return res
};

var robotEndConditions = {
   dev: function(context, lastTurn) {
      var scor = context.scoring;
      if(!scor || scor.length == 0){
         context.success = true;
         context.successRate = 1;
         throw(window.languageStrings.messages.success);
      }
      for(var iTarget = 0; iTarget < scor.length; iTarget++){
         var res = robotEndConditions.checkTarget(context,iTarget);
         if(res.success || iTarget == scor.length - 1){
            if(context.display && res.highlights){
               for(var iHighlight = 0; iHighlight < res.highlights.length; iHighlight++){
                  var a = (iHighlight == 0) ? context.highlight1Attr : context.highlight2Attr;
                  context.highlightCells(res.highlights[iHighlight],a);
               }
            }
            if(res.success){
               var score = scor[iTarget].score;
               context.success = true;
               context.successRate = score;
               // console.log(score);
               var msg = (score < 1) ? window.languageStrings.messages.partialSuccess(null,score) : window.languageStrings.messages.success;

               throw(msg);
            }else{
               context.success = false;
               context.successRate = 0;
               throw(res.msg);
            }
         }
      }
   },
   checkTarget: function(context,iTarget) {
      // console.log(iTarget)
      var tar = context.scoring[iTarget].target;
      var sco = context.scoring[iTarget].score;
      var sub = context.scoring[iTarget].subset;
      var til = context.tiles;
      var bro = context.broken;
      
      var nbRequired = 0;
      var nbWellPlaced = 0;
      for(var iRow = 0; iRow < tar.length; iRow++){
         for(var iCol = 0; iCol < tar[iRow].length; iCol++){
            if(sub && sub.length > 0 && !sub[iRow][iCol]){
               continue
            }
            var tarData = context.getItemData(tar[iRow][iCol]);
            var numTar = tarData.num;
            var idTar = tarData.imgId;

            var tilData = context.getItemData(til[iRow][iCol]);
            var numTil = tilData.num;
            var idTil = tilData.imgId;
            
            var numBro = (bro.length > 0) ? bro[iRow][iCol] : 0;
            
            var gridRow = (context.nbRowsCont < context.nbRows) ? iRow : iRow + (context.nbRowsCont - context.nbRows);
            var gridCol = iCol + context.nbColCont;
            
            if(numTar != 1 && (numTil != numTar || numBro == 1)){
               nbRequired++;
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask);
               if(items.length > 0 && items[0].num == numTar && !items[0].broken){
                  nbWellPlaced++;
               }
            }
         }
      }
      var partialSuccess = (nbWellPlaced >= nbRequired*context.partialSuccessThreshold && context.partialSuccessEnabled) ? true : false;
      for(var iRow = 0; iRow < tar.length; iRow++){
         for(var iCol = 0; iCol < tar[iRow].length; iCol++){
            if(sub && sub.length > 0 && !sub[iRow][iCol]){
               continue
            }
            var tarData = context.getItemData(tar[iRow][iCol]);
            var numTar = tarData.num;
            var idTar = tarData.imgId;
            var gridRow = (context.nbRowsCont < context.nbRows) ? iRow : iRow + (context.nbRowsCont - context.nbRows);
            var gridCol = iCol + context.nbColCont;
            if(numTar != 1){
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask);
               var itemPos = context.getItemsPos(numTar,idTar); // *
               if(context.craneContent && context.craneContent.num == numTar){
                  itemPos.push({ row: "crane", col: context.cranePos });
               }
               if(items.length == 0){
                  var errorMsg = (partialSuccess) ? window.languageStrings.messages.partialSuccess(context.partialSuccessThreshold)+" " : "";
                  errorMsg += window.languageStrings.messages.failureMissing(itemPos.length);
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
               if(items[0].num != numTar || items[0].imgId != idTar){
                  var errorMsg = (partialSuccess) ? window.languageStrings.messages.partialSuccess(context.partialSuccessThreshold)+" " : "";
                  errorMsg += window.languageStrings.messages.failureWrongBlock(itemPos.length);
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
               if(items[0].broken){
                  var errorMsg = (partialSuccess) ? window.languageStrings.messages.partialSuccess(context.partialSuccessThreshold)+" " : "";
                  errorMsg += window.languageStrings.messages.failureBrokenBlock(itemPos.length);
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
            }
         }
      }

      for(var iRow = 0; iRow < tar.length; iRow++){
         for(var iCol = 0; iCol < tar[iRow].length; iCol++){
            if(sub && sub.length > 0 && !sub[iRow][iCol]){
               continue
            }
            var id = tar[iRow][iCol];
            var gridRow = (context.nbRowsCont < context.nbRows) ? iRow : iRow + (context.nbRowsCont - context.nbRows);
            var gridCol = iCol + context.nbColCont;
            if(id == 1){
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask);
               if(items.length > 0){
                  for(var item of items){
                     if(!item.wrecking){
                        return { success: false, msg: window.languageStrings.messages.failureUnwanted, highlights: [[{row:gridRow,col:gridCol}]] }
                     }
                  }
               }
            }
         }
      }
      return { success: true, msg: window.languageStrings.messages.success }
   },
};


var robotEndFunctionGenerator = {

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
            rail: /*imgPath+*/"crane/rail.png",
            wheels: /*imgPath+*/"crane/wheels.png",
            line: /*imgPath+*/"crane/line.png",
            leftClaw: /*imgPath+*/"crane/left_claw.png",
            rightClaw: /*imgPath+*/"crane/right_claw.png",
            sensor: /*imgPath+*/"crane/sensor.png"
         },
         itemTypes: {
            circle: { num: 2, img: /*imgPath+*/"card_roundDotted.png", side: 60, isMovable: true, zOrder: 1 },
            square: { num: 3, img: /*imgPath+*/"card_squareQuadrille.png", side: 60, isMovable: true, zOrder: 1},
            triangle: { num: 4, img: /*imgPath+*/"card_triangleStriped.png", side: 60, isMovable: true, zOrder: 1}
         },
         checkEndCondition: robotEndConditions.dev,
         computeGrade: computeGrade
      },
      sciFi: {
         backgroundElements: [
            // { 
            //    img: /*imgPath+*/"crane/sciFi/background.png",
            //    width: 1,   // % of total width if relative
            //    height: 1,
            //    x: 0,
            //    y: 0,
            //    relative: true
            // },
            // { 
            //    img: /*imgPath+*/"crane/sciFi/cloud_1.png",
            //    width: 200*0.7,
            //    height: 50*0.7,
            //    x: 0.8,
            //    y: 0.3
            // },
            // { 
            //    img: /*imgPath+*/"crane/sciFi/cloud_2.png",
            //    width: 225*0.7,
            //    height: 103*0.7,
            //    x: -0.1,
            //    y: 0.1
            // },
            // { 
            //    img: /*imgPath+*/"crane/sciFi/cloud_3.png",
            //    width: 117*0.7,
            //    height: 41*0.7,
            //    x: 0.4,
            //    y: 0.8
            // },
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
            wheelsOffsetX: -45,
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
            rail: /*imgPath+*/"crane/rail.png",
            wheels: /*imgPath+*/"crane/crane_wheels.png",
            line: /*imgPath+*/"crane/crane_line.png",
            leftClaw: /*imgPath+*/"crane/crane_left_claw_open.png",
            rightClaw: /*imgPath+*/"crane/crane_right_claw_open.png",
            shaft: /*imgPath+*/"crane/crane_shaft.png",
            sensor: /*imgPath+*/"crane/sensor.png"
         },
         craneZOrder: {
            wheels: 1,
            line: 0,
            leftClaw: 2,
            rightClaw: 0,
            shaft: 1,
            item: 1,
            sensor: 1
         },
         itemTypes: {
            tower_1: { num: 2, 
               img: /*imgPath+*/"crane/sciFi/tower_1.png", 
               brokenImg: /*imgPath+*/"crane/sciFi/tower_1_broken.png",
               side: 60, isMovable: true, zOrder: 1, catchOffsetY: 29 },
            tower_2: { num: 3, 
               img: /*imgPath+*/"crane/sciFi/tower_2.png", 
               brokenImg: /*imgPath+*/"crane/sciFi/tower_2_broken.png",
               side: 60, isMovable: true, zOrder: 1 },
            tower_3: { num: 4, img: /*imgPath+*/"crane/sciFi/tower_3.png", side: 60, isMovable: true, zOrder: 1},
            tower_4: { num: 5, img: /*imgPath+*/"crane/sciFi/tower_4.png", side: 60, isMovable: true, zOrder: 1},
            tower_5: { num: 6, img: /*imgPath+*/"crane/sciFi/tower_5.png", side: 60, isMovable: true, zOrder: 1},
            tower_6: { num: 7, img: /*imgPath+*/"crane/sciFi/tower_6.png", side: 60, isMovable: true, zOrder: 1},
            tower_7: { num: 8, img: /*imgPath+*/"crane/sciFi/tower_7.png", side: 60, isMovable: true, zOrder: 1},
            tower_8: { num: 9, img: /*imgPath+*/"crane/sciFi/tower_8.png", side: 60, isMovable: true, zOrder: 1},
            tower_9: { num: 10, img: /*imgPath+*/"crane/sciFi/tower_9.png", side: 60, isMovable: true, zOrder: 1},
            tower_10: { num: 11, img: /*imgPath+*/"crane/sciFi/tower_10.png", side: 60, isMovable: true, zOrder: 1},
            tower_11: { num: 12, img: /*imgPath+*/"crane/sciFi/tower_11.png", side: 60, isMovable: true, zOrder: 1},
            tower_12: { num: 13, img: /*imgPath+*/"crane/sciFi/tower_12.png", side: 60, isMovable: true, zOrder: 1},
            crusher: { num: 14, img: /*imgPath+*/"card_squareStriped.png", side: 60, isMovable: true, crusher: true, zOrder: 1},
            wreckingBall: { num: 15, img: /*imgPath+*/"card_roundQuadrille.png", side: 60, isMovable: true, wrecking: true, zOrder: 1}
         },
         checkEndCondition: robotEndConditions.dev,
         computeGrade: computeGrade
      },
      numbers: {
         backgroundElements: [

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
            wheelsOffsetX: -45,
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
            craneItemOffset: 12,
            sensorW: 30,
            sensorH: 30,
            sensorOffsetX: 15,
            sensorOffsetY: 47
         },
         craneSrc: {
            rail: "crane/rail.png",
            wheels: "crane/crane_wheels.png",
            line: "crane/crane_line.png",
            leftClaw: "crane/crane_left_claw_open.png",
            rightClaw: "crane/crane_right_claw_open.png",
            shaft: "crane/crane_shaft.png",
            sensor: "crane/sensor.png"
         },
         craneZOrder: {
            wheels: 1,
            line: 0,
            leftClaw: 2,
            rightClaw: 0,
            shaft: 1,
            item: 1,
            sensor: 1
         },
         itemTypes: {
            crusher: { num: 98, img: "crane/crusher.png", side: 60, isMovable: true, crusher: true, zOrder: 1},
            wreckingBall: { num: 99, img: "crane/wrecking_ball.png", side: 60, isMovable: true, wrecking: true, zOrder: 1},
            mask: { num: 97, img: "crane/sciFi/cloud_mask.png", side: 90, offsetX: -15, offsetY: -15, isMask: true, zOrder: 2},
            die: { num: 96, side: 60, isMovable: true, isDie: true, value: null, zOrder: 1, customDisplay: function(obj,context) {
               var val = context.getDieValue();
               obj.img = "crane/die/0"+val+".png";
               // console.log(obj.value) 
            }},
         },
         checkEndCondition: robotEndConditions.dev,
         computeGrade: computeGrade
      },
   };

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('crane', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['crane', getContext]);
}
