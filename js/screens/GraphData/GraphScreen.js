'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import GraphPanel from './GraphPanel';

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <GraphPanel/>
                <View style={styles.readingsPanel}>
                    <Text>TEST</Text>
                </View>
            </View>
        );
    }
}