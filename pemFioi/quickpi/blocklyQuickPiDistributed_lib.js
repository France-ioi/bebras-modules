var getContext = function (display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: { // French strings
         label: {
            // Labels for the blocks
            getNodeID: "get Current Node ID",
            getNeighbors: "Get list of neighbords",
            getNextMessage: "Get next message timeout %1 seconds",
            sendMessage: "Send Message",
            submitAnswer: "Submit Answer",
            isMessageWaiting: "Is there a message waiting",
            broadcastMessage: "Broadcast Message",
            log: "Log",
         },
         code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            getNodeID: "getNodeID",
            getNeighbors: "getNeighbors",
            getNextMessage: "getNextMessage",
            sendMessage: "sendMessage",
            submitAnswer: "submitAnswer",
            isMessageWaiting: "isMessageWaiting",
            broadcastMessage: "broadcastMessage",
            log: "log"
         },
         description: {
            // Descriptions of the functions in Python (optional)
            getNodeID: "getNodeID() Get current node ID",
            getNeighbors: "getNeighbors() Get list of Neighbors",
            getNextMessage: "getNextMessage() Get next message sent to this node",
            sendMessage: "sendMessage(nodeID, message) Send a message to a neighbor",
            submitAnswer: "submitAnswer(answer) Submit answer",
            isMessageWaiting: "isMessageWaiting() Returns true if we have a message waiting on the current node queue",
            broadcastMessage: "broadcastMessage() Broadcast a message to all nodes",
            log: "log(string) Prints a string for debugging purposes"
         },
         constant: {
         },
         startingBlockName: "Programme", // Name for the starting block
         messages: {
         }
      },
      none: {
         comment: {
            // Comments for each block, used in the auto-generated documentation for task writers
            getNodeID: "Get current node ID",
            getNeighbors: "Get list of Neighbors",
            getNextMessage: "Get next message sent to this node",
            sendMessage: "Send a message to a neighbor",
            submitAnswer: "Submit answer",
            isMessageWaiting: "Is a message waiting in the queue",
            broadcastMessage: "Broadcast a message to all nodes",
            log: "Prints a string for debugging purposes"
         }
      }
   }

   // Create a base context
   var context = quickAlgoContext(display, infos);
   // Import our localLanguageStrings into the global scope
   var strings = context.setLocalLanguageStrings(localLanguageStrings);

   // Some data can be made accessible by the library through the context object
   context.distributed = {};


   function getSessionStorage(name) {
      // Use a try in case it gets blocked
      try {
         return sessionStorage[name];
      } catch (e) {
         return null;
      }
   }

   function setSessionStorage(name, value) {
      // Use a try in case it gets blocked
      try {
         sessionStorage[name] = value;
      } catch (e) { }
   }

   if (window.getQuickPiConnection) {
      var lockstring = getSessionStorage('lockstring');
      if (!lockstring) {
         lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
         setSessionStorage('lockstring', lockstring);
      }

      context.quickPiConnection = getQuickPiConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected, raspberryPiChangeBoard);
      context.quickPiConnection.onDistributedEvent = raspberryPiDistributedEvent;
   }


   function raspberryPiConnected() {
      console.log("Raspberry pi connected");
   }

   function raspberryPiDisconnected(wasConnected, wrongversion) {
      console.log("Raspberry pi disconnected");
   }

   function raspberryPiChangeBoard(board) {
      console.log("change board");
   }

   context.findNodeById = function (nodeId) {
      for (var i = 0; i < context.nodesAndNeighbors.length; i++) {
         if (context.nodesAndNeighbors[i].nodeId == nodeId)
            return context.nodesAndNeighbors[i];
      }

      return null;
   }

   context.findNodeByVertice = function (verticeId) {
      for (var i = 0; i < context.nodesAndNeighbors.length; i++) {
         if (context.nodesAndNeighbors[i].vertice == verticeId)
            return context.nodesAndNeighbors[i];
      }

      return null;
   }

   context.isNeighbor = function (node, neighbordId) {

      for (var i = 0; i < node.neighbors.length; i++) {

         if (node.neighbors[i] == neighbordId)
            return true;
      }

      return false;
   }




   function raspberryPiDistributedEvent(event) {
      //console.log("Distributed event: ");
      console.log(event);

      if (event.event == "submitAnswer") {
         window.task.displayedSubTask.context.setNodeAnswer(event.nodeId, event.answer);

      } else if (event.event == "sendMessage") {
         var context = window.task.displayedSubTask.context;
         var messageKey = event.fromId + "-" + event.toId;


         context.nodeMessages[messageKey].push(event);

         //$("#messageTable").insertRow();

         var table = document.getElementById("messageTable");
         var row = table.insertRow();

         var source = row.insertCell();
         var dest = row.insertCell();
         var message = row.insertCell();
         var status = row.insertCell();

         source.appendChild(document.createTextNode(event.fromId));
         dest.appendChild(document.createTextNode(event.toId));
         message.appendChild(document.createTextNode(event.message));


      } else if (event.event == "nodeStatus") {
         window.task.displayedSubTask.context.setNodeStatus(event.nodeId, event.status);
      }
   };


   context.displayMessage = function (messageInfo) {
      var messageKey = messageInfo.fromId + "-" + messageInfo.toId;
      var fromNode = context.findNodeById(messageInfo.fromId);
      var toNode = context.findNodeById(messageInfo.toId);

      if (context.displayTimeLine)
      {
         var timelinex = fromNode.timeLinePos.x + (context.currentTime * 50);

         var messagepath = paper.path(["M", timelinex, fromNode.timeLinePos.y]);
         messagepath.attr({"stroke-width": 5});

         messagepath.animate({path: ["M", timelinex, fromNode.timeLinePos.y, "L", timelinex, toNode.timeLinePos.y ]},
                         500, "linear", function() {
                           var targetpath = ["M", timelinex, toNode.timeLinePos.y,
                           "L", timelinex + 3, toNode.timeLinePos.y - 3,
                           "L", timelinex - 3, toNode.timeLinePos.y - 3,
                           "L", timelinex, toNode.timeLinePos.y];

                           circle = paper.circle(timelinex, toNode.timeLinePos.y, 5);
/*
                           
                           var triangle = paper.path(targetpath);

                           triangle.attr({
                                 "fill": "#678AB4",
                                 "stroke": "#678AB4"
                           });*/

         
         });

         messagepath.hover(
            // Enter hover
         function(event) {
            $('#screentooltip').remove();
            $("body").append('<div id="screentooltip"></div>');

            var html = "<p>Message:</p><p>From: " + messageInfo.fromId + "</p><p>To: " + messageInfo.toId + "</p><p>" + JSON.stringify(message) +"</p>";

            $('#screentooltip').html(html);


            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "30px");
            $('#screentooltip').css("z-index", "1000");
            //$('#screentooltip').css("width", "262px");
            //$('#screentooltip').css("height", "70px");

            $('#screentooltip').css("left", event.clientX+2).css("top", event.clientY+2);

         },
         // Exit
         function ()
         {
            $('#screentooltip').remove();
         });
      }
      else
      {
         var table = document.getElementById("messageTable");
         var row = table.insertRow();

         var source = row.insertCell();
         var dest = row.insertCell();
         var messageRow = row.insertCell();
         var statusRow = row.insertCell();

         if (messageInfo.fromId == 0) {
            source.appendChild(document.createTextNode("0/system"));
         }
         else {
            source.appendChild(document.createTextNode((fromNode.nodeIndex + 1) + "/" + fromNode.nodeId));
         }
         dest.appendChild(document.createTextNode((toNode.nodeIndex + 1) + "/" + toNode.nodeId));
         messageRow.appendChild(document.createTextNode(JSON.stringify(messageInfo.message)));
         statusRow.appendChild(document.createTextNode("queued"));
         statusRow.id = "message-" + messageInfo.messageId + "-status";

         context.updateMessageStatus(messageInfo.messageId, messageInfo.status);
      }

   };

   context.sendMessage = function (messageInfo, display) {
      var messageKey = messageInfo.fromId + "-" + messageInfo.toId;
      var fromNode = context.findNodeById(messageInfo.fromId);
      var toNode = context.findNodeById(messageInfo.toId);

      if (toNode) {
         context.nodeMessages.push(messageInfo);
         toNode.messages.push(messageInfo);

         //context.nodeMessages[messageKey].push(event);

         if (context.display && display) {
            context.displayMessage(messageInfo);  
         }
      }
   };

   context.updateMessageStatus = function (messageId, status) {
      if (context.display)
         $("#message-" + messageId + "-status").text(status);
   };

   context.setNodeStatus = function (nodeId, status) {

      var node = context.findNodeById(nodeId);
      node.status = status;

      //console.log(nodeId, status);

      if (context.display) {
         $("#node-" + nodeId + "-status").text(status);

         var vertexObject = context.vGraph.getRaphaelsFromID(node.vertice)[0];

         $("#node-" + nodeId + "-row").css("background-color", ""); 
         if (status == "running") {
            $("#node-" + nodeId + "-row").css("background-color", "lightblue"); 

            vertexObject.attr({ fill: "lightblue" });
         }
         else if (status == "sleeping")
         {
            vertexObject.attr({ fill: "lightgray" });
         }
         else if (status == "finnished") {
            vertexObject.attr({ fill: "green" });
         }
         else if (status == "waitingformessage") {
            vertexObject.attr({ fill: "blue" });
         }

      }
   };

   context.setNodeAnswer = function (nodeId, answer) {
      //console.log("Answer", nodeId, answer);

      var node = context.findNodeById(nodeId);
      node.answer = answer;

      if (context.display)
         $("#node-" + nodeId + "-answer").text(JSON.stringify(answer));
   };


   infos.checkEndEveryTurn = false;
   infos.checkEndCondition = function (context, lastTurn) {
      if (lastTurn) {
         var nodeId = context.nodesAndNeighbors[context.curNode].nodeId;

         //console.log (nodeId, "is done ");

         context.setNodeStatus(nodeId, "finnished");
         var allFinnished = true;

         for (var i = 0; i < context.nodesAndNeighbors.length; i++) {

            if (context.nodesAndNeighbors[i].status != "finnished") {
               allFinnished = false;
               break;
            }
         }

         if (allFinnished) {
            console.log("All nodes are done!");

            if (context.validateAnswer) {
               var status = context.validateAnswer(context.nodesAndNeighbors);
               context.success = status.status;
            }
            else {
               context.success = false;
            }

            if (!status.error)
            {
               if (context.success)
                  status.error = "All answers are correct";
               else
                  status.error = "Some node answers are wrong";
                  
            }
            throw (status.error);
         }
      }
   };


   // A context must have a reset function to get back to the initial state
   context.reset = function (taskInfos) {
      // Do something here

      console.log("reset");

      if (taskInfos != undefined) {

         // Copy graph to avoid modifying the taskInfos orignal
         context.graphDefinition = JSON.parse(JSON.stringify(taskInfos.graphDefinition));
         context.Graph = Graph.fromJSON(JSON.stringify(context.graphDefinition.minGraph));

         context.validateAnswer = taskInfos.validateAnswer;
         context.systemMessages = taskInfos.systemMessages;
      }


      var vertices = context.Graph.getAllVertices();
      context.nodesAndNeighbors = [];
      context.nodeMessages = [];
      context.currentTime = 0;

      for (var iVertices = 0; iVertices < vertices.length; iVertices++) {
         var neighbors = context.Graph.getNeighbors(vertices[iVertices]);
         var nodeId;

         // Generate a non repeated random Id
         do {
            nodeId = Math.floor(Math.random() * 900) + 100;
         } while (context.findNodeById(nodeId) != null);

         context.nodesAndNeighbors.push(
            {
               vertice: vertices[iVertices],
               nodeIndex: iVertices,
               nodeId: nodeId,
               status: "stopped",
               answer: null,
               messages: [],
               log: [],
            }
         );
      }

      for (var iVertices = 0; iVertices < vertices.length; iVertices++) {
         var neighbors = context.Graph.getNeighbors(vertices[iVertices]);

         for (var i = 0; i < neighbors.length; i++) {
            neighbors[i] = context.findNodeByVertice(neighbors[i]).nodeId;
         }

         context.nodesAndNeighbors[iVertices].neighbors = neighbors;
      }

      if (context.systemMessages) {
         for (var i = 0; i < context.systemMessages.length; i++) {
            var message = context.systemMessages[i];
            var node = context.nodesAndNeighbors[message.nodeIndex - 1];
            var messageId = context.globaMessageCount++;

            var messageInfo = {
               fromId: 0,
               toId: node.nodeId,
               message: message.message,
               status: "queued",
               messageId: messageId,
               circle: null
            };
      
            context.sendMessage(messageInfo, false);
         }
      }

      context.nbNodes = vertices.length;

      context.globaMessageCount = 0;

      if (context.display) {
         context.resetDisplay();
      }
   };

   // Reset the context's display
   context.resetDisplay = function () {
      if (!context.display || !this.raphaelFactory)
         return;


      // Do something here
      var hasIntroControls = $('#taskIntro').find('#introControls').length;
      if (!hasIntroControls) {
         $('#taskIntro').append(`<div id="introControls"></div>`);
      }

      $('#introControls').html("<div><button id=piconnect>Connect</button><button id=piinstall>Install</button></div>")

      $('#piconnect').click(function () {
         context.quickPiConnection.connect("ws://192.168.0.5/api/v1/commands");
      });

      context.displayTimeLine = false;
      context.verticeRadius = 35;

      if (context.displayTimeLine) {
         $('#grid').html(`
         <div id="nodeGraph" style="height: 90%; width: 90%; overflow-y: auto;">
         </div>
          `);
 
          this.raphaelFactory.destroyAll();
          paper = this.raphaelFactory.create(
             "paperMain",
             "nodeGraph",
             $('#nodeGraph').width() - 10,
             $('#nodeGraph').height() - 10,
          );

 
         var vertexAttr = {
            r: context.verticeRadius,
            stroke: "none",
            fill: "lightgray"
         };
         var edgeAttr = {
            stroke: '#a05000',
            "stroke-width": 5
         };

         var straighEdges = [];
         var vertices = context.Graph.getAllVertices();
         var lastId = null;
         $.each(vertices, function (index) {
            var id = vertices[index];
            if (lastId)
            {
               var edges = context.Graph.getEdgesBetween(id, lastId);
               if (edges.length > 0)
                  straighEdges.push(edges[0]);
            }

            lastId = id;
         });

         var timeLineedgeVisualInfo = {};
         var edges = context.Graph.getAllEdges();
         var sweep = 0;
         $.each(edges, function (index) {
            var id = edges[index];

            timeLineedgeVisualInfo[id] = {};

            if ($.inArray(id, straighEdges) == -1) {
               timeLineedgeVisualInfo[id] = {
                  "sweep": sweep,
                  "large-arc": 0,
                  "radius-ratio": 1
               };

               if (sweep == 1)
                  sweep = 0;
               else
                  sweep = 1;
            }

         });


         var graphDrawer = new SimpleGraphDrawer(vertexAttr, edgeAttr);
         context.vGraph = new VisualGraph("vGraph", paper, context.Graph, graphDrawer, true, context.graphDefinition.vertexVisualInfo, timeLineedgeVisualInfo);

         this.graphMouse = new GraphMouse("GraphMouse", context.Graph, context.vGraph);

         
         
         var graphW = $('#nodeGraph').width() - 10;
         var graphH =  $('#nodeGraph').height() - 10;

         

         var pixelsPerVertice = graphH / context.nodesAndNeighbors.length;

         
         $.each(vertices, function (index) {
            var id = vertices[index];
            var node = context.findNodeByVertice(id);
            node.timeLinePos = {
               x: context.verticeRadius * 4,
               y: context.verticeRadius + (pixelsPerVertice * index),
            };

            context.vGraph.graphDrawer.moveVertex(id, node.timeLinePos.x, node.timeLinePos.y);
         });

         context.vGraph.redraw();
      } else {
         $('#grid').html(`
         <div style='height: 100%; width: 100%;'>
         <table style='height: 100%; width: 100%; table-layout:fixed;'>
         <tr>
         <td style='width: 50%; height: 50%;'>
            <div style='height: 100%; width: 100%;' id="nodeGraph"></div>
         </td>
         <td style='width: 50%; height: 50%;'>   
            <div style='height: 100%; width: 100%; overflow:auto;' id="nodeStatus">Hello 2</div>
         </td>
         </tr>
         <tr>
         <td colspan=2 style='width: 100%; height: 50%;'>
            <div style='height: 100%; width: 100%; overflow:auto;'  id="nodeMessages" >Hello 3</div>
         </td>
         </tr>
         </table>
         </div>
       `);

         var tableStatus = "<table id='node-status-table' style='border-collapse: collapse; margin: auto;'><tr><th>#</th><th>ID</th><th>Status</th><th>Answer</th></tr></table>";
         $('#nodeStatus').html(tableStatus);
         var table = document.getElementById("node-status-table");

         $.each(context.nodesAndNeighbors, function (index) {
            //console.log(context.nodesAndNeighbors[index]);
            var node = context.nodesAndNeighbors[index];
            var row = table.insertRow();
            row.id = "node-" + node.nodeId + "-row";

            var indexCell = row.insertCell();
            var nodeIdCell = row.insertCell();
            var statusCell = row.insertCell();
            var answerCell = row.insertCell();

            indexCell.appendChild(document.createTextNode((node.nodeIndex + 1)));
            $(indexCell).css("padding", "7px");

            nodeIdCell.appendChild(document.createTextNode(node.nodeId));
            $(nodeIdCell).css("padding", "7px");

            statusCell.appendChild(document.createTextNode(node.status));
            $(statusCell).css("padding", "7px");
            statusCell.id = "node-" + node.nodeId + "-status";

            answerCell.appendChild(document.createTextNode(""));
            $(answerCell).css("padding", "7px");
            answerCell.id = "node-" + node.nodeId + "-answer";
         });

         


         var tableMessages = "<table id='messageTable' style='border-spacing: 15px; margin: auto;'><tr><th>Source</th><th>Destination</th><th>Message</th><th>Status</th></tr></table>";
         $('#nodeMessages').html(tableMessages);

         $.each(context.nodeMessages, function (index) {
            var messageInfo = context.nodeMessages[index];

            context.displayMessage (messageInfo);
         });



         $('#piinstall').click(function () {
            context.blocklyHelper.reportValues = false;


            python_code = window.task.displayedSubTask.blocklyHelper.getCode('python');

            python_code = python_code.replace("from quickpi import *", "");
            python_code = python_code.replace("from distributed import *", "");

            if (context.runner)
               context.runner.stop();

            context.quickPiConnection.runDistributed(python_code, context.nodesAndNeighbors, function () {
               context.justinstalled = true;
            });


            //var alledges = context.Graph.getAllEdges();
            //console.log(alledges);

         });

         var graphW = $('#nodeGraph').width();
         var graphH = $('#nodeGraph').height();

         

         this.raphaelFactory.destroyAll();
         paper = this.raphaelFactory.create(
            "paperMain",
            "nodeGraph",
            graphW,
            graphH
         );
//         paper.setViewBox(0, 0, 400, 400, true);
         

         
         var vertexAttr = {
            r: context.verticeRadius,
            stroke: "none",
            fill: "lightgray"
         };
         var edgeAttr = {
            stroke: '#a05000',
            "stroke-width": 5
         };


         var graphDrawer = new SimpleGraphDrawer(vertexAttr, edgeAttr);
         context.vGraph = new VisualGraph("vGraph", paper, context.Graph, graphDrawer, true, context.graphDefinition.vertexVisualInfo, context.graphDefinition.edgeVisualInfo);

         this.graphMouse = new GraphMouse("GraphMouse", context.Graph, context.vGraph);

         var vertices = context.Graph.getAllVertices();


         context.graphOriginalW = 0;
         context.graphOriginalH = 0;


         $.each(vertices, function (index) {
            var id = vertices[index];

            //var pos = vGraph.graphDrawer.getVertexPosition(id);

            var vertexObject = context.vGraph.getRaphaelsFromID(id)[0];
            var r = vertexObject.attrs['r'];
            var x = vertexObject.attrs['cx'] + r;
            var y = vertexObject.attrs['cy'] + r;

            if (x > context.graphOriginalW)
               context.graphOriginalW = x;

            if (y > context.graphOriginalH)
               context.graphOriginalH = y;
         });

         var scaleFactorW = graphW / context.graphOriginalW;
         var scaleFactorH = graphH / context.graphOriginalH;

         $.each(vertices, function (index) {
            var id = vertices[index];
            var node = context.findNodeByVertice(id);

            //var pos = context.vGraph.graphDrawer.getVertexPosition(id);

            //context.vGraph.graphDrawer.moveVertex(id, pos.x * scaleFactorW, pos.y * scaleFactorH);


            var vertexInfo = context.Graph.getVertexInfo(id);
            vertexInfo.label = (node.nodeIndex + 1).toString(10) + "\n" + node.nodeId.toString(10);
         });

         //console.log("resetDisplay", graphW, scaleFactorW, graphW  / scaleFactorW, graphH, scaleFactorH, graphH / scaleFactorH);
         
         paper.setViewBox(0, 0, graphW  / scaleFactorW, graphH / scaleFactorH);


/*
         window.addEventListener("resize",  function() {
            var graphW = $('#nodeGraph').width();
            var graphH = $('#nodeGraph').height();
   
            var scaleFactorW = graphW / context.graphOriginalW;
            var scaleFactorH = graphH / context.graphOriginalH;

            console.log("resetCallback", graphW, scaleFactorW, graphW  / scaleFactorW, graphH, scaleFactorH, graphH / scaleFactorH);
            paper.setViewBox(0, 0, graphW  / scaleFactorW, graphH / scaleFactorH);

            context.resetDisplay();
            
            console.log("Set View Box");
          });
*/

         context.vGraph.redraw();

         var a = new PaperMouseEvent("paperMain", context.paper, "mousemove", function () {
            console.log("Hello");
         }, true);


         //this.graphMouse.addEvent("whatever", "click", "vertex", null, [function() { console.log("test") }]);

         this.graphMouse.addEvent("whatever2", "click", "edge", null, [function (id) {
            var id = (Beav.Navigator.isIE8()) ? elementID : this.data("id");
            var vertexObject = context.vGraph.getRaphaelsFromID(id)[0];

            var a = vertexObject.node.getBoundingClientRect();

         }]);

         //VertexToggler("whatever", context.Graph, context.vGraph, this.graphMouse, function(id, selected) {
         this.graphMouse.addEvent("whatever", "hover", "vertex", null, [function (id) {
            var id = (Beav.Navigator.isIE8()) ? elementID : this.data("id");
            var vertexObject = context.vGraph.getRaphaelsFromID(id)[0];

            var a = vertexObject.node.getBoundingClientRect();
            var x = a.x + 50;
            var y = a.y;


            $('#screentooltip').remove();
            $("body").append('<div id="screentooltip"></div>');

            
            var node = context.findNodeByVertice(id);
            var html = "<p>Node Id: " + node.nodeId + "</p><p>Log:</p>";
            for (var i = 0; i < node.log.length; i++) {
               html += "" + JSON.stringify(node.log[i]) + "<br>";

               console.log(JSON.stringify(node.log[i]));
            }

            $('#screentooltip').html(html);


            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "30px");
            $('#screentooltip').css("z-index", "1000");
            //$('#screentooltip').css("width", "262px");
            //$('#screentooltip').css("height", "70px");

            $('#screentooltip').css("left", x).css("top", y);
         },
         function (a) {
            $('#screentooltip').remove();
         }
         ]);
      }

      // Ask the parent to update sizes
      context.blocklyHelper.updateSize();
      //context.updateScale();
   };

   // Update the context's display to the new scale (after a window resize for instance)
   context.updateScale = function () {
      if (!context.display) {
         return;
      }

      var width = $('#nodeGraph').width();
      var height = $('#nodeGraph').height();

      if (!context.oldwidth ||
         !context.oldheight ||
         context.oldwidth != width ||
         context.oldheight != height) {

         context.oldwidth = width;
         context.oldheight = height;

         
         
         var scaleFactorW = width / context.graphOriginalW;
         var scaleFactorH = height / context.graphOriginalH;

         //console.log("resize to ", width, height);

         paper.setViewBox(0, 0, width  / scaleFactorW, height / scaleFactorH);
         paper.setSize(width, height);

         //context.resetDisplay();
      }
   };

   // When the context is unloaded, this function is called to clean up
   // anything the context may have created
   context.unload = function () {
      // Do something here
      if (context.display) {
         // Do something here
      }
   };



   context.setCurNode = function (curNode) {
      context.curNode = curNode;
      var node = context.nodesAndNeighbors[context.curNode];

      //console.log("Running ", node.nodeId, "current status", node.status);

      if (node.status != "finnished")
      {
         for (var i = 0; i < context.nodesAndNeighbors.length; i++) {
            if (context.nodesAndNeighbors[i].status == "running") {

               //console.log("Change node ", context.nodesAndNeighbors[i].nodeId, "to sleeping")
               context.setNodeStatus(context.nodesAndNeighbors[i].nodeId, "sleeping");
               break;
            }
         }
   
         //console.log("Change node ", node.nodeId, "to running")
         context.setNodeStatus(node.nodeId, "running");
      }
   }

   context.incTime = function() {
      context.currentTime++;


      if (context.display && context.displayTimeLine) {
         $.each(context.nodesAndNeighbors, function (index) {
            var node = context.nodesAndNeighbors[index];

            var messagepath = paper.path(["M", node.timeLinePos.x, node.timeLinePos.y]);

            messagepath.animate({path: ["M", node.timeLinePos.x, node.timeLinePos.y,
                                       "L", node.timeLinePos.x + (context.currentTime * 50), node.timeLinePos.y]}, 100);

         });
      }
   };

   /***** Functions *****/
   /* Here we define each function of the library.
      Blocks will generally use context.group.blockName as their handler
      function, hence we generally use this name for the functions. */


   context.distributed.getNodeID = function (callback) {
      var nodeId = context.nodesAndNeighbors[context.curNode].nodeId;

      context.runner.waitDelay(callback, nodeId);
   };
   context.distributed.getNeighbors = function (callback) {
      var node = context.nodesAndNeighbors[context.curNode];

      context.runner.waitDelay(callback, node.neighbors);
   };

   context.distributed.getNextMessage = function (exitTimeout, callback) {
      var node = context.nodesAndNeighbors[context.curNode];
      var message = null;
      //console.log("getNextMessage");

      if (node.messages.length > 0) {
         message = node.messages.shift();
         message.status = "read";


         context.updateMessageStatus(message.messageId, message.status);

         if (context.display) {
            var toPos = context.vGraph.graphDrawer.getVertexPosition(node.vertice);

            if (message.circle)
            {
               message.circle.animate({ cx: toPos.x, cy: toPos.y }, 500, "linear", function () {
                  message.circle.remove();
               });

               message.messageCountText.remove();
               message.messageCountText = null;
   
               var messageCount = node.messages.reduce(function (acum, value)
               {
                  if (value.fromId == message.fromId)
                     return acum + 1;
   
                   return acum;
               }, 0);
   
               node.messages.forEach(function (element) {
                  if (element.fromId == message.fromId && element.messageCountText) {
                     element.messageCountText.attr({"text": messageCount.toString()});
                  }
               });   
            }


            context.runner.waitDelay(callback, { "from": message.fromId, "payload": message.message, "status": true }, 500);
         }
         else
         {
            context.runner.noDelay(callback, { "from": message.fromId, "payload": message.message, "status": true })
         }

         
      }
      else {
         //context.setNodeStatus(node.nodeId, "waitingformessage");

         var cb = context.runner.waitCallback(callback);
         var ellapsedTime = 0;

         var timeout = setInterval(function () {
            if (node.messages.length > 0) {
               clearInterval(timeout);
               message = node.messages.shift();
               message.status = "read";
               context.updateMessageStatus(message.messageId, message.status)
               //context.setNodeStatus(node.nodeId, "running");

               if (context.display) {
                  var toPos = context.vGraph.graphDrawer.getVertexPosition(node.vertice);

                  message.circle.animate({ cx: toPos.x, cy: toPos.y }, 500, "linear", function () {
                     message.circle.remove();
                     message.circle = null;

                     if (message.messageCountText)
                     {
                        message.messageCountText.remove();
                        message.messageCountText = null;
                     }

                     var messageCount = node.messages.reduce(function (acum, value)
                     {
                        if (value.fromId == message.fromId)
                           return acum + 1;
      
                         return acum;
                     }, 0);

                     node.messages.forEach(function (element) {
                        if (element.fromId == message.fromId && element.messageCountText) {
                           element.messageCountText.attr({"text": messageCount.toString()});
                        }
                     });

                     console.log("------->", messageCount);

                     
      
                     cb( { "from": message.fromId, "payload": message.message, "status": true });
                  });
               }
               else {
                  cb( { "from": message.fromId, "payload": message.message, "status": true });
               }
            }

            ellapsedTime += 0.5;
            if (exitTimeout > 0 && ellapsedTime >= exitTimeout) {
               clearInterval(timeout);
               cb( { "from": -1, "payload": 0, "status": false });
            }
            
         }, 500);
      }
   };

   context.distributed.sendMessage = function (recipientId, message, callback) {
      var fromNode = context.nodesAndNeighbors[context.curNode];
      var toNode = context.findNodeById(recipientId);
      var messageId = context.globaMessageCount++;
      var messageDelay = 1000;

      //console.log("sendMessage");


      if (!context.isNeighbor(fromNode, toNode.nodeId)) {
         context.success = false;
         throw ("Tried to send a message to node " + toNode.nodeId + " which is not a neighbord");
      }

      context.incTime();

      var messageInfo = {
         fromId: fromNode.nodeId,
         toId: toNode.nodeId,
         message: message,
         status: "queued",
         messageId: messageId,
         circle: null
      };

      if (context.display) {
         var fromVertice = fromNode.vertice;
         var toVertice = toNode.vertice;
         var fromPos = context.vGraph.graphDrawer.getVertexPosition(fromVertice);

         var edges = context.Graph.getEdgesBetween(fromVertice, toVertice);


         if (edges.length > 0)
         {
            var verticesOrder = context.Graph.getEdgeVertices(edges[0]);
            var edgePath = context.vGraph.getRaphaelsFromID(edges[0])[0];

            messageInfo.circle = paper.circle(fromPos.x, fromPos.y, 10);
            messageInfo.circle.attr("fill", "lightblue");

            var path = edgePath.attrs["path"];
            var s = path.toString();

            var pathLen = edgePath.getTotalLength();
            var startAt = 1 - ((pathLen - context.verticeRadius) / (pathLen));


            var fromPercentage = 1;
            var toPercentage = startAt;
            if (verticesOrder[0] == fromVertice) {
                  fromPercentage = startAt;
                  toPercentage = 1;
            }

            messageInfo.circle.animateAlong({
               path: s,
               rotate: false,
               duration: messageDelay,
               easing: 'linear',
               debug: false,
               fromPercentage: fromPercentage,
               toPercentage: toPercentage,
            },
            {         
            },
            function() {
               var messageCount = toNode.messages.reduce(function (acum, value)
               {
                  if (value.fromId == fromNode.nodeId)
                     return acum + 1;

                   return acum;
               }, 0);

               messageInfo.messageCountText = paper.text(messageInfo.circle.attr("cx"),
                          messageInfo.circle.attr("cy"),
                          (messageCount + 1).toString());

               
               context.sendMessage(messageInfo, true);
            });
         }

         context.runner.waitDelay(callback, null, messageDelay);
      }
      else {
         context.sendMessage(messageInfo, true);

         context.runner.noDelay(callback);
      }
   };

   context.distributed.submitAnswer = function (answer, callback) {
      var node = context.nodesAndNeighbors[context.curNode];

      if (node.answer != null) {
         context.success = false;
         throw ("Node " + node.nodeId + " already submitted an answer");
      }

      context.setNodeAnswer(node.nodeId, answer);

      context.runner.waitDelay(callback);
   };

   context.distributed.isMessageWaiting = function (callback) {
      var node = context.nodesAndNeighbors[context.curNode];
      var message = null;
      var retVal = false;

      if (node.messages.length > 0)
         retVal = true;

      context.runner.waitDelay(callback, retVal);
   };

   context.distributed.broadcastMessage = function (message, callback) {
      var fromNode = context.nodesAndNeighbors[context.curNode];
      var messageId = context.globaMessageCount++;
      var messageDelay = 1000;

/*
      if (!context.isNeighbor(fromNode, toNode.nodeId)) {
         context.success = false;
         throw ("Tried to send a message to node " + toNode.nodeId + " which is not a neighbord");
      }
      */

      context.incTime();

      if (context.display) {

         var fromPos = context.vGraph.graphDrawer.getVertexPosition(fromNode.vertice);

         for (var index in context.nodesAndNeighbors)
         {
            var node = context.nodesAndNeighbors[index];
            // Don't send to current sender
            if (node.nodeId == fromNode.nodeId)
               continue;

               var toPos = context.vGraph.graphDrawer.getVertexPosition(node.vertice);

               let messageInfo = {
                  fromId: fromNode.nodeId,
                  toId: node.nodeId,
                  message: message,
                  status: "queued",
                  messageId: messageId,
                  circle: null
               };
         
               messageInfo.circle = paper.circle(fromPos.x, fromPos.y, 10);
               messageInfo.circle.attr("fill", "lightblue");

               messageInfo.circle.animate({cx: toPos.x, cy: toPos.y}, messageDelay);
   
               context.sendMessage(messageInfo, true);
         }

         context.runner.waitDelay(callback, null, messageDelay);
      }
      else {
         for (var index in context.nodesAndNeighbors)
         {
            var node = context.nodesAndNeighbors[index];

            let messageInfo = {
               fromId: fromNode.nodeId,
               toId: node.nodeId,
               message: message,
               status: "queued",
               messageId: messageId,
               circle: null
            };

            context.sendMessage(messageInfo, true);
         }

         context.runner.noDelay(callback);
      }
   };

   context.distributed.log = function (string, callback) {
      var node = context.nodesAndNeighbors[context.curNode];

      node.log.push(string);

      context.runner.waitDelay(callback);
   };
   /*
    * Each function must end its main execution thread by calling one of :
    * `context.runner.noDelay(callback, value)` : return value `value`
    * `context.runner.waitDelay(callback, value, delay)` : return value `value` after `delay` milliseconds
    * `context.runner.waitEvent(callback, target, eventName, func)` : listen for JavaScript event `eventName` on DOM element `target`, until one event `e` is received, and return `func(e)`
    * `context.runner.waitCallback(callback)` : returns a callback `cb` ; wait for `cb` to be called with `cb(value)`, and return `value`
    * If you need to make an asynchronous call, you must still call one of these
    * functions (for instance waitCallback) ; do not call them inside a
    * setTimeout or the execution thread may be broken.
    */


   /***** Blocks definitions *****/
   /* Here we define all blocks/functions of the library.
      Structure is as follows:
      {
         group: [{
            name: "someName",
            // category: "categoryName",
            // yieldsValue: optional true: Makes a block with return value rather than simple command
            // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
            // handler: optional handler function. Otherwise the function context.group.blockName will be used
            // blocklyJson: optional Blockly JSON objects
            // blocklyInit: optional function for Blockly.Blocks[name].init
            //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
            // blocklyXml: optional Blockly xml string
            // codeGenerators: optional object:
            //   { Python: function that generates Python code
            //     JavaScript: function that generates JS code
            //   }
         }]
      }
      [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
      [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
   */

   context.customBlocks = {
      // Define our blocks for our namespace "distributed"
      distributed: {
         // Categories are reflected in the Blockly menu
         actions: [
            { name: "getNodeID", yieldsValue: true },
            { name: "getNeighbors", yieldsValue: true },
            { name: "getNextMessage", yieldsValue: true, params: ["Number"],
               blocklyJson: {
                  "args0": [
                     { "type": "input_value", "name": "PARAM_0"},
                  ]
               },
               blocklyXml: "<block type='getNextMessage'>" +
                   "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>5</field></shadow></value>" +
                   "</block>"
            },
            { name: "sendMessage", params: [null, null] },
            { name: "submitAnswer", params: [null] },
            { name: "isMessageWaiting", yieldsValue: true },
            { name: "broadcastMessage", params: [null] },
            { name: "log", params: [null] },
         ],
         sensors: [
         ]
      }
      // We can add multiple namespaces by adding other keys to customBlocks.
   };

   // Color indexes of block categories (as a hue in the range 0–420)
   context.provideBlocklyColours = function () {
      return {
         categories: {
            actions: 0,
            sensors: 100
         }
      };
   };

   // Constants available in Python
   context.customConstants = {
      distributed: [

      ]
   };

   // Don't forget to return our newly created context!
   return context;
}


