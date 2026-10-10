import { get } from './client.js';

export const fetchVersion = () => get('/api/version');
