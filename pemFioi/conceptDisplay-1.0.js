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
    var langDivs = targetDiv.find('[data-lang='+lang+']');
    if(langDivs.length) {
      targetDiv.find('[data-lang]').hide();
      langDivs.show();
    } else {
      targetDiv.find('[data-lang]').show();
    }
  }
}

$(window).on('hashchange', conceptDisplay);
$(conceptDisplay);
