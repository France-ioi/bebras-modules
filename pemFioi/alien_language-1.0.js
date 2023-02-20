/* DATA */

const voyels = [ "A", "E", "I", "O", "U", "Y" ];
const consonants = [ "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z" ];
const defaultNbMissingVoyels = 1;
const defaultNbMissingConsonants = 2;

const defaultGramTypeData = {
   0: { label: "nom" }, // attributes: { fixed: [], variable: {} }, spellingRules: [], inflections: { attrID: { valID: inflID }}
   1: { label: "pronom" },
   2: { label: "verbe" },
   3: { label: "adverbe" },
   4: { label: "adjectif" },
   5: { label: "article" },
   6: { label: "conjonction" },
   7: { label: "préposition" },
   8: { label: "postposition" },
};
const defaultGramTypes = [0,1,2,3,4,5,6,7,8];
const defaultMandatoryTypes = [0,2,4];
const defaultNbMandatoryTypes = 2;
const defaultNbGramTypes = 5;
const defaultNbGramTypesWithNoAttr = 1;
const defaultNbNoInflection = 1; // for one gram type, among all attr values, how many have no inflection

const defaultAttributes = [0,1,2,3,4,5,6,7,8];
const defaultAttributeData = {
   0: { label: "genre", 
      values: [ 
         { id: 0, label: "masculin" }, 
         { id: 1, label: "féminin" }, 
         { id: 2, label: "neutre" }, 
      ] },
   1: { label: "nombre", 
      values: [
         { id: 0, label: "singulier" }, 
         { id: 1, label: "pluriel" }, 
      ] },
   2: { label: "groupe",
      values: [
         { id: 0, label: "1er groupe" },
         { id: 1, label: "2ème groupe" },
         { id: 2, label: "3ème groupe" },
      ] },
   3: { label: "personne", 
      values: [
         { id: 0, label: "1e pers"},
         { id: 1, label: "2e pers"},
         { id: 2, label: "3e pers"},
      ] },
   4: { label: "mode", 
      values: [
         { id: 0, label: "infinitif" },
         { id: 1, label: "indicatif" },
         { id: 2, label: "impératif" },
         { id: 3, label: "conditionnel" },
         { id: 4, label: "subjonctif" },
         { id: 5, label: "participe" },
      ] },
   5: { label: "temps", 
      values: [
         { id: 0, label: "présent" },
         { id: 1, label: "passé simple" },
         { id: 2, label: "passé composé" },
         { id: 3, label: "passé antérieur" },
         { id: 4, label: "imparfait" },
         { id: 5, label: "plus-que-parfait" },
         { id: 6, label: "futur" },
         { id: 7, label: "futur antérieur" },
      ] },
   6: { label: "âge", 
      values: [
         { id: 0, label: "adulte" },
         { id: 1, label: "senior" },
         { id: 2, label: "jeune" },
         { id: 3, label: "enfant" },
      ] },
   7: { label: "politesse", 
      values: [
         { id: 0, label: "informel" },
         { id: 1, label: "poli" },
         { id: 2, label: "honorifique" },
         { id: 3, label: "humble" },
      ] },
   8: { label: "définition", 
      values: [
         { id: 0, label: "défini" },
         { id: 1, label: "indéfini" },
         { id: 2, label: "partitif" },
         { id: 3, label: "numérique" },
      ] },
};
const defaultNbAttributes = 5;
const defaultMaxNbWordsInSentence = 10;

let rng = Math.random; 
let allGramTypes;
let gramTypes;
let gramTypeData;
let allAttributes;
let attributes;
let attributeData;
let attributeValues = { /* id: [] */ };
let attributeDistribution = { /* id: { fixed: [], variable: [] } */ };
let nbGramTypes, nbAttributes;
let mandatoryTypes, nbMandatoryTypes;
let nbNoInflection;

let maxNbStems = 1000;  // max nb stems per gram type
let minNbStems = 10;    // min nb stems per gram type
let maxStemLength = 10;
let minStemLength = 1;
let maxNbAttrValues = 10;
let minNbAttrValues = 2;
let maxPrefixLength = 3;
let maxSuffixLength = 3;
let maxInfixLength = 2;
let maxVoy = 2 // no more than x successive voyels
let maxSameVoy = 2 // no more than x times same voyel in a row
let maxCon = 2 // no more than x successive consonants
let maxSameCon = 2 // no more than x times same consonant in a row

let letterWeight;
let lettersWeighted;
let nbMissingVoyels, nbMissingConsonants;

let stemSpellingRules;
let inflectionRules;

let prefixes;
let suffixes;
let infixes;

let wordList;
let structures;

