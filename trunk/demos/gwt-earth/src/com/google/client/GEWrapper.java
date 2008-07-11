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
import com.google.client.widget.GoogleEarthWidget;
import com.google.client.widget.ge.GEPlugin;
import com.google.client.widget.ge.KmlFeature;
import com.google.client.widget.ge.KmlLookAt;
import com.google.client.widget.ge.KmlObject;
import com.google.client.widget.ge.KmlPlacemark;
import com.google.client.widget.ge.KmlPoint;
import com.google.client.widget.ge.KmlScreenOverlay;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.ui.ClickListener;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PushButton;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;

public class GEWrapper extends Composite implements GEPluginReadyListener {
	public GEWrapper() {
		vp.add(gew);
		vp.setCellHeight(gew, "500px");
		gew.addPluginReadyListener(this);
		initWidget(vp);
	}

	public void pluginReady(JavaScriptObject g) {
		placemark.add(placemarkLabel);
		placemark.add(placemarkName);
		placemark.add(addPlacemark);
		addPlacemark.addClickListener(new ClickListener() {
			public void onClick(Widget sender) {
				KmlPlacemark placemark = gew.getGEPlugin().createPlacemark("");
				placemark.setStyleUrl( 
				  "root://styleMaps#default_copy0+" +
				  "nicon=http://maps.google.com/mapfiles/kml/paddle/red-circle.png+" +
				  "hicon=http://maps.google.com/mapfiles/kml/paddle/red-circle.png");
				KmlPoint point = gew.getGEPlugin().createPoint("");
				placemark.setGeometry(point);

				KmlLookAt la = gew.getGEPlugin().getView().copyAsLookAt(gew.getGEPlugin().ALTITUDE_RELATIVE_TO_GROUND);
				point.setLatitude(la.getLatitude());
				point.setLongitude(la.getLongitude());
				placemark.setName(placemarkName.getText());

				gew.getGEPlugin().getFeatures().appendChild(placemark);
			}			
		});
		vp.add(placemark);
		
		screenOverlay.add(screenOverlayLabel);
		screenOverlay.add(addScreenOverlay);
		addScreenOverlay.addClickListener(new ClickListener() {
			public void onClick(Widget sender) {
				KmlScreenOverlay screenOverlay = gew.getGEPlugin().createScreenOverlay("");
				screenOverlay.setIcon(gew.getGEPlugin().createIcon(""));
				screenOverlay.getIcon().
				  setHref("http://www.google.com/intl/en_ALL/images/logo.gif");
	
				// Set screen position in pixels
				screenOverlay.getOverlayXY().setXUnits(gew.getGEPlugin().UNITS_PIXELS);
				screenOverlay.getOverlayXY().setYUnits(gew.getGEPlugin().UNITS_PIXELS);
				screenOverlay.getOverlayXY().setX(400);
				screenOverlay.getOverlayXY().setY(200);
	
				// Rotate around object's center point
				screenOverlay.getRotationXY().setXUnits(gew.getGEPlugin().UNITS_FRACTION);
				screenOverlay.getRotationXY().setYUnits(gew.getGEPlugin().UNITS_FRACTION);
				screenOverlay.getRotationXY().setX(0.5);
				screenOverlay.getRotationXY().setY(0.5);
	
				// Set object's size in pixels
				screenOverlay.getSize().setXUnits(gew.getGEPlugin().UNITS_PIXELS);
				screenOverlay.getSize().setYUnits(gew.getGEPlugin().UNITS_PIXELS);
				screenOverlay.getSize().setX(300);
				screenOverlay.getSize().setY(75);
	
				// Rotate 45 degrees
				screenOverlay.setRotation(45);
	
				gew.getGEPlugin().getFeatures().appendChild(screenOverlay);
			}

		});
		vp.add(screenOverlay);
		
		parseKmlButton.addClickListener(new ClickListener() {
			public void onClick(Widget sender) {
				KmlFeature pentagon = gew.getGEPlugin().parseKml(
						  "<?xml version='1.0' encoding='UTF-8'?>" +
						  "<kml xmlns='http://earth.google.com/kml/2.1'>" +
						  "  <Placemark>" +
						  "    <name>The Pentagon</name>" +
						  "    <Polygon>" +
						  "      <extrude>1</extrude>" +
						  "      <altitudeMode>relativeToGround</altitudeMode>" +
						  "      <outerBoundaryIs>" +
						  "        <LinearRing>" +
						  "          <coordinates>" +
						  "            -77.05788457660967,38.87253259892824,100 " +
						  "            -77.05465973756702,38.87291016281703,100 " +
						  "            -77.05315536854791,38.87053267794386,100 " +
						  "            -77.05552622493516,38.868757801256,100 " +
						  "            -77.05844056290393,38.86996206506943,100 " +
						  "            -77.05788457660967,38.87253259892824,100" +
						  "          </coordinates>" +
						  "        </LinearRing>" +
						  "      </outerBoundaryIs>" +
						  "      <innerBoundaryIs>" +
						  "        <LinearRing>" +
						  "          <coordinates>" +
						  "            -77.05668055019126,38.87154239798456,100 " +
						  "            -77.05542625960818,38.87167890344077,100 " +
						  "            -77.05485125901024,38.87076535397792,100 " +
						  "            -77.05577677433152,38.87008686581446,100 " +
						  "            -77.05691162017543,38.87054446963351,100 " +
						  "            -77.05668055019126,38.87154239798456,100" +
						  "          </coordinates>" +
						  "        </LinearRing>" +
						  "      </innerBoundaryIs>" +
						  "    </Polygon>" +
						  "  </Placemark>" +
						  "</kml>");

						gew.getGEPlugin().getFeatures().appendChild(pentagon);

						KmlLookAt la = gew.getGEPlugin().createLookAt("");
						la.set(38.867, -77.0565, 500,
								gew.getGEPlugin().ALTITUDE_RELATIVE_TO_GROUND,
								0, 45, 900);
						gew.getGEPlugin().getView().setAbstractView(la);
			}
		});
		vp.add(parseKmlButton);
	}
	
	
	private VerticalPanel vp = new VerticalPanel();
	public GoogleEarthWidget gew = new GoogleEarthWidget();
	
	private HorizontalPanel placemark = new HorizontalPanel();
	private Label placemarkLabel = new Label("Add a placemark");
	private TextBox placemarkName = new TextBox();
	private PushButton addPlacemark = new PushButton("Add");
	
	private HorizontalPanel screenOverlay = new HorizontalPanel();
	private Label screenOverlayLabel = new Label("Add a screen overlay");
	private PushButton addScreenOverlay = new PushButton("Add");
	
	private PushButton parseKmlButton = new PushButton("Parse KML (Pentagone)");
}
