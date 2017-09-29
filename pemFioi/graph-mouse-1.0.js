function GraphMouse(graphMouseID, graph, visualGraph) {
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.priority = 2000;

   /* ID -> {elementID: ID of vertex or edge,
   *         eventType: a mouse event type string,
    *        callbacks: list of functions to call,
    *        raphaels: list of Raphael objects
    *        }
    */
   this.specificListeners = {};

   /* ID -> {eventType: a mouse event type string,
    *        callbacks: list of functions to call,
    *        handleGetter: getter of Raphaels
    *        }
    */
   this.globalVertexListeners = {};
   this.globalEdgeListeners = {};

   // Vertex or edge ID -> {Specific listener ID 1, Specific listener ID 2, ...}
   this.elementListeners = {};
   var self = this;

   this.addEvent = function(listenerID, eventType, elementType, elementID, callbacks, handleGetter) {
      if(this.globalVertexListeners[listenerID] || this.globalEdgeListeners[listenerID] || this.specificListeners[listenerID]) {
         return;
      }
      if(elementID !== undefined && elementID !== null) {
         var raphaels = this._addElementEvent(eventType, elementType, elementID, callbacks, handleGetter);
         specificListeners[listenerID] = {
            elementID: elementID,
            eventType: eventType,
            raphaels: raphaels,
            callbacks: callbacks
         };
         if(!this.elementListeners[elementID]) {
            this.elementListeners[elementID] = {};
         }
         this.elementListeners[elementID][listenerID] = true;
      }
      else {
         var listenerInfo = {
            eventType: eventType,
            callbacks: callbacks,
            handleGetter: handleGetter
         };

         var elementIDs;
         if(elementType == "vertex") {
            elementIDs = this.graph.getAllVertices();
            this.globalVertexListeners[listenerID] = listenerInfo;
         }
         else {
            elementIDs = this.graph.getAllEdges();
            this.globalEdgeListeners[listenerID] = listenerInfo;
         }
         for(var iElementID in elementIDs) {
            var id = elementIDs[iElementID];
            this._addElementEvent(eventType, elementType, id, callbacks, handleGetter);
         }

      }
   };

   this._addElementEvent = function(eventType, elementType, elementID, callbacks, handleGetter) {
      var raphaels = this._getRaphaels(elementType, elementID, handleGetter);
      for(var iElement in raphaels) {
         var element = raphaels[iElement];
         element[eventType].apply(element, callbacks);
      }
      return raphaels;
   };

   this.removeEvent = function(listenerID) {
      if(this.globalVertexListeners[listenerID]) {
         this._removeGlobalEvent("vertex", listenerID);
      }
      else if(this.globalEdgeListeners[listenerID]) {
         this._removeGlobalEvent("edge", listenerID);
      }
      else if(this.specificListeners[listenerID]){
         this._removeSpecificEvent(listenerID);
      }
   };

   this._removeGlobalEvent = function(elementType, listenerID) {
      var listenerInfo;
      var elementIDs;
      if(elementType == "vertex") {
         listenerInfo = this.globalVertexListeners[listenerID];
         delete this.globalVertexListeners[listenerID];
         elementIDs = this.graph.getAllVertices();
      }
      else {
         listenerInfo = this.globalEdgeListeners[listenerID];
         delete this.globalEdgeListeners[listenerID];
         elementIDs = this.graph.getAllEdges();
      }
      for(var iElementID in elementIDs) {
         var elementID = elementIDs[iElementID];
         var raphaels = this._getRaphaels(elementType, elementID, listenerInfo.handleGetter);
         this._removeElementsEvent(raphaels, listenerInfo.eventType, listenerInfo.callbacks);
      }
   };

   this._removeSpecificEvent = function(listenerID) {
      var elementID = this.specificListeners[listenerID].elementID;
      var eventType = this.specificListeners[listenerID].eventType;
      var raphaels = this.specificListeners[listenerID].raphaels;
      var callbacks = this.specificListeners[listenerID].callbacks;
      this._removeElementsEvent(raphaels, eventType, callbacks);
      delete this.specificListeners[listenerID];
      delete this.elementListeners[elementID][listenerID];
   };

   this._getRaphaels = function(elementType, elementID, handleGetter) {
      if(handleGetter) {
         return handleGetter(elementID);
      }
      return this.visualGraph.getRaphaelsFromID(elementID);
   };

   this._removeElementsEvent = function(elements, eventType, callbacks) {
      for(var iElement in elements) {
         var element = elements[iElement];
         element["un" + eventType].apply(element, callbacks);
      }
   };

   this._removeElement = function(id) {
      if(this.elementListeners[id] === undefined || this.elementListeners[id] === null) {
         return;
      }
      for(var iListenerID in this.elementListeners[id]) {
         delete this.specificListeners[this.elementListeners[id][iListenerID]];
      }
      delete this.elementListeners[id];
   };

   this.removeAll = function() {
      var listenerIDs = [];
      var listenerID;
      for(listenerID in this.globalVertexListeners) {
         listenerIDs.push(listenerID);
      }
      for(listenerID in this.globalEdgeListeners) {
         listenerIDs.push(listenerID);
      }
      for(listenerID in this.specificListeners) {
         listenerIDs.push(listenerID);
      }
      for(var iListener in listenerID) {
         this.removeEvent(listenerID[iListener]);
      }
   };

   this.destroy = function() {
      this.graph.removeListener(graphMouseID);
      this.removeAll();
   };

   this.graphListener = {
      addVertex: function(id) {
         for(var listenerID in self.globalVertexListeners) {
            var listenerInfo = self.globalVertexListeners[listenerID];
            self._addElementEvent(listenerInfo.eventType, "vertex", id, listenerInfo.callbacks, listenerInfo.handleGetter);
         }
         return true;
      },
      addEdge: function(id) {
         for(var listenerID in self.globalEdgeListeners) {
            var listenerInfo = self.globalEdgeListeners[listenerID];
            self._addElementEvent(listenerInfo.eventType, "edge", id, listenerInfo.callbacks, listenerInfo.handleGetter);
         }
         return true;
      },
      removeVertex: function(id) {
         self._removeElement(id);
         return true;
      },
      removeEdge: function(id) {
         self._removeElement(id);
         return true;
      }
   };

   this.graph.addPostListener(graphMouseID, this.graphListener, this.priority);
}

