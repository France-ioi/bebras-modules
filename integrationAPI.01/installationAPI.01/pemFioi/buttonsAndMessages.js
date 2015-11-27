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
   timeLoaded: 0,
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
   thresholdEasy: 60,
   thresholdMedium: 120,
   avatarType: "beaver",

   hasLevels: false,
   pointsAsStars: true, // TODO: false as default
   unlockedLevels: 3,
   neverHadHard: false,
   showMultiversionNotice: false,
   levelsScores: { easy: 0, medium: 0, hard: 0 },
   levelsRanks: { easy: 0, medium: 1, hard: 2 },
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
         for (var iPlacement = 0; iPlacement < placementNames.length; iPlacement++) {
            var placement = 'displayHelper_' + placementNames[iPlacement];
            if ($('#' + placement).length === 0) {
               addTaskHTML += '<div id="' + placement + '"></div>';
            }
         }
         addTaskHTML += '</div>';
         if (!document.getElementById('displayHelperAnswering')) {
            $(self.taskSelector).append(addTaskHTML);   
         }
         self.loaded = true;
         self.timeLoaded = new Date().getTime();
         if (self.popupMessageShown) {
            $('#displayHelperAnswering').hide();
         }

         var taskDelayWarning = function() {
            if (self.popupMessageShown) {
               self.taskDelayWarningTimeout = setTimeout(taskDelayWarning, 5000);
            } else {
               self.showPopupMessage("<p>Attention, cela fait plus de 5 minutes que vous êtes sur cette question.</p>" +
                  "<p>Vous devriez sans doute changer de sujet, en cliquant sur le bouton tout en haut à droite.</p>", 'blanket', "D'accord", null, null, "warning");
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
      for (var iParam = 0; iParam < paramNames.length; iParam++) {
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
         scoreHTML = '<span></span><span id="titleStars"></span>';
         $('#task > h1').append(scoreHTML);
         drawStars('titleStars', 4, 24, 0, 'normal');
      } else {
         // Disabled: doesn't work with new tabs layout.
         //scoreHTML = '<div class="bestScore">Score retenu : <span id="bestScore">0</span> sur ' + maxScores.hard + '</div>';
         //$('#tabsContainer').append(scoreHTML);
      }

      var tabsStarContainers = [];
      var tabsHTML = '<div id="tabsMenu">';
      var curLevel;
      for (curLevel in this.levelsNames) {
         tabsHTML += '<span class="li" id="tab_' + curLevel + '"><a href="#' + curLevel + '">';
         if (this.pointsAsStars) {
            tabsHTML += 'Version <span id="stars_' + this.levelsRanks[curLevel] + '"></span>';
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
         for (var iLevel = 0; iLevel < self.levels.length; iLevel++) {
            curLevel = self.levels[iLevel];
            if (iLevel >= self.unlockedLevels) {
               $('#tab_' + curLevel).addClass('lockedLevel');
            }
            self.updateStarsAtLevel(curLevel);
         }
      }, 100);

      $('#tabsContainer').after('<div id="popupMessage"></div>');
   },

   updateStarsAtLevel: function(level) {
      var rate = this.levelsScores[level] / this.levelsMaxScores[level];
      var iLevel = this.levelsRanks[level];
      var mode = 'normal';
      if (iLevel >= this.unlockedLevels) {
         mode = 'locked';
      }
      if (this.graderScore > this.levelsMaxScores[level]) {
         mode = 'useless';
      }
      drawStars('stars_' + iLevel, iLevel + 2, 18, rate, mode);
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
      this.taskLevel = newLevel;

      task.reloadStateObject(state, true);
      task.reloadAnswerObject(answer);

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
   getAvatar: function(mood) {
      if (displayHelper.avatarType == "beaver") {
         return "castor.png";
      } else {
         if (mood == "success") {
            return "laptop_success.png";
         } else if (mood == "warning") {
            return "laptop_warning.png";
         }{
            return "laptop_error.png";
         }
      }
   },
   showPopupMessage: function(message, mode, buttonTextYes, agreeFunc, buttonTextNo, avatarMood) {
      if (mode != 'blanket') {
         $('#taskContent, #displayHelperAnswering').hide();
         $('#popupMessage').removeClass('floatingMessage');
      } else {
         $('#popupMessage').addClass('floatingMessage');
      }

      if (!buttonTextYes) {
         buttonTextYes = "D'accord";
      }
      // Hack: when in the context of the platform, we need to change the path
      var imgPath = window.contestsRoot ? window.contestsRoot + '/' + window.contestFolder + '/' : '../../modules/img/';
      var buttonYes = mode == 'lock' ? '' : '<button class="buttonYes">' + (buttonTextYes || "D'accord") + '</button>';
      var buttonNo = '<button class="buttonNo" style="padding-left:10px">' + (buttonTextNo || "Annuler") + '</button>';
      if (buttonTextNo == undefined) {
         buttonNo = '';
      }
      $('#popupMessage').html('<div class="container">' +
         '<img class="beaver" src="' + imgPath + this.getAvatar(avatarMood) + '"/>' +
         '<img class="messageArrow" src="' + imgPath + 'fleche-bulle.png"/>' +
         '<div class="message">' + message + '</div>' + buttonYes + buttonNo + '</div>').show();
      $('#popupMessage .buttonYes').click(function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
         if (agreeFunc) {
            agreeFunc();
         }
      });
      $('#popupMessage .buttonNo').click(function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
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
      var that = this;
      function confirmRestartAll() {
         that.stopShowingResult();
         if (!that.hasLevels) {
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
      }
      if (this.hasLevels) {
         this.showPopupMessage("Êtes-vous certain de vouloir recommencer cette version ?", 'blanket', "Oui", confirmRestartAll, "Non");
      } else {
         confirmRestartAll();
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
      var self = this;
      function refresh() {
         self.refreshMessages = true;
         self.checkAnswerChanged();
      }
      if (allLevels) {
         // TODO: make sure the grader doesn't evaluate each level at each call (most do right now!)
         self.updateScoreOneLevel(answer, "easy", function() {
            self.updateScoreOneLevel(answer, "medium", function() {
               self.updateScoreOneLevel(answer, "hard", refresh);
            });
         });
      } else {
         this.updateScoreOneLevel(answer, this.taskLevel, function() {
            if (self.hasLevels) {
               self.showValidatePopup(self.taskLevel);
            }
         });
      }
   },
   updateScoreOneLevel: function(answer, gradedLevel, callback) {
      var self = this;
      this.graderMessage = "Évaluation en cours";
      grader.gradeTask(answer, null, function(score, message) {
         score = +score;
         self.submittedScore = score;
         if (self.hasSolution) {
            self.graderScore = score;
            self.levelsScores[gradedLevel] = score;
         } else {
            if (self.hasLevels) {
               if (score > self.levelsScores[gradedLevel]) {
                  self.levelsScores[gradedLevel] = score;
                  self.graderScore = score;
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
               self.graderScore = score;
            }
         }
         if (message !== undefined) {
            self.graderMessage = message;
         } else {
            self.graderMessage = "";
         }
         // TODO : should not be called from here, might update the display of a level not currently opened!
         if (self.hasLevels) {
            self.updateScoreDisplays(gradedLevel);
         }
         callback();
      }, gradedLevel);
   },
   updateScoreDisplays: function(gradedLevel) {
      var scores = this.levelsScores;
      var maxScores = this.levelsMaxScores;
      if (this.pointsAsStars) {
         this.updateStarsAtLevel(gradedLevel);
         drawStars('titleStars', 4, 24, this.graderScore / maxScores.hard, 'normal');
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
            this.unlockedLevels++;
            this.updateStarsAtLevel(curLevel);
         }
      }
      if (scores[gradedLevel] == this.graderScore) {
         // Marks levels that can't earn points as useless
         for (curLevel in this.levelsNames) {
            if (maxScores[curLevel] > this.graderScore) {
               break;
            }
            if (this.pointsAsStars) {
               this.updateStarsAtLevel(curLevel);
            }
            $('#tab_' + curLevel).addClass('uselessLevel');
         }
      }
   },
   showValidatePopup: function(gradedLevel) {
      var curTime = new Date().getTime();
      var secondsSinceLoaded = (curTime - this.timeLoaded) / 1000;
      var actionNext = "stay";
      // Display popup to indicate what to do next
      var fullMessage = this.graderMessage;
      var maxScores = this.levelsMaxScores;
      var buttonText = "D'accord";
      var avatarMood = "error";
      if (this.graderScore >= maxScores[gradedLevel] - 0.001) {
         avatarMood = "success";
         buttonText = "Passer à la suite";
         fullMessage += "<br/><br/>";
         if (gradedLevel == "hard") {
            actionNext = "nextTask";
            fullMessage += "Vous avez entièrement résolu cette question, passez à une autre question.";
         } else {
            if ((gradedLevel == "medium") && (secondsSinceLoaded < this.thresholdMedium)) {
               actionNext = "hard";
               fullMessage += "Nous vous proposons d'essayer la version 4 étoiles.";
            } else if ((gradedLevel == "easy") && (secondsSinceLoaded < this.thresholdEasy)) {
               actionNext = "medium";
               fullMessage += "Nous vous proposons d'essayer la version 3 étoiles.";
            } else {
               actionNext = "nextTask";
               fullMessage += "Nous vous proposons de passer au sujet suivant. S'il vous reste du temps, vous reviendrez plus tard essayer la version suivante.";
            }
         }
      }
      var self = this;
      this.showPopupMessage(fullMessage, 'blanket', buttonText,
         function() {
            // TODO: replace with something compatible with the API.
            $(parent.document).scrollTop(0);
            if ((actionNext == "medium") || (actionNext == "hard")) {
               self.setLevel(actionNext);
            } else if (actionNext == "nextTask") {
               platform.validate("nextImmediate");
            }
         },
         null,
         avatarMood
      );
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
                     'onclick="platform.validate(\'done\', function(){})" ' + disabledStr + '/>';
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
         drawStars('answerScore', this.levelsRanks[this.taskLevel] + 2, 20,
            this.levelsScores[this.taskLevel] / this.levelsMaxScores[this.taskLevel], 'normal');
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
   }
};


/*
   draw nbStars stars of width starWidth in element of id id
   fills rate% of them in yellow from the left
   mode is "norma", "locked" or "useless"
*/
function drawStars(id, nbStars, starWidth, rate, mode) {
   $('#' + id).addClass('stars');

   function clipPath(coords, xClip) {
      var result = [[coords[0][0], coords[0][1]]];
      var clipped = false;
      for (var iCoord = 1; iCoord <= coords.length; iCoord++) {
         var x1 = coords[iCoord - 1][0];
         var y1 = coords[iCoord - 1][1];
         var x2 = coords[iCoord % coords.length][0];
         var y2 = coords[iCoord % coords.length][1];
         if (x2 > xClip) {
            if (!clipped) {
               result.push([xClip, y1 + (y2 - y1) * (xClip - x1) / (x2 - x1)]);
               clipped = true;
            }
         } else {
            if (clipped) {
               result.push([xClip, y1 + (y2 - y1) * (xClip - x1) / (x2 - x1)]);
               clipped = false;
            }
            result.push([x2, y2]);
         }
      }
      result.pop();
      return result;
   }

   function pathFromCoords(coords) {
      var result = 'm' + coords[0][0] + ',' + coords[0][1];
      for (var iCoord = 1; iCoord < coords.length; iCoord++) {
         var x1 = coords[iCoord - 1][0];
         var y1 = coords[iCoord - 1][1];
         var x2 = coords[iCoord][0];
         var y2 = coords[iCoord][1];
         result += ' ' + (x2 - x1) + ',' + (y2 - y1);
      }
      result += 'z';
      return result;
   }

   var fillColors = { normal: 'white', locked: '#ddd', useless: '#ced' };
   var strokeColors = { normal: 'black', locked: '#ddd', useless: '#444' };
   var starCoords = [[25, 60], [5, 37], [35, 30], [50, 5], [65, 30], [95, 37], [75, 60], [78, 90], [50, 77], [22, 90]];
   var fullStarCoords = [
      [[5, 37], [35, 30], [50, 5], [65, 30], [95, 37], [75, 60], [25, 60]],
      [[22, 90], [50, 77], [78, 90], [75, 60], [25, 60]]
   ];

   $('#' + id).html('');
   var paper = new Raphael(id, starWidth * nbStars, starWidth * 0.95);
   for (var iStar = 0; iStar < nbStars; iStar++) {
      var scaleFactor = starWidth / 100;
      var deltaX = iStar * starWidth;
      var coordsStr = pathFromCoords(starCoords, iStar * 100);

      paper.path(coordsStr).attr({
         fill: fillColors[mode],
         stroke: 'none'
      }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ',0');
      
      var ratio = Math.min(1, Math.max(0, rate * nbStars  - iStar));
      var xClip = ratio * 100;
      if (xClip > 0) {
         for (var iPiece = 0; iPiece < fullStarCoords.length; iPiece++) {
            var coords = clipPath(fullStarCoords[iPiece], xClip);
            var star = paper.path(pathFromCoords(coords)).attr({
               fill: '#ffc90e',
               stroke: 'none'
            }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ",0");
         }
      }
      paper.path(coordsStr).attr({
         fill: 'none',
         stroke: strokeColors[mode],
         'stroke-width': 5 * scaleFactor
      }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ',0');
   }
}


window.platform.subscribe(displayHelper);

})();
