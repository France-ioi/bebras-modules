///Component
function _component(cx, cy, arrayElems, paper)
{
   var that = this;

   this.cx = cx;
   this.cy = cy;
   this.elems = arrayElems;
   this.paper = paper;

   this.nbEl = this.elems.length;

   for (var iEl = 0; iEl < this.nbEl; iEl++)
   {
      if (this.elems[iEl].type == 'text')
      {
         var bb = this.elems[iEl].getBBox();
         this.elems.push(paper.rect(bb.x,bb.y,bb.width,bb.height).attr('fill','red').attr('opacity',0));//.attr('fill-opacity',0));
      }
   }

   this.oldTransforms = new Array();
   for (var i = 0; i < this.elems.length; i++)
   {
      this.elems[i].toFront();
      this.oldTransforms[i] = this.elems[i].transform();
      this.elems[i].transform('t' + this.cx + ',' + this.cy + this.oldTransforms[i]);
   }

   this.placeAt = function(cx,cy)
   {
      this.cx = cx;
      this.cy = cy;

      for (var i = 0; i < this.elems.length; i++)
         this.elems[i].transform('t' + this.cx + ',' + this.cy + this.oldTransforms[i]);
      return this;
   };

   var animation = function(i, time) 
   {
      return Raphael.animation({'transform' : 't' + that.cx + ',' + that.cy + that.oldTransforms[i]}, time, '');
   };

   this.placeAtWithAnim = function(cx,cy,time)
   {
      this.cx = cx;
      this.cy = cy;

      for (var i = 0; i < this.elems.length; i++)
         this.elems[i].animate(animation(i,time));
      return this;      
   };

   this.move = function(dx,dy) { this.placeAt(this.cx+dx,this.cy+dy); };
   this.moveWithAnim = function(dx,dy,time) { this.placeAt(this.cx+dx,this.cy+dy,time); };

   this.drag = function(moveDrag, startDrag, upDrag)
   {
      that.hasReallyMoved = false;
      this.startDrag = startDrag;
      this.moveDrag = moveDrag;
      this.upDrag = upDrag;

      for (var i = 0; i < this.elems.length; i++)
         this.elems[i].drag(function(dx,dy){that.moveDrag(dx,dy);}, 
                            function(){that.startDrag();}, 
                            function(){that.upDrag();});
      return this;
   };

   this.clone = function()
   {
      var newArr = new Array();
      for (var i = 0; i < this.nbEl; i++) 
      {
         newArr[i] = this.elems[i].clone().attr('transform',this.oldTransforms[i]);
      }
      return new _component(this.cx,this.cy,newArr,this.paper);   
   };

   this.remove = function()
   {
      for (var i = 0; i < this.elems.length; i++)  
         this.elems[i].remove();    
   };

   this.toFront = function()
   {
      for (var i = 0; i < this.elems.length; i++)
         this.elems[i].toFront();
      
   };
   
   this.show = function()
   {
      for (var i =0; i < this.nbEl; i++)  
         if (!this.elems[i].attr('transparent')) {
            this.elems[i].attr('opacity','1');
         }
   };

   this.hide = function()
   {
      for (var i = 0; i < this.nbEl; i++) 
         this.elems[i].attr('opacity','0');  
   };

   this.halfHide = function()
   {
      for (var i = 0; i < this.nbEl; i++) 
         if (!this.elems[i].attr('transparent')) {
            this.elems[i].attr('opacity','0.3');
         }
   };
}

function component(cx, cy, arrayElems,paper){ return new _component(cx, cy, arrayElems,paper); }






///Container

