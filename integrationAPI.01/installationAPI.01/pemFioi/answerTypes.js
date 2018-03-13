'use strict';
/* 
 *
 * This file contains the code needed for tasks using only simple answer
 * types (mcq, checkboxes and free input). It creates and registers a task
 * object, using both the task display API and the task standard answer types
 * API (see corresponding documents).
 *
 * Requirements: jQuery must be included before this file, as well as the
 * implementation of TaskProxyManager defined in the task integration API.
 * This file will also need displayHelper object and Track object, but their
 * implementation can be loaded afterwards.
 *
 */


/* 
 * Object implementing the functions of the SAT API, and keeping track of
 * the answer.
 */

var stdAnsTypes = {
   strings : { // TODO: translations !
      'value_not_integer': "Attention : la valeur saisie n'est pas un entier",
      'cancel_saved_answer': "Annuler la réponse enregistrée",
      'answer_saved': "Votre réponse a été enregistrée"
   },
   randomSeed: 0,
   currentAnswer: null,
   answersSelector: '#answers',
   lastSentHeight: null,
   updateHeight: function(height) {
      if (stdAnsTypes.lastSentHeight != height) {
         stdAnsTypes.lastSentHeight = height;
         platform.updateDisplay({height: height}, function() {});
      }
   },

   /* When an aswer is selected, style modifications only */
   highlightAnswer: function(answer) {
      for (var choice = 1; choice <= 10; choice++) { // TODO: real value !
         $('#choice_' + choice + ' .sat-choiceArea').removeClass('sat-choiceArea-selected');
         $('#answerButton_' + choice).removeClass('sat-button-selected');
      }
      $('#answerButton_' + answer).addClass('sat-button-selected');
      $('#choice_' + answer + ' .sat-choiceArea').addClass('sat-choiceArea-selected');
   },
   
   choiceButton: function(iButton, iChoice, buttonValue) {
      var choicesNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
      if (buttonValue === undefined) {
         buttonValue = choicesNames[iButton];
      }
      return '<ul class="sat-ul-button"><li class="sat-button" id="answerButton_' + (iChoice + 1) + '">' +
         '<input class="answerButton" type="button" value="' + buttonValue + '" ' +
            'onclick="stdAnsTypes.selectAnswer(\'' + (iChoice + 1) + '\')" /></li></ul>';
   },
   
   choiceCheckbox: function(iChoice, name) {
      var id = 'answerCheckbox_' + (iChoice + 1);
      return '<label><input type="checkbox" id="' + id + '" onclick="if (typeof Tracker !== \'undefined\') {Tracker.trackCheckbox(\'' + id + '\');}"/>' + name + '</label>';
   },
   
   getAnswerCheckboxes: function(nbChoices) {
      var answer = '';
      for (var iChoice = 0; iChoice < nbChoices; iChoice++) {
         var id = 'answerCheckbox_' + (iChoice + 1);
         if ($('#' + id).is(':checked')) {
            answer += '1';
         } else {
            answer += '0';
         }
      }
      return answer;
   },
   
   selectCheckboxes: function(answer) {
      var iChoice = 0;
      while (true) {
         var id = 'answerCheckbox_' + (iChoice + 1);
         if ($('#' + id).length === 0) {
            break;
         }
         $('#' + id).attr('checked', false);
         if (answer.length > iChoice) {
            if (answer.charAt(iChoice) === '1') {
               $('#' + id).attr('checked', true);
            }
         }
         iChoice++;
      }
   },
   
   genTaskMultipleChoices: function(nbColumns, choices, asButtonValues, answersSelector, preventShuffle) {
      task.load = function(views, callback) {
         platform.getTaskParams(null, null, function (taskParams) {
            stdAnsTypes.randomSeed = taskParams.randomSeed;
            stdAnsTypes.currentAnswer = '';
            stdAnsTypes.loadTaskMultipleChoices(nbColumns, choices, asButtonValues, answersSelector, preventShuffle);
            callback();
         });
      };
   },

   loadTaskMultipleChoices: function(nbColumns, choices, asButtonValues, answersSelector, preventShuffle) {
      this.answersSelector = answersSelector;
      if (asButtonValues != 'checkboxes') {
         displayHelper.hideValidateButton = true;
      }
      var oneColumn = (nbColumns == 1);
      var oneRow = (nbColumns == choices.length);
      var mainTableClasses = 'sat-table';
      if (!oneColumn && (asButtonValues != 'checkboxes')) {
         mainTableClasses += ' sat-table-center';
      }
      var html= '<center><table class="' + mainTableClasses + '">';
      var shuffledOrder = stdAnsTypes.getShuffledChoicesOrder(choices.length, preventShuffle);
      for (var iChoice = 0; iChoice < choices.length; iChoice++) {
         var posChoice = shuffledOrder[iChoice];
         var buttonValue = undefined;
         if (asButtonValues == 'asButtons') {
            buttonValue = choices[posChoice];
         }
         if (iChoice % nbColumns === 0) {
            html += '<tr>';
         }
         if (oneColumn || (asButtonValues == 'checkboxes')) {
            html += '<td>';
         } else {
            html += '<td id="choice_' + (posChoice + 1) + '"><center>';
         }
         if (asButtonValues == 'checkboxes') {
            html += stdAnsTypes.choiceCheckbox(posChoice, choices[posChoice]);
         } else {
            html += stdAnsTypes.choiceButton(iChoice, posChoice, buttonValue);
            if (oneColumn) {
               html += '</td><td id="choice_' + (posChoice + 1) + '">';
            }
            if (asButtonValues !== 'asButtons') {
               if (!oneColumn) {
                  html += '<br/>';
               }
               html += '<div class="sat-choiceArea">' + choices[posChoice] + '</div>';
            }
         }
         if (oneColumn || (asButtonValues == 'checkboxes')) {
            html += '</td>';
         } else {
            html += '</center></td>';
         }
         if (iChoice % nbColumns === nbColumns - 1) {
            html += '</tr>';
         }
      }
      html += '</table></center>';
      if (asButtonValues == 'checkboxes') {
         task.getAnswer = function(callback) {
            callback(stdAnsTypes.getAnswerCheckboxes(choices.length));
         };
         task.reloadAnswer = function(strAnswer, callback) {
            stdAnsTypes.selectCheckboxes(strAnswer);
            stdAnsTypes.showAnswerSelected(strAnswer);
            callback();
         };
      } else {
         task.getAnswer = function(callback) {
            callback(stdAnsTypes.currentAnswer);
         };
         task.reloadAnswer = function(strAnswer, callback) {
            stdAnsTypes.currentAnswer = strAnswer;
            stdAnsTypes.showAnswerSelected(strAnswer);
            callback();
         };
      }
      $(this.answersSelector).html(html);
      $(this.answersSelector).load(function() {
         task.getHeight(this.updateHeight);
         setTimeout(function() { // in case all images are not loaded yet
            task.getHeight(this.updateHeight);
         }, 4000);
      });
   },

   genTaskFreeInput: function(inputType, answersSelector, max_length, num_rows) {
      task.load = function(views, callback) {
         platform.getTaskParams(null, null, function (taskParams) {
            stdAnsTypes.randomSeed = taskParams.randomSeed;
            stdAnsTypes.currentAnswer = '';
            stdAnsTypes.loadTaskFreeInput(inputType, answersSelector, max_length, num_rows);
            callback();
         });
      };
      task.getAnswer = function(callback) {
         callback($('#input_answer').val());
      };
      task.reloadAnswer = function(strAnswer, callback) {
         $('#input_answer').val(strAnswer);
         stdAnsTypes.checkType();
         stdAnsTypes.showAnswerSelected(strAnswer);
         callback();
      };
   },
   
   loadTaskFreeInput: function(inputType, answersSelector, max_length, num_rows) {
      num_rows = (typeof num_rows !== 'undefined' && num_rows > 0) ? num_rows : 1;
      this.answersSelector = answersSelector;
      stdAnsTypes.checkType = function() {
         $('#error').html('');
         // TODO: check float, string, and length
         if (inputType === 'integer') {
            task.getAnswer(function(strAnswer) {
               if ((strAnswer !== '') && (!stdAnsTypes.isInteger($.trim(strAnswer)))) {
                  $('#error').html(stdAnsTypes.strings.value_not_integer);
               }
            });
         }
      }
      var html = '';
      if (num_rows == 1) {
         html = '<center>Votre réponse : <input type="text" id="input_answer" style="text-align:center"/><div id="error"></div></center>';
      } else {
         html = '<center><textarea id="input_answer" rows="'+num_rows+'" cols="80" style="text-align:center"></textarea><div id="error"></div></center>';
      }
      $(this.answersSelector).html(html);
      $('#input_answer').on('keyup', stdAnsTypes.checkType);
   },
   
   showAnswerSelected: function(answer) {
      stdAnsTypes.highlightAnswer(answer);
      $('#input').val(answer);
      if (answer === '') {
         $('#divCancelAnswer').hide();
      } else {
         $('#divCancelAnswer').show();
         if (stdAnsTypes.isPreviewMode()) {
            // TODO : should be done by load if mode == 'solution'
            stdAnsTypes.loadSolutionChoices();
         }
      }
   },
   
   loadSolutionChoices: function() {
      for (var iChoice = 0; iChoice < 10; iChoice++) {
         $('.choice_' + (iChoice + 1))
             .html($('#answerButton_' + (iChoice + 1) + ' input').val());
      }
   },
   
   selectAnswer: function(answer) {
      var prevAnswer = stdAnsTypes.currentAnswer;
      stdAnsTypes.currentAnswer = answer;
      stdAnsTypes.showAnswerSelected(answer);
      if (prevAnswer === '') {
         platform.validate('next', function() {});
      } else {
         platform.validate('stay', function() {});
      }
      task.getHeight(this.updateHeight);
   },
   
   cancelAnswer: function() {
      stdAnsTypes.selectAnswer('');
   },
   
   isPreviewMode: function() {
      try {
         return (typeof getTaskResources !== 'undefined' && !parent.generating);
      } catch (err) {
         return true;
      }
   },
   
   getShuffledChoicesOrder: function(nbChoices, preventShuffle) {
      var orderKey = parseInt(stdAnsTypes.randomSeed);
      return stdAnsTypes.getShuffledOrder(nbChoices, orderKey, preventShuffle);
   },
   
   // a few helper functions
   
   isInteger: function (value) {
      var intRegex = /^\d+$/;
      return (intRegex.test(value));
   },
   
   isPositiveInteger: function(value) {
      return (stdAnsTypes.isInteger(value) && parseInt(value) > 0);
   },

   /*
    * Returns an array with numbers 0 to nbValues -1.
    * Unless preventShuffle is true, the order is "random", but
    * is fully determined by the value of the integer ordeKey
   */
   getShuffledOrder: function (nbValues, orderKey, preventShuffle) {
      var order = [];
      for (var iValue = 0; iValue < nbValues; iValue++) {
         order.push(iValue);
      }
      if (preventShuffle) {
         return order;
      }
      for (iValue = 0; iValue < nbValues; iValue++) {
         var pos = iValue + (orderKey % (nbValues - iValue));
         var tmp = order[iValue];
         order[iValue] = order[pos];
         order[pos] = tmp;
      }
      return order;
   }
};
