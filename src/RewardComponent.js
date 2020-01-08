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
import ButtonComponent  from './ButtonComponent';

/**
 * Component to display Reward screen for a given game round.
 * @class
 * 
 * @member {number} props.currentRoundScore - Player's score for game round
 * @member {number} props.totalScore - Total score so far
 * @member {number} props.roundNumber
 * @member {function()} props.onOkPressed 
 */
export default class RewardComponent extends React.Component {
    render(){
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.roundNumberText}>Round {this.props.roundNumber}</Text>
                    <Text style={styles.mainText}>Results</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.rewardText}>You scored {this.props.currentRoundScore}!</Text>
                    <Text style={styles.rewardText}>Total score: {this.props.totalScore}</Text>
                </View>       
                <View style={styles.footerContainer}>
                    <ButtonComponent text={'OK'} onPress={this.props.onOkPressed} />
                </View>
            </SafeAreaView>
        );
    }
}



/**
 * Stylesheet
 */
let styles = StyleSheet.create({
    container: GameStyles.container,
    headerContainer: GameStyles.headerContainer,
    footerContainer: GameStyles.footerContainer,
    bodyContainer: GameStyles.bodyContainer,
    mainText: GameStyles.mainText,
    rewardText: GameStyles.rewardText,
    roundNumberText: GameStyles.roundNumberText,

});