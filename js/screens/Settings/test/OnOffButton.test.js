'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import OnOffButton from "../OnOffButton";

test('ToggleButton_isOnTrue - renders correctly', () => {
    const isOn = true;

    const tree = renderer.create(
        <OnOffButton buttonText={isOn}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('ToggleButton_isOnFalse - renders correctly', () => {
    const isOn = false;

    const tree = renderer.create(
        <OnOffButton isOn={isOn}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});