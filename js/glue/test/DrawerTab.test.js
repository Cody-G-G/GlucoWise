'use strict';
import React from 'react';
import 'react-native';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import DrawerTab from "../DrawerTab";

test('DrawerTab_withoutChildren - renders correctly', () => {
    const icon = 'bluetooth';
    const text = "PROP_TEXT";

    const tree = renderer.create(
        <DrawerTab icon={icon}
                   text={text}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('DrawerTab_withChildren - renders correctly', () => {
    const icon = 'bluetooth';
    const text = "PROP_TEXT";

    const tree = renderer.create(
        <DrawerTab icon={icon}>
            <Text>CHILD_TEXT</Text>
            <Text>CHILD_TEXT2</Text>
        </DrawerTab>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});