function RaphaelFactory() {
   this.items = {};

   // animations contains the actual animations, indexed with semi-random IDs
   // animationNames contains the mapping between the "public" animation names
   // and those IDs
   // This is done so that we don't lose animation pointers if a name is
   // reused, and can still destroy them through destroyAll
   this.animations = {};
   this.animationNames = {};

   this.debug = false;
   
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

   this.getAnimation = function(name) {
      if(this.animationNames[name]) {
         return this.animations[this.animationNames[name]];
      }
   };

   this.animate = function(name, object, params, time) {
      if(this.debug && this.animationNames[name] && this.animations[this.animationNames[name]]) {
         console.log("RaphaelFactory: animation " + name + " already exists");
      }
      var animName = '' + name + Math.random();
      this.animations[animName] = object;
      this.animationNames[name] = animName;
      var self = this;
      object.animate(params, time, function() {
         delete self.animations[animName];
      });
   };

   this.pauseAnimate = function(name) {
      var anim = this.getAnimation(name);
      if (anim) {
         anim.pause();
      }
   };

    this.resumeAnimate = function(name) {
      var anim = this.getAnimation(name);
      if (anim) {
         anim.resume();
      }
   };
   
   this.stopAnimate = function(name) {
      if(this.animationNames[name]) {
         this.stopAnimateID(this.animationNames[name]);
      }
   };

   this.stopAnimateID = function(animID) {
      if (this.animations[animID]) {
         this.animations[animID].stop();
         delete this.animations[animID];
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
         this.stopAnimateID(animID);
      }
      this.items = {};
   };
}
