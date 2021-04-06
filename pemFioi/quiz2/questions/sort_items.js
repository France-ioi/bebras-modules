(function() {

    function sort_items(parent, question_idx) {
        var srcCont = parent.find('.src');
        srcCont.addClass('list-group');
        srcCont.children().each(function(index){
            $(this).attr('item_id',index);
            $(this).addClass('list-group-item');
        });

        new Sortable(srcCont[0], {
            group: {
                name: 'shared'
            },
            animation: 150,
            ghostClass: 'lightgrey-background-class'
        });

        var dest = parent.find('.dest').children();
        var nbDest = dest.length;
        dest.each(function(index) {
            $(this).addClass('cont');
            var destCont = $(this).find('.list-group')
            new Sortable(destCont[0], {
                group: {
                    name: 'shared'
                },
                animation: 150,
                ghostClass: 'lightgrey-background-class'
            });
        });

        var initialDestContent = getDestContent();
        var initialSrcContent = getSrcContent();

        function getDestContent() {
            var content = [];
            var dest = parent.find('.dest').children();
            dest.each(function(destIndex) {
                content[destIndex] = [];
                var destList = $(this).find('.list-group').children();
                destList.each(function(itemIndex){
                    content[destIndex][itemIndex] = parseInt($(this).attr('item_id'),10);
                });    
            });
            return content;
        };

        function getSrcContent() {
            var content = [];
            var srcCont = parent.find('.src');
            var srcList = srcCont.children();
            srcList.each(function(index) {
                content[index] = parseInt($(this).attr('item_id'),10);
            });
            return content
        };

        return {
            getAnswer: function() {
                var res = getDestContent();
                return res;
            },

            checkAnswered: function(error_message) {
                var answered = true;
                var srcCont = getSrcContent();
                if(srcCont.length == initialSrcContent.length){
                    answered = false;
                }

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
                for(var itemID of initialSrcContent){
                    var elem = parent.find('[item_id='+itemID+']');
                    var cont = parent.find('.src');
                    cont.append(elem);
                }
            },

            resetFeedback: function() {
                parent.find('.alert-message').remove();
            }
        }

    }

    Quiz.questionTypes.register('sort_items', sort_items);

})();
