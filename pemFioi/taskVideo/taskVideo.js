// taskVideo : task with a YouTube video

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

    // if the new height has already been tried just before the current height and
    // the current height was tried before that, we're in a loop between two heights.
    // In that case we want to keep the largest of the two heights
    if ((task.heights.length == 3) &&
        (task.heights[0] == task.heights[2]) &&
        (task.heights[1] == h) &&
        (task.heights[2] > h)) {
          return task.heights[2];
    }
    task.heights.push(h);
    task.heights = task.heights.slice(-3);
    /*
    if(task.heights[task.heights.length - 1] !== h) {
        task.heights.push(h);
    }
    task.heights = task.heights.slice(-5);
    var unique = task.heights.filter(function(item, i, arr) {
        return arr.indexOf(item) === i
    });
    if(unique.length && unique.length <= 2) {
        h = Math.max.apply(null, task.heights);
    } else {
        task.heights = [h];
    }
    */
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
        success(100, 'No section has been viewed.');
    }
}

var grader = {
    gradeTask: task.gradeAnswer
};

if(window.platform) {
    platform.initWithTask(task);
}
