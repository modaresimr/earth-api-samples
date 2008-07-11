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
package com.google.client;

import com.google.client.widget.GEPluginReadyListener;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.ui.ClickListener;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.PushButton;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SourcesTabEvents;
import com.google.gwt.user.client.ui.TabListener;
import com.google.gwt.user.client.ui.TabPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class GwtEarth implements EntryPoint, ClickListener, TabListener, GEPluginReadyListener {

  /**
   * This is the entry point method.
   */
  public void onModuleLoad() {
	  tabPanel.setSize("95%", "95%");
	  RootPanel.get().add(tabPanel);
	  VerticalPanel vp = new VerticalPanel();
	  vp.add(new HTML(
			  "<p>Welcome to Google Earth In GWT demo.</p>" +
			  "<p>To add a new Google Earth tab, click the button below.</p>"));
	  vp.add(pb);
	  tabPanel.add(vp, "Welcome !");
	  tabPanel.selectTab(0);
	  pb.addClickListener(this);
	  tabPanel.addTabListener(this);
  }
  
  public void onClick(Widget sender) {
	  // Create the Plugin, but don't load it
	  // We need to make sure that all HTML elements are created before
	  // We also need to be sure that the Google Earth Plugin container is visible
	  //   else, the behavior is undefined. 
	  GEWrapper gew = new GEWrapper();
	  gew.gew.addPluginReadyListener(this);
	  tabPanel.add(gew, "Plugin #" + cpt++);
	  tabPanel.selectTab(tabPanel.getWidgetCount() - 1);
	  // We don't want another Plugin to be created while another is loading.
	  // Else, the behavior is undefined.
	  pb.setEnabled(false);
	  // We don't want to switch tab before the plugin is loaded.
	  blocked=true;
	  
	  // Now we can load the plugin.
	  gew.gew.init();
  }
  
  // Don't switch tab if we are loading a plugin
  public boolean onBeforeTabSelected(SourcesTabEvents sender, int tabIndex) {
	  return !blocked;
  }

  public void onTabSelected(SourcesTabEvents sender, int tabIndex) {
  }

  // When the plugin is loaded, onlock everything
  public void pluginReady(JavaScriptObject ge) {
	  blocked = false;
	  pb.setEnabled(true);
  }

  private TabPanel tabPanel = new TabPanel();
  private PushButton pb = new PushButton("Add another Google Earth Plugin");
  private boolean blocked = false;
  private static int cpt = 1;
}
