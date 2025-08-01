Quiz = {
    grader: {}
}


Quiz.common = {

    error: function(msg) {
        console.error('Quiz error: ' + msg);
    },

    shuffleArray: function(a) {
        var j, x, i, r;
        for(i = a.length - 1; i > 0; i--) {
            r = 0.5 * (1 + Math.sin(i + Quiz.params.random));
            j = Math.floor(r * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },

    shuffleElements: function(elements, shuffle) {
        var order = [];
        if(!elements.length) {
            return order;
        }
        for(var i=0; i<elements.length; i++) {
            order[i] = i;
        }
        if(!shuffle) {
            return order;
        }
        order = this.shuffleArray(order);
        var parent = $(elements[0]).parent();
        for(var i=0; i<elements.length; i++) {
            parent.append($(elements[order[i]]));
        }
        return order;
    },

    questionLabel: function(idx) {
        return String.fromCharCode(idx + 65);
    },


    toggleAlertMessage: function(parent, msg, type, whole_question) {
        var el = parent.find('.error-message');
        el.remove();
        if(!msg) { return; }

        var html = '<div class="alert-message ' + type + '-message">' +
            '<i class="fas fa-bell icon"></i>' + msg +
            '</div>';
        if(!whole_question && parent.parents("question.horizontal").length) {
            parent.find('.answer-code').before(html);
        } else {
            parent.append(html);
        }
    }
}


Quiz.versions = {

    data: {},

    init: function(params) {
        var self = this;
        $('question-group').each(function(i, question_set) {
            question_set = $(question_set);
            var questions = question_set.find('question');
            self.data[i] = (i + params.random) % questions.length;
            questions.each(function(j, question) {
                if(j == self.data[i]) {
                    $(question).insertAfter(question_set);
                } else {
                    $(question).remove();
                }
            });
            question_set.remove();
        });
    },


    get: function() {
        return this.data;
    }

}



Quiz.questionTypes = {

    types: {},

    register: function(type, func) {
        this.types[type] = func;
    },

    create: function(type, parent, question_idx, params) {
        if(this.types[type]) {
            return this.types[type](parent, question_idx, params);
        } else {
            Quiz.common.error('Unsupported question type ' + type);
        }
    }
}



Quiz.UI = function(params) {
    Quiz.submittingSingle = null;

    var questions_order = [];

    // prepare params
    var default_params = {
        shuffle_questions: false,
        shuffle_answers: false,
        feedback_score: "exact", // none | binary | exact
        feedback_on_wrong_choices: "first_under_question", // none | first_under_question | first_under_choice | selected_only | all
        feedback_on_correct_choices: "all", //  none | selected_only | all
        show_solutions: "all", // none | correct_only | all
        alert_if_no_answer: true, // bool
        keypad_input_only: false, // bool, if true, only keypad input is allowed for number inputs
        save_only_mode: false // bool, if true, behave as a task which only saves the answer and gives 100
    }
    var params = Object.assign(default_params, params);

    // save only mode
    if (params.save_only_mode) {
        params.feedback_score = "saved";
        params.feedback_on_wrong_choices = "none";
        params.feedback_on_correct_choices = "none";
        params.show_solutions = "none";
    }

    Quiz.params = params;
    //console.log('Quiz.params', Quiz.params)

    if(!params.parent) {
        Quiz.common.error('Parent element not specified');
        return false;
    }

    // init versions
    Quiz.versions.init(params);

    Quiz.sidecontent.init(params);



    // questions types
    function initAnswers(parent) {
        parent.find('answer').click(function() {
            $(this).addClass('selected');
        })
    }


    // init questions
    var els = params.parent.find('question');
    var questions = [];
    els.each(function(i, el) {
        el = $(el)
        var type = el.attr('type') || 'single';
        questions[i] = Quiz.questionTypes.create(type, el, i, params);
    });
    questions_order = Quiz.common.shuffleElements(els, params.shuffle_questions);
    if (params.submit_single) {
        $('question').each(function (i, el) {
            el = $(el);
            el.append('<p style="text-align: center;"><button class="btn btn-success submit-single" type="button">Check this question</button></p>');
            el.find('.submit-single').click(function () {
                Quiz.submittingSingle = i;
                task.getAnswer(function (answer) {
                    task.gradeAnswer(answer, null, function () { });
                });
            });
        });
    }


    // toggle questions numeration
    $('.taskContent').toggleClass('questions-numeration-enabled', questions.length > 1);


    // replace refs in solution with real answer and qustion numbers/labels
    function realQuestionNumber(question_idx) {
        var idx = questions_order.indexOf(question_idx);
        if(idx > -1) {
            return idx + 1;
        } else {
            console.error("Could not find question index " + question_idx + ".");
            return '';
        }
    }

    function realAnswerNumber(question_idx, answer_idx) {
        if(questions[question_idx] && questions[question_idx].answers_order) {
            var idx = questions[question_idx].answers_order.indexOf(question_idx);
            if(idx !== -1) {
                return Quiz.common.questionLabel(idx);
            }
            console.error("Could not find answer index " + answer_idx + " in question " + question_idx + ".");
        } else {
            console.error("Could not find question index " + question_idx + ".");
        }

        return '';
    }

    $('#solution').find('ref').each(function() {
        var el = $(this);
        var nq = el.attr('question');
        if(typeof nq === 'undefined') {
            return;
        }
        nq = parseInt(nq, 10) - 1;
        var na = el.attr('answer');
        if(typeof na !== 'undefined') {
            na = parseInt(na, 10) - 1;
            var text = realAnswerNumber(nq, na);
        } else {
            var text = realQuestionNumber(nq);
        }
        el.text(text);
    });



    // sys
    function useFullWidth() {
        // From buttonsAndMessages
        try {
            $('#question-iframe', window.parent.document).css('width', '100%');
            $('body').css('width', '100%');
        } catch(e) {
        }
    }
    FontsLoader.loadFonts(['fontawesome', 'titillium-web']);
    useFullWidth();
    params.parent.show();

    function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(window.location.toString());
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    if(getParameterByName('theme') == 'coursera') {
       $('body').addClass('coursera');
       FontsLoader.loadFonts(['source-sans-pro']);
    }


    // interface

    return {
        getAnswer: function() {
            var res = [];
            for(var i=0; i<questions.length; i++) {
                res.push(questions[i].getAnswer());
            }
            return res;
        },

        setAnswer: function(answer) {
            for(var i=0; i<questions.length; i++) {
                questions[i].setAnswer(answer[i]);
            }
        },

        toggleFeedback: function(visible) {
            $('#task').toggleClass('displayFeedback', visible);
        },

        toggleSolutions: function(visible) {
            $('#solution').toggle(visible);
            $('#task').toggleClass('displaySolution', visible);
        },

        displayFeedback: function(feedback) {
            for(var i=0; i<feedback.length; i++) {
                if (Quiz.submittingSingle !== null && Quiz.submittingSingle !== i) {
                    continue;
                }
                if(!questions[i].checkAnswered(lang.translate('wrong_answer_msg_not_answered'))) {
                    continue;
                }
                questions[i].displayFeedback(feedback[i]);
                if (Quiz.submittingSingle !== null) {
                    var questionEl = $($('question')[i]);
                    questionEl.find('.error-message, .success-message').remove();
                    if (feedback[i].score == 1) {
                        Quiz.common.toggleAlertMessage(questionEl, "Correct answer!", 'success');
                    } else {
                        Quiz.common.toggleAlertMessage(questionEl, "Wrong answer.", 'error');
                    }
                }
            }
            this.toggleFeedback(true);
            Quiz.submittingSingle = null;
        },

        displayOverallFeedback: function (feedback) {
            if (!feedback) { return; }
            $('.taskContent').append('<div class="alert-message feedback-message"><i class="fas fa-clipboard-list icon"></i> ' + feedback + '</div>');
        },

        getSubmittingSingle: function () {
            return Quiz.submittingSingle;
        },

        reset: function(from_scratch) {
            for(var i=0; i<questions.length; i++) {
                questions[i].resetFeedback();
                if(from_scratch) {
                    questions[i].resetAnswer();
                }
            }
        },


        getQuestionsInfo: function() {
            var res = [];
            for(var i=0; i<questions.length; i++) {
                res[i] = {
                    answers_amount: 'answers_order' in questions[i] ? questions[i].answers_order.length : 0
                }
            }  
            return res;
        }

    }
}


// manage the side content and its separator
Quiz.sidecontent = {
    current: 1,
    isSmall: false,

    init: function (params) {
        if (!params.sideurl) {
            return;
        }

        var that = this;

        $('body').addClass('sidecontent');
        $(window).on('resize', this.onResize.bind(this));

        $(`<div id="sidecontent-buttons">
            <div id="sidecontent-left" onclick="Quiz.sidecontent.moveLeft()"><span class="fas fa-chevron-left"></span></div>
            <div id="sidecontent-right" onclick="Quiz.sidecontent.moveRight()"><span class="fas fa-chevron-right"></span></div>
        </div>
        <div id="sidecontent-separator"></div>
        <div id="sidecontent-container">
        <div id="sidecontent">
            <iframe id="sidecontent-iframe" width="100%" height="100%" src="" frameborder="0" scrolling="yes"></iframe>
        </div></div>`).appendTo('body');
        $('#task').appendTo('#sidecontent-container');
        var sideUrl = params.sideurl;
        // add a ranhom parameter to the URL to prevent caching
        if (sideUrl.indexOf('?') === -1) {
            sideUrl += '?';
        }
        sideUrl += '&random=' + (new Date()).getTime();
        $('#sidecontent-iframe').attr('src', sideUrl);

        setTimeout(function () {
            that.onResize();
        }, 10);
    },

    onResize: function () {
        this.updateHalves();
        this.updateSeparator();
    },

    updateHalves: function () {
        var widthAvailable = $('body').width() - 32;
        $('#sidecontent').show();
        $('#task').show();
        if (this.current == 1 && !this.isSmall) {
            $('#sidecontent').css('width', widthAvailable * this.current / 2);
            $('#task').css('width', widthAvailable * (2 - this.current) / 2);
            $('#sidecontent-container').css('justify-content', 'space-between');
        } else if (this.current == 0) {
            $('#sidecontent').hide();
            $('#task').css('width', widthAvailable);
            $('#sidecontent-container').css('justify-content', 'flex-end');
        } else {
            $('#sidecontent').css('width', widthAvailable);
            $('#task').hide();
            $('#sidecontent-container').css('justify-content', 'flex-start');
        }
    },

    updateSeparator: function () {
        var current = this.current;
        if (current == 1 && this.isSmall) { current = 2; }
        var widthAvailable = $('body').width() - 32;
        var separatorPos = (widthAvailable * current / 2) + 8;
        $('#sidecontent-separator').css('left', separatorPos);
        $('#sidecontent-buttons').css('left', separatorPos - 16);
    },

    onResize: function () {
        this.isSmall = $('body').width() < 700;
        this.updateHalves();
        this.updateSeparator();
    },

    moveLeft: function () {
        if (this.current > 0) {
            this.current--;
            if (this.isSmall) {
                this.current = 0;
            }
            this.updateHalves();
            this.updateSeparator();
        }
    },

    moveRight: function () {
        if (this.current < 2) {
            this.current++;
            if (this.isSmall) {
                this.current = 2;
            }
            this.updateHalves();
            this.updateSeparator();
        }
    }
}