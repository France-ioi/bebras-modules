/* 
pythonCount:
   returns number of Blockly blocks corresponding to some Python code.

Patterns are stored in pythonCountPatterns, tried in the order of the list;
block: false means a pattern doesn't count towards the block number if matched.
*/

var pythonCountPatterns = [
   {pattern: /^#[^\n\r]+/, block: false},
   {pattern: /^for\s+\w+\s+in\s+range\([^:]+:/, block: true}, // for i in range(5): is only one block; it's a bit tricky
   {pattern: /^\w+/, block: true},
   {pattern: /^'''(?:[^\\']|\\.|'[^']|'[^'])+'''/, block: true},
   {pattern: /^'(?:[^\\']|\\.)+'/, block: true},
   {pattern: /^"""(?:[^\\"]|\\.|"[^"]|""[^"])+"""/, block: true},
   {pattern: /^"(?:[^\\"]|\\.)+"/, block: true},
   {pattern: /^[+*\/%=!<>&|^~]+/, block: true},
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
