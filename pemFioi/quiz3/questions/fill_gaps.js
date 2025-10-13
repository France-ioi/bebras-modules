(function() {

    function fillGaps(parent, question_idx) {
        // take words from answers
        var words = [];
        var answers = parent.find('answer');
        answers.each(function() {
            words.push($(this).html().trim());
        });
        answers.remove();



        var toolbar = '<div class="fill-gaps-toolbar"><div class="fill-gaps-words">';
        for(var i=0, word; word = words[i]; i++) {
            toolbar += '<div class="word">' + word + '</div>';
        }
        toolbar += '</div></div>';
        toolbar = $(toolbar);
        toolbar.insertAfter(parent.find('statement'));

        var wordsContainer = toolbar.find('.fill-gaps-words');

        // drag & drop
        var words_order = {};
        wordsContainer.find('.word').each(function(i) {
            var el = $(this), text = el.text();
            words_order[text] = i;

            this.dragData = {
                x: 0,
                y: 0
            };
        });

        interact('.word').draggable({
            listeners: {
                move(event) {
                    event.target.dragData = {
                        x: event.target.dragData.x + event.dx,
                        y: event.target.dragData.y + event.dy
                    };

                    event.target.style.transform = `translate(${event.target.dragData.x}px, ${event.target.dragData.y}px)`;
                },
                end(event) {
                    if (!event.dropzone) {
                        event.target.dragData.x = 0;
                        event.target.dragData.y = 0;
                        event.target.style.transition = 'transform 0.2s ease-out';
                        event.target.style.transform = 'translate(0, 0)';
                        setTimeout(function () {
                            event.target.style.transition = '';
                            event.target.style.transform = '';
                        }, 200);
                    }
                }
            }
        });

        interact(toolbar[0])
            .dropzone({
                ondrop: function (event) {
                    event.relatedTarget.dragData.x = 0;
                    event.relatedTarget.dragData.y = 0;
                    if (!$(event.relatedTarget).parents('.fill-gaps-words').length) {
                        wordsContainer.append(event.relatedTarget);
                        event.relatedTarget.style.transform = '';
                    } else {
                        event.relatedTarget.style.transition = 'transform 0.2s ease-out';
                        event.relatedTarget.style.transform = 'translate(0, 0)';
                        setTimeout(function () {
                            event.relatedTarget.style.transition = '';
                            event.relatedTarget.style.transform = '';
                        }, 200);
                    }
                }
            })
            .on('dropactivate', function (event) {
                event.target.classList.add('drop-activated')
            });

        var text = parent.find('.fill-gaps-text');
        text.find('.placeholder').each(function() {
            var placeholder = $(this)
            placeholder.html('');

            interact(placeholder[0])
                .dropzone({
                    overlap: 0.25,
                    checker(dropEvent, event, dropped) {
                        var clientX = dropEvent.clientX;
                        var clientY = dropEvent.clientY;
                        var toolbarBoundingBox = toolbar[0].getBoundingClientRect();

                        return dropped && !(clientX >= toolbarBoundingBox.left &&
                            clientX <= toolbarBoundingBox.right &&
                            clientY >= toolbarBoundingBox.top &&
                            clientY <= toolbarBoundingBox.bottom);
                    },
                    ondrop: function (event) {
                        wordsContainer.append(placeholder.find('.word').first());
                        placeholder.append(event.relatedTarget);
                        event.target.classList.remove('placeholder-hover')
                        event.relatedTarget.dragData.x = 0;
                        event.relatedTarget.dragData.y = 0;
                        event.relatedTarget.style.transform = '';
                    },
                    ondragenter(event) {
                        event.target.classList.add('placeholder-hover')
                    },
                    ondragleave(event) {
                        event.target.classList.remove('placeholder-hover')
                    }
                });
        });


        function resetWords() {
            var placeholders = text.find('.placeholder');
            placeholders.removeClass('correct mistake');

            // move words back to toolbar
            placeholders.each(function() {
                var placeholder = $(this);
                var word = placeholder.find('.word').first();
                wordsContainer.append(word);
            });

            // sort words
            var words = toolbar.find('.word');
            words.detach();
            words.sort(function(a, b) {
                return words_order[a.innerHTML] > words_order[b.innerHTML];
            });
            wordsContainer.append(words);
        }


        function getWordFromToolbar(text) {
            var res;
            wordsContainer.find('.word').each(function() {
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
                    var word = $(this).find('.word').first();
                    res.push(word.text())
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
                    var word = $(this).find('.word').first();
                    if(word.text() !== '') {
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
                    var word = placeholder.find('.word').first();
                    var text = word.length ? word.text() : null;
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
