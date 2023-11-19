/**
  @enum API hooks
*/
const CONTROLLER_HOOK = {
    PRE_HANDLER: 'preHandler',
    HANDLER: 'handler',
    ON_REQUEST: 'onRequest',
    ON_ERROR: 'onError',
    ON_RESPONSE: 'onResponse',
    ON_SEND: 'onSend',
    PRE_SERIALIZATION: 'preSerialization'
};

export { CONTROLLER_HOOK };
