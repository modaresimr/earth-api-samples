if (!window.placemark) {
  alert('placemark not defined');
} else {
  // Apply stylemap to a placemark
  counter++;
  map = ge.createStyleMap('styleMap' + counter);
  
  // Create icon normal for style map
  normal = ge.createIcon('');
  normal.setHref('http://maps.google.com/mapfiles/kml/shapes/triangle.png');
  iconNormal = ge.createStyle('styleIconNormal' + counter);
  iconNormal.getIconStyle().setIcon(normal);

  // Create icon highlight for style map
  highlight = ge.createIcon('');
  highlight.setHref('http://maps.google.com/mapfiles/kml/shapes/square.png');
  iconHighlight = ge.createStyle('styleIconHighlight' + counter);
  iconHighlight.getIconStyle().setIcon(highlight);

  // Set normal and highlight icons for stylemap.
  // This is different than creating a style map in createplacemark.js.
  // This example uses a url rather than a style.
  map.setNormalStyleUrl('#styleIconNormal' + counter);
  map.setHighlightStyleUrl('#styleIconHighlight' + counter);

  // Apply stylemap to placemark. Ensure that the inline style
  // selector is null since an inline style selector takes 
  // precedence over shared styles.
  placemark.setStyleSelector(null);  // inline style
  placemark.setStyleUrl('#styleMap' + counter);  // shared style
}
