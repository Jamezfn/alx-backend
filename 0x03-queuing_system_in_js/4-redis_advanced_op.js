import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
	console.log('Redis client connected to the server');
});

client.on('error', (err) => {
	console.log(`Redis client not connected to the server: ${err}`);
});

(async () => {
	await client.connect();
	

	const r1 = await client.hSet('ALX', 'Portland', '50');
	console.log('Reply: ' + r1);
	const r2 = await client.hSet('ALX', 'Seattle', '80');
	console.log('Reply: ' + r2);
	const r3 = await client.hSet('ALX', 'New York', '20');
	console.log('Reply: ' + r3);
    	const r4 = await client.hSet('ALX', 'Bogota', '20');
	console.log('Reply: ' + r4);
	const r5 = await client.hSet('ALX', 'Cali', '40');
	console.log('Reply: ' + r5);
	const r6 = await client.hSet('ALX', 'Paris', '2');
	console.log('Reply: ' + r6);

	const obj = await client.hGetAll('ALX');
	console.log(obj);
})();
