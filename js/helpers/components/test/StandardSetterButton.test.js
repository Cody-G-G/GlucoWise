'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import StandardSetterButton from "../StandardSetterButton";

test('StandardSetterButton - renders correctly', () => {
    const type = 'US';
    const standard = 'mmol/L';

    const tree = renderer.create(
        <StandardSetterButton type={type}
                              standard={standard}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});