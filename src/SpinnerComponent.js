'use strict'
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button,
        FlatList, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';

import * as GameStyles from './GameStyles';
import ButtonComponent from './ButtonComponent';


/**
 * Component that displays a +/- spinner
 * @class
 * 
 * @member {{min: number, max: number}} props.range- Range of accepted values, min max inclusive.
 * @member {function(number)} props.onValueChanged
 * @member {number} state.value
 */
export default class SpinnerComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            value : this.props.range.max,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <MinusPlusButtonComponent symbol={'-'} 
                isActive={this.state.value !== this.props.range.min}
                onPress={this._onMinusPressed}/>
                <Text style={styles.spinnerTextStyle}>{this.state.value}</Text>
                <MinusPlusButtonComponent symbol={'+'} 
                isActive={this.state.value !== this.props.range.max}
                onPress={this._onPlusPressed}/>
            </View>
        );
    }

    _onMinusPressed = () => {
        this.setState((state, props) => {
            if (state.value > props.range.min){
                let newValue = state.value - 1;
                this.props.onValueChanged(newValue);
                return ({value: newValue});
            }
        });
    }

    _onPlusPressed = () => {
        this.setState((state, props) => {
            if (state.value < props.range.max){
                let newValue = state.value + 1;
                this.props.onValueChanged(newValue);
                return ({value: newValue});
            }
        });
    }
}

/**
 * Component that provides buttons for +/- symbols for Spinner Component
 * @function
 * 
 * @param {string} props.symbol - Whether '+' or '-'
 * @param {function()} props.onPress
 * @param {boolean} props.isActive - Whether to enable/disable button
 */
function MinusPlusButtonComponent(props){
    let bgColor = props.isActive ? '#2196F3' : '#ACD8FA';
    return (
        <TouchableHighlight style={[styles.spinnerButtonContainer, {backgroundColor: bgColor}]} onPress={props.onPress}>
                <Text style={styles.spinnerButtonTextStyle}>
                    {props.symbol}
                </Text>
        </TouchableHighlight>
    );
}

//Styles
let styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0,
    },
    spinnerTextStyle: {
        fontSize: 55,
        color: 'white',
    },
    spinnerButtonContainer: {
        borderRadius: 10,
        margin: 20,
        width: 50,
    },
    spinnerButtonTextStyle: {
        fontSize: 40,
        textAlign: 'center',
    }
});