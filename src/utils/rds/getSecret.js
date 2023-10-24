import Secrets from './model.js';

/*
Given a secretKey of type string, 
the getSecret function will return an object from the secrets 
database that has the value in the key column that
matches the value of the secretKey
*/

async function getSecret(secretKey) {
    try {
        // object with raw data for secret including metadata
        //   and unneeded fields
        const rawSecretData = await Secrets.findOne({
            where: {
                key: secretKey,
            },
        });

        const secretFormatted = {
            key: rawSecretData.dataValues.key,
            value: rawSecretData.dataValues.value,
        };
        return secretFormatted;
        // { key: 'exampleKey1', value: 'exampleValue1' }
    } catch (error) {
        console.error('Error in getting all secrets: ', error);
    }
}

// getSecret("spotify");

export default getSecret;
