"use strict";

var PythonFunctionView = function PythonFunctionView(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stack-frame stack-frame-focused"
  }, /*#__PURE__*/React.createElement(PythonFunctionHeader, {
    func: props.func
  }), /*#__PURE__*/React.createElement(PythonFunctionLocals, {
    func: props.func
  }));
};