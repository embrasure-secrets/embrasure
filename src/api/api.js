import axios from 'axios';
import '../../loadEnv.js';
import generateDBAuthToken from '../aws/utils/generateDBAuthToken.js';
import isUserInGroup from '../aws/utils/isUserInGroup.js';
import getRegion from '../aws/utils/getRegion.js';
import getUsername from '../aws/utils/getUsername.js';

const ENDPOINT = process.env.API_ENDPOINT;
const REGION = await getRegion();
const IAM_USERNAME = await getUsername();

// hard-coded for now
const headers = {
    'db-username': process.env.DB_USER,
    'db-auth-token': process.env.DB_USER_PASSWORD,
    'db-name': process.env.DATABASE_NAME,
    'db-host': process.env.DB_HOST,
    'db-port': process.env.DB_PORT,
};

const NON_ADMIN_GROUP = 'embrasure-developer';

const isNonAdmin = await isUserInGroup(IAM_USERNAME, NON_ADMIN_GROUP);

if (isNonAdmin) {
    headers['db-auth-token'] = await generateDBAuthToken(
        REGION,
        headers['db-host'],
        headers['db-port'],
        IAM_USERNAME
    );
    headers['db-username'] = IAM_USERNAME;
}

export const getAllSecrets = async () => {
    const { data: secrets } = await axios.get(`${ENDPOINT}/secrets`, {
        headers,
    });
    return secrets;
};

// admin only
export const getAllUsers = async () => {
    if (isNonAdmin) return 'Access denied.';

    const { data: users } = await axios.get(`${ENDPOINT}/users`, { headers });
    return users;
};

// admin only
export const getAllLogs = async () => {
    if (isNonAdmin) return 'Access denied.';

    const { data: logs } = await axios.get(`${ENDPOINT}/logs`, { headers });
    return logs;
};

export const getSecret = async (key) => {
    const { data: secret } = await axios.get(`${ENDPOINT}/secrets/${key}`, {
        headers,
    });

    return secret;
};

export const deleteSecret = async (key) => {
    const { data: secretsDeleted } = await axios.delete(`${ENDPOINT}/secrets/${key}`, {
        headers,
    });
    return secretsDeleted;
};

export const updateSecret = async (key, value) => {
    const { data: secretsUpdated } = await axios.patch(
        `${ENDPOINT}/secrets/${key}`,
        {
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

// admin only
export const addUser = async (username, hasWritePermissions) => {
    if (isNonAdmin) return 'Access denied.';

    const { data: usersCreated } = await axios.post(
        `${ENDPOINT}/users`,
        { username, hasWritePermissions },
        { headers }
    );
    return usersCreated;
};

export const showPermissions = async (username) => {
    const { data: permissions } = await axios.get(`${ENDPOINT}/users/${username}`, { headers });
    return permissions;
};

// admin only
export const editPermission = async (username, setWritePermissionTo) => {
    if (isNonAdmin) return 'Access denied.';

    const { data: writePermission } = await axios.put(
        `${ENDPOINT}/users/:username`,
        { username, setWritePermissionTo },
        { headers }
    );
    return writePermission;
};

// admin only
export const deleteUser = async (username) => {
    if (isNonAdmin) return 'Access denied.';

    const { data: usersDeleted } = await axios.delete(`${ENDPOINT}/users/${username}`, { headers });
    return usersDeleted;
};
