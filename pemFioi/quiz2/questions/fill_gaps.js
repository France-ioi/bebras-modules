(function() {

    function fillGaps(parent, question_idx) {

        var uid = Math.random().toString(36).substr(2, 12);

        // take words from answers
        var words = [];
        var answers = parent.find('answer');
        answers.each(function() {
            words.push($(this).html().trim());
        });
        answers.remove();



        var toolbar = '<div class="fill-gaps-toolbar">';
        for(var i=0, word; word = words[i]; i++) {
            toolbar += '<span class="word">' + word + '</span>';
        }
        toolbar += '</div>';
        toolbar = $(toolbar);
        toolbar.insertAfter(parent.find('statement'));

        // drag & drop
        var words_order = {};
        toolbar.find('span').each(function(i) {
            var el = $(this), text = el.text();
            words_order[text] = i;
            el.draggable({
                scope: uid,
                scroll: false,
                revert: 'invalid',
                revertDuration: 200,
                zIndex: 100
            });
        });

        toolbar.droppable({
            scope: uid,
            drop: function(event, ui) {
                ui.draggable.detach().css({top: 0,left: 0}).appendTo(toolbar);
            }
        });

        var text = parent.find('.fill-gaps-text');
        text.find('.placeholder').each(function() {
            var placeholder = $(this)
            placeholder.html('');
            placeholder.droppable({
                scope: uid,
                hoverClass: 'placeholder-hover',
                drop: function(event, ui) {
                    toolbar.append(placeholder.find('span').first());
                    ui.draggable.detach().css({top: 0,left: 0}).appendTo(placeholder);
                }
            });
        });


        function resetWords() {
            var placeholders = text.find('.placeholder');
            placeholders.removeClass('correct mistake');

            // move words back to tollbar
            placeholders.each(function() {
                var placeholder = $(this);
                var span = placeholder.find('span').first();
                toolbar.append(span);
            });

            // sort words
            var words = toolbar.find('span');
            words.detach();
            words.sort(function(a, b) {
                return words_order[a.innerHTML] > words_order[b.innerHTML];
            });
            toolbar.append(words);
        }


        function getWordFromToolbar(text) {
            var res;
            toolbar.find('span').each(function() {
                var el = $(this);
                if(el.text() === text) {
                    res = el;
                    return false;
                }
            })
            return res;
        }


        return {
            getAnswer: function() {
                var res = [];
                text.find('.placeholder').each(function() {
                    var span = $(this).find('span').first();
                    res.push(span.text())
                });
                return res;
            },

            setAnswer: function(answer) {
                resetWords();
                var placeholders = text.find('.placeholder');
                placeholders.each(function(i) {
                    var placeholder = $(this);
                    if(answer[i]) {
                        var el = getWordFromToolbar(answer[i]);
                        if(el) {
                            placeholder.append(el);
                        }
                    }
                });
            },

            checkAnswered: function(error_message) {
                var answered = false;
                text.find('.placeholder').each(function() {
                    var span = $(this).find('span').first();
                    if(span.text() !== '') {
                        answered = true;
                    }
                });
                if(!answered && Quiz.params.alert_if_no_answer) {
                    Quiz.common.toggleAlertMessage(parent, error_message, 'error');
                }
                return answered;
            },


            displayFeedback: function(feedback) {
                feedback.partial && Quiz.common.toggleAlertMessage(parent, lang.translate("wrong_partial"), 'error');

                var correct = feedback.mistakes.length == 0;
                if((Quiz.params.show_solutions == 'all') || (Quiz.params.show_solutions == 'correct_only' && correct)) {
                    parent.find('solution').show();
                }

                var placeholders = text.find('.placeholder');
                placeholders.removeClass('correct mistake');

                var first_mistake_marked = false;
                placeholders.each(function(i) {
                    var placeholder = $(this);
                    var span = placeholder.find('span').first();
                    var text = span.length ? span.text() : null;
                    var mistake = text != '' && feedback.mistakes[i] === text;
                    if(mistake) {
                        if(Quiz.params.feedback_on_wrong_choices == 'first_under_question' || Quiz.params.feedback_on_wrong_choices == 'first_under_choice') {
                            !first_mistake_marked && placeholder.addClass('mistake');
                            first_mistake_marked = true;
                        } else if(Quiz.params.feedback_on_wrong_choices != 'none') {
                            placeholder.addClass('mistake');
                        }
                    } else {
                        if(Quiz.params.feedback_on_correct_choices != 'none') {
                            placeholder.addClass('correct');
                        }
                    }
                });
            },

            resetAnswer: function() {
                resetWords();
            },

            resetFeedback: function() {
                text.find('.placeholder').removeClass('correct mistake');
                parent.find('solution').hide();
                parent.find('.alert-message').remove();
            },

            answers_order: [0]
        }

    }

    Quiz.questionTypes.register('fill_gaps', fillGaps);

})();
