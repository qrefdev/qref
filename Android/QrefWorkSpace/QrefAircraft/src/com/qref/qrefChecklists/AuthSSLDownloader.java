package com.qref.qrefChecklists;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import android.util.Log;

import java.io.*;

public class AuthSSLDownloader {
    public static final String TAG = AuthSSLDownloader.class.getName();
    protected String imageUrl;
    protected String data;
    protected String method;

    public AuthSSLDownloader(String url, String data, String requestMethod) {
        this.imageUrl = url;
        this.data = data;
        this.method = requestMethod;
        trustAllHosts();
    }

    public InputStream getInputStream() throws Exception {
    	URL url = null;
        try {
            url = new URL(this.imageUrl);
        } catch (MalformedURLException e) {
            Log.e(TAG, e.getMessage(), e);
        }
        
        HttpURLConnection http = null;

        HttpsURLConnection https = (HttpsURLConnection) url
                .openConnection();
        https.setHostnameVerifier(DO_NOT_VERIFY);
        http = https;
        
        http.setRequestMethod(this.method);
        
        if(this.data != null && !this.data.equalsIgnoreCase("undefined") && !this.data.equalsIgnoreCase("null")) {
	        http.setDoOutput(true);
	        http.setRequestProperty("Content-Length", Integer.toString(this.data.length()));
	        http.setRequestProperty("Charset", "utf-8");
	        http.setRequestProperty("Content-Type", "application/json");
	        http.setUseCaches(false);
	        http.setChunkedStreamingMode(0);
	        OutputStream out = http.getOutputStream();
	        out.write(this.data.getBytes());
	        out.close();
	
	        int response = http.getResponseCode();
	        
	        if(response != 200) {
	        	throw new Exception("Could not connect to: " + this.imageUrl + ", Error Code: " + response);
	        }
        }
        else {
        	http.setChunkedStreamingMode(0);
        	http.connect();
        }
        
        return http.getInputStream();
    }
    
    public ByteArrayOutputStream getByteStream() throws Exception {

        URL url = null;
        try {
            url = new URL(this.imageUrl);
        } catch (MalformedURLException e) {
            Log.e(TAG, e.getMessage(), e);
        }
        
        HttpURLConnection http = null;

        HttpsURLConnection https = (HttpsURLConnection) url
                .openConnection();
        https.setHostnameVerifier(DO_NOT_VERIFY);
        http = https;
        
        http.setRequestMethod(this.method);
        
        if(this.data != null && !this.data.equalsIgnoreCase("undefined") && !this.data.equalsIgnoreCase("null")) {
	        http.setDoOutput(true);
	        http.setRequestProperty("Content-Length", Integer.toString(this.data.length()));
	        http.setRequestProperty("Charset", "utf-8");
	        http.setRequestProperty("Content-Type", "application/json");
	        http.setChunkedStreamingMode(0);
	        http.setUseCaches(false);
	        OutputStream out = http.getOutputStream();
	        out.write(this.data.getBytes());
	        out.close();
	
	        int response = http.getResponseCode();
	        
	        if(response != 200) {
	        	throw new Exception("Could not connect to: " + this.imageUrl + ", Error Code: " + response);
	        }
        }
        else {
        	http.setChunkedStreamingMode(0);
        	http.connect();
        }
        
        BufferedInputStream stream = new BufferedInputStream(http.getInputStream());
        
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		
		byte[] inputbuffer = new byte[2048];
		int readBytes = 0;
		
		while(readBytes != -1) {
			readBytes = stream.read(inputbuffer);
			
			if(readBytes != -1) {
				buffer.write(inputbuffer, 0, readBytes);
			}
		}
		
		buffer.flush();
		buffer.close();
      
		http.disconnect();
		
		return buffer;
    }

    // always verify the host - dont check for certificate
    final static HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
		@Override
		public boolean verify(String arg0, SSLSession arg1) {
			// TODO Auto-generated method stub
			
			if(arg0.toLowerCase().contains("my.qref.com"))
				return true;
			else
				return false;
		}
    };

    /**
     * Trust every server - dont check for any certificate
     */
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
