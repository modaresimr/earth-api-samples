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
#import "SampleController.h"
#import <WebKit/WebFrame.h>
#import <WebKit/WebScriptObject.h>

const NSString *PluginURL =
    @"http://earth-api-samples.googlecode.com/svn/trunk/demos/desktop-embedded/pluginhost.html#geplugin_browserok";

@implementation SampleController

@synthesize controlsEnabled;

// called when all objects in the nib (including the NSWindow) have loaded
- (void)awakeFromNib {
  // start with controls disabled
  [self setControlsEnabled:NO];
  
  // register a loading finished notification observer on the WebView
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(webViewFinishedLoading:)
                                               name:WebViewProgressFinishedNotification
                                             object:webView];
  
  // load the plugin page
  [[webView mainFrame] loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:(NSString *)PluginURL]]];
}

- (void)webViewFinishedLoading:(NSNotification *)notification {
  // set window.external as soon as the web view is done loading
  // the page
  
  // http://developer.apple.com/DOCUMENTATION/AppleApplications/Conceptual/SafariJSProgTopics/Tasks/ObjCFromJavaScript.html
  [[webView windowScriptObject] setValue:self forKey:@"external"];
}

- (IBAction)createPlacemark:(id)sender {
  // call a JS function, passing in the text field's value
  
  // http://developer.apple.com/DOCUMENTATION/Cocoa/Conceptual/DisplayWebContent/Tasks/JavaScriptFromObjC.html
  [[webView windowScriptObject] callWebScriptMethod:@"JSCreatePlacemarkAtCameraCenter"
                                      withArguments:[NSArray arrayWithObjects:[placemarkNameField stringValue], nil]];
}

- (void)JSInitSuccessCallback:(WebScriptObject *)ge {
  // WARNING: don't try to use ge here.. AFAIK, it won't work
  
  // turn on controls when the plugin is initialized
  [self setControlsEnabled:YES];
}

- (void)JSInitErrorCallback:(NSString *)errorString {
  // show an error message upon plugin failure
  NSAlert *alert = [NSAlert new];
  [alert setMessageText:[NSString stringWithFormat:@"Error: %@", errorString]];
  [alert runModal];
}

+ (BOOL)isSelectorExcludedFromWebScript:(SEL)aSelector {
  // expose the success and error callbacks
  if (aSelector == @selector(JSInitSuccessCallback:) ||
      aSelector == @selector(JSInitErrorCallback:))
    return NO;

  return YES;
}

@end
