/* jshint esversion:6 */
const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString -> utils/validation.js', () => {
    it('should reject non-string values', () => {
        var number = 25;
        
        expect(isRealString(number)).toBeFalsy();
    });

    it('should reject only-spaces string values', () => {
        var string = '    ';
        
        expect(isRealString(string)).toBeFalsy();
    });

    it('should pass string values with non-space characters', () => {
        var string = 'jhon';

        expect(isRealString(string)).toBeTruthy();
    });
});