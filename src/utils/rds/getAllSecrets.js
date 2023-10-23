import Secrets from './model.js';

/*
getAllSecrets function will display
all secrets in the Secrets table
*/

async function getAllSecrets() {
    try {
        // array with raw secret data for each secret
        // includes metadata and unneeded columns
        const allSecrets = await Secrets.findAll();
        const secretsFormatted = allSecrets.map((rawSecretData) => {
            const secretObj = rawSecretData.dataValues;
            return { key: secretObj.key, value: secretObj.value };
        });
        return secretsFormatted;
        // [
        //   { key: 'exampleKey1', value: 'exampleValue1' },
        //   { key: 'exampleKey2', value: 'exampleValue2' },
        // ]
    } catch (error) {
        console.error('Error getting all secrets: ', error);
    }
}

// getAllSecrets();

export default getAllSecrets;
