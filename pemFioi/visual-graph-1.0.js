function VisualGraph(id, paper, graph, graphDrawer, autoDraw, vertexVisualInfo, edgeVisualInfo) {
   this.id = id;
   this.paper = paper;
   this.graph = graph;
   this.graphDrawer = graphDrawer;
   this.hasDrawing = false;

   if(vertexVisualInfo) {
      this.vertexVisualInfo = vertexVisualInfo;
   }
   else {
      this.vertexVisualInfo = {};
   }
   if(edgeVisualInfo) {
      this.edgeVisualInfo = edgeVisualInfo;
   }
   else {
      this.edgeVisualInfo = {};
   }
   this.edgeRaphaels = {};
   this.vertexRaphaels = {};
   var self = this;

   this.listener = {
      addVertex: function(id, info) {
         self._drawVertex(id, info);
         return true;
      },
      addEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
         self._drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo);
         return true;
      },
      removeVertex: function(id, info) {
         self._eraseVertex(id, info);
         delete self.vertexVisualInfo[id];
         return true;
      },
      removeEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
         self._eraseEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo);
         delete self.edgeVisualInfo[id];
         return true;
      }
   };
   this.priority = 1000;

   this._attachRaphaelID = function(elements, id) {
      for(var iElement in elements) {
         elements[iElement].data("id", id);
      }
   };

   this._initDrawer = function() {
      if(!this.hasDrawing && this.graphDrawer.init) {
         this.graphDrawer.init(this.paper, this.graph, this);
      }
      this.hasDrawing = true;
   };

   this.setAutoDraw = function(autoDraw) {
      if(autoDraw == this.autoDraw) {
         return;
      }
      this.autoDraw = autoDraw;
      if(autoDraw) {
         this.graph.addPostListener(this.id, this.listener, this.priority);
      }
      else {
         this.graph.removePostListener(this.id);
      }
   };

   this.redraw = function() {
      this._removeGraphics();
      var vertices = this.graph.getAllVertices();
      for(var iVertex in vertices) {
         this._drawVertex(vertices[iVertex], this.graph.getVertexInfo(vertices[iVertex]));
      }
      var edges = this.graph.getAllEdges();
      for(var iEdge in edges) {
         var edgeVertices = this.graph.getEdgeVertices(edges[iEdge]);
         var vertex1 = edgeVertices[0];
         var vertex2 = edgeVertices[1];
         var vertex1Info = this.graph.getVertexInfo(vertex1);
         var vertex2Info = this.graph.getVertexInfo(vertex2);
         var edgeInfo = this.graph.getEdgeInfo(edges[iEdge]);
         this._drawEdge(edges[iEdge], vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo);
      }
      if(this.graphDrawer.drawingComplete) {
         this.graphDrawer.drawingComplete();
      }
   };

   this._removeGraphics = function() {
      if(!this.hasDrawing) {
         return;
      }
      for(var edgeID in this.edgeRaphaels) {
         this._eraseEdge(edgeID);
      }
      for(var vertexID in this.vertexRaphaels) {
         this._eraseVertex(vertexID);
      }
      if(this.graphDrawer.deinit) {
         this.graphDrawer.deinit();
      }
      this.hasDrawing = false;
   };

   this._drawVertex = function(id, info) {
      self._initDrawer();
      if(!self.vertexVisualInfo[id]) {
         self.vertexVisualInfo[id] = {};
      }
      if(self.graphDrawer.drawVertex) {
         self.vertexRaphaels[id] = self.graphDrawer.drawVertex(id, info, self.vertexVisualInfo[id]);
         self._attachRaphaelID(self.vertexRaphaels[id], id);
      }
      else {
         self.vertexRaphaels[id] = [];
      }
   };

   this._drawEdge = function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
      self._initDrawer();
      if(!self.edgeVisualInfo[id]) {
         self.edgeVisualInfo[id] = {};
      }
      if(self.graphDrawer.drawEdge) {
         self.edgeRaphaels[id] = self.graphDrawer.drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, self.vertexVisualInfo[vertex1], self.vertexVisualInfo[vertex2], edgeInfo, self.edgeVisualInfo[id]);
         self._attachRaphaelID(self.edgeRaphaels[id], id);
      }
      else {
         self.edgeRaphaels[id] = [];
      }
   };

   this._eraseVertex = function(id, info) {
      if(this.graphDrawer.eraseVertex) {
         this.graphDrawer.eraseVertex(id, info, self.vertexVisualInfo[id]);
      }
      for(var iElement in this.vertexRaphaels[id]) {
         var element = this.vertexRaphaels[id][iElement];
         if(element && element.remove) {
            element.remove();
         }
      }
      delete self.vertexRaphaels[id];
   };

   this._eraseEdge = function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
      if(this.graphDrawer.eraseEdge) {
         this.graphDrawer.eraseEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, self.vertexVisualInfo[vertex1], self.vertexVisualInfo[vertex2], edgeInfo, self.edgeVisualInfo[id]);
      }
      for(var iElement in this.edgeRaphaels[id]) {
         var element = this.edgeRaphaels[id][iElement];
         if(element && element.remove) {
            element.remove();
         }
      }
      delete self.edgeRaphaels[id];
   };

   this.remove = function() {
      this._removeGraphics();
      this.setAutoDraw(false);
   };

   this.pushVertexRaphael = function(id, element) {
      if(!this.vertexRaphaels[id]) {
         return;
      }
      this.vertexRaphaels[id].push(element);
      element.data("id", id);
   };

   this.popVertexRaphael = function(id) {
      if(!this.vertexRaphaels[id] || !this.vertexRaphaels[id].length) {
         return;
      }
      return this.vertexRaphaels[id].pop();
   };

   this.pushEdgeRaphael = function(id, element) {
      if(!this.edgeRaphaels[id]) {
         return;
      }
      this.edgeRaphaels[id].push(element);
      element.data("id", id);
   };

   this.popEdgeRaphael = function(id) {
      if(!this.edgeRaphaels[id] || !this.edgeRaphaels[id].length) {
         return;
      }
      return this.edgeRaphaels[id].pop();
   };

   this.setVertexVisualInfo = function(id, info) {
      this.vertexVisualInfo[id] = info;
   };

   this.getVertexVisualInfo = function(id) {
      return this.vertexVisualInfo[id];
   };

   this.setEdgeVisualInfo = function(id, info) {
      this.edgeVisualInfo[id] = info;
   };

   this.getEdgeVisualInfo = function(id) {
      return this.edgeVisualInfo[id];
   };

   this.getRaphaelsFromID = function(id) {
      if(this.vertexRaphaels[id]) {
         return this.vertexRaphaels[id];
      }
      if(this.edgeRaphaels[id]) {
         return this.edgeRaphaels[id];
      }
      return [];
   };

   this.elementToFront = function(id) {
      var raphaels = this.getRaphaelsFromID(id);
      for(var iElement in raphaels) {
         raphaels[iElement].toFront();
      }
   };

   this.setPaper = function(paper) {
      this.paper = paper;
   };

   this.setDrawer = function(graphDrawer) {
      this.graphDrawer = graphDrawer;
   };

   this.getGraph = function() {
      return this.graph;
   };

   this.toJSON = function() {
      return JSON.stringify({
         vertexVisualInfo: this.vertexVisualInfo,
         edgeVisualInfo: this.edgeVisualInfo,
         minGraph: this.graph.toMinimized()
      });
   };

   this.setAutoDraw(autoDraw);
   if(autoDraw) {
      this.redraw();
   }
}

