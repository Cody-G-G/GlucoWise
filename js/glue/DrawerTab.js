'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {Icon} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
import {TouchableOpacity, Text} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";

export default class DrawerTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const iconFamily = typeof this.props.iconFamily !== 'undefined' ? this.props.iconFamily : 'MaterialIcons';
        const toRender = typeof this.props.toRender !== 'undefined' ?
            this.props.toRender :
            <Text style={styles.tabText}>{this.props.text}</Text>;

        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.tabButton}>
                <Icon theme={{iconFamily: iconFamily}} style={styles.icon} name={this.props.icon}/>
                {toRender}
            </TouchableOpacity>
        );
    }
}