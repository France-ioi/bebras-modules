/*
    blockly_interface:
        Blockly mode interface and running logic
*/

function getBlocklyInterface(maxBlocks, nbTestCases) {
   return {
      isBlockly: true,
      scratchMode: (typeof Blockly.Blocks['control_if'] !== 'undefined'),
      maxBlocks: maxBlocks,
      textFile: null,
      extended: false,
      programs: [],
      language: (typeof Blockly.Blocks['control_if'] !== 'undefined') ? 'scratch' : 'blockly',
      languages: [],
      locale: 'fr',
      definitions: {},
      simpleGenerators: {},
      codeId: 0, // Currently edited node code
      workspace: null,
      prevWidth: 0,
      options: {},
      initialScale: 1,
      nbTestCases: 1,
      divId: 'blocklyDiv',
      hidden: false,
      trashInToolbox: false,
      languageStrings: window.LanguageStrings,
      startingBlock: true,
      mediaUrl: (
         (window.location.protocol == 'file:' && modulesPath)
            ? modulesPath+'/img/blockly/'
            : (window.location.protocol == 'https:' ? 'https:' : 'http:') + "//static4.castor-informatique.fr/contestAssets/blockly/"
         ),
      unloaded: false,
      reloadForFlyout: 0,
      display: false,
      readOnly: false,
      reportValues: true,
      quickAlgoInterface: window.quickAlgoInterface,

      highlightedBlocks: [],

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {},
         standardBlocks: {
            includeAll: true,
            wholeCategories: [],
            singleBlocks: []
         }
      },

      loadHtml: function(nbTestCases) {
         $("#languageInterface").html("<xml id='toolbox' style='display: none'></xml>" +
                                     "  <div style='height: 40px;display:none' id='lang'>" +
                                     "    <p>" + this.strings.selectLanguage +
                                     "      <select id='selectLanguage' onchange='task.displayedSubTask.blocklyHelper.changeLanguage()'>" +
                                     "        <option value='blockly'>" + this.strings.blocklyLanguage + "</option>" +
                                     "        <option value='javascript'>" + this.strings.javascriptLanguage + "</option>" +
                                     "      </select>" +
                                     "      <input type='button' class='language_javascript' value='" + this.strings.importFromBlockly +
                                     "' style='display:none' onclick='task.displayedSubTask.blocklyHelper.importFromBlockly()' />" +
                                     "    </p>" +
                                     "  </div>" +
                                     "  <div id='blocklyContainer'>" +
                                     "    <div id='blocklyDiv' class='language_blockly'></div>" +
                                     "    <textarea id='program' class='language_javascript' style='width:100%;height:100%;display:none'></textarea>" +
                                     "  </div>\n");

         if(this.scratchMode) {
            $("submitBtn").html("<img src='" + this.mediaUrl + "icons/event_whenflagclicked.svg' height='32px' width='32px' style='vertical-align: middle;'>" + $("submitBtn").html());
         }
      },

      loadContext: function (mainContext) {
         this.mainContext = mainContext;
         this.createGeneratorsAndBlocks();
      },

      load: function(locale, display, nbTestCases, options) {
         this.unloaded = false;

         FioiBlockly.loadLanguage(locale);

         if(this.scratchMode) {
            this.fixScratch();
         }

         if (options == undefined) options = {};
         if (options.divId) this.divId = options.divId;

         this.strings = window.languageStrings;
         if (options.startingBlockName) {
            this.strings.startingBlockName = options.startingBlockName;
         }

         if (options.maxListSize) {
            FioiBlockly.maxListSize = options.maxListSize;
         }

         this.locale = locale;
         this.nbTestCases = nbTestCases;
         this.options = options;

         this.addExtraBlocks();
         this.createSimpleGeneratorsAndBlocks();

         this.display = display;

         if (display) {
            this.loadHtml(nbTestCases);
            var xml = this.getToolboxXml();
            var wsConfig = {
               toolbox: "<xml>"+xml+"</xml>",
               comments: true,
               sounds: false,
               trashcan: true,
               media: this.mediaUrl,
               scrollbars: true,
               zoom: { startScale: 1 }
            };

            if(typeof options.scrollbars != 'undefined') { wsConfig.scrollbars = !!options.scrollbars; }
            // IE <= 10 needs scrollbars
            if(navigator.userAgent.indexOf("MSIE") > -1) { wsConfig.scrollbars = true; }

            wsConfig.readOnly = !!options.readOnly || this.readOnly;
            if(options.zoom) {
               wsConfig.zoom.controls = !!options.zoom.controls;
               wsConfig.zoom.startScale = options.zoom.scale ? options.zoom.scale : 1;
            }
            if (this.scratchMode) {
               wsConfig.zoom.startScale = wsConfig.zoom.startScale * 0.75;
            }
            this.initialScale = wsConfig.zoom.startScale;
            if(wsConfig.zoom.controls && window.blocklyUserScale) {
               wsConfig.zoom.startScale *= window.blocklyUserScale;
            }
            if(this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = $('#blocklyDiv').width() - 110;
            }

            // Clean events if the previous unload wasn't done properly
            Blockly.removeEvents();

            // Inject Blockly
            window.blocklyWorkspace = this.workspace = Blockly.inject(this.divId, wsConfig);

            // Start checking whether it's hidden, to sort out contents
            // automatically when it's displayed
            if(this.hiddenCheckTimeout) {
               clearTimeout(this.hiddenCheckTimeout);
            }
            if(!options.noHiddenCheck) {
               this.hiddenCheckTimeout = setTimeout(this.hiddenCheck.bind(this), 0);
            }

            var toolboxNode = $('#toolboxXml');
            if (toolboxNode.length != 0) {
               toolboxNode.html(xml);
            }

            // Restore clipboard if allowed
            if(window.blocklyClipboardSaved) {
               if(this.checkBlocksAreAllowed(window.blocklyClipboardSaved)) {
                  Blockly.clipboardXml_ = window.blocklyClipboardSaved;
               } else {
                  // Set to false to indicate that blocks were disallowed
                  Blockly.clipboardXml_ = false;
               }
               Blockly.clipboardSource_ = this.workspace;
            }

            $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
            this.workspace.addChangeListener(this.onChange.bind(this));
            this.onChange();
         } else {
            var tmpOptions = new Blockly.Options({});
            this.workspace = new Blockly.Workspace(tmpOptions);
         }

         this.programs = [];
         for (var iCode = this.mainContext.nbCodes - 1; iCode >= 0; iCode--) {
            this.programs[iCode] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
            this.languages[iCode] = "blockly";
            this.setCodeId(iCode);
            if(this.startingBlock || options.startingExample) {
               var xml = this.getDefaultContent();
               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }

         if(window.quickAlgoInterface) { quickAlgoInterface.updateControlsDisplay(); }
      },

      unloadLevel: function() {
         if(this.hiddenCheckTimeout) {
            clearTimeout(this.hiddenCheckTimeout);
         }
         this.unloaded = true; // Prevents from saving programs after unload

         try {
            // Need to hide the WidgetDiv before disposing of the workspace
            Blockly.WidgetDiv.hide();
         } catch(e) {}

         // Save clipboard
         if(this.display && Blockly.clipboardXml_) {
            window.blocklyClipboardSaved = Blockly.clipboardXml_;
         }

         var ws = this.workspace;
         if (ws != null) {
            try {
               ws.dispose();
            } catch(e) {}
         }
      },

      unload: function() {
         if(this.hiddenCheckTimeout) {
            clearTimeout(this.hiddenCheckTimeout);
         }
         this.unloadLevel();
         removeBlockly();
      },

      reload: function() {
         // Reload Blockly editor
         this.reloading = true;
         this.savePrograms();
         var programs = this.programs;
         this.unloadLevel();
         $('#'+this.divId).html('');
         this.load(this.locale, true, this.nbTestCases, this.options);
         this.programs = programs;
         this.loadPrograms();
         if(window.quickAlgoInterface) {
            quickAlgoInterface.onResize();
         }
         this.reloading = false;
      },

      setReadOnly: function(newState) {
         if(!!newState == this.readOnly) { return; }
         this.readOnly = !!newState;

         // options.readOnly has priority
         if(this.options.readOnly) { return; }

         this.reload();
      },

      onResizeFct: function() {
         // onResize function to be called by the interface
         if(document.documentElement.clientHeight < 600 || document.documentElement.clientWidth < 800) {
            FioiBlockly.trashcanScale = 0.75;
            FioiBlockly.zoomControlsScale = 0.9;
         } else {
            FioiBlockly.trashcanScale = 1;
            FioiBlockly.zoomControlsScale = 1;
         }
         Blockly.svgResize(this.workspace);

         // Reload Blockly if the flyout is not properly rendered
         // TODO :: find why it's not properly rendered in the first place
         if(!this.scratchMode && this.workspace.flyout_ && this.reloadForFlyout < 5) {
            var flyoutWidthDiff = Math.abs(this.workspace.flyout_.svgGroup_.getBoundingClientRect().width -
               this.workspace.flyout_.svgBackground_.getBoundingClientRect().width);
            if(flyoutWidthDiff > 5) {
               this.reloadForFlyout += 1;
               this.reload();
            }
         }
      },

      onResize: function() {
         // This function will replace itself with the debounced onResizeFct
         this.onResize = debounce(this.onResizeFct.bind(this), 500, false);
         this.onResizeFct();
      },

      hiddenCheck: function() {
         // Check whether the Blockly editor is hidden
         var visible = $('#'+this.divId).is(':visible');
         if(this.hidden && visible) {
            this.hidden = false;
            // Reload the Blockly editor to remove display issues after
            // being hidden
            this.reload();
            return; // it will be restarted by reload
         }
         this.hidden = !visible;
         this.hiddenCheckTimeout = setTimeout(this.hiddenCheck.bind(this), 500);
      },

      onChangeResetDisplayFct: function() {
         if(this.unloaded || this.reloading) { return; }
         if(this.mainContext.runner) {
            this.mainContext.runner.reset();
         }
         this.highlightBlock(null);
         if(this.quickAlgoInterface && !this.reloading) {
            this.quickAlgoInterface.resetTestScores();
         }
         if(this.keepDisplayedError) {
            // Do not clear the error this time
            this.keepDisplayedError = false;
         } else {
            this.displayError('');
         }
      },

      onChangeResetDisplay: function() {
         // This function will replace itself with the debounced onChangeResetDisplayFct
         this.onChangeResetDisplay = debounce(this.onChangeResetDisplayFct.bind(this), 500, false);
         this.onChangeResetDisplayFct();
      },

      resetDisplay: function() {
         this.highlightBlock(null);
         if(!this.scratchMode && Blockly.selected) {
            // Do not execute that while the user is moving blocks around
            Blockly.selected.unselect();
         }
      },

      getCapacityInfo: function() {
         var remaining = 1;
         var text = '';
         if(maxBlocks) {
            // Update the remaining blocks display
            remaining = this.getRemainingCapacity(this.workspace);
            var optLimitBlocks = {
               maxBlocks: maxBlocks,
               remainingBlocks: Math.abs(remaining)
            };
            var strLimitBlocks = remaining < 0 ? this.strings.limitBlocksOver : this.strings.limitBlocks;
            text = strLimitBlocks.format(optLimitBlocks);
         }

         if(remaining < 0) {
            return {text: text, invalid: true, type: 'capacity'};
         }

         // We're over the block limit, is there any block used too often?
         var limited = this.findLimited(this.workspace);
         if(limited) {
            return {text: this.strings.limitedBlock+' "'+this.getBlockLabel(limited)+'".', invalid: true, type: 'limited'};
         } else if(remaining == 0) {
            return {text: text, warning: true, type: 'capacity'};
         }
         return {text: text, type: 'capacity'};
      },

      onChange: function(event) {
         var eventType = event ? event.constructor : null;

         var isBlockEvent = event ? (
            eventType === Blockly.Events.Create ||
            eventType === Blockly.Events.Delete ||
            eventType === Blockly.Events.Move ||
            eventType === Blockly.Events.Change) : true;

         if(isBlockEvent) {
            var capacityInfo = this.getCapacityInfo();
            if(window.quickAlgoInterface) {
               if(eventType === Blockly.Events.Move) {
                  // Only display popup when we drop the block, not on creation
                  capacityInfo.popup = true;
               }
               window.quickAlgoInterface.displayCapacity(capacityInfo);
               window.quickAlgoInterface.onEditorChange();
            } else {
               $('#capacity').html(capacityInfo.text);
            }
            this.onChangeResetDisplay();
         } else {
            Blockly.svgResize(this.workspace);
         }

         // Refresh the toolbox for new procedures (same with variables
         // but it's already handled correctly there)
         if(this.scratchMode && this.includeBlocks.groupByCategory && this.workspace.toolbox_) {
            this.workspace.toolbox_.refreshSelection();
         }
      },

      setIncludeBlocks: function(includeBlocks) {
         this.includeBlocks = includeBlocks;
      },

      getEmptyContent: function() {
         if(this.startingBlock) {
            if(this.scratchMode) {
               return '<xml><block type="robot_start" deletable="false" movable="false" x="10" y="20"></block></xml>';
            } else {
               return '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
            }
         }
         else {
            return '<xml></xml>';
         }
      },

      getDefaultContent: function() {
         if(this.options.startingExample) {
            var xml = this.options.startingExample[this.language];
            if(xml) { return xml; }
         }
         return this.getEmptyContent();
      },

      checkRobotStart: function () {
         if(!this.startingBlock || !this.workspace) { return; }
         var blocks = this.workspace.getTopBlocks(true);
         for(var b=0; b<blocks.length; b++) {
            if(blocks[b].type == 'robot_start') { return;}
         }

         var xml = Blockly.Xml.textToDom(this.getEmptyContent())
         Blockly.Xml.domToWorkspace(xml, this.workspace);
      },

      getOrigin: function() {
         // Get x/y origin
         if(this.includeBlocks.groupByCategory && typeof this.options.scrollbars != 'undefined' && !this.options.scrollbars) {
            return this.scratchMode ? {x: 340, y: 20} : {x: 105, y: 2};
         }
         return this.scratchMode ? {x: 4, y: 20} : {x: 2, y: 2};
      },

      // TODO :: New version of these three functions when we'll have multiple
      // node programs we can edit
      setCodeId: function(newCodeId) {
         this.codeId = newCodeId;
         $("#selectCodeId").val(this.codeId);
         $(".robot0, .robot1").hide();
         $(".robot" + this.codeId).show();
      },

      changeCodeId: function() {
         this.loadCodeId($("#selectCodeId").val());
      },

      loadCodeId: function(codeId) {
         this.savePrograms();
         this.codeId = codeId;
         for (var iCode = 0; iCode < this.mainContext.nbCodes; iCode++) {
            $(".robot" + iCode).hide();
         }
         $(".robot" + this.codeId).show();

         $(".language_blockly, .language_javascript").hide();
         $(".language_" + this.languages[this.codeId]).show();

         var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
         $("#selectLanguage").val(this.languages[this.codeId]);
         if (this.languages[this.codeId] == "blockly") {
            blocklyElems.show();
         } else {
            blocklyElems.hide();
            $(".blocklyTooltipDiv").hide();
         }
         this.loadPrograms();
      },

      savePrograms: function() {
         if(this.unloaded) {
            console.error('savePrograms called after unload');
            return;
         }

         // Save zoom
         if(this.display && this.workspace.scale) {
             window.blocklyUserScale = this.workspace.scale / this.initialScale;
         }

         this.checkRobotStart();

         this.programs[this.codeId].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.cleanBlockAttributes(xml);

            // The additional variable contain all additional things that we can save, for example quickpi sensors,
            // subject title when edition is enabled...
            var additional = {};

            if (this.quickAlgoInterface.saveSubject)
               this.quickAlgoInterface.saveSubject(additional);

            var additionalNode = document.createElement("additional");
            additionalNode.innerText = JSON.stringify(additional);
            xml.appendChild(additionalNode);

            this.programs[this.codeId].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.codeId].blocklyJS = this.getCode("javascript");
            //this.programs[this.codeId].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.codeId].blockly);
            this.workspace.clear();
            this.cleanBlockAttributes(xml, this.getOrigin());
            Blockly.Xml.domToWorkspace(xml, this.workspace);

            var additionalXML = xml.getElementsByTagName("additional");
            if (additionalXML.length > 0) {
               var additional = JSON.parse(additionalXML[0].innerText);
               // load additional from quickAlgoInterface
               if (this.quickAlgoInterface.loadAdditional) {
                  this.quickAlgoInterface.loadAdditional(additional);
               }
            }
         }
         $("#program").val(this.programs[this.codeId].javascript);
      },

      loadProgramFromDom: function(xml) {
         if(!this.checkBlocksAreAllowed(xml)) {
            return;
         }

         // Shift to x=200 y=20 + offset
         if(!this.exampleOffset) { this.exampleOffset = 0; }
         var origin = this.getOrigin();
         origin.x += 200 + this.exampleOffset;
         origin.y += 20 + this.exampleOffset;
         // Add an offset of 10 each time, so if someone clicks the button
         // multiple times the blocks don't stack
         this.exampleOffset += 10;

         // Remove robot_start
         if(xml.children.length == 1 && xml.children[0].getAttribute('type') == 'robot_start') {
            xml = xml.firstChild.firstChild;
         }

         this.cleanBlockAttributes(xml, origin);

         Blockly.Xml.domToWorkspace(xml, this.workspace);

         this.highlightBlock(xml.firstChild.getAttribute('id'));
      },

      loadExample: function(exampleObj) {
         var example = this.scratchMode ? exampleObj.scratch : exampleObj.blockly
         if (this.workspace != null && example) {
            var xml = Blockly.Xml.textToDom(example);
            this.loadProgramFromDom(xml);
         }
      },

      changeLanguage: function() {
         this.languages[this.codeId] = $("#selectLanguage").val();
         this.loadCodeId(this.codeId);
      },

      importFromBlockly: function() {
          var codeId = 0;
          this.programs[this.codeId].javascript = this.getCode("javascript");
          $("#program").val(this.programs[this.codeId].javascript);
      },

      handleFiles: function(files) {
         var that = this;
         if (files.length < 0) {
            return;
         }
         var file = files[0];
         var textType = /text.*/;
         if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
               var code = reader.result;
               if (code[0] == "<") {
                  try {
                     var xml = Blockly.Xml.textToDom(code);
                     that.cleanBlockAttributes(xml);
                     if(!that.checkBlocksAreAllowed(xml)) {
                        throw 'not allowed'; // TODO :: check it's working properly
                     }
                     that.programs[that.codeId].blockly = code;
                     that.languages[that.codeId] = "blockly";
                  } catch(e) {
                     that.displayError('<span class="testError">'+that.strings.invalidContent+'</span>');
                     that.keepDisplayedError = true;
                  }
               } else {
                  that.programs[that.codeId].javascript = code;
                  that.languages[that.codeId] = "javascript";
               }
               that.loadPrograms();
               that.loadCodeId(that.codeId);
            }

            reader.readAsText(file);
         } else {
            that.displayError('<span class="testError">'+this.strings.unknownFileType+'</span>');
            that.keepDisplayedError = true;
         }
      },

      saveProgram: function() {
         this.savePrograms();
         var code = this.programs[this.codeId][this.languages[this.codeId]];
         var data = new Blob([code], {type: 'text/plain'});

         // If we are replacing a previously generated file we need to
         // manually revoke the object URL to avoid memory leaks.
         if (this.textFile !== null) {
           window.URL.revokeObjectURL(this.textFile);
         }

         this.textFile = window.URL.createObjectURL(data);

         // returns a URL you can use as a href
         $("#saveUrl").html(" <a id='downloadAnchor' href='" + this.textFile + "' download='robot_" + this.language + "_program.txt'>" + this.strings.download + "</a>");
         var downloadAnchor = document.getElementById('downloadAnchor');
         downloadAnchor.click();
         return this.textFile;
      },

      toggleSize: function() {
         if (!this.extended) {
            this.extended = true;
            $("#blocklyContainer").css("width", "800px");
            $("#extendButton").val("<<");
         } else {
            this.extended = false;
            $("#blocklyContainer").css("width", "500px");
            $("#extendButton").val(">>");
         }
         this.updateSize();
      },

      updateSize: function(force) {
         if(window.experimentalSize) {
            // Temporary test
            var isPortrait = $(window).width() <= $(window).height();
            if(isPortrait && !this.wasPortrait) {
               this.reload();
            }
            this.wasPortrait = isPortrait;
            $('#blocklyDiv').height($('#blocklyLibContent').height() - 34);
            $('#blocklyDiv').width($('#blocklyLibContent').width() - 4);
            if (this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
            }
            Blockly.svgResize(this.workspace);
            return;
         }
         var panelWidth = 500;
         if (this.languages[this.codeId] == "blockly") {
            panelWidth = $("#blocklyDiv").width() - 10;
         } else {
            panelWidth = $("#program").width() + 20;
         }
         if (force || panelWidth != this.prevWidth) {
            if (this.languages[this.codeId] == "blockly") {
               if (this.trashInToolbox) {
                  Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               }
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
      },

      highlightBlock: function(id, keep) {
         if(!id) { keep = false; }

         if(!keep) {
            for(var i = 0; i < this.highlightedBlocks.length; i++) {
               var bid = this.highlightedBlocks[i];
               if(this.scratchMode) {
                  try {
                     this.workspace.glowBlock(bid, false);
                  } catch(e) {}
               } else {
                  var block = this.workspace.getBlockById(bid);
                  if(block) { block.removeSelect(); }
               }
            }
            this.highlightedBlocks = [];
         }

         if(this.scratchMode) {
            if(id) {
               this.workspace.glowBlock(id, true);
            }
         } else {
            this.workspace.traceOn(true);
            if(keep) {
               var block = this.workspace.getBlockById(id);
               if(block) { block.addSelect(); }
            } else {
               this.workspace.highlightBlock(id);
            }
         }

         if(id) {
            this.highlightedBlocks.push(id);
         }
      },

      initRun: function() {
         var that = this;
         var nbRunning = this.mainContext.runner.nbRunning();
         if (nbRunning > 0) {
            this.mainContext.runner.stop();
            this.mainContext.delayFactory.createTimeout("run" + Math.random(), function() {
               that.run()
            }, 1000);
            return;
         }
         if (this.mainContext.display) {
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
            Blockly.JavaScript.addReservedWords('highlightBlock');
         } else {
            Blockly.JavaScript.STATEMENT_PREFIX = '';
         }
         var topBlocks = this.workspace.getTopBlocks(true);
         var robotStartHasChildren = false;

         if (this.startingBlock) {
            for(var b=0; b<topBlocks.length; b++) {
               var block = topBlocks[b];
               if(block.type == 'robot_start' && block.childBlocks_.length > 0) {
                  robotStartHasChildren = true;
                  break;
               } // There can be multiple robot_start blocks sometimes
            }
            if(!robotStartHasChildren) {
               this.displayError('<span class="testError">' + window.languageStrings.errorEmptyProgram + '</span>');
               return;
            }
         }

         this.savePrograms();

         this.highlightPause = false;
         if(this.getRemainingCapacity(that.workspace) < 0) {
            this.displayError('<span class="testError">'+this.strings.tooManyBlocks+'</span>');
            return;
         }
         var limited = this.findLimited(this.workspace);
         if(limited) {
            this.displayError('<span class="testError">'+this.strings.limitedBlock+' "'+this.getBlockLabel(limited)+'".</span>');
            return;
         }
         if(!this.scratchMode) {
            this.highlightBlock(null);
         }
         var codes = this.getAllCodes();
         this.mainContext.runner.initCodes(codes);
      },


      run: function () {
         this.initRun();
         this.mainContext.runner.run();
      },

      step: function () {
         if(this.mainContext.runner.nbRunning() <= 0) {
            this.initRun();
         }
         this.mainContext.runner.step();
      },


      displayError: function(message) {
        if(this.quickAlgoInterface) {
            this.quickAlgoInterface.displayError(message);
            this.quickAlgoInterface.setPlayPause(false);
         } else {
            $('#errors').html(message);
         }
      },

      canPaste: function() {
         // Note that when changing versions, the clipboard is checked for
         // compatibility
         return Blockly.clipboardXml_ === null ? null : !!Blockly.clipboardXml_;
      },

      canConvertBlocklyToPython: function() {
         return true;
      },

      copyProgram: function() {
         var block = Blockly.selected;
         if(!block) {
            var blocks = this.workspace.getTopBlocks();
            for(var i=0; i<blocks.length; i++) {
               block = blocks[i];
               if(block.type == 'robot_start' && block.childBlocks_[0]) {
                  block = block.childBlocks_[0];
                  break;
               }
            }
         }
         Blockly.copy_(block);
      },

      pasteProgram: function() {
         if(Blockly.clipboardXml_ === false) {
            this.displayError(this.strings.clipboardDisallowedBlocks);
         }
         if(!Blockly.clipboardXml_) { return; }
         var xml = Blockly.Xml.textToDom('<xml>' + Blockly.Xml.domToText(Blockly.clipboardXml_) + '</xml>');
         this.loadProgramFromDom(xml);
      },

      hideSkulptAnalysis: function() {}
   }
}

function getBlocklyHelper(maxBlocks, nbTestCases) {
   // TODO :: temporary until splitting of the block functions logic is done
   var blocklyHelper = getBlocklyInterface(maxBlocks, nbTestCases);
   var blocklyBlockFunc = getBlocklyBlockFunctions(maxBlocks, nbTestCases);
   for(var property in blocklyBlockFunc) {
      blocklyHelper[property] = blocklyBlockFunc[property];
   }
   return blocklyHelper;
}

function removeBlockly() {
   $(".blocklyDropDownDiv").remove();
   $(".blocklyWidgetDiv").remove();
   $(".blocklyTooltipDiv").remove();
   Blockly.removeEvents();
   // delete Blockly;
}
