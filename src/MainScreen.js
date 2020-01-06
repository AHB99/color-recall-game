'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';
import * as ColorGenerationFunctions from './ColorGenerationFunctions';


/**
 * Component displaying the screen for one full game.
 * @class
 * 
 * @static {{Symbol}} GameMode
 * 
 * @member {GameMode} state.gameMode - Current game mode to display
 * @member {RgbColorBundle[]} state.currentListOfColors - List of color choices for Recall screen
 * @member {{L: number, a: number, b: number}} state.currentLabColor
 * @member {number} state.currentRoundScore 
 * @member {number} state.totalScore 
 * @member {number} state.roundNumber 
 */
export default class MainScreen extends React.Component {
    //For title
    static navigationOptions = {
        title: 'Main',
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

    }

    render(){

        if (this.state.gameMode === MainScreen.GameMode.REMEMBER){
            let currentRgbString = ColorGenerationFunctions.convertLabColorToRgbString(this.state.currentLabColor);
            return <RememberComponent 
            color={currentRgbString} 
            initialTime={5}
            onTimeExpired={this._onRememberTimeExpired} />
        }
        else if (this.state.gameMode === MainScreen.GameMode.RECALL) {
            return <RecallComponent 
            currentListOfColors={this.state.currentListOfColors}
            onColorChoiceSelected={this._onColorChoiceSelectedInRecall}
            initialTime={5}
            onTimeExpired={this._onRecallTimeExpired} />;
        }       
        else if (this.state.gameMode === MainScreen.GameMode.REWARD){
            return <RewardComponent 
            currentRoundScore={this.state.currentRoundScore}
            totalScore={this.state.totalScore}
            onOkPressed={this._onOkPressedInReward} />
        }
    }

    _onColorChoiceSelectedInRecall = (rgbColorBundle) => {
        this._managePlayerRewardForRound(false, rgbColorBundle.deltaE);
    }

    _onRememberTimeExpired = () => {
        this.setState({gameMode: MainScreen.GameMode.RECALL});
    }

    _onRecallTimeExpired = () => {
        this._managePlayerRewardForRound(true);
    }

    /**
     * Callback for Reward screen OK button to advance round number and handle game over.
     */
    _onOkPressedInReward = () => {
        if (this.state.roundNumber !== MainGameConstants.MAX_ROUNDS) {     
            let newColorAndList = this._getRandomLabColorAndListOfSimilarColors();  
            this.setState((state, props) => {
                return ({
                    roundNumber: state.roundNumber + 1,
                    gameMode: MainScreen.GameMode.REMEMBER,
                    currentLabColor: newColorAndList.labColor,
                    currentListOfColors: newColorAndList.listOfSimilarColors
                });
            });
        }
        else {
            this._restartGame();
        }

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
                gameMode: MainScreen.GameMode.REWARD
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
            gameMode: MainScreen.GameMode.REMEMBER,
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
     * @returns {{labColor: {L: number, a: number, b: number}, listOfSimilarColors: RgbColorBundle[]}}
     */
    _getRandomLabColorAndListOfSimilarColors(){
        let labColor = ColorGenerationFunctions.generateRandomLabColor();
        let listOfSimilarColors = ColorGenerationFunctions.generateListOfSimilarColors(
            labColor,
            MainGameConstants.NUM_OF_SIMILAR_COLOR_CHOICES,
            MainGameConstants.DELTA_LIMIT
        );
        return ({labColor, listOfSimilarColors});
    }
}

/**
 * Set of constants for game configurations.
 */
const MainGameConstants = {
    MAX_ROUNDS: 5,
    DELTA_LIMIT: 40,
    NUM_OF_SIMILAR_COLOR_CHOICES: 4,
}


/**
 * Component to display Remember screen for a given game round.
 * @class
 * @member {string} props.color - The RGB string in format '#xxxxxx' to remember
 * @member {number} props.initialTime - Time delay to remember the color
 * @member {function()} props.onTimeExpired - Callback when timer runs out
 * @member {number} state.timeLeft - Current remaining time
 */
class RememberComponent extends React.Component {

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
                <Text style={styles.mainText}>Remember this color!</Text>
                <Text style={styles.timerText}>{this.state.timeLeft} seconds left</Text>
                <View style={[styles.rectangle, {backgroundColor: this.props.color}]} />
            </SafeAreaView>
        );
    }
}


