// first create the KmlLink
var link = ge.createLink('');
link.setHref('http://kml-samples.googlecode.com' +
             '/svn/trunk/kml/NetworkLink/placemark.kml');

// create the network link and add it to Earth
var networkLink = ge.createNetworkLink('');
networkLink.setDescription('NetworkLink open to fetched content');
networkLink.setName('Open NetworkLink');
networkLink.setFlyToView(true);
networkLink.setLink(link);
ge.getFeatures().appendChild(networkLink);