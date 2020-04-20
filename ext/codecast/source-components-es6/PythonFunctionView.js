const PythonFunctionView = (props) => {
    return (
        <div className="stack-frame stack-frame-focused">
            <PythonFunctionHeader func={props.func} />
            <PythonFunctionLocals func={props.func} />
        </div>
    );
};
