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

    Quiz.params = params;

    var questions_order = [];

    // prepare params
    var default_params = {
        shuffle_questions: false,
        shuffle_answers: false
    }
    var params = Object.assign(default_params, params);
    if(!params.parent) {
        Quiz.common.error('Parent element not specified');
        return false;
    }



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
    params.parent.show();



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

        toggleSolutions: function(visible) {
            params.parent.find('#solution').toggle(visible);
            if (visible) {
                $('#task').toggleClass('displaySolution');
            }
        },

        showResult: function(mistakes) {
            mistakes = Array.isArray(mistakes) ? mistakes : [];
            for(var i=0; i<questions.length; i++) {
                questions[i].showResult(mistakes[i]);
            }
        },

        reset: function() {
            for(var i=0; i<questions.length; i++) {
                questions[i].reset();
            }
        }

    }
}
