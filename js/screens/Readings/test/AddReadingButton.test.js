'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import AddReadingButton from "../AddReadingButton";

test('AddReadingButton - renders correctly', () => {
    const tree = renderer.create(
        <AddReadingButton/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});