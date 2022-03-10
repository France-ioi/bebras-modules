var algoreaInstructionsStrings = {
   fr: {
      arrowsIntro: "Programmez le robot pour qu'il atteigne le coffre en suivant les flèches.",
      cards: "Programmez le robot pour qu'il ramasse chaque carte et la dépose sur la case correspondant à son motif.",
      oneCard: "Le robot ne peut transporter qu'une seule carte à la fois.",
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
      chticodeRel: "Programmez le robot pour qu'il passe ramasser toutes les pierres précieuses puis rejoigne la case verte. ",
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
      laser1: "Programmez votre robot pour qu'il allume tous les spots à l'aide de rayons laser.",
      laser2: "Un rayon laser allume tous les spots qui se trouvent sur sa trajectoire.",
      overLaser: "Pour utiliser un lanceur laser, le robot doit se placer sur sa case.",
      laserDirection: "Les directions possibles, de 0 à 7, sont indiquées sur le lanceur.",
      mirrors: "Aidez-vous des miroirs ! Ils réfléchissent les rayons laser. ",
      launcher: "Lanceur",
      helpIntro: function(nbCubes) {
         var text = "On veut programmer le robot pour qu'il ";
         if(nbCubes == 1){
            text += "ramasse le cube puis "
         }else if(nbCubes > 1){
            text += "ramasse les cubes puis "
         }
         text += "rejoigne la case verte."
         return text
      },
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
      packages: function(nbBoxes) {
         var text = "Programmez le robot pour qu'il remplisse ";
         text += (nbBoxes > 1) ? "chaque" : "le";
         text += " carton avec le nombre de livres indiqué."
         return text
      },
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
      and: "et",
      whenChangingDirection: "Attention : lorsque le robot tourne à gauche ou à droite, il reste sur la même case. Il est nécessaire d'utiliser ensuite le bloc",
      toChangeCell: "pour que le robot change ensuite de case.",
      sameAs: "Cela fait pareil que",
      if_1: function(type) {
         var text = "On veut programmer le robot pour qu'il ";
         switch(type){
            case "castle":
               text += "ramasse le bois et le mette dans la cheminée.</br>";
               text += "Le problème, c'est que le bois n'est pas toujours au même endroit !";
               break;
            case "dominoes":
               text += "ramasse le domino avec deux carrés bleus.</br>";
               text += "Le problème, c'est que dans le test 2, il n'y a pas de domino avec deux carrés bleus, le robot ne doit donc rien ramasser !";
               break;
            case "flowers":
               text += "sème des graines, mais seulement sur les zones de terre.</br>";
               text += "Le problème, c'est que les zones de terre ne sont pas toujours au même endroit !";
               break;
            case "help":
               text += " atteigne la case verte.</br>";
               text += "Le problème, c'est que la case verte n'est pas toujours au même endroit !";
               break;
            case "rocket":
               text += "ramasse l'objet lorsqu'il y en a un.</br>";
               text += "Le problème, c'est que le robot ne doit pas essayer de ramasser d'objet quand il n'y en a pas !";
               break;
            default:
               text += "undefined"
         }
         return text
      },
      if_2: "C'est possible, il faut utiliser :",
      if_3: function(type) {
         switch(type){
            case "castle":
               var str0 = "se trouve sur un tas de bois";
               var str1 = "le ramasse";
               break;
            case "dominoes":
               var str0 = "se trouve sur un domino avec des carrés";
               var str1 = "le ramasse";
               break;
            case "flowers":
               var str0 = "se trouve sur une zone de terre";
               var str1 = "sème une graine";
               break;
            case "help":
               var str0 = "y a un obstacle devant lui";
               var str1 = "tourne à gauche";
               break;
            case "rocket":
               var str0 = "se trouve sur un objet";
               var str1 = "le ramasse";
         }
         var text = "Le robot teste s'il "+str0+".</br>";
         text += "Si oui, il "+str1+".</br>";
         text += "Si non, il ne fait pas ce qui est à l'intérieur du bloc.";
         return text
      },
      quantity_1: function(type) {
         switch(type){
            case "fishing":
               var str0 = "sur le panneau"
               var str1 = "de poissons que votre robot doit apporter sur l'île";
               var str2 = "de poissons";
               break;
            case "packages":
               var str0 = "sur le carton";
               var str1 = "de livres que votre robot doit apporter dedans";
               var str2 = "de livres";
               break;
            case "veterinary":
               var str0 = "au dessus du castor";
               var str1 = "de bûches que votre robot doit lui apporter";
               var str2 = "de bûches";
               break;
         }
         var text = "Le nombre "+str0+" indique le nombre "+str1+".<br/>";
         text += "Il faut que votre robot dépose le nombre <b>exact</b> "+str2+" indiqué.";
         return text
      },
      quantity_2: function(type) {
         switch(type){
            case "fishing":
               var str = "le nombre de poissons que le robot prend dans un filet ou dépose";
               break;
            case "packages":
               var str = "le nombre de livres que le robot ramasse ou dépose";
               break;
            case "veterinary":
               var str = "le nombre de bûches que le robot ramasse ou dépose";
               break;
         }
         var text = "Vous pouvez choisir  "+str+". Utilisez pour cela les blocs $1 et $2, en remplaçant le zéro par le nombre voulu.";
         return text
      },
      variable_1: function(type,nbTests) {
         switch(type){
            case "fishing":
               var str1 = "d'apporter sur l'île le nombre <b>exact</b> de poissons qui est indiqué sur le panneau";
               var str2 = "poissons";
               break;
            case "packages":
               var str1 = "de mettre dans le carton le nombre <b>exact</b> de livres qui est indiqué sur ce carton";
               var str2 = "livres";
               break;
            case "veterinary":
               var str1 = "d'apporter au castor le nombre <b>exact</b> de bûches de bois dont il a besoin";
               var str2 = "bûches";
               break;
         }
         var text = "La mission de votre robot est "+str1+". ";
         text += "Pour chaque test, le nombre de "+str2+" est différent, mais le même programme doit fonctionner pour les "+nbTests+" tests.";
         return text
      },
      variable_2: function(type) {
         switch(type){
            case "fishing":
               var str = "de l'île";
               break;
            case "packages":
               var str = "du carton";
               break;
            case "veterinary":
               var str = "du castor";
               break;
         }
         var text = "Pour réussir sa mission, votre robot doit d'abord se rendre sur la case "+str+".";
         return text
      },
      variable_3: "Une fois sur cette case, il doit capter le nombre écrit dessus, et stocker cette information dans sa mémoire pour la réutiliser plus tard.",
      variable_4: function(type) {
         var name = (type != "veterinary") ? "memoireRobot" : "besoinCastor";
         return "<b>"+name+"</b> est une variable, c'est-à-dire un espace de stockage auquel on a donné un nom."
      },
      variable_5: "Dans la suite du programme, l'information est gardée en mémoire dans $0 et peut être utilisée à tout moment",
      variable_6: function(type) {
         switch(type){
            case "fishing":
               var str = "le nombre de poissons du filet";
               break;
            case "packages":
               var str = "le nombre de livres sur la case";
               break;
            case "veterinary":
               var str = "le nombre de bûches sur la case";
               break;
         }
         var text = "Sur l'animation, remarquez que "+str+" est mis à jour lorsque le robot en prend.";
         return text
      },
      animation: "Animation",
      extraVariable_1: "Création de variable",
      extraVariable_2: "Dans cette version, vous devez créer les variables dont vous avez besoin.",
      extraVariable_3: function(type) {
         switch(type){
            case "fishing":
               var str = "nbPoissons";
               break;
            case "packages":
               var str = "nbLivres";
               break;
            case "veterinary":
               var str = "besoinCastor";
               break;
         }
         var text = "Pour créer une variable, cliquez sur $0 et choisissez un nom en le tapant au clavier. ";
         text += "Dans l'exemple qui suit, la variable a été nommée <b>"+str+"</b>. ";
         text += "Attention, le nom de votre variable ne peut pas contenir d'espace.";
         return text
      },
      extraVariable_4: "Incrémentation",
      extraVariable_5: "Lorsque vous placez une valeur dans une variable avec le bloc $0, ce qui était auparavant stocké dans la variable est effacé.",
      extraVariable_6: "Pour ajouter une valeur à celle qui est déjà stockée dans la variable, il faut utiliser le bloc ",
      extraVariable_7: " contient la valeur 2.",
      extraVariable_8: "Dans $0, la valeur 2 est remplacée par la valeur 4.",
      extraVariable_9: "La valeur 3 est ajoutée à la valeur 4. Désormais $0 contient la valeur 7.",
      example: "Exemple",
      extraFunction_1: "Définir une <strong>procédure</strong> revient à créer votre propre bloc. "+
      "Une procédure permet d'isoler un morceau de code qu'on a besoin d'utiliser plusieurs fois. "+
      "Comme ça, on ne l'écrit qu'une fois et on économise des blocs !",
      extraFunction_2: "Déplacez le bloc $0 dans l'éditeur. Ce bloc ne s'accroche pas au bloc \"Programme du robot\". On le place à côté.",
      extraFunction_3: "Donnez un nom à votre bloc.",
      extraFunction_4: "Placez à l’intérieur de ce bloc le morceau de code dont vous aurez besoin plusieurs fois.",
      extraFunction_5: "Vous pouvez maintenant utiliser ce nouveau bloc $0 dans votre programme, autant de fois que nécessaire !",
      extraFunction_6: "Voici un début de programme valide :",
      extraFunction_7: "À vous de le compléter !",
      operations_1: "On peut faire des opérations en utilisant les blocs :",
      operations_2: "Dans cette version, vous aurez besoin d'effectuer le calcul :",
      operations_3: "Si vous le souhaitez, vous pouvez créer une nouvelle variable pour y placer le résultat :",
      operations_4: "Mais ce n'est pas obligatoire.",
      laser_1: "Votre robot doit d'abord avancer sur la case du lanceur laser :",
      laser_2: "Lorsque le robot est placé sur la case du lanceur , il peut tirer un rayon laser. Utilisez le bloc :",
      laser_3: "Pour que le robot tire dans la bonne direction, entrez le nombre 3. Les directions sont indiquées sur le lanceur.",

      /*** HELP ***/
      /************/
      multipleTests: function(nbTests) {
         return "Le même programme doit fonctionner sur les "+nbTests+" tests ci-dessous."
      },
      multipleTestsAlt: function(nbTests) {
         return "Le même programme doit fonctionner sur les "+nbTests+" tests suivants :"
      },
      maxMoves: function(max) {
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
         var specialCase = ["extra_variable","extra_function","blockly_logic_operation","extra_nested_repeat"];
         var text = "Vous pourrez avoir besoin ";
         if(lang != "python"){
            // if(concepts[0] != "extra_variable" && concepts[0] != "extra_function" && concepts[0] != 'blockly_logic_operation'){
            if(!Beav.Array.has(specialCase,concepts[0])){
               text += (concepts.length > 1) ? "des blocs " : "du bloc ";
            }else{
               text += (concepts[0] != 'blockly_logic_operation') ? "de " : "des ";
            }
         }else{
            text += (concepts[0] != 'blockly_logic_operation') ? "de " : "des ";
         }
         for(var iConcept = 0; iConcept < concepts.length; iConcept++){
            var concept = concepts[iConcept];
            text += "<a onclick=\"conceptViewer.showConcept('"+concept+"')\" class=\"help_concept\">";
            text += conceptName(concept,lang);
            text += "</a>";
            if(iConcept == concepts.length - 2){
               text += " et ";
               if(lang == "python" || Beav.Array.has(specialCase,concepts[iConcept + 1])){
                  text += (concepts[0] != 'blockly_logic_operation') ? "de " : "des ";
               }
            }else if(iConcept < concepts.length - 2){
               text += ", ";
               if(lang == "python" || Beav.Array.has(specialCase,concepts[iConcept + 1])){
                  text += (concepts[0] != 'blockly_logic_operation') ? "de " : "des ";
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
               case 'extra_nested_repeat':
                  return "boucles imbriquées"
               case 'extra_variable':
                  return "variables"
               case 'extra_function':
                  return "fonctions"
               case 'extra_list':
                  if(lang != "python"){
                     return "liste"
                  }
                  return "listes"
               case 'blockly_controls_whileUntil':
                  if(lang != "python"){
                     return "répéter tant que ou jusqu'à"
                  }
                  return "l'instruction while"
               case 'blockly_logic_operation':
                  return "opérateurs logiques"
            }
         }
      },
      stepByStep: "Pour vous aider à comprendre vos erreurs, pensez au mode \"Pas à Pas\"",
      moreDetails: "Si vous avez besoin d'aide, cliquez sur le bouton <b>\"Plus de détails\"</b> ci-dessous.",
      youWillNeed: "Vous aurez besoin de",
      extraVariableHelp: "Vous aurez besoin des blocs $0 et $1",
      helpNestedRepeat: "Aide : on peut placer une boucle à l'intérieur d'une boucle !",
      warningEasy: "Si cette version est trop difficile, résolvez d'abord la <b>version 1 étoile</b>. Pour y accéder, cliquez sur l'<b>onglet en haut à gauche</b>.",
      limitedUses: function(limitedUses,lang,type) {
         var text = "Votre programme ne peut pas contenir plus de ";
         for(var iElem = 0; iElem < limitedUses.length; iElem++){
            var elemData = limitedUses[iElem];
            var nbUses = elemData.nbUses;
            var blocks = elemData.blocks;
            if(blocks[0] == "math_number"){
               text += "<b>"+nbUses+"</b> ";
            }else{
               text += "<b>"+nbUses+" fois</b> ";
               text += (blocks.length > 1) ? "les instructions " : "l'instruction ";
            }
            for(var iBlock = 0; iBlock < blocks.length; iBlock++){
               if(blocks[iBlock] != "math_number"){
                  text += "\""+instructionName(blocks[iBlock],lang,type)+"\"";
               }else{
                  text += instructionName(blocks[iBlock],lang,type);
               }
               if(iBlock < blocks.length - 2){
                  text += ", ";
               }else if(iBlock == blocks.length - 2){
                  text += " ou ";
               }
            }
            if(iElem < limitedUses.length - 2){
               text += ", pas plus de ";
            }else if(iElem == limitedUses.length - 2){
               text += " et pas plus de ";
            }
         }
         return text+"."

         function instructionName(instr,lang,type) {
            switch(instr) {
               case "dropObject":
                  switch(type) {
                     case "fishing":
                        if(lang != "python"){
                           return "déposer ... poissons"
                        }
                        return "deposer(nbPoissons)"
                     case "paint":
                        if(lang != "python"){
                           return "peindre la case"
                        }
                        return "peindreCase()"
                     case "flowers":
                        if(lang != "python"){
                           return "semer une graine"
                        }
                        return "semerGraine()"
                  }
               case "forward":
                  if(lang != "python"){
                     return "avancer"
                  }
                  return "avancer()"
               case "backwards":
                  if(lang != "python"){
                     return "reculer"
                  }
                  return "reculer()"
               case "left":
                  if(lang != "python"){
                     return "tourner à gauche"
                  }
                  return "tournerGauche()"
               case "right":
                  if(lang != "python"){
                     return "tourner à droite"
                  }
                  return "tournerDroite()"
               case "north":
                  if(lang != "python"){
                     return "Avancer vers le nord"
                  }
                  return "nord()"
               case "south":
                  if(lang != "python"){
                     return "Avancer vers le sud"
                  }
                  return "sud()"
               case "east":
                  if(lang != "python"){
                     return "Avancer vers l'est"
                  }
                  return "est()"
               case "withdrawObject":
                  switch(type){
                     case "castle":
                        if(lang != "python"){
                           return "ramasser le bois"
                        }
                        return "ramasserBois()"
                     case "dominoes":
                        if(lang != "python"){
                           return "ramasser le domino"
                        }
                        return "ramasserDomino()"
                     case "marbles":
                        if(lang != "python"){
                           return "ramasser la bille"
                        }
                        return "ramasserBille()"
                     case "rocket":
                        if(lang != "python"){
                           return "ramasser l'objet"
                        }
                        return "ramasserObjet()"
                  }
               case "withdrawNum":
                  switch(type){
                     case "fishing":
                        if(lang != "python"){
                           return "prendre ... poissons"
                        }
                        return "prendre(nbPoissons)"
                     case "packages":
                        if(lang != "python"){
                           return "ramasser livres"
                        }
                        return "ramasser(nbLivres)"
                  }
               case "dropNum":
                  switch(type){
                     case "fishing":
                        if(lang != "python"){
                           return "déposer ... poissons"
                        }
                        return "déposer(nbPoissons)"
                     case "packages":
                        if(lang != "python"){
                           return "déposer livres"
                        }
                        return "déposer(nbLivres)"
                     case "veterinary":
                        if(lang != "python"){
                           return "donner ... bûches"
                        }
                        return "donner(nbBûches)"
                  }
               case "dropPlatformInFront":
                  if(lang != "python"){
                     return "construire une plateforme devant"
                  }
                  return "construirePlateformeDevant()"
               case "math_number":
                  return "nombres"
               case "controls_repeat_ext":
                  if(lang != "python"){
                     return "répéter"
                  }
                  return "for"
               case "controls_if":
                  if(lang != "python"){
                     return "si"
                  }
                  return "if"
               case "controls_if_else":
                  if(lang != "python"){
                     return "si / sinon"
                  }
                  return "if / else"
               case "pushObject":
                  if(lang != "python"){
                     return "pousser la caisse"
                  }
                  return "pousserCaisse()"
               case "platformAbove":
                  if(lang != "python"){
                     return "plateforme au-dessus"
                  }
                  return "plateformeDessus()"
               case "col":
                  if(lang != "python"){
                     return "colonne du robot"
                  }
                  return "colonneRobot()"
               case "shoot_noShadow":
                  if(lang != "python"){
                     return "tirer au laser dans la direction ..."
                  }
                  return "tirerLaser()"
               default: 
                  return "undefined"
            }
         }

      }
      
   }
};