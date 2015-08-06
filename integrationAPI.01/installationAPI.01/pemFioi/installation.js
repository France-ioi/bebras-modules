// this should be called before the task loads, because the task can modify
// its html at load, and we want to return unmodified html in getTaskResources.
var taskHtmlPreloaded = false;
$(document).ready(function() {
   json['task'] = [{ type: 'html', content: $('#task').html() }];
   json['solution'] = [{ type: 'html', content: $('#solution').html() }];
   taskHtmlPreloaded = true;
});

// function to be provided by task, here in the global scope
function getTaskResources(callback)
{
   json['task'] = ('task' in json) ? json['task'] : new Array();
   json['solution'] = ('solution' in json) ? json['solution'] : new Array();
   json['grader'] = new Array();
   json['task_modules'] = new Array();
   json['solution_modules'] = new Array();
   json['grader_modules'] = new Array();
   json['proxy'] = new Array();
   json['proxy_modules'] = new Array();
   json['display'] = new Array();
   json['display_modules'] = new Array();
   json['sat'] = new Array();
   json['sat_modules'] = new Array();
   json['title'] = $('title').text();
   
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
            json[curDest].push({ type: curType, url: $(this).attr('src'), id: $(this).attr('id') });
         }
         else if ($(this).attr('href')) {
            json[curDest].push({ type: curType, url: $(this).attr('href'), id: $(this).attr('id') });
         }
         else {
            json[curDest].push({ type: curType, content: $(this).html() });
         }
      }
   });
   
   // Contents
   if ( ! taskHtmlPreloaded) {
      json['task'].push({ type: 'html', content: $('#task').html() });
      json['solution'].push({ type: 'html', content: $('#solution').html() });
   }
   
   // Images
   var images = new Array();
   var image = '';
   $('#task img').each(function(index, element) {
      var src = $(this).attr('src');
      if (src != undefined) {
         image = src.toString();
         if ($.inArray(image, images) === -1) {
            json['task'].push({ type: 'image', url: image });
            images.push(image);
         }
      }
   });
   fillImages($('#task').html(), images, json['task']);
   $('script').each(function(index, element) {
      if ($(this).hasClass('remove') || $(this).attr('src') || $(this).attr('href')) {
         return;
      }
      fillImages($(this).html(), images, json['task']);
   });
   $('#solution img').each(function(index, element) {
      image = $(this).attr('src').toString();
      if ($.inArray(image, images) === -1) {
         json['solution'].push({ type: 'image', url: image });
         images.push(image);
      }
   });
   fillImages($('#solution').html(), images, json['solution']);
   if (typeof callback != 'undefined') {
      callback(json);
   }
   else {
      return json;
   }
}

function fillImages(text, images, json) {
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
            json.push({ type: 'image', url: image });
            images.push(image);
         }
      }
   }
}
