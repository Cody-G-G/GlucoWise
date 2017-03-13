package com.glucowise;


import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.google.android.gms.common.api.GoogleApiClient;

public class GoogleFitActivityEventListener implements ActivityEventListener {
    private final String LOG_TAG = GoogleFitModule.NAME;
    private GoogleApiClient googleApiClient;

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == GoogleFitModule.REQUEST_OAUTH) {
            if (resultCode == Activity.RESULT_CANCELED) {
                Log.i(LOG_TAG, "User didn't choose a Google account to sign in with");
            } else if (resultCode == Activity.RESULT_OK) {
                Log.i(LOG_TAG, "User signed in with Google account");
                if (googleApiClient != null)
                    googleApiClient.connect();
                else
                    Log.e(LOG_TAG, "GoogleApiClient was NULL, and did not connect");
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
