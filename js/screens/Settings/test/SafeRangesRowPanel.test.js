'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SafeRangeRowPanel from "../SafeRangeRowPanel";

test('SafeRangeRowPanel - renders correctly', () => {
    const inputLabel = 'Min:';
    const inputValue = '80';

    const tree = renderer.create(
        <SafeRangeRowPanel inputLabel={inputLabel}
                           inputValue={inputValue}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});