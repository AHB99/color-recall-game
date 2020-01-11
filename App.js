'use strict'
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GameComponent from './src/GameComponent';
import HomeComponent from './src/HomeComponent';
import GameModeComponent from './src/GameModeComponent';

const AppNavigator = createStackNavigator({
  Home: { screen: HomeComponent },
  Game: { screen: GameComponent},
  GameMode: { screen: GameModeComponent},
});

export default createAppContainer(AppNavigator);
