FioiBlockly = {};
FioiBlockly.Msg = {};
FioiBlockly.OriginalBlocks = {};

FioiBlockly.defaultLang = 'fr';

FioiBlockly.langErrorDisplayed = {};

FioiBlockly.maxListSize = 100;

// Import messages for a language
FioiBlockly.loadLanguage = function(lang) {
  if(!FioiBlockly.Msg[lang] && !FioiBlockly.langErrorDisplayed[lang]) {
    console.error("Language "+lang+" doesn't exist in fioi-blockly!");
    FioiBlockly.langErrorDisplayed[lang] = true; // Avoid spamming console
    return;
  }

  for(var msgName in FioiBlockly.Msg[lang]) {
    Blockly.Msg[msgName] = FioiBlockly.Msg[lang][msgName];
  }
};

// Get back original Blockly blocks
FioiBlockly.reimportOriginalBlocks = function(blockNames) {
  for(var blockName in FioiBlockly.OriginalBlocks) {
    if(!blockNames || blockNames.indexOf(blockName) != -1) {
      Blockly.Blocks[blockName] = FioiBlockly.OriginalBlocks[blockName];
    }
  }
};

Blockly.Block.prototype.jsonInit = function (json) {
    // Validate inputs.
    goog.asserts.assert(json['output'] == undefined ||
        json['previousStatement'] == undefined,
        'Must not have both an output and a previousStatement.');

    // Set basic properties of block.
    if (json['colour'] !== undefined) {
        this.setColour(json['colour'], json['colourSecondary'], json['colourTertiary']);
    }

    // Interpolate the message blocks.
    var i = 0;
    while (json['message' + i] !== undefined) {
        this.interpolate_(json['message' + i], json['args' + i] || [],
            json['lastDummyAlign' + i]);
        i++;
    }

    if (json['inputsInline'] !== undefined) {
        this.setInputsInline(json['inputsInline']);
    }
    // Set output and previous/next connections.
    if (json['output'] !== undefined) {
        this.setOutput(true, json['output']);
    }
    if (json['previousStatement'] !== undefined) {
        this.setPreviousStatement(true, json['previousStatement']);
    }
    if (json['nextStatement'] !== undefined) {
        this.setNextStatement(true, json['nextStatement']);
    }
    if (json['tooltip'] !== undefined) {
        this.setTooltip(json['tooltip']);
    }
    if (json['helpUrl'] !== undefined) {
        this.setHelpUrl(json['helpUrl']);
    }
    if (json['outputShape'] !== undefined && this.setOutputShape) {
        this.setOutputShape(json['outputShape']);
    }
    if (json['checkboxInFlyout'] !== undefined && this.setCheckboxInFlyout) {
        this.setCheckboxInFlyout(json['checkboxInFlyout']);
    }
    if (json['category'] !== undefined && this.setCategory) {
        this.setCategory(json['category']);
    }
    if (json['textStyle'] !== undefined) {
        this.setTextStyle(json['textStyle']);
    }
};

Blockly.Block.prototype.getTextStyle = function () {
    return this.textStyle_ || '';
}

Blockly.Block.prototype.setTextStyle = function (style) {
    this.textStyle_ = style;
}
Blockly.copy_ = function(block) {
  var xmlBlock = Blockly.Xml.blockToDom(block);
  // Encode start position in XML.
  var xy = block.getRelativeToSurfaceXY();
  xmlBlock.setAttribute('x', block.RTL ? -xy.x : xy.x);
  xmlBlock.setAttribute('y', xy.y);
  Blockly.clipboardXml_ = xmlBlock;
  Blockly.clipboardSource_ = block.workspace;
};

/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview A div that floats on top of the workspace, for drop-down menus.
 * The drop-down can be kept inside the workspace, animate in/out, etc.
 * @author tmickel@mit.edu (Tim Mickel)
 */

'use strict';

goog.provide('Blockly.DropDownDiv');

goog.require('goog.dom');
goog.require('goog.style');

/**
 * Class for drop-down div.
 * @constructor
 */
Blockly.DropDownDiv = function() {
};

/**
 * The div element. Set once by Blockly.DropDownDiv.createDom.
 * @type {Element}
 * @private
 */
Blockly.DropDownDiv.DIV_ = null;

/**
 * Drop-downs will appear within the bounds of this element if possible.
 * Set in Blockly.DropDownDiv.setBoundsElement.
 * @type {Element}
 * @private
 */
Blockly.DropDownDiv.boundsElement_ = null;

/**
 * The object currently using the drop-down.
 * @type {Object}
 * @private
 */
Blockly.DropDownDiv.owner_ = null;

/**
 * Arrow size in px. Should match the value in CSS (need to position pre-render).
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ARROW_SIZE = 16;

/**
 * Drop-down border size in px. Should match the value in CSS (need to position the arrow).
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.BORDER_SIZE = 1;

/**
 * Amount the arrow must be kept away from the edges of the main drop-down div, in px.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING = 12;

/**
 * Amount drop-downs should be padded away from the source, in px.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.PADDING_Y = 20;

/**
 * Length of animations in seconds.
 * @type {number}
 * @const
 */
Blockly.DropDownDiv.ANIMATION_TIME = 0.25;

/**
 * Timer for animation out, to be cleared if we need to immediately hide
 * without disrupting new shows.
 * @type {number}
 */
Blockly.DropDownDiv.animateOutTimer_ = null;

/**
 * Callback for when the drop-down is hidden.
 * @type {Function}
 */
Blockly.DropDownDiv.onHide_ = 0;

// Don't hide a DropDownDiv we're showing
Blockly.DropDownDiv.isInAnimation = false;
Blockly.DropDownDiv.isInAnimationTimer = null;

// Is the mousedown listener active?
Blockly.DropDownDiv.listenerActive = false;

/**
 * Create and insert the DOM element for this div.
 * @param {Element} container Element that the div should be contained in.
 */
Blockly.DropDownDiv.createDom = function() {
  if (Blockly.DropDownDiv.DIV_) {
    return;  // Already created.
  }
  Blockly.DropDownDiv.DIV_ = goog.dom.createDom('div', 'blocklyDropDownDiv');
  document.body.appendChild(Blockly.DropDownDiv.DIV_);
  Blockly.DropDownDiv.content_ = goog.dom.createDom('div', 'blocklyDropDownContent');
  Blockly.DropDownDiv.DIV_.appendChild(Blockly.DropDownDiv.content_);
  Blockly.DropDownDiv.arrow_ = goog.dom.createDom('div', 'blocklyDropDownArrow');
  Blockly.DropDownDiv.DIV_.appendChild(Blockly.DropDownDiv.arrow_);

  // Transition animation for transform: translate() and opacity.
  Blockly.DropDownDiv.DIV_.style.transition = 'transform ' +
    Blockly.DropDownDiv.ANIMATION_TIME + 's, ' +
    'opacity ' + Blockly.DropDownDiv.ANIMATION_TIME + 's';
};

/**
 * Set an element to maintain bounds within. Drop-downs will appear
 * within the box of this element if possible.
 * @param {Element} boundsElement Element to bound drop-down to.
 */
Blockly.DropDownDiv.setBoundsElement = function(boundsElement) {
  Blockly.DropDownDiv.boundsElement_ = boundsElement;
};

/**
 * Provide the div for inserting content into the drop-down.
 * @return {Element} Div to populate with content
 */
Blockly.DropDownDiv.getContentDiv = function() {
  return Blockly.DropDownDiv.content_;
};

/**
 * Clear the content of the drop-down.
 */
Blockly.DropDownDiv.clearContent = function() {
  Blockly.DropDownDiv.content_.innerHTML = '';
};

/**
 * Set the colour for the drop-down.
 * @param {string} backgroundColour Any CSS color for the background
 * @param {string} borderColour Any CSS color for the border
 */
Blockly.DropDownDiv.setColour = function(backgroundColour, borderColour) {
  Blockly.DropDownDiv.DIV_.style.backgroundColor = backgroundColour;
  Blockly.DropDownDiv.DIV_.style.borderColor = borderColour;
};

/**
 * Set the category for the drop-down.
 * @param {string} category The new category for the drop-down.
 */
Blockly.DropDownDiv.setCategory = function(category) {
  Blockly.DropDownDiv.DIV_.setAttribute('data-category', category);
};

// Modified: find blocklyPath
Blockly.DropDownDiv.showPositionedByBlock = function(owner, block,
      opt_onHide, opt_secondaryYOffset) {
  var scale = block.workspace.scale;
  var bBox = {width: block.width, height: block.height};
  bBox.width *= scale;
  bBox.height *= scale;
  var blockSvg = block.getSvgRoot();
  for(var i=0; i<blockSvg.children.length; i++) {
     if(blockSvg.children[i].classList[0] == 'blocklyPath') {
        blockSvg = blockSvg.children[i];
        break;
     }
  }
  var position = blockSvg.getBoundingClientRect();
  // If we can fit it, render below the block.
  var primaryX = position.left + position.width / 2;
  var primaryY = position.top + position.height;
  // If we can't fit it, render above the entire parent block.
  var secondaryX = primaryX;
  var secondaryY = position.top;
  if (opt_secondaryYOffset) {
    secondaryY += opt_secondaryYOffset;
  }
  // Set bounds to workspace; show the drop-down.
  Blockly.DropDownDiv.setBoundsElement(block.workspace.getParentSvg().parentNode);
  return Blockly.DropDownDiv.show(this, primaryX, primaryY, secondaryX, secondaryY, opt_onHide);
};

// Remove mousedown listener
Blockly.DropDownDiv.removeListener = function() {
  if(Blockly.DropDownDiv.listenerActive) {
    Blockly.Touch.clearTouchIdentifier();
    Blockly.unbindEvent_(Blockly.DropDownDiv.listenerActive);
    Blockly.DropDownDiv.listenerActive = false;
  }
};

// Add mousedown listener
Blockly.DropDownDiv.addListener = function() {
  if(!Blockly.DropDownDiv.listenerActive) {
    Blockly.DropDownDiv.listenerActive = Blockly.bindEventWithChecks_(window, 'mousedown', Blockly.DropDownDiv, Blockly.DropDownDiv.hideIfNotShowing);
  }
};

/**
 * Show and place the drop-down.
 * The drop-down is placed with an absolute "origin point" (x, y) - i.e.,
 * the arrow will point at this origin and box will positioned below or above it.
 * If we can maintain the container bounds at the primary point, the arrow will
 * point there, and the container will be positioned below it.
 * If we can't maintain the container bounds at the primary point, fall-back to the
 * secondary point and position above.
 * @param {Object} owner The object showing the drop-down
 * @param {number} primaryX Desired origin point x, in absolute px
 * @param {number} primaryY Desired origin point y, in absolute px
 * @param {number} secondaryX Secondary/alternative origin point x, in absolute px
 * @param {number} secondaryY Secondary/alternative origin point y, in absolute px
 * @param {Function=} opt_onHide Optional callback for when the drop-down is hidden
 * @return {boolean} True if the menu rendered at the primary origin point.
 */
Blockly.DropDownDiv.show = function(owner, primaryX, primaryY, secondaryX, secondaryY, opt_onHide) {
  // Do not hide the div while we're showing it
  Blockly.DropDownDiv.isInAnimation = true;
  if(Blockly.DropDownDiv.animateOutTimer_) {
    window.clearTimeout(Blockly.DropDownDiv.animateOutTimer_);
    Blockly.DropDownDiv.animateOutTimer_ = null;
  }
  if(Blockly.DropDownDiv.isInAnimationTimer) {
    window.clearTimeout(Blockly.DropDownDiv.isInAnimationTimer);
    Blockly.DropDownDiv.isInAnimationTimer = null;
  }
  Blockly.DropDownDiv.isInAnimationTimer = window.setTimeout(function () { Blockly.DropDownDiv.isInAnimation = false; }, Blockly.DropDownDiv.ANIMATION_TIME*1000);

  Blockly.DropDownDiv.addListener();

  Blockly.DropDownDiv.owner_ = owner;
  Blockly.DropDownDiv.onHide_ = opt_onHide;
  var div = Blockly.DropDownDiv.DIV_;
  var metrics = Blockly.DropDownDiv.getPositionMetrics(primaryX, primaryY, secondaryX, secondaryY);
  // Update arrow CSS
  Blockly.DropDownDiv.arrow_.style.transform = 'translate(' +
    metrics.arrowX + 'px,' + metrics.arrowY + 'px) rotate(45deg)';
  Blockly.DropDownDiv.arrow_.setAttribute('class',
    metrics.arrowAtTop ? 'blocklyDropDownArrow arrowTop' : 'blocklyDropDownArrow arrowBottom');

  // When we change `translate` multiple times in close succession,
  // Chrome may choose to wait and apply them all at once.
  // Since we want the translation to initial X, Y to be immediate,
  // and the translation to final X, Y to be animated,
  // we saw problems where both would be applied after animation was turned on,
  // making the dropdown appear to fly in from (0, 0).
  // Using both `left`, `top` for the initial translation and then `translate`
  // for the animated transition to final X, Y is a workaround.

  // First apply initial translation.
  div.style.left = metrics.initialX + 'px';
  div.style.top = metrics.initialY + 'px';
  // Show the div.
  div.style.display = 'block';
  div.style.opacity = 1;
  // Add final translate, animated through `transition`.
  // Coordinates are relative to (initialX, initialY),
  // where the drop-down is absolutely positioned.
  var dx = (metrics.finalX - metrics.initialX);
  var dy = (metrics.finalY - metrics.initialY);
  div.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  return metrics.arrowAtTop;
};

/**
 * Helper to position the drop-down and the arrow, maintaining bounds.
 * See explanation of origin points in Blockly.DropDownDiv.show.
 * @param {number} primaryX Desired origin point x, in absolute px
 * @param {number} primaryY Desired origin point y, in absolute px
 * @param {number} secondaryX Secondary/alternative origin point x, in absolute px
 * @param {number} secondaryY Secondary/alternative origin point y, in absolute px
 * @returns {Object} Various final metrics, including rendered positions for drop-down and arrow.
 */
Blockly.DropDownDiv.getPositionMetrics = function(primaryX, primaryY, secondaryX, secondaryY) {
  var div = Blockly.DropDownDiv.DIV_;
  var boundPosition = Blockly.DropDownDiv.boundsElement_.getBoundingClientRect();

  var boundSize = goog.style.getSize(Blockly.DropDownDiv.boundsElement_);
  var divSize = goog.style.getSize(div);

  // First decide if we will render at primary or secondary position
  // i.e., above or below
  // renderX, renderY will eventually be the final rendered position of the box.
  var renderX, renderY, renderedSecondary;
  // Can the div fit inside the bounds if we render below the primary point?
  if (secondaryY - divSize.height < boundPosition.top) {
    // We can't fit below in terms of y. Can we fit above?
    if (primaryY + divSize.height > boundPosition.top + boundSize.height) {
      // We also can't fit above, so just render below anyway.
      renderX = secondaryX;
      renderY = secondaryY - divSize.height - Blockly.DropDownDiv.PADDING_Y;
      renderedSecondary = true;
    } else {
      // We can fit above, render secondary
      renderX = primaryX;
      renderY = primaryY + Blockly.DropDownDiv.PADDING_Y;
      renderedSecondary = false;
    }
  } else {
    // We can fit below, render primary
    renderX = secondaryX;
    renderY = secondaryY - divSize.height - Blockly.DropDownDiv.PADDING_Y;
    renderedSecondary = true;
  }
  // First calculate the absolute arrow X
  // This needs to be done before positioning the div, since the arrow
  // wants to be as close to the origin point as possible.
  var arrowX = renderX - Blockly.DropDownDiv.ARROW_SIZE / 2;
  // Keep in overall bounds
  arrowX = Math.max(boundPosition.left, Math.min(arrowX, boundPosition.left + boundSize.width));

  // Adjust the x-position of the drop-down so that the div is centered and within bounds.
  var centerX = divSize.width / 2;
  renderX -= centerX;
  // Fit horizontally in the bounds.
  renderX = Math.max(
    boundPosition.left,
    Math.min(renderX, boundPosition.left + boundSize.width - divSize.width)
  );
  // After we've finished caclulating renderX, adjust the arrow to be relative to it.
  arrowX -= renderX;

  // Pad the arrow by some pixels, primarily so that it doesn't render on top of a rounded border.
  arrowX = Math.max(
    Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING,
    Math.min(arrowX, divSize.width - Blockly.DropDownDiv.ARROW_HORIZONTAL_PADDING - Blockly.DropDownDiv.ARROW_SIZE)
  );

  // Calculate arrow Y. If we rendered secondary, add on bottom.
  // Extra pixels are added so that it covers the border of the div.
  var arrowY = (renderedSecondary) ? divSize.height - Blockly.DropDownDiv.BORDER_SIZE : 0;
  arrowY -= (Blockly.DropDownDiv.ARROW_SIZE / 2) + Blockly.DropDownDiv.BORDER_SIZE;

  // Initial position calculated without any padding to provide an animation point.
  var initialX = renderX; // X position remains constant during animation.
  var initialY;
  if (renderedSecondary) {
    initialY = secondaryY - divSize.height; // No padding on Y
  } else {
    initialY = primaryY; // No padding on Y
  }

  return {
    initialX: initialX,
    initialY : initialY+10,
    finalX: renderX,
    finalY: renderY+10,
    arrowX: arrowX,
    arrowY: arrowY,
    arrowAtTop: !renderedSecondary
  };
};

