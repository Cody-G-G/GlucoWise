'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SafeRangesRowPanel from "../SafeRangesRowPanel";

test('SafeRangesRowPanel - renders correctly', () => {
    const inputLabel = 'Min:';
    const inputValue = '80';
    const standard = 'mg/dL';

    const tree = renderer.create(
        <SafeRangesRowPanel inputLabel={inputLabel}
                            inputValue={inputValue}
                            standard={standard}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});