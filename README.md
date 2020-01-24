# Color Recall 

<p align="center"> <img align="center" width=100 src=https://github.com/AHB99/color-recall-game/blob/master/screenshots/app_icon.png></p>

A React Native app where players must remember colors to win. Developed in Javascript with the React Native framework.

## Table of Contents
* [Introduction](#introduction)
* [Technologies Used](#technologies-used)
* [Installation and Setup](#installation-and-setup)
* [Game Overview](#game-overview)
* [License](#license)



## Introduction

*Color Recall* is a mobile game where players are presented with a random color, which they must then recall from a list of different colors. There are 2 unique game modes that players can choose from, and infinite levels of difficulty. As the game progresses, players can unlock higher levels of difficulty for each game mode. 

<p align="center"> <img align="center" height=500 src=https://github.com/AHB99/color-recall-game/blob/master/screenshots/video_of_gameplay.gif></p>

The app was fully coded in Javascript and developed using the React Native framework, and is hence cross-platform. Currently it is released for Android, with future plans for an iOS release.

## Technologies Used
* Javascript and JSX languages
* [React Native](https://facebook.github.io/react-native/) v0.61.5
* [React Navigation](https://reactnavigation.org/) v4.0.10
* [React Native Async Storage](https://github.com/react-native-community/async-storage) v1.7.1

## Installation and Setup

### App Download
For Android, simply download and install the APK file found with the latest version of the app on the Releases page of this repo. Requires Android 4.1+. Your phone may request certain confirmations during installation as the APK is not from the Google Play Store.

### Code Setup
Alternatively, if you want the entire project code to use and build:

* Clone the repo with `git clone https://github.com/AHB99/color-recall-game.git`
* Navigate to the project folder
* Install the node modules with `npm install`

The app is now ready to run. On Android for example, run your emulator/connect your phone and run `npx react-native run-android` in the project folder.

## Game Overview

In *Color Recall*, the player progresses through several rounds of gameplay where they are presented with a random color for a period of time, following which it is hidden amongst a list of other colors. The player must use their memory skills and find the color to win points. 

<p align="center">
  <img src="https://github.com/AHB99/color-recall-game/blob/master/screenshots/remember_screen.jpg" height="500" />
  <img src="https://github.com/AHB99/color-recall-game/blob/master/screenshots/speed_gameplay.jpg" height="500" />
  <img src="https://github.com/AHB99/color-recall-game/blob/master/screenshots/accuracy_gameplay.jpg" height="500" />
</p>

Currently, the app possesses the following features:

### Game Modes
There are 2 unique game modes that drastically change the way the game can be played.

<p align="center"> <img align="center" height=500 src=https://github.com/AHB99/color-recall-game/blob/master/screenshots/game_modes.jpg></p>

#### Accuracy Mode
In *Accuracy Mode*, the player must find the random color amongst a list of similar colors. These colors are mathematically calculated to be "close" to the original color, using the [CIE76 formula](https://en.wikipedia.org/wiki/Color_difference#CIE76).

The player's score is proportional to this mathematical distance from the original color, so even incorrect answers score points if they are "close enough".

#### Speed Mode
In *Speed Mode*, the player must find the random color as fast as possible. Here, the list of colors is completely random, as time is the only priority for the player.

The player's score is inversely proportional to the time they took to find the correct color. Only the correct color scores points.

### Progressive Difficulty

<p align="center"> <img align="center" height=500 src=https://github.com/AHB99/color-recall-game/blob/master/screenshots/difficulty_screen.jpg></p>

As the player progresses through *Color Recall*, they can unlock higher levels of difficulty for each game mode. This is done by achieving a game score of 50% or more in the highest difficulty level of a given mode. As the difficulty increases by a level, the list of colors to search becomes larger, making the game ever more challenging. There is no limit to how far the player can progress.

### High Scores

<p align="center"> <img align="center" height=500 src=https://github.com/AHB99/color-recall-game/blob/master/screenshots/highscore_screen.jpg></p>

The app tracks the Top 10 high scores achieved by the player in a game for each game mode, and each difficulty level within these modes. This allows the player to monitor their progress through *Color Recall*.

## License
MIT © Azadan Bhagwagar
