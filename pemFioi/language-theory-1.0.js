// if(typeof require != 'undefined') {
//    var {
//       nounTypes,
//       nouns,
//       adjectiveTypes,
//       adjectives
//    } = require('./sentences_wordList.js');
// }

function LanguageTheory(){

   this.getRandomWord = function(minLength,randomSeed) {
      var wordList = [];
      for(var nounType of nounTypes){
         if(nounType != "city"){
            wordList = wordList.concat(nouns[nounType]["M"]).concat(nouns[nounType]["F"]);
         }else{
            wordList = wordList.concat(nouns[nounType]);
         }
      }
      wordList = wordList.concat(adjectives["before"]).concat(adjectives["after"]);
      var index = randomSeed;
      do{
         index = index%wordList.length; 
         var word = wordList[index];
         index++;
      }while(word[0].length < minLength);
      return word[0];
   };

   this.getWord = function(minLength,randomSeed) {
      var word;
      do{
         word = this.getRandomWord(minLength,randomSeed).toLowerCase().trim();
         randomSeed++;
      }while(word.includes(" ") || word.includes("-"));
      word = word.replace(/[èéêë]/g,"e");
      word = word.replace(/[ôö]/g,"o");
      word = word.replace(/[âà]/g,"a");
      word = word.replace(/[îï]/g,"i");
      word = word.replace(/[û]/g,"u");
      word = word.toUpperCase();
      return word;
   };

   this.validation = function(word,answer,length) {
      var error = null;
      for(var type in answer){
         if(answer[type].length == 0){
            return "The "+taskStrings[type]+" input is empty";
         }else if(answer[type].length < length){
            return "The "+taskStrings[type]+" input is shorter than "+length;
         }else if(answer[type].length > length){
            return "The "+taskStrings[type]+" input is longer than "+length;
         }
         if(!this.isSubsequence(type,answer[type],word)){
            return answer[type]+" is not a "+type+" of "+word;
         }
         if(type == "factor" || type == "subsequence"){
            if(this.isSubsequence("prefix",answer[type],word)){
               return "Please enter a "+type+" which is not a prefix";
            }else if(this.isSubsequence("suffix",answer[type],word)){
               return "Please enter a "+type+" which is not a suffix";
            }
         }
         if(type == "subsequence" && this.isSubsequence("factor",answer[type],word)){
            return "Please enter a "+type+" which is not a factor";
         }
      }
   };

   this.isSubsequence = function(type,string,word) {
      switch(type){
         case "prefix":
            var regex = new RegExp('^'+string);
            break;
         case "suffix":
            var regex = new RegExp(string+'$');
            break;
         case "factor":
            var regex = new RegExp('.*'+string+'.*');
            break;
         case "subsequence":
            var regexStr = "";
            for(var iLetter = 0; iLetter < string.length; iLetter++){
               regexStr += ".*"+string.charAt(iLetter);
            }
            regexStr += ".*";
            var regex = new RegExp(regexStr);
      }
      
      if(regex.test(word)){
         return true;
      }else{
         return false;
      }
   };
};