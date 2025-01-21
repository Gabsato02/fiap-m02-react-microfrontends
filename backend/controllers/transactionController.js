const dbService = require('../services/dbService');

// Listar Transações
const listTransactions = (req, res) => {
	const db = dbService.readDB();
	const userTransactions =
		db.transactions?.filter((t) => t.userId === req.user.id) || [];

	// Obter os parâmetros de paginação
	const { page, size } = req.query;

	if (page && size) {
		const pageNumber = parseInt(page, 10);
		const pageSize = parseInt(size, 10);

		// Validar paginação
		if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
			return res.status(400).json({ error: 'Parâmetros de paginação inválidos.' });
		}

		// Calcular o índice inicial e final
		const startIndex = (pageNumber - 1) * pageSize;
		const endIndex = startIndex + pageSize;

		// Retornar a página específica
		const paginatedTransactions = userTransactions.slice(startIndex, endIndex);

		return res.json({
			transactions: paginatedTransactions,
			total: userTransactions.length,
			page: pageNumber,
			size: pageSize,
		});
	}

	// Se não houver paginação, retornar todas as transações
	res.json({ transactions: userTransactions, total: userTransactions.length });
};


// Criar Transação
const createTransaction = (req, res) => {
	const { description, amount, type } = req.body;
	const db = dbService.readDB();

	// Validação
	if (!description || !amount || !type) {
		return res.status(400).json({
			error: 'Dados inválidos. A transação deve ter descrição, valor e tipo.',
		});
	}

	const newTransaction = {
		id: Date.now(),
		userId: req.user.id,
		description,
		amount,
		type,
		date: new Date().toISOString(),
	};

	db.transactions.push(newTransaction);

	const userIndex = db.users.findIndex(({ id }) => id == req.user.id);
	
	const newBalance = db.users[userIndex].balance + amount;
	console.log(userIndex, newBalance, db.users);
	db.users[userIndex].balance = newBalance;

	db.users[userIndex]?.history.push(newBalance);

	dbService.writeDB(db);
	res.status(201).json(newTransaction);
};

// Atualizar Transação
const updateTransaction = (req, res) => {
	const { id } = req.params;
	const { description } = req.body;
	const db = dbService.readDB();

	const transactionIndex = db.transactions.findIndex(
		(t) => t.id === parseInt(id) && t.userId === req.user.id
	);

	if (transactionIndex === -1) {
		return res.status(404).json({ error: 'Transação não encontrada' });
	}

	const updatedTransaction = {
		...db.transactions[transactionIndex],
		...(description && { description }),
	};

	db.transactions[transactionIndex] = updatedTransaction;

	dbService.writeDB(db);

	res.json(updatedTransaction);
};

module.exports = { listTransactions, createTransaction, updateTransaction };
