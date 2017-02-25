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
import styles from "./styles";

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
                <TouchableOpacity onPress={() => {drawer.close(); Actions.screenConnection();}} style={styles.tabButton}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="bluetooth"/>
                    <Text style={styles.tabText}>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {drawer.close(); Actions.screenGraph();}} style={styles.tabButton}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="insert-chart"/>
                    <Text style={styles.tabText}>Chart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {drawer.close(); Actions.screenReadings();}} style={styles.tabButton}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="history"/>
                    <Text style={styles.tabText}>Readings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {drawer.close()}} style={styles.tabButton}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="settings"/>
                    <Text style={styles.tabText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {drawer.close()}} style={styles.tabButton}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name="info"/>
                    <Text style={styles.tabText}>About</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

DrawerPanel.contextTypes = contextTypes;

