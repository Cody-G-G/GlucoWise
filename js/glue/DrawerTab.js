'use strict';
import React, {Component} from 'react';
import {Icon} from 'native-base';
import {TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class DrawerTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.tabButton}>
                <Icon theme={{iconFamily: "MaterialIcons"}} style={styles.icon} name={this.props.icon}/>

                {(typeof this.props.children) === 'undefined' ?
                    <Text style={styles.tabText}>{this.props.text}</Text> : this.props.children}
            </TouchableOpacity>
        );
    }
}