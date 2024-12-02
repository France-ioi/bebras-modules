(function () {

'use strict';

function getUrlParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.href);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isCrossDomain() {
   function isInIframe() {
      try {
         return window.self !== window.top;
      } catch (e) {
         return false;
      }
   }
   function isSameDomain() {
      var res = false;
      function doNothing(document){}
      try{
          res = !! parent.document;
      } catch(e){
          res = false;
      }
      return res;
   }
   return isInIframe() && !isSameDomain();
}

var platform;

if (!isCrossDomain()) {

   /* Implementation of a platform proxy for the task iframe. This object is always
    * available, but is effective only when setPlatform is called with a true
    * platform object.
    */

   platform = {
      registered_objects: [],
      parent_platform: null,
      initFailed: false,
      setPlatform: function(platformArg) {
         platform.parent_platform = platformArg;
      },
      trigger: function(event, content) {
         for (var i = 0; i < platform.registered_objects.length; i++) {
            var object = platform.registered_objects[i];
            if (typeof (object[event]) != "undefined") {
               object[event].apply(object, content);
            }
         }
      },
      subscribe: function(object) {
         this.registered_objects.push(object);
      },
      unsubscribe: function(object) {
         var index = this.registered_objects.indexOf(object);
         if (index != -1) {
            this.registered_objects.splice(index, 1);
         }
      },
      validate: function(mode, success, error) {
         // TODO: this case is a bit blur...
         var res = platform.parent_platform.validate(mode, success, error);
         this.trigger('validate', [mode]);
         return res;
      },
      showView: function(views, success, error) {
         return platform.parent_platform.showView(views, success, error);
      },
      askHint: function(platformToken, success, error) {
         return platform.parent_platform.askHint(platformToken, success, error);
      },
      updateHeight: function(height, success, error) {
         return platform.parent_platform.updateDisplay({height: height}, success, error);
      },
      updateDisplay: function(data, success, error) {
         return platform.parent_platform.updateDisplay(data, success, error);
      },
      getTaskParams: function(key, defaultValue, success, error) {
         return platform.parent_platform.getTaskParams(key, defaultValue, success, error);
      },
      openUrl: function(url, success, error) {
         return platform.parent_platform.openUrl(url, success, error);
      },
      initCallback: function(callback) {
         this.initCallbackFun = callback;
         if (platform.initDone) {
            callback();
         }
      },
      initWithTask: function(task) {
         platform.task = task;
         window.task = task;
         platform.initDone = true;
         if (platform.initCallbackFun) {
            platform.initCallbackFun();
         }
      }
   };

} else {

   // cross-domain version, depends on jschannel
   platform = {};
   var callAndTrigger = function(fun, triggerName, error, args) {
      return function() {
         try {
            platform.trigger(triggerName, args);
            fun(arguments);
         } catch(e) {
            error(e.toString()+'\n'+e.stack);
         }
      };
   };
   platform.ready = false;
   platform.initFailed = false;
   platform.initWithTask = function(task) {
      if (typeof Channel === 'undefined') {
         platform.initFailed = true;
         console.error('cannot init task if jschannel is not present');
         return;
      }

      var previousHeights = [];
      var getHeightFiltered = function(success, error) {
         // If the new height has already been returned just before the current
         // height, we're in a loop between two heights, possibly because of a
         // scrollbar.
         // In that case we want to keep the largest of the two heights.
         if(!task.getHeight) { error('task.getHeight not defined yet'); }
         task.getHeight(function(h) {
            if((previousHeights.length == 2) &&
               (previousHeights[0] == h) &&
               (previousHeights[1] >= h)) {
                  success(previousHeights[1]);
                  return;
            }
            previousHeights.push(h);
            previousHeights = previousHeights.slice(-2);
            success(h);
         }, error);
      }

      var gradeAnswer = function(params, success, error) {
         var newSuccess = function(score, message, scoreToken) {
            success([score, message, scoreToken]);
         };
         if (typeof task.gradeAnswer === 'function') {
            task.gradeAnswer(params[0], params[1], newSuccess, error);
         } else {
            window.grader.gradeTask(params[0], params[1], newSuccess, error);
         }
      };
      var channelId = getUrlParameterByName('channelId');
      var chan = Channel.build({window: window.parent, origin: "*", scope: channelId, onReady: function() {platform.ready = true;}});
      platform.chan = chan;
      platform.task = task;
      platform.channelId = channelId;
      chan.bind('task.load', function(trans, views) {task.load(views, callAndTrigger(trans.complete, 'load', trans.error, [views]), trans.error);trans.delayReturn(true);});
      chan.bind('task.unload', function(trans) {task.unload(callAndTrigger(trans.complete, 'unload', trans.error, null), trans.error);trans.delayReturn(true);});
      chan.bind('task.getHeight', function(trans) {getHeightFiltered(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getMetaData', function(trans) {task.getMetaData(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getViews', function(trans) {task.getViews(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.showViews', function(trans, views) {task.showViews(views, callAndTrigger(trans.complete, 'showViews', trans.error, [views]), trans.error);trans.delayReturn(true);});
      chan.bind('task.updateToken', function(trans, token) {task.updateToken(token, trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.reloadAnswer', function(trans, answer) {task.reloadAnswer(answer, callAndTrigger(trans.complete, 'reloadAnswer', trans.error, [answer]), trans.error);trans.delayReturn(true);});
      chan.bind('task.getAnswer', function(trans) {task.getAnswer(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getState', function(trans) {task.getState(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getResources', function(trans) {task.getResources(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.reloadState', function(trans, state) {task.reloadState(state, callAndTrigger(trans.complete, 'reloadState', trans.error, [state]), trans.error);trans.delayReturn(true);});
      chan.bind('grader.gradeTask', function(trans, params) {gradeAnswer(params, trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.gradeAnswer', function(trans, params) {gradeAnswer(params, trans.complete, trans.error);trans.delayReturn(true);});
   };

   platform.registered_objects = [];
   platform.trigger = function(event, content) {
      for (var i = 0; i < platform.registered_objects.length; i++) {
         var object = platform.registered_objects[i];
         if (typeof object[event] !== "undefined") {
            object[event].apply(object, content);
         }
      }
   };
   platform.subscribe = function(object) {
      platform.registered_objects.push(object);
   };
   platform.unsubscribe = function(object) {
      var index = platform.registered_objects.indexOf(object);
      if (index != -1) {
         platform.registered_objects.splice(index, 1);
      }
   };
   platform.stop = function() {
      platform.chan.destroy(); 
   };
   platform.validate = function (sMode, success, error) {
      if (!success) success = function(){}; // not mandatory, as most code doesn't use it
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.validate",
         params: sMode,
         error: error,
         success: callAndTrigger(success, 'validate', error, [sMode])
      });
   };
   platform.getTaskParams = function(key, defaultValue, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.getTaskParams",
         params: [key, defaultValue],
         error: error,
         success: success
      });
   };
   platform.showView = function(views, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.showView",
         params: views,
         error: error,
         success: success
      });
   };
   platform.askHint = function(platformToken, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.askHint",
         params: platformToken,
         error: error,
         success: success
      });
   };
   platform.updateHeight = function(height, success, error) {
      // Legacy
      platform.updateDisplay({height: height}, success, error);
   };
   platform.updateDisplay = function(data, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.updateDisplay",
         params: data,
         error: error,
         success: success
      });
   };
   platform.openUrl = function(url, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.openUrl",
         params: url,
         error: error,
         success: success
      });
   };
}

window.platform = platform;

}());

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
   confirmRestartAll: true,
   showScore: false,
   refreshMessages: true,
   stoppedShowingResult: false,
   previousMessages: {},
   popupMessageShown: false,

   thresholds: {},
   // Legacy settings for old tasks ; new ones are expected to use thresholds
   thresholdEasy: 60,
   thresholdMedium: 120,

   timeoutMinutes: 5,
   avatarType: "beaver",
   bUseFullWidth: false,

   hasLevels: false,
   pointsAsStars: true, // TODO: false as default
   unlockedLevels: 4,
   neverHadHard: false,
   showMultiversionNotice: false,
   taskLevel: '',

   // Defaults
   levels: ['easy', 'medium', 'hard'],
   levelsIdx: { easy: 0, medium: 1, hard: 2 },
   maxStars: 4,
   popupMessageHandler: null,

   formatTranslation: function(s, args) { return s.replace(/\{([^}]+)\}/g, function(_, match){ return args[match]; }); },

   languageStrings: {
      fr: {
         version: "Version",
         levelVersionName_easy: "version facile",
         levelVersionName_medium: "version moyenne",
         levelVersionName_hard: "version difficile",
         levelVersionName_easy_stars: "version à 2 étoiles",
         levelVersionName_medium_stars: "version à 3 étoiles",
         levelVersionName_hard_stars: "version à 4 étoiles",
         levelName_easy: "Facile",
         levelName_medium: "Moyen",
         levelName_hard: "Difficile",
         warningTimeout: "<p>Attention, cela fait plus de {0} minutes que vous êtes sur cette question.</p><p>Vous devriez sans doute changer de sujet, en cliquant sur le bouton tout en haut à droite.</p>",
         alright: "D'accord",
         moveOn: "Passer à la suite",
         solvedMoveOn: "Vous avez entièrement résolu cette question, passez à une autre question.",
         confirmRestart: "Êtes-vous certain de vouloir recommencer cette version ?",
         yes: "Oui",
         no: "Non",
         tryHardLevel: "Nous vous proposons d'essayer la version 4 étoiles.",
         tryMediumLevel: "Nous vous proposons d'essayer la version 3 étoiles.",
         tryNextTask: "Nous vous proposons de passer au sujet suivant. S'il vous reste du temps, vous reviendrez plus tard essayer la version suivante.",
         yourScoreIsNow: "Votre score est maintenant :",
         worseScoreStays: "C'est moins bien qu'avant ; votre score reste :",
         scoreStays: "Votre score reste le même :",
         score: "Score :",
         noPointsForLevel: "Vous n'avez pas encore de points sur cette version.",
         outOf: " sur ",
         tryToDoBetterOrChangeTask: "Essayez de faire encore mieux, ou passez à une autre question.",
         tryToDoBetterOrMoveToNextLevel: "Essayez de faire encore mieux, ou passez à une version plus difficile.",
         bestPossibleScoreCongrats: "C'est le meilleur score possible sur ce sujet ; félicitations !",
         forMorePointsMoveToNextLevel: "Pour obtenir plus de points, passez à une version plus difficile.",
         youDidBetterBefore: "Vous aviez fait mieux avant.",
         scoreStays2: "Votre score reste le même.",
         reloadBestAnswer: "Rechargez votre meilleure réponse.",
         noAnswerSaved: "Aucune réponse actuellement enregistrée pour cette version.",
         validate: "Valider",
         restart: "Recommencer",
         harderLevelSolved: "Attention : vous avez déjà résolu une version plus difficile. Vous ne pourrez pas gagner de points supplémentaires avec cette version.",
         showLevelAnyway: "Voir quand même",
         scoreObtained: "Score obtenu :",
         hardVersionTakesTime: "Résoudre une {0} peut vous prendre beaucoup de temps ; songez en priorité à répondre aux questions en {1} pour gagner des points rapidement.",
         illKeepThatInMind: "J'y prendrai garde",
         harderLevelAvailable: "Notez que pour cette question, vous pouvez résoudre directement une version plus difficile que celle-ci.",
         lockedLevel: "Cette version est verrouillée. Résolvez la précédente pour l'afficher !",
         gradeThisAnswer: "Évaluer cette réponse",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Enregistrer votre réponse",
         answerSavedModifyOrCancelIt: "Votre réponse a été enregistrée. Vous pouvez la modifier, ou bien {0} et recommencer.",
         cancelIt: "l'annuler",
         warningDifferentAnswerSaved: "Attention : une réponse différente est enregistrée.",
         youMay: "Vous pouvez {0}.",
         reloadIt: "la recharger",
         saveThisNewAnswer: "Enregistrer cette nouvelle réponse",

         gradingInProgress: "Évaluation en cours",
         scoreIs: "Votre score est de :",
         point: "point",
         points: "points",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Le concours étant terminé, votre réponse n'est pas enregistrée et votre score reste de :",
         scoreWouldBecome: "Avec cette réponse, votre score serait :",
         reloadValidAnswer: "Rechargez la réponse validée.",
         contestOverAnswerNotSaved: "Le concours est terminé : votre réponse n'est pas enregistrée.",
         scoreWouldStay: "Avec cette réponse, votre score resterait le même :",
         answerNotSavedContestOver: "Le concours étant terminé, votre réponse n'a pas été enregistrée. Vous pouvez {0}.",
         reloadSubmittedAnswer: "recharger la réponse que vous avez soumise",
         difficultyWarning: "<strong>Attention :</strong> résoudre cette version prend du temps.<br/>Vous pourrez résoudre bien plus rapidement les versions 2 et 3 étoiles d'autres sujets.",
         enemyWarning: "<strong>Attention :</strong> dans ce défi, l'ordinateur vous empêchera de trouver la solution par hasard."
      },
      en: {
         version: "Version",
         levelVersionName_easy: "easy version",
         levelVersionName_medium: "medium version",
         levelVersionName_hard: "hard version",
         levelVersionName_easy_stars: "2 stars version",
         levelVersionName_medium_stars: "3 stars version",
         levelVersionName_hard_stars: "4 stars version",
         levelName_easy: "Easy",
         levelName_medium: "Medium",
         levelName_hard: "Hard",
         warningTimeout: "<p>Warning, it has been more than {0} minutes since you started working on this task.</p><p>You should probably switch to a diffrent task, by clicking on the button on the top-right.</p>",
         alright: "Alright",
         moveOn: "Move on",
         solvedMoveOn: "You solved this task completely, move on to another task.",
         confirmRestart: "Are you sure you want to restart this version?",
         yes: "Yes",
         no: "No",
         tryHardLevel: "We suggest you try the 4 stars version.",
         tryMediumLevel: "We suggest you try the 3 stars version.",
         tryNextTask: "We suggest you try the next task. If you still have time, come back later and try the next version of this task.",
         yourScoreIsNow: "Your score is now:",
         worseScoreStays: "This is not as good as before. Your score stays:",
         scoreStays: "Your score stays the same:",
         score: "Score:",
         noPointsForLevel: "You have not received any points yet on this version.",
         outOf: " out of ",
         tryToDoBetterOrChangeTask: "Try to do even better, or move on to another task.",
         tryToDoBetterOrMoveToNextLevel: "Try to do even better, or move on to a more difficult version.",
         bestPossibleScoreCongrats: "This is the best possible score on this task, congratulations!",
         forMorePointsMoveToNextLevel: "To obtain more points, move on to a harder version of this task.",
         youDidBetterBefore: "You did better before.",
         scoreStays2: "Your score stays the same.",
         reloadBestAnswer: "Reload your best answer.",
         noAnswerSaved: "No answer saved so far for this version.",
         validate: "Validate",
         restart: "Restart",
         harderLevelSolved: "Warning: you already solved a harder version of this task. You won't be able to obtain extra points with this version.",
         showLevelAnyway: "Show it to me anyways.",
         scoreObtained: "Obtained score:",
         hardVersionTakesTime: "Solving a {0} can take a lot of time. Consider working on the {1} to gain points quickly.",
         illKeepThatInMind: "I'll consider it.",
         harderLevelAvailable: "Note that for this task, you may try to directly work on a harder version than this one.",
         lockedLevel: "This version is locked. Solve the previous version to display it!",
         gradeThisAnswer: "Grade this answer",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Save this answer",
         answerSavedModifyOrCancelIt: "Your answer has been saved. You can modify it, or {0} and restart.",
         cancelIt: "cancel it",
         warningDifferentAnswerSaved: "Warning: a different answer was saved before.",
         youMay: "You may {0}.",
         reloadIt: "reload it",
         saveThisNewAnswer: "Save this new answer",

         gradingInProgress: "Grading in process",
         scoreIs: "Your score is:",
         point: "point",
         points: "points",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "The contest being over, your new answer was not saved and your score stays:",
         scoreWouldBecome: "With this answer, your score would be:",
         reloadValidAnswer: "Reload the validated answer.",
         contestOverAnswerNotSaved: "The contest being over, your new answer was not saved.",
         scoreWouldStay: "With this answer, your score would stay the same:",
         answerNotSavedContestOver: "The contest being over, your answer was not saved. You may {0}.",
         reloadSubmittedAnswer: "reload the validated answer",
         difficultyWarning: "<strong>Warning:</strong> solving this version takes time.<br/>You would solve the 2 or 3 star versions of other tasks more quickly.",
         enemyWarning: "<strong>Warning:</strong> in this challenge, the computer will make sure you don't find the solution by chance."
      },
      sv: {
         version: "Version",
         levelVersionName_easy: "lätt version",
         levelVersionName_medium: "medelsvår version",
         levelVersionName_hard: "svår version",
         levelVersionName_easy_stars: "2-stjärnig version",
         levelVersionName_medium_stars: "3-stjärnig version",
         levelVersionName_hard_stars: "4-stjärnig version",
         levelName_easy: "Lätt",
         levelName_medium: "Medelsvår",
         levelName_hard: "Svår",
         warningTimeout: "<p>Varning: det har gått mer än {0} minuter sedan du började med den här uppgiften. </p><p>Du borde kanske byta till en annan uppgift, genom att klicka på knappen uppe till höger.</p>",
         alright: "Okej",
         moveOn: "Gå vidare",
         solvedMoveOn: "Du löste uppgiften helt! Gå nu vidare till en annan uppgift.",
         confirmRestart: "Är du säker på att du vill börja om med den här versionen?",
         yes: "Ja",
         no: "Nej",
         tryHardLevel: "Vi föreslår att du provar den 4-stjärniga versionen.",
         tryMediumLevel: "Vi föreslår att du provar den 3-stjärniga versionen.",
         tryNextTask: "Vi föreslår att du provar nästa uppgift. Kom tillbaka senare och prova en svårare version av den här uppgiften.",
         yourScoreIsNow: "Din poäng är nu:",
         worseScoreStays: "Det är inte lika bra som tidigare. Poängen fortfarande:",
         scoreStays: "Din poäng är fortfarande:",
         score: "Poäng:",
         noPointsForLevel: "Du har inte fått några poäng än på den här versionen.",
         outOf: " utav ",
         tryToDoBetterOrChangeTask: "Försök klara det ännu bättre, eller gå vidare till en annan uppgift.",
         tryToDoBetterOrMoveToNextLevel: "Försök klara det ännu bättre, eller gå vidare till en svårare version.",
         bestPossibleScoreCongrats: "Detta är högsta möjliga poäng på den här uppgiften. Grattis!",
         forMorePointsMoveToNextLevel: "För att få mer poäng, gå vidare till en svårare version av den här uppgiften.",
         youDidBetterBefore: "Det gick bättre tidigare.",
         scoreStays2: "Din poäng ändras inte.",
         reloadBestAnswer: "Ladda in ditt bästa svar.",
         noAnswerSaved: "No answer saved so far for this version.",
         validate: "Kontrollera svaret",
         restart: "Börja om",
         harderLevelSolved: "Varning: du har redan löst en svårare version av den här uppgiften. Du kommer inte kunna få mer poäng med den här versionen.",
         showLevelAnyway: "Visa den ändå.",
         scoreObtained: "Uppnådd poäng:",
         hardVersionTakesTime: "Att lösa en {0} kan ta lång tid. Fundera på om du ska jobba med en {1} för att tjäna poäng snabbare.",
         illKeepThatInMind: "Jag ska tänka på det.",
         harderLevelAvailable: "Notera att på den här uppgiften kan du direkt försöka med en svårare version än denna.",
         lockedLevel: "Den här versionen är låst. Lös den föregående nivån för att visa den!",
         gradeThisAnswer: "Bedöm svaret",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Spara svaret",
         answerSavedModifyOrCancelIt: "Ditt svar har sparats. Du kan ändra det, eller {0} och börja om.",
         cancelIt: "avbryta det",
         warningDifferentAnswerSaved: "Varning: ett annat svar finns redan sparat.",
         youMay: "Du kan {0}.",
         reloadIt: "ladda in det på nytt",
         saveThisNewAnswer: "Spara det här nya svaret",

         gradingInProgress: "Rättning pågår",
         scoreIs: "Din poäng är:",
         point: "poäng",
         points: "poäng",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Eftersom tävlingen är över sparas inte ditt svar och din poäng ändras inte.",
         scoreWouldBecome: "Med det här svaret, skulle din poäng vara:",
         reloadValidAnswer: "Ladda in det kontrollerade svaret.",
         contestOverAnswerNotSaved: "Eftersom tävlingen är över sparas inte ditt svar.",
         scoreWouldStay: "Med det här svaret, skulle din poäng inte ändras:",
         answerNotSavedContestOver: "Eftersom tävlingen är över sparas inte ditt svar. Du kan {0}.",
         reloadSubmittedAnswer: "ladda in det kontrollerade svaret på nytt",
         difficultyWarning: "<strong>Varning:</strong> att lösa den här versionen tar lång tid.<br/>Det kan gå snabbare att lösa 2- eller 3-stjärniga versioner av andra uppgifter.",
         enemyWarning: "<strong>Varning:</strong> i den här utmaningen kommer datorn se till att du inte hittar lösningen av en slump."
      },
      fi: {
         version: "Versio",
         levelVersionName_easy: "helppo versio",
         levelVersionName_medium: "hieman vaikeampi versio",
         levelVersionName_hard: "vaikea versio",
         levelVersionName_easy_stars: "2 tähden versio",
         levelVersionName_medium_stars: "3 tähden versio",
         levelVersionName_hard_stars: "4 tähden versio",
         levelName_easy: "Helppo",
         levelName_medium: "Hieman vaikeampi",
         levelName_hard: "Vaikea",
         warningTimeout: "<p>Varoitus: on kulunut jo yli {0} minuuttia siitä, kun aloit tekemään tätä tehtävää.</p><p>Sinun mahdollisesti kannattaisi siirtyä yrittämään jotain toista tehtävää, klikkaamalla oikean yläkulman nappia.</p>",
         alright: "Ok",
         moveOn: "Siirry eteenpäin",
         solvedMoveOn: "Ratkaisit tämän tehtävän kokonaan, siirry nyt seuraavaan tehtävään.",
         confirmRestart: "Oletko varma, että haluat aloittaa tämän version alusta?",
         yes: "Kyllä",
         no: "Ei",
         tryHardLevel: "Ehdotamme, että kokeilet 4 tähden versiota.",
         tryMediumLevel: "Ehdotamme, että kokeilet 3 tähden versiota.",
         tryNextTask: "Ehdotamme, että kokeilet seuraavaa tehtävää. Jos sinulle jää vielä aikaa, voit myöhemmin palata takaisin tämän tehtävän pariin.",
         yourScoreIsNow: "Pisteesi nyt:",
         worseScoreStays: "Tämä on aiempaa alhaisempi. Pistemääränäsi säilyy:",
         scoreStays: "Pistemääränäsi sailyy:",
         score: "Pisteet:",
         noPointsForLevel: "Et ole vielä saanut pisteitä tästä versiosta.",
         outOf: " / ",
         tryToDoBetterOrChangeTask: "Yritä saada vielä paremmat pisteet, tai siirry toiseen tehtävään.",
         tryToDoBetterOrMoveToNextLevel: "Yritä saada vielä paremmat pisteet, tai siirry saman tehtävän vaikeampaan versioon.",
         bestPossibleScoreCongrats: "Onnittelut: saavutit tehtävän maksimipistemäärän!",
         forMorePointsMoveToNextLevel: "Siirry tehtävän vaikeampaan versioon saadaksesi enemmän pisteitä.",
         youDidBetterBefore: "Sait aiemmin enemmän pisteitä.",
         scoreStays2: "Pistemääräsi säilyy samana.",
         reloadBestAnswer: "Palauta paras aiempi vastauksesi.",
         noAnswerSaved: "No answer saved so far for this version.",
         validate: "Tarkista vastaus",
         restart: "Aloita alusta",
         harderLevelSolved: "Varoitus: olet jo ratkaissut vaikeamman version tästä tehtävästä. Tämän helpomman version ratkaiseminen ei voi korottaa pistemäärääsi.",
         showLevelAnyway: "Siirry joka tapauksessa.",
         scoreObtained: "Saatu pistemäärä:",
         hardVersionTakesTime: "{0} voi viedä runsaasti aikaa. {1} voi tuottaa pisteitä nopeammin.",
         illKeepThatInMind: "Huomioin tämän.",
         harderLevelAvailable: "Huomaa, että voit myös suoraan koittaa ratkaista vaikeampaa versiota tästä tehtävästä.",
         lockedLevel: "Tämä versio on vielä lukittu: ratkaise ensin helpompi versio!",
         gradeThisAnswer: "Pisteytä tämä vastaus",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Tallenna vastaus",
         answerSavedModifyOrCancelIt: "Vastauksesi on tallennettu. Voit muokata sitä, tai {0} ja aloittaa uudelleen alusta.",
         cancelIt: "perua sen",
         warningDifferentAnswerSaved: "Varoitus: toisenlainen vastaus on tallennettu jo aiemmin.",
         youMay: "Voit {0}.",
         reloadIt: "ladata sen uudelleen",
         saveThisNewAnswer: "tallentaa tämän uuden vastauksen",

         gradingInProgress: "Pisteytystä suoritetaan",
         scoreIs: "Pistemääräsi on:",
         point: "piste",
         points: "pisteet",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Kilpailu on jo päättynyt, joten uutta vastaustasi ei enää tallennettu ja pistemääränäsi säilyy:",
         scoreWouldBecome: "Jos tämäkin vastaus huomioitaisiin, pistemääräsi olisi:",
         reloadValidAnswer: "Palauta aiemmin hyväksytty vastaus.",
         contestOverAnswerNotSaved: "Kilpailu on jo päättynyt, joten uutta vastaustasi ei enää tallennettu.",
         scoreWouldStay: "Jos tämäkin vastaus huomioitaisiin, pistemääräsi olisi yhä:",
         answerNotSavedContestOver: "Kilpailu on jo päättynyt, joten uutta vastaustasi ei enää tallennettu. Voit {0}.",
         reloadSubmittedAnswer: "palauttaa aiemmin lähetetyn vastauksen",
         difficultyWarning: "<strong>Varoitus:</strong> tämän version ratkaiseminen vie aikaa.<br/>Saat luultavasti ratkaistua 2 tai 3 tähden version nopeammin.",
         enemyWarning: "<strong>Varoitus:</strong> tässä tehtävässä tietokone pyrkii varmistamaan, ettet voi löytää ratkaisua sattumalta."
      },
      de: {
         version: "Version",
         levelVersionName_easy: "leichte Version",
         levelVersionName_medium: "mittlere Version",
         levelVersionName_hard: "schwere Version",
         levelVersionName_easy_stars: "2-Sterne-Version",
         levelVersionName_medium_stars: "3-Sterne-Version",
         levelVersionName_hard_stars: "4-Sterne-Version",
         levelName_easy: "Leicht",
         levelName_medium: "Mittel",
         levelName_hard: "Schwer",
         warningTimeout: "<p>Achtung, du bist schon seit {0} Minuten bei dieser Frage.</p><p>Du solltest jetzt zu einer anderen Aufgabe wechseln.</p>",
         alright: "OK",
         moveOn: "Fortfahren",
         solvedMoveOn: "Du hast diese Frage bereits vollständig gelöst. Wähle eine andere Frage zum Bearbeiten aus.",
         confirmRestart: "Bist du sicher, dass du diese Version neustarten möchtest?",
         yes: "Ja",
         no: "Nein",
         tryHardLevel: "Wir schlagen dir vor, die 4-Sterne-Version zu bearbeiten.",
         tryMediumLevel: "Wir schlagen dir vor, die 3-Sterne-Version zu bearbeiten",
         tryNextTask: "Wir schlagen dir vor, die nächste Aufgabe zu bearbeiten. Wenn du am Ende noch Zeit hast, kannst du hierher zurückkehren und die schwerere Version bearbeiten.",
         yourScoreIsNow: "Dein Punktestand ist jetzt:",
         worseScoreStays: "Das ist weniger als vorher; dein Punktestand bleibt:",
         scoreStays: "Dein Punktestand bleibt gleich:",
         score: "Punktestand:",
         noPointsForLevel: "Du hast noch keine Punkte für diese Version erhalten.",
         outOf: " von ",
         tryToDoBetterOrChangeTask: "Versuche, dich zu verbessern oder wähle eine andere Frage.",
         tryToDoBetterOrMoveToNextLevel: "Versuche, dich zu verbessern oder wähle schwierigere Version.",
         bestPossibleScoreCongrats: "Das ist die bestmögliche Punktzahl für diese Aufgabe. Glückwunsch!",
         forMorePointsMoveToNextLevel: "Wähle eine schwerere Version aus, um noch mehr Punkte zu bekommen.",
         youDidBetterBefore: "Du hast dich verbessern.",
         scoreStays2: "Dein Punktestand bleibt gleich.",
         reloadBestAnswer: "Deine beste Antwort wieder laden.",
         noAnswerSaved: "Bisher noch keine Antwort für diese Version gespeichert.",
         validate: "Erstellen",
         restart: "Neustarten",
         harderLevelSolved: "Achtung: Du hast schon eine schwerere Version gelöst. Du kannst mit dieser Version keine zusätzlichen Punkte bekommen.",
         showLevelAnyway: "Trotzdem anzeigen",
         scoreObtained: "Erhaltene Punkte:",
         hardVersionTakesTime: "Eine {0} zu lösen kann dich viel Zeit kosten; Denke zunächst daran, die Fragen in {1} zu beantworten, um schnell Punkte zu bekommen.",
         illKeepThatInMind: "Ich hab das verstanden",
         harderLevelAvailable: "Beachte, dass du bei dieser Frage direkt zu einer schwereren Version gehen kannst.",
         lockedLevel: "Diese Version ist noch gesperrt. Löse die vorherige um diese freizuschalten.",
         gradeThisAnswer: "Diese Antwort auswerten",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Antwort speichern",
         answerSavedModifyOrCancelIt: "Deine Antwort wurde eingereicht. Du kannst sie noch bearbeiten, oder {0} und neu beginnen.",
         cancelIt: "Abbrechen",
         warningDifferentAnswerSaved: "Achtung: Eine andere Antwort ist bereits gespeichert!",
         youMay: "Du kannst {0}.",
         reloadIt: "Neu laden",
         saveThisNewAnswer: "Diese Antwort speichern",

         gradingInProgress: "Das Ergebnis wird ausgewertet …",
         scoreIs: "Dein Punktestand beträgt:",
         point: "Punkt",
         points: "Punkte",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Der Contest ist vorbei, deine Antwort wurde nicht eingereicht und deine Punktestand bleibt:",
         scoreWouldBecome: "Mit dieser Antwort wäre dein Punktestand:",
         reloadValidAnswer: "Die gültige Antwort neu laden.",
         contestOverAnswerNotSaved: "Der Contest ist vorbei, deine Antwort wurde nicht eingereicht.",
         scoreWouldStay: "Mit dieser Antwort bliebe dein Punktestand gleich:",
         answerNotSavedContestOver: "Der Contest ist vorbei, deine Antwort wurde nicht eingereicht. Du kannst {0}.",
         reloadSubmittedAnswer: "Lade die Lösung, die du eingereicht hast",
         difficultyWarning: "<strong>Achtung:</strong> diese Version zu lösen kann einige Zeit in Anspruch nehmen.<br/>Die 2- und 3-Stern Version von anderen Aufgaben lassen sich schneller lösen.",
         enemyWarning: "<strong>Attention :</strong> dans ce défi, l'ordinateur vous empêchera de trouver la solution par hasard."
      },
      ar: {
         version: "المستوى",
         levelVersionName_easy: "المستوى السهل",
         levelVersionName_medium: "المستوى المتوسط",
         levelVersionName_hard: "المستوى الصعب",
         levelVersionName_easy_stars: "المستوى الأول",
         levelVersionName_medium_stars: "المستوى الثاني",
         levelVersionName_hard_stars: "المستوى الثالث",
         levelName_easy: "سهل",
         levelName_medium: "متوسط",
         levelName_hard: "صعب",
         warningTimeout: "<p>لقد مر وقت طويل منذ أن بدأت في هذه المسألة, من الأفضل أن تبدأ في مسألة أخرى حتى لا يضيع الوقت</p>",
         alright: "حسناً",
         moveOn: "استمر",
         solvedMoveOn: "لقد أجبت على هذا السؤال بالكامل. ابدأ في سؤال أخر",
         confirmRestart: "هل ترغب في بدء هذا سؤال من جديد؟",
         yes: "نعم",
         no: "لا",
         tryHardLevel: "نقترح أن تبدأ في المستوى الثالث للسؤال",
         tryMediumLevel: "نقترح أن تبدأ في المستوى الثاني للسؤال",
         tryNextTask: "نقترح أن تبدأ في المسألة التالية, وإذا تبقى عندك وقت يمكنك حل المستوى الأصعب في هذه المسألة لاحقاً",
         yourScoreIsNow: "مجموع نقاطك:",
         worseScoreStays: "هذا ليس جيداً. ما زالت نقاطك:",
         scoreStays: "نقاطك ما زالت كما هي:",
         score: "النقاط",
         noPointsForLevel: "لم تحقق أي نقاط في هذا المستوى",
         outOf: "من",
         tryToDoBetterOrChangeTask: "حاول في مسألة أخرى",
         tryToDoBetterOrMoveToNextLevel: "حاول في المستوى الأصعب",
         bestPossibleScoreCongrats: "مبروك ... لقد حصلت على أعلى درجة في هذا السؤال",
         forMorePointsMoveToNextLevel: "للحصول على المزيد من النقاط جاوب على المستوى الأصعب",
         youDidBetterBefore: "لقد قمت بها أفضل من هذا في وقت سابق",
         scoreStays2: "ما زالت نقاطك كما هي",
         reloadBestAnswer: "اعد تحميل إجابتك الأفضل",
         noAnswerSaved: "No answer saved so far for this version.",
         validate: "تحقق",
         restart: "ابدأ من جديد",
         harderLevelSolved: "لقد قمت بحل المستوى الأصعب في هذا السؤال, لن تتمكن من الحصول على درجات أعلى في هذا السؤال",
         showLevelAnyway: "اظهرها لي على أي حال",
         scoreObtained: "النقاط المكتسبة:",
         hardVersionTakesTime: "Solving a {0} can take a lot of time. Consider working on the {1} to gain points quickly.",
         illKeepThatInMind: "I'll consider it.",
         harderLevelAvailable: "تنبيه: يمكنك حل المستوى الأصعب في هذه المسألة مباشرة",
         lockedLevel: "هذا المستوى مغلق. يجب عليك حل المستوى السابق أولا",
         gradeThisAnswer: "قيم هذه الإجابة",

         // The following messages are used for tasks with no feedback
         saveAnswer: "احفظ هذه الإجابة",
         answerSavedModifyOrCancelIt: "تم حفظ إجابتك, يمكنك تعديلها أو بدأها من جديد",
         cancelIt: "احذفها",
         warningDifferentAnswerSaved: "تنبيه: يوجد اجابة أخرى محفوظة سابقاً",
         youMay: "You may {0}.",
         reloadIt: "حملها من جديد",
         saveThisNewAnswer: "احفظ الإجابة الجديدة",

         gradingInProgress: "نقوم بالتقييم",
         scoreIs: "مجموع نقاطك:",
         point: "نقطة",
         points: "نقاط",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "المسابقة انتهت. إجابتك الجديدة لم تحفظ ومجموع نقاطك ما زال:",
         scoreWouldBecome: " مع تلك الإجابة، مجموع نقاطك أصبح:",
         reloadValidAnswer: "اعد تحميل الإجابة المحققة",
         contestOverAnswerNotSaved: "المسابقة إنتهت ولم يتم حفظ إجاباتك الجديدة",
         scoreWouldStay: "بهذه الإجابة سوف يظل مجموع نقاطك كما هو",
         answerNotSavedContestOver: "The contest being over, your answer was not saved. You may {0}.",
         reloadSubmittedAnswer: "اعد تحميل الإجابة المحققة",
         difficultyWarning: "تنبيه: حل هذه النسخة سوف يستغرق وقت كثير. الإفضل أن تبدأ في حل مسائل أخرى",
         enemyWarning: "تحذير: في هذه المسألة سيمنعك الكمبيوتر من إيجاد الحل عن طريق الصدفة. فكر جيداً"
      },
      es: {
         version: "Versión",
         levelVersionName_easy: "versión fácil",
         levelVersionName_medium: "versión moderada",
         levelVersionName_hard: "versión difícil",
         levelVersionName_easy_stars: "versión de 2 estrellas",
         levelVersionName_medium_stars: "versión de 3 estrellas",
         levelVersionName_hard_stars: "versión de 4 estrellas",
         levelName_easy: "Fácil",
         levelName_medium: "Moderado",
         levelName_hard: "Difícil",
         warningTimeout: "<p>Atención, ya lleva {0} minutos en esta pregunta.</p><p>Le recomendamos cambiar de tema haciendo click sobre el botón de arriba a la derecha.</p>",
         alright: "De acuerdo",
         moveOn: "Pasar a la siguiente",
         solvedMoveOn: "Ha resuelto completamente esta pregunta. Pase a otra pregunta.",
         confirmRestart: "¿Está seguro que desea volver a iniciar esta versión?",
         yes: "Sí",
         no: "No",
         tryHardLevel: "Le recomendamos intentar la versión de 4 estrellas.",
         tryMediumLevel: "Le recomendamos intentar la versión de 3 estrellas.",
         tryNextTask: "Nous vous proposons de passer au sujet suivant. S'il vous reste du temps, vous reviendrez plus tard essayer la version suivante.",
         yourScoreIsNow: "Su puntuación es ahora :",
         worseScoreStays: "Esto no está tan bien como antes; su puntuación se mantiene en :",
         scoreStays: "Su puntuación se mantiene igual :",
         score: "Puntuación :",
         noPointsForLevel: "Aún no ha recibido puntos en esta versión.",
         outOf: " de ",
         tryToDoBetterOrChangeTask: "Intente nuevamente para obtener una mejor puntuación, o pase a la siguiente pregunta.",
         tryToDoBetterOrMoveToNextLevel: "Intente nuevamente para obtener una mejor puntuación, o pase una versión más difícil.",
         bestPossibleScoreCongrats: "Esta es la mejor puntuación posible en este problema, ¡felicitaciones!",
         forMorePointsMoveToNextLevel: "Para obtener más puntos, pase a una versión más difícil.",
         youDidBetterBefore: "Realizó un mejor trabajo antes.",
         scoreStays2: "Su puntuación se mantiene igual.",
         reloadBestAnswer: "Recargar su mejor respuesta.",
         noAnswerSaved: "Aún no hay respuesta guardada para esta versión.",
         validate: "Validar",
         restart: "Reiniciar",
         harderLevelSolved: "Atención: ya ha resuelto una versión más difícil. No puede ganar puntos extra con esta versión.",
         showLevelAnyway: "Mostrar el nivel de igual manera",
         scoreObtained: "Puntuación obtenida:",
         hardVersionTakesTime: "Resolver una {0} puede tomar mucho tiempo; le aconsejamos priorizar resolver las preguntas en {1} para ganar puntos rápidamente.",
         illKeepThatInMind: "Lo tendré en mente",
         harderLevelAvailable: "Note que para esta pregunta, puede resolver directamente una versión más difícil que esta.",
         lockedLevel: "Esta versión está bloqueada. Resuelva la version anterior para verla.",
         gradeThisAnswer: "Evaluar esta respuesta",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Guardar su respuesta",
         answerSavedModifyOrCancelIt: "Su respuesta fue guardada. Puede modificarla, o bien {0} y reiniciar.",
         cancelIt: "cancelarla",
         warningDifferentAnswerSaved: "Atención: una respuesta diferente ha sido guardada.",
         youMay: "Usted puede {0}.",
         reloadIt: "recargarla",
         saveThisNewAnswer: "Guardar esta nueva respuesta",

         gradingInProgress: "Evaluación en curso",
         scoreIs: "Su puntuación es:",
         point: "punto",
         points: "puntos",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "El concurso está terminando, su respuesta no ha sido guardada y su puntuación se mantiene en:",
         scoreWouldBecome: "Con esta respuesta, su puntuación será :",
         reloadValidAnswer: "Volver a cargar la respuesta válida.",
         contestOverAnswerNotSaved: "El concurso ha terminado: su respuesta no fue guardada.",
         scoreWouldStay: "Con esta respuesta, su puntuación será la misma:",
         answerNotSavedContestOver: "El concurso está terminando y su respuesta no ha sido guardada. Usted puede {0}.",
         reloadSubmittedAnswer: "recargar la respuesta que ha enviado",
         difficultyWarning: "<strong>Advertencia:</strong> resolver esta versión toma tiempo.<br/>Usted puede resolver más rápidamente las versiones de 2 y 3 estrellas de otros problemas.",
         enemyWarning: "<strong>Advertencia:</strong> en este desafío, la computadora se asegurará que no encuentre la respuesta por casualidad."
      },
      sl: {
         version: "Stopnja",
         levelVersionName_easy: "enostavna stopnja",
         levelVersionName_medium: "srednja stopnja",
         levelVersionName_hard: "težka stopnja",
         levelVersionName_easy_stars: "stopnja 2 zvezdici",
         levelVersionName_medium_stars: "stopnja 3 zvezdice",
         levelVersionName_hard_stars: "stopnja 4 zvezdice",
         levelName_easy: "Enostavno",
         levelName_medium: "Srednje",
         levelName_hard: "Težko",
         warningTimeout: "<p>Opozorilo: Odkar rešuješ to nalogo, je minilo že več kot {0} minut.</p><p>Najbolje, da izbereš drugo nalogo, tako da klikneš gumb v zgornjem desnem kotu.</p>",
         alright: "V redu",
         moveOn: "Nadaljuj",
         solvedMoveOn: "Ta naloga je dokončana, nadaljuj z naslednjo nalogo.",
         confirmRestart: "Ali res želiš znova začeti to stopnjo?",
         yes: "Da",
         no: "Ne",
         tryHardLevel: "Predlagamo, da poizkusiš stopnjo s 4 zvezdicami.",
         tryMediumLevel: "Predlagamo, da poizkusiš stopnjo s 3 zvezdicami.",
         tryNextTask: "Prdlagamo, da poizkusiš naslednjo nalogo. Če bo ostalo dovolj časa, se vrni in poizkusi naslednjo stopnjo te naloge.",
         yourScoreIsNow: "Tvoj rezultat je:",
         worseScoreStays: "Rešitev ni tako dobra, kot prejšnja. Tvoj rezultat ostaja:",
         scoreStays: "Tvoj rezultat ostaja enak:",
         score: "Rezultat:",
         noPointsForLevel: "Na tej stopnji nisi dobil(-a) še nobene točke.",
         outOf: " od ",
         tryToDoBetterOrChangeTask: "Poskusi nalogo rešiti še bolje ali se premakni na naslednjo nalogo.",
         tryToDoBetterOrMoveToNextLevel: "Poskusi nalogo rešiti še bolje ali se premakni na težjo stopnjo.",
         bestPossibleScoreCongrats: "Čestitamo, to je najboljši možni rezultat te naloge!",
         forMorePointsMoveToNextLevel: "Če želiš dobiti še več točk, se premakni na težjo stopnjo te naloge.",
         youDidBetterBefore: "Rešitev je boljša od prejšnje.",
         scoreStays2: "Tvoj rezultat ostaja enak.",
         reloadBestAnswer: "Znova naloži najboljšo rešitev.",
         noAnswerSaved: "No answer saved so far for this version.",
         validate: "Preveri",
         restart: "Začni znova",
         harderLevelSolved: "Opozorilo: Rešil(-a) si že težjo stopnjo te naloge. S to stopnjo ne boš dobil(-a) dodatnih točk.",
         showLevelAnyway: "Vseeno mi pokaži stopnjo.",
         scoreObtained: "Dobljeni rezultat:",
         hardVersionTakesTime: "Reševanje {0} lahko traja veliko časa. Razmisli o reševanju {1}, da boš hitro dobil(-a) točke.",
         illKeepThatInMind: "Razmislil(-a) bom.",
         harderLevelAvailable: "Ne pozabi, da lahko to nalogo rešuješ na težji stopnji kot je ta.",
         lockedLevel: "Ta stopnja je zaklenjena! Za pikaz moraš najprej rešiti prejšnjo stopnjo!",
         gradeThisAnswer: "Oceni ta odgovor",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Shrani ta odgovor",
         answerSavedModifyOrCancelIt: "Tvoj odgovor je bil shranjen. Lahko ga spremeniš ali {0} in začneš znova.",
         cancelIt: "prekličeš",
         warningDifferentAnswerSaved: "Opozorilo: Prej je bil shranjen drugačen odgovor.",
         youMay: "Lahko ga {0}.",
         reloadIt: "naložiš znova",
         saveThisNewAnswer: "Shrani ta nov odgovor",

         gradingInProgress: "Ocenjevanje poteka",
         scoreIs: "Tvoj rezultat je:",
         point: "točka",
         points: "točk",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Ker je tekmovanja konec, tvoj novi odgovor ni bil shranjen in rezultat bo ostal:",
         scoreWouldBecome: "S to rešitvijo bi bil tvoj rezultat:",
         reloadValidAnswer: "Znova naloži preverjeno rešitev.",
         contestOverAnswerNotSaved: "Ker je tekmovanja konec, tvoj novi odgovor ni bil shranjen.",
         scoreWouldStay: "S to rešitvijo bi tvoj rezultat ostal enak:",
         answerNotSavedContestOver: "Ker je tekmovanja konec, tvoj novi odgovor ni bil shranjen. Lahko {0}.",
         reloadSubmittedAnswer: "znova naložiš preverjeno rešitev",
         difficultyWarning: "<strong>Opozorilo:</strong> Reševanje te stopnje lahko traja veliko časa. <br/>Hitreje lahko rešiš stopnje z 2 ali s 3 zvezdicami drugih nalog.",
         enemyWarning: "<strong>Opozorilo:</strong> Pri tej nalogi ti bo računalnik preprečil naključno rešitev."
      },
   },
   initLanguage: function() {
      if (window.stringsLanguage == undefined) {
         window.stringsLanguage = 'fr';
      }
      this.strings = this.languageStrings[window.stringsLanguage];
   },
   /***********************************************
    * Initialization functions called by the task *
    ***********************************************/
   load: function(views) {
      this.initLanguage();
      var self = this;
      this.showScore = (typeof views.grader !== 'undefined' && views.grader === true);
      window.platform.getTaskParams(null, null, function(taskParams) {
         self.taskParams = taskParams;
         self.readOnly = (self.taskParams.readonly === true || self.taskParams.readOnly == 'true');
         self.graderScore = +self.taskParams.noScore;
         self.savedAnswer = '';

         $("#difficultyWarning").html(self.strings.difficultyWarning).addClass("warningHeader");
         $("#enemyWarning").html(self.strings.enemyWarning).addClass("warningHeader");
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
               self.showPopupMessage(self.formatTranslation(self.strings.warningTimeout, [self.timeoutMinutes]), 'blanket', self.strings.alright, null, null, "warning");
               self.taskDelayWarningTimeout = null;
            }
         };
         if (self.timeoutMinutes > 0) {
            self.taskDelayWarningTimeout = setTimeout(taskDelayWarning, self.timeoutMinutes * 60 * 1000);
         }
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
      this.unlockedLevels = 4;
      this.neverHadHard = false;
      this.showMultiversionNotice = false;
      this.taskLevel = '';
      this.initLevelVars();
      return true;
   },

   initLevelVars: function() {
      var defaultLevelsRanks = { basic: 1, easy: 2, medium: 3, hard: 4 };
      this.levelsRanks = {};
      this.levelsScores = {};
      this.prevLevelsScores = {};
      for(var i=0; i < this.levels.length; i++) {
         var levelName = this.levels[i];
         if(typeof this.levelsRanks[levelName] == 'undefined') {
            this.levelsRanks[levelName] = defaultLevelsRanks[levelName];
         }
         this.levelsScores[levelName] = 0;
         this.prevLevelsScores[levelName] = 0;
      }
   },

   setupLevels: function(initLevel, reloadWithCallbacks, levels) {
      this.reloadWithCallbacks = reloadWithCallbacks;
      this.initLanguage();
      if(levels) {
         this.levels = levels;
         this.levelsIdx = {};
         for(var i = 0; i < this.levels.length; i++) {
            this.levelsIdx[this.levels[i]] = i;
         }
      }
      this.initLevelVars();

      var self = this;
      function callSetupLevels() {
         if(!initLevel) {
            initLevel = self.taskParams.options.difficulty ? self.taskParams.options.difficulty : "easy";
         }
         self.doSetupLevels(initLevel);
      };
      if (!this.taskParams) {
         window.platform.getTaskParams(null, null, function(taskParams) {
            self.taskParams = taskParams;
            callSetupLevels();
         });
      } else {
         callSetupLevels();
      }
   },
   doSetupLevels: function(initLevel) {
      // TODO To fix: levelWrapper-1 does not work correctly without this part,
      // so the level is loaded twice initially (once here, and once below).
      if(!this.reloadWithCallbacks) {
         task.reloadStateObject(task.getDefaultStateObject(), true);
         task.reloadAnswerObject(task.getDefaultAnswerObject());
      }

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
         this.showPopupMessage(this.strings.harderLevelAvailable, 'blanket', this.strings.alright,
            function() {
               this.showMultiversionNotice = false;
            }
         );
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
      this.levelsMaxScores = {};
      for(var i=0; i < this.levels.length; i++) {
         var levelName = this.levels[i];
         var levelMaxScore = maxScore * this.levelsRanks[levelName] / this.maxStars;
         this.levelsMaxScores[levelName] = this.pointsAsStars ? levelMaxScore : Math.round(levelMaxScore);
      }
   },
   setupLevelsTabs: function() {
      var scoreHTML;
      var maxScores = this.levelsMaxScores;
      if (this.pointsAsStars) {
         var titleStarContainers = [];
         scoreHTML = '<span></span><span id="titleStars"></span>';
         $('#task > h1').append(scoreHTML);
         drawStars('titleStars', this.maxStars, 24, 0, 'normal');
      } else {
         // Disabled: doesn't work with new tabs layout.
         //scoreHTML = '<div class="bestScore">Score retenu : <span id="bestScore">0</span> sur ' + maxScores.hard + '</div>';
         //$('#tabsContainer').append(scoreHTML);
      }

      var tabsStarContainers = [];
      var tabsHTML = '<div id="tabsMenu">';
      var curLevel;
      for (curLevel in this.levelsRanks) {
         tabsHTML += '<span class="li" id="tab_' + curLevel + '"><a href="#' + curLevel + '">';
         if (this.pointsAsStars) {
            tabsHTML += '<span class="levelLabel">' + this.strings.version + '</span><span id="stars_' + this.levelsRanks[curLevel] + '"></span>';
         } else {
            tabsHTML += this.strings["levelName_" + curLevel] + ' — ' +
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
         self.updateLayout();
      }, 100);

      $('#tabsContainer').after('<div id="popupMessage"></div>');
   },

   updateStarsAtLevel: function(level) {
      var rate = this.levelsScores[level] / this.levelsMaxScores[level];
      var iLevel = this.levelsIdx[level];
      var starsIdx = this.levelsRanks[level];
      var mode = 'normal';
      if (iLevel >= this.unlockedLevels) {
         mode = 'locked';
      }
      if (this.graderScore > this.levelsMaxScores[level]) {
         mode = 'useless';
      }
      drawStars('stars_' + starsIdx, starsIdx, 14, rate, mode);
   },

   updateLayout: function() {
      if (!this.bUseFullWidth) {
         return
      }
      $('#valider').appendTo($('#displayHelper_validate'));
      if(window.innerWidth >= 1200) {
          $('#task').addClass('largeScreen');
          $('#displayHelperAnswering').appendTo($('#zone_1'));
      }
      else {
         $('#task').removeClass('largeScreen');
         if ($('#showSolutionButton')) {
            $('#displayHelperAnswering').insertBefore($('#showSolutionButton'));
         }
         else {
            $('#displayHelperAnswering').appendTo($('#task'));
         }
     }
   },

   useFullWidth: function() {
      // TODO: find a clean way to do this
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch(e) {
      }
      // This try is probably not needed but avoid breaking just in case
      try {
         $(document).ready(function () {displayHelper.updateLayout();});
         $(window).resize(function () {displayHelper.updateLayout();});
         this.bUseFullWidth = true;
      } catch(e) {
      }
   },

   // Deprecated: use directly levelsMaxScores instead
   getLevelsMaxScores: function() {
      return this.levelsMaxScores;
   },

   displayLevel: function(newLevel) {
      // Only displays a level, without requesting a level change to the task
      if (this.popupMessageShown) {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         this.popupMessageShown = false;
      }

      var allLevels = ['basic', 'easy', 'medium', 'hard'];
      if(this.levelsRanks) {
         for(var lr in this.levelsRanks) {
            allLevels.push(lr);
         }
      }
      for(var i=0; i < allLevels.length; i++) {
         var curLevel = allLevels[i];
         $('#tab_' + curLevel).removeClass('current');
         $('.' + curLevel).hide();
      }
      $('#tab_' + newLevel).addClass('current');
      $('.' + newLevel).show();

      // Add prev and next classes to .current direct siblings
      $('#tabsMenu .li').removeClass('prev next');
      $('#tabsMenu .li.current').prev().addClass('prev');
      $('#tabsMenu .li.current').next().addClass('next');
   },

   setLevel: function(newLevel) {
      if (this.taskLevel == newLevel) {
         return;
      }

      this.displayLevel(newLevel);

      var answer = task.getAnswerObject();
      var state = task.getStateObject();
      state.level = newLevel;
      this.taskLevel = newLevel;
      var self = this;

      var afterReload = function() {
         self.submittedScore = self.levelsScores[self.taskLevel];
         self.refreshMessages = true;
         self.checkAnswerChanged();
         self.stopShowingResult();
         if ($('#tab_' + newLevel).hasClass('lockedLevel')) {
            self.showPopupMessage(self.strings.lockedLevel, 'lock');
         } else if (!self.hasSolution) {
            if ($('#tab_' + newLevel).hasClass('uselessLevel') && self.levelsScores[newLevel] < self.levelsMaxScores[newLevel]) {
               self.showPopupMessage(self.strings.harderLevelSolved, 'tab', self.strings.showLevelAnyway, null, null, "warning");
            } else if (newLevel == 'hard' && self.neverHadHard) {
               var hardVersionKey = "levelVersionName_hard";
               var easyVersionKey = "levelVersionName_easy";
               if (self.pointsAsStars) {
                  hardVersionKey += "_stars";
                  easyVersionKey += "_stars";
               }
               self.showPopupMessage(self.formatTranslation(self.strings.hardVersionTakesTime, [self.strings[hardVersionKey], self.strings[easyVersionKey]]),
               'tab',
                  self.strings.illKeepThatInMind, function() {
                     self.neverHadHard = false;
                  }
               );
            }
         }
      };

      if(self.reloadWithCallbacks) {
         task.reloadStateObject(state, function() {
            task.reloadAnswerObject(answer, afterReload);
         });
      }
      else {
         task.reloadStateObject(state, true);
         task.reloadAnswerObject(answer);
         afterReload();
      }
   },

   getImgPath: function() {
      if(window.contestsRoot) {
         // Hack: when in the context of the platform, we need to change the path
         return window.contestsRoot + '/' + window.contestFolder + '/';
      } else if(window.modulesPath) {
         var modulesPath = window.modulesPath[window.modulesPath.length-1] == '/' ? window.modulesPath : window.modulesPath + '/';
         return modulesPath + 'img/';
      } else {
         return '../../../_common/modules/img/';
      }
   },

   getAvatar: function(mood) {
      if (displayHelper.avatarType == "beaver") {
         return "castor.png";
      } else if (displayHelper.avatarType == "none") {
        return "";
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


   showPopupDialog: function(message) {
      if ($('#popupMessage').length == 0) {
         $('#task').after('<div id="popupMessage"></div>');
      }

      $('#popupMessage').addClass('floatingMessage');

      var imgPath = displayHelper.getImgPath();

      var popupHtml = '<div class="container">' +
         '<img class="messageArrow" src="' + imgPath + 'fleche-bulle.png"/>' +
         '<div class="message">' + message + '</div></div>';

      $('#popupMessage').html(popupHtml).show();

      this.popupMessageShown = true;
      try {
         $(parent.document).scrollTop(0);
      } catch (e) {
      }
   },


   errorPopupAvatar: function() {
      $('#popupMessage').addClass('noAvatar');
   },


   showPopupMessage: function(message, mode, yesButtonText, agreeFunc, noButtonText, avatarMood, defaultText, disagreeFunc) {
      if(this.popupMessageHandler) {
         // A custom popupMessageHandler was defined, call it
         // It must return true if it handled the popup, false if displayHelper
         // should handle the popup instead
         if(this.popupMessageHandler.apply(null, arguments)) {
            return;
         }
      }

      if ($('#popupMessage').length == 0) {
         $('#task').after('<div id="popupMessage"></div>');
      }
      if (mode == 'blanket' || mode == 'input') {
         $('#popupMessage').addClass('floatingMessage');
      } else {
         $('#taskContent, #displayHelperAnswering').hide();
         $('#popupMessage').removeClass('floatingMessage');
      }
      $('#popupMessage').removeClass('noAvatar');

      var imgPath = displayHelper.getImgPath();
      if(mode == 'lock') {
         var buttonYes = '';
      } else if (mode == 'input') {
         var buttonYes = '<button class="buttonYes">' + (yesButtonText || this.strings.validate) + '</button>';
      } else {
         var buttonYes = '<button class="buttonYes">' + (yesButtonText || this.strings.alright) + '</button>';
      }
      var buttonNo = '';
      if (noButtonText != undefined) {
         buttonNo = '<button class="buttonNo" style="margin-left: 10px;">' + noButtonText + '</button>';
      }
      var popupHtml = '<div class="container">' +
         '<img class="beaver" src="' + imgPath + this.getAvatar(avatarMood) + '" onerror="displayHelper.errorPopupAvatar();"/>' +
         '<img class="messageArrow" src="' + imgPath + 'fleche-bulle.png"/>' +
         '<div class="message">' + message + '</div>';
      if(mode == 'input') {
         popupHtml += '<input id="popupInput" type="text" value="' + (defaultText ? defaultText : '') + '"></input>';
      }
      popupHtml += '<div class="buttonsWrapper">' + buttonYes + buttonNo + '</div></div>';
      $('#popupMessage').html(popupHtml).show();
      if(mode == 'input') {
         $('#popupInput').focus();
      }

      var validateFunc = function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
         if (agreeFunc) {
            if(mode == 'input') {
                agreeFunc($('#popupInput').val());
            } else {
                agreeFunc();
            }
         }
      };

      var validateFuncNo = function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
         if (disagreeFunc) {
            if(mode == 'input') {
                disagreeFunc($('#popupInput').val());
            } else {
                disagreeFunc();
            }
         }
      };

      $('#popupMessage .buttonYes').click(validateFunc);
      $('#popupMessage .buttonNo').click(validateFuncNo);
      $('#popupInput').keypress(function (e) {
         if(e.which === 13) { validateFunc(); }
      });

      $('#popupMessage .buttonNo').click(function() {
         $('#popupMessage').hide();
         $('#displayHelperAnswering, #taskContent').show();
         displayHelper.popupMessageShown = false;
      });
      this.popupMessageShown = true;
      try {
         $(parent.document).scrollTop(0);
      } catch (e) {
      }
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
      var that = this;
      if (this.showScore) {
         // TODO we only know the answer here, and not the state. Possibly problematic?
         this.updateScore(strAnswer, true, function() {
            that.checkAnswerChanged(); // necessary?
         });
      } else {
         that.checkAnswerChanged(); // necessary?
      }
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
      if(this.confirmRestartAll) {
         this.showPopupMessage(this.strings.confirmRestart, 'blanket', this.strings.yes, this.restartAllNoConfirm, this.strings.no);
      }
      else {
         this.restartAllNoConfirm();
      }
   },

   restartAllNoConfirm: function() {
      displayHelper.stopShowingResult();
      if (!displayHelper.hasLevels) {
         // TODO is this the desired behavior for no levels?
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

   setValidateString: function(str) {
      this.customValidateString = str;
      $("#displayHelper_validate > input").val(str);
   },

   callValidate: function() {
      if (this.customValidate != undefined) {
         this.customValidate();
      } else {
         platform.validate("none", function() {});
      }
   },

   validate: function(mode) {
      this.stoppedShowingResult = false;
      var self = this;
      if (mode == 'log') {
         // Ignore it? Do something?
      } else if (mode == 'cancel') {
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
            var refresh = function() {
               self.refreshMessages = true;
               self.checkAnswerChanged();
            };
            self.submittedAnswer = strAnswer;
            if (self.showScore) {
               self.updateScore(strAnswer, false, refresh, (mode == "silent"));
            } else {
               self.savedAnswer = strAnswer;
               refresh();
            }
         });
      }
   },

   updateScore: function(strAnswer, allLevels, callback, silentMode) {
      var self = this;
      function refresh() {
         self.refreshMessages = true;
         self.checkAnswerChanged();
         callback();
      }
      if (allLevels) {
         // TODO: make sure the grader doesn't evaluate each level at each call (most do right now!)
         var levelsToDo = this.levels.slice();
         var updateNextScore = null;
         updateNextScore = function() {
            var nextLevel = levelsToDo.shift();
            if(nextLevel) {
               self.updateScoreOneLevel(strAnswer, nextLevel, updateNextScore);
            } else {
               refresh();
            }
         }
         updateNextScore();
      } else {
         this.updateScoreOneLevel(strAnswer, this.taskLevel, function() {
            if (!silentMode) {
               if (self.hasLevels) {
                  self.showValidatePopup(self.taskLevel);
               } else {
                  self.showValidatePopup();
               }
            }
            callback();
         }, silentMode);
      }
   },
   updateScoreOneLevel: function(strAnswer, gradedLevel, callback, silentMode) {
      var self = this;
      this.graderMessage = this.strings.gradingInProgress;
      task.getLevelGrade(strAnswer, null, function(score, message) {
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
                     self.savedAnswer = strAnswer;
                  } else {
                     var savedAnswerObj = $.parseJSON(self.savedAnswer);
                     var answerObj = $.parseJSON(strAnswer);
                     savedAnswerObj[gradedLevel] = answerObj[gradedLevel];
                     self.savedAnswer = JSON.stringify(savedAnswerObj);
                  }
               }
            } else if (score > self.graderScore) {
               self.savedAnswer = strAnswer;
               self.graderScore = score;
            }
         }
         if (silentMode) {
            message = "";
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
         drawStars('titleStars', this.maxStars, 24, this.graderScore / maxScores.hard, 'normal');
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
         for (curLevel in this.levelsRanks) {
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
      var buttonText = this.strings.alright;
      var avatarMood = "error";
      if ((gradedLevel == undefined) && (this.graderScore >= this.taskParams.maxScore - 0.001)) {
         avatarMood = "success";
         buttonText = this.strings.moveOn;
         fullMessage += "<br/><br/>";
         actionNext = "nextTask";
         fullMessage += this.strings.solvedMoveOn;
      } else if (maxScores && (gradedLevel !== undefined) && this.graderScore >= maxScores[gradedLevel] - 0.001) {
         avatarMood = "success";
         buttonText = this.strings.moveOn;
         fullMessage += "<br/><br/>";
         var levelIdx = this.levelsIdx[gradedLevel];
         var nextLevel = levelIdx !== undefined && levelIdx < this.levels.length-1 ? this.levels[levelIdx+1] : null;
         if(nextLevel) {
            // Offer to try next task if the user solved this difficulty slowly
            var threshold = this.thresholds[gradedLevel];
            if(!threshold) {
                if(gradedLevel == "medium") { threshold = this.thresholdMedium; }
                else if(gradedLevel == "easy") { threshold = this.thresholdEasy; }
            }
            if(!threshold || (threshold && secondsSinceLoaded < threshold)) {
               actionNext = nextLevel;
               if(gradedLevel == "easy") { fullMessage += this.strings.tryMediumLevel; }
               if(gradedLevel == "medium") { fullMessage += this.strings.tryHardLevel; }
            } else {
               actionNext = "nextTask";
               fullMessage += this.strings.tryNextTask;
            }
         } else {
            // Solved the last level, move on
            actionNext = "nextTask";
            fullMessage += this.strings.solvedMoveOn;
         }
      }
      var self = this;
      // Offer an option to stay on the task instead of forcing nextTask
      var noButtonText = actionNext == "nextTask" ? this.strings.no : null;
      this.showPopupMessage(fullMessage, 'blanket', buttonText,
         function() {
            // TODO: replace with something compatible with the API.
            try {
               $(parent.document).scrollTop(0);
            } catch (e) {
            }
            if (actionNext == "nextTask") {
               platform.validate("nextImmediate");
            } else if(self.levelsIdx[actionNext] !== undefined) {
               self.setLevel(actionNext);
            }
         },
         noButtonText,
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
      var scoreDiffMsg = this.strings.score;
      var showRetrieveAnswer = false;
      if (this.submittedAnswer !== '' && this.prevSavedScore !== undefined) {
         if (!this.hasSolution) {
            if (this.prevSavedScore < this.submittedScore) {
               scoreDiffMsg = this.strings.yourScoreIsNow;
            } else if (this.prevSavedScore > this.submittedScore) {
               scoreDiffMsg = this.strings.worseScoreStays;
               showRetrieveAnswer = true;
            }
            else {
               scoreDiffMsg = this.strings.scoreStays;
            }
         } else {
            if (this.prevSavedScore != this.submittedScore) {
               scoreDiffMsg = this.strings.contestOverScoreStays + " " + this.prevSavedScore + ". " + this.strings.scoreWouldBecome;
            } else if (this.submittedAnswer != this.savedAnswer) {
               scoreDiffMsg = this.strings.contestOverScoreStays + " " + this.prevSavedScore + ". " + this.strings.scoreWouldStay;
            } else {
               scoreDiffMsg = this.strings.scoreIs;
            }
         }
      }
      scoreDiffMsg += " " + this.graderScore + this.strings.outOf + this.taskParams.maxScore + ".";
      if ((this.hasSolution && this.savedAnswer != this.prevAnswer) ||
          (this.graderScore > 0 && (taskMode == 'saved_changed' || showRetrieveAnswer))) {
         scoreDiffMsg += ' <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">' +  this.strings.reloadValidAnswer + '</a>';
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
            if (this.hideScoreDetails) {
               message = this.strings.scoreObtained + ' <span id="answerScore">' + this.levelsScores[this.taskLevel] + " " + strPoint + " " + this.strings.outOf + " " + maxScoreLevel + ".</span><br/>";;
            } else {
               showRetrieveAnswer = true;
            }
         } else {
            message += this.strings.noPointsForLevel;
         }
      } else {
         var strPoint = this.strings.point;
         if (this.submittedScore > 1) {
            strPoint = this.strings.points;
         }
         message = this.strings.scoreObtained + ' <span id="answerScore">' + this.submittedScore + " " + strPoint + " " + this.strings.outOf + " " + maxScoreLevel + ".</span><br/>";
         if (this.hideScoreDetails) {
         } else if (this.hasSolution) {
            message += this.strings.contestOverAnswerNotSaved;
            if (this.prevSavedScore !== undefined) {
               showRetrieveAnswer = true;
            }
         } else {
            var prevScore = this.prevLevelsScores[this.taskLevel];
            if (this.prevSavedScore !== undefined) {
               if (this.submittedScore > prevScore) {
                  if (this.submittedScore < maxScoreLevel) {
                     if (this.taskLevel == "hard") {
                        message += this.strings.tryToDoBetterOrChangeTask;
                     } else {
                        message += this.strings.tryToDoBetterOrMoveToNextLevel;
                     }
                  } else if (this.taskLevel == "hard") {
                     message += this.strings.bestPossibleScoreCongrats;
                  } else {
                     message += this.strings.forMorePointsMoveToNextLevel;
                  }
               } else if (this.submittedScore < prevScore) {
                  message += this.strings.youDidBetterBefore;
                  showRetrieveAnswer = true;
               }
               else {
                  message += this.strings.scoreStays2;
               }
            }
         }
      }
      if (showRetrieveAnswer) {
         message += ' <a href="#" onclick="displayHelper.retrieveAnswer(); return false;">' + this.strings.reloadBestAnswer + '</a>';
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
      var strValidate = this.strings.validate;
      if (this.customValidateString != undefined) {
         strValidate = this.customValidateString;
      }
      switch (taskMode) {
         case 'saved_unchanged':
            if (this.graderMessage !== "") {
               if (!this.hideValidateButton && !this.hasSolution) {
                  return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" ' +
                     disabledStr + '/>';
               }
            }
            break;
         case 'unsaved_unchanged':
         case 'unsaved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="' + this.strings.gradeThisAnswer + '" onclick="displayHelper.validate(\'test\');" ' +
                     disabledStr + '/>';
               } else {
                  return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" ' +
                     disabledStr + '/>';
               }
            }
            break;
         case 'saved_changed':
            if (!this.hideValidateButton) {
               if (this.hasSolution) {
                  return '<input type="button" value="' + this.strings.gradeThisAnswer + '" onclick="displayHelper.validate(\'test\');" ' +
                     disabledStr + '/>';
               } else {
                  // was: Valider votre nouvelle réponse
                  return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" ' +
                     disabledStr + '/>';
               }
            }
            break;
      }
      return '';
   },

   lastSentHeight: null,
   updateMessages: function() {
      this.initLanguage();
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
            messages.cancel = '<input type="button" value="' + this.strings.restart + '" onclick="displayHelper.restartAll();"' +
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
                  messages.validate = '<input type="button" value="' + this.strings.saveAnswer + '" ' +
                     'onclick="platform.validate(\'done\', function(){})" ' + disabledStr + '/>';
               }
               break;
            case 'saved_unchanged':
               if (!this.hasSolution) {
                  messages.saved = this.formatTranslation(this.strings.answerSavedModifyOrCancelIt,
                     ["<a href='#' onclick=\"platform.validate('cancel', function(){}); return false;\" " + disabledStr + ">" + this.strings.cancelIt + "</a>"]);
               } else {
                  messages.saved = this.formatTranslation(this.strings.answerNotSavedContestOver,
                     ["<a href='#' onclick=\"displayHelper.validate('cancel'); return false;\" " + disabledStr + ">" + this.strings.reloadSubmittedAnswer + "</a>"]);
               }
               break;
            case 'saved_changed':
               messages.saved = "<br/><b style='color: red;'>" + this.strings.warningDifferentAnswerSaved + "</b> " +
                  this.formatTranslation(this.strings.youMay, ["<a href='#' onclick='displayHelper.retrieveAnswer(); return false;'>" + this.strings.reloadIt + "</a>"]);
               if (!this.hideValidateButton) {
                  messages.validate = "<input type='button' value='" + this.strings.saveThisNewAnswer + "' onclick=\"platform.validate('done', function(){})\" " + disabledStr + "/>";
               }
               break;
         }
      }
      for (var type in messages) {
         if (this.loaded && (typeof this.previousMessages[type] === 'undefined' || this.previousMessages[type] !== messages[type])) {
            $('#displayHelper_' + type).html(messages[type]);
            this.previousMessages[type] = messages[type];
         }
      }
      if (this.pointsAsStars && $('#answerScore').length) {
         drawStars('answerScore', this.levelsRanks[this.taskLevel], 20,
            this.levelsScores[this.taskLevel] / this.levelsMaxScores[this.taskLevel], 'normal');
      }
      window.task.getHeight(function(height) {
         if (height != self.lastSentHeight) {
            self.lastSentHeight = height;
            window.platform.updateDisplay({height: height}, function(){});
         }
      });
   },

   getSavedAnswer: function() {
      // Gets the previously saved answer
      var retrievedAnswer;
      if (this.hasLevels) {
         var savedAnswerObj = this.savedAnswer && $.parseJSON(this.savedAnswer);
         if(savedAnswerObj) {
            var retrievedAnswerObj = task.getAnswerObject();
            retrievedAnswerObj[this.taskLevel] = savedAnswerObj[this.taskLevel];
            retrievedAnswer = retrievedAnswerObj[this.taskLevel] && JSON.stringify(retrievedAnswerObj);
         } else {
            retrievedAnswer = null;
         }
      } else {
         retrievedAnswer = this.savedAnswer;
      }
      return retrievedAnswer;
   },
   retrieveAnswer: function() {
      // Loads previously saved answer
      var retrievedAnswer = this.getSavedAnswer();
      if(!retrievedAnswer) {
         this.showPopupMessage(this.strings.noAnswerSaved, 'blanket', this.strings.alright, null, null, "warning");
         return;
      }
      var self = displayHelper;
      task.reloadAnswer(retrievedAnswer, function() {
         self.submittedAnswer = self.savedAnswer;
         self.updateScore(self.savedAnswer, false, function() {});
      });
   },
   hasSavedAnswer: function() {
      // Returns whether a saved answer exists
      if (this.hasLevels) {
         var savedAnswerObj = this.savedAnswer && $.parseJSON(this.savedAnswer);
         if(savedAnswerObj) {
            return !!savedAnswerObj[this.taskLevel];
         }
      } else {
         return !!this.savedAnswer;
      }
      return false;
   },

   sendBestScore: function(callback, scores, messages) {
      var bestLevel = 'easy';
      for (var curLevel in scores) {
         if (scores[bestLevel] <= scores[curLevel]) {
            bestLevel = curLevel;
         }
      }
      callback(scores[bestLevel], messages[bestLevel] + " (" + this.strings["levelVersionName_" + bestLevel] + ")");
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


   if ($('#' + id).length == 0) {
      return;
   }
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

var Beav = new Object();


/**********************************************************************************/
/* Object */

Beav.Object = new Object();

Beav.Object.eq = function eq(x, y) {
   // assumes arguments to be of same type
   var tx = typeof(x);
   var ty = typeof(y);
   if (tx != ty) {
      throw "Beav.Object.eq incompatible types";
   }
   if (tx == "boolean" || tx == "number" || tx == "string" || tx == "undefined") {
      return x == y;
   }
   if ($.isArray(x)) {
      if (! $.isArray(y))
         throw "Beav.Object.eq incompatible types";
      if (x.length != y.length)
         return false;
      for (var i = 0; i < x.length; i++)
         if (! eq(x[i], y[i]))
            return false;
      return true;
   }
   if (tx == "object") {
      var kx = [];
      for (var key in x) {
         kx.push(key);
      }
      var ky = [];
      for (var key in y) {
         ky.push(key);
      }
      var sort_keys = function(n1,n2) { return (n1 < n2) ? -1 : ((n1 > n2) ? 1 : 0); };
      kx.sort(sort_keys);
      ky.sort(sort_keys);
      if (kx.length != ky.length)
         return false;
      for (var i = 0; i < kx.length; i++) {
         var ex = kx[i];
         var ey = ky[i];
         if (ex != ey)
            return false;
         if (! eq(x[ex], y[ex]))
            return false;
      }
      return true;
   }
   throw "Beav.Object.eq unsupported types";
};


/**********************************************************************************/
/* Array */

Beav.Array = new Object();

Beav.Array.make = function(nb, initValue) {
   var t = [];
   for (var i = 0; i < nb; i++)
      t[i] = initValue;
   return t;
};

Beav.Array.init = function(nb, initFct) {
   var t = [];
   for (var i = 0; i < nb; i++)
      t.push(initFct(i));
   return t;
};

Beav.Array.indexOf = function(t, v, eq) {
   if (eq === undefined)
      eq = Beav.Object.eq;
   for (var i = 0; i < t.length; i++)
      if (eq(t[i], v))
         return i;
   return -1;
};

Beav.Array.has = function(t, v, eq) {
   return Beav.Array.indexOf(t, v, eq) != -1;
};

Beav.Array.filterCount = function(t, filterFct) {
   var count = 0;
   for (var i = 0; i < t.length; i++)
      if (filterFct(t[i], i))
         count++;
   return count;
};

Beav.Array.stableSort = function(t, compFct) {
   var swap = function(a, b) {
      var v = t[a];
      t[a] = t[b];
      t[b] = v;
   };
   var insert = function (i, j, v) {
      while(i+1 < j && compFct(t[i+1], v) < 0) {
         swap(i, i+1);
         i++;
      }
      t[i] = v;
   };
   var merge = function(i, k, j) {
      for ( ; i<k; i++) {
         if (compFct(t[k], t[i]) < 0) {
            var v = t[i];
            t[i] = t[k];
            insert(k, j, v);
         }
      }
   };
   var msort = function msort(i, j) {
      var size = j - i;
      if (size < 2)
         return;
      var k = i + Math.floor(size/2);
      msort(i, k);
      msort(k, j);
      merge(i, k, j);
   };
   msort(0, t.length);
};

Beav.Array.shuffle = function(t, randomSeed) {
   var nbValues = t.length;
   for (var iValue = 0; iValue < nbValues; iValue++) {
      // TODO: we should pick the next random number at every step
      // by calling, e.g., randomSeed = RandomGenerator.next(randomSeed);
      var randomShift = randomSeed % (nbValues - iValue);
      var pos = iValue + randomShift;
      var tmp = t[iValue];
      t[iValue] = t[pos];
      t[pos] = tmp;
   }
};


/**********************************************************************************/
/* Matrix */

Beav.Matrix = new Object();

Beav.Matrix.init = function(nbRows, nbCols, initFct) {
   var m = [];
   for (var x = 0; x < nbRows; x++) {
      var t = [];
      for (var y = 0; y < nbCols; y++) {
         t.push(initFct(x, y));
      }
      m.push(t);
   }
   return m;
};

Beav.Matrix.map = function(m, mapFct) {
   var r = [];
   for (var x = 0; x < m.length; x++) {
      r[x] = [];
      for (var y = 0; y < m[x].length; y++) {
         r[x][y] = mapFct(m[x][y], x, y, m);
      }
   }
   return r;
};

Beav.Matrix.copy = function(m) {
   return Beav.Matrix.map(m, function(v) { return v; });
};

Beav.Matrix.make = function(nbRows, nbCols, v) {
   return Beav.Matrix.init(nbRows, nbCols, function() { return v; });
};

Beav.Matrix.forEach = function(m, iterFct) {
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         iterFct(m[x][y], x, y, m);
      }
   }
};

