'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {ListItem} from 'native-base';
import styles from "./styles";
import SafeRangesRowPanel from "./SafeRangesRowPanel";
import StandardSetterButton from "./StandardSetterButton";
import db from "../../data/database";
import processReading from"../../helpers/util/readingProcessor";

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        let standard = db.getBGLStandard().standard;
        let safeRange = db.getBGLSafeRange();
        this.state = {
            standard: standard,
            safeRangeMin: processReading(safeRange.minValue, standard, 1),
            safeRangeMax: processReading(safeRange.maxValue, standard, 1)
        };
    }

    componentWillMount() {
        this.standardUK = "mmol/L";
        this.standardUS = "mg/dL";
        this.updateBGLSafeRange();
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
                                        saveSafeRange={this.saveSafeRangeMin.bind(this)}
                                        standard={this.state.standard}/>
                    <SafeRangesRowPanel inputLabel={'Max:'}
                                        inputValue={this.state.safeRangeMax}
                                        defaultSafeRange={this.setDefaultMax.bind(this)}
                                        saveSafeRange={this.saveSafeRangeMax.bind(this)}
                                        updateSafeRange={this.setSafeRangeMax.bind(this)}
                                        standard={this.state.standard}/>
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

    componentDidMount() {
        this.initBGLStandardListener();
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
            safeRangeMin: processReading(70, this.state.standard, 1)
        }, this.saveSafeRangeMin);

    }

    setDefaultMax() {
        this.setState({
            safeRangeMax: processReading(130, this.state.standard, 1)
        }, this.saveSafeRangeMax)
    }

    saveSafeRangeMin() {
        db.updateBGLSafeRangeMin(String(processReading(this.state.safeRangeMin, this.state.standard, 1, true)));
    }

    saveSafeRangeMax() {
        db.updateBGLSafeRangeMax(String(processReading(this.state.safeRangeMax, this.state.standard, 1, true)));
    }

    saveStandard() {
        db.updateBGLStandard(this.state.standard);
    }

    updateBGLSafeRange() {
        let safeRange = db.getBGLSafeRange();
        this.setState({
            safeRangeMin: processReading(safeRange.minValue, this.state.standard, 1),
            safeRangeMax: processReading(safeRange.maxValue, this.state.standard, 1)
        });
    }

    initBGLStandardListener() {
        db.initBGLStandardListener(this.updateBGLSafeRange.bind(this));
    }
}