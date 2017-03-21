import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    tabButton: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'whitesmoke',
        borderWidth: 1.5,
        borderColor: 'royalblue',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    tabText: {
        color: 'royalblue',
        fontSize: 25,
        fontWeight: 'bold'
    },
    tabReadingText: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold'
    },
    tabReadingValue: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    icon: {
        color: 'royalblue',
        fontSize: 45
    },
    sceneTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'dimgray'
    }
});