var distributedTaskUtilities = {
   twoNodes: {
      "vertexVisualInfo": {
        "v_0": {
          "x": 34,
          "y": 54
        },
        "v_1": {
          "x": 206,
          "y": 54
        }
      },
      "edgeVisualInfo": {
        "e_0": {}
      },
      "minGraph": {
        "vertexInfo": {
          "v_0": {
            "content": "test, virgule\nTEST, VIRGULE\nAAAAAAAAAAAAA\ntest\ntest"
          },
          "v_1": {
            "content": "test, virgule\ntest"
          }
        },
        "edgeInfo": {
          "e_0": {}
        },
        "edgeVertices": {
          "e_0": [
            "v_0",
            "v_1"
          ]
        },
        "directed": false
      }
    },
   ringGraph: {
      "vertexVisualInfo": {
         "v_0": {
            "x": 31,
            "y": 346
          },
          "v_1": {
            "x": 35,
            "y": 143
          },
          "v_2": {
            "x": 237,
            "y": 34
         },
        "v_3": {
          "x": 461,
          "y": 88
        },
        "v_4": {
          "x": 489,
          "y": 242
        },

        "v_5": {
          "x": 443,
          "y": 413
        },
        "v_6": {
          "x": 221,
          "y": 465
        }
      },
      "edgeVisualInfo": {
        "e_1": {},
        "e_0": {},
        "e_4": {},
        "e_5": {},
        "e_6": {},
        "e_7": {},
        "e_2": {},
      },
      "minGraph": {
        "vertexInfo": {
         "v_0": {
            "label": ""
          },
          "v_1": {
            "label": ""
          },
          "v_2": {
            "label": ""
          },
          "v_3": {
            "label": ""
          },
          "v_4": {
            "label": ""
          },

          "v_5": {
            "label": ""
          },
          "v_6": {
            "label": ""
          }
        },
        "edgeInfo": {
          "e_1": { },
          "e_0": {},
          "e_4": {},
          "e_5": {},
          "e_6": {},
          "e_7": {},
          "e_2": {}
        },
        "edgeVertices": {
          "e_1": [
            "v_0",
            "v_1"
          ],
          "e_0": [
            "v_6",
            "v_0"
          ],
          "e_4": [
            "v_6",
            "v_5"
          ],
          "e_5": [
            "v_5",
            "v_4"
          ],
          "e_6": [
            "v_4",
            "v_3"
          ],
          "e_7": [
            "v_2",
            "v_1"
          ],
          "e_2": [
            "v_2",
            "v_3"
          ]
        },
        "directed": false
      }
   },
   allToAllGraph: {
      "vertexVisualInfo": {
        "v_3": {
          "x": 28,
          "y": 346
        },
        "v_4": {
          "x": 363,
          "y": 346
        },
        "v_1": {
          "x": 29,
          "y": 29
        },
        "v_2": {
          "x": 360,
          "y": 29
        },
        "v_5": {
          "x": 193,
          "y": 190
        }
      },
      "edgeVisualInfo": {
        "e_0": {},
        "e_1": {},
        "e_2": {},
        "e_3": {},
        "e_4": {},
        "e_5": {},
        "e_6": {},
        "e_7": {},
        "e_8": {
          "sweep": 1,
          "large-arc": 0,
          "radius-ratio": 0.75
        },
        "e_9": {
          "sweep": 0,
          "large-arc": 0,
          "radius-ratio": 0.9
        },
      },
      "minGraph": {
        "vertexInfo": {
          "v_3": {
            "label": ""
          },
          "v_4": {
            "label": ""
          },
          "v_1": {
            "label": ""
          },
          "v_2": {
            "label": ""
          },
          "v_5": {
            "label": ""
          }
        },
        "edgeInfo": {
          "e_0": {},
          "e_1": {},
          "e_2": {},
          "e_3": {},
          "e_4": {},
          "e_5": {},
          "e_6": {},
          "e_7": {},
          "e_8": {},
          "e_9": {}
        },
        "edgeVertices": {
          "e_0": [
            "v_1",
            "v_2"
          ],
          "e_1": [
            "v_2",
            "v_4"
          ],
          "e_2": [
            "v_4",
            "v_5"
          ],
          "e_3": [
            "v_4",
            "v_3"
          ],
          "e_4": [
            "v_3",
            "v_1"
          ],
          "e_5": [
            "v_3",
            "v_5"
          ],
          "e_6": [
            "v_5",
            "v_1"
          ],
          "e_7": [
            "v_5",
            "v_2"
          ],
          "e_8": [
            "v_3",
            "v_2"
          ],
          "e_9": [
            "v_4",
            "v_1"
          ]
        },
        "directed": false
      }
   },
   singleMasterGraph: {
      "vertexVisualInfo": {
        "v_3": {
          "x": 115,
          "y": 199
        },
        "v_4": {
          "x": 212,
          "y": 198
        },
        "v_0": {
          "x": 505,
          "y": 198
        },
        "v_1": {
          "x": 262,
          "y": 52
        },
        "v_2": {
          "x": 26,
          "y": 198
        },
        "v_5": {
          "x": 315,
          "y": 198
        },
        "v_6": {
          "x": 409,
          "y": 195
        }
      },
      "edgeVisualInfo": {
        "e_0": {},
        "e_1": {},
        "e_2": {},
        "e_3": {},
        "e_4": {},
        "e_5": {}
      },
      "minGraph": {
        "vertexInfo": {
          "v_3": {
            "label": ""
          },
          "v_4": {
            "label": ""
          },
          "v_0": {
            "label": ""
          },
          "v_1": {
            "label": ""
          },
          "v_2": {
            "label": ""
          },
          "v_5": {
            "label": ""
          },
          "v_6": {
            "label": ""
          }
        },
        "edgeInfo": {
          "e_0": {},
          "e_1": {},
          "e_2": {},
          "e_3": {},
          "e_4": {},
          "e_5": {},
        },
        "edgeVertices": {
          "e_0": [
            "v_1",
            "v_2"
          ],
          "e_1": [
            "v_1",
            "v_3"
          ],
          "e_2": [
            "v_1",
            "v_4"
          ],
          "e_3": [
            "v_1",
            "v_5"
          ],
          "e_4": [
            "v_1",
            "v_6"
          ],
          "e_5": [
            "v_1",
            "v_0"
          ]
        },
        "directed": false
      }
    }
}

