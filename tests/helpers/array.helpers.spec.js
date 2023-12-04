import { expect } from 'chai';
import { getUniqueByKey, getUniqueBy } from '../../src/helpers/helpers.js';

describe('Array Helpers', () => {
    describe('getUniqueByKey', () => {
        it('should return array with unique objects based on key', () => {
            const inputArray = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 1, name: 'John' },
                { id: 3, name: 'Doe' },
            ];

            const result = getUniqueByKey(inputArray, 'id');
            expect(result).to.have.lengthOf(3);
            expect(result).to.deep.include({ id: 1, name: 'John' });
            expect(result).to.deep.include({ id: 2, name: 'Jane' });
            expect(result).to.deep.include({ id: 3, name: 'Doe' });
        });

        it('should return an empty array for an empty input array', () => {
            const inputArray = [];
            const result = getUniqueByKey(inputArray, 'id');
            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('getUniqueBy', () => {
        it('should return array with unique objects based on custom key function', () => {
            const inputArray = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 1, name: 'John' },
                { id: 3, name: 'Doe' },
            ];

            const getKey = (item) => item.id;
            const result = getUniqueBy(inputArray, getKey);
            expect(result).to.have.lengthOf(3);
            expect(result).to.deep.include({ id: 1, name: 'John' });
            expect(result).to.deep.include({ id: 2, name: 'Jane' });
            expect(result).to.deep.include({ id: 3, name: 'Doe' });
        });

        it('should return an empty array for an empty input array', () => {
            const inputArray = [];
            const getKey = (item) => item.id;
            const result = getUniqueBy(inputArray, getKey);
            expect(result).to.be.an('array').that.is.empty;
        });
    });
});
