import { expect } from 'chai';
import { isDate, isTimestamp, formatDate, dateToTimestampInSeconds } from '../../src/helpers/helpers.js';

describe('Date Helpers', () => {
    describe('isDate', () => {
        it('should return true for a valid Date object', () => {
            const result = isDate(new Date());
            expect(result).to.be.true;
        });

        it('should return false for a timestamp', () => {
            const result = isDate(1638301468);
            expect(result).to.be.false;
        });

        it('should return false for a non-Date object', () => {
            const result = isDate('2022-12-01');
            expect(result).to.be.false;
        });
    });

    describe('isTimestamp', () => {
        it('should return true for a valid timestamp', () => {
            const result = isTimestamp(1638301468);
            expect(result).to.be.true;
        });

        it('should return false for a Date object', () => {
            const result = isTimestamp(new Date());
            expect(result).to.be.false;
        });

        it('should return false for a non-number value', () => {
            const result = isTimestamp('2022-12-01');
            expect(result).to.be.false;
        });
    });

    describe('formatDate', () => {
        it('should format a Date object to "YYYY-MM-DD" format', () => {
            const date = new Date('2022-12-01');
            const result = formatDate(date);
            expect(result).to.equal('2022-12-01');
        });

        it('should format a timestamp to "YYYY-MM-DD" format', () => {
            const timestamp = 1638301468;
            const result = formatDate(timestamp);
            expect(result).to.equal('2021-11-30');
        });

        it('should return null for an invalid date value', () => {
            const result = formatDate('2022-12-01');
            expect(result).to.be.null;
        });
    });

    describe('dateToTimestampInSeconds', () => {
        it('should convert a valid Date object to timestamp in seconds', () => {
            const date = new Date('2022-12-01');
            const result = dateToTimestampInSeconds(date);
            expect(result).to.equal(1669852800); // Unix timestamp for 2022-12-01 00:00:00
        });

        it('should return null for an invalid date value', () => {
            const result = dateToTimestampInSeconds('2022-12-01');
            expect(result).to.be.null;
        });
    });
});
