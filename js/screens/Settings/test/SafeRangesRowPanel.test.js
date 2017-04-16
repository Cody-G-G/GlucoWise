'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
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