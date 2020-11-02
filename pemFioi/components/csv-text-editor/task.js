function setupCSVEditorTask(csv_editor_options) {

    function initTask(subTask) {

        $("#csv-editor").empty();
    
        var state = {};
        var level;
        var answer = null;

        var csv_editor;
        var level_options;

        
        subTask.loadLevel = function(curLevel) {
            displayHelper.avatarType = "none";
            level = curLevel;
            level_options = csv_editor_options[level];
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
            //csv_editor && csv_editor.destroy();
            initEditor(function() {
                displayHelper.customValidate = checkResult;    
            })
        };
    
        subTask.getAnswerObject = function() {
            return answer;
        };
    
        subTask.getDefaultAnswerObject = function() {
            var defaultAnswer = { 
                csv: ''
            };
            return defaultAnswer;
        };
    
        subTask.unloadLevel = function(callback) {
            csv_editor && csv_editor.destroy();
            callback();
        };
    
        subTask.getGrade = function(callback) {
            checkResult(true, function(res) {
                callback(res)
            });      
        };
    
    
        function initEditor(callback) {
            if(csv_editor) {
                csv_editor.setContent(answer.csv.trim());
                return callback();
            } 

            var options = Object.assign({}, level_options, {
                parent: $('#csv-editor'),
                labels: taskStrings.labels,
                onChange: function(content) {
                    answer.csv = content;
                },
                content: answer.csv
            })
            csv_editor = CSVTextEditor(options);       
            callback();
        };
    
        function getMistakeMessage() {
            var mistake = csv_editor.getMistake();
            var key = 'mistake_' + mistake.tag;
            return key in taskStrings ? taskStrings[key] : taskStrings.fail;
        }        
    
        function checkResult(noVisual, callback) {
            initEditor(function() {
                var valid = csv_editor.validate(level_options.valid_data, noVisual);
                if(!valid) {
                    var msg = getMistakeMessage();
                    if(!noVisual){
                        displayHelper.showPopupMessage(msg, "blanket");
                    }
                    callback && callback({ 
                        successRate: 0, 
                        message: msg
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
        Object.keys(csv_editor_options)
    );
    displayHelper.useFullWidth(); 
}