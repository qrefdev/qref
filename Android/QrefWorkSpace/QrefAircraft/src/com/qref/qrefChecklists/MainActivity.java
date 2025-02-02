package com.qref.qrefChecklists;

import java.io.File;

import android.inputmethodservice.InputMethodService;
import android.os.*;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.json.JSONObject;

import com.android.vending.billing.IInAppBillingService;
import com.qref.qrefChecklists.util.Base64;

import android.os.Bundle;
import android.preference.PreferenceManager;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.res.Configuration;
import android.util.Log;
import android.view.Menu;
import android.view.View;

import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.SslErrorHandler;
import android.net.http.SslError;
import android.widget.ImageView;

public class MainActivity extends Activity {
	protected WebView webView;
	protected IInAppBillingService billingService;
	protected ServiceConnection serviceConnection;
	protected ArrayList<QrefProduct> purchases;
	protected ArrayList<String> pendingPurchases;
	protected ImageView splash;
	protected InputMethodService input;
	protected boolean isInputShown;
	
	@SuppressLint("NewApi")
	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        this.purchases = new ArrayList<QrefProduct>();
        this.pendingPurchases = new ArrayList<String>();
        
        trustAllHosts();
        
        this.webView = (WebView)findViewById(R.id.webView);
        
        this.splash = (ImageView)findViewById(R.id.splash);
        
