'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    dateRangeSeparatorText: {
        textAlignVertical: 'center',
        fontSize: 20,
        color: 'black',
        backgroundColor: 'aliceblue',
        fontWeight: 'bold'
    },
    dateRangePickers: {
        flex: 6,
        flexDirection: 'row',
        paddingLeft: 3
    },
    screenTopPanel: {
        flex: 1,
        flexDirection: 'row'
    },
    screenContainer: {
        flex: 1,
        backgroundColor: 'aliceblue'
    },
    logRow: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1
    },
    logRowFoodDescription: {
        flex: 6,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: 'teal'
    },
    logRowReadingDescription: {
        flex: 6,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: 'olive'
    },
    logRowText: {
        color: 'white',
        fontSize: 16,
    },
    logRowReadingHeaderText: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center'
    },
    logRowFoodHeaderText: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center'
    },
    trashIcon: {
        color: 'white',
        fontSize: 30
    },
    trashButton: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'firebrick'
    }
});