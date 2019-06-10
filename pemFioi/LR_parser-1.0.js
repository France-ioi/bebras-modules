function LR_Parser(settings,subTask,answer) {
   self = this;
   this.mode = settings.mode;
   /* 
   1: simulation
   2: execute existing automaton
   */
   this.rules = settings.rules;
   this.input = settings.input;
   this.grammar;
   this.lrClosureTable;
   this.lrTable;
   this.stackData = ["State","Symbol"];
   this.stack = [["0", "#"]];
   this.currentState;
   this.currentVertex;
   this.inputIndex = 0;
   this.actionSequence = [];
   this.simulationStep = 0;

   this.timeOutID;
   this.animationTime = 1000;
   this.token;

   this.divID = settings.divID,
   this.parseInfoID = "parseInfo";
   this.parseTableID = "parseTable";
   this.graphPaperID = "graphPaper";
   this.tabsID = "tabs";

   this.paper;
   this.paperHeight = settings.paperHeight;
   this.paperWidth = settings.paperWidth;
   this.visualGraphJSON = settings.visualGraphJSON;

   this.graphDrawer;
   this.visualGraph;
   this.graph;
   this.graphMouse;
   this.graphEditor;

   this.tabTag = [ "automatonTab", "parseTableTab" ];
   this.selectedTab = 0;
   this.cursor;
   this.selectedVertex = null;
   this.selectedRule = null;
   this.selectedStackElements = [];

   this.accept = false;
   this.error = false;

   this.colors = {
      black: "#4a4a4a",
      yellow: "#f7aa28",
      lightgrey: "#f2f2f2",
      blue: "#4990e2"
   };
   this.unselectedTabAttr = {
      opacity: 0.5
   };
   this.selectedTabAttr = {
      opacity: 1
   };
   this.defaultEdgeAttr = {
     "stroke": "#f7aa28",
     "stroke-width": 4,
     "arrow-end": "long-classic-wide"
   };
   this.defaultVertexAttr = {
     "r": 15,
     "fill": "#4a4a4a",
     "stroke": "white",
     "stroke-width": 1
   };
   this.defaultSelectedVertexAttr = {
      "stroke": this.colors.yellow,
     "stroke-width": 5,
   };
   this.defaultCurrentStateAttr = {
      "fill": this.colors.blue
   };
   this.defaultVertexLabelAttr = {
     "font-size": 12,
     "fill": "white"
   };
   this.defaultVertexContentAttr = {
     "font-size": 12,
     "fill": "white",
     "text-anchor": "start"
   };
   this.selectedStackElementAttr = {

   };
   this.vertexAttr = settings.vertexAttr || this.defaultVertexAttr;
   this.edgeAttr = settings.edgeAttr || this.defaultEdgeAttr;
   this.vertexLabelAttr = settings.vertexLabelAttr || this.defaultVertexLabelAttr;
   this.vertexContentAttr = settings.vertexContentAttr || this.defaultVertexContentAttr;
   this.selectedVertexAttr = settings.selectedVertexAttr || this.defaultSelectedVertexAttr;


   this.init = function() {
      var html = "";
      html += "<div id=\""+this.tabsID+"\"></div>";
      html += "<div id=\""+this.graphPaperID+"\"></div>";
      html += "<div id=\""+this.parseTableID+"\"></div>";
      html += "<div id=\""+this.parseInfoID+"\"></div>";

      $("#"+this.divID).html(html);
      this.initParser();
      this.initTabs();
      this.paper = subTask.raphaelFactory.create(this.graphPaperID,this.graphPaperID,this.paperWidth,this.paperHeight);
      this.initAutomata();
      if(this.mode == 1){
         this.initActionSequence();
      }
      this.initParseTable();
      this.showTab();
      this.initParseInfo();

      this.style();
      this.updateState();
      this.initHandlers();
   };

   this.initTabs = function() {
      $("#"+this.tabsID).html("<span id=\"automatonTab\">Automaton</span><div id=\"switchContainer\"><div id=\"switch\"></div></div><span id=\"parseTableTab\">Parse table</span>");
      $("#"+this.tabTag[this.selectedTab]).addClass("selectedTab");
   };

   this.initParser = function() {
      var ruleStr = this.rules.toString().replace(/,/g,"\n");
      this.grammar = new Grammar(ruleStr);
      this.lrClosureTable = new LRClosureTable(this.grammar);
      this.lrTable = new LRTable(this.lrClosureTable);
   };

   this.initAutomata = function() {
      this.graphDrawer = new SimpleGraphDrawer(this.vertexAttr,this.edgeAttr,null,true);
      this.graphDrawer.setVertexLabelAttr(this.vertexLabelAttr);
      this.graphDrawer.setVertexContentAttr(this.vertexContentAttr);
      this.visualGraph = VisualGraph.fromJSON(this.visualGraphJSON, "visualGraph", this.paper, null, this.graphDrawer, true);
      this.graph = this.visualGraph.graph;
      if(this.mode != 1){
         this.graphMouse = new GraphMouse("graphMouse",this.graph,this.visualGraph);
         this.graphEditor = new GraphEditor({
            paper: this.paper,
            graph: this.graph,
            paperElementID: this.graphPaperID,
            visualGraph: this.visualGraph,
            graphMouse: this.graphMouse,
            // dragThreshold: 10,
            // edgeThreshold: 20,
            // dragLimits: {
            //    minX: this.visualGraph.graphDrawer.circleAttr.r,
            //    maxX: this.graphPaper.width - this.visualGraph.graphDrawer.circleAttr.r,
            //    minY: this.visualGraph.graphDrawer.circleAttr.r,
            //    maxY: this.graphPaper.height - this.visualGraph.graphDrawer.circleAttr.r
            // },
            // alphabet: this.alphabet,
            // callback: this.callback,
            // onDragEnd: this.callback,
            selectedVertexAttr: this.selectedVertexAttr,
            selectVertexCallback: this.onVertexSelect,
            enabled: true
         });
         // if(this.mode == 2){
            this.graphEditor.setCreateVertexEnabled(false);
            this.graphEditor.setCreateEdgeEnabled(false);
            this.graphEditor.setVertexDragEnabled(false);
            this.graphEditor.setEdgeDragEnabled(false);
            this.graphEditor.setDragGraphEnabled(false);
            this.graphEditor.setScaleGraphEnabled(false);
            this.graphEditor.setEditVertexLabelEnabled(false);
            this.graphEditor.setEditVertexContentEnabled(false);
            this.graphEditor.setEditEdgeLabelEnabled(false);
            this.graphEditor.setTerminalEnabled(false);
            this.graphEditor.setInitialEnabled(false);
         // }
      }
   };

   this.initActionSequence = function() {
      if(this.input.charAt(this.input.length - 1) != "$"){
         this.input += "$";
      }
      this.input = this.input.replace(/ /g,"");
      var state = 0;
      var iChar = 0;
      var symbol = this.input.charAt(iChar);
      var error = false;
      var success = false;
      var nLoop = 0;
      do{
         nLoop++;
         var action = this.lrTable.states[state][symbol];
         if(action){
            switch(action[0].actionType){
               case "s":
                  this.actionSequence.push({
                     actionType: "s",
                     state: action[0].actionValue,
                     // char: symbol
                  });
                  state = action[0].actionValue;
                  this.stack.push([state,symbol]);
                  iChar++;
                  symbol = this.input.charAt(iChar);
                  break;
               case "r":
                  this.actionSequence.push({
                     actionType: "r",
                     rule: action[0].actionValue
                  });
                  symbol = this.grammar.rules[action[0].actionValue].nonterminal;
                  nbRedChar = this.grammar.rules[action[0].actionValue].development.length;
                  state = this.stack[this.stack.length - 1 - nbRedChar][0];
                  this.stack.splice(this.stack.length - nbRedChar,nbRedChar,symbol);
                  if(symbol == "S" && iChar >= this.input.length - 1){
                     this.actionSequence[this.actionSequence.length - 1]["goto"] = this.getTerminalState();
                     success = true;
                  }
                  break;
               case "":    // goto
                  state = action[0].actionValue;
                  this.actionSequence[this.actionSequence.length - 1]["goto"] = state;
                  symbol = this.input.charAt(iChar);
                  break;
            }
         }else{
            error = true;
            this.actionSequence.push({actionType: "error"});
            break;
         }
      }while(iChar < this.input.length && !error && !success && nLoop < 50);
      this.stack = [["0","#"]];
      // console.log(this.actionSequence);
   };

   this.initParseTable = function() {
      var colLabel = [];
      var html = "<table><tr><th rowspan=2>State</th><th colspan=\""+(this.grammar.terminals.length + 1)+"\">Action</th><th colspan=\""+this.grammar.nonterminals.length+"\">Goto</th></tr>";
      html += "<tr>";
      for(var terminal of this.grammar.terminals){
         html += "<th>"+terminal+"</th>";
         colLabel.push(terminal);
      }
      html += "<th>$</th>";
      colLabel.push("$");
      for(var nonterminal of this.grammar.nonterminals){
         html += "<th>"+nonterminal+"</th>";
         colLabel.push(nonterminal);
      }
      html += "</tr>";
      for(var state of this.lrTable.states){
         html += "<tr>";
         html += "<td>"+state.index+"</td>";
         for(var iCol = 0; iCol < (this.grammar.terminals.length + 1 + this.grammar.nonterminals.length); iCol++){
            html += "<td>";
            if(state[colLabel[iCol]]){
               html += state[colLabel[iCol]][0]["actionType"]+state[colLabel[iCol]][0]["actionValue"];
            }else if(colLabel[iCol] == "S" && state.index == 0){
               html += "Acc."
            }
            html += "</td>";
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#"+this.parseTableID).html(html);
   };

   this.initParseInfo = function() {
      var html = "<div id=\"rules\"></div><div id=\"action\"></div>";
      $("#"+this.parseInfoID).html(html);
      this.initRules();
      this.initAction();
   };

   this.initRules = function() {
      var html = "<h3>GRAMMAR</h3>";
      html += "<ul>";
      for(var iRule = 0; iRule < this.rules.length; iRule++){
         html += "<li class=\"rule\" data_rule=\""+iRule+"\"><span class=\"ruleIndex\">"+iRule+
         "</span> <span class=\"nonTerminal\">"+this.grammar.rules[iRule].nonterminal+"</span><i class=\"fas fa-long-arrow-alt-right\"></i><span class=\"development\">"+
         this.grammar.rules[iRule].development.join(" ")+"</span></li>";
      }
      html += "</ul>";
      $("#rules").html(html);
   };

   this.initAction = function() {
      this.initPlayer();
      this.initActionInfo();
   };

   this.initPlayer = function() {
      var html = "<div id=\"player\">"
      html += "<div id=\"play\"><i class=\"fas fa-play\"></i></div>";
      html += "<div id=\"progressBarClickArea\">";
      html += "<div id=\"progressBarContainer\">";
      html += "<div id=\"progressBar\"><div id=\"progressBarMarker\"></div></div>"
      html += "</div></div>";
      html += "<div id=\"stepBackward\"><i class=\"fas fa-step-backward\"></i></div>";
      html += "<div id=\"stepForward\"><i class=\"fas fa-step-forward\"></i></div>";
      html += "</div>";
      html += "<div id=\"actionInfo\"></div>";
      $("#action").html(html);
   };

   this.initActionInfo = function() {
      this.initStackTable();
      this.initReduceButton();
      this.initInput();
      this.initShiftButton();
      this.initAcceptButton();
      this.initErrorButton();
   };

   this.initStackTable = function() {
      var html = "<h4>Stack</h4>";
      html += "<table id=\"stackTable\">";
      html += "</table>";
      $("#actionInfo").html(html);
      this.updateStackTable();
   };

   this.initReduceButton = function() {
      var html = "<div id=\"reduceBar\">";
      html += "<div class=\"messageBackground\"><div id=\"reduceMessage\" class=\"actionMessage\"></div></div>"
      html += "<div id=\"reduceButton\" class=\"actionButton\"><i class=\"fas fa-compress buttonIcon\"></i> REDUCE</div>"
      html += "</div>";
      $("#actionInfo").append(html);
   }; 

   this.initInput = function() {
      if(this.input.charAt(this.input.length - 1) != "$"){
         this.input += "$";
      }
      this.input = this.input.replace(/ /g,"");
      var html = "<div id=\"inputBar\">";
      html += "<h4>Input</h4>";
      for(var char of this.input){
         html += "<div class=\"inputChar\">"+char+"</div>";
      }
      html += "</div>";
      $("#actionInfo").append(html);
      this.initCursor();
   }; 

   this.initCursor = function() {
      var html = "<div id=\"cursor\"><div id=\"topCircle\"></div><div id=\"cursorBar\"></div><div id=\"bottomCircle\"></div></div>";
      $("#inputBar").append(html);
   };

   this.initShiftButton = function() {
      var html = "<div id=\"shiftBar\">";
      html += "<div class=\"messageBackground\"><div id=\"shiftMessage\" class=\"actionMessage\"></div></div>"
      html += "<div id=\"shiftButton\" class=\"actionButton\"><i class=\"fas fa-arrow-right buttonIcon\"></i> SHIFT</div>"
      html += "</div>";
      $("#actionInfo").append(html);
   }; 

   this.initAcceptButton = function(){
      var html = "<div id=\"acceptBar\">";
      html += "<span id=\"acceptMessage\" class=\"actionMessage\"></span>"
      html += "<div id=\"acceptButton\" class=\"actionButton\"><i class=\"fas fa-thumbs-up buttonIcon\"></i> ACCEPT</div>"
      html += "</div>";
      $("#actionInfo").append(html);
   };

   this.initErrorButton = function(){
      var html = "<div id=\"errorBar\">";
      html += "<span id=\"errorMessage\" class=\"actionMessage\"></span>"
      html += "<div id=\"errorButton\" class=\"actionButton\"><i class=\"fas fa-times buttonIcon\"></i> ERROR</div>"
      html += "</div>";
      $("#actionInfo").append(html);
   };

   this.initHandlers = function() {
      $("#"+this.tabsID+" #switchContainer").off("click");
      $("#"+this.tabsID+" #switchContainer").click(self.switchTab);
      if(this.mode != 1){
         $("#reduceButton").off("click");
         $("#reduceButton").click(self.reduce);
         $("#shiftButton").off("click");
         $("#shiftButton").click(self.shift);
         $(".stackElement").off("click");
         $(".stackElement").click(self.selectStackElement);
         $(".rule").off("click");
         $(".rule").click(self.selectRule);
         $(".rule, .actionButton, #stackTable .stackElement").css({
            cursor: "pointer"
         });
         this.initPlayerHandlers();
         $("#acceptButton").off("click");
         $("#acceptButton").click(self.acceptInput);
         $("#errorButton").off("click");
         $("#errorButton").click(self.refuseInput);
      }else{
         this.initPlayerHandlers();
      }
   };

   this.initPlayerHandlers = function() {
      $("#play").off("click");
      $("#play").click(self.runSimulation);
      $("#play").css({
         cursor: "pointer"
      });
      this.disablePlayerSteps();
      this.enablePlayerSteps();
      this.disableProgressBarClick();
      this.enableProgressBarClick();
   };

   this.disablePlayerSteps = function() {
      $("#stepBackward").off("click");
      $("#stepForward").off("click");
      $("#stepBackward, #stepForward").css({
         cursor: "auto",
         opacity: "0.5"
      });
   };

   this.enablePlayerSteps = function() {
      $("#stepBackward").click(self.stepBackward);
      $("#stepForward").click(self.stepForward);
      $("#stepBackward, #stepForward").css({
         cursor: "pointer",
         opacity: "1"
      });
   };

   this.disableProgressBarClick = function() {
      $("#progressBarClickArea").off("click");
      $("#progressBarClickArea").css({
         cursor: "auto"
      });
   };

   this.enableProgressBarClick = function() {
      $("#progressBarClickArea").click(self.progressBarClick);
      $("#progressBarClickArea").css({
         cursor: "pointer"
      });
   };

   this.reset = function() {
      this.stack = [["0", "#"]];
      this.inputIndex = 0;
      this.updateCursor(false);
      this.simulationStep = 0;
      this.selectedRule = null;
      $(".rule").removeClass("selected");
      this.selectedStackElements = [];
      this.styleRules();
      this.styleStackTable();
      this.styleProgressBar();
   };

   this.runSimulation = function() {
      $("#play i").removeClass("fa-play").addClass("fa-pause");
      $("#play").off("click");
      $("#play").click(self.pauseSimulation);
      self.resetFeedback();
      self.reset();
      self.runSimulationLoop(self.simulationStep,true,false,true);
   };

   this.runSimulationLoop = function(step,loop,reverse,anim) {
      // console.log(step+" "+this.actionSequence.length);
      var progress = (reverse) ? 100*(step)/this.actionSequence.length : 100*(step + 1)/this.actionSequence.length;
      var action = this.actionSequence[step];
      this.disablePlayerSteps();
      this.disableProgressBarClick();
      // console.log(step+" "+action.actionType);
      if(progress > 100){
         self.pauseSimulation(true);
      }else{
         if(!anim){
            var animationTime = 0;
         }else{
            var animationTime = (action.actionType == "r") ? 4*this.animationTime : this.animationTime;
         }
         $("#progressBar").animate({width:progress+"%"},animationTime,function(){
            if(action.actionType != "r" || self.selectedRule == null){
               if(reverse){
                  self.simulationStep--;
               }else{
                  self.simulationStep++;
               }
            }
            if(!loop){
               self.enablePlayerSteps();
               self.enableProgressBarClick();
               return;
            }
            self.runSimulationLoop(self.simulationStep,loop,reverse,anim);
         });
      }
      if(!action){
         self.pauseSimulation(true);
         return;
      }
            
      switch(action.actionType){
         case "s":
            self.applyShift(action.state,reverse,anim);
            break;
         case "r":
            var rule = action.rule;
            if(reverse){
               this.reverseReduction(rule);
               return;
            }
            
            var nbRedChar = self.grammar.rules[rule].development.length;
            var startIndex = self.stack.length - nbRedChar;
            for(var iSelCol = 0; iSelCol < nbRedChar; iSelCol++){
               var index = startIndex + iSelCol;
               $(".stackElement[data_col="+index+"]").addClass("selected");
               self.selectedStackElements.push(index);
            }
            self.styleStackTable();
            $(".rule").removeClass("selected");
            $(".rule[data_rule="+rule+"]").addClass("selected");
            self.selectedRule = rule;
            self.styleRules();
            if(anim){
               this.timouOutID = setTimeout(function() {
                  var nonTerminal = self.grammar.rules[rule].nonterminal;
                  var goto = action.goto;
                  self.applyReduction(nonTerminal,goto,true);
               }, self.animationTime);
            }else{
               var nonTerminal = self.grammar.rules[rule].nonterminal;
               var goto = action.goto;
               self.applyReduction(nonTerminal,goto,false);
            }
                                 
      }
   };

   this.pauseSimulation = function(end) {
      // console.log("pause");
      if(!end)
         self.simulationStep++;
      // clearTimeout(self.timeOutID);
      // subTask.raphaelFactory.stopAnimate("anim");
      $("#progressBar").stop();
      $("#play i").removeClass("fa-pause").addClass("fa-play");
      self.initPlayerHandlers();
   };

   this.stepBackward = function() {
      self.resetFeedback();
      // console.log(self.simulationStep);
      if(self.simulationStep < 1){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep - 1, false, true);
      }
   };

   this.stepForward = function() {
      self.resetFeedback();
      if(self.simulationStep >= self.actionSequence.length){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep, false, false,true);
      }
   };

   this.progressBarClick = function(event) {
      self.resetFeedback();
      var x = event.pageX - $(this).offset().left;
      var w = $(this).width();
      var step = Math.floor(self.actionSequence.length*x/w);

      self.replayUpTo(step,false);
   };

   this.replayUpTo = function(step,anim) {
      this.reset();
      for(var iStep = 0; iStep <= step; iStep++){
         this.runSimulationLoop(iStep,false,false,anim);
      }
   };

   this.selectStackElement = function() {
      self.resetFeedback();
      var col = parseInt($(this).attr("data_col"));

      if($(this).hasClass("selected")){
         for(var iCol = 0; iCol <= col; iCol++){
            $(".stackElement[data_col="+iCol+"]").removeClass("selected");
         }
         self.selectedStackElements = self.selectedStackElements.filter(element => element > col);
      }else{
         for(var iCol = col; iCol < self.stack.length; iCol++){
            $(".stackElement[data_col="+iCol+"]").addClass("selected");
            if(!self.selectedStackElements.includes(iCol)){
               self.selectedStackElements.push(iCol);
            }
         }
      }
      // if($(this).hasClass("selected")){
      //    $(".stackElement[data_col="+col+"]").removeClass("selected");
      //    self.selectedStackElements = self.selectedStackElements.filter(element => element != col);
      // }else{
      //    $(".stackElement[data_col="+col+"]").addClass("selected");
      //    self.selectedStackElements.push(col);
      // }
      self.styleStackTable();
   };

   this.selectRule = function() {
      self.resetFeedback();
      var ruleID = $(this).attr("data_rule");
      if($(this).hasClass("selected")){
         $(this).removeClass("selected");
         self.selectedRule = null;
      }else{
         $(".rule").removeClass("selected");
         $(this).addClass("selected");
         self.selectedRule = ruleID;
      }
      self.styleRules();
   };

   this.switchTab = function() {
      $("#"+self.tabTag[self.selectedTab]).removeClass("selectedTab");
      self.selectedTab = 1 - self.selectedTab;
      $("#"+self.tabTag[self.selectedTab]).addClass("selectedTab");
      self.styleTabs();
      self.showTab();
   };

   this.showTab = function() {
      if(this.selectedTab == 1){
         $("#"+this.graphPaperID).hide();
         $("#"+this.parseTableID).show();
      }else{
         $("#"+this.graphPaperID).show();
         $("#"+this.parseTableID).hide();
      }
   };

   this.getStateID = function(state) {
      /* get vertex ID from label*/
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         var info = this.graph.getVertexInfo(vertex);
         if(info.label == state){
            return vertex;
         }
      }
   };

   /* REDUCE */

   this.reduce = function() {
      self.resetFeedback();
      if(self.selectedRule == null){
         self.displayMessage("reduce","You must select a rule");
         // self.displayMessage("reduce","REDUCE 0000654065406540");
      }else if(self.selectedStackElements.length == 0){
         self.displayMessage("reduce","You must select a part of the stack");
      }else if(self.selectedState == null){
         self.displayMessage("reduce","You must select a state in the automaton");
      }else if(!self.isContiguous()){
         self.displayError("Selected stack elements must be contiguous");
      }else if(!self.compareSelectedRuleAndStack()){
         self.displayError("You cannot reduce the selected stack elements with the selected rule");
      }else{
         var nonTerminal = self.grammar.rules[self.selectedRule].nonterminal;
         var previousState = self.getPreviousState();
         var goto = (nonTerminal != "S") ? self.lrTable.states[previousState][nonTerminal][0].actionValue : self.getTerminalState();
         if(self.selectedState != goto){
            self.displayError("Wrong goto state");
         }else{
            self.actionSequence.push({
               actionType: "r",
               rule: self.selectedRule,
               goto: goto
            });
            self.simulationStep++;
            self.applyReduction(nonTerminal,goto,true);
            self.saveAnswer();
         }
      }
   };

   this.isContiguous = function() {
      var elements = this.selectedStackElements;
      var length = elements.length;
      if(length == 0){
         return false;
      }else if(length > 1){
         elements.sort();
         for(var iEl = 0; iEl < length - 1; iEl++){
            if(parseInt(elements[iEl + 1]) != parseInt(elements[iEl]) + 1){
               return false;
            }
         }
      }
      return true;
   };

   this.compareSelectedRuleAndStack = function() {
      this.selectedStackElements.sort();
      var rule = this.grammar.rules[this.selectedRule];
      if(rule.development.length != this.selectedStackElements.length){
         return false;
      }else{
         for(var iEl = 0; iEl < rule.development.length; iEl++){
            if(rule.development[iEl] != this.stack[this.selectedStackElements[iEl]][1]){
               return false;
            }
         }
      }
      return true;
   };

   this.getTerminalState = function() {
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         var info = this.graph.getVertexInfo(vertex);
         if(info.terminal){
            return info.label;
         }
      }
      return false;
   };

   this.getPreviousState = function() {
      var previousCol = parseInt(this.selectedStackElements.sort()[0]) - 1;
      return this.stack[previousCol][0];
   };

   this.applyReduction = function(nonTerminal,goto,anim) {
      var newStackElement = [goto,nonTerminal];
      if(anim){
         this.displayMessage("reduce","REDUCE "+this.selectedRule);
         var prevStates = [this.getPreviousState()];
         for(var col of this.selectedStackElements){
            prevStates.push(this.stack[col][0]);
         }
         var state = prevStates.pop();
         var animTime = this.animationTime/prevStates.length;
         this.reductionAnimLoop(state,prevStates,animTime,newStackElement);
      }else{
         this.stack.splice(this.selectedStackElements[0],this.selectedStackElements.length,newStackElement);
         this.selectedStackElements = [];
         $(".rule").removeClass("selected");
         this.selectedRule = null;
         this.styleRules();
         this.updateStackTable();

         this.updateState(anim);
      }
   };

   this.reductionAnimLoop = function(state,prevStates,animTime,newStackElement) {
      var prevState = prevStates.pop();
      var selectedCol = self.selectedStackElements[prevStates.length];
      $(".stackElement[data_col="+selectedCol+"]").fadeOut(animTime);
      this.changeStateAnim(state,prevState,animTime,true,function(){
         self.displayMessage("reduce","REDUCE "+self.selectedRule);
         if(prevStates.length > 0){
            self.reductionAnimLoop(prevState,prevStates,animTime,newStackElement);
         }else{
            self.stack.splice(self.selectedStackElements[0],self.selectedStackElements.length,newStackElement);
            self.selectedStackElements = [];
            
            self.updateStackTable();
            $(".stackElement[data_col="+selectedCol+"]").hide();
            $(".stackElement[data_col="+selectedCol+"]").fadeIn(self.animationTime,function(){
               $(".rule").removeClass("selected");
               self.selectedRule = null;
               self.styleRules();
               self.updateState(true);
               self.displayMessage("reduce","GOTO "+newStackElement[0]);
            });
         }
      });
   };

   this.reverseReduction = function(rule) {
      var newStackElements = [];
      this.stack.pop();
      var nonTerminal = this.grammar.rules[rule].nonterminal;
      var development = this.grammar.rules[rule].development;
      var previousState = this.stack[this.stack.length - 1][0];
      for(var symbol of development){
         var state = this.lrTable.states[previousState][symbol][0].actionValue;
         this.stack.push([state,symbol]);
         previousState = state;
      }

      this.updateStackTable();

      this.styleStackTable();
      this.updateState(false);

   }

   /* SHIFT */

   this.shift = function() {
      self.resetFeedback();
      if(self.selectedState == null){
         var error = "You must select a state in the automaton";
         self.displayMessage("shift",error);
      }else{
         var edge = self.graph.getEdgesFrom(self.currentVertex,self.selectedVertex);
         if(edge.length == 0){
            self.displayError("This action is not allowed");
         }else{
            var edgeInfo = self.graph.getEdgeInfo(edge[0]);
            var action = self.lrTable.states[self.currentState][edgeInfo.label][0];
            if(!action){
               self.displayError("This action is not allowed");
            }else if(edgeInfo.label != self.input.charAt(self.inputIndex)){
               self.displayError("Invalid shift");
            }else{
               self.actionSequence.push({
                  actionType: "s",
                  state: self.selectedState
               });
               self.simulationStep++;
               self.applyShift(self.selectedState,false,true);
               self.saveAnswer();
            }
         }
      }
   };

   this.applyShift = function(newState,reverse,anim) {
      if(reverse){
         this.stack.pop();
         this.inputIndex--;
         newState = this.stack[this.stack.length - 1][0];
      }else{
         this.stack.push([newState,this.input[this.inputIndex]]);
         this.inputIndex++;
      }
      this.currentVertex = this.getStateID(newState);
      this.updateStackTable();
      this.updateCursor(!(reverse || !anim));
      this.updateState(!(reverse || !anim));
   };

   this.updateStackTable = function() {
      var html = "";
      for(var iData = 0; iData < this.stackData.length; iData++) {
         html += "<tr>";
         for(var iElement = 0; iElement < this.stack.length; iElement++){
            html += "<td class=\""+this.stackData[iData]+" stackElement"+((this.selectedStackElements.includes(""+iElement)) ? " selected" : "")+"\" data_col="+iElement+">"+this.stack[iElement][iData]+"</td>";
         }
         html += "<td>"+this.stackData[iData]+"</td>";
         html += "</tr>";
      }
      $("#stackTable").html(html);
      this.styleStackTable();
      if(this.mode != 1){
         $(".stackElement").off("click");
         $(".stackElement").click(self.selectStackElement);
      }
      this.currentState = this.stack[this.stack.length - 1][0];
      this.currentVertex = this.getStateID(this.currentState);
   };

   this.updateCursor = function(anim) {
      var newX = this.inputIndex * $(".inputChar").outerWidth();
      if(anim){
         $("#cursor").animate({left:newX+"px"},this.animationTime);
      }else{
         $("#cursor").css({left:newX+"px"});
      }
   };

   this.updateState = function(anim) {
      var id = this.getStateID(this.currentState);
      var stateVertex = this.visualGraph.getRaphaelsFromID(id);
      this.resetStates();
      if(!anim){
         stateVertex[0].attr(this.defaultCurrentStateAttr);
      }else{
         var previousState = this.stack[this.stack.length - 2][0];
         this.changeStateAnim(previousState,this.currentState,this.animationTime);
      }      
   };

   this.changeStateAnim = function(state1,state2,time,reduction,callback) {
      var id2 = this.getStateID(state2);
      var v2 = this.visualGraph.getRaphaelsFromID(id2);
      var id1 = this.getStateID(state1);
      var v1 = this.visualGraph.getRaphaelsFromID(id1);
      var vInfo1 = this.visualGraph.getVertexVisualInfo(id1);
      var vInfo2 = this.visualGraph.getVertexVisualInfo(id2);
      var edgeID = this.graph.getEdgesBetween(id1,id2)[0];
      var edgeVisualInfo = this.visualGraph.getEdgeVisualInfo(edgeID);
      var initPos = vInfo1;
      var finalPos = vInfo2;
      if(!edgeVisualInfo["radius-ratio"]){
         var alpha = this.visualGraph.graphDrawer.getAngleBetween(vInfo1.x,vInfo1.y,vInfo2.x,vInfo2.y);
         var info1 = this.graph.getVertexInfo(id1);
         var info2 = this.graph.getVertexInfo(id2);
         var content1 = (info1.content) ? info1.content : "";
         var content2 = (info2.content) ? info2.content : "";
         var boxSize1 = this.visualGraph.graphDrawer.getBoxSize(content1);
         var boxSize2 = this.visualGraph.graphDrawer.getBoxSize(content2);
         var pos1 = this.visualGraph.graphDrawer.getSurfacePointFromAngle(vInfo1.x,vInfo1.y,boxSize1.w,boxSize1.h,alpha + Math.PI);
         var pos2 = this.visualGraph.graphDrawer.getSurfacePointFromAngle(vInfo2.x,vInfo2.y,boxSize2.w,boxSize2.h,alpha);

         var step1 = {transform: "t"+(vInfo2.x - vInfo1.x)+","+(vInfo2.y - vInfo1.y)};
      }else{
         var param = this.visualGraph.graphDrawer.getEdgeParam(edgeID);
         var cPos = this.visualGraph.graphDrawer.getCenterPosition(param.R,param.s,param.l,param.pos1,param.pos2);
         var alpha = (param.l) ? (Math.asin(param.D/(2*param.R)) + Math.PI) : Math.asin(param.D/(2*param.R));
         var alpha = -2*alpha*180/Math.PI;
         if(this.graph.getEdgesFrom(id1,id2).length > 0 && this.graph.getEdgesFrom(id1,id2)[0] == edgeID){
            var pos1 = param.pos1;
            var pos2 = param.pos2;
            var angle = alpha;
         }else{
            var pos1 = param.pos2;
            var pos2 = param.pos1;
            var angle = -alpha;
         }
         var distance1 = Math.sqrt((pos1.x - initPos.x) * (pos1.x - initPos.x) + (pos1.y - initPos.y) * (pos1.y - initPos.y));
         var distance2 = Math.abs(param.R * alpha * Math.PI/180);
         var distance3 = Math.sqrt((finalPos.x - pos2.x) * (finalPos.x - pos2.x) + (finalPos.y - pos2.y) * (finalPos.y - pos2.y));
         var totalDistance = distance1 + distance2 + distance3;
         var time1 = time * distance1 / totalDistance;
         var time2 = time * distance2 / totalDistance;
         var time3 = time * distance3 / totalDistance;
         var step1 = {transform: "t"+(pos1.x - vInfo1.x)+","+(pos1.y - vInfo1.y)};
         var step2 = {transform: "r "+angle+","+(cPos.x)+","+(cPos.y)};
         var step3 = {transform: "t"+(vInfo2.x - pos2.x)+","+(vInfo2.y - pos2.y)};
      }
      v1[0].attr(this.defaultVertexAttr);
      if(this.token){
         this.token.remove();
      }
      this.token = this.paper.circle(initPos.x,initPos.y,10).attr({"fill":this.colors.blue,"stroke": "none"});
      if(!edgeVisualInfo["radius-ratio"]){
         var anim1 = new Raphael.animation(step1,time,function(){
            self.resetStates();
            if(!reduction){
               v2[0].attr(self.defaultCurrentStateAttr);
               self.token.remove();
            }
            self.displayMessage("reset");
            if(callback)
               callback();
         });
      }else{
         var anim1 = new Raphael.animation(step1,time1,function(){
            self.token.transform("");
            self.token.attr({cx:pos1.x,cy:pos1.y});
            subTask.raphaelFactory.animate("anim",self.token,anim2);
         });
         var anim2 = new Raphael.animation(step2,time2,function(){
            self.token.transform("");
            self.token.attr({cx:pos2.x,cy:pos2.y});
            subTask.raphaelFactory.animate("anim",self.token,anim3);
         });
         var anim3 = new Raphael.animation(step3,time3,function(){
            self.resetStates();
            if(!reduction){
               v2[0].attr(self.defaultCurrentStateAttr);
               self.token.remove();
            }
            self.displayMessage("reset");
            if(callback)
               callback();
         });
      }
      subTask.raphaelFactory.animate("anim",this.token,anim1);
   };

   this.resetStates = function() {
      var vertices = this.graph.getAllVertices();
      for(var vertexID of vertices){
         var info = this.graph.getVertexInfo(vertexID);
         var vertex = this.visualGraph.getRaphaelsFromID(vertexID);
         vertex[0].attr(this.vertexAttr);

         info.selected = false;
         this.graph.setVertexInfo(vertexID,info);
      }
      this.selectedState = null;
      if(this.graphEditor)
         this.graphEditor.vertexDragAndConnect.selectionParent = null;
   };

   /* ACCEPT / ERROR */

   this.acceptInput = function() {
      self.resetFeedback();
      self.accept = !self.accept;
      if(self.accept){
         $("#acceptButton").css({
            "background-color": self.colors.yellow
            // border: "1px solid "+self.colors.yellow
         });
         if(self.error){
            self.refuseInput();
         }
      }else{
         $("#acceptButton").css({
            "background-color": self.colors.blue
            // border: "none"
         });
      }
      self.saveAnswer();
   };

   this.refuseInput = function() {
      self.resetFeedback();
      self.error = !self.error;
      if(self.error){
         $("#errorButton").css({
            "background-color": self.colors.yellow
         });
         if(self.accept){
            self.acceptInput();
         }
      }else{
         $("#errorButton").css({
            "background-color": self.colors.blue
         });
      }
      self.saveAnswer();
   };

   this.onVertexSelect = function(ID,selected) {
      if(selected){
         self.selectedVertex = ID;
         self.selectedState = self.graph.getVertexInfo(ID).label;
      }else{
         self.selectedVertex = null;
         self.selectedState = null;
      }
      self.resetFeedback();
      if(ID == self.getStateID(self.currentState)){
         var stateVertex = self.visualGraph.getRaphaelsFromID(ID);
         stateVertex[0].attr(self.defaultCurrentStateAttr);
      }
   };

   this.saveAnswer = function() {
      answer.actionSequence = JSON.parse(JSON.stringify(this.actionSequence));
      answer.accept = this.accept;
      answer.error = this.error;
   };

   this.reloadAnswer = function() {
      this.actionSequence = JSON.parse(JSON.stringify(answer.actionSequence));
      this.replayUpTo(this.actionSequence.length,false);
      if(answer.accept){
         this.acceptInput();
      }else if(answer.error){
         this.refuseInput();
      }
   };

   this.validation = function() {
      if(!answer.accept && !answer.error){
         this.displayError("You must click on either the accept or the error button");
      }else{
         this.reset();
         this.actionSequence = [];
         this.initActionSequence();
         var lastAction = this.actionSequence[this.actionSequence.length - 1];
         var accept = false;
         if(lastAction.actionType == "r" && lastAction.goto == this.getTerminalState()){
            accept = true;
         }
         if(answer.actionSequence.length != this.actionSequence.length){
            this.displayError("Your parsing is incomplete");
         }else if(answer.accept && !accept){
            this.displayError("Wrong answer");
         }else if(answer.error && accept){
            this.displayError("Wrong answer");
         }else{
            return true;
         }
      }
      this.reset();
      this.actionSequence = JSON.parse(JSON.stringify(answer.actionSequence));
      this.replayUpTo(this.actionSequence.length,false);
   };

   this.displayMessage = function(type,message) {
      if(type == "reset"){
         $(".actionMessage").text("");
      }else{
         $("#"+type+"Message").text(message);
      }
   };

   this.displayError = function(msg) {
      $("#error").text(msg);
   };

   this.resetFeedback = function() {
      this.displayMessage("reset");
      this.displayError("");
   };

   this.style = function() {
      $("#"+this.divID).css({
         "font-size": "80%"
      })
      /* tabs */
      this.styleTabs();

      /* paper, parse table */
      $("#"+this.graphPaperID+", #"+this.parseTableID).css({
         margin: "1em auto",
         height: this.paperHeight+"px",
         width: this.paperWidth+"px"
      });

      $("#"+this.parseTableID+" table").css({
         "font-size": "1.2em"
      });

      /* parse info */
      $("#parseInfo").css({
         display: "flex",
         "justify-content": "center",
         "align-items": "flex-start"
      });
      $("#parseInfo > *").css({
         "box-sizing": "border-box"
      });

      /* rules */
      this.styleRules();

      /* action */
      $("#action").css({
         "margin-left": "15px",
         "flex-grow": "20"
      });
      $("#action h4").css({
         color: "grey",
         "font-weight": "normal",
         "margin-bottom": "0.5em",
      });

      /* player */
      $("#player").css({
         display: "flex",
         "align-items": "center",
         "justify-content": "space-between",
         // width: "100%",
         padding: "10px",
         "border-radius": "25px",
         "background-color": this.colors.lightgrey
      });
      $("#player > *").css({
         color: "white",
         "font-size": "1em",
         "border-radius": "2em",
         "text-align": "center",
         "box-sizing": "border-box"
      });
      $("#play").css({
         "background-color": this.colors.blue,
         padding: "10px 12px",
         "margin-right": "10px"
      });
      $("#stepBackward, #stepForward").css({
         "background-color": this.colors.black,
         padding: "10px 20px",
         "margin-left": "10px"
      });
      this.styleProgressBar();

      /* stack */
      this.styleStackTable();

      /* action button */
      $("#acceptButton, #errorButton").css({
         "border-radius": "1em"
      });
      $(".actionButton").css({
         "background-color": this.colors.blue,
         color: "white",
         width: "110px",
         padding: "0.5em 0",
         "text-align": "center",
         // float: "right",
         "font-weight": "bold",
         "font-size": "0.9em",
         // cursor: "pointer"
      });
      var buttonHeight = $(".actionButton").innerHeight();
      $("#reduceBar, #shiftBar, #acceptBar, #errorBar").css({
         // "text-align": "right",
         // height: buttonHeight+"px",
         display: "flex",
         "justify-content": "flex-end",
      });
      $("#acceptBar, #errorBar").css({
         "margin-top": "0.5em"
      });
      $(".actionMessage").css({
         // display: "inline-block",
         padding: "0.5em 1em",
         color: "grey",
         "background-color": "white",
         "border-radius": "0 5px 0 0",
         height: buttonHeight+"px",
         "box-sizing": "border-box"
      });
      $(".messageBackground").css({
         // display: "inline-block",
         "background-color": this.colors.blue,
         height: buttonHeight+"px"
      })
      $("#reduceButton, #shiftButton").css({
         "border-radius": "0 0 5px 5px"
      });
      $(".buttonIcon").css({
         "font-size": "0.9em",
         "margin-right": "0.2em"
      });
      $("#shiftButton .buttonIcon").css({
         // "font-size": "0.9em",
         "margin-right": "0.5em"
      });

      /* input */
      $("#inputBar").css({
         position: "relative",
         // height: "2em",
         "background-color": this.colors.lightgrey,
         "margin-top": "5px",
         "border-top": "1px solid grey",
         "border-bottom": "2px solid "+this.colors.blue
      });
      $("#inputBar h4").css({
         position: "absolute",
         top: "-3em"
      });
      $(".inputChar").css({
         display: "inline-block",
         width: "1.5em",
         // height: "1.5em",
         "text-align": "center",
         color: this.colors.black,
         "font-size": "1.5em",
         padding: "0.1em 0"
      });

      /* cursor */
      $("#cursor").css({
         position: "absolute",
         top: 0,
         left: 0,
         height: "2em"
      });
      $("#cursorBar").css({
         height: "2em",
         width: 0,
         border: "1px solid "+this.colors.blue,
         position: "absolute",
         top: 0,
         left: 0
      });
      $("#topCircle, #bottomCircle").css({
         width: "6px",
         height: "6px",
         "background-color": "white",
         border: "1px solid "+this.colors.blue,
         "border-radius": "5px",
         position: "absolute",
         left: "-3px",
         "z-index": 2
      });
      $("#topCircle").css({
         top: "-4px"
      });
      $("#bottomCircle").css({
         bottom: "-6px"
      });

      /* parse Table */
      $("#"+this.parseTableID+" table").css({
         margin: "auto",
         "border-collapse": "collapse",
         border: "2px solid "+this.colors.blue,
         "text-align": "center"
      });
      $("#"+this.parseTableID+" table th").css({
         "background-color": this.colors.blue,
         color: "white",
         padding: "0.5em 1em",
         border: "1px solid white"
      });
      $("#"+this.parseTableID+" table td").css({
         "background-color": this.colors.lightgrey,
         color: this.colors.black,
         padding: "0.5em 1em",
         border: "1px solid "+this.colors.blue
      });
   };

   this.styleTabs = function() {
      $("#"+this.tabsID).css({
         "text-align": "right",
         margin: "1em 0"
      });
      $("#"+this.tabsID+" > *").css({
         display: "inline-block",
         "vertical-align": "middle",
         "font-weight": "bold",
         color: this.colors.black,
         margin: "0 0.2em"
         // "text-align": "right"
      });
      $("#"+this.tabsID+" span").css(this.unselectedTabAttr);
      $("#"+this.tabsID+" span.selectedTab").css(this.selectedTabAttr);
      $("#switchContainer").css({
         width: "50px",
         height: "15px",
         "background-color": this.colors.lightgrey,
         "border-radius": "10px",
         "box-shadow": "inset 0 1px 0 0 rgba(0,0,0,0.2)",
         cursor: "pointer",
         position: "relative"
      });
      $("#switch").css({
         width: "25px",
         height: "15px",
         "background-color": this.colors.blue,
         "border-radius": "10px",
         position: "absolute",
         top: 0,
         left: this.selectedTab*25+"px"
         // "box-shadow": "inset 0 0 0 0 rgba(0,0,0,0.2)"
      });
   };

   this.styleRules = function() {
      $("#rules").css({
         "flex-grow": "1",
         "background-color": this.colors.lightgrey,
         "border-radius": "0 5px 5px 0",
         "overflow": "hidden",
         "font-weight": "bold"
      });
      $("#rules h3").css({
         "text-align": "center",
         padding: "1em",
         margin: 0,
         "background-color": this.colors.black,
         color: "white",
         "font-size": "1em"
      });
      $("#rules ul").css({
         "list-style": "none",
         padding: 0
      });
      $(".rule").css({
         // display: "flex",
         // "justify-content": "space-between",
         // "align-items": "center",
         padding: "0.2em 0.5em 0.2em 0",
         margin: "0.5em 1em",
         "background-color": "transparent",
         color: this.colors.black,
         "border-radius": "1em"
      });
      // $(".rule > *").css({
      //    "flex-grow": "1",
      //    "text-align": "center"
      // });
      // $(".development").css({
      //    "flex-grow": "2"
      // })
      $(".ruleIndex").css({
         "flex-grow": "0",
         "background-color": this.colors.black,
         "border-radius": "1em",
         color: "white",
         padding: "0.2em 0.5em",
         "margin-right": "0.5em"
      });
      $(".rule i").css({
         color: "grey",
         margin: "0 0.5em"
      });
      $(".rule.selected").css({
         "background-color": this.colors.blue,
         color: "white"
      });
      $(".rule.selected .ruleIndex").css({
         "border-radius": "1em 0 0 1em",
      });
      $(".rule.selected i").css({
         color: this.colors.yellow
      });
   };

   this.styleProgressBar = function() {
      $("#progressBarClickArea").css({
         "flex-grow": "1",
         height: "20px",
         margin: "0 10px",
         "padding-top": "8px"
      });
      $("#progressBarContainer").css({
         height: "4px",
         "background-color": "grey",
      });
      $("#progressBar").css({
         width: "0%",
         height: "100%",
         "background-color": this.colors.blue,
         position: "relative"
      });
      $("#progressBarMarker").css({
         width: "6px",
         height: "6px",
         "background-color": "white",
         border: "3px solid "+this.colors.blue,
         "border-radius": "15px",
         position: "absolute",
         right: "-6px",
         top: "-4px",
         "z-index": 2
      });
   };

   this.styleStackTable = function() {
      $("#stackTable").css({
         border: "2px solid "+this.colors.blue,
         "border-right": "none",
         "border-collapse": "collapse",
         "width": "100%"
      });
      $("#stackTable td").css({
         border: "1px solid grey",
         "background-color": this.colors.lightgrey,
         "text-align": "center",
         width: "2em",
         height: "2em"
      });
      $("#stackTable td:last-child").css({
         "border-right": "none",
         color: "grey",
         "text-align": "right",
         "font-style": "italic",
         "background-color": "white",
         width: "auto"
      });
      $("#stackTable .State").css({
         color: "grey"
      });
      $("#stackTable .Symbol").css({
         color: this.colors.blue
      });
      $("#stackTable .stackElement.selected").css({
         "background-color": this.colors.blue,
         color: "white"
      });
   };
   
   this.init();

};