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

    // demo platform key
    var demo_key = 'buddy'


   var languageStrings = {
      fr: {
         'task': 'Exercice',
         'submission': 'Soumission',
         'solution': 'Solution',
         'editor': 'Résoudre',
         'hints': 'Conseils',
         'showSolution': 'Voir la solution',
         'yourScore': "Votre score :",
         'canReadSolution': "Vous pouvez maintenant lire la solution en bas de la page.",
         'gradeAnswer': "Tester le grader"
      },
      en: {
         'task': 'Task',
         'submission': 'Submission',
         'solution': 'Solution',
         'editor': 'Edit',
         'hints': 'Hints',
         'showSolution': 'Show solution',
         'yourScore': "Your score:",
         'canReadSolution': "You can now read the solution at the bottom of this page.",
         'gradeAnswer': 'Test grader'
      },
      fi: {
         'task': 'Task',
         'submission': 'Submission',
         'solution': 'Solution',
         'editor': 'Edit',
         'hints': 'Hints',
         'showSolution': 'Show solution',
         'yourScore': "Your score:",
         'canReadSolution': "You can now read the solution at the bottom of this page.",
         'gradeAnswer': 'Test grader'
      },
      sv: {
         'task': 'Task',
         'submission': 'Submission',
         'solution': 'Solution',
         'editor': 'Edit',
         'hints': 'Hints',
         'showSolution': 'Show solution',
         'yourScore': "Your score:",
         'canReadSolution': "You can now read the solution at the bottom of this page.",
         'gradeAnswer': 'Test grader'
      },
      de: {
         'task': 'Aufgabe',
         'submission': 'Abgabe',
         'solution': 'Lösung',
         'editor': 'Bearbeiten',
         'hints': 'Hinweise',
         'showSolution': 'Lösung anzeigen',
         'yourScore': "Dein Punktestand:",
         'canReadSolution': "Du kannst dir jetzt die Lösung unten auf der Seite anschauen.",
         'gradeAnswer': 'Test grader'
      },
      es: {
         'task': 'Problema',
         'submission': 'Sumisión',
         'solution': 'Solución',
         'editor': 'Editar',
         'hints': 'Pistas',
         'showSolution': 'Mostrar solución',
         'yourScore': 'Su puntuación:',
         'canReadSolution': 'Puede leer la solución al final de esta página.',
         'gradeAnswer': 'Test grader'
      }
   };

   /*
   * Create custom elements for platformless implementation
   */
   var miniPlatformWrapping = {
      beaver: {
         'header' : '\
            <div style="width:100%; border-bottom:1px solid #B47238;overflow:hidden">\
               <table style="width:100%;margin: 10px auto;">\
                  <td><img src="../../modules/img/castor.png" width="60px" style="display:inline-block;margin-right:20px;vertical-align:middle"/></td>\
                  <td><span style="font-size:32px;">Concours castor</span></td>\
                  <td><a href="http://concours.castor-informatique.fr/" style="display:inline-block;text-align:right;">Le concours Castor</a></td>\
               </table>\
            </div>'
      },
      laptop: {
         'header' : '\
            <div style="width:100%; border-bottom:1px solid #B47238;overflow:hidden">\
               <table style="width:770px;margin: 10px auto;">\
                  <td><img src="../../modules/img/laptop.png" width="60px" style="display:inline-block;margin-right:20px;vertical-align:middle"/></td>\
                  <td><span style="font-size:32px;">Concours Alkindi</span></td>\
                  <td><a href="http://concours-alkindi.fr/home.html#/" style="display:inline-block;text-align:right;">Le concours Alkindi</a></td>\
               </table>\
            </div>'
      }
   };

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return false;
        }
    }



    if(typeof window.signJWT == 'undefined') {
        window.signJWT = function(data, key) {
            return null
        }
    }

    function TaskToken(data, key) {

        this.data = data
        this.data.hints_requested = []
        this.key = key

        this.addHintRequest = function(hint_params, callback) {
            var jh = JSON.stringify(hint_params)
            var exists = this.data.hints_requested.find(function(h) {
                return JSON.stringify(h) === jh
            })
            if(!exists) {
                this.data.hints_requested.push(hint_params)
            }
            this.get(callback)
        },

        this.get = function(callback) {
            var res = signJWT(this.data, this.key)
            // imitate async req
            setTimeout(function() {
                callback(res)
            }, 100)
        }
    }


    function AnswerToken(key) {
        this.key = key
        this.get = function(answer, callback) {
            var res = signJWT(answer, this.key)
            // imitate async req
            setTimeout(function() {
                callback(res)
            }, 100)
        }
    }