function _container(dragAndDropSystem,ident,cx, cy, nbPlaces, widthPlace, heightPlace, direction, align, dropMode, dragDisplayMode,
                   placeBackgroundArray, type, sourceElemArray)
{
   this.dragAndDropSystem = dragAndDropSystem;
   this.ident = ident;
   this.cx = cx;
   this.cy = cy;
   this.nbPlaces = nbPlaces;
   this.widthPlace = widthPlace;
   this.heightPlace = heightPlace;
   this.direction = direction;
   this.align = align;
   this.dropMode = dropMode;
   this.dragDisplayMode = dragDisplayMode;
   this.type = type;

   this.placeHolder = component(0,0,
      [dragAndDropSystem.paper.rect(-widthPlace/2,-heightPlace/2,widthPlace,heightPlace)
         .attr({'stroke' : 'yellow', 'stroke-width' : '2', 'stroke-dasharray': '-'})], this.dragAndDropSystem.paper);
   this.placeHolder.hide();
   
   this.sourceElemArray = sourceElemArray;

//sanityCheck
   this.sanityCheck = function()
   {
      if (direction != 'vertical' && direction != 'horizontal')
         alert('direction should be \'vertical\' or \'horizontal\'!');

      if (direction == 'vertical')
         if (align != 'top' && align != 'bottom')
            alert('Since direction is vertical, align should be \'top\' or \'bottom\'');
      if (direction == 'horizontal')
         if (align != 'left' && align != 'right')
            alert('Since direction is horizontal, align should be \'left\' or \'right\'');

      if (dropMode != 'replace' && dropMode != 'insert-replace' && dropMode != 'insert' && dropMode != 'insertBefore')
         alert('dropMode should be \'replace\' or \'insert\' or \'insert-replace\' or \'insertBefore\'');

      if (dragDisplayMode != 'preview' && dragDisplayMode != 'marker')
         alert('dragDisplayMode should be \'preview\' or \'marker\' ');

      if (type != 'list' && type != 'source')
         alert('type should be \'list\' or \'source\'');
   };
   this.sanityCheck();

//utils
   
   this.placeCenter = function(iPlace)
   {
      var w = this.widthPlace, h = this.heightPlace;
      if (direction == 'horizontal')
         if (align == 'left')
            return [this.cx + ((2*iPlace + 1 - this.nbPlaces)*w)/2, this.cy];
         else
            return [this.cx + ((this.nbPlaces - 2*iPlace - 1)*w)/2, this.cy];
      else
         if (align == 'top')
            return [this.cx, this.cy + ((2*iPlace + 1 - this.nbPlaces)*h)/2];
         else
            return [this.cx, this.cy + ((this.nbPlaces - 2*iPlace - 1)*h)/2]; 
   };

   this.placeId = function(x,y) // return -1 if not contained in a place
   {
      for (var iPlace = 0; iPlace < this.nbPlaces; iPlace++)
      {
         var c = this.placeCenter(iPlace);
         var w = this.widthPlace, h = this.heightPlace;
         if (x>=c[0]-w/2 && x<=c[0]+w/2 && y>=c[1]-h/2 && y<=c[1]+h/2) 
            return iPlace;
      }
      return -1;
   };

   this.isInContainer = function(x,y){return this.placeId(x,y) != -1;};

   // If the point (x,y) is in place i, return a real number between 0 and 1
   // to give its relative position in the place. For example, a value of 
   // 0.1 means that the point is near from the common border of places i and i-1,
   // and a value of 0.5 indicates a position in the middle of the place i. 
   this.ratioPositionInPlace = function(x,y) 
   {
      var c0 = this.placeCenter(0), c1 = this.placeCenter(1);
      var c0p = [x - c0[0], y - c0[1]];
      var c0c1 = [c1[0] - c0[0], c1[1] - c0[1]];
      var prodScal = c0p[0]*c0c1[0] + c0p[1]*c0c1[1];
      var posAbs = parseFloat(prodScal) / parseFloat(c0c1[0]*c0c1[0] + c0c1[1]*c0c1[1]) + 0.5;     
      return posAbs - this.placeId(x,y);     
   };

   this.getCorrespondingAction = function(el,x,y)
   {
      var pos = this.placeId(x,y);
      var ratio = this.ratioPositionInPlace(x,y);
      if (pos == -1)
         return null;

      if (this.dropMode == 'replace')
         return action(this, pos,'replace'); 
         
      if (this.dropMode == 'insert-replace')
      {
         if (ratio < 0.25)
            return action(this, pos, 'insert');          
         if (ratio > 0.75 && pos+1 < this.nbPlaces)
            return action(this, pos+1, 'insert');
         return action(this,pos,'replace');
      }
   
      if (this.dropMode == 'insert')
      {
         if (ratio < 0.25)
            return action(this, pos, 'insert');          
         if (ratio > 0.75 && pos+1 < this.nbPlaces)
            return action(this, pos+1, 'insert');
         return null;
      }

      if (this.dropMode == 'insertBefore')
      {
         if (ratio < 0.75)
            return action(this, pos, 'insert');          
         else if (ratio > 0.75 && pos+1 < this.nbPlaces)
            return action(this, pos+1, 'insert');
         else
            return null;
      }

      alert('dropMode ?');
   };

   this.getElementsAfterDrop = function(srcCont, srcPos, dstCont, dstPos, dropType)
   {
      var res = new Array();
      for (var i = 0; i < this.nbPlaces; i++)
         res[i] = this.draggableElements[i];
      res[this.nbPlaces] = null;
      
      //removal
      if (this == srcCont)
      {
         if (this.dropMode == 'replace')
            res[srcPos] = null;
         else
         {
            var i = srcPos;
            while(i+1 <= this.nbPlaces && this.draggableElements[i] != null)
            {
               res[i] = res[i+1];
               i++;
            }
         }
      }

      //push
      var el = srcCont.draggableElements[srcPos];
      if (this == dstCont)
      {
         if (dropType == 'replace')
            res[dstPos] = el;
         else
         {
            var end = dstPos;
            while(end < this.nbPlaces && res[end] != null)
               end++;
            for (var i = end; i > dstPos; i--)
               res[i] = res[i-1];
            res[dstPos] = el; 
         }
      }

      return res;
   };

//Draw places
   this.placeBG = component(0,0,placeBackgroundArray,this.dragAndDropSystem.paper); 
   for (var iPlace = 0; iPlace < this.nbPlaces; iPlace++)
   {
      var c = this.placeCenter(iPlace);
      if (iPlace == 0)
         this.placeBG.placeAt(c[0],c[1]);
      else
         this.placeBG.clone().placeAt(c[0],c[1]);
   }

//Contents

   this.draggableElements = new Array();
   for (var i = 0; i < this.nbMax; i++)
      this.draggableElements[i] = null;

   this.createDraggable = function(ident, position, shapesArray)
   {
      this.dragAndDropSystem.addDraggableElement(ident, this, position, 
         new _component(this.placeCenter(position)[0], this.placeCenter(position)[1], shapesArray,this.dragAndDropSystem.paper) );

      if (this.type == 'source')
      {
         this.sourceCompo = this.draggableElements[0].component.clone();
         this.sourceCompo.move(-10000,-10000);
         this.sourceIdent = ident;
         this.sourcePos = position;
      }
   };

   if (this.type == 'source')
   {
      var cloneArray = new Array();
      for (var i = 0; i < this.sourceElemArray.length; i++)
         cloneArray[i] = this.sourceElemArray[i].clone();
      component(this.cx, this.cy, cloneArray,this.dragAndDropSystem.paper)

      this.createDraggable(this.ident, 0, this.sourceElemArray);  
   }


   this.getObjects = function()
   {
      var res = new Array();
      for (var i = 0; i < this.nbPlaces; i++)
         if (this.draggableElements[i] != null)
            res[i] = this.draggableElements[i].ident;
         else
            res[i] = null;
      return res;
   };

   this.getElementOver = function(srcEl,x,y)
   {
      for (var i = 0; i < this.nbPlaces; i++)
         if (this.draggableElements[i] != null && this.draggableElements[i] != srcEl)
         {
            var el = this.draggableElements[i];
            if (x >= el.component.cx - this.widthPlace/2 - 1 && x <= el.component.cx + this.widthPlace/2 + 1)
               if (y >= el.component.cy - this.heightPlace/2 - 1 && y <= el.component.cy + this.heightPlace/2 + 1)
                  return el;
               
         }  
      return null;
   };

//Indicator
   this.indicator = null;

   this.showIndicator = function(act)
   {
      if (this.dragDisplayMode != 'marker')
         return;     

      var paper = this.dragAndDropSystem.paper;
      var c = this.placeCenter(act.dstPos);
      var w = this.widthPlace, h = this.heightPlace;
      
      if (act.dropType == 'replace')
         this.indicator = paper.rect(c[0]-w/2,c[1]-h/2,w,h).attr({'stroke' : 'red', 'stroke-width' : '4'});

      if (act.dropType == 'insert')
      {
         var prevC = this.placeCenter(act.dstPos-1);
         if (this.direction == 'vertical')
         {
            var y = (prevC[1] + c[1])/2;
            this.indicator = paper.rect(c[0]-3*w/4,y,3*w/2,1).attr({'stroke' : 'red', 'stroke-width' : '4'});    
         }        
         else
         {
            var x = (prevC[0] + c[0])/2;
            this.indicator = paper.rect(x,c[1]-3*h/4,1,3*h/2).attr({'stroke' : 'red', 'stroke-width' : '4'});
         }
      }        
   };

   this.hideIndicator = function()
   {
      if (this.indicator != null)
         this.indicator.remove();
      this.indicator = null;     
   };

// update source

this.updateSource = function()
{
   if (this.type == 'source' && this.draggableElements[0] == null)
   {
      this.sourceCompo.placeAt(0,0);

      var newSize = this.sourceCompo.elems.length;
      for (var i = this.sourceCompo.nbEl; i < newSize; i++)
         this.sourceCompo.elems[i].remove();
      for (var i = this.sourceCompo.nbEl; i < newSize; i++)
         this.sourceCompo.elems.pop();

      this.createDraggable(this.sourceIdent, 0 ,this.sourceCompo.elems);
   }
};

// update views

   this.timeAnim = 100;

   this.updateDisplay = function()
   {
      this.updateSource();
      this.placeHolder.hide();
      for (var i = 0; i < this.draggableElements.length; i++)
      {
         var center = this.placeCenter(i);
         if (this.draggableElements[i] != null)
         {
            this.draggableElements[i].component.placeAtWithAnim(center[0], center[1], this.timeAnim);
            this.draggableElements[i].component.show();
         }
      }
   };

   this.updateIntermediateDisplay = function(srcCont, srcPos, dstCont, dstPos, dropType)
   {
      this.placeHolder.hide();
      var intermed = this.getElementsAfterDrop(srcCont, srcPos, dstCont, dstPos, dropType);

      if (this.dragDisplayMode == 'preview')       
         for (var i = 0; i <= this.nbPlaces; i++)
         {
            var center = this.placeCenter(i);
            if (intermed[i] != null)
               if (intermed[i] == srcCont.draggableElements[srcPos])  
               {
                  this.placeHolder.show();
                  this.placeHolder.placeAt(center[0], center[1]);
                  this.placeHolder.toFront();
                  srcCont.draggableElements[srcPos].show();
                  srcCont.draggableElements[srcPos].component.toFront();
               }
               else
               {
                  intermed[i].component.placeAtWithAnim(center[0], center[1], this.timeAnim);
                  intermed[i].show();
               }           
         }  
      

      if (this.dragDisplayMode == 'marker')
      {
         if (this.dropMode == 'replace')
            return;

         for (var i = 0; i < this.nbPlaces; i++)
            if (this.draggableElements[i] != null)
               this.draggableElements[i].show();

         if (this == srcCont)
         {
            var iPlaceIns = srcPos;
            while(iPlaceIns+1 < this.nbPlaces && this.draggableElements[iPlaceIns+1] != null)
            {
               var center = this.placeCenter(iPlaceIns);
               this.draggableElements[iPlaceIns+1].component.placeAtWithAnim(center[0],center[1],this.timeAnim);
               iPlaceIns++;
            }
         }
      }

      if (intermed[this.nbPlaces] != null)
         intermed[this.nbPlaces].cross();
   };
}