/**
 * Is the container visible?
 * @return {boolean} True if visible.
 */
Blockly.DropDownDiv.isVisible = function() {
  return !!Blockly.DropDownDiv.owner_;
};

/**
 * Hide the menu only if it is owned by the provided object.
 * @param {Object} owner Object which must be owning the drop-down to hide
 * @return {Boolean} True if hidden
 */
Blockly.DropDownDiv.hideIfOwner = function(owner) {
  if (Blockly.DropDownDiv.owner_ === owner) {
    Blockly.DropDownDiv.hide();
    return true;
  }
  return false;
};

/**
 * Hide the menu, triggering animation.
 */
Blockly.DropDownDiv.hide = function() {
  Blockly.DropDownDiv.isInAnimation = false;
  // Start the animation by setting the translation and fading out.
  var div = Blockly.DropDownDiv.DIV_;
  // Reset to (initialX, initialY) - i.e., no translation.
  if(div) {
    div.style.transform = 'translate(0px, 0px)';
    div.style.opacity = 0;
    Blockly.DropDownDiv.animateOutTimer_ = setTimeout(function() {
      // Finish animation - reset all values to default.
      Blockly.DropDownDiv.hideWithoutAnimation();
    }, Blockly.DropDownDiv.ANIMATION_TIME * 1000);
  }
  if (Blockly.DropDownDiv.onHide_) {
    Blockly.DropDownDiv.onHide_();
    Blockly.DropDownDiv.onHide_ = null;
  }
};

// Hide after a timeout
Blockly.DropDownDiv.hideIfNotShowing = function () {
  if(!Blockly.DropDownDiv.isInAnimation) {
    Blockly.DropDownDiv.hide();
  }
}

/**
 * Hide the menu, without animation.
 */
Blockly.DropDownDiv.hideWithoutAnimation = function() {
  if (!Blockly.DropDownDiv.isVisible()) {
    return;
  }
  var div = Blockly.DropDownDiv.DIV_;
  Blockly.DropDownDiv.animateOutTimer_ && window.clearTimeout(Blockly.DropDownDiv.animateOutTimer_);
  div.style.transform = '';
  div.style.top = '';
  div.style.left = '';
  div.style.display = 'none';
  Blockly.DropDownDiv.clearContent();
  Blockly.DropDownDiv.removeListener();
  Blockly.DropDownDiv.owner_ = null;
  if (Blockly.DropDownDiv.onHide_) {
    Blockly.DropDownDiv.onHide_();
    Blockly.DropDownDiv.onHide_ = null;
  }
};

Blockly.FieldLabel.prototype.origInit = Blockly.FieldLabel.prototype.init;
Blockly.FieldLabel.prototype.init = function () {
    this.origInit();
    var style = this.sourceBlock_.getTextStyle();
    if (style) {
        this.textElement_.setAttribute('style', style);
    }
}
Blockly.FieldNumber.prototype.showEditor_ = function(opt_quietInput) {
  this.workspace_ = this.sourceBlock_.workspace;
  var quietInput = opt_quietInput || false;

  if(window.quickAlgoInterface && quickAlgoInterface.displayKeypad) {
    quietInput = true;
  }

  if (!quietInput && (goog.userAgent.MOBILE || goog.userAgent.ANDROID ||
                      goog.userAgent.IPAD)) {
    // Mobile browsers have issues with in-line textareas (focus & keyboards).
    var newValue = window.prompt(Blockly.Msg.CHANGE_VALUE_TITLE, this.text_);
    if (this.sourceBlock_) {
      newValue = this.callValidator(newValue);
    }
    this.setValue(newValue);
    return;
  }

  Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
  var div = Blockly.WidgetDiv.DIV;
  // Create the input.
  var htmlInput =
      goog.dom.createDom(goog.dom.TagName.INPUT, 'blocklyHtmlInput');
  htmlInput.setAttribute('spellcheck', this.spellcheck_);
  var fontSize =
      (Blockly.FieldTextInput.FONTSIZE * this.workspace_.scale) + 'pt';
  div.style.fontSize = fontSize;
  htmlInput.style.fontSize = fontSize;

  // Scratch compatibility
  div.className += ' fieldTextInput';

  /** @type {!HTMLInputElement} */
  Blockly.FieldTextInput.htmlInput_ = htmlInput;
  div.appendChild(htmlInput);

  htmlInput.value = htmlInput.defaultValue = this.text_;
  htmlInput.oldValue_ = null;
  this.validate_();
  this.resizeEditor_();
  if (!quietInput) {
    htmlInput.focus();
    htmlInput.select();
  }

  var that = this;
  if(window.quickAlgoInterface && quickAlgoInterface.displayKeypad) {
    var posTop = parseInt(Blockly.WidgetDiv.DIV.style.top) + 24;
    var posLeft = parseInt(Blockly.WidgetDiv.DIV.style.left);
    posTop = Math.max(posTop, 0);
    posLeft = Math.max(posLeft, 0);
    posTop = Math.min(posTop, (window.innerHeight || document.documentElement.clientHeight) - 270);
    posLeft = Math.min(posLeft, (window.innerWidth || document.documentElement.clientWidth) - 238);
    quickAlgoInterface.displayKeypad(
      this.text_,
      {top: posTop + 'px',
       left: posLeft + 'px'},
      function(value) {
        htmlInput.value = value;
        that.onHtmlInputChange_({});
      },
      function(value, validated) {
        htmlInput.value = value;
        if(validated) {
          Blockly.WidgetDiv.hide();
        } else {
          htmlInput.focus();
          htmlInput.select();
        }
      }, {minimum: this.min_, maximum: this.max_, precision: this.precision_});
       
  }

  // Bind to keydown -- trap Enter without IME and Esc to hide.
  htmlInput.onKeyDownWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keydown', this,
      this.onHtmlInputKeyDown_);
  // Bind to keyup -- trap Enter; resize after every keystroke.
  htmlInput.onKeyUpWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keyup', this,
      this.onHtmlInputChange_);
  // Bind to keyPress -- repeatedly resize when holding down a key.
  htmlInput.onKeyPressWrapper_ =
      Blockly.bindEventWithChecks_(htmlInput, 'keypress', this,
      this.onHtmlInputChange_);
  htmlInput.onWorkspaceChangeWrapper_ = this.resizeEditor_.bind(this);
  // Scratch compatibility
  htmlInput.onInputWrapper_ = [];
  this.workspace_.addChangeListener(htmlInput.onWorkspaceChangeWrapper_);
};

// Adapt to our custom Blockly.Variables.promptName behavior
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    var cb = function(text) {
      if (text) {
        workspace.renameVariable(oldVar, text);
      }
    };
    text = Blockly.Variables.promptName(
        Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar, cb);
    return null;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1',
      this.getText())) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};

// Allow some special characters
Blockly.Names.prototype.safeName_ = function(name) {
  if (!name) {
    return 'unnamed';
  } else {
    var newname = '';
    for(var i=0; i<name.length; i++) {
      if(i == 0 && '0123456789'.indexOf(name[i]) != -1) {
      // Most languages don't allow names with leading numbers.
        newname = 'my_';
      }
      if(name[i] == ' ')  {
        newname += '_';
      } else if('àâçéèêëïîôùü'.indexOf(name[i]) != -1) {
        newname += name[i];
      } else {
        newname += encodeURI(name[i]).replace(/[^\w]/g, '_');
      }
    }
    return newname;
  }
};

// Options for the variables flyout
Blockly.Procedures.resetFlyoutOptions = function (initial) {
  if (initial) {
    Blockly.Procedures.flyoutOptions = {
      disableArgs: false, // Disable the arguments mutator
      inlineArgs: false, // Put fields inline
      includedBlocks: { noret: false, ret: false, ifret: false }, // Blocks to add to the list
    };
  } else {
    // Keep inlineArgs option
    Blockly.Procedures.flyoutOptions.disableArgs = false;
    Blockly.Procedures.includedBlocks = { noret: false, ret: false, ifret: false };
  }
};
Blockly.Procedures.resetFlyoutOptions(true);

// Allow configuration of the category
Blockly.Procedures.flyoutCategory = function(workspace) {
  var incl = Blockly.Procedures.flyoutOptions.includedBlocks;
  var xmlList = [];
  if (incl.noret && Blockly.Blocks['procedures_defnoreturn']) {
    // <block type="procedures_defnoreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defnoreturn');
    block.setAttribute('gap', 16);
    var nameField = goog.dom.createDom('field', null,
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE);
    nameField.setAttribute('name', 'NAME');
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (incl.ret && Blockly.Blocks['procedures_defreturn']) {
    // <block type="procedures_defreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_defreturn');
    block.setAttribute('gap', 16);
    var nameField = goog.dom.createDom('field', null,
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE);
    nameField.setAttribute('name', 'NAME');
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (incl.ifret && Blockly.Blocks['procedures_ifreturn']) {
    // <block type="procedures_ifreturn" gap="16"></block>
    var block = goog.dom.createDom('block');
    block.setAttribute('type', 'procedures_ifreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  function populateProcedures(procedureList, templateName) {
    for (var i = 0; i < procedureList.length; i++) {
      var name = procedureList[i][0];
      var args = procedureList[i][1];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      var block = goog.dom.createDom('block');
      block.setAttribute('type', templateName);
      block.setAttribute('gap', 16);
      if (Blockly.Procedures.flyoutOptions.inlineArgs) {
        block.setAttribute('inline', true);
      }
      var mutation = goog.dom.createDom('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      for (var j = 0; j < args.length; j++) {
        var arg = goog.dom.createDom('arg');
        arg.setAttribute('name', args[j]);
        mutation.appendChild(arg);
      }
      xmlList.push(block);
    }
  }

  var tuple = Blockly.Procedures.allProcedures(workspace);
  populateProcedures(tuple[0], 'procedures_callnoreturn');
  populateProcedures(tuple[1], 'procedures_callreturn');
  return xmlList;
};

// Force thickness to always be 15
Blockly.Scrollbar.scrollbarThickness = 15;

/**
 * Recalculate a horizontal scrollbar's location on the screen and path length.
 * This should be called when the layout or size of the window has changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeViewHorizontal = function(hostMetrics) {
  var viewSize = hostMetrics.viewWidth - hostMetrics.flyoutWidth - 1;
  if (this.pair_) {
    // Shorten the scrollbar to make room for the corner square.
    viewSize -= Blockly.Scrollbar.scrollbarThickness;
  }
  this.setScrollViewSize_(Math.max(0, viewSize));

  var xCoordinate = hostMetrics.absoluteLeft + hostMetrics.flyoutWidth + 0.5;
  if (this.pair_ && this.workspace_.RTL) {
    xCoordinate += Blockly.Scrollbar.scrollbarThickness;
  }

  // Horizontal toolbar should always be just above the bottom of the workspace.
  var yCoordinate = hostMetrics.absoluteTop + hostMetrics.viewHeight -
      Blockly.Scrollbar.scrollbarThickness - 0.5;
  this.setPosition(xCoordinate, yCoordinate);

  // If the view has been resized, a content resize will also be necessary.  The
  // reverse is not true.
  this.resizeContentHorizontal(hostMetrics);
};

/**
 * Recalculate a horizontal scrollbar's location within its path and length.
 * This should be called when the contents of the workspace have changed.
 * @param {!Object} hostMetrics A data structure describing all the
 *     required dimensions, possibly fetched from the host object.
 */
Blockly.Scrollbar.prototype.resizeContentHorizontal = function(hostMetrics) {
  if (!this.pair_) {
    // Only show the scrollbar if needed.
    // Ideally this would also apply to scrollbar pairs, but that's a bigger
    // headache (due to interactions with the corner square).
    this.setVisible(this.scrollViewSize_ < hostMetrics.contentWidth);
  }

  this.ratio_ = this.scrollViewSize_ / hostMetrics.contentWidth;
  if (this.ratio_ == -Infinity || this.ratio_ == Infinity ||
      isNaN(this.ratio_)) {
    this.ratio_ = 0;
  }

  var handleLength = (hostMetrics.viewWidth - hostMetrics.flyoutWidth) * this.ratio_;
  this.setHandleLength_(Math.max(0, handleLength));

  var handlePosition = (hostMetrics.viewLeft - hostMetrics.contentLeft) *
      this.ratio_;
  this.setHandlePosition(this.constrainHandle_(handlePosition));
};


// Always enable touch events, especially as the detection is bad
// (computers with a touch screen won't be detected)
goog.events.BrowserFeature.TOUCH_ENABLED = true;
Blockly.Touch.TOUCH_MAP = {
  'mousedown': ['touchstart'],
  'mousemove': ['touchmove'],
  'mouseup': ['touchend', 'touchcancel']
};

// Fix case where there's no workspace (we're probably unloading)
Blockly.onMouseUp_ = function(e) {
  var workspace = Blockly.getMainWorkspace();
  if (!workspace || workspace.dragMode_ == Blockly.DRAG_NONE) {
    return;
  }
  Blockly.Touch.clearTouchIdentifier();
  Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
  workspace.dragMode_ = Blockly.DRAG_NONE;
  // Unbind the touch event if it exists.
  if (Blockly.Touch.onTouchUpWrapper_) {
    Blockly.unbindEvent_(Blockly.Touch.onTouchUpWrapper_);
    Blockly.Touch.onTouchUpWrapper_ = null;
  }
  if (Blockly.onMouseMoveWrapper_) {
    Blockly.unbindEvent_(Blockly.onMouseMoveWrapper_);
    Blockly.onMouseMoveWrapper_ = null;
  }
};


FioiBlockly.trashcanScale = 0.8;

Blockly.Trashcan.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
      this.left_ += metrics.flyoutWidth;
      if (this.workspace_.toolbox_) {
        this.left_ += metrics.absoluteLeft;
      }
    }
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
        this.WIDTH_ * FioiBlockly.trashcanScale - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
      this.left_ -= metrics.flyoutWidth;
    }
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
      (this.BODY_HEIGHT_ + this.LID_HEIGHT_) * FioiBlockly.trashcanScale - this.bottom_;

  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
    this.top_ -= metrics.flyoutHeight;
  }
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ') scale(' + FioiBlockly.trashcanScale + ')');
};

// Remove some characters which make JavaScript.STATEMENT_PREFIX instructions
// generation go wrong

(Blockly.genUid ? Blockly.genUid : Blockly.utils.genUid).soup_ = '!#()*+,-./:;=?@[]_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Modify to save somewhere all bound events
if(!Blockly.eventsBound) {
  Blockly.eventsBound = [];
}

Blockly.bindEventWithChecks_ = function(node, name, thisObject, func,
    opt_noCaptureIdentifier) {
  var handled = false;
  var wrapFunc = function(e) {
    // Set touchDetected on touch events
    if(goog.string.startsWith(e.type, 'touch')) {
       window.touchDetected = true;
    }

    var captureIdentifier = !opt_noCaptureIdentifier;
    // Handle each touch point separately.  If the event was a mouse event, this
    // will hand back an array with one element, which we're fine handling.
    var events = Blockly.Touch.splitEventByTouches(e);
    for (var i = 0, event; event = events[i]; i++) {
      if (captureIdentifier && !Blockly.Touch.shouldHandleEvent(event)) {
        continue;
      }
      Blockly.Touch.setClientFromTouch(event);
      if (thisObject) {
        func.call(thisObject, event);
      } else {
        func(event);
      }
      handled = true;
    }
  };

  node.addEventListener(name, wrapFunc, false);
  Blockly.eventsBound.push({node: node, name: name, func: wrapFunc});
  var bindData = [[node, name, wrapFunc]];

  // Add equivalent touch event.
  if (name in Blockly.Touch.TOUCH_MAP) {
    var touchWrapFunc = function(e) {
      wrapFunc(e);
      // Stop the browser from scrolling/zooming the page.
      if (handled) {
        e.preventDefault();
      }
    };
    for (var i = 0, eventName;
         eventName = Blockly.Touch.TOUCH_MAP[name][i]; i++) {
      node.addEventListener(eventName, touchWrapFunc, false);
      Blockly.eventsBound.push({node: node, name: eventName, func: func});
      bindData.push([node, eventName, touchWrapFunc]);
    }
  }
  return bindData;
};


// Function to remove all bound events
Blockly.removeEvents = function() {
  for(var i=0; i<Blockly.eventsBound.length; i++) {
    var eData = Blockly.eventsBound[i];
    try {
      eData.node.removeEventListener(eData.name, eData.func);
    } catch(e) {}
  }
  if(Blockly.documentEventsBound_) {
    document.removeEventListener('mouseup', Blockly.onMouseUp_);
    Blockly.documentEventsBound_ = false;
  }
  Blockly.eventsBound = [];
}

