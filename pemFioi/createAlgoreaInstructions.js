function createAlgoreaInstructions(type,level,params) {
   var languages = ["blockly","scratch","python"];

   var imgPath = "../../../_common/modules/img/algorea/";
   var vidPath = "../../../_common/modules/vid/";
   var totalHTML = "<div class='"+level+"'>";
   totalHTML += (params.moreDetails) ? "<div class='short'>" : "";
   // 0 : course
   // 1 : dominoes
   switch(type){
      case 0:
         totalHTML += createCourseInstructions(params);
         break;
      case 1:
         totalHTML += createDominoesInstructions(params);
         break
      default:
         totalHTML += params.custom;
   }

   for(var iLang = 0; iLang < languages.length; iLang++){
      var lang = languages[iLang];
      totalHTML += "<p data-lang="+lang+">Contenu "+lang+"</p>";  // test
   }
   
   totalHTML += (params.moreDetails) ? "</div>" : "";

   if(params.moreDetails){
      totalHTML += addDetails(params.moreDetails);
   }
   
   totalHTML += "</div>";

   return totalHTML

   function createCourseInstructions(params) {
      // Programmez votre robot pour qu'il atteigne le drapeau. 
      // Programmer le robot pour qu'il atteigne le drapeau, sans foncer dans un buisson. 
      // Programmez votre robot pour qu'il sorte du labyrinthe. La sortie est sur la case verte. 
      // Programmez votre robot pour qu'il sorte du labyrinthe en atteignant une des deux cases vertes. 
      // Programmez votre robot pour qu'il atteigne la zone verte tout au bout du parcours. 
      // Programmer le robot pour qu'il atteigne une case verte, sans foncer dans un obstacle. Un obstacle est soit un mur, soit une porte fermée. 
      // Programmez le robot pour qu'il atteigne un drapeau, sans foncer dans un obstacle. Un obstacle est soit un buisson, soit une étendue d'eau. 
      // Programmer le robot pour qu'il atteigne la zone verte tout au bout du parcours, sans rentrer dans un obstacle. 
      // Programmez le robot pour qu'il atteigne une des zones vertes dans un coin du labyrinthe. 
      // Programmez le robot pour qu'il atteigne la zone verte. 
      // Programmer le robot pour qu'il atteigne un drapeau, sans foncer dans un buisson, ni tomber dans l'eau. 
      // Une des étendues d'eau a été recouverte d'une planche pour que votre robot puisse passer. 
      var exit = params.exit;
      // 0: drapeau
      // 1: case verte
      var nbExits = params.nbExits;
      var obstacles = params.obstacles;   // []
      // 0: buisson
      // 1: étendue d'eau
      // 2: mur
      // 3: porte fermée  
      var obsStr = [ "un buisson", "une étendue d'eau", "un mur", "une porte fermée"];
      var board = params.board;

      var html = "<p>"; 
      html += "Programmez le robot pour qu'il atteigne ";
      if(exit == 0){
         if(nbExits == 1){
            html += "le drapeau";
         }else{
            html += "un des "+nbExits+" drapeaux";
         }
      }else if(exit == 1){
         if(nbExits == 1){
            html += "la case verte";
         }else{
            html += "une des "+nbExits+" cases vertes";
         }
      }
      html += " sans rentrer dans ";

      if(obstacles.length == 1){
         html += obsStr[obstacles[0]]+".";
      }else{
         html += "un obstacle. Un obstacle est ";
         for(var iObs = 0; iObs < obstacles.length; iObs++){
            var obsID = obstacles[iObs];
            html += "soit "+obsStr[obsID];
            if(iObs < obstacles.length - 1){
               html += ", ";
            }else{
               html += ".";
            }
         }
      }
      html += "</p>";

      if(board){
         html += "<p>Une des étendues d'eau a été recouverte d'une planche pour que votre robot puisse passer.</p>"; 
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

   function addDetails(dat) {
      var html = "<div class='long";
      // if(dat.level){
      //    for(var iLev = 0; iLev < dat.level.length; iLev++){
      //       html += " "+dat.level[iLev];
      //    }
      // }
      // html += "'";

      if(dat.lang){
         html += " data-lang='";
         for(var iLang = 0; iLang < dat.lang.length; iLang++){
            html += " "+dat.lang[iLang];
         }
         html += "'";
      }
      html += ">";

      html += "<p>Glissez les blocs avec la souris :</p>";
      html += "<div style='display: inline-block; border: 1px solid black; padding: 2px; margin-bottom: 10px;'>";
      html += "<p>Démonstration :</p>";
      html += "<a class='videoBtn' data-lang='blockly' data-video='"+vidPath+"demo_b.mp4' style='width: 100%'' ><img src='"+imgPath+"vignette_b.jpg'></a>";
      html += "<a class='videoBtn' data-lang='scratch' data-video='"+vidPath+"demo_s.mp4' style='width: 100%'' ><img src='"+imgPath+"vignette_s.jpg'></a>";
      html += "</div>";
      html += "<div style='display: inline-block; vertical-align: top; margin-left: 10px;'>";
      html += "<p>Cliquez ensuite sur le bouton</p>";
      html += "<img src='"+imgPath+"play_button.png' />";
      html += "<p>qui se trouve <span style='color: red;'>sous le dessin</span></p>";
      html += "<p>et observez le résultat !</p>";
      html += "</div>";
      html += "</div>";
      return html
   };
   

   // indication :
   // aide :
   // attention ! Le même programme doit fonctionner sur les X tests/parcours ci-dessous/proposés/suivants. 
   // attention, vous ne disposez que de X blocs
   // Vous aurez besoin du bloc
   // Vous pouvez avoir besoin du bloc
   // utilisez des fonctions

   // Si vous avez besoin d'aide, cliquez sur le bouton "Plus de détails" ci-dessous. 
   // Une aide est disponible en cliquant sur le bouton "Plus de détails". 
   // Si vous ne connaissez pas ce bloc, cliquez sur "Plus de détails" pour une introduction. 
   // Pour vous aider à comprendre vos erreurs, pensez au mode "Pas à Pas" : 
   // Vous ne pouvez utiliser que X instructions Y. 

   // Si besoin, vous pouvez placer plusieurs blocs à l’intérieur du bloc “répéter”. 
   // Si vous êtes bloqué, en particulier si vous n'avez plus assez de blocs pour finir votre programme, cliquez sur le bouton "Plus de détails" pour obtenir plus d'aide. 
   // Dans cette version, les blocs sont regroupés par catégorie dans des menus. Cliquez sur un menu pour accéder aux blocs de la catégorie correspondante. 
   
};