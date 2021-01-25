var conceptViewer = {
  concepts: {},
  loaded: false,
  shownConcept: null,

  load: function (lang) {
    // Load the conceptViewer into the DOM
    if(this.loaded) { return; }

    // TODO :: allow changing list of languages
    var allLangs = [
      {id: 'blockly', lbl: 'Blockly'},
      {id: 'scratch', lbl: 'Scratch'},
      {id: 'python', lbl: 'Python'}
      ];
    // TODO :: this.selectedLanguage
    var langOptions = '';
    for(var i=0; i<allLangs.length; i++) {
      langOptions += '<option value="' + allLangs[i].id + '"';
      if((!lang && i == 0) || allLangs[i].id == lang) {
        langOptions += ' selected';
      }
      langOptions += '>' + allLangs[i].lbl + '</option>';
    }

    $('body').append(''
      + '<div id="conceptViewer" style="display: none;">'
      + '  <div class="content">'
      + '    <div class="exit" onclick="conceptViewer.hide();">x</div>'
      + '    <div class="navigation">'
      + '      <div class="navigationLanguage">'
      + '        Langage&nbsp;:'
      + '        <select class="languageSelect" onchange="conceptViewer.languageChanged();">'
      + langOptions
      + '        </select>'
      + '      </div>'
      + '      <hr />'
      + '      <div class="navigationContent"></div>'
      + '    </div>'
      + '    <div class="viewer">'
      + '      <iframe class="viewerContent" name="viewerContent"></iframe>'
      + '    </div>'
      + '  </div>'
      + '</div>');

    var that = this;
    $('#conceptViewer').on('click', function (event) {
      if (!$(event.target).closest('#conceptViewer .content').length) {
        that.hide();
      }
    });
    this.loaded = true;
    this.loadNavigation();
  },

  loadNavigation: function () {
    // Display list of concepts
    $('#conceptViewer .navigationContent').html('<ul></ul>');

    var defaultUrl = null;

    for (var i=0; i<this.concepts.length; i++) {
      // TODO :: filter language-specific concepts
      var curConcept = this.concepts[i];
      var curHtml = '<li>'
                  + '  <a onclick="conceptViewer.showConcept(\''+curConcept.id+'\');" data-id="'+curConcept.id+'">'
                  + curConcept.name
                  + '  </a></li>';
      $(curHtml).appendTo('#conceptViewer .navigation ul');
      if(curConcept.isDefault) {
        defaultUrl = curConcept.url;
      }
    }

    // Try first to show again the concept we were viewing
    if(this.shownConcept && this.showConcept(this.shownConcept, false)) {
      return;
    } else if (defaultUrl) {
      // else show the default concept
      this.loadUrl(defaultUrl);
    } else {
      // else show nothing
      this.loadUrl('');
      this.shownConcept = null;
    }
  },

  loadConcepts: function (newConcepts) {
    // Load new concept information
    this.concepts = newConcepts;
    if(this.loaded) {
      this.loadNavigation();
    }
  },

  setLanguage: function(lang) {
    this.selectedLanguage = lang;
  },

  show: function (initConcept) {
    // Display the conceptViewer
    this.load();
    $('#conceptViewer').fadeIn(500);

    if (this.shownConcept && (initConcept || typeof initConcept == 'undefined')) {
      this.showConcept(this.shownConcept);
    }
  },

  hide: function () {
    // Hide the conceptViewer
    this.load();
    $('#conceptViewer').fadeOut(500);
    this.loadUrl('');
  },

  showConcept: function (concept, show) {
    // Show a specific concept
    // Either a concept object can be given, either a concept ID can be given
    // directly
    var conceptUrl = null;
    var conceptId = null;
    if (concept.url) {
      conceptUrl = concept.url;
      conceptId = concept.id;
    } else {
      conceptId = concept.id ? concept.id : concept;
      for (var i=0; i<this.concepts.length; i++) {
        if(this.concepts[i].id == conceptId) {
          conceptUrl = this.concepts[i].url;
        }
      }
    }
    if (conceptUrl) {
      this.shownConcept = conceptId;
      if(show || typeof show == 'undefined') { this.show(false); }

      var language = $('#conceptViewer .languageSelect').val();
      var urlSplit = conceptUrl.split('#');
      if(urlSplit[1]) {
        urlSplit[urlSplit.length-1] = language+'-'+urlSplit[urlSplit.length-1];
      } else {
        urlSplit[1] = language;
      }
      conceptUrl = urlSplit.join('#');

      this.loadUrl(conceptUrl);
      $('#conceptViewer .navigationContent ul a').removeClass('highlight');
      $('#conceptViewer .navigationContent ul a[data-id='+conceptId+']').addClass('highlight');
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
    this.loadNavigation();
  },

  unload: function() {
    $('#conceptViewer').remove();
    this.loaded = false;
  }
}


function getConceptViewerBaseUrl() {
    // Specific configuration to go through the domain itself if there's a 'p=1'
    // argument or we are on concours2.castor-informatique.fr
    var baseUrl = '';
    baseUrl += (window.location.protocol == 'http:' ? 'http:' : 'https:') + '//';
    baseUrl += ((window.location.search.indexOf('p=1') > -1
        || window.location.hostname == 'concours2.castor-informatique.fr')
       ? window.location.host : 'static4.castor-informatique.fr');
    baseUrl += '/help/';
    if(window.stringsLanguage == 'es' || window.stringsLanguage == 'it') {
        baseUrl += 'index_' + window.stringsLanguage + '.html';
    } else {
        baseUrl += 'index.html';
    }
    return baseUrl;
}


function getConceptViewerBaseConcepts() {
    // Get base concepts in the default help
    var baseUrl = getConceptViewerBaseUrl();
    var baseConcepts = [
        {id: 'taskplatform', name: 'Résolution des exercices', url: baseUrl+'#taskplatform', language: 'all', order: 100},
        {id: 'language', name: "Création d'un programme", url: baseUrl+'#language', order: 101},
        {id: 'blockly_text_print', name: 'Afficher du texte', url: baseUrl+'#blockly_text_print', order: 102},
        {id: 'blockly_text_print_noend', name: 'Afficher consécutivement du texte', url: baseUrl+'#blockly_text_print_noend', order: 103},
        {id: 'blockly_text_length', name: 'Longueur d\'une chaîne', url: baseUrl+'#blockly_text_length', order: 104},
        {id: 'blockly_controls_repeat', name: 'Boucles de répétition', url: baseUrl+'#blockly_controls_repeat', order: 105},
        {id: 'blockly_controls_if', name: 'Conditions si', url: baseUrl+'#blockly_controls_if', order: 106},
        {id: 'blockly_controls_if_else', name: 'Conditions si/sinon', url: baseUrl+'#blockly_controls_if_else', order: 107},
        {id: 'blockly_controls_whileUntil', name: 'Boucles tant que ou jusqu\'à', url: baseUrl+'#blockly_controls_whileUntil', order: 108},
        {id: 'blockly_controls_infiniteloop', name: 'Boucle infinie', url: baseUrl+'#blockly_controls_infiniteloop', order: 109},
        {id: 'blockly_logic_operation', name: 'Opérateurs logiques', url: baseUrl+'#blockly_logic_operation', order: 110},
        {id: 'extra_nested_repeat', name: 'Boucles imbriquées', url: baseUrl+'#extra_nested_repeat', order: 111},
        {id: 'extra_variable', name: 'Variables', url: baseUrl+'#extra_variable', order: 112},
        {id: 'extra_list', name: 'Listes', url: baseUrl+'#extra_list', order: 113},
        {id: 'extra_function', name: 'Fonctions', url: baseUrl+'#extra_function', order: 114},
        {id: 'robot_commands', name: 'Commandes du robot', url: baseUrl+'#robot_commands', order: 115},
        {id: 'arguments', name: 'Fonctions avec arguments', url: baseUrl+'#arguments', order: 116}
        ];
    return baseConcepts;
}


function conceptsFill(baseConcepts, allConcepts) {
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
      if(!curConcept.name) {
        curConcept.name = fullConcept.name;
      }
      if(!curConcept.url) {
        curConcept.url = fullConcept.url;
      }
      concepts.push(curConcept);
      delete baseConceptsById[fullConcept.id];
    }
  }

  for(var leftConcept in baseConceptsById) {
    concepts.push(baseConceptsById[leftConcept]);
  }

  return concepts;
}

