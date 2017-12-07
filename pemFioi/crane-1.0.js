var _CRANE_GUID = 0;

function Crane(simulationFactory, userSettings) {
   _CRANE_GUID++;
   this.guid = _CRANE_GUID;
   this.simulationID = "$crane$sim$" + this.guid;
   var self = this;

   this._init = function() {
      this.settings = $.extend(true, {}, this.defaultSettings, userSettings);
      this.pickedBlockID = null;
      this.magnetIndex = -1;

      this.columns = this.settings.initialBlockState.length;
      this.floorWidth = (this.settings.blockWidth + this.settings.separatorWidth) * this.columns + this.settings.separatorWidth;
      this.floorLeft = this.settings.floorCenterX - this.floorWidth / 2;
      this.ceilingLeft = this.settings.ceilingCenterX - this.settings.ceilingWidth / 2;
      this.ceilingTop = this.settings.ceilingCenterY - this.settings.ceilingHeight / 2;
      this.magnetInitialX = this._columnIndexToLeftX(-1) + this.settings.blockWidth / 2 - this.settings.magnetWidth / 2;
      this.magnetInitialY = this.settings.ceilingCenterY + this.settings.magnetPadTop;

      this.setActionSequence([]);
   };

   this._defaultBlockDrawer = function(paper, blockID, centerX, centerY) {
      var width = self.settings.blockWidth;
      var height = self.settings.blockHeight;
      var xPos = centerX - width / 2;
      var yPos = centerY - height / 2;
      var rect = paper.rect(xPos, yPos, width, height);
      var text = paper.text(centerX, centerY, blockID.charAt(0)).attr("font-size", 24);
      text[0].style.cursor = "default";
      return [rect, text];
   };

   this._defaultCanDrop = function() {
      return true;
   };

   this._defaultEmpty = function() {};

   this._defaultColumnText = function(column) {
      return column + 1;
   };

   this.getActionSequence = function() {
      return $.extend(true, [], this.actionSequence);
   };

   this.getBlockState = function() {
      return $.extend(true, [], this.blockState);
   };

   this.getActionCount = function() {
      return this.actionSequence.length;
   };

   this.setActionSequence = function(sequence) {
      this.actionSequence = $.extend(true, [], sequence);
      this._createSimulation();
   };

   this._createSimulation = function() {
      this._destroySimulation();
      this.simulation = simulationFactory.create(this.simulationID);
      this.simulation.setAutoPlay(true);
      this.blockState = $.extend(true, [], this.settings.initialBlockState);
      this.pickedBlockID = null;
      this.magnetIndex = -1;

      for(var index = 0; index < this.actionSequence.length; index++) {
         var action = this.actionSequence[index];

         // Omit elements after an error (including the error).
         if(!this._validateAction(action, false)) {
            this.actionSequence.splice(index);
            return;
         }

         this._addStep(action);
      }
   };

   this._addStep = function(column) {
      var step = new SimulationStep();
      
      this._addHorizontalEntries(step, column);
      this.magnetIndex = column;
      if(this.pickedBlockID === null) {
         this._addDownUpEntries(step, column, false);
         this.pickedBlockID = this._getTopBlock(column);
         this.blockState[column].pop();
      }
      else {
         this._addDownUpEntries(step, column, true);
         this.blockState[column].push(this.pickedBlockID);
         this.pickedBlockID = null;
      }

      this.simulation.addStep(step);
   };

   this._columnIndexToLeftX = function(column) {
      return this.floorLeft + this.settings.separatorWidth + (this.settings.blockWidth + this.settings.separatorWidth) * column;
   };

   this._columnIndexToTopY = function(column) {
      return this.settings.floorCenterY - this.settings.floorHeight / 2 - this.blockState[column].length * this.settings.blockHeight;
   };

   this._addHorizontalEntries = function(step, column) {
      if(!this.visuals) {
         return;
      }

      var diffX = this._columnIndexToLeftX(column) - this._columnIndexToLeftX(this.magnetIndex);

      step.addEntry({
         name: "magnetHorizontal",
         action: {
            onExec: this._animationMove,
            duration: this.settings.animTimeHorizontal,
            params: {
               object: this.visuals.magnet,
               diffX: diffX,
               diffY: 0
            }
         }
      });
      step.addEntry({
         name: "ropeHorizontal",
         action: {
            onExec: this._animationMove,
            duration: this.settings.animTimeHorizontal,
            params: {
               object: this.visuals.rope,
               diffX: diffX,
               diffY: 0
            }
         }
      });
      if(this.pickedBlockID !== null) {
         step.addEntries(this._getBlockEntries(this.pickedBlockID, "blockHorizontal", this._animationMove, this.settings.animTimeHorizontal, {
            diffX: diffX,
            diffY: 0
         }));
      }
   };

   this._addDownUpEntries = function(step, column, drop) {
      if(!this.visuals) {
         return;
      }

      var towerTopY = this._columnIndexToTopY(column);

      // If we are dropping an object, the tower Y we are aiming at is above by one block.
      if(drop) {
         towerTopY -= this.settings.blockHeight;
      }

      // Vertical distance objects will travel.
      var diffY = towerTopY - this.magnetInitialY - this.settings.magnetHeight;

      // Down and up entries are put in separate arrays,
      // so they can be inserted in stages to the simulation.
      var down = [];

      // Magnet going down.
      down.push({
         name: "magnetDown",
         action: {
            onExec: this._animationMove,
            duration: this.settings.animTimeVertical,
            params: {
               object: this.visuals.magnet,
               diffX: 0,
               diffY: diffY
            }
         }
      });

      // Rope going down (actually its length increases).
      var ropeX = this._columnIndexToLeftX(column) + this.settings.blockWidth / 2;
      var longRopePath = [
         "M",
         ropeX,
         this.ceilingTop,
         "V",
         this.magnetInitialY + diffY
      ];

      down.push({
         name: "ropeDown",
         action: {
            onExec: this._animationRope,
            duration: this.settings.animTimeVertical,
            params: {
               path: longRopePath
            }
         }
      });

      // If we are dropping a block, it needs to go down.
      if(drop) {
         var blockDownEntries = this._getBlockEntries(this.pickedBlockID, "blockDown", this._animationMove, this.settings.animTimeVertical, {
            diffX: 0,
            diffY: diffY
         });
         down = down.concat(blockDownEntries);
      }

      // Up entries.
      var up = [];

      // Magnet going up.
      up.push({
         name: "magnetUp",
         action: {
            onExec: this._animationMove,
            duration: this.settings.animTimeVertical,
            params: {
               object: this.visuals.magnet,
               diffX: 0,
               diffY: -diffY
            }
         }
      });

      // Rope going up (actually it just gets shorter).
      var shortRopePath = [
         "M",
         ropeX,
         this.ceilingTop,
         "V",
         this.magnetInitialY
      ];

      up.push({
         name: "ropeUp",
         action: {
            onExec: this._animationRope,
            duration: this.settings.animTimeVertical,
            params: {
               path: shortRopePath
            }
         }
      });

      // If we are picking up a block, it must go up.
      if(!drop) {
         var blockUpID = this._getTopBlock(column);
         var blockUpEntries = this._getBlockEntries(blockUpID, "blockUp", this._animationMove, this.settings.animTimeVertical, {
            diffX: 0,
            diffY: -diffY
         });
         up = up.concat(blockUpEntries);
      }

      step.addEntriesAllParents(down);
      step.addEntriesAllParents(up);
   };

   this._getBlockEntries = function(id, namePrefix, onExec, duration, params) {
      var entries = [];
      var elements = this.visuals.blocks[id];
      for(var iElement = 0; iElement < elements.length; iElement++) {
         var element = elements[iElement];
         entries.push({
            name: namePrefix + "_" + iElement,
            action: {
               onExec: onExec,
               duration: duration,
               params: $.extend(true, {object: element}, params)
            }
         });
      }
      return entries;
   };

   this._animationMove = function(params, duration, callback) {
      var object = params.object;
      var newAttrs = {};
      if(object.type === "path") {
         var transformation = ["T", params.diffX, params.diffY];
         var newPath = Raphael.transformPath(object.attrs.path, transformation);
         newAttrs.path = newPath;
      }
      else {
         newAttrs.x = object.attrs.x + params.diffX;
         newAttrs.y = object.attrs.y + params.diffY;
      }

      if(duration === 0) {
         object.attr(newAttrs);
         callback();
      }
      else {
         return object.animate(newAttrs, duration, callback);
      }
   };

   this._animationRope = function(params, duration, callback) {
      if(duration === 0) {
         self.visuals.rope.attr(params);
         callback();
      }
      else {
         return self.visuals.rope.animate(params, duration, callback);
      }
   };

   this._getTopBlock = function(column) {
      var tower = this.blockState[column];
      if(tower.length === 0) {
         return null;
      }
      return tower[tower.length - 1];
   };

   this.draw = function() {
      var paper = this.settings.paper;
      this.visuals = {};

      if(!this.settings.targetMode) {
         // Ceiling.
         this.visuals.ceiling = paper.rect(
            this.ceilingLeft,
            this.ceilingTop,
            this.settings.ceilingWidth,
            this.settings.ceilingHeight
         ).attr(this.settings.ceilingAttr);

         // Rope
         this.visuals.rope = paper.path([]).attr(this.settings.ropeAttr);

         // Magnet
         this.visuals.magnet = paper.image(this.settings.magnetImageName, 0, 0, this.settings.magnetWidth, this.settings.magnetHeight);

         // Buttons.
         this._drawButtons();
      }

      if(this.settings.targetMode) {
         // Column labels.
         this._drawLabels();
      }

      // Floor.
      this.visuals.floor = paper.path([
         "M",
         this.floorLeft,
         this.settings.floorCenterY,
         "H",
         this.floorLeft + this.floorWidth
      ]).attr(this.settings.floorAttr);

      // Separators.
      this.visuals.separators = {};
      for(var iSep = 0; iSep <= this.columns; iSep++) {
         var separatorX = this._columnIndexToLeftX(iSep) - this.settings.separatorWidth / 2;
         this.visuals.separators[iSep] = paper.path([
            "M",
            separatorX,
            this.settings.floorCenterY,
            "V",
            this.settings.floorCenterY - this.settings.separatorHeight
         ]).attr(this.settings.separatorAttr);
      }

      // Blocks.
      this._drawBlocks();

      // Reset positions.
      this.resetVisual();
   };

   this._drawBlocks = function() {
      this.visuals.blocks = {};
      for(var column = 0; column < this.columns; column++) {
         var tower = this.settings.initialBlockState[column];
         for(var index = 0; index < tower.length; index++) {
            var id = tower[index];
            this.visuals.blocks[id] = this.settings.blockDrawer(this.settings.paper, id, 0, 0);
            for(var iElement in this.visuals.blocks[id]) {
               this.visuals.blocks[id][iElement].click(self.settings.onBlockClick);
            }
         }
      }
   };

   this._drawButtons = function() {
      this.visuals.buttons = {};
      var yPos = this.settings.floorCenterY + this.settings.buttonPadTop;
      for(var column = 0; column < this.columns; column++) {
         var xPos = this._columnIndexToLeftX(column) + this.settings.blockWidth / 2 - this.settings.buttonWidth / 2;
         var text = this.settings.columnTextFunction(column);
         this.visuals.buttons[column] = new Button(this.settings.paper, xPos, yPos, this.settings.buttonWidth, this.settings.buttonHeight, text);
         this.visuals.buttons[column].click(this._clickButton, {column: column});
      }
   };

   this._drawLabels = function() {
      this.visuals.labels = {};
      var yPos = this.settings.floorCenterY + this.settings.buttonPadTop + this.settings.buttonHeight / 2;
      for(var column = 0; column < this.columns; column++) {
         var xPos = this._columnIndexToLeftX(column) + this.settings.blockWidth / 2;
         var text = this.settings.columnTextFunction(column);
         this.visuals.labels[column] = this.settings.paper.text(xPos, yPos, text).attr(this.settings.labelTextAttr);
         this.visuals.labels[column][0].style.cursor = "default";
      }
   };

   this._clickButton = function(data) {
      var column = data.column;
      if(!self._validateAction(column, true)) {
         return;
      }

      // Valid action.
      self.actionSequence.push(column);
      self.settings.onClick(column);
      self._addStep(column);
      self.simulation.addStepWithEntry({
         name: "finish",
         action: {
            onExec: self._onStepFinish
         }
      });
      if(!self.simulation.isPlaying() && self.simulation.canPlay()) {
         self.simulation.setExpedite(false);
         self.simulation.play();
      }
   };

   this._onStepFinish = function(params, duration, callback) {
      /* If the step being finished now is the last one, this is currently the simulation end.
       * This condition may be false if the user clicked on another button before we reach here.
       */
      if(self.simulation.isOnLastStep()) {
         self.settings.onSimulationFinish();
      }
      callback();
   };

   this._validateAction = function(column, enableErrors) {
      if(self.pickedBlockID === null) {
         if(self.blockState[column].length === 0) {
            self.settings.onError("pickup", self.blockState, column);
            return false;
         }
      }
      else if(!self.settings.canDrop(self.getBlockState(), column, self.pickedBlockID)) {
         self.settings.onError("drop", self.blockState, column, self.pickedBlockID);
         return false;
      }
      return true;
   };

   this.resetVisual = function() {
      if(!this.settings.targetMode) {
         // Magnet
         this.visuals.magnet.attr({
            x: this.magnetInitialX,
            y: this.magnetInitialY
         });

         var ropeX = this.magnetInitialX + this.settings.magnetWidth / 2;

         // Rope.
         this.visuals.rope.attr({
            path: [
               "M",
               ropeX,
               this.ceilingTop,
               "V",
               this.magnetInitialY
            ]
         });
      }

      // Blocks.
      for(var column = 0; column < this.columns; column++) {
         var tower = this.settings.initialBlockState[column];
         for(var index = 0; index < tower.length; index++) {
            var id = tower[index];
            this._initializeBlockPosition(id, column, index);
         }
      }
   };

   this._initializeBlockPosition = function(id, column, index) {
      var leftX = this._columnIndexToLeftX(column);
      var centerX = leftX + this.settings.blockWidth / 2;
      var topY = this.settings.floorCenterY - this.settings.floorHeight / 2 - (index + 1) * this.settings.blockHeight;
      var centerY = topY + this.settings.blockHeight / 2;

      var contents = this.visuals.blocks[id];
      for(var iElement in contents) {
         var element = contents[iElement];
         if(element.type === "text") {
            element.attr({
               x: centerX,
               y: centerY
            });
         }
         else {
            element.attr({
               x: leftX,
               y: topY
            });
         }
         // TODO support paths/circles?
      }
   };

   this.expediteVisual = function() {
      this.simulation.setExpedite(true);
      if(this.simulation.canPlay() && !this.simulation.isPlaying()) {
         this.simulation.play();
      }
   };

   this.canUndo = function() {
      return this.actionSequence.length > 0;
   };

   this.undoVisual = function() {
      if(this.actionSequence.length === 0) {
         return;
      }
      this._destroySimulation();
      this.actionSequence.pop();
      this.resetVisual();
      this._createSimulation();
      this.expediteVisual();
   };

   this._destroySimulation = function() {
      simulationFactory.destroy(this.simulationID);
   };

   this.remove = function() {
      this._destroySimulation();

      if(!this.visuals) {
         return;
      }
      
      for(var iBlock in this.visuals.blocks) {
         for(var iBlockElement in this.visuals.blocks[iBlock]) {
            this.visuals.blocks[iBlock][iBlockElement].remove();
         }
      }
      delete this.visuals.blocks;

      for(var iSep in this.visuals.separators) {
         this.visuals.separators[iSep].remove();
      }
      delete this.visuals.separators;

      for(var iButton in this.visuals.buttons) {
         this.visuals.buttons[iButton].remove();
      }
      delete this.visuals.buttons;

      for(var iLabel in this.visuals.labels) {
         this.visuals.labels[iLabel].remove();
      }
      delete this.visuals.labels;

      for(var iElement in this.visuals) {
         this.visuals[iElement].remove();
      }

      this.visuals = null;
   };

   this.defaultSettings = {
      targetMode: false,
      canDrop: this._defaultCanDrop,
      onError: this._defaultEmpty,
      onClick: this._defaultEmpty,
      onBlockClick: this._defaultEmpty,
      onSimulationFinish: this._defaultEmpty,
      animTimeVertical: 150,
      animTimeHorizontal: 150,
      blockWidth: 50,
      blockHeight: 50,
      blockDrawer: this._defaultBlockDrawer,
      separatorWidth: 4,
      separatorHeight: 15,
      separatorAttr: {
         "stroke-width": 4
      },
      floorHeight: 4,
      floorAttr: {
         "stroke-width": 4
      },
      ceilingHeight: 4,
      ceilingAttr: {
         fill: "orange",
         "stroke-width": 1
      },
      ropeWidth: 1,
      ropeAttr: {
         "stroke-width": 1
      },
      buttonWidth: 40,
      buttonHeight: 40,
      labelTextAttr: {
         "font-size": 16
      },
      columnTextFunction: this._defaultColumnText
   };

   this._init();
}