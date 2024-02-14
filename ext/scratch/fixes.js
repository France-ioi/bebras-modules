Blockly.createDom_ = function(container, options) {
  // Sadly browsers (Chrome vs Firefox) are currently inconsistent in laying
  // out content in RTL mode.  Therefore Blockly forces the use of LTR,
  // then manually positions content in RTL as needed.
  container.setAttribute('dir', 'LTR');
  // Closure can be trusted to create HTML widgets with the proper direction.
  goog.ui.Component.setDefaultRightToLeft(options.RTL);

  // Load CSS.
  Blockly.Css.inject(options.hasCss, options.pathToMedia);

  // Build the SVG DOM.
  var svg = Blockly.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'class': 'blocklySvg'
  }, container);
  var defs = Blockly.createSvgElement('defs', {}, svg);
  // Each filter/pattern needs a unique ID for the case of multiple Blockly
  // instances on a page.  Browser behaviour becomes undefined otherwise.
  // https://neil.fraser.name/news/2015/11/01/
  // TODO (tmickel): Look into whether block highlighting still works.
  // Reference commit:
  // https://github.com/google/blockly/commit/144be4d49f36fdba260a26edbd170ae75bbc37a6
  var rnd = String(Math.random()).substring(2);


  // Add embossFilter
  var embossFilter = Blockly.createSvgElement('filter',
      {'id': 'blocklyEmbossFilter' + rnd}, defs);
  Blockly.createSvgElement('feGaussianBlur',
      {'in': 'SourceAlpha', 'stdDeviation': 1, 'result': 'blur'}, embossFilter);
  var feSpecularLighting = Blockly.createSvgElement('feSpecularLighting',
      {'in': 'blur', 'surfaceScale': 1, 'specularConstant': 0.5,
       'specularExponent': 10, 'lighting-color': 'white', 'result': 'specOut'},
      embossFilter);
  Blockly.createSvgElement('fePointLight',
      {'x': -5000, 'y': -10000, 'z': 20000}, feSpecularLighting);
  Blockly.createSvgElement('feComposite',
      {'in': 'specOut', 'in2': 'SourceAlpha', 'operator': 'in',
       'result': 'specOut'}, embossFilter);
  Blockly.createSvgElement('feComposite',
      {'in': 'SourceGraphic', 'in2': 'specOut', 'operator': 'arithmetic',
       'k1': 0, 'k2': 1, 'k3': 1, 'k4': 0}, embossFilter);
  options.embossFilterId = embossFilter.id;


  // Using a dilate distorts the block shape.
  // Instead use a gaussian blur, and then set all alpha to 1 with a transfer.
  var stackGlowFilter = Blockly.createSvgElement('filter',
      {'id': 'blocklyStackGlowFilter',
        'height': '160%', 'width': '180%', y: '-30%', x: '-40%'}, defs);
  options.stackGlowBlur = Blockly.createSvgElement('feGaussianBlur',
      {'in': 'SourceGraphic',
      'stdDeviation': Blockly.STACK_GLOW_RADIUS}, stackGlowFilter);
  // Set all gaussian blur pixels to 1 opacity before applying flood
  var componentTransfer = Blockly.createSvgElement('feComponentTransfer', {'result': 'outBlur'}, stackGlowFilter);
  Blockly.createSvgElement('feFuncA',
      {'type': 'table', 'tableValues': '0' + ' 1'.repeat(16)}, componentTransfer);
  // Color the highlight
  Blockly.createSvgElement('feFlood',
      {'flood-color': Blockly.Colours.stackGlow,
       'flood-opacity': Blockly.Colours.stackGlowOpacity, 'result': 'outColor'}, stackGlowFilter);
  Blockly.createSvgElement('feComposite',
      {'in': 'outColor', 'in2': 'outBlur',
       'operator': 'in', 'result': 'outGlow'}, stackGlowFilter);
  Blockly.createSvgElement('feComposite',
      {'in': 'SourceGraphic', 'in2': 'outGlow', 'operator': 'over'}, stackGlowFilter);

  // Filter for replacement marker
  var replacementGlowFilter = Blockly.createSvgElement('filter',
      {'id': 'blocklyReplacementGlowFilter',
        'height': '160%', 'width': '180%', y: '-30%', x: '-40%'}, defs);
  Blockly.createSvgElement('feGaussianBlur',
      {'in': 'SourceGraphic',
      'stdDeviation': Blockly.REPLACEMENT_GLOW_RADIUS}, replacementGlowFilter);
  // Set all gaussian blur pixels to 1 opacity before applying flood
  var componentTransfer = Blockly.createSvgElement('feComponentTransfer', {'result': 'outBlur'}, replacementGlowFilter);
  Blockly.createSvgElement('feFuncA',
      {'type': 'table', 'tableValues': '0' + ' 1'.repeat(16)}, componentTransfer);
  // Color the highlight
  Blockly.createSvgElement('feFlood',
      {'flood-color': Blockly.Colours.replacementGlow,
       'flood-opacity': Blockly.Colours.replacementGlowOpacity, 'result': 'outColor'}, replacementGlowFilter);
  Blockly.createSvgElement('feComposite',
      {'in': 'outColor', 'in2': 'outBlur',
       'operator': 'in', 'result': 'outGlow'}, replacementGlowFilter);
  Blockly.createSvgElement('feComposite',
      {'in': 'SourceGraphic', 'in2': 'outGlow', 'operator': 'over'}, replacementGlowFilter);

  var disabledPattern = Blockly.createSvgElement('pattern',
      {'id': 'blocklyDisabledPattern' + rnd,
       'patternUnits': 'userSpaceOnUse',
       'width': 10, 'height': 10}, defs);
  Blockly.createSvgElement('rect',
      {'width': 10, 'height': 10, 'fill': '#aaa'}, disabledPattern);
  Blockly.createSvgElement('path',
      {'d': 'M 0 0 L 10 10 M 10 0 L 0 10', 'stroke': '#cc0'}, disabledPattern);
  options.disabledPatternId = disabledPattern.id;

  var gridPattern = Blockly.createSvgElement('pattern',
      {'id': 'blocklyGridPattern' + rnd,
       'patternUnits': 'userSpaceOnUse'}, defs);
  if (options.gridOptions['length'] > 0 && options.gridOptions['spacing'] > 0) {
    Blockly.createSvgElement('line',
        {'stroke': options.gridOptions['colour']},
        gridPattern);
    if (options.gridOptions['length'] > 1) {
      Blockly.createSvgElement('line',
          {'stroke': options.gridOptions['colour']},
          gridPattern);
    }
    // x1, y1, x1, x2 properties will be set later in updateGridPattern_.
  }
  options.gridPattern = gridPattern;
  return svg;
};

