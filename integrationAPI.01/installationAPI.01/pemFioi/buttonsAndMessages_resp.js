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
   hideSolutionButton: false,
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
   responsive: false,
   mobileMode: false, 
   toggle_task: false,
   headerH: 71,   // in resp mode
   versionHeaderH: [93,93,85,48],  // in resp mode
   footerH: 50,  // in resp mode
   availableH: null, // height for zone_2 in responsive mode
   availableW: null, // width for zone_2 in responsive mode
   layout: 0,  // in resp mode
   taskW: 770,
   taskH: 300,
   newTaskW: 0,
   newTaskH: 0,
   minTaskW: 500,
   maxTaskW: 800,
   verticalScroll: false,
   horizontalScroll: false,

   hasLevels: false,
   pointsAsStars: true, // TODO: false as default
   unlockedLevels: 4,
   forceNextTaskAfter: -1,
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
         tryNextTask: "Nous vous proposons de passer à un autre sujet. S'il vous reste du temps, vous reviendrez plus tard essayer la version suivante.",
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
         lockedLevelDev: "Cette version est normalement verrouillée, et la précédente doit être résolue avant de pouvoir afficher cette version. Comme vous avez chargé ce sujet en local, vous pouvez néanmoins la voir.",
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
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
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
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
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
         version: "Versio ",
         levelVersionName_easy: "helppo versio",
         levelVersionName_medium: "hieman vaikeampi versio",
         levelVersionName_hard: "vaikea versio",
         levelVersionName_easy_stars: "2 tähden versio",
         levelVersionName_medium_stars: "3 tähden versio",
         levelVersionName_hard_stars: "4 tähden versio",
         levelName_easy: "Helppo",
         levelName_medium: "Hieman vaikeampi",
         levelName_hard: "Vaikea",
         warningTimeout: "<p>Huomio: on kulunut jo yli {0} minuuttia siitä, kun aloit tekemään tätä tehtävää.</p><p>Sinun mahdollisesti kannattaisi siirtyä yrittämään jotain toista tehtävää klikkaamalla oikean yläkulman nappia.</p>",
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
         tryToDoBetterOrChangeTask: "Yritä saada vielä paremmat pisteet tai siirry toiseen tehtävään.",
         tryToDoBetterOrMoveToNextLevel: "Yritä saada vielä paremmat pisteet tai siirry saman tehtävän vaikeampaan versioon.",
         bestPossibleScoreCongrats: "Onnittelut: saavutit tehtävän maksimipistemäärän!",
         forMorePointsMoveToNextLevel: "Siirry tehtävän vaikeampaan versioon saadaksesi enemmän pisteitä.",
         youDidBetterBefore: "Sait aiemmin enemmän pisteitä.",
         scoreStays2: "Pistemääräsi säilyy samana.",
         reloadBestAnswer: "Palauta paras aiempi vastauksesi.",
         noAnswerSaved: "Tähän versioon ei ole vielä tallennettu vastausta.",
         validate: "Tarkista vastaus",
         restart: "Aloita alusta",
         harderLevelSolved: "Varoitus: olet jo ratkaissut vaikeamman version tästä tehtävästä. Tämän helpomman version ratkaiseminen ei voi korottaa pistemäärääsi.",
         showLevelAnyway: "Siirry joka tapauksessa.",
         scoreObtained: "Saatu pistemäärä:",
         hardVersionTakesTime: "{0} voi viedä runsaasti aikaa. {1} voi tuottaa pisteitä nopeammin.",
         illKeepThatInMind: "Ymmärrän tämän.",
         harderLevelAvailable: "Huomaa, että voit myös suoraan koittaa ratkaista vaikeampaa versiota tästä tehtävästä.",
         lockedLevel: "Tämä versio on vielä lukittu: ratkaise ensin helpompi versio!",
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
         gradeThisAnswer: "Tarkista vastaus",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Tallenna vastaus",
         answerSavedModifyOrCancelIt: "Vastauksesi on tallennettu. Voit muokata sitä tai {0} ja aloittaa uudelleen alusta.",
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
         enemyWarning: "<strong>Huomio:</strong> tässä tehtävässä tietokone pyrkii varmistamaan, ettet voi löytää ratkaisua sattumalta."
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
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
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
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
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
         warningTimeout: "<p>Atención, ya llevas {0} minutos en esta pregunta.</p><p>Te recomendamos cambiar de tema haciendo click sobre el botón de arriba a la derecha.</p>",
         alright: "De acuerdo",
         moveOn: "Pasar a la siguiente",
         solvedMoveOn: "Has resuelto completamente esta pregunta. Pasa a otra pregunta.",
         confirmRestart: "¿Estás seguro que deseas volver a iniciar esta versión?",
         yes: "Sí",
         no: "No",
         tryHardLevel: "Te recomendamos intentar la versión de 4 estrellas.",
         tryMediumLevel: "Te recomendamos intentar la versión de 3 estrellas.",
         tryNextTask: "Te recomendamos que pases a la siguiente pregunta. Si tienes tiempo, puedes volver más tarde para probar la siguiente versión",
         yourScoreIsNow: "Tu puntuación es ahora :",
         worseScoreStays: "Esto no está tan bien como antes; tu puntuación se mantiene en :",
         scoreStays: "tu puntuación se mantiene igual :",
         score: "Puntuación :",
         noPointsForLevel: "Aún no has recibido puntos en esta versión.",
         outOf: " de ",
         tryToDoBetterOrChangeTask: "Intenta nuevamente para obtener una mejor puntuación, o pasa a la siguiente pregunta.",
         tryToDoBetterOrMoveToNextLevel: "Intenta nuevamente para obtener una mejor puntuación, o pasa a una versión más difícil.",
         bestPossibleScoreCongrats: "Esta es la mejor puntuación posible en este problema, ¡felicitaciones!",
         forMorePointsMoveToNextLevel: "Para obtener más puntos, pasa a una versión más difícil.",
         youDidBetterBefore: "Realizaste un mejor trabajo antes.",
         scoreStays2: "Tu puntuación se mantiene igual.",
         reloadBestAnswer: "Recargar tu mejor respuesta.",
         noAnswerSaved: "Aún no hay respuesta guardada para esta versión.",
         validate: "Validar",
         restart: "Reiniciar",
         harderLevelSolved: "Atención: ya has resuelto una versión más difícil. No puedes ganar puntos extra con esta versión.",
         showLevelAnyway: "Mostrar el nivel de igual manera",
         scoreObtained: "Puntuación obtenida:",
         hardVersionTakesTime: "Resolver una {0} puede tomar mucho tiempo; te aconsejamos priorizar el resolver las preguntas en {1} para ganar puntos más rápidamente.",
         illKeepThatInMind: "Lo tendré en mente",
         harderLevelAvailable: "Nota que para esta pregunta, puedes resolver directamente una versión más difícil que esta.",
         lockedLevel: "Esta versión está bloqueada. Resuelve la version anterior para verla.",
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
         gradeThisAnswer: "Evaluar esta respuesta",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Guardar tu respuesta",
         answerSavedModifyOrCancelIt: "Tu respuesta fue guardada. Puedes modificarla, o bien {0} y reiniciar.",
         cancelIt: "cancelarla",
         warningDifferentAnswerSaved: "Atención: una respuesta diferente ha sido guardada.",
         youMay: "Tú puedes {0}.",
         reloadIt: "recargarla",
         saveThisNewAnswer: "Guardar esta nueva respuesta",

         gradingInProgress: "Evaluación en curso",
         scoreIs: "Tu puntuación es:",
         point: "punto",
         points: "puntos",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "La actividad está terminando, tu respuesta no ha sido guardada y tu puntuación se mantiene en:",
         scoreWouldBecome: "Con esta respuesta, tu puntuación será :",
         reloadValidAnswer: "Volver a cargar la respuesta válida.",
         contestOverAnswerNotSaved: "La actividad ha terminado: tu respuesta no fue guardada.",
         scoreWouldStay: "Con esta respuesta, tu puntuación será la misma:",
         answerNotSavedContestOver: "La actividad está terminando y tu respuesta no ha sido guardada. Tú puedes {0}.",
         reloadSubmittedAnswer: "recargar la respuesta que ha enviado",
         difficultyWarning: "<strong>Advertencia:</strong> resolver esta versión toma tiempo.<br/>Puedes resolver más rápidamente las versiones de 2 y 3 estrellas de otros problemas.",
         enemyWarning: "<strong>Advertencia:</strong> en este desafío, la computadora se asegurará que no encuentres la respuesta por casualidad."
      },
      it: {
         version: "Versione",
         levelVersionName_easy: "versione facile",
         levelVersionName_medium: "versione media",
         levelVersionName_hard: "versione difficile",
         levelVersionName_easy_stars: "versione a 2 stelle",
         levelVersionName_medium_stars: "versione a 3 stelle",
         levelVersionName_hard_stars: "versione a 4 stelle",
         levelName_easy: "Facile",
         levelName_medium: "Medio",
         levelName_hard: "Difficile",
         warningTimeout: "<p>Attenzione, sono più di {0} minuti che sei su questa domanda.</p><p>Dovresti cambiare argomento, cliccando sul pulsante in alto a destra.</p>",
         alright: "Va bene",
         moveOn: "Vai avanti",
         solvedMoveOn: "Hai risolto completamente questo quesito, passa a un'altra domanda.",
         confirmRestart: "Sei sicuro di voler ricominciare questa versione ?",
         yes: "Sì",
         no: "No",
         tryHardLevel: "Ti proponiamo di provare la versione 4 stelle.",
         tryMediumLevel: "Ti proponiamo di provare la versione 3 stelle.",
         tryNextTask: "Ti proponiamo di passare all'argomento successivo. Se ti resta del tempo, potrai riprovare più tardi la seguente versione.",
         yourScoreIsNow: "Adesso il tuo punteggio è :",
         worseScoreStays: "Non è buono come prima ; il tuo punteggio rimane :",
         scoreStays: "Il tuo punteggio resta lo stesso :",
         score: "Score :",
         noPointsForLevel: "Non hai ancora punti su questa versione.",
         outOf: " sur ",
         tryToDoBetterOrChangeTask: "Prova a fare di meglio, o passa ad un'altra domanda.",
         tryToDoBetterOrMoveToNextLevel: "Prova a fare di meglio, o passa a una versione più difficile.",
         bestPossibleScoreCongrats: "E' il miglior punteggio possibile su quest'argomento ; congratulazioni !",
         forMorePointsMoveToNextLevel: "Per ottenere più punti, passa a una versione più difficile.",
         youDidBetterBefore: "Sei andato meglio prima.",
         scoreStays2: "Il tuo punteggio resta lo stesso.",
         reloadBestAnswer: "Ricarica la tua miglior risposta.",
         noAnswerSaved: "Nessuna risposta salvata per questa versione.",
         validate: "Convalida",
         restart: "Ricomincia",
         harderLevelSolved: "Attenzione : hai già risolto una versione più difficile. Non potrai più ottenere punti supplementari con questa versione.",
         showLevelAnyway: "Vedi lo stesso",
         scoreObtained: "Score ottenuto :",
         hardVersionTakesTime: "Risolvere una {0} ti può prendere molto tempo ; dai priorità alle risposte alle domande in {1} per guadagnare rapidamente punti.",
         illKeepThatInMind: "Me lo ricorderò",
         harderLevelAvailable: "Si noti che per questa domanda è possibile risolvere direttamente una versione più difficile di questa.",
         lockedLevel: "Questa versione è bloccata. Risolvi la precedente per visualizzarla !",
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
         gradeThisAnswer: "Valuta questa risposta",

         // The following messages are used for tasks with no feedback
         saveAnswer: "Salva la tua risposta",
         answerSavedModifyOrCancelIt: "La sua risposta è stata registrata. Puoi cambiarla, oppure {0} e ricominciare da capo.",
         cancelIt: "annullarla",
         warningDifferentAnswerSaved: "Attenzione : è salvata una risposta diversa.",
         youMay: "Puoi {0}.",
         reloadIt: "ricaricala",
         saveThisNewAnswer: "Salva questa nuova risposta",

         gradingInProgress: "Valutazione in corso",
         scoreIs: "Il tuo punteggio è di :",
         point: "punto",
         points: "punti",
         // The following messages are used when viewing tasks after contest is over
         contestOverScoreStays: "Il concorso è terminato, la tua risposta non è stata salvata e il tuo punteggio è di :",
         scoreWouldBecome: "Con questa risposta, il tuo punteggio sarà :",
         reloadValidAnswer: "Ricarica la risposta convalidata.",
         contestOverAnswerNotSaved: "Il concorso è terminato : la tua risposta non è stata salvata.",
         scoreWouldStay: "Con questa risposta, il tuo punteggio resterà lo stesso :",
         answerNotSavedContestOver: "Il concorso è terminato, la tua risposta non è stata salvata. Puoi {0}.",
         reloadSubmittedAnswer: "ricarica la risposta che hai inviato",
         difficultyWarning: "<strong>Attenzione :</strong> risolvere questa versione richiede del tempo.<br/>Potresti risolvere molto più rapidamente le versioni 2 e 3 stelle di altri argomenti.",
         enemyWarning: "<strong>Attenzione </strong> in questa sfida, il computer ti impedirà di trovare la soluzione per caso."
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
         lockedLevelDev: "This version is normally locked, and the previous version must be solved before displaying this. As you opened this task locally, you can however display this version for testing purposes.",
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
         if(!self.responsive){
            var addTaskHTML = '<div id="displayHelperAnswering" class="contentCentered">';
         }else{
            var addTaskHTML = '<div id="displayHelperAnswering">';
         }
         // Place button placements at the end of HTML if they don't already exist
         if(!self.responsive){
            var placementNames = ['graderMessage', 'validate', 'cancel', 'saved'];
         }else{
            var placementNames = ['graderMessage', 'cancel', 'validate',  'saved'];
         }
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

      if(this.responsive){
         $('#displayHelperAnswering').appendTo($('#zone_3'));
         $('#zone_3').prepend($('<div id="resp_switch_1"><i class="far fa-file-alt"></i><span>ÉNONCÉ</span></div><div id="resp_switch_2"><i class="fas fa-pen"></i><span>EXERCICE</span></div>'));
         $('#zone_3').append($('<div id="showExercice" class="selected"><i class="fas fa-pen"></i><span>EXERCICE</span></div>'));
         $('#zone_3').append($('<div id="showSolution"><i class="fas fa-file-signature"></i><span>SOLUTION</span></div>'));

         // $('#task').append('<span id="error"><i class="fas fa-exclamation-triangle"></i><span id="errorMsg"></span><i class="fas fa-times"></i></span>');
         // console.log('load')

         $('#zone_012').append($('<div id="scroll_arr_up"><i class="fas fa-chevron-up"></i></div>'));
         $('#zone_012').append($('<div id="scroll_arr_down"><i class="fas fa-chevron-down"></i></div>'));
         $('#zone_012').append($('<div id="scroll_arr_left"><i class="fas fa-chevron-left"></i></div>'));
         $('#zone_012').append($('<div id="scroll_arr_right"><i class="fas fa-chevron-right"></i></div>'));

         if(!views.solution || this.hideSolutionButton){
            $('#showExercice, #showSolution').hide();
            $('#zone_3').addClass('noSolution');
         }

         $('#showExercice').click(function(ev) {
            if($(this).hasClass('selected')){
               return
            }
            displayHelper.showSolution(false);
         });
         
         $('#showSolution').click(function(ev) {
            if($(this).hasClass('selected')){
               displayHelper.showSolution(false);
            }else{
               displayHelper.showSolution(true);
            }
         });

         /* switch task in mobile mode */
         $('#resp_switch_1, #resp_switch_2').on('click', function(event) {
            if(!displayHelper.responsive || !displayHelper.mobileMode){
               return
            }
            var id = $(this).attr('id');
            if(id == 'resp_switch_1' && displayHelper.toggle_task){
               displayHelper.toggle_task = false;
            }else if(id == 'resp_switch_2' && !displayHelper.toggle_task){
               displayHelper.toggle_task = true;
            }
            displayHelper.toggleTask();
         });

         $(window).scroll(displayHelper.updateScrollArrows);
         $('#zone_12').scroll(displayHelper.updateScrollArrows);
         $(window).on({
             // 'touchmove': displayHelper.updateScrollArrows
             // function(e) {
             //     console.log(e.target)
             // }
         });

         /* scroll with arrows */
         $('[id^=scroll_arr_]').click(function(ev) {
            var animTime = 200;
            var step = 500;
            var id = $(this).attr('id');
            // console.log(id)
            switch(id){
               case 'scroll_arr_down':
                  var scrollObj = { scrollTop: $(window).scrollTop() + step};
                  break;
               case 'scroll_arr_up':
                  var scrollObj = { scrollTop: $(window).scrollTop() - step};
                  break;
               case 'scroll_arr_left':
                  var scrollObj = { scrollLeft: $(window).scrollLeft() - step};
                  break;
               case 'scroll_arr_right':
                  var scrollObj = { scrollLeft: $(window).scrollLeft() + step};

            }
            $('html, body, #zone_12').animate( scrollObj, animTime );
         });
      }else{
         $('#zone_0 > *').prependTo($('#task'));
         $('#task #tabsContainer').after($('<div id="taskContent"></div>'));
         $('#zone_1, #zone_2').appendTo($('#taskContent'));
         $('#taskCont > *').prependTo($('#zone_2'));
         $('#zone_012, #zone_12, #zone_3, #taskCont').remove();
      }      
      $('#tabsContainer').after('<div id="popupMessage"></div>');

      // console.log(views)
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

   showSolution: function(show) {
      if(show){
         $('#solution').show();
         $('#showSolution').addClass('selected');
         $('#showExercice').removeClass('selected');
      }else{
         $('#solution').hide();
         $('#showSolution').removeClass('selected');
         $('#showExercice').addClass('selected');
      }
   },

   initLevelVars: function() {
      var defaultLevelsRanks = { basic: 1, easy: 2, medium: 3, hard: 4 };
      this.taskLevel = '';
      this.levelsRanks = {};
      this.levelsScores = {};
      this.prevLevelsScores = {};
      for(var i=0; i < this.levels.length; i++) {
         var levelName = this.levels[i];
         if(typeof this.levelsRanks[levelName] == 'undefined') {
            if(i == this.levels.length - 1) {
               // The highest level always gets the max stars
               this.levelsRanks[levelName] = this.maxStars;
            } else {
               this.levelsRanks[levelName] = defaultLevelsRanks[levelName];
            }
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

         if(!this.responsive){
            $('#tabsMenu .li').on('click', function(event) {
               event.preventDefault();
               var newLevel = $(this).children().attr('href').split('#')[1];
               displayHelper.setLevel(newLevel);
            });
         }else{
            $('#zone_0 #tabsMenu .li').on('click', function(event) {
               if(displayHelper.layout == 3){
                  return
               }
               if(displayHelper.responsive && displayHelper.layout == 4){
                  /* click version in resp layout4 */
                  $('.layout_4 #tabsMenuAlt').show();
                  return
               }
               event.preventDefault();
               var newLevel = $(this).children().attr('href').split('#')[1];
               displayHelper.setLevel(newLevel);
               displayHelper.updateTaskDimensions();
               // displayHelper.centerInstructions();
            });
            /* version arrows in mobile mode */
            $('#tabsMenu .resp_version_arr').on('click', function(event) {
               if(!displayHelper.responsive || !displayHelper.mobileMode){
                  return
               }
               event.preventDefault();
               var newLevel = $(this).attr('href').split('#')[1];
               displayHelper.setLevel(newLevel);
               displayHelper.updateTaskDimensions();
               displayHelper.toggleTask();
               // displayHelper.centerInstructions();
            });
            /* click version in resp layout4 */
            $('#tabsMenuAlt [id^=stars_menu_]').click(function() {
               var newLevel = $(this).attr('id').split('stars_menu_')[1];
               $('.layout_4 #tabsMenuAlt').hide();
               displayHelper.setLevel(newLevel);
               displayHelper.updateTaskDimensions();
               displayHelper.toggleTask();
               // displayHelper.centerInstructions();
            });
         }
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
         $('#task h1').append(scoreHTML);
         drawStars('titleStars', this.maxStars, 24, 0, 'normal');
      } else {
         // Disabled: doesn't work with new tabs layout.
         //scoreHTML = '<div class="bestScore">Score retenu : <span id="bestScore">0</span> sur ' + maxScores.hard + '</div>';
         //$('#tabsContainer').append(scoreHTML);
      }

      var tabsStarContainers = [];
      var curLevel;
      // We only render the tabs if there is more than one level ; but we
      // keep tabsMenu as some interfaces depend on that
      var tabsInnerHTML = '';
      var nbLevels = 0;
      var levelNames = [];
      for(var iLevel = 0; iLevel < this.levels.length; iLevel++) {
         var curLevel = this.levels[iLevel];
         nbLevels++;
         levelNames.push(curLevel);
         tabsInnerHTML += '<span class="li ';
         if(iLevel == 0){
            tabsInnerHTML += 'first';
         }else if(iLevel == this.levels.length - 1){
            tabsInnerHTML += 'last';
         }
         tabsInnerHTML += '" id="tab_' + curLevel + '"><a href="#' + curLevel + '">';
         if (this.pointsAsStars) {
            tabsInnerHTML += '<span class="levelLabel">' + this.strings.version.toUpperCase() + '</span><span id="stars_' + this.levelsRanks[curLevel] + '"></span>';
         } else {
            tabsInnerHTML += this.strings["levelName_" + curLevel] + ' — ' +
               '<span id="tabScore_' + curLevel + '">0</span> / ' + maxScores[curLevel];
         }
         tabsInnerHTML += '</a></span>';
      }
      if(nbLevels < 2) { tabsInnerHTML = ''; }
      var tabsHTML = '<div id="tabsMenu">' + tabsInnerHTML + '</div>';
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

      
      if(this.responsive){
         var tabsMenuAlt = '<div id="tabsMenuAlt"><span>'+this.strings.version+' :</span>';
         for (var iLevel = 0; iLevel < levelNames.length; iLevel++) {   // responsive tabs
            var curLevel = levelNames[iLevel];
            var tabHTML = '<div class="resp_tabs">';
            if (this.pointsAsStars) {
               tabHTML += '<span class="levelVersionCont">';
               tabHTML += '<span class="levelLabel">' + this.strings.version.toUpperCase() + '</span><span id="stars_resp_' + this.levelsRanks[curLevel] + '"></span>';
               tabHTML += '<div id="stars_resp_alt_' + this.levelsRanks[curLevel] + '"></div>';
               tabHTML += '</span>';
               // tabsMenuAlt += '<div id="stars_menu_' + this.levelsRanks[curLevel] + '"></div>';
               tabsMenuAlt += '<div id="stars_menu_' + curLevel + '"></div>';
            } else {
               tabHTML += this.strings["levelName_" + curLevel] + ' — ' +
                  '<span id="tabScore_' + curLevel + '">0</span> / ' + maxScores[curLevel];
            }
            tabHTML += '</div>';
            $('#tab_'+curLevel).append(tabHTML);
            if(iLevel > 0){
               $('#tab_'+curLevel+' .resp_tabs').prepend($('<a href="#' + levelNames[iLevel - 1]+'" class="resp_version_arr resp_left_arr"><i class="fas fa-chevron-left"></i></a>'));
            }
            if(iLevel < levelNames.length - 1){
               $('#tab_'+curLevel+' .resp_tabs').append($('<a href="#' + levelNames[iLevel + 1]+'" class="resp_version_arr resp_right_arr"><i class="fas fa-chevron-right"></i></a>'));
            }
         }
         tabsMenuAlt += '</div>';
         $("#tabsContainer").prepend(tabsMenuAlt);

         this.toggleTask();
      }
   },
   toggleTask: function() {
      if(!this.responsive || !this.mobileMode){
         $('#zone_1').show();
         $('#zone_2').show();
         return
      }
      if(!this.toggle_task){
         $('#resp_switch_1').addClass('selected');
         $('#resp_switch_2').removeClass('selected');
         $('#zone_1').css("overflow","visible");
         $('#zone_1').css("height",this.availableH+'px');
         $('#zone_2').css("overflow","hidden");
         $('#zone_2').css("min-height",0);
         $('#zone_2').css("height",0);
         $('#zone_3').addClass('hideButtons');
         this.centerInstructions();
      }else{
         $('#resp_switch_2').addClass('selected');
         $('#resp_switch_1').removeClass('selected');
         $('#zone_2').css("overflow","visible");
         $('#zone_2').css("height","auto");
         $('#zone_2').css("min-height",this.availableH+'px');
         $('#zone_1').css("overflow","hidden");
         $('#zone_1').css("height",0);
         $('#zone_3').removeClass('hideButtons');
      }
      this.updateScrollArrows();
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
      if(this.responsive){
         drawStars('stars_resp_' + starsIdx, starsIdx, 14, rate, mode);
         drawStars('stars_resp_alt_' + starsIdx, starsIdx, 18, rate, mode,true);
         drawStars('stars_menu_' + level, starsIdx, 18, rate, mode,true);
      }
   },

   updateLayout: function() {
      if (!this.bUseFullWidth) {
         return
      }
      const layout1Breakpoint = this.taskW / 0.6;
      if(!this.responsive){
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
      }else{
         var w = Math.floor(window.innerWidth - this.getScrollbarWidth());
         var h = Math.floor(window.innerHeight);

         $('#task, #main_header').removeClass();
         $('#task').css("height",(h - this.headerH)+'px');
         $('#task').css("margin-top",this.headerH+'px');
         $('#zone_1').css("overflow","visible");
         $('#zone_2').css("overflow","visible");
         // $('#zone_0').height(this.versionHeaderH[this.layout])
         // $('#displayHelperAnswering').appendTo($('#zone_3'));
         // console.log($('#resp_switch_1').length)
         $('#zone_0').height(this.versionHeaderH[this.layout - 1]);
         if(!$('#zone_0 #tabsContainer').length){
            $('#zone_0 h1').after($('#tabsContainer'));
         }
         // $('#zone_1, #zone_2').appendTo($('#zone_12'));
         if(w >= layout1Breakpoint) {
            this.mobileMode = false;
            this.layout = 1;
            this.availableH = h - this.headerH - this.versionHeaderH[this.layout - 1] - this.footerH;
            this.availableW = Math.floor(w*0.7);
            $('#zone_1').height(this.availableH);
            $('#zone_12').css("overflow-x","initial");
         }else if(w >= 800){
            this.mobileMode = false;
            this.layout = 2;
            this.availableW = w;
            $('#zone_1').height('auto');
         }else if(w/h < 1){
            this.mobileMode = true;
            this.layout = 3;
            this.availableH = h - this.headerH - this.versionHeaderH[this.layout - 1] - this.footerH;
            this.availableW = w;
            $('#zone_1').height('auto');
         }else{
            this.mobileMode = true;
            this.layout = 4;
            this.availableH = h - this.headerH - this.versionHeaderH[this.layout - 1];
            this.availableW = w - 50;
            if(!$('#zone_3 #tabsContainer').length){
               $('#tabsContainer').prependTo($('#zone_3'));
            }
         }
         if (this.layout !== 1) {
            $('#zone_12').css("overflow-x","auto");
         }
         $('#task, #main_header').addClass('layout_'+this.layout);
         if(this.layout == 2){   // bug fix
            var zone1H = $('#zone_1').height();
            this.availableH = h - this.headerH - this.versionHeaderH[this.layout - 1] - this.footerH - zone1H;
         }

         this.updateTaskDimensions();
         this.toggleTask();
      }
   },

   getScrollbarWidth: function () {
      // Creating invisible container
      const outer = document.createElement('div');
      outer.style.width = '200px';
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll'; // forcing scrollbar to appear
      outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
      document.body.appendChild(outer);

      // Creating inner element and placing it in the container
      const inner = document.createElement('div');
      outer.appendChild(inner);

      // Calculating difference between container's full width and the child width
      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

      // Removing temporary elements from the DOM
      outer.parentNode.removeChild(outer);

      return scrollbarWidth;
   },

   updateTaskDimensions: function() {
      $('#zone_2').css('min-height',this.availableH);
      var availableRatio = this.availableW/this.availableH;
      var taskRatio = this.taskW/this.taskH;
      if(availableRatio > taskRatio){
         /* H limiting factor */
         var limitingFactor = "H";
         var availableLength = this.availableH;
         var taskLength = this.taskH;
      }else{
         /* W limiting factor */
         var limitingFactor = "W";
         var availableLength = this.availableW;
         var taskLength = this.taskW;
      }
      var scaleFactor = availableLength/taskLength;

      if(limitingFactor == "W"){
         this.newTaskW = Math.max(Math.min(this.taskW,this.availableW),this.taskW*scaleFactor);
      }else{
         this.newTaskW = this.taskW*scaleFactor;
      }
      if(this.newTaskW < this.minTaskW){
         this.newTaskW = this.minTaskW;
      }
      if(this.newTaskW > this.maxTaskW){
         this.newTaskW = this.maxTaskW;
      }
      scaleFactor = this.newTaskW/this.taskW;
      this.newTaskH = this.taskH*scaleFactor;
      this.updateTaskCSS(scaleFactor,limitingFactor);

      if(Math.floor(this.newTaskH) > Math.ceil(this.availableH)){
         $('#zone_3').addClass('vertical_scroll');
         this.verticalScroll = true;
         // console.log(limitingFactor);
         if(limitingFactor == 'H' && this.newTaskW < this.maxTaskW){
            this.newTaskW = Math.min(this.availableW,this.maxTaskW);
            scaleFactor = this.newTaskW/this.taskW;
            this.newTaskH = this.taskH*scaleFactor;
            this.updateTaskCSS(scaleFactor,limitingFactor);
         }
      }else{
         $('#zone_3').removeClass('vertical_scroll');
         this.verticalScroll = false;
      }
      if(Math.floor(this.newTaskW) > Math.ceil(this.availableW)){
         this.horizontalScroll = true;
      }else{
         $('#zone_3').removeClass('vertical_scroll');
         this.horizontalScroll = false;
      }
      this.updateScrollArrows();
      this.centerInstructions();
      // console.log('vertical_scroll :', this.verticalScroll,this.availableH)
   },

   centerInstructions: function() {
      if(this.layout != 2){
         var zone1H = $('#zone_1').height();
         var consigneH = $('#zone_1 > .consigne').height();
         if(zone1H > consigneH){
            $('#zone_1 > .consigne').css('margin-top',(zone1H - consigneH)/2);
         }else{
            $('#zone_1 > .consigne').css('margin-top','20px');
         }
      }else{
         $('#zone_1 > .consigne').css('margin-top','20px');
      }
   },

   updateTaskCSS: function(scaleFactor,limitingFactor) {
      $('#taskCont').width(this.taskW);
      // $('#taskCont').height(newTaskH);
      // console.log(limitingFactor,scaleFactor,this.taskW,this.availableW,newTaskW)
      var fixingOffset = 5;
      $('#taskCont').css('transform','scale('+scaleFactor+')');
      if(scaleFactor >= 1){
         if(this.availableH > this.taskH){
            $('#taskCont').css('margin-top',(this.availableH - this.taskH)/2 - fixingOffset);
         }else{
            if(this.verticalScroll){
               $('#taskCont').css('margin-top',(this.newTaskH - this.taskH)/2 - fixingOffset);
            }else{
               $('#taskCont').css('margin-top',0);
            }
         }
         // console.log(limitingFactor)
         if(limitingFactor == 'W'){
            $('#taskCont').css('margin-left','auto');
            // $('#taskCont').css('margin-left',0);
         }else{
            if(this.verticalScroll){
               $('#taskCont').css('margin-left','auto');
            }else{
               $('#taskCont').css('margin-left',(this.availableW - this.taskW)*scaleFactor/2);
            }
         }
      }else{
         // console.log('scale < 1')
         if(this.availableH > this.taskH){
            $('#taskCont').css('margin-top',(this.availableH - this.taskH/**scaleFactor*/)/2);
         }else{
            if(limitingFactor == 'W'){
               // console.log('cas qui nous occupe',this.taskH < this.availableH);
               if(this.taskH < this.availableH){
                  $('#taskCont').css('margin-top',0);
               }else{
                  // console.log('cas qui nous occupe');
                  $('#taskCont').css('margin-top',-this.newTaskH*(1 - scaleFactor)/2 - fixingOffset);
               }
            }else{
               $('#taskCont').css('margin-top',-this.taskH*(1 - scaleFactor)/2 - fixingOffset);
            }
         }
         // if(this.availableW < this.taskW){
         if(this.availableW < this.taskW){
            // console.log("check",limitingFactor)*scaleFactor
            if(limitingFactor == "W"){
               $('#taskCont').css('margin-left',-this.taskW*(1 - scaleFactor)/2 );
            }else{
               var marginLeft = (this.availableW - this.taskW)/2;
               $('#taskCont').css('margin-left',marginLeft);
            }
         }else{
            $('#taskCont').css('margin-left','auto');
         }
      }
      $('#zone_2').height(Math.max(this.availableH,this.verticalScroll ? this.newTaskH + 60 : this.newTaskH));
      $('#zone_2').width(Math.max(this.availableW,this.newTaskW));
      if(this.layout != 1){
         $('#zone_0').width('100%');
         $('#zone_1').width(Math.max(this.availableW,this.newTaskW));
      }else{
         $('#zone_0').width('100%');
         if(this.newTaskW < this.availableW){
            var w = Math.floor(window.innerWidth - this.getScrollbarWidth());
            var zone2Perc = 100*this.newTaskW/w;
            var zone1Perc = 100 - zone2Perc;
            if(zone2Perc < 60){
               zone2Perc = 60;
               zone1Perc = 40;
            }
            $('#taskCont').css('margin-left','auto');
         }else{
            var zone2Perc = 70;
            var zone1Perc = 30;
         }
         $('#zone_1').width(zone1Perc+'%');
         $('#zone_2').width(zone2Perc+'%');
      }
      if(this.layout == 4 && this.availableW < this.newTaskW){
         $('#zone_2').width(this.newTaskW + 50);
         $('#zone_1').css('padding-right',50);
      }else{
         $('#zone_1').css('padding-right',0);
      }
   },

   updateScrollArrows: function() {
      // console.log('updateScrollArrows')
      // console.log($('body').scrollLeft())
      var layout = displayHelper.layout;
      var topThreshold = displayHelper.versionHeaderH[layout - 1];
      if(layout == 2){
         topThreshold += $('#zone_1').height();
      }
      if(layout >= 3 && $('#resp_switch_1').hasClass('selected')){
         $('[id^=scroll_arr_]').hide();
         return
      }
      if(displayHelper.verticalScroll && $(window).scrollTop() > 0){
         $('#scroll_arr_up').show();
      }else{
         $('#scroll_arr_up').hide();
      }
      // console.log($(window).scrollTop(), displayHelper.newTaskH - displayHelper.availableH)
      if(displayHelper.verticalScroll && $(window).scrollTop() < displayHelper.newTaskH - displayHelper.availableH - 1){
         $('#scroll_arr_down').show();
      }else{
         $('#scroll_arr_down').hide();
      }
      // console.log(displayHelper.horizontalScroll,$('#zone_12').scrollLeft())
      if(displayHelper.horizontalScroll && $('#zone_12').scrollLeft() > 0){
         $('#scroll_arr_left').show();
      }else{
         $('#scroll_arr_left').hide();
      }
      if(displayHelper.horizontalScroll && $('#zone_12').scrollLeft() < displayHelper.newTaskW - displayHelper.availableW){
         $('#scroll_arr_right').show();
      }else{
         $('#scroll_arr_right').hide();
      }
   },

   useFullWidth: function() {
      // TODO: find a clean way to do this
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch(e) {
      }
      $('body').css('width', '100%');
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

   displayLevel: function(newLevel, calledFromSet) {
      // Only displays a level, without requesting a level change to the task
      if(!calledFromSet) {
         this.taskLevel = newLevel;
      }

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
      this.showSolution(false);
   },

   setLevel: function(newLevel, force) {
      // Always make sure we're displaying the level
      this.displayLevel(newLevel, true);

      // Skip actually changing the level if we're already on this level
      if (this.taskLevel == newLevel && !force) {
         return;
      }

      var answer = task.getAnswerObject();
      var state = task.getStateObject();
      state.level = newLevel;
      var self = this;

      var afterReload = function() {
         if(displayHelper.reponsive){
            displayHelper.updateTaskDimensions();
            displayHelper.toggleTask();
         }
         self.submittedScore = self.levelsScores[self.taskLevel];
         self.refreshMessages = true;
         self.checkAnswerChanged();
         self.stopShowingResult();
         if ($('#tab_' + newLevel).hasClass('lockedLevel')) {
            if(window.location.protocol == 'file:') {
               self.showPopupMessage(self.strings.lockedLevelDev, 'tab', self.strings.alright, reload);
            } else {
               self.showPopupMessage(self.strings.lockedLevel, 'lock');
            }
         } else if (!self.hasSolution) {
            if ($('#tab_' + newLevel).hasClass('uselessLevel') && self.levelsScores[newLevel] < self.levelsMaxScores[newLevel]) {
               self.showPopupMessage(self.strings.harderLevelSolved, 'tab', self.strings.showLevelAnyway, reload, null, "warning");
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
                     reload();
                  }
               );
            }
         }
      };

      var reload = function(callback) {
         if(self.reloadWithCallbacks) {
            task.reloadStateObject(state, function() {
               task.reloadAnswerObject(answer, callback);
            });
         }
         else {
            task.reloadStateObject(state, true);
            task.reloadAnswerObject(answer);
            if(callback) { callback(); }
         }
      };

      reload(afterReload);
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
         var maxMaxScore = 0;
         for(var lvl in maxScores) {
            maxMaxScore = Math.max(maxScores[lvl], maxMaxScore);
         }
         drawStars('titleStars', this.maxStars, 24, this.graderScore / maxMaxScore, 'normal');
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
            // Currently displayed level has been unlocked, display it
            if(curLevel == this.taskLevel) {
               this.setLevel(this.taskLevel, true);
            }
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
            if(levelIdx == this.forceNextTaskAfter) {
               // Move onto next task after a specified difficulty
               actionNext = "top";
               fullMessage += this.strings.tryNextTask;
            } else if(!threshold || (threshold && secondsSinceLoaded < threshold)) {
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
            } else if (actionNext == "top") {
               platform.validate("top");
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
      var strValidate = ($('#task[alkindi]').length > 0) ? this.strings.validate : this.strings.validate.toUpperCase();
      if (this.customValidateString != undefined) {
         strValidate = this.customValidateString;
      }
      switch (taskMode) {
         case 'saved_unchanged':
            if (this.graderMessage !== "") {
               if (!this.hideValidateButton && !this.hasSolution) {
                  if(!this.responsive){
                     return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" '+disabledStr + '/>';
                  }else{
                     return '<div onclick="displayHelper.callValidate();"><i class="fas fa-check"></i><span>' + strValidate +'</span></div>';
                  }
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
                  if(!this.responsive){
                     return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" ' + disabledStr + '/>';
                  }else{
                     return '<div onclick="displayHelper.callValidate();"><i class="fas fa-check"></i><span>' + strValidate +'</span></div>';
                  }
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
                  if(!this.responsive){
                     return '<input type="button" value="' + strValidate + '" onclick="displayHelper.callValidate();" ' +  disabledStr + '/>';
                  }else{
                     return '<div onclick="displayHelper.callValidate();"><i class="fas fa-check"></i><span>' + strValidate +'</span></div>';
                  }
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
            var strRestart = ($('#task[alkindi]').length > 0) ? this.strings.restart : this.strings.restart.toUpperCase();
            if(!this.responsive){
               messages.cancel = '<input type="button" value="' + this.strings.restart + '" onclick="displayHelper.restartAll();"' + disabledStr + '/></div>';
            }else{
               messages.cancel = '<div onclick="displayHelper.restartAll();"><i class="fas fa-undo"></i><span>' + strRestart +'</span></div>';
            }
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
      var bestScore = null;
      for (var curLevel in scores) {
         if (bestScore === null || bestScore <= scores[curLevel]) {
            bestLevel = curLevel;
            bestScore = scores[curLevel];
         }
      }
      callback(scores[bestLevel], messages[bestLevel] + " (" + this.strings["levelVersionName_" + bestLevel] + ")");
   },

   displayError: function(msg) {
      if(this.responsive){
         $("#error").html('<i class="fas fa-exclamation-triangle"></i><span id="errorMsg">'+msg+'</span> <i class="fas fa-times"></i>');
         if(msg){
            $("#error").show();
         }else{
            $("#error").hide();
         }
         $('#error i:last-of-type').click(function() {
            $("#error").hide();
         });
      }else{
         $("#displayHelper_graderMessage").html(msg);
      }
   }
};


/*
   draw nbStars stars of width starWidth in element of id id
   fills rate% of them in yellow from the left
   mode is "norma", "locked" or "useless"
*/
function drawStars(id, nbStars, starWidth, rate, mode,layout4) {
   $('#' + id).addClass('stars');
   var starH = starWidth*0.95;
   if(layout4){
      // console.log(id,nbStars,starWidth,rate,mode)
   }
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

   var fillColors = { normal: 'none', locked: '#ddd', useless: '#ced' };
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
   if(!layout4){
      var paper = new Raphael(id, starWidth * nbStars, starH);
   }else{
      var paper = new Raphael(id, 2*starWidth, 2*starH);
   }
   for (var iStar = 0; iStar < nbStars; iStar++) {
      var scaleFactor = starWidth / 100;
      var deltaX, deltaY;
      if(!layout4){
         deltaX = iStar * starWidth;
         deltaY = 0;
      }else{
         switch(nbStars){
            case 1:
               deltaX = starWidth * 0.5;
               deltaY = starH * 0.5;
               break;
            case 2:
               deltaX = iStar*starWidth;
               deltaY = starH * 0.5;
               break;
            case 3:
               if(iStar < 2){
                  deltaX = iStar*starWidth;
                  deltaY = 0;
               }else{
                  deltaX = starWidth * 0.5;
                  deltaY = starH;
               }
               break;
            case 4:
               deltaX = (iStar%2)*starWidth;
               deltaY = Math.floor(iStar/2)*starH;
         }
      }
      var coordsStr = pathFromCoords(starCoords);

      paper.path(coordsStr).attr({
         fill: fillColors[mode],
         stroke: 'none'
      }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ',' + (deltaY / scaleFactor));

      var ratio = Math.min(1, Math.max(0, rate * nbStars  - iStar));
      var xClip = ratio * 100;
      if (xClip > 0) {
         for (var iPiece = 0; iPiece < fullStarCoords.length; iPiece++) {
            var coords = clipPath(fullStarCoords[iPiece], xClip);
            var star = paper.path(pathFromCoords(coords)).attr({
               fill: '#ffc90e',
               stroke: 'none'
            }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ',' + (deltaY / scaleFactor));
         }
      }
      paper.path(coordsStr).attr({
         fill: 'none',
         stroke: strokeColors[mode],
         'stroke-width': 5 * scaleFactor
      }).transform('s' + scaleFactor + ',' + scaleFactor + ' 0,0 t' + (deltaX / scaleFactor) + ',' + (deltaY / scaleFactor));
   }
}


window.platform.subscribe(displayHelper);

})();
