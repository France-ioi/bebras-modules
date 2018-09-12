/*
    interface:
        Main interface for quickAlgo, common to all languages.
*/

var quickAlgoInterface = {
    strings: {},
    nbTestCases: 0,
    delayFactory: new DelayFactory(),

    fullscreen: false,

    enterFullscreen: function() {
        var el = document.documentElement;
        if(el.requestFullscreen) {
            el.requestFullscreen();
        } else if(el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if(el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if(el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    },


    exitFullscreen: function() {
        var el = document;
        if(el.exitFullscreen) {
            el.exitFullscreen();
        } else if(el.mozCancelFullScreen) {
            el.mozCancelFullScreen();
        } else if(el.webkitExitFullscreen) {
            el.webkitExitFullscreen();
        } else if(el.msExitFullscreen) {
            el.msExitFullscreen();
        }
    },


    toggleFullscreen: function() {
        this.fullscreen = !this.fullscreen;
        if(this.fullscreen) {
            $('#fullscreenButton').html('[-]');
            this.enterFullscreen();
        } else {
            $('#fullscreenButton').html('[+]');
            this.exitFullscreen();
        }
        this.onResize();
    },



    loadInterface: function(context) {
            console.log('loadInterface')
        // Load quickAlgo interface into the DOM
        var self = this;
        this.context = context;
        this.strings = window.languageStrings;

        var gridHtml = "<center>";
        gridHtml += "<div id='gridButtonsBefore'></div>";
        gridHtml += "<div id='grid'></div>";
        gridHtml += "<div id='gridButtonsAfter'></div>";
        gridHtml += "</center>";
        $("#gridContainer").html(gridHtml)

        $("#blocklyLibContent").html(
            "<div id='editorBar'>" +
                "<div id='capacity'></div>" +
                "<button type='button' id='fullscreenButton'>[+]</button>" +
                "<button type='button' id='displayHelpBtn' onclick='conceptViewer.show()'>?</button>" +
                "<div id='editorMenuContainer'>" +
                    "<button type='button' id='toggleEditorMenu'>≡</button>" +
                    "<div id='editorMenu'>" +
                        "<div rel='example' class='item'>" + this.strings.loadExample + "</div>" +
                        "<div rel='save' class='item'>" + this.strings.saveProgram + "</div>" +
                        "<span id='saveUrl'></span>" +
                        "<div rel='restart' class='item'>" + this.strings.reloadProgram + "</div>" +
                        "<div rel='load' class='item'>" +
                            "<input type='file' id='task-upload-file' " +
                            "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(this));$(\"#editorMenu\").hide();'>" +
                            this.strings.restart +
                        "</div>" +
                        "<div rel='best-answer' class='item'>" + this.strings.loadBestAnswer+ "</div>" +
                    "</div>" +
                "</div>" +
                "</div>" +
            "<div id='languageInterface'></div>"
        );


        $('#fullscreenButton').click(function() {
            self.toggleFullscreen();
        });


        $('#toggleEditorMenu').click(function() {
            var el = $('#editorMenu');
            if(el.is(":visible")) {
                el.hide();
            } else {
                $('#editorMenu div[rel=best-answer]').toggle(!!displayHelper.savedAnswer);
                el.show();
            }
        });

        $('#editorMenu div[rel=example]').click(function(e) {
            task.displayedSubTask.loadExample()
        });

        $('#editorMenu div[rel=save]').click(function(e) {
            $('#editorMenu').hide();
            task.displayedSubTask.blocklyHelper.saveProgram();
        });

        $('#editorMenu div[rel=restart]').click(function(e) {
            $('#editorMenu').hide();
            displayHelper.restartAll();
        });

        $('#editorMenu div[rel=best-answer]').click(function(e) {
            $('#editorMenu').hide();
            displayHelper.retrieveAnswer();
        });


        // Buttons from buttonsAndMessages
        var addTaskHTML = '<div id="displayHelperAnswering" class="contentCentered" style="padding: 1px;">';
        var placementNames = ['graderMessage', 'validate', 'saved'];
        for (var iPlacement = 0; iPlacement < placementNames.length; iPlacement++) {
            var placement = 'displayHelper_' + placementNames[iPlacement];
            if ($('#' + placement).length === 0) {
                addTaskHTML += '<div id="' + placement + '"></div>';
            }
        }
        addTaskHTML += '</div>';
        /*
        if(!$('#displayHelper_cancel').length) {
            $('body').append($('<div class="contentCentered" style="margin-top: 15px;"><div id="displayHelper_cancel"></div></div>'));
        }
    */
        var scaleControl = '';
        if(context.display && context.infos.buttonScaleDrawing) {
            var scaleControl = '<div class="scaleDrawingControl">' +
                '<label for="scaleDrawing"><input id="scaleDrawing" type="checkbox">' +
                this.strings.scaleDrawing +
                '</label>' +
                '</div>';
        }

        var gridButtonsAfter = scaleControl
            + "<div id='testSelector'></div>"
            + "<button type='button' id='submitBtn' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>"
            + this.strings.submitProgram
            + "</button><br/>"
            + "<div id='messages'><span id='tooltip'></span><span id='errors'></span></div>"
            + addTaskHTML;
        $("#gridButtonsAfter").html(gridButtonsAfter);
        $('#scaleDrawing').change(this.onScaleDrawingChange.bind(this));
   },


    setOptions: function(opt) {
        // Load options from the task
        $('#editorMenu div[rel=example]').toggle(opt.hasExample);
        $('#editorMenu div[rel=save]').toggle(!opt.hideSaveOrLoad);
        $('#editorMenu div[rel=load]').toggle(!opt.hideSaveOrLoad);
        $('#editorMenu div[rel=best-answer]').toggle(!opt.hideLoadBestAnswer);

        if(opt.conceptViewer) {
            conceptViewer.load(opt.conceptViewerLang);
            $('#displayHelpBtn').show();
        } else {
            $('#displayHelpBtn').hide();
        }
    },


    devMode: function() {
        $('#editorMenu .item').show();
    },

    onScaleDrawingChange: function(e) {
        console.log('onScaleDrawingChange')
        var scaled = $(e.target).prop('checked');
        $("#gridContainer").toggleClass('gridContainerScaled', scaled);
        $("#blocklyLibContent").toggleClass('blocklyLibContentScaled', scaled);
        this.context.setScale(scaled ? 2 : 1);
    },


    blinkRemaining: function(times, red) {
        console.log('blinkRemaining')
        var capacity = $('#capacity');
        if(times % 2 == 0) {
            capacity.removeClass('capacityRed');
        } else {
            capacity.addClass('capacityRed');
        }
        if(times > (red ? 1 : 0)) {
            var that = this;
            this.delayFactory.destroy('blinkRemaining');
            this.delayFactory.createTimeout('blinkRemaining', function() { that.blinkRemaining(times - 1, red); }, 200);
        }
    },



    playbackSpeeds: [200, 175, 150, 125, 100, 75, 50, 25],

    initPlaybackControls: function() {
        var self = this;

        var speedControls =
            '<div class="speedControls">' +
                '<div class="speedSlider">' +
                    '<span class="speedSlower">' + this.strings.speedSliderSlower + '</span>' +
                    '<input type="range" min="0" max="' + (this.playbackSpeeds.length - 1).toString() + '" value="0" class="slider" id="speedSlider">' +
                    '<span class="speedFaster">' + this.strings.speedSliderFaster + '</span>' +
                '</div>' +
                '<div id="playerControls">' +
                    '<div class="icon stop"></div>' +
                    '<div id="playPause" class="icon play"></div>' +
                    '<div class="icon step"></div>' +
                    '<div class="icon end"></div>' +
                '</div>' +
            '</div>';
        $('#task').find('.speedControls').remove();
        $('#task').append(speedControls);

        $('#speedSlider').on('input change', function(e) {
            var speed = self.playbackSpeeds[$(this).val()];
            task.displayedSubTask.setSpeed(speed);
        });
        $('.speedSlower').click(function() {
            var el = $('#speedSlider');
            el.val(Math.max(el.val() - 1, 0));
        });
        $('.speedFaster').click(function() {
            var el = $('#speedSlider');
            el.val(Math.min(el.val() + 1, self.playbackSpeeds.length - 1));
        });


        $('#playerControls .stop').click(function() {
            task.displayedSubTask.stop();
            $('#playPause').removeClass('pause').addClass('play');
        });

        $('#playPause').click(function(e) {
            if($(this).hasClass('play')) {
                var speed = self.playbackSpeeds[$('#speedSlider').val()];
                task.displayedSubTask.setSpeed(speed);
                task.displayedSubTask.play();
                $(this).removeClass('play').addClass('pause');
            } else {
                task.displayedSubTask.pause();
                $(this).removeClass('pause').addClass('play');
            }
        })

        $('#playerControls .step').click(function() {
            $('#playPause').removeClass('pause').addClass('play');
            task.displayedSubTask.step();
        });

        $('#playerControls .end').click(function() {
            var speed = self.playbackSpeeds[self.playbackSpeeds.length - 1];
            task.displayedSubTask.changeSpeed(speed);
            $('#playPause').removeClass('play').addClass('pause');
        });
    },



    initTestSelector: function (nbTestCases) {
        var self = this;
        console.log('initTestSelector')
        // Create the DOM for the tests display
        this.nbTestCases = nbTestCases;

        var testTabs = '<div class="tabs">';
        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            if(this.nbTestCases > 1) {
                testTabs += '  <div id="testTab'+iTest+'" class="testTab" onclick="task.displayedSubTask.changeTestTo('+iTest+')"><span class="testTitle"></span></div>';
            }
        }
        testTabs += "</div>";
        $('#testSelector').html(testTabs);

        this.updateTestSelector(0);
        this.resetTestScores();
        this.initPlaybackControls();
    },


    updateTestScores: function (testScores) {
        console.log('updateTestScores')
        // Display test results
        for(var iTest=0; iTest<testScores.length; iTest++) {
            if(testScores[iTest].successRate >= 1) {
                var icon = '<span class="testResultIcon" style="color: green">✔</span>';
                var label = '<span class="testResult testSuccess">'+this.strings.correctAnswer+'</span>';
            } else if(testScores[iTest].successRate > 0) {
                var icon = '<span class="testResultIcon" style="color: orange">✖</span>';
                var label = '<span class="testResult testPartial">'+this.strings.partialAnswer+'</span>';
            } else {
                var icon = '<span class="testResultIcon" style="color: red">✖</span>';
                var label = '<span class="testResult testFailure">'+this.strings.wrongAnswer+'</span>';
            }
            $('#testTab'+iTest+' .testTitle').html(icon+' Test '+(iTest+1)+' '+label);
        }
    },

    resetTestScores: function () {
        console.log('resetTestScores')
        // Reset test results display
        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            $('#testTab'+iTest+' .testTitle').html('<span class="testResultIcon">&nbsp;</span> Test '+(iTest+1));
        }
    },

    updateTestSelector: function (newCurTest) {
        console.log('updateTestSelector')
        $("#testSelector .testTab").removeClass('currentTest');
        $("#testTab"+newCurTest).addClass('currentTest');
        $("#task").append($('#messages'));
        //$("#testTab"+newCurTest+" .panel-body").prepend($('#grid')).append($('#messages')).show();
    },


    onResize: function(e) {
        var blocklyArea = document.getElementById('blocklyContainer');
        var blocklyDiv = document.getElementById('blocklyDiv');
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        console.log(blocklyArea.offsetWidth, blocklyArea.offsetHeight)
        Blockly.svgResize(window.blocklyWorkspace);
    }
};




$(document).ready(function() {

    function createModeSelectorButtons() {
        $("#task").append('\
            <div id="modeSelector">\
                <div id="mode-instructions" class="icon"></div>\
                <div id="mode-player" class="icon"></div>\
                <div id="mode-editor" class="icon"></div>\
            </div>');

        $('#modeSelector div').click(function() {
            selectMode($(this).attr('id'));
        })
    }

    var oldMode = null;

    function selectMode(mode) {
        if(mode === oldMode) return;
        $('#task').removeClass(oldMode).addClass(mode);
        $('#' + mode).hide();
        if(oldMode) {
            $('#' + oldMode).show();
        }
        oldMode = mode;
        quickAlgoInterface.onResize();
    }

    $("#task h1").appendTo($("#miniPlatformHeader table td").first());
    $('#taskIntro, #gridContainer').wrapAll("<div id='introGrid'></div>");

    createModeSelectorButtons();
    selectMode('mode-instructions');

    window.addEventListener('resize', quickAlgoInterface.onResize, false);
    quickAlgoInterface.onResize();
});