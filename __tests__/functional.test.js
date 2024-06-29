const request = require('supertest');
const app = require('../src/app');

describe('Functional Tests', () => {
    beforeEach(async () => {
        // Reset state before each test
        await request(app).post('/create_user').send({ username: 'testuser' });
        await request(app).post('/deposit').send({ username: 'testuser', amount: 0 }); // Reset balance
    });

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/create_user')
            .send({ username: 'newuser' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created');
    });

    it('should not create a user that already exists', async () => {
        await request(app).post('/create_user').send({ username: 'testuser' });
        const response = await request(app)
            .post('/create_user')
            .send({ username: 'testuser' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('should deposit money into user account', async () => {
        const response = await request(app)
            .post('/deposit')
            .send({ username: 'testuser', amount: 100 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Deposit successful');
    });

    it('should withdraw money from user account', async () => {
        await request(app).post('/deposit').send({ username: 'testuser', amount: 100 });
        const response = await request(app)
            .post('/withdraw')
            .send({ username: 'testuser', amount: 50 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Withdrawal successful');
    });

    it('should get user balance', async () => {
        await request(app).post('/deposit').send({ username: 'testuser', amount: 100 });
        const response = await request(app)
            .get('/get_balance')
            .query({ username: 'testuser' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('balance', 250);
    });

    it('should transfer money between users', async () => {
        await request(app).post('/create_user').send({ username: 'sender' });
        await request(app).post('/create_user').send({ username: 'receiver' });
        await request(app).post('/deposit').send({ username: 'sender', amount: 100 });
        const response = await request(app)
            .post('/send')
            .send({ from: 'sender', to: 'receiver', amount: 50 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Transfer successful');

        const senderBalance = await request(app)
            .get('/get_balance')
            .query({ username: 'sender' });
        const receiverBalance = await request(app)
            .get('/get_balance')
            .query({ username: 'receiver' });

        expect(senderBalance.body).toHaveProperty('balance', 50);
        expect(receiverBalance.body).toHaveProperty('balance', 50);
    });
});
