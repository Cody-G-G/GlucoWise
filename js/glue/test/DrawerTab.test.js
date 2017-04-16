'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import {Text, View} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
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
    const toRender =
        (<View>
            <Text>CHILD_TEXT</Text>
            <Text>CHILD_TEXT2</Text>
        </View>);

    const tree = renderer.create(
        <DrawerTab icon={icon}
                   toRender={toRender}>
        </DrawerTab>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});