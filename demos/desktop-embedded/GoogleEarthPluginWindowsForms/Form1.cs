/*
Copyright 2008 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
using System;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using GEPlugin;

namespace GoogleEarthPluginWindowsForms
{
    [ComVisibleAttribute(true)]
    [PermissionSet(SecurityAction.Demand, Name="FullTrust")]
    public partial class Form1 : Form
    {
        private const string PLUGIN_URL =
            @"http://earth-api-samples.googlecode.com/svn/trunk/demos/desktop-embedded/pluginhost.html";

        private IGEPlugin m_ge = null;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            toolPanel.Enabled = false;
            webBrowserCtrl.Navigate(PLUGIN_URL);
            webBrowserCtrl.ObjectForScripting = this;
        }

        // called from initCallback in JavaScript
        public void JSInitSuccessCallback_(object pluginInstance)
        {
            m_ge = (IGEPlugin)pluginInstance;
            toolPanel.Enabled = true;
        }

        // called from failureCallback in JavaScript
        public void JSInitFailureCallback_(string error)
        {
            MessageBox.Show("Error: " + error, "Plugin Load Error", MessageBoxButtons.OK,
                MessageBoxIcon.Exclamation);
        }

        private void createPlacemarkBtn_Click(object sender, EventArgs e)
        {
            webBrowserCtrl.Document.InvokeScript("JSCreatePlacemarkAtCameraCenter",
                new object[] { placemarkNameTxt.Text });

            // NOTE: because on Windows, the Google Earth Plug-in exposes COM interfaces,
            // we could've also done this directly in C#:
            /*
            if (m_ge != null)
            {
                KmlLookAtCoClass lookAt = m_ge.getView().copyAsLookAt(m_ge.ALTITUDE_RELATIVE_TO_GROUND);

                // create a point
                KmlPointCoClass point = m_ge.createPoint("");
                point.setLatitude(lookAt.getLatitude());
                point.setLongitude(lookAt.getLongitude());

                // create a placemark
                KmlPlacemarkCoClass placemark = m_ge.createPlacemark("");
                placemark.setName(placemarkNameTxt.Text);
                placemark.setDescription("This was created from .NET");
                placemark.setGeometry(point);

                // add the placemark to the plugin
                m_ge.getFeatures().appendChild(placemark);
            }
            */
        }
    }
}
