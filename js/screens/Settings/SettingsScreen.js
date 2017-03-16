'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {ListItem} from 'native-base';
import styles from "./styles";
import SafeRangesRowPanel from "./SafeRangesRowPanel";
import StandardSetterButton from "../../helpers/components/StandardSetterButton";
import db from "../../data/database";
import log from "../../helpers/util/logger";
import gFit from "../../data/googleFit";
import OnOffButton from "./OnOffButton";
import Toast from 'react-native-root-toast';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        let standard = db.getBGLStandard();
        let safeRange = db.getBGLSafeRange();
        this.state = {
            standard: standard,
            safeRangeMin: safeRange.minValue,
            safeRangeMax: safeRange.maxValue,
            gFitConnected: false,
        };
        this.gFitToggling = false;
        this.toastShowing = false;
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
                <View>
                    <ListItem itemDivider><Text style={styles.divider}>Data Sync</Text></ListItem>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.dataSyncDescription}>
                            <Image source={require('../../../assets/google_fit.png')}/>
                            <Text style={styles.dataSyncDescriptionText}> Google Fit</Text>
                        </View>
                        <OnOffButton isOn={this.state.gFitConnected} onPress={this.toggleGFitConnection}/>
                    </View>
                </View>
            </View>
        )
    }

    componentDidMount() {
        db.initBGLStandardListener(this.updateBGLSafeRange.bind(this));
        this.initGFitConnectedHandler();
        this.initGFitDisconnectedHandler();
    }

    componentWillUnmount() {
        log("Unmounting SettingsScreen");
    }

    toggleGFitConnection = () => {
        if (!this.gFitToggling) {
            gFit.isConnected((connected) => log("Toggling GFit connection, GFit currently connected?: " + connected));
            this.gFitToggling = true;
            this.state.gFitConnected ? gFit.disconnect() : gFit.authorizeAndConnect();
        } else {
            !this.toastShowing && this.showToast("Google Fit is still syncing settings based on your previous action. Please wait a few more seconds before toggling sync.");
        }
    };

    initGFitConnectedHandler() {
        gFit.onConnected((args) => {
            log("GoogleFit connected: " + args.connected);
            if (args.connected)
                this.setState({
                    gFitConnected: true
                }, () => setTimeout(() => {
                    this.gFitToggling = false
                }, 3000));
            else
                this.gFitToggling = false;
            // gFit.stepsToday((steps) => {
            //     log("Steps today: " + steps);
            // });
            // gFit.stepsTodayInHourBuckets((args) => {
            //     log("Steps today in hour buckets - steps: " + args.steps + " dates: " + args.dates);
            // });
            // gFit.stepsLast24hInHourBuckets((args) => {
            //     log("Steps last 24h in hour buckets - steps: " + args.steps + " dates: " + args.dates);
            // });
            // gFit.stepsLast60mInMinuteBuckets((args) => {
            //     log("Steps last 60m in minute buckets - steps: " + args.steps + " dates: " + args.dates);
            // });
            // gFit.caloriesExpendedLast24hInHourBuckets((args) => {
            //     log("Calories expended last 24h in hour buckets - calories: " + args.calories + " dates: " + args.dates);
            // });
            // gFit.caloriesExpendedLast60mInMinuteBuckets((args) => {
            //     log("Calories expended last 60m in minute buckets - calories: " + args.calories + " dates: " + args.dates);
            // });
        });
    }

    initGFitDisconnectedHandler() {
        gFit.onDisconnected((args) => {
            log("GoogleFit disconnected: " + args.disconnected);
            if (args.disconnected) {
                this.setState({
                    gFitConnected: false
                }, () => setTimeout(() => {
                    this.gFitToggling = false
                }, 10000));
                //^  After disconnection, there's a delay for google services also disconnecting the account, and
                //connecting again before that's finished gets the client in a bad state
            }
            else
                this.gFitToggling = false
        });
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

    showToast(string) {
        Toast.show(string, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                this.toastShowing = true;
            },
            onHide: () => {
                this.toastShowing = false;
            }
        });
    }
}