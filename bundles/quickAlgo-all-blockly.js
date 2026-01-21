/*
    utils:
        Various utility functions for all modes.
*/

var getUrlParameter = function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var arrayContains = function(array, needle) {
   for (var index in array) {
      if (needle == array[index]) {
         return true;
      }
   }
   return false;
};

/**
 * This method allow us to verify if the current value is primitive. A primitive is a string or a number or boolean
 * (any value that can be safely compared
 * @param obj The object to check if it is a primitive or not
 * @return {boolean} true if object is primitive, false otherwise
 */
function isPrimitive(obj)
{
    return (obj !== Object(obj));
}

/**
 * THis function allow us to compare two objects. Do not call with {@code null} or {@code undefined}
 * Be careful! Do not use this with circular objects.
 * @param obj1 The first object to compare
 * @param obj2 The second object to compare
 * @return {boolean} true if objects are equals, false otherwise.
 */
function deepEqual(obj1, obj2) {

    if (obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    // if one is primitive and not the other, then we can return false. If both are primitive, then the up
    // comparison can return true
    if (isPrimitive(obj1) || isPrimitive(obj2))
        return false;

    if (Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for (var key in obj1)
    {
        if (!(key in obj2)) return false; //other object doesn't have this prop
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

var highlightPause = false;

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  //e.stopPropagation();
  //e.preventDefault();
}


// from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// where they got it from the stackoverflow-code itself ("formatUnicorn")
if (!String.prototype.format) {
   String.prototype.format = function() {
      var str = this.toString();
      if (!arguments.length)
         return str;
      var args = typeof arguments[0],
          args = (("string" == args || "number" == args) ? arguments : arguments[0]);
      for (var arg in args) {
         str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
      }
      return str;
   }
}


function showModal(id) {
   var el = '#' + id;
   $(el).show();
}
function closeModal(id) {
   var el = '#' + id;
   $(el).hide();
}






// Merges arrays by values
// (Flat-Copy only)
function mergeIntoArray(into, other) {
   for (var iOther in other) {
      var intoContains = false;

      for (var iInto in into) {
         if (other[iOther] == into[iInto]) {
            intoContains = true;
         }
      }

      if (!intoContains) {
         into.push(other[iOther]);
      }
   }
}

// Merges objects into each other similar to $.extend, but
// merges Arrays differently (see above)
// (Deep-Copy only)
function mergeIntoObject(into, other) {
   for (var property in other) {
      if (other[property] instanceof Array) {
         if (!(into[property] instanceof Array)) {
            into[property] = [];
         }
         mergeIntoArray(into[property], other[property]);
      }
      if (other[property] instanceof Object) {
         if (!(into[property] instanceof Object)) {
            into[property] = {};
         }
         mergeIntoObject(into[property], other[property]);
      }
      into[property] = other[property];
   }
}

/*
{ shared: { field1: X }, easy: { field2: Y } } becomes { field1: X, field2: Y } if the current level is easy
{ shared: [X, Y], easy: [Z] }  becomes [X, Y, Z] if the current level is easy
{ easy: X, medium: Y, hard: Z}  becomes X if the current level is easy
*/

function testLevelSpecific() {
   var tests = [
      {
         in: { field1: "X", field2: "Y" },
         out: { field1: "X", field2: "Y" }
      },
      {
            in: { easy: "X", medium: "Y", hard: "Z"},
            out: "X"
      },
      {
          in: { shared: { field1: "X" }, easy: { field2: "Y" } },
          out: { field1: "X", field2: "Y" }
      },
      {
            in: { shared: ["X", "Y"], easy: ["Z"] },
            out: ["X", "Y", "Z"]
      }
   ];
   for (var iTest = 0; iTest < tests.length; iTest++) {
      var res = extractLevelSpecific(tests[iTest].in, "easy");
      if (JSON.stringify(res) != JSON.stringify(tests[iTest].out)) { // TODO better way to compare two objects
         console.error("Test " + iTest + " failed: returned " + JSON.stringify(res));
      }
   }
}



// We need to be able to clean all events

if (Node && Node.prototype.addEventListenerBase == undefined) {
   // IE11 doesn't have EventTarget
   if(typeof EventTarget === 'undefined') {
      var targetPrototype = Node.prototype;
   } else {
      var targetPrototype = EventTarget.prototype;
   }
   targetPrototype.addEventListenerBase = targetPrototype.addEventListener;
   targetPrototype.addEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       this.addEventListenerBase.apply(this, arguments);
       if(!this.EventList[type]) { this.EventList[type] = []; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length; index++)
       {
           if(list[index] === listener) { return; }
       }
       list.push(listener);
   };

   targetPrototype.removeEventListenerBase = targetPrototype.removeEventListener;
   targetPrototype.removeEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       if(listener instanceof Function) { this.removeEventListenerBase.apply(this, arguments); }
       if(!this.EventList[type]) { return; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length;)
       {
           var item = list[index];
           if(!listener)
           {
               this.removeEventListenerBase(type, item);
               list.splice(index, 1); continue;
           }
           else if(item === listener)
           {
               list.splice(index, 1); break;
           }
           index++;
       }
       if(list.length == 0) { delete this.EventList[type]; }
   };
}

function debounce(fn, threshold, wait) {
   var timeout;
   return function debounced() {
      if (timeout) {
         if(wait) {
            clearTimeout(timeout);
         } else {
            return;
         }
      }
      function delayed() {
         fn();
         timeout = null;
      }
      timeout = setTimeout(delayed, threshold || 100);
   }
}

function addInSet(l, val) {
   // Add val to list l if not already present
   if(l.indexOf(val) == -1) {
      l.push(val);
   }
}

// From w3schools.com
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


window.SrlLogger = {
   active: false,
   version: 0
   };

SrlLogger.load = function() {
   SrlLogger.active = true;

   SrlLogger.logMouseInit();
   SrlLogger.logKeyboardInit();
};

SrlLogger.logMouseInit = function() {
   if(SrlLogger.logMouseInitialized) { return; }

   SrlLogger.mouseButtons = {'left': false, 'right': false};

   window.addEventListener('mousedown', SrlLogger.logMouse, true);
   window.addEventListener('mousemove', SrlLogger.logMouse, true);
   window.addEventListener('mouseup', SrlLogger.logMouse, true);

   SrlLogger.logMouseInitialized = true;
};

SrlLogger.logMouse = function(e) {
   if(!SrlLogger.active) { return; }
   if(e.type == 'mousemove' && SrlLogger.mouseMoveIgnore) { return; }

   var state = 'aucun';

   if(e.type == 'mousedown' || e.type == 'mouseup') {
      var newval = e.type == 'mousedown';
      if(e.button === 0) {
         var btn = 'left';
      } else if(e.button === 2) {
         var btn = 'right';
      } else {
         return;
      }
      SrlLogger.mouseButtons[btn] = newval;

      state = btn == 'left' ? 'clic gauche' : 'clic droit';
   }

   if(e.type == 'mousemove') {
      // Throttle mousemove events
      SrlLogger.mouseMoveIgnore = true;
      setTimeout(function () { SrlLogger.mouseMoveIgnore = false; }, 100);

      if(SrlLogger.mouseButtons['left'] || SrlLogger.mouseButtons['right']) {
         state = 'drag';
      }
   }

   var zone = 'task';
   var target = $(e.target);
   var targetParent = null;
   if((targetParent = target.parents('#blocklyLibContent')).length) {
      zone = 'editor';
   } else if((targetParent = target.parents('#gridContainer')).length) {
      zone = 'grid';
   } else if((targetParent = target.parents('.speedControls')).length) {
      zone = 'controls';
   } else {
      targetParent = null;
   }

   var tpx = e.pageX;
   var tpy = e.pageY;

   var win = $(window);
   var winw = win.width();
   var winh = win.height();
   var tpw = winw;
   var tph = winh;
   if(targetParent) {
      var tpo = targetParent.offset();
      tpx -= Math.floor(tpo.left);
      tpy -= Math.floor(tpo.top);
      tpw = Math.floor(targetParent.width());
      tph = Math.floor(targetParent.height());
   }
   var data = {
      'reference': 'souris',
      'version': SrlLogger.version,
      'zone': zone,
      'etat': state,
      'coordonnees_ecran_x': e.screenX,
      'coordonnees_ecran_y': e.screenY,
      'coordonnees_page_x': e.pageX,
      'coordonnees_page_y': e.pageY,
      'coordonnees_zone_x': tpx,
      'coordonnees_zone_y': tpy,
      'dimension_zone_longueur': tpw,
      'dimension_zone_hauteur': tph,
      'dimension_page_longueur': win.width(),
      'dimension_page_hauteur': win.height()
      };

   platform.log(['srl', data]);
};

SrlLogger.logKeyboardInit = function() {
   if(SrlLogger.logKeyboardInitialized) { return; }

   window.addEventListener('keydown', SrlLogger.logKeyboard, true);

   SrlLogger.logKeyboardInitialized = true;
};

SrlLogger.logKeyboard = function(e) {
   if(!SrlLogger.active) { return; }

   var text = e.key;
   var data = {
      'reference': 'clavier',
      'version': SrlLogger.version,
      'touche': text
      };
   platform.log(['srl', data]);
};

SrlLogger.stepByStep = function(subtask, type) {
   if(!SrlLogger.active) { return; }

   var srlType = '';
   if(type == 'play') {
      srlType = subtask.context.actionDelay == 0 ? 'Aller à la fin' : 'Exécution automatique';
   } else if(type == 'step') {
      srlType = 'Exécution Manuelle';
   } else if(type == 'stop') {
      srlType = 'Revenir au début';
   }

   var data = {
      reference: 'pas_a_pas',
      version: SrlLogger.version,
      action: srlType,
      vitesse: subtask.context.infos.actionDelay
      };
   platform.log(['srl', data]);
};

SrlLogger.navigation = function(type) {
   if(!SrlLogger.active) { return; }

   var data = {
      reference: 'navigation',
      version: SrlLogger.version,
      module: type
      };
   platform.log(['srl', data]);
};

SrlLogger.levelLoaded = function(level) {
   if(!SrlLogger.active || SrlLogger.lastLevelLoaded == level) { return; }

   SrlLogger.lastLevelLoaded = level;

   var defaultLevelsRanks = { basic: 1, easy: 2, medium: 3, hard: 4 };
   var version = defaultLevelsRanks[level];
   if(!version) { version = 5; }

   if(version == SrlLogger.version) { return; }

   SrlLogger.version = version;
   SrlLogger.navigation('Exercice');
};

SrlLogger.validation = function(answer, score, error, experimentation) {
   if(!SrlLogger.active) { return; }

   if(error == 'code') {
      error = 'Erreur de prérequis';
   } else if(error == 'execution') {
      error = 'Erreur de solution';
   } else {
      error = 'Aucune';
   }
   var data = {
      reference: 'validation',
      version: SrlLogger.version,
      answer: answer,
      score: score,
      experimentation: experimentation,
      'type_erreur': error
      };
   platform.log(['srl', data]);
};

SrlLogger.modification = function(len, error) {
   if(!SrlLogger.active) { return; }

   if(error == 'code') {
      error = 'Erreur de prérequis';
   } else if(error == 'execution') {
      error = 'Erreur de solution';
   } else {
      error = 'Aucune';
   }
   var data = {
      reference: 'modification',
      version: SrlLogger.version,
      'taille_reponse': len,
      erreur: error
      };
   platform.log(['srl', data]);
};


window.iOSDetected = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

/*
    i18n:
        Translations for the various strings in quickAlgo
*/

var quickAlgoLanguageStrings = {
   fr: {
      categories: {
         actions: "Actions",
         actuator: "Actionneurs",
         sensors: "Capteurs",
         debug: "Débogage",
         colour: "Couleurs",
         data: "Données",
         dicts: "Dictionnaires",
         input: "Entrées",
         lists: "Listes",
         tables: "Tableaux",
         logic: "Logique",
         loops: "Boucles",
         control: "Contrôles",
         operator: "Opérateurs",
         math: "Maths",
         texts: "Texte",
         variables: "Variables",
         functions: "Fonctions",
         read: "Lecture",
         print: "Écriture",
         internet: "Internet",
         display: "Afficher",
      },
      description: {
         if: "Mot clé pour exécuter un bloc d'instructions seulement si une condition est vérifiée",
         else:"Mot clé pour exécuter un bloc d'instructions si la condition spécifiée après un if n'est pas vérifiée",
         elif: "Mot clé pour ajouter une branche à une instruction conditionnelle",
         for: "Mot clé pour répéter un bloc d'instructions un certain nombre de fois",
         while: "Mot clé pour répéter un bloc d'instructions tant qu'une condition est vérifiée",
         not: "Opérateur logique de négation",
         and: "Opérateur logique ET",
         or: "Opérateur logique OU",
         def: "Mot clé pour définir une fonction",
         len: "Fonction qui renvoie la longueur de l'élément passé en paramètre"
         //list, set, _getitem_, _setitem_, lambda, break, continue, setattr, map, split
      },
      controls: {
         backToFirst: 'Réinitialiser',
         playPause: 'Lecture / Pause',
         nextStep: 'Pas-à-pas',
         goToEnd: 'Aller à la fin',
         displaySpeedSlider: 'Modifier la vitesse',
         hideSpeedSlider: 'Cacher le contrôle de vitesse',
         speedSlower: 'Ralentir',
         speedFaster: 'Accélérer'
      },
      exerciseTypeAbout: {
         default: "Sujet propulsé par <a href='http://www.france-ioi.org/'>France-IOI</a>",
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> " +
             "est un projet de <a href='http://www.france-ioi.org/'>France-IOI</a>"
      },
      invalidContent: "Contenu invalide",
      unknownFileType: "Type de fichier non reconnu",
      download: "télécharger",
      smallestOfTwoNumbers: "Plus petit des deux nombres",
      greatestOfTwoNumbers: "Plus grand des deux nombres",
      flagClicked: "Quand %1 cliqué",
      tooManyIterations: "Votre programme met trop de temps à se terminer !",
      tooManyIterationsWithoutAction: "Votre programme s'est exécuté trop longtemps sans effectuer d'action !",
      tooLongExecution: "Votre programme s'exécute très lentement, il est possible qu'il contienne une boucle infinie.",
      submitProgram: "Valider le programme",
      runProgram: "Exécuter sur ce test",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Vitesse :",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Repartir du début",
      stepProgramDesc: "Exécution pas à pas",
      slowSpeedDesc: "Exécuter sur ce test",
      mediumSpeedDesc: "Vitesse moyenne",
      fastSpeedDesc: "Vitesse rapide",
      ludicrousSpeedDesc: "Vitesse très rapide",
      selectLanguage: "Langage :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Repartir de blockly",
      loadExample: "Insérer l'exemple",
      saveOrLoadButton: "Charger / enregistrer",
      saveOrLoadProgram: "Enregistrer ou recharger votre programme :",
      editButton: "Editer",
      editWindowTitle: "Édition d'exercice",
      titleEdition: "Titre :",
      descriptionEdition: "Description :",
      saveAndQuit: "Sauvegarder & Quitter",
      quitWithoutSavingConfirmation: "Quitter sans sauvegarder vos modifications ?",
      about: "À propos",
      license: "License :",
      licenseReserved: "Tous droits réservés.",
      authors: "Auteurs :",
      other: "Autre",
      otherLicense: "Autre license",
      pleaseSpecifyLicense: "Merci de spécifier une license",
      avoidReloadingOtherTask: "Attention : ne rechargez pas le programme d'un autre sujet !",
      files: "Fichiers",
      reloadProgram: "Recharger",
      restart: "Recommencer",
      loadBestAnswer: "Charger ma meilleure réponse",
      saveProgram: "Enregistrer",
      copy: "Copier",
      paste: "Coller",
      blocklyToPython: "Afficher la traduction en Python",
      blocklyToPythonTitle: "Code Python",
      blocklyToPythonIntro: "Le code ci-dessous est l'équivalent dans le langage Python de votre programme Blockly.",
      blocklyToPythonPassComment: '# Insérer des instructions ici',
      svgExport: "Exporter l'affichage au format SVG",
      limitBlocks: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitBlocksOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      limitElements: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitElementsOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      capacityWarning: "Attention : votre programme est invalide car il utilise trop de blocs. Faites attention à la limite de blocs affichée en haut à droite de l'éditeur.",
      clipboardDisallowedBlocks: "Vous ne pouvez pas coller ce programme, car il contient des blocs non autorisés dans cette version.",
      waitBetweenExecutions: "Je me repose. Réfléchissez bien avant d'exécuter un programme différent !",
      previousTestcase: "Précédent",
      nextTestcase: "Suivant",
      allTests: "Tous les tests : ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "Vous utilisez trop de blocs !",
      limitedBlock: "Vous utilisez trop souvent un bloc à utilisation limitée :",
      limitedBlocks: "Vous utilisez trop souvent des blocs à utilisation limitée :",
      uninitializedVar: "Variable non initialisée :",
      undefinedMsg: "Cela peut venir d'un accès à un indice hors d'une liste, ou d'une variable non définie.",
      valueTrue: 'vrai',
      valueFalse: 'faux',
      evaluatingAnswer: 'Évaluation en cours',
      correctAnswer: 'Réponse correcte',
      partialAnswer: 'Réponse améliorable',
      wrongAnswer: 'Réponse incorrecte',
      resultsNoSuccess: "Vous n'avez validé aucun test.",
      resultsPartialSuccess: "Vous avez validé seulement {nbSuccess} test(s) sur {nbTests}.",
      gradingInProgress: "Évaluation en cours",
      introTitle: "Votre mission",
      introDetailsTitle: "Détails de la mission",
      textVariable: "texte",
      listVariable: "liste",
      scaleDrawing: "Zoom ×2",
      loopRepeat: "repeat",
      loopDo: "do",
      loopIteration: "répétition",
      displayVideo: "Afficher la vidéo",
      showDetails: "Plus de détails",
      hideDetails: "Masquer les détails",
      editor: "Éditeur",
      instructions: "Énoncé",
      testLabel: "Test",
      testError: "erreur",
      testSuccess: "validé",
      seeTest: "voir",
      infiniteLoop: "répéter indéfiniment",
      availableFunctions: "Fonctions disponibles : ",
      availableFunctionsVerbose: "Les fonctions disponibles pour contrôler le robot sont :",
      startingLine: "Votre programme doit commencer par la ligne",
      startingLines: "Votre programme doit commencer par les lignes",
      keyword: "mot-clé",
      keywordAllowed: "Le mot-clé suivant est autorisé : ",
      keywordForbidden: "Le mot-clé suivant est interdit : ",
      keywordsAllowed: "Les mots-clés suivants sont autorisés : ",
      keywordsForbidden: "Les mots-clés suivants sont interdits : ",
      variablesAllowed: "Les variables sont autorisées.",
      variablesForbidden: "Les variables sont interdites.",
      readDocumentation: "Vous êtes autorisé(e) à lire de la documentation sur Python et à utiliser un moteur de recherche pendant le concours.",
      autorizedKeyWords: "Mots-clés autorisés : ",
      constant: "constante",
      variable: "variable"
   },
   en: {
      categories: {
         actions: "Actions",
         actuator: "Actuators",
         sensors: "Sensors",
         debug: "Debug",
         colour: "Colors",
         data: "Data",
         dicts: "Dictionaries",
         input: "Input",
         lists: "Lists",
         tables: "Tables",
         logic: "Logic",
         loops: "Loops",
         control: "Controls",
         operator: "Operators",
         math: "Math",
         texts: "Text",
         variables: "Variables",
         functions: "Functions",
         read: "Reading",
         print: "Writing",
      },
      controls: {
         backToFirst: 'Reset',
         playPause: 'Play / Pause',
         nextStep: 'Step-by-step',
         goToEnd: 'Go to end',
         displaySpeedSlider: 'Change speed',
         hideSpeedSlider: 'Hide speed controls',
         speedSlower: 'Slow down',
         speedFaster: 'Speed up'
      },
      exerciseTypeAbout: {
         default: "Task powered by <a href='http://www.france-ioi.org/'>France-IOI</a>",
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> is a project by " +
             "<a href='http://www.france-ioi.org/'>France-IOI</a>"
      },
      invalidContent: "Invalid content",
      unknownFileType: "Unrecognized file type",
      download: "download",
      smallestOfTwoNumbers: "Smallest of the two numbers",
      greatestOfTwoNumbers: "Greatest of the two numbers",
      flagClicked: "When %1 clicked",
      tooManyIterations: "Too many iterations!",
      tooManyIterationsWithoutAction: "Too many iterations without action!",
      tooLongExecution: "Your program is running very slowly, it may contain an infinite loop.",
      submitProgram: "Validate this program",
      runProgram: "Run this program",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Speed:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Restart from the beginning",
      stepProgramDesc: "Step-by-step execution",
      slowSpeedDesc: "Execute on this test",
      mediumSpeedDesc: "Average speed",
      fastSpeedDesc: "Fast speed",
      ludicrousSpeedDesc: "Ludicrous speed",
      selectLanguage: "Language :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generate from blockly",
      loadExample: "Insert example",
      saveOrLoadButton: "Load / save",
      saveOrLoadProgram: "Save or reload your code:",
      editButton: "edit",
      editWindowTitle: "Exercise edition",
      titleEdition: "Title:",
      descriptionEdition: "Description:",
      saveAndQuit: "Save & Quit",
      quitWithoutSavingConfirmation: "Quit without saving your modifications ?",
      about: "About",
      license: "License:",
      licenseReserved: "All rights reserved.",
      authors: "Authors:",
      other: "Other",
      otherLicense: "Other license",
      pleaseSpecifyLicense: "Please specify a license",
      avoidReloadingOtherTask: "Warning: do not reload code for another task!",
      files: "Files",
      reloadProgram: "Reload",
      restart: "Restart",
      loadBestAnswer: "Load best answer",
      saveProgram: "Save",
      copy: "Copy",
      paste: "Paste",
      blocklyToPython: "Convert to Python",
      blocklyToPythonTitle: "Python code",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Insert instructions here',
      svgExport: "Export display as SVG",
      limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available.",
      limitElements: "{remainingBlocks} elements remaining out of {maxBlocks} available.",
      limitElementsOver: "{remainingBlocks} elements over the limit of {maxBlocks} available.",
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",
      clipboardDisallowedBlocks: "You cannot paste this program, as it contains blocks which aren't allowed in this version.",
      waitBetweenExecutions: "Think carefully before starting a different program!",
      previousTestcase: "Previous",
      nextTestcase: "Next",
      allTests: "All tests: ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "You use too many blocks!",
      limitedBlock: "You use too many of a limited use block:",
      limitedBlocks: "You use too many of limited use blocks:",
      uninitializedVar: "Uninitialized variable:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.",
      valueTrue: 'true',
      valueFalse: 'false',
      evaluatingAnswer: 'Evaluation in progress',
      correctAnswer: 'Correct answer',
      partialAnswer: 'Partial answer',
      wrongAnswer: 'Wrong answer',
      resultsNoSuccess: "You passed none of the tests.",
      resultsPartialSuccess: "You passed only {nbSuccess} test(s) of {nbTests}.",
      gradingInProgress: "Grading in process",
      introTitle: "Your mission",
      introDetailsTitle: "Mission details",
      textVariable: "text",
      listVariable: "list",
      scaleDrawing: "Scale 2×",
      loopRepeat: "repeat",
      loopDo: "do",
      loopIteration: "iteration",
      displayVideo: "Display video",
      showDetails: "Show details",
      hideDetails: "Hide details",
      editor: "Editor",
      instructions: "Instructions",
      testLabel: "Test",
      testError: "error",
      testSuccess: "valid",
      seeTest: "see test",
      infiniteLoop: "répéter indéfiniment", // TODO :: translate
      availableFunctions: "Fonctions disponibles : ", // TODO :: translate
      availableFunctionsVerbose: "Les fonctions disponibles pour contrôler le robot sont :", // TODO :: translate
      startingLine: "Votre programme doit commencer par la ligne", // TODO :: translate
      startingLines: "Votre programme doit commencer par les lignes", // TODO :: translate
      keyword: "keyword", // TODO :: verify
      keywordAllowed: "Le mot-clé suivant est autorisé : ", // TODO :: translate
      keywordForbidden: "Le mot-clé suivant est interdit : ", // TODO :: translate
      keywordsAllowed: "Les mots-clés suivants sont autorisés : ", // TODO :: translate
      keywordsForbidden: "Les mots-clés suivants sont interdits : ", // TODO :: translate
      variablesAllowed: "Les variables sont autorisées.", // TODO :: translate
      variablesForbidden: "Les variables sont interdites.", // TODO :: translate
      readDocumentation: "Vous êtes autorisé(e) à lire de la documentation sur Python et à utiliser un moteur de recherche pendant le concours.", // TODO :: translate
      autorizedKeyWords: "Mots-clés autorisés : ", // TODO :: translate,
      constant: "constant", // TODO :: verify
      variable: "variable"
   },
   de: {
      categories: {
         actions: "Aktionen",
         actuator: "Aktoren",
         sensors: "Sensoren",
         debug: "Debug",
         colour: "Farben",
         data: "Daten",
         dicts: "Hash-Map",
         input: "Eingabe",
         lists: "Listen",
         tables: "Tabellen",
         logic: "Logik",
         loops: "Schleifen",
         control: "Steuerung",
         operator: "Operatoren",
         math: "Mathe",
         texts: "Text",
         variables: "Variablen",
         functions: "Funktionen",
         read: "Einlesen",
         print: "Ausgeben",
         manipulate: "Umwandeln",
      },
      exerciseTypeAbout: {
         default: "Task powered by <a href='http://www.france-ioi.org/'>France-IOI</a>", // TODO: translate
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> is a project by " +
             "<a href='http://www.france-ioi.org/'>France-IOI</a>" // TODO: translate
      },
      invalidContent: "Ungültiger Inhalt",
      unknownFileType: "Ungültiger Datentyp",
      download: "Herunterladen",
      smallestOfTwoNumbers: "Kleinere von zwei Zahlen",
      greatestOfTwoNumbers: "Größere von zwei Zahlen",
      flagClicked: "Sobald %1 geklickt", // (scratch start flag, %1 is the flag icon)
      tooManyIterations: "Zu viele Anweisungen wurden ausgeführt!",
      tooManyIterationsWithoutAction: "Zu viele Anweisungen ohne eine Aktion wurden ausgeführt!",
      tooLongExecution: "Ihr Programm läuft sehr langsam, es könnte eine Endlosschleife enthalten.",
      submitProgram: "Speichern, ausführen und bewerten",
      runProgram: "Testen",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
      speed: "Ablaufgeschwindigkeit:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Von vorne anfangen",
      stepProgramDesc: "Schritt für Schritt",
      slowSpeedDesc: "Langsame",
      mediumSpeedDesc: "Mittel",
      fastSpeedDesc: "Schnell",
      ludicrousSpeedDesc: "Sehr schnell",
      selectLanguage: "Sprache:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generiere von Blockly-Blöcken",
      loadExample: "Beispiel einfügen",
      saveOrLoadButton: "Laden / Speichern",
      saveOrLoadProgram: "Speichere oder lade deinen Quelltext:",
      editButton: "Bearbeiten",
      editWindowTitle: "Übungsausgabe",
      titleEdition: "Titel:",
      descriptionEdition: "Beschreibung:",
      saveAndQuit: "Speichern & Beenden",
      quitWithoutSavingConfirmation: "Beenden, ohne deine Änderungen zu speichern?",
      about: "Über",
      license: "Lizenz:",
      licenseReserved: "Alle Rechte vorbehalten.",
      authors: "Autoren :",
      other: "Andere",
      otherLicense: "Andere Lizenz",
      pleaseSpecifyLicense: "Bitte wählen Sie eine Lizenz aus",
      avoidReloadingOtherTask: "Warnung: Lade keinen Quelltext von einer anderen Aufgabe!",
      files: "Dateien",
      reloadProgram: "Laden",
      restart: "Neustarten",
      loadBestAnswer: "Lade beste Lösung",
      saveProgram: "Speichern",
      copy: "Kopieren",
      paste: "Einfügen",
      blocklyToPython: "Konvertiere zu Python",
      blocklyToPythonTitle: "Python-Code",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Befehle hier eingeben',
      svgExport: "Export display as SVG", // TODO :: translate
      limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.",
      limitBlocksOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.",
      limitElements: "Noch {remainingBlocks} von {maxBlocks} Befehle verfügbar.",
      limitElementsOver: "{remainingBlocks} Befehle zusätzlich zum Limit von {maxBlocks} verbraucht.",
      capacityWarning: "Warnung: Dein Programm ist ungültig, weil es zu viele Bausteine verwendet. Beachte das Bausteinlimit oben rechts im Editor.",
      clipboardDisallowedBlocks: "Du kannst dieses Programm nicht einfügen, weil es Bausteine enthält, die in dieser Aufgabe / Version nicht erlaubt sind.",
      waitBetweenExecutions: "Überlege genau, bevor du ein neues Programm startest!",
      previousTestcase: " < ",
      nextTestcase: " > ",
      allTests: "Alle Testfälle: ",
      errorEmptyProgram: "Das Programm enthält keine Befehle. Verbinde die Blöcke um ein Programm zu schreiben.",
      tooManyBlocks: "Du benutzt zu viele Bausteine!",
      limitedBlock: "Du verwendest zu viele Bausteine einer eingeschränkten Sorte:",
      limitedBlocks: "Du verwendest zu viele Bausteine einer eingeschränkten Sorte:",
      uninitializedVar: "Nicht initialisierte Variable:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.",
      valueTrue: 'wahr',
      valueFalse: 'unwahr',
      evaluatingAnswer: 'Wird ausgewertet',
      correctAnswer: 'Richtige Antwort',
      partialAnswer: 'Teilweise richtige Antwort',
      wrongAnswer: 'Falsche Antwort',
      resultsNoSuccess: "Du hast keinen Testfall richtig.",
      resultsPartialSuccess: "Du hast {nbSuccess} von {nbTests} Testfällen richtig.",
      gradingInProgress: "Das Ergebnis wird ausgewertet …",
      introTitle: "Deine Aufgabe",
      introDetailsTitle: "Aufgabenhinweise",
      textVariable: "Text",
      listVariable: "Liste",
      scaleDrawing: "Vergrößere",
      loopRepeat: "wiederhole",
      loopDo: "mache",
      loopIteration: "Wiederholung",
      displayVideo: "Zeige Video",
      showDetails: "Weitere Hinweise",
      hideDetails: "Verstecke Hinweise",
      editor: "Editor",
      instructions: "Anweisungen",
      testLabel: "Test",
      testError: "Fehler",
      testSuccess: "gültig",
      seeTest: "Siehe Test",
      infiniteLoop: "Endlosschleife", 
      availableFunctions: "Verfügbare Funktionen:",
      availableFunctionsVerbose: "Die verfügbaren Funktionen zum Steuern des Roboters sind:",
      startingLine: "Dein Programm muss mit folgender Zeile beginnen:",
      startingLines: "Dein Programm muss mit folgenden Zeilen beginnen",
      keyword: "Schlüsselwort",
      keywordAllowed: "Erlaubtes Schlüsselwort:",
      keywordForbidden: "Nicht erlaubtes Schlüsselwort:",
      keywordsAllowed: "Erlaubte Schlüsselwörter:",
      keywordsForbidden: "Nicht erlaubte Schlüsselwörter:",
      variablesAllowed: "Du darfst Variable verwenden.",
      variablesForbidden: "Du darfst keine Variablen verwenden",
      readDocumentation: "Du darfst die Python-Dokumentation lesen.",
      autorizedKeyWords: "Erlaubte Schlüsselwörter:",
      constant: "Konstante",
      variable: "Variable"
   },
   es: {
      categories: {
         actions: "Acciones",
         actuator: "Actuadores",
         sensors: "Sensores",
         debug: "Depurar",
         colour: "Colores",
         data: "Datos",
         dicts: "Diccionarios",
         input: "Entradas",
         lists: "Listas",
         tables: "Tablas",
         logic: "Lógica",
         loops: "Bucles",
         control: "Control",
         operator: "Operadores",
         math: "Mate",
         texts: "Texto",
         variables: "Variables",
         functions: "Funciones",
         read: "Lectura",
         print: "Escritura",
         internet: "Internet",
         display: "Pantalla",
      },
      exerciseTypeAbout: {
         default: "Task powered by <a href='http://www.france-ioi.org/'>France-IOI</a>", // TODO: translate
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> is a project by " +
             "<a href='http://www.france-ioi.org/'>France-IOI</a>" // TODO: translate
      },
      invalidContent: "Contenido inválido",
      unknownFileType: "Tipo de archivo no reconocido",
      download: "descargar",
      smallestOfTwoNumbers: "El menor de dos números",
      greatestOfTwoNumbers: "El mayor de dos números",
      flagClicked: "Cuando se hace click en %1",
      tooManyIterations: "¡Su programa se tomó demasiado tiempo para terminar!",
      tooManyIterationsWithoutAction: "¡Su programa se tomó demasiado tiempo para terminar!", // TODO :: change translation
      tooLongExecution: "Su programa se ejecuta muy lentamente, puede contener un bucle infinito.",
      submitProgram: "Validar el programa",
      runProgram: "Ejecutar el programa",
      speedSliderSlower: "Más lento",
      speedSliderFaster: "Más rápido",
      speed: "Velocidad:",
      stopProgram: "|<",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Reiniciar desde el principio",
      stepProgramDesc: "Ejecución paso a paso",
      slowSpeedDesc: "Ejecutar en esta prueba",
      mediumSpeedDesc: "Velocidad media",
      fastSpeedDesc: "Velocidad rápida",
      ludicrousSpeedDesc: "Velocidad muy rápida",
      selectLanguage: "Lenguaje:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generar desde blockly",
      loadExample: "Cargar el ejemplo",
      saveOrLoadButton: "Cargar / Guardar",
      saveOrLoadProgram: "Guardar o cargar su programa:",
      editButton: "editar", // TODO: verify
      editWindowTitle: "Edición de ejercicio", // TODO: verify
      titleEdition: "Título:", // TODO: verify
      descriptionEdition: "Descripción:", // TODO: verify
      saveAndQuit: "Sauvegarder & Quitter", // TODO: translate
      quitWithoutSavingConfirmation: "Quitter sans sauvegarder vos modifications ?", // TODO: translate
      about: "À propos", // TODO: translate
      license: "Licencia:", // TODO: verify
      licenseReserved: "Todos los derechos reservados.",
      authors: "Autores:", // TODO: verify
      other: "Otro", // TODO: verify
      otherLicense: "Other license", // TODO: translate
      pleaseSpecifyLicense: "Merci de spécifier une license", // TODO: translate
      avoidReloadingOtherTask: "Atención: ¡no recargue el programa de otro problema!",
      files: "Archivos",
      reloadProgram: "Recargar",
      restart: "Reiniciar",
      loadBestAnswer: "Cargar la mejor respuesta",
      saveProgram: "Guardar",
      copy: "Copiar", // TODO :: translate
      paste: "Pegar",
      blocklyToPython: "Convertir a Python",
      blocklyToPythonTitle: "Python código",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Insertar instrucciones aquí',
      svgExport: "Export display as SVG", // TODO: translate
      limitBlocks: "{remainingBlocks} bloques disponibles de {maxBlocks} autorizados.",
      limitBlocksOver: "{remainingBlocks} bloques sobre el límite de {maxBlocks} autorizados.",
      limitElements: "{remainingBlocks} elementos disponibles de {maxBlocks} autorizados.",
      limitElementsOver: "{remainingBlocks} elementos sobre el límite de {maxBlocks} autorizados.",
      capacityWarning: "Advertencia: tu programa está inválido porque ha utilizado demasiados bloques. Pon atención al límite de bloques permitidos mostrados en la parte superior derecha del editor.",
      clipboardDisallowedBlocks: "No puede pegar este programa, ya que contiene bloques que no están permitidos en esta versión.", 
      waitBetweenExecutions: "Think carefully before starting a different program!",
      previousTestcase: "Anterior",
      nextTestcase: "Siguiente",
      allTests: "Todas las pruebas:",
      errorEmptyProgram: "¡El programa está vacio! Conecta algunos bloques",
      tooManyBlocks: "¡Utiliza demasiados bloques!",
      limitedBlock: "Utiliza demasiadas veces un tipo de bloque limitado:",
      limitedBlocks: "Utiliza demasiadas veces un tipo de bloque limitado:",
      uninitializedVar: "Variable no inicializada:",
      undefinedMsg: "Esto puede ser causado por acceder a un índice fuera de la lista o por una variable no definida.",
      valueTrue: 'verdadero',
      valueFalse: 'falso',
      evaluatingAnswer: 'Evaluación en progreso',
      correctAnswer: 'Respuesta correcta',
      partialAnswer: 'Respuesta parcial',
      wrongAnswer: 'Respuesta Incorrecta',
      resultsNoSuccess: "No pasó ninguna prueba.",
      resultsPartialSuccess: "Pasó únicamente {nbSuccess} prueba(s) de {nbTests}.",
      gradingInProgress: "Evaluación en curso",
      introTitle: "Su misión",
      introDetailsTitle: "Detalles de la misión",
      textVariable: "texto",
      listVariable: "lista",
      scaleDrawing: "Aumentar 2X",
      loopRepeat: "repetir",
      loopDo: "hacer",
      loopIteration: "iteración",
      displayVideo: "Mostrar el video",
      showDetails: "Mostrar más información",
      hideDetails: "Ocultar información",
      editor: "Editor",
      instructions: "Enunciado",
      testLabel: "Caso",
      testError: "error",
      testSuccess: "correcto",
      seeTest: "ver",
      infiniteLoop: "repetir indefinidamente",
      availableFunctions: "Funciones disponibles : ",
      availableFunctionsVerbose: "Las funciones disponibles para controlar el robot son:",
      startingLine: "El programa debe comenzar con la línea",
      startingLines: "Tu programa debe comenzar con las líneas",
      keyword: "palabra clave", // TODO :: verify
      keywordAllowed: "Se permite la siguiente palabra clave: ",
      keywordForbidden: "La siguiente palabra clave está prohibida: ",
      keywordsAllowed: "Se permiten las siguientes palabras clave: ",
      keywordsForbidden: "Las siguientes palabras clave están prohibidas: ",
      variablesAllowd: "Se permiten variables.",
      variablesForbidden: "Las variables están prohibidas.",
      readDocumentation: "Se le permite leer la documentación de Python y utilizar un motor de búsqueda durante el concurso.",
      autorizedKeyWords: "Palabras clave autorizadas: ",
      constant: "constante", // TODO :: verify
      variable: "variable" // TODO :: verify
   },
   sl: {
      categories: {
         actions: "Dejanja",
         actuator: "Pogoni",
         sensors: "Senzorji",
         debug: "Razhroščevanje",
         colour: "Barve",
         dicts: "Slovarji",
         input: "Vnos",
         lists: "Seznami",
         tables: "Tabele",
         logic: "Logika",
         loops: "Zanke",
         control: "Nadzor",
         operator: "Operatorji",
         math: "Matematika",
         texts: "Besedilo",
         variables: "Spremenljivke",
         functions: "Funkcije",
         read: "Branje",
         print: "Pisanje",
         turtle: "Grafika"
      },
      exerciseTypeAbout: {
         default: "Naloga podprta s pomočjo <a href='http://www.france-ioi.org/'>France-IOI</a>", // TODO: verify
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> projekt od " +
             "<a href='http://www.france-ioi.org/'>France-IOI</a>" // TODO: verify
      },
      invalidContent: "Neveljavna vsebina",
      unknownFileType: "Neznana vrsta datoteke",
      download: "prenos",
      smallestOfTwoNumbers: "Manjše od dveh števil",
      greatestOfTwoNumbers: "Večje od dveh števil",
      flagClicked: "Ko je kliknjena %1",
      tooManyIterations: "Preveč ponovitev!",
      tooManyIterationsWithoutAction: "Preveč ponovitev brez dejanja!",
      tooLongExecution: "Vaš program se izvaja zelo počasi, morda vsebuje neskončno zanko.",
      submitProgram: "Oddaj program",
      runProgram: "Poženi program",
      stopProgram: "|<",
      speedSliderSlower: "Počasneje",
      speedSliderFaster: "Hitreje",
      speed: "Hitrost:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Začni znova",
      stepProgramDesc: "Izvajanje po korakih",
      slowSpeedDesc: "Počasi",
      mediumSpeedDesc: "Običajno hitro",
      fastSpeedDesc: "Hitro",
      ludicrousSpeedDesc: "Nesmiselno hitro",
      selectLanguage: "Jezik:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Ustvari iz Blocklyja",
      loadExample: "Naloži primer",
      saveOrLoadButton: "Naloži / Shrani",
      saveOrLoadProgram: "Shrani ali znova naloži kodo:",
      editButton: "Uredi", // TODO: verify
      editWindowTitle: "Izdaja vaje", // TODO: verify
      titleEdition: "Naslov:", // TODO: verify
      descriptionEdition: "Opis:", // TODO: verify
      saveAndQuit: "Shrani in izstopi", // TODO: verify
      quitWithoutSavingConfirmation: "Izstopi brez shranjevanja?", // TODO: verify
      about: "O nas", // TODO: verify
      license: "Licenca:", // TODO: verify
      licenseReserved: "Vse pravice pridržane.",
      authors: "Avtorji:", // TODO: verify
      other: "drugo", // TODO: verify
      otherLicense: "Druge licence", // TODO: verify
      pleaseSpecifyLicense: "Prosim navedite licenco", // TODO: verify
      avoidReloadingOtherTask: "Opozorilo: Za drugo nalogo ne naloži kode znova!",
      files: "Datoteke",
      reloadProgram: "Znova naloži",
      restart: "Ponastavi",
      loadBestAnswer: "Naloži najboljši odgovor",
      saveProgram: "Shrani",
      copy: "Kopiraj", // TODO: verify
      paste: "Prilepi",
      blocklyToPython: "Pretvori v Python",
      blocklyToPythonTitle: "Python koda",
      blocklyToPythonIntro: "Spodnji koda je ekvivalent vašega Blockly programa v jeziku Python.",  // TODO: verify
      blocklyToPythonPassComment: '# Vnesi navodila semkaj',
      svgExport: "Izvozi kot SVG", // TODO: verify
      limitBlocks: "Delčkov na voljo: {remainingBlocks}",
      limitBlocksOver: "{remainingBlocks} delčkov preko meje {maxBlocks}",
      limitElements: "{remainingBlocks} delčkov izmed {maxBlocks} imaš še na voljo.",
      limitElementsOver: "{remainingBlocks} delčkov preko meje {maxBlocks} delčkov, ki so na voljo.",
      capacityWarning: "Opozorilo : program je rešen narobe, uporablja preveliko število delčkov. Bodi pozoren na število delčkov, ki jih lahko uporabiš, informacijo o tem imaš zgoraj.",
      clipboardDisallowedBlocks: "Tega programa ni možno prilepiti, ker vsebuje delčke, ki niso na voljo v tej nalogi.", // TODO : verify
      waitBetweenExecutions: "Dobro premisli preden začneš z novim programom!",
      previousTestcase: "Nazaj",
      nextTestcase: "Naprej",
      allTests: "Vsi testi: ",
      errorEmptyProgram: "Program je prazen! Poveži delčke.",
      tooManyBlocks: "Uporabljaš preveč delčkov!",
      limitedBlock: "Uporabljaš preveliko število omejeneg števila delčkov:",
      limitedBlocks: "Uporabljaš preveliko število omejeneg števila delčkov:",
      uninitializedVar: "Spremenljivka ni določena:",
      undefinedMsg: "Do napake lahko pride, ker je indeks prevelik, ali pa spremenljivka ni definirana.",
      valueTrue: 'resnično',
      valueFalse: 'neresnično',
      evaluatingAnswer: 'Proces preverjanja',
      correctAnswer: 'Pravilni odgovor',
      partialAnswer: 'Delni odgovor',
      wrongAnswer: 'Napačen odgovor',
      resultsNoSuccess: "Noben test ni bil opravljen.",
      resultsPartialSuccess: "Opravljen(ih) {nbSuccess} test(ov) od {nbTests}.",
      gradingInProgress: "Ocenjevanje poteka",
      introTitle: "Naloga",
      introDetailsTitle: "Podrobnosti naloge",
      textVariable: "besedilo",
      listVariable: "tabela",
      scaleDrawing: "Približaj ×2",
      loopRepeat: "ponavljaj", // TODO: verify
      loopDo: "izvedi",
      loopIteration: "ponovitev",
      displayVideo: "Prikaži video",
      showDetails: "Prikaži podrobnosti",
      hideDetails: "Skrij podrobnosti",
      editor: "Urednik",
      instructions: "Navodila",
      testLabel: "Test",
      testError: "napaka",
      testSuccess: "pravilno",
      seeTest: "poglej test",
      infiniteLoop: "neskončna zanka", // TODO : verify
      availableFunctions: "Razpoložljive funkcije: ", // TODO : verify,
      availableFunctionsVerbose: "Razpoložljive funkcije za nadzor junaka:", // TODO : verify,
      startingLine: "Vaš program mora začeti z vrstico", // TODO : verify,
      startingLines: "Vaš program mora začeti z vrsticami", // TODO : verify,
      keyword: "ključna beseda", // TODO :: verify,
      keywordAllowed: "Naslednja ključna beseda je dovoljena: ", // TODO : verify,
      keywordForbidden: "Naslednja ključna beseda je prepovedana: ", // TODO : verify,
      keywordsAllowed: "Naslednje ključne besede so dovoljene: ", // TODO : verify,
      keywordsForbidden: "Naslednje ključne besede so prepovedene: ", // TODO : verify,
      variablesAllowed: "Spremenljivke so dovoljene.", // TODO : verify,
      variablesForbidden: "Spremenljivke niso dovoljene.", // TODO :: verify,
      readDocumentation: "Med tekmovanjem je dovoljeno brati dokumentacijo o Pythonu in uporabljati spletni brskalnik.", // TODO : verify,
      autorizedKeyWords: "Dovoljene ključne besede: ", // TODO : verify,
      constant: "konstanten", // TODO :: verify
      variable: "spremenljivka" // TODO :: verify
   },
   it: {
      categories: {
         actions: "Azioni",
         actuator: "Attuatori",
         sensors: "Sensori",
         debug: "Debug",
         colour: "Colori",
         data: "Dati",
         dicts: "Dizionari",
         input: "Input",
         lists: "Elenchi",
         tables: "Tabelle",
         logic: "Logica",
         loops: "Loop",
         control: "Controlli",
         operator: "Operatori",
         math: "Maths",
         texts: "Testo",
         variables: "Variabili",
         functions: "Funzioni",
         read: "Lettura",
         print: "Stampa",
         internet: "Internet",
         display: "Mostra",
      },
      exerciseTypeAbout: {
         default: "Task powered by <a href='http://www.france-ioi.org/'>France-IOI</a>", // TODO: translate
         "Quick-Pi": "<a href='https://quick-pi.org/'>Quick-Pi</a> is a project by " +
             "<a href='http://www.france-ioi.org/'>France-IOI</a>" // TODO: translate
      },
      invalidContent: "Contenuto non valido",
      unknownFileType: "Tipo di file non riconosciuto",
      download: "scarica",
      smallestOfTwoNumbers: "Più piccolo dei due numeri",
      greatestOfTwoNumbers: "Più grande dei due numeri",
      flagClicked: "Quando %1 cliccato",
      tooManyIterations: "Il tuo programma richiede troppo tempo per arrestarsi!",
      tooManyIterationsWithoutAction: "Il tuo programma è rimasto in funzione troppo a lungo senza intraprendere alcuna azione!",
      tooLongExecution: "Il tuo programma è in esecuzione molto lentamente, potrebbe contenere un ciclo infinito.",
      submitProgram: "Convalida il programma",
      runProgram: "Esegui su questo test",
      stopProgram: "|<",
      speedSliderSlower: "Più lentamente",
      speedSliderFaster: "Più veloce",
      speed: "Velocità:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Partire dall'inizio",
      stepProgramDesc: "Esecuzione passo a passo",
      slowSpeedDesc: "Esegui su questo test",
      mediumSpeedDesc: "Velocità media",
      fastSpeedDesc: "Velocità rapida",
      ludicrousSpeedDesc: "Velocità molto rapida",
      selectLanguage: "Linguaggio:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Importa da blockly",
      loadExample: "Inserisci l'esempio",
      saveOrLoadButton: "Carica / salva",
      saveOrLoadProgram: "Salva o ricarica il tuo programma:",
      editButton: "modificare", // TODO: verify
      editWindowTitle: "Edizione esercizio", // TODO: verify
      titleEdition: "Titolo:", // TODO: verify
      descriptionEdition: "Descrizione:", // TODO: verify
      saveAndQuit: "Sauvegarder & Quitter", // TODO: translate
      quitWithoutSavingConfirmation: "Quitter sans sauvegarder vos modifications ?", // TODO: translate
      about: "À propos", // TODO: Translate
      license: "Licenza:", // TODO: verify
      licenseReserved: "Tutti i diritti riservati.",
      authors: "Autori:", // TODO: verify
      other: "Altro", // TODO: verify
      otherLicense: "Other license", // TODO: translate
      pleaseSpecifyLicense: "Merci de spécifier une license", // TODO: translate
      avoidReloadingOtherTask: "Attenzione: non ricaricare il programma di un altro argomento!",
      files: "File",
      reloadProgram: "Ricarica",
      restart: "Ricomincia",
      loadBestAnswer: "Carica la mia miglior risposta",
      saveProgram: "Salva",
      copy: "Copia",
      paste: "Incolla",
      blocklyToPython: "Mostra la traduzione in Python",
      blocklyToPythonTitle: "Codice Python",
      blocklyToPythonIntro: "Il codice sottostante è l'equivalente in linguaggio Python del tuo programma Blockly.",
      blocklyToPythonPassComment: '# Inserisci delle istruzioni qui',
      svgExport: "Export display as SVG", // TODO: translate
      limitBlocks: "{remainingBlocks} blocchi restati su {maxBlocks} autorizzati.",
      limitBlocksOver: "{remainingBlocks} blocchi utilizzati in eccesso per {maxBlocks} autorizzati.",
      limitElements: "{remainingBlocks} blocchi restanti su {maxBlocks} autorizzati.",
      limitElementsOver: "{remainingBlocks} blocchi utilizzati in eccesso per  {maxBlocks} autorizzati.",
      capacityWarning: "Attenzione: il tuo programma non è valido perché utilizza troppi blocchi. Presta attenzione al limite di blocchi visualizzato nell'angolo in alto a destra dell'editor.",
      clipboardDisallowedBlocks: "Non è possibile incollare questo programma perché contiene blocchi che non sono ammessi in questa versione.",
      waitBetweenExecutions: "Think carefully before starting a different program!",
      previousTestcase: "Precedente",
      nextTestcase: "Seguente",
      allTests: "Tutti i test: ",
      errorEmptyProgram: "Il programma è vuoto! Connetti dei blocchi.",
      tooManyBlocks: "Stai usando troppi blocchi!",
      limitedBlock: "Usi troppo spesso un blocco a uso limitato:",
      limitedBlocks: "Usi troppo spesso un blocco a uso limitato:",
      uninitializedVar: "Variabile non inizializzata:",
      undefinedMsg: "Questo può provenire da un accesso ad un indice fuori da un elenco, o da una variabile non definita.",
      valueTrue: 'vero',
      valueFalse: 'falso',
      evaluatingAnswer: 'Valutazione in corso',
      correctAnswer: 'Risposta corretta',
      partialAnswer: 'Risposta migliorabile',
      wrongAnswer: 'Risposta sbagliata',
      resultsNoSuccess: "Non hai convalidato nessun test.",
      resultsPartialSuccess: "Hai convalidato solo {nbSuccess} test(s) su {nbTests}.",
      gradingInProgress: "Valutazione in corso",
      introTitle: "La tua missione",
      introDetailsTitle: "Dettagli della missione",
      textVariable: "testo",
      listVariable: "elenco",
      scaleDrawing: "Zoom ×2",
      loopRepeat: "repeat",
      loopDo: "do",
      loopIteration: "iterazione",
      displayVideo: "Mostra il video",
      showDetails: "Più dettagli",
      hideDetails: "Nascondi i dettagli",
      editor: "Editor",
      instructions: "Istruzioni",
      testLabel: "Test",
      testError: "errore",
      testSuccess: "convalidato",
      seeTest: "vedi",
      infiniteLoop: "ripeti all'infinito",
      availableFunctions: "Funzioni disponibili: ",
      availableFunctionsVerbose: "Le funzioni disponibili per controllare il robot sono:",
      startingLine: "Il tuo programma dovrebbe iniziare con la frase",
      startingLines: "Il tuo programma dovrebbe iniziare con le frasi",
      keyword: "parola chiave", // TODO :: verify
      keywordAllowed: "La seguente parola-chiave è autorizzata: ",
      keywordForbidden: "La seguente parola chiave è vietata: ",
      keywordsAllowed: "Le seguenti parole-chiave sono autorizzate: ",
      keywordsForbidden: "Le seguenti parole-chiave sono vietate: ",
      variablesAllowed: "Le variabili sono autorizzate.",
      variablesForbidden: "Le variabili sono vietate.",
      readDocumentation: "Sei autorizzato(a) a leggere la documentazione su Python e a utilizzare un motore di ricerca durante il concorso.",
      autorizedKeyWords: "Parole-chiave autorizzate: ",
      constant: "costante", // TODO :: verify
      variable: "variabile" // TODO :: verify
   },
   nl: {
      categories: {
         actions: 'Acties',
         actuator: 'Schakelaars',
         sensors: 'Sensoren',
         debug: 'Debuggen',
         colour: 'Kleuren',
         data: 'Gegevens',
         dicts: 'Woordenboeken',
         input: 'Invoer',
         lists: 'Lijsten',
         tables: 'Tabellen',
         logic: 'Logica',
         loops: 'Lussen',
         control: 'Controles',
         operator: 'Operatoren',
         math: 'Wiskunde',
         texts: 'Tekst',
         variables: 'Variabelen ',
         functions: 'Functies',
         read: 'Lezen ',
         print: 'Schrijven',
         internet: 'Internet',
         display: 'Weergeven'
      },
      description: {
         if: 'Trefwoord om een blok instructies alleen uit te voeren als een voorwaarde is gecontroleerd',
         else: 'Trefwoord voor het uitvoeren van een blok instructies als de voorwaarde opgegeven na een if niet gecontroleerd is',
         elif: 'Trefwoord voor het toevoegen van een vertakking aan een voorwaardelijke instructie',
         for: 'Trefwoord voor het een bepaald aantal keren herhalen van een blok instructies',
         while: 'Trefwoord voor het herhalen van een blok instructies zolang een voorwaarde is gecontroleerd',
         not: 'Logische ontkenningsoperator',
         and: 'Logische operator EN',
         or: 'Logische operator OF',
         def: 'Trefwoord om een functie te definiëren'
      },
      controls: {
         backToFirst: 'Heropstarten',
         playPause: 'Lezen/Pauze',
         nextStep: 'Stap voor stap',
         goToEnd: 'Naar het einde gaan',
         displaySpeedSlider: 'De snelheid wijzigen',
         hideSpeedSlider: 'De snelheidscontrole verbergen',
         speedSlower: 'Vertragen',
         speedFaster: 'Versnellen'
      },
      exerciseTypeAbout: {
         default: "Onderwerp aangedreven door  <a href='http://www.france-ioi.org/'>France-IOI</a>",
         'Quick-Pi': "<a href='https://quick-pi.org/'>Quick-Pi</a> is een project van <a href='http://www.france-ioi.org/'>France-IOI</a>"
      },
      invalidContent: 'Ongeldige inhoud ',
      unknownFileType: 'Bestandstype niet herkend',
      download: 'downloaden',
      smallestOfTwoNumbers: 'Kleinste van de twee getallen',
      greatestOfTwoNumbers: 'Grootste van de twee getallen',
      flagClicked: 'Wanneer %1 geklikt',
      tooManyIterations: 'Het duurt te lang voordat uw programma klaar is!',
      tooManyIterationsWithoutAction: 'Uw programma liep te lang zonder actie te ondernemen!',
      tooLongExecution: 'Uw programma loopt erg langzaam, het kan een oneindige lus bevatten.',
      submitProgram: 'Het programma bevestigen',
      runProgram: 'Uitvoeren op deze test ',
      stopProgram: '|<',
      speedSliderSlower: 'Slower (Trager)',
      speedSliderFaster: '(Sneller)',
      speed: 'Snelheid :',
      stepProgram: '|>',
      slowSpeed: '>',
      mediumSpeed: '>>',
      fastSpeed: '>>>',
      ludicrousSpeed: '>|',
      stopProgramDesc: 'Beginnen bij het begin',
      stepProgramDesc: 'Uitvoering stap voor stap',
      slowSpeedDesc: 'Uitvoeren op deze test',
      mediumSpeedDesc: 'Gemiddelde snelheid',
      fastSpeedDesc: 'Hoge snelheid',
      ludicrousSpeedDesc: 'Zeer hoge snelheid',
      selectLanguage: 'Taal:',
      blocklyLanguage: 'Blockly',
      javascriptLanguage: 'Jacascript',
      importFromBlockly: 'Vertrekken vanaf blockly',
      loadExample: 'Het voorbeeld invoegen',
      saveOrLoadButton: 'Laden/opslaan',
      saveOrLoadProgram: 'Uw programma opslaan of herladen:',
      editButton: 'Bewerken',
      editWindowTitle: 'Bewerken van de oefening',
      titleEdition: 'Titel:',
      descriptionEdition: 'Omschrijving:',
      saveAndQuit: 'Opslaan & afsluiten',
      quitWithoutSavingConfirmation: 'Afsluiten zonder uw wijzigingen op te slaan ?',
      about: 'Over',
      license: 'Licentie:',
      licenseReserved: 'Alle rechten voorbehouden.',
      authors: 'Auteurs:',
      other: 'Andere',
      otherLicense: 'Andere licentie',
      pleaseSpecifyLicense: 'Gelieve een licentie aan te geven',
      avoidReloadingOtherTask: 'Opgelet: herlaad niet het programma van een ander onderwerp !',
      files: 'Bestanden',
      reloadProgram: 'Herladen',
      restart: 'Herbeginnen',
      loadBestAnswer: 'Mijn beste antwoord laden',
      saveProgram: 'Opslaan ',
      copy: 'Kopiëren',
      paste: 'Plakken',
      blocklyToPython: 'De vertaling weergeven in Python',
      blocklyToPythonTitle: 'Code Python',
      blocklyToPythonIntro: 'De onderstaande code is het Python-equivalent van uw Blockly-programma.',
      blocklyToPythonPassComment: '# De instructies hier invoegen',
      svgExport: 'De weergave exporteren naar het formaat SVG',
      limitBlocks: '{remainingBlocks} resterende blokken op {maxBlocks} toegestaan.',
      limitBlocksOver: '{remainingBlocks} te veel gebruikte  blokken voor {maxBlocks} toegestaan.',
      limitElements: '{remainingBlocks} resterende blokken op {maxBlocks} toegestaan.',
      limitElementsOver: '{remainingBlocks} te veel gebruikte blokken voor {maxBlocks} toegestaan.',
      capacityWarning: 'Opgelet: uw programma is ongeldig omdat het te veel blokken gebruikt. Let op de bloklimiet die rechtsboven in de editor wordt weergegeven.',
      clipboardDisallowedBlocks: 'U kan dit programma niet plakken, omdat het blokken bevat die niet zijn toegestaan in deze versie.',
      waitBetweenExecutions: 'Ik rust. Denk goed na voordat je een ander programma uitvoert!',
      previousTestcase: 'Vorige',
      nextTestcase: 'Volgende',
      allTests: 'Alle tests:',
      errorEmptyProgram: 'Het programma is leeg! Verbind de blokken.',
      tooManyBlocks: 'U gebruikt te veel blokken!',
      limitedBlock: 'U gebruikt te vaak een blok met beperkt gebruik:',
      limitedBlocks: 'U gebruikt te vaak blokken met beperkt gebruik:',
      uninitializedVar: 'Niet-geïnitialiseerde variabele :',
      undefinedMsg: 'Dit kan het gevolg zijn van toegang tot een index buiten een lijst of van een ongedefinieerde variabele.',
      valueTrue: 'waar',
      valueFalse: 'onwaar',
      evaluatingAnswer: 'Evaluatie bezig',
      correctAnswer: 'Correct antwoord',
      partialAnswer: 'Verbeterbaar antwoord',
      wrongAnswer: 'Fout antwoord',
      resultsNoSuccess: 'U heeft geen enkele test gevalideerd.',
      resultsPartialSuccess: 'U heeft enkel {nbSuccess} test(s) op {nbTests} gevalideerd.',
      gradingInProgress: 'Evaluatie bezig',
      introTitle: 'Uw missie',
      introDetailsTitle: 'Details van de missie',
      textVariable: 'tekst',
      listVariable: 'lijst ',
      scaleDrawing: 'Zoom x 2',
      loopRepeat: 'repeat (herhaal)',
      loopDo: 'do (doe)',
      loopIteration: 'herhaling',
      displayVideo: 'De video weergeven',
      showDetails: 'Meer details',
      hideDetails: 'De details verbergen',
      editor: 'Uitgever',
      instructions: 'Opgave',
      testLabel: 'Test',
      testError: 'fout  ',
      testSuccess: 'gevalideerd',
      seeTest: 'zien',
      infiniteLoop: 'oneindig herhalen',
      availableFunctions: 'Beschikbare functies:',
      availableFunctionsVerbose: 'De beschikbare functies voor het besturen van de robot zijn:',
      startingLine: 'Uw programma moet beginnen met de regel',
      startingLines: 'Uw programma moet beginnen met de regels',
      keyword: 'trefwoord',
      keywordAllowed: 'Het volgende trefwoord is toegestaan:',
      keywordForbidden: 'Het volgende trefwoord is niet toegestaan:',
      keywordsAllowed: 'De volgende trefwoorden zijn toegestaan:',
      keywordsForbidden: 'De volgende trefwoorden zijn niet toegestaan:',
      variablesAllowed: 'De variabelen zijn toegestaan.',
      variablesForbidden: 'De variabelen zijn niet toegestaan.',
      readDocumentation: 'Het is toegestaan om de Python-documentatie te lezen en een zoekmachine te gebruiken tijdens het examen.',
      autorizedKeyWords: 'Toegestane trefwoorden:',
      constant: 'constante',
      variable: 'variabele'
   }
};


window.stringsLanguage = window.stringsLanguage || "fr";
window.languageStrings = window.languageStrings || {};

function quickAlgoImportLanguage() {
   if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
      return;
   }
   var strings = quickAlgoLanguageStrings[window.stringsLanguage];
   if(!strings) {
      console.error("Language '" + window.stringsLanguage + "' not translated for quickAlgo, defaulting to 'fr'.");
      strings = quickAlgoLanguageStrings.fr;
   }
   // Merge translations
   $.extend(true, window.languageStrings, strings);
}

