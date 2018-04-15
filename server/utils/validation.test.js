const expect = require('expect');

const {isRealString} = require('./validation');




describe('isRealString', () => {
    it('should reject a string with a trim', () => {
        let trimOnlyText = '    ';
        let someValidText = '  some string ';

        expect(isRealString(trimOnlyText)).toBeFalsy();
        expect(isRealString(someValidText)).toBeTruthy();
    });

    it('should reject a non string type object', () => {
        let someValidText = 'some     other   string'
        let someNumber = 32;

        expect(isRealString(someNumber)).toBeFalsy();
        expect(isRealString(someValidText)).toBeTruthy();
    });
});