var taskMetaData;

// important for tracker.js
var compiledTask = true;

window.miniPlatformShowSolution = function() {
   $("#showSolutionButton").hide();
   task.getAnswer(function(answer) {
      task.showViews({"task": true, "solution": true}, function() {
         // For tasks with no feedback / older tasks
         // miniPlatformPreviewGrade(answer);
         platform.trigger('showViews', [{"task": true, "solution": true}]);
      });
   });
}

function miniPlatformPreviewGrade(answer) {
   var minScore = -3;
   if (taskMetaData.fullFeedback) {
      minScore = 0;
   }
   var maxScore = 40;
   var score;
   var showGrade = function(score) {
      if ($("#previewScorePopup").length === 0) {
         $("<div id='previewScorePopup'><div style=\"background-color:#111;opacity: 0.65;filter:alpha(opacity=65);position:absolute;z-index:10;top:0px;left:0px;width:100%;height:2000px\"></div>" +
            "<div style='position:fixed;top:100px;left:100px;width:400px;height:200px;background-color:#E0E0FF;color:black;border: solid black 3px;text-align:center;z-index:1000'>" +
            "<div style='padding:50px'><span id='previewScoreMessage'></span><br/><br/><input type='button' onclick='$(\"#previewScorePopup\").remove()' value='OK' /></div></div></div>").insertBefore("#solution");
      }
      $("#previewScorePopup").show();
      $("#previewScoreMessage").html("<b>" + languageStrings[window.stringsLanguage].showSolution + " " + score + "/" + maxScore + "</b><br/>" + languageStrings[window.stringsLanguage].showSolution);
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
}

var alreadyStayed = false;

var miniPlatformValidate = function(mode, success, error) {
   //$.post('updateTestToken.php', {action: 'showSolution'}, function(){}, 'json');
   if (mode == 'nextImmediate') {
      return;
   }
   if (mode == 'stay') {
      if (alreadyStayed) {
         platform.trigger('validate', [mode]);
         if (success) {
            success();
         }
      } else {
         alreadyStayed = true;
      }
   }
   if (mode == 'cancel') {
      alreadyStayed = false;
   }
   platform.trigger('validate', [mode]);
   if (success) {
      success();
   }
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

function getHashParameter(sParam)
{
    var sPageURL = window.location.hash.substring(1);
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

var chooseView = (function () {
   // Manages the buttons to choose the view
   return {
      doubleEnabled: false,
      isDouble: false,
      lastShownViews: {},

      init: function(views) {
         if (! $("#choose-view").length)
            $(document.body).append('<div id="choose-view" style="margin-top:6em"></div>');
         $("#choose-view").html("");
         // Display buttons to select task view or solution view
         /*
         for(var viewName in views) {
            if (!views[viewName].requires) {
               var btn = $('<button id="choose-view-'+viewName+'" class="btn btn-default choose-view-button">' + languageStrings[window.stringsLanguage][viewName] + '</button>')
               $("#choose-view").append(btn);
               btn.click(this.selectFactory(viewName));
            }
         }
         */
         $("#grade").remove();
         var btnGradeAnswer = $('<center id="grade"><button class="btn btn-default">' + languageStrings[window.stringsLanguage].gradeAnswer + '</button></center>');
         // display grader button only if dev mode by adding URL hash 'dev'
         if (getHashParameter('dev')) {
            $(document.body).append(btnGradeAnswer);
         }
         btnGradeAnswer.click(function() {
            task.getAnswer(function(answer) {
                answer_token.get(answer, function(answer_token) {
                    task.gradeAnswer(answer, answer_token, function(score, message, scoreToken) {
                        alert("Score : " + score + ", message : " + message);
                    });
                })
            }, function() {
               alert("error");
            });
         })
      },

      reinit: function(views) {
         this.init(views);
         var newShownViews = {};
         for(var viewName in this.lastShownViews) {
            if(!this.lastShownViews[viewName]) { continue; }
            if(views[viewName] && !views[viewName].requires) {
               newShownViews[viewName] = true;
            }
         }
         for(var viewName in views) {
            if(views[viewName].includes) {
               for(var i=0; i<views[viewName].includes.length; i++) {
                  if(this.lastShownViews[views[viewName].includes[i]]) {
                     newShownViews[viewName] = true;
                  }
               }
            }
         }
         this.update(newShownViews);
      },

      selectFactory: function(viewName) {
         var that = this;
         return function () {
            that.select(viewName);
         };
      },

      select: function(viewName) {
         var that = this;
         var shownViews = {};
         shownViews[viewName] = true;
         task.showViews(shownViews, function () {
            that.update(shownViews);
         });
      },

      update: function(shownViews) {
         this.lastShownViews = shownViews;
         $('.choose-view-button').removeClass('btn-info');
         for(var viewName in shownViews) {
            if(shownViews[viewName]) {
               $('#choose-view-'+viewName).addClass('btn-info');
            }
         };
      }
   };
})();





$(document).ready(function() {
   var hasPlatform = false;
   try {
       hasPlatform = (inIframe() && (typeof parent.TaskProxyManager !== 'undefined') && (typeof parent.generating == 'undefined' || parent.generating === true));
       var testEdge = parent.TaskProxyManager; // generates an exception on edge when in a platform (parent not available)
   } catch(ex) {
       // iframe from files:// url are considered cross-domain by Chrome
       if(location.protocol !== 'file:') {
         hasPlatform = true;
       }
   }
   if (!hasPlatform) {
      var platformLoad = function(task) {
         window.task_token = new TaskToken({
            id: taskMetaData.id,
            random_seed: Math.floor(Math.random() * 10)
         }, demo_key)
         window.answer_token = new AnswerToken(demo_key)

         platform.validate = miniPlatformValidate;
         platform.updateHeight = function(height,success,error) {if (success) {success();}};
         platform.updateDisplay = function(data,success,error) {
            if(data.views) {
               chooseView.reinit(data.views);
            }
            if (success) {success();}
         };
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
            var res = {'minScore': minScore, 'maxScore': 40, 'noScore': 0, 'readOnly': false, 'randomSeed': "0", 'options': taskOptions};
            if (key) {
               if (key !== 'options' && key in res) {
                  res = res[key];
               } else if (res.options && key in res.options) {
                  res = res.options[key];
               } else {
                  res = (typeof defaultValue !== 'undefined') ? defaultValue : null;
               }
            }
            if (success) {
               success(res);
            } else {
               return res;
            }
         };
         platform.askHint = function(hint_params, success, error) {
            success()
             /*
            $.post('updateTestToken.php', JSON.stringify({action: 'askHint'}), function(postRes){
               if (success) {success();}
            }, 'json');
            */
            task_token.addHintRequest(hint_params, function(token) {
                task.updateToken(token, function() {})
            })
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

         task.load(
             loadedViews,
             function() {
                platform.trigger('load', [loadedViews]);
                task.getViews(function(views) {
                    chooseView.init(views);
                });
                task.showViews(shownViews, function() {
                    chooseView.update(shownViews);
                    platform.trigger('showViews', [{"task": true}]);
                });
                if ($("#solution").length) {
                  $("#task").append("<center id='showSolutionButton'><button type='button' class='btn btn-default' onclick='miniPlatformShowSolution()'>" + languageStrings[window.stringsLanguage].showSolution + "</button></center>");
                }

                // add branded header to platformless task depending on avatarType
                // defaults to beaver platform branding
                if (miniPlatformWrapping[displayHelper.avatarType].header) {
                  $('body').prepend(miniPlatformWrapping[displayHelper.avatarType].header);
                } else {
                  $('body').prepend(miniPlatformWrapping[beaver].header);
                }
             },
             function(error) {
                 console.error(error)
             }
        );


        task_token.get(function(token) {
            task.updateToken(token, function() {})
        })


         /* For the 'resize' event listener below, we use a cross-browser
          * compatible version for "addEventListener" (modern) and "attachEvent" (old).
          * Source: https://stackoverflow.com/questions/6927637/addeventlistener-in-internet-explorer
          */
         function addEvent(evnt, elem, func) {
            if (elem.addEventListener)  // W3C DOM
               elem.addEventListener(evnt,func,false);
            else if (elem.attachEvent) { // IE DOM
               elem.attachEvent("on"+evnt, func);
            }
            else { // No much to do
               elem[evnt] = func;
            }
         }

         addEvent('resize', window, function() {
            task.getViews(function(views) {
               chooseView.reinit(views);
            });
         });
      };
      var getMetaDataAndLoad = function(task) {
         task.getMetaData(function(metaData) {
            taskMetaData = metaData;
            platformLoad(task);
         });
      };
      if (window.platform.task || platform.initFailed) {
         // case everything went fine with task loading, or task loading failed
         // (due to missing jschannel and file:// protocol...
         getMetaDataAndLoad(window.task ? window.task : window.platform.task);
      } else {
         // task is not loaded yet
         var oldInit = platform.initWithTask;
         platform.initWithTask = function(task) {
            oldInit(task);
            getMetaDataAndLoad(task);
         };
      }
   }
});

})();