// Validate contents of the expression block
// Returns null if the expression is valid
Blockly.validateExpression = function(text, workspace) {
  try {
    var acorn = window.acorn ? window.acorn : require('acorn');
    var walk = acorn.walk ? acorn.walk : require('acorn-walk');
  } catch(e) {
    console.error("Couldn't validate expression as acorn or acorn-walk is missing.");
    return null;
  }

  // acorn parses programs, it won't tell if there's a ';'
  if(text.indexOf(';') != -1) {
    // Semi-colon is not allowed
    return Blockly.Msg.EVAL_ERROR_SEMICOLON;
  }

  // Parse the expression
  try {
    var ast = acorn.parse(text);
  } catch(e) {
    // Couldn't parse
    return Blockly.Msg.EVAL_ERROR_SYNTAX;
  }

  var msg = null;
  var variableList = null;
  var allowedTypes = ["Literal", "Identifier", "BinaryExpression", "UnaryExpression", "ArrayExpression", "MemberExpression", "ExpressionStatement", "Program"];
  function checkAst(node, state, type) {
    if(allowedTypes.indexOf(type) == -1) {
      // Type is not allowed
      msg = Blockly.Msg.EVAL_ERROR_TYPE.replace('%1', type);
      return;
    }

    if(type == "MemberExpression" && (text[node.object.end] != '[' || node.property.end == node.end || text[node.end-1] != ']')) {
      // This type of MemberExpression is not allowed
      msg = Blockly.Msg.EVAL_ERROR_TYPE.replace('%1', type);
      return;
    }

    if(type == "Identifier" && workspace) {
      // Check if variable is defined
      if(variableList === null) {
        variableList = workspace.variableList;
      }
      if(variableList && variableList.indexOf(node.name) == -1) {
        // Variable is not defined
        msg = Blockly.Msg.EVAL_ERROR_VAR.replace('%1', node.name);
        return;
      }
    }
  }

  // Walk the AST
  walk.full(ast, checkAst);

  return msg;
};

// Reindex 1-based array indexes to 0-based
Blockly.reindexExpression = function(text, workspace) {
  if(Blockly.validateExpression(text, workspace) !== null) {
    // We shouldn't be generating code for an invalid block
    return null;
  }

  try {
    var acorn = window.acorn ? window.acorn : require('acorn');
    var walk = acorn.walk ? acorn.walk : require('acorn-walk');
  } catch(e) {
    console.error("Couldn't reindex expression as acorn or acorn-walk is missing.");
    return null;
  }

  // Parsing worked for validate, it will work this time too
  var ast = acorn.parse(text);

  // This array will contain the pairs of positions for '[' and ']'
  var reindexes = [];
  var newText = text;
  function getReindexes(node, state, type) {
    if(type == "MemberExpression") {
      reindexes.push([node.object.end, node.end-1]);
    }
  }

  // Walk the AST
  walk.full(ast, getReindexes);

  // Apply reindexing
  for(var i=0; i < reindexes.length; i++) {
    var start = reindexes[i][0];
    var end = reindexes[i][1];

    newText = newText.slice(0, start+1) + '(' + newText.slice(start+1, end) + ')-1' + newText.slice(end);

    // Adjust start and end for next reindexes
    for(var j=i+1; j < reindexes.length; j++) {
      if(start < reindexes[j][0]) {
        reindexes[j][0] += 1;
      }
      if(start < reindexes[j][1]) {
        reindexes[j][1] += 1;
      }
      if(end < reindexes[j][0]) {
        reindexes[j][0] += 3;
      }
      if(end < reindexes[j][1]) {
        reindexes[j][1] += 3;
      }
    }
  }

  return newText;
};

// Options for the variables flyout
Blockly.Variables.resetFlyoutOptions = function() {
  Blockly.Variables.flyoutOptions = {
    any: false, // Allow to create any variable
    anyButton: true, // Add the button to add variables (needs any=true)
    fixed: [], // List of fixed variables (will create blocks for each of them)
    includedBlocks: {get: true, set: true, incr: true}, // Blocks to add to the list
    shortList: true, // Generate set/incr blocks only for the first (non-fixed) variable
    };
};
Blockly.Variables.resetFlyoutOptions();

// Construct the blocks required by the flyout for the variable category.
Blockly.Variables.flyoutCategory = function(workspace) {
  var xmlList = [];
  var options = Blockly.Variables.flyoutOptions;

  // Detect if we're in Blockly or Scratch
  var scratchMode = !!(Blockly.registerButtonCallback);
  if(options.any) {
    if(workspace) {
      var fullVariableList = workspace.variableList;
    } else {
      if(options.fixed.indexOf('newvar') > -1) {
        var newVarIdx = 0;
        while(options.fixed.indexOf('newvar'+newVarIdx) > -1) {
          newVarIdx++;
        }
        var fullVariableList = ['newvar'+newVarIdx];
      } else {
        var fullVariableList = ['newvar'];
      }
    }
    for(var i=0; i<options.fixed.length; i++) {
      var idx = fullVariableList.indexOf(options.fixed[i]);
      if(idx > -1) {
        fullVariableList.splice(idx, 1);
      }
    }
    fullVariableList.sort(goog.string.caseInsensitiveCompare);

    if(options.anyButton) {
      var button = goog.dom.createDom('button');
      button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
      if(scratchMode) {
        // Scratch
        button.setAttribute('callbackKey', 'CREATE_VARIABLE');
        Blockly.registerButtonCallback('CREATE_VARIABLE', function(button) {
          Blockly.Variables.createVariable(button.getTargetWorkspace());
        });
      }
      xmlList.push(button);
    }
  } else {
    var fullVariableList = [];
  }

  var variableList = options.fixed.concat(fullVariableList);

  if (variableList.length > 0) {
    if(scratchMode) {
      var blockNames = {
        get: 'data_variable',
        set: 'data_setvariableto',
        incr: 'data_changevariableby'
        };
    } else {
      var blockNames = {
        get: 'variables_get',
        set: 'variables_set',
        incr: 'math_change'
        };
    }

    if (options.includedBlocks.get && Blockly.Blocks[blockNames.get]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_get" gap="8">
        //   <field name="VAR">item</field>
        // </block>
        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.get);
        if (!options.any && i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
        }

        block.appendChild(field);
        xmlList.push(block);
      }
    }

    if (options.includedBlocks.set && Blockly.Blocks[blockNames.set]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="variables_set" gap="20">
        //   <field name="VAR">item</field>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.set);
        if (!options.any && i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }

        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createTextDom_());
        } else {
          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }
    if (options.includedBlocks.incr && Blockly.Blocks[blockNames.incr]) {
      for(var i=0; i<variableList.length; i++) {
        // <block type="math_change">
        //   <value name="DELTA">
        //     <shadow type="math_number">
        //       <field name="NUM">1</field>
        //     </shadow>
        //   </value>
        // </block>
        if(options.shortList && i > options.fixed.length) {
          break;
        }

        var block = goog.dom.createDom('block');
        block.setAttribute('type', blockNames.incr);
        if (!options.any && i < options.fixed.length) {
          block.setAttribute('editable', 'false');
        }
        if (i == variableList.length - 1) {
          block.setAttribute('gap', 24);
        } else {
          block.setAttribute('gap', 8);
        }
        if(scratchMode) {
          var field = Blockly.Variables.createVariableDom_(variableList[i]);
          block.appendChild(field);
          block.appendChild(Blockly.Variables.createMathNumberDom_())
        } else {
          var value = goog.dom.createDom('value');
          value.setAttribute('name', 'DELTA');
          block.appendChild(value);

          var shadowBlock = goog.dom.createDom('shadow');
          shadowBlock.setAttribute('type', 'math_number');
          value.appendChild(shadowBlock);

          var numberField = goog.dom.createDom('field', null, '1');
          numberField.setAttribute('name', 'NUM');
          shadowBlock.appendChild(numberField);

          var field = goog.dom.createDom('field', null, variableList[i]);
          field.setAttribute('name', 'VAR');
          block.appendChild(field);
        }

        xmlList.push(block);
      }
    }

  }
  return xmlList;
};

// Adapt to our custom Blockly.Variables.promptName behavior
// We also return null instead of the variable name as anyway no call seems to
// read the return value
Blockly.Variables.createVariable = function(workspace) {
  var cb = function(text) {
    if (text) {
      if (workspace.variableIndexOf(text) != -1) {
        displayHelper.showPopupMessage(Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace('%1',
            text.toLowerCase()), 'blanket');
      } else {
        workspace.createVariable(text);
      }
    }
  }
  Blockly.Variables.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '', cb);
  return null;
};

/**
 * Prompt the user for a new variable name.
 * @param {string} promptText The string of the prompt.
 * @param {string} defaultText The default value to show in the prompt's field.
 * @return {?string} The new variable name, or null if the user picked
 *     something illegal.
 */
Blockly.Variables.promptName = function(promptText, defaultText, callback, wasInvalid) {
  var cb = function (newVar) {
    // Merge runs of whitespace.  Strip leading and trailing whitespace.
    if (newVar) {
      newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
      // Check name is legal
      if (Blockly.Names.prototype.safeName_(newVar) != newVar) {
        Blockly.Variables.promptName(promptText, newVar, callback, true);
        return;
      }
      if (newVar == Blockly.Msg.RENAME_VARIABLE ||
          newVar == Blockly.Msg.NEW_VARIABLE) {
        // Ok, not ALL names are legal...
        newVar = null;
      }
    };
    callback(newVar);
  };

  if(wasInvalid) {
    var fullPromptText = '<i>' + Blockly.Msg.INVALID_NAME + '</i><br />' + promptText;
  } else {
    var fullPromptText = promptText;
  }
  if(defaultText) {
    displayHelper.showPopupMessage(fullPromptText, 'input', null, cb, Blockly.Msg.UNDO, null, defaultText);
  } else {
    displayHelper.showPopupMessage(fullPromptText, 'input', null, cb);
  }
};

Blockly.Workspace.prototype.remainingCapacity = function(maxBlocks) {
  if(!maxBlocks) {
    maxBlocks = this.options.maxBlocks;
  }
  if (isNaN(maxBlocks)) {
    return Infinity;
  }
  var allBlocks = this.getAllBlocks();
  var nbBlocks = 0;
  for(var i = 0; i < allBlocks.length; i++) {
    var block = allBlocks[i];
    // Ignore placeholders
    if(block.type.substring(0, 12) == 'placeholder_') {
      continue;
    }
    nbBlocks++;
  }
  return maxBlocks - nbBlocks;
};

// reportValue allows to show a popup next to a block
Blockly.WorkspaceSvg.prototype.reportValue = function(id, value) {
  var block = this.getBlockById(id);
  if (!block) {
    throw 'Tried to report value on block that does not exist.';
  }
  Blockly.DropDownDiv.createDom();
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var contentDiv = Blockly.DropDownDiv.getContentDiv();
  var valueReportBox = goog.dom.createElement('div');
  valueReportBox.setAttribute('class', 'valueReportBox');
  valueReportBox.innerHTML = value;
  contentDiv.appendChild(valueReportBox);
  Blockly.DropDownDiv.setColour("#FFFFFF", "#AAAAAA");
  Blockly.DropDownDiv.showPositionedByBlock(this, block);
};

// Fix issue when unloading
Blockly.WorkspaceSvg.prototype.translate = function(x, y) {
  var translation = 'translate(' + x + ',' + y + ') ' +
      'scale(' + this.scale + ')';
  if(this.svgBlockCanvas_) {
    this.svgBlockCanvas_.setAttribute('transform', translation);
  }
  if(this.svgBubbleCanvas_) {
    this.svgBubbleCanvas_.setAttribute('transform', translation);
  }
  if(this.dragSurface) {
    this.dragSurface.translateAndScaleGroup(x, y, this.scale);
  }
};

// Change zoom origin to be x = 0, y = 0 instead of the center of the screen
Blockly.WorkspaceSvg.prototype.zoom = function(x, y, type) {
  var speed = this.options.zoomOptions.scaleSpeed;
  var metrics = this.getMetrics();
  var center = this.getParentSvg().createSVGPoint();
  center.x = 0;
  center.y = 0;
  center = center.matrixTransform(this.getCanvas().getCTM().inverse());
  x = center.x;
  y = center.y;
  var canvas = this.getCanvas();
  // Scale factor.
  var scaleChange = (type == 1) ? speed : 1 / speed;
  // Clamp scale within valid range.
  var newScale = this.scale * scaleChange;
  if (newScale > this.options.zoomOptions.maxScale) {
    scaleChange = this.options.zoomOptions.maxScale / this.scale;
  } else if (newScale < this.options.zoomOptions.minScale) {
    scaleChange = this.options.zoomOptions.minScale / this.scale;
  }
  if (this.scale == newScale) {
    return;  // No change in zoom.
  }
  if (this.scrollbar) {
    var matrix = canvas.getCTM()
        .translate(x * (1 - scaleChange), y * (1 - scaleChange))
        .scale(scaleChange);
    // newScale and matrix.a should be identical (within a rounding error).
    this.scrollX = matrix.e - metrics.absoluteLeft;
    this.scrollY = matrix.f - metrics.absoluteTop;
  }
  this.setScale(newScale);
};

Blockly.WorkspaceSvg.prototype.traceOn = function(armed) {
  this.traceOn_ = armed;
  if (this.traceWrapper_) {
    Blockly.unbindEvent_(this.traceWrapper_);
    this.traceWrapper_ = null;
  }
  if (armed && this.svgBlockCanvas_) {
    this.traceWrapper_ = Blockly.bindEventWithChecks_(this.svgBlockCanvas_,
        'blocklySelectChange', this, function() {this.traceOn_ = false;});
  }
};

FioiBlockly.zoomControlsScale = 0.8;

Blockly.ZoomControls.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
      this.left_ += metrics.flyoutWidth;
      if (this.workspace_.toolbox_) {
        this.left_ += metrics.absoluteLeft;
      }
    }
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
        this.WIDTH_ * FioiBlockly.zoomControlsScale - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
      this.left_ -= metrics.flyoutWidth;
    }
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
      this.HEIGHT_ * FioiBlockly.zoomControlsScale - this.bottom_;
  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
    this.top_ -= metrics.flyoutHeight;
  }
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ') scale(' + FioiBlockly.zoomControlsScale + ')');
};

FioiBlockly.Msg.en = {};

FioiBlockly.Msg.en.VARIABLES_DEFAULT_NAME = "element";
FioiBlockly.Msg.en.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.en.DICTS_CREATE_EMPTY_TITLE = "Leeres Wörterbuch";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Wörterbuch erstellen";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_INPUT_WITH = "Wörterbuch erstellen aus:";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_KEY = "ckey";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_TITLE = "key/value";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.en.DICT_GET = "get the key";
FioiBlockly.Msg.en.DICT_GET_TO = "from";
FioiBlockly.Msg.en.DICT_KEYS = "list of the keys of";
FioiBlockly.Msg.en.DICT_SET_TITLE = "assign to key";
FioiBlockly.Msg.en.DICT_SET_OF = "of dictionary";
FioiBlockly.Msg.en.DICT_SET_TO = "to";

FioiBlockly.Msg.en.TEXT_PRINT_TITLE = "gib aus Zeile %1";
FioiBlockly.Msg.en.TEXT_PRINT_TOOLTIP = "Print the text, number or other value, with a newline after.";
FioiBlockly.Msg.en.TEXT_PRINT_NOEND_TITLE = "gib aus %1";
FioiBlockly.Msg.en.TEXT_PRINT_NOEND_TOOLTIP = "Print the text, number or other value, without newline.";

FioiBlockly.Msg.en.LISTS_APPEND_MSG = "to the list %1 add the element %2";
FioiBlockly.Msg.en.LISTS_APPEND_TOOLTIP = "Add an element to the list '%1'";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FIRST = "at the beginning";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FROM_END = "at the index from the end";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FROM_START = "at the index";
FioiBlockly.Msg.en.LISTS_GET_INDEX_GET = "get value";
FioiBlockly.Msg.en.LISTS_GET_INDEX_GET_REMOVE = "get and remove value";
FioiBlockly.Msg.en.LISTS_GET_INDEX_LAST = "at the end";
FioiBlockly.Msg.en.LISTS_GET_INDEX_RANDOM = "at a random index";
FioiBlockly.Msg.en.LISTS_GET_INDEX_REMOVE = "remove value";
FioiBlockly.Msg.en.LISTS_SET_INDEX_INSERT = "insert";
FioiBlockly.Msg.en.LISTS_SORT_TITLE = "return the sort %1 %2 of list %3"
FioiBlockly.Msg.en.LISTS_SORT_PLACE_MSG = "sort list %1 in place";
FioiBlockly.Msg.en.LISTS_SORT_PLACE_TOOLTIP = "Sorts list '%1' and modifies it directly.";

FioiBlockly.Msg.en.INPUT_NUM = "read a single number on the whole line";
FioiBlockly.Msg.en.INPUT_NUM_TOOLTIP = "Reads a single number on a line, on the program input.";
FioiBlockly.Msg.en.INPUT_NUM_LIST = "read a list of numbers on a line";
FioiBlockly.Msg.en.INPUT_NUM_LIST_TOOLTIP = "Reads a list of numbers on a line, on the program input.";
FioiBlockly.Msg.en.INPUT_NUM_NEXT = "read a number";
FioiBlockly.Msg.en.INPUT_NUM_NEXT_TOOLTIP = "Reads the next number on the program input.";
FioiBlockly.Msg.en.INPUT_CHAR = "read a character";
FioiBlockly.Msg.en.INPUT_CHAR_TOOLTIP = "Reads a character on the program input.";
FioiBlockly.Msg.en.INPUT_WORD = "read a word";
FioiBlockly.Msg.en.INPUT_WORD_TOOLTIP = "Reads a word on the program input.";
FioiBlockly.Msg.en.INPUT_LINE = "read a line";
FioiBlockly.Msg.en.INPUT_LINE_TOOLTIP = "Reads a line on the program input.";

