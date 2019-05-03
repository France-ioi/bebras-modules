if(typeof require != 'undefined') {
   var {
      nounTypes,
      nouns,
      adjectiveTypes,
      adjectives
   } = require('./sentences_wordList.js');
}

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
         if(!this.isFactor(type,answer[type],word)){
            return answer[type]+" is not a "+type+" of "+word;
         }
      }
   };

   this.isFactor = function(type,string,word) {
      switch(type){
         case "prefix":
            var regex = new RegExp('^'+string);
            break;
         case "suffix":
            var regex = new RegExp(string+'$');
            break;
         case "factor":
            var regex = new RegExp('.+'+string+'.+');
            break;
      }
      
      if(regex.test(word)){
         return true;
      }else{
         return false;
      }
   };
};