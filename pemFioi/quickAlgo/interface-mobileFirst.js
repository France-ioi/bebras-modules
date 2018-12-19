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
    taskIntroContent: '',

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
        var that = this;
        setTimeout(function() {
            that.onResize();
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
        var self = this;
        this.context = context;
        this.strings = window.languageStrings;

        var gridHtml = "";
        gridHtml += "<div id='gridButtonsBefore'></div>";
        gridHtml += "<div id='grid'></div>";
        gridHtml += "<div id='gridButtonsAfter'></div>";
        $("#gridContainer").html(gridHtml);

        var displayHelpBtn = this.hasHelp ? this.displayHelpBtn() : '';
        $("#blocklyLibContent").html(
            "<div id='editorBar'>" +
                "<div id='capacity'></div>" +
                "<div class='buttons'>" +
                "<button type='button' id='fullscreenButton'><span class='fas fa-expand'></span></button>" +
                displayHelpBtn +
                "</div>" +
            "</div>" +
            "<div id='languageInterface'></div>"
        );


        $('#fullscreenButton').click(function() {
            self.toggleFullscreen();
        });


        // TODO :: something cleaner (add when editorMenu is opened, remove when closed?)
        $('#editorMenu div[rel=example]').click(function(e) {
            self.closeEditorMenu();
            task.displayedSubTask.loadExample()
        });

        $('#editorMenu div[rel=save]').click(function(e) {
            self.closeEditorMenu();
            task.displayedSubTask.blocklyHelper.saveProgram();
        });

        $('#editorMenu div[rel=restart]').click(function(e) {
            self.closeEditorMenu();
            displayHelper.restartAll();
        });

        $('#editorMenu div[rel=best-answer]').click(function(e) {
            self.closeEditorMenu();
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
        this.createEditorMenu();
        this.setupTaskIntro(level);
        this.wrapIntroAndGrid();
        this.checkFonts();
        this.registerFullscreenEvents();
        if(!this.checkHeightInterval) {
            this.checkHeightInterval = setInterval(this.checkHeight.bind(this), 1000);
        }
        var that = this;
        setTimeout(function() {
            that.onResize();
            }, 0);
    },

    createEditorMenu: function() {
        var self = this;
        if(!$('#openEditorMenu').length) {
            $("#tabsContainer").append("<div id='openEditorMenu' class='icon'><span class='fas fa-bars'></span></div>");
        }
        if($('#editorMenu').length) { return; }
        $("body").append('' +
            "<div id='editorMenu' style='display: none;'>" +
                "<div class='editorMenuHeader'>" +
                    "<div id='closeEditorMenu'><span class='fas fa-times'></span></div>" +
                    "<div>Menu</div>" +
                "</div>" +
                "<div class='editorActions'>" +
                    "<div rel='example' class='item'><span class='fas fa-paste'></span> " + this.strings.loadExample + "</div>" +
                    "<div rel='restart' class='item'><span class='fas fa-trash-alt'></span> " + this.strings.restart + "</div>" +
                    "<div rel='save' class='item'><span class='fas fa-download'></span> " + this.strings.saveProgram + "</div>" +
                    "<div rel='best-answer' class='item'><span class='fas fa-trophy'></span> " + this.strings.loadBestAnswer+ "</div>" +
                    "<div rel='load' class='item'>" +
                        "<input type='file' id='task-upload-file' " +
                        "onchange='\
                            task.displayedSubTask.blocklyHelper.handleFiles(this.files);\
                            resetFormElement($(this));\
                            $(\"#editorMenu\").hide();'>" +
                        "<span class='fas fa-upload'></span> " +
                        this.strings.reloadProgram +
                    "</div>" +
                "</div>" +
                "<span id='saveUrl'></span>" +
            "</div>"
        );
        $('#openEditorMenu').click(function() {
            self.editorMenuIsOpen ? self.closeEditorMenu() : self.openEditorMenu();
        });
        $("#closeEditorMenu").click(function() {
            self.closeEditorMenu();
        });
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
        var scaled = $(e.target).prop('checked');
        $("#gridContainer").toggleClass('gridContainerScaled', scaled);
        $("#blocklyLibContent").toggleClass('blocklyLibContentScaled', scaled);
        this.context.setScale(scaled ? 2 : 1);
    },


    blinkRemaining: function(times, red) {
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
        var v = parseInt($('.speedCursor').val(), 10),
            delay = this.stepDelayMin + this.stepDelayMax - v;
        task.displayedSubTask.setStepDelay(delay);
    },

    initPlaybackControls: function() {
        var self = this;

        var speedControls =
            '<div class="speedControls">' +
                '<div class="playerControls">' +
                    '<div class="icon backToFirst"><span class="fas fa-fast-backward"></span></div>' +
                    '<div class="icon playPause play"><span class="fas fa-play-circle"></span></div>' +
                    '<div class="icon nextStep"><span class="fas fa-step-forward"></span></div>' +
                    '<div class="icon goToEnd"><span class="fas fa-fast-forward"></span></div>' +
                    '<div class="icon displaySpeedSlider"><span class="fas fa-tachometer-alt"></span></div>' +
                '</div>' +
                '<div class="speedSlider">' +
                    '<span class="icon hideSpeedSlider"><span class="fas fa-tachometer-alt"></span></span>' +
                    '<span class="icon speedSlower"><span class="fas fa-walking"></span></span>' +
                    '<input type="range" min="0" max="' +
                        (this.stepDelayMax - this.stepDelayMin) +
                        '" value="0" class="slider speedCursor"/>' +
                    '<span class="icon speedFaster"><span class="fas fa-running"></span></span>' +
                '</div>' +
            '</div>';
        $('#task').find('.speedControls').remove();
        // place speed controls depending on layout
        // speed controls in taskToolbar on mobiles
        // in intro on portrait tablets
        // in introGrid on other layouts (landscape tablets and desktop)

        $('#mode-player').append(speedControls);
        $('#introGrid').append(speedControls);

        $('.speedCursor').on('input change', function(e) {
            self.refreshStepDelay();
        });
        $('.speedSlower').click(function() {
            var el = $('.speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) - delta;
            el.val(Math.max(newVal, 0));
            self.refreshStepDelay();
        });
        $('.speedFaster').click(function() {
            var el = $('.speedCursor'),
                maxVal = parseInt(el.attr('max'), 10),
                delta = Math.floor(maxVal / 10),
                newVal = parseInt(el.val(), 10) + delta;
            el.val(Math.min(newVal, maxVal));
            self.refreshStepDelay();
        });

        $('.playerControls .backToFirst').click(function() {
            task.displayedSubTask.stop();
//            task.displayedSubTask.play();
//            self.setPlayPause(true);
        });

        $('.playerControls .playPause').click(function(e) {
            if($(this).hasClass('play')) {
                self.refreshStepDelay();
                task.displayedSubTask.play();
                self.setPlayPause(true);
            } else {
                task.displayedSubTask.pause();
                self.setPlayPause(false);
            }
        })

        $('.playerControls .nextStep').click(function() {
            self.setPlayPause(false);
            task.displayedSubTask.step();
        });

        $('.playerControls .goToEnd').click(function() {
            task.displayedSubTask.setStepDelay(0);
            task.displayedSubTask.play();
            self.setPlayPause(false);
        });

        $('.playerControls .displaySpeedSlider').click(function() {
            $('#mode-player').addClass('displaySpeedSlider');
        });

        $('.speedSlider .hideSpeedSlider').click(function() {
           $('#mode-player').removeClass('displaySpeedSlider');
        });
    },

    setPlayPause: function(isPlaying) {
        if(isPlaying) {
            $('.playerControls .playPause').html('<span class="fas fa-pause-circle"></span>');
            $('.playerControls .playPause').removeClass('play').addClass('pause');
        } else {
            $('.playerControls .playPause').html('<span class="fas fa-play-circle"></span>');
            $('.playerControls .playPause').removeClass('pause').addClass('play');
        }
    },

    initTestSelector: function (nbTestCases) {
        var self = this;
        // Create the DOM for the tests display
        this.nbTestCases = nbTestCases;

        var testTabs = '<div class="tabs">';
        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            if(this.nbTestCases > 1) {
                testTabs += '' +
                    '<div id="testTab'+iTest+'" class="testTab" onclick="task.displayedSubTask.changeTestTo('+iTest+')">' +
                        '<span class="testTitle"></span>' +
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
            $('#testTab'+iTest+' .testTitle').html(icon+' Test '+(iTest+1));
        }
    },

    resetTestScores: function () {
        // Reset test results display
        for(var iTest=0; iTest<this.nbTestCases; iTest++) {
            $('#testTab'+iTest+' .testTitle').html('<span class="testResultIcon">&nbsp;</span> Test '+(iTest+1));
        }
    },

    updateTestSelector: function (newCurTest) {
        $("#testSelector .testTab").removeClass('currentTest');
        $("#testTab"+newCurTest).addClass('currentTest');
        $("#task").append($('#messages'));
        //$("#testTab"+newCurTest+" .panel-body").prepend($('#grid')).append($('#messages')).show();
    },
    displayHelpBtn: function() {
        var helpBtn = '<button type="button" class="displayHelpBtn" onclick="conceptViewer.show()">\
            <span class="fas fa-question"></span></button>';
        return helpBtn;
    },
    createModeTaskToolbar: function() {
        if($('#taskToolbar').length) { return; }
        var displayHelpBtn = this.hasHelp ? this.displayHelpBtn() : '';
        var self = this;
        $("#task").append('' +
            '<div id="taskToolbar">' +
                '<div id="modeSelector">' +
                    '<div id="mode-instructions" class="mode">' +
                        '<span><span class="fas fa-file-alt"></span><span class="label ToTranslate">Énoncé</span></span>' +
                    '</div>' +
                    '<div id="mode-editor" class="mode">' +
                        '<span><span class="fas fa-pencil-alt"></span>' +
                        '<span class="label ToTranslate">Éditeur</span></span>' +
                        displayHelpBtn +
                    '</div>' +
                    '<div id="mode-player" class="mode">' +
                        '<span class="fas fa-play"></span>' +
                    '</div>' +
                '</div>' +
            '</div>');

        $('#modeSelector div').click(function() {
            self.selectMode($(this).attr('id'));
            self.onResize();
        })
    },

    selectMode: function(mode) {
        if(mode === this.curMode) return;
        $('#modeSelector').children('div').removeClass('active');
        $('#modeSelector #' + mode).addClass('active');
        $('#task').removeClass(this.curMode).addClass(mode);
        $('#mode-player').removeClass('displaySpeedSlider'); // there should be a better way to achieve this
        /*if(mode == 'mode-instructions') {
            $('#taskIntro .short').hide();
            $('#taskIntro .long').show();
        }
        if(mode == 'mode-player') {
            $('#taskIntro .short').show();
            $('#taskIntro .long').hide();
        }*/
        this.curMode = mode;
        this.onResize();
    },

    setupTaskIntro: function(level) {
        var self = this;
        if (! this.taskIntroContent.length ) {
            this.taskIntroContent = $('#taskIntro').html();
        }
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
                        '<h2 class="sectionTitle"><i class="fas fa-search-plus icon"></i>Détail de la mission</h2>' +
                        '<button type="button" class="closeLongIntro exit"><i class="fas fa-times"></i></button>' +
                    '</div><div class="panel-body">' +
                        this.taskIntroContent +
                    '</div>' +
                '<div>';
            $('#blocklyLibContent').append(introLong);
            $('#taskIntroLong .closeLongIntro').click(function(e) {
                self.toggleLongIntro(false);
            });
            if (! $('#taskIntro .sectionTitle').length) {
                var renderTaskIntro = '' +
                    '<h2 class="sectionTitle longIntroTitle">' +
                        '<span class="fas fa-book icon"></span>Énoncé' +
                    '</h2>' +
                    '<h2 class="sectionTitle shortIntroTitle">' +
                        '<span class="fas fa-book icon"></span>Votre mission' +
                    '</h2>' +
                    this.taskIntroContent +
                    '<button type="button" class="showLongIntro"></button>';
                $('#taskIntro').html(renderTaskIntro);
                $('#taskIntro .showLongIntro').click(function(e) {
                    self.toggleLongIntro();
                });
            }
            self.toggleLongIntro(false);
        }
        else {
            if (! $('#taskIntro .sectionTitle').length) {
                $('#taskIntro').prepend('' +
                    '<h2 class="sectionTitle longIntroTitle">' +
                        '<span class="fas fa-book icon"></span>Énoncé' +
                    '</h2>');
            }
        }
        if(level) {
            for(var otherLevel in displayHelper.levelsRanks) {
                $('.' + otherLevel).hide();
            }
            $('.' + level).show();
        }
    },

    toggleLongIntro: function(forceNewState) {
        if(forceNewState === false || this.longIntroShown) {
            $('#taskIntroLong').removeClass('displayIntroLong');
            $('.showLongIntro').html('<span class="fas fa-plus-circle icon"></span>Plus de détails</button>');
            this.longIntroShown = false;
        } else {
            $('#taskIntroLong').addClass('displayIntroLong');
            $('.showLongIntro').html('<span class="fas fa-minus-circle icon"></span>Masquer les détails</button>');
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
        // iOS) because of the toolbar
        var browserHeight = document.documentElement.clientHeight;
        $('body').css('height', browserHeight);

        var blocklyArea = document.getElementById('blocklyContainer');
        if(!blocklyArea) { return; }
        var blocklyDiv = document.getElementById('blocklyDiv');
        var toolbarDiv = document.getElementById('taskToolbar');
        var heightBeforeToolbar = toolbarDiv ? toolbarDiv.getBoundingClientRect().top - blocklyArea.getBoundingClientRect().top : Infinity;
        var heightBeforeWindow = browserHeight - blocklyArea.getBoundingClientRect().top - 10;
        if($('#taskToolbar').is(':visible') && window.innerHeight < window.innerWidth) {
            blocklyDiv.style.height = Math.floor(Math.min(heightBeforeToolbar, heightBeforeWindow)) + 'px';
        } else {
            blocklyDiv.style.height = Math.floor(heightBeforeWindow) + 'px';
        }
        if($('#miniPlatformHeader').length) {
            $('#task').css('height', (browserHeight - 40) + 'px');
        } else {
            $('#task').css('height', '');
        }

        Blockly.svgResize(window.blocklyWorkspace);
        task.displayedSubTask.updateScale();
    },

    checkHeight: function() {
        var browserHeight = document.documentElement.clientHeight;
        if(this.lastHeight !== null && this.lastHeight != browserHeight) {
            this.onResize();
        }
        this.lastHeight = browserHeight;
    },

    displayError: function(message) {
        $('.errorMessage').remove();
        if(!message) return;
        var html =
            '<div class="errorMessage">' +
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
        $(".errorMessage").show();
        $(".errorMessage").click(function(e) {
            $(e.currentTarget).hide();
        });
    },

    wrapIntroAndGrid: function() {
        if ($('#introGrid').length) { return; }
        $("#taskIntro, #gridContainer").wrapAll("<div id='introGrid'></div>");
    },

    checkFonts: function() {
        // Check if local fonts loaded properly, else use a CDN
        // (issue mostly happens when opening a task locally in Firefox)
        if(!document.fonts) { return; }
        document.fonts.ready.then(function() {
            // iOS will always return true to document.fonts.check
            var iOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

            if(iOS || !document.fonts.check('12px "Titillium Web"')) {
                if(!iOS && window.modulesPath) {
                    // Load fonts from CSS files with embedded fonts
                    if(window.embeddedFontsAdded) { return; }
                    $('head').append(''
                        + '<link rel="stylesheet" href="' + window.modulesPath + '/fonts/embed-titilliumweb.css">'
                        + '<link rel="stylesheet" href="' + window.modulesPath + '/fonts/embed-fontawesome.css">'
                        );
                    window.embeddedFontsAdded = true;
                } else {
                    // Load fonts from CDN
                    // (especially for iOS on which the embed doesn't work)
                    $('head').append(''
                        + '<link href="https://fonts.googleapis.com/css?family=Titillium+Web:300,400,700" rel="stylesheet">'
                        + '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">'
                        );
                }
            }
        });
    }
};


$(document).ready(function() {

    $('head').append('\
        <link rel="stylesheet"\
        href="../../modules/fonts/fontAwesome/css/all.css">');

    var taskTitleTarget = $("#miniPlatformHeader table td").first();
    if(taskTitleTarget.length) {
        // Put title in miniPlatformHeader
        $("#task h1").appendTo(taskTitleTarget);
    } else {
        // Remove title, the platform displays it
        $("#task h1").remove();
    }

    quickAlgoInterface.selectMode('mode-instructions');

    window.addEventListener('resize', quickAlgoInterface.onResize, false);

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