// Fix arguments missing, possibility to silence error message
Blockly.Workspace.prototype.deleteVariable = function(name, silent) {
  var workspace = this;
  function doDeletion(variableUses, index) {
    Blockly.Events.setGroup(true);
    for (var i = 0; i < variableUses.length; i++) {
      variableUses[i].dispose(true, false);
    }
    Blockly.Events.setGroup(false);
    workspace.variableList.splice(index, 1);
  }
  var variableIndex = this.variableIndexOf(name);
  if (variableIndex != -1) {
    // Check whether this variable is a function parameter before deleting.
    var uses = this.getVariableUses(name);
    for (var i = 0, block; block = uses[i]; i++) {
      if ((block.type == 'procedures_defnoreturn' ||
        block.type == 'procedures_defreturn') && !silent) {
        var procedureName = block.getFieldValue('NAME');
        Blockly.alert(
            Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE.
            replace('%1', name).
            replace('%2', procedureName));
        return;
      }
    }

    if (uses.length > 1) {
      // Confirm before deleting multiple blocks.
      Blockly.confirm(
          Blockly.Msg.DELETE_VARIABLE_CONFIRMATION.replace('%1', uses.length).
          replace('%2', name),
          function(ok) {
            if (ok) {
              doDeletion(uses, variableIndex);
            }
          });
    } else {
      // No confirmation necessary for a single block.
      doDeletion(uses, variableIndex);
    }
  }
};


// Change gap between blocks in the toolbox
Blockly.Flyout.prototype.GAP_Y = 14;

Blockly.Block.prototype.getVariableField = function () {
  for(var i=0; i<this.childBlocks_.length; i++) {
    if(this.childBlocks_[i].type == 'data_variablemenu') {
      return this.childBlocks_[i].getFieldValue('VARIABLE');
    }
  }
  return null;
};

// Modify updateColour to leave placeholders alone
Blockly.BlockSvg.prototype.updateColour = function() {
  var strokeColour = this.getColourTertiary();
  if (this.isShadow() && this.parentBlock_) {
    // Pull shadow block stroke colour from parent block's tertiary if possible.
    strokeColour = this.parentBlock_.getColourTertiary();
    // Special case: if we contain a colour field, set to a special stroke colour.
    if (this.inputList[0] &&
        this.inputList[0].fieldRow[0] &&
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour) {
      strokeColour = Blockly.Colours.colourPickerStroke;
    }
  }

  // Use main colour for placeholder strokes
  if(this.type.substring(0, 12) == 'placeholder_') {
    strokeColour = this.getColour();
  }

  // Render block stroke
  this.svgPath_.setAttribute('stroke', strokeColour);

  // Render block fill
  var fillColour = (this.isGlowingBlock_) ? this.getColourSecondary() : this.getColour();
  this.svgPath_.setAttribute('fill', fillColour);

  // Render opacity
  this.svgPath_.setAttribute('fill-opacity', this.getOpacity());

  // Update colours of input shapes.
  for (var shape in this.inputShapes_) {
    this.inputShapes_[shape].setAttribute('fill', this.getColourTertiary());
  }

  // Render icon(s) if applicable
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    icons[i].updateColour();
  }

  // Bump every dropdown to change its colour.
  for (var x = 0, input; input = this.inputList[x]; x++) {
    for (var y = 0, field; field = input.fieldRow[y]; y++) {
      field.setText(null);
    }
  }
};


// Add a border when a block is glowing to make it more obvious
Blockly.BlockSvg.prototype.setGlowBlock = function(isGlowingBlock) {
  var blockSvg = this.getSvgRoot();
  for(var i=0; i<blockSvg.children.length; i++) {
     if(blockSvg.children[i].classList[0] == 'blocklyPath') {
        blockSvg = blockSvg.children[i];
        break;
     }
  }
  blockSvg.style.strokeWidth = isGlowingBlock ? '4px' : '';
  this.isGlowingBlock_ = isGlowingBlock;
  this.updateColour();
};

