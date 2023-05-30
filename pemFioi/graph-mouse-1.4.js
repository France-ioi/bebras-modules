function GraphMouse(graphMouseID, graph, visualGraph) {
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.priority = 2000;

   /* ID -> {elementID: ID of vertex or edge,
    *        eventType: a mouse event type string,
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
         if(Beav.Navigator.isIE8()){
            switch(eventType){
               case "click":
                  element[eventType].apply(element, [function(ev,x,y){
                     callbacks[0](elementID);
                  }]);
                  break;
               case "drag":
               default:
                  element[eventType].apply(element, callbacks);
            }
         }else{
            element[eventType].apply(element, callbacks);
         }
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

   this.eventHandler = function(elementID) { // param only for IE8
      var id = (Beav.Navigator.isIE8()) ? elementID : this.data("id");
      var info = self.graph.getVertexInfo(id);
      // console.log(id)
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

function PaperMouseEvent(paperElementID, paper, jqEvent, callback, enabled,id) {
   var self = this;
   this.paper = paper;
   this.enabled = false;
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      if(enabled) {
         $("#" + paperElementID).off(jqEvent);
         // $("#" + paperElementID).unbind(jqEvent, this.clickHandler); // bug with VertexDragAndConnect (fuzzy clicker) when reload
         $("#" + paperElementID)[jqEvent](this.clickHandler);
      }
      else {
         // $("#" + paperElementID).unbind(jqEvent, this.clickHandler);
         $("#" + paperElementID).off(jqEvent);
      }
   };

   this.clickHandler = function(event) {
      // var offset = $(self.paper.canvas).offset();
      var offset = $("#"+paperElementID).offset();
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
   this.stillVertices = settings.stillVertices || [];
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
      if(settings.ie8compat) { // Temporary?
         // Determine which element is being clicked, from the event
         for(var rid in settings.visualGraph.vertexRaphaels) {
            var vrs = settings.visualGraph.vertexRaphaels[rid];
            for(var i = 0; i < vrs.length; i++) {
               if(vrs[i].node === (event.target || event.srcElement)
                   || vrs[i].node === (event.target.parentElement || event.target.parentNode || event.srcElement.parentElement || event.srcElement.parentNode)
               ) {
                  self.elementID = rid;
               }
            }
         }
      } else {
         self.elementID = this.data("id");
      }
      if(Beav.Array.has(self.stillVertices,self.elementID)){
         return
      }
      self.originalPosition = settings.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      settings.visualGraph.elementToFront(self.elementID);
      if(settings.startCallback) {
         settings.startCallback(self.elementID);
      }
   };

   this.endHandler = function(event) {
      if(Beav.Array.has(self.stillVertices,self.elementID)){
         return
      }
      if(settings.snapPositions) {
         self.updateOccupiedSnap();
      }
      if (settings.minDistanceBetweenVertices && settings.dragLimits) {
         self.checkOverlap(self.elementID);
      }
      if(settings.callback) {
         settings.callback(self.elementID);
      }
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      if(Beav.Array.has(self.stillVertices,self.elementID)){
         return
      }
      if(window.displayHelper){
         var scale = window.displayHelper.scaleFactor || 1;
      }else{
         var scale = 1;
      }
      // console.log(scale)
      var newX = self.originalPosition.x + dx/scale;
      var newY = self.originalPosition.y + dy/scale;
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
         var raphObj = settings.visualGraph.getRaphaelsFromID(self.elementID);
         var strW = raphObj[0].attr("stroke-width");
         newX = Math.max(settings.dragLimits.minX + strW/2, Math.min(settings.dragLimits.maxX - strW/2, newX));
         newY = Math.max(settings.dragLimits.minY + strW/2, Math.min(settings.dragLimits.maxY - strW/2, newY));
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

   self.checkOverlap = function (id) {
      var pos = settings.visualGraph.getVertexVisualInfo(id);
      if(self.overlapOtherVertex(pos.x,pos.y,id)){
         self.findEmptySpace(id);
      }
   };

   self.overlapOtherVertex = function (x,y,id) {
      var vertices = settings.visualGraph.graph.getAllVertices();
      for(var iVert = 0; iVert < vertices.length; iVert++) {
         var vertex = vertices[iVert];
         if(vertex !== id){
            var pos = settings.visualGraph.getVertexVisualInfo(vertex);
            if(Beav.Geometry.distance(x,y,pos.x,pos.y) < settings.minDistanceBetweenVertices){
               return true;
            }
         }
      }
      return false;
   };

   self.findEmptySpace = function (id) {
      var d = settings.dragLimits.maxX + settings.dragLimits.maxY;
      var pos = settings.visualGraph.getVertexVisualInfo(id);
      var newX = 0;
      var newY = 0;
      for (var x = settings.dragLimits.minX; x < settings.dragLimits.maxX; x += settings.vertexRadius){
         for (var y = settings.dragLimits.minY; y < settings.dragLimits.maxY; y += settings.vertexRadius){
            if (!self.overlapOtherVertex(x,y,id)){
               var newD = Beav.Geometry.distance(pos.x,pos.y,x,y);
               if(newD < d){
                  d = newD;
                  newX = x;
                  newY = y;
               }
            }
         }
      }

      settings.visualGraph.graphDrawer.moveVertex(id, newX, newY);
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

function FuzzyClicker(id, paperElementID, paper, graph, visualGraph, callback, forVertices, forEdges, forBackground, vertexThreshold, edgeThreshold, enabled, event) {
   if(!event){
      event = "click";
   }
   var self = this;
   this.id = id;
   this.graph = graph;
   this.visualGraph = visualGraph;
   this.paperMouse = new PaperMouseEvent(paperElementID, paper, event, eventHandler, enabled,id);
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
      // console.log("fuzzyClick "+id)
      var vertex = self.getFuzzyVertex(xPos, yPos);
      // console.log(vertex)
      if(vertex !== null) {
         if(forVertices) {
            self.callback("vertex", vertex, xPos, yPos, event);
         }
         // Clicking a vertex cancels any other type, regardless of forVertices flag.
         return;
      }

      // Check if edge was clicked.
      var edge = self.getFuzzyEdge(xPos, yPos);
      // console.log(id+" forEdges:"+forEdges+" edge:"+edge);
      if(edge !== null) {
         if(forEdges) {
            self.callback("edge", edge, xPos, yPos, event);
         }
         // Clicking an edge cancels the click on the background, regardless of forEdges.
         return;
      }

      var edge2 = self.getFuzzyEdgeLabel(xPos, yPos);
      // console.log(id+" forEdges:"+forEdges+" edgeLabel:"+edge2);
      if(edge2 !== null) {
         if(forEdges) {
            self.callback("edgeLabel", edge2, xPos, yPos, event);
         }
         // Clicking an edge cancels the click on the background, regardless of forEdges.
         return;
      }

      // console.log(id+" forBackground:"+forBackground);
      // Background was clicked.
      if(forBackground) {
         self.callback(null, null, xPos, yPos, event);
      }
   }
   
   this.getFuzzyVertex = function(xPos, yPos) {
      // Look for closest vertex.
      // console.log(self.id);
      var vertex = null;
      var minDistance = Infinity;
      this.graph.forEachVertex(function(id) {
         var distance = visualGraph.graphDrawer.getDistanceFromVertex(id, xPos, yPos);
         if(distance <= vertexThreshold && distance < minDistance) {
            vertex = id;
            minDistance = distance;
            // console.log(id);
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
         // console.log(id,distance)
         if(distance <= edgeThreshold && distance < minDistance) {
            edge = id;
            minDistance = distance;
         }
      });
      // console.log(edge)
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
   this.id = settings.id || "VertexCreator";
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

   this.fuzzyDblClicker = new FuzzyClicker(this.id + "_fuzzyDblClicker", this.paperElementID, this.paper, this.graph, this.visualGraph, eventHandler, 
      this.forVertices, this.forEdges, true, this.vertexThreshold, this.edgeThreshold, false, "dblclick")

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
      if(elementType === null){
         self.createVertex(x,y);
      }
   };


   if(settings.enabled) {
      this.setEnabled(true);
   } else {
      this.enabled = false;
   }
};

function VertexDragAndConnect(settings) {
   var self = this;
   this.id = settings.id || "VertexDragAndConnect";
   var paper = settings.paper;
   // console.log(paper)
   var graphMouse = settings.graphMouse;
   // var graph = settings.graph;
   // this.visualGraph = settings.visualGraph;
   var graph = graphMouse.graph;
   this.visualGraph = graphMouse.visualGraph;
   this.dragThreshold = settings.dragThreshold || 0;
   this.vertexThreshold = settings.vertexThreshold || 0;
   this.dragLimits = settings.dragLimits;
   this.onVertexSelect = settings.onVertexSelect;
   this.onPairSelect = settings.onPairSelect;
   this.onEdgeSelect = settings.onEdgeSelect;
   this.onDragEnd = settings.onDragEnd;
   this.unselectAllEdges;
   this.startDragCallback = settings.startDragCallback;
   this.moveDragCallback = settings.moveDragCallback;
   this.clickHandlerCallback = settings.clickHandlerCallback;
   this.fuzzyClickCallback = settings.fuzzyClickCallback;

   this.gridEnabled = false;
   this.gridX = null;
   this.gridY = null;
   
   this.enabled = false;
   this.dragEnabled = false;
   this.vertexSelectEnabled = false;
   this.allowDeselection = true;   // to deal with graph editorcontent validation

   this.occupiedSnapPositions = {};
   this.vertexToSnapPosition = {};
   this.isGoodPosition = settings.isGoodPosition;
   this.snapToLastGoodPosition = settings.snapToLastGoodPosition;

   this.enabled = false;
   this.selectionParent = null;
   if(Beav.Navigator.isIE8()){
      this.fuzzyClicker = new FuzzyClicker(self.id + "$$$fuzzyclicker", settings.paperElementID, paper, graph, this.visualGraph, onFuzzyClick, true, true, true, 
      this.vertexThreshold, settings.edgeThreshold, false);
   }else{
      this.fuzzyClicker = new FuzzyClicker(self.id + "$$$fuzzyclicker", settings.paperElementID, paper, graph, this.visualGraph, onFuzzyClick, false, true, true, 
      this.vertexThreshold, settings.edgeThreshold, false);
   }
   
   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;

      this.setDragEnabled(enabled);
      this.fuzzyClicker.setEnabled(enabled);
      this.setVertexSelectEnabled(enabled);
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

   this.setVertexSelectEnabled = function(enabled) {
      this.vertexSelectEnabled = enabled;
   };

   this.disableDrag = function() {
      graphMouse.removeEvent(self.id + "$$$dragAndConnect");
      self.isDragging = false;
   };

   this.enableDrag = function() {
      graphMouse.addEvent(self.id + "$$$dragAndConnect", "drag", "vertex", null, [self.moveHandler, self.startHandler, self.endHandler]);
   };

   this.enableVertexDrag = function(vertexId) {
      // console.log('enableDrag')
      graphMouse.removeEvent(self.id + "_" + vertexId + "$$$dragAndConnect");
      graphMouse.addEvent(self.id + "_" + vertexId + "$$$dragAndConnect", "drag", "vertex", vertexId, [self.moveHandler, self.startHandler, self.endHandler]);
   };

   this.disableVertexDrag = function(vertexId) {
      // console.log('disableDrag')
      graphMouse.removeEvent(self.id + "_" + vertexId + "$$$dragAndConnect");
   };

   function onFuzzyClick(elementType, id) {
      // console.log("onFuzzyClick",elementType,id)
      if(elementType === "edge") {
         if(self.selectionParent !== null) {
            // console.log("vertexSelect")
            self.onVertexSelect(self.selectionParent, false);
         }
         self.selectionParent = null;
         if(self.onEdgeSelect) {
            // console.log("onEdgeSelect vertexDragAndConnect")
            self.onEdgeSelect(id);
         }
      }else if(elementType === "edgeLabel"){
         return;
      }else{
         self.clickHandler(id);
      }
      if(self.fuzzyClickCallback){
         // console.log("fuzzyClickCB")
         self.fuzzyClickCallback();
      }
   }

   this.startHandler = function(x, y, event) { 
      if(self.unselectAllEdges){
         self.unselectAllEdges();
      }
      self.elementID = this.data("id");
      // console.log('startDrag',self.elementID)
      self.originalPosition = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      self.lastGoodPosition = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
      self.isDragging = false;
      self.visualGraph.elementToFront(self.elementID);
      if(self.startDragCallback){
         // console.log("startDragCallback")
         self.startDragCallback(self.elementID,x,y);
      }
   };

   this.endHandler = function(event) {
      if(self.isDragging) {
         var isSnappedToGoodPosition = false;

         if(self.snapToLastGoodPosition) {
            var position = self.visualGraph.graphDrawer.getVertexPosition(self.elementID);
            if(!self.isGoodPosition(self.elementID, position)) {
               self.visualGraph.graphDrawer.moveVertex(self.elementID, self.lastGoodPosition.x, self.lastGoodPosition.y);
               isSnappedToGoodPosition = true;
            }
         }
         if(self.onDragEnd) {
            self.onDragEnd(self.elementID, isSnappedToGoodPosition);
         }
         // self.isDragging = false;
         return;
      }
      // console.log('clickHandler',self.elementID)
      self.clickHandler(self.elementID,event.pageX,event.pageY);  // because drag event interferes with click event on chrome
   };

   this.moveHandler = function(dx, dy, x, y, event) {
      if (window.displayHelper) {
         var scale = window.displayHelper.scaleFactor || 1;
      }else{
         var scale = 1;
      }
      dx = dx/scale;
      dy = dy/scale;
      if(!self.dragEnabled || dx * dx + dy * dy <= self.dragThreshold * self.dragThreshold){
         return;
      }
      if(self.selectionParent !== null && self.allowDeselection) {
         self.onVertexSelect(self.selectionParent, false);
      }
      self.selectionParent = null;
      if(!self.isDragging) {
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
      if(self.snapToLastGoodPosition) {
         var position = {
            x: newX,
            y: newY
         };
         if(self.isGoodPosition(self.elementID, position)) {
            self.lastGoodPosition = position;
         }
      }

      self.visualGraph.graphDrawer.moveVertex(self.elementID, newX, newY);

      if(self.moveDragCallback){
         self.moveDragCallback(self.elementID);
      }
   };

   this.clickHandler = function(id,x,y) {
      // console.log("clickHandler "+id)
      if(self.unselectAllEdges){
         self.unselectAllEdges();
      }
      if(self.isDragging){
         self.isDragging = false;
         return
      }
      if(self.vertexSelectEnabled && self.allowDeselection) {
         // Click on background or on the selected vertex -  deselect it.
         if(id === null || id === self.selectionParent){
            if(self.selectionParent !== null && self.onVertexSelect) {
               self.onVertexSelect(self.selectionParent, false,x,y);
            }
            self.selectionParent = null;
            return;
         }
         
         // Start a new pair.
         if(self.selectionParent === null && self.onVertexSelect) {
            self.selectionParent = id;
            self.onVertexSelect(id, true,x,y);
            return;
         }
         
         // Finish a new pair.
         if(self.onPairSelect) {
            self.onPairSelect(self.selectionParent, id, x, y);
         }
         if(self.onVertexSelect){
            self.onVertexSelect(self.selectionParent, false, x,y);
         }
         self.selectionParent = null;
         if(self.clickHandlerCallback){
            self.clickHandlerCallback(id,x,y);
         }
      }
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
   this.setUnselectAllEdges = function(fct) {
      this.unselectAllEdges = fct;
   };
   this.setStartDragCallback = function(fct) {
      this.startDragCallback = fct;
   };
   this.setClickHandlerCallback = function(fct) {
      this.clickHandlerCallback = fct;
   };
   this.setIsGoodPosition = function(fct) {
      this.isGoodPosition = fct;
   };

   if(settings.enabled) {
      this.setEnabled(true);
   } else {
      this.enabled = false;
   }
};

function ArcDragger(settings) {
   var self = this;
   this.id = settings.id || "ArcDragger";
   this.paper = settings.paper;
   this.paperElementID = settings.paperElementID;
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
   this.isOnLabel = false;
   this.vertexThreshold = settings.vertexThreshold || 0;
   this.edgeThreshold = settings.edgeThreshold || 10;

   this.enabled = false;
   this.dragEnabled = false;
   this.unselectAll;

   var scale = 1;

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
   };

   this.setOnEdgeSelect = function(fct) {
      this.onEdgeSelect = fct;
   };
   this.setEditEdgeLabel = function(fct) {
      this.editEdgeLabel= fct;
   };
   this.setUnselectAll = function(fct) {
      this.unselectAll= fct;
   };

   this.enableEdgesDrag = function() {
      this.graphMouse.addEvent(this.id, "drag", "edge", null, [this.moveHandler, this.startHandler, this.endHandler]);
      this.dragEnabled = true;
   };

   this.disableEdgesDrag = function() {
      this.graphMouse.removeEvent(this.id);
      this.dragEnabled = false;
   };

   this.startHandler = function(x, y, event) {
      if (window.displayHelper) {
         scale = window.displayHelper.scaleFactor || 1;
      }else{
         scale = 1;
      }
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

      var paperPos = $(self.paper.canvas).offset();
      
      self.originalPosition = {x: (x - paperPos.left), y: (y - paperPos.top)};
      self.isOnLabel = self.visualGraph.graphDrawer.isOnEdgeLabel(this.data("id"),self.originalPosition.x,self.originalPosition.y);
      self.distance = Math.sqrt(Math.pow((self.edgeVerticesPos[0].x - self.edgeVerticesPos[1].x),2) + Math.pow((self.edgeVerticesPos[0].y - self.edgeVerticesPos[1].y),2))*scale;
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
      if(self.isOnLabel){
         if(self.editEdgeLabel){
            self.editEdgeLabel(self.elementID,"edge");
         }     
         self.isOnLabel = false;
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
      if(!self.dragEnabled || self.isOnLabel || (dx == 0 && dy == 0)){
         return;
      }
      
      dx = dx/scale;
      dy = dy/scale;
      self.isDragging = true;
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
         var circleParameters = self.getCircleParameters(self.edgeVerticesPos[0].x*scale,self.edgeVerticesPos[0].y*scale,self.edgeVerticesPos[1].x*scale,self.edgeVerticesPos[1].y*scale,xMouse,yMouse);
         // var circleParameters = self.getCircleParameters(self.edgeVerticesPos[0].x,self.edgeVerticesPos[0].y,self.edgeVerticesPos[1].x,self.edgeVerticesPos[1].y,xMouse,yMouse);
         if(circleParameters){
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
            if(vInfo["radius-ratio"] == 0){
               delete vInfo["radius-ratio"];
               delete vInfo["sweep"];
               delete vInfo["large-arc"];
            }
         }
      }
      self.visualGraph.setEdgeVisualInfo(vInfo);
      self.visualGraph.graphDrawer.refreshEdgePosition(self.edgeVertices[0],self.edgeVertices[1]);
      if(self.unselectAll){
         // console.log("unselectAll arcDragger")
         self.unselectAll();
      }
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
      var x1 = vertexPos[0].x*scale;
      var x2 = vertexPos[1].x*scale;
      var y1 = vertexPos[0].y*scale;
      var y2 = vertexPos[1].y*scale;
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

   this.setStartDragCallback = function(fct) {
      this.startDragCallback = fct;
   };

   if(settings.enabled) {
      this.setEnabled(true);
   }
};

function GraphDragger(settings) {
   var self = this;
   this.id = settings.id || "GraphDragger";
   this.paper = settings.paper;
   this.paperElementID = settings.paperElementID;
   this.graph = settings.graph;
   this.visualGraph = settings.visualGraph;

   this.enabled = false;
   this.dragEnabled = false;
   this.scaleEnabled = false;
   this.gridEnabled = false;

   this.gridX = null;
   this.gridY = null;
   this.gridAlignment = {};
   this.gridAlignmentRefIndex = null;

   this.mouseInitPos = null;
   this.vertInitPos = null;
   this.isShiftPressed = false;
   this.callback = settings.callback;
   this.moveDragCallback = null;
   this.unselectAllEdges = null;

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
   };

   this.setGridEnabled = function(enabled, gridX, gridY) {
      this.gridEnabled = enabled;
      if(enabled) {
         this.gridX = gridX;
         this.gridY = gridY;
      }
   };

   this.setMoveDragCallback = function(fct) {
      this.moveDragCallback = fct;
   };
   this.setUnselectAllEdges = function(fct) {
      this.unselectAllEdges = fct;
   };

   function onFuzzyClick(elementType, id, x, y, event){
      // console.log(self.dragEnabled,self.scaleEnabled)
      if(!self.dragEnabled && !self.scaleEnabled){
         return
      }
      // console.log("onFuzzyClick",elementType,id)
      if(self.unselectAllEdges){
         self.unselectAllEdges();
      }
      self.onDragStart(x,y,event);
   }
   this.onDragStart = function(x,y,event){
      self.mouseInitPos = {x:x,y:y};
      self.dragMove.setEnabled(true);
      self.dragEnd.setEnabled(true);
      var vertices = self.graph.getAllVertices();
      self.vertInitPos = $.map(vertices, function(id) {
         return {
            id: id,
            position: self.visualGraph.graphDrawer.getVertexPosition(id)
         };
      });
      if(self.gridEnabled){
         for(var iVertex = 0; iVertex < vertices.length; iVertex++){
            var vertex = vertices[iVertex];
            var pos = self.visualGraph.graphDrawer.getVertexPosition(vertex);
            var index = pos.x % self.gridX + ";" + pos.y % self.gridY;
            var maxLength = 0;
            if(!self.gridAlignment[index]){
               self.gridAlignment[index] = [vertex];
            }else{
               self.gridAlignment[index].push(vertex);
            }
            if(self.gridAlignment[index].length > maxLength){
               maxLength = self.gridAlignment[index].length;
               self.gridAlignmentRefIndex = index;
            }
         }
      }
   };
   function onDragMove(x,y,event){
      if(self.isShiftPressed && self.scaleEnabled){
         var ratioX = x / self.mouseInitPos.x;
         var ratioY = y / self.mouseInitPos.y;
         $.each(self.vertInitPos, function(index, element) {
            self.visualGraph.graphDrawer.moveVertex(element.id, Math.round(element.position.x*ratioX), Math.round(element.position.y*ratioY));
         });
      }else if(self.dragEnabled){
         var dx = x - self.mouseInitPos.x;
         var dy = y - self.mouseInitPos.y;
         if(self.gridEnabled){
            for(var iVert = 0; iVert < self.vertInitPos.length; iVert++){
               var vertPos = self.vertInitPos[iVert];
               if($.inArray(vertPos.id,self.gridAlignment[self.gridAlignmentRefIndex]) >= 0){
                  var newX = (vertPos.position.x + dx) - (vertPos.position.x + dx) % self.gridX;
                  var newY = (vertPos.position.y + dy) - (vertPos.position.y + dy) % self.gridY;
                  dx = newX - vertPos.position.x;
                  dy = newY - vertPos.position.y;
               }
            }
         }
         $.each(self.vertInitPos, function(index, element) {
            self.visualGraph.graphDrawer.moveVertex(element.id, element.position.x + dx, element.position.y + dy);
         });

         if(self.moveDragCallback){
            self.moveDragCallback();
         }
      }
   }
   function onDragEnd(x,y,event){
      self.dragMove.setEnabled(false);
      self.dragEnd.setEnabled(false);
      self.gridAlignment = {};
      self.gridAlignmentRefIndex = null;
      if(self.callback && x != self.mouseInitPos.x && y != self.mouseInitPos.y){
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
   var onVertexSelect = settings.onVertexSelect;   // optional
   var onEdgeSelect = settings.onEdgeSelect;    // optional
   this.createVertex = settings.createVertex;   // optional
   var startDragCallbackCallback = settings.startDragCallbackCallback; // optional
   
   var callback = settings.callback;
   var selectVertexCallback = settings.selectVertexCallback;
   this.contentValidation = settings.contentValidation;
   this.vertexLabelValidation = settings.vertexLabelValidation;
   this.writeContentCallback = settings.writeContentCallback;
   this.resizeTableVertexCallback = settings.resizeTableVertexCallback;
   // this.updateHandlersCallback = settings.updateHandlersCallback;

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
   var vertexLabelAttr = settings.vertexLabelAttr || defaultVertexlabelAttr;
   var edgeLabelAttr = settings.edgeLabelAttr || visualGraph.graphDrawer.edgeLabelAttr;
   this.selectedVertexAttr = settings.selectedVertexAttr || defaultSelectedVertexAttr;
   this.selectedEdgeAttr = settings.selectedEdgeAttr || defaultSelectedEdgeAttr;
   this.alphabet = settings.alphabet;
   if(!settings.vertexLabelPrefix && settings.vertexLabelPrefix != ""){
      this.vertexLabelPrefix = "v_";
   }else{
      this.vertexLabelPrefix = settings.vertexLabelPrefix;
   }
   this.loopIcon = null;
   this.cross = null;
   this.edgeCross = null;
   this.terminalIcon = null;
   this.initialIcon = null;

   this.textEditor = null;
   this.editInfo = {};
   this.edited = false; // true when label or content has just been modified
   this.editLabelCondition = settings.editLabelCondition;
   this.selectedEdges = [];
   this.maxEdgeLabelLength = settings.maxEdgeLabelLength;

   this.vertexDragAndConnect = new VertexDragAndConnect(settings);
   // this.vertexDragAndConnect = new VertexDragAndConnect({
   //       paper: settings.paper,
   //       graph: graph,
   //       paperElementID: settings.paperElementID,
   //       visualGraph: visualGraph,
   //       graphMouse: settings.graphMouse,
   //       dragThreshold: settings.dragThreshold,
   //       edgeThreshold: settings.dragThreshold,
   //       dragLimits: settings.dragLimits,
   //       createVertex: settings.createVertex,
   //       onPairSelect: settings.onPairSelect,
   //       // onEdgeSelect: onEdgeSelect,
   //       onVertexSelect: settings.onVertexSelect,
   //       selectedVertexAttr: settings.selectedVertexAttr,
   //       selectedEdgeAttr: settings.selectedEdgeAttr,
   //       onDragEnd: settings.onDragEnd,
   //       callback: settings.callback,
   //       enabled: false
   //    });
   this.arcDragger = new ArcDragger({
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
      paper: settings.paper,
      paperElementID: settings.paperElementID,
      graph: graph,
      visualGraph: visualGraph,  
      createVertex: this.createVertex,
      edgeThreshold: settings.edgeThreshold,
      enabled: false
   });
   this.graphDragger = new GraphDragger({
      paper: settings.paper,
      paperElementID: settings.paperElementID,
      graph: graph,
      visualGraph: visualGraph,  
      edgeThreshold: settings.edgeThreshold,
      callback: settings.callback,
      enabled: false
   });

   this.tableMode = false;
   this.localTableMode = false;
   this.gridEnabled = false;
   this.removeVertexEnabled = false;
   this.createEdgeEnabled = false;
   this.removeEdgeEnabled = false;
   this.vertexDragEnabled = false;
   this.edgeDragEnabled = false;
   this.graphDragEnabled = false;
   this.multipleEdgesEnabled = false;
   this.backwardEdgesEnabled = false;
   this.loopEnabled = false;
   this.editVertexLabelEnabled = false;
   this.editVertexContentEnabled = false;
   this.editEdgeLabelEnabled = false;
   this.vertexSelectEnabled = false;
   this.terminalEnabled = false;
   this.initialEnabled = false;
   this.defaultVertexLabelEnabled = false;
   this.defaultEdgeLabelEnabled = false;
   this.allowMutlipleTerminal = true;
   this.allowMutlipleInitial = true;
   this.allowSimultaneousInitialAndTerminal = true;
   this.enabled = false;

   this.setEnabled = function(enabled) {
      if(enabled == this.enabled) {
         return;
      }
      this.enabled = enabled;
      self.vertexDragAndConnect.setEnabled(enabled);
      self.arcDragger.setEnabled(enabled);
      self.graphDragger.setEnabled(enabled);

      this.setGraphDragEnabled(enabled);
      this.setCreateVertexEnabled(enabled);
      this.setCreateEdgeEnabled(enabled);
      this.setVertexDragEnabled(enabled);
      this.setEdgeDragEnabled(enabled);
      this.setMultipleEdgesEnabled(enabled);
      this.setBackwardEdgesEnabled(enabled);
      this.setEditVertexLabelEnabled(enabled);
      this.setEditVertexContentEnabled(enabled);
      this.setEditEdgeLabelEnabled(enabled);
      this.setLoopEnabled(enabled);
      this.setVertexSelectEnabled(enabled);
      this.setTerminalEnabled(enabled);
      this.setInitialEnabled(enabled);
      this.setDefaultVertexLabelEnabled(enabled);  
      this.setDefaultEdgeLabelEnabled(enabled);     
   };

   this.setCreateVertexEnabled = function(enabled) {
      this.vertexCreator.setEnabled(enabled);
      this.removeVertexEnabled = enabled;
      this.checkVertexSelect();
   };
   this.setCreateEdgeEnabled = function(enabled) {
      this.createEdgeEnabled = enabled;
      this.removeEdgeEnabled = enabled;
      this.checkVertexSelect();
   };
   this.setVertexDragEnabled = function(enabled) {
      this.vertexDragAndConnect.dragEnabled = enabled;
      this.vertexDragEnabled = enabled;
   };
   this.setEdgeDragEnabled = function(enabled) {
      this.edgeDragEnabled = enabled;
      this.arcDragger.dragEnabled = enabled;
   };
   this.setGraphDragEnabled = function(enabled) {
      this.graphDragEnabled = enabled;
      this.graphDragger.dragEnabled = enabled;
      this.checkGraphDrag();
   };
   this.setScaleGraphEnabled = function(enabled) {
      this.graphDragger.scaleEnabled = enabled;
      this.checkGraphDrag();
   };
   this.setMultipleEdgesEnabled = function(enabled) {
      this.multipleEdgesEnabled = enabled;
   };
   this.setBackwardEdgesEnabled = function(enabled) {
      this.backwardEdgesEnabled = enabled;
   };
   this.setLoopEnabled = function(enabled) {
      this.loopEnabled = enabled;
   };
   this.setEditVertexLabelEnabled = function(enabled) {
      this.editVertexLabelEnabled = enabled;
   };
   this.setEditVertexContentEnabled = function(enabled) {
      this.editVertexContentEnabled = enabled;
   };
   this.setEditEdgeLabelEnabled = function(enabled) {
      this.editEdgeLabelEnabled = enabled;
   };
   this.setGridEnabled = function(enabled,gridX,gridY) {
      this.gridEnabled = {snapToGrid:enabled,gridX:gridX,gridY:gridY};
      this.vertexDragAndConnect.setGridEnabled(enabled,gridX,gridY);
      this.graphDragger.setGridEnabled(enabled,gridX,gridY);
   };
   this.setTerminalEnabled = function(enabled) {
      this.terminalEnabled = enabled;
      this.checkVertexSelect();
   };
   this.setInitialEnabled = function(enabled) {
      this.initialEnabled = enabled;
      this.checkVertexSelect();
   };
   this.setVertexSelectEnabled = function(enabled) {
      this.vertexSelectEnabled = enabled;
      this.vertexDragAndConnect.setVertexSelectEnabled(enabled);
   };
   this.setDefaultVertexLabelEnabled = function(enabled) {
      this.defaultVertexLabelEnabled = enabled;
   };
   this.setDefaultEdgeLabelEnabled = function(enabled) {
      this.defaultEdgeLabelEnabled = enabled;
   };
   this.setTableMode = function(enabled) {
      this.tableMode = enabled;
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var vInfo = visualGraph.getVertexVisualInfo(vertex);
         if(enabled){
            vInfo.tableMode = enabled;
         }else{
            delete vInfo.tableMode;
         }
      }
      visualGraph.redraw();
      this.updateHandlers();
   };
   this.setLocalTableMode = function(enabled) {
      this.localTableMode = enabled;
   };
   this.setIconAttr = function(attr){
      iconAttr = attr;
   };
   this.setAllowMultipleTerminal = function(enabled) {
      this.allowMutlipleTerminal = enabled;
   };
   this.setAllowMultipleInitial = function(enabled) {
      this.allowMutlipleInitial = enabled;
   };
   this.setAllowSimultaneousInitialAndTerminal = function(enabled) {
      this.allowSimultaneousInitialAndTerminal = enabled;
   };


   this.checkVertexSelect = function() {
      if(!this.terminalEnabled && !this.initialEnabled && !this.removeVertexEnabled && !this.createEdgeEnabled && !this.vertexSelectEnabled){
         this.setVertexSelectEnabled(false);
      }else{
         this.setVertexSelectEnabled(true);
      }
   };
   this.checkGraphDrag = function() {
      if(!this.graphDragger.dragEnabled && !this.graphDragger.scaleEnabled){
         this.graphDragger.setEnabled(false);
      }else{
         this.graphDragger.setEnabled(true);
      }
   };

   this.defaultOnVertexSelect = function(vertexId,selected,x,y) {
      var attr;
      var info = graph.getVertexInfo(vertexId);
      // console.log(vertexId+" select "+selected);
      if(selected) {
         self.edited = false;
         attr = self.selectedVertexAttr;
         self.addIcons(vertexId);
         var vInfo = visualGraph.getVertexVisualInfo(vertexId);
         if(!vInfo.tableMode){
            self.editLabel(vertexId,"vertex");
         }else{
            /* table mode */
            var offset = $(paper.canvas).offset();
            var xPos = x - offset.left;
            var yPos = y - offset.top;
            // var info = graph.getVertexInfo(vertexId);
            var content = (info.content) ? info.content : "";
            var boxSize = visualGraph.graphDrawer.getBoxSize(content);
            if(yPos < (vInfo.y - boxSize.h/2 + 2*visualGraph.graphDrawer.vertexLabelAttr["font-size"])){
               self.editLabel(vertexId,"vertex");
            }else{
               self.editContent(vertexId);
            }
         }
      }else{
         if(info.vertexType && visualGraph.graphDrawer.vertexTypeAttr[info.vertexType]){
            attr = visualGraph.graphDrawer.vertexTypeAttr[info.vertexType].circle;
         }else{
            attr = visualGraph.graphDrawer.circleAttr;
         }
         self.removeIcons(vertexId);
      }
      if(visualGraph.getRaphaelsFromID(vertexId)[0]){
         visualGraph.getRaphaelsFromID(vertexId)[0].attr(attr);
      }   
      if(selectVertexCallback){
         selectVertexCallback(vertexId,selected);
      }
   };

   this.defaultOnPairSelect = function(id1,id2,x,y) {
      // console.log("pair "+id1+" "+id2);
      if(!self.createEdgeEnabled){
         return
      }
      self.startDragCallback(id1);
      if(self.edited)
         return
      
      if(!self.multipleEdgesEnabled){
         if(!self.backwardEdgesEnabled){
            var previousEdges = graph.getEdgesBetween(id1,id2);
         }else{
            var previousEdges = graph.getEdgesFrom(id1,id2);
         }
         if(previousEdges.length > 1){
            return;
         }else if(previousEdges.length == 1){
            return;
         }
      }
      
      var edgeGuid = 0;
      while(graph.isEdge("e_" + edgeGuid)) {
         edgeGuid++;
      }
      var edgeID = "e_" + edgeGuid;
      var edgeLabel = (self.alphabet) ? self.alphabet[0] : edgeID;
      if(self.defaultEdgeLabelEnabled){
         graph.addEdge(edgeID, id1, id2,{label:edgeLabel});
      }else{
         graph.addEdge(edgeID, id1, id2);
      }
      self.setNewEdgeVisualInfo(edgeID,id1,id2);
      if(callback){
         callback();
      }
   };

   this.clickHandlerCallback = function(id,x,y) {
      if(!self.createEdgeEnabled){
         /* if edge creation is disabled, change selected vertex in a single click */ 
         self.vertexDragAndConnect.onVertexSelect(id,true,x,y);
         self.vertexDragAndConnect.selectionParent = id;
      }
   };

   this.defaultOnEdgeSelect = function(edgeID,selected) {
      var edge = visualGraph.getRaphaelsFromID(edgeID);
      var info = graph.getEdgeInfo(edgeID);
      if(info.edgeType != undefined){
         var edgeAttr = visualGraph.graphDrawer.edgeTypeAttr[info.edgeType] || visualGraph.graphDrawer.lineAttr;
      }else{
         var edgeAttr = visualGraph.graphDrawer.lineAttr;
      }

      if(!self.removeEdgeEnabled){
         if(!selected){
            $(document).off("keydown");
            edge[0].attr(edgeAttr);
            if(self.edgeCross)
               self.edgeCross.remove();
         }
         return;
      }

      if(selected){
         self.selectedEdges.push(edgeID);
         edge[0].attr(self.selectedEdgeAttr);

         self.addEdgeCross(edgeID);
         if(!info.label || info.label.length == 0){
            self.editLabel(edgeID,"edge");
         }
         $(document).keydown(function(event){
            if(event.which == 46){  // if press delete
               if(self.textEditor){
                  self.textEditor.remove();
                  self.editInfo = {};
               }
               graph.removeEdge(edgeID);
               if(callback){
                  callback();
               }
            }
         });
      }else{
         self.selectedEdges = [];
         $(document).off("keydown");
         edge[0].attr(edgeAttr);
         if(self.edgeCross)
            self.edgeCross.remove();
      }
   };

   this.unselectAllEdges = function() {
      // console.log("unselectAll")
      for(var iEdge = 0; iEdge < self.selectedEdges.length; iEdge++){
         var edge = self.selectedEdges[iEdge];
         if(!graph.isEdge(edge)){
            continue
         }
         var info = graph.getEdgeInfo(edge);
         if(info.selected){
            info.selected = false;
         }
         self.arcDragger.onEdgeSelect(edge,false);
      }
   };

   this.defaultCreateVertex = function(x,y) {
      var vertexGuid = 0;
      while(graph.isVertex("v_" + vertexGuid)) {
         vertexGuid++;
      }
      var vertexId = "v_" + vertexGuid;
      var vData = {x: Math.round(x), y: Math.round(y)};
      if(self.localTableMode || self.tableMode){
         /* don't show table mode if false */
         vData.tableMode = true;
      }
      visualGraph.setVertexVisualInfo(vertexId, vData);
      if(self.defaultVertexLabelEnabled){
         var label = self.getDefaultLabel();
         graph.addVertex(vertexId,{label:label});
      }else{
         graph.addVertex(vertexId);
      }
      if(callback){
         callback();
      }
   };

   this.getDefaultLabel = function() {
      var vertices = graph.getAllVertices();
      var index = 0;
      do{
         var alreadyExist = false;
         for(var iVertex = 0; iVertex < vertices.length; iVertex++){
            var vertex = vertices[iVertex];
            var info = graph.getVertexInfo(vertex);
            var label = this.vertexLabelPrefix + index;
            if(info.label == label){
               alreadyExist = true;
               index++;
               break;
            }
         }
      }while(alreadyExist)
      return label;
   };

   this.setNewEdgeVisualInfo = function(edgeID,id1,id2) {
      var edges = graph.getEdgesBetween(id1,id2);
      // console.log(edges)
      if(id1 === id2){
         if(edges.length <= 1)
            return;
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
         var edgesFrom = graph.getEdgesFrom(id1,id2);
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
                  var isFrom = edgesFrom.includes(edges[iEdge]);
                  var vInfo = visualGraph.getEdgeVisualInfo(edges[iEdge]);
                  if(!vInfo["radius-ratio"]){
                     vInfo["radius-ratio"] = 0;
                     vInfo["sweep"] = (isFrom) ? 0 : 1;
                     vInfo["large-arc"] = 0;
                  }
                  if(vInfo["radius-ratio"] === parameterSet[nTry]["radius-ratio"] && 
                     (vInfo["sweep"] === parameterSet[nTry]["sweep"] && isFrom || vInfo["sweep"] !== parameterSet[nTry]["sweep"] && !isFrom) && 
                     vInfo["large-arc"] === parameterSet[nTry]["large-arc"]){
                     validParameters = false;
                     nTry++;
                     break;
                  }
               }
            }
            if(nTry == 0){
               var neighbors1 = graph.getNeighbors(id1);
               var neighbors2 = graph.getNeighbors(id2);
               var neighbors = neighbors1.concat(neighbors2);
               for(var neighbor of neighbors){
                  if(neighbor != id1 && neighbor != id2 && areAligned(id1,id2,neighbor)){
                     var edges1 = graph.getEdgesBetween(id1,neighbor);
                     var edges2 = graph.getEdgesBetween(id2,neighbor);
                     var edges3 = edges1.concat(edges2);
                     for(var iEdge = 0; iEdge < edges3.length; iEdge++){
                        var edge = edges3[iEdge];
                        var vInfo = visualGraph.getEdgeVisualInfo(edge);
                        if(!vInfo["radius-ratio"]){
                           validParameters = false;
                           nTry++;
                        }
                     }
                  }
               }
            }
         }while(!validParameters);
         // console.log(parameterSet[nTry])
         visualGraph.setEdgeVisualInfo(edgeID,parameterSet[nTry]);
      }
      for(var edge of edges){
         var vInfo = visualGraph.getEdgeVisualInfo(edge);
         if(!vInfo["radius-ratio"]){
            vInfo = {};
            visualGraph.setEdgeVisualInfo(edge,vInfo);
         }
      }
      visualGraph.graphDrawer.refreshEdgePosition(id1,id2);
   };

   function areAligned(id1,id2,id3){
      var vInfo1 = visualGraph.getVertexVisualInfo(id1); 
      var vInfo2 = visualGraph.getVertexVisualInfo(id2); 
      var vInfo3 = visualGraph.getVertexVisualInfo(id3);
      if(vInfo1.x != vInfo2.x){
         var a = (vInfo2.y - vInfo1.y)/(vInfo2.x - vInfo1.x);
         var b = vInfo1.y - a*vInfo1.x;     
         if(vInfo3.y < (a * vInfo3.x + b + 5) && vInfo3.y > (a * vInfo3.x + b - 5)){
            return true;
         }else{
            return false;
         }
      }else{
         if(vInfo3.x < (vInfo1.x + 5) && vInfo3.x > (vInfo1.x - 5)){
            return true;
         }else{
            return false;
         }
      }
   };

   /* ICONS  */

   this.addIcons = function(vertexId) {
      if(this.createEdgeEnabled && this.loopEnabled)
         this.addLoopIcon(vertexId);
      if(this.removeVertexEnabled)
         this.addCross(vertexId);
      if(this.terminalEnabled){
         if(this.allowMutlipleTerminal){
            this.addTerminalIcon(vertexId);
         }else{
            var terminal = this.getInitialOrTerminal(vertexId,"terminal");
            if(terminal == null || terminal == vertexId){
               if(this.allowSimultaneousInitialAndTerminal){
                  this.addTerminalIcon(vertexId);
               }else{
                  var info = graph.getVertexInfo(vertexId);
                  if(!info.initial){
                     this.addTerminalIcon(vertexId);
                  }
               }
            }
         }
      }
      if(this.initialEnabled){
         // if(this.allowMutlipleInitial){
         //    this.addInitialIcon(vertexId);
         // }else{
         //    var initial = this.getInitialOrTerminal(vertexId,"initial");
         //    if(initial == null || initial == vertexId){
               if(this.allowSimultaneousInitialAndTerminal){
                  this.addInitialIcon(vertexId);
               }else{
                  var info = graph.getVertexInfo(vertexId);
                  if(!info.terminal){
                     this.addInitialIcon(vertexId);
                  }
               }
            // }
         // }
      }
   };
   this.removeIcons = function(id) {
      // console.log("removeIcons")
      var raphObj = visualGraph.getRaphaelsFromID(id);
      if(self.loopIcon){
         // console.log("remove loop");
         self.loopIcon.remove();
         self.loopIcon = null;
         raphObj.pop();
      }
      if(self.cross){
         // console.log("remove cross "+id);
         self.cross.remove();
         self.cross = null;
         raphObj.pop();
      }
      if(self.terminalIcon){
         // console.log("remove terminal "+id);
         self.terminalIcon.remove();
         self.terminalIcon = null;
         raphObj.pop();
      }
      if(self.initialIcon){
         // console.log("remove initial");
         self.initialIcon.remove();
         self.initialIcon = null;
         raphObj.pop();
      }
   };

   this.getInitialOrTerminal = function(vID,state) {
      var vertices = graph.getAllVertices();
      var isState = null;
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         if(info[state]){
            isState = vertex;
            break;
         }
      }
      return isState;
   };

   this.addLoopIcon = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var size = 20;

      if(!vertexPos.tableMode){
         var X = vertexPos.x - vertexRadius - size;
         var Y = vertexPos.y - vertexRadius - 3*size/4;
      }else{
         var info = graph.getVertexInfo(vertexId);
         var content = (info.content) ? info.content : "";
         var boxSize = visualGraph.graphDrawer.getBoxSize(content);
         var X = vertexPos.x - boxSize.w/2 - size;
         var Y = vertexPos.y - boxSize.h/2 - 3*size/4;
      }
      
      if(self.loopIcon){
         self.loopIcon.remove();
      }
      self.loopIcon = self.drawLoopIcon(X,Y,size);
      visualGraph.pushVertexRaphael(vertexId,self.loopIcon);
      
      self.loopIcon.mousedown(function(){
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
      if(!vertexPos.tableMode){
         var crossX = vertexPos.x + vertexRadius;
         var crossY = vertexPos.y - vertexRadius - 3*crossSize/4;
      }else{
         var info = graph.getVertexInfo(vertexId);
         var content = (info.content) ? info.content : "";
         var boxSize = visualGraph.graphDrawer.getBoxSize(content);
         var crossX = vertexPos.x + boxSize.w/2;
         var crossY = vertexPos.y - boxSize.h/2 - 3*crossSize/4;
      }
      if(self.cross){
         self.cross.remove();
      }
      self.cross = self.drawCross(crossX,crossY,crossSize);
      visualGraph.pushVertexRaphael(vertexId,self.cross);
      
      self.cross.mousedown(function(){
         self.removeIcons(vertexId);
         if(self.vertexDragAndConnect){
            self.vertexDragAndConnect.selectionParent = null;
         }
         graph.removeVertex(vertexId);
         if(self.textEditor){
            self.textEditor.remove();
            self.editInfo = {};
         }
         if(callback){
            callback();
         }
      });
   };

   this.addEdgeCross = function(edgeID) {
         // console.log("add cross",edgeID)
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
         // console.log("click cross")
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
      // console.log("add Terminal")
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var size = 20;

      if(!vertexPos.tableMode){
         var X = vertexPos.x + vertexRadius;
         var Y = vertexPos.y + vertexRadius;
      }else{
         var info = graph.getVertexInfo(vertexId);
         var content = (info.content) ? info.content : "";
         var boxSize = visualGraph.graphDrawer.getBoxSize(content);
         var X = vertexPos.x + boxSize.w/2;
         var Y = vertexPos.y + boxSize.h/2;
      }
      
      if(self.terminalIcon){
         self.terminalIcon.remove();
      }
      self.terminalIcon = self.drawTerminalIcon(X,Y,size);
      visualGraph.pushVertexRaphael(vertexId,self.terminalIcon);
      
      self.terminalIcon.mousedown(function() {
         self.removeIcons(vertexId);
         self.setTerminal(vertexId);
      });
   };

   this.setTerminal = function(vID) {
      var info = graph.getVertexInfo(vID);
      info.terminal = !info.terminal;
      
      graph.setVertexInfo(vID,info);
      visualGraph.redraw();
      self.updateHandlers();
      
      if(callback){
         callback();
      }
   };

   this.drawTerminalIcon = function(x,y,size) {
      var qSize = size/4;
      var attr = {
         fill: "none",
         stroke: iconAttr.fill,
         "stroke-width": size/6
      }
      var circle1 = paper.circle(x + size/2,y + size/2,size/4).attr(attr);
      var circle2 = paper.circle(x + size/2,y + size/2,size/2).attr(attr);

      var overlay = paper.rect(x,y,size,size).attr(overlayAttr);
      return paper.set(circle1,circle2,overlay);
   };

   this.addInitialIcon = function(vertexId) {
      var vertexPos = visualGraph.getVertexVisualInfo(vertexId);
      var vertexRadius = visualGraph.graphDrawer.circleAttr.r;
      var size = 20;

      if(!vertexPos.tableMode){
         var X = vertexPos.x - vertexRadius - size;
         var Y = vertexPos.y + vertexRadius;
      }else{
         var info = graph.getVertexInfo(vertexId);
         var content = (info.content) ? info.content : "";
         var boxSize = visualGraph.graphDrawer.getBoxSize(content);
         var X = vertexPos.x - boxSize.w/2 - size;
         var Y = vertexPos.y + boxSize.h/2;
      }

      
      if(self.initialIcon){
         self.initialIcon.remove();
      }
      self.initialIcon = self.drawInitialIcon(X,Y,size);
      visualGraph.pushVertexRaphael(vertexId,self.initialIcon);
      
      self.initialIcon.mousedown(function(){
         self.removeIcons(vertexId);
         self.setInitial(vertexId);
      });
   };

   this.setInitial = function(vID) {
      var info = graph.getVertexInfo(vID);
      info.initial = !info.initial;      
      graph.setVertexInfo(vID,info);

      if(!self.allowMutlipleInitial){
         var vertices = graph.getAllVertices();
         for(var vertex of vertices){
            if(vertex != vID){
               var currInfo = graph.getVertexInfo(vertex);
               if(currInfo.initial){
                  currInfo.initial = false;      
                  graph.setVertexInfo(vertex,currInfo);
               }
            }
         }
      }
      visualGraph.redraw();
      self.updateHandlers();
      
      if(callback){
         callback();
      }
   };

   this.drawInitialIcon = function(x,y,size) {
      var qSize = size/4;
      var icon = paper.path(
         "M" + (x + size) + "," + y +
         "V" + (y + size/2) +
         "L" + (x + 7*qSize/2) + "," + (y + 3*qSize/2) +
         "L" + (x + qSize) + "," + (y + size) +
         "L" + x + "," + (y + 3*qSize) + 
         "L" + (x + 5*qSize/2) + "," + (y + qSize/2) + 
         "L" + (x + size/2) + "," + y + 
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
         if(!vertex2Pos.tableMode){
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
            /* table mode */
            var info1 = graph.getVertexInfo(vertex1);
            var content = (info1.content) ? info1.content : "";
            var boxSize = visualGraph.graphDrawer.getBoxSize(content);
            
            if(vertex1 === vertex2){
               /* loop */
               angle = vInfo.angle*Math.PI/180 || 0;
               angle = visualGraph.graphDrawer.bindAngle(angle);
               var R = visualGraph.graphDrawer.circleAttr.r*vInfo["radius-ratio"];
               
               var beta = Math.atan(boxSize.h/boxSize.w);   // angle between center of vertex and corner of box
               var surfPos = visualGraph.graphDrawer.getSurfacePointFromAngle(vertex1Pos.x,vertex1Pos.y,boxSize.w,boxSize.h,Math.PI - angle);
               if(angle <= beta && angle > -beta){
                  /* right side */
                  var xm = surfPos.x + R*3/2;
                  var ym = surfPos.y;
                  var x = xm - crossSize*1.2;
                  var y = ym - crossSize/2;
               }else if(angle <= Math.PI + beta && angle > Math.PI - beta){
                  /* left side */
                  var xm = surfPos.x - R*3/2;
                  var ym = surfPos.y;
                  var x = xm + crossSize/2;
                  var y = ym - crossSize/2;
               }else if(angle > beta && angle <= Math.PI - beta){
                  /* top */
                  var xm = surfPos.x;
                  var ym = surfPos.y - R*3/2;
                  var x = xm - crossSize/2;
                  var y = ym + crossSize/2;
               }else if(angle > Math.PI + beta || angle <= - beta){
                  /* bottom */
                  var xm = surfPos.x;
                  var ym = surfPos.y + R*3/2;
                  var x = xm - crossSize/2;
                  var y = ym - crossSize*1.2;
               }
            }else{
               var angle = visualGraph.graphDrawer.getAngleBetween(x1,y1,x2,y2);
               var s = vInfo["sweep"] || 0;
               var l = vInfo["large-arc"] || 0;
               var D = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
               var R = D*vInfo["radius-ratio"];
               if(vertex2Pos.tableMode){
                  var info = graph.getVertexInfo(vertex2);
                  var content = (info.content) ? info.content : "";
                  var boxSize = visualGraph.graphDrawer.getBoxSize(content);
                  
                  var alpha = (l) ? (Math.asin(D/(2*R)) + Math.PI) : Math.asin(D/(2*R));  
                  var angle2 = angle;
                  
                  if(vertex1Pos.tableMode){
                     if(s){
                        var alpha1 = (l) ? -angle2 - alpha : alpha - angle2;
                     }else{
                        var alpha1 = (l) ? alpha - angle2 : -angle2 - alpha;
                     }
                     var info1 = graph.getVertexInfo(vertex1);
                     var content1 = (info1.content) ? info1.content : "";
                     var boxSize1 = visualGraph.graphDrawer.getBoxSize(content1);
                     var delta = Math.PI - alpha1;
                     var pos1 = visualGraph.graphDrawer.getSurfacePointFromAngle(x1,y1,boxSize1.w,boxSize1.h,delta);
                  }else{
                     var pos1 = { x: x1, y: y1 };
                  }
                  if(s){
                     angle2 = (l) ? angle2 - alpha : angle2 + alpha;
                  }else{
                     angle2 = (l) ? angle2 + alpha : angle2 - alpha;
                  }

                  var pos2 = visualGraph.graphDrawer.getSurfacePointFromAngle(x2,y2,boxSize.w,boxSize.h,angle2);

                  var D2 = Math.sqrt(Math.pow((pos2.x-pos1.x),2) + Math.pow((pos2.y-pos1.y),2));
                  var R = D2*vInfo["radius-ratio"];
                  var cPos = visualGraph.graphDrawer.getCenterPosition(R,s,l,pos1,pos2);
               }else{
                  var cPos = visualGraph.graphDrawer.getCenterPosition(R,s,l,vertex1Pos,vertex2Pos);
               }
               if(vInfo["radius-ratio"] == 0.5){
                  R += 10;
               }
               var xm = (s) ? cPos.x + R*Math.sin(angle) : cPos.x - R*Math.sin(angle);
               var ym = (s) ? cPos.y - R*Math.cos(angle) : cPos.y + R*Math.cos(angle);
               
               var x = (s) ? xm - (crossSize/2)*Math.sin(angle) - crossSize/2 : xm + (crossSize/2)*Math.sin(angle) - crossSize/2;
               var y = (s) ? ym + (crossSize/2 + margin)*Math.cos(angle) - crossSize/2 : ym - (crossSize/2 + margin)*Math.cos(angle) - crossSize/2;
            }
         }
      }else{
         var xm = (x2 + x1)/2;
         var ym = (y2 + y1)/2;
         var x = xm - crossSize/2;
         var y = ym - crossSize/2;
         if(x1 < x2){
            var x = xm - (crossSize/2)*Math.sin(angle) - crossSize/2;
            var y = ym + (crossSize/2)*Math.cos(angle) - crossSize/2;
         }else{
            var x = xm + (crossSize/2)*Math.sin(angle) - crossSize/2;
            var y = ym - (crossSize/2)*Math.cos(angle) - crossSize/2;
         }
      }
      return {x:x,y:y};
   };

   this.updateHandlers = function() {
      this.vertexDragAndConnect.setEnabled(false);
      this.arcDragger.setEnabled(false);
      settings.graphMouse = new GraphMouse("mouse", graph, visualGraph);
      this.vertexDragAndConnect = new VertexDragAndConnect(settings);
      this.vertexDragAndConnect.setEnabled(true);
      this.arcDragger = new ArcDragger({
         paper: paper,
         paperElementID: settings.paperElementID,
         graph: graph,
         visualGraph: visualGraph,  
         graphMouse: settings.graphMouse,
         onEdgeSelect: onEdgeSelect,
         callback: settings.callback,
         enabled: true
      });
      this.setVertexDragEnabled(this.vertexDragEnabled);
      this.setVertexSelectEnabled(this.vertexSelectEnabled);
      this.setEdgeDragEnabled(this.edgeDragEnabled);
      if(this.gridEnabled)
         this.setGridEnabled(this.gridEnabled.snapToGrid,this.gridEnabled.gridX,this.gridEnabled.gridY);
      this.setDefaultSettings();
      // if(this.updateHandlersCallback){
      //    this.updateHandlersCallback();
      // }
   };

   this.editLabel = function(id,type) {
      if(self.editLabelCondition){
         if(self.editLabelCondition(id,type) === false){
            return
         }
      }
      if(type === "vertex" && this.editVertexLabelEnabled){
         var info = graph.getVertexInfo(id);
         var attr = visualGraph.graphDrawer.vertexLabelAttr;
         var labelPos = visualGraph.getVertexVisualInfo(id);
         if(labelPos.tableMode){
            var content = (info.content) ? info.content : "";
            var boxSize = visualGraph.graphDrawer.getBoxSize(content);
            var labelHeight = 2*attr["font-size"];
         }
         var maxLength = self.maxVertexLabelLength || 100;
      }else if(type === "edge" && self.editEdgeLabelEnabled){
         $(document).off("keydown");
         var info = graph.getEdgeInfo(id);
         var attr = visualGraph.graphDrawer.edgeLabelAttr;
         var labelPos = visualGraph.graphDrawer.getLabelPos(id);
         var maxLength = self.maxEdgeLabelLength || 100;
      }else{
         return
      }
      var fontSize = attr["font-size"] || 15;
      var label = info.label || "";
      var raphElement = visualGraph.getRaphaelsFromID(id);
      raphElement[1].hide();
      self.textEditor = $("<input id=\"textEditor\" value=\""+label+"\" maxlength=\""+maxLength+"\">");
      self.editInfo = {id: id, type: type, field: "label"};
      $("#"+paperId).css("position","relative");

      self.textEditor.css({
         position: "absolute",
         left: labelPos.x,
         top: (labelPos.tableMode) ? labelPos.y - boxSize.h/2 + labelHeight/2 : labelPos.y,
         width: label.toString().length * fontSize,
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
      self.textEditor.keypress(function(event){ // write when return is pressed
         if(event.which == 13){
            self.writeLabel(id,type);
         }
      });
   };

   this.writeLabel = function(id,type) {
      // console.log("writeLabel")
      if(type === "vertex"){
         var info = graph.getVertexInfo(id);
      }else if(type === "edge"){
         var info = graph.getEdgeInfo(id);
      }else{
         console.log("type error");
         return;
      }
      var oldLabel = info.label || "";
      var newLabel = (self.textEditor) ? self.textEditor.val().trim() : "";

      if(self.alphabet){
         for(var iLetter = 0; iLetter < newLabel.length; iLetter++){
            var letter = newLabel.charAt(iLetter);
            if(letter != " " && !self.alphabet.includes(letter)){
               newLabel = oldLabel;
               break;
            }
         }
      }
      if(type == "vertex" && self.vertexLabelValidation){
         if(!self.vertexLabelValidation(id,newLabel)){
            newLabel = oldLabel;
         }
      }
      var raphElement = visualGraph.getRaphaelsFromID(id);
      if(oldLabel !== newLabel){
         if(newLabel != ""){
            info.label = newLabel;
         }else{
            delete info.label;
         }
         self.edited = true;
         if(type === "vertex"){
            graph.setVertexInfo(id,info);
            raphElement[1].attr("text",newLabel);
         }else{
            graph.setEdgeInfo(id,info);
            var labelPos = visualGraph.graphDrawer.getLabelPos(id);
            raphElement[1].attr({
               text:newLabel,
               x: labelPos.x,
               y: labelPos.y
            });
         }
      }
      if(self.textEditor){
         self.textEditor.remove();
         self.editInfo = {};
      }
      raphElement[1].show();
      if(callback){
         callback();
      }
   };

   this.editContent = function(id) {
      if(!self.editVertexContentEnabled){
         return;
      }
      var info = graph.getVertexInfo(id);
      var attr = visualGraph.graphDrawer.vertexContentAttr;
      var fontSize = attr["font-size"] || 15;
      var vertexPos = visualGraph.getVertexVisualInfo(id);
      var content = (info.content) ? info.content : "";
      var boxSize = visualGraph.graphDrawer.getBoxSize(content);
      var labelHeight = 2*visualGraph.graphDrawer.vertexLabelAttr["font-size"];
      
      var raphElement = visualGraph.getRaphaelsFromID(id);
      raphElement[3].hide();
      self.textEditor = $("<textarea id=\"textEditor\">"+content+"</textarea>");
      self.editInfo = {id: id, type: "vertex", field: "content"};
      $("#"+paperId).css("position","relative");

      var textAlign = attr["text-anchor"] || "middle";
      switch(textAlign){
         case "middle":
            var editorAlign = "center";
            break;
         case "start":
            var editorAlign = "left";
            break;
         case "end":
            var editorAlign = "right";
            break;
      }
      self.textEditor.css({
         position: "absolute",
         left: vertexPos.x - boxSize.w/2,
         top: vertexPos.y - boxSize.h/2 + labelHeight,
         width: boxSize.w - 20,
         height: boxSize.h - labelHeight,
         "text-align": editorAlign,
         "padding": "0 10px",
         background: "none",
         border: "none",
         color: attr.fill || "black",
         "font-family": "Arial, sans-serif"
      });
      self.textEditor.css(attr);
      $("#"+paperId).append(self.textEditor);
      self.textEditor.focus();

      self.textEditor.keyup(function(){ // resize vertex & textarea when text length changes
         var text = $(this).val();
         self.resizeTableVertex(id,text);
      });

      self.textEditor.focusout(function(ev){
         if(self.contentValidation){
            var text = $(this).val();
            self.editInfo.validContent = self.contentValidation(text,id);
         }else{
            self.editInfo.validContent = true;
         }
         if(self.editInfo.validContent){
            self.vertexDragAndConnect.allowDeselection = true;
            self.vertexDragAndConnect.dragEnabled = self.vertexDragEnabled;
            self.graphDragger.dragEnabled = self.graphDragEnabled;
            self.writeContent(id);
         }else{
            $(this).focus();
            self.vertexDragAndConnect.allowDeselection = false;
            self.vertexDragAndConnect.dragEnabled = false;
            self.graphDragger.dragEnabled = false;
         }
      });
   };

   this.writeContent = function(id) {
      // console.log(id);
      var info = graph.getVertexInfo(id);
      var oldContent = info.content || "";
      var newContent = (self.textEditor) ? self.textEditor.val().trim() : "";

      var raphElement = visualGraph.getRaphaelsFromID(id);
      if(oldContent !== newContent){
         info.content = newContent;
         graph.setVertexInfo(id,info);
         self.edited = true;
      }
 
      if(self.textEditor){
         self.textEditor.remove();
         if(!self.editInfo.clickedVertex)
            self.editInfo = {};
      }

      if(self.edited){
         visualGraph.redraw();
         self.updateHandlers();
      }else{
         raphElement[3].show();
      }
      if(self.editInfo.clickedVertex && self.edited){
         self.vertexDragAndConnect.selectionParent = null;
         var clickedVertex = self.editInfo.clickedVertex;
         var x = self.editInfo.x;
         var y = self.editInfo.y;
         // self.editInfo = {};
         self.vertexDragAndConnect.clickHandler(clickedVertex,x,y);
      }
      if(self.writeContentCallback){
         self.writeContentCallback(id,self.edited);
      }
      if(callback){
         callback();
      }
   };

   this.resizeTableVertex = function(id,text) {
      // console.log("resizeTableVertex")
      var raphElement = visualGraph.getRaphaelsFromID(id);
      var newBoxSize = visualGraph.graphDrawer.getBoxSize(text);
      var info = graph.getVertexInfo(id);
      var vertexPos = visualGraph.getVertexVisualInfo(id);
      var labelHeight = 2*visualGraph.graphDrawer.vertexLabelAttr["font-size"];
      raphElement[0].transform(""); // box
      raphElement[0].attr({   
         x: vertexPos.x - newBoxSize.w/2,
         y: vertexPos.y - newBoxSize.h/2,
         height: newBoxSize.h,
         width: newBoxSize.w
      });
      raphElement[1].transform(""); // label
      raphElement[1].attr({   
         x: vertexPos.x,
         y: vertexPos.y - newBoxSize.h/2 +labelHeight/2
      });
      raphElement[2].transform(""); // line
      raphElement[2].attr("path","M"+(vertexPos.x - newBoxSize.w/2)+","+(vertexPos.y - newBoxSize.h/2 + labelHeight)+"H"+(vertexPos.x + newBoxSize.w/2));
      if(info.initial && !info.terminal){

      }else if(!info.initial && info.terminal){
         raphElement[4].transform(""); 
         raphElement[4].attr({
            x: vertexPos.x - newBoxSize.w/2 - 5,
            y: vertexPos.y - newBoxSize.h/2 - 5,
            height: newBoxSize.h + 10,
            width: newBoxSize.w + 10
         });
      }else if(info.initial && info.terminal){

      }
      if(self.textEditor){
         self.textEditor.css({
            left: vertexPos.x - newBoxSize.w/2,
            top: vertexPos.y - newBoxSize.h/2 + labelHeight,
            width: newBoxSize.w - 20,
            height: newBoxSize.h - labelHeight
         });
      }
      // var oldContent = info.content;
      self.removeIcons(id);
      // info.content = text;
      // self.addIcons(id);
      // info.content = oldContent;
      if(self.resizeTableVertexCallback){
         self.resizeTableVertexCallback(id,vertexPos,newBoxSize);
      }
   };

   this.startDragCallback = function(ID,x,y) {
      // console.log("start drag callback "+ID);
      if(self.textEditor){
         self.editInfo.clickedVertex = ID;
         self.editInfo.x = x;
         self.editInfo.y = y;
         self.textEditor.focusout();
         return
      }
      if(self.textEditor && !(self.editInfo.field == "content" && self.editInfo.validContent == false)){
         // console.log(self.editInfo)
         var vertices = graph.getAllVertices();
         for(var iVertex = 0; iVertex < vertices.length; iVertex++){
            var vertexRaph = visualGraph.getRaphaelsFromID(vertices[iVertex]);

               if(self.editInfo.id == vertices[iVertex]){
                  if(self.editInfo.field == "label"){
                     self.writeLabel(self.editInfo.id,self.editInfo.type);
                  }else{
                     // console.log("startDragCallback write"+self.editInfo.id)
                     self.writeContent(self.editInfo.id);
                  }
               }
               self.textEditor.remove();
            
            if(vertexRaph[1])
               vertexRaph[1].show();
            if(vertexRaph[3])
               vertexRaph[3].show();
         }
      }
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edgeRaph = visualGraph.getRaphaelsFromID(edges[iEdge]);
         if(self.edgeTextEditor)
            self.edgeTextEditor.remove();
         edgeRaph[1].show();
         }
      self.arcDragger.unselectAll();

      if(startDragCallbackCallback){
         startDragCallbackCallback(ID);
      }
   };

   this.isGoodPosition = function(vID,position) {
      var vertices = graph.getAllVertices();
      var vInfo = visualGraph.getVertexVisualInfo(vID);
      if(vInfo.tableMode){
         var info = graph.getVertexInfo(vID);
         var content = info.content || "";
         var boxSize = visualGraph.graphDrawer.getBoxSize(content);
      }
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         if(vertex != vID){
            var vInfo2 = visualGraph.getVertexVisualInfo(vertex);
            if(vInfo2.tableMode){
               var info2 = graph.getVertexInfo(vID);
               var content2 = info2.content || "";
               var boxSize2 = visualGraph.graphDrawer.getBoxSize(content2);
               if(vInfo.tableMode){
                  if(Math.abs(vInfo.x - vInfo2.x) < (boxSize.w/2 + boxSize2.w/2) && Math.abs(vInfo.y - vInfo2.y) < (boxSize.h/2 + boxSize2.h/2)){
                     return false;
                  }
               }else{
                  if(Math.abs(vInfo.x - vInfo2.x) < (visualGraph.graphDrawer.circleAttr.r + boxSize2.w/2) && Math.abs(vInfo.y - vInfo2.y) < (visualGraph.graphDrawer.circleAttr.r + boxSize2.h/2)){
                     return false;
                  }
               }
            }else{
               if(vInfo.tableMode){
                  if(Math.abs(vInfo.x - vInfo2.x) < (boxSize.w/2 + visualGraph.graphDrawer.circleAttr.r) && Math.abs(vInfo.y - vInfo2.y) < (boxSize.h/2 + visualGraph.graphDrawer.circleAttr.r)){
                     return false;
                  }
               }else{
                  if(Math.abs(vInfo.x - vInfo2.x) < 2*visualGraph.graphDrawer.circleAttr.r && Math.abs(vInfo.y - vInfo2.y) < 2*visualGraph.graphDrawer.circleAttr.r ){
                     return false;
                  }
               }
            }
         }
      }
      return true;
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
      this.vertexDragAndConnect.setUnselectAllEdges(this.unselectAllEdges);
      this.vertexDragAndConnect.setStartDragCallback(this.startDragCallback);
      this.vertexDragAndConnect.setIsGoodPosition(this.isGoodPosition);
      this.vertexDragAndConnect.setClickHandlerCallback(this.clickHandlerCallback);
      this.vertexDragAndConnect.snapToLastGoodPosition = true;
      this.arcDragger.setStartDragCallback(this.startDragCallback);
      this.arcDragger.setEditEdgeLabel(this.editLabel);
      this.arcDragger.setUnselectAll(this.unselectAllEdges);
      this.graphDragger.setUnselectAllEdges(this.unselectAllEdges);
   };
   
   this.setDefaultSettings();
   
   if(settings.enabled) {
      this.setEnabled(true);
   }
};