Raphael.el.animateAlong = function(params, props, callback) {
	var element = this,
		paper = element.paper,
		path = params.path,
		rotate = params.rotate,
		duration = params.duration,
		easing = params.easing,
      debug = params.debug,
      fromPercentage = params.fromPercentage,
      toPercentage = params.toPercentage,
		isElem = typeof path !== 'string';
	
	element.path = 
		isElem
			? path
			: paper.path(path);
	element.pathLen = element.path.getTotalLength();
	element.rotateWith = rotate;
	
	element.path.attr({
		stroke: debug ? 'red' : isElem ? path.attr('stroke') : 'rgba(0,0,0,0)',
		'stroke-width': debug ? 2 : isElem ? path.attr('stroke-width') : 0
	});

	paper.customAttributes.along = function(v) {
		var point = this.path.getPointAtLength(v * this.pathLen),
			attrs = {
				cx: point.x,
				cy: point.y 
			};
		this.rotateWith && (attrs.transform = 'r'+point.alpha);
		// TODO: rotate along a path while also not messing
		//       up existing transformations
		
		return attrs;
   };
   
	if(props instanceof Function) {
		callback = props;
		props = null;
	}
	if(!props) {
		props = {
			along: toPercentage
		};
	} else {
		props.along = toPercentage;	
	}
	
	var startAlong = element.attr('along') || fromPercentage;
	
	element.attr({along: startAlong}).animate(props, duration, easing, function() {
		!isElem && element.path.remove();
		
		callback && callback.call(element);
	});
};

// Register the library; change "template" by the name of your library in lowercase
if (window.quickAlgoLibraries) {
   quickAlgoLibraries.register('distributed', getContext);
} else {
   if (!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['distributed', getContext]);
}
