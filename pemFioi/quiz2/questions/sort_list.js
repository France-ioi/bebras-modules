(function() {

    function sort_list(parent, question_idx) {
        new Sortable(list_cont, {
            animation: 150,
            ghostClass: 'lightgrey-background-class'
        });

        var initialOrder = [];
        var initialList = parent.find('.list-group').children();
        initialList.each(function(index){
            initialOrder[index] = $(this).attr('item_id');
        });

        return {
            getAnswer: function() {
                var res = [];
                var list = parent.find('.list-group').children();
                list.each(function(index){
                    res[index] = $(this).attr('item_id');
                });
                return res;
            },

            // setAnswer: function(answer) {
            //     resetWords();
            //     var placeholders = text.find('.placeholder');
            //     placeholders.each(function(i) {
            //         var placeholder = $(this);
            //         if(answer[i]) {
            //             var el = getWordFromToolbar(answer[i]);
            //             if(el) {
            //                 placeholder.append(el);
            //             }
            //         }
            //     });
            // },

            checkAnswered: function(error_message) {
                var answered = false;
                var list = parent.find('.list-group').children();
                list.each(function(index){
                    var val = $(this).attr('item_id');
                    if(val != initialOrder[index]){
                        answered = true;
                    }
                });

                if(!answered && Quiz.params.alert_if_no_answer) {
                    Quiz.common.toggleAlertMessage(parent, error_message, 'error');
                }
                return answered;
            },


            displayFeedback: function(feedback) {
                var validAnswer = true;
                for(var mist of feedback.mistakes){
                    if(mist != null){
                        validAnswer = false;
                    }
                }
                if(!validAnswer && Quiz.params.feedback_on_wrong_choices != 'none') {
                    Quiz.common.toggleAlertMessage(
                        parent,
                        feedback.messages[0],
                        'error'
                    );
                }else if(validAnswer && Quiz.params.feedback_on_correct_choices != 'none') {
                    Quiz.common.toggleAlertMessage(
                        parent,
                        feedback.messages[1],
                        'success'
                    );
                }
            },

            resetAnswer: function() {
                for(var itemID of initialOrder){
                    var elem = parent.find('[item_id='+itemID+']');
                    var cont = parent.find('.list-group');
                    cont.append(elem);
                }
            },

            resetFeedback: function() {
                parent.find('.alert-message').remove();
            },

            // answers_order: [0]
        }

    }

    Quiz.questionTypes.register('sort_list', sort_list);

})();
