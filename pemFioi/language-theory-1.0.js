function LanguageTheory(){

   this.getRandomWord = function(minLength,maxLength,rng) {
      var wordList = [];
      var array = [];
      var minLength = minLength || 0;
      var maxLength = maxLength || Infinity;

      for(var nounType of nounTypes){
         if(nounType != "city"){
            array = array.concat(nouns[nounType]["M"]).concat(nouns[nounType]["F"]);
         }else{
            array = array.concat(nouns[nounType]);
         }
      }
      array = array.concat(adjectives["before"]).concat(adjectives["after"]);

      for(var word of array){
         if(word[0].length >= minLength && word[0].length <= maxLength && !word[0].includes(" ") && !word[0].includes("-")){
            wordList.push(word[0]);
         }
      }

      var index = (rng.nextInt(0,10000) + Math.floor(Math.random()*10000))%(wordList.length-1);
      return wordList[index];
   };

   this.getWord = function(minLength,maxLength,rng) {
      var word = this.getRandomWord(minLength,maxLength,rng).toLowerCase().trim();
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
         if(type != "seed"){
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