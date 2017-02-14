'use strict';
import React, {Component} from 'react';
import {ListItem, Icon} from 'native-base';
import {Text, TouchableOpacity, View, ListView} from 'react-native';
import styles from "./styles";
import log from "../../helpers/util/logger";
import dateUtil from "../../helpers/util/date";
import TextBold from "../../helpers/components/TextBold";

export default class ReadingsPanel extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        return (
            <View style={styles.readingsPanel}>
                <ListItem itemDivider>
                    <Text style={styles.readingsListHeader}>Readings last 24h</Text>
                </ListItem>

                <ListView dataSource={this.ds.cloneWithRows(this.props.readings)} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.reading}>
                        <Text style={styles.readingText}>
                            <TextBold>Value:</TextBold> {rowData.value + " mg/dl"}{"\n"}
                            <TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}
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