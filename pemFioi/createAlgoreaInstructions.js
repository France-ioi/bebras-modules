function createAlgoreaInstructions(type,level,params) {
   var languages = ["blockly","scratch","python"];
   
   var strLang = window.stringsLanguage;

   var imgPath = "../../../_common/modules/img/algorea/";
   var vidPath = "../../../_common/modules/vid/";
   var totalHTML = "<div class='"+level+"'>";
   totalHTML += (params.moreDetails) ? "<div class='short'>" : "";

   switch(type){
      case "course":
         totalHTML += createCourseInstructions(params.data);
         break;
      case "dominoes":
         totalHTML += createDominoesInstructions(params);
         break
      case "flowers":
         totalHTML += createFlowersInstructions(params);
         break
      case "gems":
         totalHTML += createGemsInstructions(params);
         break
      default:
         totalHTML += params.custom;
   }

   if(params.help){
      totalHTML += addHelp(params.help);
   }

   if(params.stepByStep){
      totalHTML += addStepByStep(params.stepByStep);
   }

   if(params.helpConcept){
      totalHTML += addHelpConcept(params.helpConcept);
   }

   // test lang
   for(var iLang = 0; iLang < languages.length; iLang++){
      var lang = languages[iLang];
      totalHTML += "<p data-lang="+lang+">Contenu "+lang+"</p>";  
   }
   
   totalHTML += (params.moreDetails) ? "</div>" : "";

   if(params.moreDetails){
      // totalHTML += addDetails(params.moreDetails);
   }
   
   totalHTML += "</div>";

   return totalHTML

   function createCourseInstructions(data) {
      if(!data){
         return
      }
      var tiles = data[0].tiles;
      var nbRows = tiles.length;
      var nbCol = tiles[0].length;
      var obstacles = [];
      var nbExits = 0;
      var board = false;
      for(var row = 0; row < nbRows; row++){
         for(var col = 0; col < nbCol; col++){
            var itemID = tiles[row][col];
            switch(itemID){
               case 2:
               case 4:
               case 7:
               case 8:
               case 13:
                  if(!Beav.Array.has(obstacles,itemID)){
                     obstacles.push(itemID)
                  }
                  break;
               case 3:
                  nbExits++;
                  break;
               case 14:
                  board = true;
                  break;
            }
         }
      }

      var text = algoreaInstructionsStrings[strLang].course(nbExits,obstacles);

      html = "<p>"+text+"</p>";

      if(board){
         html += "<p>"+algoreaInstructionsStrings[strLang].board+"</p>"; 
      }
      return html
   };

   function createDominoesInstructions(params) {
      // Programmez le robot pour qu'il ramasse le domino avec deux carrés bleus. 6
      // Programmez le robot pour qu'il ramasse tous les dominos avec deux carrés bleus. 16
      // Programmez le robot pour qu'il ramasse tous les dominos. 2
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent au moins un carré bleu. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui ne contiennent pas de carré bleu. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui ne contiennent pas de croix verte mais au moins un carré bleu. 1
      // Programmez le robot pour qu'il ramasse tous les dominos sauf ceux qui contiennent deux carrés bleus. 1
      // Programmez le robot pour qu'il ramasse tous les dominos avec deux carrés bleus, et seulement ceux-là. 7
      // Programmez le robot pour qu'il ramasse le domino avec deux carrés bleus s'il y en a un, et seulement celui-là. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent un carré ou une croix, et uniquement ceux là. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent un carré ou une croix du côté gauche, et uniquement ceux là. 3
      // Programmez le robot pour qu'il ramasse tous les dominos qui ont à la fois un carré bleu et une étoile orange. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent au moins une croix verte et tous les dominos qui contiennent au moins une étoile orange. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent deux étoiles orange. 1
      // Programmez le robot pour qu'il ramasse tous les dominos qui contiennent deux motifs différents. 1

      // Le robot peut passer sur les dominos qu'il ne ramasse pas. 8
      // Le robot ne doit pas se déplacer plus de X fois. 4 
      // Votre programme ne doit utiliser qu'une seule fois l'instruction ramasserDomino. 4
      var strArr1 = [
         "le domino avec deux carrés bleus.",
         "le domino avec deux carrés bleus s'il y en a un, et seulement celui-là.",
         "tous les dominos avec deux carrés bleus.",
         "tous les dominos avec deux carrés bleus, et seulement ceux-là.",
         "tous les dominos."
      ];
      var strID2 = [
         "Le robot peut passer sur les dominos qu'il ne ramasse pas.",
         "Votre programme ne doit utiliser qu'une seule fois l'instruction ramasserDomino.",
         function(max) {
            return "Le robot ne doit pas se déplacer plus de "+max+" fois."
         }
      ];
      var strID1 = params.strID1;
      var strID2 = params.strID2;
      var html = "<p>"; 
      html += "Programmez le robot pour qu'il ramasse ";
      html += strArr1[strID1];
      html += "</p>";
      if(strID2 != undefined){
         html += "<p>";
         html += strArr2[strID2];
         html += "</p>";
      }
      return html
   };

   function createFlowersInstructions(params) {
      // Programmez le robot pour qu'il sème une graine de fleur dans la zone de terre. 14
      // Programmez le robot pour qu'il sème une graine de fleur dans chaque zone de terre. 92
      // Programmez le robot pour qu'il dépose une graine sur le tas de terre. 3
      // Programmez le robot pour qu'il dépose une graine sur chaque tas de terre. 18
      // Programmez le robot pour qu'il sème une graine de fleur dans la zone de terre en bas à droite. 1

      // Le robot ne peut pas accéder à une case s'il y a déjà une fleur dessus. (Il ne va quand même pas écraser les fleurs !) 84

      var strArr1 = [
         "une graine de fleur dans la zone de terre.",
         "une graine de fleur dans chaque zone de terre."
      ];
      var strArr2 = [
         "Le robot ne peut pas accéder à une case s'il y a déjà une fleur dessus. Il ne va quand même pas écraser les fleurs !",
         "Le robot ne peut pas accéder à une case s'il y a déjà une fleur dessus."
      ];
      var strID1 = params.strID1;
      var strID2 = params.strID2;
      var html = "<p>"; 
      html += "Programmez le robot pour qu'il sème ";
      html += strArr1[strID1];
      html += "</p>";
      if(strID2 != undefined){
         html += "<p>";
         html += strArr2[strID2];
         html += "</p>";
      }
      return html
   };

   function createGemsInstructions(params) {
      // Programmez le robot pour qu'il passe ramasser la pierre précieuse. 7
      // Programmez le robot pour qu'il passe ramasser toutes les pierres précieuses. 53
      // Programmez le robot pour qu'il ramasse le diamant. 3
      // Programmez le robot pour qu'il passe ramasser tous les diamants. 9

      // Pour ramasser une pierre, le robot doit simplement passer sur la case qui la contient. 4
      // Pour ramasser une pierre, le robot doit passer sur la case qui la contient. 16
      // Notez que lorsqu'il arrive sur une case, le robot ramasse automatiquement le diamant s'il y en a un sur la case. 4
      // Lorsqu'il arrive sur une case, le robot ramasse automatiquement le diamant s'il y en a un sur la case. 4
   };

   /*** COMMON ***/

   function addHelp(dat) {
      // indication :
      // aide :
      // Aide : on peut placer une boucle à l'intérieur d'une boucle ! 
      var html = "<p";
      if(dat.lang){
         html += " data-lang='";
         for(var iLang = 0; iLang < dat.lang.length; iLang++){
            html += " "+dat.lang[iLang];
         }
         html += "'";
      }
      html += ">";
      var strArr1 = [
         "",
         "Aide : ",
         "Indication : "
      ];
      var strID1 = dat.strID1;
      html += strArr1[strID1];
      html += dat.text;
      html += "</p>";

      return html
   };

   function addStepByStep(dat) {
      var html = "<p";
      if(dat.lang){
         html += " data-lang='";
         for(var iLang = 0; iLang < dat.lang.length; iLang++){
            html += " "+dat.lang[iLang];
         }
         html += "'";
      }
      html += ">";
      html += "Pour vous aider à comprendre vos erreurs, pensez au mode \"Pas à Pas\" ";
      html += "<img src=\""+imgPath+"step_by_step_button.png\" style=\"width: 40px; vertical-align: middle\" />";
      html += "</p>";

      return html
   };

   function addHelpConcept(dat) {
      // Vous aurez besoin du bloc
      // Vous pouvez avoir besoin du bloc
      // utilisez des fonctions

      var html = "<p";
      if(dat.lang){
         html += " data-lang='";
         for(var iLang = 0; iLang < dat.lang.length; iLang++){
            html += " "+dat.lang[iLang];
         }
         html += "'";
      }
      html += ">";

      if(dat.custom){
         html += dat.custom;
      }else{
         var strArr1 = [
            "Vous pourrez avoir besoin du bloc ",
            "Vous aurez besoin du bloc ",
            "Vous pourrez avoir besoin de ",
            "Vous aurez besoin de ",
            "Aide : ",
            "Utilisez des "
         ];
         var strID1 = dat.strID1;
         html += strArr1[strID1];
         html += "<a onclick=\"conceptViewer.showConcept('"+dat.concept+"')\">";
         html += dat.mainStr;
         html += "</a>";
      }
      html += ".</p>";

      return html
   };

   // function addDetails(dat) { // tuto
   //    var html = "<div class='long";
   //    if(dat.lang){
   //       html += " data-lang='";
   //       for(var iLang = 0; iLang < dat.lang.length; iLang++){
   //          html += " "+dat.lang[iLang];
   //       }
   //       html += "'";
   //    }
   //    html += ">";

   //    html += "<p>Glissez les blocs avec la souris :</p>";
   //    html += "<div style='display: inline-block; border: 1px solid black; padding: 2px; margin-bottom: 10px;'>";
   //    html += "<p>Démonstration :</p>";
   //    html += "<a class='videoBtn' data-lang='blockly' data-video='"+vidPath+"demo_b.mp4' style='width: 100%'' ><img src='"+imgPath+"vignette_b.jpg'></a>";
   //    html += "<a class='videoBtn' data-lang='scratch' data-video='"+vidPath+"demo_s.mp4' style='width: 100%'' ><img src='"+imgPath+"vignette_s.jpg'></a>";
   //    html += "</div>";
   //    html += "<div style='display: inline-block; vertical-align: top; margin-left: 10px;'>";
   //    html += "<p>Cliquez ensuite sur le bouton</p>";
   //    html += "<img src='"+imgPath+"play_button.png' />";
   //    html += "<p>qui se trouve <span style='color: red;'>sous le dessin</span></p>";
   //    html += "<p>et observez le résultat !</p>";
   //    html += "</div>";
   //    html += "</div>";
   //    return html
   // };
   

   
   // attention ! Le même programme doit fonctionner sur les X tests/parcours ci-dessous/proposés/suivants. 
   // attention, vous ne disposez que de X blocs
   
   

   // Si vous avez besoin d'aide, cliquez sur le bouton "Plus de détails" ci-dessous. 
   // Une aide est disponible en cliquant sur le bouton "Plus de détails". 
   // Si vous ne connaissez pas ce bloc, cliquez sur "Plus de détails" pour une introduction. 
   // Pour vous aider à comprendre vos erreurs, pensez au mode "Pas à Pas" : 
   // Vous ne pouvez utiliser que X instructions Y. 

   // Si besoin, vous pouvez placer plusieurs blocs à l’intérieur du bloc “répéter”. 
   // Si vous êtes bloqué, en particulier si vous n'avez plus assez de blocs pour finir votre programme, cliquez sur le bouton "Plus de détails" pour obtenir plus d'aide. 
   // Dans cette version, les blocs sont regroupés par catégorie dans des menus. Cliquez sur un menu pour accéder aux blocs de la catégorie correspondante. 
   
};