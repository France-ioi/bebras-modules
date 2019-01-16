
function init() {
   $("#form").html(createForm);
   initHandlers();
}

function createForm() {
   var html = "<h3>Générer des phrases</h3>";
   html += selectStructures();
   html += selectSentenceNumber();
   html += "<button id=\"createSentences\">Générer</button>";
   html += "<h3>Voir les listes de mot</h3>";
   html += selectBlock();
   html += "<button id=\"wordList\">Voir</button>";
   return html;
};

function selectStructures() {
   var html = "<label for=\"structures\">Structure</label>";
   html += "<select id=\"structures\">";
   html += "<option value=\"all\">Toutes</option>";
   for(var structureIndex in structures){
      var str = "";
      for(var iBlock in structures[structureIndex]){
         str += structures[structureIndex][iBlock]
         if(iBlock != structures[structureIndex].length - 1){
            str += "+";
         }
      }
      html += "<option value=\""+structureIndex+"\">"+str+"</option>";
   }
   html += "</select>";
   return html;
};

function selectBlock() {
   var html = "<label for=\"blocks\">Type</label>";
   html += "<select id=\"blocks\">";
   for(var blockIndex in structureTypes){
      block = structureTypes[blockIndex];
      html += "<option value=\""+blockIndex+"\">"+block+"</option>";
   }
   html += "</select>";
   html += "<label for=\"person\" class=\"person\">Personne + nombre</label>";
   html += "<select id=\"person\" class=\"person\">";
   for(var iPerson = 0; iPerson < 6; iPerson++){
      personText = (iPerson%3 + 1)+" "+((iPerson <=2) ? "S" : "P");
      html += "<option value=\""+iPerson+"\">"+personText+"</option>";
   }
   html += "</select>";
   html += "<label for=\"gender\" class=\"adj\">Genre</label>";
   html += "<select id=\"gender\" class=\"adj\">";
   html += "<option value=\"M\">M</option>";
   html += "<option value=\"F\">F</option>";
   html += "</select>";
   html += "<label for=\"number\" class=\"adj\">Nombre</label>";
   html += "<select id=\"number\" class=\"adj\">";
   html += "<option value=\""+0+"\">S</option>";
   html += "<option value=\""+1+"\">P</option>";
   html += "</select>";
   return html;
};

function selectSentenceNumber() {
   var html = "<label for=\"structures\">Nombre de phrases</label>";
   html += "<select id=\"nSentences\">";
   for(var i = 0; i < 4; i++){
      html += "<option value=\""+Math.pow(10,i)+"\">"+Math.pow(10,i)+"</option>";
   }
   html += "</select>";
   return html;
};

function initHandlers() {
   $(".person").hide();
   $(".adj").hide();
   $("#blocks").change(function(){
      if(structureTypes[$("#blocks").val()].startsWith("V")){
         $(".person").show();
      }else{
         $(".person").hide();
      }
      if(structureTypes[$("#blocks").val()].startsWith("adj")){
         $(".adj").show();
      }else{
         $(".adj").hide();
      }
   });
   $("#createSentences").off("click");
   $("#createSentences").click(function(){
      var struct = $("#structures").val();
      var n = $("#nSentences").val();
      var text = generateSentence(n,struct);
      $("#text").empty();
      $("#text").append(text);
   });
   $("#wordList").off("click");
   $("#wordList").click(function(){
      var block = $("#blocks").val();
      var text = generateWordList(block);
      $("#text").empty();
      $("#text").append(text);
   })
};

function generateWordList(block) {
   var text = "";
   var blockLabel = structureTypes[block];
   if(set.hasOwnProperty(blockLabel)){
      for(var subset of set[blockLabel]){
         var subsetIndex = structureTypes.indexOf(subset);
         text += generateWordList(subsetIndex);
      }
   }else if(blockLabel.startsWith("adj")){
      var place = (blockLabel === "adjBefore") ? "before": "after";
      for(var adj of adjectives[place]){
         var gender = $("#gender").val();
         var plural = $("#number").val();
         text += makeAdjectiveAgree(adj,gender,plural);
         text += "</br>";
      }
   }else{
      var batch = batches[blockLabel];
      var plural = (blockLabel.includes("-P")) ? 1 : 0;
      var dataVerb = $("#person").val();
      var person = dataVerb%3 + 1;
      var pluralVerb = (dataVerb <= 2) ? 0 : 1;
      if(blockLabel === "VT" || blockLabel === "VI"){
         for(var word of batch){
            text += conjugate(word,person,pluralVerb,"present",Math.random);
            text += "</br>";
         }
      }else{
         for(var subset of batch){
            for(var word of subset){
               text += (plural) ? pluralize(word[0],word[1]) : word[0];
               text += "</br>";
            }
         }
      }
   }

   return text;
};

function getWord(block,person,plural,tense,rng) {
   if(block.startsWith("double-")){
      var word1 = getWord(block.substring(7),person,plural,tense,rng);
      var word2 = getWord(block.substring(7),person,plural,tense,rng);
      var word = word1[0] + " et " + word2[0];
      person = 3;
      plural = 1;
      return [word,person,plural];
   }
   if(set.hasOwnProperty(block)){
      block = pickOne(set[block],rng);
      return getWord(block,person,plural,tense,rng);
   }
   var batch = batches[block];
   switch(block){
      case "N-M-S-noDet":
      case "N-F-S-noDet":
      case "CO-M-S-noDet":
      case "CO-F-S-noDet":
         person = 3;
         plural = 0;
         var type = pickOne(batch,rng);
         var word = pickOne(type,rng)[plural];
         break;
      case "N-M-P-noDet":
      case "N-F-P-noDet":
      case "CO-M-P-noDet":
      case "CO-F-P-noDet":
         person = 3;
         plural = 1;
         var type = pickOne(batch,rng);
         var word = pickOne(type,rng)[plural];
         break;
      
      case "N-M-S":
      case "N-M-S-adj":
      case "N-F-S":
      case "N-F-S-adj":
      case "CO-M-S":
      case "CO-F-S":
      case "CO-M-S-adj":
      case "CO-F-S-adj":
         person = 3;
         plural = 0;
         gender = block.includes("-M-") ? "M" : "F";
         var typeIndex = Math.trunc(rng() * batch.length);
         var type = batch[typeIndex];
         var noun = pickOne(type,rng)[0];
         if(typeIndex === 3){    // if country
            var det = getDeterminer(gender,0,"definite_article",rng);
         }else{
            var det = getDeterminer(gender,0,"",rng);
         }
         if(block.endsWith("-adj")){
            var word = addAdjective(noun,det,gender,plural,rng);
         }else{
            var word = elide(det + " " + noun);
         }
         break;
      case "N-M-P":
      case "N-M-P-adj":
      case "N-F-P":
      case "N-F-P-adj":
      case "CO-M-P":
      case "CO-F-P":
      case "CO-M-P-adj":
      case "CO-F-P-adj":
         person = 3;
         plural = 1;
         gender = block.includes("-M-") ? "M" : "F";
         var type = pickOne(batch,rng);
         var nounIndex = Math.trunc(rng() * type.length);
         var noun = pluralize(type[nounIndex][0],type[nounIndex][1]);
         var det = getDeterminer(gender,1,"",rng);
         if(block.endsWith("-adj")){
            var word = addAdjective(noun,det,gender,plural,rng);
         }else{
            var word = elide(det + " " + noun);
         }
         break;
      case "1P-S":
      case "2P-S":
      case "1P-P":
      case "2P-P":
         person = block.charAt(0);
         plural = block.endsWith("-S") ? 0 : 1;
         var word = batch[0][0][plural];
         break;
      case "VI":
      case "VT":
         var verb = pickOne(batch,rng);
         var negation = Math.trunc(rng() * 10);
         var verbConj = conjugate(verb,person,plural,tense);
         if(negation === 0){
            var negationWord = pickOne(negationWords,rng);
            var word = elide("ne " + verbConj + " " + negationWord);
         }else{
            var word = verbConj;
         }
         break;
   }
   return [word,person,plural];
}

// module.exports.generate = function (rng, minLength, maxLength, withSpaces) {
function generateSentence(n,struc){
   var rng = Math.random;
   var withSpaces = true;
   var curLength = 0;
   var text = "";
   // while (curLength < maxLength - 50) {
   for(var iSentence = 0; iSentence < n; iSentence++){
      var sentence = "";
      // var structure = structures[Math.trunc(rng() * structures.length)];
      var structure = (struc === "all") ? pickOne(structures,rng) : structures[struc];
      var person = 3;
      var plural = 0;
      var tense = tenses[Math.trunc(rng() * tenses.length)];
      for(var block of structure){
         var word = getWord(block,person,plural,tense,rng);
         person = word[1];
         plural = word[2];
         sentence += word[0]+" ";
      }
      // var subject = createNounGroup(rng);
      // var subjVerb = addVerb(subject,rng);
      // sentence += subjVerb[0];
      // var transitive = subjVerb[1];
      // if(transitive){
      //    var object = createNounGroup(rng,true);
      //    sentence += object[0];
      // }
      // if(subjVerb[2]){
      //    // var sentence = addComplement(subjVerb,rng);
      // }
      sentence = elide(sentence);
      sentence = cleanUpSpecialChars(sentence, withSpaces);
      // if (sentence.length > (maxLength - curLength - 20)) {
      //    continue;
      // }
      // text += sentence;
      // if (withSpaces) {
      //    text += " ";
      // }
      curLength += sentence.length;
      text += "<p>"+sentence+"</p>";
   }
   // var iLastSentence = Math.trunc(rng() * sentences.length);
   // for (var iDelta = 0; iDelta < sentences.length; iDelta++) {
   //    var iSentence = (iLastSentence + iDelta) % sentences.length;
   //    var sentence = cleanUpSpecialChars(sentences[iSentence], withSpaces);
   //    var newLength = curLength + sentence.length;
   //    if ((newLength >= minLength) && (newLength <= maxLength)) {
   //       text += sentence;
   //       return text;
   //    }
   // }
   // console.log("Error : unable to generate sentences of correct length");
   return text;
}

function getDeterminer(gender,plural,type,rng) {
   var determinerType = (type) ? type : pickOne(determinerTypes,rng,(determinerTypes.length - 1 + plural));
   if(determinerType != "numeral_adjective"){
      if(plural){
         var determiner = determiners[determinerType][gender][0][1];
      }else{
         var determiner = determiners[determinerType][gender][0][0];
      }
   }else{
      var determiner = pickOne(determiners[determinerType],rng)[0];
   }
   return determiner;
};

function getAdjective(place,gender,plural,rng) {
   var adj = pickOne(adjectives[place],rng);
   var adjText = makeAdjectiveAgree(adj,gender,plural);
   return adjText;
};

function makeAdjectiveAgree(adj,gender,plural){
   var adjText = adj[0];
   if(gender === "F" && adj[1].length < 2){
      adjText += adj[1];
   }else if(gender === "F" && adj[1].length >= 2){
      adjText = adj[1];
   }
   if(plural && plural !== "0"){
      adjText = pluralize(adjText);
   }
   return adjText;
}

function addAdjective(noun,det,gender,plural,rng) {
   var place = pickOne(adjectiveTypes,rng);
   var adj = getAdjective(place,gender,plural,rng);
   if(place && place === "before"){
      var text = elide(det + " " + adj + " " + noun);
   }else{
      var text = elide(det + " " + noun + " " + adj);
   }
   return text;
};

function pluralize(str,plural) {
   str = str.trim();
   str = str.toLowerCase();
   if(plural){
      return plural;
   }
   if(str.includes(" ")){
      var array = str.split(" ");
      var newStr = "";
      for(var st of array){
         newStr += pluralize(st)+" ";
      }
      return newStr;
   }
   if(str.endsWith("s") || str.endsWith("x")){
      return str;
   }else if(str.endsWith("al") && str != "chacal"){
      return str.replace(/al$/,"aux");
   }else if(str.endsWith("au")){
      return str.replace(/au$/,"aux");
   }else{
      return str+"s";
   }
};

function elide(str) {
   str = str.toLowerCase();
   str = str.replace(/[èéêë]/g,"e");
   str = " " + str; 
   str = str.replace(/[ ](le|la)[ ]([aeiouy])/gi," l'$2");
   str = str.replace(/[ ](ce)[ ]([aeiouy])/gi," cet $2");
   str = str.replace(/[ ](de)[ ]([aeiouy])/gi," d'$2");
   str = str.replace(/[ ](je)[ ]([aeiouy])/gi," j'$2");
   str = str.replace(/[ ](ne)[ ]([aeiouy])/gi," n'$2");
   str = str.replace(/[ ]à[ ]le[ ]/gi," au ");
   str = str.replace(/[ ]à[ ]les[ ]/gi," aux ");
   var words = str.split(" ");
   for(var word of words){ // élision pour les mots en H
      if(elisionWithH.includes(word)){
         str = str.replace(/[ ](je)[ ](h[aeiouy])/gi," j'$2");
         str = str.replace(/[ ](ne)[ ](h[aeiouy])/gi," n'$2");
         str = str.replace(/[ ](le|la)[ ](h[aeiouy])/gi," l'$2");
         str = str.replace(/[ ](ce)[ ](h[aeiouy])/gi," cet $2");
      }
   }
   return str;
};

