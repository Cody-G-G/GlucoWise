'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {ListItem} from 'native-base';
import styles from "./styles";
import log from "../../helpers/util/logger";
import SafeRangesRowPanel from "./SafeRangesRowPanel";
import StandardSetterButton from "./StandardSetterButton";
import db from "../../data/database";

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standard: db.getBGLStandard().standard,
            safeRangeMin: db.getBGLSafeRange().minValue,
            safeRangeMax: db.getBGLSafeRange().maxValue
        };
    }

    componentWillMount() {
        this.standardUK = "mmol/L";
        this.standardUS = "mg/dL";
    }

    render() {
        let colorUSStandard = this.state.standard === this.standardUS ? 'royalblue' : 'darkgrey';
        let colorUKStandard = this.state.standard === this.standardUK ? 'royalblue' : 'darkgrey';
        return (
            <View style={styles.settingsScreen}>
                <View style={styles.safeRangesPanel}>
                    <ListItem itemDivider><Text style={styles.divider}>Safe Ranges</Text></ListItem>
                    <SafeRangesRowPanel inputLabel={'Min:'}
                                        inputValue={this.state.safeRangeMin}
                                        defaultSafeRange={this.setDefaultMin.bind(this)}
                                        updateSafeRange={this.setSafeRangeMin.bind(this)}
                                        saveSafeRange={this.saveSafeRangeMin.bind(this)}/>
                    <SafeRangesRowPanel inputLabel={'Max:'}
                                        inputValue={this.state.safeRangeMax}
                                        defaultSafeRange={this.setDefaultMax.bind(this)}
                                        saveSafeRange={this.saveSafeRangeMax.bind(this)}
                                        updateSafeRange={this.setSafeRangeMax.bind(this)}/>
                </View>
                <View>
                    <ListItem itemDivider><Text style={styles.divider}>Measurement Units</Text></ListItem>
                    <View style={{flexDirection:'row'}}>
                        <StandardSetterButton buttonColor={colorUSStandard} setStandard={this.setStandardUS.bind(this)} buttonText={this.standardUS}/>
                        <StandardSetterButton buttonColor={colorUKStandard} setStandard={this.setStandardUK.bind(this)} buttonText={this.standardUK}/>
                    </View>
                </View>
            </View>
        )
    }

    setStandardUS() {
        this.setState({
            standard: 'mg/dL'
        }, this.saveStandard);
    }

    setStandardUK() {
        this.setState({
            standard: 'mmol/L'
        }, this.saveStandard);
    }

    /**
     * @param newMin
     */
    setSafeRangeMin(newMin) {
        this.setState({
            safeRangeMin: newMin
        });
    }

    /**
     * @param newMax
     */
    setSafeRangeMax(newMax) {
        this.setState({
            safeRangeMax: newMax
        });
    }

    setDefaultMin() {
        this.setState({
            safeRangeMin: '70'
        }, this.saveSafeRangeMin);

    }

    setDefaultMax() {
        this.setState({
            safeRangeMax: '130'
        }, this.saveSafeRangeMax)
    }

    saveSafeRangeMin() {
        db.updateBGLSafeRangeMin(this.state.safeRangeMin);
    }

    saveSafeRangeMax() {
        db.updateBGLSafeRangeMin(this.state.safeRangeMax);
    }

    saveStandard() {
        db.updateBGLStandard(this.state.standard);
    }
}