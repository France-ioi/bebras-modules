"use strict";

/* 
 * Implementation of a small platform for standalone tasks, mostly for
 * development, demo and testing purposes.
 *
 * Requirements:
 *   - jQuery
 *   - a Platform class creating a simple platform (present in the standard
 *     implementation of the integration API
 *   - getTaskResources(), as documented in the task installation API
 */

function inIframe () {
   try {
      return window.self !== window.top;
   } catch (e) {
      return false;
   }
}

// important for tracker.js
var compiledTask = true;

var miniPlatformShowSolution = function() {
   $("#toremove").hide();
   task.getAnswer(function(answer) {
      task.showViews({"task": true, "solution": true}, function() {
         miniPlatformPreviewGrade(answer);
         platform.trigger('showViews', [{"task": true, "solution": true}]);
      });
   });
};

var miniPlatformPreviewGrade = function(answer) {
   var json = getTaskResources();
   var minScore = -3;
   if (json.fullFeedback) {
      minScore = 0;
   }
   var maxScore = 6;
   var score;
   var showGrade = function(score) {
      if ($("#previewScorePopup").length === 0) {
         $("<div id='previewScorePopup'><div style=\"background-color:#111;opacity: 0.65;filter:alpha(opacity=65);position:absolute;z-index:10;top:0px;left:0px;width:100%;height:2000px\"></div>" +
            "<div style='position:fixed;top:100px;left:100px;width:400px;height:200px;background-color:#E0E0FF;color:black;border: solid black 3px;text-align:center;z-index:1000'>" +
            "<div style='padding:50px'><span id='previewScoreMessage'></span><br/><br/><input type='button' onclick='$(\"#previewScorePopup\").remove()' value='OK' /></div></div></div>").insertBefore("#solution");
      }
      $("#previewScorePopup").show();
      $("#previewScoreMessage").html("<b>Votre score : " + score + "/" + maxScore + "</b><br/>Vous pouvez maintenant lire la solution en bas de la page.");
   };
   if (json.acceptedAnswers && json.acceptedAnswers[0]) {
      if ($.inArray("" + answer, json.acceptedAnswers) > -1) {
         score = maxScore;
      }
      else {
         score = minScore;
      }
      showGrade(score);
   } else {
      score = grader.gradeTask(answer, null, showGrade);
   }
};

var alreadyStayed = false;

var miniPlatformValidate = function(mode) {
   if (mode == 'stay') {
      if (alreadyStayed) {
         platform.trigger('validate', [mode]);
         return true;
      } else {
         alreadyStayed = true;
      }
   }
   $("#toremove").remove();
   if (mode == 'cancel') {
      alreadyStayed = false;
   } else {
      $("#task").append("<center id='toremove'><br/><input type='button' value='Voir la solution' onclick='miniPlatformShowSolution()'></input></center>");
   }
   platform.trigger('validate', [mode]);
};

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

$(document).ready(function() {
   var hasPlatform = false;
   try {
       hasPlatform = (inIframe() && (typeof parent.TaskProxyManager !== 'undefined') && (typeof parent.generating == 'undefined' || parent.generating === true));
   } catch(ex) {
       // iframe from files:// url are considered cross-domain by Chrome
       if(location.protocol !== 'file:') {
         hasPlatform = true;
       }
   }
   if (!hasPlatform) {
      var platformLoad = function() {
         platform.validate = miniPlatformValidate;
         platform.updateHeight = function(height) {};
         var taskOptions = {};
         try {
            var strOptions = getUrlParameter("options");
            if (strOptions !== undefined) {
               taskOptions = $.parseJSON(strOptions);
            }
         } catch(exception) {
            alert("Error: invalid options");
         }
         var json = getTaskResources();
         var minScore = -3;
         if (json.fullFeedback) {
            minScore = 0;
         }
         platform.getTaskParams = function(key, defaultValue) {
            var res = {'minScore': minScore, 'maxScore': 6, 'noScore': 0, 'readOnly': false, 'randomSeed': 0, 'options': taskOptions};
            if (typeof key !== 'undefined') {
               if (key !== 'options' && key in res) {
                  return res[key];
               }
               if (res.options && key in res.options) {
                  return res.options[key];
               }
               return (typeof defaultValue !== 'undefined') ? defaultValue : null; 
            }
            return res;
         };
         platform.getTaskOption = function(optionName, defaultValue) {
            if ((taskOptions === null) || (taskOptions[optionName] === undefined)) {
               return defaultValue;
            }
            return taskOptions[optionName];
         };
         var loadedViews = {'task': true, 'solution': true};
         var shownViews = {'task': true};

         // TODO: modifs ARTHUR à relire
         if (taskOptions.showSolutionOnLoad == true) {
            shownViews.solution = true;
         }
         if (!taskOptions.hideTitle) {
            $("#task h1").show();
         }

         if (json.fullFeedback) {
            loadedViews.grader = true;
         }
         task.load(loadedViews, function() {
            platform.trigger('load', [loadedViews]);
            task.showViews(shownViews, function() {
               platform.trigger('showViews', [{"task": true}]);
            });
         });
      };
      setTimeout(platformLoad, 0);
   }
});
