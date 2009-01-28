// table.js
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

// This file contains the utility functions that help
// create/modify HTML tables for exposing KML object
// properties

// [+/-] link to show or hide a table
function showHideTable(linkId, tableDivId) {
  var table = document.getElementById(tableDivId);
  var href = document.getElementById(linkId);
  if (href.innerHTML == '+') {
    href.innerHTML = '-';
    showElement(table, true);
  } else {     
    href.innerHTML = '+';
    showElement(table, false);
  }  
}

function appendTableRow(divId, text) {
  var tr = document.createElement('tr');
  var td0 = document.createElement('td');
  var td1 = document.createElement('td');
  td0.innerHTML = '&nbsp;&nbsp;';
  td1.innerHTML = text;
  tr.appendChild(td0);
  tr.appendChild(td1);
  getTableFromDivId(divId).tBodies[0].appendChild(tr);
}

function appendTableRowString(divId, title, stringType, defaultVal,
                              functionName) {
  functionName = functionName || 'updateString';
  var innerText = createTitleText(title) +
    createItemText(divId, functionName, stringType, 'foo', 'foo') +
    createItemText(divId, functionName, stringType, 'hello', 'hello') +
    createItemText(divId, functionName, stringType, 'google', 'google');
  appendTableRow(divId, innerText);
  
  var evalString = '';
  if (defaultVal == 1) 
    setDefaultForTableRow(functionName, divId, stringType, 'foo');
  if (defaultVal == 2) 
    setDefaultForTableRow(functionName, divId, stringType, 'hello');
  if (defaultVal == 3) 
    setDefaultForTableRow(functionName, divId, stringType, 'google');
}

function appendTableRowColor(divId, title, colorType, defaultVal,
                             functionName) {
  functionName = functionName || 'updateColor';
  var innerTextColor = createTitleText(title) +
    createItemText(divId, functionName, colorType, 'red', 'Red') +
    createItemText(divId, functionName, colorType, 'green', 'Green') +
    createItemText(divId, functionName, colorType, 'blue', 'Blue') +
    createItemText(divId, functionName, colorType, 'white', 'White');
  appendTableRow(divId, innerTextColor);
  setDefaultForTableRow(functionName, divId, colorType, defaultVal);
}

function appendTableRowColorStyle(divId, colorFunction, colorModeFunction) {
  appendTableRowColor(divId, 'Color', 'color', 'white', colorFunction);
  
  colorModeFunction = colorModeFunction || 'updateColorMode';
  var type = 'colorMode';
  var innerTextColorMode = createTitleText('Color Mode') +
    createItemText(divId, colorModeFunction, type, 'normal', 'Normal') + 
    createItemText(divId, colorModeFunction, type, 'random', 'Random');
  appendTableRow(divId, innerTextColorMode);
  setDefaultForTableRow(colorModeFunction, divId, type, 'normal');
}

function appendTableRowIncreaseDecrease(divId, title, type, functionName) {
  functionName = functionName || 'increaseDecrease';
  var innerText = createTitleText(title) +
    createItemText(divId, functionName, type, 'increase', '+') + "/" +
    createItemText(divId, functionName, type, 'decrease', '-');
  appendTableRow(divId, innerText);     
}

function appendTableRowBool(divId, title, boolType, checked, functionName) {
  functionName = functionName || 'updateBool';
  var innerText = createTitleText(title) +
    "<input type=checkbox " + (checked ? "checked" : "") + 
    " onclick=\"" + functionName + "('" + divId + "', '" + boolType + 
    "', this.checked); updateKmlOutput(); void(0);\"/>Enable";    
  appendTableRow(divId, innerText);
}

function appendTableRowAltitudeMode(divId, functionName) {
  functionName = functionName || 'updateAltitudeMode';
  var innerText = createTitleText('AltitudeMode') + '<br>' +
    createItemText(divId, functionName, 'altitudeMode', 
                   'clampToGround', 'ClampToGround') + '<br>' +
    createItemText(divId, functionName, 'altitudeMode', 
                   'relativeToGround', 'RelativeToGround') + '<br>' +
    createItemText(divId, functionName, 'altitudeMode', 
                   'absolute', 'Absolute');
  appendTableRow(divId, innerText);
  setDefaultForTableRow(functionName, divId, 'altitudeMode', 'clampToGround');
}

