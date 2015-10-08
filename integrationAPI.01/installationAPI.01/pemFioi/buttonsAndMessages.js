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
   tabMessageShown: false,

   hasLevels: false,
   pointsAsStars: true, // TODO: false as default
   unlockedLevels: 3,
   neverHadHard: false,
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
      this.showScore = (typeof views.grader !== 'undefined' && views.grader === true);
      this.taskParams = platform.getTaskParams();
      this.readOnly = (this.taskParams.readonly == true || this.taskParams.readOnly == 'true');
      this.graderScore = +this.taskParams.noScore;
      this.savedAnswer = '';

      var addTaskHtml = '<div id="displayHelperAnswering" class="contentCentered">';
      // Place button placement at the end of html if they don't already exist
      if ($('#displayHelper_validate').length === 0) {
         addTaskHtml += '<div id="displayHelper_validate"></div>';
      }
      if ($('#displayHelper_cancel').length === 0) {
         addTaskHtml += '<div id="displayHelper_cancel"></div>';
      }
      if ($('#displayHelper_saved').length === 0) {
         addTaskHtml += '<div id="displayHelper_saved"></div>';
      }
      addTaskHtml += '</div>';
      $(this.taskSelector).append(addTaskHtml);
   },

   setupLevels: function(initLevel) {
      task.reloadStateObject(task.getDefaultStateObject(), true);
      task.reloadAnswerObject(task.getDefaultAnswerObject());

      this.setupParams();
      this.setupLevelsTabs();

      $('#tabsMenu a').click(function(event) {
         event.preventDefault();
         var newLevel = $(this).attr('href').split('#')[1];
         displayHelper.setLevel(newLevel);
      });
      this.setLevel(initLevel);
   },
   setupParams: function() {
      var taskParams = platform.getTaskParams();

      this.hasLevels = true;
      if (taskParams.pointsAsStars !== undefined) {
         this.pointsAsStars = taskParams.pointsAsStars;
      }
      if (taskParams.unlockedLevels !== undefined) {
         this.unlockedLevels = taskParams.unlockedLevels;
      }
      if (taskParams.neverHadHard !== undefined) {
         this.neverHadHard = taskParams.neverHadHard;
      }

      var maxScore = 40;
      if (taskParams.maxScore !== undefined) {
         maxScore = taskParams.maxScore;
      }
      this.levelsMaxScores = {
         easy: Math.round(maxScore / 2),
         medium: Math.round(3 * maxScore / 4),
         hard: maxScore
      };
   },
   setupLevelsTabs: function() {
      var maxScores = this.levelsMaxScores;
      if (!this.pointsAsStars) {
         var scoreHTML = '<div class="bestScore">Score retenu : <span id="bestScore">0</span> sur ' + maxScores.hard + '</div>';
         $('#tabsContainer').append(scoreHTML);
      }

      var starContainers = [];
      var tabsHTML = '<ul id="tabsMenu">';
      for (var curLevel in this.levelsNames) {
         tabsHTML += '<li id="tab_' + curLevel + '"><a href="#' + curLevel + '">';
         if (this.pointsAsStars) {
            var starPoints = maxScores.hard / 4;
            var iStar = 0;
            tabsHTML += "Version ";
            for (var curScore = 0; curScore < maxScores[curLevel]; curScore += starPoints) {
               var starID = 'tabScore_' + curLevel + iStar;
               tabsHTML += '<span id="' + starID + '" class="starContainer"></span>';
               starContainers.push(starID);
               iStar++;
            }
         } else {
            tabsHTML += this.onlyLevelsNames[curLevel] + ' — ' +
               '<span id="tabScore_' + curLevel + '">0</span> / ' + maxScores[curLevel];
         }
         tabsHTML += '</a></li>';
      }
      tabsHTML += '</ul>';
      $('#tabsContainer').append(tabsHTML);
      this.setStars(starContainers);

      for (var iLevel in this.levels) {
         var curLevel = this.levels[iLevel];
         if (iLevel >= this.unlockedLevels) {
            $('#tab_' + curLevel).addClass('lockedLevel');
            this.changeStarsColors(curLevel, 'empty', this.starColors.locked, this.starColors.locked);
         }
      }

      $('#tabsContainer').after('<div id="tabMessage"></div>');
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
      } else if (this.tabMessageShown) {
         $('#tabMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         this.tabMessageShown = false;
      }
      if ($('#tab_' + newLevel).hasClass('lockedLevel')) {
         this.showTabMessage("Cette version est verrouillée. Résolvez la précédente pour y accéder !", false);
         return;
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
      this.validate('stay');
      this.stopShowingResult();

      if (!this.hasSolution) {
         if ($('#tab_' + newLevel).hasClass('uselessLevel')) {
            var buttonText = "Je veux quand même voir cette version";
            if (this.levelsScores[newLevel] == this.levelsMaxScores[newLevel]) {
               if (newLevel == 'hard') {
                  this.showTabMessage("Vous avez déjà tous les points à cette question. Passez à une autre !", true, buttonText);
               } else {
                  this.showTabMessage("Vous avez déjà résolu cette version de la question. Vous pouvez passer " +
                     "à une autre question ou essayer de résoudre une version plus difficile.", true, buttonText);
               }
            } else {
               this.showTabMessage("Vous avez déjà au moins autant de points à la question que cette version " +
                  "peut vous en rapporter. Passez à la suite !", true, buttonText);
            }
         } else if (newLevel == 'hard' && this.neverHadHard) {
            var versionName = this.levelsNames[newLevel];
            if (this.pointsAsStars) versionName = "à 4 étoiles";
            this.showTabMessage("Résoudre une version " + versionName + " peut vous prendre beaucoup de temps ; " +
               "songez en priorité à répondre aux questions en version facile pour gagner des points rapidement.", true,
               "J'y prendrai garde", function() {
                  displayHelper.neverHadHard = false;
               }
            );
         }
      }
   },
   showTabMessage: function(message, fullTab, buttonText, agreeFunc) {
      if (fullTab) {
         $('#taskContent, #displayHelperAnswering').hide();
         $('#tabMessage').removeClass('floatingMessage');
      } else {
         $('#tabMessage').addClass('floatingMessage');
      }

      if (!buttonText) {
         buttonText = "D'accord !";
      }
      $('#tabMessage').html('<div><img src="../../modules/img/castor.png"/><img src="../../modules/img/fleche-bulle.png"/>' +
         '<div>' + message + '</div><button>' + buttonText + '</button></div>').show();
      $('#tabMessage button').click(function() {
         $('#tabMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.tabMessageShown = false;
         if (agreeFunc) {
            agreeFunc();
         }
      });
      this.tabMessageShown = true;
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
      var that = this;
      this.checkAnswerInterval = setInterval(
         function() {
             that.checkAnswerChanged();
         }, 1000);
      task.getAnswer(function(answer) {
         that.defaultAnswer = answer;
         that.refreshMessages = true;
         that.checkAnswerChanged();
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
         task.reloadAnswer('', function() {})
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
      var that = this;
      if (mode == 'cancel') {
         this.savedAnswer = '';
         task.reloadAnswer('', function() {
            that.checkAnswerChanged();
         });
      } else if (mode == 'stay') {
         this.submittedScore = this.levelsScores[this.taskLevel];
         this.refreshMessages = true;
         this.checkAnswerChanged();
      } else {
         task.getAnswer(function(strAnswer) {
            if (!that.hasSolution) {
               that.prevSavedScore = that.graderScore;
               if (that.hasLevels) {
                  that.prevLevelsScores[that.taskLevel] = that.levelsScores[that.taskLevel];
               }
            }
            that.submittedAnswer = strAnswer;
            if (that.showScore) {
               that.updateScore(strAnswer, false);
            } else {
               that.savedAnswer = strAnswer;
            }
            that.refreshMessages = true;
            that.checkAnswerChanged();
         });
      }
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
   updateScoreOneLevel: function(answer, gradedLevel) {
      var that = this;
      grader.gradeTask(answer, null, function(score, message) {
         score = +score;
         that.submittedScore = score;
         if (that.hasSolution) {
            that.graderScore = score;
            that.levelsScores[gradedLevel] = score;
         } else {
            if (score > that.graderScore) {
               that.graderScore = score;
            }
            if (that.hasLevels) {
               if (score > that.levelsScores[gradedLevel]) {
                  that.levelsScores[gradedLevel] = score;
                  if (that.savedAnswer == '') {
                     that.savedAnswer = answer;
                  } else {
                     var savedAnswerObj = $.parseJSON(that.savedAnswer);
                     var answerObj = $.parseJSON(answer);
                     savedAnswerObj[gradedLevel] = answerObj[gradedLevel];
                     that.savedAnswer = JSON.stringify(savedAnswerObj);
                  }
               }
            } else if (score > that.graderScore) {
               that.savedAnswer = answer;
            }
         }
         if (message !== undefined) {
            that.graderMessage = message;
         } else {
            that.graderMessage = "";
         }
         if (that.hasLevels) {
            that.updateScoreDisplays(gradedLevel);
         }
         that.refreshMessages = true;
         that.checkAnswerChanged();
      }, gradedLevel);
   },
   updateScoreDisplays: function(gradedLevel) {
      var scores = this.levelsScores;
      var maxScores = this.levelsMaxScores;
      if (this.pointsAsStars) {
         var starPoints = maxScores.hard / 4;
         var iStar = 0;
         var starScore = 0;
         while (starScore + starPoints < scores[gradedLevel]) {
            this.editStar('tabScore_' + gradedLevel + iStar + '_full', 1);
            iStar++;
            starScore += starPoints;
         }
         this.editStar('tabScore_' + gradedLevel + iStar + '_full', (scores[gradedLevel] - starScore) / starPoints);
      } else {
         $('#tabScore_' + gradedLevel).html(scores[gradedLevel]);
         $('#bestScore').html(this.graderScore);
      }

      var gradedLevelNum = $.inArray(gradedLevel, this.levels);
      // Possibly unlocking a level
      if (maxScores[gradedLevel] == scores[gradedLevel]) {
         var unlockedLevel = gradedLevelNum + 1;
         if (unlockedLevel < this.levels.length && unlockedLevel >= this.unlockedLevels) {
            var curLevel = this.levels[unlockedLevel];
            $('#tab_' + curLevel).removeClass('lockedLevel');
            this.changeStarsColors(curLevel, 'empty', this.starColors.empty, 'black');
            this.unlockedLevels++;
         }
      }
      if (scores[gradedLevel] == this.graderScore) {
         // Marks the level with most points
         var levelSelected = false;
         for (var iLevel = this.levels.length - 1; iLevel >= 0; iLevel--) {
            var curLevel = this.levels[iLevel];
            if (!levelSelected && scores[curLevel] == this.graderScore) {
               this.changeStarsColors(curLevel, 'full', this.starColors.full, 'black');
               levelSelected = true;
            } else {
               this.changeStarsColors(curLevel, 'full', this.starColors.fullUseless, this.starColors.uselessBorder);
            }
         }
         // Marks levels that can't earn points as useless
         for (var curLevel in this.levelsNames) {
            if (maxScores[curLevel] > this.graderScore) {
               break;
            }
            this.changeStarsColors(curLevel, 'empty', this.starColors.emptyUseless, this.starColors.uselessBorder);
            $('#tab_' + curLevel).addClass('uselessLevel');
         }
      }
   },

   // Does task have unsaved answers?
   hasNonSavedAnswer: function(callback) {
      if (!task) {
         return false;
      }
      var that = this;
      task.getAnswer(function(curAnswer) {
         if (curAnswer != that.prevAnswer) {
            try {
               if (self != top && parent.Tracker) {
                  var data = {
                     dataType: 'nonSavedAnswer', teamID: parent.teamID, questionKey: parent.currentQuestionKey, answer: curAnswer
                  };
                  // call TrackData, only when loaded in an iframe
                  // this is not yet document in the API, but should be soonish
                  parent.Tracker.trackData(data);
               }
            } catch (e) {}
            that.prevAnswer = curAnswer;
         }
         if (curAnswer != that.submittedAnswer) {
            that.submittedAnswer = '';
            that.refreshMessages = true;
         }
         if (curAnswer == that.defaultAnswer && that.savedAnswer === '') {
            callback(false);
         } else {
            callback(curAnswer != that.submittedAnswer);
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
      var that = this;
      this.hasNonSavedAnswer(function(hasNonSavedAnswer) {
         if (that.submittedAnswer !== '') {
            that.refreshMessages = true;
         }
         if (hasNonSavedAnswer && !that.hasAnswerChanged) {
            that.refreshMessages = true;
            that.hasAnswerChanged = true;
         } else if (!hasNonSavedAnswer && that.hasAnswerChanged) {
            that.refreshMessages = true;
            that.hasAnswerChanged = false;
         }
         if (that.refreshMessages) {
            that.updateMessages();
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
   getFullFeedbackWithLevelsSavedMessage: function(taskMode) {
      var maxScoreLevel = this.levelsMaxScores[this.taskLevel];
      var showRetrieveAnswer = false;
      var message = "";
      var curAnswer = this.submittedAnswer;
      var answerExists = false;
      if (curAnswer != '') {
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
                     message += "C'est le meilleur score possible sur ce sujet ; félicitations !";
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
   getFullFeedbackValidateMessage: function(taskMode, disabledStr) {
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
                  return '<br/><span style="display: inline-block; margin-bottom: .2em; color: ' +
                     color + '; font-weight: bold;">' + this.graderMessage + '</span>';
               } else if (!this.hideValidateButton && !this.hasSolution) {
                  return '<input type="button" value="Valider votre réponse" onclick="platform.validate(\'done\');" ' +
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
                  return '<input type="button" value="Valider votre réponse" onclick="platform.validate(\'done\');" ' +
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
                  return '<input type="button" value="Valider votre nouvelle réponse" onclick="platform.validate(\'done\');" ' +
                     disabledStr + '/>';
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
      var messages = { validate: '', cancel: '', saved: '' };
      var disabledStr = this.readOnly ? 'disabled' : '';
      if (this.showScore) {
         if (!this.hideRestartButton) {
            messages.cancel = '<div style="margin-top: 5px;">' +
               '<input type="button" value="Effacer votre réponse actuelle" onclick="displayHelper.restartAll();" ' +
               disabledStr + '/></div>';
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
            case 'unsaved_unchanged':
            case 'unsaved_changed':
               if (!this.hasSolution) {
                  messages.validate = '<input type="button" value="Enregistrer votre réponse" ' +
                     'onclick="platform.validate(\'done\')" ' + disabledStr + '/>';
               }
               break;
            case 'saved_unchanged':
               if (!this.hasSolution) {
                  messages.saved = "Votre réponse a été enregistrée. Vous pouvez la modifier, ou bien " +
                     '<a href="#" onclick="platform.validate(\'cancel\'); return false;" ' + disabledStr +
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
                     'onclick="platform.validate(\'done\')" ' + disabledStr + "/>";
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
         var starsHTML = '';
         var starPoints = this.levelsMaxScores.hard / 4;
         var iStar = 0;
         for (var curScore = 0; curScore < this.levelsMaxScores[this.taskLevel]; curScore += starPoints) {
            var starID = 'answerScore' + iStar;
            starsHTML += '<span id="' + starID + '" class="starContainer"></span>';
            starContainers.push(starID);
            iStar++;
         }
         $('#answerScore').html(starsHTML);
         this.setStars(starContainers, 20);

         iStar = 0;
         var starScore = 0;
         while (starScore + starPoints < this.levelsScores[this.taskLevel]) {
            this.editStar('answerScore' + iStar + '_full', 1);
            iStar++;
            starScore += starPoints;
         }
         this.editStar('answerScore' + iStar + '_full', (this.levelsScores[this.taskLevel] - starScore) / starPoints);
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
   starColors: {
      empty: 'white',
      full: '#ffc90e',
      emptyUseless: '#ced',
      fullUseless: '#fba',
      locked: '#bbb',
      uselessBorder: '#666'
   },
   setStars: function(parents, starWidth) {
      if (!this.pointsAsStars) return;
      if (starWidth === undefined) starWidth = 18;
      for (var curParent in parents) {
         var parentId = parents[curParent];
         $('#' + parentId).html(
            '<span id="' + parentId + '_empty" class="emptyStar"></span>' +
            '<span id="' + parentId + '_full" class="fullStar hiddenStar"></span>');
         this.putStar(parentId + '_empty', starWidth);
         this.putStar(parentId + '_full', starWidth, this.starColors.full);
      }
   },
   putStar: function(parent, displayWidth, fillColor, strokeColor) {
      if (!this.pointsAsStars) return;
      if (fillColor === undefined) fillColor = this.starColors.empty;
      if (strokeColor === undefined) strokeColor = 'black';
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
   changeStarsColors: function(level, suffix, fillColor, strokeColor) {
      if (!this.pointsAsStars) return;
      var maxScores = this.levelsMaxScores;
      var starPoints = maxScores.hard / 4;
      var iStar = 0;
      for (var curScore = 0; curScore < maxScores[level]; curScore += starPoints) {
         this.editStar('tabScore_' + level + iStar + '_' + suffix, undefined, fillColor, strokeColor);
         iStar++;
      }
   },
   editStar: function(parent, clipWidth, fillColor, strokeColor) {
      if (!this.pointsAsStars) return;
      var parentElement = document.getElementById(parent);
      var starCanvas = parentElement.starCanvas;
      if (clipWidth !== undefined) {
         if (clipWidth == 0) {
            $('#' + parent).addClass('hiddenStar');
         } else {
            starCanvas.setSize(parentElement.starWidth * clipWidth, parentElement.starWidth * .95);
            $('#' + parent).removeClass('hiddenStar');
         }
      }
      if (fillColor !== undefined) {
         starCanvas.forEach(function(starPath) {
            starPath.attr('fill', fillColor);
         });
      }
      if (strokeColor !== undefined) {
         starCanvas.forEach(function(starPath) {
            starPath.attr('stroke', strokeColor);
         });
      }
   }
};

platform.subscribe(displayHelper);
