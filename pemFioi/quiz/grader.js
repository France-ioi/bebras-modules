(function() {

    function isArrayAnswerEmpty(answers) {
        for(var i=0; i<answers.length; i++) {
            if(typeof answers[i] != "undefined") { return false; }
        }
        return true;
    }


    function testMultiple(valid, answers) {
        var mistakes = [];
        for(var i=0; i<answers.length; i++) {
            if(valid.indexOf(answers[i]) === -1) {
                mistakes.push(answers[i]);
            }
        }
        return mistakes.length == 0 && valid.length == answers.length ? true : mistakes;
    }


    function testStrict(valid, answers) {
        var mistakes = [];
        for(var i=0; i<answers.length; i++) {
            if(valid[i] !== answers[i]) {
                mistakes.push(answers[i]);
            }
        }
        return mistakes.length == 0 && valid.length == answers.length ? true : mistakes;
    }


    window.Quiz.grader.handler = function(grader_data, answer, versions, score_settings) {
        var res = {
            score_settings: score_settings,
            score: 0,
            mistakes: [],
            messages: []
        };
        var isValid;
        var nb_valid = 0;
        var nb_mistakes = 0;
        for (var i = 0; i < grader_data.length; i++) {
            var grader = grader_data[i];
            if(versions && i in versions) {
                grader = grader[versions[i]];
            }
            if (typeof grader === "function") {
                if(typeof answer[i] == 'undefined') { continue; }
                var fres = grader(answer[i]);
                if (typeof fres === "object") {
                    var score =
                        "score" in fres ? parseFloat(fres.score) || 0 : 0;
                    isValid = score > 0;
                    if ("message" in fres && fres.message) {
                        res.messages[i] = fres.message;
                    }
                    nb_valid += score;
                    nb_mistakes += score > 0 ? 0 : 1;
                } else {
                    isValid = !!fres;
                    nb_valid += isValid ? 1 : 0;
                    nb_mistakes += isValid ? 0 : 1;
                }
                res.mistakes.push(isValid ? null : answer[i]);
            } else if (Array.isArray(grader)) {
                if(isArrayAnswerEmpty(answer[i])) { continue; }
                var test = testMultiple(grader, answer[i]);
                isValid = test === true;
                res.mistakes.push(isValid ? [] : test);
                nb_valid += isValid ? 1 : 0;
                nb_mistakes += isValid ? 0 : 1;
            } else if (typeof grader == 'object') {
                if(Array.isArray(grader.value)) {
                    if(isArrayAnswerEmpty(answer[i])) { continue; }
                    if(grader.strict) {
                        var test = testStrict(grader.value, answer[i]);
                    } else {
                        var test = testMultiple(grader.value, answer[i]);
                    }
                    isValid = test === true;
                    var mistakes = isValid ? [] : test;
                    res.mistakes.push(mistakes);
                    if(grader.messages && mistakes.length) {
                        res.messages[i] = [];
                        for(var j=0; j<mistakes.length; j++) {
                            if(grader.messages[mistakes[j]]) {
                                res.messages[i][mistakes[j]] = grader.messages[mistakes[j]];
                            }
                        }
                    }
                } else {
                    if(typeof answer[i] == 'undefined') { continue; }
                    isValid = grader == answer[i] ? 1 : 0;
                    res.mistakes.push(isValid ? null : answer[i]);
                    if(grader.messages && !isValid && grader.messages[answer[i]]) {
                        res.messages[i] = grader.messages[answer[i]];
                    }
                }
                nb_valid += isValid ? 1 : 0;
                nb_mistakes += isValid ? 0 : 1;
            } else {
                if(typeof answer[i] == 'undefined') { continue; }
                isValid = grader == answer[i] ? 1 : 0;
                res.mistakes.push(isValid ? null : answer[i]);
                nb_valid += isValid ? 1 : 0;
                nb_mistakes += isValid ? 0 : 1;
            }
        }
        var nb_total = grader_data.length;
        if(score_settings) {
            res.score = (nb_valid * score_settings.maxScore
                       + nb_mistakes * score_settings.minScore
                       + (nb_total - nb_valid - nb_mistakes) * score_settings.noScore) / nb_total;
        } else {
            res.score = nb_valid / nb_total;
        }
        res.score = Math.round(res.score);
        return res;
    };


})();