Beav.Matrix.filterCount = function(m, selectFct) {
   var count = 0;
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         if (selectFct(m[x][y], x, y)) {
            count++;
         }
      }
   }
   return count;
};


/**********************************************************************************/
/* Matrix3D */

Beav.Matrix3D = new Object();

Beav.Matrix3D.init = function(nbX, nbY, nbZ, initFct) {
   var m = [];
   for (var x = 0; x < nbX; x++) {
      var t = [];
      for (var y = 0; y < nbY; y++) {
         var r = [];
         for (var z = 0; z < nbZ; z++) {
            r.push(initFct(x, y, z));
         }
         t.push(r);
      }
      m.push(t);
   }
   return m;
};

Beav.Matrix3D.map = function(m, mapFct) {
   var r = [];
   for (var x = 0; x < m.length; x++) {
      r[x] = [];
      for (var y = 0; y < m[x].length; y++) {
         r[x][y] = [];
         for (var z = 0; z < m[x][y].length; z++) {
            r[x][y][z] = mapFct(m[x][y][z], x, y, z, m);
         }
      }
   }
   return r;
};

Beav.Matrix3D.copy = function(m) {
   return Beav.Matrix3D.map(m, function(v) { return v; });
};

Beav.Matrix3D.make = function(nbX, nbY, nbZ, v) {
   return Beav.Matrix3D.init(nbX, nbY, nbZ, function() { return v; });
};

