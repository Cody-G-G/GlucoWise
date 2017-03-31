'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    resultPanel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resultText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 30
    },
    calculateButton: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'royalblue',
        flexDirection: 'row',
        borderRightWidth: 1
    },
    calculateButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35
    },
    calculatorInputRow: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: 'dimgray',
        borderWidth: 1
    },
    inputRowButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputRowButton: {
        flex: 0.3,
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: 'royalblue'
    },
    bottomPanel: {
        flex: 1,
        flexDirection: 'row',
        borderTopWidth: 2.25
    }
});