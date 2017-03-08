'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ReadingValueInput from "../ReadingValueInput";

test('ReadingValueInput - renders correctly', () => {
    const style = {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        flex: 2.5,
        textAlign: 'center'
    };

    const tree = renderer.create(
        <ReadingValueInput style={style}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});