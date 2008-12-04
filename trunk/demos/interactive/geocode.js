if (!window.geocodeLocation) {
  window.geocodeLocation = 'City name, country, latitude and longitude, etc';
}

window.geocodeLocation = prompt('Enter a location', window.geocodeLocation);
var geocoder = new google.maps.ClientGeocoder();
geocoder.getLatLng(window.geocodeLocation, function(point) {
  if (point) {
    var lookAt = ge.createLookAt('');
    lookAt.set(point.lat(), point.lng(), 10, ge.ALTITUDE_RELATIVE_TO_GROUND, 
               0, 60, 20000);
    ge.getView().setAbstractView(lookAt);
  }
});

