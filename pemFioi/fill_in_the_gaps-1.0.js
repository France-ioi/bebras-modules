function FillInTheGaps(settings) {
   var self = this;
   this.html = settings.html;
   this.divID = settings.divID;
   this.words = settings.words;
   this.validEntry = settings.validEntry;
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
   // this.stockDim = {};

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
         if($(this).outerWidth() > self.gapWidth){
            self.gapWidth = $(this).outerWidth();
         }
         if($(this).outerHeight() > self.gapHeight){
            self.gapHeight = $(this).outerHeight();
         }
      });
      $("#stock span").each(function(){
         self.wordDim[$(this).attr("id")] = {
            w: self.gapWidth,
            h: self.gapHeight
         };
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
      var stockDim = this.getStockDim();
      $("#stock").css({
         height: stockDim.h+"px"
      });
      var leftBorder = 0;
      for(var iWord = 0; iWord < this.words.length; iWord++){
         var line = Math.floor(iWord/stockDim.nbWordsPerLine);
         if(line + 1 < stockDim.nbLines){
            var nbWordsInLine = stockDim.nbWordsPerLine;
         }else{
            var nbWordsInLine = this.words.length%stockDim.nbWordsPerLine;
         }
         var margin = ((stockDim.w - (nbWordsInLine*(this.gapWidth)))/(nbWordsInLine+1));
 
         var top = this.margin + line*(this.gapHeight + this.margin);
         var left = margin + leftBorder;
         var id = "word_"+iWord;
         var gapID = "gap_"+iWord;
         $("#"+id).css({
            position: "absolute",
            top: top+"px",
            left: left+"px",
            width: this.gapWidth,
            padding: (this.margin/2)+"px 0"
         });
         this.wordOriginPos[id] = {
            x: left,
            y: top
         };
         this.wordCurrentPos[id] = {
            x: left,
            y: top
         };
         if((iWord + 1)%stockDim.nbWordsPerLine == 0){
            leftBorder = 0;
         }else{
            leftBorder += margin + this.wordDim[id].w;
         }
         this.gapPos[gapID] = {
            x: $("#"+gapID).position().left,
            y: $("#"+gapID).position().top
         };
      }
   };

   this.getStockDim = function() {
      var parentWidth = $("#"+this.divID).width();
      var nbWordsPerLine = Math.floor(parentWidth/(this.gapWidth + this.margin));
      var nbLines = Math.ceil(this.words.length/nbWordsPerLine);
      var stockHeight = nbLines*(this.gapHeight + this.margin) + this.margin;
      return {w: parentWidth, h: stockHeight, nbLines: nbLines, nbWordsPerLine: nbWordsPerLine};
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
            if(self.answer)
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
               // self.resizeWord(prevID,false);
               self.toPos(prevID,self.wordOriginPos[prevID].x,self.wordOriginPos[prevID].y);
               self.removeHighlight();
            }
            // self.resizeWord(id,true);
            var newX = self.gapPos[gap].x;
            var newY = self.gapPos[gap].y;
            self.toPos(id,newX,newY);
            self.gapContent[gap] = id.substr(5);
            if(self.answer)
               self.saveAnswer();
         }else{
            // self.resizeWord(id,false);
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

   // this.resizeWord = function(id,inGap) {
   //    if(inGap){
   //       $("#"+id).outerWidth(this.gapWidth);
   //    }else{
   //       $("#"+id).outerWidth(this.wordDim[id].w);
   //    }
   // };

   this.saveAnswer = function() {
      answer.gapContent = this.gapContent;
   };

   this.validation = function(mode) {
      for(var gapID in this.gapPos){
         if(!this.gapContent[gapID]){
            return "Please fill-in all the gaps";
         }
      }
      if(mode == 2){
         var nbErrors = 0;
      }
      for(var iWord = 0; iWord < this.words.length; iWord++){
         if(!this.validEntry[iWord].includes(parseInt(this.gapContent["gap_"+iWord]))){
            switch(mode){
               case 1:
                  return "There is at least one error";
               case 2:
                  nbErrors++;
                  break;
               case 3:
                  return "Error in entry "+(iWord + 1);
            }
         }
      }
      if(mode == 2 && nbErrors > 0){
         if(nbErrors > 1){
            return "There are "+nbErrors+" errors";
         }else{
            return "There is "+nbErrors+" error";
         }
      }
   };

   this.initDiv();
   this.getWordDim();
   this.styleGaps();
   this.getWordsPos();
   this.initHandlers();
};