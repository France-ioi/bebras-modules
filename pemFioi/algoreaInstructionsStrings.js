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
      maxMove: function(max) {
         return "Le robot ne doit pas se déplacer plus de "+max+" fois.";
      },
      repeatHelp: "Si besoin, vous pouvez placer plusieurs blocs à l’intérieur du bloc “répéter”.",
      helpConcept: function(id) {
         var strArr = [
            "Vous pourrez avoir besoin du bloc ",
            "Vous aurez besoin du bloc ",
            "Vous pourrez avoir besoin de ",
            "Vous aurez besoin de ",
            "Aide : ",
            "Utilisez des "
         ];
         return strArr[id]
      }
   }
};