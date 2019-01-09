
// module.exports.generate = function (rng, minLength, maxLength, withSpaces) {
  test = function (rng, minLength, maxLength, withSpaces) {
   var curLength = 0;
   var text = "";
   while (curLength < maxLength - 50) {
      var sentence = "";
      // var iSentence = Math.trunc(rng() * sentences.length);
      var subject = createNounGroup(rng);
      var subjVerb = addVerb(subject,rng);
      sentence += subjVerb[0];
      var transitive = subjVerb[1];
      if(transitive){
         var object = createNounGroup(rng,true);
         sentence += object[0];
      }
      if(subjVerb[2]){
         // var sentence = addComplement(subjVerb,rng);
      }
      var sentence = cleanUpSpecialChars(sentence, withSpaces);
      if (sentence.length > (maxLength - curLength - 20)) {
         continue;
      }
      text += sentence;
      if (withSpaces) {
         text += " ";
      }
      curLength += sentence.length;
      text = "<p>"+text+"</p>";
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

function createNounGroup(rng,CO) {
   var subj = "";
   var subjGender = 0;
   var subjPlural = 0;
   var subjPerson = 3;
   var isPronoun = (CO) ? 0 : Math.trunc(rng() * 2);
   if(isPronoun){
      var pronounType = subjPronounTypes[Math.trunc(rng() * subjPronounTypes.length)];
      var pronoun = pronouns[pronounType][Math.trunc(rng() * pronouns[pronounType].length)];
      subj += pronoun[0];
      var gender = pronoun[1];
      subjPlural = pronoun[2];
      if(pronounType === "personal"){
         subjPerson = pronoun[3];
      }
   }else{
      var nSubj= Math.trunc(rng() * 3 + 1);
      for(var iSubj = 0; iSubj < nSubj; iSubj++){   
         var iSubjType = Math.trunc(rng() * 4); // name, job, animal, plant 
         var index = Math.trunc(rng() * nouns[nounTypes[iSubjType]].length);
         var word = nouns[nounTypes[iSubjType]][index];
         if(iSubjType === 0) {
            subj += word[0];
            var gender = word[1];
            var plural = 0;
         }else{
            var gender = word[1];
            var determiner = getDeterminer(gender,rng);
            var plural = determiner[1];
            subj += determiner[0] + " ";
            var wordText = plural ? pluralize(word[0],word[2]) : word[0];
            var isAdjective = Math.trunc(rng() * 2);
            if(isAdjective){
               var adjectiveIndex = Math.trunc(rng() * adjectives.length);
               var adjText = getAdjective(adjectiveIndex, gender, plural);
               var adjPlace = adjectives[index][2];
               if(adjPlace === 0){
                  subj += adjText+" "+wordText;
               }else{
                  subj += wordText+" "+adjText;
               }
            }else{
               subj += wordText;
            }
         }
         if(nSubj > 1){
            subjPlural = 1;
            if(iSubj < nSubj - 2 ){
               subj += ",";
            }else if(iSubj == nSubj - 2) {
               subj += " et";
            }
         }
         subj += " ";
      }
   }
   subj = elide(subj);
   subjGender |= gender;
   subjPlural |= plural;
   return [ subj, subjGender, subjPlural, subjPerson ];
};

function getDeterminer(gender,rng) {
   var determinerType = determinerTypes[Math.trunc(rng() * determinerTypes.length)];
   if(determinerType != "numeral_adjective"){
      var plural = Math.trunc(rng() * 2);
      if(plural){
         var determiner = determiners[determinerType][2][0];
      }else{
         var determiner = determiners[determinerType][1 - gender][0];
      }
   }else{
      var plural = 1;
      var determiner = determiners[determinerType][Math.trunc(rng() * determiners[determinerType].length)];
   }
   return [determiner,plural];
};

function getAdjective(index,gender,plural) {
   var adj = adjectives[index];
   var adjText = adj[0];
   if(gender === 0 && adj[1].length < 2){
      adjText += adj[1];
   }else if(gender === 0 && adj[1].length >= 2){
      adjText = adj[1];
   }
   if(plural){
      adjText = pluralize(adjText);
   }
   return adjText;
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
   str = " " + str; 
   str = str.replace(/[ ](le|la)[ ]([aeiouy])/gi," l'$2");
   str = str.replace(/[ ](ce)[ ]([aeiouy])/gi," cet $2");
   str = str.replace(/[ ](de)[ ]([aeiouy])/gi," d'$2");
   str = str.replace(/[ ](je)[ ]([aeiouy])/gi," j'$2");
   str = str.replace(/[ ](ne)[ ]([aeiouy])/gi," n'$2");
   str = str.replace(/[ ]à[ ]le[ ]/gi," au ");
   str = str.replace(/[ ]à[ ]les[ ]/gi," aux ");
   return str;
};

function addVerb(subj,rng) {
   var verbType = verbTypes[Math.trunc(rng() * verbTypes.length)];
   var verb = verbs[verbType][Math.trunc(rng() * verbs[verbType].length)];
   var transitive = (verbType === "transitive") ? 1 : 0;
   var complement = verb[3];
   if(subj[0].trim() === "personne" || subj[0].trim() === "rien"){
      var negation = 1;
      var negationWord = "";
   }else{
      var negation = Math.trunc(rng() * 1.5);
      if(negation){
         var negationWord = Math.trunc(rng() * 2) ? "pas" : "plus";
      }
   }
   var conjVerb = conjugate(verb,subj,rng);
   if(verbType === "modal"){
      var secVerbType = verbTypes[Math.trunc(rng() * (verbTypes.length-1))];
      var secVerb = verbs[secVerbType][Math.trunc(rng() * verbs[verbType].length)];
      var transitive = (secVerbType === "transitive") ? 1 : 0;
      var complement = secVerb[3];
      if(negation){
         var text = subj[0] + " ne " + conjVerb + " " + negationWord + " " + verb[3]+" "+secVerb[0];
      }else{
         var text = subj[0] + " " + conjVerb + " "+verb[3]+" "+secVerb[0];
      }
   }else{
      if(negation){
         var text = subj[0] + " ne " + conjVerb + " " + negationWord;
      }else{
         var text = subj[0] + " " + conjVerb;
      }
   }
   text = elide(text);
   return [ text, transitive, complement ];
};

function conjugate(verb,subj,rng) {
   var infinitive = verb[0].toLowerCase();
   var group = verb[1];
   var person = subj[3];
   var plural = subj[2];
   var tense = tenses[Math.trunc(rng() * tenses.length)];
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
         return infinitive.replace(/yer$/,"i"+ending);
      }else if(infinitive.endsWith("eler") && !exceptions[0].includes(infinitive)){
         return infinitive.replace(/er$/,"l"+ending);
      }else if(infinitive.endsWith("eter") && !exceptions[0].includes(infinitive)){
         return infinitive.replace(/er$/,"t"+ending);
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

const genders = [ "F", "M", "neutral", "undefined"];

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

const determinerTypes = ["definite_article","indefinite_article","demonstrative_adjective","numeral_adjective"];
const determiners = {
   "definite_article": [  // [name, gender, plural]
      [ "le", 1, 0 ],
      [ "la", 0, 0 ],
      [ "les", 2, 1 ] 
   ],
   "indefinite_article": [  // [name, gender, plural]
      [ "un", 1, 0 ],
      [ "une", 0, 0 ],
      [ "des", 2, 1 ] 
   ],
   "demonstrative_adjective": [  // [name, gender, plural]
      [ "ce", 1, 0 ],
      [ "cette", 0, 0],
      [ "ces", 2, 1],
   ],
   "numeral_adjective": [
      "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"
   ]
};

const pronounTypes = ["personal","possessive","demonstrative","demonstrative_2","indefinite","relative","relative_2"];
const subjPronounTypes = ["personal","demonstrative_2","indefinite"];
const pronouns = {
   "personal": [  // [name, gender, plural, person]
      [ "Je", 2, 0, 1 ],
      [ "Tu", 2, 0, 2 ],
      [ "Il", 3, 0, 3 ],
      [ "Il", 1, 0, 3 ],
      [ "Elle", 0, 0, 3 ],
      [ "Nous", 2, 1, 1 ],
      [ "Vous", 2, 1, 2 ],
      [ "Ils", 1, 1, 3 ],
      [ "Elles", 0, 1, 3 ] ],
   "possessive": [   // [name, gender]
      ["mien", 1],
      ["mienne", 0],
      ["tien", 1],
      ["tienne", 0],
      ["sien", 1],
      ["sienne", 0],
      ["nôtre", 2],
      ["vôtre", 2],
      ["leur", 2] ],
   "demonstrative": [   // [name, gender, plural]
      [ "celui", 1, 0 ],
      [ "celle", 0, 0 ],
      [ "ceux", 1, 1 ],
      [ "celles", 0, 1 ],
      [ "ce", 2, 0 ] ],
   "demonstrative_2": [   // [name, gender, plural]
      [ "celui-ci", 1, 0 ],
      [ "celle-ci", 0, 0 ],
      [ "celui-là", 1, 0 ],
      [ "celle-là", 0, 0 ],
      [ "ceux-ci", 1, 1 ],
      [ "celles-ci", 0, 1 ],
      [ "ceux-là", 1, 1 ],
      [ "celles-là", 0, 1 ],
      [ "ceci", 2, 0 ],
      [ "cela", 2, 0 ] ,
      [ "ça", 2, 0 ] ],
   "indefinite": [   // [name, gender, plural]
      [ "Autrui", 2, 0 ],
      [ "Certains", 1, 1 ],
      [ "Certaines", 0, 1 ],
      [ "Chacun", 1, 0 ],
      [ "Chacune", 0, 0 ],
      [ "On", 2, 0 ],
      [ "Personne", 2, 0 ],
      [ "Quiconque", 2, 0 ],
      [ "Quelque chose", 2, 0 ],
      [ "Rien", 2, 0 ],
      [ "Tout", 2, 0 ] ],
   "relative": [ "Qui", "Que", "Quoi", "Dont", "Où" ],
   "relative_2": [ // [name, gender, plural]
      ["lequel", 1, 0],
      ["lesquels", 1, 1],
      ["laquelle", 0, 0],
      ["lesquelles", 0, 1] ]  
};
const nounTypes = ["name","job","animal","plant","country","city"];
const nouns = {
   "name": [ // [name, gender]
      [ "Achille", 1 ],
      [ "Adam", 1 ],
      [ "Adèle", 0 ],
      [ "Adeline", 0 ],
      [ "Adrien", 1 ],
      [ "Agathe", 0 ],
      [ "Agnès", 0 ],
      [ "Aïcha", 0 ],
      [ "Alain", 1 ],
      [ "Alban", 1 ],
      [ "Albert", 1 ],
      [ "Alexandre", 1 ],
      [ "Alexandra", 0 ],
      [ "Alfred", 1 ],
      [ "Alice", 0 ],
      [ "Alison", 0 ],
      [ "Alisée", 0 ],
      [ "Alphonse", 1 ],
      [ "Amandine", 0 ],
      [ "Amélie", 0 ],
      [ "Anaïs", 0 ],
      [ "Anatole", 1 ],
      [ "Anémone", 0 ],
      [ "Annabelle", 0 ],
      [ "Anne", 0 ],
      [ "Annie", 0 ],
      [ "Anthony", 1 ],
      [ "Antoine", 1 ],
      [ "Archibald", 1 ],
      [ "Ariane", 0 ],
      [ "Armand", 1 ],
      [ "Arthur", 1 ],
      [ "Augustin", 1 ],
      [ "Augustine", 0 ],
      [ "Aurélien", 1 ],
      [ "Aurélia", 0 ],
      [ "Azalée", 0 ],
      [ "Babette", 0 ],
      [ "Baptiste", 1 ],
      [ "Barbara", 0 ],
      [ "Barnabé", 1 ],
      [ "Bastien", 1 ],
      [ "Béatrice", 0 ],
      [ "Benjamin", 1 ],
      [ "Benoît", 1 ],
      [ "Bernard", 1 ],
      [ "Berthe", 0 ],
      [ "Bertrand", 1 ],
      [ "Bob", 1 ],
      [ "Bobby", 1 ],
      [ "Brice", 1 ],
      [ "Brigitte", 0 ],
      [ "Bruce", 1 ],
      [ "Bruno", 1 ],
      [ "Camille", 0 ],
      [ "Carole", 0 ],
      [ "Caroline", 0 ],
      [ "Catherine", 0 ],
      [ "Cécile", 0 ],
      [ "Cédric", 1 ],
      [ "Chantal", 0 ],
      [ "Charlotte", 0 ],
      [ "Christelle", 0 ],
      [ "Christian", 1 ],
      [ "Christophe", 1 ],
      [ "Claire", 0 ],
      [ "Clarence", 0 ],
      [ "Claude", 1 ],
      [ "Clémence", 0 ],
      [ "Clément", 1 ],
      [ "Clémentine", 0 ],
      [ "Corentin", 1 ],
      [ "Corine", 0 ],
      [ "Cynthia", 0 ],
      [ "Cyprien", 1 ],
      [ "Cyril", 1 ],
      [ "Damien", 1 ],
      [ "Daniel", 1 ],
      [ "Danielle", 0 ],
      [ "David", 1 ],
      [ "Delphine", 0 ],
      [ "Denis", 1 ],
      [ "Dimitri", 1 ],
      [ "Dorothée", 0 ],
      [ "Edouard", 1 ],
      [ "Eglantine", 0 ],
      [ "Eléonore", 0 ],
      [ "Elisabeth", 0 ],
      [ "Eloïse", 0 ],
      [ "Emilie", 0 ],
      [ "Emmanuel", 1 ],
      [ "Emmanuelle", 0 ],
      [ "Eric", 1 ],
      [ "Ernest", 1 ],
      [ "Estelle", 0 ],
      [ "Etienne", 1 ],
      [ "Eve", 0 ],
      [ "Eveline", 0 ],
      [ "Fabien", 1 ],
      [ "Fabienne", 0 ],
      [ "Fabrice", 1 ],
      [ "Ferdinand", 1 ],
      [ "Florence", 0 ],
      [ "Florient", 1 ],
      [ "Francis", 1 ],
      [ "François", 1 ],
      [ "Françoise", 0 ],
      [ "Gabriel", 1 ],
      [ "Gabrielle", 0 ],
      [ "Gaétan", 1 ],
      [ "Gaspard", 1 ],
      [ "Geneviève", 0 ],
      [ "Geoffrey", 1 ],
      [ "Georges", 1 ],
      [ "Gérald", 1 ],
      [ "Géraldine", 0 ],
      [ "Gérard", 1 ],
      [ "Gilbert", 1 ],
      [ "Gisèle", 0 ],
      [ "Gladys", 0 ],
      [ "Grégory", 1 ],
      [ "Guillaume", 1 ],
      [ "Guy", 1 ],
      [ "Harry", 1 ],
      [ "Hélène", 0 ],
      [ "Henri", 1 ],
      [ "Hervé", 1 ],
      [ "Hortense", 0 ],
      [ "Hugo", 1 ],
      [ "Hugues", 1 ],
      [ "Igor", 1 ],
      [ "Inès", 0 ],
      [ "Isabelle", 0 ],
      [ "Jacky", 1 ],
      [ "Jacqueline", 0 ],
      [ "Jacques", 1 ],
      [ "Jean", 1 ],
      [ "Jeanne", 0 ],
      [ "Jérémy", 1 ],
      [ "Jérôme", 1 ],
      [ "Jessica", 0 ],
      [ "Jocelyne", 0 ],
      [ "Joëlle", 0 ],
      [ "Jonathan", 1 ],
      [ "Joséphine", 0 ],
      [ "Judith", 0 ],
      [ "Julie", 0 ],
      [ "Julien", 1 ],
      [ "Juliette", 0 ],
      [ "Justine", 0 ],
      [ "Karim", 1 ],
      [ "Karine", 0 ],
      [ "Karl", 1 ],
      [ "Laeticia", 0 ],
      [ "Laura", 0 ],
      [ "Laure", 0 ],
      [ "Laurence", 0 ],
      [ "Laurent", 1 ],
      [ "Léa", 0 ],
      [ "Leïla", 0 ],
      [ "Léo", 1 ],
      [ "Léon", 1 ],
      [ "Léonard", 1 ],
      [ "Léopold", 1 ],
      [ "Lisa", 0 ],
      [ "Loic", 1 ],
      [ "Louis", 1 ],
      [ "Louise", 0 ],
      [ "Lucas", 1 ],
      [ "Lucie", 0 ],
      [ "Ludovic", 1 ],
      [ "Madeleine", 0 ],
      [ "Magalie", 0 ],
      [ "Maïté", 0 ],
      [ "Marc", 1 ],
      [ "Marco", 1 ],
      [ "Marguerite", 0 ],
      [ "Marie", 0 ],
      [ "Marina", 0 ],
      [ "Marjorie", 0 ],
      [ "Marlène", 0 ],
      [ "Martine", 0 ],
      [ "Mathias", 1 ],
      [ "Mathieu", 1 ],
      [ "Mathilde", 0 ],
      [ "Maurice", 1 ],
      [ "Maxime", 1 ],
      [ "Maximilien", 1 ],
      [ "Mehdi", 1 ],
      [ "Mélanie", 0 ],
      [ "Mélissa", 0 ],
      [ "Michel", 1 ],
      [ "Michelle", 0 ],
      [ "Mickaël", 1 ],
      [ "Monique", 0 ],
      [ "Mourad", 1 ],
      [ "Muriel", 0 ],
      [ "Myriam", 0 ],
      [ "Nadine", 0 ],
      [ "Nathan", 1 ],
      [ "Nicolas", 1 ],
      [ "Nicole", 0 ],
      [ "Noël", 1 ],
      [ "Noémie", 0 ],
      [ "Odile", 0 ],
      [ "Olivier", 1 ],
      [ "Oscar", 1 ],
      [ "Pablo", 1 ],
      [ "Pascal", 1 ],
      [ "Pascale", 0 ],
      [ "Patrice", 1 ],
      [ "Patrick", 1 ],
      [ "Paul", 1 ],
      [ "Pénélope", 0 ],
      [ "Philippe", 1 ],
      [ "Pierre", 1 ],
      [ "Quentin", 1 ],
      [ "Rachel", 0 ],
      [ "Raphaël", 1 ],
      [ "Raymond", 1 ],
      [ "Rémi", 1 ],
      [ "Richard", 1 ],
      [ "Robert", 1 ],
      [ "Romain", 1 ],
      [ "Rosalie", 0 ],
      [ "Sabine", 0 ],
      [ "Sabrina", 0 ],
      [ "Samantha", 0 ],
      [ "Samuel", 1 ],
      [ "Sandra", 0 ],
      [ "Sandrine", 0 ],
      [ "Sarah", 0 ],
      [ "Sébastien", 1 ],
      [ "Serge", 1 ],
      [ "Séverine", 0 ],
      [ "Simon", 1 ],
      [ "Simone", 0 ],
      [ "Sonia", 0 ],
      [ "Sophie", 0 ],
      [ "Stanislas", 1 ],
      [ "Stéphane", 1 ],
      [ "Stéphanie", 0 ],
      [ "Sylvain", 1 ],
      [ "Sylvestre", 1 ],
      [ "Sylvie", 0 ],
      [ "Tanguy", 1 ],
      [ "Théo", 1 ],
      [ "Théodore", 1 ],
      [ "Thérèse", 0 ],
      [ "Thomas", 1 ],
      [ "Tom", 1 ],
      [ "Ulysse", 1 ],
      [ "Valentin", 1 ],
      [ "Valérie", 0 ],
      [ "Vanessa", 0 ],
      [ "Véronique", 0 ],
      [ "Victor", 1 ],
      [ "Victoria", 0 ],
      [ "Walter", 1 ],
      [ "William", 1 ],
      [ "Xavier", 1 ],
      [ "Yann", 1 ],
      [ "Yasmine", 0 ],
      [ "Yohann", 1 ],
      [ "Youssef", 1 ],
      [ "Yvan", 1 ],
      [ "Yves", 1 ],
      [ "Yvette", 0 ],
      [ "Yvon", 1 ],
      [ "Zinédine", 1 ],
      [ "Zoé", 0 ] ],
   "job": [ // [name,gender,(plural)]
      [ "acteur", 1 ],
      [ "actrice", 0 ],
      [ "agriculteur", 1 ],
      [ "aide-soignant", 1, "aides-soignants" ],
      [ "aide-soignante", 0, "aides-soignantes" ],
      [ "ambulancier", 1 ],
      [ "ambulancière", 0 ],
      [ "analyste", 1 ],
      [ "animateur", 1 ],
      [ "animatrice", 0 ],
      [ "antiquaire", 1 ],
      [ "apiculteur", 1 ],
      [ "archéologue", 1 ],
      [ "architecte", 1 ],
      [ "archiviste", 1 ],
      [ "artiste", 1 ],
      [ "assistante maternelle", 0, "assistantes maternelles" ],
      [ "assistante sociale", 0, "assistantes sociales" ],
      [ "astronaute", 1 ],
      [ "astronome", 1 ],
      [ "astrologue", 1 ],
      [ "astrophysicien", 1 ],
      [ "astrophysicienne", 0 ],
      [ "attaché de presse", 1, "attachés de presse" ],
      [ "attachée de presse", 0, "attachées de presse" ],
      [ "auteur", 1 ],
      [ "aviateur", 1 ],
      [ "avocat", 1 ],
      [ "avocate", 0 ],
   ],
   "animal": [ // [name,gender]
      [ "Agneau", 1 ],
      [ "Aigle", 1 ],
      [ "Albatros", 1 ],
      [ "Alligator", 1 ],
      [ "Anaconda", 1 ],
      [ "Ane", 1 ],
      [ "Antilope", 0 ],
      [ "Araignée", 0 ],
      [ "Autruche", 0 ],
      [ "Babouin", 1 ],
      [ "Baleine", 0 ],
      [ "Belette", 0 ],
      [ "Biche", 0 ],
      [ "Bison", 1 ],
      [ "Blaireau", 1 ],
      [ "Boa", 1 ],
      [ "Boeuf", 1 ],
      [ "Bouquetin", 1 ],
      [ "Brebis", 0 ],
      [ "Buffle", 1 ],
      [ "Cachalot", 1 ],
      [ "Campagnol", 1 ],
      [ "Canard", 1 ],
      [ "Caribou", 1 ],
      [ "Carpe", 0 ],
      [ "Castor", 1 ],
      [ "Cerf", 1 ],
      [ "Chacal", 1 ],
      [ "Chameau", 1 ],
      [ "Chamois", 1 ],
      [ "Chat", 1 ],
      [ "Chauve-souris", 0, "chauves-souris" ],
      [ "Cheval", 1 ],
      [ "Chèvre", 0 ],
      [ "Chevreuil", 1 ],
      [ "Chien", 1 ],
      [ "Chimpanzé", 1 ],
      [ "Chouette", 0 ],
      [ "Cigogne", 0 ],
      [ "Coccinelle", 0 ],
      [ "Cochon", 1 ],
      [ "Coq", 1 ],
      [ "Coyote", 1 ],
      [ "Crabe", 1 ],
      [ "Crocodile", 1 ],
      [ "Cygne", 1 ],
   ],
   "plant": [  // [name,gender]
      [ "abricotier", 1 ],
      [ "acacia", 1 ],
      [ "amandier", 1 ],
      [ "arbousier", 1 ],
      [ "aubépine", 0 ],
      [ "aulne", 1 ],
   ],
   "country": [   // [name, gender]
      [ "Angleterre", 0 ],
      [ "Autriche", 0 ],
      [ "Belgique", 0 ],
      [ "Bulgarie", 0 ],
      [ "Croatie", 0 ],
      [ "Tchéquie", 0 ],
      [ "Danemark", 1 ],
      [ "Estonie", 0 ],
      [ "Finlande", 0 ],
      [ "France", 0 ],
      [ "Allemagne", 0 ],
      [ "Grèce", 0 ],
      [ "Hongrie", 0 ],
      [ "Irlande", 0 ],
      [ "Italie", 0 ],
      [ "Lettonie", 0 ],
      [ "Lituanie", 0 ],
      [ "Luxembourg", 1 ],
      [ "Norvège", 0 ],
      [ "Pologne", 0 ],
      [ "Portugal", 1 ],
      [ "Roumanie", 0 ],
      [ "Russie", 0 ],
      [ "Serbie", 0 ],
      [ "Slovaquie", 0 ],
      [ "Slovénie", 0 ],
      [ "Espagne", 0 ],
      [ "Suède", 0 ],
      [ "Suisse", 0 ],
      [ "Europe", 0 ],
      [ "Asie", 0 ],
      [ "Afrique", 0 ],
      [ "Amérique du nord", 0 ],
      [ "Amérique du sud", 0 ],
      [ "Amérique centrale", 0 ],
      [ "Océanie", 0 ] ],
   "city": [
      "Amsterdam", 
      "Athènes",
      "Belgrade",
      "Berlin",
      "Bruxelles",
      "Bucarest",
      "Budapest",
      "Copenhague",
      "Dublin",
      "Helsinki",
      "Kiev",
      "Lisbonne",
      "Londres",
      "Madrid",
      "Monaco",
      "Moscou",
      "Oslo",
      "Paris",
      "Prague",
      "Reykjavik",
      "Rome",
      "Sarajevo",
      "Sofia",
      "Stockholm",
      "Varsovie",
      "Vienne",
      "Lyon",
      "Marseille",
      "Toulouse",
      "Bordeaux",
      "Brest" ]
};

const adjectives = [  // [name,fem,before/after(0/1)]
   [ "abject", "e", 1 ],
   [ "abominable", "", 1 ],
   [ "aborigène", "", 1 ],
   [ "abrasif", "abrasive", 1 ],
   [ "abrupt", "e", 1 ],
   [ "absent", "e", 1 ],
   [ "absorbant", "e", 1 ],
   [ "abstrait", "e", 1 ],
   [ "absurde", "", 1 ],
   [ "accablant", "e", 1 ],
   [ "accessoire", "", 1 ],
   [ "accomodant", "e", 1 ],
   [ "accompagné", "e", 1 ],
   [ "accoudé", "e", 1 ],
   [ "accroupi", "e", 1 ],
   [ "acceuillant", "e", 1 ],
   [ "accusateur", "accusatrice", 1 ],
   [ "accusé", "e", 1 ],
   [ "acéré", "e", 1 ],
   [ "acharné", "e", 1 ],
   [ "achevé", "e", 1 ],
   [ "acide", "", 1 ],
   [ "acidulé", "e", 1 ],
   [ "acoustique", "", 1 ],
   [ "acquis", "e", 1 ],
   [ "acquitté", "e", 1 ],
   [ "actif", "active", 1 ],
   [ "actionné", "e", 1 ],
   [ "activiste", "", 1 ],
   [ "actuel", "actuelle", 1 ],
   [ "adapté", "e", 1 ],
   [ "addictif", "addictive", 1 ],
   [ "adhésif", "adhésive", 1 ],
   [ "adipeux", "adipeuse", 1 ],
   [ "admis", "e", 1 ],
   [ "admissible", "", 1 ],
   [ "administratif", "administrative", 1 ],
   [ "adolescent", "e", 1 ],
   [ "adopté", "e", 1 ],
   [ "adoré", "e", 1 ],
   [ "adouci", "e", 1 ],
   [ "adoucissant", "e", 1 ],
   [ "adriatique", "", 1 ],
   [ "absorbant", "e", 1 ],
   [ "adulte", "", 1 ],
   [ "aéré", "e", 1 ],
   [ "aérodynamique", "", 1 ],
   [ "aéronautique", "", 1 ],
   [ "aérostatique", "", 1 ],
   [ "affaibli", "e", 1 ],
   [ "affaiblissant", "e", 1 ],
   [ "affairé", "e", 1 ],
   [ "affamé", "e", 1 ],
   [ "affirmé", "e", 1 ],
   [ "affligeant", "e", 1 ],
   [ "affligé", "e", 1 ],
   [ "affolant", "e", 1 ],
   [ "affolé", "e", 1 ],
   [ "affranchi", "e", 1 ],
   [ "affreux", "affreuse", 0 ],
   [ "affûté", "e", 1 ],
   [ "africain", "e", 1 ],
   [ "agaçant", "e", 1 ],
   [ "agacé", "e", 1 ],
   [ "agenouillé", "e", 1 ],
   [ "aggloméré", "e", 1 ],
   [ "agglutiné", "e", 1 ],
   [ "aggravant", "e", 1 ],
   [ "aggravé", "e", 1 ],
   [ "agité", "e", 1 ],
   [ "agnostique", "", 1 ],
   [ "agonisant", "e", 1 ],
   [ "agréable", "", 1 ],
   [ "agrégé", "e", 1 ],
   [ "agricole", "", 1 ],
   [ "aguerri", "e", 1 ],
   [ "ahuri", "e", 1 ],
   [ "ahurissant", "e", 1 ],
   [ "aigre", "", 1 ],
   [ "aigri", "e", 1 ],
   [ "aigu", "aigüe", 1 ],
   [ "aiguisé", "e", 1 ],
   [ "ailé", "e", 1 ],
   [ "aimable", "", 0 ],
   [ "aimanté", "e", 1 ],
   [ "ajusté", "e", 1 ],
   [ "alambiqué", "e", 1 ],
   [ "alarmant", "e", 1 ],
   [ "alarmé", "e", 1 ],
   [ "albanais", "e", 1 ],
   [ "albinos", "", 1 ],
   [ "alcoolique", "", 1 ],
   [ "alcoolisé", "e", 1 ],
   [ "alité", "e", 1 ],
   [ "allemand", "e", 1 ],
   [ "allongé", "e", 1 ],
   [ "alourdi", "e", 1 ],
];
const auxiliaryVerbs = ["avoir","être","both"];
const verbTypes = ["intransitive","transitive","modal"];
const verbs = {
   "intransitive": [ // [verb, group, auxiliary, complement, (radical)]
      [ "abandonner", 1, 0 ],
      [ "aboyer", 1, 0 ],
      [ "accéder", 1, 0, "à+L" ],
      [ "accélérer", 1, 0 ],
      // [ "accourir", 3, 2, "", "accour" ],
      [ "acquiescer", 1, 0 ],
      [ "affluer", 1, 0 ],
      // [ "apparaître", 3, 2, "", "apparai" ],
      [ "appartenir", 3, 0, "à+N" ],
      [ "arriver", 1, 1 ],
      [ "atterrir", 2, 2, "" ],
      [ "bâiller", 1, 0 ],
      [ "batailler", 1, 0 ],
      [ "batifoler", 1, 0 ],
      [ "bivouaquer", 1, 0 ],
      [ "boiter", 1, 0 ],
      [ "boitiller", 1, 0 ],
      [ "bondir", 2, 0, "" ],
      [ "bramer", 1, 0 ],
      [ "briller", 1, 0 ],
      [ "butiner", 1, 0 ]
   ],
   "transitive": [   // [verb, group, auxiliary, complement]
      [ "abandonner", 1, 0 ],
      [ "abîmer", 1, 0 ],
      [ "abriter", 1, 0 ],
      [ "absorber", 1, 0 ],
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
      [ "avaler", 1, 0 ]
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

