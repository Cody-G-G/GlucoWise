'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text, TouchableOpacity, Alert} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import CalculatorInputPanel from "./CalculatorInputPanel";
import CalculatorButtonsPanel from "./CalculatorButtonsPanel";
import isNumberValid from "../../helpers/util/inputValidator";
import db from "../../data/database";
import emitter from "../../helpers/util/eventEmitter";
import styles from "./styles";
import AddLogEntryModal from "../../helpers/components/AddLogEntryModal";
import BolusHelpModal from "./BolusHelpModal";

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
            standard: db.standard,
            bolus: '',
            addModalOpen: false,
            helpModalOpen: false
        }
    }

    render() {
        const bolusCalculated = this.state.bolus !== '';
        return (
            <View style={{backgroundColor: 'aliceblue', flex: 1}}>
                <CalculatorInputPanel standard={this.state.standard}
                                      carbs={this.state.carbs}
                                      bgl={this.state.bgl}
                                      targetBgl={this.state.targetBgl}
                                      cir={this.state.cir}
                                      isf={this.state.isf}
                                      onChangeCarbs={this.onChangeCarbs}
                                      onChangeBGL={this.onChangeBGL}
                                      onChangeTargetBGL={this.onChangeTargetBGL}
                                      onChangeICR={this.onChangeICR}
                                      onChangeISF={this.onChangeISF}
                                      setCarbsFromLatestFood={this.setCarbsFromLatestFood}
                                      setBGLFromLatestReading={this.setBGLFromLatestReading}
                                      saveTargetBGL={this.saveTargetBGL}
                                      saveCarbRatio={this.saveCarbRatio}
                                      saveInsulinSensitivity={this.saveInsulinSensitivity}/>

                <View style={styles.resultPanel}>
                    {bolusCalculated &&
                    <Text style={styles.resultText}>
                        Bolus dose:&nbsp;<Text style={{color: 'royalblue'}}>{this.state.bolus}</Text>&nbsp;units
                    </Text>}
                </View>

                <CalculatorButtonsPanel onPressCalculate={this.calculateBolus} onPressAdd={this.openAddModal}/>

                <AddLogEntryModal opened={this.state.addModalOpen} finished={this.finishedAdding}/>
                <BolusHelpModal isOpen={this.state.helpModalOpen} onClose={this.closeHelpModal}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLStandardListener(this.updateStandard);
        emitter.addBolusHelpListener(this.openHelpModal)
    }

    /**
     * @param inputCarbs
     */
    onChangeCarbs = (inputCarbs) => {
        this.setState({
            carbs: inputCarbs
        });
    };

    /**
     * @param inputBGL
     */
    onChangeBGL = (inputBGL) => {
        this.setState({
            bgl: inputBGL
        });
    };

    /**
     * @param inputICR
     */
    onChangeICR = (inputICR) => {
        this.setState({
            cir: inputICR
        });
    };

    /**
     * @param inputISF
     */
    onChangeISF = (inputISF) => {
        this.setState({
            isf: inputISF
        });
    };

    /**
     * @param inputTargetBGL
     */
    onChangeTargetBGL = (inputTargetBGL) => {
        this.setState({
            targetBgl: inputTargetBGL
        });
    };

    setCarbsFromLatestFood = () => {
        this.setState({
            carbs: db.lastConsumedItem.carbohydrates
        });
    };

    setBGLFromLatestReading = () => {
        this.setState({
            bgl: db.latestReadingValue
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
        if (isNumberValid(this.state.carbs) &&
            isNumberValid(this.state.cir) &&
            isNumberValid(this.state.isf) &&
            isNumberValid(this.state.bgl) &&
            isNumberValid(this.state.targetBgl)) {

            const result = ((this.state.carbs / this.state.cir) + ((this.state.bgl - this.state.targetBgl) / this.state.isf)).toFixed(1);
            result < 0 ? Alert.alert("Invalid input", "Please input valid numbers for the Meal Carbohydrates / Current Glucose / Target Glucose / Carbohydrate Ratio / Insulin Sensitivity fields. For more information tap on the help button on the top right.") :
                this.setState({
                    bolus: result
                });
        }
        else
            Alert.alert("Invalid input", "Please input valid numbers for the Meal Carbohydrates / Current Glucose / Target Glucose / Carbohydrate Ratio / Insulin Sensitivity fields. For more information tap on the help button on the top right.");
    };

    openAddModal = () => {
        this.setState({
            addModalOpen: true
        });
    };

    updateStandard = () => {
        const bolusVars = db.getBolusVariables();
        this.setState({
            standard: db.standard,
            targetBgl: bolusVars.targetBGL,
            bgl: '',
            isf: bolusVars.insulinSensitivity
        });
    };

    finishedAdding = () => {
        this.setState({
            addModalOpen: false
        });
    };

    closeHelpModal = () => {
        this.setState({
            helpModalOpen: false
        });
    };

    openHelpModal = () => {
        this.setState({
            helpModalOpen: true
        });
    };
}