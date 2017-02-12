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
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    readingsPanel: {
        flex: 2,
        alignSelf: 'stretch'
    },
    readingsListHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    reading: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1
    },
    trashButton: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'firebrick'
    },
    readingText: {
        flex: 6,
        alignItems: 'center',
        backgroundColor: 'cornflowerblue',
        color: 'white',
        fontSize: 18,
        padding: 7
    }
});