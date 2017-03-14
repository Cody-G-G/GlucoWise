'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ToggleButton from "../ToggleButton";

test('ToggleButton - renders correctly', () => {
    const buttonText = "BUTTON TEXT";
    const buttonColor = 'darkgrey';

    const tree = renderer.create(
        <ToggleButton buttonText={buttonText} buttonColor={buttonColor}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});