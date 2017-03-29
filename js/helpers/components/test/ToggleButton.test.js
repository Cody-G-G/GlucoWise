'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ToggleButton from "../ToggleButton";
import {readingUnitStandards} from "../../../helpers/util/constants";

test('ToggleButton_withOnColor_shouldBeOn - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.US;
    const onColor = 'forestgreen';
    const onText = "ON";
    const offText = "OFF";

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedTypes={[selectedType]}
                      onColor={onColor}
                      onText={onText}
                      offText={offText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('ToggleButton_withoutOnColor_shouldBeOn - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.US;
    const onText = "ON";
    const offText = "OFF";

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedTypes={[selectedType]}
                      onText={onText}
                      offText={offText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('ToggleButton_shouldBeOff - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.UK;
    const onColor = 'royalblue';
    const onText = "ON";
    const offText = "OFF";

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedTypes={[selectedType]}
                      onColor={onColor}
                      onText={onText}
                      offText={offText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('ToggleButton_withFontSize_shouldBeOff - renders correctly', () => {
    const type = readingUnitStandards.US;
    const selectedType = readingUnitStandards.UK;
    const onColor = 'royalblue';
    const onText = "ON";
    const offText = "OFF";
    const fontSize = 99;

    const tree = renderer.create(
        <ToggleButton type={type}
                      selectedTypes={[selectedType]}
                      onColor={onColor}
                      onText={onText}
                      offText={offText}
                      fontSize={fontSize}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});