// Constructeur "intelligent"

function container(_params)
{
   var params = _params;

   if (params.dragAndDropSystem == undefined)
      alert('no dragAndDropSystem is specified');
   if (params.ident == undefined)
      params.ident = '';
   if (params.type == undefined)
      params.type = 'list';
   if (params.type != 'source' && params.type != 'list')
      alert('type should be \'source\' or \'list\'');

   if (params.cx == undefined || params.cy == undefined)
      alert('cx and cy are not specified');

   if (params.widthPlace == undefined)
      params.widthPlace = 40;
   if (params.heightPlace == undefined)
      params.heightPlace = 40;

   if (params.align != undefined)
   {
      if (params.align != 'top' && params.align != 'bottom' && params.align != 'left' && params.align != 'right')
         alert('align should be \'top\' or \'bottom\' or \'left\' or \'right\'');
   
      if (params.align == 'top' || params.align == 'bottom')
         params.direction = 'vertical';
      else
         params.direction = 'horizontal';
   }
   else
   {
      if (params.direction == undefined)
      {
         params.direction = 'horizontal';
         params.align = 'left';
      }
      else
      {
         if (params.direction == 'vertical')
            params.align = 'top';
         else if (params.direction == 'horizontal')
            params.align = 'left';
         else
            alert('direction should be \'vertical\' or \'horizontal\' ');
      }
   }

   if (params.dragDisplayMode == undefined)
      params.dragDisplayMode = 'preview';
   else if (params.dragDisplayMode != 'preview' && params.dragDisplayMode != 'marker')
      alert('dragDisplayMode should be \'preview\' or \'marker\' ');

   if (params.placeBackgroundArray == undefined)
   {
      var paper = params.dragAndDropSystem.paper;
      var w = params.widthPlace, h = params.heightPlace;
      params.placeBackgroundArray = [paper.rect(-w/2,-h/2,w,h).attr('fill','blue')];            
   }

//Source
   if (params.type == 'source')
   {
      if (params.dropMode == undefined)
         params.dropMode = 'replace';  
      
      params.nbPlaces = 1;

      if (params.sourceElemArray == undefined)
         alert('sourceElemArray should be defined');
   }

//List   
   if (params.type == 'list')
   {
      if (params.dropMode == undefined)
         params.dropMode = 'insert';               

      if (params.nbPlaces == undefined)
         params.nbPlaces = 5;
   }     

   return new _container(
      params.dragAndDropSystem, params.ident,
      params.cx, params.cy, params.nbPlaces, params.widthPlace, params.heightPlace,
      params.direction, params.align, 
      params.dropMode, params.dragDisplayMode,
      params.placeBackgroundArray, params.type, params.sourceElemArray);
}


