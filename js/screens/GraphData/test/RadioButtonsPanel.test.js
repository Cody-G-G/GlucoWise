'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import RadioButtonsPanel from "../RadioButtonsPanel";
import {timeRanges} from "../../../helpers/util/constants";


test('RadioButtonsPanel - renders correctly', () => {
    let timeRange = timeRanges.lastHour;
    let types = [timeRanges.lastDay, timeRanges.lastHour];

    const tree = renderer.create(
        <RadioButtonsPanel
            types={types}
            timeRange={timeRange}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});