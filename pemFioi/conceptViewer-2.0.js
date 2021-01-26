var conceptViewerStrings = {
  fr: {
    viewerTitle: "Aide",
    selectLanguage: "Sélectionnez un langage…",
    selectTopic: "Sélectionnez une rubrique…",
    reloadFromTask: "Merci d'ouvrir cette documentation directement depuis l'exercice. Vous pouvez fermer cette fenêtre.",
    concepts: {
      "taskplatform": 'Résolution des exercices',
      "language": "Création d'un programme",
      "blockly_text_print": 'Afficher du texte',
      "blockly_text_print_noend": 'Afficher consécutivement du texte',
      "blockly_controls_repeat": 'Boucles de répétition',
      "blockly_controls_if": 'Conditions si',
      "blockly_controls_if_else": 'Conditions si/sinon',
      "blockly_controls_whileUntil": 'Boucles tant que ou jusqu\'à',
      "blockly_controls_infiniteloop": 'Boucle infinie',
      "blockly_logic_operation": 'Opérateurs logiques',
      "extra_nested_repeat": 'Boucles imbriquées',
      "extra_variable": 'Variables',
      "extra_list": 'Listes',
      "extra_function": 'Fonctions',
      "robot_commands": 'Commandes du robot',
      "arguments": 'Fonctions avec arguments',
    }
  },
  en: {
    viewerTitle: "Help",
    selectLanguage: "Select a language…",
    selectTopic: "Select a topic…",
    reloadFromTask: "Please open this documentation from your exercise. You can close this window.", // TODO :: verify
    concepts: {
      "taskplatform": 'Solving exercises',
      "language": "Program creation",
      "blockly_text_print": 'Afficher du texte',
      "blockly_text_print_noend": 'Afficher consécutivement du texte',
      "blockly_controls_repeat": 'Loops: repeat',
      "blockly_controls_if": 'if conditions',
      "blockly_controls_if_else": 'if/else conditions',
      "blockly_controls_whileUntil": 'Loops: while/until',
      "blockly_controls_infiniteloop": 'Infinite loop',
      "blockly_logic_operation": 'Logic operators',
      "extra_nested_repeat": 'Nested loops',
      "extra_variable": 'Variables',
      "extra_list": 'Lists',
      "extra_function": 'Functions',
      "robot_commands": 'Robot commands',
      "arguments": 'Functions with arguments',
    }
  },
  es: {
    viewerTitle: "Ayuda",
    selectLanguage: "Seleccione un lenguaje…",
    selectTopic: "Seleccione un tema…",
    reloadFromTask: "Please open this documentation from your exercise. You can close this window.", // TODO :: Translate
    concepts: {
      "taskplatform": 'Resolución de ejercicios',
      "language": "Creación de un programa",
      "blockly_text_print": 'Impresión de texto',
      "blockly_text_print_noend": 'Impresión consecutiva de texto',
      "blockly_controls_repeat": 'Bucles de repetición',
      "blockly_controls_if": 'Condiciones si',
      "blockly_controls_if_else": 'Condiciones si/sino',
      "blockly_controls_whileUntil": 'Bucles mientras y hasta que',
      "blockly_controls_infiniteloop": 'Repetir indefinidamente',
      "blockly_logic_operation": 'Operadores lógicos',
      "extra_nested_repeat": 'Bucles anidados',
      "extra_variable": 'Variables',
      "extra_list": 'Listas',
      "extra_function": 'Funciones',
      "robot_commands": 'Comandos del robot',
      "arguments": 'Funciones con argumentos',
    }
  },
  it: {
    viewerTitle: "Aiuto online",
    selectLanguage: "Seleziona una lingua…",
    selectTopic: "Seleziona un argomento…",
    reloadFromTask: "Please open this documentation from your exercise. You can close this window.", // TODO :: Translate
    concepts: {
      "taskplatform": 'Solving exercises',
      "language": "Programmazione",
      "blockly_text_print": 'Visualizzazione del testo',
      "blockly_text_print_noend": 'Visualizzazione del testo sequenziale',
      "blockly_controls_repeat": 'Ciclo di ripetizione',
      "blockly_controls_if": 'Istruzione if',
      "blockly_controls_if_else": 'Istruzione if / else',
      "blockly_controls_whileUntil": 'Ripetere fino a quando',
      "blockly_controls_infiniteloop": 'Loop infinito',
      "blockly_logic_operation": 'Operatori logici (booleani)',
      "extra_nested_repeat": 'Loop nidificati',
      "extra_variable": 'Variabili',
      "extra_list": 'Elenchi',
      "extra_function": 'Funzioni',
      "robot_commands": 'Robot commands',
      "arguments": 'Funzioni conargomenti',
    }
  }
};

