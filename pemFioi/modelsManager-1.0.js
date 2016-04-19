(function() {
'use strict';

var objectHasProperties = function(object) {
   for (var iProperty in object) {
      return true;
   }
   return false;
};

var removeFromArrayByKey = function(arrayFrom, key, itemID) {
  var itemIndex = undefined;
  for (var iItem = 0; iItem < arrayFrom.length; iItem++) {
     if (arrayFrom[iItem][key] === itemID) {
        itemIndex = iItem;
        break;
     }
  }
  if (itemIndex !== undefined) {
     arrayFrom.splice(itemIndex, 1);
  }
};

window.ModelsManager = {
   models: null,
   counts: {},
   curData: {},
   oldData: {},
   listeners: {
      deleted:  {},
      updated:  {},
      inserted: {}
   },
   safeListeners: {
      deleted:  {},
      updated:  {},
      inserted: {}
   },
   safeListenersRecords: {
      deleted:  {},
      updated:  {},
      inserted: {}
   },
   indexes: {},
   toSort: {},
   toSortTimer: null,
   initDone: false,

   init: function(models) {
      this.models = models;
      for (var modelName in models) {
         this.curData[modelName] = {};
         this.oldData[modelName] = {};
         this.listeners.deleted[modelName] = {};
         this.listeners.updated[modelName] = {};
         this.listeners.inserted[modelName] = {};
         this.safeListeners.deleted[modelName] = {};
         this.safeListeners.updated[modelName] = {};
         this.safeListeners.inserted[modelName] = {};
         this.safeListenersRecords.deleted[modelName] = [];
         this.safeListenersRecords.updated[modelName] = [];
         this.safeListenersRecords.inserted[modelName] = [];
         var indexes = models[modelName].indexes;
         if (indexes != undefined) {
            for (var iIndex = 0; iIndex < indexes.length; iIndex++) {
               var index = indexes[iIndex];
               this.indexes[index.name] = {};
            }
         }
      }
      this.initDone = true;
   },

   addListener: function(modelName, listenerType, id, callback, safe) {
      this[safe ? 'safeListeners' : 'listeners'][listenerType][modelName][id] = callback;
   },

   removeListener: function(modelName, listenerType, id) {
      delete this.listeners[listenerType][modelName][id];
      delete this.safeListeners[listenerType][modelName][id];
   },

   invokeUpdatedListeners: function(modelName, curRecord, oldRecord) {
      var listeners = this.listeners.updated[modelName];
      for (var iListener in listeners) {
         var listener = listeners[iListener];
         listener(curRecord, oldRecord);
      }
      if (this.listeners.safe_updated != {}) { // ugly, but cannot use getOwnPropertyNames().length
         this.safeListenersRecords.updated[modelName].push([curRecord, oldRecord]);
      }
   },

   invokeInsertedListeners: function(modelName, curRecord) {
      var listeners = this.listeners.inserted[modelName];
      for (var iListener in listeners) {
         var listener = listeners[iListener];
         listener(curRecord);
      }
      if (this.listeners.safe_inserted != {}) {
         this.safeListenersRecords.inserted[modelName].push(curRecord);
      }
   },

   invokeDeletedListeners: function(modelName, oldRecord) {
      var listeners = this.listeners.deleted[modelName];
      for (var iListener in listeners) {
         var listener = listeners[iListener];
         listener(oldRecord);
      }
      if (this.listeners.safe_deleted != {}) {
         this.safeListenersRecords.deleted[modelName].push(oldRecord);
      }
   },

   invokeSafeListeners: function(listenerType, modelName) {
      var listeners = this.safeListeners[listenerType][modelName];
      for (var iListener in listeners) {
         var listener = listeners[iListener];
         var records = this.safeListenersRecords[listenerType][modelName];
         for (var iRecordSet=0 ; iRecordSet < records.length ; iRecordSet++ ) {
            var recordSet = records[iRecordSet];
            if (listenerType == 'updated') {
               listener(recordSet[0], recordSet[1]);
            } else {
               listener(recordSet);
            }
         }
      }
   },

   invokeAllSafeListeners: function() {
      for (var listenerType in this.safeListenersRecords) {
         for (var modelName in this.safeListeners[listenerType]) {
            this.invokeSafeListeners(listenerType, modelName);
            this.safeListenersRecords[listenerType][modelName] = [];
         }
      }
   },

   markToSort: function(modelName, ID, arrayName, orderBy) {
      if (orderBy == undefined) {
         return;
      }
      if (this.toSort[modelName] == undefined) {
         this.toSort[modelName] = {};
      }
      if (this.toSort[modelName][ID] == undefined) {
         this.toSort[modelName][ID] = {};
      }
      this.toSort[modelName][ID][arrayName] = orderBy;
      if (this.toSortTimer == null) {
         this.toSortTimer = setTimeout(this.sortAllMarked, 10);
      }
   },

   sortAllMarked: function() {
      var sortHandlerFactory = function(orderBy) {
         return function(itemA, itemB) {
            if (itemA[orderBy] < itemB[orderBy]) {
               return -1;
            }
            if (itemA[orderBy] > itemB[orderBy]) {
               return 1;
            }
            return 0;
         };
      };
      for (var modelName in ModelsManager.toSort) {
         for (var ID in ModelsManager.toSort[modelName]) {
            if (ModelsManager.curData[modelName][ID] == null) {
               continue;
            }
            for (var arrayName in ModelsManager.toSort[modelName][ID]) {
               var orderBy = ModelsManager.toSort[modelName][ID][arrayName];
               ModelsManager.curData[modelName][ID][arrayName].sort(sortHandlerFactory(orderBy));
            }
         }
      }
      ModelsManager.toSort = {};
      ModelsManager.toSortTimer = clearTimeout(ModelsManager.toSortTimer);
   },

   getPrimaryKey: function(modelName) {
      var model = this.models[modelName];
      if (typeof model.primaryKey === 'undefined') {
         return "ID";
      }
      return model.primaryKey;
   },

   getRecords: function(modelName) {
      return this.curData[modelName];
   },
   getRecord: function(modelName, ID) {
      return this.curData[modelName][ID];
   },
   getContainerByIndex: function(modelName, indexName, indexValues) {
      var curContainer = this.indexes[indexName];
      for (var iValue = 0; iValue < indexValues.length; iValue++) {
        var value = indexValues[iValue];
        if (curContainer == undefined) {
           return undefined;
        }
        curContainer = curContainer[value];
      }
      return curContainer;
   },
   getRecordByIndex: function(modelName, indexName, indexValues) {
      var curContainer = this.getContainerByIndex(modelName, indexName, indexValues);
      if (curContainer == undefined) {
         return undefined;
      }
      return this.getRecord(modelName, curContainer);
   },
   getRecordsByIndex: function(modelName, indexName, indexValues) {
      var curContainer = this.getContainerByIndex(modelName, indexName, indexValues);
      if (curContainer == undefined) {
         return undefined;
      }
      var records = [];
      for (var key in curContainer) {
         records.push(this.getRecord(modelName, curContainer[key]));
      }
      return records;
   },
   getRandomID: function() {
      var low = Math.floor(Math.random() * 922337203).toString();
      var high = Math.floor(Math.random() * 2000000000).toString();
      return high + low;
   },
   createRecord: function(modelName) {
      var model = this.models[modelName];
      var record = {};
      var primaryKey = this.getPrimaryKey(modelName);
      record[primaryKey] = this.getRandomID();
      for(var fieldName in model.fields) {
         var field = model.fields[fieldName];
         var fieldValue = null;
         if (field.defaultValue !== undefined) {
            fieldValue = field.defaultValue;
         }
         record[fieldName] = fieldValue;
      }
      return record;
   },
   createRecordPlaceholder: function(modelName, ID) {
      var primaryKey = this.getPrimaryKey(modelName);
      var newRecord = {};
      newRecord[primaryKey] = ID;
      this.curData[modelName][ID] = newRecord;
      this.setupRecordLinks(modelName, ID);
   },
   setupRecordLinks: function(modelName, ID, debug) {
      var model = this.models[modelName];
      var curRecord = this.curData[modelName][ID];
      for (var linkName in model.links) {
         var link = model.links[linkName];
         if (curRecord[linkName] != undefined) {
            return; // Nothing to do, links are already there
         }
         if ((link.type == "object") || (link.type == "object_list")) {
            curRecord[linkName] = {};
         } else if (link.type == "array") {
            curRecord[linkName] = [];
         }
      }
      if (debug) {
         console.error(curRecord);
      }
   },
   hasRecordChanged: function(modelName, ID) {
      var model = this.models[modelName];
      var oldRecord = this.oldData[modelName][ID];
      var curRecord = this.curData[modelName][ID];
      if (!curRecord || !oldRecord) {
         return true;
      }
      for(var fieldName in model.fields) {
         if (oldRecord[fieldName] !== curRecord[fieldName]) {
            return true;
         }
      }
      return false;
   },
   resetRecordChanges: function(modelName, ID) {
      var model = this.models[modelName];
      var oldRecord = this.oldData[modelName][ID];
      var curRecord = this.curData[modelName][ID];
      if (!oldRecord || !curRecord) {
         return;
      }
      for(var fieldName in model.fields) {
         curRecord[fieldName] = oldRecord[fieldName];
      }
   },
   // Delete the reference to oldRecord in the object referenced by a the oldValue of a given field of this old record
   deleteLinkFromRefRecord: function(field, oldRecord, oldValue) {
      var refModel = this.models[field.refModel];
      var link = refModel.links[field.invLink];
      var primaryKey = this.getPrimaryKey(link.refModel);
      if ((link.type == "object") || (link.type == "object_list")) {
         var index = primaryKey;
         if (link.index != undefined) {
            index = link.index;
         }
         var oldIndex = oldRecord[index];
         if ((oldValue != null) && (oldIndex != null)) {
            var refRecordLink = this.curData[field.refModel][oldValue][field.invLink];
            this.deleteLinkFromRefRecordByIndex(link, refRecordLink, oldIndex, oldRecord[primaryKey]);
         }
      }
      if (link.type == "array") {
         if (oldValue != null) {
            var refRecord = this.curData[field.refModel][oldValue];
            if (refRecord != undefined) {
               removeFromArrayByKey(refRecord[field.invLink], primaryKey, oldRecord[primaryKey]);
            }
         }
      }
      if (oldValue != null) {
         this.deleteIfNoLink(field.refModel, oldValue);
      }
   },
   // we delete any reference to a record of ID linkID from the container refRecordLink, possibly at index oldIndex in this container
   // refLink is the link object that describes the relation
   deleteLinkFromRefRecordByIndex: function(refLink, refRecordLink, oldIndex, linkID) {
      var primaryKey = this.getPrimaryKey(refLink.refModel);
      if (refRecordLink[oldIndex] == undefined) { // May already have been moved because of another field
         return;
      }
      if ((refLink.type == "object") && (refRecordLink[oldIndex][primaryKey] == linkID)) {
         delete refRecordLink[oldIndex];
      }
      else if (refLink.type == "object_list") {
         removeFromArrayByKey(refRecordLink[oldIndex], primaryKey, linkID);
         if (refRecordLink[oldIndex].length == 0) {
            delete refRecordLink[oldIndex];
         }
      }
   },
   insertLinkIntoRefRecordByIndex: function(refLink, refRecordLink, curIndex, curRecord) {
      if (refLink.type == "object") {
         refRecordLink[curIndex] = curRecord;
      }
      else if (refLink.type == "object_list") {
         if (refRecordLink[curIndex] == undefined) {
            refRecordLink[curIndex] = [];
         }
         refRecordLink[curIndex].push(curRecord);
      }
   },
   insertLinkIntoRefRecord: function(field, curRecord, curValue) {
      var refModel = this.models[field.refModel];
      var link = refModel.links[field.invLink];
      var refRecord;
      if ((link.type == "object") || (link.type == "object_list")) {
         var primaryKey = this.getPrimaryKey(link.refModel);
         var index = primaryKey;
         if (link.index != undefined) {
            index = link.index;
         }
         var curIndex = curRecord[index];
         if ((curValue != null) && (curIndex != null)) {
            if (this.curData[field.refModel][curValue] == undefined) {
               this.createRecordPlaceholder(field.refModel, curValue);
            }
            refRecord = this.curData[field.refModel][curValue];
            var refRecordLink = refRecord[field.invLink];
            this.insertLinkIntoRefRecordByIndex(link, refRecordLink, curIndex, curRecord);
         }
      }
      if (link.type == "array") {
         if ((curValue != null) && (curValue != "0")) {
            if (this.curData[field.refModel][curValue] == undefined) {
               this.createRecordPlaceholder(field.refModel, curValue);
            }
            refRecord = this.curData[field.refModel][curValue];
            refRecord[field.invLink].push(curRecord);
            var orderBy = ModelsManager.models[field.refModel].links[field.invLink].orderBy;
            this.markToSort(field.refModel, curValue, field.invLink, orderBy);
         }
      }
   },
   deleted: function(modelName, ID) {
      var model = this.models[modelName];
      var oldRecord = this.oldData[modelName][ID];
      if (oldRecord == null) {
         console.log("trying to delete inexistant record " + modelName + "[" + ID + "]");
         return;
      }
      var curRecord = this.curData[modelName][ID];
      if (curRecord != null) {
         curRecord.reallyInserted = false;
      }
      for(var fieldName in model.fields) {
         var field = model.fields[fieldName];
         var oldValue = oldRecord[fieldName];
         if (oldValue != null) {
            if (field.invLink != undefined) {
               this.deleteLinkFromRefRecord(field, oldRecord, oldValue);
            }
         }
         //curRecord[fieldName] = null;
      }
      this.deleteIndexes(modelName, oldRecord);
      this.invokeDeletedListeners(modelName, oldRecord);
      if (typeof SyncQueue !== 'undefined') {
         SyncQueue.addObject(modelName, oldRecord, SyncQueue.actionDelete);
      }
      delete this.oldData[modelName][ID];
      delete this.curData[modelName][ID];
      // We don't delete the record, it becomes a placeholder
   },
   deleteIfNoLink: function(modelName, ID) {
      var model = this.models[modelName];
      var curRecord = this.curData[modelName][ID];
      if ((curRecord == null) || (curRecord.reallyInserted)) {
         return;
      }
      for (var linkName in model.links) {
         var link = model.links[linkName];
         if (curRecord[linkName] != undefined) {
            var linkData = curRecord[linkName];
            if (link.type == "array") {
               if (linkData.length > 0) {
                  return;
               }
            } else if ((link.type == "object") || (link.type == "object_list")) {
               if (objectHasProperties(linkData)) {
                  return;
               }
            }
         }
      }
      delete this.curData[modelName][ID];
   },
   reinit: function() {
      if (!this.initDone) {
         console.error('reinitializing uninitialized ModelsManager');
         return;
      }
      for (var modelName in this.models) {
         if (modelName == 'groups_groups') {
            console.error('reinitialize groups_groups');
         }
         for (var recordID in this.curData[modelName]) {
            this.invokeDeletedListeners(modelName, this.curData[modelName][recordID]);
         }
         this.curData[modelName] = {};
         this.oldData[modelName] = {};
         var indexes = models[modelName].indexes;
         if (indexes != undefined) {
            for (var iIndex = 0; iIndex < indexes.length; iIndex++) {
               var index = indexes[iIndex];
               this.indexes[index.name] = {};
            }
         }
      }
   },
   inserted: function(modelName, ID) {
      var reallyInserted = false;
      if (this.oldData[modelName][ID] == undefined) {
         reallyInserted = true;
         var newRecord = {};
         var primaryKey = this.getPrimaryKey(modelName);
         newRecord[primaryKey] = ID;
         this.oldData[modelName][ID] = newRecord;
         this.setupRecordLinks(modelName, ID);
      }
      this.curData[modelName][ID].reallyInserted = true;
      this.updated(modelName, ID, reallyInserted);
   },
   updated: function(modelName, ID, inserted, delaySync) {
      var model = this.models[modelName];
      var primaryKey = this.getPrimaryKey(modelName);
      var oldRecord = this.oldData[modelName][ID];
      var curRecord = this.curData[modelName][ID];
      if (!oldRecord || !curRecord) {
         console.error('trying to update inexistant ID '+ID+' in model '+modelName);
         return;
      }
      var fieldName;
      for(fieldName in model.fields) {
         var field = model.fields[fieldName];
         var curValue = curRecord[fieldName];
         var oldValue = oldRecord[fieldName];
         var refModel = null;
         var forceRecompute = false;
         if (field.refModel != undefined) {
            refModel = this.models[field.refModel];
            if (field.invLink != undefined) {
               var invLinkIndex = this.models[field.refModel].links[field.invLink].index;
               if (invLinkIndex != undefined) {
                  if (curRecord[invLinkIndex] != oldRecord[invLinkIndex]) {
                     forceRecompute = true;
                     // the value of the key may not have changed, but the value for the field that serves as an index
                     // in the refRecord has changed, so we need to recompute
                  }
               }
            }
         }
         if ((oldValue !== curValue) || forceRecompute) {
            if ((field.link != undefined) && (curValue != null)) {
               if (this.curData[field.refModel][curValue] == undefined) {
                  this.createRecordPlaceholder(field.refModel, curValue);
               }
               curRecord[field.link] = this.curData[field.refModel][curValue];
            }
            if (field.indexForLinks != undefined) {
               for (var iLink = 0; iLink < field.indexForLinks.length; iLink++) {
                  var indexForLink = field.indexForLinks[iLink];
                  var refLink = this.models[indexForLink.refModel].links[indexForLink.invLink];
                  var linkID = curRecord[indexForLink.key];
                  var refRecordLink = this.curData[indexForLink.refModel][linkID][indexForLink.invLink];
                  if (oldValue != null) {
                     this.deleteLinkFromRefRecordByIndex(refLink, refRecordLink, oldValue, curRecord[primaryKey]);
                  }
                  if (curValue != null) {
                     if (refLink.type == "object") {
                        refRecordLink[curValue] = curRecord;
                     }
                     else if (refLink.type == "object_list") {
                        if (refRecordLink[curValue] == undefined) {
                           refRecordLink[curValue] = [];
                        }
                        refRecordLink[curValue].push(curRecord);
                     }
                  }
               }
            }
            if (field.invLink != undefined) {
               this.deleteLinkFromRefRecord(field, oldRecord, oldValue);
               this.insertLinkIntoRefRecord(field, curRecord, curValue);
            }
         }
      }
      if (!inserted) {
         this.deleteIndexes(modelName, oldRecord);
      }
      this.insertIndexes(modelName, curRecord);
      var copyOldRecord = {};
      for(fieldName in model.fields) {
         copyOldRecord[fieldName] = oldRecord[fieldName];
         oldRecord[fieldName] = curRecord[fieldName];
      }
      if (inserted) {
         if (typeof SyncQueue !== 'undefined') {
            SyncQueue.addObject(modelName, curRecord, SyncQueue.actionInsert, delaySync);
         }
         this.invokeInsertedListeners(modelName, curRecord);
      } else {
         if (typeof SyncQueue !== 'undefined') {
            SyncQueue.addObject(modelName, curRecord, SyncQueue.actionUpdate, delaySync);
         }
         this.invokeUpdatedListeners(modelName, curRecord, copyOldRecord);
      }
   },
   insertIndexes: function(modelName, record) {
      var primaryKey = this.getPrimaryKey(modelName);
      var indexes = this.models[modelName].indexes;
      if (indexes != undefined) {
         for (var iIndex = 0; iIndex < indexes.length; iIndex++) {
            var index = indexes[iIndex];
            var curContainer = this.indexes[index.name];
            for (var iKey = 0; iKey < index.keys.length - 1; iKey++) {
               var key = index.keys[iKey];
               var value = record[key];
               if (curContainer[value] == undefined) {
                  curContainer[value] = {};
               }
               curContainer = curContainer[value];
            }
            if (index.values) {
               if (!curContainer[record[index.keys[index.keys.length - 1]]]) {
                  curContainer[record[index.keys[index.keys.length - 1]]] = {};
               }
               curContainer[record[index.keys[index.keys.length - 1]]][record[index.values]] = true;
            } else {
               curContainer[record[index.keys[index.keys.length - 1]]] = record[primaryKey];
            }
         }
      }
   },

   deleteIndexes: function(modelName, record) {
      var indexes = this.models[modelName].indexes;
      if (indexes != undefined) {
         for (var iIndex = 0; iIndex < indexes.length; iIndex++) {
            var index = indexes[iIndex];
            var curContainer = this.indexes[index.name];
            for (var iKey = 0; iKey < index.keys.length - 1; iKey++) {
               var key = index.keys[iKey];
               var value = record[key];
               curContainer = curContainer[value];
            }
            if (index.values) {
               delete curContainer[record[index.keys[index.keys.length - 1]]][record[index.values]];
            } else {
               curContainer[record[index.keys[index.keys.length - 1]]] = undefined;
            }
         }
      }
   },

   deleteRecord: function(modelName, ID, requestSetName) {
      var record = this.curData[modelName][ID];
      if (!record || !requestSetName || !record.requestSets) {
         this.deleted(modelName, ID);
         return;
      }
      var requestSets = record.requestSets;
      if (requestSets[requestSetName]) {
         delete requestSets[requestSetName];
         if (!objectHasProperties(requestSets)) {
            this.deleted(modelName, ID);
         }
      }
   },
   insertRecord: function(modelName, record) {
      var primaryKey = this.getPrimaryKey(modelName);
      var ID = record[primaryKey];
      this.curData[modelName][ID] = record;
      this.inserted(modelName, ID);
   },
   insertFromRowOfStrings: function(modelName, row, requestSetName) {
      var primaryKey = this.getPrimaryKey(modelName);
      var ID = row[primaryKey];
      if (!this.curData[modelName][ID]) {
         var record = {};
         record[primaryKey] = ID;
         this.curData[modelName][ID] = record;
         this.innerUpdateFromRowOfStrings(modelName, row, requestSetName);
      } else if (!this.curData[modelName][ID].reallyInserted) {
         this.innerUpdateFromRowOfStrings(modelName, row, requestSetName);
      }
      this.inserted(modelName, ID);
   },
   updateFromRowOfStrings: function(modelName, row, requestSetName) {
      var primaryKey = this.getPrimaryKey(modelName);
      var ID = row[primaryKey];
      this.innerUpdateFromRowOfStrings(modelName, row, requestSetName);
      this.updated(modelName, ID);
   },
   getJSDateTimeFromSQLDateTime: function(stringValue) {
      var t = stringValue.split(/[- :]/);
      return new Date(t[0], t[1]-1, t[2], t[3]||0, t[4]||0, t[5]||0);
   },
   updateDateDiffWithServer: function(strServerDateTime) {
      if (this.timeAdvanceOfServer != undefined) {
         return;
      }
      var serverDateTime = new Date(ModelsManager.getJSDateTimeFromSQLDateTime(strServerDateTime));
      this.timeAdvanceOfServer = serverDateTime - new Date();
   },
   now: function() {
      var now = new Date();
      return new Date(now.getTime() + ModelsManager.timeAdvanceOfServer);
   },
   innerUpdateFromRowOfStrings: function(modelName, row, requestSetName) {
      var primaryKey = this.getPrimaryKey(modelName);
      var ID = row[primaryKey];
      var record = this.curData[modelName][ID];
      var model = this.models[modelName];
      if (requestSetName) {
         if (!record.requestSets) {
            record.requestSets = {};
         }
         record.requestSets[requestSetName] = true;
      }
      for(var fieldName in model.fields) {
         var field = model.fields[fieldName];
         var stringValue = row[fieldName];
         var newValue = null;
         if (stringValue || (field.type == "point")) {
            switch (field.type) {
               case "double":
               case "float":
                  newValue = parseFloat(stringValue);
                  break;
               case "int":
                  newValue = parseInt(stringValue);
                  break;
               case "boolean":
                  newValue = parseInt(stringValue) ? true : false;
                  break;
               case "date":
               case "jsdatetime":
               case "jsdate":
                  if (stringValue != "0000-00-00 00:00:00") {
                     newValue = this.getJSDateTimeFromSQLDateTime(stringValue);
                  }
                  if ((field.type == "jsdate") || (field.type == "jsdatetime") || (field.type == "jstime")) {
                     newValue = new Date(newValue);
                  }
                  break;
               case "jstime":
                  newValue = Date.parse("01/01/2000 " + stringValue);
                  newValue = new Date(newValue);
                  break;
               case "point":
                  if ((stringValue === null) || (stringValue === "")) {
                     newValue = {x:null, y:null};
                  } else {
                     var values = stringValue.split("(")[1].split(")")[0].split(" ");
                     newValue = {x:values[0], y:values[1]};
                  }
                  break;
//               case "string":
//               case "text":
//               case "email":
//               case "file":
//               case "enum":
//               case "key":
               default:
                  newValue = stringValue;
                  break;
            }
         }
         record[fieldName] = newValue;
      }
   },
   dateToSql: function(d) {
      return !d ? null : d.getFullYear() +
         "-" + ("0" + (d.getMonth() + 1)).slice(-2) +
         "-" + ("0" + d.getDate()).slice(-2) +
         " " + ("0" + d.getHours()).slice(-2) +
         ":" + ("0" + d.getMinutes()).slice(-2) +
         ":" + ("0" + d.getSeconds()).slice(-2);
   },
   timeToSql: function(d) {
      return  !d ? null : ("0" + d.getHours()).slice(-2) +
         ":" + ("0" + d.getMinutes()).slice(-2) +
         ":" + ("0" + d.getSeconds()).slice(-2);
   },
   convertToSql: function(modelName, object) {
      var record = {};
      var model = this.models[modelName];
      for(var fieldName in model.fields) {
         var field = model.fields[fieldName];
         if (field.readOnly) {
            // maybe not the best place to handle that, but at least it requires
            // very few code
            continue;
         }
         var curValue = object[fieldName];
         var stringValue = null;
         if (curValue != null) {
            switch(field.type) {
               case "double":
               case "float":
               case "int":
                  stringValue = "" + curValue;
                  break;
               case "boolean":
                  if (curValue) {
                     stringValue = "1";
                  } else {
                     stringValue = "0";
                  }
                  break;
               case "date":
               case "datetime":
               case "time":
                     var d = new Date();
                     d.setTime(curValue);
                     stringValue = ModelsManager.dateToSql(d);
                  break;
               case "jsdate":
               case "jsdatetime":
                  stringValue = ModelsManager.dateToSql(curValue);
               break;
               case "jstime":
                  stringValue = ModelsManager.timeToSql(curValue);
               break;
               case "point":
                  if ((curValue.x == null) || (curValue.y == null)) {
                     stringValue = null;
                  } else {
                     stringValue = "POINT(" + curValue.x + " " + curValue.y + ")";
                  }
               break;
//               case "string", "text", "email", "file", "enum", "key"
               default:
                  stringValue = curValue;
                  break;
            }
         }
         record[fieldName] = stringValue;
      }
      return record;
   },
   copyObject: function(modelName, object) {
      var model = this.models[modelName];
      var copy = {};
      for(var fieldName in model.fields) {
         copy[fieldName] = object[fieldName];
      }
      return copy;
   },
   // just create links for a record (used for unsynced records)
   setLinks: function(modelName, record) {
      this.setupRecordLinks(modelName, record.ID);
      var model = models[modelName];
      for (var fieldName in model.fields) {
         var field = model.fields[fieldName];
         if (field.link && record[fieldName])  {
            if (!this.curData[field.refModel][record[fieldName]]) {
               this.createRecordPlaceholder(field.refModel, record[fieldName]);
            }
            record[field.link] = this.curData[field.refModel][record[fieldName]];
         }
         if (field.indexForLinks) {
            for (var iLink = 0; iLink < field.indexForLinks.length; iLink++) {
               var indexForLink = field.indexForLinks[iLink];
               var refLink = this.models[indexForLink.refModel].links[indexForLink.invLink];
               var linkID = record[indexForLink.key];
               var refRecordLink = this.curData[indexForLink.refModel][linkID][indexForLink.invLink];
               if (record[fieldName]) {
                  if (refLink.type == "object") {
                     refRecordLink[record[fieldName]] = record;
                  }
                  else if (refLink.type == "object_list") {
                     if (!refRecordLink[record[fieldName]]) {
                        refRecordLink[record[fieldName]] = [];
                     }
                     refRecordLink[record[fieldName]].push(record);
                  }
               }
            }
         }
         if (field.invLink) {
            this.insertLinkIntoRefRecord(field, record, record[fieldName]);
         }
      }
      this.insertIndexes(modelName, record);
      // console.error(record);
   }

};

})();
