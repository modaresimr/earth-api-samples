// create an image for the screen overlay
var icon = ge.createIcon('');
icon.setHref('http://www.google.com/intl/en_ALL/images/logo.gif');

// create the screen overlay
var screenOverlay = ge.createScreenOverlay('');
screenOverlay.setIcon(icon);

// Set the point inside the overlay that is used as the positioning
// anchor point.
screenOverlay.getOverlayXY().setXUnits(ge.UNITS_FRACTION);
screenOverlay.getOverlayXY().setYUnits(ge.UNITS_FRACTION);
screenOverlay.getOverlayXY().setX(0.5);
screenOverlay.getOverlayXY().setY(0.5);

// Set screen position in fractions.
screenOverlay.getScreenXY().setXUnits(ge.UNITS_FRACTION);
screenOverlay.getScreenXY().setYUnits(ge.UNITS_FRACTION);
screenOverlay.getScreenXY().setX(Math.random());  // Random x.
screenOverlay.getScreenXY().setY(Math.random());  // Random y.

// Rotate around object's center point.
screenOverlay.getRotationXY().setXUnits(ge.UNITS_FRACTION);
screenOverlay.getRotationXY().setYUnits(ge.UNITS_FRACTION);
screenOverlay.getRotationXY().setX(0.5);
screenOverlay.getRotationXY().setY(0.5);

// Set object's size in pixels.
screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
screenOverlay.getSize().setX(300);
screenOverlay.getSize().setY(90);

// Rotate by a random number of degrees.
screenOverlay.setRotation(Math.random() * 360);

// add the screen overlay to Earth
ge.getFeatures().appendChild(screenOverlay);