Beav.Matrix3D.forEach = function(m, iterFct) {
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         for (var z = 0; z < m[x][y].length; z++) {
            iterFct(m[x][y][z], x, y, z, m);
         }
      }
   }
};

Beav.Matrix3D.filterCount = function(m, selectFct) {
   var count = 0;
   for (var x = 0; x < m.length; x++) {
      for (var y = 0; y < m[x].length; y++) {
         for (var z = 0; z < m[x][y].length; z++) {
            if (selectFct(m[x][y][z], x, y, z)) {
               count++;
            }
         }
      }
   }
   return count;
};



/**********************************************************************************/
/* Exception */

/* Mechanism for having user exceptions that cannot be confused
   with JavaScript builtin exceptions.

   To throw the exception myExn, do:

      Beav.Exception.throw(myExn);

   To catch only user exceptions, do:

      try {
         ...
      } catch (exn) {
         var myExn = Beav.Exception.extract(exn);
         ...
      }

    In this case, the exception is automatically re-thrown
    if it is not a user exception.

*/
/*
Beav.Exception = {};

Beav.Exception.constructor = function(arg) {
   this.contents = arg;
};

Beav.Exception.throw = function(arg) {
   throw new Beav.Exception.constructor(arg);
};

Beav.Exception.extract = function(exn) {
   if (exn instanceof Beav.Exception.constructor) {
      return exn.contents;
   } else {
      throw exn;
   }
};
*/

