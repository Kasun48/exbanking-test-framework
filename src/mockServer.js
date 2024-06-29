const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = {};

app.post('/create_user', (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users[username] = { balance: 0 };
    return res.status(201).json({ message: 'User created' });
});

app.post('/deposit', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    users[username].balance += amount;
    return res.status(200).json({ message: 'Deposit successful' });
});

app.post('/withdraw', (req, res) => {
    const { username, amount } = req.body;
    if (!users[username]) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    if (users[username].balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    users[username].balance -= amount;
    return res.status(200).json({ message: 'Withdrawal successful' });
});

app.get('/get_balance', (req, res) => {
    const { username } = req.query;
    if (!users[username]) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    return res.status(200).json({ balance: users[username].balance });
});

app.post('/send', (req, res) => {
    const { from, to, amount } = req.body;
    if (!users[from] || !users[to]) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    if (users[from].balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    users[from].balance -= amount;
    users[to].balance += amount;
    return res.status(200).json({ message: 'Transfer successful' });
});

app.listen(3000, () => {
    console.log('Mock server running on http://localhost:3000');
});
