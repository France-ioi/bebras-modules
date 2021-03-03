function LR_Parser(settings,subTask,answer) {
   self = this;


   this.strings = {
      explanations: {
         // +
         shift: 'The lookahead symbol <code>{symbol}</code> is read from the input and state <code>{state}</code> is pushed onto the stack.',
         //         
         reduce1: 'Lookahead symbol <code>{symbol}</code> is in the Follow set of the LHS non-terminal (<code>{non_terminal}</code>) for the item <code>{item}</code>, thus states <code>{popped_states}</code> are popped from the stack that represent <code>{RHS}</code> in the derivation.',
         reduce2: 'The top element after popping <code>{popped_states}</code> is <code>{top_state}</code>, that leads to state <code>{new_state}</code> with the non-terminal <code>{non_terminal}</code>, which is pushed onto the stack.',
         //+
         error: 'No shift or reduce operations possible at state <code>{state}</code> for lookahead symbol <code>{symbol}</code>',
         //?
         not_accepted: 'The input is fully read, and no reduction is possible, so the input is in the language of the grammar.',
         //+
         accepted: 'The input is fully read, and the current state <code>{state}</code> has the item <code>{base_reduction_item}</code>, so the input is accepted.'
      }
   }
   this.formatExplanation = function(key, values) {
      var str = this.strings.explanations[key] || null;
      if(str === null) {
         console.error('Explanation ' + key + ' not found.');
         return str;
      }
      values = values || {};
      for(var i in values) {
         if(!values.hasOwnProperty(i)) {
            continue;
         }
         str = str.replace('{' + i + '}', '<strong>' + values[i] + '</strong>');
      }
      return str;
   };
   this.itemToString = function(item) {
      var str = '';
      str += item.rule.nonterminal+' '+arrow;
      for(var iDev = 0; iDev <= item.rule.development.length; iDev++){
         if(iDev == item.dotIndex){
            str += ' '+dot;
         }
         if(item.rule.development[iDev]){
            str += ' '+item.rule.development[iDev];
         }
      }
      return str
   };
   this.gotoInformation = {}; // for explanation


   this.mode = settings.mode;
   /* 
   1: simulation
   2: execute existing automaton
   3: create automaton
   4: create parse table
   5: execute existing automaton with parse table
   6: derivation tree bottom up
   7: derivation tree top down
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
   this.computedStates = {}; // mode 3
   
   this.derivationTree = [];
   this.treeHeight = 0;
   this.treePaper;
   this.treeElements = {};
   this.treeCharSize = 20 // mode > 6
   this.treeClickableElements = {};
   this.treeSelectionMarker = null;
   this.inputBaseline = []; // mode = 7
   this.selectedSymbolIndices = [];
   this.reductionMarkerR = 10;

   this.timeOutID;
   this.animationTime = settings.animationTime || 1000;
   this.token;
   this.showLog = settings.showLog;

   this.divID = settings.divID;
   this.sideTable = false;
   this.rowHL = null;
   this.colHL = null;
   this.gotoColHL = null;
   this.removeGotoColHL = false; // simulation bug fix with parse table anim

   this.paper;
   this.paperHeight = settings.paperHeight;
   this.paperWidth = settings.paperWidth;
   this.visualGraphJSON = settings.visualGraphJSON;

   this.stackPreview;
   this.stackPreviewElements;
   var stackPreviewW = 50;
   var stackPreviewH;

   this.graphDrawer;
   this.visualGraph;
   this.graph;
   this.graphMouse;
   this.graphEditor;
   this.isLastActionAGraphEdit = true;
   this.isDragging = false;
   this.isAnimationRunning = false;
   this.waitingForGoto = false; // used only in mode 5 && 2

   this.tabTag = [ "automatonTab", "parseTableTab" ];
   this.selectedTab = (this.mode != 4) ? 0 : 1;
   this.selectedVertex = null;
   this.selectedRule = null;
   this.selectedStackElements = [];

   this.inputHighlight = null;
   this.prevStateHighlight = null;
   this.pathHighlight = {};
   this.stackElementsHL = [];
   this.reductionClickArea = {}; // for clicking lines in the automaton in mode 2
   this.reductionStates = []; // states with a reduction marker

   this.cellEditor = null;

   this.accept = false;
   this.error = false;

   if(/Linux/.test(window.navigator.platform)){
      var arrow = "→";
      var dot = "・";
   }else{
      var arrow = "🡒";
      var dot = "🞄";
   }

   this.colors = {
      black: "#4a4a4a",
      yellow: "#f7aa28",
      lightgrey: "#f2f2f2",
      blue: "#4990e2",
      lightBlue: "#cbddf3",
      greyBlue: "#aec6e2"
   };
   // this.unselectedTabAttr = {
   //    opacity: 0.5
   // };
   // this.selectedTabAttr = {
   //    opacity: 1
   // };
   this.defaultEdgeAttr = {
     "stroke": this.colors.yellow,
     "stroke-width": 4,
     "arrow-end": "long-classic-wide"
   };
   this.defaultVertexAttr = {
     "r": 10,
     "fill": this.colors.black,
     "stroke": "white",
     "stroke-width": 1
   };
   this.headerAttr = {
      r: 10,
      fill: "none",
      stroke: "white",
     "stroke-width": 1
   };
   this.defaultSelectedVertexAttr = {
      stroke: this.colors.yellow,
     "stroke-width": 5
   };
   this.defaultSelectedEdgeAttr = {
      "stroke": this.colors.yellow,
     "stroke-width": 6,
   };
   this.defaultCurrentStateAttr = {
      // "fill": this.colors.blue,
      stroke: this.colors.blue,
      "stroke-width": 5
   };
   this.currentHeaderAttr = {
      "fill": this.colors.blue,
      stroke: "none"
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
     "stroke": this.colors.lightBlue,
     "stroke-width": 5,
     "fill": "none",
     // opacity: "0.1"
   };
   this.edgeHighlightAttr = {
      bwd: {
         stroke: this.colors.lightBlue,
         "stroke-width": 4
      },
      fwd: {
         stroke: this.colors.blue,
         "stroke-width": 4
      }
   };
   this.cellAttr = {
      "background-color": this.colors.lightgrey,
      color: this.colors.black,
      border: "1px solid "+this.colors.black
   };
   this.reductionMarkerAttr = {
      circle: {
         stroke: "white",
         fill: this.colors.black,
         r: this.reductionMarkerR
      },
      text: {
         "font-size": 12,
         "font-weight": "bold",
         // fill: this.colors.black,
         fill: "white",
         "text-anchor": "end"
      },
      rule: {
         "font-size": 12,
         "font-weight": "bold",
         fill: this.colors.yellow,
         "text-anchor": "start"
      },
      acc: {
         "font-size": 12,
         "font-weight": "bold",
         fill: this.colors.yellow
      }
   };
   // this.selectedCellAttr = {
   //    "background-color": this.colors.blue,
   //    color: "white",
   //    border: "1px solid "+this.colors.lightgrey
   // };
   this.cellHighlightAttr = {
      position: "absolute",
      border: "4px solid",
      "border-color": this.colors.blue,
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
   this.reductionClickAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0,
      cursor: "pointer"
   };
   this.stackPreviewAttr = {
      colW: 50,
      background: {
         stroke: this.colors.black,
         fill: this.colors.lightgrey
      },
      circle: {
         r: 5,
         stroke: "none",
         fill: this.colors.black
      },
      line: {
         stroke: this.colors.black,
         "stroke-width": 2
      },
      symbolCircle: {
         r: 10,
         stroke: this.colors.black,
         fill: this.colors.lightgrey
      },
      symbol: {
         "font-size": 12,
         "font-weight": "bold",
         fill: this.colors.black
      },
      previousCircle: {
         fill: this.colors.greyBlue
      },
      previousLine: {
         stroke: this.colors.greyBlue
      },
      previousSymbolCircle: {
         stroke: this.colors.greyBlue
      },
      previousSymbol: {
         fill: this.colors.greyBlue
      }
   };

   this.vertexAttr = settings.vertexAttr || this.defaultVertexAttr;
   this.edgeAttr = settings.edgeAttr || this.defaultEdgeAttr;
   this.vertexLabelAttr = settings.vertexLabelAttr || this.defaultVertexLabelAttr;
   this.vertexContentAttr = settings.vertexContentAttr || this.defaultVertexContentAttr;
   this.selectedVertexAttr = settings.selectedVertexAttr || this.defaultSelectedVertexAttr;
   this.selectedEdgeAttr = settings.selectedEdgeAttr || this.defaultSelectedEdgeAttr;

   this.init = function() {
      if(window.FontsLoader) {
         FontsLoader.loadFonts(['fontawesome']);
         FontsLoader.checkFonts();
      }

      var html = "";
      if(this.mode < 6){
         html += '<div id="tabs"></div>';
         html += '<div id="tabsCont">';
         html += '<div id="graphPaper"></div>';
         html += '<div id="parseTable"></div>';
         html += '<div id="explanations"></div>';
         html += "</div>";
      }
      html += '<div id="parseInfo"></div>';

      if(this.showLog){
         html += '<div id="logTable">'
         html += '<table><thead><tr><th>STACK</th><th>INPUT</th><th>ACTION</th></tr></thead><tbody></tbody></table>';
         html += '</div>';
      }

      $("#"+this.divID).html(html);

      this.initParser();
      if(this.mode < 6){
         if(this.mode != 2){
            this.initTabs();
         }
         this.initAutomata();
         if(this.mode != 3){
            this.initActionSequence(false,true);
            this.initParseTable();
         }else{
            this.initParseTable();
            // this.initActionSequence();
            this.initActionSequence(false,true);
         }
         // this.initParseTable();
         this.showTab();
      }
      this.initParseInfo();

      this.style();
      if(this.mode < 6){
         this.updateState(false,"init");
         // if(this.showLog){
         //    this.updateLogTable();
         // }
      }
      this.initHandlers();
      if(this.mode >= 3 && this.mode < 6){
         this.onResize();
      }
   };

   this.initTabs = function() {
      $("#tabs").html("<span id=\"automatonTab\">Automaton</span><div id=\"switchContainer\"><div id=\"switch\"></div></div><span id=\"parseTableTab\">Parse table</span>");
      $("#"+this.tabTag[this.selectedTab]).addClass("selectedTab");
   };

   this.initParser = function() {
      var ruleStr = this.rules.toString().replace(/,/g,"\n");
      this.grammar = new Grammar(ruleStr);
      this.lrClosureTable = new LRClosureTable(this.grammar);
      this.lrTable = new LRTable(this.lrClosureTable);
      // console.log(this.grammar)
      // console.log(this.lrClosureTable)
   };

   this.initAutomata = function() {
      if(!this.paper){
         this.paper = subTask.raphaelFactory.create("graphPaper","graphPaper",this.paperWidth,this.paperHeight);
      }
      if(this.mode < 6 && this.mode != 3){
         this.reductionStates = this.getReductionStates();
      }
      if(!this.graphDrawer){
         this.graphDrawer = new SimpleGraphDrawer(this.vertexAttr,this.edgeAttr,null,true);
         this.graphDrawer.setVertexLabelAttr(this.vertexLabelAttr);
         this.graphDrawer.setVertexContentAttr(this.vertexContentAttr);
         this.graphDrawer.setDrawVertex(this.drawVertex);
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
            paperElementID: "graphPaper",
            visualGraph: this.visualGraph,
            graphMouse: this.graphMouse,
            // alphabet: this.alphabet,
            selectedVertexAttr: this.selectedVertexAttr,
            selectedEdgeAttr: this.selectedEdgeAttr,
            enabled: true
         };
         if(this.mode == 2){
            graphEditorSettings.selectVertexCallback = this.onVertexSelect;
            graphEditorSettings.startDragCallbackCallback = this.startDragCallback;
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
            graphEditorSettings.startDragCallbackCallback = this.startDragCallback;
            graphEditorSettings.moveDragCallback = this.moveDragCallback;
            graphEditorSettings.contentValidation = this.contentValidation;
            graphEditorSettings.vertexLabelValidation = this.vertexLabelValidation;
            graphEditorSettings.writeContentCallback = this.writeContentCallback;
            graphEditorSettings.resizeTableVertexCallback = this.resizeTableVertexCallback;
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
            // this.graphEditor.setInitialEnabled(false);
            this.graphEditor.setAllowMultipleTerminal(false);
            this.graphEditor.setAllowMultipleInitial(false);
            this.graphEditor.setAllowSimultaneousInitialAndTerminal(false);
            this.graphEditor.graphDragger.setMoveDragCallback(this.graphDraggerMoveDragCallback);
         }
         this.graphEditor.setIconAttr({fill:this.colors.yellow,stroke:"none"});
      }
      this.formatContent();
      this.visualGraph.redraw();

      if(this.graphEditor){
         this.graphEditor.updateHandlers();
      }
   };

   this.initActionSequence = function(validation,tree) {
      if(this.actionSequence){
         this.actionSequence = [];
      }
      if(this.input.charAt(this.input.length - 1) != "$"){
         this.input += "$";
      }
      this.input = this.input.replace(/ /g,"");
      var state = this.getInitialState();
      if(state == null){
         return
      }
      var iChar = 0;
      var symbol = this.input.charAt(iChar);
      var error = false;
      var success = false;
      var nLoop = 0;
      var treeIndex = 0;
      // console.log(this.lrTable.states);
      do{
         nLoop++;
         if(this.mode != 3){
            var action = this.lrTable.states[state][symbol];
         }else{
            // console.log(state)
            for(var compState in this.computedStates){
               if(compState == state){
                  var action = this.computedStates[compState][symbol];
                  break;
               }
            }
         }
         // console.log(action);
         if(action /*&& (!this.mode == 3 || this.doesAutomatonAllowAction(state,symbol,action))*/ /*|| tree*/){
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
                     this.actionSequence.push({ actionType: 'accept' });
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
      this.stack = [[this.getInitialState(),"#"]];
      // console.log(this.derivationTree);
      // console.log(this.actionSequence);
      if((this.mode == 2 || this.mode == 5) && !validation){
         this.actionSequence = [];
      }
   };

   this.initParseTable = function() {
      // console.log("initParseTable")
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
      if(this.mode != 3){
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
                     var actionType = state[colLabel[iCol]][0]["actionType"];
                     var actionValue = state[colLabel[iCol]][0]["actionValue"];
                     if(actionType == "r"){
                        var displayedRule = actionValue + 1;
                        html += "<span class=\"ruleMarker\">"+actionType+"<span class=\"ruleMarkerIndex\">"+displayedRule+"</span>"+"</span>";
                     }else{
                        html += actionType+actionValue;
                     }
                  }else if(colLabel[iCol] == "S" && stateID == 0){
                     html += terminalStateIndex;
                  }else if(colLabel[iCol] == "$" && stateID == terminalStateIndex){
                     html += "<span class=\"ruleMarker ruleMarkerIndex\">acc.</span>";
                  }
               }
               html += "</td>";
            }
            html += "</tr>";
         }
      }
      html += "</table>";
      $("#parseTable").append(html);
      if(this.mode == 3){
         this.initStackPreview();
         this.updateParseTable();         
      }else{
         this.initStackPreview();
      }
   };

   this.initStackPreview = function() {
      $("#parseTable").prepend("<div id=\"stackPreview\"></div>");
      stackPreviewH = $("#parseTable").height();
      this.stackPreview = subTask.raphaelFactory.create("stackPreview","stackPreview",stackPreviewW,stackPreviewH);
   };

   this.initParseInfo = function() {
      var html = "<div id=\"rules\"></div><div id=\"action\"></div>";
      $("#parseInfo").html(html);
      this.initRules();
      this.initAction();
   };

   this.initRules = function() {
      var html = "<h3>GRAMMAR</h3>";
      html += "<ul>";
      for(var iRule = 0; iRule < this.rules.length; iRule++){
         var development = (this.grammar.rules[iRule].development[0] == "''") ? "<span class=\"epsilon\">ε</span>" : this.grammar.rules[iRule].development.join(" ");
         var displayedRule = iRule + 1;
         html += "<li class=\"rule\" data_rule=\""+iRule+"\"><span class=\"ruleIndex\">"+displayedRule+
         "</span> <span class=\"nonTerminal\">"+this.grammar.rules[iRule].nonterminal+"</span><i class=\"fas fa-long-arrow-alt-right\"></i><span class=\"development\">"+
         development+"</span></li>";
      }
      html += "</ul>";
      $("#rules").html(html);
   };

   this.initAction = function() {
      if(this.mode < 6){
         this.initPlayer();
         // this.initExplanations();
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

   // this.initExplanations = function() {
   //    var el = $('#lr-explanation');
   //    if(el.length) {
   //       el.html('');
   //    } else {
   //       var div = $("<div id=\"lr-explanation\"></div>").css('margin-top', '0.5em');
   //       $("#action").prepend(div);
   //    }
   // };

      /*
      this.displayExplanation('reduce1', {
         symbol: this.input.charAt(this.inputIndex),
         non_terminal: nonTerminal,
         item: this.grammar.rules[this.selectedRule].toString(),
         popped_states: prevStates.slice(1).join(', '),
         RHS: 'TODO'
      });      
      */   
   this.displayExplanation = function(key, values, concat) {
      var newExpl = key ? this.formatExplanation(key, values) : '';
      if(concat){
         var oldExpl = $('#explanations').html();
         var newExpl = '<p>' + oldExpl + '</p><p>' + newExpl + '</p>';
      }else{
         newExpl = '<p>' + newExpl + '</p>';
      }
      $('#explanations').html(newExpl);
   }

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
         html += "<div id=\"reduceButton\" class=\"actionButton\"><i class=\"fas fa-compress buttonIcon\"></i> <span>REDUCE</span></div>"
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
      var html = "<div id=\"acceptButton\" class=\"actionButton\"><i class=\"fas fa-thumbs-up buttonIcon\"></i> ACCEPT</div>";
      $("#actionInfo").append(html);
   };

   this.initErrorButton = function(){
      var html = "<div id=\"errorButton\" class=\"actionButton\"><i class=\"fas fa-times buttonIcon\"></i> ERROR</div>";
      $("#actionInfo").append(html);
   };

   this.initDerivationTree = function() {
      // console.log("initDerivationTree");
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
      if(this.mode < 6 && this.mode != 2){
         $("#tabs #switchContainer").off("click");
         $("#tabs #switchContainer").click(self.switchTab);
         $(window).resize(self.onResize);
      }
      if(this.mode < 6 && this.mode > 2 /*&& this.mode != 3*/){
         $("#stackPreview").hide();
         $("#parseTable table").hover(
            function(){
               $("#stackPreview").show();
            },function(){
               $("#stackPreview").hide();
            });
      }
      switch(this.mode){
         case 2:
            $("#reduceButton").off("click");
            $("#reduceButton").click(self.reduce);
            // $("#shiftButton").off("click");
            // $("#shiftButton").click(self.shift);
            this.enableShiftButton();
            $(".stackElement").off("click");
            $(".stackElement").click(self.selectStackElement);
            $(".rule").off("click");
            $(".rule").click(self.clickRule);
            $(".rule, .actionButton, #stackTable .stackElement").css({
               cursor: "pointer"
            });
            this.initPlayerHandlers();
            this.enableAcceptButton();
            // $("#acceptButton").off("click");
            // $("#acceptButton").click(self.acceptInput);
            $("#errorButton").off("click");
            $("#errorButton").click(self.refuseInput); 
            break;
         case 3:
            this.initPlayerHandlers();
            this.disableUndoButton();
            break;
         case 4:
            $("#parseTable td[data_state]").off("click");
            $("#parseTable td[data_state]").click(self.clickCell);
            this.initPlayerHandlers();
            break;
         case 5:
            this.initPlayerHandlers();
            $("#acceptButton").off("click");
            $("#acceptButton").click(self.acceptInput);
            $("#errorButton").off("click");
            $("#errorButton").click(self.refuseInput); 
            $("#parseTable td[data_state]").off("click");
            $("#parseTable td[data_state]").click(self.clickCell);
            $("#"+this.divID).off("click");
            $("#"+this.divID).click(self.resetFeedback);
            break;
         case 6:
         case 7:
            for(var iEl in this.treeClickableElements){
               var el = this.treeClickableElements[iEl];
               el.raphObj.attr("cursor","pointer");
               if(this.mode == 6){
                  el.raphObj.unmousedown();
                  el.raphObj.mousedown(self.selectSymbol(iEl));
               }else{
                  el.raphObj.unclick();
                  el.raphObj.click(self.selectSymbol(iEl));
               }
            }
            $(".rule").off("click");
            $(".rule").click(self.clickRule);
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

   this.disableShiftButton = function() {
      $("#shiftButton").off("click");   
      $("#shiftButton").css({opacity:0.7,cursor:"auto"});   
      $("#shiftBar .messageBackground").css({opacity:0.7});   
   };

   this.enableShiftButton = function() {
      $("#shiftButton").off("click");   
      $("#shiftButton").click(this.shift);
      $("#shiftButton").css({opacity:1,cursor:"pointer"});   
      $("#shiftBar .messageBackground").css({opacity:1});   
      // $("#shiftButton").css("cursor","pointer");   
   };

   this.disableAcceptButton = function() {
      $("#acceptButton").off("click");   
      $("#acceptButton").css({opacity:0.7,cursor:"auto"});   
   };
   
   this.enableAcceptButton = function() {
      $("#acceptButton").off("click");  
      $("#acceptButton").click(this.acceptInput); 
      $("#acceptButton").css({opacity:1,cursor:"pointer"});   
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

   this.drawVertex = function(id, info, visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var label = (info.label) ? info.label : "";

      var content = (info.content) ? info.content : "";
      var reductionInfo = false;
      var wCorr = 0;
      if(self.reductionStates.length > 0){
         for(var redData of self.reductionStates){
            if(redData.state == label){
               /* increase box width for reduction marker */
               wCorr = 2*self.reductionMarkerR + 20;
               visualInfo.wCorr = wCorr;
               reductionInfo = redData;
               break;
            }
         }
      }
      if(info.terminal && self.mode != 3){
         wCorr = 50;
         visualInfo.wCorr = wCorr;
         reductionInfo = "acc.";
      }
      var boxSize = this.getBoxSize(content,wCorr);
      var w = boxSize.w;
      var h = boxSize.h;
      var x = pos.x - w/2;
      var y = pos.y - h/2;
      var labelHeight = 2*this.vertexLabelAttr["font-size"];
      var node = this.paper.rect(x,y,w,h).attr(this.rectAttr);
      var header = this.paper.rect(x,y,w,labelHeight + 10).attr(this.rectAttr);
      header.attr("clip-rect",x+" "+y+" "+w+" "+labelHeight);
      // var headerCover = this.paper.rect(x,y + labelHeight,w,10).attr(self.headerCoverAttr);
      var labelRaph = this.paper.text(pos.x, y + labelHeight/2, label).attr(this.vertexLabelAttr);
      var line = this.paper.path("M"+x+","+(y + labelHeight)+"H"+(x + w)).attr(this.boxLineAttr);

      var contentX = pos.x - w/2 + 10;

      var content = this.paper.text(contentX, y + labelHeight + (h - labelHeight)/2,content).attr(this.vertexContentAttr);
      if(info.initial && !info.terminal){
         var initialArrow = this.paper.path("M" + (x - 30) + "," + pos.y + "H" + x).attr(this.lineAttr);
         initialArrow.attr("stroke-width",this.lineAttr["stroke-width"]);
         var result = [node,labelRaph,line,content,header,initialArrow];
      }else if(!info.initial && info.terminal){
         var terminalFrame = this.paper.rect(x - 5, y - 5, w + 10, h + 10, this.circleAttr.r + 5);
         var result = [node,labelRaph,line,content,header,terminalFrame];
      }else if(info.initial && info.terminal){
         var terminalFrame = this.paper.rect(x - 5, y - 5, w + 10, h + 10, this.circleAttr.r + 5);
         var initialArrow = this.paper.path("M" + (x - 2*this.circleAttr.r) + "," + pos.y + "H" + x).attr(this.lineAttr);
         initialArrow.attr("stroke-width",this.lineAttr["stroke-width"]+1);
         var result = [node,labelRaph,line,content,header,initialArrow,terminalFrame];
      }else{
         var result = [node,labelRaph,line,content,header];
      }
      if(reductionInfo){
         if(reductionInfo != "acc."){
            var rule = reductionInfo.rule;
         }
         var attr = self.reductionMarkerAttr;
         var textSize = this.getTextSize(info.content);
         if(reductionInfo != "acc."){
            var x = visualInfo.x + w/2 - self.reductionMarkerR - 10;
         }else{
            var x = visualInfo.x + w/2 - wCorr/2;
         }
         if(textSize.nbLines == 1){
            var y = content.attr("y");
         }else{
            var lines = info.content.split("\n");
            var redIndex;
            for(var iLine = 0; iLine < lines.length; iLine++){
               var line = lines[iLine].trim();
               for (var i = 0, chr; i < line.length; i++) {
                 [chr, i] = getWholeCharAndI(line, i);
               }
               var lastChar = chr;
               if(lastChar == "." || lastChar == dot){
                  redIndex = iLine;
                  break;
               }
            }
            var textBBox = content.getBBox();
            var y = textBBox.y + (textBBox.height/lines.length)*(redIndex + 1/2);
         }
         if(reductionInfo != "acc."){
            var circle = this.paper.circle(x,y,10).attr(attr.circle);
            var text = this.paper.text(x - 1,y,"r").attr(attr.text);
            var displayedRule = rule + 1;
            var ruleObj = this.paper.text(x + 1,y,displayedRule).attr(attr.rule);
            if(self.mode == 2){
               var textBBox = content.getBBox();
               var lines = info.content.split("\n");
               var clickAreaX = contentX;
               var clickAreaY = y - self.reductionMarkerR;
               var clickAreaW = visualInfo.x + w/2 - 10 - contentX;
               var clickAreaH = 2*self.reductionMarkerR;
               var clickArea = this.paper.rect(clickAreaX,clickAreaY,clickAreaW,clickAreaH).attr(self.reductionClickAreaAttr);
               clickArea.click(self.clickReductionMarker(rule,label,id));
               if(self.reductionClickArea[id]){
                  self.reductionClickArea[id].remove();
               }
               self.reductionClickArea[id] = clickArea;
            }
            result.push(circle,text,ruleObj);
         }else{
            var rectW = 35;
            var rectH = 2*self.reductionMarkerR;
            var circle = this.paper.rect(x - rectW/2,y - rectH/2,rectW,rectH).attr(attr.circle);
            var text = this.paper.text(x - 1,y,reductionInfo).attr(attr.acc);
            result.push(circle,text);
         }
      }
      this._addCustomElements(id, result);
      
      return result;
   };

   function getWholeCharAndI(str, i) {
     var code = str.charCodeAt(i);

     if (Number.isNaN(code)) {
       return ''; // Position not found
     }
     if (code < 0xD800 || code > 0xDFFF) {
       return [str.charAt(i), i]; // Normal character, keeping 'i' the same
     }

     // High surrogate (could change last hex to 0xDB7F to treat high private 
     // surrogates as single characters)
     if (0xD800 <= code && code <= 0xDBFF) { 
       if (str.length <= (i+1))  {
         throw 'High surrogate without following low surrogate';
       }
       var next = str.charCodeAt(i+1);
         if (0xDC00 > next || next > 0xDFFF) {
           throw 'High surrogate without following low surrogate';
         }
         return [str.charAt(i)+str.charAt(i+1), i+1];
     }
     // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
     if (i === 0) {
       throw 'Low surrogate without preceding high surrogate';
     }
     var prev = str.charCodeAt(i-1);

     // (could change last hex to 0xDB7F to treat high private surrogates
     // as single characters)
     if (0xD800 > prev || prev > 0xDBFF) { 
       throw 'Low surrogate without preceding high surrogate';
     }
     // Return the next character instead (and increment)
     return [str.charAt(i+1), i+1]; 
   };

   this.getReductionStates = function() {
      /* return array of states containing a reduction marker */
      var attr = this.reductionMarkerAttr;
      var reductionData = [];
      for(var iState = 0; iState <= this.lrTable.states.length; iState++){
         var stateData = this.lrTable.states[iState];
         for(var symbol in stateData){
            if(symbol != "index"){
               var action = stateData[symbol][0];
               if(action.actionType == "r"){
                  reductionData.push({ state: iState, rule: action.actionValue });
                  break;
               }
            }
         }
      }
      return reductionData;
   };

   this.onResize = function() {
      /* switch between table displays */
      // console.log("resize")
      // self.updateParseTableHL();
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
               $("#graphPaper").show();
               $("#parseTable").show();
            }else{
               self.showTab();
            }
         }
      }
      self.updateParseTableHL({action:"resize"});
   };

   this.reset = function() {
      this.stack = [[this.getInitialState(), "#"]];
      this.inputIndex = 0;
      this.updateCursor(false);
      this.simulationStep = 0;
      this.selectedRule = null;
      $(".rule").removeClass("selected");
      this.selectedStackElements = [];
      this.updateStackTable();
      this.updateState(false,"reset");
      this.error = false;
      this.accept = false;

      // this.styleRules();
      // this.styleStackTable();
      // this.styleProgressBar();
      $("#acceptButton, #errorButton").css({
         "background-color": this.colors.blue
      });
   };

   this.runSimulation = function() {
      // console.log(self.computedStates);
      if(self.mode == 3){
         if(self.currentState == null){
            return
         }
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
      if(progress <= 100){
         if(!anim || action.actionType == "error"){
            var animationTime = (step == 0 && this.actionSequence.length <= 1) ? 100 : 0;
            this.clearHighlight();
         }else{
            var animationTime = (action.actionType == "r") ? 4.5*this.animationTime : 1.5*this.animationTime;
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
            // console.log("r");
            self.treeAnim(step,reverse,anim);
            self.clearHighlight();
            var rule = action.rule;
            // console.log(this.grammar.rules[rule])
            var nonTerminal = self.grammar.rules[rule].nonterminal;
            self.updateParseTableHL({
               action: "startReduction",
               nonTerminal: nonTerminal,
               anim: anim,
               rule: rule,
               goto: action.goto
            });
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
            // self.styleStackTable();
            self.selectRule($(".rule[data_rule="+rule+"]"));
            if(anim){
               this.timeOutID = setTimeout(function() {
                  // var nonTerminal = self.grammar.rules[rule].nonterminal;
                  var goto = action.goto || self.getPreviousState();
                  self.applyReduction(nonTerminal,goto,true);
               }, self.animationTime);
            }else{
               // var nonTerminal = self.grammar.rules[rule].nonterminal;
               var goto = action.goto;
               self.applyReduction(nonTerminal,goto,false);
            }
            break;
         case "error":
            self.refuseInput();
            break;
         case 'accept':
            if(self.currentState == self.getTerminalState()){
               if(!self.accept)
                  self.acceptInput();
            } 
      }
   };

   this.treeAnim = function(step,reverse,anim) {
      // console.log("tree");
      if(!this.treeElements[step]){
         return
      }
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
         self.graphEditor.setEnabled(true);
         self.graphEditor.setMultipleEdgesEnabled(false);
         self.graphEditor.setLoopEnabled(false);
         // self.graphEditor.setInitialEnabled(false);
         self.graphEditor.setAllowMultipleTerminal(false);
         self.graphEditor.setAllowMultipleInitial(false);
         self.graphEditor.setAllowSimultaneousInitialAndTerminal(false);
      }
      self.resetParseTableHL();
   };

   this.stepBackward = function() {
      if(self.mode == 2){
         $("#reduceButton span").text("REDUCE");
         $("#reduceButton").off("click");
         $("#reduceButton").click(self.reduce);
      }
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
      self.resetParseTableHL();
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
      this.resetParseTableHL();
      // this.clearHighlight();
   };

   this.selectStackElement = function() {
      self.resetFeedback();
      var col = parseInt($(this).attr("data_col"));
      if(col == 0){
         return
      }

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
      // self.styleStackTable();
   };

   this.clickRule = function() {
      // console.log("select rule")
      self.resetFeedback();
      self.selectRule($(this));
   };

   this.clickReductionMarker = function(rule,state,vID) {
      return function() {
         if(state == self.currentState){
            var ruleObj = $("#rules [data_rule="+rule+"]");
            self.selectRule(ruleObj);
         }else{
            var info = self.graph.getVertexInfo(vID);
            var raphObj = self.visualGraph.getRaphaelsFromID(vID);
            info.selected = !info.selected;
            if(info.selected){
               raphObj[0].attr(self.defaultSelectedVertexAttr);
            }else{
               raphObj[0].attr(self.defaultVertexAttr);
            }
            self.onVertexSelect(vID,info.selected);
            // console.log("click")
         }
      }
   }

   this.selectRule = function(ruleObj) {
      var ruleID = ruleObj.attr("data_rule");
      if(ruleObj.hasClass("selected")){
         ruleObj.removeClass("selected");
         self.selectedRule = null;
         self.highlightReductionMarker(ruleID,false);
      }else{
         $(".rule").removeClass("selected");
         for(var data of self.reductionStates){
            var state = data.state;
            var vID = self.getStateID(state);
            var raphObj = self.visualGraph.getRaphaelsFromID(vID);
            raphObj[5].attr("fill",self.colors.black);
         }
         ruleObj.addClass("selected");
         self.selectedRule = ruleID;
         self.highlightReductionMarker(ruleID,true);
      }
      // self.styleRules();
   };

   this.unselectRules = function() {
      // console.log("uselect rules")
      $(".rule").removeClass("selected");
      self.selectedRule = null;
      // self.styleRules();
   };

   this.highlightReductionMarker = function(rule,selected) {
      // console.log(this.currentState)
      for(var data of this.reductionStates){
         var state = data.state;
         if(rule == data.rule){
            var vID = this.getStateID(state);
            var raphObj = this.visualGraph.getRaphaelsFromID(vID);
            if(selected && state == this.currentState){
               var color = this.colors.blue;
            }else{
               var color = this.colors.black;
            }
            raphObj[5].attr("fill",color);
         }
      }
   };

   this.switchTab = function() {
      $("#"+self.tabTag[self.selectedTab]).removeClass("selectedTab");
      self.selectedTab = 1 - self.selectedTab;
      $("#"+self.tabTag[self.selectedTab]).addClass("selectedTab");
      self.styleTabSwitch();
      self.showTab();
      self.updateParseTableHL({action:"switchTab"});
   };

   this.showTab = function() {
      if(this.selectedTab == 1){
         $("#graphPaper").hide();
         $("#parseTable").show();
      }else{
         $("#graphPaper").show();
         $("#parseTable").hide();
      }
   };

   this.getStateID = function(state) {
      /* get vertex ID from label*/
      if(state == null){
         return false
      }
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
      /* used in mode 2, 6 & 7*/
      self.resetFeedback();
      if(self.simulationStep < self.actionSequence.length){
         self.displayError("You must complete the simulation before performing another action.")
         return
      }
      if(self.mode < 6){
         if(self.selectedRule == null){
            self.displayMessage("reduce","You must select a rule");
         }else if(self.selectedStackElements.length == 0 && self.grammar.rules[self.selectedRule].development[0] != "''"){
            self.displayMessage("reduce","You must select a part of the stack");
         }else if(!self.compareSelectedRuleAndStack()){
            self.displayError("You cannot reduce the selected stack elements with the selected rule");
         }else{
            var nonTerminal = self.grammar.rules[self.selectedRule].nonterminal;
            var previousState = self.getPreviousState();
            if(nonTerminal != "S" && !self.lrTable.states[previousState][nonTerminal]){
               self.displayError("You cannot reduce with the selected rule from this state");
               return
            }
            var goto = (nonTerminal != "S") ? self.lrTable.states[previousState][nonTerminal][0].actionValue : self.getTerminalState();
            self.treeAnim(self.simulationStep,false,true);
            self.applyReduction(nonTerminal,goto,true,true);
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
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         var info = this.graph.getVertexInfo(vertex);
         if(info.terminal){
            return info.label
         }
      }
      return null;
   };

   this.getInitialState = function() {
      if(this.mode != 3){
         return 0
      }else{
         var vertices = this.graph.getAllVertices();
         for(var vertex of vertices){
            var info = this.graph.getVertexInfo(vertex);
            if(info.initial){
               return info.label;
            }
         }
      }
      return null
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
      /* firstStepOnly: for manual reduction in two steps (reduction + goto) */
      // console.log('applyReduction')
      this.clearHighlight();
      var newStackElement = [goto,nonTerminal];
      this.highlightPrevState(this.currentState);
      var prevStates = [this.getPreviousState()];
      for(var col of this.selectedStackElements){
         prevStates.push(this.stack[col][0]);
      }

      this.displayExplanation(false);        
       
      var prevState = prevStates[prevStates.length - 1];  
      var items = this.lrClosureTable.kernels[prevState].items;
      for(var item of items){
         if(item.rule.index == this.selectedRule){
            break;
         }
      }
      // console.log(this.itemToString(item));
      this.gotoInformation = {
         popped_states: prevStates.slice(1).join(','),
         top_state: prevStates[0],
         non_terminal: nonTerminal,
         new_state: goto
      };

      this.displayExplanation('reduce1', {
         symbol: this.input[this.inputIndex],
         non_terminal: nonTerminal,
         item: this.itemToString(item),
         popped_states: prevStates.slice(1).join(','),
         RHS: this.grammar.rules[self.selectedRule].development.join(' ')
      });           
      // console.log("reduc1");

      var state = prevStates.pop();
   

      if(anim){
         this.displayMessage("reduce","REDUCE "+this.selectedRule);
         var animTime = this.animationTime/prevStates.length;
         if(this.mode == 2){
            this.disableShiftButton();
            this.disableAcceptButton();
         }
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
         // this.styleRules();
         this.updateStackTable(false,true);

         this.updateState(anim,"reduction");
         this.arrangeEdgeHL();
      }
   };

   this.reductionAnimLoop = function(state,prevStates,animTime,newStackElement,firstStepOnly) {
      /* firstStepOnly: for manual reduction in two steps */
      if(prevStates.length > 0){
         var prevState = prevStates.pop();
      }else{
         var prevState = state;
      }
      var selectedRule = self.selectedRule;
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
      if(prevStates.length == 0){
         this.currentState = prevState;
         // console.log(state+" "+newStackElement)
         this.updateParseTableHL({action:"reduction",anim:true,newStackElement:newStackElement});
         if(firstStepOnly){
            reduc = false;
            this.waitingForGoto = true;
         }
      }
      this.changeStateAnim(state,prevState,animTime,reduc || self.waitingForGoto,function(){
         self.displayMessage("reduce","REDUCE "+selectedRule);
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
            // console.log(newStackElement)
            self.updateStackTable(firstStepOnly);
            $(".stackElement[data_col="+selectedCol+"]").hide();
            $(".stackElement[data_col="+selectedCol+"]").fadeIn(self.animationTime,function(){
               if(!$(this).hasClass("State")){
                  /* prevent double callback */
                  return
               }
               // console.log("goto");
               if(!firstStepOnly){
                  self.goto(newStackElement[0]);
                  self.arrangeEdgeHL();
               }else{
                  $("#reduceButton span").text("GOTO");
                  $("#reduceButton").off("click");
                  $("#reduceButton").click(self.clickGoto(newStackElement[0],selectedRule));
               }
            });
            $(".stackElement.State[data_col="+selectedCol+"]").text("");
         }
      });
   };

   this.clickGoto = function(goto,rule) {
      return function() {
         if(self.selectedState == null){
            self.displayMessage("reduce","You must select a state in the automaton");
         }else if(self.selectedState != goto){
            self.displayError("Wrong goto state");
         }else{
            self.actionSequence.push({
               actionType: "r",
               rule: rule,
               goto: goto
            });
            self.simulationStep++;
            self.currentState = goto;
            // console.log("goto 1998");
            self.goto(goto);
            self.saveAnswer();
            $("#reduceButton span").text("REDUCE");
            $("#reduceButton").off("click");
            $("#reduceButton").click(self.reduce);
         }
      }
   };

   this.goto = function(newState) {
      // console.log("goto "+newState)
      this.displayExplanation('reduce2', this.gotoInformation, true); 
      var col = this.stack.length - 1;
      $(".stackElement.State[data_col="+col+"]").text(newState);
      $(".stackElement.State[data_col="+col+"]").css("opacity",0);
      $(".stackElement.State[data_col="+col+"]").animate({opacity:1},self.animationTime);
      self.highlightRule(self.selectedRule);
      self.updateState(true,"goto");
      self.displayMessage("reduce","GOTO "+newState);
      // console.log(prevStates,nonTerminal);
      // self.displayExplanation('reduce2', {
      //    popped_states: prevStates.slice(1).join(', '),
      //    non_terminal: nonTerminal,
      //    top_state: prevStates[0],
      //    new_state: newState
      // }); 
      self.currentVertex = self.getStateID(newState);
      self.arrangeEdgeHL();
      if(this.mode == 2){
         self.enableShiftButton();
         self.enableAcceptButton();
      }
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

      // this.styleStackTable();
      this.updateState(false,"reverseReduction");

   };

   /* SHIFT */

   this.shift = function() {
      self.resetFeedback();
      if(self.simulationStep < self.actionSequence.length){
         self.displayError("You must complete the simulation before performing another action.")
         return
      }
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
      this.displayExplanation('shift', {
         symbol: this.input[this.inputIndex],
         state: newState
      });
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
         this.highlightPrevState(this.currentState);
      }
      this.selectedStackElements = [];
      this.updateStackTable(false,!anim);
      this.updateCursor(!(reverse || !anim));
      this.updateState(!(reverse || !anim),"shift");
   };

   this.updateStackTable = function(noGoto,noAnim) {
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
      // this.styleStackTable();
      if(this.mode == 2){
         $(".stackElement").off("click");
         $(".stackElement").click(self.selectStackElement);
      }
      if(!noGoto){   // reduc in mode 5
         this.currentState = this.stack[this.stack.length - 1][0];
         this.currentVertex = this.getStateID(this.currentState);
      }
      if(this.showLog){
         this.updateLogTable(noAnim);
      }
   };

   this.updateLogTable = function(noAnim) {
      var step = this.simulationStep;
      var stackStr = '';
      var inputStr = this.input.slice(this.inputIndex);
      if(this.stack.length < 2){
         $('#logTable .logLine').remove();
      }
      if(noAnim === true || this.stack.length < 2){
         var action = this.actionSequence[step];
      }else{
         var action = this.actionSequence[step + 1];
      }
      var actionStr = action.actionType;
      if(actionStr == 's'){
         actionStr += action.state;
      }else if(actionStr == 'r'){
         actionStr += (action.rule + 1);
      }
      for(var stack of this.stack){
         stackStr += '<code>'+stack[1]+'</code>'+stack[0];
      }
      var newLine = '<tr class="logLine"><td>'+stackStr+'</td><td><code>'+inputStr+'</code></td><td>'+actionStr+'</td>';
      $('#logTable tbody').append(newLine)
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
         $("#cursor, #treeCursor").animate({left:newX+"px"},this.animationTime,function() {
            self.updateInputColor();
         });
      }else{
         $("#cursor, #treeCursor").css({left:newX+"px"});
         this.updateInputColor();
      }
   };

   this.updateInputColor = function() {
      $("#inputBar .inputChar").each(function(index) {
         if(index < self.inputIndex){
            $(this).addClass("read");
         }else{
            $(this).removeClass("read");
         }
      });
      // self.styleInput();
   };

   /* HIGHLIGHT */

   this.highlightPrevState = function(previousState) {
      var vertex = this.getStateID(previousState);
      var raphObj = this.visualGraph.getRaphaelsFromID(vertex);
      // var x = raphObj[0].attr("x");
      // var y = raphObj[0].attr("y");
      var pos = this.visualGraph.getVertexVisualInfo(vertex);
      var width = raphObj[0].attr("width");
      var height = raphObj[0].attr("height");
      var r = raphObj[0].attr("r");
      this.prevStateHighlight = this.paper.rect(pos.x - width/2,pos.y - height/2,width,height,r).attr(this.previousStateAttr)
   };

   this.highlightEdge = function(edgeID,back) {
      if(!edgeID){
         return;
      }
      // console.log("HL edge "+edgeID+" "+back)
      var attr = this.edgeHighlightAttr;
      var raphObj = this.visualGraph.getRaphaelsFromID(edgeID); 
      var edgeHL = raphObj[0].clone();
      if(back){
         edgeHL.attr(attr.bwd);
      }else{
         edgeHL.attr(attr.fwd);
      }
      edgeHL.toBack();
      raphObj[1].toBack();
      raphObj[0].toBack();
      var type = (back) ? "bwd" : "fwd";
      if(!this.pathHighlight[edgeID]){
         this.pathHighlight[edgeID] = {};
      }else if(this.pathHighlight[edgeID][type]){
         this.pathHighlight[edgeID][type].remove();
      }
      this.pathHighlight[edgeID][type] = edgeHL;  
   };

   this.highlightReductionPath = function(state,prevStates) {
      var prevStates = JSON.parse(JSON.stringify(prevStates));
      do{
         var vertexID = this.getStateID(state);
         var prevState = prevStates.pop();
         var prevVertexID = this.getStateID(prevState);
         var edgeID = this.graph.getEdgesBetween(prevVertexID,vertexID)[0];
         this.highlightEdge(edgeID,true);
         state = prevState;
      }while(prevStates.length > 0)
   };

   this.arrangeEdgeHL = function() {
      /* put fwd HL in front of bwd HL */
      for(var edgeID in this.pathHighlight){
         var raphObj = this.visualGraph.getRaphaelsFromID(edgeID); 
         var elem = this.pathHighlight[edgeID];
         if(elem["bwd"] && elem["fwd"]){
            elem["fwd"].attr("stroke-dasharray","- ").toBack();
            elem["bwd"].toBack();
         }
         raphObj[1].toBack();
         raphObj[0].toBack();
      }
   }; 

   this.highlightRule = function(rule) {
      $(".rule").removeClass("selected");
      $(".rule[data_rule="+rule+"]").addClass("previousRule");
      self.selectedRule = null;
      // self.styleRules();
      self.highlightReductionMarker(rule,false);
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
      for(var edge in this.pathHighlight){
         var edgeHL = this.pathHighlight[edge];
         for(var dir in edgeHL){
            if(edgeHL[dir]){
               edgeHL[dir].remove();
               delete edgeHL[dir];
            }
         }
      }
      if(this.stackElementsHL.length > 0){
         for(var elem of this.stackElementsHL){
            elem.remove();
         }
         this.stackElementsHL = [];
      }
      $(".rule").removeClass("previousRule");
      // this.styleRules();
   };

   this.resetParseTableHL = function() {
      // console.log("reset")
      this.styleParseTable();
      if(this.gotoColHL){
         self.gotoColHL.remove();
         self.gotoColHL = null;
         self.removeGotoColHL = false;
      }
   };

   this.updateParseTableHL = function(data) {
      if(this.mode == 3){
         if($("#parseTable td[data_state=\""+this.currentState+"\"]").length == 0){
            if(this.rowHL){
               this.rowHL.remove();
               this.rowHL = null;
            }
            if(this.colHL){
               this.colHL.remove();
               this.colHL = null;
            }
            this.updateStackPreview();
            return
         }
      }
      if(data){
         var anim = data.anim;
         var newStackElement = data.newStackElement;
         var nonTerminal = data.nonTerminal;
         var action = data.action;
      }
      // console.log("updateParseTable "+action+" "+anim);
      if(!this.rowHL && this.mode != 4){
         this.rowHL = $("<div id=\"rowHL\"></div>");
         $("#parseTable").append(this.rowHL);
         this.rowHL.css(this.cellHighlightAttr);
      }
      if(!this.colHL && this.mode != 4){
         this.colHL = $("<div id=\"colHL\"></div>");
         $("#parseTable").append(this.colHL);
         this.colHL.css(this.cellHighlightAttr);
      }
      var tableW = $("#parseTable table").width();
      var tableH = $("#parseTable table").height();
      var tablePos = $("#parseTable table").position();
      var tableMarginLeft = ($("#parseTable").width() - tableW)/2;
      var actionH = $("#parseTable table th:nth-child(2)").outerHeight();
      var rowH = $("#parseTable td[data_state=\""+this.currentState+"\"]").outerHeight();
      var colW = $("#parseTable td[data_symbol=\""+this.input[this.inputIndex]+"\"]").outerWidth();
      var rowTop = 0;
      if($("#parseTable td[data_state=\""+this.currentState+"\"]").position()){
         rowTop = $("#parseTable td[data_state=\""+this.currentState+"\"]").position().top;
      }
      var colLeft = 0;
      if($("#parseTable td[data_symbol=\""+this.input[this.inputIndex]+"\"]").position()){
         var colLeft = $("#parseTable td[data_symbol=\""+this.input[this.inputIndex]+"\"]").position().left;
      }

      if(action == "startReduction" && anim){
         /* column selector change color + goto column selector appears */
         this.updateStackPreview(data.rule,data.goto);
         if(this.removeGotoColHL){
            this.removeGotoColHL = false;
            this.gotoColHL.remove();
            this.styleParseTable();
         }
         this.colHL.css("border-color",this.colors.lightBlue);
         this.gotoColHL = $("<div id=\"gotoColHL\"></div>");
         $("#parseTable").append(this.gotoColHL);
         this.gotoColHL.css(this.cellHighlightAttr);
         var gotoColW = $("#parseTable td[data_symbol=\""+nonTerminal+"\"]").outerWidth();
         var gotoColLeft = $("#parseTable td[data_symbol=\""+nonTerminal+"\"]").position().left;
         var gotoColAttr = {
            width: gotoColW - 4,
            height: tableH - 4 - actionH,
            top: actionH,
            left: gotoColLeft - 2
         };
         this.gotoColHL.css(gotoColAttr);
         this.gotoColHL.hide();
         this.gotoColHL.fadeIn(this.animationTime);
         return
      }

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

      if(this.mode != 4 && this.mode != 2){
         if(!anim){
            this.rowHL.css(newRowAttr);
            this.colHL.css(newColAttr);
         }else{
            var tempState = this.currentState;

            if(action == "goto"){
               this.removeGotoColHL = true;
               this.gotoColHL.fadeOut(this.animationTime);
            }
            this.rowHL.animate(newRowAttr,this.animationTime,function(){
               // console.log("end anim "+action);
               if(newStackElement){
                  $("#parseTable [data_state="+tempState+"][data_symbol="+newStackElement[1]+"]").css({
                     "background-color": self.colors.blue,
                     color: "white" });
               }else if(self.gotoColHL && action == "goto" && self.removeGotoColHL){
                  // console.log("remove goto")
                  self.gotoColHL.remove();
                  self.gotoColHL = null;
                  self.styleParseTable();
                  self.removeGotoColHL = false;
               }
            });
            this.colHL.animate(newColAttr,this.animationTime);
         }
      }
      // console.log(this.inputIndex+" "+this.input)
      if(!newStackElement){
         this.updateStackPreview();
      }
   };

   this.updateStackPreview = function(rule,goto) {
      var attr = this.stackPreviewAttr;
      var localStack = JSON.parse(JSON.stringify(this.stack));
      if(rule || rule == 0){
         this.stackPreviewElements.circle.attr(attr.previousCircle);
         this.stackPreviewElements.line.attr(attr.previousLine);
         this.stackPreviewElements.letterCircle.attr(attr.previousSymbolCircle);
         this.stackPreviewElements.letter.attr(attr.previousSymbol);
         var ruleData = this.grammar.rules[rule];
         var dev = ruleData.development;
         var nonTerminal = ruleData.nonterminal;
         var newStackElement = [goto,nonTerminal];
         var index = localStack.length - dev.length;
         localStack.splice(index,dev.length,newStackElement);
      }else{
         this.stackPreview.clear();
      }
      var tableW = $("#parseTable table").width();
      var tableH = $("#parseTable table").height();
      var tablePos = $("#parseTable table").position();
      var tableMarginLeft = ($("#parseTable").width() - tableW)/2;
      var headerH = $("#parseTable table th:first-child").outerHeight();
      stackPreviewH = tableH + 4;
      stackPreviewW = Math.max(localStack.length,this.stack.length)*attr.colW;
      this.stackPreview.setSize(stackPreviewW,stackPreviewH);
      $("#stackPreview").css({
         position: "absolute",
         top: 0,
         left: tableMarginLeft - stackPreviewW - 2
      });
      this.stackPreview.rect(0,headerH,stackPreviewW,stackPreviewH - headerH).attr(attr.background).toBack();
      var lastPos = null;
      var x = stackPreviewW/2;

      // this.stackPreview.setStart();
      this.stackPreviewElements = {circle:this.stackPreview.set(),line:this.stackPreview.set(),letterCircle:this.stackPreview.set(),letter:this.stackPreview.set()};
      for(var iElem = 0; iElem < localStack.length; iElem++){
         var elem = localStack[iElem];
         var state = elem[0];
         var symbol = elem[1];
         var line = $("#parseTable td[data_state=\""+state+"\"]");
         if(line.length > 0){
            var x = (iElem + 1/2)*attr.colW;
            var y = line.position().top + line.outerHeight()/2;
            var circle = this.stackPreview.circle(x,y).attr(attr.circle);
            this.stackPreviewElements.circle.push(circle);
            if(lastPos){
               var line = this.stackPreview.path("M"+lastPos.x+" "+lastPos.y+",L"+x+" "+y).attr(attr.line);
               var xSymbol = (x + lastPos.x)/2;
               var ySymbol = (y + lastPos.y)/2;
               var letterCircle = this.stackPreview.circle(xSymbol,ySymbol).attr(attr.symbolCircle);
               var letter = this.stackPreview.text(xSymbol,ySymbol,symbol).attr(attr.symbol);
               this.stackPreviewElements.line.push(line);
               this.stackPreviewElements.letterCircle.push(letterCircle);
               this.stackPreviewElements.letter.push(letter);
            }
            lastPos = { x: x, y: y };
         }
      }
      // this.stackElements = this.stackPreview.setFinish();
   };

   /* UPDATE PARSE TABLE (mode 3) */

   this.updateParseTable = function() {
      // console.log("update Parse table");
      // console.log(this.grammar);
      this.clearParseTable();
      this.computedStates = {};
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         this.addLineToParseTable(vertex);
      }
      for(var vertex of vertices){
         var info = this.graph.getVertexInfo(vertex);
         this.computedStates[info.label] = {};
         var children = this.graph.getChildren(vertex);
         if(children.length > 0){
            for(var child of children){
               var gotoOrShift = this.gotoOrShift(vertex,child);
               if(gotoOrShift){
                  var childInfo = this.graph.getVertexInfo(child);
                  this.addGotoOrShift(gotoOrShift,info.label,childInfo.label);
                  var action = (!this.grammar.terminals.includes(gotoOrShift)) ? "goto" : "shift";
                  this.addComputedState({
                     state1: info.label,
                     symbol: gotoOrShift,
                     state2: childInfo.label,
                     action: action
                  });
                  if(childInfo.terminal && gotoOrShift == this.grammar.axiom){
                     this.addAccept(childInfo.label);
                  }
               }
            }
         }
         var rule = this.findReduction(vertex);
         if(rule !== false){
            var nonTerminal = this.grammar.rules[rule].nonterminal;
            var follows = this.grammar.follows[nonTerminal];
            this.addReduction(rule,follows,info.label);
            this.addComputedState({
               state1: info.label,
               rule: rule,
               follows: follows,
               action: "reduction"
            });
         }
      }
      this.styleParseTable();
      // this.updateStackPreview();
      this.updateParseTableHL();
   };

   this.clearParseTable = function() {
      $("#parseTable table tr").each(function(index) {
         if(index > 1){
            $(this).remove();
         }
      });
   };

   this.addLineToParseTable = function(vertex) {
      var vInfo = this.graph.getVertexInfo(vertex);
      var state = vInfo.label;
      var html = "<tr><td data_state="+state+">"+state+"</td>";
      $("#parseTable table tr:nth-child(2) th").each(function(index) {
         var symbol = $(this).text();
         html += "<td data_state="+state+" data_symbol="+symbol+"></td>";
      });
      html += "</tr>";
      $("#parseTable table").append(html);
   };

   this.gotoOrShift = function(vertex,child) {
      var edges = this.graph.getEdgesFrom(vertex,child);
      var edge = edges[0];
      var edgeInfo = this.graph.getEdgeInfo(edge);
      var edgeLabel = edgeInfo.label;
      if(edgeLabel.length == 1){
         var vertexContent = this.readContent(vertex);
         if(!vertexContent){
            return false
         }
         var childContent = this.readContent(child);
         if(!childContent){
            return false
         }
         for(var vertexLine of vertexContent){
            for(var childLine of childContent){
               if(vertexLine.nonTerminal == childLine.nonTerminal && vertexLine.development.length == childLine.development.length){
                  var match = true;
                  for(var symbol of vertexLine.development){
                     if(!childLine.development.includes(symbol)){
                        match = false;
                        break;
                     }
                  }
                  var vertexDot = vertexLine.development.indexOf(dot);
                  var childDot = childLine.development.indexOf(dot);
                  if(match && vertexDot == childDot - 1 
                     && vertexLine.development[childDot] == edgeLabel
                     && childLine.development[vertexDot] == edgeLabel){
                        return edgeLabel
                  }
               }
            }
         }
      }
      return false
   };

   this.findReduction = function(vertex) {
      var vertexContent = this.readContent(vertex);
      if(vertexContent.length > 0){
         for(var vertexLine of vertexContent){
            if(vertexLine.development[vertexLine.development.length - 1] == dot){
               var rule = this.findRule(vertexLine);
               // console.log("rule:"+rule+" state:"+this.graph.getVertexInfo(vertex).label);
               if(rule !== false){
                  var ruleData = this.grammar.rules[rule];
                  if(ruleData.development.length == 1 && ruleData.development[0] == "''"){
                     return rule
                  }
                  var parents = this.graph.getParents(vertex);
                  for(var parent of parents){
                     var findReductionPath = this.findReductionPath(vertex,parent,vertexLine,rule);
                     if(findReductionPath){
                        return rule;
                     }
                  }
               }            
            }
         }
      }
      return false
   };

   this.findRule = function(line) {
      for(var rule of this.grammar.rules){
         if(line.nonTerminal == rule.nonterminal){
            var dev = JSON.parse(JSON.stringify(line.development));
            var dotIndex = dev.indexOf(dot);
            dev.splice(dotIndex,1);
            var match = true;
            if(rule.development.length == 1 && rule.development[0] == "''" && dev.length == 0){
               return rule.index
            }
            if(dev.length != rule.development.length){
               match = false;
            }else{
               for(var iSymbol = 0; iSymbol < rule.development.length; iSymbol++){
                  if(rule.development[iSymbol] != dev[iSymbol]){
                     match = false;
                     break;
                  }
               }
            }
            if(match){
               return rule.index;
            }
         }
      }
      return false;
   };

   this.findReductionPath = function(vertex,parent,vertexLine,rule) {
      var edges = this.graph.getEdgesFrom(parent,vertex);
      var edge = edges[0];
      var edgeInfo = this.graph.getEdgeInfo(edge);
      var edgeLabel = edgeInfo.label;
      if(edgeLabel.length != 1){
         return false
      }else{
         var parentContent = this.readContent(parent);
         for(var parentLine of parentContent){
            if(vertexLine.nonTerminal == parentLine.nonTerminal && vertexLine.development.length == parentLine.development.length){
               var match = true;
               var dotIndex = parentLine.development.indexOf(dot);
               if(dotIndex != vertexLine.development.indexOf(dot) - 1){
                  match = false;
               }else{
                  var dev = JSON.parse(JSON.stringify(parentLine.development));
                  dev.splice(dotIndex,1);
                  var ruleData = this.grammar.rules[rule];
                  for(var iSymbol = 0; iSymbol < ruleData.development.length; iSymbol++){
                     if(ruleData.development[iSymbol] != dev[iSymbol]){
                        match = false;
                        break;
                     }
                  }
               }
               if(match){
                  if(dotIndex == 0){
                     return true;
                  }else{
                     var grandparents = this.graph.getParents(parent);
                     for(var grandparent of grandparents){
                        var findPath = this.findReductionPath(parent,grandparent,parentLine,rule);
                        if(findPath){
                           return findPath;
                        }
                     }
                  }
               }
            }
         }
      }
      return false;
   };

   this.addGotoOrShift = function(symbol,state1,state2) {
      if(this.grammar.terminals.includes(symbol)){
         var text = "s"+state2;
      }else{
         var text = state2;
      }
      $("#parseTable [data_state="+state1+"][data_symbol=\""+symbol+"\"]").text(text);
   };

   this.addReduction = function(rule,follows,state) {
      var displayedRule = rule + 1;
      var html = "<span class=\"ruleMarker\">r<span class=\"ruleMarkerIndex\">"+displayedRule+"</span></span>";
      for(var follow of follows){
         $("#parseTable [data_state="+state+"][data_symbol=\""+follow+"\"]").html(html);
      }
   };

   this.addAccept = function(state) {
      var html = "<span class=\"ruleMarker\"><span class=\"ruleMarkerIndex\">acc.</span></span>";
      $("#parseTable [data_state="+state+"][data_symbol=\"$\"]").html(html);
   };

   this.addComputedState = function(data) {
      switch(data.action){
         case "shift":
            var actionType = "s";
            var actionValue = data.state2;
            break;
         case "goto":
            var actionType = "";
            var actionValue = data.state2;
            break;
         case "reduction":
            var actionType = "r";
            var actionValue = data.rule;
      }
      if(data.action != "reduction"){
         this.computedStates[data.state1][data.symbol] = [{
            actionType: actionType,
            actionValue: actionValue
         }];
      }else{
         for(var follow of data.follows){
            this.computedStates[data.state1][follow] = [{
               actionType: actionType,
               actionValue: actionValue
            }];
         }
      }
   };

   /**/

   this.updateState = function(anim,action) {
      var id = this.getStateID(this.currentState);
      // console.log("updateState "+anim)
      this.updateParseTableHL({anim:anim,action:action});
      this.resetStates();
      if(!id){
         return;
      }
      var previousState = (this.stack.length > 1) ? this.stack[this.stack.length - 2][0] : null;
      if(!anim){
         this.styleVertex(id,"current");
         if(previousState != null){
            var id1 = this.getStateID(previousState);
            var edgeID = this.graph.getEdgesBetween(id1,id)[0];
            this.highlightEdge(edgeID);
         }
      }else{
         // var previousState = this.stack[this.stack.length - 2][0];
         // var animTime = (action == "shift") ? this.animationTime*0.8 : this.animationTime;
         this.changeStateAnim(previousState,this.currentState,this.animationTime);
      }
      // if(this.currentState == this.getTerminalState()){
      //    if(!this.accept)
      //       this.acceptInput();
      // }     
   };

   this.changeStateAnim = function(state1,state2,time,reduction,callback) {
      var id2 = this.getStateID(state2);
      var id1 = this.getStateID(state1);
      var vInfo1 = this.visualGraph.getVertexVisualInfo(id1);
      var vInfo2 = this.visualGraph.getVertexVisualInfo(id2);
      var edgeID = this.graph.getEdgesBetween(id1,id2)[0];
      var edgeVisualInfo = this.visualGraph.getEdgeVisualInfo(edgeID);
      var initPos = vInfo1;
      var finalPos = vInfo2;
      this.highlightEdge(edgeID,reduction);
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
      self.styleVertex(id1,"default");
      if(this.token){
         this.token.remove();
      }
      this.token = this.paper.circle(initPos.x,initPos.y,10).attr({"fill":this.colors.blue,"stroke": "none"});
      if(!edgeVisualInfo["radius-ratio"]){
         var anim1 = new Raphael.animation(step1,time,function(){
            self.resetStates();
            if(!reduction){
               self.styleVertex(id2,"current");
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
               self.styleVertex(id2,"current");
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
         this.styleVertex(vertexID,"default");
         info.selected = false;
         this.graph.setVertexInfo(vertexID,info);
      }
      this.selectedState = null;
      if(this.mode == 2){
         this.graphEditor.vertexDragAndConnect.selectionParent = null;
      }
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
         } else {
            this.displayExplanation('accepted', {
               state: this.currentState,
               base_reduction_item: this.stack[this.stack.length - 1][1]
            });            
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
         } else {
            this.displayExplanation('error', {
               symbol: this.input[this.inputIndex],
               state: this.currentState
            });         
         }
      }else{
         $("#errorButton").css({
            "background-color": self.colors.blue
         });
         $("#errorMessage").parent().css({
            "background-color": self.colors.blue
         });
         this.displayExplanation('not_accepted');                              
      }
      self.saveAnswer();
   };

   /** AUTOMATON **/

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
      /* return the rule and dot index (validation) */
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
      // console.log("graphEditorCallback ")
      self.clearHighlight();
      self.pauseSimulation(null,true);
      self.resetFeedback();
      self.actionSequence = [];
      self.reset();

      // self.formatContent();
      // self.graphEditor.resizeTableVertex(vertex,info.content);
      // self.initActionSequence();
      // self.updateStackTable();
      self.saveAnswer();
      self.isLastActionAGraphEdit = true;
      self.updateParseTable();
      self.derivationTree = [];
      self.initActionSequence(false,true);
      self.styleDerivationTree();
      self.showUndo();
      // console.log(self.computedStates);
      if(answer.visualGraphJSON.length > 1){
         self.enableUndoButton()
      }
   };

   this.selectVertexCallback = function(id,selected) {
      // console.log(id+" "+selected)
      var current = self.getStateID(self.currentState);
      if(!selected && id == current){
         self.styleVertex(id,"current");
      }
      if(selected){
         self.styleVertex(id,"selected");
      }
   };

   this.onVertexSelect = function(ID,selected) {
      // console.log("onVertexSelect"+" "+ID+" "+selected)
      var info = self.graph.getVertexInfo(ID);
      var stateVertex = self.visualGraph.getRaphaelsFromID(ID);
      if(selected){
         self.selectedVertex = ID;
         self.selectedState = info.label;
         stateVertex[4].attr(self.defaultSelectedVertexAttr);
      }else{
         self.selectedVertex = null;
         self.selectedState = null;
         stateVertex[4].attr(self.headerAttr);
         if(self.prevStateHighlight){
            self.prevStateHighlight.toFront();
         }
      }
      self.resetFeedback();
      if(ID == self.getStateID(self.currentState)){
         self.styleVertex(ID,"current");
         if(selected){
            self.styleVertex(ID,"selected");
         }
      }
      if(self.reductionClickArea[ID]){
         self.reductionClickArea[ID].toFront();
      }
   };

   this.formatContent = function() {
      var vertices = this.graph.getAllVertices();
      for(var vertex of vertices){
         this.formatVertexContent(vertex);
      }
   };

   this.formatVertexContent = function(vertex) {
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
      }
   };

   this.contentValidation = function(content,id) {
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

   this.vertexLabelValidation = function(id,label) {
      if(label.length == 0 || label.length > 2) {
         return false
      }
      var vertices = self.graph.getAllVertices();
      for(var vertex of vertices){
         var info = self.graph.getVertexInfo(vertex);
         if(vertex != id && info.label == label){
            return false
         }
      }
      return true
   };

   this.writeContentCallback = function(id,edited) {
      self.formatVertexContent(id);
      if(edited){
         self.visualGraph.redraw();
         self.graphEditor.updateHandlers();
      }
   };

   this.resizeTableVertexCallback = function(id,vertexPos,newBoxSize) {
      var info = self.graph.getVertexInfo(id);
      var raphObj = self.visualGraph.getRaphaelsFromID(id);
      if(info.terminal){
         raphObj[5].transform("");
         raphObj[5].attr({
            x: vertexPos.x - newBoxSize.w/2 - 5,
            y: vertexPos.y - newBoxSize.h/2 - 5,
            height: newBoxSize.h + 10,
            width: newBoxSize.w + 10
         });
      }
      if(info.initial){
         raphObj[5].hide();
      }
      raphObj[4].transform("");
      raphObj[4].attr({
         x: vertexPos.x - newBoxSize.w/2 ,
         y: vertexPos.y - newBoxSize.h/2 ,
         width: newBoxSize.w,
         "clip-rect": (vertexPos.x - newBoxSize.w/2)+" "+(vertexPos.y - newBoxSize.h/2)+" "+newBoxSize.w+" "+2*self.vertexLabelAttr["font-size"]
      });
      
   };

   this.styleVertex = function(id,styleType) {
      // console.log(id+" "+styleType)
      var vertex = this.visualGraph.getRaphaelsFromID(id);
      switch(styleType){
         case "current":
            vertex[0].attr(this.defaultCurrentStateAttr);
            vertex[4].attr(this.currentHeaderAttr);
            break;
         case "selected":
            vertex[0].attr(this.defaultSelectedVertexAttr);
            vertex[4].attr(this.defaultSelectedVertexAttr);
            break;
         default:
            vertex[0].attr(this.defaultVertexAttr);
            vertex[4].attr(this.headerAttr);
      }
      vertex[1].toFront();
   };

   this.startDragCallback = function(id) {
      var vertex = self.visualGraph.getRaphaelsFromID(id);
      vertex[1].toFront();
      vertex[2].toFront();
   };

   this.moveDragCallback = function(id) {
      var vertex = self.visualGraph.getRaphaelsFromID(id);
      var labelHeight = 2*self.vertexLabelAttr["font-size"];
      var w = vertex[0].attr("width");
      var h = vertex[0].attr("height");
      var xRect = vertex[0].attr("x");
      var yRect = vertex[0].attr("y");

      vertex[4].attr("clip-rect",xRect+" "+yRect+" "+w+" "+labelHeight);
   };

   this.graphDraggerMoveDragCallback = function() {
      var vertices = self.graph.getAllVertices();
      for(var vertex of vertices){
         self.moveDragCallback(vertex);
      }
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
         });
      }else{
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
               var displayedRule = cellContent[1];
               var rule = displayedRule - 1;
               var nonTerminal = self.grammar.rules[rule].nonterminal;
               self.treeAnim(self.simulationStep,false,true);
               var nbRedChar = (self.grammar.rules[rule].development[0] == "''") ? 0 : self.grammar.rules[rule].development.length;
               var startIndex = self.stack.length - nbRedChar;
               for(var iSelCol = 0; iSelCol < nbRedChar; iSelCol++){
                  var index = startIndex + iSelCol;
                  $(".stackElement[data_col="+index+"]").addClass("selected");
                  self.selectedStackElements.push(index);
               }
               // self.styleStackTable();
               $(".rule").removeClass("selected");
               $(".rule[data_rule="+rule+"]").addClass("selected");
               self.selectedRule = rule;
               // self.styleRules();
               var previousState = self.getPreviousState();
               var goto = (nonTerminal != "S") ? self.lrTable.states[previousState][nonTerminal][0].actionValue : self.getTerminalState();
               self.updateParseTableHL({anim:true,action:"startReduction",nonTerminal:nonTerminal});
               self.simulationStep++;
               self.applyReduction(nonTerminal,goto,true,true);
            }else{   // goto
               self.actionSequence.push({
                  actionType: "r",
                  rule: self.selectedRule,
                  goto: cellContent
               });
               self.currentState = cellContent;
               // console.log("goto 3409");
               self.goto(cellContent);
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
               if(state[symbol][0].actionType == "r"){
                  var expected = "r"+(state[symbol][0].actionValue + 1);
               }else{
                  var expected = state[symbol][0].actionType+state[symbol][0].actionValue;
               }
               if(answer[state.index][symbol] != expected){
                  console.log(expected)
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

   /** derivation tree **/

   this.updateTree = function() {
      // console.log("updateTree");
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
      // console.log("displayTree");
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
         // console.log("click");
         // console.log(self.selectedSymbolIndices);
         index = parseFloat(index);
         self.resetFeedback();
         var selectedElement = self.treeClickableElements[index];
         var selected = selectedElement.selected;
         var x = selectedElement.raphObj[0].attr("cx");
         var y = selectedElement.raphObj[0].attr("cy");
         var r = self.treeCharSize * 0.7;
         // if(self.mode == 6){
         //    // var selectedIndices = self.getSelectedIndices();
         //    self.selectedSymbolIndices.push(index);
         // }
         if(self.treeSelectionMarker){
            self.treeSelectionMarker.remove();
         }

         if(selected){
            if(self.mode == 6){
               for(var i of self.selectedSymbolIndices){
                  // console.log("deselect "+i)
                  self.selectElement(self.treeClickableElements[i],false);
                  self.treeClickableElements[i].raphObj.unhover();
               }
               self.selectedSymbolIndices = [];
               // for(var iEl in self.treeClickableElements){
               //    self.selectElement(self.treeClickableElements[iEl],false);
               //    self.treeClickableElements[iEl].raphObj.unhover();
               // }
            }else{
               self.selectElement(selectedElement,false);
            }
         }else{
            self.selectedSymbolIndices = [];
            for(var iEl in self.treeClickableElements){
               // console.log("deselect "+iEl)
               self.selectElement(self.treeClickableElements[iEl],false);
               if(iEl != index && self.mode == 6){
                  self.treeClickableElements[iEl].raphObj.hover(self.hoverIn(iEl),self.hoverOut(iEl));
               }
               $(window).mouseup(self.dragEnd);
            }
            self.selectedSymbolIndices.push(index);   
            self.selectElement(selectedElement,true);
            self.treeSelectionMarker = self.treePaper.circle(x,y,r).attr(self.treeSelectionMarkerAttr).toBack();
         }
         
      }
   };

   this.hoverIn = function(id) {
      id = parseInt(id);
      return function() {
         if(Beav.Array.has(self.selectedSymbolIndices,id)){
            return
         }else{
            self.selectedSymbolIndices.push(id);
            self.selectElement(self.treeClickableElements[id],true);
            self.updateTreeSelection();

         }
      }
   };

   this.hoverOut = function(id) {
      return function() {

      }
   };

   this.updateTreeSelection = function() {
      var orderedSelectedIndices = self.selectedSymbolIndices.sort(function(a,b){return (a - b)});
      // console.log(orderedSelectedIndices)
      var smallerIndex = orderedSelectedIndices[0];
      var furthestIndex = orderedSelectedIndices[orderedSelectedIndices.length - 1];
      // var furthestIndex = self.getFurthestIndex(smallerIndex,self.selectedSymbolIndices);
      var x = self.treeClickableElements[smallerIndex].raphObj[0].attr("cx");
      var y = self.treeClickableElements[smallerIndex].raphObj[0].attr("cy");
      var fx = self.treeClickableElements[furthestIndex].raphObj[0].attr("cx");
      var fy = self.treeClickableElements[furthestIndex].raphObj[0].attr("cy");
       var r = self.treeCharSize * 0.7;
      var w = Math.abs(x - fx) + 2 * r;
      var h = 2 * r;
      // if(index < furthestIndex){
      //    for(var i in self.treeClickableElements){
      //       if(parseFloat(i) >= index && parseFloat(i) <= furthestIndex)
      //          self.selectElement(self.treeClickableElements[i],true);
      //    }
      self.treeSelectionMarker.remove();
      self.treeSelectionMarker = self.treePaper.rect(x - r,y - r,w,h,r).attr(self.treeSelectionMarkerAttr);
      self.treeSelectionMarker.toBack();
      // }else{
         // for(var i in self.treeClickableElements){
         //    if(parseFloat(i) <= smallerIndex && parseFloat(i) >= furthestIndex)
         //       self.selectElement(self.treeClickableElements[i],true);
         // }
         // self.treeSelectionMarker.remove();
         // self.treeSelectionMarker = self.treePaper.rect(fx - r,fy - r,w,h,r).attr(self.treeSelectionMarkerAttr).toBack();
      // }
   };

   this.dragEnd = function() {
      for(var iEl in self.treeClickableElements){
         self.treeClickableElements[iEl].raphObj.unhover();
      }
      $(window).off("mouseup");
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

   // this.getFurthestIndex = function(index,selectedIndices) {
   //    var diff = 0;
   //    var furthestIndex;
   //    for(var i of selectedIndices){
   //       var localDiff = Math.abs(i - index);
   //       if(localDiff >= diff){
   //          diff = localDiff;
   //          furthestIndex = i;
   //       }
   //    }
   //    // console.log(furthestIndex);
   //    return furthestIndex;
   // };

   this.selectElement = function(el,selected){
      // console.log(el.symbol+" "+selected);
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
         self.selectedSymbolIndices = [];
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
      this.resetFeedback();
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
            this.updateState(false,"reloadAnswer");
            // this.graphEditorCallback();
            this.updateParseTable();
            break;
         case 4:
            for(var state in answer){
               if(answer[state]){
                  for(var symbol in answer[state]){
                     $("#parseTable table td[data_symbol=\""+symbol+"\"][data_state=\""+state+"\"]").text(answer[state][symbol])
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
            var lrClosureTable = this.lrClosureTable.kernels;
            var vertices = this.graph.getAllVertices();
            var terminalState = this.getTerminalState();
            if(vertices.length != lrClosureTable.length + 1){
               this.displayError("The number of states in your automaton is incorrect")
            }else if(!terminalState){
               this.displayError("Wrong terminal state")
            }else{
               var success = true;
               for(var vertex of vertices){
                  var info = this.graph.getVertexInfo(vertex);
                  if(info.terminal){
                     continue
                  }
                  var stateIndex = this.getStateIndex(vertex);
                  if(stateIndex == null){
                     this.displayError("Error in state "+info.label);
                     return
                  }
                  if(stateIndex == 0 && !info.initial){
                     this.displayError("State "+info.label+" is not set as initial");
                     return
                  }
                  var state = lrClosureTable[stateIndex];
                  var nGoto = state.keys.length;
                  var children = this.graph.getChildren(vertex);
                  if((state.index == 0 && children.length != nGoto + 1) || (state.index != 0 && children.length != nGoto)){
                     this.displayError("The number of transitions from state "+info.label+" is incorrect");
                     return
                  }
                  for(var child of children){
                     var edges = this.graph.getEdgesFrom(vertex,child);
                     var edgeInfo = this.graph.getEdgeInfo(edges[0]);
                     var childInfo = this.graph.getVertexInfo(child);
                     var childState = this.getStateIndex(child);
                     if(childState == null && !childInfo.terminal){
                        this.displayError("Error in state "+childInfo.label);
                        return
                     }
                     if(state.gotos[edgeInfo.label] != childState && !(state.index == 0 && terminalState == childInfo.label)){
                        this.displayError("Wrong transition from state "+info.label+" to state "+childInfo.label);
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

   this.getStateIndex = function(vID) {
      /* validation in mode 3 */
      var content = this.readContent(vID);
      if(!content){
         return null
      }
      var stateIndex = null;
      for(var state of this.lrClosureTable.kernels){
         if((state.index != 0 && content.length != state.closure.length) || 
            (state.index == 0 && (content.length > state.closure.length + 1 || 
               content.length < state.closure.length))){
            continue
         }
         var match = true;
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
               match = false;
               break;
            }
         }
         if(match){
            stateIndex = state.index;
         }
      }
      return stateIndex;
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
      self.displayExplanation(false);
   };

   this.style = function() {
      // TODO :: put all that into the CSS file...
      // console.log("style")
      $("#"+this.divID).css({
         "font-size": "80%"
      });
      if(this.mode < 6){
         /* tab switch */
         this.styleTabSwitch();

         /* paper, parse table */
         this.styleTabs();
      }

      /* rules */
      // this.styleRules();

      if(this.mode < 6){
         if(this.mode == 3){
            this.showUndo();
         }
         // this.styleProgressBar();

         /* stack */
         // this.styleStackTable();

         /* action button */
         var buttonHeight = $(".actionButton").innerHeight();

         $(".actionMessage").css("height", buttonHeight+"px");
         $(".messageBackground").css({
            "background-color": this.colors.blue,
            height: buttonHeight+"px"
         })

         /* input */
         // this.styleInput();

         this.styleDerivationTree();
      }else{        
         $("#reduceButton, #produceButton, #undo").css("border-radius", "1em");
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
         $("#tabs").hide();
         return
      }else{
         $("#tabs").show();
      }
      $("#switch").css("left", this.selectedTab*25+"px");
   };

   this.styleTabs = function() {
      if(!this.sideTable){
         $("#graphPaper").css({
            width: this.paperWidth
         });
         $("#graphPaper, #parseTable").css({
            margin: "1em auto",
            height: this.paperHeight
         });
      }else{
         $("#tabsCont").css({
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
         $("#parseTable table").css({
            "font-size": "1.2em"
         });
         $("#parseTable table").css({
            margin: "auto"
         });
         $("#parseTable table th, #parseTable table td").css({
            padding: "0.4em 0.8em"
         });
      }else{
         $("#parseTable table th, #parseTable table td").css({
            padding: "0.2em 0.4em"
         });
         if(this.mode == 4){
            $("#parseTable table td[data_symbol]").css({
               width: "1.5em"
            });
         }
      }
      // $("#parseTable").css({
      //    position: "relative"
      // });
      // $("#parseTable table").css({
      //    "border-collapse": "collapse",
      //    border: "2px solid "+this.colors.black,
      //    "text-align": "center"
      // });
      // $("#parseTable table th").css({
      //    "background-color": this.colors.black,
      //    color: "white",
      //    border: "1px solid white"
      // });
      $("#parseTable td").css(this.cellAttr);
      if(this.mode >= 4){
         $("#parseTable td[data_symbol]").css({
            cursor: "pointer"
         })
      }
      // $("#parseTable td .ruleMarker").css({
      //    "background-color": this.colors.black,
      //    "border-radius": "1em",
      //    color: "white",
      //    padding: "0.2em 0.5em"
      // });
      // $("#parseTable td .ruleMarkerIndex").css({
      //    color: this.colors.yellow,
      //    // "font-weight": "bold"
      // });

      $("#rowHL, #colHL").css(this.cellHighlightAttr);
      // $("#"+parseTable+" td.selected").css(this.selectedCellAttr);
   };

   this.styleRules = function() {
      // $("#rules").css({
      //    "flex-grow": "1",
      //    "flex-shrink": "0",
      //    "background-color": this.colors.lightgrey,
      //    "border-radius": "0 5px 5px 0",
      //    "overflow": "hidden",
      //    "font-weight": "bold"
      // });
      // $("#rules h3").css({
      //    "text-align": "center",
      //    padding: "1em",
      //    margin: 0,
      //    "background-color": this.colors.black,
      //    color: "white",
      //    "font-size": "1em"
      // });
      // $("#rules ul").css({
      //    "list-style": "none",
      //    padding: 0
      // });
      // $(".rule").css({

      //    padding: "0.2em 0.5em 0.2em 0",
      //    margin: "0.5em 1em",
      //    "background-color": "transparent",
      //    color: this.colors.black,
      //    "border-radius": "1em"
      // });
      // $(".ruleIndex").css({
      //    "flex-grow": "0",
      //    "background-color": this.colors.black,
      //    "border-radius": "1em",
      //    // color: "white",
      //    color: this.colors.yellow,
      //    padding: "0.2em 0.5em",
      //    "margin-right": "0.5em"
      // });
      // $(".rule i").css({
      //    color: "grey",
      //    margin: "0 0.5em"
      // });
      // $(".rule.previousRule").css({
      //    "background-color": "#d9e3ef"
      // });
      // $(".rule.selected").css({
      //    "background-color": this.colors.blue,
      //    color: "white"
      // });
      // $(".rule.selected .ruleIndex").css({
      //    "border-radius": "1em 0 0 1em",
      // });
      // $(".rule.selected i").css({
      //    color: this.colors.yellow
      // });
      // $(".rule .epsilon").css({
      //    "font-style": "italic"
      // })
   };

   this.styleProgressBar = function() {
      // $("#progressBarClickArea").css({
      //    "flex-grow": "1",
      //    height: "20px",
      //    margin: "0 10px",
      //    "padding-top": "8px"
      // });
      // $("#progressBarContainer").css({
      //    height: "4px",
      //    "background-color": "grey",
      // });
      // $("#progressBar").css({
      //    width: "0%",
      //    height: "100%",
      //    "background-color": this.colors.blue,
      //    position: "relative"
      // });
      // $("#progressBarMarker").css({
      //    width: "6px",
      //    height: "6px",
      //    "background-color": "white",
      //    border: "3px solid "+this.colors.blue,
      //    "border-radius": "15px",
      //    position: "absolute",
      //    right: "-6px",
      //    top: "-4px",
      //    "z-index": 2
      // });
   };

   this.styleStackTable = function() {
      // $("#stackTableContainer").css({
      //    position: "relative"
      // });
      // $("#stackTable").css({
      //    border: "2px solid "+this.colors.blue,
      //    "border-right": "none",
      //    "border-collapse": "collapse",
      //    "width": "100%"
      // });
      // $("#stackTable td").css({
      //    border: "1px solid grey",
      //    "background-color": this.colors.lightgrey,
      //    "text-align": "center",
      //    width: "2em",
      //    height: "2em"
      // });
      // $("#stackTable td:last-child").css({
      //    "border-right": "none",
      //    color: "grey",
      //    "text-align": "right",
      //    "font-style": "italic",
      //    "background-color": "white",
      //    width: "auto"
      // });
      // $("#stackTable .State").css({
      //    color: "grey"
      // });
      // $("#stackTable .Symbol").css({
      //    color: this.colors.blue
      // });
      // $("#stackTable .stackElement.selected").css({
      //    "background-color": this.colors.blue,
      //    color: "white"
      // });
   };

   this.styleInput = function() {
      // $("#inputBar").css({
      //    position: "relative",
      //    "background-color": this.colors.lightgrey,
      //    "margin-top": "5px",
      //    "border-top": "1px solid grey",
      //    "border-bottom": "2px solid "+this.colors.blue
      // });
      // $("#inputBar h4").css({
      //    position: "absolute",
      //    top: "-3em"
      // });
      // $(".inputChar").css({
      //    display: "inline-block",
      //    width: "1.5em",
      //    "text-align": "center",
      //    color: this.colors.black,
      //    "font-size": "1.5em",
      //    padding: "0.1em 0"
      // });
      // $(".inputChar.read").css({
      //    color: this.colors.blue
      // });
      // $(".inputChar:first-of-type").css({
      //    "margin-left": "0.75em"
      // });
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
      if(!this.treePaper){
         this.treePaper = subTask.raphaelFactory.create("tree","tree",treeWidth,treeHeight);
      }else{
         this.treePaper.clear();
         this.treePaper.setSize(treeWidth,treeHeight);
      }

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
      $("#parseTable table td[data_symbol=\""+symbol+"\"][data_state=\""+state+"\"]").css({
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
