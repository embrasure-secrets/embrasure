import { DataTypes } from 'sequelize';
import client from './dbClient.js';

const Secrets = client.define('Secrets', {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'secret key is required' },
        },
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'secret value is required' },
        },
    },
});

const createTable = async () => {
    try {
        //https://sequelize.org/docs/v7/models/model-synchronization/
        //Creates the secrets table if it doesn't exist
        //and does nothing if the table exists
        await client.sync();
        // console.log('Secrets table is ready!');
    } catch (error) {
        console.error('Error in creating table: ', error);
    }
};

await createTable();

export default Secrets;
