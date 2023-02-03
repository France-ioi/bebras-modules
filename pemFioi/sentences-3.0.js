if(typeof require != 'undefined') {
    var {
        conjugations,
        pastParticiples,
        speConjugations,
        auxConjugations,
        allerConj,
        exceptions,
        exceptionsNouns,
        exceptionsGroup3,
        negationWords,
        negationDictionary,
        determinerTypes,
        determiners,
        prepositions,
        pronounTypes,
        subjPronounTypes,
        pronouns,
        nounTypes,
        nouns,
        adjectiveTypes,
        adjectives,
        auxiliaryVerbs,
        verbTypes,
        verbs,
        adverbTypes,
        adverbs,
        elisionWithH,
        elisionWithHVerb
    } = require('./sentences_wordList-2.0.js');
    var block = "";
}

/*** DICTIONARY ***/

function generateDictionary() {
   var dictionary = [];
   var inDic = {};
   var dictionaryAvailableCriteria = [
     {
       name: 'type',
       label: "Type",
       type: 'select',
       values: [
         {value: 'verb', label: 'Verbe'},
         {value: 'noun', label: 'Nom'},
         {value: 'proper_noun', label: 'Nom propre'},
         {value: 'adjective', label: 'Adjectif'},
         {value: 'adj_num', label: 'Adjectif numérique'},
         {value: 'adj_dem', label: 'Adjectif démonstratif'},
         {value: 'adverb', label: 'Adverbe'},
         {value: 'article', label: 'Article'},
         // {value: 'pronoun', label: 'Pronom'},
         {value: 'preposition', label: 'Préposition'},
       ]
     },
     {
       name: 'verb_group',
       label: "Groupe",
       type: 'select',
       condition: "type == verb",
       values: [
         {value: '1', label: 'Premier groupe'},
         {value: '2', label: 'Deuxième groupe'},
         {value: '3', label: 'Troisième groupe'},
       ]
     },
     {
       name: 'verb_mode',
       label: "Mode",
       type: 'select',
       condition: "type == verb",
       values: [
         {value: 'inf', label: 'Infinitif'},
         {value: 'ind', label: 'Indicatif'},
         {value: 'pp', label: 'Participe passé'}
       ]
     },
     {
       name: 'verb_tense',
       label: "Temps",
       type: 'select',
       condition: "type == verb && verb_mode == ind",
       values: [
         {value: 'présent', label: 'Présent'},
         {value: 'imparfait', label: 'Imparfait'},
         {value: 'futur', label: 'Futur'}
       ]
     },
     {
       name: 'verb_person',
       label: "Personne",
       type: 'select',
       condition: "type == verb && verb_mode == ind",
       values: [
         {value: '1', label: 'Première personne du singulier'},
         {value: '2', label: 'Deuxième personne du singulier'},
         {value: '3', label: 'Troisième personne du singulier'},
         {value: '4', label: 'Première personne du pluriel'},
         {value: '5', label: 'Deuxième personne du pluriel'},
         {value: '6', label: 'Troisième personne du pluriel'}
       ]
     },
     {
       name: 'gender',
       label: "Genre",
       type: 'select',
       condition: "type == noun || type == adjective || type == article || type == adj_dem || verb_mode == pp" ,
       values: [
         {value: 'M', label: 'Masculin'},
         {value: 'F', label: 'Féminin'}
       ]
     },
     {
       name: 'number',
       label: "Nombre",
       type: 'select',
       condition: "type == noun || type == adjective || type == article || type == adj_dem || verb_mode == pp",
       values: [
         {value: '0', label: 'Singulier'},
         {value: '1', label: 'Pluriel'}
       ]
     },
     {
       name: 'art_type',
       label: "Type",
       type: 'select',
       condition: "type == article",
       values: [
         {value: 'def', label: 'Défini'},
         {value: 'ind', label: 'Indéfini'}
       ]
     }
   ];

   // Stackoverflow
   String.prototype.hashCode = function() {
     var hash = 0,
       i, chr;
     if (this.length === 0) return hash;
     for (i = 0; i < this.length; i++) {
       chr = this.charCodeAt(i);
       hash = ((hash << 5) - hash) + chr;
       hash |= 0; // Convert to 32bit integer
     }
     return hash;
   };

   function addEntryToDic(entry) {
      if(!inDictionary(entry)){
         dictionary.push(entry);
         var hash = JSON.stringify(entry).hashCode();
         inDic[hash] = true;
         return true
      }
      return false
   };

   function inDictionary(entry) {
      var hash = JSON.stringify(entry).hashCode();
      if(inDic[hash]){
         // console.log("doublon",entry)
         return true
      }
      return false
   };

   function addVerbsToDict() {
      var count = 0;
      // console.log(tenses)
      for(var verbType of verbTypes){
         // console.log(verbType);
         if(verbType != "modal"){
            for(var verb of verbs[verbType]){
               var g = verb[1];
               
               // infinitif
               var entry = { word: cleanUpSpecialChars(verb[0],true,true), type: "verb", verb_group: g, verb_mode: "inf" };
               if(addEntryToDic(entry)){
                  count++;
               }else{
                  // console.log(entry.word,"inf")
               }
               
               // participe passé
               if(tenses.includes(3) || tenses.includes(4) || tenses.includes(5)){
                  for(var gen = 0; gen < 2; gen++){
                     for(var num = 0; num < 2; num++){
                        var pp = getPastParticiple(verb[0],g,gen,num);
                        if(!pp){
                           continue;
                        }
                        var gender = (gen == 0) ? 'M' : 'F';
                        var entry = { word: cleanUpSpecialChars(pp,true,true), type: "verb", verb_group: g, verb_mode: "pp", gender, number: num };
                        if(addEntryToDic(entry)){
                           count++;
                        }
                     }
                  }
               }
               
               // var conj = conjugations[g - 1];
               for(var tenseID of tenses){
                  if(verbType != "aux" && tenseID > 2){
                     continue
                  }
                  if(verbType == "aux" && (tenseID > 2)){
                     tenseID -= 3;
                  }
                  var tense = allTenses[tenseID];
                  for(var pers = 0; pers < 6; pers++){
                     var plural = (pers > 2) ? 1 : 0;
                     var person = pers%3 + 1;
                     var word = conjugate(verb,person,plural,"M",tense,false,null,false);
                     if(cleanUpSpecialChars(word,true,true) == cleanUpSpecialChars(verb[0],true,true)){
                        console.log("pb conjugaison", word);
                     }
                     var entry = { 
                        word: cleanUpSpecialChars(word,true,true), 
                        type: "verb", 
                        verb_group: g, 
                        verb_mode: "ind", 
                        verb_person: pers + 1, 
                        /*verb_tense: tense*/ };
                     if(addEntryToDic(entry)){
                        count++;
                     }else{
                        // console.log(entry.word)
                     }
                  }
               }



            }
         }
      }
      console.log(count,"verbs");
   };

   function addNounsToDict() {
      for(var nounType of nounTypes){
         if(nounType == "city"){
            for(var noun of nouns[nounType]){
               var word = noun[0];
               var entry = { word: cleanUpSpecialChars(word,true,true), type: "proper_noun" };
               addEntryToDic(entry);
            }
            continue;
         }
         // console.log(nounType);
         for(var g = 0; g < 2; g++){
            var gender = (g == 0) ? "M" : "F";
            for(var noun of nouns[nounType][gender]){
               for(var pl = 0; pl < 2; pl++){
                  if(pl == 1 && (nounType == "name" || nounType == "country")){
                     continue;
                  }
                  var word = (pl == 0) ? noun[pl] : pluralize(noun[0],noun[1]);
                  if(nounType == "name" || nounType == "country"){
                     var entry = { word: cleanUpSpecialChars(word,true,true), type: "proper_noun", gender };
                  }else{
                     var entry = { word: cleanUpSpecialChars(word,true,true), type: "noun", gender, number: pl };
                  }
                  addEntryToDic(entry);
               }
            }   
         }
      }
   };

   function addAdjToDict() {
      for(var adjType of adjectiveTypes){
         for(var g = 0; g < 2; g++){
            var gender = (g == 0) ? "M" : "F";
            for(var adj of adjectives[adjType]){
               for(var pl = 0; pl < 2; pl++){
                  var word = makeAdjectiveAgree(adj,gender,pl);
                  var entry = { word: cleanUpSpecialChars(word,true,true), type: "adjective", gender, number: pl };
                  addEntryToDic(entry);
               }
            }   
         }
      }
   };

   function addAdvToDict() {
      for(var advType of adverbTypes){
         for(var adv of adverbs[advType]){
            var word = adv;
            var entry = { word: cleanUpSpecialChars(word,true,true), type: "adverb" };

            addEntryToDic(entry);
         }     
      }
      for(var adv of negationDictionary){
         var word = adv;
         var entry = { word: cleanUpSpecialChars(word,true,true), type: "adverb" };

         addEntryToDic(entry);
      } 
   };

   function addDetToDict() {
      for(var detType of determinerTypes){
         var type = detType[0];
         switch(type){
         case "definite_article":
         case "indefinite_article":
            var t = "article";
            break;
         case "demonstrative_adjective":
            var t = "adj_dem";
            break;
         case "numeral_adjective":
            var t = "adj_num";
         }
         if(t != "adj_num"){
            for(var g = 0; g < 2; g++){
               var gender = (g == 0) ? "M" : "F";
               for(var pl = 0; pl < 2; pl++){
                  var word = determiners[type][gender][0][pl];
                  // console.log(word)
                  var entry = { word: cleanUpSpecialChars(word,true,true), type: t, gender, number: pl };
                  if(type == "definite_article"){
                     entry.art_type = "def";
                  }else if(type == "indefinite_article"){
                     entry.art_type = "ind";
                  }
                  addEntryToDic(entry);   
               }
            }
            /* formes contractées */
            if(type == "definite_article"){
               var contractions = determiners[type]["contractions"];
               for(var row = 0; row < contractions.length; row++){
                  for(var pl = 0; pl < contractions[row].length; pl++){
                     var word = contractions[row][pl];
                     for(var g = 0; g < pl + 1; g++){
                        var gender = (g == 0) ? "M" : "F";
                        var entry = { word: cleanUpSpecialChars(word,true,true), type: t, gender, number: pl, art_type: "def" };
                        addEntryToDic(entry);   
                     }
                  }
               }
            }
         }else{
            for(var det of determiners[type]){
               var word = det[0];
               var entry = { word: cleanUpSpecialChars(word,true,true), type: t };
               addEntryToDic(entry);
            }
         }    
      }
   };

   function addPreToDict() {
      for(var pre of prepositions){
         var word = pre;
         var entry = { word: cleanUpSpecialChars(word,true,true), type: "preposition" };

         addEntryToDic(entry);
      }
   };

   var types = ["verb","noun","adj","adv","det","pronoun"];
   for(var type of types){
      switch(type){
      case "verb":
         addVerbsToDict();
         break;
      case "noun":
         addNounsToDict();
         break;
      case "adj":
         addAdjToDict();
         break;
      case "adv":
         addAdvToDict();
         break;
      case "det":
         addDetToDict();
         break;
      case "preposition":
         addPreToDict();
         break;
      case "pronoun":
         // addPronounsToDict();
         break;
      }
   }
   // console.log(JSON.stringify(dictionary).length);
   console.log(dictionary);
   return {dictionaryAvailableCriteria,dictionary}
};

