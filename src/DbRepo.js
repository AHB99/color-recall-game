import AsyncStorage from '@react-native-community/async-storage';
import { GameMode, DbKeys } from './GameUtils';

/** 
 * @param {GameMode} gameMode 
 * @returns {Promise} - A Promise containing the relevant high score list or empty list if not found
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
      } catch(e) {
        console.log('DB Error: ' + e);
    }
}