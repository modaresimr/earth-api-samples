var placemark = ge.createPlacemark('');
placemark.setName("placemark" + counter);
ge.getFeatures().appendChild(placemark);

// Create style map for placemark
var normal = ge.createIcon('');
normal.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
var iconNormal = ge.createStyle('');
iconNormal.getIconStyle().setIcon(normal);
var highlight = ge.createIcon('');
highlight.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
var iconHighlight = ge.createStyle('');
iconHighlight.getIconStyle().setIcon(highlight);
var styleMap = ge.createStyleMap('');
styleMap.setNormalStyle(iconNormal);
styleMap.setHighlightStyle(iconHighlight);
placemark.setStyleSelector(styleMap);
  
// Create point
var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
var point = ge.createPoint('');
point.setLatitude(la.getLatitude());
point.setLongitude(la.getLongitude());
placemark.setGeometry(point);

counter++;
