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
 * @fileoverview This is the main JS file for the My Earth demo application.
 * Most of the code is highly application-specific. There are some useful
 * 'geometry toolbox' and generic helper functions at the bottom.
 * @author api.roman.public@gmail.com (Roman Nurik)
 */

/* global constants */
var MAIN_TITLE = 'My Earth';

var MAPS_SCOPE = 'http://maps.google.com/maps/feeds/';
var MAPS_MAIN_FEED = 'http://maps.google.com/maps/feeds/maps/default/full';

var MARKER_DRAG_TARGET = {
  icon: 'http://maps.google.com/mapfiles/kml/shapes/cross-hairs.png',
  overlayXY: { left: '50%', top: '50%' },
  screenXY: { left: 0, top: 0 },
  size: { left: 32, bottom: 32 }
};

var DEFAULT_FEATURE_STYLE = {
  icon: {
    href: 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png',
    hotSpot: { bottom: 0, left: '50%' }
  },
  line: {
    width: 5,
    color: 'blue',
    opacity: 0.5
  },
  poly: {
    color: 'blue',
    opacity: 0.5
  }
};

/* global variables */

var g_ge;  // GEPlugin
var g_gex;  // GEarthExtensions
var g_containerEarthObject;  // KmlDocument

var g_mapsService;  // google.gdata.maps.MapsService
var g_token;  // String

var g_myMaps = {};  // id -> app-specific my map object literal
var g_currentMyMapId;  // String id of currently open my map
var g_features;  // Array of object literals describing features in the current
                 // my map

var g_dirty;  // Boolean whether or not the current map has been modified
var g_editing;  // Boolean whether or not we are in editing mode
var g_geometryToolbox = null;  // app specific object literal containing info
                               // about the geometry tools

/**
 * Called when the DOM is ready and all libraries have been loaded.
 */
function init() {
  if (document.location.hash && document.location.hash != '#')
    $('#not-logged-in-text').text('Loading...');
  
  // set up user panel
  g_token = google.accounts.user.checkLogin(MAPS_SCOPE);
  if (!g_token) {
    $('.guestonly').show();
    return;
  }
  
  $('.needsauth').show();
  
  g_mapsService = new google.gdata.maps.MapsService('com.google.myearth');
  g_mapsService.getMapFeed(MAPS_MAIN_FEED, function(mapFeedRoot) {
    // populate the my maps array
    var myMaps = [];

    var mapEntries = mapFeedRoot.feed.getEntries();
    for (var i = 0; i < mapEntries.length; i++) {
      if (!mapEntries[i].getEditLink() ||
          !mapEntries[i].getEditLink().href)
        continue;

      var myMap = {
        id: mapEntries[i].getId().$t,
        title: mapEntries[i].getTitle().$t,
        description: mapEntries[i].getContent() ?
            mapEntries[i].getContent().$t : null,
        editLinkHref: mapEntries[i].getEditLink().href,
        featureFeedHref: mapEntries[i].content.src
      };
      
      // postprocessing/cleanup
      myMap.featureFeedHref = myMap.featureFeedHref
      
      g_myMaps[mapEntries[i].id.$t] = myMap;
      myMaps.push(myMap);
    }
    
    myMaps.sort(function(x, y){ return x.title > y.title });
    
    // create the available maps UI
    for (var i = 0; i < myMaps.length; i++) {    
      $('#map-list').append($('<option>')
                                .val(myMaps[i].id)
                                .text(myMaps[i].title));
    }
    
    if (g_ge)
      $('#map-list').removeAttr('disabled');
    
    $('#map-list').change(function() {
      var mapId = $('#map-list').val();
      if (mapId && g_myMaps[mapId])
        loadMap(mapId);
    });

  }, showGDataError);

  // load earth
  google.earth.createInstance('map3d', function(pluginInstance) {
    g_ge = pluginInstance;
    g_gex = new GEarthExtensions(g_ge);
    
    g_ge.getWindow().setVisibility(true);
    g_ge.getNavigationControl().setVisibility(g_ge.VISIBILITY_SHOW);
    
    for (var k in g_myMaps) {
      $('#map-list').removeAttr('disabled');
      break;
    }
    
    //createGeometryToolbox();
  }, function(errorCode) { });
}

/**
 * Asks the user to provide access to his/her My Maps via AuthSub. If already
 * authenticated, does nothing.
 */
function login() {
  google.accounts.user.login(MAPS_SCOPE);
}

/**
 * Logs the user out, and destroys any AuthSub tokens related to the My Maps
 * scope for this application.
 */
function logout() {
  google.accounts.user.logout();
  window.location.reload();
}

/**
 * Shows an error notification to the user representing the given error.
 */
function showGDataError(e) {
  $('#error-message').html('Error: ' + (e.cause ? e.cause.statusText
                                                : e.message));
  $('#error-message').show();
  $('#loading-image').hide();
}

