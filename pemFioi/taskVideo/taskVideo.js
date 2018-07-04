function taskVideo(data, grader) {

    function initTask(subTask) {

        var player;
        var level;
    
        subTask.resetDisplay = function() {};
    
        
        subTask.getStateObject = function() {
            return {};
        };
    
        
        subTask.reloadAnswerObject = function(answerObj) {
            //console.log('reloadAnswerObject', answerObj)
            $('#taskContent').taskVideo.state(answerObj);
        };
      
    
        subTask.getAnswerObject = function() {
            return $('#taskContent').taskVideo.state();
        };
    
    
        subTask.getDefaultAnswerObject = function() {
            return {};
        };
    
    
        subTask.loadLevel = function(curLevel) {
            level = curLevel;
            $('#taskContent').taskVideo.destroy();
            $('#taskContent').taskVideo(data[curLevel]);
        };    
    
    
        subTask.unloadLevel = function(callback) {
            callback();
        };
      
    
        subTask.getGrade = function(callback) {
            var state = $('#taskContent').taskVideo.state();
            callback(grader(level, state));
        };
    
    }


    initWrapper(initTask, ["easy", "medium", "hard"]);
}