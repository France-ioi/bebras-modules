function taskVideo(data, grader) {

    function initTask(subTask) {

        var player;
        var level;
        var answer;

        subTask.resetDisplay = function() {
            if(subTask.display) {
                $('#taskContent').taskVideo.destroy();
                $('#taskContent').taskVideo(data[level], {
                    onPlaybackEnd: function() {
                        platform.validate('done');
                    }
                });
            }
            if(answer) {
                $('#taskContent').taskVideo.state(answer);
            }
        };


        subTask.getStateObject = function() {
            return {};
        };


        subTask.reloadAnswerObject = function(answerObj) {
            answer = answerObj;
        };


        subTask.getAnswerObject = function() {
            return $('#taskContent').taskVideo.state();
        };


        subTask.getDefaultAnswerObject = function() {
            return {
                viewed: [],
                timestamp: 0,
                playing: false
            };
        };


        subTask.loadLevel = function(curLevel) {
            level = curLevel;
        };


        subTask.unloadLevel = function(callback) {
            $('#taskContent').taskVideo.destroy();
            callback();
        };


        subTask.getGrade = function(callback) {
            var state = $('#taskContent').taskVideo.state();
            callback(grader(level, state));
        };

    }


    initWrapper(initTask, ["easy", "medium", "hard"]);
}