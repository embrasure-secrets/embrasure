import Secrets from './model.js';

/*
Given a secretKey and newSecretValue of type string, 
the updateSecret function will update
all records in the secrets database
that have a value in the key column
and update the data in the value column
to the value of newSecretValue
*/

async function updateSecret(secretKey, newSecretValue) {
    try {
        const numberOfRecordsUpdated = await Secrets.update(
            { value: newSecretValue },
            {
                where: {
                    key: secretKey,
                },
            }
        );

        console.log(`Successfully updated ${numberOfRecordsUpdated} record in the secrets table`);
    } catch (error) {
        console.error('Error in updating record: ', error);
    }
}

// updateSecret("port", "3001");

export default updateSecret;
