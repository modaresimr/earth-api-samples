var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
lookAt.setLatitude(lookAt.getLatitude() + .5);
lookAt.setLongitude(lookAt.getLongitude() + .5);
ge.getView().setAbstractView(lookAt);
