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

   this.safeShuffle = function(array) {
      var permutation = this.generateSafePermutation(array.length);
      var backup = $.extend([], array);
      for(var index = 0; index < array.length; index++) {
         array[index] = backup[permutation[index]];
      }
   };

   this.generateSafePermutation = function(numElements) {
      if(numElements <= 1) {
         return [0];
      }
      var permutation = Beav.Array.init(numElements, function(index) {
         return index;
      });
      for(var attempt = 0; attempt < 100; attempt++) {
         this.shuffle(permutation);
         if(countFixedPoints(permutation) < numElements / 2) {
            break;
         }
      }
      return permutation;
   };

   function countFixedPoints(permutation) {
      var result = 0;
      for(var index = 0; index < permutation.length; index++) {
         if(permutation[index] === index) {
            result++;
         }
      }
      return result;
   }

   this.getInitialSeed = function() {
      return this.initialSeed;
   };

   this.reset(initialSeed);
};
