// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var taskHtmlPreloaded = false;
$(document).ready(function() {
   PEMInstallationAPIObject['task'] = [{ type: 'html', content: $('#task').html() }];
   PEMInstallationAPIObject['solution'] = [{ type: 'html', content: $('#solution').html() }];
   taskHtmlPreloaded = true;
});

// function to be provided by task, here in the global scope
function getTaskResources(callback)
{
   PEMInstallationAPIObject['task'] = ('task' in PEMInstallationAPIObject) ? PEMInstallationAPIObject['task'] : new Array();
   PEMInstallationAPIObject['solution'] = ('solution' in PEMInstallationAPIObject) ? PEMInstallationAPIObject['solution'] : new Array();
   PEMInstallationAPIObject['grader'] = new Array();
   PEMInstallationAPIObject['task_modules'] = new Array();
   PEMInstallationAPIObject['solution_modules'] = new Array();
   PEMInstallationAPIObject['grader_modules'] = new Array();
   PEMInstallationAPIObject['proxy'] = new Array();
   PEMInstallationAPIObject['proxy_modules'] = new Array();
   PEMInstallationAPIObject['display'] = new Array();
   PEMInstallationAPIObject['display_modules'] = new Array();
   PEMInstallationAPIObject['sat'] = new Array();
   PEMInstallationAPIObject['sat_modules'] = new Array();
   PEMInstallationAPIObject['title'] = $('title').text();
   
   // Resources
   var curDest = 'task';
   var curType = 'javascript';
   $('script, style, link').each(function(index, element) {
      if (!$(this).hasClass('remove')) {
         if ($(this).hasClass('solution') && $(this).hasClass('module')) {
            curDest = 'solution_modules';
         }
         else if ($(this).hasClass('solution')) {
            curDest = 'solution';
         }
         else if ($(this).hasClass('grader') && $(this).hasClass('module')) {
            curDest = 'grader_modules';
         }
         else if ($(this).hasClass('grader')) {
            curDest = 'grader';
         }
         else if ($(this).hasClass('proxy') && $(this).hasClass('module')) {
            curDest = 'proxy_modules';
         }
         else if ($(this).hasClass('proxy')) {
            curDest = 'proxy';
         }
         else if ($(this).hasClass('stdButtonsAndMessages') && $(this).hasClass('module')) {
            curDest = 'display_modules';
         }
         else if ($(this).hasClass('stdButtonsAndMessages')) {
            curDest = 'display';
         }
         else if ($(this).hasClass('stdAnswerTypes') && $(this).hasClass('module')) {
            curDest = 'sat_modules';
         }
         else if ($(this).hasClass('stdAnswerTypes')) {
            curDest = 'sat';
         }
         else if ($(this).hasClass('module')) {
            curDest = 'task_modules';
         }
         else {
            curDest = 'task';
         }
         
         if ($(this).is('script')) {
            curType = 'javascript';
         }
         else if ($(this).is('style') || $(this).is('link')) {
            curType = 'css';
         }
         
         if ($(this).attr('src')) {
            PEMInstallationAPIObject[curDest].push({ type: curType, url: $(this).attr('src'), id: $(this).attr('id') });
         }
         else if ($(this).attr('href')) {
            PEMInstallationAPIObject[curDest].push({ type: curType, url: $(this).attr('href'), id: $(this).attr('id') });
         }
         else {
            PEMInstallationAPIObject[curDest].push({ type: curType, content: $(this).html() });
         }
      }
   });
   
   // Contents
   if ( ! taskHtmlPreloaded) {
      PEMInstallationAPIObject['task'].push({ type: 'html', content: $('#task').html() });
      PEMInstallationAPIObject['solution'].push({ type: 'html', content: $('#solution').html() });
   }
   
   // Images
   var images = new Array();
   var image = '';
   $('#task img').each(function(index, element) {
      var src = $(this).attr('src');
      if (src != undefined) {
         image = src.toString();
         if ($.inArray(image, images) === -1) {
            PEMInstallationAPIObject['task'].push({ type: 'image', url: image });
            images.push(image);
         }
      }
   });
   fillImages($('#task').html(), images, PEMInstallationAPIObject['task']);
   $('script').each(function(index, element) {
      if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
         return;
      }
      fillImages($(this).html(), images, PEMInstallationAPIObject['task']);
   });
   $('#solution img').each(function(index, element) {
      image = $(this).attr('src').toString();
      if ($.inArray(image, images) === -1) {
         PEMInstallationAPIObject['solution'].push({ type: 'image', url: image });
         images.push(image);
      }
   });
   fillImages($('#solution').html(), images, PEMInstallationAPIObject['solution']);
   if (typeof callback != 'undefined') {
      callback(PEMInstallationAPIObject);
   }
   else {
      return PEMInstallationAPIObject;
   }
}

function fillImages(text, images, PEMInstallationAPIObject) {
   var extensions = ["png", "jpg", "gif"];
   for (var iExt = 0; iExt < extensions.length; iExt++) {
      var ext = extensions[iExt];
      var regexp = new RegExp("[\'\"]([^\"\']*." + ext + ")[\'\"]", "g");
      while (true) {
         var match = regexp.exec(text);
         if (match == null) {
            break;
         }
         var image = match[1];
         if (image.length <= ext.length + 1) {
            continue;
         }
         if ($.inArray(image, images) === -1) {
            PEMInstallationAPIObject.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   }
}
