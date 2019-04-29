(function(exports){

    function testMultiple(valid, answer) {
        var s1 = valid.sort(), s2 = answer.sort(), mistakes = [];
        var res = s1.every(function(v, i) {
            if(v == s2[i]) {
                return true;
            }
            mistakes.push(s2[i]);
            return false;
        });
        return res === true ? res : mistakes;
    }

    exports.grade = function(grader_data, answer) {
        var res = {
            score: 0,
            mistakes: [],
            messages: []
        }
        var valid;
        for(var i=0; i<grader_data.length; i++) {
            if(typeof grader_data[i] === 'function') {
                var fres = grader_data[i](answer[i]);
                if(typeof fres === 'object') {
                    var score = 'score' in fres ? (parseFloat(fres.score) || 0) : 0;
                    valid = score > 0;
                    if('message' in fres && fres.message) {
                        res.messages.push(fres.message);
                    }
                    res.score += score;
                } else {
                    valid = !!fres;
                    res.score += valid ? 1 : 0;
                }
                res.mistakes.push(valid ? null : answer[i]);
            } else if(Array.isArray(grader_data[i])) {
                var test = testMultiple(grader_data[i], answer[i]);
                valid = test === true;
                res.mistakes.push(valid ? [] : test);
                res.score += valid ? 1 : 0;
            } else {
                valid = grader_data[i] == answer[i] ? 1 : 0;
                res.mistakes.push(valid ? null : answer[i]);
                res.score += valid ? 1 : 0;
            }
        }
        res.score = res.score / grader_data.length;
        return res;
    }

})(typeof exports === 'undefined' ? (this['QuizGrader'] ? this['QuizGrader'] : this['QuizGrader'] = {}) : exports)