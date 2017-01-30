"use strict";

var makeTurtle = function() {
   this.reset = function() {
      this.x = 150;
      this.y = 150;
      this.direction = 0;
      this.paint = true;
      if (this.drawingContext)
         this.drawingContext.clearRect(0, 0, 300, 300);
      if (this.turtle) {
         this.turtle.style.left= this.x - 11 + "px";
         this.turtle.style.top= this.y - 13 + "px";
         this.turtle.style.transform = "none";
         
      }
   }
   this.reset();
   
   this.turn = function(angle) {
      this.direction += angle*Math.PI/180;
      if (this.turtle) {
         this.turtle.style.transform = "none";
         this.turtle.style.transform = "rotate(" + (-this.direction) + "rad)";
      }
   }
   this.move = function(amount) {
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(this.x, this.y);
      this.x -= amount*10*Math.sin(this.direction);
      this.y -= amount*10*Math.cos(this.direction);
      this.drawingContext.lineTo(this.x, this.y);
      if (this.paint) {
         this.drawingContext.stroke();
      }
      
      if (this.turtle) {
         this.turtle.style.left= this.x - 11 + "px";
         this.turtle.style.top= this.y - 13 + "px";
      }
   }
   this.start_painting = function() {
      this.paint = true;
   }
   this.stop_painting = function() {
      this.paint = false;
   }
   
   this.set_colour = function(colour) {
      this.drawingContext.strokeStyle = colour;
   }
   this.setDrawingContext = function(drawingContext) {
      this.drawingContext = drawingContext;
      this.drawingContext.lineWidth = 3;
      this.drawingContext.lineCap = 'round'
   }
   this.setTurtle = function(turtle) {
      this.turtle = turtle;

      this.turtle.style.left= this.x - 11 + "px";
      this.turtle.style.top= this.y - 13 + "px";
   }
}


