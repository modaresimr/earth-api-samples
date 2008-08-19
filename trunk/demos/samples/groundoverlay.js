var groundOverlay = ge.createGroundOverlay('');
groundOverlay.setIcon(ge.createIcon(''))
groundOverlay.getIcon().
  setHref("http://www.google.com/intl/en_ALL/images/logo.gif");
groundOverlay.setLatLonBox(ge.createLatLonBox(''));

var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var north = center.getLatitude() + .35;
var south = center.getLatitude() - .35;
var east = center.getLongitude() + .55;
var west = center.getLongitude() - .55;
var rotation = 0;
var latLonBox = groundOverlay.getLatLonBox();
latLonBox.setBox(north, south, east, west, rotation);

ge.getFeatures().appendChild(groundOverlay);
