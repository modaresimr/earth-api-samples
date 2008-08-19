// Toggle terrain (altitude of ground plane, such as mountains) on and off

var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT); 

// Fly to the Grand Canyon
var la = ge.createLookAt('');
la.set(36.291068, -112.4981896, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 
       0, 80, 20000);
ge.getView().setAbstractView(la);        

ge.getOptions().setFlyToSpeed(oldFlyToSpeed); 

var layerRoot = ge.getLayerRoot();
var terrainLayer = layerRoot.getLayerById(ge.LAYER_TERRAIN);
if (terrainLayer.getVisibility()) {
  layerRoot.enableLayerById(ge.LAYER_TERRAIN, false);
} else {
  layerRoot.enableLayerById(ge.LAYER_TERRAIN, true);
}
