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
   newSubTransaction: "New SubTransaction",
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
   delay: "delay",
   deadline: "deadline",
   // none: "Aucune",

   customMode: function(alias) {
      return "Manially create sub-transactions to be performed by contrat " + alias 
   },
   quitCustomMode: "Arrêter",
   availableCredit: function(amo) {
      return "Available balance: "+amo+" tez"
   },
   customEntryPointForbidden: function(alias) {
      return "This entrypoint can't be called by contract " + alias
   },
   customActionForbidden: function(alias) {
      return "This action can't be performed by contract " + alias
   },
   customConfimation: function(sen,cus) {
      return "A transaction created by " + sen + " is calling the default() entrypoint of your contract "+cus+"."
   },
   accept: "Accept",
   refuse: "Reject",

   error: "Error",
   maxAccounts: "You can't create another account.",
   noAccount: "You don't own any account.",
   noSender: "You must specify the sender account",
   noSource: "You must specify the source account",
   noRecipient: "You must specify the destination account",
   noOperator: "You must specify an operator account",
   recipientIsSender: "The sender and destination accounts are the same",
   sourceIsDestination: "The source and destination accounts are the same",
   operatorIsSender: "The sender and operator accounts are the same",
   wrongAmount: "The amount must be a positive number.",
   wrongAdditionalFee: "The additional fee must be a positive number",
   amountWrongFormat: "The format of the tez amount is invalid.",
   amountUnwanted: "The transfer of tez is rejected by this entrypoint.",
   amountWrongValue: "The amount should be equal to the sum of the bid and deposit.",
   wrongNbOfTokens: "The number of tokens must be a positive integer.",
   wrongNumber: "The random number must be a positive integer.",
   wrongDelay: "The delay must be a positive integer.",
   wrongIdPlayer: "The format os the identifier is invalid.",
   playerUnknown: "Unkonwn identifier.",
   wrongHash: "The hash doesn't match the expected value",
   alreadyRevealed: "This player already revealed their random value",
   winnerNotRevealed: "The winner didn't reveal their random value",
   playerNotRevealed: "The player didn't reveal their random value",
   pastDeadlineCommit: "The deadline to commit has expired",
   pastDeadlineReveal: "The deadline to reveal the random value has expired",
   pastDeadlineAuction: "The deadline to bid has expired",
   beforeDeadlineReveal: "The deadline to reveal the random value has not been reached yet",
   beforeDeadlineAuction: "The deadline to bid has not been reached yet",
   senderIsNotOwner: "You are not the owner of this contract.",
   amountLowerThanTopBid: "Your bid has to be higher than the current top bid",
   amountTooHigh: function(ba) {
      return "The balance of the sender is insufficient. (Balance = "+Number.parseFloat(ba)+" tez)"
   },
   nbOfTokensTooHigh: function(ba) {
      return "The balance of the source account is insufficient. (Balance = "+Number.parseFloat(ba)+" tokens)"
   },
   errorAllowance: function(src,sen,tok) {
      return sen+" is not allowed by "+src+" to withdraw "+tok+" tokens"
   },
   wrongCounter: function(co) {
      return "The value of the counter is incorrect (current counter = "+co+")"
   },
   minTokensExpectedNaN: "The format of the minimum number of bought tokens is invalid.",   
   minTezExpectedNaN: "The format of the minumum number of tez requested is invalid.",   
   minTokensExpectedTooHigh: "The number of tokens obtained for this amount of tez is lower than the minimum number of tokens requested.",
   minTezExpectedTooHigh: "The number of tez obtained for this number of tokens is lower than the minimum amount of tez requested.",   
   nbOfTokensBoughtTooHigh: "The number of bought tokens is higher than the available tokens in the liquidity pool.",   
   nbOfTezBoughtTooHigh: "The amount of tez obtained for this number of tokens is greater than the balance of the liquidity pool.",
   signatureMissing: "The transaction was not signed.",
   mempoolIsEmpty: "There is no transaction in the mempool.",
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
      let str = (cur == tar) ? "equal" : "lower than";
      return "You didn't earn any tez. Your balance of "+cur+" tez is "+str+" your initial balance of "+tar+" tez."
   },
   errorOwner: "You are not the owner of the auction contract",
   cantSign: "You can't sign this transaction, as the sender account doesn't belong to you."
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
   // let b = base || 32;
   var hash = 0,
    i, chr;
   if (this.length === 0) return hash;
   for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
   }
   return hash
   // console.log(b)
   // return (hash*hash).toString(32);
};

