if (!window.placemark) {
  alert('No placemark; run one of the placemark samples first.');
} else {
  // event listeners can use any functions, even anonymous functions
  google.earth.addEventListener(placemark, 'click', function(event) {
    var text = 'Click:';

    function addToMessage(append1, append2) { 
      text += ' ' + append1 + ': ' + append2 + '\n' ;
    }

    addToMessage('target type', event.getTarget().getType());
    addToMessage('currentTarget type', event.getCurrentTarget().getType());
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
  });
}
