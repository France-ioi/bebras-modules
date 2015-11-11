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
   this.gridRight = cellWidth * cols + gridLeft;
   this.gridBottom = cellHeight * rows + gridTop;

   this.init = function() {
      this.initTable();
      this.initLines();
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
      this.paperRows = [];
      for (var iRow = 0; iRow <= this.rows; iRow++) {
         var rowY = this.gridTop + iRow * this.cellHeight;
         line = this.paper.path(["M", this.gridLeft, rowY, "L", this.gridRight, rowY]);
         line.attr(this.defaultLineAttr);
         this.paperRows.push(line);
      }

      this.paperCols = [];
      for (var iCol = 0; iCol <= this.cols; iCol++) {
         var colX = this.gridLeft + iCol * this.cellWidth;
         line = this.paper.path(["M", colX, this.gridTop, "L", colX, this.gridBottom]);
         line.attr(this.defaultLineAttr);
         this.paperCols.push(line);
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
      var paperX = paperPosition.left;
      var paperY = paperPosition.top;

      if (paperX < that.gridLeft || paperX >= that.gridRight) {
         return;
      }
      if (paperY < that.gridTop || paperY >= that.gridBottom) {
         return;
      }
      var row = Math.floor((paperY - that.gridTop) / that.cellHeight);
      var col = Math.floor((paperX - that.gridLeft) / that.cellWidth);

      event.data.row = row;
      event.data.col = col;
      event.data.cell = that.table[row][col];
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

   this.getCellSize = function() {
      return {
         width: this.cellWidth,
         height: this.cellHeight };
   };

   this.getCellPos = function(row, col) {
      return {
         x: this.gridLeft + col * cellWidth,
         y: this.gridTop + row * cellHeight };
   };

   this.getCellCenter = function(row, col) {
      var pos = this.getCellPos(row, col);
      return {
         x: pos.x + this.cellWidth/2,
         y: pos.y + this.cellHeight/2 };
   };

   this.addToCell = function(cellFiller, data) {
      // TODO: xPos and yPos should be renamed cellX and cellY
      var row = data.row;
      var col = data.col;
      data.xPos = this.gridLeft + col * cellWidth;
      data.yPos = this.gridTop + row * cellHeight;
      data.cellWidth = this.cellWidth;
      data.cellHeight = this.cellHeight;
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

   this.remove = function() {
      var iRow, iCol;
      for (iRow = 0; iRow < this.rows; iRow++) {
         for (iCol = 0; iCol < this.cols; iCol++) {
            this.clearCell(iRow, iCol);
         }
      }

      for (iRow = 0; iRow <= this.rows; iRow++) {
         this.paperRows[iRow].remove();
      }

      for (iCol = 0; iCol <= this.cols; iCol++) {
         this.paperCols[iCol].remove();
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
