'use strict'


export function rgbToXyz(sR, sG, sB){
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

    return{
        x: X,
        y: Y, 
        z: Z
    }
}

export function xyzToLab(X, Y, Z){
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

    console.log(CIE_L + ' ' + CIE_a  + ' ' +  CIE_b);
}