'use strict'
import AsyncStorage from '@react-native-community/async-storage';
import { GameMode, DbKeys } from './GameUtils';

/** 
 * @param {GameMode} gameMode 
 * @returns {Promise} - A Promise containing the relevant high score list or empty list if not found.
 * Promised data is of type {[{difficulty: number, scoresList: [number]}]}
 */
export async function getHighScoreListPerGameMode(gameMode){
    if (gameMode === GameMode.ACCURACY){
        return getHighScoreListPerKey(DbKeys.ACCURACY_HIGH_SCORE_LIST);
    }
    else if (gameMode === GameMode.SPEED){
        return getHighScoreListPerKey(DbKeys.SPEED_HIGH_SCORE_LIST);
    } 
}

/** 
 * @param {GameMode} gameMode 
 * @param {{[{difficulty: number, scoresList: [number]}]}} highScoresForGameMode
 * @returns {Promise} - A Promise in case callbacks are required
 */
export async function saveHighScoreListPerGameMode(gameMode, highScoresForGameMode){
    if (gameMode === GameMode.ACCURACY){
        return setHighScoreListPerKey(DbKeys.ACCURACY_HIGH_SCORE_LIST, highScoresForGameMode);
    }
    else if (gameMode === GameMode.SPEED){
        return setHighScoreListPerKey(DbKeys.SPEED_HIGH_SCORE_LIST, highScoresForGameMode);
    }
}

/**
 * @returns {Promise} - Promise with resolve data of type
 * {{accuracyList: [{difficulty: number, scoresList: [number]}], 
 * speedList: [{difficulty: number, scoresList: [number]}]}}
 */
export function getHighScoreListsofAllGameModes() {
    let retrievedHighScores = {};
    return (getHighScoreListPerGameMode(GameMode.ACCURACY)
    .then((accuracyList) => {
        retrievedHighScores.accuracyList = accuracyList;
        return getHighScoreListPerGameMode(GameMode.SPEED);
    })
    .then((speedList) => {
        retrievedHighScores.speedList = speedList;
        return retrievedHighScores;
    })); 
}

/** 
 * @param {GameMode} gameMode 
 * @returns {Promise} - A Promise containing the relevant max difficulty, default 1 if not available.
 */
export async function getMaxDifficultyPerGameMode(gameMode){
    if (gameMode === GameMode.ACCURACY){
        return getMaxDifficultyPerKey(DbKeys.ACCURACY_MAX_DIFFICULTY);
    }
    else if (gameMode === GameMode.SPEED){
        return getMaxDifficultyPerKey(DbKeys.SPEED_MAX_DIFFICULTY);
    } 
}

/** 
 * @returns {Promise} - A Promise containing data of type {accuracyMaxDifficulty: number, speedMaxDifficulty: number}
 */
export function getMaxDifficultiesOfAllGameModes(){
    let retrievedMaxDifficulties = {};
    return (getMaxDifficultyPerGameMode(GameMode.ACCURACY)
    .then((accuracyMax) => {
        console.log('accuracyMax' + accuracyMax);
        retrievedMaxDifficulties.accuracyMaxDifficulty = accuracyMax;
        return getMaxDifficultyPerGameMode(GameMode.SPEED);
    })
    .then((speedMax) => {
        retrievedMaxDifficulties.speedMaxDifficulty = speedMax;
        return retrievedMaxDifficulties;
    })); 
}

/** 
 * @param {GameMode} gameMode 
 * @param {number} maxDifficulty 
 * @returns {Promise} - A Promise in case callbacks are required
 */
export async function saveMaxDifficultyPerGameMode(gameMode, maxDifficulty){
    if (gameMode === GameMode.ACCURACY){
        return saveDataToDb(DbKeys.ACCURACY_MAX_DIFFICULTY, maxDifficulty);
    }
    else if (gameMode === GameMode.SPEED){
        return saveDataToDb(DbKeys.SPEED_MAX_DIFFICULTY, maxDifficulty);
    }
}

/**
 * Helper function to retrieve max difficulty level or 1 if not found
 * @param {string} key 
 * @returns {Promise}
 */
async function getMaxDifficultyPerKey(key){
    return loadDataFromDb(key)
    .then((maxDifficulty) => {
        if (maxDifficulty !== null) { 
            return maxDifficulty; 
        }
        else { return 1; }
    });   
}

/**
 * Helper function to retrieve relevant high score list or empty list if not found
 * @param {string} key 
 * @returns {Promise}
 */
async function getHighScoreListPerKey(key){
    return loadDataFromDb(key)
    .then((scoreList) => {
        if (scoreList) { 
            return scoreList; 
        }
        else { return []; }
    });   
}

/**
 * Helper function to update relevant high score list
 * @param {string} key 
 */
function setHighScoreListPerKey(key, scoreList){
    return saveDataToDb(key, scoreList);
}

/**
 * @param {string} key 
 * @param {Object} data 
 * @returns {Promise}
 */
async function saveDataToDb(key, data) {
    try {
        let prom = await AsyncStorage.setItem(key, JSON.stringify(data));
        return prom;
      } catch (e) {
          console.log('DB Error: ' + e);
      }
}

/**
 * @param {string} key 
 * @returns {Promise}
 */
async function loadDataFromDb(key){
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
          return JSON.parse(value);
        }
        else {
            return null;
        }
      } catch(e) {
        console.log('DB Error: ' + e);
    }
}
