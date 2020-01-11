'use strict'
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 
import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';

export default class GameModeComponent extends React.Component {

    //For toolbar title
    static navigationOptions = {
        title: '',
    }

    render(){
        return (
            <SafeAreaView style={styles.bodyContainer}>
                <ButtonComponent text={'Accuracy Mode'} 
                onPress={() => {this._navigateToGame(GameMode.ACCURACY)}}/>
                <ButtonComponent text={'Speed Mode'} 
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
        this.props.navigation.navigate('Game', {mode: gameMode});
    }

}

let styles = StyleSheet.create({
    bodyContainer: {
        ...GameStyles.bodyContainer,
        backgroundColor: 'white',
    }
});