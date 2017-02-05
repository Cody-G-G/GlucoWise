'use strict';
import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';
import NavigationDrawer from './glue/NavigationDrawer';
import ConnectionScreen from './screens/Connection/ConnectionScreen';
import {Navigator} from 'react-native';

class App extends Component {

    render() {
        return (
            <Router getSceneStyle={getSceneStyle}>
                <Scene key="drawer" component={NavigationDrawer}>
                    <Scene key="test"
                           hideTabBar
                           tabBarStyle={{
                               borderTopWidth: .5,
                               borderColor: '#b7b7b7',
                               backgroundColor: 'white',
                               opacity: 1
                           }}>
                        <Scene key="tabConnection" title="Connection" initial component={ConnectionScreen}/>
                    </Scene>
                </Scene>
            </Router>
        )
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

export default App;