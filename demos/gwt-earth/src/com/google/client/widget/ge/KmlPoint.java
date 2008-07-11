/*
 * Copyright 2008 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 *
 * Author: Samuel Charron
 */
package com.google.client.widget.ge;

import com.google.gwt.core.client.JavaScriptObject;

public class KmlPoint extends KmlExtrudableGeometry {

	public KmlPoint(JavaScriptObject impl) {
		super(impl);
	}

	public void setLatitude(double lat) {
		setLatitudeImpl(getImpl(), lat);
	}
	private native void setLatitudeImpl(JavaScriptObject impl, double lat)/*-{
		impl.setLatitude(lat);
	}-*/;
	
	public void setLongitude(double lat) {
		setLongitudeImpl(getImpl(), lat);
	}
	private native void setLongitudeImpl(JavaScriptObject impl, double lat)/*-{
		impl.setLongitude(lat);
	}-*/;
}
