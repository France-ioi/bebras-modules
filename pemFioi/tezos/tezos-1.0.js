const taskStrings = {
   success: "Bravo, vous avez réussi !",
   transactions: "Transactions",
   sender: "Sender",
   recipient: "Recipient",
   amount: "Amount",
   destination: "Destination",
   parameters: "Parameters",
   mempool: "Mempool",
   accounts: "Accounts",
   account: "Account",
   address: "Address",
   balance: "Balance",
   newAccount: "New Account",
   newTransaction: "New Transaction",
   nextBlock: "Next Block",
   alias: "Alias",
   publicKey: "Public key",
   privateKey: "Private key",
   transactionNum: "Transaction counter",
   counter: "Counter",
   signature: "Signature",
   sign: "Sign",
   signed: "Signed !",
   bakerFee: "Baker fee",
   simulate: "Simulate",
   validate: "Validate",
   cancel: "Cancel",
   copy: "Copy",
   transactionDetails: "Transaction details",
   gas: "Gas",
   storage: "Storage",
   storageChange: "Storage change",
   contract: "Contract",
   entrypoints: "Entrypoints",
   entrypoint: "Entrypoint",
   views: "Views",
   smartContracts: "Smart contracts",
   nbOfTokens: "Number of tokens",
   minTokensExpected: "Minimum number of tokens expected",
   minTezExpected: "Minimum amount of tez expected",
   byte: function(nb) {
      let pl = (nb > 1) ? "s" : "";
      return "byte"+pl
   },
   subTransactions: "Sub-transactions",

   maxAccounts: "Vous ne pouvez pas créer d'autre compte.",
   noAccount: "Vous ne possédez aucun compte.",
   noSender: "Vous devez spécifier le compte émetteur",
   noRecipient: "Vous devez spécifier le compte destinataire",
   recipientIsSender: "Les comptes émetteur et destinataire sont les mêmes",
   wrongAmount: "Le montant doit être un nombre positif.",
   amountWrongFormat: "Le format du montant de tez est incorrect.",
   amountUnwanted: "Le transfert de tez est rejeté par cet entrypoint.",
   wrongNbOfTokens: "Le nombre de jetons doit être un nombre entier positif.",
   amountTooHigh: function(ba) {
      return "Le solde du compte émetteur est insuffisant. (Solde actuel = "+Number.parseFloat(ba)+" tez)"
   },
   nbOfTokensTooHigh: function(ba) {
      return "Le solde du compte émetteur est insuffisant. (Solde actuel = "+Number.parseFloat(ba)+" tokens)"
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
   mempoolIsEmpty: "Il n'y a aucune transaction dans le mempool."
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
      // console.log(this)
      displayError("");

      let view = $("<div id=view></div>");
      let back = $("<div id=back></div>");

      let acc = display(this);
      view.append(back,acc);
      $("#mainPage").append(view);

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
         html1 += "<p class=line><span class=label>"+taskStrings.address+":</span> "+self.address+"</p>";
         html1 += "<p class=line><span class=label>"+taskStrings.balance+":</span> "+self.balance+" tez</p>";
         html1 += "<p class=line> </p>";
         html1 += "<h4 class=line>"+taskStrings.storage+":</h4> ";
         for(let key in self.storage){
            let type = self.storage[key].type;
            if(type != "big-map"){
               html1 += "<p class='storage_line line'><span class=label>"+key+":</span> "+self.storage[key].val+"</p>";
            }else{
               let obj = self.storage[key];
               html1 += "<p class=storage_line><span class=label>"+key+":</span> </p>";
               for(let k in obj) {
                  if(k == "type"){
                     continue;
                  }
                  html1 += "<p class='big_map_line line'><span class=label>"+k+":</span>"+obj[k].val+"</p>";
               }
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
         address: "ABCD1234",
         balance: 0,
         storage: {
            balances: {
               type: "big-map"
            }
         },
         entrypoints: {
            "transfer_tokens": { 
               text: "<span class=ep_name>transfer_tokens(source,destination,amount):</span>"+
                  "<ul><li>check if balances[source] >= amount</li>"+
                  "<li>if !balances[destination], set balances[destination] = 0</li>"+
                  "<li>balances[source] -= amount</li>"+
                  "<li>balances[destination] += amount</li></ul>",
               clickable: true,
               fct: "transfer"
            },
            "change_user_balance": {
               text: "<span class=ep_name>change_user_balance</span>",
               clickable: false,
               fct: "sub_changeUserBalance"
            }
         }
      });
   }

   transfer() {
      let params = { 
         id: "transfer_tokens",
         sc_address: this.address,
         fields: ["recipient_ep","nbOfTokens"],
         gas: "computeTransferGas",
         storage: "computeTransferStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransferValid"
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      if(id == "transfer_tokens"){
         let sID = trans.sender;
         let rID = trans.recipient_ep;
         this.changeUserBalance(sID,trans.nbOfTokens,-1);
         this.changeUserBalance(rID,trans.nbOfTokens,1);
      }else if(id == "change_user_balance"){
         let rID = trans.recipient_ep;
         this.changeUserBalance(rID,trans.nbOfTokens,1);
      }
   }

   computeTransferGas() {
      return Math.round(this.tezos.defaultGasPerTransaction*1.5)
   }

   computeTransferStorage(trans) {
      let tr = trans || this.tezos.newTransaction;
      let blob = new Blob([tr.sender+""+tr.recipient_ep+""+tr.nbOfTokens]);
      return blob.size
   }

   getStorageChange(trans) {
      let text = "";
      let tr = trans || this.tezos.newTransaction;
      let sAcc = this.tezos.objectsPerAddress[tr.sender];
      let rAcc = this.tezos.objectsPerAddress[tr.recipient_ep];
      if(!this.storage.balances[rAcc.alias]){
         text += "- create "+rAcc.alias+" entry";
         text += "<br/>";
         text += "- set "+rAcc.alias+" balance to 0";
         text += "<br/>";
      }
      if(!sAcc.tezos){
         let sBal = this.storage.balances[sAcc.alias].val;
         text += "- change "+sAcc.alias+" balance from "+sBal+" to "+(sBal - tr.nbOfTokens);
         text += "<br/>";
      }
      if(!rAcc.tezos){
         let rBal = (this.storage.balances[rAcc.alias]) ? this.storage.balances[rAcc.alias].val : 0;
         text += "- change "+rAcc.alias+" balance from "+rBal+" to "+(rBal + tr.nbOfTokens);
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

   sub_changeUserBalance(thiss,source,recipient,nbOfTokens) {
      // console.log(source,recipient,nbOfTokens)
      let params = { 
         id: "change_user_balance",
         sc_address: thiss.address,
         fields: ["recipient_ep","nbOfTokens"],
         // gas: "computeTransferGas",
         // storage: "computeTransferStorage",
         // storageChange: "getStorageChange",
         isTransactionValid: "isChangeValid"
      };
      let trans = {
         sender: source, recipient: thiss.address,
         amount: 0, sub: true,
         entrypoint: "change_user_balance",
         recipient_ep: recipient,
         nbOfTokens,
         gas: thiss.computeTransferGas(),
         storage: 0,
         storageChange: "",
         params
      }
      // console.log(thiss.isChangeValid(trans),trans)
      if(thiss.isChangeValid(trans)){
         trans.storage = thiss.computeTransferStorage(trans);
         trans.storageChange = thiss.getStorageChange(trans);
      }

      return trans
   }

   isTransferValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      // console.log(dat.nbOfTokens)
      if(isNaN(dat.amount)){
         displayError(taskStrings.amountWrongFormat);
         $("#amount").addClass("highlight");
         return false
      }
      if(dat.amount){
         displayError(taskStrings.amountUnwanted);
         $("#amount").addClass("highlight");
         return false
      }
      if(!dat.recipient_ep){
         if(trans === undefined){
            displayError(taskStrings.noRecipient);
            $("#select_recipient").addClass("highlight");
         }
         return false
      }
      if(dat.recipient_ep == dat.sender){
         if(trans === undefined){
            displayError(taskStrings.recipientIsSender);
            $("#select_sender").addClass("highlight");
            $("#select_recipient_ep").addClass("highlight");
         }
         return false
      }
      if(!dat.nbOfTokens || isNaN(dat.nbOfTokens) || dat.nbOfTokens < 0 || 
            !Number.isInteger(dat.nbOfTokens)){
         if(trans === undefined){
            displayError(taskStrings.wrongNbOfTokens);
            $("#nbOfTokens").addClass("highlight");
         }
         return false
      }
      let acc = this.tezos.objectsPerAddress[dat.sender];
      let senderBalance = (this.storage.balances[acc.alias]) ? this.storage.balances[acc.alias].val : 0;
      // console.log(senderBalance,dat.nbOfTokens);
      if(senderBalance < dat.nbOfTokens){
         if(trans === undefined){
            displayError(taskStrings.nbOfTokensTooHigh(senderBalance));
            $("#nbOfTokens").addClass("highlight");
         }
         return false
      }
      return true
   }

   isChangeValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      // console.log(dat.nbOfTokens)
      if(!dat.recipient_ep){
         return false
      }
      if(dat.recipient_ep == dat.sender){
         return false
      }
      if(!dat.nbOfTokens || isNaN(dat.nbOfTokens) ||  
            !Number.isInteger(dat.nbOfTokens)){
         return false
      }
      return true
   }
};

class LiquidityPool extends SmartContract {
   constructor(params) {
      params.entrypoints = {
         "buy_tokens": { 
            text: "<span class=ep_name>buy_tokens(amount,min_tokens_bought):</span><ul>"+
               "<li>compute tokens_obtained</li>"+
               "<li>-if tokens_obtained > min_tokens_bought, transfer tokens</li>"+
               "<li>-update storage</li></ul>",
            clickable: true,
            fct: "buyTokens" 
         }, 
         "sell_tokens": {
            text: "<span class=ep_name>sell_tokens(nb_tokens,min_tez):</span><ul>"+
               "<li>-compute tez_obtained</li>"+
               "<li>-if tez_obtained > min_tez, transfer tokens</li>"+
               "<li>-update storage</li></ul>",
            clickable: true,
            fct: "sellTokens"
         } 
      };
         
      params.views = {
         "get_token_price" : { 
            text: "<span class=ep_name>get_token_price():</span><ul>"+
               "<li>-returns what we would get if we sold one token</li></ul>",
            fct: "viewTokenPrice"
         }
      };       
      params.storage = {
         // ledgerAddress: { type: "address" },
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
         subTransactionsData: [{ 
            recipient: this.tezos.ledger.address, 
            id: "change_user_balance"
         }]
      };
      this.tezos.newTransaction = undefined;
      this.tezos.createNewTransaction(params)();
   }

   sellTokens() {
      let params = { 
         id: "sell_tokens",
         sc_address: this.address,
         fields: ["nbOfTokens","minTezExpected"],
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         subTransactionsData: [{ 
            recipient: this.tezos.ledger.address, 
            id: "change_user_balance"
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
         this.tezos.ledger.applyTransaction(trans.subTransactions[0]);
      }else if(id == "sell_tokens"){
         let nb = trans.nbOfTokens;
         let amo = this.getAmountOfTezBought(nb);
         // console.log(nb,amo)
         sAcc.balance += amo;
         this.balance -= amo;
         this.storage.tokens_owned.val += nb;
         this.tezos.ledger.applyTransaction(trans.subTransactions[0]);
      }
   }

   computeTransactionGas() {
      let gas = Math.round(this.tezos.defaultGasPerTransaction*1.5);
      let tr = this.tezos.newTransaction;
      let subID = "change_user_balance";
      let sub = this.getSubtransaction(subID,tr.params.id);
      gas += sub.gas;
      return gas
   }

   computeTransactionStorage() {
      let tr = this.tezos.newTransaction;
      let nb = this.getNbOfTokensBought(tr.amount);
      let blob = new Blob([tr.sender+""+nb]);
      let sto = blob.size;

      let subID = "change_user_balance";
      let sub = this.getSubtransaction(subID,tr.params.id);

      tr.subTransactions = [sub];

      sto += sub.storage;
      // console.log("sub storage",sub.storage)
      return sto
   }

   getSubtransaction(subID,mainID) {
      let tr = this.tezos.newTransaction;
      let sc = this.tezos.ledger;
      let subFctID = sc.entrypoints[subID].fct;
      let subFct = sc[subFctID];
      let nb;
      if(mainID == "buy_tokens"){
         nb = this.getNbOfTokensBought(tr.amount);
      }else if(mainID == "sell_tokens"){
         nb = -tr.nbOfTokens;
      }
      // console.log(mainID,nb,tr)
      let sub = subFct(sc,this.address,tr.sender,nb);
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
         let tok2 = tok1 + tr.nbOfTokens;
         text += "- change "+this.alias+" nb of tokens from "+tok1+" to "+tok2;
      }
      return text
   }

   isTransactionValid(trans) {
      // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      // console.log(dat)
      if(dat.params.id == "buy_tokens"){
         if(!dat.amount || isNaN(dat.amount) || dat.amount < 0) {
            if(trans === undefined){
               displayError(taskStrings.wrongAmount);
               $("#amount").addClass("highlight");
            }
            return false
         }
         let acc = this.tezos.objectsPerAddress[dat.sender];
         if(acc.balance < dat.amount){
            displayError(taskStrings.amountTooHigh(acc.balance));
            $("#amount").addClass("highlight");
            return false
         }
         if(isNaN(dat.minTokensExpected)){
            displayError(taskStrings.minTokensExpectedNaN);
            $("#minTokensExpected").addClass("highlight");
            return false
         }
         let nbTok = this.getNbOfTokensBought(dat.amount);
         // console.log(nbTok,dat.minTokensExpected)
         if(nbTok < dat.minTokensExpected){
            displayError(taskStrings.minTokensExpectedTooHigh);
            $("#minTokensExpected").addClass("highlight");
            return false
         }
         if(nbTok > this.storage.tokens_owned.val){
            displayError(taskStrings.nbOfTokensBoughtTooHigh);
            $("#amount").addClass("highlight");
            return false
         }
      }else
      if(dat.params.id == "sell_tokens"){
         if(isNaN(dat.amount)){
            displayError(taskStrings.amountWrongFormat);
            $("#amount").addClass("highlight");
            return false
         }
         if(dat.amount){
            displayError(taskStrings.amountUnwanted);
            $("#amount").addClass("highlight");
            return false
         }
         if(!dat.nbOfTokens || isNaN(dat.nbOfTokens) || dat.nbOfTokens < 0) {
            displayError(taskStrings.wrongNbOfTokens);
            $("#nbOfTokens").addClass("highlight");
            return false
         }
         if(isNaN(dat.minTezExpected)){
            displayError(taskStrings.minTezExpectedNaN);
            $("#minTezExpected").addClass("highlight");
            return false
         }
         // let acc = this.tezos.objectsPerAddress[dat.sender];
         let bal = this.tezos.ledger.getUserBalance(dat.sender);
         if(bal < dat.nbOfTokens){
            displayError(taskStrings.nbOfTokensTooHigh(bal));
            $("#nbOfTokens").addClass("highlight");
            return false
         }
         let amo = this.getAmountOfTezBought(dat.nbOfTokens);
         // console.log(nbTok,dat.minTokensExpected)
         if(amo < dat.minTezExpected){
            displayError(taskStrings.minTezExpectedTooHigh);
            $("#minTezExpected").addClass("highlight");
            return false
         }
         if(amo > this.balance){
            displayError(taskStrings.nbOfTezBoughtTooHigh);
            $("#nbOfTokens").addClass("highlight");
            return false
         }
      }
      
      return true
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

function Tezos(params) {
   let { accounts, transactions, mempool, nbCreatedAccounts, counterEnabled, ledgerEnabled, smartContracts, liquidityPools, pageW, pageH } = params;
   let self = this;
   
   const marginX = 20;
   const marginY = 20;

   const transactionTableW = pageW*0.5;
   const accountsTableW = pageW*0.4;

   const maxAccounts = accounts.length;
   const transactionTableLength = 7;
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
   this.transactions = transactions || [];
   this.mempool = mempool || [];
   this.blocks = [];
   this.blockIndex = 1;
   this.signatureIndex = (transactions.length > 0) ? transactions[transactions.length - 1].signature : Math.pow(10,20).toString(16);
   this.bakerBalance = 0;
   this.ledger;
   this.smartContracts = [];
   this.defaultGasPerTransaction = 10;
   this.objectsPerAddress = {};
   
   let nbSmartContracts;
   let fields;


   function init() {
      initMainPage();
      initObjectsPerAddress();
      initHandlers();
      updateMemPool();

      let transH = (transactionTableLength + 1)*30;
      let mempoolH = (mempoolLength + 1)*30;
      let leftColH = marginY + headerH + transH + marginY + mempoolH + marginY;
      let accountH = (maxAccounts + 1)*30;
      let smartContractsH = (self.smartContracts.length + 1)*30;
      let rightColH = marginY + headerH + accountH + marginY + headerH + smartContractsH + marginY + 3*($("button").height() + marginY);
      pageH = Math.max(leftColH,rightColH);
      // console.log(pageH)
      // $("#mainPage").css({
         // width: pageW+"px",
         // height: pageH+"px",
      // })

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
      $("#taskCont").append(main);
   };

   function initTransactionTable() {
      let transDiv = $("<div id='transactions'></div>");
      transDiv.append("<h3>"+taskStrings.transactions+"</h3>");

      let cont = $("<div id=transaction_table_cont></div>");
      let table = getTransactionTable("transaction_table",transactionTableLength);
      let colKeys = transactionTableColKeys;

      transDiv.css("width",transactionTableW+"px");

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
      cont.append(table);
      transDiv.append(cont,memPoolTable);
      cont.css("height",transactionTableH+"px");

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
            if(row == 0){
               entry = taskStrings[colKeys[col]];
               type = "th";
            }else if(nbCreatedAccounts >= row){
               entry = accounts[row - 1][colKeys[col]];
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
      }
      if(liquidityPools && liquidityPools.length > 0){
         for(let lpData of liquidityPools){
            lpData.tezos = self;
            let lp = new LiquidityPool(lpData);
            lp.setTokenBalance(lpData.token_balance);
            // if(self.ledger)
            //    lp.storage.ledgerAddress.val = self.ledger.address;
            // console.log(lp)
            self.smartContracts.push(lp);
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
            if(row == 0){
               entry = taskStrings[colKeys[col]];
               type = "th";
            }else{
               entry = self.smartContracts[row - 1][colKeys[col]];
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
      let ids = ["newAccount", "newTransaction", "nextBlock"];
      for(let iB = 0; iB < ids.length; iB++){
         buttons.append("<button type=button id="+ids[iB]+">"+taskStrings[ids[iB]]+"</button>");
      } 
      return buttons
   };

   function initObjectsPerAddress() {
      for(let acc of self.accounts){
         self.objectsPerAddress[acc.address] = acc;
      }
      for(let sc of self.smartContracts){
         self.objectsPerAddress[sc.address] = sc;
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
               html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key];
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
         if(type == 1){
            viewId = "simView";
            backId = "simBack";
            dat = self.newTransaction;
         }else if(type == 2){
            viewId = "subView";
            backId = "subBack";
            dat = trans;
         }
         let view = $("<div id="+viewId+"></div>");
         let back = $("<div id="+backId+"></div>");

         // let dat = (sim) ? self.newTransaction : self.transactions[id];
         let params = dat.params;
         let tra = displayTransaction();
         view.append(back,tra);
         $("#mainPage").append(view);

         if(!type){
            $("#view #header, #back").on("click",deleteView());
            $("#view #header, #back").css("cursor","pointer");

            $("#view #copy").css("cursor","pointer");
            $("#view #copy").on("click",function() {
               deleteView()();
               self.newTransaction = Beav.Object.clone(self.transactions[id]);
               self.newTransaction.signature = undefined;
               self.createNewTransaction()();
            });   
         }
         if(type == 1){
            $("#simView #cancel").on("click",deleteView(type));
            $("#simView #cancel").css("cursor","pointer");
            $("#simView #validate").on("click",function() {
               createTransaction();
               deleteView()();
            });
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

         function displayTransaction() {
            let cont = $("<div id=view_transaction class=view></div>");
            let header = $("<div id=header>"+taskStrings.transactionDetails+"<img src="+self.crossSrc+" class=icon /></div>");
            let content = $("<div id=content></div>");

            let transactionKeys = ["sender","recipient","amount","gas","storage"];
            if(!dat.sub)
               transactionKeys.push("counter","signature","bakerFee");
            if(!params.simple){
               transactionKeys.push("id");
               for(let field of params.fields){
                  if(!transactionKeys.includes[field])
                     transactionKeys.push(field);
               }
               if(dat.subTransactions)
                  transactionKeys.push("subTransactions");
               transactionKeys.push("storageChange");

            }
            // console.log(dat,transactionKeys)
            let html = "";
            for(let key of transactionKeys){
               switch(key){
               case "sender":
               case "recipient":
                  let obj = self.objectsPerAddress[dat[key]];
                  let str = (obj.tezos) ? obj.address : obj.alias;
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+str+"</p>";
                  break;
               case "amount":
               case "bakerFee":
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" tez</p>";
                  break;
               case "gas":
                  let gCost = roundTezAmount(dat[key]*gasCostPerUnit);
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
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat.signature+"</p>";
                  break;
               case "id":
                  html += "<p class=line><span class=label>"+taskStrings.entrypoint+":</span> "+params.id+"</p>";
                  html += "<p class=line><span class=label>"+taskStrings.parameters+":</span></p>";
                  break;
               case "recipient_ep":
                  html += "<p class=line><span class='label parameter'>"+taskStrings.recipient+":</span> "+self.objectsPerAddress[dat[key]].alias+"</p>";
                  break;
               // case "amount_ep":
               //    html += "<p class=line><span class='label parameter'>"+taskStrings.amount+":</span> "+dat[key]+" tez</p>";
               //    break;
               case "nbOfTokens":
               case "minTokensExpected":
               case "minTezExpected":
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
                  html += "<p class=line><span class='label'>"+taskStrings.storageChange+":</span></p>";
                  html += "<p class=line id=storage_change>"+dat.storageChange+"</p>";
                  break;
               }
            }

            if(type == 1){
               html += "<div id=buttons ><button id=validate>"+taskStrings.validate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
            }else if(!type){
               html += "<button id=copy>"+taskStrings.copy+"</button>";
            }
            content.append(html);
            cont.append(header,content);
            return cont
         }
      }
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

   this.createNewTransaction = function(params) {
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
         if(self.newTransaction == undefined)
            self.newTransaction = { amount: 0, counter: 1 };
         if(!params)
            params = self.newTransaction.params || { simple: true };
         fields = ["sender","recipient","amount","counter","signature","bakerFee"]
         if(!params.simple){
            fields.push("entrypoint");
            fields = fields.concat(params.fields);
         }
         self.newTransaction.params = Beav.Object.clone(params);
         // console.log(params)

         let view = $("<div id=view></div>");
         let back = $("<div id=back></div>");

         


         let form = displayTransactionForm();
         view.append(back,form);
         $("#mainPage").append(view);

         initFormHandlers();

         function displayTransactionForm() {
            // console.log(params);
            let headerStr = taskStrings.newTransaction;
            let cont = $("<div id=transaction_form class='view form'></div>");
            let header = $("<div id=header>"+headerStr+"</div>");
            let content = $("<div id=content></div>");

            let html = "";

            for(let field of fields){
               if(!counterEnabled && field == "counter")
                  continue;
               let name = taskStrings[field];
               if(field == "recipient_ep"){
                  name = taskStrings.recipient;
               }
               // if(field == "amount_ep"){
               //    name = taskStrings.amount;
               // }
               html += "<p class=field>"+name;
               switch(field){
               case "sender":
               case "recipient":
               case "recipient_ep":
                  if(self.newTransaction[field] == undefined){
                     self.newTransaction[field] = "";
                  }
                  if(!params.simple && field == "recipient"){
                     self.newTransaction[field] = params.sc_address;
                     html += "<span class=address>"+self.newTransaction[field]+"</span>";
                     break;
                  }
                  html += "<select id=select_"+field+" class=input ><option value=''>--</option>";
                  for(let iA = 0; iA < self.nbCreatedAccounts; iA++){
                     let dat = self.accounts[iA];
                     // console.log(dat)
                     if(field == "sender" && dat.owner > 0){
                        continue;
                     }
                     html += "<option value="+dat.address+" "+((self.newTransaction[field] == dat.address) ? "selected" : "")+">"+dat.alias+"</option>";
                  }
                  html += "</select>";
                  break;
               case "amount":
               // case "amount_ep":
               case "nbOfTokens":
               case "minTokensExpected":
               case "minTezExpected":
                  // if(!params.simple && field =="amount"){
                  //    self.newTransaction[field] = 0;
                  //    html += "<span class=amount>"+self.newTransaction[field]+"</span>";
                  //    break;  
                  // }
                  let val = self.newTransaction[field] || 0;
                  self.newTransaction[field] = val;
                  html += "<input type=text id="+field+" class=input value="+val+" />";
                  break;
               case "counter":
                  html += "<input type=number min=1 id=counter class=input  value="+self.newTransaction[field]+" />";
                  break;
               case "signature":
                  html += "<span id=signature>--</span>";
                  break;
               case "bakerFee":
                  let fee, gas;
                  if(params.simple){
                     gas = self.defaultGasPerTransaction;
                  }else{
                     let sc = self.objectsPerAddress[params.sc_address];
                     gas = sc[params.gas]();  
                  }
                  self.newTransaction.gas = gas;
                  fee = roundTezAmount(gas*gasCostPerUnit + feeConstant);
                  self.newTransaction.bakerFee = fee;
                  html += "<span id=fee>"+fee+" tez</span>";
                  break;
               case "entrypoint":
                  html += "<span>"+params.id+"</span>";
                  break;

               }
               html += "</p>";
               if(field == "signature")
                  html += "<button id=sign>"+taskStrings.sign+"</button>";
            }
            html += "<div id=buttons ><button id=simulate>"+taskStrings.simulate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
            content.append(html);
            cont.append(header,content);
            return cont
         }
      };

      function initFormHandlers() {
         $("#select_sender").on("change",function() {
            displayError("");
            $(".form select").removeClass("highlight");
            self.newTransaction.sender = this.value;
         });
         $("#select_recipient").on("change",function() {
            displayError("");
            $(".form select").removeClass("highlight");
            self.newTransaction.recipient = this.value;
         });
         $("#select_recipient_ep").on("change",function() {
            displayError("");
            $(".form select").removeClass("highlight");
            self.newTransaction.recipient_ep = this.value;
         });
         $("#amount").on("keyup",function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let val = roundTezAmount(this.value);
            self.newTransaction.amount = Number(val);
         });
         // $("#amount_ep").on("keyup",function() {
         //    displayError("");
         //    if(isNaN(this.value)){
         //       $(this).addClass("highlight");
         //    }else{
         //       $(this).removeClass("highlight");
         //    }
         //    let val = roundTezAmount(this.value);
         //    self.newTransaction.amount_ep = Number(val);
         // });
         $("#nbOfTokens").on("keyup",function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let val = this.value;
            self.newTransaction.nbOfTokens = Number(val);
         });
         $("#minTokensExpected").on("keyup",function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let val = this.value;
            self.newTransaction.minTokensExpected = Number(val);
         });
         $("#minTezExpected").on("keyup",function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let val = roundTezAmount(this.value);
            self.newTransaction.minTezExpected = Number(val);
         });
         $("#counter").on("change",function() {
            displayError("");
            $(this).removeClass("highlight");
            self.newTransaction.counter = this.value
         });

         $("#sign").on("click",signTransaction);
         $("#sign").css("cursor","pointer");

         $("#simulate").on("click",simulate);
         $("#simulate").css("cursor","pointer");

         $("#cancel").on("click",deleteView());
         $("#cancel").css("cursor","pointer");
      };

      function signTransaction() {
         displayError("");

         self.signatureIndex = (parseInt(self.signatureIndex,16) + 1).toString(16);
         self.newTransaction.signature = self.signatureIndex;
         $("#sign").off("click");
         $("#sign").css("cursor","auto");
         $("#sign").attr("disabled","true");
         $("#signature").text(self.signatureIndex);
      };

      function simulate() {
         // console.log(fields)
         $("#amount").val(self.newTransaction.amount);
         if(!isTransactionValid())
            return
         if(params.simple){
            self.newTransaction.storage = 0;
         }else{
            // if(self.newTransaction.amont_ep){
            //    $("#amount_ep").val(self.newTransaction.amount_ep);
            // }
            if(self.newTransaction.minTezExpected){
               $("#minTezExpected").val(self.newTransaction.minTezExpected);
            }
            let sc = self.objectsPerAddress[params.sc_address];
            self.newTransaction.storage = sc[params.storage]();
            self.newTransaction.storageChange = sc[params.storageChange]();
         }
         // console.log(params)
         viewTransaction(null,true)();
      };
      
      function isTransactionValid() {
         let dat = self.newTransaction;
         // console.log(fields)
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
         if(dat.recipient == self.newTransaction.sender){
            displayError(taskStrings.recipientIsSender);
            $("#select_sender").addClass("highlight");
            $("#select_recipient").addClass("highlight");
            return false
         } 
         if(params.simple && 
            (!dat.amount || isNaN(dat.amount) || dat.amount < 0)){
            displayError(taskStrings.wrongAmount);
            $("#amount").addClass("highlight");
            return false
         }
         if(params.simple){
            let acc = self.objectsPerAddress[dat.sender];
            // console.log(acc.balance,dat.amount,acc.balance < dat.amount);
            if(acc.balance < dat.amount){
               displayError(taskStrings.amountTooHigh(acc.balance));
               $("#amount").addClass("highlight");
               return false
            }
         }
         if(counterEnabled && dat.counter != acc.transactionNum + 1){
            displayError(taskStrings.wrongCounter(acc.transactionNum));
            $("#counter").addClass("highlight");
            return false
         }
         if(!dat.signature){
            displayError(taskStrings.signatureMissing);
            return false
         }
         if(!params.simple){
            let sc = self.objectsPerAddress[params.sc_address];
            if(!sc[params.isTransactionValid]())
               return false
         }
         return true
      };
   };

   function createTransaction() {
      let id = self.transactions.length; 
      self.transactions[id] = Beav.Object.clone(self.newTransaction);
      self.newTransaction = undefined;
      self.mempool.push(id);
      updateMemPool();
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
      if(par.simple){
         self.objectsPerAddress[sID].balance -= (amo + fee + gas*gasCostPerUnit + sto*storageCostPerUnit);
         self.objectsPerAddress[rID].balance += amo;
      }else{
         let sc = self.objectsPerAddress[rID];
         sc.applyTransaction(trans);
      }
      self.objectsPerAddress[sID].transactionNum++;
      self.bakerBalance += (fee + gas*gasCostPerUnit);
   };

   function createNextBlock() {
      // console.log("createNextBlock");
      if(self.mempool.length == 0 && !allowEmptyBlocks){
         displayError(taskStrings.mempoolIsEmpty);
         return
      }
      let sortedTrans = self.mempool.toSorted(sortFct);
      // console.log(block,self.mempool)
      let totGas = 0;
      let blockTrans = [];
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
      let block = {
         id: self.blockIndex,
         timestamp: Date.now(),
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
         if(counterEnabled && !trans.sub && acc.transactionNum != trans.counter - 1)
            return false
         if(trans.params.simple && acc.balance < trans.amount)
            return false
         if(!trans.params.simple){
            let sc = self.objectsPerAddress[trans.recipient];
            return sc[trans.params.isTransactionValid](trans)
         }
         return true
      };
   };

   function updateAccountsTable() {
      let colKeys = ["alias","address", "balance"];

      for(let row = 1; row <= accounts.length; row++){
         for(let col = 0; col < colKeys.length; col++){
            let entry = "";
            if(self.nbCreatedAccounts >= row){
               entry = accounts[row - 1][colKeys[col]];
            }
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
         let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
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
         entry = (acc.tezos) ? acc.address : acc.alias;
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
      return entry
   };

   init();
};