Blockly.BlockSvg.prototype.handleDragFree_ = function(oldXY, newXY, e) {
  // Fix : move the drag surface to the right workspace position when moving a block from a sub-workspace
  if(!Blockly.dragMutatorStyle) {
     Blockly.dragMutatorStyle = document.createElement('style');
     document.head.appendChild(Blockly.dragMutatorStyle);
  }
  if(this.workspace !== Blockly.mainWorkspace) {
     // This is done through CSS because Scratch computations get wrong if you
     // translate the SVG differently
     var transformData = (
        $(this.workspace.getParentSvg())
        .closest('.blocklyBubbleCanvas').children()
        .attr('transform').match(/translate\(([.0-9-]+),([.0-9-]+)\)/));
     var transformStr = 'translate3d(' + transformData[1] + 'px, ' + transformData[2] + 'px, 0px)';
     Blockly.dragMutatorStyle.innerText = (
        '.blocklyDraggable.blocklyDragging.blocklySelected { transform: '+transformStr+'; }');
  } else {
     Blockly.dragMutatorStyle.innerText = '';
  }

  var dxy = goog.math.Coordinate.difference(oldXY, this.dragStartXY_);
  this.workspace.dragSurface.translateSurface(newXY.x, newXY.y);
  // Drag all the nested bubbles.
  for (var i = 0; i < this.draggedBubbles_.length; i++) {
    var commentData = this.draggedBubbles_[i];
    commentData.bubble.setIconLocation(
        goog.math.Coordinate.sum(commentData, dxy));
  }

  // Check to see if any of this block's connections are within range of
  // another block's connection.
  var myConnections = this.getConnections_(false);
  // Also check the last connection on this stack
  var lastOnStack = this.lastConnectionInStack();
  if (lastOnStack && lastOnStack != this.nextConnection) {
    myConnections.push(lastOnStack);
  }
  var closestConnection = null;
  var localConnection = null;
  var radiusConnection = Blockly.SNAP_RADIUS;
  // If there is already a connection highlighted,
  // increase the radius we check for making new connections.
  // Why? When a connection is highlighted, blocks move around when the insertion
  // marker is created, which could cause the connection became out of range.
  // By increasing radiusConnection when a connection already exists,
  // we never "lose" the connection from the offset.
  if (Blockly.localConnection_ && Blockly.highlightedConnection_) {
    radiusConnection = Blockly.CONNECTING_SNAP_RADIUS;
  }
  for (i = 0; i < myConnections.length; i++) {
    var myConnection = myConnections[i];
    var neighbour = myConnection.closest(radiusConnection, dxy);
    if (neighbour.connection) {
      closestConnection = neighbour.connection;
      localConnection = myConnection;
      radiusConnection = neighbour.radius;
    }
  }

  var updatePreviews = true;
  if (localConnection && localConnection.type == Blockly.OUTPUT_VALUE) {
    updatePreviews = true; // Always update previews for output connections.
  } else if (Blockly.localConnection_ && Blockly.highlightedConnection_) {
    var xDiff = Blockly.localConnection_.x_ + dxy.x -
        Blockly.highlightedConnection_.x_;
    var yDiff = Blockly.localConnection_.y_ + dxy.y -
        Blockly.highlightedConnection_.y_;
    var curDistance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    // Slightly prefer the existing preview over a new preview.
    if (closestConnection && radiusConnection > curDistance -
        Blockly.CURRENT_CONNECTION_PREFERENCE) {
      updatePreviews = false;
    }
  }

  if (updatePreviews) {
    var candidateIsLast = (localConnection == lastOnStack);
    this.updatePreviews(closestConnection, localConnection, radiusConnection,
        e, newXY.x - this.dragStartXY_.x, newXY.y - this.dragStartXY_.y,
        candidateIsLast);
  }
};

// Change behavior when we attach a data_variable along a data_variablemenu
Blockly.Connection.prototype.connect_ = function(childConnection) {
  var parentConnection = this;
  var parentBlock = parentConnection.getSourceBlock();
  var childBlock = childConnection.getSourceBlock();
  var isSurroundingC = false;
  if (parentConnection == parentBlock.getFirstStatementConnection()) {
    isSurroundingC = true;
  }
  // Disconnect any existing parent on the child connection.
  if (childConnection.isConnected()) {
    // Scratch-specific behaviour:
    // If we're using a c-shaped block to surround a stack, remember where the
    // stack used to be connected.
    if (isSurroundingC) {
      var previousParentConnection = childConnection.targetConnection;
    }
    childConnection.disconnect();
  }
  if (parentConnection.isConnected()) {
    // Other connection is already connected to something.
    // Disconnect it and reattach it or bump it as needed.
    var orphanBlock = parentConnection.targetBlock();

    if(orphanBlock.type == 'data_variablemenu' && orphanBlock.isShadow()) {
      // Special behavior for variables
      if(childBlock.type != 'data_variable') {
        // Abort
        return;
      }
      try {
        // Set the current variable field to the new variable name
        var newVarName = childBlock.getVariableField();
        var oldVarField = orphanBlock.inputList[0].fieldRow[0];
        oldVarField.setValue(newVarName);

        // Delete the data_variable which was dragged onto here
        setTimeout(function () { childBlock.dispose(); }, 0);
      } catch(e) {
        // Abort
      }
      return;
    }

    var shadowDom = parentConnection.getShadowDom();
    // Temporarily set the shadow DOM to null so it does not respawn.
    parentConnection.setShadowDom(null);
    // Displaced shadow blocks dissolve rather than reattaching or bumping.
    if (orphanBlock.isShadow()) {
      // Save the shadow block so that field values are preserved.
      shadowDom = Blockly.Xml.blockToDom(orphanBlock);
      orphanBlock.dispose();
      orphanBlock = null;
    } else if (parentConnection.type == Blockly.NEXT_STATEMENT) {
      // Statement connections.
      // Statement blocks may be inserted into the middle of a stack.
      // Split the stack.
      if (!orphanBlock.previousConnection) {
        throw 'Orphan block does not have a previous connection.';
      }
      // Attempt to reattach the orphan at the bottom of the newly inserted
      // block.  Since this block may be a stack, walk down to the end.
      var newBlock = childBlock;
      while (newBlock.nextConnection) {
        var nextBlock = newBlock.getNextBlock();
        if (nextBlock && !nextBlock.isShadow()) {
          newBlock = nextBlock;
        } else {
          if (orphanBlock.previousConnection.checkType_(
              newBlock.nextConnection)) {
            newBlock.nextConnection.connect(orphanBlock.previousConnection);
            orphanBlock = null;
          }
          break;
        }
      }
    }
    if (orphanBlock) {
      // Unable to reattach orphan.
      parentConnection.disconnect();
      if (Blockly.Events.recordUndo) {
        // Bump it off to the side after a moment.
        var group = Blockly.Events.getGroup();
        setTimeout(function() {
          // Verify orphan hasn't been deleted or reconnected (user on meth).
          if (orphanBlock.workspace && !orphanBlock.getParent()) {
            Blockly.Events.setGroup(group);
            if (orphanBlock.outputConnection) {
              orphanBlock.outputConnection.bumpAwayFrom_(parentConnection);
            } else if (orphanBlock.previousConnection) {
              orphanBlock.previousConnection.bumpAwayFrom_(parentConnection);
            }
            Blockly.Events.setGroup(false);
          }
        }, Blockly.BUMP_DELAY);
      }
    }
    // Restore the shadow DOM.
    parentConnection.setShadowDom(shadowDom);
  }

  if (isSurroundingC && previousParentConnection) {
    previousParentConnection.connect(parentBlock.previousConnection);
  }

  var event;
  if (Blockly.Events.isEnabled()) {
    event = new Blockly.Events.Move(childBlock);
  }
  // Establish the connections.
  Blockly.Connection.connectReciprocally_(parentConnection, childConnection);
  // Demote the inferior block so that one is a child of the superior one.
  childBlock.setParent(parentBlock);
  if (event) {
    event.recordNew();
    Blockly.Events.fire(event);
  }
};

