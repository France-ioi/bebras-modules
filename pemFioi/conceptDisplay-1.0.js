var channel = null;
var setupCodeSnippets = false;

$(function() {
  var targetWindow = window.opener || window.parent;
  if (window.Channel && targetWindow && targetWindow !== window) {
    var windowChannel = window.opener ? window.opener : window.parent;
    channel = Channel.build({window: windowChannel, origin: '*', scope: 'snippet'});

    channel.bind('setupConceptDisplaySnippets', function () {
      setupCodeSnippets = true;
      doSetupCodeSnippets();
    });
  }
});

function conceptDisplay() {
  var hash = window.location.hash.substr(1);
  if(!hash) { return; }

  var hashSplit = hash.split('-');
  if(hashSplit.length > 1) {
    var lang = hashSplit.shift();
    var target = hashSplit.join('-');
  } else {
    var lang = null;
    var target = hash;
  }

  var targetDiv = $('[data-id='+target+']');

  if(!targetDiv.length) { return; }

  $('body > div').hide();
  targetDiv.show();
  if(lang) {
    var allLangDivs = targetDiv.find('[data-lang]');
    var langDivs = allLangDivs.filter(function(i, e) {
      var langs = e.getAttribute('data-lang').split(' ');
      return langs.indexOf(lang) != -1;
    });
    if(langDivs.length) {
      allLangDivs.hide();
      langDivs.show();
    } else {
      allLangDivs.show();
    }
  }

  if (setupCodeSnippets) {
    doSetupCodeSnippets();
  }
}

function doSetupCodeSnippets() {
  var pythonCodes = $('.pythonCode');
  pythonCodes.each(function (index, element) {
    const jQueryElement = $(element);
    if (!jQueryElement.parents('.pythonCode-container').length) {
      const previousCode = $(element).html();
      jQueryElement
        .removeClass('pythonCode')
        .addClass('pythonCode-container')
        .empty()
        .append($("<div class='pythonCode'></div>").html(previousCode))
        .append("<button class='pythonCode-execute'>Utiliser cet exemple</button>")
    }
  })

  $('.pythonCode-execute').click(function () {
    const code = $(this).parent().find('.pythonCode').text();
    const language = $(this).closest('[data-lang]').length && $(this).closest('[data-lang]').attr('data-lang') ?
      $(this).closest('[data-lang]').attr('data-lang') : 'python';

    channel.notify({
      method: 'useCodeExample',
      params: {
        code: code,
        language: language,
      },
    });
  });
}

$(window).on('hashchange', conceptDisplay);
$(conceptDisplay);
