(function() {
'use strict';

/* 
 * Implementation of a small platform for standalone tasks, mostly for
 * development, demo and testing purposes.
 *
 * Requirements:
 *   - jQuery
 *   - a Platform class creating a simple platform (present in the standard
 *     implementation of the integration API
 *   - task.getMetaData(), as documented in the PEM
 */

function inIframe () {
   try {
      return window.self !== window.top;
   } catch (e) {
      return false;
   }
}

var taskMetaData;

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
   var minScore = -3;
   if (taskMetaData.fullFeedback) {
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
   // acceptedAnswers is not documented, but necessary for old Bebras tasks
   if (taskMetaData.acceptedAnswers && taskMetaData.acceptedAnswers[0]) {
      if ($.inArray("" + answer, taskMetaData.acceptedAnswers) > -1) {
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

var miniPlatformValidate = function(mode, success, error) {
   $.post('updateTestToken.php', {action: 'showSolution'}, function(){}, 'json');
   if (mode == 'stay') {
      if (alreadyStayed) {
         platform.trigger('validate', [mode]);
         success();
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
   success();
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
   console.error('document ready');
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
         platform.updateHeight = function(height,success,error) {success();};
         var taskOptions = {};
         try {
            var strOptions = getUrlParameter("options");
            if (strOptions !== undefined) {
               taskOptions = $.parseJSON(strOptions);
            }
         } catch(exception) {
            alert("Error: invalid options");
         }
         var minScore = -3;
         if (taskMetaData.fullFeedback) {
            minScore = 0;
         }
         platform.getTaskParams = function(key, defaultValue, success, error) {
            var res = {'minScore': minScore, 'maxScore': 6, 'noScore': 0, 'readOnly': false, 'randomSeed': 0, 'options': taskOptions};
            if (typeof key !== 'undefined') {
               if (key !== 'options' && key in res) {
                  res = res[key];
               } else if (res.options && key in res.options) {
                  res = res.options[key];
               } else {
                  res = (typeof defaultValue !== 'undefined') ? defaultValue : null; 
               }
            }
            success(res);
         };
         platform.askHint = function(hintToken, success, error) {
            console.error('askHint miniplatform');
            $.post('updateTestToken.php', JSON.stringify({action: 'askHint'}), function(postRes){
               console.error(postRes);
               success();
            }, 'json');
         };
         var loadedViews = {'task': true, 'solution': true, 'hints': true, 'editor': true, 'grader': true, 'metadata': true, 'submission': true};
         var shownViews = {'task': true};

         // TODO: modifs ARTHUR à relire
         if (taskOptions.showSolutionOnLoad) {
            shownViews.solution = true;
         }
         if (!taskOptions.hideTitle) {
            $("#task h1").show();
         }

         if (taskMetaData.fullFeedback) {
            loadedViews.grader = true;
         }
         var showViewsHandlerFactory = function (view) {
            return function() {
               var tmp = {};
               tmp[view] = true;
               task.showViews(tmp, function(){});
               $('.choose-view-button').removeClass('btn-info');
               $('#choose-view-'+view).addClass('btn-info');
            };
         };
         var frenchName = {
            'task': 'Exercice',
            'submission': 'Soumission',
            'solution': 'Solution',
            'editor': 'Résoudre',
            'hints': 'Conseils'
         };
         task.load(loadedViews, function() {
            platform.trigger('load', [loadedViews]);
            task.getViews(function(views){
               if (! $("#choose-view").length)
                  $(document.body).prepend('<div id="choose-view"></div>');
               $("#choose-view").html("");
               for (var viewName in views)
               {
                  if (!views[viewName].requires) {
                     console.error(viewName);
                     $("#choose-view").append($('<button id="choose-view-'+viewName+'" class="btn btn-default choose-view-button">' + frenchName[viewName] + '</button>').click(showViewsHandlerFactory(viewName)));
                  }
               }
            });
            task.showViews(shownViews, function() {
               $('.choose-view-button').removeClass('btn-info');
               $.each(shownViews, function(viewName) {
                  $('#choose-view-'+viewName).addClass('btn-info');
               });
               platform.trigger('showViews', [{"task": true}]);
            });
         });
      };
      var getMetaDataAndLoad = function() {
         task.getMetaData(function(metaData) {
            taskMetaData = metaData;
            platformLoad();
         });
      }
      var oldInit = platform.initWithTask;
      platform.initWithTask = function(task) {
         oldInit(task);
         getMetaDataAndLoad();
      };
   }
});

})();
