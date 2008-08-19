function makeCircle(radius, x, y) {
  var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var ring = ge.createLinearRing('');
  var steps = 25;
  var pi2 = Math.PI * 2;
  for (var i = 0; i < steps; i++) {
    var lat = center.getLatitude() + x + radius * Math.cos(i / steps * pi2);
    var lng = center.getLongitude() + y + radius * Math.sin(i / steps * pi2);
    ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
  }
  return ring;
}

var multGeoPlacemark = ge.createPlacemark('');
multGeoPlacemark.setGeometry(ge.createMultiGeometry(''));
var geoms = multGeoPlacemark.getGeometry().getGeometries();
geoms.appendChild(makeCircle(.25, 0, 0));
geoms.appendChild(makeCircle(.55, 0, 0));
geoms.appendChild(makeCircle(.85, 0, 0));
geoms.appendChild(makeCircle(1.15, 0, 0));
ge.getFeatures().appendChild(multGeoPlacemark);