function Simulation() {
   this.stepIndex = 0;
   this.steps = [];
   this.autoPlaying = false;
   this.playing = false;
   this.stopping = false;

   this.addStep = function(step) {
      var that = this;

      step.addEntryAllParents({
         name: "simulation$$$",
         action: {
            onExec: function(duration, params, callback) {
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
      this.playing = true;
      this.steps[this.stepIndex].setExpedite(this.expediting);
      this.steps[this.stepIndex].execute();
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
      this.steps[this.stepIndex].setExpedite(true);
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

   this.execute = function() {
      this.resetParents();
      for (var name in this.entries) {
         if (!(this.entries[name].parents)) {
            this.executeEntry(name);
         }
      }
   };

   this.executeEntry = function(name) {
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
               that.executeEntry(childName);
            }
         }
      };

      entry.runner = new SimulationEntryRunner(entry, onFinish);
      entry.runner.execute(this.expediting);
   };

   this.stop = function() {
      //console.log("Simulation: stopping");
      this.stopping = true;
      for (var name in this.entries) {
         //console.log("Simulation: stopping " + name);
         var entry = this.entries[name];
         if (entry.runner && entry.runner.executing) {
            entry.runner.stop();
            //console.log("Simulation: " + name + " stopped");
         }
      }
      this.stopping = false;
   };

   this.setExpedite = function(expedite) {
      this.expediting = expedite;
   };
}

function SimulationEntry(name, action, parents, delay) {

}

function SimulationAction(onExec, params, duration, useTimeout) {

}

function SimulationEntryRunner(entry, callback) {

   this.name = entry.name;
   this.onExec = entry.action.onExec;
   this.params = entry.action.params;
   this.action = entry.action;
   this.duration = entry.action.duration;
   this.useTimeout = entry.action.useTimeout;
   this.delay = entry.delay;
   this.callback = callback;

   this.executing = false;

   this.execute = function(expedite){
      this.executing = true;
      var that = this;
      var delay = this.delay;
      var duration = this.duration;
      if(expedite) {
         delay = 0;
         duration = 0;
      }

      var onDelayEnd = function() {
         //console.log("Entry: " + that.name + " delay is finished.");
         if (!(that.executing)) {
            return;
         }

         var onFinish = function() {
            //console.log("Entry: finishing " + that.name);
            that.stop();
         };

         if (that.useTimeout) {
            //console.log("Entry: registering timeout for " + that.name);
            that.actingObject = that.onExec(that.params, onFinish);

            if(!expedite) {
               DelayedExec.setTimeout(that.name, onFinish, duration);
            }
         } else {
            //console.log("Entry: registering animation for " + that.name);
            that.actingObject = that.onExec(that.params, duration, onFinish);
         }
      };

      if (delay) {
         DelayedExec.setTimeout(this.name + "$$$delay", onDelayEnd, delay);
      } else {
         onDelayEnd();
      }
   };

   this.stop = function() {
      if (!(this.executing)) {
         return;
      }
      this.executing = false;
      DelayedExec.clearTimeout(this.name);
      DelayedExec.clearTimeout(this.name + "$$$delay");
      if (this.actingObject && this.actingObject.stop) {
         this.actingObject.stop();
      }
      this.actingObject = null;
      this.callback();
   };
}
