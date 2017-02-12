'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.graphPanel}>
                </View>
                <View style={styles.readingsPanel}>
                </View>
            </View>
        );
    }
}