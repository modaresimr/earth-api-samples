// init.js
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

// This file handles the initialization of the application.
// It initializes the global objects, the HTML tables that
// expose KML attributes, and the default values for the KML
// attributes

// Initialize google earth plugin
function init() {
  // Clear the kml output for refreshes
  document.getElementById('kmlOutput').value = '';
  // Init the plugin
  google.earth.createInstance("map3d", initCB, failureCB);
}

// Initialize global objects that are features
function initFeatures() {
  // These features are parented to a folder
  gFolder = ge.createFolder('');
  ge.getGlobe().getFeatures().appendChild(gFolder);

  // Create placemark
  gFeatures['placemark'] = ge.createPlacemark('');
  gFeatures['placemark'].setStyleSelector(getCurrentStyle());
  gFolder.getFeatures().appendChild(gFeatures['placemark']);

  // Create screen overlay
  gFeatures['screenOverlay'] = ge.createScreenOverlay('');
  gFeatures['screenOverlay'].getSize().setX(100);
  gFeatures['screenOverlay'].getSize().setY(100);
  gFeatures['screenOverlay'].setIcon(ge.createIcon(''));
  gFolder.getFeatures().appendChild(gFeatures['screenOverlay']);

  // Create ground overlay
  gFeatures['groundOverlay'] = ge.createGroundOverlay('');
  gFeatures['groundOverlay'].setLatLonBox(ge.createLatLonBox(''));
  gFeatures['groundOverlay'].setIcon(ge.createIcon(''));
  var box = gFeatures['groundOverlay'].getLatLonBox();
  box.setNorth(gLLA[0] + 0.0025);
  box.setSouth(gLLA[0] - 0.0025);
  box.setEast(gLLA[1] + 0.0025);
  box.setWest(gLLA[1] - 0.0025);
  gFolder.getFeatures().appendChild(gFeatures['groundOverlay']);
}

// Initialize global objects that are style selectors
function initStyleSelectors() {
  // Create style
  gStyleSelector['style'] = ge.createStyle('');

  // Create stylemap
  var iconNormal = ge.createStyle('');
  iconNormal.getIconStyle().setIcon(ge.createIcon(''));
  var iconHighlight = ge.createStyle('');
  iconHighlight.getIconStyle().setIcon(ge.createIcon(''));
  gStyleSelector['styleMap'] = ge.createStyleMap('');
  gStyleSelector['styleMap'].setNormalStyle(iconNormal);
  gStyleSelector['styleMap'].setHighlightStyle(iconHighlight);
}

// Init camera to default location
function initCamera() {
  ge.getOptions().setFlyToSpeed(1000);
  var la = ge.createLookAt('');
  la.set(gLLA[0], gLLA[1], 99.99, ge.ALTITUDE_RELATIVE_TO_GROUND,
         0, 70, gLLA[2]);
  ge.getView().setAbstractView(la);
}

