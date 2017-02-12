// Set of functions to create a course

function filterLangProg(lang) {
  lang = lang.toLowerCase() 
  $('[data-lang]').each(function () {
    var elemLangs = $(this).attr('data-lang').split(',');
    for(var i=0; i<elemLangs.length; i++) {
      var elemLang = elemLangs[i].trim().toLowerCase();
      if(elemLang == lang) {
        $(this).show();
        return;
      }
    }
    $(this).hide();
    });
}


task.load = function(views, success, error) {
  platform.getTaskParams(null, null, function (taskParams) {
    if(taskParams.options && taskParams.options.langProg) {
      filterLangProg(taskParams.options.langProg);
    }
    });
  success();
};
