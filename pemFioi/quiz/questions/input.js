(function() {

    function textInput(parent, question_idx, params) {
        var answer = parent.find('answer');
        var input = $('<input type="text"/>');

        var format = answer.attr('format') || 'text';
        var validator;
        if(format == 'string') {
            validator = '.+';
        } else if(format == 'number') {
            validator = '^-?[0-9]*\.?[0-9]*$';
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
                    Quiz.common.toggleWrongAnswerMessage(
                        parent,
                        valid ? false : lang.translate('error_' + format)
                    );
                });
            }
        }
        input.attr('placeholder', parent.attr('placeholder') || lang.translate('placeholder_' + format));
        answer.append(input);

        answer.wrapAll('<div class="answers"></div>');

        return {
            getAnswer: function() {
                return input.val();
            },

            setAnswer: function(value) {
                input.val(value)
            },

            isAnswered: function() {
                return this.getAnswer() !== '';
            },

            showResult: function(mistakes, message) {
                answer.removeClass('correct mistake');
                answer.addClass(mistakes === null ? 'correct' : 'mistake');
                Quiz.common.toggleWrongAnswerMessage(parent, message);
            },

            reset: function() {
                answer.removeClass('correct mistake');
                input.val('');
            },

            answers_order: [0]
        }
    }

    Quiz.questionTypes.register('input', textInput);

})();