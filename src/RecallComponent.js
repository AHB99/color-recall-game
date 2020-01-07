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
 * Component to display Recall screen for a given game round.
 * @class
 * 
 * @member {RgbColorBundle[]} props.currentListOfColors
 * @member {function({RgbColorBundle})} props.onColorChoiceSelected
 * @member {number} props.initialTime - Time delay to recall the color
 * @member {number} props.roundNumber
 * @member {function()} props.onTimeExpired - Callback when timer runs out
 * @member {number} state.timeLeft - Current remaining time 
 */
export default class RecallComponent extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            timeLeft: this.props.initialTime,
        }
    }

    componentDidMount(){
        this.timer = setInterval(this._advanceTime, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.roundNumberText}>Round {this.props.roundNumber}</Text>
                <Text style={styles.mainText}>Find the color!</Text>
                <Text style={styles.timerText}>{this.state.timeLeft} seconds left</Text>
                <FlatList 
                    data={this.props.currentListOfColors}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderColorBox}
                    style={styles.list}
                />
            </SafeAreaView>
        );
    }

    _advanceTime = () => {
        if (this.state.timeLeft <= 1){
            this.props.onTimeExpired();
            clearInterval(this.timer);
            return;
        }
        this.setState((state, props) => {
            return { timeLeft: (state.timeLeft - 1) }
        });
    }


    _renderColorBox = ({item}) => {
        return (<ColorChoiceListItem 
            rgbColorBundle={item}
            onColorChoiceSelected={this._colorChoiceSelected}/>);
    };

    _colorChoiceSelected = (rgbColorBundle) => {
        this.props.onColorChoiceSelected(rgbColorBundle);
    }


}

/**
 * Component for a single item in the list of color choices in Recall screen.
 * @class
 * @member {RgbColorBundle} props.rgbColorBundle
 * @member {function({RgbColorBundle})} onColorChoiceSelected
 */
class ColorChoiceListItem extends React.Component {

    render(){
        return(
            //Using Dimensions because '%' unit seems to block scrolling
            <TouchableWithoutFeedback 
            onPress={() => {this.props.onColorChoiceSelected(this.props.rgbColorBundle)}}
            disabled={false}>
                <View 
                style={
                    [styles.roundedElement, {height: (Dimensions.get('window').height*0.3), 
                    backgroundColor: this.props.rgbColorBundle.rgbColor}]}
                />
            </TouchableWithoutFeedback>
        );
    }

}

/**
 * Stylesheet
 */
let styles = StyleSheet.create({
    container: GameStyles.container,
    mainText: GameStyles.mainText,
    roundNumberText: GameStyles.roundNumberText,
    timerText: GameStyles.timerText,
    list: GameStyles.list,
    roundedElement : GameStyles.roundedElement,

});