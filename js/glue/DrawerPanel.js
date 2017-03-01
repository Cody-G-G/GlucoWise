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
import DrawerTab from "./DrawerTab";

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
                <DrawerTab onPress={() => {drawer.close(); Actions.screenConnection();}} icon='bluetooth' text='Connect'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenGraph();}} icon='insert-chart' text='Graph'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenReadings();}} icon='history'>
                    <View>
                        <Text style={StyleSheet.flatten([styles.tabText, {alignSelf:'center'}])}>Readings</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.tabReadingText}>Last: </Text>
                            <Text style={StyleSheet.flatten([styles.tabReadingValue, {color: valueColor}])}>
                                {this.state.latestReading} {this.state.standard}
                            </Text>
                        </View>
                    </View>
                </DrawerTab>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenSettings();}} icon='settings' text='Settings'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenAbout();}} icon='info' text='About'/>

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

