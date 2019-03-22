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
         this.specificListeners[listenerID] = {
            elementID: elementID,
            eventType: eventType,
            raphaels: raphaels,
            callbacks: callbacks
         };
         if(!this.elementListeners[elementID]) {
            this.elementListeners[elementID] = {};
         }
         this.elementListeners[elementID][listenerID] = true;
      } else {
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
      this.graph.removePostListener(graphMouseID);
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
};

function VertexDragger(settings) {
   var self = this;
   this.gridEnabled = false;
   this.gridX = null;
   this.gridY = null;
   this.enabled = false;
   this.occupiedSnapPositions = {};
   this.vertexToSnapPosition = {};
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

   this.setGridEnabled = function(enabled, gridX, gridY) {
      this.gridEnabled = enabled;
      if(enabled) {
         this.gridX = gridX;
         this.gridY = gridY;
      }
   };

   this.startHandler = function(x, y, event) {
      self.elementID = this.data("id");
      self.originalPosition = settings.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      settings.visualGraph.elementToFront(self.elementID);
   };

   this.endHandler = function(event) {
      if(settings.snapPositions) {
         self.updateOccupiedSnap();
      }
      if(settings.callback) {
         settings.callback(self.elementID);
      }
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      var newX = self.originalPosition.x + dx;
      var newY = self.originalPosition.y + dy;
      if(self.gridEnabled) {
         newX -= (newX % self.gridX);
         newY -= (newY % self.gridY);
      }
      if(settings.snapPositions) {
         var position = self.getSnapPosition(newX, newY);
         if(position !== null) {
            newX = position.x;
            newY = position.y;
         }
         else {
            self.freeSnapFromVertex(self.elementID);
         }
      }
      if(settings.dragLimits) {
         newX = Math.max(settings.dragLimits.minX, Math.min(settings.dragLimits.maxX, newX));
         newY = Math.max(settings.dragLimits.minY, Math.min(settings.dragLimits.maxY, newY));
      }
      settings.visualGraph.graphDrawer.moveVertex(self.elementID, newX, newY);
   };

   self.freeSnapFromVertex = function(id) {
      var iPosition = self.vertexToSnapPosition[id];
      if(iPosition !== null && iPosition !== undefined) {
         delete self.occupiedSnapPositions[iPosition];
         delete self.vertexToSnapPosition[id];
      }
   };

   self.getSnapPosition = function(x, y) {
      for(var iPosition in settings.snapPositions) {
         if(self.occupiedSnapPositions[iPosition]) {
            continue;
         }
         var position = settings.snapPositions[iPosition];
         if((x - position.x) * (x - position.x) + (y - position.y) * (y - position.y) <= settings.snapThreshold * settings.snapThreshold) {
            return position;
         }
      }
      return null;
   };

   self.updateOccupiedSnap = function() {
      self.occupiedSnapPositions = {};
      var vertices = settings.visualGraph.graph.getAllVertices();
      for(var iPosition in settings.snapPositions) {
         var snapPosition = settings.snapPositions[iPosition];
         for(var iVertex in vertices) {
            var vertexPosition = settings.visualGraph.graphDrawer.getVertexPosition(vertices[iVertex]);
            if(snapPosition.x === vertexPosition.x && snapPosition.y === vertexPosition.y) {
               self.occupiedSnapPositions[iPosition] = true;
               self.vertexToSnapPosition[vertices[iVertex]] = iPosition;
               break;
            }
         }
      }
   };

   if(settings.enabled) {
      this.setEnabled(true);
   }
   else {
      this.enabled = false;
   }
   if(settings.snapPositions) {
      self.updateOccupiedSnap();
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
};

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
         edgeCreator(self.parent, id);
         self.parent = null;
         if(vertexSelector) {
            vertexSelector(id, false);
         }
      }
      else {
         // edgeCreator(self.parent, id);
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

function FuzzyClicker(id, paperElementID, paper, graph, visualGraph, callback, forVertices, forEdges, forBackground, vertexThreshold, edgeThreshold, enabled, event = "click") {
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.paperMouse = new PaperMouseEvent(paperElementID, paper, event, eventHandler, enabled);
   this.callback = callback;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      this.paperMouse.setEnabled(enabled);
   };

   this.setCallback = function(fct) {
      this.callback = fct;
   };

   function eventHandler(xPos, yPos, event) {
      // Check if vertex was clicked
      // console.log(self.id);
      var vertex = self.getFuzzyVertex(xPos, yPos);
      if(vertex !== null) {
         if(forVertices) {
            self.callback("vertex", vertex, xPos, yPos, event);
         }
         // Clicking a vertex cancels any other type, regardless of forVertices flag.
         return;
      }

      // Check if edge was clicked.
      var edge = self.getFuzzyEdge(xPos, yPos);
      if(edge !== null) {
         if(forEdges) {
            self.callback("edge", edge, xPos, yPos, event);
         }
         // Clicking an edge cancels the click on the background, regardless of forEdges.
         return;
      }

      var edge2 = self.getFuzzyEdgeLabel(xPos, yPos);
      if(edge2 !== null) {
         if(forEdges) {
            self.callback("edgeLabel", edge2, xPos, yPos, event);
         }
         // Clicking an edge cancels the click on the background, regardless of forEdges.
         return;
      }

      // Background was clicked.
      if(forBackground) {
         self.callback(null, null, xPos, yPos, event);
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

   this.getFuzzyEdgeLabel = function(xPos, yPos) {
      // Look for closest edge.
      var edge = null;
      this.graph.forEachEdge(function(id) {
         var onLabel = visualGraph.graphDrawer.isOnEdgeLabel(id,xPos,yPos);
         if(onLabel) {
            edge = id;
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
};

function VertexCreator(settings) {
   var self = this;
   this.id = settings.id;
   this.paperElementID = settings.paperElementID;
   this.paper = settings.paper;
   this.graph = settings.graph;
   this.visualGraph = settings.visualGraph;
   this.createVertex = settings.createVertex;
   this.forVertices = true;
   this.forEdges = true;
   this.vertexThreshold = settings.vertexThreshold || 0;
   this.edgeThreshold = settings.edgeThreshold || 10;
   this.enabled = false;

   this.fuzzyDblClicker = new FuzzyClicker(this.id + "_fuzzyDblClicker", this.paperElementID, this.paper, this.graph, this.visualGraph, eventHandler, this.forVertices, this.forEdges, true, this.vertexThreshold, this.edgeThreshold, false, "dblclick")

   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;

      this.fuzzyDblClicker.setEnabled(enabled);
   };

   this.setCreateVertex = function(fct) {
      this.createVertex = fct;
   }; 

   function eventHandler(elementType,elementID,x,y) {
      if(elementType === null)
         self.createVertex(x,y);
   };


   if(settings.enabled) {
      this.setEnabled(true);
   } else {
      this.enabled = false;
   }
};

function VertexDragAndConnect(settings) {
   var self = this;
   var id = settings.id;
   var paper = settings.paper;
   var graph = settings.graph;
   this.visualGraph = settings.visualGraph;
   var graphMouse = settings.graphMouse;
   var dragThreshold = settings.dragThreshold;
   this.dragLimits = settings.dragLimits;
   this.onVertexSelect = settings.onVertexSelect;
   this.onPairSelect = settings.onPairSelect;
   this.onEdgeSelect = settings.onEdgeSelect;
   this.arcDragger = settings.arcDragger;
   this.startDragCallback = settings.startDragCallback;

   this.gridEnabled = false;
   this.gridX = null;
   this.gridY = null;
   this.enabled = false;
   this.dragEnabled = false;
   this.occupiedSnapPositions = {};
   this.vertexToSnapPosition = {};

   this.enabled = false;
   this.selectionParent = null;
   this.fuzzyClicker = new FuzzyClicker(id + "$$$fuzzyclicker", settings.paperElementID, paper, graph, this.visualGraph, onFuzzyClick, false, true, true, settings.vertexThreshold, settings.edgeThreshold, false);
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;

      this.setDragEnabled(enabled);
      this.fuzzyClicker.setEnabled(enabled);
   };

   this.setGridEnabled = function(enabled, gridX, gridY) {
      this.gridEnabled = enabled;
      if(enabled) {
         this.gridX = gridX;
         this.gridY = gridY;
      }
   };

   this.setDragEnabled = function(enabled) {
      if(enabled){
         this.enableDrag();
      }else{
         this.disableDrag();
      }
      this.dragEnabled = enabled;
   };

   this.disableDrag = function() {
      graphMouse.removeEvent(id + "$$$dragAndConnect");
      self.isDragging = false;
   };

   this.enableDrag = function() {
      // graphMouse.removeEvent(id + "$$$dragAndConnect");
      graphMouse.addEvent(id + "$$$dragAndConnect", "drag", "vertex", null, [self.moveHandler, self.startHandler, self.endHandler]);
   };

   this.enableVertexDrag = function(vertexId) {
      graphMouse.removeEvent(id + "_" + vertexId + "$$$dragAndConnect");
      graphMouse.addEvent(id + "_" + vertexId + "$$$dragAndConnect", "drag", "vertex", vertexId, [self.moveHandler, self.startHandler, self.endHandler]);
   };

   this.disableVertexDrag = function(vertexId) {
      graphMouse.removeEvent(id + "_" + vertexId + "$$$dragAndConnect");
   };

   function onFuzzyClick(elementType, id) {
      if(elementType === "edge") {
         if(self.selectionParent !== null) {
            self.onVertexSelect(self.selectionParent, false);
         }
         self.selectionParent = null;
         if(this.onEdgeSelect) {
            this.onEdgeSelect(id);
         }
      }
      else if(elementType === "edgeLabel"){
         return;
      }else{
         self.clickHandler(id);
      }
   }

   this.startHandler = function(x, y, event) {
      self.elementID = this.data("id");
      self.originalPosition = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      self.lastGoodPosition = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      self.isDragging = false;
      self.visualGraph.elementToFront(self.elementID);
      if(self.startDragCallback){
         self.startDragCallback(self.elementID);
      }
   };

   this.endHandler = function(event) {
      if(self.isDragging) {
         var isSnappedToGoodPosition = false;

         if(settings.snapToLastGoodPosition) {
            var position = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
            if(!settings.isGoodPosition(self.elementID, position)) {
               self.visualGraph.graphDrawer.moveVertex(self.elementID, self.lastGoodPosition.x, self.lastGoodPosition.y);
               isSnappedToGoodPosition = true;
            }
         }
         if(settings.onDragEnd) {
            settings.onDragEnd(self.elementID, isSnappedToGoodPosition);
         }
         self.isDragging = false;
         return;
      }

      self.clickHandler(self.elementID);
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      if(self.selectionParent !== null) {
         self.onVertexSelect(self.selectionParent, false);
      }
      self.selectionParent = null;
      if(!self.isDragging && dx * dx + dy * dy >= dragThreshold * dragThreshold) {
         self.isDragging = true;
      }
      if(!self.isDragging) {
         return;
      }
      if(!self.dragEnabled)
         return;

      var newX = self.originalPosition.x + dx;
      var newY = self.originalPosition.y + dy;
      if(self.gridEnabled) {
         newX -= (newX % self.gridX);
         newY -= (newY % self.gridY);
      }
      if(self.dragLimits) {
         newX = Math.min(self.dragLimits.maxX, Math.max(newX, self.dragLimits.minX));
         newY = Math.min(self.dragLimits.maxY, Math.max(newY, self.dragLimits.minY));
      }
      if(settings.snapToLastGoodPosition) {
         var position = {
            x: newX,
            y: newY
         };
         if(settings.isGoodPosition(self.elementID, position)) {
            self.lastGoodPosition = position;
         }
      }

      self.visualGraph.graphDrawer.moveVertex(self.elementID, newX, newY);
   };

   this.clickHandler = function(id) {
      if(self.arcDragger){
         self.arcDragger.unselectAll();
      }
      // Click on background or on the selected vertex -  deselect it.
      if(id === null || id === self.selectionParent){
         if(self.selectionParent !== null) {
            self.onVertexSelect(self.selectionParent, false);
         }
         self.selectionParent = null;
         return;
      }

      // Start a new pair.
      if(self.selectionParent === null) {
         self.selectionParent = id;
         self.onVertexSelect(id, true);
         return;
      }

      // Finish a new pair.
      if(self.onPairSelect) {
         self.onPairSelect(self.selectionParent, id);
      }
      self.onVertexSelect(self.selectionParent, false, true);
      self.selectionParent = null;
   };

   this.setOnVertexSelect = function(fct) {
      this.onVertexSelect = fct;
   };
   this.setOnPairSelect = function(fct) {
      this.onPairSelect = fct;
   };
   this.setOnEdgeSelect = function(fct) {
      this.onEdgeSelect = fct;
   };
   this.setArcDragger = function(arcDragger) {
      this.arcDragger = arcDragger;
   };
   this.setStartDragCallback = function(fct) {
      this.startDragCallback = fct;
   };

   if(settings.enabled) {
      this.setEnabled(true);
   } else {
      this.enabled = false;
   }
};

function ArcDragger(settings) {
   var self = this;
   this.id = settings.id;
   this.paper = settings.paper;
   this.paperElementID = settings.paperElementID;
   this.enabled = false;
   this.graph = settings.graph;
   this.visualGraph = settings.visualGraph;
   this.graphMouse = settings.graphMouse;
   this.onEdgeSelect = settings.onEdgeSelect;
   this.editEdgeLabel = settings.editEdgeLabel;
   this.elementID = null;
   this.startAngle = 0;
   this.loop = false;
   this.originalPosition = null;
   this.edgeVertices = [];
   this.edgeVerticesPos = [];
   this.distance = null;
   this.callback = settings.callback;
   this.startDragCallback = settings.startDragCallback;
   this.isDragging = false;
   this.vertexThreshold = settings.vertexThreshold || 0;
   this.edgeThreshold = settings.edgeThreshold || 10;
   this.enabled = false;
   /* for deselection */
   // this.fuzzyClicker = new FuzzyClicker(this.id + "$$$fuzzyclicker", this.paperElementID, this.paper, this.graph, this.visualGraph, onFuzzyClick, true, true, true, this.vertexThreshold, this.edgeThreshold, false);

   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         this.enableEdgesDrag();
      }
      else {
         this.disableEdgesDrag();
      }
      // this.fuzzyClicker.setEnabled(enabled);
   };

   // function onFuzzyClick(elementType, id, x, y, event) {
   //    console.log(elementType);
   //    if(elementType === "edgeLabel"){
   //       // console.log(event)
   //       // event.stopPropagation();
   //    }
   // };

   this.setOnEdgeSelect = function(fct) {
      this.onEdgeSelect = fct;
   };
   this.setEditEdgeLabel = function(fct) {
      this.editEdgeLabel= fct;
   };

   this.enableEdgesDrag = function() {
      this.graphMouse.addEvent(this.id, "drag", "edge", null, [this.moveHandler, this.startHandler, this.endHandler]);
   };

   this.disableEdgesDrag = function() {
      this.graphMouse.removeEvent(this.id);
   };

   this.startHandler = function(x, y, event) {
      
      self.isDragging = false;
      if(self.elementID !== this.data("id")){
         self.unselectAll();
         self.elementID = this.data("id");
      }

      self.startAngle = self.visualGraph.getEdgeVisualInfo(self.elementID).angle || 0;

      self.edgeVertices = self.graph.getEdgeVertices(self.elementID);
      for(var iVertex = 0; iVertex < self.edgeVertices.length; iVertex++){
         self.edgeVerticesPos[iVertex] = self.visualGraph.getVertexVisualInfo(self.edgeVertices[iVertex]);         
      }
      self.loop = (self.edgeVertices[0] === self.edgeVertices[1]) ? true : false;

      var paperPos = $("#"+self.paperElementID).position();
      
      self.originalPosition = {x: (x - paperPos.left), y: (y - paperPos.top)};
      self.distance = Math.sqrt(Math.pow((self.edgeVerticesPos[0].x - self.edgeVerticesPos[1].x),2) + Math.pow((self.edgeVerticesPos[0].y - self.edgeVerticesPos[1].y),2));
      if(self.startDragCallback){
         self.startDragCallback(self.elementID);
      }
   };

   this.endHandler = function(event) {
      if(self.isDragging) {
         self.isDragging = false;
         if(settings.callback) {
            settings.callback();
         }
         return;
      }
      var paperPos = $("#"+self.paperElementID).position();
      var xMouse = event.pageX - paperPos.left;
      var yMouse = event.pageY - paperPos.top;
      if(self.visualGraph.graphDrawer.isOnEdgeLabel(this.data("id"),xMouse,yMouse)){
         if(self.editEdgeLabel){
            self.editEdgeLabel(self.elementID,"edge");
         }     
      }else if(self.onEdgeSelect){
         var info = self.graph.getEdgeInfo(self.elementID);
         info.selected = !info.selected;
         
         self.onEdgeSelect(self.elementID,info.selected);
         if(!info.selected){
            self.elementID = null;
         }
      }
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      self.isDragging = true;
      self.unselectAll();
      var x0 = self.originalPosition.x;
      var y0 = self.originalPosition.y;
      var xMouse = x0 + dx;
      var yMouse = y0 + dy;
      var vInfo = self.visualGraph.getEdgeVisualInfo(self.elementID);
      if(self.loop){
         vInfo["radius-ratio"] = 1.5;
         if(x0 === self.edgeVerticesPos[0].x){
            var angle1 = (y0 < self.edgeVerticesPos[0].y) ? -90 : 90;
         }else if(x0 > self.edgeVerticesPos[0].x){
            var angle1 = Math.atan((y0 - self.edgeVerticesPos[0].y)/(x0 - self.edgeVerticesPos[0].x))*180/Math.PI;
         }else{
            var angle1 = Math.atan((y0 - self.edgeVerticesPos[0].y)/(x0 - self.edgeVerticesPos[0].x))*180/Math.PI + 180;
         }
         if(xMouse === self.edgeVerticesPos[0].x){
            var angle2 = (yMouse < self.edgeVerticesPos[0].y) ? -90 : 90;
         }else if(xMouse > self.edgeVerticesPos[0].x){
            var angle2 = Math.atan((yMouse - self.edgeVerticesPos[0].y)/(xMouse - self.edgeVerticesPos[0].x))*180/Math.PI;
         }else{
            var angle2 = Math.atan((yMouse - self.edgeVerticesPos[0].y)/(xMouse - self.edgeVerticesPos[0].x))*180/Math.PI + 180;
         }

         var deltaAngle = (angle2 - angle1);
         vInfo["angle"] = (self.startAngle - deltaAngle)%360;
      }else{
         var circleParameters = self.getCircleParameters(self.edgeVerticesPos[0].x,self.edgeVerticesPos[0].y,self.edgeVerticesPos[1].x,self.edgeVerticesPos[1].y,xMouse,yMouse);
         var radius = circleParameters.r;
         var radiusRatio = radius /self.distance; 
         vInfo["sweep"] = self.getSide(xMouse,yMouse,self.edgeVerticesPos);
         if(self.getSide(circleParameters.xc,circleParameters.yc,self.edgeVerticesPos)){
            vInfo["large-arc"] = (vInfo["sweep"]) ? 1 : 0;
         }else{
            vInfo["large-arc"] = (vInfo["sweep"]) ? 0 : 1;
         }
         if(radiusRatio > 5 && !vInfo["large-arc"])
               radiusRatio = 0;
         vInfo["radius-ratio"] = Math.round(radiusRatio*100)/100;
         // vInfo["radius-ratio"] = radiusRatio;
      }
      self.visualGraph.setEdgeVisualInfo(vInfo);
      self.visualGraph.graphDrawer.refreshEdgePosition(self.edgeVertices[0],self.edgeVertices[1]);
   };

   this.getCircleParameters = function(x1,y1,x2,y2,x3,y3) {
      if(y1 !== y3 && y2 !== y3){
         var a1 = (x3 - x1)/(y1 - y3);
         var a2 = (x3 - x2)/(y2 - y3);
         if(a1 == a2)
            return {r:0,xc:0,yc:0};
         var b1 = (y1 + y3 - a1*(x1 + x3))/2;
         var b2 = (y2 + y3 - a2*(x2 + x3))/2;
         var xc = (b2 - b1)/(a1 - a2);
         var yc = a1*xc + b1;

         var r = Math.sqrt(Math.pow((xc - x1),2) + Math.pow((yc - y1),2));
         return {r:r,xc:xc,yc:yc};
      }
   };

   this.getSide = function(xMouse,yMouse,vertexPos) {
      var x1 = vertexPos[0].x;
      var x2 = vertexPos[1].x;
      var y1 = vertexPos[0].y;
      var y2 = vertexPos[1].y;
      var side = (x1 < x2) ? 1 : 0;
      if(x1 === x2) {
         if(xMouse > x1){
            side = (y1 > y2) ? 0 : 1;
         }else{
            side = (y1 > y2) ? 1 : 0;
         }
      }else if(y1 === y2){
         if(yMouse > y1){
            side = (x1 < x2) ? 0 : 1;
         }else{
            side = (x1 < x2) ? 1 : 0;
         }
      }else{
         var a = (y2 - y1)/(x2 - x1);
         var b = (y1 + y2 - a*(x1 + x2))/2;
         if(yMouse > (a*xMouse + b)){
            side = (x1 < x2) ? 0 : 1;
         }
      }
      return side;
   };

   this.unselectAll = function() {
      var edges = self.graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var info = self.graph.getEdgeInfo(edges[iEdge]);
         info.selected = false;
         if(self.onEdgeSelect){
            self.onEdgeSelect(edges[iEdge],false);
         }
      }
   };

   this.setStartDragCallback = function(fct) {
      this.startDragCallback = fct;
   };

   if(settings.enabled) {
      this.setEnabled(true);
   }
};

function GraphDragger(settings) {
   var self = this;
   this.id = settings.id;
   this.paper = settings.paper;
   this.paperElementID = settings.paperElementID;
   this.graph = settings.graph;
   this.visualGraph = settings.visualGraph;
   this.dragEnabled = false;
   this.scaleEnabled = false;
   this.enabled = false;
   this.mouseInitPos = null;
   this.vertInitPos = null;
   this.isShiftPressed = false;
   this.callback = settings.callback;
   this.dragMove = new PaperMouseEvent(this.paperElementID, this.paper, "mousemove", onDragMove, false);
   this.dragEnd = new PaperMouseEvent(this.paperElementID, this.paper, "mouseup", onDragEnd, false);
   this.fuzzyClicker = new FuzzyClicker(this.id + "$$$fuzzyclicker", this.paperElementID, this.paper, this.graph, this.visualGraph, 
      onFuzzyClick, false, false, true, 0, settings.edgeThreshold, false, "mousedown");

   this.setEnabled = function(enabled){
      if(enabled == this.enabled) {
         return;
      }
      if(enabled){
         $(window).keydown(function(event){
            if(event.which == 16){
               if(!self.isShiftPressed){
                  self.isShiftPressed = true;
               }
            }
         });
         $(window).keyup(function(event){
            if(event.which == 16){
               if(self.isShiftPressed){
                  self.isShiftPressed = false;
               }
            }
         });
      }else{
         $(window).off("keydown");
         $(window).off("keyup");
      }
      this.dragEnabled = enabled;
      this.scaleEnabled = enabled;
      this.enabled = enabled;
      this.fuzzyClicker.setEnabled(enabled);
   }

   function onFuzzyClick(elementType, id, x, y, event){
      self.onDragStart(x,y,event);
   }
   this.onDragStart = function(x,y,event){
      self.mouseInitPos = {x:x,y:y};
      self.dragMove.setEnabled(true);
      self.dragEnd.setEnabled(true);
      self.vertInitPos = $.map(self.graph.getAllVertices(), function(id) {
         return {
            id: id,
            position: self.visualGraph.graphDrawer.getVertexPosition(id)
         };
      });
   };
   function onDragMove(x,y,event){
      if(self.isShiftPressed && self.scaleEnabled){
         var ratioX = x / self.mouseInitPos.x;
         var ratioY = y / self.mouseInitPos.y;
         $.each(self.vertInitPos, function(index, element) {
            self.visualGraph.graphDrawer.moveVertex(element.id, element.position.x*ratioX, element.position.y*ratioY);
         });
      }else if(self.dragEnabled){
         var dx = x - self.mouseInitPos.x;
         var dy = y - self.mouseInitPos.y;
         $.each(self.vertInitPos, function(index, element) {
            self.visualGraph.graphDrawer.moveVertex(element.id, element.position.x + dx, element.position.y + dy);
         });
      }
   }
   function onDragEnd(x,y,event){
      self.dragMove.setEnabled(false);
      self.dragEnd.setEnabled(false);
      if(self.callback){
         self.callback();
      }
   };
   
   if(settings.enabled) {
      this.setEnabled(true);
   }
};

function GraphEditor(settings) {
   var self = this;
   var paper = settings.paper;
   var paperId = settings.paperElementID;
   var graph = settings.graph;
   var visualGraph = settings.visualGraph;
   var onVertexSelect = settings.onVertexSelect;
   var onEdgeSelect = settings.onEdgeSelect;
   this.createVertex = settings.createVertex;
   var callback = settings.callback || null;
   var defaultSelectedVertexAttr = {
      "stroke": "blue",
      "stroke-width": 4
   };
   var defaultSelectedEdgeAttr = {
      "stroke": "blue",
      "stroke-width": 6
   };
   var defaultVertexlabelAttr = {
      "font-size": 15,
      "font-family": "sans-serif"
   };
   var iconAttr = {
      "stroke": "none",
      "fill": "blue"
   };
   var overlayAttr = {
      opacity: 0,
      fill: "red",
      "cursor": "pointer"
   };
   // var vertexAttr = visualGraph.graphDrawer.circleAttr; 
   var vertexLabelAttr = settings.vertexLabelAttr || defaultVertexlabelAttr;
   var edgeLabelAttr = settings.edgeLabelAttr || visualGraph.graphDrawer.edgeLabelAttr;
   var selectedVertexAttr = settings.selectedVertexAttr || defaultSelectedVertexAttr;
   var selectedEdgeAttr = settings.selectedEdgeAttr || defaultSelectedEdgeAttr;
   var customCreateVertex = settings.createVertex; // must return vertexId

   // this.pencil = null;
   this.loopIcon = null;
   this.cross = null;
   this.edgeCross = null;
   this.terminalIcon = null;
   this.textEditor = null;
   this.vertexDragAndConnect = new VertexDragAndConnect(settings);
   this.arcDragger = new ArcDragger({
      id:"ArcDragger",
      paper: settings.paper,
      paperElementID: settings.paperElementID,
      graph: graph,
      visualGraph: visualGraph,  
      graphMouse: settings.graphMouse,
      onEdgeSelect: onEdgeSelect,
      callback: settings.callback,
      enabled: false
   });
   this.vertexCreator = new VertexCreator({
      id:"VertexCreator",
      paper: settings.paper,
      paperElementID: settings.paperElementID,
      graph: graph,
      visualGraph: visualGraph,  
      createVertex: this.createVertex,
      edgeThreshold: settings.edgeThreshold,
      // callback: settings.callback,
      enabled: false
   });
   this.graphDragger = new GraphDragger({
      id: "GraphDragger",
      paper: settings.paper,
      paperElementID: settings.paperElementID,
      graph: graph,
      visualGraph: visualGraph,  
      edgeThreshold: settings.edgeThreshold,
      callback: settings.callback,
      enabled: false
   });
   this.gridEnabled = false;
   this.removeVertexEnabled = false;
   this.createEdgeEnabled = false;
   this.removeEdgeEnabled = false;
   this.vertexDragEnabled = false;
   this.edgeDragEnabled = false;
   this.multipleEdgesEnabled = false;
   this.loopEnabled = false;
   this.editVertexLabelEnabled = false;
   this.editEdgeLabelEnabled = false;
   this.enabled = false;

   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      self.vertexDragAndConnect.setEnabled(enabled);
      self.vertexCreator.setEnabled(enabled);
      self.arcDragger.setEnabled(enabled);
      self.graphDragger.setEnabled(enabled);
      this.removeVertexEnabled = enabled;
      this.createEdgeEnabled = enabled;
      this.removeEdgeEnabled = enabled;
      this.multipleEdgesEnabled = enabled;
      this.loopEnabled = enabled;
      this.editVertexLabelEnabled = enabled;
      this.editEdgeLabelEnabled = enabled;
      this.setVertexDragEnabled(enabled);
      this.setEdgeDragEnabled(enabled);
   };

   this.setVertexDragEnabled = function(enabled) {
      this.vertexDragAndConnect.dragEnabled = enabled;
      if(enabled === this.vertexDragEnabled)
         return;
      this.vertexDragEnabled = enabled;
   };

   this.setEdgeDragEnabled = function(enabled) {
      this.arcDragger.setEnabled(enabled);
      if(enabled === this.edgeDragEnabled)
         return;
      this.edgeDragEnabled = enabled;
   };

   this.setGridEnabled = function(enabled,gridX,gridY) {
      this.gridEnabled = {snapToGrid:enabled,gridX:gridX,gridY:gridY};
      this.vertexDragAndConnect.setGridEnabled(enabled,gridX,gridY);
   };

   this.defaultOnVertexSelect = function(vertexId,selected) {
      var attr;
      if(selected) {
         attr = selectedVertexAttr;
         self.addIcons(vertexId);
         self.editLabel(vertexId,"vertex");
         // $(document).keydown(function(event){
         //    if(event.which == 46){  // if press delete
         //       graph.removeVertex(vertexId);
         //       self.vertexDragAndConnect.selectionParent = null;
         //       if(callback){
         //          callback();
         //       }
         //    }
         // });
      }else{
         // $(document).off("keydown");
         attr = visualGraph.graphDrawer.circleAttr;
         self.removeIcons();
      }
      if(visualGraph.getRaphaelsFromID(vertexId)[0]){
         visualGraph.getRaphaelsFromID(vertexId)[0].attr(attr);
      }   
   };

   this.defaultOnPairSelect = function(id1,id2) {
      if(!self.createEdgeEnabled)
         return;
      
      if(!self.multipleEdgesEnabled){
         var previousEdges = graph.getEdgesBetween(id1,id2);
         if(previousEdges.length > 1){
            return;
         }else if(previousEdges.length == 1){
            graph.removeEdge(previousEdges[0]);
         }
      }
      
      var edgeGuid = 0;
      while(graph.isEdge("e_" + edgeGuid)) {
         edgeGuid++;
      }
      var edgeID = "e_" + edgeGuid;
      graph.addEdge(edgeID, id1, id2,{label:edgeID});
      self.setNewEdgeVisualInfo(edgeID,id1,id2);
      if(callback){
         callback();
      }
   };

   this.defaultOnEdgeSelect = function(edgeID,selected) {
      var edge = visualGraph.getRaphaelsFromID(edgeID);
      if(!self.removeEdgeEnabled){
         if(!selected){
            $(document).off("keydown");
            edge[0].attr(visualGraph.graphDrawer.lineAttr);
            if(self.edgeCross)
               self.edgeCross.remove();
         }
         return;
      }
      
      if(selected){
         edge[0].attr(selectedEdgeAttr);
         
         self.addEdgeCross(edgeID);
         $(document).keydown(function(event){
            if(event.which == 46){  // if press delete
               graph.removeEdge(edgeID);
               if(callback){
                  callback();
               }
            }
         });
      }else{
         $(document).off("keydown");
         edge[0].attr(visualGraph.graphDrawer.lineAttr);
         if(self.edgeCross)
            self.edgeCross.remove();
      }
   };

   this.defaultCreateVertex = function(x,y) {
      var vertexGuid = 0;
      while(graph.isVertex("v_" + vertexGuid)) {
         vertexGuid++;
      }
      var vertexId = "v_" + vertexGuid;
      var point = {x: x, y: y};
      visualGraph.setVertexVisualInfo(vertexId, point);
      graph.addVertex(vertexId,{label:vertexId});
      if(callback){
         callback();
      }
   };

   this.setNewEdgeVisualInfo = function(edgeID,id1,id2) {
      var edges = graph.getEdgesBetween(id1,id2);
      if(edges.length <= 1)
         return;
      if(id1 === id2){
         var angle = 0;
         var validAngle;
         var increment = 20;
         var nTry = 0;
         do{
            validAngle = true;
            if(nTry >= 360/increment){
               increment /= 2;
               nTry = 0;
            }
            for(var iEdge = 0; iEdge < edges.length; iEdge++){
               if(edges[iEdge] !== edgeID){
                  var vInfo = visualGraph.getEdgeVisualInfo(edges[iEdge]);
                  if(vInfo.angle < angle + increment/2 && vInfo.angle > angle - increment/2){
                     angle = (angle + increment)%360;
                     validAngle = false;
                     nTry++;
                     break;
                  }
               }
            }
         }while(!validAngle);
         visualGraph.setEdgeVisualInfo(edgeID,{angle:angle});
      }else{
         var validParameters;
         var parameterSet = [
            {"sweep":0,"large-arc":0,"radius-ratio":0},
            {"sweep":0,"large-arc":0,"radius-ratio":1},
            {"sweep":1,"large-arc":0,"radius-ratio":1},
            {"sweep":0,"large-arc":0,"radius-ratio":0.75},
            {"sweep":1,"large-arc":0,"radius-ratio":0.75},
            {"sweep":0,"large-arc":0,"radius-ratio":0.6},
            {"sweep":1,"large-arc":0,"radius-ratio":0.6},
            {"sweep":0,"large-arc":0,"radius-ratio":0.55},
            {"sweep":1,"large-arc":0,"radius-ratio":0.55},
            {"sweep":0,"large-arc":0,"radius-ratio":0.51},
            {"sweep":1,"large-arc":0,"radius-ratio":0.51},
            {"sweep":0,"large-arc":1,"radius-ratio":0.51},
            {"sweep":1,"large-arc":1,"radius-ratio":0.51},
            {"sweep":0,"large-arc":1,"radius-ratio":0.55},
            {"sweep":1,"large-arc":1,"radius-ratio":0.55},
            {"sweep":0,"large-arc":1,"radius-ratio":0.6},
            {"sweep":1,"large-arc":1,"radius-ratio":0.6},
            {"sweep":0,"large-arc":1,"radius-ratio":0.75},
            {"sweep":1,"large-arc":1,"radius-ratio":0.75},
            {"sweep":0,"large-arc":1,"radius-ratio":1},
            {"sweep":1,"large-arc":1,"radius-ratio":1}
         ];
         var nTry = 0;
         do{
            validParameters = true;
            if(nTry === parameterSet.length - 1){
               nTry = 0;
               break;
            }
            for(var iEdge = 0; iEdge < edges.length; iEdge++){
               if(edges[iEdge] !== edgeID){
                  var vInfo = visualGraph.getEdgeVisualInfo(edges[iEdge]);
                  if(!vInfo["radius-ratio"]){
                     vInfo["radius-ratio"] = 0;
                     vInfo["sweep"] = 0;
                     vInfo["large-arc"] = 0;
                  }
                  if(vInfo["radius-ratio"] === parameterSet[nTry]["radius-ratio"] && vInfo["sweep"] === parameterSet[nTry]["sweep"] && vInfo["large-arc"] === parameterSet[nTry]["large-arc"]){
                     validParameters = false;
                     nTry++;
                     break;
                  }
               }
            }
         }while(!validParameters);
         visualGraph.setEdgeVisualInfo(edgeID,parameterSet[nTry]);
      }
      visualGraph.graphDrawer.refreshEdgePosition(id1,id2);
   };

   this.addIcons = function(vertexId) {
      // self.addPencil(vertexId);
      if(this.createEdgeEnabled && this.loopEnabled)
         this.addLoopIcon(vertexId);
      if(this.removeVertexEnabled)
         this.addCross(vertexId);
      this.addTerminalIcon(vertexId);
   };
   this.removeIcons = function() {
      // self.pencil.remove();
      self.loopIcon.remove();
      self.cross.remove();
      self.terminalIcon.remove();
   };

   this.addPencil = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var pencilSize = 20;
      var pencilX = vertexPos.x - vertexRadius - 3*pencilSize/4;
      var pencilY = vertexPos.y - vertexRadius - 3*pencilSize/4;
      if(self.pencil){
         self.pencil.remove();
      }
      self.pencil = self.drawPencil(pencilX,pencilY,pencilSize);
      visualGraph.pushVertexRaphael(vertexId,self.pencil);
      
      self.pencil.click(function(){
         self.editLabel(vertexId,"vertex");
      });
   };

   this.drawPencil = function(x,y,size) {
      var qSize = size/4;
      var icon = paper.path(
         "M" + (x + 3*qSize) + "," + y +
         "L" + (x + size) + "," + (y + qSize) +
         "L" + (x + qSize) + "," + (y + size) +
         "L" + x + "," + (y + size) + 
         "L" + x + "," + (y + 3*qSize) +
         "Z" 
         ).attr(iconAttr);
      var overlay = paper.rect(x,y,size,size).attr(overlayAttr);
      return paper.set(icon,overlay);
   };

   this.addLoopIcon = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var size = 20;
      var X = vertexPos.x - vertexRadius - size;
      var Y = vertexPos.y - vertexRadius - 3*size/4;
      if(self.loopIcon){
         self.loopIcon.remove();
      }
      self.loopIcon = self.drawLoopIcon(X,Y,size);
      visualGraph.pushVertexRaphael(vertexId,self.loopIcon);
      
      self.loopIcon.click(function(){
         self.vertexDragAndConnect.onPairSelect(vertexId,vertexId);
      });
   };

   this.drawLoopIcon = function(x,y,size) {
      var qSize = size/4;
      var icon = paper.path(
         "M" + (x + 2*qSize) + "," + y +
         "A" + size/2 + "," + size/2 + "," + 0 + "," + 1 + "," + 0 + "," + (x + 2*qSize + 0.1) + "," + (y)
         ).attr({"stroke":iconAttr.fill,"stroke-width":size/5,"arrow-end":"classic-medium-short"});
      var overlay = paper.rect(x,y,size,size).attr(overlayAttr);
      return paper.set(icon,overlay);
   };

   this.addCross = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var crossSize = 20;
      var crossX = vertexPos.x + vertexRadius;
      var crossY = vertexPos.y - vertexRadius - 3*crossSize/4;
      if(self.cross){
         self.cross.remove();
      }
      self.cross = self.drawCross(crossX,crossY,crossSize);
      visualGraph.pushVertexRaphael(vertexId,self.cross);
      
      self.cross.click(function(){
         graph.removeVertex(vertexId);
         if(callback){
            callback();
         }
      });
   };

   this.addEdgeCross = function(edgeID) {
      var crossSize = 20;
      var crossPos = self.getCrossPosition(edgeID,crossSize);
      var crossX = crossPos.x;
      var crossY = crossPos.y;
      if(self.edgeCross){
         self.edgeCross.remove();
      }
      self.edgeCross = self.drawCross(crossX,crossY,crossSize);
      visualGraph.pushEdgeRaphael(edgeID,self.edgeCross);
      
      self.edgeCross.click(function(){
         graph.removeEdge(edgeID);
         if(callback){
            callback();
         }
      });
   };

   this.drawCross = function(x,y,size) {
      var qSize = size/4;
      var icon = paper.path(
         "M" + (x + qSize) + "," + y +
         "L" + (x + size/2) + "," + (y + qSize) +
         "L" + (x + 3*qSize) + "," + y +
         "L" + (x + size) + "," + (y + qSize) + 
         "L" + (x + 3*qSize) + "," + (y + size/2) +
         "L" + (x + size) + "," + (y + 3*qSize) +
         "L" + (x + 3*qSize) + "," + (y + size) +
         "L" + (x + size/2) + "," + (y + 3*qSize) +
         "L" + (x + qSize) + "," + (y + size) +
         "L" + x + "," + (y + 3*qSize) +
         "L" + (x + qSize) + "," + (y + size/2) +
         "L" + x + "," + (y + qSize) + 
         "Z" 
         ).attr(iconAttr);
      var overlay = paper.rect(x,y,size,size).attr(overlayAttr);
      return paper.set(icon,overlay);
   };

   this.addTerminalIcon = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var size = 20;
      var X = vertexPos.x + vertexRadius;
      var Y = vertexPos.y + vertexRadius;
      if(self.terminalIcon){
         self.terminalIcon.remove();
      }
      self.terminalIcon = self.drawTerminalIcon(X,Y,size);
      visualGraph.pushVertexRaphael(vertexId,self.terminalIcon);
      
      self.terminalIcon.click(function(){
         var info = graph.getVertexInfo(vertexId);
         info.terminal = !info.terminal;
         
         graph.setVertexInfo(vertexId,info);
         visualGraph.redraw();
         self.updateHandlers();
         
         if(callback){
            callback();
         }
      });
   };

   this.drawTerminalIcon = function(x,y,size) {
      var qSize = size/4;
      var icon = paper.path(
         "M" + x + "," + y +
         "H" + (x + size) +
         "V" + (y + qSize) +
         "H" + (x + 5*qSize/2) + 
         "V" + (y + size) +
         "H" + (x + 3*qSize/2) +
         "V" + (y + qSize) +
         "H" + x +
         "Z" 
         ).attr(iconAttr);
      var overlay = paper.rect(x,y,size,size).attr(overlayAttr);
      return paper.set(icon,overlay);
   };

   this.getCrossPosition = function(edgeID,crossSize) {
      var edgeVertices = graph.getEdgeVertices(edgeID);
      vertex1 = edgeVertices[0];
      vertex2 = edgeVertices[1];
      var info = graph.getEdgeInfo(edgeID);
      var vInfo = visualGraph.getEdgeVisualInfo(edgeID);
      var vertex1Pos = visualGraph.getVertexVisualInfo(vertex1);
      var vertex2Pos = visualGraph.getVertexVisualInfo(vertex2);
      var x1 = vertex1Pos.x;
      var y1 = vertex1Pos.y;
      var x2 = vertex2Pos.x;
      var y2 = vertex2Pos.y;

      var margin = 10;
      var angle;
      if(x1 === x2){
         if(y1 > y2){
            angle = Math.PI/2;
         }else{
            angle = -Math.PI/2;
         }
      }else{
         angle = Math.atan((y2 - y1)/(x2 - x1));
      }
      if(vInfo["radius-ratio"] || vertex1 ===  vertex2){ // if curved edge
         if(vertex1 === vertex2){
            angle = vInfo.angle*Math.PI/180 || 0;
            var R = visualGraph.graphDrawer.circleAttr.r*vInfo["radius-ratio"];
            var xm = x1 + 2*R*Math.cos(angle);
            var ym = y1 - 2*R*Math.sin(angle);
            var x = xm + (crossSize)*Math.sin(angle - Math.PI/2) - crossSize/2;
            var y = ym - (crossSize)*Math.cos(angle + Math.PI/2) - crossSize/2;
         }else{
            var D = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
            var R = D*vInfo["radius-ratio"];
            var s = vInfo["sweep"] || 0;
            var l = vInfo["large-arc"] || 0;
            var cPos = visualGraph.graphDrawer.getCenterPosition(R,s,l,vertex1Pos,vertex2Pos);
            if(x2 > x1){
               var xm = (s) ? cPos.x + R*Math.sin(angle) : cPos.x - R*Math.sin(angle);
               var ym = (s) ? cPos.y - R*Math.cos(angle) : cPos.y + R*Math.cos(angle);
            }else{
               var xm = (s) ? cPos.x - R*Math.sin(angle) : cPos.x + R*Math.sin(angle);
               var ym = (s) ? cPos.y + R*Math.cos(angle) : cPos.y - R*Math.cos(angle);
            }
            
            if(x1 < x2){
               var x = (s) ? xm - (crossSize/2)*Math.sin(angle) - crossSize/2 : xm + (crossSize/2)*Math.sin(angle) - crossSize/2;
               var y = (s) ? ym + (crossSize/2 + margin)*Math.cos(angle) - crossSize/2 : ym - (crossSize/2 + margin)*Math.cos(angle) - crossSize/2;
            }else{
               var x = (s) ? xm + (crossSize/2)*Math.sin(angle) - crossSize/2 : xm - (crossSize/2)*Math.sin(angle) - crossSize/2;
               var y = (s) ? ym - (crossSize/2 + margin)*Math.cos(angle) - crossSize/2 : ym + (crossSize/2 + margin)*Math.cos(angle) - crossSize/2;
            }
         }
      }else{
         var xm = (x2 + x1)/2;
         var ym = (y2 + y1)/2;
         var x = xm - crossSize/2;
         var y = ym - crossSize/2;
         if(x1 < x2){
            var x = xm + (crossSize/2)*Math.sin(angle) - crossSize/2;
            var y = ym - (crossSize/2)*Math.cos(angle) - crossSize/2;
         }else{
            var x = xm - (crossSize/2)*Math.sin(angle) - crossSize/2;
            var y = ym + (crossSize/2)*Math.cos(angle) - crossSize/2;
         }
      }
      return {x:x,y:y};
   };

   this.updateHandlers = function() {
      self.vertexDragAndConnect.setEnabled(false);
      settings.graphMouse = new GraphMouse("mouse", graph, visualGraph);
      self.vertexDragAndConnect = new VertexDragAndConnect(settings);
      this.arcDragger.setEnabled(false);
      this.arcDragger = new ArcDragger({
         id:"ArcDragger",
         paperElementID: settings.paperElementID,
         graph: graph,
         visualGraph: visualGraph,  
         graphMouse: settings.graphMouse,
         callback: settings.callback,
         enabled: true
      });
      this.setVertexDragEnabled(this.vertexDragEnabled);
      this.setEdgeDragEnabled(this.edgeDragEnabled);
      if(this.gridEnabled)
         this.setGridEnabled(this.gridEnabled.snapToGrid,this.gridEnabled.gridX,this.gridEnabled.gridY);
      this.setDefaultSettings();
   };

   this.editLabel = function(id,type) {
      if(type === "vertex" && this.editVertexLabelEnabled){
         var info = graph.getVertexInfo(id);
         var attr = visualGraph.graphDrawer.vertexLabelAttr;
         var labelPos = visualGraph.getVertexVisualInfo(id);
      }else if(type === "edge" && self.editEdgeLabelEnabled){
         var info = graph.getEdgeInfo(id);
         var attr = visualGraph.graphDrawer.edgeLabelAttr;
         var labelPos = visualGraph.graphDrawer.getLabelPos(id);
      }else{
         return
      }
      var fontSize = attr["font-size"] || 15;
      var label = info.label || "";
      var raphElement = visualGraph.getRaphaelsFromID(id);
      raphElement[1].hide();
      self.textEditor = $("<input id=\"textEditor\" value=\""+label+"\">");
      $("#"+paperId).css("position","relative");

      self.textEditor.css({
         position: "absolute",
         left: labelPos.x,
         top: labelPos.y,
         width: label.length * fontSize,
         transform: "translate(-50%,-50%)",
         "text-align": "center",
         background: "none",
         border: "none",
         color: attr.fill || "black"
      });
      self.textEditor.css(attr);
      $("#"+paperId).append(self.textEditor);
      self.textEditor.focus();
      self.textEditor.keydown(function(){ // resize input when text length changes
         var text = $(this).val();
         if(text.length > 0){
            $(this).css("width",text.length * fontSize);
         }
      });
      self.textEditor.focusout(function(){
         self.writeLabel(id,type);
      });
      self.textEditor.keypress(function(event){
         if(event.which == 13){
            self.writeLabel(id,type);
         }
      });
      if(callback){
         callback();
      }
   };

   this.writeLabel = function(id,type) {
      if(type === "vertex"){
         var info = graph.getVertexInfo(id);
      }else if(type === "edge"){
         var info = graph.getEdgeInfo(id);
      }else{
         console.log("type error");
         return;
      }
      var oldLabel = info.label;
      var newLabel = (self.textEditor) ? self.textEditor.val() : null;
      var raphElement = visualGraph.getRaphaelsFromID(id);
      if(newLabel && oldLabel !== newLabel){
         info.label = newLabel;
         if(type === "vertex"){
            graph.setVertexInfo(id,info);
            raphElement[1].attr("text",info.label);
         }else{
            graph.setEdgeInfo(id,info);
            var labelPos = visualGraph.graphDrawer.getLabelPos(id);
            raphElement[1].attr({
               text:info.label,
               x: labelPos.x,
               y: labelPos.y
            });
         }
      }
      if(self.textEditor)
         self.textEditor.remove();
      raphElement[1].show();
   };

   this.startDragCallback = function(ID) {
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertexRaph = visualGraph.getRaphaelsFromID(vertices[iVertex]);
         if(self.textEditor)
            self.textEditor.remove();
         vertexRaph[1].show();
      }
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edgeRaph = visualGraph.getRaphaelsFromID(edges[iEdge]);
         if(self.edgeTextEditor)
            self.edgeTextEditor.remove();
         edgeRaph[1].show();
         }
      self.arcDragger.unselectAll();
   };
   

   this.setDefaultSettings = function() {
      if(!settings.onVertexSelect){
         this.vertexDragAndConnect.setOnVertexSelect(this.defaultOnVertexSelect);
      }
      if(!settings.onPairSelect){
         this.vertexDragAndConnect.setOnPairSelect(this.defaultOnPairSelect);
      }
      if(!settings.onEdgeSelect){
         this.arcDragger.setOnEdgeSelect(this.defaultOnEdgeSelect);
      }
      if(!settings.createVertex){
         this.vertexCreator.setCreateVertex(this.defaultCreateVertex);
      }
      this.vertexDragAndConnect.setArcDragger(this.arcDragger);
      this.vertexDragAndConnect.setStartDragCallback(this.startDragCallback);
      // this.vertexDragAndConnect.setGridEnabled(true,this.gridX,this.gridY);
      this.arcDragger.setStartDragCallback(this.startDragCallback);
      this.arcDragger.setEditEdgeLabel(this.editLabel);
   };
   
   this.setDefaultSettings();
   
   if(settings.enabled) {
      this.setEnabled(true);
   } else {
      this.enabled = false;
   }
};
