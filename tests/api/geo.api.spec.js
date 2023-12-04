import { expect } from 'chai';
import createServer from 'fastify';
import { mapApi } from '../../src/api/map.api.js';

describe('Map API', () => {
    let fastify;

    beforeEach(async () => {
        fastify = createServer();
        fastify.register(mapApi);
        await fastify.ready();
    });

    afterEach(() => fastify.close());

    describe('Get Address from Longitude and Latitude', () => {
        it('should respond with address details - 200', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/address?lon=-94.04&lat=33.44',
            });
            expect(response.statusCode).to.equal(200);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('country');
            expect(responseBody).to.have.property('state');
            expect(responseBody).to.have.property('formatted');
            expect(responseBody).to.have.property('city');
            expect(responseBody).to.have.property('lon');
            expect(responseBody).to.have.property('lat');
        });

        it('should respond with address details for Paris, France - 200', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/address?lon=2.3483915&lat=48.8534951',
            });
            expect(response.statusCode).to.equal(200);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('country').to.equal('France');
            expect(responseBody).to.have.property('lon').to.equal(2.3200410217200766);
            expect(responseBody).to.have.property('lat').to.equal(48.8588897);
            expect(responseBody).to.have.property('city').to.equal('Paris');
            expect(responseBody).to.have.property('state').to.equal('Ile-de-France');
            expect(responseBody).to.have.property('formatted').to.equal('France, Ile-de-France, Paris');
            expect(responseBody).to.have.property('timezone_offset').to.equal(1);
        });

        it('should respond with 400 error if lon is missing - 400', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/address?lat=48.8534951',
            });
            expect(response.statusCode).to.equal(400);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('statusCode').to.equal(400);
            expect(responseBody).to.have.property('message').to.equal('Missing parameter(s): lon');
        });

        it('should respond with 400 error if lat is missing - 400', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/address?lon=2.3483915',
            });
            expect(response.statusCode).to.equal(400);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('statusCode').to.equal(400);
            expect(responseBody).to.have.property('message').to.equal('Missing parameter(s): lat');
        });
    });

    describe('Get Address Prediction from User Input', () => {
        it('should respond with address predictions - 200', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/autocomplete?text=sample-input',
            });
            expect(response.statusCode).to.equal(200);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.be.an('array');
        });

        it('should respond with 400 error if text is missing', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/autocomplete',
            });
            expect(response.statusCode).to.equal(400);
        });
    });
});