/**
 * Hides any currently shown error notifications.
 */
function hideErrors() {
  $('#error-message').hide();
}

/**
 * Loads the map with the given ID.
 */
function loadMap(mapId) {
  $('#loading-image').show();
  
  // clear the old stuff
  document.title = MAIN_TITLE;
  hideErrors();
  $('#feature-list').html('');
  $('#edit-buttons').html('');
  
  g_features = [];
  g_dirty = false;
  g_editing = false;
  
  if (g_containerEarthObject) {
    g_containerEarthObject.setVisibility(false);
    g_ge.getFeatures().removeChild(g_containerEarthObject);
    g_containerEarthObject = null;
  }
  
  // bring in the new stuff
  var myMap = g_myMaps[mapId];
  g_mapsService.getFeatureFeed(myMap.featureFeedHref,
                               function(featureFeedRoot) {
    var feed = featureFeedRoot.feed;
    g_currentMyMapId = mapId;
    
    document.title = myMap.title + ' - ' + MAIN_TITLE;
    
    // build the features array
    var featureEntries = feed.getEntries();
    for (var i = 0; i < featureEntries.length; i++) {
      // preprocessing/cleanup
      var kml = featureEntries[i].getContent().$t || '';
    
      var feature = {
        id: featureEntries[i].getId().$t,
        title: featureEntries[i].getTitle().$t,
        kml: kml,
        editLinkHref: featureEntries[i].getEditLink().href
      };
    
      g_features.push(feature);
    }
    
    // create the container document
    g_containerEarthObject = g_ge.createDocument('');
    
    // build the UI and actual Earth objects for the features in this my map
    for (var i = 0; i < g_features.length; i++) {
      var feature = g_features[i];
      
      // create the Earth object
      var featureEarthObject = null;
      try {
        featureEarthObject = g_ge.parseKml(feature.kml);
      } catch (e) {}
      
      if (featureEarthObject) {
        // add a default style if no style is present or if the feature's style
        // is degenerate
        if (!featureEarthObject.getStyleSelector() ||
            !featureEarthObject.getStyleSelector().getIconStyle().getIcon() ||
            !featureEarthObject.getStyleSelector().getIconStyle()
                .getIcon().getHref()) {
          featureEarthObject.setStyleSelector(
              g_gex.dom.buildStyle(DEFAULT_FEATURE_STYLE));
        }
        
        g_containerEarthObject.getFeatures().appendChild(featureEarthObject);
        feature.earthObject = featureEarthObject;
        
        if (!featureEarthObject.getGeometry())
          continue;
        
        var geomType = featureEarthObject.getGeometry().getType();
        
        switch (geomType) {
          case 'KmlPoint':
            feature.type = 'marker';
            break;

          case 'KmlLineString':
          case 'KmlLinearRing':
            feature.type = 'line';
            break;

          case 'KmlPolygon':
            feature.type = 'poly';
            break;
        }
      }
      
      // create the left panel UI
      $('#feature-list').append(createFeaturePanelNode(feature));
    }
        
    // create edit buttons and make features editable
    updateEditUI();
    
    // finish off by flying to the overview of the my map
    g_ge.getFeatures().appendChild(g_containerEarthObject);
    flyToFeature(g_containerEarthObject);
    
    $('#loading-image').hide();
  }, showGDataError);
}

/**
 * Creates a left-panel HTML DOM node for the given feature, as a <li>.
 */
function createFeaturePanelNode(feature) {
  if (!feature.earthObject)
    return null;
  
  feature.panelNode = $('<li><div class="basics"><div><a href="#">' +
                            '<span class="title"></span></a></div>' +
                            '<div class="description"></div></div></li>')
      .css('cursor', 'pointer')
      .click(function(feature) {
        return function() {
          showFeatureBalloon(feature);
          flyToFeature(feature.earthObject);
          return false;
        };
      }(feature));
  
  updateFeaturePanelNode(feature);
  
  return feature.panelNode.get(0);
}

/**
 * Creates a 32x32 icon HTML DOM node representing the given feature.
 */
