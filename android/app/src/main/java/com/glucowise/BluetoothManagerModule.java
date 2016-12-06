package com.glucowise;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import com.facebook.react.bridge.*;

import static android.app.Activity.RESULT_CANCELED;
import static android.app.Activity.RESULT_OK;

/**
 * Created by iHack1337 on 12/1/2016. Taken from https://github.com/derektu/react-native-bluetooth-serial
 */
public class BluetoothManagerModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    BluetoothAdapter btAdapter;
    Callback cb;
    Activity currentActivity;
    private static final int REQUEST_ENABLE_BT = 1001;

    public BluetoothManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        btAdapter = BluetoothAdapter.getDefaultAdapter();
        reactContext.addActivityEventListener(this);
    }

    @ReactMethod
    public void isEnabled(Callback cb) {
        this.cb = cb;
        try {
            this.cb.invoke(btAdapter.isEnabled());
        } catch (Exception e) {
            this.cb.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void enable(Callback cb) {
        this.cb = cb;
        synchronized (this) {
            try {
                if (btAdapter.isEnabled()) {
                    this.cb.invoke(true, null);
                    return;
                }
                currentActivity = getCurrentActivity();
                if (currentActivity == null) {
                    throw new Exception("No activity");
                }

                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                currentActivity.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
            } catch (Exception e) {
                this.cb.invoke(null, e.getMessage());
            }
        }
    }

    @Override
    public String getName() {
        return "BluetoothManagerModule";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        currentActivity = activity;
        if (requestCode == REQUEST_ENABLE_BT) {
            switch (resultCode) {
                case (RESULT_OK):
                    this.cb.invoke(true, null);
                    break;
                case (RESULT_CANCELED):
                    this.cb.invoke(false, null);
                    break;
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
