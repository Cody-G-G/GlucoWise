'use strict';
import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import styles from "./styles";

export default class AddReadingButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.addReading} style={styles.addReadingButton}>
                <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.addReadingButtonIcon} name="add"/>
            </TouchableOpacity>
        );
    }
}