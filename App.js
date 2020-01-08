'use strict'
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GameComponent from './src/GameComponent';
import HomeComponent from './src/HomeComponent';

const AppNavigator = createStackNavigator({
  Home: { screen: HomeComponent },
  Game: { screen: GameComponent},
});

export default createAppContainer(AppNavigator);
