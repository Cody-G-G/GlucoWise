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
import {Actions} from 'react-native-router-flux';

const contextTypes = {
    drawer: React.PropTypes.object,
};

export default class DrawerPanel extends Component {
    constructor(props, context) {
        super(props);
        this.context = context;
    }

    render() {
        const drawer = this.context.drawer;
        return (
            <View style={styles.container}>
                <Button onPress={() => {drawer.close(); Actions.tabConnection();}} textStyle={styles.tabText} large style={styles.tabButton} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="bluetooth"/>Connect
                </Button>
                <Button onPress={() => {drawer.close()}} large style={styles.tabButton} textStyle={styles.tabText} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="insert-chart"/>Chart
                </Button>
                <Button onPress={() => {drawer.close()}} large style={styles.tabButton} textStyle={styles.tabText} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="settings"/>Settings
                </Button>
                <Button onPress={() => {drawer.close()}} large style={styles.tabButton} textStyle={styles.tabText} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="history"/>Readings
                </Button>
                <Button onPress={() => {drawer.close()}} large style={styles.tabButton} textStyle={styles.tabText} bordered>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="info"/>About
                </Button>
            </View>
        );
    }
}

DrawerPanel.contextTypes = contextTypes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    tabButton: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'whitesmoke',
        borderColor: 'royalblue'
    },
    tabText: {
        color: 'royalblue'
    },
    icon: {
        color: 'royalblue'
    }
});

