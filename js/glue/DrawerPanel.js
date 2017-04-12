'use strict';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {Component} from 'react';
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
        this.state = {
            latestReading: db.latestReadingValue,
            standard: db.standard,
            safeRangeMin: db.safeRange.minValue,
            safeRangeMax: db.safeRange.maxValue
        }
    }

    render() {
        log("Rendering DrawerPanel");
        const drawer = this.context.drawer;
        const valueColor = (this.state.latestReading > this.state.safeRangeMax || this.state.latestReading < this.state.safeRangeMin) ? 'firebrick' : 'forestgreen';
        const logbookTab = (
            <View>
                <Text style={StyleSheet.flatten([styles.tabText, {alignSelf:'center'}])}>Logbook</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.tabReadingText}>Last: </Text>
                    <Text style={StyleSheet.flatten([styles.tabReadingValue, {color: valueColor}])}>
                        {this.state.latestReading} {this.state.standard}
                    </Text>
                </View>
            </View>);

        return (
            <View style={styles.container}>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenConnection();}} icon='bluetooth' text='Connect'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenGraph();}} icon='insert-chart' text='Graphs'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenLogbook();}} icon='history' toRender={logbookTab}/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenBolus();}} icon='md-calculator' text='Bolus' iconFamily='Ionicons'/>
                <DrawerTab onPress={() => {drawer.close(); Actions.screenSettings();}} icon='settings' text='Settings'/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initBGLSafeRangeListener(this.updateState);
        db.initBGLStandardListener(this.updateState);
    }

    updateState = () => {
        this.setState({
            latestReading: db.latestReadingValue,
            standard: db.standard,
            safeRangeMin: db.safeRange.minValue,
            safeRangeMax: db.safeRange.maxValue
        });
    }
}

DrawerPanel.contextTypes = contextTypes;

