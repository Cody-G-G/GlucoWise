'use strict';
import {StyleSheet} from "react-native"; // this is from a 3rd party dependency NPM module, "react-native"

export default StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'aliceblue'
    },
    mainPanel: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    graphPanel: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    summaryInfoPanel: {
        paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    summaryInfoText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'black'
    },
    noDataText: {
        fontSize: 45,
        fontWeight: 'bold'
    }
});