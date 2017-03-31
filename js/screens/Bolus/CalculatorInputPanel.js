import React, {Component} from 'react';
import {View} from 'react-native';
import CalculatorInputRow from "./CalculatorInputRow";

export default class CalculatorInputPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fontSize = 17;
        const standard = this.props.standard;
        const unitLabelFlex = 0.7;
        const textColor = 'white';
        const underlineColor = 'white';

        return (
            <View style={{flex:5}}>
                <CalculatorInputRow inputLabel='Meal carbs'
                                    inputValue={this.props.carbs}
                                    onChangeText={this.props.onChangeCarbs}
                                    fontSize={fontSize}
                                    unitLabel='g'
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Latest Food'
                                    onPress={this.props.setCarbsFromLatestFood}
                                    buttonTextSize={20}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Current glucose'
                                    inputValue={this.props.bgl}
                                    onChangeText={this.props.onChangeBGL}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Latest Reading'
                                    onPress={this.props.setBGLFromLatestReading}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Target glucose'
                                    inputValue={this.props.targetBgl}
                                    onChangeText={this.props.onChangeTargetBGL}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.props.saveTargetBGL}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Carb-Insulin ratio'
                                    inputValue={this.props.cir}
                                    onChangeText={this.props.onChangeICR}
                                    fontSize={fontSize}
                                    unitLabel='g/U'
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.props.saveCarbRatio}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Insulin sensitivity'
                                    inputValue={this.props.isf}
                                    onChangeText={this.props.onChangeISF}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.props.saveInsulinSensitivity}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
            </View>);
    }
}