function conjugate(verb,person,plural,tense,rng) {
   var infinitive = verb[0].toLowerCase();
   if(tense === "infinitive"){
      return infinitive;
   }
   var group = verb[1];
   if(group === 0){ // auxiliaires
      if(infinitive === "être"){
         return auxConjugations[0][tense][person - 1 + plural * 3];
      }else{
         return auxConjugations[1][tense][person - 1 + plural * 3];
      }
   }else if(group === 1){
      var ending = conjugations[group-1][tense][person - 1 + plural * 3];
      if(infinitive.endsWith("ger") && person === 1 && plural === 1){   // exceptions orthographiques (sans tenir compte de l'accentuation)
         ending = "e"+ending;
         return infinitive.replace(/er$/,ending);
      }else if(infinitive.endsWith("oyer") || infinitive.endsWith("uyer")){
         if(plural && person == 1 || plural && person == 2){
            return infinitive.replace(/er$/,ending);
         }else{
            return infinitive.replace(/yer$/,"i"+ending); 
         }
      }else if(infinitive.endsWith("eler") && !exceptions[0].includes(infinitive)){
         if(plural && person == 1 || plural && person == 2){
            return infinitive.replace(/er$/,ending);
         }else{
            return infinitive.replace(/er$/,"l"+ending);
         }
      }else if(infinitive.endsWith("eter") && !exceptions[0].includes(infinitive)){
         if(plural && person == 1 || plural && person == 2){
            return infinitive.replace(/er$/,ending);
         }else{
            return infinitive.replace(/er$/,"t"+ending);
         }
      }else{
         return infinitive.replace(/er$/,ending);
      }
   }else if(group === 2){
      var ending = conjugations[group-1][tense][person - 1 + plural * 3];
      return infinitive.replace(/r$/,ending);
   }else if(group === 3){
      if(infinitive === "aller"){
         return allerConj[tense][person - 1 + plural * 3];
      }else if(infinitive === "pouvoir"){
         var ending = speConjugations[2][tense][person - 1 + plural * 3];
         return infinitive.replace(/ouvoir$/,ending);
      }else if(infinitive === "vouloir"){
         var ending = speConjugations[1][tense][person - 1 + plural * 3];
         return infinitive.replace(/ouloir$/,ending);
      }else if(infinitive === "devoir"){
         var ending = speConjugations[3][tense][person - 1 + plural * 3];
         return infinitive.replace(/evoir$/,ending);
      }else if(infinitive.endsWith("enir")){
         var ending = speConjugations[0][tense][person - 1 + plural * 3];
         return infinitive.replace(/enir$/,ending);
      }else if(infinitive.endsWith("ir") && !infinitive.endsWith("oir")&& !infinitive.endsWith("courir") ){
         var ending = conjugations[0][tense][person - 1 + plural * 3];
         return infinitive.replace(/ir$/,ending);
      }else{
         return infinitive;
      }
   }else{
      return infinitive;
   }
};

// function addComplement(subjVerb,rng) {
//    var comp = subjVerb[2];
//    switch(comp){
//       case "à+N":
//          var nounType = nounTypes[Math.trunc(rng() * nounTypes.length)];
//          var noun = nouns[nounTypes][Math.trunc(rng() * nouns[nounTypes].length)];
//          if(nounType === "city"){
//             return subjVerb[0]+" "+"à"+" "+noun[0];
//          }else if(nounType === "country"){
//             var determiner = determiners["definite_article"][1 - noun[1]];
//             var countryName = elide(determiner + " " + noun[0]);
//             var compText = elide("à" + " " + countryName);
//             return subjVerb[0]+" "+compText;
//          }
//    }
// };

