'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
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