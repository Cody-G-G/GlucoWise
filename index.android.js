'use strict';
import App from './js/glue/App';
import {AppRegistry} from 'react-native';

global.DEBUG = true;
AppRegistry.registerComponent('GlucoWise', () => App);