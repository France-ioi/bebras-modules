"use strict";

var PythonVariableValue = function PythonVariableValue(props) {
  if (props.cur instanceof Sk.builtin.list) {
    var nbElements = props.cur.v.length;
    var elements = [];

    for (var idx = 0; idx < props.cur.v.length; idx++) {
      var old = undefined;

      if (props.old && props.old instanceof Sk.builtin.list) {
        old = props.old.v[idx];
      }

      elements.push({
        cur: props.cur.v[idx],
        old: old
      });
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, "[", elements.map(function (element, index) {
      return /*#__PURE__*/React.createElement("span", {
        key: index
      }, /*#__PURE__*/React.createElement(PythonVariableValue, {
        cur: element.cur,
        old: element.old
      }), index + 1 < nbElements ? ', ' : null);
    }), "]");
  }

  if (props.cur instanceof Sk.builtin.str) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\"", props.cur.v, "\""), props.old && props.cur.v !== props.old.v ? /*#__PURE__*/React.createElement("span", {
      className: "value-previous"
    }, "\"", props.old.v, "\"") : null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, props.cur.v), props.old && props.cur.v !== props.old.v ? /*#__PURE__*/React.createElement("span", {
    className: "value-previous"
  }, props.old.v) : null);
};