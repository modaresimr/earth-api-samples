var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
ge.getOptions().setFlyToSpeed(100);
go = function(count) {
  var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  lookAt.setLatitude(lookAt.getLatitude() + .1);
  lookAt.setLongitude(lookAt.getLongitude() + .1);
  ge.getView().setAbstractView(lookAt);
  if (count < 40) {
    setTimeout('go(' + (count+1) + ')', 50);
  } else {
    ge.getOptions().setFlyToSpeed(oldFlyToSpeed);
  }
}

go(0);
