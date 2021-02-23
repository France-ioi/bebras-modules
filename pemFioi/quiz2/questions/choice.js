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
                var el = parent.find('answer.selected');
                if(el.length) {
                    return [
                        parseInt(el.attr('answer-index'), 10)
                    ]
                }
                return [];
            },

            setAnswer: function(answer) {
                parent.find('answer').removeClass('selected');
                if(!isNaN(answer[0])) {
                    parent.find('answer[answer-index=' + answer[0] + ']').addClass('selected');
                }
            },


            checkAnswered: function(error_message) {
                var answered = !isNaN(this.getAnswer()[0]);
                if(!answered && Quiz.params.alert_if_no_answer) {
                    Quiz.common.toggleAlertMessage(parent, error_message, 'error');
                }
                return answered;
            },


            displayFeedback: function(feedback) {
                var correct = feedback.mistakes.length == 0;
                if((Quiz.params.show_solutions == 'all') || (Quiz.params.show_solutions == 'correct_only' && correct)) {
                    parent.find('solution').show();
                }
                parent.find('answer').removeClass('correct mistake');


                if(Quiz.params.feedback_on_correct_choices != 'none') {
                    answers.each(function(i) {
                        var answer = $(this);
                        var correct = feedback.correct_answer.indexOf(i) !== -1;

                        var display_for_all = Quiz.params.feedback_on_correct_choices == 'all' && correct;
                        var display_for_selected = answer.hasClass('selected') && correct;
                        if(display_for_all || display_for_selected) {
                            answer.addClass('correct');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'success'
                            );
                        }
                    });
                }

                if(Quiz.params.feedback_on_wrong_choices != 'none') {
                    var first_error = false;
                    answers.each(function(i) {
                        var answer = $(this);
                        var mistake = feedback.correct_answer.indexOf(i) === -1;
                        var selected = answer.hasClass('selected');
                        var wrong = (!mistake) == (!selected);
                        if(!wrong) {
                            return;
                        }

                        if(Quiz.params.feedback_on_wrong_choices == 'all' ||
                            (Quiz.params.feedback_on_wrong_choices == 'selected_only' && selected)) {
                            answer.addClass('mistake');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'error'
                            );
                        } else if(Quiz.params.feedback_on_wrong_choices == 'first_under_question') {
                            if(first_error !== false) {
                                return;
                            }
                            answer.addClass('mistake');
                            first_error = feedback.messages[i];
                        } else if(Quiz.params.feedback_on_wrong_choices == 'first_under_choice') {
                            if(first_error !== false) {
                                return;
                            }
                            first_error = true;
                            answer.addClass('mistake');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'error'
                            );
                        }
                    });
                    if(first_error !== false) {
                        Quiz.common.toggleAlertMessage(
                            parent,
                            first_error,
                            'error'
                        );
                    }
                }


            },

            toggleSolution: function(flag) {
                parent.find('solution').toggle(flag)
            },

            resetAnswer: function() {
                parent.find('answer').removeClass('selected');
            },

            resetFeedback: function() {
                parent.find('solution').hide();
                parent.find('.alert-message').remove();
                parent.find('answer').removeClass('correct mistake');
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
                answers.each(function(i, el) {
                    if($(el).hasClass('selected')) {
                        res.push(i);
                    }
                })
                return res;
            },

            setAnswer: function(values) {
                parent.find('answer').each(function(i) {
                    var el = $(this);
                    var idx = parseInt(el.attr('answer-index'), 10);
                    el.toggleClass('selected', values.indexOf(idx) !== -1);
                });
            },

            checkAnswered: function(error_message) {
                var answered = this.getAnswer().length > 0;
                if(!answered && Quiz.params.alert_if_no_answer) {
                    Quiz.common.toggleAlertMessage(parent, error_message, 'error');
                }
                return answered;
            },

            displayFeedback: function(feedback) {
                var correct = feedback.mistakes.length == 0;
                if((Quiz.params.show_solutions == 'all') || (Quiz.params.show_solutions == 'correct_only' && correct)) {
                    parent.find('solution').show();
                }

                parent.find('answer').removeClass('correct mistake');

                if(Quiz.params.feedback_on_correct_choices != 'none') {
                    answers.each(function(i) {
                        var answer = $(this);
                        var correct = feedback.correct_answer.indexOf(i) !== -1;

                        var display_for_all = Quiz.params.feedback_on_correct_choices == 'all' && correct;
                        var display_for_selected = answer.hasClass('selected') && correct;
                        if(display_for_all || display_for_selected) {
                            answer.addClass('correct');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'success'
                            );
                        }
                    });
                }

                if(Quiz.params.feedback_on_wrong_choices != 'none') {
                    var first_error = false;
                    answers.each(function(i) {
                        var answer = $(this);
                        var mistake = feedback.correct_answer.indexOf(i) === -1;
                        if(!mistake) {
                            return;
                        }

                        if(Quiz.params.feedback_on_wrong_choices == 'all' ||
                            Quiz.params.feedback_on_wrong_choices == 'selected_only' && answer.hasClass('selected')) {
                            answer.addClass('mistake');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'error'
                            );
                        } else if(Quiz.params.feedback_on_wrong_choices == 'first_under_question') {
                            if(first_error !== false) {
                                return;
                            }
                            answer.addClass('mistake');
                            first_error = feedback.messages[i];
                        } else if(Quiz.params.feedback_on_wrong_choices == 'first_under_choice') {
                            if(first_error !== false) {
                                return;
                            }
                            first_error = true;
                            answer.addClass('mistake');
                            Quiz.common.toggleAlertMessage(
                                answer,
                                feedback.messages[i],
                                'error'
                            );
                        }
                    });
                    if(first_error !== false) {
                        Quiz.common.toggleAlertMessage(
                            parent,
                            first_error,
                            'error'
                        );
                    }
                }
            },

            resetAnswer: function() {
                parent.find('answer').removeClass('selected');
            },

            resetFeedback: function() {
                parent.find('solution').hide();
                parent.find('.alert-message').remove();
                parent.find('answer').removeClass('correct mistake');
            },

            answers_order: answers_order
        }
    }

    Quiz.questionTypes.register('multiple', multipleChoice);
})();
