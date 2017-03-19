import React, {Component} from 'react';
import {View} from 'react-native';
import ToggleButton from "../../helpers/components/ToggleButton";
import styles from "./styles";

export default class RadioButtonsPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttons = this.props.types.map((type, i) => {
            return <ToggleButton fontSize={this.props.fontSize}
                                 key={i}
                                 type={type}
                                 selectedType={this.props.selectedType}
                                 onPress={() => this.props.onPress(type)}
                                 onText={type}
                                 offText={type}/>
        });
        return (
            <View style={styles.radioButtonsPanel}>
                {buttons}
            </View>
        );
    }
}