function loadQuizModules() {

    var modules = [
        'jquery-1.7.1',
        'JSON-js',
        'raphael-2.2.1',
        'jschannel',
        'platform-pr',
        'installationAPI.01',
        'miniPlatform',
        'fonts-loader-1.0',
        'quiz_styles',
        'quiz',
        'quiz_task',
        'quiz_grader',
    ];

    // question types
    if(window.quiz_question_types.fill_gaps) {
        modules.push('jquery-ui-1.10.3');
        modules.push('jquery-ui.touch-punch');
        modules.push('quiz_questions_fill_gaps');
    }
    if(window.quiz_question_types.single || window.quiz_question_types.multiple) {
        modules.push('quiz_questions_choice');
    }
    if(window.quiz_question_types.input) {
        modules.push('quiz_questions_input');
    }

    // text processing
    if(quiz_settings.mathjax) {
        modules.push('mathjax');
    }
    if(task_data_info.markdown) {
        modules.push('showdown');
    }
    if(task_data_info.markdown || quiz_settings.mathjax) {
        modules.push('post_processor');
    }

    importModules(modules);
}
