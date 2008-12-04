var g_pagePath = null; // dirname(this URL), including trailing slash 
var g_tiles = []; // array of tiles
var g_tilesByCoords = {}; // 'x,y' => tile
var g_emptyCoords = []; // the coordinates of the empty tile
var g_puzzleFeatureFolder = null; // the KmlFolder containing all the puzzle
                                  // UI features
var g_puzzleFrame = null; // the puzzle frame (i.e. 'Puzzle' title bar, etc.)
var g_won = false; // did user win yet?

/**
 * The lat/lng extents of the entire puzzle area (the 4x4 tile area).
 */
var g_puzzleExtents = { north: 25.20175, east: 44.88493,
                        south: -25.95636, west: -9.33653 };

/**
 * Sets up the graphical game timer.
 */
function setupTimer() {
  // setup timer
  var startTime = new Date();
  setInterval(function() {
    if (g_won)
      return;
    
    var seconds = Math.floor((new Date() - startTime) / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    
    minutes = ((minutes < 10) ? '0' + minutes : minutes).toString();
    seconds = ((seconds < 10) ? '0' + seconds : seconds).toString();
    document.getElementById('timer').innerHTML = minutes + ':' + seconds;
  }, 500);
}

/**
 * Initial setup for the puzzle game (both UI and board config).
 */
function setupPuzzle() {
  var href = window.location.href;
  g_pagePath = href.substring(0, href.lastIndexOf('/')) + '/';
  
  // create the puzzle feature folder
  g_puzzleFeatureFolder = ge.createFolder('');
  ge.getFeatures().appendChild(g_puzzleFeatureFolder);

  // create translucent world cover
  var cover = ge.createGroundOverlay('');
  cover.setLatLonBox(ge.createLatLonBox(''));
  cover.getLatLonBox().setBox(90, -90, 180, -180, 0);
  cover.getColor().set('aa000000');
  cover.setDrawOrder(0);
  g_puzzleFeatureFolder.getFeatures().appendChild(cover);

  // create puzzle frame
  g_puzzleFrame = ge.createGroundOverlay('');
  g_puzzleFrame.setLatLonBox(ge.createLatLonBox(''));
  g_puzzleFrame.getLatLonBox().setBox(34.57812, -28.70568, 47.56108, -12.30647, 0);
  g_puzzleFrame.setIcon(ge.createIcon(''));
  g_puzzleFrame.getIcon().setHref(g_pagePath + 'puzzle.png');
  g_puzzleFrame.setDrawOrder(1);
  //g_puzzleFrame.getColor().set('aaffffff');
  g_puzzleFeatureFolder.getFeatures().appendChild(g_puzzleFrame);

  // look at puzzle frame
  resetPuzzleView();

  // tile coordinates
  var availCoords = [];
  for (var y = 0; y < 4; y++)
    for (var x = 0; x < 4; x++)
      availCoords.push([x,y]);

  var i;
  
  // create puzzle tiles
  for (i = 0; i < 15; i++) {
    // create tile ground overlay
    var tile = {};
    
    // start the tiles in their winning positions
    var tileCoordsIndex = 0;
    tile.index = i;
    tile.coords = availCoords[tileCoordsIndex];
    availCoords.splice(tileCoordsIndex, 1);

    // create the overlay
    tile.overlay = ge.createGroundOverlay('');
    tile.overlay.setLatLonBox(ge.createLatLonBox(''));
    tile.overlay.setIcon(ge.createIcon(''));
    tile.overlay.setDrawOrder(2);
    moveTile(tile, tile.coords);

    // set the overlay icon and add it to Earth
    var paddedTileNum = ((i + 1) < 10) ? ('0' + (i + 1)) : (i + 1);
    tile.overlay.getIcon().setHref(
        g_pagePath + 'tiles/tile' + paddedTileNum + '.jpg');
    g_puzzleFeatureFolder.getFeatures().appendChild(tile.overlay);

    // add tile to tiles arrays
    g_tiles[i] = tile;
    setTileAtCoords(tile.coords, tile);
  }
  
  // set empty spot to last remaining coords
  g_emptyCoords = availCoords[0];
    
  // randomize board
  if (document.location.hash.indexOf('canhazcheatz') < 0) {
    for (i = 0; i < 100; i++) {
      while (true) {
        // pick a tile above, below, left or right, of the empty slot
        var dx = 0, dy = 0;
        if (Math.random() < 0.5) {
          // above or below
          dy = (Math.random() < 0.5) ? -1 : 1;
        } else {
          // left or right
          dx = (Math.random() < 0.5) ? -1 : 1;
        }
      
        // no tile? aw shucks, too bad.. pick another one ;-)
        var tileToMove = getTileAtCoords([g_emptyCoords[0] + dx,
                                          g_emptyCoords[1] + dy]);
        if (!tileToMove)
          continue;
      
        // move the tile
        moveTile(tileToMove, g_emptyCoords);
        break;
      }
    }
  }

  // handle events
  google.earth.addEventListener(ge.getWindow(), 'mousemove',
      function(evt){ handleMouseEvent(evt, 'mousemove'); });
  google.earth.addEventListener(ge.getWindow(), 'mousedown',
      function(evt){ handleMouseEvent(evt, 'click'); });
}

/**
 * Reset puzzle view to center on the puzzle
 */
function resetPuzzleView() {
  var la = ge.createLookAt('');
  var llb = g_puzzleFrame.getLatLonBox();
  la.setLatitude((llb.getNorth() + llb.getSouth()) / 2);
  la.setLongitude((llb.getEast() + llb.getWest()) / 2);
  la.setTilt(5);
  la.setRange(12000000);
  ge.getView().setAbstractView(la);
}

/**
 * Returns the tile at the given coords, or null if none exists
 */
function getTileAtCoords(coords) {
  return g_tilesByCoords[coords[0] + ',' + coords[1]];
}

/**
 * Logically sets the given tile to occupy the given coords.
 */
function setTileAtCoords(coords, tile) {
  g_tilesByCoords[coords[0] + ',' + coords[1]] = tile;
}

/**
 * Gets the N/S/E/W extents for a tile in the given x,y coords. Note: x,y
 * is right-to-left, top-to-bottom
 */
function getExtentsForTileCoords(coords) {
  var spacing = 0.01; // should match spacing in image tile data
  var tSize = (1.0 - 3 * spacing) / 4.0;
  var span = { lat: g_puzzleExtents.south - g_puzzleExtents.north,
               lng: g_puzzleExtents.west - g_puzzleExtents.east };
  var tExt = {
    north: g_puzzleExtents.north +
        (span.lat * (tSize + spacing)) * coords[1],
    south: g_puzzleExtents.north +
        (span.lat * (tSize + spacing)) * coords[1] + span.lat * tSize,
    east: g_puzzleExtents.east +
        (span.lng * (tSize + spacing)) * coords[0],
    west: g_puzzleExtents.east +
        (span.lng * (tSize + spacing)) * coords[0] + span.lng * tSize
  };
  
  // return normalized extents
  return {
    north: Math.max(tExt.north, tExt.south),
    south: Math.min(tExt.north, tExt.south),
    east: Math.max(tExt.east, tExt.west),
    west: Math.min(tExt.east, tExt.west)
  };
}

/**
 * Gets the x,y coords of the tile at the given latitude and longitude, or null
 * if there is no tile there.
 */
function getTileCoordsFromLatLng(lat, lng) {
  if (lat >= g_puzzleExtents.south && lat <= g_puzzleExtents.north &&
      lng >= g_puzzleExtents.west && lng <= g_puzzleExtents.east) {
    return [
      Math.floor(((lng - g_puzzleExtents.east) / (g_puzzleExtents.west - g_puzzleExtents.east)) * 4),
      Math.floor(((lat - g_puzzleExtents.north) / (g_puzzleExtents.south - g_puzzleExtents.north)) * 4)
    ];
  } else {
    return null;
  }
}

/**
 * Physically and logically moves a tile to the given coords. Assumes that
 * there is no current tenant at the move-to coords (i.e. it's the empty tile).
 */
function moveTile(tile, coords) {
  // vacate current spot
  g_emptyCoords = tile.coords;
  setTileAtCoords(tile.coords, null);
  
  // occupy new spot
  setTileAtCoords(coords, tile);
  tile.coords = coords;
  
  // physically move the tile
  var extents = getExtentsForTileCoords(coords);
  tile.overlay.getLatLonBox().setBox(
      extents.north, extents.south, extents.east, extents.west, 0);
}

/**
 * Returns true if the current board configuration is a winning configuration.
 */
function checkWin() {
  for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      // tile [3,3] is empty in a winning config
      // all other tiles in winning config are index(x,y) = (y * 4) + x
      if ((x != 3 || y != 3) &&
          (!getTileAtCoords([x,y]) ||
           getTileAtCoords([x,y]).index != (y * 4) + x)) {
        return false;
      }
    }
  }
  
  // won
  return true;
}

