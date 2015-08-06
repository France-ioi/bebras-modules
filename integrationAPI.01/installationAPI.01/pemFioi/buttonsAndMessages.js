'use strict';

/*
 * Implementation of the displayHelper API.
 *
 * Copyright (c) 2012 Association France-ioi, MIT License http://opensource.org/licenses/MIT
 *
 * See documentation for more information.
 */

var displayHelper = {
   loaded: true,
   checkAnswerInteral: null,
   prevAnswer: "",
   readOnly: false,
   savedAnswer: "",
   submittedAnswer: "",
   submittedScore: 0,
   hasAnswerChanged: true,
   taskSelector: "#task",
   hideValidateButton: false,
   hideRestartButton: false,
   showScore: false,
   refreshMessages: true,
   stoppedShowingResult: false,
   previousMessages: {},
   hasLevels: false,
   levelsScores: {easy: 0, medium: 0, hard: 0},
   prevLevelsScores: {easy: 0, medium: 0, hard: 0},
   taskLevel: "",
   /* *********************************************
    * Initialization functions called by the task *
    ***********************************************/
   
   load: function(views) {
      displayHelper.showScore = (typeof views.grader !== 'undefined' && views.grader === true);
      displayHelper.taskParams = platform.getTaskParams();
      displayHelper.readOnly = (displayHelper.taskParams.readonly == true || displayHelper.taskParams.readOnly == 'true');
      displayHelper.graderScore = +displayHelper.taskParams.noScore;
      displayHelper.savedAnswer = "";
      var addTaskHtml = "<center>";
      // place button placement at the end of html if they don't already exist
      if ($("#displayHelper_validate").length === 0) {
         addTaskHtml += "<span id='displayHelper_validate'></span>";
      }
      if ($("#displayHelper_cancel").length === 0) {
         addTaskHtml += "<span id='displayHelper_cancel'></span>";
      }
      if ($("#displayHelper_saved").length === 0) {
         addTaskHtml += "<span id='displayHelper_saved'></span>";
      }
      addTaskHtml += "</center>";
      $(displayHelper.taskSelector).append(addTaskHtml);
   },

   getLevelsMaxScores: function() {
      var taskParams = platform.getTaskParams();;
      var maxScore = taskParams.maxScore;
      return {
         easy: Math.round(maxScore / 2),
         medium: Math.round(3 * maxScore / 4),
         hard: maxScore
      };
   },

   getLevelsNames: function() {
      return { easy: "facile", medium: "moyenne", hard: "difficile" };
   },

   setupLevels: function(initLevel) {
      task.reloadStateObject(task.getDefaultStateObject(), true);
      task.reloadAnswerObject(task.getDefaultAnswerObject());
      displayHelper.hasLevels = true;
      var maxScores = displayHelper.getLevelsMaxScores();
      var tabsHtml = "<ul class='tabs-menu'>\n";
      var levelsNames = displayHelper.getLevelsNames();
      for (var curLevel in levelsNames) {
         tabsHtml += "   <li class='tab-" + curLevel + "'>" +
            "<a href='#"  + curLevel + "'><div style='display:inline-block;text-align:center'>" +
              "Version " + levelsNames[curLevel] + "<br/>" +
              "<span id='tabScore_" + curLevel + "'>0</span> points sur " + maxScores[curLevel] +
            "</div></a></li>\n";
      }
      tabsHtml += "</ul>";
      var scoreHtml = "<div style='float:right;margin-top:-15px;text-align:center;font-weight:bold'>" + 
         "<p>Score : <span id='best_score'>0</span> points sur " + maxScores.hard + "<br/>(meilleur des trois versions)</p></div>";
      $("#tabsContainer").before(scoreHtml + tabsHtml);
      $(".tabs-menu a").click(function(event) {
         event.preventDefault();
         var newLevel = $(this).attr("href").substring(1);
         displayHelper.setLevel(newLevel);
      });
      displayHelper.setLevel(initLevel);
   },
   
   setLevel: function(newLevel) {
      if (displayHelper.taskLevel == newLevel) {
         return;
      }
      $(".tab-easy, .tab-medium, .tab-hard").removeClass("current");
      $(".tab-" + newLevel).addClass("current");
      $(".easy, .medium, .hard").hide();
      $("." + newLevel).show();

      var answer = task.getAnswerObject();
      var state = task.getStateObject();
      state.level = newLevel;
      task.reloadStateObject(state, true);
      task.reloadAnswerObject(answer);
      
      displayHelper.taskLevel = newLevel;
      displayHelper.validate("stay");
      displayHelper.stopShowingResult();
   },

   // Function to call at the beginning of task loading, before any html has
   // been modified. It places the markers where the buttons will appear, if the
   // markers are not present already.
   showViews: function(views) {
      // fix for an old version of firefox in which selection was stuck
      try {
         if (document.getSelection) {
            var selection = document.getSelection();
            if (selection !== undefined && selection.removeAllRanges !== undefined) {
               selection.removeAllRanges();
            }
         }
      } catch (err) { }
      // end of fix
      displayHelper.views = views;
      displayHelper.hasSolution = (typeof views.solution !== 'undefined');
      if (displayHelper.hasSolution && displayHelper.graderScore) {
         displayHelper.prevSavedScore = displayHelper.graderScore;
      }
      displayHelper.checkAnswerInterval = setInterval(
         (function(self) {
         return function() {
             self.checkAnswerChanged();
         }
         })(this)
      , 1000);
      task.getAnswer(function(answer) {
         displayHelper.defaultAnswer = answer;
         displayHelper.refreshMessages = true;
         displayHelper.checkAnswerChanged();
      });
   },

   // function called at task unload
   unload: function() {
      this.loaded = false;
      this.checkAnswerInterval = clearInterval(this.checkAnswerInterval);
      return true;
   },

   reloadAnswer: function(strAnswer) {
      this.savedAnswer = strAnswer;
      this.prevAnswer = strAnswer;
      this.submittedAnswer = strAnswer;
      if (this.showScore) {
         this.updateScore(strAnswer, true);
      }
      displayHelper.checkAnswerChanged(); // necessary?
   },

   reloadState: function(state) {
      displayHelper.checkAnswerChanged(); // necessary?
   },

   stopShowingResult: function() {
      displayHelper.stoppedShowingResult = true;
      displayHelper.updateMessages();
   },
   /* ********************
    * Internal functions *
    **********************/

   restartAll: function() {
      displayHelper.stopShowingResult();
      if (!displayHelper.hasLevels) {
         task.reloadAnswer("", function() {})
      } else {
         task.getAnswer(function(strAnswer) {
            var answer = $.parseJSON(strAnswer);
            var defaultAnswer = task.getDefaultAnswerObject();
            answer[displayHelper.taskLevel] = defaultAnswer[displayHelper.taskLevel];
            task.reloadAnswer(JSON.stringify(answer), function() {});
         });
      }
   },

   validate: function(mode) {
      displayHelper.stoppedShowingResult = false;
      if (mode == "cancel") {
         displayHelper.savedAnswer = "";
         task.reloadAnswer("", function() {
            displayHelper.checkAnswerChanged();
         });
      } else {
         var that = this;
         task.getAnswer(function(answer) {
            if (!displayHelper.hasSolution) {
               that.prevSavedScore = that.graderScore;
               if (displayHelper.hasLevels) {
                  that.prevLevelsScores[displayHelper.taskLevel] = that.levelsScores[displayHelper.taskLevel];
               }
            }
            that.submittedAnswer = answer;
            if (displayHelper.showScore) {
               that.updateScore(answer, false);
            } else {
               that.savedAnswer = answer;
            }
            displayHelper.refreshMessages = true;
            displayHelper.checkAnswerChanged();
         });
      }
   },

   updateScoreOneLevel: function(answer, gradedLevel) {
      grader.gradeTask(answer, null, function(score, message) {
         score = +score;
         displayHelper.submittedScore = score;
         if (displayHelper.hasSolution) {
            displayHelper.graderScore = score;
            displayHelper.levelsScores[gradedLevel] = score;
         } else {
            if (score > displayHelper.graderScore) {
               displayHelper.graderScore = score;
            }
            if (displayHelper.hasLevels) {
               if (score > displayHelper.levelsScores[gradedLevel]) {
                  displayHelper.levelsScores[gradedLevel] = score;
                  if (displayHelper.savedAnswer == "") {
                     displayHelper.savedAnswer = answer;
                  } else {
                     var savedAnswerObj = $.parseJSON(displayHelper.savedAnswer);
                     var answerObj = $.parseJSON(answer);
                     savedAnswerObj[gradedLevel] = answerObj[gradedLevel];
                     displayHelper.savedAnswer = JSON.stringify(savedAnswerObj);
                  }
               }
            } else {
               if (score > displayHelper.graderScore) {
                  displayHelper.savedAnswer = answer;
               }
            }
         }
         if (message !== undefined) {
            displayHelper.graderMessage = message;
         } else {
            displayHelper.graderMessage = "";
         }
         if (displayHelper.hasLevels) {
            $("#tabScore_" + gradedLevel).html(displayHelper.levelsScores[gradedLevel]);
            $("#best_score").html(displayHelper.graderScore);
         }
         displayHelper.refreshMessages = true;
         displayHelper.checkAnswerChanged();
      }, gradedLevel);
   },

   updateScore: function(answer, allLevels) {
      // TODO : moins bourrin !
      if (allLevels) {
         for (var curLevel in {"easy": true, "medium": true, "hard": true}) {
            displayHelper.updateScoreOneLevel(answer, curLevel);
         }
      }
      displayHelper.updateScoreOneLevel(answer, displayHelper.taskLevel);
   },

   // does task have unsaved answers?
   hasNonSavedAnswer: function(callback) {
      if (! task) {
         return false;
      }
      task.getAnswer(function(curAnswer) {
         if (curAnswer != displayHelper.prevAnswer) {
            try {
               if (self != top && parent.Tracker) {
                  var data = {dataType: "nonSavedAnswer", teamID: parent.teamID, questionKey: parent.currentQuestionKey, answer: curAnswer};
                  // call TrackData, only when loaded in an iframe
                  // this is not yet document in the API, but should be soonish
                  parent.Tracker.trackData(data);
               }
            } catch (e) {}
            displayHelper.prevAnswer = curAnswer;
         }
         if (curAnswer != displayHelper.submittedAnswer) {
            displayHelper.submittedAnswer = "";
            displayHelper.refreshMessages = true;
         }
         if ((curAnswer == displayHelper.defaultAnswer) && (displayHelper.savedAnswer === "")) {
            callback(false);
         } else {
            callback(curAnswer != displayHelper.submittedAnswer);
         }
      });
   },

   // checks task.getAnswer() against previously recorded result, and calls
   // displayHelper.displayMessage() accordingly.
   checkAnswerChanged: function() {
      if (!this.loaded) {
         this.checkAnswerInterval = clearInterval(this.checkAnswerInterval);
         return;
      }
      displayHelper.hasNonSavedAnswer(function(hasNonSavedAnswer) {
         if (displayHelper.submittedAnswer !== "") {
            displayHelper.refreshMessages = true;
         }
         if (hasNonSavedAnswer) {
            if (!displayHelper.hasAnswerChanged) {
               displayHelper.refreshMessages = true;
               displayHelper.hasAnswerChanged = true;
            }
         } else {
            if (displayHelper.hasAnswerChanged) {
               displayHelper.refreshMessages = true;
               displayHelper.hasAnswerChanged = false;
            }
         }
         if (displayHelper.refreshMessages) {
            displayHelper.updateMessages();
         }
      });
   },

   getFullFeedbackSavedMessage: function(taskMode) {
      var scoreDiffMsg = "Score ";
      var showRetreiveAnswer = false;
      if ((displayHelper.submittedAnswer !== "") && (displayHelper.prevSavedScore !== undefined)) {
         if (!displayHelper.hasSolution) {
            if (displayHelper.prevSavedScore < displayHelper.submittedScore) {
               scoreDiffMsg = "Votre score est maintenant ";
            } else if (displayHelper.prevSavedScore > displayHelper.submittedScore) { 
               scoreDiffMsg = "C'est moins bien qu'avant, votre score reste ";
               showRetreiveAnswer = true;
            }
            else {
               scoreDiffMsg = "Votre score reste le même ";
            }
         } else {
            if (displayHelper.prevSavedScore != displayHelper.submittedScore) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " + displayHelper.prevSavedScore + ". Avec cette réponse, votre score serait ";
            } else if (displayHelper.submittedAnswer != displayHelper.savedAnswer) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " + displayHelper.prevSavedScore + ". Avec cette réponse, votre score resterait le même ";
            } else {
               scoreDiffMsg = "Votre score est de ";
            }
         }
      }
      var savedMessage = scoreDiffMsg + " : " + displayHelper.graderScore + " sur " + displayHelper.taskParams.maxScore + ".";
      if ((displayHelper.hasSolution && displayHelper.savedAnswer != displayHelper.prevAnswer) ||
         ((displayHelper.graderScore > 0) && ((taskMode == "saved_changed") || showRetreiveAnswer))) {
          savedMessage += " <a href=\"#\" onclick='displayHelper.retreiveAnswer();return false;'>Rechargez la réponse validée.</a>";
      }
      return savedMessage;
   },


   getFullFeedbackWithLevelsSavedMessage: function(taskMode) {
      var maxScoreLevel = displayHelper.getLevelsMaxScores()[displayHelper.taskLevel];
      var showRetreiveAnswer = false;
      var message = "";
      if (displayHelper.submittedAnswer === "") {
         if (displayHelper.levelsScores[displayHelper.taskLevel] > 0) {
            showRetreiveAnswer = true;
         } else {
            message += "Vous n'avez pas encore obtenu de points sur cette version.";
         }
      } else {
         var plural = "";
         if (displayHelper.submittedScore > 1) {
            plural = "s";
         }
         message = "Score de votre réponse : " + displayHelper.submittedScore + " point"  + plural + " sur " + maxScoreLevel + ".<br/>";
         if (displayHelper.hasSolution) {
            message += "Le concours est terminé, votre réponse n'est pas enregistrée.";
            if (displayHelper.prevSavedScore !== undefined) {
               showRetreiveAnswer = true;
            }
         } else {
            var prevScore = displayHelper.prevLevelsScores[displayHelper.taskLevel];
            if (displayHelper.prevSavedScore !== undefined) {
               if (displayHelper.submittedScore > prevScore) {
                  if (displayHelper.submittedScore < maxScoreLevel) {
                     message += "Essayez de faire encore mieux, ou passez à une version plus difficile.";
                  } else if (displayHelper.taskLevel == "hard") {
                     message += "C'est le meilleur score possible sur ce sujet, félicitations !";
                  } else {
                     message += "Pour obtenir plus de points, passez à une version plus difficile.";
                  }
               } else if (displayHelper.submittedScore < prevScore) { 
                  message += "Vous aviez fait mieux avant.";
                  showRetreiveAnswer = true;
               }
               else {
                  message += "Votre score reste le même.";
               }
            }
         }
      }
      if (showRetreiveAnswer) {
         message += " <a href=\"#\" onclick='displayHelper.retreiveAnswer();return false;'>" + 
            "Rechargez votre meilleure réponse.</a>";
      }
      return message;
   },

   getFullFeedbackValidateMessage: function(taskMode, disabledStr) {
      switch (taskMode) {
         case "saved_unchanged":
            var color = "red";
            if (displayHelper.submittedScore == displayHelper.taskParams.maxScore) {
               color = "green";
            } else if (displayHelper.submittedScore > 0) {
               color = "#FF8C00";
            }
            if (displayHelper.graderMessage !== "") {
               if (!displayHelper.stoppedShowingResult) {
                  return "<br><span style='display:inline-block;margin-bottom:0.2em;font-weight:bold;color:" + color + "'>" + displayHelper.graderMessage + "</span>";
               } else if (!this.hideValidateButton && !displayHelper.hasSolution) {
                  return "<input type='button' value='Valider votre réponse' onclick='platform.validate(\"done\")' "+disabledStr+"></input>";
               }
            }
            break;
         case "unsaved_unchanged":
         case "unsaved_changed":
            if (!this.hideValidateButton) {
               if (displayHelper.hasSolution) {
                  return "<input type='button' value='Évaluer cette réponse' onclick='displayHelper.validate(\"test\")' "+disabledStr+"></input>";
               } else {
                  return "<input type='button' value='Valider votre réponse' onclick='platform.validate(\"done\")' "+disabledStr+"></input>";
               }
            }
            break;
         case "saved_changed":
            if (!this.hideValidateButton) {
               if (displayHelper.hasSolution) {
                  return "<input type='button' value='Évaluer cette réponse' onclick='displayHelper.validate(\"test\")' "+disabledStr+"></input>";
               } else {
                  return "<input type='button' value='Valider votre nouvelle réponse' onclick='platform.validate(\"done\")' "+disabledStr+"></input>";
               }
            }
            break;
      }
      return "";
   },

   lastSentHeight: null,
   updateMessages: function() {
      displayHelper.refreshMessages = false;
      var suffix, prefix; 
      if (displayHelper.hasAnswerChanged) {
         suffix = "changed";
      } else {
         suffix = "unchanged";
      }
      if ((displayHelper.savedAnswer !== "") && (displayHelper.savedAnswer != displayHelper.defaultAnswer)) {
         prefix = "saved";
      } else {
         prefix = "unsaved";
      }
      if ((displayHelper.submittedAnswer !== "") && (displayHelper.submittedAnswer != displayHelper.savedAnswer)) {
         prefix = "saved"; // equivalent, should be named differently
         suffix = "unchanged";
      }
      var taskMode = prefix + "_" + suffix;
      var messages = {
         validate: "",
         cancel: "",
         saved: ""
      };
      var disabledStr = displayHelper.readOnly ? 'disabled' : '';
      if (this.showScore) {
         if (!this.hideRestartButton) {
            messages.cancel = "<div style='margin-top: 5px'><input type='button' value='Effacer votre réponse actuelle' onclick='displayHelper.restartAll()' "+disabledStr+"></input></div>";
         }
         messages.validate = displayHelper.getFullFeedbackValidateMessage(taskMode, disabledStr);
         if (displayHelper.hasLevels) {
            messages.saved = displayHelper.getFullFeedbackWithLevelsSavedMessage(taskMode);
         } else {
            messages.saved = displayHelper.getFullFeedbackSavedMessage(taskMode);
         }
         messages.saved = "<span style='margin-top: 5px; display: inline-block'>" + messages.saved + "</span>";
      } else {
         switch (taskMode) {
            case "unsaved_unchanged":
            case "unsaved_changed":
               if (!displayHelper.hasSolution) {
                  messages.validate = "<input type='button' value='Enregistrer votre réponse' onclick='platform.validate(\"done\")' "+disabledStr+"></input>";
               }
               break;
            case "saved_unchanged":
               if (!displayHelper.hasSolution) {
                  messages.saved = "Votre réponse a été enregistrée, vous pouvez la modifier ou bien <a href=\"#\" onclick=\"platform.validate('cancel');return false\" "+disabledStr+">l'annuler</a> et recommencer.";
               } else {
                  messages.saved = "Le concours étant terminé, votre réponse n'a pas été enregistrée. Vous pouvez <a href=\"#\" onclick=\"displayHelper.validate('cancel');return false\" "+disabledStr+">recharger la réponse que vous avez soumise</a>.";
               }
               break;
            case "saved_changed":
               messages.saved = "<br><b style='color:red'>Attention: une réponse différente est enregistrée</b>, vous pouvez <a href='#' onclick='displayHelper.retreiveAnswer();return false;'>la recharger</a>.";
               if (!this.hideValidateButton) {
                  messages.validate = "<input type='button' value='Enregistrer cette nouvelle réponse' onclick='platform.validate(\"done\")' "+disabledStr+"></input>";
               }
               break;
         }
      }
      for(var type in messages) {
         if ((typeof displayHelper.previousMessages[type] === 'undefined') || (displayHelper.previousMessages[type] !== messages[type])) {
            $("#displayHelper_" + type).html(messages[type]);
            displayHelper.previousMessages[type] = messages[type];
         }
      }
      var height = $("body").height();
      if (height != this.lastSentHeight) {
         this.lastSentHeight = height;
         platform.updateHeight(height);
      }
   },

   // loads previously saved answer
   retreiveAnswer: function() {
      var retreivedAnswer;
      if (displayHelper.hasLevels) {
         var retreivedAnswerObj = task.getAnswerObject();
         var savedAnswerObj = $.parseJSON(displayHelper.savedAnswer);
         retreivedAnswerObj[displayHelper.taskLevel] = savedAnswerObj[displayHelper.taskLevel];
         retreivedAnswer = JSON.stringify(retreivedAnswerObj);
      } else {
         retreivedAnswer = displayHelper.savedAnswer;
      }
      task.reloadAnswer(retreivedAnswer, function() {
         displayHelper.submittedAnswer = displayHelper.savedAnswer;
         displayHelper.updateScore(displayHelper.savedAnswer, false);
         displayHelper.refreshMessages = true;
         displayHelper.checkAnswerChanged();
      });
   },

   sendBestScore: function(callback, scores, messages) {
      var bestLevel = "easy";
      for (var curLevel in scores) {
         if (scores[bestLevel] <= scores[curLevel]) {
            bestLevel = curLevel;
         }
      }
      var levelsNames = displayHelper.getLevelsNames();
      callback(scores[bestLevel], messages[bestLevel] + " (version " + levelsNames[bestLevel] + ")");
   }
};

platform.subscribe(displayHelper);
