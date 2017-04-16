package com.glucowise;

// this is from a 3rd party dependency NPM module, "react-native"
import com.facebook.react.ReactActivity;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GlucoWise";
    }
}