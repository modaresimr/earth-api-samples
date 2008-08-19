// geometry.js  -- Copyright Google 2008
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

//-----------------------------------------------------------------------------
// Object Map
//-----------------------------------------------------------------------------

// The functions are used to register geometry objects and find them
var gObjects = {};

function registerObject(id, obj) {
  gObjects[id] = obj;
  obj.id = id;
}

function findObject(name) {
  return gObjects[name];
}

//-----------------------------------------------------------------------------
// KmlGeometry
//-----------------------------------------------------------------------------

// Map/Function used to select geometry
var gGeometry = { 'point'         : null, 
                  'lineString'    : null,
                  'linearRing'    : null,
                  'polygon'       : null,
                  'multiGeometry' : null,
                  'model'         : null };
                  
function updateGeometry(divId, type, value) {
  gFeatures['placemark'].setGeometry(gGeometry[type]);
  
  // Update screen selection
  selectGeometry(divId, 'point', 'point', false);
  selectGeometry(divId, 'lineString', 'lineString', false);
  selectGeometry(divId, 'linearRing', 'linearRing', false);
  selectGeometry(divId, 'polygon', 'polygon', false);
  selectGeometry(divId, 'multiGeometry', 'multiGeometry', false);
  selectGeometry(divId, 'model',    'model', false);
  selectGeometry(divId, type, value, true);    
}

function selectGeometry(divId, type, value, select) {  
  selectItem(divId, type, value, select);
  showElement(document.getElementById(value), select);
}
                 
// Helper to update geometry bools
function updateGeometryBool(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;  
  geObj['set' + toUpperCaseFirstLetter(type)](value);
}

// Helper to update geometry altitude mode
function updateGeometryAltitudeMode(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  var altitudeMode = {
    'clampToGround' : ge.ALTITUDE_CLAMP_TO_GROUND,
    'relativeToGround' : ge.ALTITUDE_RELATIVE_TO_GROUND,
    'absolute' : ge.ALTITUDE_ABSOLUTE };
  geObj.setAltitudeMode(altitudeMode[value]);
  selectItemAltitudeMode(divId, type, value);
}

// Helper to update geometry lat, lon, alt                  
function increaseDecreaseLLA(pt, type, value) {
    // lat/lon treated with same offset, altitude is different
    var addll = checkForDecrease(value, 0.0005);
    var adda  = checkForDecrease(value, 50);
    if (type == 'latitude') pt.setLatitude(pt.getLatitude() + addll);
    if (type == 'longitude') pt.setLongitude(pt.getLongitude() + addll);
    if (type == 'altitude') pt.setAltitude(pt.getAltitude() + adda);
}

function createDivOrTableRow(parentId, id, title, isTable, 
                             visible, hideNewDiv) {
  if (isTable) {
    appendTableRowNewDivTable(parentId, id, title, visible, hideNewDiv);
  } else {
    appendNewDivTable(parentId, id, title, visible, hideNewDiv);    
  }                                                            
}

//-----------------------------------------------------------------------------
// KmlPoint
//-----------------------------------------------------------------------------

function createPoint(parentId, id, title, isTable, cLat, cLon, 
                     visible, hideNewDiv, functionName) {
  createDivOrTableRow(parentId, id, title, isTable, visible, hideNewDiv);
  
  var me = this;
  me.object = ge.createPoint('');
  me.object.setLatitude(cLat);
  me.object.setLongitude(cLon);
  me.object.setAltitude(0);          
  registerObject(id, me);  
    
  appendTableRowIncreaseDecrease(id, 'Latitude', 'latitude',
                                 'updateIncreaseDecreasePoint');
  appendTableRowIncreaseDecrease(id, 'Longitude', 'longitude',
                                 'updateIncreaseDecreasePoint');
  appendTableRowIncreaseDecrease(id, 'Altitude', 'altitude',
                                 'updateIncreaseDecreasePoint');
  appendTableRowBool(id, 'Extrude', 'extrude', false, 'updateGeometryBool');
  appendTableRowBool(id, 'Tessellate', 'tessellate', false, 
                     'updateGeometryBool');  
  appendTableRowAltitudeMode(id, 'updateGeometryAltitudeMode');
  return me;                       
}

function updateIncreaseDecreasePoint(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  increaseDecreaseLLA(geObj, type, value);
}

