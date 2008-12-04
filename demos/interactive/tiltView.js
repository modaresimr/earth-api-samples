function go(count) {
  var idealTilt = 80;  // all angles in the API are in degrees.
  var c0 = 0.90;
  var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  
  var tilt = la.getTilt();
  tilt = c0 * tilt + (1 - c0) * idealTilt;
  la.setTilt(tilt);
  ge.getView().setAbstractView(la);
  
  if (count < 60) {
    setTimeout(function() {
                 go(count + 1);
               }, 33);
  }
}

go(0);
