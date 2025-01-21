const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');
const transactionController = require('./controllers/transactionController');

const app = express();
const PORT = 9004;

// Middleware
app.use(bodyParser.json());
app.use(cors()); 

// ROTAS
app.post('/user', authController.createUser);
app.post('/login', authController.login);
app.get('/user', authMiddleware.authenticate, authController.getUser);

app.get(
	'/transactions',
	authMiddleware.authenticate,
	transactionController.listTransactions
);

app.post(
	'/transactions',
	authMiddleware.authenticate,
	transactionController.createTransaction
);
app.put(
	'/transactions/:id',
	authMiddleware.authenticate,
	transactionController.updateTransaction
);

// Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando em http://luizin.duckdns.org:${PORT}`);
});
