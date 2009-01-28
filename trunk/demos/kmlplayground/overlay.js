// overlay.js
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

function updateIconOverlay(divId, type, value) {
  var obj = gFeatures[divId];
  obj.getIcon().setHref(gOverlayIconUrls[value]); 
  selectItemArray(divId, type, value, 3);
}

function updateColorOverlay(divId, type, value) {
  var obj = gFeatures[divId];
  var color = '#ff' + colorMap[value];
  obj.getColor().set(color);
  selectItemColor(divId, type, value);
}

// Helper to update geometry altitude mode
function updateGroundOverlayAltitudeMode(divId, type, value) {
  var obj = gFeatures[divId];
  var altitudeMode = {
    'clampToGround' : ge.ALTITUDE_CLAMP_TO_GROUND,
    'absolute' : ge.ALTITUDE_ABSOLUTE };
  obj.setAltitudeMode(altitudeMode[value]);
  selectItemGroundOverlayAltitudeMode(divId, type, value);
}

function updateIncreaseDecreaseGroundOverlay(divId, type, value) {
  var obj = gFeatures[divId];
  var valueMap = {
    'north' : 'obj.getLatLonBox()',
    'south' : 'obj.getLatLonBox()',
    'east' : 'obj.getLatLonBox()',
    'west' : 'obj.getLatLonBox()',
    'rotation' : 'obj.getLatLonBox()',
    'altitude' : 'obj'
  };
  var offset = 0;
  if (type == 'altitude')
    offset = checkForDecrease(value, 50);
  else if (type == 'rotation')
    offset = checkForDecrease(value, 20);
  else
    offset = checkForDecrease(value, 0.0005);
  var geObj = eval(valueMap[type]);
  var oldVal = geObj['get' + toUpperCaseFirstLetter(type)]();
  geObj['set' + toUpperCaseFirstLetter(type)](offset + oldVal);  
}

function updateIncreaseDecreaseScreenOverlay(divId, type, value) {
  var obj = gFeatures[divId];
  var valueMap = {
    'overlayX' : 'obj.getOverlayXY()',
    'overlayY' : 'obj.getOverlayXY()',
    'screenX' : 'obj.getScreenXY()',
    'screenY' : 'obj.getScreenXY()',
    'rotationX' : 'obj.getRotationXY()',
    'rotationY' : 'obj.getRotationXY()',
    'sizeX' : 'obj.getSize()',
    'sizeY' : 'obj.getSize()',
    'rotation' : 'obj' 
  };
  var geObj = eval(valueMap[type]);
  var offset = 0;
  if (type.indexOf('size') != -1) {
    offset = checkForDecrease(value, 10);
  } else if (type == 'rotation') {
    offset = checkForDecrease(value, 20);
  } else {
    offset = checkForDecrease(value, 0.05);
  } 

  if (type.indexOf('X') != -1) {
    geObj.setX(geObj.getX() + offset);
  } else if (type.indexOf('Y') != -1) {
    geObj.setY(geObj.getY() + offset);
  } else {
    var oldVal = geObj['get' + toUpperCaseFirstLetter(type)]();
    geObj['set' + toUpperCaseFirstLetter(type)](offset + oldVal);
  }    
}
