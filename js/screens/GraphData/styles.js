'use strict';
import {StyleSheet, Dimensions} from "react-native";
const dimensions = Dimensions.get('window');

export default StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'aliceblue'
    },
    graphPanel: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    readingsPanel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});