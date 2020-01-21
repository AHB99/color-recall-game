'use strict'
import React from 'react';
import { Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableHighlight } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 
import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';

/**
 * Component to display screen to choose Game Mode.
 * @class
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

    render(){
        return (
            <SafeAreaView style={styles.bodyContainer}>
                <GameModePanelComponent gameModeText={'Accuracy Mode'}
                descriptionText={GameModeComponent.ACCURACY_DESC}
                backgroundColor={GameStyles.accuracyBgColor} 
                gameModeTextColor={GameStyles.accuracyTextColor}
                descriptionTextColor={GameStyles.accuracyDescColor}
                onPress={() => {this._navigateToGame(GameMode.ACCURACY)}}/>
                <GameModePanelComponent gameModeText={'Speed Mode'}
                descriptionText={GameModeComponent.SPEED_DESC}
                backgroundColor={GameStyles.speedBgColor} 
                gameModeTextColor={GameStyles.speedTextColor}
                descriptionTextColor={GameStyles.speedDescColor}
                onPress={() => {this._navigateToGame(GameMode.SPEED)}}/>
            </SafeAreaView>
        );
    }
    
    /**
     * Helper function to transition to GameComponent.
     * 
     * @param {GameMode} gameMode - Enum value of GameUtils.GameMode
     */
    _navigateToGame(gameMode) {
        this.props.navigation.navigate('Game', {mode: gameMode, difficulty: 1});
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
    gameModeDescriptionText: {
        fontSize: 22,
        fontFamily: 'sans-serif-light',
        textAlign: 'center',
        fontWeight: '600'
    },
});