FioiBlockly.Msg.en.CANNOT_DELETE_VARIABLE_PROCEDURE = "Variable '%1' kann nicht gelöscht werden weil sie von Funktion '%2' genutzt wird.";

FioiBlockly.Msg.en.DATA_REPLACEITEMOFLIST_TITLE = "replace element %1 of list %2 with %3";
FioiBlockly.Msg.en.DATA_ITEMOFLIST_TITLE = "element %1 in %2";
FioiBlockly.Msg.en.DATA_LISTREPEAT_TITLE = "initialize list %1 with %2 repeated %3 times";

FioiBlockly.Msg.en.INVALID_NAME = "Ungültiger Name. Erlaubt sind nur Buchstaben, Ziffern (außer als erstes Zeichen) und Unterstriche '_'.";

FioiBlockly.Msg.en = {};

FioiBlockly.Msg.en.VARIABLES_DEFAULT_NAME = "element";
FioiBlockly.Msg.en.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.en.DICTS_CREATE_EMPTY_TITLE = "empty dictionary";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Create a dictionary";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_INPUT_WITH = "create a dictionary :";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_KEY = "ckey";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_TITLE = "key/value";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.en.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.en.DICT_GET = "get the key";
FioiBlockly.Msg.en.DICT_GET_TO = "from";
FioiBlockly.Msg.en.DICT_KEYS = "list of the keys of";
FioiBlockly.Msg.en.DICT_SET_TITLE = "assign to key";
FioiBlockly.Msg.en.DICT_SET_OF = "of dictionary";
FioiBlockly.Msg.en.DICT_SET_TO = "to";

FioiBlockly.Msg.en.TEXT_PRINT_TITLE = "print line %1";
FioiBlockly.Msg.en.TEXT_PRINT_TOOLTIP = "Print the text, number or other value, with a newline after.";
FioiBlockly.Msg.en.TEXT_PRINT_NOEND_TITLE = "print %1";
FioiBlockly.Msg.en.TEXT_PRINT_NOEND_TOOLTIP = "Print the text, number or other value, without newline.";

FioiBlockly.Msg.en.LISTS_APPEND_MSG = "to the list %1 add the element %2";
FioiBlockly.Msg.en.LISTS_APPEND_TOOLTIP = "Add an element to the list '%1'";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FIRST = "at the beginning";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FROM_END = "at the index from the end";
FioiBlockly.Msg.en.LISTS_GET_INDEX_FROM_START = "at the index";
FioiBlockly.Msg.en.LISTS_GET_INDEX_GET = "get value";
FioiBlockly.Msg.en.LISTS_GET_INDEX_GET_REMOVE = "get and remove value";
FioiBlockly.Msg.en.LISTS_GET_INDEX_LAST = "at the end";
FioiBlockly.Msg.en.LISTS_GET_INDEX_RANDOM = "at a random index";
FioiBlockly.Msg.en.LISTS_GET_INDEX_REMOVE = "remove value";
FioiBlockly.Msg.en.LISTS_SET_INDEX_INSERT = "insert";
FioiBlockly.Msg.en.LISTS_SORT_TITLE = "return the sort %1 %2 of list %3"
FioiBlockly.Msg.en.LISTS_SORT_PLACE_MSG = "sort list %1 in place";
FioiBlockly.Msg.en.LISTS_SORT_PLACE_TOOLTIP = "Sorts list '%1' and modifies it directly.";

FioiBlockly.Msg.en.INPUT_NUM = "read a single number on the whole line";
FioiBlockly.Msg.en.INPUT_NUM_TOOLTIP = "Reads a single number on a line, on the program input.";
FioiBlockly.Msg.en.INPUT_NUM_LIST = "read a list of numbers on a line";
FioiBlockly.Msg.en.INPUT_NUM_LIST_TOOLTIP = "Reads a list of numbers on a line, on the program input.";
FioiBlockly.Msg.en.INPUT_NUM_NEXT = "read a number";
FioiBlockly.Msg.en.INPUT_NUM_NEXT_TOOLTIP = "Reads the next number on the program input.";
FioiBlockly.Msg.en.INPUT_CHAR = "read a character";
FioiBlockly.Msg.en.INPUT_CHAR_TOOLTIP = "Reads a character on the program input.";
FioiBlockly.Msg.en.INPUT_WORD = "read a word";
FioiBlockly.Msg.en.INPUT_WORD_TOOLTIP = "Reads a word on the program input.";
FioiBlockly.Msg.en.INPUT_LINE = "read a line";
FioiBlockly.Msg.en.INPUT_LINE_TOOLTIP = "Reads a line on the program input.";

FioiBlockly.Msg.en.CANNOT_DELETE_VARIABLE_PROCEDURE = "Cannot delete variable '%1', used by procedure '%2'.";

FioiBlockly.Msg.en.DATA_REPLACEITEMOFLIST_TITLE = "replace element %1 of list %2 with %3";
FioiBlockly.Msg.en.DATA_ITEMOFLIST_TITLE = "element %1 in %2";
FioiBlockly.Msg.en.DATA_LISTREPEAT_TITLE = "initialize list %1 with %2 repeated %3 times";

FioiBlockly.Msg.en.INVALID_NAME = "Invalid name, please only use letters, some letters with accents, digits (except as first character), and underscore '_'.";

FioiBlockly.Msg.en.MATH_DIVISIONFLOOR_SYMBOL = ' // ';
FioiBlockly.Msg.en.MATH_ARITHMETIC_TOOLTIP_DIVIDEFLOOR = "Return the whole part of the division of the two numbers.";

FioiBlockly.Msg.es = {};

FioiBlockly.Msg.es.VARIABLES_DEFAULT_NAME = "elemento";
FioiBlockly.Msg.es.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.es.DICTS_CREATE_EMPTY_TITLE = "diccionario vacío";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Crear un diccionario";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_INPUT_WITH = "crear un diccionario:";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_ITEM_KEY = "llave";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_ITEM_TITLE = "llave/valor";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.es.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.es.DICT_GET = "recuperar la llave";
FioiBlockly.Msg.es.DICT_GET_TO = "de";
FioiBlockly.Msg.es.DICT_KEYS = "listado de llaves de";
FioiBlockly.Msg.es.DICT_SET_TITLE = "modificar la llave";
FioiBlockly.Msg.es.DICT_SET_OF = "del diccionario";
FioiBlockly.Msg.es.DICT_SET_TO = "a";

FioiBlockly.Msg.es.TEXT_PRINT_TITLE = "imprimir línea %1";
FioiBlockly.Msg.es.TEXT_PRINT_TOOLTIP = "Imprimir el texto, número u otro valor, seguido de un retorno de línea.";
FioiBlockly.Msg.es.TEXT_PRINT_NOEND_TITLE = "imprimir %1";
FioiBlockly.Msg.es.TEXT_PRINT_NOEND_TOOLTIP = "Imprimir el texto, número u otro valor, sin retorno de línea.";

FioiBlockly.Msg.es.TEXT_EVAL_TITLE = "evaluar";
FioiBlockly.Msg.es.TEXT_EVAL_TOOLTIP = "Evaluar la expresión aritmética especificada.";
FioiBlockly.Msg.es.TEXT_EVAL_INVALID = "Atención: %1; este bloque retornará 'falso' !";

FioiBlockly.Msg.es.EVAL_ERROR_SEMICOLON = "el punto y coma ';' no está permitido";
FioiBlockly.Msg.es.EVAL_ERROR_SYNTAX = "la expresión no es sintácticamente válida";
FioiBlockly.Msg.es.EVAL_ERROR_TYPE = "este tipo de expresión (%1) no es permitida";
FioiBlockly.Msg.es.EVAL_ERROR_VAR = "esta expresión utiliza una variable '%1' no definida";

FioiBlockly.Msg.es.LISTS_APPEND_MSG = "a la lista %1 agregar el elemento %2";
FioiBlockly.Msg.es.LISTS_APPEND_TOOLTIP = "Agregar un elemento a la lista '%1'";
FioiBlockly.Msg.es.LISTS_CREATE_WITH_TOO_LARGE = "El tamaño de la lista es muy grande: %1 > tamaño máximo permitido %2";
FioiBlockly.Msg.es.LISTS_GET_INDEX_FIRST = "al inicio";
FioiBlockly.Msg.es.LISTS_GET_INDEX_FROM_END = "en el índice a partir del final";
FioiBlockly.Msg.es.LISTS_GET_INDEX_FROM_START = "en el índice";
FioiBlockly.Msg.es.LISTS_GET_INDEX_GET = "obtener valor";
FioiBlockly.Msg.es.LISTS_GET_INDEX_GET_REMOVE = "obtener y remover valor";
FioiBlockly.Msg.es.LISTS_GET_INDEX_LAST = "al final";
FioiBlockly.Msg.es.LISTS_GET_INDEX_RANDOM = "en un índice aleatorio";
FioiBlockly.Msg.es.LISTS_GET_INDEX_REMOVE = "remover el valor";
FioiBlockly.Msg.es.LISTS_SET_INDEX_INSERT = "insertar";
FioiBlockly.Msg.es.LISTS_SORT_TITLE = "retornar el ordenamiento %1 %2 de la lista %3"
FioiBlockly.Msg.es.LISTS_SORT_PLACE_MSG = "ordenar la lista %1 en su lugar";
FioiBlockly.Msg.es.LISTS_SORT_PLACE_TOOLTIP = "Ordena la lista '%1' y la modifica directamente.";

FioiBlockly.Msg.es.INPUT_NUM = "leer un sólo número en toda la línea";
FioiBlockly.Msg.es.INPUT_NUM_TOOLTIP = "Lee un sólo número en una lína, en la entrada del programa.";
FioiBlockly.Msg.es.INPUT_NUM_LIST = "leer una lista de números en una línea";
FioiBlockly.Msg.es.INPUT_NUM_LIST_TOOLTIP = "Lee una lista de números en una línea, en la entrada del programa.";
FioiBlockly.Msg.es.INPUT_NUM_NEXT = "leer un número";
FioiBlockly.Msg.es.INPUT_NUM_NEXT_TOOLTIP = "Leer el próximo número en la entrada del programa.";
FioiBlockly.Msg.es.INPUT_CHAR = "leer un caracter";
FioiBlockly.Msg.es.INPUT_CHAR_TOOLTIP = "Lee un caracter desde la entrada del programa.";
FioiBlockly.Msg.es.INPUT_WORD = "leer una palabra";
FioiBlockly.Msg.es.INPUT_WORD_TOOLTIP = "Lee una palabra desde la entrada del programa.";
FioiBlockly.Msg.es.INPUT_LINE = "leer una línea";
FioiBlockly.Msg.es.INPUT_LINE_TOOLTIP = "Lee una línea desde la entrada del programa.";

FioiBlockly.Msg.es.CANNOT_DELETE_VARIABLE_PROCEDURE = "No es posible borrar la variable '%1', es utilizada en el procedimiento '%2'.";

FioiBlockly.Msg.es.DATA_REPLACEITEMOFLIST_TITLE = "reemplazar el elemento %1 de la lista %2 con %3";
FioiBlockly.Msg.es.DATA_ITEMOFLIST_TITLE = "elemento %1 en %2";
FioiBlockly.Msg.es.DATA_LISTREPEAT_TITLE = "inicializar la lista %1 con %2 repetido %3 veces";

FioiBlockly.Msg.es.INVALID_NAME = "Nombre inválido. Favor utilice únicamente letras, algunas letras acentuadas, dígitos (excepto como primer caracter), y guión bajo '_'.";

FioiBlockly.Msg.es.TABLES_2D_INIT = "inicializar la tabla 2D %1 con %2 líneas y %3 columnas conteniendo %4";
FioiBlockly.Msg.es.TABLES_2D_INIT_TOOLTIP = "Crear una tabla con el número especificado de líneas y columnas, e inicializar cada casilla al valor dado.";
FioiBlockly.Msg.es.TABLES_2D_SET = "en %1[%2][%3] escribir %4";
FioiBlockly.Msg.es.TABLES_3D_SET_TOOLTIP = "Escribir el valor en la casilla [línea][columna] de la tabla %1.";
FioiBlockly.Msg.es.TABLES_2D_GET = "%1[%2][%3]";
FioiBlockly.Msg.es.TABLES_2D_GET_TOOLTIP = "Leer el valor de la casilla [línea][columna] de la tabla %1.";

FioiBlockly.Msg.es.TABLES_3D_INIT = "inicializar la tabla %1 con %2 capas, %3 líneas, %4 columnas conteniendo %5";
FioiBlockly.Msg.es.TABLES_3D_INIT_TOOLTIP = "Crear una tabla con el número especificado de líneas, de columnas y de niveles, e inicializar cada casilla al valor dado.";
FioiBlockly.Msg.es.TABLES_3D_SET = "en %1[%2][%3][%4] escribir %5";
FioiBlockly.Msg.es.TABLES_3D_SET_TOOLTIP = "Escribir el valor en la casilla [capa][línea][columna] de la tabla %1.";
FioiBlockly.Msg.es.TABLES_3D_GET = "%1[%2][%3][%4]";
FioiBlockly.Msg.es.TABLES_3D_GET_TOOLTIP = "Leer el valor de la casilla [capa][línea][columna] de la tabla %1.";

FioiBlockly.Msg.es.TABLES_VAR_NAME = "tablas";
FioiBlockly.Msg.es.TABLES_TOO_BIG = "¡Las dimensiones de la tabla son muy grandes!";
FioiBlockly.Msg.es.TABLES_OUT_OF_BOUNDS = "¡Se intentó acceder a una casilla fuera de la tabla!";

FioiBlockly.Msg.fr = {};

FioiBlockly.Msg.fr.VARIABLES_DEFAULT_NAME = "element";
FioiBlockly.Msg.fr.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.fr.DICTS_CREATE_EMPTY_TITLE = "dictionnaire vide";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Créer un dictionnaire";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_INPUT_WITH = "créer un dictionnaire :";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_ITEM_KEY = "cle";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_ITEM_TITLE = "clé/valeur";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.fr.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.fr.DICT_GET = "récupérer la clé";
FioiBlockly.Msg.fr.DICT_GET_TO = "de";
FioiBlockly.Msg.fr.DICT_KEYS = "liste des clés de";
FioiBlockly.Msg.fr.DICT_SET_TITLE = "affecter la clé";
FioiBlockly.Msg.fr.DICT_SET_OF = "du dictionnaire";
FioiBlockly.Msg.fr.DICT_SET_TO = "à";

FioiBlockly.Msg.fr.TEXT_PRINT_TITLE = "afficher la ligne %1";
FioiBlockly.Msg.fr.TEXT_PRINT_TOOLTIP = "Afficher le texte, le nombre ou une autre valeur spécifiée, avec retour à la ligne après.";
FioiBlockly.Msg.fr.TEXT_PRINT_NOEND_TITLE = "afficher %1";
FioiBlockly.Msg.fr.TEXT_PRINT_NOEND_TOOLTIP = "Afficher le texte, le nombre ou une autre valeur spécifiée, sans retour à la ligne.";

FioiBlockly.Msg.fr.TEXT_EVAL_TITLE = "évaluer";
FioiBlockly.Msg.fr.TEXT_EVAL_TOOLTIP = "Évalue l'expression arithmétique spécifiée.";
FioiBlockly.Msg.fr.TEXT_EVAL_INVALID = "Attention : %1 ; ce bloc retournera 'faux' !";

FioiBlockly.Msg.fr.EVAL_ERROR_SEMICOLON = "le point-virgule ';' n'est pas autorisé";
FioiBlockly.Msg.fr.EVAL_ERROR_SYNTAX = "l'expression n'est pas syntaxiquement valide";
FioiBlockly.Msg.fr.EVAL_ERROR_TYPE = "ce type d'expression (%1) n'est pas autorisé";
FioiBlockly.Msg.fr.EVAL_ERROR_VAR = "cette expression utilise une variable '%1' non définie";

FioiBlockly.Msg.fr.LISTS_APPEND_MSG = "à la liste %1 ajouter l'élément %2";
FioiBlockly.Msg.fr.LISTS_APPEND_TOOLTIP = "Ajouter un élément à la liste '%1'";
FioiBlockly.Msg.fr.LISTS_CREATE_WITH_TOO_LARGE = "Taille de la liste trop grande : %1 > taille maximale autorisée %2"
FioiBlockly.Msg.fr.LISTS_GET_INDEX_FIRST = "au début";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_FROM_END = "à l'indice depuis la fin";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_FROM_START = "à l'indice";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_GET = "obtenir la valeur";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_GET_REMOVE = "obtenir et supprimer la valeur";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_LAST = "à la fin";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_RANDOM = "à un indice aléatoire";
FioiBlockly.Msg.fr.LISTS_GET_INDEX_REMOVE = "supprimer la valeur";
FioiBlockly.Msg.fr.LISTS_SET_INDEX_INSERT = "insérer";
FioiBlockly.Msg.fr.LISTS_SORT_TITLE = "renvoyer le tri %1 %2 de la liste %3"
FioiBlockly.Msg.fr.LISTS_SORT_PLACE_MSG = "trier la liste %1 sur place";
FioiBlockly.Msg.fr.LISTS_SORT_PLACE_TOOLTIP = "Trie la liste '%1' et la modifie directement.";

