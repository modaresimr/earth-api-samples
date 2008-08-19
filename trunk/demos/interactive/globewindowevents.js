if (!window.globeWindowEventListener) {
  window.globeWindowEventListener = function(event) {
    var text = 'Mouse Event:\n';

    function addToMessage(append1, append2) { 
      text += ' ' + append1 + ': ' + append2 + '\n' ;
    }

    addToMessage('target type: ', event.getTarget().getType());
    addToMessage('currentTarget type: ', 
                 event.getCurrentTarget().getType());
    addToMessage('button', event.getButton());
    addToMessage('clientX', event.getClientX());
    addToMessage('clientY', event.getClientY());
    addToMessage('screenX', event.getScreenX());
    addToMessage('screenY', event.getScreenY());
    addToMessage('latitude', event.getLatitude());
    addToMessage('longitude', event.getLongitude());
    addToMessage('altitude', event.getAltitude());
    addToMessage('didHitGlobe', event.getDidHitGlobe());
    addToMessage('altKey', event.getAltKey());
    addToMessage('ctrlKey', event.getCtrlKey());
    addToMessage('shiftKey', event.getShiftKey());
    addToMessage('timeStamp', event.getTimeStamp());

    log(text);
  }
}

google.earth.addEventListener(ge.getGlobe(), "mousedown",
                              window.globeWindowEventListener);
google.earth.addEventListener(ge.getWindow(), "mousedown",
                              window.globeWindowEventListener);
