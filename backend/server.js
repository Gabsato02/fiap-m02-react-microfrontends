const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 9004;
const DB_PATH = path.resolve(__dirname, 'db.json');
const SECRET_KEY = 'JWT_SECRET_KEY';

// Middleware
app.use(bodyParser.json());

// FUNÇÕES AUXILIARES
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

const writeDB = (data) =>
	fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const generateToken = ({ id, username, email }) => {
	return jwt.sign({ id, username, email }, SECRET_KEY, {
		expiresIn: '5d',
	});
};

const getUserFromToken = (token) => {
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		return decoded;
	} catch (err) {
		return null;
	}
};

const authenticate = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')[1]; // Assumindo que o token vem no formato "Bearer <token>"

	if (!token) {
		return res.status(401).json({ error: 'Token não fornecido' });
	}

	const decodedUser = getUserFromToken(token);

	if (!decodedUser) {
		return res.status(401).json({ error: 'Token inválido ou expirado' });
	}

	// Adicionar o usuário autenticado no request para as próximas rotas
	req.user = decodedUser;
	next();
};

// ROTAS

// CREATE USER
app.post('/user', (req, res) => {
	const db = readDB();

	const newUser = { id: Date.now(), ...req.body, balance: 0 };

	db.users.push(newUser);

	writeDB(db);

	res.status(201).json(newUser);
});

// LOGIN
app.post('/login', (req, res) => {
	const { email, password } = req.body;

	const db = readDB();

	const user = db.users.find(
		(u) => u.email === email && u.password === password
	);

	if (!user) {
		return res.status(401).json({ error: 'Credenciais inválidas' });
	}

	const token = generateToken(user);

	res.json({ token });
});

app.get('/user', authenticate, (req, res) => {
	const db = readDB();

	const user = db.users.find((u) => u.id === decodedUser.id);

	if (!user) {
		return res.status(404).json({ error: 'Usuário não encontrado' });
	}

	const { password, ...userInfo } = user;
	res.json(userInfo);
});



// Rota de listagem de transações (GET)
app.get('/transactions', authenticate, (req, res) => {
	const db = readDB();
	const userTransactions = db.transactions?.filter(
		(t) => t.userId === req.user.id
	) || [];
	res.json(userTransactions);
});

// Rota de criação de transação (POST)
app.post('/transactions', authenticate, (req, res) => {
	const { description, amount, type } = req.body;
	const db = readDB();

	// Validação dos dados da transação
	if (!description || !amount || !type) {
		return res
			.status(400)
			.json({
				error: 'Dados inválidos. A transação deve ter descrição, valor e tipo.',
			});
	}

	const newTransaction = {
		id: Date.now(),
		userId: req.user.id, // Associando a transação ao usuário autenticado
		description,
		amount,
		type,
		date: new Date().toISOString(),
	};

	db.transactions.push(newTransaction);
	writeDB(db);
	res.status(201).json(newTransaction);
});

// Rota de atualização de transação (PUT)
app.put('/transactions/:id', authenticate, (req, res) => {
	const { id } = req.params;
	const { description } = req.body;
	const db = readDB();

	// Procurar transação
	const transactionIndex = db.transactions.findIndex(
		(t) => t.id === parseInt(id) && t.userId === req.user.id
	);

	if (transactionIndex === -1) {
		return res.status(404).json({ error: 'Transação não encontrada' });
	}

	// Atualizar transação
	const updatedTransaction = {
		...db.transactions[transactionIndex],
		...(description && { description }),
	};
	db.transactions[transactionIndex] = updatedTransaction;
	writeDB(db);

	res.json(updatedTransaction);
});

// Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://luizin.duckdns.org:${PORT}`);
});
