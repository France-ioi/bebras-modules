const PythonStackView = (props) => {
    const callReturn = null;
    const firstVisible = 0;
    const tailCount = 0;

    return (
        <div className="stack-view" style={{height: props.height}}>
            {callReturn && <CallReturn view={callReturn} />}
            {firstVisible > 0 &&
            <div key='tail' className="scope-ellipsis">
                {'… +'}{firstVisible}
            </div>
            }
            {props.analysis.functionCallStack.reverse().map((func) => (
                <PythonFunctionView
                    key={func.key}
                    func={func}
                />
            ))}
            {tailCount > 0 &&
            <div key='tail' className="scope-ellipsis">
                {'… +'}{tailCount}
            </div>}
            <div className="stack-bottom" />
        </div>
    );
};
