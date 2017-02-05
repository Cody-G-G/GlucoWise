'use strict';
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
        paddingTop: 10,
        paddingBottom: 20
    },
    devicesPanel: {
        flex: 6,
        alignSelf: 'stretch'
    },
    spinnerPanel: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'aliceblue'
    }
});

export default styles;
