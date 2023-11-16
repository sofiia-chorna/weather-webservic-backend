import { DATA_TYPE } from '../common/data/data-type.enum.js';
import { collection } from '../services/services.js';
import { Server } from './Server.js';
import { api } from '../api/index.js';

/*
  Handlers map
 */
// const services = new Map([
//     [DATA_TYPE.COLLECTION, collection],
// ]);

// Singleton instance
const server = new Server({
    // services: services,
    api: api,
});

export { server };
