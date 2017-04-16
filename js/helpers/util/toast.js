'use strict';
import Toast from 'react-native-root-toast'; // this is from a 3rd party dependency NPM module, "react-native-root-toast"
let toastShowing = false;

const toast = (string) => {
    !toastShowing && Toast.show(string, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        onShow: () => {
            toastShowing = true;
        },
        onHide: () => {
            toastShowing = false;
        }
    });
};

export default toast;