Blockly.Workspace.prototype.getFlyout = function () { return null; };

Blockly.Workspace.prototype.remainingCapacity = function(maxBlocks) {
  if (!maxBlocks) {
    maxBlocks = this.maxBlocks();
    if (!maxBlocks) {
      return Infinity;
    }
  }

  // Count number of blocks
  var blocks = this.getAllBlocks();
  var blockCount = 0;
  for (var b = 0; b < blocks.length; b++) {
    var block = blocks[b];
    // Don't count insertion markers (shadows when moving a block)
    if(block.isInsertionMarker_) {
      continue;
    }
    // Don't count placeholders
    if(block.type.substring(0, 12) == 'placeholder_') {
      continue;
    }
    // Counting is tricky because some blocks in Scratch don't count in Blockly
    if(block.parentBlock_) {
      // There's a parent (container) block
      if((block.type == 'math_number' && block.parentBlock_.type == 'control_repeat') ||
         (block.type == 'data_variablemenu' &&
            (block.parentBlock_.type == 'data_variable' ||
             block.parentBlock_.type == 'data_setvariableto' ||
             block.parentBlock_.type == 'data_changevariableby'))) {
        continue;
      }
    } else {
      if(block.type == 'data_variablemenu') {
        continue;
      }
    }
    if(block.type == 'data_itemoflist' || block.type == 'data_replaceitemoflist') {
      // Count one extra for these ones
      blockCount += 1;
    }
    blockCount += 1;
  }
  return maxBlocks - blockCount;
};

// Pass to this.clear that we are deleting the workspace
Blockly.Workspace.prototype.dispose = function() {
  this.listeners_.length = 0;
  this.clear(true);
  // Remove from workspace database.
  delete Blockly.Workspace.WorkspaceDB_[this.id];
};

Blockly.WorkspaceSvg.prototype.clear = function(deleting) {
  this.setResizesEnabled(false);
  Blockly.WorkspaceSvg.superClass_.clear.call(this);
  if(!deleting) { // Do not try to resize if we're deleting the workspace
    this.setResizesEnabled(true);
  }
};

// Prevent the workspace from shifting when we create a new block (especially
// with categories enabled)
Blockly.WorkspaceSvg.prototype.getBlocksBoundingBox_ = Blockly.WorkspaceSvg.prototype.getBlocksBoundingBox;
Blockly.WorkspaceSvg.prototype.getBlocksBoundingBox = function() {
  var originalBbox = Blockly.WorkspaceSvg.prototype.getBlocksBoundingBox_.apply(this, arguments);
  originalBbox.x = 0;
  return originalBbox;
}

// Put the padding to 0 to avoid issues with clicks getting misplaced
Blockly.DropDownDiv.PADDING_Y = 0;

// Move the dropdown slightly higher to make its target clearer
Blockly.DropDownDiv.getPositionMetrics_ = Blockly.DropDownDiv.getPositionMetrics;
Blockly.DropDownDiv.getPositionMetrics = function () {
  var originalPos = Blockly.DropDownDiv.getPositionMetrics_.apply(this, arguments);
  originalPos.initialY -= 20;
  originalPos.finalY -= 20;
  return originalPos;
}

Blockly.WorkspaceSvg.prototype.renameVariable = function(oldName, newName) {
  Blockly.WorkspaceSvg.superClass_.renameVariable.call(this, oldName, newName);
  // Don't refresh the toolbox if there's a drag in progress.
  if (this.toolbox_ && this.toolbox_.flyout_ && !Blockly.Flyout.startFlyout_) {
    this.toolbox_.refreshSelection();
  }
}

/**
 * Check if 3D transforms are supported by adding an element
 * and attempting to set the property.
 * @return {boolean} true if 3D transforms are supported
 */
Blockly.is3dSupported = function() {
  if (Blockly.cache3dSupported_ !== null) {
    return Blockly.cache3dSupported_;
  }
  // CC-BY-SA Lorenzo Polidori
  // https://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
  if (!window.getComputedStyle) {
    return false;
  }

  try {
    var el = document.createElement('p'),
      has3d,
      transforms = {
        'webkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'transform': 'transform'
      };

    // Add it to the body to get the computed style.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = 'translate3d(1px,1px,1px)';
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    Blockly.cache3dSupported_ = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  } catch (e) {
    Blockly.cache3dSupported_ = false;
  }
  return Blockly.cache3dSupported_;
};

