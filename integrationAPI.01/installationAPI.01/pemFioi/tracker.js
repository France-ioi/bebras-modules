var Tracker = {
   trackData: function(data) {
      // Tracking only in a contest (eg: no Bebras JSON)
      if (typeof compiledTask == "undefined") {
         data.teamID = parent.teamID;
         data.questionKey = parent.currentQuestionKey;
         parent.Tracker.trackData(data);
      }
   },

   prepareTrackInputs: function() {
      $('input').keyup(function() {
         Tracker.trackData({dataType:"textinput", inputId: this.id, value: this.value});
      });
   },
           
   endTrackInputs: function() {
      $('input').unbind('keyup');
   },

   trackCheckbox: function(id) {
      var checked = 0;
      if ($("#" + id).is(':checked')) {
         checked = 1;
      }
      this.trackData({dataType:"checkbox", choice: id, checked: checked});
   }
};
