var _simulation_timeout_manager = {};

function Simulation(id, delayFactory) {
   this.id = id;
   this.stepIndex = 0;
   this.steps = [];
   this.autoPlaying = false;
   this.playing = false;
   this.stopping = false;
   this.speedFactor = 1;

   this.addStep = function(step) {
      var that = this;
      step.speedFactor = this.speedFactor;

      step.addEntryAllParents({
         name: "simulation$$$",
         action: {
            onExec: function(params, duration, callback) {
               that.playing = false;
               that.stepIndex++;
               if (that.autoPlaying) {
                  if (that.stepIndex < that.steps.length && !(that.stopping)) {
                     that.play();
                  }
               }
               callback();
            }
         }
      });

      this.steps.push(step);
   };

   this.addStepWithEntry = function(entry) {
      var step = new SimulationStep();
      step.addEntry(entry);
      this.addStep(step);
   };

   this.getLastStep = function() {
      return this.steps[this.steps.length - 1];
   };

   this.setAutoPlay = function(autoPlay) {
      this.autoPlaying = autoPlay;
   };

   this.play = function() {
      if(!this.canPlay())
         return
      this.playing = true;
      this.steps[this.stepIndex].setExpedite(this.expediting);
      this.steps[this.stepIndex].execute(delayFactory);
   };

   this.stop = function() {
      if (this.playing) {
         this.stopping = true;
         this.playing = false;
         this.steps[this.stepIndex].stop();
         this.stopping = false;
      }
   };

   this.playNext = function() {
      this.stepIndex++;
      this.play();
   };

   this.gotoAndPlay = function(stepIndex) {
      this.stepIndex = stepIndex;
      this.play();
   };

   this.gotoAndStop = function(stepIndex) {
      this.stop();
      this.stepIndex = stepIndex;
   };

   this.canPlay = function() {
      return this.steps && this.stepIndex < this.steps.length;
   };

   this.isPlaying = function() {
      return this.playing;
   };

   this.gotoLastStep = function() {
      this.stepIndex = this.steps.length - 1;
   };

   this.setExpedite = function(expedite) {
      if(!expedite) {
         this.expediting = false;
         return;
      }
      if(this.expediting) {
         return;
      }

      this.expediting = true;
      
      if(this.steps.length > this.stepIndex) {
         this.steps[this.stepIndex].setExpedite(true);
      }
   };

   this.setSpeedFactor = function(val) {
      this.speedFactor = val;      
      for(var step = this.stepIndex; step < this.steps.length; step++) {
         this.steps[step].setSpeedFactor(this.speedFactor);
      }
   };

   this.isOnLastStep = function() {
      return this.stepIndex === this.steps.length - 1;
   };

   this.clear = function() {
      this.stop();
      this.steps = [];
      this.stepIndex = 0;
   };
}

function SimulationStep() {
   this.entries = {};
   this.stopping = false;

   this.addEntry = function(entry) {
      this.entries[entry.name] = entry;
      if(entry.action.useTimeout){
         _simulation_timeout_manager[entry.name] = {};
      }
   };

   this.addEntries = function(entries) {
      for(var name in entries) {
         this.addEntry(entries[name]);
      }
   };

   this.addEntryAllParents = function(entry) {
      if (!(entry.parents)) {
         entry.parents = [];
      }
      for (var name in this.entries) {
         entry.parents.push(name);
      }
      this.addEntry(entry);
   };

   this.addEntriesAllParents = function(newEntries) {
      var newName;
      for (newName in newEntries) {
         var newEntry = newEntries[newName];
         if (!(newEntries.parents)) {
            newEntry.parents = [];
         }
         for (var name in this.entries) {
            newEntry.parents.push(name);
         }
      }
      for (newName in newEntries) {
         this.addEntry(newEntries[newName]);
      }
   };

   this.resetParents = function() {
      var name;

      for (name in this.entries) {
         this.entries[name].parentsDone = 0;
         this.entries[name].children = [];
      }

      for (name in this.entries) {
         var parents = this.entries[name].parents;
         for (var iParent in parents) {
            this.entries[parents[iParent]].children.push(name);
         }
      }
   };

   this.execute = function(delayFactory) {
      this.resetParents();
      for (var name in this.entries) {
         if (!(this.entries[name].parents) || this.entries[name].parents.length === 0) {
            this.executeEntry(name, delayFactory);
         }
      }
   };

   this.executeEntry = function(name, delayFactory) {
      //console.log("Simulation: Executing entry: " + name);
      var entry = this.entries[name];
      var that = this;

      var onFinish = function() {
         //console.log("Simulation: Finished executing entry: " + name);
         //console.log("My stopping state is: " + that.stopping);
         for (var iChild in entry.children) {
            var childName = entry.children[iChild];
            var childEntry = that.entries[childName];
            childEntry.parentsDone++;

            if (childEntry.parentsDone == childEntry.parents.length && !(that.stopping)) {
               that.executeEntry(childName, delayFactory);
            }
         }
      };

      entry.runner = new SimulationEntryRunner(entry, delayFactory, onFinish);
      entry.runner.execute(this.expediting,this.speedFactor);
   };

   this.stop = function() {
      //console.log("Simulation: stopping");
      this.stopping = true;
      for (var name in this.entries) {
         //console.log("Simulation: stopping " + name);
         var entry = this.entries[name];
         if (entry.runner && entry.runner.executing) {
            entry.runner.stop();
            // console.log("Simulation: " + name + " stopped");
         }
      }
      this.stopping = false;
   };

   this.setExpedite = function(expedite) {
      this.expediting = expedite;
   };

   this.setSpeedFactor = function(val) {
      this.speedFactor = val;
   };
}

