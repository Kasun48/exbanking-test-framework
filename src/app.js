const express = require('express');
const app = express();
app.use(express.json());

const users = {};

/**
 * Create a new user
 * @route POST /create_user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post('/create_user', (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        return res.status(400).send({ error: 'User already exists' });
    }
    users[username] = { balance: 0 };
    res.status(201).send({ message: 'User created' });
});

/**
 * Deposit money into user's account
 * @route POST /deposit
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post('/deposit', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(404).send({ error: 'User not found' });
    }
    users[username].balance += amount;
    res.status(200).send({ message: 'Deposit successful' });
});

/**
 * Withdraw money from user's account
 * @route POST /withdraw
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post('/withdraw', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(404).send({ error: 'User not found' });
    }
    if (users[username].balance < amount) {
        return res.status(400).send({ error: 'Insufficient balance' });
    }
    users[username].balance -= amount;
    res.status(200).send({ message: 'Withdrawal successful' });
});

/**
 * Get user's balance
 * @route GET /get_balance
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.get('/get_balance', (req, res) => {
    const { username } = req.query;
    if (!users[username]) {
        return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ balance: users[username].balance });
});

/**
 * Send money from one user to another
 * @route POST /send
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post('/send', (req, res) => {
    const { from, to, amount } = req.body;
    if (!users[from] || !users[to]) {
        return res.status(404).send({ error: 'User not found' });
    }
    if (users[from].balance < amount) {
        return res.status(400).send({ error: 'Insufficient balance' });
    }
    users[from].balance -= amount;
    users[to].balance += amount;
    res.status(200).send({ message: 'Transfer successful' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


module.exports = app;
