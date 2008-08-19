// Change the context of the current balloon.
var feature = null;
if (window.placemark) {
  feature = window.placemark;
}
var balloon = ge.getBalloon();
if (balloon) {
  // Pigeon Rank
  var content = 
    '<img src="http://www.google.com/technology/pigeon_system.jpg">' +
    '<br>PigeonRank&#153; Technology';
  balloon.setFeature(feature);
  balloon.setMaxWidth(800);
  if (balloon.getType() == 'GEHtmlStringBalloon') {
    balloon.setContentString(content);
  } else if (balloon.getType() == 'GEHtmlDivBalloon') {
    var div = document.createElement('DIV');
    div.innerHTML = content;
    balloon.setContentDiv(div);
  } else if (balloon.getType() == 'GEFeatureBalloon') {
    feature.setDescription(content);
  }
}
