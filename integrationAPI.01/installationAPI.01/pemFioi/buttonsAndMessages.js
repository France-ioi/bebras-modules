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
   checkAnswerInterval: null,
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
   taskLevel: '',

   /***********************************************
    * Initialization functions called by the task *
    ***********************************************/
   load: function(views) {
      this.showScore = (typeof views.grader !== 'undefined' && views.grader === true);
      this.taskParams = platform.getTaskParams();
      this.readOnly = (this.taskParams.readonly == true || this.taskParams.readOnly == 'true');
      this.graderScore = +this.taskParams.noScore;
      this.savedAnswer = '';
      var addTaskHtml = '<div style="text-align: center;">';
      // place button placement at the end of html if they don't already exist
      if ($('#displayHelper_validate').length === 0) {
         addTaskHtml += '<span id="displayHelper_validate"></span>';
      }
      if ($("#displayHelper_cancel").length === 0) {
         addTaskHtml += '<span id="displayHelper_cancel"></span>';
      }
      if ($("#displayHelper_saved").length === 0) {
         addTaskHtml += '<span id="displayHelper_saved"></span>';
      }
      addTaskHtml += '</div>';
      $(this.taskSelector).append(addTaskHtml);
   },

   setupParams: function() {
      var taskParams = platform.getTaskParams();

      this.hasLevels = true;
      if (taskParams.pointsAsStars !== undefined) {
         this.pointsAsStars = taskParams.pointsAsStars;
      } else {
         this.pointsAsStars = true; // TODO: set this in the platform task params
      }
      if (taskParams.unlockedLevels !== undefined) {
         this.unlockedLevels = taskParams.unlockedLevels; // TODO: set this in the platform task params
      } else {
         this.unlockedLevels = 3;
      }

      var maxScore = taskParams.maxScore;
      this.levelsMaxScores = {
         easy: Math.round(maxScore / 2),
         medium: Math.round(3 * maxScore / 4),
         hard: maxScore
      };
      this.levelsNames = { easy: "facile", medium: "moyenne", hard: "difficile" };
   },
   setupContent: function() {
      var maxScores = this.levelsMaxScores;
      var starContainers = [];
      var tabsClasses = 'tabs-menu';
      if (this.pointsAsStars) {
         tabsClasses += ' stars';
      }
      var tabsHTML = '<ul class="' + tabsClasses + '">';
      for (var curLevel in this.levelsNames) {
         tabsHTML += '<li class="tab-' + curLevel + ' open-level">' +
            '<a href="#' + curLevel + '">Version ';
         if (this.pointsAsStars) {
            var curStar = 0;
            for (var curScore = 0; curScore < maxScores[curLevel]; curScore += maxScores.hard / 4) {
               var starID = 'tabScore_' + curLevel + '_' + curStar;
               tabsHTML += '<span id="' + starID + '" class="star-container"></span>';
               starContainers.push(starID);
               curStar++;
            }
         } else {
            tabsHTML += this.levelsNames[curLevel] + '<br/>' +
               'Points : <span id="tabScore_' + curLevel + '">0</span> sur ' + maxScores[curLevel];
         }
         tabsHTML += '</a></li>';
      }
      tabsHTML += '</ul>';
      var scoreHTML = '<div class="best_score">' +
         'Score : <span id="best_score">0</span> sur ' + maxScores.hard + '<br/>(meilleur des trois versions)' +
      '</div>';
      $('#tabsContainer').before(scoreHTML + tabsHTML);
      this.setStars(starContainers);
   },
   setupLevels: function(initLevel) {
      task.reloadStateObject(task.getDefaultStateObject(), true);
      task.reloadAnswerObject(task.getDefaultAnswerObject());

      this.setupParams();
      this.setupContent();

      $('.tabs-menu a').click(function(event) {
         event.preventDefault();
         var newLevel = $(this).attr('href').split('#')[1];
         displayHelper.setLevel(newLevel);
      });
      this.setLevel(initLevel);
   },

   getLevelsMaxScores: function() {
      return this.levelsMaxScores;
   },
   getLevelsNames: function() {
      return this.levelsNames;
   },

   setLevel: function(newLevel) {
      if (this.taskLevel == newLevel) {
         return;
      }
      $('.tab-easy, .tab-medium, .tab-hard').removeClass('current');
      $('.tab-' + newLevel).addClass('current');
      $('.easy, .medium, .hard').hide();
      $('.' + newLevel).show();

      var answer = task.getAnswerObject();
      var state = task.getStateObject();
      state.level = newLevel;
      task.reloadStateObject(state, true);
      task.reloadAnswerObject(answer);

      this.taskLevel = newLevel;
      this.validate("stay");
      this.stopShowingResult();
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
      } catch (err) {}
      // end of fix
      this.views = views;
      this.hasSolution = (typeof views.solution !== 'undefined');
      if (this.hasSolution && this.graderScore) {
         this.prevSavedScore = this.graderScore;
      }
      displayHelper.checkAnswerInterval = setInterval(
         function() {
             displayHelper.checkAnswerChanged();
         }, 1000);
      task.getAnswer(function(answer) {
         displayHelper.defaultAnswer = answer;
         displayHelper.refreshMessages = true;
         displayHelper.checkAnswerChanged();
      });
   },

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
      this.checkAnswerChanged(); // necessary?
   },

   reloadState: function(state) {
      this.checkAnswerChanged(); // necessary?
   },

   stopShowingResult: function() {
      this.stoppedShowingResult = true;
      this.updateMessages();
   },

   /**********************
    * Internal functions *
    **********************/
   restartAll: function() {
      this.stopShowingResult();
      if (!this.hasLevels) {
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
      this.stoppedShowingResult = false;
      var that = this;
      if (mode == 'cancel') {
         this.savedAnswer = '';
         task.reloadAnswer('', function() {
            that.checkAnswerChanged();
         });
      } else {
         task.getAnswer(function(answer) {
            if (!that.hasSolution) {
               that.prevSavedScore = that.graderScore;
               if (that.hasLevels) {
                  that.prevLevelsScores[that.taskLevel] = that.levelsScores[that.taskLevel];
               }
            }
            that.submittedAnswer = answer;
            if (that.showScore) {
               that.updateScore(answer, false);
            } else {
               that.savedAnswer = answer;
            }
            that.refreshMessages = true;
            that.checkAnswerChanged();
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
            var scores = displayHelper.levelsScores;
            var maxScores = displayHelper.levelsMaxScores;
            if (displayHelper.pointsAsStars) {
               var starPoints = maxScores.hard / 4;
               var curStar = 0;
               var starScore = 0;
               while (starScore + starPoints < scores[gradedLevel]) {
                  displayHelper.resizeStar('tabScore_' + gradedLevel + '_' + curStar + '_full', 1);
                  curStar++;
                  starScore += starPoints;
               }
               displayHelper.resizeStar('tabScore_' + gradedLevel + '_' + curStar + '_full',
                  (scores[gradedLevel] - starScore) / starPoints);
            } else {
               $("#tabScore_" + gradedLevel).html(scores[gradedLevel]);
            }
            if (maxScores[gradedLevel] == scores[gradedLevel]) {
               for (var curLevel in displayHelper.levelsNames) {
                  if (curLevel == gradedLevel) break;
                  $('.tab-' + curLevel).removeClass('open-level').addClass('useless-level');
               }
            }
            $("#best_score").html(displayHelper.graderScore);
         }
         displayHelper.refreshMessages = true;
         displayHelper.checkAnswerChanged();
      }, gradedLevel);
   },

   updateScore: function(answer, allLevels) {
      // TODO: cleaner!
      if (allLevels) {
         for (var curLevel in this.levelsNames) {
            this.updateScoreOneLevel(answer, curLevel);
         }
      } else {
         this.updateScoreOneLevel(answer, this.taskLevel);
      }
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
      this.hasNonSavedAnswer(function(hasNonSavedAnswer) {
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
      var showretrieveAnswer = false;
      if ((this.submittedAnswer !== "") && (this.prevSavedScore !== undefined)) {
         if (!this.hasSolution) {
            if (this.prevSavedScore < this.submittedScore) {
               scoreDiffMsg = "Votre score est maintenant ";
            } else if (this.prevSavedScore > this.submittedScore) { 
               scoreDiffMsg = "C'est moins bien qu'avant, votre score reste ";
               showretrieveAnswer = true;
            }
            else {
               scoreDiffMsg = "Votre score reste le même ";
            }
         } else {
            if (this.prevSavedScore != this.submittedScore) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " + this.prevSavedScore + ". Avec cette réponse, votre score serait";
            } else if (this.submittedAnswer != this.savedAnswer) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " + this.prevSavedScore + ". Avec cette réponse, votre score resterait le même";
            } else {
               scoreDiffMsg = "Votre score est de";
            }
         }
      }
      var savedMessage = scoreDiffMsg + " : " + this.graderScore + " sur " + this.taskParams.maxScore + ".";
      if ((this.hasSolution && this.savedAnswer != this.prevAnswer) ||
         ((this.graderScore > 0) && ((taskMode == "saved_changed") || showretrieveAnswer))) {
          savedMessage += " <a href=\"#\" onclick='displayHelper.retrieveAnswer(); return false;'>Rechargez la réponse validée.</a>";
      }
      return savedMessage;
   },

   getFullFeedbackWithLevelsSavedMessage: function(taskMode) {
      var maxScoreLevel = this.levelsMaxScores[this.taskLevel];
      var showretrieveAnswer = false;
      var message = "";
      if (this.submittedAnswer === "") {
         if (this.levelsScores[this.taskLevel] > 0) {
            showretrieveAnswer = true;
         } else {
            message += "Vous n'avez pas encore obtenu de points sur cette version.";
         }
      } else {
         var plural = "";
         if (this.submittedScore > 1) {
            plural = "s";
         }
         message = "Score de votre réponse : " + this.submittedScore + " point"  + plural + " sur " + maxScoreLevel + ".<br/>";
         if (this.hasSolution) {
            message += "Le concours est terminé : votre réponse n'est pas enregistrée.";
            if (this.prevSavedScore !== undefined) {
               showretrieveAnswer = true;
            }
         } else {
            var prevScore = this.prevLevelsScores[this.taskLevel];
            if (this.prevSavedScore !== undefined) {
               if (this.submittedScore > prevScore) {
                  if (this.submittedScore < maxScoreLevel) {
                     message += "Essayez de faire encore mieux, ou passez à une version plus difficile.";
                  } else if (this.taskLevel == "hard") {
                     message += "C'est le meilleur score possible sur ce sujet, félicitations !";
                  } else {
                     message += "Pour obtenir plus de points, passez à une version plus difficile.";
                  }
               } else if (this.submittedScore < prevScore) { 
                  message += "Vous aviez fait mieux avant.";
                  showretrieveAnswer = true;
               }
               else {
                  message += "Votre score reste le même.";
               }
            }
         }
      }
      if (showretrieveAnswer) {
         message += ' <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">' + 
            "Rechargez votre meilleure réponse.</a>";
      }
      return message;
   },

   getFullFeedbackValidateMessage: function(taskMode, disabledStr) {
      switch (taskMode) {
         case 'saved_unchanged':
            var color = "red";
            if (this.submittedScore == this.taskParams.maxScore) {
               color = "green";
            } else if (this.submittedScore > 0) {
               color = "#FF8C00";
            }
            if (this.graderMessage !== "") {
               if (!this.stoppedShowingResult) {
                  return '<br/><span style="display: inline-block; margin-bottom: .2em; font-weight: bold; color: ' + color + '">' +
                     this.graderMessage + '</span>';
               } else if (!this.hideValidateButton && !this.hasSolution) {
                  return '<input type="button" value="Valider votre réponse" onclick="platform.validate(\'done\')" ' + disabledStr + '/>';
               }
            }
            break;
         case 'unsaved_unchanged':
         case 'unsaved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="Évaluer cette réponse" onclick="displayHelper.validate(\'test\')" ' + disabledStr + "/>";
               } else {
                  return '<input type="button" value="Valider votre réponse" onclick="platform.validate(\'done\')" ' + disabledStr+"/>";
               }
            }
            break;
         case 'saved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="Évaluer cette réponse" onclick="displayHelper.validate(\'test\')" ' + disabledStr + '/>';
               } else {
                  return '<input type="button" value="Valider votre nouvelle réponse" onclick="platform.validate(\'done\')" ' + disabledStr + '/>';
               }
            }
            break;
      }
      return '';
   },

   lastSentHeight: null,
   updateMessages: function() {
      this.refreshMessages = false;
      var suffix, prefix; 
      if (this.hasAnswerChanged) {
         suffix = 'changed';
      } else {
         suffix = 'unchanged';
      }
      if ((this.savedAnswer !== '') && (this.savedAnswer != this.defaultAnswer)) {
         prefix = 'saved';
      } else {
         prefix = 'unsaved';
      }
      if ((this.submittedAnswer !== '') && (this.submittedAnswer != this.savedAnswer)) {
         prefix = 'saved'; // equivalent, should be named differently
         suffix = 'unchanged';
      }
      var taskMode = prefix + '_' + suffix;
      var messages = {
         validate: '',
         cancel: '',
         saved: ''
      };
      var disabledStr = this.readOnly ? 'disabled' : '';
      if (this.showScore) {
         if (!this.hideRestartButton) {
            messages.cancel = '<div style="margin-top: 5px;">' +
               '<input type="button" value="Effacer votre réponse actuelle" onclick="displayHelper.restartAll();" ' + disabledStr + '/></div>';
         }
         messages.validate = this.getFullFeedbackValidateMessage(taskMode, disabledStr);
         if (this.hasLevels) {
            messages.saved = this.getFullFeedbackWithLevelsSavedMessage(taskMode);
         } else {
            messages.saved = this.getFullFeedbackSavedMessage(taskMode);
         }
         messages.saved = '<span style="margin-top: 5px; display: inline-block;">' + messages.saved + '</span>';
      } else {
         switch (taskMode) {
            case "unsaved_unchanged":
            case "unsaved_changed":
               if (!this.hasSolution) {
                  messages.validate = '<input type="button" value="Enregistrer votre réponse" onclick="platform.validate(\'done\')" ' + disabledStr + '/>';
               }
               break;
            case "saved_unchanged":
               if (!this.hasSolution) {
                  messages.saved = "Votre réponse a été enregistrée. Vous pouvez la modifier, ou bien " +
                     '<a href="#" onclick="platform.validate(\'cancel\'); return false;" ' + disabledStr + ">l'annuler</a> et recommencer.";
               } else {
                  messages.saved = "Le concours étant terminé, votre réponse n'a pas été enregistrée. Vous pouvez " +
                     '<a href="#" onclick="displayHelper.validate(\'cancel\'); return false;" ' + disabledStr + ">recharger la réponse que vous avez soumise</a>.";
               }
               break;
            case "saved_changed":
               messages.saved = '<br/><b style="color: red;">Attention : une réponse différente est enregistrée.</b> ' +
                  'Vous pouvez <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">la recharger</a>.';
               if (!this.hideValidateButton) {
                  messages.validate = '<input type="button" value="Enregistrer cette nouvelle réponse" onclick="platform.validate(\'done\')" ' + disabledStr + "/>";
               }
               break;
         }
      }
      for (var type in messages) {
         if ((typeof this.previousMessages[type] === 'undefined') || (this.previousMessages[type] !== messages[type])) {
            $('#displayHelper_' + type).html(messages[type]);
            this.previousMessages[type] = messages[type];
         }
      }
      var height = $('body').height();
      if (height != this.lastSentHeight) {
         this.lastSentHeight = height;
         platform.updateHeight(height);
      }
   },

   // loads previously saved answer
   retrieveAnswer: function() {
      var retrievedAnswer;
      if (this.hasLevels) {
         var retrievedAnswerObj = task.getAnswerObject();
         var savedAnswerObj = $.parseJSON(this.savedAnswer);
         retrievedAnswerObj[this.taskLevel] = savedAnswerObj[this.taskLevel];
         retrievedAnswer = JSON.stringify(retrievedAnswerObj);
      } else {
         retrievedAnswer = this.savedAnswer;
      }
      var that = displayHelper;
      task.reloadAnswer(retrievedAnswer, function() {
         that.submittedAnswer = that.savedAnswer;
         that.updateScore(that.savedAnswer, false);
         that.refreshMessages = true;
         that.checkAnswerChanged();
      });
   },

   sendBestScore: function(callback, scores, messages) {
      var bestLevel = "easy";
      for (var curLevel in scores) {
         if (scores[bestLevel] <= scores[curLevel]) {
            bestLevel = curLevel;
         }
      }
      callback(scores[bestLevel], messages[bestLevel] + " (version " + this.levelsNames[bestLevel] + ")");
   },

   // Sets and manages scoring stars
   putStar: function(parent, displayWidth, strokeColor, fillColor) {
      if (strokeColor === undefined) strokeColor = 'black';
      if (fillColor === undefined) fillColor = 'white';
      var scaleFactor = displayWidth / 100;

      var starCanvas = Raphael(parent, displayWidth, displayWidth * .95);
      // A star in a frame of size (100, 95)
      var starPath = starCanvas.path('m46.761-0.11711 15.374 26.313 29.776 6.49-20.274 22.753 3.029 ' +
         '30.325-27.905-12.251-27.904 12.251 3.028-30.325-20.274-22.753 29.776-6.49z')
      .attr({
         fill: fillColor,
         stroke: strokeColor,
         'stroke-width': 5 * scaleFactor,
      }).transform('t3.2389 15.734');
      starPath.transform('s' + scaleFactor + ',' + scaleFactor + ',0,0');

      var parentElement = document.getElementById(parent);
      parentElement.starWidth = displayWidth;
      parentElement.starCanvas = starCanvas;
   },
   resizeStar: function(parent, clipWidth) {
      if (clipWidth == 0) {
         $('#' + parent).removeClass('shown-star');
      } else {
         var parentElement = document.getElementById(parent);
         parentElement.starCanvas.setSize(parentElement.starWidth * clipWidth, parentElement.starWidth * .95);
         $('#' + parent).addClass('shown-star');
      }
   },
   setStars: function(parents, starWidth) {
      if (starWidth === undefined) starWidth = 18;
      for (var curParent in parents) {
         var parentId = parents[curParent];
         $('#' + parentId).html(
            '<span id="' + parentId + '_locked" class="locked-star"></span>' +
            '<span id="' + parentId + '_useless" class="useless-star"></span>' +
            '<span id="' + parentId + '_empty" class="empty-star"></span>' +
            '<span id="' + parentId + '_full" class="full-star"></span>');
         $('#' + parentId + '_full').addClass('hidden-star');
         this.putStar(parentId + '_locked', starWidth, '#888', '#888');
         this.putStar(parentId + '_useless', starWidth, 'black', '#22a');
         this.putStar(parentId + '_empty', starWidth);
         this.putStar(parentId + '_full', starWidth, 'black', '#ffc90e');
      }
   }
};

platform.subscribe(displayHelper);
