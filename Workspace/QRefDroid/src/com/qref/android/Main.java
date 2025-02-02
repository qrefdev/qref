package com.qref.android;

import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class Main extends Activity {

    @SuppressLint("SetJavaScriptEnabled")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView view = (WebView)this.findViewById(R.id.mainWebView);     
        if (view != null) {
        	WebSettings settings = view.getSettings();
        	settings.setJavaScriptEnabled(true);
        	settings.setLightTouchEnabled(false);
        	settings.setSupportZoom(false);
        	settings.setUseWideViewPort(true);
        	settings.setBuiltInZoomControls(false);
        	
        	view.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        	view.setWebChromeClient(new WebChromeClient());
        	//view.setWebViewClient(new WebViewClient());
        	view.loadUrl("file:///android_asset/web/phoneView.html");
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.showHomeMenuItem:
			this.showHomeScreen();
			return true;
		case R.id.showLoginMenuItem:
			this.showLoginScreen();
			return true;
		default: 
			return super.onOptionsItemSelected(item);
		}
	}
	
	private void showLoginScreen() {
		WebView view = (WebView)this.findViewById(R.id.mainWebView);
        
        if (view != null) {
        	view.loadUrl("file:///android_asset/web/phoneView.html#signin");
        }
	}
	
	private void showHomeScreen() {
		WebView view = (WebView)this.findViewById(R.id.mainWebView);
        
        if (view != null) {
        	view.loadUrl("file:///android_asset/web/phoneView.html#home");
        }
	}
    
    
}
