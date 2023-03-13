// TODO :: move to quickAlgo

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
   {pattern: /^def\s[^:]+:/, block: true}, // for i in range(5): is only one block; it's a bit tricky

   {pattern: /^\d+\.\d*/, block: true},
   {pattern: /^\w+/, block: true},

   // Strings
   {pattern: /^'''(?:[^\\']|\\.|'[^']|'[^'])*'''/, block: true},
   {pattern: /^'(?:[^\\']|\\.)*'/, block: true},
   {pattern: /^"""(?:[^\\"]|\\.|"[^"]|""[^"])*"""/, block: true},
   {pattern: /^"(?:[^\\"]|\\.)*"/, block: true},

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
    'dicts': {
      'dicts_create_with': ['dict_brackets'],
      'dict_get_literal': ['dict_brackets'],
      'dict_set_literal': ['dict_brackets'],
      'dict_keys': ['dict_brackets']
    },
    'logic': {
      'controls_if': ['if', 'else', 'elif'],
      'controls_if_else': ['if', 'else', 'elif'],
      'logic_negate': ['not'],
      'logic_operation': ['and', 'or']
    },
    'loops': {
      'controls_repeat': ['for', 'in'],
      'controls_repeat_ext': ['for', 'in'],
      'controls_for': ['for', 'in'],
      'controls_forEach': ['for', 'in'],
      'controls_whileUntil': ['while'],
      'controls_untilWhile': ['while'],
      'controls_infiniteloop': ['while']
    },
    'lists': {
      'lists_create_with_empty': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_create_with': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_repeat' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_length' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_isEmpty' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_indexOf' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_getIndex': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_setIndex': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_getSublist': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_sort' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_split' : ['list', 'set', 'list_brackets', '__getitem__', '__setitem__'],
      'lists_append': ['list', 'set', 'list_brackets', '__getitem__', '__setitem__']
    },
    'maths': {
      'math_number': ['math_number']
    },
    'functions': {
      'procedures_defnoreturn': ['def', 'lambda'],
      'procedures_defreturn': ['def', 'lambda']
    },
    'variables': {
      'variables_set': ['var_assign']
    }
};

