"use strict";

var PythonFunctionHeader = function PythonFunctionHeader(props) {
  var argCount = props.func.args.length;
  var args = props.func.args.map(function (name) {
    return props.func.variables.get(name);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "scope-function-title"
  }, /*#__PURE__*/React.createElement("span", null, props.func.name ? props.func.name + ' (' : null, /*#__PURE__*/React.createElement("span", null, args.map(function (value, index) {
    return /*#__PURE__*/React.createElement("span", {
      key: index
    }, /*#__PURE__*/React.createElement(PythonVariableValue, {
      cur: value.cur,
      old: value.old
    }), index + 1 < argCount ? ', ' : null);
  })), props.func.name ? ')' : null));
};