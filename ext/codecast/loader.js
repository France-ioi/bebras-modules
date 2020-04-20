function loadPythonAnalysisModules() {
    var modules = [
        'react',
        'react_dom',

        'immutable',

        'python_count',
        'skulpt_quickAlgo',
        'skulpt_stdlib',
        'skulpt_debugger',

        'codecast_analysis',
        'codecast_python_stack_view_container',
        'codecast_python_function_header',
        'codecast_python_function_locals',
        'codecast_python_function_view',
        'codecast_python_stack_view',
        'codecast_python_variable',
        'codecast_python_variable_value'
    ];

    importModules(modules);
}