function pythonForbiddenLists(includeBlocks) {
   // Check for forbidden keywords in code
   var forbidden = ['for', 'while', 'if', 'else', 'elif', 'not', 'and', 'or', 'list', 'set', 'list_brackets', 'dict_brackets', '__getitem__', '__setitem__', 'var_assign', 'def', 'lambda', 'break', 'continue', 'setattr', 'map', 'split', 'in', 'max'];
   var allowed = []

   if(!includeBlocks) {
     return {forbidden: forbidden, allowed: allowed};
   }

   var forced = includeBlocks.pythonForceForbidden ? includeBlocks.pythonForceForbidden : [];
   for(var k=0; k<forced.length; k++) {
      if(!arrayContains(forbidden, forced[k])) {
         forbidden.push(forced[k]);
      }
   }

   var removeForbidden = function(kwList) {
      for(var k=0; k<kwList.length; k++) {
         if(arrayContains(forced, kwList[k])) { continue; }
         var idx = forbidden.indexOf(kwList[k]);
         if(idx >= 0) {
            forbidden.splice(idx, 1);
            allowed.push(kwList[k]);
         }
      }
   };

   var pfa = includeBlocks.pythonForceAllowed ? includeBlocks.pythonForceAllowed : [];
   removeForbidden(pfa);
   for(var k=0; k<pfa.length; k++) {
      if(!arrayContains(allowed, pfa[k])) {
         allowed.push(pfa[k]);
      }
   }

   if(includeBlocks && includeBlocks.standardBlocks) {
      if(includeBlocks.standardBlocks.includeAll || includeBlocks.standardBlocks.includeAllPython) {
         // Everything is allowed
         removeForbidden(forbidden.slice());
         return {forbidden: forbidden, allowed: allowed};
      }
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

   if(includeBlocks && includeBlocks.variables && includeBlocks.variables.length) {
      removeForbidden(['var_assign']);
   }

   if(includeBlocks && includeBlocks.procedures && (includeBlocks.procedures.ret || includeBlocks.procedures.noret)) {
      removeForbidden(['def']);
   }

   return {forbidden: forbidden, allowed: allowed};
}

function removeFromPatterns(code, patterns) {
   // Remove matching patterns from code
   for(var i=0; i<patterns.length; i++) {
      while(patterns[i].exec(code)) {
         code = code.replace(patterns[i], '');
     }
   }
   return code;
}

function pythonForbidden(code, includeBlocks) {
   var forbidden = pythonForbiddenLists(includeBlocks).forbidden;

   if(includeBlocks && includeBlocks.procedures && includeBlocks.procedures.disableArgs) {
      forbidden.push('def_args');
   }

   // Remove comments and strings before scanning
   var removePatterns = [
      /#[^\n\r]+/
      ];

   code = removeFromPatterns(code, removePatterns);

   var stringPatterns = [
      /'''(?:[^\\']|\\.|'[^']|'[^'])*'''/,
      /'(?:[^\\']|\\.)*'/,
      /"""(?:[^\\"]|\\.|"[^"]|""[^"])*"""/,
      /"(?:[^\\"]|\\.)*"/
      ];

   var code2 = removeFromPatterns(code, stringPatterns);
   if(window.arrayContains && arrayContains(forbidden, 'strings') && code != code2) {
      return 'chaînes de caractères';
   }

   code = code2;

   // exec and eval are forbidden anyway
   if(/(^|\W)exec\(/.exec(code)) {
      return 'exec';
   }
   if(/(^|\W)eval\(/.exec(code)) {
      return 'eval';
   }

   if(forbidden.length <= 0) { return false; }

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
         // Special pattern for dicts
         var re = /[\{\}]/;
         if(re.exec(code)) {
            // Forbidden keyword found
            return 'accolades { }'; // TODO :: i18n ?
         }
      } else if(forbidden[i] == 'var_assign') {
         // Special pattern for var assignment
         var re = /[^=!<>]=[^=!<>]/;
         if(re.exec(code)) {
            // Forbidden keyword found
            return '= (assignation de variable)'; // TODO :: i18n ?
         }
      } else if(forbidden[i] == 'def_args') {
         var re = /def\s*\w+\([^\s]+\)/;
         if(re.exec(code)) {
            // Forbidden keyword found
            return 'fonction avec arguments'; // TODO :: i18n ?
         }
      } else if(forbidden[i] != 'strings') {
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

function pythonFindLimited(code, limitedUses, blockToCode) {
   if(!code || !limitedUses) { return false; }
   var limitedPointers = {};
   var usesCount = {};
   for(var i=0; i < limitedUses.length; i++) {
      var curLimit = limitedUses[i];
      var pythonKeys = [];
      for(var b=0; b<curLimit.blocks.length; b++) {
         var blockName = curLimit.blocks[b];
         if(blockToCode[blockName]) {
            if(pythonKeys.indexOf(blockToCode[blockName]) >= 0) { continue; }
            pythonKeys.push(blockToCode[blockName]);
         }
         for(var categoryName in pythonForbiddenBlocks) {
            var targetKeys = pythonForbiddenBlocks[categoryName][blockName];
            if(!targetKeys) { continue; }
            for(var j=0; j < targetKeys.length; j++) {
               var pyKey = pythonForbiddenBlocks[categoryName][blockName][j];
               if(pythonKeys.indexOf(pyKey) >= 0) { continue; }
               pythonKeys.push(pyKey);
            }
         }
      }

      for(var j=0; j < pythonKeys.length; j++) {
          var pyKey = pythonKeys[j];
          if(!limitedPointers[pyKey]) {
              limitedPointers[pyKey] = [];
          }
          limitedPointers[pyKey].push(i);
      }
   }

   for(var pyKey in limitedPointers) {
      // Keys to ignore
      if(pyKey == 'else') {
         continue;
      }
      // Special keys
      if(pyKey == 'list_brackets') {
         var re = /[\[\]]/g;
      } else if(pyKey == 'dict_brackets') {
         var re = /[\{\}]/g;
      } else if(pyKey == 'math_number') {
         var re = /\W\d+(\.\d*)?/g;
      } else {
         // Check for assign statements
         var re = new RegExp('=\\W*'+pyKey+'([^(]|$)');
         if(re.exec(code)) {
            return {type: 'assign', name: pyKey};
         }

         var re = new RegExp('(^|\\W)'+pyKey+'(\\W|$)', 'g');
      }
      var count = (code.match(re) || []).length;

      for(var i = 0; i < limitedPointers[pyKey].length; i++) {
         var pointer = limitedPointers[pyKey][i];
         if(!usesCount[pointer]) { usesCount[pointer] = 0; }
         usesCount[pointer] += count;
         if(usesCount[pointer] > limitedUses[pointer].nbUses) {
            // TODO :: i18n ?
            if(pyKey == 'list_brackets') {
               var name = 'crochets [ ]';
            } else if(pyKey == 'dict_brackets') {
               var name = 'accolades { }';
            } else if(pyKey == 'math_number') {
               var name = 'nombres';
            } else {
               var name = pyKey;
            }
            return {type: 'uses', name: name};
         }
      }
   }

   return false;
}