function createFeatureIconNode(feature) {
  if (!feature.earthObject ||
      !('getGeometry' in feature.earthObject))
    return null;
    
  var geomType = feature.earthObject.getGeometry().getType();
  var styleSelector = feature.earthObject.getStyleSelector() ||
                      ge.createStyle('');
  
  var iconContainerNode = $('<div class="feature-icon">');
  
  switch (feature.type) {
    case 'marker':
      var icon = styleSelector.getIconStyle().getIcon();
      if (!icon)
        return null;
      
      if (icon) {
        iconContainerNode.append($('<img src="' +
                                   encodeURI(icon.getHref()) + '">'));
      }
      break;
    
    case 'line':
      var lineNode = $('<div class="line">' +
                       '<img src="images/line-frame.gif" /></div>');
      var lineStyle = styleSelector.getLineStyle();
      var lineColor = 'transparent';
      if (lineStyle) {
        lineColor = kmlColorToCssColor(lineStyle.getColor().get());
      }
      
      lineNode.css('background-color', lineColor);
      iconContainerNode.append(lineNode);
      break;
    
    case 'poly':
      var polyNode = $('<div class="poly">');
      var polyStyle = styleSelector.getPolyStyle();
      var polyFillColor = 'transparent';
      
      if (polyStyle) {
        polyFillColor = kmlColorToCssColor(polyStyle.getColor().get());
        if (polyStyle.getFill())
          polyNode.css('background-color', polyFillColor);
      }
      
      polyNode.css('border', '2px solid ' +
          ((polyStyle && polyStyle.getOutline() && styleSelector.getLineStyle())
          ? kmlColorToCssColor(styleSelector.getLineStyle().getColor().get())
          : polyFillColor));
      
      iconContainerNode.append(polyNode);
      break;
  }
  
  return iconContainerNode;
}

/**
 * Updates the left-panel node for the given feature to reflect changes. To
 * only update some parts, use 'invalidate' property, which should be an object
 * literal. Possible invalidations are 'basics' (title and description),
 * 'icon' (icon-influencing properties), and 'kml' (the feature's KML in
 * general).
 */
function updateFeaturePanelNode(feature, invalidate) {
  invalidate = invalidate || {
    basics: true,
    icon: true
  };
  
  if (feature.deleted) {
    if (feature.panelNode) {
      $(feature.panelNode).remove();
      feature.panelNode = null;
    }
  } else {
    if (invalidate.basics) {
      $('.title', feature.panelNode).text(feature.title);

      var panelDesc = feature.earthObject.getSnippet() || 
                      feature.earthObject.getDescription() || '';
      $('.description', feature.panelNode)
          .html(stripTags(panelDesc).substring(0, 100));
    }
    
    if (invalidate.icon) {
      $('.feature-icon', feature.panelNode).remove();
      var featureIconNode = createFeatureIconNode(feature);
      if (featureIconNode) {
        feature.panelNode.prepend(featureIconNode);
      }
    }
  }
}

/**
 * Shows the balloon for the given feature. If in editing mode, the balloon
 * will have edit controls. Otherwise, the feature's default balloon will show.
 */
function showFeatureBalloon(feature) {
  if (g_editing) {
    // build a fully interactive DIV from templates
    var editDivNode = createEditFeatureBalloonNode(feature);
    
    // show the DIV as a balloon
    var balloon = g_ge.createHtmlDivBalloon('');
    balloon.setFeature(feature.earthObject);
    balloon.setContentDiv(editDivNode);
    g_ge.setBalloon(balloon);
  } else {
    // show the default balloon
    var balloon = g_ge.createFeatureBalloon('');
    balloon.setFeature(feature.earthObject);
    g_ge.setBalloon(balloon);
  }
}

/**
 * Creates a DIV containing edit controls for the given feature, suitable
 * for usage inside an info window (Earth balloon).
 */
