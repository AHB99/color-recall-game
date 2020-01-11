'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ColorConversionFunctions from './ColorConversionFunctions';
import * as ColorGenerationFunctions from './ColorGenerationFunctions';
import * as GameStyles from './GameStyles';
import ButtonComponent  from './ButtonComponent';


/**
 * Component to display Home screen for app.
 */
export default class HomeComponent extends React.Component {
    //For toolbar title
    static navigationOptions = {
        title: '',
    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.mainTitle}>COLOR RECALL</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <HomeButtonComponent text={'Start Game'} onPress={this._onStartGamePressed}/>
                    <HomeButtonComponent text={'Github Link'} onPress={this._onGithubLinkPressed}/>

                </View>
            </SafeAreaView>
        );
    }
    
    _onStartGamePressed = () => {
        this.props.navigation.navigate('GameMode');
    };

    _onGithubLinkPressed = () => {
        Linking.openURL('https://github.com/AHB99').catch((err) => console.error('An error occurred', err));
    }
}

/**
 * Component that specializes ButtonComponent for the Home menu
 * @function
 * 
 * @param {string} props.text - Display text
 * @param {function()} props.onPress - Callback for button press
 */
function HomeButtonComponent(props){
    return (
        <ButtonComponent 
            text={props.text}
            onPress={props.onPress}
            backgroundColor={GameStyles.gameButtonColor}
            fontSize={25}
            borderRadius={25}/>
    );
}

let styles = StyleSheet.create({
    mainTitle : GameStyles.mainHomeTitle,
    container: GameStyles.container,
    headerContainer: GameStyles.headerContainer,
    bodyContainer: GameStyles.bodyContainer,
    footerContainer: GameStyles.footerContainer,
});