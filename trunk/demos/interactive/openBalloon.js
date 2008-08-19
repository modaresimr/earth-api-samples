// Open a balloon above a feature.
var feature = null;

// Search for an already-created feature, from one of the other
// code snippets.
if (window.placemark) {
  feature = window.placemark;
} else if (window.lineStringPlacemark) {
  feature = window.lineStringPlacemark;
} else if (window.polygonPlacemark) {
  feature = window.polygonPlacemark;
} else if (window.groundOverlay) {
  feature = window.groundOverlay;
}
if (!feature) {
  alert("Can't find a feature");
} else {
  var balloon = ge.createFeatureBalloon('');
  balloon.setFeature(feature);
  balloon.setMaxWidth(300);
  feature.setDescription('asidjaisdj');
  ge.setBalloon(balloon);
}
