import { registerServiceWorker } from './pwa/registerSw.js';
import { lockGestures } from './pwa/lockGestures.js';
import { startApp } from './app.js';

lockGestures();
registerServiceWorker();
startApp();
