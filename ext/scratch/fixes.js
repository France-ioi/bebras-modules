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
        childBlock.dispose();
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

Blockly.Workspace.prototype.remainingCapacity = function() {
  var maxBlocks = this.maxBlocks();
  if (!maxBlocks) {
    return Infinity;
  }

  // Count number of blocks
  var blocks = this.getAllBlocks();
  var blockCount = 0;
  for (var b = 0; b < blocks.length; b++) {
    var block = blocks[b];
    // Exclude math_number as it's often used in situations where it doesn't
    // count in Blockly; probably find a better criteria
    // (parentBlock_.type == 'control_repeat' ?)
    if(block.type != 'math_number') {
      blockCount += 1;
    }
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
Blockly.WorkspaceSvg.prototype.getBlocksBoundingBox = function() {
  var topBlocks = this.getTopBlocks(false);
  // There are no blocks, return empty rectangle.
  if (!topBlocks.length) {
    return {x: 0, y: 0, width: 0, height: 0};
  }

  // Initialize boundary using the first block.
  var boundary = topBlocks[0].getBoundingRectangle();

  // Start at 1 since the 0th block was used for initialization
  for (var i = 1; i < topBlocks.length; i++) {
    var blockBoundary = topBlocks[i].getBoundingRectangle();
    if (blockBoundary.bottomRight.x > boundary.bottomRight.x) {
      boundary.bottomRight.x = blockBoundary.bottomRight.x;
    }
    if (blockBoundary.topLeft.y < boundary.topLeft.y) {
      boundary.topLeft.y = blockBoundary.topLeft.y;
    }
    if (blockBoundary.bottomRight.y > boundary.bottomRight.y) {
      boundary.bottomRight.y = blockBoundary.bottomRight.y;
    }
  }
  return {
    x: 0, // yep the ugly fix is that
    y: boundary.topLeft.y,
    width: boundary.bottomRight.x - boundary.topLeft.x,
    height: boundary.bottomRight.y - boundary.topLeft.y
  };
};

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
  return varName + ' = ' + argument0 + ';\n';
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
  return varName + ' += ' + argument0 + ';\n';
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
    'operator_lt': {op: '<', varname: 'OPERAND', order: Blockly.JavaScript.ORDER_RELATIONAL},
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

Blockly.JavaScript['text'] = function(block) {
  // Text value. Output an integer if the content is an int, as Scratch is
  // ambiguous on these fields.
  var val = block.getFieldValue('TEXT');
  if(val.search(/^\d+$/) < 0) {
    // string
    var code = Blockly.JavaScript.quote_(val);
  } else {
    // int
    var code = val;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['operator_add'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_subtract'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_multiply'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_divide'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_equals'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_gt'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_lt'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_and'] = Blockly.JavaScript['operators'];
Blockly.JavaScript['operator_or'] = Blockly.JavaScript['operators'];

Blockly.JavaScript['operator_join'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'STRING1', Blockly.JavaScript.ORDER_NONE) || '';
  if(argument0 == 'NaN') { argument0 = ''; };
  var argument1 = Blockly.JavaScript.valueToCode(block, 'STRING2', Blockly.JavaScript.ORDER_NONE) || '';
  if(argument1 == 'NaN') { argument1 = ''; };
  var code = 'String(' + argument0 + ') + String(' + argument1 + ')';
  return [code, Blockly.JavaScript.ORDER_ADDITION];
}

// TODO :: Python generation
Blockly.Python['control_if'] = function(block) { return '# Error: control_if not implemented in Python!'; }
Blockly.Python['control_if_else'] = function(block) { return '# Error: control_if_else not implemented in Python!'; }
Blockly.Python['control_if_repeat'] = function(block) { return '# Error: control_repeat not implemented in Python!'; }
Blockly.Python['operator_not'] = function(block) { return '# Error: operator_not not implemented in Python!'; }
