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
    addButton: {
        flex: 1,
        backgroundColor: 'forestgreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButtonIcon: {
        color: 'white',
        fontSize: 40
    },
    addModalButton: {
        backgroundColor: 'royalblue',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1
    },
    modalBottomPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    modal: {
        height: 500,
        width: 320,
        borderWidth: 2,
        backgroundColor: 'aliceblue'
    },
    addModalButtonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    },
    valueInput: {
        fontWeight: 'bold',
        flex: 0.75,
        textAlign: 'center'
    },
    dateText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'flex-end'
    },
    dateTouchBody: {
        flex: 1
    },
    dateInput: {
        borderWidth: 0
    },
    modalHeaderText: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    customInput: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5
    },
    modalMainPanel: {
        flex: 8
    },
    inputLabel: {
        flex: 1,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    unitLabel: {
        color: 'black',
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    modalDatePicker: {
        flex: 1.75,
        width: 190,
        borderWidth: 1
    },
    customDatePicker: {
        flex: 1,
        borderWidth: 1
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