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

public class KmlScreenOverlay extends KmlOverlay {

	public KmlScreenOverlay(JavaScriptObject impl) {
		super(impl);
	}

	public KmlIcon getIcon() {
		return new KmlIcon(getIconImpl(getImpl()));
	}
	
	public void setIcon(KmlIcon icon) {
		setIconImpl(getImpl(), icon.getImpl());
	}
	
	public KmlOverlayXY getOverlayXY() {
		return new KmlOverlayXY(getOverlayXYImpl(getImpl()));
	}
	
	public KmlRotationXY getRotationXY() {
		return new KmlRotationXY(getRotationXYImpl(getImpl()));
	}
	
	public KmlSize getSize() {
		return new KmlSize(getSizeImpl(getImpl()));
	}
	
	public void setRotation(int rot) {
		setRotationImpl(getImpl(), rot);
	}
	
	public native JavaScriptObject getIconImpl(JavaScriptObject impl)
	/*-{
		return impl.getIcon();	
	}-*/;
	
	public native void setIconImpl(JavaScriptObject impl,
			JavaScriptObject icon)
	/*-{
		impl.setIcon(icon);	
	}-*/;
	
	
	public native JavaScriptObject getOverlayXYImpl(JavaScriptObject impl)
	/*-{
		return impl.getOverlayXY();	
	}-*/;
	public native JavaScriptObject getRotationXYImpl(JavaScriptObject impl)
	/*-{
		return impl.getRotationXY();	
	}-*/;
	public native JavaScriptObject getSizeImpl(JavaScriptObject impl)
	/*-{
		return impl.getSize();	
	}-*/;
	public native void setRotationImpl(JavaScriptObject impl, int rot)
	/*-{
		return impl.setRotation(rot);	
	}-*/;
}
