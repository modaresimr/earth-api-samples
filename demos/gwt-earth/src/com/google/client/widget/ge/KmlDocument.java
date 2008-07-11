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

public class KmlDocument extends KmlContainer {

	public KmlDocument(JavaScriptObject impl) {
		super(impl);
	}
	
	public KmlFeatures getFeatures() {
		return new KmlFeatures(getFeaturesImpl(getImpl()));
	}
	
	public native JavaScriptObject getFeaturesImpl(JavaScriptObject impl)
	/*-{
		return impl.getFeatures();	
	}-*/;
}
