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
        'quiz3_styles',
        'quiz3',
        'quiz3_task',
        'quiz3_grader',
    ];

    // question types
    if(window.quiz_question_types.fill_gaps) {
        modules.push('quiz3_questions_fill_gaps');
        modules.push('interactjs');
    }
    if(window.quiz_question_types.single || window.quiz_question_types.multiple) {
        modules.push('quiz3_questions_choice');
    }
    if(window.quiz_question_types.input) {
        modules.push('quiz3_questions_input');
        modules.push('numeric_keypad');
        modules.push('numeric_keypad_css');
    }
    if(window.quiz_question_types.sort_list){
        modules.push('quiz3_questions_sort_list');
    }
    if(window.quiz_question_types.sort_items){
        modules.push('quiz3_questions_sort_items');
    }
    if(window.quiz_question_types.sort_list || window.quiz_question_types.sort_items){
        modules.push('sortable');
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
