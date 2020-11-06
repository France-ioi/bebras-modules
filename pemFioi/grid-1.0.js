function Grid(raphaelID, paper, rows, cols, cellWidth, cellHeight, gridLeft, gridTop, defaultLineAttr) {
   var self = this;
   this.raphaelID = raphaelID;
   this.paper = paper;
   this.rows = rows;
   this.cols = cols;
   this.cellWidth = cellWidth;
   this.cellHeight = cellHeight;
   this.gridLeft = gridLeft;
   this.gridTop = gridTop;
   this.defaultLineAttr = defaultLineAttr;
   this.cellHighlights = {};

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

      this.gridWidth = this.gridRight - this.gridLeft;
      this.gridHeight = this.gridBottom - this.gridTop;
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
      this.unclickCell();
      this.clickHandler = clickHandler;
      this.element.click({
         thisGrid: this
      }, internalClickHandler);
   };

   this.unclickCell = function() {
      this.element.unbind("click", internalClickHandler);
      this.element.off("click");
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

      if(!that.table[gridPos.row]) {
         throw "Grid bad cell. Row=" + gridPos.row + " Col=" + gridPos.col;
      }

      event.data.cell = that.table[gridPos.row][gridPos.col];
      that.clickHandler(event);
   };

   this.getPaperMouse = function(event) {
      var offset = $(self.paper.canvas).offset();
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

      if(this.overlay) {
         this.overlay.toFront();
      }
   };

   this.setAllCells = function(cellFiller, data) {
      if(!data) {
         data = {};
      }
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            data.row = row;
            data.col = col;
            this.setCell(cellFiller, data);
         }
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

   this.highlightCell = function(row, col, attr, xPad, yPad) {
      var cellPos = this.getCellPos(row, col);
      var cellSize = this.getCellSize(row, col);

      if(attr === null || attr === undefined) {
         attr = {};
      }
      if(attr["stroke-width"] === null || attr["stroke-width"] === undefined) {
         attr["stroke-width"] = 3;
      }
      if(attr.stroke === null || attr.stroke === undefined) {
         attr.stroke = "red";
      }
      if(xPad === null || xPad === undefined) {
         xPad = attr["stroke-width"] / 2;
         if(this.verticalLines[col].attrs["stroke-width"] !== undefined) {
            xPad += this.verticalLines[col].attrs["stroke-width"] / 2;
         }
         else {
            xPad += 0.5;
         }
      }
      if(yPad === null || yPad === undefined) {
         yPad = attr["stroke-width"] / 2;
         if(this.horizontalLines[row].attrs["stroke-width"] !== undefined) {
            yPad += this.horizontalLines[row].attrs["stroke-width"] / 2;
         }
         else {
            yPad += 0.5;
         }
      }
      if(attr.width === null || attr.width === undefined) {
         attr.width = cellSize.width - 2 * xPad;
      }
      if(attr.height === null || attr.height === undefined) {
         attr.height = cellSize.height - 2 * yPad;
      }

      var id = this._cellToHighlightID(row, col);
      if(this.cellHighlights[id]) {
         attr.x = cellPos.x + xPad;
         attr.y = cellPos.y + yPad;
         this.cellHighlights[id].attr(attr);
         this.cellHighlights[id].show();
      } else {
         this.cellHighlights[id] = paper.rect(cellPos.x + xPad, cellPos.y + yPad).attr(attr);
      }
   };

   this.unhighlightCell = function(row, col) {
      var id = this._cellToHighlightID(row, col);
      if(this.cellHighlights[id]) {
         this.cellHighlights[id].hide();
      }
   };

   this.getCellHighlight = function(row, col) {
      var id = this._cellToHighlightID(row, col);
      return this.cellHighlights[id];
   };

   this.isCellHighlighted = function(row, col) {
      var id = this._cellToHighlightID(row, col);
      return !!this.cellHighlights[id];
   };

   this.unhighlightAllCells = function() {
      for(var iRow = 0; iRow < this.rows; iRow++){
         for(var iCol = 0; iCol < this.cols; iCol++){
            if(this.isCellHighlighted(iRow,iCol)){
               this.unhighlightCell(iRow,iCol);
            }
         }
      }
   };

   this._cellToHighlightID = function(row, col) {
      return row + "," + col;
   };
   
   this.enableDragSelection = function(onStart, onMove, onUp, onSelectionChange, selectionBoxAttr, selectionMargins, dragThreshold) {
      if(this.overlay) {
         return;
      }
      var self = this;
      var anchorGridPos;
      var anchorPaperPos;
      var currentPaperPos;
      var currentGridPos;
      var usingThreshold = (dragThreshold !== null && dragThreshold !== undefined);

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
         self.dragSelection = paper.rect().attr(selectionBoxAttr);
         if(onStart) {
            onStart(x, y, event, anchorPaperPos, anchorGridPos);
         }
         if(usingThreshold) {
            currentGridPos = null;
         }
         else {
            currentGridPos = self.paperPosToGridPos(anchorPaperPos);
         }
         if(onSelectionChange) {
            onSelectionChange(0, 0, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
         }
      }
      function dragEnd(event) {
         if (self.dragSelection != null) {
            self.dragSelection.remove();
         }
         self.dragSelection = null;
         if(onUp) {
            onUp(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
         }
      }
      function dragMove(dx, dy, x, y, event) {
         currentPaperPos.left = anchorPaperPos.left + dx;
         currentPaperPos.top = anchorPaperPos.top + dy;

         var oldGridPos = currentGridPos;
         var newGridPos = self.paperPosToGridPos(currentPaperPos);
         self.dragSelection.attr({
            x: Math.min(anchorPaperPos.left, currentPaperPos.left),
            y: Math.min(anchorPaperPos.top, currentPaperPos.top),
            width: Math.abs(anchorPaperPos.left - currentPaperPos.left),
            height: Math.abs(anchorPaperPos.top - currentPaperPos.top)
         });

         // Below threshold.
         if(usingThreshold && getVectorLength(dx, dy) < dragThreshold) {
            currentGridPos = null;
            if(onMove) {
               onMove(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
            }
            if(oldGridPos != null) {
               onSelectionChange(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
            }
         }
         else {
            currentGridPos = newGridPos;
            if(onMove) {
               onMove(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
            }
            if(oldGridPos == null || oldGridPos.row !== currentGridPos.row || oldGridPos.col !== currentGridPos.col) {
               onSelectionChange(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos);
            }
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

   this.disableDragSelection = function() {
      if(this.overlay) {
         this.overlay.undrag();
         this.overlay.remove();
         this.overlay = null;
      }
      if(this.dragSelection) {
         this.dragSelection.remove();
         this.dragSelection = null;
      }
   };

   this.linesToBack = function() {
      for (var iRow = 0; iRow <= this.rows; iRow++) {
         this.horizontalLines[iRow].toBack();
      }
      for (var iCol = 0; iCol <= this.cols; iCol++) {
         this.verticalLines[iCol].toBack();
      }
   };
   this.linesToFront = function() {
      for (var iRow = 0; iRow <= this.rows; iRow++) {
         this.horizontalLines[iRow].toFront();
      }
      for (var iCol = 0; iCol <= this.cols; iCol++) {
         this.verticalLines[iCol].toFront();
      }
   };

   this.getLeftX = function() {
      return this.gridLeft;
   };

   this.getRightX = function() {
      return this.gridRight;
   };

   this.getTopY = function() {
      return this.gridTop;
   };

   this.getBottomY = function() {
      return this.gridBottom;
   };

   this.getWidth = function() {
      return this.gridWidth;
   };

   this.getHeight = function() {
      return this.gridHeight;
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

      for(var iCell in this.cellHighlights) {
         this.cellHighlights[iCell].remove();
      }

      this.disableDragSelection();
      this.unclickCell();
   };

   this.getRaphaelSet = function() {
      var set = this.paper.set();
      var iRow, iCol;
      for (iRow = 0; iRow < this.rows; iRow++) {
         for (iCol = 0; iCol < this.cols; iCol++) {
            var cell = this.table[iRow][iCol];
            for (var iContent = 0; iContent < cell.length; iContent++) {
               set.push(cell[iContent]);
            }
         }
      }
      for (iRow = 0; iRow <= this.rows; iRow++) {
         set.push(this.horizontalLines[iRow]);
      }
      for (iCol = 0; iCol <= this.cols; iCol++) {
         set.push(this.verticalLines[iCol].show());
      }
      for(var iCell in this.cellHighlights) {
         set.push(this.cellHighlights[iCell].show());
      }
      return set
   };

   this.display = function(show) {
      var raph = this.getRaphaelSet();
      if(show){
         raph.show();
      }else{
         raph.hide();
      }
   };

   this.hide = function() {
      this.display(0);
   };
   this.show = function() {
      this.display(1);
   };

   function getVectorLength(x, y) {
      return Math.sqrt(x * x + y * y);
   }

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
