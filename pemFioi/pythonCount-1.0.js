// TODO :: move to code-editor

/* 
pythonCount:
   returns number of Blockly blocks corresponding to some Python code.

Patterns are stored in pythonCountPatterns, tried in the order of the list;
block: false means a pattern doesn't count towards the block number if matched.
*/

var pythonCountPatterns = [
   // Comments
   {pattern: /^#[^\n\r]+/, block: false},

   // Special syntax
   {pattern: /^from\s+\w+\s+import\s+[^\n\r]/, block: false}, // from robot import *
   {pattern: /^import\s+[^\n\r]+/, block: false}, // import x, y, z
   {pattern: /^for\s+\w+\s+in\s+range/, block: false}, // for i in range(5): is only one block; it's a bit tricky

   {pattern: /^\w+/, block: true},

   // Strings
   {pattern: /^'''(?:[^\\']|\\.|'[^']|'[^'])+'''/, block: true},
   {pattern: /^'(?:[^\\']|\\.)+'/, block: true},
   {pattern: /^"""(?:[^\\"]|\\.|"[^"]|""[^"])+"""/, block: true},
   {pattern: /^"(?:[^\\"]|\\.)+"/, block: true},

   // Operators
   {pattern: /^[+*\/%=!<>&|^~]+/, block: true},

   // Separators
   {pattern: /^[\s\(\),:]+/, block: false}
   ];

function pythonCount(text) {
   var remainingText = text;
   var nbBlocks = 0;
   while(remainingText != '') {
      var found = false;
      for(var i=0; i<pythonCountPatterns.length; i++) {
         var patternInfo = pythonCountPatterns[i];
         var match = patternInfo.pattern.exec(remainingText);
         if(match) {
            if(patternInfo.block) { nbBlocks += 1; }
            remainingText = remainingText.substring(match[0].length);
            found = true;
            break;
         }
      }
      if(!found) {
         remainingText = remainingText.substring(1);
      }
   }
   return nbBlocks;
}

var pythonForbiddenBlocks = {
    'logic': {
      'controls_if': ['if', 'else', 'elif'],
      'controls_if_else': ['if', 'else', 'elif'],
      'logic_negate': ['not'],
      'logic_operation': ['and', 'or']
    },
    'loops': {
      'controls_repeat': ['for'],
      'controls_repeat_ext': ['for'],
      'controls_for': ['for'],
      'controls_forEach': ['for'],
      'controls_whileUntil': ['while'],
      'controls_untilWhile': ['while']
    },
    'lists': {
      'lists_create_with_empty': ['list', 'set', 'list_brackets'],
      'lists_create_with': ['list', 'set', 'list_brackets'],
      'lists_repeat' : ['list', 'set', 'list_brackets'],
      'lists_length' : ['list', 'set', 'list_brackets'],
      'lists_isEmpty' : ['list', 'set', 'list_brackets'],
      'lists_indexOf' : ['list', 'set', 'list_brackets'],
      'lists_getIndex': ['list', 'set', 'list_brackets'],
      'lists_setIndex': ['list', 'set', 'list_brackets'],
      'lists_getSublist': ['list', 'set', 'list_brackets'],
      'lists_sort' : ['list', 'set', 'list_brackets'],
      'lists_split' : ['list', 'set', 'list_brackets'],
      'lists_append': ['list', 'set', 'list_brackets']
    },
    'functions': {
      'procedures_defnoreturn': ['def'],
      'procedures_defreturn': ['def']
    }
};

function pythonForbiddenLists(includeBlocks) {
   // Check for forbidden keywords in code
   var forbidden = ['for', 'while', 'if', 'else', 'elif', 'not', 'and', 'or', 'list', 'set', 'list_brackets', 'dict_brackets', 'def', 'break', 'continue'];
   var allowed = []

   if(!includeBlocks) {
     return {forbidden: forbidden, allowed: allowed};
   }

   var removeForbidden = function(kwList) {
      for(var k=0; k<kwList.length; k++) {
         var idx = forbidden.indexOf(kwList[k]);
         if(idx >= 0) {
            forbidden.splice(idx, 1);
            allowed.push(kwList[k]);
         }
      }
   };

   if(includeBlocks && includeBlocks.standardBlocks && !includeBlocks.standardBlocks.includeAll) {
      if(includeBlocks.standardBlocks.wholeCategories) {
         for(var c=0; c<includeBlocks.standardBlocks.wholeCategories.length; c++) {
            var categoryName = includeBlocks.standardBlocks.wholeCategories[c];
            if(pythonForbiddenBlocks[categoryName]) {
               for(var blockName in pythonForbiddenBlocks[categoryName]) {
                  removeForbidden(pythonForbiddenBlocks[categoryName][blockName]);
               }
            }
         }
      }
      if(includeBlocks.standardBlocks.singleBlocks) {
         for(var b=0; b<includeBlocks.standardBlocks.singleBlocks.length; b++) {
            var blockName = includeBlocks.standardBlocks.singleBlocks[b];
            for(var categoryName in pythonForbiddenBlocks) {
               if(pythonForbiddenBlocks[categoryName][blockName]) {
                  removeForbidden(pythonForbiddenBlocks[categoryName][blockName]);
               }
            }
         }
      }
   }

   return {forbidden: forbidden, allowed: allowed};
}

function pythonForbidden(code, includeBlocks) {
   var forbidden = pythonForbiddenLists(includeBlocks).forbidden;

   if(forbidden.length <= 0) { return false; }

   // Remove comments and strings before scanning
   var removePatterns = [
      /#[^\n\r]+/,
      /'''(?:[^\\']|\\.|'[^']|'[^'])+'''/,
      /'(?:[^\\']|\\.)+'/,
      /"""(?:[^\\"]|\\.|"[^"]|""[^"])+"""/,
      /"(?:[^\\"]|\\.)+"/
      ];
   for(var i=0; i<removePatterns.length; i++) {
      while(removePatterns[i].exec(code)) {
         code = code.replace(removePatterns[i], '');
     }
   }

   // Scan for each forbidden keyword
   for(var i=0; i<forbidden.length; i++) {
      if(forbidden[i] == 'list_brackets') {
         // Special pattern for lists
         var re = /[\[\]]/;
         if(re.exec(code)) {
            // Forbidden keyword found
            return 'crochets [ ]'; // TODO :: i18n ?
         }
      } else if(forbidden[i] == 'dict_brackets') {
         // Special pattern for lists
         var re = /[\{\}]/;
         if(re.exec(code)) {
            // Forbidden keyword found
            return 'accolades { }'; // TODO :: i18n ?
         }
      } else {
         var re = new RegExp('(^|\\W)'+forbidden[i]+'(\\W|$)');
         if(re.exec(code)) {
            // Forbidden keyword found
            return forbidden[i];
         }
      }
   }

   // No forbidden keyword found
   return false;
}
