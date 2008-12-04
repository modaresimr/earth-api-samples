if (!('counter' in window)) {
  window.counter = 1;
}

// create icon style for the placemark
var icon = ge.createIcon('');
icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
var style = ge.createStyle('');
style.getIconStyle().setIcon(icon);

// create a point geometry
var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var point = ge.createPoint('');
point.setLatitude(lookAt.getLatitude());
point.setLongitude(lookAt.getLongitude());

// create the point placemark and add it to Earth
var pointPlacemark = ge.createPlacemark('');
pointPlacemark.setName('placemark' + window.counter);
pointPlacemark.setGeometry(point);
pointPlacemark.setStyleSelector(style);
ge.getFeatures().appendChild(pointPlacemark);

// persist the placemark and counter for other interactive samples
window.counter++;
window.placemark = pointPlacemark;