quickAlgoImportLanguage();

/*
    interface:
        Main interface for quickAlgo, common to all languages.
*/

var quickAlgoInterface = {
   strings: {},
   nbTestCases: 0,
   delayFactory: new DelayFactory(),

   loadInterface: function(context) {
      // Load quickAlgo interface into the DOM
      this.context = context;
      quickAlgoImportLanguage();
      this.strings = window.languageStrings;

      var gridHtml = "<center>";
      gridHtml += "<div id='gridButtonsBefore'></div>";
      gridHtml += "<div id='grid'></div>";
      gridHtml += "<div id='gridButtonsAfter'></div>";
      gridHtml += "</center>";
      $("#gridContainer").html(gridHtml)

      $("#blocklyLibContent").html(
         "<div id='editorBar'>" +
         "  <div id='editorButtons'></div>" +
         "  <div id='capacity'></div>" +
         "</div>" +
         "<div id='languageInterface'></div>" +
         "<div id='saveOrLoadModal' class='modalWrapper'></div>\n");

      // Upper right load buttons
      $("#editorButtons").html(
         "<button type='button' id='displayHelpBtn' class='btn btn-xs btn-default' style='display: none;' onclick='conceptViewer.show()'>" +
         "?" +
         "</button>&nbsp;" +
         "<button type='button' id='loadExampleBtn' class='btn btn-xs btn-default' style='display: none;' onclick='task.displayedSubTask.loadExample()'>" +
         this.strings.loadExample +
         "</button>&nbsp;" +
         "<button type='button' id='saveOrLoadBtn' class='btn btn-xs btn-default' onclick='quickAlgoInterface.saveOrLoad()'>" +
         this.strings.saveOrLoadButton +
         "</button>");

      var saveOrLoadModal = "<div class='modal'>" +
                            "    <p><b>" + this.strings.saveOrLoadProgram + "</b></p>\n" +
                            "    <button type='button' class='btn' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' >" + this.strings.saveProgram +
                            "</button><span id='saveUrl'></span>\n" +
                            "    <p>" + this.strings.avoidReloadingOtherTask + "</p>\n" +
                            "    <p>" + this.strings.reloadProgram + " <input type='file' id='input' " +
                            "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'></p>\n" +
                            "    <button type='button' class='btn close' onclick='closeModal(`saveOrLoadModal`)' >x</button>"
                            "</div>";
      $("#saveOrLoadModal").html(saveOrLoadModal);

      // Buttons from buttonsAndMessages
      var addTaskHTML = '<div id="displayHelperAnswering" class="contentCentered" style="padding: 1px;">';
      var placementNames = ['graderMessage', 'validate', 'saved'];
      for (var iPlacement = 0; iPlacement < placementNames.length; iPlacement++) {
         var placement = 'displayHelper_' + placementNames[iPlacement];
         if ($('#' + placement).length === 0) {
            addTaskHTML += '<div id="' + placement + '"></div>';
         }
      }
      addTaskHTML += '</div>';
      if(!$('#displayHelper_cancel').length) {
         $('body').append($('<div class="contentCentered" style="margin-top: 15px;"><div id="displayHelper_cancel"></div></div>'));
      }

      var scaleControl = '';
      if(context.display && context.infos.buttonScaleDrawing) {
        var scaleControl = '<div class="scaleDrawingControl">' +
            '<label for="scaleDrawing"><input id="scaleDrawing" type="checkbox">' +
            this.strings.scaleDrawing +
            '</label>' +
            '</div>';
      }

      var gridButtonsAfter = scaleControl
        + "<div id='testSelector'></div>";
      if(!this.context || !this.context.infos || !this.context.infos.hideValidate) {
         gridButtonsAfter += ''
            + "<button type='button' id='submitBtn' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>"
            + this.strings.submitProgram
            + "</button><br/>";
      }
      gridButtonsAfter += "<div id='messages'><span id='tooltip'></span><span id='errors'></span></div>" + addTaskHTML;
      $("#gridButtonsAfter").html(gridButtonsAfter);
      $('#scaleDrawing').change(this.onScaleDrawingChange.bind(this));
   },

   bindBlocklyHelper: function(blocklyHelper) {
      this.blocklyHelper = blocklyHelper;
   },

   setOptions: function(opt) {
      // Load options from the task
      var hideControls = opt.hideControls ? opt.hideControls : {};
      $('#saveOrLoadBtn').toggle(!hideControls.saveOrLoad);
      $('#loadExampleBtn').toggle(!!opt.hasExample);
      if(opt.conceptViewer) {
         conceptViewer.load(opt.conceptViewerLang);
         $('#displayHelpBtn').show();
      } else {
         $('#displayHelpBtn').hide();
      }
   },

   appendPythonIntro: function(html) {
      $('#taskIntro').append('<hr class="pythonIntroElement long" />' + html);
   },

   // For compatibility with new interface
   toggleMoreDetails: function(forceNewState) {},
   toggleLongIntro: function(forceNewState) {},

   onScaleDrawingChange: function(e) {
      var scaled = $(e.target).prop('checked');
      $("#gridContainer").toggleClass('gridContainerScaled', scaled);
      $("#blocklyLibContent").toggleClass('blocklyLibContentScaled', scaled);
      this.context.setScale(scaled ? 2 : 1);
   },

   onEditorChange: function() {},
   onResize: function() {},
   updateBestAnswerStatus: function() {},

   blinkRemaining: function(times, red) {
      var capacity = $('#capacity');
      if(times % 2 == 0) {
         capacity.removeClass('capacityRed');
      } else {
         capacity.addClass('capacityRed');
      }
      this.delayFactory.destroy('blinkRemaining');
      if(times > (red ? 1 : 0)) {
         var that = this;
         this.delayFactory.createTimeout('blinkRemaining', function() { that.blinkRemaining(times - 1, red); }, 400);
      }
   },

   displayCapacity: function(info) {
      $('#capacity').html(info.text ? info.text : '');
      if(info.invalid) {
         this.blinkRemaining(11, true);
      } else if(info.warning) {
         this.blinkRemaining(6);
      } else {
         this.blinkRemaining(0);
      }
   },


   initTestSelector: function (nbTestCases) {
      // Create the DOM for the tests display (typically on the left side)
      this.nbTestCases = nbTestCases;

      var buttons = [
         {cls: 'speedStop', label: this.strings.stopProgram, tooltip: this.strings.stopProgramDesc, onclick: 'task.displayedSubTask.stop()'},
         {cls: 'speedStep', label: this.strings.stepProgram, tooltip: this.strings.stepProgramDesc, onclick: 'task.displayedSubTask.step()'},
         {cls: 'speedSlow', label: this.strings.slowSpeed, tooltip: this.strings.slowSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(200)'},
         {cls: 'speedMedium', label: this.strings.mediumSpeed, tooltip: this.strings.mediumSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(50)'},
         {cls: 'speedFast', label: this.strings.fastSpeed, tooltip: this.strings.fastSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(5)'},
         {cls: 'speedLudicrous', label: this.strings.ludicrousSpeed, tooltip: this.strings.ludicrousSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(0)'}
      ];

      var selectSpeed = "<div class='selectSpeed'>" +
                        "  <div class='btn-group'>\n";
      for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
         var btn = buttons[btnIdx];
         selectSpeed += "    <button type='button' class='"+btn.cls+" btn btn-default btn-icon'>"+btn.label+" </button>\n";
      }
      selectSpeed += "  </div></div>";

      var html = '<div class="panel-group">';
      for(var iTest=0; iTest<this.nbTestCases; iTest++) {
         html += '<div id="testPanel'+iTest+'" class="panel panel-default">';
         if(this.nbTestCases > 1) {
            html += '  <div class="panel-heading" onclick="task.displayedSubTask.changeTestTo('+iTest+')"><h4 class="panel-title"></h4></div>';
         }
         html += '  <div class="panel-body">'
              + selectSpeed
              +  '  </div>'
              +  '</div>';
      }
      $('#testSelector').html(html);

      var selectSpeedClickHandler = function () {
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               $('#tooltip').html(btnInfo.tooltip + '<br>');
               eval(btnInfo.onclick);
               break;
            }
         }
      }
      var selectSpeedHoverHandler = function () {
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               $('#tooltip').html(btnInfo.tooltip + '<br>');
               break;
            }
         }
      };
      var selectSpeedHoverClear = function () {
         // Only clear #tooltip if the tooltip was for this button
         var thisBtn = $(this);
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btnInfo = buttons[btnIdx];
            if(thisBtn.hasClass(btnInfo.cls)) {
               if($('#tooltip').html() == btnInfo.tooltip + '<br>') {
                  $('#tooltip').html('');
               }
               break;
            }
         }
      };

      // TODO :: better display functions for #errors
      $('.selectSpeed button').click(selectSpeedClickHandler);
      $('.selectSpeed button').hover(selectSpeedHoverHandler, selectSpeedHoverClear);


      this.updateTestSelector(0);
      this.resetTestScores();
   },

   updateTestScores: function (testScores) {
      // Display test results
      for(var iTest=0; iTest<testScores.length; iTest++) {
         if(!testScores[iTest]) { continue; }
         if(testScores[iTest].successRate >= 1) {
            var icon = '<span class="testResultIcon" style="color: green">✔</span>';
            var label = '<span class="testResult testSuccess">'+this.strings.correctAnswer+'</span>';
         } else if(testScores[iTest].successRate > 0) {
            var icon = '<span class="testResultIcon" style="color: orange">✖</span>';
            var label = '<span class="testResult testPartial">'+this.strings.partialAnswer+'</span>';
         } else {
            var icon = '<span class="testResultIcon" style="color: red">✖</span>';
            var label = '<span class="testResult testFailure">'+this.strings.wrongAnswer+'</span>';
         }
         $('#testPanel'+iTest+' .panel-title').html(icon+' Test '+(iTest+1)+' '+label);
      }
   },

   resetTestScores: function () {
      // Reset test results display
      for(var iTest=0; iTest<this.nbTestCases; iTest++) {
         $('#testPanel'+iTest+' .panel-title').html('<span class="testResultIcon">&nbsp;</span> Test '+(iTest+1));
      }
   },

   updateTestSelector: function (newCurTest) {
      $("#testSelector .panel-body").hide();
      $("#testSelector .panel").removeClass('currentTest');
      $("#testPanel"+newCurTest).addClass('currentTest');
      $("#testPanel"+newCurTest+" .panel-body").prepend($('#grid')).append($('#messages')).show();
   },

   unloadLevel: function() {
      // Called when level is unloaded
      this.resetTestScores();
   },

   saveOrLoad: function () {
      $("#saveOrLoadModal").show();
   },

   displayNotification: function() {
      // Not implemented
   },

   displayError: function(message) {
      message ? $('#errors').html(message) : $('#errors').empty();
   },

   displayResults: function(mainResults, worstResults) {
      this.displayError('<span class="testError">'+mainResults.message+'</span>');
   },

   setPlayPause: function(isPlaying) {}, // Does nothing

   exportCurrentAsPng: function(name) {
      if(typeof window.saveSvgAsPng == 'undefined') {
         throw "Unable to export without save-svg-as-png. Please add 'save-svg-as-png' to the importModules statement.";
      }
      if(!name) { name = 'export.png'; }
      var svgBbox = $('#blocklyDiv svg')[0].getBoundingClientRect();
      var blocksBbox = $('#blocklyDiv svg > .blocklyWorkspace > .blocklyBlockCanvas')[0].getBoundingClientRect();
      var svg = $('#blocklyDiv svg').clone();
      svg.find('.blocklyFlyout, .blocklyMainBackground, .blocklyTrash, .blocklyBubbleCanvas, .blocklyScrollbarVertical, .blocklyScrollbarHorizontal, .blocklyScrollbarBackground').remove();
      var options = {
         backgroundColor: '#FFFFFF',
         top: blocksBbox.top - svgBbox.top - 4,
         left: blocksBbox.left - svgBbox.left - 4,
         width: blocksBbox.width + 8,
         height: blocksBbox.height + 8
         };
      window.saveSvgAsPng(svg[0], name, options);
   },

   updateControlsDisplay: function() {},
   setValidating: function() {}
};

