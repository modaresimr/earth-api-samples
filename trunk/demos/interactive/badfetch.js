// in this sample we will purposely attempt
// to fetch a bad KML file (one that doesnt exist)

function finished(object) {
  if (!object) {
    alert('bad or NULL kml');
  }
}

google.earth.fetchKml(ge, 'http://www.google.com/fakePlacemark.kml', finished);
