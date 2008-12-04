if (!window.placemark) {
  alert('No placemark; run one of the placemark samples first.');
} else {
  // create a normal style
  var normalIcon = ge.createIcon('');
  normalIcon.setHref('http://maps.google.com/mapfiles/kml/shapes/triangle.png');
  var normalStyle = ge.createStyle('');
  normalStyle.getIconStyle().setIcon(normalIcon);

  // create a highlight style that changes the placemark's icon,
  // line color, and polygon fill color if it has them
  var highlightIcon = ge.createIcon('');
  highlightIcon.setHref('http://maps.google.com/mapfiles/kml/shapes/square.png');
  var highlightStyle = ge.createStyle('');
  highlightStyle.getLineStyle().getColor().set('ff00ffff'); // aabbggrr format
  highlightStyle.getLineStyle().setWidth(5);
  highlightStyle.getPolyStyle().getColor().set('ffffff00'); // aabbggrr format
  highlightStyle.getIconStyle().setIcon(highlightIcon);

  // create a KmlStyleMap and set its normal and highlight styles
  var styleMap = ge.createStyleMap('');
  styleMap.setNormalStyle(normalStyle);
  styleMap.setHighlightStyle(highlightStyle);

  // apply the style map to the placemark
  placemark.setStyleSelector(styleMap);
}
