(function() {

    function sort_list(parent, question_idx) {
        var listCont = parent.find('.list-group');
        var initialList = listCont.children();
        var initialOrder = [];
        initialList.each(function(index){
            $(this).attr('item_id',index);
            $(this).addClass('list-group-item');
            initialOrder[index] = index;
        });

        new Sortable(listCont[0], {
            animation: 150,
            ghostClass: 'lightgrey-background-class'
        });

        return {
            getAnswer: function() {
                var res = [];
                var list = parent.find('.list-group').children();
                list.each(function(index){
                    res[index] = parseInt($(this).attr('item_id'),10);
                });
                return res;
            },

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
                feedback.partial && Quiz.common.toggleAlertMessage(parent, lang.translate("wrong_partial"), 'error');

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
            }
        }

    }

    Quiz.questionTypes.register('sort_list', sort_list);

})();
