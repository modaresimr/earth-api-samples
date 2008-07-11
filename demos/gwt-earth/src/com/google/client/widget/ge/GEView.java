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

public class GEView extends GEJavaScriptObject {

	public GEView(JavaScriptObject impl) {
		super(impl);
	}
	
	/**
	 * Doesn't work !
	 * @return
	 */
	public KmlLookAt asLookAt() {
		return new KmlLookAt(getImpl());
	}

	public void getAbstractView(KmlLookAt la) {
		getAbstractViewImpl(getImpl(), la.getImpl());
	}
	
	public void setAbstractView(KmlLookAt la) {
		setAbstractViewImpl(getImpl(), la.getImpl());
	}
	
	private native void getAbstractViewImpl(JavaScriptObject impl,
			JavaScriptObject la) /*-{
		impl.getAbstractView(la);	
	}-*/;
	
	private native void setAbstractViewImpl(JavaScriptObject impl,
			JavaScriptObject la) /*-{
		impl.setAbstractView(la);	
	}-*/;

	public KmlLookAt copyAsLookAt(int alt) {
		// TODO Auto-generated method stub
		return new KmlLookAt(copyAsLookAtImpl(getImpl(), alt));
	}
	private native JavaScriptObject copyAsLookAtImpl(JavaScriptObject impl,
			int alt) /*-{
		return impl.copyAsLookAt(alt);	
	}-*/;
	
}
