'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';
import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import * as GameStyles from './GameStyles';

/**
 * Component to display Remember screen for a given game round.
 * @class
 * 
 * @member {string} props.color - The RGB string in format '#xxxxxx' to remember
 * @member {number} props.initialTime - Time delay to remember the color
 * @member {number} props.roundNumber
 * @member {function()} props.onTimeExpired - Callback when timer runs out
 * @member {number} state.timeLeft - Current remaining time
 */
export default class RememberComponent extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            timeLeft: this.props.initialTime,
        }
    }

    componentDidMount(){
        this.timer = setInterval(this._advanceTime, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    _advanceTime = () => {
        if (this.state.timeLeft <= 1){
            this.props.onTimeExpired();
            clearInterval(this.timer);
            return;
        }
        this.setState((state, props) => {
            return { timeLeft: (state.timeLeft - 1) }
        });
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.roundNumberText}>Round {this.props.roundNumber}</Text>
                <Text style={styles.mainText}>Remember this color!</Text>
                <Text style={styles.timerText}>{this.state.timeLeft} seconds left</Text>
                <View style={[styles.rectangle, {backgroundColor: this.props.color}]} />
            </SafeAreaView>
        );
    }
}

/**
 * Stylesheet
 */
let styles = StyleSheet.create({
    container: GameStyles.container,
    mainText: GameStyles.mainText,
    roundNumberText: GameStyles.roundNumberText,
    timerText: GameStyles.timerText,
    rectangle: GameStyles.rectangle,
});