/*
    blockly_blocks:
        Block generation and configuration logic for the Blockly mode
*/

// Sets of blocks
var blocklySets = {
   allDefault: {
      wholeCategories: ["input", "logic", "loops", "math", "texts", "lists", "dicts", "tables", "variables", "functions"]
      },
   allJls: {
      wholeCategories: ["input", "logic", "loops", "math", "texts", "lists", "dicts", "tables", "variables", "functions"],
      excludedBlocks: ['text_eval', 'text_print', 'text_print_noend']
      }
   };


// Blockly to Scratch translations
var blocklyToScratch = {
   singleBlocks: {
      'controls_if': ['control_if'],
      'controls_if_else': ['control_if_else'],
      'controls_infiniteloop': ['control_forever'],
      'controls_repeat': ['control_repeat'],
      'controls_repeat_ext': ['control_repeat'],
      'controls_whileUntil': ['control_repeat_until'],
      'controls_untilWhile': ['control_repeat_until'],
      'lists_repeat': ['data_listrepeat'],
      'lists_create_with_empty': [], // Scratch logic is not to initialize
      'lists_getIndex': ['data_itemoflist'],
      'lists_setIndex': ['data_replaceitemoflist'],
      'logic_negate': ['operator_not'],
      'logic_boolean': [],
      'logic_compare': ['operator_equals', 'operator_gt', 'operator_gte', 'operator_lt', 'operator_lte', 'operator_not'],
      'logic_operation': ['operator_and', 'operator_or'],
      'text': [],
      'text_append': [],
      'text_join': ['operator_join'],
      'math_arithmetic': ['operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide', 'operator_dividefloor'],
      'math_change': ['data_changevariableby'],
      'math_number': ['math_number'],
      'variables_get': ['data_variable'],
      'variables_set': ['data_setvariableto']
   },
   wholeCategories: {
      'loops': 'control',
      'logic': 'operator',
      'math': 'operator'
   }
};

// Allowed blocks that make another block allowed as well
var blocklyAllowedSiblings = {
   'controls_repeat_ext_noShadow': ['controls_repeat_ext'],
   'controls_whileUntil': ['controls_untilWhile'],
   'controls_untilWhile': ['controls_whileUntil'],
   'controls_if_else': ['controls_if'],
   'lists_create_with_empty': ['lists_create_with']
}


