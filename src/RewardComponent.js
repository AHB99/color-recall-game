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
 * Component to display Reward screen for a given game round.
 * @class
 * 
 * @member {number} props.currentRoundScore - Player's score for game round
 * @member {number} props.totalScore - Total score so far
 * @member {function()} props.onOkPressed 
 */
export default class RewardComponent extends React.Component {
    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.mainText}>Results</Text>
                <Text style={styles.rewardText}>You scored {this.props.currentRoundScore}!</Text>
                <Text style={styles.rewardText}>Total score: {this.props.totalScore}</Text>
                <Button title={'OK'} style={styles.okButton} onPress={this.props.onOkPressed}/>
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
    rewardText: GameStyles.rewardText,
    okButton: {
        ...GameStyles.marginElement
    },
});