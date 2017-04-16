import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import ToggleButton from "./ToggleButton";
import styles from "./styles";

export default class ToggleButtonsGroup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttons = this.props.types.map((type, i) => {
            return <ToggleButton fontSize={this.props.fontSize}
                                 key={i}
                                 type={type}
                                 selectedTypes={this.props.selectedTypes}
                                 onPress={() => this.props.onPress(type)}
                                 onText={type}
                                 offText={type}/>
        });
        return (
            <View style={styles.toggleButtonsGroup}>
                {buttons}
            </View>
        );
    }
}