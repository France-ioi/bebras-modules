var PythonFunctionView = function PythonFunctionView(props) {
    return React.createElement(
        "div",
        { className: "stack-frame stack-frame-focused" },
        React.createElement(PythonFunctionHeader, { func: props.func }),
        React.createElement(PythonFunctionLocals, { func: props.func })
    );
};
