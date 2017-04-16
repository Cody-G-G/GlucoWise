'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
import SearchButtonPanel from "../SearchButtonPanel"

test('SearchButtonPanel - renders correctly', () => {
    const tree = renderer.create(
        <SearchButtonPanel/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});