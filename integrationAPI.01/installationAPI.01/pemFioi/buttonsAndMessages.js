(function() {

'use strict';

/*
 * Implementation of the displayHelper API.
 *
 * Copyright (c) 2012 Association France-ioi, MIT License http://opensource.org/licenses/MIT
 *
 * See documentation for more information.
 */

window.displayHelper = {
   loaded: false,
   checkAnswerInterval: null,
   prevAnswer: '',
   readOnly: false,
   savedAnswer: '',
   submittedAnswer: '',
   submittedScore: 0,
   hasAnswerChanged: true,
   taskSelector: '#task',
   hideValidateButton: false,
   hideRestartButton: false,
   showScore: false,
   refreshMessages: true,
   stoppedShowingResult: false,
   previousMessages: {},
   popupMessageShown: false,

   hasLevels: false,
   pointsAsStars: true, // TODO: false as default
   unlockedLevels: 3,
   neverHadHard: false,
   showMultiversionNotice: false,
   levelsScores: { easy: 0, medium: 0, hard: 0 },
   prevLevelsScores: { easy: 0, medium: 0, hard: 0 },
   levels: ['easy', 'medium', 'hard'],
   levelsNames: { easy: "facile", medium: "moyenne", hard: "difficile" },
   onlyLevelsNames: { easy: "Facile", medium: "Moyen", hard: "Difficile" },
   taskLevel: '',

   /***********************************************
    * Initialization functions called by the task *
    ***********************************************/
   load: function(views) {
      var self = this;
      this.showScore = (typeof views.grader !== 'undefined' && views.grader === true);
      window.platform.getTaskParams(null, null, function(taskParams) {
         self.taskParams = taskParams;
         self.readOnly = (self.taskParams.readonly === true || self.taskParams.readOnly == 'true');
         self.graderScore = +self.taskParams.noScore;
         self.savedAnswer = '';

         var addTaskHTML = '<div id="displayHelperAnswering" class="contentCentered">';
         // Place button placements at the end of HTML if they don't already exist
         var placementNames = ['graderMessage', 'validate', 'cancel', 'saved'];
         for (var iPlacement in placementNames) {
            var placement = 'displayHelper_' + placementNames[iPlacement];
            if ($('#' + placement).length === 0) {
               addTaskHTML += '<div id="' + placement + '"></div>';
            }
         }
         addTaskHTML += '</div>';
         if (!document.getElementById('displayHelperAnswering')) {
            $(self.taskSelector).append(addTaskHTML);   
         }
         self.loaded= true;
         if (self.popupMessageShown) {
            $('#displayHelperAnswering').hide();
         }

         var taskDelayWarning = function() {
            if (self.popupMessageShown) {
               self.taskDelayWarningTimeout = setTimeout(taskDelayWarning, 5000);
            } else {
               self.showPopupMessage("Attention, cela fait 5 minutes que vous êtes sur cette question. " +
                  "Il est peut-être temps de passer à une autre !", 'blanket', "En effet");
               self.taskDelayWarningTimeout = null;
            }
         };
         self.taskDelayWarningTimeout = setTimeout(taskDelayWarning, 5 * 60 * 1000);
      });
   },
   unload: function() {
      if (this.taskDelayWarningTimeout) {
         this.taskDelayWarningTimeout = clearTimeout(this.taskDelayWarningTimeout);
      }
      clearInterval(this.checkAnswerInterval);
      this.checkAnswerInterval = null;
      this.loaded = false;
      this.prevAnswer = '';
      this.readOnly = false;
      this.savedAnswer = '';
      this.submittedAnswer = '';
      this.submittedScore = 0;
      this.hasAnswerChanged = true;
      this.hideValidateButton = false;
      this.hideRestartButton = false;
      this.showScore = false;
      this.refreshMessages = true;
      this.stoppedShowingResult = false;
      this.previousMessages = {};
      this.popupMessageShown = false;
      this.hasLevels = false;
      this.pointsAsStars = true; // TODO: false as default
      this.unlockedLevels = 3;
      this.neverHadHard = false;
      this.showMultiversionNotice = false;
      this.levelsScores = { easy: 0, medium: 0, hard: 0 };
      this.prevLevelsScores = { easy: 0, medium: 0, hard: 0 };
      this.taskLevel = '';
      return true;
   },

   setupLevels: function(initLevel) {
      if (!initLevel) {
         if (!this.taskParams) {
            var self = this;
            window.platform.getTaskParams(null, null, function(taskParams) {
               self.taskParams = taskParams;
               initLevel = taskParams.options.difficulty ? taskParams.options.difficulty : "easy";
               self.doSetupLevels(initLevel);
            });
         } else {
            initLevel = this.taskParams.options.difficulty ? this.taskParams.options.difficulty : "easy";
            this.doSetupLevels(initLevel);
         }
      } else {
         this.doSetupLevels(initLevel);
      }
   },
   doSetupLevels: function(initLevel) {
      task.reloadStateObject(task.getDefaultStateObject(), true);
      task.reloadAnswerObject(task.getDefaultAnswerObject());

      this.setupParams();
      if (!document.getElementById('popupMessage')) {
         this.setupLevelsTabs();
         $('#tabsMenu .li').on('click', function(event) {
            event.preventDefault();
            var newLevel = $(this).children().attr('href').split('#')[1];
            displayHelper.setLevel(newLevel);
         });
      }

      this.setLevel(initLevel);

      if (this.unlockedLevels > 1 && this.showMultiversionNotice) {
         this.showPopupMessage("Notez que pour cette question, " +
            "vous pouvez résoudre directement une version plus difficile que celle-ci.", 'blanket', "D'accord",
            function() {
               this.showMultiversionNotice = false;
            });
      }
   },
   setupParams: function() {
      var taskParams = this.taskParams;

      this.hasLevels = true;
      var paramNames = ['pointsAsStars', 'unlockedLevels', 'neverHadHard', 'showMultiversionNotice'];
      for (var iParam in paramNames) {
         var param = paramNames[iParam];
         if (taskParams[param] !== undefined) {
            this[param] = taskParams[param];
         }
      }

      var maxScore = taskParams.maxScore !== undefined ? taskParams.maxScore : 40;
      this.levelsMaxScores = {
         easy: (this.pointsAsStars ? maxScore / 2 : Math.round(maxScore / 2)),
         medium: (this.pointsAsStars ? maxScore * 3 / 4 : Math.round(maxScore * 3 / 4)),
         hard: maxScore
      };
   },
   setupLevelsTabs: function() {
      var scoreHTML;
      var maxScores = this.levelsMaxScores;
      if (this.pointsAsStars) {
         var titleStarContainers = [];
         scoreHTML = '<span></span>' + this.genStarContainers(titleStarContainers, maxScores.hard, 'titleStar');
         $('#task > h1').append(scoreHTML);
         this.setStars(titleStarContainers, 24);
      } else {
         scoreHTML = '<div class="bestScore">Score retenu : <span id="bestScore">0</span> sur ' + maxScores.hard + '</div>';
         $('#tabsContainer').append(scoreHTML);
      }

      var tabsStarContainers = [];
      var tabsHTML = '<div id="tabsMenu">';
      var curLevel;
      for (curLevel in this.levelsNames) {
         tabsHTML += '<span class="li" id="tab_' + curLevel + '"><a href="#' + curLevel + '">';
         if (this.pointsAsStars) {
            tabsHTML += "Version " + this.genStarContainers(tabsStarContainers, maxScores[curLevel], 'tabScore_' + curLevel);
         } else {
            tabsHTML += this.onlyLevelsNames[curLevel] + ' — ' +
               '<span id="tabScore_' + curLevel + '">0</span> / ' + maxScores[curLevel];
         }
         tabsHTML += '</a></span>';
      }
      tabsHTML += '</div>';
      $('#tabsContainer').append(tabsHTML);

      var self = this;
      setTimeout(function() {
         self.setStars(tabsStarContainers);
         for (var iLevel in self.levels) {
            curLevel = self.levels[iLevel];
            if (iLevel >= self.unlockedLevels) {
               $('#tab_' + curLevel).addClass('lockedLevel');
               self.changeStarsState(curLevel, 'locked');
            }
         }
      }, 100);

      $('#tabsContainer').after('<div id="popupMessage"></div>');
   },

   // Deprecated: use directly levelsMaxScores instead
   getLevelsMaxScores: function() {
      return this.levelsMaxScores;
   },
   // Deprecated: use directly levelsNames instead
   getLevelsNames: function() {
      return this.levelsNames;
   },

   setLevel: function(newLevel) {
      if (this.taskLevel == newLevel) {
         return;
      } else if (this.popupMessageShown) {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         this.popupMessageShown = false;
      }

      for (var curLevel in this.levelsNames) {
         $('#tab_' + curLevel).removeClass('current');
         $('.' + curLevel).hide();
      }
      $('#tab_' + newLevel).addClass('current');
      $('.' + newLevel).show();

      var answer = task.getAnswerObject();
      var state = task.getStateObject();
      state.level = newLevel;
      task.reloadStateObject(state, true);
      task.reloadAnswerObject(answer);

      this.taskLevel = newLevel;
      this.submittedScore = this.levelsScores[this.taskLevel];
      this.refreshMessages = true;
      this.checkAnswerChanged();
      this.stopShowingResult();

      if ($('#tab_' + newLevel).hasClass('lockedLevel')) {
         this.showPopupMessage("Cette version est verrouillée. Résolvez la précédente pour l'afficher !", 'lock');
      } else if (!this.hasSolution) {
         if ($('#tab_' + newLevel).hasClass('uselessLevel') && this.levelsScores[newLevel] < this.levelsMaxScores[newLevel]) {
            this.showPopupMessage("Attention : vous avez déjà résolu une version plus difficile. " +
               "Vous ne pourrez pas gagner de points supplémentaires avec cette version.", 'tab', "Montrez-la-moi quand même");
         } else if (newLevel == 'hard' && this.neverHadHard) {
            var versionName = this.levelsNames[newLevel];
            if (this.pointsAsStars) versionName = "à 4 étoiles";
            this.showPopupMessage("Résoudre une version " + versionName + " peut vous prendre beaucoup de temps ; " +
               "songez en priorité à répondre aux questions en version facile pour gagner des points rapidement.", 'tab',
               "J'y prendrai garde", function() {
                  this.neverHadHard = false;
               }
            );
         }
      }
   },
   showPopupMessage: function(message, mode, buttonText, agreeFunc) {
      if (mode != 'blanket') {
         $('#taskContent, #displayHelperAnswering').hide();
         $('#popupMessage').removeClass('floatingMessage');
      } else {
         $('#popupMessage').addClass('floatingMessage');
      }

      if (!buttonText) {
         buttonText = "D'accord";
      }
      // Hack: when in the context of the platform, we need to change the path
      var imgPath = window.sAssetsStaticPath ? window.sAssetsStaticPath + 'images/' : '../../modules/img/';
      var buttonHTML = mode == 'lock' ? '' : '<button>' + (buttonText || "D'accord") + '</button>';
      $('#popupMessage').html('<div class="container">' +
         '<img class="beaver" src="' + imgPath + 'castor.png"/>' +
         '<img class="messageArrow" src="' + imgPath + 'fleche-bulle.png"/>' +
         '<div class="message">' + message + '</div>' + buttonHTML + '</div>').show();
      $('#popupMessage button').click(function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
         if (agreeFunc) {
            agreeFunc();
         }
      });
      this.popupMessageShown = true;
   },

   // Function to call at the beginning of task loading, before any html has
   // been modified. It places the markers where the buttons will appear, if the
   // markers are not present already.
   showViews: function(views) {
      // Fix for an old version of Firefox in which selection was stuck
      try {
         if (document.getSelection) {
            var selection = document.getSelection();
            if (selection !== undefined && selection.removeAllRanges !== undefined) {
               selection.removeAllRanges();
            }
         }
      } catch (err) {}

      this.views = views;
      this.hasSolution = (typeof views.solution !== 'undefined');
      if (this.hasSolution && this.graderScore) {
         this.prevSavedScore = this.graderScore;
      }
      var self = this;
      this.checkAnswerInterval = setInterval(
         function() {
            self.checkAnswerChanged();
         }, 1000);
      task.getAnswer(function(answer) {
         self.defaultAnswer = answer;
         self.refreshMessages = true;
         self.checkAnswerChanged();
      });
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

   reloadState: function() {
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
         task.reloadAnswer('', function() {});
      } else {
         task.getAnswer(function(strAnswer) {
            var answer = $.parseJSON(strAnswer);
            var defaultAnswer = task.getDefaultAnswerObject();
            var level = displayHelper.taskLevel;
            answer[level] = defaultAnswer[level];
            task.reloadAnswer(JSON.stringify(answer), function() {});
         });
      }
   },

   validate: function(mode) {
      this.stoppedShowingResult = false;
      var self = this;
      if (mode == 'cancel') {
         this.savedAnswer = '';
         task.reloadAnswer('', function() {
            self.checkAnswerChanged();
         });
      } else {
         task.getAnswer(function(strAnswer) {
            if (!self.hasSolution) {
               self.prevSavedScore = self.graderScore;
               if (self.hasLevels) {
                  self.prevLevelsScores[self.taskLevel] = self.levelsScores[self.taskLevel];
               }
            }
            self.submittedAnswer = strAnswer;
            if (self.showScore) {
               self.updateScore(strAnswer, false);
            } else {
               self.savedAnswer = strAnswer;
            }
            self.refreshMessages = true;
            self.checkAnswerChanged();
         });
      }
   },

   updateScore: function(answer, allLevels) {
      if (allLevels) {
         for (var curLevel in this.levelsNames) {
            this.updateScoreOneLevel(answer, curLevel);
         }
      } else {
         this.updateScoreOneLevel(answer, this.taskLevel);
      }
   },
   updateScoreOneLevel: function(answer, gradedLevel) {
      var self = this;
      grader.gradeTask(answer, null, function(score, message) {
         score = +score;
         self.submittedScore = score;
         if (self.hasSolution) {
            self.graderScore = score;
            self.levelsScores[gradedLevel] = score;
         } else {
            if (score > self.graderScore) {
               self.graderScore = score;
            }
            if (self.hasLevels) {
               if (score > self.levelsScores[gradedLevel]) {
                  self.levelsScores[gradedLevel] = score;
                  if (self.savedAnswer === '') {
                     self.savedAnswer = answer;
                  } else {
                     var savedAnswerObj = $.parseJSON(self.savedAnswer);
                     var answerObj = $.parseJSON(answer);
                     savedAnswerObj[gradedLevel] = answerObj[gradedLevel];
                     self.savedAnswer = JSON.stringify(savedAnswerObj);
                  }
               }
            } else if (score > self.graderScore) {
               self.savedAnswer = answer;
            }
         }
         if (message !== undefined) {
            self.graderMessage = message;
         } else {
            self.graderMessage = "";
         }
         if (self.hasLevels) {
            self.updateScoreDisplays(gradedLevel);
         }
         self.refreshMessages = true;
         self.checkAnswerChanged();
      }, gradedLevel);
   },
   updateScoreDisplays: function(gradedLevel) {
      var scores = this.levelsScores;
      var maxScores = this.levelsMaxScores;
      if (this.pointsAsStars) {
         this.changeStarPoints('tabScore_' + gradedLevel, scores[gradedLevel]);
         this.changeStarPoints('titleStar', this.graderScore);
      } else {
         $('#tabScore_' + gradedLevel).html(scores[gradedLevel]);
         $('#bestScore').html(this.graderScore);
      }

      var gradedLevelNum = $.inArray(gradedLevel, this.levels);
      var curLevel;
      // Possibly unlocking a level
      if (maxScores[gradedLevel] == scores[gradedLevel]) {
         var unlockedLevel = gradedLevelNum + 1;
         if (unlockedLevel < this.levels.length && unlockedLevel >= this.unlockedLevels) {
            curLevel = this.levels[unlockedLevel];
            $('#tab_' + curLevel).removeClass('lockedLevel');
            this.changeStarsState(curLevel, 'normal');
            this.unlockedLevels++;
         }
      }
      if (scores[gradedLevel] == this.graderScore) {
         // Marks levels that can't earn points as useless
         for (curLevel in this.levelsNames) {
            if (maxScores[curLevel] > this.graderScore) {
               break;
            }
            this.changeStarsState(curLevel, 'useless');
            $('#tab_' + curLevel).addClass('uselessLevel');
         }
      }
   },

   // Does task have unsaved answers?
   hasNonSavedAnswer: function(callback) {
      if (!task) {
         return false;
      }
      var self = this;
      task.getAnswer(function(curAnswer) {
         if (curAnswer != self.prevAnswer) {
            try {
               if (self != top && parent.Tracker) {
                  var data = {
                     dataType: 'nonSavedAnswer', teamID: parent.teamID, questionKey: parent.currentQuestionKey, answer: curAnswer
                  };
                  // Call TrackData, only when loaded in an iframe
                  // this is not yet document in the API, but should be soonish
                  parent.Tracker.trackData(data);
               }
            } catch (e) {}
            self.prevAnswer = curAnswer;
         }
         if (curAnswer != self.submittedAnswer) {
            self.submittedAnswer = '';
            self.refreshMessages = true;
         }
         if (curAnswer == self.defaultAnswer && self.savedAnswer === '') {
            callback(false);
         } else {
            callback(curAnswer != self.submittedAnswer);
         }
      });
   },

   // Checks task.getAnswer() against previously recorded result, and calls
   // displayHelper.updateMessages() accordingly.
   checkAnswerChanged: function() {
      if (!this.loaded) {
         this.checkAnswerInterval = clearInterval(this.checkAnswerInterval);
         return;
      }
      var self = this;
      this.hasNonSavedAnswer(function(hasNonSavedAnswer) {
         if (self.submittedAnswer !== '') {
            self.refreshMessages = true;
         }
         if (hasNonSavedAnswer && !self.hasAnswerChanged) {
            self.refreshMessages = true;
            self.hasAnswerChanged = true;
         } else if (!hasNonSavedAnswer && self.hasAnswerChanged) {
            self.refreshMessages = true;
            self.hasAnswerChanged = false;
         }
         if (self.refreshMessages) {
            self.updateMessages();
         }
      });
   },

   getFullFeedbackSavedMessage: function(taskMode) {
      var scoreDiffMsg = "Score";
      var showRetrieveAnswer = false;
      if (this.submittedAnswer !== '' && this.prevSavedScore !== undefined) {
         if (!this.hasSolution) {
            if (this.prevSavedScore < this.submittedScore) {
               scoreDiffMsg = "Votre score est maintenant";
            } else if (this.prevSavedScore > this.submittedScore) { 
               scoreDiffMsg = "C'est moins bien qu'avant ; votre score reste";
               showRetrieveAnswer = true;
            }
            else {
               scoreDiffMsg = "Votre score reste le même";
            }
         } else {
            if (this.prevSavedScore != this.submittedScore) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " +
                  this.prevSavedScore + ". Avec cette réponse, votre score serait";
            } else if (this.submittedAnswer != this.savedAnswer) {
               scoreDiffMsg = "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de " +
                  this.prevSavedScore + ". Avec cette réponse, votre score resterait le même";
            } else {
               scoreDiffMsg = "Votre score est de";
            }
         }
      }
      scoreDiffMsg += " : " + this.graderScore + " sur " + this.taskParams.maxScore + ".";
      if ((this.hasSolution && this.savedAnswer != this.prevAnswer) ||
          (this.graderScore > 0 && (taskMode == 'saved_changed' || showRetrieveAnswer))) {
          scoreDiffMsg += ' <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">Rechargez la réponse validée.</a>';
      }
      return scoreDiffMsg;
   },
   getFullFeedbackWithLevelsSavedMessage: function() {
      var maxScoreLevel = this.levelsMaxScores[this.taskLevel];
      var showRetrieveAnswer = false;
      var message = "";
      var curAnswer = this.submittedAnswer;
      var answerExists = false;
      if (curAnswer !== '') {
         curAnswer = $.parseJSON(curAnswer);
         answerExists = !$.isEmptyObject(curAnswer);
      }
      if (!answerExists) {
         if (this.levelsScores[this.taskLevel] > 0) {
            showRetrieveAnswer = true;
         } else {
            message += "Vous n'avez pas encore obtenu de points sur cette version.";
         }
      } else {
         var plural = "";
         if (this.submittedScore > 1) {
            plural = "s";
         }
         message = 'Score obtenu : <span id="answerScore">' + this.submittedScore + " point"  + plural +
            " sur " + maxScoreLevel + ".</span><br/>";
         if (this.hasSolution) {
            message += "Le concours est terminé : votre réponse n'est pas enregistrée.";
            if (this.prevSavedScore !== undefined) {
               showRetrieveAnswer = true;
            }
         } else {
            var prevScore = this.prevLevelsScores[this.taskLevel];
            if (this.prevSavedScore !== undefined) {
               if (this.submittedScore > prevScore) {
                  if (this.submittedScore < maxScoreLevel) {
                     message += "Essayez de faire encore mieux, ou passez à une version plus difficile.";
                  } else if (this.taskLevel == "hard") {
                     message += "C'est le meilleur score possible sur ce sujet ; félicitations !";
                  } else {
                     message += "Pour obtenir plus de points, passez à une version plus difficile.";
                  }
               } else if (this.submittedScore < prevScore) { 
                  message += "Vous aviez fait mieux avant.";
                  showRetrieveAnswer = true;
               }
               else {
                  message += "Votre score reste le même.";
               }
            }
         }
      }
      if (showRetrieveAnswer) {
         message += ' <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">Rechargez votre meilleure réponse.</a>';
      }
      return message;
   },
   getFullFeedbackGraderMessage: function(taskMode) {
      switch (taskMode) {
         case 'saved_unchanged':
            var color = 'red';
            if (this.submittedScore == this.taskParams.maxScore) {
               color = 'green';
            } else if (this.submittedScore > 0) {
               color = '#ff8c00';
            }
            if (this.graderMessage !== "") {
               if (!this.stoppedShowingResult) {
                  return '<div style="margin: .2em 0; color: ' + color + '; font-weight: bold;">' + this.graderMessage + '</div>';
               } 
            }
            break;
      }
      return '';
   },
   // TODO: rename function below to getFullFeedbackValidate, assuming it is not called from outside this file
   getFullFeedbackValidateMessage: function(taskMode, disabledStr) {
      switch (taskMode) {
         case 'saved_unchanged':
            if (this.graderMessage !== "") {
               if (!this.hideValidateButton && !this.hasSolution) {
                  return '<input type="button" value="Valider" onclick="platform.validate(\'done\', function(){});" ' +
                     disabledStr + '/>';
               }
            }
            break;
         case 'unsaved_unchanged':
         case 'unsaved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="Évaluer cette réponse" onclick="displayHelper.validate(\'test\');" ' +
                     disabledStr + '/>';
               } else {
                  return '<input type="button" value="Valider" onclick="platform.validate(\'done\', function(){});" ' +
                     disabledStr + '/>';
               }
            }
            break;
         case 'saved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="Évaluer cette réponse" onclick="displayHelper.validate(\'test\');" ' +
                     disabledStr + '/>';
               } else {
                  // was: “Valider votre nouvelle réponse”
                  return '<input type="button" value="Valider" onclick="platform.validate(\'done\', function(){});" ' +
                     disabledStr + '/>';
               }
            }
            break;
      }
      return '';
   },

   lastSentHeight: null,
   updateMessages: function() {
      var self = this;
      this.refreshMessages = false;
      var suffix, prefix; 
      if (this.hasAnswerChanged) {
         suffix = 'changed';
      } else {
         suffix = 'unchanged';
      }
      if (this.savedAnswer !== '' && this.savedAnswer != this.defaultAnswer) {
         prefix = 'saved';
      } else {
         prefix = 'unsaved';
      }
      if (this.submittedAnswer !== '' && this.submittedAnswer != this.savedAnswer) {
         prefix = 'saved'; // equivalent, should be named differently
         suffix = 'unchanged';
      }
      var taskMode = prefix + '_' + suffix;
      var messages = { graderMessage: '', validate: '', cancel: '', saved: '' };
      var disabledStr = this.readOnly ? ' disabled' : '';
      if (this.showScore) {
         if (!this.hideRestartButton) {
            messages.cancel = '<input type="button" value="Recommencer" onclick="displayHelper.restartAll();"' +
               disabledStr + '/></div>';
         }
         messages.graderMessage = this.getFullFeedbackGraderMessage(taskMode);
         messages.validate = this.getFullFeedbackValidateMessage(taskMode, disabledStr);
         if (this.hasLevels) {
            messages.saved = this.getFullFeedbackWithLevelsSavedMessage(taskMode);
         } else {
            messages.saved = this.getFullFeedbackSavedMessage(taskMode);
         }
      } else {
         switch (taskMode) {
            case 'unsaved_unchanged':
            case 'unsaved_changed':
               if (!this.hasSolution) {
                  messages.validate = '<input type="button" value="Enregistrer votre réponse" ' +
                     'onclick="platform.validate(\'done\', function(){})" ' + disabledStr + '/>';
               }
               break;
            case 'saved_unchanged':
               if (!this.hasSolution) {
                  messages.saved = "Votre réponse a été enregistrée. Vous pouvez la modifier, ou bien " +
                     '<a href="#" onclick="platform.validate(\'cancel\', function(){}); return false;" ' + disabledStr +
                     ">l'annuler</a> et recommencer.";
               } else {
                  messages.saved = "Le concours étant terminé, votre réponse n'a pas été enregistrée. Vous pouvez " +
                     '<a href="#" onclick="displayHelper.validate(\'cancel\'); return false;" ' + disabledStr +
                     ">recharger la réponse que vous avez soumise</a>.";
               }
               break;
            case 'saved_changed':
               messages.saved = '<br/><b style="color: red;">Attention : une réponse différente est enregistrée.</b> ' +
                  'Vous pouvez <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">la recharger</a>.';
               if (!this.hideValidateButton) {
                  messages.validate = '<input type="button" value="Enregistrer cette nouvelle réponse" ' +
                     'onclick="platform.validate(\'done\', function(){})" ' + disabledStr + "/>";
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
      if (this.pointsAsStars && $('#answerScore').length) {
         var starContainers = [];
         var starsHTML = this.genStarContainers(starContainers, this.levelsMaxScores[this.taskLevel], 'answerScore');
         $('#answerScore').html(starsHTML);
         this.setStars(starContainers, 20);

         this.changeStarPoints('answerScore', this.levelsScores[this.taskLevel]);
      }
      window.task.getHeight(function(height) {
         if (height != self.lastSentHeight) {
            self.lastSentHeight = height;
            window.platform.updateHeight(height, function(){});
         }
      });
   },

   // Loads previously saved answer
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
      var self = displayHelper;
      task.reloadAnswer(retrievedAnswer, function() {
         self.submittedAnswer = self.savedAnswer;
         self.updateScore(self.savedAnswer, false);
         self.refreshMessages = true;
         self.checkAnswerChanged();
      });
   },

   sendBestScore: function(callback, scores, messages) {
      var bestLevel = 'easy';
      for (var curLevel in scores) {
         if (scores[bestLevel] <= scores[curLevel]) {
            bestLevel = curLevel;
         }
      }
      callback(scores[bestLevel], messages[bestLevel] + " (version " + this.levelsNames[bestLevel] + ")");
   },

   // Sets and manages scoring stars
   genStarContainers: function(idList, maxScore, prefix) {
      if (!this.pointsAsStars) return;
      var resultHTML = '';
      var starPoints = this.levelsMaxScores.hard / 4;
      var iStar = 0;
      for (var curScore = 0; curScore < maxScore; curScore += starPoints) {
         var starID = prefix + iStar;
         resultHTML += '<span id="' + starID + '" class="starContainer"></span>';
         idList.push(starID);
         iStar++;
      }
      return resultHTML;
   },
   setStars: function(parents, starWidth) {
      if (!this.pointsAsStars) return;
      if (starWidth === undefined) starWidth = 18;
      for (var curParent in parents) {
         this.createStar(parents[curParent], starWidth);
      }
   },
   changeStarsState: function(level, mode) {
      if (!this.pointsAsStars) return;
      var prefix = 'tabScore_' + level;
      var maxScores = this.levelsMaxScores;
      var starPoints = maxScores.hard / 4;
      var iStar = 0;
      for (var curScore = 0; curScore < maxScores[level]; curScore += starPoints) {
         var starPaper = document.getElementById(prefix + iStar).starPaper;
         starPaper.starState = mode;
         this.putEmptyStar(starPaper);
         iStar++;
      }
      this.changeStarPoints(prefix, this.levelsScores[level]);
   },
   changeStarPoints: function(prefix, points) {
      if (!this.pointsAsStars) return;
      var maxScores = this.levelsMaxScores;
      var starPoints = maxScores.hard / 4;
      var iStar = 0;
      var curScore = 0;
      while (curScore + starPoints <= points) {
         var starPaper = document.getElementById(prefix + iStar).starPaper;
         this.putFullStar(starPaper);
         iStar++;
         curScore += starPoints;
      }
      if (points > curScore) {
         var starPaper = document.getElementById(prefix + iStar).starPaper;
         this.putFullStar(starPaper, (points - curScore) / starPoints);
      }
   },
   // Star management private functions
   createStar: function(parent, displayWidth) {
      var paper = new Raphael(parent, displayWidth, displayWidth * 0.95);
      paper.starWidth = displayWidth;
      paper.starState = 'normal';
      this.putEmptyStar(paper);
      document.getElementById(parent).starPaper = paper;
   },
   putEmptyStar: function(paper) {
      if (paper.emptyStars) {
         for (var iStar in paper.emptyStars) {
            paper.emptyStars[iStar].remove();
         }
      }
      var scaleFactor = paper.starWidth / 100;
      var fillColors = { normal: 'white', locked: '#ddd', useless: '#ced' };
      var strokeColors = { normal: 'black', locked: '#ddd', useless: '#444' };
      var starCoords = [25,60, 5,37, 35,30, 50,5, 65,30, 95,37, 75,60, 78,90, 50,77, 22,90];
      var coordsStr = this.pathFromCoords(starCoords);
      paper.emptyStars = [
         paper.path(coordsStr).attr({
            fill: fillColors[paper.starState],
            stroke: 'none'
         }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0').toBack(),
         paper.path(coordsStr).attr({
            fill: 'none',
            stroke: strokeColors[paper.starState],
            'stroke-width': 5 * scaleFactor
         }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0')
      ];
   },
   putFullStar: function(paper, clipWidth) {
      if (clipWidth === undefined) clipWidth = 1;
      if (paper.fullStars) {
         for (var iStar in paper.fullStars) {
            paper.fullStars[iStar].remove();
         }
      }
      if (clipWidth <= 0) return;

      var clipPath = function(coords, xClip) {
         var result = [coords[0], coords[1]];
         var clipped = false;
         for (var iCoord = 2; iCoord + 2 < coords.length; iCoord += 2) {
            var x1 = coords[iCoord - 2], y1 = coords[iCoord - 1];
            var x2 = coords[iCoord], y2 = coords[iCoord + 1];
            if (coords[iCoord] > xClip) {
               if (!clipped) {
                  result.push(xClip, y1 + (y2 - y1) * (xClip - x1) / (x2 - x1));
                  clipped = true;
               }
            } else {
               if (clipped) {
                  result.push(xClip, y1 + (y2 - y1) * (xClip - x1) / (x2 - x1));
                  clipped = false;
               }
               result.push(x2, y2);
            }
         }
         return result;
      }

      var scaleFactor = paper.starWidth / 100;
      var xClip = clipWidth * 100;
      var starCoords = [[5,37, 35,30, 50,5, 65,30, 95,37, 75,60, 25,60, 5,37], [22,90, 50,77, 78,90, 75,60, 25,60, 22,90]];
      paper.fullStars = [];
      for (var iPiece in starCoords) {
         var coords = clipPath(starCoords[iPiece], xClip);
         var star = paper.path(this.pathFromCoords(coords)).attr({
            fill: '#ffc90e',
            stroke: 'none'
         }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0');
         paper.fullStars.push(star);
      }
      if (paper.emptyStars) {
         paper.emptyStars[1].toFront();
      }
   },
   pathFromCoords: function(coords) {
      var result = 'm' + coords[0] + ',' + coords[1];
      for (var iCoord = 2; iCoord < coords.length; iCoord += 2) {
         var x1 = coords[iCoord - 2], y1 = coords[iCoord - 1];
         var x2 = coords[iCoord], y2 = coords[iCoord + 1];
         result += ' ' + (x2 - x1) + ',' + (y2 - y1);
      }
      result += 'z';
      return result;
   }
};

window.platform.subscribe(displayHelper);

})();
