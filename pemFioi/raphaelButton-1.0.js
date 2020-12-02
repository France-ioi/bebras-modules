function ElementModer(defaultMode) {
   this.elements = {};
   this.modes = {};
   if(!defaultMode) {
      this.mode = "default";
   }
   else {
      this.mode = defaultMode;
   }

   this.addElement = function(name, element) {
      this.elements[name] = element;
   };

   this.removeElement = function(name) {
      delete this.elements[name];
      for(var mode in this.modes) {
         delete this.modes[mode][name];
      }
   };

   this.setAttr = function(name, mode, attr) {
      if(!this.modes[mode]) {
         this.modes[mode] = {};
      }
      this.modes[mode][name] = attr;

      if(mode == this.mode) {
         this.elements[name].attr(attr);
      }
   };

   this.setMode = function(mode) {
      this.mode = mode;
      if(!this.modes[mode]) {
         this.modes[mode] = {};
         return;
      }
      for(var name in this.modes[mode]) {
         this.elements[name].attr(this.modes[mode][name]);
      }
   };

   this.getMode = function() {
      return this.mode;
   };
}

// LATER: should be allowed to customize the font in the button.

var _BUTTON_GUID = 0;

function Button(paper, xPos, yPos, width, height, text, repeat, initialDelay, stepDelay, delayFactory) {
   var self = this;
   _BUTTON_GUID++;
   this.guid = _BUTTON_GUID;

   this.init = function() {
      this.elements = {};
      var cornerRadius = 4;
      var shadowWidth = 1;
      this.elements.shadow = paper.rect(xPos + 1, yPos, width - 1 + shadowWidth, height + shadowWidth).attr({"r": cornerRadius});
      this.elements.rect = paper.rect(xPos, yPos, width, height).attr({"fill": "#dddddd", "r": cornerRadius});
      this.elements.text = paper.text(xPos + width / 2, yPos + height / 2, text).attr({"font-size": 16});
      this.elements.transLayer = paper.rect(xPos, yPos, width, height).attr({opacity: 0, fill: "black"});
      this.moder = new ElementModer("enabled");
      this.moder.addElement("shadow", this.elements.shadow);
      this.moder.addElement("rect", this.elements.rect);
      this.moder.addElement("text", this.elements.text);
      this.moder.setAttr("rect", "mousedown", {"fill": "#e5e5e5"});
      this.moder.setAttr("rect", "enabled", {"fill": "#dddddd"});
      this.moder.setAttr("rect", "disabled", {"fill": "#dddddd"});
      this.moder.setAttr("shadow", "enabled", {"fill": "black"});
      this.moder.setAttr("text", "enabled", {"fill": "black"});
      this.moder.setAttr("text", "mousedown", {"fill": "#aaaaaa"});
      this.moder.setAttr("text", "disabled", {"fill": "#aaaaaa"});
      this.elements.text[0].style.cursor = "default";
      this.enable();
   };

   this.applyFunction = function(funcName, argsList) {
      if(!argsList) {
         argsList = [];
      }
      for(var iElement in this.elements) {
         var element = this.elements[iElement];
         element[funcName].apply(element, argsList);
      }
   };

   this.enable = function() {
      if(this.enabled) {
         return;
      }
      this.enabled = true;
      this.mouseover = false;
      this.mousedown = false;

      var touchstart = function() {
         self.touchInProgress = true;
         self.lastTouchTime = new Date().getTime();
         handleMouseDown();
      }

      var mousedown = function() {
         if (self.touchInProgress) {
            return;
         }
         if (self.lastTouchTime != null) {
            var timeSinceTouch = new Date().getTime() - self.lastTouchTime;
            if (timeSinceTouch < 2000) {
               return;
            }
         }
         handleMouseDown();
      }
      
      var handleMouseDown = function() {
         if (self.lastMousedownTime != null) {
            var timeSinceDown = new Date().getTime() - self.lastMousedownTime;
            if (timeSinceDown < 100) {
               return;
            }
         }
         self.lastMousedownTime = new Date().getTime();
         if(self.mousedown){
            return
         }
         if(self.enabled) {
            self.mousedown = true;
            self.mouseover = true;
            self.moder.setMode("mousedown");
            if(repeat) {
               self._startRepeater();
            }
         }
      };

      var click = function() {
         if(self.enabled) {
            self.moder.setMode("enabled");
            if(!repeat && self.clickHandler) {
               self.clickHandler(self.clickData);
            }
         }
      };

      var touchend = function() {
         self.touchInProgress = false;
         self.lastTouchTime = new Date().getTime();
         mouseup();
      }

      var mouseup = function() {
         self.touchInProgress = false;
         if(self.enabled) {
            // If we received a mousedown event previously, and now the mouse is up
            // and the mouse is not over the button, then this was a drag attempt.            
            if(self.mousedown && !self.mouseover) {
               if(self.dragAttemptHandler) {
                  self.dragAttemptHandler(self.dragAttemptData);
               }
            }
            self.mousedown = false;
            self.moder.setMode("enabled");
            if(repeat) {
               self._stopRepeater();
            }
         }
      };

      var mouseover = function() {
         if(self.enabled) {
            self.mouseover = true;
         }
      };

      var mouseout = function() {
         if(self.enabled) {
            self.mouseover = false;
         }
      };

      this.elements.transLayer.click(click);
      this.lastTouchTime = null;
      this.touchInProgress = false;
      this.lastMousedownTime = null;
      this.elements.transLayer.touchstart(touchstart);
      this.elements.transLayer.mousedown(mousedown);
      this.elements.transLayer.mouseover(mouseover);
      this.elements.transLayer.mouseout(mouseout);
      this.elements.transLayer.touchend(touchend);
      $(document).bind("mouseup.BUTTON_" + this.guid, mouseup);
      this.moder.setMode("enabled");
   };

   this._startRepeater = function() {
      if(!this.clickHandler) {
         return;
      }
      // First firing - immediately on mouse down.
      this.clickHandler(this.clickData);
      delayFactory.create(this.guid + "$buttonRepeatInitial", function() {
         // Second firing - after the initial delay.
         self.clickHandler(self.clickData);
         delayFactory.create(self.guid + "$buttonRepeatStep", function() {
            // Nth firing - after the step delay.
            self.clickHandler(self.clickData);
         }, stepDelay, true);
      }, initialDelay);
   };

   this._stopRepeater = function() {
      delayFactory.destroy(this.guid + "$buttonRepeatInitial");
      delayFactory.destroy(this.guid + "$buttonRepeatStep");
   };

   this.disable = function() {
      if(repeat) {
         this._stopRepeater();
      }
      this.moder.setMode("disabled");
      this.enabled = false;
      this.mouseover = false;
      this.mousedown = false;
      this.elements.transLayer.unclick();
      this.elements.transLayer.unmousedown();
      this.elements.transLayer.unmouseover();
      this.elements.transLayer.unmouseout();
   };

   this.click = function(handler, data) {
      this.clickHandler = handler;
      this.clickData = data;
   };

   this.unclick = function(handler) {
      delete this.clickHandler;
   };

   this.dragAttempt = function(handler, data) {
      this.dragAttemptHandler = handler;
      this.dragAttemptData = data;
   };

   this.setAttr = function(name, mode, attr) {
      this.moder.setAttr(name, mode, attr);
   };

   this.addElement = function(name, element) {
      this.elements[name] = element;
      this.moder.addElement(name, element);
      this.elements.transLayer.toFront();
   };

   this.changeOverlay = function(attr) {
      this.elements.transLayer.attr(attr);
   };

   this.show = function() {
      this.applyFunction("show");
   };

   this.getMode = function() {
      return this.moder.getMode();
   };

   this.hide = function() {
      this.applyFunction("hide");
   };

   this.remove = function() {
      $(document).unbind(".BUTTON_" + this.guid);
      this.disable();
      this.applyFunction("remove");
   };

   this.toFront = function() {
      this.elements.shadow.toFront();
      this.elements.rect.toFront();
      for(var iElement in this.elements) {
         if(iElement != "shadow" && iElement != "rect"){
            var element = this.elements[iElement];
            element.toFront();
         }
      }
      this.elements.transLayer.toFront();
   };

   this.init();
}

