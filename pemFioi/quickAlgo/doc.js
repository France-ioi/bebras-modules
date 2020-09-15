// Global variable to contain all libraries contexts
var contexts = {};

var docLanguageStrings = {
  fr: {
    lang: 'Français',

    title: 'Documentation des bibliothèques quickAlgo',
    library: 'Bibliothèque :',
    language: 'Langue :',
    blocklyTitle: 'Documentation des blocs génériques Blockly',
    scratchTitle: 'Documentation des blocs génériques Scratch',
    libTitle: 'Documentation de la bibliothèque',

    category: 'Catégorie « {} »',
    subcategory: 'Sous-catégorie « {} »',
    blocklyColumns: ["Apparence", "Nom interne", "Commentaire"],
    columns: ["Nom du bloc", "Nom Python", "Nom interne", "Type", "Arguments", "Description", "Commentaire"],
    nameUndefined: 'non défini !',
    action: 'Action',
    sensor: 'Capteur'
  },
  en: {
    lang: 'English',

    title: 'quickAlgo libraries documentation',
    library: 'Library:',
    language: 'Language:',
    blocklyTitle: 'Documentation for generic Blockly blocks',
    scratchTitle: 'Documentation for generic Scratch blocks',
    libTitle: 'Documentation for library',

    category: 'Category “{}”',
    subcategory: 'Subcategory “{}”',
    blocklyColumns: ["Display", "Internal name", "Comment"],
    columns: ["Block name", "Python name", "Internal name", "Type", "Arguments", "Description", "Comment"],
    nameUndefined: 'undefined!',
    action: 'Action',
    sensor: 'Sensor'
  },
  de: {
    lang: 'Deutsch',

    title: 'quickAlgo libraries documentation',
    library: 'Library:',
    language: 'Language:',
    blocklyTitle: 'Documentation for generic Blockly blocks',
    scratchTitle: 'Documentation for generic Scratch blocks',
    libTitle: 'Documentation for library',

    category: 'Category “{}”',
    subcategory: 'Subcategory “{}”',
    blocklyColumns: ["Display", "Internal name", "Comment"],
    columns: ["Block name", "Python name", "Internal name", "Type", "Arguments", "Description", "Comment"],
    nameUndefined: 'undefined!',
    action: 'Action',
    sensor: 'Sensor'
  },
  es: {
    lang: 'Español',

    title: 'quickAlgo libraries documentation',
    library: 'Library:',
    language: 'Language:',
    blocklyTitle: 'Documentation for generic Blockly blocks',
    scratchTitle: 'Documentation for generic Scratch blocks',
    libTitle: 'Documentation for library',

    category: 'Category “{}”',
    subcategory: 'Subcategory “{}”',
    blocklyColumns: ["Display", "Internal name", "Comment"],
    columns: ["Block name", "Python name", "Internal name", "Type", "Arguments", "Description", "Comment"],
    nameUndefined: 'undefined!',
    action: 'Action',
    sensor: 'Sensor'
  }
};

// Comments for each Blockly/Scratch block
var docBlockly = {
  logic_compare: 'One block. Menu allows to choose the comparison operator.',
  logic_operation: 'One block. Menu allows to choose the operator (AND, OR).',
  logic_boolean: 'One block. Menu allows to choose between TRUE and FALSE.',
  controls_repeat: 'Box allows to input the desired integer.',
  controls_repeat_ext: 'User can put any block returning an integer, such as a variable.',
  controls_whileUntil: 'One block. Menu allows to choose between "while" and "until".',
  controls_flow_statements: 'Allows to break through a loop.',
  math_number: 'Allows to use a number (in a formula).',
  math_arithmetic: 'One block. Allows to computer basic arithmetic operations.',
  math_number_property: 'One block. Allows to check an integer for various properties.',
  math_round: 'One block. Allows to get the round, floor or ceil of an integer.',
  math_extra_single: 'One block. Allows to choose between abs or opposite.',
  math_extra_double: 'One block. Allows to choose between min or max.',
  text: 'Allows to use a string (in a formula).'
};

