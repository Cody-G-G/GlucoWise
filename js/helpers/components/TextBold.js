'use strict';
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {Text, StyleSheet} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
export default (props) => <Text style={StyleSheet.flatten([props.style, {fontWeight: 'bold'}])}>{props.children}</Text>;