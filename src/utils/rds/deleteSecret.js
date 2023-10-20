import Secrets from './model.js';

/*
Given a secretKey of type string, 
the deleteSecret function will delete
all records in the secrets table that
have a value in the key column that matches
the secretKey argument
*/

async function deleteSecret(secretKey) {
    try {
        const numberOfRecordsDeleted = await Secrets.destroy({
            where: {
                key: secretKey,
            },
        });
        console.log(
            `Successfully deleted ${numberOfRecordsDeleted} records from the secrets table`
        );
    } catch (error) {
        console.error('Error in deleting secret: ', error);
    }
}

// deleteSecret('google');
// deleteSecret("mongodb");
// deleteSecret("aws");
// deleteSecret("uber");

export default deleteSecret;
