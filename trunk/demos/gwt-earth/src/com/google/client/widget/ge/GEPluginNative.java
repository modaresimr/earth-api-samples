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

public class GEPluginNative {

	public static native JavaScriptObject createPlacemark(JavaScriptObject ge, String s)/*-{
		return ge.createPlacemark(s);
	}-*/;

	public static native JavaScriptObject createPoint(JavaScriptObject ge, String s)/*-{
		return ge.createPoint(s);
	}-*/;
	
	public static native JavaScriptObject createIcon(JavaScriptObject ge, String s)/*-{
		return ge.createIcon(s);
	}-*/;

	
	public static native JavaScriptObject createLookAt(JavaScriptObject ge, String s)/*-{
		return ge.createLookAt(s);
	}-*/;
	
	public static native JavaScriptObject createScreenOverlay(JavaScriptObject ge, String s)/*-{
		return ge.createScreenOverlay(s);
	}-*/;

	
	public static native JavaScriptObject getView(JavaScriptObject ge)/*-{
		return ge.getView();
	}-*/;

	public static native JavaScriptObject getDocument(JavaScriptObject ge)/*-{
		return ge.getDocument();
	}-*/;
	
	public static native JavaScriptObject parseKml(JavaScriptObject ge, String s)/*-{
		return ge.parseKml(s);
	}-*/;
	
	/** Does not work ! */
	public static native String getEarthVersion(JavaScriptObject ge)/*-{
		return ge.getEearthVersion();
	}-*/;
	
	/** Does not work ! */
	public static native String getPluginVersion(JavaScriptObject ge)/*-{
		return ge.getPluginVersion();
	}-*/;
	
	public static native JavaScriptObject getFeatures(JavaScriptObject ge)/*-{
	return ge.getFeatures();	
}-*/;
}
