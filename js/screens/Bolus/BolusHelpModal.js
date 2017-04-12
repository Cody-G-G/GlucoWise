import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from '../../helpers/components/styles';
import log from "../../helpers/util/logger";
import ScrollModal from "../../helpers/components/ScrollModal";

export default class BolusHelpModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering BolusHelpModal");
        const content = (
            <View style={{flex:1}}>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        Disclaimer
                    </Text>
                    <Text style={styles.normalModalText}>
                        You&nbsp;
                        <Text style={styles.alertModalText}>MUST</Text>&nbsp;
                        discuss the usage of a bolus calculator with your physician, and use your&nbsp;
                        <Text style={styles.alertModalText}>own judgement</Text>&nbsp;
                        before accepting any recommendation made by this (or any other, for that matter)
                        calculator. Your physician would assist you in choosing initial values for your&nbsp;
                        <Text style={styles.emphasizedModalText}>Target Blood Glucose</Text>,&nbsp;
                        <Text style={styles.emphasizedModalText}>Carbohydrate-to-Insulin Ratio</Text>
                        , and&nbsp;
                        <Text style={styles.emphasizedModalText}>Insulin Sensitivity Factor</Text>
                        , and would provide guidance as to how these should be adjusted over time or for
                        different times of day, according to your own observations.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        General
                    </Text>
                    <Text style={styles.normalModalText}>
                        This screen serves as a&nbsp;
                        <Text style={styles.emphasizedModalText}>Bolus Calculator</Text>
                        , used to determine the number of units of rapid / quick
                        acting insulin to be taken before a meal. This is called the&nbsp;
                        <Text style={styles.emphasizedModalText}>Bolus Dose</Text>
                        , and it is calculated using the following variable 5 variables:
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        #1 Meal Carbohydrate Amount (MCA)
                    </Text>
                    <Text style={styles.normalModalText}>
                        This is the amount of carbohydrates you are planning to eat. You can input this
                        value in the first input field, marked with the label "
                        <Text style={styles.emphasizedModalText}>Meal carbs</Text>
                        ". You can also choose to use the amount of carbs from the last&nbsp;
                        <Text style={styles.emphasizedModalText}>Food Item</Text>&nbsp;
                            which you've logged, by using the button to the right of this input field, labeled&nbsp;
                        <Text style={styles.emphasizedModalText}>Latest Food</Text>
                        . Logging a Food Item can be done either by using the green button in
                        the lower-right corner of this screen, or in the&nbsp;
                        <Text style={styles.emphasizedModalText}>Logbook</Text>&nbsp;
                            screen, using the green button on the top-right corner.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        #2 Current Blood Glucose (CBG)
                    </Text>
                    <Text style={styles.normalModalText}>
                        This is your current blood glucose level. You can input this value in the second
                        input field, marked with the label "
                        <Text style={styles.emphasizedModalText}>Current glucose</Text>
                        ". You can also choose to use the blood glucose value from the last&nbsp;
                        <Text style={styles.emphasizedModalText}>Glucose Reading</Text>&nbsp;
                        which was either received from the GlucoWise device, or logged manually, and this
                        can be done by using the button to the right of this input field, labeled&nbsp;
                        <Text style={styles.emphasizedModalText}>Latest Reading</Text>
                        . Manually logging a Reading can be done either by using the green button in
                        the lower-right corner of this screen, or in the&nbsp;
                        <Text style={styles.emphasizedModalText}>Logbook</Text>&nbsp;
                        screen, using the green button on the top-right corner.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        #3 Target Blood Glucose (TBG)
                    </Text>
                    <Text style={styles.normalModalText}>
                        This is your target blood glucose level, which denotes the glucose level you
                        wish to get at, after having taken the insulin dose and consumed the&nbsp;
                        <Text style={styles.emphasizedModalText}>MCA</Text>
                        . You can input this value in the third input field, marked with the label "
                        <Text style={styles.emphasizedModalText}>Target glucose</Text>
                        ". Once input, you can choose to save this value by using the button
                        to the right of this input field, labeled&nbsp;
                        <Text style={styles.emphasizedModalText}>Save</Text>
                        . Once saved, this value will be automatically completed in the field every
                        time you open this screen, however you can modify (and save) it again at any time.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        #4 Carbohydrate-to-Insulin Ratio (CIR)
                    </Text>
                    <Text style={styles.normalModalText}>
                        This represents the grams of carbohydrate counteracted by 1 unit of rapid / quick acting
                        insulin. You can input this value in the fourth input field, marked with the label "
                        <Text style={styles.emphasizedModalText}>Carb-Insulin ratio</Text>
                        ". Once input, you can choose to save this value by using the button
                        to the right of this input field, labeled&nbsp;
                        <Text style={styles.emphasizedModalText}>Save</Text>
                        . Once saved, this value will be automatically completed in the field every
                        time you open this screen, however you can modify (and save) it again at any time.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        #5 Insulin Sensitivity Factor (ISF)
                    </Text>
                    <Text style={styles.normalModalText}>
                        This represents the amount by which 1 unit of rapid-acting insulin will lower blood glucose.
                        You can input this value in the fifth and last input field, marked with the label "
                        <Text style={styles.emphasizedModalText}>Insulin sensitivity</Text>
                        ". Once input, you can choose to save this value by using the button
                        to the right of this input field, labeled&nbsp;
                        <Text style={styles.emphasizedModalText}>Save</Text>
                        . Once saved, this value will be automatically completed in the field every
                        time you open this screen, however you can modify (and save) it again at any time.
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                        Formula
                    </Text>
                    <Text style={styles.normalModalText}>
                        The&nbsp;
                        <Text style={styles.emphasizedModalText}>Bolus Dose</Text>&nbsp;
                        is calculated using the variables described above, in the formula:{'\n'}
                        <Text style={styles.emphasizedModalText}>(MCA / CIR) + ((CBG - TBG) / ISF)</Text>
                    </Text>
                </View>
            </View>);

        return (
            <ScrollModal content={content} isOpen={this.props.isOpen} onClose={this.props.onClose} headerText='Help / Instructions'/>
        );
    }
}