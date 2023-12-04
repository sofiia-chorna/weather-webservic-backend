import { expect } from 'chai';
import {
    checkMandatoryParams,
    checkDateParams,
    checkUnitParams,
    validateParams,
    validateAndTransformResponse,
} from '../../src/helpers/helpers.js';

describe('Helpers', () => {
    describe('checkMandatoryParams', () => {
        it('should return null if all mandatory params are present', () => {
            const params = { lat: '12.34', lon: '56.78' };
            const result = checkMandatoryParams(params, ['lat', 'lon']);
            expect(result).to.be.null;
        });

        it('should return error message if a mandatory param is missing', () => {
            const params = { lat: '12.34' };
            const result = checkMandatoryParams(params, ['lat', 'lon']);
            expect(result).to.equal('Missing parameter(s): lon');
        });
    });

    describe('checkDateParams', () => {
        it('should return null if all date params have correct format', () => {
            const params = { date: '2022-01-01' };
            const result = checkDateParams(params, ['date']);
            expect(result).to.be.null;
        });

        it('should return error message if a date param has incorrect format', () => {
            const params = { date: '01-01-2022' };
            const result = checkDateParams(params, ['date']);
            expect(result).to.equal('Incorrect date parameter(s): date. Expected format: YYYY-MM-DD');
        });
    });

    describe('checkUnitParams', () => {
        it('should return error message if temperature unit is incorrect', () => {
            const params = { temp_unit: 'fahre' };
            const result = checkUnitParams(params);
            expect(result).to.equal('Incorrect temp_unit: fahre. Expected values: celsius, fahrenheit, kelvin');
        });
    });

    describe('validateParams', () => {
        it('should return true if all validations pass', () => {
            const request = { query: { lat: '12.34', lon: '56.78' } };
            const reply = { code: () => ({ send: () => {} }) };
            const result = validateParams(request, reply, ['lat', 'lon'], []);
            expect(result).to.be.true;
        });

        it('should return false and send error response if validations fail', () => {
            const request = { query: { lat: '12.34' } };
            const reply = { code: (code) => ({ send: (response) => ({ code, response }) }) };
            const result = validateParams(request, reply, ['lat', 'lon'], []);
            expect(result).to.be.false;
        });
    });

    describe('validateAndTransformResponse', () => {
        it('should transform valid JSON response based on the schema', () => {
            const reply = { code: () => ({}) };
            const payload = '{"statusCode": 200, "message": "OK", "data": {"key": "value"}}';
            const schema = { validate: (data) => ({ value: data }) };
            const result = validateAndTransformResponse(reply, payload, schema);
            expect(result).to.equal('{"statusCode": 200, "message": "OK", "data": {"key": "value"}}');
        });

        it('should handle JSON parsing errors and send internal server error response', () => {
            const reply = { code: (code) => ({ send: (response) => ({ code, response }) }) };
            const payload = 'invalid-json';
            const schema = { validate: (data) => ({ value: data }) };
            const result = validateAndTransformResponse(reply, payload, schema);
            expect(result).to.equal('{"statusCode":500,"message":"Internal Server Error"}');
        });
    });
});
