(function() {

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


    window.Quiz.grader.handler = function(grader_data, answer) {
        var res = {
            score: 0,
            mistakes: [],
            messages: []
        };
        var valid;
        for (var i = 0; i < grader_data.length; i++) {
            if (typeof grader_data[i] === "function") {
                var fres = grader_data[i](answer[i]);
                if (typeof fres === "object") {
                    var score =
                        "score" in fres ? parseFloat(fres.score) || 0 : 0;
                    valid = score > 0;
                    if ("message" in fres && fres.message) {
                        res.messages[i] = fres.message;
                    }
                    res.score += score;
                } else {
                    valid = !!fres;
                    res.score += valid ? 1 : 0;
                }
                res.mistakes.push(valid ? null : answer[i]);
            } else if (Array.isArray(grader_data[i])) {
                var test = testMultiple(grader_data[i], answer[i]);
                valid = test === true;
                res.mistakes.push(valid ? [] : test);
                res.score += valid ? 1 : 0;
            } else if (typeof grader_data[i] == 'object') {
                if(Array.isArray(grader_data[i].value)) {
                    if(grader_data[i].strict) {
                        var test = testStrict(grader_data[i].value, answer[i]);
                    } else {
                        var test = testMultiple(grader_data[i].value, answer[i]);
                    }
                    valid = test === true;
                    var mistakes = valid ? [] : test;
                    res.mistakes.push(mistakes);
                    if(grader_data[i].messages && mistakes.length && grader_data[i].messages[mistakes[0]]) {
                        res.messages[i] = grader_data[i].messages[mistakes[0]];
                    }
                } else {
                    valid = grader_data[i] == answer[i] ? 1 : 0;
                    res.mistakes.push(valid ? null : answer[i]);
                    if(grader_data[i].messages && !valid && grader_data[i].messages[answer[i]]) {
                        res.messages[i] = grader_data[i].messages[answer[i]];
                    }
                }
                res.score += valid ? 1 : 0;
            } else {
                valid = grader_data[i] == answer[i] ? 1 : 0;
                res.mistakes.push(valid ? null : answer[i]);
                res.score += valid ? 1 : 0;
            }
        }
        res.score = res.score / grader_data.length;
        return res;
    };


})();
