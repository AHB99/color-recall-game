'use strict'
import React from 'react';
import { StyleSheet } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 


/**
 * Component displaying the screen for one full game.
 * @class
 * 
 * @static {{Symbol}} GameMode
 * 
 * @member {number} roundTime - Duration of Recall and Remember time period
 * @member {GameMode} state.gameMode - Current game mode to display
 * @member {RgbColorBundle[]} state.currentListOfColors - List of color choices for Recall screen
 * @member {{L: number, a: number, b: number}} state.currentLabColor
 * @member {number} state.currentRoundScore 
 * @member {number} state.totalScore 
 * @member {number} state.roundNumber 
 */
export default class GameComponent extends React.Component {
    //For toolbar title
    static navigationOptions = {
        title: '',
    }

    /**
     * Enum of 3 Game Mode types, representing 3 different screens.
     * @enum
     */
    static GameMode = Object.freeze({
        REMEMBER: Symbol("remember"),
        RECALL: Symbol("recall"),
        REWARD: Symbol("reward"),
    });

    constructor(props){
        super(props);
        this.state = this._generateInitialState();
        this.roundTime = 5;
    }

    render(){
        if (this.state.gameMode === GameComponent.GameMode.REMEMBER){
            let currentRgbString = ColorGenerationFunctions.convertLabColorToRgbString(this.state.currentLabColor);
            return <RememberComponent 
            color={currentRgbString} 
            initialTime={this.roundTime}
            onTimeExpired={this._onRememberTimeExpired}
            roundNumber={this.state.roundNumber} />
        }
        else if (this.state.gameMode === GameComponent.GameMode.RECALL) {
            return <RecallComponent 
            currentListOfColors={this.state.currentListOfColors}
            onColorChoiceSelected={this._onColorChoiceSelectedInRecall}
            initialTime={this.roundTime}
            onTimeExpired={this._onRecallTimeExpired}
            roundNumber={this.state.roundNumber} />;
        }       
        else if (this.state.gameMode === GameComponent.GameMode.REWARD){
            let isLastRound = (this.state.roundNumber === MainGameConstants.MAX_ROUNDS);
            return <RewardComponent 
            currentRoundScore={this.state.currentRoundScore}
            totalScore={this.state.totalScore}
            onAdvancePressed={this._onAdvancePressedInReward}
            onGoHomePressed={this._onGoHomePressedInReward}
            roundNumber={this.state.roundNumber}
            isLastRound={isLastRound}
            maxScore={100*MainGameConstants.MAX_ROUNDS} />
        }
    }

    _onColorChoiceSelectedInRecall = (rgbColorBundle) => {
        this._managePlayerRewardForRound(false, rgbColorBundle.deltaE);
    }

    _onRememberTimeExpired = () => {
        this.setState({gameMode: GameComponent.GameMode.RECALL});
    }

    _onRecallTimeExpired = () => {
        this._managePlayerRewardForRound(true);
    }

    /**
     * Callback for Reward screen advance button to advance round number and handle game over.
     */
    _onAdvancePressedInReward = () => {
        if (this.state.roundNumber !== MainGameConstants.MAX_ROUNDS) {     
            let newColorAndList = this._getRandomLabColorAndListOfSimilarColors();  
            this.setState((state, props) => {
                return ({
                    roundNumber: state.roundNumber + 1,
                    gameMode: GameComponent.GameMode.REMEMBER,
                    currentLabColor: newColorAndList.labColor,
                    currentListOfColors: newColorAndList.listOfSimilarColors
                });
            });
        }
        else {
            this._restartGame();
        }

    }

    _onGoHomePressedInReward = () => {
        this.props.navigation.goBack();
    }

    /**
     * Updates the current and total score, and advances player to Reward screen for current round.
     * 
     * @param {boolean} didTimeExpire 
     * @param {number} deltaE - Distance between chosen and correct colors for current game round.
     */
    _managePlayerRewardForRound(didTimeExpire, deltaE){
        let roundScore = 0;

        if (didTimeExpire){
            roundScore = 0;
        }
        else if (deltaE === 0){
            roundScore = 100;
        }
        else {
            roundScore = 100*(
                    Math.abs( deltaE - MainGameConstants.DELTA_LIMIT ) / MainGameConstants.DELTA_LIMIT );
        }

        this.setState((state, props) => {
            return ({
                currentRoundScore: roundScore,
                totalScore: state.totalScore + roundScore,
                gameMode: GameComponent.GameMode.REWARD
            });
        });
    }

    _restartGame() {
        this.setState(this._generateInitialState());
    }

    /**
     * Helper function to get state object with all default properties, for constructor and restart.
     */
    _generateInitialState(){
        let newColorAndList = this._getRandomLabColorAndListOfSimilarColors();

        return ({
            gameMode: GameComponent.GameMode.REMEMBER,
            currentLabColor: newColorAndList.labColor,
            currentRoundScore: 0,
            totalScore: 0,
            roundNumber: 1, 
            currentListOfColors: newColorAndList.listOfSimilarColors
        });
    }

    /**
     * Helper function to get random Lab color and list of colors similar to it.
     * 
     * The similar colors have been checked for fairness, so they deviate far enough from correct answer.
     * 
     * @returns {{labColor: {L: number, a: number, b: number}, listOfSimilarColors: RgbColorBundle[]}}
     */
    _getRandomLabColorAndListOfSimilarColors(){
        let { labColor, listOfSimilarColors } = 
        ColorGenerationFunctions.generateRandomLabColorAndFairListOfSimilarRgbColors(
            MainGameConstants.NUM_OF_SIMILAR_COLOR_CHOICES,
            MainGameConstants.DELTA_LIMIT,
            MainGameConstants.VALID_LAB_L_RANGE,
            MainGameConstants.VALID_LAB_AB_RANGE);

        GameUtils.shuffle(listOfSimilarColors);
        console.log(JSON.stringify(listOfSimilarColors));
        return ({labColor, listOfSimilarColors});
    }
}

/**
 * Stylesheet
 */
let styles = StyleSheet.create({

});