function VertexToggler(id, graph, visualGraph, graphMouse, vertexCallback, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.graphMouse = graphMouse;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         graphMouse.addEvent(id, "click", "vertex", null, [this.eventHandler]);
      }
      else {
         graphMouse.removeEvent(id);
      }
   };

   this.eventHandler = function() {
      var id = this.data("id");
      var info = self.graph.getVertexInfo(id);
      info.selected = !info.selected;
      vertexCallback(id, info.selected);
   };

   this._unselectAll = function() {
      var elementIDs = graph.getAllVertices();
      for(var iElementID in elementIDs) {
         var elementID = elementIDs[iElementID];
         var info = this.graph.getVertexInfo(elementID);
         info.selected = false;
      }
   };

   this._unselectAll();
   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function VertexClicker(id, graph, visualGraph, graphMouse, vertexCallback, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.graphMouse = graphMouse;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         graphMouse.addEvent(id, "click", "vertex", null, [this.eventHandler]);
      }
      else {
         graphMouse.removeEvent(id);
      }
   };

   this.eventHandler = function() {
      var id = this.data("id");
      var info = self.graph.getVertexInfo(id);
      vertexCallback(id, info);
   };

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function PaperMouseEvent(paperElementID, paper, jqEvent, callback, enabled) {
   var self = this;
   this.paper = paper;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         $("#" + paperElementID)[jqEvent](this.clickHandler);
      }
      else {
         $("#" + paperElementID).unbind(jqEvent, this.clickHandler);
      }
   };

   this.clickHandler = function(event) {
      var offset = $(self.paper.canvas).offset();
      var xPos = event.pageX - offset.left;
      var yPos = event.pageY - offset.top;
      callback(xPos, yPos, event);
   };

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function VertexDragger(settings) {
   var self = this;
   this.snapEnabled = false;
   this.snapX = null;
   this.snapY = null;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         settings.graphMouse.addEvent(settings.id, "drag", "vertex", null, [this.moveHandler, this.startHandler, this.endHandler], settings.handleGetter);
      }
      else {
         settings.graphMouse.removeEvent(settings.id);
      }
   };

   this.setSnapEnabled = function(enabled, snapX, snapY) {
      this.snapEnabled = enabled;
      if(enabled) {
         this.snapX = snapX;
         this.snapY = snapY;
      }
   };

   this.startHandler = function(x, y, event) {
      self.elementID = this.data("id");
      self.originalPosition = settings.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      settings.visualGraph.elementToFront(self.elementID);
   };

   this.endHandler = function(event) {
      if(settings.callback) {
         settings.callback(self.elementID);
      }
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      var newX = self.originalPosition.x + dx;
      var newY = self.originalPosition.y + dy;
      if(self.snapEnabled) {
         newX -= (newX % self.snapX);
         newY -= (newY % self.snapY);
      }
      settings.visualGraph.graphDrawer.moveVertex(self.elementID, newX, newY);
   };

   if(settings.enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function ElementRemover(id, graph, visualGraph, graphMouse, callback, forVertices, forEdges, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.graphMouse = graphMouse;
   this.enabled = false;
   this.forVertices = forVertices;
   this.forEdges = forEdges;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         if(this.forVertices) {
            graphMouse.addEvent(id + "$$$vertex", "click", "vertex", null, [this.deleteVertex]);
         }
         if(this.forEdges) {
            graphMouse.addEvent(id + "$$$edge", "click", "edge", null, [this.deleteEdge]);
         }
      }
      else {
         if(this.forVertices) {
            graphMouse.removeEvent(id + "$$$vertex");
         }
         if(this.forEdges) {
            graphMouse.removeEvent(id + "$$$edge");
         }
      }
   };

   this.deleteVertex = function() {
      var id = this.data("id");
      self.graph.removeVertex(id);
      if(callback) {
         callback("vertex", id);
      }
   };
   this.deleteEdge = function() {
      var id = this.data("id");
      self.graph.removeEdge(id);
      if(callback) {
         callback("edge", id);
      }
   };

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function EdgeCreator(id, paperElementID, paper, graph, visualGraph, graphMouse, vertexSelector, edgeCreator, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.graphMouse = graphMouse;
   this.paperMouse = new PaperMouseEvent(paperElementID, paper, "click", paperEventHandler, enabled);
   this.enabled = false;
   this.parent = null;
   this.selectedNow = false;

   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         graphMouse.addEvent(id, "click", "vertex", null, [vertexEventHandler]);
      }
      else {
         graphMouse.removeEvent(id);
      }
      this.paperMouse.setEnabled(enabled);
   };

   function vertexEventHandler() {
      var id = this.data("id");
      if(self.parent === null) {
         self.parent = id;
         if(vertexSelector) {
            vertexSelector(id, true);
            self.selectedNow = true;
         }
      }
      else if(id == self.parent) {
         self.parent = null;
         if(vertexSelector) {
            vertexSelector(id, false);
         }
      }
      else {
         if(vertexSelector) {
            vertexSelector(self.parent, false);
         }
         edgeCreator(self.parent, id);
         self.parent = null;
      }
   }

   function paperEventHandler(xPos, yPos, event) {
      // We are relying on the fact that vertex event happens before the paper event, which seems to be the behavior of all browsers.
      // Otherwise the vertex would be selected by the first and immediately deselected by the second.
      if(self.selectedNow || self.parent == null) {
         self.selectedNow = false;
         return;
      }
      if(vertexSelector) {
         vertexSelector(self.parent, false);
      }
      self.parent = null;
   }

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function FuzzyClicker(id, paperElementID, paper, graph, visualGraph, callback, forVertices, forEdges, forBackground, vertexThreshold, edgeThreshold, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.paperMouse = new PaperMouseEvent(paperElementID, paper, "click", eventHandler, enabled);
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      this.paperMouse.setEnabled(enabled);
   };

   function eventHandler(xPos, yPos) {
      // Check if vertex was clicked
      var vertex = self.getFuzzyVertex(xPos, yPos);
      if(vertex !== null) {
         if(forVertices) {
            callback("vertex", vertex, xPos, yPos);
         }
         // Clicking a vertex cancels any other type, regardless of forVertices flag.
         return;
      }

      // Check if edge was clicked.
      var edge = self.getFuzzyEdge(xPos, yPos);
      if(edge !== null) {
         if(forEdges) {
            callback("edge", edge, xPos, yPos);
         }
         // Clicking an edge cancels the click on the background, regardless of forEdges.
         return;
      }

      // Background was clicked.
      if(forBackground) {
         callback(null, null, xPos, yPos);
      }
   }
   
   this.getFuzzyVertex = function(xPos, yPos) {
      // Look for closest vertex.
      var vertex = null;
      var minDistance = Infinity;
      this.graph.forEachVertex(function(id) {
         var distance = visualGraph.graphDrawer.getDistanceFromVertex(id, xPos, yPos);
         if(distance <= vertexThreshold && distance < minDistance) {
            vertex = id;
            minDistance = distance;
         }
      });
      return vertex;
   };
   
   this.getFuzzyEdge = function(xPos, yPos) {
      // Look for closest edge.
      var edge = null;
      var minDistance = Infinity;
      this.graph.forEachEdge(function(id) {
         var distance = visualGraph.graphDrawer.getDistanceFromEdge(id, xPos, yPos);
         if(distance <= edgeThreshold && distance < minDistance) {
            edge = id;
            minDistance = distance;
         }
      });
      return edge;
   };

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function FuzzyRemover(id, paperElementID, paper, graph, visualGraph, callback, forVertices, forEdges, vertexThreshold, edgeThreshold, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.enabled = false;
   this.fuzzyClicker = new FuzzyClicker(id + "$$$fuzzyclicker", paperElementID, paper, graph, visualGraph, deleteElement, forVertices, forEdges, false, vertexThreshold, edgeThreshold, enabled);
   this.forVertices = forVertices;
   this.forEdges = forEdges;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      this.fuzzyClicker.setEnabled(enabled);
   };

   function deleteElement(elementType, id, xPos, yPos) {
      if(elementType == "vertex") {
         self.graph.removeVertex(id);
      }
      else {
         self.graph.removeEdge(id);
      }
      if(callback) {
         callback(elementType, id, xPos, yPos);
      }
   }

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}

