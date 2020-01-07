'use strict'
import {LabColorBundle, RgbColorBundle} from './GameUtils';
import * as ColorConversionFunctions from './ColorConversionFunctions';

/**
 * Takes a base lab color and returns a balanced mix of similar colors.
 * 
 * @param {{L: number, a: number, b: number}} originalLabColor 
 * @param {number} numberOfColors 
 * @param {number} deltaLimit 
 * @param {{min: number, max: number}} abRange - Range of valid a/b values for Lab colors
 * @returns {RgbColorBundle[]} - List of similar colors including 
 * originalLabColor's rgb equivalent with property 'deltaE' set to 0 
 */
export function generateListOfSimilarColors(originalLabColor, numberOfColors, deltaLimit, abRange){
    let numOfColsInASide = numberOfColors/2;
    let numOfColsInBSide = numberOfColors/2;

    //If odd, randomly add extra to a or b
    if ((numberOfColors % 2) !== 0){
        (generateRandomInteger(0,2)===0) ? ++numOfColsInASide : ++numOfColsInBSide;
    }

    let listOfAColors = getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, true, numOfColsInASide, abRange);
    let listOfBColors = getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, false, numOfColsInBSide, abRange);

    listOfAColors = convertListOfLabColorBundlesToRgbColorBundles(listOfAColors);
    listOfBColors = convertListOfLabColorBundlesToRgbColorBundles(listOfBColors);

    let finalList = listOfAColors.concat(listOfBColors);
    let originalColor = new LabColorBundle(originalLabColor, 0);

    originalColor = convertLabColorBundleToRgbColorBundle(originalColor);
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
    return ('#' +
        convertDecimalNumberTo2DigitHexString(rgbColor.r) + 
        convertDecimalNumberTo2DigitHexString(rgbColor.g) + 
        convertDecimalNumberTo2DigitHexString(rgbColor.b)
    );
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
 * 
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


//For unrelated/non-similar colors
export function generateRandomListOfUnrelatedColors(numberOfColors){
    let colorsList = [];
    for (let i = 0; i < numberOfColors; ++i){    
        colorsList.push(generateRandomRgbColor());
    }
    return colorsList;
}

//Returns object of property 'color' with value: '#' followed by hex color code
export function generateRandomRgbColor(){
    let rgbString = '#';
    for (let i = 0; i < 3; ++i){
        rgbString += convertDecimalNumberTo2DigitHexString(generateRandomInteger(0,256));
    }
    return {color: rgbString};
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
