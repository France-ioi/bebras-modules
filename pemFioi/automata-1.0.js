function Automata(settings) {
   var self = this;
   var subTask = settings.subTask;
   /* modes:
      1: regex to automaton
      2: automaton to regex
      3: nfa to dfa
      4: minimization
      5: find a word
      6: word list (automata)
      7: word list (regex)
   */
   var mode = settings.mode;
   this.id = settings.id || "Automata";
   
   this.graphPaper = settings.graphPaper;
   this.graphPaperElementID = settings.graphPaperElementID;
   this.visualGraphJSON = settings.visualGraphJSON;
   this.visualGraph;
   this.graph;

   this.staticGraphPaper = settings.staticGraphPaper;
   this.staticVisualGraphJSON = settings.staticVisualGraphJSON;
   this.staticVisualGraph;
   this.staticGraph;

   this.circleAttr = settings.circleAttr;
   this.edgeAttr = settings.edgeAttr;
   this.graphDrawer = settings.graphDrawer || (this.circleAttr && this.edgeAttr && new SimpleGraphDrawer(this.circleAttr,this.edgeAttr,null,true)) || null;

   this.startID = [];
   this.endID = [];
   this.alphabet = settings.alphabet;
   this.regex = settings.regex;

   this.sequencePaper = settings.sequencePaper;
   this.sequence = settings.sequence;
   this.seqLettersAttr = settings.seqLettersAttr || {"font-family":"monospace","font-size":15};
   this.seqLettersPos = [];
   this.cursor;
   this.cursorX;
   this.beaver;
   this.result;

   this.graphMouse;
   this.graphEditor;

   this.NFA;
   this.targetNFA = settings.targetNFA;
   this.callback = settings.callback;

   this.acceptedByRegex = settings.acceptedByRegex;
   this.acceptedByAutomaton = settings.acceptedByAutomaton;

   this.wordList = settings.wordList;
   this.maxNbStates = settings.maxNbStates;
   this.maxNbChar = settings.maxNbChar;

   this.enabled = false;

   this.margin = 10;
   var comparisonMessages = [
      [
         "accepted by the automaton but doesn't match the regex: ",
         "not accepted by the automaton but matches the regex: "
      ],
      [
         "accepted by the automaton but doesn't match the regex: ",
         "not accepted by the automaton but matches the regex: "
      ],
      [
         "not accepted by the nfa but is accepted by your dfa: ",
         "accepted by the nfa but is not accepted by your dfa: "
      ],
      [
         "not accepted by the non mimimized automaton but is accepted by your automaton: ",
         "accepted by the non mimimized automaton but is not accepted by your automaton: "
      ],
      [
         "This word is accepted neither by the regex nor by the automaton",
         "This word is accepted by both the regex and the automaton",
         "This word is accepted by the automaton and not by the regex",
         "This word is accepted by the regex and not by the automaton"
      ],
      [
         "accepted by your automaton but it is not in the word list: ",
         "in the word list but it is not accepted by your automaton: "
      ],
      [
         "accepted by your regex but it is not in the word list: ",
         "in the word list but it is not accepted by your regex: "
      ]
   ];


   this.setEnabled = function(enabled) {
      if(enabled == this.enabled)
         return;
      this.enabled = enabled;
      if(this.visualGraphJSON){
         this.graphEditor.setEnabled(enabled);
         this.reset.setEnabled(enabled);
         
         this.graphEditor.setGraphDragEnabled(false);
         this.graphEditor.setScaleGraphEnabled(false);
         this.setEditVertexLabelEnabled(false);
         this.setDefaultVertexLabelEnabled(false);
      }
   };
   this.setCreateVertexEnabled = function(enabled) {
      this.graphEditor.setCreateVertexEnabled(enabled);
   };
   this.setCreateEdgeEnabled = function(enabled) {
      this.graphEditor.setCreateEdgeEnabled(enabled);
   };
   this.setVertexDragEnabled = function(enabled) {
      this.graphEditor.setVertexDragEnabled(enabled);
   };
   this.setEdgeDragEnabled = function(enabled) {
      this.graphEditor.setEdgeDragEnabled(enabled);
   };
   this.setMultipleEdgesEnabled = function(enabled) {
      this.graphEditor.setMultipleEdgesEnabled(enabled);
   };
   this.setLoopEnabled = function(enabled) {
      this.graphEditor.setLoopEnabled(enabled);
   };
   this.setEditVertexLabelEnabled = function(enabled) {
      this.graphEditor.setEditVertexLabelEnabled(enabled);
   };
   this.setEditEdgeLabelEnabled = function(enabled) {
      this.graphEditor.setEditEdgeLabelEnabled(enabled);
   };
   this.setTerminalEnabled = function(enabled) {
      this.graphEditor.setTerminalEnabled(enabled);
   };
   this.setDefaultVertexLabelEnabled = function(enabled) {
      this.graphEditor.setDefaultVertexLabelEnabled(enabled);
   };
   this.setDefaultEdgeLabelEnabled = function(enabled) {
      this.graphEditor.setDefaultEdgeLabelEnabled(enabled);
   };
   this.setSequence = function(seq) {
      if(Array.isArray(seq)){
         this.sequence = seq;
      }else if(typeof seq === "string") {
         this.sequence = seq.split("");
      }else{
         console.log("type error");
      }
   };
   this.setEditEnabled = function(enabled) {
      this.graphEditor.setEnabled(enabled);
   };

   this.initGraph = function() {
      this.visualGraph = VisualGraph.fromJSON(this.visualGraphJSON, this.id+"_VisualGraph", this.graphPaper, null, this.graphDrawer, true);
      this.graph = this.visualGraph.graph;
      this.graphMouse = new GraphMouse("GraphMouse", this.graph, this.visualGraph);
      var editorSettings = {
         paper: this.graphPaper,
         graph: this.graph,
         paperElementID: this.graphPaperElementID,
         visualGraph: this.visualGraph,
         graphMouse: this.graphMouse,
         dragThreshold: 10,
         edgeThreshold: 20,
         dragLimits: {
            minX: this.visualGraph.graphDrawer.circleAttr.r,
            maxX: this.graphPaper.width - this.visualGraph.graphDrawer.circleAttr.r,
            minY: this.visualGraph.graphDrawer.circleAttr.r,
            maxY: this.graphPaper.height - this.visualGraph.graphDrawer.circleAttr.r
         },
         alphabet: this.alphabet,
         callback: this.callback,
         onDragEnd: this.callback,
         enabled: false
      };
      this.graphEditor = new GraphEditor(editorSettings);
   };

   this.initStaticGraph = function() {
      this.staticVisualGraph = VisualGraph.fromJSON(this.staticVisualGraphJSON, this.id+"_staticVisualGraph", this.staticGraphPaper, null, this.graphDrawer, true);
      this.staticGraph = this.staticVisualGraph.graph;
   };

   this.initSequence = function() {
      var containerSize = {
         h: this.seqLettersAttr["font-size"] + this.margin,
         w: this.sequence.length * (this.seqLettersAttr["font-size"] + this.margin)
      };
      var paperW = this.sequencePaper.width;
      var containerPos = {
         x: (paperW - containerSize.w)/2,
         y: this.margin
      }
      var container = this.sequencePaper.rect(containerPos.x,containerPos.y,containerSize.w,containerSize.h);

      for(var iLetter in this.sequence){
         var x = containerPos.x + (this.margin/2 + this.seqLettersAttr["font-size"]/2)*(1 + 2*iLetter);
         var y = containerPos.y + this.margin/2 + this.seqLettersAttr["font-size"]/2;
         this.seqLettersPos[iLetter] = {x:x,y:y};
         this.sequencePaper.text(x,y,this.sequence[iLetter]).attr(this.seqLettersAttr);
      }
      this.initCursor(containerSize,containerPos);
   };

   this.initCursor = function(containerSize,containerPos) {
      if(this.cursor){this.cursor.remove()};
      var w = containerSize.h;
      var h = containerSize.h;

      var x = containerPos.x - this.margin;
      var y = containerPos.y;
      this.cursorX = x;
      var arrowSize = 10;

      var line = this.sequencePaper.path("M"+x+" "+y+"V"+(y+h)).attr({"stroke":"black","stroke-width":1});
      var topArr = drawArrow(x-arrowSize/2,y,arrowSize,-1);
      var bottomArr = drawArrow(x-arrowSize/2,(y+h),arrowSize,1);

      this.cursor = this.sequencePaper.set(line,topArr,bottomArr);
   };

   this.initBeaver = function() {
      this.beaver = this.graphPaper.circle(0,0,0).attr(this.graphDrawer.circleAttr).attr("fill","black");
      var pos = this.visualGraph.getVertexVisualInfo(this.startID[0]);
      this.beaver.attr({
         cx: pos.x,
         cy: pos.y,
         x: pos.x,
         y: pos.y
      });
   };

   this.nfaFromGraph = function(graph) {
      this.startID = [];
      this.endID = [];
      var vertices = graph.getAllVertices();
      var transitionTable = {};
      for(vertex of vertices){
         var info = graph.getVertexInfo(vertex);
         transitionTable[vertex] = {};
         var children = graph.getChildren(vertex);
         if(info.initial && !this.startID.includes[vertex]){
            this.startID.push(vertex);
         }
         if(info.terminal && !this.endID.includes[vertex]){
            this.endID.push(vertex);
         }
         for(child of children){
            var edges = graph.getEdgesFrom(vertex,child);
            for(var edge of edges){
               var info = graph.getEdgeInfo(edge);
               var label = info.label || "";
               if(!transitionTable[vertex][label]){
                  transitionTable[vertex][label] = [child];
               }else{
                  transitionTable[vertex][label].push(child);
               }
            }
         }
      }
      if(this.startID.length == 0){
         return {error: "error: no initial state", nfa: null};
      }
      if(this.endID.length == 0){
         return {error:"error: no final state", nfa: null};
      }
      return { error: null, nfa: new NFA(self.alphabet,transitionTable,this.startID,this.endID) };
   };

   this.compareWithTarget = function() {
      /* compare automata with target NFA */
      var dfa = this.NFA.to_DFA();
      var targetDFA = this.targetNFA.to_DFA();
      var isMin = null;
      if(mode == 4){
         var isMin = true;
         var minimizedTarget = targetDFA.minimized();
         var minStatesNb = minimizedTarget.states.length;
         if(dfa.states.length > minStatesNb){
            var isMin = false;
         }
      }
      var e_c = dfa.find_equivalence_counterexamples(targetDFA);
      var equivalent = false;
      if(!e_c[0] && !e_c[1]){
         equivalent = true;
      }
      var noUnreachableDFA = dfa.without_unreachables();
      return {equivalent: equivalent, e_c: e_c, isMin: isMin};
   };

   this.regexToNFA = function(regex) {
      /* convert a regex into a NFA and set it to targetNFA */
      try{
         var groupIndices = [0]; // Indices of groups in nfa array
         var orIndices = []; //  Indices of | in nfa array
         var string = "";
         var nfa = [];  // Array of nfas

         for(var iChar = 0; iChar < regex.length; iChar++){
            var char = regex.charAt(iChar);
            // console.log(char);
            if(this.alphabet.includes(char)){
               string += char;
            }else{
               switch(char){
                  case "(":
                     /* open group */
                     ifString();
                     groupIndices.push(nfa.length);
                     break;
                  case ")":
                     /* close group */
                     ifString();
                     var error = concatGroup();
                     if(error){
                        return { error: error };
                     }
                     break;
                  case "?":
                  case "*":
                  case "+":
                  case "{":
                     var lastNFA = getLastNFA();
                     if(!lastNFA){
                        throw "error: missing character before "+char;
                     }
                     if(char == "?"){
                        nfa.push(lastNFA.optional());
                     }else if(char == "*"){
                        nfa.push(lastNFA.star());
                     }else if(char == "+"){
                        nfa.push(lastNFA.plus());
                     }else if(char == "{"){
                        repeatNFA(lastNFA);
                     }
                     break;
                  case "|":
                     ifString();
                     if(nfa.length == 0){
                        throw "error: missing character before |";
                     }
                     /* concat nfas in subgroup before */
                     concatGroup(true);
                     orIndices.push(nfa.length);
                     break;
                  case "[":
                     ifString();
                     var newIndex = oneOf(iChar);
                     iChar = newIndex; // set iChar to end bracket
                     break;
                  default:
                     var checkValidChar = new RegExp('[-}\\],0-9]');
                     if(!checkValidChar.test(char)){
                        throw "error: invalid character "+char;
                     }
               }
            }
         }
         /* final close group */
         ifString();
         concatGroup();
         if(groupIndices.length != 0){
            throw "error: missing parenthesis";
         }
         if(nfa[0]){
            // this.targetNFA = nfa[0];
            return { nfa: nfa[0], error: null };
         }else{
            throw "error: empty regex";
         }
      }catch(error){
         return { error: error };
      }

      function ifString() {
         if(string != ""){
            nfa.push(NFA.for(string,self.alphabet));
            string = "";
         }
      };

      function concatGroup(or) {
         /* concat nfas in group */
         if(or){
            var startIndex = groupIndices[groupIndices.length - 1];
         }else if(groupIndices.length <= 0){
            throw "error: missing opening parenthesis";
         }else{
            var startIndex = groupIndices.pop();
         }
         /* if | inside group, unify subgroups before and after */
         if(orIndices[orIndices.length - 1] > startIndex){
            var subStartIndex = orIndices.pop();
            var subGroup1 = nfa[subStartIndex - 1];
            var subGroup2 = nfa[subStartIndex];   // first nfa in subgroup after
            if(!subGroup2){
               throw "error: missing character after |";
            }
            for(var iElement = subStartIndex + 1; iElement < nfa.length; iElement++){
               subGroup2 = subGroup2.concat(nfa[iElement]);
            }
            nfa = nfa.slice(0,subStartIndex - 1);
            nfa.push(subGroup1.union(subGroup2));
         }

         var groupNFA = nfa[startIndex];   // first nfa in group
         for(var iElement = startIndex + 1; iElement < nfa.length; iElement++){
            groupNFA = groupNFA.concat(nfa[iElement]);
         }
         nfa = nfa.slice(0,startIndex);
         nfa.push(groupNFA);
      };

      function getLastNFA() {
         if(string != ""){
            var substr1 = string.substring(0,string.length-1);
            var substr2 = string.substring(string.length-1);
            if(substr1 != ""){
               nfa.push(NFA.for(substr1,self.alphabet));
            }
            var lastNFA = NFA.for(substr2,self.alphabet);
            string = "";
         }else{
            var lastNFA = nfa.pop();
         }
         return lastNFA;
      };

      function repeatNFA(aut) {
         var insideBrackets = "";
         var closingBracket = false;
         for(var jChar = iChar + 1; jChar < regex.length; jChar++){
            var nextChar = regex[jChar];
            if(nextChar != "}"){
               insideBrackets += nextChar;
            }else{
               closingBracket = true;
               break;
            }
         }
         if(!closingBracket){
            throw "error: missing closing curly bracket";
         }
         if(insideBrackets == ""){
            throw "error: empty curly brackets";
         }
         var repeat = insideBrackets.split(",");
         if(repeat.length == 0){
            return;
         }else if(repeat.length > 2){
            throw "error: wrong format inside curly brackets";
         }else if(isNaN(repeat[0])){
            throw "error: missing number after {";
         }else if(repeat.length == 2 && repeat[1] != "" && isNaN(repeat[1])){
            throw "error: wrong format inside curly brackets";
         }else if(repeat[0] < 1)   {
            throw "error: number inside curly brackets should be greater than 0";
         } 
         var result = aut.repeat(repeat[0]);
         if(repeat.length == 2){
            if(repeat[1] == ""){
               result = result.concat(aut.star());
            }else if(repeat[1] <= repeat[0]){
               throw "error: second element in a range should be larger than the first";
            }else{
               var range = repeat[1] - repeat[0];
               var optionalRepeat = aut.optional().repeat(range);
               result = result.concat(optionalRepeat);
            }
         }
         nfa.push(result);
      };

      function oneOf(iChar) {
         var insideBrackets = "";
         var closingBracket = false;
         for(var jChar = iChar + 1; jChar < regex.length; jChar++){
            var nextChar = regex[jChar];
            if(nextChar != "]"){
               insideBrackets += nextChar;
               if(!self.alphabet.includes(nextChar) && nextChar != "-"){
                  throw "error: invalid character inside brackets";
               }
            }else{
               closingBracket = true;
               break;
            }
         }
         if(!closingBracket){
            throw "error: missing closing bracket";
         }

         var result;
         var hyphenIndex = insideBrackets.indexOf("-")
         while(hyphenIndex > -1){
            if(hyphenIndex == 0){
               throw "error: wrong character after [";
            }else if(hyphenIndex == insideBrackets.length - 1){
               throw "error: missing character after -";
            }
            var startChar = insideBrackets.charAt(hyphenIndex - 1);
            var endChar = insideBrackets.charAt(hyphenIndex + 1);
            if(startChar >= endChar){
               throw "error: second element in a range should be larger than the first";
            }
            var startCode = startChar.charCodeAt();
            var endCode = endChar.charCodeAt();
            for(var iCode = startCode; iCode <= endCode; iCode++){
               var chr = String.fromCharCode(iCode);
               if(!result){
                  result = NFA.for(chr,self.alphabet);
               }else{
                  result = result.union(NFA.for(chr,self.alphabet));
               }
            }
            insideBrackets = insideBrackets.replace(startChar+'-'+endChar,'');
            hyphenIndex = insideBrackets.indexOf("-");
         }
         if(insideBrackets == ""){
            if(result){
               nfa.push(result);
            }
            return jChar;
         }
         for(var chr of insideBrackets){
            if(!result){
               result = NFA.for(chr,self.alphabet);
            }else{
               result = result.union(NFA.for(chr,self.alphabet));
            }
         }

         nfa.push(result);
         return jChar;
      };
   };

   function drawArrow(x,y,size,dir) {
      var margin = 0;
      var frameW = size;
      var innerFrameW = frameW-2*margin;
      var baseW = innerFrameW*0.6;
      var arrowTipLength = innerFrameW;
      var cx = x+frameW/2;
      var cy = y+frameW/2;

      var arrow = this.sequencePaper.path("M"+(x+frameW/2)+" "+(y+margin)+
                              "L"+(x+frameW-margin)+" "+(y+margin+arrowTipLength*dir)+
                              "H"+(x+margin+innerFrameW-(innerFrameW-baseW)/2)+
                              "V"+(y+frameW*dir-margin)+
                              "H"+(x+margin+(innerFrameW-baseW)/2)+
                              "V"+(y+margin+arrowTipLength*dir)+
                              "H"+(x+margin)+
                              "Z");

      arrow.attr("fill","black");
      return arrow;
   };

   this.run = function(callback) {
      this.initSequence();
      this.initBeaver();
      this.result = null;
      var edges = this.graph.getAllEdges();
      for(edge of edges){
         var info = this.graph.getEdgeInfo(edge);
         if(!info.label || info.label === "?"){
            this.result = { message: "missingLabel", nEdges: null};
            if(callback)
               callback(this.result);
         }
      }
      this.loop(self.startID,0,callback);
   };

   this.loop = function(vID,step,callback) {
      var nextStep = self.checkNext(vID,step);
      vID = nextStep.vID;
      var eID = nextStep.edgeID;
      var oldEdgeID = null;
      this.result = { message: nextStep.message, nEdges: nextStep.nEdges };
      if(callback){
         callback(this.result);
      }
      if(vID){
         this.animate(step,vID,eID,function(){
            if(oldEdgeID === eID)   // to avoid multiple calls when animated object is a set of elements
               return;
            oldEdgeID = eID;

            step++;
            if(!self.endID.includes(vID)){
               subTask.delayFactory.create("delay"+step,function(){
                  self.loop(vID,step,callback);
               },100);
            }
         });
      }
   };

   this.checkNext = function(vID,step) {
      var children = this.graph.getChildren(vID);
      var nextVertex = null;
      var way = null;
      var nEdges = 0;
      if(children.length == 0){
         return { vID: null, edgeID: null, nEdges: 0, message: "noChildren"};
      }
      
      for(child of children){
         var edges = this.graph.getEdgesFrom(vID,child);
         for(edge of edges){
            var info = this.graph.getEdgeInfo(edge);
            if(info.label == this.sequence[step]){
               if(nextVertex && nextVertex !== child){
                  return { vID: null, edgeID: null, nEdges: 0, message: "tooManyWays" };
               }
               nextVertex = nextVertex || child;
               way = way || edge;
               nEdges++;
            }
         }
      }
      if(!nextVertex){
         return { vID: null, edgeID: null, nEdges: 0, message: "noGoodWay" };
      }
      if(nextVertex !== this.endID)
         return { vID: nextVertex, edgeID: way, nEdges: nEdges, message: "next" };
      return { vID: nextVertex, edgeID: way, nEdges: nEdges, message: "success" };
   };

   this.animate = function(step,vID,eID,callback) {
      var xi = this.cursorX;
      var xf = this.seqLettersPos[step].x + this.margin/2 + this.seqLettersAttr["font-size"]/2;
      var translation = xf - xi;
      this.cursorX = xf;
      var animCursor = new Raphael.animation({"transform":"...T"+translation+",0"},500,callback);
      subTask.raphaelFactory.animate("animCursor",this.cursor,animCursor);

      var transformStr = this.getTransformString(eID);
      var animBeaver = new Raphael.animation({"transform":"..."+transformStr},500);
      subTask.raphaelFactory.animate("animBeaver",this.beaver,animBeaver);
   };

   this.stopAnimation = function() {
      subTask.raphaelFactory.stopAnimate("animCursor");
      subTask.raphaelFactory.stopAnimate("animBeaver");
   };

   this.getTransformString = function(eID) {
      var edgeVisualInfo = this.visualGraph.getEdgeVisualInfo(eID);
      var vertices = this.graph.getEdgeVertices(eID);
      var pos1 = this.visualGraph.getVertexVisualInfo(vertices[0]);
      var pos2 = this.visualGraph.getVertexVisualInfo(vertices[1]);
      var transformString = "";
      if(!edgeVisualInfo["radius-ratio"]){
         transformString += "T"+(pos2.x - pos1.x)+","+(pos2.y - pos1.y);
      }else{
         var radiusRatio = edgeVisualInfo["radius-ratio"];
         var l = edgeVisualInfo["large-arc"] || 0;
         var s = edgeVisualInfo["sweep"] || 0;
         var D = Math.sqrt(Math.pow((pos2.x - pos1.x),2) + Math.pow((pos2.y - pos1.y),2));
         var R = radiusRatio * D;
         var cPos = this.visualGraph.graphDrawer.getCenterPosition(R,s,l,pos1,pos2);
         var angle = (s) ? 2*Math.asin(D/(2*R))*180/Math.PI : -2*Math.asin(D/(2*R))*180/Math.PI;
         if(l)
            angle = (s) ? (360 - angle)%360 : -(360 + angle)%360; 
         transformString += "R"+angle+","+cPos.x+","+cPos.y+"R"+(-angle);
      }
      return transformString;
   };

   this.resetAnimation = function() {
      self.stopAnimation();
      if(self.cursor){
         self.sequencePaper.clear();
      }
      if(self.beaver){
         self.beaver.remove();
      }
      if(settings.resetCallback)
         settings.resetCallback();
   };

   this.isDFA = function(graph) {
      /* check if a graph represents a deterministic automaton */
      var vertices = graph.getAllVertices();
      var nInitial = 0;
      for(var vertex of vertices){
         var info = graph.getVertexInfo(vertex);
         if(info.initial){
            nInitial++;
            if(nInitial > 1){
               return false;
            }
         }
         var children = graph.getChildren(vertex);
         var nSameEdgeLabel = 0;
         var edgeLabel = [];
         for(var child of children){
            var edges = graph.getEdgesFrom(vertex,child);
            for(var edge of edges){
               var edgeInfo = graph.getEdgeInfo(edge);
               if(edgeLabel.includes(edgeInfo.label)){
                  return false;
               }else{
                  edgeLabel.push(edgeInfo.label);
               }
            }
         }
      }
      return true;
   };

   this.isWordAccepted = function(word) {
      /* is this word accepted by this.NFA and this.targetNFA */
      var acceptedByNFA = this.NFA.test(word);
      var acceptedByTargetNFA = this.targetNFA.test(word);
      return { nfa: acceptedByNFA, target: acceptedByTargetNFA };
   };

   this.nfaFromList = function() {
      var nfa;
      for(var word of this.wordList){
         if(!nfa){
            nfa = NFA.for(word,this.alphabet);
         }else{
            nfa = nfa.union(NFA.for(word,this.alphabet));
         }
      }
      return nfa;
   };

   this.validate = function(data) {
      this.resetAnimation();

      switch(mode){
         case 1:
            break;
         case 2:
            var regex = data;
            var res = this.regexToNFA(regex);
            if(res.error){
               return res;
            }else{
               this.targetNFA = res.nfa;
            }
            break;
         case 3:
         case 4:
            if(!this.isDFA(this.graph)){
               return { error: "This automaton is nondeterministic" };
            }
            var nfaFromGraph = this.nfaFromGraph(this.staticGraph);
            if(nfaFromGraph.error){
               return nfaFromGraph;
            }
            this.targetNFA = nfaFromGraph.nfa;
            break;
         case 5:
            var word = data;
            if(!word){
               return { error: "Enter a word in the input field" };
            }
            var regexToNFA = this.regexToNFA(this.regex);
            if(regexToNFA.error){
               return regexToNFA;
            }
            this.targetNFA = regexToNFA.nfa;
            var nfaFromGraph = this.nfaFromGraph(this.graph);
            if(nfaFromGraph.error){
               return nfaFromGraph;
            }
            this.NFA = nfaFromGraph.nfa;
            var wordAccepted = this.isWordAccepted(word);
            var error;
            if(!wordAccepted.nfa && !wordAccepted.target){
               error = (!this.acceptedByAutomaton && !this.acceptedByRegex) ? null : comparisonMessages[4][0];
            }else if(wordAccepted.nfa && wordAccepted.target){
               error = (this.acceptedByAutomaton && this.acceptedByRegex) ? null : comparisonMessages[4][1];
            }else if(wordAccepted.nfa && !wordAccepted.target){
               error = (this.acceptedByAutomaton && !this.acceptedByRegex) ? null : comparisonMessages[4][2];
            }else if(!wordAccepted.nfa && wordAccepted.target){
               error = (!this.acceptedByAutomaton && this.acceptedByRegex) ? null : comparisonMessages[4][3];
            }
            if(error){
               this.setSequence(word);
               this.run();
            }
            return { error: error };
            break;
         case 6:
            if(this.maxNbStates < this.graph.getVerticesCount()){
               return { error: "The number of states is greater than "+this.maxNbStates };
            }
            this.targetNFA = this.nfaFromList();
            break;
         case 7:
            var regex = data;
            if(this.maxNbChar < regex.length){
               return { error: "The regex is longer than "+this.maxNbChar };
            }
            var res = this.regexToNFA(regex);
            if(res.error){
               return res;
            }
            this.NFA = res.nfa;
            this.targetNFA = this.nfaFromList();
            break;
         default:
            return { error: "error: invalid mode" };
      }

      if(mode != 7){
         var nfaFromGraph = this.nfaFromGraph(this.graph);
         if(nfaFromGraph.error){
            return nfaFromGraph;
         }
         this.NFA = nfaFromGraph.nfa;
      }

      var comp = this.compareWithTarget();

      if(comp.equivalent){
         if(mode == 4 && !comp.isMin){
            return { error: "This automaton is not minimized" };
         }
         return { error: null };
      }
      if(comp["e_c"][0]){
         this.setSequence(comp["e_c"][0]);
         var text = "The following string is "+comparisonMessages[mode - 1][0]+comp["e_c"][0];
      }else{
         this.setSequence(comp["e_c"][1]);
         var text = "The following string is "+comparisonMessages[mode - 1][1]+comp["e_c"][1];
      }
      if(mode != 7){
         this.run();
      }
      return { error: text };
      
   };

   if(mode == 3 || mode == 4){
      this.initStaticGraph();
   }
   if(this.visualGraphJSON){
      this.initGraph();
      this.reset = new PaperMouseEvent(this.graphPaperElementID, this.graphPaper, "click", this.resetAnimation, false,"reset");
   }

   if(settings.enabled){
      this.setEnabled(true);
   }
};


