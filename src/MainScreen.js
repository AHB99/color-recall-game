'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';

let testData;


export default class MainScreen extends React.Component{
    //For title
    static navigationOptions = {
        title: 'Main',
    }

    constructor(props){
        super(props);
    }

    _renderColorBox = ({item}) => {
        return (<ColorChoiceListItem color={item.rgbColor}/>);
    };


    render(){
        testData = generateListOfSimilarColors(generateRandomLabColor(), 6, 30);

        let rememberComponent = (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainText}>Remember this color!</Text>
            <Text style={styles.timerText}>3 seconds left</Text>
            <View style={styles.rectangle} />
        </SafeAreaView>);

        return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainText}>Find the color!</Text>
            <Text style={styles.timerText}>3 seconds left</Text>
            <FlatList 
                data={testData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderColorBox}
                style={{width: '80%', height: '50%', flexGrow: 0}}
            />
           
        </SafeAreaView>
        );

        
    }
}

/*
props: color
 */
class ColorChoiceListItem extends React.Component {

    _choicePressed = (param) => {
        //alert('pressed now: ' + param);
        
    }

    render(){
        return(
            //Using Dimensions because '%' unit seems to block scrolling
            <TouchableWithoutFeedback 
            onPress={this._choicePressed.bind(this,this.props.color)}
            disabled={false}>
                <View 
                style={
                    {height: (Dimensions.get('window').height*0.3), 
                    backgroundColor: this.props.color, 
                    borderRadius: 10, 
                    margin: 20}}
                />
            </TouchableWithoutFeedback>
        );
    }

}

class RgbColorBundle {
    constructor(rgbColor, deltaE){
        this.rgbColor = rgbColor;
        this.deltaE = deltaE;
    }

}

class LabColorBundle {
    constructor(labColor, deltaE){
        this.labColor = labColor;
        this.deltaE = deltaE;
    }
}

//---Free functions---

/*
Params: Original Lab color, Number of color choices, furthest deviation from correct color
Returns: Array of objects {rgbColor, deltaE}, where rgbColor is string
*/
function generateListOfSimilarColors(originalLabColor, numberOfColors, deltaLimit){
    //Final color from which we deviate

    let numOfColsInASide = numberOfColors/2;
    let numOfColsInBSide = numberOfColors/2;

    //If odd, randomly add extra to a or b
    if ((numberOfColors % 2) !== 0){
        (generateRandomInteger(0,2)===0) ? ++numOfColsInASide : ++numOfColsInBSide;
    }

    let listOfAColors = _getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, true, numOfColsInASide);
    let listOfBColors = _getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, false, numOfColsInBSide);

    listOfAColors = _convertListOfLabColorBundlesToRgbColorBundles(listOfAColors);
    listOfBColors = _convertListOfLabColorBundlesToRgbColorBundles(listOfBColors);

    let finalList = listOfAColors.concat(listOfBColors);
    let originalColor = new LabColorBundle(originalLabColor, 'goal');

    originalColor = _convertLabColorBundleToRgbColorBundle(originalColor);
    finalList.push(originalColor);
    return finalList;
}

function _convertListOfLabColorBundlesToRgbColorBundles(listOfLabColors) {
    return (listOfLabColors.map((color) => _convertLabColorBundleToRgbColorBundle(color)));
}

function _convertLabColorBundleToRgbColorBundle(colorBundle){
    let rgbValue = ColorConversionFunctions.labToRgb(
        colorBundle.labColor.L,
        colorBundle.labColor.a,
        colorBundle.labColor.b
    );
    let rgbString = ('#' +
        convertDecimalNumberTo2DigitHexString(rgbValue.r) + 
        convertDecimalNumberTo2DigitHexString(rgbValue.g) + 
        convertDecimalNumberTo2DigitHexString(rgbValue.b)
    );
    return new RgbColorBundle(rgbString, colorBundle.deltaE);
}

/*
Params: Original color, furthest deviation, boolean whether 'a' varies, numOfCols required
Returns: List of object {labColor, deltaE}
 */
function _getListOfSimilarLabColorBundlesPerABComp(originalLabColor, deltaLimit, isAVarying, numberOfColors) {
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
    if (forwardColorComponent > 128){
        choosingForward = false;
    }
    else if (backwardColorComponent < -128){
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



//Returns object with properties L=60, a, b.
function generateRandomLabColor(){
    return ({
        L: 60,
        a: generateRandomInteger(-128, 129),
        b: generateRandomInteger(-128, 129)
    });
}

//For unrelated/non-similar colors
function generateRandomListOfUnrelatedColors(numberOfColors){
    let colorsList = [];
    for (let i = 0; i < numberOfColors; ++i){    
        colorsList.push(generateRandomRgbColor());
    }
    return colorsList;
}

//Returns object of property 'color' with value: '#' followed by hex color code
function generateRandomRgbColor(){
    let rgbString = '#';
    for (let i = 0; i < 3; ++i){
        rgbString += convertDecimalNumberTo2DigitHexString(generateRandomInteger(0,256));
    }
    return {color: rgbString};
}

//Returns string
function convertDecimalNumberTo2DigitHexString(decNum){
    let hexVal = decNum.toString(16);
    if (hexVal.length == 1){
        hexVal = '0' + hexVal;
    }
    return hexVal;
}

//Returns random number between min (inclusive) max (exclusive)
function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
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
            backgroundColor: '#ff0000',
            borderRadius: 20,
            ...elem,
        },
        mainText: {
            fontFamily: 'serif',
            fontSize: 30,
            ...elem,
        },   
        timerText: {
            fontFamily: 'serif',
            fontSize: 20,
            ...elem,
        },

    }
)