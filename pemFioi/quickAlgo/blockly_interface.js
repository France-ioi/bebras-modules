/*
    blockly_interface:
        Blockly mode interface and running logic
*/

function getBlocklyInterface(maxBlocks, nbTestCases) {
   return {
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
      player: 0,
      workspace: null,
      prevWidth: 0,
      options: {},
      nbTestCases: 1,
      divId: 'blocklyDiv',
      hidden: false,
      trashInToolbox: false,
      languageStrings: window.LanguageStrings,
      startingBlock: true,
      mediaUrl: (window.location.protocol == 'file:' && modulesPath) ? modulesPath+'/img/blockly/' : "http://static3.castor-informatique.fr/contestAssets/blockly/",
      unloaded: false,
      quickAlgoInterface: window.quickAlgoInterface,

      glowingBlock: null,

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

         this.locale = locale;
         this.nbTestCases = nbTestCases;
         this.options = options;

         if (display) {
            this.loadHtml(nbTestCases);
            this.addExtraBlocks();
            this.createSimpleGeneratorsAndBlocks();
            var xml = this.getToolboxXml();
            var wsConfig = {
               toolbox: "<xml>"+xml+"</xml>",
               sounds: false,
               media: this.mediaUrl
            };
            wsConfig.comments = true;
            wsConfig.scrollbars = true;
            wsConfig.trashcan = true;
            if (options.readOnly) {
               wsConfig.readOnly = true;
            }
            if (this.scratchMode) {
               wsConfig.zoom = { startScale: 0.75 };
            }
            if(this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = $('#blocklyDiv').width() - 110;
            }

            // Clean events if the previous unload wasn't done properly
            Blockly.removeEvents();

            // Inject Blockly
            this.workspace = Blockly.inject(this.divId, wsConfig);

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

            $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
            this.workspace.addChangeListener(this.onChange.bind(this));
            this.onChange();
         } else {
            var tmpOptions = new Blockly.Options({});
            this.workspace = new Blockly.Workspace(tmpOptions);
         }

         this.programs = [];
         for (var iPlayer = this.mainContext.nbRobots - 1; iPlayer >= 0; iPlayer--) {
            this.programs[iPlayer] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
            this.languages[iPlayer] = "blockly";
            this.setPlayer(iPlayer);
            if(this.startingBlock) {
               var xml = this.getDefaultContent();

               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }
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
         this.savePrograms();
         var programs = this.programs;
         this.unloadLevel();
         $('#'+this.divId).html('');
         this.load(this.locale, true, this.nbTestCases, this.options);
         this.programs = programs;
         this.loadPrograms();
      },

      hiddenCheck: function() {
         // Check whether the Blockly editor is hidden
         var visible = $('#'+this.divId).is(':visible');
         if(this.hidden && visible) {
            this.hidden = false;
            // Reload the Blockly editor to remove display issues after
            // being hidden
            console.log('reload');
            this.reload();
            return; // it will be restarted by reload
         }
         this.hidden = !visible;
         this.hiddenCheckTimeout = setTimeout(this.hiddenCheck.bind(this), 500);
      },

      resetDisplayFct: function() {
         if(this.mainContext.runner) {
            this.mainContext.runner.reset();
         }
         if(this.scratchMode) {
            this.glowBlock(null);
         }
         if(this.quickAlgoInterface) {
            this.quickAlgoInterface.resetTestScores();
         }
         $('#errors').html('');
      },

      onChange: function(event) {
         var eventType = event ? event.constructor : null;

         var isBlockEvent = event ? (
            eventType === Blockly.Events.Create ||
            eventType === Blockly.Events.Delete ||
            eventType === Blockly.Events.Move ||
            eventType === Blockly.Events.Change) : true;

         if(isBlockEvent) {
            if(eventType === Blockly.Events.Create || eventType === Blockly.Events.Delete) {
               // Update the remaining blocks display
               var remaining = this.getRemainingCapacity(this.workspace);
               var optLimitBlocks = {
                  maxBlocks: maxBlocks,
                  remainingBlocks: Math.abs(remaining)
               };
               var strLimitBlocks = remaining < 0 ? this.strings.limitBlocksOver : this.strings.limitBlocks;
               $('#capacity').html(strLimitBlocks.format(optLimitBlocks));
               if(remaining == 0) {
                  quickAlgoInterface.blinkRemaining(4);
               } else if(remaining < 0) {
                  quickAlgoInterface.blinkRemaining(5, true);
               } else {
                  quickAlgoInterface.blinkRemaining(0); // reset
               }
            }

            if(!this.resetDisplay) {
               this.resetDisplay = debounce(this.resetDisplayFct.bind(this), 500, false);
            }
            this.resetDisplay();
         } else {
            Blockly.svgResize(this.workspace);
         }

         // Refresh the toolbox for new procedures (same with variables
         // but it's already handled correctly there)
         if(this.scratchMode && this.includeBlocks.groupByCategory) {
            this.workspace.toolbox_.refreshSelection();
         }
      },

      setIncludeBlocks: function(includeBlocks) {
         this.includeBlocks = includeBlocks;
      },

      getDefaultContent: function () {
         if (this.startingBlock) {
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

      checkRobotStart: function () {
         if(!this.startingBlock || !this.workspace) { return; }
         var blocks = this.workspace.getTopBlocks(true);
         for(var b=0; b<blocks.length; b++) {
            if(blocks[b].type == 'robot_start') { return;}
         }

         var xml = Blockly.Xml.textToDom(this.getDefaultContent())
         Blockly.Xml.domToWorkspace(xml, this.workspace);
      },

      setPlayer: function(newPlayer) {
         this.player = newPlayer;
         $("#selectPlayer").val(this.player);
         $(".robot0, .robot1").hide();
         $(".robot" + this.player).show();
      },

      changePlayer: function() {
         this.loadPlayer($("#selectPlayer").val());
      },

      loadPlayer: function(player) {
         this.savePrograms();
         this.player = player;
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            $(".robot" + iRobot).hide();
         }
         $(".robot" + this.player).show();

         $(".language_blockly, .language_javascript").hide();
         $(".language_" + this.languages[this.player]).show();

         var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
         $("#selectLanguage").val(this.languages[this.player]);
         if (this.languages[this.player] == "blockly") {
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

         this.checkRobotStart();

         this.programs[this.player].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.player].blocklyJS = this.getCode("javascript");
            //this.programs[this.player].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
            this.workspace.clear();
            this.cleanBlockIds(xml);
            Blockly.Xml.domToWorkspace(xml, this.workspace);
         }
         $("#program").val(this.programs[this.player].javascript);
      },

      loadExample: function(exampleObj) {
         var example = this.scratchMode ? exampleObj.scratch : exampleObj.blockly
         if (this.workspace != null && example) {
            var xml = Blockly.Xml.textToDom(example);
            this.cleanBlockIds(xml);



            // Remove robot_start
            if(xml.children.length == 1 && xml.children[0].getAttribute('type') == 'robot_start') {
               xml = xml.firstChild.firstChild;
            }

            // Shift to x=200 y=20 + offset
            if(!this.exampleOffset) { this.exampleOffset = 0; }
            xml.firstChild.setAttribute('x', 200 + this.exampleOffset);
            xml.firstChild.setAttribute('y', 20 + this.exampleOffset);
            // Add an offset of 10 each time, so if someone clicks the button
            // multiple times the blocks don't stack
            this.exampleOffset += 10;

            Blockly.Xml.domToWorkspace(xml, this.workspace);

            if(this.scratchMode) {
               this.glowBlock(this.glowingBlock);
               this.glowingBlock = xml.firstChild.getAttribute('id');
            } else {
               this.workspace.traceOn(true);
               this.workspace.highlightBlock(xml.firstChild.getAttribute('id'));
            }
         }
      },

      changeLanguage: function() {
         this.languages[this.player] = $("#selectLanguage").val();
         this.loadPlayer(this.player);
      },

      importFromBlockly: function() {
          //var player = $("#selectPlayer").val();
          var player = 0;
          this.programs[player].javascript = this.getCode("javascript");
          $("#program").val(this.programs[player].javascript);
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
                     if(!that.checkBlocksAreAllowed(xml)) {
                        //throw 'not allowed'; // TODO :: do something; for now do nothing as the system might not be complete
                     }
                     that.programs[that.player].blockly = code;
                     that.languages[that.player] = "blockly";
                  } catch(e) {
                     $("#errors").html('<span class="testError">'+that.strings.invalidContent+'</span>');
                  }
               } else {
                  that.programs[that.player].javascript = code;
                  that.languages[that.player] = "javascript";
               }
               that.loadPrograms();
               that.loadPlayer(that.player);
            }

            reader.readAsText(file);
         } else {
            $("#errors").html('<span class="testError">'+this.strings.unknownFileType+'</span>');
         }
      },

      saveProgram: function() {
         this.savePrograms();
         var code = this.programs[this.player][this.languages[this.player]];
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

      updateSize: function() {
         var panelWidth = 500;
         if (this.languages[this.player] == "blockly") {
            panelWidth = $("#blocklyDiv").width() - 10;
         } else {
            panelWidth = $("#program").width() + 20;
         }
         if (panelWidth != this.prevWidth) {
            if (this.languages[this.player] == "blockly") {
               if (this.trashInToolbox) {
                  Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               }
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
      },

      glowBlock: function(id) {
         // highlightBlock replacement for Scratch
         if(this.glowingBlock) {
            try {
               this.workspace.glowBlock(this.glowingBlock, false);
            } catch(e) {}
         }
         if(id) {
            this.workspace.glowBlock(id, true);
         }
         this.glowingBlock = id;
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
               $("#errors").html('<span class="testError">' + window.languageStrings.errorEmptyProgram + '</span>');
               return;
            }
         }

         this.savePrograms();

         var codes = [];
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            var language = this.languages[iRobot];
            if (language == "blockly") {
               language = "blocklyJS";
            }
            codes[iRobot] = this.getFullCode(this.programs[iRobot][language]);
         }
         that.highlightPause = false;
         if(that.getRemainingCapacity(that.workspace) < 0) {
            $("#errors").html('<span class="testError">'+this.strings.tooManyBlocks+'</span>');
            return;
         }
         if(!this.scratchMode) {
            that.workspace.traceOn(true);
            that.workspace.highlightBlock(null);
         }
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
      }
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
