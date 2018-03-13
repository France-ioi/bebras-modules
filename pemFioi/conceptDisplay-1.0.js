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

  var targetDiv = $('div[data-id='+target+']');

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
}

$(window).on('hashchange', conceptDisplay);
$(conceptDisplay);
