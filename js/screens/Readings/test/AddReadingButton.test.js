'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import AddButton from "../AddButton";

test('AddButton - renders correctly', () => {
    const tree = renderer.create(
        <AddButton/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});