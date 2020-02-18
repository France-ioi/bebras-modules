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
        var words_elements = {};
        var words_order = {};
        toolbar.find('span').each(function(i) {
            var el = $(this), text = el.text();
            words_elements[text] = el;
            words_order[text] = i;
            el.draggable({
                scope: uid,
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


        return {
            getAnswer: function() {
                var res = [];
                text.find('.placeholder').each(function() {
                    var span = $(this).find('span').first();
                    res.push(span.text())
                });
                return res;
            },

            setAnswer: function(value) {
                resetWords();
                var placeholders = text.find('.placeholder');
                placeholders.each(function(i) {
                    var placeholder = $(this);
                    if(value[i]) {
                        placeholder.append(words_elements[value[i]])
                    }
                });
            },

            isAnswered: function() {
                return true;
            },

            showResult: function(mistakes, message) {
                var placeholders = text.find('.placeholder');
                placeholders.removeClass('correct mistake');
                if(!Quiz.params.display_partial_feedback && !Quiz.params.display_detailed_feedback) return;
                var mistakes_cnt = 0;
                placeholders.each(function() {
                    var placeholder = $(this);
                    var span = placeholder.find('span').first();
                    var text = span.length ? span.text() : null;
                    var mistake = !text || mistakes.indexOf(text) !== -1;
                    if(mistake) {
                        mistakes_cnt++;
                    }
                    placeholder.addClass(mistake ? 'mistake' : 'correct');
                });
                Quiz.common.toggleWrongAnswerMessage(
                    parent,
                    mistakes_cnt ? lang.translate('wrong_fill_gaps_msg', mistakes_cnt) : false
                );
            },

            reset: function() {
                resetWords();
            },

            answers_order: [0]
        }

    }

    Quiz.questionTypes.register('fill_gaps', fillGaps);

})();