function Keyboard(data) {
   this.paper = data.paper;
   this.keys = data.keys;
   this.nRows = data.nRows;
   this.nCol = data.nCol;
   this.keyFiller = data.keyFiller;
   this.xPos = data.xPos;
   this.yPos = data.yPos;
   this.keyWidth = data.keyWidth;
   this.keyHeight = data.keyHeight;
   this.marginX = data.marginX;
   this.marginY = data.marginY;
   this.shiftOddRows = data.shiftOddRows;
   this.shiftEvenRows = data.shiftEvenRows;
   this.repeat = data.repeat;
   this.initialDelay = data.initialDelay;
   this.stepDelay = data.stepDelay;
   this.delayFactory = data.delayFactory;
   this.attr = data.attr;
   
   this.keyboard = [];

   for(var iRow = 0; iRow < this.nRows; iRow++){
      // this.keyboard[iRow] = [];
      for(var iCol = 0; iCol < this.nCol; iCol++){
         var x = this.xPos + iCol * (this.keyWidth + this.marginX);
         var y = this.yPos + iRow * (this.keyHeight + this.marginY);
         if (this.shiftOddRows && (iRow % 2 == 1)) {
            x += (this.keyWidth + this.marginX) / 2;
         }
         if (this.shiftEvenRows && (iRow % 2 == 0)) {
            x += (this.keyWidth + this.marginX) / 2;
         }
         var keyIndex = iCol + iRow * this.nCol;
         if (this.keys[keyIndex] != null) {
            var specialKey = (this.keyFiller) ? this.keyFiller(keyIndex,x,y) : null;
            if(!specialKey){ 
               var text = this.keys[keyIndex];
               this.keyboard[keyIndex] = new Button(this.paper,x,y,this.keyWidth,this.keyHeight,text,this.repeat, this.initialDelay, this.stepDelay, this.delayFactory);
               if(this.attr){
                  for(var iAttr = 0; iAttr < this.attr.length; iAttr++){
                     var attr = this.attr[iAttr];
                     var name = attr.name;
                     var mode = attr.mode;
                     this.keyboard[keyIndex].setAttr(name,mode,attr.attr);
                  }
               }
            }else{
               this.keyboard[keyIndex] = specialKey;
            }
         }
      }
   }
   
   this.remove = function() {
      for(var iRow = 0; iRow < this.nRows; iRow++){
         for(var iCol = 0; iCol < this.nCol; iCol++){
            var keyIndex = iCol + iRow * this.nCol;
            if (this.keys[keyIndex] != null) {
               this.keyboard[keyIndex].remove();
            }
         }
      }
   }
}
