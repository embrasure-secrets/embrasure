import Secrets from './model.js';

/*
getAllSecrets function will display
all secrets in the Secrets table
*/

async function getAllSecrets() {
    try {
        const allSecrets = await Secrets.findAll();
        const secretsFormatted = allSecrets.map((secretObj) => {
            return {
                ...secretObj.dataValues,
            };
        });
        // console.log(secretsFormatted);
        return secretsFormatted;
    } catch (error) {
        console.error('Error in getting all secrets: ', error);
    }
}

// getAllSecrets();

export default getAllSecrets;
