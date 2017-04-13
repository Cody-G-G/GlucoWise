'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    settingsScreen: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'aliceblue'
    },
    safeRangesPanel: {
        backgroundColor: 'dimgray'
    },
    divider: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    safeRangeInputLabel: {
        flex: 1,
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold'
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
        fontWeight: 'bold'
    },
    valueInput: {
        flex: 1,
        fontSize: 25,
        color: 'white'
    },
    dataSyncDescription: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'cornflowerblue',
        alignSelf: 'stretch',
        borderWidth: 1
    },
    dataSyncDescriptionText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white'
    }
});