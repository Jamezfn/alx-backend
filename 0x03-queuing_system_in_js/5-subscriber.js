import redis from 'redis';

const subscriber = redis.createClient();

subscriber.on('connect', () => {
	console.log('Redis client connected to the server');
});

subscriber.on('error', (err) => {
	console.log(`Redis client not connected to the server: ${err}`);
});

(async () =>{
	await subscriber.connect();

	await subscriber.subscribe('ALXchannel', async (message) => {
		console.log(message);
	
		if (message === 'KILL_SERVER') {
			await subscriber.unsubscribe('ALXchannel');
			await subscriber.quit();
		}
	});

	// await subscriber.quit();
})();
