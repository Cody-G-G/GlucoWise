'use strict';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {Component} from 'react';
import {Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';
import styles from "./styles";
import db from "../data/database";
import log from "../helpers/util/logger";

const contextTypes = {
    drawer: React.PropTypes.object,
};

export default class DrawerPanel extends Component {
    constructor(props, context) {
        super(props);
        this.context = context;
        const safeRange = db.getBGLSafeRange();
        const safeRangeMin = safeRange.minValue;
        const safeRangeMax = safeRange.maxValue;
        this.state = {
            latestReading: db.getLatestReading(),
            standard: db.getBGLStandard(),
            safeRangeMin: safeRangeMin,
            safeRangeMax: safeRangeMax
        }
    }

    render() {
        log("Rendering DrawerPanel");
        const drawer = this.context.drawer;
        const valueColor = (this.state.latestReading > this.state.safeRangeMax || this.state.latestReading < this.state.safeRangeMin) ? 'firebrick' : 'forestgreen';
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
                    <View>
                        <Text style={StyleSheet.flatten([styles.tabText, {alignSelf:'center'}])}>Readings</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.tabReadingText}>Last: </Text>
                            <Text style={StyleSheet.flatten([styles.tabReadingValue, {color: valueColor}])}>
                                {this.state.latestReading} {this.state.standard}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {drawer.close(); Actions.screenSettings();}} style={styles.tabButton}>
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

    componentDidMount() {
        db.initBGLReadingListener(this.updateLatestReading.bind(this));
        db.initBGLSafeRangeListener(this.updateSafeRange.bind(this));
        db.initBGLStandardListener(this.updateState.bind(this));
    }

    updateSafeRange() {
        const safeRange = db.getBGLSafeRange();
        const safeRangeMin = safeRange.minValue;
        const safeRangeMax = safeRange.maxValue;
        this.setState({
            safeRangeMin: safeRangeMin,
            safeRangeMax: safeRangeMax
        });
    }

    updateLatestReading() {
        this.setState({
            latestReading: db.getLatestReading()
        });
    }

    updateState() {
        const safeRange = db.getBGLSafeRange();
        const safeRangeMin = safeRange.minValue;
        const safeRangeMax = safeRange.maxValue;
        this.setState({
            standard: db.getBGLStandard(),
            safeRangeMin: safeRangeMin,
            safeRangeMax: safeRangeMax,
            latestReading: db.getLatestReading()
        });
    }
}

DrawerPanel.contextTypes = contextTypes;

