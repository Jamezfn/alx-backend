import express from 'express';
import redis from 'redis';

const app = express();
const port = 1245;

const listProducts = [
	{ id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
	{ id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
	{ id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
	{ id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

const client = redis.createClient();

client.on('connect', () => {
	console.log('Redis client connected to the server');
});

client.on('error', (err) => {
	console.log(`Redis client not connected to the server: ${err}`);
});

function getItemById(id) {
	return listProducts.find((p) => p.id === id);
}

async function reserveStockById(itemId, stock) {
	const key = `item.${itemId}`;

	await client.set(key, stock);
}

async function getCurrentReservedStockById(itemId) {
	const key = `item.${itemId}`;

	const stock = await client.get(key);
	return stock !== null ? parseInt(stock, 10) : null;
}

app.get('/list_products', (req, res) => {
	const out = listProducts.map((p) => ({
		itemId: p.id,
		itemName: p.name,
		price: p.price,
		initialAvailableQuantity: p.stock,
	}));

	return res.json(out);
});

app.get('/list_products/:itemId', async () => {
});

(async () => {
        await client.connect();
	app.listen(port, () => {
		console.log(`API available on localhost port ${port}`);
	});
})();