function getBlocklyBlockFunctions(maxBlocks, nbTestCases) {
   // TODO :: completely split the logic so it can be a separate object

   return {
      allBlocksAllowed: [],
      blockCounts: {},

      addBlocksAllowed: function(blocks) {
         for(var i=0; i < blocks.length; i++) {
            var name = blocks[i];
            if(arrayContains(this.allBlocksAllowed, name)) { continue; }
            this.allBlocksAllowed.push(name);
            if(blocklyAllowedSiblings[name]) {
               this.addBlocksAllowed(blocklyAllowedSiblings[name]);
            }
         }
      },

      getBlocksAllowed: function() {
         return this.scratchMode ? this.blocksToScratch(this.allBlocksAllowed) : this.allBlocksAllowed;
      },

      getBlockLabel: function(type, addQuotes) {
         // Fetch user-friendly name for the block
         // TODO :: Names for Blockly/Scratch blocks

         if(typeof type != 'string' && type.length > 1) {
            var res = [];
            for(var i = 0; i < type.length; i++) {
               res.push(this.getBlockLabel(type[i], addQuotes));
            }
            return res.join(', ');
         }

         var msg = this.mainContext.strings.label[type];
         msg = msg ? msg : type;
         try {
            msg = msg.toString();
         } catch (e) {
         }
         if (msg.replace) {
            // No idea in which case there would be no msg.replace
            msg = msg.replace(/%\d/g, '_');
         }
         if(addQuotes) {
            msg = '"' + msg + '"';
         }
         return msg;
      },

      checkConstraints: function(workspace) {
         // Check we satisfy constraints
         return this.getRemainingCapacity(workspace) >= 0 && !this.findLimited(workspace);
      },

      normalizeType: function(type) {
         // Clean up type
         var res = type;
         if(res.substr(res.length - 9) == '_noShadow') {
            res = res.substr(0, res.length - 9);
         }
         return res;
      },

      makeLimitedUsesPointers: function() {
         // Make the list of pointers for each block to the limitedUses it
         // appears in
         if(this.limitedPointers && this.limitedPointers.limitedUses === this.mainContext.infos.limitedUses) { return; }
         this.limitedPointers = {
            // Keep in memory the limitedUses these limitedPointers were made for
            limitedUses: this.mainContext.infos.limitedUses
            };
         for(var i=0; i < this.mainContext.infos.limitedUses.length; i++) {
            var curLimit = this.mainContext.infos.limitedUses[i];
            if(this.scratchMode) {
                // Convert block list to Scratch
                var blocks = [];
                for(var j=0; j < curLimit.blocks.length; j++) {
                    var curBlock = curLimit.blocks[j];
                    var convBlockList = blocklyToScratch.singleBlocks[curBlock];
                    if(convBlockList) {
                        for(var k=0; k < convBlockList.length; k++) {
                            addInSet(blocks, this.normalizeType(convBlockList[k]));
                        }
                    } else {
                        addInSet(blocks, this.normalizeType(curBlock));
                    }
                }
            } else {
                var blocks = curLimit.blocks;
            }

            for(var j=0; j < blocks.length; j++) {
                var block = blocks[j];
                if(!this.limitedPointers[block]) {
                    this.limitedPointers[block] = [];
                }
                this.limitedPointers[block].push(i);
            }
         }
      },

      findLimited: function(workspace) {
         // Check we don't use blocks with limited uses too much
         // Returns false if there's none, else the name of the first block
         // found which is over the limit
         if(!this.mainContext.infos || !this.mainContext.infos.limitedUses) { return false; }
         this.makeLimitedUsesPointers();

         var workspaceBlocks = workspace.getAllBlocks();
         var usesCount = {};

         for(var i = 0; i < workspaceBlocks.length; i++) {
            var blockType = workspaceBlocks[i].type;
            blockType = this.normalizeType(blockType);
            if(!this.limitedPointers[blockType]) { continue; }
            for(var j = 0; j < this.limitedPointers[blockType].length; j++) {
                // Each pointer is a position in the limitedUses array that
                // this block appears in
                var pointer = this.limitedPointers[blockType][j];
                if(!usesCount[pointer]) { usesCount[pointer] = 0; }
                usesCount[pointer]++;

                // Exceeded the number of uses
                var limits = this.mainContext.infos.limitedUses[pointer];
                if(usesCount[pointer] > limits.nbUses) {
                    return limits.blocks;
                }
            }
         }

         // All blocks are under the use limit
         return false;
      },

      getRemainingCapacity: function(workspace) {
         // Get the number of blocks allowed
         if(!this.maxBlocks) { return Infinity; }
         var remaining = workspace.remainingCapacity(this.maxBlocks+1);
         var allBlocks = workspace.getAllBlocks();
         if(this.maxBlocks && remaining == Infinity) {
            // Blockly won't return anything as we didn't set a limit
            remaining = this.maxBlocks + 1 - allBlocks.length;
         }
         for (var i = 0; i < allBlocks.length; i++) {
            var block = allBlocks[i];
            if (typeof this.blockCounts[block.type] != 'undefined') {
               remaining -= this.blockCounts[block.type] - 1;
            }
         }
         return remaining;
      },

      isEmpty: function(workspace) {
         // Check if workspace is empty
         if(!workspace) { workspace = this.workspace; }
         var blocks = workspace.getAllBlocks();
         if(blocks.length == 1) {
            return blocks[0].type == 'robot_start';
         } else {
            return blocks.length == 0;
         }
      },

      getAllCodes: function(answer) {
         // Generate codes for each node
         var codes = [];
         for (var iNode = 0; iNode < this.mainContext.nbNodes; iNode++) {
            if(this.mainContext.codeIdForNode) {
               var iCode = this.mainContext.codeIdForNode(iNode);
            } else {
               var iCode = Math.min(iNode, this.mainContext.nbCodes-1);
            }
            var language = this.languages[iCode];
            if (language == "blockly") {
               language = "blocklyJS";
            }
            if(answer) {
               // Generate codes for specified answer
               var code = this.getCodeFromXml(answer[iCode].blockly, "javascript");
               codes[iNode] = this.getFullCode(code);
            } else {
               // Generate codes for current program
               codes[iNode] = this.getFullCode(this.programs[iCode][language]);
            }
         }

         return codes;
      },

      getCodeFromXml: function(xmlText, language) {
         try {
           var xml = Blockly.Xml.textToDom(xmlText)
         } catch (e) {
           alert(e);
           return;
         }

         // Remove statement prefix (highlightBlock)
         var statementPrefix = Blockly.JavaScript.STATEMENT_PREFIX;
         Blockly.JavaScript.STATEMENT_PREFIX = '';

         // New workspaces need options, else they can give unpredictable results
         var tmpOptions = new Blockly.Options({});
         var tmpWorkspace = new Blockly.Workspace(tmpOptions);
         if(this.scratchMode) {
            // Make sure it has the right information from this blocklyHelper
            tmpWorkspace.maxBlocks = function () { return maxBlocks; };
         }
         Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
         var code = this.getCode(language, tmpWorkspace);

         Blockly.JavaScript.STATEMENT_PREFIX = statementPrefix;
         return code;
      },

      getCode: function(language, codeWorkspace, noReportValue, noConstraintCheck) {
         if (codeWorkspace == undefined) {
            codeWorkspace = this.workspace;
         }
         if(!this.checkConstraints(codeWorkspace) && !noConstraintCheck) {
            // Safeguard: avoid generating code when we use too many blocks
            return 'throw "'+this.strings.tooManyBlocks+'";';
         }
         var blocks = codeWorkspace.getTopBlocks(true);
         var languageObj = null;
         if (language == "javascript") {
            languageObj = Blockly.JavaScript;
         }
         if (language == "python") {
            languageObj = Blockly.Python;
         }
         languageObj.init(codeWorkspace);

         var oldReportValues = this.reportValues;
         if(noReportValue) {
            this.reportValues = false;
         }

         // Put other blocks than robot_start first so that they execute before the main loop
         var blockPriority = function (a) {
             return a.type === 'robot_start' ? -1 : 1;
         };
         blocks.sort(function (a, b) {
             return blockPriority(b) - blockPriority(a);
         });

         var code = [];
         var comments = [];
         for (var b = 0; b < blocks.length; b++) {
            var block = blocks[b];
            var blockCode = languageObj.blockToCode(block);
            if (arrayContains(["procedures_defnoreturn", "procedures_defreturn"], block.type)) {
               // For function blocks, the code is stored in languageObj.definitions_
            } else {
               if (block.type == "robot_start" || !this.startingBlock) {
                  comments.push(blockCode);
               }
            }
         }

         for (var def in languageObj.definitions_) {
            code.push(languageObj.definitions_[def]);
         }

         var code = code.join("\n");
         code += "\n";
         code += comments.join("\n");

         this.reportValues = oldReportValues;

         return code;
      },

      getPyfeCode: function() {
         var that = this;
         return Blockly.Python.blocksToCommentedCode(function() {
            return that.getCode('python');
            });
      },

      completeBlockHandler: function(block, objectName, context) {
         if (typeof block.handler == "undefined") {
            block.handler = context[objectName][block.name];
         }


         if (typeof block.handler == "undefined") {
            block.handler = (function(oName, bName) {
               return function() { console.error("Error: No handler given. No function context." + oName + "." + bName + "() found!" ); }
            })(objectName, block.name);
         }
      },
      completeBlockJson: function(block, objectName, categoryName, context) {
         // Needs context object solely for the language strings. Maybe change that …

         if (typeof block.blocklyJson == "undefined") {
            block.blocklyJson =  {};
         }

         // Set block name
         if (typeof block.blocklyJson.type == "undefined") {
            block.blocklyJson.type = block.name;
         }

         // Add connectors (top-bottom or left)
         if (typeof block.blocklyJson.output == "undefined" &&
             typeof block.blocklyJson.previousStatement == "undefined" &&
             typeof block.blocklyJson.nextStatement == "undefined" &&
             !(block.noConnectors)) {
            if (block.yieldsValue) {
               block.blocklyJson.output = null;
               if(this.scratchMode) {
                   if(block.yieldsValue == 'int') {
                       block.blocklyJson.outputShape = Blockly.OUTPUT_SHAPE_ROUND;
                   } else {
                       block.blocklyJson.outputShape = Blockly.OUTPUT_SHAPE_HEXAGONAL;
                   }

                   if(typeof block.blocklyJson.colour == "undefined") {
                      block.blocklyJson.colour = Blockly.Colours.sensing.primary;
                      block.blocklyJson.colourSecondary = Blockly.Colours.sensing.secondary;
                      block.blocklyJson.colourTertiary = Blockly.Colours.sensing.tertiary;
                   }
               }
            }
            else {
               block.blocklyJson.previousStatement = null;
               block.blocklyJson.nextStatement = null;

               if(this.scratchMode) {
                   if(typeof block.blocklyJson.colour == "undefined") {
                      block.blocklyJson.colour = Blockly.Colours.motion.primary;
                      block.blocklyJson.colourSecondary = Blockly.Colours.motion.secondary;
                      block.blocklyJson.colourTertiary = Blockly.Colours.motion.tertiary;
                   }
               }
            }
         }

         // Add parameters
         if (typeof block.blocklyJson.args0 == "undefined" &&
             typeof block.params != "undefined" &&
             block.params.length > 0) {
            block.blocklyJson.args0 = [];
            for (var iParam = 0; iParam < block.params.length; iParam++) {
               var param = {
                  type: "input_value",
                  name: "PARAM_" + iParam
               }

               if (block.params[iParam] != null) {
                  param.check = block.params[iParam]; // Should be a string!
               }
               block.blocklyJson.args0.push(param);
            }
         }

         // Add message string
         if (typeof block.blocklyJson.message0 == "undefined") {
            block.blocklyJson.message0 = context.strings.label[objectName + '.' + block.name] ? context.strings.label[objectName + '.' + block.name] : context.strings.label[block.name];
// TODO: Load default colours + custom styles
            if (typeof block.blocklyJson.message0 == "undefined") {
               block.blocklyJson.message0 = "<translation missing: " + block.name + ">";
            }

            // append all missing params to the message string
            if (typeof block.blocklyJson.args0 != "undefined") {
               var alreadyInserted = (block.blocklyJson.message0.match(/%/g) || []).length;
               for (var iArgs0 = alreadyInserted; iArgs0 < block.blocklyJson.args0.length; iArgs0++) {
                  if (block.blocklyJson.args0[iArgs0].type == "input_value"
                      || block.blocklyJson.args0[iArgs0].type == "field_number"
                      || block.blocklyJson.args0[iArgs0].type == "field_angle"
                      || block.blocklyJson.args0[iArgs0].type == "field_colour"
                      || block.blocklyJson.args0[iArgs0].type == "field_dropdown"
                      || block.blocklyJson.args0[iArgs0].type == "field_input") {
                     block.blocklyJson.message0 += " %" + (iArgs0 + 1);
                  }
               }
            }
         }

         // Tooltip & HelpUrl should always exist, so lets just add empty ones in case they don't exist
         if (typeof block.blocklyJson.tooltip == "undefined") { block.blocklyJson.tooltip = ""; }
         if (typeof block.blocklyJson.helpUrl == "undefined") { block.blocklyJson.helpUrl = ""; } // TODO: Or maybe not?

         // TODO: Load default colours + custom styles
         if (typeof block.blocklyJson.colour == "undefined") {
            if(this.scratchMode) {
               block.blocklyJson.colour = Blockly.Colours.motion.primary;
               block.blocklyJson.colourSecondary = Blockly.Colours.motion.secondary;
               block.blocklyJson.colourTertiary = Blockly.Colours.motion.tertiary;
            } else {
               var colours = this.getDefaultColours();
               block.blocklyJson.colour = 210; // default: blue
               if ("blocks" in colours && block.name in colours.blocks) {
                  block.blocklyJson.colour = colours.blocks[block.name];
               }
               else if ("categories" in colours) {
                  if (categoryName in colours.categories) {
                     block.blocklyJson.colour = colours.categories[categoryName];
                  }
                  else if ("_default" in colours.categories) {
                     block.blocklyJson.colour = colours.categories["_default"];
                  }
               }
            }
         }
      },
      completeBlockXml: function(block) {
         if (typeof block.blocklyXml == "undefined" || block.blocklyXml == "") {
            block.blocklyXml = "<block type='" + block.name + "'></block>";
         }
      },
      completeCodeGenerators: function(blockInfo, objectName) {
         if (typeof blockInfo.codeGenerators == "undefined") {
            blockInfo.codeGenerators = {};
         }

         var that = this;

         // for closure:
         var args0 = blockInfo.blocklyJson.args0;
         var code = this.mainContext.strings.code[blockInfo.name];
         var output = blockInfo.blocklyJson.output;
         var blockParams = blockInfo.params;

         for (var language in {JavaScript: null, Python: null}) {
            if (typeof blockInfo.codeGenerators[language] == "undefined") {
               // Prevent the function name to be used as a variable
               Blockly[language].addReservedWords(code);
               function setCodeGeneratorForLanguage(language) {
                  blockInfo.codeGenerators[language] = function(block) {
                     var params = "";

                     /* There are three kinds of input: value_input, statement_input and dummy_input,
                        We should definitely consider value_input here and not consider dummy_input here.

                        I don't know how statement_input is handled best, so I'll ignore it first -- Robert
                      */
                     var iParam = 0;
                     for (var iArgs0 in args0) {
                        if (args0[iArgs0].type == "input_value") {
                           if (iParam) {
                              params += ", ";
                           }

                           if (blockParams && blockParams[iArgs0] == 'Statement') {
                               params += "function () {\n  " + Blockly.JavaScript.statementToCode(block, 'PARAM_' + iParam) + "}";
                           } else {
                               params += Blockly[language].valueToCode(block, 'PARAM_' + iParam, Blockly[language].ORDER_ATOMIC);
                           }
                           iParam += 1;
                        }
                        if (args0[iArgs0].type == "field_number"
                            || args0[iArgs0].type == "field_angle"
                            || args0[iArgs0].type == "field_dropdown"
                            || args0[iArgs0].type == "field_input") {
                           if (iParam) {
                              params += ", ";
                           }
                           var fieldValue = block.getFieldValue('PARAM_' + iParam);
                           if(blockParams && blockParams[iArgs0] == 'Number') {
                              params += parseInt(fieldValue);
                           } else {
                              params += JSON.stringify(fieldValue);
                           }
                           iParam += 1;
                        }
                        if (args0[iArgs0].type == "field_colour") {
                           if (iParam) {
                              params += ", ";
                           }
                           params += '"' + block.getFieldValue('PARAM_' + iParam) + '"';
                           iParam += 1;
                        }
                     }

                     var callCode = code + '(' + params + ')';
                     // Add reportValue to show the value in step-by-step mode
                     if(that.reportValues) {
                        var reportedCode = "reportBlockValue('" + block.id + "', " + callCode + ")";
                     } else {
                        var reportedCode = callCode;
                     }

                     if (typeof output == "undefined") {
                        return callCode + ";\n";
                     }
                     else {
                        return [reportedCode, Blockly[language].ORDER_NONE];
                     }
                  }
               };
               setCodeGeneratorForLanguage(language);
            }
         }
      },

      applyCodeGenerators: function(block) {
         for (var language in block.codeGenerators) {
            Blockly[language][block.name] = block.codeGenerators[language];
         }
      },

      createBlock: function(block) {
         if (typeof block.fullBlock != "undefined") {
            Blockly.Blocks[block.name] = block.fullBlock;
         } else if (typeof block.blocklyInit == "undefined") {
            var blocklyjson = block.blocklyJson;
            Blockly.Blocks[block.name] = {
               init: function() {
                  this.jsonInit(blocklyjson);
               }
            };
         } else if (typeof block.blocklyInit == "function") {
            Blockly.Blocks[block.name] = {
               init: block.blocklyInit()
            };
         } else {
            console.error(block.name + ".blocklyInit is defined but not a function");
         }
      },

      createSimpleGenerator: function(label, code, type, nbParams) {
         var jsDefinitions = this.definitions['javascript'] ? this.definitions['javascript'] : [];
         var pyDefinitions = this.definitions['python'] ? this.definitions['python'] : [];

         // Prevent the function name to be used as a variable
         Blockly.JavaScript.addReservedWords(code);
         Blockly.Python.addReservedWords(code);

         Blockly.JavaScript[label] = function(block) {
            for (var iDef=0; iDef < jsDefinitions.length; iDef++) {
               var def = jsDefinitions[iDef];
               Blockly.Javascript.definitions_[def.label] = def.code;
            }
            var params = "";
            for (var iParam = 0; iParam < nbParams; iParam++) {
               if (iParam != 0) {
                  params += ", ";
               }
               params += Blockly.JavaScript.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.JavaScript.ORDER_ATOMIC);
            }
           if (type == 0) {
              return code + "(" + params + ");\n";
           } else if (type == 1){
              return [code + "(" + params + ")", Blockly.JavaScript.ORDER_NONE];
           }
         };
         Blockly.Python[label] = function(block) {
            for (var iDef=0; iDef < pyDefinitions.length; iDef++) {
               var def = pyDefinitions[iDef];
               Blockly.Python.definitions_[def.label] = def.code;
            }
            var params = "";
            for (var iParam = 0; iParam < nbParams; iParam++) {
               if (iParam != 0) {
                  params += ", ";
               }
               params += Blockly.Python.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.Python.ORDER_ATOMIC);
            }
            if (type == 0) {
               return code + "(" + params + ")\n";
            } else if (type == 1) {
               return [code + "(" + params + ")", Blockly.Python.ORDER_NONE];
            }
         };
      },

      createSimpleBlock: function(label, code, type, nbParams) {
         Blockly.Blocks[label] = {
           init: function() {
             this.appendDummyInput()
                 .appendField(code);
             if (type == 0) {
                this.setPreviousStatement(true);
                this.setNextStatement(true);
             }
             if (type == 1) {
                this.setOutput(true);
             }
             this.setInputsInline(true);
             for (var iParam = 0; iParam < nbParams; iParam++) {
                this.appendValueInput("NAME_" + (iParam + 1)).setCheck(null);
             }
             this.setColour(210);
             this.setTooltip('');
             this.setHelpUrl('');
           }
         };
      },

      createSimpleGeneratorsAndBlocks: function() {
         for (var genName in this.simpleGenerators) {
            for (var iGen = 0; iGen < this.simpleGenerators[genName].length; iGen++) {
               var generator = this.simpleGenerators[genName][iGen];
               if(genName == '.') {
                 var label = generator.label + "__";
                 var code = generator.code;
               } else {
                 var label = genName + "_" + generator.label + "__";
                 var code = genName + "." + generator.code;
               }
               this.createSimpleGenerator(label, code, generator.type, generator.nbParams);
               // TODO :: merge createSimpleBlock with completeBlock*
               this.createSimpleBlock(label, generator.label, generator.type, generator.nbParams);
            }
         }
      },

      applyBlockOptions: function (block) {
         if (typeof block.countAs != 'undefined') {
            this.blockCounts[block.name] = block.countAs;
         }
      },

      createGeneratorsAndBlocks: function() {
         this.blockCounts = {};
         var customGenerators = this.mainContext.customBlocks;
         for (var objectName in customGenerators) {
            for (var categoryName in customGenerators[objectName]) {
               var category =  customGenerators[objectName][categoryName];
               for (var iBlock = 0; iBlock < category.length; iBlock++) {
                  var block = category[iBlock];

                  /* TODO: Allow library writers to provide their own JS/Python code instead of just a handler */
                  this.completeBlockHandler(block, objectName, this.mainContext);
                  this.completeBlockJson(block, objectName, categoryName, this.mainContext); /* category.category is category name */
                  this.completeBlockXml(block);
                  this.completeCodeGenerators(block, objectName);
                  this.applyCodeGenerators(block);
                  this.createBlock(block);
                  this.applyBlockOptions(block);
               }
               // TODO: Anything of this still needs to be done?
               //this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
               //this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
            }
         }
      },

      getBlocklyLibCode: function(generators) {
         var strCode = "";
         for (var objectName in generators) {
            strCode += "var " + objectName + " = {\n";
            for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
               var generator = generators[objectName][iGen];

               if (generator.nbParams == 0) {
                  strCode += generator.codeFr + ": function() { ";
               } else {
                  strCode += generator.codeFr + ": function(param1) { ";
               }
               if (generator.type == 1) {
                  strCode += "return ";
               }
               if (generator.nbParams == 0) {
                  strCode += objectName + "_" + generator.labelEn + "(); }";
               } else {
                  strCode += objectName + "_" + generator.labelEn + "(param1); }";
               }
               if (iGen < generators[objectName].length - 1) {
                  strCode += ",";
               }
               strCode += "\n";
            }
            strCode += "};\n\n";
         }
         strCode += "Math['max'] = function(a, b) { if (a > b) return a; return b; };\n";
         strCode += "Math['min'] = function(a, b) { if (a > b) return b; return a; };\n";
         return strCode;
      },


      getDefaultColours: function() {
         Blockly.HSV_SATURATION = 0.65;
         Blockly.HSV_VALUE = 0.80;
         var colours = {
            categories: {
                 actuator: 212,
                 sensors: 95,
                 internet: 200,
                 display: 300,
                 input: 50,
                 inputs: 50,
                 lists: 353,
                 logic: 298,
                 math: 176,
                 loops: 200,
                 texts: 312,
                 dicts: 52,
                 tables: 212,
                 variables: 30,
                 procedures: 180,
                 _default: 65
            },
            blocks: {}
         };

         if (typeof this.mainContext.provideBlocklyColours == "function") {
            var providedColours = this.mainContext.provideBlocklyColours();

            for (var group in providedColours) {
               if (!(group in colours)) {
                  colours[group] = {};
               }
               for (name in providedColours[group]) {
                  colours[group][name] = providedColours[group][name];
               }
            }
         }

         if (typeof provideBlocklyColours == "function") {
            var providedColours = provideBlocklyColours();

            for (var group in providedColours) {
               if (!(group in colours)) {
                  colours[group] = {};
               }
               for (name in providedColours[group]) {
                  colours[group][name] = providedColours[group][name];
               }
            }
         }

         return colours;
      },

      getPlaceholderBlock: function(name) {
         return this.placeholderBlocks ? "<statement name='" + name + "'><shadow type='placeholder_statement'></shadow></statement>" : '';
      },

      getStdBlocks: function() {
         return this.scratchMode ? this.getStdScratchBlocks() : this.getStdBlocklyBlocks();
      },

      getStdBlocklyBlocks: function() {
         return {
            input: [
               {
                  name: "input_num",
                  blocklyXml: "<block type='input_num'></block>"
               },
               {
                  name: "input_num_list",
                  blocklyXml: "<block type='input_num_list'></block>"
               },
               {
                  name: "input_line",
                  blocklyXml: "<block type='input_line'></block>"
               },
               {
                  name: "input_num_next",
                  blocklyXml: "<block type='input_num_next'></block>"
               },
               {
                  name: "input_char",
                  blocklyXml: "<block type='input_char'></block>"
               },
               {
                  name: "input_word",
                  blocklyXml: "<block type='input_word'></block>"
               }
            ],
            logic: [
               {
                  name: "controls_if",
                  blocklyXml: "<block type='controls_if'>" +
                              this.getPlaceholderBlock('DO0') +
                              "</block>"
               },
               {
                  name: "controls_if_else",
                  blocklyXml: "<block type='controls_if'><mutation else='1'></mutation>" +
                              this.getPlaceholderBlock('DO0') +
                              this.getPlaceholderBlock('ELSE') +
                              "</block>",
                  excludedByDefault: this.mainContext ? this.mainContext.showIfMutator : false
               },
               {
                  name: "logic_compare",
                  blocklyXml: "<block type='logic_compare'></block>"
               },
               {
                  name: "logic_operation",
                  blocklyXml: "<block type='logic_operation' inline='false'></block>"
               },
               {
                  name: "logic_negate",
                  blocklyXml: "<block type='logic_negate'></block>"
               },
               {
                  name: "logic_boolean",
                  blocklyXml: "<block type='logic_boolean'></block>"
               },
               {
                  name: "logic_null",
                  blocklyXml: "<block type='logic_null'></block>",
                  excludedByDefault: true
               },
               {
                  name: "logic_ternary",
                  blocklyXml: "<block type='logic_ternary'></block>",
                  excludedByDefault: true
               }
            ],
            loops: [
               {
                  name: "controls_loop",
                  blocklyXml: "<block type='controls_loop'></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_repeat",
                  blocklyXml: "<block type='controls_repeat'>" +
                              this.getPlaceholderBlock('DO') +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_repeat_ext",
                  blocklyXml: "<block type='controls_repeat_ext'>" +
                              "  <value name='TIMES'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>10</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              this.getPlaceholderBlock('DO') +
                              "</block>"
               },
               {
                  name: "controls_repeat_ext_noShadow",
                  blocklyXml: "<block type='controls_repeat_ext'></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_whileUntil",
                  blocklyXml: "<block type='controls_whileUntil'></block>"
               },
               {
                  name: "controls_untilWhile",
                  blocklyXml: "<block type='controls_whileUntil'><field name='MODE'>UNTIL</field></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_for",
                  blocklyXml: "<block type='controls_for'>" +
                              "  <value name='FROM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='TO'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>10</field>" +
                              "     </shadow>" +
                              "  </value>" +
                              "  <value name='BY'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "controls_for_noShadow",
                  blocklyXml: "<block type='controls_for'></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_for_fillShadow",
                  blocklyXml: "<block type='controls_for'>" +
                              "  <value name='FROM'>" +
                              "    <block type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </block>" +
                              "  </value>" +
                              "  <value name='TO'>" +
                              "    <block type='math_number'>" +
                              "      <field name='NUM'>10</field>" +
                              "     </block>" +
                              "  </value>" +
                              "  <value name='BY'>" +
                              "    <block type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_forEach",
                  blocklyXml: "<block type='controls_forEach'></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_flow_statements",
                  blocklyXml: "<block type='controls_flow_statements'></block>"
               },
               {
                  name: "controls_infiniteloop",
                  blocklyXml: "<block type='controls_infiniteloop'></block>",
                  excludedByDefault: true
               },
            ],
            math: [
               {
                  name: "math_number",
                  blocklyXml: "<block type='math_number' gap='32'></block>"
               },
               {
                  name: "math_arithmetic",
                  blocklyXml: "<block type='math_arithmetic'>" +
                              "  <value name='A'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='B'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_arithmetic_noShadow",
                  blocklyXml: "<block type='math_arithmetic'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_single",
                  blocklyXml: "<block type='math_single'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>9</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_single_noShadow",
                  blocklyXml: "<block type='math_single'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_single",
                  blocklyXml: "<block type='math_extra_single'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>9</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_single_noShadow",
                  blocklyXml: "<block type='math_extra_single'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_double",
                  blocklyXml: "<block type='math_extra_double'>" +
                              "  <value name='A'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='B'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_double",
                  blocklyXml: "<block type='math_extra_double'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_trig",
                  blocklyXml: "<block type='math_trig'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>45</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_trig_noShadow",
                  blocklyXml: "<block type='math_trig'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constant",
                  blocklyXml: "<block type='math_constant'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_number_property",
                  blocklyXml: "<block type='math_number_property'>" +
                              "  <value name='NUMBER_TO_CHECK'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_number_property_noShadow",
                  blocklyXml: "<block type='math_number_property'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_round",
                  blocklyXml: "<block type='math_round'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>3.1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_round_noShadow",
                  blocklyXml: "<block type='math_round'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_on_list",
                  blocklyXml: "<block type='math_on_list'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_modulo",
                  blocklyXml: "<block type='math_modulo'>" +
                              "  <value name='DIVIDEND'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>64</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='DIVISOR'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>10</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_modulo_noShadow",
                  blocklyXml: "<block type='math_modulo'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constrain",
                  blocklyXml: "<block type='math_constrain'>" +
                              "  <value name='VALUE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>50</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LOW'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='HIGH'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>100</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constrain_noShadow",
                  blocklyXml: "<block type='math_constrain'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_int",
                  blocklyXml: "<block type='math_random_int'>" +
                              "  <value name='FROM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='TO'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>100</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_int_noShadow",
                  blocklyXml: "<block type='math_random_int'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_float",
                  blocklyXml: "<block type='math_random_float'></block>",
                  excludedByDefault: true
               }
            ],
            texts: [
               {
                  name: "text",
                  blocklyXml: "<block type='text'></block>"
               },
               {
                  name: "text_eval",
                  blocklyXml: "<block type='text_eval'></block>"
               },
               {
                  name: "text_print",
                  blocklyXml: "<block type='text_print'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_print_noend",
                  blocklyXml: "<block type='text_print_noend'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_join",
                  blocklyXml: "<block type='text_join'></block>"
               },
               {
                  name: "text_append",
                  blocklyXml: "<block type='text_append'></block>"
               },
               {
                  name: "text_length",
                  blocklyXml: "<block type='text_length'>" +
                              "  <value name='VALUE'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_length_noShadow",
                  blocklyXml: "<block type='text_length'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_isEmpty",
                  blocklyXml: "<block type='text_isEmpty'>" +
                              "  <value name='VALUE'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'></field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_isEmpty_noShadow",
                  blocklyXml: "<block type='text_isEmpty'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_indexOf",
                  blocklyXml: "<block type='text_indexOf'>" +
                              "  <value name='VALUE'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{textVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "  <value name='FIND'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_indexOf_noShadow",
                  blocklyXml: "<block type='text_indexOf'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_charAt",
                  blocklyXml: "<block type='text_charAt'>" +
                              "  <value name='VALUE'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{textVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_charAt_noShadow",
                  blocklyXml: "<block type='text_charAt'></block>",
                  excludedByDefault: true

               },
               {
                  name: "text_getSubstring",
                  blocklyXml: "<block type='text_getSubstring'>" +
                              "  <value name='STRING'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{textVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_getSubstring_noShadow",
                  blocklyXml: "<block type='text_getSubstring'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_changeCase",
                  blocklyXml: "<block type='text_changeCase'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_changeCase_noShadow",
                  blocklyXml: "<block type='text_changeCase'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_trim",
                  blocklyXml: "<block type='text_trim'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_trim_noShadow",
                  blocklyXml: "<block type='text_trim'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_print_noShadow",
                  blocklyXml: "<block type='text_print'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_prompt_ext",
                  blocklyXml: "<block type='text_prompt_ext'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "text_prompt_ext_noShadow",
                  blocklyXml: "<block type='text_prompt_ext'></block>",
                  excludedByDefault: true
               },

               {
                  name: "text_str",
                  blocklyXml: "<block type='text_str'></block>"
               }
            ],
            lists: [
               {
                  name: "lists_create_with_empty",
                  blocklyXml: "<block type='lists_create_with'>" +
                              "  <mutation items='0'></mutation>" +
                              "</block>"
               },
               {
                  name: "lists_create_with",
                  blocklyXml: "<block type='lists_create_with'></block>"
               },
               {
                  name: "lists_repeat",
                  blocklyXml: "<block type='lists_repeat'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>5</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_length",
                  blocklyXml: "<block type='lists_length'></block>"
               },
               {
                  name: "lists_isEmpty",
                  blocklyXml: "<block type='lists_isEmpty'></block>"
               },
               {
                  name: "lists_indexOf",
                  blocklyXml: "<block type='lists_indexOf'>" +
                              "  <value name='VALUE'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{listVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_getIndex",
                  blocklyXml: "<block type='lists_getIndex'>" +
                              "  <value name='VALUE'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{listVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_setIndex",
                  blocklyXml: "<block type='lists_setIndex'>" +
                              "  <value name='LIST'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{listVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_getSublist",
                  blocklyXml: "<block type='lists_getSublist'>" +
                              "  <value name='LIST'>" +
                              "    <block type='variables_get'>" +
                              "      <field name='VAR'>{listVariable}</field>" +
                              "    </block>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_sort_place",
                  blocklyXml: "<block type='lists_sort_place'><field name='VAR'>{listVariable}</field></block>"
               },
               {
                  name: "lists_sort",
                  blocklyXml: "<block type='lists_sort'></block>"
               },
               {
                  name: "lists_split",
                  blocklyXml: "<block type='lists_split'>" +
                              "  <value name='DELIM'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>,</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "lists_append",
                  blocklyXml: "<block type='lists_append'><field name='VAR'>{listVariable}</field></block>"
               }
            ],
            tables: [
               {
                  name: "tables_2d_init",
                  blocklyXml: "<block type='tables_2d_init'>" +
                              "  <value name='LINES'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COLS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_2d_set",
                  blocklyXml: "<block type='tables_2d_set'>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_2d_get",
                  blocklyXml: "<block type='tables_2d_get'>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_init",
                  blocklyXml: "<block type='tables_3d_init'>" +
                              "  <value name='LAYERS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINES'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COLS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_set",
                  blocklyXml: "<block type='tables_3d_set'>" +
                              "  <value name='LAYER'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_get",
                  blocklyXml: "<block type='tables_3d_get'>" +
                              "  <value name='LAYER'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               }
            ],
            // Note :: this category is not enabled unless explicitly specified
            colour: [
               {
                  name: "colour_picker",
                  blocklyXml: "<block type='colour_picker'></block>"
               },
               {
                  name: "colour_random",
                  blocklyXml: "<block type='colour_random'></block>"
               },
               {
                  name: "colour_rgb",
                  blocklyXml: "<block type='colour_rgb'>" +
                              "  <value name='RED'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>100</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='GREEN'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>50</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='BLUE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "colour_rgb_noShadow",
                  blocklyXml: "<block type='colour_rgb'></block>",
                  excludedByDefault: true
               },
               {
                  name: "colour_blend",
                  blocklyXml: "<block type='colour_blend'>" +
                              "  <value name='COLOUR1'>" +
                              "    <shadow type='colour_picker'>" +
                              "      <field name='COLOUR'>#ff0000</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COLOUR2'>" +
                              "    <shadow type='colour_picker'>" +
                              "      <field name='COLOUR'>#3333ff</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='RATIO'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0.5</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "colour_blend_noShadow",
                  blocklyXml: "<block type='colour_blend'></block>",
                  excludedByDefault: true
               }
            ],
            dicts: [
               {
                  name: "dicts_create_with",
                  blocklyXml: "<block type='dicts_create_with'></block>"
               },
               {
                  name: "dict_get_literal",
                  blocklyXml: "<block type='dict_get_literal'></block>"
               },
               {
                  name: "dict_set_literal",
                  blocklyXml: "<block type='dict_set_literal'></block>"
               },
               {
                  name: "dict_keys",
                  blocklyXml: "<block type='dict_keys'></block>"
               }
            ],
            variables: [],
            functions: []
         };
      },

      getStdScratchBlocks: function() {
         // TODO :: make the list of standard scratch blocks
         return {
            control: [
                  {
                     name: "control_if",
                     blocklyXml: "<block type='control_if'>" +
                                 this.getPlaceholderBlock('SUBSTACK') +
                                 "</block>"
                  },
                  {
                     name: "control_if_else",
                     blocklyXml: "<block type='control_if_else'>" +
                                 this.getPlaceholderBlock('SUBSTACK') +
                                 this.getPlaceholderBlock('SUBSTACK2') +
                                 "</block>"
                  },
                  {
                     name: "control_repeat",
                     blocklyXml: "<block type='control_repeat'>" +
                                 "  <value name='TIMES'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>10</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 this.getPlaceholderBlock('SUBSTACK') +
                                 "</block>"
                  },
                  {
                     name: "control_repeat_until",
                     blocklyXml: "<block type='control_repeat_until'>" +
                                 this.getPlaceholderBlock('SUBSTACK') +
                                 "</block>"
                  },
                  {
                     name: "control_forever",
                     blocklyXml: "<block type='control_forever'></block>",
                     excludedByDefault: true
                  }
               ],
            input: [
               {
                  name: "input_num",
                  blocklyXml: "<block type='input_num'></block>"
               },
               {
                  name: "input_num_list",
                  blocklyXml: "<block type='input_num_list'></block>"
               },
               {
                  name: "input_line",
                  blocklyXml: "<block type='input_line'></block>"
               },
               {
                  name: "input_num_next",
                  blocklyXml: "<block type='input_num_next'></block>"
               },
               {
                  name: "input_char",
                  blocklyXml: "<block type='input_char'></block>"
               },
               {
                  name: "input_word",
                  blocklyXml: "<block type='input_word'></block>"
               }
            ],
            lists: [
                  {
                     name: "data_listrepeat",
                     blocklyXml: "<block type='data_listrepeat'>" +
                                 "  <field name='LIST'>" + (this.strings ? this.strings.listVariable : 'list') + "</field>" +
                                 "  <value name='ITEM'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'></field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='TIMES'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>1</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "data_itemoflist",
                     blocklyXml: "<block type='data_itemoflist'>" +
                                 "  <field name='LIST'>" + (this.strings ? this.strings.listVariable : 'list') + "</field>" +
                                 "  <value name='INDEX'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>1</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "data_replaceitemoflist",
                     blocklyXml: "<block type='data_replaceitemoflist'>" +
                                 "  <field name='LIST'>" + (this.strings ? this.strings.listVariable : 'list') + "</field>" +
                                 "  <value name='INDEX'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>1</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='ITEM'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'></field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_sort_place",
                     blocklyXml: "<block type='lists_sort_place'><field name='VAR'>{listVariable}</field></block>"
                  }
               ],
            math: [
                  {
                     name: "math_number",
                     blocklyXml: "<block type='math_number' gap='32'></block>"
                  }
               ],
            operator: [
                  {
                     name: "operator_add",
                     blocklyXml: "<block type='operator_add'>" +
                                 "  <value name='NUM1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='NUM2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_subtract",
                     blocklyXml: "<block type='operator_subtract'>" +
                                 "  <value name='NUM1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='NUM2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_multiply",
                     blocklyXml: "<block type='operator_multiply'>" +
                                 "  <value name='NUM1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='NUM2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_divide",
                     blocklyXml: "<block type='operator_divide'>" +
                                 "  <value name='NUM1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='NUM2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_dividefloor",
                     blocklyXml: "<block type='operator_dividefloor'>" +
                                 "  <value name='NUM1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='NUM2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_equals",
                     blocklyXml: "<block type='operator_equals'>" +
                                 "  <value name='OPERAND1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='OPERAND2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_gt",
                     blocklyXml: "<block type='operator_gt'>" +
                                 "  <value name='OPERAND1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='OPERAND2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_gte",
                     blocklyXml: "<block type='operator_gte'>" +
                                 "  <value name='OPERAND1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='OPERAND2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_lt",
                     blocklyXml: "<block type='operator_lt'>" +
                                 "  <value name='OPERAND1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='OPERAND2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_lte",
                     blocklyXml: "<block type='operator_lte'>" +
                                 "  <value name='OPERAND1'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "  <value name='OPERAND2'><shadow type='math_number'><field name='NUM'></field></shadow></value>" +
                                 "</block>"
                  },
                  {
                     name: "operator_and",
                     blocklyXml: "<block type='operator_and'></block>"
                  },
                  {
                     name: "operator_or",
                     blocklyXml: "<block type='operator_or'></block>"
                  },
                  {
                     name: "operator_not",
                     blocklyXml: "<block type='operator_not'></block>"
                  },
                  {
                     name: "operator_join",
                     blocklyXml: "<block type='operator_join'>" +
                                 "  <value name='STRING1'><shadow type='text'><field name='TEXT'></field></shadow></value>" +
                                 "  <value name='STRING2'><shadow type='text'><field name='TEXT'></field></shadow></value>" +
                                 "</block>"
                  }
               ],
            tables: [
               {
                  name: "tables_2d_init",
                  blocklyXml: "<block type='tables_2d_init'>" +
                              "  <value name='LINES'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COLS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_2d_set",
                  blocklyXml: "<block type='tables_2d_set'>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_2d_get",
                  blocklyXml: "<block type='tables_2d_get'>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_init",
                  blocklyXml: "<block type='tables_3d_init'>" +
                              "  <value name='LAYERS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINES'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COLS'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_set",
                  blocklyXml: "<block type='tables_3d_set'>" +
                              "  <value name='LAYER'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='ITEM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "tables_3d_get",
                  blocklyXml: "<block type='tables_3d_get'>" +
                              "  <value name='LAYER'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>2</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LINE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='COL'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               }
            ],
            texts: [
               {
                  name: "text_print",
                  blocklyXml: "<block type='text_print'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_print_noend",
                  blocklyXml: "<block type='text_print_noend'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "text_eval",
                  blocklyXml: "<block type='text_eval'></block>"
               }
               ],
            variables: [],
            functions: []
         };
      },

      getBlockXmlInfo: function(generatorStruct, blockName) {
         for (var categoryName in generatorStruct) {
            var blocks = generatorStruct[categoryName];
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               var block = blocks[iBlock];
               if (block.name == blockName) {
                  return {
                     category: categoryName,
                     xml: block.blocklyXml
                  };
               }
            }
         }

         console.error("Block not found: " + blockName);
         return null;
      },


      addBlocksAndCategories: function(blockNames, blocksDefinition, categoriesInfos) {
         var colours = this.getDefaultColours();
         for (var iBlock = 0; iBlock < blockNames.length; iBlock++) {
            var blockName = blockNames[iBlock];
            var blockXmlInfo = this.getBlockXmlInfo(blocksDefinition, blockName);
            var categoryName = blockXmlInfo.category;

            if (!(categoryName in categoriesInfos)) {
               categoriesInfos[categoryName] = {
                  blocksXml: [],
                  colour: colours.blocks[blockName]
               };
            }
            var blockXml = blockXmlInfo.xml;
            if(categoriesInfos[categoryName].blocksXml.indexOf(blockXml) == -1) {
               categoriesInfos[categoryName].blocksXml.push(blockXml);
            }
            this.addBlocksAllowed([blockName]);
         }

         // by the way, just change the defaul colours of the blockly blocks:
         if(!this.scratchMode) {
            var defCat = ["logic", "loops", "math", "texts", "lists", "colour"];
            for (var iCat in defCat) {
               Blockly.Blocks[defCat[iCat]].HUE = colours.categories[defCat[iCat]];
            }
         }
      },

      getToolboxXml: function() {
         var categoriesInfos = {};
         var colours = this.getDefaultColours();

         // Reset the flyoutOptions for the variables and the procedures
         Blockly.Variables.resetFlyoutOptions();
         Blockly.Procedures.resetFlyoutOptions();

         // Initialize allBlocksAllowed
         this.allBlocksAllowed = [];
         this.addBlocksAllowed(['robot_start', 'placeholder_statement']);
         if(this.scratchMode) {
            this.addBlocksAllowed(['math_number', 'text']);
         }


         // *** Blocks from the lib
         if(this.includeBlocks.generatedBlocks && 'wholeCategories' in this.includeBlocks.generatedBlocks) {
            for(var blockType in this.includeBlocks.generatedBlocks.wholeCategories) {
              var categories = this.includeBlocks.generatedBlocks.wholeCategories[blockType];
              for(var i=0; i<categories.length; i++) {
                var category = categories[i];
                if(blockType in this.mainContext.customBlocks && category in this.mainContext.customBlocks[blockType]) {
                  var contextBlocks = this.mainContext.customBlocks[blockType][category];
                  var blockNames = [];
                  for(var i=0; i<contextBlocks.length; i++) {
                    blockNames.push(contextBlocks[i].name);
                  }
                  this.addBlocksAndCategories(
                    blockNames,
                    this.mainContext.customBlocks[blockType],
                    categoriesInfos
                  );
                }
              }
            }
         }
         if(this.includeBlocks.generatedBlocks && 'singleBlocks' in this.includeBlocks.generatedBlocks) {
            for(var blockType in this.includeBlocks.generatedBlocks.singleBlocks) {
              this.addBlocksAndCategories(
                this.includeBlocks.generatedBlocks.singleBlocks[blockType],
                this.mainContext.customBlocks[blockType],
                categoriesInfos
              );
            }
         }
         for (var blockType in this.includeBlocks.generatedBlocks) {
            if(blockType == 'wholeCategories' || blockType == 'singleBlocks') continue;
            this.addBlocksAndCategories(
              this.includeBlocks.generatedBlocks[blockType],
              this.mainContext.customBlocks[blockType],
              categoriesInfos
            );
         }

         for (var genName in this.simpleGenerators) {
            for (var iGen = 0; iGen < this.simpleGenerators[genName].length; iGen++) {
               var generator = this.simpleGenerators[genName][iGen];
               if (categoriesInfos[generator.category] == undefined) {
                  categoriesInfos[generator.category] = {
                     blocksXml: [],
                     colour: 210
                  };
               }
               var blockName = (genName == '.') ? generator.label + "__" : genName + "_" + generator.label + "__";
               categoriesInfos[generator.category].blocksXml.push("<block type='"+blockName+"'></block>");
            }
         }


         // *** Standard blocks
         var stdBlocks = this.getStdBlocks();

         // It is normally executed during load, but for 
         var taskStdInclude = (this.includeBlocks && this.includeBlocks.standardBlocks) || {};
         var tsiSingleBlocks = taskStdInclude.singleBlocks || [];
         if (this.scratchMode) {
            tsiSingleBlocks = this.blocksToScratch(tsiSingleBlocks);
         }
         var stdInclude = {
            wholeCategories: [],
            singleBlocks: [],
            excludedBlocks: []
         };

         // Merge all lists into stdInclude
         if (taskStdInclude.includeAll) {
            if(this.scratchMode) {
               stdInclude.wholeCategories = ["control", "input", "lists", "operator", "tables", "texts", "variables", "functions"];
            } else {
               stdInclude.wholeCategories = ["input", "logic", "loops", "math", "texts", "lists", "dicts", "tables", "variables", "functions"];
            }
         }
         mergeIntoArray(stdInclude.wholeCategories, taskStdInclude.wholeCategories || []);
         mergeIntoArray(stdInclude.singleBlocks, tsiSingleBlocks || []);
         mergeIntoArray(stdInclude.excludedBlocks, taskStdInclude.excludedBlocks || []);
         // Add block sets
         if(taskStdInclude.blockSets) {
            for(var iSet in taskStdInclude.blockSets) {
               mergeIntoObject(stdInclude, blocklySets[taskStdInclude.blockSets[iSet]]);
            }
         }

         // Prevent from using excludedBlocks if includeAll is set
         if(taskStdInclude.includeAll) { stdInclude.excludedBlocks = []; }

         // Remove excludedBlocks from singleBlocks
         for(var iBlock=0; iBlock < stdInclude.singleBlocks; iBlock++) {
            if(arrayContains(stdInclude.excludedBlocks, stdInclude.singleBlocks[iBlock])) {
               stdInclude.singleBlocks.splice(iBlock, 1);
               iBlock--;
            }
         }

         var handledCategories = [];
         for (var iCategory = 0; iCategory < stdInclude.wholeCategories.length; iCategory++) {
            var categoryName = stdInclude.wholeCategories[iCategory];
            if(this.scratchMode && !taskStdInclude.includeAll && blocklyToScratch.wholeCategories[categoryName]) {
               categoryName = blocklyToScratch.wholeCategories[categoryName];
            }

            if(arrayContains(handledCategories, categoryName)) { continue; }
            handledCategories.push(categoryName);

            if (!(categoryName in categoriesInfos)) {
               categoriesInfos[categoryName] = {
                  blocksXml: []
               };
            }
            if (categoryName == 'variables') {
               Blockly.Variables.flyoutOptions.any = true;
               continue;
            } else if (categoryName == 'functions') {
               Blockly.Procedures.flyoutOptions.includedBlocks = {noret: true, ret: true, ifret: true, noifret: true};
               continue;
            }
            var blocks = stdBlocks[categoryName];
            if(blocks) {
              if (!(blocks instanceof Array)) { // just for now, maintain backwards compatibility
                blocks = blocks.blocks;
              }

             var blockNames = [];
             for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
                if (!(blocks[iBlock].excludedByDefault) && !arrayContains(stdInclude.excludedBlocks, blocks[iBlock].name)) {
                   blockNames.push(blocks[iBlock].name);
                   categoriesInfos[categoryName].blocksXml.push(blocks[iBlock].blocklyXml);
                }
              }
              this.addBlocksAllowed(blockNames);
            }
         }

         var proceduresOptions = this.includeBlocks.procedures;
         if (typeof proceduresOptions !== 'undefined') {
            if(proceduresOptions.noret) { Blockly.Procedures.flyoutOptions.includedBlocks['noret'] = true; }
            if(proceduresOptions.ret) { Blockly.Procedures.flyoutOptions.includedBlocks['ret'] = true; }
            if(proceduresOptions.ifret) { Blockly.Procedures.flyoutOptions.includedBlocks['ifret'] = true; }
            if(proceduresOptions.noifret) { Blockly.Procedures.flyoutOptions.includedBlocks['noifret'] = true; }
            Blockly.Procedures.flyoutOptions.disableArgs = !!proceduresOptions.disableArgs;
         }

         var singleBlocks = stdInclude.singleBlocks;
         for(var iBlock = 0; iBlock < singleBlocks.length; iBlock++) {
            var blockName = singleBlocks[iBlock];
            if(blockName == 'procedures_defnoreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['noret'] = true;
            } else if(blockName == 'procedures_defreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['ret'] = true;
            } else if(blockName == 'procedures_ifreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['ifret'] = true;
            } else if(blockName == 'procedures_return') {
               Blockly.Procedures.flyoutOptions.includedBlocks['noifret'] = true;
            } else {
               continue;
            }
            // If we're here, a block has been found
            this.addBlocksAllowed([blockName, 'procedures_callnoreturn', 'procedures_callreturn']);
            singleBlocks.splice(iBlock, 1);
            iBlock--;
         }
         if(Blockly.Procedures.flyoutOptions.includedBlocks['noret']
               || Blockly.Procedures.flyoutOptions.includedBlocks['ret']
               || Blockly.Procedures.flyoutOptions.includedBlocks['ifret']
               || Blockly.Procedures.flyoutOptions.includedBlocks['noifret']) {
            if(Blockly.Procedures.flyoutOptions.includedBlocks['noret']) {
               this.addBlocksAllowed(['procedures_defnoreturn', 'procedures_callnoreturn']);
            }
            if(Blockly.Procedures.flyoutOptions.includedBlocks['ret']) {
               this.addBlocksAllowed(['procedures_defreturn', 'procedures_callreturn']);
            }
            if(Blockly.Procedures.flyoutOptions.includedBlocks['ifret']) {
               this.addBlocksAllowed(['procedures_ifreturn', 'procedures_return']);
            }
            if(Blockly.Procedures.flyoutOptions.includedBlocks['noifret']) {
               this.addBlocksAllowed(['procedures_return']);
            }
            categoriesInfos['functions'] = {
               blocksXml: []
            };
            if(this.scratchMode && !arrayContains(singleBlocks, 'math_number')) {
               singleBlocks.push('math_number'); // TODO :: temporary
            }
            if(!this.includeBlocks.groupByCategory) {
               console.error('Task configuration error: groupByCategory must be activated for functions.');
            }
         }
         this.addBlocksAndCategories(singleBlocks, stdBlocks, categoriesInfos);

         // Handle variable blocks, which are normally automatically added with
         // the VARIABLES category but can be customized here
         Blockly.Variables.flyoutOptions.anyButton = !!this.includeBlocks.groupByCategory;
         if (typeof this.includeBlocks.variables !== 'undefined') {
            Blockly.Variables.flyoutOptions.fixed = (this.includeBlocks.variables.length > 0) ? this.includeBlocks.variables : [];
            if (typeof this.includeBlocks.variablesOnlyBlocks !== 'undefined') {
               Blockly.Variables.flyoutOptions.includedBlocks = {get: false, set: false, incr: false};
               for (var iBlock=0; iBlock < this.includeBlocks.variablesOnlyBlocks.length; iBlock++) {
                  Blockly.Variables.flyoutOptions.includedBlocks[this.includeBlocks.variablesOnlyBlocks[iBlock]] = true;
               }
            }

            var varAnyIdx = Blockly.Variables.flyoutOptions.fixed.indexOf('*');
            if(varAnyIdx > -1) {
               Blockly.Variables.flyoutOptions.fixed.splice(varAnyIdx, 1);
               Blockly.Variables.flyoutOptions.any = true;
            }

            var blocksXml = Blockly.Variables.flyoutCategory();
            var xmlSer = new XMLSerializer();
            for(var i=0; i<blocksXml.length; i++) {
               blocksXml[i] = xmlSer.serializeToString(blocksXml[i]);
            }

            categoriesInfos["variables"] = {
               blocksXml: blocksXml,
               colour: 330
            }
         }

         if(Blockly.Variables.flyoutOptions.includedBlocks['get']) {
            this.addBlocksAllowed(['variables_get']);
         }
         if(Blockly.Variables.flyoutOptions.includedBlocks['set']) {
            this.addBlocksAllowed(['variables_set']);
         }
         if(Blockly.Variables.flyoutOptions.includedBlocks['incr']) {
            this.addBlocksAllowed(['math_change']);
         }

         // Disable arguments in procedures if variables are not allowed
         if (!Blockly.Variables.flyoutOptions.any && proceduresOptions && typeof proceduresOptions.disableArgs == 'undefined') {
            Blockly.Procedures.flyoutOptions.disableArgs = true;
         }

         var orderedCategories = [];
         if (this.includeBlocks.blocksOrder) {
            var blocksOrder = this.includeBlocks.blocksOrder;
            if(this.scratchMode) {
               blocksOrder = this.blocksToScratch(blocksOrder);
            }

            function getBlockIdx(blockXml) {
               var blockType = Blockly.Xml.textToDom(blockXml, "text/xml").getAttribute('type');
               var blockIdx = blocksOrder.indexOf(blockType);
               return blockIdx == -1 ? 10000 : blockIdx;
            }

            function getCategoryIdx(categoryName) {
               var categoryIdx = blocksOrder.indexOf(categoryName);
               if(categoryIdx != -1) { return categoryIdx; }
               for(var iBlock = 0; iBlock < categoriesInfos[categoryName].blocksXml.length; iBlock++) {
                  var blockXml = categoriesInfos[categoryName].blocksXml[iBlock];
                  var blockIdx = getBlockIdx(blockXml);
                  if(blockIdx != 10000) {
                     return blockIdx;
                  }
               }
               return 10000;
            }

            for (var categoryName in categoriesInfos) {
               orderedCategories.push(categoryName);
               categoriesInfos[categoryName].blocksXml.sort(function(a, b) {
                  var indexA = getBlockIdx(a);
                  var indexB = getBlockIdx(b);
                  return indexA - indexB;
               });
            }
            orderedCategories.sort(function(a, b) {
               var indexA = getCategoryIdx(a);
               var indexB = getCategoryIdx(b);
               return indexA - indexB;
            });
         } else {
            for (var categoryName in categoriesInfos) {
               orderedCategories.push(categoryName);
            }
         }

         var xmlString = "";
         for (var iCategory = 0; iCategory < orderedCategories.length; iCategory++) {
            var categoryName = orderedCategories[iCategory];
            var categoryInfo = categoriesInfos[categoryName];
            if (this.includeBlocks.groupByCategory) {
               var colour = categoryInfo.colour;
               if (typeof(colour) == "undefined") {
                  colour = colours.categories[categoryName]
                  if (typeof(colour) == "undefined") {
                     colour = colours.categories._default;
                  }
               }
               xmlString += "<category "
                          + " name='" + this.strings.categories[categoryName] + "'"
                          + " colour='" + colour + "'"
                          + (this.scratchMode ? " secondaryColour='" + colour + "'" : '')
                          + (categoryName == 'variables' ? ' custom="VARIABLE"' : '')
                          + (categoryName == 'functions' ? ' custom="PROCEDURE"' : '')
                          + ">";
            }
            var blocks = categoryInfo.blocksXml;
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               xmlString += blocks[iBlock];
            }
            if (this.includeBlocks.groupByCategory) {
               xmlString += "</category>";
            }
         }

         (function (strings) {
            xmlString = xmlString.replace(/{(\w+)}/g, function(m, p1) {return strings[p1]}); // taken from blockly/demo/code
         })(this.strings);

         return xmlString;
      },


      addExtraBlocks: function() {
         var that = this;


         Blockly.Blocks['controls_untilWhile'] = Blockly.Blocks['controls_whileUntil'];
         Blockly.JavaScript['controls_untilWhile'] = Blockly.JavaScript['controls_whileUntil'];
         Blockly.Python['controls_untilWhile'] = Blockly.Python['controls_whileUntil'];

         Blockly.Blocks['math_angle'] = {
            init: function() {
               this.setOutput(true, 'Number');
               this.appendDummyInput()
                   .appendField(new Blockly.FieldAngle(90), "ANGLE");
               this.setColour(Blockly.Blocks.math.HUE);
            }
         };
         Blockly.JavaScript['math_angle'] = function(block) {
           return ['' + block.getFieldValue('ANGLE'), Blockly.JavaScript.ORDER_FUNCTION_CALL];
         };
         Blockly.Python['math_angle'] = function(block) {
           return ['' + block.getFieldValue('ANGLE'), Blockly.Python.ORDER_FUNCTION_CALL];
         };

         Blockly.Blocks['math_extra_single'] = {
           /**
            * Block for advanced math operators with single operand.
            * @this Blockly.Block
            */
           init: function() {
             var OPERATORS =
                 [
                  [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
                  ['-', 'NEG']
             ];
             this.setHelpUrl(Blockly.Msg.MATH_SINGLE_HELPURL);
             this.setColour(Blockly.Blocks.math.HUE);
             this.setOutput(true, 'Number');
             this.appendValueInput('NUM')
                 .setCheck('Number')
                 .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
             // Assign 'this' to a variable for use in the tooltip closure below.
             var thisBlock = this;
             this.setTooltip(function() {
               var mode = thisBlock.getFieldValue('OP');
               var TOOLTIPS = {
                 'ABS': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
                 'NEG': Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG
               };
               return TOOLTIPS[mode];
             });
           }
         };

         Blockly.JavaScript['math_extra_single'] = Blockly.JavaScript['math_single'];
         Blockly.Python['math_extra_single'] = Blockly.Python['math_single'];


         Blockly.Blocks['math_extra_double'] = {
           /**
            * Block for advanced math operators with double operand.
            * @this Blockly.Block
            */
           init: function() {
             var OPERATORS =
                 [
                  ['min', 'MIN'],
                  ['max', 'MAX']
             ];
             this.setColour(Blockly.Blocks.math.HUE);
             this.setInputsInline(true);
             this.setOutput(true, 'Number');
             this.appendDummyInput('OP').appendField(new Blockly.FieldDropdown([["min", "MIN"], ["max", "MAX"], ["", ""]]), "OP");
             this.appendDummyInput().appendField(" entre ");
             this.appendValueInput('A').setCheck('Number');
             this.appendDummyInput().appendField(" et ");
             this.appendValueInput('B').setCheck('Number');
             // Assign 'this' to a variable for use in the tooltip closure below.
             var thisBlock = this;
             this.setTooltip(function() {
               var mode = thisBlock.getFieldValue('OP');
               var TOOLTIPS = {
                 'MIN': that.strings.smallestOfTwoNumbers,
                 'MAX': that.strings.greatestOfTwoNumbers
               };
               return TOOLTIPS[mode];
             });
           }
         };

         Blockly.JavaScript['math_extra_double'] = function(block) {
           // Math operators with double operand.
           var operator = block.getFieldValue('OP');
           var arg1 = Blockly.JavaScript.valueToCode(block, 'A',  Blockly.JavaScript.ORDER_NONE) || '0';
           var arg2 = Blockly.JavaScript.valueToCode(block, 'B',  Blockly.JavaScript.ORDER_NONE) || '0';
           if (operator == 'MIN') {
             var code = "Math.min(" + arg1 + ", " + arg2 + ")";
           }
           if (operator == 'MAX') {
             var code = "Math.max(" + arg1 + ", " + arg2 + ")";
           }
           return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
         };

         Blockly.Python['math_extra_double'] = function(block) {
           // Math operators with double operand.
           var operator = block.getFieldValue('OP');
           var arg1 = Blockly.Python.valueToCode(block, 'A',  Blockly.Python.ORDER_NONE) || '0';
           var arg2 = Blockly.Python.valueToCode(block, 'B',  Blockly.Python.ORDER_NONE) || '0';
           if (operator == 'MIN') {
             var code = "Math.min(" + arg1 + ", " + arg2 + ")";
           }
           if (operator == 'MAX') {
             var code = "Math.max(" + arg1 + ", " + arg2 + ")";
           }
           return [code, Blockly.Python.ORDER_FUNCTION_CALL];
         };

         Blockly.Blocks['controls_loop'] = {
           init: function() {
             this.appendDummyInput()
             .appendField(that.strings.loopRepeat);
             this.appendStatementInput("inner_blocks")
             .setCheck(null)
             .appendField(that.strings.loopDo);
             this.setPreviousStatement(true, null);
             this.setNextStatement(true, null);
             this.setColour(that.getDefaultColours().categories["loops"])
             this.setTooltip("");
             this.setHelpUrl("");
           }
         }
         Blockly.JavaScript['controls_loop'] = function(block) {
           var statements = Blockly.JavaScript.statementToCode(block, 'inner_blocks');
           var code = 'while(true){\n' + statements + '}\n';
           return code;
         };


         Blockly.Blocks['controls_infiniteloop'] = {
           init: function() {
             this.appendStatementInput("inner_blocks")
             .setCheck(null)
             .appendField(that.strings.infiniteLoop);
             this.setPreviousStatement(true, null);
             this.setNextStatement(false, null);
             this.setColour(that.getDefaultColours().categories["loops"])
             this.setTooltip("");
             this.setHelpUrl("");
           }
         }
         Blockly.JavaScript['controls_infiniteloop'] = function(block) {
           var statements = Blockly.JavaScript.statementToCode(block, 'inner_blocks');
           var code = 'while(true){\n' + statements + '}\n';
           return code;
         };
         Blockly.Python['controls_infiniteloop'] = function(block) {
            // Do while/until loop.
            var branch = Blockly.Python.statementToCode(block, 'inner_blocks');
            branch = Blockly.Python.addLoopTrap(branch, block.id) ||
                Blockly.Python.PASS;

            return 'while True:\n' + branch;
          };

         if(this.scratchMode) {
            Blockly.Blocks['robot_start'] = {
              init: function() {
                this.jsonInit({
                  "id": "event_whenflagclicked",
                  "message0": that.strings.startingBlockName,
                  // former Scratch-like display
                  /*"message0": that.strings.flagClicked,
                  "args0": [
                    {
                      "type": "field_image",
                      "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_whenflagclicked.svg",
                      "width": 24,
                      "height": 24,
                      "alt": "flag",
                      "flip_rtl": true
                    }
                  ],*/
                  "inputsInline": true,
                  "nextStatement": null,
                  "category": Blockly.Categories.event,
                  "colour": Blockly.Colours.event.primary,
                  "colourSecondary": Blockly.Colours.event.secondary,
                  "colourTertiary": Blockly.Colours.event.tertiary
                });
              }
            };

            Blockly.Blocks['placeholder_statement'] = {
              init: function() {
                this.jsonInit({
                  "id": "placeholder_statement",
                  "message0": "",
                  "inputsInline": true,
                  "previousStatement": null,
                  "nextStatement": null,
                  "category": Blockly.Categories.event,
                  "colour": "#BDCCDB",
                  "colourSecondary": "#BDCCDB",
                  "colourTertiary": "#BDCCDB"
                });
                this.appendDummyInput().appendField("                    ");
              }
            };

            Blockly.JavaScript['control_forever'] = function(block) {
              var statements = Blockly.JavaScript.statementToCode(block, 'SUBSTACK');
              var code = 'while(true){\n' + statements + '}\n';
              return code;
            };
            Blockly.Python['control_forever'] = function(block) {
              // Do while/until loop.
              var branch = Blockly.Python.statementToCode(block, 'SUBSTACK');
              branch = Blockly.Python.addLoopTrap(branch, block.id) ||
                  Blockly.Python.PASS;

              return 'while True:\n' + branch;
           };

         } else {
            if (!this.mainContext.infos || !this.mainContext.infos.showIfMutator) {
               var old = Blockly.Blocks.controls_if.init;
               Blockly.Blocks.controls_if.init = function() {
                  old.call(this);
                  this.setMutator(undefined)
               };
            }

            Blockly.Blocks['robot_start'] = {
              init: function() {
                this.appendDummyInput()
                    .appendField(that.strings.startingBlockName);
                this.setNextStatement(true);
                this.setColour(210);
                this.setTooltip('');
                this.deletable_ = false;
                this.editable_ = false;
                this.movable_ = false;
            //    this.setHelpUrl('http://www.example.com/');
              }
            };

            Blockly.Blocks['placeholder_statement'] = {
              init: function() {
                this.appendDummyInput()
                    .appendField("                    ");
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.setColour(210);
                this.setTooltip('');
            //    this.setHelpUrl('http://www.example.com/');
              }
            };
         }

         Blockly.JavaScript['robot_start'] = function(block) {
           return "";
         };

         Blockly.Python['robot_start'] = function(block) {
           return "";
         };

         Blockly.JavaScript['placeholder_statement'] = function(block) {
           return "";
         };

         Blockly.Python['placeholder_statement'] = function(block) {
           return "pass";
         }
      },

      blocksToScratch: function(blockList) {
         var scratchBlocks = [];
         for (var iBlock = 0;  iBlock < blockList.length; iBlock++) {
            var blockName = blockList[iBlock];
            if(blocklyToScratch.singleBlocks[blockName]) {
               for(var b=0; b<blocklyToScratch.singleBlocks[blockName].length; b++) {
                  scratchBlocks.push(blocklyToScratch.singleBlocks[blockName][b]);
               }
            } else {
                scratchBlocks.push(blockName);
            }
         }
         return scratchBlocks;
      },

      fixScratch: function() {
         // Store the maxBlocks information somewhere, as Scratch ignores it
         Blockly.Workspace.prototype.maxBlocks = function () { return maxBlocks; };

         // Translate requested Blocks from Blockly to Scratch blocks
         // TODO :: full translation
         this.includeBlocks.standardBlocks.singleBlocks = this.blocksToScratch(this.includeBlocks.standardBlocks.singleBlocks || []);
      },

      getFullCode: function(code) {
         return this.getBlocklyLibCode(this.generators) + code + "program_end()";
      },

      checkCode: function(code, display) {
         // TODO :: check a code is okay for validation; for now it's checked
         // by getCode so this function is not useful in the Blockly/Scratch
         // version
         return true;
      },

      checkCodes: function(codes, display) {
         // Check multiple codes
         for(var i = 0; i < codes.length; i++) {
            if(!this.checkCode(codes[i], display)) {
               return false;
            }
         }
         return true;
      },

      checkBlocksAreAllowed: function(xml, silent) {
         if(this.includeBlocks && this.includeBlocks.standardBlocks && this.includeBlocks.standardBlocks.includeAll) { return true; }
         var allowed = this.getBlocksAllowed();
         var blockList = xml.getElementsByTagName('block');
         var notAllowed = [];
         var that = this;
         function checkBlock(block) {
            var blockName = block.getAttribute('type');
            blockName = that.normalizeType(blockName);
            if(!arrayContains(allowed, blockName)) {
               notAllowed.push(blockName);
            }
         }
         for(var i=0; i<blockList.length; i++) {
            checkBlock(blockList[i]);
         }
         if(xml.localName == 'block') {
            // Also check the top element
            checkBlock(xml);
         }
         if(!silent && notAllowed.length > 0) {
            console.error('Error: tried to load programs with unallowed blocks '+notAllowed.join(', '));
         }
         return !(notAllowed.length);
      },

      cleanBlockAttributes: function(xml, origin) {
         // Clean up block attributes
         if(!origin) {
            origin = {x: 0, y: 0};
         }
         var blockList = xml.getElementsByTagName('block');
         var minX = Infinity, minY = Infinity;
         for(var i=0; i<blockList.length; i++) {
            var block = blockList[i];
            var blockId = block.getAttribute('id');

            // Clean up read-only attributes
            if(block.getAttribute('type') != 'robot_start' && this.startingExampleIds.indexOf(blockId) == -1) {
               block.removeAttribute('deletable');
               block.removeAttribute('movable');
               block.removeAttribute('editable');
            }

            // Clean up IDs which contain now forbidden characters
            if(blockId && (blockId.indexOf('%') != -1 || blockId.indexOf('$') != -1 || blockId.indexOf('^') != -1)) {
               block.setAttribute('id', Blockly.genUid());
            }

            // Get minimum x and y
            var x = block.getAttribute('x');
            if(x !== null) { minX = Math.min(minX, parseInt(x)); }
            var y = block.getAttribute('y');
            if(y !== null) { minY = Math.min(minY, parseInt(y)); }
         }

         // Move blocks to start at x=0, y=0
         for(var i=0; i<blockList.length; i++) {
            var block = blockList[i];
            var x = block.getAttribute('x');
            if(x !== null) {
                block.setAttribute('x', parseInt(x) - minX + origin.x);
            }
            var y = block.getAttribute('y');
            if(y !== null) {
                block.setAttribute('y', parseInt(y) - minY + origin.y);
            }
         }
      },

      getStartingExampleIds: function(xml) {
         this.startingExampleIds = [];
         var blockList = Blockly.Xml.textToDom(xml).getElementsByTagName('block');
         for(var i=0; i<blockList.length; i++) {
            var block = blockList[i];
            var blockId = block.getAttribute('id');
            if(!blockId) {
               if(block.getAttribute('type') != 'robot_start' && 
                     (block.getAttribute('deletable') == 'false' ||
                     block.getAttribute('movable') == 'false' ||
                     block.getAttribute('editable') == 'false')) {
                  console.log('Warning: starting block of type \'' + block.getAttribute('type') + '\' with read-only attributes has no id, these attributes will be removed.');
               }
               continue;
            }
            this.startingExampleIds.push(blockId);
         }
      },
   };
}