/*** text generator ***/
var rng;

function init() {
   rng = Math.random;   
   generateWordListFromLexicon({rng});
   $("#form").html(createForm);
   initHandlers();
   updateVerbCount();
   updateNounCount();

   function createForm() {
      var html = "<h3>Restrictions du lexique</h3>";
      html += "<div class='line margin_bottom'>";
      html += selectWordOrder();
      html += "</div>";
      html += "<div class='line margin_bottom'>";
      html += selectVerbs();
      html += "</div>";
      html += "<div class='line margin_bottom'>";
      html += selectNouns();
      html += "</div>";
      html += selectTenses();
      html += "<button id=\"update_word_list\">Mettre à jour</button>";
      html += "<h3>Générer des phrases</h3>";
      html += selectStructures();
      html += selectSentenceNumber();
      html += "<button id=\"createSentences\">Générer</button>";
      html += "<h3>Générer dictionnaire</h3>";
      html += "<button id=\"generateDictionary\">Générer</button>";
      html += "<span class='margin_left'>Nombre de mots : </span>";
      html += "<span id='dictionary_count'>0</span>";
      html += "<h3>Voir les listes de mot</h3>";
      html += selectBlock();
      html += "<button id=\"wordList\">Voir</button>";
      html += "<h3>Générer un texte</h3>";
      html += selectTextLength();
      html += "<button id=\"createText\">Générer</button>";
      return html;
   };

   function selectWordOrder() {
      var html = "<label for=\"word_order\">Sélection de mots</label>";
      html += "<select id=\"word_order\">";
      for(var type = 0; type < 2; type++){
         var str = (type == 0) ? "fréquence descendante" : "aléatoire";
         html += "<option value=\""+type+"\">"+str+"</option>";
      }
      html += "</select>";
      return html;
   };

   function selectVerbs() {
      var html = "<label for=\"restriction_verbs\">Ratio des verbes</label>";
      html += "<select id=\"restriction_verbs\">";
      var nbSteps = 10;
      for(var step = nbSteps; step > 0; step--){
         var ratio = step/nbSteps;
         html += "<option value=\""+step+"\">"+ratio+"</option>";
      }
      html += "</select>";
      html += "<span>Nombre de verbes : ";
      html += "<span id='verb_count'>0</span>";
      html += " (les verbes transitifs indirects ne sont pas inclus)</span>";
      return html;
   };

   function selectNouns() {
      var html = "<label for=\"restriction_verbs\">Ratio des noms</label>";
      html += "<select id=\"restriction_nouns\">";
      var nbSteps = 10;
      for(var step = nbSteps; step > 0; step--){
         var ratio = step/nbSteps;
         html += "<option value=\""+step+"\">"+ratio+"</option>";
      }
      html += "</select>";
      html += "<span>Nombre de noms : ";
      html += "<span id='noun_count'>0</span>";
      html += "</span>";
      return html;
   };

   function selectTenses() {
      var html = "<fieldset class='margin_bottom'>";
      html += "<legend>Temps :</legend>";
      for(var iTense = 0; iTense < allTenses.length; iTense++){
         html += "<div>";
         html += "<input type='checkbox' id='"+iTense+"' name='tenses' value='"+iTense+"' checked>";
         html += "<label for='"+iTense+"'>"+allTenses[iTense]+"</label>";
         html += "</div>";
      }
      html += "</fieldset>";
      return html
   };

   function selectStructures() {
      var html = "<label for=\"structures\">Structure</label>";
      html += "<select id=\"structures\">";
      html += "<option value=\"all\">Toutes</option>";
      for(var structureIndex in structures){
         var str = "";
         for(var iBlock in structures[structureIndex][0]){
            str += structures[structureIndex][0][iBlock]
            if(iBlock != structures[structureIndex][0].length - 1){
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
      html += "<label for=\"person\" class=\"verb\">Personne + nombre</label>";
      html += "<select id=\"person\" class=\"verb\">";
      for(var iPerson = 0; iPerson < 6; iPerson++){
         personText = (iPerson%3 + 1)+" "+((iPerson <=2) ? "S" : "P");
         html += "<option value=\""+iPerson+"\">"+personText+"</option>";
      }
      html += "</select>";
      html += "<label for=\"tense\" class=\"verb\">Temps</label>";
      html += "<select id=\"tense\" class=\"verb\">";
      for(var iTense = 0; iTense < tenses.length; iTense++){
         var tenseID = tenses[iTense];
         tenseText = allTenses[tenseID];
         html += "<option value=\""+iTense+"\">"+tenseText+"</option>";
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

   function selectTextLength() {
      var html = "<label for=\"minLength\">Longueur</label>";
      html += "<select id=\"minLength\">";
      for(var i = 1; i < 5; i++){
         var min = Math.pow(10,i)*5;
         html += "<option value=\""+min+"\">"+min+"</option>";
      }
      html += "</select>";
      // html += "<label for=\"maxLength\">Longueur maximale</label>";
      // html += "<select id=\"maxLength\">";
      // for(var i = 1; i < 5; i++){
      //    var max = Math.pow(10,i)*5 + 50;
      //    html += "<option value=\""+max+"\">"+max+"</option>";
      // }
      // html += "</select>";
      return html;
   };

   function initHandlers() {
      $("#restriction_verbs").change(updateVerbCount);
      $("#restriction_nouns").change(updateNounCount);
      $("#update_word_list").off("click");
      $("#update_word_list").click(updateWordList);

      $(".verb").hide();
      $(".adj").hide();
      $("#blocks").change(function(){
         if(structureTypes[$("#blocks").val()].startsWith("V")){
            $(".verb").show();
         }else{
            $(".verb").hide();
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
         var text = generateSentence(rng,n,struct,true);
         $("#text,#freq").empty();
         $("#text").append(text);
      });
      $("#generateDictionary").off("click");
      $("#generateDictionary").click(function() {
         var dico = generateDictionary();
         $("#text").html(JSON.stringify(dico));
         $("#dictionary_count").text(dico.dictionary.length);
         // console.log(dico.length)
      });
      $("#wordList").off("click");
      $("#wordList").click(function(){
         var block = $("#blocks").val();
         var text = generateWordList(block);
         $("#text,#freq").empty();
         $("#text").append(text);
      });
      $("#createText").off("click");
      $("#createText").click(function(){
         var min = parseInt($("#minLength").val());
         var max = min + 50;
         if(min > max){
            var newMin = max;
            max = min;
            min = newMin;
            console.log("les valeurs min et max ont été inversées");
         }
         var text = generateText(rng,min,max,true);
         getFrequencies(text);
         $("#text").empty();
         $("#text").append(text);
      });
   };

   function updateVerbCount() {
      var ratio = $("#restriction_verbs").val()/10;
      var count = Math.round(allVerbs.length*ratio);
      $("#verb_count").text(count);
   };

   function updateNounCount() {
      var ratio = $("#restriction_nouns").val()/10;
      var count = Math.round(allNouns.length*ratio);
      $("#noun_count").text(count);
   };

   // function updateDictionaryCount() {
   //    var count = 0;
   //    $("#dictionary_count").text(count);
   // };

   function updateWordList(){
      var currTenses = getCurrTenses();
      if(currTenses.length == 0){
         alert("Vous devez sélectionner au moins un temps");
         return
      }
      tenses = currTenses;
      var verbRatio = $("#restriction_verbs").val()/10;
      var nounRatio = $("#restriction_nouns").val()/10;
      var order = $("#word_order").val();
      // console.log(verbRatio)
      generateWordListFromLexicon({
         rng, order,
         verbs: { ratio: verbRatio }, 
         nouns: { ratio: nounRatio }
      });
   };

   function getCurrTenses() {
      var currTenses = [];
      for(var iTense = 0; iTense < allTenses.length; iTense++){
         if($("[name=tenses]#"+iTense).prop('checked')){
            currTenses.push(iTense);
         }
      }
      return currTenses
   };
};

/*** WORD LIST ***/

function generateWordListFromLexicon(params) {
   generateVerbListFromLexicon(params);
   generateNounListFromLexicon(params);
   updateBatches();

   function generateVerbListFromLexicon(params) {
      var ratio = (params.verbs && params.verbs.ratio) ? params.verbs.ratio : 1;
      var totVerbs = allVerbs.length;
      var nbVerbs = Math.round(totVerbs*ratio);
      var avoirDat = {"id":"12042","1_ortho":"avoir","groupe":"3","tr_direct":"1","tr_indirect":"0","intr":"0","pronominal":"0","aux":"0"};
      var etreDat = {"id":"57185","1_ortho":"être","groupe":"3","tr_direct":"0","tr_indirect":"0","intr":"0","pronominal":"0","aux":"0"};
      var order = params.order || 0;
      if(order == 0){
         var sortedVerbs = allVerbs.sort(function (a,b) { 
            var comp = parseFloat(b["freq_moy"].replace(",",".")) - parseFloat(a["freq_moy"].replace(",",".")); 
            // console.log(comp);
            return comp
         });
      }else{
         var sortedVerbs = allVerbs;
         shuffleArray(sortedVerbs,params.rng);
      }
      // console.log("sortedVerbs:",sortedVerbs);
      verbs.intransitive = [];
      verbs.transitive = [];
      verbs.pronominal = [];
      var verbsIncluded = {};
      var count = 0;
      for(var iVerb = 0; iVerb < nbVerbs; iVerb++){
         var verbDat = sortedVerbs[iVerb];
         if(verbDat.tr_direct == "1"){
            if(!verbsIncluded[verbDat.id])
               verbs.transitive.push([verbDat["1_ortho"],verbDat.groupe, verbDat.aux]);
         }
         if(verbDat.intr == "1"){
            if(!verbsIncluded[verbDat.id])
               verbs.intransitive.push([verbDat["1_ortho"],verbDat.groupe, verbDat.aux]);
         }
         if(verbDat.pronominal != "0"){
            if(!verbsIncluded[verbDat.id])
               verbs.pronominal.push([verbDat["1_ortho"],verbDat.groupe, 1]);
         }
         if(verbDat.tr_direct != "1" && verbDat.intr != "1" && verbDat.pronominal == "0"){
            continue
         }
         count++;
         verbsIncluded[verbDat.id] = true;
      }
      console.log(count,"verbs :",verbs);
   };

   function generateNounListFromLexicon(params) {
      var ratio = (params.nouns && params.nouns.ratio) ? params.nouns.ratio : 1;
      var totNouns = allNouns.length;
      var nbNouns = Math.round(totNouns*ratio);
      var order = params.order || 0;
      if(order == 0){
         var sortedNouns = allNouns.sort(function (a,b) { 
            var comp = parseFloat(b["freq_moy"].replace(",",".")) - parseFloat(a["freq_moy"].replace(",",".")); 
            // console.log(comp);
            return comp
         });
      }else{
         var sortedNouns = allNouns;
         shuffleArray(sortedNouns,params.rng);
      }
      // console.log("sortedNouns:",sortedNouns);
      nouns.lex.M = [];
      nouns.lex.F = [];
      var nounsIncluded = {};
      var count = 0;
      for(var iNoun = 0; iNoun < nbNouns; iNoun++){
         var nounDat = sortedNouns[iNoun];
         if(nounDat["5_genre"] == "m" || !nounDat["5_genre"]){
            if(!nounsIncluded[nounDat.id]){
               nouns.lex.M.push([nounDat["1_ortho"]]);
            }
         }
         if(nounDat["5_genre"] == "f" || !nounDat["5_genre"]){
            if(!nounsIncluded[nounDat.id]){
               nouns.lex.F.push([nounDat["1_ortho"]]);
            }
         }
         count++;
         nounsIncluded[nounDat.id] = true;
      }
      console.log(count,"nouns :",nouns);
   };
};



//Stackoverflow
function shuffleArray(array,rng) {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
};

function getFrequencies(text) {
   var letterFreq = {};
   var digraphFreq = {};
   var wordFreq = {};
   text = cleanUpSpecialChars(text,true);
   var words = text.split(" ");
   var nWords = words.length;
   text = cleanUpSpecialChars(text,false);
   var nLetters = text.length;
   for(var letterIndex in text){
      if(letterFreq[text.charAt(letterIndex)]){
         letterFreq[text.charAt(letterIndex)]++;
      }else{
         letterFreq[text.charAt(letterIndex)] = 1;
      }
      if(letterIndex < nLetters - 1){
         var digraph = text.charAt(letterIndex) + text.charAt(parseInt(letterIndex) + 1);
         if(digraphFreq[digraph]){
            digraphFreq[digraph]++;
         }else{
            digraphFreq[digraph] = 1;
         }
      }
   }
   for(var word of words){
      if(wordFreq[word]){
         wordFreq[word]++;
      }else{
         wordFreq[word] = 1;
      }
   }
   for(var letter in letterFreq){
      letterFreq[letter] = Math.trunc((letterFreq[letter]*100/nLetters)*100)/100;
   }
   for(var digraph in digraphFreq){
      digraphFreq[digraph] = Math.trunc((digraphFreq[digraph]*100/(nLetters - 1))*100)/100;
   }
   for(var word in wordFreq){
      wordFreq[word] = Math.trunc((wordFreq[word]*100/nWords)*100)/100;
   }
   wordFreq = sort(wordFreq);
   displayFreq(letterFreq,digraphFreq,wordFreq);
};

function sort(object) {
   var sortable = [];
   var newObject = {};
   for (var key in object) {
       sortable.push([key, object[key]]);
   }
   sortable.sort(function(a, b) {
       return b[1] - a[1];
   });
   for(var item of sortable){
      newObject[item[0]] = item[1];
   }
   return newObject;
};

function displayFreq(letterFreq,digraphFreq,wordFreq) {
   var referenceLetters = {
      "E": 17.35, "A": 8.2, "S": 7.93, "I": 7.53, "N": 7.17, "T": 6.99, "R": 6.65, "L": 5.92, "U": 5.73, "O": 5.53,
      "D": 4.01, "C": 3.33, "M": 2.97, "P": 2.92, "V": 1.39, "G": 1.09, "F": 1.08, "Q": 1.04, "H": 0.93, "B": 0.92,
      "X": 0.47, "J": 0.34, "Y": 0.31, "Z": 0.1, "K": 0.06, "W": 0.03
   };
   var referenceDigraphs = {
      "ES": 3.05, "LE": 2.22, "DE": 2.17, "RE": 2.1, "EN": 2.08, "ON": 1.64, "NT": 1.62, "ER": 1.53, "TE": 1.52, "ET": 1.43,
      "EL": 1.42, "AN": 1.37, "SE": 1.32, "LA": 1.29, "AI": 1.24, "NE": 1.14, "OU": 1.12, "QU": 1.11, "ME": 1.08, "IT": 1.06,
      "IE": 1.05, "EM": 1.01, "ED": 1.01, "UR": 1.01, "IS": 0.99, "EC": 0.95, "UE": 0.92, "TI": 0.9, "RA": 0.86, "NS": 0.84,
      "IN": 0.84, "TA": 0.82, "CE": 0.81, "AR": 0.8, "EE": 0.79, "EU": 0.78, "SA": 0.76, "CO": 0.74, "EP": 0.71, "ND": 0.7,
      "IL": 0.7, "SS": 0.68, "ST": 0.66, "SI": 0.65, "TR": 0.64, "AL": 0.64, "UN": 0.63, "PA": 0.62, "AU": 0.61, "EA": 0.6,
      "AT": 0.58, "MA": 0.58, "RI": 0.58, "SD": 0.57, "SO": 0.57, "US": 0.57, "UI": 0.56, "LL": 0.53, "NC": 0.53, "VE": 0.53, 
      "LI": 0.52, "RO": 0.51, "IO": 0.51, "OR": 0.5, "PE": 0.48, "OI": 0.48, "PR": 0.47, "PO": 0.46, "IR": 0.46, "NA": 0.45, 
      "UT": 0.44, "TD": 0.44, "CH": 0.44, "OM": 0.43, "SP": 0.43, "SL": 0.42, "DA": 0.42, "AS": 0.42, "MO": 0.41, "AC": 0.4,  
      "DI": 0.4, "RS": 0.39, "DU": 0.39, "TL": 0.38, "TO": 0.38, "TS": 0.38, "RT": 0.37, "AM": 0.37, "AP": 0.37, "SC": 0.36, 
      "LO": 0.36, "AV": 0.35, "SU": 0.35, "EV": 0.34, "NO": 0.33, "RL": 0.33, "NI": 0.32, "GE": 0.31, "RD": 0.31, "LU": 0.31,   
      "NN": 0.3, "HE": 0.29, "PL": 0.28, "IQ": 0.28, "EF": 0.28, "MI": 0.27, "VA": 0.27, "TU": 0.27, "VI": 0.27, "CA": 0.27, 
      "EQ": 0.26, "CI": 0.26, "TT": 0.26, "IC": 0.25, "UX": 0.25, "MM": 0.25, "OL": 0.24,"AG": 0.24, "VO": 0.24, "EI": 0.24, 
      "MP": 0.23, "TP": 0.23, "SM": 0.23, "UL": 0.22, "HA": 0.22, "FI": 0.21, "FA": 0.21, "IM": 0.21, "EG": 0.21, "ID": 0.2, 
      "DO": 0.2, "AD": 0.2, "GR": 0.19, "SQ": 0.19, "AB": 0.19, "BL": 0.18, "UV": 0.18, "IV": 0.18, "NG": 0.18, "TC": 0.17, 
      "IA": 0.17, "OT": 0.17, "CL": 0.17, "RC": 0.17, "RM": 0.17, "OS": 0.17, "OP": 0.16, "CT": 0.16, "FO": 0.16, "UC": 0.16, 
      "UP": 0.16, "RR": 0.16, "JE": 0.16, "HO": 0.16, "UD": 0.15, "CR": 0.15, "EB": 0.15, "EO": 0.15, "IF": 0.15, "FR": 0.14, 
      "RU": 0.14, "UA": 0.14, "NP": 0.14, "IG": 0.14, "BA": 0.14, "BR": 0.14, "OC": 0.14, "CU": 0.14, "FE": 0.13, "UM": 0.13, 
      "EX": 0.13, "BI": 0.13, "BE": 0.13, "GN": 0.13, "MB": 0.13, "AF": 0.12, "HI": 0.12, "EJ": 0.12, "NF": 0.12, "GI": 0.12, 
      "PP": 0.12, "GA": 0.11, "FF": 0.11, "PU": 0.11, "BO": 0.11, "SF": 0.11, "SR": 0.11, "LS": 0.11, "TQ": 0.11, "OD": 0.1, 
      "PH": 0.1, "TM": 0.1, "DR": 0.1, "NU": 0.1, "NV": 0.1, "RN": 0.1, "PI": 0.1, "OB": 0.09, "GU": 0.09, "NL": 0.09, 
      "OG": 0.09, "JO": 0.09, "IP": 0.09, "TH": 0.08, "RP": 0.08, "SB": 0.08, "JA": 0.08, "NM": 0.08, "SN": 0.08, "YS": 0.08, 
      "MU": 0.08, "UB": 0.08, "VR": 0.08, "SV": 0.08, "YA": 0.07, "XE": 0.07, "RG": 0.07, "EZ": 0.07, "CC": 0.07, "NQ": 0.07, 
      "IB": 0.07, "SG": 0.07, "NR": 0.06, "AE": 0.06, "RV": 0.06, "LD": 0.06, "EH": 0.06, "SH": 0.06, "AY": 0.06, "PT": 0.06, 
      "OY": 0.05, "XP": 0.05, "DS": 0.05, "RQ": 0.05, "TF": 0.05, "FL": 0.05, "YE": 0.05, "SJ": 0.05, "LH": 0.05, "JU": 0.05, 
      "LT": 0.05, "FU": 0.05, "UF": 0.05, "AQ": 0.05, "IX": 0.05, "PS": 0.05, "TN": 0.05, "XI": 0.05, "GO": 0.05, "UG": 0.04, 
      "TJ": 0.04, "TV": 0.04, "RB": 0.04, "UO": 0.04, "LQ": 0.04, "SY": 0.04, "AA": 0.04, "TB": 0.04, "HU": 0.04, "AJ": 0.04,
      "BU": 0.04, "OF": 0.04, "XD": 0.04, "RF": 0.04, "LP": 0.04, "NB": 0.03, "UJ": 0.03, "GL": 0.03, "HY": 0.03, "UU": 0.03, 
      "LN": 0.03, "XA": 0.03, "LY": 0.03, "NH": 0.03, "XT": 0.03, "XC": 0.03, "NJ": 0.03, "OV": 0.03, "II": 0.03, "LC": 0.03, 
      "DD": 0.03, "LF": 0.03, "YC": 0.03, "LM": 0.02, "DM": 0.02, "BS": 0.02, "DH": 0.02, "LG": 0.02, "VU": 0.02, "CD": 0.02, 
      "AH": 0.02, "YP": 0.02, "TY": 0.02, "TG": 0.02, "CS": 0.02, "OQ": 0.02, "XM": 0.02, "LR": 0.02, "ZE": 0.02, "CK": 0.02, 
      "AO": 0.02, "UQ": 0.02, "CY": 0.02, "WA": 0.02, "KO": 0.02, "XQ": 0.02, "XL": 0.02, "DL": 0.02, "RJ": 0.02, "IJ": 0.02, 
      "FS": 0.02, "XS": 0.02, "XV": 0.02, "HR": 0.01, "RY": 0.01, "GT": 0.01, "OE": 0.01, "BJ": 0.01, "GM": 0.01, "LV": 0.01, 
      "HN": 0.01, "IU": 0.01, "EY": 0.01, "XU": 0.01, "NY": 0.01, "KE": 0.01, "AZ": 0.01, "MD": 0.01, "RH": 0.01, "YO": 0.01, 
      "YR": 0.01, "ZL": 0.01, "ZO": 0.01, "MY": 0.01, "SW": 0.01, "YM": 0.01, "DP": 0.01, "LB": 0.01, "XO": 0.01, "GS": 0.01, 
      "CQ": 0.01, "RK": 0.01, "OA": 0.01, "MS": 0.01, "OH": 0.01, "ZA": 0.01, "DC": 0.01, "KA": 0.01, "NZ": 0.01, "XF": 0.01, 
      "DT": 0.01, "PD": 0.01, "YL": 0.01, "ZV": 0.01, "MN": 0.01, "UH": 0.01, "BT": 0.01, "DJ": 0.01, "XX": 0.01, "YD": 0.01, 
      "EW": 0.01, "OO": 0.01, "XB": 0.01, "ML": 0.01, "GD": 0.01, "YT": 0.01, "EK": 0.01, "ZD": 0.01, "DY": 0.01, "XN": 0.01, 
      "KI": 0.01, "YN": 0.01, "BB": 0.01, "ZM": 0.01, "CM": 0.01, "AX": 0.01, "CP": 0.01, "LJ": 0.01, "FD": 0.01, "WE": 0.01, 
      "ZP": 0.01, "UY": 0.01, "YF": 0.01, "AK": 0.01, "HM": 0.01, "ZI": 0.01, "DN": 0.01, "MT": 0.01, "WI": 0.01, "XR": 0.01,
      "SX": 0.01, "DQ": 0.01
   };
   var table = "<table id=\"letter_freq\"><thead><tr>";
   table += "<th></th>";
   for(var letter in referenceLetters){
      table += "<th>" + letter + "</th>";
   }
   table += "</tr><tr>";
   table += "<td>Français</td>";
   for(var letter in referenceLetters){
      table += "<td>" + referenceLetters[letter] + "</td>";
   }
   table += "</tr><tr>";
   table += "<td>Texte</td>";
   for(var letter in referenceLetters){
      table += "<td>" + (letterFreq[letter] || 0) + "</td>";
   }
   table += "</tr></table>";
   table += "<table id=\"digraph_freq\"><thead><tr>";
   table += "<th></th>";
   for(var digraph in referenceDigraphs){
      table += "<th>" + digraph + "</th>";
   }
   table += "</tr><tr>";
   table += "<td>Français</td>";
   for(var digraph in referenceDigraphs){
      table += "<td>" + referenceDigraphs[digraph] + "</td>";
   }
   table += "</tr><tr>";
   table += "<td>Texte</td>";
   for(var digraph in referenceDigraphs){
      table += "<td>" + (digraphFreq[digraph] || 0) + "</td>";
   }
   table += "</tr></table>";
   table += "<table id=\"word_freq\"><thead><tr>";
   table += "<th></th>";
   for(var word in wordFreq){
      table += "<th>" + word + "</th>";
   }
   table += "</tr><tr>";
   table += "<td>Texte</td>";
   for(var word in wordFreq){
      table += "<td>" + (wordFreq[word] || 0) + "</td>";
   }
   table += "</tr></table>";


   $("#freq").empty();
   $("#freq").append(table);
};

function generateWordList(block) {
   var text = "";
   var blockLabel = structureTypes[block];
   if(!blockLabel){
      return "";
   }else if(set.hasOwnProperty(blockLabel)){
      for(var subset of set[blockLabel]){
         var subsetIndex = structureTypes.indexOf(subset[0]);
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
   }else if(blockLabel.startsWith("adv-")){
      var batch = batches[blockLabel];
      for(var adv of batch){
         text += adv+"</br>";
      }
   }else{
      var batch = batches[blockLabel];
      var plural = (blockLabel.includes("-P")) ? 1 : 0;
      var personIndex = $("#person").val();
      var person = personIndex%3 + 1;
      var pluralVerb = (personIndex <= 2) ? 0 : 1;
      var tenseIndex = $("#tense").val();
      var tense = allTenses[tenseIndex];
      if(blockLabel === "VT" || blockLabel === "VI" || blockLabel === "VP"){
         var pronominal = (blockLabel == "VP");
         for(var word of batch){
            text += conjugate(word,person,pluralVerb,"M",tense,false,Math.random,pronominal);
            text += "</br>";
         }
      }else{
         for(var subset of batch){
            for(var word of subset[0]){
               text += (plural) ? pluralize(word[0],word[1]) : word[0];
               text += "</br>";
            }
         }
      }
   }
   return text;
};

function getWord(block,person,plural,gender,tense,rng,coBefore) {
   if(set.hasOwnProperty(block)){
      block = pickOne(set[block],rng,false,true);
      return getWord(block,person,plural,gender,tense,rng,coBefore);
   }
   if(block.startsWith("double-")){
      var word1 = getWord(block.substring(7),person,plural,gender,tense,rng,coBefore);
      var word2 = getWord(block.substring(7),person,plural,gender,tense,rng,coBefore);
      var word = word1[0] + " et " + word2[0];
      person = 3;
      plural = 1;
      gender = (word1[3] === "F" && word2[3] === "F") ? "F" : "M";
      return [word,person,plural,gender];
   }
   if(block.endsWith("-de")){
      var word1 = getWord(block.replace(/-de$/,"-beforeDe"),person,plural,gender,tense,rng,coBefore);
      var word2 = getWord("de+Noun",person,plural,gender,tense,rng,coBefore);
      // console.log(word1,word2)
      var countryM = false;
      for(var country of nouns["country"].M){
         if(country[0].toLowerCase() === word2[0].toLowerCase()){
            countryM = true;
         }
      }
      if(countryM){
         var word = elide(word1[0] + " du " + word2[0]);
      }else{
         var word = elide(word1[0] + " de " + word2[0]);
      }
      // console.log(word,word1[1],word1[2],word1[3])
      return [word,word1[1],word1[2],word1[3]];
   }
   if(block.endsWith("-que")){
      var mainSubject = getWord(block.replace(/-que$/,"-beforeQue"),person,plural,gender,tense,rng);
      var structSubRel = pickOne(structuresQue,rng,false,true);
      var subRel = "";
      var personSubRel = 3;
      var pluralSubRel = 0;
      var genderSubRel = "M";
      for(var subBlock of structSubRel){
         var newWord = getWord(subBlock,personSubRel,pluralSubRel,genderSubRel,tense,rng,mainSubject);
         subRel += newWord[0] + " ";
         personSubRel = newWord[1];
         pluralSubRel = newWord[2];
         genderSubRel = newWord[3];
      }
      var word = elide(mainSubject[0] + " que " + subRel);
      return [word,mainSubject[1],mainSubject[2],mainSubject[3]];  
   }
   var batch = batches[block];
   switch(block){
      case "N-M-S-noDet":
      case "N-F-S-noDet":
      case "N-M-S-noDetBeforeQue":
      case "N-F-S-noDetBeforeQue":
      case "CO-M-S-noDet":
      case "CO-F-S-noDet":
      case "CO-M-S-noDetBeforeQue":
      case "CO-F-S-noDetBeforeQue":
      case "N-M-P-noDet":
      case "N-F-P-noDet":
      case "N-M-P-noDetBeforeQue":
      case "N-F-P-noDetBeforeQue":
      case "CO-M-P-noDet":
      case "CO-F-P-noDet":
      case "CO-M-P-noDetBeforeQue":
      case "CO-F-P-noDetBeforeQue":
         person = 3;
         plural = block.includes("-P-") ? 1 : 0;
         gender = block.includes("-F-") ? "F" : "M";
         var type = pickOne(batch,rng,false,true);
         var word = pickOne(type,rng)[plural];
         break;
      case "de+Noun":
         var type = pickOne(batch,rng,false,true);
         var word = pickOne(type,rng)[0];
         // console.log(type,word);
         break;
      case "N-M-S":
      case "N-M-S-adj":
      case "N-M-S-beforeDe":
      case "N-M-S-adj-beforeDe":
      case "N-F-S":
      case "N-F-S-adj":
      case "N-F-S-beforeDe":
      case "N-F-S-adj-beforeDe":
      case "CO-M-S":
      case "CO-F-S":
      case "CO-M-S-adj":
      case "CO-F-S-adj":
      case "CO-M-S-beforeDe":
      case "CO-F-S-beforeDe":
      case "CO-M-S-adj-beforeDe":
      case "CO-F-S-adj-beforeDe":
         person = 3;
         plural = 0;
         gender = block.includes("-M-") ? "M" : "F";
         var type = pickOne(batch,rng,false,true);
         var noun = pickOne(type,rng)[0];
         if(isCountry(noun) || block.endsWith("-beforeDe")){    // if country or before "de"
            var det = getDeterminer(gender,0,"definite_article",rng);
         }else{
            var det = getDeterminer(gender,0,"",rng);
         }
         if(block.endsWith("-adj") || block.includes("-adj-")){
            var word = addAdjective(noun,det,gender,plural,rng);
         }else{
            var word = elide(det + " " + noun);
         }
         break;
      case "N-M-P":
      case "N-M-P-adj":
      case "N-M-P-beforeDe":
      case "N-M-P-adj-beforeDe":
      case "N-F-P":
      case "N-F-P-adj":
      case "N-F-P-beforeDe":
      case "N-F-P-adj-beforeDe":
      case "CO-M-P":
      case "CO-F-P":
      case "CO-M-P-adj":
      case "CO-F-P-adj":
      case "CO-M-P-beforeDe":
      case "CO-F-P-beforeDe":
      case "CO-M-P-adj-beforeDe":
      case "CO-F-P-adj-beforeDe":
         person = 3;
         plural = 1;
         gender = block.includes("-M-") ? "M" : "F";
         var type = pickOne(batch,rng,false,true);
         var nounIndex = Math.trunc(rng() * type.length);
         var noun = pluralize(type[nounIndex][0],type[nounIndex][1]);
         if(block.endsWith("-beforeDe")){ 
            var det = getDeterminer(gender,1,"definite_article",rng);
         }else{
            var det = getDeterminer(gender,1,"",rng);
         }
         if(block.endsWith("-adj") || block.includes("-adj-")){
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
         var word = batch[0][0][0][plural];
         break;
      case "VI":
      case "VT":
      case "VI-neg":
      case "VT-neg":
      case "VI-negWithAdv":
      case "VT-negWithAdv":
         var verb = pickOne(batch,rng);
         var negation = block.includes("-neg") ? 1 : 0;
         var word = conjugate(verb,person,plural,gender,tense,negation,rng,coBefore);
         break;
      case "adv-aftVerb":
      // case "adv-aftNegVerb":
      case "adv-beforeAdj":
      case "adv-locution":
         var word = pickOne(batch,rng);
         break;
      case "VI-str":
      case "VT-str":
         var verbStructure = (tense === "passé_composé") ? pickOne(verbStructuresWithPC[block],rng,false,true) : pickOne(verbStructures[block],rng,false,true);
         var verb = "";
         for(var subBlock of verbStructure){
            verb += getWord(subBlock,person,plural,gender,tense,rng,coBefore)[0]+" ";
         }
         var word = verb;
   }
   if(!word){
      console.log(block);
   }
   return [word,person,plural,gender];
}

function generateText(rng,minLength,maxLength,withSpaces){
   var text = "";
   var curLength = 0;
   while (curLength < minLength) {
      var sentence = generateSentence(rng,1,"all",withSpaces,true);
      curLength += sentence.length;
      text += sentence;
   }
   if(text.length > maxLength){
      text = text.substr(0,minLength + Math.trunc((maxLength - minLength)/2));
   }
   return text;
};

function generateSentence(rng,n,struc,withSpaces,textMode){
   var curLength = 0;
   var text = "";
   for(var iSentence = 0; iSentence < n; iSentence++){
      var sentence = "";
      var structure = (struc === "all") ? pickOne(structures,rng,false,true) : structures[struc][0];
      var person = 3;
      var plural = 0;
      var gender = "M";
      var tenseID = pickOne(tenses,rng);
      var tense = allTenses[tenseID];
      for(var block of structure){
         var word = getWord(block,person,plural,gender,tense,rng);
         person = word[1];
         plural = word[2];
         gender = word[3];
         sentence += word[0]+" ";
      }
      sentence = elide(sentence);
      sentence = cleanUpSpecialChars(sentence, withSpaces);
      // if (sentence.length > (maxLength - curLength - 20)) {
      //    continue;
      // }
      curLength += sentence.length;
      if(!textMode){
         text += "<p>"+sentence+"</p>";
      }else{
         text += sentence;
         if(withSpaces){
            text += " ";
         }
      }
      
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
   var determinerType = (type) ? type : pickOne(determinerTypes,rng,(determinerTypes.length - 1 + plural),true);
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
      if(det.toLowerCase() === "des"){
         det = "de";
      }
      var text = elide(det + " " + adj + " " + noun);
   }else{
      var withAdv = Math.trunc(rng() * 20);
      if(withAdv === 0){
         var adv = pickOne(adverbs["beforeAdj"],rng);
      }else{
         var adv = "";
      }
      var text = elide(det + " " + noun + " " + adv + " " + adj);
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
   if(str.endsWith("s") || str.endsWith("x") || str.endsWith("z")){
      return str;
   }else if(str.endsWith("al") && !exceptionsNouns[0].includes(str) && str != "banal"){
      return str.replace(/al$/,"aux");
   }else if(str.endsWith("ail") && exceptionsNouns[1].includes(str)){
      return str.replace(/ail$/,"aux");
   }else if(str.endsWith("ou") && exceptionsNouns[2].includes(str)){
      return str.replace(/ou$/,"oux");
   }else if((str.endsWith("au") || str.endsWith("eu")) && !exceptionsNouns[3].includes(str)){
      return str.replace(/u$/,"ux");
   }else{
      return str+"s";
   }
};

function conjugate(verb,person,plural,gender,tense,negation,rng,coBefore,pronominal) {
   var infinitive = verb[0].toLowerCase();
   var group = verb[1];
   var aux = verb[2];
   if(tense === "infinitive"){
      return infinitive;
   }else if(tense === "passé_composé" || tense == "plus_que_parfait" || tense == "futur_antérieur"){
      return conjugateCompTense({tense,infinitive,group,aux,person,plural,gender,negation,rng,coBefore});
   }else if(group == 1){
      var ending = conjugations[group-1][tense][person - 1 + plural * 3];
      if(exceptions[1].includes(infinitive)){ // -envoyer
         var ending = speConjugations[33][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oyer$/,ending);
      }else if((infinitive.endsWith("ger") && tense === "present" && person === 1 && plural === 1) || 
         (infinitive.endsWith("ger") && tense === "imparfait" && (plural === 0 || (plural === 1 && person === 3)))){   // exceptions orthographiques (sans tenir compte de l'accentuation)
         ending = "e"+ending;
         var verbConj = infinitive.replace(/er$/,ending);
      }else if((infinitive.endsWith("oyer") || infinitive.endsWith("uyer") || infinitive.endsWith("ayer")) && tense !== "imparfait"){
         if(tense === "present" && plural && (person == 1 || person == 2)){
            var verbConj = infinitive.replace(/er$/,ending);
         }else{
            var verbConj = infinitive.replace(/yer$/,"i"+ending); 
         }
      }else if(infinitive.endsWith("eler") && !exceptions[0].includes(infinitive) && tense !== "imparfait"){
         if(tense === "present" && plural && (person == 1 || person == 2)){
            var verbConj = infinitive.replace(/er$/,ending);
         }else{
            var verbConj = infinitive.replace(/er$/,"l"+ending);
         }
      }else if(infinitive.endsWith("eter") && !exceptions[0].includes(infinitive) && tense !== "imparfait"){
         if(tense === "present" && plural && (person == 1 || person == 2)){
            var verbConj = infinitive.replace(/er$/,ending);
         }else{
            var verbConj = infinitive.replace(/er$/,"t"+ending);
         }
      }else{
         var verbConj = infinitive.replace(/er$/,ending);
      }
   }else if(group == 2){
      var ending = conjugations[group-1][tense][person - 1 + plural * 3];
      var verbConj = infinitive.replace(/r$/,ending);
   }else if(group == 3){
      // console.log("group 3",infinitive)
      if(infinitive === "aller"){
         var verbConj = allerConj[tense][person - 1 + plural * 3];
      }else if(infinitive === "pouvoir"){
         var ending = speConjugations[2][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ouvoir$/,ending);
      }else if(infinitive === "vouloir"){
         var ending = speConjugations[1][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ouloir$/,ending);
      }else if(infinitive === "devoir"){
         var ending = speConjugations[3][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/evoir$/,ending);
      }else if(infinitive === "avoir"){
         var ending = auxConjugations[0][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/avoir$/,ending);
      }else if(infinitive === "être"){
         var ending = auxConjugations[1][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/être$/,ending);
      }else if(exceptionsGroup3[0].includes(verb[0])){ // -soudre
         var ending = speConjugations[5][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/udre$/,ending);
      }else if(exceptionsGroup3[1].includes(verb[0])){ // -croître
         var ending = speConjugations[8][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oître$/,ending);
      }else if(exceptionsGroup3[2].includes(verb[0])){ // -cueillir
         var ending = conjugations[0][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ir$/,ending);
      }else if(exceptionsGroup3[3].includes(verb[0])){ // -quérir
         var ending = speConjugations[9][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/érir$/,ending);
      }else if(exceptionsGroup3[4].includes(verb[0])){ // -aillir
         var ending = speConjugations[14][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ir$/,ending);
      }else if(exceptionsGroup3[5].includes(verb[0])){ // -asseoir
         var ending = speConjugations[15][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/eoir$/,ending);
      }else if(exceptionsGroup3[6].includes(verb[0])){ // -boire
         var ending = speConjugations[17][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oire$/,ending);
      }else if(exceptionsGroup3[7].includes(verb[0])){ // -clure
         var ending = speConjugations[19][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ure$/,ending);
      }else if(exceptionsGroup3[8].includes(verb[0])){ // -vaincre
         var ending = speConjugations[23][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/cre$/,ending);
      }else if(exceptionsGroup3[9].includes(verb[0])){ // -rompre
         var ending = speConjugations[24][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/re$/,ending);
      }else if(exceptionsGroup3[10].includes(verb[0])){ // -coudre
         var ending = speConjugations[25][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/dre$/,ending);
      }else if(exceptionsGroup3[11].includes(verb[0])){ // croire
         var ending = speConjugations[26][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oire$/,ending);
      }else if(exceptionsGroup3[12].includes(verb[0])){ // croître
         var ending = speConjugations[27][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oître$/,ending);
      }else if(exceptionsGroup3[13].includes(verb[0])){ // -servir
         var ending = speConjugations[28][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/vir$/,ending);
      }else if(exceptionsGroup3[14].includes(verb[0])){ // -dormir
         var ending = speConjugations[29][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/mir$/,ending);
      }else if(exceptionsGroup3[15].includes(verb[0])){ // -lire
         var ending = speConjugations[20][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(exceptionsGroup3[16].includes(verb[0])){ // -mouvoir
         var ending = speConjugations[30][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ouvoir$/,ending);
      }else if(exceptionsGroup3[17].includes(verb[0])){ // -fuir
         var ending = speConjugations[31][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ir$/,ending);
      }else if(exceptionsGroup3[18].includes(verb[0])){ // -voir
         var ending = speConjugations[32][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oir$/,ending);
      }else if(exceptionsGroup3[19].includes(verb[0])){ // -valoir
         var ending = speConjugations[34][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/aloir$/,ending);
      }else if(exceptionsGroup3[20].includes(verb[0])){ // inclure
         var ending = speConjugations[24][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/re$/,ending);
      }else if(exceptionsGroup3[21].includes(verb[0])){ // -plaire
         var ending = speConjugations[20][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(exceptionsGroup3[22].includes(verb[0])){ // mourir
         var ending = speConjugations[35][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ourir$/,ending);
      }else if(exceptionsGroup3[23].includes(verb[0])){ // mouvoir
         var ending = speConjugations[36][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ouvoir$/,ending);
      }else if(exceptionsGroup3[24].includes(verb[0])){ // -moudre
         var ending = speConjugations[37][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/dre$/,ending);
      }else if(exceptionsGroup3[26].includes(verb[0])){ // résoudre
         var ending = speConjugations[5][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/udre$/,ending);
      }else if(exceptionsGroup3[27].includes(verb[0])){ // -vivre
         var ending = speConjugations[38][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ivre$/,ending);
      }else if(exceptionsGroup3[28].includes(verb[0])){ // -rire
         var ending = speConjugations[24][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/re$/,ending);
      }else if(exceptionsGroup3[29].includes(verb[0])){ // savoir
         var ending = speConjugations[39][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/avoir$/,ending);
      }else if(exceptionsGroup3[30].includes(verb[0])){ // suffire
         var ending = speConjugations[20][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(exceptionsGroup3[31].includes(verb[0])){ // -suivre
         var ending = speConjugations[40][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/vre$/,ending);
      }else if(exceptionsGroup3[32].includes(verb[0])){ // -vêtir
         var ending = speConjugations[41][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ir$/,ending);
      }else if(exceptionsGroup3[33].includes(verb[0])){ // -pourvoir
         var ending = speConjugations[26][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/oir$/,ending);
      }else if(infinitive.endsWith("enir")){
         var ending = speConjugations[0][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/enir$/,ending);
      // }else if(infinitive.endsWith("ir") && !infinitive.endsWith("oir")&& !infinitive.endsWith("courir") ){
         // var ending = conjugations[0][tense][person - 1 + plural * 3];
         // var verbConj = infinitive.replace(/ir$/,ending);
      }else if(infinitive.endsWith("mettre")){
         var ending = speConjugations[4][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ttre$/,ending);
      }else if(infinitive.endsWith("battre")){
         var ending = speConjugations[4][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ttre$/,ending);
      }else if(infinitive.endsWith("traire")){
         var ending = speConjugations[6][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/aire$/,ending);
      }else if(infinitive.endsWith("courir")){
         var ending = speConjugations[7][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/rir$/,ending);
      }else if(infinitive.endsWith("indre")){
         var ending = speConjugations[10][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ndre$/,ending);
      }else if(infinitive.endsWith("aître")){
         var ending = speConjugations[11][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/aître$/,ending);
      }else if(infinitive.endsWith("cevoir")){
         var ending = speConjugations[12][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/cevoir$/,ending);
      }else if(infinitive.endsWith("prendre")){
         var ending = speConjugations[13][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/endre$/,ending);
      }else if(infinitive.endsWith("dre")){
         var ending = speConjugations[16][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/re$/,ending);
      }else if(infinitive.endsWith("crire")){
         var ending = speConjugations[18][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(infinitive.endsWith("uire")){
         var ending = speConjugations[20][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(infinitive.endsWith("dire")){
         var ending = speConjugations[20][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ire$/,ending);
      }else if(infinitive.endsWith("tir")){
         var ending = speConjugations[21][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/tir$/,ending);
      }else if(infinitive.endsWith("faire")){
         var ending = speConjugations[22][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/aire$/,ending);
      }else if(infinitive.endsWith("vrir") || infinitive.endsWith("frir")){
         var ending = speConjugations[14][tense][person - 1 + plural * 3];
         var verbConj = infinitive.replace(/ir$/,ending);
      }else{
         var verbConj = infinitive;
         console.error("error conj",verbConj);
      }
   }else{
      var verbConj = infinitive;
   }
   if(negation){
      var negationWord = block.endsWith("-negWithAdv") ? "pas" : pickOne(negationWords,rng);
      return elide("ne " + verbConj + " " + negationWord);
   }else{
      return verbConj;
   }
};

function conjugateCompTense(params) {
   var {tense,infinitive,group,aux,person,plural,gender,negation,rng,coBefore} = params;
   var auxTense;
   switch(tense){
      case "passé_composé":
         auxTense = "present";
         break;
      case "plus_que_parfait":
         auxTense = "imparfait";
         break;
      case "futur_antérieur":
         auxTense = "futur";
         break;
      default:
         auxTense = "present";
   }
   var auxConj = auxConjugations[aux][auxTense][person - 1 + plural * 3];
   var fem = 0;
   var pl = 0;
   if(aux == 1 && gender === "F" || (coBefore && aux == 0 && coBefore[3] === "F")){
      fem = 1;
   }
   if(aux == 1 && plural || (coBefore && aux == 0 && coBefore[2])){
      pl = 1;
   }
   var verbPP = getPastParticiple(infinitive,group,fem,pl);

   if(negation){
      var negationWord = block.endsWith("-negWithAdv") ? "pas" : pickOne(negationWords,rng);
      return elide("ne " + auxConj + " " + negationWord + " " + verbPP);
   }else{
      return auxConj + " " + verbPP;
   }
};

function getPastParticiple(infinitive,group,fem,pl) {
   var index = fem + pl*2;
   if(group == 1 || group == 2){
      var ending = pastParticiples[group - 1][index];
      var replace = (group == 1) ? /er$/ : /[iïî]r$/;
   }else if(group == 3){
      if(infinitive === "aller"){
         var ending = pastParticiples[0][index];
         var replace = /er$/;
      }else if(infinitive === "pouvoir"){
         var ending = pastParticiples[2][index];
         var replace = /ouvoir$/;
      }else if(infinitive === "vouloir"){
         var ending = pastParticiples[2][index];
         var replace = /oir$/;
      }else if(infinitive === "devoir"){
         var ending = pastParticiples[3][index];
         var replace = /evoir$/;
      }else if(infinitive === "avoir"){
         var ending = pastParticiples[9][index];
         var replace = /avoir$/;
      }else if(infinitive === "être"){
         var ending = pastParticiples[13][index];
         var replace = /être$/;
      }else if(exceptionsGroup3[0].includes(infinitive)){ // -soudre
         var ending = pastParticiples[5][index];
         var replace = /udre$/;
      }else if(exceptionsGroup3[1].includes(infinitive)){   // -croître
         var ending = pastParticiples[2][index];
         var replace = /oître$/;
      }else if(exceptionsGroup3[2].includes(infinitive)){ // -cueillir
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[3].includes(infinitive)){ // -quérir
         var ending = pastParticiples[6][index];
         var replace = /érir$/;
      }else if(exceptionsGroup3[4].includes(infinitive)){ // -aillir
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[5].includes(infinitive)){ // -asseoir
         var ending = pastParticiples[6][index];
         var replace = /eoir$/;
      }else if(exceptionsGroup3[6].includes(infinitive)){ // -boire
         var ending = pastParticiples[2][index];
         var replace = /oire$/;
      }else if(exceptionsGroup3[7].includes(infinitive)){ // -clure
         var ending = pastParticiples[2][index];
         var replace = /ure$/;
      }else if(exceptionsGroup3[8].includes(infinitive)){ // -vaincre
         var ending = pastParticiples[2][index];
         var replace = /re$/;
      }else if(exceptionsGroup3[9].includes(infinitive)){ // -rompre
         var ending = pastParticiples[2][index];
         var replace = /re$/;
      }else if(exceptionsGroup3[10].includes(infinitive)){ // -coudre
         var ending = pastParticiples[12][index];
         var replace = /dre$/;
      }else if(exceptionsGroup3[11].includes(infinitive)){ // croire
         var ending = pastParticiples[2][index];
         var replace = /oire$/;
      }else if(exceptionsGroup3[12].includes(infinitive)){ // croître
         var ending = pastParticiples[3][index];
         var replace = /oître$/;
      }else if(exceptionsGroup3[13].includes(infinitive)){ // -servir
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[14].includes(infinitive)){ // -dormir
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[15].includes(infinitive)){ // -lire
         var ending = pastParticiples[2][index];
         var replace = /ire$/;
      }else if(exceptionsGroup3[16].includes(infinitive)){ // -ouvoir
         var ending = pastParticiples[2][index];
         var replace = /ouvoir$/;
      }else if(exceptionsGroup3[17].includes(infinitive)){ // -fuir
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[18].includes(infinitive)){ // -voir
         var ending = pastParticiples[2][index];
         var replace = /oir$/;
      }else if(exceptionsGroup3[19].includes(infinitive)){ // -valoir
         var ending = pastParticiples[2][index];
         var replace = /oir$/;
      }else if(exceptionsGroup3[20].includes(infinitive)){ // inclure
         var ending = pastParticiples[14][index];
         var replace = /ure$/;
      }else if(exceptionsGroup3[21].includes(infinitive)){ // -plaire
         var ending = pastParticiples[19][index];
         var replace = /aire$/;
      }else if(exceptionsGroup3[22].includes(infinitive)){ // mourir
         var ending = pastParticiples[15][index];
         var replace = /urir$/;
      }else if(exceptionsGroup3[23].includes(infinitive)){ // mouvoir
         var ending = pastParticiples[3][index];
         var replace = /ouvoir$/;
      }else if(exceptionsGroup3[24].includes(infinitive)){ // moudre
         var ending = pastParticiples[16][index];
         var replace = /dre$/;
      }else if(exceptionsGroup3[25].includes(infinitive)){ // -naître
         var ending = pastParticiples[0][index];
         var replace = /aître$/;
      }else if(exceptionsGroup3[26].includes(infinitive)){ // résoudre
         var ending = pastParticiples[16][index];
         var replace = /udre$/;
      }else if(exceptionsGroup3[27].includes(infinitive)){ // -vivre
         var ending = pastParticiples[17][index];
         var replace = /ivre$/;
      }else if(exceptionsGroup3[28].includes(infinitive)){ // -rire
         var ending = pastParticiples[1][index];
         var replace = /ire$/;
      }else if(exceptionsGroup3[29].includes(infinitive)){ // savoir
         var ending = pastParticiples[2][index];
         var replace = /avoir$/;
      }else if(exceptionsGroup3[30].includes(infinitive)){ // suffire
         var ending = pastParticiples[18][index];
         var replace = /ire$/;
      }else if(exceptionsGroup3[31].includes(infinitive)){ // suivre
         var ending = pastParticiples[1][index];
         var replace = /re$/;
      }else if(exceptionsGroup3[32].includes(infinitive)){ // vêtir
         var ending = pastParticiples[2][index];
         var replace = /ir$/;
      }else if(exceptionsGroup3[33].includes(infinitive)){ // -pourvoir
         var ending = pastParticiples[2][index];
         var replace = /oir$/;
      }else if(infinitive.endsWith("enir")){
         var ending = pastParticiples[2][index];
         var replace = /ir$/;
      // }else if(infinitive.endsWith("ir") && !infinitive.endsWith("oir")&& !infinitive.endsWith("courir") ){
         // var verbPP = infinitive.replace(/i$/,ending);
      }else if(infinitive.endsWith("mettre")){
         var ending = pastParticiples[6][index];
         var replace = /ettre$/;
      }else if(infinitive.endsWith("battre")){
         var ending = pastParticiples[2][index];
         var replace = /re$/;
      }else if(infinitive.endsWith("traire")){
         var ending = pastParticiples[4][index];
         var replace = /aire$/;
      }else if(infinitive.endsWith("courir")){
         var ending = pastParticiples[2][index];
         var replace = /ir$/;
      }else if(infinitive.endsWith("indre")){
         var ending = pastParticiples[7][index];
         var replace = /ndre$/;
      }else if(infinitive.endsWith("aître")){
         var ending = pastParticiples[2][index];
         var replace = /aître$/;
      }else if(infinitive.endsWith("cevoir")){
         var ending = pastParticiples[8][index];
         var replace = /cevoir$/;
      }else if(infinitive.endsWith("prendre")){
         var ending = pastParticiples[6][index];
         var replace = /endre$/;
      }else if(infinitive.endsWith("dre")){
         var ending = pastParticiples[2][index];
         var replace = /re$/;
      }else if(infinitive.endsWith("crire")){
         var ending = pastParticiples[10][index];
         var replace = /ire$/;
      }else if(infinitive.endsWith("uire")){
         var ending = pastParticiples[10][index];
         var replace = /ire$/;
      }else if(infinitive.endsWith("dire")){
         var ending = pastParticiples[10][index];
         var replace = /ire$/;
      }else if(infinitive.endsWith("tir")){
         var ending = pastParticiples[1][index];
         var replace = /ir$/;
      }else if(infinitive.endsWith("faire")){
         var ending = pastParticiples[4][index];
         var replace = /aire$/;
      }else if(infinitive.endsWith("vrir") || infinitive.endsWith("frir")){
         var ending = pastParticiples[11][index];
         var replace = /rir$/;
      }else{
         console.error("error PP",infinitive);
         return false
      }
   }
   var verbPP = infinitive.replace(replace,ending);

   return verbPP
};

function elide(str) {
   // str = cleanUpSpecialChars(str,true);
   str = str.toLowerCase();
   str = str.replace(/[èéêë]/g,"e");
   str = str.replace(/[ôö]/g,"o");
   str = " " + str; 
   str = str.replace(/[ ](le|la)[ ]+([aeiouy][^a])/gi," l'$2");
   str = str.replace(/[ ](ce)[ ]+([aeiouy][^a])/gi," cet $2");
   str = str.replace(/[ ](de|du)[ ]+([aeiouy][^a])/gi," d'$2");
   str = str.replace(/[ ](je)[ ]+([aeiouy][^a])/gi," j'$2");
   str = str.replace(/[ ](ne)[ ]+([aeiouy][^a])/gi," n'$2");
   str = str.replace(/[ ](que)[ ]+([aeiouy][^a])/gi," qu'$2");
   str = str.replace(/[ ]à[ ]+le[ ]/gi," au ");
   str = str.replace(/[ ]à[ ]+les[ ]/gi," aux ");
   str = str.trim();
   var words = str.split(" ");
   str = "";
   for(var wordIndex in words){ // élision pour les mots en H
      // console.log(word);
      var hElide = false;
      if(wordIndex > 0 && (elisionWithH.includes(words[wordIndex]) || isHVerb(words[wordIndex]))){
        words[wordIndex - 1] = elideH( " " + words[wordIndex - 1] + " " + words[wordIndex]);
        words[wordIndex] = "";
      }
   }
   for(var word of words){
      str += word + " ";
   }
   return str;
};

function isHVerb(word) {
   for(var radical of elisionWithHVerb) {
      if(word.startsWith(radical)){
         return true;
      }
   }
   return false;
};

function elideH(str) {
   str = str.replace(/[ ](je)[ ]+(h[aeiouy])/gi," j'$2");
   str = str.replace(/[ ](ne)[ ]+(h[aeiouy])/gi," n'$2");
   str = str.replace(/[ ](le|la)[ ]+(h[aeiouy])/gi," l'$2");
   str = str.replace(/[ ](ce)[ ]+(h[aeiouy])/gi," cet $2");
   str = str.replace(/[ ](de)[ ]+(h[aeiouy])/gi," d'$2");
   str = str.replace(/[ ](que)[ ]+(h[aeiouy])/gi," qu'$2");
   return str;
};

function cleanUpSpecialChars(str, withSpaces, keepDash) {
    str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[àáâãäå]/g,"a");
    str = str.replace(/[ÈÉÊË]/g,"E");
    str = str.replace(/[èéêë]/g,"e");
    str = str.replace(/[îï]/g,"i");
    str = str.replace(/[ôö]/g,"o");
    str = str.replace(/[ùüû]/g,"u");
    str = str.replace(/[Ç]/g,"C");
    str = str.replace(/[ç]/g,"c");
    if(!keepDash){
      str = str.replace(/['-]/g," ");
    }
    str = str.replace(/ {2,}/gi," ");
    if(!keepDash){
      str = str.replace(/[^a-zA-Z ]/gi,''); // final clean up
   }
    str = str.trim();
    if (!withSpaces) {
       str = str.replace(/[ ]/g,"");
    }
    return str.toUpperCase();
};

function pickOne(arr,rng,length,weighting) {
   if(weighting){
      var weightedArray = [];
      for(var weightedElement of arr){
         var element = weightedElement[0];
         var weight = weightedElement[1];
         for(var nTimes = 0; nTimes < weight; nTimes++){
            weightedArray.push(element);
         }
      }
      arr = weightedArray;
   }
   if(length){
      var arrLength = length;
   }else{
      var arrLength = arr.length;
   }
   return arr[Math.trunc(rng() * arrLength)];
};

function isCountry(noun) {
   for(var gender in nouns["country"]){
      for(var country of nouns["country"][gender]){
         if(country[0].toLowerCase() === noun.toLowerCase()){
            return true;
         }
      }
   }
   return false;
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
   // "3P-S",  // 3ème personne du singulier, regroupe plusieurs types (cf. array set)
   "1P-P",
   "2P-P",
   // "3P-P",  // 3ème personne du pluriel, regroupe plusieurs types (cf. array set)
   "VI",    // verbe intransitif
   "VT",    // verbe transitif
   "VP",    // verbe pronominal
   "CO-M-S-noDet",   // complément d'objet direct masculin singulier sans déterminant
   "CO-M-S",
   "CO-F-S-noDet",
   "CO-F-S",
   "CO-M-P-noDet",
   "CO-M-P",
   "CO-F-P-noDet",
   "CO-F-P",
   "adjBefore",
   "adjAfter",
   "adv-aftVerb",
   // "adv-aftNegVerb",
   "adv-beforeAdj",
   "adv-locution",
   "de+Noun" // nom après "de"
];
const structures = [ // [structure,weight]
   [["3P-S","VI-str"],80],
   [["3P-P","VI-str"],40],
   [["3P-S","VT-str","CO"],160],
   [["3P-P","VT-str","CO"],80],
   [["1P-S","VI-str"],20],
   [["2P-S","VI-str"],20],
   [["1P-P","VI-str"],10],
   [["2P-P","VI-str"],10],
   [["1P-S","VT-str","CO"],40],
   [["2P-S","VT-str","CO"],40],
   [["1P-P","VT-str","CO"],20],
   [["2P-P","VT-str","CO"],20],
   [["adv-locution","3P-S","VI-str"],20],
   [["adv-locution","3P-P","VI-str"],10],
   [["adv-locution","3P-S","VT-str","CO"],40],
   [["adv-locution","3P-P","VT-str","CO"],20],
   [["adv-locution","1P-S","VI-str"],5],
   [["adv-locution","2P-S","VI-str"],5],
   [["adv-locution","1P-P","VI-str"],3],
   [["adv-locution","2P-P","VI-str"],3],
   [["adv-locution","1P-S","VT-str","CO"],10],
   [["adv-locution","2P-S","VT-str","CO"],10],
   [["adv-locution","1P-P","VT-str","CO"],5],
   [["adv-locution","2P-P","VT-str","CO"],5],

   /*** avec subordonnée relative en "que" ***/
   [["3P-S-que","VI-str"],16],
   [["3P-P-que","VI-str"],8],
   [["3P-S-que","VT-str","CO"],32],
   [["3P-P-que","VT-str","CO"],16],
   [["adv-locution","3P-S-que","VI-str"],4],
   [["adv-locution","3P-P-que","VI-str"],2],
   [["adv-locution","3P-S-que","VT-str","CO"],16],
   [["adv-locution","3P-P-que","VT-str","CO"],4],
   [["3P-S","VT-str","CO-que"],32],
   [["3P-P","VT-str","CO-que"],16],
   [["1P-S","VT-str","CO-que"],8],
   [["2P-S","VT-str","CO-que"],8],
   [["1P-P","VT-str","CO-que"],4],
   [["2P-P","VT-str","CO-que"],4],
   [["adv-locution","3P-S","VT-str","CO-que"],8],
   [["adv-locution","3P-P","VT-str","CO-que"],4],
   [["adv-locution","1P-S","VT-str","CO-que"],2],
   [["adv-locution","2P-S","VT-str","CO-que"],2],
   [["adv-locution","1P-P","VT-str","CO-que"],1],
   [["adv-locution","2P-P","VT-str","CO-que"],1],
   [["3P-S-que","VT-str","CO-que"],32],
   [["3P-P-que","VT-str","CO-que"],16],
   [["adv-locution","3P-S-que","VT-str","CO-que"],8],
   [["adv-locution","3P-P-que","VT-str","CO-que"],4]
];
const structuresQue = [ // structures de subordonnée relative suivant "que"
   [["3P-S","VT-str"],80],
   [["3P-P","VT-str"],40],
   [["1P-S","VT-str"],20],
   [["2P-S","VT-str"],20],
   [["1P-P","VT-str"],10],
   [["2P-P","VT-str"],10],
];
const verbStructures = {
   "VI-str": [   // [structure,weight]
      [["VI"],100],
      [["VI","adv-aftVerb"],5],
      [["VI-neg"],10],
      // [["VI-negWithAdv","adv-aftNegVerb"],1]
   ],
   "VT-str": [   // [structure,weight]
      [["VT"],100],
      [["VT","adv-aftVerb"],5],
      [["VT-neg"],10],
      // [["VT-negWithAdv","adv-aftNegVerb"],1]
   ]
};
const verbStructuresWithPC = {
   "VI-str": [   // [structure,weight]
      [["VI"],100],
      [["VI-neg"],10]
   ],
   "VT-str": [   // [structure,weight]
      [["VT"],100],
      [["VT-neg"],10]
   ]
};
const allTenses = [
   "present",
   "imparfait",
   "futur",
   "passé_composé",
   "plus_que_parfait",
   "futur_antérieur"
];
var tenses = [ 0, 1, 2, 3, 4, 5 ];

var batches = {};
updateBatches();
function updateBatches() {
   const nmsNoDet = [   // [subset,weight]
      [nouns["name"].M,1],
      [pronouns["demonstrative"].M,1],
      [pronouns["indefinite"].M.filter(word => word[0] != ""),1],
      [[["il"]],1],
      [[["le mien"],["le tien"],["le sien"],["le vôtre"],["le nôtre"],["le leur"]],1]
   ];
   const nmsNoDetBeforeQue = [   // [subset,weight]
      [nouns["name"].M,2],
      [pronouns["demonstrative_2"].M,2],
      [[["le mien"],["le tien"],["le sien"],["le vôtre"],["le nôtre"],["le leur"],["Quelque chose"]],1]
   ];
   const nfsNoDet = [   // [subset,weight]
      [nouns["name"].F,1],
      // [nouns["city"],1],
      [pronouns["demonstrative"].F,1],
      [pronouns["indefinite"].F.filter(word => word[0] != ""),1],
      [[["elle"]],1],
      [[["la mienne"],["la tienne"],["la sienne"],["la vôtre"],["la nôtre"],["la leur"]],1]
   ];
   const nfsNoDetBeforeQue = [   // [subset,weight]
      [nouns["name"].F,1],
      // [nouns["city"],1],
      [pronouns["demonstrative_2"].F,1],
      [[["la mienne"],["la tienne"],["la sienne"],["la vôtre"],["la nôtre"],["la leur"]],1]
   ];
   const nmpNoDet = [   // [subset,weight]
      [pronouns["demonstrative"].M.filter(word => word[1] != ""),1],
      [pronouns["indefinite"].M.filter(word => word[1] != ""),1],
      [[["","ils"]],1],
      [[["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const nmpNoDetBeforeQue = [   // [subset,weight]
      [pronouns["demonstrative_2"].M.filter(word => word[1] != ""),1],
      [pronouns["indefinite"].M.filter(word => word[1] != ""),1],
      [[["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const nfpNoDet = [   // [subset,weight]
      [pronouns["demonstrative"].F,1],
      [pronouns["indefinite"].F.filter(word => word[1] != ""),1],
      [[["","elles"]],1],
      [[["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const nfpNoDetBeforeQue = [   // [subset,weight]
      [pronouns["demonstrative_2"].F,1],
      [pronouns["indefinite"].F.filter(word => word[1] != ""),1],
      [[["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const nms = [  // [subset,weight]
      // [nouns["job"].M,1],
      // [nouns["animal"].M,1],
      // [nouns["plant"].M,1],
      [nouns["lex"].M,10],
      [nouns["country"].M,1]
   ];
   const nfs = [  // [subset,weight]
      // [nouns["job"].F,1],
      // [nouns["animal"].F,1],
      // [nouns["plant"].F,1],
      [nouns["lex"].F,10],
      [nouns["country"].F,1]
   ];
   const nmp = [  // [subset,weight]
      // [nouns["job"].M,1],
      // [nouns["animal"].M,1],
      // [nouns["plant"].M,1]
      [nouns["lex"].M,1]
   ];
   const nfp = [  // [subset,weight]
      // [nouns["job"].F,1],
      // [nouns["animal"].F,1],
      // [nouns["plant"].F,1]
      [nouns["lex"].F,1]
   ];
   const p1 = [[[["je","nous"]]]];
   const p2 = [[[["tu","vous"]]]];

   const comsNoDet = [  // [subset,weight]
      [nouns["name"].M,1],
      [pronouns["demonstrative"].M,1],
      [pronouns["indefinite"].M.filter(word => (word[0].toLowerCase() != "on" && word[0].toLowerCase() != "quiconque" && word[0].toLowerCase() != "chacun" && word[0] != "")),1],
      [[["le mien"],["le tien"],["le sien"],["le vôtre"],["le nôtre"],["le leur"]],1]
   ];
   const comsNoDetBeforeQue = nmsNoDetBeforeQue;
   const cofsNoDet = [  // [subset,weight]
      [nouns["name"].F,1],
      [nouns["city"],1],
      [pronouns["demonstrative"].F,1],
      [[["la mienne"],["la tienne"],["la sienne"],["la vôtre"],["la nôtre"],["la leur"]],1]
   ];
   const cofsNoDetBeforeQue = nfsNoDetBeforeQue;
   const compNoDet = [  // [subset,weight]
      [pronouns["demonstrative"].M.filter(word => word[1] != ""),1],
      [[["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const compNoDetBeforeQue = [   // [subset,weight]
      [pronouns["demonstrative_2"].M.filter(word => word[1] != ""),1],
      [[["","les miens"],["","les tiens"],["","les siens"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const cofpNoDet = [  // [subset,weight]
      [pronouns["demonstrative"].F,1],
      [[["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];
   const cofpNoDetBeforeQue = [   // [subset,weight]
      [pronouns["demonstrative_2"].F,1],
      [[["","les miennes"],["","les tiennes"],["","les siennes"],["","les vôtres"],["","les nôtres"],["","les leurs"]],1]
   ];

   const nmsBeforeDe = [
      // [nouns["job"].M,1],
      // [nouns["animal"].M,1],
      // [nouns["plant"].M,1]
      [nouns["lex"].M,1]
   ];
   const nfsBeforeDe = [  // [subset,weight]
      // [nouns["job"].F,1],
      // [nouns["animal"].F,1],
      // [nouns["plant"].F,1]
      [nouns["lex"].F,1]
   ];

   const deNoun = [
      // [nouns["lex"].M,10],
      // [nouns["lex"].F,10],
      [nouns["name"].M,1],
      [nouns["name"].F,1],
      [nouns["city"],1],
      [nouns["country"].M,1],
      [nouns["country"].F,1]
   ];

   batches = {
      "N-M-S-noDet": nmsNoDet,
      "N-F-S-noDet": nfsNoDet,
      "N-M-S-noDetBeforeQue": nmsNoDetBeforeQue,
      "N-F-S-noDetBeforeQue": nfsNoDetBeforeQue,
      "N-M-P-noDet": nmpNoDet,
      "N-F-P-noDet": nfpNoDet,
      "N-M-P-noDetBeforeQue": nmpNoDetBeforeQue,
      "N-F-P-noDetBeforeQue": nfpNoDetBeforeQue,
      "N-M-S": nms,
      "N-M-S-adj": nms,
      "N-M-S-beforeDe": nmsBeforeDe, // N-M-S with definite article (before "de")
      "N-M-S-adj-beforeDe": nmsBeforeDe,
      "N-F-S": nfs,
      "N-F-S-adj": nfs,
      "N-F-S-beforeDe": nfsBeforeDe, // N-F-S with definite article (before "de")
      "N-F-S-adj-beforeDe": nfsBeforeDe,
      "N-M-P": nmp,
      "N-M-P-adj": nmp,
      "N-M-P-beforeDe": nmsBeforeDe, // N-M-P with definite article (before "de")
      "N-M-P-adj-beforeDe": nmsBeforeDe,
      "N-F-P": nfp,
      "N-F-P-adj": nfp,
      "N-F-P-beforeDe": nfsBeforeDe, // N-F-P with definite article (before "de")
      "N-F-P-adj-beforeDe": nfsBeforeDe,
      "1P-S": p1,
      "2P-S": p2,
      "1P-P": p1,
      "2P-P": p2,
      "VI": verbs["intransitive"],
      "VT": verbs["transitive"],
      "VP": verbs["pronominal"],
      "VI-neg": verbs["intransitive"],
      "VT-negWithAdv": verbs["transitive"],
      "VI-negWithAdv": verbs["intransitive"],
      "VT-neg": verbs["transitive"],
      "CO-M-S-noDet": comsNoDet,
      "CO-F-S-noDet": cofsNoDet,
      "CO-M-S-noDetBeforeQue": comsNoDetBeforeQue,
      "CO-F-S-noDetBeforeQue": cofsNoDetBeforeQue,
      "CO-M-S": nms,
      "CO-F-S": nfs,
      "CO-M-S-adj": nms,
      "CO-F-S-adj": nfs,
      "CO-M-S-beforeDe": nmsBeforeDe,
      "CO-F-S-beforeDe": nfsBeforeDe,
      "CO-M-S-adj-beforeDe": nmsBeforeDe,
      "CO-F-S-adj-beforeDe": nfsBeforeDe,
      "CO-M-P-noDet": compNoDet,
      "CO-F-P-noDet": cofpNoDet,
      "CO-M-P-noDetBeforeQue": compNoDetBeforeQue,
      "CO-F-P-noDetBeforeQue": cofpNoDetBeforeQue,
      "CO-M-P": nmp,
      "CO-F-P": nfp,
      "CO-M-P-adj": nmp,
      "CO-F-P-adj": nfp,
      "CO-M-P-beforeDe": nmsBeforeDe,
      "CO-F-P-beforeDe": nfsBeforeDe,
      "CO-M-P-adj-beforeDe": nmsBeforeDe,
      "CO-F-P-adj-beforeDe": nfsBeforeDe,
      "adv-aftVerb": adverbs["aftVerb"],
      // "adv-aftNegVerb": adverbs["aftNegVerb"],
      "adv-beforeAdj": adverbs["beforeAdj"],
      "adv-locution": adverbs["locution"],
      "de+Noun": deNoun   // préposition de + nom
   };
};

const set = {
   "3P-S": [
      ["N-M-S-noDet",1],
      ["N-M-S",1],
      ["N-M-S-de",1],      // groupe (N-M-S + de + nom)
      ["N-M-S-adj",1],
      ["N-M-S-adj-de",1],
      ["N-F-S-noDet",1],
      ["N-F-S",1],
      ["N-F-S-de",1],
      ["N-F-S-adj",1],
      ["N-F-S-adj-de",1] 
   ],
   "3P-S-beforeQue": [
      ["N-M-S-noDetBeforeQue",1],
      ["N-M-S",1],
      ["N-M-S-de",1],      // groupe (N-M-S + de + nom)
      ["N-M-S-adj",1],
      ["N-M-S-adj-de",1],
      ["N-F-S-noDetBeforeQue",1],
      ["N-F-S",1],
      ["N-F-S-de",1],
      ["N-F-S-adj",1],
      ["N-F-S-adj-de",1] 
   ],
   "3P-P": [
      ["N-M-P-noDet",1],
      ["N-M-P",1],
      ["N-M-P-de",1],
      ["N-M-P-adj",1],
      ["N-M-P-adj-de",1],
      ["N-F-P-noDet",1],
      ["N-F-P",1],
      ["N-F-P-de",1],
      ["N-F-P-adj",1],
      ["N-F-P-adj-de",1],
      ["double-3P",2]   // sujet1 + "et" + sujet2 
   ],
   "3P-P-beforeQue": [
      ["N-M-P-noDetBeforeQue",1],
      ["N-M-P",1],
      ["N-M-P-de",1],
      ["N-M-P-adj",1],
      ["N-M-P-adj-de",1],
      ["N-F-P-noDetBeforeQue",1],
      ["N-F-P",1],
      ["N-F-P-de",1],
      ["N-F-P-adj",1],
      ["N-F-P-adj-de",1],
      ["double-3P",2]   // sujet1 + "et" + sujet2 
   ],
   "3P": [  // pour les groupes de 2 sujets
      ["CO-M-S-noDet",1],
      ["N-M-S",1],
      ["N-M-S-de",1], 
      ["N-M-S-adj",1],
      ["N-M-S-adj-de",1],
      ["CO-F-S-noDet",1],
      ["N-F-S",1],
      ["N-F-S-de",1],
      ["N-F-S-adj",1],
      ["N-F-S-adj-de",1], 
      ["CO-M-P-noDet",1],
      ["N-M-P",1],
      ["N-M-P-de",1],
      ["N-M-P-adj",1],
      ["N-M-P-adj-de",1],
      ["CO-F-P-noDet",1],
      ["N-F-P",1],
      ["N-F-P-de",1] ,
      ["N-F-P-adj",1],
      ["N-F-P-adj-de",1]
   ],  
   "CO": [
      ["CO-M-S-noDet",1],
      ["CO-M-S",1],
      ["CO-M-S-de",1],
      ["CO-M-S-adj",1],
      ["CO-M-S-adj-de",1],
      ["CO-F-S-noDet",1],
      ["CO-F-S",1],
      ["CO-F-S-de",1],
      ["CO-F-S-adj",1],
      ["CO-F-S-adj-de",1],
      ["CO-M-P-noDet",1],
      ["CO-M-P",1],
      ["CO-M-P-de",1],
      ["CO-M-P-adj",1],
      ["CO-M-P-adj-de",1],
      ["CO-F-P-noDet",1],
      ["CO-F-P",1],
      ["CO-F-P-de",1],
      ["CO-F-P-adj",1],
      ["CO-F-P-adj-de",1]
   ],
   "CO-beforeQue": [
      ["CO-M-S-noDetBeforeQue",1],
      ["CO-M-S",1],
      ["CO-M-S-de",1],
      ["CO-M-S-adj",1],
      ["CO-M-S-adj-de",1],
      ["CO-F-S-noDetBeforeQue",1],
      ["CO-F-S",1],
      ["CO-F-S-de",1],
      ["CO-F-S-adj",1],
      ["CO-F-S-adj-de",1],
      ["CO-M-P-noDetBeforeQue",1],
      ["CO-M-P",1],
      ["CO-M-P-de",1],
      ["CO-M-P-adj",1],
      ["CO-M-P-adj-de",1],
      ["CO-F-P-noDetBeforeQue",1],
      ["CO-F-P",1],
      ["CO-F-P-de",1],
      ["CO-F-P-adj",1],
      ["CO-F-P-adj-de",1]
   ]
};

if(typeof exports != 'undefined') {
    exports.generate = generateText;
    exports.generateSentence = generateSentence;
    exports.generateDictionary = generateDictionary;
}
