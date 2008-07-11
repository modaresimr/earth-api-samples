package com.google.client.widget.ge;

import com.google.gwt.core.client.JavaScriptObject;

public class KmlPlacemark extends KmlFeature {

	public KmlPlacemark(JavaScriptObject impl) {
		super(impl);
	}
	
	public void setGeometry(KmlGeometry geo) {
		setGeometryImpl(getImpl(), geo.getImpl());
	}
	
	public native void setGeometryImpl(JavaScriptObject impl,
			JavaScriptObject geoImpl) /*-{
		impl.setGeometry(geoImpl);	
	}-*/;
}