///DraggableElement

function _draggableElement(ident, container, position, component)
{
   this.ident = ident;
   this.container = container;
   this.position = position;
   this.component = component;

   this.crossShape = null;

   this.remove = function()
   {
      if (this.crossShape != null)
         this.crossShape.remove();
      this.crossShape = null;

      this.component.remove();   
   };

   this.cross = function()
   {
      if (this.crossShape != null)
         this.crossShape.remove();

      this.component.halfHide();
      
      /*
      var cx = this.component.cx, cy = this.component.cy;
      var w = this.container.widthPlace, h = this.container.heightPlace;
      var paper = this.container.dragAndDropSystem.paper;
      var p = 'M' + (cx - w/3) + ',' + (cy + h/3) + 'L' + (cx + w/3) + ',' + (cy - h/3) + 'L' + cx + ',' + cy +
         'M' + (cx - w/3) + ',' + (cy - h/3) + 'L' + (cx + w/3) + ',' + (cy + h/3);
      this.crossShape = paper.path(p).attr({'stroke':'red', 'stroke-width' : '3'});
      */
   };

   this.show = function()
   {
      if (this.crossShape != null)
         this.crossShape.remove();
      this.crossShape = null;

      this.component.show();
   };

   this.hide = function()
   {
      if (this.crossShape != null)
         this.crossShape.remove();
      this.crossShape = null;

      this.component.hide();
   };
}



