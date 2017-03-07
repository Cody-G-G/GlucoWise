'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SearchButtonPanel from "../SearchButtonPanel"

test('SearchButtonPanel - renders correctly', () => {
    const tree = renderer.create(
        <SearchButtonPanel/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
