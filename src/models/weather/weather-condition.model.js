import Joi from 'joi';

const weatherConditionSchema = Joi.object({
    main: Joi.string().valid(
        'Thunderstorm', 'Drizzle', 'Rain', 'Snow', 'Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado', 'Clear', 'Clouds'
    ).default('Clear'),
    description: Joi.string().default('No description available'),
});

export { weatherConditionSchema };
