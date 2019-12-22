function LanguageTheory(rng){
   var self = this;
   this.rng = rng;

   this.setRNG = function(fct) {
      this.rng = fct;
   };

   this.getWordList = function(minLength,maxLength) {
      /* return an array of words from sentences_wordList.js */
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

      return wordList;
   };
   
   this.getRandomWord = function(minLength,maxLength) {
      var wordList = this.getWordList(minLength,maxLength);
      var index = (this.rng.nextInt(0,10000) + Math.floor(Math.random()*10000))%(wordList.length-1);
      var word = this.formatWord(wordList[index]);
      return word;
   };

   this.formatWord = function(word) {
      word = word.toLowerCase().trim();
      word = word.replace(/[èéêë]/g,"e");
      word = word.replace(/[ôö]/g,"o");
      word = word.replace(/[âà]/g,"a");
      word = word.replace(/[îï]/g,"i");
      word = word.replace(/[û]/g,"u");
      word = word.toUpperCase();
      return word;
   };

   this.getWords = function(minLength,maxLength,nbWords) {
      var wordList = this.getWordList(minLength,maxLength);
      // this.rng.shuffle(wordList);
      Beav.Array.shuffle(wordList,this.rng.nextInt(0,10000) + Math.floor(Math.random()*10000));
      var words = [];
      for(var iWord = 0; iWord < nbWords; iWord++){
         words.push(this.formatWord(wordList[iWord]));
      }
      return words;
   };

   this.getRole = function(word,role) {
      switch(role) {
         case "prefix":
            return word.slice(0,this.rng.nextInt(2,word.length - 1));
         case "suffix":
            return word.slice(-this.rng.nextInt(2,word.length - 1));
         case "factor":
            return this.getFactor(word);
         case "subsequence":
            return this.getSubsequence(word);
         case "none":
         default:
            do{ 
               var shuffledWord = Array.prototype.slice.call(word);
               this.rng.shuffle(shuffledWord);
               var stringArray = shuffledWord.slice(0,this.rng.nextInt(2,word.length - 1));
               var string = stringArray.toString();
               string = string.replace(/,/gi,"");
            }while(this.isSubsequence("subsequence",string,word));
            return string;
      }
   };

   this.getFactor = function(word) {
      /* return a random factor of word */
      var startIndex = this.rng.nextInt(1,word.length - 3);
      var endIndex = this.rng.nextInt(startIndex + 2, word.length - 1);
      return word.slice(startIndex,endIndex);
   };

   this.getSubsequence = function(word) {
      /* return a random subsequence of word */
      do{
         var startIndex = this.rng.nextInt(0,word.length - 3);
         var endIndex = this.rng.nextInt(startIndex + 1,word.length);
         var string = word.charAt(startIndex);
         for(var iLetter = startIndex + 1 ; iLetter < endIndex; iLetter++){
            if(this.rng.nextBit()){
               string += word.charAt(iLetter);
            }
         }
         string += word.charAt(endIndex);
      }while(this.isSubsequence("factor",string,word));
      return string;
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

   this.isPrimitive = function(string) {
      for(var iLetter = 1; iLetter <= string.length/2; iLetter++){
         var substr = string.substring(0,iLetter);
         var regex = new RegExp('^('+substr+'){2,}$');
         if(regex.test(string)){
            return false;
         }
      }
      return true;
   };

   this.getLengthOfLongestSubsequence = function(word,type,whichIs) {
      switch(whichIs){
         case "primitive":
            var whichIsFct = this.isPrimitive;
            break;
         case "palindrome":
            var whichIsFct = this.isPalindrome;
            break;
         default:
            var whichIsFct = function(str){return true};
      }
      switch(type){
         case "prefix":
            for(var endIndex = word.length - 1; endIndex > 0; endIndex--){
               var substr = word.substring(0,endIndex);
               if(whichIsFct(substr)){
                  return substr.length;
               }
            }
         case "suffix":
            for(var startIndex = 1; startIndex < word.length; startIndex++){
               var substr = word.substring(startIndex,word.length);
               if(whichIsFct(substr)){
                  return substr.length;
               }
            }
         case "factor":
            var length = 0;
            for(var startIndex = 1; startIndex < word.length - 1; startIndex++){
               for(var endIndex = word.length - 1; endIndex > 1; endIndex--){
                  var substr = word.substring(startIndex,endIndex);
                  if(whichIsFct(substr) && !this.isSubsequence("prefix",substr,word) && !this.isSubsequence("suffix",substr,word) && substr.length > length){
                     length = substr.length;
                  }
               }
            }
            return length;
         case "subsequence":
            var length = 0;
            for(var iLetter = 0; iLetter < word.length; iLetter++){
               var substr = word.substr(0,iLetter)+word.substring(iLetter+1);
               if(whichIsFct(substr) && !this.isSubsequence("factor",substr,word) && substr.length > length){
                  // console.log(substr);
                  length = substr.length;
               }else if(substr.length > 1){
                  length = Math.max(this.getLengthOfLongestSubsequence(substr,"subsequence",whichIs),length);
               }
            }
            return length;
      }
   };

   this.isConjugate = function(word1,word2) {
      // console.log(word1+" "+word2);
      if(word1.length != word2.length){
         return false;
      }else{
         for(var iLetter = 1; iLetter < word1.length; iLetter++){
            var prefix1 = word1.substring(0,iLetter);
            var suffix1 = word1.substring(iLetter);
            var prefix2 = word2.slice(0,-iLetter);
            var suffix2 = word2.slice(-iLetter);
            // console.log(prefix1+" "+suffix1+" "+prefix2+" "+suffix2);
            if(prefix1 == suffix2 && prefix2 == suffix1){
               return true;
            }
         }
         return false;
      }
   };

   this.isMirror = function(word1,word2) {
      if(word1.length != word2.length){
         return false;
      }else{
         for(var iLetter = 0; iLetter < word1.length; iLetter++){
            if(word1.charAt(iLetter) != word2.charAt(word2.length - 1 - iLetter)){
               return false;
            }
         }
         return true;
      }
   };

   this.isPalindrome = function(word) {
      return self.isMirror(word,word);
   };

   this.getMirror = function(string) {
      var mirror = "";
      for(var iLetter = 1; iLetter <= string.length; iLetter++){
         mirror += string.charAt(string.length - iLetter);
      }
      return mirror;
   };

   this.validation = function(data) {
      var error = null;
      var answer = data.answer;
      var word = data.word;
      var words = data.words;
      switch(data.mode){
         case 1:  // find_factor
            var length = data.factorLength;
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
            break;
         case 2: // longest primitive
         case 9: // longest palindrome
            if(data.mode == 2){
               var whichIs = "primitive";
               var whichIsAdj = whichIs;
               var whichIsFct = this.isPrimitive;
            }else{
               var whichIs = "palindrome";
               var whichIsAdj = "palindromic";
               var whichIsFct = this.isPalindrome;
            }
            for(var type in answer){
               if(type != "seed"){
                  var length = this.getLengthOfLongestSubsequence(word,type,whichIs);
                  if(answer[type].length == 0){
                     return "The "+taskStrings[type]+" input is empty";
                  }
                  if(!whichIsFct(answer[type])){
                     return "The "+taskStrings[type]+" input is not "+whichIsAdj;
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
                  if(answer[type].length < length){
                     return answer[type]+" is not the longest possible "+whichIsAdj+" "+type+" for the word "+word;
                  }
               }
            }
            break;
         case 3: // conjugate
            for(var iPair = 0; iPair < answer.pairs.length; iPair++){
               for(var iWord = 0; iWord < 2; iWord++){
                  if(answer.pairs[iPair][iWord] == null){
                     return "One of the pairs is not complete";
                  }
               }
            }
            for(var iPair = 0; iPair < answer.pairs.length; iPair++){
               if(!this.isConjugate(words[answer.pairs[iPair][0]],words[answer.pairs[iPair][1]])){
                  return "Error in pair "+iPair;
               }
            }
            break;
         case 4: // mirrors
            for(var iWord = 0; iWord < words.length; iWord++){
               if(!answer.mirrors[iWord]){
                  return "Entry "+(iWord+1)+" is empty";
               }
            }
            for(var iWord = 0; iWord < words.length; iWord++){
               if(!this.isMirror(answer.mirrors[iWord],words[iWord])){
                  return "Error at line "+(iWord+1);
               }
            }
            break;
         case 5: // mirror factor
         case 6: // mirror prefix
         case 7: // mirror suffix
         case 8: // mirror subsequence
            var type = (data.mode == 8) ? "subsequence" : "factor"; 
            var mirrorTypes = {5:"factor",6:"prefix",7:"suffix",8:"subsequence"};
            var mirrorType = mirrorTypes[data.mode];
            var length = data.length;
            for(var iWord = 0; iWord < words.length; iWord++){
               if(!answer.factors[iWord]){
                  return "Entry "+(iWord+1)+" is empty";
               }
            }
            for(var iWord = 0; iWord < words.length; iWord++){
               if(answer.factors[iWord].length < length){
                  return answer.factors[iWord]+" is shorter than "+length;
               }
               if(!this.isSubsequence(type,answer.factors[iWord],words[iWord])){
                  return answer.factors[iWord]+" is not a "+type+" of "+words[iWord];
               }
               if(!this.isSubsequence(mirrorType,this.getMirror(answer.factors[iWord]),words[iWord])){
                  return "The mirror of "+answer.factors[iWord]+" is not a "+mirrorType+" of "+words[iWord];
               }
            }
            break;
      }
      
   };

};
