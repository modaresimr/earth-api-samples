// geowhiz.js
/*
Copyright 2008 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Sample geography game. 

// Globals
var latdt = 2.0;
var londt = 2.0;
var timedt = 50;
var firstrun = true;
var maxrange = 4500000.0;
var reticlelat = 2.0;
var reticlelon = 2.0;
var reticle;
var find_timeout = null;

// Clamps how far from the earth we will allow answers to be given. For
// example, a player can cheat by being super far from the earth that their
// answer is always correct.
function inRange(val, cmp, dt, range) {
  if (range > maxrange) 
    return false;

  // This function basically scales the allowable region based on distance
  // from the earth.
  dt = dt * range / maxrange;
  return (val >= cmp - dt && val <= cmp + dt) ? true : false;
}

// Polling function to see if the destination has been found.
window.findDestination = function(timeToFind, timedt) {
  // Clear last timeout if it exists
  if (find_timeout)
    clearTimeout(find_timeout);

  window.onUpdateCallback(timeToFind);
  window.updateReticle(); // Force update because the reticle lags
  if (timeToFind < 0)
    window.onTimeExpired(); // Callback
  else {
    var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    var lat = la.getLatitude();
    var lon = la.getLongitude();
    var range = la.getRange();

    // See if the center of the screen (reticle) region touches the city
    // the user is supposed to find.
    if (inRange(lat, window.findLat, latdt, range) &&
        inRange(lon, window.findLon, londt, range)) { 
      window.onFound(); // Callback
    } else { // Continue polling
      find_timeout =
          setTimeout('window.findDestination(' +
                    (timeToFind - timedt) + ','+timedt+')',
                    timedt);
    }
  }
}

// Function to find a specific destination
window.find = function(destination, timeToFind) {
  geocoder.getLatLng(destination, function(point) {
    if (point) { // Uses maps geocoder to find the lat/lon based on the string
      window.findLat = point.y;
      window.findLon = point.x;
    }
  });

  // Begin polling
  find_timeout =
      setTimeout('window.findDestination('+timeToFind+','+timedt+')',
                 timedt * 4);

}

// Update the center of the screen region. This is used to show to the user
// what the allowable region is.
window.updateReticle = function() {
  var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var lat   = la.getLatitude();
  var lon   = la.getLongitude();
  var alt   = la.getAltitude();
  var range = la.getRange();

  // Clamp the values based on range
  if (range > maxrange)
    range = maxrange;

  // Calculate region extents
  var sizelat = reticlelat * range / maxrange;
  var sizelon = reticlelon * range / maxrange;

  // Get the coords and update
  var coords = reticle.getGeometry().getOuterBoundary().getCoordinates();

  coords.setLatLngAlt(0, lat - sizelat, lon - sizelon, 0); 
  coords.setLatLngAlt(1, lat - sizelat, lon + sizelon, 0); 
  coords.setLatLngAlt(2, lat + sizelat, lon + sizelon, 0); 
  coords.setLatLngAlt(3, lat + sizelat, lon - sizelon, 0);
}

// Create the reticle object
window.createReticle = function() {
  // Placemarks basically hold geometry, so we use a polygon as an example
  // for the reticle. The reticle could have used a graphic, 3d object, etc.
  reticle = ge.createPlacemark('');
  reticle.setGeometry(ge.createPolygon(''));
  reticle.getGeometry().setOuterBoundary(ge.createLinearRing(''));
  ge.getFeatures().appendChild(reticle);

  // Square outer boundary
  var center = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

  var coords = reticle.getGeometry().getOuterBoundary().getCoordinates();
  var lat = center.getLatitude();
  var lon = center.getLongitude();
  coords.pushLatLngAlt(lat - .05, lon - .05, 0); 
  coords.pushLatLngAlt(lat - .05, lon + .05, 0); 
  coords.pushLatLngAlt(lat + .05, lon + .05, 0); 
  coords.pushLatLngAlt(lat + .05, lon - .05, 0); 

  reticle.setStyleSelector(ge.createStyle(''));
  reticle.getStyleSelector().getPolyStyle().getColor().set('660000ff');
  
  window.updateReticle();
}
