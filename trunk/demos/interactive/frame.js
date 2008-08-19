// ===================================================================
// NOTE: This sample will not work if the page is loaded from local 
// disk (file://C/PATH...) because the Earth Browser Plug-in does not
// support loading local files from disk, for security reasons.
// ===================================================================

var screenOverlay = ge.createScreenOverlay('');

// Set the visibility to false while we construct the overlay.
screenOverlay.setVisibility(false);

// The plugin currently only accepts absolute URLs, so we retrieve the
// URL of the current page in order to construct an absolute URL for
// the PNG file we are about to fetch.
var href = window.location.href;
var pagePath = href.substring(0, href.lastIndexOf('/')) + '/';

var icon = ge.createIcon('');
icon.setHref(pagePath + "frame.png");  // Loads an gilded picture frame.
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

screenOverlay.setVisibility(true);

ge.getFeatures().appendChild(screenOverlay);
