function convertDOM() {
   if($("#zone_012").length > 0){
      return
   }
   $("#task").append("<div id='zone_012'></div>");
   $("#task").append("<div id='zone_3'></div>");
   $("#task").append("<span id='error'></span>");

   $("#zone_012").append("<div id='zone_0'></div>");
   $("#zone_012").append("<div id='zone_12'></div>");
   
   $("#task > h1").detach().appendTo("#zone_0");
   $("#tabsContainer").detach().appendTo("#zone_0");
   
   $("#zone_1").detach().appendTo("#zone_12");
   $("#zone_2").detach().appendTo("#zone_12");
   
   var consigne = $("<div class='consigne'></div>");
   var text = $("<div id='text'></div>");
   $("#zone_1").children().detach().appendTo(text);
   text.appendTo(consigne);
   consigne.appendTo("#zone_1");

   var taskCont = $("<div id='taskCont'></div>");
   $("#paper").detach().appendTo(taskCont);
   taskCont.appendTo("#zone_2");

   $("#taskContent").children().detach().appendTo("#task");
   $("#taskContent").remove();
   $("#zone_2 #error").remove();
};