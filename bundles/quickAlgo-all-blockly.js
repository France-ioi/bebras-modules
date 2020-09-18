/*
    utils:
        Various utility functions for all modes.
*/

var getUrlParameter = function getUrlParameter(sParam) {
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
   var el = '#' + id
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


window.iOSDetected = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));

(function() {
   var detectTouch = null;
   detectTouch = function() {
      window.touchDetected = true;
      window.removeEventListener('touchstart', detectTouch);
      }
   window.addEventListener('touchstart', detectTouch);
})();

/*
    i18n:
        Translations for the various strings in quickAlgo
*/

var localLanguageStrings = {
   fr: {
      categories: {
         actions: "Actions",
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
      invalidContent: "Contenu invalide",
      unknownFileType: "Type de fichier non reconnu",
      download: "télécharger",
      smallestOfTwoNumbers: "Plus petit des deux nombres",
      greatestOfTwoNumbers: "Plus grand des deux nombres",
      flagClicked: "Quand %1 cliqué",
      tooManyIterations: "Votre programme met trop de temps à se terminer !",
      tooManyIterationsWithoutAction: "Votre programme s'est exécuté trop longtemps sans effectuer d'action !",
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
      limitBlocks: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitBlocksOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      limitElements: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitElementsOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      capacityWarning: "Attention : votre programme est invalide car il utilise trop de blocs. Faites attention à la limite de blocs affichée en haut à droite de l'éditeur.",
      clipboardDisallowedBlocks: "Vous ne pouvez pas coller ce programme, car il contient des blocs non autorisés dans cette version.",
      previousTestcase: "Précédent",
      nextTestcase: "Suivant",
      allTests: "Tous les tests : ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "Vous utilisez trop de blocs !",
      limitedBlock: "Vous utilisez trop souvent un bloc à utilisation limitée :",
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
      displayVideo: "Afficher la vidéo",
      showDetails: "Plus de détails",
      hideDetails: "Masquer les détails",
      editor: "Éditeur",
      instructions: "Énoncé",
      testLabel: "Test",
      testError: "erreur",
      testSuccess: "validé",
      seeTest: "voir",
      infiniteLoop: "répéter indéfiniment"
   },
   en: {
      categories: {
         actions: "Actions",
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
         print: "Writing"
      },
      invalidContent: "Invalid content",
      unknownFileType: "Unrecognized file type",
      download: "download",
      smallestOfTwoNumbers: "Smallest of the two numbers",
      greatestOfTwoNumbers: "Greatest of the two numbers",
      flagClicked: "When %1 clicked",
      tooManyIterations: "Too many iterations!",
      tooManyIterationsWithoutAction: "Too many iterations without action!",
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
      limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available.",
      limitElements: "{remainingBlocks} elements remaining out of {maxBlocks} available.",
      limitElementsOver: "{remainingBlocks} elements over the limit of {maxBlocks} available.",
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",
      clipboardDisallowedBlocks: "You cannot paste this program, as it contains blocks which aren't allowed in this version.",
      previousTestcase: "Previous",
      nextTestcase: "Next",
      allTests: "All tests: ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "You use too many blocks!",
      limitedBlock: "You use too many of a limited use block:",
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
      displayVideo: "Display video",
      showDetails: "Show details",
      hideDetails: "Hide details",
      editor: "Editor",
      instructions: "Instructions",
      testLabel: "Test",
      testError: "error",
      testSuccess: "valid",
      seeTest: "see test"
   },
   de: {
      categories: {
         actions: "Aktionen",
         sensors: "Sensoren",
         debug: "Debug",
         colour: "Farben",
         data: "Daten", // TODO :: translate
         dicts: "Hash-Map",
         input: "Eingabe",
         lists: "Listen",
         tables: "Tables", // TODO :: translate
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
      invalidContent: "Ungültiger Inhalt",
      unknownFileType: "Ungültiger Datentyp",
      download: "Herunterladen",
      smallestOfTwoNumbers: "Kleinere von zwei Zahlen",
      greatestOfTwoNumbers: "Größere von zwei Zahlen",
      flagClicked: "Sobald %1 geklickt", // (scratch start flag, %1 is the flag icon)
      tooManyIterations: "Zu viele Anweisungen wurden ausgeführt!",
      tooManyIterationsWithoutAction: "Zu viele Anweisungen ohne eine Aktion wurden ausgeführt!",
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
      stopProgramDesc: "Von vorne anfangen", // TODO :: translate and next 5
      stepProgramDesc: "Schritt für Schritt",
      slowSpeedDesc: "Für diesen Test ausführen",
      mediumSpeedDesc: "Mittlere Geschwindigkeit",
      fastSpeedDesc: "Schnell",
      ludicrousSpeedDesc: "Sehr schnell",
      selectLanguage: "Sprache:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generiere von Blockly-Blöcken",
      loadExample: "Insert example", // TODO :: translate
      saveOrLoadButton: "Load / save", // TODO :: translate
      saveOrLoadProgram: "Speicher oder lade deinen Quelltext:",
      avoidReloadingOtherTask: "Warnung: Lade keinen Quelltext von einer anderen Aufgabe!",
      files: "Dateien",
      reloadProgram: "Laden",
      restart: "Restart",  // TODO :: translate
      loadBestAnswer: "Load best answer",  // TODO :: translate
      saveProgram: "Speichern",
      copy: "Copy", // TODO :: translate
      paste: "Paste",
      blocklyToPython: "Convert to Python",
      blocklyToPythonTitle: "Python code",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Insert instructions here',
      limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.",
      limitBlocksOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.", // TODO :: stimmt das?
      limitElements: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.", // TODO :: check this one and next one (same strings as above but with "elements" instead of "blocks"
      limitElementsOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.",
      capacityWarning: "Warning : your program is invalid as it uses too many blocks. Be careful of the block limit displayed on the top right side of the editor.",  // TODO :: translate
      clipboardDisallowedBlocks: "You cannot paste this program, as it contains blocks which aren't allowed in this version.", // TODO :: translate
      previousTestcase: " < ",
      nextTestcase: " > ",
      allTests: "Alle Testfälle: ",
      errorEmptyProgram: "Das Programm enthält keine Befehle. Verbinde die Blöcke um ein Programm zu schreiben.",
      tooManyBlocks: "Du benutzt zu viele Bausteine!",
      limitedBlock: "You use too many of a limited use block:", // TODO
      uninitializedVar: "Nicht initialisierte Variable:",
      undefinedMsg: "This can be because of an access to an index out of a list, or an undefined variable.", // TODO :: translate
      valueTrue: 'wahr',
      valueFalse: 'unwahr',
      evaluatingAnswer: 'Evaluation in progress', // TODO
      correctAnswer: 'Richtige Antwort',
      partialAnswer: 'Teilweise richtige Antwort',
      wrongAnswer: 'Falsche Antwort',
      resultsNoSuccess: "Du hast keinen Testfall richtig.",
      resultsPartialSuccess: "Du hast {nbSuccess} von {nbTests} Testfällen richtig.",
      gradingInProgress: "Das Ergebnis wird ausgewertet …",
      introTitle: "Your mission",  // TODO :: translate
      introDetailsTitle: "Mission details",  // TODO :: translate
      textVariable: "Text",
      listVariable: "Liste",
      scaleDrawing: "Scale 2×",
      loopRepeat: "wiederhole",
      loopDo: "mache",
      displayVideo: "Display video", // TODO :: translate
      showDetails: "Show details", // TODO :: translate
      hideDetails: "Hide details",  // TODO :: translate
      editor: "Editor",  // TODO :: translate
      instructions: "Instructions",  // TODO :: translate
      testLabel: "Test", // TODO :: translate
      testError: "error",  // TODO :: translate
      testSuccess: "valid",  // TODO :: translate
      seeTest: "see test"  // TODO :: translate
   },
   es: {
      categories: {
         actions: "Acciones",
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
      invalidContent: "Contenido inválido",
      unknownFileType: "Tipo de archivo no reconocido",
      download: "descargar",
      smallestOfTwoNumbers: "El menor de dos números",
      greatestOfTwoNumbers: "El mayor de dos números",
      flagClicked: "Cuando se hace click en %1",
      tooManyIterations: "¡Su programa se tomó demasiado tiempo para terminar!",
      tooManyIterationsWithoutAction: "¡Su programa se tomó demasiado tiempo para terminar!", // TODO :: change translation
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
      avoidReloadingOtherTask: "Atención: ¡no recargue el programa de otro problema!",
      files: "Archivos",
      reloadProgram: "Recargar",
      restart: "Reiniciar",
      loadBestAnswer: "Cargar la mejor respuesta",
      saveProgram: "Guardar",
      copy: "Copy", // TODO :: translate
      paste: "Paste",
      blocklyToPython: "Convert to Python",
      blocklyToPythonTitle: "Python code",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Insert instructions here',
      limitBlocks: "{remainingBlocks} bloques disponibles de {maxBlocks} autorizados.",
      limitBlocksOver: "{remainingBlocks} bloques sobre el límite de {maxBlocks} autorizados.",
      limitElements: "{remainingBlocks} elementos disponibles de {maxBlocks} autorizados.",
      limitElementsOver: "{remainingBlocks} elementos sobre el límite de {maxBlocks} autorizados.",
      capacityWarning: "Advertencia: tu programa está inválido porque ha utilizado demasiados bloques. Pon atención al límite de bloques permitidos mostrados en la parte superior derecha del editor.",
      clipboardDisallowedBlocks: "You cannot paste this program, as it contains blocks which aren't allowed in this version.", // TODO :: translate
      previousTestcase: "Anterior",
      nextTestcase: "Siguiente",
      allTests: "Todas las pruebas:",
      errorEmptyProgram: "¡El programa está vacío! Conecte algunos bloques.",
      tooManyBlocks: "¡Utiliza demasiados bloques!",
      limitedBlock: "Utiliza demasiadas veces un tipo de bloque limitado:",
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
      displayVideo: "Mostrar el video",
      showDetails: "Mostrar más información",
      hideDetails: "Ocultar información",
      editor: "Editor",
      instructions: "Enunciado",
      testLabel: "Caso",
      testError: "error",
      testSuccess: "correcto",
      seeTest: "ver",
      infiniteLoop: "repetir indefinidamente"
   },
   sl: {
      categories: {
         actions: "Dejanja",
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
         turtle: "Želva"
      },
      invalidContent: "Neveljavna vsebina",
      unknownFileType: "Neznana vrsta datoteke",
      download: "prenos",
      smallestOfTwoNumbers: "Manjše od dveh števil",
      greatestOfTwoNumbers: "Večje od dveh števil",
      flagClicked: "Ko je kliknjena %1",
      tooManyIterations: "Preveč ponovitev!",
      tooManyIterationsWithoutAction: "Preveč ponovitev brez dejanja!",
      submitProgram: "Oddaj program",
      runProgram: "Poženi program",
      stopProgram: "|<",
      speedSliderSlower: "Slower",
      speedSliderFaster: "Faster",
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
      avoidReloadingOtherTask: "Opozorilo: Za drugo nalogo ne naloži kode znova!",
      files: "Datoteke",
      reloadProgram: "Znova naloži",
      restart: "Ponastavi",
      loadBestAnswer: "Naloži najboljši odgovor",
      saveProgram: "Shrani",
      copy: "Copy", // TODO :: translate
      paste: "Paste",
      blocklyToPython: "Convert to Python",
      blocklyToPythonTitle: "Python code",
      blocklyToPythonIntro: "",
      blocklyToPythonPassComment: '# Insert instructions here',
      limitBlocks: "Delčkov na voljo: {remainingBlocks}",
      limitBlocksOver: "{remainingBlocks} delčkov preko meje {maxBlocks}",
      limitElements: "{remainingBlocks} elementov izmed {maxBlocks} imaš še na voljo.",
      limitElementsOver: "{remainingBlocks} elementov preko meje {maxBlocks} elementov, ki so na voljo.",
      capacityWarning: "Opozorilo : program je rešen narobe, uporablja preveliko število delčkov. Bodi pozoren na število delčkov, ki jih lahko uporabiš, informacijo o tem imaš zgoraj.",
      clipboardDisallowedBlocks: "You cannot paste this program, as it contains blocks which aren't allowed in this version.", // TODO :: translate
      previousTestcase: "Nazaj",
      nextTestcase: "Naprej",
      allTests: "Vsi testi: ",
      errorEmptyProgram: "Program je prazen! Poveži delčke.",
      tooManyBlocks: "Uporabljaš preveč delčkov!",
      limitedBlock: "Uporabljaš preveliko število omejeneg števila blokov:",
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
      loopRepeat: "repeat",
      loopDo: "do",
      displayVideo: "Prikaži video",
      showDetails: "Prikaži podrobnosti",
      hideDetails: "Skrij podrobnosti",
      editor: "Urednik",
      instructions: "Navodila",
      testLabel: "Test",
      testError: "napaka",
      testSuccess: "pravilno",
      seeTest: "poglej test"
   }
};


window.stringsLanguage = window.stringsLanguage || "fr";
window.languageStrings = window.languageStrings || {};

if (typeof window.languageStrings != "object") {
   console.error("window.languageStrings is not an object");
}
else { // merge translations
   $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
}

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

   appendTaskIntro: function(html) {
      $('#taskIntro').append(html);
   },

   toggleLongIntro: function(forceNewState) {
      // For compatibility with new interface
   },

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

   updateControlsDisplay: function() {}
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
      'logic_compare': ['operator_equals', 'operator_gt', 'operator_lt', 'operator_not'],
      'logic_operation': ['operator_and', 'operator_or'],
      'text': [],
      'text_append': [],
      'text_join': ['operator_join'],
      'math_arithmetic': ['operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide'],
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
   'controls_if_else': ['controls_if'],
   'lists_create_with_empty': ['lists_create_with']
}


function getBlocklyBlockFunctions(maxBlocks, nbTestCases) {
   // TODO :: completely split the logic so it can be a separate object

   return {
      allBlocksAllowed: [],

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

      getBlockLabel: function(type) {
         // Fetch user-friendly name for the block
         var msg = this.mainContext.strings.label[type];
         // TODO :: Names for Blockly/Scratch blocks
         return msg ? msg : type;
      },

      checkConstraints: function(workspace) {
         // Check we satisfy constraints
         return this.getRemainingCapacity(workspace) >= 0 && !this.findLimited(workspace);
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
                            addInSet(blocks, convBlockList[k]);
                        }
                    } else {
                        addInSet(blocks, curBlock);
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
            if(!this.limitedPointers[blockType]) { continue; }
            for(var j = 0; j < this.limitedPointers[blockType].length; j++) {
                // Each pointer is a position in the limitedUses array that
                // this block appears in
                var pointer = this.limitedPointers[blockType][j];
                if(!usesCount[pointer]) { usesCount[pointer] = 0; }
                usesCount[pointer]++;

                // Exceeded the number of uses
                if(usesCount[pointer] > this.mainContext.infos.limitedUses[pointer].nbUses) {
                    return blockType;
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
         if(this.maxBlocks && remaining == Infinity) {
            // Blockly won't return anything as we didn't set a limit
            remaining = this.maxBlocks+1 - workspace.getAllBlocks().length;
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

      getCode: function(language, codeWorkspace, noReportValue) {
         if (codeWorkspace == undefined) {
            codeWorkspace = this.workspace;
         }
         if(!this.checkConstraints(codeWorkspace)) {
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
            block.blocklyJson.message0 = context.strings.label[block.name];
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
                           params += Blockly[language].valueToCode(block, 'PARAM_' + iParam, Blockly[language].ORDER_ATOMIC);
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
         if (typeof block.blocklyInit == "undefined") {
            var blocklyjson = block.blocklyJson;
            Blockly.Blocks[block.name] = {
               init: function() {
                  this.jsonInit(blocklyjson);
               }
            };
         }
         else if (typeof block.blocklyInit == "function") {
            Blockly.Blocks[block.name] = {
               init: block.blocklyInit()
            };
         }
         else {
            console.err(block.name + ".blocklyInit is defined but not a function");
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

      createGeneratorsAndBlocks: function() {
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
         var colours = {
            categories: {
               logic: 210,
               loops: 120,
               control: 120,
               math: 230,
               operator: 230,
               texts: 160,
               lists: 260,
               colour: 20,
               variables: 330,
               functions: 290,
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
                  blocklyXml: "<block type='controls_if'></block>"
               },
               {
                  name: "controls_if_else",
                  blocklyXml: "<block type='controls_if'><mutation else='1'></mutation></block>",
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
                  blocklyXml: "<block type='controls_repeat'></block>",
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
                  name: "text_charAt_noShado",
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
                  blocklyXml: "<block type='lists_sort_place'></block>"
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
                  blocklyXml: "<block type='lists_append'></block>"
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
                     blocklyXml: "<block type='control_if'></block>"
                  },
                  {
                     name: "control_if_else",
                     blocklyXml: "<block type='control_if_else'></block>"
                  },
                  {
                     name: "control_repeat",
                     blocklyXml: "<block type='control_repeat'>" +
                                 "  <value name='TIMES'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>10</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "control_repeat_until",
                     blocklyXml: "<block type='control_repeat_until'></block>"
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
                     blocklyXml: "<block type='lists_sort_place'></block>"
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
                     name: "operator_lt",
                     blocklyXml: "<block type='operator_lt'>" +
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
         Blockly.Variables.flyoutOptions = {
            any: false,
            anyButton: !!this.includeBlocks.groupByCategory,
            fixed: [],
            includedBlocks: {get: true, set: true, incr: true},
            shortList: true
         };

         Blockly.Procedures.flyoutOptions = {
            includedBlocks: {noret: false, ret: false, ifret: false}
         };

         // Initialize allBlocksAllowed
         this.allBlocksAllowed = [];
         this.addBlocksAllowed(['robot_start']);
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

         var taskStdInclude = (this.includeBlocks && this.includeBlocks.standardBlocks) || {};
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
         mergeIntoArray(stdInclude.singleBlocks, taskStdInclude.singleBlocks || []);
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
               Blockly.Procedures.flyoutOptions.includedBlocks = {noret: true, ret: true, ifret: true};
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

         var singleBlocks = stdInclude.singleBlocks;
         for(var iBlock = 0; iBlock < singleBlocks.length; iBlock++) {
            var blockName = singleBlocks[iBlock];
            if(blockName == 'procedures_defnoreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['noret'] = true;
            } else if(blockName == 'procedures_defreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['ret'] = true;
            } else if(blockName == 'procedures_ifreturn') {
               Blockly.Procedures.flyoutOptions.includedBlocks['ifret'] = true;
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
               || Blockly.Procedures.flyoutOptions.includedBlocks['ifret']) {
            if(Blockly.Procedures.flyoutOptions.includedBlocks['noret']) {
               this.addBlocksAllowed(['procedures_defnoreturn', 'procedures_callnoreturn']);
            } else if(Blockly.Procedures.flyoutOptions.includedBlocks['ret']) {
               this.addBlocksAllowed(['procedures_defreturn', 'procedures_callnoreturn']);
            } else if(Blockly.Procedures.flyoutOptions.includedBlocks['ifret']) {
               this.addBlocksAllowed(['procedures_ifreturn']);
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

         var xmlString = "";
         for (var categoryName in categoriesInfos) {
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
                  "message0": that.strings.flagClicked,
                  "args0": [
                    {
                      "type": "field_image",
                      "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_whenflagclicked.svg",
                      "width": 24,
                      "height": 24,
                      "alt": "flag",
                      "flip_rtl": true
                    }
                  ],
                  "inputsInline": true,
                  "nextStatement": null,
                  "category": Blockly.Categories.event,
                  "colour": Blockly.Colours.event.primary,
                  "colourSecondary": Blockly.Colours.event.secondary,
                  "colourTertiary": Blockly.Colours.event.tertiary
                });
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
         }

         Blockly.JavaScript['robot_start'] = function(block) {
           return "";
         };

         Blockly.Python['robot_start'] = function(block) {
           return "";
         };
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

      checkBlocksAreAllowed: function(xml, silent) {
         if(this.includeBlocks && this.includeBlocks.standardBlocks && this.includeBlocks.standardBlocks.includeAll) { return true; }
         var allowed = this.getBlocksAllowed();
         var blockList = xml.getElementsByTagName('block');
         var notAllowed = [];
         function checkBlock(block) {
            var blockName = block.getAttribute('type');
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

            // Clean up IDs which contain now forbidden characters
            var blockId = block.getAttribute('id');
            if(blockId && (blockId.indexOf('%') != -1 || blockId.indexOf('$') != -1 || blockId.indexOf('^') != -1)) {
               block.setAttribute('id', Blockly.genUid());
            }

            // Clean up read-only attributes
            if(block.getAttribute('type') != 'robot_start') {
               block.removeAttribute('deletable');
               block.removeAttribute('movable');
               block.removeAttribute('editable');
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
      }
   };
}

/*
    blockly_interface:
        Blockly mode interface and running logic
*/

function getBlocklyInterface(maxBlocks, nbTestCases) {
   return {
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
      player: 0,
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

      glowingBlock: null,

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
         for (var iPlayer = this.mainContext.nbRobots - 1; iPlayer >= 0; iPlayer--) {
            this.programs[iPlayer] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
            this.languages[iPlayer] = "blockly";
            this.setPlayer(iPlayer);
            if(this.startingBlock || options.startingExample) {
               var xml = this.getDefaultContent();
               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }

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
         // TODO :: find why it's not properly rendered in the first place
         if(!this.scratchMode && this.workspace.flyout_ && this.reloadForFlyout < 5) {
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
         this.onResize = debounce(this.onResizeFct.bind(this), 500, false);
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
         if(this.mainContext.runner) {
            this.mainContext.runner.reset();
         }
         if(this.scratchMode) {
            this.glowBlock(null);
         }
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
         if(this.scratchMode) {
            this.glowBlock(null);
         } else if(Blockly.selected) {
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
            return {text: this.strings.limitedBlock+' "'+this.getBlockLabel(limited)+'".', invalid: true, type: 'limited'};
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
            var capacityInfo = this.getCapacityInfo();
            if(window.quickAlgoInterface) {
               if(eventType === Blockly.Events.Move) {
                  // Only display popup when we drop the block, not on creation
                  capacityInfo.popup = true;
               }
               window.quickAlgoInterface.displayCapacity(capacityInfo);
               window.quickAlgoInterface.onEditorChange();
            } else {
               $('#capacity').html(capacityInfo.text);
            }
            this.onChangeResetDisplay();
         } else {
            Blockly.svgResize(this.workspace);
         }

         // Refresh the toolbox for new procedures (same with variables
         // but it's already handled correctly there)
         if(this.scratchMode && this.includeBlocks.groupByCategory && this.workspace.toolbox_) {
            this.workspace.toolbox_.refreshSelection();
         }
      },

      setIncludeBlocks: function(includeBlocks) {
         this.includeBlocks = includeBlocks;
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
         if(this.options.startingExample) {
            var xml = this.options.startingExample[this.language];
            if(xml) { return xml; }
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

      setPlayer: function(newPlayer) {
         this.player = newPlayer;
         $("#selectPlayer").val(this.player);
         $(".robot0, .robot1").hide();
         $(".robot" + this.player).show();
      },

      changePlayer: function() {
         this.loadPlayer($("#selectPlayer").val());
      },

      loadPlayer: function(player) {
         this.savePrograms();
         this.player = player;
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            $(".robot" + iRobot).hide();
         }
         $(".robot" + this.player).show();

         $(".language_blockly, .language_javascript").hide();
         $(".language_" + this.languages[this.player]).show();

         var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
         $("#selectLanguage").val(this.languages[this.player]);
         if (this.languages[this.player] == "blockly") {
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

         this.programs[this.player].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.cleanBlockAttributes(xml);

            if (this.mainContext.savePrograms) {
               this.mainContext.savePrograms(xml);
            }

            this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.player].blocklyJS = this.getCode("javascript");
            //this.programs[this.player].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
            this.workspace.clear();
            this.cleanBlockAttributes(xml, this.getOrigin());
            Blockly.Xml.domToWorkspace(xml, this.workspace);

            if (this.mainContext.loadPrograms) {
               this.mainContext.loadPrograms(xml);
            }
         }
         $("#program").val(this.programs[this.player].javascript);
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

         if(this.scratchMode) {
            this.glowBlock(this.glowingBlock);
            this.glowingBlock = xml.firstChild.getAttribute('id');
         } else {
            this.workspace.traceOn(true);
            this.workspace.highlightBlock(xml.firstChild.getAttribute('id'));
         }
      },

      loadExample: function(exampleObj) {
         var example = this.scratchMode ? exampleObj.scratch : exampleObj.blockly
         if (this.workspace != null && example) {
            var xml = Blockly.Xml.textToDom(example);
            this.loadProgramFromDom(xml);
         }
      },

      changeLanguage: function() {
         this.languages[this.player] = $("#selectLanguage").val();
         this.loadPlayer(this.player);
      },

      importFromBlockly: function() {
          //var player = $("#selectPlayer").val();
          var player = 0;
          this.programs[player].javascript = this.getCode("javascript");
          $("#program").val(this.programs[player].javascript);
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
                     that.programs[that.player].blockly = code;
                     that.languages[that.player] = "blockly";
                  } catch(e) {
                     that.displayError('<span class="testError">'+that.strings.invalidContent+'</span>');
                     that.keepDisplayedError = true;
                  }
               } else {
                  that.programs[that.player].javascript = code;
                  that.languages[that.player] = "javascript";
               }
               that.loadPrograms();
               that.loadPlayer(that.player);
            }

            reader.readAsText(file);
         } else {
            that.displayError('<span class="testError">'+this.strings.unknownFileType+'</span>');
            that.keepDisplayedError = true;
         }
      },

      saveProgram: function() {
         this.savePrograms();
         var code = this.programs[this.player][this.languages[this.player]];
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
         if (this.languages[this.player] == "blockly") {
            panelWidth = $("#blocklyDiv").width() - 10;
         } else {
            panelWidth = $("#program").width() + 20;
         }
         if (force || panelWidth != this.prevWidth) {
            if (this.languages[this.player] == "blockly") {
               if (this.trashInToolbox) {
                  Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               }
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
      },

      glowBlock: function(id) {
         // highlightBlock replacement for Scratch
         if(this.glowingBlock) {
            try {
               this.workspace.glowBlock(this.glowingBlock, false);
            } catch(e) {}
         }
         if(id) {
            this.workspace.glowBlock(id, true);
         }
         this.glowingBlock = id;
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
               return;
            }
         }

         this.savePrograms();

         var codes = [];
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            var language = this.languages[iRobot];
            if (language == "blockly") {
               language = "blocklyJS";
            }
            codes[iRobot] = this.getFullCode(this.programs[iRobot][language]);
         }
         this.highlightPause = false;
         if(this.getRemainingCapacity(that.workspace) < 0) {
            this.displayError('<span class="testError">'+this.strings.tooManyBlocks+'</span>');
            return;
         }
         var limited = this.findLimited(this.workspace);
         if(limited) {
            this.displayError('<span class="testError">'+this.strings.limitedBlock+' "'+this.getBlockLabel(limited)+'".</span>');
            return;
         }
         if(!this.scratchMode) {
            this.workspace.traceOn(true);
            this.workspace.highlightBlock(null);
         }
         this.mainContext.runner.initCodes(codes);
      },


      run: function () {
         this.initRun();
         this.mainContext.runner.run();
      },

      step: function () {
         if(this.mainContext.runner.nbRunning() <= 0) {
            this.initRun();
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

function getBlocklyHelper(maxBlocks, nbTestCases) {
   // TODO :: temporary until splitting of the block functions logic is done
   var blocklyHelper = getBlocklyInterface(maxBlocks, nbTestCases);
   var blocklyBlockFunc = getBlocklyBlockFunctions(maxBlocks, nbTestCases);
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
            if(varName) {
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
            runner.delayFactory.createTimeout("wait" + context.curRobot + "_" + Math.random(), function() {
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
         runner.stackCount = 0;
         return function(value) {
            runner.noDelay(callback, value);
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value !== undefined) {
            if(value && typeof value.length != 'undefined') {
               // It's an array, create a primitive out of it
               primitive = interpreters[context.curRobot].nativeToPseudo(value);
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
                     primitive = interpreters[context.curRobot].nativeToPseudo(value);
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
         interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(createAsync(context.program_end)));

         function highlightBlock(id, callback) {
            id = id ? id.toString() : '';

            if (context.display) {
               try {
                  if(!runner.scratchMode) {
                     context.blocklyHelper.workspace.traceOn(true);
                     context.blocklyHelper.workspace.highlightBlock(id);
                     highlightPause = true;
                  } else {
                     context.blocklyHelper.glowBlock(id);
                     highlightPause = true;
                  }
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

      runner.stop = function() {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
               isRunning[iInterpreter] = false;
            }
         }

         if(runner.scratchMode) {
            Blockly.DropDownDiv.hide();
            context.blocklyHelper.glowBlock(null);
         }

         if(window.quickAlgoInterface) {
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
         // Handle the callback from last highlightBlock
         if(runner.nextCallback) {
            runner.nextCallback();
            runner.nextCallback = null;
         }

         try {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               context.curRobot = iInterpreter;
               if (context.infos.checkEndEveryTurn) {
                  context.infos.checkEndCondition(context, false);
               }
               var interpreter = interpreters[iInterpreter];
               while(!context.programEnded[iInterpreter]) {
                  if(!context.allowInfiniteLoop &&
                        (context.curSteps[iInterpreter].total >= runner.maxIter || context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction)) {
                     break;
                  }
                  if (!interpreter.step() || toStop[iInterpreter]) {
                     isRunning[iInterpreter] = false;
                     break;
                  }
                  if (interpreter.paused_) {
                     break;
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
         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.allowStepsWithoutDelay = 0;
         runner.firstHighlight = true;
         runner.stackCount = 0;
         context.programEnded = [];
         context.curSteps = [];
         runner.reset();
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = {
               total: 0,
               withoutAction: 0,
               lastNbMoves: 0
            };
            context.programEnded[iInterpreter] = false;
            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;
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
         runner.initCodes(codes);
         runner.runSyncBlock();
      };

      runner.run = function () {
         runner.stepMode = false;
         if(!runner.stepInProgress) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.step = function () {
         runner.stepMode = true;
         if(!runner.stepInProgress) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
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

      runner.reset = function() {
         if(runner.resetDone) { return; }
         context.reset();
         runner.stop();
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

   subTask.loadLevel = function(curLevel) {
      var levelGridInfos = extractLevelSpecific(subTask.gridInfos, curLevel);
      subTask.levelGridInfos = levelGridInfos;

      // Convert legacy options
      if(!levelGridInfos.hideControls) { levelGridInfos.hideControls = {}; }
      levelGridInfos.hideControls.saveOrLoad = levelGridInfos.hideControls.saveOrLoad || !!levelGridInfos.hideSaveOrLoad;
      levelGridInfos.hideControls.loadBestAnswer = levelGridInfos.hideControls.loadBestAnswer || !!levelGridInfos.hideLoadBestAnswers;

      subTask.blocklyHelper = getBlocklyHelper(subTask.levelGridInfos.maxInstructions);
      subTask.answer = null;
      subTask.state = {};
      subTask.iTestCase = 0;
      if(!window.taskResultsCache) {
         window.taskResultsCache = {};
      }
      if(!window.taskResultsCache[curLevel]) {
         window.taskResultsCache[curLevel] = {};
      }

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

      if (this.display) {
         window.quickAlgoInterface.loadInterface(this.context, curLevel);
         window.quickAlgoInterface.setOptions({
            hasExample: levelGridInfos.example && levelGridInfos.example[subTask.blocklyHelper.language],
            conceptViewer: levelGridInfos.conceptViewer,
            conceptViewerLang: this.blocklyHelper.language,
            hasTestThumbnails: levelGridInfos.hasTestThumbnails,
            hideControls: levelGridInfos.hideControls,
            introMaxHeight: levelGridInfos.introMaxHeight
         });
         window.quickAlgoInterface.bindBlocklyHelper(this.blocklyHelper);
      }

      this.blocklyHelper.loadContext(this.context);

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 30;

      var curIncludeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);

      // Load concepts into conceptViewer; must be done before loading
      // Blockly/Scratch, as scratch-mode will modify includeBlocks
      if(this.display && levelGridInfos.conceptViewer) {
         // TODO :: testConcepts is temporary-ish
         if(this.context.conceptList) {
            var allConcepts = this.context.conceptList.concat(testConcepts);
         } else {
            var allConcepts = testConcepts;
         }

         var concepts = window.getConceptsFromBlocks(curIncludeBlocks, allConcepts, this.context);
         if(levelGridInfos.conceptViewer.length) {
            concepts = concepts.concat(levelGridInfos.conceptViewer);
         } else {
            concepts.push('base');
         }
         concepts = window.conceptsFill(concepts, allConcepts);
         window.conceptViewer.loadConcepts(concepts);
      }

      this.blocklyHelper.setIncludeBlocks(curIncludeBlocks);

      var blocklyOptions = {
         readOnly: !!subTask.taskParams.readOnly,
         defaultCode: subTask.defaultCode,
         maxListSize: this.context.infos.maxListSize,
         startingExample: this.context.infos.startingExample
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
      subTask.iTestCase = iTestCase;
      subTask.context.reset(subTask.data[subTask.level][iTestCase]);
      subTask.context.iTestCase = iTestCase;
      subTask.context.nbTestCases = subTask.nbTestCases;
      //      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.context.messagePrefixFailure = '';
      subTask.context.messagePrefixSuccess = '';
      subTask.context.linkBack = false;
   };

   subTask.logActivity = function(details) {
      var logOption = subTask.taskParams && subTask.taskParams.options && subTask.taskParams.options.log;
      if(!logOption) { return; }

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

      // We can only log extended activity if the platform gave us a
      // logActivity function
      if(!window.logActivity) { return; }
      window.logActivity(details);
   };

   subTask.initRun = function(callback) {
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
         }
         // Log the attempt
         subTask.logActivity();
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
   };

   subTask.run = function(callback) {
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
      subTask.context.changeDelay(200);
      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.initRun();
      }
      subTask.blocklyHelper.step(subTask.context);
   };

   subTask.stop = function() {
      this.clearAnalysis();

      if(this.context.runner) {
         this.context.runner.stop();
      }

      // Reset everything through changeTest
      subTask.changeTest(0);
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
      if(this.context.runner) {
         this.context.runner.stepMode = true;
      }
   };

   // used in new playback controls with speed slider
   subTask.play = function() {
      this.clearAnalysis();

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

      var oldDelay = subTask.context.infos.actionDelay;
      subTask.context.changeDelay(0);
      var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
      code = subTask.blocklyHelper.getFullCode(code);

      var checkError = '';
      var checkDisplay = function(err) { checkError = err; }
      if(!subTask.blocklyHelper.checkCode(code, checkDisplay)) {
         var results = {
            message: checkError,
            successRate: 0,
            iTestCase: 0
         };
         subTask.context.changeDelay(oldDelay);
         window.subTaskValidating = false;
         callback(results);
         return;
      }

      var codes = [code]; // We only ever send one code to grade
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
         window.subTaskValidating = false;
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
}

var quickAlgoContext = function(display, infos) {
  var context = {
    display: display,
    infos: infos,
    nbRobots: 1
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
      if (dest[key1] != undefined) {
        if (typeof dest[key1] == "object") {
          replaceStringsRec(source[key1], dest[key1]);
        } else {
          dest[key1] = source[key1];
        }
      }
    }
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

  context.program_end = function(callback) {
    var curRobot = context.curRobot;
    if (!context.programEnded[curRobot]) {
      context.programEnded[curRobot] = true;
      infos.checkEndCondition(context, true);
    }
    context.waitDelay(callback);
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
