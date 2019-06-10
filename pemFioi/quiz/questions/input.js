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
                    var msg = answer.find('.error-message');
                    !valid && !msg.length && answer.append(
                        '<div class="error-message">' +
                        '<i class="fas fa-bell icon"></i>' +
                        lang.translate('error_' + format) +
                        '</div>'
                    );
                    valid && msg && msg.remove();
                });
            }
        }
        input.attr('placeholder', lang.translate('placeholder_' + format));
        answer.append(input);


        return {
            getAnswer: function() {
                return input.val();
            },

            setAnswer: function(value) {
                input.val(value)
            },

            showResult: function(mistakes) {
                answer.removeClass('correct mistake');
                answer.addClass(mistakes === null ? 'correct' : 'mistake');
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