function createEditFeatureBalloonNode(feature) {
  var editBasicsNode = $(tmpl($('#template-edit-feature').html(), {})).get(0);
  
  var updateIcon_ = function() {
    $('#feature-detail-button', editBasicsNode)
        .html('')
        .append(createFeatureIconNode(feature))
        .click(function(){
          $('#feature-basics').hide();
          $('#feature-detail-container').show();
          return false;
        });
  };
  
  // create basics
  updateIcon_();
  $('#feature-basics-button', editBasicsNode)
      .click(function(){
        $('#feature-basics').show();
        $('#feature-detail-container').hide();
        return false;
      });
  $('#feature-title', editBasicsNode)
      .val(feature.title)
      .change(function() {
        feature.earthObject.setName($(this).val());
        setFeatureDirty(feature, { kml: true, basics: true });
      });
  $('#feature-description', editBasicsNode)
      .val(feature.earthObject.getDescription())
      .change(function() {
        feature.earthObject.setDescription($(this).val());
        setFeatureDirty(feature, { kml: true, basics: true });
      });
  $('#feature-delete', editBasicsNode).click(function(){
    if (confirm('Are you sure you want to delete ' + feature.title + '?')) {
      feature.deleted = true;
      setFeatureDirty(feature, { basics: true });
      makeFeatureEditable(feature, false);
      g_gex.dom.removeObject(feature.earthObject);
      g_ge.setBalloon(null);
    }
  });
  $('#feature-close-button', editBasicsNode).click(function(){
    g_ge.setBalloon(null);
  });
  
  var editDetailNode = null;
  
  // create details box
  switch (feature.type) {
    case 'marker':
      editDetailNode = $(tmpl($('#template-edit-marker-detail')
          .html(), {})).get(0);
      
      for (var i = 0; i < MARKER_ICONS.length; i++) {
        var bgPos = [-(i % MARKER_ICONS_PER_ROW) * 32,
                     -Math.floor(i / MARKER_ICONS_PER_ROW) * 32];
        $('<a class="marker-icon" tabindex="1">')
            .css('background-position', bgPos[0] + 'px ' + bgPos[1] + 'px')
            .appendTo($('#marker-icons', editDetailNode))
            .click(function(iconHref) {
              return function() {
                $('.marker-icon', editDetailNode).removeClass('selected');
                $(this).addClass('selected');
                
                var style = g_gex.dom.buildStyle({icon: iconHref});
                feature.earthObject.setStyleSelector(style);
                setFeatureDirty(feature, { kml: true, icon: true });
                
                updateIcon_();
              };
            }(MARKER_ICONS[i]));
      }
      break;
    
    case 'line':
    case 'poly':
      editDetailNode = $(tmpl($('#template-edit-linepoly-detail')
          .html(), {})).get(0);
    
      if (feature.type != 'poly')
        $('.poly-only', editDetailNode).hide();
      
      var styleSelector = feature.earthObject.getStyleSelector()
      if (!styleSelector) {
        styleSelector = g_ge.createStyle('');
        feature.earthObject.setStyleSelector(styleSelector);
      }
      
      // universal style changed callback
      var styleChanged = function() {
        var lineOpacity = parseInt($('#line-opacity', editDetailNode).val());
        if (!isNaN(lineOpacity))
          lineOpacity = Math.max(0, Math.min(100, lineOpacity)) / 100;
        else
          lineOpacity = undefined;

        styleSelector.getLineStyle().getColor().set(g_gex.util.parseColor(
            $('#line-color span', editDetailNode).html(), lineOpacity));
        var lineWidth = parseInt($('#line-width', editDetailNode).val());
        if (!isNaN(lineWidth))
          styleSelector.getLineStyle().setWidth(lineWidth);
        
        if (feature.type == 'poly') {
          var fillOpacity = parseInt($('#fill-opacity', editDetailNode).val());
          if (!isNaN(fillOpacity))
            fillOpacity = Math.max(0, Math.min(100, fillOpacity)) / 100;
          else
            fillOpacity = undefined;

          styleSelector.getPolyStyle().getColor().set(g_gex.util.parseColor(
              $('#fill-color span', editDetailNode).html(), fillOpacity));
        }
        
        setFeatureDirty(feature, { kml: true, icon: true });
        
        updateIcon_();
      };
      
      // make the line and poly UI
      makeColorPicker($('#line-color', editDetailNode),
          kmlColorToCssColor(styleSelector.getLineStyle().getColor().get()),
          styleChanged);
      $('#line-width', editDetailNode)
          .val(styleSelector.getLineStyle().getWidth())
          .change(styleChanged);
      $('#line-opacity', editDetailNode)
          .val(Math.floor(100 *
            kmlColorToOpacity(styleSelector.getLineStyle().getColor().get())))
          .change(styleChanged);
      if (feature.type == 'poly') {
        makeColorPicker($('#fill-color', editDetailNode),
            kmlColorToCssColor(styleSelector.getPolyStyle().getColor().get()),
            styleChanged);
        $('#fill-opacity', editDetailNode)
            .val(Math.floor(100 * kmlColorToOpacity(
              styleSelector.getPolyStyle().getColor().get())))
            .change(styleChanged);
      }
      break;
  }
  
  $('#feature-detail', editBasicsNode)
      .html('') // first clear old stuff
      .append(editDetailNode);
  
  return editBasicsNode;
}

/**
 * Turns the given node into a color box, that when clicked, shows a color
 * picker. The node will contain an invisible <span> holding the currently
 * chosen HTML/CSS style color value.
 */
function makeColorPicker(node, startValue, changeCallback) {
  node = $(node);
  if (!node.length)
    return;
  
  $('span', node).html(startValue);
  node.css('background-color', startValue);
  
  var _hovering = true;
  
  // on click, show the color picker
  node.click(function() {
    var pickerBox = $('<div class="color-picker-box">')
        .css('left', node.offset().left + 'px')
        .css('top', node.offset().top + 'px');
    
    for (var i = 0; i < COLOR_TABLE.length; i++) {
      $('<a class="color-item" tabindex="1">')
          .css('background-color', COLOR_TABLE[i])
          .appendTo(pickerBox)
          .mouseover(function() {
            _hovering = true;
          })
          .mouseout(function() {
            _hovering = false;
            setTimeout(function() {
              if (!_hovering)
                ;//pickerBox.remove();
            }, 1000);
          })
          .click(function(colorValue) {
            return function() {
              $('span', node).html(colorValue);
              node.css('background-color', colorValue);
              pickerBox.remove();
              if (changeCallback)
                changeCallback.call(null, colorValue);
            };
          }(COLOR_TABLE[i]));
    }
    
    // iframe shim so the color picker will appear above Earth
    pickerBox.prepend($('<iframe>')
        .attr('scrolling', 'no')
        .attr('frameborder', 0));
    
    pickerBox.appendTo(document.body);
  });
}

