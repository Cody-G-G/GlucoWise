import Modal from 'react-native-modalbox'; // this is from a 3rd party dependency NPM module, "react-native-modalbox"
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text, ScrollView} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import {ListItem} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
import styles from './styles';
import log from "../util/logger";

export default class ScrollModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering ScrollModal");
        return (
            <Modal style={styles.scrollModal}
                   position='center'
                   ref='modal'
                   isOpen={this.props.isOpen}
                   backButtonClose={true}
                   animationDuration={300}
                   swipeToClose={false}
                   swipeArea={0}
                   onClosed={this.props.onClose}>
                <View style={styles.scrollModalMainPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.scrollModalHeaderText}>{this.props.headerText}</Text>
                    </ListItem>
                    <ScrollView>
                        {this.props.content}
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}