//-----------------------------------------------------------------------------
// KmlLineString / KmlLinearRing
//-----------------------------------------------------------------------------

function createLinearRing(parentId, id, title, isTable, cLat, cLon, 
                          size, visible, hideNewDiv, functionName) {
  return new createCoordObject(parentId, id, title, 'LinearRing', 
                           isTable, cLat, cLon, size, visible, 
                           hideNewDiv, functionName);
}

function createLineString(parentId, id, title, isTable, cLat, cLon, 
                          size, visible, hideNewDiv, functionName) {
  return new createCoordObject(parentId, id, title, 'LineString', 
                               isTable, cLat, cLon, size, visible, 
                               hideNewDiv, functionName);
}

function createCoordObject(parentId, id, title, creator, isTable, cLat, cLon, 
                           scale, visible, hideNewDiv, functionName) {
  createDivOrTableRow(parentId, id, title, isTable, visible, hideNewDiv);
  
  var me = this;  
  var latAdd = scale * 0.003;
  var lonAdd = scale * 0.003;
  me.points = new Array();  
  me.points[3] = [cLat + latAdd, cLon + lonAdd];
  me.points[2] = [cLat - latAdd, cLon + lonAdd];
  me.points[1] = [cLat - latAdd, cLon - lonAdd];
  me.points[0] = [cLat + latAdd, cLon - lonAdd];
  me.points[4] = [cLat + 2 * latAdd, cLon];
  me.altitude = 0;  
  me.object = ge['create' + creator]('');
  me.pointLength = 0;
  registerObject(id, me);
      
  appendTableRowNumbers(id, 'Num Points', 'points', 5, 3, 'updateCoordPoints');
  appendTableRowBool(id, 'Extrude', 'extrude', false, 'updateGeometryBool');
  appendTableRowBool(id, 'Tessellate', 'tessellate', false, 
                     'updateGeometryBool');  
  appendTableRowAltitudeMode(id, 'updateGeometryAltitudeMode');
  appendTableRowIncreaseDecrease(id, '<i>Altitude</i>', 'altitude',
                                'updateCoordAltitude');  
  return me;
}

function updateCoordPoints(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  
  var coords = geObj.getCoordinates();
  var points = obj.points;
  
  var currLength = obj.pointLength;
  var newLength = parseInt(value);

  if (currLength > newLength) {
    while (currLength > newLength) {
      coords.pop(); // remove element
      currLength = currLength - 1;
    }
  } else {
    while (currLength < newLength) {
      var point = points[currLength];      
      coords.pushLatLngAlt(point[0], point[1], obj.altitude); 
      currLength = currLength + 1;
    }
  }
  obj.pointLength = newLength;
  selectItemArray(divId, type, value, 5);
}

function updateCoordAltitude(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  var coords = geObj.getCoordinates();
  var offset = 50;
  if (value == 'decrease')
    offset = -offset;
  obj.altitude += offset;

  for (var i = 0; i < obj.pointLength; ++i) {
    var coord = coords.get(i);
    coord.setAltitude(obj.altitude);
    coords.set(i, coord);
  }
}

//-----------------------------------------------------------------------------
// KmlPolygon
//-----------------------------------------------------------------------------

function createPolygon(parentId, id, title, isTable, cLat, cLon, 
                       scale, visible, hideNewDiv, functionName) {
  createDivOrTableRow(parentId, id, title, isTable, visible, hideNewDiv);
  var me = this;
  me.object = ge.createPolygon('');
  registerObject(id, me);  
  
  appendTableRowBool(id, 'Extrude', 'extrude', 
                     false, 'updateGeometryBool');
  appendTableRowBool(id, 'Tessellate', 'tessellate', 
                     false, 'updateGeometryBool');
  appendTableRowAltitudeMode(id, 'updateGeometryAltitudeMode');
  
  // Create outer Boundary
  appendTableRowNumbers(id, '<b>Outer Boundary</b>', 
                        'outerBoundary', 1, -1, 'updatePolygonNumbers');  
                         
  me.outerBoundary = createLinearRing(id, id + 'outer', 
                     'OuterBoundary LinearRing', true, 
                     cLat, cLon, scale, true, true);
  updatePolygonNumbers(id, 'outerBoundary', '1');
  
  // Create inner Boundary
  appendTableRowNumbers(id, '<b>Inner Boundaries</b>', 
                        'innerBoundary', 3, -1, 'updatePolygonNumbers');  
  var offset = 0.002 * scale;
  cLat = cLat - offset; 
  scale = 0.1 * scale;
  me.innerBoundaryLength = 0;
  me.innerBoundary = new Array;
  me.innerBoundary[0] = createLinearRing(id, id + 'inner0', 
                        'InnerBoundary LinearRing:0', true, 
                        cLat, cLon - offset, scale, true, true);
  me.innerBoundary[1] = createLinearRing(id, id + 'inner1', 
                        'InnerBoundary LinearRing:1', true, 
                        cLat, cLon, scale, true, true);
  me.innerBoundary[2] = createLinearRing(id, id + 'inner2', 
                        'InnerBoundary LinearRing:2', true, 
                        cLat, cLon + offset, scale, true, true);
  updatePolygonNumbers(id, 'innerBoundary', '1');
  return me;
}

