import Joi from 'joi';
import { weatherConditionSchema } from './weather-condition.model.js';

const weatherSchema = Joi.object({
    coord: Joi.object({
        lon: Joi.number().required(),
        lat: Joi.number().required(),
    }).required(),
    weather: Joi.array().items(weatherConditionSchema).default([]),
    temp: Joi.number().default(null),
    temp_min: Joi.number().default(null),
    temp_max: Joi.number().default(null),
    pressure: Joi.number().default(null),
    humidity: Joi.number().default(0),
    visibility: Joi.number().default(0),
    wind_speed: Joi.number().default(0),
    clouds: Joi.number().default(0),
    uvi: Joi.number().default(null),
    sunrise: Joi.number().default(null),
    sunset: Joi.number().default(null),
    feels_like: Joi.number().default(null),
    precipitation: Joi.number().default(0),
});

const weatherSchemaArray = Joi.array().items(weatherSchema).default([]);

export { weatherSchema, weatherSchemaArray };
