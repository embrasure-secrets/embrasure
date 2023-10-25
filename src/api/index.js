import express from 'express';
// loadEnv should be probably moved to root directory
import cors from 'cors';
import '../utils/rds/loadEnv.js';

import getAllSecrets from '../utils/rds/getAllSecrets.js';
import getSecret from '../utils/rds/getSecret.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/allSecrets', async (req, res) => {
    const secrets = await getAllSecrets();
    res.json(secrets);
});

app.get('/secret/', async (req, res) => {
    try {
        const secretName = req.query.name;
        // getSecret doesn't throw an error
        const secret = await getSecret(secretName);
        if (secret === undefined) {
            throw new Error('Secret not found');
        }
        res.json(secret);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
app.listen(process.env.API_PORT, () => {
    console.log(`Embrasure server running on port ${process.env.API_PORT}`);
});
