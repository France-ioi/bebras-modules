/*
    interface:
        Main interface for quickAlgo, common to all languages.
*/

var quickAlgoInterface = {
   strings: {},
   nbTestCases: 0,
   delayFactory: new DelayFactory(),

   loadInterface: function(context) {
      // Load quickAlgo interface into the DOM
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
         "  <div id='capacity'></div>" +
         "  <div id='editorMenuContainer'><button type='button' id='toggleEditorMenu'><i>≡</i></button><div id='editorMenu' style='display:none'></div></div>" +
         "</div>" +
         "<div id='languageInterface'></div>" +
         "<div id='saveOrLoadModal' class='modalWrapper'></div>\n");

      // load editor menu
      $("#editorMenuContainer button").on( "click", function() {
         $("#editorMenu").toggle();
      });
      $("#editorMenu").html(
         "<button type='button' id='displayHelpBtn' class='btn btn-xs btn-default' style='display: none;' onclick='conceptViewer.show()'>" +
         "?" +
         "</button>&nbsp;" +
         "<button type='button' id='loadExampleBtn' class='btn btn-xs btn-default' style='display: none;' onclick='task.displayedSubTask.loadExample()'>" +
         this.strings.loadExample +
         "</button>&nbsp;" +
         "<button type='button' id='saveOrLoadBtn' class='btn btn-xs btn-default' onclick='quickAlgoInterface.saveOrLoad()'>" +
         this.strings.saveOrLoadButton +
         "</button>");

      var saveOrLoadModal = "<div class='modal'>" +
                            "    <p><b>" + this.strings.saveOrLoadProgram + "</b></p>\n" +
                            "    <button type='button' class='btn' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' >" + this.strings.saveProgram +
                            "</button><span id='saveUrl'></span>\n" +
                            "    <p>" + this.strings.avoidReloadingOtherTask + "</p>\n" +
                            "    <p>" + this.strings.reloadProgram + " <input type='file' id='input' " +
                            "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'></p>\n" +
                            "    <button type='button' class='btn close' onclick='closeModal(`saveOrLoadModal`)' >x</button>"
                            "</div>";
      $("#saveOrLoadModal").html(saveOrLoadModal);

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
   },

   setOptions: function(opt) {
      // Load options from the task
      if(opt.hideSaveOrLoad) {
         $('#saveOrLoadBtn').hide();
      } else {
         $('#saveOrLoadBtn').show();
      }
      if(opt.hasExample) {
         $('#loadExampleBtn').show();
      } else {
         $('#loadExampleBtn').hide();
      }
      if(opt.conceptViewer) {
         conceptViewer.load(opt.conceptViewerLang);
         $('#displayHelpBtn').show();
      } else {
         $('#displayHelpBtn').hide();
      }
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

   initTestSelector: function (nbTestCases) {
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

      // Create Player buttons to play the tests
      // TODO: move out of initTestSelector(), load only once
      var buttons = [
         {cls: 'speedStop', label: this.strings.stopProgram, tooltip: this.strings.stopProgramDesc, onclick: 'task.displayedSubTask.stop()'},
         {cls: 'speedStep', label: this.strings.stepProgram, tooltip: this.strings.stepProgramDesc, onclick: 'task.displayedSubTask.step()'},
         {cls: 'speedSlow', label: this.strings.slowSpeed, tooltip: this.strings.slowSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(200)'},
         {cls: 'speedMedium', label: this.strings.mediumSpeed, tooltip: this.strings.mediumSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(50)'},
         {cls: 'speedFast', label: this.strings.fastSpeed, tooltip: this.strings.fastSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(5)'},
         {cls: 'speedLudicrous', label: this.strings.ludicrousSpeed, tooltip: this.strings.ludicrousSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(0)'}
      ];

      var selectSpeed = "<div class='selectSpeed'>" +
                        "  <div class='btn-group'>\n";
      for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
         var btn = buttons[btnIdx];
         selectSpeed += "    <button type='button' class='"+btn.cls+" btn btn-default btn-icon'>"+btn.label+" </button>\n";
      }
      selectSpeed += "  </div></div>";

      var selectSpeedClickHandler = function () {
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               $('#tooltip').html(btnInfo.tooltip + '<br>');
               eval(btnInfo.onclick);
               break;
            }
         }
      };
      var selectSpeedHoverHandler = function () {
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               $('#tooltip').html(btnInfo.tooltip + '<br>');
               break;
            }
         }
      };
      var selectSpeedHoverClear = function () {
         // Only clear #tooltip if the tooltip was for this button
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               if($('#tooltip').html() == btnInfo.tooltip + '<br>') {
                  $('#tooltip').html('');
               }
               break;
            }
         }
      };

      // TODO :: better display functions for #errors
      $('#task').append(selectSpeed);
      $('.selectSpeed button').click(selectSpeedClickHandler);
      $('.selectSpeed button').hover(selectSpeedHoverHandler, selectSpeedHoverClear);
   },

   updateTestScores: function (testScores) {
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

   saveOrLoad: function () {
      $("#saveOrLoadModal").show();
   }
};
$(document).ready(function() {
   function wrapIntroAndGrid() {
      $('#taskIntro, #gridContainer').wrapAll("<div id='introGrid'></div>");
   }
   function createModeSelectorButtons() {
      $("#task").append('\
      <div id="modeSelector">\
         <button type="button" data-mode="instructions" id="mode-instructions">Instructions</button>\
         <button type="button" data-mode="player" id="mode-player">Player</button>\
         <button type="button" data-mode="editor" id="mode-editor">Editor</button>\
      </div>');
   }
   function selectMode() {
      var modeClass = '';
      var oldModeClass = 'mode-instructions';
      $("#modeSelector button").on( "click", function() {
         var selectedMode = $(this).data('mode');
         modeClass = 'mode-' + selectedMode;
         if (oldModeClass !== modeClass) {
            $("#task").removeClass(oldModeClass);
            $("#task").addClass(modeClass);
         }
         oldModeClass = modeClass;
      });
   }
   function buildPage() {
      $("#task h1").appendTo($("#miniPlatformHeader table td").first());
      wrapIntroAndGrid();
      $("#task").addClass('mode-instructions');
      createModeSelectorButtons();
      selectMode();
   }
   buildPage();
});