function _action(dstCont, dstPos, dropType)
{
   this.dstCont = dstCont;
   this.dstPos = dstPos;
   this.dropType = dropType;  

   this.sameAs = function(other)
   {
      return this.dstCont == other.dstCont && this.dstPos == other.dstPos && this.dropType == other.dropType;
   };
}

function action(dstCont, dstPos, dropType) 
{ 
   return new _action(dstCont, dstPos, dropType); 
}

///DragAndDropSystem

function _DragAndDropSystem(paper)
{  
   this.paper = paper;

   this.keepLastGoodAction = true;

//Containers
   this.containers = new Array();   
   this.addContainer = function(params) 
   {
      params.dragAndDropSystem = this;
      this.containers.push(container(params) );
      return this.containers[this.containers.length-1];
   };

   this.removeContainer = function(cont)
   {
      for (var i = 0; i < this.containers.length; i++) {
         if (this.containers[i] == cont)
         {
            this.containers[i] = this.containers[this.containers.length-1];
            this.containers.pop();
         }
      }
   };

   // Create a temporary container, useful for ejection 
   this.addContainer({
      ident : 'temporaryContainer', 
      cx : -1000, cy : -1000, nbPlaces : 1, widthPlace : 10, heigthPlace : 10,
      direction : 'vertical', align : 'top',
      dropMode : 'replace', dragDiplayMode : 'marker',
      placeBackgroundArray : [],
      type : 'list'});

//Draggable elements
   this.addDraggableElement = function(ident,container, position,comp)
   {
      var dragEl = new _draggableElement(ident, container, position,comp);
      comp.draggableElement = dragEl;
      container.draggableElements[position] = dragEl;

      var that = this;
      var start = function()
      {
         if (this.hasReallyMoved) {
            this.upDrag();
         }
         if (!that.canBeTaken(this.draggableElement.container.ident, this.draggableElement.position))
            return;
         this.startcx = this.cx;
         this.startcy = this.cy; 
         this.hasReallyMoved = false;
         this.toFront();
      };

      var move = function(dx,dy)
      {
         if (isNaN(dx) || isNaN(dy))
            return;

         if (!that.canBeTaken(this.draggableElement.container.ident, this.draggableElement.position))
            return;

         this.placeAt(this.startcx + dx, this.startcy + dy);
         if (Math.abs(this.cx - this.startcx) > 5 || Math.abs(this.cy - this.startcy) > 5)
         {
            this.hasReallyMoved = true; 
            that.hasBeenTaken(dragEl);
         }
         if (this.hasReallyMoved)
            that.hasBeenMoved(dragEl,this.cx,this.cy);
      }

      var up = function()
      {
         if (!that.canBeTaken(this.draggableElement.container.ident, this.draggableElement.position))
            return;

         if (!this.hasReallyMoved)  
         {
            this.placeAt(this.startcx, this.startcy);
            return;
         }
         this.hasReallyMoved = false;

         that.hasBeenDropped(dragEl,this.cx,this.cy);
      }
      
      comp.drag(move,start,up);     

      return dragEl;
   };

   this.removeDraggableElement = function(el)
   {
      for (var i = 0; i < this.draggableElements.length; i++)
         if (this.draggableElements[i] == el)
         {
            this.draggableElements[i] = this.draggableElements[this.draggableElements.length-1];
            this.draggableElements.pop();
         }
   };

   this.getObjects = function(containerId)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (this.containers[iCont].ident == containerId)
            return this.containers[iCont].getObjects();
   };

   this.insertObject = function(containerId, pos, elem)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (this.containers[iCont].ident == containerId)
            this.containers[iCont].createDraggable(elem.ident, pos, elem.elements);    
   };

   this.insertObjects = function(containerId, pos, elems)
   {
      // optimized version of insertObject applied to each of the elems
      for (var iCont = 0; iCont < this.containers.length; iCont++) {
         if (this.containers[iCont].ident == containerId) {
            var cont = this.containers[iCont];
            for (var i = 0; i < elems.length; i++) {
               var elem = elems[i];
               if (elem != null) {
                  cont.createDraggable(elem.ident, pos+i, elem.elements);    
               }
            }
         }
      }
   };

   this.removeObject = function(containerId, pos)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (this.containers[iCont].ident == containerId)
         {
            var el = this.containers[iCont].draggableElements[pos];
            this.containers[iCont].draggableElements[pos] = null;
            el.remove();
         }        
   };

   this.removeAllObjects = function(containerId) 
   {
      // optimized version of: getObjects followed by removeObject on each of them
      for (var iCont = 0; iCont < this.containers.length; iCont++) {
         if (this.containers[iCont].ident == containerId) {
            var elems = this.containers[iCont].draggableElements;
            for (var i = 0; i < elems.length; i++) {
               var el = elems[i];
               if (el != null) {
                  elems[i] = null;
                  el.remove();
               }
            }
         }
      }
   }


