'use strict'
import {LabColorBundle, RgbColorBundle} from './GameUtils';
import * as ColorConversionFunctions from './ColorConversionFunctions';

/**
 * Generates a base lab color and a balanced mix of fair similar rgb colors.
 * 
 * This function will repeatedly check (to a limit) that the generated colors 
 * deviate far enough from the correct answer to be fair.
 * 
 * @param {number} numberOfColors 
 * @param {number} deltaLimit 
 * @param {{min: number, max: number}} lRange - Range of valid a/b values for Lab colors
 * @param {{min: number, max: number}} abRange - Range of valid l values for base Lab color
 * @returns {{labColor: {L: number, a: number, b: number}, listOfSimilarColors: RgbColorBundle[]}} - 
 * Object containing correct Lab color and list of similar rgb color bundles
 * including the correct answer with property 'deltaE' set to 0 
 */
export function generateRandomLabColorAndFairListOfSimilarRgbColors(numberOfColors, deltaLimit, lRange, abRange){
    let i = 0;
    let isTooSimilar = true;
    let correctLabColor, listOfSimilarLabColors;

    while ((i < FAIRNESS_CHECK_ITERATION_LIMIT) && isTooSimilar ){
        isTooSimilar = false;
        let candidateResult = generateRandomLabColorAndListOfSimilarLabColors(numberOfColors,deltaLimit,lRange,abRange);
        correctLabColor = candidateResult.labColor;
        listOfSimilarLabColors = candidateResult.listOfSimilarColors;
        if (isListOfLabColorsTooSimilarToCorrectAnswer(correctLabColor, listOfSimilarLabColors)){
            console.log('From ' + JSON.stringify(correctLabColor) + 'Rejected ' + JSON.stringify(listOfSimilarLabColors));
            isTooSimilar = true;
        }
        ++i;
    }

    let listOfSimilarRgbColors = convertListOfLabColorBundlesToRgbColorBundles(listOfSimilarLabColors);
    return {labColor: correctLabColor, listOfSimilarColors: listOfSimilarRgbColors};
}

/**
 * Limit constant for function generateRandomLabColorAndFairListOfSimilarRgbColors().
 * 
 * Defines the maximum number of times to re-generate colors till a fair set is found.
 * 
 * @constant 
 */
const FAIRNESS_CHECK_ITERATION_LIMIT = 10;

/**
 * Helper function that generates a base lab color and a balanced mix of similar lab colors.
 * 
 * @param {number} numberOfColors 
 * @param {number} deltaLimit 
 * @param {{min: number, max: number}} lRange - Range of valid a/b values for Lab colors
 * @param {{min: number, max: number}} abRange - Range of valid l values for base Lab color
 * @returns {{labColor: {L: number, a: number, b: number}, listOfSimilarColors: LabColorBundle[]}} - 
 * Object containing correct Lab color and list of similar lab color bundles
 * including the correct answer with property 'deltaE' set to 0 
 */
function generateRandomLabColorAndListOfSimilarLabColors(numberOfColors, deltaLimit, lRange, abRange){
    let correctLabColor = generateRandomLabColor(lRange,abRange);
    let labList =
    generateListOfSimilarLabColorBundles(correctLabColor,numberOfColors,deltaLimit,abRange);
    return {labColor: correctLabColor, listOfSimilarColors: labList};
}

/**
 * Checks if any color in list has deltaE too small from correct answer.
 * 
 * @param {{L: number, a: number, b: number}} correctLabColor 
 * @param {LabColorBundle[]} listOfLabColors 
 * @return {boolean}
 */
function isListOfLabColorsTooSimilarToCorrectAnswer(correctLabColor, listOfLabColors){
    for (let color of listOfLabColors){
        //If distance is < 3, reject. 3 is considered to be too small to notice a difference.
        //Skip if deltaE == 0, indicating correct lab color
        if (color.deltaE !== 0 && 
            (Math.floor(ColorConversionFunctions.deltaE(correctLabColor,color.labColor)) !== color.deltaE)){
            return true;
        }
    }
    return false;
}

