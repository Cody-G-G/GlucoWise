'use strict';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
export default (props) => <Text style={StyleSheet.flatten([props.style, {fontWeight: 'bold'}])}>{props.children}</Text>;