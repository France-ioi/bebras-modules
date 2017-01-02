/*!
 * @author John Ropas
 * @since 17/12/2016
 */

CodeEditor.Utils.DOM.Elements = {
  EDITOR: '#editor',
  BLOCKLY_WIDGET: ".blocklyWidgetDiv",
  BLOCKLY_TOOLTIP: ".blocklyTooltipDiv",
  EDITOR_CONTAINER: '#editorContainer',
  BLOCKLY_WORKSPACE: '#blockly-workspace',
  JAVASCRIPT_WORKSPACE:'#javascript-workspace',
  PYTHON_WORKSPACE:'#python-workspace',
  EDITOR_CONTAINER_ID: 'editorContainer',
  BLOCKLY_WORKSPACE_ID: 'blockly-workspace',
  JAVASCRIPT_WORKSPACE_ID:'javascript-workspace',
  PYTHON_WORKSPACE_ID:'python-workspace'
};

CodeEditor.Utils.DOM.resetFormElement = function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();
};

CodeEditor.Utils.DOM.loadBasicEditor = function (html) {
  $(CodeEditor.Utils.DOM.Elements.EDITOR).html(html);
};

CodeEditor.Utils.DOM.clearFix = function (html, divId) {
  return "<div "+(divId ? "id='"+divId+"'" : '')+"class='clearBoth' >" + html + "</div>";
};

CodeEditor.Utils.DOM.generateWorkspace = function () {
  return "<div id='" + CodeEditor.Utils.DOM.Elements.EDITOR_CONTAINER_ID + "'>" +
    " <div id='" + CodeEditor.Utils.DOM.Elements.BLOCKLY_WORKSPACE_ID + "' class='language_blockly'></div>" +
    " <textarea id='" + CodeEditor.Utils.DOM.Elements.JAVASCRIPT_WORKSPACE_ID + "' class='language_javascript'></textarea>" +
    " <textarea id='" + CodeEditor.Utils.DOM.Elements.PYTHON_WORKSPACE_ID + "' class='language_python'></textarea>" +
    "</div>";
};

CodeEditor.Utils.DOM.displayLanguageWorkspace = function (language) {
  $(CodeEditor.Utils.DOM.Elements.BLOCKLY_WORKSPACE).css('display', language === CodeEditor.CONST.LANGUAGES.BLOCKLY ? 'block' : 'none');
  $(CodeEditor.Utils.DOM.Elements.JAVASCRIPT_WORKSPACE).css('display', language === CodeEditor.CONST.LANGUAGES.JAVASCRIPT ? 'block' : 'none');
  $(CodeEditor.Utils.DOM.Elements.PYTHON_WORKSPACE).css('display', language === CodeEditor.CONST.LANGUAGES.PYTHON ? 'block' : 'none');

};

CodeEditor.Utils.DOM.removeBlockly = function () {
  $(CodeEditor.Utils.DOM.Elements.BLOCKLY_WIDGET).remove();
  $(CodeEditor.Utils.DOM.Elements.BLOCKLY_TOOLTIP).remove();
  document.removeEventListener("keydown");
  //, Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
  if (Blockly) {
    delete Blockly;
  }
};
