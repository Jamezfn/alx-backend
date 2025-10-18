// connect-redis-v4.js
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('connected (connect event)'));
client.on('ready', () => console.log('ready to use'));

await client.connect(); // top-level await or inside async fn

// example use
await client.set('key', 'value');
const v = await client.get('key');
console.log(v);

await client.quit();

