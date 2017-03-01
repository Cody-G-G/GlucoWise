import Modal from 'react-native-modalbox';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import ReadingsDatePicker from "./ReadingDatePicker";
import ReadingValueInput from "../../helpers/components/ReadingValueInput";
import StandardSetterButton from "../../helpers/components/StandardSetterButton";
import isInputValid from "../../helpers/util/readingValidator";
import log from '../../helpers/util/logger';
import dateUtil from '../../helpers/util/date';
import styles from './styles';
import db from '../../data/database';
import {ListItem} from 'native-base';
import processReading from "../../helpers/util/readingProcessor";

export default class AddReadingModal extends Component {
    constructor(props) {
        super(props);
        this.standardUK = 'mmol/L';
        this.standardUS = 'mg/dL';
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

                <View style={{flex: 5, alignItems:'center'}}>
                    <ListItem itemDivider><Text style={{alignSelf:'center', fontSize:30, fontWeight:'bold'}}>Add New Reading</Text></ListItem>

                    <View style={{flex:1,flexDirection:'row', margin:10}}>
                        <Text style={{flex:1, color:'black', alignSelf:'center', fontWeight: 'bold', fontSize:25}}>Value: </Text>
                        <ReadingValueInput style={styles.valueInput}
                                           inputValue={this.state.inputValue}
                                           onChangeText={(input) => {this.updateInputValue(input)}}/>
                    </View>
                    <View style={{flex: 1, flexDirection:'row', margin:10}}>
                        <Text style={{flex:1,color:'black', alignSelf:'center', fontWeight: 'bold', fontSize:25}}>Date: </Text>
                        <ReadingsDatePicker style={{flex:2.5, width: 190, borderWidth:1}}
                                            backgroundColor='royalblue'
                                            minDate={"31-08-1994"}
                                            type={'datetime'}
                                            maxDate={new Date()}
                                            date={this.state.inputDate}
                                            handleDateChange={this.updateInputDate.bind(this)}/>
                    </View>


                    <View style={{flexDirection:'row', margin: 10}}>
                        <StandardSetterButton type='US' onPress={this.setStandardUS.bind(this)} standard={this.state.standard}/>
                        <StandardSetterButton type='UK' onPress={this.setStandardUK.bind(this)} standard={this.state.standard}/>
                    </View>

                </View>

                <View style={styles.modalBottomPanel}>
                    <TouchableOpacity style={styles.modalAddButton} onPress={this.saveAndClose}>
                        <Text style={styles.modalAddButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
        );
    }

    setStandardUS() {
        this.setState({
            standard: this.standardUS
        });
    }

    setStandardUK() {
        this.setState({
            standard: this.standardUK
        });
    }

    updateInputValue(inputValue) {
        this.setState({
            inputValue: inputValue
        });
    }

    updateInputDate(inputDate) {
        this.setState({
            inputDate: inputDate
        });
    }

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