'use strict';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {Component} from 'react';
import {Button, Icon} from 'native-base';

export default class DrawerPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Button onPress={null} large style={styles.screenButton} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} name="bluetooth"/>Connect
                </Button>
                <Button onPress={null} large style={styles.screenButton} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} name="insert-chart"/>&nbsp;&nbsp;&nbsp;&nbsp;Chart
                </Button>
                <Button onPress={null} large style={styles.screenButton} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} name="settings"/>Settings
                </Button>
                <Button onPress={null} large style={styles.screenButton} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} name="history"/>Readings
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        borderWidth: 1
    },
    screenButton: {
        alignSelf: 'stretch',
        flex: 1,
        borderWidth: 1
    }
});