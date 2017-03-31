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
                <TouchableOpacity onPress={this.props.onPress} style={{marginRight:25, marginLeft: 25, marginTop:2.5, marginBottom:2.5, flex: 1, borderWidth:2, flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor: 'royalblue'}}>
                    <Icon style={{fontWeight:'bold', fontSize:45, color:'white'}} theme={{iconFamily: "MaterialIcons"}} name="bluetooth"/>
                    <Text style={{fontWeight:'bold', fontSize:32, color:'white'}}>Search Devices</Text>
                </TouchableOpacity>
            </View>
        );
    }
}