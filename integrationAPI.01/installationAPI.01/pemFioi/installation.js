(function() {

'use strict';

// requires jQuery, and in the global scope:
//   - a task object
//   - a PEMInstallationAPIObject or json object

// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var taskHtmlPreloaded = false;
$(document).ready(function() {
   if (typeof PEMInstallationAPIObject === 'undefined') {
      window.PEMInstallationAPIObject = json;
   }
   PEMInstallationAPIObject.task = [{ type: 'html', content: $('#task').html() }];
   PEMInstallationAPIObject.solution = [{ type: 'html', content: $('#solution').html() }];
   taskHtmlPreloaded = true;
});

task.getTaskResources = function(callback)
{
   PEMInstallationAPIObject.task = ('task' in PEMInstallationAPIObject) ? PEMInstallationAPIObject.task : [];
   PEMInstallationAPIObject.solution = ('solution' in PEMInstallationAPIObject) ? PEMInstallationAPIObject.solution : [];
   PEMInstallationAPIObject.grader = [];
   PEMInstallationAPIObject.task_modules = [];
   PEMInstallationAPIObject.solution_modules = [];
   PEMInstallationAPIObject.grader_modules = [];
   PEMInstallationAPIObject.hints = [];
   PEMInstallationAPIObject.proxy = [];
   PEMInstallationAPIObject.proxy_modules = [];
   PEMInstallationAPIObject.display = [];
   PEMInstallationAPIObject.display_modules = [];
   PEMInstallationAPIObject.sat = [];
   PEMInstallationAPIObject.sat_modules = [];
   PEMInstallationAPIObject.title = $('title').text();
   
   // Resources
   var curDest = 'task';
   var curType = 'javascript';
   $('script, style, link').each(function() {
      if ($(this).hasClass('remove')) {
         return;
      }
      if ($(this).hasClass('solution') && $(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.solution_modules;
      }
      else if ($(this).hasClass('solution')) {
         curDest = PEMInstallationAPIObject.solution;
      }
      else if ($(this).hasClass('grader') && $(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.grader_modules;
      }
      else if ($(this).hasClass('grader')) {
         curDest = PEMInstallationAPIObject.grader;
      }
      else if ($(this).hasClass('hints')) {
         PEMInstallationAPIObject.hints.push([{ type: 'html', content: $(this).html() }]);
         return;
      }
      else if ($(this).hasClass('proxy') && $(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.proxy_modules;
      }
      else if ($(this).hasClass('proxy')) {
         curDest = PEMInstallationAPIObject.proxy;
      }
      else if ($(this).hasClass('stdButtonsAndMessages') && $(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.display_modules;
      }
      else if ($(this).hasClass('stdButtonsAndMessages')) {
         curDest = PEMInstallationAPIObject.display;
      }
      else if ($(this).hasClass('stdAnswerTypes') && $(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.sat_modules;
      }
      else if ($(this).hasClass('stdAnswerTypes')) {
         curDest = PEMInstallationAPIObject.sat;
      }
      else if ($(this).hasClass('module')) {
         curDest = PEMInstallationAPIObject.task_modules;
      }
      else {
         curDest = PEMInstallationAPIObject.task;
      }
      
      if ($(this).is('script')) {
         curType = 'javascript';
      }
      else if ($(this).is('style') || $(this).is('link')) {
         curType = 'css';
      }
      
      if ($(this).attr('src')) {
         curDest.push({ type: curType, url: $(this).attr('src'), id: $(this).attr('id') });
      }
      else if ($(this).attr('href')) {
         curDest.push({ type: curType, url: $(this).attr('href'), id: $(this).attr('id') });
      }
      else {
         curDest.push({ type: curType, content: $(this).html() });
      }
   });
   
   // Contents
   if ( ! taskHtmlPreloaded) {
      PEMInstallationAPIObject.task.push({ type: 'html', content: $('#task').html() });
      PEMInstallationAPIObject.solution.push({ type: 'html', content: $('#solution').html() });
   }
   
   // Images
   var images = [];
   var image = '';
   $('#task img').each(function() {
      var src = $(this).attr('src');
      if (src) {
         image = src.toString();
         if ($.inArray(image, images) === -1) {
            PEMInstallationAPIObject.task.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   });
   fillImages($('#task').html(), images, PEMInstallationAPIObject.task);
   $('script').each(function() {
      if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
         return;
      }
      fillImages($(this).html(), images, PEMInstallationAPIObject.task);
   });
   $('#solution img').each(function() {
      image = $(this).attr('src').toString();
      if ($.inArray(image, images) === -1) {
         PEMInstallationAPIObject.solution.push({ type: 'image', url: image });
         images.push(image);
      }
   });
   fillImages($('#solution').html(), images, PEMInstallationAPIObject.solution);
   if (typeof callback != 'undefined') {
      callback(PEMInstallationAPIObject);
   }
   else {
      return PEMInstallationAPIObject;
   }
};

function fillImages(text, images, PEMInstallationAPIObject) {
   var extensions = ["png", "jpg", "gif"];
   for (var iExt = 0; iExt < extensions.length; iExt++) {
      var ext = extensions[iExt];
      var regexp = new RegExp("[\'\"]([^\"\']*." + ext + ")[\'\"]", "g");
      while (true) {
         var match = regexp.exec(text);
         if (!match) {
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

})();