function initUI() {
   createAlienLanguage();

   createForm();
   initHandlers();

   function createForm() {
      let html = "<div>";
      html += "<button id='reset' class='margin_bottom'>Réinitialiser</button>";
      html += "<fieldset class='margin_bottom'>";
      html += "<legend>Afficher</legend>";
      html += "<button id=\"display_gram\" class='margin_right'>Catégories grammaticales</button>";
      html += "<button id=\"display_attr\" class='margin_right'>Attributs</button>";
      html += "<button id=\"display_letters\" class='margin_right'>fréquence des lettres</button>";
      html += "<button id=\"display_affixes\" class='margin_right'>affixes</button>";
      html += "</fieldset>";
      html += "<fieldset class='margin_bottom'>";
      html += "<legend>Règles de construction des mots</legend>";
      html += "<button id=\"display_gram_rules\" class='margin_right'>Radicaux</button>";
      html += "<button id=\"display_infl_rules\" class='margin_right'>Inflexions</button>";
      html += "</fieldset>";
      html += "<fieldset class='margin_bottom'>";
      html += "<legend>Liste de radicaux</legend>";
      html += selectWordList();
      html += "<button id=\"display_word_list\">Voir</button>";
      html += "</fieldset>";
      html += "<fieldset>";
      html += "<legend>Générer phrase</legend>";
      html += selectStructure();
      html += "</br>";
      html += selectSentenceNumber();
      html += "<button id=\"generate_sentence\">Générer</button>";
      html += "</fieldset>";
      html += "</div>";
      $("#form").html(html);
   };

   function selectWordList() {
      let html = "<label for=\"word_list\">Type</label>";
      html += "<select id=\"word_list\">";
      html += updateSelectWordList();
      html += "</select>";
      return html
   };

   function updateSelectWordList() {
      let html = "";
      for(let gramTypeID of gramTypes){
         let label = gramTypeData[gramTypeID].label;
         html += "<option value=\""+gramTypeID+"\">"+label+"</option>";
      }
      if($("#word_list").length){
         $("#word_list").html(html);
      }else{
         return html
      }
   };

   function selectStructure() {
      let html = "<label for=\"structure\">Structure</label>";
      html += "<select id=\"structure\" class='margin_bottom'>";
      html += updateSelectStructure();
      html += "</select>";
      return html
   };

   function updateSelectStructure() {
      let html = "";
      for(let iStr = 0; iStr <= structures.length; iStr++){
         let name = "";
         if(iStr == 0){
            name = "Toutes";
         }else{
            let str = structures[iStr - 1];
            for(let iType = 0; iType < str.length; iType++){
               let gramTypeID = str[iType];
               let label = gramTypeData[gramTypeID].label;
               name += label;
               if(iType < str.length - 1){
                  name += " - ";
               }
            }
         }
         html += "<option value=\""+iStr+"\">"+name+"</option>";
      }
      if($("#structure").length){
         $("#structure").html(html);
      }else{
         return html
      }
   };

   function selectSentenceNumber() {
      var html = "<label for=\"nb_sentences\">Nombre de phrases</label>";
      html += "<select id=\"nb_sentences\">";
      for(var i = 0; i < 3; i++){
         html += "<option value=\""+Math.pow(10,i)+"\">"+Math.pow(10,i)+"</option>";
      }
      html += "</select>";
      return html;
   };

   function initHandlers() {
      $("#reset").off("click");
      $("#reset").click(reset);
      $("#display_gram").off("click");
      $("#display_gram").click(displayGram);
      $("#display_attr").off("click");
      $("#display_attr").click(displayAttr);
      $("#display_letters").off("click");
      $("#display_letters").click(displayLetters);
      $("#display_affixes").off("click");
      $("#display_affixes").click(displayAffixes);
      $("#display_gram_rules").off("click");
      $("#display_gram_rules").click(displayGramRules);
      $("#display_infl_rules").off("click");
      $("#display_infl_rules").click(displayInflectionRules);
      $("#display_word_list").off("click");
      $("#display_word_list").click(displayWordList);
      $("#generate_sentence").off("click");
      $("#generate_sentence").click(displaySentences);
   };

   function reset() {
      $("#text").empty();
      createAlienLanguage();
      updateSelectWordList();
      updateSelectStructure();
   };

   function displayGram() {
      // console.log("display_gram")
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th>cat. gram.</th><th>nb de lemmes</th><th>attributs (F: fixe, V: variable)</th></tr>";
      for(let gramTypeID of gramTypes){
         html += "<tr>";
         let { label, nbLem, attributes } = gramTypeData[gramTypeID];
         html += "<td>"+label+"</td>";
         html += "<td>"+nbLem+"</td>";
         html += "<td>";
         let allAttr = attributes.fixed.concat(attributes.variable);
         for(let attrID of allAttr){
            let type = (attributes.fixed.includes(attrID)) ? "F" : "V";
            let name = attributeData[attrID].label;
            html += name+" ("+type+")</br>";
         }
         html += "</td></tr>";
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayAttr() {
      // console.log("display_attr")
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th>attr.</th><th>valeurs</th><th>cat. gram. (F: fixe, V: variable)</th></tr>";
      for(let attrID of attributes){
         html += "<tr>";
         let label = attributeData[attrID].label;
         let values = attributeValues[attrID];
         let distribution = attributeDistribution[attrID];
         html += "<td>"+label+"</td>";
         html += "<td>";
         for(let valID of values){
            let name = attributeData[attrID].values[valID].label;
            html += name+"</br>";
         }
         html += "</td><td>";
         // if(distribution){
            var allGram = cloneObj(distribution.variable);
            if(distribution.fixed !== undefined){
               allGram.unshift(distribution.fixed);
            }
            for(let gramID of allGram){
               // console.log(gramID)
               let type = (distribution.fixed == gramID) ? "F" : "V";
               let name = gramTypeData[gramID].label;
               html += name+" ("+type+")</br>";
            }
         // }
         html += "</td></tr>";
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayLetters() {
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th colspan=2>voyelles</th><th colspan=2>consonnes</th></tr>";
      html += "<tr><th>lettre</th><th>poids</th><th>lettre</th><th>poids</th></tr>";
      let nbRows = consonants.length - nbMissingConsonants;
      let letters = [];
      for(var type = 0; type < 2; type++){
         letters[type] = [];
         for(var letter in letterWeight[type]){
            letters[type].push(letter);
         }
      }
      for(let row = 0; row < nbRows; row++){
         html += "<tr>";
         for(var type = 0; type < 2; type++){
            var letter = letters[type][row];
            if(letter){
               let weight = letterWeight[type][letter];
               html += "<td>"+letter+"</td><td>"+weight+"</td>";
            }else{
               html += "<td></td><td></td>";
            }
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayAffixes() {
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th>préfixes</th><th>infixes</th><th>suffixes</th></tr>";
      let nbRows = Math.max(prefixes.length,suffixes.length,infixes.length);
      var src = [prefixes,infixes,suffixes];
      for(let row = 0; row < nbRows; row++){
         html += "<tr>";
         for(var type = 0; type < 3; type++){
            var aff = src[type][row];
            if(aff){
               html += "<td>"+aff+"</td>";
            }else{
               html += "<td></td>";
            }
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayGramRules() {
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th>cat. gram.</th><th>longueur min/max </br>(de la base sans affixe)</th><th>préfixe</th><th>infixes</th><th>suffixes</th></tr>";
      var src = [prefixes,infixes,suffixes];
      for(let gramTypeID of gramTypes){
         let { label, spellingRules } = gramTypeData[gramTypeID];
         html += "<tr>";
         for(var col = 0; col < 5; col++){
            html += "<td>";
            switch(col){
            case 0:
               html += label;
               break;
            case 1:
               let { min, max } = stemSpellingRules[0].gramTypes[gramTypeID];
               html += min+"/"+max;
               break;
            case 2:
            case 3:
            case 4:
               let ruleID = col - 1;
               if(spellingRules.includes(ruleID)){
                  let affID = stemSpellingRules[ruleID].gramTypes[gramTypeID];
                  html += src[ruleID - 1][affID];
               }
               break;
            }
            html += "</td>";
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayInflectionRules() {
      $("#text").empty();
      let html = "<table>";
      html += "<tr><th>cat. gram.</th><th>attribut</th><th>valeur</th><th>pré/remove</th><th>inf/remove</th><th>suf/remove</th></tr>";
      var src = [prefixes,infixes,suffixes];
      for(let gramTypeID of gramTypes){
         let { label, inflections } = gramTypeData[gramTypeID];
         let allAttr = [];
         let nbRows = 0;
         for(let attrID in inflections){
            allAttr.push(attrID);
            let possVal = attributeValues[attrID];
            nbRows += possVal.length;
         }

         for(let iAttr = 0; iAttr < allAttr.length; iAttr++){
            let attrID = allAttr[iAttr];
            let possVal = attributeValues[attrID];
            let attrData = attributeData[attrID];
            for(let iVal = 0; iVal < possVal.length; iVal++){
               let valID = possVal[iVal];
               let ruleID = inflections[attrID][valID];
               let cla = "";
               html += "<tr>";
               for(var col = 0; col < 6; col++){
                  switch(col){
                  case 0:
                     if(iVal == 0 && iAttr == 0){
                        html += "<td rowspan="+nbRows+" class='border_bottom_strong'>"+label;
                     }
                     break;
                  case 1: 
                     cla = (iAttr == allAttr.length - 1) ? 'border_bottom_strong': 'border_bottom';
                     if(iVal == 0){
                        html += "<td rowspan="+possVal.length+" class="+cla+">"+attrData.label;
                     }
                     break;
                  case 2:
                     cla = "";
                     if(iVal == possVal.length - 1){
                        cla = (iAttr == allAttr.length - 1) ? 'border_bottom_strong': 'border_bottom';
                     }
                     
                     html += "<td class="+cla+">"+attrData.values[valID].label;
                     break;
                  case 3:
                  case 4:
                  case 5:
                     cla = "";
                     if(iVal == possVal.length - 1){
                        cla = (iAttr == allAttr.length - 1) ? 'border_bottom_strong': 'border_bottom';
                     }
                     html += "<td class="+cla+">";
                     if(ruleID > 0){
                        let rule = inflectionRules[ruleID].gramTypes[gramTypeID][attrID][valID];
                        let affID = rule.affID;
                        let rem = rule.remove;
                        let type = col - 3;
                        if(ruleID == type + 1){
                           html += src[type][affID]+"/"+rem;
                        }
                        if(ruleID == 4){
                           if(col == 3){
                              affID = affID[0];
                              html += src[0][affID]+"/"+rem[0];
                           }else if(col == 5){
                              affID = affID[1];
                              html += src[2][affID]+"/"+rem[1];
                           }
                        }
                     }
                     break;
                  default:
                     html += "<td>";

                  }
                  html += "</td>";
               }
               html += "</tr>";
            }
         }
      }
      html += "</table>";
      $("#text").html(html);
   };

   function displayWordList() {
      $("#text").empty();
      let html = "";
      var gramTypeID = $("#word_list").val();
      for(var word of wordList[gramTypeID]){
         html += word.stem+"</br>";
      }
      $("#text").html(html);
   };

   function displaySentences() {
      $("#text").empty();
      let nb = $("#nb_sentences").val();
      let strID = $("#structure").val();
      let html = "";
      let str;
      for(let iSent = 0; iSent < nb; iSent++){
         if(strID > 0){
            str = structures[strID - 1];
         }else{
            let index = getRandomValue(0,structures.length - 1);
            str = structures[index];
         }
         html += generateSentence(str);
      }
      $("#text").html(html);
      
      // console.log(str,nb)
   };

};

function initCurrents() {
   /* choose possible gramTypes and attributes */
   for(let iDat = 0; iDat < 2; iDat ++){
      initCurrent(iDat);
   }
};

function initCurrent(id) {
   let src = (id == 0) ? allGramTypes : allAttributes;
   let dst = (id == 0) ? gramTypes : attributes;
   let dstLength = (id == 0) ? nbGramTypes : nbAttributes;
   let srcClone = cloneObj(src);
   shuffleArray(srcClone);
   if(id == 0){
      shuffleArray(mandatoryTypes);
      for(let iVal = 0; iVal < nbMandatoryTypes; iVal++){
         dst.push(mandatoryTypes[iVal]);
      }
   }
   let loop = 0;
   do{
      let newType = srcClone.pop();
      if(!dst.includes(newType)){
         dst.push(newType);
      }
   }while(dst.length < dstLength && loop < 10);
   if(loop >= 10){
      console.error("infinite loop");
   }
};

function initAttributeValues() {
   /* choose possible attribute values */
   for(let id of attributes){
      attributeValues[id] = [];
      let allVal = cloneObj(attributeData[id].values);
      let length;
      if(allVal.length > 2){
         shuffleArray(allVal);
         length = getRandomValue(2,allVal.length);
      }else{
         length = 2;
      }
      for(let iVal = 0; iVal < length; iVal++){
         let val = allVal[iVal].id;
         attributeValues[id].push(val);
      }
   }
   // console.log(attributeValues)
};

function initAttributeDistribution() {
   /* choose for each attribute, which gram type has a fixed value, and which ones are variable */
   if(nbGramTypesWithNoAttr > 0){
      for(var iType = 0 ;iType < nbGramTypesWithNoAttr; iType++){
         var gramTypeID = gramTypes[iType];
         gramTypesWithNoAttr.push(gramTypeID);
      }
   }
   for(let id of attributes){
      let noType = true;
      attributeDistribution[id] = { variable: [] };
      let gramClone = cloneObj(gramTypes);
      shuffleArray(gramClone);
      if(!gramTypesWithNoAttr.includes(gramClone[0])){
         attributeDistribution[id].fixed = gramClone.pop();
      }

      for(let gramID of gramClone){
         if(gramTypesWithNoAttr.includes(gramID)){
            continue;
         }
         let isVariable = (noType) ? 1 : getRandomValue(0,1);
         if(isVariable){
            attributeDistribution[id].variable.push(gramID);
            noType = false;
         }
      }
   }
   // console.log("attributeDistribution",attributeDistribution);
};

function initGramTypeData() {
   for(let id of gramTypes) {
      if(!gramTypeData[id]){
         gramTypeData[id] = {};
      }
      if(!gramTypeData[id].nbLem){
         gramTypeData[id].nbLem = getRandomValue(minNbStems,maxNbStems);
      }
      if(!gramTypeData[id].attributes){
         gramTypeData[id].attributes = { fixed: [], variable: [] };
         for(let iAtt = 0; iAtt < attributes.length; iAtt++){
            let attID = attributes[iAtt];
            if(attributeDistribution[attID].fixed == id){
               gramTypeData[id].attributes.fixed.push(attID);
            }else if(attributeDistribution[attID].variable.includes(id)){
               gramTypeData[id].attributes.variable.push(attID);
            }
         }
      }
   }
   // console.log("gramTypeData",gramTypeData)
};

function initLetterWeight() {
   for(let type = 0; type < 2; type++){
      let arr = (type == 0) ? cloneObj(voyels) : cloneObj(consonants);
      let nbMissing = (type == 0) ? nbMissingVoyels : nbMissingConsonants;
      shuffleArray(arr);
      let missing = [];
      for(let iChar = 0; iChar < nbMissing; iChar++){
         missing[iChar] = arr.pop();
      }
      let nb = arr.length;
      let weight = 1;
      do{
         for(let iChar = 0; iChar < nb; iChar++){
            let char = arr[iChar];
            if(!letterWeight[type][char]){
               letterWeight[type][char] = 0;
            }
            letterWeight[type][char] += weight; 
         }
         nb = Math.floor(nb/2);
      }while(nb >= 1);

      for(let char in letterWeight[type]){
         let w = letterWeight[type][char];
         for(let iOcc = 0; iOcc < w; iOcc++){
            lettersWeighted[type].push(char);
         }
      }
   }
   // console.log(letterWeight,lettersWeighted);
};

function initStemSpellingRules() {
   /* choose spelling rules for each gram type */
   for(let iRule = 0; iRule < stemSpellingRules.length; iRule++){
      for(let gramType of gramTypes){
         if(!gramTypeData[gramType].spellingRules){
            gramTypeData[gramType].spellingRules = [];
         }
         let isRule = (iRule == 0) ? 1 : getRandomValue(0,1);
         if(!isRule){
            continue
         }
         gramTypeData[gramType].spellingRules.push(iRule);

         switch(iRule) {
         case 0:
            let min = getRandomValue(minStemLength,Math.round(maxStemLength/2));
            let max = getRandomValue(min + 2,maxStemLength);
            stemSpellingRules[iRule].gramTypes[gramType] = { min, max };
            break;
         case 1:
         case 2:
         case 3:
            stemSpellingRules[iRule].gramTypes[gramType] = addNewAffix(iRule - 1);
            break;
         }
      }
   }
};

function initInflectionRules() {
   for(let gramTypeID of gramTypes){
      let noInf = [];
      if(!gramTypeData[gramTypeID].inflections){
         gramTypeData[gramTypeID].inflections = {};
      }
      let attr = gramTypeData[gramTypeID].attributes;
      let allAttr = attr.fixed.concat(attr.variable);
      for(let attrID of allAttr){
         if(!gramTypeData[gramTypeID].inflections[attrID]){
            gramTypeData[gramTypeID].inflections[attrID] = {};
         }
         let infID = getRandomValue(1,inflectionRules.length - 1);
         let possVal = attributeValues[attrID];
         for(var val of possVal){
            let isNoInf = (noInf.length < nbNoInflection) ? getRandomValue(0,1) : 0;
            if(isNoInf){
               gramTypeData[gramTypeID].inflections[attrID][val] = 0;
               noInf.push({attrID,val});
            }else{
               gramTypeData[gramTypeID].inflections[attrID][val] = infID;
               addInflectionRule(infID,gramTypeID,attrID,val);
            }
         }
      }
   }
   // console.log(inflectionRules)
};

function addInflectionRule(infID,gramTypeID,attrID,val) {
   let rule = inflectionRules[infID];
   if(!rule.gramTypes[gramTypeID]){
      rule.gramTypes[gramTypeID] = {};
   }
   if(!rule.gramTypes[gramTypeID][attrID]){
      rule.gramTypes[gramTypeID][attrID] = {};
   }
   let affID, remove;
   if(infID < 4){
      let type = infID - 1;
      affID = addNewAffix(type);
      remove = getRandomValue(0,2);
   }else{
      affID = [];
      remove = [];
      for(var side = 0; side < 2; side++){
         let type = (side == 0) ? 0 : 2;
         affID[side] = addNewAffix(type);
         remove[side] = getRandomValue(0,2);
      }
   }
   let res = { affID, remove };
   rule.gramTypes[gramTypeID][attrID][val] = res;
};

function createAffix(type) {
   let max, arr;
   switch(type){
   case 0:
      max = maxPrefixLength;
      arr = prefixes;
      break;
   case 2:
      max = maxSuffixLength;
      arr = suffixes;
      break;  
   case 1:
      max = maxInfixLength;
      arr = infixes;
      break; 
   }
   let str;
   let l = getRandomValue(1,max);
   let loop = 0;
   do{
      str = "";
      for(let iChar = 0; iChar < l; iChar++){
         let char = addCharToStr(str);
         str += char;
      }
      loop++;
   }while(arr.includes(str) && loop < 10);
   return str
};

function addNewAffix(type) {
   let affixes = [prefixes,infixes,suffixes];
   let arr = affixes[type];
   let aff = createAffix(type);
   let affID = arr.indexOf(aff);
   if(affID == -1){
      arr.push(aff);
      affID = arr.length - 1;
   }
   return affID
}; 

function addCharToStr(str) {
   let isMax = [false,false];   // max voy/con
   let nextType;
   for(let type = 0; type < 2; type++){
      let arr = (type == 0) ? voyels : consonants;
      let max = (type == 0) ? maxVoy : maxCon;
      for(let index = 0; index < max; index++){
         let currIndex = str.length - 1 - index;
         if(currIndex < 0){
            break;
         }
         let char = str.charAt(currIndex);
         if(arr.includes(char) && (isMax[type] || index == 0)){
            isMax[type] = true;
         }else{
            isMax[type] = false;
         }
      }
   }
   let type;
   if(isMax[0]){
      type = 1;
   }else if(isMax[1]){
      type = 0;
   }else{
      type = getRandomValue(0,1);
   }
   let arr = lettersWeighted[type];
   let index = getRandomValue(0,arr.length - 1);
   return arr[index]
};

function generateWordList() {
   let inList = {};
   for(let gramType of gramTypes){
      // console.log(gramType)
      wordList[gramType] = [];
      let dat = gramTypeData[gramType];
      let fixedAttr = dat.attributes.fixed;
      for(let iLem = 0; iLem < dat.nbLem; iLem++){
         let nbTry = 0;
         let stem;
         do{
            stem = generateStem(gramType);
            nbTry++;
         }while(inList[stem] && nbTry < 10);

         if(inList[stem] && nbTry >= 10){
            console.error("skip duplicate",gramType,stem);
         }else{
            inList[stem] = true;
            let fixedAttrVal = pickFixedAttributesValues(fixedAttr);
            stem = conjugateWord(gramType,stem,fixedAttrVal);
            wordList[gramType].push({stem,fixedAttrVal});
         }
      }
   }
   // console.log(wordList);
};

function conjugateWord(gramType,stem,attrVal) {
   // console.log(gramType,stem,attrVal);
   let str = stem;
   for(let attrID in attrVal){
      let val = attrVal[attrID];
      // console.log(attrID,val)
      let rule = gramTypeData[gramType].inflections[attrID][val];
      str = applyInflectionRule(str,rule,gramType,attrID,val);
      // console.log(rule)
   }
   str = mergeClusters(str);
   return str
};

function applyInflectionRule(word,ruleID,gramTypeID,attrID,valID) {
   if(ruleID == 0){
      return word
   }
   let { affID, remove } = inflectionRules[ruleID].gramTypes[gramTypeID][attrID][valID];
   let newWord = inflect(word,ruleID,affID,remove);
   // console.log(word,newWord,ruleID);
   return newWord
};

function inflect(word,ruleID,affID,remove) {
   switch(ruleID){
   case 1:
      remove = (remove >= word.length - 1) ? word.length - 2 : remove;
      word = word.substr(remove);
      word = prefixes[affID]+word;
      break;
   case 2:
      let wordArr = Array.from(word);
      let pos = Math.round(word.length/2);
      remove = (remove >= word.length - 1 - pos) ? word.length - 2 - pos : remove;
      wordArr.splice(pos,remove,infixes[affID]);
      word = wordArr.join("");
      break;
   case 3:
      remove = (remove >= word.length - 1) ? word.length - 2 : remove;
      word = word.substr(0,word.length - 1 - remove);
      word = word + suffixes[affID];
      break;
   case 4:
      word = inflect(word,1,affID[0],remove[0]);
      word = inflect(word,3,affID[1],remove[1]);
   }
   return word
};

function mergeClusters(word) {
   let nbRepeat = [1,1];
   // let nbSame = [1,1];
   let repeats = [];
   // let same = [];
   let maxRepeat = [maxVoy,maxCon];
   // let maxSame = [maxSameVoy,maxSameCon];
   let types = [voyels,consonants];
   let final = false;
   for(let iChar = 0; iChar < word.length; iChar++){
      for(let type = 0; type < 2; type++){
         let char = word.charAt(iChar);
         let prevChar = (iChar > 0) ? word.charAt(iChar - 1) : null;
         if(prevChar){
            if(types[type].includes(char) && types[type].includes(prevChar)){
               nbRepeat[type]++;
            }
            if((types[type].includes(char) && !types[type].includes(prevChar)) || iChar == word.length - 1){
               let clusterType = (types[type].includes(char) && types[type].includes(prevChar)) ? type : 1 - type;
               if(clusterType == type){
                  // console.log("there",char,prevChar)
               }
               let prevRepeat = nbRepeat[clusterType];
               if(prevRepeat > maxRepeat[clusterType]){
                  let pos1 = iChar - prevRepeat;
                  let pos2 = iChar;
                  if(clusterType == type){
                     pos1++; pos2++;
                     // console.log("final",word)
                     final = true;
                  }
                  let cluster = word.substring(pos1,pos2);
                  repeats.push(cluster);
                  // console.log("repeat",prevRepeat,cluster,pos1,pos2)
               }
               nbRepeat[clusterType] = 1;
            }
            // if(types[type].includes(char) && prevChar == char){
            //    nbSame[type]++;
            // }else if((types[type].includes(char) && prevChar != char) || iChar == word.length - 1){
            //    let prevSame = nbSame[type];
            //    if(prevSame > maxSame[type]){
            //       let pos1 = iChar - prevSame;
            //       let pos2 = iChar;
            //       if(types[type].includes(char) && prevChar == char){
            //          pos1++; pos2++;
            //       }
            //       let cluster = word.substring(pos1,pos2);
            //       same.push(cluster);
            //    }
            //    nbSame[type] = 1;
            // }
         }
      }
   }
   if(repeats.length > 0 && final){
      // console.log(word)
   }
   
   for(let cluster of repeats){
      let repl = "";
      let occ = {};
      for(let iChar = 0; iChar < cluster.length; iChar++){
         let char = cluster.charAt(iChar);
         if(!occ[char]){
            occ[char] = 0;
         }
         occ[char]++;
      }
      let max = 0;
      for(let char in occ){
         if(occ[char] > max){
            max = occ[char];
            repl = char;
         }
      }
      word = word.replace(cluster,repl);
   }
   if(repeats.length > 0 && final){
      // console.log(word,repeats);
   }
   return word
};

function pickFixedAttributesValues(fixedAttr) {
   let res = {};
   for(let attrID of fixedAttr){
      let possVal = attributeValues[attrID];
      let index = getRandomValue(0,possVal.length - 1);
      let val = possVal[index];
      res[attrID] = val;
   }
   return res
};

function generateStem(gramType) {
   let rules = gramTypeData[gramType].spellingRules;
   let length, pre = null, suf = null, inf = null, pos = null; 
   for(let ruleID of rules){
      let ruleData = stemSpellingRules[ruleID];
      switch(ruleID){
      case 0:
         let minL = ruleData.gramTypes[gramType].min;
         let maxL = ruleData.gramTypes[gramType].max;
         length = getRandomValue(minL,maxL);
         break
      case 1:
         let preID = ruleData.gramTypes[gramType];
         pre = prefixes[preID];
         break
      case 3:
         let sufID = ruleData.gramTypes[gramType];
         suf = suffixes[sufID];
         break
      case 2:
         let infID = ruleData.gramTypes[gramType];
         pos = Math.round(length/2);
         inf = infixes[infID];
         break
      }
   }
   let str = "";
   if(pre){
      str = pre;
   }
   for(let iChar = 0; iChar < length; iChar++){
      if(pos && iChar == pos){
         str += inf;
      }
      let char = addCharToStr(str);
      str += char;
      prevChar = char;
   }
   if(suf){
      str += suf;
   }
   return str
};

function initStructures() {
   let inList = {};
   let minWords = 2;
   let maxWords = maxNbWordsInSentence;
   let maxSameType = 3;

   let loop;
   do{
      loop = 0;
      let length = getRandomValue(minWords,maxWords);
      let str = [];
      let removed = []; // type ID with occurence = maxSameType
      let nbOcc = {};
      for(let iWord = 0; iWord < length; iWord++){
         let possTypes = cloneObj(gramTypes);
         if(iWord > 0){ // prevent 2 successive same type
            let prevID = str[iWord - 1 ];
            let indexOf = possTypes.indexOf(prevID);
            possTypes.splice(indexOf,1);
         }
         for(let remID of removed){
            let indexOf = possTypes.indexOf(remID);
            possTypes.splice(indexOf,1);
         }
         
         let index = getRandomValue(0,possTypes.length - 1);
         let newID = possTypes[index];
         str[iWord] = newID;

         if(nbOcc[newID] === undefined){
            nbOcc[newID] = 0;
         }
         nbOcc[newID]++;
         if(nbOcc[newID] >= maxSameType){
            removed.push(newID);
         }
      }
      let hash = JSON.stringify(str).hashCode();
      if(!inList[hash]){
         inList[hash] = true;
         structures.push(str);
      }else{
         loop++;
      }
   }while(structures.length < maxNbStructures && loop < 10);
   // console.log("structures",structures);
};

function generateSentence(structure) {
   if(!structure){
      let index = getRandomValue(0,structures.length - 1);
      structure = structures[index];
   }
   let currAttrValues = {};
   let sentence = "";
   // let stems = [];
   for(let gramTypeID of structure){
      let list = wordList[gramTypeID];
      let index = getRandomValue(0,list.length - 1);
      let stem = list[index].stem;
      let fixedAttrVal = list[index].fixedAttrVal;
      for(let attrID in fixedAttrVal){
         currAttrValues[attrID] = fixedAttrVal[attrID];
      }
      let varAttr = gramTypeData[gramTypeID].attributes.variable;
      let varAttrVal = {};
      for(let attrID of varAttr){
         let val;
         if(currAttrValues[attrID] != undefined){
            val = currAttrValues[attrID];
         }else{
            let possVal = attributeValues[attrID];
            let index = getRandomValue(0,possVal.length - 1);
            val = possVal[index];
            currAttrValues[attrID] = val;
         }
         varAttrVal[attrID] = val;
      }
      let word = conjugateWord(gramTypeID,stem,varAttrVal);
      sentence += word+" ";
   }
   return sentence
};

function createAlienLanguage(params) {
   params = params || {};
   rng = params.rng || rng; 
   
   allGramTypes = params.gramTypes || cloneObj(defaultGramTypes);
   gramTypes = [];
   gramTypeData = params.gramTypeData || cloneObj(defaultGramTypeData);
   nbGramTypes = params.nbGramTypes || defaultNbGramTypes;
   mandatoryTypes = params.mandatoryTypes || cloneObj(defaultMandatoryTypes);
   nbMandatoryTypes = params.nbMandatoryTypes || defaultNbMandatoryTypes;
   nbGramTypesWithNoAttr = params.nbGramTypesWithNoAttr || defaultNbGramTypesWithNoAttr;
   gramTypesWithNoAttr = [];
   nbNoInflection = params.nbNoInflection || defaultNbNoInflection;

   allAttributes = params.attributes || cloneObj(defaultAttributes);
   attributes = [];
   attributeData = params.attributeData || cloneObj(defaultAttributeData);
   attributeValues = { /* id: [] */ };
   attributeDistribution = { /* id: { fixed: [], variable: [] } */ };
   nbAttributes = params.nbAttributes || defaultNbAttributes;
   maxNbWordsInSentence = params.maxNbWordsInSentence || defaultMaxNbWordsInSentence;

   maxNbStems = params.maxNbStems || maxNbStems;  // max nb stem per gram type
   minNbStems = params.minNbStems || minNbStems;    // min nb stem per gram type
   maxStemLength = params.maxWordLength || maxStemLength;
   minStemLength = params.minWordLength || minStemLength;
   maxNbAttrValues = params.maxNbAttrValues || maxNbAttrValues;
   minNbAttrValues = params.minNbAttrValues || minNbAttrValues;
   maxNbStructures = 50;

   letterWeight = [ {/*voy*/}, {/*con*/} ];
   lettersWeighted = [[/*voy*/],[/*con*/]];
   nbMissingVoyels = params.nbMissingVoyels || defaultNbMissingVoyels;
   nbMissingConsonants = params.nbMissingConsonants || defaultNbMissingConsonants;

   stemSpellingRules = [
      { id: 0, gramTypes: { /* id : { min, max } */ } },  // length
      { id: 1, gramTypes: { /* id: preID  */ } },  // prefix 
      { id: 2, gramTypes: { /* id: infID }  */ } },  // infix 
      { id: 3, gramTypes: { /* id: sufID  */ } },  // suffix 
   ];
   inflectionRules = [
      { id: 0 }, // no inflection
      { id: 1, gramTypes: { /* gramTypeID: { attrID: { val: preID, remove: 0-2 } } */ } }, // add prefix
      { id: 2, gramTypes: { /* gramTypeID: { attrID: { val: infID, remove: 0-2 } } */ } }, // add infix
      { id: 3, gramTypes: { /* gramTypeID: { attrID: { val: sufID, remove: 0-2 } } */ } }, // add suffix
      { id: 4, gramTypes: { /* gramTypeID: { attrID: { val: [preID,sufID], remove: [0-2,0-2] } } */ } }, // add circonfix
   ];

   prefixes = [];
   suffixes = [];
   infixes = [];

   wordList = {};

   structures = [];

   initCurrents();
   initAttributeValues();
   initAttributeDistribution();
   initGramTypeData();

   initLetterWeight();
   initStemSpellingRules();
   initInflectionRules();
   generateWordList();

   initStructures();

   return generateDictionary();
};

function generateDictionary() {
   const dictionaryAvailableCriteria = [];

   const gramTypeValues = [];
   for (let gramTypeID of gramTypes) {
      gramTypeValues.push({
         value: gramTypeID,
         label: gramTypeData[gramTypeID].label.charAt(0).toLocaleUpperCase() + gramTypeData[gramTypeID].label.slice(1),
      });
   }

   dictionaryAvailableCriteria.push({
      name: 'gram_type',
      label: 'Type',
      type: 'select',
      values: gramTypeValues,
   });

   for (let attrID of attributes) {
      let label = attributeData[attrID].label;
      let values = attributeValues[attrID];
      let distribution = attributeDistribution[attrID];
      const attrValues = [];
      for (let valID of values) {
         let name = attributeData[attrID].values[valID].label;
         attrValues.push({
            value: valID,
            label: name.charAt(0).toLocaleUpperCase() + name.slice(1),
         })
      }

      attrValues.sort((a, b) => a.value - b.value);

      dictionaryAvailableCriteria.push({
         name: attrID,
         label: label.charAt(0).toLocaleUpperCase() + label.slice(1),
         type: 'select',
         values: attrValues,
      });
   }

   const generateEntryHash = (entry) => {
      const entriesSorted = Object.keys(entry).sort().reduce(
        (obj, key) => {
           obj[key] = entry[key];
           return obj;
        },
        {}
      );

      return JSON.stringify(entriesSorted);
   };

   const dictionary = [];
   // console.log({gramTypeData, attributeData})
   const dictionayEntriesHashes = {};
   for (let gramTypeID of gramTypes) {
      for (let word of wordList[gramTypeID]) {
         let stem = word.stem;
         let fixedAttrVal = word.fixedAttrVal;
         let currAttrValues = {};
         for (let attrID in fixedAttrVal) {
            currAttrValues[attrID] = fixedAttrVal[attrID];
         }
         let varAttr = gramTypeData[gramTypeID].attributes.variable;

         let allVarAttrPossibilites = [];

         let generatePossibilities = (currAttrValues, attrIndex) => {
            if (attrIndex > varAttr.length - 1) {
               allVarAttrPossibilites.push(currAttrValues);
               return;
            }

            const attrID = varAttr[attrIndex];
            let val;
            if (currAttrValues[attrID] !== undefined) {
               const copyAttr = cloneObj(currAttrValues);
               copyAttr[attrID] = val;

               return generatePossibilities(copyAttr, attrIndex + 1);
            } else {
               let possVals = attributeValues[attrID];
               for (let possVal of possVals) {
                  const copyAttr = cloneObj(currAttrValues);
                  copyAttr[attrID] = possVal;
                  generatePossibilities(copyAttr, attrIndex + 1);
               }
            }
         };

         generatePossibilities(currAttrValues, 0);
         // console.log({currAttrValues, varAttr, allVarAttrPossibilites})

         for (let varAttrVal of allVarAttrPossibilites) {
            let conjugatedWord = conjugateWord(gramTypeID, stem, varAttrVal);

            const wordObject = {word: conjugatedWord, gram_type: gramTypeID};
            for (let key in varAttrVal) {
               wordObject[key] = varAttrVal[key];
            }

            const hash = generateEntryHash(wordObject);
            if (!(hash in dictionayEntriesHashes)) {
               dictionayEntriesHashes[hash] = true;
               dictionary.push(wordObject);
            }
         }
      }
   }

   return {dictionary, dictionaryAvailableCriteria};
}

/* UTILS */

function getRandomValue(min,max) {
   var range = max - min;
   var val = min + Math.round(rng()*range);
   return val
};

function shuffleArray(array) {   //Stackoverflow
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
   }
};

function cloneObj(obj) {
   return JSON.parse(JSON.stringify(obj))
};

String.prototype.hashCode = function() {  // Stackoverflow
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

if(typeof exports != 'undefined') {
   exports.createAlienLanguage = createAlienLanguage;
   exports.generateSentence = generateSentence;
}

