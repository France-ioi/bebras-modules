function Automata(settings) {
   var self = this;
   var subTask = settings.subTask;
   this.id = settings.id || "Automata";
   this.graphPaper = settings.graphPaper;
   this.graphPaperElementID = settings.graphPaperElementID;
   this.seqPaper = settings.seqPaper;
   this.visualGraphJSON = settings.visualGraphJSON;
   this.circleAttr = settings.circleAttr;
   this.edgeAttr = settings.edgeAttr;
   this.graphDrawer = settings.graphDrawer || new SimpleGraphDrawer(this.circleAttr,this.edgeAttr,null,true);

   this.startID = [];
   this.endID = [];
   this.alphabet = settings.alphabet;

   this.sequencePaper = settings.sequencePaper;
   this.sequence = settings.sequence;
   this.seqLettersAttr = settings.seqLettersAttr || {"font-family":"monospace","font-size":15};
   this.seqLettersPos = [];
   this.cursor;
   this.cursorX;
   this.beaver;
   this.result;

   this.visualGraph;
   this.graph;
   this.graphMouse;
   this.graphEditor;

   this.NFA;
   this.targetNFA = settings.targetNFA;
   this.callback = settings.callback;

   this.enabled = false;

   this.margin = 10;


   this.setEnabled = function(enabled) {
      if(enabled == this.enabled)
         return;
      this.enabled = enabled;
      this.graphEditor.setEnabled(enabled);
      this.reset.setEnabled(enabled);
      
      this.graphEditor.setDragGraphEnabled(false);
      this.graphEditor.setScaleGraphEnabled(false);
      this.setEditVertexLabelEnabled(false);
      this.setDefaultVertexLabelEnabled(false);
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

   this.initSequence = function() {
      var containerSize = {
         h: this.seqLettersAttr["font-size"] + this.margin,
         w: this.sequence.length * (this.seqLettersAttr["font-size"] + this.margin)
      };
      var containerPos = {
         x: 2*this.margin,
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

   this.getNFA = function() {
      self.startID = [];
      self.endID = [];
      var vertices = self.graph.getAllVertices();
      var transitionTable = {};
      for(vertex of vertices){
         var info = self.graph.getVertexInfo(vertex);
         transitionTable[vertex] = {};
         var children = self.graph.getChildren(vertex);
         if(info.terminal && children.length > 0 && !this.startID.includes[vertex])
            this.startID.push(vertex);
         for(child of children){
            var childInfo = self.graph.getVertexInfo(child);
            if(childInfo.terminal && !this.endID.includes[child])
               this.endID.push(child);
            var edges = self.graph.getEdgesFrom(vertex,child);
            for(var edge of edges){
               var info = self.graph.getEdgeInfo(edge);
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
         return {error: "noStart"}
      }
      if(this.endID.length == 0){
         return {error:"noEnd"};
      }
      self.NFA = new NFA(self.alphabet,transitionTable,this.startID,this.endID);
      return null;
   };

   this.generateTargetNFA = function() {
      var str = "";
      for(var letter of this.sequence){
         str += letter;
      }
      this.targetNFA = NFA.for(str,this.alphabet);
   };

   this.compareWithTarget = function() {
      if(!this.targetNFA){
         this.generateTargetNFA();
      }
      var error = this.getNFA();
      if(error){
         return error;
      }
      var dfa = this.NFA.to_DFA();
      var targetDFA = this.targetNFA.to_DFA();
      var e_c = dfa.find_equivalence_counterexamples(targetDFA);
      var equivalent = false;
      if(!e_c[0] && !e_c[1]){
         equivalent = true;
      }
      var noUnreachableDFA = dfa.without_unreachables();
      return {equivalent: equivalent, e_c: e_c, unusedVertices: (this.NFA.states.length >= noUnreachableDFA.states.length)};
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
         // self.cursor.attr("transform","");
         // self.cursorX = self.margin;
         self.sequencePaper.clear();
      }
      if(self.beaver){
         self.beaver.remove();
         // self.initBeaver();
      }
      if(settings.resetCallback)
         settings.resetCallback();
   };


   this.initGraph();
   // this.initSequence();
   // this.initBeaver();
   // this.getNFA();
   this.reset = new PaperMouseEvent(this.graphPaperElementID, this.graphPaper, "click", this.resetAnimation, false,"reset");

   if(settings.enabled){
      this.setEnabled(true);
   }
};