FioiBlockly.Msg.fr.INPUT_NUM = "lire un nombre seul sur une ligne";
FioiBlockly.Msg.fr.INPUT_NUM_TOOLTIP = "Lit un nombre seul sur une ligne, sur l'entrée du programme.";
FioiBlockly.Msg.fr.INPUT_NUM_LIST = "lire une liste de nombres sur une ligne";
FioiBlockly.Msg.fr.INPUT_NUM_LIST_TOOLTIP = "Lit une liste de nombres sur une ligne, sur l'entrée du programme.";
FioiBlockly.Msg.fr.INPUT_NUM_NEXT = "lire un nombre";
FioiBlockly.Msg.fr.INPUT_NUM_NEXT_TOOLTIP = "Lit le prochain nombre sur l'entrée du programme.";
FioiBlockly.Msg.fr.INPUT_CHAR = "lire un caractère";
FioiBlockly.Msg.fr.INPUT_CHAR_TOOLTIP = "Lit un caractère sur l'entrée du programme.";
FioiBlockly.Msg.fr.INPUT_WORD = "lire un mot";
FioiBlockly.Msg.fr.INPUT_WORD_TOOLTIP = "Lit un mot sur l'entrée du programme.";
FioiBlockly.Msg.fr.INPUT_LINE = "lire une ligne";
FioiBlockly.Msg.fr.INPUT_LINE_TOOLTIP = "Lit une ligne sur l'entrée du programme.";

FioiBlockly.Msg.fr.CANNOT_DELETE_VARIABLE_PROCEDURE = "Impossible de supprimer la variable '%1', utilisée par la procédure '%2'.";

FioiBlockly.Msg.fr.DATA_REPLACEITEMOFLIST_TITLE = "remplacer l'élément %1 de la liste %2 par %3";
FioiBlockly.Msg.fr.DATA_ITEMOFLIST_TITLE = "élément %1 dans %2";
FioiBlockly.Msg.fr.DATA_LISTREPEAT_TITLE = "initialiser la liste %1 avec %2 répété %3 fois";

FioiBlockly.Msg.fr.INVALID_NAME = "Nom invalide, veuillez n'utiliser que des lettres, lettres accentuées françaises, chiffres (sauf comme premier caractère) et tiret bas '_'.";

FioiBlockly.Msg.fr.TABLES_2D_INIT = "initialiser le tableau 2D %1 avec %2 lignes et %3 colonnes contenant %4";
FioiBlockly.Msg.fr.TABLES_2D_INIT_TOOLTIP = "Crée un tableau avec le nombre spécifié de lignes et de colonnes, et initialise chaque case à la valeur donnée.";
FioiBlockly.Msg.fr.TABLES_2D_SET = "dans %1[%2] [%3] mettre %4";
FioiBlockly.Msg.fr.TABLES_3D_SET_TOOLTIP = "Met la valeur dans la case [ligne] [colonne] du tableau %1.";
FioiBlockly.Msg.fr.TABLES_2D_GET = "%1[%2] [%3]";
FioiBlockly.Msg.fr.TABLES_2D_GET_TOOLTIP = "Récupère la valeur dans la case [ligne] [colonne] du tableau %1.";

FioiBlockly.Msg.fr.TABLES_3D_INIT = "initialiser le tableau 3D %1 avec %2 couches, %3 lignes, %4 colonnes contenant %5";
FioiBlockly.Msg.fr.TABLES_3D_INIT_TOOLTIP = "Crée un tableau avec le nombre spécifié de lignes, de colonnes et de niveaux, et initialise chaque case à la valeur donnée.";
FioiBlockly.Msg.fr.TABLES_3D_SET = "dans %1[%2] [%3] [%4] mettre %5";
FioiBlockly.Msg.fr.TABLES_3D_SET_TOOLTIP = "Met la valeur dans la case [couche] [ligne] [colonne] du tableau %1.";
FioiBlockly.Msg.fr.TABLES_3D_GET = "%1[%2] [%3] [%4]";
FioiBlockly.Msg.fr.TABLES_3D_GET_TOOLTIP = "Récupère la valeur dans la case [couche] [ligne] [colonne] du tableau %1.";

FioiBlockly.Msg.fr.TABLES_VAR_NAME = "tableau";
FioiBlockly.Msg.fr.TABLES_TOO_BIG = "Dimensions du tableau trop grandes !";
FioiBlockly.Msg.fr.TABLES_OUT_OF_BOUNDS = "Tentative d'accès à une case hors du tableau !";

FioiBlockly.Msg.fr.MATH_DIVISIONFLOOR_SYMBOL = ' // ';
FioiBlockly.Msg.fr.MATH_ARITHMETIC_TOOLTIP_DIVIDEFLOOR = "Renvoie la partie entière de la division des deux nombres.";

FioiBlockly.Msg.it = {};

FioiBlockly.Msg.it.VARIABLES_DEFAULT_NAME = "element";
FioiBlockly.Msg.it.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.it.DICTS_CREATE_EMPTY_TITLE = "dictionnaire vide";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Crea un dizionario";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_INPUT_WITH = "crea un dizionario :";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_ITEM_KEY = "chiave";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_ITEM_TITLE = "chiave/valore";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.it.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.it.DICT_GET = "recupera la chiave";
FioiBlockly.Msg.it.DICT_GET_TO = "di";
FioiBlockly.Msg.it.DICT_KEYS = "elenco delle chiavi di";
FioiBlockly.Msg.it.DICT_SET_TITLE = "assegna la chiave";
FioiBlockly.Msg.it.DICT_SET_OF = "del dizionario";
FioiBlockly.Msg.it.DICT_SET_TO = "a";

FioiBlockly.Msg.it.TEXT_PRINT_TITLE = "mostra la riga %1";
FioiBlockly.Msg.it.TEXT_PRINT_TOOLTIP = "Mostra il testo, numero o altro valore specificato, con interruzione di riga dopo.";
FioiBlockly.Msg.it.TEXT_PRINT_NOEND_TITLE = "mostra %1";
FioiBlockly.Msg.it.TEXT_PRINT_NOEND_TOOLTIP = "Mostra il testo, il numero o altro valore specificato, senza interruzioni di riga.";

FioiBlockly.Msg.it.TEXT_EVAL_TITLE = "valuta";
FioiBlockly.Msg.it.TEXT_EVAL_TOOLTIP = "Valuta l'espressione aritmetica specificata.";
FioiBlockly.Msg.it.TEXT_EVAL_INVALID = "Attenzione : %1 ; questo blocco sarà \"falso\" !";

FioiBlockly.Msg.it.EVAL_ERROR_SEMICOLON = "il punto e virgola ';' non è autorizzato";
FioiBlockly.Msg.it.EVAL_ERROR_SYNTAX = "l'espressione non è sintatticamente valida";
FioiBlockly.Msg.it.EVAL_ERROR_TYPE = "questo tipo di espressione (%1) non è autorizzato";
FioiBlockly.Msg.it.EVAL_ERROR_VAR = "questa espressione utilizza una variabile '%1' non definita";

FioiBlockly.Msg.it.LISTS_APPEND_MSG = "all'elenco %1 aggiungi l'elemento %2";
FioiBlockly.Msg.it.LISTS_APPEND_TOOLTIP = "Aggiungi un elemento all'elenco '%1'";
FioiBlockly.Msg.it.LISTS_CREATE_WITH_TOO_LARGE = "Dimensione della lista troppo grande: %1 > dimensione massima consentita %2"
FioiBlockly.Msg.it.LISTS_GET_INDEX_FIRST = "all'inizio";
FioiBlockly.Msg.it.LISTS_GET_INDEX_FROM_END = "sull'indice dalla fine";
FioiBlockly.Msg.it.LISTS_GET_INDEX_FROM_START = "all'indice";
FioiBlockly.Msg.it.LISTS_GET_INDEX_GET = "ottieni il valore";
FioiBlockly.Msg.it.LISTS_GET_INDEX_GET_REMOVE = "ottieni e rimuovi il valore";
FioiBlockly.Msg.it.LISTS_GET_INDEX_LAST = "alla fine";
FioiBlockly.Msg.it.LISTS_GET_INDEX_RANDOM = "su un indice aleatorio";
FioiBlockly.Msg.it.LISTS_GET_INDEX_REMOVE = "rimuovi il valore";
FioiBlockly.Msg.it.LISTS_SET_INDEX_INSERT = "inserisci";
FioiBlockly.Msg.it.LISTS_SORT_TITLE = "sposta la selezione %1 %2 dell'elenco %3"
FioiBlockly.Msg.it.LISTS_SORT_PLACE_MSG = "seleziona l'elenco %1 sul posto";
FioiBlockly.Msg.it.LISTS_SORT_PLACE_TOOLTIP = "Seleziona la lista '%1' e modificala istantaneamentela.";

FioiBlockly.Msg.it.INPUT_NUM = "leggi un nome solo su una riga";
FioiBlockly.Msg.it.INPUT_NUM_TOOLTIP = "Leggi un numero solo su una riga, sull'input del programma.";
FioiBlockly.Msg.it.INPUT_NUM_LIST = "leggi un elenco di numeri su una riga";
FioiBlockly.Msg.it.INPUT_NUM_LIST_TOOLTIP = "Leggi un elenco di numeri sull'elenco, sull'input del programma.";
FioiBlockly.Msg.it.INPUT_NUM_NEXT = "leggi un numero";
FioiBlockly.Msg.it.INPUT_NUM_NEXT_TOOLTIP = "Leggi il prossimo numero sull'input del programma.";
FioiBlockly.Msg.it.INPUT_CHAR = "leggi un carattere";
FioiBlockly.Msg.it.INPUT_CHAR_TOOLTIP = "Leggi un carattere sull'input del programma.";
FioiBlockly.Msg.it.INPUT_WORD = "leggi una parola";
FioiBlockly.Msg.it.INPUT_WORD_TOOLTIP = "Leggi una parola sull'input del programma.";
FioiBlockly.Msg.it.INPUT_LINE = "leggi una riga";
FioiBlockly.Msg.it.INPUT_LINE_TOOLTIP = "Leggi una riga sull'input del programma.";

FioiBlockly.Msg.it.CANNOT_DELETE_VARIABLE_PROCEDURE = "Impossibile rimuovere la variabile '%1', utilizzata dalla procedura '%2'.";

FioiBlockly.Msg.it.DATA_REPLACEITEMOFLIST_TITLE = "rimpiazza l'elemento %1 dell'elenco %2 con %3";
FioiBlockly.Msg.it.DATA_ITEMOFLIST_TITLE = "elemento %1 in %2";
FioiBlockly.Msg.it.DATA_LISTREPEAT_TITLE = "inizializza l'elenco %1 con %2 ripetuto %3 volte";

FioiBlockly.Msg.it.INVALID_NAME = "Nome non valido, si prega di utilizzare solo lettere, lettere accentate in francese, numeri (eccetto come primo carattere) e trattini bassi '_'.";

FioiBlockly.Msg.it.TABLES_2D_INIT = "inizializza la tabella 2D %1 con %2 linee e %3 colonne contenenti %4";
FioiBlockly.Msg.it.TABLES_2D_INIT_TOOLTIP = "Crea una tabella con il numero di righe e colonne specificato e inizializza ogni cella al valore dato.";
FioiBlockly.Msg.it.TABLES_2D_SET = "in %1[%2] [%3] inserisci %4";
FioiBlockly.Msg.it.TABLES_3D_SET_TOOLTIP = "Inserisci il valore nella casella [riga] [colonna] della tabella %1.";
FioiBlockly.Msg.it.TABLES_2D_GET = "%1[%2] [%3]";
FioiBlockly.Msg.it.TABLES_2D_GET_TOOLTIP = "Recupera il valore dalla casella [riga] [colonna] della tabella %1.";

FioiBlockly.Msg.it.TABLES_3D_INIT = "inizializza la tabella 3D %1 con %2 livelli, %3 linee, %4 colonne contenenti %5";
FioiBlockly.Msg.it.TABLES_3D_INIT_TOOLTIP = "Crea una tabella con il numero specificato di righe, colonne e livelli, e inizializza ogni cella al valore dato.";
FioiBlockly.Msg.it.TABLES_3D_SET = "in %1[%2] [%3] [%4] inserisci %5";
FioiBlockly.Msg.it.TABLES_3D_SET_TOOLTIP = "Inserisci il valore nella casella [livello] [riga] [colonna] della tabella %1.";
FioiBlockly.Msg.it.TABLES_3D_GET = "%1[%2] [%3] [%4]";
FioiBlockly.Msg.it.TABLES_3D_GET_TOOLTIP = "Recupera il valore nella casella [livello] [riga] [colonna] della tabella %1.";

FioiBlockly.Msg.it.TABLES_VAR_NAME = "tabella";
FioiBlockly.Msg.it.TABLES_TOO_BIG = "Dimensioni della tabella troppo grandi !";
FioiBlockly.Msg.it.TABLES_OUT_OF_BOUNDS = "Tentativo d'accesso a una casella fuori da una tabella !";

FioiBlockly.Msg.it.MATH_DIVISIONFLOOR_SYMBOL = ' // ';
FioiBlockly.Msg.it.MATH_ARITHMETIC_TOOLTIP_DIVIDEFLOOR = "Riporta la parte intera della divisione dei due numeri.";

