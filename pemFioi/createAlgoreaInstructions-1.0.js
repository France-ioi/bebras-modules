function createAlgoreaInstructions(subTask) {
   var level = displayHelper.taskLevel;
   if(level){
      var lang = conceptViewer.selectedLanguage;
      if(!level || !lang){
         return ""
      }
      var strLang = window.stringsLanguage;
      var strings = algoreaInstructionsStrings[strLang];
      var gridInfos = extractLevelSpecific(subTask.gridInfos,level);
      var data = subTask.data;
            // console.log(gridInfos.intro)

      var instHTML = getAlgoreaIntro();

      quickAlgoInterface.taskIntroContent = instHTML;
      quickAlgoInterface.setupTaskIntro(level);

      function getAlgoreaIntro() {
         var type = gridInfos.contextType;

         var totalHTML = "<div class='"+level+"'>";

         var tuto = ($("#task #tuto").length > 0);
         if(tuto){
            var tutoEnabled = false;
            var dataLevel = $("#task #tuto").attr("data-level");
            var dataLang = $("#task #tuto").attr("data-lang");
            if((!dataLevel || dataLevel.indexOf(level) !== -1) &&
               (!dataLang || dataLang.indexOf(lang) !== -1)){
               totalHTML += "<div class='short'>";
               tutoEnabled = true;
            }
         }

         if(gridInfos.intro.default){
            switch(type){
               case "course":
                  totalHTML += createCourseInstructions();
                  break;
               case "dominoes":
                  totalHTML += createDominoesInstructions();
                  break
               case "flowers":
                  totalHTML += createFlowersInstructions();
                  break
               case "gems":
                  totalHTML += createGemsInstructions();
                  break
               case "marbles":
                  totalHTML += createMarblesInstructions();
                  break
               default:
                  // totalHTML += params.custom;
            }
         }
         if(gridInfos.intro.more){
            var more = gridInfos.intro.more;
            for(var iElem = 0; iElem < more.length; iElem++){
               var elem = more[iElem];
               switch(elem.type){
                  case "helpConcept":
                     totalHTML += addHelpConcept(elem.concepts);
                     break;
                  case "help":
                     totalHTML += addHelp(elem);
                     break;
               }
            }
         }



         // if(gridInfos.intro && gridInfos.intro.helpConcept){
         //    totalHTML += addHelpConcept(gridInfos.intro.helpConcept);
         // }

         // if(gridInfos.intro && gridInfos.intro.help){
         //    totalHTML += addHelp(gridInfos.intro.help);
         // }

         // if(params.stepByStep){
         //    totalHTML += addStepByStep(params.stepByStep);
         // }
         
         totalHTML += (tutoEnabled) ? "</div>" : "";

         if(tutoEnabled){
            $("#tuto img").each(function() {
               var src = $(this).attr("src");
               src = src.replace("$img_path$",imgPath);
               $(this).attr("src",src);
            });
            totalHTML += $("#tuto").html();
         }

         totalHTML += "</div>";

         return totalHTML
      };

      function createCourseInstructions() {
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

      function createDominoesInstructions() {
         if(gridInfos.intro && gridInfos.intro.text){
            return "<p>"+gridInfos.intro.text+"</p>"
         }

         var nbTarget = countItem(11);
         var rollOver = (gridInfos.intro && gridInfos.intro.rollOver)

         var text = strings.dominoes(nbTarget,rollOver);

         var html = "<p>"+text+"</p>";

         // if(gridInfos.intro && gridInfos.intro.maxMove){
         //    var text2 = strings.maxMove(gridInfos.intro.maxMove);
         //    html += "<p>"+text2+"</p>";
         // }

         return html
      };

      function createFlowersInstructions() {
         var nbTarget = countItem(2);
         // var nbFixed = countItem(5);

         var html = "<p>"; 
         html += strings.flowers(nbTarget);
         html += "</p>";
         
         // if(nbTarget > 1 || nbFixed > 0){
         if(gridInfos.intro && gridInfos.intro.dontStepOnFlowers){
            var dontDoIt = gridInfos.intro.dontStepOnFlowers;
            if(dontDoIt.shared || dontDoIt[level]){
               html += "<p>";
               html += strings.dontStepOnFlowers;
               html += "</p>";
            }
         }
         return html
      };

      function createGemsInstructions() {
         var nbTarget = countItem(3);

         var html = "<p>"; 
         html += strings.gems(nbTarget);
         html += "</p>";
         html += "<p>"; 
         html += strings.toPickAGem;
         html += "</p>";
         return html
      };

      function createMarblesInstructions() {
         var nbHoles = countItem(3);
         var nbMarbles = countItem(4);

         var html = "<p>"; 
         html += strings.marbles(nbMarbles,nbHoles);
         html += "</p>";

         if(nbMarbles > 1){
            html += "<p>"; 
            html += strings.oneMarble;
            html += "</p>";
            if(nbHoles > 1){
               html += "<p>"; 
               html += strings.onePerHole;
               html += "</p>";
            }
         }

         return html
      };

      /*** COMMON ***/

      function addHelp(dat) {
         // var msg = dat.shared || dat[level];
         // if(!msg){
         //    return ""
         // }
         var html = "<p>";
         if(dat.repeat){
            html += strings.repeatHelp(lang);
         }else{
            html += dat.text;
         }
         html += "</p>";

         return html
      };

      // function addStepByStep(dat) {
      //    var html = "<p";
      //    if(dat.lang){
      //       html += " data-lang='";
      //       for(var iLang = 0; iLang < dat.lang.length; iLang++){
      //          html += " "+dat.lang[iLang];
      //       }
      //       html += "'";
      //    }
      //    html += ">";
      //    html += "Pour vous aider à comprendre vos erreurs, pensez au mode \"Pas à Pas\" ";
      //    html += "<img src=\""+imgPath+"step_by_step_button.png\" style=\"width: 40px; vertical-align: middle\" />";
      //    html += "</p>";

      //    return html
      // };

      function addHelpConcept(dat) {
         // var levelConcepts = [];
         // if(dat.shared && dat.shared.length > 0){
         //    for(var iConcept = 0; iConcept < dat.shared.length; iConcept++){
         //       var concept = dat.shared[iConcept];
         //       if(!Beav.Array.has(levelConcepts,concept)){
         //          levelConcepts.push(concept);
         //       }
         //    }
         // }
         // if(dat[level] && dat[level].length > 0){
         //    for(var iConcept = 0; iConcept < dat[level].length; iConcept++){
         //       var concept = dat[level][iConcept];
         //       if(!Beav.Array.has(levelConcepts,concept)){
         //          levelConcepts.push(concept);
         //       }
         //    }
         // }
         if(!dat){
            return ""
         }

         var html = "<p>";

         // if(dat.custom){
         //    html += dat.custom;
         // }else{
            html += strings.helpConcept(lang,dat);
         // }
         html += ".</p>";

         return html
      };

      function countItem(id) {
         var tiles = data[level][0].tiles;
         var nbRows = tiles.length;
         var nbCol = tiles[0].length;
         var nbTarget = 0;
         for(var row = 0; row < nbRows; row++){
            for(var col = 0; col < nbCol; col++){
               var itemID = tiles[row][col];
               if(itemID == id){
                  nbTarget++;
               }
            }
         }
         return nbTarget
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
}
