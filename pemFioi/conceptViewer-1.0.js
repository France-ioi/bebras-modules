var conceptViewer = {
  concepts: {},
  loaded: false,
  shownConcept: null,

  load: function () {
    // Load the conceptViewer into the DOM
    if(this.loaded) { return; }
    $('body').append(''
      + '<div id="conceptViewer" style="display: none;">'
      + '  <div class="content">'
      + '    <div class="exit" onclick="conceptViewer.hide();">x</div>'
      + '    <div class="navigation">'
      + '      <div class="navigationLanguage">'
      + '        Langage de programmation&nbsp;:'
      + '        <select class="languageSelect" onchange="conceptViewer.languageChanged();">'
      + '          <option value="blockly">Blockly</option>' // TODO :: allow changing list of languages
      + '          <option value="python">Python</option>'
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
      $('#conceptViewer .viewerContent').attr('src', defaultUrl);
    } else {
      // else show nothing
      $('#conceptViewer .viewerContent').attr('src', '');
      this.shownConcept = null;
    }
  },

  loadConcepts: function (newConcepts) {
    // Load new concept information
    if(!this.loaded) { this.load(); }
    this.concepts = newConcepts;
    this.loadNavigation();
  },

  show: function (initConcept=true) {
    // Display the conceptViewer
    if(!this.loaded) { this.load(); }
    $('#conceptViewer').fadeIn(500);

    if (this.shownConcept && initConcept) {
      this.showConcept(this.shownConcept);
    }
  },

  hide: function () {
    // Hide the conceptViewer
    if(!this.loaded) { this.load(); }
    $('#conceptViewer').fadeOut(500);
    $('#conceptViewer .viewerContent').attr('src', '');
  },

  showConcept: function (concept, show=true) {
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
      if(show) { this.show(false); }

      var language = $('#conceptViewer .languageSelect').val();
      var urlSplit = conceptUrl.split('#');
      if(urlSplit[1]) {
        urlSplit[urlSplit.length-1] = language+'-'+urlSplit[urlSplit.length-1];
      } else {
        urlSplit[1] = language;
      }
      conceptUrl = urlSplit.join('#');

      $('#conceptViewer .viewerContent').attr('src', conceptUrl);
      $('#conceptViewer .navigationContent ul a').removeClass('highlight');
      $('#conceptViewer .navigationContent ul a[data-id='+conceptId+']').addClass('highlight');
      return true;
    } else {
      return false;
    }
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

  languageChanged: function () {
    this.loadNavigation();
  }
}

// TODO :: temporary values for now
var baseUrl = 'https://static-items.algorea.org/files/checkouts/c1212c2f48bf3944a7a9ad2c48a33206/ProgrammingYoung/Help/index.html';

var testConcepts = [
    {id: 'taskplatform', name: 'Résolution des exercices', url: baseUrl+'#taskplatform', language: 'all'},
    {id: 'language', name: "Création d'un programme", url: baseUrl+'#language'},
    {id: 'blockly_print', name: 'Afficher du texte', url: baseUrl+'#blockly_print'},
    {id: 'blockly_print_no_end', name: 'Afficher consécutivement du texte', url: baseUrl+'#blockly_print_no_end'},
    {id: 'blockly_controls_repeat', name: 'Boucles de répétition', url: baseUrl+'#blockly_control_repeat'},
    {id: 'robot_commands', name: 'Commandes du robot', url: baseUrl+'#robot_commands'},
    {id: 'arguments', name: 'Fonctions avec arguments', url: baseUrl+'#arguments'}
    ];


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

function getConceptsFromBlocks(includeBlocks, allConcepts) {
  if(!includeBlocks.standardBlocks) { return []; }

  var allConceptsById = {};
  for(var c = 0; c<allConcepts.length; c++) {
    allConceptsById[allConcepts[c].id] = allConcepts[c];
  }

  var concepts = ['language'];
  if(includeBlocks.standardBlocks.includeAll) {
    for(var c = 0; c<allConcepts.length; c++) {
      if(allConcepts[c].name.substr(0, 7) == 'blockly_') {
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
