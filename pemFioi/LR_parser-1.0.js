function LR_Parser(settings,subTask,answer) {
   self = this;
   this.mode = settings.mode;
   /* 
   1: simulation
   2: execute existing automaton
   3: create automaton
   4: create parse table
   5: execute existing automaton with parse table
   6: derivation tree bottom up
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
   
   this.derivationTree = [];
   this.treeHeight = 0;
   this.treePaper;
   this.treeElements = {};
   this.treeCharSize = 20 // mode > 6
   this.treeClickableElements = {};
   this.treeSelectionMarker = null;
   this.inputBaseline = []; // mode = 7

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
   this.rowHL = null;
   this.colHL = null;

   this.paper;
   this.paperHeight = settings.paperHeight;
   this.paperWidth = settings.paperWidth;
   this.visualGraphJSON = settings.visualGraphJSON;

   this.graphDrawer;
   this.visualGraph;
   this.graph;
   this.graphMouse;
   this.graphEditor;
   this.isLastActionAGraphEdit = false;
   this.isDragging = false;
   this.isAnimationRunning = false;
   this.waitingForGoto = false; // used only in mode 5

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
   this.cellAttr = {
      "background-color": this.colors.lightgrey,
      color: this.colors.black,
      border: "1px solid "+this.colors.black
   };
   // this.selectedCellAttr = {
   //    "background-color": this.colors.blue,
   //    color: "white",
   //    border: "1px solid "+this.colors.lightgrey
   // };
   this.cellHighlightAttr = {
      position: "absolute",
      border: "4px solid "+this.colors.blue,
      "pointer-events": "none"
   };
   this.treeLineAttr = {
      stroke: this.colors.yellow,
      "stroke-width": 2
   };
   this.treeCharAttr = {
      "font-size": this.treeCharSize * 0.8,
      "font-weight": "bold",
      "fill": this.colors.blue
   };
   this.treeSelectionMarkerAttr = {
      fill: this.colors.blue,
      stroke: "none"
   };

   this.vertexAttr = settings.vertexAttr || this.defaultVertexAttr;
   this.edgeAttr = settings.edgeAttr || this.defaultEdgeAttr;
   this.vertexLabelAttr = settings.vertexLabelAttr || this.defaultVertexLabelAttr;
   this.vertexContentAttr = settings.vertexContentAttr || this.defaultVertexContentAttr;
   this.selectedVertexAttr = settings.selectedVertexAttr || this.defaultSelectedVertexAttr;
   this.selectedEdgeAttr = settings.selectedEdgeAttr || this.defaultSelectedEdgeAttr;

   this.init = function() {
      var html = "";
      if(this.mode < 6){
         html += "<div id=\""+this.tabsID+"\"></div>";
         html += "<div id=\""+this.tabsContainerID+"\">";
         html += "<div id=\""+this.graphPaperID+"\"></div>";
      }
      html += "<div id=\""+this.parseTableID+"\"></div>";
      html += "</div>";
      html += "<div id=\""+this.parseInfoID+"\"></div>";

      $("#"+this.divID).html(html);

      this.initParser();
      if(this.mode < 6){
         this.initTabs();
         this.initAutomata();
         if(this.mode != 3){
            this.initActionSequence(false,true);
         }else{
            this.initActionSequence(false,true);
            this.initActionSequence();
         }
         this.initParseTable();
         this.showTab();
      }
      this.initParseInfo();

      this.style();
      if(this.mode < 6){
         this.updateState(false);
      }
      this.initHandlers();
      if(this.mode >= 3 && this.mode < 6){
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
      if(this.mode != 1 && this.mode != 4 && this.mode != 5){
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

   this.initActionSequence = function(validation,tree) {
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
      var treeIndex = 0;
      // console.log(this.lrTable.states);
      do{
         nLoop++;
         var action = this.lrTable.states[state][symbol];
         // console.log(nLoop+" "+action);
         if(action && (!this.mode == 3 || this.doesAutomatonAllowAction(state,symbol,action)) || tree){
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
                  var ruleIndex = action[0].actionValue; 
                  this.actionSequence.push({
                     actionType: "r",
                     rule: ruleIndex
                  });
                  symbol = this.grammar.rules[ruleIndex].nonterminal;
                  nbRedChar = (this.grammar.rules[ruleIndex].development[0] == "''") ? 0 : this.grammar.rules[ruleIndex].development.length;
                  state = this.stack[this.stack.length - 1 - nbRedChar][0];
                  if(nbRedChar > 0){
                     this.stack.splice(this.stack.length - nbRedChar,nbRedChar,symbol);
                  }else{
                     this.stack.push(symbol);
                  }
                  if(symbol == "S" && iChar >= this.input.length - 1){
                     this.actionSequence[this.actionSequence.length - 1]["goto"] = this.getTerminalState();
                     success = true;
                  }
                  
                  /* create derivation tree */
                  if(tree){
                     var inputIndex = iChar - 1;
                     if(nbRedChar == 0){  //  to deal with empty development
                        treeIndex = 2*inputIndex + 2;
                     }else{
                        // console.log(treeIndex);
                        treeIndex = (2*inputIndex + 1 >= treeIndex) ? 2*inputIndex + 1 : treeIndex; 
                     }
                     
                     if(nbRedChar <= 1){
                        if(this.derivationTree[treeIndex]){
                           this.derivationTree[treeIndex].push([ruleIndex,this.actionSequence.length - 1]);
                        }else{
                           this.derivationTree[treeIndex] = [[ruleIndex,this.actionSequence.length - 1]];
                        }
                        if(this.derivationTree[treeIndex].length > this.treeHeight){
                           this.treeHeight = this.derivationTree[treeIndex].length;
                        }
                     }else{
                        // console.log(treeIndex+" "+ruleIndex);
                        var nodeHeight = 0;

                        var childrenIndices = [treeIndex];
                        var iCol = treeIndex;
                        do{
                           iCol--;
                           if(this.derivationTree[iCol] || iCol%2 == 1){
                              childrenIndices.unshift(iCol);
                           }
                        }while(childrenIndices.length < nbRedChar && iCol >= 0);

                        for(var i of childrenIndices){
                           var branchLength = (this.derivationTree[i]) ? this.derivationTree[i].length : 0;
                           if(branchLength > nodeHeight){
                              nodeHeight = branchLength;
                           }
                        }
      
                        for(var i of childrenIndices){
                           var branchLength = (this.derivationTree[i]) ? this.derivationTree[i].length : 0;
                           if(branchLength != nodeHeight){
                              var gap = nodeHeight - branchLength;
                              for(var j = 0; j < gap; j++){
                                 if(!this.derivationTree[i]){
                                    this.derivationTree[i] = [];
                                 }
                                 this.derivationTree[i].push(["",this.actionSequence.length - 1]);
                              }
                           }
                           if(i == treeIndex){
                              this.derivationTree[i].push([ruleIndex,this.actionSequence.length - 1]);
                           }
                           if(this.derivationTree[i].length > this.treeHeight){
                              this.treeHeight = this.derivationTree[i].length;
                           }
                        }
                     }
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
      // console.log(this.derivationTree);
      // console.log(this.actionSequence);
      if((this.mode == 2 || this.mode == 5) && !validation){
         this.actionSequence = [];
      }
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
         html += "<td data_state=\""+stateID+"\">"+stateID+"</td>";
         for(var iCol = 0; iCol < (this.grammar.terminals.length + 1 + this.grammar.nonterminals.length); iCol++){
            // html += (stateID == terminalStateIndex) ? "<td>" : "<td data_state=\""+stateID+"\" data_symbol=\""+colLabel[iCol]+"\">";
            html += "<td data_state=\""+stateID+"\" data_symbol=\""+colLabel[iCol]+"\">";
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
         var development = (this.grammar.rules[iRule].development[0] == "''") ? "" : this.grammar.rules[iRule].development.join(" ");
         html += "<li class=\"rule\" data_rule=\""+iRule+"\"><span class=\"ruleIndex\">"+iRule+
         "</span> <span class=\"nonTerminal\">"+this.grammar.rules[iRule].nonterminal+"</span><i class=\"fas fa-long-arrow-alt-right\"></i><span class=\"development\">"+
         development+"</span></li>";
      }
      html += "</ul>";
      $("#rules").html(html);
   };

   this.initAction = function() {
      if(this.mode < 6){
         this.initPlayer();
      }
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
      if(this.mode == 3){
         html += "<div id=\"undo\">UNDO</div>";
      }
      html += "</div>";
      // html += "<div id=\"actionInfo\"></div>";
      $("#action").html(html);
   };

   this.initActionInfo = function() {
      var html = "<div id=\"actionInfo\"></div>";
      $("#action").append(html);
      if(this.mode < 6){
         this.initStackTable();
         this.initReduceButton();
         this.initInput();
         this.initShiftButton();
         this.initAcceptButton();
         this.initErrorButton();
      }
      this.initDerivationTree();
      if(this.mode >= 6){
         this.initButtons();
      }
      if(this.mode == 7){
         this.initObjective();
      }
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

   this.initButtons = function() {
      var html = "<div id=\"buttons\"></div>";
      $("#tree").append(html);
      this.initReduceButton();
      this.initUndoButton();
   };

   this.initReduceButton = function() {
      if(this.mode < 6){
         var html = "<div id=\"reduceBar\">";
         html += "<div class=\"messageBackground\"><div id=\"reduceMessage\" class=\"actionMessage\"></div></div>"
         html += "<div id=\"reduceButton\" class=\"actionButton\"><i class=\"fas fa-compress buttonIcon\"></i> REDUCE</div>"
         html += "</div>";
         $("#actionInfo").append(html);
      }else if (this.mode == 6){
         var html = "<div id=\"reduceButton\" class=\"actionButton\"><i class=\"fas fa-compress buttonIcon\"></i> REDUCE</div>";
         $("#buttons").append(html);
      }else if(this.mode == 7){
         var html = "<div id=\"produceButton\" class=\"actionButton\"><i class=\"fas fa-expand buttonIcon\"></i> PRODUCE</div>";
         $("#buttons").append(html);
      }
   }; 

   this.initUndoButton = function() {
      var html = "<div id=\"undo\" class=\"actionButton\"><i class=\"fas fa-undo-alt buttonIcon\"></i> UNDO</div>";
      $("#buttons").append(html);
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
      // var html = "<div class=\"messageBackground\"><div id=\"acceptMessage\" class=\"actionMessage\"></div></div>";
      var html = "<div id=\"acceptButton\" class=\"actionButton\"><i class=\"fas fa-thumbs-up buttonIcon\"></i> ACCEPT</div>";
      // html += "</div>";
      $("#actionInfo").append(html);
      // $("#shiftBar").append(html);
   };

   this.initErrorButton = function(){
      // var html = "<div id=\"errorBar\">";
      // html += "<span id=\"errorMessage\" class=\"actionMessage\"></span>"
      // var html = "<div class=\"messageBackground\"><div id=\"errorMessage\" class=\"actionMessage\"></div></div>";
      var html = "<div id=\"errorButton\" class=\"actionButton\"><i class=\"fas fa-times buttonIcon\"></i> ERROR</div>";
      // html += "</div>";
      $("#actionInfo").append(html);
      // $("#shiftBar").append(html);
   };

   this.initDerivationTree = function() {
      var html = "<div id=\"derivationTree\">";
      html += "<h4>Derivation Tree</h4>";
      html += "<div id=\"tree\"></div>";
      if(this.mode < 6){
         html += "<div id=\"treeCursor\"></div>";
      }
      html += "</div>";
      $("#actionInfo").append(html);
      if(this.mode >= 6){
         $("#tree").append($("<div id=\"treePaper\"></div>"));
         this.derivationTree = {};
         this.input = this.input.replace(/ /g,"");
         if(this.mode == 6){
            for(var iChar = 0; iChar < this.input.length; iChar++){
               this.derivationTree[2 * iChar + 1] = this.input.charAt(iChar);
            }
         }else if(this.mode == 7){
            this.derivationTree[this.input.length] = this.grammar.rules[0].nonterminal;
         }

         this.updateTree();
      }
   };

   this.initHandlers = function() {
      if(this.mode < 6){
         $("#"+this.tabsID+" #switchContainer").off("click");
         $("#"+this.tabsID+" #switchContainer").click(self.switchTab);
         $(window).resize(self.onResize);
      }
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
            this.disableUndoButton();
            break;
         case 4:
            $("#"+this.parseTableID+" td[data_state]").off("click");
            $("#"+this.parseTableID+" td[data_state]").click(self.clickCell);
            this.initPlayerHandlers();
            break;
         case 5:
            this.initPlayerHandlers();
            $("#acceptButton").off("click");
            $("#acceptButton").click(self.acceptInput);
            $("#errorButton").off("click");
            $("#errorButton").click(self.refuseInput); 
            $("#"+this.parseTableID+" td[data_state]").off("click");
            $("#"+this.parseTableID+" td[data_state]").click(self.clickCell);
            $("#"+this.divID).off("click");
            $("#"+this.divID).click(self.resetFeedback);
            break;
         case 6:
         case 7:
            for(var iEl in this.treeClickableElements){
               var el = this.treeClickableElements[iEl];
               el.raphObj.attr("cursor","pointer");
               el.raphObj.click(self.selectSymbol(iEl));
            }
            $(".rule").off("click");
            $(".rule").click(self.selectRule);
            $("#reduceButton, #produceButton").off("click");
            $("#reduceButton").click(self.reduce);
            $("#produceButton").click(self.produce);
            $(".rule, #reduceButton, #produceButton").css({
               cursor: "pointer"
            });
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

   this.initObjective = function() {
      var html = "<div id=\"objective\"><h4>Objective</h4><div id=\"string\"></div></div>";
      $("#actionInfo").append(html);
      var input = this.input.split('');
      for(var char of input){
      $("#objective #string").append("<div class=\"inputChar\">"+char+"</div>");
      }
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

   this.disablePlayerStepBack = function() {
      $("#stepBackward").off("click");
      $("#stepBackward").css({
         cursor: "auto",
         opacity: "0.5"
      });
   };

   this.enablePlayerStepBack = function() {
      $("#stepBackward").click(self.stepBackward);
      $("#stepBackward").css({
         cursor: "pointer",
         opacity: "1"
      });
   };

   this.disableProgressBarClick = function() {
      $("#progressBarClickArea").off("mousedown");
      $("#player").off("mousemove");
      $("#player").off("mouseup");
      $("#progressBarClickArea").css({
         cursor: "auto"
      });
   };

   this.enableProgressBarClick = function() {
      $("#progressBarClickArea").mousedown(self.progressBarDragStart);
      $("#player").mousemove(self.progressBarDragMove);
      $("#player").mouseup(self.progressBarDragEnd);
      $("#progressBarClickArea").css({
         cursor: "pointer"
      });
   };

   this.disableUndoButton = function() {
      $("#undo").off("click");
      $("#undo").css({
         cursor: "auto",
         opacity: "0.5"
      })
   };
   this.enableUndoButton = function() {
      $("#undo").off("click");
      $("#undo").click(self.undo);
      $("#undo").css({
         cursor: "pointer",
         opacity: "1"
      })
   };

   this.onResize = function() {
      /* switch between table displays */
      // console.log("resize")
      // self.updateParseTable();
      if(self.mode >= 3){
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
      }
      self.updateParseTable();
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
      if(self.mode == 3){
         self.isLastActionAGraphEdit = false;
         self.showUndo();
      }
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
      self.runSimulationLoop(self.simulationStep,true,false,true,true);
      if(self.mode == 3){
         self.graphEditor.setEnabled(false);
      }
   };

   this.runSimulationLoop = function(step,loop,reverse,anim,progressBarMove) {
      // console.log(step+" "+loop+" "+reverse+" "+anim)
      this.isAnimationRunning = true;
      var progress = (reverse) ? 100*(step)/this.actionSequence.length : 100*(step + 1)/this.actionSequence.length;
      var action = this.actionSequence[step];
      this.disablePlayerStepBack();
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
         if(progressBarMove){
            var newPos = {width:progress+"%"};
         }else{
            var newPos = {};
         }
         $("#progressBar").animate(newPos,animationTime,function(){
            self.isAnimationRunning = false;
            if(action.actionType != "r" || self.selectedRule == null){
               if(reverse){
                  self.simulationStep--;
               }else{
                  self.simulationStep++;
               }
               // console.log(self.simulationStep);
            }
            if(!loop){
               self.enablePlayerStepBack();
               self.enableProgressBarClick();
               return;
            }
            self.runSimulationLoop(self.simulationStep,loop,reverse,anim,progressBarMove);
         });
      }
      if(!action){
         self.pauseSimulation(null,true);
         return;
      }
            
      switch(action.actionType){
         case "s":
            self.applyShift(action.state,reverse,anim);
            break;
         case "r":
            self.treeAnim(step,reverse,anim);
            self.clearHighlight();
            var rule = action.rule;
            if(reverse){
               this.reverseReduction(rule);
               return;
            }
            
            var nbRedChar = (self.grammar.rules[rule].development[0] == "''") ? 0 : self.grammar.rules[rule].development.length;
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
               this.timeOutID = setTimeout(function() {
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

   this.treeAnim = function(step,reverse,anim) {
      // console.log("tree");
      for(var el of this.treeElements[step]){
         if(anim && !reverse){
            var anim = new Raphael.animation({opacity:1},this.animationTime);
            subTask.raphaelFactory.animate("anim",el,anim);
         }else if(reverse){
            el.attr({opacity:0});
         }else{
            el.attr({opacity:1});
         }
      }
   };

   this.eraseHigherBranches = function(step) {
      for(var iStep in self.treeElements){
         if(iStep > step){
            for(var el of self.treeElements[iStep]){
               el.attr({opacity:0});
            }
         }
      }
   };

   this.pauseSimulation = function(ev,end) {
      // console.log("pause");
      self.isAnimationRunning = false;
      if(self.mode == 3){
         self.isLastActionAGraphEdit = false;
         self.showUndo();
      }

      if(!end){
         clearTimeout(self.timeOutID);
         subTask.raphaelFactory.stopAnimate("anim");
         if($("#progressBar"))
            $("#progressBar").stop();
         if($(".stackElement"))
            $(".stackElement").stop();
         if(self.rowHL)
            self.rowHL.stop();
         if(self.colHL)
            self.colHL.stop();
         self.replayUpTo(self.simulationStep,false,true);
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
      if(self.mode == 3){
         self.isLastActionAGraphEdit = false;
         self.showUndo();
      }
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      self.resetFeedback();
      if(self.simulationStep < 1){
         return;
      }else{
         self.clearHighlight();
         self.replayUpTo(self.simulationStep - 2,false,true);
         self.eraseHigherBranches(self.simulationStep - 1);
         // self.runSimulationLoop(self.simulationStep - 1, false, true,false,true);
      }
   };

   this.stepForward = function() {
      if(self.mode == 3){
         self.isLastActionAGraphEdit = false;
         self.showUndo();
      }

      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      self.resetFeedback();
      if(self.simulationStep >= self.actionSequence.length){
         return;
      }else{
         if(self.isAnimationRunning){
            self.pauseSimulation();
         }
         self.runSimulationLoop(self.simulationStep, false, false,true,true);
      }
   };

   this.progressBarDragStart = function(event) {
      if(self.mode == 3){
         self.isLastActionAGraphEdit = false;
         self.showUndo();
      }
      self.clearHighlight();
      if(self.mode == 4){
         if(!self.checkParseTable()){
            return
         }
      }
      self.resetFeedback();
      self.isDragging = true;

      var x = event.pageX - $(this).offset().left;
      var w = $(this).width();
      
      var step = Math.floor(self.actionSequence.length*x/w - 0.5);
      self.replayUpTo(step,false,false);
      $("#progressBar").width(x/w*100+"%");
   };
   this.progressBarDragMove = function(event) {
      if(!self.isDragging){
         return
      }
      var x = event.pageX - $("#progressBarClickArea").offset().left;
      var y = event.pageY - $(this).offset().top;
      var w = $("#progressBarClickArea").width();
      var h = $(this).outerHeight();
      if(x < 0 || x > w || y < 10 || y >= h - 10){
         self.isDragging = false;
         $("#progressBar").width(self.simulationStep/self.actionSequence.length*100+"%");
         return
      }
      var step = Math.floor(self.actionSequence.length*x/w - 0.5);
      if(step != self.simulationStep - 1){
         self.replayUpTo(step,false,false);
         self.eraseHigherBranches(step);
      }
      $("#progressBar").width(x/w*100+"%");
   };
   this.progressBarDragEnd = function(event) {
      if(!self.isDragging){
         return
      }
      self.isDragging = false;
      var x = event.pageX - $("#progressBarClickArea").offset().left;
      var w = $("#progressBarClickArea").width();
      var step = Math.floor(self.actionSequence.length*x/w - 0.5);
      if(step != self.simulationStep){
         self.replayUpTo(step,false,false);
         self.eraseHigherBranches(step);
      }
      $("#progressBar").width((step + 1)/self.actionSequence.length*100+"%");
   };

   this.replayUpTo = function(step,anim,progressBarMove) {
      // console.log("replay "+step);
      this.reset();
      for(var iStep = 0; iStep <= step; iStep++){
         this.runSimulationLoop(iStep,false,false,anim,progressBarMove);
      }
      // this.clearHighlight();
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

   this.unselectRules = function() {
      $(".rule").removeClass("selected");
      self.selectedRule = null;
      self.styleRules();
   };

   this.switchTab = function() {

      $("#"+self.tabTag[self.selectedTab]).removeClass("selectedTab");
      self.selectedTab = 1 - self.selectedTab;
      $("#"+self.tabTag[self.selectedTab]).addClass("selectedTab");
      self.styleTabSwitch();
      self.showTab();
      self.updateParseTable();
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
      if(self.mode < 6){
         if(self.selectedRule == null){
            self.displayMessage("reduce","You must select a rule");
            // self.displayMessage("reduce","REDUCE 0000654065406540");
         }else if(self.selectedStackElements.length == 0 && self.grammar.rules[self.selectedRule].development[0] != "''"){
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
               self.treeAnim(self.simulationStep,false,true);
               self.simulationStep++;
               self.applyReduction(nonTerminal,goto,true);
               self.saveAnswer();
            }
         }
      }else{
         var selectedIndices = self.getSelectedIndices();
         if(self.selectedRule == null){
            self.displayError("You must select a rule");
         }else if(selectedIndices.length == 0){
            self.displayError("You must select at least one symbol");
         }else if(!self.compareSelectedRuleAndStack()){
            self.displayError("You cannot reduce the selected symbols with the selected rule");
         }else{
            var rule = self.grammar.rules[self.selectedRule];
            var nonTerminal = rule.nonterminal;
            var newEntry = {};
            var cpt = 0;
            var sum = 0;
            for(var i of selectedIndices){
               newEntry[i] = self.derivationTree[i];
               cpt++;
               sum += parseInt(i);
               delete self.derivationTree[i];
            }
            var newIndex = Math.round(sum / cpt);
            newEntry.nonTerminal = nonTerminal;
            self.derivationTree[newIndex] = newEntry;
            self.unselectRules();
            self.updateTree();
            self.initHandlers();
            self.saveAnswer();
         }
      }
   };

   this.compareSelectedRuleAndStack = function() {
      var rule = this.grammar.rules[this.selectedRule];
      if(this.mode < 6){
         this.selectedStackElements.sort();
         if(rule.development[0] == "''" && this.selectedStackElements.length == 0){
            return true;
         }else if(rule.development.length != this.selectedStackElements.length){
            return false;
         }else{
            for(var iEl = 0; iEl < rule.development.length; iEl++){
               if(rule.development[iEl] != this.stack[this.selectedStackElements[iEl]][1]){
                  return false;
               }
            }
         }
         return true;
      }else{
         var selectedIndices = this.getSelectedIndices();
         var selectedSymbols = [];
         for(var i of selectedIndices){
            selectedSymbols.push(this.treeClickableElements[i].symbol);
         }
         if(this.mode == 6){
            if(Beav.Object.eq(selectedSymbols,rule.development)){
               return true;
            }
         }else if(this.mode == 7){
            if(selectedSymbols[0] == rule.nonterminal){
               return true;
            }
         }
         return false;
      }
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
      if(this.selectedStackElements.length > 0){
         var previousCol = parseInt(this.selectedStackElements.sort()[0]) - 1;
      }else{
         var previousCol = this.stack.length - 1;
      }
      if(this.stack[previousCol]){
         return this.stack[previousCol][0];
      }else{
         return null
      }
   };

   this.applyReduction = function(nonTerminal,goto,anim,firstStepOnly) {
      this.clearHighlight();
      var newStackElement = [goto,nonTerminal];
      this.highlightPrevState(this.currentState);
      var prevStates = [this.getPreviousState()];
      for(var col of this.selectedStackElements){
         prevStates.push(this.stack[col][0]);
      }
      var state = prevStates.pop();
      if(anim){
         this.displayMessage("reduce","REDUCE "+this.selectedRule);
         var animTime = this.animationTime/prevStates.length;
         this.reductionAnimLoop(state,prevStates,animTime,newStackElement,firstStepOnly);
      }else{
         if(prevStates.length > 0){
            this.highlightReductionPath(state,prevStates);
            this.highlightReducedStackElements(prevStates);
            this.stack.splice(this.selectedStackElements[0],this.selectedStackElements.length,newStackElement);
            this.selectedStackElements = [];
         }else{
            this.stack.push(newStackElement);
         }
         this.highlightRule(this.selectedRule);
         
         $(".rule").removeClass("selected");
         this.selectedRule = null;
         this.styleRules();
         this.updateStackTable();

         this.updateState(anim);
      }
   };

   this.reductionAnimLoop = function(state,prevStates,animTime,newStackElement,firstStepOnly) {
      if(prevStates.length > 0){
         var prevState = prevStates.pop();
      }else{
         var prevState = state;
      }
      var selectedCol = self.selectedStackElements[prevStates.length];
      if(selectedCol){
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
      }
      var reduc = true;
      if(firstStepOnly && prevStates.length == 0){
         reduc = false;
         this.currentState = prevState;
         this.updateParseTable(true);
         this.waitingForGoto = true;
      }
      this.changeStateAnim(state,prevState,animTime,reduc,function(){
         self.displayMessage("reduce","REDUCE "+self.selectedRule);
         if(prevStates.length > 0){
            self.reductionAnimLoop(prevState,prevStates,animTime,newStackElement,firstStepOnly);
         }else{
            if(self.selectedStackElements.length > 0){
               self.stack.splice(self.selectedStackElements[0],self.selectedStackElements.length,newStackElement);
               self.selectedStackElements = [];
            }else{
               self.stack.push(newStackElement);
               selectedCol = self.stack.length - 1;
            }
            
            self.updateStackTable(firstStepOnly);
            $(".stackElement[data_col="+selectedCol+"]").hide();
            $(".stackElement[data_col="+selectedCol+"]").fadeIn(self.animationTime,function(){
               if(!firstStepOnly){
                  self.goto(newStackElement);
               }
            });
         }
      });
   };

   this.goto = function(newStackElement) {
      self.highlightRule(self.selectedRule);
      self.updateState(true);
      self.displayMessage("reduce","GOTO "+newStackElement[0]);
   }

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

   };

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

   this.updateStackTable = function(noGoto) {
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
      if(!noGoto){   // reduc in mode 5
         this.currentState = this.stack[this.stack.length - 1][0];
         this.currentVertex = this.getStateID(this.currentState);
      }
   };

   this.updateCursor = function(anim) {
      var newX = (this.inputIndex == 0) ? 0 : (this.inputIndex + 1/2) * $(".inputChar").outerWidth();
      var xHL = $("#cursor").position().left;
      var wHL = newX - xHL;

      if(this.inputHighlight){
         this.inputHighlight.remove();
      }
      this.inputHighlight = $("<div id=\"inputHL\"></div>");
      this.inputHighlight.css({
         position: "absolute",
         left: xHL,
         top: 0,
         height: "100%",
         width: wHL+"px",
         "background-color": "rgb(0,10,20)",
         opacity: "0.1"
      });
      $("#inputBar").append(this.inputHighlight);

      if(anim){
         $("#cursor, #treeCursor").animate({left:newX+"px"},this.animationTime);
      }else{
         $("#cursor, #treeCursor").css({left:newX+"px"});
      }
   };

   /* HIGHLIGHT */

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

   this.highlightReductionPath = function(state,prevStates) {
      var prevStates = JSON.parse(JSON.stringify(prevStates));
      do{
         var vertexID = this.getStateID(state);
         var prevState = prevStates.pop();
         var prevVertexID = this.getStateID(prevState);
         var edgeID = this.graph.getEdgesBetween(prevVertexID,vertexID)[0];
         this.highlightEdge(edgeID);
         state = prevState;
      }while(prevStates.length > 0)
   };

   this.highlightRule = function(rule) {
      $(".rule").removeClass("selected");
      $(".rule[data_rule="+rule+"]").addClass("previousRule");
      self.selectedRule = null;
      self.styleRules();
   };

   this.highlightReducedStackElements = function(prevStates) {
      var prevStates = JSON.parse(JSON.stringify(prevStates));
      do{
         var prevState = prevStates.pop();
         var selectedCol = self.selectedStackElements[prevStates.length];

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
      }while(prevStates.length > 0)
   };

   this.clearHighlight = function() {
      // console.log("clearHL");
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

   this.updateParseTable = function(anim) {
      // this.styleParseTable();
      // console.log("updateParseTable")
      if(!this.rowHL && this.mode != 4){
         this.rowHL = $("<div id=\"rowHL\"></div>");
         $("#"+this.parseTableID).append(this.rowHL);
         this.rowHL.css(this.cellHighlightAttr);
      }
      if(!this.colHL && this.mode != 4){
         this.colHL = $("<div id=\"colHL\"></div>");
         $("#"+this.parseTableID).append(this.colHL);
         this.colHL.css(this.cellHighlightAttr);
      }
      var tableW = $("#"+this.parseTableID+" table").width();
      var tableH = $("#"+this.parseTableID+" table").height();
      var tablePos = $("#"+this.parseTableID+" table").position();
      var tableMarginLeft = ($("#"+this.parseTableID).width() - tableW)/2;
      var actionH = $("#"+this.parseTableID+" table th:nth-child(2)").outerHeight();
      var rowH = $("#"+this.parseTableID+" td[data_state=\""+this.currentState+"\"]").outerHeight();
      var colW = $("#"+this.parseTableID+" td[data_symbol=\""+this.input[this.inputIndex]+"\"]").outerWidth();
      var rowTop = $("#"+this.parseTableID+" td[data_state=\""+this.currentState+"\"]").position().top;
      var colLeft = $("#"+this.parseTableID+" td[data_symbol=\""+this.input[this.inputIndex]+"\"]").position().left;
      var newRowAttr = {
         width: tableW - 4,
         height: rowH - 4,
         top: rowTop - 2,
         left: tableMarginLeft - 2
      };

      var newColAttr = {
         width: colW - 4,
         height: tableH - 4 - actionH,
         top: actionH,
         left: colLeft - 2
      };
      // console.log(colW);
      if(this.mode != 4){
         if(!anim){
            this.rowHL.css(newRowAttr);
            this.colHL.css(newColAttr);
            // $("#"+this.parseTableID+" td").removeClass("selected");
            // $("#"+this.parseTableID+" td[data_state=\""+this.currentState+"\"]").addClass("selected");
            // $("#"+this.parseTableID+" td[data_symbol=\""+this.input[this.inputIndex]+"\"]").addClass("selected");
            // this.styleParseTable();
         }else{
            this.rowHL.animate(newRowAttr,this.animationTime);
            this.colHL.animate(newColAttr,this.animationTime);
         }
      }
      // console.log(this.inputIndex+" "+this.input)
   };

   this.updateState = function(anim) {
      var id = this.getStateID(this.currentState);
      if(!id){
         return;
      }
      // console.log("updateState")
      this.updateParseTable(anim);
      var stateVertex = this.visualGraph.getRaphaelsFromID(id);
      this.resetStates();
      var previousState = (this.stack.length > 1) ? this.stack[this.stack.length - 2][0] : null;
      if(!anim){
         stateVertex[0].attr(this.defaultCurrentStateAttr);
         if(previousState != null){
            var id1 = this.getStateID(previousState);
            var edgeID = this.graph.getEdgesBetween(id1,id)[0];
            this.highlightEdge(edgeID);
         }
      }else{
         // var previousState = this.stack[this.stack.length - 2][0];
         this.changeStateAnim(previousState,this.currentState,this.animationTime);
      }
      if(this.currentState == this.getTerminalState()){
         if(!this.accept)
            this.acceptInput();
      }     
   };

   this.changeStateAnim = function(state1,state2,time,reduction,callback) {
      // console.log(state1+" "+state2);
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
         if(callback){
            callback();
         }
         return
      }else if(!edgeVisualInfo["radius-ratio"]){
         /* straight line */
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
         /* curve */
         var param = this.visualGraph.graphDrawer.getEdgeParam(edgeID);
         var cPos = this.visualGraph.graphDrawer.getCenterPosition(param.R,param.s,param.l,param.pos1,param.pos2);
         var alpha = (param.l) ? (Math.asin(param.D/(2*param.R)) + Math.PI) : Math.asin(param.D/(2*param.R));
         var alpha = -2*alpha*180/Math.PI;
         if(this.graph.getEdgesFrom(id1,id2).length > 0 && this.graph.getEdgesFrom(id1,id2)[0] == edgeID){
            var pos1 = param.pos1;
            var pos2 = param.pos2;
            var angle = (param.s) ? -alpha : alpha;
         }else{
            var pos1 = param.pos2;
            var pos2 = param.pos1;
            var angle = (param.s) ? alpha : -alpha;
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
      // console.log(state);
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
            // console.log(line);
            var match = true;
            if(line.nonTerminal != ruleArray.nonterminal){
               match = false;
            }else if(ruleArray.development[0] != "''" && line.development.length != ruleArray.development.length + 1){
               match = false;
            }else if(ruleArray.development[0] == "''"){
               if(line.development.length != 1 || line.development[0] != dot){
                  match = false;
               }
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
      if(!info || !info.content){
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
         if(rule.nonterminal == line.nonTerminal && (Beav.Object.eq(developmentNoDot,rule.development) || (rule.development[0] == "''" && developmentNoDot.length == 0))){
            ruleIndex = rule.index;
         }
      }
      return {ruleIndex: ruleIndex, dotIndex: dotIndex};
   };

   this.graphEditorCallback = function() {
      self.clearHighlight();
      self.pauseSimulation(null,true);
      self.resetFeedback();
      self.actionSequence = [];
      self.reset();

      self.formatContent();
      self.initActionSequence();
      self.saveAnswer();
      self.isLastActionAGraphEdit = true;
      self.showUndo();
      if(answer.visualGraphJSON.length > 1)
         self.enableUndoButton()
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
                     return false;
                  }
               }
               if(char == "." || char == dot){
                  nDots++;
               }
               if(nDots > 1){
                  self.displayError("There shouldn't be more than one dot in a single line");
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

   /* parse table events */

   this.clickCell = function(ev) {
      self.resetFeedback();
      var cell = $(this);
      var state = $(this).attr("data_state");
      var symbol = $(this).attr("data_symbol");
      var cellContent = $(this).text();
      if(self.mode == 4){
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
      }else{
         // console.log(state+" "+symbol);
         // console.log(self.currentState);
         ev.stopPropagation();
         if(self.waitingForGoto){
            var expectedSymbol = self.stack[self.stack.length - 1][1];
         }else{
            var expectedSymbol = self.input[self.inputIndex];
         }
         if(state != self.currentState){
            self.displayError("Wrong state");
         }else if(symbol != expectedSymbol){
            self.displayError("Wrong symbol");
         }else{
            if(cellContent.length == 0){

            }else if(cellContent[0] == "s"){
               var nextState = cellContent[1];
               self.actionSequence.push({
                  actionType: "s",
                  state: nextState
               });
               self.simulationStep++;
               self.applyShift(nextState,false,true);
               self.saveAnswer();
            }else if(cellContent[0] == "r"){
               var rule = cellContent[1];
               var nonTerminal = self.grammar.rules[rule].nonterminal;
               // console.log(nonTerminal);
               self.treeAnim(self.simulationStep,false,true);
               var nbRedChar = (self.grammar.rules[rule].development[0] == "''") ? 0 : self.grammar.rules[rule].development.length;
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
               var previousState = self.getPreviousState();
               var goto = (nonTerminal != "S") ? self.lrTable.states[previousState][nonTerminal][0].actionValue : self.getTerminalState();
               
               self.simulationStep++;
               self.applyReduction(nonTerminal,goto,true,true);
            }else{   // goto
               self.actionSequence.push({
                  actionType: "r",
                  rule: self.selectedRule,
                  goto: cellContent
               });
               self.currentState = cellContent;
               var newStackElement = [cellContent,symbol];
               self.goto(newStackElement);
               self.waitingForGoto = false;
               self.saveAnswer();
            }
         }       
      }
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
   };

   /* derivation tree */

   this.updateTree = function() {
      this.updateTreePaper();
      this.fixConflict();
      this.treeClickableElements = {};
      this.displayTree(this.derivationTree,0,null);

      // console.log(this.derivationTree)
   };

   this.updateTreePaper = function() {
      var treeHeight = this.getObjectDepth(this.derivationTree);
      var treeWidth = this.getTreeWidth(this.derivationTree,1,2 * this.input.length - 1);
      var w = treeWidth * this.treeCharSize;
      var h = (2 * treeHeight + 1)*this.treeCharAttr["font-size"];
      if(!this.treePaper){
         this.treePaper = subTask.raphaelFactory.create("treePaper","treePaper",w,h);
      }else{
         this.treePaper.clear();
         this.treePaper.setSize(w,h);
      }
   };

   this.displayTree = function(tree,level,parentCol) {
      var children = [];
      for(var col in tree){
         if(col == "nonTerminal" || col == "path"){
            continue;
         }
         var symbol = tree[col].nonTerminal || tree[col];
         var x = col * this.treeCharSize;
         var y = this.treeCharAttr["font-size"] * (2 * level + 1); 
         if((this.mode == 6 && level == 0) || (this.mode == 7 && this.grammar.nonterminals.includes(symbol) && typeof tree[col] != 'object')){
            var clickArea = this.treePaper.circle(x,y,this.treeCharSize).attr({
               fill: "white",
               stroke: "none",
               opacity: 0
            });
            var text = this.treePaper.text(x,y,symbol).attr(this.treeCharAttr);
            var raphObj = this.treePaper.set(clickArea,text);
            if(this.mode == 6){
               this.treeClickableElements[col] = {raphObj:raphObj,symbol:symbol,selected:false};
            }else{
               this.treeClickableElements[col] = {raphObj:raphObj,symbol:symbol,selected:false,path:tree["path"]};
               if(symbol != this.grammar.axiom)
                  children.push(col);
            }
         }else{
            var text = this.treePaper.text(x,y,symbol).attr(this.treeCharAttr);
            if(symbol != this.grammar.axiom)
               children.push(col);
         }
         if(typeof tree[col] == 'object'){
            this.displayTree(tree[col],level + 1,col);
         }
      }
      if(children.length == 1){
         var col = children[0];
         var xi = col * this.treeCharSize;
         var yi = this.treeCharAttr["font-size"] * (2 * level + 1/2); 
         var yf = this.treeCharAttr["font-size"] * (2 * level - 1/2); 
         this.treePaper.path("M"+xi+" "+yi+"V"+yf).attr(this.treeLineAttr);
      }else{
         for(var child of children){
            var col = child;
            var xi = col * this.treeCharSize;
            var yi = this.treeCharAttr["font-size"] * (2 * level + 1/2); 
            var xf = parentCol * this.treeCharSize;
            var yf = this.treeCharAttr["font-size"] * (2 * level - 1/2); 
            if(xi == xf){
               this.treePaper.path("M"+xi+" "+yi+"V"+yf).attr(this.treeLineAttr);
            }else{
               this.treePaper.path("M"+xi+" "+yi+" C "+xi+","+yf+" "+xf+","+yi+" "+xf+","+yf).attr(this.treeLineAttr);
            }
         }
      }
   };

   this.selectSymbol = function(index) {
      return function() {
         // console.log(index);
         // console.log(self.treeClickableElements);
         index = parseFloat(index);
         self.resetFeedback();
         var selectedElement = self.treeClickableElements[index];
         var selected = selectedElement.selected;
         var x = selectedElement.raphObj[0].attr("cx");
         var y = selectedElement.raphObj[0].attr("cy");
         var r = self.treeCharSize * 0.7;
         if(self.mode == 6){
            var selectedIndices = self.getSelectedIndices();
         }
         if(self.treeSelectionMarker){
            self.treeSelectionMarker.remove();
         }
         if(selected){
            if(self.mode == 6){
               for(var i of selectedIndices){
                  self.selectElement(self.treeClickableElements[i],false);
               }
            }else{
               self.selectElement(selectedElement,false);
            }
         }else{
            if(self.mode == 7 || selectedIndices.length == 0){
               if(self.mode == 7){
                  for(var iEl in self.treeClickableElements){
                     self.selectElement(self.treeClickableElements[iEl],false);
                  }
               }
               self.selectElement(selectedElement,true);
               self.treeSelectionMarker = self.treePaper.circle(x,y,r).attr(self.treeSelectionMarkerAttr).toBack();
            }else{
               var furthestIndex = self.getFurthestIndex(index,selectedIndices);
               var fx = self.treeClickableElements[furthestIndex].raphObj[0].attr("cx");
               var fy = self.treeClickableElements[furthestIndex].raphObj[0].attr("cy");
               var w = Math.abs(x - fx) + 2 * r;
               var h = 2 * r;
               if(index < furthestIndex){
                  for(var i in self.treeClickableElements){
                     if(parseFloat(i) >= index && parseFloat(i) <= furthestIndex)
                        self.selectElement(self.treeClickableElements[i],true);
                  }
                  self.treeSelectionMarker = self.treePaper.rect(x - r,y - r,w,h,r).attr(self.treeSelectionMarkerAttr);
                  self.treeSelectionMarker.toBack();
               }else{
                  for(var i in self.treeClickableElements){
                     if(parseFloat(i) <= index && parseFloat(i) >= furthestIndex)
                        self.selectElement(self.treeClickableElements[i],true);
                  }
                  self.treeSelectionMarker = self.treePaper.rect(fx - r,fy - r,w,h,r).attr(self.treeSelectionMarkerAttr).toBack();
               }
            }
         }
         
      }
   };

   this.getSelectedIndices = function() {
      var selectedEl = [];
      for(var col in this.treeClickableElements){
         var el = this.treeClickableElements[col];
         if(el.selected){
            selectedEl.push(col);
         }
      }
      return selectedEl;
   };

   this.getFurthestIndex = function(index,selectedIndices) {
      var diff = 0;
      var furthestIndex;
      for(var i of selectedIndices){
         var localDiff = Math.abs(i - index);
         if(localDiff >= diff){
            diff = localDiff;
            furthestIndex = i;
         }
      }
      // console.log(furthestIndex);
      return furthestIndex;
   };

   this.selectElement = function(el,selected){
      if(selected){
         el.selected = true;
         el.raphObj[1].attr({fill:"white"});
      }else{
         el.selected = false;
         el.raphObj[1].attr({fill:self.colors.blue});
      }
   };

   this.getObjectDepth = function(object) {
      var level = 1;
      var key;
      for(key in object) {
         if (!object.hasOwnProperty(key)) continue;

         if(typeof object[key] == 'object'){
            var depth = this.getObjectDepth(object[key]) + 1;
            level = Math.max(depth, level);
         }
      }
      return level;
   };

   this.getTreeWidth = function(tree,min,max) {
      var min = this.getMinKey(tree,min);
      var max = this.getMaxKey(tree,max);
      var width = max - min + 3;

      return width;
   };

   this.getMinKey = function(tree,min) {
      for(var key in tree){
         if(!isNaN(key)){
            key = parseFloat(key);
            min = Math.min(key,min);
            if(typeof tree[key] == 'object'){
               var localMin = this.getMinKey(tree[key],min);
               min = Math.min(localMin,min);
            }
         }
      }
      return min;
   };

   this.getMaxKey = function(tree,max) {
      for(var key in tree){
         if(!isNaN(key)){
            key = parseFloat(key);
            max = Math.max(key,max);
            if(typeof tree[key] == 'object'){
               var localMax = this.getMaxKey(tree[key],max);
               max = Math.max(localMax,max);
            }
         }
      }
      return max;
   };

   this.produce = function() {
      var selectedIndices = self.getSelectedIndices();
      if(self.selectedRule == null){
         self.displayError("You must select a rule");
      }else if(selectedIndices.length == 0){
         self.displayError("You must select at least one symbol");
      }else if(!self.compareSelectedRuleAndStack()){
         self.displayError("You cannot develop the selected symbol with the selected rule");
      }else{
         var rule = self.grammar.rules[self.selectedRule];
         var nonTerminal = rule.nonterminal;
         var newEntry = {};
         var parentIndex = selectedIndices[0];
         // var level = self.treeClickableElements[parentIndex].level;
         var path = self.treeClickableElements[parentIndex].path;
         var startIndex = parentIndex - rule.development.length + 1;
         for(var iSymbol = 0; iSymbol < rule.development.length; iSymbol++){
            var index = startIndex + iSymbol * 2;
            newEntry[index] = rule.development[iSymbol];
         }
         newEntry.nonTerminal = nonTerminal;
         // console.log(self.treeClickableElements[parentIndex]);
         if(!path){
            newEntry.path = [parentIndex];
            self.derivationTree[parentIndex] = newEntry;
         }else{
            newEntry.path = JSON.parse(JSON.stringify(self.treeClickableElements[parentIndex].path));
            newEntry.path.push(parentIndex);
            self.addNewEntry(newEntry);

         }
         self.unselectRules();
         self.updateTree();
         self.initHandlers();
         self.saveAnswer();
         // console.log(self.derivationTree);
      }
   };

   this.addNewEntry = function(newEntry) {
      var path = JSON.parse(JSON.stringify(newEntry.path));
      var branch = this.goToBranch(this.derivationTree,path);
      branch[path[path.length - 1]] = newEntry;
      // branch = newEntry;
   };

   this.goToBranch = function(tree,path) {
      var step = path.shift();
      var branch = tree[step];
      if(path.length > 1){
         branch = this.goToBranch(branch,path);
      }
      return branch;
   };

   this.fixConflict = function() {
      var negativeKey = this.findNegativeKey(this.derivationTree);
      if(negativeKey){
         var newTree = {};
         var correction = 1 - negativeKey;
         this.shiftTree(this.derivationTree,correction,newTree);
         this.derivationTree = JSON.parse(JSON.stringify(newTree));
         this.updateTreePaper();
      }
      this.fixOverlap(this.derivationTree);
   };

   this.findNegativeKey = function(object) {
      var negativeKey = 0;
      for(var key in object) {
         if(key < negativeKey){
            negativeKey = key;
         }
         if (!object.hasOwnProperty(key)) continue;

         if(typeof object[key] == 'object'){
            var otherKey = this.findNegativeKey(object[key]);
            negativeKey = Math.min(negativeKey, otherKey);
         }
      }
      return negativeKey;
   };

   this.shiftTree = function(tree,correction,nTree) {
      for(var key in tree) {
         if(key != "nonTerminal" && key != "path"){
            key = parseFloat(key);
            var newKey = key + correction;
            // console.log(key+" "+correction+" "+newKey);
            if(typeof tree[key] == 'object'){
               nTree[newKey] = {};
               this.shiftTree(tree[key],correction,nTree[newKey]);
            }else{
               nTree[newKey] = JSON.parse(JSON.stringify(tree[key]));
            }
         }else if(key == "nonTerminal"){
            nTree[key] = JSON.parse(JSON.stringify(tree[key]));
         }else if(key == "path"){
            nTree[key] = tree[key].map(x => parseFloat(x) + correction);
         }
      }
   };

   this.fixOverlap = function(tree) {
      this.inputBaseline = [];
      this.getInputBaseLine(this.derivationTree);
      var baseLength = this.inputBaseline.length;
      if(baseLength >= this.input.length){
         var minIndex = 1;
      }else{
         var minIndex = this.input.length - baseLength + 1;
      }
      
      if(!this.isOverlapping(minIndex)){
         return;
      }

      var maxIndex = minIndex + (baseLength - 1) * 2;
      var index = maxIndex;

      do{
         var entry = this.inputBaseline.pop();
         if(entry.key != index){
            if(entry.path){
               var path = JSON.parse(JSON.stringify(entry.path));
               var branch = this.goToBranch(this.derivationTree,path);
               if(path.length > 0){
                  branch = branch[path[0]];
               }
            }else{
               var branch = this.derivationTree;
            }
            this.replaceLeafIndex(branch,entry.key,index);
         }
         index = index - 2;
      }while(this.inputBaseline.length > 0);

      this.fixParentsPositions(this.derivationTree);
      this.updateTreePaper();
   };

   this.getInputBaseLine = function(tree) {
      for(var key in tree){
         if(typeof tree[key] != 'object'){
             if(key != "nonTerminal"){
               this.inputBaseline.push({symbol:tree[key],key:key,path:tree.path});
             }
         }else if(key != "path"){
            this.getInputBaseLine(tree[key]);
         }
      }
   };

   this.replaceLeafIndex = function(branch,oldIndex,newIndex) {
      if(branch[newIndex]){
         this.replaceLeafIndex(branch,newIndex,newIndex + 2);
      }
      if(branch[oldIndex]){
         branch[newIndex] = JSON.parse(JSON.stringify(branch[oldIndex]));
         delete branch[oldIndex];
      }
   };

   this.isOverlapping = function(minIndex) {
      var index = minIndex;
      for(var el of this.inputBaseline){
         if(el.key != index){
            return true;
         }else{
            index = index + 2;
         }
      }
      return false;
   };

   this.fixParentsPositions = function(tree) {
      for(var pos in tree){
         if(typeof tree[pos] == "object" && pos != "path"){
            this.fixParentsPositions(tree[pos]);
            var sum = 0;
            var cpt = 0;
            for(var childPos in tree[pos]){
               if(!isNaN(childPos)){
                  sum += parseInt(childPos);
                  cpt++;
               }
            }
            var newPos = Math.round(sum/cpt);
            if(pos != newPos){
               this.replaceBranchIndex(tree,pos,newPos);
            }
         }
      }
   };

   this.replaceBranchIndex = function(parentBranch,oldIndex,newIndex) {
      parentBranch[newIndex] = JSON.parse(JSON.stringify(parentBranch[oldIndex]));
      this.replaceBranchPath(parentBranch[newIndex],newIndex,parentBranch[newIndex].path.length - 1);
      delete parentBranch[oldIndex];
   };

   this.replaceBranchPath = function(branch,newIndex,level) {
      branch.path[level] = newIndex;
      for(var index in branch){
         if(typeof branch[index] == "object" && !isNaN(index)){
            this.replaceBranchPath(branch[index],newIndex,level);
         }
      }
   };

   /* answer */

   this.saveAnswer = function() {
      switch(self.mode){
         case 2:
         case 5:
            answer.actionSequence = JSON.parse(JSON.stringify(self.actionSequence));
            answer.accept = self.accept;
            answer.error = self.error;
            break;
         case 3:
            answer.visualGraphJSON.push(self.visualGraph.toJSON());
            break;
         case 6:
         case 7:
            answer.push(JSON.parse(JSON.stringify(self.derivationTree)));
            if(answer.length > 1){
               self.enableUndoButton();
            }
            break;
      }
   };

   this.reloadAnswer = function() {
      switch(this.mode){
         case 2:
         case 5:
            this.actionSequence = JSON.parse(JSON.stringify(answer.actionSequence));
            this.replayUpTo(this.actionSequence.length,false,true);
            if(answer.accept){
               this.acceptInput();
            }else if(answer.error){
               this.refuseInput();
            }
            break;
         case 3:
            this.visualGraphJSON = answer.visualGraphJSON[answer.visualGraphJSON.length - 1];
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
            break;
         case 6:
         case 7:
            this.derivationTree = JSON.parse(JSON.stringify(answer[answer.length - 1]));
            this.updateTree();
            this.initHandlers();
            if(answer.length > 1){
               self.enableUndoButton();
            }else{
               self.disableUndoButton();
            }

      }
   };

   this.undo = function() {
      self.resetFeedback();
      if(self.mode < 6){
         answer.visualGraphJSON.pop();
         self.reloadAnswer();
         if(answer.visualGraphJSON.length <= 1){
            self.disableUndoButton()
         }
      }else{
         answer.pop();
         self.reloadAnswer();
         // if(answer.length <= 1){
         //    self.disableUndoButton();
         // }
      }
   };

   this.validation = function() {
      switch(this.mode){
         case 2:
         case 5:
            this.pauseSimulation();
            if(!answer.accept && !answer.error){
               this.displayError("You must click on either the accept or the error button");
            }else{
               this.reset();
               this.actionSequence = [];
               this.initActionSequence(true);
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
            this.replayUpTo(this.actionSequence.length,false,true);
            break;
         case 3:
            this.pauseSimulation();
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
            break;
         case 4:
            this.pauseSimulation();
            var success = this.checkParseTable();
            return success;
         case 6:
            var lastStep = answer[answer.length - 1];
            var keys = Object.keys(lastStep);
            if(keys.length == 1 && lastStep[keys[0]].nonTerminal == "S"){
               return true;
            }else{
               this.displayError("You didn't reduce the entire input to the axiom");
            }
            break;
         case 7:
            var lastStep = answer[answer.length - 1];
            this.inputBaseline = [];
            this.getInputBaseLine(lastStep);
            var index = 0;
            for(var el of this.inputBaseline){
               if(el.symbol != this.input.charAt(index)){
                  this.displayError("You didn't reach the objective");
                  return false;
               }
               index++;
            }
            return true;
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
      // console.log(msg)
   };

   this.resetFeedback = function() {
      // console.log("reset")
      self.displayMessage("reset");
      self.displayError("");
   };

   this.style = function() {
      // console.log("style")
      $("#"+this.divID).css({
         "font-size": "80%"
      })
      if(this.mode < 6){
         /* tab switch */
         this.styleTabSwitch();

         /* paper, parse table */
         this.styleTabs();
      }

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
      if(this.mode < 6){
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
         $("#stepBackward, #stepForward, #undo").css({
            "background-color": this.colors.black,
            padding: "10px 20px",
            "margin-left": "10px"
         });
         $("#undo").css({
            "font-weight": "bold"
         })
         if(this.mode == 3){
            this.showUndo();
         }
         this.styleProgressBar();

         /* stack */
         this.styleStackTable();

         /* action button */
         $("#acceptButton, #errorButton").css({
            "border-radius": "1em",
            float: "right",
            "margin-top": "1em",
            clear: "right"
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
         $("#reduceButton, #shiftButton").css({
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
         $(".inputChar:first-of-type").css({
            "margin-left": "0.75em"
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

         this.styleDerivationTree();
      }else{        
         $("#tree").css({
            display: "flex",
            "justify-content": "flex-start",
            "align-items": "flex-start"
         });
         $("#reduceButton, #produceButton, #undo").css({
            "border-radius": "1em",
            "background-color": this.colors.blue,
            color: "white",
            width: "110px",
            padding: "0.5em 0",
            "text-align": "center",
            "font-weight": "bold",
            "font-size": "0.9em",
         });
         $(".buttonIcon").css({
            "font-size": "0.9em",
            "margin-right": "0.2em"
         });
         $("#reduceButton, #produceButton").css({
            "margin-bottom": "1em"
         });
         $(".inputChar").css({
            display: "inline-block",
            width: this.treeCharSize,
            "text-align": "center",
            color: this.colors.black,
            "font-size": this.treeCharSize,
            padding: "0.5em "+0.5*this.treeCharSize+"px"
         });
      }
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
      // console.log("styleParseTable")
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
      $("#"+this.parseTableID).css({
         position: "relative"
      })
      $("#"+this.parseTableID+" table").css({
         "border-collapse": "collapse",
         border: "2px solid "+this.colors.black,
         "text-align": "center"
      });
      $("#"+this.parseTableID+" table th").css({
         "background-color": this.colors.black,
         color: "white",
         border: "1px solid white"
      });
      $("#"+this.parseTableID+" td").css(this.cellAttr);
      if(this.mode >= 4){
         $("#"+this.parseTableID+" td[data_symbol]").css({
            cursor: "pointer"
         })
      }

      $("#rowHL, #colHL").css(this.cellHighlightAttr);
      // $("#"+this.parseTableID+" td.selected").css(this.selectedCellAttr);
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

   this.styleDerivationTree = function() {
      // if(this.mode < 6){
         var charWidth = $("#inputBar .inputChar").width();
         var charHeight = $("#inputBar .inputChar").height()*0.7;
         var treeWidth = this.input.length*charWidth;
      // }else{
      //    var charWidth = this.treeCharSize;
      //    var charHeight = this.treeCharSize*0.7;
      //    var treeWidth = (this.input.length + 1)*charWidth;
      // }
      // var treeWidth = this.input.length*charWidth;
      var treeHeight = (2*this.treeHeight + 1)*charHeight;

      $("#derivationTree").css({
         position: "relative",
         "padding-top": "10px",
         width: this.input.length*charWidth
      });
      $("#derivationTree h4").css({
         "margin": "0 0 1em 0"
      });

      $("#tree").css({
         height: treeHeight,
         width: treeWidth
      });

      var symbolAttr = {
         "font-size": charHeight,
         "font-weight": "bold",
         "fill": this.colors.blue
      };      
      
      this.treePaper = subTask.raphaelFactory.create("tree","tree",treeWidth,treeHeight);

      for(var iLine = 0; iLine < 2*this.treeHeight + 1; iLine++){
         // for(var iChar = 0; iChar < this.input.length - 1; iChar++){
         for(var iCol = 0; iCol < this.derivationTree.length; iCol++){
            if(iLine == 0){
               // var x = charWidth * (iChar + 1/2);
               var x = charWidth * (iCol + 1) / 2;
               var y = treeHeight - charHeight/2; 
               // this.treePaper.text(x,y,this.input[iChar]).attr(symbolAttr);
               if(iCol%2 == 1){
                  this.treePaper.text(x,y,this.input[(iCol - 1)/2]).attr(symbolAttr);
               }
            }else if(iLine % 2 != 0 && this.derivationTree[iCol]){
               var rule = (this.derivationTree[iCol][(iLine - 1)/2]) ? this.derivationTree[iCol][(iLine - 1)/2][0] : "";
               var actionIndex = (this.derivationTree[iCol][(iLine - 1)/2]) ? this.derivationTree[iCol][(iLine - 1)/2][1] : "";
               if(this.grammar.rules[rule]){
                  var nbRed = this.grammar.rules[rule].development.length;
                  var x = (iCol%2 == 0 && nbRed > 1) ? (iCol + 1 - (nbRed - 2))*charWidth/2 : (iCol + 1 - (nbRed - 1))*charWidth/2;
                  var y = treeHeight - charHeight*(iLine + 1 + 1/2);
                  this.treeElements[actionIndex] = [this.treePaper.text(x,y,this.grammar.rules[rule].nonterminal).attr(symbolAttr)];
                  if(iLine == 1){
                     var x1 = x;
                     var x2 = x1;
                     var y1 = y + charHeight/2;
                     var y2 = y1 + charHeight;
                     this.treeElements[actionIndex].push(self.treePaper.path("M"+x1+" "+y1+" V"+y2).attr(self.treeLineAttr));
                  }else if(nbRed == 1){
                     var x1 = x;
                     var x2 = x1;
                     var y1 = y + charHeight/2;
                     var y2 = y1 + charHeight;
                     this.treeElements[actionIndex].push(self.treePaper.path("M"+x1+" "+y1+" V"+y2).attr(self.treeLineAttr));
                  }else{
                     var kLine = (iLine - 1)/2;
                     var children = [];

                     var childrenIndices = [iCol];
                     var jCol = iCol;
                     do{
                        jCol--;
                        if(this.derivationTree[jCol]){
                           childrenIndices.unshift(jCol);
                        }
                     }while(childrenIndices.length < nbRed);

                     // for(var j = iChar - (nbRed - 1); j <= iChar; j++){
                     for(var j of childrenIndices){
                        jLine = kLine - 1;
                        var foundChild = false;
                        do{
                           var rule = self.derivationTree[j][jLine][0];
                           if(rule != ""){
                              children.push({col:j,row:(2*jLine + 1),nbRed:self.grammar.rules[rule].development.length})
                              foundChild = true;
                           }else{
                              jLine--; 
                              if(jLine < 0){
                                 children.push({col:j,row:jLine,nbRed:1})
                                 foundChild = true;
                              }
                           }
                        }while(!foundChild)
                     }
                     for(var child of children){
                        var childLeft = (child.col%2 == 0 && child.nbRed > 1) ? (child.col + 1 - (child.nbRed - 2))*charWidth/2 : (child.col + 1 - (child.nbRed - 1))*charWidth/2;
                        var x1 = x;
                        var x2 = childLeft;
                        var y1 = 2*self.treeHeight - iLine;
                        var y2 = y1 + 1;
                        if(x1 == x2){
                           this.treeElements[actionIndex].push(self.treePaper.path("M"+x1+" "+y1*charHeight+" V"+y2*charHeight).attr(self.treeLineAttr));  
                        }else{
                           var x1c = x1;
                           var y1c = (y1 + 0.9);
                           var x2c = x2;
                           var y2c = (y2 - 0.9);

                           this.treeElements[actionIndex].push(self.treePaper.path("M"+x1+" "+y1*charHeight+" C "+x1c+","+y1c*charHeight+" "+x2c+","+y2c*charHeight+" "+x2+","+y2*charHeight).attr(self.treeLineAttr));  
                        }
                        var x3 = x2;
                        var y3 = 2*self.treeHeight - child.row - 1;
                        this.treeElements[actionIndex].push(self.treePaper.path("M"+x2+" "+y2*charHeight+" V"+y3*charHeight).attr(self.treeLineAttr));  
                     }
                  }
               }
            }
         }
      }
      // if(this.mode < 6)
      for(var actionIndex in this.treeElements){
         var elements = this.treeElements[actionIndex];
         for(var el of elements){
            el.attr({opacity:0});
         }
      }
      
      $("#treeCursor").css({
         position: "absolute",
         bottom: 0,
         left: 0,
         height: $("#derivationTree").outerHeight() + $("#shiftBar").height(),
         width: 0,
         "border-left": "1px dotted "+this.colors.blue
      });
   };

   this.styleCellEditor = function(state,symbol) {
      $("#"+this.parseTableID+" table td[data_symbol=\""+symbol+"\"][data_state=\""+state+"\"]").css({
         padding: 0
      })
      $("#cellEditor").css({
         width: "1.5em",
      });
   };

   this.showUndo = function() {
      if(this.isLastActionAGraphEdit){
         $("#stepBackward, #stepForward").hide();
         $("#undo").show();
      }else{
         $("#stepBackward, #stepForward").show();
         $("#undo").hide();
      }
   }
   
   this.init();

};