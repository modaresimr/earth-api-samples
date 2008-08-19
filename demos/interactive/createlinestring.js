function addToLineString(lineString, lat, lng, latOffset, lngOffset) {
  lineString.getCoordinates().
    pushLatLngAlt(lat + latOffset, lng + lngOffset, 0);
}

var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var lat = lookAt.getLatitude();
var lng = lookAt.getLongitude();

var lineStringPlacemark = ge.createPlacemark('');
var lineString = ge.createLineString('');
lineStringPlacemark.setGeometry(lineString);
lineString.setTessellate(true);

addToLineString(lineString, lat, lng,   0,   0, 0);
addToLineString(lineString, lat, lng, 1.5,  .5, 0);
addToLineString(lineString, lat, lng,   0, 1.0, 0);
addToLineString(lineString, lat, lng, 1.5, 1.5, 0);
addToLineString(lineString, lat, lng,   0, 2.0, 0);
addToLineString(lineString, lat, lng, 1.5, 2.5, 0);
addToLineString(lineString, lat, lng,   0, 3.0, 0);
addToLineString(lineString, lat, lng, 1.5, 3.5, 0);
addToLineString(lineString, lat, lng,   0, 4.0, 0);
addToLineString(lineString, lat, lng, 1.5, 4.5, 0);

ge.getFeatures().appendChild(lineStringPlacemark);
