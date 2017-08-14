// Lightweight version of TaskPlatform's showSource, until a more solid version
// is made

if(typeof app !== 'undefined') {
   var showSourceApp = app;
} else {
   var showSourceApp = angular.module('staticTask', ['ui.ace']);
}

showSourceApp.directive('showSource', ['$rootScope', function() {
   var allSourceLanguages = [
      {id: 'c', label: "C", ext: 'c', ace: {mode: 'c_cpp'}},
      {id: 'cpp', label: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'ocaml', label: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
      {id: 'java', label: "Java", ext: 'java', ace: {mode: 'java'}},
      {id: 'javascool', label: "JavaScool", ext: 'jvs', ace: {mode: 'java'}},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'python', label: "Python3", ext: 'py', ace: {mode: 'python'}},
      {id: 'blockly', label: "Blockly", ext: 'bl', blockly: {mode: 'python', dstlang: 'python'}}
   ];

   function getAceOptions(sLangProg) {
      var aceOptions = {
         showGutter: false,
         rendererOptions: {
               maxLines: 'Infinity',
               printMarginColumn: false
         },
         advanced: {
               highlightActiveLine: false,
               readOnly: true
         }
      };
      for(var i=0; i<allSourceLanguages.length; i++) {
         if (allSourceLanguages[i].id == sLangProg) {
            var newAceOptions = allSourceLanguages[i].ace;
            var naoKeys = Object.keys(newAceOptions);
            for(var j=0; j<naoKeys.length; j++) {
               aceOptions[naoKeys[j]] = newAceOptions[naoKeys[j]];
            }
            break;
         }
      };
      return aceOptions;
   }

   return {
      restrict: 'EA',
      scope: true,
      transclude: true,
      template: function(elem, attrs) {
         if(attrs.lang) {
            var lang = attrs.lang.replace(/^lang-/, '');
         } else if ($rootScope.sLangProg) {
            var lang = $rootScope.sLangProg;
         } else {
            var lang = null;
         }
         var aceOptions = getAceOptions(lang);
         // yeark...
         var aceOptionsString = JSON.stringify(aceOptions).replace(/"/g, "'");
         return '<div ui-ace="'+aceOptionsString+'" ng-model="sSource" class="readOnlySource" readonly></div><ng-transclude></ng-transclude>';
      },
      link: function(scope, element, attrs) {
         if(attrs.code) {
            scope.sSource = attrs.code;
         } else {
            var tr = element.find('ng-transclude');
            scope.sSource = tr.text().replace(/^\s*(\r|\n|\r\n|\n\r)/g, '');
            tr.text('');
         }
      }
   };
}]);
