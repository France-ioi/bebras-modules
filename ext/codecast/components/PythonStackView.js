const PythonStackView = props => {
  const callReturn = null;
  const firstVisible = 0;
  const tailCount = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "stack-view",
    style: {
      height: props.height
    }
  }, callReturn && /*#__PURE__*/React.createElement(CallReturn, {
    view: callReturn
  }), firstVisible > 0 && /*#__PURE__*/React.createElement("div", {
    key: "tail",
    className: "scope-ellipsis"
  }, '… +', firstVisible), props.analysis.functionCallStack.reverse().map(func => /*#__PURE__*/React.createElement(PythonFunctionView, {
    key: func.key,
    func: func
  })), tailCount > 0 && /*#__PURE__*/React.createElement("div", {
    key: "tail",
    className: "scope-ellipsis"
  }, '… +', tailCount), /*#__PURE__*/React.createElement("div", {
    className: "stack-bottom"
  }));
};