// Generate the documentation for a specific category
function generateCategory(context, lang, strings, category) {
  var ctxStr = context.localLanguageStrings[lang];
  var globalStr = quickAlgoLanguageStrings[lang] || quickAlgoLanguageStrings['en'];

  var html = '';
  html += '<h3>' + strings.category.replace('{}', category) + '</h3>';
  html += '<table>';

  html += '<tr>';
  for(var i=0; i < strings.columns.length; i++) {
    html += '<th>' + strings.columns[i] + '</th>';
  }
  html += '</tr>';

  // Generate for each subcategory
  var nameUndefined = '<span style="color: red;">' + strings.nameUndefined + '</span>';
  for(var subCategory in context.customBlocks[category]) {
    html += '<tr><td colspan="' + strings.columns.length + '" class="subcategory">' + strings.subcategory.replace('{}', subCategory) +
      (ctxStr.categories && ctxStr.categories[subCategory] ? ' (' + ctxStr.categories[subCategory] + ')' :
         (globalStr.categories && globalStr.categories[subCategory] ? ' (' + globalStr.categories[subCategory] + ')' : '')) + '</td></tr>';
    var blockList = context.customBlocks[category][subCategory];
    for(var i=0; i < blockList.length; i++) {
      var blockInfo = blockList[i];
      html += '<tr>';
      html += '<td>' + (ctxStr.label && ctxStr.label[blockInfo.name] ? ctxStr.label[blockInfo.name] : nameUndefined) + '</td>';
      html += '<td>' + (ctxStr.code && ctxStr.code[blockInfo.name] ? ctxStr.code[blockInfo.name] : nameUndefined) + '</td>';
      html += '<td>' + blockInfo.name + '</td>';
      html += '<td>' + (blockInfo.yieldsValue ? strings.sensor : strings.action) + '</td>';
      html += '<td' + (blockInfo.params ? ' title="' + blockInfo.params + '">' + blockInfo.params.length : '>') + '</td>';
      html += '<td>' + (ctxStr.description && ctxStr.description[blockInfo.name] ? ctxStr.description[blockInfo.name] : '') + '</td>';
      html += '<td>' + (context.localLanguageStrings['none'].comment[blockInfo.name] ? context.localLanguageStrings['none'].comment[blockInfo.name] : '') + '</td>';
      html += '</tr>';
    }
  }

  html += '</table>';
  html += '<hr />';
  return html;
}


// Generate the documentation and display it
function generateDocumentation(context, lang, strings, name) {
  var html = '';
  html += '<h2>' + strings.libTitle + ' ' + name + '</h2>';
  for(var category in context.customBlocks) {
    html += generateCategory(context, lang, strings, category);
  }
  $('#documentation').html(html);
}


// Generate the selectors
function generateLibSelector() {
  var lib = $('#lib').val();
  var html = '';
  for(var name in contexts) {
    html += '<option value="' + name + '"' + (lib == name ? ' selected' : '') + '>' + name + '</option>';
  }
  $('#lib').html(html);
}

function generateLangSelector() {
  var lib = $('#lib').val();
  var curLang = $('#lang').val();
  if(!curLang) {
    curLang = 'fr';
  }
  var context = contexts[lib](false, {}, 'hard');
  var html = '';
  for(var lang in context.localLanguageStrings) {
    if(lang == 'none') { continue; }
    html += '<option value="' + lang + '"' + (lang == curLang ? ' selected' : '') + '>';
    html += docLanguageStrings[lang] ? docLanguageStrings[lang].lang : lang;
    html += '</option>';
  }
  $('#lang').html(html);
}


// Check if image exists before adding the tag
function imageExists(url, id, callback) {
  var img = new Image();
  img.onload = function() { callback(url, id, true); };
  img.src = url;
}