window.stringsLanguage = window.stringsLanguage || "fr";

var conceptViewer = {
  version: 2,
  concepts: {},
  mainConcepts: [],
  loaded: false,
  shownTab: 'intro',
  shownConcept: null,
  introHtml: '',
  pythonIntro: {},
  selectedLanguage: null,
  fullScreen: false,
  contextTitle: undefined,
  allLangs: [
    {id: 'blockly', lbl: 'Blockly'},
    {id: 'scratch', lbl: 'Scratch'},
    {id: 'python', lbl: 'Python'}
    ],

  load: function (fullscreenLoad) {
    if (!this.fullScreen)
      this.fullScreen = fullscreenLoad;
    // Load the conceptViewer into the DOM
    if(this.loaded) { return; }

    this.strings = conceptViewerStrings[window.stringsLanguage] || conceptViewerStrings.fr;

    $('#blocklyLibContent').append('' +
        '<div id="conceptViewer" style="display:none;" class="panel">' +
            '<div class="panel-heading">'+
                '<h2 class="sectionTitle"><i class="fas fa-search-plus icon"></i>' + this.strings.viewerTitle + '</h2>' +
                '<div>' +
//                    '<button class="exit" onclick="conceptViewer.openInNewWidget();"><span class="icon fas fa-external-link-alt"></span></button>' +
                    '<button class="closeLongIntro exit" onclick="quickAlgoInterface.toggleMoreDetails(false);"><i class="fas fa-times"></i></button>' +
                '</div>' +
            '</div><div class="panel-body">' +
                '<div class="conceptViewer-tabs tabs-area"></div>' +
                '<div class="content"></div>' +
            '</div>' +
        '</div>');

    if (!this.fullScreen) {
      $('#conceptViewer').hide();
    } else {
      $('#conceptViewer').addClass('conceptViewer-fullscreen');
    }

    var that = this;

    this.loaded = true;
    this.loadNavigation();
  },

  addTab: function(id, title) {
    var html = '<span class="li conceptViewer-tab-' + id + '"><a>' + title + '</a></span>';
    $('.conceptViewer-tabs').append(html);

    var that = this;
    $('.conceptViewer-tab-' + id).on('click', function() {
      that.showTab(id);
      });
  },

  setIntroHtml: function(html) {
    this.introHtml = html;
  },

  setPythonIntro: function(html, callback) {
    this.pythonIntro = {html: html, callback: callback};
    this.loadNavigation();
  },

  selectTab: function(id) {
    $('.conceptViewer-tabs .li').removeClass('current');
    $('.conceptViewer-tab-' + id).addClass('current');
  },

  loadNavigation: function () {
    $('.conceptViewer-tabs').empty();
    this.addTab('toc', '<span class="fas fa-bars"></span>');
    this.addTab('intro', window.languageStrings.introDetailsTitle);
    if(this.pythonIntro.html) {
      this.addTab('python', 'Python');
    }
    for(var i = 0; i < this.mainConcepts.length ; i++) {
      this.addTab('mainConcept' + i, this.mainConcepts[i].name);
    }
    if(this.shownTab && this.shownTab != 'more') {
      this.showTab(this.shownTab);
    }
  },

  loadConcepts: function (newConcepts, mainConcepts) {
    // Load new concept information
    this.concepts = newConcepts;
    if(typeof mainConcepts == 'undefined') {
      this.mainConcepts = this.concepts.slice(-1);
    } else {
      this.mainConcepts = window.conceptsFill(mainConcepts, newConcepts);
    }
    if(this.loaded) {
      this.loadNavigation();
    }
  },

  selectLanguage: function(lang) {
    this.selectedLanguage = lang;
  },

  show: function (initConcept) {
    // Display the conceptViewer
    this.load();
    this.shown = true;
    $('#conceptViewer').fadeIn(500);
    if(initConcept !== false) {
      this.showTab(this.shownTab);
    }
  },

  showTab: function(id) {
    if(id != 'more') {
      $('.conceptViewer-tab-more').remove();
    } 
    this.shownTab = id;
    this.selectTab(id);
    if(id == 'toc') {
      this.loadToc();
    } else if(id == 'intro') {
      this.loadIntro();
    } else if(id == 'python') {
      this.loadPython();
    } else if(id.substring(0, 11) == 'mainConcept') {
      this.showConcept(this.mainConcepts[parseInt(id.substring(11))]);
    } else if(id == 'concept1') {
      this.showConcept(this.mainConcepts[1]);
    }
  },

  loadToc: function() {
    var html = '<div class="toc">';
    html += '<h2 class="sectionTitle"><i class="fas fa-bars icon"></i> Table des matières</h2><hr>';
    html += '<ul><li><a onclick="conceptViewer.showTab(\'intro\');">' + window.languageStrings.introDetailsTitle + '</a></li>';
    html += '<li>Documentation<ul>';
    for (var i = 0; i < this.concepts.length; i++) {
      var concept = this.concepts[i];
      html += '<li><a onclick="conceptViewer.showConcept(\'' + concept.id + '\');">' + concept.name + '</a></li>';
    }
    html += '</ul></li>';
    html += '</ul></div>';

    $('#conceptViewer .content').empty().html(html);
  },

  loadIntro: function() {
    var html = '<div>';
    html += '<h2 class="sectionTitle"><i class="fas fa-book icon"></i> ' + window.languageStrings.introDetailsTitle + '</h2><hr>';
    html += this.introHtml;
    html += '</div>';
    $('#conceptViewer .content').empty().html(html);
  },

  loadPython: function() {
    var html = '<div>';
    html += '<h2 class="sectionTitle"><i class="fab fa-python icon"></i> ' + 'Python' + '</h2><hr>';
    html += this.pythonIntro.html;
    html += '</div>';
    $('#conceptViewer .content').empty().html(html);
    this.pythonIntro.callback();
  },

  hide: function () {
    // Hide the conceptViewer
    this.load();
    $('#conceptViewer').fadeOut(500);
    this.loadUrl('');
    this.shown = false;
  },

  toggle: function(forceNewState) {
    if(forceNewState || (forceNewState !== false && !this.shown)) {
      this.show();
    } else {
      this.hide();
    }
    return this.shown;
  },

/*  openInNewWidget: function() {
    // we use the function to get the base url in order to support http and https.
    var url = getConceptViewerBaseUrl() + "display-documentation.html";

    // we put the language so we can do some operations faster and not depending on the jschannel
    var fullscreenWindow = window.open(url + "?lang=" + window.stringsLanguage);
    var channel = Channel.build({window: fullscreenWindow, origin: '*', scope: 'test'});

    var that = this;

    // The object sent from this page to the fullscreen concept viewer in order to get all the options.
    var conceptViewerConfigs = {
      concepts: that.concepts,
      selectedLang: that.selectedLanguage,
      shownConcept: that.shownConcept,
      contextTitle: that.contextTitle
    };

    channel.bind('getConceptViewerConfigs', function() {
      return conceptViewerConfigs;
    });

  },
*/
  showConcept: function (concept, show) {
    // Show a specific concept
    // Either a concept object can be given, either a concept ID can be given
    // directly
    var conceptUrl = null;
    var conceptId = null;
    var conceptName = null;
    if (concept.url) {
      conceptUrl = concept.url;
      conceptId = concept.id;
      conceptName = concept.name;
    } else {
      conceptId = concept.id ? concept.id : concept;
      for (var i=0; i<this.concepts.length; i++) {
        if(this.concepts[i].id == conceptId) {
          conceptUrl = this.concepts[i].url;
          conceptName = this.concepts[i].name;
        }
      }
    }
    if (conceptUrl) {
      this.shownConcept = conceptId;
      if(show || typeof show == 'undefined') { this.show(false); }

      var language = conceptViewer.selectedLanguage;
      var urlSplit = conceptUrl.split('#');
      if(urlSplit[1]) {
        urlSplit[urlSplit.length-1] = language+'-'+urlSplit[urlSplit.length-1];
      } else {
        urlSplit[1] = language;
      }
      conceptUrl = urlSplit.join('#');

      this.loadUrl(conceptUrl);

      var mainConceptIdx = -1;
      for(var i = 0; i < this.mainConcepts.length; i++) {
        if(this.mainConcepts[i].id == conceptId) {
          mainConceptIdx = i;
          break;
        }
      }
      if(mainConceptIdx > -1) {
        this.selectTab('mainConcept' + mainConceptIdx);
      } else {
        this.addTab('more', '<span class="fas fa-ellipsis-h"></span>');
        this.selectTab('more');
      }

      if (this.fullScreen) {
        document.title = conceptViewerStrings[window.stringsLanguage].viewerTitle + ' - ' + conceptName;
      }
      return true;
    } else {
      return false;
    }
  },

  loadUrl: function (url) {
    // Load an URL into the iframe
    if(window.conceptViewerUrlFunction) {
      url = window.conceptViewerUrlFunction(url);
    }
    if($('#conceptViewer .viewerContent').length == 0) {
      var html = '<div class="viewer"><iframe class="viewerContent" name="viewerContent"></iframe></div>';
      $('#conceptViewer .content').empty().html(html);
    }
    $('#conceptViewer .viewerContent').attr('src', url);
  },

  hasConcept: function (conceptName) {
    // Check if a specific concept exists in the list of concepts
    for (var i=0; i<this.concepts.length; i++) {
      if(this.concepts[i].id == conceptName) {
        return true;
      }
    }
    return false;
  },

  hasPythonConcept: function (pythonCode) {
    for (var i=0; i<this.concepts.length; i++) {
      var pythonList = this.concepts[i].python;
      if(pythonList && pythonList.indexOf(pythonCode) > -1) {
        return this.concepts[i].id;
      }
    }
    return false;
  },

  languageChanged: function () {
    $('#showNavigationLanguage').prop('checked', false);
    for(var i=0; i<this.allLangs.length; i++) {
      if(this.allLangs[i].id == conceptViewer.selectedLanguage) {
        $('#showNavigationLanguageLabel').text(this.allLangs[i].lbl);
        break;
      }
    }
    this.loadNavigation();
  },

  unload: function() {
    $('#conceptViewer').remove();
    this.loaded = false;
  }
};


