import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";
import TextBold from "../../helpers/components/TextBold";
import dateUtil from "../../helpers/util/date";

export default class LogFoodRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;
        const hasName = data.name !== '';
        return (
            <View style={styles.logRowFoodDescription}>
                <TextBold style={styles.logRowFoodHeaderText}>Consumed Food Item</TextBold>
                {hasName && <Text style={styles.logRowText}><TextBold>Name:</TextBold> {data.name}</Text>}
                <Text style={styles.logRowText}><TextBold>Date:</TextBold> {dateUtil.toDateTimeString(data.date)}</Text>
                <Text style={styles.logRowText}><TextBold>Calories:</TextBold> {data.calories} kcal</Text>
                <Text style={styles.logRowText}><TextBold>Carbohydrates:</TextBold> {data.carbohydrates} g</Text>
            </View>
        );
    }
}