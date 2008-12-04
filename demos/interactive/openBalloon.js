if (!window.placemark) {
  alert('No placemark; run one of the placemark samples first.');
} else {
  window.placemark.setDescription('asidjaisdj');
  
  // create the balloon and show it in Earth  
  var balloon = ge.createFeatureBalloon('');
  balloon.setFeature(window.placemark);
  balloon.setMaxWidth(300);
  ge.setBalloon(balloon);
}
