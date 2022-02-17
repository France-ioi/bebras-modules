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
      var nbTests = data[level].length;
      // console.log(gridInfos.intro);

      var instHTML = getAlgoreaIntro();

      quickAlgoInterface.taskIntroContent = instHTML;
      quickAlgoInterface.setupTaskIntro(level);

      function getAlgoreaIntro() {
         var type = gridInfos.contextType;

         var totalHTML = "<div class='"+level+"'>";
         var tuto = false;
         
         if(gridInfos.intro.tuto && (Array.isArray(gridInfos.intro.tuto) || typeof gridInfos.intro.tuto == "string")){
            tuto = (lang != "python") ? true : false;
         }
         if(tuto){
            totalHTML += "<div class='short'>";
         }

         if(gridInfos.intro.default){
            switch(type){
               case "castle":
                  totalHTML += createCastleInstructions();
                  break;
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
               case "rocket":
                  totalHTML += createSpaceInstructions();
                  break
               case "veterinary":
                  totalHTML += createVetInstructions();
                  break
               default:
                  // totalHTML += params.custom;
            }
         }

         if(nbTests > 1){
            totalHTML += "<p>"+strings.multipleTests(nbTests)+"</p>";
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
                  case "custom":
                     totalHTML += addCustom(elem);
                     break;
               }
            }
         }
         
         totalHTML += (tuto) ? "</div>" : "";

         if(tuto){
            totalHTML += addTuto(type,gridInfos.intro.tuto);
         }

         totalHTML += "</div>";

         return totalHTML
      };

      function createCastleInstructions() {
         var nbHearth = countItem(4);

         var html = "<p>"+strings.castle(nbHearth)+"</p>";

         if(nbHearth > 1){
            html += "<p>"+strings.oneFirewood+"</p>";
         }

         var canFall = false;
         var maxH = 3;
         var tiles = data[level][0].tiles;
         var nbRows = tiles.length;
         var nbCol = tiles[0].length;
         for(var row = 0; row < nbRows; row++){
            for(var col = 0; col < nbCol; col++){
               if(col < nbCol - 1 && tiles[row][col] == 2 && tiles[row][col + 1] == 1){
                  var fallH = getFallH(row,col + 1);
                  if(fallH >= maxH || fallH + row >= nbRows){
                     canFall = true;
                     break;
                  }
               }
               if(col > 0 && tiles[row][col] == 2 && tiles[row][col - 1] == 1){
                  var fallH = getFallH(row,col - 1);
                  if(fallH >= maxH || fallH + row >= nbRows){
                     canFall = true;
                     break;
                  }
               }
            }
            if(canFall){
               break;
            }
         }
         if(canFall){
            html += "<p>"+strings.fall(maxH)+"</p>";
         }

         return html

         function getFallH(r,c) {
            for(var row = r + 1; row < nbRows; row++){
               if(tiles[row][c] != 1){
                  return row - r
               }
            }
            return nbRows - r
         }
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

      function createSpaceInstructions() {
         var nbAsteroids = countItem(4);
         var nbRockets = countItem(5);
         var nbItem1 = countItem(7);
         var nbItem2 = countItem(8);
         var nbItems = nbItem1 + nbItem2;
         
         var html = "<p>"; 
         html += strings.space(nbRockets,nbItems);
         html += "</p>";

         if(nbAsteroids > 0){
            html += "<p>"; 
            html += strings.bewareOfAsteroids(nbAsteroids);
            html += "</p>";
         }

         return html
      };

      function createVetInstructions() {
         var nbCountBeav = countItem(7);
         // var nbCountWood = countItem(6);
         var numbers = nbCountBeav > 0;
         var nbBeav = (numbers) ? nbCountBeav : countItem(2);

         var overBeaver = gridInfos.intro.overBeaver;
         // console.log(overBeaver)

         var html = "<p>"; 
         html += strings.veterinary(nbBeav,numbers);
         html += "</p>";

         if(!numbers && nbBeav > 1){
            html += "<p>"; 
            html += strings.oneWood;
            html += "</p>";
         }

         if(overBeaver === true){
            html += "<p>"; 
            html += strings.overBeaver;
            html += "</p>";
         }

         return html
      };

      /*** COMMON ***/

      function addHelp(dat) {
         var suffix = (lang == "blockly") ? "_b" : "_s";
         for(var key in dat){
            var html = "<p>";
            switch(key){
               case "repeat":
                  html += strings.repeatHelp(lang);
                  break;
               case "stepByStep":
                  html += strings.stepByStep;
                  html += " : <img src='"+imgPath+"step_by_step.png' style='width: 40px; vertical-align: middle' />";
                  break;
               case "text":
                  html += dat.text;
                  break;
               case "dontStepOnFlowers":
                  html += strings.dontStepOnFlowers;
                  break;
               case "moreDetails":
                  html += strings.moreDetails;
                  break;
               case "ifElse":
                  if(lang == "python"){
                     return addHelpConcept(["blockly_controls_if_else"])
                  }
                  html += "<b>"+strings.youWillNeed+" :</b>";
                  html += "<img src='"+imgPath+"/tutos/if_else"+suffix+".png' width='70px' style='vertical-align: middle' />";
                  break;
               case "maxBlocks":
                  var max = gridInfos.maxInstructions;
                  html += strings.maxBlocks(max,lang);
                  break;

            }
            html += "</p>";
         }

         return html
      };

      function addHelpConcept(dat) {
         if(!dat){
            return ""
         }

         var html = "<p>"; 
         html += strings.helpConcept(lang,dat);
         html += ".</p>";

         return html
      };

      function addTuto(type,ids) {
         var html = "";
         var suffix = (lang == "blockly") ? "_b" : "_s";
         if(!Array.isArray(ids)){
            ids = [ids];
         }
         html += "<div data-lang='blockly scratch' class='long'>";
         for(var iTuto = 0; iTuto < ids.length; iTuto++){
            var id = ids[iTuto];
            var marginTop = (iTuto > 0) ? "20px" : "0";
            html += "<div style='margin-top:"+marginTop+"'>";

            switch(id){
               case "drag_blocks":
                  var vidSrc = modulesPath+"vid/algorea/"+type+"_"+id+suffix;
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
                  html += "<p>"+strings.controlsRepeat+" :</p>";
                  html += "<div style='display: inline-block;vertical-align: top;'>";
                  html += "<img src='"+repeatSrc+".png'/>";
                  html += "</div>";
                  html += "<div style='max-width: 480px; margin: 10px;'>";
                  html += "<img src='"+keypadSrc+".png' width='100%' />";
                  html += "</div>";
                  html += "<p>"+strings.loopsAreUseful+"</p>";
                  html += "</div>";
                  break;
               case "blockly_controls_if_else":
                  html += "<div>";
                  html += "<div style='display: inline-block; vertical-align: middle; margin-top: 20px;'>";
                  html += "<img src='"+imgPath+"/tutos/if_else"+suffix+".png' />";
                  html += "</div>";
                  html += "<div style='display: inline-block; max-width: 400px; vertical-align: middle; margin-left: 20px;'>";
                  html += "<p>"+strings.ifElse+"</p>";
                  html += "</div>";
                  html += "</div>";
                  break;
               case "multiple_tests":
                  var tiles = data[level][0].tiles;
                  var nbCol = tiles[0].length;
                  html += "<p>"+strings.lookAtTests(nbTests)+"</p>";
                  html += "<div style='display: flex; text-align: center; flex-direction: "+((nbCol > 10) ? "column" : "row")+"; justify-content: center;'>"
                  for(var iTest = 0; iTest < nbTests; iTest++){
                     var testID = iTest + 1;
                     var src = $("#test_"+level+"_"+testID).attr("src");
                     html += "<div>";
                     html += "<p style='margin: 0; "+((nbCol > 10) ? "margin-top: 10px;" :"")+"color: #4a90e2'>TEST "+testID+"</p>";
                     html += "<img src='"+src+"' style='width: 90%; max-width: 400px;'/>";
                     html += "</div>";
                  }
                  html += "</div>";
                  break;
               case "change_direction":
                  html += "<h3>"+strings.changeDirection+"</h3>";
                  html += "<p>"+strings.toChangeDirection;
                  html += "<img src='"+imgPath+"/tutos/left"+suffix+".png' style='vertical-align: middle' />";
                  html += strings.or+"<img src='"+imgPath+"/tutos/right"+suffix+".png' style='vertical-align: middle' />";
                  html += "</p>";
                  html += "<p>"+strings.whenChangingDirection;
                  html += "<img src='"+imgPath+"/tutos/forward"+suffix+".png' style='vertical-align: middle' />";
                  html += strings.toChangeCell+"</p>";
                  break;
               default: // custom
                  html += $("#"+id).html();

            }
            html += "</div>";
         }
         html += "</div>";
         return html
      };

      function addCustom(dat) {
         if(dat.id){
            return $("#"+dat.id).html()
         }
         if(dat.text){
            return "<p>"+dat.text+"</p>"
         }
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
      

      
      // attention, vous ne disposez que de X blocs

      // Si vous avez besoin d'aide, cliquez sur le bouton "Plus de détails" ci-dessous. 
      // Une aide est disponible en cliquant sur le bouton "Plus de détails". 
      // Si vous ne connaissez pas ce bloc, cliquez sur "Plus de détails" pour une introduction. 
      // Vous ne pouvez utiliser que X instructions Y. 

      // Si vous êtes bloqué, en particulier si vous n'avez plus assez de blocs pour finir votre programme, cliquez sur le bouton "Plus de détails" pour obtenir plus d'aide. 
      // Dans cette version, les blocs sont regroupés par catégorie dans des menus. Cliquez sur un menu pour accéder aux blocs de la catégorie correspondante. 
      
   };
}
