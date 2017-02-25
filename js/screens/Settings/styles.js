'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    settingsScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'aliceblue'
    },
    safeRangesPanel: {
        backgroundColor: 'cornflowerblue'
    },
    divider: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    safeRangeInputLabel: {
        flex: 1,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    safeRangeInput: {
        flex: 1,
        fontSize: 25,
        color: 'white'
    },
    safeRangesRowPanel: {
        flexDirection: 'row',
        borderWidth: 1
    },
    safeRangeButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5
    },
    safeRangeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 23
    },
    standardSetterButton: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
        padding: 5,
        textAlign: 'center',
        borderWidth: 1
    }
});