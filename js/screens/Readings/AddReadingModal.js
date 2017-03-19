import Modal from 'react-native-modalbox';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import ReadingDatePicker from "./ReadingDatePicker";
import ReadingValueInput from "../../helpers/components/ReadingValueInput";
import isInputValid from "../../helpers/util/readingValueValidator";
import log from '../../helpers/util/logger';
import dateUtil from '../../helpers/util/date';
import styles from './styles';
import db from '../../data/database';
import {ListItem} from 'native-base';
import processReading from "../../helpers/util/readingProcessor";
import {readingUnitStandards} from "../../helpers/util/constants";
import ToggleButton from "../../helpers/components/ToggleButton";

export default class AddReadingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            inputDate: new Date(),
            standard: db.getBGLStandard()
        }
    }

    render() {
        log("Rendering AddReadingModal");
        return (
            <Modal style={styles.addReadingModal}
                   position='center'
                   ref='modal'
                   isOpen={this.props.opened}
                   backButtonClose={true}
                   animationDuration={300}
                   onClosed={this.props.finished}>
                <View style={styles.modalMainPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.modalHeaderText}>Add New Reading</Text>
                    </ListItem>

                    <View style={styles.modalInputRow}>
                        <Text style={styles.inputLabel}>Value: </Text>
                        <ReadingValueInput style={styles.valueInput}
                                           inputValue={this.state.inputValue}
                                           onChangeText={(input) => {this.updateInputValue(input)}}/>
                    </View>
                    <View style={styles.modalInputRow}>
                        <Text style={styles.inputLabel}>Date: </Text>
                        <ReadingDatePicker style={styles.modalDatePicker}
                                           backgroundColor='royalblue'
                                           minDate={"31-08-1994"}
                                           type={'datetime'}
                                           maxDate={new Date()}
                                           date={this.state.inputDate}
                                           handleDateChange={this.updateInputDate}/>
                    </View>

                    <View style={styles.modalInputRow}>
                        <ToggleButton type={readingUnitStandards.US}
                                      selectedType={this.state.standard}
                                      onPress={this.setStandardUS}
                                      onColor='royalblue'
                                      offColor='darkgrey'
                                      onText={readingUnitStandards.US}
                                      offText={readingUnitStandards.US}/>
                        <ToggleButton type={readingUnitStandards.UK}
                                      selectedType={this.state.standard}
                                      onPress={this.setStandardUK}
                                      onColor='royalblue'
                                      offColor='darkgrey'
                                      onText={readingUnitStandards.UK}
                                      offText={readingUnitStandards.UK}/>
                    </View>
                </View>

                <View style={styles.modalBottomPanel}>
                    <TouchableOpacity style={styles.addButton} onPress={this.saveAndClose}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
        );
    }

    setStandardUS = () => {
        this.setState({
            standard: readingUnitStandards.US
        });
    };

    setStandardUK = () => {
        this.setState({
            standard: readingUnitStandards.UK
        });
    };

    updateInputValue(inputValue) {
        this.setState({
            inputValue: inputValue
        });
    }

    updateInputDate = (inputDate) => {
        this.setState({
            inputDate: inputDate
        });
    };

    clearState = () => {
        this.setState({
            inputValue: '',
            inputDate: new Date()
        })
    };

    saveAndClose = () => {
        this.saveReading();
        this.clearState();
        this.props.finished();
    };

    saveReading = () => {
        if (isInputValid(this.state.inputValue))
            db.saveBGLReading(String(processReading(this.state.inputValue, this.state.standard, true)), dateUtil.toDateFromDateTimeString(this.state.inputDate));
        else
            alert("Please input a valid blood glucose value");
    };
}