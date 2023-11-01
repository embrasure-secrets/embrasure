import axios from 'axios';
import './loadEnv.js';

const ENDPOINT = process.env.API_ENDPOINT;
// hard-coded for now
const headers = {
    'db-username': process.env.DB_USER,
    'db-auth-token': process.env.DB_USER_PASSWORD,
    'db-name': process.env.DATABASE_NAME,
    'db-host': process.env.DB_HOST,
    'db-port': process.env.DB_PORT,
};

export const getAllSecrets = async () => {
    const { data: secrets } = await axios.get(`${ENDPOINT}/secrets`, {
        headers,
    });
    return secrets;
};

export const getAllUsers = async () => {
    const { data: users } = await axios.get(`${ENDPOINT}/users`, { headers });
    return users;
};

export const getSecret = async (key) => {
    const { data: secret } = await axios.get(`${ENDPOINT}/secret`, { params: { key }, headers });

    return secret;
};

export const deleteSecret = async (key) => {
    const { data: secretsDeleted } = await axios.delete(`${ENDPOINT}/secret`, {
        data: { key },
        headers,
    });
    return secretsDeleted;
};

export const updateSecret = async (key, value) => {
    const { data: secretsUpdated } = await axios.patch(
        `${ENDPOINT}/secret`,
        {
            key,
            value,
        },
        { headers }
    );
    return secretsUpdated;
};

export const addSecret = async (key, value) => {
    const { data: newSecret } = await axios.post(
        `${ENDPOINT}/secrets`,
        { key, value },
        { headers }
    );
    return newSecret;
};

export const addUser = async (username) => {
    const { data: usersCreated } = await axios.post(`${ENDPOINT}/users`, { username }, { headers });
    return usersCreated;
};