function SimulationEntry(name, action, parents, delay) {

}

function SimulationAction(onExec, params, duration, useTimeout) {

}

var _simulationCallbackCounter = 0;

function SimulationEntryRunner(entry, delayFactory, callback) {
   var that = this;
   var _SIMULATION_TIMEOUT_PREFIX = "$simulation$";
   var _SIMULATION_TIMEOUT_DELAY_PREFIX = "$simulation-delay$";
   var _SIMULATION_CALLBACK_DELAY_PREFIX = "$simulation-callback$";
   this.name = entry.name;
   this.onExec = entry.action.onExec;
   this.params = entry.action.params;
   this.action = entry.action;
   this.duration = entry.action.duration;
   this.useTimeout = entry.action.useTimeout;
   this.delay = entry.delay;
   this.callback = callback;

   this.executing = false;

   var _sim = _simulation_timeout_manager[that.name];

   this.execute = function(expedite,speedFactor){
      // console.log(speedFactor)
      this.executing = true;
      var delay = this.delay*speedFactor;
      // console.log(delay)
      var duration = this.duration*speedFactor;
      if(expedite) {
         delay = 0;
         duration = 0;
      }

      var onDelayEnd = function() {
         // console.log("Entry: " + that.name + " delay is finished.");
         if (!(that.executing)) {
            return;
         }

         var onFinish = function() {
            //console.log("Entry: finishing " + that.name);
            that.sensitiveStop(expedite);
         };

         //console.log("Entry: registering animation for " + that.name);
         that.actingObject = that.onExec(that.params, duration, onFinish);
         if (that.useTimeout) {
            if(expedite || duration === 0) {
               onFinish();
            }
            else {
               // console.log("timeout",that.name)
               if(_sim.duration){
                  duration =  _sim.duration;
               }else{
                  _sim.duration = duration;
                  // console.log(duration)
               }
               _sim.startTime = Date.now();
               // console.log("Entry: registering timeout for " + that.name, that.startTime);
               delayFactory.create(_SIMULATION_TIMEOUT_PREFIX + that.name, onFinish, duration);
            }
         }
      };

      if (delay) {
         delayFactory.create(_SIMULATION_TIMEOUT_DELAY_PREFIX + this.name, onDelayEnd, delay);
      } else {
         onDelayEnd();
      }
   };

   this.stop = function() {
      if (!(that.executing)) {
         return;
      }
      that.executing = false;
      delayFactory.destroy(_SIMULATION_TIMEOUT_PREFIX + that.name);
      delayFactory.destroy(_SIMULATION_TIMEOUT_DELAY_PREFIX + that.name);
      delayFactory.destroy(_SIMULATION_CALLBACK_DELAY_PREFIX + that.name);
      if (that.actingObject && that.actingObject.stop) {
         that.actingObject.stop();
      }
      that.actingObject = null;
      if(that.useTimeout){
         _sim.stopTime = Date.now();
         _sim.duration = _sim.duration - (_sim.stopTime - _sim.startTime);
         // console.log("stop",that.name,_sim.duration)
      }
      that.callback();
   };

   /* 
    * Stop this entry, but if expediting is enabled,
    * use a timeout of 0 instead, every 100 times.
    * This prevents stack overflow in long simulations.
    */
   this.sensitiveStop = function(expedite) {
      if(!expedite) {
         this.stop();
         return;
      }

      _simulationCallbackCounter++;
      // console.log(_simulationCallbackCounter);
      if(_simulationCallbackCounter > 100) {
         _simulationCallbackCounter = 0;
         // console.log("stop with delay");
         delayFactory.create(_SIMULATION_CALLBACK_DELAY_PREFIX + this.name, this.stop, 0);
      }
      else {
         // console.log("stop without delay");
         this.stop();
      }
   };
}