function AutomataTask(subTask, loadLevel, loadAnswer, saveAnswer, initPaper, getAutomataSettings) {
   // Implements all common functions to automata tasks
   var answer = null;
   var containers = [];

   subTask.loadLevel = function(curLevel) {
      $('#displayHelper_graderMessage').appendTo('#feedback');
      loadLevel(curLevel);
      subTask.reset();
   };

   subTask.getStateObject = function() {
      return {};
   };

   subTask.getDefaultAnswerObject = function() {
      return null;
   };

   subTask.getAnswerObject = function() {
      answer = saveAnswer();
      return answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         loadAnswer(answer);
         subTask.reset();
      }
   };

   subTask.getGrade = function(callback) {
      var res = subTask.automata.validate(answer);
      if(res.error){
         callback({successRate: 0, message: res.error});
      } else {
         callback({successRate: 1, message: taskStrings.success});
      }
   };

   subTask.reset = function() {
      if(subTask.automata) {
         subTask.automata.stopAnimation();
         subTask.automata.setEnabled(false);
      }
      subTask.raphaelFactory.destroyAll();
      $('.automata-container' + getSuffix()).remove();
      subTask.resetDisplay();

      initPaper();
      initAutomata();
   };

   if(!subTask.resetDisplay) {
      subTask.resetDisplay = function() {
      };
   }

   function resetCallback() {
      $("#feedback").empty();
   };

   subTask.unloadLevel = function(callback) {
      if(subTask.automata){
         subTask.automata.stopAnimation();
         subTask.automata.setEnabled(false);
      }
      resetCallback();
      callback();
   };

   function getSuffix() {
      return subTask.display ? '-inner' : '-nodisplay';
   };

   subTask.raphael = function() {
      var args = Array.prototype.slice.call(arguments);
      var base = args[1];
      var suffix = getSuffix();
      args[0] += suffix;
      args[1] += suffix;
      if(!$('#' + args[1]).length) {
         $('#' + base).append(
            '<div id="' + args[1] + '"'
            + ' class="automata-container' + suffix + '"'
            + (subTask.display ? '' : ' style="display: none;"')
            + '></div>');
      }
      return subTask.raphaelFactory.create.apply(subTask.raphaelFactory, args);
   };

   function initAutomata() {
      var settings = getAutomataSettings();
      settings.subTask = subTask;
      var cb = settings.callback;
      settings.callback = function() {
         saveAnswer();
         if(cb) cb();
      }
      settings.resetCallback = resetCallback;

      settings.graphPaperElementID += getSuffix();

      subTask.automata = new Automata(settings);
      if(typeof settings.editEnabled != 'undefined') {
         subTask.automata.setEditEnabled(settings.editEnabled);
      }
   };

   displayHelper.customValidate = function() {
      answer = saveAnswer();
      subTask.getGrade(function(res) {
         if(res.successRate < 1) {
            $("#feedback").text(res.message);
         } else {
            displayHelper.validate("stay");
         }
      });
   };
}