FioiBlockly.Msg.nl = {};
FioiBlockly.Msg.nl.VARIABLES_DEFAULT_NAME = 'element';
FioiBlockly.Msg.nl.DICTS_CREATE_EMPTY_TITLE = 'leeg woordenboek';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = 'Een woordenboek maken';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = '';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_INPUT_WITH = 'Een woordenboek maken';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_ITEM_KEY = 'sleutel';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_ITEM_MAPPING = '';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_ITEM_TITLE = 'sleutel/waarde';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_ITEM_TOOLTIP = '';
FioiBlockly.Msg.nl.DICTS_CREATE_WITH_TOOLTIP = '';
FioiBlockly.Msg.nl.DICT_GET = 'de sleutel ophalen';
FioiBlockly.Msg.nl.DICT_GET_TO = 'van';
FioiBlockly.Msg.nl.DICT_KEYS = 'lijst van de sleutels van';
FioiBlockly.Msg.nl.DICT_SET_TITLE = 'de sleutel toewijzen';
FioiBlockly.Msg.nl.DICT_SET_OF = 'van het woordenboek';
FioiBlockly.Msg.nl.DICT_SET_TO = 'aan';
FioiBlockly.Msg.nl.TEXT_PRINT_TITLE = 'de regel weergeven %1';
FioiBlockly.Msg.nl.TEXT_PRINT_TOOLTIP = 'De tekst, het getal of een andere opgegeven waarde weergeven, gevolgd door een regeleinde.';
FioiBlockly.Msg.nl.TEXT_PRINT_NOEND_TITLE = 'weergeven %1';
FioiBlockly.Msg.nl.TEXT_PRINT_NOEND_TOOLTIP = 'De tekst, het getal of een andere opgegeven waarde weergeven, zonder regeleinde.';
FioiBlockly.Msg.nl.TEXT_EVAL_TITLE = 'evalueren';
FioiBlockly.Msg.nl.TEXT_EVAL_TOOLTIP = 'Evalueert de opgegeven rekenkundige bewerking.';
FioiBlockly.Msg.nl.TEXT_EVAL_INVALID = "Opgelet : %1 ; dit blok zal terugkeren 'fout' !";
FioiBlockly.Msg.nl.EVAL_ERROR_SEMICOLON = "de puntkomma ';' is niet toegestaan";
FioiBlockly.Msg.nl.EVAL_ERROR_SYNTAX = 'de uitdrukking is syntactisch niet geldig';
FioiBlockly.Msg.nl.EVAL_ERROR_TYPE = 'dit type uitdrukking (%1) is niet toegestaan';
FioiBlockly.Msg.nl.EVAL_ERROR_VAR = "deze uitdrukking gebruikt een ongedefinieerde '%1' variabele";
FioiBlockly.Msg.nl.LISTS_APPEND_MSG = 'voeg element %2 toe aan lijst %1';
FioiBlockly.Msg.nl.LISTS_APPEND_TOOLTIP = "Voeg een element toe aan de lijst '%1'";
FioiBlockly.Msg.nl.LISTS_CREATE_WITH_TOO_LARGE = 'Lijstgrootte te groot: %1 > maximaal toegestane grootte %2';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_FIRST = 'in het begin';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_FROM_END = 'aan de index vanaf het einde ';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_FROM_START = 'aan de index  ';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_GET = 'de waarde bekomen';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_GET_REMOVE = 'de waarde bekomen en wissen';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_LAST = 'op het einde';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_RANDOM = 'naar een willekeurige hint';
FioiBlockly.Msg.nl.LISTS_GET_INDEX_REMOVE = 'de waarde wissen';
FioiBlockly.Msg.nl.LISTS_SET_INDEX_INSERT = 'invoegen';
FioiBlockly.Msg.nl.LISTS_SORT_TITLE = 'stuur het gesorteerde terug %1 %2 van de lijst %3';
FioiBlockly.Msg.nl.LISTS_SORT_PLACE_MSG = 'de lijst sorteren %1 ter plaatse';
FioiBlockly.Msg.nl.LISTS_SORT_PLACE_TOOLTIP = "Sorteer de lijst ' %1' en wijzig ze onmiddellijk.";
FioiBlockly.Msg.nl.INPUT_NUM = 'één enkel getal op één regel lezen';
FioiBlockly.Msg.nl.INPUT_NUM_TOOLTIP = 'Leest één enkel getal op één regel, op de programma-invoer.';
FioiBlockly.Msg.nl.INPUT_NUM_LIST = 'een lijst met getallen op één regel lezen';
FioiBlockly.Msg.nl.INPUT_NUM_LIST_TOOLTIP = 'Leest een lijst getallen op één regel, uit de programma-invoer.';
FioiBlockly.Msg.nl.INPUT_NUM_NEXT = 'een getal lezen';
FioiBlockly.Msg.nl.INPUT_NUM_NEXT_TOOLTIP = 'Leest het volgende getal op de programma-invoer.';
FioiBlockly.Msg.nl.INPUT_CHAR = 'Een karakter lezen';
FioiBlockly.Msg.nl.INPUT_CHAR_TOOLTIP = 'Leest een karakter op de programma-invoer.';
FioiBlockly.Msg.nl.INPUT_WORD = 'een woord lezen';
FioiBlockly.Msg.nl.INPUT_WORD_TOOLTIP = 'Leest een woord op de programma-invoer.';
FioiBlockly.Msg.nl.INPUT_LINE = 'een regel lezen';
FioiBlockly.Msg.nl.INPUT_LINE_TOOLTIP = 'Leest een regel op de programma-invoer.';
FioiBlockly.Msg.nl.CANNOT_DELETE_VARIABLE_PROCEDURE = "Variabele '%1', gebruikt door procedure '%2', kan niet worden verwijderd.";
FioiBlockly.Msg.nl.DATA_REPLACEITEMOFLIST_TITLE = 'vervang het element %1 in lijst %2 door %3';
FioiBlockly.Msg.nl.DATA_ITEMOFLIST_TITLE = 'element %1 in %2';
FioiBlockly.Msg.nl.DATA_LISTREPEAT_TITLE = 'initialiseer lijst %1 met %2 herhaald %3 keer';
FioiBlockly.Msg.nl.INVALID_NAME = "Ongeldige naam, gebruik alleen letters, letters met Franse accenten, cijfers (behalve als eerste teken) en underscore '_'.";
FioiBlockly.Msg.nl.TABLES_2D_INIT = 'initialiseer de 2D-tabel %1 met %2 rijen en %3 kolommen die %4 bevatten';
FioiBlockly.Msg.nl.TABLES_2D_INIT_TOOLTIP = 'Creëer een tabel met het opgegeven aantal rijen en kolommen en initialiseer elk veld met de opgegeven waarde.';
FioiBlockly.Msg.nl.TABLES_2D_SET = 'in %1[%2] [%3] zet %4';
FioiBlockly.Msg.nl.TABLES_3D_SET_TOOLTIP = 'Zet de waarde in het veld [laag] [rij] [kolom] in de tabel %1.';
FioiBlockly.Msg.nl.TABLES_2D_GET = '%1[%2] [%3]';
FioiBlockly.Msg.nl.TABLES_2D_GET_TOOLTIP = 'Haal de waarde op uit het veld [rij] [kolom] in de tabel %1.';
FioiBlockly.Msg.nl.TABLES_3D_INIT = 'initialiseer de 3D-tabel %1 met %2 lagen, %3 rijen, %4 kolommen met %5';
FioiBlockly.Msg.nl.TABLES_3D_INIT_TOOLTIP = 'Creëer een tabel met het opgegeven aantal rijen, kolommen en niveaus en initialiseer elk veld met de opgegeven waarde.';
FioiBlockly.Msg.nl.TABLES_3D_SET = 'in %1[%2] [%3] [%4] zet %5';
FioiBlockly.Msg.nl.TABLES_3D_GET = '%1[%2] [%3] [%4]';
FioiBlockly.Msg.nl.TABLES_3D_GET_TOOLTIP = 'Haal de waarde op uit het vak [laag] [rij] [kolom] in de tabel %1.';
FioiBlockly.Msg.nl.TABLES_VAR_NAME = 'tabel';
FioiBlockly.Msg.nl.TABLES_TOO_BIG = 'Afmetingen van de tabel te groot!';
FioiBlockly.Msg.nl.TABLES_OUT_OF_BOUNDS = 'Poging tot toegang tot een veld buiten de tabel!';
FioiBlockly.Msg.nl.MATH_DIVISIONFLOOR_SYMBOL = '//';
FioiBlockly.Msg.nl.MATH_ARITHMETIC_TOOLTIP_DIVIDEFLOOR = 'Geeft het gehele getal van de deling van de twee getallen.';
FioiBlockly.Msg.sl = {};

FioiBlockly.Msg.sl.VARIABLES_DEFAULT_NAME = "element";
FioiBlockly.Msg.sl.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;

FioiBlockly.Msg.sl.DICTS_CREATE_EMPTY_TITLE = "prazen slovar";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Ustvari slovar";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_INPUT_WITH = "ustvari slovar :";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_ITEM_KEY = "ključ";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_ITEM_MAPPING = ":";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_ITEM_TITLE = "ključ/vrednost";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_ITEM_TOOLTIP = "";
FioiBlockly.Msg.sl.DICTS_CREATE_WITH_TOOLTIP = "";
FioiBlockly.Msg.sl.DICT_GET = "get the key";
FioiBlockly.Msg.sl.DICT_GET_TO = "iz";
FioiBlockly.Msg.sl.DICT_KEYS = "tabela ključev iz";
FioiBlockly.Msg.sl.DICT_SET_TITLE = "nastavi vrednost ključa";
FioiBlockly.Msg.sl.DICT_SET_OF = "iz slovarja";
FioiBlockly.Msg.sl.DICT_SET_TO = "na";

FioiBlockly.Msg.sl.TEXT_PRINT_TITLE = "izpiši vrstico %1";
FioiBlockly.Msg.sl.TEXT_PRINT_TOOLTIP = "Izpiši tekst, številko ali drugo vrednost in se premakni v novo vrsto.";
FioiBlockly.Msg.sl.TEXT_PRINT_NOEND_TITLE = "izpiši %1";
FioiBlockly.Msg.sl.TEXT_PRINT_NOEND_TOOLTIP = "Izpiši tekst, številko ali drugo vrednost brez premika v novo vrsto.";

FioiBlockly.Msg.sl.LISTS_APPEND_MSG = "v seznam %1 dodaj element %2";
FioiBlockly.Msg.sl.LISTS_APPEND_TOOLTIP = "Dodaj element v seznam '%1'";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_FIRST = "na začetku";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_FROM_END = "na mestu št. od konca";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_FROM_START = "na mestu št.";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_GET = "vrni vrednost";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_GET_REMOVE = "vrni in odstrani vrednost";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_LAST = "na koncu";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_RANDOM = "na naključnem mestu";
FioiBlockly.Msg.sl.LISTS_GET_INDEX_REMOVE = "odstrani vrednost";
FioiBlockly.Msg.sl.LISTS_SET_INDEX_INSERT = "vstavi";
FioiBlockly.Msg.sl.LISTS_SORT_TITLE = "uredi %1 %2 tabelo %3";
FioiBlockly.Msg.sl.LISTS_SORT_TYPE_NUMERIC = "številčno";
FioiBlockly.Msg.sl.LISTS_SORT_TYPE_TEXT = "abecedno";
FioiBlockly.Msg.sl.LISTS_SORT_TYPE_IGNORECASE = "abecedno, brez velikosti črk";
FioiBlockly.Msg.sl.LISTS_SORT_PLACE_MSG = "uredi tabelo %1 na mestu";
FioiBlockly.Msg.sl.LISTS_SORT_PLACE_TOOLTIP = "Sorts list '%1' and modifies it directly.";
FioiBlockly.Msg.sl.LISTS_APPEND_MSG = "tabeli %1 dodaj element %2";

FioiBlockly.Msg.sl.INPUT_NUM = "read a single number on the whole line";
FioiBlockly.Msg.sl.INPUT_NUM_TOOLTIP = "Reads a single number on a line, on the program input.";
FioiBlockly.Msg.sl.INPUT_NUM_LIST = "read a list of numbers on a line";
FioiBlockly.Msg.sl.INPUT_NUM_LIST_TOOLTIP = "Reads a list of numbers on a line, on the program input.";
FioiBlockly.Msg.sl.INPUT_NUM_NEXT = "read a number";
FioiBlockly.Msg.sl.INPUT_NUM_NEXT_TOOLTIP = "Reads the next number on the program input.";
FioiBlockly.Msg.sl.INPUT_CHAR = "read a character";
FioiBlockly.Msg.sl.INPUT_CHAR_TOOLTIP = "Reads a character on the program input.";
FioiBlockly.Msg.sl.INPUT_WORD = "read a word";
FioiBlockly.Msg.sl.INPUT_WORD_TOOLTIP = "Reads a word on the program input.";
FioiBlockly.Msg.sl.INPUT_LINE = "read a line";
FioiBlockly.Msg.sl.INPUT_LINE_TOOLTIP = "Reads a line on the program input.";

FioiBlockly.Msg.sl.CANNOT_DELETE_VARIABLE_PROCEDURE = "Cannot delete variable '%1', used by procedure '%2'.";

FioiBlockly.Msg.sl.DATA_REPLACEITEMOFLIST_TITLE = "replace element %1 of list %2 with %3";
FioiBlockly.Msg.sl.DATA_ITEMOFLIST_TITLE = "element %1 in %2";
FioiBlockly.Msg.sl.DATA_LISTREPEAT_TITLE = "initialize list %1 with %2 repeated %3 times";

FioiBlockly.Msg.sl.INVALID_NAME = "Neveljavno ime. Uporabite lahko črke angleške abecede, števke (razen za prvi znak) in podrčrtaj '_'.";

// Fill undefined Blockly.Msg messages with messages from the default language
FioiBlockly.fillLanguage = function() {
  for(var msgName in FioiBlockly.Msg[FioiBlockly.defaultLang]) {
    if(typeof Blockly.Msg[msgName] == 'undefined') {
      Blockly.Msg[msgName] = FioiBlockly.Msg[FioiBlockly.defaultLang][msgName];
    }
  }
}
FioiBlockly.fillLanguage();

Blockly.Blocks.dicts = {};

Blockly.Blocks.dicts.HUE = 0;


Blockly.Blocks['dict_get'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('ITEM');
    this.appendValueInput('DICT')
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_GET_TO);
    this.setInputsInline(false);
    this.setOutput(true);
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  }
};

Blockly.Blocks['dict_get_literal'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);   
    this.appendValueInput('DICT')
        //.appendField('get') // TODO: fix this to be outside
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput(
                     Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY),
                     'ITEM')
        .appendField(this.newQuote_(false))
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_GET_TO);
    this.setInputsInline(false);
    this.setOutput(true);
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAA0UlEQVQY023QP0oDURSF8e8MImhlUIiCjWKhrUUK3YCIVkq6bMAF2LkCa8ENWLoNS1sLEQKprMQ/GBDks3kDM+Oc8nfPfTxuANQTYBeYAvdJLL4FnAFfwF2ST9Rz27kp5YH/kwrYp50LdaXHAU4rYNYzWAdeenx7AbgF5sAhcARsAkkyVQ+ACbAKjIGqta4+l78udXxc/LiJG+qvet0pV+q7+tHE+iJzdbGz8FhmOzVcqj/qq7rcKI7Ut1Leq70C1oCrJMMk343HB8ADMEzyVOMff72l48gwfqkAAAAASUVORK5CYII=';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAvklEQVQY022PoapCQRRF97lBVDRYhBcEQcP1BwS/QLAqr7xitZn0HzRr8Rts+htmQdCqSbQIwmMZPMIw3lVmZu0zG44UAFSBLdBVBDAFZqFo8eYKtANfBC7AE5h8ZNOHd1FrDnh4VgmDO3ADkujDHPgHfkLZ84bfaLjg/hD6RFLq9z6wBDr+rvuZB1bAEDABY76pA2mGHyWSjvqmIemc4WsCLKOp4nssIj8wD8qS/iSVJK3N7OTeJPV9n72ZbV7iDuSc2BaQBQAAAABJRU5ErkJggg==';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};

Blockly.Blocks['dict_set_literal'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);   
    this.appendValueInput('DICT')
        .appendField(Blockly.Msg.DICT_SET_TITLE)
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput(
                     Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY),
                     'ITEM')
        .appendField(this.newQuote_(false))
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_SET_OF);
    this.appendValueInput('VAL')
        .appendField(Blockly.Msg.DICT_SET_TO);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};
Blockly.Blocks['dict_set_literal'].newQuote_ = Blockly.Blocks['dict_get_literal'].newQuote_;

Blockly.Blocks['dict_keys'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_KEYS);
    this.setInputsInline(false);
    this.setOutput(true, 'Array');
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  }
};

