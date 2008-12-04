var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

// create an image for the ground overlay
var icon = ge.createIcon('');
icon.setHref('http://www.google.com/intl/en_ALL/images/logo.gif');

// create a bounding box for the ground overlay
var latLonBox = ge.createLatLonBox('');
latLonBox.setNorth(center.getLatitude() + 0.35);
latLonBox.setSouth(center.getLatitude() - 0.35);
latLonBox.setEast(center.getLongitude() + 1.00);
latLonBox.setWest(center.getLongitude() - 1.00);
latLonBox.setRotation(0);

// create the ground overlay
var groundOverlay = ge.createGroundOverlay('');
groundOverlay.setIcon(icon);
groundOverlay.setLatLonBox(latLonBox);

// add the ground overlay to Earth
ge.getFeatures().appendChild(groundOverlay);
