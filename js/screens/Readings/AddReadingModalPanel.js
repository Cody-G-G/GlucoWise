import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from "./styles";
import ToggleButtonsGroup from "../../helpers/components/ToggleButtonsGroup";
import {readingUnitStandards} from "../../helpers/util/constants";
import ModalDateInputRow from "./ModalDateInputRow";
import ModalValueInputRow from "./ModalValueInputRow";

export default class AddReadingModalPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const unitButtonTypes = Object.values(readingUnitStandards);
        const rowMargin = 35;
        const buttonGroupRowStyle = StyleSheet.flatten([styles.modalInputRow, {margin: rowMargin, marginBottom: 50}]);
        return (
            <View style={{flex: 9}}>
                <ModalValueInputRow inputLabel='Value'
                                    inputValue={this.props.inputValue}
                                    onChangeText={this.props.onChangeReadingValue}
                                    rowMargin={rowMargin}/>
                <ModalDateInputRow inputDate={this.props.inputDate}
                                   handleDateChange={this.props.handleDateChange}
                                   rowMargin={rowMargin}/>

                <View style={buttonGroupRowStyle}>
                    <ToggleButtonsGroup types={unitButtonTypes}
                                        selectedTypes={[this.props.standard]}
                                        onPress={this.props.onPressStandard}/>
                </View>
            </View>
        );
    }
}