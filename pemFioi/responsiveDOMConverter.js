function convertDOM() {
   if($("#zone_012").length > 0){
      return
   }
   $("head").prepend("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");

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
   $("<h3><i class='far fa-sticky-not'></i>"+taskStrings.introTitle.toUpperCase()+"</h3>").appendTo(consigne);
   var text = $("<div id='text'></div>");
   $("#zone_1").children().detach().appendTo(text);
   text.appendTo(consigne);    
   consigne.append("<div class='spacer' style='clear: both;'></div>");       
   consigne.appendTo("#zone_1");

   var taskCont = $("<div id='taskCont'></div>");
   $("#zone_2").children().detach().appendTo(taskCont);
   // $("#paper").detach().appendTo(taskCont);
   taskCont.appendTo("#zone_2");

   $("#taskContent").children().detach().appendTo("#task");
   $("#taskContent").remove();
   $("#zone_2 #error").remove();
};