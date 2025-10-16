import { createClient } from 'redis';

(async () => {
  console.log('Creating Redis client...');
  
  const client = createClient();  // Default: redis://localhost:6379

  // Event: Success
  client.on('connect', () => {
    console.log('Redis client connected to the server');
  });

  // Event: Any error (connection fail, etc.)
  client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
  });

  // Extra diagnostics
  client.on('ready', () => {
    console.log('Redis client is fully ready (e.g., after auth if any)');
  });

  client.on('end', () => {
    console.log('Redis connection ended');
  });

  client.on('reconnecting', (info) => {
    console.log(`Reconnecting... attempt ${info.attempt}, delay ${info.delay}ms`);
  });

  try {
    if (client.isOpen) {
      console.log('Socket already open - skipping connect()');
    } else {
      console.log('Attempting explicit connect...');
      await client.connect();  // This should now succeed or fail with event logs
    }

    // Test the connection with a ping
    console.log('Pinging Redis...');
    const pong = await client.ping();
    console.log(`Ping response: ${pong}`);

    // Keep alive briefly for events, then quit
    setTimeout(async () => {
      console.log('Quitting client...');
      await client.quit();
      process.exit(0);
    }, 5000);
  } catch (err) {
    console.log(`Caught error in try: ${err.message}`);
  }
})();
