'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import GraphsHelpModal from "../GraphsHelpModal";

test('GraphsHelpModal_isNotOpen - renders correctly', () => {

    const tree = renderer.create(
        <GraphsHelpModal/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('GraphsHelpModal_isOpen - renders correctly', () => {

    const tree = renderer.create(
        <GraphsHelpModal isOpen={true}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});