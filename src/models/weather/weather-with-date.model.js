import Joi from 'joi';

import { weatherSchema } from './weather.model.js';

const weatherWithDateSchema = weatherSchema.keys({
    date: Joi.string().pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).default(null),
});

const weatherWithDateSchemaArray = Joi.array().items(weatherWithDateSchema).default([]);

export { weatherWithDateSchemaArray };
