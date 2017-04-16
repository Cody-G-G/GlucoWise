'use strict';
import {StyleSheet} from "react-native"; // this is from a 3rd party dependency NPM module, "react-native"

export default StyleSheet.create({
    deviceButton: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        borderLeftWidth: 1
    },
    deviceButtonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
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
    },
    searchButton: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 2.5,
        marginBottom: 2.5,
        flex: 1,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'royalblue'
    },
    searchButtonIcon: {
        fontWeight: 'bold',
        fontSize: 45,
        color: 'white'
    },
    searchButtonText: {
        fontWeight: 'bold',
        fontSize: 32,
        color: 'white'
    }
});