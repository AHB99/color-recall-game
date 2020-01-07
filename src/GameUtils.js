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
    NUM_OF_SIMILAR_COLOR_CHOICES: 4,
    VALID_LAB_L_RANGE: {
        min: 40,
        max: 80
    },
    VALID_LAB_AB_RANGE: {
        min: -80,
        max: 80
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



/**
 * Shuffles array randomly, modifying in place.
 * 
 * @param {Array} arr An array containing the items.
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
