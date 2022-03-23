(function() {

    window.lang = {

        default_language: 'en',
        language: 'en',
        language_set: false,

        strings: {
            en: {
                point: 'Point',
                line: 'Line',
                area: 'Area',
                delete: 'Delete',
                undo: 'Undo',
                redo: 'Redo',
                tag: 'Tag',
                name: 'Name',
                save: 'Save',
                cancel: 'Cancel',
                validate: 'Validate',
                validation_success: 'Success',
                validation_mistake: 'Mistake'
            },
            fr: {
                point: 'Point',
                line: 'Line',
                area: 'Area',
                delete: 'Delete',
                undo: 'Undo',
                redo: 'Redo',
                tag: 'Tag',
                name: 'Name',
                save: 'Save',
                cancel: 'Cancel',
                validate: 'Validate',
                validation_success: 'Success',
                validation_mistake: 'Mistake'                
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
            var answer = JSON.stringify(window.map2d.getFigures());
            //console.log('task.getAnswer', answer)
            callback(answer);
        };

        task.reloadAnswer = function(answer, callback) {
            try {
                //console.log('task.reloadAnswer', answer)
                answer = JSON.parse(answer);
                window.map2d.setFigures(answer);
            } catch(e) {}
            callback();
        };



        task.gradeAnswer = function(answer, answer_token, callback) {
            var answer = JSON.parse(answer);
            window.map2d.setFigures(answer);
            var valid = window.map2d.diff(map2d_grader_data);
            if(!valid) {
                console.error(window.map2d.getMistake());
            }
            var score = valid ? taskParams.noScore : taskParams.maxScore;
            var msg = valid ? lang.translate('validation_success') : lang.translate('validation_mistake');
            $('<div>' + msg + '</div>').insertAfter($('.taskContent'));
            $('#validate-btn').remove();
            callback(score, msg, null);
        };

        task.reloadAnswerObject = function(answerObj) {
            return window.map2d.setAnswer(answerObj);
        }

        task.getAnswerObject = function() {
            return window.map2d.getAnswer();
        }

        task.getDefaultAnswerObject = function() {
            return [];
        }

        var btn = $('<button id="validate-btn">' + lang.translate('validate') + '</button>');
        btn.on('click', function() {
            platform.validate('done');
        });
        btn.insertAfter($('.taskContent'));

        setTimeout(function() {
//            platform.validate('done');
        }, 100)

        success();
    }


    task.load = function(views, success) {
        platform.getTaskParams(null, null, function(taskParams) {
            var params = Object.assign(map2d_options, {
                parent: $('.taskContent')[0],
                strings: lang.getStrings(),
                onLoad: function() {
                    setupTask(taskParams, success)
                }
            })
            window.map2d = Map2D(params);
        });
    };
})();
