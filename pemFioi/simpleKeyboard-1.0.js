function Keyboard(afterPressCallback) {
   this.boxes = [];
   this.maps = [];
   this.realKeys = {};

   this.registerButton = function (element, keyCode, enableRealKeyboard) {
      var that = this;
      element.click(function() {
         that._keyPress(keyCode);
      });
      if (enableRealKeyboard) {
         this.registerRealKeyboard(keyCode);
      }
   };

   this.simulateKey = function(keyCode) {
      this._keyPress(keyCode);
   };

   this.registerInputBox = function(element, maxLen) {
      this.boxes.push({
         element: element,
         maxLen: maxLen
      });
   };

   this.addMap = function(element, visualKeyRows, enableRealKeyboard) {
      this.maps.push(element);
      var content = "";
      var iRow, iKey, row, keyCode, buttonText;

      for (iRow = 0; iRow < visualKeyRows.length; iRow++) {
         content += "<div class=\"keyboard_row keyboard_row_" + iRow + "\">";
         row = visualKeyRows[iRow];
         for (iKey = 0; iKey < row.length; iKey++) {
            keyCode = this._getCharCode(row[iKey].keyCode);
            buttonText = row[iKey].buttonText;
            if (!buttonText) {
               buttonText = String.fromCharCode(keyCode);
            }
            content += "<input type=\"button\" value=\"" + buttonText + "\" class=\"keyboard_button keyboard_button_" + keyCode + "\" />";
         }
         content += "</div>";
      }

      element.html(content);

      for (iRow = 0; iRow < visualKeyRows.length; iRow++) {
         row = visualKeyRows[iRow];
         for (iKey = 0; iKey < row.length; iKey++) {
            keyCode = this._getCharCode(row[iKey].keyCode);
            this.registerButton($(".keyboard_button_" + keyCode), keyCode, enableRealKeyboard);
         }
      }
   };

   this.registerRealKeyboard = function (keyCode) {
      if ($.isEmptyObject(this.realKeys)) {
         this._listenRealKeyboard();
      }
      this.realKeys[keyCode] = true;
   };

   this._listenRealKeyboard = function () {
      var self = this;
      $(document).bind("keypress.VIRTUAL_KEYBOARD", function (event) {
         if (self.realKeys[event.which]) {
            self._keyPress(event.which);
         }
      });
   };

   this._getCharCode = function(keyCode) {
      if(typeof(keyCode) == "string") {
         return keyCode.charCodeAt(0);
      }
      return keyCode;
   };

   this.remove = function() {
      for (var iMap in this.maps) {
         this.maps[iMap].html("");
      }
      $(document).unbind("keypress.VIRTUAL_KEYBOARD");
   };

   this._keyPress = function(keyCode) {
      for (var iBox in this.boxes) {
         var element = this.boxes[iBox].element;
         var maxLen = this.boxes[iBox].maxLen;
         var content = element.text();

         if (content.length >= maxLen && keyCode != Keyboard.BACKSPACE || content.length === 0 && keyCode == Keyboard.BACKSPACE) {
            continue;
         }

         if (keyCode == Keyboard.BACKSPACE) {
            content = content.substring(0, content.length - 1);
         } else {
            content += String.fromCharCode(keyCode);
         }

         element.text(content);
      }
      if (afterPressCallback) {
         afterPressCallback(keyCode);
      }
   };
}

Keyboard.BACKSPACE = 8;

function VisualKey(keyCode, buttonText) {

}