function getConceptViewerBaseUrl() {
    // Specific configuration to go through the domain itself if there's a 'p=1'
    // argument or we are on concours2.castor-informatique.fr
    var baseUrl = '';
    baseUrl += (window.location.protocol == 'http:' ? 'http:' : 'https:') + '//';
    baseUrl += ((window.location.search.indexOf('p=1') > -1
        || window.location.hostname == 'concours2.castor-informatique.fr')
       ? window.location.host : 'static4.castor-informatique.fr');
    baseUrl += '/help/';
    return baseUrl;
}


function getConceptViewerBaseConcepts() {
    // Get base concepts in the default help
    var baseUrl = getConceptViewerBaseUrl();
    if(window.stringsLanguage == 'es' || window.stringsLanguage == 'it') {
        baseUrl += 'index_' + window.stringsLanguage + '.html';
    } else {
        baseUrl += 'index.html';
    }
    var baseConcepts = [
        {id: 'taskplatform', name: 'Résolution des exercices', url: baseUrl+'#taskplatform', language: 'all'},
        {id: 'language', name: "Création d'un programme", url: baseUrl+'#language'},
        {id: 'blockly_controls_repeat', name: 'Boucles de répétition', url: baseUrl+'#blockly_controls_repeat'},
        {id: 'blockly_controls_if', name: 'Conditions si', url: baseUrl+'#blockly_controls_if'},
        {id: 'blockly_controls_if_else', name: 'Conditions si/sinon', url: baseUrl+'#blockly_controls_if_else'},
        {id: 'blockly_controls_whileUntil', name: 'Boucles tant que ou jusqu\'à', url: baseUrl+'#blockly_controls_whileUntil'},
        {id: 'blockly_controls_infiniteloop', name: 'Boucle infinie', url: baseUrl+'#blockly_controls_infiniteloop'},
        {id: 'blockly_logic_operation', name: 'Opérateurs logiques', url: baseUrl+'#blockly_logic_operation'},
        {id: 'extra_nested_repeat', name: 'Boucles imbriquées', url: baseUrl+'#extra_nested_repeat'},
        {id: 'extra_variable', name: 'Variables', url: baseUrl+'#extra_variable'},
        {id: 'extra_list', name: 'Listes', url: baseUrl+'#extra_list'},
        {id: 'extra_function', name: 'Fonctions', url: baseUrl+'#extra_function'},
        {id: 'robot_commands', name: 'Commandes du robot', url: baseUrl+'#robot_commands'},
        {id: 'arguments', name: 'Fonctions avec arguments', url: baseUrl+'#arguments'},
        {id: 'blockly_text_print', name: 'Afficher du texte', url: baseUrl+'#blockly_text_print'},
        {id: 'blockly_text_print_noend', name: 'Afficher consécutivement du texte', url: baseUrl+'#blockly_text_print_noend'},
        {id: 'blockly_text_length', name: 'Longueur d\'une chaîne', url: baseUrl+'#blockly_text_length'},
        {id: 'blockly_text_join', name: 'Concaténer des chaînes', url: baseUrl+'#blockly_text_join'},
        {id: 'blockly_text_charAt', name: 'Obtenir un caractère d\'une chaîne', url: baseUrl+'#blockly_text_charAt'}
        ];
    for (var iConcept = 0; iConcept < baseConcepts.length; iConcept++) {
       baseConcepts[iConcept].order = 100 + iConcept;
    }
    return baseConcepts;
}


