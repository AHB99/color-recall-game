'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';

let testData = [{color: 'blue'}, {color: 'green'}, {color: 'yellow'}, {color: 'black'},
                {color: 'blue'}, {color: 'green'}, {color: 'yellow'}, {color: 'black'}];


export default class MainScreen extends React.Component{
    static navigationOptions = {
        title: 'Main',
    }

    //temp for demo
    _renderColorBox = ({item}) => {
        return (
        <View style={{height: 200, backgroundColor: item.color, borderRadius: 10, margin: 20}}/>);
    };


    render(){
        let rememberComponent = (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainText}>Remember this color!</Text>
            <Text style={styles.timerText}>3 seconds left</Text>
            <View style={styles.rectangle} />
        </SafeAreaView>);

        return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainText}>Find the color!</Text>
            <Text style={styles.timerText}>3 seconds left</Text>
            <FlatList 
                data={testData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderColorBox}
                style={{width: '80%', height: '50%', flexGrow: 0}}
            />
           
        </SafeAreaView>
        );
    }
}

///Styles---------------

const elem = {
    margin: 20
}

let styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
        },
        rectangle: {
            width: '80%',
            height: '40%',
            backgroundColor: '#ff0000',
            borderRadius: 20,
            ...elem,
        },
        mainText: {
            fontFamily: 'serif',
            fontSize: 30,
            ...elem,
        },   
        timerText: {
            fontFamily: 'serif',
            fontSize: 20,
            ...elem,
        },

    }
)