function VertexDragAndConnect(id, paperElementID, paper, graph, visualGraph, graphMouse, onDragEnd, onVertexSelect, onPairSelect, onEdgeSelect, vertexThreshold, edgeThreshold, dragThreshold, dragLimits, enabled) {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.enabled = false;
   this.selectionParent = null;
   this.fuzzyClicker = new FuzzyClicker(id + "$$$fuzzyclicker", paperElementID, paper, graph, visualGraph, onFuzzyClick, false, true, true, vertexThreshold, edgeThreshold, enabled);
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;

      if(enabled) {
         graphMouse.addEvent(id + "$$$dragAndConnect", "drag", "vertex", null, [this.moveHandler, this.startHandler, this.endHandler]);
      }
      else {
         graphMouse.removeEvent(id + "$$$dragAndConnect");
         self.isDragging = false;
      }
      this.fuzzyClicker.setEnabled(enabled);
   };

   function onFuzzyClick(elementType, id) {
      if(elementType === "edge") {
         if(onEdgeSelect) {
            onEdgeSelect(id);
         }
      }
      else {
         self.clickHandler(id);
      }
   }

   this.startHandler = function(x, y, event) {
      self.elementID = this.data("id");
      self.originalPosition = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      self.isDragging = false;
      self.visualGraph.elementToFront(self.elementID);
   };

   this.endHandler = function(event) {
      if(self.isDragging) {
         if(onDragEnd) {
            onDragEnd(self.elementID);
         }
         self.isDragging = false;
         return;
      }

      self.clickHandler(self.elementID);
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      if(!self.isDragging && dx * dx + dy * dy >= dragThreshold * dragThreshold) {
         self.isDragging = true;
      }
      if(!self.isDragging) {
         return;
      }

      var newX = self.originalPosition.x + dx;
      var newY = self.originalPosition.y + dy;
      if(dragLimits) {
         newX = Math.min(dragLimits.maxX, Math.max(newX, dragLimits.minX));
         newY = Math.min(dragLimits.maxY, Math.max(newY, dragLimits.minY));
      }

      self.visualGraph.graphDrawer.moveVertex(self.elementID, newX, newY);
   };

   this.clickHandler = function(id) {
      // Click on background or on the selected vertex -  deselect it.
      if(id === null || id === self.selectionParent) {
         if(self.selectionParent !== null && onVertexSelect) {
            onVertexSelect(self.selectionParent, false);
         }
         self.selectionParent = null;
         return;
      }

      // Start a new pair.
      if(self.selectionParent === null) {
         self.selectionParent = id;
         if(onVertexSelect) {
            onVertexSelect(id, true);
         }
         return;
      }

      // Finish a new pair.
      if(onPairSelect) {
         onPairSelect(self.selectionParent, id);
      }
      if(onVertexSelect) {
         onVertexSelect(self.selectionParent, false);
      }
      self.selectionParent = null;
   };

   if(enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
}