// Create HTML tables for the features
function initTableFeatures() {
  var feature;

  feature = 'placemark';
  appendNewDivTable('feature', feature, 'IKmlPlacemark', true);
  appendTableRowString(feature, 'Name', 'name', 1);
  appendTableRowString(feature, 'Description', 'description', 2);
  appendTableRowString(feature, 'Address', 'address', 3);
  appendTableRowBool(feature, 'Visibility', 'visibility', true);
  appendTableRowStyles(feature, 'StyleSelector');
  appendTableRowGeometry(feature, 'Geometry');

  feature = 'screenOverlay';
  appendNewDivTable('feature', feature, 'IKmlScreenOverlay', true);
  appendTableRowBool(feature, 'Visibility', 'visibility', true);
  appendTableRowColor(feature, 'Color', 'color', 'white', 'updateColorOverlay');
  appendTableRowNumbers(feature, 'Icon', 'icon', 3, 1, 'updateIconOverlay');
  appendTableRowIncreaseDecrease(feature, 'Overlay X', 'overlayX',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Overlay Y', 'overlayY',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Screen X', 'screenX',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Screen Y', 'screenY',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Rotation X', 'rotationX',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Rotation Y', 'rotationY',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Size X', 'sizeX',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Size Y', 'sizeY',
                                 'updateIncreaseDecreaseScreenOverlay');
  appendTableRowIncreaseDecrease(feature, 'Rotation', 'rotation',
                                 'updateIncreaseDecreaseScreenOverlay');

  feature = 'groundOverlay';
  appendNewDivTable('feature', feature, 'IKmlGroundOverlay', true);
  appendTableRowBool(feature, 'Visibility', 'visibility', true);
  appendTableRowColor(feature, 'Color', 'color', 'white', 'updateColorOverlay');
  appendTableRowNumbers(feature, 'Icon', 'icon', 3, 2, 'updateIconOverlay');
  appendTableRowIncreaseDecrease(feature, 'North', 'north',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowIncreaseDecrease(feature, 'South', 'south',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowIncreaseDecrease(feature, 'East', 'east',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowIncreaseDecrease(feature, 'West', 'west',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowIncreaseDecrease(feature, 'Rotation', 'rotation',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowIncreaseDecrease(feature, 'Altitude', 'altitude',
                                 'updateIncreaseDecreaseGroundOverlay');
  appendTableRowGroundOverlayAltitudeMode(feature,
                                 'updateGroundOverlayAltitudeMode');

  // Set default choice
  updateFeature('placemark');
}

// Create HTML tables for style selectors
function initTableStyleSelectors() {
  // Create table for Style
  appendNewDivTable('style', 'style', 'IKmlStyle', true);
  var style = 'iconStyle';
  appendTableRowNewDivTable('style', style, 'IKmlIconStyle', false, false);
  appendTableRowColorStyle(style);
  appendTableRowIncreaseDecrease(style, 'Scale', 'scale',
                                 'updateIncreaseDecreaseStyle');
  appendTableRowIncreaseDecrease(style, 'Heading', 'heading',
                                 'updateIncreaseDecreaseStyle');
  appendTableRowAlignment(style, 'HotSpot', 'hotSpot',
                          'updateIconStyleHotSpot');
  appendTableRowNumbers(style, 'Icon', 'icon', 2, 0, 'updateIconStyleIcon');
  style = 'labelStyle';
  appendTableRowNewDivTable('style', style, 'IKmlLabelStyle', false, false);
  appendTableRowColorStyle(style);
  appendTableRowIncreaseDecrease(style, 'Scale', 'scale',
                                 'updateIncreaseDecreaseStyle');
  style = 'lineStyle';
  appendTableRowNewDivTable('style', style, 'IKmlLineStyle', false, false);
  appendTableRowColorStyle(style);
  appendTableRowIncreaseDecrease(style, 'Width', 'width',
                                 'updateIncreaseDecreaseStyle');
  style = 'polyStyle';
  appendTableRowNewDivTable('style', style, 'IKmlPolyStyle', false, false);
  appendTableRowColorStyle(style);
  appendTableRowBool(style, 'Fill', 'fill', true);
  appendTableRowBool(style, 'Outline', 'outline', true);
  style = 'balloonStyle';
  appendTableRowNewDivTable('style', style, 'IKmlBalloonStyle', false, false);
  appendTableRowColor(style, 'BgColor', 'bgColor', 'white');
  appendTableRowColor(style, 'TextColor', 'textColor', 'blue');

  // Create table for StyleMap
  appendNewDivTable('styleMap', 'styleMap', 'IKmlStyleMap', true);
  appendTableRowNumbers('styleMap', 'Normal Icon', 'normal',
                        2, 1, 'updateStyleMap');
  appendTableRowNumbers('styleMap', 'Highlight Icon', 'highlight',
                        2, 1, 'updateStyleMap');
}

// Create HTML tables for geometries that can be attached to a placemark
function initTableGeometries() {
  var geometry;

  geometry = 'point';
  gGeometry[geometry] = new createPoint('geometry', geometry, 'IKmlPoint',
                                        false, gLLA[0], gLLA[1],
                                        true, true).object;
  geometry = 'lineString';
  gGeometry[geometry] = new createLineString('geometry', geometry,
                                             'IKmlLineString', false,
                                             gLLA[0], gLLA[1], 1,
                                             true, true).object;
  geometry = 'linearRing';
  gGeometry[geometry] = new createLinearRing('geometry', geometry,
                                             'IKmlLinearRing', false,
                                             gLLA[0], gLLA[1], 1,
                                             true, true).object;
  geometry = 'polygon';
  gGeometry[geometry] = new createPolygon('geometry', geometry,
                                          'IKmlPolygon', false,
                                          gLLA[0], gLLA[1], 1,
                                          true, true).object;
  geometry = 'model';
  gGeometry[geometry] = new createModel('geometry', geometry,
                                        'IKmlModel', false,
                                        gLLA[0], gLLA[1], 8,
                                        true, true).object;
  geometry = 'multiGeometry';
  gGeometry[geometry] = new createMultiGeometry('geometry', geometry,
                                                'IKmlMultiGeometry', false,
                                                gLLA[0], gLLA[1], 1,
                                                true, true).object;
}

// Options for the user to click on: parent folder visibility and
// the three features they can select
function initFolderAndFeatureDiv() {
  var div = document.getElementById('folderAndFeatureSelection');
  var divText =
    "Parent Folder Visibility:" +
    "<input type=checkbox checked onclick='folderVis(this.checked)'/>" +
    "<br>" +
    "<br>Select Feature: " +
    " <a href='#' onclick=\"updateFeature('placemark'); void(0);\"" +
    "  id='placemarkSelect'>Placemark</a>" +
    " <a href='#' onclick=\"updateFeature('screenOverlay'); void(0);\"" +
    "  id='screenOverlaySelect'>ScreenOverlay</a>" +
    " <a href='#' onclick=\"updateFeature('groundOverlay'); void(0);\"" +
    "  id='groundOverlaySelect'>GroundOverlay</a>";
  div.innerHTML = divText;
}

// Init callback
function initCB(object) {
  ge = object;
  ge.getWindow().setVisibility(true);

  initFolderAndFeatureDiv();
  initCamera();
  initStyleSelectors();
  initFeatures();

  initTableGeometries();
  initTableStyleSelectors();
  initTableFeatures();
}

// Failure callback
function failureCB(object) {
  /***
   * This function will be called if plugin fails to load, in case
   * you need to handle that error condition.
   ***/
}