/**
 * Helper function that takes a base lab color and returns a balanced mix of similar colors.
 * 
 * @param {{L: number, a: number, b: number}} originalLabColor 
 * @param {number} numberOfColors 
 * @param {number} deltaLimit 
 * @param {{min: number, max: number}} abRange - Range of valid a/b values for Lab colors
 * @returns {LabColorBundle[]} - List of similar colors including 
 * originalLabColor with property 'deltaE' set to 0 
 */
function generateListOfSimilarLabColorBundles(originalLabColor, numberOfColors, deltaLimit, abRange){
    let numOfColsInASide = numberOfColors/2;
    let numOfColsInBSide = numberOfColors/2;

    //If odd, randomly add extra to a or b
    if ((numberOfColors % 2) !== 0){
        (generateRandomInteger(0,2)===0) ? ++numOfColsInASide : ++numOfColsInBSide;
    }

    let listOfAColors = getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, true, numOfColsInASide, abRange);
    let listOfBColors = getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, false, numOfColsInBSide, abRange);

    let finalList = listOfAColors.concat(listOfBColors);

    let originalColor = new LabColorBundle(originalLabColor, 0);
    finalList.push(originalColor);
    return finalList;
}

function convertListOfLabColorBundlesToRgbColorBundles(listOfLabColors) {
    return (listOfLabColors.map((color) => convertLabColorBundleToRgbColorBundle(color)));
}

function convertLabColorBundleToRgbColorBundle(labColorBundle){
    let rgbString = convertLabColorToRgbString(labColorBundle.labColor);
    return new RgbColorBundle(rgbString, labColorBundle.deltaE);
}

export function convertLabColorToRgbString({L, a, b}){
    let rgbColor = ColorConversionFunctions.labToRgb(L, a, b);
    return (convertRgbColorObjectToRgbString(rgbColor));
}

/**
 * Helper function to return a list of LabColorBundles given fixed parameters.
 * 
 * @param {{L: number, a: number, b: number}} originalLabColor 
 * @param {number} deltaLimit 
 * @param {boolean} isAVarying
 * @param {number} numberOfColors 
 * @param {{min: number, max: number}} abRange - Range of valid a/b values for Lab colors
 * @return {LabColorBundle[]}
 */
function getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, isAVarying, numberOfColors, abRange) {
    let forwardColorComponent, backwardColorComponent;

    if (isAVarying){
        forwardColorComponent = originalLabColor.a + deltaLimit;
        backwardColorComponent = originalLabColor.a - deltaLimit;
    }
    else{
        forwardColorComponent = originalLabColor.b + deltaLimit;
        backwardColorComponent = originalLabColor.b - deltaLimit;
    }

    let choosingForward;
    //Check validity
    if (forwardColorComponent > abRange.max){
        choosingForward = false;
    }
    else if (backwardColorComponent < abRange.min){
        choosingForward = true;
    }
    //If both valid, choose randomly
    else {
        choosingForward = (generateRandomInteger(0,2)===0);
    }

    //Deviation per iteration, with sign set for forwards/backwards deviation
    let componentGap = deltaLimit / numberOfColors;
    componentGap = (choosingForward ? componentGap : componentGap*-1);

    //Aggregator
    let currentDeltaE = componentGap;

    let listOfColorBundles = [];
    for (let i = 0; i < numberOfColors; ++i){
        let currentColorBundle;
        if (isAVarying){
            currentColorBundle = new LabColorBundle({
                    L: originalLabColor.L,
                    a: originalLabColor.a + currentDeltaE,
                    b: originalLabColor.b
                }
            , Math.abs(currentDeltaE));
        }
        else{
            currentColorBundle = new LabColorBundle({
                    L: originalLabColor.L,
                    a: originalLabColor.a,
                    b: originalLabColor.b + currentDeltaE
                }
            , Math.abs(currentDeltaE));
        }
        listOfColorBundles.push(currentColorBundle);  

        currentDeltaE += componentGap;   
    }
    return listOfColorBundles;
}

