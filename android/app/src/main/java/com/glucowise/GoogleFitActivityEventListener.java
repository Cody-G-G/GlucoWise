package com.glucowise;


import android.app.Activity;
import android.content.Intent;
import android.util.Log;

// these are dependencies part of 3rd party NPM module, "react-native"
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

// this is the GoogleFit Android Java API client, made available by Google
import com.google.android.gms.common.api.GoogleApiClient;

public class GoogleFitActivityEventListener implements ActivityEventListener {
    private final String LOG_TAG = GoogleFitModule.NAME;
    private GoogleApiClient googleApiClient;
    private ReactContext context;

    public GoogleFitActivityEventListener(ReactContext context) {
        this.context = context;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == GoogleFitModule.REQUEST_OAUTH) {
            if (resultCode == Activity.RESULT_CANCELED) {
                Log.i(LOG_TAG, "User didn't choose a Google account to sign in with");
                WritableMap args = Arguments.createMap();
                args.putBoolean("connected", false);
                GoogleFitConnectionEventsHandler.sendEvent(this.context, "GoogleFitConnected", args);
            } else if (resultCode == Activity.RESULT_OK) {
                Log.i(LOG_TAG, "User signed in with Google account");
                if (googleApiClient != null && !googleApiClient.isConnecting() && !googleApiClient.isConnected())
                    googleApiClient.connect();
                else
                    Log.e(LOG_TAG, "GoogleApiClient did not connect, because it was NULL, or is connecting / connected already");
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    public void setGoogleApiClient(GoogleApiClient googleApiClient) {
        this.googleApiClient = googleApiClient;
    }
}