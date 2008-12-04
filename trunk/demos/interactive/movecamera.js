// look at the point 0.5 degrees (both latitude and longitude) away from the
// current camera focus point
var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
lookAt.setLatitude(lookAt.getLatitude() + 0.5);
lookAt.setLongitude(lookAt.getLongitude() + 0.5);
ge.getView().setAbstractView(lookAt);
