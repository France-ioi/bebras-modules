// taskVideo : task with a video

var task = {};

task.showViews = function(views, success, error) {
    success();
};

task.getViews = function(success, error) {
    var views = {
        task: {}
    };
    success(views);
};

task.updateToken = function(token, success, error) {
    success();
};

task.heights = [];

task.getHeight = function(success, error) {
    // Note : if the html/body is taking all available height, making an
    // infinite loop with the platform of height increase, try changing your
    // doctype to <!doctype html>
    var d = document;
    var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
    success(h);
    //success(parseInt($("body").outerHeight(true)));
};

task.getMetaData = function(success, error) {
    if (typeof json !== 'undefined') {
        success(json);
    } else {
        success({nbHints: 0});
    }
};

task.reloadAnswerObject = function(answerObj) {
    $('#taskContent').taskVideo.state(answerObj);
}
task.getAnswerObject = function() {
    return $('#taskContent').taskVideo.state();
}
task.getDefaultAnswerObject = function() {
    return {
        viewed: 0,
        total: 0, // not 0
        sections: {},
        timestamp: 0,
        playing: false
    };
}

task.reloadAnswer = function(strAnswer, success, error) {
    try {
        if(strAnswer) {
            task.reloadAnswerObject(JSON.parse(strAnswer));
        }
        success();
    } catch(e) { error(e); }
};

task.getAnswer = function(success, error) {
    success(JSON.stringify(task.getAnswerObject()));
};


task.reloadState = function(state, success, error) { task.reloadAnswer(state, success, error); }
task.getState = function(success, error) { task.getAnswer(success, error); }
task.reloadStateObject = function(obj) { task.reloadAnswerObject(obj); }
task.getStateObject = function() { return task.getAnswerObject(); }
task.getDefaultStateObject = function() { return task.getDefaultAnswerObject(); }

task.load = function(views, success, error) {
    $('#taskContent').taskVideo(
        window.videoData,
        function() { platform.validate('done'); }
        );
    success();
};

task.unload = function(success, error) {
    $('#taskContent').taskVideo.destroy();
    success();
};


task.gradeAnswer = function(answer, answerToken, success, error) {
    try {
        var answerObj = JSON.parse(answer);
    } catch(e) { error(e); }
    if(answerObj.viewed) {
        success(Math.floor(100 * answerObj.viewed / answerObj.total), answerObj.viewed + '/' + answerObj.total + ' sections viewed.');
    } else {
        success(0, 'No section has been viewed.');
    }
}

var grader = {
    gradeTask: task.gradeAnswer
};

$(function() {
    if(window.platform) {
        platform.initWithTask(task);
    }

    // Copy of displayHelper.useFullWidth
    try {
        $('#question-iframe', window.parent.document).css('width', '100%');
    } catch(e) {
    }
    $('body').css('width', '');
});
