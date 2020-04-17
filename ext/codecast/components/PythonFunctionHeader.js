var PythonFunctionHeader = function PythonFunctionHeader(props) {
    var argCount = props.func.args.length;

    var args = props.func.args.map(function (name) {
        return props.func.variables.get(name);
    });

    return React.createElement(
        "div",
        { className: "scope-function-title" },
        React.createElement(
            "span",
            null,
            props.func.name ? props.func.name + ' (' : null,
            React.createElement(
                "span",
                null,
                args.map(function (value, index) {
                    return React.createElement(
                        "span",
                        { key: index },
                        React.createElement(PythonVariableValue, { cur: value.cur, old: value.old }),
                        index + 1 < argCount ? ', ' : null
                    );
                })
            ),
            props.func.name ? ')' : null
        )
    );
};
