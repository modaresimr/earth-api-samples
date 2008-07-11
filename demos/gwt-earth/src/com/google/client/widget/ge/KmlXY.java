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

public class KmlXY extends KmlObject {
	public static final int UNITS_PIXELS = 0;
	public static final int UNITS_FRACTION = 1;
	public static final int UNITS_INSET_PIXELS = 2;
	
	public KmlXY(JavaScriptObject impl) {
		super(impl);
	}

	public void setXUnits(int unit) {
		setXUnitsImpl(getImpl(), unit);
	}
	
	private native void setXUnitsImpl(JavaScriptObject impl, int unit) /*-{
	  impl.setXUnits(unit);		
	}-*/;
	
	public void setYUnits(int unit) {
		setYUnitsImpl(getImpl(), unit);
	}
	
	private native void setYUnitsImpl(JavaScriptObject impl, int unit) /*-{
	  impl.setYUnits(unit);		
	}-*/;
	
	public void setX(double x) {
		setXImpl(getImpl(), x);
	}
	
	private native void setXImpl(JavaScriptObject impl, double x) /*-{
	  impl.setX(x);		
	}-*/;
	
	public void setY(double y) {
		setYImpl(getImpl(), y);
	}
	
	private native void setYImpl(JavaScriptObject impl, double y) /*-{
	  impl.setY(y);		
	}-*/;
}
