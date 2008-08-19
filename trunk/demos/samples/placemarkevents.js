if (!window.placemark) {
  alert('Run "Create Placemark" sample first.');
} else {
  window.geEventListener = function(event) {
    var text = 'Click:';

    function addToMessage(append1, append2) { 
     text += ' ' + append1 + ': ' + append2 + '<br>\n' ;
    }

    addToMessage('target type', event.getTarget().getType());
    addToMessage('currentTarget type', 
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

    // Prevent default balloon from popping up for marker placemarks
    event.preventDefault(); 

    log(text);
  }

  google.earth.addEventListener(placemark, "click", 
                                window.geEventListener);
}