/*
    blockly_interface:
        Blockly mode interface and running logic
*/

function getBlocklyInterface(maxBlocks, subTask) {
   return {
      subTask: subTask,
      isBlockly: true,
      scratchMode: (typeof Blockly.Blocks['control_if'] !== 'undefined'),
      maxBlocks: maxBlocks,
      textFile: null,
      extended: false,
      programs: [],
      language: (typeof Blockly.Blocks['control_if'] !== 'undefined') ? 'scratch' : 'blockly',
      languages: [],
      locale: 'fr',
      definitions: {},
      simpleGenerators: {},
      codeId: 0, // Currently edited node code
      workspace: null,
      prevWidth: 0,
      options: {},
      initialScale: 1,
      nbTestCases: 1,
      divId: 'blocklyDiv',
      hidden: false,
      trashInToolbox: false,
      languageStrings: window.LanguageStrings,
      startingBlock: true,
      startingExampleIds: [],
      mediaUrl: (
         (window.location.protocol == 'file:' && modulesPath)
            ? modulesPath+'/img/blockly/'
            : (window.location.protocol == 'https:' ? 'https:' : 'http:') + "//static4.castor-informatique.fr/contestAssets/blockly/"
         ),
      unloaded: false,
      reloadForFlyout: 0,
      display: false,
      readOnly: false,
      reportValues: true,
      quickAlgoInterface: window.quickAlgoInterface,

      highlightedBlocks: [],

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {},
         standardBlocks: {
            includeAll: true,
            wholeCategories: [],
            singleBlocks: []
         }
      },

      loadHtml: function(nbTestCases) {
         $("#languageInterface").html("<xml id='toolbox' style='display: none'></xml>" +
                                     "  <div style='height: 40px;display:none' id='lang'>" +
                                     "    <p>" + this.strings.selectLanguage +
                                     "      <select id='selectLanguage' onchange='task.displayedSubTask.blocklyHelper.changeLanguage()'>" +
                                     "        <option value='blockly'>" + this.strings.blocklyLanguage + "</option>" +
                                     "        <option value='javascript'>" + this.strings.javascriptLanguage + "</option>" +
                                     "      </select>" +
                                     "      <input type='button' class='language_javascript' value='" + this.strings.importFromBlockly +
                                     "' style='display:none' onclick='task.displayedSubTask.blocklyHelper.importFromBlockly()' />" +
                                     "    </p>" +
                                     "  </div>" +
                                     "  <div id='blocklyContainer'>" +
                                     "    <div id='blocklyDiv' class='language_blockly'></div>" +
                                     "    <textarea id='program' class='language_javascript' style='width:100%;height:100%;display:none'></textarea>" +
                                     "  </div>\n");

         if(this.scratchMode) {
            $("submitBtn").html("<img src='" + this.mediaUrl + "icons/event_whenflagclicked.svg' height='32px' width='32px' style='vertical-align: middle;'>" + $("submitBtn").html());
         }
      },

      loadContext: function (mainContext) {
         this.mainContext = mainContext;
         this.createGeneratorsAndBlocks();
      },

      load: function(locale, display, nbTestCases, options) {
         this.unloaded = false;

         FioiBlockly.loadLanguage(locale);

         if(this.scratchMode) {
            this.fixScratch();
         }

         if (options == undefined) options = {};
         if (options.divId) this.divId = options.divId;

         this.strings = window.languageStrings;
         if (options.startingBlockName) {
            this.strings.startingBlockName = options.startingBlockName;
         }

         if (options.maxListSize) {
            FioiBlockly.maxListSize = options.maxListSize;
         }
         this.placeholderBlocks = options.placeholderBlocks;

         this.locale = locale;
         this.nbTestCases = nbTestCases;
         this.options = options;

         this.addExtraBlocks();
         this.createSimpleGeneratorsAndBlocks();

         this.display = display;

         if (display) {
            this.loadHtml(nbTestCases);
            var xml = this.getToolboxXml();
            var wsConfig = {
               toolbox: "<xml>"+xml+"</xml>",
               comments: true,
               sounds: false,
               trashcan: true,
               media: this.mediaUrl,
               scrollbars: true,
               zoom: { startScale: 1 }
            };

            if(typeof options.scrollbars != 'undefined') { wsConfig.scrollbars = !!options.scrollbars; }
            // IE <= 10 needs scrollbars
            if(navigator.userAgent.indexOf("MSIE") > -1) { wsConfig.scrollbars = true; }

            wsConfig.readOnly = !!options.readOnly || this.readOnly;
            if(options.zoom) {
               wsConfig.zoom.controls = !!options.zoom.controls;
               wsConfig.zoom.wheel = !!options.zoom.wheel;
               wsConfig.zoom.startScale = options.zoom.scale ? options.zoom.scale : 1;
            }
            if (this.scratchMode) {
               wsConfig.zoom.startScale = wsConfig.zoom.startScale * 0.75;
            }
            this.initialScale = wsConfig.zoom.startScale;
            if(wsConfig.zoom.controls && window.blocklyUserScale) {
               wsConfig.zoom.startScale *= window.blocklyUserScale;
            }
            if(this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = $('#blocklyDiv').width() - 110;
            }
            if(options.disable !== undefined) { wsConfig.disable = options.disable; }

            // Clean events if the previous unload wasn't done properly
            Blockly.removeEvents();

            // Inject Blockly
            window.blocklyWorkspace = this.workspace = Blockly.inject(this.divId, wsConfig);

            // Start checking whether it's hidden, to sort out contents
            // automatically when it's displayed
            if(this.hiddenCheckTimeout) {
               clearTimeout(this.hiddenCheckTimeout);
            }
            if(!options.noHiddenCheck) {
               this.hiddenCheckTimeout = setTimeout(this.hiddenCheck.bind(this), 0);
            }

            var toolboxNode = $('#toolboxXml');
            if (toolboxNode.length != 0) {
               toolboxNode.html(xml);
            }

            // Restore clipboard if allowed
            if(window.blocklyClipboardSaved) {
               if(this.checkBlocksAreAllowed(window.blocklyClipboardSaved)) {
                  Blockly.clipboardXml_ = window.blocklyClipboardSaved;
               } else {
                  // Set to false to indicate that blocks were disallowed
                  Blockly.clipboardXml_ = false;
               }
               Blockly.clipboardSource_ = this.workspace;
            }

            $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
            this.workspace.addChangeListener(this.onChange.bind(this));
            this.onChange();
         } else {
            var tmpOptions = new Blockly.Options({});
            this.workspace = new Blockly.Workspace(tmpOptions);
         }

         this.programs = [];
         for (var iCode = this.mainContext.nbCodes - 1; iCode >= 0; iCode--) {
            this.programs[iCode] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
            this.languages[iCode] = "blockly";
            this.setCodeId(iCode);
            if(this.startingBlock || options.startingExample) {
               var xml = this.getDefaultContent();
               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }

         var that = this;
         Blockly.BlockSvg.terminateDragCallback = function () {
             that.dragJustTerminated = true;
         };

         if(window.quickAlgoInterface) { quickAlgoInterface.updateControlsDisplay(); }
      },

      unloadLevel: function() {
         if(this.hiddenCheckTimeout) {
            clearTimeout(this.hiddenCheckTimeout);
         }
         this.unloaded = true; // Prevents from saving programs after unload

         try {
            // Need to hide the WidgetDiv before disposing of the workspace
            Blockly.WidgetDiv.hide();
         } catch(e) {}

         // Save clipboard
         if(this.display && Blockly.clipboardXml_) {
            window.blocklyClipboardSaved = Blockly.clipboardXml_;
         }

         var ws = this.workspace;
         if (ws != null) {
            try {
               ws.dispose();
            } catch(e) {}
         }
      },

      unload: function() {
         if(this.hiddenCheckTimeout) {
            clearTimeout(this.hiddenCheckTimeout);
         }
         this.unloadLevel();
         removeBlockly();
      },

      reload: function() {
         // Reload Blockly editor
         this.reloading = true;
         this.savePrograms();
         var programs = this.programs;
         this.unloadLevel();
         $('#'+this.divId).html('');
         this.load(this.locale, true, this.nbTestCases, this.options);
         this.programs = programs;
         this.loadPrograms();
         if(window.quickAlgoInterface) {
            quickAlgoInterface.onResize();
         }
         this.reloading = false;
      },

      setReadOnly: function(newState) {
         if(!!newState == this.readOnly) { return; }
         this.readOnly = !!newState;

         // options.readOnly has priority
         if(this.options.readOnly) { return; }

         this.reload();
      },

      onResizeFct: function() {
         // onResize function to be called by the interface
         if(document.documentElement.clientHeight < 600 || document.documentElement.clientWidth < 800) {
            FioiBlockly.trashcanScale = 0.75;
            FioiBlockly.zoomControlsScale = 0.9;
         } else {
            FioiBlockly.trashcanScale = 1;
            FioiBlockly.zoomControlsScale = 1;
         }
         Blockly.svgResize(this.workspace);

         // Reload Blockly if the flyout is not properly rendered
         if (this.workspace.flyout_ && this.reloadForFlyout < 5) {
            var flyoutWidthDiff = Math.abs(this.workspace.flyout_.svgGroup_.getBoundingClientRect().width -
               this.workspace.flyout_.svgBackground_.getBoundingClientRect().width);
            if(flyoutWidthDiff > 5) {
               this.reloadForFlyout += 1;
               this.reload();
            }
         }
      },

      onResize: function() {
         // This function will replace itself with the debounced onResizeFct
         this.onResize = debounce(this.onResizeFct.bind(this), 500, true);
         this.onResizeFct();
      },

      hiddenCheck: function() {
         // Check whether the Blockly editor is hidden
         var visible = $('#'+this.divId).is(':visible');
         if(this.hidden && visible) {
            this.hidden = false;
            // Reload the Blockly editor to remove display issues after
            // being hidden
            this.reload();
            return; // it will be restarted by reload
         }
         this.hidden = !visible;
         this.hiddenCheckTimeout = setTimeout(this.hiddenCheck.bind(this), 500);
      },

      onChangeResetDisplayFct: function() {
         if(this.unloaded || this.reloading) { return; }
         this.highlightBlock(null);
         if(this.quickAlgoInterface && !this.reloading) {
            this.quickAlgoInterface.resetTestScores();
         }
         if(this.keepDisplayedError) {
            // Do not clear the error this time
            this.keepDisplayedError = false;
         } else {
            this.displayError('');
         }
      },

      onChangeResetDisplay: function() {
         // This function will replace itself with the debounced onChangeResetDisplayFct
         this.onChangeResetDisplay = debounce(this.onChangeResetDisplayFct.bind(this), 500, false);
         this.onChangeResetDisplayFct();
      },

      resetDisplay: function() {
         this.highlightBlock(null);
         if(!this.scratchMode && Blockly.selected) {
            // Do not execute that while the user is moving blocks around
            Blockly.selected.unselect();
         }
      },

      getCapacityInfo: function() {
         var remaining = 1;
         var text = '';
         if(maxBlocks) {
            // Update the remaining blocks display
            remaining = this.getRemainingCapacity(this.workspace);
            var optLimitBlocks = {
               maxBlocks: maxBlocks,
               remainingBlocks: Math.abs(remaining)
            };
            var strLimitBlocks = remaining < 0 ? this.strings.limitBlocksOver : this.strings.limitBlocks;
            text = strLimitBlocks.format(optLimitBlocks);
         }

         if(remaining < 0) {
            return {text: text, invalid: true, type: 'capacity'};
         }

         // We're over the block limit, is there any block used too often?
         var limited = this.findLimited(this.workspace);
         if(limited) {
            var errorMsg = typeof limited == 'string' ? this.strings.limitedBlock : this.strings.limitedBlocks;
            errorMsg += ' ';
            errorMsg += this.getBlockLabel(limited, true);
            errorMsg += '.';
            return {text: errorMsg, invalid: true, type: 'limited'};
         } else if(remaining == 0) {
            return {text: text, warning: true, type: 'capacity'};
         }
         return {text: text, type: 'capacity'};
      },

      onChange: function(event) {
         var eventType = event ? event.constructor : null;

         var isBlockEvent = event ? (
            eventType === Blockly.Events.Create ||
            eventType === Blockly.Events.Delete ||
            eventType === Blockly.Events.Move ||
            eventType === Blockly.Events.Change) : true;

         if(isBlockEvent) {
            if(eventType !== Blockly.Events.Move) {
               // Capacity info won't change during a move
               // Also avoids issues due to blocks being duplicated during move
               var capacityInfo = this.getCapacityInfo();
               if(window.quickAlgoInterface) {
                  window.quickAlgoInterface.displayCapacity(capacityInfo);
                  window.quickAlgoInterface.onEditorChange();
               } else {
                  $('#capacity').html(capacityInfo.text);
               }
            }
            this.onChangeResetDisplay();
            if(this.subTask) {
               this.subTask.onChange();
            }
            if (this.mainContext.onChange) {
               this.mainContext.onChange();
            }
         } else if(event.element != 'category' && event.element != 'selected') {
            Blockly.svgResize(this.workspace);
         }

         // Refresh the toolbox for new procedures (same with variables
         // but it's already handled correctly there)
         if(this.scratchMode && this.includeBlocks.groupByCategory && this.workspace.toolbox_
           && (eventType === Blockly.Events.Change || this.dragJustTerminated)
         ) {
            this.dragJustTerminated = false;
            this.workspace.toolbox_.refreshSelection();
         }
      },

      setIncludeBlocks: function(includeBlocks) {
         this.includeBlocks  = includeBlocks;
      },

      getEmptyContent: function() {
         if(this.startingBlock) {
            if(this.scratchMode) {
               return '<xml><block type="robot_start" deletable="false" movable="false" x="10" y="20"></block></xml>';
            } else {
               return '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
            }
         }
         else {
            return '<xml></xml>';
         }
      },

      getDefaultContent: function() {
         var xml = this.options.startingExample && this.options.startingExample[this.language];
         if(xml) {
            this.getStartingExampleIds(xml);
            return xml;
         }
         return this.getEmptyContent();
      },

      checkRobotStart: function () {
         if(!this.startingBlock || !this.workspace) { return; }
         var blocks = this.workspace.getTopBlocks(true);
         for(var b=0; b<blocks.length; b++) {
            if(blocks[b].type == 'robot_start') { return;}
         }

         var xml = Blockly.Xml.textToDom(this.getEmptyContent())
         Blockly.Xml.domToWorkspace(xml, this.workspace);
      },

      getOrigin: function() {
         // Get x/y origin
         if(this.includeBlocks.groupByCategory && typeof this.options.scrollbars != 'undefined' && !this.options.scrollbars) {
            return this.scratchMode ? {x: 340, y: 20} : {x: 105, y: 2};
         }
         return this.scratchMode ? {x: 4, y: 20} : {x: 2, y: 2};
      },

      // TODO :: New version of these three functions when we'll have multiple
      // node programs we can edit
      setCodeId: function(newCodeId) {
         this.codeId = newCodeId;
         $("#selectCodeId").val(this.codeId);
         $(".robot0, .robot1").hide();
         $(".robot" + this.codeId).show();
      },

      changeCodeId: function() {
         this.loadCodeId($("#selectCodeId").val());
      },

      loadCodeId: function(codeId) {
         this.savePrograms();
         this.codeId = codeId;
         for (var iCode = 0; iCode < this.mainContext.nbCodes; iCode++) {
            $(".robot" + iCode).hide();
         }
         $(".robot" + this.codeId).show();

         $(".language_blockly, .language_javascript").hide();
         $(".language_" + this.languages[this.codeId]).show();

         var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
         $("#selectLanguage").val(this.languages[this.codeId]);
         if (this.languages[this.codeId] == "blockly") {
            blocklyElems.show();
         } else {
            blocklyElems.hide();
            $(".blocklyTooltipDiv").hide();
         }
         this.loadPrograms();
      },

      savePrograms: function() {
         if(this.unloaded) {
            console.error('savePrograms called after unload');
            return;
         }

         // Save zoom
         if(this.display && this.workspace.scale) {
             window.blocklyUserScale = this.workspace.scale / this.initialScale;
         }

         this.checkRobotStart();

         this.programs[this.codeId].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.cleanBlockAttributes(xml);

            // The additional variable contain all additional things that we can save, for example quickpi sensors,
            // subject title when edition is enabled...
            var additional = {};

            if (this.quickAlgoInterface && this.quickAlgoInterface.saveAdditional)
               this.quickAlgoInterface.saveAdditional(additional);

            var additionalNode = document.createElement("additional");
            additionalNode.innerText = JSON.stringify(additional);
            xml.appendChild(additionalNode);

            this.programs[this.codeId].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.codeId].blocklyJS = this.getCode("javascript");
            //this.programs[this.codeId].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.codeId].blockly);
            this.workspace.clear();
            this.cleanBlockAttributes(xml, this.getOrigin());
            Blockly.Xml.domToWorkspace(xml, this.workspace);

            var additionalXML = xml.getElementsByTagName("additional");
            if (additionalXML.length > 0) {
               try {
                  var additional = JSON.parse(additionalXML[0].innerHTML);
                  // load additional from quickAlgoInterface
                  if (this.quickAlgoInterface.loadAdditional) {
                     this.quickAlgoInterface.loadAdditional(additional);
                  }
               } catch(e) {}
            }
         }
         $("#program").val(this.programs[this.codeId].javascript);
      },

      loadProgramFromDom: function(xml) {
         if(!this.checkBlocksAreAllowed(xml)) {
            return;
         }

         // Shift to x=200 y=20 + offset
         if(!this.exampleOffset) { this.exampleOffset = 0; }
         var origin = this.getOrigin();
         origin.x += 200 + this.exampleOffset;
         origin.y += 20 + this.exampleOffset;
         // Add an offset of 10 each time, so if someone clicks the button
         // multiple times the blocks don't stack
         this.exampleOffset += 10;

         // Remove robot_start
         if(xml.children.length == 1 && xml.children[0].getAttribute('type') == 'robot_start') {
            xml = xml.firstChild.firstChild;
         }

         this.cleanBlockAttributes(xml, origin);

         Blockly.Xml.domToWorkspace(xml, this.workspace);

         this.highlightBlock(xml.firstChild.getAttribute('id'));
      },

      loadExample: function(exampleObj) {
         var example = this.scratchMode ? exampleObj.scratch : exampleObj.blockly
         if (this.workspace != null && example) {
            var xml = Blockly.Xml.textToDom(example);
            this.loadProgramFromDom(xml);
         }
      },

      changeLanguage: function() {
         this.languages[this.codeId] = $("#selectLanguage").val();
         this.loadCodeId(this.codeId);
      },

      importFromBlockly: function() {
          var codeId = 0;
          this.programs[this.codeId].javascript = this.getCode("javascript");
          $("#program").val(this.programs[this.codeId].javascript);
      },

      handleFiles: function(files) {
         var that = this;
         if (files.length < 0) {
            return;
         }
         var file = files[0];
         var textType = /text.*/;
         if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
               var code = reader.result;
               if (code[0] == "<") {
                  try {
                     var xml = Blockly.Xml.textToDom(code);
                     that.cleanBlockAttributes(xml);
                     if(!that.checkBlocksAreAllowed(xml)) {
                        throw 'not allowed'; // TODO :: check it's working properly
                     }
                     that.programs[that.codeId].blockly = code;
                     that.languages[that.codeId] = "blockly";
                  } catch(e) {
                     that.displayError('<span class="testError">'+that.strings.invalidContent+'</span>');
                     that.keepDisplayedError = true;
                  }
               } else {
                  that.programs[that.codeId].javascript = code;
                  that.languages[that.codeId] = "javascript";
               }
               that.loadPrograms();
               that.loadCodeId(that.codeId);
            }

            reader.readAsText(file);
         } else {
            that.displayError('<span class="testError">'+this.strings.unknownFileType+'</span>');
            that.keepDisplayedError = true;
         }
      },

      saveProgram: function() {
         this.savePrograms();
         var code = this.programs[this.codeId][this.languages[this.codeId]];
         var data = new Blob([code], {type: 'text/plain'});

         // If we are replacing a previously generated file we need to
         // manually revoke the object URL to avoid memory leaks.
         if (this.textFile !== null) {
           window.URL.revokeObjectURL(this.textFile);
         }

         this.textFile = window.URL.createObjectURL(data);

         // returns a URL you can use as a href
         $("#saveUrl").html(" <a id='downloadAnchor' href='" + this.textFile + "' download='robot_" + this.language + "_program.txt'>" + this.strings.download + "</a>");
         var downloadAnchor = document.getElementById('downloadAnchor');
         downloadAnchor.click();
         return this.textFile;
      },

      toggleSize: function() {
         if (!this.extended) {
            this.extended = true;
            $("#blocklyContainer").css("width", "800px");
            $("#extendButton").val("<<");
         } else {
            this.extended = false;
            $("#blocklyContainer").css("width", "500px");
            $("#extendButton").val(">>");
         }
         this.updateSize();
      },

      updateSize: function(force) {
         if(window.experimentalSize) {
            // Temporary test
            var isPortrait = $(window).width() <= $(window).height();
            if(isPortrait && !this.wasPortrait) {
               this.reload();
            }
            this.wasPortrait = isPortrait;
            $('#blocklyDiv').height($('#blocklyLibContent').height() - 34);
            $('#blocklyDiv').width($('#blocklyLibContent').width() - 4);
            if (this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
            }
            Blockly.svgResize(this.workspace);
            return;
         }
         var panelWidth = 500;
         if (this.languages[this.codeId] == "blockly") {
            panelWidth = $("#blocklyDiv").width() - 10;
         } else {
            panelWidth = $("#program").width() + 20;
         }
         if (force || panelWidth != this.prevWidth) {
            if (this.languages[this.codeId] == "blockly") {
               if (this.trashInToolbox) {
                  Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               }
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
      },

      highlightBlock: function(id, keep) {
         if(!id) { keep = false; }

         if(!keep) {
            for(var i = 0; i < this.highlightedBlocks.length; i++) {
               var bid = this.highlightedBlocks[i];
               if(this.scratchMode) {
                  try {
                     this.workspace.glowBlock(bid, false);
                  } catch(e) {}
               } else {
                  var block = this.workspace.getBlockById(bid);
                  if(block) { block.removeSelect(); }
               }
            }
            this.highlightedBlocks = [];
         }

         if(this.scratchMode) {
            if(id) {
               this.workspace.glowBlock(id, true);
            }
         } else {
            this.workspace.traceOn(true);
            if(keep) {
               var block = this.workspace.getBlockById(id);
               if(block) { block.addSelect(); }
            } else {
               this.workspace.highlightBlock(id);
            }
         }

         if(id) {
            this.highlightedBlocks.push(id);
         }
      },

      initRun: function() {
         var that = this;
         var nbRunning = this.mainContext.runner.nbRunning();
         if (nbRunning > 0) {
            this.mainContext.runner.stop();
            this.mainContext.delayFactory.createTimeout("run" + Math.random(), function() {
               that.run()
            }, 1000);
            return;
         }
         if (this.mainContext.display) {
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
            Blockly.JavaScript.addReservedWords('highlightBlock');
         } else {
            Blockly.JavaScript.STATEMENT_PREFIX = '';
         }
         var topBlocks = this.workspace.getTopBlocks(true);
         var robotStartHasChildren = false;

         if (this.startingBlock) {
            for(var b=0; b<topBlocks.length; b++) {
               var block = topBlocks[b];
               if(block.type == 'robot_start' && block.childBlocks_.length > 0) {
                  robotStartHasChildren = true;
                  break;
               } // There can be multiple robot_start blocks sometimes
            }
            if(!robotStartHasChildren) {
               this.displayError('<span class="testError">' + window.languageStrings.errorEmptyProgram + '</span>');
               SrlLogger.validation('', 0, 'code');
               return;
            }
         }

         this.savePrograms();

         this.highlightPause = false;
         if(this.getRemainingCapacity(that.workspace) < 0) {
            this.displayError('<span class="testError">'+this.strings.tooManyBlocks+'</span>');
            SrlLogger.validation(this.programs[0].blockly, 0, 'code');
            return;
         }
         var limited = this.findLimited(this.workspace);
         if(limited) {
            var errorMsg = typeof limited == 'string' ? this.strings.limitedBlock : this.strings.limitedBlocks;
            errorMsg += ' ';
            errorMsg += this.getBlockLabel(limited, true);
            errorMsg += '.';
            this.displayError('<span class="testError">'+errorMsg+'</span>');
            SrlLogger.validation(this.programs[0].blockly, 0, 'code');
            return;
         }
         if(!this.scratchMode) {
            this.highlightBlock(null);
         }
         var codes = this.getAllCodes();
         this.mainContext.runner.initCodes(codes);
         return true;
      },


      run: function () {
         if(!this.initRun()) { return; }
         this.mainContext.runner.run();
      },

      step: function () {
         if(this.mainContext.runner.nbRunning() <= 0) {
            if(!this.initRun()) { return; }
         }
         this.mainContext.runner.step();
      },


      displayError: function(message) {
        if(this.quickAlgoInterface) {
            this.quickAlgoInterface.displayError(message);
            this.quickAlgoInterface.setPlayPause(false);
         } else {
            $('#errors').html(message);
         }
      },

      canPaste: function() {
         // Note that when changing versions, the clipboard is checked for
         // compatibility
         return Blockly.clipboardXml_ === null ? null : !!Blockly.clipboardXml_;
      },

      canConvertBlocklyToPython: function() {
         return true;
      },

      copyProgram: function() {
         var block = Blockly.selected;
         if(!block) {
            var blocks = this.workspace.getTopBlocks();
            for(var i=0; i<blocks.length; i++) {
               block = blocks[i];
               if(block.type == 'robot_start' && block.childBlocks_[0]) {
                  block = block.childBlocks_[0];
                  break;
               }
            }
         }
         Blockly.copy_(block);
      },

      pasteProgram: function() {
         if(Blockly.clipboardXml_ === false) {
            this.displayError(this.strings.clipboardDisallowedBlocks);
         }
         if(!Blockly.clipboardXml_) { return; }
         var xml = Blockly.Xml.textToDom('<xml>' + Blockly.Xml.domToText(Blockly.clipboardXml_) + '</xml>');
         this.loadProgramFromDom(xml);
      },

      hideSkulptAnalysis: function() {}
   }
}

