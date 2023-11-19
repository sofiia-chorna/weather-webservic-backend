import { Server } from './Server.js';
import { router } from '../api/index.js';

// Singleton instance
const server = new Server({
    router: router,
});

export { server };
