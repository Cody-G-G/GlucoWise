import Modal from 'react-native-modalbox';
import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {ListItem} from 'native-base';
import styles from './styles';
import log from "../../helpers/util/logger";

export default class GraphsHelpModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering GraphsHelpModal");
        return (
            <Modal style={styles.helpModal}
                   position='center'
                   ref='modal'
                   isOpen={this.props.helpOpen}
                   backButtonClose={true}
                   animationDuration={300}
                   swipeToClose={false}
                   swipeArea={0}
                   onClosed={this.props.onClose}>
                <View style={styles.modalMainPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.modalHeaderText}>Help / Instructions</Text>
                    </ListItem>
                    <ScrollView>
                        <View style={{flex:1}}>
                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>
                                    General
                                </Text>
                                <Text style={styles.emphasizedHelpText}>
                                    X axis:&nbsp;
                                    <Text style={styles.normalHelpText}>
                                        time axis, should be read as "hours ago" (for 24h) / "minutes ago" (for 60m). Therefore,
                                        the X axis values represent either hours or minutes, depending on the chosen time range.
                                    </Text>
                                </Text>
                                <Text style={styles.emphasizedHelpText}>
                                    Y axis:&nbsp;
                                    <Text style={styles.normalHelpText}>
                                        value axis, represents the value of the glucose reading / number of steps made /
                                        calories consumed, depending on the graph mode chosen.
                                    </Text>
                                </Text>
                            </View>

                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>
                                    Glucose graph
                                </Text>
                                <Text style={styles.normalHelpText}>
                                    Shows a plot of the glucose readings received from the&nbsp;
                                    <Text style={styles.emphasizedHelpText}>GlucoWise</Text>&nbsp;
                                    device for the selected time range. The green area represents the&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Safe Range</Text>
                                    , which is the healthy range of values that you should aim to keep your glucose readings in. This range can be changed in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Settings</Text>.
                                </Text>
                            </View>

                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>
                                    Steps graph
                                </Text>
                                <Text style={styles.normalHelpText}>
                                    Shows a bar chart of the steps data received from&nbsp;
                                    <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                                    , if data sync with GoogleFit is enabled in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Settings</Text>
                                    . Each bar represents Y number of steps made X time units ago, where Y is the value of the Y axis corresponding to
                                    the top of the bar, X represents the value of the X axis under the bar, and the time units represent minutes or hours
                                    depending on the chosen time range. To make use of this, make sure to set sync "On" in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Settings</Text>
                                    , enable Location services, and the tracking functionality in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                                </Text>
                            </View>

                            <View style={styles.helpSection}>
                                <Text style={styles.helpSectionTitle}>
                                    Calories graph
                                </Text>
                                <Text style={styles.normalHelpText}>
                                    Shows a bar chart of the calories expended / consumed data (based on chosen mode) received from&nbsp;
                                    <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                                    , if data sync with GoogleFit is enabled in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Settings</Text>
                                    . Each bar represents Y number of calories, X time units ago, where Y is the value of the Y axis corresponding to
                                    the top of the bar, X represents the value of the X axis under the bar, and the time units represent minutes or hours
                                    depending on the chosen time range. The expended calories are an estimation based on your activity throughout the day,
                                    so for the highest accuracy, ensure you carry your phone around when working out / exercising / moving around.
                                    To make use of this, make sure to set sync "On" in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>Settings</Text>
                                    , enable Location services, and the tracking functionality in&nbsp;
                                    <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}