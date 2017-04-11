import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from "./styles";
import TextBold from "../../helpers/components/TextBold";
import dateUtil from "../../helpers/util/date";

export default class LogReadingRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;
        const standard = this.props.standard;
        return (
            <View style={styles.logRowReadingDescription}>
                <TextBold style={styles.logRowReadingHeaderText}>Glucose Reading</TextBold>
                <Text style={styles.logRowText}><TextBold>Value:</TextBold> {data.value + " " + standard}</Text>
                <Text style={styles.logRowText}><TextBold>Date:</TextBold> {dateUtil.toDateTimeString(data.date)}
                </Text>
            </View>
        );
    }
}