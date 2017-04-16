'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, TouchableOpacity} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import {Icon} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
import styles from "./styles";

export default class AddButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.addButton}>
                <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.addButtonIcon} name="add"/>
            </TouchableOpacity>
        );
    }
}