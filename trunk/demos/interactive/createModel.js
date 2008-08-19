// Create a 3D model, initialize it from a Collada file, and place it
// in the world.

// ===================================================================
// NOTE: This sample will not work if the page is loaded from local 
// disk (file://C/PATH...) because the Earth Browser Plug-in does not
// support loading local files from disk, for security reasons.
// ===================================================================

placemark = ge.createPlacemark('');
placemark.setName('model');
model = ge.createModel('');
ge.getFeatures().appendChild(placemark);
loc = ge.createLocation('');
model.setLocation(loc);
link = ge.createLink('');

// A textured model created in Sketchup and exported as Collada.
var href = window.location.href;
var pagePath = href.substring(0, href.lastIndexOf('/')) + '/';
link.setHref(pagePath + 'models/splotchy_box.dae.xml');
model.setLink(link);

la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
loc.setLatitude(la.getLatitude());
loc.setLongitude(la.getLongitude());

placemark.setGeometry(model);

la.setRange(300);
la.setTilt(80);
ge.getView().setAbstractView(la);
