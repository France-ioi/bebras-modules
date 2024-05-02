Quiz = {
    grader: {}
}


Quiz.common = {

    error: function(msg) {
        console.error('Quiz error: ' + msg);
    },

    shuffleArray: function(a) {
        var j, x, i, r;
        for(i = a.length - 1; i > 0; i--) {
            r = 0.5 * (1 + Math.sin(i + Quiz.params.random));
            j = Math.floor(r * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },

    shuffleElements: function(elements, shuffle) {
        var order = [];
        if(!elements.length) {
            return order;
        }
        for(var i=0; i<elements.length; i++) {
            order[i] = i;
        }
        if(!shuffle) {
            return order;
        }
        order = this.shuffleArray(order);
        var parent = $(elements[0]).parent();
        for(var i=0; i<elements.length; i++) {
            parent.append($(elements[order[i]]));
        }
        return order;
    },

    questionLabel: function(idx) {
        return String.fromCharCode(idx + 65);
    },


    toggleAlertMessage: function(parent, msg, type, whole_question) {
        var el = parent.find('.error-message');
        el.remove();
        if(!msg) { return; }

        var html = '<div class="alert-message ' + type + '-message">' +
            '<i class="fas fa-bell icon"></i>' + msg +
            '</div>';
        if(!whole_question && parent.parents("question.horizontal").length) {
            parent.find('.answer-code').before(html);
        } else {
            parent.append(html);
        }
    }
}


Quiz.versions = {

    data: {},

    init: function(params) {
        var self = this;
        $('question-group').each(function(i, question_set) {
            question_set = $(question_set);
            var questions = question_set.find('question');
            self.data[i] = (i + params.random) % questions.length;
            questions.each(function(j, question) {
                if(j == self.data[i]) {
                    $(question).insertAfter(question_set);
                } else {
                    $(question).remove();
                }
            });
            question_set.remove();
        });
    },


    get: function() {
        return this.data;
    }

}



Quiz.questionTypes = {

    types: {},

    register: function(type, func) {
        this.types[type] = func;
    },

    create: function(type, parent, question_idx, params) {
        if(this.types[type]) {
            return this.types[type](parent, question_idx, params);
        } else {
            Quiz.common.error('Unsupported question type ' + type);
        }
    }
}



Quiz.UI = function(params) {

    var questions_order = [];

    // prepare params
    var default_params = {
        shuffle_questions: false,
        shuffle_answers: false,
        feedback_score: "exact", // none | binary | exact
        feedback_on_wrong_choices: "first_under_question", // none | first_under_question | first_under_choice | selected_only | all
        feedback_on_correct_choices: "all", //  none | selected_only | all
        show_solutions: "all", // none | correct_only | all
        alert_if_no_answer: true, // bool
        keypad_input_only: false, // bool, if true, only keypad input is allowed for number inputs
        save_only_mode: false // bool, if true, behave as a task which only saves the answer and gives 100
    }
    var params = Object.assign(default_params, params);

    // save only mode
    if (params.save_only_mode) {
        params.feedback_score = "saved";
        params.feedback_on_wrong_choices = "none";
        params.feedback_on_correct_choices = "none";
        params.show_solutions = "none";
    }

    Quiz.params = params;
    //console.log('Quiz.params', Quiz.params)

    if(!params.parent) {
        Quiz.common.error('Parent element not specified');
        return false;
    }

    // init versions
    Quiz.versions.init(params);


    // questions types
    function initAnswers(parent) {
        parent.find('answer').click(function() {
            $(this).addClass('selected');
        })
    }


    // init questions
    var els = params.parent.find('question');
    var questions = [];
    els.each(function(i, el) {
        el = $(el)
        var type = el.attr('type') || 'single';
        questions[i] = Quiz.questionTypes.create(type, el, i, params);
    });
    questions_order = Quiz.common.shuffleElements(els, params.shuffle_questions);


    // toggle questions numeration
    $('.taskContent').toggleClass('questions-numeration-enabled', questions.length > 1);


    // replace refs in solution with real answer and qustion numbers/labels
    function realQuestionNumber(question_idx) {
        var idx = questions_order.indexOf(question_idx);
        if(idx > -1) {
            return idx + 1;
        } else {
            console.error("Could not find question index " + question_idx + ".");
            return '';
        }
    }

    function realAnswerNumber(question_idx, answer_idx) {
        if(questions[question_idx] && questions[question_idx].answers_order) {
            var idx = questions[question_idx].answers_order.indexOf(question_idx);
            if(idx !== -1) {
                return Quiz.common.questionLabel(idx);
            }
            console.error("Could not find answer index " + answer_idx + " in question " + question_idx + ".");
        } else {
            console.error("Could not find question index " + question_idx + ".");
        }

        return '';
    }

    $('#solution').find('ref').each(function() {
        var el = $(this);
        var nq = el.attr('question');
        if(typeof nq === 'undefined') {
            return;
        }
        nq = parseInt(nq, 10) - 1;
        var na = el.attr('answer');
        if(typeof na !== 'undefined') {
            na = parseInt(na, 10) - 1;
            var text = realAnswerNumber(nq, na);
        } else {
            var text = realQuestionNumber(nq);
        }
        el.text(text);
    });



    // sys
    function useFullWidth() {
        // From buttonsAndMessages
        try {
            $('#question-iframe', window.parent.document).css('width', '100%');
            $('body').css('width', '100%');
        } catch(e) {
        }
    }
    FontsLoader.loadFonts(['fontawesome', 'titillium-web']);
    useFullWidth();
    params.parent.show();

    function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(window.location.toString());
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    if(getParameterByName('theme') == 'coursera') {
       $('body').addClass('coursera');
       FontsLoader.loadFonts(['source-sans-pro']);
    }


    // interface

    return {
        getAnswer: function() {
            var res = [];
            for(var i=0; i<questions.length; i++) {
                res.push(questions[i].getAnswer());
            }
            return res;
        },

        setAnswer: function(answer) {
            for(var i=0; i<questions.length; i++) {
                questions[i].setAnswer(answer[i]);
            }
        },

        toggleFeedback: function(visible) {
            $('#task').toggleClass('displayFeedback', visible);
        },

        toggleSolutions: function(visible) {
            $('#solution').toggle(visible);
            $('#task').toggleClass('displaySolution', visible);
        },

        displayFeedback: function(feedback) {
            for(var i=0; i<feedback.length; i++) {
                if(!questions[i].checkAnswered(lang.translate('wrong_answer_msg_not_answered'))) {
                    continue;
                }
                questions[i].displayFeedback(feedback[i]);
            }
            if(feedback.partial) {

            }
            this.toggleFeedback(true);
        },

        reset: function(from_scratch) {
            for(var i=0; i<questions.length; i++) {
                questions[i].resetFeedback();
                if(from_scratch) {
                    questions[i].resetAnswer();
                }
            }
        },


        getQuestionsInfo: function() {
            var res = [];
            for(var i=0; i<questions.length; i++) {
                res[i] = {
                    answers_amount: 'answers_order' in questions[i] ? questions[i].answers_order.length : 0
                }
            }  
            return res;
        }

    }
}
