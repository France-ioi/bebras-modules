var lang = {

    default_language: 'en',
    language: 'en',

    strings: {
        en: {
            'score': 'Score',
            'grader_msg': 'Your score is ',
            'validate': 'Validate',
            'placeholder_text': 'Enter text',
            'placeholder_number': 'Enter number',
            'error_number': 'Must be a number',
            'placeholder_string': 'Enter string',
            'error_string': 'Must be a string',
            'placeholder_regexp': 'Enter text',
            'error_regexp': 'Invalid format'
        },
        fr: {}
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



var task = {}

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
task.getState = function(success, error) { success({})  }
task.reloadStateObject = function(obj) { }
task.getStateObject = function() { return {} }
task.getDefaultStateObject = function() { return {} }



$('solution').hide();
$('#solution').hide();
$('.grader').hide();


// grade

function useGraderData(url, answer, callback) {
    if(window.QuizzeGrader && window.QuizzeGrader.data) {
        callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
        return;
    }

    function onLoad(script) {
        try {
            window.QuizzeGrader.data = eval(script)
        } catch(e) {
            console.error('Malformed grader data in ' + url);
            return
        }
        callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
    }

    // $.getScript nor working over file: protocol
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function() {
        if(req.readyState === 4) {
            if(req.status === 200 || req.status == 0) {
                onLoad(req.responseText)
            }
        }
    }
    req.send(null);
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
        var random = parseInt(taskParams.randomSeed, 10) || 0
        var q = QuizzeUI({
            parent: $('#task'),
            shuffle_questions: random > 0, // in dev mode always 0 here and shuffle disabled
            shuffle_answers: random > 0,
            random: random
        });


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
            var msg = lang.translate('score') + ' <span class="value">' + score + '</span><span class="max-value">/' + max_score + '</span>';
            if($('#score').length == 0) {
                var div = '<div id="score"></div>';
                $('.taskContent').first().append(div);
            }
            $('#score').html(msg);
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
                callback(final_score, lang.translate('grader_msg') + final_score, null);
            }
            var token = task_token.get()
            if(token) {
                useGraderUrl(json.graderUrl, token, answer, onGrade);
            } else if(json.graderUrl) {
                useGraderData('grader_data.js', answer, onGrade);
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

        var btn = $('<button class="btn btn-success btn-validate">' + lang.translate('validate') + '</button>');
        btn.on('click', function() {
            platform.validate('done');
        });
        btn.insertAfter($('.taskContent'));

        success();
    });
};


var grader = {
    gradeTask: task.gradeAnswer
};

if(window.platform) {
    platform.initWithTask(task);
}

lang.set(window.stringsLanguage)