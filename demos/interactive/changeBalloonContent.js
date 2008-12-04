// Change the content of the current balloon.
var balloon = ge.getBalloon();
if (balloon) {
  // Pigeon Rank
  var content = 
    '<img src="http://www.google.com/technology/pigeon_system.jpg">' +
    '<br>PigeonRank&#153; Technology';
  balloon.setFeature(window.placemark);
  balloon.setMaxWidth(800);
  
  if (balloon.getType() == 'GEHtmlStringBalloon') {
    balloon.setContentString(content);
  } else if (balloon.getType() == 'GEHtmlDivBalloon') {
    var div = document.createElement('DIV');
    div.innerHTML = content;
    balloon.setContentDiv(div);
  } else if (balloon.getType() == 'GEFeatureBalloon' &&
             window.placemark) {
    window.placemark.setDescription(content);
  }
}
