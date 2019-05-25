(function() {

    window.lang = {

        default_language: 'en',
        language: 'en',

        strings: {
            en: {
                'score': 'Score',
                'grader_msg': 'Your score is ',
                'validate': 'Submit',
                'solution': 'Show answer',
                'restart': 'Restart',
                'restart_scratch': 'Restart from scratch',
                'restart_current': 'Restart from current answer',
                'placeholder_text': 'Enter text',
                'placeholder_number': 'Enter number',
                'error_number': 'Must be a number',
                'placeholder_string': 'Enter string',
                'error_string': 'Must be a string',
                'placeholder_regexp': 'Enter text',
                'error_regexp': 'Invalid format'
            },
            fr: {
                'score': 'Score',
                'grader_msg': 'Votre score est ',
                'validate': 'Valider',
                'solution': 'Voir la réponse',
                'restart': 'Recommencer',
                'restart_scratch': 'Recommencer au début',
                'restart_current': 'Recommencer la question',
                'cancel' : 'Annuler',
                'placeholder_text': 'Entrez du texte',
                'placeholder_number': 'Entrez un nombre',
                'error_number': 'Vous devez entrer un nombre.',
                'placeholder_string': 'Entrez une chaîne de caractères',
                'error_string': 'Vous devez entrer une chaïne de caractères',
                'placeholder_regexp': 'Entrez du texte.',
                'error_regexp': 'Format invalide'
            },
        },

        set: function(lng) {
            this.language = lng;
        },

        translate: function(key) {
            if(this.strings[this.language] && this.strings[this.language][key]) {
                return this.strings[this.language][key];
            }
            return this.strings[this.default_language][key] || key;
        }

    }


    var task_toolbar = {

        buttons: {},
        holder: false,
        popup: false,

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
            task.showViews({"task": true, "solution": false}, function(){});
            if(from_scratch) {
                window.quiz_ui.reset();
            }
        },

        showPopup: function() {
            if(!this.popup) {
                this.popup = $(
                    '<div class="quiz-popup">\
                        <div class="opacity-overlay"></div>\
                        <div class="inner"><div class="content"></div></div>\
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
            if(validated) {
                this.buttons.validate.hide();
                this.buttons.solution.show();
            } else {
                this.buttons.validate.show();
                this.buttons.solution.hide();
            }
        },


        init: function() {
            if(this.holder) return;
            $('#showSolutionButton').remove();
            this.holder = $('<div class="quiz-toolbar"></div>');
            var self = this;
            this.addButton(this.holder, 'validate', function() {
                platform.validate('done');
                self.freezeTask();
                self.setValidated(true);
            });
            this.addButton(this.holder, 'solution', function() {
                miniPlatformShowSolution();
            });
            this.buttons.solution.hide();
            this.addButton(this.holder, 'restart', function() {
                self.showPopup();
            });
            this.holder.insertAfter($('.taskContent'));
        }

    }


    var task_token = {

        token: null,

        init: function() {
            var query = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
            this.token = query.sToken || '';
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
        if (typeof json !== 'undefined') {
            success(json);
        } else {
            success({nbHints: 0});
        }
    };

    task.reloadState = function(state, success, error) { success() }
    task.getState = function(success, error) { success("{}")  }
    task.reloadStateObject = function(obj) { }
    task.getStateObject = function() { return {} }
    task.getDefaultStateObject = function() { return {} }



    $('solution').hide();
    $('#solution').hide();
    $('.grader').hide();


    // grade

    function useGraderData(answer, callback) {
        if(window.Quiz.grader.handler && window.Quiz.grader.data) {
            return callback(window.Quiz.grader.handler(window.Quiz.grader.data, answer));
        }
        console.error('Local Quiz grader not found');
    }


    function useGraderUrl(url, task_token, answer, callback) {
        var data = {
            action: 'grade',
            task: task_token,
            answer: answer
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
        }).fail(function(jqxhr, settings, exception ) {
            console.error('Grader url not responding: ' + url);
        });
    }





    task.load = function(views, success) {
        task_token.init()

        platform.getTaskParams(null, null, function(taskParams) {
            var random = parseInt(taskParams.randomSeed, 10) || Math.floor(Math.random() * 100) //0
            var q = Quiz.UI({
                parent: $('#task'),
                shuffle_questions: !!quiz_settings.shuffle_questions,
                shuffle_answers: !!quiz_settings.shuffle_answers,
                random: random
            });
            window.quiz_ui = q;

            task.showViews = function(views, callback) {
                q.toggleSolutions(!!views.solution);
                $('#solution').toggle(!!views.solution);
                callback()
            }


            task.getAnswer = function(callback) {
                callback(JSON.stringify(q.getAnswer()));
            };


            task.reloadAnswer = function(answer, callback) {
                try {
                    answer = JSON.parse(answer);
                    q.setAnswer(answer);
                } catch(e) {

                }
                callback();
            };



            function displayScore(score, max_score) {
                var msg = '<span class="scoreLabel">' + lang.translate('score') + '</span>' + ' <span class="value">' + score + '</span><span class="max-value">/' + max_score + '</span>';
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
                function onGrade(result) {
                    var d = taskParams.maxScore - taskParams.minScore;
                    var final_score = Math.max(
                        taskParams.minScore + Math.round(d * result.score),
                        taskParams.noScore || 0
                    );
                    q.showResult(result.mistakes);
                    displayScore(final_score, taskParams.maxScore);
                    displayMessages(result.messages);
                    callback(final_score, lang.translate('grader_msg') + final_score, null);
                }
                var token = task_token.get()
                if(token) {
                    useGraderUrl(quiz_settings.graderUrl, token, answer, onGrade);
                } else {
                    useGraderData(answer, onGrade);
                }
            };


            task.reloadAnswerObject = function(answerObj) {
                return q.setAnswer(answerObj);
            }


            task.getAnswerObject = function() {
                return q.getAnswer();
            }

            task.getDefaultAnswerObject = function() {
                return [];
            }

            success();
        });
    };

    var grader = {
        gradeTask: task.gradeAnswer
    };

    lang.set(window.stringsLanguage)

    $(function() {
        if(window.platform) {
            platform.initWithTask(task);
            task_toolbar.init();
        }
    })

})();
