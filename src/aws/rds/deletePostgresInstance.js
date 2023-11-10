import { RDSClient, DeleteDBInstanceCommand } from '@aws-sdk/client-rds';
import waitForRdsSpinDown from './waitForRdsSpinDown.js';

// Create an RDS client
const client = new RDSClient();
async function deletePostgresInstance() {
    // Specify the RDS instance identifier you want to delete
    const instanceIdentifier = 'embrasure-database-v2';

    // Create the delete command
    const deleteCommand = new DeleteDBInstanceCommand({
        DBInstanceIdentifier: instanceIdentifier,
        SkipFinalSnapshot: true, // Set to true if you don't want a final DB snapshot
    });

    // Execute the delete command
    try {
        const response = await client.send(deleteCommand);
        console.log('RDS deletion initiated, This may take up to 10 minutes. Response:', response);

        // Poll for the status of the deletion
        await waitForRdsSpinDown();

        console.log('RDS Deletion Complete!');
    } catch (error) {
        console.error('Error deleting RDS instance:', error);
    }
}

export default deletePostgresInstance;
