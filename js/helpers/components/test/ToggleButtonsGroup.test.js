'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ToggleButtonsGroup from "../ToggleButtonsGroup";
import {timeRanges} from "../../util/constants";


test('ToggleButtonsGroup - renders correctly', () => {
    let timeRange = timeRanges.lastHour;
    let types = [timeRanges.lastDay, timeRanges.lastHour];

    const tree = renderer.create(
        <ToggleButtonsGroup
            types={types}
            timeRange={timeRange}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});