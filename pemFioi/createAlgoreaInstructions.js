function createAlgoreaInstructions(type,params) {
   // var languages = ["blockly","scratch","python"];
   var level = displayHelper.taskLevel;
   var lang = conceptViewer.selectedLanguage;
   if(!level || !lang){
      return ""
   }
   var strLang = window.stringsLanguage;
   var strings = algoreaInstructionsStrings[strLang];

   var imgPath = "../../../_common/modules/img/algorea/";
   // var vidPath = "../../../_common/modules/vid/";
   var totalHTML = "<div class='"+level+"'>";

   if(params.moreDetails){
      var detailsEnabled = false;
      var dat = params.moreDetails;
      if((!dat.lang || Beav.Array.has(dat.lang,lang)) && 
         (!dat.level || Beav.Array.has(dat.level,level))){
         totalHTML += (params.moreDetails) ? "<div class='short'>" : "";
         detailsEnabled = true;
      }
   }

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
   
   totalHTML += (params.moreDetails) ? "</div>" : "";

   if(params.moreDetails && detailsEnabled){
      totalHTML += params.moreDetails.html;
   }
   
   totalHTML += "</div>";

   return totalHTML

   function createCourseInstructions(data) {
      if(!data){
         return
      }
      var tiles = data[level][0].tiles;
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

      var text = strings.course(nbExits,obstacles);

      var html = "<p>"+text+"</p>";

      if(board){
         html += "<p>"+strings.board+"</p>"; 
      }
      return html
   };

   function createDominoesInstructions(params) {
      if(params.custom){
         return "<p>"+params.custom+"</p>"
      }

      var tiles = params.data[level][0].tiles;
      var nbRows = tiles.length;
      var nbCol = tiles[0].length;
      var nbTarget = 0;
      for(var row = 0; row < nbRows; row++){
         for(var col = 0; col < nbCol; col++){
            var itemID = tiles[row][col];
            if(itemID == 11){
               nbTarget++;
            }
         }
      }

      var text = strings.dominoes(nbTarget,params.rollOver);

      var html = "<p>"+text+"</p>";

      if(params.maxMove){
         var text2 = strings.maxMove(params.maxMove);
         html += "<p>"+text2+"</p>";
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
      // Si besoin, vous pouvez placer plusieurs blocs à l’intérieur du bloc “répéter”. 
      if((dat.lang && !Beav.Array.has(dat.lang,lang)) || 
         (dat.level && !Beav.Array.has(dat.level,level))){
         return ""
      }
      var html = "<p>";
      if(dat.repeat){
         html += strings.repeatHelp;
      }else{
         html += dat.text;
      }
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
      if((dat.lang && !Beav.Array.has(dat.lang,lang)) || 
         (dat.level && !Beav.Array.has(dat.level,level))){
         return ""
      }

      var html = "<p>";

      if(dat.custom){
         html += dat.custom;
      }else{
         var strID = dat.strID;
         html += strings.helpConcept(strID);
         html += "<a onclick=\"conceptViewer.showConcept('"+dat.concept+"')\">";
         html += dat.mainStr;
         html += "</a>";
      }
      html += ".</p>";

      return html
   };
   

   
   // attention ! Le même programme doit fonctionner sur les X tests/parcours ci-dessous/proposés/suivants. 
   // attention, vous ne disposez que de X blocs
   
   

   // Si vous avez besoin d'aide, cliquez sur le bouton "Plus de détails" ci-dessous. 
   // Une aide est disponible en cliquant sur le bouton "Plus de détails". 
   // Si vous ne connaissez pas ce bloc, cliquez sur "Plus de détails" pour une introduction. 
   // Pour vous aider à comprendre vos erreurs, pensez au mode "Pas à Pas" : 
   // Vous ne pouvez utiliser que X instructions Y. 

   // Si vous êtes bloqué, en particulier si vous n'avez plus assez de blocs pour finir votre programme, cliquez sur le bouton "Plus de détails" pour obtenir plus d'aide. 
   // Dans cette version, les blocs sont regroupés par catégorie dans des menus. Cliquez sur un menu pour accéder aux blocs de la catégorie correspondante. 
   
};