Blockly.Blocks['dicts_create_with_container'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with_item'] = {
  // Add items.
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};
Blockly.Blocks['dicts_create_with'] = {
    /**
     * Block for creating a dict with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function() {
        this.setInputsInline(false);
        this.setColour(Blockly.Blocks.dicts.HUE);
        this.itemCount_ = 1;
        this.updateShape_();
        this.setOutput(true, 'dict');
        this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent dict inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function(workspace) {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the dict inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        // Delete everything.
        if (this.getInput("EMPTY")) {
            this.removeInput('EMPTY');
        }
        for (var i = 0; this.getInput('VALUE' + i); i++) {
            //this.getInput('VALUE' + i).removeField("KEY"+i);
            this.removeInput('VALUE' + i);
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
        } else {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
            for (var i = 0; i < this.itemCount_; i++) {
                this.appendValueInput('VALUE' + i)
                    .setCheck(null)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(
                          new Blockly.FieldTextInput(
                              Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY),
                         'KEY'+i)
                   .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_MAPPING);
            }
        }
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock =
            Blockly.Block.obtain(workspace, 'dicts_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
          var itemBlock = Blockly.Block.obtain(workspace, 'dicts_create_with_item');
          itemBlock.initSvg();
          connection.connect(itemBlock.previousConnection);
          connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('VALUE' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        // Store a pointer to any connected child blocks.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 0;
        while (itemBlock) {
            var value_input = this.getInput('VALUE' + x);
            itemBlock.valueConnection_ = value_input && value_input.connection.targetConnection;
            x++;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
        }
    }
};

Blockly.Blocks.inputs = {};

Blockly.Blocks.inputs.HUE = 345;


Blockly.Blocks['input_num'] = {
  // Read a number.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_NUM);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.INPUT_NUM_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};

Blockly.Blocks['input_num_next'] = {
  // Read a number.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_NUM_NEXT);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.INPUT_NUM_NEXT_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};

Blockly.Blocks['input_char'] = {
  // Read a character.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_CHAR);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_CHAR_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};

Blockly.Blocks['input_word'] = {
  // Read a word.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_WORD);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_WORD_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};

Blockly.Blocks['input_line'] = {
  // Read a line.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_LINE);
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.INPUT_LINE_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};

Blockly.Blocks['input_num_list'] = {
  // Read a number.
  init: function() {
    this.setColour(Blockly.Blocks.inputs.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.INPUT_NUM_LIST);
    this.setOutput(true, 'Array');
    this.setTooltip(Blockly.Msg.INPUT_NUM_LIST_TOOLTIP);
    if(this.setOutputShape) {
      this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL);
    }
  }
};


if(typeof Blockly.Blocks.lists === 'undefined') {
  Blockly.Blocks.lists = {};
}

Blockly.Blocks.lists.HUE = 100;

Blockly.Blocks['lists_append'] = {
  /**
   * Block for appending to a list in place.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.LISTS_APPEND_MSG,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "liste"
        },
        {
          "type": "input_value",
          "name": "ITEM",
          "check": "Number"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.lists.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.LISTS_APPEND_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

// Modify order of fields
FioiBlockly.OriginalBlocks['lists_setIndex'] = Blockly.Blocks['lists_setIndex'];
Blockly.Blocks['lists_setIndex'] = {
  /**
   * Block for setting the element at index.
   * @this Blockly.Block
   */
  init: function() {
    var MODE =
        [[Blockly.Msg.LISTS_SET_INDEX_SET, 'SET'],
         [Blockly.Msg.LISTS_SET_INDEX_INSERT, 'INSERT']];
    this.WHERE_OPTIONS =
        [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_INDEX_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_INDEX_FIRST, 'FIRST'],
         [Blockly.Msg.LISTS_GET_INDEX_LAST, 'LAST'],
         [Blockly.Msg.LISTS_GET_INDEX_RANDOM, 'RANDOM']];
    this.setHelpUrl(Blockly.Msg.LISTS_SET_INDEX_HELPURL);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput('AT');
    this.appendDummyInput('MODEDUMMY')
        .appendField(new Blockly.FieldDropdown(MODE), 'MODE');
    this.appendValueInput('TO');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_SET_INDEX_TOOLTIP);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('MODE');
      var where = thisBlock.getFieldValue('WHERE');
      var tooltip = '';
      switch (mode + ' ' + where) {
        case 'SET FROM_START':
        case 'SET FROM_END':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM;
          break;
        case 'SET FIRST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST;
          break;
        case 'SET LAST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST;
          break;
        case 'SET RANDOM':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM;
          break;
        case 'INSERT FROM_START':
        case 'INSERT FROM_END':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM;
          break;
        case 'INSERT FIRST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST;
          break;
        case 'INSERT LAST':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST;
          break;
        case 'INSERT RANDOM':
          tooltip = Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM;
          break;
      }
      if (where == 'FROM_START' || where == 'FROM_END') {
        tooltip += '  ' + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP
            .replace('%1',
                thisBlock.workspace.options.oneBasedIndex ? '#1' : '#0');
      }
      return tooltip;
    });
  },
  /**
   * Create XML to represent whether there is an 'AT' input.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = (xmlElement.getAttribute('at') != 'false');
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(isAt) {
    // Destroy old 'AT' and 'ORDINAL' input.
    this.removeInput('AT');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL')
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT');
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt_(newAt); 
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.moveInputBefore('AT', 'MODEDUMMY');
    if (this.getInput('ORDINAL')) {
      this.moveInputBefore('ORDINAL', 'TO');
    }
    
    this.getInput('AT').appendField(menu, 'WHERE'); 
  }
};

Blockly.Blocks['lists_sort_place'] = {
  /**
   * Block for appending to a list in place.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.LISTS_SORT_PLACE_MSG,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "liste"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.lists.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.LISTS_SORT_PLACE_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};


FioiBlockly.OriginalBlocks['logic_compare'] = Blockly.Blocks['logic_compare'];

// Use standard operator names (for instance '!=' instead of '≠')
Blockly.Blocks['logic_compare'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var rtlOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['>', 'LT'],
      ['>=', 'LTE'],
      ['<', 'GT'],
      ['<=', 'GTE']
    ];
    var ltrOperators = [
      ['==', 'EQ'],
      ['!=', 'NEQ'],
      ['<', 'LT'],
      ['<=', 'LTE'],
      ['>', 'GT'],
      ['>=', 'GTE']
    ];
    var OPERATORS = this.RTL ? rtlOperators : ltrOperators;
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  },
  /**
   * Called whenever anything on the workspace changes.
   * Prevent mismatched types from being compared.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(e) {
    var blockA = this.getInputTargetBlock('A');
    var blockB = this.getInputTargetBlock('B');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      // Ensure that any disconnections are grouped with the causing event.
      Blockly.Events.setGroup(e.group);
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.unplug();
          block.bumpNeighbours_();
        }
      }
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  }
};


Blockly.Blocks['math_arithmetic'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "A",
          "check": "Number"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options":
            [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
             [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
             [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
             [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE'],
             [Blockly.Msg.MATH_DIVISIONFLOOR_SYMBOL, 'DIVIDEFLOOR'],
             [Blockly.Msg.MATH_POWER_SYMBOL, 'POWER']]
        },
        {
          "type": "input_value",
          "name": "B",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "output": "Number",
      "colour": Blockly.Blocks.math.HUE,
      "helpUrl": Blockly.Msg.MATH_ARITHMETIC_HELPURL
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'DIVIDEFLOOR': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDEFLOOR,
        'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
      };
      return TOOLTIPS[mode];
    });
  }
};

if(Blockly.Blocks['procedures_defnoreturn']) {
  Blockly.Blocks['procedures_defnoreturn'].init = function() {
    var nameField = new Blockly.FieldTextInput('',
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    if(!Blockly.Procedures.flyoutOptions.disableArgs) {
      this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    }
    if ((this.workspace.options.comments ||
         (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
        Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT) {
      this.setCommentText(Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT);
    }
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
    this.arguments_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
  };
}

if(Blockly.Blocks['procedures_defreturn']) {
  Blockly.Blocks['procedures_defreturn'].init = function() {
    var nameField = new Blockly.FieldTextInput('',
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.appendValueInput('RETURN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    if(!Blockly.Procedures.flyoutOptions.disableArgs) {
      this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    }
    if ((this.workspace.options.comments ||
         (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
        Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT) {
      this.setCommentText(Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT);
    }
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
    this.arguments_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
  };
}

if(typeof Blockly.Blocks.tables === 'undefined') {
  Blockly.Blocks.tables = {};
}

Blockly.Blocks.tables.HUE = 100;

Blockly.Blocks['tables_2d_init'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_INIT,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINES"
        },
        {
          "type": "input_value",
          "name": "COLS"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_INIT_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_2d_set'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_SET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_2d_get'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_2D_GET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        }
      ],
      "inputsInline": true,
      "output": null,
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_2D_GET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_init'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_INIT,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYERS",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "LINES"
        },
        {
          "type": "input_value",
          "name": "COLS"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_INIT_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_set'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYER"
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        },
        {
          "type": "input_value",
          "name": "ITEM"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_SET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['tables_3d_get'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TABLES_3D_GET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.TABLES_VAR_NAME
        },
        {
          "type": "input_value",
          "name": "LAYER"
        },
        {
          "type": "input_value",
          "name": "LINE"
        },
        {
          "type": "input_value",
          "name": "COL"
        }
      ],
      "inputsInline": true,
      "output": null,
      "outputShape": Blockly.OUTPUT_SHAPE_ROUND,
      "colour": Blockly.Colours ? Blockly.Colours.data.primary : Blockly.Blocks.tables.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.data.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.data.tertiary : null
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.TABLES_3D_GET_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  }
};

Blockly.Blocks['text_print_noend'] = {
  /**
   * Block for print statement.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.TEXT_PRINT_NOEND_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Colours ? Blockly.Colours.texts.primary : Blockly.Blocks.texts.HUE,
      "colourSecondary": Blockly.Colours ? Blockly.Colours.texts.secondary : null,
      "colourTertiary": Blockly.Colours ? Blockly.Colours.texts.tertiary : null,
      "tooltip": Blockly.Msg.TEXT_PRINT_NOEND_TOOLTIP,
      "helpUrl": Blockly.Msg.TEXT_PRINT_HELPURL
    });
  }
};

Blockly.Blocks['text_eval'] = {
  // Block to evaluate an expression
  init: function() {
    if(Blockly.Colours) {
      this.setColour(Blockly.Colours.texts.primary, Blockly.Colours.texts.secondary, Blockly.Colours.texts.tertiary);
    } else {
      this.setColour(Blockly.Blocks.texts.HUE);
    }
    var textInput = new Blockly.FieldTextInput('');

    // Override validate_ behavior to highlight in red but not erase the field
    var thisBlock = this;
    var msgTimeout = null;
    textInput.validate_ = function(text) {
      var validationMsg = null;
      goog.asserts.assertObject(Blockly.FieldTextInput.htmlInput_);
      var htmlInput = Blockly.FieldTextInput.htmlInput_;
      if (this.sourceBlock_) {
        // Use the expression validator
        validationMsg = Blockly.validateExpression(htmlInput.value, this.sourceBlock_.workspace);
      }
      if(validationMsg !== null) {
        Blockly.addClass_(htmlInput, 'blocklyInvalidInput');
        if(msgTimeout) { clearTimeout(msgTimeout); }
        msgTimeout = setTimeout(function() {
          thisBlock.setWarningText(Blockly.Msg.TEXT_EVAL_INVALID.replace('%1', validationMsg));
          textInput.resizeEditor_();
          }, 2000);
      } else {
        Blockly.removeClass_(htmlInput, 'blocklyInvalidInput');
        thisBlock.setWarningText(null);
        if(msgTimeout) {
          clearTimeout(msgTimeout);
          msgTimeout = null;
        }
      }
    };

    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_EVAL_TITLE)
        .appendField(textInput, 'EXPR')
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.TEXT_EVAL_TOOLTIP);
  }
};

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.JavaScript.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.JavaScript.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.JavaScript.functionNames_ = Object.create(null);

  if (!Blockly.JavaScript.variableDB_) {
    Blockly.JavaScript.variableDB_ =
        new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_);
  } else {
    Blockly.JavaScript.variableDB_.reset();
  }

  // Create a dictionary of external functions to be registered by the
  // interpreter
  Blockly.JavaScript.externalFunctions = {};
};

/**
 * Encode a string as a properly escaped JavaScript string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} JavaScript string.
 * @private
 */
Blockly.JavaScript.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/"/g, '\\"');
  return '"' + string + '"';
};


Blockly.JavaScript['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.JavaScript.valueToCode(block, 'BY',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (var ' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'var ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'var ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.JavaScript.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += 'var ' + incVar + ' = ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ';\n';
    } else {
      code += 'Math.abs(' + increment + ');\n';
    }
    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.JavaScript.INDENT + incVar + ' = -' + incVar + ';\n';
    code += '}\n';
    code += 'for (' + variable0 + ' = ' + startVar + '; ' +
        incVar + ' >= 0 ? ' +
        variable0 + ' <= ' + endVar + ' : ' +
        variable0 + ' >= ' + endVar + '; ' +
        variable0 + ' += ' + incVar + ') {\n' +
        branch + '}\n';
  }
  return code;
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'var ' + varName + ' = ' + argument0 + ';\n';
};

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Python.init = function(workspace) {
  /**
   * Empty loops or conditionals are not allowed in Python.
   */
  Blockly.Python.PASS = this.INDENT + 'pass\n';
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Python.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Python.functionNames_ = Object.create(null);

  if (!Blockly.Python.variableDB_) {
    Blockly.Python.variableDB_ =
        new Blockly.Names(Blockly.Python.RESERVED_WORDS_);
  } else {
    Blockly.Python.variableDB_.reset();
  }
};

/**
 * Encode a string as a properly escaped Python string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly.Python.quote_ = function(string) {
  // Can't use goog.string.quote since % must also be escaped.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/"/g, '\\"');
  return '"' + string + '"';
};

/**
 * Altered version of the default blockToCode function. Store all blocks in a global variable.
**/
Blockly.Python.blockToCodeUnaltered = Blockly.Python.blockToCode;

Blockly.Python.blockToCode = function(block, opt_thisOnly) {
  if (block) {
    var func = this[block.type];
    // Define altered functions for each block
    if (typeof func === 'function' && func.pyfeAltered === undefined) {
      this[block.type] = function (block) {
        if (!block || window.sortedBlocksList === undefined) {
          return func.call(block, block);
        }
        sortedBlocksList.push([block.id, 1]);
        var code = func.call(block, block);

        if (typeof code == "string") {
          codeOfBlock[block.id] = String(code)
        } else if (code) {
          codeOfBlock[block.id] = String(code[0]);
        } else {
          codeOfBlock[block.id] = "";
        }
        sortedBlocksList.push([block.id, -1]);
        return code;
      }
      this[block.type].pyfeAltered = true;
    }
  }
  return Blockly.Python.blockToCodeUnaltered(block, opt_thisOnly);
}

/**
 * Add blocks ids in comments to a python code
 * @param {function} Function that takes no parameters and returns the generated python code.
 * @return {string} Python code.
 */
