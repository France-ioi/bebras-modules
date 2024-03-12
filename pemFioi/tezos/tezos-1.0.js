const taskStrings = {
   success: "Bravo, vous avez réussi !",
   transactions: "Transactions",
   sender: "Sender",
   recipient: "Recipient",
   amount: "Amount",
   destination: "Destination",
   destination_ep: "destination",
   parameters: "Parameters",
   mempool: "Mempool",
   accounts: "Accounts",
   account: "Account",
   address: "Address",
   balance: "Balance",
   newAccount: "New Account",
   newTransaction: "New Transaction",
   nextBlock: "Next Block",
   nextXBlocks: "Next X Blocks",
   alias: "Alias",
   publicKey: "Public key",
   privateKey: "Private key",
   transactionNum: "Transaction counter",
   counter: "Counter",
   signature: "Signature",
   sign: "Sign",
   notSigned: "not signed",
   signAndSend: "Sign and send",
   bakerFee: "Baker fee",
   additionalFee: "Additional fee for the baker",
   simulate: "Simulate",
   validate: "Validate",
   cancel: "Cancel",
   edit: "Edit",
   copy: "Copy",
   transactionDetails: "Transaction details",
   simulationResults: "Simulation results",
   gas: "Gas",
   storage: "Storage",
   storageChange: "Storage change",
   contract: "Contract",
   entrypoints: "Entrypoints",
   entrypoint: "Entrypoint",
   views: "Views",
   smartContracts: "Smart contracts",
   nbOfTokens: "nb_tokens",
   nbTokensSold: "nb_tokens_sold",
   minTokensExpected: "min_tokens_bought",
   minTezExpected: "min_tez_expected",
   byte: function(nb) {
      let pl = (nb > 1) ? "s" : "";
      return "byte"+pl
   },
   subTransactions: "Sub-transactions",
   operator: "operator",
   source: "source",
   randomNumber: "random number",
   hash: "hash",
   nbBlocks: "Number of blocks",
   timeShift: "Time shift",
   idPlayer: "id_player",
   numberValue: "value",

   error: "Error",
   maxAccounts: "Vous ne pouvez pas créer d'autre compte.",
   noAccount: "Vous ne possédez aucun compte.",
   noSender: "Vous devez spécifier le compte émetteur",
   noSource: "Vous devez spécifier le compte source",
   noRecipient: "Vous devez spécifier le compte destinataire",
   noOperator: "Vous devez spécifier un compte opérateur",
   recipientIsSender: "Les comptes émetteur et destinataire sont les mêmes",
   sourceIsDestination: "Les comptes source et destinataire sont les mêmes",
   operatorIsSender: "Les comptes émetteur et opérateur sont les mêmes",
   wrongAmount: "Le montant doit être un nombre positif.",
   wrongAdditionalFee: "The additional fee must be a positive number",
   amountWrongFormat: "Le format du montant de tez est incorrect.",
   amountUnwanted: "Le transfert de tez est rejeté par cet entrypoint.",
   amountWrongValue: "Le montant doit être égal à la somme de la mise et du dépôt.",
   wrongNbOfTokens: "Le nombre de jetons doit être un nombre entier positif.",
   wrongNumber: "Le nombre aléatoire doit être un nombre entier positif.",
   wrongIdPlayer: "Le format de l'identifiant est incorrect.",
   playerUnknown: "Identifiant inconnu.",
   wrongHash: "Le hash ne correspond pas",
   alreadyRevealed: "Ce joueur a déjà révélé son nombre aléatoire",
   winnerNotRevealed: "Le gagnant n'a pas révélé son nombre aléatoire",
   pastDeadlineCommit: "L'échéance pour miser est dépassée",
   pastDeadlineReveal: "L'échéance pour révéler son nombre aléatoire est dépassée",
   beforeDeadlineReveal: "L'échéance pour révéler son nombre aléatoire n'est pas encore dépassée",
   amountTooHigh: function(ba) {
      return "Le solde du compte émetteur est insuffisant. (Solde actuel = "+Number.parseFloat(ba)+" tez)"
   },
   nbOfTokensTooHigh: function(ba) {
      return "Le solde du compte source est insuffisant. (Solde actuel = "+Number.parseFloat(ba)+" tokens)"
   },
   errorAllowance: function(src,sen,tok) {
      return sen+" n'a pas l'autorisation de "+src+" de lui prélever "+tok+" tokens"
   },
   wrongCounter: function(co) {
      return "La valeur du compteur est invalide. (compteur actuel = "+co+")"
   },
   minTokensExpectedNaN: "Le format du minimum de tokens achetés est incorrect.",   
   minTezExpectedNaN: "Le format du montant minimum de tez souhaités est incorrect.",   
   minTokensExpectedTooHigh: "Le nombre de tokens achetés pour ce montant est inférieur au nombre minimum de tokens souhaité.",   
   minTezExpectedTooHigh: "Le montant de tez obtenus pour ce nombre de jetons est inférieur au minimum souhaité.",   
   nbOfTokensBoughtTooHigh: "Le nombre de tokens achetés pour ce montant est supérieur au stock du liquidity pool.",   
   nbOfTezBoughtTooHigh: "Le montant de tez obtenus pour ce nombre de jetons est supérieur au solde du liquidity pool.",   
   signatureMissing: "La transaction n'a pas été signée.",
   mempoolIsEmpty: "Il n'y a aucune transaction dans le mempool.",
   epError: function(alias,ep,values) {
      let str = alias+"."+ep+"(";
      for(let iF = 0; iF < values.length; iF++){
         let val = values[iF];
         str += val;
         if(iF < values.length - 1){
            str += ","
         }
      }
      str += ") failed with: ";
      return str
   },
   errorBalance: function(cur,tar) {
      let str = (cur == tar) ? "égal" : "inférieur";
      return "Vous n'avez pas fait de gain. Votre solde actuel de "+cur+" tez est "+str+" à votre solde de départ de "+tar+" tez."
   },
   cantSign: "Vous ne pouvez pas signer cette transaction car le compte émetteur ne vous appartient pas."
};

function displayError(msg) {
   displayHelper.displayError(msg);
};

function deleteView(type) {
   return function() {
      // console.log("deleteView",sim);
      displayError("");
      if(type == 1){
         $("#simView, #simBack").remove();
      }else if(type == 2){
         $("#subView, #subBack").remove();
      }else{
         $("#view, #back, #simView, #simBack").remove();
      }
   }
};

function roundTezAmount(val) {
   return Math.round(val*Math.pow(10,6))/Math.pow(10,6)
};

function addressEllipsis(address,nbChar,alias) {
   let str = "";
   if(nbChar){
      str = address.substring(0,nbChar);
   }else{
      str = address;
   }
   str += "...";
   if(alias){
      str += " ("+alias+")"
   }
   return str
};


String.prototype.hashCode = function() {
   // stackoverflow
   var hash = 0,
    i, chr;
   if (this.length === 0) return hash;
   for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
   }
   // return hash
   return (hash*hash).toString(32);
};

class SmartContract {
   constructor(params) {
      let { alias, address, balance, storage, entrypoints, tezos, views } = params;
      this.alias = alias;
      this.address = address;
      this.balance = balance;
      this.storage = storage;
      this.entrypoints = entrypoints;
      this.tezos = tezos;
      this.views = views;
   }

   display() {
      let self = this;
      // console.log(this)
      displayError("");

      let view = $("<div id=view></div>");
      let back = $("<div id=back></div>");

      let acc = display(this);
      view.append(back,acc);
      $("#mainPage").append(view);

      $("#view_contract #content").css("max-height",$("#mainPage").height()+"px");      

      $("#view_contract #header").on("click",deleteView());
      $("#view_contract #header").css("cursor","pointer");

      for(let key in this.entrypoints){
         $("#view_contract #"+key).on("click",clickEntrypoint(key,this));
         $("#view_contract #"+key).css("cursor","pointer");
      }
      for(let key in this.views){
         $("#view_contract #"+key).on("click",clickView(key,this));
         $("#view_contract #"+key).css("cursor","pointer");
      }

      function display(self) {
         let cont = $("<div id=view_contract class=view></div>");
         let header = $("<div id=header>"+taskStrings.contract+": "+self.alias+"<img src="+self.tezos.crossSrc+" class=icon /></div>");
         let content = $("<div id=content></div>");
         let cont1 = $("<div id=content1></div>");
         let cont2 = $("<div id=content2></div>");

         let html1 = "";
         html1 += "<p class=line><span class=label>"+taskStrings.address+":</span> "+addressEllipsis(self.address)+"</p>";
         html1 += "<p class=line><span class=label>"+taskStrings.balance+":</span> "+self.balance+" tez</p>";
         html1 += "<p class=line> </p>";
         html1 += "<h4 class=line>"+taskStrings.storage+":</h4> ";
         for(let key in self.storage){
            let type = self.storage[key].type;
            if(type != "big-map"){
               // html1 += "<p class='storage_line line'><span class=label>"+key+":</span> "+self.storage[key].val+"</p>";
               html1 += "<p class='storage_line line'>"+getStorageLine(type,key,self.storage[key].val)+"</p>";
            }else{
               html1 += getBigMapHTML(key,self.storage,0);
            }
         }

         cont1.append(html1);

         let html2 = "";
         html2 += "<h4 class=line >"+taskStrings.entrypoints+":</h4> ";
         for(let key in self.entrypoints){
            let ep = self.entrypoints[key];
            if(!ep.clickable)
               continue;
            html2 += "<div class='text entrypoint' id="+key+" >"+ep.text+"</div>";
         }
         if(self.views){
            html2 += "<h4 class=line >"+taskStrings.views+":</h4> ";
            for(let key in self.views){
               html2 += "<div class='text sc_view' id="+key+" >"+self.views[key].text+"</div>";
            }
         }

         cont2.append(html2);

         content.append(cont1,cont2);
         cont.append(header,content);
         return cont

         function getBigMapHTML(key,parent,level) {
            let obj = parent[key];
            let html = "<p class='storage_line level_"+level+"'><span class=label>"+key+":</span> </p>";
            for(let k in obj) {
               if(k == "type"){
                  continue;
               }
               if(obj[k].type == "big-map"){
                  html += getBigMapHTML(k,obj,level + 1);
               }else{
                  // html += "<p class='storage_line level_"+(level + 1)+"'><span class=label>"+k+":</span> "+obj[k].val+"</p>";
                  html += "<p class='storage_line level_"+(level + 1)+"'>"+getStorageLine(obj[k].type,k,obj[k].val)+"</p>";
               }
            }
            return html
         }

         function getStorageLine(type,key,val) {
            let str = val;
            if(type == "timestamp"){
               let date = new Date(val);
               str = date.toLocaleString();
            }else if(type == "address"){
               let alias = self.tezos.objectsPerAddress[val].alias;
               str = addressEllipsis(val,7,alias);
            }
            return "<span class=label>"+key+":</span> "+str
         };
      }

      function clickEntrypoint(id,self) {
         return function() {
            let fct = self.entrypoints[id].fct;
            self[fct]();
         }
      };

      function clickView(id,self) {
         return function() {
            let fct = self.views[id].fct;
            let v = self[fct]();

            displayError("");
            let view = $("<div id=simView></div>");
            let back = $("<div id=simBack></div>");
            view.append(back);
            $("#mainPage").append(view);

            let html = "<div id=sc_view class=view>";
            html += "<div id=header>"+v.header+"<img src="+self.tezos.crossSrc+" class=icon /></div>";
            html += "<div class=content>"+v.text+"</div>";
            html += "</div>";

            view.append($(html));

            $("#simView, #simBack").on("click",deleteView(true));
            $("#simView, #simBack").css("cursor","pointer");
         }
      };
   };

