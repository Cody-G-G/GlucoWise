'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"
import LogList from "../LogList";
import {dbObjects, readingUnitStandards} from "../../../helpers/util/constants";

test('LogList - renders correctly', () => {
    const readings = [
        {objectName: dbObjects.reading, id: '1', value: '50', date: new Date(2017, 2, 1, 20, 35, 10)},
        {objectName: dbObjects.reading, id: '2', value: '60', date: new Date(2017, 2, 1, 18, 36, 5)},
        {objectName: dbObjects.reading, id: '3', value: '70', date: new Date(2017, 2, 1, 5, 20, 10)}
    ];
    const foodItems = [
        {
            objectName: dbObjects.foodItem,
            id: '1',
            name: "TESTNAME_1",
            date: new Date(2017, 2, 1, 19),
            calories: 150,
            carbohydrates: 25,
            protein: 50,
            fats: 50,
            weight: 300
        },
        {
            objectName: dbObjects.foodItem,
            id: '2',
            name: "TESTNAME_2",
            date: new Date(2017, 2, 1, 17),
            calories: 150,
            carbohydrates: 25,
            protein: 50,
            fats: 50,
            weight: 300
        },
        {
            objectName: dbObjects.foodItem,
            id: '3',
            name: "",
            date: new Date(2017, 2, 1, 6),
            calories: 150,
            carbohydrates: 25,
            protein: 50,
            fats: 50,
            weight: 300
        },
    ];
    const data = readings.concat(foodItems);

    const tree = renderer.create(
        <LogList data={data}
                 standard={readingUnitStandards.UK}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});