function getBlocklyHelper(maxBlocks, subTask) {
   // TODO :: temporary until splitting of the block functions logic is done
   var blocklyHelper = getBlocklyInterface(maxBlocks, subTask);
   var blocklyBlockFunc = getBlocklyBlockFunctions(maxBlocks);
   for(var property in blocklyBlockFunc) {
      blocklyHelper[property] = blocklyBlockFunc[property];
   }
   return blocklyHelper;
}

function removeBlockly() {
   $(".blocklyDropDownDiv").remove();
   $(".blocklyWidgetDiv").remove();
   $(".blocklyTooltipDiv").remove();
   Blockly.removeEvents();
   // delete Blockly;
}

/*
    blockly_runner:
        Blockly (translated into JavaScript) code runner, with highlighting and
        value reporting features.
*/

function initBlocklyRunner(context, messageCallback) {
   init(context, [], [], [], false, {});

   function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {
      runner.hasActions = false;
      runner.nbActions = 0;
      runner.scratchMode = context.blocklyHelper ? context.blocklyHelper.scratchMode : false;
      runner.delayFactory = new DelayFactory();
      runner.resetDone = false;

      // Node status
      runner.nbNodes = 1;
      runner.curNode = 0;
      runner.nodesReady = [];
      runner.waitingOnReadyNode = false;

      // Iteration limits
      runner.maxIter = 400000;
      runner.maxIterWithoutAction = 500;
      runner.allowStepsWithoutDelay = 0;

      // Counts the call stack depth to know when to reset it
      runner.stackCount = 0;

      // During step-by-step mode
      runner.stepInProgress = false;
      runner.stepMode = false;
      runner.nextCallBack = null;

      // First highlightBlock of this run
      runner.firstHighlight = true;

      runner.strings = languageStrings;

      runner.valueToString = function(value) {
         if(interpreters.length == 0) {
            return value.toString(); // We "need" an interpreter to access ARRAY prototype
         }
         var itp = interpreters[0];
         if(itp.isa(value, itp.ARRAY)) {
            var strs = [];
            for(var i = 0; i < value.properties.length; i++) {
               strs[i] = runner.valueToString(value.properties[i]);
            }
            return '['+strs.join(', ')+']';
         } else if(value && value.toString) {
            return value.toString();
         } else {
            return "" + value;
         }
      };

      runner.reportBlockValue = function(id, value, varName) {
         // Show a popup displaying the value of a block in step-by-step mode
         if(context.display && runner.stepMode) {
            var displayStr = runner.valueToString(value);
            if(value && value.type == 'boolean') {
               displayStr = value.data ? runner.strings.valueTrue : runner.strings.valueFalse;
            }
            if(varName == '@@LOOP_ITERATION@@') {
               displayStr = runner.strings.loopIteration + ' ' + displayStr;
            } else if(varName) {
               varName = varName.toString();
               // Get the original variable name
               for(var dbIdx in Blockly.JavaScript.variableDB_.db_) {
                  if(Blockly.JavaScript.variableDB_.db_[dbIdx] == varName) {
                     varName = dbIdx.substring(0, dbIdx.length - 9);
                     // Get the variable name with the right case
                     for(var i=0; i<context.blocklyHelper.workspace.variableList.length; i++) {
                        var varNameCase = context.blocklyHelper.workspace.variableList[i];
                        if(varName.toLowerCase() == varNameCase.toLowerCase()) {
                           varName = varNameCase;
                           break;
                        }
                     }
                     break;
                  }
               }
               displayStr = varName + ' = ' + displayStr;
            }
            context.blocklyHelper.workspace.reportValue(id, displayStr);
         }
         return value;
      };

      runner.waitDelay = function(callback, value, delay) {
         if (delay > 0) {
            runner.stackCount = 0;
            runner.delayFactory.createTimeout("wait" + context.curNode + "_" + Math.random(), function() {
                  runner.noDelay(callback, value);
               },
               delay
            );
            runner.allowStepsWithoutDelay = Math.min(runner.allowStepsWithoutDelay + Math.ceil(delay/10), 100);
         } else {
            runner.noDelay(callback, value);
         }
      };

      runner.waitEvent = function(callback, target, eventName, func) {
         runner.stackCount = 0;
         var listenerFunc = null;
         listenerFunc = function(e) {
            target.removeEventListener(eventName, listenerFunc);
            runner.noDelay(callback, func(e));
         };
         target.addEventListener(eventName, listenerFunc);
      };

      runner.waitCallback = function(callback) {
         // Returns a callback to be called once we can continue the execution
         //runner.stackCount = 0;
         return function(value) {
            runner.noDelay(callback, value);
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value !== undefined) {
            if(value && (typeof value.length != 'undefined' ||
                         typeof value === 'object')) {
               // It's an array, create a primitive out of it
               primitive = interpreters[context.curNode].nativeToPseudo(value);
            } else {
               primitive = value;
            }
         }
         var infiniteLoopDelay = false;
         if(context.allowInfiniteLoop) {
            if(runner.allowStepsWithoutDelay > 0) {
               runner.allowStepsWithoutDelay -= 1;
            } else {
               infiniteLoopDelay = true;
            }
         }
         if(runner.stackCount > 100 || (infiniteLoopDelay && runner.stackCount > 5)) {
            // In case of an infinite loop, add some delay to slow down a bit
            var delay = infiniteLoopDelay ? 50 : 0;

            runner.stackCount = 0;
            runner.stackResetting = true;
            runner.delayFactory.createTimeout("wait_" + Math.random(), function() {
               runner.stackResetting = false;
               callback(primitive);
               runner.runSyncBlock();
            }, delay);
         } else {
            runner.stackCount += 1;
            callback(primitive);
            runner.runSyncBlock();
         }
      };

      runner.allowSwitch = function(callback) {
         // Tells the runner that we can switch the execution to another node
         var curNode = context.curNode;
         var ready = function(readyCallback) {
            if(!runner.isRunning()) { return; }
            if(runner.waitingOnReadyNode) {
               runner.curNode = curNode;
               runner.waitingOnReadyNode = false;
               context.setCurNode(curNode);
               readyCallback(callback);
            } else {
               runner.nodesReady[curNode] = function() {
                  readyCallback(callback);
               };
            }
         };
         runner.nodesReady[curNode] = false;
         runner.startNextNode(curNode);
         return ready;
      };

      runner.defaultSelectNextNode = function(runner, previousNode) {
         var i = previousNode + 1;
         if(i >= runner.nbNodes) { i = 0; }
         while(i != previousNode) {
            if(runner.nodesReady[i]) {
               break;
            } else {
               i++;
            }
            if(i >= runner.nbNodes) { i = 0; }
         }
         return i;
      };

      // Allow the next node selection process to be customized
      runner.selectNextNode = runner.defaultSelectNextNode;

      runner.startNextNode = function(curNode) {
         // Start the next node when one has been switched from
         var newNode = runner.selectNextNode(runner, curNode);
         function setWaiting() {
            for(var i = 0; i < runner.nodesReady.length ; i++) {
               if(!context.programEnded[i]) {
                  // TODO :: Timeout?
                  runner.waitingOnReadyNode = true;
                  return;
               }
            }
            // All nodes finished their program
            // TODO :: better message
            if(runner.nodesReady.length > 1) {
               throw "all nodes finished (blockly_runner)";
            }
         }
         if(newNode == curNode) {
            // No ready node
            setWaiting();
         } else {
            runner.curNode = newNode;
            var ready = runner.nodesReady[newNode];
            if(ready) {
               context.setCurNode(newNode);
               runner.nodesReady[newNode] = false;
               if(typeof ready == 'function') {
                  ready();
               } else {
                  runner.runSyncBlock();
               }
            } else {
               setWaiting();
            }
         }
      };

      runner.initInterpreter = function(interpreter, scope) {
         // Wrapper for async functions
         var createAsync = function(func) {
            return function() {
               var args = [];
               for(var i=0; i < arguments.length-1; i++) {
                  // TODO :: Maybe JS-Interpreter has a better way of knowing?
                  if(typeof arguments[i] != 'undefined' && arguments[i].isObject) {
                     args.push(interpreter.pseudoToNative(arguments[i]));
                  } else {
                     args.push(arguments[i]);
                  }
               }
               args.push(arguments[arguments.length-1]);
               func.apply(func, args);
               };
         };

         var makeHandler = function(runner, handler) {
            // For commands belonging to the "actions" category, we count the
            // number of actions to put a limit on steps without actions
            return function () {
               runner.nbActions += 1;
               handler.apply(this, arguments);
            };
         };

         for (var objectName in context.customBlocks) {
            for (var category in context.customBlocks[objectName]) {
               for (var iBlock in context.customBlocks[objectName][category]) {
                  var blockInfo = context.customBlocks[objectName][category][iBlock];
                  var code = context.strings.code[blockInfo.name];
                  if (typeof(code) == "undefined") {
                     code = blockInfo.name;
                  }

                  if(category == 'actions') {
                     runner.hasActions = true;
                     var handler = makeHandler(runner, blockInfo.handler);
                  } else {
                     var handler = blockInfo.handler;
                  }

                  interpreter.setProperty(scope, code, interpreter.createAsyncFunction(createAsync(handler)));
               }
            }
         }

         var makeNative = function(func) {
            return function() {
               var value = func.apply(func, arguments);
               var primitive = undefined;
               if (value != undefined) {
                  if(typeof value.length != 'undefined') {
                     // It's an array, create a primitive out of it
                     primitive = interpreters[context.curNode].nativeToPseudo(value);
                  } else {
                     primitive = value;
                  }
               }
               return primitive;
            };
         }

         if(Blockly.JavaScript.externalFunctions) {
            for(var name in Blockly.JavaScript.externalFunctions) {
               interpreter.setProperty(scope, name, interpreter.createNativeFunction(makeNative(Blockly.JavaScript.externalFunctions[name])));
            }
         }

         /*for (var objectName in context.generators) {
            for (var iGen = 0; iGen < context.generators[objectName].length; iGen++) {
               var generator = context.generators[objectName][iGen];
               interpreter.setProperty(scope, objectName + "_" + generator.labelEn, interpreter.createAsyncFunction(generator.fct));
            }
         }*/
         interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(createAsync(runner.program_end)));

         function highlightBlock(id, callback) {
            id = id ? id.toString() : '';

            if (context.display) {
               try {
                  if(context.infos && !context.infos.actionDelay) {
                     id = null;
                  }
                  context.blocklyHelper.highlightBlock(id);
                  highlightPause = !!id;
               } catch(e) {}
            }

            // We always execute directly the first highlightBlock
            if(runner.firstHighlight || !runner.stepMode) {
               runner.firstHighlight = false;
               callback();
               runner.runSyncBlock();
            } else {
               // Interrupt here for step mode, allows to stop before each
               // instruction
               runner.nextCallback = callback;
               runner.stepInProgress = false;
            }
         }

         // Add an API function for highlighting blocks.
         interpreter.setProperty(scope, 'highlightBlock', interpreter.createAsyncFunction(createAsync(highlightBlock)));

         // Add an API function to report a value.
         interpreter.setProperty(scope, 'reportBlockValue', interpreter.createNativeFunction(runner.reportBlockValue));

      };

      runner.program_end = function(callback) {
         var curNode = context.curNode;
         if(!context.programEnded[curNode]) {
            context.programEnded[curNode] = true;
            if(context.programEnded.indexOf(false) == -1) {
               context.infos.checkEndCondition(context, true);
            }
         }
         runner.noDelay(callback);
      };

      runner.stop = function(aboutToPlay) {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
               isRunning[iInterpreter] = false;
            }
         }

         if(runner.scratchMode) {
            Blockly.DropDownDiv.hide();
            context.blocklyHelper.highlightBlock(null);
         }

         if(!aboutToPlay && window.quickAlgoInterface) {
            window.quickAlgoInterface.setPlayPause(false);
         }

         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.firstHighlight = true;
      };

      runner.runSyncBlock = function() {
         runner.resetDone = false;
         runner.stepInProgress = true;
         runner.oneStepDone = false;
         // Handle the callback from last highlightBlock
         if(runner.nextCallback) {
            runner.nextCallback();
            runner.nextCallback = null;
         }

         try {
            if(runner.stepMode && runner.oneStepDone) {
               runner.stepInProgress = false;
               return;
            }
            var iInterpreter = runner.curNode;
            context.setCurNode(iInterpreter);
            if (context.infos.checkEndEveryTurn) {
               context.infos.checkEndCondition(context, false);
            }
            var interpreter = interpreters[iInterpreter];
            var wasPaused = interpreter.paused_;
            while(!context.programEnded[iInterpreter]) {
               if(!context.allowInfiniteLoop &&
                     (context.curSteps[iInterpreter].total >= runner.maxIter || context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction)) {
                  break;
               }
               if (!interpreter.step() || toStop[iInterpreter]) {
                  isRunning[iInterpreter] = false;
                  return;
               }
               if (interpreter.paused_) {
                  runner.oneStepDone = !wasPaused;
                  return;
               }
               context.curSteps[iInterpreter].total++;
               if(context.curSteps[iInterpreter].lastNbMoves != runner.nbActions) {
                  context.curSteps[iInterpreter].lastNbMoves = runner.nbActions;
                  context.curSteps[iInterpreter].withoutAction = 0;
               } else {
                  context.curSteps[iInterpreter].withoutAction++;
               }
            }

            if (!context.programEnded[iInterpreter] && !context.allowInfiniteLoop) {
               if (context.curSteps[iInterpreter].total >= runner.maxIter) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterations;
               } else if(context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterationsWithoutAction;
               }
            }

            if(context.programEnded[iInterpreter] && !runner.interpreterEnded[iInterpreter]) {
               runner.interpreterEnded[iInterpreter] = true;
               runner.startNextNode(iInterpreter);
            }
         } catch (e) {
            context.onExecutionEnd && context.onExecutionEnd();
            runner.stepInProgress = false;

            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
               context.programEnded[iInterpreter] = true;
            }

            var message = e.message || e.toString();

            // Translate "Unknown identifier" message
            if(message.substring(0, 20) == "Unknown identifier: ") {
               var varName = message.substring(20);
               // Get original variable name if possible
               for(var dbIdx in Blockly.JavaScript.variableDB_.db_) {
                  if(Blockly.JavaScript.variableDB_.db_[dbIdx] == varName) {
                     varName = dbIdx.substring(0, dbIdx.length - 9);
                     break;
                  }
               }
               message = runner.strings.uninitializedVar + ' ' + varName;
            }

            if(message.indexOf('undefined') != -1) {
               console.error(e)
               message += '. ' + runner.strings.undefinedMsg;
            }

            if ((context.nbTestCases != undefined) && (context.nbTestCases > 1)) {
               if (context.success) {
                  message = context.messagePrefixSuccess + message;
               } else {
                  message = context.messagePrefixFailure + message;
               }
            }
            if (context.success) {
               message = "<span style='color:green;font-weight:bold'>" + message + "</span>";
               if (context.linkBack) {
                  //message += "<br/><span onclick='window.parent.backToList()' style='font-weight:bold;cursor:pointer;text-decoration:underline;color:blue'>Retour à la liste des questions</span>";
               }
            }
            runner.delayFactory.destroyAll();
            if(window.quickAlgoInterface) {
               window.quickAlgoInterface.setPlayPause(false);
            }
            setTimeout(function() { messageCallback(message); }, 0);
         }
      };

      runner.initCodes = function(codes) {
         runner.delayFactory.destroyAll();
         interpreters = [];
         runner.nbNodes = codes.length;
         runner.curNode = 0;
         runner.nodesReady = [];
         runner.waitingOnReadyNode = false;
         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.allowStepsWithoutDelay = 0;
         runner.firstHighlight = true;
         runner.stackCount = 0;
         context.programEnded = [];
         runner.interpreterEnded = [];
         context.curSteps = [];
         runner.reset(true);
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = {
               total: 0,
               withoutAction: 0,
               lastNbMoves: 0
            };
            context.programEnded[iInterpreter] = false;
            runner.interpreterEnded[iInterpreter] = false;

            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            runner.nodesReady.push(true);
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;

            if(iInterpreter > 0) {
               // This is a fix for pseudoToNative identity comparisons (===),
               // as without that fix, pseudo-objects coming from another
               // interpreter would not get recognized to the right type.
               interpreters[iInterpreter].ARRAY = interpreters[0].ARRAY;
               interpreters[iInterpreter].ARRAY_PROTO = interpreters[0].ARRAY_PROTO;
               interpreters[iInterpreter].REGEXP = interpreters[0].REGEXP;
            }
         }
         runner.maxIter = 400000;
         if (context.infos.maxIter != undefined) {
            runner.maxIter = context.infos.maxIter;
         }
         if(runner.hasActions) {
            runner.maxIterWithoutAction = 500;
            if (context.infos.maxIterWithoutAction != undefined) {
               runner.maxIterWithoutAction = context.infos.maxIterWithoutAction;
            }
         } else {
            // If there's no actions in the current task, "disable" the limit
            runner.maxIterWithoutAction = runner.maxIter;
         }
      };

      runner.runCodes = function(codes) {
         if(!codes || !codes.length) { return; }
         runner.initCodes(codes);
         runner.runSyncBlock();
      };

      runner.run = function () {
         runner.stepMode = false;
         if(!runner.stepInProgress) {
            // XXX :: left to avoid breaking tasks in case I'm wrong, but we
            // should be able to remove this code (it breaks multi-interpreter
            // step-by-step)
            if(interpreters.length == 1) {
               interpreters[0].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.step = function () {
         runner.stepMode = true;
         if(!runner.stepInProgress) {
            // XXX :: left to avoid breaking tasks in case I'm wrong, but we
            // should be able to remove this code (it breaks multi-interpreter
            // step-by-step)
            if(interpreters.length == 1) {
               interpreters[0].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.nbRunning = function() {
         var nbRunning = 0;
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               nbRunning++;
            }
         }
         return nbRunning;
      };

      runner.isRunning = function () {
         return this.nbRunning() > 0;
      };

      runner.reset = function(aboutToPlay) {
         if(runner.resetDone) { return; }
         context.reset();
         runner.stop(aboutToPlay);
         runner.resetDone = true;
      };

      runner.signalAction = function() {
         // Allows contexts to signal an "action" happened
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            context.curSteps[iInterpreter].withoutAction = 0;
         }
      };

      context.runner = runner;
      context.callCallback = runner.noDelay;
      context.programEnded = [];
   }
}

/*
    subtask:
        Logic for quickAlgo tasks, implements the Bebras task API.
*/

var initBlocklySubTask = function(subTask, language) {
   // Blockly tasks need to always have the level-specific behavior from
   // beaver-task-2.0
   subTask.assumeLevels = true;

   if (window.forcedLevel != null) {
      for (var level in subTask.data) {
         if (window.forcedLevel != level) {
            subTask.data[level] = undefined;
         }
      }
      subTask.load = function(views, callback) {
         subTask.loadLevel(window.forcedLevel);
         callback();
      };
   } else if (subTask.data["medium"] == undefined) {
      subTask.load = function(views, callback) {
         subTask.loadLevel("easy");
         callback();
      };
   }

   if (language == undefined) {
      language = "fr";
   }

   subTask.getTaskParam = function (name) {
      return subTask.taskParams && subTask.taskParams.options ? subTask.taskParams.options[name] : null;
   }

   subTask.loadLevel = function(curLevel) {
      var levelGridInfos = extractLevelSpecific(subTask.gridInfos, curLevel);
      subTask.levelGridInfos = levelGridInfos;

      // Convert legacy options
      if(!levelGridInfos.hideControls) { levelGridInfos.hideControls = {}; }
      levelGridInfos.hideControls.saveOrLoad = levelGridInfos.hideControls.saveOrLoad || !!levelGridInfos.hideSaveOrLoad;
      levelGridInfos.hideControls.loadBestAnswer = levelGridInfos.hideControls.loadBestAnswer || !!levelGridInfos.hideLoadBestAnswers;

      subTask.blocklyHelper = getBlocklyHelper(subTask.levelGridInfos.maxInstructions, subTask);
      subTask.answer = null;
      subTask.state = {};
      subTask.iTestCase = 0;
      subTask.nbExecutions = 0;
      subTask.logOption = subTask.getTaskParam('log');
      subTask.clearWbe();
      if(!window.taskResultsCache) {
         window.taskResultsCache = {};
      }
      if(!window.taskResultsCache[curLevel]) {
         window.taskResultsCache[curLevel] = {};
      }
      window.modulesLanguage = subTask.blocklyHelper.language;

      this.level = curLevel;

      // TODO: fix bebras platform to make this unnecessary
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch(e) {
      }
      $('body').css("width", "100%").addClass('blockly');
      window.focus();

      this.iTestCase = 0;
      this.nbTestCases = subTask.data[curLevel].length;

      this.context = quickAlgoLibraries.getContext(this.display, levelGridInfos, curLevel);
      this.context.raphaelFactory = this.raphaelFactory;
      this.context.delayFactory = this.delayFactory;
      this.context.blocklyHelper = this.blocklyHelper;

      subTask.allowSvgExport = levelGridInfos.allowSvgExport || subTask.getTaskParam('svgexport') || getUrlParameter('svgexport') || false;

      if (this.display) {
         if (window.quickAlgoInterface.loadUserTaskData)
            window.quickAlgoInterface.loadUserTaskData(levelGridInfos.userTaskData);
         window.quickAlgoInterface.loadInterface(this.context, curLevel);
         window.quickAlgoInterface.setOptions({
            hasExample: levelGridInfos.example && levelGridInfos.example[subTask.blocklyHelper.language],
            conceptViewer: levelGridInfos.conceptViewer,
            conceptViewerLang: this.blocklyHelper.language,
            hasTestThumbnails: levelGridInfos.hasTestThumbnails,
            hideControls: levelGridInfos.hideControls,
            introMaxHeight: levelGridInfos.introMaxHeight,
            canEditSubject: !!levelGridInfos.canEditSubject,
            allowSvgExport: !!subTask.allowSvgExport
         });
         window.quickAlgoInterface.bindBlocklyHelper(this.blocklyHelper);
         if (subTask.allowSvgExport) {
            displayHelper.alwaysAskLevelChange = true;
         }
      }

      this.blocklyHelper.loadContext(this.context);

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = subTask.gridInfos.timeoutMinutes ? subTask.gridInfos.timeoutMinutes : 30;

      var curIncludeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);

      // Load concepts into conceptViewer; must be done before loading
      // Blockly/Scratch, as scratch-mode will modify includeBlocks
      if(this.display && levelGridInfos.conceptViewer) {
         var allConcepts = this.context.getConceptList();
         allConcepts = allConcepts.concat(getConceptViewerBaseConcepts());

         var concepts = window.getConceptsFromBlocks(curIncludeBlocks, allConcepts, this.context);
         if(levelGridInfos.conceptViewer.length) {
            concepts = concepts.concat(levelGridInfos.conceptViewer);
         } else {
            concepts.push('base');
         }
         concepts = window.conceptsFill(concepts, allConcepts);
         window.conceptViewer.loadConcepts(concepts, levelGridInfos.conceptViewerMain);
         window.conceptViewer.contextTitle = this.context.title;
      }

      this.blocklyHelper.setIncludeBlocks(curIncludeBlocks);

      var blocklyOptions = {
         readOnly: !!subTask.taskParams.readOnly,
         defaultCode: subTask.defaultCode,
         maxListSize: this.context.infos.maxListSize,
         startingExample: this.context.infos.startingExample,
         placeholderBlocks: !!(this.context.placeholderBlocks || this.context.infos.placeholderBlocks)
      };

      // Handle zoom options
      var maxInstructions = this.context.infos.maxInstructions ? this.context.infos.maxInstructions : Infinity;
      var zoomOptions = {
         controls: false,
         scale: maxInstructions > 20 ? 1 : 1.1
      };
      if(this.context.infos && this.context.infos.zoom) {
         zoomOptions.controls = !!this.context.infos.zoom.controls;
         zoomOptions.scale = (typeof this.context.infos.zoom.scale != 'undefined') ? this.context.infos.zoom.scale : zoomOptions.scale;
      }
      blocklyOptions.zoom = zoomOptions;

      // Handle scroll
//      blocklyOptions.scrollbars = maxInstructions > 10;
      blocklyOptions.scrollbars = true;
      if(typeof this.context.infos.scrollbars != 'undefined') {
         blocklyOptions.scrollbars = this.context.infos.scrollbars;
      }

      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length, blocklyOptions);

      if(this.display) {
         window.quickAlgoInterface.initTestSelector(this.nbTestCases);
         window.quickAlgoInterface.onResize();
      }

      subTask.changeTest(0);

      // Log the loaded level after a second
      if(window.levelLogActivityTimeout) { clearTimeout(window.levelLogActivityTimeout); }
      window.levelLogActivityTimeout = setTimeout(function() {
         subTask.logActivity('loadLevel;' + curLevel);
         window.levelLogActivityTimeout = null;
      }, 1000);

      // Start SRL logging
      if(subTask.logOption) {
         SrlLogger.load();
         SrlLogger.levelLoaded(curLevel);
      }
   };

   subTask.updateScale = function() {
      setTimeout(function() {
         try {
            subTask.context.updateScale();
            subTask.blocklyHelper.updateSize();
         } catch(e) {}
      }, 0);
   };

   var resetScores = function() {
   };

   var updateScores = function() {
   };

   function changeScore(robot, deltaScore) {
      scores[robot] += deltaScore;
      updateScores();
   };

   subTask.unloadLevel = function(callback) {
      if(this.display) {
         window.quickAlgoInterface.unloadLevel();
      }
      this.context.unload();
      this.blocklyHelper.unloadLevel();
      if(window.conceptViewer) {
         window.conceptViewer.unload();
      }
      callback();
   };

   subTask.unload = function(callback) {
      var that = this;
      subTask.unloadLevel(function () {
         that.blocklyHelper.unload();
         callback();
      });
   };

   subTask.reset = function() {
      this.context.reset();
   };

   subTask.program_end = function(callback) {
      this.context.program_end(callback);
   };

   var initContextForLevel = function(iTestCase) {
      //      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.iTestCase = iTestCase;
      subTask.context.iTestCase = iTestCase;
      subTask.context.nbTestCases = subTask.nbTestCases;
      subTask.context.messagePrefixFailure = '';
      subTask.context.messagePrefixSuccess = '';
      subTask.context.linkBack = false;
      subTask.context.reset(subTask.data[subTask.level][iTestCase]);
   };

   subTask.logActivity = function(details) {
      if(!subTask.logOption) { return; }

      if(!details) {
         // Sends a validate("log") to the platform if the log GET parameter is set
         // Performance note : we don't call getAnswerObject, as it's already
         // called every second by buttonsAndMessages.
         if(JSON.stringify(subTask.answer) != subTask.lastLoggedAnswer) {
            platform.validate("log");
            subTask.lastLoggedAnswer = JSON.stringify(subTask.answer);
         }
         return;
      }

      platform.log(['activity', details]);
   };

   subTask.waitBetweenExecutions = function() {
      // After a user-started execution, wait a few seconds if required by
      // the task
      var wbe = subTask.levelGridInfos.waitBetweenExecutions;
      if(!wbe) { return; }

      subTask.nbExecutions++;

      if(typeof wbe == "number") {
         var wait = wbe * 1000;
         var maxExecutions = 0;
      } else {
         var wait = wbe.wait * 1000;
         var maxExecutions = wbe.nbExecutions || 0;
      }

      if(subTask.nbExecutions < maxExecutions) { return; }

      subTask.waitBetweenExecutionsTimeout = setTimeout(subTask.clearWbe, wait);
   };

   subTask.onChange = function() {
      if(subTask.context.runner) {
         if(subTask.context.display) {
            subTask.context.runner.reset();
         } else {
            subTask.resetRunnerAfterGrading = true;
         }
      }

      if(subTask.waitBetweenExecutionsTimeout && window.quickAlgoInterface) {
         var msg = subTask.levelGridInfos.waitBetweenExecutions.message || window.languageStrings.waitBetweenExecutions;
         quickAlgoInterface.displayNotification('wait', msg, true);
      }
   };

   subTask.clearWbe = function() {
      subTask.waitBetweenExecutionsTimeout = null;
      if(window.quickAlgoInterface) {
         quickAlgoInterface.displayNotification('wait', null, true);
      }
   };

   subTask.initRun = function(callback) {
      var allowInfiniteLoop = !!subTask.context.allowInfiniteLoop;

      if(window.quickAlgoInterface) {
         quickAlgoInterface.toggleMoreDetails(false);
      }
      var initialTestCase = subTask.iTestCase;
      initBlocklyRunner(subTask.context, function(message, success) {
         if(typeof success == 'undefined') {
            success = subTask.context.success;
         }
         function handleResults(results) {
            subTask.context.display = true;
            if(callback) {
               callback(message, success);
            } else if(results.successRate >= 1) {
               // All tests passed, request validate from the platform
               platform.validate("done");
            }
            if(results.successRate < 1) {
               // Display the execution message as it won't be shown through
               // validate
               window.quickAlgoInterface.displayResults(
                   {iTestCase: initialTestCase, message: message, successRate: success ? 1 : 0},
                   results
               );
            }

            if(!allowInfiniteLoop) {
               SrlLogger.validation(subTask.blocklyHelper.programs[0].blockly, success ? 100 : 0, success ? 'none' : 'execution', 0);
            }
         }
         // Log the attempt
         subTask.logActivity();

         // Wait between attempts
         subTask.waitBetweenExecutions();

         // Launch an evaluation after the execution
         if (!subTask.context.doNotStartGrade ) {
            subTask.context.display = false;
            subTask.getGrade(handleResults, true, subTask.iTestCase);
         } else {
            if (!subTask.context.success)
               window.quickAlgoInterface.displayError(message);
         }
      });
      initContextForLevel(initialTestCase);

      if(allowInfiniteLoop) {
         SrlLogger.validation(subTask.blocklyHelper.programs[0].blockly, 0, 'none', 1);
      }
   };

   subTask.run = function(callback) {
      if(subTask.validating) { return; }
      subTask.initRun(callback);
      subTask.blocklyHelper.run(subTask.context);
   };

   subTask.submit = function() {
      this.stop();
      this.context.display = false;
      this.getAnswerObject(); // to fill this.answer;

      $('#displayHelper_graderMessage').html('<div style="margin: .2em 0; color: red; font-weight: bold;">' + languageStrings.gradingInProgress + '</div>');

      this.getGrade(function(result) {
         $('#displayHelper_graderMessage').html("");
         subTask.context.display = true;
         initBlocklyRunner(subTask.context, function(message, success) {
            window.quickAlgoInterface.displayError('<span class="testError">'+message+'</span>');
            platform.validate("done");
         });
         subTask.changeTest(result.iTestCase - subTask.iTestCase);
         initContextForLevel(result.iTestCase);
         subTask.context.linkBack = true;
         subTask.context.messagePrefixSuccess = window.languageStrings.allTests;
         subTask.blocklyHelper.run(subTask.context);
      }, true);
   };

   subTask.step = function () {
      if(subTask.validating) { return; }
      subTask.srlStepByStepLog('step');
      subTask.context.changeDelay(200);
      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.initRun();
      }
      subTask.blocklyHelper.step(subTask.context);
   };

   subTask.stop = function() {
      if(subTask.validating) { return; }
      this.clearAnalysis();

      if(this.context.runner) {
         this.context.runner.stop();
      }

      // Reset everything through changeTest
      subTask.changeTest(0);

      subTask.srlStepByStepLog('stop');
   };

   /**
    * Clears the analysis container.
    */
   subTask.clearAnalysis = function() {
      if (this.blocklyHelper.clearSkulptAnalysis) {
         this.blocklyHelper.clearSkulptAnalysis();
      }
   };

   subTask.reloadStateObject = function(stateObj) {
      this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
   };

   subTask.loadExample = function(exampleObj) {
      subTask.blocklyHelper.loadExample(exampleObj ? exampleObj : subTask.levelGridInfos.example);
   };

   subTask.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   subTask.getStateObject = function() {
      this.state.level = this.level;
      return this.state;
   };

   subTask.changeSpeed = function(speed) {
      this.context.changeDelay(speed);
      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.run();
      } else if (this.context.runner.stepMode) {
         this.context.runner.run();
      }
   };

   // used in new playback controls with speed slider
   subTask.setStepDelay = function(delay) {
      this.context.changeDelay(delay);
   };

   // used in new playback controls with speed slider
   subTask.pause = function() {
      if(subTask.validating) { return; }
      if(this.context.runner) {
         this.context.runner.stepMode = true;
      }
   };

   // used in new playback controls with speed slider
   subTask.play = function() {
      if(subTask.validating) { return; }
      this.clearAnalysis();
      subTask.srlStepByStepLog('play');

      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.run();
      } else if (this.context.runner.stepMode) {
         this.context.runner.run();
      }
   };

   subTask.getAnswerObject = function() {
      this.blocklyHelper.savePrograms();

      this.answer = this.blocklyHelper.programs;
      return this.answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      if(typeof answerObj == "undefined") {
         this.answer = this.getDefaultAnswerObject();
      } else {
         this.answer = answerObj;
      }
      this.blocklyHelper.programs = this.answer;
      if (this.answer != undefined) {
         this.blocklyHelper.loadPrograms();
      }
      window.quickAlgoInterface.updateBestAnswerStatus();
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultBlockly = this.blocklyHelper.getDefaultContent();
      return [{javascript:"", blockly: defaultBlockly, blocklyJS: ""}];
   };

   subTask.changeTest = function(delta) {
      var newTest = subTask.iTestCase + delta;
      if ((newTest >= 0) && (newTest < this.nbTestCases)) {
         if(this.context.runner) {
            this.context.runner.stop();
         }
         initContextForLevel(newTest);
         if(window.quickAlgoInterface) {
            window.quickAlgoInterface.displayError(null);
            if(subTask.context.display) {
               window.quickAlgoInterface.updateTestSelector(newTest);
            }
         }
      }
   };

   subTask.changeTestTo = function(iTest) {
      var delta = iTest - subTask.iTestCase;
      if(delta != 0) {
         subTask.changeTest(delta);
      }
   };

   subTask.getGrade = function(callback, display, mainTestCase) {
      // mainTest : set to indicate the first iTestCase to test (typically,
      // current iTestCase) before others; test will then stop if the
      if(subTask.context.infos && subTask.context.infos.hideValidate) {
         // There's no validation
         callback({
            message: '',
            successRate: 1,
            iTestCase: 0
         });
         return;
      }

      // XXX :: Related to platform-pr.js#L67 : why does it start two
      // evaluations at the same time? This can cause serious issues with the
      // Python runner, and on some contexts such as quick-pi
      if(window.subTaskValidating && window.subTaskValidationAttempts < 5) {
         setTimeout(function() { subTask.getGrade(callback, display, mainTestCase); }, 1000);
         window.subTaskValidationAttempts += 1;
         console.log("Queueing validation... (attempt " + window.subTaskValidationAttempts + ")");
         return;
      }
      window.subTaskValidationAttempts = 0;
      window.subTaskValidating = true;
      subTask.validating = true;
      if(display) {
        quickAlgoInterface.setValidating(true);
      }

      var oldDelay = subTask.context.infos.actionDelay;
      subTask.context.changeDelay(0);
      var codes = subTask.blocklyHelper.getAllCodes(subTask.answer);

      var checkError = '';
      var checkDisplay = function(err) { checkError = err; }
      if(!subTask.blocklyHelper.checkCodes(codes, checkDisplay)) {
         var results = {
            message: checkError,
            successRate: 0,
            iTestCase: 0
         };
         subTask.context.changeDelay(oldDelay);
         subTask.postGrading();
         callback(results);
         return;
      }

      var oldTestCase = subTask.iTestCase;

      /*      var levelResultsCache = window.taskResultsCache[this.level];

            if(levelResultsCache[code]) {
               // We already have a cached result for that
               window.quickAlgoInterface.updateTestScores(levelResultsCache[code].fullResults);
               subTask.context.changeDelay(oldDelay);
               callback(levelResultsCache[code].results);
               return;
            }*/

      function startEval() {
         // Start evaluation on iTestCase
         initContextForLevel(subTask.iTestCase);
         subTask.testCaseResults[subTask.iTestCase] = {evaluating: true};
         if(display) {
            window.quickAlgoInterface.updateTestScores(subTask.testCaseResults);
         }
         var codes = subTask.blocklyHelper.getAllCodes(subTask.answer);
         subTask.context.runner.runCodes(codes);
      }

      function postEval() {
         // Behavior after an eval
         if(typeof mainTestCase == 'undefined') {
            // Normal behavior : evaluate all tests
            subTask.iTestCase++;
            if (subTask.iTestCase < subTask.nbTestCases) {
               startEval();
               return;
            }
         } else if(subTask.testCaseResults[subTask.iTestCase].successRate >= 1) {
            // A mainTestCase is defined, evaluate mainTestCase first then the
            // others until a test fails
            if(subTask.iTestCase == mainTestCase && subTask.iTestCase != 0) {
               subTask.iTestCase = 0;
               startEval();
               return;
            }
            subTask.iTestCase++;
            if(subTask.iTestCase == mainTestCase) { subTask.iTestCase++ }; // Already done
            if (subTask.iTestCase < subTask.nbTestCases) {
               startEval();
               return;
            }
         }

         // All evaluations done, tally results
         subTask.iTestCase = oldTestCase;
         if(typeof mainTestCase == 'undefined') {
            var iWorstTestCase = 0;
            var worstRate = 1;
         } else {
            // Priority to the mainTestCase if worst test case
            var iWorstTestCase = mainTestCase;
            var worstRate = subTask.testCaseResults[mainTestCase].successRate;
            // Change back to the mainTestCase
         }
         var nbSuccess = 0;
         for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
            var sr = subTask.testCaseResults[iCase] ? subTask.testCaseResults[iCase].successRate : 0;
            if(sr >= 1) {
               nbSuccess++;
            }
            if(sr < worstRate) {
               worstRate = sr;
               iWorstTestCase = iCase;
            }
         }
         subTask.testCaseResults[iWorstTestCase].iTestCase = iWorstTestCase;
         if(display) {
            window.quickAlgoInterface.updateTestScores(subTask.testCaseResults);
         }
         if(subTask.testCaseResults[iWorstTestCase].successRate < 1) {
            if(subTask.nbTestCases == 1) {
               var msg = subTask.testCaseResults[iWorstTestCase].message;
            } else if(nbSuccess > 0) {
               var msg = languageStrings.resultsPartialSuccess.format({
                  nbSuccess: nbSuccess,
                  nbTests: subTask.nbTestCases
               });
            } else {
               var msg = languageStrings.resultsNoSuccess;
            }
            var results = {
               message: msg,
               successRate: subTask.testCaseResults[iWorstTestCase].successRate,
               iTestCase: iWorstTestCase
            };
         } else {
            var results = subTask.testCaseResults[iWorstTestCase];
         }
         /*levelResultsCache[code] = {
            results: results,
            fullResults: subTask.testCaseResults
            };*/
         subTask.context.changeDelay(oldDelay);
         subTask.postGrading();
         callback(results);
         window.quickAlgoInterface.updateBestAnswerStatus();
      }

      initBlocklyRunner(subTask.context, function(message, success) {
         // Record grade from this evaluation into testCaseResults
         var computeGrade = function(context, message) {
            var rate = 0;
            if (context.success) {
               rate = 1;
            }
            return {
               successRate: rate,
               message: message
            };
         }
         if (subTask.levelGridInfos.computeGrade != undefined) {
            computeGrade = subTask.levelGridInfos.computeGrade;
         }
         subTask.testCaseResults[subTask.iTestCase] = computeGrade(subTask.context, message)
         postEval();
      });

      subTask.iTestCase = typeof mainTestCase != 'undefined' ? mainTestCase : 0;
      subTask.testCaseResults = [];
      for(var i=0; i < subTask.iTestCase; i++) {
         // Fill testCaseResults up to the first iTestCase
         subTask.testCaseResults.push(null);
      }
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = window.languageStrings.allTests;

      startEval();
   };

   subTask.postGrading = function() {
      window.subTaskValidating = false;
      if(subTask.resetRunnerAfterGrading && subTask.context.runner) {
         subTask.context.runner.reset();
         subTask.resetRunnerAfterGrading = false;
      }
      setTimeout(function() {
         subTask.validating = false;
         quickAlgoInterface.setValidating(false);
         }, 1000);
   };

   subTask.srlStepByStepLog = function(type) {
      SrlLogger.stepByStep(subTask, type);
   };

   subTask.exportGridAsSvg = function (name) {
      // Exports the current grid as a SVG file
      // We need to embed all images
      if (!name) name = 'export';

      if (subTask.context.exportGridAsSvg) {
         // Use the library's function if exists
         var svgSource = subTask.context.exportGridAsSvg(subTask.allowSvgExport);
         if (!svgSource) { return; }
      } else {
         var svgSource = $('#grid svg');
         if (!svgSource.length) { return; }
         svgSource = svgSource[0];
      }
      var svg = $(svgSource.outerHTML);

      var imagesToFetch = [];
      var hrefsToReplace = {};
      var svgImages = svg.find('image');
      for (var i = 0; i < svgImages.length; i++) {
         var image = $(svgImages[i]);
         var url = image.attr('xlink:href');
         if (url && url.substr(0, 5) != 'data:') {
            if (arrayContains(imagesToFetch, url)) {
               hrefsToReplace[url].push(image);
            } else {
               imagesToFetch.push(url);
               hrefsToReplace[url] = [image];
            }
         }
      }

      function finalizeExport() {
         var data = svg[0].outerHTML;
         data = new Blob([data], { type: 'image/svg+xml' });
         var objectURL = window.URL.createObjectURL(data);

         var anchor = $("<a href='" + objectURL + "' download='" + name + "'.svg'>&nbsp;</a>");
         anchor[0].click();
      }

      if (!imagesToFetch.length) {
         finalizeExport();
         return;
      }

      function fetchImage(url) {
         var xhr = new XMLHttpRequest();
         xhr.responseType = 'arraybuffer';
         xhr.open('GET', url);
         xhr.onload = function () {
            var mime = xhr.getResponseHeader('Content-Type');
            var codes = new Uint8Array(xhr.response);
            var bin = String.fromCharCode.apply(null, codes);
            var encodedData = 'data:' + mime + ';base64,' + btoa(bin);
            for (var j = 0; j < hrefsToReplace[url].length; j++) {
               hrefsToReplace[url][j].attr('xlink:href', encodedData);
            }
            imagesDone++;
            if (imagesDone >= imagesToFetch.length) {
               setTimeout(finalizeExport, 0);
            }
         };
         xhr.send();
      }

      var imagesDone = 0;
      for (var i = 0; i < imagesToFetch.length; i++) {
         fetchImage(imagesToFetch[i]);
      }
   }
}

