if (!window.lineStringPlacemark) {
  alert('lineStringPlacemark not defined.  ' +
        'Run the "Create LineString" sample first"');
} else {
  // If lineStringPlacemark doesn't already have a Style associated
  // with it, we create it now.
  if (!lineStringPlacemark.getStyleSelector()) {
    lineStringPlacemark.setStyleSelector(ge.createStyle(''));
  }
  // The Style of a Feature is retrieved as feature.getStyleSelector().
  // The Style itself contains a LineStyle, which is what we manipulate
  // to change the color and width of the line.
  var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
  lineStyle.setWidth(lineStyle.getWidth() + 2);
  lineStyle.getColor().set('66ff0000');  // aabbggrr format
}
