import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
	console.log('Redis client connected to the server');
});

client.on('error', (err) => {
	console.log(`Redis client not connected to the server: ${err}`);
});

client.connect()
	.then(() => {
		displaySchoolValue('ALX');
		setNewSchool('ALXSanFrancisco', '100');
		displaySchoolValue('ALXSanFrancisco');
	});

function setNewSchool(schoolName, value) {
	client.set(schoolName, value)
		.then((reply) => {
			console.log('Reply: ' + reply);
		});
}

async function displaySchoolValue(schoolName) {
	const reply = await client.get(schoolName);
	console.log(reply);
}
