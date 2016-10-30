var RandomGenerator = function(initialSeed) {

   this.reset = function(seed) {
      this.initialSeed = seed;
      this.counter = (seed % 1000003 + 1) * 4751;
   };

   this.nextReal = function() {
      var number = Math.sin(this.counter) * 10000;
      this.counter++;
      return number - Math.floor(number);
   };

   this.nextInt = function(min, max) {
      return Math.floor(this.nextReal() * (max - min + 1)) + min;
   };

   this.nextBit = function() {
      return this.nextInt(0, 1);
   };

   this.shuffle = function(array) {
      Beav.Array.shuffle(array, this.nextInt(0, 100000));
   };

   this.getInitialSeed = function() {
      return this.initialSeed;
   };

   this.reset(initialSeed);
};
