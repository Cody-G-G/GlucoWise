'use strict';
import React, {Component} from 'react';
import {Router, Scene, Actions, ActionConst} from 'react-native-router-flux';
import NavigationDrawer from './NavigationDrawer';
import ConnectionScreen from '../screens/Connection/ConnectionScreen';
import LogbookScreen from '../screens/Readings/LogbookScreen';
import GraphScreen from '../screens/GraphData/GraphScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import BolusScreen from '../screens/Bolus/BolusScreen';
import {Navigator, Image} from 'react-native';
import db from "../data/database";
import gFit from "../data/googleFit";
import styles from "./styles";
import log from "../helpers/util/logger";
import emitter from "../helpers/util/eventEmitter";

export default class App extends Component {
    constructor(props) {
        super(props);
        db.init(true);
        db.isGoogleFitSyncEnabled() && gFit.authorizeAndConnect();
    }

    render() {
        log("Rendering App");
        return (
            <Router getSceneStyle={getSceneStyle}
                    backAndroidHandler={() => {openDrawer(); return true}}>
                <Scene key="drawer" component={NavigationDrawer}>
                    <Scene key="main" tabs>
                        <Scene key="screenConnection" title="Connection" hideTabBar component={ConnectionScreen} type={ActionConst.REFRESH} titleStyle={styles.sceneTitle} initial/>
                        <Scene key="screenGraph" title="Graphs" hideTabBar component={GraphScreen} type={ActionConst.REFRESH}
                               rightButtonStyle={{justifyContent:'center', alignItems:'center'}}
                               rightButtonImage={require('../../assets/help.png')}
                               onRight={emitHelpEvent}
                               titleStyle={styles.sceneTitle}/>
                        <Scene key="screenLogbook" title="Logbook" hideTabBar component={LogbookScreen} type={ActionConst.REFRESH} titleStyle={styles.sceneTitle}/>
                        <Scene key="screenSettings" title="Settings" hideTabBar component={SettingsScreen} type={ActionConst.REFRESH} titleStyle={styles.sceneTitle}/>
                        <Scene key="screenBolus" title="Bolus Calculator" hideTabBar component={BolusScreen} type={ActionConst.REFRESH} titleStyle={styles.sceneTitle}/>
                    </Scene>
                </Scene>
            </Router>
        );
    }
}

const emitHelpEvent = () => {
    emitter.emitGraphsHelpEvent();
};

const openDrawer = () => {
    Actions.refresh({key: 'drawer', drawerOpen: true});
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