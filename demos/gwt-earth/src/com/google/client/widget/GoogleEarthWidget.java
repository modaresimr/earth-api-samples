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
package com.google.client.widget;

import java.util.ArrayList;
import com.google.client.widget.ge.GEPlugin;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;

public class GoogleEarthWidget extends Widget implements GEPluginReadyListener {
	static int id = 0;
	
	public GoogleEarthWidget() {
		HTML html = new HTML(
				"<div class='map3dcontainer' id='map3dcontainer" + id + "'>" + 
				"<div class='map3d' id='map3d" + id + "'></div></div>");
		setElement(html.getElement());
	}
	
	public void init() {
		addPluginReadyListener(this);
		jsInitGE(id);
	}
	
	public void pluginReady(JavaScriptObject ge) {
		this.ge = ge;
		gePlugin = new GEPlugin(ge);
		id++;
	}
	
	public void addPluginReadyListener(GEPluginReadyListener listener) {
		pluginReadyListeners.add(listener);
	}
	
	public GEPlugin getGEPlugin() {
		return gePlugin;
	}
	
	public void ready(JavaScriptObject ge) {
		for (int i = 0; i < pluginReadyListeners.size(); ++i) {
			((GEPluginReadyListener)pluginReadyListeners.get(i)).pluginReady(ge);
		}
	}
	
	private native void jsInitGE(int id) /*-{
		var ge;
		var instance = this;
		function initCB(obj) {
  			ge = obj;
  			ge.getWindow().setVisibility(true);
		  	instance.@com.google.client.widget.GoogleEarthWidget::ready(Lcom/google/gwt/core/client/JavaScriptObject;)(ge);
		}
		function failureCB(object) {
  			alert('load failed');
		}
  		$wnd.google.earth.createInstance($doc.getElementById("map3d" + id), initCB, failureCB);
	}-*/;
	
	private JavaScriptObject ge;
	private GEPlugin gePlugin;
	private ArrayList pluginReadyListeners = new ArrayList();
}
