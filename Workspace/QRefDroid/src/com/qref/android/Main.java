package com.qref.android;

import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

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
        	
        	//view.setWebChromeClient(new WebChromeClient());
        	view.setWebViewClient(new WebViewClient());
        	view.loadUrl("file:///android_asset/web/phoneView.html");
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
}
