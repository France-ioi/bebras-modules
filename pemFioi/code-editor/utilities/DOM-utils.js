/*!
 * @author John Ropas
 * @since 17/12/2016
 */

CodeEditor.Utils.DOM.Elements = {
  EDITOR: '#blocklyLibContent', // TODO :: change
  BLOCKLY_WIDGET: ".blocklyWidgetDiv",
  BLOCKLY_TOOLTIP: ".blocklyTooltipDiv",
  EDITOR_CONTAINER: '#editorContainer',
  PYTHON_WORKSPACE:'#python-workspace',
  EDITOR_CONTAINER_ID: 'editorContainer',
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
    " <div id='" + CodeEditor.Utils.DOM.Elements.PYTHON_WORKSPACE_ID + "' class='language_python' style='width: 100%; height: 100%'></div>" +
    "</div>";
};