/**********************************************************************************/
/* Navigator */

Beav.Navigator = new Object();

Beav.Navigator.isIE8 = function() {
  return navigator.appVersion.indexOf("MSIE 8.") != -1;
}


/**********************************************************************************/
/* Dom */

Beav.Dom = new Object();

Beav.Dom.showOrHide = function(e, visible) {
   if (visible)
      e.show();
   else
      e.hide();
};


/**********************************************************************************/
/* HTML */

Beav.Html = new Object();

// Escape the html characters in a string
Beav.Html.escape = function(stringToEncode) {
   var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;' };
   return String(stringToEncode).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
   });
};


/**********************************************************************************/
/* Raphael */

Beav.Raphael = new Object();

Beav.Raphael.line = function(paper, x1, y1, x2, y2) {
   return paper.path([ "M", x1, y1, "L", x2, y2 ]);
};

Beav.Raphael.lineRelative = function(paper, x1, y1, dx, dy) {
   return Beav.Raphael.line(paper, x1, y1, x1+dx, y1+dy);
};


/**********************************************************************************/
/* Random */

Beav.Random = new Object();

Beav.Random.bit = function(randomSeed, idBit) {
   return (randomSeed & (1 << idBit)) ? 1 : 0;
};


/**********************************************************************************/
/* Task */

