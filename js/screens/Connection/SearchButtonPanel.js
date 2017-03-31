'use strict';
import React, {Component} from 'react';
import {Icon} from 'native-base';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class SearchButtonPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.searchButtonPanel}>
                <TouchableOpacity onPress={this.props.onPress} style={styles.searchButton}>
                    <Icon style={styles.searchButtonIcon} theme={{iconFamily: "MaterialIcons"}} name="bluetooth"/>
                    <Text style={styles.searchButtonText}>Search Devices</Text>
                </TouchableOpacity>
            </View>
        );
    }
}