if (!('navControlCounter' in window)) {
  window.navControlCounter = -1;
}

var navControl = ge.getNavigationControl();
var screenXY = navControl.getScreenXY();

// We cycle through a different action each time this code
// is invoked, showing how to position the Navigation Control
// at different corners of the 3D window.
window.navControlCounter = (window.navControlCounter + 1) % 7;
if (navControlCounter == 0) {
  log('Showing control');
  navControl.setVisibility(ge.VISIBILITY_SHOW);
} else if (window.navControlCounter == 1) {
  log('Moving control to top left');
  screenXY.setXUnits(ge.UNITS_PIXELS);
  screenXY.setYUnits(ge.UNITS_INSET_PIXELS);  
} else if (window.navControlCounter == 2) {
  log('Moving control to bottom left');
  screenXY.setXUnits(ge.UNITS_PIXELS);
  screenXY.setYUnits(ge.UNITS_PIXELS);  
} else if (window.navControlCounter == 3) {
  log('Moving control to bottom right');
  screenXY.setXUnits(ge.UNITS_INSET_PIXELS);
  screenXY.setYUnits(ge.UNITS_PIXELS);  
} else if (window.navControlCounter == 4) {
  log('Moving control to top right');
  screenXY.setXUnits(ge.UNITS_INSET_PIXELS);
  screenXY.setYUnits(ge.UNITS_INSET_PIXELS);  
} else if (window.navControlCounter == 5) {
  log('Setting control visibility to "auto"');
  navControl.setVisibility(ge.VISIBILITY_AUTO);
} else if (window.navControlCounter == 6) {
  log('Hiding control');
  navControl.setVisibility(ge.VISIBILITY_HIDE);
}
