'use strict';
import {StyleSheet} from "react-native"; // this is from a 3rd party dependency NPM module, "react-native"

export default StyleSheet.create({
    toggleButton: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    toggleButtonText: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold'
    },
    toggleButtonsGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderTopWidth: 1
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
    logModalAddButton: {
        backgroundColor: 'royalblue',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1
    },
    logModalBottomPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    logModal: {
        height: 500,
        width: 320,
        borderWidth: 2,
        backgroundColor: 'aliceblue'
    },
    logModalAddButtonText: {
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
    customDatePicker: {
        flex: 1,
        borderWidth: 1
    },
    logModalDatePicker: {
        flex: 1.75,
        width: 190,
        borderWidth: 1
    },
    unitLabel: {
        color: 'black',
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputLabel: {
        flex: 1,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    logModalHeaderText: {
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
    logModalMainPanel: {
        flex: 8
    },
    dateTouchBody: {
        flex: 1
    },
    dateInput: {
        borderWidth: 0
    },
    scrollModalMainPanel: {
        flex: 1,
    },
    scrollModalHeaderText: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    scrollModal: {
        height: 450,
        width: 350,
        borderWidth: 2,
        backgroundColor: 'aliceblue'
    },
    modalSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    modalSectionTitle: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 5
    },
    emphasizedModalText: {
        color: 'royalblue',
        fontSize: 18,
        fontWeight: 'bold'
    },
    alertModalText: {
        color: 'crimson',
        fontSize: 18,
        fontWeight: 'bold'
    },
    normalModalText: {
        color: 'dimgray',
        fontSize: 16,
        fontWeight: 'normal'
    }
});