/**
 * Component to display Recall screen for a given game round.
 * @class
 * @member {RgbColorBundle[]} props.currentListOfColors
 * @member {function({RgbColorBundle})} props.onColorChoiceSelected
 * @member {number} props.initialTime - Time delay to recall the color
 * @member {function()} props.onTimeExpired - Callback when timer runs out
 * @member {number} state.timeLeft - Current remaining time 
 */
class RecallComponent extends React.Component {

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

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.mainText}>Find the color!</Text>
                <Text style={styles.timerText}>{this.state.timeLeft} seconds left</Text>
                <FlatList 
                    data={this.props.currentListOfColors}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderColorBox}
                    style={styles.list}
                />
            </SafeAreaView>
        );
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


    _renderColorBox = ({item}) => {
        return (<ColorChoiceListItem 
            rgbColorBundle={item}
            onColorChoiceSelected={this._colorChoiceSelected}/>);
    };

    _colorChoiceSelected = (rgbColorBundle) => {
        this.props.onColorChoiceSelected(rgbColorBundle);
    }


}


/**
 * Component to display Reward screen for a given game round.
 * @class
 * 
 * @member {number} props.currentRoundScore - Player's score for game round
 * @member {number} props.totalScore - Total score so far
 * @member {function()} props.onOkPressed 
 */
class RewardComponent extends React.Component {
    render(){
        return (
            <SafeAreaView style={[styles.container, {justifyContent: 'space-around'}]}>
                <Text style={styles.mainText}>Results</Text>
                <Text style={styles.rewardText}>You scored {this.props.currentRoundScore}!</Text>
                <Text style={styles.rewardText}>Total score: {this.props.totalScore}</Text>
                <Button title={'OK'} style={styles.okButton} onPress={this.props.onOkPressed}/>
            </SafeAreaView>
        );
    }
}


/**
 * Component for a single item in the list of color choices in Recall screen.
 * @class
 * @member {RgbColorBundle} props.rgbColorBundle
 * @member {function({RgbColorBundle})} onColorChoiceSelected
 */
class ColorChoiceListItem extends React.Component {

    render(){
        return(
            //Using Dimensions because '%' unit seems to block scrolling
            <TouchableWithoutFeedback 
            onPress={() => {this.props.onColorChoiceSelected(this.props.rgbColorBundle)}}
            disabled={false}>
                <View 
                style={
                    {height: (Dimensions.get('window').height*0.3), 
                    backgroundColor: this.props.rgbColorBundle.rgbColor, 
                    borderRadius: 10, 
                    margin: 20}}
                />
            </TouchableWithoutFeedback>
        );
    }

}

/**
 * Data class for rgb color with deltaE for a given game round.
 * 
 * @member {string} rgbColor - String in '#xxxxxx' format
 * @member {number} deltaE - Distance from correct color choice
 */
export class RgbColorBundle {
    constructor(rgbColor, deltaE){
        this.rgbColor = rgbColor;
        this.deltaE = deltaE;
    }

}

/**
 * Data class for lab color with deltaE for a given game round.
 * 
 * @member {{L: number, a: number, b: number}} labColor - Color in Lab space
 * @member {number} deltaE - Distance from correct color choice
 */
export class LabColorBundle {
    constructor(labColor, deltaE){
        this.labColor = labColor;
        this.deltaE = deltaE;
    }
}



//---Styles---

const elem = {
    margin: 20
}

let styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
        },
        rectangle: {
            width: '80%',
            height: '40%',
            borderRadius: 20,
            ...elem,
        },
        mainText: {
            fontFamily: 'serif',
            fontSize: 30,
            ...elem,
        },  
        rewardText: {
            fontFamily: 'serif',
            fontSize: 25,
            ...elem,
        },   
        timerText: {
            fontFamily: 'serif',
            fontSize: 20,
            ...elem,
        },
        list: {
            width: '80%', 
            height: '50%', 
            flexGrow: 0
        },
        okButton: {
            ...elem,
        }

    }
)