'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
import TextBold from "../TextBold";

test('TextBold - renders correctly', () => {
    const style = {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        flex: 2.5,
        textAlign: 'center'
    };

    const tree = renderer.create(
        <TextBold style={style}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});