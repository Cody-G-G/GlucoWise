'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    dateRangeSeparatorText: {
        textAlignVertical: 'center',
        fontSize: 20,
        color: 'black',
        backgroundColor: 'aliceblue'
    },
    addReadingButton: {
        flex: 1,
        backgroundColor: 'forestgreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addReadingButtonIcon: {
        color: 'white',
        fontSize: 40
    },
    addButton: {
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
    addButtonText: {
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
    readingsDatePicker: {
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
    }
});