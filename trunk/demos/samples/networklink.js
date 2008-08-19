var networkLink = ge.createNetworkLink("");
networkLink.setDescription("NetworkLink open to fetched content");
networkLink.setName("Open NetworkLink");
networkLink.setFlyToView(true);  
var link = ge.createLink("");
link.setHref("http://kml-samples.googlecode.com" +
             "/svn/trunk/kml/NetworkLink/placemark.kml");
networkLink.setLink(link);
ge.getFeatures().appendChild(networkLink);