(function () {
'use strict';

$("body").prepend("<h1>" + $("title").text() + "</h1>");
$("#skillSummary").prepend("<h2>Summary</h2>");
$("#resources").prepend("<h2>Resources</h2>");
$("body").append("<h2>Prerequisites</h2><ul>");
$.each(PEMTaskMetaData.prerequisites, function(index, prerequisite) {
   $("body").append("<li>" + prerequisite + "</li>");
});
$("body").append("<h3>Difficulty: " + PEMTaskMetaData.difficulty + "</h3>");
$("body").append("<h3>License: " + PEMTaskMetaData.license + "</h3>");


})();
