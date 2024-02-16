(function() {


    function scoreCalculator(score_settings, nb_total) {

        var nb_valid = 0;
        var nb_answers = 0;

        return {

            addAnswer: function(answer_score) {
                nb_answers += 1;
                if(typeof answer_score === 'boolean') {
                    nb_valid += answer_score ? 1 : 0;
                } else {
                    nb_valid += parseFloat(answer_score) || 0;
                }
            },

            getScore: function() {
                if(score_settings) {
                    var score = (nb_valid / nb_total * (score_settings.maxScore - score_settings.minScore)
                               + score_settings.minScore
                               + (nb_total - nb_answers) / nb_total * score_settings.noScore);
                } else {
                    var score = nb_valid / nb_total;
                }
                score = Math.round(score);
                return score;
            }
        }

    }




    function graderDataEnumerator(grader_data, versions) {

        return {
            each: function(callback) {
                for (var i = 0; i < grader_data.length; i++) {
                    var answer_grader_data = grader_data[i];
                    if(versions && i in versions) {
                        answer_grader_data = answer_grader_data[versions[i]];
                    }
                    callback(answer_grader_data, i);
                }
            }
        }

    }




    function getAnswerGrader(grader, score_settings, idx) {

        var question_info = score_settings.questions_info[idx];


        function getScoreCalculationMethod() {
            var res = {
                formula: 'default',
                wrong_answer_penalty: 1
            }
            if('score_calculation' in score_settings) {
                if('formula' in score_settings.score_calculation) {
                    res.formula = score_settings.score_calculation.formula;
                } else if('wrong_answer_penalty' in score_settings.score_calculation) {
                    res.formula = 'wrong_answer_penalty';
                    res.wrong_answer_penalty = parseFloat(score_settings.score_calculation.wrong_answer_penalty) || 1;
                }            
            }
            return res;
        }


        function gradeAnswerArray(given_answer, correct_answer, messages, strict) {
            var res = {
                score: 0,
                feedback: {
                    correct_answer: correct_answer,
                    mistakes: [],
                    messages: messages
                }
            }

            var user_correct_answers_amount = 0;
            var user_incorrect_answers_amount = 0;

            for(var i=0; i<given_answer.length; i++) {
                if(strict) {
                    var correct = correct_answer[i] === given_answer[i];
                    if(correct) {
                        user_correct_answers_amount++;
                    } else {
                        user_incorrect_answers_amount++;
                    }
                    res.feedback.mistakes.push(correct ? null : given_answer[i]);
                } else {
                    var correct = correct_answer.indexOf(given_answer[i]) !== -1;
                    if(correct) {
                        user_correct_answers_amount++;
                    } else {
                        user_incorrect_answers_amount++;
                        res.feedback.mistakes.push(given_answer[i]);
                    }
                }
            }
            var correct_answers_amount = correct_answer.length;
            var incorrect_answers_amount = question_info.answers_amount - correct_answers_amount;

            var method = getScoreCalculationMethod();

            switch(method.formula) {
                case "wrong_answer_penalty":
                    if(correct_answers_amount > 0) {
                        res.score = (user_correct_answers_amount - method.wrong_answer_penalty * user_incorrect_answers_amount) / correct_answers_amount;
                    }
                    break;
                case "percentage_of_correct":
                    if(correct_answers_amount > 0) {
                        res.score = user_correct_answers_amount / correct_answers_amount;
                    }
                    break;
                case "balance":
                    if(correct_answers_amount > 0) {
                        res.score = (user_correct_answers_amount - user_incorrect_answers_amount) / correct_answers_amount;
                    }
                    break;
                case "disbalance":
                    if(correct_answers_amount > 0) {
                        res.score = user_correct_answers_amount / correct_answers_amount;
                        if(incorrect_answers_amount > 0) {
                            res.score -= user_incorrect_answers_amount / incorrect_answers_amount;
                        }
                    }
                    break;
                case "default":
                default:
                    res.score = user_correct_answers_amount == correct_answers_amount && user_incorrect_answers_amount == 0 ? 1 : 0;
                    break;
            }
            res.score = Math.max(0, res.score);
            res.score = Math.min(1, res.score);
            res.feedback.partial = res.score < 1 && user_correct_answers_amount > 0;
            return res;
        }


        function gradeAnswerTwoDimArray(given_answer, correct_answer, messages) {
            var res = {
                score: true,
                feedback: {
                    correct_answer: correct_answer,
                    mistakes: [],
                    messages: messages
                }
            }
            for(var i = 0; i < given_answer.length; i++) {
                for(var j = 0; j < given_answer[i].length; j++){
                    var correct = correct_answer[i].indexOf(given_answer[i][j]) !== -1;
                    res.score = res.score && correct;
                    if(!correct) {
                        res.feedback.mistakes.push({ cont: i, item: j });
                    }
                }
                if(given_answer[i].length != correct_answer[i].length) {
                    res.score = false;
                    res.feedback.mistakes.push({ cont: i, item: null });
                }
            }
            return res;
        }



        var grader_types = {

            'function': function(answer) {
                // supposed to grade text input answers, so
                var fres = grader(answer[0]);
                if (typeof fres === 'object') {
                    // function return object
                    var res = {
                        score: 'score' in fres ? parseFloat(fres.score) || 0 : 0,
                        feedback: {
                            correct_answer: [],
                            mistakes: [],
                            messages: []
                        }
                    }
                    if(res.score == 0) {
                        res.feedback.mistakes = answer;
                    }
                    if('message' in fres && fres.message) {
                        res.feedback.messages = [fres.message];
                    }
                    if('correct_answer' in fres && fres.correct_answer) {
                        res.feedback.correct_answer = [fres.correct_answer];
                    }
                } else {
                    // use result as boolean
                    var res = {
                        score: !!fres,
                        feedback: {
                            correct_answer: [],
                            mistakes: [],
                            messages: []
                        }
                    }
                    if(!fres) {
                        res.feedback.mistakes = answer;
                    }
                }
                return res;
            },


            'array': function(answer) {
                return gradeAnswerArray(answer, grader, []);
            },


            'object': function(answer) {
                if(grader.twoDimArray) {
                    return gradeAnswerTwoDimArray(answer, grader.value, grader.messages || []);
                }
                return gradeAnswerArray(answer, grader.value, grader.messages || [], !!grader.strict);
            },


            'scalar': function(answer) {
                var score = grader == answer[0];
                return {
                    score: score,
                    feedback: {
                        correct_answer: [grader],
                        mistakes: score ? [] : answer,
                        messages: []
                    }
                }
            }
        }


        if(typeof grader === 'function') {
            return grader_types['function'];
        } else if (Array.isArray(grader)) {
            return grader_types['array'];
        } else if (typeof grader == 'object') {
            return grader_types['object'];
        }
        return grader_types['scalar'];

    }


    function grade(grader_data, answer, versions, score_settings) {
        var res = {
            score: 0,
            feedback: []
        }
        var calculator = scoreCalculator(score_settings, grader_data.length);
        graderDataEnumerator(grader_data, versions).each(function(answer_grader_data, idx) {
            var grader = getAnswerGrader(answer_grader_data, score_settings, idx);
            var grader_result = grader(answer[idx]);
            calculator.addAnswer(grader_result.score);
            res.feedback.push(grader_result.feedback);
        });
        res.score = calculator.getScore();
        //console.log(res)
        return res;
    };



    window.Quiz.grader.handler = grade;

})();
