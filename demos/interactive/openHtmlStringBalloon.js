// create the balloon and show it in Earth
var balloon = ge.createHtmlStringBalloon('');
balloon.setMaxWidth(300);
balloon.setFeature(window.placemark);
balloon.setContentString('<img src="http://www.google.com/intl/en_ALL/images/logo.gif"><br>' +
                         '<font size=20>Earth Plugin</font><br><font size=-2>sample info ' +
                         'window</font>');
ge.setBalloon(balloon);