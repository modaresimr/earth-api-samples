// util.js
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

function toUpperCaseFirstLetter(str) {  
  return str.charAt(0).toUpperCase() + str.substring(1); 
}

function createIcon(link) {
  var icon = ge.createIcon('');
  icon.setHref(link);
  return icon;
}

function addQuotes(str) {
  return "\'" + str + "\'";
}

function setDefaultForTableRow(functionName, divId, type, value) {  
  var argList = [addQuotes(divId), addQuotes(type), addQuotes(value)];
  var evalString = functionName + '(' + argList.join(',') + ')';
  eval(evalString);  
}

function createItemText(divId, functionName, type, value, name) {
    return "<a href='javascript:void(0)' id='" + divId + type + value + "' " +
         "onclick=\"" + functionName + "('" + divId + 
         "', '" + type + "', '" + value + 
         "'); updateKmlOutput(); void(0);\">" + name + "</a>&nbsp;";
}

function setTextBackgroundColor(id, color) {
  document.getElementById(id).style.backgroundColor = color;
}

function selectItem(divId, type, value, select) {
  var color = select ? '#ffd700' : '#ffffff';
  setTextBackgroundColor(getItemId(divId, type, value), color);
}

function selectItemArray(divId, type, idSelect, size) {
  for (var i = 0; i <= size; ++i) {
    selectItem(divId, type, i, i == idSelect);
  }
}

function selectItemAltitudeMode(divId, type, value) {
  selectItem(divId, type, 'clampToGround', false);
  selectItem(divId, type, 'relativeToGround', false);
  selectItem(divId, type, 'absolute', false);
  selectItem(divId, type, value, true);
}
function selectItemColor(divId, type, value) {
  selectItem(divId, type, 'red', false);  
  selectItem(divId, type, 'green', false);
  selectItem(divId, type, 'blue', false);
  selectItem(divId, type, 'white', false);
  selectItem(divId, type, value, true);
}

function selectFeature(divId, select) {
  var color = select ? '#ffd700' : '#ffffff';
  setTextBackgroundColor(divId, color);
}

function createTitleText(title) {
  return title + ": ";
}

function getTableFromDivId(divId) {
  var tableId = divId + 'Table';
  return document.getElementById(tableId);  
}

function getItemId(divId, type, value) {
  return divId + type + value;
}

function showElement(elem, visible) {
  if (visible) {
    elem.style.visibility = 'visible';    
    elem.style.display = 'block';
  } else {
    elem.style.visibility = 'hidden';
    elem.style.display = 'none';  
  }
}
