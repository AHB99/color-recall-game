'use strict'
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableHighlight } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 
import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';
import SpinnerComponent from './SpinnerComponent';
import * as DbRepo from './DbRepo';


/**
 * Component to display screen to choose Game Mode.
 * @class
 * 
 * @member {GameModeScreen} state.gameModeScreen - Enum value representing current screen to display.
 * @member {GameMode} state.selectedGameMode - Enum value representing selected Game Mode.
 * @member {{accuracyMaxDifficulty: number, speedMaxDifficulty: number}} state.maxDifficulties
 */
export default class GameModeComponent extends React.Component {

    //For toolbar title
    static navigationOptions = {
        title: '',
    }

    /**
     * @constant
     */
    static ACCURACY_DESC = `Recall a color from a list of similar colors. The closer you are, the higher your score.`;
    static SPEED_DESC = `Recall a color from a list of random colors. The faster you are, the higher your score.`;


    constructor(props){
        super(props);
        this.state = {
            gameModeScreen: GameModeScreen.CHOOSE_GAME_MODE,
            selectedGameMode: null,
            maxDifficulties: null,
        }
    }

    render(){
        if (this.state.gameModeScreen === GameModeScreen.CHOOSE_GAME_MODE){
            return (
                <SafeAreaView style={styles.bodyContainer}>
                    <GameModePanelComponent gameModeText={'Accuracy Mode'}
                    descriptionText={GameModeComponent.ACCURACY_DESC}
                    backgroundColor={accuracyBgColor} 
                    gameModeTextColor={accuracyTextColor}
                    descriptionTextColor={accuracyDescColor}
                    onPress={() => {this._showChooseDifficultyScreen(GameMode.ACCURACY)}}/>
                    <GameModePanelComponent gameModeText={'Speed Mode'}
                    descriptionText={GameModeComponent.SPEED_DESC}
                    backgroundColor={speedBgColor} 
                    gameModeTextColor={speedTextColor}
                    descriptionTextColor={speedDescColor}
                    onPress={() => {this._showChooseDifficultyScreen(GameMode.SPEED)}}/>
                </SafeAreaView>
            );
        }
        else if ((this.state.gameModeScreen === GameModeScreen.CHOOSE_DIFFICULTY) && (this.state.maxDifficulties !== null) ){          
            console.log(this._getMaxDifficultyForCurrentGameMode());
            return (
                <ChooseDifficultyComponent selectedGameMode={this.state.selectedGameMode}
                maxDifficulty={this._getMaxDifficultyForCurrentGameMode()}
                onStartGamePressed={this._onStartGamePressedInDifficultyScreen}/>
            );
        }
        else {
            console.log('Error, no screen available.');
            return null;
        }
        
    }

    /**
     * Standard callback that runs when screen initializes
     * 
     * Callback implemented to pull high scores from database.
     */
    componentDidMount(){
        DbRepo.getMaxDifficultiesOfAllGameModes()
        .then((retrievedMaxDifficulties) => {
            console.log(JSON.stringify(retrievedMaxDifficulties));
            this.setState({maxDifficulties: retrievedMaxDifficulties});
        });
    }

    _onStartGamePressedInDifficultyScreen = (selectedDifficulty) => {
        this.props.navigation.navigate('Game', {mode: this.state.selectedGameMode, difficulty: selectedDifficulty});
    }
    
    /**
     * Helper function to transition to Choose Difficulty screen.
     * 
     * @param {GameMode} gameMode - Enum value of GameUtils.GameMode
     */
    _showChooseDifficultyScreen(gameMode) {
        this.setState({
            gameModeScreen: GameModeScreen.CHOOSE_DIFFICULTY,
            selectedGameMode: gameMode,
        });
    }

    _getMaxDifficultyForCurrentGameMode(){
        if (this.state.selectedGameMode === GameMode.ACCURACY){
            return this.state.maxDifficulties.accuracyMaxDifficulty;
        }
        else if (this.state.selectedGameMode === GameMode.SPEED){
            return this.state.maxDifficulties.speedMaxDifficulty;
        }
    }

}

