
// var imgPath = modulesPath+"img/algorea/";
// var mp3Path = modulesPath+"mp3/";
var dustUrl = "crane/dust.png";
var spotlightUrl = "crane/spotlight.png";

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
      },
      nl: {
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
               craneColumn: "colonne de la grue",
               craneRow: "ligne de la grue",
               placeMarker: "placer le marqueur",             
               placeSpotlight: "placer le projecteur",             
               goToMarker: "aller au marqueur",
               expectedBlock: "brique attendue",
               expectedBlockAt: "brique attendue ligne %1 colonne %2",
               expectedBlockInCell: "brique attendue dans cette case",
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
               readFaceItem: "lire type attaché",
               dieValue: "valeur du dé",
               flip: "retourner",
               topBlockSide: "sens de la brique du dessus",
               detach: "détacher objet",
               attach: "attacher objet",
               drawShape: "dessiner forme",
               eraseShape: "effacer forme",
               readShape: "lire forme",
               readColor: "lire couleur",
               displayMessage: "afficher message",
               conjure: "faire apparaître brique",
               conjureFaceItem: "faire apparaître objet",
               destroyFaceItem: "détruire objet",

            },
            code: {
               left: "gauche",
               right: "droite",
               take: "prendre",
               putDown: "poser",
               drop: "lacher",
               colHeight: "hauteurColonne",
               craneColumn: "colonneGrue",
               craneRow: "ligneGrue",
               placeMarker: "placerMarqueur",
               placeSpotlight: "placerProjecteur",
               goToMarker: "allerAuMarqueur",
               expectedBlock: "briqueAttendue",
               expectedBlockAt: "briqueAttendueA",
               expectedBlockInCell: "briqueAttendueDansCase",
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
               readFaceItem: "lireTypeAttache",
               dieValue: "valeurDe",
               flip: "retourner",
               topBlockSide: "sensBriqueDuDessus",
               detach: "detacherObjet",
               attach: "attacherObjet",
               drawShape: "dessinerForme",
               eraseShape: "effacerForme",
               readShape: "lireForme",
               readColor: "lireCouleur",
               displayMessage: "afficherMessage",
               conjure: "faireApparaitre",
               conjureFaceItem: "faireApparaitreObjet",
               destroyFaceItem: "detruireObjet",

            },
            description: {
               left: "@() Déplace la grue d'une case vers la gauche.",
               right: "@() Déplace la grue d'une case vers la droite.",
               take: "@() Prend la brique se trouvant sous la grue.",
               putDown: "@() Pose la brique transportée par la grue.",
               drop: "@() Lâche le boulet de démolition porté par la grue.",
               colHeight: "@() Retourne le nombre de briques se trouvant dans la colonne sous la grue.",
               craneColumn: "@() Retourne le numéro de la colonne de la grue",
               craneRow: "@() Retourne le numéro de la ligne de la grue",
               placeMarker: "@(nom) Place un marqueur portant ce nom à la position actuelle de la grue, ou y déplace le marqueur de ce nom s'il existe déjà.",             
               placeSpotlight: "@() Place le projecteur à la position actuelle de la grue, ou y déplace le projecteur s'il existe déjà.",             
               goToMarker: "@(nom) Déplace la grue à la position du marqueur portant ce nom.",
               onMarker: "@(nom) Indique si le marqueur portant se nom se trouve dans la colonne de la grue.",
			      expectedBlock: "@() Retourne le numéro du type de brique qu'il faut placer au sommet de la colonne où se trouve la grue.",
               expectedBlockAt: "@(ligne, colonne) Retourne le numéro du type de brique qu'il faut placer dans la grille, à la ligne et à la colonne indiquées.",
               expectedBlockInCell: "@() Retourne le numéro du type de brique qu'il faut placer dans la case où se trouve le capteur.",
               topBlock: "@() Retourne le numéro du type de brique se trouvant au sommet de la colonne où se trouve la grue.",
               blockAt: "@(ligne, colonne) Retourne le numéro du type de brique se trouvant dans la grille à la ligne et à la colonne indiquées.",
               brokenBlockAt: "@(ligne, colonne) Retourne True si la brique se trouvant à la ligne et à la colonne indiquées est cassée, et False sinon.",
               carriedBlock: "@() Retourne le numéro du type de la brique actuellement transportée par la grue.",
               topBlockBroken: "@() Retourne True si la brique se trouvant au sommet de la colonne où se trouve la grue est cassée, et False sinon.",
               carriedBlockBroken: "@() Retourne True si la brique actuellement transportée par la grue est cassée, et False sinon.", 

               up: "@() Déplace l'outil d'une case vers le haut.",
               down: "@() Déplace l'outil d'une case vers le bas.",           
               readBlock: "@() Retourne le numéro du type.",
               readFaceItem: "@() Retourne le numéro de l'objet de façade.",
               dieValue: "@() Retourne la valeur du dé.",
               flip: "@() Retourne la brique se trouvant sous la grue.",
               topBlockSide: "@() Retourne le sens de la brique se trouvant au sommet de la colonne où se trouve la grue.",
               detach: "@() Détache l'objet de la brique sur la case où se trouve la grue.",
               attach: "@() Attache l'objet à la brique sur la case où se trouve la grue.",
               drawShape: "@(forme, couleur) Dessine une forme sur la brique de la case où se trouve la grue.",
               eraseShape: "@() Efface la forme sur la brique de la case où se trouve la grue.",
               readShape: "@() Retourne le type de la forme dessinée sur la brique de la case où se trouve la grue.",
               readColor: "@() Retourne la couleur de la forme dessinée sur la brique de la case où se trouve la grue.",
               displayMessage: "@(texte) Affiche un message à l'écran.",
               conjure: "@(type) Fait apparaître dans la grue une brique du type indiqué.",
               conjureFaceItem: "@(type) Fait apparaître dans la grue un objet de façade du type indiqué.",
               destroyFaceItem: "@() Détruit l'objet de façade transporté par la grue.",

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
               notFaceItem: "Vous ne pouvez pas poser ce bloc",
               wrongCoordinates: "Les coordonnées sont invalides",
               impossibleToRead: "Impossible de lire une brique à cette position",
               impossibleToReadInTheDark: "Impossible de lire une brique dans l'obscurité",
               emptyCell: "Il n'y a pas de brique dans cette case !",
               
               noFaceItem: "Il n'y a pas d'objet à détacher sur cette brique",
               cannotDetachHidden: "Il n'y a pas d'objet à détacher",
               emptyCraneFaceItem: "La grue ne porte pas d'objet qui puisse être attaché",
               alreadyHaveFaceItem: "Cette brique a déjà un objet attaché",
               cannotAttachHidden: "Impossible d'attacher un objet sur la face cachée d'une brique",
               cannotAttach: "Impossible d'attacher un objet sur cette brique",

               noShape: "Il n'y a pas de forme à effacer sur cette brique",
               alreadyHasShape: "Il y a déjà une forme sur cette brique",
               cannotDrawHidden: "Impossible de dessiner une forme sur la face cachée d'une brique",
               unknownShape: "Forme inconnue",
               unknownColor: "Couleur inconnue",
               notConjurable: "Impossible de faire apparaître une brique de ce type", 
               notConjurableFaceItem: "Impossible de faire apparaître un objet de façade de ce type", 

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
               failureHiddenBlock: "Le bloc encadré en rouge est tourné du mauvais côté.",
               failureWrongFaceItem: "Le bloc encadré en rouge n'a pas l'objet de façade attendu.",
               failureFaceItem: "Le bloc encadré en rouge ne devrait pas avoir d'objet de façade.",
               failureUnwanted: "La case encadrée en rouge contient un bloc alors qu'elle devrait être vide",
               failureNoShape: "Il manque la forme dessinée sur le bloc encadré en rouge.",
               failureWrongShape: "La forme dessinée sur le bloc encadré en rouge n'est pas la bonne.",
               failureWrongColor: "La forme dessinée sur le bloc encadré en rouge n'a pas la bonne couleur.",
               failureShape: "Le bloc encadré en rouge ne devrait pas avoir de forme dessinée.",
               failureWrongCranePos: "La position finale de la grue n'est pas celle attendue.",
               failureMissingMarker: function(col) {
                  return "Il manque un marqueur à la colonne "+col+"."
               }
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
               craneColumn: "colonne de la grue",
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
               craneColumn: "craneColumn",
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
               craneColumn: "@() Retourne le numéro de la colonne de la grue.",
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
         },
         nl: {
            label: {
               left: 'naar links verplaatsen',
               right: 'naar rechts verplaatsen',
               take: 'nemen',
               putDown: 'neerzetten',
               drop: 'loslaten',
               colHeight: 'hoogte van de kolom',
               placeMarker: 'de marker plaatsen',
               goToMarker: 'naar de marker gaan',
               expectedBlock: 'baksteen verwacht',
               expectedBlockAt: 'verwachte baksteen rij %1 kolom %2',
               topBlock: 'bovenste baksteen',
               blockAt: 'baksteen rij %1 kolom %2',
               brokenBlockAt: 'gebroken baksteen rij %1 kolom %2',
               carriedBlock: 'vervoerde baksteen',
               topBlockBroken: 'bovenste baksteen is gebroken',
               carriedBlockBroken: 'vervoerde baksteen is gebroken',
               onMarker: 'op de marker %1',
               up: 'naar boven gaan',
               down: 'naar beneden gaan',
               readBlock: 'lezen baksteen',
               dieValue: 'waarde van de dobbelsteen',
               flip: 'terugkeren'
            },
            code: {
               left: 'links',
               right: 'rechts',
               take: 'nemen',
               putDown: 'neerzetten',
               drop: 'loslaten',
               colHeight: 'hoogteKolom',
               placeMarker: 'plaatsMarker',
               goToMarker: 'gaNaarMarkering',
               expectedBlock: 'baksteenVerwacht',
               expectedBlockAt: 'baksteenVerwachtA',
               topBlock: 'baksteenVanBoven',
               blockAt: 'baksteenA',
               brokenBlockAt: 'baksteenGebrokenA',
               carriedBlock: 'baksteenVervoerd',
               topBlockBroken: 'baksteenVanBovenGebroken',
               carriedBlockBroken: 'baksteenVervoerdGebroken',
               onMarker: 'opMarkering',
               up: 'naar boven gaan',
               down: 'naar beneden gaan',
               readBlock: 'lezenBaksteen',
               dieValue: 'waardeVan',
               flip: 'return'
            },
            description: {
               left: '@()Verplaats de kraan één vak naar links.',
               right: '@()Verplaats de kraan één vak naar rechts.',
               take: '@()Neem de baksteen die zich op de kraan bevindt.',
               putDown: '@() Leg de baksteen, vervoerd door de kraan, neer.',
               drop: '@()Laat de sloopkogel, gedragen door de kraan, los.',
               colHeight: '@()Breng het aantal bakstenen, dat zich in onder de kraan bevindt, terug naar de kolom.',
               placeMarker: '@(naam) Plaats een marker met deze naam op de huidige positie van de kraan, of breng er de kraan naartoe als de naam al bestaat.',
               goToMarker: '@(naam) Verplaats de kraan naar de postie van de marker met die naam.',
               onMarker: '@(naam) Geef aan of de marker met deze naam zich in de kolom van de kraan bevindt.',
               expectedBlock: '@() Return nummer van het type baksteen dat geplaatst moet worden boven de kolom waar zich de kraan bevindt.',
               expectedBlockAt: '@(lijn, kolom) Return nummer van het type baksteen dat in het rooster moet geplaatst worden, op de aangeduide lijn en kolom.',
               topBlock: '@() Return nummer van het type baksteen dat zich bevindt boven de kolom waar de kraan zich bevindt.',
               blockAt: '@(lijn, kolom) Return nummer van het type baksteen dat zich bevindt in het rooster op de aangeduide lijn en kolom.',
               brokenBlockAt: '@(lijn, kolom) Return True als de baksteen die zich op de aangeduide lijn en kolom bevindt, gebroken is, en False indien niet.',
               carriedBlock: '@() Return nummer van het type baksteen die momenteel door de kraan wordt vervoerd.',
               topBlockBroken: '@() Return True als de baksteen die zich bovenaan de kolom bevindt waar de kraan zich bevindt, gebroken is, en False indien niet.',
               carriedBlockBroken: '@() Return True als de baksteen die momenteel door de kraan wordt vervoerd, gebroken is, en False indien niet.',
               up: '@() Verplaats het gereedschap één vak naar boven.',
               down: '@() Verplaats het gereedschap één vak naar beneden.',
               readBlock: '@() Return type nummer.',
               dieValue: '@() Return waarde van de dobbelsteen.',
               flip: '@() Recupereer de baksteen die zich onder de kraan bevindt.'
            },
            messages: {
               yLimit: function(up) {
                  var str = "L'outil ne peut pas "
                  str += (up) ? "monter plus haut." : "descendre plus bas.";
                  return str
               },
               outside: 'De kraan kan niet verder gaan in die richting.',
               success: 'Bravo u bent geslaagd.',
               failure: 'U heeft het doel niet bereikt.',
               nothingToTake: 'Er is geen blok in deze kolom.',
               notMovable: 'Dit blok kan niet verplaatst worden.',
               holdingBlock: 'De kraan kan niet meer dan één blok tegelijk nemen.',
               holdingBlock_sensor: 'U kan de sensor niet gebruiken terwijl de kraan een blok draagt.',
               emptyCrane: 'De kraan draagt geen blok.',
               cannotDrop: 'U kan geen blok in deze kolom neerleggen.',
               notWrecking: 'U kan dit blok niet loslaten.',
               wrongCoordinates: 'De gegevens zijn ongeldig.',
               impossibleToRead: 'Onmogelijk om op deze plaats een steen te lezen.',
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
               failureHiddenBlock: 'Het blok in het rode kader is naar de verkeerde kant gedraaid.',
               failureUnwanted: 'Het vak met het rode kader omvat een blok terwijl het leeg had moeten zijn.'
            },
            startingBlockName: 'Programma van de robot'
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

	for (var id = 1; id < 90; id++) {
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
   
   infos.newBlocks.push({
      name: "left",
      type: "actions",
      block: { name: "left" },
      func: function(callback) {
         this.updateRunningState();
         this.shiftCrane(-1,callback);
      }
   });

   infos.newBlocks.push({
      name: "right",
      type: "actions",
      block: { name: "right" },
      func: function(callback) {
         this.updateRunningState();
         this.shiftCrane(1,callback);
      }
   });

   infos.newBlocks.push({
      name: "take",
      type: "actions",
      block: { name: "take" },
      func: function(callback) {
         this.updateRunningState();
         if(this.cranePosY > -1){
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
         this.updateRunningState();
         this.putDown(callback);
      }
   });

   infos.newBlocks.push({
      name: "drop",
      type: "actions",
      block: { name: "drop" },
      func: function(callback) {
         this.updateRunningState();
         this.drop(callback);
      }
   });

   infos.newBlocks.push({
      name: "colHeight",
      type: "sensors",
      block: { name: "colHeight", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getColHeight());
      }
   });

   infos.newBlocks.push({
      name: "craneColumn",
      type: "sensors",
      block: { name: "craneColumn", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.cranePos + 1);
      }
   });

   infos.newBlocks.push({
      name: "craneRow",
      type: "sensors",
      block: { name: "craneRow", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.nbRows - this.cranePosY);
      }
   });

   infos.newBlocks.push({
      name: "expectedBlock",
      type: "sensors",
      block: { name: "expectedBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
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
         this.updateRunningState();
         this.callCallback(callback, this.getExpectedBlockAt(row,col));
      }
   });

   infos.newBlocks.push({
      name: "expectedBlockInCell",
      type: "sensors",
      block: { name: "expectedBlockInCell", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getExpectedBlockInCell());
      }
   });

   infos.newBlocks.push({
      name: "topBlock",
      type: "sensors",
      block: { name: "topBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getTopBlock());
      }
   });

   infos.newBlocks.push({
      name: "topBlockBroken",
      type: "sensors",
      block: { name: "topBlockBroken", yieldsValue: true },
      func: function(callback) {
         this.updateRunningState();
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
         this.updateRunningState();
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
         this.updateRunningState();
         this.callCallback(callback, this.isBlockAtBroken(row,col));
      }
   });

   infos.newBlocks.push({
      name: "carriedBlock",
      type: "sensors",
      block: { name: "carriedBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getCarriedBlock());
      }
   });

   infos.newBlocks.push({
      name: "carriedBlockBroken",
      type: "sensors",
      block: { name: "carriedBlockBroken", yieldsValue: true },
      func: function(callback) {
         this.updateRunningState();
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
         this.updateRunningState();
         this.callCallback(callback, this.isOnMarker(value));
      }
   });

   infos.newBlocks.push({
      name: "placeMarker",
      type: "actions",
      block: {
         name: "placeMarker", params: [null], 
         blocklyJson: {
            "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]]
            }]
         }
      },
      func: function(value, callback) {
         this.updateRunningState();
         this.placeMarker(value);
         this.waitDelay(callback);
      }
   });

   infos.newBlocks.push({
      name: "goToMarker", 
      type: "actions",
      block: {
         name: "goToMarker", params: [null], 
      blocklyJson: {
            "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]]
            }]
         },
      },
      func: function(value, callback) {
         this.updateRunningState();
         this.goToMarker(value,callback);
      }
   });

   infos.newBlocks.push({
      name: "up",
      type: "actions",
      block: { name: "up" },
      func: function(callback) {
         this.updateRunningState();
         this.shiftCraneY(-1,callback);
      }
   });

   infos.newBlocks.push({
      name: "down",
      type: "actions",
      block: { name: "down" },
      func: function(callback) {
         this.updateRunningState();
         this.shiftCraneY(1,callback);
      }
   });

   infos.newBlocks.push({
      name: "readBlock",
      type: "sensors",
      block: { name: "readBlock", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getBlockType());
      }
   });

   infos.newBlocks.push({
      name: "dieValue",
      type: "sensors",
      block: { name: "dieValue", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getDieValue());
      }
   });

   infos.newBlocks.push({
      name: "flip",
      type: "actions",
      block: { name: "flip" },
      func: function(callback) {
         this.updateRunningState();
         // if(this.cranePosY > -1){
         //    this.moveCraneY(-1, function () {
         //       context.executeCallWhenReady('flip');
         //       callback();
         //    });
         // }else{
            this.flip(callback);
         // } 
      }
   });

   infos.newBlocks.push({
      name: "placeSpotlight",
      type: "actions",
      block: { name: "placeSpotlight" },
      func: function(callback) {
         this.updateRunningState();
         if(this.cranePosY > -1){
            this.moveCraneY(-1, function () {
               context.executeCallWhenReady('placeSpotlight');
               callback();
            });
         }else{
            this.placeSpotlight();
            this.waitDelay(callback);
         } 
      }
   });

   infos.newBlocks.push({
      name: "topBlockSide",
      type: "sensors",
      block: { name: "topBlockSide", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.getTopBlockSide());
      }
   });

   infos.newBlocks.push({
      name: "detach",
      type: "actions",
      block: { name: "detach" },
      func: function(callback) {
         this.updateRunningState();
         this.detach(callback);
      }
   });

   infos.newBlocks.push({
      name: "attach",
      type: "actions",
      block: { name: "attach" },
      func: function(callback) {
         this.updateRunningState();
         this.attach(callback);
      }
   });

   infos.newBlocks.push({
      name: "readFaceItem",
      type: "sensors",
      block: { name: "readFaceItem", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.readFaceItem());
      }
   });

   infos.newBlocks.push({
      name: "drawShape",
      type: "actions",
      block: {
         name: "drawShape", params: [null,null],
         blocklyJson: {
            "args0": [{
               "type": "field_dropdown", "name": "PARAM_0", "options": [
                  ["rond", "rond"], ["carré", "carré"], ["étoile", "étoile"], ["triangle", "triangle"], ["losange", "losange"],  ]
            },
            {
               "type": "field_dropdown", "name": "PARAM_1", "options": [
                  ["rouge", "rouge"], ["vert", "vert"], ["bleu", "bleu"], ["jaune", "jaune"], ["noir", "noir"], ["blanc", "blanc"]]
            }]
         }
      },
      func: function(value1, value2, callback) {
         this.updateRunningState();
         this.drawShape(value1,value2);
         this.waitDelay(callback);
      }
   });

   infos.newBlocks.push({
      name: "eraseShape",
      type: "actions",
      block: { name: "eraseShape" },
      func: function(callback) {
         this.updateRunningState();
         this.eraseShape();
         this.waitDelay(callback);
      }
   });

   infos.newBlocks.push({
      name: "readShape",
      type: "sensors",
      block: { name: "readShape", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.readShape());
      }
   });

   infos.newBlocks.push({
      name: "readColor",
      type: "sensors",
      block: { name: "readColor", yieldsValue: 'int' },
      func: function(callback) {
         this.updateRunningState();
         this.callCallback(callback, this.readColor());
      }
   });

   infos.newBlocks.push({
      name: "displayMessage",
      type: "actions",
      block: { name: "displayMessage", params: [null], 
         blocklyJson: {
               "args0": [
               { "type": "field_input", "name": "PARAM_0", "value": "message" },
            ]
         }
      },
      func: function(value,callback) {
         this.updateRunningState();
         this.displayMessage(value);
         this.waitDelay(callback,null,1000);
      }
   });

   infos.newBlocks.push({
      name: "conjure",
      type: "actions",
      block: { name: "conjure", params: [null], 
         blocklyJson: {
               "args0": [
               { "type": "field_number", "name": "PARAM_0", "value": 1 },
            ]
         }
      },
      func: function(type,callback) {
         this.updateRunningState();
         if(this.cranePosY > -1){
            this.moveCraneY(-1, function () {
               context.executeCallWhenReady('conjure',[type]);
               callback();
            });
         }else{
            this.conjure(type);
            this.waitDelay(callback);
         } 
      }
   });

   infos.newBlocks.push({
      name: "conjureFaceItem",
      type: "actions",
      block: { name: "conjureFaceItem", params: [null], 
         blocklyJson: {
               "args0": [
               { "type": "field_number", "name": "PARAM_0", "value": 1 },
            ]
         }
      },
      func: function(type,callback) {
         this.updateRunningState();
         this.conjureFaceItem(type);
         this.waitDelay(callback);
      }
   });

   infos.newBlocks.push({
      name: "destroyFaceItem",
      type: "actions",
      block: { name: "destroyFaceItem" },
      func: function(callback) {
         this.destroyFaceItem(callback);
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
   // var hideGrid;

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
      craneItemOffset,
      craneFaceItemOffsetY } = infos.craneAttr;
   var detachDeltaY = 5; // small offset to mark object detachment

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
   var darkCellAttr = {
      fill: "black",
      opacity: 0.5
   };
   // var hideGridAttr = {
   //    stroke: "none",
   //    fill: "black"
   // };

   var dustSrc = getImgPath(dustUrl);
   var dustW = 80;
   var dustH = 28;
   var dustDuration = 1100;
   var dust;
   var spotlightSrc = getImgPath(spotlightUrl);

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
      if(infos.rowLabelEnabled.side == 0){
         infos.leftMargin += infos.cellSide;
      }else{
         infos.rightMargin += infos.cellSide;
      }
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
         context.conjureItems = gridInfos.conjureItems || [];
         context.conjureFaceItems = gridInfos.conjureFaceItems || [];
         
         context.scoring = gridInfos.scoring || [ { target: gridInfos.target, score: 1 } ]
         context.target = context.scoring[0].target || [];
         context.targetHidden = context.scoring[0].hidden || [];
         context.targetFaceItems = context.scoring[0].faceItems || [];
         context.targetShapes = context.scoring[0].shapes || [];
         context.targetCranePos = context.scoring[0].cranePos;
         context.targetMarkers = context.scoring[0].markers || [];

         context.broken = gridInfos.broken || [];
         context.hidden = gridInfos.hidden || [];
         context.shapes = gridInfos.shapes;
         context.dark = gridInfos.dark || [];
         context.faceItems = gridInfos.faceItems || [];
         context.mask = gridInfos.mask || [];
         context.initMarkers = gridInfos.initMarkers || [];
         context.customItems = gridInfos.customItems || {};
         context.successAnim = gridInfos.successAnim || {};
         context.overlay = (gridInfos.overlay) ? Beav.Object.clone(gridInfos.overlay) : null;
         context.underlay = (gridInfos.underlay) ? Beav.Object.clone(gridInfos.underlay) : null;
         context.initState = gridInfos.initState;
      }
      context.partialSuccessEnabled = (infos.partialSuccessEnabled == undefined) ? true : infos.partialSuccessEnabled;
      context.cranePos = context.initCranePos;
      context.cranePosY = context.initCranePosY || 0;
      context.craneContent = null;
      context.tool = context.initTool || 0; // 0: crane, 1: sensor
      context.programIsRunning = false;

      // context.rng = new RandomGenerator(0);
      context.dieValue = context.initDieValue || null;
      context.rollDieIndex = 0;
      
      context.items = [];
      context.multicell_items = [];
      context.markers = [];
      context.spotlight = null;
      context.message = null;
      context.messageElement = null;


      for(var iMark = 0; iMark < context.targetMarkers.length; iMark++){
         context.markers.push(Object.assign({ target: true },context.targetMarkers[iMark]));
      }
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
      // console.log("redrawDisplay")
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

   context.updateRunningState = function() {
      if(!this.programIsRunning){
         this.programIsRunning = true;
         redisplayEverything();
      }
   };

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
         var { x, y } = context.getCellCoord(row,col);
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
      if(row != "crane"){
         var y = (cSide * (craneH + row) + infos.topMargin + markerH) * scale;
         var x = (cSide * col + infos.leftMargin) * scale;
      }else{
         var item = context.craneContent;
         var craneAttr = getCraneAttr();
         var y = craneAttr.yClaws + (craneItemOffset + item.offsetY)*scale;
         if(item.catchOffsetY){
            y -= item.catchOffsetY*scale;
         }
         var x = craneAttr.x;
      }

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

   context.getExpectedBlockInCell = function() {
      context.tool = 1;
      updateTool();
      var nbRowsCont = this.nbRowsCont;
      var nbColCont = this.nbColCont;
      var nbCol = this.nbCols + nbColCont;
      var nbRows = Math.max(this.nbRows,nbRowsCont);
      var col = this.cranePos;
      var row = this.cranePosY;
      if(row < 0 || row >= nbRows || col < 0 || col >= nbCol){
         throw(strings.messages.wrongCoordinates);
      }
      var items = this.getItemsOn(row, col, obj => obj.target && !obj.ini);
      if(items.length > 0 && items[0].dark){
         throw(strings.messages.impossibleToReadInTheDark)
      }
      var tar = this.target[row][col];
      // console.log(tar,this.getItemId(tar))
      if(tar > 1){
         return this.getItemId(tar)
      }
      return 0
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
      var items = this.getItemsOn(row - 1, col - 1, obj => !obj.target && !obj.ini);
      var id = (items.length == 0) ? 0 : items[0].id;
      if(id === undefined){
         // because only num < 50 (custom blocks) have id
         id = items[0].num;
      }
      if(items.length > 0 && items[0].dark){
         throw(strings.messages.impossibleToReadInTheDark)
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

   context.getTopBlockSide = function() {
      var col = this.cranePos;
      var topBlock = this.findTopBlock(col);
      if(!topBlock){
         return 0
      }
      return (topBlock.hidden) ? 2 : 1
   };

   context.readFaceItem = function() {
      context.tool = 1;
      updateTool();
      var col = this.cranePos;
      var row = this.cranePosY;
      if(row > -1){
         var items = this.getItemsOn(row, col, obj => !obj.target && !obj.ini);
         if(items.length == 0){
            // throw(strings.messages.emptyCell)
            return 0
         }
         // console.log(items[0].faceItem)
         return items[0].faceItem || 0
      }
      // throw(strings.messages.impossibleToRead)
      return 0
   };

   context.readShape = function() {
      context.tool = 1;
      updateTool();
      var col = this.cranePos;
      var row = this.cranePosY;
      if(row > -1){
         var items = this.getItemsOn(row, col, obj => !obj.target && !obj.ini);
         if(items.length == 0){
            return 0
         }
         var item = items[0];
         if(item.shape && item.shape.length > 0){
            return item.shape[0] + 1
         }
      }
      return 0
   };

   context.readColor = function() {
      context.tool = 1;
      updateTool();
      var col = this.cranePos;
      var row = this.cranePosY;
      if(row > -1){
         var items = this.getItemsOn(row, col, obj => !obj.target && !obj.ini);
         if(items.length == 0){
            return 0
         }
         var item = items[0];
         if(item.shape && item.shape.length > 0){
            return item.shape[1] + 1
         }
      }
      return 0
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
      var items = this.getItemsOn(row - 1, col - 1, obj => !obj.target && !obj.ini);
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

   function getCraneAttr(target) {
      var cSide = infos.cellSide;
      var w = cSide*scale, h = w;
      var y = (infos.topMargin + markerH)*scale;
      var cranePos = (target) ? context.targetCranePos : context.cranePos;
      var nbRowsCont = context.nbRowsCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var cranePosY = context.cranePosY;

      if(target){
         var craneOpacity = 0.3;
         var sensorOpacity = 0;
      }else{
         var craneOpacity = 1 - context.tool;
         var sensorOpacity = context.tool;
      }

      let faceItemOffsetY = (context.craneContent && context.craneContent.type == "faceItem") ? (craneFaceItemOffsetY - detachDeltaY)*scale : 0;
      let yCorr = (cranePosY == -1 && context.craneContent && context.craneContent.type == "faceItem") ? -craneFaceItemOffsetY*scale : 0; 

      var x = infos.leftMargin*scale + w*cranePos;
      var xWheels = x + wheelsOffsetX*scale;
      var yWheels = y + wheelsOffsetY*scale;

      var lineH = nbRows + craneH;
      var y0Line = y;
      var yLineClip1 = y + wheelsPosY*scale;
      var yLineClip2 = y + (shaftOffsetY + 2)*scale + (cranePosY + 1)*cSide*scale + faceItemOffsetY + yCorr;
      var hClip = yLineClip2 - yLineClip1;
      var lineClip = [x,yLineClip1,w,hClip];

      var xShaft = x + shaftOffsetX*scale;
      var yShaft = y + shaftOffsetY*scale + (cranePosY + 1)*h + faceItemOffsetY + yCorr;

      var xLeftClaw = x + leftClawOffsetX*scale;
      var xRightClaw = x + rightClawOffsetX*scale;
      var yClaws = y + clawsOffsetY*scale + (cranePosY + 1)*h + faceItemOffsetY + yCorr;

      var cxLeft = x + leftClawCx*scale;
      var cyLeft = y + leftClawCy*scale + (cranePosY + 1)*h + faceItemOffsetY + yCorr;
      var cxRight = x + rightClawCx*scale;
      var cyRight = y + rightClawCy*scale + (cranePosY + 1)*h + faceItemOffsetY + yCorr;

      var xSensor = x + sensorOffsetX*scale;
      var ySensor = y + sensorOffsetY*scale + (cranePosY + 1)*h;

      return { x, y, w, h, xWheels, yWheels, y0Line, lineClip, 
         xShaft, yShaft, yClaws, xLeftClaw, xRightClaw, 
         cxLeft, cyLeft, cxRight, cyRight, xSensor, ySensor, craneOpacity, sensorOpacity }
   };

   function setCraneAttr(attr,target) {
      var cSide = infos.cellSide;
      var x = attr.x, y = attr.y;
      var width = attr.w, height = attr.h;
      var obj = (target) ? crane.target : crane;

      obj.wheels.attr({ 
         x: attr.xWheels, 
         y: attr.yWheels, 
         width: wheelsW*scale, 
         height: wheelsH*scale,
         opacity: (target) ? 0.3 : 1 
      });
      for(var iRow = 0; iRow < obj.line.length; iRow++){
         var yLine = attr.y0Line + iRow*cSide*scale;
         obj.line[iRow].attr({x, y: yLine, width, height });
      }
      obj.line.attr("clip-rect",attr.lineClip);
      if(target){
         obj.line.attr("opacity", 0.3);
      }
      obj.shaft.attr({
         x: attr.xShaft, 
         y: attr.yShaft, 
         width: shaftW*scale, 
         height: shaftH*scale,
         opacity: attr.craneOpacity
      })
      obj.leftClaw.attr({ 
         x: attr.xLeftClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale,
         opacity: attr.craneOpacity
      });
      obj.rightClaw.attr({ 
         x: attr.xRightClaw, 
         y: attr.yClaws, 
         width: clawW*scale, 
         height: clawH*scale,
         opacity: attr.craneOpacity
      });
      if(!target){
         obj.sensor.attr({ 
            x: attr.xSensor, 
            y: attr.ySensor, 
            width: sensorW*scale, 
            height: sensorH*scale,
            opacity: attr.sensorOpacity
         });
      }else{
         var ini = context.initState;
         if(!context.programIsRunning && ini && ini.hideTarget){
            crane.target.all.hide();
         }else{
            crane.target.all.show();
         }
         return
      }

      if(!target && context.craneContent){
         var item = context.craneContent;
         var angle = clutchAngle;
         crane.leftClaw.transform(["R",-angle,attr.cxLeft,attr.cyLeft]);
         crane.rightClaw.transform(["R",angle,attr.cxRight,attr.cyRight]);
         var elem = item.element;
         var newY = attr.yClaws;
         if(context.craneContent.type == "faceItem"){
            newY += (craneFaceItemOffsetY + cSide/2)*scale;
         }else{
            newY += (craneItemOffset + item.offsetY)*scale;
         }
         if(item.catchOffsetY){
            newY -= item.catchOffsetY*scale;
         }
         elem.attr({ x, y: newY, opacity: 1 });
         if(item.darkElement)
            item.darkElement.attr({ x, y: newY, opacity: 0 });
         if(item.faceItemElement){
            var opacity = (item.hidden) ? 0 : 1;
            item.faceItemElement.attr({ x, y: newY, opacity });
         }
         if(item.shapeElement){
            var itemAttr = itemAttributes(item);
            var dy = newY - itemAttr.y; 
            var dx = x - itemAttr.x; 
            var op = (item.hidden) ? 0 : 1;
            item.shapeElement.remove();
            item.shapeElement = addShape(item).attr("opacity",op);
         }
      }else{
         crane.leftClaw.transform("");
         crane.rightClaw.transform("");
      }
      resetCraneZOrder();
   };

   function updateTool() {
      if(!context.display){
         return
      }
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
               var num = (infos.rowLabelEnabled.countDir == 0) ? (iRow + 1) : nbRows - iRow;
               if(!infos.labelFrameAttr){
                  rowsLabels[iRow] = paper.text(0, 0, num);
               }else{
                  var frame = paper.rect(0,0,0,0).attr(infos.labelFrameAttr);
                  var text = paper.text(0, 0, num);
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
      // if(infos.hideGrid){
      //    hideGrid = paper.rect(0,0,0,0).attr(hideGridAttr);
      // }

      $("#dust_pix").remove();
      $("body").append("<img src="+dustSrc+" style='width:1px;' id='dust_pix' />");
   };

   function resetCrane() {
      // console.log("resetCrane")
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      // var src = (infos.craneImgPath) ?  Object.assign(Beav.Object.clone(infos.craneSrc),infos.craneImgPath) : infos.craneSrc;
      var src = infos.craneSrc;
      var path = {};
      for(var key in src){
         path[key] = (infos.craneImgPath && infos.craneImgPath[key]) ? infos.craneImgPath[key] : getImgPath(src[key]);
      }
      crane.rail = paper.set();
      for(var iCol = 0; iCol < nbCol; iCol++){
         // crane.rail.push(paper.image(getImgPath(src.rail),0,0,0,0));
         crane.rail.push(paper.image(path.rail,0,0,0,0));
      }
      paper.setStart();
      // crane.wheels = paper.image(getImgPath(src.wheels),0,0,0,0);
      crane.wheels = paper.image(path.wheels,0,0,0,0);
      var lineH = nbRows + craneH;
      crane.line = paper.set();
      for(var iRow = 0; iRow < lineH; iRow++){
         // crane.line.push(paper.image(getImgPath(src.line),0,0,0,0));
         crane.line.push(paper.image(path.line,0,0,0,0));
      }
      // crane.leftClaw = paper.image(getImgPath(src.leftClaw),0,0,0,0);
      // crane.rightClaw = paper.image(getImgPath(src.rightClaw),0,0,0,0);
      // crane.shaft = paper.image(getImgPath(src.shaft),0,0,0,0);
      // crane.sensor = paper.image(getImgPath(src.sensor),0,0,0,0);
      crane.leftClaw = paper.image(path.leftClaw,0,0,0,0);
      crane.rightClaw = paper.image(path.rightClaw,0,0,0,0);
      crane.shaft = paper.image(path.shaft,0,0,0,0);
      crane.sensor = paper.image(path.sensor,0,0,0,0);
      crane.all = paper.setFinish();

      if(context.craneContent){
         redisplayItem(context.craneContent)
      }

      if(context.targetCranePos != undefined){
         crane.target = {};
         crane.target.wheels = crane.wheels.clone();
         crane.target.line = crane.line.clone();
         crane.target.leftClaw = crane.leftClaw.clone();
         crane.target.rightClaw = crane.rightClaw.clone();
         crane.target.shaft = crane.shaft.clone();
         crane.target.all = paper.set(crane.target.wheels,crane.target.line,crane.target.leftClaw,crane.target.rightClaw,crane.target.shaft);
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
      // console.log(item.type)
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
            // context.dieValue = context.rng.nextInt(1,6);
            context.dieValue = 1;
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
      
      // var til = context.tiles; 
      // var tar = context.target;
      var ini = context.initState; 
      var nbStates = (ini) ? 2 : 1;
      for(var state = 0; state < nbStates; state++){
         var dat = (state == 0) ? context : ini;
         for(var iRow = 0; iRow < context.nbRows; iRow++) {
            for(var iCol = 0; iCol < context.nbCols; iCol++) {
               if(!dat.tiles || dat.tiles.length == 0){
                  continue
               }
               var itemData = context.getItemData(dat.tiles[iRow][iCol]);
               var itemTypeNum = itemData.num;

               var broken = (dat.broken && dat.broken.length > 0) ? (dat.broken[iRow][iCol] == 1) : false;
               var hidden = (dat.hidden && dat.hidden.length > 0) ? (dat.hidden[iRow][iCol] == 1) : false;
               var dark = (dat.dark && dat.dark.length > 0) ? (dat.dark[iRow][iCol] == 1) : false;
               var faceItem = (dat.faceItems && dat.faceItems.length > 0) ? dat.faceItems[iRow][iCol] : 0;
               var shape = (dat.shapes) ? dat.shapes[iRow][iCol] : 0;
               if(itemTypeByNum[itemTypeNum] != undefined) {
                  resetItem({
                     row: iRow + rowShift,
                     col: iCol + nbColCont,
                     type: itemTypeByNum[itemTypeNum],
                     imgId: itemData.imgId,
                     deco: itemData.deco, 
                     broken, hidden, dark, faceItem, shape,
                     ini: state
                  }, false);
               }
               if(state > 0){
                  continue
               }

               var targetData = context.getItemData(context.target[iRow][iCol]);
               var targetHidden = (context.targetHidden.length > 0) ? context.targetHidden[iRow][iCol] : 0;
               var targetFaceItem = (context.targetFaceItems.length > 0) ? context.targetFaceItems[iRow][iCol] : 0;
               var targetShape = (context.targetShapes.length > 0) ? context.targetShapes[iRow][iCol] : 0;
               var targetNum = targetData.num;

               if(itemTypeByNum[targetNum] != undefined) {
                  resetItem({
                     row: iRow + rowShift,
                     col: iCol + nbColCont,
                     type: itemTypeByNum[targetNum],
                     imgId: targetData.imgId,
                     deco: targetData.deco, 
                     hidden: targetHidden,
                     faceItem: targetFaceItem,
                     shape: targetShape,
                     target: true, dark
                  }, false);
               }
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
            type: "mask", ini
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
         var it = context.getItemsOn(0,context.initCranePos, obj => !obj.target && !obj.ini);
         context.setIndexes();
         context.items.splice(it[0].index, 1);
         context.craneContent = it[0];
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
         if(cellItems[iItem].element){
            cellItems[iItem].element.toFront();
         }
         if(cellItems[iItem].faceItemElement){
            cellItems[iItem].faceItemElement.toFront();
         }
         if(cellItems[iItem].shapeElement){
            cellItems[iItem].shapeElement.toFront();
         }
         if(cellItems[iItem].darkElement){
            cellItems[iItem].darkElement.toFront();
         }
      }

   }; 

   var resetCraneZOrder = function(noContent) {
      // console.log("resetZOrder")
      if(crane.target){
         crane.target.wheels.toFront();
      }
      var elem = [];
      for(var elemName in infos.craneZOrder) {
         var val = infos.craneZOrder[elemName];
         if(!noContent && context.craneContent && elemName == "item"){
            console.log('item')
            var obj = paper.set(context.craneContent.element);
            if(context.craneContent.darkElement){
               obj.push(context.craneContent.darkElement);
            }
            if(context.craneContent.faceItemElement){
               obj.push(context.craneContent.faceItemElement);
            }
            if(context.craneContent.shapeElement){
               obj.push(context.craneContent.shapeElement);
            }
            // var obj = (context.craneContent.darkElement) ? paper.set(context.craneContent.element,context.craneContent.darkElement) : context.craneContent.element;
         }else{
            var obj = crane[elemName];
         }
         elem.push({ zOrder: val, element: obj });
      }
      sortCellItems(elem);

      if(context.messageElement){
         context.messageElement.toFront();
      }
   };

   function resetAnimZOrder(noContent) {
      console.log("resetAnimZOrder",noContent)
      resetCraneZOrder(noContent);
      overlayToFront();
   };

   function overlayToFront() {
      let ov = context.overlay;
      if(ov && ov.element){
         ov.element.toFront();
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
         var areaWidth = Math.max(200, $('#grid').width()-24);
         var areaHeight = Math.max(150, $('#grid').height()-5); // Keep a margin so that scrollbars don't keep appearing/disappearing
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
               if(infos.rowLabelEnabled.side == 0){
                  var x = (infos.leftMargin - cSide / 2) * scale;
               }else{
                  var x = (infos.leftMargin + nbCol*cSide + infos.rightMargin - cSide / 2) * scale;
               }
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
      redisplayEverything();
   };

   function redisplayEverything() {
      if(!context.display) {
         return;
      }
      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);
      var cSide = infos.cellSide;
      
      /* underlay */
      updateUnderlay();

      redisplayAllItems();    
      redisplayMarkers();  
      redisplaySpotlight();  
      updateDarkness();
      updateMessage();

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
      if(crane.target){
         var tCraneAttr = getCraneAttr(true);
         setCraneAttr(tCraneAttr,true);
      }

      /* overlay */
      updateOverlay();


      /* highlights */
      if(context.highlights.length > 0){
         for(var dat of context.highlights){
            var { row, col, obj } = dat;
            var width = cSide*scale, height = w;
            var { x, y } = context.getCellCoord(row,col);
            obj.attr({ x, y, width, height }).toFront();
         }
      }

      /* success anims */
      if(context.successAnimObj.length > 0){
         for(var dat of context.successAnimObj){
            var { row, col, width, height, obj } = dat;
            var w = cSide*width*scale, h = cSide*height*scale;
            var { x, y } = context.getCellCoord(row,col);
            obj.attr({ x, y, width: w, height: h });
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
      if(item.darkElement !== undefined) {
         item.darkElement.remove();
      }
      if(item.faceItemElement) {
         item.faceItemElement.remove();
      }
      if(item.shapeElement) {
         item.shapeElement.remove();
      }

      var ini = context.initState; 
      var run = context.programIsRunning;
      if(!run && ini && ini.hideTarget && item.target){
         return
      }
      if(!run && ini && ini.tiles && !item.ini){
         return
      }
      if(run && item.ini){
         return
      }

      var nbRowsCont = context.nbRowsCont;
      var nbColCont = context.nbColCont;
      var nbCol = context.nbCols + nbColCont;
      var nbRows = Math.max(context.nbRows,nbRowsCont);

      var itemType = infos.itemTypes[item.type];

      var x0 = infos.leftMargin*scale;
      var x = x0 + (infos.cellSide * item.col + item.offsetX)* scale;
      var y0 = (infos.topMargin + infos.cellSide * craneH)*scale;
      var y = y0 + (infos.cellSide * item.row + item.offsetY + markerH) * scale;
      if(context.nbRows < nbRowsCont){
         y += infos.cellSide*(nbRowsCont - context.nbRows) * scale;
      }

      if(item.customDisplay !== undefined) {
         item.customDisplay(item,context);
      }
      if((infos.customItems) && (item.num < 90)){
         Object.assign(item,context.customItems[item.num]);
      }
      // console.log(item)
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
         if((infos.customItems) && (item.num < 90) && !defaultPath){
            var fileName = src.match(/^.+\/(\w+\.png)$/)[1];
            var newSrc = "assets/png/"+fileName;
            src = newSrc;
         }
         if(item.crusher && infos.crusherImgPath){
            src = infos.crusherImgPath;
         }
         var w = item.width || item.side;
         var h = item.height || item.side;
         item.element = paper.image(src, x, y, w * scale, h * scale);
         if(item.target && !item.targetImg){
            var op = (item.dark) ? 0 : 0.3;
            item.element.attr("opacity",op);
         }
         if(!item.target){
            if(infos.darkImgPath && infos.darkImgPath[item.num]){
               var darkSrcObj = (item.hidden && infos.darkImgPath[item.num].hidden) ? infos.darkImgPath[item.num].hidden : infos.darkImgPath[item.num].img;
            }else{
               var darkSrcObj = "crane/dark_default.png";
               var defaultPath = true;
            }
            var src = getImgPath(darkSrcObj);
            if((infos.customItems) && (item.num < 90) && !defaultPath){
               var fileName = src.match(/^.+\/(\w+\.png)$/)[1];
               var newSrc = "assets/png/"+fileName;
               src = newSrc;
            }
            var op = (item.dark) ? 1 : 0;
            item.darkElement = paper.image(src, x, y, w * scale, h * scale).attr("opacity",op);
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
      }else if(item.color !== undefined) {
         item.element = paper.rect(0, 0, item.side, item.side).attr({"fill": item.color});
      }
      if(item.faceItem){
         item.faceItemElement = addFaceItem(item);
      }
      if(item.shape){
         item.shapeElement = addShape(item);
      }
      if(item.type == "faceItem"){
         /* faceItem in craneContent */
         item.element = addFaceItem({ row: context.cranePosY, col: context.cranePos, faceItem: item.id });
      }

      if(resetZOrder)
         resetItemsZOrder(item.row, item.col);
   };
   
   var redisplayAllItems = function() {
      if(context.display !== true)
         return
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

   function addFaceItem(item) {
      var cSide = infos.cellSide * scale;
      var x0 = infos.leftMargin*scale;
      var x = x0 + cSide * item.col;
      var y0 = infos.topMargin*scale + cSide * craneH + markerH * scale;
      var y = y0 + cSide * item.row;

      var id = item.faceItem;
      var strId = (Number(id) < 10) ? "0" + id : id;
      var src = "assets/png/item_"+strId+".png";
      var op = 1;
      if(item.target){
         op = 0.3;
      }
      if(item.dark || item.hidden){
         op = 0;
      }

      return paper.image(src,x,y,cSide,cSide).attr("opacity",op);
   };

   function addShape(item) {
      var cSide = infos.cellSide * scale;
      var x = item.element.attr("x");
      var y = item.element.attr("y");
      var margin = 5;
      var r = cSide/5;
      var cx = x + cSide - r - margin;
      var cy = y + r + margin;

      var shapeID = item.shape[0];
      var colorID = item.shape[1];
      var shapeStr = ["circle","square","star","triangle","diamond"];
      var colors = ["red","green","blue","yellow","black","white"];

      var op = 1;
      if(item.target){
         op = 0.3;
      }
      if(item.dark || item.hidden){
         op = 0;
      }
      var attr = {
         stroke: "none",
         fill: colors[colorID],
         opacity: op
      };
      var shape;
      switch(shapeID){
      case 0: 
         shape = paper.circle(cx,cy,r);
         break
      case 1:
         var w = 2*r, h = w;
         shape = paper.rect(cx - w/2,cy - h/2,w,h);
         break
      default:
         shape = getShape(paper,shapeStr[shapeID],cx,cy,{radius: r});
      }
      
      return shape.attr(attr)
   };

   var redisplayMarkers = function() {
      if(context.display !== true)
         return
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
         var name = marker.name || "X";
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
         if(!marker.target){
            var bRect = paper.rect(xRect + 3,y0 - 3,mSide*scale,mSide*scale).attr(attr.backRect).toBack().hide();
            marker.element = paper.set(rect,text,pole,bRect);
         }else{
            var ini = context.initState;
            var op = (!context.programIsRunning && ini && ini.hideTarget) ? 0 : 0.3;
            marker.element = paper.set(rect,text,pole).attr("opacity",op);
         }

         for(var jMark = 0; jMark < context.markers.length; jMark++){
            if(iMark != jMark && col == context.markers[jMark].col && !context.markers[iMark].target && !context.markers[jMark].target){
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

   var redisplaySpotlight = function(resetZOrder) {
      if(context.display){
         if(!context.spotlight)
            return
         var { element, col } = context.spotlight;
         if(element){
            element.remove();
         }
         var cSide = infos.cellSide;
         var w = cSide*scale, h = w;
         var x0 = infos.leftMargin*scale;
         var y0 = infos.topMargin*scale;
         var x = x0 + col*w;
         var y = y0 + (markerH + 18)*scale;
         var spotlightH = (craneH + 0.5)*h;
         context.spotlight.element = paper.image(spotlightSrc,x,y,w,spotlightH);
         if(backgroundObj){
            for(var iElem = backgroundObj.length - 1; iElem >= 0; iElem--){
               backgroundObj[iElem].toBack();
            }
         }
         if(resetZOrder){
            resetCraneZOrder();
         }
      }
      updateDarkness();
   };

   function updateDarkness() {
      // if(context.display !== true){
      //    return
      // }
      let ini = context.initState;
      let dat = (!context.programIsRunning && ini && ini.dark) ? ini : context;
      // if(dat.dark.length == 0){
      //    return
      // }
      let { nbCols, nbRows } = context;
      let { dark, spotlight } = dat;
      for(let row = 0; row < nbRows; row++){
         for(let col = 0; col < nbCols; col++){
            let val = ((spotlight && spotlight.col == col) || dark.length == 0) ? 0 : dark[row][col];
            if(context.display){
               if(val){
                  cells[row][col].attr(darkCellAttr);
               }else{
                  cells[row][col].attr("fill","none");
               }
            }
            let items = context.getItemsOn(row,col);
            for(let item of items){
               item.dark = (val == 1 && (!spotlight || spotlight.col != col));
               if(context.display)
                  redisplayItem(item);
            }
         }
      }
      resetCraneZOrder();
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
         if(item.num == num && item.imgId == imgId && !item.target && !item.broken && !item.ini) {
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
      this.displayMessage("");
      // this.updateRunningState();
      var newPos = context.cranePos + dir;
      var ttg = context.tryToGo(newPos);
      if(ttg === true){
         if(this.cranePosY > -1 && !context.craneContent){
            context.tool = 1;
         }else{
            context.tool = 0;
         }
         updateTool();
         
         context.moveCrane(newPos, callback);
      }else if(ttg == false){
         context.waitDelay(callback);
      }else{
         context.moveCrane(context.cranePos + dir/2)
         throw ttg;
      }
   };

   context.shiftCraneY = function(dir,callback) {
      this.displayMessage("");
      // this.updateRunningState();
      var newPosY = context.cranePosY + dir;
      var ttg = context.tryToGoY(newPosY);
      if(ttg === true){
         if(!context.craneContent){
            context.tool = 1;
         }else{
            context.tool = 0;
         }
         context.moveCraneY(newPosY, callback);
      }else if(ttg == false){
         context.waitDelay(callback);
      }else{
         // context.moveCraneY(context.cranePosY + dir/2)
         throw ttg;
      }
   };

   context.goToMarker = function(value,callback) {
      this.displayMessage("");
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
      this.displayMessage("");
      var topBlock = takeIntro();
      takeAnimDelay = 0.5*infos.actionDelay;
      
      if(context.display) {
         // resetCraneZOrder();
         // updateOverlay();
         resetAnimZOrder();
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
         var delay = 2*takeAnimDelay*(topBlock.row + 1) + 2*infos.actionDelay; // additional actionDelay to prevent bug with shape anim
         // var delay = 2*takeAnimDelay*(topBlock.row + 1) + infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   function takeIntro(flip) {
      if(context.craneContent != undefined){
         throw(context.strings.messages.holdingBlock);
      }
      context.tool = 0;
      if(context.display){
         updateTool();
      }
      var currPos = context.cranePos;
      var currPosY = context.cranePosY;
      // console.log(currPosY)
      if(currPosY == -1){
         var topBlock = context.findTopBlock(currPos);
         if(!topBlock || topBlock.num == 1){
            if(!context.display){
               throw(context.strings.messages.nothingToTake);
            }
            topBlock.row = topBlock.row - 1;
            // callback = null;
         }
         if(!topBlock.isMovable && topBlock.num != 1){
            throw(context.strings.messages.notMovable);
         }
      }else{
         var items = context.getItemsOn(currPosY, currPos, obj=>!obj.target && !obj.isMask && !obj.ini);
         if(items.length > 0){
            var topBlock = items[0];
         }else{
            throw(context.strings.messages.emptyCell);
         }
      }

      if(topBlock.num != 1){
         var withdrawables = context.getItemsOn(topBlock.row, topBlock.col, obj=>!obj.target && !obj.isMask && !obj.ini);

         var withdrawable = withdrawables[0];

         context.setIndexes();
         context.items.splice(withdrawable.index, 1);
         context.craneContent = withdrawable;
      }
      // console.log("takeIntro",topBlock.dark)
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
      // console.log("takeAnimDown",this.cranePosY)
      if(topBlock.row == this.cranePosY){
         resetAnimZOrder(true);
      }
      var craneAttr = getCraneAttr();
      var delay = Math.max(takeAnimDelay,takeAnimDelay*(topBlock.row - this.cranePosY));
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
      // console.log("takeAnimUp",topBlock.row,newRow)
      /* default crane row = -1 */
      var craneAttr = getCraneAttr();
      var delay = takeAnimDelay*(topBlock.row - newRow);
      var cSide = infos.cellSide;

      var catchOffsetY = topBlock.catchOffsetY || 0;

      var deltaY = (newRow - this.cranePosY)*cSide*scale;
      var newItemY = (infos.topMargin + clawsOffsetY + craneItemOffset - catchOffsetY + topBlock.offsetY + markerH)*scale + deltaY + (this.cranePosY + 1)*cSide*scale ;
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

      if(topBlock.darkElement){
         var op = (topBlock.dark && newRow > -1) ? 1 : 0;
         var animDark = new Raphael.animation({ y: newItemY, opacity: op },delay);
         context.raphaelFactory.animate("animCrane_dark" + Math.random(), topBlock.darkElement, animDark);
      }
      if(topBlock.faceItemElement){
         if(topBlock.dark && newRow == -1 && !topBlock.hidden){
            var animFaceItem = new Raphael.animation({ y: newItemY, opacity: 1 },delay);
         }else{
            var animFaceItem = new Raphael.animation({ y: newItemY },delay);
         }
         context.raphaelFactory.animate("animCrane_face_item" + Math.random(), topBlock.faceItemElement, animFaceItem);
      }
      if(topBlock.shapeElement){
         var itemAttr = itemAttributes(topBlock);
         var dy = newItemY - itemAttr.y; 
         var transform = "...t,0,"+dy;
         if(topBlock.dark && newRow == -1 && !topBlock.hidden){
            var animShape = new Raphael.animation({ transform, opacity: 1 },delay, function() {
               // topBlock.shapeElement.remove();
               // topBlock.shapeElement = addShape(topBlock);
            });
         }else{
            var animShape = new Raphael.animation({ transform },delay, function() {
               // topBlock.shapeElement.remove();
               // topBlock.shapeElement = addShape(topBlock);
            });
         }
         context.raphaelFactory.animate("animCrane_shape" + Math.random(), topBlock.shapeElement, animShape);
      }
   };

   context.flip = function(callback) {
      this.displayMessage("");
      var topBlock = takeIntro(true);
      // console.log("takeAndFlip",topBlock.dark)
      takeAnimDelay = infos.actionDelay*0.5;
      if(topBlock != 1){
         topBlock.hidden = !topBlock.hidden;
      }
      if(context.display) {
         resetAnimZOrder();
         if(context.animate && infos.actionDelay > 0){
            context.takeAndFlipAnim(topBlock);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
         }else{
            // var craneAttr = getCraneAttr();
            // setCraneAttr(craneAttr);
            if(topBlock.num == 1){
               throw(context.strings.messages.nothingToTake);
            }
            putDownIntro();
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            redisplayItem(topBlock);
            resetAnimZOrder();
         }
      }else{
         putDownIntro();
      }

      // context.advanceTime(1);
      if(callback){
         var delay = 2*Math.max(takeAnimDelay,takeAnimDelay*(topBlock.row - this.cranePosY)) + 2*takeAnimDelay + 4*infos.actionDelay;
         // var delay = 2*takeAnimDelay*(topBlock.row + 4) + 4*infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   context.takeAndFlipAnim = function(topBlock) {
      this.takeAnimDown(topBlock,function() {
         if(topBlock.num == 1){
            return
         }
         context.takeAnimUp(topBlock,topBlock.row - 1,function() {
            context.flipAnim(topBlock, function() {
               var { tempItem } = putDownIntro();
               context.putDownAnimDown(tempItem,topBlock.row - 1, function() {
                  context.putDownAnimUp(topBlock.row);
               });
            })     
         });
      });
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

      var cyLeftDown = craneAttr.cyLeft + deltaY - (this.cranePosY + 1)*cSide*scale;
      var cyRightDown = craneAttr.cyRight + deltaY - (this.cranePosY + 1)*cSide*scale;
      var cx = x + w/2;
      var delay = infos.actionDelay;

      var deltaY = (item.row)*cSide*scale;
      var newItemY = (infos.topMargin + clawsOffsetY + craneItemOffset /*- catchOffsetY*/ + item.offsetY + markerH)*scale + deltaY;
      var dyShape = newItemY - itemAttr.y;
      

      var anim1 = new Raphael.animation({ "transform": ["S",0,1,cx,y] },delay,function(){
         redisplayItem(item,true);
         item.element.attr({ y, transform: ["S",0,1,cx,y] });
         if(item.darkElement)
            item.darkElement.attr({ y, transform: ["S",0,1,cx,y] });
         if(item.faceItemElement){
            var opacity = (item.hidden || item.dark) ? 0 : 1;
            item.faceItemElement.attr({ y, transform: ["S",0,1,cx,y], opacity });
         }
         if(item.shapeElement){
            var opacity = (item.hidden || item.dark) ? 0 : 1;
            item.shapeElement.attr({ transform: "s,0,1,"+cx+","+y+"t,0,"+dyShape, opacity });
         }
         resetAnimZOrder();

         context.raphaelFactory.animate("animFlip2_" + Math.random(), item.element, anim2);
         context.raphaelFactory.animate("animFlip2_clawR" + Math.random(), crane.rightClaw, anim2ClawR);
         context.raphaelFactory.animate("animFlip2_clawL" + Math.random(), crane.leftClaw, anim2ClawL);
         if(item.darkElement)
            context.raphaelFactory.animate("animFlip2_dark_" + Math.random(), item.darkElement, anim2Dark);
         if(item.faceItemElement)
            context.raphaelFactory.animate("animFlip2_face_item" + Math.random(), item.faceItemElement, anim2Dark);
         if(item.shapeElement)
            context.raphaelFactory.animate("animFlip2_shape" + Math.random(), item.shapeElement, anim2Shape);
      });
      var anim1Dark = new Raphael.animation({ "transform": "...s,0,1,"+cx+","+y },delay);
      var anim2 = new Raphael.animation({ "transform": ["S",1,1,cx,y] },delay,callback);
      var anim2Dark = new Raphael.animation({ "transform": ["S",1,1,cx,y] },delay);
      var anim2Shape = new Raphael.animation({ "transform": "s,1,1t,0,"+dyShape },delay);
      var anim2ClawR = new Raphael.animation({ "transform": ["R",clutchAngle,craneAttr.cxRight,cyRightDown,"S",1,1,cx,y] },delay);
      var anim2ClawL = new Raphael.animation({ "transform": ["R",-clutchAngle,craneAttr.cxLeft,cyLeftDown,"S",1,1,cx,y] },delay);

      context.raphaelFactory.animate("animFlip1_item" + Math.random(), item.element, anim1);
      context.raphaelFactory.animate("animFlip1_clawR" + Math.random(), crane.rightClaw, anim1);
      context.raphaelFactory.animate("animFlip1_clawL" + Math.random(), crane.leftClaw, anim1);
      if(item.darkElement)
         context.raphaelFactory.animate("animFlip1_dark_item" + Math.random(), item.darkElement, anim1Dark);
      if(item.faceItemElement)
         context.raphaelFactory.animate("animFlip1_face_item" + Math.random(), item.faceItemElement, anim1Dark);
      if(item.shapeElement)
         context.raphaelFactory.animate("animFlip1_shape" + Math.random(), item.shapeElement, anim1Dark);
   };

   context.putDown = function(callback) {
      this.displayMessage("");
      var { tempItem } = putDownIntro();
      takeAnimDelay = 0.5*infos.actionDelay;
      // console.log("putDown",tempItem.dark)
      if(context.display) {
         if(context.animate && infos.actionDelay > 0){
            context.putDownAnim(tempItem,-1);
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            redisplayItem(tempItem,false);
            resetAnimZOrder();
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

   function putDownIntro(drop) {
      if(!context.craneContent){
         throw(context.strings.messages.emptyCrane);
      }
      if(context.craneContent.type == "faceItem"){
         throw(context.strings.messages.notFaceItem);
      }
      if(drop && !context.craneContent.wrecking && !context.craneContent.isDie && !infos.dropAllBlocks){
         throw(context.strings.messages.notWrecking);
      }

      var currPos = context.cranePos;
      var topBlock = context.findTopBlock(currPos);

      if(!topBlock || topBlock.row == 0){
         throw(context.strings.messages.cannotDrop);
      }

      if(drop){
         var newRow = (topBlock.num == 1 || !context.craneContent.wrecking) ? topBlock.row - 1 : topBlock.row;
      }else{
         var newRow = topBlock.row - 1;
      }

      var newCol = currPos;
      context.craneContent.row = newRow;
      context.craneContent.col = newCol;
      var tempItem = context.craneContent;

      if(context.dark.length > 0 && context.dark[newRow][newCol]){
         tempItem.dark = (context.spotlight && context.spotlight.col == newCol) ? false : true;
      }else{
         tempItem.dark = false;
      }

      
      context.items.push(tempItem);
      context.setIndexes();
      context.craneContent = undefined;
      
      return { tempItem, topBlock }
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

      if(item.dark){
         var animDark = new Raphael.animation({ y: itemAttr.y, opacity: 1 },delay);
         context.raphaelFactory.animate("animCrane_dark" + Math.random(), item.darkElement, animDark);
      }
      if(item.faceItemElement){
         var op = (item.dark || item.hidden) ? 0 : 1;
         var animFaceItem = new Raphael.animation({ y: itemAttr.y, opacity: op },delay);
         context.raphaelFactory.animate("animCrane_face_item" + Math.random(), item.faceItemElement, animFaceItem);
      }
      if(item.shapeElement){
         var dy = itemAttr.y - item.element.attr("y");
         var op = (item.dark || item.hidden) ? 0 : 1;
         var animShape = new Raphael.animation({ transform: "...t,0,"+dy , opacity: op },delay, function() {
            item.shapeElement.remove();
            item.shapeElement = addShape(item);
            overlayToFront();
         });
         context.raphaelFactory.animate("animCrane_shape" + Math.random(), item.shapeElement, animShape);
      }
   };

   context.putDownAnimUp = function(row,callback) {
      var craneAttr = getCraneAttr();
      var delay = Math.max(takeAnimDelay,takeAnimDelay*(row - this.cranePosY));
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
      this.displayMessage("");
      var { tempItem, topBlock } = putDownIntro(true);

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
            resetAnimZOrder();
         }
      }else{
         rollDie(tempItem);
      }
      if(!context.display || !context.animate || infos.actionDelay == 0){
         if(topBlock.num > 1 && tempItem.wrecking){
            context.destroy(topBlock);
         }
      }


      if(callback){
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
         if(topBlock && topBlock.num > 1 && item.wrecking){
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
      });
      // context.addSound("wreckingBall_fall");
      context.raphaelFactory.animate("animCrane_open_rightClaw_" + Math.random(), crane.rightClaw, animOpenRightClaw);
      context.raphaelFactory.animate("animCrane_open_leftClaw_" + Math.random(), crane.leftClaw, animOpenLeftClaw);
      context.raphaelFactory.animate("animCrane_item_down" + Math.random(), item.element, animItemDown);

      if(context.dark.length > 0){
         var { row, col } = item;
         if(context.dark[row][col] && item.darkElement){
            var animDark = new Raphael.animation({ y: itemAttr.y, opacity: 1 },delay,"<",function() {
               item.dark = 1;
            });
            context.raphaelFactory.animate("animCrane_dark" + Math.random(), item.darkElement, animDark);
         }
      }
      if(item.faceItemElement){
         var opacity = (item.dark || item.hidden) ? 0 : 1;
         var animFaceItem = new Raphael.animation({ y: itemAttr.y, opacity },delay,"<");
         context.raphaelFactory.animate("animCrane_face_item" + Math.random(), item.faceItemElement, animFaceItem);
      }
      if(item.shapeElement){
         var dy = itemAttr.y - (craneAttr.yClaws + (craneItemOffset + item.offsetY)*scale);
         var op = (item.dark || item.hidden) ? 0 : 1;
         var animShape = new Raphael.animation({ transform: "...t,0,"+dy , opacity: op },delay,"<");
         context.raphaelFactory.animate("animCrane_shape" + Math.random(), item.shapeElement, animShape, function() {
            item.shapeElement.remove();
            item.shapeElement = addShape(item);
            overlayToFront();
         });
      }

   };

   function rollDie(item) {
      if(context.dieValues){
         context.rollDieIndex++;
      }else{
         context.dieValue = 1;
      }
      redisplayItem(item);
   };

   context.detach = function(callback) {
      this.displayMessage("");
      if(context.display)
         resetAnimZOrder();
      context.tool = 0;
      updateTool();
      let row = context.cranePosY;
      let col = context.cranePos;
      let items = this.getItemsOn(row, col, obj => !obj.target && !obj.ini);
      if(items.length == 0){
         throw(context.strings.messages.emptyCell);
      }
      let item = items[0];
      if(!item.faceItem){
         throw(context.strings.messages.noFaceItem);
      }
      if(item.hidden){
         throw(context.strings.messages.cannotDetachHidden);
      }
      context.craneContent = { type: "faceItem", id: item.faceItem, element: item.faceItemElement, offsetY: 32, offsetX: 0 }
      item.faceItem = null;
      item.faceItemElement = null;
      
      if(context.display) {
         if(context.animate && infos.actionDelay > 0){
            context.detachAnim();
         }else{
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
         }
      }

      if(callback){
         var delay = 2.7*infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   context.detachAnim = function() {
      var craneAttr = getCraneAttr();
      var delay = infos.actionDelay;
      var deltaY = detachDeltaY*scale;
      var lineClip = Beav.Object.clone(craneAttr.lineClip);
      lineClip[3] = craneAttr.lineClip[3] + deltaY;
      var cSide = infos.cellSide;
      var yItem = craneAttr.yClaws + (craneFaceItemOffsetY + cSide/2)*scale;

      var animLineUp = new Raphael.animation({ "clip-rect": lineClip },delay);
      var animShaftUp = new Raphael.animation({ y: craneAttr.yShaft + deltaY },delay);
      var animRightClawUp = new Raphael.animation({ y: craneAttr.yClaws + deltaY },delay);
      var animLeftClawUp = new Raphael.animation({ y: craneAttr.yClaws + deltaY },delay,function() {
         resetAnimZOrder();
         context.raphaelFactory.animate("animCrane_rightClaw_close" + Math.random(), crane.rightClaw, animCloseRightClaw);
         context.raphaelFactory.animate("animCrane_leftClaw_close" + Math.random(), crane.leftClaw, animCloseLeftClaw);
      });

      var animCloseRightClaw = new Raphael.animation({ transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight + deltaY] },delay);
      var animCloseLeftClaw = new Raphael.animation({ transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft + deltaY] },delay,function() {
         // context.raphaelFactory.animate("animCrane_line_up_2" + Math.random(), crane.line, animLineUp2);
         // context.raphaelFactory.animate("animCrane_shaft_up_2" + Math.random(), crane.shaft, animShaftUp2);
         // context.raphaelFactory.animate("animCrane_rightClaw_up2" + Math.random(), crane.rightClaw, animRightClawUp2);
         // context.raphaelFactory.animate("animCrane_leftClaw_up2" + Math.random(), crane.leftClaw, animLeftClawUp2);
         // context.raphaelFactory.animate("animItem" + Math.random(), context.craneContent.element, animItem);
         context.craneContent.element.attr("opacity",1);
         context.delayFactory.createTimeout("setCraneAttr", function() {
            setCraneAttr(craneAttr);
            overlayToFront();
         }, delay*0.2);
      });

      // var animLineUp2 = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay*0.2,"<");
      // var animShaftUp2 = new Raphael.animation({ y: craneAttr.yShaft },delay*0.2,"<");
      // var animRightClawUp2 = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight ] },delay*0.2,"<");
      // var animLeftClawUp2 = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft ] },delay*0.2,"<");
      // var animItem = new Raphael.animation({ y: yItem },delay*0.2,"<");

      context.raphaelFactory.animate("animCrane_line_up_" + Math.random(), crane.line, animLineUp);
      context.raphaelFactory.animate("animCrane_shaft_up_" + Math.random(), crane.shaft, animShaftUp);
      context.raphaelFactory.animate("animCrane_rightClaw_up" + Math.random(), crane.rightClaw, animRightClawUp);
      context.raphaelFactory.animate("animCrane_leftClaw_up" + Math.random(), crane.leftClaw, animLeftClawUp);
   };

   context.attach = function(callback) {
      this.displayMessage("");
      if(!context.craneContent || context.craneContent.type != "faceItem"){
         throw(context.strings.messages.emptyCraneFaceItem);
      }
      let row = context.cranePosY;
      let col = context.cranePos;
      let items = this.getItemsOn(row, col, obj => !obj.target && !obj.ini);
      if(items.length == 0){
         throw(context.strings.messages.emptyCell);
      }
      let item = items[0];
      if(item.isDie || item.wrecking){
         throw(context.strings.messages.cannotAttach);
      }
      if(item.hidden){
         throw(context.strings.messages.cannotAttachHidden);
      }
      if(item.faceItem){
         throw(context.strings.messages.alreadyHaveFaceItem);
      }
      
      // context.craneContent = { type: "faceItem", id: item.faceItem, element: item.faceItemElement, offsetY: 32, offsetX: 0 }
      item.faceItem = context.craneContent.id;
      item.faceItemElement = context.craneContent.element;
      context.craneContent = null;
      
      if(context.display) {
         // context.tool = 1;
         if(context.animate && infos.actionDelay > 0){
            context.attachAnim(item);
         }else{
            redisplayItem(item);
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
            // updateTool();
         }
      }

      if(callback){
         var delay = 2.5*infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   context.attachAnim = function(item) {
      var craneAttr = getCraneAttr();
      var delay = infos.actionDelay;
      var deltaY = detachDeltaY*scale;

      var offsetY = craneFaceItemOffsetY*scale;

      var lineClip = Beav.Object.clone(craneAttr.lineClip);
      lineClip[3] = craneAttr.lineClip[3] + offsetY;
      var cSide = infos.cellSide;
      var itemAttr = itemAttributes(item);
      var opacity = (item.dark) ? 0 : 1;

      crane.line.attr("clip-rect",lineClip);
      crane.shaft.attr("y", craneAttr.yShaft + offsetY);
      crane.rightClaw.attr({ y: craneAttr.yClaws + offsetY, transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight + offsetY] });
      crane.leftClaw.attr({ y: craneAttr.yClaws + offsetY, transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft + offsetY] });
      item.faceItemElement.attr({ y: itemAttr.y, opacity });

      context.delayFactory.createTimeout("setCraneAttr", function() {
         context.raphaelFactory.animate("animCrane_rightClaw_open" + Math.random(), crane.rightClaw, animOpenRightClaw);
         context.raphaelFactory.animate("animCrane_leftClaw_open" + Math.random(), crane.leftClaw, animOpenLeftClaw);
      }, delay*0.2);

      var animOpenRightClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxRight,craneAttr.cyRight + offsetY] },delay);
      var animOpenLeftClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxLeft,craneAttr.cyLeft + offsetY] },delay,function() {
         resetCraneZOrder();
         context.raphaelFactory.animate("animCrane_line_down" + Math.random(), crane.line, animLineDown);
         context.raphaelFactory.animate("animCrane_shaft_down" + Math.random(), crane.shaft, animShaftDown);
         context.raphaelFactory.animate("animCrane_rightClawdown" + Math.random(), crane.rightClaw, animClaws);
         context.raphaelFactory.animate("animCrane_leftClawdown" + Math.random(), crane.leftClaw, animClaws);
      });

      var animLineDown = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay/*,updateTool*/);
      var animShaftDown = new Raphael.animation({ y: craneAttr.yShaft },delay);
      var animClaws = new Raphael.animation({ y: craneAttr.yClaws },delay);
   };  

   context.destroyFaceItem = function(callback) {
      this.displayMessage("");

      let tempItem = this.craneContent;
      this.craneContent = null;
      if(this.display){
         resetAnimZOrder();
         if(this.animate && infos.actionDelay > 0){
            this.destroyFaceItemAnim(tempItem);
         }else{
            tempItem.element.remove()
            var craneAttr = getCraneAttr();
            setCraneAttr(craneAttr);
         }
      }

      if(callback){
         var delay = 2*infos.actionDelay;
         context.waitDelay(callback,null,delay);
      }
   };

   context.destroyFaceItemAnim = function(tempItem) {
      var craneAttr = getCraneAttr();
      var delay = infos.actionDelay;
      var deltaY = detachDeltaY*scale;

      var offsetY = craneFaceItemOffsetY*scale;

      var lineClip = Beav.Object.clone(craneAttr.lineClip);
      lineClip[3] = craneAttr.lineClip[3] + offsetY;
      var cSide = infos.cellSide;

      crane.line.attr("clip-rect",lineClip);
      crane.shaft.attr("y", craneAttr.yShaft + offsetY);
      crane.rightClaw.attr({ y: craneAttr.yClaws + offsetY, transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight + offsetY] });
      crane.leftClaw.attr({ y: craneAttr.yClaws + offsetY, transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft + offsetY] });
      tempItem.element.remove();

      var animOpenRightClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxRight,craneAttr.cyRight + offsetY] },delay);
      var animOpenLeftClaw = new Raphael.animation({ transform: ["R",0,craneAttr.cxLeft,craneAttr.cyLeft + offsetY] },delay,function() {
         resetAnimZOrder();
         context.raphaelFactory.animate("animCrane_line_down" + Math.random(), crane.line, animLineDown);
         context.raphaelFactory.animate("animCrane_shaft_down" + Math.random(), crane.shaft, animShaftDown);
         context.raphaelFactory.animate("animCrane_rightClawdown" + Math.random(), crane.rightClaw, animClaws);
         context.raphaelFactory.animate("animCrane_leftClawdown" + Math.random(), crane.leftClaw, animClaws);
      });
      context.raphaelFactory.animate("animCrane_rightClaw_open" + Math.random(), crane.rightClaw, animOpenRightClaw);
      context.raphaelFactory.animate("animCrane_leftClaw_open" + Math.random(), crane.leftClaw, animOpenLeftClaw);
      var animLineDown = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay/*,updateTool*/);
      var animShaftDown = new Raphael.animation({ y: craneAttr.yShaft },delay);
      var animClaws = new Raphael.animation({ y: craneAttr.yClaws },delay);
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
      if(context.craneContent && context.craneContent.type != "faceItem"){
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
      context.cranePos = newCol;
      
      if(context.display) {
         var craneAttr = getCraneAttr();
         if(infos.actionDelay > 0) {
            var delay = infos.actionDelay*Math.abs(newCol - oldPos);
            if(animate && context.animate) {
               var anim = new Raphael.animation({ x: craneAttr.xWheels },delay,function() {
                  context.addSound("crane_stop");
               });
               var animLine = new Raphael.animation({ x: craneAttr.x, "clip-rect": craneAttr.lineClip },delay);
               var animShaft = new Raphael.animation({ x: craneAttr.xShaft },delay);
               var animSensor = new Raphael.animation({ x: craneAttr.xSensor },delay);
               var angle = (context.craneContent) ? clutchAngle : 0;
               var animLeftClaw = new Raphael.animation({ x: craneAttr.xLeftClaw, transform: ["R",-angle,craneAttr.cxLeft,craneAttr.cyLeft] },delay);
               var animRightClaw = new Raphael.animation({ x: craneAttr.xRightClaw, transform: ["R",angle,craneAttr.cxRight,craneAttr.cyRight] },delay);
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
                  if(item.darkElement){
                     context.raphaelFactory.animate("animCrane_dark_item_" + Math.random(), item.darkElement, animItem);
                  }
                  if(item.faceItemElement){
                     context.raphaelFactory.animate("animCrane_face_item_" + Math.random(), item.faceItemElement, animItem);
                  }
                  if(item.shapeElement){
                     var dx = (newCol - oldPos)*infos.cellSide*scale;
                     var animShape = new Raphael.animation({ transform: "...t,"+dx+",0" },delay,function() {
                        // item.shapeElement.remove();
                        // item.shapeElement = addShape(item);
                     });
                     context.raphaelFactory.animate("animCrane_shape_" + Math.random(), item.shapeElement, animShape);
                  }
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
         context.waitDelay(callback, null, delay + infos.actionDelay); // additional actionDelay to prevent bug with shape anim
      }
   };

   context.moveCraneY = function(newRow, callback) {
      var animate = (context.cranePosY != newRow);
      
      var oldPos = context.cranePosY;
      context.cranePosY = newRow;
      
      if(context.display) {
         var craneAttr = getCraneAttr();
         var content = context.craneContent;
         if(infos.actionDelay > 0) {
            updateTool();
            var delay = infos.actionDelay*Math.abs(newRow - oldPos);
            // console.log(infos.actionDelay,delay)
            if(animate && context.animate) {
               var animLine = new Raphael.animation({ "clip-rect": craneAttr.lineClip },delay);
               var animSensor = new Raphael.animation({ y: craneAttr.ySensor },delay);
               if(!content){
                  var animClawR = new Raphael.animation({ y: craneAttr.yClaws },delay);
                  var animClawL = new Raphael.animation({ y: craneAttr.yClaws },delay);
               }else{
                  var animClawR = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",clutchAngle,craneAttr.cxRight,craneAttr.cyRight] },delay);
                  var animClawL = new Raphael.animation({ y: craneAttr.yClaws, transform: ["R",-clutchAngle,craneAttr.cxLeft,craneAttr.cyLeft] },delay);
                  var yItem = craneAttr.yClaws + (craneFaceItemOffsetY + infos.cellSide/2)*scale;
                  var animItem = new Raphael.animation({ y: yItem },delay);
               }
              
               var animShaft = new Raphael.animation({ y: craneAttr.yShaft },delay);
              
               context.raphaelFactory.animate("animCrane_line_" + Math.random(), crane.line, animLine);
               context.raphaelFactory.animate("animCrane_sensor_" + Math.random(), crane.sensor, animSensor);
               context.raphaelFactory.animate("animCrane_shaft_" + Math.random(), crane.shaft, animShaft);
               context.raphaelFactory.animate("animCrane_clawR_" + Math.random(), crane.rightClaw, animClawR);
               context.raphaelFactory.animate("animCrane_clawL_" + Math.random(), crane.leftClaw, animClawL);
               if(content){
                  context.raphaelFactory.animate("animCrane_item_" + Math.random(), content.element, animItem);
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

   context.addSound = function(name) {
      $("#noise").remove();
      $("body").append("<audio src='"+getSoundPath(name)+".mp3' autoplay id='noise'></audio>");
      var vol = (context.soundEnabled) ? 1 : 0;
      $("audio").prop('volume', vol);
   };

   context.placeMarker = function(value) {
      this.displayMessage("");
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

   context.placeSpotlight = function() {
      this.displayMessage("");
      var col = this.cranePos;

      if(this.spotlight){
         this.spotlight.col = col;
      }else{
         this.spotlight = { col }
      }
      // if(context.display) {
         redisplaySpotlight(true);
      // }
   };

   context.drawShape = function(shape,color) {
      this.displayMessage("");

      let row = context.cranePosY;
      let col = context.cranePos;
      let items = this.getItemsOn(row,col, obj => !obj.target && !obj.ini);
      if(row < 0){
         throw(strings.messages.wrongCoordinates)
      }
      if(items.length == 0){
         throw(strings.messages.emptyCell)
      }
      let item = items[0];
      if(item.shape){
         throw(strings.messages.alreadyHasShape)
      }
      if(item.hidden){
         throw(strings.messages.alreadyHasShape)
      }

      let shapeStrID = {"circle": 0, "rond": 0, "square": 1, "carré": 1, "carre": 1,"star": 2, "étoile": 2, "etoile": 2, "triangle": 3, "diamond": 4, "losange": 4 };
      let colorStrID = { "red": 0, "rouge": 0, "green": 1, "vert": 1, "blue": 2, "bleu": 2, "yellow": 3, "jaune": 3, "black": 4, "noir": 4, "white": 5, "blanc": 5 };
      if(!shapeStrID.hasOwnProperty(shape)){
         throw(strings.messages.unknownShape)
      }
      if(!colorStrID.hasOwnProperty(color)){
         throw(strings.messages.unknownColor)
      }

      let shapeID = shapeStrID[shape];
      let colorID = colorStrID[color];
      item.shape = [shapeID,colorID];

      if(context.display){
         item.shapeElement = addShape(item);
         resetAnimZOrder();
      }
   };

   context.eraseShape = function() {
      let row = context.cranePosY;
      let col = context.cranePos;
      let items = this.getItemsOn(row,col, obj => !obj.target && !obj.ini);
      if(row < 0){
         throw(strings.messages.wrongCoordinates)
      }
      if(items.length == 0){
         throw(strings.messages.emptyCell)
      }
      let item = items[0];
      if(!item.shape){
         throw(strings.messages.noShape)
      }
      item.shape = null;
      if(this.display && item.shapeElement){
         item.shapeElement.remove();
         item.shapeElement = null;
      }
   };

   context.displayMessage = function(str) {
      context.message = str;
      updateMessage();
      // console.log(str)
   };

   context.conjure = function(id) {
      if(!this.conjureItems.includes(Number(id))){
         throw(strings.messages.notConjurable)
      }
      if(this.craneContent){
         throw(strings.messages.holdingBlock)
      }
      context.tool = 0;
      updateTool();
      var itemTypeById = {};
      for(var type in infos.itemTypes) {
         var itemType = infos.itemTypes[type];
         if(itemType.id != undefined) {
            itemTypeById[itemType.id] = type;
         }
      }
      var itemData = this.getItemData(id + 1);
      resetItem({
         row: 0,
         col: this.cranePos,
         type: itemTypeById[id],
         imgId: itemData.imgId,
         conjuration: true    // dev
      }, true);
      var it = context.getItemsOn(0,context.cranePos, obj => !obj.target && !obj.ini);
      this.setIndexes();
      this.items.splice(it[0].index, 1);
      this.craneContent = it[0];
      if(this.display){
         var craneAttr = getCraneAttr();
         setCraneAttr(craneAttr);
         updateOverlay();
      }
   };

   context.conjureFaceItem = function(id) {
      if(!this.conjureFaceItems.includes(Number(id))){
         throw(strings.messages.notConjurableFaceItem)
      }
      if(this.craneContent){
         throw(strings.messages.holdingBlock)
      }
      
      this.displayMessage("");
      context.tool = 0;
      updateTool();
      
      if(this.display){
         var element = addFaceItem({ faceItem: id, col: this.cranePos, row: this.cranePosY })
         this.craneContent = { type: "faceItem", id, element, offsetY: 32, offsetX: 0 };
         var craneAttr = getCraneAttr();
         setCraneAttr(craneAttr);
         updateOverlay();
      }else{
         this.craneContent = { type: "faceItem", id, offsetY: 32, offsetX: 0 };
      }
   };

   function updateMessage() {
      if(!context.display){
         return
      }
      if(context.messageElement){
         context.messageElement.remove();
      }
      let msg = context.message;
      if(!msg){
         return
      }
      let a = infos.messageAttr;
      let x0 = infos.leftMargin*scale;
      let y0 = infos.topMargin*scale;
      let cSide = infos.cellSide*scale;
      let { nbRows, nbCols } = context;

      let cx = x0 + nbCols*cSide/2;
      let cy = y0 + markerH*scale;

      let text = paper.text(cx,cy,msg).attr(a.text);
      let bbox = text.getBBox();
      let { x, y, width, height } = bbox;
      let marginX = 20;
      let marginY = 10;
      let xRect = x - marginX;
      let yRect = cy;
      let w = width + 2*marginX;
      let h = height + 2*marginY;
      let rect = paper.rect(xRect,yRect,w,h).attr(a.rect);
      cy += h/2;
      text.attr("y",cy).toFront();

      context.messageElement = paper.set(rect,text);
   };

   function updateUnderlay() {
      if(!context.display || !context.underlay){
         return
      }
      if(!context.programIsRunning && context.initState && context.initState.underlay === false){
         return
      }
      let un = (!context.programIsRunning && context.initState && context.initState.underlay) ? context.initState.underlay : context.underlay;
      let pos1 = un.pos[0];
      let pos2 = un.pos[1];
      let { x, y } = context.getCellCoord(pos1[1],pos1[0]);
      let coord2 = context.getCellCoord(pos2[1],pos2[0]);
      let width = coord2.x - x;
      let height = coord2.y - y;
      if(un.element){
         un.element.remove();
      }
      // un.element = paper.image(un.src,x,y,width,height).toFront();
      un.element = paper.image(un.src,x,y,width,height).toBack();
   };

   function updateOverlay() {
      // console.log(context.initState)
      if(!context.display || !context.overlay){
         return
      }
      if(!context.programIsRunning && context.initState && context.initState.overlay === false){
         return
      }
      let ov = (!context.programIsRunning && context.initState && context.initState.overlay) ? context.initState.overlay : context.overlay;
      let pos1 = ov.pos[0];
      let pos2 = ov.pos[1];
      let { x, y } = context.getCellCoord(pos1[1],pos1[0]);
      let coord2 = context.getCellCoord(pos2[1],pos2[0]);
      let width = coord2.x - x;
      let height = coord2.y - y;
      if(ov.element){
         ov.element.remove();
      }
      ov.element = paper.image(ov.src,x,y,width,height).toFront();
   };

   context.destroy = function(item) {
      context.setIndexes();
      context.items.splice(item.index, 1);

      if(context.display) {
         item.element.remove();
         if(item.darkElement)
           item.darkElement.remove();
         if(item.faceItemElement)
           item.faceItemElement.remove();
         if(item.shapeElement)
           item.shapeElement.remove();
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

   if(infos.craneImgPath){
      for(var key in infos.craneImgPath){
         res.push({ type: 'image', url: infos.craneImgPath[key] });
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
   res.push({ type: 'image', url: spotlightUrl });

   var data = subTask.data;
   var newUrl = [];
   // console.log(data)
   for(var level in data){
      for(var iLev = 0; iLev < data[level].length; iLev++){
         var tiles = data[level][iLev].tiles;
         var broken = data[level][iLev].broken;
         var hidden = data[level][iLev].hidden;
         var dark = data[level][iLev].dark;
         var faceItems = data[level][iLev].faceItems;
         var customItems = data[level][iLev].customItems;
         var successAnim = data[level][iLev].successAnim;
         var overlay = data[level][iLev].overlay;
         var underlay = data[level][iLev].underlay;
         var nbRows = tiles.length;
         var nbCol = tiles[0].length;
         for(var row = 0; row < nbRows; row++){
            for(var col = 0; col < nbCol; col++){
               var id = tiles[row][col];
               if(id > 1 && id < 90){
                  var strId = "" + (id - 1);
                  if (id <= 10) {
                     strId = "0" + strId;
                  }
                  var urlStr = "assets/png/"+strId+".png";
                  var urls = [urlStr];
                  var urlH = "assets/png/hidden_"+strId+".png";
                  urls.push(urlH);
                  if(dark && dark.length > 0){
                     if(infos.darkImgPath && infos.darkImgPath[id] && infos.darkImgPath[id].img){
                        urls.push(infos.darkImgPath[id].img);
                     }else{
                        urls.push("crane/dark_default.png");
                     }
                    if(infos.darkImgPath && infos.darkImgPath[id] && infos.darkImgPath[id].hidden){
                        urls.push(infos.darkImgPath[id].hidden);
                     }
                  }
                  if(broken && broken.length > 0 && broken[row][col]){
                     var urlB = "assets/png/broken_0"+(col-1)+".png";
                     urls.push(urlB);
                  }

                  for(var url of urls){
                     if(!newUrl.includes(url)){
                        res.push({ type: 'image', url });
                        newUrl.push(url);
                     }
                  }
               }

               if(faceItems && faceItems.length > 0){
                  var faceItemID = faceItems[row][col];
                  if(faceItemID > 0){
                     var strId = "" + faceItemID;
                     if (faceItemID < 10) {
                        strId = "0" + strId;
                     }
                     var url = "assets/item_"+strId;
                     if(!newUrl.includes(url)){
                        res.push({ type: 'image', url });
                        newUrl.push(url);
                     }
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

         if(overlay){
            res.push({ type: 'image', url: overlay.src });
         }
         if(underlay){
            res.push({ type: 'image', url: underlay.src });
         }
      }
   }

   return res
};

var robotEndConditions = {
   dev: function(context, lastTurn) {
      // console.log("validate")
      var scor = context.scoring;
      if(!scor || scor.length == 0){
         context.success = true;
         context.successRate = 1;
         throw(window.languageStrings.messages.success);
      }
      for(var iTarget = 0; iTarget < scor.length; iTarget++){
         var res = robotEndConditions.checkTarget(context,iTarget);
         // console.log(res)
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
      // console.log("checkTarget",iTarget)
      var tar = context.scoring[iTarget].target;
      var sco = context.scoring[iTarget].score;
      var sub = context.scoring[iTarget].subset;
      var hid = context.scoring[iTarget].hidden;
      var fac = context.scoring[iTarget].faceItems;
      var sha = context.scoring[iTarget].shapes;
      var cra = context.scoring[iTarget].cranePos;
      var mar = context.scoring[iTarget].markers;
      var til = context.tiles;
      var bro = context.broken;
      
      var { nbRequired, nbWellPlaced } = checkWellPlaced(context,tar,sub,til,bro);

      var error = checkForErrors({context,tar,sub,hid,fac,sha,cra,mar,nbWellPlaced,nbRequired});
      // console.log(error)
      if(error){
         return error
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
               var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask && !it.ini);
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

function checkWellPlaced(context,tar,sub,til,bro) {
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
            var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask && !it.ini);
            if(items.length > 0 && items[0].num == numTar && !items[0].broken){
               nbWellPlaced++;
            }
         }
      }
   }
   return { nbRequired, nbWellPlaced }
};

function checkForErrors(params) {
   var { context, tar, sub, hid, fac, sha, cra, mar, nbWellPlaced, nbRequired } = params;
   var partialSuccess = (nbWellPlaced >= nbRequired*context.partialSuccessThreshold && context.partialSuccessEnabled) ? true : false;
   var errorMsg = (partialSuccess) ? window.languageStrings.messages.partialSuccess(context.partialSuccessThreshold)+" " : "";

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
            var items = context.getItemsOn(gridRow,gridCol,it => !it.target && !it.isMask && !it.ini);
            var itemPos = context.getItemsPos(numTar,idTar); 
            if(context.craneContent && context.craneContent.num == numTar){
               itemPos.push({ row: "crane", col: context.cranePos });
            }
            if(items.length == 0){
               errorMsg += window.languageStrings.messages.failureMissing(itemPos.length);
               return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
            }
            if(items[0].num != numTar || items[0].imgId != idTar){
               errorMsg += window.languageStrings.messages.failureWrongBlock(itemPos.length);
               return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
            }
            if(items[0].broken){
               errorMsg += window.languageStrings.messages.failureBrokenBlock(itemPos.length);
               return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
            }
            if(hid && hid.length > 0){
               if((hid[iRow][iCol] && !items[0].hidden) || (!hid[iRow][iCol] && items[0].hidden)){
                  errorMsg += window.languageStrings.messages.failureHiddenBlock;
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
            }
            if(fac && fac.length > 0){
               if(fac[iRow][iCol] && items[0].faceItem != fac[iRow][iCol]){
                  errorMsg += window.languageStrings.messages.failureWrongFaceItem;
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
               if(!fac[iRow][iCol] && items[0].faceItem){
                  errorMsg += window.languageStrings.messages.failureFaceItem;
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
            }
            if(sha && sha.length > 0){
               if(sha[iRow][iCol]){
                  if(!items[0].shape){
                     errorMsg += window.languageStrings.messages.failureNoShape;
                     return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
                  }
                  var shape = sha[iRow][iCol][0];
                  var color = sha[iRow][iCol][1];
                  if(items[0].shape[0] != shape){
                     errorMsg += window.languageStrings.messages.failureWrongShape;
                     return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
                  }
                  if(items[0].shape[1] != color){
                     errorMsg += window.languageStrings.messages.failureWrongColor;
                     return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
                  }
               }else if(items[0].shape){
                  errorMsg += window.languageStrings.messages.failureShape;
                  return { success: false, msg: errorMsg, highlights: [[{row:gridRow,col:gridCol}], itemPos] }
               }
            }
         }
      }
   }
   if(cra != undefined && context.cranePos != cra){
      errorMsg += window.languageStrings.messages.failureWrongCranePos;
      return { success: false, msg: errorMsg }
   }
   if(mar && mar.length > 0){
      for(var tMarker of mar){
         var found = false;
         for(var marker of context.markers){
            if(marker.target){
               continue;
            }
            if(marker.col == tMarker.col){
               found = true;
               break;
            }
         }
         if(!found){
            errorMsg += window.languageStrings.messages.failureMissingMarker(tMarker.col + 1);
            return { success: false, msg: errorMsg }
         }
      }  
   }

   return false
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
            // stroke: "red",  
            "stroke-width": 0.2,
            // "stroke-width": 2,
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
         messageAttr: {
            rect: {
               stroke: "black",
               "stroke-width": 1,
               fill: "white",
               r: 5
            },
            text: {
               "font-size": 16,
               fill: "black"
            }
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
            sensorOffsetY: 45,
            craneFaceItemOffsetY: -28 // difference between crane position at the center of the cell and position to catch face item
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
