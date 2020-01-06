'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';
import * as ColorGenerationFunctions from './ColorGenerationFunctions';

let testData;

/**
 * Component displaying the screen for one full game.
 * @class
 * 
 * @static {{Symbol}} GameMode
 * 
 * @member {GameMode} state.gameMode - Current game mode to display
 * @member {RgbColorBundle[]} state.currentListOfColors - List of color choices for Recall screen
 * @member {{L: number, a: number, b: number}} state.currentLabColor
 */
export default class MainScreen extends React.Component {
    //For title
    static navigationOptions = {
        title: 'Main',
    }

    /**
     * Enum of 3 Game Mode types, representing 3 different screens.
     * @enum
     */
    static GameMode = Object.freeze({
        REMEMBER: Symbol("remember"),
        RECALL: Symbol("recall"),
        REWARD: Symbol("reward"),
    });

    constructor(props){
        super(props);

        this.state = {
            gameMode: MainScreen.GameMode.REMEMBER,
            currentLabColor: ColorGenerationFunctions.generateRandomLabColor(),
            didWinRound: false,            
        }
        this.state.currentListOfColors = 
        ColorGenerationFunctions.generateListOfSimilarColors(this.state.currentLabColor, 4, 40);

    }

    render(){
        if (this.state.gameMode === MainScreen.GameMode.REMEMBER){
            let currentRgbString = ColorGenerationFunctions.convertLabColorToRgbString(this.state.currentLabColor);
            return <RememberComponent 
            color={currentRgbString} 
            initialTime={5}
            onTimeExpired={this._onRememberTimeExpired}/>
        }
        else if (this.state.gameMode === MainScreen.GameMode.RECALL) {
            return <RecallComponent 
            currentListOfColors={this.state.currentListOfColors}
            onColorChoiceSelected={this._onColorChoiceSelectedInRecall}/>;
        }       
    }

    _onColorChoiceSelectedInRecall = (rgbColorBundle) => {
        alert(rgbColorBundle.deltaE);
    }

    _onRememberTimeExpired = () => {
        alert('remember time over');
    }
}


/**
 * Component to display Remember screen for a given game round.
 * @class
 * @member {string} props.color - The RGB string in format '#xxxxxx' to remember
 * @member {number} props.initialTime - Time delay to remember the color
 * @member {function()} props.onTimeExpired - Callback when timer runs out
 */
class RememberComponent extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            timeLeft: this.props.initialTime,
        }
    }

    componentDidMount(){
        this.timer = setInterval(this._advanceTime, 1000);
        console.log('mounted');
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    _advanceTime = () => {
        if (this.state.timeLeft <= 1){
            clearInterval(this.timer);
            this.props.onTimeExpired();
        }
        this.setState((state, props) => {
            return { timeLeft: (state.timeLeft - 1) }
        });
        console.log('tick ' + this.state.timeLeft);

    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Remember this color!</Text>
                <Text style={styles.timerText}>{this.state.timeLeft} seconds left</Text>
                <View style={[styles.rectangle, {backgroundColor: this.props.color}]} />
            </View>
        );
    }
}


/**
 * Component to display Recall screen for a given game round.
 * @class
 * @member {RgbColorBundle[]} props.currentListOfColors
 * @member {function({RgbColorBundle})} onColorChoiceSelected
 */
class RecallComponent extends React.Component {
    _renderColorBox = ({item}) => {
        return (<ColorChoiceListItem 
            rgbColorBundle={item}
            onColorChoiceSelected={this._colorChoiceSelected}/>);
    };

    _colorChoiceSelected = (rgbColorBundle) => {
        this.props.onColorChoiceSelected(rgbColorBundle);
    }


    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Find the color!</Text>
                <Text style={styles.timerText}>3 seconds left</Text>
                <FlatList 
                    data={this.props.currentListOfColors}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderColorBox}
                    style={styles.list}
                />
            </View>
        );
    }
}


/**
 * Component for a single item in the list of color choices in Recall screen.
 * @class
 * @member {RgbColorBundle} props.rgbColorBundle
 * @member {function({RgbColorBundle})} onColorChoiceSelected
 */
class ColorChoiceListItem extends React.Component {

    // _choicePressed = (param) => {
    //     alert('pressed now: ' + JSON.stringify(param));    
    // }

    render(){
        return(
            //Using Dimensions because '%' unit seems to block scrolling
            <TouchableWithoutFeedback 
            onPress={() => {this.props.onColorChoiceSelected(this.props.rgbColorBundle)}}
            disabled={false}>
                <View 
                style={
                    {height: (Dimensions.get('window').height*0.3), 
                    backgroundColor: this.props.rgbColorBundle.rgbColor, 
                    borderRadius: 10, 
                    margin: 20}}
                />
            </TouchableWithoutFeedback>
        );
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
        list: {
            width: '80%', 
            height: '50%', 
            flexGrow: 0
        },

    }
)