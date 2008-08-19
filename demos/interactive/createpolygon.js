var polygonPlacemark = ge.createPlacemark('');
var polygon = ge.createPolygon('');
polygonPlacemark.setGeometry(polygon);
var outer = ge.createLinearRing('');
polygon.setOuterBoundary(outer);

// Square outer boundary.
var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var coords = outer.getCoordinates();
var lat = center.getLatitude();
var lon = center.getLongitude();
coords.pushLatLngAlt(lat - .05, lon - .05, 0); 
coords.pushLatLngAlt(lat - .05, lon + .05, 0); 
coords.pushLatLngAlt(lat + .05, lon + .05, 0); 
coords.pushLatLngAlt(lat + .05, lon - .05, 0); 

// Another square as the inner boundary.  Note that we can create
// any number of inner boundaries.
var innerBoundary = ge.createLinearRing('');
polygon.getInnerBoundaries().appendChild(innerBoundary);
coords = innerBoundary.getCoordinates();
coords.pushLatLngAlt(lat - .02, lon - .02, 0); 
coords.pushLatLngAlt(lat - .02, lon + .02, 0); 
coords.pushLatLngAlt(lat + .02, lon + .02, 0); 
coords.pushLatLngAlt(lat + .02, lon - .02, 0); 

ge.getFeatures().appendChild(polygonPlacemark);