function getConceptsFromBlocks(includeBlocks, allConcepts, context) {
  if(!includeBlocks) { return []; }

  if(includeBlocks.standardBlocks) {
    var allConceptsById = {};
    for(var c = 0; c<allConcepts.length; c++) {
      allConceptsById[allConcepts[c].id] = allConcepts[c];
    }

    var concepts = ['language'];
    if(includeBlocks.standardBlocks.includeAll) {
      for(var c = 0; c<allConcepts.length; c++) {
        if(allConcepts[c].id.substr(0, 8) === 'blockly_') {
          concepts.push(allConcepts[c]);
        }
      }
    } else if(includeBlocks.standardBlocks.singleBlocks) {
      for(var b = 0; b<includeBlocks.standardBlocks.singleBlocks.length; b++) {
        var blockName = includeBlocks.standardBlocks.singleBlocks[b];
        if(allConceptsById['blockly_'+blockName]) {
          concepts.push(allConceptsById['blockly_'+blockName]);
        }
      }
    }
  }

  if(includeBlocks.generatedBlocks) {
    for(var genName in includeBlocks.generatedBlocks) {
      var categoriesByBlocks = {};
      var includedCategories = [];
      if(context && context.customBlocks && context.customBlocks[genName]) {
        for(var catName in context.customBlocks[genName]) {
          var categoryConceptName = genName + '_' + catName;
          if(!allConceptsById[categoryConceptName]) { continue; }
          var blockList = context.customBlocks[genName][catName];
          for(var i=0; i<blockList.length; i++) {
            categoriesByBlocks[blockList[i].name] = categoryConceptName;
          }
        }
      }
      if(allConceptsById[genName + '_introduction']) {
        concepts.push(allConceptsById[genName + '_introduction']);
      }
      for(var i=0; i<includeBlocks.generatedBlocks[genName].length; i++) {
        var blockName = includeBlocks.generatedBlocks[genName][i];
        if(categoriesByBlocks[blockName] && includedCategories.indexOf(categoriesByBlocks[blockName]) == -1) {
          concepts.push(allConceptsById[categoriesByBlocks[blockName]]);
        }
        var conceptRef = genName + '_' + blockName;
        if(allConceptsById[conceptRef]) {
          concepts.push(allConceptsById[conceptRef]);
        }
      }
    }
  }

  return concepts;
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
