'use strict';
import App from './js/glue/App';
import {AppRegistry} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"

global.DEBUG = true;
AppRegistry.registerComponent('GlucoWise', () => App);