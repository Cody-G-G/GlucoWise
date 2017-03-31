import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AddButton from "../../helpers/components/AddButton";
import {Icon} from 'native-base';
import styles from "./styles";


export default class CalculatorButtonsPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.bottomPanel}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.props.onPressCalculate}>
                    <Text style={styles.calculateButtonText}>
                        <Icon theme={{iconFamily: "Ionicons"}} name="md-calculator"/>&nbsp;Calculate Bolus
                    </Text>
                </TouchableOpacity>
                <AddButton onPress={this.props.onPressAdd}/>
            </View>
        );
    }
}