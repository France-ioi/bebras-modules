function OutputGenerator() {
   this.events = [];
   this.time = 0;

   this.start = function() {
      this.events = [];
      this.time = 0;
   };

   this.sleep = function(time) {
      this.time += time;
   };

   this.setElementState = function(type,name,state,input) {
      // Note : input means the grading will not check whether the program
      // actually read the sensor
      var event = {
         time: this.time,
         type: type,
         name: name,
         state: state,
         input: !!input
      };
      this.events.push(event);
   };

   this.setElementStateAfter = function(type,name,state,input,time) {
      // Note : input means the grading will not check whether the program
      // actually read the sensor
      var event = {
         time: this.time + time,
         type: type,
         name: name,
         state: state,
         input: !!input
      };
      this.events.push(event);
   };


   this.setBuzzerNote = function(name,frequency) {
      this.setElementState("buzzer", name, frequency);
   };

   this.setElementProperty = function(type,name,property,value) {
      var event = {
         time: this.time,
         type: type,
         name: name
      };
      event[property] = value;
      this.events.push(event);
   };

   this.getEvents = function() {
      return this.events;
   }
};
