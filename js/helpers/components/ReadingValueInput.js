'use strict';
import React, {Component} from 'react';
import {TextInput} from 'react-native';

export default class ReadingValueInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TextInput style={this.props.style}
                       value={this.props.inputValue}
                       keyboardType={'numeric'}
                       maxLength={5}
                       onChangeText={(input) => this.props.onChangeText(input)}/>
        );
    }
}