function cleanUpSpecialChars(str, withSpaces) {
    str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[àáâãäå]/g,"a");
    str = str.replace(/[ÈÉÊË]/g,"E");
    str = str.replace(/[èéêë]/g,"e");
    str = str.replace(/[îï]/g,"i");
    str = str.replace(/[ôö]/g,"o");
    str = str.replace(/[ùüû]/g,"u");
    str = str.replace(/[Ç]/g,"C");
    str = str.replace(/[ç]/g,"c");
    str = str.replace(/['-]/g," ");
    str = str.replace(/[^a-zA-Z ]/gi,''); // final clean up
    if (!withSpaces) {
       str = str.replace(/[ ]/g,"");
    }
    return str.toUpperCase();
};

function pickOne(arr,rng,length) {
   if(length){
      var arrLength = length;
   }else{
      var arrLength = arr.length;
   }
   return arr[Math.trunc(rng() * arrLength)];
};

const structureTypes = [
   "N-M-S-noDet", // nom masculin singulier sans déterminant
   "N-M-S",
   "N-F-S-noDet", 
   "N-F-S",
   "N-M-P-noDet", 
   "N-M-P",
   "N-F-P-noDet", 
   "N-F-P",
   "1P-S",  // 1ère personne su singulier
   "2P-S",
   "3P-S",  // 3ème personne du singulier, regroupe plusieurs types (cf. array set)
   "1P-P",
   "2P-P",
   "3P-P",  // 3ème personne du pluriel, regroupe plusieurs types (cf. array set)
   "VI",    // verbe intransitif
   "VT",
   "CO-M-S-noDet",   // complément d'objet direct masculin singulier sans déterminant
   "CO-M-S",
   "CO-F-S-noDet",
   "CO-F-S",
   "CO-M-P-noDet",
   "CO-M-P",
   "CO-F-P-noDet",
   "CO-F-P",
   "CO",
   "adjBefore",
   "adjAfter"
];
const structures = [
   ["3P-S","VI"],
   ["3P-P","VI"],
   ["3P-S","VT","CO"],
   ["3P-P","VT","CO"],
   ["1P-S","VI"],
   ["2P-S","VI"],
   ["1P-P","VI"],
   ["2P-P","VI"],
   ["1P-S","VT","CO"],
   ["2P-S","VT","CO"],
   ["1P-P","VT","CO"],
   ["2P-P","VT","CO"]
];


// const genders = [ "F", "M", "neutral", "undefined"];

const tenses = ["present"];
const conjugations = [
   { "present": ["e","es","e","ons","ez","ent"] },
   { "present": ["s","s","t","ssons","ssez","ssent"] }
   ];
const speConjugations = [
   { "present": ["iens","iens","ient","enons","enez","iennent"] },
   { "present": ["eux","eux","eut","oulons","oulez","eulent"] },
   { "present": ["eux","eux","eut","ouvons","ouvez","euvent"] },
   { "present": ["ois","ois","oit","evons","evez","oivent"] }
];
const auxConjugations = [
   { "present": ["suis","es","est","sommes","êtes","sont"] },
   { "present": ["ai","as","a","avons","avez","ont"] }
];
const allerConj = {
   "present": ["vais","vas","va","allons","allez","vont"]
};
const exceptions = [
   [ "acheter", "geler", "haleter", "déceler", "modeler", "ciseler", "congeler", "marteler", "crocheter" ]
];

const negationWords = ["pas","plus","jamais","pas encore"];

const determinerTypes = [
   "definite_article",
   "indefinite_article",
   "demonstrative_adjective",
   "numeral_adjective"
   ];
const determiners = {
   "definite_article": {
      "M": [
         [ "le", "les" ]
      ],
      "F": [
         [ "la", "les" ]
      ]
   },
   "indefinite_article": {
      "M": [
         [ "un", "des" ]
      ],
      "F": [
         [ "une", "des" ]
      ]
   },
   "demonstrative_adjective": {
      "M": [
         [ "ce", "ces" ]
      ],
      "F": [
         [ "cette", "ces" ]
      ]
   },
   "numeral_adjective": [
      ["deux"], ["trois"], ["quatre"], ["cinq"], ["six"], ["sept"], ["huit"], ["neuf"], ["dix"], 
      ["onze"], ["douze"], ["treize"], ["quatorze"], ["quinze"], ["seize"], ["dix-sept"], ["dix-huit"], ["dix-neuf"], ["vingt"]
   ]
};

const pronounTypes = ["personal","personal_2","possessive","demonstrative","demonstrative_2","indefinite","relative","relative_2"];
const subjPronounTypes = ["personal","demonstrative_2","indefinite"];
const pronouns = {
/*   "personal": [  // [name, gender, plural, person]
      [ "Je", 2, 0, 1 ],
      [ "Tu", 2, 0, 2 ],
      [ "Il", 3, 0, 3 ],
      [ "Il", 1, 0, 3 ],
      [ "Elle", 0, 0, 3 ],
      [ "Nous", 2, 1, 1 ],
      [ "Vous", 2, 1, 2 ],
      [ "Ils", 1, 1, 3 ],
      [ "Elles", 0, 1, 3 ] ],*/
   // "personal_2": [  // [name, gender, plural, person]
   //    [ "Moi", 2, 0, 1 ],
   //    [ "Toi", 2, 0, 2 ],
   //    [ "Lui", 3, 0, 3 ],
   //    [ "Elle", 0, 0, 3 ],
   //    [ "Nous", 2, 1, 1 ],
   //    [ "Vous", 2, 1, 2 ],
   //    [ "eux", 1, 1, 3 ],
   //    [ "Elles", 0, 1, 3 ] ],
   "demonstrative": {
      "M": [   // [singular, plural]
         [ "celui-ci", "ceux-ci" ],
         [ "celui-là", "ceux-là" ],
         [ "ceci", "" ],
         [ "cela", "" ] ,
         [ "ça", "" ] 
      ],
      "F": [   // [singular, plural]
         [ "celle-ci", "celles-ci" ],
         [ "celle-là", "celles-là" ],
      ]
   },
   "indefinite": {
      "M": [
         [ "Autrui", "" ],
         [ "", "Certains" ],
         [ "Chacun", "" ],
         [ "On", "" ],
         // [ "Personne", "" ],
         [ "Quiconque", "" ],
         [ "N'importe qui", "" ],
         [ "Tout le monde", "" ],
         [ "Quelque chose", "" ],
         // [ "Rien", "" ],
         [ "Tout", "" ] 
      ],
      "F": [
         [ "", "Certaines" ],
         [ "Chacune", "" ],
      ]
   }
   // "relative": [ "Qui", "Que", "Quoi", "Dont", "Où" ],
   // "relative_2": [ // [name, gender, plural]
   //    ["lequel", 1, 0],
   //    ["lesquels", 1, 1],
   //    ["laquelle", 0, 0],
   //    ["lesquelles", 0, 1] ]  
};
const nounTypes = ["name","job","animal","plant","country","city"];
const nouns = {
   "name": { 
      "M": [
         [ "Achille" ],
         [ "Adam" ],
         [ "Adrien" ],
         [ "Alain" ],
         [ "Alban" ],
         [ "Albert" ],
         [ "Alexandre" ],
         [ "Alfred" ],
         [ "Alphonse" ],
         [ "Anatole" ],
         [ "Anthony" ],
         [ "Antoine" ],
         [ "Archibald" ],
         [ "Armand" ],
         [ "Arthur" ],
         [ "Augustin" ],
         [ "Aurélien" ],
         [ "Baptiste" ],
         [ "Barnabé" ],
         [ "Bastien" ],
         [ "Benjamin" ],
         [ "Benoît" ],
         [ "Bernard" ],
         [ "Bertrand" ],
         [ "Bob" ],
         [ "Bobby" ],
         [ "Brice" ],
         [ "Bruce" ],
         [ "Bruno" ],
         [ "Cédric" ],
         [ "Christian" ],
         [ "Christophe" ],
         [ "Claude" ],
         [ "Clément" ],
         [ "Corentin" ],
         [ "Cyprien" ],
         [ "Cyril" ],
         [ "Damien" ],
         [ "Daniel" ],
         [ "David" ],
         [ "Denis" ],
         [ "Dimitri" ],
         [ "Edouard" ],
         [ "Emmanuel" ],
         [ "Eric" ],
         [ "Ernest" ],
         [ "Etienne" ],
         [ "Fabien" ],
         [ "Fabrice" ],
         [ "Ferdinand" ],
         [ "Florient" ],
         [ "Francis" ],
         [ "François" ],
         [ "Gabriel" ],
         [ "Gaétan" ],
         [ "Gaspard" ],
         [ "Geoffrey" ],
         [ "Georges" ],
         [ "Gérald" ],
         [ "Gérard" ],
         [ "Gilbert" ],
         [ "Grégory" ],
         [ "Guillaume" ],
         [ "Guy" ],
         [ "Harry" ],
         [ "Henri" ],
         [ "Hervé" ],
         [ "Hugo" ],
         [ "Hugues" ],
         [ "Igor" ],
         [ "Jacky" ],
         [ "Jacques" ],
         [ "Jean" ],
         [ "Jérémy" ],
         [ "Jérôme" ],
         [ "Jonathan" ],
         [ "Julien" ],
         [ "Karim" ],
         [ "Karl" ],
         [ "Laurent" ],
         [ "Léo" ],
         [ "Léon" ],
         [ "Léonard" ],
         [ "Léopold" ],
         [ "Loic" ],
         [ "Louis" ],
         [ "Lucas" ],
         [ "Ludovic" ],
         [ "Marc" ],
         [ "Marco" ],
         [ "Mathias" ],
         [ "Mathieu" ],
         [ "Maurice" ],
         [ "Maxime" ],
         [ "Maximilien" ],
         [ "Mehdi" ],
         [ "Michel" ],
         [ "Mickaël" ],
         [ "Mourad" ],
         [ "Nathan" ],
         [ "Nicolas" ],
         [ "Noël" ],
         [ "Olivier" ],
         [ "Oscar" ],
         [ "Pablo" ],
         [ "Pascal" ],
         [ "Patrice" ],
         [ "Patrick" ],
         [ "Paul" ],
         [ "Philippe" ],
         [ "Pierre" ],
         [ "Quentin" ],
         [ "Raphaël" ],
         [ "Raymond" ],
         [ "Rémi" ],
         [ "Richard" ],
         [ "Robert" ],
         [ "Romain" ],
         [ "Samuel" ],
         [ "Sébastien" ],
         [ "Serge" ],
         [ "Simon" ],
         [ "Stanislas" ],
         [ "Stéphane" ],
         [ "Sylvain" ],
         [ "Sylvestre" ],
         [ "Tanguy" ],
         [ "Théo" ],
         [ "Théodore" ],
         [ "Thomas" ],
         [ "Tom" ],
         [ "Ulysse" ],
         [ "Valentin" ],
         [ "Victor" ],
         [ "Walter" ],
         [ "William" ],
         [ "Xavier" ],
         [ "Yann" ],
         [ "Yohann" ],
         [ "Youssef" ],
         [ "Yvan" ],
         [ "Yves" ],
         [ "Yvon" ],
         [ "Zinédine" ]
      ], 
      "F":  [
         [ "Adèle" ],
         [ "Adeline" ],
         [ "Agathe" ],
         [ "Agnès" ],
         [ "Aïcha" ],
         [ "Alexandra" ],
         [ "Alice" ],
         [ "Alison" ],
         [ "Alisée" ],
         [ "Amandine" ],
         [ "Amélie" ],
         [ "Anaïs" ],
         [ "Anémone" ],
         [ "Annabelle" ],
         [ "Anne" ],
         [ "Annie" ],
         [ "Ariane" ],
         [ "Augustine" ],
         [ "Aurélia" ],
         [ "Azalée" ],
         [ "Babette" ],
         [ "Barbara" ],
         [ "Béatrice" ],
         [ "Berthe" ],
         [ "Brigitte" ],
         [ "Camille" ],
         [ "Carole" ],
         [ "Caroline" ],
         [ "Catherine" ],
         [ "Cécile" ],
         [ "Chantal" ],
         [ "Charlotte" ],
         [ "Christelle" ],
         [ "Claire" ],
         [ "Clarence" ],
         [ "Clémence" ],
         [ "Clémentine" ],
         [ "Corine" ],
         [ "Cynthia" ],
         [ "Danielle" ],
         [ "Delphine" ],
         [ "Dorothée" ],
         [ "Eglantine" ],
         [ "Eléonore" ],
         [ "Elisabeth" ],
         [ "Eloïse" ],
         [ "Emilie" ],
         [ "Emmanuelle" ],
         [ "Estelle" ],
         [ "Eve" ],
         [ "Eveline" ],
         [ "Fabienne" ],
         [ "Florence" ],
         [ "Françoise" ],
         [ "Gabrielle" ],
         [ "Geneviève" ],
         [ "Géraldine" ],
         [ "Gisèle" ],
         [ "Gladys" ],
         [ "Hélène" ],
         [ "Hortense" ],
         [ "Inès" ],
         [ "Isabelle" ],
         [ "Jacqueline" ],
         [ "Jeanne" ],
         [ "Jessica" ],
         [ "Jocelyne" ],
         [ "Joëlle" ],
         [ "Joséphine" ],
         [ "Judith" ],
         [ "Julie" ],
         [ "Juliette" ],
         [ "Justine" ],
         [ "Karine" ],
         [ "Laeticia" ],
         [ "Laura" ],
         [ "Laure" ],
         [ "Laurence" ],
         [ "Léa" ],
         [ "Leïla" ],
         [ "Lisa" ],
         [ "Louise" ],
         [ "Lucie" ],
         [ "Madeleine" ],
         [ "Magalie" ],
         [ "Maïté" ],
         [ "Marguerite" ],
         [ "Marie" ],
         [ "Marina" ],
         [ "Marjorie" ],
         [ "Marlène" ],
         [ "Martine" ],
         [ "Mathilde" ],
         [ "Mélanie" ],
         [ "Mélissa" ],
         [ "Michelle" ],
         [ "Monique" ],
         [ "Muriel" ],
         [ "Myriam" ],
         [ "Nadine" ],
         [ "Nicole" ],
         [ "Noémie" ],
         [ "Odile" ],
         [ "Pascale" ],
         [ "Pénélope" ],
         [ "Rachel" ],
         [ "Rosalie" ],
         [ "Sabine" ],
         [ "Sabrina" ],
         [ "Samantha" ],
         [ "Sandra" ],
         [ "Sandrine" ],
         [ "Sarah" ],
         [ "Séverine" ],
         [ "Simone" ],
         [ "Sonia" ],
         [ "Sophie" ],
         [ "Stéphanie" ],
         [ "Sylvie" ],
         [ "Thérèse" ],
         [ "Valérie" ],
         [ "Vanessa" ],
         [ "Véronique" ],
         [ "Victoria" ],
         [ "Yasmine" ],
         [ "Yvette" ],
         [ "Zoé" ] 
      ]
   },      
   "job": {
      "M": [   // [name,(plural)]
         [ "acteur" ],
         [ "agriculteur" ],
         [ "aide-soignant", "aides-soignants" ],
         [ "ambulancier" ],
         [ "analyste" ],
         [ "animateur" ],
         [ "antiquaire" ],
         [ "apiculteur" ],
         [ "archéologue" ],
         [ "architecte" ],
         [ "archiviste" ],
         [ "artiste" ],
         [ "astronaute" ],
         [ "astronome" ],
         [ "astrologue" ],
         [ "astrophysicien" ],
         [ "attaché de presse", "attachés de presse" ],
         [ "auteur" ],
         [ "aviateur" ],
         [ "avocat" ],
         [ "banquier" ],
         [ "bibliothécaire" ],
         [ "bijoutier" ],
         [ "biologiste" ],
         [ "boucher" ],
         [ "boulanger" ],
         [ "bûcheron" ],
         [ "caissier" ],
         [ "capitaine" ],
         [ "cardiologue" ],
         [ "carrossier" ],
         [ "cartographe" ],
         [ "chanteur" ],
         [ "charcutier" ],
         [ "chargé de relations publiques", "chargés de relations publiques" ],
         [ "charpentier" ],
         [ "chaudronnier" ],
         [ "chauffeur" ],
         [ "chef d'orchestre", "chefs d'orchestre" ],
         [ "chef de service", "chefs de service" ],
         [ "chercheur" ],
         [ "chirurgien" ],
         [ "chorégraphe" ],
         [ "coiffeur" ],
         [ "comédien" ],
         [ "commissaire" ],
         [ "comptable" ],
         [ "concierge" ],
         [ "conducteur" ],
         [ "conseiller d'orientation", "conseillers d'orientation" ],
         [ "consultant" ],
         [ "contrôleur" ],
         [ "convoyeur de fonds", "convoyeurs de fonds" ],
         [ "correcteur" ],
         [ "costumier" ],
         [ "coursier" ],
         [ "couturier" ],
         [ "cuisinier" ],
         [ "danseur" ],
         [ "décorateur" ],
         [ "déménageur" ],
         [ "démographe" ],
         [ "dentiste" ],
         [ "dépanneur" ],
         [ "dessinateur" ],
         [ "détective privé", "détectives privés" ],
         [ "développeur" ],
         [ "diététicien" ],
         [ "directeur" ],
         [ "docteur" ],
         [ "documentaliste" ],
         [ "dompteur" ],
         [ "douanier" ],
         [ "ébéniste" ],
         [ "éboueur" ],
         [ "écrivain" ],
         [ "éducateur spécialisé", "éducateurs spécialisés" ],
         [ "électricien" ],
         [ "employé" ],
         [ "enseignant" ],
         [ "entraîneur" ],
         [ "épicier" ],
         [ "ergothérapeute" ],
         [ "esthéticien" ],
         [ "ethnologue" ],
         [ "facteur" ],
         [ "fermier" ],
         [ "fleuriste" ],
         [ "funambule" ],
         [ "garagiste" ],
         [ "garçon de café", "garçons de café" ],
         [ "gendarme" ],
         [ "géographe" ],
         [ "géologue" ],
         [ "graphiste" ],
         [ "guide" ],
         [ "harpiste" ],
         [ "historien" ],
         [ "horticulteur" ],
         [ "horloger" ],
         [ "huissier" ],
         [ "imprimeur" ],
         [ "infirmier" ],
         [ "informaticien" ],
         [ "ingénieur" ],
         [ "inspecteur" ],
         [ "instituteur" ],
         [ "jardinier" ],
         [ "jongleur" ],
         [ "journaliste" ],
         [ "juge" ],
         [ "juriste" ],
         [ "kinésithérapeute" ],
         [ "libraire" ],
         [ "lieutenant" ],
         [ "luthier" ],
         [ "maçon" ],
         [ "magistrat" ],
         [ "maître d'hôtel", "maîtres d'hôtel" ],
         [ "manutentionnaire" ],
         [ "marin" ],
         [ "mathématicien" ],
         [ "mécanicien" ],
         [ "médecin" ],
         [ "menuisier" ],
         [ "météorologue" ],
         [ "metteur en scène", "metteurs en scène" ],
         [ "militaire" ],
         [ "moniteur" ],
         [ "musicien" ],
         [ "nageur" ],
         [ "neurologue" ],
         [ "notaire" ],
         [ "nutritionniste" ],
         [ "océanographe" ],
         [ "opérateur" ],
         [ "opticien" ],
         [ "orthophoniste" ],
         [ "ouvrier" ],
         [ "pâtissier" ],
         [ "paysagiste" ],
         [ "paysan" ],
         [ "pédiatre" ],
         [ "peintre" ],
         [ "pharmacien" ],
         [ "photographe" ],
         [ "pilote" ],
         [ "plombier" ],
         [ "poissonnier" ],
         [ "policier" ],
         [ "pompier" ],
         [ "procureur" ],
         [ "professeur" ],
         [ "projectionniste" ],
         [ "psychanalyste" ],
         [ "psychiatre" ],
         [ "psychologue" ],
         [ "réalisateur" ],
         [ "réceptionniste" ],
         [ "rédacteur en chef", "rédacteurs en chef" ],
         [ "responsable" ],
         [ "restaurateur" ],
         [ "scénariste" ],
         [ "secrétaire" ],
         [ "serveur" ],
         [ "sociologue" ],
         [ "sorcier" ],
         [ "standardiste" ],
         [ "tatoueur" ],
         [ "taxidermiste" ],
         [ "technicien" ],
         [ "traducteur" ],
         [ "urbaniste" ],
         [ "urgentiste" ],
         [ "vendeur" ],
         [ "vétérinaire" ],
         [ "viticulteur" ],
         [ "volcanologue" ],
         [ "xylophoniste" ],
         [ "zoologiste" ]
      ],
      "F": [ // [name,(plural)]
         [ "actrice" ],
         [ "aide-soignante", "aides-soignantes" ],
         [ "ambulancière" ],
         [ "analyste" ],
         [ "animatrice" ],
         [ "antiquaire" ],
         [ "archéologue" ],
         [ "architecte" ],
         [ "archiviste" ],
         [ "artiste" ],
         [ "assistante maternelle", "assistantes maternelles" ],
         [ "assistante sociale", "assistantes sociales" ],
         [ "astronaute" ],
         [ "astronome" ],
         [ "astrologue" ],
         [ "astrophysicienne" ],
         [ "attachée de presse", "attachées de presse" ],
         [ "avocate" ],
         [ "banquière" ],
         [ "bibliothécaire" ],
         [ "bijoutière" ],
         [ "biologiste" ],
         [ "boulangère" ],
         [ "caissière" ],
         [ "capitaine" ],
         [ "cardiologue" ],
         [ "cartographe" ],
         [ "chanteuse" ],
         [ "charcutière" ],
         [ "chargée de relations publiques", "chargées de relations publiques" ],
         [ "chef de service", "chefs de service" ],
         [ "chercheuse" ],
         [ "chorégraphe" ],
         [ "coiffeuse" ],
         [ "comédienne" ],
         [ "commissaire" ],
         [ "comptable" ],
         [ "concierge" ],
         [ "conductrice" ],
         [ "conseillère d'orientation", "conseillères d'orientation" ],
         [ "consultante" ],
         [ "contrôleuse" ],
         [ "correctrice" ],
         [ "costumière" ],
         [ "couturière" ],
         [ "cuisinière" ],
         [ "danseuse" ],
         [ "décoratrice" ],
         [ "déménageuse" ],
         [ "démographe" ],
         [ "dentiste" ],
         [ "dépanneuse" ],
         [ "dessinatrice" ],
         [ "détective privée", "détectives privées" ],
         [ "développeuse" ],
         [ "diététicienne" ],
         [ "directrice" ],
         [ "docteur" ],
         [ "documentaliste" ],
         [ "dompteuse" ],
         [ "douanière" ],
         [ "ébéniste" ],
         [ "éducatrice spécialisée", "éducatrices spécialisées" ],
         [ "électricienne" ],
         [ "employée" ],
         [ "enseignante" ],
         [ "entraîneuse" ],
         [ "épicière" ],
         [ "ergothérapeute" ],
         [ "esthéticienne" ],
         [ "ethnologue" ],
         [ "femme de chambre", "femmes de chambre" ],
         [ "fermière" ],
         [ "fleuriste" ],
         [ "funambule" ],
         [ "géographe" ],
         [ "géologue" ],
         [ "graphiste" ],
         [ "guide" ],
         [ "harpiste" ],
         [ "historienne" ],
         [ "horticultrice" ],
         [ "hôtesse de l'air", "hôtesses de l'air" ],
         [ "infirmière" ],
         [ "informaticienne" ],
         [ "ingénieure" ],
         [ "inspectrice" ],
         [ "institutrice" ],
         [ "jongleuse" ],
         [ "journaliste" ],
         [ "juge" ],
         [ "juriste" ],
         [ "kinésithérapeute" ],
         [ "libraire" ],
         [ "magistrate" ],
         [ "mathématicienne" ],
         [ "mécanicienne" ],
         [ "météorologue" ],
         [ "metteuse en scène", "metteuses en scène" ],
         [ "monitrice" ],
         [ "musicienne" ],
         [ "nageuse" ],
         [ "neurologue" ],
         [ "notaire" ],
         [ "nutritionniste" ],
         [ "océanographe" ],
         [ "opératrice" ],
         [ "opticienne" ],
         [ "orthophoniste" ],
         [ "pâtissière" ],
         [ "paysagiste" ],
         [ "paysanne" ],
         [ "pédiatre" ],
         [ "pharmacienne" ],
         [ "photographe" ],
         [ "poissonnière" ],
         [ "policière" ],
         [ "projectionniste" ],
         [ "psychanalyste" ],
         [ "psychiatre" ],
         [ "psychologue" ],
         [ "réalisatrice" ],
         [ "réceptionniste" ],
         [ "rédactrice en chef", "rédactrices en chef" ],
         [ "responsable" ],
         [ "restauratrice" ],
         [ "sage-femme", "sages-femmes" ],
         [ "scénariste" ],
         [ "secrétaire" ],
         [ "serveuse" ],
         [ "sociologue" ],
         [ "sorcière" ],
         [ "standardiste" ],
         [ "tatoueuse" ],
         [ "taxidermiste" ],
         [ "technicienne" ],
         [ "traductrice" ],
         [ "urbaniste" ],
         [ "urgentiste" ],
         [ "vendeuse" ],
         [ "vétérinaire" ],
         [ "viticultrice" ],
         [ "volcanologue" ],
         [ "xylophoniste" ],
         [ "zoologiste" ]
      ]
   },
   "animal": {
      "M": [ // [name,(plural)]
         [ "Agneau", "agneaux" ],
         [ "Aigle" ],
         [ "Albatros" ],
         [ "Alligator" ],
         [ "Anaconda" ],
         [ "Ane" ],
         [ "Babouin" ],
         [ "Bison" ],
         [ "Blaireau" ],
         [ "Boa" ],
         [ "Boeuf" ],
         [ "Bouquetin" ],
         [ "Buffle" ],
         [ "Cachalot" ],
         [ "Campagnol" ],
         [ "Canard" ],
         [ "Caribou" ],
         [ "Castor" ],
         [ "Cerf" ],
         [ "Chacal" ],
         [ "Chameau" ],
         [ "Chamois" ],
         [ "Chat" ],
         [ "Cheval", "chevaux" ],
         [ "Chevreuil" ],
         [ "Chien" ],
         [ "Chimpanzé" ],
         [ "Cochon" ],
         [ "Coq" ],
         [ "Coyote" ],
         [ "Crabe" ],
         [ "Crocodile" ],
         [ "Cygne" ],
         [ "Dauphin" ],
         [ "Dromadaire" ],
         [ "Ecureuil" ],
         [ "Eléphant" ],
         [ "Escargot" ],
         [ "Faisan" ],
         [ "Faucon" ],
         [ "Flamant rose", "Flamants roses" ],
         [ "Fourmilier" ],
         [ "Furet" ],
         [ "Gnou" ],
         [ "Gorille" ],
         [ "Grizzly" ],
         [ "Guépard" ],
         [ "Hamster" ],
         [ "Hérisson" ],
         [ "Héron" ],
         [ "Hibou", "Hiboux" ],
         [ "Hippocampe" ],
         [ "Hippopotame" ],
         [ "Iguane" ],
         [ "Jaguar" ],
         [ "Kangourou" ],
         [ "Koala" ],
         [ "Lapin" ],
         [ "Lémurien" ],
         [ "Léopard" ],
         [ "Lézard" ],
         [ "Lièvre" ],
         [ "Lion" ],
         [ "Loup" ],
         [ "Lynx", "Lynx" ],
         [ "Macaque" ],
         [ "Mammouth" ],
         [ "Manchot" ],
         [ "Marsouin" ],
         [ "Morse" ],
         [ "Mouflon" ],
         [ "Mouton" ],
         [ "Mulet" ],
         [ "Mulot" ],
         [ "Narval" ],
         [ "Ocelot" ],
         [ "Oppossum" ],
         [ "Orang-outan", "Orangs-outans" ],
         [ "Ornithorynque" ],
         [ "Ours", "Ours" ],
         [ "Panda" ],
         [ "Pangolin" ],
         [ "Paon" ],
         [ "Paresseux", "Paresseux" ],
         [ "Pélican" ],
         [ "Perroquet" ],
         [ "Phacochère" ],
         [ "Phoque" ],
         [ "Pingouin" ],
         [ "Poisson" ],
         [ "Poney" ],
         [ "Porc" ],
         [ "Porc-épic", "Porcs-epics" ],
         [ "Poulet" ],
         [ "Poulpe" ],
         [ "Poussin" ],
         [ "Puma" ],
         [ "Putois" ],
         [ "Python" ],
         [ "Ragondin" ],
         [ "Rat" ],
         [ "Raton laveur", "Ratons laveurs" ],
         [ "Renard" ],
         [ "Requin" ],
         [ "Rhinocéros", "Rhinocéros" ],
         [ "Sanglier" ],
         [ "Serpent" ],
         [ "Singe" ],
         [ "Tamanoir" ],
         [ "Toucan" ],
         [ "Taureau" ],
         [ "Tigre" ],
         [ "Vautour" ],
         [ "Veau" ],
         [ "Yack" ],
         [ "Zèbre" ]
      ],
      "F": [ // [name,(plural)]
         [ "Antilope" ],
         [ "Araignée" ],
         [ "Autruche" ],
         [ "Baleine" ],
         [ "Belette" ],
         [ "Biche" ],
         [ "Brebis" ],
         [ "Carpe" ],
         [ "Chauve-souris", "chauves-souris" ],
         [ "Chèvre" ],
         [ "Chouette" ],
         [ "Cigogne" ],
         [ "Coccinelle" ],
         [ "Dinde" ],
         [ "Fouine" ],
         [ "Gazelle" ],
         [ "Girafe" ],
         [ "Grenouille" ],
         [ "Grue" ],
         [ "Hirondelle" ],
         [ "Hyène" ],
         [ "Loutre" ],
         [ "Marmotte" ],
         [ "Mésange" ],
         [ "Mouette" ],
         [ "Musaraigne" ],
         [ "Oie" ],
         [ "Orque" ],
         [ "Otarie" ],
         [ "Panthère" ],
         [ "Pie" ],
         [ "Poule" ],
         [ "Souris", "Souris" ],
         [ "Taupe" ],
         [ "Tortue" ],
         [ "Vache" ],
         [ "Vipère" ]
      ]
   },
   "plant": {
      "M": [  // [name,(plural)]
         [ "abricotier" ],
         [ "acacia" ],
         [ "amandier" ],
         [ "arbousier" ],
         [ "aulne" ],
         [ "Bambou" ],
         [ "Bananier" ],
         [ "Baobab" ],
         [ "Bégonia" ],
         [ "Bleuet" ],
         [ "Bougainvillier" ],
         [ "Bouleau", "Bouleaux" ],
         [ "Cactus", "Cactus" ],
         [ "Camélia" ],
         [ "Cèdre" ],
         [ "Cerisier" ],
         [ "Chardon" ],
         [ "Châtaignier" ],
         [ "Chêne" ],
         [ "Chèvrefeuille" ],
         [ "Citronnier" ],
         [ "Coquelicot" ],
         [ "Cyprès", "Cyprès" ],
         [ "Edelweiss", "Edelweiss" ],
         [ "Erable" ],
         [ "Eucalyptus", "Eucalyptus" ],
         [ "Figuier" ],
         [ "Framboisier" ],
         [ "Géranium" ],
         [ "Groseiller" ],
         [ "Hêtre" ],
         [ "Hibiscus", "Hibiscus" ],
         [ "Hortensia" ],
         [ "Houx", "Houx" ],
         [ "If" ],
         [ "Jasmin" ],
         [ "Laurier" ],
         [ "Lilas" ],
         [ "Lotus" ],
         [ "Lys" ],
         [ "Magnolia" ],
         [ "Mandarinier" ],
         [ "Mimosa" ],
         [ "Murier" ],
         [ "Myosotis" ],
         [ "Nénuphar" ],
         [ "Noisetier" ],
         [ "Noyer" ],
         [ "Oranger" ],
         [ "Orme" ],
         [ "Palmier" ],
         [ "Peuplier" ],
         [ "Pin" ],
         [ "Pin parasol", "Pins parasols" ],
         [ "Pissenlit" ],
         [ "Platane" ],
         [ "Poirier" ],
         [ "Pommier" ],
         [ "Prunier" ],
         [ "Rhododendron" ],
         [ "Sapin" ],
         [ "Saule" ],
         [ "Saule pleureur", "Saules pleureurs" ],
         [ "Séquoia" ],
         [ "Tamaris" ],
         [ "Tilleul" ],
         [ "Tournesol" ],
         [ "Trêfle" ]
      ],
      "F": [  // [name,(plural)]
         [ "aubépine" ],
         [ "glycine" ],
         [ "Jonquille" ],
         [ "Lavande" ],
         [ "Liane" ],
         [ "Marguerite" ],
         [ "Orchidée" ],
         [ "Ortie" ],
         [ "Pâquerette" ],
         [ "Rose" ],
         [ "Tulipe" ],
         [ "Vigne" ],
         [ "Violette" ]
      ]
   },   
   "country": {
      "M": [   
         [ "Danemark" ],
         [ "Luxembourg" ],
         [ "Portugal" ]
      ],
      "F": [   // [name, gender]
         [ "Angleterre" ],
         [ "Autriche" ],
         [ "Belgique" ],
         [ "Bulgarie" ],
         [ "Croatie" ],
         [ "Tchéquie" ],
         [ "Estonie" ],
         [ "Finlande" ],
         [ "France" ],
         [ "Allemagne" ],
         [ "Grèce" ],
         [ "Hongrie" ],
         [ "Irlande" ],
         [ "Italie" ],
         [ "Lettonie" ],
         [ "Lituanie" ],
         [ "Norvège" ],
         [ "Pologne" ],
         [ "Roumanie" ],
         [ "Russie" ],
         [ "Serbie" ],
         [ "Slovaquie" ],
         [ "Slovénie" ],
         [ "Espagne" ],
         [ "Suède" ],
         [ "Suisse" ],
         [ "Europe" ],
         [ "Asie" ],
         [ "Afrique" ],
         [ "Amérique du nord" ],
         [ "Amérique du sud" ],
         [ "Amérique centrale" ],
         [ "Océanie" ]
      ]
   },
   "city": [
      [ "Amsterdam" ], 
      [ "Athènes" ],
      [ "Belgrade" ],
      [ "Berlin" ],
      [ "Bruxelles" ],
      [ "Bucarest" ],
      [ "Budapest" ],
      [ "Copenhague" ],
      [ "Dublin" ],
      [ "Helsinki" ],
      [ "Kiev" ],
      [ "Lisbonne" ],
      [ "Londres" ],
      [ "Madrid" ],
      [ "Monaco" ],
      [ "Moscou" ],
      [ "Oslo" ],
      [ "Paris" ],
      [ "Prague" ],
      [ "Reykjavik" ],
      [ "Rome" ],
      [ "Sarajevo" ],
      [ "Sofia" ],
      [ "Stockholm" ],
      [ "Varsovie" ],
      [ "Vienne" ],
      [ "Lyon" ],
      [ "Marseille" ],
      [ "Toulouse" ],
      [ "Bordeaux" ],
      [ "Brest" ]
   ]
};
const adjectiveTypes = ["before","after"];   // placé avant ou après le nom
const adjectives = { // [M-S,F-S]
   "before": [
      [ "abject", "e" ],
      [ "abominable", "" ],
      [ "abrupt", "e" ],
      [ "absurde", "" ],
      [ "accablant", "e" ],
      [ "acceuillant", "e" ],
      [ "actuel", "actuelle" ],
      [ "addictif", "addictive" ],
      [ "adipeux", "adipeuse" ],
      [ "adoucissant", "e" ],
      [ "absorbant", "e" ],
      [ "affaiblissant", "e" ],
      [ "affligeant", "e" ],
      [ "affolant", "e" ],
      [ "affreux", "affreuse" ],
      [ "agaçant", "e" ],
      [ "aggravant", "e" ],
      [ "agonisant", "e" ],
      [ "agréable", "" ],
      [ "ahurissant", "e" ],
      [ "aigre", "" ],
      [ "aimable", "" ],
      [ "alarmant", "e" ],
   ],
   "after": [
      [ "abject", "e" ],
      [ "abominable", "" ],
      [ "aborigène", "" ],
      [ "abrasif", "abrasive" ],
      [ "abrupt", "e" ],
      [ "absent", "e" ],
      [ "absorbant", "e" ],
      [ "abstrait", "e" ],
      [ "absurde", "" ],
      [ "accablant", "e" ],
      [ "accessoire", "" ],
      [ "accomodant", "e" ],
      [ "accompagné", "e" ],
      [ "accoudé", "e" ],
      [ "accroupi", "e" ],
      [ "acceuillant", "e" ],
      [ "accusateur", "accusatrice" ],
      [ "accusé", "e" ],
      [ "acéré", "e" ],
      [ "acharné", "e" ],
      [ "achevé", "e" ],
      [ "acide", "" ],
      [ "acidulé", "e" ],
      [ "acoustique", "" ],
      [ "acquis", "e" ],
      [ "acquitté", "e" ],
      [ "actif", "active" ],
      [ "actionné", "e" ],
      [ "activiste", "" ],
      [ "actuel", "actuelle" ],
      [ "adapté", "e" ],
      [ "addictif", "addictive" ],
      [ "adhésif", "adhésive" ],
      [ "adipeux", "adipeuse" ],
      [ "admis", "e" ],
      [ "admissible", "" ],
      [ "administratif", "administrative" ],
      [ "adolescent", "e" ],
      [ "adopté", "e" ],
      [ "adoré", "e" ],
      [ "adouci", "e" ],
      [ "adoucissant", "e" ],
      [ "adriatique", "" ],
      [ "absorbant", "e" ],
      [ "adulte", "" ],
      [ "aéré", "e" ],
      [ "aérodynamique", "" ],
      [ "aéronautique", "" ],
      [ "aérostatique", "" ],
      [ "affaibli", "e" ],
      [ "affaiblissant", "e" ],
      [ "affairé", "e" ],
      [ "affamé", "e" ],
      [ "affirmé", "e" ],
      [ "affligeant", "e" ],
      [ "affligé", "e" ],
      [ "affolant", "e" ],
      [ "affolé", "e" ],
      [ "affranchi", "e" ],
      [ "affreux", "affreuse" ],
      [ "affûté", "e" ],
      [ "africain", "e" ],
      [ "agaçant", "e" ],
      [ "agacé", "e" ],
      [ "agenouillé", "e" ],
      [ "aggloméré", "e" ],
      [ "agglutiné", "e" ],
      [ "aggravant", "e" ],
      [ "aggravé", "e" ],
      [ "agité", "e" ],
      [ "agnostique", "" ],
      [ "agonisant", "e" ],
      [ "agréable", "" ],
      [ "agrégé", "e" ],
      [ "agricole", "" ],
      [ "aguerri", "e" ],
      [ "ahuri", "e" ],
      [ "ahurissant", "e" ],
      [ "aigre", "" ],
      [ "aigri", "e" ],
      [ "aigu", "aigüe" ],
      [ "aiguisé", "e" ],
      [ "ailé", "e" ],
      [ "aimable", "" ],
      [ "aimanté", "e" ],
      [ "ajusté", "e" ],
      [ "alambiqué", "e" ],
      [ "alarmant", "e" ],
      [ "alarmé", "e" ],
      [ "albanais", "e" ],
      [ "albinos", "" ],
      [ "alcoolique", "" ],
      [ "alcoolisé", "e" ],
      [ "alité", "e" ],
      [ "allemand", "e" ],
      [ "allongé", "e" ],
      [ "alourdi", "e" ],
   ]
}; 
   
const auxiliaryVerbs = ["avoir","être","both"];
const verbTypes = ["intransitive","transitive","modal"];
const verbs = {
   "intransitive": [ // [verb, group, auxiliary, complement, (radical)]
      [ "abandonner", 1, 0 ],
      [ "abdiquer", 1, 0 ],
      [ "aboyer", 1, 0 ],
      [ "accélérer", 1, 0 ],
      [ "acquiescer", 1, 0 ],
      [ "affabuler", 1, 0 ],
      [ "affluer", 1, 0 ],
      [ "agoniser", 1, 0 ],
      [ "angoisser", 1, 0 ],
      [ "anticiper", 1, 0 ],
      [ "appuyer", 1, 0 ],
      [ "argumenter", 1, 0 ],
      [ "arrêter", 1, 0 ],
      [ "arriver", 1, 1 ],
      [ "articuler", 1, 0 ],
      [ "assumer", 1, 0 ],
      [ "atterrir", 2, 2, "" ],
      [ "avancer", 1, 0 ],
      [ "bâiller", 1, 0 ],
      [ "baragouiner", 1, 0 ],
      [ "barouder", 1, 0 ],
      [ "basculer", 1, 0 ],
      [ "batailler", 1, 0 ],
      [ "batifoler", 1, 0 ],
      [ "baver", 1, 0 ],
      [ "bavarder", 1, 0 ],
      [ "bégayer", 1, 0 ],
      [ "bêler", 1, 0 ],
      [ "beugler", 1, 0 ],
      [ "bifurquer", 1, 0 ],
      [ "bivouaquer", 1, 0 ],
      [ "boiter", 1, 0 ],
      [ "boitiller", 1, 0 ],
      [ "bondir", 2, 0, "" ],
      [ "bouder", 1, 0 ],
      [ "bouffer", 1, 0 ],
      [ "bouger", 1, 0 ],
      [ "bouillonner", 1, 0 ],
      [ "bouquiner", 1, 0 ],
      [ "bourgeonner", 1, 0 ],
      [ "boxer", 1, 0 ],
      [ "braconner", 1, 0 ],
      [ "brailler", 1, 0 ],
      [ "bramer", 1, 0 ],
      [ "bredouiller", 1, 0 ],
      [ "bricoler", 1, 0 ],
      [ "briller", 1, 0 ],
      [ "broder", 1, 0 ],
      [ "bronzer", 1, 0 ],
      [ "broquanter", 1, 0 ],
      [ "brosser", 1, 0 ],
      [ "brouter", 1, 0 ],
      [ "brûler", 1, 0 ],
      [ "butiner", 1, 0 ],
      [ "céder", 1, 0 ],
      [ "cabotiner", 1, 0 ],
      [ "cafouiller", 1, 0 ],
      [ "calculer", 1, 0 ],
      [ "camper", 1, 0 ],
      [ "canarder", 1, 0 ],
      [ "canoter", 1, 0 ],
      [ "capitaliser", 1, 0 ],
      [ "capituler", 1, 0 ],
      [ "caraméliser", 1, 0 ],
      [ "cartonner", 1, 0 ],
      [ "cauchemarder", 1, 0 ],
      [ "causer", 1, 0 ],
      [ "cavaler", 1, 0 ],
      [ "cesser", 1, 0 ],
      [ "chahuter", 1, 0 ],
      [ "changer", 1, 0 ],
      [ "chanceler", 1, 0 ],
      [ "chanter", 1, 0 ],
      [ "chantonner", 1, 0 ],
      [ "chaparder", 1, 0 ],
      [ "chasser", 1, 0 ],
      [ "chatoyer", 1, 0 ],
      [ "chauffer", 1, 0 ],
      [ "chavirer", 1, 0 ],
      [ "cheminer", 1, 0 ],
      [ "chercher", 1, 0 ],
      [ "chevaucher", 1, 0 ],
      [ "chiffrer", 1, 0 ],
      [ "chipoter", 1, 0 ],
      [ "chorégraphier", 1, 0 ],
      [ "chroniquer", 1, 0 ],
      [ "chuchoter", 1, 0 ],
      [ "chuter", 1, 0 ],
      [ "cicatriser", 1, 0 ],
      [ "circuler", 1, 0 ],
      [ "claironner", 1, 0 ],
      [ "claudiquer", 1, 0 ],
      [ "clignoter", 1, 0 ],
      [ "clopiner", 1, 0 ],
      [ "coasser", 1, 0 ],
      [ "coder", 1, 0 ],
      [ "coexister", 1, 0 ],
      [ "cogiter", 1, 0 ],
      [ "cohabiter", 1, 0 ],
      [ "collaborer", 1, 0 ],
      [ "commander", 1, 0 ],
      [ "commencer", 1, 0 ],
      [ "commercer", 1, 0 ],
      [ "communiquer", 1, 0 ],
      [ "composer", 1, 0 ],
      [ "compter", 1, 0 ],
      [ "consommer", 1, 0 ],
      [ "conspirer", 1, 0 ],
      [ "continuer", 1, 0 ],
      [ "contre-attaquer", 1, 0 ],
      [ "converger", 1, 0 ],
      [ "converser", 1, 0 ],
      [ "coopérer", 1, 0 ],
      [ "cotiser", 1, 0 ],
      [ "couler", 1, 0 ],
      [ "crier", 1, 0 ],
      [ "cracher", 1, 0 ],
      [ "crapahuter", 1, 0 ],
      [ "craquer", 1, 0 ],
      [ "crépiter", 1, 0 ],
      [ "creuser", 1, 0 ],
      [ "cristalliser", 1, 0 ],
      [ "croasser", 1, 0 ],
      [ "croustiller", 1, 0 ],
      [ "cuisiner", 1, 0 ],
      [ "culpabiliser", 1, 0 ],
      [ "danser", 1, 0 ],
      [ "déambuler", 1, 0 ],
      [ "débarquer", 1, 0 ],
      [ "débouler", 1, 0 ],
      [ "débuter", 1, 0 ],
      [ "décamper", 1, 0 ],
      [ "déchanter", 1, 0 ],
      [ "déchiffrer", 1, 0 ],
      [ "décliner", 1, 0 ],
      [ "décoller", 1, 0 ],
      [ "décompresser", 1, 0 ],
      [ "dédramatiser", 1, 0 ],
      [ "déferler", 1, 0 ],
      [ "défiler", 1, 0 ],
      [ "dégénérer", 1, 0 ],
      [ "dégouliner", 1, 0 ],
      [ "dégringoler", 1, 0 ],
      [ "déjeuner", 1, 0 ],
      [ "délirer", 1, 0 ],
      [ "démarrer", 1, 0 ],
      [ "déménager", 1, 0 ],
      [ "démissionner", 1, 0 ],
      [ "déprimer", 1, 0 ],
      [ "dérailler", 1, 0 ],
      [ "déraisonner", 1, 0 ],
      [ "déraper", 1, 0 ],
      [ "dériver", 1, 0 ],
      [ "désapprouver", 1, 0 ],
      [ "déserter", 1, 0 ],
      [ "détaler", 1, 0 ],
      [ "dévier", 1, 0 ],
      [ "dialoguer", 1, 0 ],
      [ "digérer", 1, 0 ],
      [ "dîner", 1, 0 ],
      [ "discuter", 1, 0 ],
      [ "disjoncter", 1, 0 ],
      [ "divaguer", 1, 0 ],
      [ "diverger", 1, 0 ],
      [ "divorcer", 1, 0 ],
      [ "dominer", 1, 0 ],
      [ "douter", 1, 0 ],
      [ "dramatiser", 1, 0 ],
      [ "durer", 1, 0 ],
      [ "échouer", 1, 0 ],
      [ "éclairer", 1, 0 ],
      [ "économiser", 1, 0 ],
      [ "écouter", 1, 0 ],
      [ "émerger", 1, 0 ],
      [ "émigrer", 1, 0 ],
      [ "emménager", 1, 0 ],
      [ "empester", 1, 0 ],
      [ "enfler", 1, 0 ],
      [ "enquêter", 1, 0 ],
      [ "enrager", 1, 0 ],
      [ "entrer", 1, 1 ],
      [ "errer", 1, 0 ],
      [ "éructer", 1, 0 ],
      [ "espérer", 1, 0 ],
      [ "éternuer", 1, 0 ],
      [ "étudier", 1, 0 ],
      [ "évoluer", 1, 0 ],
      [ "exagérer", 1, 0 ],
      [ "exister", 1, 0 ],
      [ "expérimenter", 1, 0 ],
      [ "expirer", 1, 0 ],
      [ "exploser", 1, 0 ],
      [ "extrapoler", 1, 0 ],
      [ "exulter", 1, 0 ],
      [ "fanfaronner", 1, 0 ],
      [ "fatiguer", 1, 0 ],
      [ "feinter", 1, 0 ],
      [ "fermenter", 1, 0 ],
      [ "festoyer", 1, 0 ],
      [ "filmer", 1, 0 ],
      [ "flamber", 1, 0 ],
      [ "flamboyer", 1, 0 ],
      [ "flâner", 1, 0 ],
      [ "flancher", 1, 0 ],
      [ "flotter", 1, 0 ],
      [ "fluctuer", 1, 0 ],
      [ "foisonner", 1, 0 ],
      [ "foncer", 1, 0 ],
      [ "fonctionner", 1, 0 ],
      [ "fraterniser", 1, 0 ],
      [ "frauder", 1, 0 ],
      [ "freiner", 1, 0 ],
      [ "frimer", 1, 0 ],
      [ "frissonner", 1, 0 ],
      [ "fusionner", 1, 0 ],
      [ "gagner", 1, 0 ],
      [ "galérer", 1, 0 ],
      [ "galoper", 1, 0 ],
      [ "gambader", 1, 0 ],
      [ "geler", 1, 0 ],
      [ "gesticuler", 1, 0 ],
      [ "gigoter", 1, 0 ],
      [ "glisser", 1, 0 ],
      [ "glousser", 1, 0 ],
      [ "gouverner", 1, 0 ],
      [ "grelotter", 1, 0 ],
      [ "gribouiller", 1, 0 ],
      [ "grimacer", 1, 0 ],
      [ "grimper", 1, 0 ],
      [ "grincer", 1, 0 ],
      [ "grogner", 1, 0 ],
      [ "gronder", 1, 0 ],
      [ "guerroyer", 1, 0 ],
      [ "guetter", 1, 0 ],
      [ "hériter", 1, 0 ],
      [ "hésiter", 1, 0 ],
      [ "hiberner", 1, 0 ],
      [ "hululer", 1, 0 ],
      [ "hurler", 1, 0 ],
      [ "immigrer", 1, 0 ],
      [ "imploser", 1, 0 ],
      [ "improviser", 1, 0 ],
      [ "insister", 1, 0 ],
      [ "interférer", 1, 0 ],
      [ "ironiser", 1, 0 ],
      [ "jacasser", 1, 0 ],
      [ "jardiner", 1, 0 ],
      [ "jongler", 1, 0 ],
      [ "jouer", 1, 0 ],
      [ "klaxonner", 1, 0 ],
      [ "légiférer", 1, 0 ],
      [ "léviter", 1, 0 ],
      [ "loucher", 1, 0 ],
      [ "louvoyer", 1, 0 ],
      [ "lutter", 1, 0 ],
      [ "manifester", 1, 0 ],
      [ "manoeuvrer", 1, 0 ],
      [ "marcher", 1, 0 ],
      [ "marchander", 1, 0 ],
      [ "mastiquer", 1, 0 ],
      [ "maugréer", 1, 0 ],
      [ "méditer", 1, 0 ],
      [ "mémoriser", 1, 0 ],
      [ "mendier", 1, 0 ],
      [ "meugler", 1, 0 ],
      [ "miauler", 1, 0 ],
      [ "migrer", 1, 0 ],
      [ "miroiter", 1, 0 ],
      [ "monter", 1, 0 ],
      [ "muer", 1, 0 ],
      [ "murmurer", 1, 0 ],
      [ "nier", 1, 0 ],
      [ "nager", 1, 0 ],
      [ "naviguer", 1, 0 ],
      [ "négocier", 1, 0 ],
      [ "obliquer", 1, 0 ],
      [ "ondoyer", 1, 0 ],
      [ "onduler", 1, 0 ],
      [ "opiner", 1, 0 ],
      [ "osciller", 1, 0 ],
      [ "oublier", 1, 0 ],
      [ "palpiter", 1, 0 ],
      [ "paniquer", 1, 0 ],
      [ "papoter", 1, 0 ],
      [ "pardonner", 1, 0 ],
      [ "parier", 1, 0 ],
      [ "paresser", 1, 0 ],
      [ "parler", 1, 0 ],
      [ "patauger", 1, 0 ],
      [ "patienter", 1, 0 ],
      [ "patrouiller", 1, 0 ],
      [ "payer", 1, 0 ],
      [ "pêcher", 1, 0 ],
      [ "pédaler", 1, 0 ],
      [ "peiner", 1, 0 ],
      [ "penser", 1, 0 ],
      [ "perdurer", 1, 0 ],
      [ "persévérer", 1, 0 ],
      [ "persister", 1, 0 ],
      [ "philosopher", 1, 0 ],
      [ "piocher", 1, 0 ],
      [ "pique-niquer", 1, 0 ],
      [ "pivoter", 1, 0 ],
      [ "plier", 1, 0 ],
      [ "plaisanter", 1, 0 ],
      [ "pleurer", 1, 0 ],
      [ "pleurnicher", 1, 0 ],
      [ "plonger", 1, 0 ],
      [ "polémiquer", 1, 0 ],
      [ "polluer", 1, 0 ],
      [ "positiver", 1, 0 ],
      [ "postuler", 1, 0 ],
      [ "pouffer", 1, 0 ],
      [ "prier", 1, 0 ],
      [ "proliférer", 1, 0 ],
      [ "prospérer", 1, 0 ],
      [ "protester", 1, 0 ],
      [ "pulluler", 1, 0 ],
      [ "régner", 1, 0 ],
      [ "raccrocher", 1, 0 ],
      [ "radoter", 1, 0 ],
      [ "raisonner", 1, 0 ],
      [ "ramer", 1, 0 ],
      [ "ramper", 1, 0 ],
      [ "randonner", 1, 0 ],
      [ "rapetisser", 1, 0 ],
      [ "rayonner", 1, 0 ],
      [ "rechuter", 1, 0 ],
      [ "récidiver", 1, 0 ],
      [ "recommencer", 1, 0 ],
      [ "reculer", 1, 0 ],
      [ "redémarrer", 1, 0 ],
      [ "refuser", 1, 0 ],
      [ "regarder", 1, 0 ],
      [ "régresser", 1, 0 ],
      [ "rejouer", 1, 0 ],
      [ "remuer", 1, 0 ],
      [ "rentrer", 1, 1 ],
      [ "respirer", 1, 0 ],
      [ "ressusciter", 1, 0 ],
      [ "rester", 1, 0 ],
      [ "rêver", 1, 0 ],
      [ "rêvasser", 1, 0 ],
      [ "réviser", 1, 0 ],
      [ "ricaner", 1, 0 ],
      [ "rigoler", 1, 0 ],
      [ "riposter", 1, 0 ],
      [ "rôder", 1, 0 ],
      [ "ronronner", 1, 0 ],
      [ "roucouler", 1, 0 ],
      [ "rougeoyer", 1, 0 ],
      [ "rouler", 1, 0 ],
      [ "rouspéter", 1, 0 ],
      [ "ruminer", 1, 0 ],
      [ "ruser", 1, 0 ],
      [ "saliver", 1, 0 ],
      [ "sangloter", 1, 0 ],
      [ "saturer", 1, 0 ],
      [ "sauter", 1, 0 ],
      [ "sautiller", 1, 0 ],
      [ "scier", 1, 0 ],
      [ "scintiller", 1, 0 ],
      [ "sculpter", 1, 0 ],
      [ "serpenter", 1, 0 ],
      [ "sécher", 1, 0 ],
      [ "siffler", 1, 0 ],
      [ "siffloter", 1, 0 ],
      [ "signer", 1, 0 ],
      [ "simplifier", 1, 0 ],
      [ "skier", 1, 0 ],
      [ "slalomer", 1, 0 ],
      [ "soigner", 1, 0 ],
      [ "soliloquer", 1, 0 ],
      [ "somnoler", 1, 0 ],
      [ "songer", 1, 0 ],
      [ "souffler", 1, 0 ],
      [ "souper", 1, 0 ],
      [ "soupirer", 1, 0 ],
      [ "spéculer", 1, 0 ],
      [ "sprinter", 1, 0 ],
      [ "stagner", 1, 0 ],
      [ "stresser", 1, 0 ],
      [ "striduler", 1, 0 ],
      [ "suer", 1, 0 ],
      [ "subsister", 1, 0 ],
      [ "succomber", 1, 0 ],
      [ "suffoquer", 1, 0 ],
      [ "surnager", 1, 0 ],
      [ "sursauter", 1, 0 ],
      [ "sympathiser", 1, 0 ],
      [ "tambouriner", 1, 0 ],
      [ "tarder", 1, 0 ],
      [ "tâtonner", 1, 0 ],
      [ "téléphoner", 1, 0 ],
      [ "tergiverser", 1, 0 ],
      [ "théoriser", 1, 0 ],
      [ "tintinnabuler", 1, 0 ],
      [ "tituber", 1, 0 ],
      [ "tomber", 1, 0 ],
      [ "tourbillonner", 1, 0 ],
      [ "tourner", 1, 0 ],
      [ "tournoyer", 1, 0 ],
      [ "tousser", 1, 0 ],
      [ "traficoter", 1, 0 ],
      [ "traîner", 1, 0 ],
      [ "traînasser", 1, 0 ],
      [ "transpirer", 1, 0 ],
      [ "travailler", 1, 0 ],
      [ "trébucher", 1, 0 ],
      [ "trembler", 1, 0 ],
      [ "trépigner", 1, 0 ],
      [ "tricher", 1, 0 ],
      [ "tricoter", 1, 0 ],
      [ "triompher", 1, 0 ],
      [ "trôner", 1, 0 ],
      [ "trotter", 1, 0 ],
      [ "trottiner", 1, 0 ],
      [ "vaciller", 1, 0 ],
      [ "vagabonder", 1, 0 ],
      [ "varier", 1, 0 ],
      [ "végéter", 1, 0 ],
      [ "veiller", 1, 0 ],
      [ "verbaliser", 1, 0 ],
      [ "verdoyer", 1, 0 ],
      [ "versifier", 1, 0 ],
      [ "vibrer", 1, 0 ],
      [ "virevolter", 1, 0 ],
      [ "vociférer", 1, 0 ],
      [ "voguer", 1, 0 ],
      [ "voler", 1, 0 ],
      [ "voltiger", 1, 0 ],
      [ "voter", 1, 0 ],
      [ "voyager", 1, 0 ],
      [ "zigzaguer", 1, 0 ]
   ],
   "transitive": [   // [verb, group, auxiliary, complement]
      [ "abandonner", 1, 0 ],
      [ "abîmer", 1, 0 ],
      [ "aborder", 1, 0 ],
      [ "abreuver", 1, 0 ],
      [ "abriter", 1, 0 ],
      [ "absorber", 1, 0 ],
      [ "accabler", 1, 0 ],
      [ "accélérer", 1, 0 ],
      [ "accentuer", 1, 0 ],
      [ "accepter", 1, 0 ],
      [ "acclamer", 1, 0 ],
      [ "acclimater", 1, 0 ],
      [ "accompagner", 1, 0 ],
      [ "accrocher", 1, 0 ],
      [ "accumuler", 1, 0 ],
      [ "accuser", 1, 0 ],
      [ "acheter", 1, 0 ],
      [ "acidifier", 1, 0 ],
      [ "aciduler", 1, 0 ],
      [ "actionner", 1, 0 ],
      [ "activer", 1, 0 ],
      [ "actualiser", 1, 0 ],
      [ "adapter", 1, 0 ],
      [ "administrer", 1, 0 ],
      [ "admirer", 1, 0 ],
      [ "adorer", 1, 0 ],
      [ "aduler", 1, 0 ],
      [ "aérer", 1, 0 ],
      [ "affamer", 1, 0 ],
      [ "afficher", 1, 0 ],
      [ "affoler", 1, 0 ],
      [ "affronter", 1, 0 ],
      [ "agacer", 1, 0 ],
      [ "aglutiner", 1, 0 ],
      [ "agripper", 1, 0 ],
      [ "aider", 1, 0 ],
      [ "aimer", 1, 0 ],
      [ "aimanter", 1, 0 ],
      [ "alerter", 1, 0 ],
      [ "aligner", 1, 0 ],
      [ "allonger", 1, 0 ],
      [ "allumer", 1, 0 ],
      [ "amener", 1, 0 ],
      [ "amarrer", 1, 0 ],
      [ "amasser", 1, 0 ],
      [ "améliorer", 1, 0 ],
      [ "aménager", 1, 0 ],
      [ "amuser", 1, 0 ],
      [ "analyser", 1, 0 ],
      [ "anesthésier", 1, 0 ],
      [ "animer", 1, 0 ],
      [ "annihiler", 1, 0 ],
      [ "annuler", 1, 0 ],
      [ "anticiper", 1, 0 ],
      [ "apaiser", 1, 0 ],
      [ "apostropher", 1, 0 ],
      [ "appeler", 1, 0 ],
      [ "apporter", 1, 0 ],
      [ "apprécier", 1, 0 ],
      [ "apprivoiser", 1, 0 ],
      [ "approuver", 1, 0 ],
      [ "archiver", 1, 0 ],
      [ "arnaquer", 1, 0 ],
      [ "aromatiser", 1, 0 ],
      [ "arranger", 1, 0 ],
      [ "arrêter", 1, 0 ],
      [ "arrimer", 1, 0 ],
      [ "arroser", 1, 0 ],
      [ "aseptiser", 1, 0 ],
      [ "aspirer", 1, 0 ],
      [ "assaisonner", 1, 0 ],
      [ "assommer", 1, 0 ],
      [ "asticoter", 1, 0 ],
      [ "atomiser", 1, 0 ],
      [ "attaquer", 1, 0 ],
      [ "attraper", 1, 0 ],
      [ "ausculter", 1, 0 ],
      [ "automatiser", 1, 0 ],
      [ "avaler", 1, 0 ],
      [ "bafouer", 1, 0 ],
      [ "balancer", 1, 0 ],
      [ "baliser", 1, 0 ],
      [ "balkaniser", 1, 0 ],
      [ "balloter", 1, 0 ],
      [ "banaliser", 1, 0 ],
      [ "baptiser", 1, 0 ],
      [ "baratiner", 1, 0 ],
      [ "barricader", 1, 0 ],
      [ "bazarder", 1, 0 ],
      [ "bercer", 1, 0 ],
      [ "berner", 1, 0 ],
      [ "bétonner", 1, 0 ],
      [ "blâmer", 1, 0 ],
      [ "blesser", 1, 0 ],
      [ "bloquer", 1, 0 ],
      [ "boiser", 1, 0 ],
      [ "bombarder", 1, 0 ],
      [ "border", 1, 0 ],
      [ "bosseler", 1, 0 ],
      [ "boucher", 1, 0 ],
      [ "bouger", 1, 0 ],
      [ "bouder", 1, 0 ],
      [ "bouleverser", 1, 0 ],
      [ "bousculer", 1, 0 ],
      [ "boxer", 1, 0 ],
      [ "boycotter", 1, 0 ],
      [ "braver", 1, 0 ],
      [ "bricoler", 1, 0 ],
      [ "brimer", 1, 0 ],
      [ "briser", 1, 0 ],
      [ "broyer", 1, 0 ],
      [ "brosser", 1, 0 ],
      [ "brouter", 1, 0 ],
      [ "brûler", 1, 0 ],
      [ "brusquer", 1, 0 ],
      [ "butiner", 1, 0 ],
      [ "cacher", 1, 0 ],
      [ "cadenasser", 1, 0 ],
      [ "cajoler", 1, 0 ],
      [ "caler", 1, 0 ],
      [ "calciner", 1, 0 ],
      [ "calfeutrer", 1, 0 ],
      [ "calibrer", 1, 0 ],
      [ "calmer", 1, 0 ],
      [ "cambrioler", 1, 0 ],
      [ "camoufler", 1, 0 ],
      [ "canaliser", 1, 0 ],
      [ "canarder", 1, 0 ],
      [ "capter", 1, 0 ],
      [ "captiver", 1, 0 ],
      [ "capturer", 1, 0 ],
      [ "carboniser", 1, 0 ],
      [ "caresser", 1, 0 ],
      [ "caricaturer", 1, 0 ],
      [ "casser", 1, 0 ],
      [ "cataloguer", 1, 0 ],
      [ "catapulter", 1, 0 ],
      [ "cautionner", 1, 0 ],
      [ "célébrer", 1, 0 ],
      [ "censurer", 1, 0 ],
      [ "centraliser", 1, 0 ],
      [ "centrer", 1, 0 ],
      [ "centrifuger", 1, 0 ],
      [ "chagriner", 1, 0 ],
      [ "chahuter", 1, 0 ],
      [ "chambouler", 1, 0 ],
      [ "changer", 1, 0 ],
      [ "chanter", 1, 0 ],
      [ "chaparder", 1, 0 ],
      [ "charger", 1, 0 ],
      [ "charmer", 1, 0 ],
      [ "chasser", 1, 0 ],
      [ "châtier", 1, 0 ],
      [ "chatouiller", 1, 0 ],
      [ "chauffer", 1, 0 ],
      [ "chercher", 1, 0 ],
      [ "chevaucher", 1, 0 ],
      [ "chiffonner", 1, 0 ],
      [ "chiffrer", 1, 0 ],
      [ "choquer", 1, 0 ],
      [ "chorégraphier", 1, 0 ],
      [ "chronométrer", 1, 0 ],
      [ "cibler", 1, 0 ],
      [ "cimenter", 1, 0 ],
      [ "cirer", 1, 0 ],
      [ "cisailler", 1, 0 ],
      [ "civiliser", 1, 0 ],
      [ "clarifier", 1, 0 ],
      [ "classer", 1, 0 ],
      [ "climatiser", 1, 0 ],
      [ "cloisonner", 1, 0 ],
      [ "clôturer", 1, 0 ],
      [ "clouer", 1, 0 ],
      [ "clouter", 1, 0 ],
      [ "coder", 1, 0 ],
      [ "coiffer", 1, 0 ],
      [ "coincer", 1, 0 ],
      [ "coller", 1, 0 ],
      [ "collecter", 1, 0 ],
      [ "collectionner", 1, 0 ],
      [ "colmater", 1, 0 ],
      [ "coloniser", 1, 0 ],
      [ "colorer", 1, 0 ],
      [ "colorier", 1, 0 ],
      [ "combler", 1, 0 ],
      [ "commander", 1, 0 ],
      [ "commémorer", 1, 0 ],
      [ "commercialiser", 1, 0 ],
      [ "compacter", 1, 0 ],
      [ "comparer", 1, 0 ],
      [ "compartimenter", 1, 0 ],
      [ "compléter", 1, 0 ],
      [ "complexifier", 1, 0 ],
      [ "complimenter", 1, 0 ],
      [ "compliquer", 1, 0 ],
      [ "compresser", 1, 0 ],
      [ "comprimer", 1, 0 ],
      [ "compter", 1, 0 ],
      [ "concurrencer", 1, 0 ],
      [ "condamner", 1, 0 ],
      [ "condenser", 1, 0 ],
      [ "configurer", 1, 0 ],
      [ "confronter", 1, 0 ],
      [ "congeler", 1, 0 ],
      [ "congédier", 1, 0 ],
      [ "congratuler", 1, 0 ],
      [ "connecter", 1, 0 ],
      [ "conserver", 1, 0 ],
      [ "considérer", 1, 0 ],
      [ "consoler", 1, 0 ],
      [ "consolider", 1, 0 ],
      [ "consommer", 1, 0 ],
      [ "consterner", 1, 0 ],
      [ "constituer", 1, 0 ],
      [ "consulter", 1, 0 ],
      [ "consumer", 1, 0 ],
      [ "contacter", 1, 0 ],
      [ "contaminer", 1, 0 ],
      [ "contempler", 1, 0 ],
      [ "contester", 1, 0 ],
      [ "contourner", 1, 0 ],
      [ "contrarier", 1, 0 ],
      [ "contrebalancer", 1, 0 ],
      [ "contrecarrer", 1, 0 ],
      [ "contrôler", 1, 0 ],
      [ "convoiter", 1, 0 ],
      [ "convoquer", 1, 0 ],
      [ "coordonner", 1, 0 ],
      [ "copier", 1, 0 ],
      [ "corriger", 1, 0 ],
      [ "côtoyer", 1, 0 ],
      [ "coucher", 1, 0 ],
      [ "couler", 1, 0 ],
      [ "couper", 1, 0 ],
      [ "courber", 1, 0 ],
      [ "courser", 1, 0 ],
      [ "courtiser", 1, 0 ],
      [ "couver", 1, 0 ],
      [ "créer", 1, 0 ],
      [ "critiquer", 1, 0 ],
      [ "croiser", 1, 0 ],
      [ "crypter", 1, 0 ],
      [ "cryptographier", 1, 0 ],
      [ "cuisiner", 1, 0 ],
      [ "culpabiliser", 1, 0 ],
      [ "cultiver", 1, 0 ],
      [ "damner", 1, 0 ],
      [ "débanaliser", 1, 0 ],
      [ "débaptiser", 1, 0 ],
      [ "débarbouiller", 1, 0 ],
      [ "débloquer", 1, 0 ],
      [ "déboiser", 1, 0 ],
      [ "déboucher", 1, 0 ],
      [ "déboussoler", 1, 0 ],
      [ "débrancher", 1, 0 ],
      [ "débroussailler", 1, 0 ],
      [ "débusquer", 1, 0 ],
      [ "décaler", 1, 0 ],
      [ "décaper", 1, 0 ],
      [ "décapiter", 1, 0 ],
      [ "décapsuler", 1, 0 ],
      [ "décentrer", 1, 0 ],
      [ "décentraliser", 1, 0 ],
      [ "déchaîner", 1, 0 ],
      [ "décharger", 1, 0 ],
      [ "déchausser", 1, 0 ],
      [ "déchiffrer", 1, 0 ],
      [ "déchiqueter", 1, 0 ],
      [ "déchirer", 1, 0 ],
      [ "décimer", 1, 0 ],
      [ "décliner", 1, 0 ],
      [ "décoder", 1, 0 ],
      [ "décoiffer", 1, 0 ],
      [ "décoincer", 1, 0 ],
      [ "décoller", 1, 0 ],
      [ "décoloniser", 1, 0 ],
      [ "décolorer", 1, 0 ],
      [ "décomposer", 1, 0 ],
      [ "décompresser", 1, 0 ],
      [ "décomprimer", 1, 0 ],
      [ "déconditionner", 1, 0 ],
      [ "décongeler", 1, 0 ],
      [ "déconnecter", 1, 0 ],
      [ "déconsidérer", 1, 0 ],
      [ "décontaminer", 1, 0 ],
      [ "décontenancer", 1, 0 ],
      [ "décontracter", 1, 0 ],
      [ "décorer", 1, 0 ],
      [ "découper", 1, 0 ],
      [ "décourager", 1, 0 ],
      [ "décrier", 1, 0 ],
      [ "décrasser", 1, 0 ],
      [ "décriminaliser", 1, 0 ],
      [ "décrisper", 1, 0 ],
      [ "décrocher", 1, 0 ],
      [ "décrypter", 1, 0 ],
      [ "déculpabiliser", 1, 0 ],
      [ "dédaigner", 1, 0 ],
      [ "dédommager", 1, 0 ],
      [ "défier", 1, 0 ],
      [ "défavoriser", 1, 0 ],
      [ "défenestrer", 1, 0 ],
      [ "défiscaliser", 1, 0 ],
      [ "défoncer", 1, 0 ],
      [ "défricher", 1, 0 ],
      [ "dégeler", 1, 0 ],
      [ "dégivrer", 1, 0 ],
      [ "dégonfler", 1, 0 ],
      [ "dégoûter", 1, 0 ],
      [ "dégraisser", 1, 0 ],
      [ "déguiser", 1, 0 ],
      [ "déguster", 1, 0 ],
      [ "délaisser", 1, 0 ],
      [ "délimiter", 1, 0 ],
      [ "délivrer", 1, 0 ],
      [ "démagnétiser", 1, 0 ],
      [ "démasquer", 1, 0 ],
      [ "dématérialiser", 1, 0 ],
      [ "démilitariser", 1, 0 ],
      [ "déminer", 1, 0 ],
      [ "démocratiser", 1, 0 ],
      [ "démonter", 1, 0 ],
      [ "démoraliser", 1, 0 ],
      [ "démotiver", 1, 0 ],
      [ "démystifier", 1, 0 ],
      [ "dénaturer", 1, 0 ],
      [ "déneiger", 1, 0 ],
      [ "dénigrer", 1, 0 ],
      [ "dénucléariser", 1, 0 ],
      [ "dépanner", 1, 0 ],
      [ "déparasiter", 1, 0 ],
      [ "départager", 1, 0 ],
      [ "dépayser", 1, 0 ],
      [ "déplacer", 1, 0 ],
      [ "déplorer", 1, 0 ],
      [ "dépolariser", 1, 0 ],
      [ "déposer", 1, 0 ],
      [ "déprimer", 1, 0 ],
      [ "déprogrammer", 1, 0 ],
      [ "dérégler", 1, 0 ],
      [ "déraciner", 1, 0 ],
      [ "déranger", 1, 0 ],
      [ "dératiser", 1, 0 ],
      [ "déresponsabiliser", 1, 0 ],
      [ "dérouter", 1, 0 ],
      [ "désabonner", 1, 0 ],
      [ "désaccorder", 1, 0 ],
      [ "désagréger", 1, 0 ],
      [ "désaligner", 1, 0 ],
      [ "désamorcer", 1, 0 ],
      [ "désapprouver", 1, 0 ],
      [ "désarçonner", 1, 0 ],
      [ "désarmer", 1, 0 ],
      [ "désarticuler", 1, 0 ],
      [ "désavantager", 1, 0 ],
      [ "désemparer", 1, 0 ],
      [ "désenchanter", 1, 0 ],
      [ "désengorger", 1, 0 ],
      [ "désennuyer", 1, 0 ],
      [ "désensorceler", 1, 0 ],
      [ "désenvoûter", 1, 0 ],
      [ "déséquilibrer", 1, 0 ],
      [ "déserter", 1, 0 ],
      [ "déshonorer", 1, 0 ],
      [ "déshydrater", 1, 0 ],
      [ "désinfecter", 1, 0 ],
      [ "désinformer", 1, 0 ],
      [ "désintégrer", 1, 0 ],
      [ "désodoriser", 1, 0 ],
      [ "désordonner", 1, 0 ],
      [ "désorienter", 1, 0 ],
      [ "désorganiser", 1, 0 ],
      [ "dessécher", 1, 0 ],
      [ "dessiner", 1, 0 ],
      [ "déstabiliser", 1, 0 ],
      [ "déstructurer", 1, 0 ],
      [ "détecter", 1, 0 ],
      [ "détériorer", 1, 0 ],
      [ "déterrer", 1, 0 ],
      [ "détester", 1, 0 ],
      [ "détourner", 1, 0 ],
      [ "dévier", 1, 0 ],
      [ "dévaliser", 1, 0 ],
      [ "dévaloriser", 1, 0 ],
      [ "devancer", 1, 0 ],
      [ "dévaster", 1, 0 ],
      [ "déverrouiller", 1, 0 ],
      [ "dévisager", 1, 0 ],
      [ "dévorer", 1, 0 ],
      [ "diaboliser", 1, 0 ],
      [ "digérer", 1, 0 ],
      [ "dilater", 1, 0 ],
      [ "diluer", 1, 0 ],
      [ "diriger", 1, 0 ],
      [ "discerner", 1, 0 ],
      [ "disperser", 1, 0 ],
      [ "disqualifier", 1, 0 ],
      [ "dissimuler", 1, 0 ],
      [ "distinguer", 1, 0 ],
      [ "diviser", 1, 0 ],
      [ "dominer", 1, 0 ],
      [ "dorer", 1, 0 ],
      [ "drainer", 1, 0 ],
      [ "duper", 1, 0 ],
      [ "dupliquer", 1, 0 ],
      [ "dynamiser", 1, 0 ],
      [ "dynamiter", 1, 0 ],
      [ "ébouillanter", 1, 0 ],
      [ "ébranler", 1, 0 ],
      [ "écarter", 1, 0 ],
      [ "échanger", 1, 0 ],
      [ "échauffer", 1, 0 ],
      [ "éclabousser", 1, 0 ],
      [ "éclairer", 1, 0 ],
      [ "éclater", 1, 0 ],
      [ "éclipser", 1, 0 ],
      [ "écouter", 1, 0 ],
      [ "écraser", 1, 0 ],
      [ "édifier", 1, 0 ],
      [ "édulcorer", 1, 0 ],
      [ "éduquer", 1, 0 ],
      [ "effacer", 1, 0 ],
      [ "effleurer", 1, 0 ],
      [ "effrayer", 1, 0 ],
      [ "égaler", 1, 0 ],
      [ "égaliser", 1, 0 ],
      [ "égarer", 1, 0 ],
      [ "égratigner", 1, 0 ],
      [ "éjecter", 1, 0 ],
      [ "électrifier", 1, 0 ],
      [ "électrocuter", 1, 0 ],
      [ "éliminer", 1, 0 ],
      [ "éloigner", 1, 0 ],
      [ "emballer", 1, 0 ],
      [ "embarquer", 1, 0 ],
      [ "embarrasser", 1, 0 ],
      [ "embêter", 1, 0 ],
      [ "embobiner", 1, 0 ],
      [ "embraser", 1, 0 ],
      [ "embrasser", 1, 0 ],
      [ "embrouiller", 1, 0 ],
      [ "embrumer", 1, 0 ],
      [ "embusquer", 1, 0 ],
      [ "emmener", 1, 0 ],
      [ "emmêler", 1, 0 ],
      [ "empiler", 1, 0 ],
      [ "employer", 1, 0 ],
      [ "empoisonner", 1, 0 ],
      [ "emprisonner", 1, 0 ],
      [ "encadrer", 1, 0 ],
      [ "encercler", 1, 0 ],
      [ "enchaîner", 1, 0 ],
      [ "enchanter", 1, 0 ],
      [ "enchevêtrer", 1, 0 ],
      [ "encoder", 1, 0 ],
      [ "encombrer", 1, 0 ],
      [ "encourager", 1, 0 ],
      [ "endiguer", 1, 0 ],
      [ "énerver", 1, 0 ],
      [ "enfermer", 1, 0 ],
      [ "enflammer", 1, 0 ],
      [ "enfoncer", 1, 0 ],
      [ "enfumer", 1, 0 ],
      [ "engraisser", 1, 0 ],
      [ "engueuler", 1, 0 ],
      [ "enguirlander", 1, 0 ],
      [ "enivrer", 1, 0 ],
      [ "enjamber", 1, 0 ],
      [ "enjoliver", 1, 0 ],
      [ "enlever", 1, 0 ],
      [ "ennuyer", 1, 0 ],
      [ "enraciner", 1, 0 ],
      [ "enrouler", 1, 0 ],
      [ "ensabler", 1, 0 ],
      [ "ensorceler", 1, 0 ],
      [ "entailler", 1, 0 ],
      [ "entamer", 1, 0 ],
      [ "enterrer", 1, 0 ],
      [ "enthousiasmer", 1, 0 ],
      [ "entourer", 1, 0 ],
      [ "entraver", 1, 0 ],
      [ "entrechoquer", 1, 0 ],
      [ "entreposer", 1, 0 ],
      [ "envier", 1, 0 ],
      [ "envelopper", 1, 0 ],
      [ "envenimer", 1, 0 ],
      [ "envoûter", 1, 0 ],
      [ "épier", 1, 0 ],
      [ "épargner", 1, 0 ],
      [ "éparpiller", 1, 0 ],
      [ "épauler", 1, 0 ],
      [ "épingler", 1, 0 ],
      [ "éponger", 1, 0 ],
      [ "épouvanter", 1, 0 ],
      [ "épuiser", 1, 0 ],
      [ "équilibrer", 1, 0 ],
      [ "érafler", 1, 0 ],
      [ "éreinter", 1, 0 ],
      [ "escalader", 1, 0 ],
      [ "espacer", 1, 0 ],
      [ "espionner", 1, 0 ],
      [ "esquiver", 1, 0 ],
      [ "essayer", 1, 0 ],
      [ "essoufler", 1, 0 ],
      [ "essuyer", 1, 0 ],
      [ "étaler", 1, 0 ],
      [ "étalonner", 1, 0 ],
      [ "étiqueter", 1, 0 ],
      [ "étirer", 1, 0 ],
      [ "étonner", 1, 0 ],
      [ "étouffer", 1, 0 ],
      [ "étrangler", 1, 0 ],
      [ "étudier", 1, 0 ],
      [ "évacuer", 1, 0 ],
      [ "évaluer", 1, 0 ],
      [ "éveiller", 1, 0 ],
      [ "éviter", 1, 0 ],
      [ "exécrer", 1, 0 ],
      [ "examiner", 1, 0 ],
      [ "excuser", 1, 0 ],
      [ "exécuter", 1, 0 ],
      [ "exorciser", 1, 0 ],
      [ "expérimenter", 1, 0 ],
      [ "exposer", 1, 0 ],
      [ "expulser", 1, 0 ],
      [ "exterminer", 1, 0 ],
      [ "extirper", 1, 0 ],
   ],
   "modal": [  // [verb,group,aux,complement,(radical)]
      [ "être", 0, 0, "sur le point de" ],
      [ "être", 0, 0, "en train de" ],
      [ "commencer", 1, 0, "à" ],
      // [ "se mettre", 3, 1, "à" ],
      [ "cesser", 1, 0, "de" ],
      [ "finir", 2, 0, "de" ],
      [ "aller", 3, 1, "" ],
      [ "venir", 3, 1, "de" ],
      [ "devoir", 3, 0, "" ],
      // [ "savoir", 3, 0, "" ],
      [ "pouvoir", 3, 0, "" ],
      [ "vouloir", 3, 0, "" ],
      // [ "faire", 3, 0, "" ],
      // [ "se faire", 3, 1, "" ]
   ]
 };

const adverbTypes = ["manière","quantité"]
const adverbs = {
   "manière": [
      "admirablement",
      "ainsi",
      "aussi",
      "bien",
      "doucement",
      "également",
      "exprès",
      "gratuitement",
      "incognito",
      "lentement",
      "mal",
      "mieux",
      "pire",
      "vite"
   ],
   "quantité": [
      "assez",
      "autrement",
      "approximativement",
      "beaucoup",
      "complètement",
      "davantage",
      "divinement",
      "drôlement",
      "encore",
      "entièrement",
      "insuffisamment",
      "joliment",
      "moins",
      "passablement",
      "rudement",
      "suffisamment",
      "tellement",
      "tout à fait",
      "trop",
      "un peu"
   ]
 };

const elisionWithH = [
   "historien",
   "horticulteur",
   "horloger",
   "huissier",
   "historienne",
   "horticultrice",
   "hôtesse de l'air",
   "hippocampe",
   "hippopotame",
   "hirondelle",
   "hibiscus",
   "hortensia"
];

const nmsNoDet = [
   nouns["name"].M,
   pronouns["demonstrative"].M,
   pronouns["indefinite"].M.filter(word => word[0] != ""),
   [["il"],["le mien"],["le tien"],["le sien"],["le vôtre"],["le nôtre"],["le leur"]]
];
const nfsNoDet = [
   nouns["name"].F,
   nouns["city"],
   pronouns["demonstrative"].F,
   pronouns["indefinite"].F.filter(word => word[0] != ""),
   [["elle"],["la mienne"],["la tienne"],["la sienne"],["la vôtre"],["la nôtre"],["la leur"]]
];
const nmpNoDet = [
   pronouns["demonstrative"].M.filter(word => word[1] != ""),
   pronouns["indefinite"].M.filter(word => word[1] != ""),
   [["","ils"],["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]]
];
const nfpNoDet = [
   pronouns["demonstrative"].F,
   pronouns["indefinite"].F.filter(word => word[1] != ""),
   [["","elles"],["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]]
];
const nms = [
   nouns["job"].M,
   nouns["animal"].M,
   nouns["plant"].M,
   nouns["country"].M
];
const nfs = [
   nouns["job"].F,
   nouns["animal"].F,
   nouns["plant"].F,
   nouns["country"].F
];
const nmp = [
   nouns["job"].M,
   nouns["animal"].M,
   nouns["plant"].M
];
const nfp = [
   nouns["job"].F,
   nouns["animal"].F,
   nouns["plant"].F
];
const p1 = [[["je","nous"]]];
const p2 = [[["tu","vous"]]];

const comsNoDet = [
   nouns["name"].M,
   pronouns["demonstrative"].M,
   pronouns["indefinite"].M.filter(word => (word[0].toLowerCase() != "on" && word[0].toLowerCase() != "quiconque" && word[0] != "")),
   [["le mien"],["le tien"],["le sien"],["le vôtre"],["le nôtre"],["le leur"]]
];
const cofsNoDet = [
   nouns["name"].F,
   nouns["city"],
   pronouns["demonstrative"].F,
   pronouns["indefinite"].F.filter(word => word[0] != ""),
   [["la mienne"],["la tienne"],["la sienne"],["la vôtre"],["la nôtre"],["la leur"]]
];
const compNoDet = [
   pronouns["demonstrative"].M.filter(word => word[1] != ""),
   // pronouns["indefinite"].M.filter(word => word[1] != ""),
   [["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]]
];
const cofpNoDet = [
   pronouns["demonstrative"].F,
   // pronouns["indefinite"].F.filter(word => word[1] != ""),
   [["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]]
];
// const coms = [
//    nouns["job"].M,
//    nouns["animal"].M,
//    nouns["plant"].M,
//    nouns["country"].M
// ];
// const cofs = [
//    nouns["job"].F,
//    nouns["animal"].F,
//    nouns["plant"].F,
//    nouns["country"].F
// ];

const batches = {
   "N-M-S-noDet": nmsNoDet,
   "N-F-S-noDet": nfsNoDet,
   "N-M-P-noDet": nmpNoDet,
   "N-F-P-noDet": nfpNoDet,
   "N-M-S": nms,
   "N-M-S-adj": nms,
   "N-F-S": nfs,
   "N-F-S-adj": nfs,
   "N-M-P": nmp,
   "N-M-P-adj": nmp,
   "N-F-P": nfp,
   "N-F-P-adj": nfp,
   "1P-S": p1,
   "2P-S": p2,
   "1P-P": p1,
   "2P-P": p2,
   "VI": verbs["intransitive"],
   "VT": verbs["transitive"],
   "CO-M-S-noDet": comsNoDet,
   "CO-F-S-noDet": cofsNoDet,
   "CO-M-S": nms,
   "CO-F-S": nfs,
   "CO-M-S-adj": nms,
   "CO-F-S-adj": nfs,
   "CO-M-P-noDet": compNoDet,
   "CO-F-P-noDet": cofpNoDet,
   "CO-M-P": nmp,
   "CO-F-P": nfp,
   "CO-M-P-adj": nmp,
   "CO-F-P-adj": nfp
};

const set = {
   "3P-S": ["N-M-S-noDet","N-M-S","N-M-S-adj","N-F-S-noDet","N-F-S","N-F-S-adj"],
   "3P-P": ["N-M-P-noDet","N-M-P","N-M-P-adj","N-F-P-noDet","N-F-P","N-F-P-adj","double-3P"],
   "3P": ["CO-M-S-noDet","N-M-S","N-M-S-adj","CO-F-S-noDet","N-F-S","N-F-S-adj","CO-M-P-noDet","N-M-P","N-M-P-adj","CO-F-P-noDet","N-F-P","N-F-P-adj"],  // pour les groupes de 2 sujets
   "CO": ["CO-M-S-noDet","CO-M-S","CO-M-S-adj","CO-F-S-noDet","CO-F-S","CO-F-S-adj","CO-M-P-noDet","CO-M-P","CO-M-P-adj","CO-F-P-noDet","CO-F-P","CO-F-P-adj"]
};
