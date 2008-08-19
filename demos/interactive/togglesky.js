if (!('isSkyMode' in window) || !window.isSkyMode) {
  window.isSkyMode = true;
  ge.getOptions().setMapType(ge.MAP_TYPE_SKY);

  setTimeout(function() {
    // Zoom in on a nebula.
    var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
    ge.getOptions().setFlyToSpeed(.2);  // Slow down the camera flyTo speed.
    var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    lookAt.set(41.28509187215, -169.2448684551622, 0, 
               ge.ALTITUDE_RELATIVE_TO_GROUND, 262.87, 0, 162401);
    // Also try: 
    //   lookAt.set(-59.65189337195337, -18.799770300376053, 0, 
    //              ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 36817);
    ge.getView().setAbstractView(lookAt);
    ge.getOptions().setFlyToSpeed(oldFlyToSpeed);
  }, 1000);  // Start the zoom-in after one second.
} else {
  window.isSkyMode = false;
  ge.getOptions().setMapType(ge.MAP_TYPE_EARTH);
}

