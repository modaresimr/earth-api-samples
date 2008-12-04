// create a div with the balloon content
var div = document.createElement('DIV');
div.innerHTML = '<img src="http://www.google.com/googlegulp/images/logo.gif">' +
                '<br><a href="http://www.google.com/googlegulp/">' +
                'Google Gulp</a>';

// create the balloon and show it in Earth
var balloon = ge.createHtmlDivBalloon('');
balloon.setMaxWidth(800);
balloon.setFeature(window.placemark);
balloon.setContentDiv(div);
ge.setBalloon(balloon);
