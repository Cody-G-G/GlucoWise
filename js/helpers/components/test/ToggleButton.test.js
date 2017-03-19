'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ToggleButton from "../ToggleButton";
import {readingUnitStandards} from "../../../helpers/util/constants";

test('ToggleButton_shouldBeOn - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.US;
    const onColor = 'royalblue';
    const offColor = 'darkgrey';
    const onText = "ON";
    const offText = "OFF";

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedType={selectedType}
                      onColor={onColor}
                      offColor={offColor}
                      onText={onText}
                      offText={offText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('ToggleButton_shouldBeOff - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.UK;
    const onColor = 'royalblue';
    const offColor = 'darkgrey';
    const onText = "ON";
    const offText = "OFF";

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedType={selectedType}
                      onColor={onColor}
                      offColor={offColor}
                      onText={onText}
                      offText={offText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});