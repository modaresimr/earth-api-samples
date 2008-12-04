var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);

function go(count) {
  var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  lookAt.setLongitude(lookAt.getLongitude() + 5);
  ge.getView().setAbstractView(lookAt);
  
  if (count < 40) {
    setTimeout(function(){
                 go(count + 1);
               }, 50);
  } else {
    ge.getOptions().setFlyToSpeed(oldFlyToSpeed);
  }
}

go(0);
