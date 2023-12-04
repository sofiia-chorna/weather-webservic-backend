import { expect } from 'chai';
import { offsetStringToNumber } from '../../src/helpers/helpers.js';

describe('Offset Helpers', () => {
    describe('offsetStringToNumber', () => {
        it('should convert a valid offset string to a number', () => {
            const offsetString = '+05:30';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.equal(5.5);
        });

        it('should handle negative offset strings', () => {
            const offsetString = '-02:00';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.equal(-2);
        });

        it('should handle offset strings with only hours', () => {
            const offsetString = '+03:00';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.equal(3);
        });

        it('should handle zero offset string', () => {
            const offsetString = '+00:00';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.equal(0);
        });

        it('should handle offset strings with large values', () => {
            const offsetString = '+12:00';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.equal(12);
        });

        it('should return NaN for an invalid offset string', () => {
            const offsetString = 'invalid';
            const result = offsetStringToNumber(offsetString);
            expect(result).to.be.NaN;
        });
    });
});