Beav.Task = new Object();

Beav.Task.scoreInterpolate = function(minScore, maxScore, minResult, maxResult, result) {
   // requires minResult <= result <= maxResult and minScore <= maxScore
   return Math.round(minScore + (maxScore - minScore) * (result - minResult) / (maxResult - minResult));
};


/**********************************************************************************/
/* Geometry */

Beav.Geometry = new Object();

Beav.Geometry.distance = function(x1,y1,x2,y2) {
   return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
};

/*
   This is used to handle drag on devices that have both a touch screen and a mouse.
   Can be tested on chrome by loading a task in desktop mode, then switching to tablet mode.
   To call instead of element.drag(onMove, onStart, onEnd);
*/
Beav.dragWithTouch = function(element, onMove, onStart, onEnd) {
   var touchingX = 0;
   var touchingY = 0;
   var disabled = false;

   function onTouchStart(evt) {
      if (disabled) {
         return;
      }
      var touches = evt.changedTouches;
      touchingX = touches[0].pageX;
      touchingY = touches[0].pageY;
      onStart(touches[0].pageX, touches[0].pageY, evt);         
   }

   function onTouchEnd(evt) {
      if (disabled) {
         return;
      }
      onEnd(null);
   }
   
   function onTouchMove(evt) {
      if (disabled) {
         return;
      }
      var touches = evt.changedTouches;
      var dx = touches[0].pageX - touchingX;
      var dy = touches[0].pageY - touchingY;
      onMove(dx, dy, touches[0].pageX, touches[0].pageY, evt);
   }
   
   function callOnStart(x,y,event) {
      disabled = true;
      onStart(x,y,event);
   }
   
   function callOnMove(dx,dy,x,y,event) {
      disabled = true;
      onMove(dx,dy,x,y,event);
   }
   
   function callOnEnd(event) {
      disabled = false;
      onEnd(event);
   }

   // element.undrag();
   element.drag(callOnMove,callOnStart,callOnEnd);
   if (element.touchstart) {
      element.touchstart(onTouchStart);
      element.touchend(onTouchEnd);
      element.touchcancel(onTouchEnd);
      element.touchmove(onTouchMove);
   }
}
(function() {

'use strict';

// requires jQuery, and a task object in the global scope.

// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var res = {};

var taskResourcesLoaded = false;

window.implementGetResources = function(task) {
   task.getResources = function(callback)
   {
      if (taskResourcesLoaded) {
         callback(res);
         return;
      }
      res.task = ('task' in res) ? res.task : [{ type: 'html', content: $('#task').html() }];
      res.solution = ('solution' in res) ? res.solution : [{ type: 'html', content: $('#solution').html() }];
      res.grader = [];
      res.task_modules = [];
      res.solution_modules = [];
      res.grader_modules = [];
      if (!res.hints) {
         res.hints = [];
         $('.hint').each(function(index) {
            res.hints[res.hints.length] = [{type: 'html', content: $(this).html() }];
            $(this).attr('hint-Num', res.hints.length-1);
         });
      }
      res.proxy = [];
      res.proxy_modules = [];
      res.display = [];
      res.display_modules = [];
      res.sat = [];
      res.sat_modules = [];
      res.files = [];
      if (!res.title) {
         res.title = $('title').text();
      }
      
      // Resources
      var curDest = 'task';
      var curType = 'javascript';
      $('script, style, link').each(function() {
         if ($(this).hasClass('remove')) {
            return;
         }
         if ($(this).hasClass('solution') && $(this).hasClass('module')) {
            curDest = res.solution_modules;
         }
         else if ($(this).hasClass('solution')) {
            curDest = res.solution;
         }
         else if ($(this).hasClass('grader') && $(this).hasClass('module')) {
            curDest = res.grader_modules;
         }
         else if ($(this).hasClass('grader')) {
            curDest = res.grader;
         }
         else if ($(this).hasClass('hint')) {
            res.hints.push([{ type: 'html', content: $(this).html() }]);
            return;
         }
         else if ($(this).hasClass('proxy') && $(this).hasClass('module')) {
            curDest = res.proxy_modules;
         }
         else if ($(this).hasClass('proxy')) {
            curDest = res.proxy;
         }
         else if ($(this).hasClass('stdButtonsAndMessages') && $(this).hasClass('module')) {
            curDest = res.display_modules;
         }
         else if ($(this).hasClass('stdButtonsAndMessages')) {
            curDest = res.display;
         }
         else if ($(this).hasClass('stdAnswerTypes') && $(this).hasClass('module')) {
            curDest = res.sat_modules;
         }
         else if ($(this).hasClass('stdAnswerTypes')) {
            curDest = res.sat;
         }
         else if ($(this).hasClass('module')) {
            curDest = res.task_modules;
         }
         else {
            curDest = res.task;
         }
         
         if ($(this).is('script')) {
            curType = 'javascript';
         }
         else if ($(this).is('style') || $(this).is('link')) {
            curType = 'css';
         }
         
         if ($(this).attr('src')) {
            curDest.push({ type: curType, url: $(this).attr('src'), id: $(this).attr('id') });
         }
         else if ($(this).attr('href')) {
            curDest.push({ type: curType, url: $(this).attr('href'), id: $(this).attr('id') });
         }
         else {
            curDest.push({ type: curType, id: $(this).attr('id'), content: $(this).html() });
         }
      });

      // Images
      var images = [];
      var image = '';
      $('#task img').each(function() {
         var src = $(this).attr('src');
         if (src) {
            image = src.toString();
            if ($.inArray(image, images) === -1) {
               res.task.push({ type: 'image', url: image });
               images.push(image);
            }
         }
      });
      fillImages($('#task').html(), images, res.task);
      $('script').each(function() {
         if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
            return;
         }
         fillImages($(this).html(), images, res.task);
      });
      $('#solution img').each(function() {
         image = $(this).attr('src').toString();
         if ($.inArray(image, images) === -1) {
            res.solution.push({ type: 'image', url: image });
            images.push(image);
         }
      });
      fillImages($('#solution').html(), images, res.solution);
      $('.hint').each(function() {
         var hintnum = $(this).attr('hint-num');
         $('[hint-num='+hintnum+'] img').each(function() {
            image = $(this).attr('src').toString();
            if ($.inArray(image, images) === -1) {
               res.hints[hintnum].push({ type: 'image', url: image });
               images.push(image);
            }
         });
         fillImages($(this).html(), images, res.hints[hintnum]);
      });

      // Links
      $('iframe').each(function () {
        var curUrl = $(this).attr('src');
        if(curUrl.indexOf('://') == -1 && curUrl.charAt(0) != '/') {
          res.files.push({ type: this.tagName, url: $(this).attr('src') });
        }
      });

      // Other resources
      $('source, track').each(function() {
        res.files.push({ type: this.tagName, url: $(this).attr('src') });
      });
      $('fioi-video-player').each(function() {
        var fileAttributes = ["data-source", "data-image", "data-subtitles"];
        for(var i=0; i<fileAttributes.length; i++) {
           var curAttr = $(this).attr(fileAttributes[i]);
           curAttr = curAttr ? curAttr.split(';') : [];
           for(var a=0; a<curAttr.length; a++) {
              var curAttrFile = curAttr[a];
              if(curAttrFile && curAttrFile != 'animation' && curAttrFile != 'none') {
                 res.files.push({ type: fileAttributes[i], url: curAttrFile });
              }
           }
        }
      });

      taskResourcesLoaded = true;

      if(window.taskGetResourcesPost) {
        window.taskGetResourcesPost(res, callback);
      } else {
        callback(res);
      }
   };
}

function declareResource(type, resource) {
   if (!res[type]) {
      res[type] = [];
   }
   res[type].push(resource);
}

window.declareTaskResource = declareResource;

var resourcesObjectForRegistration = {};

$(document).ready(function() {
   if (typeof json !== 'undefined') {
      res = json;
   }

   if(window.preprocessingFunctions) {
      for(var i=0; i<window.preprocessingFunctions.length; i++) {
         window.preprocessingFunctions[i]();
      }
   }
   window.preprocessingFunctions = [];

   res.hints = [];
   $('.hint').each(function(index) {
      res.hints[res.hints.length] = [{type: 'html', content: $(this).html() }];
      $(this).attr('hint-num', res.hints.length-1);
   });
   res.task = [{ type: 'html', content: $('#task').html() }];
   res.solution = [{ type: 'html', content: $('#solution').html() }];
   if (window.task) {
      window.implementGetResources(window.task);
      // alias for old code, TODO: remove
      window.getTaskResources = task.getResources;
   }
});


function fillImages(text, images, res) {
   var extensions = ["png", "jpg", "gif", "ttf", "woff", "eot", "mp4", "zip"];
   for (var iExt = 0; iExt < extensions.length; iExt++) {
      var ext = extensions[iExt];
      var regexp = new RegExp("[\'\"]([^;\"\']*." + ext + ")[\'\"]", "g");
      while (true) {
         var match = regexp.exec(text);
         if (!match) {
            break;
         }
         var image = match[1];
         if (image.length <= ext.length + 1) {
            continue;
         }
         if ($.inArray(image, images) === -1) {
            res.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   }
}

})();

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
      ar: {
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

function getLanguageString(key) {
   // Default to english strings
   var ls = languageStrings[window.stringsLanguage] ? languageStrings[window.stringsLanguage] : languageStrings['en'];
   var str = ls[key];
   return str ? str : '';
}

   /*
   * Create custom elements for platformless implementation
   */
   var miniPlatformWrapping = {
      beaver: {
         'header' : '\
            <div id="miniPlatformHeader">\
               <table>\
                  <td><img src="' + (window.modulesPath?window.modulesPath:'../../../_common/modules') + '/img/castor.png" width="60px" style="display:inline-block;margin-right:20px;vertical-align:middle"/></td>\
                  <td><span class="platform">Concours castor</span></td>\
                  <td><a href="http://concours.castor-informatique.fr/" style="display:inline-block;text-align:right;">Le concours Castor</a></td>\
               </table>\
            </div>'
      },
      laptop: {
         'header' : '\
            <div style="width:100%; border-bottom:1px solid #B47238;overflow:hidden">\
               <table style="width:770px;margin: 10px auto;">\
                  <td><img src="' + (window.modulesPath?window.modulesPath:'../../../_common/modules') + '/img/laptop.png" width="60px" style="display:inline-block;margin-right:20px;vertical-align:middle"/></td>\
                  <td><span class="platform">Concours Alkindi</span></td>\
                  <td><a href="http://concours-alkindi.fr/home.html#/" style="display:inline-block;text-align:right;">Le concours Alkindi</a></td>\
               </table>\
            </div>'
      },
      none: {
         'header' : '<span></span>'
      }
   };

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return false;
        }
    }



    if(typeof window.jwt == 'undefined') {
        window.jwt = {
            isDummy: true,
            sign: function() { return null; },
            decode: function(token) { return token; }
            };
    }

    function TaskToken(data, key) {

        this.data = data
        this.data.sHintsRequested = "[]";
        this.key = key

        var query = document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
        this.queryToken = query.sToken;

        this.addHintRequest = function(hint_params, callback) {
            try {
                hint_params = jwt.decode(hint_params).askedHint;
            } catch(e) {}
            var hintsReq = JSON.parse(this.data.sHintsRequested);
            var exists = hintsReq.find(function(h) {
                return h == hint_params;
            });
            if(!exists) {
                hintsReq.push(hint_params);
                this.data.sHintsRequested = JSON.stringify(hintsReq);
            }
            return this.get(callback);
        }

        this.update = function(newData, callback) {
            for(var key in newData) {
                this.data[key] = newData[key];
            }
        }

        this.getToken = function(data, callback) {
            var res = jwt.sign(data, this.key)
            if(callback) {
                // imitate async req
                setTimeout(function() {
                    callback(res)
                }, 0);
            }
            return res;
        }

        this.get = function(callback) {
            if(window.jwt.isDummy && this.queryToken) {
                var token = this.queryToken;
                if(callback) {
                    // imitate async req
                    setTimeout(function() {
                        callback(token)
                    }, 0);
                }
                return token;
            }
            return this.getToken(this.data, callback);
        }

        this.getAnswerToken = function(answer, callback) {
            var answerData = {};
            for(var key in this.data) {
                answerData[key] = this.data[key];
            }
            answerData.sAnswer = answer;
            return this.getToken(answerData, callback);
        }
    }


    function AnswerToken(key) {
        this.key = key
        this.get = function(answer, callback) {
            var res = jwt.sign(answer, this.key)
            if(callback) {
                // imitate async req
                setTimeout(function() {
                    callback(res)
                }, 0)
            }
            return res;
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
      $("#previewScoreMessage").html("<b>" + getLanguageString('showSolution') + " " + score + "/" + maxScore + "</b><br/>" + getLanguageString('showSolution'));
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

var miniPlatformValidate = function(task) { return function(mode, success, error) {
   if (!success) { success = function () { }; }
   if (mode == 'nextImmediate' || mode == 'top' || mode == 'log') {
      return;
   }
   if (mode == 'cancel') {
      alreadyStayed = false;
   }
   if (alreadyStayed || (platform.registered_objects && platform.registered_objects.length > 0)) {
      platform.trigger('validate', [mode]);
      success();
   } else {
      // Try to validate
      task.getAnswer(function (answer) {
         task.gradeAnswer(answer, task_token.getAnswerToken(answer), function (score, message) {
            success();
         })
      });
   }
   if (mode == 'stay') {
      alreadyStayed = true;
   }
}};

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
               var btn = $('<button id="choose-view-'+viewName+'" class="btn btn-default choose-view-button">' + getLanguageString(viewName) + '</button>')
               $("#choose-view").append(btn);
               btn.click(this.selectFactory(viewName));
            }
         }
         */
         $("#grade").remove();
         var btnGradeAnswer = $('<center id="grade"><button class="btn btn-default">' + getLanguageString('gradeAnswer') + '</button></center>');
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

