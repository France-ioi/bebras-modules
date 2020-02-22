(function() {


    // redesing

    var single_tpl =
        '<div class="answer-block">\
            <span class="answer-label">%%LABEL%%</span>\
            <span class="answer-code">%%CODE%%</span>\
        </div>';

    var multiple_tpl =
        '<div class="answer-block">\
            <span class="answer-label">%%LABEL%%</span>\
            <span class="answer-switch"><span class="cursor"></span></span>\
        </div>';

    function redesign(question) {
        var answers = question.find('answer');
        answers.each(function(i) {
            var answer = $(this);
            if (question.attr("type") === "single") {
                var html = single_tpl;
                html = html
                    .replace('%%LABEL%%', answer.html())
                    .replace('%%CODE%%', Quiz.common.questionLabel(i));
            }
            else if (question.attr("type") === "multiple") {
                var html = multiple_tpl;
                html = html
                    .replace('%%LABEL%%', answer.html());
            }
            answer.html(html)
        });
        answers.wrapAll('<div class="answers"></div>');
    }




    // core

    function singleChoice(parent, question_idx, params) {

        var answers = parent.find('answer');
        answers.each(function(i) {
            $(this).attr('answer-index', i);
        })
        answers.click(function() {
            parent.find('answer').removeClass('selected mistake');
            $(this).addClass('selected');
        });
        var answers_order = Quiz.common.shuffleElements(answers, params.shuffle_answers);


        redesign(parent);

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

            isAnswered: function() {
                return !isNaN(this.getAnswer());
            },

            showResult: function(mistakes, message) {
                parent.find('answer').removeClass('correct mistake');
                parent.find('answer.selected').addClass(mistakes === null ? 'correct' : 'mistake');
                Quiz.common.toggleWrongAnswerMessage(parent, message);
            },

            reset: function() {
                parent.find('answer').removeClass('selected correct mistake');
            },

            answers_order: answers_order
        }
    }

    Quiz.questionTypes.register('single', singleChoice);



    function multipleChoice(parent, question_idx, params) {

        var answers = parent.find('answer');
        answers.each(function(i) {
            $(this).attr('answer-index', i);
        })
        answers.click(function() {
            answers.removeClass('mistake');
            $(this).toggleClass('selected');
        });
        var answers_order = Quiz.common.shuffleElements(answers, params.shuffle_answers);


        redesign(parent);

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

            isAnswered: function() {
                return this.getAnswer().length > 0;
            },

            showResult: function(mistakes, message) {
                parent.find('answer').removeClass('correct mistake');
                if(Array.isArray(mistakes)) {
                    parent.find('answer.selected').each(function() {
                        var el = $(this)
                        var idx = parseInt(el.attr('answer-index'), 10);
                        el.addClass(mistakes.indexOf(idx) === -1 ? 'correct' : 'mistake')
                    })
                }
                if(Array.isArray(message)) {
                    answers.each(function(i) {
                        Quiz.common.toggleWrongAnswerMessage($(this), message[i]);
                    });
                } else {
                    Quiz.common.toggleWrongAnswerMessage(parent, message);
                }
            },

            reset: function() {
                parent.find('answer').removeClass('selected correct mistake');
            },

            answers_order: answers_order
        }
    }

    Quiz.questionTypes.register('multiple', multipleChoice);
})();