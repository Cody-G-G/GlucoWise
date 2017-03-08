'use strict';
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ReadingsList from "../ReadingsList";

test('ReadingsList - renders correctly', () => {
    const readings = [
        {id: '1', value: '50', date: new Date(2017, 2, 1, 20, 35, 10)},
        {id: '2', value: '60', date: new Date(2017, 2, 1, 20, 36, 5)},
        {id: '3', value: '70', date: new Date(2017, 2, 1, 20, 20, 10)}
    ];
    const standard = 'mg/dL';

    const tree = renderer.create(
        <ReadingsList readings={readings}
                      standard={standard}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});