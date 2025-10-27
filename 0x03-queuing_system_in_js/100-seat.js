import express from 'express';
import redis from 'redis';
import kue from 'kue';

const app = express();
const port = 1245;

const client = redis.createClient();
const queue = kue.createQueue();

client.on('connect', () => {
        console.log('Redis client connected to the server');
});

client.on('error', (err) => {
        console.log(`Redis client not connected to the server: ${err}`);
});

async function reserveSeat(number) {
	await client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
	const seats = await client.get('available_seats')
	return seats !== null ? parseInt(seats, 10) : 0;
}

async function initializeSeats() {
	await reserveSeat(50);
}

let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
	const numberOfAvailableSeats = await getCurrentAvailableSeats();
	res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

app.get('/reserve_seat', async (req, res) => {
	if (!reservationEnabled) {
		return res.json({ status: 'Reservation are blocked' });
	}

	const job = queue.create('reserve_seat').save((err) => {
		if (err) {
			return res.json({ status: 'Reservation failed' });
		}
		res.json({ status: 'Reservation in process' });
	});

	job.on('complete', () => {
		console.log(`Seat reservation job ${job.id} completed`);
	});

	job.on('failed', (err) => {
		console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
	});
});

app.get('/process', async (req, res) => {
	res.json({ status: 'Queue processing' });

	queue.process('reserve_seat', async (job, done) => {
		let availableSeats = await getCurrentAvailableSeats();
		if (availableSeats <= 0) {
			reservationEnabled = false;
			return done(new Error('Not enough seats available'));
		}
		
		availableSeats -= 1;
		await reserveSeat(availableSeats);

		if (availableSeats === 0) {
			reservationEnabled = false;}
		done();
	});
});

(async () => {
        await client.connect();
	await initializeSeats();
        app.listen(port, () => {
                console.log(`API available on localhost port ${port}`);
        });
})();

