'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import TimeRangeButton from "../TimeRangeButton";

test('TimeRangeButton - renders correctly', () => {
    const timeRangeButtonText = '60m';

    const tree = renderer.create(
        <TimeRangeButton timeRangeButtonText={timeRangeButtonText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});