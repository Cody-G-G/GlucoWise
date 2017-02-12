'use strict';
import React, { Component } from 'react';
import { Button, Icon } from 'native-base';
import { View } from 'react-native';
import styles from "./styles";

export default class SearchButtonPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.searchButtonPanel}>
                <Button onPress={this.props.onPress} large style={{backgroundColor: 'cornflowerblue'}} disabled={this.props.scanning}>
                    <Icon theme={{iconFamily: "MaterialIcons"}} name="bluetooth"/>Search Devices
                </Button>
            </View>
        );
    }
}