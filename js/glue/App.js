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
        const backButtonImageStyle = {
            height: 24,
            resizeMode: 'contain'
        };
        const menuIcon = require('../../assets/menu_burger.png');
        return (
            <Router getSceneStyle={getSceneStyle}
                    onExitApp={() => {openDrawer(); return true}}>
                <Scene key="drawer" component={NavigationDrawer} open={false}>
                    <Scene key="main"
                           tabs={false}
                           onLeft={openDrawer}
                           leftButtonImage={menuIcon}>
                        <Scene key="screenConnection"
                               title="Connection"
                               hideTabBar
                               component={ConnectionScreen}
                               duration={0.35}
                               direction='leftToRight'
                               initial
                               backButtonImage={menuIcon}
                               backButtonTextStyle={backButtonImageStyle}
                               onBack={openDrawer}/>
                        <Scene key="screenGraph"
                               title="Graph"
                               hideTabBar
                               component={GraphScreen}
                               duration={0.35}
                               direction='leftToRight'
                               backButtonImage={menuIcon}
                               backButtonTextStyle={backButtonImageStyle}
                               onBack={openDrawer}/>
                        <Scene key="screenReadings"
                               title="Readings"
                               hideTabBar
                               component={ReadingsScreen}
                               duration={0.35}
                               direction='leftToRight'
                               backButtonImage={menuIcon}
                               backButtonTextStyle={backButtonImageStyle}
                               onBack={openDrawer}/>
                        <Scene key="screenSettings"
                               title="Settings"
                               hideTabBar
                               component={SettingsScreen}
                               duration={0.35}
                               direction='leftToRight'
                               backButtonImage={menuIcon}
                               backButtonTextStyle={backButtonImageStyle}
                               onBack={openDrawer}/>
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