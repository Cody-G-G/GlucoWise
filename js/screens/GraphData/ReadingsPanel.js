'use strict';
import React, {Component} from 'react';
import {ListItem, Icon} from 'native-base';
import {Text, TouchableOpacity, View, ListView} from 'react-native';
import styles from "./styles";
import log from "../../helpers/util/logger";
import TextBold from "../../helpers/components/TextBold";

export default class ReadingsPanel extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            readings: this.ds.cloneWithRows([
                {value: 82, date: new Date()},
                {value: 152, date: new Date()},
                {value: 70, date: new Date()},
                {value: 102, date: new Date()}
            ])
        }
    }

    render() {
        return (
            <View style={styles.readingsPanel}>
                <ListItem itemDivider>
                    <Text style={styles.readingsListHeader}>Readings on {(new Date()).toLocaleDateString()}</Text>
                </ListItem>

                <ListView dataSource={this.state.readings} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.reading}>
                        <Text style={styles.readingText}>
                            <TextBold>Value:</TextBold> {rowData.value + " mg/dl"}{"\n"}
                            <TextBold>Date:</TextBold> {rowData.date.toLocaleString()}
                        </Text>
                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => log("Pressed trash")}>
                                <Icon style={{color:'white', fontSize:30}} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
                }/>
            </View>
        );
    }
}