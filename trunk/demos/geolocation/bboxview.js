/*
Copyright 2009 Google Inc.

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

/* Requires geojs (or GEarthExtensions from earth-api-utility-library) */

/**
 * Creates a best-fit KmlAbstractView of a geo.Bounds box.
 * @param {GEPlugin} pluginInstance The Google Earth Plugin instance.
 * @param {geo.Bounds} bounds The bounding box to view.
 * @param {Number} aspectRatio The aspect ratio (width:height) of the plugin
 *     instance.
 */
function createBoundsView(pluginInstance, bounds, aspectRatio) {
  var DEGREES = Math.PI / 180;
  
  var coords = [
      [bounds.north(), bounds.east()],
      [bounds.north(), bounds.west()],
      [bounds.south(), bounds.west()],
      [bounds.south(), bounds.east()]];

  // find center
  var center = bounds.getCenter();
  
  var lngSpan = geo.math.distance(
                    new geo.Point(center.lat(), bounds.east()),
                    new geo.Point(center.lat(), bounds.west()));
  var latSpan = geo.math.distance(
                    new geo.Point(bounds.north(), center.lng()),
                    new geo.Point(bounds.south(), center.lng()));
  
  if (!aspectRatio)
    aspectRatio = 1.0;

  var PAD_FACTOR = 1.5; // add 50% to the computed range for padding
  var beta;
  
  var aspectUse = Math.max(aspectRatio, Math.min(1.0, lngSpan / latSpan));
  var alpha = (45.0 / (aspectUse + 0.4) - 2.0) * DEGREES; // computed experimentally;
  
  // create LookAt using distance formula
  if (lngSpan > latSpan) {
    // polygon is wide
    beta = Math.min(90 * DEGREES, alpha + lngSpan / 2 / geo.math.EARTH_RADIUS);
  } else {
    // polygon is taller
    beta = Math.min(90 * DEGREES, alpha + latSpan / 2 / geo.math.EARTH_RADIUS);
  }

  range = PAD_FACTOR * geo.math.EARTH_RADIUS * (Math.sin(beta) *
    Math.sqrt(1 / Math.pow(Math.tan(alpha),2) + 1) - 1);
  
  range += Math.max(bounds.top(),
                    bounds.bottom());
  
  var la = pluginInstance.createLookAt('');
  la.set(center.lat(), center.lng(), 0,
         pluginInstance.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, range);
  return la;
}