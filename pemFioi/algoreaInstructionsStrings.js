var algoreaInstructionsStrings = {
   fr: {
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
      dominoes: function(nbTarget,rollOver) {
         var text = "Programmez le robot pour qu'il ramasse ";
         if(nbTarget == 1){
            text += "le domino avec deux carrés bleus.";
         }else{
            text += "tous les dominos avec deux carrés bleus.";
         }
         if(rollOver){
            text += " Le robot peut passer sur les dominos qu'il ne ramasse pas.";
         }
         return text
      },
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

      /** tutos **/
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

      /** help **/
      multipleTests: function(nbTests) {
         return "Le même programme doit fonctionner sur les "+nbTests+" tests ci-dessous."
      },
      maxMove: function(max) {
         return "Le robot ne doit pas se déplacer plus de "+max+" fois.";
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
            text += (concepts.length > 1) ? "des blocs " : "du bloc ";
         }else{
            text += "de ";
         }
         for(var iConcept = 0; iConcept < concepts.length; iConcept++){
            var concept = concepts[iConcept];
            text += "<a onclick=\"conceptViewer.showConcept('"+concept+"')\"><b>";
            text += conceptName(concept,lang);
            text += "</b></a>";
            if(iConcept == concepts.length - 2){
               text += " et ";
               if(lang == "python"){
                  text += "de ";
               }
            }else if(iConcept < concepts.length - 2){
               text += ", "
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
            }
         }
      },
      stepByStep: "Pour vous aider à comprendre vos erreurs, pensez au mode \"Pas à Pas\""
      
   }
};