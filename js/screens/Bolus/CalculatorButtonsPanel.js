import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text, TouchableOpacity} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import AddButton from "../../helpers/components/AddButton";
import {Icon} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
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