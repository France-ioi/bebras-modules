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
    lastHeight: null,
    checkHeightInterval: null,
    hasHelp: false,
    editorMenuIsOpen: false,
    longIntroShown: false,
    taskIntroContent: null,
    blocklyHelper: null,
    editorReadOnly: false,
    options: {},
    capacityPopupDisplayed: {},

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
        this.fullscreen = true;
        this.updateFullscreenElements();
    },


    exitFullscreen: function() {
        if(window.iOSDetected) {
            // iOS tries to extend the iframe if the contents don't fit.
            // To remedy that, we delete the blockly editor after returning
            // from fullscreen, and reload it
            $('#blocklyLibContent').addClass('interfaceToggled');
            setTimeout(function() {
                $('#blocklyDiv').html('');
                $('#blocklyLibContent').removeClass('interfaceToggled');
                quickAlgoInterface.blocklyHelper.reload();
                quickAlgoInterface.onResize();
                }, 500);
        }
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
        this.fullscreen = false;
        this.updateFullscreenElements();
    },


    toggleFullscreen: function() {
        this.fullscreen = !this.fullscreen;
        if(this.fullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
        setTimeout(function() {
            quickAlgoInterface.onResize();
        }, 500);
    },

    updateFullscreenState: function() {
        if(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen) {
            this.fullscreen = true;
        } else {
            this.fullscreen = false;
        }
        this.updateFullscreenElements();
    },

    updateFullscreenElements: function() {
        if(this.fullscreen) {
            $('body').addClass('fullscreen');
            $('#fullscreenButton').html('<i class="fas fa-compress"></i>');
        } else {
            $('body').removeClass('fullscreen');
            $('#fullscreenButton').html('<i class="fas fa-expand"></i>');
        }
    },

    registerFullscreenEvents: function() {
        if(this.fullscreenEvents) { return; }
        document.addEventListener("fullscreenchange", this.updateFullscreenState.bind(this));
        document.addEventListener("webkitfullscreenchange", this.updateFullscreenState.bind(this));
        document.addEventListener("mozfullscreenchange", this.updateFullscreenState.bind(this));
        document.addEventListener("MSFullscreenChange", this.updateFullscreenState.bind(this));
        this.fullscreenEvents = true;
    },

    loadInterface: function(context, level) {
        ////TODO: function is called twice
        // Load quickAlgo interface into the DOM
        this.context = context;
        this.strings = window.languageStrings;
        this.level = level;

        var gridHtml = "";
        gridHtml += "<div id='gridButtonsBefore'></div>";
        gridHtml += "<div class='gridArea'><div id='grid'></div></div>";
        gridHtml += "<div id='gridButtonsAfter'></div>";
        $("#gridContainer").html(gridHtml);

        $("#blocklyLibContent").html(
            "<div id='editorBar'>" +
                "<div id='capacity' class='capacity'></div>" +
                "<div class='buttons'>" +
                "<button type='button' id='fullscreenButton' onclick='quickAlgoInterface.toggleFullscreen();'><span class='fas fa-expand'></span></button>" +
                "<button type='button' class='displayHelpBtn' onclick='conceptViewer.show()'><span class='fas fa-question'></span></button>" +
                "</div>" +
            "</div>" +
            "<div id='languageInterface'></div>"
        );

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
        this.createEditorMenu();
        this.updateInterfaceCss();
        this.updateBestAnswerStatus();
        this.setupTaskIntro(level);
        this.wrapIntroAndGrid();
        FontsLoader.checkFonts();
        this.registerFullscreenEvents();
        if(!this.curMode || !$('#task').hasClass(this.curMode)) {
            this.selectMode('mode-instructions');
        }
        if(!this.checkHeightInterval) {
            this.checkHeightInterval = setInterval(this.checkHeight.bind(this), 1000);
        }
        setTimeout(function() {
            quickAlgoInterface.onResize();
            }, 100);
        setTimeout(function() {
            quickAlgoInterface.onResize();
            }, 1000);
    },

    createEditorMenu: function() {
        $('#tabsContainer').toggleClass('noLevelTabs', !displayHelper.hasLevels);
        if(!$('#openEditorMenu').length) {
            $("#tabsContainer").append("<div id='openEditorMenu' class='icon' onclick='quickAlgoInterface.toggleEditorMenu();'><span class='fas fa-bars'></span></div>");
        }
        if($('#editorMenu').length) { return; }
        $("body").append('' +
            "<div id='editorMenu' style='display: none;'>" +
                "<div class='editorMenuHeader'>" +
                    "<div id='closeEditorMenu' onclick='quickAlgoInterface.closeEditorMenu();'><span class='fas fa-times'></span></div>" +
                    "<div>Menu</div>" +
                "</div>" +
                "<div class='editorActions'>" +
                    "<div rel='example' class='item' onclick='quickAlgoInterface.editorBtn(\"example\");'><span class='fas fa-paste'></span> " + this.strings.loadExample + "</div>" +
                    "<div rel='restart' class='item' onclick='quickAlgoInterface.editorBtn(\"restart\");'><span class='fas fa-trash-alt'></span> " + this.strings.restart + "</div>" +
                    "<div rel='save' class='item' onclick='quickAlgoInterface.editorBtn(\"save\");'><span class='fas fa-download'></span> " + this.strings.saveProgram + "</div>" +
                    "<div rel='load' class='item'>" +
                        "<input type='file' id='task-upload-file' " +
                        "onchange='quickAlgoInterface.loadPrograms(this)'>" +
                        "<span class='fas fa-upload'></span> " +
                        this.strings.reloadProgram +
                    "</div>" +
                    "<div rel='best-answer' class='item' onclick='quickAlgoInterface.editorBtn(\"best-answer\");'><span class='fas fa-trophy'></span> " + this.strings.loadBestAnswer+ "</div>" +
                "</div>" +
                "<span id='saveUrl'></span>" +
            "</div>"
        );
        this.updateControlsDisplay();
    },

    toggleEditorMenu: function() {
        if(this.editorMenuIsOpen) {
            this.closeEditorMenu();
        } else {
            this.openEditorMenu();
        }
    },
    openEditorMenu: function() {
        this.editorMenuIsOpen = true;
        var menuWidth = $('#editorMenu').css('width');
        $('#editorMenu').css('display','block');
        $('body').animate({left: '-' + menuWidth}, 500);
    },
    closeEditorMenu: function() {
        this.editorMenuIsOpen = false;
        $('body').animate({left: '0'}, 500, function() {
            $('#editorMenu').css('display','none')
        });
    },

    editorBtn: function(btn) {
        // Handle an editor button press
        this.closeEditorMenu();
        if(btn == 'example') {
            task.displayedSubTask.loadExample()
        } else if(btn == 'save') {
            task.displayedSubTask.blocklyHelper.saveProgram();
        } else if(btn == 'restart') {
            displayHelper.restartAll();
        } else if(btn == 'best-answer') {
            displayHelper.retrieveAnswer();
        }
    },

    loadPrograms: function(formElement) {
        this.blocklyHelper.handleFiles(formElement.files);
        resetFormElement($(formElement));
        this.closeEditorMenu();
    },

    setOptions: function(opt) {
        // Load options from the task
        // We use a class 'interfaceToggled' as using jquery's .toggle(true)
        // would force an element to display, even if the layout wants it
        // hidden. Using a class ensures we don't break the elements' display
        // property from the layout
        $.extend(this.options, opt);
        this.updateControlsDisplay();
        this.updateInterfaceCss();

        if(opt.conceptViewer) {
            conceptViewer.selectLanguage(opt.conceptViewerLang);
            this.hasHelp = true;
        } else {
            this.hasHelp = false;
        }
    },

    updateControlsDisplay: function() {
        var hideControls = this.options.hideControls ? this.options.hideControls : {};
        $('.displayHelpBtn').toggleClass('interfaceToggled', !this.hasHelp);
        $('#editorMenu div[rel=example]').toggleClass('interfaceToggled', !this.options.hasExample);
        $('#editorMenu div[rel=restart]').toggleClass('interfaceToggled', !!hideControls.restart);
        $('#editorMenu div[rel=save]').toggleClass('interfaceToggled', !!hideControls.saveOrLoad);
        $('#editorMenu div[rel=load]').toggleClass('interfaceToggled', !!hideControls.saveOrLoad);
        $('#editorMenu div[rel=best-answer]').toggleClass('interfaceToggled', !!hideControls.loadBestAnswer);

        var menuHidden = !this.options.hasExample && hideControls.restart && hideControls.saveOrLoad && hideControls.loadBestAnswer;
        $('#openEditorMenu').toggleClass('interfaceToggled', !!menuHidden);

        $('div.speedSlider').toggleClass('interfaceToggled', !!hideControls.speedSlider);
        $('div.displaySpeedSlider').toggleClass('interfaceToggled', !!hideControls.speedSlider);
        $('div.backToFirst').toggleClass('interfaceToggled', !!hideControls.backToFirst);
        $('div.nextStep').toggleClass('interfaceToggled', !!hideControls.nextStep);
        $('div.goToEnd').toggleClass('interfaceToggled', !!hideControls.goToEnd);
    },

    updateInterfaceCss: function() {
        $('style#quickAlgoInterface').remove();
        var taskIntroMaxHeight = this.options.introMaxHeight ? this.options.introMaxHeight : '33%';
        $('head').append('' +
            '<style id="quickAlgoInterface">' +
            '@media screen and (min-width: 855px) and (orientation: landscape) { #taskIntro { max-height: '+taskIntroMaxHeight+'; }}' +
            '</style>');
    },

    bindBlocklyHelper: function(blocklyHelper) {
        this.blocklyHelper = blocklyHelper;
    },

    devMode: function() {
        $('#editorMenu .item').show();
    },

    onScaleDrawingChange: function(e) {
        var scaled = $(e.target).prop('checked');
        $("#gridContainer").toggleClass('gridContainerScaled', scaled);
        $("#blocklyLibContent").toggleClass('blocklyLibContentScaled', scaled);
        this.context.setScale(scaled ? 2 : 1);
    },


    blinkRemaining: function(times, red) {
        var capacity = $('.capacity');
        if(times % 2 == 0) {
            capacity.removeClass('capacityRed');
        } else {
            capacity.addClass('capacityRed');
        }
        this.delayFactory.destroy('blinkRemaining');
        if(times > (red ? 1 : 0)) {
            this.delayFactory.createTimeout('blinkRemaining', function() { quickAlgoInterface.blinkRemaining(times - 1, red); }, 400);
        }
    },

    displayCapacity: function(info) {
        // Display remaining capacity
        // Accepts an info item with optional keys :
        // -text : Text to display
        // -warning : Display as a warning
        // -invalid : Display as invalid (program can't be executed)
        // -type : Type of the text displayed (capacity, forbidden, limited)

        if(!info.text) { return; }
        $('.capacity').html(info.text);

        if(info.invalid) {
            this.blinkRemaining(11, true);

            // Lock player controls
            this.displayError(info.text, true);

            if(displayHelper && info.popup && info.type == 'capacity' && !this.capacityPopupDisplayed[info.type]) {
                // Display warning (only for capacity-type messages)
                displayHelper.showPopupMessage(this.strings.capacityWarning, 'blanket', displayHelper.strings.alright, null, null, "warning");
                this.capacityPopupDisplayed[info.type] = true;
            }
        } else if(info.warning) {
            this.blinkRemaining(6);
            this.displayError(null, true);
        } else {
            this.blinkRemaining(0);
            this.displayError(null, true);
        }
    },


    stepDelayMin: 25,
    stepDelayMax: 250,

    refreshStepDelay: function() {
        var v = parseInt($('.speedCursor').val(), 10),
            delay = this.stepDelayMin + this.stepDelayMax - v;
        task.displayedSubTask.setStepDelay(delay);
    },

    initPlaybackControls: function() {
        var speedControls =
            '<div class="speedControls">' +
                '<div class="playerControls">' +
                    '<div class="icon backToFirst" onclick="quickAlgoInterface.playerControls(\'backToFirst\');"><span class="fas fa-fast-backward"></span></div>' +
                    '<div class="icon playPause play" onclick="quickAlgoInterface.playerControls(\'playPause\');"><span class="fas fa-play"></span></div>' +
                    '<div class="icon nextStep" onclick="quickAlgoInterface.playerControls(\'nextStep\');"><span class="fas fa-step-forward"></span></div>' +
                    '<div class="icon goToEnd" onclick="quickAlgoInterface.playerControls(\'goToEnd\');"><span class="fas fa-fast-forward"></span></div>' +
                    '<div class="icon displaySpeedSlider" onclick="quickAlgoInterface.playerControls(\'displaySpeedSlider\');"><span class="fas fa-tachometer-alt"></span></div>' +
                '</div>' +
                '<div class="speedSlider">' +
                    '<span class="icon hideSpeedSlider" onclick="quickAlgoInterface.playerControls(\'hideSpeedSlider\');"><span class="fas fa-tachometer-alt"></span></span>' +
                    '<span class="icon speedSlower" onclick="quickAlgoInterface.playerControls(\'speedSlower\');"><span class="fas fa-walking"></span></span>' +
                    '<input type="range" min="0" max="' +
                        (this.stepDelayMax - this.stepDelayMin) +
                        '" value="0" class="slider speedCursor" oninput="quickAlgoInterface.refreshStepDelay();" onchange="quickAlgoInterface.refreshStepDelay();"/>' +
                    '<span class="icon speedFaster" onclick="quickAlgoInterface.playerControls(\'speedFaster\');"><span class="fas fa-running"></span></span>' +
                '</div>' +
            '</div>';
        if($('#task .speedControls').length) {
            return;
        }
        // place speed controls depending on layout
        // speed controls in taskToolbar on mobiles
        // in intro on portrait tablets
        // in introGrid on other layouts (landscape tablets and desktop)

        $('#mode-player').append(speedControls);
        $('#introGrid').append(speedControls);
        this.updateControlsDisplay();
    },

    playerControls: function(ctrl) {
        if(ctrl == 'backToFirst') {
            task.displayedSubTask.stop();
            this.setPlayPause(false);
        } else if(ctrl == 'playPause') {
            if($('.playerControls .playPause').hasClass('play')) {
                this.refreshStepDelay();
                this.setPlayPause(true);
                task.displayedSubTask.play();
            } else {
                this.setPlayPause(false);
                task.displayedSubTask.pause();
            }
        } else if(ctrl == 'nextStep') {
            this.setPlayPause(false);
            task.displayedSubTask.step();
        } else if(ctrl == 'goToEnd') {
            task.displayedSubTask.setStepDelay(0);
            task.displayedSubTask.play();
            this.setPlayPause(false);
        } else if(ctrl == 'displaySpeedSlider') {
            $('#mode-player').addClass('displaySpeedSlider');
            $('#introGrid .speedControls').addClass('displaySpeedSlider');
        } else if(ctrl == 'hideSpeedSlider') {
           $('#mode-player').removeClass('displaySpeedSlider');
           $('#introGrid .speedControls').removeClass('displaySpeedSlider');
        } else if(ctrl == 'speedSlower') {
            var el = $('.speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) - delta;
            el.val(Math.max(newVal, 0));
            quickAlgoInterface.refreshStepDelay();
        } else if(ctrl == 'speedFaster') {
            var el = $('.speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) + delta;
            el.val(Math.min(newVal, maxVal));
            quickAlgoInterface.refreshStepDelay();
        }
    },

    setPlayPause: function(isPlaying) {
        if(isPlaying) {
            $('.playerControls .playPause').html('<span class="fas fa-pause"></span>');
            $('.playerControls .playPause').removeClass('play').addClass('pause');
        } else {
            $('.playerControls .playPause').html('<span class="fas fa-play"></span>');
            $('.playerControls .playPause').removeClass('pause').addClass('play');
        }
    },

    initTestSelector: function (nbTestCases) {
        // Create the DOM for the tests display
        this.nbTestCases = nbTestCases;
        var curLevel = this.level;
        var testTabs = '<div class="tabs">';
        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            if(this.nbTestCases > 1) {
                var curTest = iTest + 1;
                var testImg = '';
                // Test thumbnail
                var levelTestImg = $('img#test_' + curLevel + '_' + curTest);
                if(levelTestImg.length) {
                    testImg = '<div class="testThumbnail">' +
                                 '<img src="' + levelTestImg.attr('src') + '" alt="grid thumbnail for test '+curTest+'" width=120 height=120/>' +
                              '</div>';
                } else if (this.options.hasTestThumbnails) {
                    // hasTestThumbnails is a legacy option
                    // TODO :: remove
                    testImg = '<div class="testThumbnail">' +
                            '<img src="test_' + curLevel + '_' + curTest + '.png" alt="grid thumbnail for test '+curTest+'" width=120 height=120 />' +
                        '</div>';
                }
                testTabs += '' +
                    '<div id="testTab'+iTest+'" class="testTab" onclick="task.displayedSubTask.changeTestTo('+iTest+')">' +
                        '<span class="testTitle"></span>' +
                        testImg +
                    '</div>';
            }
        }
        testTabs += "</div>";
        $('#testSelector').html(testTabs);

        this.updateTestSelector(0);
        this.resetTestScores();
        this.initPlaybackControls();
    },


    updateTestScores: function (testScores) {
        // Display test results
        var testData = task.displayedSubTask.data[task.displayedSubTask.level];

        for(var iTest=0; iTest<testScores.length; iTest++) {
            if(!testScores[iTest]) { continue; }
            if(testScores[iTest].evaluating) {
                var icon = '<span class="testResultIcon testEvaluating fas fa-spinner fa-spin" title="'+this.strings.evaluatingAnswer+'"></span>';
            } else if(testScores[iTest].successRate >= 1) {
                var icon = '\
                    <span class="testResultIcon testSuccess" title="'+this.strings.correctAnswer+'">\
                        <span class="fas fa-check"></span>\
                    </span>';
            } else if(testScores[iTest].successRate > 0) {
                var icon = '\
                    <span class="testResultIcon testPartial" title="'+this.strings.partialAnswer+'">\
                        <span class="fas fa-times"></span>\
                    </span>';
            } else {
                var icon = '\
                    <span class="testResultIcon testFailure" title="'+this.strings.wrongAnswer+'">\
                        <span class="fas fa-times"></span>\
                    </span>';
            }

            var testName = this.strings.testLabel + ' '+(iTest+1);
            if (testData[iTest].hasOwnProperty("testName"))
            {
                testName = testData[iTest].testName;
            }
            $('#testTab'+iTest+' .testTitle').html(icon+' ' + testName);
        }
    },

    resetTestScores: function () {
        // Reset test results display
        var testData = task.displayedSubTask.data[task.displayedSubTask.level];

        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            var testName = this.strings.testLabel + ' '+(iTest+1);

            if (testData && testData[iTest] && testData[iTest].hasOwnProperty("testName"))
            {
                testName = testData[iTest].testName;
            }

            $('#testTab'+iTest+' .testTitle').html('<span class="testResultIcon">&nbsp;</span> ' + testName);
        }
    },

    updateTestSelector: function (newCurTest) {
        $("#testSelector .testTab").removeClass('currentTest');
        $("#testSelector .testTab .testThumbnail").show();
        $("#testTab"+newCurTest).addClass('currentTest');
        $("#testTab"+newCurTest + " .testThumbnail").hide();
        $("#task").append($('#messages'));
        //$("#testTab"+newCurTest+" .panel-body").prepend($('#grid')).append($('#messages')).show();
    },

    updateBestAnswerStatus: function() {
        this.hasBestAnswer = window.displayHelper && window.displayHelper.hasSavedAnswer();
        $('.editorActions div[rel=best-answer]').toggleClass('editorActionDisabled', !this.hasBestAnswer);
    },

    createModeTaskToolbar: function() {
        if($('#taskToolbar').length) { return; }
        $("#task").append('' +
            '<div id="taskToolbar">' +
                '<div id="modeSelector">' +
                    '<div id="mode-instructions" class="mode" onclick="quickAlgoInterface.selectMode(\'mode-instructions\');">' +
                        '<span><span class="fas fa-file-alt"></span><span class="label">' + this.strings.instructions + '</span></span>' +
                    '</div>' +
                    '<div id="mode-editor" class="mode" onclick="quickAlgoInterface.selectMode(\'mode-editor\');">' +
                        '<span>' +
                            '<span class="fas fa-pencil-alt"></span>' +
                            '<span class="label">' + this.strings.editor + '</span>' +
                        '</span>' +
                        '<span>' +
                            "<span class='capacity'></span>" +
                            "<button type='button' onclick='quickAlgoInterface.toggleFullscreen();'><span class='fas fa-expand'></span></button>" +
                            "<button type='button' class='displayHelpBtn' onclick='conceptViewer.show()'><span class='fas fa-question'></span></button>" +
                        '</span>' +
                    '</div>' +
                    '<div id="mode-player" class="mode" onclick="quickAlgoInterface.selectMode(\'mode-player\');">' +
                        '<span class="fas fa-play selectIcon"></span>' +
                    '</div>' +
                '</div>' +
            '</div>');
    },

    selectMode: function(mode) {
        if(mode === this.curMode) return;
        $('#modeSelector').children('div').removeClass('active');
        $('#modeSelector #' + mode).addClass('active');
        $('#task').removeClass(this.curMode).addClass(mode);
        $('#mode-player').removeClass('displaySpeedSlider'); // there should be a better way to achieve this
        if(mode != 'mode-instructions' && this.blocklyHelper) {
            this.blocklyHelper.reload();
        }
        this.curMode = mode;
        this.onResize();
    },

    setupTaskIntro: function(level) {
        if(this.taskIntroContent === null) {
            this.taskIntroContent = $('#taskIntro').html();
        }
        $('#taskIntro').html(this.taskIntroContent);
        if(level) {
            for(var otherLevel in displayHelper.levelsRanks) {
                if(otherLevel == level) { continue; }
                $('#taskIntro .' + otherLevel).not('.'+level).remove();
            }
            $('#taskIntro .' + level).show();
        }
        var levelIntroContent = $('#taskIntro').html();
        var hasLong = $('#taskIntro').find('.long').length;
        if (hasLong) {
            $('#taskIntro').addClass('hasLongIntro');
            // if long version of introduction exists, append its content to #blocklyLibContent
            // with proper title and close button
            // add titles
            // add display long version button
            var introLong = '' +
                '<div id="taskIntroLong" style="display:none;" class="panel">' +
                    '<div class="panel-heading">'+
                        '<h2 class="sectionTitle"><i class="fas fa-search-plus icon"></i>' + this.strings.introDetailsTitle + '</h2>' +
                        '<button type="button" class="closeLongIntro exit" onclick="quickAlgoInterface.toggleLongIntro(false);"><i class="fas fa-times"></i></button>' +
                    '</div><div class="panel-body">' +
                        levelIntroContent +
                    '</div>' +
                '<div>';
            $('#blocklyLibContent').append(introLong);
            var renderTaskIntro = '' +
                '<div class="introContent">' +
                '<h2 class="introTitleIcon"><span class="fas fa-book icon"></span></h2>' +
                    levelIntroContent +
                '</div>' +
                '<div id="introControls">' +
                    '<button type="button" class="showLongIntro" onclick="quickAlgoInterface.toggleLongIntro();"></button>' +
                '</div>';
            $('#taskIntro').html(renderTaskIntro);
            quickAlgoInterface.toggleLongIntro(false);
        } else {
            $('#taskIntro').html(
                '<div class="introContent">' +
                '<h2 class="introTitleIcon"><span class="fas fa-book icon"></span></h2>' +
                    levelIntroContent +
                '</div>');
        }
        this.bindVideoBtns();
    },

    appendTaskIntro: function(html) {
        if(this.taskIntroContent === null) {
            this.taskIntroContent = $('#taskIntro').html();
        }
        this.taskIntroContent += html;
        $('#taskIntro').html(this.taskIntroContent);
        this.setupTaskIntro();
    },

    toggleLongIntro: function(forceNewState) {
        if(forceNewState === false || this.longIntroShown) {
            $('#taskIntroLong').removeClass('displayIntroLong');
            $('.showLongIntro').html('<span class="fas fa-plus-circle icon"></span>' + this.strings.showDetails + '</button>');
            this.longIntroShown = false;
        } else {
            $('#taskIntroLong').addClass('displayIntroLong');
            $('.showLongIntro').html('<span class="fas fa-minus-circle icon"></span>' + this.strings.hideDetails + '</button>');
            this.longIntroShown = true;
        }
    },

    unloadLevel: function() {
        // Called when level is unloaded
        this.resetTestScores();
        if(this.curMode == 'mode-editor') {
           // Don't stay in editor mode as it can cause task display issues
           this.selectMode('mode-instructions');
        }
    },

    onResize: function(e) {
        // 100% and 100vh work erratically on some mobile browsers (Safari on
        // iOS) because of the toolbar, so we set directly the height as pixels
        var browserHeight = document.documentElement.clientHeight;
        var browserWidth = document.documentElement.clientWidth;
        $('body').css('height', browserHeight);

        if($('#miniPlatformHeader').length) {
            $('#task').css('height', (browserHeight - 40) + 'px');
        } else {
            $('#task').css('height', '');
        }

        // Determine right size for editor
        var languageArea = document.getElementById('blocklyContainer');
        if(!languageArea) { return; }
        var toolbarDiv = document.getElementById('taskToolbar');
        var heightBeforeToolbar = toolbarDiv ? toolbarDiv.getBoundingClientRect().top - languageArea.getBoundingClientRect().top : Infinity;
        var heightBeforeWindow = browserHeight - languageArea.getBoundingClientRect().top - 2;
        if($('#taskToolbar').is(':visible')) {
            // TODO :: why did we have a condition window.innerHeight < window.innerWidth ?
            var targetHeight = Math.floor(Math.min(heightBeforeToolbar, heightBeforeWindow));
        } else {
            var targetHeight = Math.floor(heightBeforeWindow);
        }

        if($('#blocklyDiv').length) {
            $('#blocklyDiv').height(targetHeight);
        } else {
            $('#blocklyContainer').height(targetHeight);
        }

        // Check whether we should set readOnly mode
        this.readOnly = this.curMode == 'mode-player' &&
            ((browserWidth <= browserHeight && browserWidth < 767) ||
             (browserWidth > browserHeight && browserWidth >= 480 && browserWidth <= 854));
        if(this.blocklyHelper) {
            this.blocklyHelper.setReadOnly(this.readOnly);
        }

        // Resize editor elements
        if(this.blocklyHelper) {
            this.blocklyHelper.onResize();
        }

        // Resize grid
        if(task.displayedSubTask && $('#grid').is(':visible')) {
            task.displayedSubTask.updateScale();
        }

        // Check size and hide overflow if less than 5 pixels, to avoid big
        // scrollbars when the layout is just slightly off for some reason
        $('body').css('overflow-x', document.documentElement.scrollWidth - browserWidth < 5 ? 'hidden' : '');
        $('body').css('overflow-y', document.documentElement.scrollHeight - browserHeight < 5 ? 'hidden' : '');
    },

    checkHeight: function() {
        var browserHeight = document.documentElement.clientHeight;
        if(this.lastHeight !== null && this.lastHeight != browserHeight) {
            this.onResize();
        }
        this.lastHeight = browserHeight;
    },

    displayError: function(message, lock) {
        if(lock) {
            $('.errorMessageLock').remove();
        } else {
            $('.errorMessage').not('.errorMessageLock').remove();
        }
        if(!message) return;
        var divClass = lock ? 'errorMessageLock' : '';
        var id = Math.random();
        var html =
            '<div class="errorMessage '+divClass+'" data-id="'+id+'">' +
                '<button type="button" class="btn close">'+
                    '<span class="fas fa-times"></span>'+
                '</button>' +
                '<div class="messageWrapper">' +
                    '<span class="icon fas fa-bell"></span>' +
                    '<p class="message">' + message + '</p>' +
                '</div>' +
            '</div>';
        $("#taskToolbar").append($(html));
        $("#introGrid .speedControls").append($(html));
        $(".errorMessage").not('.errorMessageLock').click(function(e) {
            var targetId = e.currentTarget.getAttribute('data-id');
            $(e.currentTarget).remove();
            $(".errorMessage[data-id='"+targetId+"']").remove();
        });
    },

    makeTestResult: function(results, link) {
        return '' +
            '<span class="testResults">' +
                '<span class="' + (results.successRate < 1 ? 'testError' : 'testSuccess') + '">' +
                    this.strings.testLabel + ' ' + (results.iTestCase+1) + ' : ' +
                    (results.successRate < 1 ? this.strings.testError : this.strings.testSuccess) +
                '</span>' +
                (link ? ' <span class="testLink" onclick="quickAlgoInterface.runTestCase('+results.iTestCase+')">' + this.strings.seeTest + '</span>' : '') +
            '</span>';
    },

    displayResults: function(mainResults, worstResults) {
        if(mainResults.iTestCase == worstResults.iTestCase) {
            this.displayError(mainResults.message);
        } else {
            this.displayError(this.makeTestResult(mainResults) + this.makeTestResult(worstResults, true));
        }
    },

    runTestCase: function(iTestCase) {
        task.displayedSubTask.changeTestTo(iTestCase);
        task.displayedSubTask.setStepDelay(0);
        task.displayedSubTask.run();
    },

    wrapIntroAndGrid: function() {
        if ($('#introGrid').length) { return; }
        $("#taskIntro, #gridContainer").wrapAll("<div id='introGrid'></div>");
    },

    bindVideoBtns: function() {
        // TODO :: move that out of quickAlgoInterface?
        $('button.videoBtn').off('click', this.videoBtnHandler);
        $('button.videoBtn').on('click', this.videoBtnHandler).html('<span class="fas fa-play-circle icon"></span> ' + this.strings.displayVideo);
        $('a.videoBtn').off('click', this.videoBtnHandler);
        $('a.videoBtn').on('click', this.videoBtnHandler);
    },

    videoBtnHandler: function() {
        var that = $(this);
        var video = $('<video controls></video>');
        $.each(that[0].attributes, function() {
            if(this.name == 'data-video') {
                video.attr('src', this.value);
            } else if(this.name == 'data-style') {
                video.attr('style', this.value);
            } else {
                video.attr(this.name, this.value);
            }
        });
        that.replaceWith(video);
        video[0].play();
    },

    exportCurrentAsPng: function(name) {
        if(typeof window.saveSvgAsPng == 'undefined') {
            throw "Unable to export without save-svg-as-png. Please add 'save-svg-as-png' to the importModules statement.";
        }
        if(!name) { name = 'export.png'; }
        var svgBbox = $('#blocklyDiv svg')[0].getBoundingClientRect();
        var blocksBbox = $('#blocklyDiv svg > .blocklyWorkspace > .blocklyBlockCanvas')[0].getBoundingClientRect();
        var svg = $('#blocklyDiv svg').clone();
        svg.find('.blocklyFlyout, .blocklyMainBackground, .blocklyTrash, .blocklyBubbleCanvas, .blocklyScrollbarVertical, .blocklyScrollbarHorizontal, .blocklyScrollbarBackground').remove();
        var options = {
            backgroundColor: '#FFFFFF',
            top: blocksBbox.top - svgBbox.top - 4, 
            left: blocksBbox.left - svgBbox.left - 4, 
            width: blocksBbox.width + 8, 
            height: blocksBbox.height + 8
            };
        window.saveSvgAsPng(svg[0], name, options);
    }
};

window.quickAlgoResponsive = true;

$(document).ready(function() {

/*    $('head').append('\
        <link rel="stylesheet"\
        href="' + (window.modulesPath ? window.modulesPath : '../../modules') + '/fonts/fontAwesome/css/all.css">');*/
    FontsLoader.loadFonts(['fontawesome', 'titillium-web']);

    var taskTitleTarget = $("#miniPlatformHeader table td").first();
    if(taskTitleTarget.length) {
        // Put title in miniPlatformHeader
        $("#task h1").appendTo(taskTitleTarget);
    } else {
        // Remove title, the platform displays it
        $("#task h1").remove();
    }

    window.addEventListener('resize', function() {
        quickAlgoInterface.onResize();
        }, false);

    // Set up task calls
    if(window.task) {
        // Add autoHeight = true to metadata sent back
        var beaverGetMetaData = window.task.getMetaData;
        window.task.getMetaData = function(callback) {
            beaverGetMetaData(function(res) {
                res.autoHeight = true;
                callback(res);
            });
        }

        // If platform still calls getHeight despite autoHeight set to true,
        // send back a fixed height of 720px to avoid infinite expansion
        window.task.getHeight = function(callback) {
            callback(720);
        }
    }
});