var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
          
         startingBlockName: "Turtle-Programm:",
      },
      de: {
         label: {
            move: "gehe",
            turnleft: "drehe nach links",
            turnright: "drehe nach rechts",
            turn: "drehe (Grad) ",
            alert: "messagebox",
            log: "logge",
         },
         code: {
            move: "gehe",
            turnleft: "drehe_links",
            turnright: "drehe_rechts",
            turn: "drehe",
            alert: "alert",
            log: "log",
         },
         startingBlockName: "Turtle-Programm",
      }
   };
   
   window.stringsLanguage = window.stringsLanguage || "fr";
   window.languageStrings = window.languageStrings || {};

   if (typeof window.languageStrings != "object") {
      console.error("window.languageStrings is not an object");
   }
   else { // merge translations
      $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
   }   
   var strings = window.languageStrings;
   
   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;

   var context = {
      display: display,
      infos: infos,
      turtle: {displayTurtle : new makeTurtle, displaySolutionTurtle : new makeTurtle, invisibleTurtle : new makeTurtle, invisibleSolutionTurtle : new makeTurtle},
      strings: strings,
   };

   context.changeDelay = function(newDelay) {
      infos.actionDelay = newDelay;
   };

   context.waitDelay = function(callback, value) {
      context.runner.waitDelay(callback, value, infos.actionDelay);
   };

   context.callCallback = function(callback, value) { // Default implementation
      context.runner.noDelay(callback, value);
   };

   context.nbRobots = 1;

   context.getRobotItem = function(iRobot) {
      var items = context.getItems(undefined, undefined, {category: "robot"});
      return items[iRobot];
   };


   context.debug_alert = function(callback, message) {
      message = message ? message.toString() : '';
      if (context.display) {
         alert(message);
      }
      context.callCallback(callback);
   };

   context.debug_log = function(callback, message) {
      message = message ? message.toString() : '';
      if (context.display) {
         console.log("vvvvv");
      }
      console.log(message);
      if (context.display) {
         console.log("^^^^^");
      }
      context.callCallback(callback);
   };

   

   context.program_end = function(callback) {
      var curRobot = context.curRobot;
      if (!context.programEnded[curRobot]) {
         context.programEnded[curRobot] = true;
         infos.checkEndCondition(context, true);
      }
      context.waitDelay(callback);
   };

   context.reset = function(gridInfos) {
      if (context.display && gridInfos) {
         context.resetDisplay();

         context.turtle.displayTurtle.setDrawingContext(document.getElementById('displayfield').getContext('2d'));
         context.turtle.displaySolutionTurtle.setDrawingContext(document.getElementById('solutionfield').getContext('2d'));

         context.turtle.displayTurtle.reset();
         context.turtle.displaySolutionTurtle.reset();         
      }
    
      function createMeACanvas() {
         var canvas = document.createElement('canvas');
         canvas.width = 300;
         canvas.height = 300;
         canvas.style.width = "300px";
         canvas.style.heigth = "300px";
         canvas.style.border = "1px solid black";
         canvas.style.display = "none";

         //document.body.appendChild(canvas); // for debug
         return canvas;
      }
      
      if (gridInfos) {
         context.turtle.invisibleTurtle.setDrawingContext(createMeACanvas().getContext('2d'));
         context.turtle.invisibleSolutionTurtle.setDrawingContext(createMeACanvas().getContext('2d'));

         context.turtle.invisibleTurtle.reset();
         context.turtle.invisibleSolutionTurtle.reset();
         
         context.drawSolution = gridInfos.drawSolution;

         context.drawSolution(context.turtle.invisibleSolutionTurtle);
         if (context.display) {
            context.drawSolution(context.turtle.displaySolutionTurtle);
         }
      }
   };

   context.resetDisplay = function() {
      $("#errors").html("");

      $("#grid").html("<div id='output'  style='height: 300px;width: 300px;border: solid 2px;margin: 12px;position:relative;background-color:white;'> <img id='drawinggrid' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;opacity: 0.1;filter: alpha(opacity=10);' src='grid5.png'><canvas id='solutionfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;opacity: 0.2;filter: alpha(opacity=20);'></canvas><canvas id='displayfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;'></canvas><canvas id='invisibledisplayfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;visibility:hidden;'></canvas><img id='turtle' src='turtle.svg' style='width: 22px; height: 27px; position:absolute; left: 139px; top: 136px;'></img></div>")
      
      context.blocklyHelper.updateSize();
      context.turtle.displayTurtle.setTurtle(document.getElementById('turtle'));
      context.turtle.displayTurtle.reset();
      
      context.updateScale(); // does nothing for now 
   };

   context.unload = function() {
      if (context.display) {
         // ... clean up necessary?
      }
   };

   function callOnAllTurtles(fn) {
      fn(context.turtle.invisibleTurtle);
      if (context.display) {
         fn(context.turtle.displayTurtle);
      }
   }
   
   context.turtle.move = function(callback) {
      callOnAllTurtles((turtle) => {
         turtle.move(5);
      })
      
      context.waitDelay(callback);
   }

   context.turtle.turn = function(callback, param) {
      callOnAllTurtles((turtle) => {
         turtle.turn(param);
      })

      context.waitDelay(callback);
   }
   
   context.turtle.turnleft = function(callback) {
      callOnAllTurtles((turtle) => {
         turtle.turn(90);
      })

      context.waitDelay(callback);
   }
   
   context.turtle.turnright = function(callback) {
      callOnAllTurtles((turtle) => {
         turtle.turn(-90);
      });
      
      context.waitDelay(callback);
   }

   context.customBlocks = {
      turtle: {
         turtle: [
            { name: "move" },
            { name: "turnleft" },
            { name: "turnright" },
            { name: "turn",     params: [null]},
         ],
      },
      
      debug: {
         debug: [
            { name: "alert", params: [null], handler: context.debug_alert,
              blocklyXml: "<block type='alert'><value name='PARAM_0'><block type='text'><field name='TEXT'></field></block></value></block>"},
            { name: "log",   params: [null], handler: context.debug_log,
              blocklyXml: "<block type='log'><value name='PARAM_0'><block type='text'><field name='TEXT'></field></block></value></block>"},
         ],
      },
   };
   

   context.getItems = function(row, col, filters) {
      var listItems = [];
      for (var iItem = 0; iItem < context.items.length; iItem++) {
         var item = context.items[iItem];
         var itemType = infos.itemTypes[item.type];
         if ((row == undefined) || ((item.row == row) && (item.col == col))) {
            var accepted = true;
            for (var property in filters) {
               var value = filters[property];
               if ((itemType[property] == undefined) && (value != undefined)) {
                  accepted = false;
                  break;
               }
               if ((itemType[property] != undefined) && (itemType[property] != value)) {
                  accepted = false;
                  break;
               }
            }
            if (accepted) {
               item.index = iItem;
               listItems.push(item);
            }
         }
      }
      return listItems;
   };



   context.updateScale = function() {
   };

   return context;
}
