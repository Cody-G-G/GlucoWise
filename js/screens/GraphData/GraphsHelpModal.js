import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from '../../helpers/components/styles';
import log from "../../helpers/util/logger";
import HelpModal from "../../helpers/components/HelpModal";

export default class GraphsHelpModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering GraphsHelpModal");
        const content = (
            <View style={{flex:1}}>
                <View style={styles.helpSection}>
                    <Text style={styles.helpSectionTitle}>
                        General
                    </Text>
                    <Text style={styles.emphasizedHelpText}>
                        X axis:&nbsp;
                        <Text style={styles.normalHelpText}>
                            time axis, should be read as the hours of the day, in a 24 hour system, when in&nbsp;
                            <Text style={styles.emphasizedHelpText}>24h</Text>&nbsp;
                            time range, or "minutes ago" for&nbsp;
                            <Text style={styles.emphasizedHelpText}>60m</Text>&nbsp;
                            time range. The far right of the graph represents the
                            present time, and so the rightmost X axis label will always be the present hour of the day,
                            and going to the left towards the Y axis are the times of day in the past 24 hours for which
                            data is available.
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
                        . Each bar represents Y number of steps made at hour X when&nbsp;
                        <Text style={styles.emphasizedHelpText}>24h</Text>&nbsp;
                        time range is chosen, or Y number of steps made X minutes ago when&nbsp;
                        <Text style={styles.emphasizedHelpText}>60m</Text>&nbsp;
                        time range is chosen. Y is the value on the Y axis corresponding to the top of the bar, and X is the value
                        on the X axis found under each bar. To make use of this graph, make sure to set sync "On" in&nbsp;
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
                        Shows a bar chart of the calories ingested / expended data (based on chosen mode). The expended calories data is received from&nbsp;
                        <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                        , if data sync with GoogleFit is enabled in&nbsp;
                        <Text style={styles.emphasizedHelpText}>Settings</Text>
                        . Each bar represents Y number of calories ingested / expended, at hour X in a 24 hour system when&nbsp;
                        <Text style={styles.emphasizedHelpText}>24h</Text>&nbsp;
                        time range is chosen, or Y number of calories ingested / expended on X day of the week when&nbsp;
                        <Text style={styles.emphasizedHelpText}>7d</Text>&nbsp;
                        time range is chosen. Y is the value on the Y axis corresponding to the top of the bar, X represents the value of the X axis under
                        the bar. The expended calories are an estimation based on your activity throughout the day, so, for the highest accuracy, ensure you
                        carry your phone around when working out / exercising / moving around. To make use of this, make sure to set sync "On" in&nbsp;
                        <Text style={styles.emphasizedHelpText}>Settings</Text>
                        , enable Location services, and the tracking functionality in&nbsp;
                        <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                        . The data for Calories Ingested is based on the&nbsp;
                        <Text style={styles.emphasizedHelpText}>Consumed Food Items</Text>&nbsp;
                        that you've logged through the&nbsp;
                        <Text style={styles.emphasizedHelpText}>Logbook</Text>
                        , so, to make use of this, please make sure you input this data before or after a meal, as accurately as possible.
                    </Text>
                </View>

                <View style={styles.helpSection}>
                    <Text style={styles.helpSectionTitle}>
                        Weight graph
                    </Text>
                    <Text style={styles.normalHelpText}>
                        Shows a bar chart of body weight measurements (in kilograms) over time, received from&nbsp;
                        <Text style={styles.emphasizedHelpText}>GoogleFit</Text>
                        , if data sync with GoogleFit is enabled in&nbsp;
                        <Text style={styles.emphasizedHelpText}>Settings</Text>
                        . Each bar represents Y kilograms, at either X days ago when&nbsp;
                        <Text style={styles.emphasizedHelpText}>30d</Text>&nbsp;
                        time range is chosen, or Y kilograms on X month of the year when&nbsp;
                        <Text style={styles.emphasizedHelpText}>6M / 1Y</Text>&nbsp;
                        time range is chosen. Y is the value on the Y axis corresponding to the top of the bar, X represents the value of the X axis under
                        the bar. These values are received from GoogleFit, so, in order to make use of this, make sure you update your weight in GoogleFit
                        whenever you weigh yourself, and ensure that data sync is set to "On" for GoogleFit in&nbsp;
                        <Text style={styles.emphasizedHelpText}>Settings</Text>
                    </Text>
                </View>
            </View>);

        return (
            <HelpModal content={content} helpOpen={this.props.helpModalOpen} onClose={this.closeHelpModal}/>
        );
    }
}