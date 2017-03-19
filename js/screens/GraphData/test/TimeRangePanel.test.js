'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import TimeRangePanel from "../TimeRangePanel";
import {timeRanges} from "../../../helpers/util/constants";


test('TimeRangePanel - renders correctly', () => {
    let timeRange = timeRanges.lastHour;

    const tree = renderer.create(
        <TimeRangePanel timeRange={timeRange}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});