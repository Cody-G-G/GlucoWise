package com.glucowise;

import android.content.IntentSender;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;

import static com.glucowise.GoogleFitModule.REQUEST_OAUTH;

public class GoogleFitConnectionEventsHandler implements
        GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    private final String LOG_TAG = GoogleFitModule.NAME;
    private ReactContext reactContext;

    public GoogleFitConnectionEventsHandler(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        Log.i(LOG_TAG, "GoogleFit connected");
        WritableMap args = Arguments.createMap();
        args.putBoolean("connected", true);
        sendEvent(this.reactContext, "GoogleFitConnected", args);
    }

    @Override
    public void onConnectionSuspended(int i) {
        if (i == GoogleApiClient.ConnectionCallbacks.CAUSE_NETWORK_LOST) {
            Log.i(LOG_TAG, "GoogleFit connection lost.  Cause: Network Lost.");
        } else if (i == GoogleApiClient.ConnectionCallbacks.CAUSE_SERVICE_DISCONNECTED) {
            Log.i(LOG_TAG, "GoogleFit connection lost.  Reason: Service Disconnected");
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Log.i(LOG_TAG, "Google Play services connection failed. Cause: " + connectionResult.toString());
        try {
            connectionResult.startResolutionForResult(reactContext.getCurrentActivity(), REQUEST_OAUTH);
        } catch (IntentSender.SendIntentException e) {
            Log.i(LOG_TAG, "Failed to request OAuth, stacktrace below");
            e.printStackTrace();
        }
    }

    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
