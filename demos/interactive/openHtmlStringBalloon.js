var feature = null;
if (window.placemark) {
  feature = window.placemark;
}
var b = ge.createHtmlStringBalloon('');
b.setMaxWidth(300);
b.setFeature(feature);
// Google logo.
b.setContentString(
    '<img src="http://www.google.com/intl/en_ALL/images/logo.gif"><br>'
    + '<font size=20>Earth Plugin</font><br><font size=-2>sample info '
    + 'window</font>');
ge.setBalloon(b);
