'use strict';
import React, {Component} from 'react';
import ToggleButton from "./ToggleButton";

export default class StandardSetterButton extends Component {
    constructor(props) {
        super(props);
        this.standardUK = "mmol/L";
        this.standardUS = "mg/dL";
    }

    render() {
        const buttonText = this.props.type === 'US' ? this.standardUS : this.standardUK;
        const buttonColor = buttonText === this.props.standard ? 'royalblue' : 'darkgrey';
        return (
            <ToggleButton buttonColor={buttonColor} buttonText={buttonText} onPress={this.props.onPress}/>
        );
    }
}