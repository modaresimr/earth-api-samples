var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var lat = lookAt.getLatitude();
var lng = lookAt.getLongitude();

// first create inner and outer boundaries
// outer boundary is a square
var outerBoundary = ge.createLinearRing('');
var coords = outerBoundary.getCoordinates();
coords.pushLatLngAlt(lat - 0.5, lng - 0.5, 0); 
coords.pushLatLngAlt(lat - 0.5, lng + 0.5, 0); 
coords.pushLatLngAlt(lat + 0.5, lng + 0.5, 0); 
coords.pushLatLngAlt(lat + 0.5, lng - 0.5, 0); 

// inner boundary is a smaller square
// NOTE: we can create any number of inner boundaries.
var innerBoundary = ge.createLinearRing('');
coords = innerBoundary.getCoordinates();
coords.pushLatLngAlt(lat - 0.2, lng - 0.2, 0); 
coords.pushLatLngAlt(lat - 0.2, lng + 0.2, 0); 
coords.pushLatLngAlt(lat + 0.2, lng + 0.2, 0); 
coords.pushLatLngAlt(lat + 0.2, lng - 0.2, 0); 

// create the polygon and set its boundaries
var polygon = ge.createPolygon('');
polygon.setOuterBoundary(outerBoundary);
polygon.getInnerBoundaries().appendChild(innerBoundary);

// create the polygon placemark and add it to Earth
var polygonPlacemark = ge.createPlacemark('');
polygonPlacemark.setGeometry(polygon);
ge.getFeatures().appendChild(polygonPlacemark);

// persist the placemark for other interactive samples
window.placemark = polygonPlacemark;
window.polygonPlacemark = polygonPlacemark;