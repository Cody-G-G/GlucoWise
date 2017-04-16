package com.glucowise;

import android.app.Application;

// these are part of 3rd party dependency NPM module, "react-native"
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
// this is from a 3rd party dependency NPM module, "react-native-svg"
import com.horcrux.svg.RNSvgPackage;
// this is from a 3rd party dependency NPM module, "react-native-vector-icons"
import com.oblador.vectoricons.VectorIconsPackage;
// this is from a 3rd party dependency NPM module, "react-native-spinkit"
import com.react.rnspinkit.RNSpinkitPackage;
// this is from a 3rd party dependency NPM module, "react-native-android-location-services-dialog-box"
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;

import java.util.Arrays;
import java.util.List;

// this is from a 3rd party dependency NPM module, "realm"
import io.realm.react.RealmReactPackage;
// this is from a 3rd party dependency NPM module, "react-native-ble-manager"
import it.innove.BleManagerPackage;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
                    new VectorIconsPackage(),
                    new LocationServicesDialogBoxPackage(),
                    new RNSpinkitPackage(),
                    new BleManagerPackage(),
                    new RNSvgPackage(),
                    new RealmReactPackage(),
                    new GoogleFitPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}