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

app.get('/list_products/:itemId', async (req, res) => {
	const itemId = parseInt(req.params.itemId, 10);
	const item = getItemById(itemId);

	if (!item) {
		return res.json({ status: 'Product not found' });
	}

	const currentStock = await getCurrentReservedStockById(itemId);
	const stock = currentStock !== null ? currentStock : item.stock;

	res.json({
		itemId: item.id,
		itemName: item.name,
		price: item.price,
		initialAvailableQuantity: item.stock,
		currentQuantity: stock
	});
});

app.get('/reserve_product/:itemId', async (req, res) => {
	const itemId = parseInt(req.params.itemId, 10);
	const item = getItemById(itemId);

	if (!item) {
                return res.json({ status: 'Product not found' });
        }

	let currentStock = await getCurrentReservedStockById(itemId);
        if (currentStock === null) {
		currentStock = item.stock;
		await reserveStockById(itemId, currentStock);
	}

	if (currentStock === 0) {
		return res.json({ status: 'Not enough stock available', itemId });
	}

	await reserveStockById(itemId, currentStock - 1);
	res.json({ status: 'Reservation confirmed', itemId });
});

(async () => {
        await client.connect();
	app.listen(port, () => {
		console.log(`API available on localhost port ${port}`);
	});
})();
