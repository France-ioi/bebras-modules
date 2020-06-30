// This is a template of library for use with quickAlgo.

var getContext = function(display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: { // French strings
         label: {
            // Labels for the blocks
            getNodeID: "get Current Node ID",
            getNeighbors: "Get list of neighbords",
            getNextMessage: "Get next message ",
            sendMessage: "Send Message",
            submitAnswer: "Submit Answer",
            isMessageWaiting: "Is there a message waiting",
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
      } catch(e) {
          return null;
      }
  }

  function setSessionStorage(name, value) {
      // Use a try in case it gets blocked
      try {
          sessionStorage[name] = value;
      } catch(e) {}
  }

   if(window.getQuickPiConnection) {
      var lockstring = getSessionStorage('lockstring');
      if(!lockstring) {
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
      for (var i = 0; i < context.nodesAndNeighbors.length; i++)
      {
         if (context.nodesAndNeighbors[i].nodeId == nodeId)
            return context.nodesAndNeighbors[i];
      }

      return null;
   }

   context.findNodeByVertice = function (verticeId) {
      for (var i = 0; i < context.nodesAndNeighbors.length; i++)
      {
         if (context.nodesAndNeighbors[i].vertice == verticeId)
            return context.nodesAndNeighbors[i];
      }

      return null;
   }


   function raspberryPiDistributedEvent(event)
   {
      //console.log("Distributed event: ");
      console.log(event);

      if (event.event == "submitAnswer")
      {
         window.task.displayedSubTask.context.setNodeAnswer(event.nodeId, event.answer);
         
      } else if (event.event == "sendMessage")
      {
         var context = window.task.displayedSubTask.context;
         var messageKey = event.fromId + "-" + event.toId;

         if (!context.nodeMessages[messageKey])
         {
            context.nodeMessages[messageKey] = [];
         }

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


      } else if (event.event == "nodeStatus")
      {
         window.task.displayedSubTask.context.setNodeStatus(event.nodeId, event.status);
      }
   }

   context.displayMessage = function(fromId, toId, message, messageId)  {
      var messageKey = fromId + "-" + toId;

      if (!context.nodeMessages[messageKey])
      {
         context.nodeMessages[messageKey] = [];
      }

      //context.nodeMessages[messageKey].push(event);

      if (context.display)
      {
         var table = document.getElementById("messageTable");
         var row = table.insertRow();
      

         var source = row.insertCell();
         var dest = row.insertCell();
         var messageRow = row.insertCell();
         var statusRow = row.insertCell();

         source.appendChild(document.createTextNode(fromId));
         dest.appendChild(document.createTextNode(toId));
         messageRow.appendChild(document.createTextNode(message));
         statusRow.appendChild(document.createTextNode("queued"));
         statusRow.id = "message-"  + messageId + "-status";
      }
   };

   context.updateMessageStatus = function(messageId, status) {
      if (context.display)
         $("#message-" + messageId + "-status").text(status);
   };

   context.setNodeStatus = function(nodeId, status)  {

      var node = context.findNodeById(nodeId);
      node.status = status;

      //console.log(nodeId, status);

      if (context.display) {
         $("#node-" + nodeId + "-status").text(status);

         var vertexObject = vGraph.getRaphaelsFromID(node.vertice)[0];

         if (status == "running")
         {
            vertexObject.attr({ fill: "blue"});
         }
         else if (status == "finnished")
         {
            vertexObject.attr({ fill: "green"});
         }
         else if (status == "waitingformessage")
         {
            vertexObject.attr({ fill: "blue"});
         }

      }
   };

   context.setNodeAnswer = function(nodeId, answer) {
      //console.log("Answer", nodeId, answer);

      var node = context.findNodeById(nodeId);
      node.answer = answer;

      if (context.display)
         $("#node-" + nodeId + "-answer").text(JSON.stringify(answer));
   };

   infos.checkEndEveryTurn = false;
   infos.checkEndCondition = function(context, lastTurn) {
      if (lastTurn) {
         
         var verticeId = context.curNode ;
         var nodeId = context.findNodeByVertice("v_" + verticeId).nodeId;

         //console.log (nodeId, "is done ");
   
         context.setNodeStatus(nodeId, "finnished");
         var allFinnished = true;

         for (var i = 0; i < context.nodesAndNeighbors.length; i++)
         {
            
            if (context.nodesAndNeighbors[i].status != "finnished")
            {
               allFinnished = false;
               break;
            }
         }

         if (allFinnished)
         {
            console.log("All done!");
            context.success = true;
            throw("Done");
         }
      }
   };


   // A context must have a reset function to get back to the initial state
   context.reset = function(taskInfos) {
      // Do something here

      if (taskInfos != undefined) {
         context.graphDefinition = taskInfos.graphDefinition;

         context.Graph = Graph.fromJSON(JSON.stringify(context.graphDefinition.minGraph));
      }

      var vertices = context.Graph.getAllVertices();
      context.nodesAndNeighbors = [];
      context.nodeMessages = {};

      for (var iVertices = 0; iVertices < vertices.length; iVertices++)
      {
         var neighbors = context.Graph.getNeighbors(vertices[iVertices]);

         context.nodesAndNeighbors.push(
            {
               vertice: vertices[iVertices],
               nodeId: Math.floor(Math.random() * 900) + 100,
               status: "stopped",
               messages: [],
            }
         );
      }

      for (var iVertices = 0; iVertices < vertices.length; iVertices++)
      {
         var neighbors = context.Graph.getNeighbors(vertices[iVertices]);

         for (var i = 0; i < neighbors.length; i++)
         {
            neighbors[i] = context.findNodeByVertice(neighbors[i]).nodeId;
         }

         context.nodesAndNeighbors[iVertices].neighbors = neighbors;
      }

      context.nbNodes = vertices.length;

      context.globaMessageCount = 0;

      if (context.display) {
         context.resetDisplay();
      }
   };

   // Reset the context's display
   context.resetDisplay = function() {
      // Do something here

      var hasIntroControls = $('#taskIntro').find('#introControls').length;
      if (!hasIntroControls) {
          $('#taskIntro').append(`<div id="introControls"></div>`);
      }

      $('#introControls').html("<div><button id=piconnect>Connect</button><button id=piinstall>Install</button></div>")

      $('#piconnect').click(function() {
         context.quickPiConnection.connect("ws://192.168.0.5/api/v1/commands");
      });

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

       var tableStatus = "<table style='border-spacing: 15px; margin: auto;'><tr><th>#</th><th>ID</th><th>Status</th><th>Answer</th></tr>";

       $.each(context.nodesAndNeighbors, function(index) {
            //console.log(context.nodesAndNeighbors[index]);
            var nodeId = context.nodesAndNeighbors[index].nodeId;

            tableStatus += "<tr>"; 
            tableStatus += "<td>" + context.nodesAndNeighbors[index].vertice + "</td>";
            tableStatus += "<td>" + nodeId + "</td>";
            tableStatus += "<td id='node-" + nodeId + "-status'>Stopped</td>";
            tableStatus += "<td id='node-" + nodeId + "-answer'>Unknow</td>";


            tableStatus += "</tr>"; 
       });
       tableStatus += "</table>";

       $('#nodeStatus').html(tableStatus);


       var tableMessages = "<table id='messageTable' style='border-spacing: 15px; margin: auto;'><tr><th>Source</th><th>Destination</th><th>Message</th><th>Status</th></tr></table>";
       $('#nodeMessages').html(tableMessages);
      


       $('#piinstall').click(function() {
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

       var w = $('#nodeGraph').width();
       var h = $('#nodeGraph').height();

      this.raphaelFactory.destroyAll();
      paper = this.raphaelFactory.create(
         "paperMain",
         "nodeGraph",
         w,
         h
      );

      context.verticeRadius = 22;

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
      vGraph = new VisualGraph("vGraph", paper, context.Graph, graphDrawer, true, context.graphDefinition.vertexVisualInfo);

      this.graphMouse = new GraphMouse("GraphMouse", context.Graph, vGraph);

      var vertices = context.Graph.getAllVertices();
      var graphW = w;
      var graphH = h;

      //paper.path( ["M", 0, graphH, "L", w, graphH ] );
      //paper.path( ["M", graphW, 0, "L", graphW, h ] );


      var graphOriginalW = 0;
      var graphOriginalH = 0;


      $.each(vertices, function(index) {
         var id = vertices[index];

         //var pos = vGraph.graphDrawer.getVertexPosition(id);

         var vertexObject = vGraph.getRaphaelsFromID(id)[0];
         var r = vertexObject.attrs['r'];
         var x = vertexObject.attrs['cx'] + r;
         var y = vertexObject.attrs['cy'] + r;

         if (x > graphOriginalW)
            graphOriginalW = x;

         if (y > graphOriginalH)
            graphOriginalH = y;
      });

      var scaleFactorW = graphW / graphOriginalW;
      var scaleFactorH = graphH / graphOriginalH;



      $.each(vertices, function(index) {
         var id = vertices[index];

         var pos = vGraph.graphDrawer.getVertexPosition(id);

         vGraph.graphDrawer.moveVertex(id, pos.x * scaleFactorW, pos.y * scaleFactorH);
      });

      vGraph.redraw();

      var a = new PaperMouseEvent("paperMain", context.paper, "mousemove", function() {
         console.log("Hello");
      }, true);


      //this.graphMouse.addEvent("whatever", "click", "vertex", null, [function() { console.log("test") }]);

      this.graphMouse.addEvent("whatever2", "click", "edge", null, [function(id) {
         var id = (Beav.Navigator.isIE8()) ? elementID : this.data("id");
         var vertexObject = vGraph.getRaphaelsFromID(id)[0];

         var a = vertexObject.node.getBoundingClientRect();
         var x = a.x + 50;
         var y = a.y;

         var vertices = context.Graph.getEdgeVertices(id);
         var firstNodeId = context.findNodeByVertice(vertices[0]).nodeId;
         var secondNodeId = context.findNodeByVertice(vertices[1]).nodeId;

         var firstKey = firstNodeId + "-" + secondNodeId;
         var secondKey = secondNodeId + "-" + firstNodeId;


         $('#screentooltip').remove();
         $( "body" ).append('<div id="screentooltip"></div>');

         var html = "";
         if (context.nodeMessages[firstKey])
         {
            for (var i = 0; i < context.nodeMessages[firstKey].length; i++)
            {
               html += "From " + firstNodeId + " to " + secondNodeId + " Message: " + context.nodeMessages[firstKey][i].message + "<p>";
            }
         }
         
         if (context.nodeMessages[secondKey])
         {
            for (var i = 0; i < context.nodeMessages[secondKey].length; i++)
            {
               html += "From " + secondNodeId+ " to " + firstNodeId  + " Message: " + context.nodeMessages[secondKey][i].message + "<p>";
            }
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

      }]);

      VertexToggler("whatever", context.Graph, vGraph, this.graphMouse, function(id, selected) {

         var vertexObject = vGraph.getRaphaelsFromID(id)[0];

         var a = vertexObject.node.getBoundingClientRect();
         var x = a.x + 50;
         var y = a.y;


         if (selected) {
   
            //vertexObject.attr(vertexAttr);
            $('#screentooltip').remove();
         }
         else {
            $('#screentooltip').remove();
            $( "body" ).append('<div id="screentooltip"></div>');

            for (var i = 0; i < context.nodesAndNeighbors.length; i++)
            {
               if (context.nodesAndNeighbors[i].vertice == id)
               {
                  $('#screentooltip').html(
                     "NodeId: " + context.nodesAndNeighbors[i].nodeId + 
                     "<p>Answer: " + context.nodesAndNeighbors[i].answer);
                  break;      
               }
            }
            

            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "30px");
            $('#screentooltip').css("z-index", "1000");
            //$('#screentooltip').css("width", "262px");
            //$('#screentooltip').css("height", "70px");

            $('#screentooltip').css("left", x).css("top", y);
         }

         

         
         }, true);


      //this.graphMouse.addEvent("whatever2", "mousemove", "vertex", null, [function() { console.log("mousemove") }]);

/*
      VertexClicker("VertexClicker", context.Graph, vGraph, this.graphMouse, function()
      {
         alert("clicker");
      }, true);*/

      
      // Ask the parent to update sizes
      context.blocklyHelper.updateSize();
      context.updateScale();
   };

   // Update the context's display to the new scale (after a window resize for instance)
   context.updateScale = function() {
      if (!context.display) {
         return;
      }
      
      var width = $('#nodeGraph').width();
      var height =  $('#nodeGraph').height();

      if (!context.oldwidth ||
          !context.oldheight ||
          context.oldwidth != width ||
          context.oldheight != height) {

          context.oldwidth = width;
          context.oldheight =  height;

          context.resetDisplay();
      }
   };

   // When the context is unloaded, this function is called to clean up
   // anything the context may have created
   context.unload = function() {
      // Do something here
      if (context.display) {
         // Do something here
      }
   };



   context.setCurNode  = function(verticeId)
   {
      context.curNode = verticeId;
      var nodeId = context.findNodeByVertice("v_" + verticeId).nodeId;

      var node = context.findNodeById(nodeId);
      if (node.status == "stopped")
         context.setNodeStatus(nodeId, "running");
   }

   /***** Functions *****/
   /* Here we define each function of the library.
      Blocks will generally use context.group.blockName as their handler
      function, hence we generally use this name for the functions. */


   context.distributed.getNodeID = function(callback)
   {
      var verticeId = context.curNode;
      var nodeId = context.findNodeByVertice("v_" + verticeId).nodeId;

      context.runner.waitDelay(callback, nodeId);
   };
   context.distributed.getNeighbors = function(callback)
   {
      var verticeId = context.curNode;
      var node =  context.findNodeByVertice("v_" + verticeId);

      context.runner.waitDelay(callback, node.neighbors);
   };
   context.distributed.getNextMessage = function(callback)
   {
      var verticeId = context.curNode;
      var node = context.findNodeByVertice("v_" + verticeId);
      var message = null;

      if (node.messages.length > 0) {
         message = node.messages.shift();
         message.status = "read";


         context.updateMessageStatus(message.messageId, message.status);

         if (context.display)
         {
            var toPos = vGraph.graphDrawer.getVertexPosition(node.vertice);

            message.circle.animate({cx: toPos.x, cy: toPos.y}, 500, "linear", function() {
               message.circle.remove();
            });
         }

         context.runner.waitDelay(callback, message.message, 500);
      }
      else
      {
         context.setNodeStatus(node.nodeId, "waitingformessage");

         var cb = context.runner.waitCallback(callback);

         var timeout = setInterval(function() {
            if(node.messages.length > 0) {
               clearInterval(timeout); 
               message = node.messages.shift();
               message.status = "read";
               context.updateMessageStatus(message.messageId, message.status)
               context.setNodeStatus(node.nodeId, "running");

               if (context.display)
               {
                  var toPos = vGraph.graphDrawer.getVertexPosition(node.vertice);
      
                  message.circle.animate({cx: toPos.x, cy: toPos.y}, 500, "linear", function() {
                     message.circle.remove();
                     message.circle = null;
                     cb(message.message);
                  });
               }
               else {      
                  cb(message.message);
               }
            }
         }, 500);
      }
   };

   context.distributed.sendMessage = function(recipientId, message, callback)
   {
      var verticeId = context.curNode;
      var fromNode = context.findNodeByVertice("v_" + verticeId);
      var toNode = context.findNodeById(recipientId);
      var messageId = context.globaMessageCount++;
      var circle = null;

      context.displayMessage(fromNode.nodeId, toNode.nodeId, message, messageId);

      if (context.display) {
         var fromVertice = fromNode.vertice;
         var toVertice = toNode.vertice;
         var fromPos = vGraph.graphDrawer.getVertexPosition(fromVertice);
         var toPos = vGraph.graphDrawer.getVertexPosition(toVertice);

         circle = paper.circle(fromPos.x, fromPos.y, 5);
         circle.attr("fill", "lightblue");

         var x1 = fromPos.x;
         var x2 = toPos.x;
         var y1 = fromPos.y;
         var y2 = toPos.y;

         var slope = Math.abs((toPos.y - fromPos.y) / (toPos.x - fromPos.x));

         var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - context.verticeRadius;

         var xsign = 1;
         if (x1 > x2)
            xsign = -1;
         var ysign = 1;
         if (y1 > y2)
            ysign = -1;

         var x = x1 + (xsign * distance * (1 / (Math.sqrt(1 + Math.pow(slope, 2)))));
         var y = y1 + (ysign * distance * (slope / (Math.sqrt(1 + Math.pow(slope, 2)))));

         circle.animate({cx: x, cy: y}, 1000, "linear", function() {
            //circle.remove();
         });
         
      }

      toNode.messages.push({
         fromId: fromNode.nodeId,
         message: message,
         status: "queued",
         messageId: messageId,
         circle: circle
      })

      context.runner.waitDelay(callback, null, 1000);
   };

   context.distributed.submitAnswer = function(answer, callback)
   {
      var verticeId = context.curNode;
      var nodeId = context.findNodeByVertice("v_" + verticeId).nodeId;

      context.setNodeAnswer(nodeId, answer);

      context.runner.waitDelay(callback);
   };

   context.distributed.isMessageWaiting = function(callback)
   {
      var verticeId = context.curNode;
      var node = context.findNodeByVertice("v_" + verticeId);
      var message = null;
      var retVal = false;

      if (node.messages.length > 0)
         retVal = true;

      context.runner.waitDelay(callback, retVal);
   };

   context.distributed.log = function(string, callback)
   {
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
            { name: "getNextMessage", yieldsValue: true },
            { name: "sendMessage", params: [null, null] },
            { name: "submitAnswer", params: [null] },
            { name: "isMessageWaiting", yieldsValue: true },
            { name: "log", params: [null] },
         ],
         sensors: [
         ]
      }
      // We can add multiple namespaces by adding other keys to customBlocks.
   };

   // Color indexes of block categories (as a hue in the range 0–420)
   context.provideBlocklyColours = function() {
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

// Register the library; change "template" by the name of your library in lowercase
if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('distributed', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['distributed', getContext]);
}
