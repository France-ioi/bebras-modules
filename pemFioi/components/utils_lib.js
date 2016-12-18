/*!
 * @author John Ropas
 * @since 17/12/2016
 */

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};


// from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// where they got it from the stackoverflow-code itself ("formatUnicorn")
if (!String.prototype.format) {
  String.prototype.format = function() {
    var str = this.toString();
    if (!arguments.length)
      return str;
    var args = typeof arguments[0],
      args = (("string" == args || "number" == args) ? arguments : arguments[0]);
    for (var arg in args)
      str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
    return str;
  }
}


