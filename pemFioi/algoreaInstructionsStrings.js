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
      
   }
};