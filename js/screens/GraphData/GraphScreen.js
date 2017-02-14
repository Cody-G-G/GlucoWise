'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import GraphPanel from './GraphPanel';
import ReadingsPanel from './ReadingsPanel';
import db from "../../data/database";

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readings: db.get24hBGLReadings(),
            graphReadings: this.getGraphReadings()
        }
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <GraphPanel readings={this.state.graphReadings}/>
                <ReadingsPanel readings={this.state.readings}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.setReadings.bind(this));
    }

    getGraphReadings() {
        let graphReadings = [];
        db.get24hBGLReadings().forEach((reading) => {
                graphReadings.push({
                    x: reading.date.getHours() + "." + (reading.date.getMinutes() / 60 * 100).slice(0, 4),
                    y: reading.value
                })
            }
        );
        return [graphReadings];
    }

    setReadings() {
        this.setState({
            readings: db.get24hBGLReadings(),
            graphReadings: this.getGraphReadings()
        })
    }
}