function appendTableRowGroundOverlayAltitudeMode(divId, functionName) {
  functionName = functionName || 'updateAltitudeMode';
  var innerText = createTitleText('AltitudeMode') + '<br>' +
    createItemText(divId, functionName, 'altitudeMode', 
                   'clampToGround', 'ClampToGround') + '<br>' +
    createItemText(divId, functionName, 'altitudeMode', 
                   'absolute', 'Absolute');
  appendTableRow(divId, innerText);
  setDefaultForTableRow(functionName, divId, 'altitudeMode', 'clampToGround');
}

function appendTableRowAlignment(divId, title, alignType, functionName) {
  functionName = functionName || 'updateAligntment';
  var innerText = createTitleText(title) +
    createItemText(divId, functionName, alignType, 'CR', 'Center') +
    createItemText(divId, functionName, alignType, 'TL', 'TL') +  
    createItemText(divId, functionName, alignType, 'TR', 'TR') +  
    createItemText(divId, functionName, alignType, 'BL', 'BL') +  
    createItemText(divId, functionName, alignType, 'BR', 'BR');
  appendTableRow(divId, innerText);
  setDefaultForTableRow(functionName, divId, alignType, 'CR');
}

function appendTableRowNumbers(divId, title, type, max, 
                               defaultValue, functionName) {
  functionName = functionName || 'updateNumbers';
  var innerText = createTitleText(title);
  for (var i = 0; i <= max; ++i) {
    var iString = i.toString();
    innerText += createItemText(divId, functionName, type, iString, iString);
  }
  appendTableRow(divId, innerText);
  if (defaultValue != -1) {
    setDefaultForTableRow(functionName, divId, type, defaultValue);
  }
}

function appendTitleHtml(div, title, tableDivId) {
  var hrefId = title + 'showHide';
  div.innerHTML += 
    "[<a href='javascript:void(0)' id='" + hrefId + "' " +
    "onclick=\"showHideTable(this.id,'" +  tableDivId + "')\">-</a>] " + 
    "<b>" + title + " </b> ";  
  return hrefId;
}

function appendNewDivTable(parentDivId, newDivId, title, 
                           tableVisible, hideNewDiv) {
  var newDiv = document.createElement('div');  
  newDiv.id = newDivId;
  var parentDiv = document.getElementById(parentDivId);
  parentDiv.appendChild(newDiv);
  newDiv.appendChild(document.createElement('p'));
  
  var tableDivId = newDivId + 'Table';
  var hrefId = appendTitleHtml(newDiv, title, tableDivId);
  
  var newTable = document.createElement('table');
  newTable.id = tableDivId;
  newTable.appendChild(document.createElement('tbody'));  
  newDiv.appendChild(newTable);  
  if (!tableVisible)    
    showHideTable(hrefId, tableDivId);
  if (hideNewDiv)
    showElement(newDiv, false);
}

function appendTableRowNewDivTable(parentDivId, newDivId, title, 
                                   tableVisible, hideNewDiv) {
  var innerText = '<div id=' + newDivId + '></div>'
  appendTableRow(parentDivId, innerText);
  var newDiv = document.getElementById(newDivId);  
  
  var tableDivId = newDivId + 'Table';
  var hrefId = appendTitleHtml(newDiv, title, tableDivId);
  
  var newTable = document.createElement('table');
  newTable.id = tableDivId;
  newTable.appendChild(document.createElement('tbody'));  
  newDiv.appendChild(newTable);
  
  if (!tableVisible)    
    showHideTable(hrefId, tableDivId);
  if (hideNewDiv)
    showElement(newDiv, false);
}

function appendTableRowGeometry(divId, title) {
  var innerText = createTitleText(title) +
    createItemText(divId, 'updateGeometry', 'point', 
                   'point', 'Point') + 
    createItemText(divId, 'updateGeometry', 'lineString', 
                   'lineString', 'LineString') +
    createItemText(divId, 'updateGeometry', 'linearRing', 
                   'linearRing', 'LinearRing') + '<br>' +
    createItemText(divId, 'updateGeometry', 'polygon', 
                   'polygon', 'Polygon') +
    createItemText(divId, 'updateGeometry', 'model', 
                   'model', 'Model') +                 
    createItemText(divId, 'updateGeometry', 'multiGeometry', 
                   'multiGeometry', 'MultiGeometry');
  appendTableRow(divId, innerText);
  setDefaultForTableRow('updateGeometry', divId, 'point', 'point');
}

function appendTableRowStyles(divId, title) {
  var innerText = createTitleText(title) +
    createItemText(divId, 'updateStyles', 'style', 
                   'style', 'Style') + 
    createItemText(divId, 'updateStyles', 'styleMap', 
                   'styleMap', 'StyleMap');
  appendTableRow(divId, innerText);
  setDefaultForTableRow('updateStyles', divId, 'style', 'style');
}
