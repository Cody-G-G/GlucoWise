'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import GraphPanel from './GraphPanel';
import ReadingsPanel from './ReadingsPanel';

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <GraphPanel/>
                <ReadingsPanel/>
            </View>
        );
    }
}