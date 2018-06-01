

var makeTurtle = function(coords) {
   this.reset = function(stepsize) {
      this.x = 150;
      this.y = 150;
      if(coords !== undefined) {
         this.x = coords.x;
         this.y = coords.y;
      }
      this.stepsize = 1;
      this.direction = 0;
      this.paint = true;
      this.stepsize = 5;
      if (this.drawingContext)
         this.drawingContext.clearRect(0, 0, 300, 300);
      if (this.turtle) {
         this.turtle.src = this.turtle.getAttribute("pendown");
         this.turtle.style.left= this.x - 11 + "px";
         this.turtle.style.top= this.y - 13 + "px";
         this.turtle.style.transform = "none";
      }
      if (stepsize) {
         this.stepsize = stepsize;
      }
   }
   this.reset(5);
   
   this.turn = function(angle) {
      this.direction += angle*Math.PI/180;
      if (this.turtle) {
         this.turtle.style.transform = "none";
         this.turtle.style.transform = "rotate(" + (-this.direction) + "rad)";
      }
   }
   this.move = function(amount) {
      if (this.paint) {
         this.drawingContext.beginPath();
         this.drawingContext.moveTo(this.x, this.y);
      }
      
      this.x -= amount * this.stepsize * 10 * Math.sin(this.direction);
      this.y -= amount * this.stepsize * 10 * Math.cos(this.direction);
     
      if (this.paint) {
         this.drawingContext.lineTo(this.x, this.y);
         this.drawingContext.stroke();
      }
      
      if (this.turtle) {
         this.turtle.style.left= this.x - 11 + "px";
         this.turtle.style.top= this.y - 13 + "px";
      }
   }
   this.start_painting = function() {
      this.paint = true;
      if(this.turtle) {
         this.turtle.src = this.turtle.getAttribute("pendown");
      }
   }
   this.stop_painting = function() {
      this.paint = false;
      if(this.turtle) {
         this.turtle.src = this.turtle.src = this.turtle.getAttribute("penup");
      }
   }
   
   this.set_colour = function(colour) {
      this.drawingContext.strokeStyle = colour;
   }
   this.set_stepsize = function(stepsize) {
      this.stepsize = stepsize;
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
};


var getContext = function(display, infos) {
   var localLanguageStrings = {
      fr: {
         turnleft: "droite ↺",
         turnright: "gauche ↻",
         penup: "lever le pinceau",
         pendown: "baisser le pinceau",
         categories: {
            turtle: "Tortue"
         },
         label: {
            move: "avancer",
            moveamount: "avancer de %1 pas",
            movebackamount: "reculer de %1 pas",
            moveamountvalue: "avancer de %1 pas",
            movebackamountvalue: "reculer de %1 pas",
            turnleft: "tourner vers la droite ↺",
            turnright: "tourner vers la gauche ↻",
            turnleftamount: "tourner de %1° vers la gauche ↺",
            turnrightamount: "tourner de %1° vers la droite ↻",
            turnleftamountvalue: "tourner de %1 vers la gauche ↺",
            turnrightamountvalue: "tourner de %1 vers la droite ↻",
            turnleftamountvalue_noround: "drehe um %1 Grad nach links ↺",
            turnrightamountvalue_noround: "drehe um %1 Grad nach rechts ↻",
            turnleftamountvalue_options: "drehe um %1 nach links ↺",
            turnrightamountvalue_options: "drehe um %1 nach rechts ↻",
            turnleftamountvalue_moreoptions: "drehe um %1 nach links ↺",
            turnrightamountvalue_moreoptions: "drehe um %1 nach rechts ↻",
            turneitheramount: "tourner de %1° vers la %2",
            turneitheramountvalue: "tourner de %1 vers la %2",
            penup: "lever le pinceau",
            pendown: "baisser le pinceau",
            peneither: "%1",
            colour2: "setze Farbe",
            colourvalue: "mettre la couleur %1",
            turn: "drehe (Grad) ",
            alert: "messagebox",
            log: "logge",
            inputvalue: "Eingabewert"
         },
         code: {
            move: "avancer",
            moveamount: "avancer",
            movebackamount: "reculer",
            moveamountvalue: "avancer",
            movebackamountvalue: "reculer",
            turnleft: "tournerGauche",
            turnright: "tournerDroite",
            turnleftamount: "gauche",
            turnrightamount: "droite",
            turnleftamountvalue: "gauche",
            turnrightamountvalue: "droite",
            turnleftamountvalue_noround: "dreheLinksGrad",
            turnrightamountvalue_noround: "dreheRechtsGrad",
            turnleftamountvalue_options: "dreheLinksGrad",
            turnrightamountvalue_options: "dreheRechtsGrad",
            turnleftamountvalue_moreoptions: "dreheLinksGrad",
            turnrightamountvalue_moreoptions: "dreheRechtsGrad",
            turneitheramount: "tourner",
            turneitheramountvalue: "tourner",
            penup: "leverPinceau",
            pendown: "baisserPinceau",
            peneither: "stift",
            colour2: "setzeFarbe",
            colourvalue: "couleur",
            turn: "drehe",
            alert: "alert",
            log: "log",
            inputvalue: "eingabewert"
         },
         description: {
         },
         startingBlockName: "Programme de la tortue",
         messages: {
            paintingWrong: "La tortue n'a pas tout dessiné correctement.",
            paintingCorrect: "Bravo! La tortue a tout dessiné correctement.",
            paintingFree: "La tortue a tracé le dessin que vous avez programmé. Si vous voulez le garder, faites une capture d'écran."
         }
      },
      de: {
         left: "links ↺",
         right: "rechts ↻",
         penup: "hebe Stift ab",
         pendown: "setze Stift auf",
         categories: {
            turtle: "Schildkröte"
         },
         label: {
            move: "gehe",
            moveamount: "gehe %1 Schritte",
            movebackamount: "gehe %1 Schritte zurück",
            moveamountvalue: "gehe %1 Schritte",
            movebackamountvalue: "gehe %1 Schritte zurück",
            turnleft: "drehe nach links ↺",
            turnright: "drehe nach rechts ↻",
            turnleftamount: "drehe um %1° nach links ↺",
            turnrightamount: "drehe um %1° nach rechts ↻",
            turnleftamountvalue: "drehe um %1 nach links ↺",
            turnrightamountvalue: "drehe um %1 nach rechts ↻",
            turnleftamountvalue_noround: "drehe um %1 Grad nach links ↺",
            turnrightamountvalue_noround: "drehe um %1 Grad nach rechts ↻",
            turnleftamountvalue_options: "drehe um %1 nach links ↺",
            turnrightamountvalue_options: "drehe um %1 nach rechts ↻",
            turnleftamountvalue_moreoptions: "drehe um %1 nach links ↺",
            turnrightamountvalue_moreoptions: "drehe um %1 nach rechts ↻",
            turnleftamountvalue_europe: "drehe um %1 nach links ↺",
            turnrightamountvalue_europe: "drehe um %1 nach rechts ↻",
            turnleftamountvalue_nikolaus: "drehe um %1 nach links ↺",
            turnrightamountvalue_nikolaus: "drehe um %1 nach rechts ↻",
            turneitheramount: "drehe um %1° nach %2",
            turneitheramountvalue: "drehe um %1 nach %2",
            penup: "hebe Stift ab",
            pendown: "setze Stift auf",
            peneither: "%1",
            colour2: "setze Farbe",
            colourvalue: "setze Farbe %1",
            turn: "drehe (Grad) ",
            alert: "messagebox",
            log: "logge",
            inputvalue: "Eingabewert"
         },
         code: {
            move: "gehe",
            moveamount: "geheSchritte",
            movebackamount: "geheZurueckSchritte",
            moveamountvalue: "geheSchritte",
            movebackamountvalue: "geheZurueckSchritte",
            turnleft: "dreheLinks",
            turnright: "dreheRechts",
            turnleftamount: "dreheLinksGrad",
            turnrightamount: "dreheRechtsGrad",
            turnleftamountvalue: "dreheLinksGrad",
            turnrightamountvalue: "dreheRechtsGrad",
            turnleftamountvalue_noround: "dreheLinksGrad",
            turnrightamountvalue_noround: "dreheRechtsGrad",
            turnleftamountvalue_options: "dreheLinksGrad",
            turnrightamountvalue_options: "dreheRechtsGrad",
            turnleftamountvalue_moreoptions: "dreheLinksGrad",
            turnrightamountvalue_moreoptions: "dreheRechtsGrad",
            turnleftamountvalue_europe: "dreheLinksGrad",
            turnrightamountvalue_europe: "dreheRechtsGrad",
            turnleftamountvalue_nikolaus: "dreheLinksGrad",
            turnrightamountvalue_nikolaus: "dreheRechtsGrad",
            turneitheramount: "dreheGrade",
            turneitheramountvalue: "dreheGrad",
            penup: "stiftHoch",
            pendown: "stiftRunter",
            peneither: "stift",
            colour2: "setzeFarbe",
            colourvalue: "setzeFarbe",
            turn: "drehe",
            alert: "alert",
            log: "log",
            inputvalue: "eingabewert"
         },
         description: {
         },
         startingBlockName: "Schildkröten-Programm",
         messages: {
            paintingWrong: "Die Schildkröte hat nicht alles richtig gezeichnet.",
            paintingCorrect: "Bravo! Die Schildkröte hat alles richtig gezeichnet.",
            paintingFree: "La tortue a tracé le dessin que vous avez programmé. Si vous voulez le garder, vous pouvez faire une capture d'écran."
         }
      },
      none: {
         comment: {
         }
      }
   };

   var context = quickAlgoContext(display, infos);
   var strings = context.setLocalLanguageStrings(localLanguageStrings);
   
   var cells = [];
   var texts = [];
   var scale = 1;
   var paper;
   
   context.turtle = {displayTurtle : new makeTurtle(infos.coords), displaySolutionTurtle : new makeTurtle(infos.coords), invisibleTurtle : new makeTurtle(infos.coords), invisibleSolutionTurtle : new makeTurtle(infos.coords)};

   switch (infos.blocklyColourTheme) {
      case "bwinf":
         context.provideBlocklyColours = function() {
            return {
               categories: {
                  logic: 100,
                  loops: 180,
                  math: 230,
                  texts: 60,
                  lists: 40,
                  colour: 20,
                  variables: 330,
                  functions: 290,
                  turtle: 260,
                  turtleInput: 200,
                  _default: 0
               },
               blocks: {}
            };
         }
         break;
      default:
         // we could set turtle specific default colours here, if we wanted to …
   }

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

   context.reset = function(gridInfos) {
      if(gridInfos === undefined) {
         gridInfos = context.defaultGridInfos;
      }
      else {
         context.defaultGridInfos = gridInfos;
      }
      
      if (context.display && gridInfos) {
         context.resetDisplay();

         context.turtle.displayTurtle.setDrawingContext(document.getElementById('displayfield').getContext('2d'));
         context.turtle.displaySolutionTurtle.setDrawingContext(document.getElementById('solutionfield').getContext('2d'));

         context.turtle.displayTurtle.reset(context.infos.turtleStepSize);
         context.turtle.displaySolutionTurtle.reset(context.infos.turtleStepSize);
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

         context.turtle.invisibleTurtle.reset(context.infos.turtleStepSize);
         context.turtle.invisibleSolutionTurtle.reset(context.infos.turtleStepSize);
         
         context.drawSolution = gridInfos.drawSolution;
         context.inputValue   = gridInfos.inputValue;

         context.drawSolution(context.turtle.invisibleSolutionTurtle);
         if (context.display) {
            context.drawSolution(context.turtle.displaySolutionTurtle);
         }
      }
   };

   context.resetDisplay = function() {
      var turtleFileName = "turtle.svg";
      
      if ($("#turtleImg").length > 0) {
         turtleFileName = $("#turtleImg").attr("src");
      }
      var turtleUpFileName = "turtle.svg";
      if ($("#turtleUpImg").length > 0) {
         turtleUpFileName = $("#turtleUpImg").attr("src");
      }
      $("#grid").html("<div id='output'  style='height: 300px;width: 300px;border: solid 2px;margin: 12px;position:relative;background-color:white;'> <img id='drawinggrid' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;opacity: 0.4;filter: alpha(opacity=10);' src='" + context.infos.overlayFileName + "'><canvas id='solutionfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;opacity: 0.4;filter: alpha(opacity=20);'></canvas><canvas id='displayfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;'></canvas><canvas id='invisibledisplayfield' width='300' height='300' style='width:300px;height:300px;position:absolute;top:0;left:0;visibility:hidden;'></canvas><img id='turtle' pendown='" + turtleFileName + "' penup='" + turtleUpFileName + "' src='" + turtleFileName + "' style='width: 22px; height: 27px; position:absolute; left: 139px; top: 136px;'></img></div>")
      
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

   context.updateScale = function() {
   };

   function callOnAllTurtles(fn) {
      fn(context.turtle.invisibleTurtle);
      if (context.display) {
         fn(context.turtle.displayTurtle);
      }
   }

   context.turtle.moveamount = function(param, callback) {
      if (typeof callback == "undefined") {
         callback = param;
         param = 0;
      }
         
      callOnAllTurtles(function(turtle) {
         turtle.move(param);
      })
      
      context.waitDelay(callback);
   }
   
   context.turtle.movebackamount = function(param, callback) {
      if (typeof callback == "undefined") {
         callback = param;
         param = 0;
      }
         
      callOnAllTurtles(function(turtle) {
         turtle.move(-param);
      });
      
      context.waitDelay(callback);
   }
   
   // DEPRECATED
   context.turtle.turn = function(param, callback) {
      callOnAllTurtles(function(turtle) {
         turtle.turn(param);
      })

      context.waitDelay(callback);
   }

   context.turtle.turneitheramount = function(degree, direction, callback) {
      if (typeof callback == "undefined") {
         callback = direction;
         direction = "l";
         if (typeof callback == "undefined") {
            callback = degree;
            degree = 0;
         }
      }
   
      callOnAllTurtles(function(turtle) {
         if (direction.search('l') != -1) {
            turtle.turn(degree);
         }
         else {
            turtle.turn(-degree);
         }
      });
      
      context.waitDelay(callback);
   }

   context.turtle.peneither = function(status, callback) {
      callOnAllTurtles(function(turtle) {
         if (status == "up") {
            turtle.stop_painting();
         }
         else {
            turtle.start_painting();
         }
      })

      context.waitDelay(callback);
   }

   context.turtle.move = function(callback) {
      context.turtle.moveamount(1, callback);
   }
   context.turtle.turnleftamount = function(param, callback) {
      context.turtle.turneitheramount(param, "l", callback);
   }
   context.turtle.turnrightamount = function(param, callback) {
      context.turtle.turneitheramount(param, "r", callback);
   }
   context.turtle.turnleft = function(callback) {
      context.turtle.turnleftamount(90, callback);
   }   
   context.turtle.turnright = function(callback) {
      context.turtle.turnrightamount(90, callback);
   }
   context.turtle.penup = function(callback) {
      context.turtle.peneither("up", callback);
   }
   context.turtle.pendown = function(callback) {
      context.turtle.peneither("down", callback);
   }
   context.turtle.inputvalue = function(callback) {
      context.callCallback(callback, context.inputValue);
   };

   context.turtle.moveamountvalue = context.turtle.moveamount;
   context.turtle.movebackamountvalue = context.turtle.movebackamount;
   context.turtle.turnleftamountvalue = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue = context.turtle.turnrightamount;
   context.turtle.turneitheramountvalue = context.turtle.turneitheramount;
   context.turtle.turnleftamountvalue_noround = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue_noround = context.turtle.turnrightamount;
   context.turtle.turnleftamountvalue_options = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue_options = context.turtle.turnrightamount;
   context.turtle.turnleftamountvalue_moreoptions = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue_moreoptions = context.turtle.turnrightamount;
   context.turtle.turnleftamountvalue_europe = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue_europe = context.turtle.turnrightamount;
   context.turtle.turnleftamountvalue_nikolaus = context.turtle.turnleftamount;
   context.turtle.turnrightamountvalue_nikolaus = context.turtle.turnrightamount;
   

   context.turtle.colour2 = function(colour, callback) {
      if (typeof callback == "undefined") {
         callback = colour;
         colour = "#000000";
      }

      callOnAllTurtles(function(turtle) {
         turtle.set_colour(colour);
      })

      context.waitDelay(callback);
   }
   context.turtle.colourvalue = context.turtle.colour2;
   
   var defaultMoveAmount = 1;
   if(context.infos.defaultMoveAmount != undefined)
      defaultMoveAmount = context.infos.defaultMoveAmount;
   
   context.customBlocks = {
      turtle: {
         turtle: [
            { name: "move" },
            { name: "moveamount", params: [null]},
            { name: "movebackamount", params: [null]},
            { name: "moveamountvalue", blocklyJson: {"args0": [{"type": "field_number", "name": "PARAM_0", "value": defaultMoveAmount}]}},
            { name: "movebackamountvalue", blocklyJson: {"args0": [{"type": "field_number", "name": "PARAM_0", "value": defaultMoveAmount}]}},
            { name: "turnleft" },
            { name: "turnright" },
            { name: "turn",      params: [null]},
            { name: "turnleftamount", params: [null]},
            { name: "turnrightamount", params: [null]},
            { name: "turnleftamountvalue", blocklyJson: {"args0": [{"type": "field_angle", "name": "PARAM_0", "angle": 90}]}},
            { name: "turnrightamountvalue", blocklyJson: {"args0": [{"type": "field_angle", "name": "PARAM_0", "angle": 90}]}},
            { name: "turnleftamountvalue_noround", blocklyJson: {"args0": [{"type": "field_number", "name": "PARAM_0", "value": 90}]}},
            { name: "turnrightamountvalue_noround", blocklyJson: {"args0": [{"type": "field_number", "name": "PARAM_0", "value": 90}]}},
            { name: "turnleftamountvalue_options", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
                ["36 °","36"],["45 °","45"],["60 °","60"],["72 °","72"],["90 °","90"],["108 °","108"],["120 °","120"],["135 °","135"],["144 °","144"],["180 °","180"]]}]}},
            { name: "turnrightamountvalue_options", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
               ["36 °","36"],["45 °","45"],["60 °","60"],["72 °","72"],["90 °","90"],["108 °","108"],["120 °","120"],["135 °","135"],["144 °","144"],["180 °","180"]]}]}},
            { name: "turnleftamountvalue_moreoptions", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
               ["15 °","15"],["18 °","18"],["30 °","30"],["36 °","36"],["45 °","45"],["60 °","60"],["72 °","72"],["90 °","90"],["108 °","108"],["120 °","120"],["135 °","135"],["144 °","144"],["150 °","150"],["162 °","162"],["165 °","165"],["180 °","180"]]}]}},
            { name: "turnrightamountvalue_moreoptions", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
               ["15 °","15"],["18 °","18"],["30 °","30"],["36 °","36"],["45 °","45"],["60 °","60"],["72 °","72"],["90 °","90"],["108 °","108"],["120 °","120"],["135 °","135"],["144 °","144"],["150 °","150"],["162 °","162"],["165 °","165"],["180 °","180"]]}]}},
            { name: "turnleftamountvalue_europe", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
              ["15 °","15"],["30 °","30"],["75 °","75"],["90 °","90"],["105 °","105"],["144 °","144"],["162 °","162"],["180 °","180"]]}]}},
            { name: "turnrightamountvalue_europe", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
              ["15 °","15"],["30 °","30"],["75 °","75"],["90 °","90"],["105 °","105"],["144 °","144"],["162 °","162"],["180 °","180"]]}]}},
            { name: "turnleftamountvalue_nikolaus", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
              ["36.9 °","36.86989"],["53.1 °","53.13010"],["73.7 °","73.73979"],["90 °","90"],["106.3 °","106.26020"],["126.9 °","126.86989"],["143.1 °","143.13010"],["180 °","180"]]}]}},
            { name: "turnrightamountvalue_nikolaus", blocklyJson: {"args0": [{"type": "field_dropdown", "name": "PARAM_0", "options": [
              ["36.9 °","36.86989"],["53.1 °","53.13010"],["73.7 °","73.73979"],["90 °","90"],["106.3 °","106.26020"],["126.9 °","126.86989"],["143.1 °","143.13010"],["180 °","180"]]}]}},
            { name: "turneitheramount", blocklyJson: {"args0": [
               {"type": "input_value", "name": "PARAM_0"},
               {"type": "field_dropdown", "name": "PARAM_1", "options":
                 [[localLanguageStrings[window.stringsLanguage]["left"],"l"],[localLanguageStrings[window.stringsLanguage]["right"],"r"]]}]}},
            { name: "turneitheramountvalue", blocklyJson: {"args0": [
               {"type": "field_angle", "name": "PARAM_0", "angle": 90},
               {"type": "field_dropdown", "name": "PARAM_1", "options":
                 [[localLanguageStrings[window.stringsLanguage]["left"],"l"],[localLanguageStrings[window.stringsLanguage]["right"],"r"]]}]}},
            { name: "penup" },
            { name: "pendown" },
            { name: "peneither", blocklyJson: {"args0": [
               {"type": "field_dropdown", "name": "PARAM_0", "options":
                 [[localLanguageStrings[window.stringsLanguage]["penup"],"up"],[localLanguageStrings[window.stringsLanguage]["pendown"],"down"]]}]}},
            { name: "colour2", params: [null]},
            { name: "colourvalue", blocklyJson: {"args0": [{"type": "field_colour", "name": "PARAM_0", "colour": "#ff0000"}]}}
         ],
         turtleInput: [
            { name: "inputvalue", yieldsValue: true }
          ]
      },
      debug: {
         debug: [
            { name: "alert", params: [null], handler: context.debug_alert,
              blocklyXml: "<block type='alert'><value name='PARAM_0'><block type='text'><field name='TEXT'></field></block></value></block>"},
            { name: "log",   params: [null], handler: context.debug_log,
              blocklyXml: "<block type='log'><value name='PARAM_0'><block type='text'><field name='TEXT'></field></block></value></block>"}
         ]
      }
   };

   return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('turtle', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['turtle', getContext]);
}