// utils

   //the user uses identifier instead of a reference for containers
   this.userActionToAction = function(act)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (this.containers[iCont].ident == act.dstCont)
            return action(this.containers[iCont], act.dstPos, act.dropType);

      return action(null , act.dstPos, act.dropType);
   };

   // return the action object corresponding to what to do if el is dropped here
   this.getCorrespondingAction = function(el,cx,cy)
   {
      var srcCont = el.container, srcPos = el.position;
      //We test if one containter can recieve
      for (var iCont = 0; iCont < this.containers.length; iCont++)
      {
         var dstCont = this.containers[iCont];
         if (dstCont.isInContainer(cx,cy))
         {
            var act = dstCont.getCorrespondingAction(el,cx,cy);
            if (act == null)
               continue;
            var actUser = this.actionIfDropped(srcCont.ident, srcPos, act.dstCont.ident, act.dstPos, act.dropType);
            if (actUser == true)
               return act;
            if (actUser != false)
               return this.userActionToAction(actUser);
         }
      }

      //Here, no container can recieve, we thus call actionIfDropped for an empty dst.
      var actUser = this.actionIfDropped(srcCont.ident, srcPos, null,null,'insert');
      if (actUser == true)
         return action(null,null,'insert');
      if (actUser != false)
         return this.userActionToAction(actUser);

      //Default behaviour
      if (this.keepLastGoodAction && this.lastDisplayedAction != null)
         return this.lastDisplayedAction;

      return action(srcCont, srcPos, srcCont.dropMode);     
   };

   this.hideIndicators = function() 
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         this.containers[iCont].hideIndicator();
   };

   this.updateDisplay = function()
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         this.containers[iCont].updateDisplay();         
   };

   this.updateIntermediateDisplay = function(srcCont, srcPos, dstCont, dstPos, dropType)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         this.containers[iCont].updateIntermediateDisplay(srcCont, srcPos, dstCont, dstPos, dropType);        
   };
   
   this.getElementOver = function(srcEl,x,y)
   {
      for (var iCont = 0; iCont < this.containers.length; iCont++)
      {
         var el = this.containers[iCont].getElementOver(srcEl,x,y);
         if (el != null)
            return el;
      }     
      return null;
   };