Blockly.FieldTextInput.prototype.oldShowEditor_ = Blockly.FieldTextInput.prototype.showEditor_;
Blockly.FieldTextInput.prototype.showEditor_ = function() {
  var mobile =
      goog.userAgent.MOBILE || goog.userAgent.ANDROID || goog.userAgent.IPAD;
  if(mobile) {
     // Display a prompt on mobile, as Blockly does
     var newValue = prompt
     var newValue = window.prompt(Blockly.Msg.CHANGE_VALUE_TITLE, this.text_);
     if (this.sourceBlock_) {
       newValue = this.callValidator(newValue);
     }
     this.setValue(newValue);
  } else {
     Blockly.FieldTextInput.prototype.oldShowEditor_.apply(this, arguments);
  }
}

Blockly.WidgetDiv.hideAndClearDom_ = function() {
  // Properly clean the widget div
  Blockly.WidgetDiv.DIV.style = 'display: none;';
  Blockly.WidgetDiv.DIV.className = "blocklyWidgetDiv";
  goog.dom.removeChildren(Blockly.WidgetDiv.DIV);
};


Blockly.Colours['input'] = {
    'primary': '#891431',
    'secondary': '#840A28',
    'tertiary': '#630D23'};

Blockly.Colours['texts'] = {
    'primary': '#18BC85',
    'secondary': '#0DA572',
    'tertiary': '#128E65'};

Blockly.Blocks['control_repeat'] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "control_repeat",
      "message0": Blockly.Msg.CONTROLS_REPEAT_TITLE,
      "message1": "%1", // Statement
      "message2": "%1", // Icon
      "lastDummyAlign2": "RIGHT",
      "args0": [
        {
          "type": "input_value",
          "name": "TIMES"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "args2": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "c_arrow.svg",
          "width": 16,
          "height": 16,
          "alt": "*",
          "flip_rtl": true
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.control,
      "colour": Blockly.Colours.control.primary,
      "colourSecondary": Blockly.Colours.control.secondary,
      "colourTertiary": Blockly.Colours.control.tertiary
    });
  }
};

