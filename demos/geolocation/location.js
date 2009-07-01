/*
Copyright 2009 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Watches the user's current location, continually calling the successCallback
 * with a Gears Coords-like object (latitude, longitude, accuracy) or
 * errorCallback with an error object. The second argument to successCallback
 * will be the location provider, i.e. 'gears', 'html5', or 'ip'.
 */
function watchLocation(successCallback, errorCallback, ipFallback) {
  successCallback = successCallback || function(){};
  errorCallback = errorCallback || function(){};

  if (typeof ipFallback == 'undefined')
    ipFallback = true;

  // Set up IP-based fallback
  var tryIPLocation = function(passthruError) {
    var error = passthruError || new Error('Location could not be determined.');

    if (ipFallback) {
      // Try IP-based geolocation.
      if (google.loader.ClientLocation) {
        successCallback({
          latitude: google.loader.ClientLocation.latitude,
          longitude: google.loader.ClientLocation.longitude,
          accuracy: -1
        }, 'ip');
      } else {
        errorCallback(error);
      }
    } else {
      errorCallback(error);
    }
  };

  var locationProvider = 'html5';
  
  // Try HTML5-spec geolocation.
  var geolocation = navigator.geolocation;

  // Try Gears geolocation.
  if (!geolocation && window.google && google.gears) {
    geolocation = google.gears.factory.create('beta.geolocation');
    locationProvider = 'gears';
  }

  if (geolocation) {
    // We have a real geolocation service.
    try {
      function handleSuccess(position) {
        successCallback(position.coords, locationProvider);
      }
      
      geolocation.watchPosition(handleSuccess, errorCallback, {
        enableHighAccuracy: true,
        maximumAge: 5000 // 5 sec.
      });
    } catch (err) {
      tryIPLocation(err);  // Pass-through error.
    }
  } else {
    tryIPLocation();
  }
}
