'use strict';
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    dateText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'flex-end'
    },
    dateTouchBody: {
        backgroundColor: "darkgrey",
        flex: 1
    },
    dateRangeSeparatorText: {
        textAlignVertical: 'center',
        fontSize: 20
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
    }
});