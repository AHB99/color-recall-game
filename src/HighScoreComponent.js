'use strict'
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableHighlight,
TouchableWithoutFeedback } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import RememberComponent from './RememberComponent'; 
import RewardComponent from './RewardComponent'; 
import RecallComponent from './RecallComponent'; 
import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';


/**
 * Component to display screen for high scores.
 * @class
 */
export default class HighScoreComponent extends React.Component{

    //For toolbar title
    static navigationOptions = {
        title: '',
    }

    constructor(props){
        super(props);
        this.state = {
            selectedGameMode: GameMode.ACCURACY,

        }
    }


    render(){
        return (
            <SafeAreaView style={styles.bodyContainer}>
                <Text style={styles.titleText}>High Scores</Text>
                <View style={styles.tabsContainer}>
                    <TabComponent text={'Accuracy'} tabSymbol={GameMode.ACCURACY} selectedSymbol={this.state.selectedGameMode}
                    onTabPressed={this._onGameModeTabSelected}></TabComponent>
                    <TabComponent text={'Speed'} tabSymbol={GameMode.SPEED} selectedSymbol={this.state.selectedGameMode}
                    onTabPressed={this._onGameModeTabSelected}></TabComponent>
                </View>
            </SafeAreaView>
        );
    }

    _onGameModeTabSelected = (gameMode) => {
        this.setState({selectedGameMode: gameMode});
    }
}

/**
 * Component that represents a tab
 * @member {string} props.text
 * @member {Symbol} props.tabSymbol - Symbol the tab represents
 * @member {Symbol} props.selectedSymbol - Symbol that has been selected
 * @member {function(Symbol)} props.onTabPressed
 */
class TabComponent extends React.Component {
    render(){
        let tabColor = (this.props.tabSymbol === this.props.selectedSymbol) ? selectedTabColor : deselectedTabColor;
        return (
            <TouchableWithoutFeedback onPress={() => {this.props.onTabPressed(this.props.tabSymbol)}}>
                <View style={[styles.tabBoxStyle, {backgroundColor: tabColor}]}>
                    <Text style={styles.tabTextStyle}>{this.props.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const selectedTabColor = '#2196F3';
const deselectedTabColor = '#C8E5FC';

let styles = StyleSheet.create({
    bodyContainer: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        fontFamily: 'serif',
        fontSize: 50,
        textAlign: 'center',
        margin: 20,
    },
    tabsContainer: {
        ...GameStyles.footerContainer,
    },
    tabBoxStyle: {
        padding: 12,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    tabTextStyle: {
        fontSize: 20,
        fontFamily: 'monospace',
        color: 'white',
        fontWeight: 'bold'
    }

});