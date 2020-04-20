const PythonFunctionLocals = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "scope-function-blocks"
  }, /*#__PURE__*/React.createElement("ul", {
    className: !props.func.name ? 'global-scope' : null
  }, props.func.variables.entrySeq().map(([name, value]) => value.cur !== undefined ? /*#__PURE__*/React.createElement("li", {
    key: name
  }, /*#__PURE__*/React.createElement(PythonVariable, {
    name: name,
    value: value
  })) : null)));
};