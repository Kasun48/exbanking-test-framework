const axios = require('axios');
const { performance } = require('perf_hooks');

describe('Performance Tests', () => {
    beforeEach(async () => {
        // Ensure the user exists before running the test
        try {
            await axios.post('http://localhost:3000/create_user', { username: 'testuser' });
        } catch (error) {
            // Ignore if the user already exists
        }
    });

    it('should measure response time for deposit', async () => {
        const url = 'http://localhost:3000/deposit';
        const requestBody = {
            username: 'testuser',
            amount: 100
        };

        let totalResponseTime = 0;
        const iterations = 100;

        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            await axios.post(url, requestBody);
            const endTime = performance.now();
            totalResponseTime += (endTime - startTime);
        }

        const averageResponseTime = totalResponseTime / iterations;
        console.log(`Average Response Time: ${averageResponseTime} ms`);
        expect(averageResponseTime).toBeLessThan(200); // Example threshold
    });
});
