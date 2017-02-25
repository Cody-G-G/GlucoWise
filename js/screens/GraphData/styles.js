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
    readingsPanel: {
        flex: 5,
        alignSelf: 'stretch'
    },
    readingsListHeaderText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    timeRangeButton: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'darkgrey',
    },
    timeRangeButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
});