function updatePolygonNumbers(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  
  // If it's outer, set the outer linear ring to null or the object's outr
  if (type.indexOf('outer') != -1) {
    var visible = value > 0 ? true : false;
    var elem = document.getElementById(divId + 'outer'); 
    showElement(elem, visible);    
    geObj.setOuterBoundary(visible == true ? obj.outerBoundary.object : null);
    selectItemArray(divId, type, value, 1);   
  }
  
  // If it's inner, set the linear rings
  if (type.indexOf('inner') != -1) {        
    for (var i = 0; i < value; ++i) {
      var elem = document.getElementById(divId + 'inner' + i);
      showElement(elem, true);     
    }
    for (; i < 3; ++i) {
      var elem = document.getElementById(divId + 'inner' + i);
      showElement(elem, false);     
    }      
    
    // Update the linear rings based on the new size
    var currLength = obj.innerBoundaryLength;
    var newLength = parseInt(value);
    var innerBoundaries = geObj.getInnerBoundaries();

    if (currLength > newLength) {
      while (currLength > newLength) {
        currLength = currLength - 1;
        var boundary = obj.innerBoundary[currLength].object;
        innerBoundaries.removeChild(boundary); // remove element        
      }
    } else {
      while (currLength < newLength) {
        var boundary = obj.innerBoundary[currLength].object;      
        innerBoundaries.appendChild(boundary); // push new element  
        currLength = currLength + 1;
      }
    }
    obj.innerBoundaryLength = newLength;
    selectItemArray(divId, type, value, 3);
  }  
}

//-----------------------------------------------------------------------------
// KmlModel
//-----------------------------------------------------------------------------

function createModel(parentId, id, title, isTable, cLat, cLon, 
                     scale, visible, hideNewDiv, functionName) {
  createDivOrTableRow(parentId, id, title, isTable, visible, hideNewDiv);
  
  var me = this;
  registerObject(id, me);
  me.links = new Array();
  me.links[0] = createModelLink(gModelUrls[0]);
  me.links[1] = createModelLink(gModelUrls[1]);
  me.links[2] = createModelLink(gModelUrls[2]);
  me.object = ge.createModel('');
  me.object.getLocation().setLatitude(cLat);
  me.object.getLocation().setLongitude(cLon);
  me.object.getLocation().setAltitude(0);
  me.object.getScale().setX(scale);
  me.object.getScale().setY(scale);
  me.object.getScale().setZ(scale);    
    
  appendTableRowNumbers(id, 'Link', 'link', 3, 1, 'updateModelNumbers');  
  appendTableRowIncreaseDecrease(id, 'Latitude', 'latitude',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Longitude', 'longitude',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Altitude', 'altitude',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Heading', 'heading',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Tilt', 'tilt',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Roll', 'roll',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Scale X', 'scaleX',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Scale Y', 'scaleY',
                                 'updateIncreaseDecreaseModel');
  appendTableRowIncreaseDecrease(id, 'Scale Z', 'scaleZ',
                                 'updateIncreaseDecreaseModel');
  appendTableRowAltitudeMode(id, 'updateGeometryAltitudeMode');  
  return me;
}

