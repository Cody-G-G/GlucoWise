'use strict';
import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import ToggleButton from "../../helpers/components/ToggleButton";

export default class TimeRangeButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttonColor = this.props.selectedType === this.props.type ? 'royalblue' : 'darkgrey';
        return (
            <ToggleButton buttonText={this.props.type} buttonColor={buttonColor} onPress={this.props.onPress}/>
        );
    }
}