// Generate Blockly documentation
function generateBlocklyDocumentation() {
  var lang = $('#lang').val();
  if(!lang) { lang = 'en'; }
  var strings = docLanguageStrings[lang] ? docLanguageStrings[lang] : docLanguageStrings['en'];
  var globalStr = quickAlgoLanguageStrings[lang] || quickAlgoLanguageStrings['en'];

  var blocklyBlocks = getBlocklyBlockFunctions(0, 1);
  var scratchMode = $('#blocklySelector').val() == 'scratch';
  var stdBlocks = scratchMode ? blocklyBlocks.getStdScratchBlocks() : blocklyBlocks.getStdBlocklyBlocks();

  $('.blockly_title').text(scratchMode ? strings.scratchTitle : strings.blocklyTitle);

  var html = '';
  html += '<table>';

  html += '<tr>';
  for(var i=0; i < strings.blocklyColumns.length; i++) {
    html += '<th>' + strings.blocklyColumns[i] + '</th>';
  }
  html += '</tr>';

  // Generate for each subcategory
  for(var subCategory in stdBlocks) {
    if(stdBlocks[subCategory].length == 0) { continue; }
    html += '<tr><td colspan="' + strings.blocklyColumns.length + '" class="subcategory">' + strings.subcategory.replace('{}', subCategory) +
      (globalStr.categories && globalStr.categories[subCategory] ? ' (' + globalStr.categories[subCategory] + ')' : '') + '</td></tr>';
    var blockList = stdBlocks[subCategory];
    for(var i=0; i < blockList.length; i++) {
      var blockInfo = blockList[i];
      var imgId = lang + '_' + blockInfo.name;
      html += '<tr>';
      html += '<td id="img-' + imgId + '"></td>';
      html += '<td>' + blockInfo.name + '</td>';
      html += '<td>' + (docBlockly[blockInfo.name] ? docBlockly[blockInfo.name] : '') + '</td>';
      html += '</tr>';

      // Add image if exists
      var imgUrl = '../../img/quickAlgo/doc/' + imgId + '.png';
      imageExists(imgUrl, imgId, function (imgUrl, imgId) {
          // Image exists
          $('#img-' + imgId).html('<img class="blockImg" src="' + imgUrl + '" />');
        });
    }
  }

  html += '</table>';
  $('#blocklyDocumentation').html(html);
}


// Update the documentation from which language/library are selected
function updateDocumentation() {
  var lib = $('#lib').val();
  var lang = $('#lang').val();

  if(!lang) { return; }

  // Generate the context for the selected library
  var context = contexts[lib](false, {}, 'hard');
  // Load language strings
  var strings = docLanguageStrings[lang] ? docLanguageStrings[lang] : docLanguageStrings['en'];

  $('.doc_title').text(strings.title);
  $('.lib_select').text(strings.library);
  $('.lang_select').text(strings.language);

  generateBlocklyDocumentation();
  generateDocumentation(context, lang, strings, lib);
}


// Generate the documentation on load
$(function () {
  generateLibSelector();
  generateLangSelector();
  updateDocumentation();
  loadPageArgs();
});


var pageArgs = {};

// Restore arguments to reload previous settings
function loadPageArgs() {
   var argsList = location.search.substr(1).split('&');
   for(var iArg = 0; iArg < argsList.length; iArg++) {
      var arg = argsList[iArg].split('=');
      if (arg.length >= 2 && $('#' + arg[0] + ' option[value="' + arg[1] + '"]').length >= 1) {
         $('#' + arg[0]).val(arg[1]).change();
      }
   }
}

// Write current arguments in the location
function updatePageArg(id, value) {
   pageArgs[id] = value;
   var argsList = [];
   for(var argName in pageArgs) {
      argsList.push(argName + '=' + pageArgs[argName]);
   }
   history.replaceState(null, '', '?' + argsList.join('&') + location.hash);
}