var quickAlgoContext = function(display, infos) {
  var context = {
    display: display,
    infos: infos,
    nbCodes: 1, // How many different codes the user can edit
    nbNodes: 1 // How many nodes will be executing programs
    };

  // Set the localLanguageStrings for this context
  context.setLocalLanguageStrings = function(localLanguageStrings) {
    if(window.BlocksHelper && infos && infos.blocksLanguage) {
      localLanguageStrings = BlocksHelper.mutateBlockStrings(
        localLanguageStrings,
        infos.blocksLanguage
        );
    }

    context.localLanguageStrings = localLanguageStrings;
    window.stringsLanguage = window.stringsLanguage || "fr";
    window.languageStrings = window.languageStrings || {};

    if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
    } else { // merge translations
      $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
    }
    context.strings = window.languageStrings;
    return context.strings;
  };

  // Import more language strings
  context.importLanguageStrings = function(source, dest) {
    if ((typeof source != "object") || (typeof dest != "object")) {
      return;
    }
    for (var key1 in source) {
      if (dest[key1] != undefined && typeof dest[key1] == "object") {
        context.importLanguageStrings(source[key1], dest[key1]);
      } else {
        dest[key1] = source[key1];
      }
    }
  };

  // Get the list of concepts
  // List can be defined either in context.conceptList, or by redefining this
  // function
  context.getConceptList = function() {
    return context.conceptList || [];
  };

  // Default implementations
  context.changeDelay = function(newDelay) {
    // Change the action delay while displaying
    infos.actionDelay = newDelay;
  };

  context.waitDelay = function(callback, value) {
    // Call the callback with value after actionDelay
    if(context.runner) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
    } else {
      // When a function is used outside of an execution
      setTimeout(function () { callback(value); }, infos.actionDelay);
    }
  };

  context.callCallback = function(callback, value) {
    // Call the callback with value directly
    if(context.runner) {
      context.runner.noDelay(callback, value);
    } else {
      // When a function is used outside of an execution
      callback(value);
    }
  };

  context.setCurNode = function(curNode) {
    // Set the current node
    context.curNode = curNode;
  };

  context.debug_alert = function(message, callback) {
    // Display debug information
    message = message ? message.toString() : '';
    if (context.display) {
      alert(message);
    }
    context.callCallback(callback);
  };

  // Placeholders, should be actually defined by the library
  context.reset = function() {
    // Reset the context
    if(display) {
      context.resetDisplay();
    }
  };

  context.resetDisplay = function() {
    // Reset the context display
  };

  context.updateScale = function() {
    // Update the display scale when the window is resized for instance
  };

  context.unload = function() {
    // Unload the context, cleaning up
  };

  context.provideBlocklyColours = function() {
    // Provide colours for Blockly
    return {};
  };

  // Properties we expect the context to have
  context.localLanguageStrings = {};
  context.customBlocks = {};
  context.customConstants = {};
  context.conceptList = [];

  return context;
};