/**
 * @param {{min: number, max: number}} lRange - Range of valid L values for Lab colors
 * @param {{min: number, max: number}} abRange - Range of valid a/b values for Lab colors
 * @returns {{L: number, a: number, b: number}}
 */
export function generateRandomLabColor(lRange, abRange){
    return ({
        L: generateRandomInteger(lRange.min, lRange.max + 1),
        a: generateRandomInteger(abRange.min, abRange.max + 1),
        b: generateRandomInteger(abRange.min, abRange.max + 1)
    });
}

/**
 * Generates a base lab color and a random list of unique rgb color bundles.
 * 
 * @param {number} numberOfColors 
 * @returns {{labColor: {L: number, a: number, b: number}, listOfUnrelatedColors: RgbColorBundle[]}} - 
 * Object containing correct Lab color and list of random rgb color bundles with 'deltaE' set to -1 and
 * including the correct answer with property 'deltaE' set to 0
 */
export function generateRandomLabColorAndListOfUnrelatedRgbColorBundles(numberOfColors){
    let baseRgbColorObject = generateRandomRgbColorObject();
    let baseLabColor = ColorConversionFunctions.rgbToLab(baseRgbColorObject.r, baseRgbColorObject.g, baseRgbColorObject.b);

    let baseRgbColorString = convertRgbColorObjectToRgbString(baseRgbColorObject);
    let listOfUnrelatedRgbColorStrings = generateRandomListOfUnrelatedRgbColorStrings(numberOfColors, baseRgbColorString);
    //Create list of bundles with deltaE set to -1.
    let listOfUnrelatedRgbColorBundles = listOfUnrelatedRgbColorStrings.map((col) => new RgbColorBundle(col, -1));
    //Add the base color
    listOfUnrelatedRgbColorBundles.push(new RgbColorBundle(baseRgbColorString, 0));

    return {labColor: baseLabColor, listOfUnrelatedColors: listOfUnrelatedRgbColorBundles};
}

/**
 * Helper function to generate list of unique random rgb strings, different than base color.
 * 
 * @param {number} numberOfColors 
 * @param {string} baseColor - Original rgb string, to ensure no duplicate generated
 * @returns {string[]} - List of rgb strings that are all unique
 */
function generateRandomListOfUnrelatedRgbColorStrings(numberOfColors, baseColor){
    let colorsList = [];

    for (let i = 0; i < numberOfColors; ++i){    
        let newColor = generateRandomRgbColor();
        let regenerationCounter = 0;
        //Repeatedly regenerate color if it matches the base or an existing color, to a limit
        while ((baseColor === newColor || colorsList.includes(newColor)) && regenerationCounter < 9999){
            newColor = generateRandomRgbColor();
            ++regenerationCounter;
        }
        colorsList.push(newColor);
    }
    return colorsList;
}

export function generateRandomRgbColor() {
    let randomRgbColorObject = generateRandomRgbColorObject(); 
    return convertRgbColorObjectToRgbString(randomRgbColorObject);
}

function convertRgbColorObjectToRgbString(rgbColor){
    let rgbString = '#';

    rgbString += convertDecimalNumberTo2DigitHexString(rgbColor.r);
    rgbString += convertDecimalNumberTo2DigitHexString(rgbColor.g);
    rgbString += convertDecimalNumberTo2DigitHexString(rgbColor.b);

    return rgbString;
}

/**
 * Helper function to generate random rgb object.
 * 
 * @returns {{r: number, g: number, b: number}}
 */
function generateRandomRgbColorObject() {
    return ({
        r: generateRandomInteger(0,256),
        g: generateRandomInteger(0,256),
        b: generateRandomInteger(0,256)
    });
}

//Returns string
export function convertDecimalNumberTo2DigitHexString(decNum){
    let hexVal = decNum.toString(16);
    if (hexVal.length == 1){
        hexVal = '0' + hexVal;
    }
    return hexVal;
}

//Returns random number between min (inclusive) max (exclusive)
export function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
