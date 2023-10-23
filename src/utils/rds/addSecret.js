import Secrets from './model.js';

/*
Given a key and value both of type string, 
the addSecret function will insert a new record
into the Secrets database
*/

async function addSecret(secretKey, secretValue) {
    try {
        // returns raw data of newly created secret
        // includes metadata and other fields
        const newSecretData = await Secrets.create({
            key: secretKey,
            value: secretValue,
        });

        const secretFormatted = {
            key: newSecretData.dataValues.key,
            value: newSecretData.dataValues.value,
        };
        return secretFormatted;
        // { key: 'exampleKey1', value: 'exampleValue1' }
    } catch (error) {
        console.error('Error in creating a new record: ', error);
    }
}

export default addSecret;