/**
 * Updates the editing UI to reflect changes to the editing state. UI items
 * modified include the edit buttons, the map selection dropdown, the geometry
 * tools overlaid atop the plugin, and the Earth features themselves (makes them
 * editable or not editable depending on the global 'is editing' state).
 */
function updateEditUI() {
  $('#edit-buttons').html('');
  
  if (!g_currentMyMapId) {
    return;
  }
  
  // make features editable
  for (var i = 0; i < g_features.length; i++) {
    if (g_features[i].deleted)
      continue;
    
    makeFeatureEditable(g_features[i], g_editing);
  }
  
  if (g_editing) {
    createGeometryToolbox();
    
    $('#map-list').attr('disabled', 'disabled');
    
    // create save and done buttons
    $('<input type="button">')
        .val('Done')
        .click(function(){ saveEdits(true); })
        .appendTo($('#edit-buttons'));
    
    $('<input type="button" id="save-button">')
        .val('Save')
        .attr('disabled', g_dirty ? '' : 'disabled')
        .click(function(){ saveEdits(false); })
        .appendTo($('#edit-buttons'));

  } else {
    destroyGeometryToolbox();
    
    $('#map-list').removeAttr('disabled');
    
    // destroy save and done buttons
    $('<input type="button">')
        .val('Edit')
        .click(function() {
          g_editing = true;
          updateEditUI();
        })
        .appendTo($('#edit-buttons'));
  }
}

/**
 * The click handler used when editable features are clicked. This handler
 * shows feature balloons.
 */
function _editableFeatureClickHandler(event) {
  if (event.getButton() != 0)
    return;
  
  event.preventDefault();
  
  var clickedTarget = event.getTarget();
  
  for (var i = 0; i < g_features.length; i++) {
    if (g_features[i].earthObject &&
        clickedTarget.equals(g_features[i].earthObject)) {
      if (!g_features[i]._justDragged)
        showFeatureBalloon(g_features[i]);
      break;
    }
  }
}

/**
 * Turns a given feature's editability on or off. For example, this makes
 * placemarks draggable and line strings/polygon coordinates editable.
 */
function makeFeatureEditable(feature, editable) {
  if (typeof editable === 'undefined') {
    editable = true;
  }
  
  if (feature.editable == editable)
    return;
  
  if (editable) {
    google.earth.addEventListener(feature.earthObject, 'click',
                                  _editableFeatureClickHandler);
  } else {
    google.earth.removeEventListener(feature.earthObject, 'click',
                                     _editableFeatureClickHandler);
  }
  
  switch (feature.type) {
    case 'marker':
      if (editable) {
        g_gex.edit.makeDraggable(feature.earthObject, {
          targetScreenOverlay: MARKER_DRAG_TARGET,
          dropCallback: function() {
            feature._justDragged = true; // so as not to pop up an info window
                                         // in the onclick handler if dragged
            setTimeout(function() {
              delete feature._justDragged;
            }, 100);
            
            setFeatureDirty(feature, { kml: true });
          }
        });
      } else {
        g_gex.edit.endDraggable(feature.earthObject);
      }
      break;
    
    case 'line':
      if (editable) {
        g_gex.edit.editLineString(feature.earthObject.getGeometry(), {
          editCallback: function() {
            setFeatureDirty(feature, { kml: true });
          }
        });
      } else {
        g_gex.edit.endEditLineString(feature.earthObject.getGeometry());
      }
      break;
  
    case 'poly':
      if (editable) {
        g_gex.edit.editLineString(feature.earthObject.getGeometry()
            .getOuterBoundary(), {
          editCallback: function() {
            setFeatureDirty(feature, { kml: true });
          }
        });
      } else {
        g_gex.edit.endEditLineString(feature.earthObject.getGeometry()
            .getOuterBoundary());
      }
      break;
  }
  
  feature.editable = editable;
}

/**
 * Sets the currently-being-edited map as dirty.
 */
function setDirty() {
  g_dirty = true; // the map was modified
  $('#save-button').removeAttr('disabled');
}

/**
 * Mark a given feature as changed, with optional invalidation switches to
 * update certain UIs. Options for the 'invalidate' property are 'kml', 'icon',
 * and 'basics'.
 */
function setFeatureDirty(feature, invalidate) {
  invalidate = invalidate || {
    kml: true,
    icon: true,
    basics: true
  };
  
  feature.dirty = true;
  
  if (invalidate.kml)
    updateFeatureKml(feature);
  
  if (invalidate.icon || invalidate.basics)
    updateFeaturePanelNode(feature, invalidate);
  
  setDirty();
}

