'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';

let testData = [{color: 'blue'}, {color: 'green'}, {color: 'yellow'}, {color: 'black'},
                {color: 'blue'}, {color: 'green'}, {color: 'yellow'}, {color: 'black'}];

export default class MainScreen extends React.Component{
    //For title
    static navigationOptions = {
        title: 'Main',
    }

    constructor(props){
        super(props);
    }

    _renderColorBox = ({item}) => {
        return (<ColorChoiceListItem color={item.color}/>);
    };


    render(){
        testData = generateRandomListOfColors(5);
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

//---Free functions---

//For unrelated/non-similar colors
function generateRandomListOfColors(numberOfColors){
    let colorsList = [];
    for (let i = 0; i < numberOfColors; ++i){    
        colorsList.push(generateRandomColor());
    }
    return colorsList;
}

//Returns object of property 'color' with value: '#' followed by hex color code
function generateRandomColor(){
    let rgbString = ('#' 
    + generateRandom2DigitHex()
    + generateRandom2DigitHex()
    + generateRandom2DigitHex());
    return {color: rgbString};
}

function generateRandom2DigitHex(){
    let ranHex = generateRandomInteger(0,256).toString(16);
    if (ranHex.length == 1){
        ranHex = '0' + ranHex;
    }
    return ranHex;
}

//Max not included
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