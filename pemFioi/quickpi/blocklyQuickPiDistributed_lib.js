var getContext = function (display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: { // French strings
         label: {
            // Labels for the blocks
            getNodeID: "get Current Node ID",
            getNeighbors: "Get list of neighbors",
            getNextMessage: "Get next message",
            getNextMessageWithTimeout: "Get next message timeout %1 seconds",
            sendMessage: "Send Message",
            submitAnswer: "Submit Answer",
            isMessageWaiting: "Is there a message waiting",
            broadcastMessage: "Broadcast Message",
            log: "Log",
            currentTime: "Time in milliseconds",
         },
         code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            getNodeID: "getNodeID",
            getNeighbors: "getNeighbors",
            getNextMessage: "getNextMessage",
            getNextMessageWithTimeout: "getNextMessage",
            sendMessage: "sendMessage",
            submitAnswer: "submitAnswer",
            isMessageWaiting: "isMessageWaiting",
            broadcastMessage: "broadcastMessage",
            log: "log",
            currentTime: "currentTime",
         },
         description: {
            // Descriptions of the functions in Python (optional)
            getNodeID: "getNodeID() Get current node ID",
            getNeighbors: "getNeighbors() Get list of Neighbors",
            getNextMessage: "getNextMessage() Get next message sent to this node",
            getNextMessageWithTimeout: "getNextMessage(timeout) Get next message sent to this node",
            sendMessage: "sendMessage(nodeID, message) Send a message to a neighbor",
            submitAnswer: "submitAnswer(answer) Submit answer",
            isMessageWaiting: "isMessageWaiting() Returns true if we have a message waiting on the current node queue",
            broadcastMessage: "broadcastMessage() Broadcast a message to all nodes",
            log: "log(string) Prints a string for debugging purposes",
            currentTime: "currentTime(milliseconds) Time in milliseconds",
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
            getNextMessageWithTimeout: "Get next message sent to this node",
            sendMessage: "Send a message to a neighbor",
            submitAnswer: "Submit answer",
            isMessageWaiting: "Is a message waiting in the queue",
            broadcastMessage: "Broadcast a message to all nodes",
            log: "Prints a string for debugging purposes"
         }
      }
   }

   var introControls = null;
   // Create a base context
   var context = quickAlgoContext(display, infos);
   // Import our localLanguageStrings into the global scope
   var strings = context.setLocalLanguageStrings(localLanguageStrings);

   // Some data can be made accessible by the library through the context object
   context.distributed = {};

   if(window.quickAlgoInterface) {
      window.quickAlgoInterface.stepDelayMax = 500;
  }

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

   context.isNeighbor = function (node, neighborId) {

      for (var i = 0; i < node.neighbors.length; i++) {

         if (node.neighbors[i] == neighborId)
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

   context.drawMessageInTimeLine = function(messageInfo) {
      var messageKey = messageInfo.fromId + "-" + messageInfo.toId;
      var fromNode = context.findNodeById(messageInfo.fromId);
      var toNode = context.findNodeById(messageInfo.toId);

      {
         var timelinex = fromNode.timeLinePos.x + (context.currentTime * 50);

         var messagepath = timelinePaper.path(["M", timelinex, fromNode.timeLinePos.y]);
         messagepath.attr({ "stroke-width": 3,
                            "stroke":  "#00A2E8",
                          });

         var pointingdown = false;
         if (fromNode.timeLinePos.y < toNode.timeLinePos.y)
            pointingdown = true;


         var circle = timelinePaper.circle(timelinex, fromNode.timeLinePos.y, 5);
         circle.attr({
            "fill": "#678AB4",
            "stroke": "#678AB4"
         });


         var trinaglesize = 8;

         if (pointingdown)
         {
            var targetpath = ["M", timelinex, fromNode.timeLinePos.y,
               "L", timelinex + trinaglesize, fromNode.timeLinePos.y - trinaglesize,
               "L", timelinex - trinaglesize, fromNode.timeLinePos.y - trinaglesize,
               "L", timelinex, fromNode.timeLinePos.y];

         }
         else
         {

            var targetpath = ["M", timelinex, fromNode.timeLinePos.y,
               "L", timelinex - trinaglesize, fromNode.timeLinePos.y + trinaglesize,
               "L", timelinex + trinaglesize, fromNode.timeLinePos.y + trinaglesize,
               "L", timelinex, fromNode.timeLinePos.y];
         }

         var triangle = timelinePaper.path(targetpath);
         triangle.attr({
               "fill": "#678AB4",
               "stroke": "#678AB4"
         });

         var linesize = toNode.timeLinePos.y - fromNode.timeLinePos.y;

         var _transformedPath = Raphael.transformPath(targetpath, 'T0,' + linesize);
         triangle.animate({path: _transformedPath}, context.infos.actionDelay);


         messagepath.animate({ path: ["M", timelinex, fromNode.timeLinePos.y, "L", timelinex, toNode.timeLinePos.y] },
            context.infos.actionDelay, "linear", function () {
            }
         );

         messagepath.hover(
            // Enter hover
            function (event) {
               $('#screentooltip').remove();
               $("body").append('<div id="screentooltip"></div>');

               var html = "<p>Message:</p><p>From: " + messageInfo.fromId + "</p><p>To: " + messageInfo.toId + "</p><p>" + JSON.stringify(messageInfo.message) + "</p>";

               $('#screentooltip').html(html);


               $('#screentooltip').css("position", "absolute");
               $('#screentooltip').css("border", "1px solid gray");
               $('#screentooltip').css("background-color", "#efefef");
               $('#screentooltip').css("padding", "30px");
               $('#screentooltip').css("z-index", "1000");
               //$('#screentooltip').css("width", "262px");
               //$('#screentooltip').css("height", "70px");

               $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);

            },
            // Exit
            function () {
               $('#screentooltip').remove();
            }
         );
      }
   };


   context.displayMessage = function (messageInfo) {
         var fromNode = context.findNodeById(messageInfo.fromId);
         var toNode = context.findNodeById(messageInfo.toId);

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

         $('#nodeMessages').scrollTop($('#nodeMessages')[0].scrollHeight); 
   };

   context.sendMessage = function (messageInfo, display) {
      var messageKey = messageInfo.fromId + "-" + messageInfo.toId;
      var fromNode = context.findNodeById(messageInfo.fromId);
      var toNode = context.findNodeById(messageInfo.toId);

      if (toNode) {
         context.nodeMessages.push(messageInfo);
         toNode.messages.push(messageInfo);

         //context.nodeMessages[messageKey].push(event);

         // Call ready function for recipient node
         var omr = context.onMessageReceived[toNode.nodeId];
         if(omr) {
            console.log("omr for " + toNode.nodeId);
            omr();
            context.onMessageReceived[toNode.nodeId] = null;
         }

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
         else if (status == "sleeping") {
            vertexObject.attr({ fill: "lightgray" });
         }
         else if (status == "finished") {
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

      if (context.display) {
         $("#node-" + nodeId + "-answer").text(JSON.stringify(answer));


         var answerRectWidth = 100;
         var pixelsPerTime = 50;
         var pixelsPerTimeHalf = pixelsPerTime / 2;
         var timelinex = node.timeLinePos.x + (context.currentTime * pixelsPerTime);
         var timelinexhalf = node.timeLinePos.x + (context.currentTime * pixelsPerTime) - pixelsPerTime / 2;

          
         var answerRect = timelinePaper.rect(timelinexhalf, node.timeLinePos.y - pixelsPerTimeHalf, answerRectWidth, pixelsPerTime, 10);
         answerRect.attr( { 
            "fill": "#22B14C",
            "fill-opacity": 1
         });

         var answerText = JSON.stringify(answer);
         var text = timelinePaper.text(timelinexhalf + 2, node.timeLinePos.y, answerText);

         text.attr( {
            "font-size": pixelsPerTime / 3,
            "text-anchor" : "start"
         });

         var bbox = text.getBBox();

         while ((bbox.width + 2) > answerRectWidth && answerText.length > 0) {
            answerText = answerText.substring(0, answerText.length - 1);
            text.attr( { text: (answerText + "...") } );

            bbox = text.getBBox();
         }

         text.click(function()
         {
            $('#screentooltip').remove();
            $("body").append('<div id="screentooltip"></div>');

            var html = JSON.stringify(answer);

            $('#screentooltip').html(html);

            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "0px");
            $('#screentooltip').css("z-index", "1000");
            //$('#screentooltip').css("width", "262px");
            //$('#screentooltip').css("height", "70px");

            $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);
         });
      }
   };


   infos.checkEndEveryTurn = false;
   infos.checkEndCondition = function (context, lastTurn) {
      if (lastTurn) {
         var node = context.nodesAndNeighbors[context.curNode];
         var nodeId = context.nodesAndNeighbors[context.curNode].nodeId;

         context.incTime();
         if (context.display)
         {
            var pixelsPerTime = 50;
            var rombussize = 35;
            var pixelsPerTimeHalf = rombussize / 2;
            var timelinex = node.timeLinePos.x + (context.currentTime * pixelsPerTime);
            var timelinexhalf = node.timeLinePos.x + (context.currentTime * pixelsPerTime) - rombussize / 2;
   
             
            var answerRect = timelinePaper.rect(timelinexhalf, node.timeLinePos.y - pixelsPerTimeHalf, rombussize, rombussize);
            answerRect.attr( { 
               fill: "#F36D74"
            });

            answerRect.rotate(45);

            var text = timelinePaper.text(timelinex, node.timeLinePos.y, "End");
            text.attr( {
               "font-size": rombussize / 2
            });
         }

         //console.log (nodeId, "is done ");

         context.setNodeStatus(nodeId, "finished");
         context.maybeWakeUpNodeInGrading(nodeId);
         var allFinished = true;

         for (var i = 0; i < context.nodesAndNeighbors.length; i++) {

            if (context.nodesAndNeighbors[i].status != "finished") {
               allFinished = false;
               break;
            }
         }

         if (allFinished) {
            console.log("All nodes are done!");

            if (context.validateAnswer) {
               var status = context.validateAnswer(context.nodesAndNeighbors);
               context.success = status.status;
               if (!status.error) {
                  if (context.success)
                     status.error = "All answers are correct";
                  else
                     status.error = "Some node answers are wrong";
               }
               throw (status.error);
            }
            else {
               context.success = false;
               throw "All nodes are done (no validation for this task)";
            }

         }
      }
   };


   // A context must have a reset function to get back to the initial state
   context.reset = function (taskInfos) {
      // Do something here

      
      context.currentWallTime = new Date().getTime();
      context.failures = null;
      if (taskInfos != undefined) {

         // Copy graph to avoid modifying the taskInfos orignal
         context.graphDefinition = JSON.parse(JSON.stringify(taskInfos.graphDefinition));
         context.Graph = Graph.fromJSON(JSON.stringify(context.graphDefinition.minGraph));

         context.validateAnswer = taskInfos.validateAnswer;
         context.systemMessages = taskInfos.systemMessages;

         context.failures = taskInfos.failures;
      }


      var vertices = context.Graph.getAllVertices();
      context.nodesAndNeighbors = [];
      context.nodeMessages = [];
      context.onMessageReceived = {};
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

   context.resetTimeLineDisplay = function () {

      context.timeLineGraphW = 800;
      context.timeLineGraphH = 800;

      timelinePaper = this.raphaelFactory.create(
         "paperTimeline",
         "timeLineGraph",
         context.timeLineGraphW,
         context.timeLineGraphH,
      );

      context.timeLineVerticeRadius = context.verticeRadius / 1.5;


      var vertexAttr = {
         r: context.timeLineVerticeRadius,
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
         if (lastId) {
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

      var vertexVisualInfoTimeline = JSON.parse(JSON.stringify(context.graphDefinition.vertexVisualInfo));
      context.vGraphTimeline = new VisualGraph("vGraphTimeline", timelinePaper, context.Graph, graphDrawer, true, vertexVisualInfoTimeline, timeLineedgeVisualInfo);

      this.graphMouseTimeline = new GraphMouse("GraphMouseTimeline", context.Graph, context.vGraph);


      var pixelsPerVertice = context.timeLineGraphH / context.nodesAndNeighbors.length;


      $.each(vertices, function (index) {
         var id = vertices[index];
         var node = context.findNodeByVertice(id);
         node.timeLinePos = {
            x: context.verticeRadius * 4,
            y: context.verticeRadius + (pixelsPerVertice * index),
         };

         context.vGraphTimeline.graphDrawer.moveVertex(id, node.timeLinePos.x, node.timeLinePos.y);
      });

      context.vGraphTimeline.redraw();
      //timelinePaper.setSize($('#timeLineGraph').width() - 10, $('#timeLineGraph').height() - 10);
      //timelinePaper.setViewBox(0, 0, context.timeLineGraphW, context.timeLineGraphH);
      context.updateTimeLineScale();

      $('#timeLineGraph').scroll(function (event) {

         $('#screentooltip').remove();
         var scrolloffset = $('#timeLineGraph').scrollLeft();

         console.log("scrolloffset ", scrolloffset);


         $.each(vertices, function (index) {
            var id = vertices[index];
            var pos = context.vGraphTimeline.graphDrawer.getVertexPosition(id);
            var vertexObject = context.vGraphTimeline.getRaphaelsFromID(id)[0];

            context.vGraphTimeline.graphDrawer.moveVertex(id, scrolloffset + (context.verticeRadius * 4), pos.y);

            if (scrolloffset == 0)
               vertexObject.attr({ opacity: 1 });
            else
               vertexObject.attr({ opacity: 0.3 });
         });

         context.vGraphTimeline.redraw();

         $.each(vertices, function (index) {
            var id = vertices[index];
            var pos = context.vGraphTimeline.graphDrawer.getVertexPosition(id);
            var vertexObject = context.vGraphTimeline.getRaphaelsFromID(id)[0];

            if (scrolloffset == 0)
               vertexObject.attr({ opacity: 1 });
            else
               vertexObject.attr({ opacity: 0.3 });
         });

         var edges = context.Graph.getAllEdges();
         $.each(edges, function (index) {
            var id = edges[index];
            var edgeObject = context.vGraphTimeline.getRaphaelsFromID(id)[0];
            if (scrolloffset == 0)
               edgeObject.attr({ opacity: 1 });
            else
               edgeObject.attr({ opacity: 0.3 });

         });
   
   
      });

      `
      var draggingTimeline = false;
      var draggingStartX = 0;
      var draggingStartY = 0;
      var viewBoxX = 0;
      var viewBoxY = 0;
      var dX = 0;

      $('#timeLineGraph').mousedown(function(e){
         if (timelinePaper.getElementByPoint( e.pageX, e.pageY ) != null) {
            return;
         }

         draggingTimeline = true;
         draggingStartX = e.pageX; 
         draggingStartY = e.pageY;  
     });

      
      $('#timeLineGraph').mousemove(function(e){
         if (draggingTimeline == false)
            return;

         dX = draggingStartX - e.pageX;
         var x = context.timeLineGraphW / timelinePaper.width; 

         dX *= x; 
         
         if (viewBoxX + dX >= 0) {
            timelinePaper.setViewBox(viewBoxX + dX, 0, context.timeLineGraphW, context.timeLineGraphH);

            $.each(vertices, function (index) {
               var id = vertices[index];
               var pos = context.vGraphTimeline.graphDrawer.getVertexPosition(id);
               var vertexObject = context.vGraph.getRaphaelsFromID(id)[0];

               if (viewBoxX + dX == 0)
                  vertexObject.attr({ opacity: 1 });
               else
                  vertexObject.attr({ opacity: 0.3 });
                  
               context.vGraphTimeline.graphDrawer.moveVertex(id, viewBoxX + dX + (context.verticeRadius * 4), pos.y);
            });

            context.vGraphTimeline.redraw();
         }   
       });
            
        $('#timeLineGraph').mouseup(function(e){
            if (draggingTimeline == false)
               return; 

            viewBoxX += dX; 

            draggingTimeline = false; 
        });
      `
   };

   // Reset the context's display
   context.resetDisplay = function () {
      if (!context.display || !this.raphaelFactory)
         return;

      $('#screentooltip').remove();

      // Do something here
      var hasIntroControls = $('#taskIntro').find('#introControls').length;
      if (!hasIntroControls) {
         $('#taskIntro').append(`<div id="introControls"></div>`);
      }
      
      if (introControls === null) {
         introControls = true;

    
         $('#introControls').html(`
         <!--<div><button id=piconnect>Connect</button><button id=piinstall>Install</button></div>-->
         <div id="piui">
         <button class="btn" type="button" id="showGraphView">Graph View</button>
         <button class="btn" type="button" id="showTimelineView">Timeline</button>
         </div>
         `);

         $('#piconnect').click(function () {
            context.quickPiConnection.connect("ws://192.168.0.5/api/v1/commands");
         });

         $('#showGraphView').click(function () {
            $('#screentooltip').remove();
            if ($('#timelineView').css("display") != "none")
            {
               $('#timelineView').css("display", "none");
               $('#graphView').css("display", "");

               context.updateScale();
               
               context.vGraph.redraw();
            }
         });

         $('#showTimelineView').click(function () {
            $('#screentooltip').remove();
            if ($('#graphView').css("display") != "none")
            {
               $('#timelineView').css("display", "");
               $('#graphView').css("display", "none");

               context.updateScale();
               context.updateTimeLineScale();
               context.vGraphTimeline.redraw();
            }
         });      

         $('#grid').html(`
         
            <div style='height: 100%; width: 100%; display: none;' id='timelineView'>
               <div style='height: 100%; width: 100%; overflow-x: auto; overflow-y:hidden' id="timeLineGraph"></div>
            </div>
      
            <div id='graphView' style='height: 100%; width: 100%; '>
            <table style='height: 100%; width: 100%; table-layout:fixed;'>
            <tr>
            <td style='width: 50%; height: 50%; position:relative;'>
               <div style='height: 100%; width: 100%; position: absolute;   top: 0; left: 0;' id="nodeGraph" ></div>
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
      }



      context.verticeRadius = 35;

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

         context.displayMessage(messageInfo);
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

      var vertexAttr = {
         r: context.verticeRadius,
         stroke: "none",
         fill: "lightgray"
      };
      var edgeAttr = {
         stroke: 'yellowgreen',
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

      paper.setViewBox(0, 0, graphW / scaleFactorW, graphH / scaleFactorH);


      context.vGraph.redraw();

      var a = new PaperMouseEvent("paperMain", paper, "mousemove", function () {
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


      context.resetTimeLineDisplay();


      // Ask the parent to update sizes
      context.blocklyHelper.updateSize();
      context.updateScale();
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

         paper.setViewBox(0, 0, width / scaleFactorW, height / scaleFactorH);
         paper.setSize(width, height);


         context.updateTimeLineScale();
         //timelinePaper.setViewBox(0, 0, context.timeLineGraphW, context.timeLineGraphH);
         //timelinePaper.setSize($('#timeLineGraph').width() - 10, $('#timeLineGraph').height() - 10);
         

         //console.log("timeline paper", $('#timeLineGraph').width() - 10, $('#timeLineGraph').height() - 10);

         context.vGraphTimeline.redraw();

         //context.resetDisplay();
      }
   };

   context.updateTimeLineScale = function() {
      timelinePaper.setSize(timelinePaper.width - 15, $('#timeLineGraph').height() - 10);
      timelinePaper.setViewBox(0, 0, timelinePaper.width /*context.timeLineGraphW*/, context.timeLineGraphH, false);
      
      timelinePaper.canvas.setAttribute('preserveAspectRatio', 'none'); 
      
   }

   // When the context is unloaded, this function is called to clean up
   // anything the context may have created
   context.unload = function () {
      // Do something here
      if (context.display) {
         // Do something here
      }
   };



   context.setCurNode = function (curNode) {
      //console.log("context.setCurNode", curNode);
      context.curNode = curNode;
      var node = context.nodesAndNeighbors[context.curNode];

      //console.log("Running ", node.nodeId, "current status", node.status);

      if (node.status != "finished") {
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

   context.findEdgeObject = function(node1, node2)
   {
      var edges = context.Graph.getEdgesBetween(node1.vertice, node2.vertice);

      if (edges.length > 0) {
         var edgePath = context.vGraph.getRaphaelsFromID(edges[0])[0];

         return edgePath;
      }

      return null;
   }

   context.findVerticeObject = function(node)
   {
      var vertexObject = context.vGraph.getRaphaelsFromID(node.vertice)[0];

      return vertexObject;
   }


   context.incTime = function () {
      context.currentTime++;

      console.log("current time", context.currentTime);
      if (context.failures) {
         for (var i = 0; i < context.failures.length; i++) {
            var currentFailure = context.failures[i];

            if (context.currentTime >= currentFailure.startTime &&
               context.currentTime <= currentFailure.endTime) {

               if (!currentFailure.active)
               {
                  currentFailure.active = true;
                  console.log("Matched failiure ", i);

                  if (currentFailure.type == "nodeboth") {
                     var node = context.nodesAndNeighbors[currentFailure.node];

                     var vertexObject = context.findVerticeObject(node);

                     vertexObject.attr({
                        "opacity": 0.3,
                     });

                     function animateVertex()
                     {
                        var targetOpacity = 0.1;
                     
                        if (vertexObject.attr('opacity') >= 0.1)
                        {
                           targetOpacity = 0.01;
                        }

                        vertexObject.animate({ "opacity": targetOpacity }, 1000, "linear", function() {
                           animateVertex();
                        });
                     }

                     animateVertex();
                  }
                  else if (currentFailure.type == "connection") {
                     var node1 = context.nodesAndNeighbors[currentFailure.nodes[0]];
                     var node2 = context.nodesAndNeighbors[currentFailure.nodes[1]];

                     var edgePath = context.findEdgeObject(node1, node2);

                     edgePath.attr({
                           "stroke": "red",
                           "opacity": 0.1
                     });

                     function animateEdge()
                     {
                        var targetOpacity = 0.1;
                     
                        if (edgePath.attr('opacity') >= 0.1)
                        {
                           targetOpacity = 0.01;
                        }

                        edgePath.animate({ "opacity": targetOpacity }, 1000, "linear", function() {
                  
                           animateEdge();
                        });
                     }

                     animateEdge();
                  }
               }
            }
            else if (currentFailure.active) {
               currentFailure.active = false;

               if (currentFailure.type == "connection")
               {
                  var node1 = context.nodesAndNeighbors[currentFailure.nodes[0]];
                  var node2 = context.nodesAndNeighbors[currentFailure.nodes[1]];

                  var edgePath = context.findEdgeObject(node1, node2);

                  edgePath.stop();
                  edgePath.attr({
                        "stroke": "yellowgreen",
                        "opacity": 1
                  });
               }
            }
         }
      }


      if (context.display) {

         var node = context.nodesAndNeighbors[0];

         var timelinewidth = Math.max(node.timeLinePos.x + (context.currentTime * 50) + 30, $('#timeLineGraph').width() - 10);

         timelinePaper.setSize(timelinewidth, $('#timeLineGraph').height() - 10);

         context.updateTimeLineScale();

         $('#timeLineGraph').scrollLeft(timelinewidth);


         $.each(context.nodesAndNeighbors, function (index) {
            var node = context.nodesAndNeighbors[index];

            if (node.status == "finished")
               return;

            if (!node.messagepath)
               node.messagepath = timelinePaper.path(["M", node.timeLinePos.x + context.timeLineVerticeRadius, node.timeLinePos.y]);
               
            node.messagepath.animate({
               path: ["M", node.timeLinePos.x + context.timeLineVerticeRadius, node.timeLinePos.y,
                  "L", node.timeLinePos.x + (context.currentTime * 50), node.timeLinePos.y]
            }, 100);
         });
      }
   };


   context.maybeWakeUpNodeInGrading = function (nodeIdToSkip) {
      if (context.display)
         return;

      var allsleepingordone = true;
      var nodeToWakeup = null;
      for(var i = 0; i < context.nodesAndNeighbors.length; i++) {
         var node = context.nodesAndNeighbors[i];

         if (node.nodeId != nodeIdToSkip && context.onMessageReceived[node.nodeId])
            nodeToWakeup = node;

         if (!context.onMessageReceived[node.nodeId] && node.status != "finished") {
            allsleepingordone = false;
            break;
         }
      }

      console.log("All nodes are sleep ?!",allsleepingordone );
      if (allsleepingordone && nodeToWakeup) {
         var omr = context.onMessageReceived[nodeToWakeup.nodeId];
         context.onMessageReceived[nodeToWakeup.nodeId] = null;

         setTimeout(omr, 0);
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

      console.log("current node: ", context.curNode, "neighbords: ", node.neighbors);

      context.runner.waitDelay(callback, node.neighbors);
   };

   context.distributed.getNextMessage = function() {
      if(typeof arguments[0] == 'function') {
         var timeout = -1;
         var callback = arguments[0];
      } else {
         var timeout = arguments[0];
         var callback = arguments[1];
      }
      var node = context.nodesAndNeighbors[context.curNode];
      //console.log("getNextMessage");

      var ready = context.runner.allowSwitch(callback);

      function processMessage(cb) {
         if(node.messages.length > 0) {
            var message = node.messages.shift();
            message.status = "read";


            context.updateMessageStatus(message.messageId, message.status);

            if (context.display) {
               var toPos = context.vGraph.graphDrawer.getVertexPosition(node.vertice);

               if (message.circle) {
                  message.circle.animate({ cx: toPos.x, cy: toPos.y }, context.infos.actionDelay, "linear", function () {
                     message.circle.remove();
                  });

                  message.messageCountText.remove();
                  message.messageCountText = null;

                  var messageCount = node.messages.reduce(function (acum, value) {
                     if (value.fromId == message.fromId)
                        return acum + 1;

                     return acum;
                  }, 0);

                  node.messages.forEach(function (element) {
                     if (element.fromId == message.fromId && element.messageCountText) {
                        element.messageCountText.attr({ "text": messageCount.toString() });
                     }
                  });
               }

               context.runner.waitDelay(cb, { "from": message.fromId, "payload": message.message, "status": true }, context.infos.actionDelay);
            }
            else {
               context.runner.noDelay(cb, { "from": message.fromId, "payload": message.message, "status": true });
            }
         }
         else
         {
            console.log("return status = false");
            context.runner.waitDelay(cb, { "status": false }, context.infos.actionDelay);
            //context.runner.noDelay(cb, { "status": false });
         }
      }

      if(node.messages.length > 0 || timeout == 0) {
         ready(processMessage);
      } else {
         var timeoutID = 0;

         if (timeout > 0)
            timeoutID = setTimeout(function() {
               console.log("timeout!");
               context.onMessageReceived[node.nodeId] = null;
               ready(processMessage);
            }, timeout * 1000);

         context.onMessageReceived[node.nodeId] = function () { 
            if (timeoutID != 0)
               clearTimeout(timeoutID);
            ready(processMessage); 
         };
         context.maybeWakeUpNodeInGrading(node.nodeId);
      }
   };

   context.distributed.getNextMessageWithTimeout = context.distributed.getNextMessage;


   context.canNodeSendMessages = function(fromNode, toNode) {
      if (!context.failures)
         return true;
         
      for (var i = 0; i < context.failures.length; i++) {
         var currentFailure = context.failures[i];

         if (currentFailure.active)
         {
            if (currentFailure.type == "connection") { 

               if ((currentFailure.nodes[0] == fromNode.nodeIndex && currentFailure.nodes[1] == toNode.nodeIndex) ||
                   (currentFailure.nodes[1] == fromNode.nodeIndex && currentFailure.nodes[0] == toNode.nodeIndex)) {
                  
                  return false;
               }
            }
         }
      }

      return true;
   };

   context.distributed.sendMessage = function (recipientId, message, callback) {
      var fromNode = context.nodesAndNeighbors[context.curNode];
      var toNode = context.findNodeById(recipientId);
      var messageId = context.globaMessageCount++;
      var messageDelay = context.infos.actionDelay;

      //console.log("sendMessage");


      if (!context.isNeighbor(fromNode, toNode.nodeId)) {
         context.success = false;
         throw ("Tried to send a message to node " + toNode.nodeId + " which is not a neighbor");
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

      var canSendMessage = context.canNodeSendMessages(fromNode, toNode);

      if (context.display) {
         var fromVertice = fromNode.vertice;
         var toVertice = toNode.vertice;
         var fromPos = context.vGraph.graphDrawer.getVertexPosition(fromVertice);

         var edges = context.Graph.getEdgesBetween(fromVertice, toVertice);


         if (edges.length > 0) {
            context.drawMessageInTimeLine(messageInfo);

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

            if (canSendMessage) {
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
                  function () {
                     var messageCount = toNode.messages.reduce(function (acum, value) {
                        if (value.fromId == fromNode.nodeId)
                           return acum + 1;

                        return acum;
                     }, 0);

                     messageInfo.messageCountText = paper.text(messageInfo.circle.attr("cx"),
                        messageInfo.circle.attr("cy"),
                        (messageCount + 1).toString());

                     context.sendMessage(messageInfo, true);
                  });
            } else  {
               console.log("Failing message!");

               if (fromPercentage == 1)
               {
                  toPercentage = 0.7;
               }
               else if (toPercentage == 1)
               {
                  toPercentage = 0.3;
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
                  function () {
                     var messageCount = toNode.messages.reduce(function (acum, value) {
                        if (value.fromId == fromNode.nodeId)
                           return acum + 1;

                        return acum;
                     }, 0);

                     messageInfo.circle.attr("fill", "red");
                     messageInfo.circle.animate({ "opacity": 0 }, messageDelay, "linear", function() {                  
                        messageInfo.circle.remove();
                     });

                     messageInfo.status = "failed";
                     context.displayMessage(messageInfo);

                     //context.sendMessage(messageInfo, true);
                  });
            }
         }

         context.runner.waitDelay(callback, null, messageDelay);
      }
      else {
         if (canSendMessage)
            context.sendMessage(messageInfo, true);

         context.runner.noDelay(callback);
      }
   };

   context.distributed.submitAnswer = function (answer, callback) {
      var node = context.nodesAndNeighbors[context.curNode];

      console.log("submitAnswer");

      if (node.answer != null) {
         context.success = false;
         throw ("Node " + node.nodeId + " already submitted an answer");
      }

      context.incTime();

      context.setNodeAnswer(node.nodeId, answer);

      context.incTime();

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
               throw ("Tried to send a message to node " + toNode.nodeId + " which is not a neighbor");
            }
            */

      context.incTime();

      if (context.display) {

         var fromPos = context.vGraph.graphDrawer.getVertexPosition(fromNode.vertice);

         for (var index in context.nodesAndNeighbors) {
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

            messageInfo.circle.animate({ cx: toPos.x, cy: toPos.y }, messageDelay);

            context.sendMessage(messageInfo, true);
         }

         context.runner.waitDelay(callback, null, messageDelay);
      }
      else {
         for (var index in context.nodesAndNeighbors) {
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

      if (context.display)
         node.log.push(string);

      context.runner.waitDelay(callback);
   };

   context.distributed.currentTime = function (callback) {
      var millis = new Date().getTime() - context.currentWallTime;

      console.log("millis", millis);

      context.runner.waitDelay(callback, millis);
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
         actuator: [
            { name: "getNodeID", yieldsValue: true },
            { name: "getNeighbors", yieldsValue: true },
            { name: "getNextMessage", yieldsValue: true },
            {
               name: "getNextMessageWithTimeout", yieldsValue: true, params: ["Number"],
               blocklyJson: {
                  "args0": [
                     { "type": "input_value", "name": "PARAM_0" },
                  ]
               },
               blocklyXml: "<block type='getNextMessageWithTimeout'>" +
                  "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>5</field></shadow></value>" +
                  "</block>"
            },
            { name: "sendMessage", params: [null, null] },
            { name: "submitAnswer", params: [null] },
            { name: "isMessageWaiting", yieldsValue: true },
            { name: "broadcastMessage", params: [null] },
            { name: "log", params: [null] },
            { name: "currentTime", yieldsValue: true },
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
            actuator: 0,
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
            "e_1": {},
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
   ringGraph14: {
      "vertexVisualInfo": {
         "v_0": {
           "x": 276,
           "y": 449
         },
         "v_1": {
           "x": 173,
           "y": 429
         },
         "v_2": {
           "x": 450,
           "y": 91
         },
         "v_3": {
           "x": 494,
           "y": 161
         },
         "v_4": {
           "x": 498,
           "y": 259
         },
         "v_5": {
           "x": 471,
           "y": 368
         },
         "v_6": {
           "x": 382,
           "y": 432
         },
         "v_7": {
           "x": 52,
           "y": 286
         },
         "v_8": {
           "x": 83,
           "y": 372
         },
         "v_9": {
           "x": 53,
           "y": 190
         },
         "v_10": {
           "x": 97,
           "y": 111
         },
         "v_11": {
           "x": 175,
           "y": 54
         },
         "v_12": {
           "x": 268,
           "y": 29
         },
         "v_13": {
           "x": 376,
           "y": 38
         }
       },
       "edgeVisualInfo": {
         "e_1": {},
         "e_0": {},
         "e_4": {},
         "e_5": {},
         "e_6": {},
         "e_2": {},
         "e_3": {},
         "e_7": {},
         "e_8": {},
         "e_9": {},
         "e_10": {},
         "e_11": {},
         "e_12": {},
         "e_13": {}
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
           },
           "v_7": {},
           "v_8": {},
           "v_9": {},
           "v_10": {},
           "v_11": {},
           "v_12": {},
           "v_13": {}
         },
         "edgeInfo": {
           "e_1": {},
           "e_0": {},
           "e_4": {},
           "e_5": {},
           "e_6": {},
           "e_2": {},
           "e_3": {},
           "e_7": {},
           "e_8": {},
           "e_9": {},
           "e_10": {},
           "e_11": {},
           "e_12": {
             "selected": false
           },
           "e_13": {}
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
           "e_2": [
             "v_2",
             "v_3"
           ],
           "e_3": [
             "v_8",
             "v_7"
           ],
           "e_7": [
             "v_1",
             "v_8"
           ],
           "e_8": [
             "v_7",
             "v_9"
           ],
           "e_9": [
             "v_9",
             "v_10"
           ],
           "e_10": [
             "v_10",
             "v_11"
           ],
           "e_11": [
             "v_11",
             "v_12"
           ],
           "e_12": [
             "v_12",
             "v_13"
           ],
           "e_13": [
             "v_13",
             "v_2"
           ]
         },
         "directed": false
       }
   },
   ringGraph4: {
      "vertexVisualInfo": {
         "v_0": {
           "x": 31,
           "y": 288
         },
         "v_1": {
           "x": 34,
           "y": 33
         },
         "v_2": {
           "x": 288,
           "y": 32
         },
         "v_3": {
           "x": 287,
           "y": 288
         }
       },
       "edgeVisualInfo": {
         "e_1": {},
         "e_7": {},
         "e_2": {},
         "e_0": {}
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
           }
         },
         "edgeInfo": {
           "e_1": {},
           "e_7": {},
           "e_2": {},
           "e_0": {}
         },
         "edgeVertices": {
           "e_1": [
             "v_0",
             "v_1"
           ],
           "e_7": [
             "v_2",
             "v_1"
           ],
           "e_2": [
             "v_2",
             "v_3"
           ],
           "e_0": [
             "v_3",
             "v_0"
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

Raphael.el.animateAlong = function (params, props, callback) {
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

   paper.customAttributes.along = function (v) {
      var point = this.path.getPointAtLength(v * this.pathLen),
         attrs = {
            cx: point.x,
            cy: point.y
         };
      this.rotateWith && (attrs.transform = 'r' + point.alpha);
      // TODO: rotate along a path while also not messing
      //       up existing transformations

      return attrs;
   };

   if (props instanceof Function) {
      callback = props;
      props = null;
   }
   if (!props) {
      props = {
         along: toPercentage
      };
   } else {
      props.along = toPercentage;
   }

   var startAlong = element.attr('along') || fromPercentage;

   element.attr({ along: startAlong }).animate(props, duration, easing, function () {
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
