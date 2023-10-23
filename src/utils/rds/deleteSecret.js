import Secrets from './model.js';

/*
Given a secretKey of type string, 
the deleteSecret function will delete
one record in the secrets table that
has the value in the key column that matches
the secretKey argument
*/

async function deleteSecret(secretKey) {
    try {
        const numberOfRecordsDeleted = await Secrets.destroy({
            where: {
                key: secretKey,
            },
            limit: 1,
        });
        return numberOfRecordsDeleted;
        // always returns 1
    } catch (error) {
        console.error('Error in deleting secret: ', error);
    }
}

// deleteSecret('google');
// deleteSecret("mongodb");
// deleteSecret("aws");
// deleteSecret("uber");

export default deleteSecret;
