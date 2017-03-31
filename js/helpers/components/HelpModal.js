import Modal from 'react-native-modalbox';
import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {ListItem} from 'native-base';
import styles from './styles';
import log from "../util/logger";

export default class HelpModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering HelpModal");
        return (
            <Modal style={styles.helpModal}
                   position='center'
                   ref='modal'
                   isOpen={this.props.helpOpen}
                   backButtonClose={true}
                   animationDuration={300}
                   swipeToClose={false}
                   swipeArea={0}
                   onClosed={this.props.onClose}>
                <View style={styles.helpModalMainPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.helpModalHeaderText}>Help / Instructions</Text>
                    </ListItem>
                    <ScrollView>
                        {this.props.content}
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}