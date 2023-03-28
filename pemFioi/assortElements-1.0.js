function AssortElements(params) {
   let { paper, elemW, elemH, elements, dropZones, attr, dropCallback } = params;
   let zoneIDs = [];
   let elementsObject = {};
   
   this.dragAndDrop;
   this.test = 3;
   let self = this;
   init();

   function init() {
      // initZoneIDs();
      initElementsObject();
      initDragAndDrop();
      initContainers();
   };

   function initElementsObject() {
      for(var elem of elements){
         elementsObject[elem.id] = elem;
      }
   };

   function initDragAndDrop() {
      self.dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            if(dropCallback){
               dropCallback();
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType) {
            return true
         },
         ejected : function(refEl, previousCont, previousPos) {

         },
         actionIfEjected: function(refElement, previousContainerId, previousPos) {
            return DragAndDropSystem.action(refElement.ident,0,'replace');
         }
      });
   }; 

   function initContainers() {
      for(let elem of elements){
         let id = elem.id;
         let w = elemW, h = elemH;
         let cx = elem.pos.x + w/2;
         let cy = elem.pos.y + h/2;
         let background = (attr.srcCont) ? paper.rect(-w/2,-h/2,w,h).attr(attr.srcCont) : null;
         self.dragAndDrop.addContainer({
            ident: id, cx, cy,
            widthPlace : w,
            heightPlace : h,
            nbPlaces : 1,
            dropMode : 'replace',
            placeBackgroundArray : background
         });

         let obj = drawElement(elem,0,0);
         self.dragAndDrop.insertObject(id, 0, {ident : id, elements : obj });
      }
      for(let zone of dropZones){
         let id = zone.id;
         let size = zone.size;
         let w = elemW, h = elemH;
         let { x, y } = zone.pos;
         let cx = x + w/2;
         let cy = y + size*h/2;
         if(attr.dropZone){
            paper.rect(x,y,w,size*h).attr(attr.dropZone);
         }
         self.dragAndDrop.addContainer({
            ident: id, cx, cy,
            widthPlace : w,
            heightPlace : h,
            nbPlaces : size,
            direction: 'vertical',
            dropMode : 'insertBefore',
            align: 'top',
            placeBackgroundArray : null
         });

         if(zone.label && zone.labelPos){
            let { x, y } = zone.labelPos;
            let label = paper.text(x,y,zone.label);
            if(attr.zoneLabel){
               label.attr(attr.zoneLabel);
            }
         }

         for(var iEl = 0; iEl < zone.size; iEl++){
            let elemID = zone.content[iEl];
            if(elemID != null){
               let obj = drawElement(elementsObject[elemID],0,0);
               self.dragAndDrop.insertObject(zone.id, iEl, {ident : elemID, elements : obj });
               self.dragAndDrop.removeObject(elemID,0);
            }
         }
      }
   };

   function drawElement(elem,cx,cy) {
      let w = elemW, h = elemH;
      let x = cx - w/2;
      let y = cy - h/2;
      let rect = paper.rect(x,y,w,h).attr(attr.element.rect);
      let text = paper.text(cx,cy,elem.text).attr(attr.element.text);
      return paper.set(rect,text)
   };

};