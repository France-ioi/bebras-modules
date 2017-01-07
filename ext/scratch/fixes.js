// Change gap between blocks in the toolbox
Blockly.Flyout.prototype.GAP_Y = 14;

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
  var n = 0;
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

Blockly.JavaScript['operator_not'] = function(block) {
   var b = Blockly.JavaScript.ORDER_LOGICAL_NOT;
   return["!"+ (Blockly.JavaScript.valueToCode(block,"OPERAND",b) || "true"), b]
};

// TODO :: Python generation
Blockly.Python['control_if'] = function(block) { return '# Error: control_if not implemented in Python!'; }
Blockly.Python['control_if_else'] = function(block) { return '# Error: control_if_else not implemented in Python!'; }
Blockly.Python['control_if_repeat'] = function(block) { return '# Error: control_repeat not implemented in Python!'; }
