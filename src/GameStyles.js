'use strict'
import { StyleSheet } from 'react-native';

export const marginElement = {
    margin: 20
};

export const roundedElement = {
    ...marginElement,
    borderRadius: 10,
}

export const mainText = {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: 'bold',
    ...marginElement,
};

export const container = {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
};

export const rectangle = {
    width: '80%',
    height: '40%',
    ...roundedElement,
};

export const roundNumberText =  {
    ...mainText,
    fontWeight: 'normal',
};

export const rewardText =  {
    fontFamily: 'serif',
    fontSize: 25,
    ...marginElement,
};

export const timerText =  {
    fontFamily: 'serif',
    fontSize: 20,
    ...marginElement,
};

export const list = {
    width: '80%',
}

export const headerContainer = {
    ...container,
    flex: 0,
};

export const footerContainer = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
}

export const bodyContainer = {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
}

export const touchableButton = {
    padding: 10,
    margin: 20,
}

export const mainHomeTitle = {
    ...mainText,
    fontFamily: 'monospace',
    fontWeight: '800',
    fontSize: 60,
    letterSpacing: 15,
    textAlign: 'center',
}

//Colors
export const gameButtonColor = '#29ff84';


