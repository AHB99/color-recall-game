'use strict'
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './src/MainScreen'

const AppNavigator = createStackNavigator({
  Home: { screen: MainScreen },
});

export default createAppContainer(AppNavigator);
