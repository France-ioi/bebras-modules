(function() {

'use strict';

// requires jQuery, and a task object in the global scope.

// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var res = {};
$(document).ready(function() {
   res.task = [{ type: 'html', content: $('#task').html() }];
   res.solution = [{ type: 'html', content: $('#solution').html() }];
});

var taskResourcesLoaded = false;

task.getResources = function(callback)
{
   if (taskResourcesLoaded) {
      return res;
   }
   res.task = ('task' in res) ? res.task : [{ type: 'html', content: $('#task').html() }];
   res.solution = ('solution' in res) ? res.solution : [{ type: 'html', content: $('#solution').html() }];
   res.grader = [];
   res.task_modules = [];
   res.solution_modules = [];
   res.grader_modules = [];
   res.hints = [];
   res.proxy = [];
   res.proxy_modules = [];
   res.display = [];
   res.display_modules = [];
   res.sat = [];
   res.sat_modules = [];
   if (!res.title) {
      res.title = $('title').text();
   }
   
   // Resources
   var curDest = 'task';
   var curType = 'javascript';
   $('script, style, link').each(function() {
      if ($(this).hasClass('remove')) {
         return;
      }
      if ($(this).hasClass('solution') && $(this).hasClass('module')) {
         curDest = res.solution_modules;
      }
      else if ($(this).hasClass('solution')) {
         curDest = res.solution;
      }
      else if ($(this).hasClass('grader') && $(this).hasClass('module')) {
         curDest = res.grader_modules;
      }
      else if ($(this).hasClass('grader')) {
         curDest = res.grader;
      }
      else if ($(this).hasClass('hint')) {
         res.hints.push([{ type: 'html', content: $(this).html() }]);
         return;
      }
      else if ($(this).hasClass('proxy') && $(this).hasClass('module')) {
         curDest = res.proxy_modules;
      }
      else if ($(this).hasClass('proxy')) {
         curDest = res.proxy;
      }
      else if ($(this).hasClass('stdButtonsAndMessages') && $(this).hasClass('module')) {
         curDest = res.display_modules;
      }
      else if ($(this).hasClass('stdButtonsAndMessages')) {
         curDest = res.display;
      }
      else if ($(this).hasClass('stdAnswerTypes') && $(this).hasClass('module')) {
         curDest = res.sat_modules;
      }
      else if ($(this).hasClass('stdAnswerTypes')) {
         curDest = res.sat;
      }
      else if ($(this).hasClass('module')) {
         curDest = res.task_modules;
      }
      else {
         curDest = res.task;
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

   // Images
   var images = [];
   var image = '';
   $('#task img').each(function() {
      var src = $(this).attr('src');
      if (src) {
         image = src.toString();
         if ($.inArray(image, images) === -1) {
            res.task.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   });
   fillImages($('#task').html(), images, res.task);
   $('script').each(function() {
      if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
         return;
      }
      fillImages($(this).html(), images, res.task);
   });
   $('#solution img').each(function() {
      image = $(this).attr('src').toString();
      if ($.inArray(image, images) === -1) {
         res.solution.push({ type: 'image', url: image });
         images.push(image);
      }
   });
   fillImages($('#solution').html(), images, res.solution);
   taskResourcesLoaded = true;
   callback(res);
};

function fillImages(text, images, res) {
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
            res.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   }
}

})();
