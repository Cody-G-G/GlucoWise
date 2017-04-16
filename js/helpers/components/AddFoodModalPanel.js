import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import CustomInput from "./CustomInput";
import CustomDateInput from "./CustomDateInput";

export default class AddFoodModalPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const labelSize = 18;
        return (
            <View style={{flex: 9}}>
                <CustomInput inputLabel='Name' inputValue={this.props.inputName} onChangeText={this.props.onChangeName} type='default' fontSize={labelSize} maxLength={30}/>
                <CustomDateInput inputDate={this.props.inputDate} handleDateChange={this.props.handleDateChange} fontSize={labelSize} required/>
                <CustomInput inputLabel='Calories' inputValue={this.props.inputCalories} onChangeText={this.props.onChangeCalories} fontSize={labelSize} unitLabel='kcal' required/>
                <CustomInput inputLabel='Carbohydrates' inputValue={this.props.inputCarbohydrates} onChangeText={this.props.onChangeCarbohydrates} fontSize={labelSize} unitLabel='g' required/>
                <CustomInput inputLabel='Weight' inputValue={this.props.inputWeight} onChangeText={this.props.onChangeWeight} fontSize={labelSize} unitLabel='g'/>
                <CustomInput inputLabel='Protein' inputValue={this.props.inputProtein} onChangeText={this.props.onChangeProtein} fontSize={labelSize} unitLabel='g'/>
                <CustomInput inputLabel='Fats' inputValue={this.props.inputFats} onChangeText={this.props.onChangeFats} fontSize={labelSize} unitLabel='g'/>
            </View>
        );
    }
}