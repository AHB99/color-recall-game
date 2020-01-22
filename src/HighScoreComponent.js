'use strict'
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TouchableHighlight,
TouchableWithoutFeedback, SectionList } from 'react-native';

import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import { MainGameConstants, RgbColorBundle, GameMode } from './GameUtils';
import * as GameUtils from './GameUtils';
import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';

//DEBUGGING
const testData = [{title: 1, data: [76, 54, 20]}];

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
                <View style={styles.listTableHeaderContainer}>
                    <View style={styles.listItemCellContainer}>
                        <Text style={styles.listTableHeaderTextStyle}>Rank</Text>
                    </View>
                    <View style={styles.listItemCellContainer}>
                        <Text style={styles.listTableHeaderTextStyle}>Score</Text>
                    </View>
                </View>
                <View style={styles.listContainer}>
                    <SectionList 
                    sections={testData}
                    keyExtractor={(item, index) => index}
                    renderItem={this._renderHighScoreItem}
                    renderSectionHeader={this._renderHighScoreDifficultyHeader}/>
                </View>
            </SafeAreaView>
        );
    }

    _onGameModeTabSelected = (gameMode) => {
        this.setState({selectedGameMode: gameMode});
    }

    _renderHighScoreItem = ({item, index}) => {
        return (<HighScoreItemComponent rank={index+1} score={item}/>);
    }

    _renderHighScoreDifficultyHeader = ({ section: { title } }) => {
        return (
            <View style={styles.listSectionHeaderContainer}>
                <Text style={styles.listSectionHeaderTextStyle}>Difficulty {title}</Text>
            </View>
        );
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

/**
 * Component representing a single high scores row.
 * @function
 * 
 * @param {number} props.rank
 * @param {number} props.score
 */
function HighScoreItemComponent(props){
    return (
        <View style={styles.listItemContainer}>
            <View style={styles.listItemCellContainer}>
                <Text style={styles.listItemCellTextStyle}>#{props.rank}</Text>
            </View>
            <View style={styles.listItemCellContainer}>
                <Text style={styles.listItemCellTextStyle}>{props.score}%</Text>
            </View>
        </View>
    );
}



//Styles
const selectedTabColor = '#2196F3';
const deselectedTabColor = '#C8E5FC';

const listItemCellTextStyle = {
    fontSize: 25,
    fontFamily: 'serif',
    textAlign: 'center',
}

const listItemContainer = {
    flexDirection: 'row',
    alignSelf: 'stretch',
}


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
        margin: 25,
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
    },
    listContainer: {
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1,
    },
    listItemContainer: listItemContainer,
    listItemCellContainer: {
        flex: 1,
        alignSelf: 'stretch',
        padding: 5,
    },
    listItemCellTextStyle: listItemCellTextStyle,
    listTableHeaderContainer: {
        ...listItemContainer,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,

    },
    listTableHeaderTextStyle: {
        ...listItemCellTextStyle,
        fontWeight: 'bold',
    },
    listSectionHeaderContainer: {
        alignSelf: 'stretch',
        backgroundColor: '#FAFAFA',
    },
    listSectionHeaderTextStyle: {
        fontSize: 25,
        fontFamily: 'sans-serif-thin',
        textAlign: 'center',
        fontWeight: '600'
    },

});