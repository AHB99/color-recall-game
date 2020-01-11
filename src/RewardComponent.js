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
 * @member {number} props.maxScore - Maximum score achievable this game
 * @member {number} props.roundNumber
 * @member {boolean} props.isLastRound - Flag indicating whether game is over
 * @member {function()} props.onAdvancePressed 
 * @member {function()} props.onGoHomePressed
 */
export default class RewardComponent extends React.Component {
    render(){
        //Set advance button message and existence of Go home button based on game status
        let advanceMessage;
        let goHomeButton = null;
        let totalScoreComponent = this._getTotalScoreComponent();

        if (this.props.isLastRound){
            advanceMessage = 'New Game';
            goHomeButton = (
            <RewardButtonComponent text={'Go To Home'} onPress={this.props.onGoHomePressed} />);
        }
        else{
            advanceMessage = 'Next Round';
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.roundNumberText}>Round {this.props.roundNumber}</Text>
                    <Text style={styles.mainText}>Results</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.rewardText}>You scored {this.props.currentRoundScore}!</Text>
                    {totalScoreComponent}
                </View>       
                <View style={styles.footerContainer}>
                    <RewardButtonComponent text={advanceMessage} onPress={this.props.onAdvancePressed} />
                    {goHomeButton}
                </View>
            </SafeAreaView>
        );
    }

    _getCongratulatoryMessage(pointsPercentage) {
        console.log(pointsPercentage);
        if (pointsPercentage >= 100){
            return "Perfect!";
        }
        else if (80 <= pointsPercentage) {
            return "Excellent!";
        }
        else if (50 < pointsPercentage){
            return "Great job!";
        }
        else if (0 < pointsPercentage) {
            return "Good!";
        }
        else {
            return "Try again";
        }
    }


    _getTotalScoreComponent() {
        if (this.props.isLastRound){
            return (
                <View style={styles.container}>
                    <Text style={styles.rewardText}>Final score: {this.props.totalScore}/{this.props.maxScore}</Text>
                    <Text style={styles.rewardText}>
                        {this._getCongratulatoryMessage(Math.floor(100*(this.props.totalScore/this.props.maxScore)))}
                    </Text>
                </View>
            );
        }
        else{
            return (<Text style={styles.rewardText}>Total score: {this.props.totalScore}</Text>);
        }
        
    }

}


/**
 * Component that specializes ButtonComponent for the Reward menu
 * @function
 * 
 * @param {string} props.text - Display text
 * @param {function()} props.onPress - Callback for button press
 */
function RewardButtonComponent(props){
    return (
        <ButtonComponent 
            text={props.text}
            onPress={props.onPress}
            borderRadius={6}/>
    );
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