/**
 * Start Express app on a random port and set VITE_API_URL so the API client (fetch) hits it.
 * Also polyfill localStorage so getAuthHeader() can read the token after login/signup.
 */
import http from 'http';
import { app } from '../../../server/app';

const storage: Record<string, string> = {};

(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => { storage[key] = value; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { for (const k of Object.keys(storage)) delete storage[k]; },
  get length() { return Object.keys(storage).length; },
  key: () => null,
};

const server = http.createServer(app);
await new Promise<void>((resolve) => server.listen(0, resolve));
const port = (server.address() as { port: number }).port;
process.env.VITE_API_URL = `http://localhost:${port}`;
