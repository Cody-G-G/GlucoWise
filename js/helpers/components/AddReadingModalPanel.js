import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text, StyleSheet} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";
import ToggleButtonsGroup from "./ToggleButtonsGroup";
import {readingUnitStandards} from "../util/constants";
import CustomDateInput from "./CustomDateInput";
import CustomInput from "./CustomInput";

export default class AddReadingModalPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const unitButtonTypes = Object.values(readingUnitStandards);
        const margin = 35;
        const buttonGroupRowStyle = StyleSheet.flatten([styles.customInput, {margin: margin, marginBottom: 50}]);
        return (
            <View style={{flex: 9}}>
                <CustomInput inputLabel='Value'
                             inputValue={this.props.inputValue}
                             onChangeText={this.props.onChangeReadingValue}
                             margin={margin}
                             unitLabel={this.props.standard}
                             unitLabelFlex={0.9}
                             required/>
                <CustomDateInput inputDate={this.props.inputDate} handleDateChange={this.props.handleDateChange} margin={margin} required/>

                <View style={buttonGroupRowStyle}>
                    <ToggleButtonsGroup types={unitButtonTypes}
                                        selectedTypes={[this.props.standard]}
                                        onPress={this.props.onPressStandard}/>
                </View>
            </View>
        );
    }
}