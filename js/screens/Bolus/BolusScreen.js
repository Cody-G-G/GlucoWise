'use strict';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import CalculatorInputRow from "./CalculatorInputRow";
import isNumberValid from "../../helpers/util/inputValidator";
import {Icon} from 'native-base';
import db from "../../data/database";
import styles from "./styles";

export default class BolusScreen extends Component {
    constructor(props) {
        super(props);
        const bolusVars = db.getBolusVariables();
        this.state = {
            carbs: '',
            bgl: '',
            cir: bolusVars.carbohydrateInsulinRatio,
            isf: bolusVars.insulinSensitivity,
            targetBgl: bolusVars.targetBGL,
            standard: db.getBGLStandard(),
            bolus: ''
        }
    }

    render() {
        const fontSize = 17;
        const standard = this.state.standard;
        const bolusCalculated = this.state.bolus !== '';
        const unitLabelFlex = 0.5;
        const textColor = 'white';
        const underlineColor = 'white';
        return (
            <View style={{backgroundColor: 'aliceblue', flex: 1}}>
                <CalculatorInputRow inputLabel='Meal carbs'
                                    inputValue={this.state.carbs}
                                    onChangeText={this.onChangeCarbs}
                                    fontSize={fontSize}
                                    unitLabel='g'
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Latest Food'
                                    onPress={this.setCarbsFromLatestFood}
                                    buttonTextSize={20}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Current glucose'
                                    inputValue={this.state.bgl}
                                    onChangeText={this.onChangeBGL}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Latest Reading'
                                    onPress={this.setBGLFromLatestReading}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Target glucose'
                                    inputValue={this.state.targetBgl}
                                    onChangeText={this.onChangeTargetBGL}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.saveTargetBGL}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Carb-Insulin ratio'
                                    inputValue={this.state.cir}
                                    onChangeText={this.onChangeICR}
                                    fontSize={fontSize}
                                    unitLabel='g/U'
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.saveCarbRatio}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>
                <CalculatorInputRow inputLabel='Insulin sensitivity'
                                    inputValue={this.state.isf}
                                    onChangeText={this.onChangeISF}
                                    fontSize={fontSize}
                                    unitLabel={standard}
                                    unitLabelFlex={unitLabelFlex}
                                    buttonText='Save'
                                    onPress={this.saveInsulinSensitivity}
                                    buttonTextSize={30}
                                    textColor={textColor}
                                    underlineColor={underlineColor}/>

                <View style={styles.resultPanel}>
                    {bolusCalculated &&
                    <Text style={styles.resultText}>Bolus dose:&nbsp;<Text style={{color: 'royalblue'}}>{this.state.bolus}</Text>&nbsp;units</Text>}
                </View>

                <TouchableOpacity style={styles.calculateButton} onPress={this.calculateBolus}>
                    <Text style={styles.calculateButtonText}>
                        <Icon theme={{iconFamily: "Ionicons"}} name="md-calculator"/>&nbsp;Calculate Bolus
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    onChangeCarbs = (inputCarbs) => {
        this.setState({
            carbs: inputCarbs
        });
    };

    onChangeBGL = (inputBGL) => {
        this.setState({
            bgl: inputBGL
        });
    };

    onChangeICR = (inputICR) => {
        this.setState({
            cir: inputICR
        });
    };

    onChangeISF = (inputISF) => {
        this.setState({
            isf: inputISF
        });
    };

    onChangeTargetBGL = (inputTargetBGL) => {
        this.setState({
            targetBgl: inputTargetBGL
        });
    };

    setCarbsFromLatestFood = () => {
        this.setState({
            carbs: db.getLastConsumedItem().carbohydrates
        });
    };

    setBGLFromLatestReading = () => {
        this.setState({
            bgl: db.getLatestReadingValue()
        });
    };

    saveTargetBGL = () => {
        db.saveTargetBGL(this.state.targetBgl);
    };

    saveCarbRatio = () => {
        db.saveCarbohydrateInsulinRatio(this.state.cir);
    };

    saveInsulinSensitivity = () => {
        db.saveInsulinSensitivityFactor(this.state.isf);
    };

    calculateBolus = () => {
        if (isNumberValid(this.state.carbs) && isNumberValid(this.state.cir) && isNumberValid(this.state.isf) && isNumberValid(this.state.bgl) && isNumberValid(this.state.targetBgl))
            this.setState({
                bolus: ((this.state.carbs / this.state.cir) + ((this.state.bgl - this.state.targetBgl) / this.state.isf)).toFixed(1)
            });
        else
            Alert.alert("Invalid input", "Please input valid numbers for the Meal Carbohydrates / Current Glucose / Target Glucose / Carbohydrate Ratio / Insulin Sensitivity fields. For more information tap on the help button on the top right.");
    }
}