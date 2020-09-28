(function() {

    window.lang = {

        default_language: 'en',
        language: 'en',
        language_set: false,

        strings: {
            en: {
                validate: 'Validate',
                success: 'Success',
                mistake_rows_lack: 'Too few rows',
                mistake_rows_excess: 'Too many rows',
                mistake_cols_lack: 'Too few columns',
                mistake_cols_excess: 'Too many columns',
                mistake_incorrect_data: 'Incorrect data',
                mistake_illegal_state: 'Incorrect CSV',
                mistake_illegal_quote: 'Illegal quote',
                mistake_illegal_data: 'Illegal data',
                mistake_unknown_state: 'Incorrect CSV'
            },
            fr: {
                validate: 'Validate',
                success: 'Success',
                mistake_rows_lack: 'Too few rows',
                mistake_rows_excess: 'Too many rows',
                mistake_cols_lack: 'Too few columns',
                mistake_cols_excess: 'Too many columns',
                mistake_incorrect_data: 'Incorrect data',
                mistake_illegal_state: 'Incorrect CSV',
                mistake_illegal_quote: 'Illegal quote',
                mistake_illegal_data: 'Illegal data',
                mistake_unknown_state: 'Incorrect CSV'
            },
        },

        set: function(lng) {
            if(!lng) {
                lng = window.stringsLanguage;
            }
            this.language = lng;
            this.language_set = true;
        },

        translate: function() {
            if(!this.language_set) {
                this.set();
            }
            var str = '', key = arguments[0];
            if(this.strings[this.language] && this.strings[this.language][key]) {
                str = this.strings[this.language][key];
            } else {
                str = this.strings[this.default_language][key] || key;
            }
            return str.replace('%%', arguments[1]);
        },

        getStrings: function() {
            if(!this.language_set) {
                this.set();
            }            
            return this.strings[this.language] || this.strings[this.default_language];
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
    task.showViews = function(views, callback) {
        $('#solution').toggle(!!views.solution);
        callback()
    }


    function setupTask(taskParams, success) {


        task.getAnswer = function(callback) {
            var answer = window.csv_editor.getContent();
            //console.log('task.getAnswer', answer)
            callback(answer);
        };

        task.reloadAnswer = function(answer, callback) {
            try {
                //console.log('task.reloadAnswer', answer)
                window.csv_editor.setContent(answer);
            } catch(e) {}
            callback();
        };


        function getMistakeMessage() {
            var mistake = window.csv_editor.getMistake();
            return lang.translate('mistake_' + mistake.tag);
        }

        task.gradeAnswer = function(answer, answer_token, callback) {
            window.csv_editor.setContent(answer);
            var valid = window.csv_editor.validate();
            var score = valid ? taskParams.noScore : taskParams.maxScore;
            if(valid) {
                var msg = lang.translate('success');
            } else {
                var msg = getMistakeMessage();
            }
            $('<div>' + msg + '</div>').insertAfter($('.taskContent'));
            $('#validate-btn').remove();
            callback(score, msg, null);
        };

        task.reloadAnswerObject = function(answerObj) {
            return window.csv_editor.setAnswer(answerObj.content);
        }

        task.getAnswerObject = function() {
            return {
                content: window.csv_editor.getContent()
            }
        }

        task.getDefaultAnswerObject = function() {
            return {
                content: ''
            };
        }

        var btn = $('<button id="validate-btn">' + lang.translate('validate') + '</button>');
        btn.on('click', function() {
            platform.validate('done');
        });
        btn.insertAfter($('.taskContent'));

        success();
    }


    task.load = function(views, success) {
        platform.getTaskParams(null, null, function(taskParams) {
            var params = Object.assign(csv_editor_options, {
                parent: $('.taskContent')
            })
            window.csv_editor = CSVTextEditor(params);
            setupTask(taskParams, success)
        });
    };


    $(function() {
        if(window.platform) {
            platform.initWithTask(task);
        }
    })

})();