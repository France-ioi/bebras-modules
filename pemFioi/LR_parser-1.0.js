function LR_Parser(settings,subTask,answer) {
   self = this;
   this.mode = settings.mode;
   /* 
   1: simulation
   2: execute existing automaton
   3: create automaton
   4: create parse table
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
   this.tabsContainerID = "tabsCont";
   this.sideTable = false;

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
   this.selectedTab = (this.mode != 4) ? 0 : 1;
   this.cursor;
   this.selectedVertex = null;
   this.selectedRule = null;
   this.selectedStackElements = [];

   this.inputHighlight = null;
   this.prevStateHighlight = null;
   this.pathHighlight = [];
   this.stackElementsHL = [];

   this.cellEditor = null;

   this.accept = false;
   this.error = false;

   var arrow = "🡒";
   var dot = "🞄";

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
     "r": 10,
     "fill": "#4a4a4a",
     "stroke": "white",
     "stroke-width": 1
   };
   this.defaultSelectedVertexAttr = {
      "stroke": this.colors.yellow,
     "stroke-width": 5,
   };
   this.defaultSelectedEdgeAttr = {
      "stroke": this.colors.yellow,
     "stroke-width": 6,
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
   this.previousStateAttr = {
      "stroke": "#cbddf3",
     "stroke-width": 5,
     "fill": "none",
     // opacity: "0.1"
   };
   this.selectedStackElementAttr = {

   };
   this.vertexAttr = settings.vertexAttr || this.defaultVertexAttr;
   this.edgeAttr = settings.edgeAttr || this.defaultEdgeAttr;
   this.vertexLabelAttr = settings.vertexLabelAttr || this.defaultVertexLabelAttr;
   this.vertexContentAttr = settings.vertexContentAttr || this.defaultVertexContentAttr;
   this.selectedVertexAttr = settings.selectedVertexAttr || this.defaultSelectedVertexAttr;
   this.selectedEdgeAttr = settings.selectedEdgeAttr || this.defaultSelectedEdgeAttr;

   this.init = function() {
      var html = "";
      html += "<div id=\""+this.tabsID+"\"></div>";
      html += "<div id=\""+this.tabsContainerID+"\">";
      html += "<div id=\""+this.graphPaperID+"\"></div>";
      html += "<div id=\""+this.parseTableID+"\"></div>";
      html += "</div>";
      html += "<div id=\""+this.parseInfoID+"\"></div>";

      $("#"+this.divID).html(html);
      this.initParser();
      this.initTabs();
      this.initAutomata();
      if(this.mode != 2){
         this.initActionSequence();
      }
      this.initParseTable();
      this.showTab();
      
      this.initParseInfo();

      this.style();
      this.updateState(false);
      this.initHandlers();
      // console.log(this.grammar);
      if(this.mode >= 3){
         this.onResize();
      }
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
      if(!this.paper){
         this.paper = subTask.raphaelFactory.create(this.graphPaperID,this.graphPaperID,this.paperWidth,this.paperHeight);
      }
      if(!this.graphDrawer){
         this.graphDrawer = new SimpleGraphDrawer(this.vertexAttr,this.edgeAttr,null,true);
         this.graphDrawer.setVertexLabelAttr(this.vertexLabelAttr);
         this.graphDrawer.setVertexContentAttr(this.vertexContentAttr);
      }
      if(this.visualGraph){
         this.visualGraph.remove();
      }
      this.visualGraph = VisualGraph.fromJSON(this.visualGraphJSON, "visualGraph", this.paper, null, this.graphDrawer, true);
      this.graph = this.visualGraph.graph;
      if(this.mode != 1 && this.mode != 4){
         this.graphMouse = new GraphMouse("graphMouse",this.graph,this.visualGraph);
         var graphEditorSettings = {
            paper: this.paper,
            graph: this.graph,
            paperElementID: this.graphPaperID,
            visualGraph: this.visualGraph,
            graphMouse: this.graphMouse,
            // alphabet: this.alphabet,
            selectedVertexAttr: this.selectedVertexAttr,
            selectedEdgeAttr: this.selectedEdgeAttr,
            enabled: true
         };
         if(this.mode == 2){
            graphEditorSettings.selectVertexCallback = this.onVertexSelect;
         }
         if(this.mode == 3){
            graphEditorSettings.dragThreshold = 10;
            graphEditorSettings.edgeThreshold = 20;
            graphEditorSettings.dragLimits = {
               minX: this.visualGraph.graphDrawer.circleAttr.r,
               maxX: this.paper.width - this.visualGraph.graphDrawer.circleAttr.r,
               minY: this.visualGraph.graphDrawer.circleAttr.r,
               maxY: this.paper.height - this.visualGraph.graphDrawer.circleAttr.r
            };
            graphEditorSettings.callback = this.graphEditorCallback;
            graphEditorSettings.selectVertexCallback = this.selectVertexCallback;
            graphEditorSettings.contentValidation = this.contentValidation;
            graphEditorSettings.onDragEnd = this.graphEditorCallback;
            graphEditorSettings.vertexLabelPrefix = "";
         }
         if(this.graphEditor){
            this.graphEditor.setEnabled(false);
            this.graphEditor = null;
         }
         this.graphEditor = new GraphEditor(graphEditorSettings);
         if(this.mode == 2){            
            this.graphEditor.setCreateVertexEnabled(false);
            this.graphEditor.setCreateEdgeEnabled(false);
            this.graphEditor.setVertexDragEnabled(false);
            this.graphEditor.setEdgeDragEnabled(false);
            this.graphEditor.setGraphDragEnabled(false);
            this.graphEditor.setScaleGraphEnabled(false);
            this.graphEditor.setEditVertexLabelEnabled(false);
            this.graphEditor.setEditVertexContentEnabled(false);
            this.graphEditor.setEditEdgeLabelEnabled(false);
            this.graphEditor.setTerminalEnabled(false);
            this.graphEditor.setInitialEnabled(false);
         }else if(this.mode == 3){
            this.paper.rect(1,1,this.paperWidth - 2, this.paperHeight - 2);
            this.graphEditor.setTableMode(true);
            this.graphEditor.setMultipleEdgesEnabled(false);
            this.graphEditor.setLoopEnabled(false);
            this.graphEditor.setInitialEnabled(false);
         }
         this.graphEditor.setIconAttr({fill:this.colors.yellow,stroke:"none"});
      }
      this.formatContent();
      this.visualGraph.redraw();
      if(this.graphEditor)
         this.graphEditor.updateHandlers();
   };

   this.initActionSequence = function() {
      if(this.actionSequence){
         this.actionSequence = [];
      }
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

         if(action && (!this.mode == 3 || this.doesAutomatonAllowAction(state,symbol,action))){
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
      var terminalStateIndex = this.lrTable.states.length;
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
      for(var iState = 0; iState <= this.lrTable.states.length; iState++){
         var state = this.lrTable.states[iState];
         var stateID = (state) ? state.index : terminalStateIndex;
         html += "<tr>";
         html += "<td>"+stateID+"</td>";
         for(var iCol = 0; iCol < (this.grammar.terminals.length + 1 + this.grammar.nonterminals.length); iCol++){
            html += (stateID == terminalStateIndex) ? "<td>" : "<td data_state=\""+stateID+"\" data_symbol=\""+colLabel[iCol]+"\">";
            if(this.mode != 4){
               if(state && state[colLabel[iCol]]){
                  html += state[colLabel[iCol]][0]["actionType"]+state[colLabel[iCol]][0]["actionValue"];
               }else if(colLabel[iCol] == "S" && stateID == 0){
                  html += terminalStateIndex;
               }
            }
            html += "</td>";
         }
         html += "</tr>";
      }
      // html += "<tr><td>"+terminalStateIndex+"</td></tr>";
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
      html += "<div id=\"stackTableContainer\">";  // to deal with stack highlight
      html += "<table id=\"stackTable\">";
      html += "</table>";
      html += "</div>";
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
      // var html = "<div id=\"acceptBar\">";
      // html += "<span id=\"acceptMessage\" class=\"actionMessage\"></span>"
      var html = "<div class=\"messageBackground\"><div id=\"acceptMessage\" class=\"actionMessage\"></div></div>";
      html += "<div id=\"acceptButton\" class=\"actionButton\"><i class=\"fas fa-thumbs-up buttonIcon\"></i> ACCEPT</div>"
      // html += "</div>";
      // $("#actionInfo").append(html);
      $("#shiftBar").append(html);
   };

   this.initErrorButton = function(){
      // var html = "<div id=\"errorBar\">";
      // html += "<span id=\"errorMessage\" class=\"actionMessage\"></span>"
      var html = "<div class=\"messageBackground\"><div id=\"errorMessage\" class=\"actionMessage\"></div></div>";
      html += "<div id=\"errorButton\" class=\"actionButton\"><i class=\"fas fa-times buttonIcon\"></i> ERROR</div>"
      // html += "</div>";
      // $("#actionInfo").append(html);
      $("#shiftBar").append(html);
   };

   this.initHandlers = function() {
      $("#"+this.tabsID+" #switchContainer").off("click");
      $("#"+this.tabsID+" #switchContainer").click(self.switchTab);
      switch(this.mode){
         case 2:
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
            break;
         case 3:
            this.initPlayerHandlers();
            // $(window).off("resize");
            $(window).resize(self.onResize);
            break;
         case 4:
            $("#"+this.parseTableID+" td[data_state]").off("click");
            $("#"+this.parseTableID+" td[data_state]").click(self.clickCell);
            $(window).resize(self.onResize);
            this.initPlayerHandlers();
            break;
         default:
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

   this.onResize = function() {
      /* switch between table displays */
      var width = $(window).width();
      var sideTable = true;
      if(width < 1180){
         sideTable = false
      }
      if(self.sideTable != sideTable){
         self.sideTable = sideTable;
         self.styleTabSwitch();
         self.styleTabs();
         if(self.sideTable){
            $("#"+self.graphPaperID).show();
            $("#"+self.parseTableID).show();
         }else{
            self.showTab();
         }
      }
   };

   this.reset = function() {
      this.stack = [["0", "#"]];
      this.inputIndex = 0;
      this.updateCursor(false);
      this.simulationStep = 0;
      this.selectedRule = null;
      $(".rule").removeClass("selected");
      this.selectedStackElements = [];
      this.updateStackTable();
      this.updateState(false);
      this.error = false;
      this.accept = false;

      this.styleRules();
      this.styleStackTable();
      this.styleProgressBar();
      $("#acceptButton, #errorButton").css({
         "background-color": this.colors.blue
      });

   };

   this.runSimulation = function() {
      self.clearHighlight();
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      $("#play i").removeClass("fa-play").addClass("fa-pause");
      $("#play").off("click");
      $("#play").click(self.pauseSimulation);
      self.resetFeedback();
      self.reset();
      self.runSimulationLoop(self.simulationStep,true,false,true);
      if(self.mode == 3){
         self.graphEditor.setEnabled(false);
      }
   };

   this.runSimulationLoop = function(step,loop,reverse,anim) {
      // console.log(step+" "+loop+" "+reverse+" "+anim)
      var progress = (reverse) ? 100*(step)/this.actionSequence.length : 100*(step + 1)/this.actionSequence.length;
      var action = this.actionSequence[step];
      this.disablePlayerSteps();
      this.disableProgressBarClick();
      // console.log(progress);
      if(progress <= 100){
         if(!anim || action.actionType == "error"){
            var animationTime = (step == 0 && this.actionSequence.length <= 1) ? 100 : 0;
            this.clearHighlight();
            // var animationTime = 0;
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
         // console.log("check")
         self.pauseSimulation(null,true);
         return;
      }
            
      switch(action.actionType){
         case "s":
            self.applyShift(action.state,reverse,anim);
            break;
         case "r":
            self.clearHighlight();
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
                  var goto = action.goto || self.getPreviousState();
                  self.applyReduction(nonTerminal,goto,true);
               }, self.animationTime);
            }else{
               var nonTerminal = self.grammar.rules[rule].nonterminal;
               var goto = action.goto;
               self.applyReduction(nonTerminal,goto,false);
            }
            break;
         case "error":
            self.refuseInput();
            break;
      }
   };

   this.pauseSimulation = function(ev,end) {
      // console.log("pause");
      if(!end){
         clearTimeout(self.timeOutID);
         subTask.raphaelFactory.stopAnimate("anim");
         $("#progressBar").stop();
         self.replayUpTo(self.simulationStep);
         if(self.token){
            self.token.remove();
         }
      }

      $("#play i").removeClass("fa-pause").addClass("fa-play");
      self.initPlayerHandlers();
      if(self.mode == 3){
         // console.log("enab");
         self.graphEditor.setEnabled(true);
         self.graphEditor.setMultipleEdgesEnabled(false);
         self.graphEditor.setLoopEnabled(false);
         self.graphEditor.setInitialEnabled(false);
      }
   };

   this.stepBackward = function() {
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      self.resetFeedback();
      if(self.simulationStep < 1){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep - 1, false, true);
      }
   };

   this.stepForward = function() {
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      self.resetFeedback();
      if(self.simulationStep >= self.actionSequence.length){
         return;
      }else{
         self.runSimulationLoop(self.simulationStep, false, false,true);
      }
   };

   this.progressBarClick = function(event) {
      self.clearHighlight();
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
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
      this.clearHighlight();
   };

   this.selectStackElement = function() {
      self.resetFeedback();
      var col = parseInt($(this).attr("data_col"));

      if($(".stackElement[data_col="+col+"]").hasClass("selected")){
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
      self.styleTabSwitch();
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
      return false;
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
      var initVertex = this.getStateID(0);
      if(initVertex){
         var children = this.graph.getChildren(initVertex);

         for(var child of children){
            var edges = this.graph.getEdgesFrom(initVertex,child);
            if(edges.length > 0){
               var edgeInfo = this.graph.getEdgeInfo(edges[0]);
               if(edgeInfo.label == this.grammar.rules[0].nonterminal){
                  var vertexInfo = this.graph.getVertexInfo(child);
                  if(vertexInfo.terminal){
                     return vertexInfo.label;
                  }
               }
            }
         }
      }
      return null;
   };

   this.getPreviousState = function() {
      var previousCol = parseInt(this.selectedStackElements.sort()[0]) - 1;
      if(this.stack[previousCol]){
         return this.stack[previousCol][0];
      }else{
         return null
      }
   };

   this.applyReduction = function(nonTerminal,goto,anim) {
      this.clearHighlight();
      var newStackElement = [goto,nonTerminal];
      if(anim){
         this.highlightPrevState(this.currentState);
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

      /* highlight */
      var stackElementHL = $("<div class=\"stackElementHL\" data_col=\""+selectedCol+"\"></div>");
      stackElementHL.css({
         position: "absolute",
         left: $(".stackElement[data_col="+selectedCol+"]").position().left,
         top: 0,
         width: $(".stackElement[data_col="+selectedCol+"]").outerWidth(),
         height: $("#stackTable").height(),
         "background-color": "rgb(0,10,20)",
         opacity: "0.1",
         border: "1px solid "+this.colors.black
      });
      this.stackElementsHL.push(stackElementHL);
      if(this.mode == 2){
         stackElementHL.off("click");
         stackElementHL.click(self.selectStackElement);
      }
      $("#stackTableContainer").append(stackElementHL);

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
               $(".rule[data_rule="+self.selectedRule+"]").addClass("previousRule");
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
      this.clearHighlight();
      if(reverse){
         this.stack.pop();
         this.inputIndex--;
         newState = this.stack[this.stack.length - 1][0];
      }else{
         this.stack.push([newState,this.input[this.inputIndex]]);
         this.inputIndex++;
      }
      this.currentVertex = this.getStateID(newState);
      if(!reverse){
         // this.highlightEdge(this.currentState,newState);
         this.highlightPrevState(this.currentState);
      }
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
      if(this.mode == 2){
         $(".stackElement").off("click");
         $(".stackElement").click(self.selectStackElement);
      }
      this.currentState = this.stack[this.stack.length - 1][0];
      this.currentVertex = this.getStateID(this.currentState);
   };

   this.updateCursor = function(anim) {
      var newX = this.inputIndex * $(".inputChar").outerWidth();
      if(anim){
         var xHL = $("#cursor").position().left;
         var wHL = newX - xHL
         this.inputHighlight = $("<div id=\"inputHL\"></div>");
         this.inputHighlight.css({
            position: "absolute",
            left: xHL,
            top: 0,
            height: "100%",
            width: wHL+"px",
            "background-color": "rgb(0,10,20)",
            opacity: "0.1"
         })
         $("#inputBar").append(this.inputHighlight);
         $("#cursor").animate({left:newX+"px"},this.animationTime);
      }else{
         $("#cursor").css({left:newX+"px"});
      }
   };

   this.highlightPrevState = function(previousState) {
      var vertex = this.getStateID(previousState);
      var raphObj = this.visualGraph.getRaphaelsFromID(vertex);
      var x = raphObj[0].attr("x");
      var y = raphObj[0].attr("y");
      var width = raphObj[0].attr("width");
      var height = raphObj[0].attr("height");
      var r = raphObj[0].attr("r");
      this.prevStateHighlight = this.paper.rect(x,y,width,height,r).attr(this.previousStateAttr)
   };

   this.highlightEdge = function(edgeID) {
      if(!edgeID){
         return;
      }
      var raphObj = this.visualGraph.getRaphaelsFromID(edgeID); 
      var edgeHL = raphObj[0].clone();
      edgeHL.attr({"stroke": this.colors.blue});
      edgeHL.toBack();
      raphObj[1].toBack();
      raphObj[0].toBack();
      this.pathHighlight.push(edgeHL);  
   };

   this.clearHighlight = function() {
      if(this.inputHighlight){
         this.inputHighlight.remove();
         this.inputHighlight = null;
      }
      if(this.prevStateHighlight){
         this.prevStateHighlight.remove();
         this.prevStateHighlight = null;
      }
      if(this.pathHighlight.length > 0){
         for(var path of this.pathHighlight){
            path.remove();
         }
         this.pathHighlight = [];
      }
      if(this.stackElementsHL.length > 0){
         for(var elem of this.stackElementsHL){
            elem.remove();
         }
         this.stackElementsHL = [];
      }
      $(".rule").removeClass("previousRule");
      this.styleRules();
   };

   this.updateState = function(anim) {
      var id = this.getStateID(this.currentState);
      if(!id){
         return;
      }
      var stateVertex = this.visualGraph.getRaphaelsFromID(id);
      this.resetStates();
      if(!anim){
         stateVertex[0].attr(this.defaultCurrentStateAttr);
      }else{
         var previousState = this.stack[this.stack.length - 2][0];
         this.changeStateAnim(previousState,this.currentState,this.animationTime);
      }
      if(this.currentState == this.getTerminalState()){
         if(!this.accept)
            this.acceptInput();
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
      this.highlightEdge(edgeID);
      if(state1 == state2){
         if(this.token){
            this.token.remove();
         }
         return
      }else if(!edgeVisualInfo["radius-ratio"]){
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
         vertex[0].attr({fill:this.vertexAttr.fill});
         // info.selected = false;
         this.graph.setVertexInfo(vertexID,info);
      }
      this.selectedState = null;
   };

   /* ACCEPT / ERROR */

   this.acceptInput = function() {
      self.resetFeedback();
      self.accept = !self.accept;
      if(self.accept){
         $("#acceptButton").css({
            "background-color": self.colors.yellow
         });
         $("#acceptMessage").parent().css({
            "background-color": self.colors.yellow
         });
         if(self.error){
            self.refuseInput();
         }
      }else{
         $("#acceptButton").css({
            "background-color": self.colors.blue
         });
         $("#acceptMessage").parent().css({
            "background-color": self.colors.blue
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
         $("#errorMessage").parent().css({
            "background-color": self.colors.yellow
         });
         if(self.accept){
            self.acceptInput();
         }
      }else{
         $("#errorButton").css({
            "background-color": self.colors.blue
         });
         $("#errorMessage").parent().css({
            "background-color": self.colors.blue
         });
      }
      self.saveAnswer();
   };

   this.doesAutomatonAllowAction = function(state,symbol,action){
      var v1 = this.getStateID(state);
      switch(action[0].actionType){
         case "s":
         case "":
            var v2 = this.getStateID(action[0].actionValue);
            if(v1 === false || v2 === false){
               return false
            }
            var edge = this.graph.getEdgesFrom(v1,v2);
            if(edge.length == 0){
               return false
            }
            var edgeLabel = this.graph.getEdgeInfo(edge).label;
            if(edgeLabel != symbol){
               return false
            }
            break;
         case "r":
            if(!this.contentAllowReduction(v1,action[0].actionValue)){
               return false;
            }
            break;
         default:
            return false;
      }
      return true;
   };

   this.contentAllowReduction = function(id,rule) {
      var content = this.readContent(id);
      if(content){
         var ruleArray = this.grammar.rules[rule];
         for(var line of content){
            var match = true;
            if(line.nonTerminal != ruleArray.nonterminal || line.development.length != ruleArray.development.length + 1){
               match = false;
            }else{
               for(var iChar in line.development){
                  if(iChar == (line.development.length - 1) && line.development[iChar] != dot){
                     match = false;
                  }else if(iChar < (line.development.length - 1) && line.development[iChar] != ruleArray.development[iChar]){
                     match = false;
                  }
               }
            }
            if(match == true){
               return true
            }
         }
      }
      return false
   };

   this.readContent = function(id) {
      /* return the vertex content as an array of objects {nonTerminal,[development]}*/
      var contentObj = [];
      var info = this.graph.getVertexInfo(id);
      if(!info.content){
         return false;
      }
      var lines = info.content.split('\n');
      for(var line of lines){
         var rule = line.split(arrow);
         if(rule.length <= 1){
            return false
         }
         var nonTerminal = rule[0];
         var development = rule[1].trim();
         contentObj.push({
            nonTerminal: nonTerminal.trim(),
            development: development.split(' ')
         });
      }
      // console.log(contentObj);
      return contentObj;
   };

   this.readLine = function(line) {
      /* return the rule and dot index */
      var ruleIndex = null;
      var developmentStr = line.development.join("");
      var dotIndex = developmentStr.indexOf(dot);
      var lastDotIndex = developmentStr.lastIndexOf(dot);
      if(lastDotIndex != dotIndex){
         dotIndex = null;
      }
      var developmentNoDot = line.development.filter(x => x != dot);
      for(var rule of this.grammar.rules){
         if(rule.nonterminal == line.nonTerminal && Beav.Object.eq(developmentNoDot,rule.development)){
            ruleIndex = rule.index;
         }
      }
      // console.log(ruleIndex+" "+dotIndex);
      return {ruleIndex: ruleIndex, dotIndex: dotIndex};
   };

   this.graphEditorCallback = function() {
      // console.log("callback");
      self.pauseSimulation(null,true);
      self.resetFeedback();
      self.actionSequence = [];
      self.reset();

      self.formatContent();
      self.initActionSequence();
      self.saveAnswer();
   };

   this.selectVertexCallback = function(id,selected) {
      var current = self.getStateID(self.currentState);
      if(!selected && id == current){
         var raph = self.visualGraph.getRaphaelsFromID(id);
         raph[0].attr(self.defaultCurrentStateAttr);
      }
   }

   this.onVertexSelect = function(ID,selected) {
      // console.log("onVertexSelect")
      if(selected){
         self.selectedVertex = ID;
         self.selectedState = self.graph.getVertexInfo(ID).label;
      }else{
         self.selectedVertex = null;
         self.selectedState = null;
      }
      // console.log(self.selectedState);
      self.resetFeedback();
      if(ID == self.getStateID(self.currentState)){
         var stateVertex = self.visualGraph.getRaphaelsFromID(ID);
         stateVertex[0].attr(self.defaultCurrentStateAttr);
      }
   };

   this.formatContent = function() {
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         var info = this.graph.getVertexInfo(vertex);
         if(info.content){
            info.content = info.content.replace(/->/g,arrow);
            info.content = info.content.replace(/\./g,dot);
            info.content = info.content.replace(/ /g,"");
            var lines = info.content.split('\n');
            var formatedContent = "";
            for(var iLine in lines){
               var line = lines[iLine];
               var formatedLine = "";
               for(var iChar = 0; iChar < line.length; iChar++){
                  var char = fixedCharAt(line,iChar);
                  if(iChar != line.length - 1 && char != " "){
                     if(char == "S" && fixedCharAt(line,iChar + 1) == "'"){
                        formatedLine += char;
                     }else{
                        formatedLine += char+" ";
                     }
                  }else if(char != " "){
                     formatedLine += char;
                  }
               }
               formatedContent += formatedLine.trim();
               if(iLine != lines.length - 1){
                  formatedContent += "\n";
               }
            }
            info.content = formatedContent;
            var raphObj = this.visualGraph.getRaphaelsFromID(vertex);
            raphObj[3].attr({"text":info.content});
            // this.graphEditor.resizeTableVertex(vertex,info.content);
         }
      }
   };

   this.contentValidation = function(content) {
      if(content){
         var lines = content.split('\n');
         for(var line of lines){
            var nDots = 0;
            for(var iChar = 0; iChar < line.length; iChar++){
               var char = fixedCharAt(line,iChar);
               if(!self.isCharValid(char)){
                  if(!((iChar > 0 && self.isPairValid(line.charAt(iChar - 1)+char)) || (iChar < line.length - 1 && self.isPairValid(char+line.charAt(iChar + 1))))){
                     self.displayError(char+" is not a valid symbol for this grammar");
                     // displayHelper.showPopupMessage(char+" is not a valid symbol for this grammar","blanket");
                     return false;
                  }
               }
               if(char == "." || char == dot){
                  nDots++;
               }
               if(nDots > 1){
                  self.displayError("There shouldn't be more than one dot in a single line");
                  // displayHelper.showPopupMessage("There shouldn't be more than one dot in a single line","blanket");
                  return false;
               }
            }
         }
      }
      return true
   };

   function fixedCharAt(str, idx) {
      var ret = '';
      str += '';
      var end = str.length;

      var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      while ((surrogatePairs.exec(str)) != null) {
         var li = surrogatePairs.lastIndex;
         if (li - 2 < idx) {
            idx++;
         } else {
            break;
         }
      }

      if (idx >= end || idx < 0) {
         return '';
      }

      ret += str.charAt(idx);

      if (/[\uD800-\uDBFF]/.test(ret) && /[\uDC00-\uDFFF]/.test(str.charAt(idx+1))) {
         // On avance d'un puisque l'un des caractères fait partie de la paire
         ret += str.charAt(idx+1); 
      }
      return ret;
   }

   this.isCharValid = function(char) {
      if(this.grammar.alphabet.includes(char) || char == "." || char == dot || char == arrow || char == " " || char == "$" || char == ""){
         return true
      }else{
         return false
      }
   };

   this.isPairValid = function(pair) {
      if(pair == "S'" || pair == "->"){
         return true
      }
      return false
   };

   /* parse table edit */

   this.clickCell = function() {
      self.resetFeedback();
      var cell = $(this);
      var state = $(this).attr("data_state");
      var symbol = $(this).attr("data_symbol");
      var cellContent = $(this).text();
      var maxlength = (self.lrTable.states.length >= 10) ? 3 : 2;
      // console.log(state+" "+symbol);
      $(this).off("click");
      if(self.cellEditor){
         self.cellEditor.remove();
      }
      self.cellEditor = $("<input id=\"cellEditor\" value=\""+cellContent+"\" maxlength=\""+maxlength+"\">");
      $(this).html(self.cellEditor);
      self.styleCellEditor(state,symbol);
      self.cellEditor.focus();
      self.cellEditor.focusout(function(ev){
         var text = $(this).val();
         self.writeCell(text,cell);
      });
      self.cellEditor.keyup(function(ev){
         var text = $(this).val();
         if(ev.which == 13){
            self.writeCell(text,cell);
         }
         // console.log(text);
      });
   };

   this.writeCell = function(text,cell) {
      self.cellEditor.remove();
      cell.text(text);
      cell.click(self.clickCell);
      var state = cell.attr("data_state");
      var symbol = cell.attr("data_symbol");
      if(!answer[state])
         answer[state] = {};
      answer[state][symbol] = text;
      // console.log(answer);
   };

   this.checkParseTable = function() {
      // console.log(self.lrTable.states)
      for(var state of self.lrTable.states){
         if(!answer[state.index]){
            self.displayError("Line "+state.index+" is empty");
            return false;
         }
         for(var symbol in answer[state.index]){
            if(answer[state.index][symbol] != ""){
               if(symbol != "S" && !state[symbol]){
                  self.displayError("Error in line "+state.index+" at column "+symbol);
                  return false;
               }
               if(symbol == "S" && (state.index != 0 || answer[state.index][symbol] != self.lrTable.states.length)){
                  self.displayError("Error in line "+state.index+" at column "+symbol);
                  return false;
               }
            }
         }
         for(var symbol in state){
            if(symbol != "index"){
               if(!answer[state.index][symbol]){
                  self.displayError("An entry is missing in line "+state.index);
                  return false;
               }
               var expected = state[symbol][0].actionType+state[symbol][0].actionValue;
               if(answer[state.index][symbol] != expected){
                  self.displayError("Error in line "+state.index+" at column "+symbol);
                  return false;
               }
            }
         }
         if(!answer[0]["S"]){
            self.displayError("Error in line 0 at column S");
            return false;
         }
      }
      return true;
   }

   this.saveAnswer = function() {
      if(self.mode == 2){
         answer.actionSequence = JSON.parse(JSON.stringify(self.actionSequence));
         answer.accept = self.accept;
         answer.error = self.error;
      }else if(self.mode == 3){
         answer.visualGraphJSON = self.visualGraph.toJSON();
      }
   };

   this.reloadAnswer = function() {
      switch(this.mode){
         case 2:
            this.actionSequence = JSON.parse(JSON.stringify(answer.actionSequence));
            this.replayUpTo(this.actionSequence.length,false);
            if(answer.accept){
               this.acceptInput();
            }else if(answer.error){
               this.refuseInput();
            }
            break;
         case 3:
            this.visualGraphJSON = answer.visualGraphJSON;
            this.initAutomata();
            this.updateState();
            break;
         case 4:
            for(var state in answer){
               if(answer[state]){
                  for(var symbol in answer[state]){
                     $("#"+this.parseTableID+" table td[data_symbol=\""+symbol+"\"][data_state=\""+state+"\"]").text(answer[state][symbol])
                  }
               }
            }
      }
   };

   this.validation = function() {
      switch(this.mode){
         case 2:
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
            break;
         case 3:
            // console.log(this.lrClosureTable.kernels);
            var lrClosureTable = this.lrClosureTable.kernels;
            var vertices = this.graph.getAllVertices();
            var terminalState = this.getTerminalState();
            if(vertices.length != lrClosureTable.length + 1){
               this.displayError("The number of states in your automaton is incorrect")
            }else if(!terminalState){
               this.displayError("Wrong terminal state")
            }else{
               var success = true;
               for(var state of lrClosureTable){
                  var stateVertex = this.getStateID(state.index);
                  if(!stateVertex){
                     this.displayError("State "+state.index+" is missing");
                     return
                  }
                  var nGoto = state.keys.length;
                  var children = this.graph.getChildren(stateVertex);
                  if((state.index == 0 && children.length != nGoto + 1) || (state.index != 0 && children.length != nGoto)){
                     this.displayError("The number of transitions from state "+state.index+" is incorrect");
                     return
                  }
                  for(var child of children){
                     var edges = this.graph.getEdgesFrom(stateVertex,child);
                     var edgeInfo = this.graph.getEdgeInfo(edges[0]);
                     var childInfo = this.graph.getVertexInfo(child);
                     if(state.gotos[edgeInfo.label] != childInfo.label && !(state.index == 0 && terminalState == childInfo.label)){
                        this.displayError("Wrong transition from state "+state.index+" to state "+childInfo.label);
                        return
                     }
                  }
                  var content = this.readContent(stateVertex);
                  if((state.index != 0 && content.length != state.closure.length) || (state.index == 0 && (content.length > state.closure.length + 1 || content.length < state.closure.length))){
                     this.displayError("The number of lines in state "+state.index+" is incorrect");
                     return
                  }
                  for(var item of state.closure){
                     var rule = item.rule.index;
                     var dotIndex = item.dotIndex;
                     var itemFound = false;
                     for(var line of content){
                        var lineInfo = this.readLine(line);
                        if(lineInfo.ruleIndex == rule && lineInfo.dotIndex == dotIndex){
                           itemFound = true;
                           break;
                        }
                     }
                     if(!itemFound){
                        this.displayError("Error in the content of state "+state.index);
                        return
                     }
                  }
               }
               return success;
            }
         case 4:
            var success = this.checkParseTable();
            return success
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
      $("#"+this.divID).css({
         "font-size": "80%"
      })
      /* tab switch */
      this.styleTabSwitch();

      /* paper, parse table */
      this.styleTabs();

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
         "font-weight": "bold",
         "font-size": "0.9em"
      });
      var buttonHeight = $(".actionButton").innerHeight();
      $("#reduceBar, #shiftBar").css({
         display: "flex",
         "justify-content": "flex-end",
      });
      // $("#acceptBar, #errorBar").css({
      //    "margin-top": "0.5em"
      // });
      $(".actionMessage").css({
         padding: "0.5em 1em",
         color: "grey",
         "background-color": "white",
         "border-radius": "0 5px 0 0",
         height: buttonHeight+"px",
         "box-sizing": "border-box"
      });
      $(".messageBackground").css({
         "background-color": this.colors.blue,
         height: buttonHeight+"px"
      })
      $("#reduceButton, #shiftButton, #acceptButton, #errorButton").css({
         "border-radius": "0 0 5px 5px"
      });
      // $("#acceptButton, #errorButton").css({
      //    "margin-left": "1em"
      // });
      $(".buttonIcon").css({
         "font-size": "0.9em",
         "margin-right": "0.2em"
      });
      $("#shiftButton .buttonIcon").css({
         "margin-right": "0.5em"
      });

      /* input */
      $("#inputBar").css({
         position: "relative",
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
   };

   this.styleTabSwitch = function() {
      if(this.sideTable){
         $("#"+this.tabsID).hide();
         return
      }else{
         $("#"+this.tabsID).show();
      }
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
      });
   };

   this.styleTabs = function() {
      if(!this.sideTable){
         $("#"+this.graphPaperID).css({
            width: this.paperWidth
         });
         $("#"+this.graphPaperID+", #"+this.parseTableID).css({
            margin: "1em auto",
            height: this.paperHeight
         });
      }else{
         $("#"+this.tabsContainerID).css({
            display: "flex",
            "flex-direction": "row",
            "justify-content": "space-around",
            margin: "1em 0",
         });
      }
      this.styleParseTable();
   };

   this.styleParseTable = function() {
      if(!this.sideTable){
         $("#"+this.parseTableID+" table").css({
            "font-size": "1.2em"
         });
         $("#"+this.parseTableID+" table").css({
            margin: "auto"
         });
         $("#"+this.parseTableID+" table th, #"+this.parseTableID+" table td").css({
            padding: "0.4em 0.8em"
         });
      }else{
         $("#"+this.parseTableID+" table th, #"+this.parseTableID+" table td").css({
            padding: "0.2em 0.4em"
         });
         if(this.mode == 4){
            $("#"+this.parseTableID+" table td[data_symbol]").css({
               width: "1.5em"
            });
         }
      }

      $("#"+this.parseTableID+" table").css({
         "border-collapse": "collapse",
         border: "2px solid "+this.colors.blue,
         "text-align": "center"
      });
      $("#"+this.parseTableID+" table th").css({
         "background-color": this.colors.blue,
         color: "white",
         border: "1px solid white"
      });
      $("#"+this.parseTableID+" table td").css({
         "background-color": this.colors.lightgrey,
         color: this.colors.black,
         border: "1px solid "+this.colors.blue
      });
   };

   this.styleRules = function() {
      $("#rules").css({
         "flex-grow": "1",
         "flex-shrink": "0",
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

         padding: "0.2em 0.5em 0.2em 0",
         margin: "0.5em 1em",
         "background-color": "transparent",
         color: this.colors.black,
         "border-radius": "1em"
      });
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
      $(".rule.previousRule").css({
         "background-color": "#d9e3ef"
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
      $("#stackTableContainer").css({
         position: "relative"
      });
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

   this.styleCellEditor = function(state,symbol) {
      $("#"+this.parseTableID+" table td[data_symbol=\""+symbol+"\"][data_state=\""+state+"\"]").css({
         padding: 0
      })
      $("#cellEditor").css({
         width: "1.5em",
         // height: "100%"
      });
   };
   
   this.init();

};