(function () {
'use strict';

/*
 * This file contains the necessary functions to:
 *   - fetch the different resources in the task directories and put them in
 *        the PEM installation API object
 *   - display the task from the PEM installation API object filled with the
 *        different resources
 *
 * It uses SyntaxHighlighter to highlight code, and jQuery-ui-tabs to display
 * sources in tabs with different languages.
 *
 * The structure it can work on is the one as given in the same task, it is
 * meant to be both a complete example and the documentation.
 */

var extensionToLanguage = {
   adb:  'ada',
   cpp:  'cpp',
   c:    'c',
   pas:  'pascal',
   ml:   'ocaml',
   java: 'java',
   jvs:  'javascool',
   py:   'python'
};

// fills all the resources from FIOITaskMetaData into PEMInstallationAPIObject
// calls callback when done
// urlMode is true if we just want the url, not the content
function fillResources(FIOITaskMetaData, PEMInstallationAPIObject, callback, urlMode) {
   if (task.resourcesFilled) {
      callback();
   }
   var waiting = 1; // number of ajax fetches waiting
   // the result is an object containing the arrays to concat to
   // keep track of group -> resource mapping, to add the answerVersions
   var groupsResources = {
      task: {},
      solution: {}
   };
   //
   // ajax callback factories
   //
   // type is 'task' or 'solution'
   function sourceDone(groupName, sourceFile, type) {
      return function (answer) {
         var groupResource = groupsResources[type][groupName];
         if (!groupResource) {
            groupResource = {
               type: 'answer',
               name: groupName,
               answerVersions: []
            };
            groupsResources[type][groupName] = groupResource;
            PEMInstallationAPIObject[type].push(groupResource);
         }
         groupResource.answerVersions.push({
            params: {
               sLangProg: extensionToLanguage[sourceFile.substr(sourceFile.lastIndexOf('.') + 1)]
            },
            answerContent: answer
         });
      };
   }
   // keep track of test name -> resource mapping
   var samplesResources = {
      task: {},
      solution: {},
      grader: {}
   };
   // type is 'task' or 'solution'
   // direction is 'in' or 'out'
   function sampleDone(sampleName, type, direction) {
      return function (sample) {
         var sampleResource = samplesResources[type][sampleName];
         if (!sampleResource) {
            sampleResource = {
               type: 'sample',
               name: sampleName
            };
            samplesResources[type][sampleName] = sampleResource;
         }
         if (direction == 'in') {
            sampleResource.inContent = sample;
         } else {
            sampleResource.outContent = sample;
         }
      };
   }

   function fetchFail(filename) {
      return function () {
         console.error("Unable to load '" + filename + "'");
      };
   }

   function copySampleResources() {
      for (var type in samplesResources) {
         var samples = samplesResources[type];
         for (var sampleName in samples) {
            PEMInstallationAPIObject[type].push(samples[sampleName]);
         }
      }
   }

   function fetchAlways() {
      waiting = waiting - 1;
      if (!waiting) {
         copySampleResources();
         callback();
      }
   }
   //
   // actual filling
   //
   // type is 'task' or 'grader'
   function fillSamples(samples, type) {
      if (!samples) return;
      for (var i = 0; i < samples.length; i++) {
         if (!urlMode) {
            waiting += 2;
            $.get("tests/files/" + samples[i] + ".in")
               .done(sampleDone(samples[i], type, 'in'))
               .fail(fetchFail("test/" + samples[i] + ".in"))
               .always(fetchAlways);
            $.get("tests/files/" + samples[i] + ".out")
               .done(sampleDone(samples[i], type, 'out'))
               .fail(fetchFail("test/" + samples[i] + ".out"))
               .always(fetchAlways);
         } else {
            PEMInstallationAPIObject[type].push({
               type: 'sample',
               name: samples[i],
               inUrl: "test/files/" + samples[i] + ".in",
               outUrl: "test/files/" + samples[i] + ".out"
            });
         }
      }
   }

   // from https://gist.github.com/HaNdTriX/7704632
   function ImgSrcToDataUrl(src, success, fail) {
     var img = new Image();
     img.crossOrigin = 'Anonymous';
     var callbackCalled = false;
     img.onload = function() {
       var canvas = document.createElement('CANVAS');
       var ctx = canvas.getContext('2d');
       var dataURL;
       canvas.height = this.height;
       canvas.width = this.width;
       ctx.drawImage(this, 0, 0);
       dataURL = canvas.toDataURL();
       success(dataURL);
       callbackCalled = true;
       canvas = null;
     };
     img.src = src;
     if (img.complete || img.complete === undefined) {
       img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
       img.src = src;
     }
     setTimeout(function() {
      if (!callbackCalled) {
         fail();
      }
     }, 1000);
   }

   function imageDone(resource) {
      return function(content) {
         resource.content = content;
         fetchAlways();
      };
   }

   function imageFailed(resource) {
      return function(content) {
         fetchFail(resource.url);
         fetchAlways();
      };
   }

   function fillImages(resources) {
      for (var i = 0; i < resources.length; i++) {
         var resource = resources[i];
         if (resource.type == 'image') {
            waiting += 1;
            ImgSrcToDataUrl(resource.url, imageDone(resource), imageFailed(resource));
         }
      }
   }

   function fillAnimation() {
      for (var i = 0; i < PEMInstallationAPIObject.task.length; i++) {
         var resource = PEMInstallationAPIObject.task[i];
         if (resource.type == 'javascript' && resource.id == 'animation' && typeof resource.url !== 'undefined') {
            waiting += 1;
            $.get(resource.url)
               .done(function(scriptContent) {
                  resource.content = scriptContent;
               })
               .fail(fetchFail(resource.url))
               .always(fetchAlways);
            break; // important, otherwise "resource" variable gets messy
         }
      }
   }

   // type is 'task', 'solution' or 'hint', subtype is null for task and solution, and the hint number for hints
   function fillSources(sources, type, subtype) {
      if (!sources) return;
      if (!PEMInstallationAPIObject[type][subtype]) {
         PEMInstallationAPIObject[type][subtype] = [];
      }
      for (var groupName in sources) {
         var resource = {
            type: 'source',
            name: groupName,
            answerVersions: []
         };
         for (var iSource = 0; iSource < sources[groupName].length; iSource++) {
            var fileName = sources[groupName][iSource];
            if (!urlMode) {
               waiting++;
               var recTry = function(filelist, groupName, fileName, type, subtype) {
                  if(!filelist.length) {
                     fetchFail("sources:" + groupName + "-" + fileName)();
                     fetchAlways();
                     return;
                  }
                  $.get(filelist.shift())
                     .done(function(answer) {
                           sourceDone(groupName, fileName, type, subtype)(answer);
                           fetchAlways();
                        })
                     .fail(function() {
                           recTry(filelist, groupName, fileName, type, subtype);
                        });
               };
               var filelist = [
                  "sources/" + groupName + "-" + fileName,
                  "sources/" + fileName,
                  groupName + "-" + fileName,
                  fileName
                  ];
               recTry(filelist, groupName, fileName, type, subtype);
            } else {
               resource.answerVersions.push({
                  params: {
                     sLangProg: extensionToLanguage[fileName.substr(fileName.lastIndexOf('.') + 1)]
                  },
                  answerUrl: "sources/" + groupName + "-" +
                     fileName
               });
            }
         }
         if (urlMode) {
            if (subtype) {
               PEMInstallationAPIObject[type][subtype].push(resource);
            } else {
               PEMInstallationAPIObject[type].push(resource);
            }
         }
      }
   }
   fillSamples(FIOITaskMetaData.taskSamples, 'task');
   fillSources(FIOITaskMetaData.taskSources, 'task');
//   fillImages(PEMInstallationAPIObject.task);
   fillSources(FIOITaskMetaData.solutionSources, 'solution');
   fillImages(PEMInstallationAPIObject.solution);
   for (var hintNum in FIOITaskMetaData.hintsSources) {
      fillSources(FIOITaskMetaData.hintsSources[hintNum], 'hint', hintNum);
      fillImages(PEMInstallationAPIObject.hint[hintNum]);
   }
   fillAnimation();
   fetchAlways();
}

function translate(s, lang)
{
  var translations = {
    subject :     { fr : "sujet", en : "subject" },
    statement :   { fr : "sujet", en : "subject" },
    solve :       { fr : "résoudre", en : "solve" },
    solution :    { fr : "correction", en : "solution" },
    time :        { fr : "temps", en : "time" },
    memory :      { fr : "mémoire", en : "memory" },
    input :       { fr : "entrée", en : "input" },
    output :      { fr : "sortie", en : "output" },
    limits :      { fr : "limites de temps et de mémoire", en : "time and memory limits" },
    constraints : { fr : "contraintes", en : "constraints" },
    examples :    { fr : "exemples", en : "examples" },
    comments :    { fr : "commentaires", en : "comments" }
  };
  if (!translations[s] || !translations[s][lang])
  {
    console.error("Unable to translate '" + s + "' in " + lang);
    return s;
  }
  return translations[s][lang];
}

function translateTitles() {
   $.each(['statement', 'constraints', 'input', 'output', 'comments'], function(id) {
      $('#'+id).text(function() {
         return translate(id).toUpperCase();
      });
   });
}

// TODO {LANGUAGE} -> current language

// lookup in the resource array, to find a resource of type "source" with corresponding name
function getSourceInResources(subResources, type, name) {
   var res;
   $.each(subResources, function(i, resource) {
      if (resource.type == type && resource.name == name) {
         res = resource;
         return;
      }
   });
   return res;
}

// get the resource corresponding to a jQuery element, from the resources object
function getSourceResourceFromElement(resources, element) {
   var type;
   if (element.closest('#task').length) {
      type = 'task';
   } else if (element.closest('#solution').length) {
      type = 'solution';
   }
   // TODO handle hints
   if (!type) {
      console.error('unable to find type of source!');
      console.error(element);
      return;
   }
   var name = element.attr('data-source-name');
   if (!name) {
      console.error('unable to find source name');
      console.error(element);
      return;
   }
   return getSourceInResources(resources[type], 'answer', name);
}

function getAnswerVersionInLanguage(answerVersions, currentLang) {
   var res;
   $.each(answerVersions, function(i, answerVersion) {
      if (answerVersion.params.sLangProg == currentLang) {
         res = answerVersion;
         return;
      }
   });
   return res;
}

function escapeCode(sourceCode) {
   return sourceCode.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}

function includeSingleSources(resources, currentLang, urlMode) {
   $('.source').each(function() {
      var resource = getSourceResourceFromElement(resources, $(this));
      if (!resource) {
         console.error('unable to find the resource');
         return;
      }
      var answerVersion = getAnswerVersionInLanguage(resource.answerVersions, currentLang);
      if (!answerVersion) {
         console.error('unable to find the answer version in '+currentLang);
         return;
      }
      if (urlMode) {
         $(this).html('<iframe src="'+answerVersion.answerUrl+'" width="600" height="400"></iframe>"');
      } else {
         $(this).html('<pre class="code lang-'+currentLang+'" data-code="'+escapeCode(answerVersion.answerContent)+'\n"></pre>');
      }
   });
}

var langToPrint = {
   'ada': 'ADA',
   'cpp': 'C++',
   'c':   'C',
   'python': 'Python',
   'pascal': 'Pascal',
   'java' :  'Java',
   'javascool': 'JavaScool',
   'ocaml': 'OCaml',
   'pseudo': 'Pseudo-code'
};

function includeSourceTabs(resources, currentLang, urlMode) {
   $('.all-sources').each(function() {
      var resource = getSourceResourceFromElement(resources, $(this));
      if (!resource) {
         console.error('unable to find the resource');
         return;
      }
      var name = resource.name; // TODO: add type to prevent clash between
      // resources with the same name in different parts
      // building the tabs, etc. by hand
      var ul = $("<ul></ul>");
      $(this).prepend(ul);
      var $self = $(this);
      $.each(resource.answerVersions, function(index, answerVersion) {
         var lang = answerVersion.params.sLangProg;
         $(ul).append('<li><a href="#'+name+'-tab-'+index+'">'+langToPrint[lang]+'</a></li>');
         if (urlMode) {
            $self.append('<div id="'+name+'-tab-'+index+'"><iframe src="'+answerVersion.answerUrl+'" width="600" height="400"></iframe></div>');
         } else {
            $self.append('<div id="'+name+'-tab-'+index+'"><pre class="code lang-all" data-code-lang="'+lang+'" data-code="'+escapeCode(answerVersion.answerContent)+'"></pre></div>');
         }
      });
      // from jQuery-ui-tabs:
      $self.tabs();
   });
}

function showHideSpecifics(currentLang) {
   $('.specific').each(function() {
      var langs = $(this).attr('data-lang');
      if (!langs) {
         console.error('no data-lang attribute!');
         return;
      }
      langs = langs.replace('jvs', 'javascool'); // accomodate old tasks
      if (langs.indexOf(currentLang) !== -1) {
         $(this).show();
      } else {
         $(this).hide();
      }
   });
}

function showHideCodes(currentLang) {
   $('.code').each(function() {
      if ($(this).hasClass('lang-'+currentLang) || $(this).hasClass('lang-all')) {
         var code = $(this).attr('data-code');
         if (!code) {return;}
         code = escapeCode(code);
         $(this).html(code);
         $(this).show();
         // when used in tabs, codes have a data-code-lang attribute, we use it
         // to determine the syntax we want to highlight. See includeSourceTabs.
         var specificLang = $(this).attr('data-code-lang');
         if (specificLang) { currentLang = specificLang; }
         if (!$(this).hasClass('brush:'+currentLang)) {
            $(this).addClass('brush:'+currentLang);
         }
      } else {
         $(this).hide();
      }
   });
}

// resources corresponds is the PEM installation API object
function transformHtmlWithResources(resources, urlMode, currentLang) {
   translateTitles();
   showHideSpecifics(currentLang);
   includeSingleSources(resources, currentLang, urlMode);
   includeSourceTabs(resources, currentLang, urlMode);
   showHideCodes(currentLang);
   // calling SyntaxHighlighter:
   SyntaxHighlighter.defaults.toolbar  = false;
   SyntaxHighlighter.defaults.gutter   = false;
   SyntaxHighlighter.highlight();
}

var htmlstr = '<div id="task"><h1 ng-bind-html="taskTitle"></h1><div dynamic-compile="taskContent"></div></div><div id="editor"><div id="sourcesEditor"><div fioi-editor2="{tabset: \'sources\'}"></div></div><div id="testsEditor" ng-if="tm_task.bUserTests"><div fioi-editor2="{tabset:\'tests\'}"></div></div></div><div id="solution" dynamic-compile="solutionContent"></div><div id="hints"><div task-hints ng-if="tm_task && tm_task.nbHintsTotal"></div></div>';

var task = {};

task.printViewChooser = true; // miniPlatform shows view chooser

task.getViews = function(callback) {
    // all fioi tasks have the same views
    var views = {
        task: {},
        solution: {},
        hints : {},
        forum : {requires: "task"},
        editor : {}
    };
    callback(views);
};

task.load = function (views, callback) {// TODO: handle views
   var urlMode = true;
   if (window.location.href.search("http://") === 0 || window.location.href
      .search("https://") === 0) {
      urlMode = false; // we can use ajax
   }
   var currentLang = 'cpp'; // TODO: fetch through platform.getTaskParams
   window.implementGetResources(task);
   task.getResources(function (PEMInstallationAPIObject) {
      fillResources(FIOITaskMetaData, PEMInstallationAPIObject,
         function () {
            ModelsManager.init(models);
            var taskId = insertResourcesInModel(PEMInstallationAPIObject, PEMTaskMetaData);
            callback();
            $('body').html(htmlstr);
            $(document).ready(function() {
               angular.module('submission-manager', []);
               angular.bootstrap(document, ['pemTask'], {strictDi: true});
            });
         }, urlMode);
   });
   };

task.getMetaData = function(callback) {
   var title = $('h1').text();
   PEMTaskMetaData.title = title;
   callback(PEMTaskMetaData);
};

task.showViews = function(views, success, error) {
   success();
};

window.task = task;

//$('document').ready(function() {
   platform.initWithTask(task);
//});

})();
