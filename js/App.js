'use strict';
import React, {Component} from 'react';
import ConnectionScreen from './screens/Connection/ConnectionScreen';
import Drawer from 'react-native-drawer';
import DrawerPanel from "./glue/DrawerPanel";

class App extends Component {
    closeDrawer = () => {
        this._drawer.close()
    };
    openDrawer = () => {
        this._drawer.open()
    };

    render() {
        return (
            <Drawer
                type="overlay"
                ref={(_drawer) => this._drawer = _drawer}
                content={<DrawerPanel/>}
                onOpen={this.openDrawer.bind(this)}
                onClose={this.closeDrawer.bind(this)}
                tapToClose={true}
                openDrawerOffset={0.55}
                panCloseMask={0.7}
                panOpenMask={0.3}
                closedDrawerOffset={-3}
                panThreshold={0.05}
                styles={{main: {
                    opacity: 1
                }}}
                tweenHandler={(ratio) => ({
                    main: {opacity: (2 - ratio) / 2}
                })}
                side={"right"}
                negotiatePan={true}
                tweenDuration={75}
            >
                <ConnectionScreen />
            </Drawer>
        )
    }
}

export default App;