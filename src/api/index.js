import express from 'express';
// loadEnv should be probably moved to root directory
import cors from 'cors';
import '../utils/rds/loadEnv.js';

import getAllSecrets from '../utils/rds/getAllSecrets.js';
import getSecret from '../utils/rds/getSecret.js';
import deleteSecret from '../utils/rds/deleteSecret.js';
import updateSecret from '../utils/rds/updateSecret.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/allSecrets', async (req, res) => {
    const secrets = await getAllSecrets();
    res.json(secrets);
});

app.get('/secret', async (req, res) => {
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

app.delete('/secret', async (req, res) => {
    try {
        const secretName = req.query.name;
        /* 
        deleteSecret returns 1 if a secret was found and deleted, 0 otherwise
        */
        const secretDeleted = !!(await deleteSecret(secretName));
        if (!secretDeleted) {
            throw new Error('Secret could not be deleted or was not found.');
        }
        res.status(204).json({});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/*
https://sequelize.org/docs/v7/querying/update/#updating-a-row-using-modelupdate
According to this link, `Model#update` only updates the fields that you specify, so it's more appropriate to use `PATCH` than `PUT`.

Secret name is sent through URL-encoded query params.
Secret value is sent in JSON request body.
*/
app.patch('/secret', async (req, res) => {
    try {
        const secretName = req.query.name;
        const secretValue = req.body.value;
        const secretUpdated = !!(await updateSecret(secretName, secretValue));

        if (!secretUpdated) {
            throw new Error('Secret could not be updated or was not found.');
        }
        // returns no content
        res.status(204).json({});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.listen(process.env.API_PORT, () => {
    console.log(`Embrasure server running on port ${process.env.API_PORT}`);
});
