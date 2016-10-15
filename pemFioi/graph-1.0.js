function Graph(directed) {
   this.directed = directed;
   // ID -> {childID: {edgeID1, edgeID2, ...}}
   this.children = {};
   // ID -> {parentID}
   this.parents = {};
   // ID -> Indegre
   this.indegree = {};
   // ID -> Outdegree
   this.outdegree = {};
   // ID -> Info object.
   this.vertexInfo = {};
   this.edgeInfo = {};
   // ID -> [ID1, ID2]
   this.edgeVertices = {};
   this.numEdges = 0;
   this.numVertices = 0;
   /* Array of {
    *    id: ID,
    *    object: listener object,
    *    priority: priority
    *    }
    * sorted by priority (increasing).
    */
   this.preListeners = [];
   this.postListeners = [];

   this.addVertex = function(id, info) {
      if(this._invokeListeners(this.preListeners, "addVertex", [id, info]) === false) {
         return false;
      }
      if(info === undefined || info === null) {
         info = {};
      }
      this.vertexInfo[id] = info;
      this.indegree[id] = 0;
      this.outdegree[id] = 0;
      this.children[id] = {};
      this.parents[id] = {};
      this.numVertices++;
      this._invokeListeners(this.postListeners, "addVertex", [id, info]);
      return true;
   };

   this.addEdge = function(id, vertex1, vertex2, info) {
      if(this._invokeListeners(this.preListeners, "addEdge", [id, vertex1, vertex2, this.vertexInfo[vertex1], this.vertexInfo[vertex2], info]) === false) {
         return false;
      }
      if(!this.children[vertex1] && !this.addVertex(vertex1)) {
         return false;
      }
      if(!this.children[vertex2] && !this.addVertex(vertex2)) {
         return false;
      }

      if(info === undefined || info === null) {
         info = {};
      }
      this.edgeVertices[id] = [vertex1, vertex2];
      this.edgeInfo[id] = info;
      this._addChild(id, vertex1, vertex2);
      this.numEdges++;
      this._invokeListeners(this.postListeners, "addEdge", [id, vertex1, vertex2, this.vertexInfo[vertex1], this.vertexInfo[vertex2], info]);
      return true;
   };

   this._addChild = function(edgeID, vertex1, vertex2) {
      if(!this.children[vertex1][vertex2]) {
         this.children[vertex1][vertex2] = {};
      }
      this.children[vertex1][vertex2][edgeID] = true;
      this.parents[vertex2][vertex1] = true;

      this.indegree[vertex2]++;
      this.outdegree[vertex1]++;
   };

   this.isEdge = function(id) {
      return this.edgeVertices[id] !== undefined && this.edgeVertices[id] !== null;
   };

   this.isVertex = function(id) {
      return this.children[id] !== undefined && this.children[id] !== null;
   };

   this.hasNeighbor = function(id1, id2) {
      return !!this.children[id1][id2] || !!this.children[id2][id1];
   };

   this.hasChild = function(id1, id2) {
      return !!this.children[id1][id2];
   };

   this._getDirectedEdgesFrom = function(id1, id2) {
      var result = [];
      for(var edgeID in this.children[id1][id2]) {
         result.push(edgeID);
      }
      return result;
   };

   this.getEdgesFrom = function(id1, id2) {
      if(!this.directed) {
         return this.getEdgesBetween(id1, id2);
      }
      return this._getDirectedEdgesFrom(id1, id2);
   };

   this.getEdgesBetween = function(id1, id2) {
      var result = this._getDirectedEdgesFrom(id1, id2);
      if(id1 != id2) {
         result = result.concat(this._getDirectedEdgesFrom(id2, id1));
      }
      return result;
   };

   this.getEdgeVertices = function(id) {
      return [this.edgeVertices[id][0], this.edgeVertices[id][1]];
   };

   this.removeEdge = function(id) {
      var parent = this.edgeVertices[id][0];
      var child = this.edgeVertices[id][1];
      var info = this.edgeInfo[id];

      if(this._invokeListeners(this.preListeners, "removeEdge", [id, parent, child, this.vertexInfo[parent], this.vertexInfo[child], info]) === false) {
         return false;
      }

      delete this.children[parent][child][id];

      if($.isEmptyObject(this.children[parent][child])) {
         delete this.children[parent][child];
         delete this.parents[child][parent];
      }

      this.indegree[child]--;
      this.outdegree[parent]--;
      delete this.edgeVertices[id];
      delete this.edgeInfo[id];
      this.numEdges--;
      this._invokeListeners(this.postListeners, "removeEdge", [id, parent, child, this.vertexInfo[parent], this.vertexInfo[child], info]);
      return true;
   };

   this._removeDirectedChild = function(id1, id2) {
      for(var edgeID in this.children[id1][id2]) {
         if(!this.removeEdge(edgeID)) {
            return false;
         }
      }
      return true;
   };

   this.removeNeighbor = function(id1, id2) {
      if(this.hasChild(id1, id2)) {
         if(!this._removeDirectedChild(id1, id2)) {
            return false;
         }
      }
      if(id1 != id2 && this.hasChild(id2, id1)) {
         return this._removeDirectedChild(id2, id1);
      }
      return true;
   };

   this.removeChild = function(id1, id2) {
      if(!this.directed) {
         return this.removeNeighbor(id1, id2);
      }
      return this._removeDirectedChild(id1, id2);
   };

   this.removeVertex = function(id) {
      if(this._invokeListeners(this.preListeners, "removeVertex", [id, this.vertexInfo[id]]) === false) {
         return false;
      }
      for(var childID in this.children[id]) {
         if(this.removeChild(id, childID) === false) {
            return false;
         }
      }
      for(var parentID in this.parents[id]) {
         if(this.removeChild(parentID, id) === false) {
            return false;
         }
      }

      var info = this.vertexInfo[id];
      delete this.children[id];
      delete this.parents[id];
      delete this.vertexInfo[id];
      delete this.indegree[id];
      delete this.outdegree[id];
      this.numVertices--;
      this._invokeListeners(this.postListeners, "removeVertex", [id, info]);
      return true;
   };

   this.getNeighbors = function(id) {
      var result = [];
      for(var childID in this.children[id]) {
         result.push(childID);
      }
      for(var parentID in this.parents[id]) {
         result.push(parentID);
      }
      return result;
   };

   this.getChildren = function(id) {
      if(!this.directed) {
         return this.getNeighbors(id);
      }
      var result = [];
      for(var childID in this.children[id]) {
         result.push(childID);
      }
      return result;
   };

   this.getParents = function(id) {
      if(!this.directed) {
         return this.getNeighbors(id);
      }
      var result = [];
      for(var parentID in this.parents[id]) {
         result.push(parentID);
      }
      return result;
   };

   this.getDegree = function(id) {
      return this.indegree[id] + this.outdegree[id];
   };

   this.getInDegree = function(id) {
      if(!this.directed) {
         return this.getDegree(id);
      }
      return this.indegree[id];
   };

   this.getOutDegree = function(id) {
      if(!this.directed) {
         return this.getDegree(id);
      }
      return this.outdegree[id];
   };

   this.getReachableVertices = function(id) {
      var stack = [id];
      var visited = {};
      while(stack.length > 0) {
         var current = stack.pop();
         if(visited[current]) {
            continue;
         }
         visited[current] = true;
         for(var childID in this.children[current]) {
            stack.push(childID);
         }
         if(!this.directed) {
            for(var parentID in this.parents[current]) {
               stack.push(parentID);
            }
         }
      }
      var result = [];
      for(var vertexID in visited) {
         result.push(vertexID);
      }
      return result;
   };

   this.getMaxFlow = function(sourceID, sinkID) {
      // Edmonds-Karp https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm

      var totalFlow = 0;
      var network = {};
      for(var vertex1 in this.vertexInfo) {
         network[vertex1] = {};
         for(var vertex2 in this.vertexInfo) {
            network[vertex1][vertex2] = 0;
         }
      }

      while(true) {
         var pathCapacityAndParents = this._maxFlowBFS(sourceID, sinkID, network);
         var pathCapacity = pathCapacityAndParents.capacity;
         var pathParents = pathCapacityAndParents.parents;

         if(pathCapacity === 0) {
            break;
         }
         totalFlow += pathCapacity;
         
         var vertex = sinkID;
         while(vertex != sourceID) {
            var parent = pathParents[vertex];
            network[parent][vertex] += pathCapacity;
            network[vertex][parent] -= pathCapacity;
            vertex = parent;
         }
      }

      return {
         totalFlow: totalFlow,
         network: network
      };
   };

   this._maxFlowBFS = function(sourceID, sinkID, network) {
      var vertex;

      var parents = {};
      for(vertex in this.vertexInfo) {
         parents[vertex] = -1;
      }
      parents[sourceID] = -2;

      var capacityUntilVertex = {};
      for(vertex in this.vertexInfo) {
         capacityUntilVertex[vertex] = 0;
      }
      capacityUntilVertex[sourceID] = Infinity;

      var queue = [sourceID];
      while(queue.length > 0) {
         vertex = queue[0];
         queue.splice(0, 1);
         var neighbors = this.getNeighbors(vertex);
         for(var iNeighbor in neighbors) {
            var neighbor = neighbors[iNeighbor];
            var edge = this.getEdgesBetween(vertex, neighbor)[0];

            var edgeCapacity;
            if(this.getEdgeVertices(edge)[0] == vertex) {
               edgeCapacity = this.edgeInfo[edge].capacity;
            }
            else {
               edgeCapacity = 0;
            }

            var edgeFlow = network[vertex][neighbor];
            if(edgeCapacity - edgeFlow > 0 && parents[neighbor] == -1) {
               parents[neighbor] = vertex;
               capacityUntilVertex[neighbor] = Math.min(capacityUntilVertex[vertex], edgeCapacity - edgeFlow);
               if(neighbor != sinkID) {
                  queue.push(neighbor);
               }
               else {
                  return {
                     capacity: capacityUntilVertex[sinkID],
                     parents: parents
                  };
               }
            }
         }
      }
      return {
         capacity: 0,
         parents: parents
      };
   };

   this.bfs = function(source) {
      var parents = {};
      var distances = {};
      for(var vertex in this.vertexInfo) {
         distances[vertex] = Infinity;
         parents[vertex] = null;
      }
      distances[source] = 0;

      var queue = [source];
      while(queue.length > 0) {
         var parent = queue.shift();
         var children = this.getChildren(parent);
         for(var iChild in children) {
            var child = children[iChild];
            if(distances[child] == Infinity) {
               distances[child] = distances[parent] + 1;
               parents[child] = parent;
               queue.push(child);
            }
         }
      }
      return {
         distances: distances,
         parents: parents
      };
   };

   this.getAllEdges = function() {
      var result = [];
      for(var edgeID in this.edgeVertices) {
         result.push(edgeID);
      }
      return result;
   };

   this.getAllVertices = function() {
      var result = [];
      for(var vertexID in this.children) {
         result.push(vertexID);
      }
      return result;
   };

   this.setVertexInfo = function(id, info) {
      this.vertexInfo[id] = info;
   };

   this.getVertexInfo = function(id) {
      return this.vertexInfo[id];
   };

   this.setEdgeInfo = function(id, info) {
      this.edgeInfo[id] = info;
   };

   this.getEdgeInfo = function(id) {
      return this.edgeInfo[id];
   };

   this.getEdgesCount = function() {
      return this.numEdges;
   };

   this.getVerticesCount = function() {
      return this.numVertices;
   };
   
   this.forEachVertex = function(callback) {
      for(var vertex in this.vertexInfo) {
         callback(vertex, this.vertexInfo[vertex]);
      }
   };
   
   this.forEachEdge = function(callback) {
      for(var edge in this.edgeInfo) {
         callback(edge, this.edgeInfo[edge]);
      }
   };

   this.addPreListener = function(id, object, priority) {
      this._addListener(this.preListeners, id, object, priority);
   };

   this.addPostListener = function(id, object, priority) {
      this._addListener(this.postListeners, id, object, priority);
   };

   this._addListener = function(container, id, object, priority) {
      if(priority === undefined || priority === null) {
         priority = 0;
      }
      container.push({
         id: id,
         object: object,
         priority: priority
      });
      container.sort(function(obj1, obj2) {
         return obj1.priority - obj2.priority;
      });
   };

   this.removePreListener = function(id) {
      this._removeListener(this.preListeners, id);
   };

   this.removePostListener = function(id) {
      this._removeListener(this.postListeners, id);
   };

   this._removeListener = function(container, id) {
      for(var iListener = 0; iListener < container.length; iListener++) {
         if(container[iListener].id == id) {
            container.splice(iListener, 1);
            return;
         }
      }
   };

   this._invokeListeners = function(container, funcName, args) {
      for(var iListener = 0; iListener < container.length; iListener++) {
         var obj = container[iListener].object;
         if(obj[funcName] && obj[funcName].apply(obj, args) === false) {
            return false;
         }
      }
      return true;
   };

   this.toMinimized = function() {
      return {
         vertexInfo: $.extend({}, this.vertexInfo),
         edgeInfo: $.extend({}, this.edgeInfo),
         edgeVertices: $.extend({}, this.edgeVertices),
         directed: this.directed
      };
   };

   this.toJSON = function() {
      return JSON.stringify({
         vertexInfo: this.vertexInfo,
         edgeInfo: this.edgeInfo,
         edgeVertices: this.edgeVertices,
         directed: this.directed
      });
   };
}

Graph.fromJSON = function(graphStr) {
   return Graph.fromMinimized(JSON.parse(graphStr));
};

Graph.fromMinimized = function(minGraph) {
   var graph = new Graph(minGraph.directed);
   for(var vertexID in minGraph.vertexInfo) {
      graph.addVertex(vertexID, minGraph.vertexInfo[vertexID]);
   }
   for(var edgeID in minGraph.edgeVertices) {
      graph.addEdge(edgeID, minGraph.edgeVertices[edgeID][0], minGraph.edgeVertices[edgeID][1], minGraph.edgeInfo[edgeID]);
   }
   return graph;
};
