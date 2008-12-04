// Create a 3D model from a Collada file, and place it on Earth

// ===================================================================
// NOTE: This sample will not work if the page is loaded from local 
// disk (file://C/PATH...) because the Earth Browser Plug-in does not
// support loading local files from disk, for security reasons.
// ===================================================================

// get the current camera location
var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

// create the model geometry
var model = ge.createModel('');

// set up the model's location
var loc = ge.createLocation('');
loc.setLatitude(lookAt.getLatitude());
loc.setLongitude(lookAt.getLongitude());
model.setLocation(loc);

// set up the model's link (must be a COLLADA file).
// this model was created in SketchUp
var link = ge.createLink('');
model.setLink(link);
link.setHref('http://earth-api-samples.googlecode.com/svn/trunk/' +
             'examples/static/splotchy_box.dae');

// create the model placemark and add it to Earth
var modelPlacemark = ge.createPlacemark('');
modelPlacemark.setGeometry(model);
ge.getFeatures().appendChild(modelPlacemark);

// zoom in on the model
lookAt.setRange(300);
lookAt.setTilt(80);
ge.getView().setAbstractView(lookAt);

// persist the placemark for other interactive samples
window.placemark = modelPlacemark;