VisualGraph.fromJSON = function(visualGraphStr, id, paper, graph, graphDrawer, autoDraw) {
   var visualInfo = JSON.parse(visualGraphStr);
   if(!graph) {
      graph = Graph.fromMinimized(visualInfo.minGraph);
   }
   return new VisualGraph(id, paper, graph, graphDrawer, autoDraw, visualInfo.vertexVisualInfo, visualInfo.edgeVisualInfo);
};

function SimpleGraphDrawer(circleAttr, lineAttr, vertexDrawer, autoMove, vertexMover, thickMode, innerLineAttr) {
   this.circleAttr = circleAttr;
   this.lineAttr = lineAttr;
   this.init = function(paper, graph, visualGraph) {
      this.paper = paper;
      this.graph = graph;
      this.visualGraph = visualGraph;
      this.customElements = {};
      this.originalPositions = {};
   };
   this.drawVertex = function(id, info, visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;

      var result = [this.paper.circle(pos.x, pos.y).attr(this.circleAttr)];
      if(vertexDrawer) {
         var raphaels = vertexDrawer(id, info, pos.x, pos.y);
         this._addCustomElements(id, raphaels);
         result = result.concat(raphaels);
      }
      return result;
   };
   this.drawEdge = function(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      if(thickMode) {
         var path = this._getThickEdgePath(vertex1, vertex2);
         return [this.paper.path(path).attr(this.lineAttr).toBack(), this.paper.path(path).attr(innerLineAttr)];
      }
      else {
         return [this.paper.path(this._getEdgePath(vertex1, vertex2)).attr(this.lineAttr).toBack()];
      }
   };
   this._getVertexPosition = function(visualInfo) {
      if(visualInfo.x === undefined || visualInfo.x === null) {
         visualInfo.x = 0;
         visualInfo.y = 0;
      }
      return {
         x: visualInfo.x,
         y: visualInfo.y
      };
   };
   this.getVertexPosition = function(id) {
      return this._getVertexPosition(this.visualGraph.getVertexVisualInfo(id));
   };
   this._addCustomElements = function(id, raphaels) {
      // Save original attributes. This allows us to move the object later by transformation.
      this.customElements[id] = [];
      for(var iElement in raphaels) {
         var raphael = raphaels[iElement];
         this.customElements[id].push({
            raphael: raphael,
            originalAttrs: $.extend(true, {}, raphael.attrs)
         });
      }
   };
   this.moveVertex = function(id, x, y) {
      var info = this.visualGraph.getVertexVisualInfo(id);
      info.x = x;
      info.y = y;
      var raphaels = this.visualGraph.getRaphaelsFromID(id);
      raphaels[0].attr({
         cx: x,
         cy: y
      });

      // Move the custom Raphael objects.
      if(vertexMover) {
         vertexMover(id, raphaels, x, y);
      }
      if(autoMove) {
         this._moveCustomElements(id, x, y);
      }

      var childrenIDs = this.graph.getChildren(id);
      for(var iChild in childrenIDs) {
         this.refreshEdgePosition(id, childrenIDs[iChild]);
      }
      if(this.graph.directed) {
         var parentIDs = this.graph.getParents(id);
         for(var iParent in parentIDs) {
            this.refreshEdgePosition(parentIDs[iParent], id);
         }
      }
   };
   this._moveCustomElements = function(id, x, y) {
      var elements = this.customElements[id];
      var transformation = ["T", x - this.originalPositions[id].x, y - this.originalPositions[id].y];
      for(var iElement in elements) {
         var element = elements[iElement];
         // Paths get transformed using Raphael.transformPath,
         // for compatibility. Other objects get transformed normally.
         if(element.raphael.type === "path") {
            element.raphael.attr({path: Raphael.transformPath(element.originalAttrs.path, transformation)});
         }
         else {
            element.raphael.transform(transformation);
         }
      }
   };
   this.refreshEdgePosition = function(vertex1, vertex2) {
      var edges = this.graph.getEdgesFrom(vertex1, vertex2);
      var info1 = this.visualGraph.getVertexVisualInfo(vertex1);
      var info2 = this.visualGraph.getVertexVisualInfo(vertex2);
      var newPath;
      if(thickMode) {
         newPath = this._getThickEdgePath(vertex1, vertex2);
      }
      else {
         newPath = this._getEdgePath(vertex1, vertex2);
      }
      for(var iEdge in edges) {
         var edgeID = edges[iEdge];
         var raphaels = this.visualGraph.getRaphaelsFromID(edgeID);
         raphaels[0].attr("path", newPath);
         if(thickMode) {
            raphaels[1].attr("path", newPath);
         }
      }
   };
   this._getEdgePath = function(vertex1, vertex2) {
      var info1 = this.visualGraph.getVertexVisualInfo(vertex1);
      var info2 = this.visualGraph.getVertexVisualInfo(vertex2);
      var x1 = info1.x, y1 = info1.y, x2 = info2.x, y2 = info2.y;
      var r = this.circleAttr.r;
      /*
       * We want to draw an edge from the center of one circle toward the center
       * of another, but only up to its surface. Otherwise the arrow would be
       * inside the target circle.
       * The line between centers goes from x1,y1 to x2,y2, and we want to
       * chop length r from it. We call the denote by w,h the displacement
       * from x2,y2.
       */

      // Same X coordinate.
      if(x1 == x2) {
         if(y1 < y2) {
            return ["M", x1, y1, "L", x2, y2 - r];
         }
         else {
            return ["M", x1, y1, "L", x2, y2 + r];
         }
      }
      // Swap for convenience. x1,y1 is always to the left.
      var swap = false;
      if(x1 > x2) {
         swap = true;
         var temp = x1;
         x1 = x2;
         x2 = temp;
         temp = y1;
         y1 = y2;
         y2 = temp;
      }
      // We have h^2 + w^2 = r^2 and (y2-y1)/(x2-x1) = h/w.
      var slope = 1.0 * (y2 - y1) / (x2 - x1);
      var w = (r / Math.sqrt((1 + slope * slope)));
      var h = (slope * w);
      if(!swap) {
         return ["M", x1, y1, "L", x2 - w, y2 - h];
      }
      else {
         return ["M", x2, y2, "L", x1 + w, y1 + h];
      }
   };
   this._getThickEdgePath = function(vertex1, vertex2) {
      var info1 = this.visualGraph.getVertexVisualInfo(vertex1);
      var info2 = this.visualGraph.getVertexVisualInfo(vertex2);
      var x1 = info1.x, y1 = info1.y, x2 = info2.x, y2 = info2.y;
      return ["M", x1, y1, "L", x2, y2];
   };
   this.setCircleAttr = function(circleAttr) {
      this.circleAttr = circleAttr;
   };
   this.setLineAttr = function(lineAttr) {
      this.lineAttr = lineAttr;
   };
   this.reapplyAttr = function() {
      var vertices = this.graph.getAllVertices();
      for(var iVertex in vertices) {
         this.visualGraph.getRaphaelsFromID(vertices[iVertex])[0].attr(this.circleAttr);
      }
      var edges = this.graph.getAllEdges();
      for(var iEdge in edges) {
         var raphaels = this.visualGraph.getRaphaelsFromID(edges[iEdge]);
         raphaels[0].attr(this.lineAttr);
         if(thickMode) {
            raphaels[1].attr(innerLineAttr);
         }
      }
   };
   this.getDistanceFromVertex = function(id, xPos, yPos) {
      var vertexPos = this.getVertexPosition(id);
      var xDistance = xPos - vertexPos.x;
      var yDistance = yPos - vertexPos.y;
      var distanceFromCenter = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      if(distanceFromCenter <= this.circleAttr.r) {
         return 0;
      }
      return distanceFromCenter - this.circleAttr.r;
   };
   this.getDistanceFromEdge = function(id, xPos, yPos) {
      var edgePath = this.visualGraph.getRaphaelsFromID(id)[0].attrs.path;
      var x1, y1, x2, y2;
      // In modern browsers the path is an array and we can get the endpoints
      // directly. In old browsers it may be a comma separated string.
      if($.isArray(edgePath)) {
         if($.isArray(edgePath[0])) {
            // Path a 2D array: [["M", x1, y1], ["L", x2, y2]]
            x1 = parseInt(edgePath[0][1]);
            y1 = parseInt(edgePath[0][2]);
            x2 = parseInt(edgePath[1][1]);
            y2 = parseInt(edgePath[1][2]);
         }
         else {
            // Path is an array: ["M", x1, y1, "L", x2, y2]
            x1 = parseInt(edgePath[1]);
            y1 = parseInt(edgePath[2]);
            x2 = parseInt(edgePath[4]);
            y2 = parseInt(edgePath[5]);
         }
      }
      else {
         // Path is a string: "M,x1,y1,L,x2,y2"
         var parts = edgePath.split(",");
         x1 = parseInt(parts[1]);
         y1 = parseInt(parts[2]);
         x2 = parseInt(parts[4]);
         y2 = parseInt(parts[5]);
      }
      return Math.sqrt(distanceToSegmentSquared(xPos, yPos, x1, y1, x2, y2));
   };
   
   function distanceSquared(x1, y1, x2, y2) {
      return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
   }
   
   function distanceToSegmentSquared(xPos, yPos, x1, y1, x2, y2) {
      // Use algorithm for distance between point and segment.
      // See: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/1501725#1501725
      var lengthSquared = distanceSquared(x1, y1, x2, y2);
      if(lengthSquared === 0) {
         return distanceSquared(xPos, yPos, x1, y1);
      }
      var t = ((xPos - x1) * (x2 - x1) + (yPos - y1) * (y2 - y1)) / lengthSquared;
      t = Math.max(0, Math.min(1, t));
      return distanceSquared(xPos, yPos, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
   }
}
