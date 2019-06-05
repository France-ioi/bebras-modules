function LR_Parser(settings,subTask) {
   self = this;
   this.mode = settings.mode;
   /* 
   1: simulation
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
   // this.timeOutShift;
   // this.timeOutSelect;
   // this.timeOutRed;
   this.timeOutID;
   this.animationTime = 1000;

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
      // color: this.colors.black,
      opacity: 1
      // "border-bottom": "3px solid black",
      // cursor: "auto"
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
      if(this.mode == 1){
         this.initAutomata();
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
         if(this.mode == 2){
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
         }
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
                     char: symbol
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
      html += "<div id=\"progressBarContainer\">";
      html += "<div id=\"progressBar\"><div id=\"progressBarMarker\"></div></div>"
      html += "</div>";
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
      html += "<span class=\"messageBackground\"><span id=\"reduceMessage\" class=\"actionMessage\"></span></span>"
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
      html += "<span class=\"messageBackground\"><span id=\"shiftMessage\" class=\"actionMessage\"></span></span>"
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

   this.runSimulation = function() {
      self.stack = [["0", "#"]];
      self.inputIndex = 0;
      self.updateCursor(false);
      self.simulationStep = 0;
      self.selectedRule = null;
      $(".rule").removeClass("selected");
      self.selectedStackElements = [];
      self.styleRules();
      self.styleStackTable();
      self.styleProgressBar();

      self.runSimulationLoop(self.simulationStep,true,false);
      
      $("#play i").removeClass("fa-play").addClass("fa-pause");
      $("#play").off("click");
      $("#play").click(self.pauseSimulation);
      
   };

   this.runSimulationLoop = function(step,loop,reverse) {
      
      var progress = (reverse) ? 100*(step)/this.actionSequence.length : 100*(step + 1)/this.actionSequence.length;
      var action = this.actionSequence[step];
      this.disablePlayerSteps();
      // console.log(step+" "+action.actionType);
      if(progress > 100){
         self.pauseSimulation();
      }else{
         if(reverse){
            var animationTime = 10;
         }else{
            var animationTime = (action.actionType == "r") ? 2*this.animationTime : this.animationTime;
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
               return;
            }
            self.runSimulationLoop(self.simulationStep,loop,reverse);
         });
      }
      if(!action){
         return;
      }
            
      switch(action.actionType){
         case "s":
            self.applyShift(action.state,reverse);
            break;
         case "r":
            var rule = action.rule;
            if(reverse){
               // var nonTerminal = self.grammar.rules[rule].nonterminal;
               // var development = self.grammar.rules[rule].development;
               this.reverseReduction(rule);
               // this.timouOutID = setTimeout(function() {
               //    self.selectedStackElements = [];
               //    $(".rule").removeClass("selected");
               //    self.selectedRule = null;
               //    self.styleRules();
               //    self.updateStackTable();
               // }, self.animationTime);
               return;
            }
            
            var nbRedChar = self.grammar.rules[rule].development.length;
            var startIndex = self.stack.length - nbRedChar;
            // if(self.selectedRule == null){
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
            // }else{
               // if(reverse){
                  // $(".stackElement").removeClass("selected");
                  // self.selectedStackElements = [];
                  // $(".rule").removeClass("selected");
               // }else{
               this.timouOutID = setTimeout(function() {
                  var nonTerminal = self.grammar.rules[rule].nonterminal;
                  var goto = action.goto;
                  self.applyReduction(nonTerminal,goto);
               }, self.animationTime);
                  
               // }
               
            }
      // }

   };

   this.pauseSimulation = function() {
      console.log("pause");
      // clearTimeout(self.timeOutID);
      // subTask.raphaelFactory.stopAnimate("anim");
      $("#progressBar").stop();
      $("#play i").removeClass("fa-pause").addClass("fa-play");
      self.initPlayerHandlers();
   };

   this.stepBackward = function() {
      // self.pauseSimulation();
      // console.log(self.simulationStep);
      if(self.simulationStep < 1){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep - 1, false, true);
      }
   };

   this.stepForward = function() {
      // self.pauseSimulation();
      if(self.simulationStep >= self.actionSequence.length){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep, false, false);
      }
   };

   this.selectStackElement = function() {
      self.resetFeedback();
      var col = $(this).attr("data_col");
      if($(this).hasClass("selected")){
         $(".stackElement[data_col="+col+"]").removeClass("selected");
         self.selectedStackElements = self.selectedStackElements.filter(element => element != col);
      }else{
         $(".stackElement[data_col="+col+"]").addClass("selected");
         self.selectedStackElements.push(col);
      }
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
            self.applyReduction(nonTerminal,goto);
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

   this.applyReduction = function(nonTerminal,goto) {
      var newStackElement = [goto,nonTerminal];
      this.stack.splice(this.selectedStackElements[0],this.selectedStackElements.length,newStackElement);
      this.selectedStackElements = [];
      $(".rule").removeClass("selected");
      this.selectedRule = null;
      this.styleRules();
      this.updateStackTable();
      this.updateState(true);
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
         // this.selectedStackElements.push(String(this.stack.length - 1));
         previousState = state;
      }
      // this.selectedRule = rule;
      this.updateStackTable();
      // $(".rule").removeClass("selected");
      // $(".rule[data_rule="+rule+"]").addClass("selected");
      // this.styleRules();
      this.styleStackTable();
      this.updateState(false);
      // self.selectedStackElements = [];
      // $(".rule").removeClass("selected");
      // self.selectedRule = null;
      // self.styleRules();
      // self.updateStackTable();
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
               self.applyShift(self.selectedState);
            }
         }
      }
   };

   this.applyShift = function(newState,reverse) {
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
      this.updateCursor(!reverse);
      this.updateState(!reverse);
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
      // console.log(this.currentState);
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
         var prevID = this.getStateID(previousState);
         var previousStateVertex = this.visualGraph.getRaphaelsFromID(prevID);
         var previousStateVisualInfo = this.visualGraph.getVertexVisualInfo(prevID);
         var vInfo = this.visualGraph.getVertexVisualInfo(id);
         var edgeID = this.graph.getEdgesBetween(prevID,id)[0];
         var edgeVisualInfo = this.visualGraph.getEdgeVisualInfo(edgeID);
         if(!edgeVisualInfo["radius-ratio"]){
            var alpha = this.visualGraph.graphDrawer.getAngleBetween(previousStateVisualInfo.x,previousStateVisualInfo.y,vInfo.x,vInfo.y);
            var info1 = this.graph.getVertexInfo(prevID);
            var info2 = this.graph.getVertexInfo(id);
            var content1 = (info1.content) ? info1.content : "";
            var content2 = (info2.content) ? info2.content : "";
            var boxSize1 = this.visualGraph.graphDrawer.getBoxSize(content1);
            var boxSize2 = this.visualGraph.graphDrawer.getBoxSize(content2);
            var pos1 = this.visualGraph.graphDrawer.getSurfacePointFromAngle(previousStateVisualInfo.x,previousStateVisualInfo.y,boxSize1.w,boxSize1.h,alpha + Math.PI);
            var pos2 = this.visualGraph.graphDrawer.getSurfacePointFromAngle(vInfo.x,vInfo.y,boxSize2.w,boxSize2.h,alpha);

            var pos = {x:pos1.x,y:pos1.y};
            var newPos = {cx:pos2.x,cy:pos2.y};
         }else{
            var param = this.visualGraph.graphDrawer.getEdgeParam(edgeID);
            var cPos = this.visualGraph.graphDrawer.getCenterPosition(param.R,param.s,param.l,param.pos1,param.pos2);
            var alpha = (param.l) ? (Math.asin(param.D/(2*param.R)) + Math.PI) : Math.asin(param.D/(2*param.R));
            var alpha = -2*alpha*180/Math.PI;

            var pos = param.pos1;
            var newPos = {transform:"r "+alpha+","+cPos.x+","+cPos.y};
         }
         previousStateVertex[0].attr(this.defaultCurrentStateAttr);
         var ball = this.paper.circle(pos.x,pos.y,10).attr({"fill":this.colors.blue,"stroke": "none"});
         var anim = new Raphael.animation(newPos,this.animationTime,function(){
            self.resetStates();
            stateVertex[0].attr(self.defaultCurrentStateAttr);
            ball.remove();
         });
         subTask.raphaelFactory.animate("anim",ball,anim);
      }      
   };

   this.resetStates = function() {
      var vertices = this.graph.getAllVertices();
      for(var vertexID of vertices){
         var info = this.graph.getVertexInfo(vertexID);
         var vertex = this.visualGraph.getRaphaelsFromID(vertexID);
         vertex[0].attr(this.vertexAttr);
         if(info.selected){
            vertex[0].attr(this.selectedVertexAttr);
         }
      }
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
      $("body").css({
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

      /* parse info */
      $("#parseInfo").css({
         display: "flex",
         "justify-content": "center",
         "align-items": "flex-start"
      });
      $("#parseInfo > *").css({
         // display: "inline-block",
         // "vertical-align": "top",
         "box-sizing": "border-box"
      });

      /* rules */
      this.styleRules();

      // var rulesWidth = $("#rules").outerWidth();
      // var totalWidth = $("#parseInfo").width();

      /* action */
      // $("#action").width(totalWidth - rulesWidth - 20);
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
         width: "100%",
         padding: "10px",
         "border-radius": "25px",
         "background-color": this.colors.lightgrey
      });
      $("#player > *").css({
         display: "inline-block",
         "vertical-align": "middle",
         color: "white",
         // "font-size": "15px",
         // "border-radius": "20px",
         "font-size": "1em",
         "border-radius": "2em",
         "text-align": "center",
         "box-sizing": "border-box"
      });
      $("#play").css({
         "background-color": this.colors.blue,
         padding: "10px 12px",
         "margin-right": "10px",
         // cursor: "pointer"
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
         float: "right",
         "font-weight": "bold",
         "font-size": "0.9em",
         // cursor: "pointer"
      });
      var buttonHeight = $(".actionButton").outerHeight();
      $("#reduceBar, #shiftBar, #acceptBar, #errorBar").css({
         "text-align": "right",
         height: buttonHeight+"px"
      });
      $("#acceptBar, #errorBar").css({
         "margin-top": "0.5em"
      });
      $(".actionMessage").css({
         display: "inline-block",
         padding: "0.5em 1em",
         color: "grey",
         "background-color": "white",
         "border-radius": "0 5px 0 0",
         height: buttonHeight+"px"
      });
      $(".messageBackground").css({
         display: "inline-block",
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
      // var playerWidth = $("#player").innerWidth();
      // var playWidth = $("#play").outerWidth();
      // var stepBackWidth = $("#stepBackward").outerWidth();
      // var progressBarContWidth = playerWidth - playWidth - 2* stepBackWidth - 75;
      $("#progressBarContainer").css({
         "flex-grow": "1",
         // width: progressBarContWidth+"px",
         height: "4px",
         "background-color": "grey",
         margin: "0 10px"
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