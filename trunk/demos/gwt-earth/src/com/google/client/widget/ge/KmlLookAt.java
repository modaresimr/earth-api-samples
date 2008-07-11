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

public class KmlLookAt extends GEJavaScriptObject {

	public KmlLookAt(JavaScriptObject impl) {
		super(impl);
	}
	
	public double getLatitude() {
		return getLatitudeImpl(getImpl());
	}
	private native double getLatitudeImpl(JavaScriptObject impl) /*-{
		return impl.getLatitude();
	}-*/;

	public double getLongitude() {
		return getLongitudeImpl(getImpl());
	}
	private native double getLongitudeImpl(JavaScriptObject impl) /*-{
		return impl.getLongitude();
	}-*/;
	
	public void set(double a, double b, double c, double d, double e, double f, int g){ 
		setImpl(getImpl(), a, b, c, d, e, f, g);
	}
	
	private native void setImpl(JavaScriptObject impl, double a, double b, double c, double d, double e, double f, int g) /*-{
		impl.set(a, b, c, d, e, f, g);
	}-*/;
}
