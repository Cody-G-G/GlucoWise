'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import CustomDatePicker from "../CustomDatePicker";
import styles from "../../../screens/Logbook/styles";

test('CustomDatePicker - renders correctly', () => {
    const maxDate = "08-03-2017";
    const date = "07-03-2017";
    const backgroundColor = 'dimgray';
    const type = 'date';
    const minDate = "31-08-1994";

    const tree = renderer.create(
        <CustomDatePicker style={styles.customDatePicker}
                          backgroundColor={backgroundColor}
                          minDate={minDate}
                          type={type}
                          maxDate={maxDate}
                          date={date}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});