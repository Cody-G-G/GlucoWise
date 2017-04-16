'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
import AddButton from "../AddButton";

test('AddButton - renders correctly', () => {
    const tree = renderer.create(
        <AddButton/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});