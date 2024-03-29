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
 * Set of constants for game configurations.
 */
export const MainGameConstants = {
    MAX_ROUNDS: 5,
    DELTA_LIMIT: 40,
    ROUND_TIME: 3,
    VALID_LAB_L_RANGE: {
        min: 40,
        max: 80
    },
    VALID_LAB_AB_RANGE: {
        min: -80,
        max: 80
    },
    MAX_HIGH_SCORES: 10,
    UNLOCK_DIFFICULTY_SCORE_THRESHOLD: 50,
}

/**
 * Set of constants for AsyncStorage keys
 */
export const DbKeys = {
    ACCURACY_HIGH_SCORE_LIST: 'ACCURACY_HIGH_SCORE_LIST',
    SPEED_HIGH_SCORE_LIST: 'SPEED_HIGH_SCORE_LIST',
    ACCURACY_MAX_DIFFICULTY: 'ACCURACY_MAX_DIFFICULTY',
    SPEED_MAX_DIFFICULTY: 'SPEED_MAX_DIFFICULTY',
}

/**
 * Enum of possible game modes.
 * @enum
 */
export const GameMode = Object.freeze({
    ACCURACY: Symbol("accuracy"),
    SPEED: Symbol("speed"),
});


/**
 * Data class for rgb color with deltaE for a given game round.
 * 
 * @member {string} rgbColor - String in '#xxxxxx' format
 * @member {number} deltaE - Distance from correct color choice
 * @member {boolean} isCorrect - Whether color is the target correct color
 */
export class RgbColorBundle {
    constructor(rgbColor, deltaE, isCorrect){
        this.rgbColor = rgbColor;
        this.deltaE = deltaE;
        this.isCorrect = isCorrect;
    }

}

/**
 * Data class for lab color with deltaE for a given game round.
 * 
 * @member {{L: number, a: number, b: number}} labColor - Color in Lab space
 * @member {number} deltaE - Distance from correct color choice
 * @member {boolean} isCorrect - Whether color is the target correct color
 */
export class LabColorBundle {
    constructor(labColor, deltaE, isCorrect){
        this.labColor = labColor;
        this.deltaE = deltaE;
        this.isCorrect = isCorrect;
    }
}





/**
 * Shuffles array randomly, modifying it.
 * 
 * @param {Array} arr - An array containing the items.
 */
export function shuffle(arr) {
    let randomIndex, tempVal, currentIndex;

    for (currentIndex = arr.length - 1; currentIndex > 0; currentIndex--) {
        randomIndex = Math.floor(Math.random() * (currentIndex + 1));

        tempVal = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = tempVal;
    }
}

/**
 * Sorts numeric array in descending order, modifying it.
 * 
 * @param {Array} arr - An Array containing numbers.
 */
export function sortNumericDescending(arr) {
    arr.sort((a,b) => { return (b-a);} );
}