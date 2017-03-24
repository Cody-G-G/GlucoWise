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
        return (
            <View style={styles.logRowFoodDescription}>
                <TextBold style={styles.logRowFoodHeaderText}>Consumed Food Item</TextBold>
                <Text style={styles.logRowText}><TextBold>Name:</TextBold> {data.name}</Text>
                <Text style={styles.logRowText}><TextBold>Date:</TextBold> {dateUtil.toDateTimeString(data.date)}</Text>
                <Text style={styles.logRowText}><TextBold>Calories:</TextBold> {data.calories} kcal</Text>
            </View>
        );
    }
}