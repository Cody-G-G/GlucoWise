'use strict';
import React, {Component} from 'react';
import Drawer from 'react-native-drawer';
import DrawerPanel from "./DrawerPanel";
import {DefaultRenderer, Actions} from 'react-native-router-flux';

export default class NavigationDrawer extends Component {

    render() {
        const state = this.props.navigationState;
        return (
            <Drawer
                type="overlay"
                ref="navigation"
                content={<DrawerPanel/>}
                onOpen={() => Actions.refresh({ key: state.key, open: true })}
                onClose={() => Actions.refresh({ key: state.key, open: false })}
                tapToClose
                openDrawerOffset={0.50}
                panCloseMask={0.5}
                panOpenMask={0.3}
                closedDrawerOffset={-3}
                panThreshold={0.05}
                styles={{
                    main: {opacity: 1}
                }}
                tweenHandler={(ratio) => ({
                    main: {opacity: 1 - ratio + 0.25}
                })}
                negotiatePan
                tweenDuration={10}
            >
                <DefaultRenderer navigationState={state.children[0]} onNavigate={this.props.onNavigate}/>
            </Drawer>
        );
    }
}

NavigationDrawer.childContextTypes = {
    drawer: React.PropTypes.object
};