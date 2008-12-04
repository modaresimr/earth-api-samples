// create an image for the screen overlay
var icon = ge.createIcon('');
icon.setHref('http://earth-api-samples.googlecode.com/svn/trunk/' +
             'examples/static/frame.png');  // Loads an gilded picture frame.

// create the screen overlay
var screenOverlay = ge.createScreenOverlay('');
screenOverlay.setIcon(icon);

// Position the overlay.  ScreenXY(0,0) is mapped to OverlayXY(0,0)
var screenXY = screenOverlay.getScreenXY();
screenXY.setXUnits(ge.UNITS_PIXELS);
screenXY.setYUnits(ge.UNITS_PIXELS);
screenXY.setX(0);
screenXY.setY(0);

var overlayXY = screenOverlay.getOverlayXY();
overlayXY.setXUnits(ge.UNITS_PIXELS);
overlayXY.setYUnits(ge.UNITS_PIXELS);
overlayXY.setX(0);
overlayXY.setY(0);

// Set object's size in fractions of the 3d view window.  By setting
// to (1, 1), this image will cover the entire Earth window.
var overlaySize = screenOverlay.getSize()
overlaySize.setXUnits(ge.UNITS_FRACTION);
overlaySize.setYUnits(ge.UNITS_FRACTION);
overlaySize.setX(1);
overlaySize.setY(1);

// add the screen overlay to Earth
ge.getFeatures().appendChild(screenOverlay);