Blockly.Python.blocksToCommentedCode = function(codeGenerator) {
  window.sortedBlocksList = [];
  window.codeOfBlock = {};

  var code = String(codeGenerator());

  var codeLines = code.split('\n');
  var blocksAtLines = new Array(codeLines.length);
  for (var i = 0; i < blocksAtLines.length; i++) {
    blocksAtLines[i] = [];
  }

  // For each block, find where it can be in the code
  var firstLine = 0;
  var lastLineStack = [codeLines.length];
  for (var iEvent = 0; iEvent < sortedBlocksList.length; iEvent++) {
    var blockId = sortedBlocksList[iEvent][0];

    if (sortedBlocksList[iEvent][1] == -1) {
      firstLine = lastLineStack.pop()-1;
    } else {
      var blockCode = codeOfBlock[blockId].split("\n");
      // Remove indentation
      for (var iLine = 0; iLine < blockCode.length; iLine++) {
        blockCode[iLine] = blockCode[iLine].trim();
      }

      // Find matching lines
      var lastLine = lastLineStack[lastLineStack.length-1];
      var startAt = -1;
      for (var iCodeLine = firstLine; iCodeLine < lastLine-blockCode.length+1; iCodeLine++) {
        var blockIsHere = true;
        for (var iBlockLine = 0; iBlockLine < blockCode.length && blockIsHere; iBlockLine++) {
          if (codeLines[iCodeLine+iBlockLine].indexOf(blockCode[iBlockLine]) === -1) {
            blockIsHere = false;
          }
        }
        if (blockIsHere) {
          startAt = iCodeLine;
          break;
        }
      }
      // Push sub-interval
      if (startAt == -1) {
        lastLineStack.push(lastLineStack[lastLineStack.length-1]);
        // console.log("Can't match", blockId);
      } else {
        firstLine = startAt;
        lastLineStack.push(startAt+blockCode.length);

        // Mark the maching lines
        for (var iBlockLine = 0; iBlockLine < blockCode.length; iBlockLine++) {
          if (blockCode[iBlockLine]) {
            blocksAtLines[startAt+iBlockLine].push(blockId);
          }
        }
      }
    }
  }

  // Add comments to the code
  for (var i = 0; i < blocksAtLines.length; i++) {
    if (blocksAtLines[i].length) {
      codeLines[i] += "#BlockIds=" + blocksAtLines[i].join("'");
    }
  }

  window.sortedBlocksList = undefined;
  window.codeOfBlock = undefined;
  return codeLines.join("\n");
}
Blockly.JavaScript['dict_get'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dict_get_literal'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var value = block.getFieldValue('ITEM');
  var code = dict + '.' + value;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['dict_set_literal'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var key = block.getFieldValue('ITEM');
  var value = Blockly.JavaScript.valueToCode(block, 'VAL',
      Blockly.JavaScript.ORDER_NONE) || '___';
  var code = dict + '.' + key + ' = ' + value + ';\n';
  return code;
};


Blockly.JavaScript['dicts_create_with'] = function(block) {
    var value_keys = Blockly.JavaScript.valueToCode(block, 'keys', Blockly.   JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = block.getFieldValue('KEY' + n);
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE' + n,
                Blockly.JavaScript.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = 'Object({' + code.join(', ') + '})';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_keys'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT',
      Blockly.JavaScript.ORDER_MEMBER) || '___';
  var code = 'Object.keys(' + dict + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['input_num'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  var code = 'parseInt(readStdin())';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_num_next'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                + "    while (stdinBuffer.trim() == '')\n"
                                                + "        stdinBuffer = readline();\n"
                                                + "    if (typeof stdinBuffer === 'undefined')\n"
                                                + "        stdinBuffer = '';\n"
                                                + "    var re = /\\S+\\s*/;\n"
                                                + "    var w = re.exec(stdinBuffer);\n"
                                                + "    var stdinBuffer = stdinBuffer.substr(re.lastIndex);\n"
                                                + "    return w;\n"
                                                + "};";
  var code = 'parseInt(input_word())';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_char'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_char'] = "function input_char() {\n"
                                                + "    var buf = readStdin();\n";
                                                + "    stdinBuffer = stdinBuffer.substr(1);\n";
                                                + "    return buf.substr(0, 1);\n";
                                                + "};\n";
  var code = 'input_char()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_word'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_word'] = "function input_word() {\n"
                                                + "    while (stdinBuffer.trim() == '')\n"
                                                + "        stdinBuffer = readline();\n"
                                                + "    if (typeof stdinBuffer === 'undefined')\n"
                                                + "        stdinBuffer = '';\n"
                                                + "    var re = /\\S+\\s*/;\n"
                                                + "    var w = re.exec(stdinBuffer);\n"
                                                + "    var stdinBuffer = stdinBuffer.substr(re.lastIndex);\n"
                                                + "    return w;\n"
                                                + "};";
  var code = 'input_word()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_line'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  var code = 'readStdin()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_num_list'] = function(block) {
  Blockly.JavaScript.definitions_['input_funcs'] = "var stdinBuffer = '';\n"
                                                 + "function readStdin() {\n"
                                                 + "    if (stdinBuffer == '')\n"
                                                 + "        stdinBuffer = readline();\n"
                                                 + "    if (typeof stdinBuffer === 'undefined')\n"
                                                 + "        stdinBuffer = '';\n"
                                                 + "    return stdinBuffer;\n"
                                                 + "};";
  Blockly.JavaScript.definitions_['input_num_list'] = "function input_num_list() {\n"
                                                    + "    var parts = readStdin().split(/\\s+/);\n"
                                                    + "    for(var i=0; i<parts.length; i++) {\n"
                                                    + "        parts[i] = parseInt(parts[i]);\n"
                                                    + "    }\n"
                                                    + "    return parts;\n"
                                                    + "};";
  var code = 'input_num_list()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['lists_repeat'] = function(block) {
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
  var repeatCount = Blockly.JavaScript.valueToCode(block, 'NUM',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var code = 'listsRepeat(' + element + ', ' + repeatCount + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['lists_append'] = function(block) {
  // Append
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_NONE) || '___';
  return varName + '.push(' + value + ');\n';
};

Blockly.JavaScript['lists_sort_place'] = function(block) {
  // Javascript default sort is lexicographic, which doesn't work for numbers.
  // By using the normal compare operator, we circumvent this issue; moreover,
  // it returns false for uncomparable values, which will in this case not
  // modify the place of these values in the list.
  Blockly.JavaScript.definitions_['list_sort_auto'] = ""
    + "function list_sort_auto(a, b) {\n"
    + "    if(a === b) {\n"
    + "        return 0;\n"
    + "    } else if(a > b) {\n"
    + "        return 1;\n"
    + "    } else {\n"
    + "        return -1;\n"
    + "    }\n"
    + "};\n"
  var varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + '.sort(list_sort_auto);\n';
};

Blockly.JavaScript['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.JavaScript.valueToCode(block, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var value = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'tmpList', Blockly.Variables.NAME_TYPE);
    var code = 'var ' + listVar + ' = ' + list + ';\n';
    list = listVar;
    return code;
  }
  switch (where) {
    case ('FIRST'):
      if (mode == 'SET') {
        return list + '[0] = ' + value + ';\n';
      } else if (mode == 'INSERT') {
        return list + '.unshift(' + value + ');\n';
      }
      break;
    case ('LAST'):
      if (mode == 'SET') {
        var code = cacheList();
        code += list + '[' + list + '.length - 1] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        return list + '.push(' + value + ');\n';
      }
      break;
    case ('FROM_START'):
      var at = Blockly.JavaScript.getAdjusted(block, 'AT');
      if (mode == 'SET') {
        var code = 'if(' + at + ' > 1000000) { throw "List index > 1000000"; }\n';
        code += list + '[' + at + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        return list + '.splice(' + at + ', 0, ' + value + ');\n';
      }
      break;
    case ('FROM_END'):
      var at = Blockly.JavaScript.getAdjusted(block, 'AT', 1, false,
          Blockly.JavaScript.ORDER_SUBTRACTION);
      var code = cacheList();
      if (mode == 'SET') {
        code += 'if(' + list + '.length - ' + at + ' > 1000000) { throw "List index > 1000000"; }\n';
        code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
            ');\n';
        return code;
      }
      break;
    case ('RANDOM'):
      var code = cacheList();
      var xVar = Blockly.JavaScript.variableDB_.getDistinctName(
          'tmpX', Blockly.Variables.NAME_TYPE);
      code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
          '.length);\n';
      if (mode == 'SET') {
        code += list + '[' + xVar + '] = ' + value + ';\n';
        return code;
      } else if (mode == 'INSERT') {
        code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
        return code;
      }
      break;
  }
  throw 'Unhandled combination (lists_setIndex).';
};


Blockly.JavaScript['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'loop', Blockly.Variables.NAME_TYPE);
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

Blockly.JavaScript['controls_repeat'] =
    Blockly.JavaScript['controls_repeat_ext'];

Blockly.JavaScript['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
    // Handled separately :
    'DIVIDEFLOOR': [null, Blockly.JavaScript.ORDER_NONE],
    'POWER': [null, Blockly.JavaScript.ORDER_NONE]
  };

  var op = block.getFieldValue('OP');
  var tuple = OPERATORS[op];
  var operator = tuple[0];
  var order = tuple[1];

  var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  var code;
  if(op == 'DIVIDEFLOOR') {
    code = 'Math.floor((' + argument0 + ') / (' + argument1 + '))';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  // Power in JavaScript requires a special case since it has no operator.
  if(op == 'POWER') {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.JavaScript['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'DELTA',
      Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var incrCode = varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', "+varName+", '"+varName+"');\n";

  return incrCode + reportCode;
};

Blockly.JavaScript['tables_2d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.JavaScript.definitions_['tables_2d_init'] = '' +
    'function table2dInit(x, y, a) {\n' +
    '    if(x > 1000000 || y > 1000000) { throw "' + Blockly.Msg.TABLES_TOO_BIG +'"; }\n' +
    '    var table = [];\n' +
    '    var row = [];\n' +
    '    for(var i = 0; i < y; i++) {\n' +
    '        row[i] = a;\n' +
    '    }\n' +
    '    for(var i = 0; i < x; i++) {\n' +
    '        table[i] = row.slice(0);\n' +
    '    }\n' +
    '    return table;\n' +
    '}\n';

  var at1 = Blockly.JavaScript.valueToCode(block, 'LINES', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at2 = Blockly.JavaScript.valueToCode(block, 'COLS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  return 'var ' + varName + ' = table2dInit(' + at1 + ', ' + at2 + ', ' + value + ');\n';
}

Blockly.JavaScript['tables_2d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  var code = "if(typeof " + varName + "[" + at1 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "] == 'undefined') { throw \"" + Blockly.Msg.TABLES_OUT_OF_BOUNDS + "\"; }\n";
  code += varName + '[' + at1 + '][' + at2 + '] = ' + value + ";\n";
  return code;
}

Blockly.JavaScript['tables_2d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}

Blockly.JavaScript['tables_3d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.JavaScript.definitions_['tables_3d_init'] = '' +
    'function table3dInit(x, y, z, a) {\n' +
    '    if(x > 1000000 || y > 1000000 || z > 1000000) { throw "' + Blockly.Msg.TABLES_TOO_BIG +'"; }\n' +
    '    var table = [];\n' +
    '    var row = [];\n' +
    '    for(var i = 0; i < z; i++) {\n' +
    '        row[i] = a;\n' +
    '    }\n' +
    '    for(var i = 0; i < x; i++) {\n' +
    '        var layer = [];\n' +
    '        for(var j = 0; j < y; j++) {\n' +
    '            layer[j] = row.slice(0);\n' +
    '        }\n' +
    '        table[i] = layer;\n' +
    '    }\n' +
    '    return table;\n' +
    '}\n';

  var at1 = Blockly.JavaScript.valueToCode(block, 'LAYERS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at2 = Blockly.JavaScript.valueToCode(block, 'LINES', Blockly.JavaScript.ORDER_COMMA) || '0';
  var at3 = Blockly.JavaScript.valueToCode(block, 'COLS', Blockly.JavaScript.ORDER_COMMA) || '0';
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  return 'var ' + varName + ' = table3dInit(' + at1 + ', ' + at2 + ', ' + at3 + ', ' + value + ');\n';
}

Blockly.JavaScript['tables_3d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LAYER');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at3 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var value = Blockly.JavaScript.valueToCode(block, 'ITEM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';

  var code = "if(typeof " + varName + "[" + at1 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "] == 'undefined' || typeof " + varName + "[" + at1 + "][" + at2 + "][" + at3 + "] == 'undefined') { throw \"" + Blockly.Msg.TABLES_OUT_OF_BOUNDS + "\"; }\n";
  code += varName + '[' + at1 + '][' + at2 + '][' + at3 + '] = ' + value + ";\n";
  return code;
}

Blockly.JavaScript['tables_3d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.JavaScript.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.JavaScript.getAdjusted(block, 'LAYER');
  var at2 = Blockly.JavaScript.getAdjusted(block, 'LINE');
  var at3 = Blockly.JavaScript.getAdjusted(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + '][' + at3 + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
}


Blockly.JavaScript['text_print_noend'] = Blockly.JavaScript['text_print'];

Blockly.JavaScript['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  var reindexExpr = Blockly.reindexExpression(expr);
  if(reindexExpr === null) {
    return ['false', Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    return [reindexExpr, Blockly.JavaScript.ORDER_NONE];
  }
};

Blockly.JavaScript['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var assignCode = varName + ' = ' + argument0 + ';\n';

  // Report value if available
  var reportCode = "reportBlockValue('" + block.id + "', "+varName+", '"+varName+"');\n";

  return assignCode + reportCode;
};

Blockly.Python['dict_get'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dict_get_literal'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.quote_(block.getFieldValue('ITEM'));
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['dict_set_literal'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var key = Blockly.Python.quote_(block.getFieldValue('ITEM'));
  var value = Blockly.Python.valueToCode(block, 'VAL',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + key + '] = ' + value + '\n';
  return code;
};


Blockly.Python['dicts_create_with'] = function(block) {
    var value_keys = Blockly.Python.valueToCode(block, 'keys', Blockly.   Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = new Array(block.itemCount_);
  
    for (var n = 0; n < block.itemCount_; n++) {
        var key = Blockly.Python.quote_(block.getFieldValue('KEY' + n));
        var value = Blockly.Python.valueToCode(block, 'VALUE' + n,
                Blockly.Python.ORDER_NONE) || '___';
        code[n] = key +": "+ value;
    }
    code = '{' + code.join(', ') + '}';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['dict_keys'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var code = dict + '.keys()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['input_num'] = function(block) {
  var code = 'int(input())';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_num_next'] = function(block) {
  // TODO :: make a more optimized version of this
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  Blockly.Python.definitions_['from_string_import_whitespace'] = 'from string import whitespace';
  Blockly.Python.definitions_['input_word'] = "def input_word():\n"
                                            + "    buffer = ''\n"
                                            + "    newchar = 'c'\n"
                                            + "    while newchar:\n"
                                            + "        newchar = sys.stdin.read(1)\n"
                                            + "        if newchar in whitespace:\n"
                                            + "            if buffer: break\n"
                                            + "        else:\n"
                                            + "            buffer += newchar\n"
                                            + "    return buffer\n";
  var code = 'int(input_word())';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_char'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  var code = 'sys.stdin.read(1)';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_word'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  Blockly.Python.definitions_['from_string_import_whitespace'] = 'from string import whitespace';
  Blockly.Python.definitions_['input_word'] = "def input_word():\n"
                                            + "    buffer = ''\n"
                                            + "    newchar = 'c'\n"
                                            + "    while newchar:\n"
                                            + "        newchar = sys.stdin.read(1)\n"
                                            + "        if newchar in whitespace:\n"
                                            + "            if buffer: break\n"
                                            + "        else:\n"
                                            + "            buffer += newchar\n"
                                            + "    return buffer\n";
  var code = 'input_word()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_line'] = function(block) {
  Blockly.Python.definitions_['import_sys'] = 'import sys';
  var code = 'sys.stdin.readline()[:-1]';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['input_num_list'] = function(block) {
  var code = 'list(map(int, input().split()))';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python['lists_append'] = function(block) {
  // Append
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  return varName + '.append(' + value + ')\n';
};

Blockly.Python['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.Python.valueToCode(block, 'LIST',
      Blockly.Python.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var value = Blockly.Python.valueToCode(block, 'TO',
      Blockly.Python.ORDER_NONE) || 'None';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.Python.variableDB_.getDistinctName(
        'tmp_list', Blockly.Variables.NAME_TYPE);
    var code = listVar + ' = ' + list + '\n';
    list = listVar;
    return code;
  }

  if(mode == 'SET') {
    // TODO :: set this as an option
/*    Blockly.Python.definitions_['lists_assignIndex'] = '' +
      'def assignIndex(l, i, x):\n' +
      '    if i > 1000000:\n' +
      '        raise IndexError("list index > 1000000")\n' +
      '    n = len(l)\n' +
      '    if i >= n:\n' +
      '        l.extend([None]*(i-n+1))\n' +
      '    l[i] = x\n';*/
  }
  function makeAssignIndex(l, a, v) {
    // TODO :: set this as an option
//    return 'assignIndex(' + l + ', ' + a + ', ' + v + ')\n';
    return list + '[' + a + '] = ' + v + '\n';
  }

  switch (where) {
    case 'FIRST':
      if (mode == 'SET') {
        return makeAssignIndex(list, 0, value);
      } else if (mode == 'INSERT') {
        return list + '.insert(0, ' + value + ')\n';
      }
      break;
    case 'LAST':
        if (mode == 'SET') {
          return makeAssignIndex(list, -1, value);
        } else if (mode == 'INSERT') {
          return list + '.append(' + value + ')\n';
        }
      break;
    case 'FROM_START':
      var at = Blockly.Python.getAdjustedInt(block, 'AT');
        if (mode == 'SET') {
          return makeAssignIndex(list, at, value);
        } else if (mode == 'INSERT') {
          return list + '.insert(' + at + ', ' + value + ')\n';
        }
      break;
    case 'FROM_END':
      var at = Blockly.Python.getAdjustedInt(block, 'AT', 1, true);
        if (mode == 'SET') {
          return makeAssignIndex(list, at, value);
        } else if (mode == 'INSERT') {
          return list + '.insert(' + at + ', ' + value + ')\n';
        }
      break;
    case 'RANDOM':
        Blockly.Python.definitions_['import_random'] = 'import random';
        var code = cacheList();
        var xVar = Blockly.Python.variableDB_.getDistinctName(
            'tmp_x', Blockly.Variables.NAME_TYPE);
        code += xVar + ' = int(random.random() * len(' + list + '))\n';
        if (mode == 'SET') {
          code += makeAssignIndex(list, xVar, value);
          return code;
        } else if (mode == 'INSERT') {
          code += list + '.insert(' + xVar + ', ' + value + ')\n';
          return code;
        }
      break;
  }
  throw 'Unhandled combination (lists_setIndex).';
};

Blockly.Python['lists_sort_place'] = function(block) {
  var varName = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + '.sort()\n';
};


Blockly.Python['controls_repeat_ext'] = function(block) {
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
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var loopVar = Blockly.Python.variableDB_.getDistinctName(
      'loop', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
};

Blockly.Python['controls_repeat'] = Blockly.Python['controls_repeat_ext'];

Blockly.Python['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.Python.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.Python.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'DIVIDEFLOOR': [' // ', Blockly.Python.ORDER_MULTIPLICATIVE],
    'POWER': [' ** ', Blockly.Python.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Python.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
  // In case of 'DIVIDE', division between integers returns different results
  // in Python 2 and 3. However, is not an issue since Blockly does not
  // guarantee identical results in all languages.  To do otherwise would
  // require every operator to be wrapped in a function call.  This would kill
  // legibility of the generated code.
};


Blockly.Python['tables_2d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.Python.definitions_['tables_2d_init'] = '' +
    'def table2dInit(x, y, a):\n' +
    '    if x > 1000000 or y > 1000000: raise IndexError("' + Blockly.Msg.TABLES_TOO_BIG +'")\n' +
    '    return [[a] * y for i in range(x)]';

  var at1 = Blockly.Python.valueToCode(block, 'LINES', Blockly.Python.ORDER_COMMA) || '0';
  var at2 = Blockly.Python.valueToCode(block, 'COLS', Blockly.Python.ORDER_COMMA) || '0';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_ASSIGNMENT) || 'null';

  return varName + ' = table2dInit(' + at1 + ', ' + at2 + ', ' + value + ');\n';
}

Blockly.Python['tables_2d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at2 = Blockly.Python.getAdjustedInt(block, 'COL');
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || 'None';

  var code = '';
  // TODO :: set this as an option
//  code += 'if ' + at1 + ' >= len(' + varName + ') or ' + at2 + ' >= len(' + varName + '[' + at1 + ']): raise IndexError("' + Blockly.Msg.TABLES_OUT_OF_BOUNDS + '")\n';
  code += varName + '[' + at1 + '][' + at2 + '] = ' + value + "\n";
  return code;
}

Blockly.Python['tables_2d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at2 = Blockly.Python.getAdjustedInt(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
}

Blockly.Python['tables_3d_init'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  // Use a function to keep scope contained
  Blockly.Python.definitions_['tables_3d_init'] = '' +
    'def table3dInit(x, y, z, a):\n' +
    '    if x > 1000000 or y > 1000000 or z > 1000000: raise IndexError("' + Blockly.Msg.TABLES_TOO_BIG +'")\n' +
    '    return [[[a] * z for i in range(y)] for j in range(x)]';

  var at1 = Blockly.Python.valueToCode(block, 'LAYERS', Blockly.Python.ORDER_COMMA) || '0';
  var at2 = Blockly.Python.valueToCode(block, 'LINES', Blockly.Python.ORDER_COMMA) || '0';
  var at3 = Blockly.Python.valueToCode(block, 'COLS', Blockly.Python.ORDER_COMMA) || '0';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_ASSIGNMENT) || 'null';

  return varName + ' = table3dInit(' + at1 + ', ' + at2 + ', ' + at3 + ', ' + value + ');\n';
}

Blockly.Python['tables_3d_set'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LAYER');
  var at2 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at3 = Blockly.Python.getAdjustedInt(block, 'COL');
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || 'None';

  var code = '';
  // TODO :: set this as an option
//  code += 'if ' + at1 + ' >= len(' + varName + ') or ' + at2 + ' >= len(' + varName + '[' + at1 + ']) or ' + at3 + ' >= len(' + varName + '[' + at1 + '][' + at2 + ']): raise IndexError("' + Blockly.Msg.TABLES_OUT_OF_BOUNDS + '")\n';
  code += varName + '[' + at1 + '][' + at2 + '][' + at3 + '] = ' + value + "\n";
  return code;
}

Blockly.Python['tables_3d_get'] = function(block) {
  var blockVarName = block.getFieldValue('VAR');
  if(blockVarName) {
    var varName = Blockly.Python.variableDB_.getName(blockVarName, Blockly.Variables.NAME_TYPE);
  } else {
    var varName = 'unnamed_variable'; // Block is still loading
  }

  var at1 = Blockly.Python.getAdjustedInt(block, 'LAYER');
  var at2 = Blockly.Python.getAdjustedInt(block, 'LINE');
  var at3 = Blockly.Python.getAdjustedInt(block, 'COL');
  var code = varName + '[' + at1 + '][' + at2 + '][' + at3 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
}


Blockly.Python['text_print_noend'] = function(block) {
  // Print statement.
  var msg = Blockly.Python.valueToCode(block, 'TEXT',
      Blockly.Python.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ', end="")\n';
};

Blockly.Python['text_eval'] = function(block) {
  var expr = block.getFieldValue('EXPR');
  var reindexExpr = Blockly.reindexExpression(expr);
  if(reindexExpr === null) {
    return ['false', Blockly.Python.ORDER_ATOMIC];
  } else {
    return [reindexExpr, Blockly.Python.ORDER_NONE];
  }
};
