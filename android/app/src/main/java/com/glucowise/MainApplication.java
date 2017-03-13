package com.glucowise;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.horcrux.svg.RNSvgPackage;
import io.realm.react.RealmReactPackage;

import java.util.Arrays;
import java.util.List;

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
