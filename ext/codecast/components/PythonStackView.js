var PythonStackView = function PythonStackView(props) {
    var callReturn = null;
    var firstVisible = 0;
    var tailCount = 0;

    /*
    if (!context) {
        return (
            <div className="stack-view" style={{height: props.height}}>
                <p>{props.getMessage('PROGRAM_STOPPED')}</p>
            </div>
        );
    }
    */

    /*
    const {programState} = context;
    if (programState && programState.error) {
        return (
            <div className="stack-view" style={{height: props.height}}>
                <Alert intent={Intent.DANGER} onClose={this.onExit}>
                    <h4>{props.getMessage('ERROR')}</h4>
                    <p>{programState.error.toString()}</p>
                </Alert>
            </div>
        );
    }
    */

    return React.createElement(
        "div",
        { className: "stack-view", style: { height: props.height } },
        callReturn && React.createElement(CallReturn, { view: callReturn }),
        firstVisible > 0 && React.createElement(
        "div",
        { key: "tail", className: "scope-ellipsis" },
        '… +',
        firstVisible
        ),
        props.analysis.functionCallStack.reverse().map(function (func) {
            return React.createElement(PythonFunctionView, {
                key: func.key,
                func: func
            });
        }),
        tailCount > 0 && React.createElement(
        "div",
        { key: "tail", className: "scope-ellipsis" },
        '… +',
        tailCount
        ),
        React.createElement("div", { className: "stack-bottom" })
    );
};