/**
 * Sets a feature's JS-side stored KML string to its Earth object's current KML
 * (using earthObject.getKml())
 */
function updateFeatureKml(feature) {
  feature.kml = feature.earthObject ? feature.earthObject.getKml()
                                    : '';
  feature.title = feature.earthObject.getName();
}

/**
 * Saves the currently-being-edited map and optionally turns off editing (if
 * the done parameter is true).
 */
function saveEdits(done) {
  hideErrors();
  $('#loading-image').show();
  
  _doSave(function() {
    if (done)
      g_editing = false;

    updateEditUI();
    $('#loading-image').hide();
  }, function(err) {
    updateEditUI();
    showGDataError(err);
  });
}

/**
 * The real saving workhorse. Saves map edits, one HTTP POST/PUT/DELETE at a
 * time, since the JS client libraries don't support batch update. The
 * successCallback function will be called upon success, and the failureCallback
 * function will be called upon failure, with a GData/showGDataError friendly
 * error object.
 */
function _doSave(successCallback, failureCallback) {
  successCallback = successCallback || function(){};
  failureCallback = failureCallback || function(){};
  
  if (!g_dirty || !g_features.length) {
    successCallback();
  }
  
  var mapFeatureFeed = g_myMaps[g_currentMyMapId].featureFeedHref;
  var featureIndex = -1;
  
  var saveNext;
  saveNext = function() {
    ++featureIndex;
    
    if (featureIndex >= g_features.length) {
      // done
      g_dirty = false;
      successCallback();
    } else {
      
      var feature = g_features[featureIndex];
      
      if (!feature.dirty) {
        setTimeout(saveNext, 0); // move to the next feature w/o recursion
      } else {
        // feature's dirty, save it
        var continuation = function(entryRoot) {
          if (feature.deleted) {
            // deleted
            g_features.splice(featureIndex, 1);
            --featureIndex;
          } else {
            // inserted or updated (i.e. not deleted)
            var updatedEntry = entryRoot.entry;
            feature.id = updatedEntry.getId().$t;
            feature.editLinkHref = updatedEntry.getEditLink().href;
            feature.dirty = false;
          }
          setTimeout(saveNext, 0);
        };
        
        var entry = new google.gdata.maps.FeatureEntry();
        
        if (feature.deleted) {
          if (!feature.id) {
            // created in this session, and unsaved, simply
            // call the continuation to remove the feature
            continuation();
          } else {
            g_mapsService.deleteEntry(feature.editLinkHref, continuation,
                                      failureCallback);
          }
        } else {
          entry.setTitle(new google.gdata.atom.Text({ text: feature.title }));
          /*
          entry.setContent(new google.gdata.maps.KmlContent({
            text: feature.kml,
            type: 'application/vnd.google-earth.kml+xml'
          }));
          */
          var content = new google.gdata.maps.KmlContent({
            type: 'application/vnd.google-earth.kml+xml'
          });
        
          // convert KML to JSON so the JS client library can reserialize
          // it back to XML
          var parsedKmlJson = xmlNodeToJson(parseXml(feature.kml), 'kml');
          content.kml$Placemark = parsedKmlJson.kml$kml ?
              parsedKmlJson.kml$kml.kml$Placemark :
              parsedKmlJson.kml$Placemark;
          content.kml$Placemark.xmlns$kml = 'http://www.opengis.net/kml/2.2';
          content.kml$Placemark.xmlns$gx = 'http://www.google.com/kml/ext/2.2';
          entry.setContent(content);

          if (feature.id) {
            entry.setId(new google.gdata.atom.Id({ value: feature.id }));
            g_mapsService.updateEntry(feature.editLinkHref, entry, continuation,
                                      failureCallback);
          } else {
            // doesn't have an id, create it
            g_mapsService.insertEntry(mapFeatureFeed, entry, continuation,
                                      failureCallback);
          }
        }
      }
    }
  };
  
  // start the savings!
  saveNext();
}





////////////////////////////////////////////////////////////////////////////////
// GEOMETRY TOOLBOX-SPECIFIC FUNCTIONS




/**
 * Creates a geometry toolbox button with the given properties. The sole
 * parameter, button, should have the following properties:
 *   - id: String
 *   - pos: Number[2], indicating the x, y in pixels
 *   - size: Number[2], indicating the width, height in pixels
 *   - image: String, URL of image
 *   - imageOn: String, URL of image to use when the button is selected
 *   - onClick: Function, a function to be called when this button is clicked
 */
function createToolboxButton(button) {
  button.earthObject = g_gex.dom.buildScreenOverlay({
    drawOrder: 1000,
    icon: button.image,
    screenXY: { left: button.pos[0], top: button.pos[1] },
    size: { width: button.size[0], height: button.size[1] }
  });
  
  button.earthObjectOn = g_gex.dom.buildScreenOverlay({
    drawOrder: 1001,
    icon: button.imageOn,
    screenXY: { left: button.pos[0], top: button.pos[1] },
    size: { width: button.size[0], height: button.size[1] }
  });
  
  g_geometryToolbox.buttonContainerEarthObject
      .getFeatures().appendChild(button.earthObject);
  g_geometryToolbox.buttonContainerEarthObject
      .getFeatures().appendChild(button.earthObjectOn);
  
  g_geometryToolbox.buttons[button.id] = button;
}