function conceptsFill(baseConcepts, allConcepts) {
  var conceptNames = (conceptViewerStrings[window.stringsLanguage] || conceptViewerStrings.fr)[
  "concepts"] || conceptViewerStrings.fr.concepts;
  var concepts = [];
  var baseConceptsById = {};
  for(var b=0; b<baseConcepts.length; b++) {
    var curConcept = baseConcepts[b];
    if(typeof curConcept === 'string') {
      baseConceptsById[curConcept] = {id: curConcept};
    } else {
      baseConceptsById[curConcept.id] = curConcept;
    }
  }
  for(var c=0; c<allConcepts.length; c++) {
    var fullConcept = allConcepts[c];
    if(baseConceptsById[fullConcept.id]) {
      var curConcept = baseConceptsById[fullConcept.id];
      // Translate concept name if available
      curConcept.name = conceptNames[curConcept.id] || fullConcept.name;
      if(!curConcept.url) {
        curConcept.url = fullConcept.url;
      }
      if(!curConcept.order) {
        curConcept.order = fullConcept.order;
      }
      if(!curConcept.python) {
        curConcept.python = fullConcept.python;
      }
      if(!fullConcept.ignore) {
        concepts.push(curConcept);
      }
      delete baseConceptsById[fullConcept.id];
    } else if(fullConcept.isBase && baseConceptsById['base']) {
      concepts.push(fullConcept);
    }
  }

  for(var leftConcept in baseConceptsById) {
    if(leftConcept != 'base') {
      concepts.push(baseConceptsById[leftConcept]);
    }
  }

  concepts.sort(function(a,b) {
    return !a.order || !b.order ? 0 : a.order - b.order;
    });

  return concepts;
}

