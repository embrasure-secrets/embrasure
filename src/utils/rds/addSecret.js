import Secrets from './model.js';

/*
Given a key and value both of type string, 
the addSecret function will insert a new record
into the Secrets database
*/

async function addSecret(secretKey, secretValue) {
    try {
        const newSecret = await Secrets.create({
            key: secretKey,
            value: secretValue,
        });
        console.log('New secret inserted into db: ', newSecret);
    } catch (error) {
        console.error('Error in creating a new record: ', error);
    }
}

// addSecret('google', 's@#$@634s342');
// addSecret("uber", "s@#$@634s342");
// addSecret("twitter", "s@#$@3sdfs342");
// addSecret("aws", "s@ss342");
// addSecret("port", "4342");
// addSecret("mongodb", "slfjsldf4342");

export default addSecret;
