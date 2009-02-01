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
namespace GoogleEarthPluginWindowsForms
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.toolPanel = new System.Windows.Forms.Panel();
            this.webBrowserCtrl = new System.Windows.Forms.WebBrowser();
            this.panel2 = new System.Windows.Forms.Panel();
            this.createPlacemarkBtn = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.placemarkNameTxt = new System.Windows.Forms.TextBox();
            this.toolPanel.SuspendLayout();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // toolPanel
            // 
            this.toolPanel.Controls.Add(this.panel2);
            this.toolPanel.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.toolPanel.Location = new System.Drawing.Point(8, 445);
            this.toolPanel.Margin = new System.Windows.Forms.Padding(0, 8, 0, 0);
            this.toolPanel.Name = "toolPanel";
            this.toolPanel.Size = new System.Drawing.Size(674, 48);
            this.toolPanel.TabIndex = 1;
            // 
            // webBrowserCtrl
            // 
            this.webBrowserCtrl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webBrowserCtrl.Location = new System.Drawing.Point(8, 8);
            this.webBrowserCtrl.MinimumSize = new System.Drawing.Size(20, 20);
            this.webBrowserCtrl.Name = "webBrowserCtrl";
            this.webBrowserCtrl.Size = new System.Drawing.Size(674, 437);
            this.webBrowserCtrl.TabIndex = 2;
            // 
            // panel2
            // 
            this.panel2.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.panel2.Controls.Add(this.createPlacemarkBtn);
            this.panel2.Controls.Add(this.label1);
            this.panel2.Controls.Add(this.placemarkNameTxt);
            this.panel2.Location = new System.Drawing.Point(136, 6);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(403, 37);
            this.panel2.TabIndex = 6;
            // 
            // createPlacemarkBtn
            // 
            this.createPlacemarkBtn.Location = new System.Drawing.Point(281, 5);
            this.createPlacemarkBtn.Name = "createPlacemarkBtn";
            this.createPlacemarkBtn.Size = new System.Drawing.Size(115, 23);
            this.createPlacemarkBtn.TabIndex = 8;
            this.createPlacemarkBtn.Text = "Create Placemark";
            this.createPlacemarkBtn.UseVisualStyleBackColor = true;
            this.createPlacemarkBtn.Click += new System.EventHandler(this.createPlacemarkBtn_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(3, 10);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(91, 13);
            this.label1.TabIndex = 7;
            this.label1.Text = "Placemark Name:";
            // 
            // placemarkNameTxt
            // 
            this.placemarkNameTxt.Location = new System.Drawing.Point(100, 7);
            this.placemarkNameTxt.Name = "placemarkNameTxt";
            this.placemarkNameTxt.Size = new System.Drawing.Size(175, 20);
            this.placemarkNameTxt.TabIndex = 6;
            this.placemarkNameTxt.Text = "Hello, Earth";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(690, 501);
            this.Controls.Add(this.webBrowserCtrl);
            this.Controls.Add(this.toolPanel);
            this.Name = "Form1";
            this.Padding = new System.Windows.Forms.Padding(8);
            this.Text = "Google Earth Plug-in Windows Forms Sample";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.toolPanel.ResumeLayout(false);
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel toolPanel;
        private System.Windows.Forms.WebBrowser webBrowserCtrl;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Button createPlacemarkBtn;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox placemarkNameTxt;

    }
}