Blockly.Blocks['control_if'] = {
  /**
   * Block for if-then.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "type": "control_if",
      "message0": Blockly.Msg.CONTROLS_IF_MSG_IF+" %1 "+Blockly.Msg.CONTROLS_REPEAT_INPUT_DO,
      "message1": "%1", // Statement
      "args0": [
        {
          "type": "input_value",
          "name": "CONDITION",
          "check": "Boolean"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.control,
      "colour": Blockly.Colours.control.primary,
      "colourSecondary": Blockly.Colours.control.secondary,
      "colourTertiary": Blockly.Colours.control.tertiary
    });
  }
};

Blockly.Blocks['control_if_else'] = {
  /**
   * Block for if-else.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "type": "control_if_else",
      "message0": Blockly.Msg.CONTROLS_IF_MSG_IF+" %1 "+Blockly.Msg.CONTROLS_REPEAT_INPUT_DO,
      "message1": "%1",
      "message2": Blockly.Msg.CONTROLS_IF_MSG_ELSE,
      "message3": "%1",
      "args0": [
        {
          "type": "input_value",
          "name": "CONDITION",
          "check": "Boolean"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "args3": [
        {
          "type": "input_statement",
          "name": "SUBSTACK2"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.control,
      "colour": Blockly.Colours.control.primary,
      "colourSecondary": Blockly.Colours.control.secondary,
      "colourTertiary": Blockly.Colours.control.tertiary
    });
  }
};

Blockly.Blocks['control_repeat_until'] = {
  /**
   * Block for repeat until a condition becomes true.
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL+" %1",
      "message1": "%1",
      "message2": "%1",
      "lastDummyAlign2": "RIGHT",
      "args0": [
        {
          "type": "input_value",
          "name": "CONDITION",
          "check": "Boolean"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "args2": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "c_arrow.svg",
          "width": 16,
          "height": 16,
          "alt": "*",
          "flip_rtl": true
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.control,
      "colour": Blockly.Colours.control.primary,
      "colourSecondary": Blockly.Colours.control.secondary,
      "colourTertiary": Blockly.Colours.control.tertiary
    });
  }
};

// Fix image path
Blockly.Blocks['control_forever'] = {
  /**
   * Block for repeat n times (external number).
   * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#5eke39
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "control_forever",
      "message0": "forever",
      "message1": "%1", // Statement
      "message2": "%1", // Icon
      "lastDummyAlign2": "RIGHT",
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "args2": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "c_arrow.svg",
          "width": 16,
          "height": 16,
          "alt": "*",
          "flip_rtl": true
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "category": Blockly.Categories.control,
      "colour": Blockly.Colours.control.primary,
      "colourSecondary": Blockly.Colours.control.secondary,
      "colourTertiary": Blockly.Colours.control.tertiary
    });
  }
};

Blockly.Blocks['operator_not'] = {
  /**
   * Block for "not" unary boolean operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.LOGIC_NEGATE_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND",
          "check": "Boolean"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL
    });
  }
};

// Fix title
Blockly.Blocks['data_replaceitemoflist'] = {
  /**
   * Block to insert item to list.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.DATA_REPLACEITEMOFLIST_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "INDEX"
        },
        {
          "type": "field_variable",
          "name": "LIST"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.data,
      "colour": Blockly.Colours.data.primary,
      "colourSecondary": Blockly.Colours.data.secondary,
      "colourTertiary": Blockly.Colours.data.tertiary
    });
  }
};

// Fix title
Blockly.Blocks['data_itemoflist'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.DATA_ITEMOFLIST_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "INDEX"
        },
        {
          "type": "field_variable",
          "name": "LIST"
        }
      ],
      "output": null,
      "category": Blockly.Categories.data,
      "colour": Blockly.Colours.data.primary,
      "colourSecondary": Blockly.Colours.data.secondary,
      "colourTertiary": Blockly.Colours.data.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND
    });
  }
};

// Create list from repetition of item
Blockly.Blocks['data_listrepeat'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.DATA_LISTREPEAT_TITLE,
      "args0": [
        {
          "type": "field_variable",
          "name": "LIST"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        },
        {
          "type": "input_value",
          "name": "TIMES"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.data,
      "colour": Blockly.Colours.data.primary,
      "colourSecondary": Blockly.Colours.data.secondary,
      "colourTertiary": Blockly.Colours.data.tertiary
    });
  }
};

Blockly.Blocks['data_setvariableto'] = {
  /**
   * Block to set variable to a certain value
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VARIABLES_SET,
      "args0": [
        {
          "type": "input_value",
          "name": "VARIABLE"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.data,
      "colour": Blockly.Colours.data.primary,
      "colourSecondary": Blockly.Colours.data.secondary,
      "colourTertiary": Blockly.Colours.data.tertiary
    });
  }
};

Blockly.Blocks['data_changevariableby'] = {
  /**
   * Block to change variable by a certain value
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.MATH_CHANGE_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VARIABLE"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.data,
      "colour": Blockly.Colours.data.primary,
      "colourSecondary": Blockly.Colours.data.secondary,
      "colourTertiary": Blockly.Colours.data.tertiary
    });
  }
};

Blockly.Blocks['operator_and'] = {
  /**
   * Block for "and" boolean comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 "+Blockly.Msg.LOGIC_OPERATION_AND+" %2",
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1",
          "check": "Boolean"
        },
        {
          "type": "input_value",
          "name": "OPERAND2",
          "check": "Boolean"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL
    });
  }
};

Blockly.Blocks['operator_or'] = {
  /**
   * Block for "or" boolean comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 "+Blockly.Msg.LOGIC_OPERATION_OR+" %2",
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1",
          "check": "Boolean"
        },
        {
          "type": "input_value",
          "name": "OPERAND2",
          "check": "Boolean"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL
    });
  }
};

Blockly.Blocks['operator_join'] = {
  /**
   * Block for string join operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN+" %1 %2",
      "args0": [
        {
          "type": "input_value",
          "name": "STRING1"
        },
        {
          "type": "input_value",
          "name": "STRING2"
        }
      ],
      "inputsInline": true,
      "output": "String",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND
    });
  }
};

Blockly.Blocks['operator_dividefloor'] = {
  /**
   * Block for getting the whole part of dividing two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit(
      {
        "message0": "%1 // %2",
        "args0": [
          {
            "type": "input_value",
            "name": "NUM1"
          },
          {
            "type": "input_value",
            "name": "NUM2"
          }
        ],
        "inputsInline": true,
        "output": "Number",
        "category": Blockly.Categories.operators,
        "colour": Blockly.Colours.operators.primary,
        "colourSecondary": Blockly.Colours.operators.secondary,
        "colourTertiary": Blockly.Colours.operators.tertiary,
        "outputShape": Blockly.OUTPUT_SHAPE_ROUND
      });
  }
};

Blockly.Blocks['operator_lte'] = {
  /**
   * Block for less than or equal comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 ≤ %2",
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1"
        },
        {
          "type": "input_value",
          "name": "OPERAND2"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL
    });
  }
};

Blockly.Blocks['operator_gte'] = {
  /**
   * Block for greater than or equal comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 ≥ %2",
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1"
        },
        {
          "type": "input_value",
          "name": "OPERAND2"
        }
      ],
      "inputsInline": true,
      "output": "Boolean",
      "category": Blockly.Categories.operators,
      "colour": Blockly.Colours.operators.primary,
      "colourSecondary": Blockly.Colours.operators.secondary,
      "colourTertiary": Blockly.Colours.operators.tertiary,
      "outputShape": Blockly.OUTPUT_SHAPE_HEXAGONAL
    });
  }
};


Blockly.Blocks['text_print'] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TEXT_PRINT_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours.texts.primary,
      "colourSecondary": Blockly.Colours.texts.secondary,
      "colourTertiary": Blockly.Colours.texts.tertiary,
      "tooltip": Blockly.Msg.TEXT_PRINT_TOOLTIP,
      "helpUrl": Blockly.Msg.TEXT_PRINT_HELPURL
    });
  }
};

Blockly.JavaScript['control_if'] = function(block) {
  // If/then condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(block, 'CONDITION',
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
  var code = 'if (' + argument + ') {\n' + branch + '}';
  return code + '\n';
};

Blockly.JavaScript['control_if_else'] = function(block) {
  // If/then/else condition.
  var argument = Blockly.JavaScript.valueToCode(block, 'CONDITION',
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
  var branch2 = Blockly.JavaScript.statementToCode(block, 'SUBSTACK2');
  var code = 'if (' + argument + ') {\n' + branch + '} else {\n' +  branch2 + '}';
  return code + '\n';
};

Blockly.JavaScript['control_repeat'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      "reportBlockValue('" + block.id + "', " + loopVar + "+1, '@@LOOP_ITERATION@@');\n" +
      branch + '}\n';
  return code;
};

Blockly.JavaScript['control_repeat_until'] = function(block) {
  // If/then/else condition.
  var n = 0;
  var argument = Blockly.JavaScript.valueToCode(block, 'CONDITION',
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
  var code = 'while (!(' + argument + ')) {\n' + branch + '}';
  return code + '\n';
};

Blockly.JavaScript['operator_not'] = function(block) {
   var b = Blockly.JavaScript.ORDER_LOGICAL_NOT;
   return["!"+ (Blockly.JavaScript.valueToCode(block,"OPERAND",b) || "true"), b]
};

Blockly.JavaScript['data_listrepeat'] = function(block) {
  // Create a list with one element repeated.
  Blockly.JavaScript.externalFunctions['listsRepeat'] = function(value, n) {
    if(n > FioiBlockly.maxListSize) {
      throw Blockly.Msg.LISTS_CREATE_WITH_TOO_LARGE.replace('%1', n).replace('%2', FioiBlockly.maxListSize);
    }
    var array = [];
    for (var i = 0; i < n; i++) {
      array[i] = value;
    }
    return array;
  };
  var element = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_COMMA) || 'null';
  var repeatCount = Blockly.JavaScript.valueToCode(block, 'TIMES',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var code = 'listsRepeat(' + element + ', ' + repeatCount + ')';

  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  var assignCode = 'var ' + varName + ' = ' + code + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', " + varName + ", '" + varName + "');\n";

  return assignCode + reportCode;
};

Blockly.JavaScript['data_itemoflist'] = function(block) {
  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at = Blockly.JavaScript.getAdjusted(block, 'INDEX');
  var code = varName + '[' + at + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['data_replaceitemoflist'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
  var at = Blockly.JavaScript.getAdjusted(block, 'INDEX');
  code = 'if(' + at + ' > 1000000) { throw "List index > 1000000"; }\n';
  code += varName + '[' + at + '] = ' + value + ';\n';
  return code;
};


Blockly.JavaScript['data_variable'] = function(block) {
  // Variable getter.
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['data_setvariableto'] = function(block) {
  // Variable setter.
  if (block.getField("VALUE")) {
     var argument0 = String(Number(block.getFieldValue("VALUE")));
  } else {
     var argument0 = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ASSIGNMENT) || "0";
  }
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  var assignCode = 'var ' + varName + ' = ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', " + varName + ", '" + varName + "');\n";

  return assignCode + reportCode;
};

Blockly.JavaScript['data_changevariableby'] = function(block) {
  // Increment
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  var incrCode = varName + ' += ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', " + varName + ", '" + varName + "');\n";

  return incrCode + reportCode;
};

Blockly.JavaScript['operators'] = function(block) {
  // Generator for all operators
  var nameToOp = {
    'operator_add': {op: '+', varname: 'NUM', order: Blockly.JavaScript.ORDER_ADDITION},
    'operator_subtract': {op: '-', varname: 'NUM', order: Blockly.JavaScript.ORDER_SUBTRACTION},
    'operator_multiply': {op: '*', varname: 'NUM', order: Blockly.JavaScript.ORDER_MULTIPLICATION},
    'operator_divide': {op: '/', varname: 'NUM', order: Blockly.JavaScript.ORDER_DIVISION},
    'operator_equals': {op: '==', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_EQUALITY},
    'operator_gt': {op: '>', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_RELATIONAL},
    'operator_gte': {op: '>=', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_RELATIONAL},
    'operator_lt': {op: '<', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_RELATIONAL},
    'operator_lte': {op: '<=', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_RELATIONAL},
    'operator_and': {op: '&&', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_LOGICAL_AND},
    'operator_or': {op: '||', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_LOGICAL_OR}
  };
  var opInfo = nameToOp[block.type];
  var argument0 = Blockly.JavaScript.valueToCode(block, opInfo.varname+'1', opInfo.order) || '0';
  if(argument0 == 'NaN') { argument0 = '0'; };
  var argument1 = Blockly.JavaScript.valueToCode(block, opInfo.varname+'2', opInfo.order) || '0';
  if(argument1 == 'NaN') { argument1 = '0'; };
  var code = argument0 + ' ' + opInfo.op + ' ' + argument1;
  return [code, opInfo.order];
}

Blockly.JavaScript['operator_add'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_subtract'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_multiply'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_divide'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_equals'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_gt'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_gte'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_lt'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_lte'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_and'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_or'] = Blockly.JavaScript['operators'];

Blockly.JavaScript['operator_dividefloor'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_DIVISION) || '0';
  if(argument0 == 'NaN') { argument0 = '0'; };
  var argument1 = Blockly.JavaScript.valueToCode(block, 'NUM2', Blockly.JavaScript.ORDER_DIVISION) || '0';
  if(argument1 == 'NaN') { argument1 = '0'; };
  var code = 'Math.floor(' + argument0 + ' / ' + argument1 + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
}

Blockly.JavaScript['operator_join'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'STRING1', Blockly.JavaScript.ORDER_NONE) || '';
  if(argument0 == 'NaN') { argument0 = ''; };
  var argument1 = Blockly.JavaScript.valueToCode(block, 'STRING2', Blockly.JavaScript.ORDER_NONE) || '';
  if(argument1 == 'NaN') { argument1 = ''; };
  var code = 'String(' + argument0 + ') + String(' + argument1 + ')';
  return [code, Blockly.JavaScript.ORDER_ADDITION];
}

Blockly.JavaScript['text'] = function(block) {
  // Text value. Output an integer if the content is an int, as Scratch is
  // ambiguous on these fields.
  var val = block.getFieldValue('TEXT');
  if(val.search(/^-?\d+\.?\d*$/) < 0) {
    // string
    var code = Blockly.JavaScript.quote_(val);
  } else {
    // float
    var code = val;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.Python['control_if'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK') ||
      Blockly.Python.PASS;
  var code = 'if ' + argument + ':\n' + branch;
  return code;
}

Blockly.Python['control_if_else'] = function(block) {
  var argument = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK') ||
      Blockly.Python.PASS;
  var code = 'if ' + argument + ':\n' + branch;
  branch = Blockly.Python.statementToCode(block, 'SUBSTACK2') ||
      Blockly.Python.PASS;
  code += 'else:\n' + branch;
  return code;
}

Blockly.Python['control_repeat'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(parseInt(block.getFieldValue('TIMES'), 10));
  } else {
    // External number.
    var repeats = Blockly.Python.valueToCode(block, 'TIMES',
        Blockly.Python.ORDER_NONE) || '0';
  }
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'int(' + repeats + ')';
  }
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var loopVar = Blockly.Python.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
}

Blockly.Python['control_repeat_until'] = function(block) {
  var argument0 = Blockly.Python.valueToCode(block, 'CONDITION',
      Blockly.Python.ORDER_LOGICAL_NOT) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  return 'while not ' + argument0 + ':\n' + branch;
}

Blockly.Python['operator_not'] = function(block) {
   var b = Blockly.Python.ORDER_LOGICAL_NOT;
   return["not "+ (Blockly.Python.valueToCode(block, "OPERAND", b) || "True"), b]
}

Blockly.Python['data_listrepeat'] = function(block) {
  // Create a list with one element repeated.
  var item = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || 'None';
  var times = Blockly.Python.valueToCode(block, 'TIMES',
      Blockly.Python.ORDER_MULTIPLICATIVE) || '0';
  var code = '[' + item + '] * (' + times + ')';

  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  return varName + ' = ' + code + '\n';
}

Blockly.Python['data_itemoflist'] = function(block) {
  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at = Blockly.Python.getAdjustedInt(block, 'INDEX');
  var code = varName + '[' + at + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
}

Blockly.Python['data_replaceitemoflist'] = function(block) {
  var blockVarName = block.getFieldValue('LIST');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // TODO :: make it an option
/*  Blockly.Python.definitions_['lists_assignIndex'] = '' +
    'def assignIndex(l, i, x):\n' +
    '    if i > 1000000:\n' +
    '        raise IndexError("list index > 1000000")\n' +
    '    n = len(l)\n' +
    '    if i >= n:\n' +
    '        l.extend([None]*(i-n+1))\n' +
    '    l[i] = x\n';*/

  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_ASSIGNMENT) || 'null';
  var at = Blockly.Python.getAdjustedInt(block, 'INDEX');
