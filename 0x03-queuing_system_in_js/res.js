import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Explicit connect for v4
client.connect().then(() => {
  // Preset 'ALX' if needed
  // client.set('ALX', 'School').then((reply) => console.log('Reply: ' + reply));

  displaySchoolValue('ALX');
  setNewSchool('ALXSanFrancisco', '100');
  displaySchoolValue('ALXSanFrancisco');
}).catch((err) => {
  console.error('Connection failed:', err);
});

function displaySchoolValue(schoolName) {
  client.get(schoolName).then((reply) => {
    console.log(reply);
  }).catch((err) => {
    console.error(err);
  });
}

function setNewSchool(schoolName, value) {
  client.set(schoolName, value).then((reply) => {
    console.log('Reply: ' + reply);  // Manually print 'Reply: OK'
  }).catch((err) => {
    console.error(err);
  });
}
