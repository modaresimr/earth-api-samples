function makeCircle(radius) {
  var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var ring = ge.createLinearRing('');
  var steps = 25;
  var pi2 = Math.PI * 2;
  
  for (var i = 0; i < steps; i++) {
    var lat = center.getLatitude() + radius * Math.cos(i / steps * pi2);
    var lng = center.getLongitude() + radius * Math.sin(i / steps * pi2);
    ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
  }
  
  return ring;
}

// create the KmlPolygon and its outer boundary (a KmlLinearRing)
var polygon = ge.createPolygon('');
polygon.setOuterBoundary(makeCircle(.5));

// create the polygon placemark and add it to Earth
var polygonPlacemark = ge.createPlacemark('');
polygonPlacemark.setGeometry(polygon);
ge.getFeatures().appendChild(polygonPlacemark);

// persist the placemark for other interactive samples
window.placemark = polygonPlacemark;
window.polygonPlacemark = polygonPlacemark;