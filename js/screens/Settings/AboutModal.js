import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import log from "../../helpers/util/logger";
import styles from "../../helpers/components/styles";
import ScrollModal from "../../helpers/components/ScrollModal";

export default class AboutModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        log("Rendering BolusHelpModal");
        const content = (
            <View style={{flex: 1}}>
                <View style={styles.modalSection}>
                    <Text style={styles.normalModalText}>
                        This app was built as part of a BSc Computer Science final year project at&nbsp;
                        <Text style={styles.emphasizedModalText}>King's College London</Text>.
                        For any information, questions, or feedback, don't hesitate to email me at&nbsp;
                        <Text style={styles.emphasizedModalText}>Codrin.Gidei@gmail.com</Text>
                    </Text>
                </View>
                <View style={styles.modalSection}>
                    <Text style={styles.normalModalText}>
                        The making of this was made possible through a number of solutions provided by the
                        open source community. They are the following:&nbsp;{'\n'}{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-pathjs-charts</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-ble-manager</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   realm</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   moment</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-router-flux</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   native-base</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-datepicker</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-drawer</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-modalbox</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-root-toast</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-spinkit</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   uuid</Text>{'\n'}
                        <Text style={styles.emphasizedModalText}>-|-   react-native-android-location-services-dialog-box</Text>{'\n'}
                    </Text>
                </View>
            </View>
        );

        return (
            <ScrollModal content={content} isOpen={this.props.isOpen} onClose={this.props.onClose} headerText='About This Application'/>
        );
    }
}