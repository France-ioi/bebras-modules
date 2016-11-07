function RaphaelFactory() {
   this.items = {};
   this.animations = {};
   
   this.create = function(id, elementID, width, height) {
      if(this.items[id] !== null && this.items[id] !== undefined) {
         throw "RaphaelFactory: id " + id + " already exists";
      }
      this.items[id] = new Raphael(elementID, width, height);

      // Offset in mouse events can be affected by the top left element, in firefox 3.6 (and perhaps other browsers).
      // This makes sure there is an element at 0,0.
      this.items[id].rect(0, 0, 1, 1).attr("opacity", 0);

      return this.items[id];
   };
   
   this.get = function(id) {
      return this.items[id];
   };
   
   this.animate = function(name, object, params, time) {
      this.animations[name] = object;
      var self = this;
      object.animate(params, time, function() {
         delete self.animations[name];
      });
   };

   this.stopAnimate = function(name) {
      if (this.animations[name]) {
         this.animations[name].stop();
         delete this.animations[name];
      }
   };

   this.destroy = function(id) {
      this.stop(id);
      this.remove(id);
   };
   
   this.stop = function(id) {
      var paper = this.items[id];
      if(paper !== null && paper !== undefined) {
         paper.remove();
      }
   };
   
   this.remove = function(id) {
      delete this.items[id];
   };
   
   this.destroyAll = function() {
      for(var id in this.items) {
         this.stop(id);
      }
      for(var animID in this.animations) {
         this.stopAnimate(animID);
      }
      this.items = {};
   };
}