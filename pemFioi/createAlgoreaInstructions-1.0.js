function createAlgoreaInstructions(subTask) {
   var level = displayHelper.taskLevel;
   if(level){
      // var lang = conceptViewer.selectedLanguage;
      var lang = window.modulesLanguage;
      if(!level || !lang){
         return ""
      }
      // console.log(window.getContext(null,{}).getInfo["itemTypes"])
      var strLang = window.stringsLanguage;
      var strings = algoreaInstructionsStrings[strLang];
      var gridInfos = extractLevelSpecific(subTask.gridInfos,level);
      var data = subTask.data;
      var nbTests = data[level].length;

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
               case "arrows":
                  totalHTML += createArrowsInstructions();
                  break;
               case "cards":
                  totalHTML += createCardsInstructions();
                  break;
               case "castle":
                  totalHTML += createCastleInstructions();
                  break;
               case "chticode_rel":
                  totalHTML += createChticodeRelInstructions();
                  break;   
               case "course":
                  totalHTML += createCourseInstructions();
                  break;
               case "dominoes":
                  totalHTML += createDominoesInstructions();
                  break
               case "fishing":
                  totalHTML += createFishingInstructions();
                  break
               case "flowers":
                  totalHTML += createFlowersInstructions();
                  break
               case "gems":
                  totalHTML += createGemsInstructions();
                  break
               case "help":
                  totalHTML += createHelpInstructions();
                  break;
               case "laser":
                  totalHTML += createLaserInstructions();
                  break
               case "marbles":
                  totalHTML += createMarblesInstructions();
                  break
               case "packages":
                  totalHTML += createPackagesInstructions();
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
                  totalHTML += "undefined";
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
                     totalHTML += addHelp(elem,type);
                     break;
                  case "custom":
                     totalHTML += addCustom(elem);
                     break;
               }
            }
         }

         var limitedUses = gridInfos.limitedUses;
         if(limitedUses && Array.isArray(limitedUses)){
            totalHTML += "<p>"+strings.limitedUses(limitedUses,lang,type)+"</p>";
         }

         var maxMoves = gridInfos.maxMoves;
         if(maxMoves && !isNaN(maxMoves)){
            totalHTML += "<p>"+strings.maxMoves(maxMoves)+"</p>";
         }

         if(nbTests > 1){
            totalHTML += "<p>"+strings.multipleTests(nbTests)+"</p>";
         }

         
         
         totalHTML += (tuto) ? "</div>" : "";

         if(tuto){
            totalHTML += addTuto(type,gridInfos.intro.tuto);
         }

         totalHTML += "</div>";

         return totalHTML
      };

      function createArrowsInstructions() {
         var html = "<p>"+strings.arrowsIntro+"</p>";
         return html
      };

      function createCardsInstructions() {
         var html = "<p>"+strings.cards+"</p>";
         if(gridInfos.intro.oneCard === true){
            html += "<p>"+strings.oneCard+"</p>";
         }
         return html
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

      function createChticodeRelInstructions() {
         var html = "<p>"+strings.chticodeRel+"</p>";
         return html
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
         var rollOver = (gridInfos.intro.rollOver === true || countItem([3,4,5,6,7,8,9,10]) > 0);

         var html = "<p>"+strings.dominoes(nbTarget);+"</p>";

         if(rollOver){
            html += "<p>"+strings.rollOver+"</p>";
         }

         return html
      };

      function createFishingInstructions() {
         var nbIslands = countItem(6);

         var html = "<p>"; 
         html += strings.fishing(nbIslands);
         html += "</p>";

         if(gridInfos.intro.howTo == true){
            html += "<p>"; 
            html += strings.fishingHowTo;
            html += "</p>";
         }
         
         if(gridInfos.intro.exactNumber == true){
            html += "<p>"; 
            html += strings.fishingExactNumber;
            html += "</p>";
         }
         return html
      };

      function createFlowersInstructions() {
         var nbTarget = countItem(2);
         // var nbFixed = countItem(5);

         var html = "<p>"; 
         html += strings.flowers(nbTarget);
         html += "</p>";
         
         if(gridInfos.intro.dontStepOnFlowers === true){
            html += "<p>";
            html += strings.dontStepOnFlowers;
            html += "</p>";
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

      function createHelpInstructions() {
         var nbCubes = countItem(6);

         var html = "<p>"; 
         html += strings.helpIntro(nbCubes);
         html += "</p>";

         return html
      };

      function createLaserInstructions() {
         var nbMirrors = countItem([6,7,8,9]);
         var imgSrc = imgPath+"launcher_instructions";

         var html = "";

         html += "<p>"+strings.laser1+"</br>"+strings.laser2+"</p>";
         html +=  "<div style='float: left; vertical-align: top; padding: 5px; margin-right: 5px; border: 1px solid black; max-width: 33%;'>";
         html += "<div style='width: 90%; max-width: 150px; margin: auto;'>";
         html += "<img src='"+imgSrc+".png'/>";
         html += "</div>";
         html += "<p style='text-align: center; margin: 0;'><strong>"+strings.launcher+"</strong></p>";
         html += "</div>";
         if(gridInfos.intro.overLaser === true || gridInfos.intro.laserDirection === true){
            html += "<p>";
            if(gridInfos.intro.overLaser === true){
               html += strings.overLaser+" ";
            }
            if(gridInfos.intro.laserDirection === true){
               html += strings.laserDirection;
            }
            html += "</p>";
         }
         if(nbMirrors > 0){
            html += "<p>"+strings.mirrors+"</p>";
         }

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

      function createPackagesInstructions() {
         var nbBoxes = countItem(6);

         var html = "<p>"; 
         html += strings.packages(nbBoxes);
         html += "</p>";

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
      /**************/

      function addHelp(dat,type) {
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
               case "repeatBlock":
                  if(lang == "python"){
                     return addHelpConcept(["blockly_controls_repeat"])
                  }
                  html += "<b>"+strings.youWillNeed+" :</b>";
                  html += "<img src='"+imgPath+"/tutos/repeat"+suffix+".png' width='120px' style='vertical-align: middle' />";
                  break;
               case "ifElse":
                  if(lang == "python"){
                     return addHelpConcept(["blockly_controls_if_else"])
                  }
                  html += "<b>"+strings.youWillNeed+" :</b>";
                  html += "<img src='"+imgPath+"/tutos/if_else"+suffix+".png' width='70px' style='vertical-align: middle' />";
                  break;
               case "variable":
                  if(lang == "python"){
                     return addHelpConcept(["extra_variable"])
                  }
                  var imgSrc = (type != "veterinary") ? imgPath+"/tutos/variable"+suffix : imgPath+"/tutos/"+type+"_variable"+suffix;
                  html += "<b>"+strings.youWillNeed+" :</b>";
                  html += "<img src='"+imgSrc+".png' style='vertical-align: middle' />";
                  break;
               case "extraVariable":
                  if(lang == "python"){
                     return addHelpConcept(["extra_variable"])
                  }
                  var str = strings.extraVariableHelp;
                  str = str.replace("$0","<img src='"+imgPath+"/tutos/create_variable.png' style='vertical-align: middle' />");
                  str = str.replace("$1","<img src='"+imgPath+"/tutos/"+type+"_extra_variable_incr"+suffix+".png' style='vertical-align: middle' />");
                  html += "<b>"+str+"</b>";
                  break;
               case "function":
                  if(lang == "python"){
                     return addHelpConcept(["extra_function"])
                  }
                  html += "<b>"+strings.youWillNeed+" :</b>";
                  html += "<img src='"+imgPath+"/tutos/function"+suffix+".png' width='200px' style='vertical-align: middle' />";
                  break;
               case "maxBlocks":
                  var max = gridInfos.maxInstructions;
                  html += strings.maxBlocks(max,lang);
                  break;
               case "nestedRepeat":
                  html += strings.helpNestedRepeat;
                  break;
               case "warningEasy":
                  html += strings.warningEasy;
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
               case "blockly_controls_if":
                  var imgSrc = modulesPath+"img/algorea/tutos/"+type+"_"+id+suffix;
                  html += "<p>"+strings.if_1(type)+"</p>";
                  html += "<p>"+strings.multipleTestsAlt(nbTests)+"</p>";
                  html += "<div style='display: flex; text-align: center; justify-content: center; margin-bottom: 20px;'>"
                  for(var iTest = 0; iTest < nbTests; iTest++){
                     var testID = iTest + 1;
                     var src = $("#test_"+level+"_"+testID).attr("src");
                     html += "<div>";
                     html += "<p style='margin: 0; "+((nbCol > 10) ? "margin-top: 10px;" :"")+"color: #4a90e2'>TEST "+testID+"</p>";
                     html += "<img src='"+src+"' style='width: 90%; max-width: 400px;'/>";
                     html += "</div>";
                  }
                  html += "</div>";
                  html += "<p>"+strings.if_2+"</p>";
                  html += "<div style='display: inline-block; margin: 20px;'>";
                  html += "<img src='"+imgSrc+".png' />";
                  html += "</div>";
                  html += "<div style='display: inline-block; margin-left: 5px; margin-right: 5px; vertical-align: top;'>"
                  html += "<p>"+strings.if_3(type)+"</p>";
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
               case "extra_nested_repeat":
                  var vidSrc = modulesPath+"vid/algorea/"+type+"_"+id+suffix;
                  html += "<div style='display: inline-block;vertical-align: top;'>";
                  html += "<img src='"+imgPath+"/tutos/"+type+"_"+id+"_sequence"+suffix+".png'/>";
                  html += "</div>";
                  html += "<div style='display: inline-block;vertical-align: top;'>";
                  html += "<p>"+strings.sameAs+" :</p>";
                  html += "</div>";
                  html += "<div style='display: inline-block;vertical-align: top;'>";
                  html += "<img src='"+imgPath+"/tutos/"+type+"_"+id+"_repeat"+suffix+".png'/>";
                  html += "</div>";
                  html += "<div style='display: block; width: 100%; max-width: 400px; border: 1px solid black; padding: 10px; margin-left: 20px; margin: 10px;'>";
                  html += "<p>"+strings.demonstration+" :</p>";
                  html += "<video controls style='max-width: 380px;'><source src='"+vidSrc+".mp4' type=video/mp4></video>";
                  html += "</div>";
                  break;
               case "quantity":
                  var explainSrc = modulesPath+"img/algorea/tutos/"+type+"_"+id+"_explain";
                  var withdrawSrc = modulesPath+"img/algorea/tutos/"+type+"_"+id+"_withdraw"+suffix;
                  var dropSrc = modulesPath+"img/algorea/tutos/"+type+"_"+id+"_drop"+suffix;
                  html += "<div style='width: 90%; max-width: 480px;'>"
                  html += "<img src='"+explainSrc+".png' />";
                  html += "</div>";
                  html += "<p>"+strings.quantity_1(type)+"</p>";
                  var nextParagraph = strings.quantity_2(type);
                  nextParagraph = nextParagraph.replace("$1","<img src='"+withdrawSrc+".png' style='vertical-align: middle;' />");
                  nextParagraph = nextParagraph.replace("$2","<img src='"+dropSrc+".png' style='vertical-align: middle;' />");
                  html += "<p>"+nextParagraph+"</p>";
                  break;
               case "variable":
                  var explainSrc = imgPath+"/tutos/"+type+"_"+id+"_explain";
                  var sensorSrc = imgPath+"/tutos/"+type+"_"+id+"_sensor";
                  var setSrc = imgPath+"/tutos/"+type+"_"+id+"_set"+suffix;
                  var withdrawSrc = imgPath+"/tutos/"+type+"_"+id+"_withdraw"+suffix;
                  var dropSrc = imgPath+"/tutos/"+type+"_"+id+"_drop"+suffix;
                  var vidSrc = modulesPath+"vid/algorea/"+type+"_"+id;
                  var variableSrc = (type != "veterinary") ? imgPath+"/tutos/variable"+suffix : imgPath+"/tutos/"+type+"_variable"+suffix;
                  html += "<div style='width: 90%; max-width: 480px;'>";
                  html += "<img src='"+explainSrc+".png' />";
                  html += "</div>";
                  html += "<p>"+strings.variable_1(type,nbTests)+"</p>";
                  html += "<div style='display: flex; text-align: center; justify-content: center;'>"
                  for(var iTest = 0; iTest < nbTests; iTest++){
                     var testID = iTest + 1;
                     var src = $("#test_"+level+"_"+testID).attr("src");
                     html += "<div>";
                     html += "<p style='margin: 0; color: #4a90e2'>TEST "+testID+"</p>";
                     html += "<img src='"+src+"' style='width: 90%; max-width: 400px;'/>";
                     html += "</div>";
                  }
                  html += "</div>";
                  html += "<p>"+strings.variable_2(type)+"</p>";
                  html += "<div>";
                  html += "<div style='display: inline-block; vertical-align: top; max-width: 38%;'>";
                  html += "<div style='width: 90%; max-width: 480px;'>"
                  html += "<img src='"+sensorSrc+".png' />";
                  html += "</div>";
                  html += "</div>";
                  html += "<div style='display: inline-block; vertical-align: top; max-width: 55%;'>";
                  html += "<p>"+strings.variable_3+"</p>";
                  html += "<img src='"+setSrc+".png' />";
                  html += "<p>"+strings.variable_4(type)+"</p>";
                  html += "</div>";
                  html += "</div>";
                  html += "<div>";
                  html += "<div style='display: inline-block; vertical-align: top; max-width: 35%; border: 1px solid black; padding: 10px; margin-left: 20px; margin: 10px;''>";
                  html += "<p>"+strings.animation+" :</p>";
                  html += "<video controls style='width: 100%;'><source src='"+vidSrc+".mp4' type=video/mp4></video>";
                  html += "</div>";
                  html += "<div style='display: inline-block; vertical-align: top; max-width: 60%;'>";
                  var nextLine = strings.variable_5;
                  nextLine = nextLine.replace("$0","<img src='"+variableSrc+".png' style='display: inline; vertical-align: middle' />");
                  html += "<p>"+nextLine+" :</p>";
                  html += "<img src='"+withdrawSrc+".png' style='display: block; vertical-align: middle'/>";
                  html += "<p>"+strings.variable_6(type)+"</p>";
                  html += "<img src='"+dropSrc+".png' style='display: block; vertical-align: middle'/>";
                  html += "</div>";
                  html += "</div>";
                  break;
               case "extra_variable":
                  var createSrc = imgPath+"/tutos/create_variable";
                  var setSrc = imgPath+"/tutos/"+type+"_"+id+"_set"+suffix;
                  var set2Src = imgPath+"/tutos/"+type+"_"+id+"_set_2"+suffix;
                  var set4Src = imgPath+"/tutos/"+type+"_"+id+"_set_4"+suffix;
                  var incrSrc = imgPath+"/tutos/"+type+"_"+id+"_incr"+suffix;
                  var incr3Src = imgPath+"/tutos/"+type+"_"+id+"_incr_3"+suffix;
                  var variableSrc = imgPath+"/tutos/"+type+"_"+id+"_variable"+suffix;
                  html += "<h3>"+strings.extraVariable_1+"</h3>";
                  html += "<p>"+strings.extraVariable_2+"</p>";

                  var nextLine = strings.extraVariable_3(type);
                  nextLine = nextLine.replace("$0","<img src='"+createSrc+".png' style='display: inline; vertical-align: middle' />");
                  html += "<p>"+nextLine+"</p>";

                  html += "<h3>"+strings.extraVariable_4+"</h3>";

                  var nextLine = strings.extraVariable_5;
                  nextLine = nextLine.replace("$0","<img src='"+setSrc+".png' style='display: inline; vertical-align: middle' />");
                  html += "<p>"+nextLine+"</p>";
              
                  html += "<p>"+strings.extraVariable_6;
                  html += "<img src='"+incrSrc+".png' style='vertical-align: middle'/>";
                  html += "</p>";
                  html += "<p><b>"+strings.example+" :</b></p>";
                  html += "<table id='exemple'>";

                  html += "<tr>";
                  html += "<td><img src='"+set2Src+".png' style='vertical-align: middle'/></td>";
                  html += "<td><img src='"+variableSrc+".png' style='vertical-align: middle'/>";
                  html += strings.extraVariable_7+"</td>";
                  html += "</tr>";

                  html += "<tr>";
                  html += "<td><img src='"+set4Src+".png' style='vertical-align: middle'/></td>";
                  html += "<td>";
                  var nextLine = strings.extraVariable_8;
                  nextLine = nextLine.replace("$0","<img src='"+variableSrc+".png' style='vertical-align: middle'/>");
                  html += nextLine+"</td>";
                  html += "</tr>";

                  html += "<tr>";
                  html += "<td><img src='"+incr3Src+".png' style='vertical-align: middle'/></td>";
                  html += "<td>";
                  var nextLine = strings.extraVariable_9;
                  nextLine = nextLine.replace("$0","<img src='"+variableSrc+".png' style='vertical-align: middle'/>");
                  html += nextLine+"</td>";
                  html += "</tr></table>";
                  break;
               case "extra_function":
                  var functionSrc = imgPath+"/tutos/function"+suffix;
                  var editorSrc = imgPath+"/tutos/"+id+"_editor"+suffix;
                  var nameSrc = imgPath+"/tutos/"+type+"_"+id+"_name"+suffix;
                  var defSrc = imgPath+"/tutos/"+type+"_"+id+"_def"+suffix;
                  var newSrc = imgPath+"/tutos/"+type+"_"+id+"_new"+suffix;
                  var progSrc = imgPath+"/tutos/"+type+"_"+id+"_prog"+suffix;
                  html += "<p>"+strings.extraFunction_1+"</p>";
                  html += "<ol type='1'>";
                  html += "<li class='space_dessous'>";
                  var nextLine = strings.extraFunction_2;
                  nextLine = nextLine.replace("$0","<img src='"+functionSrc+".png' width='180px' style='vertical-align: middle'/>");
                  html += "<p>"+nextLine+"</p>";
                  html += "<img src='"+editorSrc+".png' style='border: 1px solid black; max-width: 500px'/>";
                  html += "</li>";
                  html += "<li class='space_dessous'>";
                  html += "<p>"+strings.extraFunction_3+"</p>";
                  html += "<img src='"+nameSrc+".png' style='border: 1px solid black; max-width: 500px'/>";
                  html += "</li>";
                  html += "<li class='space_dessous'>";
                  html += "<p>"+strings.extraFunction_4+"</p>";
                  html += "<img src='"+defSrc+".png' style='border: 1px solid black; max-width: 500px'/>";
                  html += "</li>";
                  html += "<li class='space_dessous'>";
                  var nextLine = strings.extraFunction_5;
                  nextLine = nextLine.replace("$0","<img src='"+newSrc+".png' style='vertical-align: middle'/>");
                  html += "<p>"+nextLine+"</p>";
                  html += "<p>"+strings.extraFunction_6+"</p>";
                  html += "<img src='"+progSrc+".png' style='border: 1px solid black; max-width: 500px'/>";
                  html += "<p>"+strings.extraFunction_7+"</p>";
                  html += "</li>";
                  html += "</ol>";
                  break;
               case "laser":
                  var launcherSrc = imgPath+"/tutos/laser_robot_on_launcher";
                  var shootSrc = imgPath+"/tutos/laser_shoot"+suffix;
                  html += "<p>"+strings.laser_1+"</p>";
                  html += "<img src="+launcherSrc+".png />";
                  html += "<p>"+strings.laser_2+"</p>";
                  html += "<img src="+shootSrc+".png />";
                  html += "<p>"+strings.laser_3+"</p>";
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
               if((Array.isArray(id) && Beav.Array.has(id,itemID)) || itemID == id){
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
