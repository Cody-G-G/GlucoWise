'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
import SafeRangeButton from "../SafeRangeButton";

test('SafeRangeButton - renders correctly', () => {
    const backgroundColor = 'royalblue';
    const buttonText = 'Set';

    const tree = renderer.create(
        <SafeRangeButton backgroundColor={backgroundColor}
                         buttonText={buttonText}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});