function getConceptsFromBlocks(includeBlocks, allConcepts, context) {
  if(!includeBlocks) { return []; }
  var concepts = ['language'];

  // Blocks explained in another concept
  var blocklyAliases = {
    'controls_repeat_ext': 'controls_repeat'
    };

  if(includeBlocks.standardBlocks) {
    var allConceptsById = {};
    for(var c = 0; c<allConcepts.length; c++) {
      allConceptsById[allConcepts[c].id] = allConcepts[c];
    }
    if(includeBlocks.standardBlocks.includeAll) {
      for(var c = 0; c<allConcepts.length; c++) {
        if(allConcepts[c].id.substr(0, 8) === 'blockly_') {
          concepts.push(allConcepts[c]);
        }
      }
    } else if(includeBlocks.standardBlocks.singleBlocks) {
      for(var b = 0; b<includeBlocks.standardBlocks.singleBlocks.length; b++) {
        var blockName = includeBlocks.standardBlocks.singleBlocks[b];
        var blockAlias = blocklyAliases[blockName];
        blockName = blockAlias ? blockAlias : blockName;
        if(allConceptsById['blockly_'+blockName]) {
          concepts.push(allConceptsById['blockly_'+blockName]);
        }
      }
    }
  }

  if(includeBlocks.generatedBlocks) {
    for(var genName in includeBlocks.generatedBlocks) {
      // this variable is used in order to make sure that we don't include two
      // times a documentation
      var includedConceptIds = [];
      // We remove all concepts which have no "python" attribute
      var filteredConcepts = allConcepts.filter(function(concept) { return concept.python && concept.python != []; });
      for (var functionKey in includeBlocks.generatedBlocks[genName]) {
        var functionName = includeBlocks.generatedBlocks[genName][functionKey];
        var concept = findConceptByFunction(filteredConcepts, functionName);
        if (concept) {
          // if we does not have the concept already pushed, we push it.
          if (includedConceptIds.indexOf(concept.id) == -1) {
            includedConceptIds.push(concept.id);
            concepts.push(concept);
          }
        } else {
          // here you can print the function name for which the documentation is missing
          // for debug:
          // console.log("conceptViewer - function getConceptsFromBlocks : the function named: "
          //    + functionName + " is was not found in the documentation, please consider adding it inside of the "
          //    + "conceptList.python array.");
        }
      }
    }
  }

  return concepts;
}

/**
 * This function allow us to find a concept by his function name.
 * The function name is in the python list of a concept.
 * @param filteredConcepts The list of all the concepts which have the "python" attribute
 * @param functionName The name of the function we have to look for
 * @return A concept if found, false otherwise.
 */
function findConceptByFunction(filteredConcepts, functionName) {
  for (var conceptId in filteredConcepts) {
    for (var conceptFunctionId in filteredConcepts[conceptId].python) {
      if (filteredConcepts[conceptId].python[conceptFunctionId] === functionName) {
        return filteredConcepts[conceptId];
      }
    }
  }

  return false;
}

function getConceptsFromTask(allConcepts) {
  if(typeof taskSettings === 'undefined') { return; }

  var baseConcepts = ['taskplatform'];

  if(taskSettings.conceptViewer.length) {
    baseConcepts = baseConcepts.concat(taskSettings.conceptViewer);
  }
  if(taskSettings.blocklyOpts && taskSettings.blocklyOpts.includeBlocks) {
    baseConcepts = baseConcepts.concat(getConceptsFromBlocks(taskSettings.blocklyOpts.includeBlocks, allConcepts));
  }

  return conceptsFill(baseConcepts, allConcepts);
}
