function Tezos(params) {
   let { accounts, transactions, mempool, nbCreatedAccounts, pageW, pageH } = params;
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
   const defaultGasCostPerTransaction = 10;
   const gasCostPerUnit = 0.0005;
   const storageCostPerUnit = 0.0004;
   const feeConstant = 0.0002;
   const blockSize = 30; // gas unit
   const allowEmptyBlocks = true;

   const crossSrc = $("#cross").attr("src");
   
   this.accounts = accounts || [];
   this.accountsPerAlias = {};
   this.nbCreatedAccounts = nbCreatedAccounts || 0;
   this.transactions = transactions || [];
   this.mempool = mempool || [];
   this.blocks = [];
   this.blockIndex = 1;
   
   init();

   function init() {
      formatAccounts();
      initMainPage();
      initHandlers();
      updateMemPool();

      let transH = (transactionTableLength + 1)*30;
      let mempoolH = (mempoolLength + 1)*30;
      let leftColH = marginY + headerH + transH + marginY + mempoolH + marginY;
      let accountH = (maxAccounts + 1)*30;
      let rightColH = marginY + headerH + accountH + marginY + 3*($("button").height() + marginY);
      pageH = Math.max(leftColH,rightColH);

      displayHelper.taskH = pageH;
      displayHelper.taskW = pageW;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;
   };

   function formatAccounts() {
      for(let a of accounts){
         // a.balance = Number.parseFloat(a.balance).toFixed(6);
         // self.accountsPerAlias[a.alias] = a;
      }
   };

   function initMainPage() {
      let main = $("<div id='mainPage'></div>");
      let transactionTable = initTransactionTable();
      let accountsTable = initAccountsTable();
      main.append(transactionTable,accountsTable);
      $("#taskCont").append(main);

      main.css({
         width: pageW+"px",
         height: pageH+"px",
      })
   };

   function initTransactionTable() {
      let transDiv = $("<div id='transactions'></div>");
      transDiv.append("<h3>"+taskStrings.transactions+"</h3>");

      let cont = $("<div id=transaction_table_cont></div>");
      let table = $("<table id='transaction_table'></table>");
      let colKeys = ["sender", "amount","destination","parameters"];

      let nbRows = transactionTableLength;
      for(let row = 0; row <= nbRows; row++){
         let line = $("<tr class=row_"+row+"></tr>");
         for(let col = 0; col < colKeys.length; col++){
            let entry = "", type = "td";
            if(row == 0){
               entry = taskStrings[colKeys[col]];
               type = "th";
            }
            line.append($("<"+type+" class='col_"+col+"'>"+entry+"</"+type+">"));
         }
         table.append(line);
      }
      // transDiv.append(table);
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
      let colKeys = ["address", "balance"];

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

      let buttons = initButtons();
      accountDiv.append(buttons);

      return accountDiv
   };

   function initButtons() {
      let buttons = $("<div id=buttons></div>");
      let ids = ["newAccount", "newTransaction", "nextBlock"];
      for(let iB = 0; iB < ids.length; iB++){
         buttons.append("<button type=button id="+ids[iB]+">"+taskStrings[ids[iB]]+"</button>");
      } 
      return buttons
   };

   function initHandlers() {
      for(let row = 0; row < accounts.length; row++){
         $("#accounts_table .row_"+(row + 1)).on("click",viewAccount(row));
         $("#mem_pool_table .row_"+(row + 1)).on("click",clickMemPool(row));
         $(".row_"+(row + 1)).css("cursor","pointer");
      }

      $("#newAccount").on("click",createNewAccount);
      $("#newAccount").css("cursor","pointer");   

      $("#newTransaction").on("click",createNewTransaction);
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

   function viewAccount(row) {
      return function() {
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
            let header = $("<div id=header>"+taskStrings.account+": "+dat.alias+"<img src="+crossSrc+" class=icon /></div>");
            let content = $("<div id=content></div>");

            let html = "";
            for(let key in dat){
               if(key == "owner")
                  continue;
               if(dat.owner != 0 && key == "privateKey")
                  continue;
               html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+"</p>";
            }
            content.append(html);
            cont.append(header,content);
            return cont
         }
      }
   };

   function viewTransaction(id,sim) {
      return function() {
         // console.log("viewTransaction",id)
         displayError("");
         let viewId = (sim) ? "simView" : "view";
         let backId = (sim) ? "simBack" : "back";
         let view = $("<div id="+viewId+"></div>");
         let back = $("<div id="+backId+"></div>");

         let tra = displayTransaction(id,sim);
         view.append(back,tra);
         $("#mainPage").append(view);

         if(sim){
            $("#simView #cancel").on("click",deleteView(true));
            $("#simView #cancel").css("cursor","pointer");
            $("#simView #validate").on("click",function() {
               createTransaction();
               deleteView()();
            });
            $("#simView #cancel").css("cursor","pointer");
         }else{
            $("#view #header, #back").on("click",deleteView());
            $("#view #header, #back").css("cursor","pointer");

            $("#view #copy").css("cursor","pointer");
            $("#view #copy").on("click",function() {
               deleteView()();
               self.newTransaction = Beav.Object.clone(self.transactions[id]);
               self.newTransaction.signed = false;
               createNewTransaction();
            });            
         }

         function displayTransaction(id,sim) {
            let dat = (sim) ? self.newTransaction : self.transactions[id];
            let cont = $("<div id=view_transaction class=view></div>");
            let header = $("<div id=header>"+taskStrings.transactionDetails+"<img src="+crossSrc+" class=icon /></div>");
            let content = $("<div id=content></div>");

            let transactionKeys = ["sender","recipient","amount","gas","storage","counter","signature","bakerFee"];
            let html = "";
            for(let key of transactionKeys){
               switch(key){
               case "sender":
               case "recipient":
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+accounts[dat[key]].alias+"</p>";
                  break;
               case "amount":
               case "bakerFee":
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+"Tez</p>";
                  break;
               case "gas":
                  let gCost = dat[key]*gasCostPerUnit;
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" (cost = "+gCost+"Tez)</p>";
                  break;
               case "storage":
                  let sCost = dat[key]*storageCostPerUnit;
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat[key]+" (cost = "+sCost+"Tez)</p>";
                  break;
               case "counter":
                  html += "<p class=line><span class=label>"+taskStrings.transactionNum+":</span> "+dat[key]+"</p>";
                  break;
               case "signature":
                  html += "<p class=line><span class=label>"+taskStrings[key]+":</span> "+dat.signed+"</p>";
                  break;
               }
            }
            if(sim){
               html += "<div id=buttons ><button id=validate>"+taskStrings.validate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
            }else{
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

   function createNewTransaction() {
      displayError("");
      let own = false;
      for(let iA = 0; iA < self.nbCreatedAccounts; iA++){
         let dat = self.accounts[iA];
         if(dat.owner == 0){
            own = true;
            break;
         }
      }
      if(!own){
         displayError(taskStrings.noAccount);
         return
      }
      let view = $("<div id=view></div>");
      let back = $("<div id=back></div>");

      if(self.newTransaction == undefined)
         self.newTransaction = { amount: 0, counter: 1 };

      let form = displayTransactionForm();
      view.append(back,form);
      $("#mainPage").append(view);

      initFormHandlers();

      function displayTransactionForm() {
         let cont = $("<div id=transaction_form class='view form'></div>");
         let header = $("<div id=header>"+taskStrings.newTransaction+"</div>");
         let content = $("<div id=content></div>");

         let html = "";

         const fields = ["sender","recipient","amount","counter","signature","bakerFee"]

         for(let field of fields){
            html += "<p class=field>"+taskStrings[field];
            switch(field){
            case "sender":
            case "recipient":
               html += "<select id=select_"+field+" class=input ><option value=''>--</option>";
               for(let iA = 0; iA < self.nbCreatedAccounts; iA++){
                  let dat = self.accounts[iA];
                  if(field == "sender" && dat.owner > 0){
                     continue;
                  }
                  html += "<option value="+iA+" "+((self.newTransaction[field] == iA) ? "selected" : "")+">"+dat.alias+"</option>";
               }
               html += "</select>";
               break;
            case "amount":
               html += "<input type=text id=amount class=input value="+self.newTransaction[field]+" />";
               break;
            case "counter":
               html += "<input type=number min=1 id=counter class=input  value="+self.newTransaction[field]+" />";
               break;
            case "signature":
               html += "<button id=sign>"+taskStrings.sign+"</button>";
               break;
            case "bakerFee":
               self.newTransaction.gas = defaultGasCostPerTransaction;
               let fee = self.newTransaction.gas*gasCostPerUnit + feeConstant;
               self.newTransaction.bakerFee = fee;
               html += "<span id=fee>"+fee+"Tez</span>";
            }
            html += "</p>";
         }
         html += "<div id=buttons ><button id=simulate>"+taskStrings.simulate+"</button><button id=cancel>"+taskStrings.cancel+"</button></div>";
         content.append(html);
         cont.append(header,content);
         return cont
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
         $("#amount").on("keyup",function() {
            displayError("");
            let val = this.value
            if(isNaN(val)){
               $(this).addClass("highlight");
            }else{
               $(this).removeClass("highlight");
            }
            self.newTransaction.amount = Number(val);
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
         self.newTransaction.signed = true;
         $("#sign").off("click");
         $("#sign").css("cursor","auto");
         $("#sign").attr("disabled","true");
         $("#sign").text(taskStrings.signed);
      };

      function simulate() {
         if(!isTransactionValid())
            return
         self.newTransaction.storage = 0;
         viewTransaction(null,true)();
      };
      
      function isTransactionValid() {
         let dat = self.newTransaction;
         // console.log(dat)
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
         if(!dat.amount || isNaN(dat.amount) || dat.amount < 0){
            displayError(taskStrings.wrongAmount);
            $("#amount").addClass("highlight");
            return false
         }
         let acc = self.accounts[dat.sender];
         // console.log(acc.balance,dat.amount,acc.balance < dat.amount);
         if(acc.balance < dat.amount){
            displayError(taskStrings.amountTooHigh(acc.balance));
            $("#amount").addClass("highlight");
            return false
         }
         if(dat.counter != acc.transactionNum + 1){
            displayError(taskStrings.wrongCounter(acc.transactionNum));
            $("#counter").addClass("highlight");
            return false
         }
         if(!dat.signed){
            displayError(taskStrings.signatureMissing);
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
      let sID = trans.sender;
      let rID = trans.recipient;
      let amo = trans.amount;
      accounts[sID].balance -= amo;
      accounts[rID].balance += amo;
      accounts[sID].transactionNum++;
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
         if(totGas + trans.gas > blockSize){
            continue;
         }
         blockTrans.push(id);
         deleted.push(id);
         applyTransaction(id);
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
         let acc = accounts[sID];
         if(acc.transactionNum != trans.counter - 1)
            return false
         if(acc.balance < trans.amount)
            return false
         return true
      };
   };

   function updateAccountsTable() {
      let colKeys = ["address", "balance"];

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
      let colKeys = ["sender","amount","recipient"];

      for(let row = 1; row <= mempoolLength; row++){
         let id = self.mempool[row - 1];
         for(let col = 0; col < colKeys.length; col++){
            let entry = "";
            if(id != undefined){
               let trans = self.transactions[id];
               let key = colKeys[col];
               if(key == "sender" || key == "recipient"){
                  let accID = trans[key];
                  // console.log(accID)
                  entry = accounts[accID].alias;
               }else{
                  entry = trans[key];
               }
               // console.log(entry)
            }
            $("#mem_pool_table .row_"+row+" .col_"+col).html(entry);
         }
      }
   };

   function updateTransactionTable() {
      $("#transaction_table tr:not(.row_0)").remove();

      let colKeys = ["sender","amount","recipient"];

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
            for(let key of colKeys){
               let entry = "";
               if(key == "sender" || key == "recipient"){
                  entry = accounts[t[key]].alias;
               }else{
                  entry = t[key];
               }
               html += "<td>"+entry+"</td>";
            }
            html += "<td></td></tr>";
            $("#transaction_table .row_"+row).off("click");
            $("#transaction_table .row_"+row).on("click",viewTransaction(t));
            $("#transaction_table .row_"+row).css("cursor","pointer");
            row++;
         }
      }
      if(row <= transactionTableLength){
         for(let r = row; r <= transactionTableLength; r++){
            html += "<tr class=row_"+r+">";
            for(let col = 0; col <= colKeys.length; col++){
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

   function deleteView(sim) {
      return function() {
         // console.log("deleteView",sim);
         displayError("");
         if(sim){
            $("#simView, #simBack").remove();
         }else{
            $("#view, #back, #simView, #simBack").remove();
         }
      }
   };

   function displayError(msg) {
      displayHelper.displayError(msg);
   };

};