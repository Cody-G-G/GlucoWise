'use strict';
import React, {Component} from 'react';
import ToggleButton from "../../helpers/components/ToggleButton";

export default class OnOffButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttonText = this.props.isOn ? "On" : "Off";
        const buttonColor = this.props.isOn ? "forestgreen" : "darkgrey";
        return (
            <ToggleButton buttonColor={buttonColor} buttonText={buttonText} onPress={this.props.onPress}/>
        );
    }
}