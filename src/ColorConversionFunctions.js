'use strict'

export function rgbToLab(r, g, b){
    let xyzResult = rgbToXyz(r, g, b);
    return xyzToLab(xyzResult.x, xyzResult.y, xyzResult.z);
}

export function labToRgb(L, a, b){
    let xyzResult = labToXyz(L, a, b);
    return xyzToRgb(xyzResult.x, xyzResult.y, xyzResult.z);
}


/**
 * Uses CIE76 formula to calculate deltaE between 2 Lab colors.
 * 
 * @param {{L: number, a: number, b: number}} labColor1 
 * @param {{L: number, a: number, b: number}} labColor2 
 * @return {number}
 */
export function deltaE(labColor1, labColor2){
    return Math.sqrt(
        Math.pow(labColor1.L-labColor2.L, 2) +
        Math.pow(labColor1.a-labColor2.a, 2) +
        Math.pow(labColor1.b-labColor2.b, 2)
    );
}

function rgbToXyz(sR, sG, sB){
    //Adapted from http://www.easyrgb.com/en/math.php
    let var_R = ( sR / 255 );
    let var_G = ( sG / 255 );
    let var_B = ( sB / 255 );

    if ( var_R > 0.04045 ) {
        var_R = (( var_R + 0.055) / 1.055) ** 2.4;
    }
    else{
        var_R = var_R / 12.92;
    }                   

    if ( var_G > 0.04045 ) {
        var_G = ( ( var_G + 0.055 ) / 1.055 ) ** 2.4;
    }
    else{
        var_G = var_G / 12.92;
    }                   
    if ( var_B > 0.04045 ) {
        var_B = ( ( var_B + 0.055 ) / 1.055 ) ** 2.4;
    }
    else {
        var_B = var_B / 12.92;
    }

    var_R = var_R * 100;
    var_G = var_G * 100;
    var_B = var_B * 100;

    let X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
    let Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
    let Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

    return ({
        x: X,
        y: Y, 
        z: Z
    });
}

function xyzToLab(X, Y, Z){
    //Adapted from http://www.easyrgb.com/en/math.php
    let var_X = X / 95.047;
    let var_Y = Y / 100;
    let var_Z = Z / 108.883;
    
    if ( var_X > 0.008856 ) {
        var_X = var_X ** ( 1/3 );
    }
    else {
        var_X = ( 7.787 * var_X ) + ( 16 / 116 );
    }

    if ( var_Y > 0.008856 ) {
        var_Y = var_Y ** ( 1/3 );
    }
    else {
        var_Y = ( 7.787 * var_Y ) + ( 16 / 116 );
    }

    if ( var_Z > 0.008856 ) {
        var_Z = var_Z ** ( 1/3 );
    }
    else {
        var_Z = ( 7.787 * var_Z ) + ( 16 / 116 );
    }
    
    let CIE_L = ( 116 * var_Y ) - 16;
    let CIE_a = 500 * ( var_X - var_Y );
    let CIE_b = 200 * ( var_Y - var_Z );

    return ({
        L: CIE_L,
        a: CIE_a, 
        b: CIE_b
    });
}

function labToXyz(L, a, b){
    //Adapted from http://www.easyrgb.com/en/math.php

    let var_Y = ( L + 16 ) / 116;
    let var_X = a / 500 + var_Y;
    let var_Z = var_Y - b / 200;

    if ( (var_X ** 3)  > 0.008856 ){
        var_X = var_X ** 3;
    }
    else {
        var_X = ( var_X - 16 / 116 ) / 7.787;
    }

    if ( (var_Y**3)  > 0.008856 ) {
        var_Y = var_Y ** 3;
    }
    else {
        var_Y = ( var_Y - 16 / 116 ) / 7.787;
    }

    if ( (var_Z ** 3)  > 0.008856 ) {
        var_Z = var_Z ** 3;
    }
    else { 
        var_Z = ( var_Z - 16 / 116 ) / 7.787;
    }

    let X = var_X * 95.047;
    let Y = var_Y * 100;
    let Z = var_Z * 108.883;

    return ({
        x: X,
        y: Y, 
        z: Z
    });
}

function xyzToRgb(X, Y, Z){
    //Adapted from http://www.easyrgb.com/en/math.php

    let var_X = X / 100;
    let var_Y = Y / 100;
    let var_Z = Z / 100;

    let var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
    let var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415;
    let var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570;

    if ( var_R > 0.0031308 ){
        var_R = 1.055 * ( var_R ** ( 1 / 2.4 ) ) - 0.055;
    }
    else {
        var_R = 12.92 * var_R;
    }

    if ( var_G > 0.0031308 ){
        var_G = 1.055 * ( var_G ** ( 1 / 2.4 ) ) - 0.055;
    }
    else{
        var_G = 12.92 * var_G;
    }

    if ( var_B > 0.0031308 ) {
        var_B = 1.055 * ( var_B ** ( 1 / 2.4 ) ) - 0.055;
    }
    else {
        var_B = 12.92 * var_B;
    }

    let sR = var_R * 255;
    let sG = var_G * 255;
    let sB = var_B * 255;

    sR = keepRgbInRange(sR);
    sG = keepRgbInRange(sG);
    sB = keepRgbInRange(sB);


    return ({
        r: sR,
        g: sG, 
        b: sB
    });
}

function keepRgbInRange(component){
    component = Math.round(component);
    if (component < 0){
        return 0;
    }
    else if (component > 255){
        return 255;
    }
    return component;
}

