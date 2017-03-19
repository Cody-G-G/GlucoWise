'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'aliceblue'
    },
    graphPanel: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioButtonsPanel: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        alignSelf: 'stretch'
    }
});