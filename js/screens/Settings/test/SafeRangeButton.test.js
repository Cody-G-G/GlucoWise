'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
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