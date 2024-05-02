(function() {

    window.lang = {

        default_language: 'en',
        language: 'en',
        language_set: false,
        sublanguage: null,

        strings: {
            en: {
                'score': 'Score',
                'grader_msg': 'Your score is ',
                'wrong_answer_msg': 'You have at least one mistake.',
                'wrong_answer_msg_partial_feedback': 'You have at least one mistake. Here is a hint:',
                'wrong_answer_msg_not_answered': 'You didn\'t answer this question',
                'wrong_fill_gaps_msg': 'You have %% incorrect answers for this question, highlighted in red.',
                'validate': 'Submit',
                'solution': 'Show answer',
                'restart': 'Restart',
                'restart_scratch': 'Restart from scratch',
                'restart_current': 'Restart from current answer',
                'return_to_top': 'Return to the list of questions',
                'move_to_next': 'Next question',
                'placeholder_text': 'Enter text',
                'placeholder_number': 'Enter number',
                'error_number': 'Must be a number',
                'placeholder_string': 'Enter string',
                'error_string': 'Must be a string',
                'placeholder_regexp': 'Enter text',
                'error_regexp': 'Invalid format',
                'error_grading': 'There was an error while submitting this answer, please try again in a few minutes.',
                'feedback_score_binary_correct': 'Congratulations, everything is correct.',
                'feedback_score_binary_mistake': 'There is at least one mistake.',
                'feedback_answer_saved': 'Your answer has been saved.'
            },
            fr: {
                'score': 'Score',
                'grader_msg': 'Votre score est ',
                'wrong_answer_msg': 'Vous avez au moins une erreur.',
                'wrong_answer_msg_partial_feedback': 'Vous avez au moins une erreur. Voici un indice :',
                'wrong_answer_msg_not_answered': "Vous n'avez pas répondu à cette question.",
                'wrong_fill_gaps_msg': 'Vous avez %% réponses incorrectes pour cette question, surlignées en rouge.',
                'wrong_partial': "Vous n'avez pas répondu entièrement à cette question.",
                'validate': 'Valider',
                'solution': 'Voir la réponse',
                'restart': 'Recommencer',
                'restart_scratch': 'Recommencer au début',
                'restart_current': 'Modifier ma réponse',
                'return_to_top': 'Retour à la liste des questions',
                'move_to_next': 'Question suivante',
                'cancel' : 'Annuler',
                'placeholder_text': 'Entrez du texte',
                'placeholder_number': 'Entrez un nombre',
                'error_number': 'Vous devez entrer un nombre.',
                'placeholder_string': 'Entrez une chaîne de caractères',
                'error_string': 'Vous devez entrer une chaïne de caractères',
                'placeholder_regexp': 'Entrez du texte.',
                'error_regexp': 'Format invalide',
                'error_grading': 'Erreur lors de la soumission, veuillez réessayer dans quelques minutes.',
                'feedback_score_binary_correct': 'Félicitations, tout est correct.',
                'feedback_score_binary_mistake': 'Il y a au moins une erreur.',
                'feedback_answer_saved': 'Votre réponse a été enregistrée.'
            },
        },

        substrings: {
            hint: {
                en: {
                    'solution': 'Show hint'
                },
                fr: {
                    'solution': 'Afficher un indice'
                }
            }
        },

        set: function(lng) {
            if(!lng) {
                lng = window.stringsLanguage;
            }
            this.language = lng;
            this.language_set = true;
        },

        setSublanguage: function (sublng) {
            this.sublanguage = sublng;
        },

        translate: function() {
            if(!this.language_set) {
                this.set();
            }
            var str = '', key = arguments[0];
            if (this.sublanguage && this.substrings[this.sublanguage] && this.substrings[this.sublanguage][this.language]) {
                str = this.substrings[this.sublanguage][this.language][key];
            }
            if (!str && this.strings[this.language]) {
                str = this.strings[this.language][key];
            }
            if (!str) {
                str = this.strings[this.default_language][key] || key;
            }
            return str.replace('%%', arguments[1]);
        }
    }


    var task_toolbar = {

        buttons: {},
        holder: false,
        popup: false,
        validated: false,

        addButton: function(parent, name, callback) {
            var btn = $('<button class="btn btn-success">' + lang.translate(name) + '</button>');
            btn.on('click', callback);
            parent.append(btn);
            this.buttons[name] = btn;
        },


        restartTask: function(from_scratch) {
            this.setValidated(false);
            this.popup.hide();
            this.unfreezeTask();
            window.quiz_ui.toggleFeedback(false);
            task.showViews({"task": true, "solution": false}, function(){});
            window.quiz_ui.reset(from_scratch);
        },

        showPopup: function() {
            if(!this.popup) {
                this.popup = $(
                    '<div class="quiz-popup-inner"><div class="content"></div></div>\
                    <div class="quiz-popup">\
                        <div class="opacity-overlay"></div>\
                    </div>'
                );
                $(document.body).append(this.popup);
                var el = this.popup.find('.content');
                var self = this;
                this.addButton(el, 'restart_scratch', function() {
                    self.restartTask(true);
                });
                this.addButton(el, 'restart_current', function() {
                    self.restartTask();
                });
                this.addButton(el, 'cancel', function() {
                    self.popup.hide();
                });
            }
            $('.quiz-popup-inner').css('top', (Math.max(0, $('.quiz-toolbar').offset().top - 140)) + 'px')
            this.popup.show();
        },


        freezeTask: function() {
            if(!this.freezer) {
                this.freezer = $('<div class="freeze-overlay"></div>')
                $('.taskContent').append(this.freezer);
            }
            this.freezer.show();
        },


        unfreezeTask: function() {
            this.freezer && this.freezer.hide();
        },


        setValidated: function(validated) {
            this.validated = !!validated;
            if(validated) {
                this.buttons.validate.hide();
                this.buttons.move_to_next && this.buttons.move_to_next.show();
                this.buttons.solution && this.buttons.solution.show();
            } else {
                this.buttons.validate.show();
                this.buttons.move_to_next && this.buttons.move_to_next.hide();
                this.buttons.solution && this.buttons.solution.hide();
            }
        },


        displayError: function(error) {
            if(!this.errorHolder) {
                this.errorHolder = $('<div class="error-message"></div>');
                this.holder.append('<br>');
                this.holder.append(this.errorHolder);
            }
            this.errorHolder.html('<i class="fas fa-bell icon"></i> ' + error);
            this.errorHolder.toggle(!!error);
        },


        init: function() {
            if(this.holder) return;
            $('#showSolutionButton').remove();
            $('.quiz-toolbar').remove();
            if (quiz_settings.sublanguage) {
                lang.setSublanguage(quiz_settings.sublanguage);
            }
            this.holder = $('<div class="quiz-toolbar"></div>');
            var self = this;
            this.addButton(this.holder, 'validate', function () {
                self.freezeTask();
                self.setValidated(true);
                platform.validate('done');
            });
            var hasSolution = false;
            $('solution, .solution, #solution').each(function() {
               if($(this).text().trim() != '') { hasSolution = true; }
            });
            if (hasSolution && window.miniPlatformShowSolution) {
                this.addButton(this.holder, 'solution', function() {
                    miniPlatformShowSolution();
                });
                this.buttons.solution.hide();
            }
            if(!quiz_settings.hide_restart) {
                this.addButton(this.holder, 'restart', function() {
                    self.showPopup();
                });
            }
            if(quiz_settings.display_move_to_next) {
                this.addButton(this.holder, 'move_to_next', function() {
                    platform.validate('next');
                });
                this.buttons.move_to_next.hide();
            }
            if(quiz_settings.display_return_to_top) {
                this.holder.append('<br><br>');
                this.addButton(this.holder, 'return_to_top', function() {
                    platform.validate('top');
                });
            }
            this.holder.insertAfter($('.taskContent'));
        }

    }


    var task_token = {

        token: null,

        init: function() {
            var query = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            this.token = this.token || query.sToken;
        },

        get: function() {
            return this.token
        },

        update: function(token) {
            this.token = token
        },

        getAnswerToken: function(answer) {
            return null;
        }
    }



    window.task = {}

    task.getViews = function(success, error) {
        var views = {
            task: {}
        };
        success(views);
    };

    task.updateToken = function(token, success, error) {
        task_token.update(token)
        success();
    };

    task.getHeight = function(success, error) {
        var d = document;
        var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
        success(h);
    };

    task.getMetaData = function(success, error) {
        var metadata = {
            disablePlatformProgress: true,
            minWidth: 'auto',
            nbHints: 0,
            usesTokens: true
        };
        if (typeof json !== 'undefined') {
            Object.assign(metadata, json);
        }
        success(metadata);
    };

    task.reloadState = function(state, success, error) { success() }
    task.getState = function(success, error) { success("{}")  }
    task.reloadStateObject = function(obj) { }
    task.getStateObject = function() { return {} }
    task.getDefaultStateObject = function() { return {} }


    $('.grader').hide();


    // grade

    function useGraderData(answer, versions, score_settings, callback) {
        if(window.Quiz.grader.handler && window.Quiz.grader.data) {
            var res = window.Quiz.grader.handler(window.Quiz.grader.data, answer, versions, score_settings);
            return callback(res);
        }
        console.error('Local Quiz grader not found');
        if(errorcb) { errorcb(); }
    }


    function useGraderUrl(url, task_token, answer, versions, score_settings, callback, errorcb) {
        var data = {
            action: 'grade2', //
            task: task_token,
            answer: answer,
            versions: versions,
            score_settings: score_settings
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            crossDomain: true,
            contentType: 'application/json'
        }).done(function(res) {
            if(res.success) {
                return callback(res.data);
            }
            console.error('Grader response error: ', res);
            if(errorcb) { errorcb(); }
        }).fail(function(jqxhr, settings, exception ) {
            console.error('Grader url not responding: ' + url);
            if(errorcb) { errorcb(); }
        });
    }





    task.load = function(views, success) {
        var lastViews = views;
        var lastReloadedAnswer = null;
        task_token.init()

        platform.getTaskParams(null, null, function(taskParams) {
            var params = Object.assign(quiz_settings, {
                random: parseInt(taskParams.randomSeed, 10) || Math.floor(Math.random() * 100), //0
                parent: $('#task')
            })
            var q = Quiz.UI(params);
            window.quiz_ui = q;

            task.showViews = function(views, callback) {
                lastViews = views;
                q.toggleSolutions(!!views.solution);
                callback();
            }

            task.getDefaultAnswerObject = function() {
                return {
                    data: [],
                    versions: {}
                }
            }            

            task.getAnswer = function(callback) {
                var answer = this.getAnswerObject();
                answer = JSON.stringify(answer);
                //console.log('task.getAnswer', answer)
                callback(answer);
            };

            task.getAnswerObject = function() {
                var answerObj = {
                    data: q.getAnswer(),
                    versions: Quiz.versions.get(),
                    validated: task_toolbar.validated
                }
                if(lastReloadedAnswer
                        && JSON.stringify(lastReloadedAnswer.data) == JSON.stringify(answerObj.data)
                        && JSON.stringify(lastReloadedAnswer.versions) == JSON.stringify(answerObj.versions)) {
                    // Keep the validated attribute if the answer didn't change
                    answerObj.validated = answerObj.validated || lastReloadedAnswer.validated;
                }
                return answerObj;
            };            


            task.reloadAnswer = function(answer, callback) {
                try {
                    //console.log('task.reloadAnswer', answer)
                    var answerObject = JSON.parse(answer);
                    this.reloadAnswerObject(answerObject);
                    if (lastViews.solution || (quiz_settings.hide_restart && answerObject.validated)) {
                        task_toolbar.setValidated(true);
                        task.gradeAnswer(answer, null, function () {});
                    }
                } catch(e) {
                    console.error('Quiz: answer parsing error.')
                }
                callback();
            };


            task.reloadAnswerObject = function(answerObj) {
                var new_format = answerObj !== null && typeof answerObj === 'object' && 'data' in answerObj;
                q.setAnswer(new_format ? answerObj.data : answerObj);
                lastReloadedAnswer = answerObj;
            }



            function displayScore(score, max_score) {
                if(Quiz.params.feedback_score == 'binary') {
                    var msg = '<span class="scoreLabel">';
                    if(score == max_score) {
                        msg += lang.translate('feedback_score_binary_correct');
                    } else {
                        msg += lang.translate('feedback_score_binary_mistake');
                    }
                    msg += '</span>';
                } else if(Quiz.params.feedback_score == 'exact') {
                    var msg =
                        '<span class="scoreLabel">' + lang.translate('score') + '</span>' +
                        '<span class="value">' + score + '</span>' +
                        '<span class="max-value">/' + max_score + '</span>';
                } else if(Quiz.params.feedback_score == 'saved') {
                    var msg = '<span class="scoreLabel">' + lang.translate('feedback_answer_saved') + '</span>';
                } else {
                    return;
                }
                if($('#score').length == 0) {
                    var div = '<div id="score"></div>';
                    $('.taskContent').first().append(div);
                }
                $('#score').html(msg);
            }


            function displayMessages(messages) {
                if($('#grader-messages').length == 0) {
                    var div = '<div id="grader-messages"></div>';
                    $('.taskContent').first().append(div);
                }
                $('#grader-messages').html(messages.join('<br>'));
            }


            task.gradeAnswer = function(answer, answer_token, callback) {
                answer = JSON.parse(answer);
                var new_format = answer !== null && typeof answer === 'object' && 'data' in answer;
                function onGrade(result) {
                    q.displayFeedback(result.feedback);
                    displayScore(result.score, taskParams.maxScore);
                    //displayMessages(result.messages);
                    callback(result.score, lang.translate('grader_msg') + result.score, null);
                }
                function onError(result) {
                    task_toolbar.displayError(lang.translate('error_grading'));
                }
                var scoreSettings = {
                    maxScore: taskParams.maxScore,
                    minScore: taskParams.minScore,
                    noScore: taskParams.noScore,
                    score_calculation: 'score_calculation' in quiz_settings ? quiz_settings.score_calculation : {},
                    questions_info: q.getQuestionsInfo()
                };

                if(Quiz.params.save_only_mode) {
                    onGrade({score: taskParams.maxScore, feedback: []});
                    return;
                }

                var token = task_token.get()
                if(token) {
                    useGraderUrl(
                        quiz_settings.graderUrl,
                        token,
                        new_format ? answer.data : answer,
                        new_format ? answer.versions : Quiz.versions.get(),
                        scoreSettings,
                        onGrade,
                        onError
                    );
                } else {
                    useGraderData(
                        new_format ? answer.data : answer,
                        new_format ? answer.versions : Quiz.versions.get(),
                        scoreSettings,
                        onGrade,
                        onError
                    );
                }
            };

            success();
        });
    };

    var grader = {
        gradeTask: task.gradeAnswer
    };

    $(function() {
        if(!window.quiz_settings) { window.quiz_settings = {}; }
        if(window.platform) {
            platform.initWithTask(task);
            task_toolbar.init();
        }
    })

    window.taskGetResourcesPost = function(res, callback) {
        // Add grader_data, if available, to the javascript
        try {
            $.get('grader_data.js').success(function(data) {
                res.task.push({type: 'javascript', id: 'grader_data', content: data});
                callback(res);
            }).error(function() {
                callback(res);
            });
        } catch(e) {
            callback(res);
        }
    };




// dev code for quiz2 testing, remove it later
/*
    $(document).ready(function() {

        var answer = '[[1],[1,2],["test"],["ipsum","amet"]]';
        task.reloadAnswer(answer, function() {
            task.gradeAnswer(answer, '', function(res) {
                //alert(res)
            })
        })

        var btn = $('<button class="btn btn-success">test</button>')
        btn.click(function() {
            task.getAnswer(function(res) {
                alert(res)
            })
        })
        $(document.body).prepend(btn);
    })
*/


})();
