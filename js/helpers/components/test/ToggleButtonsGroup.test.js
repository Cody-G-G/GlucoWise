'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
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