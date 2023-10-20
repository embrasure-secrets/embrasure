import Secrets from './model.js';

/*
Given a secretKey of type string, 
the getSecret function will return an array
of all records from the secrets database
that have a value in the key column that
matches the value of the secretKey
*/

async function getSecret(secretKey) {
    try {
        const secret = await Secrets.findAll({
            where: {
                key: secretKey,
            },
        });

        console.log('secret is: ', secret);

        return secret;
    } catch (error) {
        console.error('Error in getting all secrets: ', error);
    }
}

// getSecret("spotify");

export default getSecret;
