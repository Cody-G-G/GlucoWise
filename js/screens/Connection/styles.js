'use strict';
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    deviceButton: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7
    },
    deviceButtonText: {
        color: 'white',
        fontSize: 20
    },
    deviceDescription: {
        backgroundColor: 'cornflowerblue',
        color: 'white',
        flex: 4,
        fontSize: 20,
        padding: 7
    },
    device: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1
    },
    deviceListHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    searchButtonPanel: {
        flex: 1,
    },
    devicesPanel: {
        alignSelf: 'stretch'
    },
    spinnerPanel: {
        flex: 1.4,
        alignItems: 'center'
    },
    screenContainer: {
        flex: 1,
        backgroundColor: 'aliceblue'
    }
});