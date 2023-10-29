import axios from 'axios';
import './utils/rds/loadEnv.js';

const ENDPOINT = process.env.API_ENDPOINT;

export const getAllSecrets = async () => {
    const { data: secrets } = await axios.get(`${ENDPOINT}/secrets`);
    return secrets;
};

export const getSecret = async (key) => {
    const { data: secret } = await axios.get(`${ENDPOINT}/secret`, { params: { key } });

    return secret;
};

export const deleteSecret = async (key) => {
    const { data: secretsDeleted } = await axios.delete(`${ENDPOINT}/secret`, { data: { key } });
    return secretsDeleted;
};

export const updateSecret = async (key, value) => {
    const { data: secretsUpdated } = await axios.patch(`${ENDPOINT}/secret`, {
        key,
        value,
    });
    return secretsUpdated;
};

export const addSecret = async (key, value) => {
    const { data: newSecret } = await axios.post(`${ENDPOINT}/secrets`, { key, value });
    return newSecret;
};