/**
 * Creates the geometry toolbox.
 */
function createGeometryToolbox() {
  if (g_geometryToolbox)
    return;
  
  g_geometryToolbox = {
    buttons: {},
    buttonContainerEarthObject: g_ge.createDocument('')
  };
  
  var pagePath = window.location.href.substring(0,
      window.location.href.lastIndexOf('/')) + '/';
  
  var x = 20 - 31;
  
  // create buttons
  createToolboxButton({
    id: 'hand',
    pos: [x += 31, 20],
    size: [31, 31],
    image: pagePath + 'images/etb-hand.png',
    imageOn: pagePath + 'images/etb-hand-on.png',
    onClick: function() { _abortCreateFeature(); }
  });
  
  createToolboxButton({
    id: 'marker',
    pos: [x += 31, 20],
    size: [31, 31],
    image: pagePath + 'images/etb-marker.png',
    imageOn: pagePath + 'images/etb-marker-on.png',
    onClick: function(){ _beginCreateFeature('marker'); }
  });
  
  createToolboxButton({
    id: 'line',
    pos: [x += 31, 20],
    size: [31, 31],
    image: pagePath + 'images/etb-line.png',
    imageOn: pagePath + 'images/etb-line-on.png',
    onClick: function(){ _beginCreateFeature('line'); }
  });
  
  createToolboxButton({
    id: 'poly',
    pos: [x += 31, 20],
    size: [31, 31],
    image: pagePath + 'images/etb-poly.png',
    imageOn: pagePath + 'images/etb-poly-on.png',
    onClick: function(){ _beginCreateFeature('poly'); }
  });

  _selectGeometryToolboxButton('hand');
  g_ge.getFeatures().appendChild(g_geometryToolbox.buttonContainerEarthObject);
    
  // set up event listener to trap button clicks
  google.earth.addEventListener(g_ge.getWindow(), 'mousedown',
                                _geometryToolboxWindowMousedownHandler);
}

/**
 * Destroys the geometry toolbox and associated buttons.
 */
function destroyGeometryToolbox() {
  if (!g_geometryToolbox)
    return;
  
  google.earth.removeEventListener(g_ge.getWindow(), 'mousedown',
                                   _geometryToolboxWindowMousedownHandler);
  
  // make sure to end current edit here.
  
  
  g_geometryToolbox.buttonContainerEarthObject.setVisibility(false);
  g_ge.getFeatures().removeChild(g_geometryToolbox.buttonContainerEarthObject);
  
  g_geometryToolbox = null;
}

/**
 * Window mousedown handler that checks for clicks in geometry toolbox
 * buttons and fires off the appropriate onClick handlers.
 */
