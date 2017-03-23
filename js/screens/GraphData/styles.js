'use strict';
import {StyleSheet} from "react-native";

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
    radioButtonsPanel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
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
    },
    modalMainPanel: {
        flex: 1,
    },
    modalHeaderText: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    helpModal: {
        height: 450,
        width: 350,
        borderWidth: 2,
        backgroundColor: 'aliceblue'
    },
    helpSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    helpSectionTitle: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    },
    emphasizedHelpText: {
        color: 'royalblue',
        fontSize: 18,
        fontWeight: 'bold'
    },
    normalHelpText: {
        color: 'dimgray',
        fontSize: 16,
        fontWeight: 'normal'
    }
});