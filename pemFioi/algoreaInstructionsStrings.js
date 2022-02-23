var algoreaInstructionsStrings = {
   fr: {
      castle: function(nbHearth) {
         var text = "Programmez le robot pour qu'il mette du bois dans ";
         if(nbHearth == 1){
            text += "la cheminée.";
         }else{
            text += "chaque cheminée."
         }
         return text
      },
      oneFirewood: "Le robot ne peut transporter qu'un seul tas de bois à la fois.</br>Chaque cheminée ne peut contenir qu'un seul tas de bois.",
      fall: function(maxH) {
         return "Le robot tombe s'il n'est pas sur une plateforme, et s'il tombe de plus de "+maxH+" cases, il se casse."
      },
      course: function(nbExits,obstacles) {
         var text = "Programmez le robot pour qu'il atteigne ";
         if(nbExits == 1){
            text += "le drapeau";
         }else{
            text += "un des "+nbExits+" drapeaux";
         }
         
         text += " sans rentrer dans ";

         var obsStr = { 
            2: "un buisson", 
            4: "un mur", 
            7: "une porte fermée", 
            8: "une porte fermée", 
            13: "une étendue d'eau" 
         };

         if(obstacles.length == 1){
            text += obsStr[obstacles[0]]+".";
         }else{
            text += "un obstacle. Un obstacle est ";
            for(var iObs = 0; iObs < obstacles.length; iObs++){
               var obsID = obstacles[iObs];
               text += "soit "+obsStr[obsID];
               if(iObs < obstacles.length - 1){
                  text += ", ";
               }else{
                  text += ".";
               }
            }
         }

         return text
      },
      board: "Une des étendues d'eau a été recouverte d'une planche pour que votre robot puisse passer.",
      dominoes: function(nbTarget) {
         var text = "Programmez le robot pour qu'il ramasse ";
         if(nbTarget == 1){
            text += "le domino avec deux carrés bleus.";
         }else{
            text += "tous les dominos avec deux carrés bleus.";
         }
         return text
      },
      rollOver: "Le robot peut passer sur les dominos qu'il ne ramasse pas.",
      fishing: function(nbIslands) {
         var text = "Programmez le robot-bouée pour qu'il apporte ";
         if(nbIslands > 1){
            text += "sur chaque île ";
         }else{
            text += "sur l'île ";
         }
         text += "le nombre de poissons demandé."
         return text
      },
      fishingHowTo: "Le robot doit se trouver sur la case du filet pour pouvoir prendre des poissons. Il doit se trouver sur la case de l'île pour y déposer des poissons.",
      fishingExactNumber: "Le robot ne doit pas ramasser plus de poisson que nécessaire.",
      flowers: function(nbTarget) {
         var text = "Programmez le robot pour qu'il sème une graine de fleur ";
         if(nbTarget == 1){
            text += "dans la zone de terre.";
         }else{
            text += "dans chaque zone de terre.";
         }
         return text
      },
      dontStepOnFlowers: "Le robot ne peut pas accéder à une case s'il y a déjà une fleur dessus.",
      gems: function(nbTarget) {
         var text = "Programmez le robot pour qu'il ramasse ";
         if(nbTarget == 1){
            text += "la pierre précieuse.";
         }else{
            text += "toutes les pierres précieuses.";
         }
         return text
      },
      toPickAGem: "Pour ramasser une pierre, le robot doit juste passer sur la case qui la contient.",
      marbles: function(nbMarbles,nbHoles) {
         var text = "Programmer le robot pour qu'il ramasse ";
         if(nbMarbles == 1){
            text += "la bille ";
         }else{
            text += "chaque bille ";
         }
         text += "et la dépose ";
         if(nbHoles == 1){
            text += "dans le trou.";
         }else{
            text += "dans un trou.";
         }
         return text
      },
      oneMarble: "Le robot ne peut transporter qu'une bille à la fois.",
      onePerHole: "Chaque trou ne peut contenir qu'une seule bille.",
      paint: function(nbBlack,nbWhite) {
         var text = "Programmez le robot pour qu'il peigne ";
         if(nbBlack == 1){
            text += "la case ";
         }else{
            text += "toutes les cases ";
         }
         text += "avec un point noir";
         if(nbWhite > 0){
            text += " et uniquement ";
            if(nbBlack > 1){
               text += "celles-là";
            }else{
               text += "celle-là";
            }
         }
         text += ".";
         return text
      },
      sokoban: function(nbBoxes) {
         var text = "Programmez le robot pour qu'il pousse ";
         if(nbBoxes == 1){
            text += "la caisse sur la case marquée.";
         }else{
            text += "les caisses sur les cases marquées.";
         }
         return text
      },
      pushBox: "Le robot peut pousser une caisse s'il se met juste devant et que l'espace derrière cette caisse est libre.",
      space: function(nbRockets,nbItems) {
         var text = "Programmez le robot pour qu'il ";
         if(nbItems > 0){
            text += "ramasse ";
            if(nbItems > 1){
               text += "tous les objets";
            }else{
               text += "l'objet"
            }
            if(nbRockets > 0){
               text += " puis ";
            }else{
               text += ".";
            }
         }
         if(nbRockets > 0){
            text += "rejoigne ";
            if(nbRockets > 1){
               text += "une des "+nbRockets+" fusées.";
            }else{
               text += "la fusée.";
            }
         }
         return text
      },
      bewareOfAsteroids: function(nbAst) {
         var text = "Attention ";
         if(nbAst > 1){
            text += "aux astéroïdes !";
         }else{
            text += "à l'astéroïde !";
         }
         return text
      },
      veterinary: function(nbBeav,numbers) {
         var text = "Programmez le robot pour qu'il ";
         if(numbers){
            text += "apporte ";
            if(nbBeav > 1){
               text += "à chaque castor ";
            }else{
               text += "au castor ";
            }
            text += "le nombre de bûches qu'il demande."
         }else{
            text += "ramasse le bois et le donne ";
            if(nbBeav > 1){
               text += "aux castors.";
            }else{
               text += "au castor.";
            }
         }
         return text
      },
      oneWood: "Le robot ne peut porter qu'un tas de bois à la fois, et chaque castor ne reçoit qu'un seul tas de bois.",
      overBeaver: "Le robot doit se trouver sur la case du castor pour lui donner des bûches.",


      /*** TUTOS ***/
      /*************/
      dragBlocks: "Glissez les blocs avec la souris",
      demonstration: "Démonstration",
      thenClickButton: "Cliquez ensuite sur le bouton",
      bottomOfScreen: "qui se trouve <b>en bas de l'écran</b>",
      watchResult: "et observez le résultat !",
      controlsRepeat: "Le bloc <b>répéter</b> vous permet d'utiliser moins de blocs",
      loopsAreUseful: "Les boucles, c'est pratique ! C'est moins long à programmer !</br>Et cela permet d'avoir assez de blocs pour finir le programme.",
      lookAtTests: function(nbTests) {
         return "Un seul chemin est commun aux "+nbTests+" tests. Trouvez-le !"
      },
      ifElse: "Ce bloc permet de commander différemment le robot suivant qu'une condition est remplie ou non.",
      changeDirection: "Les commandes de pivotement",
      toChangeDirection: "Pour faire pivoter le robot, utilisez les blocs",
      or: "ou",
      whenChangingDirection: "Attention : lorsque le robot tourne à gauche ou à droite, il reste sur la même case. Il est nécessaire d'utiliser ensuite le bloc",
      toChangeCell: "pour que le robot change ensuite de case.",
      sameAs: "Cela fait pareil que",
      quantity_1: function(type) {
         switch(type){
            case "fishing":
            default:
               var str1 = "le nombre de poissons que votre robot doit apporter l'île";
               var str2 = "de poissons";
               var str3 = "le nombre de poissons que le robot prend dans un filet ou dépose";
               break;
         }
         var text = "Le nombre sur le panneau indique "+str1+".<br/>";
         text += "Il faut que votre robot dépose le nombre <b>exact</b> "+str2+" indiqué.";
         return text
      },
      quantity_2: function(type) {
         switch(type){
            case "fishing":
            default:
               var str = "le nombre de poissons que le robot prend dans un filet ou dépose";
               break;
         }
         var text = "Vous pouvez choisir  "+str+". Utilisez pour cela les blocs $1 et $2, en remplaçant le zéro par le nombre voulu.";
         return text
      },


      /*** HELP ***/
      /************/
      multipleTests: function(nbTests) {
         return "Le même programme doit fonctionner sur les "+nbTests+" tests ci-dessous."
      },
      maxMove: function(max) {
         return "Le robot ne doit pas se déplacer plus de "+max+" fois.";
      },
      maxBlocks: function(max,lang) {
         var str = (lang == "python") ? "instructions" : "blocs";
         return "<b>Attention</b>, vous ne disposez que de <b>"+max+" "+str+"</b>.";
      },
      repeatHelp: function(lang) {
         if(lang != "python"){
            return "Si besoin, vous pouvez placer plusieurs blocs à l’intérieur du bloc “répéter”."
         }
         return "Si besoin, vous pouvez placer plusieurs instructions à l’intérieur de la boucle for."
      },
      helpConcept: function(lang,concepts) {
         var text = "Vous pourrez avoir besoin ";
         if(lang != "python"){
            if(concepts[0] != "extra_variable"){
               text += (concepts.length > 1) ? "des blocs " : "du bloc ";
            }else{
               text += "de ";
            }
         }else{
            text += "de ";
         }
         for(var iConcept = 0; iConcept < concepts.length; iConcept++){
            var concept = concepts[iConcept];
            text += "<a onclick=\"conceptViewer.showConcept('"+concept+"')\" class=\"aide\"><b>";
            text += conceptName(concept,lang);
            text += "</b></a>";
            if(iConcept == concepts.length - 2){
               text += " et ";
               if(lang == "python"){
                  text += "de ";
               }
            }else if(iConcept < concepts.length - 2){
               text += ", ";
               if(lang == "python"){
                  text += "de ";
               }
            }
         }
         return text

         function conceptName(concept,lang) {
            switch(concept) {
               case 'blockly_controls_repeat':
                  if(lang != "python"){
                     return "répéter"
                  }
                  return "la boucle for"
               case 'blockly_controls_if_else':
                  if(lang != "python"){
                     return "si / sinon"
                  }
                  return "l'instruction if/else"
               case 'blockly_controls_if':
                  if(lang != "python"){
                     return "si"
                  }
                  return "l'instruction if"
               case 'blockly_logic_negate':
                  if(lang != "python"){
                     return "pas"
                  }
                  return "la négation"
               case 'extra_variable':
                  return "variables"
            }
         }
      },
      stepByStep: "Pour vous aider à comprendre vos erreurs, pensez au mode \"Pas à Pas\"",
      moreDetails: "Si vous avez besoin d'aide, cliquez sur le bouton <b>\"Plus de détails\"</b> ci-dessous.",
      youWillNeed: "Vous aurez besoin de",
      helpNestedRepeat: "Aide : on peut placer une boucle à l'intérieur d'une boucle !",
      warningEasy: "Si cette version est trop difficile, résolvez d'abord la <b>version 1 étoile</b>. Pour y accéder, cliquez sur l'<b>onglet en haut à gauche</b>.",
      limitedUses: function(limitedUses,lang,type) {
         var text = "Votre programme ne peut contenir que ";
         for(var iElem = 0; iElem < limitedUses.length; iElem++){
            var elemData = limitedUses[iElem];
            var nbUses = elemData.nbUses;
            var blocks = elemData.blocks;
            text += "<b>"+nbUses+" fois</b> ";
            text += (blocks.length > 1) ? "les instructions " : "l'instruction ";
            for(var iBlock = 0; iBlock < blocks.length; iBlock++){
               text += "\""+instructionName(blocks[iBlock],lang,type)+"\"";
               if(iBlock < blocks.length - 2){
                  text += ", ";
               }else if(iBlock == blocks.length - 2){
                  text += "et ";
               }
            }
            if(iElem < limitedUses.length - 2){
               text += ", que ";
            }else if(iElem == limitedUses.length - 2){
               text += "et que ";
            }
         }
         return text+"."

         function instructionName(instr,lang,type) {
            switch(instr) {
               case "dropObject":
                  switch(type) {
                     case "paint":
                        if(lang != "python"){
                           return "peindre la case"
                        }
                        return "peindreCase()"
                     case "flowers":
                     default:
                        if(lang != "python"){
                           return "semer une graine"
                        }
                        return "semerGraine()"
                  }
               case "north":
                  if(lang != "python"){
                     return "Avancer vers le nord"
                  }
                  return "nord()"
               case "withdrawObject":
                  switch(type){
                     case "marbles":
                     default:
                        if(lang != "python"){
                           return "ramasser la bille"
                        }
                        return "ramasserBille()"
                  }
            }
         }

      }
      
   }
};