// Global variable allowing access to each getContext
var quickAlgoLibraries = {
  libs: {},
  order: [],
  contexts: {},
  mergedMode: false,

  get: function(name) {
    return this.libs[name];
  },

  getContext: function() {
    // Get last context registered
    if(this.order.length) {
      if(this.mergedMode) {
        var gc = this.getMergedContext();
        return gc.apply(gc, arguments);
      } else {
        var gc = this.libs[this.order[this.order.length-1]];
        return gc.apply(gc, arguments);
      }
    } else {
      if(getContext) {
        return getContext.apply(getContext, arguments);
      } else {
        throw "No context registered!";
      }
    }
  },

  setMergedMode: function(options) {
    // Set to retrieve a context merged from all contexts registered
    // options can be true or an object with the following properties:
    // -displayed: name of module to display first
    this.mergedMode = options;
  },

  getMergedContext: function() {
    // Make a context merged from multiple contexts
    if(this.mergedMode.displayed && this.order.indexOf(this.mergedMode.displayed) > -1) {
      this.order.splice(this.order.indexOf(this.mergedMode.displayed), 1);
      this.order.unshift(this.mergedMode.displayed);
    }
    var that = this;

    return function(display, infos) {
      // Merged context
      var context = quickAlgoContext(display, infos);
      var localLanguageStrings = {};
      context.customBlocks = {};
      context.customConstants = {};
      context.conceptList = [];

      var subContexts = [];
      for(var scIdx=0; scIdx < that.order.length; scIdx++) {
        // Only the first context gets display = true
        var newContext = that.libs[that.order[scIdx]](display && (scIdx == 0), infos);
        subContexts.push(newContext);

        // Merge objects
        mergeIntoObject(localLanguageStrings, newContext.localLanguageStrings);
        mergeIntoObject(context.customBlocks, newContext.customBlocks);
        mergeIntoObject(context.customConstants, newContext.customConstants);
        mergeIntoArray(context.conceptList, newContext.conceptList);

        // Merge namespaces
        for(var namespace in newContext.customBlocks) {
          if(!context[namespace]) { context[namespace] = {}; }
          for(var category in newContext.customBlocks[namespace]) {
            var blockList = newContext.customBlocks[namespace][category];
            for(var i=0; i < blockList.length; i++) {
              var name = blockList[i].name;
              if(name && !context[namespace][name] && newContext[namespace][name]) {
                context[namespace][name] = function(nc, func) {
                  return function() {
                    context.propagate(nc);
                    func.apply(nc, arguments);
                    };
                }(newContext, newContext[namespace][name]);
              }
            }
          }
        }
      }

      var strings = context.setLocalLanguageStrings(localLanguageStrings);

      // Propagate properties to the subcontexts
      context.propagate = function(subContext) {
        var properties = ['raphaelFactory', 'delayFactory', 'blocklyHelper', 'display', 'runner'];
        for(var i=0; i < properties.length; i++) {
          subContext[properties[i]] = context[properties[i]];
        }
      }

      // Merge functions
      context.reset = function(taskInfos) {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].reset(taskInfos);
        }
      };
      context.resetDisplay = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].resetDisplay();
        }
      };
      context.updateScale = function() {
        for(var i=0; i < subContexts.length; i++) {
          context.propagate(subContexts[i]);
          subContexts[i].updateScale();
        }
      };
      context.unload = function() {
        for(var i=subContexts.length-1; i >= 0; i--) {
          // Do the unload in reverse order
          context.propagate(subContexts[i]);
          subContexts[i].unload();
        }
      };
      context.provideBlocklyColours = function() {
        var colours = {};
        for(var i=0; i < subContexts.length; i++) {
          mergeIntoObject(colours, subContexts[i].provideBlocklyColours());
        }
        return colours;
      };

      // Fetch some other data / functions some contexts have
      for(var i=0; i < subContexts.length; i++) {
        for(var prop in subContexts[i]) {
          if(typeof context[prop] != 'undefined') { continue; }
          if(typeof subContexts[i][prop] == 'function') {
            context[prop] = function(sc, func) {
              return function() {
                context.propagate(sc);
                func.apply(sc, arguments);
              }
            }(subContexts[i], subContexts[i][prop]);
          } else {
            context[prop] = subContexts[i][prop];
          }
        }
      };

      return context;
    };
  },

  register: function(name, func) {
    if(this.order.indexOf(name) > -1) { return; }
    this.libs[name] = func;
    this.order.push(name);
  }
};

// Initialize with contexts loaded before
if(window.quickAlgoLibrariesList) {
  for(var i=0; i<quickAlgoLibrariesList.length; i++) {
    quickAlgoLibraries.register(quickAlgoLibrariesList[i][0], quickAlgoLibrariesList[i][1]);
  }
}
