function Grid(raphaelID, paper, rows, cols, cellWidth, cellHeight, gridLeft, gridTop, defaultLineAttr) {
   this.raphaelID = raphaelID;
   this.paper = paper;
   this.rows = rows;
   this.cols = cols;
   this.cellWidth = cellWidth;
   this.cellHeight = cellHeight;
   this.gridLeft = gridLeft;
   this.gridTop = gridTop;
   this.defaultLineAttr = defaultLineAttr;

   // TODO: declare this.table here.

   this.element = $("#" + raphaelID);

   this.init = function() {
      this.initCoordinates();
      this.initTable();
      this.initLines();
   };

   this.initCoordinates = function() {
      this.constWidth = $.isNumeric(this.cellWidth);
      this.constHeight = $.isNumeric(this.cellHeight);

      this.rowY = [this.gridTop];
      for(var row = 1; row < this.rows; row++) {
         if(this.constHeight) {
            this.rowY.push(this.rowY[row - 1] + this.cellHeight);
         }
         else {
            this.rowY.push(this.rowY[row - 1] + this.cellHeight[row - 1]);
         }
      }
      if(this.constHeight) {
         this.gridBottom = this.rowY[this.rows - 1] + this.cellHeight;
      }
      else {
         this.gridBottom = this.rowY[this.rows - 1] + this.cellHeight[this.rows - 1];
      }

      this.colX = [this.gridLeft];
      for(var col = 1; col < this.cols; col++) {
         if(this.constWidth) {
            this.colX.push(this.colX[col - 1] + this.cellWidth);
         }
         else {
            this.colX.push(this.colX[col - 1] + this.cellWidth[col - 1]);
         }
      }
      if(this.constWidth) {
         this.gridRight = this.colX[this.cols - 1] + this.cellWidth;
      }
      else {
         this.gridRight = this.colX[this.cols - 1] + this.cellWidth[this.cols - 1];
      }
   };

   this.initTable = function() {
      this.table = [];
      for (var iRow = 0; iRow < this.rows; iRow++) {
         this.table.push([]);
         for (var iCol = 0; iCol < this.cols; iCol++) {
            this.table[iRow].push([]);
         }
      }
   };

   this.initLines = function() {
      var line;
      this.horizontalLines = [];
      for (var iRow = 0; iRow <= this.rows; iRow++) {
         var rowY;
         if(iRow < this.rows) {
            rowY = this.rowY[iRow];
         }
         else {
            rowY = this.gridBottom;
         }
         line = this.paper.path(["M", this.gridLeft, rowY, "H", this.gridRight]);
         line.attr(this.defaultLineAttr);
         this.horizontalLines.push(line);
      }

      this.verticalLines = [];
      for (var iCol = 0; iCol <= this.cols; iCol++) {
         var colX;
         if(iCol < this.cols) {
            colX = this.colX[iCol];
         }
         else {
            colX = this.gridRight;
         }
         line = this.paper.path(["M", colX, this.gridTop, "V", this.gridBottom]);
         line.attr(this.defaultLineAttr);
         this.verticalLines.push(line);
      }
   };

   this.clickCell = function(clickHandler) {
      this.clickHandler = clickHandler;
      this.element.click({
         thisGrid: this
      }, internalClickHandler);
   };

   var internalClickHandler = function(event) {
      var that = event.data.thisGrid;
      var paperPosition = that.getPaperMouse(event);
      
      if(!that.isPaperPosOnGrid(paperPosition)) {
         return;
      }

      var gridPos = that.paperPosToGridPos(paperPosition);
      event.data.row = gridPos.row;
      event.data.col = gridPos.col;
      event.data.cell = that.table[gridPos.row][gridPos.col];
      that.clickHandler(event);
   };

   this.getPaperMouse = function(event) {
      var offset = $(this.paper.canvas).offset();
      return {
         left: event.pageX - offset.left,
         top: event.pageY - offset.top
      };
   };

   var getIEVersion = function() {
      var myNav = navigator.userAgent.toLowerCase();
      return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
   };

   this.getCell = function(row, col) {
      return this.table[row][col];
   };

   this.getCellSize = function(row, col) {
      var result = {};
      if(this.constWidth) {
         result.width = this.cellWidth;
      }
      else {
         result.width = this.cellWidth[col];
      }
      if(this.constHeight) {
         result.height = this.cellHeight;
      }
      else {
         result.height = this.cellHeight[row];
      }
      return result;
   };

   this.getCellPos = function(row, col) {
      var result = {};
      if(row < 0) {
         result.y = this.gridTop;
      }
      else if(row >= this.rows) {
         result.y = this.gridBottom;
      }
      else {
         result.y = this.rowY[row];
      }
      if(col < 0) {
         result.x = this.gridLeft;
      }
      else if(col >= this.cols) {
         result.x = this.gridRight;
      }
      else {
         result.x = this.colX[col];
      }
      return result;
   };

   this.isPaperPosOnGrid = function(paperPosition) {
      if (paperPosition.left < this.gridLeft || paperPosition.left >= this.gridRight) {
         return false;
      }
      if (paperPosition.top < this.gridTop || paperPosition.top >= this.gridBottom) {
         return false;
      }
      return true;
   };
   
   this.paperPosToGridPos = function(paperPosition) {
      var result = {};
      if(this.constWidth) {
         result.col = Math.floor((paperPosition.left - this.gridLeft) / this.cellWidth);
      }
      else {
         result.col = this._binarySearchPos(this.colX, paperPosition.left, this.gridLeft, this.gridRight);
      }
      if(this.constHeight) {
         result.row = Math.floor((paperPosition.top - this.gridTop) / this.cellHeight);
      }
      else {
         result.row = this._binarySearchPos(this.rowY, paperPosition.top, this.gridTop, this.gridBottom);
      }
      return result;
   };

   this._binarySearchPos = function(array, value, min, max) {
      if(value < min) {
         return -1;
      }
      if(value >= max) {
         return array.length;
      }
      var low = 0, high = array.length;
      while(low < high - 1) {
         var mid = Math.floor((low + high) / 2);
         if(value < array[mid]) {
            high = mid;
         }
         else if(value == array[mid]) {
            return mid;
         }
         else {
            low = mid;
         }
      }
      return low;
   };

   this.getCellCenter = function(row, col) {
      var pos = this.getCellPos(row, col);
      if(this.constWidth) {
         pos.x += this.cellWidth / 2;
      }
      else {
         pos.x += this.cellWidth[col] / 2;
      }
      if(this.constHeight) {
         pos.y += this.cellHeight / 2;
      }
      else {
         pos.y += this.cellHeight[row] / 2;
      }
      return pos;
   };

   this.addToCell = function(cellFiller, data) {
      // TODO: xPos and yPos should be renamed cellX and cellY
      var row = data.row;
      var col = data.col;
      var pos = this.getCellPos(row, col);
      data.xPos = pos.x;
      data.yPos = pos.y;
      
      if(this.constWidth) {
         data.cellWidth = this.cellWidth;
      }
      else {
         data.cellWidth = this.cellWidth[col];
      }
      if(this.constHeight) {
         data.cellHeight = this.cellHeight;
      }
      else {
         data.cellHeight = this.cellHeight[row];
      }
      var contents = cellFiller(data, this.paper);

      if (!contents) {
         return;
      }

      var cell = this.table[row][col];
      for (var iContent = 0; iContent < contents.length; iContent++) {
         cell.push(contents[iContent]);
      }
   };

   this.setCell = function(cellFiller, data) {
      this.clearCell(data.row, data.col);
      this.addToCell(cellFiller, data);
   };

   this.popFromCell = function(row, col) {
      var cell = this.table[row][col];
      if(!cell || cell.length === 0) {
         return;
      }
      var element = cell.pop();
      if(element) {
         element.remove();
      }
   };

   this.clearCell = function(row, col) {
      var cell = this.table[row][col];
      for (var iContent = 0; iContent < cell.length; iContent++) {
         cell[iContent].remove();
      }
      this.table[row][col] = [];
   };

   this.getPaper = function() {
      return this.paper;
   };
   
   this.enableDragSelection = function(onStart, onMove, onUp, onSelectionChange, selectionBoxAttr, selectionMargins) {
      var self = this;
      var anchorGridPos;
      var anchorPaperPos;
      var currentPaperPos;
      var currentGridPos;
      function dragStart(x, y, event) {
         // Dirty IE6 workaround to get the pageX,pageY properties.
         // They appear to be missing from the original mouse event.
         if(event.pageX === undefined) {
            event.pageX = x;
            event.pageY = y;
         }
         anchorPaperPos = self.getPaperMouse(event);
         currentPaperPos = self.getPaperMouse(event);
         anchorGridPos = self.paperPosToGridPos(anchorPaperPos);
         currentGridPos = self.paperPosToGridPos(anchorPaperPos);
         this.dragSelection = paper.rect().attr(selectionBoxAttr);
         if(onStart) {
            onStart(x, y, event, anchorPaperPos, anchorGridPos);
         }
         if(onSelectionChange) {
            onSelectionChange(0, 0, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
         }
      }
      function dragEnd(event) {
         this.dragSelection.remove();
         if(onUp) {
            onUp(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
         }
      }
      function dragMove(dx, dy, x, y, event) {
         currentPaperPos.left = anchorPaperPos.left + dx;
         currentPaperPos.top = anchorPaperPos.top + dy;

         var newGridPos = self.paperPosToGridPos(currentPaperPos);
         this.dragSelection.attr({
            x: Math.min(anchorPaperPos.left, currentPaperPos.left),
            y: Math.min(anchorPaperPos.top, currentPaperPos.top),
            width: Math.abs(anchorPaperPos.left - currentPaperPos.left),
            height: Math.abs(anchorPaperPos.top - currentPaperPos.top)
         });
         if(onMove) {
            onMove(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
         }
         if(onSelectionChange && newGridPos) {
            if(newGridPos.col != currentGridPos.col || newGridPos.row != currentGridPos.row) {
               onSelectionChange(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, newGridPos);
            }
         }
         if(newGridPos) {
            currentGridPos = newGridPos;
         }
      }
      
      var left = this.gridLeft - selectionMargins.left;
      var width = this.gridRight - this.gridLeft + selectionMargins.left + selectionMargins.right;
      var top = this.gridTop - selectionMargins.top;
      var height = this.gridBottom - this.gridTop + selectionMargins.top + selectionMargins.bottom;
      
      this.overlay = this.paper.rect(left, top, width, height).attr({
         fill: "green",
         opacity: 0
      });
      this.overlay.drag(dragMove, dragStart, dragEnd);
   };

   this.remove = function() {
      var iRow, iCol;
      for (iRow = 0; iRow < this.rows; iRow++) {
         for (iCol = 0; iCol < this.cols; iCol++) {
            this.clearCell(iRow, iCol);
         }
      }

      for (iRow = 0; iRow <= this.rows; iRow++) {
         this.horizontalLines[iRow].remove();
      }

      for (iCol = 0; iCol <= this.cols; iCol++) {
         this.verticalLines[iCol].remove();
      }

      if(this.overlay) {
         this.overlay.remove();
      }
      
      this.element.unbind("click", internalClickHandler);
   };

   this.init();
}

Grid.fromArray = function(raphaelID, paper, array, cellFiller, cellWidth, cellHeight, gridLeft, gridTop, defaultLineAttr) {
   var rows = array.length;
   var cols = array[0].length;
   var grid = new Grid(raphaelID, paper, rows, cols, cellWidth, cellHeight, gridLeft, gridTop, defaultLineAttr);

   for (var iRow = 0; iRow < rows; iRow++) {
      for (var iCol = 0; iCol < cols; iCol++) {
         grid.addToCell(cellFiller, {
            row: iRow,
            col: iCol,
            entry: array[iRow][iCol]
         });
      }
   }

   return grid;
};
