import Modal from 'react-native-modalbox';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import isNumberValid from "../../helpers/util/inputValidator";
import log from '../../helpers/util/logger';
import dateUtil from '../../helpers/util/date';
import styles from './styles';
import db from '../../data/database';
import {ListItem} from 'native-base';
import processReading from "../../helpers/util/readingProcessor";
import AddReadingModalPanel from "./AddReadingModalPanel";
import AddFoodModalPanel from "./AddFoodModalPanel";
import ToggleButtonsGroup from "../../helpers/components/ToggleButtonsGroup";

export default class AddLogEntryModal extends Component {
    constructor(props) {
        super(props);
        this.logModes = {
            glucose: "Reading",
            food: "Food"
        };
        this.state = {
            inputValue: '',
            inputDate: new Date(),
            standard: db.getBGLStandard(),
            inputName: '',
            inputCalories: '',
            inputCarbohydrates: '',
            inputProtein: '',
            inputFats: '',
            inputWeight: '',
            mode: this.logModes.glucose
        }
    }

    render() {
        log("Rendering AddLogEntryModal");
        return (
            <Modal style={styles.addLogEntryModal}
                   position='center'
                   ref='modal'
                   isOpen={this.props.opened}
                   backButtonClose={true}
                   animationDuration={300}
                   onClosed={this.props.finished}>
                <View style={styles.modalMainPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.modalHeaderText}>New Log Entry</Text>
                    </ListItem>

                    <ToggleButtonsGroup fontSize={25}
                                        types={["Reading", "Food"]}
                                        selectedTypes={[this.state.mode]}
                                        onPress={this.changeMode}/>

                    {this.state.mode === this.logModes.glucose ?
                        <AddReadingModalPanel inputValue={this.state.inputValue}
                                              inputDate={this.state.inputDate}
                                              standard={this.state.standard}
                                              handleDateChange={this.updateInputDate}
                                              onChangeReadingValue={(input) => {this.updateInputReadingValue(input)}}
                                              onPressStandard={this.setStandard}/> :
                        <AddFoodModalPanel inputName={this.state.inputName}
                                           inputDate={this.state.inputDate}
                                           inputCalories={this.state.inputCalories}
                                           inputCarbohydrates={this.state.inputCarbohydrates}
                                           inputProtein={this.state.inputProtein}
                                           inputFats={this.state.inputFats}
                                           inputWeight={this.state.inputWeight}
                                           handleDateChange={this.updateInputDate}
                                           onChangeName={(input) => {this.updateInputName(input)}}
                                           onChangeCalories={(input) => {this.updateInputCalories(input)}}
                                           onChangeCarbohydrates={(input) => {this.updateInputCarbohydrates(input)}}
                                           onChangeProtein={(input) => {this.updateInputProtein(input)}}
                                           onChangeFats={(input) => {this.updateInputFats(input)}}
                                           onChangeWeight={(input) => {this.updateInputWeight(input)}}/>
                    }
                </View>

                <View style={styles.modalBottomPanel}>
                    <TouchableOpacity style={styles.addModalButton} onPress={this.saveAndClose}>
                        <Text style={styles.addModalButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
        );
    }

    changeMode = (newMode) => {
        this.setState({
            mode: newMode
        });
    };

    setStandard = (standard) => {
        this.setState({
            standard: standard
        });
    };

    updateInputReadingValue = (inputValue) => {
        this.setState({
            inputValue: inputValue
        });
    };

    updateInputDate = (inputDate) => {
        this.setState({
            inputDate: inputDate
        });
    };

    updateInputName = (inputName) => {
        this.setState({
            inputName: inputName
        });
    };

    updateInputCalories = (inputCalories) => {
        this.setState({
            inputCalories: inputCalories
        });
    };

    updateInputCarbohydrates = (inputCarbohydrates) => {
        this.setState({
            inputCarbohydrates: inputCarbohydrates
        });
    };

    updateInputProtein = (inputProtein) => {
        this.setState({
            inputProtein: inputProtein
        });
    };

    updateInputFats = (inputFats) => {
        this.setState({
            inputFats: inputFats
        });
    };

    updateInputWeight = (inputWeight) => {
        this.setState({
            inputWeight: inputWeight
        });
    };

    clearState = () => {
        this.setState({
            inputValue: '',
            inputDate: new Date()
        })
    };

    saveAndClose = () => {
        this.state.mode === this.logModes.glucose ? this.saveReading() : this.saveConsumedFoodItem();
        this.clearState();
        this.props.finished();
    };

    saveReading = () => {
        if (isNumberValid(this.state.inputValue))
            db.saveBGLReading(String(processReading(this.state.inputValue, this.state.standard, true)), dateUtil.toDateFromDateTimeString(this.state.inputDate));
        else
            alert("Please input a valid blood glucose value");
    };

    saveConsumedFoodItem = () => {
        if (isNumberValid(this.state.inputCalories) && isNumberValid(this.state.inputCarbohydrates))
            db.saveConsumedFoodItem(
                this.state.inputName,
                dateUtil.toDateFromDateTimeString(this.state.inputDate),
                this.state.inputCalories,
                this.state.inputCarbohydrates,
                this.state.inputProtein,
                this.state.inputFats,
                this.state.inputWeight);
        else
            alert("Please input valid date, calories, and carbohydrate values, which are mandatory.");
    };
}