//  return 'assignIndex(' + varName + ', ' + at + ', ' + value + ')\n';
  return varName + '[' + at + '] = ' + value + '\n';
}

Blockly.Python['data_variable'] = function(block) {
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  return [varName, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['data_setvariableto'] = function(block) {
  if (block.getField("VALUE")) {
     var argument0 = String(Number(block.getFieldValue("VALUE")));
  } else {
     var argument0 = Blockly.Python.valueToCode(block, "VALUE", Blockly.Python.ORDER_ASSIGNMENT) || "0";
  }
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  return varName + ' = ' + argument0 + ';\n';
}

Blockly.Python['data_changevariableby'] = function(block) {
  var argument0 = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var blockVarName = block.getVariableField();
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }
  return varName + ' += ' + argument0 + ';\n';
}

Blockly.Python['text'] = function(block) {
  var val = block.getFieldValue('TEXT');
  if(val.search(/^-?\d+\.?\d*$/) < 0) {
    // string
    var code = Blockly.Python.quote_(val);
  } else {
    // float
    var code = val;
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['operators'] = function(block) {
  var nameToOp = {
    'operator_add': {op: '+', varname: 'NUM', order: Blockly.Python.ORDER_ADDITIVE},
    'operator_subtract': {op: '-', varname: 'NUM', order: Blockly.Python.ORDER_ADDITIVE},
    'operator_multiply': {op: '*', varname: 'NUM', order: Blockly.Python.ORDER_MULTIPLICATIVE},
    'operator_divide': {op: '/', varname: 'NUM', order: Blockly.Python.ORDER_MULTIPLICATIVE},
    'operator_dividefloor': {op: '//', varname: 'NUM', order: Blockly.Python.ORDER_MULTIPLICATIVE},
    'operator_equals': {op: '==', varname: 'OPERAND', order: Blockly.Python.ORDER_RELATIONAL},
    'operator_gt': {op: '>', varname: 'OPERAND', order: Blockly.Python.ORDER_RELATIONAL},
    'operator_gte': {op: '>=', varname: 'OPERAND', order: Blockly.Python.ORDER_RELATIONAL},
    'operator_lt': {op: '<', varname: 'OPERAND', order: Blockly.Python.ORDER_RELATIONAL},
    'operator_lte': {op: '<=', varname: 'OPERAND', order: Blockly.Python.ORDER_RELATIONAL},
    'operator_and': {op: 'and', varname: 'OPERAND', order: Blockly.Python.ORDER_LOGICAL_AND},
    'operator_or': {op: 'or', varname: 'OPERAND', order: Blockly.Python.ORDER_LOGICAL_OR}
  };
  var opInfo = nameToOp[block.type];
  var argument0 = Blockly.Python.valueToCode(block, opInfo.varname+'1', opInfo.order) || '0';
  if(argument0 == 'NaN') { argument0 = '0'; };
  var argument1 = Blockly.Python.valueToCode(block, opInfo.varname+'2', opInfo.order) || '0';
  if(argument1 == 'NaN') { argument1 = '0'; };
  var code = argument0 + ' ' + opInfo.op + ' ' + argument1;
  return [code, opInfo.order];
}

Blockly.Python['operator_add'] = Blockly.Python['operators'];
Blockly.Python['operator_subtract'] = Blockly.Python['operators'];
Blockly.Python['operator_multiply'] = Blockly.Python['operators'];
Blockly.Python['operator_divide'] = Blockly.Python['operators'];
Blockly.Python['operator_dividefloor'] = Blockly.Python['operators'];
Blockly.Python['operator_equals'] = Blockly.Python['operators'];
Blockly.Python['operator_gt'] = Blockly.Python['operators'];
Blockly.Python['operator_gte'] = Blockly.Python['operators'];
Blockly.Python['operator_lt'] = Blockly.Python['operators'];
Blockly.Python['operator_lte'] = Blockly.Python['operators'];
Blockly.Python['operator_and'] = Blockly.Python['operators'];
Blockly.Python['operator_or'] = Blockly.Python['operators'];

Blockly.Python['operator_join'] = function(block) {
  var argument0 = Blockly.Python.valueToCode(block, 'STRING1', Blockly.Python.ORDER_NONE) || '';
  if(argument0 == 'NaN') { argument0 = ''; };
  var argument1 = Blockly.Python.valueToCode(block, 'STRING2', Blockly.Python.ORDER_NONE) || '';
  if(argument1 == 'NaN') { argument1 = ''; };
  var code = '"%s%s" % (' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Python.ORDER_MULTIPLICATIVE];
}
