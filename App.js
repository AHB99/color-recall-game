'use strict'
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GameComponent from './src/GameComponent';
import HomeComponent from './src/HomeComponent';
import GameModeComponent from './src/GameModeComponent';
import HighScoreComponent from './src/HighScoreComponent';


const AppNavigator = createStackNavigator({
  Home: { screen: HomeComponent },
  Game: { screen: GameComponent},
  GameMode: { screen: GameModeComponent},
  HighScore: {screen : HighScoreComponent},
});

export default createAppContainer(AppNavigator);
