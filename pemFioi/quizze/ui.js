function QuizzeUI(params) {







    // sys utils
    function error(msg) {
        console.error('Quizze error: ' + msg);
    }


    function shuffleArray(a) {
        var j, x, i, r;
        for(i = a.length - 1; i > 0; i--) {
            r = 0.5 * (1 + Math.sin(i + params.random));
            j = Math.floor(r * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function shuffleElements(elements) {
        var order = [];
        if(!elements.length) {
            return order;
        }
        for(var i=0; i<elements.length; i++) {
            order[i] = i;
        }
        order = shuffleArray(order);
        var parent = $(elements[0]).parent();
        for(var i=0; i<elements.length; i++) {
            parent.append($(elements[order[i]]));
        }
        return order;
    }


    // prepare params
    var default_params = {
        shuffle_questions: false,
        shuffle_answers: false
    }
    var params = Object.assign(default_params, params);
    if(!params.parent) {
        error('Parent element not specified');
        return false;
    }


    // apply desing
    var answer_tpl =
        '<div class="answer-block">\
            <span class="answer-label">%%LABEL%%</span>\
            <span class="answer-code">%%CODE%%</span>\
        </div>';

    params.parent.find('question').each(function() {
        var question = $(this);
        var answers = question.find('answer');
        if (question.attr("type") !== "input") {
            answers.each(function(i) {
                var answer = $(this);
                var html = answer_tpl;
                html = html
                    .replace('%%LABEL%%', answer.html())
                    .replace('%%CODE%%', String.fromCharCode(i + 65));
                answer.html(html)
            });
        }
        answers.wrapAll('<div class="answers"></div>');
    })


    // questions types
    function initQuestionSingle(parent) {

        var answers = parent.find('answer');
        answers.each(function(i) {
            $(this).attr('answer-index', i);
        })
        answers.click(function() {
            parent.find('answer').removeClass('selected mistake');
            $(this).addClass('selected');
        });
        if(params.shuffle_answers) {
            shuffleElements(answers);
        }

        return {
            getAnswer: function() {
                return parseInt(parent.find('answer.selected').attr('answer-index'), 10);
            },

            setAnswer: function(value) {
                parent.find('answer').removeClass('selected');
                if(!isNaN(value)) {
                    parent.find('answer[answer-index=' + value + ']').addClass('selected');
                }
            },

            showResult: function(mistakes) {
                parent.find('answer').removeClass('correct mistake');
                parent.find('answer.selected').addClass(mistakes === null ? 'correct' : 'mistake');
            }
        }

    }


    function initQuestionMultiple(parent) {

        var answers = parent.find('answer');
        answers.each(function(i) {
            $(this).attr('answer-index', i);
        })
        answers.click(function() {
            answers.removeClass('mistake');
            $(this).toggleClass('selected');
        });
        if(params.shuffle_answers) {
            shuffleElements(answers);
        }

        return {
            getAnswer: function() {
                var res = [];
                parent.find('answer.selected').each(function(i) {
                    res.push(parseInt($(this).attr('answer-index'), 10));
                });
                return res;
            },

            setAnswer: function(values) {
                parent.find('answer').each(function(i) {
                    var el = $(this);
                    var idx = parseInt(el.attr('answer-index'), 10);
                    el.toggleClass('selected', values.indexOf(idx) !== -1);
                });
            },

            showResult: function(mistakes) {
                parent.find('answer').removeClass('correct mistake');
                parent.find('answer.selected').each(function() {
                    var el = $(this)
                    var idx = parseInt(el.attr('answer-index'), 10);
                    el.addClass(mistakes.indexOf(idx) === -1 ? 'correct' : 'mistake')
                })
            }
        }

    }




    function initQuestionInput(parent) {

        var input = parent.find('answer').find('input');

        var validator = input.attr('validator');
        if(validator) {
            var reg = new RegExp(validator);
            input.on('change', function() {
                parent.find('answer').removeClass('mistake');
                var el = $(this);
                var valid = reg.test(el.val());
                input.toggleClass('error', !valid);
                var msg = input.closest('answer').find('.error-message');
                !valid && !msg.length && input.closest('answer').append('<div class="error-message"><i class="fas fa-bell icon"></i>Wrong format</div>')
                valid && msg && msg.remove();
            });
        }

        return {
            getAnswer: function() {
                return input.val();
            },

            setAnswer: function(value) {
                input.val(value)
            },

            showResult: function(mistakes) {
                parent.find('answer').removeClass('correct mistake');
                parent.find('answer').addClass(mistakes === null ? 'correct' : 'mistake');
            }
        }

    }

    var question_factory = {
        single: initQuestionSingle,
        multiple: initQuestionMultiple,
        input: initQuestionInput
    }





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
        if(question_factory[type]) {
            questions[i] = question_factory[type](el);
        } else {
            error('Unsupported question type ' + type);
        }
    });
    if(params.shuffle_questions) {
        shuffleElements(els);
    }


    params.parent.find('solution').hide();
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
            params.parent.find('solution').toggle(visible);
            if (visible) {
                $('#task').toggleClass('displaySolution');
            }
        },

        showResult: function(mistakes) {
            for(var i=0; i<questions.length; i++) {
                questions[i].showResult(mistakes[i]);
            }
        }

    }
}