   default() {
      // default entrypoint fct
      console.log("click")
   }
};

class Ledger extends SmartContract {
   constructor(params) {
      super({
         tezos: params.tezos,
         alias: "Ledger",
         address: "KT1a3CdiZ3A",
         balance: 0,
         storage: {
            balances: {
               type: "big-map"
            },
            allowances: {
               type: "big-map"
            }
         },
         entrypoints: {
            "transfer_tokens": { 
               text: "<span class=ep_name>transfer_tokens(source,destination,nb_tokens):</span>"+
                  "<ul><li>if source != sender, check if allowances[source][sender] >= nb_tokens</li>"+
                  "<li>check if balances[source] >= nb_tokens</li>"+
                  "<li>if !balances[destination], set balances[destination] = 0</li>"+
                  "<li>balances[source] -= amount</li>"+
                  "<li>balances[destination] += amount</li></ul>",
               clickable: true,
               fct: "transfer"
            },
            "allow": { 
               text: "<span class=ep_name>allow(operator,nb_tokens):</span>"+
                  "<ul><li>if !allowances[sender][operator], create allowances[sender][operator] = 0</li>"+
                  "<li>allowances[sender][operator] += nb_tokens</li></ul>",
               clickable: true,
               fct: "allow"
            }
         }
      });
   }

   transfer(subData) {
      let params = { 
         id: "transfer_tokens",
         fields: ["source","destination_ep","nbOfTokens"],
         gas: "computeTransferGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError"
      };
      if(!subData){
         params.sc_address = this.address;
         this.tezos.newTransaction = undefined;
         this.tezos.createNewTransaction(params)();
      }else{
         // console.log(this)
         let { ledger, sender, source, destination, nbTokens } = subData;
         params.sc_address = ledger.address;
         let trans = {
            sender, recipient: ledger.address,
            amount: 0, sub: true,
            entrypoint: "transfer_tokens",
            source,
            destination_ep: destination,
            nbOfTokens: nbTokens,
            gas: ledger.computeTransferGas(),
            storage: 0,
            storageChange: "",
            params
         }
         // console.log(thiss.isChangeValid(trans),trans)
         let error = ledger.findTransactionError(trans);
         if(!error){
            trans.storage = ledger.computeTransactionStorage(trans);
            trans.storageChange = ledger.getStorageChange(trans);
         }

         return trans
      }
   }

   allow() {
      let params = { 
         id: "allow",
         sc_address: this.address,
         fields: ["operator","nbOfTokens"],
         gas: "computeTransferGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError"
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      let sen = trans.sender;
      let tok = trans.nbOfTokens;
      if(id == "transfer_tokens"){
         let des = trans.destination_ep;
         let sou = trans.source;
         this.changeUserBalance(sou,tok,-1);
         this.changeUserBalance(des,tok,1);
         if(sou != sen){
            this.changeAllowance(sou,sen,-tok);
         }
      }else if(id == "change_user_balance"){
         let des = trans.destination_ep;
         this.changeUserBalance(des,tok,1);
      }else if(id == "allow"){
         let ope = trans.operator;
         this.changeAllowance(sen,ope,tok);
      }
   }

   computeTransferGas() {
      return Math.round(this.tezos.defaultGasPerTransaction*1.5)
   }

   computeTransactionStorage(trans) {
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let blob;
      if(id == "transfer_tokens"){
         blob = new Blob([tr.sender+""+tr.destination_ep+""+tr.nbOfTokens]);
      }else if(id == "allow"){
         blob = new Blob([tr.sender+""+tr.operator+""+tr.nbOfTokens]);
      }
      return blob.size
   }

   getStorageChange(trans) {
      let text = "";
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let sen = this.tezos.objectsPerAddress[tr.sender];
      if(id == "transfer_tokens"){
         let sou = this.tezos.objectsPerAddress[tr.source];
         let des = this.tezos.objectsPerAddress[tr.destination_ep];
         if(!this.storage.balances[des.alias]){
            text += "- create "+des.alias+" entry";
            text += "<br/>";
            text += "- set "+des.alias+" balance to 0";
            text += "<br/>";
         }
         let sBal = this.storage.balances[sou.alias].val;
         text += "- change "+sou.alias+" balance from "+sBal+" to "+(sBal - tr.nbOfTokens);
         text += "<br/>";
         let dBal = (this.storage.balances[des.alias]) ? this.storage.balances[des.alias].val : 0;
         text += "- change "+des.alias+" balance from "+dBal+" to "+(dBal + tr.nbOfTokens);
         if(tr.sender != tr.source){
            text += "<br/>";
            text += "- decrease "+sou.alias+" - "+sen.alias+" allowance by "+tr.nbOfTokens;
         }
      }else if(id == "allow"){
         let ope = this.tezos.objectsPerAddress[tr.operator];

         if(!this.storage.allowances[sen.alias] || !this.storage.allowances[sen.alias][ope.alias]){
            text += "- create "+sen.alias+" - "+ope.alias+" entry";
            text += "<br/>";
            text += "- set "+sen.alias+" - "+ope.alias+" allowance to 0";
            text += "<br/>";
         }
         text += "- increase "+sen.alias+" - "+ope.alias+" allowance by "+tr.nbOfTokens;
      }
      return text
   }

   getUserBalance(userID) {
      let acc = this.tezos.objectsPerAddress[userID];
      let bal = (this.storage.balances[acc.alias]) ? this.storage.balances[acc.alias].val : 0;
      return bal
   }

   changeUserBalance(userID,amount,factor) {
      let acc = this.tezos.objectsPerAddress[userID];
      if(!this.storage.balances[acc.alias]){
         this.storage.balances[acc.alias] = { val: 0, type: "nat" };
      }
      this.storage.balances[acc.alias].val += factor*amount;
   }

   changeAllowance(userID,operator,nbTok) {
      let sAcc = this.tezos.objectsPerAddress[userID];
      let oAcc = this.tezos.objectsPerAddress[operator];
      if(!this.storage.allowances[sAcc.alias])
         this.storage.allowances[sAcc.alias] = { type: "big-map" };
      if(!this.storage.allowances[sAcc.alias][oAcc.alias])
         this.storage.allowances[sAcc.alias][oAcc.alias] = { val: 0, type: "nat" };
      this.storage.allowances[sAcc.alias][oAcc.alias].val += nbTok;
   }

   isTransactionValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      let id = dat.params.id;
      if(dat.sender === ""){
         $("#select_sender").addClass("highlight");
         return taskStrings.noSender
      } 
      if(isNaN(dat.amount)){
         $("#amount").addClass("highlight");
         return taskStrings.amountWrongFormat
      }
      if(id == "transfer_tokens"){
         if(!dat.source){
            if(trans === undefined){
               $("#select_source").addClass("highlight");
            }
            return taskStrings.noSource
         }
         if(!dat.destination_ep){
            if(trans === undefined){
               $("#select_destination_ep").addClass("highlight");
            }
            return taskStrings.noRecipient
         }
      }else if(id == "allow"){
         if(!dat.operator){
            if(trans === undefined){
               $("#select_operator").addClass("highlight");
            }
            return taskStrings.noOperator
         }
      }
      if(isNaN(dat.nbOfTokens) || !Number.isInteger(dat.nbOfTokens)){
         if(trans === undefined){
            $("#nbOfTokens").addClass("highlight");
         }
         return taskStrings.wrongNbOfTokens
      }
      return false
   }

   findTransactionError(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      let id = dat.params.id;
      
      if(dat.amount){
         // $("#amount").addClass("highlight");
         return taskStrings.amountUnwanted
      }
      if(id == "transfer_tokens"){
         
         if(dat.destination_ep == dat.source){
            if(trans === undefined){
               // $("#select_source").addClass("highlight");
               // $("#select_destination_ep").addClass("highlight");
            }
            return taskStrings.sourceIsDestination
         }
         let src = this.tezos.objectsPerAddress[dat.source];
         if(dat.sender != dat.source){
            let all = this.storage.allowances;
            let sen = this.tezos.objectsPerAddress[dat.sender];
            // console.log(all,all[src.alias][sen.alias],dat.nbOfTokens)
            if(!all[src.alias] || !all[src.alias][sen.alias] || 
               all[src.alias][sen.alias].val < dat.nbOfTokens){
               if(trans === undefined){
                  // $("#select_source").addClass("highlight");
                  // $("#select_destination_ep").addClass("highlight");
               }
               return taskStrings.errorAllowance(src.alias,sen.alias,dat.nbOfTokens)
            }
         }
         let sourceBalance = (this.storage.balances[src.alias]) ? this.storage.balances[src.alias].val : 0;
         // console.log(senderBalance,dat.nbOfTokens);
         if(sourceBalance < dat.nbOfTokens){
            if(trans === undefined){
               // $("#nbOfTokens").addClass("highlight");
            }
            return taskStrings.nbOfTokensTooHigh(sourceBalance)
         }
      }else if(id == "allow"){
         
         if(dat.operator == dat.sender){
            if(trans === undefined){
               // $("#select_sender").addClass("highlight");
               // $("#select_operator").addClass("highlight");
            }
            return taskStrings.operatorIsSender
         }
      }
      if(!dat.nbOfTokens || isNaN(dat.nbOfTokens) || dat.nbOfTokens < 0 || 
            !Number.isInteger(dat.nbOfTokens)){
         if(trans === undefined){
            $("#nbOfTokens").addClass("highlight");
         }
         return taskStrings.wrongNbOfTokens
      }
      
      // if(!dat.sub && !dat.signature){
      //    return taskStrings.signatureMissing
      // }
      return false
   }
};