/**
 * Component that displays a single Game Mode choice.
 * @function
 * 
 * @param {string} props.gameModeText
 * @param {string} props.descriptionText
 * @param {string} props.backgroundColor
 * @param {string} props.gameModeTextColor
 * @param {string} props.descriptionTextColor
 * @param {function} props.onPress
 */
function GameModePanelComponent(props){
    return (
        <TouchableOpacity 
        style={[styles.panelContainer, {backgroundColor: props.backgroundColor}]} 
        onPress={props.onPress}>
            <Text style={[styles.gameModeText, {color: props.gameModeTextColor}]}>
                {props.gameModeText}
            </Text>
            <Text style={[styles.gameModeDescriptionText, {color: props.descriptionTextColor}]}>
                {props.descriptionText}
            </Text>
        </TouchableOpacity>
    );
}

/**
 * Component that displays the Choose Difficulty screen
 * @class
 * 
 * @member {number} state.selectedDifficulty - Value from spinner
 * @member {GameMode} props.selectedGameMode
 * @member {number} props.maxDifficulty 
 * @member {function(number)} props.onStartGamePressed - Callback, accepts selected difficulty
 */
class ChooseDifficultyComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            selectedDifficulty : props.maxDifficulty,
        }
    }

    static HINT_STRING = `Hint: Achieve a score of 50% or higher to unlock the next difficulty level!`;

    render(){
        let bgColor;
        if (this.props.selectedGameMode === GameMode.ACCURACY){ 
            bgColor = accuracyBgColor;
        }
        else if (this.props.selectedGameMode === GameMode.SPEED) { 
            bgColor = speedBgColor; 
        }

        return (
            <SafeAreaView style={[styles.difficultyContainer, {backgroundColor: bgColor}]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.difficultyTitleText}>Choose Difficulty</Text>
                </View>
                <View style={styles.difficultyBodyContainer}>
                    <SpinnerComponent range={{min: 1, max: this.props.maxDifficulty}} onValueChanged={this._onSpinnerValueChanged}/>
                    <Text style={styles.difficultyHintText}>{ChooseDifficultyComponent.HINT_STRING}</Text>
                    <ButtonComponent text={'Start Game'} onPress={() => {this.props.onStartGamePressed(this.state.selectedDifficulty)}}/>
                </View>
            </SafeAreaView>
        );
    }


    _onSpinnerValueChanged = (newValue) => {
        this.setState({selectedDifficulty : newValue});
    }

}

/**
 * Enum of all screens for Game Mode to display
 * @enum
 */
const GameModeScreen = Object.freeze({
    CHOOSE_GAME_MODE: Symbol("chooseGameMode"),
    CHOOSE_DIFFICULTY: Symbol("chooseDifficulty"),
});


//Styles

const accuracyBgColor = '#7BE4FB';
const speedBgColor = '#F96646';

const accuracyTextColor = '#F8502C';
const speedTextColor = '#46D9F9';

const accuracyDescColor = '#DA593D';
const speedDescColor = '#61DFFA';

const gameModeDescriptionText = {
    fontSize: 22,
    fontFamily: 'sans-serif-light',
    textAlign: 'center',
    fontWeight: '600'
}

let styles = StyleSheet.create({
    bodyContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1,
    },
    panelContainer: {
       justifyContent: 'center',
       alignItems: 'stretch',
       flexGrow: 1,
       padding: 10,
    },
    gameModeText: {
        fontSize: 40,
        fontFamily: 'monospace',
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 20,
    },
    gameModeDescriptionText: gameModeDescriptionText,
    difficultyContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    difficultyTitleText: {
        fontSize: 50,
        fontFamily: 'monospace',
        textAlign: 'center',
        margin: 25,
        color: 'white'
    },
    difficultyHintText: {
        ...gameModeDescriptionText, 
        color: 'white',
        fontSize: 26,
    }, 
    headerContainer: {
        flex: 0,
    }, 
    difficultyBodyContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,  
        padding: 20,  
    }

});