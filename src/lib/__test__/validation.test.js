const { isArray, isNumber } = require('../validation');

describe('validation functions', () => {
    test('passes values to isArray function', () => {
        const array = [ 1, 2 , 3 ];
        expect(isArray(array)).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(3)).toBe(false);
        expect(isArray([])).toBe(true);
    });

    test('passes values to isNumber function', () => {
        const array = [ 1, 2 , 3 ];
        expect(isNumber(array)).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber(3)).toBe(true);
        expect(isNumber(3.54)).toBe(true);
        expect(isNumber(false)).toBe(false);
    });
});
