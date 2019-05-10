function FillInTheGaps(settings) {
   var self = this;
   this.html = settings.html;
   this.divID = settings.divID;
   this.words = settings.words;
   this.orderedWords = settings.orderedWords;
   this.dragCallback = settings.dragCallback;
   var answer = settings.answer;

   this.wordDim = {};
   this.wordOriginPos = {};
   this.wordCurrentPos = {};
   this.gapPos = {};
   this.gapContent = {};
   this.gapWidth = 0;
   this.gapHeight = 0;
   this.margin = 10;

   this.mouseStartPos = {};
   this.isDragging = false;
   this.wordBeingDragged;

   this.initDiv = function() {
      this.stock = $("<div id=\"stock\"></div>");
      for(var iWord = 0; iWord < this.words.length; iWord++){
         this.stock.append("<span id=\"word_"+iWord+"\">"+this.words[iWord]+"</span>");
      }
      $("#"+this.divID).empty();
      $("#"+this.divID).append(this.stock,this.html);
   };
   
   this.getWordDim = function() {
      $("#stock span").css({
         padding: (this.margin/2)+"px "+(this.margin)+"px",
         border: "1px solid black",
         "border-radius": "5px",
         "background-color": "white",
         "text-align": "center",
         cursor: "pointer"
      });
      $("#stock span").each(function(){
         self.wordDim[$(this).attr("id")] = {
            w: $(this).outerWidth(),
            h: $(this).outerHeight()
         };
         if($(this).outerWidth() > self.gapWidth){
            self.gapWidth = $(this).outerWidth();
         }
         if($(this).outerHeight() > self.gapHeight){
            self.gapHeight = $(this).outerHeight();
         }
      });
   };

   this.styleGaps = function() {
      $("#"+this.divID+" span[id^=gap_]").css({
         display: "inline-block",
         width: this.gapWidth,
         height: this.gapHeight,
         "background-color": "lightgrey"
      })
   };

   this.getWordsPos = function() {
      $("#"+this.divID).css("position","relative");
      $("#stock").css({
         height: (this.gapHeight + 2*this.margin)+"px"
      });
      var leftBorder = 0;
      for(var iWord = 0; iWord < this.words.length; iWord++){
         var top = this.margin;
         var left = (this.margin + leftBorder);
         var id = "word_"+iWord;
         var gapID = "gap_"+iWord;
         $("#"+id).css({
            position: "absolute",
            top: top+"px",
            left: left+"px"
         });
         this.wordOriginPos[id] = {
            x: left,
            y: top
         };
         this.wordCurrentPos[id] = {
            x: left,
            y: top
         };
         leftBorder += this.margin + this.wordDim[id].w;

         this.gapPos[gapID] = {
            x: $("#"+gapID).position().left,
            y: $("#"+gapID).position().top
         };
      }
   };

   this.initHandlers = function() {
      $("#stock span").off("mousedown");
      $("#stock span").mousedown(this.dragStart);
      $(document).off("mousemove");
      $(document).mousemove(this.dragMove);
      $(document).off("mouseup");
      $(document).mouseup(this.dragEnd);
   };

   this.dragStart = function(event) {
      self.mouseStartPos = {
         x: event.pageX,
         y: event.pageY
      };
      self.isDragging = true;
      var id = $(this).attr("id");
      self.wordBeingDragged = id;
      $(this).insertAfter($(this).siblings().last()); // to top
      for(var gap in self.gapContent){
         if(self.gapContent[gap] == id.substr(5)){
            self.gapContent[gap] = null;
            self.saveAnswer();
         }
      }
      self.dragCallback();
   };

   this.dragMove = function(event) {
      if(self.isDragging){
         var id = self.wordBeingDragged;
         var dx = event.pageX - self.mouseStartPos.x;
         var dy = event.pageY - self.mouseStartPos.y;
         var x = self.wordCurrentPos[id].x + dx;
         var y = self.wordCurrentPos[id].y + dy;
         $("#"+self.wordBeingDragged).css({
            left: x+"px",
            top: y+"px"
         });
         var gap = self.isGoodPosition(x,y,id);
         if(gap){
            self.highlightGap(gap);
         }else{
            self.removeHighlight();
         }
      }
   };

   this.dragEnd = function(event) {
      if(self.isDragging){
         var id = self.wordBeingDragged;
         var x = $("#"+id).position().left;
         var y = $("#"+id).position().top;
         var gap = self.isGoodPosition(x,y,id);
         if(gap){
            if(self.gapContent[gap]){
               var prevID = "word_"+self.gapContent[gap];
               self.resizeWord(prevID,false);
               self.toPos(prevID,self.wordOriginPos[prevID].x,self.wordOriginPos[prevID].y);
               self.removeHighlight();
            }
            self.resizeWord(id,true);
            var newX = self.gapPos[gap].x;
            var newY = self.gapPos[gap].y;
            self.toPos(id,newX,newY);
            self.gapContent[gap] = id.substr(5);
            self.saveAnswer();
         }else{
            self.resizeWord(id,false);
            self.toPos(id,self.wordOriginPos[id].x,self.wordOriginPos[id].y);   
         }
         self.isDragging = false;
      }
   };

   this.isGoodPosition = function(x,y,id) {
      var xc = x + this.wordDim[id].w/2;
      var yc = y + this.wordDim[id].h/2;

      for(var gap in this.gapPos){
         var gapX = this.gapPos[gap].x + this.gapWidth/2;
         var gapY = this.gapPos[gap].y + this.gapHeight/2;
         if(Math.abs(xc - gapX) < this.gapWidth/2 && Math.abs(yc - gapY) < this.gapHeight/2){
            return gap;
         }
      }
      return false;
   };

   this.toPos = function(id,x,y) {
      $("#"+id).css({
         left: x+"px",
         top: y+"px"
      });
      self.wordCurrentPos[id] = {
         x: x,
         y: y
      }
   };

   this.highlightGap = function(gap) {
      $("#"+gap).css({"background-color": "grey"});
      if(this.gapContent[gap]){
         $("#word_"+this.gapContent[gap]).css({"background-color": "grey"});
      }
   };

   this.removeHighlight = function() {
      for(var gap in this.gapPos){
         $("#"+gap).css({"background-color": "lightgrey"});
      }
      for(var word in this.wordCurrentPos){
         $("#"+word).css({"background-color": "white"});
      }
   };

   this.resizeWord = function(id,inGap) {
      if(inGap){
         $("#"+id).outerWidth(this.gapWidth);
      }else{
         $("#"+id).outerWidth(this.wordDim[id].w);
      }
   };

   this.saveAnswer = function() {
      answer.gapContent = this.gapContent;
   };

   this.validation = function() {
      for(var gapID in this.gapPos){
         if(!this.gapContent[gapID]){
            return {success: false, message: "Please fill-in all the gaps", index: null};
         }
      }
      for(var iWord = 0; iWord < this.words.length; iWord++){
         if(this.words[this.gapContent["gap_"+iWord]] != this.orderedWords[iWord]){
            return {success: false, message: null, index: iWord};
         }
      }
      return {success: true, message: null, index: null};
   };

   this.initDiv();
   this.getWordDim();
   this.styleGaps();
   this.getWordsPos();
   this.initHandlers();
};