// Inner Signals
   this.hasBeenTaken = function(el)
   {
   };

   this.lastDisplayedAction = null;
   this.lastOver = -1;
   this.hasBeenMoved = function(el,cx,cy)
   {
      var action = this.getCorrespondingAction(el,cx,cy);

      var elOver = this.getElementOver(el,cx,cy); 

      if (this.lastOver !== elOver)
      {
         this.lastOver = elOver;
         if (this.lastOver != null)
            this.over(el.container.ident, el.position, elOver.container.ident, elOver.position);
         else
            this.over(el.container.ident, el.position, null, 0);     
      }

      if (this.lastDisplayedAction == null || !action.sameAs(this.lastDisplayedAction))
      {
         this.lastDisplayedAction = action;
         this.hideIndicators();
         if (action.dstCont != null)
         {
            action.dstCont.showIndicator(action);
            el.component.toFront();
         }
         this.updateIntermediateDisplay(el.container, el.position, action.dstCont, action.dstPos, action.dropType);
      }
   };

   this.hasBeenDropped = function(el,cx,cy)
   {
      this.hideIndicators();
      var action = this.getCorrespondingAction(el,cx,cy);

      var srcCont = el.container, srcPos = el.position;
      this.processDeplacement(srcCont, srcPos, action.dstCont, action.dstPos, action.dropType);

      this.lastDisplayedAction = null;
      this.lastOver = -1;
   };

// Authorization

   this.canBeTaken = function(conteneurId, position) { return true; };
   this.actionIfDropped = function(srcContId, srcPos, dstContId, dstPos, dropType) { return true; };
   
// User signals

   this.drop = function(srcContId, srcPos, dstContId, dstPos, dropType) {  };
   this.over = function(srcContId, srcPos, dstContId, dstPos) {} ;
   this.actionIfEjected = function(refEl, previousCont, previousPos) {return null; };
   this.ejected = function(refEl, previousCont, previousPos){};

