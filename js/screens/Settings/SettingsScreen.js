'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {ListItem} from 'native-base';
import styles from "./styles";
import SafeRangesRowPanel from "./SafeRangesRowPanel";
import StandardSetterButton from "../../helpers/components/StandardSetterButton";
import db from "../../data/database";
import log from "../../helpers/util/logger";

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        let standard = db.getBGLStandard();
        let safeRange = db.getBGLSafeRange();
        this.state = {
            standard: standard,
            safeRangeMin: safeRange.minValue,
            safeRangeMax: safeRange.maxValue
        };
    }

    render() {
        return (
            <View style={styles.settingsScreen}>
                <View style={styles.safeRangesPanel}>
                    <ListItem itemDivider><Text style={styles.divider}>Safe Ranges</Text></ListItem>
                    <SafeRangesRowPanel inputLabel={'Min:'}
                                        inputValue={this.state.safeRangeMin}
                                        defaultSafeRange={this.setDefaultMin}
                                        updateSafeRange={this.setSafeRangeMin}
                                        saveSafeRange={this.saveSafeRangeMin}
                                        standard={this.state.standard}/>
                    <SafeRangesRowPanel inputLabel={'Max:'}
                                        inputValue={this.state.safeRangeMax}
                                        defaultSafeRange={this.setDefaultMax}
                                        saveSafeRange={this.saveSafeRangeMax}
                                        updateSafeRange={this.setSafeRangeMax}
                                        standard={this.state.standard}/>
                </View>
                <View>
                    <ListItem itemDivider><Text style={styles.divider}>Measurement Units</Text></ListItem>
                    <View style={{flexDirection:'row'}}>
                        <StandardSetterButton type='US' standard={this.state.standard} onPress={this.setStandardUS}/>
                        <StandardSetterButton type='UK' standard={this.state.standard} onPress={this.setStandardUK}/>
                    </View>
                </View>
            </View>
        )
    }

    componentDidMount() {
        db.initBGLStandardListener(this.updateBGLSafeRange.bind(this));
    }

    componentWillUnmount() {
        log("Unmounting SettingsScreen");
    }

    setStandardUS = () => {
        this.setState({
            standard: 'mg/dL'
        }, this.saveStandard);
    };

    setStandardUK = () => {
        this.setState({
            standard: 'mmol/L'
        }, this.saveStandard);
    };

    /**
     * @param newMin
     */
    setSafeRangeMin = (newMin) => {
        this.setState({
            safeRangeMin: newMin
        });
    };

    /**
     * @param newMax
     */
    setSafeRangeMax = (newMax) => {
        this.setState({
            safeRangeMax: newMax
        });
    };

    setDefaultMin = () => {
        db.updateBGLSafeRangeMinToDefault();
        this.updateBGLSafeRange();
    };

    setDefaultMax = () => {
        db.updateBGLSafeRangeMaxToDefault();
        this.updateBGLSafeRange();
    };

    saveSafeRangeMin = () => {
        db.updateBGLSafeRangeMin(this.state.safeRangeMin);
    };

    saveSafeRangeMax = () => {
        db.updateBGLSafeRangeMax(this.state.safeRangeMax);
    };

    saveStandard() {
        db.updateBGLStandard(this.state.standard);
    }

    updateBGLSafeRange() {
        let safeRange = db.getBGLSafeRange();
        this.setState({
            safeRangeMin: safeRange.minValue,
            safeRangeMax: safeRange.maxValue
        });
    }
}