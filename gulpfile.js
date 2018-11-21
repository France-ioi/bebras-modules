var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

var gulpDest = 'bundles';
var relativePath = '';

// Make bundles
var bundles = {
    'bebras-base': ["ext/jquery/1.7/jquery.min.js", "ext/json/json2.min.js",
        "ext/raphael/2.2.1/raphael.min.js", "pemFioi/beaver-task-2.0.js",
        "ext/jschannel/jschannel.js", "pemFioi/raphaelFactory-1.0.js",
        "pemFioi/delayFactory-1.0.js", "pemFioi/simulationFactory-1.0.js"],
    'bebras-interface': ["integrationAPI.01/official/platform-pr.js",
        "integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages.js",
        "pemFioi/beav-1.0.js",
        "integrationAPI.01/installationAPI.01/pemFioi/installation.js",
        "integrationAPI.01/official/miniPlatform.js"],
    'js-interpreter': ["ext/js-interpreter/acorn.js", "ext/acorn/walk.js",
        "ext/js-interpreter/interpreter.js"],
    'blockly-base': ["ext/blockly/blockly_compressed.js",
        "ext/blockly/blocks_compressed.js", "ext/blockly/javascript_compressed.js",
        "ext/blockly/python_compressed.js"],
    'scratch-base': ["ext/scratch/blockly_compressed_vertical.js",
        "ext/scratch/blocks_compressed.js",
        "ext/scratch/blocks_compressed_vertical.js",
        "ext/blockly/javascript_compressed.js", "ext/blockly/python_compressed.js"],
    'quickAlgo-all-blockly': ["pemFioi/quickAlgo/utils.js",
        "pemFioi/quickAlgo/i18n.js", "pemFioi/quickAlgo/interface.js",
        "pemFioi/quickAlgo/blockly_blocks.js",
        "pemFioi/quickAlgo/blockly_interface.js",
        "pemFioi/quickAlgo/blockly_runner.js", "pemFioi/quickAlgo/subtask.js",
        "pemFioi/quickAlgo/context.js"],
    'quickAlgo-all-python': ["pemFioi/pythonCount-1.0.js", "ext/ace/ace.js",
        "ext/ace/mode-python.js", "xt/skulpt/skulpt.quickAlgo.min.js",
        "ext/skulpt/skulpt-stdlib.js", "xt/skulpt/debugger.js",
        "pemFioi/quickAlgo/utils.js", "pemFioi/quickAlgo/i18n.js",
        "pemFioi/quickAlgo/interface.js", "pemFioi/quickAlgo/python_interface.js",
        "pemFioi/quickAlgo/python_runner.js", "pemFioi/quickAlgo/subtask.js",
        "pemFioi/quickAlgo/context.js"]
    };

function defineBundleTask(name, srcs) {
    var relativeSrcs = srcs.slice();
    for(var iSrc in relativeSrcs) {
        relativeSrcs[iSrc] = relativePath + relativeSrcs[iSrc];
    }
    gulp.task('bundle-' + name, function() {
        return gulp.src(relativeSrcs)
            .pipe(concat(name + '.js'))
            .pipe(gulp.dest(gulpDest));
    });
}

var allBundles = [];
for(var name in bundles) {
    defineBundleTask(name, bundles[name]);
    allBundles.push('bundle-' + name);
}

gulp.task('bundles', allBundles);
