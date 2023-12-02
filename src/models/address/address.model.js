import Joi from 'joi';

const addressSchema = Joi.object({
    country: Joi.string().default(null),
    state: Joi.string().default(null),
    city: Joi.string().default(null),
    formatted: Joi.string().default(''),
    lon: Joi.number().default(null),
    lat: Joi.number().default(null),
    timezone_offset: Joi.number().default(null),
});

const addressSchemaArray = Joi.array().items(addressSchema).default([]);

export { addressSchema, addressSchemaArray };
