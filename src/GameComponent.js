'use strict'
import React from 'react';
import { StyleSheet } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 
import * as DbRepo from './DbRepo';


/**
 * Component displaying the screen for one full game.
 * @class
 * 
 * @static {{Symbol}} GameScreen
 * 
 * @member {GameMode} props.navigation.state.params.mode - Current game mode
 * @member {GameMode} props.navigation.state.params.difficulty - Current game difficulty level
 * @member {number} roundTime - Duration of Recall and Remember time period
 * @member {GameScreen} state.gameScreen - Current game screen to display
 * @member {RgbColorBundle[]} state.currentListOfColors - List of color choices for Recall screen
 * @member {{L: number, a: number, b: number}} state.currentLabColor
 * @member {number} state.currentRoundScore 
 * @member {number} state.totalScore 
 * @member {number} state.roundNumber 
 * @member {[{difficulty: number, scoreList: [number]}]} state.highScoresOfGameMode
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
        this.roundTime = 2;
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

    componentDidMount(){
        this._loadHighScoreListOfGameModeFromDb();
    }

    _onColorChoiceSelectedInRecall = (rgbColorBundle, timeLeft) => {
        this._managePlayerRewardForRound(rgbColorBundle, timeLeft);
    }

    _onRememberTimeExpired = () => {
        this.setState({gameScreen: GameComponent.GameScreen.RECALL});
    }

    _onRecallTimeExpired = () => {
        this._managePlayerRewardForRound(null, 0);
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
     * @param {RgbColorBundle} selectedRgbColorBundle - Color bundle selected by user
     * @param {number} timeLeft - Remaining time in round
     */
    _managePlayerRewardForRound(selectedRgbColorBundle, timeLeft){      
        let currentGameMode = this._getCurrentGameMode();
        let roundScore;
        if (currentGameMode === GameMode.ACCURACY) {
            roundScore = this._getRoundScoreForAccuracyMode(selectedRgbColorBundle,timeLeft);
        }
        else if (currentGameMode === GameMode.SPEED) {
            roundScore = this._getRoundScoreForSpeedMode(selectedRgbColorBundle,timeLeft);
        }
        roundScore = Math.floor(roundScore);

        this.setState((state, props) => {
            return ({
                currentRoundScore: roundScore,
                totalScore: state.totalScore + roundScore,
                gameScreen: GameComponent.GameScreen.REWARD
            });
        });
        if (this.state.roundNumber === MainGameConstants.MAX_ROUNDS){
            this._updateHighScores();
        }
    }

    /**
     * @param {RgbColorBundle} selectedRgbColorBundle - Color bundle selected by user
     * @param {number} timeLeft - Remaining time in round
     * @returns {number} - Score for round
     */
    _getRoundScoreForAccuracyMode(selectedRgbColorBundle, timeLeft){
        let roundScore = 0;
        if (timeLeft === 0){
            roundScore = 0;
        }
        else if (selectedRgbColorBundle.isCorrect){
            roundScore = 100;
        }
        else {
            roundScore = 100*(
                    Math.abs( selectedRgbColorBundle.deltaE - MainGameConstants.DELTA_LIMIT ) / MainGameConstants.DELTA_LIMIT );
        }
        return roundScore;
    }

    /**
     * Returns score, 0 if wrong, else proportionate to time taken.
     * 
     * @param {RgbColorBundle} selectedRgbColorBundle - Color bundle selected by user
     * @param {number} timeLeft - Remaining time in round
     * @returns {number} - Score for round
     */
    _getRoundScoreForSpeedMode(selectedRgbColorBundle, timeLeft){
        let roundScore = 0;

        if (!selectedRgbColorBundle.isCorrect){
            roundScore = 0;
        }
        else {
            roundScore = 100*(timeLeft / this.roundTime );
        }
        return roundScore;
    }

    _restartGame() {
        this.setState(this._generateInitialState());
        this._loadHighScoreListOfGameModeFromDb();
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
            currentListOfColors: newColorAndList.listOfColors,
            highScoresOfGameMode: [],
        });
    }

    /**
     * Helper function to get base Lab color and list of colors, depending on Game Mode.
     * 
     * @returns {{labColor: {L: number, a: number, b: number}, listOfColors: RgbColorBundle[]}}
     */
    _getRandomLabColorAndListOfColors() {
        let currentGameMode = this._getCurrentGameMode();
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
    
    /**
     * Helper function to get game mode
     * @returns {GameMode} 
     */
    _getCurrentGameMode(){
        return this.props.navigation.getParam('mode');
    }

    /**
     * Helper function to get game difficulty
     * @returns {number} 
     */
    _getCurrentGameDifficulty(){
        return this.props.navigation.getParam('difficulty');
    }

    /**
     * Helper function to update state with relevant high score list from Db.
     */
    _loadHighScoreListOfGameModeFromDb(){
        //Retrieve relevant high score list and update state with it
        DbRepo.getHighScoreListPerGameMode(this._getCurrentGameMode())
        .then((highScoreList) => {
            this.setState({highScoresOfGameMode: highScoreList})
        });
    }

    _updateHighScores(){
        this.setState((state, props) => {

            //Find index of difficulty list for current difficulty
            const currentDifficultyListIndex = state.highScoresOfGameMode.findIndex(
                (diffList) => {return (diffList.difficulty === this._getCurrentGameDifficulty());}
            );
            
            let currentDifficultyList;

            //Find difficulty list using index
            if (currentDifficultyListIndex !== -1){
                currentDifficultyList = state.highScoresOfGameMode[currentDifficultyListIndex];
            }
            else {
                //If no list yet for current difficulty, create one and add to old state list.
                currentDifficultyList = {difficulty: this._getCurrentGameDifficulty(), scoresList: []};
                state.highScoresOfGameMode.push(currentDifficultyList);
            }

            //Update difficulty list with current score
            if (currentDifficultyList.scoresList.length < MainGameConstants.MAX_HIGH_SCORES){
                currentDifficultyList.scoresList.push(Math.floor(100*(state.totalScore/(100*MainGameConstants.MAX_ROUNDS))));
                GameUtils.sortNumericDescending(currentDifficultyList.scoresList);
            }

            //Save to Db
            DbRepo.saveHighScoreListPerGameMode(this._getCurrentGameMode(), state.highScoresOfGameMode);
            
            return ({
                highScoresOfGameMode: state.highScoresOfGameMode,
            });
        });
    }
}