function createModelLink(link) {
  var retObj = ge.createLink('');
  var href = window.location.href; 
  var pagePath = href.substring(0, href.lastIndexOf('/')) + '/';
  retObj.setHref(pagePath + link);
  return retObj;
}

function updateIncreaseDecreaseModel(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  var typeMap = {
    latitude : 'geObj.getLocation()',
    longitude : 'geObj.getLocation()',
    altitude : 'geObj.getLocation()',
    heading : 'geObj.getOrientation()',
    tilt : 'geObj.getOrientation()',
    roll : 'geObj.getOrientation()',
    scaleX : 'geObj.getScale()',
    scaleY : 'geObj.getScale()',
    scaleZ : 'geObj.getScale()'    
  };
  var subObj = eval(typeMap[type]);
  
  var offset = 0;
  var oldVal = 0;
  var setFunction = 0;
  if (subObj.getType() == "KmlScale") {
    type = type.substr(type.length - 1, 1);
    oldVal = subObj['get' + toUpperCaseFirstLetter(type)]();
    subObj['set' + toUpperCaseFirstLetter(type)](
      oldVal + checkForDecrease(value, 1));
  }
  else if (subObj.getType() == "KmlLocation") {
    increaseDecreaseLLA(subObj, type, value);
  }
  else if (subObj.getType() == "KmlOrientation") {
    oldVal = subObj['get' + toUpperCaseFirstLetter(type)]();
    subObj['set' + toUpperCaseFirstLetter(type)](
      oldVal + checkForDecrease(value, 20));    
  }
}

function updateModelNumbers(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;

  if (value == 0) {
    geObj.setLink(0);
  } else {
    geObj.setLink(obj.links[parseInt(value) - 1]);
  }
  selectItemArray(divId, type, value, 3);  
}

//-----------------------------------------------------------------------------
// KmlMultiGeometry
//-----------------------------------------------------------------------------

function createMultiGeometry(parentId, id, title, isTable, cLat, cLon, 
                             scale, visible, hideNewDiv, functionName) {
  createDivOrTableRow(parentId, id, title, isTable, visible, hideNewDiv);
  appendTableRowNumbers(id, 'MultiGeometry', 
                        'multigeometry', 5, -1, 'updateMultiGeometry');
                          
  var me = this; 
  me.object = ge.createMultiGeometry('');
  registerObject(id, me);
  me.geomLength = 0; 
  me.geoms = new Array();
  var offset = 0.0025;  
  me.geoms[0] = new createPoint(id, id + 'point', 'Geom 1 - Point', true, 
                                gLLA[0], gLLA[1], true, true);                
  me.geoms[1] = new createLineString(id, id + 'lineString', 
                                     'Geom 2 - LineString', true, 
                                     gLLA[0] + offset, gLLA[1] + offset,
                                     0.25, true, true);
  me.geoms[2] = new createLinearRing(id, id + 'linearRing', 
                                     'Geom 3 - LinearRing', true, 
                                     gLLA[0] + offset, gLLA[1] - offset,
                                     0.25, true, true);
  me.geoms[3] = new createPolygon(id, id + 'polygon', 
                                  'Geom 4 - Polygon', true, 
                                  gLLA[0] - offset, gLLA[1] + offset, 
                                  0.25, true, true);
  me.geoms[4] = new createModel(id, id + 'model', 
                                'Geom 5 - Model', true, 
                                gLLA[0] - offset, gLLA[1] - offset,  
                                4, true, true);              
  updateMultiGeometry(id, 'multigeometry', 1);
  return me;                            
}

function updateMultiGeometry(divId, type, value) {
  var obj = findObject(divId); 
  var geObj = obj.object;
  var geoms = obj.geoms;
  var currLength = obj.geomLength;
  var newLength = parseInt(value);
  if (currLength > newLength) {
    while (currLength > newLength) {
      currLength = currLength - 1;
      var geom = obj.geoms[currLength];
      geObj.getGeometries().removeChild(geom.object); // remove element      
      showElement(document.getElementById(geom.id), false);      
    }
  } else {
    while (currLength < newLength) {
      var geom = geoms[currLength];  
      geObj.getGeometries().appendChild(geom.object);
      currLength = currLength + 1;
      showElement(document.getElementById(geom.id), true);
    }
  }
  obj.geomLength = newLength;
  selectItemArray(divId, type, value, 5);
}
