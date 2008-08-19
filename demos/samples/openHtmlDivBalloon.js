var feature = null;
if (window.placemark) {
  feature = window.placemark;
}
var b = ge.createHtmlDivBalloon('');
b.setMaxWidth(800);
b.setFeature(feature);
var div = document.createElement('DIV');
div.innerHTML =
        '<img src="http://www.google.com/googlegulp/images/logo.gif"><br>'
        + '<a href="http://www.google.com/googlegulp/">Google Gulp</a>';
b.setContentDiv(div);
ge.setBalloon(b);