class SmartContract {
   constructor(params) {
      let { alias, address, balance, storage, entrypoints, tezos, views } = params;
      this.alias = alias;
      this.address = address;
      this.balance = balance || 0;
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

      // $("#view_contract #content").css("max-height",$("#mainPage").height()+"px");      
      $("#view_contract #content").css("max-height",(displayHelper.taskH - 68)+"px");      

      $("#view_contract #header").on("click",deleteView());
      $("#view_contract #header").css("cursor","pointer");

      for(let key in this.entrypoints){
         let ep = this.entrypoints[key];
         if(!ep.clickable)
            continue;
         $("#view_contract #"+key).on("click",clickEntrypoint(key,this));
         $("#view_contract #"+key).css("cursor","pointer");
      }
      for(let key in this.views){
         $("#view_contract #"+key).on("click",clickView(key,this));
         $("#view_contract #"+key).css("cursor","pointer");
      }

      function display(self) {
         let cont = $("<div id=view_contract class=view></div>");
         let header = $("<div id=header>"+taskStrings.contract+": "+self.alias+"<div class=icon ><i class='fas fa-times'></i></div></div></div>");
         let content = $("<div id=content></div>");
         let cont1 = $("<div id=content1></div>");
         let cont2 = $("<div id=content2></div>");

         let html1 = "";
         html1 += "<p class=line><span class=label>"+taskStrings.address+"</span> "+addressEllipsis(self.address)+"</p>";
         html1 += "<p class=line><span class=label>"+taskStrings.balance+"</span> "+self.balance+" tez</p>";
         html1 += "<h4 class=line>"+taskStrings.storage+"</h4> ";
         for(let key in self.storage){
            let type = self.storage[key].type;
            if(type != "big-map"){
               // html1 += "<p class='storage_line line'><span class=label>"+key+":</span> "+self.storage[key].val+"</p>";
               html1 += "<p class='storage_line line'>"+getStorageLine(type,key,self.storage[key].val,0)+"</p>";
            }else{
               html1 += getBigMapHTML(key,self.storage,0);
            }
         }

         cont1.append(html1);

         let html2 = "";
         html2 += "<h4 class=line >"+taskStrings.entrypoints+"</h4> ";
         for(let key in self.entrypoints){
            let ep = self.entrypoints[key];
            let cla = "text entrypoint"
            if(ep.clickable)
               cla += " clickable";
            html2 += "<div class='"+cla+"' id="+key+" >"+ep.text+"</div>";
         }
         if(self.views){
            html2 += "<h4 class=line >"+taskStrings.views+"</h4> ";
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
            let html = "<p class='storage_line level_"+level+"'><span class=label>"+key+"</span> </p>";
            for(let k in obj) {
               if(k == "type"){
                  continue;
               }
               if(obj[k].type == "big-map"){
                  html += getBigMapHTML(k,obj,level + 1);
               }else{
                  // html += "<p class='storage_line level_"+(level + 1)+"'><span class=label>"+k+":</span> "+obj[k].val+"</p>";
                  html += "<p class='storage_line level_"+(level + 1)+"'>"+getStorageLine(obj[k].type,k,obj[k].val,level + 1)+"</p>";
               }
            }
            return html
         }

         function getStorageLine(type,key,val,level) {
            // console.log(type,key,val,level)
            if(val === undefined)
               return ""
            let str = val;
            if(type == "timestamp"){
               let date = new Date(val);
               str = date.toLocaleString();
            }else if(type == "address" && val){
               let alias = self.tezos.objectsPerAddress[val].alias;
               str = addressEllipsis(val,7,alias);
            }else if(type == "bytes"){
               str = addressEllipsis(val);
            }else if(type == "tez"){
               str += " tez";
            }
            return "<span class=label>"+key+((level == 0) ? "" : ":")+"</span> "+str
         };
      }

      function clickEntrypoint(id,self) {
         return function() {
            if(self.entryPointCondition){
               let err = self.entryPointCondition(id);
               if(err){
                  displayError(err);
                  return
               }
            }
            let params = self.getEntryPointParams(id);

            self.tezos.newTransaction = undefined;
            self.tezos.createNewTransaction(params)();
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
            html += "<div id=header>"+v.header+"<div class=icon ><i class='fas fa-times'></i></div></div>";
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

   getEntryPointParams(id) {
      let params = {
         id,
         sc_address: this.address,
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      switch(id){
      case "transfer_tokens":
         params.fields = ["source","destination_ep","nbOfTokens"];
         break;
      case "allow":
         params.fields = ["operator","nbOfTokens"];
         break;
      }
      return params
   }

   createTransaction(dat,sub) {
      // console.log(dat,sub)
      let id = dat.id;
      let trans, params = this.getEntryPointParams(id);
      if(id == "transfer_tokens"){
         trans = {
            sender: dat.sender, 
            recipient: this.address,
            amount: 0, sub,
            entrypoint: "transfer_tokens",
            source: dat.source,
            destination_ep: dat.destination,
            nbOfTokens: dat.nbTokens,
            gas: this.computeTransactionGas(),
            storage: 0,
            storageChange: "",
            params
         };
      }
      if(sub){
         let error = this.findTransactionError(trans);
         if(!error){
            trans.storage = this.computeTransactionStorage(trans);
            trans.storageChange = this.getStorageChange(trans);
         }
         return trans
      }else{
         this.tezos.computeGasAndStorage(trans);
         this.tezos.signTransaction(trans,true);
         this.tezos.createTransaction(trans);
      }
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

   computeTransactionGas() {
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

   getEntryPointParams(id) {
      let params = {
         id,
         sc_address: this.address,
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
      switch(id){
      case "buy_tokens":
         params.fields = ["minTokensExpected"];
         break;
      case "sell_tokens":
         params.fields = ["nbTokensSold","minTezExpected"];
         break;
      }
      return params
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      let sID = trans.sender;
      let sAcc = this.tezos.objectsPerAddress[sID];
      if(id == "buy_tokens"){
         let amo = trans.amount;
         let nb = this.getNbOfTokensBought(amo);
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
      // let subFctID = sc.entrypoints[subID].fct;
      // let subFct = sc[subFctID];
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
      let sub = sc.createTransaction({
         id: "transfer_tokens",
         sender: this.address,
         source : sou,
         destination: des, 
         nbTokens: nb
      },true)
      // let sub = subFct({ 
      //    ledger: sc,
      //    sender: this.address,
      //    source: sou, 
      //    destination: des, 
      //    nbTokens: nb
      // });
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
      // console.log(sub,subError)
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
               "<li>check that winner.revealed = true</li>"+
               "<li>send winner total_bids + total_deposits/nb_revealed</li>"+
               "<li>delete players[idWinner]</li></ul>",
            clickable: true,
            fct: "claimPrize"
         },
         "claim_deposit": {
            text: "<span class=ep_name>claim_deposit(id_player):</span><ul>"+
               "<li>check that time > deadline_reveal</li>"+
               "<li>idWinner = total%nb_players</li>"+
               "<li>check that id_player != idWinner</li>"+
               "<li>player = players[id_player]</li>"+
               "<li>check that player.revealed = true</li>"+
               "<li>amountToShare = total_deposits</li>"+
               "<li>if players[idWinner] && !players[idWinner].revealed, amountToShare += total_bids</li>"+
               "<li>send player amountToShare/nb_revealed</li>"+
               "<li>delete player</li></ul>",
            clickable: true,
            fct: "claimDeposit"
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

   getEntryPointParams(id) {
      let params = {
         id,
         sc_address: this.address,
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      switch(id){
      case "bid":
         params.fields = ["hash"];
         break;
      case "reveal":
         params.fields = ["idPlayer","numberValue"];
         break;
      case "claim_prize":
         params.fields = [];
         break;
      case "claim_deposit":
         params.fields = ["idPlayer"];
         break;
      }
      return params
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      if(id == "bid"){
         let sID = trans.sender;
         let sAcc = this.tezos.objectsPerAddress[sID];
         let player = { 
            type: "big-map", 
            address: { val:sAcc.address, type: "address" },
            hash: { val: trans.hash, type: "bytes" },
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
         // console.log(idWin,win)
         let amo = this.storage.total_bids.val + this.storage.total_deposits.val/this.storage.nb_revealed.val;
         acc.balance = roundTezAmount(acc.balance + amo);
         this.balance = roundTezAmount(this.balance - amo);
         delete this.storage.players[idWin];
      }
      else if(id == "claim_deposit"){
         let player = this.storage.players[trans.idPlayer];
         let amo = this.storage.total_deposits.val;
         let idWin = this.storage.total.val%this.storage.nb_players.val;
         let win = this.storage.players[idWin];
         if(win && win.revealed.val == 0){
            amo += this.storage.total_bids.val;
         }
         amo = amo/this.storage.nb_revealed.val;
         let acc = this.tezos.objectsPerAddress[player.address.val];
         acc.balance = roundTezAmount(acc.balance + amo);
         this.balance = roundTezAmount(this.balance - amo);
         delete this.storage.players[trans.idPlayer];
      }
   }

   createTransaction(dat) {
      // console.log(dat)
      let id = dat.id;
      let trans, params = this.getEntryPointParams(id);
      if(id == "bid"){
         trans = {
            sender: dat.sender,
            recipient: this.address,
            amount: this.storage.bid_amount.val + this.storage.deposit_amount.val,
            randomNumber: dat.randomNumber,
            hash: this.generateHash(dat.randomNumber),
            params
         };
      }else if(id == "reveal"){
         trans = {
            sender: dat.sender,
            recipient: this.address,
            amount: 0,
            idPlayer: dat.idPlayer,
            numberValue: dat.numberValue,
            params
         };
      }
      this.tezos.computeGasAndStorage(trans);
      this.tezos.signTransaction(trans,true);
      this.tezos.createTransaction(trans);
   }

   // createBidTransaction(address,num) {
   //    let params = this.getEntryPointParams("bid");
      
   //    let trans = {
   //       sender: address,
   //       recipient: this.address,
   //       amount: this.storage.bid_amount.val + this.storage.deposit_amount.val,
   //       randomNumber: num,
   //       hash: this.generateHash(num),
   //       params
   //    };
   //    this.tezos.computeGasAndStorage(trans);
   //    this.tezos.signTransaction(trans,true);
   //    this.tezos.createTransaction(trans);
   // }

   // createRevealTransaction(add,id,num) {
   //    let self = this;
   //    return function(){
   //       let params = { 
   //          id: "reveal",
   //          sc_address: self.address,
   //          fields: ["idPlayer","numberValue"],
   //          gas: "computeTransactionGas",
   //          storage: "computeTransactionStorage",
   //          storageChange: "getStorageChange",
   //          isTransactionValid: "isTransactionValid",
   //          findTransactionError: "findTransactionError",
   //       };
   //       let trans = {
   //          sender: add,
   //          recipient: self.address,
   //          amount: 0,
   //          idPlayer: id,
   //          numberValue: num,
   //          params
   //       };
   //       self.tezos.computeGasAndStorage(trans);
   //       self.tezos.signTransaction(trans,true);
   //       self.tezos.createTransaction(trans);
   //    }
   // }

   generateHash(num) {
      let hash = String(num+"abcdef").hashCode();
      return hash.toString(16)
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
      else if(id == "claim_prize" || id == "claim_deposit"){
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
      else if(id == "claim_prize" || id == "claim_deposit"){
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
      else if(id == "claim_deposit"){
         let p = dat.idPlayer;
         if(isNaN(p) || p < 0 || !Number.isInteger(p)) {
            $("#randomNumber").addClass("highlight");
            return taskStrings.wrongIdPlayer
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
         // if(p.hash.val != String(dat.numberValue).hashCode()){
         if(p.hash.val != this.generateHash(dat.numberValue)){
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
      else if(id == "claim_deposit"){
         let t = this.tezos.getCurrentTime();
         if(t < this.storage.deadline_reveal.val){
            return taskStrings.beforeDeadlineReveal
         }
         if(dat.amount){
            return taskStrings.amountUnwanted
         }
         let player = this.storage.players[dat.idPlayer];
         if(!player){
            return taskStrings.playerUnknown
         }
         if(player.revealed.val == 0){
            return taskStrings.playerNotRevealed
         }
      }
      return false
   }
}

class Auction extends SmartContract {
   constructor(params) {
      params.entrypoints = {
         "openAuction": { 
            text: "<span class=ep_name>openAuction(newDeadline):</span><ul>"+
               "<li>assert caller == owner</li>"+
               "<li>deadline = newDeadline</li>"+
               "<li>topBid = 0</li>"+
               "<li>topBidder = owner</li>",
            clickable: true,
            fct: "openAuction" 
         }, 
         "bid": { 
            text: "<span class=ep_name>bid():</span><ul>"+
               "<li>assert now <= deadline</li>"+
               "<li>assert amount > topBid</li>"+
               "<li>send topBid to topBidder</li>"+
               "<li>nb_players++</li>"+
               "<li>topBid = amount</li>"+
               "<li>topBidder = caller</li></ul>",
            clickable: true,
            fct: "bid" 
         }, 
         "closeAuction": {
            text: "<span class=ep_name>closeAuction():</span><ul>"+
               "<li>assert now > deadline</li>"+
               "<li>send topBid to owner</li>"+
               "<li>owner = topBidder</li>",
            clickable: true,
            fct: "closeAuction"
         }
      };
              
      params.storage = {
         owner: { val: params.owner, type: "address" },
         topBid: { type: "tez" },
         topBidder: { type: "address" },
         deadline: { type: "timestamp" },
      };

      super(params);
   }

   getEntryPointParams(id) {
      let params = {
         id,
         sc_address: this.address,
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
      };
      switch(id){
      case "openAuction":
         params.fields = ["deadline"];
         break;
      case "bid":
      case "closeAuction":
         params.fields = [];
         break;
      }
      return params
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      if(id == "openAuction"){
         let sID = trans.sender;
         // let sAcc = this.tezos.objectsPerAddress[sID];
         this.storage.deadline.val = trans.deadline;
         this.storage.topBid.val = 0;
         this.storage.topBidder.val = sID;
      }
      else if(id == "bid"){
         let prevAdd = this.storage.topBidder.val;
         let prevBid = this.storage.topBid.val;
         let prevAcc = this.tezos.objectsPerAddress[prevAdd];
         this.balance -= roundTezAmount(prevBid);
         this.balance = roundTezAmount(this.balance);
         prevAcc.balance += roundTezAmount(prevBid);
         prevAcc.balance = roundTezAmount(prevAcc.balance);

         this.storage.topBid.val = roundTezAmount(trans.amount);
         this.storage.topBidder.val = trans.sender;
      }
      else if(id == "closeAuction"){
         let owner = this.storage.owner.val;
         let topBid = this.storage.topBid.val;
         let ownAcc = this.tezos.objectsPerAddress[owner];
         this.balance -= roundTezAmount(topBid);
         this.balance = roundTezAmount(this.balance);
         ownAcc.balance += roundTezAmount(topBid);
         ownAcc.balance = roundTezAmount(ownAcc.balance);

         this.storage.owner.val = this.storage.topBidder.val;
      }
   }

   applicationCallCustom(tr) {
      /*** if the application of a transaction implies a custom contract, return the address of the custom contract ***/
      let id = tr.params.id;
      if(id == "bid"){
         let prevBid = this.storage.topBid.val;
         let prevAdd = this.storage.topBidder.val;
         if(prevBid < tr.amount && this.tezos.isSmartContractType(prevAdd,"custom"))
            return prevAdd
      }
      return false
   }

   createTransaction(dat) {
      // console.log(dat)
      let id = dat.id;
      let trans, params = this.getEntryPointParams(id);
      if(id == "openAuction"){
         trans = {
            sender: dat.sender,
            recipient: this.address,
            amount: dat.amount,
            delay: dat.delay,
            deadline: Date.now() + dat.delay*1000,
            params
         };
      }
      else if(id == "bid"){
         trans = {
            sender: dat.sender,
            recipient: this.address,
            amount: dat.amount,
            params
         };
      }
      this.tezos.computeGasAndStorage(trans);
      this.tezos.signTransaction(trans,true);
      return this.tezos.createTransaction(trans);
   }

   computeTransactionGas() {
      let gas = Math.round(this.tezos.defaultGasPerTransaction*1.5);
      return gas
   }

   computeTransactionStorage(trans) {
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let blob;
      if(id == "openAuction"){
         let deadline = Date.now() + tr.delay*1000;
         let date = new Date(deadline);
         let deadlineStr = date.toLocaleString();
         blob = new Blob([deadlineStr+"0"+tr.sender]);
      }
      else if(id == "bid"){
         blob = new Blob([(tr.amount)+""+(tr.sender)]);
      }
      else if(id == "closeAuction"){
         blob = new Blob([this.storage.topBidder.val+""]);
      }
      let sto = blob.size;

      return sto
   }

   getStorageChange(trans) {
      let tr = trans || this.tezos.newTransaction;
      let id = tr.params.id;
      let text = "";
      if(id == "openAuction"){
         // let deadline = Date.now() + tr.delay*1000;
         let date = new Date(tr.deadline);
         let deadlineStr = date.toLocaleString();
         text += "- set deadline to "+deadlineStr;
         text += "</br>";
         text += "- set topBid to 0";
         text += "</br>";
         let own = this.storage.owner.val;
         let alias = this.tezos.objectsPerAddress[own].alias;
         text += "- set topBidder to "+addressEllipsis(own,7,alias);
      }
      else if(id == "bid"){
         text += "- set topBid to "+tr.amount+" tez";
         text += "</br>";
         let sen = tr.sender;
         let alias = this.tezos.objectsPerAddress[sen].alias;
         text += "- set topBidder to "+addressEllipsis(sen,7,alias);
      }
      else if(id == "closeAuction"){
         let top = this.storage.topBidder.val;
         let alias = this.tezos.objectsPerAddress[top].alias;
         text += "- set owner to "+addressEllipsis(top,7,alias);
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
      if(id == "openAuction"){
         let del = dat.delay;
         if(isNaN(del) || del < 0 || !Number.isInteger(del)) {
            $("#delay").addClass("highlight");
            return taskStrings.wrongDelay
         }
      }
      
      return false
   }

   findTransactionError(trans) {
      // // console.log(trans)
      let dat = trans || this.tezos.newTransaction;
      let id = dat.params.id;
      // // console.log(dat)
      
      if(id == "openAuction"){
         let sen = dat.sender;
         if(sen != this.storage.owner.val){
            return taskStrings.senderIsNotOwner
         }         
         if(dat.amount){
            return taskStrings.amountUnwanted
         }
      }
      else if(id == "bid"){
         let t = this.tezos.getCurrentTime();
         // let curr = new Date(t);
         // let dead = new Date(this.storage.deadline.val);
         // console.log(curr.toLocaleString(),dead.toLocaleString())
         if(t > this.storage.deadline.val){
            return taskStrings.pastDeadlineAuction
         }
         if(dat.amount <= this.storage.topBid.val){
            return taskStrings.amountLowerThanTopBid
         }
         
      }
      else if(id == "closeAuction"){
         let t = this.tezos.getCurrentTime();
         if(t < this.storage.deadline.val){
            return taskStrings.beforeDeadlineAuction
         }
         if(dat.amount){
            return taskStrings.amountUnwanted
         }
      }

      return false
   }
}

class Custom extends SmartContract {
   constructor(params) {
      params.entrypoints = {
         "use": { 
            text: "<span class=ep_name>use():</span><ul>"+
               "<li>manually create subTransactions</li>",
            clickable: true,
            fct: "use" 
         },
         "default": {
            text: "<span class=ep_name>default():</span><ul>"+
               "<li>called when another contract wants to send money to this contract</li>",
            clickable: false
         }
      };
              
      params.storage = {

      };

      super(params);
   }

   getEntryPointParams(id) {
      let params = {
         id,
         sc_address: this.address,
         gas: "computeTransactionGas",
         storage: "computeTransactionStorage",
         storageChange: "getStorageChange",
         isTransactionValid: "isTransactionValid",
         findTransactionError: "findTransactionError",
         fields: []
      };
      return params
   }

   entryPointCondition(id) {
      if(id == "use" && this.tezos.customMode){
         return taskStrings.customEntryPointForbidden(this.alias)
      }
      return false
   }

   customSimulate() {
      // console.log("custom simulate")
      this.tezos.customMode = true;
      this.tezos.customData = {
         sc: this,
         mainTransaction: Beav.Object.clone(this.tezos.newTransaction),
         subTransactions: [],
         balance: roundTezAmount(this.balance + this.tezos.newTransaction.amount),
         currentBalance: roundTezAmount(this.balance + this.tezos.newTransaction.amount)
      };
      deleteView()();
      // this.prevBalance = this.balance;
      // this.balance = roundTezAmount(this.balance + this.tezos.newTransaction.amount);
      this.showCustomModePopup();    
   }

   showCustomModePopup() {
      let popup = $("<div id=custom_popup></div>");
      let html = "<span id=custom_mode >"+taskStrings.customMode(this.alias)+"</span>";
      html += "<div id=cont >";
      html += "<span id=ava_cred >"+taskStrings.availableCredit(this.tezos.customData.currentBalance)+"</span>";
      html += "<span id=subs >"+taskStrings.subTransactions+ " : -</span>";
      // html += "<table id=subs ><tr><th>"+taskStrings.subTransactions+ "</th></tr><tr><td></td></tr></table>";
      html += "<button id=quit_custom >"+taskStrings.quitCustomMode+"</button>";
      html += "</div>";
      html += "</div>";
      popup.html(html);
      $("#mainPage").append(popup);

      let self = this;
      $("#quit_custom").click(quitCustom);

      function quitCustom() {
         // console.log("quitCustom")
         $("#custom_popup").remove();
         let tr = self.tezos.customData.mainTransaction;
         tr.subTransactions = Beav.Object.clone(self.tezos.customData.subTransactions);
         self.tezos.newTransaction = Beav.Object.clone(tr);
         self.tezos.customMode = false;
         self.tezos.copyMode = true;
         // console.log(tr)
         self.tezos.createNewTransaction(null)();
      }
   }

   updateCustomModePopup() {
      $("#custom_popup #ava_cred").text(taskStrings.availableCredit(this.tezos.customData.currentBalance));
      let subStr = taskStrings.subTransactions+ ":";
      subStr += "<ol>";
      for(let sub of this.tezos.customData.subTransactions){
         // console.log(sub)
         subStr += "<li>";
         if(sub.params.simple){
            let rec = sub.recipient;
            let acc = this.tezos.objectsPerAddress[rec];
            subStr += "simple(";
            subStr += acc.alias+","+sub.amount+")";
         }else{
            let sc_address = sub.params.sc_address;
            let sc = this.tezos.objectsPerAddress[sc_address];
            let alias = sc.alias;
            subStr += alias+"."+sub.params.id+"(";
            for(let iF = 0; iF < sub.params.fields.length; iF++){
               let field = sub.params.fields[iF];
               subStr += sub[field];
               if(iF < sub.params.fields.length - 1){
                  subStr += ",";
               }
            }
            subStr += ")";
         }
         subStr += "</li>";
      }
      subStr += "</ol>";
      $("#custom_popup #subs").html(subStr);
   }

   askConfirmation(tr) {
      let back = $("<div id=custom_popup_back></div>");
      let popup = $("<div id=custom_popup></div>");
      let sen = tr.sender;
      let acc = this.tezos.objectsPerAddress[sen];
      let msg = taskStrings.customConfimation(acc.alias,this.alias);
      let html = "<span>"+msg+"</span>";
      html += "<div class=buttons><button id=custom_accept>"+taskStrings.accept+"</button>";
      html += "<button id=custom_refuse class=button-style-2>"+taskStrings.refuse+"</button></div>";
      popup.append(html);
      $("#mainPage").append(back,popup);

      let self = this;
      $("#custom_accept").click(acceptTrans);
      $("#custom_refuse").click(refuseTrans);

      function acceptTrans() {
         // console.log("acceptTrans")
         // let sc_address = tr.params.sc_address;
         // let sc = self.tezos.objectsPerAddress[sc_address];
         self.tezos.createTransaction(tr,true);
         $("#custom_popup, #custom_popup_back").remove();
         self.tezos.resumeCreateNextXBlocks();
      }

      function refuseTrans() {
         // console.log("refuseTrans")
         $("#custom_popup, #custom_popup_back").remove();
         self.tezos.resumeCreateNextXBlocks();
      }
   }

   applyTransaction(trans) {
      let id = trans.params.id;
      if(id == "use"){
         let subs = trans.subTransactions;
         for(let sub of subs){
            // let sc_address = sub.params.sc_address;
            // let sc = this.tezos.objectsPerAddress[sc_address];
            this.tezos.applyTransaction(null,sub);
            // console.log(s)
         }
      }
   }

   // createTransaction(dat) {
   //    // console.log(dat)
   //    let id = dat.id;
   //    let trans, params = this.getEntryPointParams(id);
   //    if(id == "use"){
   //       trans = {
   //          sender: dat.sender,
   //          recipient: this.address,
   //          amount: dat.amount,
   //          params
   //       };
   //    }
   //    this.tezos.computeGasAndStorage(trans);
   //    this.tezos.signTransaction(trans,true);
   //    this.tezos.createTransaction(trans);
   // }

   computeTransactionGas() {
      let gas = Math.round(this.tezos.defaultGasPerTransaction*1.5);
      let subs = this.tezos.newTransaction.subTransactions;
      for(let sub of subs){
         gas += sub.gas;
      } 
      return gas
   }

   computeTransactionStorage(trans) {
      let storage = 0;
      let tr = trans || this.tezos.newTransaction;
      let subs = tr.subTransactions;
      for(let sub of subs){
         storage += sub.storage;
      } 
      return storage
   }

   getStorageChange(trans) {
      // let tr = trans || this.tezos.newTransaction;
      // let id = tr.params.id;
      let text = "";
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
      
      return false
   }

   findTransactionError(trans) {
      return false
   }
}


function Tezos(params) {
   let { accounts, transactions, mempool, mempoolMode, nbCreatedAccounts, 
      counterEnabled, ledgerEnabled, createAccountEnabled, nextXBlocksEnabled, delayBetweenBlocks,
      transactionTableLength, smartContracts, pageW, pageH, saveAnswer, timeDependencies } = params;
   let self = this;

   transactionTableLength = transactionTableLength || 7;
   mempoolMode = mempoolMode || "auto"; // "none", "auto", "manual"
   delayBetweenBlocks = delayBetweenBlocks || 1000;
   
   const marginX = 20;
   const marginY = 20;

   const transactionTableW = pageW*0.52;
   const accountsTableW = pageW*0.42;

   const maxAccounts = accounts.length;
   const cellH = 35;
   const transactionTableH = cellH*(transactionTableLength + 1) + 3;
   const mempoolLength = 4;
   const headerH = cellH;
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
   this.customMode = false;   // custom contract
   this.customData;
   this.copyMode = false;

   let nbSmartContracts;
   let smartContractTypes = [];
   let fields;
   let copied = null;
   timeDependencies = timeDependencies || [];



   function init() {
      initMainPage();
      initObjectsPerAddress();
      initHandlers();
      initTimeDependencies();

      if(transactions.length > 0){
         for(let tr of transactions){
            self.createTransaction(tr);
         }
      }

      updateMemPool();
      updateAccountsTable();
      updateTransactionTable();

      let transH = (transactionTableLength + 1)*cellH;
      let mempoolH = (mempoolLength + 1)*cellH;
      let leftColH = marginY + headerH + transH + marginY;
      if(mempoolMode != "none"){
         leftColH += mempoolH + marginY;
      }
      let accountH = (maxAccounts + 1)*cellH;
      let smartContractsH = (self.smartContracts.length + 1)*cellH;
      let nbButtons = 2;
      if(createAccountEnabled)
         nbButtons++;

      let rightColH = marginY + headerH + accountH + marginY + headerH + smartContractsH + marginY + nbButtons*(cellH + marginY);
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
      let transDiv = $("<div id='transactions' class='container'></div>");
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
         // width: (transactionTableW - 20)+"px"
      })
      transDiv.append(clone);

      return transDiv
   };

   function initAccountsTable() {
      let colDiv = $("<div id='colCont'></div>");
      let accountDiv = $("<div id='accountsCont' class='container'></div>");
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
      colDiv.append(accountDiv);
      colDiv.css("width",accountsTableW+"px");

      let scDiv = initSmartContracts();

      let buttons = initButtons();
      colDiv.append(scDiv,buttons);

      return colDiv
   };

   function initSmartContracts() {
      if(ledgerEnabled){
         initLedger();
      }
      if(smartContracts && smartContracts.length > 0){
         for(let scData of smartContracts){
            scData.tezos = self;
            let type = scData.type;
            switch(type){
            case "liquidityPool":
               initLiquidityPool(scData);
               break;
            case "raffle":
               initRaffle(scData);
               break;
            case "auction":
               initAuction(scData);
               break;
            case "custom":
               initCustom(scData);
               break;
            }

            if(scData.init){
               let sc = self.objectsPerAddress[scData.address];
               if(!sc.createTransaction)
                  continue
               for(let action of scData.init){
                  sc.createTransaction(action);
               }
            } 

            if(!smartContractTypes.includes(type)){
               smartContractTypes.push(type);
            }  
         }
      }

      nbSmartContracts = self.smartContracts.length;

      let scDiv = $("<div id='smartContractsCont' class='container'></div>");
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

      function initLedger() {
         self.ledger = new Ledger({tezos:self});
         self.ledger.display();
         self.smartContracts.push(self.ledger);
         self.objectsPerAddress[self.ledger.address] = self.ledger;
      };

      function initLiquidityPool(lpData) {
         if(!self.ledger)
            initLedger();
         let lp = new LiquidityPool(lpData);
         lp.setTokenBalance(lpData.token_balance);
         self.smartContracts.push(lp);
         self.objectsPerAddress[lp.address] = lp;
         self.ledger.changeUserBalance(lp.address,lpData.token_balance,1);
      };

      function initRaffle(rafData) {
         let raf = new Raffle(rafData);
         self.smartContracts.push(raf);
         self.objectsPerAddress[raf.address] = raf;
         for(let iP = 0; iP < rafData.playerNumbers.length; iP++){
            let num = rafData.playerNumbers[iP];
            let add = accounts[iP].address;
            // raf.createBidTransaction(add,num);
            raf.createTransaction({
               id: "bid",
               sender: add,
               randomNumber: num
            })
            timeDependencies.push({
               time: raf.storage.deadline_commit.val - 2*delayBetweenBlocks*1000,
               // action: raf.createRevealTransaction(add,iP,num),
               sc_address: raf.address,
               action: {
                  id: "reveal",
                  sender: add,
                  idPlayer: iP,
                  numberValue: num
               },
               done: false
            });
         }
      };

      function initAuction(aucData) {
         let auc = new Auction(aucData);
         self.smartContracts.push(auc);
         self.objectsPerAddress[auc.address] = auc;
      };

      function initCustom(cusData) {
         let cus = new Custom(cusData);
         self.smartContracts.push(cus);
         self.objectsPerAddress[cus.address] = cus;
      };
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

   function initTimeDependencies() {
      for(let dep of timeDependencies){
         if(!dep.time && dep.delay){
            dep.time = Date.now() + dep.delay*1000;
         }
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

      // $("#newAccount").on("click",createNewAccount);
      $("#newAccount").on("click",clickHandler("newAccount"));
      $("#newAccount").css("cursor","pointer");   

      // $("#newTransaction").on("click",self.createNewTransaction({simple: true}));
      $("#newTransaction").on("click",clickHandler("newTransaction"));
      $("#newTransaction").css("cursor","pointer");  

      // $("#nextBlock").on("click",createNextBlock);
      $("#nextBlock").on("click",clickHandler("nextBlock"));
      $("#nextBlock").css("cursor","pointer"); 

      // $("#nextXBlocks").on("click",createNextXBlocks);
      $("#nextXBlocks").on("click",clickHandler("nextXBlocks"));
      $("#nextXBlocks").css("cursor","pointer");   
   };

   function clickHandler(id) {
      return function(){
         if(id != "newTransaction" && self.customMode){
            displayError(taskStrings.customActionForbidden(self.customData.sc.alias));
            return
         }
         switch(id){
         case "newAccount":
            createNewAccount();
            break;
         case "newTransaction":
            self.createNewTransaction({simple: true})();
            break;
         case "nextBlock":
            createNextBlock();
            break;
         case "nextXBlocks":
            createNextXBlocks();
            break;
         }
      }
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
            let header = $("<div id=header>"+taskStrings.account+": "+dat.alias+"<div class=icon ><i class='fas fa-times'></i></div></div></div>");
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
         if(type == 1){ // simulation
            viewId = "simView";
            backId = "simBack";
            headerStr = taskStrings.simulationResults;
            dat = self.newTransaction;
         }else if(type == 2){ // view
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
            if(dat.recipient == self.newTransaction.sender){
               return taskStrings.recipientIsSender
            }
            let acc = self.objectsPerAddress[dat.sender];
            let bal = (self.customMode) ? self.customData.currentBalance : acc.balance;
            // console.log(acc.balance,dat.amount,acc.balance < dat.amount);
            if(bal < dat.amount){
               return taskStrings.amountTooHigh(bal)
            }
            if(!params.simple){
               return findEntrypointCallError()
            }
            console.log(dat.counter,acc.transactionNum)
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

         function displayTransaction() {
            let cont = $("<div id=view_transaction class=view></div>");
            let header = $("<div id=header>"+headerStr+"<div class=icon ><i class='fas fa-times'></i></div></div></div>");
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
               if(dat.subTransactions && dat.subTransactions.length > 0)
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
                  html += "<p class=line><span class=label>"+taskStrings[key]+"</span> "+str+"</p>";
                  break;
               case "amount":
               case "bakerFee":
                  html += "<p class=line><span class=label>"+taskStrings[key]+"</span> "+dat[key]+" tez</p>";
                  break;
               case "additionalFee":
                  html += "<hr/>";
                  html += "<p class=line><span class=label>"+taskStrings.additionalFee+"</span>";
                  html += " <input type=text id=additionalFee class='input tez' value="+self.additionalFee+" /><span class=tez_unit>ꜩ</span>";
                  break;
               case "gas":
                  let gCost = roundTezAmount(dat[key]*gasCostPerUnit);
                  html += "<hr/>";
                  html += "<p class=line><span class=label>"+taskStrings[key]+"</span> "+dat[key]+" (cost = "+gCost+" tez)</p>";
                  break;
               case "storage":
                  // console.log(storageCostPerUnit);
                  let sCost = roundTezAmount(dat[key]*storageCostPerUnit);
                  html += "<p class=line><span class=label>"+taskStrings[key]+"</span> "+dat[key]+" "+taskStrings.byte(dat[key])+" (cost = "+sCost+" tez)</p>";
                  break;
               case "counter":
                  if(counterEnabled)
                     html += "<p class=line><span class=label>"+taskStrings.transactionNum+"</span> "+dat[key]+"</p>";
                  break;
               case "signature":
                  let sig = (dat.signature) ? addressEllipsis(dat.signature) : taskStrings.notSigned;
                  if(type == 1){
                     let cla = (dat.signature) ? "signed" : "unsigned";
                     html += "<div class='signature "+cla+"'>"+((dat.signature) ? "" : "<i class='fas fa-exclamation-circle'></i>");       
                     html += "<span class=label>"+taskStrings[key]+"</span> : <span class=value>"+sig+"</span></div>";
                  }else{
                     html += "<hr/>";
                     html += "<p class=line><span class=label>"+taskStrings[key]+"</span> <span class=value>"+sig+"</span></p>";
                  }
                  break;
               case "id":
                  // ep = true;
                  html += "<div class=ep_cont>";
                  html += "<p class=line><span class=label><b>"+taskStrings.entrypoint+"</b></span> "+params.id+"</p>";
                  html += "<p class=line><span class=label><b>"+taskStrings.parameters+"</b></span></p>";
                  break;
               case "epEnd":
                  html += "</div>";
                  break;
               case "source":
               case "operator":
               case "destination_ep":
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+"</span> "+self.objectsPerAddress[dat[key]].alias+"</p>";
                  break;
               case "nbOfTokens":
               case "nbTokensSold":
               case "minTokensExpected":
               case "minTezExpected":
               case "idPlayer":
               case "numberValue":
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+"</span> "+dat[key]+"</p>";
                  break;
               case "hash":
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+"</span> "+addressEllipsis(dat[key])+"</p>";
                  break;
               case "deadline":
                  let date = new Date(dat[key]);
                  html += "<p class=line><span class='label parameter'>"+taskStrings[key]+"</span> "+date.toLocaleString()+"</p>";
                  break;
               case "subTransactions":
                  html += "<p class=line><span class=label><b>"+taskStrings.subTransactions+"</b></span></p>";
                  let colKeys = transactionTableColKeys;
                  let table = getTransactionTable("sub_transaction_table",dat[key].length,dat[key]);
                  let div = $("<div></div>");
                  div.append(table);
                  html += div.html();
                  break;
               case "storageChange":
                  html += "<hr/>";
                  html += "<p class=line><span class='label'><b>"+taskStrings.storageChange+"</b></span></p>";
                  html += "<p class=line id=storage_change>"+dat.storageChange+"</p>";
                  break;
               case "error":
                  html += "<p class='line error'>"+taskStrings.error+" : "+err+"</p>";
                  break;
               }
            }

            if(type == 1){
               if(!err){
                  let id = (dat.signature || self.customMode) ? "validate" : "sign";
                  html += "<div id=buttons ><button id=validate>"+taskStrings[id]+"</button><button id=cancel class=button-style-2 >"+taskStrings.edit+"</button></div>";
               }else{
                  html += "<button id=cancel class=button-style-2 >"+taskStrings.cancel+"</button>";
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
                  self.copyMode = true;
                  self.createNewTransaction(null)();
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
            if(!self.newTransaction.signature && !self.newTransaction.sub){
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
            if(self.customMode){
               let tr = Beav.Object.clone(self.newTransaction);
               self.customData.subTransactions.push(tr);
               deleteView()();
               self.customData.currentBalance -= tr.amount;
               self.customData.sc.updateCustomModePopup();
               // console.log(self.customData)
               return
            }
            let add = self.additionalFee;
            if(isNaN(add) || add < 0){
               displayError(taskStrings.wrongAdditionalFee);
               $("#additionalFee").addClass("highlight");
               return
            }
            let sen = self.objectsPerAddress[self.newTransaction.sender];
            let amo = self.newTransaction.amount;
            let fee = self.newTransaction.bakerFee;
            let gas = self.newTransaction.gas;
            let sto = self.newTransaction.storage;
            let tot = add + fee + amo + gas*gasCostPerUnit + sto*storageCostPerUnit;
            if(sen.balance < tot){
               displayError(taskStrings.amountTooHigh(sen.balance));
               if(add > 0)
                  $("#additionalFee").addClass("highlight");
               return
            }
            $("#additionalFee").val(self.additionalFee);
            self.newTransaction.bakerFee += self.additionalFee;
            self.createTransaction();
            deleteView()();
         };
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
      tr.signature = this.generateSignature(tr);

      return false
   };

   this.computeGasAndStorage = function(trans) {
      let tr = trans || self.newTransaction;
      let params = tr.params;
      if(!params.simple){
         let sc = self.objectsPerAddress[params.sc_address];
         tr.storage = sc[params.storage](tr);
         tr.storageChange = sc[params.storageChange](tr);
      }else{
         tr.storage = 0;
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

   this.generateSignature = function(tr) {
      let clone = Beav.Object.clone(tr);
      delete clone.storageChange;
      delete clone.subTransactions;
      delete clone.bakerFee;
      let hash = JSON.stringify(clone).hashCode();
      // tr.signature = hash;
      return (hash*hash).toString(32);
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

         if(self.newTransaction == undefined){
            self.newTransaction = { amount: 0, counter: 1 };
            delete self.newTransaction.signature;
            self.newTransaction.storage = 0;
         }
         if(!params)
            params = self.newTransaction.params || { simple: true };
         
         if(self.customMode)
            self.newTransaction.sub = true;

         fields = ["sender","recipient","amount"]
         if(!params.simple){
            fields.push("entrypoint");
            for(let field of params.fields){
               if(!fields.includes(field))
                  fields.push(field);
            }
            fields.push("epEnd");
         }
         fields.push("counter");
         if(!self.customMode)
            fields.push("signature");
         self.newTransaction.params = Beav.Object.clone(params);
         // console.log(params)

         let view = $("<div id=view></div>");
         let back = $("<div id=back></div>");

         let form = displayTransactionForm();
         view.append(back,form);
         $("#mainPage").append(view);

         initFormHandlers();

         if(self.copyMode){
            simulate();
         }

         function displayTransactionForm() {
            // console.log(params);
            let headerStr = (self.customMode) ? taskStrings.newSubTransaction : taskStrings.newTransaction;
            let cont = $("<div id=transaction_form class='view form'></div>");
            let header = $("<div id=header>"+headerStr+"<div class=icon ><i class='fas fa-times'></i></div></div>");
            let content = $("<div id=content></div>");

            let html = "";
            let ep = false;

            for(let field of fields){
               if(!counterEnabled && field == "counter")
                  continue;
               let name = taskStrings[field];
               if(field == "entrypoint"){
                  html += "<div class=ep_cont>";
               }
               if(field == "epEnd"){
                  html += "</div>";
                  continue;
               }
               if(field == "hash"){
                  html += "<p class=field>"+taskStrings.randomNumber;
               }else if(field == "deadline"){
                  html += "<p class=field>"+taskStrings.delay;
               }else if(field == "signature"){
                  html += "<p class='field signature' ><i class='fas fa-pen-fancy'></i>"+name+" : ";
               }else if(field == "entrypoint"){
                  html += "<p class=field><b>"+name+"</b>";
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
                  if(self.customMode && field == "sender"){
                     self.newTransaction[field] = self.customData.sc.address;
                     html += "<span class=address>"+addressEllipsis(self.newTransaction[field])+"</span>";
                     break
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
                  html += "</select><i class='fas fa-chevron-down select-arrow'></i>";
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
                  let cla = "input";
                  if(field == "amount" || field == "minTezExpected"){
                     cla += " tez";
                  }
                  html += "<input type=text id="+field+" class='"+cla+"' value="+val+" />";
                  if(field == "amount" || field == "minTezExpected"){
                     html += "<span class=tez_unit>ꜩ</span>";
                  }
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
                  html += "<p class=field>"+name+"<span id=hash>"+addressEllipsis(updateHash(num))+"</span>";
                  break;
               case "deadline":
                  let del = self.newTransaction.delay || 0;
                  self.newTransaction.delay = del;
                  html += "<input type=text id=delay class=input value="+del+" /></p>";
                  let deadline = Date.now() + del;
                  let date = new Date(deadline);
                  str = date.toLocaleString();
                  html += "<p class=field>"+name+"<span id=deadline >"+str+"</span>";
                  break;
               case "entrypoint":
                  // html += "<div class=ep_cont>";
                  html += "<span>"+params.id+"</span>";
                  break;

               }
               html += "</p>";
            }
            if(ep)
               html += "</div>";
            html += "<div id=buttons ><button id=simulate>"+taskStrings.simulate+"</button><button id=cancel class=button-style-2 >"+taskStrings.cancel+"</button></div>";
            content.append(html);
            cont.append(header,content);
            return cont
         }
      };

      function initFormHandlers() {
         // $(".select-arrow").click(function() {
         //    let id = $(this).attr("name");
         //    console.log(id);
         //    $("#"+id).trigger('chosen:updated');
         // })
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
            " #counter, #randomNumber, #idPlayer, #numberValue, #delay").on("keyup",changeInput/*function() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let id = $(this).attr("id");
            let val = Number(this.value);
               console.log(val)
            if(id == "amount" || id == "minTezExpected")
               val = roundTezAmount(val);
            if(id == "randomNumber")
               updateHash(val);
            if(id == "delay")
               updateDeadline(val);
            if(self.newTransaction[id] != val){
               self.newTransaction[id] = val;
               delete self.newTransaction.signature
               $("#transaction_form #signature").text(taskStrings.notSigned);
            }
            // self.newTransaction[id] = Number(val);
            // console.log(self.newTransaction)
         }*/);
         $("#counter").change(changeInput);
         

         // $("#sign").on("click",signTransaction);
         // $("#sign").css("cursor","pointer");

         $("#simulate").on("click",simulate);
         $("#simulate").css("cursor","pointer");

         $("#cancel, #header .icon").on("click",deleteView());
         $("#cancel, #header .icon").css("cursor","pointer");

         function changeInput() {
            displayError("");
            if(isNaN(this.value)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            let id = $(this).attr("id");
            let val = Number(this.value);
               // console.log(val)
            if(id == "amount" || id == "minTezExpected")
               val = roundTezAmount(val);
            if(id == "randomNumber")
               updateHash(val);
            if(id == "delay")
               updateDeadline(val);
            if(self.newTransaction[id] != val){
               self.newTransaction[id] = val;
               delete self.newTransaction.signature
               $("#transaction_form #signature").text(taskStrings.notSigned);
            }
         };
      };

      function updateHash(val) {
         let sc_address = params.sc_address;
         let sc = self.objectsPerAddress[sc_address];
         let h = sc.generateHash(val);
         // var h = String(val).hashCode();
         $("#hash").text(addressEllipsis(h));
         self.newTransaction.hash = h;
         return h
      };

      function updateDeadline(val) {
         let t = Date.now() + val*1000;
         let date = new Date(t);
         let str = date.toLocaleString();
         $("#deadline").text(str);
      }; 

      function simulate() {
         // console.log(copy)
         $("#amount").val(self.newTransaction.amount);
         if(!isTransactionValid())
            return
         if(!params.simple && !self.copyMode){
            let sc_address = params.sc_address;
            let sc = self.objectsPerAddress[sc_address];
            if(sc.customSimulate){  // custom contract
               sc.customSimulate();
               return
            }
            if(self.newTransaction.minTezExpected){
               $("#minTezExpected").val(self.newTransaction.minTezExpected);
            }
            if(self.newTransaction.hasOwnProperty('delay')){
               self.newTransaction.deadline = Date.now() + self.newTransaction.delay*1000;
            }
         }

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
         // console.log("simulate")
         // console.log(params)
         self.copyMode = false;
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

   this.createTransaction = function(trans,accepted) {
      let tr = trans || self.newTransaction;
      if(!accepted){
         let conf = requiresConfirmation(tr);
         if(conf){
            if(self.newTransaction)
               self.newTransaction = undefined;
            return true
         }
      }
      let id = self.transactions.length; 
      self.transactions[id] = Beav.Object.clone(tr);
      // console.log(JSON.stringify(tr))
      self.newTransaction = undefined;
      copied = null;
      if(mempoolMode != "none"){
         self.mempool.push(id);
         updateMemPool();
      }else{
         self.applyTransaction(id);
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
      return false
   };

   this.applyTransaction = function(id,tr) {
      let trans = tr || self.transactions[id];
      // console.log(trans)
      let sID = trans.sender;
      let rID = trans.recipient;
      let amo = trans.amount;
      let fee = trans.bakerFee;
      let gas = trans.gas;
      let sto = trans.storage;
      let par = trans.params;
      let sub = trans.sub; // for custom contract subTransactions
      // console.log(self.objectsPerAddress[sID].balance)
      self.objectsPerAddress[sID].balance -= (sub) ? amo : (amo + fee + gas*gasCostPerUnit + sto*storageCostPerUnit);
      self.objectsPerAddress[rID].balance += amo;
      self.objectsPerAddress[sID].balance = roundTezAmount(self.objectsPerAddress[sID].balance);
      self.objectsPerAddress[rID].balance = roundTezAmount(self.objectsPerAddress[rID].balance);
      // console.log(self.objectsPerAddress[sID].balance)
      if(!par.simple){
         // console.log(trans)
         let sc = self.objectsPerAddress[rID];
         sc.applyTransaction(trans);
      }
      // console.log(self.objectsPerAddress[sID].balance)
      if(sub)
         return
      self.objectsPerAddress[sID].transactionNum++;
      self.bakerBalance += (fee + gas*gasCostPerUnit);
      saveAnswer(self);
   };

   function requiresConfirmation(tr) {
      if(smartContractTypes.includes("custom")){
         let rec = tr.recipient;
         let obj = self.objectsPerAddress[rec];
         if(obj.applicationCallCustom){
            let add = obj.applicationCallCustom(tr)
            if(add){
               let cus = self.objectsPerAddress[add];
               cus.askConfirmation(tr);
               return true
            }
         }
      }
      return false
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
            self.applyTransaction(id);
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
         html += "<div id=buttons ><button id=validate>"+taskStrings.validate+"</button><button id=cancel class=button-style-2 >"+taskStrings.cancel+"</button></div>";
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
         let t = self.getCurrentTime() + nbBlocks*delayBetweenBlocks*1000;
         let date = new Date(t);
         let str = date.toLocaleString();
         $("#timeShift").text(str);
      }; 

      function validate() {
         for(let ib = 0; ib < nbBlocks; ib++){
            self.timeShift += delayBetweenBlocks;
            createNextBlock();
            let pause = self.checkTimeDependencies();
            if(pause){
               self.createNextXBlocksPauseData = { remainingBlocks: nbBlocks - ib - 1 };
               return
            }
         }
         deleteView()();
      };
   };

   // this.validateCreateNextXBlocks = function(nbBlocks) {
   //    console.log("validateCreateNextXBlocks",nbBlocks)
   //    return function() {
   //       for(let ib = 0; ib < nbBlocks; ib++){
   //          createNextBlock();
   //          self.timeShift += delayBetweenBlocks;
   //          let pause = self.checkTimeDependencies();
   //          if(pause){
   //             self.createNextXBlocksPauseData = { remainingBlocks: nbBlocks - ib };
   //             return
   //          }
   //       }
   //       deleteView()();
   //    }
   // };

   this.resumeCreateNextXBlocks = function() {
      if(!self.createNextXBlocksPauseData)
         return
      let rem = self.createNextXBlocksPauseData.remainingBlocks;
      for(let ib = 0; ib < rem; ib++){
         self.timeShift += delayBetweenBlocks;
         createNextBlock();
         let pause = self.checkTimeDependencies();
         if(pause){
            self.createNextXBlocksPauseData = { remainingBlocks: nbBlocks - ib };
            return
         }
      }
      deleteView()();
      self.createNextXBlocksPauseData = undefined;
   };

   this.checkTimeDependencies = function() {
      let t = self.getCurrentTime();
      for(let dep of timeDependencies){
         if(dep.done){
            continue;
         }
         if(t > dep.time){
            let sc_address = dep.sc_address;
            let sc = self.objectsPerAddress[sc_address];
            // if(smartContractTypes.includes("custom")){
            //    let add = sc.applicationCallCustom(dep.action)
            //    if(add){
            //       let cus = self.objectsPerAddress[add];
            //       cus.askConfirmation(dep);
            //       return true
            //    }
            // }
            dep.done = true;
            let conf = sc.createTransaction(dep.action);
            if(conf)
               return true
         }
      }
   };

   this.isSmartContractType = function(address,type) {
      for(let sc of smartContracts){
         let add = sc.address;
         if(add == address && sc.type == type)
            return true
      }
      return false
   }

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
         html +="<tr class=row_"+row+" ><td colspan=4 class=block_header ><span>Block "+block.id+"</span> - <span class=timestamp>"+time+"</span></td></tr>";
         row++;
         for(let iT = 0; iT < block.transactions.length; iT++){
            let transID = block.transactions[iT];
            let t = self.transactions[transID];
            html += "<tr class='row_"+row+" "+((iT > 0) ? "separation_line" : "")+"'>";
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
      $("#transaction_table_cont_clone").css("width",(transactionTableW - 15 - scrollBarWidth)+"px");
      // console.log(scrollBarWidth)
   };

   function getTransactionTable(id,nbRows,content) {
      // console.log("getTransactionTable")
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
               // console.log(entry)
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