/**
 * Un-highlights all tiles.
 */
function resetTileHoverStates() {
  for (var i = 0; i < 15; i++)
    g_tiles[i].overlay.getColor().set('ffffffff');
}

/**
 * Handle mouse move and click over the Earth window.
 */
function handleMouseEvent(evt, evtID) {
  var mousemove = (evtID == 'mousemove');
  var click = (evtID == 'click');
  
  resetTileHoverStates();
  if (!g_won && evt.getDidHitGlobe()) {
    coords = getTileCoordsFromLatLng(evt.getLatitude(), evt.getLongitude());
    if (coords && getTileAtCoords(coords)) {
      // we're hovering over an actual tile
      if (coords[0] == g_emptyCoords[0]) {
        // same column as empty tile
        
        // highlight all tiles between empty tile and hover tile
        var direction = (coords[1] < g_emptyCoords[1]) ? -1 : 1;
        for (var y = g_emptyCoords[1] + direction;
             y != coords[1] + direction;
             y += direction) {
          if (mousemove)
            getTileAtCoords([coords[0],y]).overlay.getColor().set('88ffffff');
          else if (click)
            moveTile(getTileAtCoords([coords[0],y]), [coords[0],y - direction]);
        }
        
        evt.preventDefault();
      } else if (coords[1] == g_emptyCoords[1]) {
        // same row as empty tile
        
        // highlight all tiles between empty tile and hover tile
        var direction = (coords[0] < g_emptyCoords[0]) ? -1 : 1;
        for (var x = g_emptyCoords[0] + direction;
             x != coords[0] + direction;
             x += direction) {
          if (mousemove)
            getTileAtCoords([x,coords[1]]).overlay.getColor().set('88ffffff');
          else if (click)
            moveTile(getTileAtCoords([x,coords[1]]), [x - direction,coords[1]]);
        }
        
        evt.preventDefault();
      }
      
      // if clicked, checked for a winning game configuration
      // and if the user won, show the winner graphic
      if (click && !g_won && checkWin()) {
        g_won = true;
        showWinnerUI();
      }
    }
  }
}

/**
 * Notify the user that they'd won.
 */
function showWinnerUI() {
  setTimeout(function() {
    // create winner graphic
    var winGraphic = ge.createScreenOverlay('');
    winGraphic.getOverlayXY().set(0.5, ge.UNITS_FRACTION, 0.5, ge.UNITS_FRACTION);
    winGraphic.getScreenXY().set(0.5, ge.UNITS_FRACTION, 0.5, ge.UNITS_FRACTION);
    winGraphic.getSize().set(-1, ge.UNITS_FRACTION, -1, ge.UNITS_FRACTION);
    winGraphic.setIcon(ge.createIcon(''));
    winGraphic.getIcon().setHref(g_pagePath + 'win.png');
    winGraphic.setDrawOrder(10);
    ge.getFeatures().appendChild(winGraphic);
  }, 100);
}

/**
 * Show or hide the 'hint' (i.e. background borders and labels).
 */
function showHint(showOrHide) {
  if (showOrHide) {
    g_puzzleFeatureFolder.setVisibility(false);
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
  } else {
    g_puzzleFeatureFolder.setVisibility(true);
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
  }
}
