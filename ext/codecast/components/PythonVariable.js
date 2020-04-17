var PythonVariable = function PythonVariable(props) {
    return React.createElement(
        "div",
        { className: "vardecl" },
        React.createElement(
            "span",
            null,
            React.createElement(
                "span",
                { className: "vardecl-name" },
                props.name
            )
        ),
        ' = ',
        React.createElement(
            "span",
            { className: "vardecl-value" },
            React.createElement(
                "span",
                { className: "value" },
                React.createElement(PythonVariableValue, { cur: props.value.cur, old: props.value.old })
            )
        )
    );
};
