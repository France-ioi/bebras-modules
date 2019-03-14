BebrasTaskWrapper(task, {
    host: 'http://localhost:3101'
})


task.onLoad = function(views, taskLoadCallback) {


    platform.getTaskParams(null, null, function(taskParams) {
        var q = QuizzeUI({
            parent: $('#task'),
            shuffle_questions: 0, //true,
            shuffle_answers: 0, //true,
            random: parseInt(taskParams.randomSeed, 10) || 0
        });

        task.getAnswer = function(callback) {
            callback(q.getAnswer());
        };

        task.reloadAnswer = function(answer, callback) {
            q.setAnswer(answer);
            callback();
        };

        task.hackShowViews = function(views) {
            q.toggleSolutions(!!views.solution);
        }

        var height = null;
        setInterval(function() {
            task.getHeight(function(h) {
                if(h !== height) {
                    height = h;
                    platform.updateDisplay({
                        height: height
                    }, function() {});
                }
            });
        }, 1000);

        // grade
        function gradeByData(url, answer, callback) {
            if(window.QuizzeGrader && window.QuizzeGrader.data) {
                callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
                return;
            }
            $.getScript(url)
                .done(function(script, textStatus ) {
                    try {
                        window.QuizzeGrader.data = eval(script)
                        callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
                    } catch(e) {
                        console.error('Malformed grader data in ' + url);
                    }
                }).fail(function( jqxhr, settings, exception ) {
                    console.error('Can\'t load grader data: ' + url);
                });
        }


        function gradeByUrl(url, answer, callback) {
            var data = {
                action: 'grade',
                task_id: json.id,
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



        task.gradeAnswer = function(answer, answer_token, callback) {
            function onGrade(result) {
                var d = taskParams.maxScore - taskParams.minScore;
                var final_score = taskParams.minScore + Math.round(d * result.score);
                q.showMistakes(result.mistakes);
                callback(final_score, 'Your score is ' + final_score, null);
            }
            if(json.graderData) {
                gradeByData(json.graderData, answer, onGrade);
            } else if(json.graderUrl) {
                gradeByUrl(json.graderUrl, answer, onGrade);
            }
        };



        taskLoadCallback();
    });
 };