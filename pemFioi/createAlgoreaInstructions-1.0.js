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
      // console.log(gridInfos.intro);

      var instHTML = getAlgoreaIntro();

      quickAlgoInterface.taskIntroContent = instHTML;
      quickAlgoInterface.setupTaskIntro(level);

      function getAlgoreaIntro() {
         var type = gridInfos.contextType;

         var totalHTML = "<div class='"+level+"'>";
         if($("#task #tuto").length > 0 || (gridInfos.intro.tuto && typeof gridInfos.intro.tuto != "object")){
            var tuto = (lang != "python") ? true : false;
         }
         if(tuto){
            var tutoEnabled = false;
            if($("#task #tuto").length > 0){
               var dataLevel = $("#task #tuto").attr("data-level");
               var dataLang = $("#task #tuto").attr("data-lang");
               if((!dataLevel || dataLevel.indexOf(level) !== -1) &&
                  (!dataLang || dataLang.indexOf(lang) !== -1)){
                  totalHTML += "<div class='short'>";
                  tutoEnabled = true;
               }
            }else{
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
               case "paint":
                  totalHTML += createPaintInstructions();
                  break
               case "sokoban":
                  totalHTML += createSokobanInstructions();
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
         
         totalHTML += (tutoEnabled) ? "</div>" : "";

         if(tutoEnabled){
            if($("#task #tuto").length > 0){
               $("#tuto img").each(function() {
                  var src = $(this).attr("src");
                  src = src.replace("$img_path$",imgPath);
                  $(this).attr("src",src);
               });
               totalHTML += $("#tuto").html();
            }else{
               totalHTML += addTuto(type,gridInfos.intro.tuto);
            }
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
         // if(gridInfos.intro && gridInfos.intro.dontStepOnFlowers){
         //    // var dontDoIt = gridInfos.intro.dontStepOnFlowers;
         //    // if(dontDoIt.shared || dontDoIt[level]){
         //       html += "<p>";
         //       html += strings.dontStepOnFlowers;
         //       html += "</p>";
         //    // }
         // }
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

      function createPaintInstructions() {
         var nbBlack = countItem(3);
         var nbWhite = countItem(4);

         var html = "<p>"; 
         html += strings.paint(nbBlack,nbWhite);
         html += "</p>";

         return html
      };

      function createSokobanInstructions() {
         var nbBoxes = countItem(4);
         
         var html = "<p>"; 
         html += strings.sokoban(nbBoxes);
         html += "</p>";

         html += "<p>"; 
         html += strings.pushBox;
         html += "</p>";

         return html
      };

      /*** COMMON ***/

      function addHelp(dat) {
         for(var key in dat){
            var html = "<p>";
            switch(key){
               case "repeat":
                  html += strings.repeatHelp(lang);
                  break;
               case "text":
                  html += dat.text;
                  break;
               case "dontStepOnFlowers":
                  html += strings.dontStepOnFlowers;
                  break;

            }
            html += "</p>";
         }
         // var html = "<p>";
         // if(dat.repeat){
         //    html += strings.repeatHelp(lang);
         // }else{
         //    html += dat.text;
         // }
         // html += "</p>";

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
         if(!dat){
            return ""
         }

         var html = "<p>"; 
         html += strings.helpConcept(lang,dat);
         html += ".</p>";

         return html
      };

      function addTuto(type,id) {
         var html = "";
         var suffix = (lang == "blockly") ? "_b" : "_s";
         var vidSrc = modulesPath+"vid/algorea/"+type+"_"+id+suffix;
         // console.log()
         switch(id){
            case "drag_blocks":
               html += "<div data-lang='blockly scratch' class='long'>";
               html += "<p>"+strings.dragBlocks+" :</p>";
               html += "<div style='display: inline-block; border: 1px solid black; padding: 2px; margin-bottom: 10px;'>";
               html += "<p>"+strings.demonstration+" :</p>";
               // html += "<a class='videoBtn' data-video='demo"+suffix+".mp4' style='width: 100%' ><img src='vignette"+suffix+".jpg'></a>";
               html += "<video controls ><source src='"+vidSrc+".mp4' type=video/mp4></video>";
               html += "</div>";
               html += "<div style='display: inline-block; vertical-align: top; margin-left: 10px;'>";
               html += "<p>"+strings.thenClickButton+" :</p>";
               html += "<img src='"+imgPath+"play_button.png' />";
               html += "<p>"+strings.bottomOfScreen+"</p>";
               html += "<p>"+strings.watchResult+"</p>";
               html += "</div>";
               html += "</div>";
               break;
            case "blockly_controls_repeat":
               if(Beav.Array.has(gridInfos.includeBlocks.generatedBlocks.robot,"east")){
                  var dir = "east";
               }else{
                  var dir = "forward";
               }
               var repeatSrc = modulesPath+"img/algorea/tutos/repeat_"+dir+suffix;
               var keypadSrc = modulesPath+"img/algorea/tutos/keypad"+suffix;
               html += "<div data-lang='blockly scratch' class='long'>";
               html += "<p>"+strings.controlsRepeat+" :</p>";
               html += "<div style='display: inline-block;vertical-align: top;'>";
               html += "<img src='"+repeatSrc+".png'/>";
               html += "</div>";
               html += "<div style='max-width: 480px; margin: 10px;'>";
               html += "<img src='"+keypadSrc+".png' width='100%' />";
               html += "</div>";
               html += "<p>"+strings.loopsAreUseful+"</p>";
               html += "</div>";
         // console.log(id)
      }
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
