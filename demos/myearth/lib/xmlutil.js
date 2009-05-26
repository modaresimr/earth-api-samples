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

/**
 * @fileoverview Contains some helper methods for dealing with XML and XML/JSON
 * conversion in the browser. These methods were designed for working with the
 * JS GData client library, but can likely be adopted for other uses.
 * @author api.roman.public@gmail.com (Roman Nurik)
 */
 
/**
 * Parses a string of XML into a browser XML DOM node.
 * @param {string} xml The XML string to parse.
 * @return {Node} The node, representing either the parsed XML or
 *     <parsererror>'s that occurred.
 */
function parseXml(xml) {
  var xmlDoc;
  try {
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = false;
    xmlDoc.loadXML(xml);
  } catch (e) {
    xmlDoc = (new DOMParser).parseFromString(xml, 'text/xml');
  }

  return xmlDoc;
}

/**
 * Converts a qualified XML name such as 'atom:summary' into its equivalent
 * JSON-friendly name such as 'atom$summary'. Optionally applies a given
 * namespace if none is defined.
 * @param {string} name The qualified node name.
 * @param {string} [opt_namespace] An optional namespace to apply to the given
 *     name. If name is 'xmlns', the namespace is applied after the name,
 *     producing something like 'xmlns$foo'.
 */
function jsonifyName_(name, opt_namespace) {
  name = name.replace(/:/g, '$');
  if (name.indexOf('$') < 0 && opt_namespace) {
    if (name == 'xmlns')
      name = name + '$' + opt_namespace;
    else
      name = opt_namespace + '$' + name;
  }
  
  return name;
}

/**
 * Converts an XML node into its JSON representation, optionally applying
 * a namespace to each element under the DOM.
 * @param {Node} xmlNode The XML node to convert to JSON.
 * @param {string} [opt_namespace] An optional namespace to apply to the
 *     resulting JSON.
 * @return {string} A JS object representing the given node.
 */
function xmlNodeToJson(xmlNode, opt_namespace) {
  var obj = {};
  var i = 0;

  var textContent = [];
  
  if (xmlNode.attributes) {
    for (i = 0; i < xmlNode.attributes.length; i++) {
      obj[jsonifyName_(xmlNode.attributes[i].nodeName, opt_namespace)] =
          xmlNode.attributes[i].nodeValue;
    }
  }
  
  if (xmlNode.firstChild) {
    for (i = 0; i < xmlNode.childNodes.length; i++) {
      var child = xmlNode.childNodes[i];
      var jsName = jsonifyName_(child.nodeName, opt_namespace);
      
      switch (child.nodeType) {
        case 4: // cdata
        case 3: //text
          textContent.push(child.nodeValue);
          break;
        
        case 2: // attribute
          obj[jsName] = child.nodeValue;
          break;
        
        case 1: // element
          var childJson = xmlNodeToJson(child, opt_namespace);
          if (jsName in obj) {
            if (typeof obj[jsName] == 'object' && 'splice' in obj[jsName] &&
                typeof obj[jsName].length == 'number') {
              obj[jsName].push(childJson);
            } else {
              obj[jsName] = [obj[jsName], childJson];
            }
          } else {
            obj[jsName] = childJson;
          }
          break;
      }
    }
  }
  
  if (textContent.length) {
    textContent = textContent.join('');
    if (!textContent.match(/^\s+$/))
      obj.$t = textContent.replace(/^\s+/, ' ').replace(/\s+$/, ' ');
  }
  
  return obj;
}

/**
 * Helper function to dump the contents of the given object into a
 * human-readable hierarchical representation string.
 * @param {object} o The object to dump.
 * @param {number} [max] The maximum recursion/nesting level to dump in the
 *     object's hierarchy.
 */
function repr(o, max) {
  if (!max)
    max = 100;
  
  var getRepr;
  _repr = function(o, indlevel) {
    var ind = '';
    for (var i = 0; i < indlevel; i++)
      ind += '  ';
    
    str = '';
    for (var k in o) {
      str += ind + k + ' = ';
      if (!o[k]) {
        str += o[k];
      } else if (typeof o[k] == 'object') {
        if (indlevel + 1 >= max) {
          str += "<object>";
        } else {
          if ('splice' in o[k] && typeof o[k].length == 'number') {
            str += "[\n" + _repr(o[k], indlevel + 1) + ind + "]";
          } else {
            str += "{\n" + _repr(o[k], indlevel + 1) + ind + "}";
          }
        }
      } else if (typeof o[k] == 'function') {
        str += '<function>';
      } else {
        if (typeof o[k] == 'string') {
          str += '"' + o[k] + '"';
        } else {
          str += o[k].toString();          
        }
      }
      
      str += '\n';
    }
    
    return str;
  };
  
  return _repr(o, 0);
}