class LiquidityPool extends SmartContract {
   constructor(params) {
      params.entrypoints = {
         "buy_tokens": { 
            text: "<span class=ep_name>buy_tokens(min_tokens_bought):</span><ul>"+
               "<li>compute tokens_obtained</li>"+
               "<li>if tokens_obtained > min_tokens_bought, transfer tokens</li>"+
               "<li>update storage</li></ul>",
            clickable: true,
            fct: "buyTokens" 
         }, 
         "sell_tokens": {
            text: "<span class=ep_name>sell_tokens(nb_tokens_sold,min_tez_requested):</span><ul>"+
               "<li>compute tez_obtained</li>"+
               "<li>if tez_obtained > min_tez, transfer tokens</li>"+
               "<li>update storage</li></ul>",
            clickable: true,
            fct: "sellTokens"
         } 
      };
         
      params.views = {
         "get_token_price" : { 
            text: "<span class=ep_name>get_token_price():</span><ul>"+
               "<li>returns what we would get if we sold one token</li></ul>",
            fct: "viewTokenPrice"
         }
      };       
      params.storage = {
         tokens_owned: { val: 0, type: "nat" },
         k: { val: 0, type: "nat" },
      };
      super(params);
   }

   buyTokens() {
      let params = { 
         id: "buy_tokens",
         sc_address: this.address,
         fields: ["minTokensExpected"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
         subTransactionsData: [{ 
            recipient: this.tezos.ledger.address, 
            id: "transfer_tokens"
         }]
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   sellTokens() {
      let params = { 
         id: "sell_tokens",
         sc_address: this.address,
         fields: ["nbTokensSold","minTezExpected"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
         subTransactionsData: [{ 
            recipient: this.tezos.ledger.address, 
            id: "transfer_tokens"
         }]
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      let sID = trans.sender;
      let sAcc = this.tezos.objectsPerAddress[sID];
      if(id == "buy_tokens"){
         let amo = trans.amount;
         let nb = this.getNbOfTokensBought(amo);
         sAcc.balance -= amo;
         this.balance += amo;
         this.storage.tokens_owned.val -= nb;
      }else if(id == "sell_tokens"){
         let nb = trans.nbTokensSold;
         let amo = this.getAmountOfTezBought(nb);
         // console.log(nb,amo,sAcc.balance)
         sAcc.balance += amo;
         sAcc.balance = roundTezAmount(sAcc.balance);
         this.balance -= amo;
         // console.log(nb,amo,sAcc.balance)
         this.storage.tokens_owned.val += nb;
      }
      this.tezos.ledger.applyTransaction(trans.subTransactions[0]);
   }

   computeTransactionGas() {
      let gas = Math.round(this.tezos.defaultGasPerTransaction*1.5);
      let tr = this.tezos.newTransaction;
      let subID = "transfer_tokens";
      let sub = this.getSubtransaction(subID,tr.params.id);
      gas += sub.gas;
      return gas
   }

   computeTransactionStorage() {
      let tr = this.tezos.newTransaction;
      let nb = this.getNbOfTokensBought(tr.amount);
      let blob = new Blob([tr.sender+""+nb]);
      let sto = blob.size;

      let subID = "transfer_tokens";
      let sub = this.getSubtransaction(subID,tr.params.id);

      tr.subTransactions = [sub];

      sto += sub.storage;
      // console.log("sub storage",sub.storage)
      return sto
   }

   getSubtransaction(subID,trID) {
      let tr = this.tezos.newTransaction;
      let sc = this.tezos.ledger;
      let subFctID = sc.entrypoints[subID].fct;
      let subFct = sc[subFctID];
      let nb, sou, des;
      if(trID == "buy_tokens"){
         nb = this.getNbOfTokensBought(tr.amount);
         sou = this.address;
         des = tr.sender;
      }else if(trID == "sell_tokens"){
         nb = tr.nbTokensSold;
         sou = tr.sender;
         des = this.address;
      }
      // console.log(mainID,nb,tr)
      let sub = subFct({ 
         ledger: sc,
         sender: this.address,
         source: sou, 
         destination: des, 
         nbTokens: nb
      });
      return sub
   }

   getStorageChange() {
      let text = "";
      let tr = this.tezos.newTransaction;
      let sAcc = this.tezos.objectsPerAddress[tr.sender];
      let tok1 = this.storage.tokens_owned.val;
      let k = this.storage.k.val;
      let b1 = this.balance;
      if(tr.params.id == "buy_tokens"){
         let nb = this.getNbOfTokensBought(tr.amount);
         let tok2 = tok1 - nb;
         text += "- change "+this.alias+" nb of tokens from "+tok1+" to "+tok2;
      }else
      if(tr.params.id == "sell_tokens"){
         let tok2 = tok1 + tr.nbTokensSold;
         text += "- change "+this.alias+" nb of tokens from "+tok1+" to "+tok2;
      }
      return text
   }

   isTransactionValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      // console.log(dat)
      if(dat.sender === ""){
         $("#select_sender").addClass("highlight");
         return taskStrings.noSender
      }
      if(dat.params.id == "buy_tokens"){
         if(isNaN(dat.amount)) {
            if(trans === undefined){
               $("#amount").addClass("highlight");
            }
            return taskStrings.wrongAmount
         }
         
         if(isNaN(dat.minTokensExpected)){
            $("#minTokensExpected").addClass("highlight");
            return taskStrings.minTokensExpectedNaN
         }
      }else if(dat.params.id == "sell_tokens"){
         if(isNaN(dat.amount)){
            $("#amount").addClass("highlight");
            return taskStrings.amountWrongFormat
         }
         
         if(isNaN(dat.nbTokensSold)) {
            $("#nbTokensSold").addClass("highlight");
            return taskStrings.wrongNbOfTokens
         }
         if(isNaN(dat.minTezExpected)){
            $("#minTezExpected").addClass("highlight");
            return taskStrings.minTezExpectedNaN
         }
         
      }
      
      return false
   }

   findTransactionError(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      // console.log(dat)
      
      if(dat.params.id == "buy_tokens"){
         if(!dat.amount || isNaN(dat.amount) || dat.amount < 0) {
            if(trans === undefined){
               // $("#amount").addClass("highlight");
            }
            return taskStrings.wrongAmount
         }
         let acc = this.tezos.objectsPerAddress[dat.sender];
         if(acc.balance < dat.amount){
            // $("#amount").addClass("highlight");
            return taskStrings.amountTooHigh(acc.balance)
         }

         let nbTok = this.getNbOfTokensBought(dat.amount);
         // console.log(nbTok,dat.minTokensExpected)
         if(nbTok < dat.minTokensExpected){
            // $("#minTokensExpected").addClass("highlight");
            return taskStrings.minTokensExpectedTooHigh
         }
         if(nbTok > this.storage.tokens_owned.val){
            // $("#amount").addClass("highlight");
            return taskStrings.nbOfTokensBoughtTooHigh
         }
      }else if(dat.params.id == "sell_tokens"){
         
         if(dat.amount){
            // $("#amount").addClass("highlight");
            return taskStrings.amountUnwanted
         }
         if(!dat.nbTokensSold || isNaN(dat.nbTokensSold) || dat.nbTokensSold < 0) {
            // $("#nbTokensSold").addClass("highlight");
            return taskStrings.wrongNbOfTokens
         }

         let bal = this.tezos.ledger.getUserBalance(dat.sender);
         if(bal < dat.nbTokensSold){
            // $("#nbTokensSold").addClass("highlight");
            return taskStrings.nbOfTokensTooHigh(bal)
         }
         let amo = this.getAmountOfTezBought(dat.nbTokensSold);
         // console.log(nbTok,dat.minTokensExpected)
         if(amo < dat.minTezExpected){
            // $("#minTezExpected").addClass("highlight");
            return taskStrings.minTezExpectedTooHigh
         }
         if(amo > this.balance){
            // $("#nbTokensSold").addClass("highlight");
            return taskStrings.nbOfTezBoughtTooHigh
         }
      }
      let subID = "transfer_tokens";
      let sub = (trans) ? trans.subTransactions[0] : this.getSubtransaction(subID,dat.params.id);
      let subError = this.tezos.ledger.findTransactionError(sub);
      if(subError){
         return subError
      }
      // if(!dat.sub && !dat.signature){
      //    return taskStrings.signatureMissing
      // }
      
      return false
   }

   setTokenBalance(amount) {
      this.storage.tokens_owned.val = amount || 0;
      this.updateK();
   }

   updateK() {
      this.storage.k.val = this.balance*this.storage.tokens_owned.val;
   }

   getTokenPricePerUnit(nb) {
      let k = this.storage.k.val;
      let t = this.storage.tokens_owned.val;
      let b = this.balance;
      let r1 = k/t;
      let r2 = k/(t + nb);
      let p = roundTezAmount((r1 - r2)/nb);
      // let p = ((r1 - r2)/nb);
      let text = "The current value of K is: "+k+"\n";
      text += "The pool owns this amount of tokens: "+t+"\n";
      text += "The balance of the pool is: "+b+" tez\n";
      text += "The ratios before and after a potential purchase of "+nb+" token would be: ";
      text += r1+" "+r2+"\n";
      text += "The price of the token returned is:"+p+" tez\n";
      // console.log(text)
      return p
   }

   getNbOfTokensBought(amount) {
      let k = this.storage.k.val;
      let t = this.storage.tokens_owned.val;
      let b = this.balance;
      let r1 = k/b;
      let r2 = k/(b + amount);
      let nb = Math.min(t,(r1 - r2));
      nb = Math.floor(nb);
      // console.log(nb)
      return nb
   }

   getAmountOfTezBought(tok) {
      let k = this.storage.k.val;
      let t = this.storage.tokens_owned.val;
      let b = this.balance;
      let r1 = k/t;
      let r2 = k/(t + tok);
      let amo = Math.min(b,(r1 - r2));
      amo = roundTezAmount(amo);
      return amo
   }

   viewTokenPrice() {
      return { header: "Token price", text: this.getTokenPricePerUnit(1)+" tez" }
   } 
};

class Raffle extends SmartContract {
   constructor(params) {
      params.entrypoints = {
         "bid": { 
            text: "<span class=ep_name>bid(hash):</span><ul>"+
               "<li>check that amount == bid_amount + deposit_amount</li>"+
               "<li>check that now < deadline_commit</li>"+
               "<li>set players[nb_players] = { address: sender, hash, revealed: false }</li>"+
               "<li>nb_players++</li>"+
               "<li>total_bids += bid_amount</li>"+
               "<li>total_deposits += deposit_amount</li></ul>",
            clickable: true,
            fct: "bid" 
         }, 
         "reveal": {
            text: "<span class=ep_name>reveal(id_player,value):</span><ul>"+
               "<li>check that time < deadline_commit</li>"+
               "<li>player = players[id_player]</li>"+
               "<li>check if !player.revealed</li>"+
               "<li>check if player.hash = hash(value)</li>"+
               "<li>player.revealed = true</li>"+
               "<li>nb_revealed++</li>"+
               "<li>total += value</li></ul>",
            clickable: true,
            fct: "reveal"
         },
         "claim_prize": {
            text: "<span class=ep_name>claim_prize():</span><ul>"+
               "<li>check that time > deadline_reveal</li>"+
               "<li>idWinner = total%nb_players</li>"+
               "<li>winner = players[idWinner]</li>"+
               "<li>check that player.revealed = true</li>"+
               "<li>send player total_bids + total_deposits/nb_revealed</li>"+
               "<li>delete player</li></ul>",
            clickable: true,
            fct: "claimPrize"
         }  
      };
         
      // params.views = {
      //    "get_token_price" : { 
      //       text: "<span class=ep_name>get_token_price():</span><ul>"+
      //          "<li>returns what we would get if we sold one token</li></ul>",
      //       fct: "viewTokenPrice"
      //    }
      // };       
      params.storage = {
         bid_amount: { val: params.bid_amount, type: "nat" },
         deposit_amount: { val: params.deposit_amount, type: "nat" },
         players: { type: "big-map" },
         nb_players: { val: 0, type: "nat" },
         total_bids: { val: 0, type: "tez" },
         total_deposits: { val: 0, type: "tez" },
         total: { val: 0, type: "nat" },
         nb_revealed: { val: 0, type: "nat" },
         deadline_commit: { type: "timestamp" },
         deadline_reveal: { type: "timestamp" }
      };
      let now = Date.now();
      let dc = params.delayCommit || 1000;
      let dr = params.delayReveal || 2000;
      params.storage.deadline_commit.val = now + dc*1000;
      params.storage.deadline_reveal.val = now + dr*1000;
      super(params);
   }

   bid() {
      let params = { 
         id: "bid",
         sc_address: this.address,
         fields: ["hash"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   reveal() {
      let params = { 
         id: "reveal",
         sc_address: this.address,
         fields: ["idPlayer","numberValue"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   claimPrize() {
      let params = { 
         id: "claim_prize",
         sc_address: this.address,
         fields: [],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      let sID = trans.sender;
      let sAcc = this.tezos.objectsPerAddress[sID];
      if(id == "bid"){
         let player = { 
            type: "big-map", 
            address: { val:sAcc.address, type: "address" },
            hash: { val: trans.hash, type: "string" },
            revealed: { val: 0, type: "nat" }
         };
         this.storage.players[this.storage.nb_players.val] = player;
         this.storage.nb_players.val++;
         let ba = this.storage.bid_amount.val;
         let da = this.storage.deposit_amount.val;
         this.storage.total_bids.val = roundTezAmount(this.storage.total_bids.val + ba);
         this.storage.total_deposits.val = roundTezAmount(this.storage.total_deposits.val + da);
      }
      else if(id == "reveal"){
         this.storage.total.val += trans.numberValue;
         this.storage.players[trans.idPlayer].revealed.val = 1;
         this.storage.nb_revealed.val++;
      }
      else if(id == "claim_prize"){
         let idWin = this.storage.total.val%this.storage.nb_players.val;
         let win = this.storage.players[idWin];
         let acc = this.tezos.objectsPerAddress[win.address.val];
         console.log(idWin,win)
         let amo = this.storage.total_bids.val + this.storage.total_deposits.val/this.storage.nb_revealed.val;
         acc.balance = roundTezAmount(acc.balance + amo);
         this.balance = roundTezAmount(this.balance - amo);
         delete this.storage.players[idWin];
      }
   }

   createBidTransaction(address,num) {
      let params = { 
         id: "bid",
         sc_address: this.address,
         fields: ["hash"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      let trans = {
         sender: address,
         recipient: this.address,
         amount: this.storage.bid_amount.val + this.storage.deposit_amount.val,
         randomNumber: num,
         hash: String(num).hashCode(),
         params
      };
      this.tezos.computeGasAndStorage(trans);
      this.tezos.signTransaction(trans,true);
      this.tezos.createTransaction(trans);
   }

   createRevealTransaction(add,id,num) {
      let self = this;
      return function(){
         let params = { 
            id: "reveal",
            sc_address: self.address,
            fields: ["idPlayer","numberValue"],
            gas: "computeTransactionGas",
            storage: "computeTransactionStorage",
            storageChange: "getStorageChange",
            isTransactionValid: "isTransactionValid",
            findTransactionError: "findTransactionError",
         };
         let trans = {
            sender: add,
            recipient: self.address,
            amount: 0,
            idPlayer: id,
            numberValue: num,
            params
         };
         self.tezos.computeGasAndStorage(trans);
         self.tezos.signTransaction(trans,true);
         self.tezos.createTransaction(trans);
      }
   }

   computeTransactionGas() {
      let gas = Math.round(this.tezos.defaultGasPerTransaction*1.5);
      return gas
   }

   computeTransactionStorage(trans) {
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let blob;
      if(id == "bid"){
         blob = new Blob([tr.sender+""+tr.hash]);
      }
      else if(id == "reveal"){
         blob = new Blob(["1"+(this.storage.total.val + tr.numberValue)+""+(this.storage.nb_revealed.val + 1)]);
      }
      else if(id == "claim_prize"){
         blob = new Blob([""]);
      }
      let sto = blob.size;

      return sto
   }

   getStorageChange(trans) {
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let text = "";
      if(id == "bid"){
         text += "- set players["+this.storage.nb_players.val+"] = { address, hash, revealed: 0 }";
         text += "</br>";
         text += "- nb_players++";
         text += "</br>";
         text += "- total_bids += "+this.storage.bid_amount.val;
         text += "</br>";
         text += "- total_deposits += "+this.storage.deposit_amount.val;
      }
      else if(id == "reveal"){
         text += "- set players[id_player].revealed = 1";
         text += "</br>";
         text += "- nb_revealed++";
         text += "</br>";
         text += "- total += value";
      }
      else if(id == "claim_prize"){
         text += "- delete players[id_winner]";
      }
      return text
   }

   isTransactionValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      let id = dat.params.id;
      // console.log(dat)
      if(dat.sender === ""){
         $("#select_sender").addClass("highlight");
         return taskStrings.noSender
      }
      if(isNaN(dat.amount)){
         $("#amount").addClass("highlight");
         return taskStrings.amountWrongFormat
      }
      if(id == "bid"){
         let num = dat.randomNumber;
         if(isNaN(num) || num < 0 || !Number.isInteger(num)) {
            $("#randomNumber").addClass("highlight");
            return taskStrings.wrongNumber
         }
      }
      else if(id == "reveal"){
         let p = dat.idPlayer;
         if(isNaN(p) || p < 0 || !Number.isInteger(p)) {
            $("#randomNumber").addClass("highlight");
            return taskStrings.wrongIdPlayer
         }
         let num = dat.numberValue;
         if(isNaN(num) || num < 0 || !Number.isInteger(num)) {
            $("#randomNumber").addClass("highlight");
            return taskStrings.wrongNumber
         }
      }
      
      return false
   }

   findTransactionError(trans) {
      // // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      let id = dat.params.id;
      // // console.log(dat)
      
      if(id == "bid"){
         let t = this.tezos.getCurrentTime();
         if(t > this.storage.deadline_commit.val){
            return taskStrings.pastDeadlineCommit
         }
         let amo = dat.amount;
         if(amo != this.storage.bid_amount.val + this.storage.deposit_amount.val){
            return taskStrings.amountWrongValue
         }
         let sen = dat.sender;
         let acc = this.tezos.objectsPerAddress[sen];
         if(acc.balance < amo){
            return taskStrings.amountTooHigh(acc.balance)
         }
      }
      else if(id == "reveal"){
         let t = this.tezos.getCurrentTime();
         if(t > this.storage.deadline_reveal.val){
            return taskStrings.pastDeadlineReveal
         }
         if(dat.amount){
            return taskStrings.amountUnwanted
         }
         let p = this.storage.players[dat.idPlayer];
         if(!p){
            return taskStrings.playerUnknown
         }
         if(p.revealed.val > 0){
            return taskStrings.alreadyRevealed
         }
         if(p.hash.val != String(dat.numberValue).hashCode()){
            return taskStrings.wrongHash
         }
      }
      else if(id == "claim_prize"){
         let t = this.tezos.getCurrentTime();
         if(t < this.storage.deadline_reveal.val){
            return taskStrings.beforeDeadlineReveal
         }
         if(dat.amount){
            return taskStrings.amountUnwanted
         }
         let idWin = this.storage.total.val%this.storage.nb_players.val;
         let win = this.storage.players[idWin];
         if(!win){
            return taskStrings.playerUnknown
         }
         if(win.revealed.val == 0){
            return taskStrings.winnerNotRevealed
         }
      }
      return false
   }
}


function Tezos(params) {
   let { accounts, transactions, mempool, mempoolMode, nbCreatedAccounts, 
      counterEnabled, ledgerEnabled, createAccountEnabled, nextXBlocksEnabled, delayBetweenBlocks,
      transactionTableLength, smartContracts, liquidityPools, raffles, pageW, pageH, saveAnswer } = params;
   let self = this;

   transactionTableLength = transactionTableLength || 7;
   mempoolMode = mempoolMode || "auto"; // "none", "auto", "manual"
   delayBetweenBlocks = delayBetweenBlocks || 1000;
   
   const marginX = 20;
   const marginY = 20;

   const transactionTableW = pageW*0.5;
   const accountsTableW = pageW*0.4;

   const maxAccounts = accounts.length;
   const cellH = 30;
   const transactionTableH = cellH*(transactionTableLength + 1) + 3;
   const mempoolLength = 4;
   const headerH = 30;
   const gasCostPerUnit = 0.0005;
   const storageCostPerUnit = 0.0004;
   const feeConstant = 0.0002;
   const blockSize = 30; // gas unit
   const allowEmptyBlocks = true;
   const transactionTableColKeys = ["sender", "amount","recipient","parameters"];

   this.crossSrc = $("#cross").attr("src");
   
   this.accounts = accounts || [];
   this.nbCreatedAccounts = nbCreatedAccounts || 0;
   this.transactions = [];
   this.mempool = mempool || [];
   this.blocks = [];
   this.blockIndex = 1;
   this.bakerBalance = 0;
   this.ledger;
   this.smartContracts = [];
   this.defaultGasPerTransaction = 10;
   this.objectsPerAddress = {};
   this.additionalFee = 0;
   this.timeShift = 0;

   let nbSmartContracts;
   let fields;
   let copied = null;
   let timeDependencies = [];



   function init() {
      initMainPage();
      initObjectsPerAddress();
      initHandlers();

      if(transactions.length > 0){
         for(let tr of transactions){
            self.createTransaction(tr);
         }
      }

      updateMemPool();
      updateAccountsTable();
      updateTransactionTable();

      let transH = (transactionTableLength + 1)*30;
      let mempoolH = (mempoolLength + 1)*30;
      let leftColH = marginY + headerH + transH + marginY;
      if(mempoolMode != "none"){
         leftColH += mempoolH + marginY;
      }
      let accountH = (maxAccounts + 1)*30;
      let smartContractsH = (self.smartContracts.length + 1)*30;
      let nbButtons = 2;
      if(createAccountEnabled)
         nbButtons++;

      let rightColH = marginY + headerH + accountH + marginY + headerH + smartContractsH + marginY + nbButtons*($("button").height() + marginY);
      pageH = Math.max(leftColH,rightColH);

      displayHelper.taskH = pageH;
      displayHelper.taskW = pageW;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;
   };

   function initMainPage() {
      let main = $("<div id='mainPage'></div>");
      let transactionTable = initTransactionTable();
      let accountsTable = initAccountsTable();
      main.append(transactionTable,accountsTable);
      $("#taskCont").empty();
      $("#taskCont").append(main);
   };

   function initTransactionTable() {
      let transDiv = $("<div id='transactions'></div>");
      transDiv.append("<h3>"+taskStrings.transactions+"</h3>");

      let cont = $("<div id=transaction_table_cont></div>");
      let table = getTransactionTable("transaction_table",transactionTableLength);
      cont.append(table);
      transDiv.append(cont);

      if(mempoolMode != "none"){
         let colKeys = transactionTableColKeys;
         let memPoolTable = $("<table id='mem_pool_table'></table>");
         for(let row = 0; row <= mempoolLength; row++){
            let line = $("<tr class=row_"+row+"></tr>");
            if(row == 0){
               line.append($("<th colspan="+colKeys.length+">"+taskStrings.mempool+"</th>"));
            }else{
               for(let col = 0; col < colKeys.length; col++){
                  let entry = "";
                  line.append($("<td class='col_"+col+"'>"+entry+"</td>"));
               }
            }
            memPoolTable.append(line);
         }
         transDiv.append(memPoolTable);
      }
      transDiv.css("width",transactionTableW+"px");
      cont.css("height",transactionTableH+"px");

      let clone = cont.clone();
      clone.attr("id","transaction_table_cont_clone");
      clone.children("tr:not(.row_0)").remove();
      clone.css({
         height: "auto",
         width: transactionTableW+"px"
      })
      transDiv.append(clone);

      return transDiv
   };

   function initAccountsTable() {
      let accountDiv = $("<div id='accountsCont'></div>");
      accountDiv.append("<h3>"+taskStrings.accounts+"</h3>");

      let table = $("<table id='accounts_table'></table>");
      let colKeys = ["alias","address", "balance"];

      for(let row = 0; row <= accounts.length; row++){
         let line = $("<tr class=row_"+row+"></tr>");
         for(let col = 0; col < colKeys.length; col++){
            let entry = "", type = "td";
            let k = colKeys[col];
            if(row == 0){
               entry = taskStrings[k];
               type = "th";
            }else if(nbCreatedAccounts >= row){
               entry = accounts[row - 1][k];
               if(k == "address")
                  self.objectsPerAddress[entry] = accounts[row - 1];
                  entry = addressEllipsis(entry);
               if(k == "balance")
                  entry += " tez";
            }
            line.append($("<"+type+" class='col_"+col+"'>"+entry+"</"+type+">"));
         }
         table.append(line);
      }
      accountDiv.append(table);
      accountDiv.css("width",accountsTableW+"px");

      let smartContracts = initSmartContracts();

      let buttons = initButtons();
      accountDiv.append(smartContracts,buttons);

      return accountDiv
   };

   function initSmartContracts() {
      if(ledgerEnabled || liquidityPools){
         self.ledger = new Ledger({tezos:self});
         self.ledger.display();
         self.smartContracts.push(self.ledger);
         self.objectsPerAddress[self.ledger.address] = self.ledger;
      }
      if(liquidityPools && liquidityPools.length > 0){
         for(let lpData of liquidityPools){
            lpData.tezos = self;
            let lp = new LiquidityPool(lpData);
            lp.setTokenBalance(lpData.token_balance);
            self.smartContracts.push(lp);
            self.objectsPerAddress[lp.address] = lp;
            self.ledger.changeUserBalance(lp.address,lpData.token_balance,1);
         }
      }
      if(raffles && raffles.length > 0){
         for(let lpData of raffles){
            lpData.tezos = self;
            let lp = new Raffle(lpData);
            // lp.setTokenBalance(lpData.token_balance);
            self.smartContracts.push(lp);
            self.objectsPerAddress[lp.address] = lp;
            for(let iP = 0; iP < lpData.playerNumbers.length; iP++){
               let num = lpData.playerNumbers[iP];
               let add = accounts[iP].address;
               lp.createBidTransaction(add,num);
               timeDependencies.push({
                  time: lp.storage.deadline_commit.val - 2*delayBetweenBlocks*1000,
                  action: lp.createRevealTransaction(add,iP,num),
                  done: false
               });
            }
         }
      }

      nbSmartContracts = self.smartContracts.length;

      let scDiv = $("<div id='smartContractsCont'></div>");
      scDiv.append("<h3>"+taskStrings.smartContracts+"</h3>");

      let table = $("<table id='smart_contracts_table'></table>");
      let colKeys = ["alias","address"];

      for(let row = 0; row <= nbSmartContracts; row++){
         let line = $("<tr class=row_"+row+"></tr>");
         for(let col = 0; col < colKeys.length; col++){
            let entry = "", type = "td";
            let k = colKeys[col];
            if(row == 0){
               entry = taskStrings[k];
               type = "th";
            }else{
               entry = self.smartContracts[row - 1][k];
               if(k == "address")
                  entry = addressEllipsis(entry);
            }
            line.append($("<"+type+" class='col_"+col+"'>"+entry+"</"+type+">"));
         }
         table.append(line);
      }
      scDiv.append(table);

      return scDiv
   };

   function initButtons() {
      let buttons = $("<div id=buttons></div>");
      let ids = ["newTransaction"];
      if(createAccountEnabled){
         ids.unshift("newAccount");
      }
      if(nextXBlocksEnabled){
         ids.push("nextXBlocks");
      }else{
         ids.push("nextBlock");
      }
      for(let iB = 0; iB < ids.length; iB++){
         buttons.append("<button type=button id="+ids[iB]+">"+taskStrings[ids[iB]]+"</button>");
      } 
      return buttons
   };

   function initObjectsPerAddress() {
      for(let acc of self.accounts){
         // self.objectsPerAddress[acc.address] = acc;
      }
      for(let sc of self.smartContracts){
         // self.objectsPerAddress[sc.address] = sc;
      }
   };

   function initHandlers() {
      for(let row = 0; row < accounts.length; row++){
         $("#accounts_table .row_"+(row + 1)).on("click",viewAccount(row));
         $("#accounts_table .row_"+(row + 1)).css("cursor","pointer");
      }
      for(let row = 0; row < mempoolLength; row++){
         $("#mem_pool_table .row_"+(row + 1)).on("click",clickMemPool(row));
         $("#mem_pool_table .row_"+(row + 1)).css("cursor","pointer");
      }
      for(let row = 0; row < nbSmartContracts; row++){
         $("#smart_contracts_table .row_"+(row + 1)).on("click",clickSmartContract(row));
         $("#smart_contracts_table .row_"+(row + 1)).css("cursor","pointer");
      }

      $("#newAccount").on("click",createNewAccount);
      $("#newAccount").css("cursor","pointer");   

      $("#newTransaction").on("click",self.createNewTransaction({simple: true}));
      $("#newTransaction").css("cursor","pointer");  

      $("#nextBlock").on("click",createNextBlock);
      $("#nextBlock").css("cursor","pointer"); 

      $("#nextXBlocks").on("click",createNextXBlocks);
      $("#nextXBlocks").css("cursor","pointer");   
   };

   function clickMemPool(row) {
      return function() {
         displayError("");
         let id = self.mempool[row];
         if(id != undefined){
            viewTransaction(id)();
         }
      }
   };

   function clickSmartContract(row) {
      return function() {
         displayError("");
         let sc = self.smartContracts[row];
         if(sc != undefined){
            sc.display();
         }
      }
   };

   function viewAccount(row) {
      return function() {
         // console.log("viewAccount");
         displayError("");
         if(row >= self.nbCreatedAccounts)
            return
         let view = $("<div id=view></div>");
         let back = $("<div id=back></div>");

         let acc = displayAccount(row);
         view.append(back,acc);
         $("#mainPage").append(view);

         view.on("click",deleteView());
         view.css("cursor","pointer");

         function displayAccount(id) {
            let dat = accounts[id];
            let cont = $("<div id=view_account class=view></div>");
            let header = $("<div id=header>"+taskStrings.account+": "+dat.alias+"<img src="+self.crossSrc+" class=icon /></div>");
            let content = $("<div id=content></div>");

            let html = "";
            for(let key in dat){
               if(key == "owner")
                  continue;
               if(dat.owner != 0 && key == "privateKey")
                  continue;
               if(!counterEnabled && key == "transactionNum")
                  continue;
               let val = dat[key];
               if(key == "address")
                  val = addressEllipsis(val);
               html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+val;
               if(key == "balance")
                  html += " tez";
               html += "</p>";
            }
            content.append(html);
            cont.append(header,content);
            return cont
         }
      }
   };

   function viewTransaction(id,type,trans) {
      return function() {
         // console.log("viewTransaction",id,type,trans)
         displayError("");
         let viewId = "view";
         let backId = "back";
         let dat = self.transactions[id];
         let headerStr = taskStrings.transactionDetails;
         let params, err;
         if(type == 1){
            viewId = "simView";
            backId = "simBack";
            headerStr = taskStrings.simulationResults;
            dat = self.newTransaction;
         }else if(type == 2){
            viewId = "subView";
            backId = "subBack";
            dat = trans;
         }
         params = dat.params;
         
         if(type == 1){
            err = findTransactionError();
            if(!err){
               self.computeGasAndStorage(trans);
            }
         }

         let view = $("<div id="+viewId+"></div>");
         let back = $("<div id="+backId+"></div>");

         // let dat = (sim) ? self.newTransaction : self.transactions[id];
         let tra = displayTransaction();
         view.append(back,tra);
         $("#mainPage").append(view);

         initTransactionHandlers();

         function findTransactionError() {
            if(!params.simple){
               return findEntrypointCallError()
            }
            if(dat.recipient == self.newTransaction.sender){
               return taskStrings.recipientIsSender
            }
            let acc = self.objectsPerAddress[dat.sender];
            // console.log(acc.balance,dat.amount,acc.balance < dat.amount);
            if(acc.balance < dat.amount){
               return taskStrings.amountTooHigh(acc.balance)
            }
            if(counterEnabled && dat.counter != acc.transactionNum + 1){
               return taskStrings.wrongCounter(acc.transactionNum)
            } 
            return false
         };

         function findEntrypointCallError() {
            let dat = self.newTransaction;
            let sc = self.objectsPerAddress[params.sc_address];
            let scError = sc[params.findTransactionError]();
            // console.log(scError);
            if(!scError){
               return false
            }
            let { id, fields } = params;
            let values = [];
            for(let field of fields){
               let val = dat[field];
               switch(field){
               case "sender":
               // case "recipient_ep":
               case "destination_ep":
               case "operator":
                  if(val){
                     let acc = self.objectsPerAddress[dat[field]];
                     val = acc.alias;
                  }else{
                     val = undefined;
                  }
                  break;
               }
               values.push(val);
            }
            let error = taskStrings.epError(sc.alias,id,values)+"\""+scError+"\"";
            // displayError(error);
            return error
         }

         // function computeGasAndStorage() {
         //    if(!params.simple){
         //       let sc = self.objectsPerAddress[params.sc_address];
         //       self.newTransaction.storage = sc[params.storage]();
         //       self.newTransaction.storageChange = sc[params.storageChange]();
         //    }

         //    let fee, gas;
         //    if(params.simple){
         //       gas = self.defaultGasPerTransaction;
         //    }else{
         //       let sc = self.objectsPerAddress[params.sc_address];
         //       gas = sc[params.gas]();  
         //    }
         //    self.newTransaction.gas = gas;
         //    fee = roundTezAmount(gas*gasCostPerUnit + feeConstant);
         //    self.newTransaction.bakerFee = fee;
         // };

         function displayTransaction() {
            let cont = $("<div id=view_transaction class=view></div>");
            let header = $("<div id=header>"+headerStr+"<img src="+self.crossSrc+" class=icon /></div>");
            let content = $("<div id=content></div>");

            let transactionKeys = ["sender","recipient","amount"];
            
            if(!params.simple){
               transactionKeys.push("id");
               for(let field of params.fields){
                  if(!transactionKeys.includes(field)){
                     transactionKeys.push(field);
                  }
               }
               transactionKeys.push("epEnd");
               if(dat.subTransactions)
                  transactionKeys.push("subTransactions");

            }
            if(!err){
               transactionKeys.push("gas","storage");
               if(!dat.sub)
                  transactionKeys.push("counter","bakerFee");
               if(!params.simple)
                  transactionKeys.push("storageChange");
               if(!dat.sub){
                  transactionKeys.push("counter");
                  if(type == 1)
                     transactionKeys.push("additionalFee");
                  transactionKeys.push("signature");
               }

            }else{
               transactionKeys.push("error");
            }

            // let ep = false;
            let html = "";
            for(let key of transactionKeys){
               switch(key){
               case "sender":
               case "recipient":
                  let obj = self.objectsPerAddress[dat[key]];
                  // console.log(obj,dat[key])
                  let str = (obj.tezos) ? addressEllipsis(obj.address) : obj.alias;
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+str+"</p>";
                  break;
               case "amount":
               case "bakerFee":
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" tez</p>";
                  break;
               case "additionalFee":
                  html += "<hr/>";
                  html += "<p class=line><span class=label>"+taskStrings.additionalFee+"</span> <input type=text id=additionalFee class=input value="+self.additionalFee+" />";
                  break;
               case "gas":
                  let gCost = roundTezAmount(dat[key]*gasCostPerUnit);
                  html += "<hr/>";
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" (cost = "+gCost+" tez)</p>";
                  break;
               case "storage":
                  // console.log(storageCostPerUnit);
                  let sCost = roundTezAmount(dat[key]*storageCostPerUnit);
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" "+taskStrings.byte(dat[key])+" (cost = "+sCost+" tez)</p>";
                  break;
               case "counter":
                  if(counterEnabled)
                     html += "<p class=line><span class=label>"+taskStrings.transactionNum+":</span> "+dat[key]+"</p>";
                  break;
               case "signature":
                  let sig = (dat.signature) ? addressEllipsis(dat.signature) : taskStrings.notSigned;
                  if(type == 1){
                     let cla = (dat.signature) ? "signed" : "unsigned";
                     html += "<div class='signature "+cla+"'>";
                     html += "<span class=label>"+taskStrings[key]+":</span> <span class=value>"+sig+"</span></div>";
                  }else{
                     html += "<hr/>";
                     html += "<p class=line><span class=label>"+taskStrings[key]+":</span> <span class=value>"+sig+"</span></p>";
                  }
                  break;
               case "id":
                  // ep = true;
                  html += "<div class=ep_cont>";
                  html += "<p class=line><span class=label>"+taskStrings.entrypoint+":</span> "+params.id+"</p>";
                  html += "<p class=line><span class=label>"+taskStrings.parameters+":</span></p>";
                  break;
               case "epEnd":
                  html += "</div>";
                  break;
               case "source":
               case "operator":
               case "destination_ep":
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+":</span> "+self.objectsPerAddress[dat[key]].alias+"</p>";
                  break;
               case "nbOfTokens":
               case "nbTokensSold":
               case "minTokensExpected":
               case "minTezExpected":
               case "hash":
               case "idPlayer":
               case "numberValue":
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+":</span> "+dat[key]+"</p>";
                  break;
               case "subTransactions":
                  html += "<p class=line><span class=label>"+taskStrings.subTransactions+":</span></p>";
                  let colKeys = transactionTableColKeys;
                  let table = getTransactionTable("sub_transaction_table",dat[key].length,dat[key]);
                  let div = $("<div></div>");
                  div.append(table);
                  html += div.html();
                  break;
               case "storageChange":
                  html += "<hr/>";
                  html += "<p class=line><span class='label'>"+taskStrings.storageChange+":</span></p>";
                  html += "<p class=line id=storage_change>"+dat.storageChange+"</p>";
                  break;
               case "error":
                  html += "<p class='line error'>"+taskStrings.error+" : "+err+"</p>";
                  break;
               }
            }

            // if(ep){
               // html += "</div>";
            // }

            if(type == 1){
               if(!err){
                  let id = (dat.signature) ? "validate" : "sign";
                  html += "<div id=buttons ><button id=validate>"+taskStrings[id]+"</button><button id=cancel>"+taskStrings.edit+"</button></div>";
               }else{
                  html += "<button id=cancel>"+taskStrings.cancel+"</button>";
               }
            }else if(!type){
               html += "<button id=copy>"+taskStrings.copy+"</button>";
            }

            content.append(html);
            cont.append(header,content);
            return cont
         }

         function initTransactionHandlers() {
            if(!type){
               $("#view #header, #back").on("click",deleteView());
               $("#view #header, #back").css("cursor","pointer");

               $("#view #copy").css("cursor","pointer");
               $("#view #copy").on("click",function() {
                  deleteView()();
                  self.newTransaction = Beav.Object.clone(self.transactions[id]);
                  copied = id;
                  // delete self.newTransaction.signature;
                  self.createNewTransaction(null,true)();
               });   
            }
            if(type == 1){
               $("#additionalFee").on("keyup",function() {
                  displayError("");
                  if(isNaN(this.value)){
                     $(this).addClass("highlight");
                  }else{
                     $(this).removeClass("highlight");
                  }
                  let val = Number(this.value);
                  val = roundTezAmount(val);
                  self.additionalFee = val;
               });
               $("#simView #cancel").on("click",deleteView(type));
               $("#simView #cancel").css("cursor","pointer");
               $("#simView #validate").on("click",validateTransaction);
               $("#simView #cancel").css("cursor","pointer");
            }
            if(type == 2){
               $("#subView, #subBack").on("click",deleteView(2));
               $("#subView, #subBack").css("cursor","pointer");
            }
            if(dat.subTransactions){
               for(let iSub = 1; iSub <= dat.subTransactions.length; iSub++){
                  let sub = dat.subTransactions[iSub - 1];
                  $("#sub_transaction_table .row_"+iSub).click(viewTransaction(null,2,sub));
                  $("#sub_transaction_table .row_"+iSub).css("cursor","pointer");
               }
            }
         }

         function validateTransaction() {
            if(!self.newTransaction.signature){
               let err = self.signTransaction();
               if(err){
                  displayError(err);
               }else{
                  $(".signature .value, #signature").text(addressEllipsis(self.newTransaction.signature));
                  $(".signature").removeClass("unsigned").addClass("signed");
                  $("#validate").text(taskStrings.validate);
               }
               return
            }
            let add = self.additionalFee;
            if(isNaN(add) || add < 0){
               displayError(taskStrings.wrongAdditionalFee);
               $("#additionalFee").addClass("highlight");
               return
            }
            let sen = self.objectsPerAddress[self.newTransaction.sender];
            if(sen.balance < add + self.newTransaction.bakerFee){
               displayError(taskStrings.amountTooHigh(sen.balance));
               $("#additionalFee").addClass("highlight");
               return
            }
            $("#additionalFee").val(self.additionalFee);
            self.newTransaction.bakerFee += self.additionalFee;
            self.createTransaction();
            deleteView()();
         };

         // function signTransaction(trans) {
         //    displayError("");
         //    let tr = trans || self.newTransaction;
         //    let sen = tr.sender;
         //    let acc = self.objectsPerAddress[sen];
         //    // console.log("sign",acc)
         //    if(acc.owner != 0){
         //       return taskStrings.cantSign
         //    }
         //    let clone = Beav.Object.clone(tr);
         //    delete clone.storageChange;
         //    delete clone.subTransactions;
         //    delete clone.bakerFee;
         //    tr.signature = JSON.stringify(clone).hashCode();
         //    return false
         // };
      }
   };

   this.signTransaction = function(trans,noOwner) {
      displayError("");
      let tr = trans || self.newTransaction;
      let sen = tr.sender;
      let acc = self.objectsPerAddress[sen];
      // console.log("sign",acc)
      if(!noOwner && acc.owner != 0){
         return taskStrings.cantSign
      }
      let clone = Beav.Object.clone(tr);
      delete clone.storageChange;
      delete clone.subTransactions;
      delete clone.bakerFee;
      tr.signature = JSON.stringify(clone).hashCode();
      return false
   };

   this.computeGasAndStorage = function(trans) {
      let tr = trans || self.newTransaction;
      let params = tr.params;
      if(!params.simple){
         let sc = self.objectsPerAddress[params.sc_address];
         tr.storage = sc[params.storage](tr);
         tr.storageChange = sc[params.storageChange](tr);
      }

      let fee, gas;
      if(params.simple){
         gas = self.defaultGasPerTransaction;
      }else{
         let sc = self.objectsPerAddress[params.sc_address];
         gas = sc[params.gas]();  
      }
      tr.gas = gas;
      fee = roundTezAmount(gas*gasCostPerUnit + feeConstant);
      tr.bakerFee = fee;
   };

   function createNewAccount() {
      displayError("");
      if(self.nbCreatedAccounts >= maxAccounts){
         displayError(taskStrings.maxAccounts);
         return
      }
      self.nbCreatedAccounts++;
      updateAccountsTable();
   };

   this.createNewTransaction = function(params,copy) {
      return function() {
         deleteView()();
         let ownAcc = false;
         for(let iA = 0; iA < self.nbCreatedAccounts; iA++){
            let dat = self.accounts[iA];
            if(dat.owner == 0){
               ownAcc = true;
               break;
            }
         }
         if(!ownAcc){
            displayError(taskStrings.noAccount);
            return
         }

         if(self.newTransaction == undefined){
            self.newTransaction = { amount: 0, counter: 1 };
            delete self.newTransaction.signature;
            self.newTransaction.storage = 0;
         }
         if(!params)
            params = self.newTransaction.params || { simple: true };

         fields = ["sender","recipient","amount"]
         if(!params.simple){
            fields.push("entrypoint");
            for(let field of params.fields){
               if(!fields.includes(field))
                  fields.push(field);
            }
            fields.push("epEnd");
            // fields = fields.concat(params.fields);
         }
         fields.push("counter","signature");
         self.newTransaction.params = Beav.Object.clone(params);
         // console.log(params)

         let view = $("<div id=view></div>");
         let back = $("<div id=back></div>");

         let form = displayTransactionForm();
         view.append(back,form);
         $("#mainPage").append(view);

         initFormHandlers();

         if(copy){
            simulate();
         }

         function displayTransactionForm() {
            // console.log(params);
            let headerStr = taskStrings.newTransaction;
            let cont = $("<div id=transaction_form class='view form'></div>");
            let header = $("<div id=header>"+headerStr+"</div>");
            let content = $("<div id=content></div>");

            let html = "";
            let ep = false;

            for(let field of fields){
               if(!counterEnabled && field == "counter")
                  continue;
               let name = taskStrings[field];
               // if(field == "recipient_ep"){
               //    name = taskStrings.recipient;
               // }
               if(field == "entrypoint"){
                  html += "<div class=ep_cont>";
               //    ep = true;
               }
               if(field == "signature")
                  html += "<hr/>";
               if(field == "epEnd"){
                  html += "</div>";
                  continue;
               }
               if(field == "hash"){
                  html += "<p class=field>"+taskStrings.randomNumber;
               }else{
                  html += "<p class=field>"+name;
               }
               switch(field){
               case "sender":
               case "recipient":
               case "destination_ep":
               case "operator":
               case "source":
                  if(self.newTransaction[field] == undefined){
                     self.newTransaction[field] = "";
                  }
                  if(!params.simple && field == "recipient"){
                     self.newTransaction[field] = params.sc_address;
                     html += "<span class=address>"+addressEllipsis(self.newTransaction[field])+"</span>";
                     break;
                  }
                  html += "<select id=select_"+field+" class=input ><option value=''>--</option>";
                  if(field != "sender" && field != "recipient"){
                     for(let add in self.objectsPerAddress){
                        if(add == self.ledger.address){
                           continue;
                        }
                        let dat = self.objectsPerAddress[add];
                        html += "<option value="+dat.address+" "+((self.newTransaction[field] == dat.address) ? "selected" : "")+">"+dat.alias+"</option>";
                     }
                  }else{
                     for(let iA = 0; iA < self.nbCreatedAccounts; iA++){
                        let dat = self.accounts[iA];
                        // console.log(dat)
                        if(field == "sender" && dat.owner > 0 && self.newTransaction[field] != dat.address){
                           continue;
                        }
                        html += "<option value="+dat.address+" "+((self.newTransaction[field] == dat.address) ? "selected" : "")+">"+dat.alias+"</option>";
                     }
                  }
                  html += "</select>";
                  break;
               case "amount":
               case "nbOfTokens":
               case "nbTokensSold":
               case "minTokensExpected":
               case "minTezExpected":
               case "idPlayer":
               case "numberValue":
                  let val = self.newTransaction[field] || 0;
                  self.newTransaction[field] = val;
                  html += "<input type=text id="+field+" class=input value="+val+" />";
                  break;
               case "counter":
                  html += "<input type=number min=1 id=counter class=input  value="+self.newTransaction[field]+" />";
                  break;
               case "signature":
                  let sig = (self.newTransaction[field]) ? addressEllipsis(self.newTransaction[field]) : taskStrings.notSigned;
                  html += "<span id=signature>"+sig+"</span>";
                  break;
               case "hash":
                  let num = self.newTransaction.randomNumber || 0;
                  self.newTransaction.randomNumber = num;
                  html += "<input type=text id=randomNumber class=input value="+num+" /></p>";
                  html += "<p class=field>"+name+"<span id=hash>"+updateHash(num)+"</span>";
                  break;

               // case "bakerFee":
               //    let fee, gas;
               //    if(params.simple){
               //       gas = self.defaultGasPerTransaction;
               //    }else{
               //       let sc = self.objectsPerAddress[params.sc_address];
               //       gas = sc[params.gas]();  
               //    }
               //    self.newTransaction.gas = gas;
               //    fee = roundTezAmount(gas*gasCostPerUnit + feeConstant);
               //    self.newTransaction.bakerFee = fee;
               //    html += "<span id=fee>"+fee+" tez</span>";
               //    break;
               case "entrypoint":
                  // html += "<div class=ep_cont>";
                  html += "<span>"+params.id+"</span>";
                  break;

               }
               html += "</p>";
               // if(field == "signature")
               //    html += "<button id=sign>"+taskStrings.sign+"</button>";
            }
            if(ep)
               html += "</div>";
            html += "<div id=buttons ><button id=simulate>"+taskStrings.simulate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
            content.append(html);
            cont.append(header,content);
            return cont
         }
      };

      function initFormHandlers() {
         $("[id^=select_").on("change",function() {
            displayError("");
            $(".form select").removeClass("highlight");
            // self.newTransaction.sender = this.value;
            let id = $(this).attr("id");
            let field = id.replace("select_","");
            let val = this.value;
            if(self.newTransaction[field] != val){
               self.newTransaction[field] = val;
               delete self.newTransaction.signature
               $("#transaction_form #signature").text(taskStrings.notSigned);
            }
            // console.log(self.newTransaction)
         });

         $("#amount, #nbOfTokens, #nbTokensSold, #minTokensExpected, #minTezExpected,"+
            " #counter, #randomNumber, #idPlayer, #numberValue").on("keyup",function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let id = $(this).attr("id");
            let val = Number(this.value);
            if(id == "amount" || id == "minTezExpected")
               val = roundTezAmount(val);
            if(id == "randomNumber")
               updateHash(val);
            if(self.newTransaction[id] != val){
               self.newTransaction[id] = val;
               delete self.newTransaction.signature
               $("#transaction_form #signature").text(taskStrings.notSigned);
            }
            // self.newTransaction[id] = Number(val);
            // console.log(self.newTransaction)
         });
         

         // $("#sign").on("click",signTransaction);
         // $("#sign").css("cursor","pointer");

         $("#simulate").on("click",simulate);
         $("#simulate").css("cursor","pointer");

         $("#cancel").on("click",deleteView());
         $("#cancel").css("cursor","pointer");
      };

      function updateHash(val) {
         var h = String(val).hashCode();
         $("#hash").text(h);
         self.newTransaction.hash = h;
         return h
      };

      function simulate() {
         // console.log(fields)
         $("#amount").val(self.newTransaction.amount);
         if(!isTransactionValid())
            return
         if(!params.simple){
            if(self.newTransaction.minTezExpected){
               $("#minTezExpected").val(self.newTransaction.minTezExpected);
            }
         //    let sc = self.objectsPerAddress[params.sc_address];
         //    self.newTransaction.storage = sc[params.storage]();
         //    self.newTransaction.storageChange = sc[params.storageChange]();
         }

         // let fee, gas;
         // if(params.simple){
         //    gas = self.defaultGasPerTransaction;
         // }else{
         //    let sc = self.objectsPerAddress[params.sc_address];
         //    gas = sc[params.gas]();  
         // }
         // self.newTransaction.gas = gas;
         // fee = roundTezAmount(gas*gasCostPerUnit + feeConstant);
         // self.newTransaction.bakerFee = fee;

         if(copied != null){
            let ori = self.transactions[copied];
            let same = true;
            for(let key of fields){
               if(ori[key] != self.newTransaction[key]){
                  // console.log("diff",key,ori[key],self.newTransaction[key])
                  same = false
               }
            }
            if(!same){
               delete self.newTransaction.signature;
            }else{
               self.newTransaction.signature = ori.signature;
            }
         }
         // console.log(params)
         viewTransaction(null,1)();
      };
      
      function isTransactionValid() {
         // console.log(fields)
         if(!params.simple){
            return isEntrypointCallValid()
         }
         let dat = self.newTransaction;
         if(dat.sender === ""){
            displayError(taskStrings.noSender);
            $("#select_sender").addClass("highlight");
            return false
         }  
         if(dat.recipient === ""){
            displayError(taskStrings.noRecipient);
            $("#select_recipient").addClass("highlight");
            return false
         } 
         // if(dat.recipient == self.newTransaction.sender){
         //    displayError(taskStrings.recipientIsSender);
         //    $("#select_sender").addClass("highlight");
         //    $("#select_recipient").addClass("highlight");
         //    return false
         // } 
         if(/*!dat.amount || */isNaN(dat.amount) || dat.amount < 0){
            displayError(taskStrings.wrongAmount);
            $("#amount").addClass("highlight");
            return false
         }
         // let acc = self.objectsPerAddress[dat.sender];
         // // console.log(acc.balance,dat.amount,acc.balance < dat.amount);
         // if(acc.balance < dat.amount){
         //    displayError(taskStrings.amountTooHigh(acc.balance));
         //    $("#amount").addClass("highlight");
         //    return false
         // }
         // if(counterEnabled && dat.counter != acc.transactionNum + 1){
         //    displayError(taskStrings.wrongCounter(acc.transactionNum));
         //    $("#counter").addClass("highlight");
         //    return false
         // }
         // if(!dat.signature){
         //    displayError(taskStrings.signatureMissing);
         //    return false
         // }
         return true
      };

      function isEntrypointCallValid() {
         let dat = self.newTransaction;
         let sc = self.objectsPerAddress[params.sc_address];
         let scError = sc[params.isTransactionValid]();
         // console.log(scError);
         if(!scError){
            return true
         }
         let { id, fields } = params;
         let values = [];
         for(let field of fields){
            let val = dat[field];
            switch(field){
            case "sender":
            // case "recipient_ep":
            case "destination_ep":
            case "operator":
               if(val){
                  let acc = self.objectsPerAddress[dat[field]];
                  val = acc.alias;
               }else{
                  val = undefined;
               }
               break;
            }
            values.push(val);
         }
         // let error = taskStrings.epError(sc.alias,id,values)+"\""+scError+"\"";
         displayError(scError);
         return false
      }
   };

   this.createTransaction = function(trans) {
      let tr = trans || self.newTransaction;
      let id = self.transactions.length; 
      self.transactions[id] = Beav.Object.clone(tr);
      // console.log(JSON.stringify(tr))
      self.newTransaction = undefined;
      copied = null;
      if(mempoolMode != "none"){
         self.mempool.push(id);
         updateMemPool();
      }else{
         applyTransaction(id);
         if(self.blocks.length == 0){
            createNextBlock();
         }
         let block = self.blocks[self.blocks.length - 1];
         // self.blocks.push(block);
         block.transactions.push(id);
         updateTransactionTable();
         updateAccountsTable();
      }
      // self.signatureIndex++;

   };

   function applyTransaction(id) {
      let trans = self.transactions[id];
      // console.log(trans)
      let sID = trans.sender;
      let rID = trans.recipient;
      let amo = trans.amount;
      let fee = trans.bakerFee;
      let gas = trans.gas;
      let sto = trans.storage;
      let par = trans.params;
      self.objectsPerAddress[sID].balance -= (amo + fee + gas*gasCostPerUnit + sto*storageCostPerUnit);
      self.objectsPerAddress[rID].balance += amo;
      self.objectsPerAddress[sID].balance = roundTezAmount(self.objectsPerAddress[sID].balance);
      self.objectsPerAddress[rID].balance = roundTezAmount(self.objectsPerAddress[rID].balance);
      if(!par.simple){
         // console.log(trans)
         let sc = self.objectsPerAddress[rID];
         sc.applyTransaction(trans);
      }
      self.objectsPerAddress[sID].transactionNum++;
      self.bakerBalance += (fee + gas*gasCostPerUnit);
      saveAnswer(self);
   };

   function createNextBlock() {
      // console.log("createNextBlock");
      let blockTrans = [];
      if(mempoolMode != "none"){
         if(self.mempool.length == 0 && !allowEmptyBlocks){
            displayError(taskStrings.mempoolIsEmpty);
            return
         }
         let sortedTrans = self.mempool.toSorted(sortFct);
         // console.log(block,self.mempool)
         let totGas = 0;
         let deleted = [];
         let nbInvalid = 0;
         for(let iT = 0; iT < sortedTrans.length; iT++){
            let id = sortedTrans[iT];
            let trans = self.transactions[id];
            if(!isValid(trans)){
               nbInvalid++;
               deleted.push(id);
               continue;
            }
            if(trans.subTransactions){
               let del = false;
               for(let sub of trans.subTransactions){
                  if(!isValid(sub)){
                     nbInvalid++;
                     deleted.push(id);
                     del = true;
                     break;        
                  }
               }
               if(del){
                  continue;
               }
            }
            if(totGas + trans.gas > blockSize){
               continue;
            }
            blockTrans.push(id);
            deleted.push(id);
            applyTransaction(id);
         }
         if(nbInvalid > 0){
            console.log(nbInvalid+" transaction(s) invalide(s) effacée(s)");
         }
         for(let id of deleted){
            for(let row = 0; row < self.mempool.length; row++){
               if(self.mempool[row] == id){
                  self.mempool.splice(row,1);
                  break;
               }
            }
         }
         updateMemPool();
      }
      let block = {
         id: self.blockIndex,
         timestamp: self.getCurrentTime(),
         transactions: blockTrans
      };
      self.blockIndex++;
      self.blocks.push(block);
      updateTransactionTable();
      updateAccountsTable();
      // console.log(newBlock,self.mempool)

      function sortFct(i1,i2) {
         let t1 = self.transactions[i1];
         let t2 = self.transactions[i2];
         let cost1 = t1.gas*gasCostPerUnit + t1.storage*storageCostPerUnit;
         let cost2 = t2.gas*gasCostPerUnit + t2.storage*storageCostPerUnit;
         let ratio1 = t1.bakerFee/cost1;
         let ratio2 = t2.bakerFee/cost2;
         return ratio2 > ratio1
      };

      function isValid(trans) {
         let sID = trans.sender;
         let acc = self.objectsPerAddress[sID];
         if(!trans.params.simple){
            let sc = self.objectsPerAddress[trans.recipient];
            let scError = sc[trans.params.findTransactionError](trans);
            // console.log(scError)
            if(!scError)
               return true
            return false
         }
         if(counterEnabled && !trans.sub && acc.transactionNum != trans.counter - 1)
            return false
         if(trans.params.simple && acc.balance < trans.amount)
            return false
         
         return true
      };
   };

   function createNextXBlocks() {
      displayError("");
      let view = $("<div id=simView></div>");
      let back = $("<div id=simBack></div>");
      let nbBlocks = 1;
      let dis = displayNextXBlocks();
      view.append(back,dis);
      $("#mainPage").append(view);

      updateTimeShift();
      initFormHandlers();

      function displayNextXBlocks() {
         let cont = $("<div class='view form'></div>");
         let header = $("<div id=header>"+taskStrings.nextXBlocks+"<img src="+self.crossSrc+" class=icon /></div>");
         let content = $("<div id=content></div>");
         let html = "<p class=field><span class=label>"+taskStrings.nbBlocks+"</span> <input type=number id=nbBlocks class=input value="+nbBlocks+" min=1 /></p>";
         html += "<p class=field><span class=label>"+taskStrings.timeShift+"</span> <span id=timeShift ></span></p>";
         html += "<div id=buttons ><button id=validate>"+taskStrings.validate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
         content.append(html);
         cont.append(header,content);
         return cont
      }

      function initFormHandlers() {
         $("#nbBlocks").on("change",function() {
            displayError("");
            let val = this.value;
            nbBlocks = val;
            updateTimeShift();
         });
         $("#nbBlocks").on("keyup",function() {
            displayError("");
            let val = this.value;
            if(val == ""){
               val = 1;
               $("#nbBlocks").val(1);
            }
            nbBlocks = val;
            updateTimeShift();
         });
         
         $("#validate").on("click",validate);
         $("#validate").css("cursor","pointer");

         $("#cancel").on("click",deleteView());
         $("#cancel").css("cursor","pointer");
      };

      function updateTimeShift() {
         let t = Date.now() + nbBlocks*delayBetweenBlocks*1000;
         let date = new Date(t);
         let str = date.toLocaleString();
         $("#timeShift").text(str);
      }; 

      function validate() {
         for(let ib = 0; ib < nbBlocks; ib++){
            createNextBlock();
            self.timeShift += delayBetweenBlocks;
            checkTimeDependencies();
         }
         deleteView()();
      };
   };

   function checkTimeDependencies() {
      let t = self.getCurrentTime();
      for(let dep of timeDependencies){
         if(dep.done){
            continue;
         }
         if(t > dep.time){
            dep.action();
            dep.done = true;
         }
      }
   };

   function updateAccountsTable() {
      let colKeys = ["alias","address", "balance"];

      for(let row = 1; row <= accounts.length; row++){
         for(let col = 0; col < colKeys.length; col++){
            let entry = "";
            let k = colKeys[col];
            if(self.nbCreatedAccounts >= row){
               entry = accounts[row - 1][k];
            }
            if(k == "balance")
               entry += " tez";
            $("#accounts_table .row_"+row+" .col_"+col).html(entry);
         }
      }
   };

   function updateMemPool() {
      // console.log("updateMemPool",self.mempool)
      let colKeys = transactionTableColKeys;

      for(let row = 1; row <= mempoolLength; row++){
         let id = self.mempool[row - 1];
         let trans = self.transactions[id];
         for(let col = 0; col < colKeys.length; col++){
            let entry = "";
            if(id != undefined){
               let key = colKeys[col];
               entry = getTransactionTableEntry(key,trans);
            }
            $("#mem_pool_table .row_"+row+" .col_"+col).html(entry);
         }
      }
   };

   function updateTransactionTable() {
      $("#transaction_table tr:not(.row_0)").remove();

      let colKeys = transactionTableColKeys;

      let row = 1;
      let html = "";
      for(let block of self.blocks){
         let date = new Date(block.timestamp);
         let time = date.toLocaleString();
         html +="<tr class=row_"+row+" ><td colspan=4 class=block_header ><span>Block "+block.id+"</span><span class=timestamp>"+time+"</span></td></tr>";
         row++;
         for(let transID of block.transactions){
            let t = self.transactions[transID];
            html += "<tr class=row_"+row+">";
            for(let col = 0; col < colKeys.length; col++){
               let key = colKeys[col];
               let entry = getTransactionTableEntry(key,t);
               html += "<td class=col_"+col+">"+entry+"</td>";
            }
            html += "</tr>";
            $("#transaction_table .row_"+row).off("click");
            $("#transaction_table .row_"+row).on("click",viewTransaction(t));
            $("#transaction_table .row_"+row).css("cursor","pointer");
            row++;
         }
      }
      if(row <= transactionTableLength){
         for(let r = row; r <= transactionTableLength; r++){
            html += "<tr class=row_"+r+">";
            for(let col = 0; col < colKeys.length; col++){
               html += "<td></td>";
            }
            html += "</tr>";
         }
      }
      $("#transaction_table").append(html);

      row = 1;
      for(let block of self.blocks){
         row++;
         for(let transID of block.transactions){
            $("#transaction_table .row_"+row).off("click");
            $("#transaction_table .row_"+row).on("click",viewTransaction(transID));
            $("#transaction_table .row_"+row).css("cursor","pointer");
            row++;
         }
      }

      let outH = $("#transaction_table_cont").height();
      let inH = $("#transaction_table").outerHeight();
      let h = inH - outH;
      $("#transaction_table_cont").scrollTop(h);

      let scroll = document.getElementById("transaction_table_cont");
      if(scroll == undefined)
         return
      let scrollBarWidth = scroll.offsetWidth - scroll.clientWidth;
      $("#transaction_table_cont_clone").css("width",(transactionTableW - scrollBarWidth)+"px");
      // console.log(scrollBarWidth)
   };

   function getTransactionTable(id,nbRows,content) {
      let table = $("<table id="+id+"></table>");
      let colKeys = transactionTableColKeys;
      // console.log(id,nbRows,content)

      for(let row = 0; row <= nbRows; row++){
         let line = $("<tr class=row_"+row+"></tr>");
         for(let col = 0; col < colKeys.length; col++){
            let entry = "", type = "td";
            if(row == 0){
               entry = taskStrings[colKeys[col]];
               type = "th";
            }else if(content){
               // let key = (col == 2) ? "recipient" : colKeys[col];
               entry = getTransactionTableEntry(colKeys[col],content[row - 1]);
            }
            line.append($("<"+type+" class='col_"+col+"'>"+entry+"</"+type+">"));
         }
         table.append(line);
      }
      return table
   }

   function getTransactionTableEntry(key,trans) {
      let entry;
      // console.log(key,trans)
      if(!trans)
         return ""
      // console.log(trans.params)
      if(key == "sender" || key == "recipient"){
         let accID = trans[key];
         let acc = self.objectsPerAddress[accID];
         // console.log(accID,acc)
         entry = (acc.tezos) ? addressEllipsis(acc.address) : acc.alias;
      }else if(key == "parameters"){
         if(!trans.params.simple){
            let sc = self.objectsPerAddress[trans.params.sc_address];
            let ep = sc.entrypoints;
            entry = $(ep[trans.params.id].text).html();
         }else{
            entry = "";
         }
      }else{
         entry = trans[key];
      }
      if(key == "amount")
         entry += " tez";
      return entry
   };

   this.getCurrentTime = function() {
      return Date.now() + this.timeShift*1000
   } 

   init();
};