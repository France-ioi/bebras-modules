/*
    interface:
        Main interface for quickAlgo, common to all languages.
*/

var quickAlgoInterface = {
    strings: {},
    nbTestCases: 0,
    delayFactory: new DelayFactory(),
    curMode: null,

    fullscreen: false,
    hasHelp: false,

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
                "<div id='editorMenuContainer'>" +
//                    "<button type='button' id='toggleEditorMenu'>≡</button>" +
                "</div>" +
            "</div>" +
            "<div id='languageInterface'></div>"
        );


        $('#fullscreenButton').click(function() {
            self.toggleFullscreen();
        });


        // TODO :: something cleaner (add when editorMenu is opened, remove when closed?)
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
            //+ "<button type='button' id='submitBtn' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>"
            //+ this.strings.submitProgram
            //+ "</button><br/>"
            //+ "<div id='messages'><span id='tooltip'></span><span id='errors'></span></div>"
            + addTaskHTML;
        $("#gridButtonsAfter").html(gridButtonsAfter);
        $('#scaleDrawing').change(this.onScaleDrawingChange.bind(this));

        this.createModeTaskToolbar();
    },

    toggleEditorMenu: function(forceState) {
        var el = $('#editorMenu');
        if(el.is(":visible") || forceState === false) {
            el.hide();
            $(document).off('click', quickAlgoInterface.hideEditorMenuOnClick);
        } else {
            $('#editorMenu div[rel=best-answer]').toggle(!!displayHelper.savedAnswer);
            el.show();
            $(document).on('click', quickAlgoInterface.hideEditorMenuOnClick);
        };
    },

    hideEditorMenuOnClick: function(e) {
        if(!($(e.target).parents('#toggleEditorMenu').length)) {
            quickAlgoInterface.toggleEditorMenu(false);
        }
    },

    setOptions: function(opt) {
        // Load options from the task
        $('#editorMenu div[rel=example]').toggle(opt.hasExample);
        $('#editorMenu div[rel=save]').toggle(!opt.hideSaveOrLoad);
        $('#editorMenu div[rel=load]').toggle(!opt.hideSaveOrLoad);
        $('#editorMenu div[rel=best-answer]').toggle(!opt.hideLoadBestAnswer);

        if(opt.conceptViewer) {
            conceptViewer.load(opt.conceptViewerLang);
            this.hasHelp = true;
        } else {
            this.hasHelp = false;
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



    stepDelayMin: 25,
    stepDelayMax: 250,

    refreshStepDelay: function() {
        var v = parseInt($('#speedCursor').val(), 10),
            delay = this.stepDelayMin + this.stepDelayMax - v;
        task.displayedSubTask.setStepDelay(delay);
    },

    initPlaybackControls: function() {
        var self = this;

        var speedControls =
            '<div class="speedControls">' +
                '<div id="speedSlider">' +
                    '<span class="speedSlower">' + this.strings.speedSliderSlower + '</span>' +
                    '<input type="range" min="0" max="' +
                        (this.stepDelayMax - this.stepDelayMin) +
                        '" value="0" class="slider" id="speedCursor">' +
                    '<span class="speedFaster">' + this.strings.speedSliderFaster + '</span>' +
                '</div>' +
                '<div id="playerControls">' +
                    '<div class="icon backToFirst"><span class="fas fa-fast-backward"></span></div>' +
                    '<div class="icon playPause play"><span class="fas fa-play-circle"></span></div>' +
                    '<div class="icon nextStep"><span class="fas fa-step-forward"></span></div>' +
                    '<div class="icon goToEnd"><span class="fas fa-fast-forward"></span></div>' +
                '</div>' +
            '</div>';
        $('#task').find('.speedControls').remove();
        $('#taskToolbar').prepend(speedControls);

        $('#speedCursor').on('input change', function(e) {
            self.refreshStepDelay();
        });
        $('.speedSlower').click(function() {
            var el = $('#speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) - delta;
            el.val(Math.max(newVal, 0));
            self.refreshStepDelay();
        });
        $('.speedFaster').click(function() {
            var el = $('#speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) + delta;
            el.val(Math.min(newVal, maxVal));
            self.refreshStepDelay();
        });

        $('#playerControls .backToFirst').click(function() {
            task.displayedSubTask.stop();
//            task.displayedSubTask.play();
//            self.setPlayPause(true);
        });

        $('#playerControls .playPause').click(function(e) {
            if($(this).hasClass('play')) {
                self.refreshStepDelay();
                task.displayedSubTask.play();
                self.setPlayPause(true);
            } else {
                task.displayedSubTask.pause();
                self.setPlayPause(false);
            }
        })

        $('#playerControls .nextStep').click(function() {
            self.setPlayPause(false);
            task.displayedSubTask.step();
        });

        $('#playerControls .goToEnd').click(function() {
            task.displayedSubTask.setStepDelay(0);
            task.displayedSubTask.play();
            self.setPlayPause(false);
        });
    },

    setPlayPause: function(isPlaying) {
        if(isPlaying) {
            $('#playerControls .playPause').html('<span class="fas fa-pause-circle"></span>');
            $('#playerControls .playPause').removeClass('play').addClass('pause');
        } else {
            $('#playerControls .playPause').html('<span class="fas fa-play-circle"></span>');
            $('#playerControls .playPause').removeClass('pause').addClass('play');
        }
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
            if(!testScores[iTest]) { continue; }
            if(testScores[iTest].evaluating) {
                var icon = '<span class="testResultIcon fas fa-spinner fa-spin" title="'+this.strings.evaluatingAnswer+'"></span>';
            } else if(testScores[iTest].successRate >= 1) {
                var icon = '<span class="testResultIcon" style="color: #00FF00;" title="'+this.strings.correctAnswer+'">✔</span>';
            } else if(testScores[iTest].successRate > 0) {
                var icon = '<span class="testResultIcon" style="color: orange" title="'+this.strings.partialAnswer+'">✖</span>';
            } else {
                var icon = '<span class="testResultIcon" style="color: red" title="'+this.strings.wrongAnswer+'">✖</span>';
            }
            $('#testTab'+iTest+' .testTitle').html(icon+' Test '+(iTest+1));
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


    createModeTaskToolbar: function() {
        if($('#taskToolbar').length) { return; }
        var displayHelpBtn = this.hasHelp ? '<button type="button" id="displayHelpBtn" onclick="conceptViewer.show()">\
            <span class="fas fa-question"></span></button>' : '';
        var self = this;
        $("#task").append('' +
            '<div id="taskToolbar">' +
                "<div id='editorMenu'>" +
                    "<div rel='example' class='item'><span class='fas fa-paste'></span> " + this.strings.loadExample + "</div>" +
                    "<span id='saveUrl'></span>" +
                    "<div rel='restart' class='item'><span class='fas fa-trash-alt'></span> " + this.strings.restart + "</div>" +
                    "<div rel='save' class='item'><span class='fas fa-download'></span> " + this.strings.saveProgram + "</div>" +
                    "<div rel='load' class='item'>" +
                        "<input type='file' id='task-upload-file' " +
                        "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(this));$(\"#editorMenu\").hide();'>" +
                        "<span class='fas fa-upload'></span> " +
                        this.strings.reloadProgram +
                    "</div>" +
                    "<div rel='best-answer' class='item'><span class='fas fa-trophy'></span> " + this.strings.loadBestAnswer+ "</div>" +
                "</div>" +
                '<div id="toggleEditorMenu" class="icon"><span class="fas fa-file-code"></span></div>' +
                '<div id="modeSelector">' +
                    '<div id="mode-player" class="icon"><span class="fas fa-play"></span></div>' +
                    '<div id="mode-instructions" class="icon"><span class="fas fa-file-alt"></span></div>' +
                    '<div id="mode-editor" class="icon"><span class="fas fa-pencil-alt"></span></div>' +
                '</div>'
                + displayHelpBtn +
            '</div>');

        $('#toggleEditorMenu').click(function() {
            self.toggleEditorMenu();
        });

        $('#modeSelector div').click(function() {
            self.selectMode($(this).attr('id'));
        })
    },

    selectMode: function(mode) {
        if(mode === this.curMode) return;
        $('#modeSelector').children('div').removeClass('active');
        $('#modeSelector #' + mode).addClass('active');
        $('#task').removeClass(this.curMode).addClass(mode);
        if(mode == 'mode-instructions') {
            $('#taskIntro .short').hide();
            $('#taskIntro .long').show();
        }
        if(mode == 'mode-player') {
            $('#taskIntro .short').show();
            $('#taskIntro .long').hide();
        }
        this.curMode = mode;
        this.onResize();
    },

    unloadLevel: function() {
        // Called when level is unloaded
        this.resetTestScores();
        if(this.curMode == 'mode-editor') {
           // Don't stay in editor mode as it can cause task display issues
           this.selectMode('mode-player');
        }
    },

    onResize: function(e) {
        var blocklyArea = document.getElementById('blocklyContainer');
        var blocklyDiv = document.getElementById('blocklyDiv');
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(window.blocklyWorkspace);
    },



    displayError: function(message) {
        $('#errorModal').remove();
        if(!message) return;
        var html =
            '<div id="errorModal" class="modalWrapper">' +
            '<div class="modal">' +
            '<button type="button" class="btn close" onclick="closeModal(`errorModal`)">x</button>' +
            '<p>' + message + '</p>' +
            '</div>' +
            '</div>';
        $(document.body).append($(html));
        $("#errorModal").show();
    }
};


$(document).ready(function() {

    $('head').append('<link rel="stylesheet"\
    href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"\
    integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"\
    crossorigin="anonymous">');

    $("#task h1").appendTo($("#miniPlatformHeader table td").first());
    $("#taskIntro, #gridContainer").wrapAll("<div id='introGrid'></div>");

    quickAlgoInterface.selectMode('mode-player');

    window.addEventListener('resize', quickAlgoInterface.onResize, false);
    quickAlgoInterface.onResize();
});
