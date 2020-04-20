"use strict";

var PythonVariable = function PythonVariable(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "vardecl"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "vardecl-name"
  }, props.name)), ' = ', /*#__PURE__*/React.createElement("span", {
    className: "vardecl-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, /*#__PURE__*/React.createElement(PythonVariableValue, {
    cur: props.value.cur,
    old: props.value.old
  }))));
};