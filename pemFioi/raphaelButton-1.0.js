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
}

// LATER: should be allowed to customize the font in the button.

var _BUTTON_GUID = 0;

function Button(paper, xPos, yPos, width, height, text, repeat, initialDelay, stepDelay, delayFactory) {
   _BUTTON_GUID++;
   this.guid = _BUTTON_GUID;
   this.elements = {};
   var cornerRadius = 4;
   var shadowWidth = 1;
   this.elements.shadow = paper.rect(xPos+1, yPos, width-1 + shadowWidth, height + shadowWidth).attr({"r": cornerRadius});
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
   this.buttonMode = "";

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
      if(this.buttonMode == "enabled") {
         return;
      }
      this.buttonMode = "enabled";
      var that = this;

      var mousedown = function() {
         if(that.buttonMode != "enabled") {
            return;
         }

         that.moder.setMode("mousedown");
         if(repeat) {
            that._startRepeater();
         }
      };

      var click = function() {
         if(that.buttonMode == "enabled") {
            that.moder.setMode("enabled");
            if(!repeat && that.clickHandler) {
               that.clickHandler(that.clickData);
            }
         }
      };
      var mouseup = function() {
         if(that.buttonMode == "enabled") {
            that.moder.setMode("enabled");
            if(repeat) {
               that._stopRepeater();
            }
         }
      };

      this.elements.transLayer.click(click);
      this.elements.transLayer.mousedown(mousedown);
      $(document).bind("mouseup.BUTTON_" + this.guid, mouseup);
      this.moder.setMode("enabled");
   };

   this._startRepeater = function() {
      if(!this.clickHandler) {
         return;
      }
      var self = this;
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
      this.buttonMode = "disabled";
      this.elements.transLayer.unclick();
      this.elements.transLayer.unmousedown();
   };

   this.click = function(handler, data) {
      this.clickHandler = handler;
      this.clickData = data;
   };

   this.unclick = function(handler) {
      delete this.clickHandler;
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

   this.hide = function() {
      this.applyFunction("hide");
   };

   this.remove = function() {
      $(document).unbind(".BUTTON_" + this.guid);
      this.disable();
      this.applyFunction("remove");
   };

   this.enable();
}
