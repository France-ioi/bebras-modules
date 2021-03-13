(function() {

    function formatAnswer(answer, format) {
        if(format == 'number') {
           try {
               answer = parseFloat(answer.replace(',', '.'));
            } catch(e) {}
        }
        return answer;
    };

    function textInput(parent, question_idx, params) {
        var answer = parent.find('answer');
        var input = $('<input type="text"/>');

        var format = answer.attr('format') || 'text';
        var validator;
        if(format == 'string') {
            validator = '.+';
        } else if(format == 'number') {
            validator = '^-?[0-9]*[,.]?[0-9]*$';
        } else if(format == 'regexp') {
            validator = answer.attr('validator');
            var code = 'validator = ' + validator;
            try {
                validator = eval(code);
            } catch(e) {}
        }
        if(validator) {
            var reg = new RegExp(validator);
            if(typeof reg === 'object' && 'test' in reg) {
                input.on('change blur', function() {
                    answer.removeClass('mistake');
                    var el = $(this);
                    var valid = reg.test(el.val());
                    input.toggleClass('error', !valid);
                    Quiz.common.toggleAlertMessage(
                        parent,
                        valid ? false : lang.translate('error_' + format),
                        'error'
                    );
                });
            }
        }
        input.attr('placeholder', lang.translate('placeholder_' + format));
        answer.append(input);

        answer.wrapAll('<div class="answers"></div>');

        return {
            getAnswer: function() {
                return [
                    formatAnswer(input.val(), format)
                ];
            },

            setAnswer: function(answer) {
                input.val(answer[0])
            },

            checkAnswered: function(error_message) {
                var answered = this.getAnswer()[0] != '';
                if(!answered && Quiz.params.alert_if_no_answer) {
                    Quiz.common.toggleAlertMessage(answer, error_message, 'error');
                }
                return answered;
            },


            displayFeedback: function(feedback) {
                var correct = feedback.mistakes.length == 0;
                if((Quiz.params.show_solutions == 'all') || (Quiz.params.show_solutions == 'correct_only' && correct)) {
                    parent.find('solution').show();
                }

                answer.removeClass('correct mistake');

                if(correct) {
                    if(Quiz.params.feedback_on_correct_choices != 'none') {
                        answer.addClass('correct');
                    }
                } else {
                    if(Quiz.params.feedback_on_wrong_choices != 'none') {
                        answer.addClass('mistake');
                        Quiz.common.toggleAlertMessage(
                            answer,
                            feedback.messages[0],
                            'error'
                        );
                    }
                }
            },

            resetAnswer: function() {
                input.val('');
            },

            resetFeedback: function() {
                answer.removeClass('correct mistake');
                parent.find('solution').hide();
                parent.find('.alert-message').remove();
            },

            answers_order: [0]
        }
    }

    Quiz.questionTypes.register('input', textInput);

})();
