'use strict';
import React, {Component} from 'react';
import {Router, Scene, Actions} from 'react-native-router-flux';
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
        this.state = {
            drawerOpen: false
        };
        db.init(true);
    }

    render() {
        return (
            <Router getSceneStyle={getSceneStyle}
                    backAndroidHandler={() => {openDrawer(); return true}}>
                <Scene key="drawer" component={NavigationDrawer} open={false}>
                    <Scene key="main" tabs>
                        <Scene key="screenConnection" title="Connection" hideTabBar component={ConnectionScreen} initial/>
                        <Scene key="screenGraph" title="Graph" hideTabBar component={GraphScreen}/>
                        <Scene key="screenReadings" title="Readings" hideTabBar component={ReadingsScreen}/>
                        <Scene key="screenSettings" title="Settings" hideTabBar component={SettingsScreen}/>
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

const openDrawer = () => {
    Actions.refresh({key: 'drawer', open: value => !value})
};

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