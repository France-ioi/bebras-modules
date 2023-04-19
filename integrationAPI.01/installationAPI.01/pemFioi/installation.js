(function() {

'use strict';

// requires jQuery, and a task object in the global scope.

// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var res = {};

var taskResourcesLoaded = false;

function getTextContent(node) {
   if(!node) { return ''; }
   var text = '';
   node.childNodes.forEach(function (child) {
      if (child.nodeType == 3) {
         text += child.textContent ? ' ' + child.textContent.trim() : '';
      } else if (child.nodeType == 1) {
         var childText = getTextContent(child);
         text += childText ? ' ' + childText : '';
      }
   });
   return text.trim();
}

window.implementGetResources = function(task) {
   task.getResources = function(callback)
   {
      if (taskResourcesLoaded) {
         callback(res);
         return;
      }
      res.task = ('task' in res) ? res.task : [{ type: 'html', content: $('#task').html() }];
      res.solution = ('solution' in res) ? res.solution : [{ type: 'html', content: $('#solution').html() }];
      res.grader = [];
      res.task_modules = [];
      res.solution_modules = [];
      res.grader_modules = [];
      if (!res.hints) {
         res.hints = [];
         $('.hint').each(function(index) {
            res.hints[res.hints.length] = [{type: 'html', content: $(this).html() }];
            $(this).attr('hint-Num', res.hints.length-1);
         });
      }
      res.proxy = [];
      res.proxy_modules = [];
      res.display = [];
      res.display_modules = [];
      res.sat = [];
      res.sat_modules = [];
      res.files = [];
      if (!res.title) {
         res.title = $('title').text() || $('h1').text();
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
            curDest.push({ type: curType, id: $(this).attr('id'), content: $(this).html() });
         }
      });

      // Images
      var images = [];
      function addImageTo(imageList) {
         return function () {
            var src = $(this).attr('src');
            var classes = $(this).attr('class');
            classes = classes ? classes.split(/\s+/) : null;
            if (src) {
               var imageSrc = src.toString();
               if ($.inArray(imageSrc, images) === -1) {
                  var imgData = { type: 'image', url: imageSrc };
                  if (classes && classes.length > 0) {
                     imgData.classes = classes;
                  }
                  imageList.push(imgData);
                  images.push(imageSrc);
               }
            }
         }
      }
      $('#task img').each(addImageTo(res.task));
      fillImages($('#task').html(), images, res.task);
      $('script').each(function() {
         if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
            return;
         }
         fillImages($(this).html(), images, res.task);
      });
      $('#solution img').each(addImageTo(res.solution));
      fillImages($('#solution').html(), images, res.solution);
      $('.hint').each(function() {
         var hintnum = $(this).attr('hint-num');
         $('[hint-num=' + hintnum + '] img').each(addImageTo(res.hints[hintnum]));
         fillImages($(this).html(), images, res.hints[hintnum]);
      });

      // Links
      $('iframe').each(function () {
        var curUrl = $(this).attr('src');
        if(curUrl.indexOf('://') == -1 && curUrl.charAt(0) != '/') {
          res.files.push({ type: this.tagName, url: $(this).attr('src') });
        }
      });

      // Other resources
      $('source, track').each(function() {
        res.files.push({ type: this.tagName, url: $(this).attr('src') });
      });
      $('fioi-video-player').each(function() {
        var fileAttributes = ["data-source", "data-image", "data-subtitles"];
        for(var i=0; i<fileAttributes.length; i++) {
           var curAttr = $(this).attr(fileAttributes[i]);
           curAttr = curAttr ? curAttr.split(';') : [];
           for(var a=0; a<curAttr.length; a++) {
              var curAttrFile = curAttr[a];
              if(curAttrFile && curAttrFile != 'animation' && curAttrFile != 'none') {
                 res.files.push({ type: fileAttributes[i], url: curAttrFile });
              }
           }
        }
      });

      // Text for referencing
      var content = {};
      content.title = res.title;
      content.summary = '';
      content.level2 = [];
      content.level3 = [];
      $('h2').each(function () {
         content.level2.push($(this).text().trim());
      });
      $('h3').each(function () {
         content.level3.push($(this).text().trim());
      });
      content.text = getTextContent($('#task')[0]) || getTextContent($('body')[0]);
      content.lang = 'default';
      res.content = [content];

      taskResourcesLoaded = true;

      if(window.taskGetResourcesPost) {
        window.taskGetResourcesPost(res, callback);
      } else {
        callback(res);
      }
   };
}

function declareResource(type, resource) {
   if (!res[type]) {
      res[type] = [];
   }
   res[type].push(resource);
}

window.declareTaskResource = declareResource;

var resourcesObjectForRegistration = {};

$(document).ready(function() {
   if (typeof json !== 'undefined') {
      res = json;
   }

   if(window.preprocessingFunctions) {
      for(var i=0; i<window.preprocessingFunctions.length; i++) {
         window.preprocessingFunctions[i]();
      }
   }
   window.preprocessingFunctions = [];

   res.hints = [];
   $('.hint').each(function(index) {
      res.hints[res.hints.length] = [{type: 'html', content: $(this).html() }];
      $(this).attr('hint-num', res.hints.length-1);
   });
   res.task = [{ type: 'html', content: $('#task').html() }];
   res.solution = [{ type: 'html', content: $('#solution').html() }];
   if (window.task) {
      window.implementGetResources(window.task);
      // alias for old code, TODO: remove
      window.getTaskResources = task.getResources;
   }
});


function fillImages(text, images, res) {
   var extensions = ["png", "jpg", "gif", "ttf", "woff", "eot", "mp4", "zip", "mp3"];
   for (var iExt = 0; iExt < extensions.length; iExt++) {
      var ext = extensions[iExt];
      var regexp = new RegExp("[\'\"]([^;\"\']*." + ext + ")[\'\"]", "g");
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
