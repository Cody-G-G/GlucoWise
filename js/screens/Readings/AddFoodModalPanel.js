import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ModalValueInputRow from "./ModalValueInputRow";
import ModalDateInputRow from "./ModalDateInputRow";

export default class AddFoodModalPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const labelSize = 18;
        return (
            <View style={{flex: 9}}>
                <ModalValueInputRow inputLabel='Name' inputValue={this.props.inputName} onChangeText={this.props.onChangeName} type='default' fontSize={labelSize} maxLength={30}/>
                <ModalDateInputRow inputDate={this.props.inputDate} handleDateChange={this.props.handleDateChange} fontSize={labelSize} required/>
                <ModalValueInputRow inputLabel='Calories' inputValue={this.props.inputCalories} onChangeText={this.props.onChangeCalories} fontSize={labelSize} required/>
                <ModalValueInputRow inputLabel='Carbohydrates' inputValue={this.props.inputCarbohydrates} onChangeText={this.props.onChangeCarbohydrates} fontSize={labelSize} required/>
                <ModalValueInputRow inputLabel='Weight' inputValue={this.props.inputWeight} onChangeText={this.props.onChangeWeight} fontSize={labelSize}/>
                <ModalValueInputRow inputLabel='Protein' inputValue={this.props.inputProtein} onChangeText={this.props.onChangeProtein} fontSize={labelSize}/>
                <ModalValueInputRow inputLabel='Fats' inputValue={this.props.inputFats} onChangeText={this.props.onChangeFats} fontSize={labelSize}/>
            </View>
        );
    }
}