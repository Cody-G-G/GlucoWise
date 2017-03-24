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
        margin: 20
    },
    addReadingModal: {
        height: 400,
        width: 300,
        borderWidth: 2,
        backgroundColor: 'aliceblue'
    },
    addModalButtonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    },
    valueInput: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        flex: 2.5,
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
    modalInputRow: {
        flex: 1,
        flexDirection: 'row',
        margin: 10
    },
    modalMainPanel: {
        flex: 5,
        alignItems: 'center'
    },
    inputLabel: {
        flex: 1,
        color: 'black',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25
    },
    modalDatePicker: {
        flex: 2.5,
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