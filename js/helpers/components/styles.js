'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
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
        color: 'white',
        fontSize: 18,
        padding: 7
    },
    toggleButton: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'center'
    },
    standardSetterButtonText: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
        padding: 5
    },
    trashIcon: {
        color: 'white',
        fontSize: 30
    }
});