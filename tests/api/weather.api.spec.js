import { expect } from 'chai';
import createServer from 'fastify';
import { weatherApi } from '../../src/api/weather.api.js';

describe('Weather API', () => {
    let fastify;

    beforeEach(async () => {
        fastify = createServer();
        fastify.register(weatherApi);
        await fastify.ready();
    });

    afterEach(() => fastify.close());

    describe('Current Forecast', () => {
        it('should respond with current forecast with temp_unit value - 200', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/current?lat=33.44&lon=-94.04&temp_unit=Fahrenheit',
            });

            expect(response.statusCode).to.equal(200);

            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('coord');
            expect(responseBody.coord).to.have.property('lon').to.equal(-94.04);
            expect(responseBody.coord).to.have.property('lat').to.equal(33.44);

            expect(responseBody).to.have.property('weather').to.be.an('array').to.have.lengthOf(1);
            expect(responseBody.weather[0]).to.have.property('main').to.equal('Clear');
            expect(responseBody.weather[0]).to.have.property('description').to.equal('clear sky');

            expect(responseBody).to.have.property('temp').to.be.a('number');
        });

        it('should respond with 400 error if request is not correct', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/current?lat=33.44&lon=-94.04&temp_unit=Fanheit',
            });
            expect(response.statusCode).to.equal(400);
        });
    });

    describe('Current Hourly Forecast', () => {
        it('should respond with current hourly forecast - 200', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/hourly?lat=33.44&lon=-94.04&date=2023-12-04',
            });
            expect(response.statusCode).to.equal(200);
        });

        it('should respond with 400 error if request is not correct', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/hourly?lat=33.44&lon=-94.04&date=invalid-date',
            });
            expect(response.statusCode).to.equal(400);
        });
    });

    describe('Forecast for Date Period', () => {
        it('should respond with 400 error if request has incorrect temp_unit - 400', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/current?lat=33.44&lon=-94.04&temp_unit=Fahre',
            });
            expect(response.statusCode).to.equal(400);
            const responseBody = JSON.parse(response.body);
            expect(responseBody).to.have.property('statusCode').to.equal(400);
            expect(responseBody).to.have.property('message').to.equal("Incorrect temp_unit: Fahre. Expected values: celsius, fahrenheit, kelvin");
        });
    });
});
