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
 * Component to create custom button
 * @class
 * 
 * @member {string} props.text
 * @member {string} props.textColor - Button's text color. Default: 'white'
 * @member {string} props.backgroundColor - Button's background color. Default: '#2196F3'
 * @member {number} props.fontSize - Button's text font size. Default: 20
 * @member {number} props.borderRadius - Button's rounded edge radius. Default: 2
 * @member {function()} props.onPress
 */
export default class ButtonComponent extends React.Component{
    render(){
        return (
            <TouchableHighlight 
            style={[buttonStylesheet.touchableButton, 
                {backgroundColor: this.props.backgroundColor,
                borderRadius: this.props.borderRadius}]} 
            onPress={this.props.onPress}>
                <Text 
                style={{color: this.props.textColor, fontSize: this.props.fontSize}}>
                    {this.props.text}
                </Text>
            </TouchableHighlight>
        );
    }
}

ButtonComponent.defaultProps = {
    textColor: 'white',
    backgroundColor: '#2196F3',
    fontSize: 20,
    borderRadius: 6,
}

/**
 * Stylesheet for ButtonComponent
 */
let buttonStylesheet = StyleSheet.create({
    touchableButton: GameStyles.touchableButton, 
    touchableButtonText: GameStyles.touchableButtonText 
});