// This sample will toggle visibility of 3D buildings

function getInheritedVisibility(layer) {
  if (layer.getVisibility() == false) {
    return false;
  } else {
    var parent = layer.getParentNode();
    if (!parent) {
      return true;
    }
    return getInheritedVisibility(parent);
  }
}

var buildingsLayer = ge.getLayerRoot().getLayerById(ge.LAYER_BUILDINGS);
var inheritedVisibility = getInheritedVisibility(buildingsLayer);
ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, !inheritedVisibility);

// Move viewpoint to San Francisco
var la = ge.createLookAt('');
la.set(37.79333, -122.40, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 70, 1000);
ge.getView().setAbstractView(la);      

// Spin the camera around downtown San Francisco
setTimeout(function() {
             var la = ge.createLookAt('');         
             la.set(37.79333, -122.40, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 
                    180, 50, 1000);
             ge.getView().setAbstractView(la);
           }, 10000);
