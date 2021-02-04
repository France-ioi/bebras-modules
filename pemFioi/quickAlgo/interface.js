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
      quickAlgoImportLanguage();
      this.strings = window.languageStrings;

      var gridHtml = "<center>";
      gridHtml += "<div id='gridButtonsBefore'></div>";
      gridHtml += "<div id='grid'></div>";
      gridHtml += "<div id='gridButtonsAfter'></div>";
      gridHtml += "</center>";
      $("#gridContainer").html(gridHtml)

      $("#blocklyLibContent").html(
         "<div id='editorBar'>" +
         "  <div id='editorButtons'></div>" +
         "  <div id='capacity'></div>" +
         "</div>" +
         "<div id='languageInterface'></div>" +
         "<div id='saveOrLoadModal' class='modalWrapper'></div>\n");

      // Upper right load buttons
      $("#editorButtons").html(
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
      if(!$('#displayHelper_cancel').length) {
         $('body').append($('<div class="contentCentered" style="margin-top: 15px;"><div id="displayHelper_cancel"></div></div>'));
      }

      var scaleControl = '';
      if(context.display && context.infos.buttonScaleDrawing) {
        var scaleControl = '<div class="scaleDrawingControl">' +
            '<label for="scaleDrawing"><input id="scaleDrawing" type="checkbox">' +
            this.strings.scaleDrawing +
            '</label>' +
            '</div>';
      }

      var gridButtonsAfter = scaleControl
        + "<div id='testSelector'></div>";
      if(!this.context || !this.context.infos || !this.context.infos.hideValidate) {
         gridButtonsAfter += ''
            + "<button type='button' id='submitBtn' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>"
            + this.strings.submitProgram
            + "</button><br/>";
      }
      gridButtonsAfter += "<div id='messages'><span id='tooltip'></span><span id='errors'></span></div>" + addTaskHTML;
      $("#gridButtonsAfter").html(gridButtonsAfter);
      $('#scaleDrawing').change(this.onScaleDrawingChange.bind(this));
   },

   bindBlocklyHelper: function(blocklyHelper) {
      this.blocklyHelper = blocklyHelper;
   },

   setOptions: function(opt) {
      // Load options from the task
      var hideControls = opt.hideControls ? opt.hideControls : {};
      $('#saveOrLoadBtn').toggle(!hideControls.saveOrLoad);
      $('#loadExampleBtn').toggle(!!opt.hasExample);
      if(opt.conceptViewer) {
         conceptViewer.load(opt.conceptViewerLang);
         $('#displayHelpBtn').show();
      } else {
         $('#displayHelpBtn').hide();
      }
   },

   appendPythonIntro: function(html) {
      $('#taskIntro').append('<hr class="pythonIntroElement long" />' + html);
   },

   // For compatibility with new interface
   toggleMoreDetails: function(forceNewState) {},
   toggleLongIntro: function(forceNewState) {},

   onScaleDrawingChange: function(e) {
      var scaled = $(e.target).prop('checked');
      $("#gridContainer").toggleClass('gridContainerScaled', scaled);
      $("#blocklyLibContent").toggleClass('blocklyLibContentScaled', scaled);
      this.context.setScale(scaled ? 2 : 1);
   },

   onEditorChange: function() {},
   onResize: function() {},
   updateBestAnswerStatus: function() {},

   blinkRemaining: function(times, red) {
      var capacity = $('#capacity');
      if(times % 2 == 0) {
         capacity.removeClass('capacityRed');
      } else {
         capacity.addClass('capacityRed');
      }
      this.delayFactory.destroy('blinkRemaining');
      if(times > (red ? 1 : 0)) {
         var that = this;
         this.delayFactory.createTimeout('blinkRemaining', function() { that.blinkRemaining(times - 1, red); }, 400);
      }
   },

   displayCapacity: function(info) {
      $('#capacity').html(info.text ? info.text : '');
      if(info.invalid) {
         this.blinkRemaining(11, true);
      } else if(info.warning) {
         this.blinkRemaining(6);
      } else {
         this.blinkRemaining(0);
      }
   },


   initTestSelector: function (nbTestCases) {
      // Create the DOM for the tests display (typically on the left side)
      this.nbTestCases = nbTestCases;

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

      var html = '<div class="panel-group">';
      for(var iTest=0; iTest<this.nbTestCases; iTest++) {
         html += '<div id="testPanel'+iTest+'" class="panel panel-default">';
         if(this.nbTestCases > 1) {
            html += '  <div class="panel-heading" onclick="task.displayedSubTask.changeTestTo('+iTest+')"><h4 class="panel-title"></h4></div>';
         }
         html += '  <div class="panel-body">'
              + selectSpeed
              +  '  </div>'
              +  '</div>';
      }
      $('#testSelector').html(html);

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
      }
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
      $('.selectSpeed button').click(selectSpeedClickHandler);
      $('.selectSpeed button').hover(selectSpeedHoverHandler, selectSpeedHoverClear);


      this.updateTestSelector(0);
      this.resetTestScores();
   },

   updateTestScores: function (testScores) {
      // Display test results
      for(var iTest=0; iTest<testScores.length; iTest++) {
         if(!testScores[iTest]) { continue; }
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
         $('#testPanel'+iTest+' .panel-title').html(icon+' Test '+(iTest+1)+' '+label);
      }
   },

   resetTestScores: function () {
      // Reset test results display
      for(var iTest=0; iTest<this.nbTestCases; iTest++) {
         $('#testPanel'+iTest+' .panel-title').html('<span class="testResultIcon">&nbsp;</span> Test '+(iTest+1));
      }
   },

   updateTestSelector: function (newCurTest) {
      $("#testSelector .panel-body").hide();
      $("#testSelector .panel").removeClass('currentTest');
      $("#testPanel"+newCurTest).addClass('currentTest');
      $("#testPanel"+newCurTest+" .panel-body").prepend($('#grid')).append($('#messages')).show();
   },

   unloadLevel: function() {
      // Called when level is unloaded
      this.resetTestScores();
   },

   saveOrLoad: function () {
      $("#saveOrLoadModal").show();
   },

   displayNotification: function() {
      // Not implemented
   },

   displayError: function(message) {
      message ? $('#errors').html(message) : $('#errors').empty();
   },

   displayResults: function(mainResults, worstResults) {
      this.displayError('<span class="testError">'+mainResults.message+'</span>');
   },

   setPlayPause: function(isPlaying) {}, // Does nothing

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
   },

   updateControlsDisplay: function() {},
   setValidating: function() {}
};
