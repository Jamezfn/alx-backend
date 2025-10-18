// 4-redis_advanced_op.js (node-redis v4) — checks type and deletes non-hash key before hSet
import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

(async () => {
  try {
    await client.connect();

    // If ALX exists but is not a hash, delete it to avoid WRONGTYPE
    const type = await client.type('ALX'); // returns 'none' | 'string' | 'hash' | ...
    if (type && type !== 'none' && type !== 'hash') {
      console.log(`Key "ALX" exists as type "${type}", deleting it to create a hash`);
      await client.del('ALX');
    }

    // Create each field separately so we log per-field replies (1 = new field added)
    const r1 = await client.hSet('ALX', 'Portland', '50');    console.log('Reply: ' + r1);
    const r2 = await client.hSet('ALX', 'Seattle', '80');     console.log('Reply: ' + r2);
    const r3 = await client.hSet('ALX', 'New York', '20');    console.log('Reply: ' + r3);
    const r4 = await client.hSet('ALX', 'Bogota', '20');      console.log('Reply: ' + r4);
    const r5 = await client.hSet('ALX', 'Cali', '40');        console.log('Reply: ' + r5);
    const r6 = await client.hSet('ALX', 'Paris', '2');        console.log('Reply: ' + r6);

    // Fetch and display the whole hash
    const obj = await client.hGetAll('ALX');
    console.log(obj);

    // If you want the script to exit automatically after printing, uncomment:
    // await client.quit();
  } catch (err) {
    // Keep same error message style you saw earlier
    console.log(`Redis client not connected to the server: ${err}`);
  }
})();

