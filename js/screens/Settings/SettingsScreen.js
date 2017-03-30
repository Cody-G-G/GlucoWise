'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {ListItem} from 'native-base';
import styles from "./styles";
import SafeRangesRowPanel from "./SafeRangesRowPanel";
import ToggleButton from "../../helpers/components/ToggleButton";
import ToggleButtonsGroup from "../../helpers/components/ToggleButtonsGroup";
import {readingUnitStandards} from "../../helpers/util/constants";
import toast from "../../helpers/util/toast";
import db from "../../data/database";
import log from "../../helpers/util/logger";
import gFit from "../../data/googleFit";

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        let standard = db.getBGLStandard();
        let safeRange = db.getBGLSafeRange();
        this.state = {
            standard: standard,
            safeRangeMin: safeRange.minValue,
            safeRangeMax: safeRange.maxValue,
            gFitConnected: db.isGoogleFitSyncEnabled(),
        };
        this.buttonTypes = {
            on: "On",
            off: "Off"
        };
        this.gFitToggling = false;
        this.toastShowing = false;
    }

    render() {
        log("Rendering SettingsScreen");
        const selectedGfitType = this.state.gFitConnected ? this.buttonTypes.on : this.buttonTypes.off;
        const unitButtonTypes = Object.values(readingUnitStandards);
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
                        <ToggleButtonsGroup
                            types={unitButtonTypes}
                            selectedTypes={[this.state.standard]}
                            onPress={this.switchStandard}/>
                    </View>
                </View>
                <View>
                    <ListItem itemDivider><Text style={styles.divider}>Data Sync</Text></ListItem>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.dataSyncDescription}>
                            <Image source={require('../../../assets/google_fit.png')}/>
                            <Text style={styles.dataSyncDescriptionText}> Google Fit</Text>
                        </View>
                        <ToggleButton onColor='forestgreen'
                                      onText={this.buttonTypes.on}
                                      offText={this.buttonTypes.off}
                                      type={this.buttonTypes.on}
                                      selectedTypes={[selectedGfitType]}
                                      onPress={this.toggleGFitConnection}/>
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
            gFit.isConnected().then((connected) => log("Toggling GFit connection, GFit currently connected?: " + connected));
            this.gFitToggling = true;
            this.state.gFitConnected ? gFit.disconnect() : gFit.authorizeAndConnect();
        } else {
            !this.toastShowing && toast("Google Fit is still syncing settings based on your previous action. Please wait a few more seconds before toggling sync.");
        }
    };

    initGFitConnectedHandler() {
        gFit.onConnected((args) => {
            log("GoogleFit connected: " + args.connected);
            if (args.connected)
                this.setState({
                    gFitConnected: true
                }, () => {
                    db.enableGFitDataSync();
                    setTimeout(() => {
                        this.gFitToggling = false
                    }, 3000);
                    //^  After connection, there's a small delay for google services also connecting the account, and
                    //disconnecting before that's finished gets the client in a bad state
                });
            else
                this.gFitToggling = false;
        });
    }

    initGFitDisconnectedHandler() {
        gFit.onDisconnected((args) => {
            log("GoogleFit disconnected: " + args.disconnected);
            if (args.disconnected) {
                this.setState({
                    gFitConnected: false
                }, () => {
                    db.disableGFitDataSync();
                    setTimeout(() => {
                        this.gFitToggling = false
                    }, 10000)
                });
                //^  After disconnection, there's a delay for google services also disconnecting the account, and
                //before that's finished gets the client in a bad state
            }
            else
                this.gFitToggling = false
        });
    }

    switchStandard = () => {
        this.setState({
            standard: readingUnitStandards.US === this.state.standard ? readingUnitStandards.UK : readingUnitStandards.US
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