// Process deplacement

   this.processDeplacement = function(srcCont, srcPos, dstCont, dstPos, dropType)
   {
      var newObjects = new Array();
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         newObjects[iCont] = this.containers[iCont].getElementsAfterDrop(srcCont, srcPos, dstCont, dstPos, dropType);
      
      var ejected = null;

      //If an element is deplaced after the end, it will be ejected
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (newObjects[iCont][this.containers[iCont].nbPlaces] != null)
         {
            var elEjected = newObjects[iCont][this.containers[iCont].nbPlaces];
            var previousCont = this.containers[iCont];
            ejected = {'refEl' : elEjected, 'previousCont' : previousCont, 'previousPos' : (this.containers[iCont].nbPlaces-1)};     
         }  

      //If an element was overwritten, it will be ejected
      var iDstCont = -1;
      for (var iCont = 0; iCont < this.containers.length; iCont++)
         if (this.containers[iCont] == dstCont)
            iDstCont = iCont;
      if (iDstCont != -1)
         if (dropType == 'replace' && newObjects[iDstCont][dstPos] != null)
            if (newObjects[iDstCont][dstPos] != srcCont.draggableElements[srcPos])
            {        
               var elEjected = newObjects[iDstCont][dstPos];
               var previousCont = this.containers[iDstCont];
               // We have to find its position after the movement
               var previousPos = -1;
               for (var iPlace = 0; iPlace < this.containers[iDstCont].length; iPlace++)
                  if (this.containers[iDstCont][iPlace] == elEjected)
                     previousPos = iPlace
               if (previousPos == -1)
                  alert('did not find previous position for ejection');
               ejected = {'refEl' : elEjected, 'previousCont' : previousCont, 'previousPos' : previousPos};  
            }

      //If we drop into the void, the element will be ejected
      if (dstCont == null)
         ejected = {'refEl' : srcCont.draggableElements[srcPos], 'previousCont' : srcCont, 'previousPos' : srcPos};   

      //copy
      for (var iCont = 0; iCont < this.containers.length; iCont++)
      {
         var cont = this.containers[iCont];
         for (var iPlace = 0; iPlace < cont.nbPlaces; iPlace++)
         {
            cont.draggableElements[iPlace] = newObjects[iCont][iPlace];
            if (cont.draggableElements[iPlace] != null)
            {
               cont.draggableElements[iPlace].container = cont;
               cont.draggableElements[iPlace].position = iPlace;  
            }
         }     
      }  
   
      this.updateDisplay();

      if (dstCont != null)
         this.drop(srcCont.ident, srcPos, dstCont.ident, dstPos, dropType);      
      else
         this.drop(srcCont.ident, srcPos, null);
      
      //If needed, we process the ejection
      if (ejected != null)
         this.manageEjection(ejected['refEl'], ejected['previousCont'], ejected['previousPos']);

   };

   // Ejection

   this.manageEjection = function(refEl, previousCont, previousPos)
   {
      var act = this.actionIfEjected(refEl, previousCont.ident, previousPos);
      refEl.show();
      if (act == null)
         refEl.remove();
      else
      {
         //push in temporary container, little hack
         act = this.userActionToAction(act);
         this.containers[0].draggableElements[0] = refEl;
         refEl.container = this.containers[0];
         refEl.position = 0;  
         this.processDeplacement(this.containers[0], 0, act.dstCont, act.dstPos, act.dropType);
      }
      
      this.ejected(refEl, previousCont.ident, previousPos); 
   };
}

//function DragAndDropSystem(paper){return new _DragAndDropSystem(paper);}

function DragAndDropSystem(params)
{
   if (params.paper == undefined)
      alert('paper should be defined');
   
   var dragAndDrop = new _DragAndDropSystem(params.paper);
   
   if (params.keepLastGoodAction != undefined)
      dragAndDrop.keepLastGoodAction = params.keepLastGoodAction;

   if (params.canBeTaken != undefined)
      dragAndDrop.canBeTaken = params.canBeTaken;

   if (params.actionIfDropped != undefined)
      dragAndDrop.actionIfDropped = params.actionIfDropped;

   if (params.drop != undefined)
      dragAndDrop.drop = params.drop;

   if (params.actionIfEjected != undefined)
      dragAndDrop.actionIfEjected = params.actionIfEjected;

   if (params.ejected != undefined)
      dragAndDrop.ejected = params.ejected;

   if (params.over != undefined)
      dragAndDrop.over = params.over;

   return dragAndDrop;
};





