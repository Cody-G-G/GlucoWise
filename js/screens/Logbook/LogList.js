'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {ListView, Text, TouchableOpacity, View, StyleSheet} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import {Icon} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
import LogReadingRow from "./LogReadingRow";
import LogFoodRow from "./LogFoodRow";
import styles from "./styles";
import {dbObjects} from "../../helpers/util/constants";

export default class LogList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const dataSource = this.ds.cloneWithRows(this.props.data);
        return (
            <View style={{flex: 10}}>
                <ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.logRow}>
                        {rowData.objectName === dbObjects.reading ?
                        <LogReadingRow data={rowData} standard={this.props.standard}/>:
                        <LogFoodRow data={rowData}/>}

                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => this.props.delete(rowData, rowData.objectName)}>
                                <Icon style={styles.trashIcon} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
                }/>
            </View>
        );
    }
}