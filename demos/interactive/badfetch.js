// in this sample we will purposely attempt
// to fetch a bad KML file (one that doesnt exist)

function finished(object) {
  if (!object) {
    // wrap alerts in API callbacks and event handlers
    // in a setTimeout to prevent deadlock in some browsers
    setTimeout(function() {
      alert('Bad or null KML.');
    }, 0);
  }
}

google.earth.fetchKml(ge, 'http://www.google.com/fakePlacemark.kml', finished);
