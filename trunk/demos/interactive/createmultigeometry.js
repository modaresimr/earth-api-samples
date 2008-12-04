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

// create the KmlMultiGeometry
var multiGeometry = ge.createMultiGeometry('');

// add circles to the multigeometry
var geometries = multiGeometry.getGeometries();
geometries.appendChild(makeCircle(0.25));
geometries.appendChild(makeCircle(0.55));
geometries.appendChild(makeCircle(0.85));
geometries.appendChild(makeCircle(1.15));

// create the multigeometry placemark and add it to Earth
var multiGeometryPlacemark = ge.createPlacemark('');
multiGeometryPlacemark.setGeometry(multiGeometry);
ge.getFeatures().appendChild(multiGeometryPlacemark);

// persist the placemark for other interactive samples
window.placemark = multiGeometryPlacemark;