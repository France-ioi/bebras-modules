(function () {
'use strict';

function getAnimationRes(taskRes) {
   for (var i = 0; i < taskRes.length; i++) {
      var resource = taskRes[i];
      if (resource.type == 'javascript' && resource.id == 'animation') {
         return resource;
      }
   }
   return null;
}

function saveTask(resources, metadata) {
   var task = ModelsManager.createRecord('tm_tasks');
   var animationRes = getAnimationRes(resources.task);
   if (animationRes && animationRes.content) {
      task.sScriptAnimation = animationRes.content;
   }
   task.sAuthor = metadata.authors ? metadata.authors.join(',') : '';
   task.nbHintsTotal = resources.hints ? resources.hints.length : 0;
   task.sTextId = metadata.id;
   task.sSupportedLangProg = metadata.supportedLanguages ? metadata.supportedLanguages.join(',') : '*';
   task.sEvalResultOutputScript = metadata.evalOutputScript ? metadata.evalOutputScript : '';
   task.bUserTests = metadata.hasUserTests;
   ModelsManager.insertRecord("tm_tasks", task);
   return task.ID;
}


function saveStrings(resources, metadata, taskId) {
   var statement = null;
   var solution = null;
   var css = null;
   var i;
   var resource;
   for (i = 0; i < resources.task.length; i++) {
      resource = resources.task[i];
      if (resource.type == 'html') {
         statement = resource.content;
      } else if (resource.type == 'css') {
         css = css + resource.content;
      }
   }
   for (i = 0; i < resources.solution.length; i++) {
      resource = resources.solution[i];
      if (resource.type == 'html') {
         solution = resource.content;
      } else if (resource.type == 'css') {
         css = css + resource.content;
      }
   }
   var strings = ModelsManager.createRecord('tm_tasks_strings');
   strings.sTitle = metadata.title;
   strings.idTask = taskId;
   strings.sLanguage = metadata.language;
   strings.sStatement = statement;
   strings.sSolution = solution;
   strings.sCss = css;
   ModelsManager.insertRecord("tm_tasks_strings", strings);
}

function saveHints(resources, metadata, taskId) {
   if (!resources.hints || !resources.hints.length) {
      return;
   }
   for (var idHint = 0; idHint < resources.hints.length; idHint++) {
      var hintContent = null;
      var hintResources = resources.hints[idHint];
      for (var idRes = 0; idRes < hintResources.length; idRes++) {
         var resource = hintResources[idRes];
         if (resource.type == 'html') {
            hintContent = resource.content;
            break;
         }
      }
      if (hintContent) {
         var hint = ModelsManager.createRecord('tm_hints');
         hint.iRank = idHint;
         hint.idTask = taskId;
         ModelsManager.insertRecord("tm_hints", hint);
         var hintStrings = ModelsManager.createRecord('tm_hints_strings');
         hintStrings.idHint = hint.ID;
         hintStrings.sLanguage = metadata.language;
         hintStrings.sContent = hintContent;
         ModelsManager.insertRecord("tm_hints_strings", hintStrings);
      }
   }
}

function saveAnswer(taskId, answer, sType, iRank) {
   if (!answer.name) {
      console.error('missing name in answer resource');
      return;
   }
   var sourceCode;
   if (answer.answerVersions && answer.answerVersions.length) {
      for (var idVer = 0; idVer < answer.answerVersions.length; idVer++) {
         var answerVersion = answer.answerVersions[idVer];
         sourceCode = ModelsManager.createRecord('tm_source_codes');
         sourceCode.params = answerVersion.params;
         sourceCode.sParams = JSON.stringify(answerVersion.params);
         sourceCode.idTask = taskId;
         sourceCode.sType = sType;
         sourceCode.iRank = idVer;
         sourceCode.bSubmission = false;
         sourceCode.sSource = answerVersion.answerContent;
         sourceCode.sName = answer.name;
         ModelsManager.insertRecord("tm_source_codes", sourceCode);
      }
   } else if (answer.answerContent) {
      sourceCode = ModelsManager.createRecord('tm_source_codes');
      sourceCode.params = answer.params;
      sourceCode.sParams = JSON.stringify(answer.params);
      sourceCode.idTask = taskId;
      sourceCode.sType = sType;
      sourceCode.iRank = iRank;
      sourceCode.bSubmission = false;
      sourceCode.sSource = answer.answerContent;
      sourceCode.sName = answer.name;
      ModelsManager.insertRecord("tm_source_codes", sourceCode);
   }
}

function saveSourceCodes(resources, metadata, taskId) {
   var resource, i;
   for (i = 0; i < resources.task.length; i++) {
      resource = resources.task[i];
      if (resource.type == 'answer') {
         saveAnswer(taskId, resource, 'Task', i);
      }
   }
   for (i = 0; i < resources.solution.length; i++) {
      resource = resources.solution[i];
      if (resource.type == 'answer') {
         saveAnswer(taskId, resource, 'Solution', i);
      }
   }
}

function saveSamples(resources, metadata, taskId) {
   var idRes, resource, taskTest, iRank;
   iRank = 0;
   for (idRes = 0; idRes < resources.task.length; idRes++) {
      resource = resources.task[idRes];
      if (resource.type == 'sample' && resource.name) {
         taskTest = ModelsManager.createRecord('tm_tasks_tests');
         taskTest.idTask = taskId;
         taskTest.iRank = iRank;
         taskTest.sGroupType = 'Example';
         taskTest.sName = resource.name;
         taskTest.sInput = resource.inContent;
         taskTest.sOutput = resource.outContent;
         ModelsManager.insertRecord("tm_tasks_tests", taskTest);
         iRank += 1;
      }
   }
}

function saveLimits(resources, metadata, taskId) {
   for (var lang in metadata.limits) {
      var limitValues = metadata.limits[lang];
      var limit = ModelsManager.createRecord('tm_tasks_limits');
      limit.idTask = taskId;
      limit.sLangProg = lang;
      limit.iMaxTime = limitValues.time;
      limit.iMaxMemory = limitValues.memory;
      ModelsManager.insertRecord("tm_tasks_limits", limit);
   }
}

function insertResourcesInModel(resources, metadata) {
   // we use ModelsManager to get the different source codes, etc. so that the structure
   // is identical to TaskPlatform
   console.error(resources);
   var taskId = saveTask(resources, metadata);
   saveStrings(resources, metadata, taskId);
   saveHints(resources, metadata, taskId);
   saveSourceCodes(resources, metadata, taskId);
   saveSamples(resources, metadata, taskId);
   saveLimits(resources, metadata, taskId);
   return taskId;
}

window.insertResourcesInModel = insertResourcesInModel;

})();