function _geometryToolboxWindowMousedownHandler(event) {
  if (event.getButton() != 0) // left click
    return;

  var mousePos = [event.getClientX(), event.getClientY()];
  
  for (var id in g_geometryToolbox.buttons) {
    var button = g_geometryToolbox.buttons[id];
    
    // see if this button was clicked
    if (button.pos[0] <= mousePos[0] && mousePos[0] <= button.pos[0] +
                                                       button.size[0] &&
        button.pos[1] <= mousePos[1] && mousePos[1] <= button.pos[1] +
                                                       button.size[1]) {
      _selectGeometryToolboxButton(id);
      if (button.onClick)
        button.onClick.call(button);
      
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }
}

/**
 * Selects the geometry toolbox button with the given ID.
 */
function _selectGeometryToolboxButton(selId) {
  g_gex.util.batchExecute(function() {
    for (var id in g_geometryToolbox.buttons) {
      var button = g_geometryToolbox.buttons[id];
      button.earthObjectOn.setVisibility(id === selId);
    }
  });
}

/**
 * Starts creating a feature of the given type. Valid feature types are
 * 'marker', 'line', and 'poly'. This method is used by the geometry toolbox.
 */
function _beginCreateFeature(featureType) {
  _abortCreateFeature(); // abort any current edits
  
  g_geometryToolbox.featureInCreation = {
    id: null,
    title: 'Untitled ' + featureType.charAt(0).toUpperCase() +
                         featureType.substring(1),
    kml: null,
    earthObject: null,
    type: featureType,
    dirty: true
  };
  
  var placemark;
  
  switch (featureType) {
    case 'marker':
      placemark = g_gex.dom.buildPointPlacemark(
        [0, 0, 0, g_ge.ALTITUDE_CLAMP_TO_SEA_FLOOR], {
        name: g_geometryToolbox.featureInCreation.title,
        style: DEFAULT_FEATURE_STYLE
      });
      
      g_containerEarthObject.getFeatures().appendChild(placemark);
      g_geometryToolbox.featureInCreation.earthObject = placemark;
  
      g_gex.edit.place(placemark, {
        targetScreenOverlay: MARKER_DRAG_TARGET,
        dropCallback: function() {
          // give time for the abort to happen if the user clicks the
          // hand tool in the geometry toolbox
          window.setTimeout(_finishCreateFeature, 100);
        }
      });
      break;
    
    case 'line':
    case 'poly':
      placemark = g_gex.dom.buildPlacemark({
        lineString: (featureType == 'line') ? [] : undefined,
        polygon: (featureType == 'poly') ? [] : undefined,
        name: g_geometryToolbox.featureInCreation.title,
        style: DEFAULT_FEATURE_STYLE
      });
      
      g_containerEarthObject.getFeatures().appendChild(placemark);
      g_geometryToolbox.featureInCreation.earthObject = placemark;

      var geom = (featureType == 'line') ?
          placemark.getGeometry() :
          placemark.getGeometry().getOuterBoundary();
      
      placemark.getGeometry().setAltitudeMode(g_ge.ALTITUDE_CLAMP_TO_GROUND);
      geom.setAltitudeMode(g_ge.ALTITUDE_CLAMP_TO_GROUND);
      geom.setTessellate(true);
      
      g_gex.edit.drawLineString(geom, {
        finishCallback: function() {
          // give time for the abort to happen if the user clicks the
          // hand tool in the geometry toolbox
          window.setTimeout(_finishCreateFeature, 100);
        }
      });
      break;
  }
}

/**
 * Cancels and deletes any currently-being-created feature initiated by a click
 * in the geometry toolbox.
 */
function _abortCreateFeature() {
  if (!g_geometryToolbox.featureInCreation)
    return;
  
  switch (g_geometryToolbox.featureInCreation.type) {
    case 'marker':
      g_gex.edit.endDraggable(g_geometryToolbox.featureInCreation.earthObject);
      break;
    
    case 'line':
      g_gex.edit.endEditLineString(
          g_geometryToolbox.featureInCreation.earthObject.getGeometry());
      break;
    
    case 'poly':
      g_gex.edit.endEditLineString(
          g_geometryToolbox.featureInCreation.earthObject.getGeometry()
          .getOuterBoundary());
      break;
  }

  g_gex.dom.removeObject(g_geometryToolbox.featureInCreation.earthObject);
  
  g_geometryToolbox.featureInCreation = null;
}

/**
 * Finishes off the currently being created feature as initiated by the
 * geometry toolbox.
 */
function _finishCreateFeature() {
  setDirty();
  
  updateFeatureKml(g_geometryToolbox.featureInCreation);
  g_features.push(g_geometryToolbox.featureInCreation);
  
  // leave the feature editable after creating it
  makeFeatureEditable(g_geometryToolbox.featureInCreation);
  
  $('#feature-list').append(createFeaturePanelNode(
      g_geometryToolbox.featureInCreation));
  
  g_geometryToolbox.featureInCreation = null;
  _selectGeometryToolboxButton('hand');
}








////////////////////////////////////////////////////////////////////////////////
// GENERIC HELPER FUNCTIONS





/**
 * Strips tags from the given HTML string and replaces new-line creating tags
 * with real newlines (\n).
 */
function stripTags(html) {
  if (!html)
    return '';
  
  return html.replace(/<(p|br|div).*?>/ig, '\n')
             .replace(/<\/?[a-z]+.*?>/ig, '');
}

/**
 * Helper to convert a KML color of the form aabbggrr to a HTML/CSS friendly
 * color of the form #rrggbb.
 */
function kmlColorToCssColor(kmlColor) {
  var replaced = kmlColor.replace(/^(..)(..)(..)(..)$/, '#$4$3$2');
  return (replaced === kmlColor) ? 'transparent' : replaced;
}

/**
 * Helper to extract the opacity component of a KML color into a number from
 * 0.0 to 1.0.
 */
function kmlColorToOpacity(kmlColor) {
  var replaced = kmlColor.replace(/^(..)(..)(..)(..)$/, '$1');
  return (replaced === kmlColor) ? 1.0 : parseInt(replaced, 16) / 255;
}

/**
 * Flies to a best-fit view of the given feature. If the feature already has
 * an abstract view defined, flies to that view. Otherwise, calculates the view
 * with the help of ge-poly-fit-hack.js
 */
function flyToFeature(feature) {
  var abstractView = feature.getAbstractView() ? feature.getAbstractView() :
                         computeFitLookAt(g_ge, feature, $('#map3d').width() /
                                                         $('#map3d').height());
  if (abstractView)
    g_ge.getView().setAbstractView(abstractView);
}
