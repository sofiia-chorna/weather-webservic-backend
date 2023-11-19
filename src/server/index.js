import { Server } from './Server.js';
import { api } from '../api/index.js';

// Singleton instance
const server = new Server({
    api: api,
});

export { server };
