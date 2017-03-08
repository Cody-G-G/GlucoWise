'use strict';
import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';
import NavigationDrawer from './NavigationDrawer';
import ConnectionScreen from '../screens/Connection/ConnectionScreen';
import ReadingsScreen from '../screens/Readings/ReadingsScreen';
import GraphScreen from '../screens/GraphData/GraphScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import {Navigator} from 'react-native';
import db from "../data/database";

export default class App extends Component {
    constructor(props) {
        super(props);
        db.init(true);
    }

    render() {
        return (
            <Router getSceneStyle={getSceneStyle}>
                <Scene key="drawer" component={NavigationDrawer}>
                    <Scene key="main" tabs>
                        <Scene key="screenConnection" title="Connection" initial hideTabBar component={ConnectionScreen}/>
                        <Scene key="screenGraph" title="Graph" hideTabBar component={GraphScreen}/>
                        <Scene key="screenReadings" title="Readings" hideTabBar component={ReadingsScreen}/>
                        <Scene key="screenSettings" title="Settings" hideTabBar component={SettingsScreen}/>
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

const getSceneStyle = (props, computedProps) => {
    const style = {
        backgroundColor: 'black'
    };
    if (computedProps.isActive) {
        style.marginTop = computedProps.hideNavBar ? 0 : 54;
        style.marginBottom = computedProps.hideTabBar ? 0 : 50;
    }
    return style;
};