        this.webView.getSettings().setJavaScriptEnabled(true);
        this.webView.getSettings().setAppCacheEnabled(false);
        this.webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
        	this.webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        	this.webView.getSettings().setAllowFileAccessFromFileURLs(true);
        }
        
    	this.webView.getSettings().setAllowContentAccess(true);
        
        this.webView.getSettings().setAllowFileAccess(true);
    	this.webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
    	this.webView.getSettings().setBlockNetworkImage(false);
    	this.webView.getSettings().setLoadsImagesAutomatically(true);
        
    	
        this.webView.getSettings().setSaveFormData(false);
        this.webView.getSettings().setSavePassword(false);
        
        Handler mhandler = new Handler();
        
        this.webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        this.webView.setWebChromeClient(new ChromeClient());
        this.webView.addJavascriptInterface(new QrefInterface(this, PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext()), this.getApplicationContext(), this.webView, mhandler), "QrefInterface");
        
        this.webView.setWebViewClient(new QrefWebViewClient());
        
        try {
        	InputStream input = null;
        	
        	if(MainActivity.isTablet(this)) {
        		input = getAssets().open("tabletView.html");
        	}
        	else {
        		input = getAssets().open("phoneView.html");
        	}
        	
        	int size = input.available();
        	byte[] buffer = new byte[size];
        	input.read(buffer);
        	input.close();
        	
        	String view = new String(buffer);
        	
        	this.webView.loadDataWithBaseURL("file:///android_asset/", view, "text/html", "UTF-8", null);
        	this.webView.clearCache(true);
        	this.webView.clearSslPreferences();
        	//this.webView.loadUrl("file:///android_asset/phoneView.html");
        } catch (Exception e)
        {
        	
        }
        
        try {
        	this.serviceConnection = new ServiceConnection() {
        		@Override
        		public void onServiceDisconnected(ComponentName name) {
        			MainActivity.this.billingService = null;
        		}
        		
        		public void onServiceConnected(ComponentName name, IBinder service) {
        			MainActivity.this.billingService = IInAppBillingService.Stub.asInterface(service);
        		}
        	};
        	
        	this.bindService(new Intent("com.android.vending.billing.InAppBillingService.BIND"), this.serviceConnection, Context.BIND_AUTO_CREATE);
        } catch (Exception e) {
        	
        }
    }
    
	public static boolean isTablet(Context context) {
	    return (context.getResources().getConfiguration().screenLayout
	            & Configuration.SCREENLAYOUT_SIZE_MASK)
	            >= Configuration.SCREENLAYOUT_SIZE_LARGE;
	}
	
    public void hideSplash() {
    	this.splash.setVisibility(View.GONE);
    }
    
    public void getPreviousPurchases() {
    	try {
    		Bundle items = this.billingService.getPurchases(3, this.getPackageName(), "inapp", null);
    	
    		int response = items.getInt("RESPONSE_CODE");
    		
    		if(response == 0) {
    			ArrayList<String> purchaseDatas = items.getStringArrayList("INAPP_PURCHASE_DATA_LIST");
    			ArrayList<String> signatures = items.getStringArrayList("INAPP_DATA_SIGNATURE_LIST");
    			String continuationToken = items.getString("INAPP_CONTINUATION_TOKEN");
    			
    			for(int i = 0; i < purchaseDatas.size(); i++) {
    				QrefProduct product = new QrefProduct();
    				
    				try {
	    				product.purchaseData = new JSONObject(purchaseDatas.get(i));
	    				product.signature = signatures.get(i);
	    				product.sku = product.purchaseData.getString("productId");
	    				
	    				JSONObject receipt = new JSONObject();
    					receipt.put("signature", product.signature);
    					receipt.put("purchaseData", purchaseDatas.get(i));
    					
    					product.receipt = receipt;
    					
	    				if(!this.purchases.contains(product))
	    					this.purchases.add(product);
    				} catch (Exception ex) {
    					
    				}
    			}
    			
    			if(continuationToken != null)
    				this.getPreviousPurchases();
    			else
    				return;
    		}
    		
    	} catch (Exception e) {
    		return;
    	}
    }
    
    @Override
    public void onDestroy() {
    	super.onDestroy();
    	if(this.serviceConnection != null) {
    		this.unbindService(this.serviceConnection);
    	}
    }
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
    	if(requestCode == 3459) {
    		int responseCode = data.getIntExtra("RESPONSE_CODE", -1);
    		String purchaseData = data.getStringExtra("INAPP_PURCHASE_DATA");
    		String signature = data.getStringExtra("INAPP_DATA_SIGNATURE");
    		
    		if(resultCode == RESULT_OK) {
    			if(responseCode == 0) {
	    			try {
	    				JSONObject jo = new JSONObject(purchaseData);
	    				String sku = jo.getString("productId");
	    				QrefProduct product = new QrefProduct();
	    				product.sku = sku;
	    				product.signature = signature;
	    				product.purchaseData = jo;
	    				
	    				JSONObject receipt = new JSONObject();
    					receipt.put("signature", product.signature);
    					receipt.put("purchaseData", purchaseData);
	    				
    					product.receipt = receipt;
    					
	    				String pendingId = product.purchaseData.getString("developerPayload");
	    				
	    				if(this.pendingPurchases.contains(pendingId)) {
	    					this.purchases.add(product);
	    					
	    					String encodedReceiptData = Base64.encode(receipt.toString().getBytes());
	    					
	    					this.webView.loadUrl("javascript:SendReceipt('" + encodedReceiptData + "');");
	    				
	    					this.pendingPurchases.remove(pendingId);
	    				}
	    				else {
	    					this.webView.loadUrl("javascript:PurchaseFailed();");
	    				}
	    			}
	    			catch (Exception e) {
	    				this.webView.loadUrl("javascript:PurchaseFailed();");
	    			}
    			}
    			else if(responseCode == 1) {
    				this.webView.loadUrl("javascript:PurchaseCanceled();");
    			}
    			else if(responseCode == 3 || responseCode == 5 || responseCode == 6 || responseCode == 7) {
    				this.webView.loadUrl("javascript:PurchaseFailed();");
    			}
    			else if(responseCode == 4) {
    				this.webView.loadUrl("javascript:InvalidProduct();");
    			}
    		}
    		else if(resultCode == RESULT_CANCELED) {
    			this.webView.loadUrl("javascript:PurchaseCanceled();");
    		}
    	}
    }
    
    public IInAppBillingService getInAppService() {
    	return this.billingService;
    }
    
    public ArrayList<QrefProduct> getPurchases() {
    	return this.purchases;
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }
    
    public boolean purchase(String productId) {
    	if(this.userOwnsProduct(productId)) {
    		QrefProduct product = this.getPurchaseByProductId(productId);
    		
    		if(product != null) {
    			try {
    				String encodedReceiptData = Base64.encode(product.receipt.toString().getBytes());
					
					this.webView.loadUrl("javascript:SendReceipt('" + encodedReceiptData + "');");
	    			
	    			return true;
    			} catch (Exception e) {
    				this.webView.loadUrl("javascript:PurchaseFailed();");
    				
    				return false;
    			}
    		}
    		else {
    			this.webView.loadUrl("javascript:PurchaseFailed();");
    			
    			return false;
    		}
    	}
    	
    	try {
    		Bundle buyIntentBundle = this.billingService.getBuyIntent(3, this.getPackageName(), productId, "inapp", this.getNewPendingId());
    	
    		PendingIntent pendingBuy = buyIntentBundle.getParcelable("BUY_INTENT");
    		
    		this.startIntentSenderForResult(pendingBuy.getIntentSender(), 3459, new Intent(), Integer.valueOf(0), Integer.valueOf(0), Integer.valueOf(0));
    		
    	}  catch (Exception e) {
    		this.webView.loadUrl("javascript:PurchaseFailed();");
    		return false;
    	}
    	
    	return true;
    }
    
    private String getNewPendingId() {
    	String id = (Double.valueOf(Math.random() * 100000)).toString();
    	
    	String encoded = Base64.encode(id.getBytes());
    	
    	if(!this.pendingPurchases.contains(encoded)) {
    		this.pendingPurchases.add(encoded);
    		return encoded;
    	}
    	else {
    		return this.getNewPendingId();
    	}
    }
    
    private QrefProduct getPurchaseByProductId(String productId) {
    	for(int i = 0; i < this.purchases.size(); i++) {
    		QrefProduct product = this.purchases.get(i);
    		try {
    			if(product.sku.equals(productId))
    				return product;
    		} catch (Exception e) {
    			
    		}
    	}
    	
    	return null;
    }
    
    private boolean userOwnsProduct(String productId) {
    	
    	for(int i = 0; i < this.purchases.size(); i++) {
    		QrefProduct product = this.purchases.get(i);
    		try {
    			if(product.sku.equals(productId))
    				return true;
    		} catch (Exception e) {
    			
    		}
    	}
    	
    	return false;
    }
    
    private static void trustAllHosts() {
        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
            @Override
            public void checkClientTrusted(
                    java.security.cert.X509Certificate[] x509Certificates,
                    String s) throws java.security.cert.CertificateException {
            }

            @Override
            public void checkServerTrusted(
                    java.security.cert.X509Certificate[] x509Certificates,
                    String s) throws java.security.cert.CertificateException {
            }

            @Override
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return new java.security.cert.X509Certificate[] {};
            }
        } };

        // Install the all-trusting trust manager
        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection
                    .setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
