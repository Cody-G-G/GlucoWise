'use strict';
import React, {Component} from 'react';
import {Router, Scene, Reducer} from 'react-native-router-flux';
import NavigationDrawer from './glue/NavigationDrawer';
import ConnectionScreen from './screens/Connection/ConnectionScreen';
import {Navigator} from 'react-native';
import GraphScreen from './screens/GraphData/GraphScreen';
import log from './helpers/logger';

export default class App extends Component {

    render() {
        return (
            <Router getSceneStyle={getSceneStyle}>
                <Scene key="drawer" component={NavigationDrawer}>
                    <Scene key="main"
                           tabs>
                        <Scene key="screenConnection" title="Connection" initial hideTabBar component={ConnectionScreen}/>
                        <Scene key="screenGraph" title="Graph" hideTabBar component={GraphScreen}/>
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

const getSceneStyle = (props, computedProps) => {
    const style = {
        backgroundColor:'black'
    };
    if (computedProps.isActive) {
        style.marginTop = computedProps.hideNavBar ? 0 : 53;
        style.marginBottom = computedProps.hideTabBar ? 0 : 50;
    }
    return style;
};