window.task_token = new TaskToken({
   itemUrl: window.location.href,
   randomSeed: Math.floor(Math.random() * 10)
}, demo_key);



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
      $('head').append('<link rel="stylesheet"type="text/css" href="' + (window.modulesPath?window.modulesPath:'../../../_common/modules') + '/integrationAPI.01/official/miniPlatform.css">');
      var platformLoad = function(task) {
         window.task_token.update({id: taskMetaData.id});
         window.answer_token = new AnswerToken(demo_key)

         platform.validate = miniPlatformValidate(task);
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
             /*
            $.post('updateTestToken.php', JSON.stringify({action: 'askHint'}), function(postRes){
               if (success) {success();}
            }, 'json');
            */
            task_token.addHintRequest(hint_params, function(token) {
                task.updateToken(token, function() {})
                success(token)
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
                  $("#task").append("<center id='showSolutionButton'><button type='button' class='btn btn-default' onclick='miniPlatformShowSolution()'>" + getLanguageString('showSolution') + "</button></center>");
                }

                // add branded header to platformless task depending on avatarType
                // defaults to beaver platform branding
                if(window.displayHelper) {
                  if (miniPlatformWrapping[displayHelper.avatarType].header) {
                    $('body').prepend(miniPlatformWrapping[displayHelper.avatarType].header);
                  } else {
                    $('body').prepend(miniPlatformWrapping[beaver].header);
                  }
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
