'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    toggleButton: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch'
    },
    toggleButtonText: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold'
    },
    toggleButtonsGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    }
});