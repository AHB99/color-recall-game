'use strict'
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


export default class MainScreen extends React.Component{
    static navigationOptions = {
        title: 'Main',
    }

    render(){
        return (
        <View>
            <Text>Hii World!</Text>
        </View>
        );
    }
}