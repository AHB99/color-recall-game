'use strict'
import React from 'react';
import { StyleSheet } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 


/**
 * Component displaying the screen for one full game.
 * @class
 * 
 * @static {{Symbol}} GameScreen
 * 
 * @member {GameMode} props.navigation.state.params.mode - Current game mode
 * @member {number} roundTime - Duration of Recall and Remember time period
 * @member {GameScreen} state.gameScreen - Current game screen to display
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
     * Enum of 3 Game Screen types, representing 3 different screens.
     * @enum
     */
    static GameScreen = Object.freeze({
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
        if (this.state.gameScreen === GameComponent.GameScreen.REMEMBER){
            let currentRgbString = ColorGenerationFunctions.convertLabColorToRgbString(this.state.currentLabColor);
            return <RememberComponent 
            color={currentRgbString} 
            initialTime={this.roundTime}
            onTimeExpired={this._onRememberTimeExpired}
            roundNumber={this.state.roundNumber} />
        }
        else if (this.state.gameScreen === GameComponent.GameScreen.RECALL) {
            return <RecallComponent 
            currentListOfColors={this.state.currentListOfColors}
            onColorChoiceSelected={this._onColorChoiceSelectedInRecall}
            initialTime={this.roundTime}
            onTimeExpired={this._onRecallTimeExpired}
            roundNumber={this.state.roundNumber} />;
        }       
        else if (this.state.gameScreen === GameComponent.GameScreen.REWARD){
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
        this._managePlayerRewardForRound(false, rgbColorBundle);
    }

    _onRememberTimeExpired = () => {
        this.setState({gameScreen: GameComponent.GameScreen.RECALL});
    }

    _onRecallTimeExpired = () => {
        this._managePlayerRewardForRound(true);
    }

    /**
     * Callback for Reward screen advance button to advance round number and handle game over.
     */
    _onAdvancePressedInReward = () => {
        if (this.state.roundNumber !== MainGameConstants.MAX_ROUNDS) {     
            let newColorAndList = this._getRandomLabColorAndListOfColors();  
            this.setState((state, props) => {
                return ({
                    roundNumber: state.roundNumber + 1,
                    gameScreen: GameComponent.GameScreen.REMEMBER,
                    currentLabColor: newColorAndList.labColor,
                    currentListOfColors: newColorAndList.listOfColors
                });
            });
        }
        else {
            this._restartGame();
        }

    }

    _onGoHomePressedInReward = () => {
        this.props.navigation.navigate('Home');
    }

    /**
     * Updates the current and total score, and advances player to Reward screen for current round.
     * 
     * @param {boolean} didTimeExpire 
     * @param {number} rgbColorBundle - Color bundle selected by user
     */
    _managePlayerRewardForRound(didTimeExpire, rgbColorBundle){
        let roundScore = 0;

        if (didTimeExpire){
            roundScore = 0;
        }
        else if (rgbColorBundle.isCorrect){
            roundScore = 100;
        }
        else {
            roundScore = 100*(
                    Math.abs( rgbColorBundle.deltaE - MainGameConstants.DELTA_LIMIT ) / MainGameConstants.DELTA_LIMIT );
        }

        this.setState((state, props) => {
            return ({
                currentRoundScore: roundScore,
                totalScore: state.totalScore + roundScore,
                gameScreen: GameComponent.GameScreen.REWARD
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
        let newColorAndList = this._getRandomLabColorAndListOfColors();

        return ({
            gameScreen: GameComponent.GameScreen.REMEMBER,
            currentLabColor: newColorAndList.labColor,
            currentRoundScore: 0,
            totalScore: 0,
            roundNumber: 1, 
            currentListOfColors: newColorAndList.listOfColors
        });
    }

    /**
     * Helper function to get base Lab color and list of colors, depending on Game Mode.
     * 
     * @returns {{labColor: {L: number, a: number, b: number}, listOfColors: RgbColorBundle[]}}
     */
    _getRandomLabColorAndListOfColors() {
        let currentGameMode = this.props.navigation.getParam('mode');
        if (currentGameMode === GameMode.ACCURACY) {
            console.log('accuracy');
            return this._getRandomLabColorAndListOfSimilarRgbColors();
        }
        else if (currentGameMode === GameMode.SPEED) {
            console.log('speed');
            return this._getRandomLabColorAndListOfUnrelatedRgbColors();
        }
    }

    /**
     * Helper function for Accuracy Game Mode.
     */
    _getRandomLabColorAndListOfSimilarRgbColors(){
        let { labColor, listOfSimilarColors } = 
        ColorGenerationFunctions.generateRandomLabColorAndFairListOfSimilarRgbColors(
            MainGameConstants.NUM_OF_SIMILAR_COLOR_CHOICES,
            MainGameConstants.DELTA_LIMIT,
            MainGameConstants.VALID_LAB_L_RANGE,
            MainGameConstants.VALID_LAB_AB_RANGE);

        GameUtils.shuffle(listOfSimilarColors);
        console.log(JSON.stringify(listOfSimilarColors));
        return ({labColor: labColor, listOfColors: listOfSimilarColors});
    }

    /**
     * Helper function for Speed Game Mode.
     */
    _getRandomLabColorAndListOfUnrelatedRgbColors(){
        let { labColor, listOfUnrelatedColors } = 
        ColorGenerationFunctions.generateRandomLabColorAndListOfUnrelatedRgbColorBundles(
            MainGameConstants.NUM_OF_SIMILAR_COLOR_CHOICES);

        GameUtils.shuffle(listOfUnrelatedColors);
        console.log(JSON.stringify(listOfUnrelatedColors));
        return ({labColor: labColor, listOfColors: listOfUnrelatedColors});
    }
    
}

/**
 * Stylesheet
 */
let styles = StyleSheet.create({

});