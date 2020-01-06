import * as ColorGenerationFunctions from '../src/ColorGenerationFunctions';
import renderer from 'react-test-renderer';

test('checks 5 decimal to equal 05 hex', () => {
    expect(ColorGenerationFunctions.convertDecimalNumberTo2DigitHexString(5)).toBe('05');
})