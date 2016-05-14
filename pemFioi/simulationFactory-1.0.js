function SimulationFactory(delayFactory) {
   this.items = {};
   
   this.create = function(id) {
      if(this.items[id] !== null && this.items[id] !== undefined) {
         throw "SimulationFactory: id " + id + " already exists";
      }
      this.items[id] = new Simulation(id, delayFactory);
      return this.items[id];
   };
   
   this.get = function(id) {
      return this.items[id];
   };
   
   this.destroy = function(id) {
      this.stop(id);
      this.remove(id);
   };
   
   this.stop = function(id) {
      var simulation = this.items[id];
      if(simulation !== null && simulation !== undefined) {
         simulation.stop();
      }
   };
   
   this.remove = function(id) {
      delete this.items[id];
   };
   
   this.destroyAll = function() {
      for(var id in this.items) {
         this.stop(id);
      }
      this.items = {};
   };
}