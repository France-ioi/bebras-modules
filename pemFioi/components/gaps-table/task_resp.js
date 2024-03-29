function setupGapsTableTask(gaps_table_options) {

    function initTask(subTask) {

        $("#gaps-table").empty();
    
        var state = {};
        var level;
        var answer = null;

        var gaps_table;
        var level_options;

        
        subTask.loadLevel = function(curLevel) {
            if(respEnabled){
                displayHelper.responsive = true;
                convertDOM();
            }else{
                displayHelper.responsive = false;
            }

            displayHelper.avatarType = "none";
            level = curLevel;
            level_options = gaps_table_options[level];

            displayHelper.taskW = level_options.taskW;
            displayHelper.taskH = level_options.taskH;
            displayHelper.minTaskW = 500;
            displayHelper.maxTaskW = 900;
        };
    
        subTask.getStateObject = function() {
            return state;
        };
    
        subTask.reloadAnswerObject = function(answerObj) {
            answer = answerObj;
            if(!answer) {
                return;
            }
        };
    
        subTask.resetDisplay = function() {
            displayError("");
            gaps_table && gaps_table.destroy();
            initGapsTable(function() {
                displayHelper.customValidate = checkResult;    
            })
        };
    
        subTask.getAnswerObject = function() {
            return answer;
        };
    
        subTask.getDefaultAnswerObject = function() {
            var defaultAnswer = { 
                data: []
            };
            
            return defaultAnswer;
        };
    
        subTask.unloadLevel = function(callback) {
            gaps_table && gaps_table.destroy();
            callback();
        };
    
        subTask.getGrade = function(callback) {
            checkResult(true, function(res) {
                callback(res)
            });      
        };
    
    
        function initGapsTable(callback) {
            if(gaps_table) {
                gaps_table.setAnswer(answer.data);
                return callback();
            } 

            var options = Object.assign({}, level_options, {
                parent: $('#gaps-table'),
                labels: taskStrings.table_labels,
                onChange: function(data) {
                    answer.data = data;
                },
                answer: answer.data || []
            })
            gaps_table = GapsTable(options);       
            callback();
        };
    
        function displayError(msg) {
          if(respEnabled){
             displayHelper.displayError(msg);
          }else{
             $("#error").html(msg);
          }
        };  
    
        function checkResult(noVisual, callback) {
            initGapsTable(function() {
                var valid = gaps_table.validate(noVisual);
                if(!valid) {
                    if(!noVisual){
                        displayError(taskStrings.fail);
                    }
                    callback && callback({ 
                        successRate: 0, 
                        message: taskStrings.fail
                    });
                    return;            
                }
                if(!noVisual){
                    platform.validate("done");
                }
                callback && callback({ 
                    successRate: 1, 
                    message: taskStrings.success 
                });            
            })
        };
    
    }

    initWrapper(
        initTask, 
        Object.keys(gaps_table_options)
    );
    displayHelper.useFullWidth(); 
}